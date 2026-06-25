import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../services/apiService';
import { toast } from 'react-hot-toast';
import './TestAssignment.css';

const TestAssignment = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSample, setSelectedSample] = useState(null);
  const [selectedTests, setSelectedTests] = useState([]);
  const [assignedTechnician, setAssignedTechnician] = useState('');
  const [samples, setSamples] = useState([]);
  const [availableTests, setAvailableTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [samplesRes, testsRes] = await Promise.all([
          api.get('/samples'),
          api.get('/tests')
        ]);
        
        // Filter for collected samples
        const collectedSamples = samplesRes.data.filter(s => s.status === 'Collected');
        setSamples(collectedSamples);
        setAvailableTests(testsRes.data);
      } catch (err) {
        toast.error('Failed to load samples or tests.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const technicians = [
    { id: 'TECH001', name: 'Dr. Alice Johnson', department: 'Hematology' },
    { id: 'TECH002', name: 'Dr. Bob Smith', department: 'Biochemistry' },
    { id: 'TECH003', name: 'Dr. Carol Williams', department: 'Endocrinology' }
  ];

  // Map to local UI structure
  const mappedSamples = samples.map(s => ({
    _id: s._id,
    id: s.sampleId,
    patient: s.patient ? `${s.patient.firstName} ${s.patient.lastName}` : 'Unknown',
    status: s.status,
    collectionDate: new Date(s.collectionDate).toLocaleDateString(),
    sampleType: s.sampleType
  }));

  const mappedTests = availableTests.map(t => ({
    id: t._id,
    testCode: t.testCode,
    name: t.testName,
    category: t.category,
    turnaround: `${t.turnaroundTime} hrs`,
    cost: t.cost
  }));

  const filteredSamples = mappedSamples.filter(sample =>
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

  const handleAssignTests = async (e) => {
    e.preventDefault();
    
    if (!selectedSample) {
      toast.error('Please select a sample first');
      return;
    }
    
    if (selectedTests.length === 0) {
      toast.error('Please select at least one test');
      return;
    }
    
    if (!assignedTechnician) {
      toast.error('Please assign a technician');
      return;
    }
    
    setIsSubmitting(true);

    try {
      await api.patch(`/samples/${selectedSample._id}/assign-tests`, {
        tests: selectedTests
      });
      
      toast.success(`Tests assigned to sample ${selectedSample.id} successfully!`);
      
      // Remove successfully assigned sample from list
      setSamples(prev => prev.filter(s => s._id !== selectedSample._id));
      
      // Reset form
      setSelectedSample(null);
      setSelectedTests([]);
      setAssignedTechnician('');
      setSearchTerm('');
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to assign tests';
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
                {mappedTests.map(test => (
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
                    disabled={isSubmitting}
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
                    const test = mappedTests.find(t => t.id === testId);
                    return total + (test ? test.cost : 0);
                  }, 0)}</p>
                </div>
                
                <button
                  onClick={handleAssignTests}
                  className="assign-btn"
                  disabled={selectedTests.length === 0 || !assignedTechnician || isSubmitting}
                >
                  {isSubmitting ? 'Assigning...' : 'Assign Tests'}
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