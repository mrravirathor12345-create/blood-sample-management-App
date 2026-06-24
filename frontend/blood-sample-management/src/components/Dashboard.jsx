import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line } from 'recharts';
import api from '../services/apiService';
import { toast } from 'react-hot-toast';
import AnimatedCounter from './AnimatedCounter';
import LoadingSpinner from './LoadingSpinner';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalSamples: 0,
    totalReports: 0,
    totalTests: 0,
  });
  const [recentSamples, setRecentSamples] = useState([]);
  const [statusDistribution, setStatusDistribution] = useState([]);
  const [samplesByDate, setSamplesByDate] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const response = await api.get('/analytics/dashboard');
        const { stats: summary, recentSamples, statusDistribution, samplesByDate } = response.data;

        setStats(summary);
        setStatusDistribution(
          statusDistribution.map((item) => ({
            status: item._id || item.status,
            count: item.count,
          }))
        );

        setSamplesByDate(
          Object.entries(samplesByDate || {})
            .map(([date, count]) => ({ date, count }))
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .slice(-14)
        );

        setRecentSamples(
          (recentSamples || []).map((sample) => ({
            id: sample.sampleId || sample._id,
            patient:
              sample.patient?.firstName && sample.patient?.lastName
                ? `${sample.patient.firstName} ${sample.patient.lastName}`
                : sample.patient || 'Unknown',
            status: sample.status || 'Unknown',
            date: sample.collectionDate
              ? new Date(sample.collectionDate).toLocaleDateString()
              : 'TBD',
          }))
        );
      } catch (error) {
        toast.error('Unable to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const statusColors = {
    Collected: '#ff6b81',
    Processing: '#ff9b3d',
    Processed: '#22d7a5',
    'At Lab': '#6c63ff',
    Stored: '#ff477e',
    Unknown: '#7b7b7b',
  };

  if (loading) {
    return (
      <div className="route-loader">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
      className="dashboard"
    >
      <div className="dashboard-header page-shell">
        <div>
          <p className="dashboard-superscript">Live Operations Panel</p>
          <h1>Blood Sample Workflow</h1>
        </div>
        <div className="dashboard-meta">
          <span className="meta-pill">Connected to MongoDB</span>
          <span className="meta-pill pulse">Real-time updates</span>
        </div>
      </div>

      <div className="stats-grid page-shell">
        <motion.div whileHover={{ y: -6 }} className="stat-card glass-card glow-border">
          <div className="stat-icon stat-patients">
            <span className="material-icons">group</span>
          </div>
          <div>
            <p className="stat-label">Patients</p>
            <AnimatedCounter value={stats.totalPatients} />
          </div>
        </motion.div>

        <motion.div whileHover={{ y: -6 }} className="stat-card glass-card glow-border">
          <div className="stat-icon stat-samples">
            <span className="material-icons">science</span>
          </div>
          <div>
            <p className="stat-label">Samples</p>
            <AnimatedCounter value={stats.totalSamples} />
          </div>
        </motion.div>

        <motion.div whileHover={{ y: -6 }} className="stat-card glass-card glow-border">
          <div className="stat-icon stat-reports">
            <span className="material-icons">description</span>
          </div>
          <div>
            <p className="stat-label">Reports</p>
            <AnimatedCounter value={stats.totalReports} />
          </div>
        </motion.div>

        <motion.div whileHover={{ y: -6 }} className="stat-card glass-card glow-border">
          <div className="stat-icon stat-tests">
            <span className="material-icons">science_outlined</span>
          </div>
          <div>
            <p className="stat-label">Active Tests</p>
            <AnimatedCounter value={stats.totalTests} />
          </div>
        </motion.div>
      </div>

      <div className="dashboard-grid page-shell">
        <section className="chart-panel glass-card">
          <div className="panel-header">
            <div>
              <h2>Sample Collection Trend</h2>
              <p>Samples collected over the last 14 days</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={samplesByDate} margin={{ top: 12, right: 18, left: -10, bottom: 0 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
              <XAxis dataKey="date" tick={{ fill: '#c2b9c8', fontSize: 12 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill: '#c2b9c8', fontSize: 12 }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: '#12030a', border: '1px solid rgba(255,80,120,0.14)', color: '#fff' }} />
              <Line type="monotone" dataKey="count" stroke="#ff3c6a" strokeWidth={3} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </section>

        <section className="status-panel glass-card">
          <div className="panel-header">
            <div>
              <h2>Status Distribution</h2>
              <p>Live sample workflow statuses</p>
            </div>
          </div>
          <div className="status-list">
            {statusDistribution.map((item) => (
              <div key={item.status} className="status-item">
                <div className="status-summary">
                  <span>{item.status}</span>
                  <span>{item.count}</span>
                </div>
                <div className="status-bar">
                  <div
                    className="status-fill"
                    style={{
                      width: `${Math.min(100, (item.count / Math.max(1, Math.max(...statusDistribution.map((row) => row.count)))) * 100)}%`,
                      background: statusColors[item.status] || '#7b7b7b',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="dashboard-grid page-shell">
        <section className="activity-panel glass-card">
          <div className="panel-header">
            <div>
              <h2>Recent Sample Activity</h2>
              <p>Newest samples flowing through the lab pipeline</p>
            </div>
          </div>
          <div className="activity-table">
            {recentSamples.slice(0, 6).map((sample) => (
              <div key={sample.id} className="activity-row">
                <div>
                  <span className="activity-id">{sample.id}</span>
                  <p>{sample.patient}</p>
                </div>
                <div className="activity-meta">
                  <span className={`status-chip ${sample.status.toLowerCase().replace(/\s/g, '-')}`}>{sample.status}</span>
                  <p>{sample.date}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="action-panel glass-card">
          <div className="panel-header">
            <h2>Quick Actions</h2>
          </div>
          <div className="quick-actions">
            <button className="quick-action">New Sample Entry</button>
            <button className="quick-action">Review Reports</button>
            <button className="quick-action">Assign Lab Tests</button>
            <button className="quick-action">Audit Recent Logs</button>
          </div>
        </section>
      </div>
    </motion.div>
  );
};

export default Dashboard;
