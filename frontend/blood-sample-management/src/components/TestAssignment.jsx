import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './TestAssignment.css';

const TestAssignment = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSample, setSelectedSample] = useState(null);
  const [selectedTests, setSelectedTests] = useState([]);
  const [assignedTechnician, setAssignedTechnician] = useState('');

  // Mock data for samples
  const mockSamples = [
    {
      id: 'SMP00000125',
      patient: 'John Doe',
      status: 'Collected',
      collectionDate: '2023-09-15',
      sampleType: 'Whole Blood'
    },
    {
      id: 'SMP00000124',
      patient: 'Jane Smith',
      status: 'Collected',
      collectionDate: '2023-09-15',
      sampleType: 'Plasma'
    },
    {
      id: 'SMP00000123',
      patient: 'Robert Johnson',
      status: 'Collected',
      collectionDate: '2023-09-14',
      sampleType: 'Serum'
    }
  ];

  // Mock data for available tests
  const availableTests = [
    { id: 'TST00001', name: 'Complete Blood Count (CBC)', category: 'Hematology', turnaround: '24 hrs', cost: 150 },
    { id: 'TST00002', name: 'Lipid Profile', category: 'Biochemistry', turnaround: '48 hrs', cost: 200 },
    { id: 'TST00003', name: 'Liver Function Test', category: 'Biochemistry', turnaround: '24 hrs', cost: 180 },
    { id: 'TST00004', name: 'Kidney Function Test', category: 'Biochemistry', turnaround: '24 hrs', cost: 160 },
    { id: 'TST00005', name: 'Thyroid Function Test', category: 'Endocrinology', turnaround: '72 hrs', cost: 250 },
    { id: 'TST00006', name: 'Blood Glucose', category: 'Biochemistry', turnaround: '6 hrs', cost: 80 },
    { id: 'TST00007', name: 'HbA1c', category: 'Diabetes', turnaround: '24 hrs', cost: 120 },
    { id: 'TST00008', name: 'Vitamin D', category: 'Nutrition', turnaround: '72 hrs', cost: 300 }
  ];

  const technicians = [
    { id: 'TECH001', name: 'Dr. Alice Johnson', department: 'Hematology' },
    { id: 'TECH002', name: 'Dr. Bob Smith', department: 'Biochemistry' },
    { id: 'TECH003', name: 'Dr. Carol Williams', department: 'Endocrinology' }
  ];

  const filteredSamples = mockSamples.filter(sample =>
    sample.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sample.patient.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSampleSelect = (sample) => {
    setSelectedSample(sample);
    setSelectedTests([]);
    setAssignedTechnician('');
  };

  const handleTestToggle = (testId) => {
    if (selectedTests.includes(testId)) {
      setSelectedTests(selectedTests.filter(id => id !== testId));
    } else {
      setSelectedTests([...selectedTests, testId]);
    }
  };

  const handleAssignTests = (e) => {
    e.preventDefault();
    
    if (!selectedSample) {
      alert('Please select a sample first');
      return;
    }
    
    if (selectedTests.length === 0) {
      alert('Please select at least one test');
      return;
    }
    
    if (!assignedTechnician) {
      alert('Please assign a technician');
      return;
    }
    
    // In a real app, this would send data to the backend
    console.log('Test Assignment:', {
      sampleId: selectedSample.id,
      tests: selectedTests,
      technician: assignedTechnician
    });
    
    alert(`Tests assigned to sample ${selectedSample.id} successfully!`);
    
    // Reset form
    setSelectedSample(null);
    setSelectedTests([]);
    setAssignedTechnician('');
    setSearchTerm('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="test-assignment"
    >
      <div className="assignment-header">
        <h1>Test Assignment</h1>
        <p>Assign laboratory tests to collected blood samples</p>
      </div>

      <div className="assignment-content">
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
                    <span className="sample-type">{sample.sampleType}</span>
                    <span className="collection-date">{sample.collectionDate}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-samples">
                <p>No samples found. Please collect samples first.</p>
              </div>
            )}
          </div>
        </div>

        {/* Test Selection Panel */}
        <div className="panel glass-card">
          <h2>Available Tests</h2>
          
          {selectedSample ? (
            <>
              <div className="selected-sample-info">
                <h3>Selected Sample: {selectedSample.id}</h3>
                <p>Patient: {selectedSample.patient}</p>
              </div>
              
              <div className="tests-grid">
                {availableTests.map(test => (
                  <div
                    key={test.id}
                    className={`test-card ${selectedTests.includes(test.id) ? 'selected' : ''}`}
                    onClick={() => handleTestToggle(test.id)}
                  >
                    <div className="test-header">
                      <h4>{test.name}</h4>
                      <span className="test-category">{test.category}</span>
                    </div>
                    <div className="test-details">
                      <div className="detail-item">
                        <span className="label">Turnaround:</span>
                        <span className="value">{test.turnaround}</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Cost:</span>
                        <span className="value">₹{test.cost}</span>
                      </div>
                    </div>
                    <div className="test-checkbox">
                      <input
                        type="checkbox"
                        checked={selectedTests.includes(test.id)}
                        onChange={() => {}}
                      />
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="assignment-form">
                <div className="form-group">
                  <label htmlFor="technician">Assign Technician</label>
                  <select
                    id="technician"
                    value={assignedTechnician}
                    onChange={(e) => setAssignedTechnician(e.target.value)}
                  >
                    <option value="">Select Technician</option>
                    {technicians.map(tech => (
                      <option key={tech.id} value={tech.id}>
                        {tech.name} ({tech.department})
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="selected-tests-summary">
                  <p>Selected Tests: {selectedTests.length}</p>
                  <p>Total Cost: ₹{selectedTests.reduce((total, testId) => {
                    const test = availableTests.find(t => t.id === testId);
                    return total + (test ? test.cost : 0);
                  }, 0)}</p>
                </div>
                
                <button
                  onClick={handleAssignTests}
                  className="assign-btn"
                  disabled={selectedTests.length === 0 || !assignedTechnician}
                >
                  Assign Tests
                </button>
              </div>
            </>
          ) : (
            <div className="no-selection">
              <p>Please select a sample to assign tests</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default TestAssignment;