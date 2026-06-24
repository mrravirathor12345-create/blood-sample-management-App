import React, { useEffect, useState, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationsContext';
import ThreeDBloodDrop from './ThreeDBloodDrop';
import CommandPalette from './CommandPalette';
import NotificationsPanel from './NotificationsPanel';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { unreadCount, togglePanel } = useNotifications();
  const location = useLocation();
  const [theme, setTheme] = useState('dark');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  /* Scroll shadow */
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  /* Theme persistence */
  useEffect(() => {
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(saved || (prefersDark ? 'dark' : 'light'));
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  /* Ctrl+K → open command palette */
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setCmdOpen(true);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  /* Close profile dropdown on outside click */
  useEffect(() => {
    const handler = (e) => {
      if (!e.target.closest('.profile-menu')) setIsProfileOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  /* Close mobile menu on route change */
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsProfileOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark');

  if (!isAuthenticated) return null;

  const navLinks = [
    { to: '/dashboard',          label: 'Dashboard' },
    { to: '/analytics',          label: 'Analytics' },
    { to: '/samples/collection', label: 'Samples' },
    { to: '/reports/generation', label: 'Reports' },
    { to: '/appointments',       label: 'Appointments' },
  ];

  return (
    <>
      <nav className={`navbar glass-card ${scrolled ? 'scrolled' : ''}`}>
        {/* ── Brand ─────────────────────────────────────── */}
        <div className="nav-left">
          <Link to="/dashboard" className="nav-brand">
            <div className="nav-logo-wrap">
              <ThreeDBloodDrop />
            </div>
            <div className="nav-brand-text">
              <span className="nav-title">BloodLab Elite</span>
              <span className="nav-subtitle">Clinical Intelligence</span>
            </div>
          </Link>
        </div>

        {/* ── Center nav links (desktop) ─────────────────── */}
        <div className={`nav-links ${isMobileMenuOpen ? 'open' : ''}`}>
          {navLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`nav-link ${location.pathname === to ? 'active' : ''}`}
            >
              {label}
              <span className="nav-link-indicator" />
            </Link>
          ))}
        </div>

        {/* ── Actions ───────────────────────────────────── */}
        <div className="nav-actions">
          {/* Command palette trigger */}
          <button
            className="cmd-trigger icon-button"
            onClick={() => setCmdOpen(true)}
            aria-label="Open command palette (Ctrl+K)"
            title="Search (Ctrl+K)"
          >
            <span className="material-icons">search</span>
            <span className="cmd-hint">⌘K</span>
          </button>

          {/* Theme toggle */}
          <button className="icon-button" onClick={toggleTheme} aria-label="Toggle theme">
            <span className="material-icons">{theme === 'dark' ? 'dark_mode' : 'light_mode'}</span>
          </button>

          {/* Notifications */}
          <button
            className="icon-button notification-button"
            onClick={togglePanel}
            aria-label="Notifications"
          >
            <span className="material-icons">notifications</span>
            {unreadCount > 0 && (
              <span className="notification-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
            )}
          </button>

          {/* Profile dropdown */}
          <div className="profile-menu">
            <button
              className="profile-button"
              onClick={() => setIsProfileOpen(prev => !prev)}
              type="button"
              aria-expanded={isProfileOpen}
            >
              <div className="profile-avatar">
                <span>{user?.firstName?.[0] || 'D'}</span>
                <div className="avatar-online" />
              </div>
              <div className="profile-info">
                <span>{user?.firstName || 'Dr'} {user?.lastName || 'User'}</span>
                <small>{user?.role || 'Lab Admin'}</small>
              </div>
              <span className="material-icons profile-chevron" style={{ transform: isProfileOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.25s' }}>
                expand_more
              </span>
            </button>

            {isProfileOpen && (
              <div className="profile-dropdown glass-card">
                <div className="dropdown-user-header">
                  <div className="dropdown-avatar">{user?.firstName?.[0] || 'D'}</div>
                  <div>
                    <p className="dropdown-name">{user?.firstName} {user?.lastName}</p>
                    <p className="dropdown-email">{user?.email || 'lab@hospital.com'}</p>
                  </div>
                </div>
                <div className="dropdown-divider" />
                <Link to="/profile" className="dropdown-item">
                  <span className="material-icons">account_circle</span>My Profile
                </Link>
                <Link to="/admin" className="dropdown-item">
                  <span className="material-icons">admin_panel_settings</span>Admin Center
                </Link>
                <Link to="/inventory" className="dropdown-item">
                  <span className="material-icons">inventory</span>Inventory
                </Link>
                <div className="dropdown-divider" />
                <button type="button" className="dropdown-item logout-item" onClick={handleLogout}>
                  <span className="material-icons">logout</span>Sign Out
                </button>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="nav-toggle"
            onClick={() => setIsMobileMenuOpen(prev => !prev)}
            aria-label="Toggle mobile menu"
          >
            <span className="material-icons">{isMobileMenuOpen ? 'close' : 'menu'}</span>
          </button>
        </div>
      </nav>

      {/* Global overlays */}
      <NotificationsPanel />
      <CommandPalette isOpen={cmdOpen} onClose={() => setCmdOpen(false)} />
    </>
  );
};

export default Navbar;
