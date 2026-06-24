import React, { createContext, useContext, useState, useCallback } from 'react';

const NotificationsContext = createContext(null);

let _idCounter = 1;

export const NotificationsProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([
    { id: _idCounter++, type: 'critical', title: 'Urgent Sample Flagged', body: 'Sample #SMP-0042 shows critical hemoglobin levels. Immediate review required.', time: new Date(Date.now() - 5 * 60000), read: false },
    { id: _idCounter++, type: 'warning',  title: 'Low Reagent Stock', body: 'HbA1c reagent kit below 20% threshold. Consider re-ordering soon.', time: new Date(Date.now() - 18 * 60000), read: false },
    { id: _idCounter++, type: 'info',     title: 'Doctor Review Pending', body: '3 reports are awaiting Dr. Sharma\'s sign-off. Due by 6:00 PM today.', time: new Date(Date.now() - 42 * 60000), read: false },
    { id: _idCounter++, type: 'success',  title: 'Batch Processing Complete', body: 'CBC batch of 12 samples successfully processed and results uploaded.', time: new Date(Date.now() - 90 * 60000), read: true },
    { id: _idCounter++, type: 'info',     title: 'New Patient Registered', body: 'Patient Ravi Kumar has been registered. Awaiting sample collection assignment.', time: new Date(Date.now() - 3 * 3600000), read: true },
  ]);

  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const addNotification = useCallback((notification) => {
    setNotifications(prev => [{
      id: _idCounter++,
      time: new Date(),
      read: false,
      type: 'info',
      ...notification,
    }, ...prev]);
  }, []);

  const markRead = useCallback((id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const openPanel  = useCallback(() => setIsOpen(true),  []);
  const closePanel = useCallback(() => setIsOpen(false), []);
  const togglePanel= useCallback(() => setIsOpen(p => !p), []);

  return (
    <NotificationsContext.Provider value={{
      notifications, unreadCount,
      isOpen, openPanel, closePanel, togglePanel,
      addNotification, markRead, markAllRead, clearAll,
    }}>
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = () => {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error('useNotifications must be used inside NotificationsProvider');
  return ctx;
};
