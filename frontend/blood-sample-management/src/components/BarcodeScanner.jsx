import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import './BarcodeScanner.css';

const MOCK_SAMPLES = {
  'SMP-0001': { id: 'SMP-0001', patient: 'Ravi Kumar', age: 34, blood: 'O+', test: 'CBC', status: 'Processing', collected: '2026-06-20', doctor: 'Dr. Sharma', priority: 'Normal' },
  'SMP-0042': { id: 'SMP-0042', patient: 'Priya Patel', age: 28, blood: 'A+', test: 'HbA1c', status: 'Collected', collected: '2026-06-21', doctor: 'Dr. Mehta', priority: 'Urgent' },
  'SMP-0098': { id: 'SMP-0098', patient: 'Anil Singh', age: 56, blood: 'B-', test: 'Lipid Panel', status: 'Processed', collected: '2026-06-19', doctor: 'Dr. Kapoor', priority: 'Normal' },
  'SMP-0120': { id: 'SMP-0120', patient: 'Sunita Rao', age: 42, blood: 'AB+', test: 'Thyroid Panel', status: 'At Lab', collected: '2026-06-21', doctor: 'Dr. Reddy', priority: 'Normal' },
};

const STATUS_FLOW = ['Collected', 'At Lab', 'Processing', 'Processed', 'Stored'];

const STATUS_COLORS = {
  Collected:  { color: '#ff6b81', bg: 'rgba(255,107,129,0.14)' },
  Processing: { color: '#ff9b3d', bg: 'rgba(255,155,61,0.14)' },
  Processed:  { color: '#22d7a5', bg: 'rgba(34,215,165,0.14)' },
  'At Lab':   { color: '#6c63ff', bg: 'rgba(108,99,255,0.14)' },
  Stored:     { color: '#ff477e', bg: 'rgba(255,71,126,0.14)' },
};

