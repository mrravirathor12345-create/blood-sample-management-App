import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip,
  CartesianGrid, BarChart, Bar, Cell
} from 'recharts';
import api from '../services/apiService';
import { toast } from 'react-hot-toast';
import AnimatedCounter from './AnimatedCounter';
import LoadingSpinner from './LoadingSpinner';
import ThreeDTestTube from './ThreeDTestTube';
import './Dashboard.css';

/* ── Helpers ────────────────────────────────────────────── */
const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return { text: 'Good Morning', icon: '🌅' };
  if (h < 17) return { text: 'Good Afternoon', icon: '☀️' };
  return { text: 'Good Evening', icon: '🌙' };
};

const formatClock = (d) =>
  d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });

const formatDate = (d) =>
  d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

const STATUS_COLORS = {
  Collected:  { bg: '#ff3b30', glow: 'rgba(255,59,48,0.35)'  },
  Processing: { bg: '#ff9500', glow: 'rgba(255,149,0,0.35)'  },
  Processed:  { bg: '#34c759', glow: 'rgba(52,199,89,0.35)'  },
  'At Lab':   { bg: '#5856d6', glow: 'rgba(88,86,214,0.35)'  },
  Stored:     { bg: '#30b0c7', glow: 'rgba(48,176,199,0.35)' },
  Unknown:    { bg: '#636366', glow: 'rgba(99,99,102,0.25)'  },
};

/* ── Custom Tooltip ─────────────────────────────────────── */
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <p className="tooltip-label">{label}</p>
      <p className="tooltip-value">{payload[0]?.value} samples</p>
    </div>
  );
};

/* ── Action Cards config ────────────────────────────────── */
const QUICK_ACTIONS = [
  { icon: 'science',         label: 'New Sample',       desc: 'Collect & log a sample', route: '/samples/collection', color: '#ff3b30' },
  { icon: 'person_add',      label: 'Register Patient', desc: 'Add a new patient',       route: '/patients/register',  color: '#007aff' },
  { icon: 'biotech',         label: 'Assign Tests',     desc: 'Assign lab tests',        route: '/tests/assignment',   color: '#30b0c7' },
  { icon: 'edit_note',       label: 'Enter Results',    desc: 'Record test results',     route: '/tests/results',      color: '#34c759' },
  { icon: 'analytics',       label: 'Analytics',        desc: 'View trends & reports',   route: '/analytics',          color: '#ff9500' },
  { icon: 'psychology',      label: 'AI Co-Pilot',      desc: 'AI diagnostic analysis',  route: '/ai-analytics',       color: '#5856d6' },
];

