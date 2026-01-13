import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalSamples: 0,
    totalReports: 0,
    totalTests: 0
  });

  const [recentSamples, setRecentSamples] = useState([]);
  const [statusDistribution, setStatusDistribution] = useState([]);

  useEffect(() => {
    // Mock data - in a real app, this would come from an API
    setStats({
      totalPatients: 124,
      totalSamples: 256,
      totalReports: 241,
      totalTests: 42
    });

    setRecentSamples([
      { id: 'SMP00000125', patient: 'John Doe', status: 'Processing', date: '2023-09-15' },
      { id: 'SMP00000124', patient: 'Jane Smith', status: 'Collected', date: '2023-09-15' },
      { id: 'SMP00000123', patient: 'Robert Johnson', status: 'Processed', date: '2023-09-14' },
      { id: 'SMP00000122', patient: 'Emily Davis', status: 'At Lab', date: '2023-09-14' },
      { id: 'SMP00000121', patient: 'Michael Wilson', status: 'Stored', date: '2023-09-13' }
    ]);

    setStatusDistribution([
      { status: 'Collected', count: 24 },
      { status: 'Processing', count: 18 },
      { status: 'Processed', count: 32 },
      { status: 'At Lab', count: 15 },
      { status: 'Stored', count: 42 }
    ]);
  }, []);

  const statusColors = {
    'Collected': '#FF6B6B',
    'Processing': '#4ECDC4',
    'Processed': '#45B7D1',
    'At Lab': '#96CEB4',
    'Stored': '#FFEAA7'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="dashboard"
    >
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Welcome to Blood Sample Management System</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <motion.div
          whileHover={{ y: -5 }}
          className="stat-card glass-card"
        >
          <div className="stat-icon" style={{ backgroundColor: 'rgba(100, 108, 255, 0.15)' }}>
            <span className="material-icons" style={{ color: '#646cff' }}>group</span>
          </div>
          <div className="stat-info">
            <h3>{stats.totalPatients}</h3>
            <p>Total Patients</p>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -5 }}
          className="stat-card glass-card"
        >
          <div className="stat-icon" style={{ backgroundColor: 'rgba(255, 107, 107, 0.15)' }}>
            <span className="material-icons" style={{ color: '#FF6B6B' }}>science</span>
          </div>
          <div className="stat-info">
            <h3>{stats.totalSamples}</h3>
            <p>Total Samples</p>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -5 }}
          className="stat-card glass-card"
        >
          <div className="stat-icon" style={{ backgroundColor: 'rgba(78, 205, 196, 0.15)' }}>
            <span className="material-icons" style={{ color: '#4ECDC4' }}>description</span>
          </div>
          <div className="stat-info">
            <h3>{stats.totalReports}</h3>
            <p>Total Reports</p>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -5 }}
          className="stat-card glass-card"
        >
          <div className="stat-icon" style={{ backgroundColor: 'rgba(150, 206, 180, 0.15)' }}>
            <span className="material-icons" style={{ color: '#96CEB4' }}>fact_check</span>
          </div>
          <div className="stat-info">
            <h3>{stats.totalTests}</h3>
            <p>Available Tests</p>
          </div>
        </motion.div>
      </div>

      {/* Charts and Recent Activity */}
      <div className="dashboard-content">
        <div className="charts-section">
          <div className="chart-container glass-card">
            <h2>Sample Status Distribution</h2>
            <div className="status-bars">
              {statusDistribution.map((item, index) => (
                <div key={index} className="status-bar">
                  <div className="status-label">
                    <span>{item.status}</span>
                    <span>{item.count}</span>
                  </div>
                  <div className="bar-container">
                    <div
                      className="bar-fill"
                      style={{
                        width: `${(item.count / 50) * 100}%`,
                        backgroundColor: statusColors[item.status]
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="recent-activity">
          <div className="activity-card glass-card">
            <h2>Recent Samples</h2>
            <div className="activity-list">
              {recentSamples.map((sample, index) => (
                <motion.div
                  key={sample.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="activity-item"
                >
                  <div className="activity-info">
                    <h4>{sample.id}</h4>
                    <p>{sample.patient}</p>
                  </div>
                  <div className="activity-status">
                    <span
                      className="status-badge"
                      style={{ backgroundColor: statusColors[sample.status] }}
                    >
                      {sample.status}
                    </span>
                  </div>
                  <div className="activity-date">
                    <p>{sample.date}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;