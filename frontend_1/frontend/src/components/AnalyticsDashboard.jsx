import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Pie } from 'react-chartjs-2';
import { Line } from 'react-chartjs-2';
import './AnalyticsDashboard.css';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const AnalyticsDashboard = () => {
  const [timeRange, setTimeRange] = useState('30days');
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalSamples: 0,
    totalReports: 0,
    totalTests: 0,
    avgProcessingTime: 0,
    abnormalResults: 0
  });

  const [charts, setCharts] = useState({
    samplesOverTime: [],
    statusDistribution: [],
    genderDistribution: [],
    ageDistribution: [],
    popularTests: [],
    processingTimes: []
  });

  // Mock data for demonstration
  const mockStats = {
    totalPatients: 124,
    totalSamples: 256,
    totalReports: 241,
    totalTests: 42,
    avgProcessingTime: 2.4,
    abnormalResults: 18
  };

  const mockCharts = {
    samplesOverTime: [
      { date: '2023-09-01', count: 8 },
      { date: '2023-09-02', count: 12 },
      { date: '2023-09-03', count: 10 },
      { date: '2023-09-04', count: 15 },
      { date: '2023-09-05', count: 18 },
      { date: '2023-09-06', count: 14 },
      { date: '2023-09-07', count: 20 }
    ],
    statusDistribution: [
      { status: 'Collected', count: 24 },
      { status: 'Processing', count: 18 },
      { status: 'Processed', count: 32 },
      { status: 'At Lab', count: 15 },
      { status: 'Stored', count: 42 }
    ],
    genderDistribution: [
      { gender: 'Male', count: 68 },
      { gender: 'Female', count: 56 }
    ],
    ageDistribution: [
      { range: '0-18', count: 12 },
      { range: '18-35', count: 45 },
      { range: '35-50', count: 38 },
      { range: '50-65', count: 25 },
      { range: '65+', count: 14 }
    ],
    popularTests: [
      { test: 'Complete Blood Count', count: 85 },
      { test: 'Lipid Profile', count: 72 },
      { test: 'Liver Function', count: 68 },
      { test: 'Kidney Function', count: 62 },
      { test: 'Thyroid Panel', count: 45 }
    ],
    processingTimes: [
      { day: 'Mon', time: 2.1 },
      { day: 'Tue', time: 2.5 },
      { day: 'Wed', time: 2.0 },
      { day: 'Thu', time: 2.8 },
      { day: 'Fri', time: 2.3 },
      { day: 'Sat', time: 1.9 },
      { day: 'Sun', time: 2.6 }
    ]
  };

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setStats(mockStats);
      setCharts(mockCharts);
    }, 500);
  }, [timeRange]);

  // Chart configurations
  const samplesOverTimeData = {
    labels: mockCharts.samplesOverTime.map(item => item.date),
    datasets: [
      {
        label: 'Samples Collected',
        data: mockCharts.samplesOverTime.map(item => item.count),
        backgroundColor: 'rgba(100, 108, 255, 0.7)',
        borderColor: 'rgba(100, 108, 255, 1)',
        borderWidth: 2,
        borderRadius: 6,
        tension: 0.4,
        fill: true
      }
    ]
  };

  const samplesOverTimeOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        padding: 12,
        titleFont: {
          size: 14
        },
        bodyFont: {
          size: 13
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          color: '#666'
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#666'
        }
      }
    }
  };

  const statusDistributionData = {
    labels: mockCharts.statusDistribution.map(item => item.status),
    datasets: [
      {
        data: mockCharts.statusDistribution.map(item => item.count),
        backgroundColor: [
          '#FF6B6B',
          '#4ECDC4',
          '#45B7D1',
          '#96CEB4',
          '#FFEAA7'
        ],
        borderColor: '#fff',
        borderWidth: 2
      }
    ]
  };

  const statusDistributionOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        padding: 12
      }
    }
  };

  const processingTimesData = {
    labels: mockCharts.processingTimes.map(item => item.day),
    datasets: [
      {
        label: 'Avg. Processing Time (hours)',
        data: mockCharts.processingTimes.map(item => item.time),
        borderColor: '#646cff',
        backgroundColor: 'rgba(100, 108, 255, 0.1)',
        borderWidth: 3,
        pointBackgroundColor: '#646cff',
        pointRadius: 5,
        pointHoverRadius: 7,
        tension: 0.4,
        fill: true
      }
    ]
  };

  const processingTimesOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        padding: 12
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          color: '#666'
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#666'
        }
      }
    }
  };

  const statusColors = {
    'Collected': '#FF6B6B',
    'Processing': '#4ECDC4',
    'Processed': '#45B7D1',
    'At Lab': '#96CEB4',
    'Stored': '#FFEAA7'
  };

  const genderColors = {
    'Male': '#45B7D1',
    'Female': '#FF6B6B'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="analytics-dashboard"
    >
      <div className="dashboard-header">
        <div className="header-content">
          <div>
            <h1>Analytics Dashboard</h1>
            <p>Comprehensive insights and statistics</p>
          </div>
          <div className="header-actions">
            <button className="export-btn glass-card">
              <span className="material-icons">download</span>
              Export Report
            </button>
            <button className="export-btn glass-card">
              <span className="material-icons">share</span>
              Share
            </button>
          </div>
        </div>
        
        <div className="dashboard-tabs">
          <button 
            className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`tab ${activeTab === 'samples' ? 'active' : ''}`}
            onClick={() => setActiveTab('samples')}
          >
            Samples
          </button>
          <button 
            className={`tab ${activeTab === 'patients' ? 'active' : ''}`}
            onClick={() => setActiveTab('patients')}
          >
            Patients
          </button>
          <button 
            className={`tab ${activeTab === 'performance' ? 'active' : ''}`}
            onClick={() => setActiveTab('performance')}
          >
            Performance
          </button>
          <button 
            className={`tab ${activeTab === 'ai-insights' ? 'active' : ''}`}
            onClick={() => setActiveTab('ai-insights')}
          >
            AI Insights
          </button>
        </div>
      </div>

      <div className="time-range-selector glass-card">
        <span className="selector-label">Time Range:</span>
        <button 
          className={timeRange === '7days' ? 'active' : ''}
          onClick={() => setTimeRange('7days')}
        >
          7 Days
        </button>
        <button 
          className={timeRange === '30days' ? 'active' : ''}
          onClick={() => setTimeRange('30days')}
        >
          30 Days
        </button>
        <button 
          className={timeRange === '90days' ? 'active' : ''}
          onClick={() => setTimeRange('90days')}
        >
          90 Days
        </button>
        <button 
          className={timeRange === '1year' ? 'active' : ''}
          onClick={() => setTimeRange('1year')}
        >
          1 Year
        </button>
        <button className="filter-btn">
          <span className="material-icons">filter_list</span>
          More Filters
        </button>
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
          <div className="stat-trend positive">
            <span className="material-icons">arrow_upward</span>
            <span>12%</span>
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
          <div className="stat-trend positive">
            <span className="material-icons">arrow_upward</span>
            <span>8%</span>
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
          <div className="stat-trend negative">
            <span className="material-icons">arrow_downward</span>
            <span>3%</span>
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
          <div className="stat-trend positive">
            <span className="material-icons">arrow_upward</span>
            <span>5%</span>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -5 }}
          className="stat-card glass-card"
        >
          <div className="stat-icon" style={{ backgroundColor: 'rgba(255, 234, 167, 0.15)' }}>
            <span className="material-icons" style={{ color: '#FFEAA7' }}>schedule</span>
          </div>
          <div className="stat-info">
            <h3>{stats.avgProcessingTime} hrs</h3>
            <p>Avg. Processing Time</p>
          </div>
          <div className="stat-trend negative">
            <span className="material-icons">arrow_downward</span>
            <span>15%</span>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -5 }}
          className="stat-card glass-card"
        >
          <div className="stat-icon" style={{ backgroundColor: 'rgba(255, 107, 107, 0.15)' }}>
            <span className="material-icons" style={{ color: '#FF6B6B' }}>warning</span>
          </div>
          <div className="stat-info">
            <h3>{stats.abnormalResults}</h3>
            <p>Abnormal Results</p>
          </div>
          <div className="stat-trend negative">
            <span className="material-icons">arrow_upward</span>
            <span>7%</span>
          </div>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="charts-grid">
        <div className="chart-container glass-card">
          <div className="chart-header">
            <h2>Sample Collection Trend</h2>
            <div className="chart-actions">
              <button className="chart-action-btn">
                <span className="material-icons">more_vert</span>
              </button>
            </div>
          </div>
          <div className="chart">
            <Bar data={samplesOverTimeData} options={samplesOverTimeOptions} />
          </div>
        </div>

        <div className="chart-container glass-card">
          <div className="chart-header">
            <h2>Sample Status Distribution</h2>
            <div className="chart-actions">
              <button className="chart-action-btn">
                <span className="material-icons">more_vert</span>
              </button>
            </div>
          </div>
          <div className="chart">
            <Pie data={statusDistributionData} options={statusDistributionOptions} />
          </div>
        </div>

        <div className="chart-container glass-card">
          <div className="chart-header">
            <h2>Processing Time Trend</h2>
            <div className="chart-actions">
              <button className="chart-action-btn">
                <span className="material-icons">more_vert</span>
              </button>
            </div>
          </div>
          <div className="chart">
            <Line data={processingTimesData} options={processingTimesOptions} />
          </div>
        </div>

        <div className="chart-container glass-card">
          <div className="chart-header">
            <h2>Patient Demographics</h2>
            <div className="chart-actions">
              <button className="chart-action-btn">
                <span className="material-icons">more_vert</span>
              </button>
            </div>
          </div>
          <div className="chart">
            <div className="demographics-charts">
              <div className="gender-distribution">
                <h3>By Gender</h3>
                {charts.genderDistribution.map((item, index) => (
                  <div key={index} className="demographic-item">
                    <div className="color-box" style={{ backgroundColor: genderColors[item.gender] }}></div>
                    <span className="demographic-label">{item.gender}</span>
                    <span className="demographic-value">{item.count}</span>
                  </div>
                ))}
              </div>
              
              <div className="age-distribution">
                <h3>By Age Group</h3>
                <div className="age-bars">
                  {charts.ageDistribution.map((item, index) => (
                    <div key={index} className="age-bar-item">
                      <div className="age-label">{item.range}</div>
                      <div className="age-bar-container">
                        <div 
                          className="age-bar" 
                          style={{ 
                            width: `${(item.count / 50) * 100}%`,
                            backgroundColor: '#45B7D1'
                          }}
                        ></div>
                      </div>
                      <div className="age-count">{item.count}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="chart-container glass-card">
          <div className="chart-header">
            <h2>Most Requested Tests</h2>
            <div className="chart-actions">
              <button className="chart-action-btn">
                <span className="material-icons">more_vert</span>
              </button>
            </div>
          </div>
          <div className="chart">
            <div className="popular-tests">
              {charts.popularTests.map((item, index) => (
                <div key={index} className="test-item">
                  <div className="test-rank">#{index + 1}</div>
                  <div className="test-info">
                    <div className="test-name">{item.test}</div>
                    <div className="test-bar-container">
                      <div 
                        className="test-bar" 
                        style={{ width: `${(item.count / 100) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="test-count">{item.count}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="chart-container glass-card">
          <div className="chart-header">
            <h2>Performance Metrics</h2>
            <div className="chart-actions">
              <button className="chart-action-btn">
                <span className="material-icons">more_vert</span>
              </button>
            </div>
          </div>
          <div className="chart">
            <div className="performance-metrics">
              <div className="metric-card">
                <div className="metric-value">98.2%</div>
                <div className="metric-label">Accuracy Rate</div>
                <div className="metric-trend positive">
                  <span className="material-icons">arrow_upward</span>
                  <span>2.1%</span>
                </div>
              </div>
              <div className="metric-card">
                <div className="metric-value">94.7%</div>
                <div className="metric-label">On-Time Delivery</div>
                <div className="metric-trend positive">
                  <span className="material-icons">arrow_upward</span>
                  <span>1.8%</span>
                </div>
              </div>
              <div className="metric-card">
                <div className="metric-value">4.2 hrs</div>
                <div className="metric-label">Avg. Turnaround</div>
                <div className="metric-trend negative">
                  <span className="material-icons">arrow_downward</span>
                  <span>0.3 hrs</span>
                </div>
              </div>
              <div className="metric-card">
                <div className="metric-value">99.1%</div>
                <div className="metric-label">Customer Satisfaction</div>
                <div className="metric-trend positive">
                  <span className="material-icons">arrow_upward</span>
                  <span>0.9%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Insights Section */}
        <div className="chart-container glass-card">
          <div className="chart-header">
            <h2>AI Predictive Insights</h2>
            <div className="chart-actions">
              <button className="chart-action-btn">
                <span className="material-icons">more_vert</span>
              </button>
            </div>
          </div>
          <div className="chart">
            <div className="ai-insights">
              <div className="insight-card">
                <div className="insight-icon">
                  <span className="material-icons">trending_up</span>
                </div>
                <div className="insight-content">
                  <h3>Predicted Increase</h3>
                  <p>15% increase in cholesterol cases expected next quarter</p>
                  <div className="confidence-meter">
                    <div className="confidence-label">Confidence: 84%</div>
                    <div className="confidence-bar">
                      <div className="confidence-fill" style={{ width: '84%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="insight-card">
                <div className="insight-icon warning">
                  <span className="material-icons">warning</span>
                </div>
                <div className="insight-content">
                  <h3>Equipment Alert</h3>
                  <p>Analyzer #3 showing potential calibration drift</p>
                  <div className="confidence-meter">
                    <div className="confidence-label">Confidence: 92%</div>
                    <div className="confidence-bar">
                      <div className="confidence-fill warning" style={{ width: '92%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="insight-card">
                <div className="insight-icon success">
                  <span className="material-icons">thumb_up</span>
                </div>
                <div className="insight-content">
                  <h3>Positive Trend</h3>
                  <p>Improved glucose control in diabetic patients</p>
                  <div className="confidence-meter">
                    <div className="confidence-label">Confidence: 78%</div>
                    <div className="confidence-bar">
                      <div className="confidence-fill success" style={{ width: '78%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="chart-container glass-card">
          <div className="chart-header">
            <h2>AI Recommendations</h2>
            <div className="chart-actions">
              <button className="chart-action-btn">
                <span className="material-icons">more_vert</span>
              </button>
            </div>
          </div>
          <div className="chart">
            <div className="recommendations-list">
              <div className="recommendation-item glass-card">
                <div className="rec-header">
                  <h3>Increased Hemoglobin Cases</h3>
                  <span className="priority-badge priority-high">High</span>
                </div>
                <p className="rec-description">25% increase in abnormal hemoglobin readings this month</p>
                <div className="rec-action">
                  <span className="material-icons">lightbulb</span>
                  <span>Review patient hydration protocols</span>
                </div>
                <div className="rec-actions">
                  <button className="rec-btn">
                    <span className="material-icons">check</span>
                    Acknowledge
                  </button>
                  <button className="rec-btn secondary">
                    <span className="material-icons">schedule</span>
                    Schedule
                  </button>
                </div>
              </div>
              
              <div className="recommendation-item glass-card">
                <div className="rec-header">
                  <h3>Seasonal Glucose Patterns</h3>
                  <span className="priority-badge priority-medium">Medium</span>
                </div>
                <p className="rec-description">Higher glucose readings observed in summer months</p>
                <div className="rec-action">
                  <span className="material-icons">lightbulb</span>
                  <span>Adjust patient dietary counseling</span>
                </div>
                <div className="rec-actions">
                  <button className="rec-btn">
                    <span className="material-icons">check</span>
                    Acknowledge
                  </button>
                  <button className="rec-btn secondary">
                    <span className="material-icons">schedule</span>
                    Schedule
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AnalyticsDashboard;