import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import './Login.css';

/* ── Floating particle component ─────────────────────────── */
const Particle = ({ style }) => <div className="login-particle" style={style} />;

const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  left: `${Math.random() * 100}%`,
  animationDuration: `${6 + Math.random() * 10}s`,
  animationDelay: `${Math.random() * 8}s`,
  width: `${2 + Math.random() * 4}px`,
  height: `${2 + Math.random() * 4}px`,
  opacity: 0.3 + Math.random() * 0.5,
}));

/* ── Main Component ──────────────────────────────────────── */
const Login = () => {
  const { login, isAuthenticated } = useAuth();
  const [form, setForm] = useState({ email: '', password: '', rememberMe: false });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard');
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await login(form.email, form.password);
      toast.success('Welcome back! 🩸');
      navigate('/dashboard');
    } catch (err) {
      const message = err.response?.data?.message || 'Invalid credentials. Please try again.';
      setError(message);
      toast.error(message, { duration: 4000 });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Animated background */}
      <div className="login-bg">
        <div className="login-orb login-orb-1" />
        <div className="login-orb login-orb-2" />
        <div className="login-orb login-orb-3" />
      </div>
      <div className="login-particles">
        {PARTICLES.map((s, i) => <Particle key={i} style={s} />)}
      </div>

      {/* ── Left Hero Panel ─────────────────────────────────── */}
      <motion.div
        className="login-hero-panel"
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        {/* Logo */}
        <div className="hero-logo-wrap">
          <div className="hero-logo-3d">
            <div className="blood-drop-3d">
              <div className="blood-drop-inner" />
            </div>
          </div>
          <div className="hero-brand-text">
            <h2>BloodLab Elite</h2>
            <span>Clinical Intelligence Platform</span>
          </div>
        </div>

        <h1 className="hero-headline">
          Next-Gen Lab<br /><span>Management</span>
        </h1>
        <p className="hero-subtext">
          The most advanced blood sample management system trusted by clinics worldwide. AI-powered, real-time, secure.
        </p>

        {/* Features */}
        <div className="hero-features">
          {[
            { icon: '🧬', title: 'AI-Powered Analysis', desc: 'Real-time anomaly detection & smart insights', cls: 'fi-red' },
            { icon: '📊', title: 'Live Analytics Dashboard', desc: 'Interactive charts with 14-day trend forecasting', cls: 'fi-violet' },
            { icon: '🔒', title: 'HIPAA Compliant Security', desc: 'End-to-end encryption with role-based access', cls: 'fi-blue' },
          ].map((f, i) => (
            <motion.div
              key={i}
              className="hero-feature"
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.15, duration: 0.5 }}
            >
              <div className={`feature-icon ${f.cls}`}>{f.icon}</div>
              <div className="hero-feature-text">
                <h4>{f.title}</h4>
                <p>{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="hero-stats">
          {[
            { val: '10K+', label: 'Samples Tracked' },
            { val: '99.9%', label: 'Uptime' },
            { val: '<2hr', label: 'Avg TAT' },
          ].map((s, i) => (
            <div key={i} className="hero-stat">
              <strong>{s.val}</strong>
              <span>{s.label}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── Right Form Panel ─────────────────────────────────── */}
      <motion.div
        className="login-form-panel"
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <div className="login-form-header">
          <div className="login-badge">
            <span className="login-badge-dot" />
            Secure Access
          </div>
          <h1>Welcome back</h1>
          <p>Sign in to your BloodLab Elite account</p>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              className="login-error"
              initial={{ opacity: 0, y: -8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.25 }}
            >
              ⚠️ {error}
            </motion.div>
          )}
        </AnimatePresence>

        <form className="login-form" onSubmit={handleSubmit} noValidate>
          {/* Email */}
          <div className="form-field">
            <label htmlFor="login-email" className="field-label">Email Address</label>
            <div className="input-wrap">
              <span className="input-icon material-icons">alternate_email</span>
              <input
                id="login-email"
                className="form-input"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="admin@lab.com"
                required
                autoComplete="email"
              />
            </div>
          </div>

          {/* Password */}
          <div className="form-field">
            <label htmlFor="login-password" className="field-label">Password</label>
            <div className="input-wrap">
              <span className="input-icon material-icons">lock</span>
              <input
                id="login-password"
                className="form-input"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="toggle-pw-btn"
                onClick={() => setShowPassword(p => !p)}
                tabIndex={-1}
                aria-label="Toggle password visibility"
              >
                <span className="material-icons" style={{ fontSize: '1.15rem' }}>
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>

          {/* Meta row */}
          <div className="login-meta">
            <label className="remember-label">
              <input
                type="checkbox"
                name="rememberMe"
                checked={form.rememberMe}
                onChange={handleChange}
              />
              Remember me
            </label>
            <Link className="forgot-link" to="/register">Create account</Link>
          </div>

          {/* Submit */}
          <motion.button
            type="submit"
            className="login-submit"
            disabled={isLoading}
            whileTap={{ scale: 0.98 }}
          >
            {isLoading ? (
              <><span className="btn-spinner" />Signing In...</>
            ) : (
              'Sign In to BloodLab'
            )}
          </motion.button>
        </form>

        <div className="form-divider">or</div>

        <div className="login-footer-link">
          New to BloodLab? <Link to="/register">Create your account →</Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
