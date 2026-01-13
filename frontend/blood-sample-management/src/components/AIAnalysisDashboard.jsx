import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './AIAnalysisDashboard.css';

const AIAnalysisDashboard = () => {
  const [analysisData, setAnalysisData] = useState({
    totalReports: 0,
    abnormalReports: 0,
    riskDistribution: [],
    trendingAbnormalities: [],
    recommendations: []
  });
  
  const [timeRange, setTimeRange] = useState('30days');
  const [loading, setLoading] = useState(false);

  // Mock data for demonstration
  const mockAnalysisData = {
    totalReports: 241,
    abnormalReports: 32,
    riskDistribution: [
      { level: 'Low', count: 180, color: '#4ECDC4' },
      { level: 'Medium', count: 25, color: '#FFD166' },
      { level: 'High', count: 7, color: '#FF6B6B' }
    ],
    trendingAbnormalities: [
      { parameter: 'Hemoglobin', count: 12, trend: 'increasing', confidence: 92, predictedChange: '+15%' },
      { parameter: 'White Blood Cell Count', count: 8, trend: 'stable', confidence: 87, predictedChange: '+2%' },
      { parameter: 'Glucose', count: 6, trend: 'decreasing', confidence: 78, predictedChange: '-8%' },
      { parameter: 'Cholesterol', count: 5, trend: 'increasing', confidence: 84, predictedChange: '+12%' },
      { parameter: 'Platelet Count', count: 4, trend: 'stable', confidence: 91, predictedChange: '+1%' },
      { parameter: 'Creatinine', count: 3, trend: 'increasing', confidence: 76, predictedChange: '+9%' }
    ],
    recommendations: [
      {
        id: 1,
        title: 'Increased Hemoglobin Cases',
        description: '25% increase in abnormal hemoglobin readings this month',
        priority: 'High',
        action: 'Review patient hydration protocols',
        confidence: 92
      },
      {
        id: 2,
        title: 'Seasonal Glucose Patterns',
        description: 'Higher glucose readings observed in summer months',
        priority: 'Medium',
        action: 'Adjust patient dietary counseling',
        confidence: 87
      },
      {
        id: 3,
        title: 'Equipment Calibration Alert',
        description: 'Potential drift in analyzer calibration detected',
        priority: 'High',
        action: 'Schedule preventive maintenance',
        confidence: 95
      },
      {
        id: 4,
        title: 'Kidney Function Monitoring',
        description: 'Rising creatinine levels in elderly patients',
        priority: 'Medium',
        action: 'Increase monitoring frequency',
        confidence: 81
      }
    ]
  };

  useEffect(() => {
    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      setAnalysisData(mockAnalysisData);
      setLoading(false);
    }, 800);
  }, [timeRange]);

  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'High': return 'priority-high';
      case 'Medium': return 'priority-medium';
      case 'Low': return 'priority-low';
      default: return '';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="ai-analysis-dashboard"
    >
      <div className="dashboard-header">
        <div className="header-content">
          <div>
            <h1>AI Analysis Dashboard</h1>
            <p>Intelligent insights and predictive analytics</p>
          </div>
          <div className="header-actions">
            <button className="export-btn glass-card">
              <span className="material-icons">download</span>
              Export Insights
            </button>
          </div>
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
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <motion.div
          whileHover={{ y: -5 }}
          className="stat-card glass-card"
        >
          <div className="stat-icon" style={{ backgroundColor: 'rgba(100, 108, 255, 0.15)' }}>
            <span className="material-icons" style={{ color: '#646cff' }}>description</span>
          </div>
          <div className="stat-info">
            <h3>{analysisData.totalReports}</h3>
            <p>Total Reports Analyzed</p>
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
            <h3>{analysisData.abnormalReports}</h3>
            <p>Abnormal Reports</p>
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
          <div className="stat-icon" style={{ backgroundColor: 'rgba(78, 205, 196, 0.15)' }}>
            <span className="material-icons" style={{ color: '#4ECDC4' }}>check_circle</span>
          </div>
          <div className="stat-info">
            <h3>{Math.round((analysisData.abnormalReports / analysisData.totalReports) * 100)}%</h3>
            <p>Abnormality Rate</p>
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
          <div className="stat-icon" style={{ backgroundColor: 'rgba(255, 209, 102, 0.15)' }}>
            <span className="material-icons" style={{ color: '#FFD166' }}>insights</span>
          </div>
          <div className="stat-info">
            <h3>87%</h3>
            <p>Avg. Confidence</p>
          </div>
          <div className="stat-trend positive">
            <span className="material-icons">arrow_upward</span>
            <span>5%</span>
          </div>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="charts-grid">
        <div className="chart-container glass-card">
          <div className="chart-header">
            <h2>Risk Level Distribution</h2>
          </div>
          <div className="chart">
            <div className="risk-distribution">
              {analysisData.riskDistribution.map((item, index) => (
                <div key={index} className="risk-item">
                  <div className="risk-bar-container">
                    <div 
                      className="risk-bar" 
                      style={{ 
                        width: `${(item.count / 200) * 100}%`,
                        backgroundColor: item.color
                      }}
                    ></div>
                  </div>
                  <div className="risk-info">
                    <span className="risk-level" style={{ color: item.color }}>{item.level}</span>
                    <span className="risk-count">{item.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="chart-container glass-card">
          <div className="chart-header">
            <h2>Trending Abnormalities</h2>
          </div>
          <div className="chart">
            <div className="trending-abnormalities">
              {analysisData.trendingAbnormalities.map((item, index) => (
                <div key={index} className="trending-item">
                  <div className="trending-info">
                    <span className="parameter-name">{item.parameter}</span>
                    <span className="parameter-count">{item.count} cases</span>
                  </div>
                  <div className="trending-indicator">
                    <span className={`trend-icon ${item.trend}`}>
                      {item.trend === 'increasing' && '▲'}
                      {item.trend === 'decreasing' && '▼'}
                      {item.trend === 'stable' && '●'}
                    </span>
                    <span className="trend-text">{item.trend}</span>
                  </div>
                  <div className="trending-confidence">
                    <div className="confidence-bar-container">
                      <div 
                        className="confidence-bar"
                        style={{ width: `${item.confidence}%` }}
                      ></div>
                    </div>
                    <span className="confidence-text">{item.confidence}%</span>
                  </div>
                  <div className="predicted-change">
                    <span className={`change-value ${item.trend}`}>
                      {item.predictedChange}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="chart-container glass-card">
          <div className="chart-header">
            <h2>AI Recommendations</h2>
          </div>
          <div className="chart">
            <div className="recommendations-list">
              {analysisData.recommendations.map((rec) => (
                <div key={rec.id} className="recommendation-item glass-card">
                  <div className="rec-header">
                    <h3>{rec.title}</h3>
                    <span className={`priority-badge ${getPriorityClass(rec.priority)}`}>
                      {rec.priority}
                    </span>
                  </div>
                  <p className="rec-description">{rec.description}</p>
                  <div className="rec-confidence">
                    <span className="confidence-label">Confidence: {rec.confidence}%</span>
                    <div className="confidence-bar-container">
                      <div 
                        className="confidence-bar"
                        style={{ width: `${rec.confidence}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="rec-action">
                    <span className="material-icons">lightbulb</span>
                    <span>{rec.action}</span>
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
                    <button className="rec-btn tertiary">
                      <span className="material-icons">info</span>
                      Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="chart-container glass-card">
          <div className="chart-header">
            <h2>Predictive Insights</h2>
          </div>
          <div className="chart">
            <div className="predictive-insights">
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
      </div>
    </motion.div>
  );
};

export default AIAnalysisDashboard;