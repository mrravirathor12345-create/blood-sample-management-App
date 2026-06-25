import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import './AppointmentScheduler.css';

const TODAY = new Date();

const SAMPLE_APPOINTMENTS = [
  { id: 1, patient: 'Ravi Kumar',   test: 'CBC',          doctor: 'Dr. Sharma', time: '09:00', date: formatDate(TODAY, 0), status: 'confirmed', phone: '+91 98765 43210' },
  { id: 2, patient: 'Priya Patel',  test: 'HbA1c',        doctor: 'Dr. Mehta',  time: '10:30', date: formatDate(TODAY, 0), status: 'scheduled', phone: '+91 87654 32109' },
  { id: 3, patient: 'Anil Singh',   test: 'Lipid Panel',  doctor: 'Dr. Kapoor', time: '14:00', date: formatDate(TODAY, 0), status: 'confirmed', phone: '+91 76543 21098' },
  { id: 4, patient: 'Sunita Rao',   test: 'Thyroid Panel',doctor: 'Dr. Reddy',  time: '09:30', date: formatDate(TODAY, 1), status: 'scheduled', phone: '+91 65432 10987' },
  { id: 5, patient: 'Vikram Shah',  test: 'LFT',          doctor: 'Dr. Sharma', time: '11:00', date: formatDate(TODAY, 1), status: 'scheduled', phone: '+91 54321 09876' },
  { id: 6, patient: 'Meera Nair',   test: 'KFT',          doctor: 'Dr. Mehta',  time: '16:00', date: formatDate(TODAY, 2), status: 'cancelled', phone: '+91 43210 98765' },
  { id: 7, patient: 'Arjun Gupta',  test: 'Urine Routine',doctor: 'Dr. Kapoor', time: '08:30', date: formatDate(TODAY, 3), status: 'scheduled', phone: '+91 32109 87654' },
];

function formatDate(base, daysOffset = 0) {
  const d = new Date(base);
  d.setDate(d.getDate() + daysOffset);
  return d.toISOString().split('T')[0];
}

function getMonthMatrix(year, month) {
  const first = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const matrix = [];
  let day = 1 - first;
  for (let row = 0; row < 6; row++) {
    const week = [];
    for (let col = 0; col < 7; col++, day++) {
      week.push(day > 0 && day <= daysInMonth ? day : null);
    }
    matrix.push(week);
    if (day > daysInMonth) break;
  }
  return matrix;
}

const STATUS_STYLES = {
  scheduled: { color: 'var(--apple-blue)', bg: 'rgba(0, 122, 255, 0.14)', label: 'Scheduled' },
  confirmed: { color: 'var(--apple-green)', bg: 'rgba(52, 199, 89, 0.14)', label: 'Confirmed' },
  cancelled: { color: 'var(--apple-red)', bg: 'rgba(255, 59, 48, 0.14)', label: 'Cancelled' },
};

const DOCTORS = ['Dr. Sharma', 'Dr. Mehta', 'Dr. Kapoor', 'Dr. Reddy'];
const TESTS   = ['CBC', 'HbA1c', 'Lipid Panel', 'Thyroid Panel', 'LFT', 'KFT', 'Urine Routine'];
const TIMES   = ['08:00','08:30','09:00','09:30','10:00','10:30','11:00','11:30','12:00','13:00','14:00','14:30','15:00','15:30','16:00','16:30'];