const BarcodeScanner = () => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [history, setHistory] = useState([]);
  const [notFound, setNotFound] = useState(false);
  const inputRef = useRef(null);

  /* Auto-focus input */
  useEffect(() => {
    inputRef.current?.focus();
    const handler = (e) => {
      if (e.key === 's' && !['INPUT','TEXTAREA'].includes(document.activeElement.tagName)) {
        inputRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  const lookup = (id) => {
    const cleaned = id.trim().toUpperCase();
    if (!cleaned) return;
    setScanning(true);
    setNotFound(false);
    setResult(null);

    setTimeout(() => {
      const found = MOCK_SAMPLES[cleaned];
      setScanning(false);
      if (found) {
        setResult(found);
        setNotFound(false);
        setHistory(prev => {
          const filtered = prev.filter(h => h.id !== found.id);
          return [{ ...found, scannedAt: new Date() }, ...filtered].slice(0, 8);
        });
        toast.success(`Sample ${cleaned} found!`);
      } else {
        setNotFound(true);
        toast.error(`Sample "${cleaned}" not found in database`);
      }
      setInput('');
    }, 700);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') lookup(input);
  };

  const advanceStatus = (sample) => {
    const idx = STATUS_FLOW.indexOf(sample.status);
    if (idx < STATUS_FLOW.length - 1) {
      const nextStatus = STATUS_FLOW[idx + 1];
      const updated = { ...sample, status: nextStatus };
      MOCK_SAMPLES[sample.id] = updated;
      setResult(updated);
      setHistory(prev => prev.map(h => h.id === updated.id ? { ...h, status: nextStatus } : h));
      toast.success(`Status updated → ${nextStatus}`);
    } else {
      toast.error('Sample already at final status');
    }
  };

  const sc = result ? (STATUS_COLORS[result.status] || { color: '#aaa', bg: 'rgba(200,200,200,0.1)' }) : null;

  return (
    <motion.div
      className="scanner-page"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.45 }}
    >
      {/* Header */}
      <div className="scanner-header page-shell">
        <div>
          <p className="scanner-super">Lab Operations</p>
          <h1>Barcode Scanner</h1>
          <p className="scanner-sub">Scan or type a sample ID to instantly look up and update status</p>
        </div>
        <div className="scanner-tip glass-card">
          <span className="material-icons" style={{ color: '#ff7aaa' }}>tips_and_updates</span>
          <span>Press <kbd>S</kbd> anywhere to focus the scanner</span>
        </div>
      </div>

      <div className="scanner-body page-shell">
        {/* Scanner input area */}
        <div className="scanner-input-area glass-card">
          <div className="scan-animation-wrap">
            <div className={`scan-frame ${scanning ? 'scanning' : ''}`}>
              <span className="material-icons scan-icon">qr_code_scanner</span>
              {scanning && <div className="scan-line" />}
              <div className="scan-corner tl" /><div className="scan-corner tr" />
              <div className="scan-corner bl" /><div className="scan-corner br" />
            </div>
          </div>

          <div className="scanner-input-wrap">
            <span className="material-icons scanner-input-icon">search</span>
            <input
              ref={inputRef}
              className="scanner-input"
              type="text"
              placeholder="Scan barcode or type Sample ID (e.g. SMP-0042)"
              value={input}
              onChange={e => { setInput(e.target.value); setNotFound(false); }}
              onKeyDown={handleKeyDown}
              disabled={scanning}
            />
            {input && (
              <button className="scanner-clear" onClick={() => { setInput(''); setResult(null); setNotFound(false); inputRef.current?.focus(); }}>
                <span className="material-icons">close</span>
              </button>
            )}
            <motion.button
              className="scanner-go-btn"
              onClick={() => lookup(input)}
              disabled={scanning || !input.trim()}
              whileTap={{ scale: 0.96 }}
            >
              {scanning ? <span className="btn-spinner" /> : <span className="material-icons">send</span>}
            </motion.button>
          </div>

          <div className="scanner-hints">
            {['SMP-0001', 'SMP-0042', 'SMP-0098', 'SMP-0120'].map(id => (
              <button key={id} className="hint-chip" onClick={() => { setInput(id); setTimeout(() => lookup(id), 100); }}>
                {id}
              </button>
            ))}
          </div>
        </div>

        {/* Results area */}
        <div className="scanner-results">
          <AnimatePresence mode="wait">
            {notFound && (
              <motion.div key="not-found" className="scanner-not-found glass-card"
                initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                <span className="material-icons nf-icon">search_off</span>
                <h3>Sample not found</h3>
                <p>No sample matches this ID. Verify the barcode or check the database.</p>
              </motion.div>
            )}

            {result && (
              <motion.div key={result.id} className="sample-card glass-card"
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.35 }}>
                <div className="sample-card-header">
                  <div className="sample-card-id">
                    <span className="material-icons">qr_code</span>
                    <h2>{result.id}</h2>
                  </div>
                  <span className="sample-status-badge"
                    style={{ color: sc.color, background: sc.bg }}>
                    {result.status}
                  </span>
                  {result.priority === 'Urgent' && (
                    <span className="urgent-badge">🚨 Urgent</span>
                  )}
                </div>

                <div className="sample-info-grid">
                  {[
                    { icon: 'person', label: 'Patient', val: result.patient },
                    { icon: 'cake', label: 'Age', val: `${result.age} years` },
                    { icon: 'water_drop', label: 'Blood Type', val: result.blood },
                    { icon: 'biotech', label: 'Test Type', val: result.test },
                    { icon: 'stethoscope', label: 'Doctor', val: result.doctor },
                    { icon: 'calendar_today', label: 'Collected', val: result.collected },
                  ].map(({ icon, label, val }) => (
                    <div key={label} className="sample-info-cell">
                      <span className="material-icons sic-icon">{icon}</span>
                      <div>
                        <p className="sic-label">{label}</p>
                        <p className="sic-val">{val}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Status pipeline */}
                <div className="status-pipeline">
                  <p className="pipeline-label">Sample Pipeline</p>
                  <div className="pipeline-track">
                    {STATUS_FLOW.map((s, i) => {
                      const sIdx = STATUS_FLOW.indexOf(result.status);
                      const done = i <= sIdx;
                      const current = i === sIdx;
                      return (
                        <React.Fragment key={s}>
                          <div className={`pipeline-node ${done ? 'done' : ''} ${current ? 'current' : ''}`}>
                            <div className="pipeline-dot">
                              {done && !current && <span className="material-icons">check</span>}
                              {current && <div className="pipeline-pulse" />}
                            </div>
                            <span className="pipeline-lbl">{s}</span>
                          </div>
                          {i < STATUS_FLOW.length - 1 && <div className={`pipeline-line ${done && i < sIdx ? 'done' : ''}`} />}
                        </React.Fragment>
                      );
                    })}
                  </div>
                </div>

                {/* Actions */}
                <div className="sample-actions">
                  <motion.button className="sample-action-btn primary" whileTap={{ scale: 0.97 }}
                    onClick={() => advanceStatus(result)}>
                    <span className="material-icons">arrow_forward</span>
                    Advance Status
                  </motion.button>
                  <motion.button className="sample-action-btn secondary" whileTap={{ scale: 0.97 }}
                    onClick={() => toast.success('Report generation triggered')}>
                    <span className="material-icons">picture_as_pdf</span>
                    Generate Report
                  </motion.button>
                  <motion.button className="sample-action-btn secondary" whileTap={{ scale: 0.97 }}
                    onClick={() => toast.success('Alert sent to doctor')}>
                    <span className="material-icons">send</span>
                    Alert Doctor
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Scan history */}
      {history.length > 0 && (
        <div className="scanner-history page-shell">
          <h3 className="history-title">Recent Scans</h3>
          <div className="history-grid">
            {history.map(h => {
              const hc = STATUS_COLORS[h.status] || { color: '#aaa', bg: 'rgba(200,200,200,0.1)' };
              return (
                <motion.button key={h.id + h.scannedAt} className="history-item glass-card"
                  whileHover={{ y: -3 }} whileTap={{ scale: 0.97 }}
                  onClick={() => { setResult(h); setNotFound(false); }}>
                  <span className="material-icons" style={{ color: '#ff7aaa' }}>qr_code</span>
                  <div className="history-item-info">
                    <span className="history-id">{h.id}</span>
                    <span className="history-patient">{h.patient}</span>
                  </div>
                  <span style={{ color: hc.color, background: hc.bg, fontSize: '0.75rem', padding: '3px 10px', borderRadius: '999px', fontWeight: 700 }}>
                    {h.status}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default BarcodeScanner;
