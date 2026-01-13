import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './SampleTracking.css';

const SampleTracking = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [trackingData, setTrackingData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Mock sample data for demonstration
  const mockSamples = [
    {
      id: 'SMP00000125',
      patient: 'John Doe',
      status: 'Processing',
      collectionDate: '2023-09-15',
      collector: 'Dr. Smith',
      tests: ['Complete Blood Count', 'Lipid Profile']
    },
    {
      id: 'SMP00000124',
      patient: 'Jane Smith',
      status: 'Collected',
      collectionDate: '2023-09-15',
      collector: 'Dr. Johnson',
      tests: ['Glucose Level', 'Liver Function']
    },
    {
      id: 'SMP00000123',
      patient: 'Robert Johnson',
      status: 'Processed',
      collectionDate: '2023-09-14',
      collector: 'Dr. Williams',
      tests: ['Kidney Function', 'Thyroid Panel']
    }
  ];

  const statusSteps = [
    { id: 'collected', name: 'Collected', icon: 'science' },
    { id: 'in-transit', name: 'In Transit', icon: 'local_shipping' },
    { id: 'at-lab', name: 'At Lab', icon: 'location_on' },
    { id: 'processing', name: 'Processing', icon: 'settings' },
    { id: 'processed', name: 'Processed', icon: 'check_circle' },
    { id: 'stored', name: 'Stored', icon: 'inventory' }
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const foundSample = mockSamples.find(sample => 
        sample.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sample.patient.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      setTrackingData(foundSample || null);
      setLoading(false);
    }, 1000);
  };

  const getCurrentStatusIndex = (status) => {
    const statusMap = {
      'Collected': 0,
      'In Transit': 1,
      'At Lab': 2,
      'Processing': 3,
      'Processed': 4,
      'Stored': 5
    };
    return statusMap[status] || 0;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="sample-tracking"
    >
      <div className="tracking-header">
        <h1>Sample Tracking</h1>
        <p>Track the status and location of blood samples</p>
      </div>

      <div className="tracking-content">
        <form onSubmit={handleSearch} className="search-form glass-card">
          <div className="search-input-container">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Enter Sample ID or Patient Name"
              className="search-input"
            />
            <button type="submit" className="search-btn" disabled={loading}>
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </form>

        {trackingData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="tracking-results glass-card"
          >
            <div className="sample-info">
              <h2>Sample Details</h2>
              <div className="info-grid">
                <div className="info-item">
                  <span className="label">Sample ID:</span>
                  <span className="value">{trackingData.id}</span>
                </div>
                <div className="info-item">
                  <span className="label">Patient:</span>
                  <span className="value">{trackingData.patient}</span>
                </div>
                <div className="info-item">
                  <span className="label">Collection Date:</span>
                  <span className="value">{trackingData.collectionDate}</span>
                </div>
                <div className="info-item">
                  <span className="label">Collector:</span>
                  <span className="value">{trackingData.collector}</span>
                </div>
                <div className="info-item">
                  <span className="label">Status:</span>
                  <span className="value status-badge" style={{
                    backgroundColor: trackingData.status === 'Processed' ? '#4ECDC4' :
                                   trackingData.status === 'Processing' ? '#45B7D1' :
                                   trackingData.status === 'Collected' ? '#FF6B6B' : '#96CEB4'
                  }}>
                    {trackingData.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="tests-assigned">
              <h3>Tests Assigned</h3>
              <div className="tests-list">
                {trackingData.tests.map((test, index) => (
                  <div key={index} className="test-item">
                    <span className="material-icons">check</span>
                    <span>{test}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="status-timeline">
              <h3>Sample Timeline</h3>
              <div className="timeline">
                {statusSteps.map((step, index) => (
                  <div 
                    key={step.id} 
                    className={`timeline-step ${
                      index <= getCurrentStatusIndex(trackingData.status) ? 'completed' : ''
                    }`}
                  >
                    <div className="step-icon">
                      <span className="material-icons">{step.icon}</span>
                    </div>
                    <div className="step-label">{step.name}</div>
                    {index < statusSteps.length - 1 && (
                      <div className={`step-line ${
                        index < getCurrentStatusIndex(trackingData.status) ? 'completed' : ''
                      }`}></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {!trackingData && !loading && (
          <div className="no-results glass-card">
            <div className="no-results-icon">🔍</div>
            <h3>Search for a Sample</h3>
            <p>Enter a Sample ID or Patient Name to track a blood sample</p>
          </div>
        )}

        {loading && (
          <div className="loading glass-card">
            <div className="spinner"></div>
            <p>Searching for sample...</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default SampleTracking;