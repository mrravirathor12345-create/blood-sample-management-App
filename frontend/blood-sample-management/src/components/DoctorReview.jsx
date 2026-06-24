import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../services/apiService';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import './DoctorReview.css';

const DoctorReview = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReport, setSelectedReport] = useState(null);
  const [approvalNotes, setApprovalNotes] = useState('');
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock reference ranges for status determination
  const referenceRanges = {
    'TST00001': { // CBC
      'Hemoglobin': { min: 12.0, max: 16.0, unit: 'g/dL' },
      'RBC Count': { min: 4.0, max: 5.9, unit: 'million/μL' },
      'WBC Count': { min: 4000, max: 11000, unit: '/μL' },
      'Platelet Count': { min: 150000, max: 450000, unit: '/μL' }
    },
    'TST00002': { // Lipid Profile
      'Total Cholesterol': { min: 0, max: 200, unit: 'mg/dL' },
      'LDL Cholesterol': { min: 0, max: 100, unit: 'mg/dL' },
      'HDL Cholesterol': { min: 40, max: 100, unit: 'mg/dL' },
      'Triglycerides': { min: 0, max: 150, unit: 'mg/dL' }
    },
    'TST00003': { // Liver Function
      'ALT (SGPT)': { min: 7, max: 55, unit: 'U/L' },
      'AST (SGOT)': { min: 8, max: 48, unit: 'U/L' },
      'Alkaline Phosphatase': { min: 44, max: 147, unit: 'U/L' },
      'Total Bilirubin': { min: 0.1, max: 1.2, unit: 'mg/dL' }
    },
    'TST00006': { // Blood Glucose
      'Fasting Glucose': { min: 70, max: 100, unit: 'mg/dL' },
      'Random Glucose': { min: 70, max: 140, unit: 'mg/dL' }
    }
  };

  useEffect(() => {
    const fetchReports = async () => {
      try {
        let response;
        if (user?.role === 'Doctor') {
          response = await api.get(`/doctors/reports/${user.id}`);
        } else {
          response = await api.get('/reports');
        }
        
        // Only show reports that are not approved yet
        const pendingReports = response.data.filter(r => !r.isApproved);
        setReports(pendingReports);
      } catch (err) {
        toast.error('Failed to load reports.');
      } finally {
        setLoading(false);
      }
    };
    if (user?.id) {
      fetchReports();
    }
  }, [user]);

  // Map backend reports to local structure
  const mappedReports = reports.map(r => {
    const flagged = [];
    const results = (r.testResults || []).map(tr => {
      const testName = tr.test?.testName || 'Test';
      const testCode = tr.test?.testCode || '';
      
      let params = [];
      if (typeof tr.resultValue === 'object' && tr.resultValue !== null) {
        params = Object.entries(tr.resultValue).map(([name, val]) => {
          const ref = referenceRanges[testCode]?.[name] || { min: 0, max: 100, unit: tr.unit || '' };
          
          let status = 'Normal';
          const numVal = parseFloat(val);
          if (!isNaN(numVal)) {
            if (numVal < ref.min) status = 'Low';
            else if (numVal > ref.max) status = 'High';
          }
          if (status !== 'Normal') {
            flagged.push(name);
          }
          
          return {
            name,
            value: val,
            unit: ref.unit,
            min: ref.min,
            max: ref.max,
            status
          };
        });
      } else {
        let status = tr.status || 'Normal';
        if (status === 'Abnormal' || status === 'Critical') {
          flagged.push(testName);
        }
        params = [{
          name: testName,
          value: tr.resultValue,
          unit: tr.unit || '',
          min: tr.test?.normalRange?.min || 0,
          max: tr.test?.normalRange?.max || 100,
          status
        }];
      }

      return {
        testName,
        parameters: params,
        remarks: tr.remarks || ''
      };
    });

    return {
      _id: r._id,
      id: r.reportId,
      patient: r.patient ? `${r.patient.firstName} ${r.patient.lastName}` : 'Unknown',
      sampleId: r.sample?.sampleId || 'Unknown',
      sampleObjId: r.sample?._id || r.sample,
      collectionDate: r.sample?.collectionDate ? new Date(r.sample.collectionDate).toLocaleDateString() : 'TBD',
      generatedDate: new Date(r.generatedAt || r.createdAt).toLocaleDateString(),
      status: r.isApproved ? 'Approved' : 'Pending Review',
      hasAbnormalities: flagged.length > 0,
      flaggedParameters: flagged,
      testResultsList: results
    };
  });

  const filteredReports = mappedReports.filter(report =>
    report.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.sampleId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleReportSelect = (report) => {
    if (report.status === 'Approved') {
      toast.error('This report has already been approved.');
      return;
    }
    setSelectedReport(report);
    setApprovalNotes('');
  };

  const handleApprove = async () => {
    if (!selectedReport) {
      toast.error('Please select a report first');
      return;
    }
    
    setIsSubmitting(true);

    try {
      await api.patch(`/doctors/reports/${selectedReport._id}/approve`, {
        doctorId: user?.id || null,
        notes: approvalNotes
      });
      
      toast.success(`Report ${selectedReport.id} approved successfully!`);
      
      // Update samples/reports local list
      setReports(prev => prev.filter(r => r._id !== selectedReport._id));
      
      // Reset form
      setSelectedReport(null);
      setApprovalNotes('');
      setSearchTerm('');
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Error approving report';
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!selectedReport) {
      toast.error('Please select a report first');
      return;
    }
    
    setIsSubmitting(true);

    try {
      // Set the sample status back to 'Processing' so the technician can edit it
      if (selectedReport.sampleObjId) {
        await api.patch(`/samples/${selectedReport.sampleObjId}/status`, {
          status: 'Processing'
        });
      }
      
      // Delete the report so a new one can be generated
      await api.delete(`/reports/${selectedReport._id}`);
      
      toast.success(`Report ${selectedReport.id} rejected and sent back to Lab.`);
      
      // Update reports list
      setReports(prev => prev.filter(r => r._id !== selectedReport._id));
      
      // Reset form
      setSelectedReport(null);
      setApprovalNotes('');
      setSearchTerm('');
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Error rejecting report';
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="doctor-review"
    >
      <div className="review-header">
        <h1>Doctor Review</h1>
        <p>Review and approve laboratory test reports</p>
      </div>

      <div className="review-content">
        {/* Reports List Panel */}
        <div className="panel glass-card">
          <h2>Reports Awaiting Review</h2>
          
          <div className="search-box">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Report ID, Patient, or Sample ID"
              className="search-input"
            />
          </div>
          
          <div className="reports-list">
            {filteredReports.length > 0 ? (
              filteredReports.map(report => (
                <div
                  key={report.id}
                  className={`report-item ${selectedReport?.id === report.id ? 'selected' : ''} ${
                    report.status === 'Approved' ? 'approved' : ''
                  }`}
                  onClick={() => handleReportSelect(report)}
                >
                  <div className="report-info">
                    <h3>{report.id}</h3>
                    <p>{report.patient}</p>
                  </div>
                  <div className="report-meta">
                    <span className="sample-id">{report.sampleId}</span>
                    <span className="generated-date">{report.generatedDate}</span>
                  </div>
                  <div className="report-status">
                    <span className={`status-badge ${report.status === 'Approved' ? 'approved' : 'pending'}`}>
                      {report.status}
                    </span>
                    {report.hasAbnormalities && (
                      <span className="abnormal-badge">⚠️ Abnormal</span>
                    )}
                  </div>
                  {report.flaggedParameters.length > 0 && (
                    <div className="flagged-parameters">
                      <span>Flagged: {report.flaggedParameters.join(', ')}</span>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="no-reports">
                <p>No reports found matching your search criteria.</p>
              </div>
            )}
          </div>
        </div>

        {/* Report Review Panel */}
        <div className="panel glass-card">
          <h2>Report Review</h2>
          
          {selectedReport ? (
            <div className="report-review">
              <div className="report-header">
                <h3>Report: {selectedReport.id}</h3>
                <p>Patient: {selectedReport.patient}</p>
                <p>Sample ID: {selectedReport.sampleId}</p>
                <p>Collection Date: {selectedReport.collectionDate}</p>
                <p>Generated Date: {selectedReport.generatedDate}</p>
              </div>
              
              {selectedReport.hasAbnormalities && (
                <div className="abnormal-alert glass-card">
                  <h4>⚠️ Abnormal Results Detected</h4>
                  <p>This report contains abnormal test results that require special attention.</p>
                  {selectedReport.flaggedParameters.length > 0 && (
                    <ul>
                      {selectedReport.flaggedParameters.map((param, index) => (
                        <li key={index}>{param}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
              
              <div className="test-results-section">
                <h4>Test Results</h4>
                
                {selectedReport.testResultsList?.map((test, index) => (
                  <div key={index} className="test-section">
                    <h5>{test.testName}</h5>
                    
                    <div className="parameters-table">
                      <div className="table-header">
                        <div className="header-cell">Parameter</div>
                        <div className="header-cell">Result</div>
                        <div className="header-cell">Reference Range</div>
                        <div className="header-cell">Status</div>
                      </div>
                      
                      {test.parameters.map((param, paramIndex) => (
                        <div key={paramIndex} className="table-row">
                          <div className="cell parameter-name">{param.name}</div>
                          <div className="cell result-value">
                            {param.value} {param.unit}
                          </div>
                          <div className="cell reference-range">
                            {param.min} - {param.max} {param.unit}
                          </div>
                          <div className="cell status-cell">
                            <span className={`status-badge ${param.status.toLowerCase()}`}>
                              {param.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {test.remarks && (
                      <div className="test-remarks">
                        <strong>Remarks:</strong> {test.remarks}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="review-actions">
                <div className="notes-section">
                  <label>Review Notes/Comments</label>
                  <textarea
                    value={approvalNotes}
                    onChange={(e) => setApprovalNotes(e.target.value)}
                    placeholder="Add any notes or comments for this report..."
                    className="notes-input"
                  />
                </div>
                
                <div className="action-buttons">
                  <button onClick={handleReject} className="reject-btn" disabled={isSubmitting}>
                    {isSubmitting ? 'Rejecting...' : 'Request Changes'}
                  </button>
                  <button onClick={handleApprove} className="approve-btn" disabled={isSubmitting}>
                    {isSubmitting ? 'Approving...' : 'Approve Report'}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="no-selection">
              <p>Please select a report to review</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default DoctorReview;