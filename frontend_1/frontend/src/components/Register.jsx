import React, { useState, useEffect, useMemo } from 'react';
import { toast } from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/apiService';
import './Register.css';

/* ── Password strength calculator ─────────────────────────── */
const calcStrength = (pw) => {
  let score = 0;
  if (pw.length >= 8)  score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score; // 0-4
};
const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
const strengthClasses = ['', 'weak', 'fair', 'good', 'strong'];

const PARTICLES = Array.from({ length: 14 }, (_, i) => ({
  left: `${Math.random() * 100}%`,
  animationDuration: `${7 + Math.random() * 10}s`,
  animationDelay: `${Math.random() * 9}s`,
  width: `${2 + Math.random() * 3}px`,
  height: `${2 + Math.random() * 3}px`,
}));

const Field = ({ label, name, type = 'text', placeholder, icon, value, onChange, children }) => {
  const fieldId = `reg-${name}`;
  return (
    <div className="reg-form-field">
      <label htmlFor={fieldId} className="reg-field-label">{label}</label>
      <div className="reg-input-wrap">
        {icon && <span className="reg-input-icon material-icons">{icon}</span>}
        {children || (
          <input
            id={fieldId}
            className="reg-input"
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required
            autoComplete="off"
          />
        )}
      </div>
    </div>
  );
};

