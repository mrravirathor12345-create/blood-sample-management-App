import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './ReportGeneration.css';

const ReportGeneration = () => {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showAIAnalysis, setShowAIAnalysis] = useState(false);

  // Mock data for demonstration
  const mockReports = [
    {
      id: 'RPT00000125',
      patient: 'John Doe',
      sampleId: 'SMP00000125',
      generatedAt: '2023-09-15',
      status: 'Completed',
      aiAnalysis: {
        hasAbnormalities: true,
        riskLevel: 'Medium',
        confidenceScore: 87,
        flaggedParameters: ['Hemoglobin', 'White Blood Cell Count'],
        recommendations: [
          'Hemoglobin level is outside normal range. Consider checking for anemia or dehydration.',
          'WBC count is abnormal. May indicate infection, inflammation, or immune system disorder.'
        ]
      }
    },
    {
      id: 'RPT00000124',
      patient: 'Jane Smith',
      sampleId: 'SMP00000124',
      generatedAt: '2023-09-14',
      status: 'Pending Review'
    },
    {
      id: 'RPT00000123',
      patient: 'Robert Johnson',
      sampleId: 'SMP00000123',
      generatedAt: '2023-09-14',
      status: 'Completed',
      aiAnalysis: {
        hasAbnormalities: false,
        riskLevel: 'Low',
        confidenceScore: 92
      }
    }
  ];

  useEffect(() => {
    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      setReports(mockReports);
      setLoading(false);
    }, 1000);
  }, []);

  const handleViewReport = (report) => {
    setSelectedReport(report);
  };

  const handleViewAIAnalysis = () => {
    setShowAIAnalysis(true);
  };

  const handleCloseAIAnalysis = () => {
    setShowAIAnalysis(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="report-generation"
    >
      <div className="report-header">
        <h1>Report Generation</h1>
        <p>Create, view, and manage blood test reports</p>
      </div>

      <div className="reports-content">
        {/* Reports List */}
        <div className="reports-list glass-card">
          <div className="list-header">
            <h2>Recent Reports</h2>
            <button className="refresh-btn">
              <span className="material-icons">refresh</span>
              Refresh
            </button>
          </div>
          
          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
              <p>Loading reports...</p>
            </div>
          ) : (
            <div className="reports-table">
              <div className="table-header">
                <div>Report ID</div>
                <div>Patient</div>
                <div>Sample ID</div>
                <div>Date</div>
                <div>Status</div>
                <div>Actions</div>
              </div>
              
              {reports.map((report) => (
                <div key={report.id} className="table-row">
                  <div>{report.id}</div>
                  <div>{report.patient}</div>
                  <div>{report.sampleId}</div>
                  <div>{report.generatedAt}</div>
                  <div>
                    <span className={`status-badge ${report.status.toLowerCase().replace(' ', '-')}`}>
                      {report.status}
                    </span>
                  </div>
                  <div className="actions">
                    <button 
                      className="action-btn view-btn"
                      onClick={() => handleViewReport(report)}
                    >
                      <span className="material-icons">visibility</span>
                    </button>
                    <button className="action-btn download-btn">
                      <span className="material-icons">download</span>
                    </button>
                    {report.aiAnalysis && (
                      <button 
                        className="action-btn ai-btn"
                        onClick={() => handleViewReport(report)}
                      >
                        <span className="material-icons">psychology</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Report Preview */}
        {selectedReport && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="report-preview glass-card"
          >
            <div className="preview-header">
              <h2>Report Preview: {selectedReport.id}</h2>
              <div className="preview-actions">
                <button className="close-btn" onClick={() => setSelectedReport(null)}>
                  <span className="material-icons">close</span>
                </button>
              </div>
            </div>
            
            <div className="report-details">
              <div className="detail-row">
                <span className="label">Patient:</span>
                <span className="value">{selectedReport.patient}</span>
              </div>
              <div className="detail-row">
                <span className="label">Sample ID:</span>
                <span className="value">{selectedReport.sampleId}</span>
              </div>
              <div className="detail-row">
                <span className="label">Generated:</span>
                <span className="value">{selectedReport.generatedAt}</span>
              </div>
              <div className="detail-row">
                <span className="label">Status:</span>
                <span className="value">
                  <span className={`status-badge ${selectedReport.status.toLowerCase().replace(' ', '-')}`}>
                    {selectedReport.status}
                  </span>
                </span>
              </div>
            </div>
            
            {/* AI Analysis Section */}
            {selectedReport.aiAnalysis && (
              <div className="ai-analysis-section">
                <div className="section-header">
                  <h3>
                    <span className="material-icons">psychology</span>
                    AI Analysis
                  </h3>
                  <button 
                    className="toggle-ai-btn"
                    onClick={handleViewAIAnalysis}
                  >
                    View Details
                  </button>
                </div>
                
                <div className="ai-summary">
                  <div className="ai-indicator">
                    <div className={`risk-level ${selectedReport.aiAnalysis.riskLevel.toLowerCase()}`}>
                      {selectedReport.aiAnalysis.riskLevel} Risk
                    </div>
                    <div className="confidence-score">
                      Confidence: {selectedReport.aiAnalysis.confidenceScore}%
                    </div>
                  </div>
                  
                  {selectedReport.aiAnalysis.hasAbnormalities ? (
                    <div className="abnormalities-summary">
                      <div className="flagged-parameters">
                        <h4>Flagged Parameters:</h4>
                        <ul>
                          {selectedReport.aiAnalysis.flaggedParameters.map((param, index) => (
                            <li key={index}>{param}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="recommendations">
                        <h4>Key Recommendations:</h4>
                        <ul>
                          {selectedReport.aiAnalysis.recommendations.slice(0, 2).map((rec, index) => (
                            <li key={index}>{rec}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <div className="normal-summary">
                      <p>No significant abnormalities detected.</p>
                      <p>All parameters are within normal ranges.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            <div className="preview-actions">
              <button className="btn secondary-btn">
                <span className="material-icons">edit</span>
                Edit Report
              </button>
              <button className="btn primary-btn">
                <span className="material-icons">download</span>
                Download PDF
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* AI Analysis Modal */}
      {showAIAnalysis && selectedReport && selectedReport.aiAnalysis && (
        <div className="modal-overlay" onClick={handleCloseAIAnalysis}>
          <motion.div 
            className="ai-modal glass-card"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2>
                <span className="material-icons">psychology</span>
                Detailed AI Analysis
              </h2>
              <button className="close-btn" onClick={handleCloseAIAnalysis}>
                <span className="material-icons">close</span>
              </button>
            </div>
            
            <div className="modal-content">
              <div className="ai-overview">
                <div className="overview-item">
                  <div className="overview-label">Risk Level</div>
                  <div className={`overview-value risk-${selectedReport.aiAnalysis.riskLevel.toLowerCase()}`}>
                    {selectedReport.aiAnalysis.riskLevel}
                  </div>
                </div>
                <div className="overview-item">
                  <div className="overview-label">Confidence Score</div>
                  <div className="overview-value">
                    {selectedReport.aiAnalysis.confidenceScore}%
                  </div>
                </div>
                <div className="overview-item">
                  <div className="overview-label">Abnormalities</div>
                  <div className="overview-value">
                    {selectedReport.aiAnalysis.hasAbnormalities ? 'Detected' : 'None'}
                  </div>
                </div>
              </div>
              
              {selectedReport.aiAnalysis.hasAbnormalities && (
                <>
                  <div className="modal-section">
                    <h3>Flagged Parameters</h3>
                    <div className="flagged-parameters-list">
                      {selectedReport.aiAnalysis.flaggedParameters.map((param, index) => (
                        <div key={index} className="flagged-parameter">
                          <span className="material-icons">warning</span>
                          <span>{param}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="modal-section">
                    <h3>Detailed Recommendations</h3>
                    <div className="recommendations-list">
                      {selectedReport.aiAnalysis.recommendations.map((rec, index) => (
                        <div key={index} className="recommendation-item">
                          <div className="rec-number">{index + 1}</div>
                          <div className="rec-text">{rec}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
              
              <div className="modal-section">
                <h3>Next Steps</h3>
                <div className="next-steps">
                  <div className="step">
                    <div className="step-icon">1</div>
                    <div className="step-text">Review flagged parameters with patient</div>
                  </div>
                  <div className="step">
                    <div className="step-icon">2</div>
                    <div className="step-text">Schedule follow-up consultation</div>
                  </div>
                  <div className="step">
                    <div className="step-icon">3</div>
                    <div className="step-text">Consider additional testing if needed</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="modal-footer">
              <button className="btn secondary-btn" onClick={handleCloseAIAnalysis}>
                Close
              </button>
              <button className="btn primary-btn">
                <span className="material-icons">file_download</span>
                Export Analysis
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default ReportGeneration;