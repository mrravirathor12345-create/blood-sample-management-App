import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotifications } from '../context/NotificationsContext';
import './NotificationsPanel.css';

const TYPE_META = {
  critical: { icon: 'warning',       color: '#ff3c6e', bg: 'rgba(255,60,110,0.14)', label: 'Critical' },
  warning:  { icon: 'notification_important', color: '#ff9b3d', bg: 'rgba(255,155,61,0.14)', label: 'Warning' },
  info:     { icon: 'info',           color: '#5b8dff', bg: 'rgba(91,141,255,0.14)', label: 'Info' },
  success:  { icon: 'check_circle',   color: '#22d77a', bg: 'rgba(34,215,122,0.14)', label: 'Done' },
};

const timeAgo = (date) => {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
};

const NotificationsPanel = () => {
  const { notifications, isOpen, closePanel, markRead, markAllRead, clearAll, unreadCount } = useNotifications();
  const panelRef = useRef(null);
  const [activeFilter, setActiveFilter] = useState('All');

  const filteredNotifications = notifications.filter(n => {
    if (activeFilter === 'Unread') return !n.read;
    if (activeFilter === 'Critical') return n.type === 'critical';
    return true;
  });

  /* Close on outside click */
  useEffect(() => {
    const handle = (e) => {
      if (isOpen && panelRef.current && !panelRef.current.contains(e.target)) {
        closePanel();
      }
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [isOpen, closePanel]);

  /* Close on Escape */
  useEffect(() => {
    const handle = (e) => { if (e.key === 'Escape') closePanel(); };
    document.addEventListener('keydown', handle);
    return () => document.removeEventListener('keydown', handle);
  }, [closePanel]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="notif-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closePanel}
          />

          {/* Slide-in panel */}
          <motion.aside
            ref={panelRef}
            className="notif-panel glass-card"
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          >
            {/* Header */}
            <div className="notif-header">
              <div className="notif-title-wrap">
                <span className="material-icons notif-header-icon">notifications</span>
                <div>
                  <h2>Notifications</h2>
                  {unreadCount > 0 && (
                    <span className="notif-unread-label">{unreadCount} unread</span>
                  )}
                </div>
              </div>
              <div className="notif-header-actions">
                {unreadCount > 0 && (
                  <button className="notif-action-btn" onClick={markAllRead} title="Mark all read">
                    <span className="material-icons">done_all</span>
                  </button>
                )}
                <button className="notif-action-btn danger" onClick={clearAll} title="Clear all">
                  <span className="material-icons">delete_sweep</span>
                </button>
                <button className="notif-close-btn" onClick={closePanel}>
                  <span className="material-icons">close</span>
                </button>
              </div>
            </div>

            {/* Filter tabs */}
            <div className="notif-tabs">
              {['All', 'Unread', 'Critical'].map(tab => (
                <button 
                  key={tab} 
                  className={`notif-tab ${activeFilter === tab ? 'active' : ''}`}
                  onClick={() => setActiveFilter(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* List */}
            <div className="notif-list">
              {filteredNotifications.length === 0 ? (
                <div className="notif-empty">
                  <span className="material-icons notif-empty-icon">notifications_none</span>
                  <p>No notifications</p>
                </div>
              ) : (
                <AnimatePresence>
                  {filteredNotifications.map((n, i) => {
                    const meta = TYPE_META[n.type] || TYPE_META.info;
                    return (
                      <motion.div
                        key={n.id}
                        className={`notif-item ${n.read ? 'read' : 'unread'}`}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20, height: 0 }}
                        transition={{ delay: i * 0.04, duration: 0.25 }}
                        onClick={() => markRead(n.id)}
                      >
                        <div className="notif-icon-wrap" style={{ background: meta.bg }}>
                          <span className="material-icons" style={{ color: meta.color }}>{meta.icon}</span>
                        </div>
                        <div className="notif-body">
                          <div className="notif-item-header">
                            <span className="notif-item-title">{n.title}</span>
                            <span className="notif-type-badge" style={{ color: meta.color, background: meta.bg }}>
                              {meta.label}
                            </span>
                          </div>
                          <p className="notif-item-body">{n.body}</p>
                          <span className="notif-time">{timeAgo(n.time)}</span>
                        </div>
                        {!n.read && <div className="notif-unread-dot" />}
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default NotificationsPanel;
