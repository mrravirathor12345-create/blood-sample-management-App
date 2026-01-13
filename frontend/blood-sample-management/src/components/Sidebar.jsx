import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/dashboard', icon: 'dashboard', label: 'Dashboard' },
    { path: '/patients/register', icon: 'group_add', label: 'Patients' },
    { path: '/samples/collection', icon: 'science', label: 'Sample Collection' },
    { path: '/samples/tracking', icon: 'gps_fixed', label: 'Sample Tracking' },
    { path: '/tests/assignment', icon: 'assignment', label: 'Test Assignment' },
    { path: '/tests/results', icon: 'edit_note', label: 'Test Results' },
    { path: '/doctors/review', icon: 'rate_review', label: 'Doctor Review' },
    { path: '/reports/generation', icon: 'picture_as_pdf', label: 'Report Generation' },
    { path: '/analytics', icon: 'analytics', label: 'Analytics' },
    { path: '/ai-analytics', icon: 'psychology', label: 'AI Analytics' },
    { path: '/admin', icon: 'admin_panel_settings', label: 'Admin Control' },
  ];

  return (
    <div className="sidebar glass-card">
      <div className="sidebar-menu">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`sidebar-item ${
              location.pathname === item.path ? 'active' : ''
            }`}
          >
            <span className="material-icons">{item.icon}</span>
            <span className="sidebar-label">{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;