const AppointmentScheduler = () => {
  const [viewYear, setViewYear] = useState(TODAY.getFullYear());
  const [viewMonth, setViewMonth] = useState(TODAY.getMonth());
  const [selectedDate, setSelectedDate] = useState(null);
  const [appointments, setAppointments] = useState(SAMPLE_APPOINTMENTS);
  const [showModal, setShowModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [newAppt, setNewAppt] = useState({ patient: '', test: '', doctor: '', time: '', phone: '', date: '' });

  const matrix = useMemo(() => getMonthMatrix(viewYear, viewMonth), [viewYear, viewMonth]);

  const apptsByDate = useMemo(() => {
    const map = {};
    appointments.forEach(a => {
      if (!map[a.date]) map[a.date] = [];
      map[a.date].push(a);
    });
    return map;
  }, [appointments]);

  const dayStr = (d) => {
    if (!d) return null;
    const dt = new Date(viewYear, viewMonth, d);
    return dt.toISOString().split('T')[0];
  };

  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
    else setViewMonth(m => m + 1);
  };

  const openNew = (date) => {
    setNewAppt({ patient: '', test: '', doctor: '', time: '', phone: '', date: date || formatDate(TODAY, 0) });
    setShowModal(true);
  };

  const saveAppt = () => {
    if (!newAppt.patient || !newAppt.test || !newAppt.doctor || !newAppt.time || !newAppt.date) {
      toast.error('Please fill all required fields');
      return;
    }
    const appt = { ...newAppt, id: Date.now(), status: 'scheduled' };
    setAppointments(prev => [...prev, appt]);
    setShowModal(false);
    toast.success('Appointment scheduled successfully!');
  };

  const cancelAppt = (id) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'cancelled' } : a));
    toast.success('Appointment cancelled');
  };

  const confirmAppt = (id) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'confirmed' } : a));
    toast.success('Appointment confirmed!');
  };

  const todayAppts = apptsByDate[formatDate(TODAY)] || [];

  const filteredAppts = selectedDate
    ? (apptsByDate[selectedDate] || []).filter(a => filterStatus === 'all' || a.status === filterStatus)
    : appointments.filter(a => filterStatus === 'all' || a.status === filterStatus).slice(0, 10);

  const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];

  return (
    <motion.div className="apt-page"
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }} transition={{ duration: 0.45 }}>

      {/* Header */}
      <div className="apt-header page-shell">
        <div>
          <p className="apt-super">Patient Management</p>
          <h1>Appointment Scheduler</h1>
        </div>
        <div className="apt-header-actions">
          <div className="apt-today-count glass-card">
            <span className="material-icons" style={{ color: 'var(--apple-pink)' }}>today</span>
            <div>
              <strong>{todayAppts.length}</strong>
              <span>Today's Appointments</span>
            </div>
          </div>
          <motion.button className="apt-new-btn" onClick={() => openNew()} whileTap={{ scale: 0.97 }}>
            <span className="material-icons">add</span>
            New Appointment
          </motion.button>
        </div>
      </div>

      <div className="apt-body page-shell">
        {/* Calendar */}
        <div className="apt-calendar glass-card">
          {/* Calendar nav */}
          <div className="cal-nav">
            <button className="cal-nav-btn" onClick={prevMonth}>
              <span className="material-icons">chevron_left</span>
            </button>
            <h3 className="cal-title">{MONTH_NAMES[viewMonth]} {viewYear}</h3>
            <button className="cal-nav-btn" onClick={nextMonth}>
              <span className="material-icons">chevron_right</span>
            </button>
          </div>

          {/* Day headers */}
          <div className="cal-day-headers">
            {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
              <span key={d} className="cal-day-header">{d}</span>
            ))}
          </div>

          {/* Grid */}
          <div className="cal-grid">
            {matrix.map((week, wi) =>
              week.map((day, di) => {
                const ds = dayStr(day);
                const dayAppts = ds ? (apptsByDate[ds] || []) : [];
                const isToday = ds === formatDate(TODAY);
                const isSelected = ds === selectedDate;
                const isPast = ds && ds < formatDate(TODAY);
                return (
                  <div
                    key={`${wi}-${di}`}
                    className={`cal-cell ${!day ? 'empty' : ''} ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''} ${isPast ? 'past' : ''}`}
                    onClick={() => { if (day) setSelectedDate(isSelected ? null : ds); }}
                  >
                    {day && (
                      <>
                        <span className="cal-day-num">{day}</span>
                        {dayAppts.length > 0 && (
                          <div className="cal-dots">
                            {dayAppts.slice(0, 3).map((a, i) => (
                              <span key={i} className={`cal-dot ${a.status}`} />
                            ))}
                            {dayAppts.length > 3 && <span className="cal-dot-more">+{dayAppts.length - 3}</span>}
                          </div>
                        )}
                        {!isPast && day && (
                          <button className="cal-add-btn" onClick={(e) => { e.stopPropagation(); openNew(ds); }}>
                            <span className="material-icons">add</span>
                          </button>
                        )}
                      </>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Legend */}
          <div className="cal-legend">
            {Object.entries(STATUS_STYLES).map(([k, v]) => (
              <span key={k} className="legend-item">
                <span className="legend-dot" style={{ background: v.color }} />
                {v.label}
              </span>
            ))}
          </div>
        </div>

        {/* Side panel */}
        <div className="apt-side">
          {/* Filter */}
          <div className="apt-filter glass-card">
            <span className="filter-label">{selectedDate ? `Appointments on ${selectedDate}` : 'All Upcoming'}</span>
            <div className="filter-tabs">
              {['all','scheduled','confirmed','cancelled'].map(s => (
                <button key={s} className={`filter-tab ${filterStatus === s ? 'active' : ''}`}
                  onClick={() => setFilterStatus(s)}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* List */}
          <div className="apt-list">
            <AnimatePresence>
              {filteredAppts.length === 0 ? (
                <motion.div className="apt-empty glass-card"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <span className="material-icons">event_busy</span>
                  <p>No appointments for this filter</p>
                  <button className="apt-empty-btn" onClick={() => openNew(selectedDate)}>
                    Schedule One
                  </button>
                </motion.div>
              ) : (
                filteredAppts.map((a, i) => {
                  const ss = STATUS_STYLES[a.status] || STATUS_STYLES.scheduled;
                  return (
                    <motion.div key={a.id} className="apt-item glass-card"
                      initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -16 }} transition={{ delay: i * 0.05 }}>
                      <div className="apt-item-header">
                        <div className="apt-time-badge">
                          <span className="material-icons">schedule</span>
                          {a.time}
                        </div>
                        <span className="apt-status-badge"
                          style={{ color: ss.color, background: ss.bg }}>
                          {ss.label}
                        </span>
                      </div>
                      <div className="apt-item-body">
                        <p className="apt-patient"><span className="material-icons">person</span>{a.patient}</p>
                        <p className="apt-detail"><span className="material-icons">biotech</span>{a.test}</p>
                        <p className="apt-detail"><span className="material-icons">stethoscope</span>{a.doctor}</p>
                        <p className="apt-detail"><span className="material-icons">calendar_today</span>{a.date}</p>
                        {a.phone && <p className="apt-detail"><span className="material-icons">phone</span>{a.phone}</p>}
                      </div>
                      {a.status !== 'cancelled' && (
                        <div className="apt-item-actions">
                          {a.status === 'scheduled' && (
                            <button className="apt-confirm-btn" onClick={() => confirmAppt(a.id)}>
                              <span className="material-icons">check_circle</span>Confirm
                            </button>
                          )}
                          <button className="apt-cancel-btn" onClick={() => cancelAppt(a.id)}>
                            <span className="material-icons">cancel</span>Cancel
                          </button>
                        </div>
                      )}
                    </motion.div>
                  );
                })
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* New Appointment Modal */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)} />
            <motion.div className="apt-modal glass-card"
              initial={{ opacity: 0, scale: 0.94, y: -20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94 }} transition={{ type: 'spring', damping: 28, stiffness: 360 }}>
              <div className="modal-header">
                <h2><span className="material-icons">event_available</span>New Appointment</h2>
                <button className="modal-close" onClick={() => setShowModal(false)}>
                  <span className="material-icons">close</span>
                </button>
              </div>

              <div className="modal-form">
                {[
                  { label: 'Patient Name *', key: 'patient', type: 'text', placeholder: 'Full name', icon: 'person' },
                  { label: 'Phone Number', key: 'phone', type: 'tel', placeholder: '+91 XXXXX XXXXX', icon: 'phone' },
                  { label: 'Appointment Date *', key: 'date', type: 'date', icon: 'calendar_today' },
                ].map(({ label, key, type, placeholder, icon }) => (
                  <div key={key} className="modal-field">
                    <label>{label}
                      <div className="modal-input-wrap">
                        <span className="material-icons modal-input-icon">{icon}</span>
                        <input className="modal-input" type={type} placeholder={placeholder}
                          value={newAppt[key]} onChange={e => setNewAppt(p => ({ ...p, [key]: e.target.value }))} />
                      </div>
                    </label>
                  </div>
                ))}

                <div className="modal-row">
                  <div className="modal-field">
                    <label>Test Type *
                      <div className="modal-input-wrap">
                        <span className="material-icons modal-input-icon">biotech</span>
                        <select className="modal-select" value={newAppt.test}
                          onChange={e => setNewAppt(p => ({ ...p, test: e.target.value }))}>
                          <option value="">Select test</option>
                          {TESTS.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                      </div>
                    </label>
                  </div>
                  <div className="modal-field">
                    <label>Doctor *
                      <div className="modal-input-wrap">
                        <span className="material-icons modal-input-icon">stethoscope</span>
                        <select className="modal-select" value={newAppt.doctor}
                          onChange={e => setNewAppt(p => ({ ...p, doctor: e.target.value }))}>
                          <option value="">Select doctor</option>
                          {DOCTORS.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="modal-field">
                  <label>Time Slot *
                    <div className="time-slots">
                      {TIMES.map(t => (
                        <button key={t} type="button"
                          className={`time-slot-btn ${newAppt.time === t ? 'selected' : ''}`}
                          onClick={() => setNewAppt(p => ({ ...p, time: t }))}>
                          {t}
                        </button>
                      ))}
                    </div>
                  </label>
                </div>

                <div className="modal-actions">
                  <button className="modal-cancel-btn" onClick={() => setShowModal(false)}>Cancel</button>
                  <motion.button className="modal-save-btn" onClick={saveAppt} whileTap={{ scale: 0.97 }}>
                    <span className="material-icons">event_available</span>
                    Schedule Appointment
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AppointmentScheduler;