/* ── Main Component ─────────────────────────────────────── */
const Dashboard = () => {
  const navigate  = useNavigate();
  const { user }  = useAuth();
  const greeting  = getGreeting();

  const [clock, setClock]                   = useState(new Date());
  const [stats, setStats]                   = useState({ totalPatients: 0, totalSamples: 0, totalReports: 0, totalTests: 0 });
  const [recentSamples, setRecentSamples]   = useState([]);
  const [statusDistribution, setStatusDist] = useState([]);
  const [samplesByDate, setSamplesByDate]   = useState([]);
  const [loading, setLoading]               = useState(true);

  /* Live clock */
  useEffect(() => {
    const t = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  /* Data */
  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const { data } = await api.get('/analytics/dashboard');
        const { stats: summary, recentSamples, statusDistribution, samplesByDate } = data;

        setStats(summary);
        setStatusDist(
          (statusDistribution || []).map(i => ({ status: i._id || i.status, count: i.count }))
        );
        setSamplesByDate(
          Object.entries(samplesByDate || {})
            .map(([date, count]) => ({ date: date.slice(5), count }))
            .sort((a, b) => a.date.localeCompare(b.date))
            .slice(-14)
        );
        setRecentSamples(
          (recentSamples || []).map(s => ({
            id: s.sampleId || s._id,
            patient:
              s.patient?.firstName && s.patient?.lastName
                ? `${s.patient.firstName} ${s.patient.lastName}`
                : s.patient || 'Unknown',
            status: s.status || 'Unknown',
            date: s.collectionDate ? new Date(s.collectionDate).toLocaleDateString() : 'TBD',
          }))
        );
      } catch {
        toast.error('Unable to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, []);

  const STAT_CARDS = [
    { label: 'Patients',     value: stats.totalPatients, icon: 'group',       color: '#ff3b30', cls: 'stat-red'   },
    { label: 'Samples',      value: stats.totalSamples,  icon: 'science',     color: '#007aff', cls: 'stat-blue'  },
    { label: 'Reports',      value: stats.totalReports,  icon: 'description', color: '#34c759', cls: 'stat-green' },
    { label: 'Active Tests', value: stats.totalTests,    icon: 'biotech',     color: '#ff9500', cls: 'stat-orange'},
  ];

  if (loading) {
    return (
      <div className="route-loader">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="dashboard"
    >
      {/* ── Hero Banner ─────────────────────────────────────── */}
      <section className="dashboard-hero page-shell glass-card">
        <div className="hero-orb hero-orb-1" />
        <div className="hero-orb hero-orb-2" />
        <div className="hero-left">
          <span className="hero-eyebrow">
            <span className="eyebrow-dot" />
            Live Operations Panel
          </span>
          <h1 className="hero-greeting">
            {greeting.icon} {greeting.text},{' '}
            <span className="hero-name">{user?.firstName || 'Doctor'}</span>!
          </h1>
          <p className="hero-sub">
            {formatDate(clock)} — All systems operational
          </p>
          <div className="hero-badges">
            <span className="hero-badge badge-green">
              <span className="badge-dot" /> MongoDB Connected
            </span>
            <span className="hero-badge badge-blue">
              <span className="badge-dot" /> Real-time sync active
            </span>
          </div>
        </div>
        <div className="hero-right">
          <div className="hero-3d-container">
            <ThreeDTestTube />
          </div>
          <div className="live-clock-wrap">
            <div className="live-clock">{formatClock(clock)}</div>
            <div className="live-clock-label">Local Time</div>
          </div>
        </div>
      </section>

      {/* ── Stats Grid ──────────────────────────────────────── */}
      <div className="stats-grid page-shell">
        {STAT_CARDS.map((card, i) => (
          <motion.div
            key={card.label}
            className={`stat-card glass-card ${card.cls}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
            whileHover={{ y: -8, scale: 1.02 }}
          >
            <div className="stat-icon-wrap" style={{ '--stat-color': card.color }}>
              <span className="material-icons">{card.icon}</span>
            </div>
            <div className="stat-body">
              <p className="stat-label">{card.label}</p>
              <div className="stat-value-row">
                <AnimatedCounter value={card.value} />
              </div>
            </div>
            <div className="stat-glow" style={{ background: card.color }} />
          </motion.div>
        ))}
      </div>

      {/* ── Charts Row ──────────────────────────────────────── */}
      <div className="dashboard-charts page-shell">
        {/* Area Chart */}
        <section className="chart-panel glass-card">
          <div className="panel-header">
            <div>
              <h2>Sample Collection Trend</h2>
              <p>Last 14 days of sample activity</p>
            </div>
            <span className="panel-badge">14d</span>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={samplesByDate} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="sampleGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#007aff" stopOpacity={0.30} />
                  <stop offset="95%" stopColor="#007aff" stopOpacity={0}    />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="date" tick={{ fill: 'rgba(235,235,245,0.4)', fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill: 'rgba(235,235,245,0.4)', fontSize: 11 }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="count" stroke="#007aff" strokeWidth={2}
                fill="url(#sampleGrad)" dot={false} activeDot={{ r: 5, fill: '#007aff', stroke: '#fff', strokeWidth: 2 }} />
            </AreaChart>
          </ResponsiveContainer>
        </section>

        {/* Status Distribution Bar Chart */}
        <section className="chart-panel glass-card">
          <div className="panel-header">
            <div>
              <h2>Status Distribution</h2>
              <p>Live sample workflow breakdown</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={statusDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barSize={24}>
              <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="status" tick={{ fill: 'rgba(235,235,245,0.4)', fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill: 'rgba(235,235,245,0.4)', fontSize: 11 }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {statusDistribution.map((entry) => (
                  <Cell key={entry.status} fill={STATUS_COLORS[entry.status]?.bg || '#636366'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </section>
      </div>

      {/* ── Bottom Row ──────────────────────────────────────── */}
      <div className="dashboard-bottom page-shell">
        {/* Recent Activity Timeline */}
        <section className="activity-panel glass-card">
          <div className="panel-header">
            <div>
              <h2>Recent Activity</h2>
              <p>Latest samples in the pipeline</p>
            </div>
            <button className="panel-link" onClick={() => navigate('/samples/tracking')}>
              View All <span className="material-icons" style={{ fontSize: '1rem' }}>arrow_forward</span>
            </button>
          </div>
          <div className="activity-timeline">
            {recentSamples.slice(0, 6).map((sample, i) => {
              const col = STATUS_COLORS[sample.status] || STATUS_COLORS.Unknown;
              return (
                <motion.div
                  key={sample.id}
                  className="timeline-item"
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.06 }}
                >
                  <div className="timeline-left">
                    <div className="timeline-dot" style={{ background: col.bg, boxShadow: `0 0 8px ${col.glow}` }} />
                    {i < recentSamples.slice(0, 6).length - 1 && <div className="timeline-line" />}
                  </div>
                  <div className="timeline-card glass-card">
                    <div className="timeline-main">
                      <span className="timeline-id">{sample.id}</span>
                      <span className="timeline-patient">{sample.patient}</span>
                    </div>
                    <div className="timeline-meta">
                      <span className="status-pill" style={{ background: `${col.bg}22`, color: col.bg, border: `1px solid ${col.bg}55`, boxShadow: `0 0 8px ${col.glow}` }}>
                        {sample.status}
                      </span>
                      <span className="timeline-date">{sample.date}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
            {recentSamples.length === 0 && (
              <div className="empty-state">
                <span className="material-icons" style={{ fontSize: '2.5rem', color: 'rgba(255,255,255,0.2)', marginBottom: 12 }}>science</span>
                <p>No recent samples</p>
              </div>
            )}
          </div>
        </section>

        {/* Quick Actions Grid */}
        <section className="actions-panel glass-card">
          <div className="panel-header">
            <div>
              <h2>Quick Actions</h2>
              <p>Jump to key workflows</p>
            </div>
          </div>
          <div className="quick-actions-grid">
            {QUICK_ACTIONS.map((action, i) => (
              <motion.button
                key={action.route}
                className="action-card"
                onClick={() => navigate(action.route)}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + i * 0.07 }}
                whileHover={{ y: -6, scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <div className="action-icon" style={{ '--action-color': action.color }}>
                  <span className="material-icons">{action.icon}</span>
                </div>
                <span className="action-label">{action.label}</span>
                <span className="action-desc">{action.desc}</span>
              </motion.button>
            ))}
          </div>
        </section>
      </div>
    </motion.div>
  );
};

export default Dashboard;
