import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [theme, setTheme] = useState('light');
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);

  // Check for saved theme or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else if (systemPrefersDark) {
      setTheme('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, []);

  // Apply theme changes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    // Update body background color based on theme
    if (theme === 'dark') {
      document.body.style.backgroundColor = '#121212';
    } else {
      document.body.style.backgroundColor = '#f5f7fa';
    }
  }, [theme]);

  const toggleTheme = (selectedTheme) => {
    setTheme(selectedTheme);
    setIsThemeMenuOpen(false);
  };

  const getThemeIcon = () => {
    if (theme === 'dark') return '🌙';
    if (theme === 'light') return '☀️';
    return '🌈';
  };

  return (
    <nav className="navbar glass-card">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <div className="logo-icon">🩸</div>
          <span className="logo-text">BloodSample Manager</span>
        </Link>
        
        <div className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          <Link to="/dashboard" className="nav-link">Dashboard</Link>
          <Link to="/patients/register" className="nav-link">Patients</Link>
          <Link to="/samples/collection" className="nav-link">Samples</Link>
          <Link to="/tests/assignment" className="nav-link">Tests</Link>
          <Link to="/reports/generation" className="nav-link">Reports</Link>
          <Link to="/analytics" className="nav-link">Analytics</Link>
        </div>
        
        <div className="nav-icons">
          <button className="nav-icon-btn">
            <span className="material-icons">search</span>
          </button>
          <button className="nav-icon-btn">
            <span className="material-icons">notifications</span>
            <span className="notification-badge">3</span>
          </button>
          
          <div className="theme-selector">
            <button 
              className="nav-icon-btn theme-toggle"
              onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
            >
              <span className="theme-icon">{getThemeIcon()}</span>
            </button>
            
            {isThemeMenuOpen && (
              <div className="theme-dropdown glass-card">
                <button 
                  className={`theme-option ${theme === 'light' ? 'active' : ''}`}
                  onClick={() => toggleTheme('light')}
                >
                  <span className="theme-option-icon">☀️</span>
                  Light Mode
                </button>
                <button 
                  className={`theme-option ${theme === 'dark' ? 'active' : ''}`}
                  onClick={() => toggleTheme('dark')}
                >
                  <span className="theme-option-icon">🌙</span>
                  Dark Mode
                </button>
                <button 
                  className={`theme-option ${theme === 'auto' ? 'active' : ''}`}
                  onClick={() => toggleTheme('auto')}
                >
                  <span className="theme-option-icon">🌈</span>
                  Auto (System)
                </button>
              </div>
            )}
          </div>
          
          <Link to="/profile" className="nav-profile">
            <div className="profile-avatar">👤</div>
            <span className="profile-name">Dr. Smith</span>
          </Link>
        </div>
        
        <div className="nav-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;