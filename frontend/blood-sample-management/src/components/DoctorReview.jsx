import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './DoctorReview.css';

const DoctorReview = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReport, setSelectedReport] = useState(null);
  const [approvalNotes, setApprovalNotes] = useState('');

  // Mock data for reports awaiting review
  const mockReports = [
    {
      id: 'RPT00000001',
      patient: 'John Doe',
      sampleId: 'SMP00000125',
      collectionDate: '2023-09-15',
      generatedDate: '2023-09-16',
      status: 'Pending Review',
      hasAbnormalities: true,
      flaggedParameters: ['WBC Count', 'Platelet Count']
    },
    {
      id: 'RPT00000002',
      patient: 'Jane Smith',
      sampleId: 'SMP00000124',
      collectionDate: '2023-09-15',
      generatedDate: '2023-09-16',
      status: 'Pending Review',
      hasAbnormalities: false,
      flaggedParameters: []
    },
    {
      id: 'RPT00000003',
      patient: 'Robert Johnson',
      sampleId: 'SMP00000123',
      collectionDate: '2023-09-14',
      generatedDate: '2023-09-15',
      status: 'Approved',
      hasAbnormalities: true,
      flaggedParameters: ['ALT (SGPT)', 'AST (SGOT)']
    }
  ];

  // Mock test results data
  const mockTestResults = {
    'RPT00000001': [
      {
        testName: 'Complete Blood Count (CBC)',
        parameters: [
          { name: 'Hemoglobin', value: 14.2, unit: 'g/dL', min: 12.0, max: 16.0, status: 'Normal' },
          { name: 'RBC Count', value: 4.8, unit: 'million/μL', min: 4.0, max: 5.9, status: 'Normal' },
          { name: 'WBC Count', value: 15000, unit: '/μL', min: 4000, max: 11000, status: 'High' },
          { name: 'Platelet Count', value: 80000, unit: '/μL', min: 150000, max: 450000, status: 'Low' }
        ],
        remarks: 'Elevated WBC count suggests infection. Low platelet count requires monitoring.'
      },
      {
        testName: 'Lipid Profile',
        parameters: [
          { name: 'Total Cholesterol', value: 180, unit: 'mg/dL', min: 0, max: 200, status: 'Normal' },
          { name: 'LDL Cholesterol', value: 100, unit: 'mg/dL', min: 0, max: 100, status: 'Normal' },
          { name: 'HDL Cholesterol', value: 45, unit: 'mg/dL', min: 40, max: 100, status: 'Normal' },
          { name: 'Triglycerides', value: 120, unit: 'mg/dL', min: 0, max: 150, status: 'Normal' }
        ],
        remarks: 'Lipid profile within normal limits.'
      }
    ],
    'RPT00000002': [
      {
        testName: 'Liver Function Test',
        parameters: [
          { name: 'ALT (SGPT)', value: 35, unit: 'U/L', min: 7, max: 55, status: 'Normal' },
          { name: 'AST (SGOT)', value: 30, unit: 'U/L', min: 8, max: 48, status: 'Normal' },
          { name: 'Alkaline Phosphatase', value: 80, unit: 'U/L', min: 44, max: 147, status: 'Normal' },
          { name: 'Total Bilirubin', value: 0.8, unit: 'mg/dL', min: 0.1, max: 1.2, status: 'Normal' }
        ],
        remarks: 'All liver function parameters are within normal range.'
      },
      {
        testName: 'Blood Glucose',
        parameters: [
          { name: 'Fasting Glucose', value: 95, unit: 'mg/dL', min: 70, max: 100, status: 'Normal' }
        ],
        remarks: 'Normal fasting glucose level.'
      }
    ]
  };

  const filteredReports = mockReports.filter(report =>
    report.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.sampleId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleReportSelect = (report) => {
    if (report.status === 'Approved') {
      alert('This report has already been approved.');
      return;
    }
    
    setSelectedReport(report);
    setApprovalNotes('');
  };

  const handleApprove = () => {
    if (!selectedReport) {
      alert('Please select a report first');
      return;
    }
    
    // In a real app, this would send data to the backend
    console.log('Report Approved:', {
      reportId: selectedReport.id,
      notes: approvalNotes
    });
    
    alert(`Report ${selectedReport.id} approved successfully!`);
    
    // Reset form
    setSelectedReport(null);
    setApprovalNotes('');
    setSearchTerm('');
  };

  const handleReject = () => {
    if (!selectedReport) {
      alert('Please select a report first');
      return;
    }
    
    // In a real app, this would send data to the backend
    console.log('Report Rejected:', {
      reportId: selectedReport.id,
      notes: approvalNotes
    });
    
    alert(`Report ${selectedReport.id} rejected and sent back for review.`);
    
    // Reset form
    setSelectedReport(null);
    setApprovalNotes('');
    setSearchTerm('');
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
                
                {mockTestResults[selectedReport.id]?.map((test, index) => (
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
                  <button onClick={handleReject} className="reject-btn">
                    Request Changes
                  </button>
                  <button onClick={handleApprove} className="approve-btn">
                    Approve Report
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