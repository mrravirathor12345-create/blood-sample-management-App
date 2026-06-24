import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Sidebar.css';

const MENU_GROUPS = [
  {
    label: 'Core',
    items: [
      { path: '/dashboard',         icon: 'dashboard',            label: 'Dashboard' },
      { path: '/patients/register', icon: 'group_add',            label: 'Patients' },
      { path: '/appointments',      icon: 'calendar_month',        label: 'Appointments' },
    ],
  },
  {
    label: 'Lab',
    items: [
      { path: '/samples/collection',icon: 'science',              label: 'Collection' },
      { path: '/samples/tracking',  icon: 'gps_fixed',            label: 'Tracking' },
      { path: '/samples/scanner',   icon: 'qr_code_scanner',      label: 'Scanner' },
      { path: '/tests/assignment',  icon: 'assignment',           label: 'Tests' },
      { path: '/tests/results',     icon: 'edit_note',            label: 'Results' },
      { path: '/inventory',         icon: 'inventory',            label: 'Inventory' },
    ],
  },
  {
    label: 'Reports',
    items: [
      { path: '/doctors/review',    icon: 'rate_review',          label: 'Review' },
      { path: '/reports/generation',icon: 'picture_as_pdf',       label: 'Reports' },
      { path: '/analytics',         icon: 'analytics',            label: 'Analytics' },
      { path: '/ai-analytics',      icon: 'psychology',           label: 'AI Insights' },
    ],
  },
  {
    label: 'Admin',
    items: [
      { path: '/admin',             icon: 'admin_panel_settings', label: 'Admin' },
      { path: '/profile',           icon: 'account_circle',       label: 'Profile' },
    ],
  },
];

const Sidebar = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(() => {
    return localStorage.getItem('sidebarCollapsed') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', collapsed);
  }, [collapsed]);

  if (!isAuthenticated) return null;

  return (
    <aside className={`sidebar glass-card ${collapsed ? 'collapsed' : ''}`}>
      {/* Toggle */}
      <div className="sidebar-header">
        <button
          className="collapse-toggle"
          type="button"
          onClick={() => setCollapsed(prev => !prev)}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <span className="material-icons">
            {collapsed ? 'chevron_right' : 'chevron_left'}
          </span>
        </button>
        {!collapsed && <span className="sidebar-title">Workspace</span>}
      </div>

      {/* Groups */}
      <nav className="sidebar-menu">
        {MENU_GROUPS.map((group, gi) => (
          <div key={gi} className="sidebar-group">
            {!collapsed && (
              <span className="sidebar-group-label">{group.label}</span>
            )}
            {group.items.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  title={collapsed ? item.label : undefined}
                  className={`sidebar-item ${isActive ? 'active' : ''}`}
                >
                  <span className={`material-icons sidebar-icon ${isActive ? 'active-icon' : ''}`}>
                    {item.icon}
                  </span>
                  {!collapsed && (
                    <span className="sidebar-label">{item.label}</span>
                  )}
                  {isActive && <span className="sidebar-active-bar" />}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
