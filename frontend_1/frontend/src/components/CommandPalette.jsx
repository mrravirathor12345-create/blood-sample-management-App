import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import './CommandPalette.css';

const ALL_COMMANDS = [
  { id: 'dashboard',     label: 'Dashboard',           desc: 'Overview & live stats',           icon: 'dashboard',             path: '/dashboard',         category: 'Navigation' },
  { id: 'patients',      label: 'Register Patient',     desc: 'Add a new patient record',        icon: 'group_add',             path: '/patients/register', category: 'Navigation' },
  { id: 'samples',       label: 'Sample Collection',    desc: 'Collect & log blood samples',     icon: 'science',               path: '/samples/collection',category: 'Navigation' },
  { id: 'tracking',      label: 'Sample Tracking',      desc: 'Track sample pipeline status',    icon: 'gps_fixed',             path: '/samples/tracking',  category: 'Navigation' },
  { id: 'tests',         label: 'Test Assignment',       desc: 'Assign lab tests to samples',     icon: 'assignment',            path: '/tests/assignment',  category: 'Navigation' },
  { id: 'results',       label: 'Test Results Entry',   desc: 'Enter and update test results',   icon: 'edit_note',             path: '/tests/results',     category: 'Navigation' },
  { id: 'review',        label: 'Doctor Review',         desc: 'Review & sign off on reports',    icon: 'rate_review',           path: '/doctors/review',    category: 'Navigation' },
  { id: 'reports',       label: 'Report Generation',    desc: 'Generate & export PDF reports',   icon: 'picture_as_pdf',        path: '/reports/generation',category: 'Navigation' },
  { id: 'analytics',     label: 'Analytics Dashboard',  desc: 'Charts, trends & statistics',     icon: 'analytics',             path: '/analytics',         category: 'Navigation' },
  { id: 'ai',            label: 'AI Analysis',           desc: 'AI-powered lab insights',         icon: 'psychology',            path: '/ai-analytics',      category: 'Navigation' },
  { id: 'scanner',       label: 'Barcode Scanner',       desc: 'Scan & look up samples',          icon: 'qr_code_scanner',       path: '/samples/scanner',   category: 'Navigation' },
  { id: 'appointments',  label: 'Appointments',          desc: 'Manage patient appointments',     icon: 'calendar_month',        path: '/appointments',      category: 'Navigation' },
  { id: 'inventory',     label: 'Inventory Tracker',    desc: 'Manage lab reagents & supplies',  icon: 'inventory',             path: '/inventory',         category: 'Navigation' },
  { id: 'admin',         label: 'Admin Control Center', desc: 'System settings & user management',icon: 'admin_panel_settings',  path: '/admin',             category: 'Navigation' },
  { id: 'profile',       label: 'My Profile',            desc: 'View & edit your account',        icon: 'account_circle',        path: '/profile',           category: 'Navigation' },
];

const CommandPalette = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(0);
  const inputRef = useRef(null);
  const listRef  = useRef(null);
  const navigate = useNavigate();

  const filtered = useMemo(() => {
    if (!query.trim()) return ALL_COMMANDS;
    const q = query.toLowerCase();
    return ALL_COMMANDS.filter(c =>
      c.label.toLowerCase().includes(q) ||
      c.desc.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q)
    );
  }, [query]);

  /* Reset on open */
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelected(0);
      setTimeout(() => inputRef.current?.focus(), 60);
    }
  }, [isOpen]);

  /* Scroll selected into view */
  useEffect(() => {
    const el = listRef.current?.querySelector('.cp-item.selected');
    el?.scrollIntoView({ block: 'nearest' });
  }, [selected]);

  const execute = (cmd) => {
    navigate(cmd.path);
    onClose();
  };

  useEffect(() => {
    const handler = (e) => {
      if (!isOpen) return;
      if (e.key === 'Escape')     { onClose(); return; }
      if (e.key === 'ArrowDown')  { e.preventDefault(); setSelected(s => Math.min(s + 1, filtered.length - 1)); }
      if (e.key === 'ArrowUp')    { e.preventDefault(); setSelected(s => Math.max(s - 1, 0)); }
      if (e.key === 'Enter')      { if (filtered[selected]) execute(filtered[selected]); }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, filtered, selected]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="cp-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onClose}
          />

          <motion.div
            className="cp-wrapper"
            initial={{ opacity: 0, scale: 0.94, y: -24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: -24 }}
            transition={{ type: 'spring', damping: 28, stiffness: 380 }}
          >
            {/* Search input */}
            <div className="cp-search">
              <span className="material-icons cp-search-icon">search</span>
              <input
                ref={inputRef}
                className="cp-input"
                type="text"
                placeholder="Search pages, actions…"
                value={query}
                onChange={e => { setQuery(e.target.value); setSelected(0); }}
                autoComplete="off"
              />
              {query && (
                <button className="cp-clear" onClick={() => { setQuery(''); setSelected(0); inputRef.current?.focus(); }}>
                  <span className="material-icons">close</span>
                </button>
              )}
              <span className="cp-kbd">ESC</span>
            </div>

            {/* Results */}
            <div className="cp-list" ref={listRef}>
              {filtered.length === 0 ? (
                <div className="cp-empty">
                  <span className="material-icons">search_off</span>
                  <span>No results for "{query}"</span>
                </div>
              ) : (
                filtered.map((cmd, i) => (
                  <button
                    key={cmd.id}
                    className={`cp-item ${i === selected ? 'selected' : ''}`}
                    onClick={() => execute(cmd)}
                    onMouseEnter={() => setSelected(i)}
                  >
                    <div className="cp-item-icon">
                      <span className="material-icons">{cmd.icon}</span>
                    </div>
                    <div className="cp-item-text">
                      <span className="cp-item-label">{cmd.label}</span>
                      <span className="cp-item-desc">{cmd.desc}</span>
                    </div>
                    <span className="material-icons cp-item-arrow">arrow_forward</span>
                  </button>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="cp-footer">
              <span><span className="cp-kbd-sm">↑↓</span> Navigate</span>
              <span><span className="cp-kbd-sm">↵</span> Open</span>
              <span><span className="cp-kbd-sm">ESC</span> Close</span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CommandPalette;
