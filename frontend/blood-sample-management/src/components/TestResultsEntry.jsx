import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './TestResultsEntry.css';

const TestResultsEntry = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSample, setSelectedSample] = useState(null);
  const [testResults, setTestResults] = useState([]);

  // Mock data for samples with assigned tests
  const mockSamples = [
    {
      id: 'SMP00000125',
      patient: 'John Doe',
      status: 'Processing',
      collectionDate: '2023-09-15',
      tests: [
        { id: 'TST00001', name: 'Complete Blood Count (CBC)', status: 'Pending' },
        { id: 'TST00002', name: 'Lipid Profile', status: 'Pending' }
      ]
    },
    {
      id: 'SMP00000124',
      patient: 'Jane Smith',
      status: 'Processing',
      collectionDate: '2023-09-15',
      tests: [
        { id: 'TST00003', name: 'Liver Function Test', status: 'Pending' },
        { id: 'TST00006', name: 'Blood Glucose', status: 'Pending' }
      ]
    }
  ];

  // Mock reference ranges for tests
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

  const filteredSamples = mockSamples.filter(sample =>
    sample.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sample.patient.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSampleSelect = (sample) => {
    setSelectedSample(sample);
    
    // Initialize test results based on assigned tests
    const initialResults = sample.tests.map(test => ({
      testId: test.id,
      testName: test.name,
      parameters: referenceRanges[test.id] ? 
        Object.keys(referenceRanges[test.id]).map(param => ({
          name: param,
          value: '',
          unit: referenceRanges[test.id][param].unit,
          min: referenceRanges[test.id][param].min,
          max: referenceRanges[test.id][param].max,
          status: ''
        })) : [],
      remarks: '',
      verified: false
    }));
    
    setTestResults(initialResults);
  };

  const handleResultChange = (testIndex, paramIndex, value) => {
    const updatedResults = [...testResults];
    updatedResults[testIndex].parameters[paramIndex].value = value;
    
    // Determine status based on reference range
    const param = updatedResults[testIndex].parameters[paramIndex];
    const numValue = parseFloat(value);
    
    if (!isNaN(numValue)) {
      if (numValue < param.min) {
        param.status = 'Low';
      } else if (numValue > param.max) {
        param.status = 'High';
      } else {
        param.status = 'Normal';
      }
    } else {
      param.status = '';
    }
    
    setTestResults(updatedResults);
  };

  const handleRemarksChange = (testIndex, remarks) => {
    const updatedResults = [...testResults];
    updatedResults[testIndex].remarks = remarks;
    setTestResults(updatedResults);
  };

  const handleSubmitResults = (e) => {
    e.preventDefault();
    
    if (!selectedSample) {
      alert('Please select a sample first');
      return;
    }
    
    // Check if all required fields are filled
    const isIncomplete = testResults.some(test => 
      test.parameters.some(param => param.value === '')
    );
    
    if (isIncomplete) {
      alert('Please fill in all test result values');
      return;
    }
    
    // In a real app, this would send data to the backend
    console.log('Test Results:', {
      sampleId: selectedSample.id,
      results: testResults
    });
    
    alert(`Test results for sample ${selectedSample.id} submitted successfully!`);
    
    // Reset form
    setSelectedSample(null);
    setTestResults([]);
    setSearchTerm('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="test-results-entry"
    >
      <div className="results-header">
        <h1>Test Results Entry</h1>
        <p>Enter and submit laboratory test results</p>
      </div>

      <div className="results-content">
        {/* Sample Selection Panel */}
        <div className="panel glass-card">
          <h2>Select Sample</h2>
          
          <div className="search-box">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Sample ID or Patient Name"
              className="search-input"
            />
          </div>
          
          <div className="samples-list">
            {filteredSamples.length > 0 ? (
              filteredSamples.map(sample => (
                <div
                  key={sample.id}
                  className={`sample-item ${selectedSample?.id === sample.id ? 'selected' : ''}`}
                  onClick={() => handleSampleSelect(sample)}
                >
                  <div className="sample-info">
                    <h3>{sample.id}</h3>
                    <p>{sample.patient}</p>
                  </div>
                  <div className="sample-meta">
                    <span className="sample-status">{sample.status}</span>
                    <span className="collection-date">{sample.collectionDate}</span>
                  </div>
                  <div className="sample-tests">
                    {sample.tests.map(test => (
                      <span key={test.id} className="test-tag">
                        {test.name}
                      </span>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="no-samples">
                <p>No samples found with assigned tests.</p>
              </div>
            )}
          </div>
        </div>

        {/* Results Entry Panel */}
        <div className="panel glass-card">
          <h2>Test Results Entry</h2>
          
          {selectedSample ? (
            <form onSubmit={handleSubmitResults}>
              <div className="sample-info-header">
                <h3>Sample: {selectedSample.id}</h3>
                <p>Patient: {selectedSample.patient}</p>
                <p>Collection Date: {selectedSample.collectionDate}</p>
              </div>
              
              <div className="results-sections">
                {testResults.map((test, testIndex) => (
                  <div key={test.testId} className="test-section">
                    <h4>{test.testName}</h4>
                    
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
                          <div className="cell">
                            <input
                              type="number"
                              step="any"
                              value={param.value}
                              onChange={(e) => handleResultChange(testIndex, paramIndex, e.target.value)}
                              className="result-input"
                              placeholder="Enter value"
                            />
                          </div>
                          <div className="cell reference-range">
                            {param.min} - {param.max} {param.unit}
                          </div>
                          <div className="cell status-cell">
                            <span className={`status-badge ${param.status.toLowerCase()}`}>
                              {param.status || '-'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="remarks-section">
                      <label>Remarks/Observations</label>
                      <textarea
                        value={test.remarks}
                        onChange={(e) => handleRemarksChange(testIndex, e.target.value)}
                        placeholder="Add any remarks or observations..."
                        className="remarks-input"
                      />
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="form-actions">
                <button type="button" className="cancel-btn">Cancel</button>
                <button type="submit" className="submit-btn">Submit Results</button>
              </div>
            </form>
          ) : (
            <div className="no-selection">
              <p>Please select a sample to enter test results</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default TestResultsEntry;