const Register = () => {
  const [data, setData] = useState({
    username: '', firstName: '', lastName: '',
    email: '', password: '', confirmPassword: '',
    role: '', employeeId: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [showCpw, setShowCpw] = useState(false);
  const navigate = useNavigate();

  useEffect(() => { toast.dismiss(); }, []);

  const strength = useMemo(() => calcStrength(data.password), [data.password]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  /* Progress steps: fill based on filled fields */
  const filledCount = Object.values(data).filter(Boolean).length;
  const progress = Math.min(3, Math.floor((filledCount / 8) * 3));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!data.username)           { setError('Username is required'); return; }
    if (data.password !== data.confirmPassword) { setError('Passwords do not match'); return; }
    if (data.password.length < 8) { setError('Password must be at least 8 characters'); return; }
    setIsLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/register', {
        username: data.username, email: data.email,
        password: data.password, firstName: data.firstName,
        lastName: data.lastName, role: data.role, employeeId: data.employeeId,
      });
      if (res.status === 201) {
        setSuccess(true);
        toast.success('Account created! Redirecting to login…');
        setTimeout(() => navigate('/login'), 2200);
      } else {
        setError('Registration failed. Please try again.');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Please try again.';
      setError(msg);
      toast.error(msg, { duration: 4000 });
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="register-page">
      {/* Animated background */}
      <div className="register-bg">
        <div className="register-orb register-orb-1" />
        <div className="register-orb register-orb-2" />
      </div>
      <div className="register-particles">
        {PARTICLES.map((s, i) => (
          <div key={i} className="register-particle" style={s} />
        ))}
      </div>

      {/* ── Left Panel ────────────────────────────────────── */}
      <motion.div
        className="register-hero-panel"
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <div className="reg-logo-wrap">
          <div className="dna-3d-wrap">
            <div className="dna-3d">🧬</div>
          </div>
          <div className="reg-brand-text">
            <h2>BloodLab Elite</h2>
            <span>Clinical Intelligence</span>
          </div>
        </div>

        <h1 className="reg-headline">
          Join the<br /><span>Elite Network</span>
        </h1>
        <p className="reg-subtext">
          Create your secure lab account and gain access to AI-powered sample management, real-time analytics, and clinical intelligence tools.
        </p>

        <div className="reg-steps">
          {[
            { n: '1', t: 'Create Account', d: 'Fill in your personal & role details' },
            { n: '2', t: 'Admin Approval', d: 'Account is verified by lab administrator' },
            { n: '3', t: 'Access Granted', d: 'Sign in and start managing samples' },
          ].map((s, i) => (
            <motion.div
              key={i}
              className="reg-step"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.15 }}
            >
              <div className="reg-step-num">{s.n}</div>
              <div className="reg-step-text">
                <h4>{s.t}</h4>
                <p>{s.d}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="reg-roles">
          <h4>Available Roles</h4>
          <div className="reg-roles-grid">
            {['Admin', 'Doctor', 'Lab Technician', 'Nurse', 'Receptionist'].map(r => (
              <span key={r} className="role-tag">{r}</span>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── Right Form Panel ──────────────────────────────── */}
      <motion.div
        className="register-form-panel"
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <div className="register-form-header">
          <div className="reg-badge">
            <span className="reg-badge-dot" />
            New Account
          </div>
          <h1>Create Account</h1>
          <p>Join the BloodLab Elite platform today</p>
        </div>

        {/* Progress bar */}
        <div className="reg-progress">
          {[0, 1, 2].map(i => (
            <div key={i} className={`reg-progress-step ${i < progress ? 'done' : ''}`} />
          ))}
        </div>

        <AnimatePresence>
          {error && (
            <motion.div className="reg-error"
              initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              ⚠️ {error}
            </motion.div>
          )}
          {success && (
            <motion.div className="reg-success"
              initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}>
              ✅ Registration successful! Redirecting to login…
            </motion.div>
          )}
        </AnimatePresence>

        <form className="register-form" onSubmit={handleSubmit} noValidate>
          {/* Name row */}
          <div className="reg-form-row">
            <Field label="First Name" name="firstName" placeholder="John" icon="person" value={data.firstName} onChange={handleChange} />
            <Field label="Last Name"  name="lastName"  placeholder="Doe"  icon="person_outline" value={data.lastName} onChange={handleChange} />
          </div>

          {/* Username & Employee ID */}
          <div className="reg-form-row">
            <Field label="Username" name="username" placeholder="jdoe_lab" icon="badge" value={data.username} onChange={handleChange} />
            <Field label="Employee ID" name="employeeId" placeholder="EMP-0001" icon="tag" value={data.employeeId} onChange={handleChange} />
          </div>

          {/* Email */}
          <Field label="Email Address" name="email" type="email" placeholder="john@lab.com" icon="alternate_email" value={data.email} onChange={handleChange} />

          {/* Role */}
          <div className="reg-form-field">
            <label htmlFor="reg-role" className="reg-field-label">Role</label>
            <div className="reg-input-wrap">
              <span className="reg-input-icon material-icons">work</span>
              <select
                id="reg-role"
                className="reg-select"
                name="role"
                value={data.role}
                onChange={handleChange}
                required
              >
                <option value="">Select your role</option>
                <option value="Admin">Admin</option>
                <option value="Doctor">Doctor</option>
                <option value="Lab Technician">Lab Technician</option>
                <option value="Nurse">Nurse</option>
                <option value="Receptionist">Receptionist</option>
              </select>
            </div>
          </div>

          {/* Password row */}
          <div className="reg-form-row">
            <div className="reg-form-field">
              <label htmlFor="reg-password" className="reg-field-label">Password</label>
              <div className="reg-input-wrap">
                <span className="reg-input-icon material-icons">lock</span>
                <input
                  id="reg-password"
                  className="reg-input"
                  type={showPw ? 'text' : 'password'}
                  name="password"
                  value={data.password}
                  onChange={handleChange}
                  placeholder="Min. 8 chars"
                  required
                />
                <button type="button" className="toggle-pw-btn"
                  onClick={() => setShowPw(p => !p)} tabIndex={-1}>
                  <span className="material-icons" style={{ fontSize: '1.1rem' }}>
                    {showPw ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
              {data.password && (
                <div className="pw-strength-wrap">
                  <div className="pw-strength-bar">
                    {[1,2,3,4].map(n => (
                      <div key={n} className={`pw-strength-seg ${strength >= n ? strengthClasses[strength] : ''}`} />
                    ))}
                  </div>
                  <span className="pw-strength-label">{strengthLabels[strength]}</span>
                </div>
              )}
            </div>

            <div className="reg-form-field">
              <label htmlFor="reg-confirmPassword" className="reg-field-label">Confirm Password</label>
              <div className="reg-input-wrap">
                <span className="reg-input-icon material-icons">lock_reset</span>
                <input
                  id="reg-confirmPassword"
                  className="reg-input"
                  type={showCpw ? 'text' : 'password'}
                  name="confirmPassword"
                  value={data.confirmPassword}
                  onChange={handleChange}
                  placeholder="Repeat password"
                  required
                />
                <button type="button" className="toggle-pw-btn"
                  onClick={() => setShowCpw(p => !p)} tabIndex={-1}>
                  <span className="material-icons" style={{ fontSize: '1.1rem' }}>
                    {showCpw ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>
          </div>

          <motion.button
            type="submit"
            className="register-submit"
            disabled={isLoading || success}
            whileTap={{ scale: 0.97 }}
          >
            {isLoading ? (
              <><span className="btn-spinner" />Creating Account…</>
            ) : success ? (
              '✅ Redirecting…'
            ) : (
              'Create My Account'
            )}
          </motion.button>

          <p className="reg-terms">
            By registering you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
          </p>
        </form>

        <div className="register-footer-link">
          Already have an account? <Link to="/login">Sign in →</Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
