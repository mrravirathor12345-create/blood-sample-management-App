import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import './InventoryTracker.css';

const INITIAL_ITEMS = [
  { id: 1, name: 'HbA1c Reagent Kit', category: 'Reagent', quantity: 8, maxQty: 50, unit: 'kits', expiry: '2026-09-15', supplier: 'MedSupply Co', cost: 2800 },
  { id: 2, name: 'CBC Analyzer Cartridge', category: 'Consumable', quantity: 22, maxQty: 100, unit: 'units', expiry: '2026-12-01', supplier: 'LabPro Ltd', cost: 450 },
  { id: 3, name: 'Blood Collection Tubes (EDTA)', category: 'Consumable', quantity: 340, maxQty: 1000, unit: 'tubes', expiry: '2027-03-20', supplier: 'MedSupply Co', cost: 12 },
  { id: 4, name: 'Lipid Panel Reagent', category: 'Reagent', quantity: 5, maxQty: 30, unit: 'kits', expiry: '2026-08-10', supplier: 'BioReagents Inc', cost: 3200 },
  { id: 5, name: 'Urine Strip Test Kit', category: 'Test Kit', quantity: 120, maxQty: 500, unit: 'strips', expiry: '2026-11-05', supplier: 'QuickTest Co', cost: 18 },
  { id: 6, name: 'Nitrile Gloves (M)', category: 'PPE', quantity: 2, maxQty: 50, unit: 'boxes', expiry: '2028-01-01', supplier: 'SafeGuard Medical', cost: 320 },
  { id: 7, name: 'Thyroid Panel Kit', category: 'Reagent', quantity: 14, maxQty: 40, unit: 'kits', expiry: '2026-10-22', supplier: 'BioReagents Inc', cost: 4100 },
  { id: 8, name: 'Sterile Syringes 5ml', category: 'Consumable', quantity: 180, maxQty: 600, unit: 'units', expiry: '2027-06-15', supplier: 'LabPro Ltd', cost: 8 },
  { id: 9, name: 'Liver Function Kit (LFT)', category: 'Reagent', quantity: 3, maxQty: 20, unit: 'kits', expiry: '2026-07-30', supplier: 'DiagPro', cost: 2950 },
  { id: 10, name: 'Alcohol Swabs', category: 'Consumable', quantity: 450, maxQty: 1000, unit: 'pcs', expiry: '2027-12-01', supplier: 'SafeGuard Medical', cost: 2 },
];

const CATEGORIES = ['All', 'Reagent', 'Consumable', 'Test Kit', 'PPE'];

const getStatus = (qty, maxQty, expiry) => {
  const pct = qty / maxQty;
  const daysToExpiry = Math.ceil((new Date(expiry) - Date.now()) / 86400000);
  if (daysToExpiry <= 30) return 'expiring';
  if (pct <= 0.15) return 'critical';
  if (pct <= 0.30) return 'low';
  return 'ok';
};

const STATUS_STYLE = {
  ok:       { color: '#22d77a', bg: 'rgba(34,215,122,0.14)', label: 'In Stock' },
  low:      { color: '#ff9b3d', bg: 'rgba(255,155,61,0.14)', label: 'Low Stock' },
  critical: { color: '#ff3c6e', bg: 'rgba(255,60,110,0.14)', label: 'Critical' },
  expiring: { color: '#a78bfa', bg: 'rgba(167,139,250,0.14)', label: 'Expiring Soon' },
};

const InventoryTracker = () => {
  const [items, setItems] = useState(INITIAL_ITEMS);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sortBy, setSortBy] = useState('status');
  const [showAddModal, setShowAddModal] = useState(false);
  const [adjustItem, setAdjustItem] = useState(null);
  const [adjustAmt, setAdjustAmt] = useState('');
  const [newItem, setNewItem] = useState({ name: '', category: 'Reagent', quantity: '', maxQty: '', unit: '', expiry: '', supplier: '', cost: '' });

  const enriched = useMemo(() => items.map(i => ({ ...i, status: getStatus(i.quantity, i.maxQty, i.expiry) })), [items]);

  const filtered = useMemo(() => {
    let list = enriched;
    if (category !== 'All') list = list.filter(i => i.category === category);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(i => i.name.toLowerCase().includes(q) || i.supplier.toLowerCase().includes(q));
    }
    return list.sort((a, b) => {
      if (sortBy === 'status') {
        const order = { critical: 0, expiring: 1, low: 2, ok: 3 };
        return order[a.status] - order[b.status];
      }
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'qty') return a.quantity - b.quantity;
      if (sortBy === 'expiry') return new Date(a.expiry) - new Date(b.expiry);
      return 0;
    });
  }, [enriched, category, search, sortBy]);

  const stats = useMemo(() => ({
    total: enriched.length,
    critical: enriched.filter(i => i.status === 'critical').length,
    low: enriched.filter(i => i.status === 'low').length,
    expiring: enriched.filter(i => i.status === 'expiring').length,
  }), [enriched]);

  const doAdjust = (dir) => {
    const amt = parseInt(adjustAmt);
    if (!amt || amt < 0) { toast.error('Enter a valid amount'); return; }
    setItems(prev => prev.map(i => {
      if (i.id !== adjustItem.id) return i;
      const newQty = dir === 'add' ? Math.min(i.maxQty, i.quantity + amt) : Math.max(0, i.quantity - amt);
      return { ...i, quantity: newQty };
    }));
    toast.success(`Stock ${dir === 'add' ? 'added' : 'removed'} successfully`);
    setAdjustItem(null);
    setAdjustAmt('');
  };

  const addItem = () => {
    if (!newItem.name || !newItem.quantity || !newItem.maxQty || !newItem.unit || !newItem.expiry) {
      toast.error('Fill all required fields');
      return;
    }
    setItems(prev => [...prev, { ...newItem, id: Date.now(), quantity: +newItem.quantity, maxQty: +newItem.maxQty, cost: +newItem.cost || 0 }]);
    setShowAddModal(false);
    setNewItem({ name: '', category: 'Reagent', quantity: '', maxQty: '', unit: '', expiry: '', supplier: '', cost: '' });
    toast.success('Item added to inventory!');
  };

  const exportCSV = () => {
    const header = 'Name,Category,Quantity,Max,Unit,Status,Expiry,Supplier,Cost\n';
    const rows = enriched.map(i =>
      `"${i.name}","${i.category}",${i.quantity},${i.maxQty},"${i.unit}","${i.status}","${i.expiry}","${i.supplier}",${i.cost}`
    ).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'inventory.csv'; a.click();
    URL.revokeObjectURL(url);
    toast.success('CSV exported!');
  };

  return (
    <motion.div className="inv-page"
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }} transition={{ duration: 0.45 }}>

      {/* Header */}
      <div className="inv-header page-shell">
        <div>
          <p className="inv-super">Lab Management</p>
          <h1>Inventory Tracker</h1>
        </div>
        <div className="inv-header-actions">
          <button className="inv-export-btn" onClick={exportCSV}>
            <span className="material-icons">download</span>Export CSV
          </button>
          <motion.button className="inv-add-btn" onClick={() => setShowAddModal(true)} whileTap={{ scale: 0.97 }}>
            <span className="material-icons">add</span>Add Item
          </motion.button>
        </div>
      </div>

      {/* Stats */}
      <div className="inv-stats page-shell">
        {[
          { label: 'Total Items', val: stats.total, icon: 'inventory_2', color: '#5b8dff' },
          { label: 'Critical Stock', val: stats.critical, icon: 'warning', color: '#ff3c6e' },
          { label: 'Low Stock', val: stats.low, icon: 'trending_down', color: '#ff9b3d' },
          { label: 'Expiring Soon', val: stats.expiring, icon: 'timer', color: '#a78bfa' },
        ].map(({ label, val, icon, color }) => (
          <motion.div key={label} className="inv-stat-card glass-card" whileHover={{ y: -4 }}>
            <div className="inv-stat-icon" style={{ background: `${color}22` }}>
              <span className="material-icons" style={{ color }}>{icon}</span>
            </div>
            <div>
              <p className="inv-stat-label">{label}</p>
              <strong className="inv-stat-val" style={{ color }}>{val}</strong>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="inv-controls page-shell glass-card">
        <div className="inv-search-wrap">
          <span className="material-icons inv-search-icon">search</span>
          <input className="inv-search" placeholder="Search items, suppliers…"
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="inv-filter-row">
          <div className="inv-cats">
            {CATEGORIES.map(c => (
              <button key={c} className={`inv-cat-btn ${category === c ? 'active' : ''}`}
                onClick={() => setCategory(c)}>{c}</button>
            ))}
          </div>
          <select className="inv-sort" value={sortBy} onChange={e => setSortBy(e.target.value)}>
            <option value="status">Sort: Status</option>
            <option value="name">Sort: Name</option>
            <option value="qty">Sort: Quantity</option>
            <option value="expiry">Sort: Expiry</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="inv-table-wrap page-shell glass-card">
        <div className="inv-table">
          <div className="inv-thead">
            <span>Item</span><span>Category</span><span>Stock Level</span>
            <span>Quantity</span><span>Expiry</span><span>Status</span><span>Actions</span>
          </div>
          <div className="inv-tbody">
            <AnimatePresence>
              {filtered.map((item, i) => {
                const ss = STATUS_STYLE[item.status];
                const pct = Math.min(100, Math.round((item.quantity / item.maxQty) * 100));
                return (
                  <motion.div key={item.id} className="inv-row"
                    initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }} transition={{ delay: i * 0.03 }}>
                    <div className="inv-cell-name">
                      <span className="inv-name">{item.name}</span>
                      <span className="inv-supplier">{item.supplier}</span>
                    </div>
                    <div className="inv-cell">
                      <span className="inv-cat-tag">{item.category}</span>
                    </div>
                    <div className="inv-cell">
                      <div className="inv-bar-wrap">
                        <div className="inv-bar-bg">
                          <div className="inv-bar-fill"
                            style={{ width: `${pct}%`, background: ss.color }} />
                        </div>
                        <span className="inv-pct">{pct}%</span>
                      </div>
                    </div>
                    <div className="inv-cell inv-qty-cell">
                      <strong>{item.quantity}</strong>
                      <span>/ {item.maxQty} {item.unit}</span>
                    </div>
                    <div className="inv-cell inv-expiry-cell">
                      {item.expiry}
                      {item.status === 'expiring' && <span className="material-icons expiry-warn">timer</span>}
                    </div>
                    <div className="inv-cell">
                      <span className="inv-status-badge" style={{ color: ss.color, background: ss.bg }}>
                        {ss.label}
                      </span>
                    </div>
                    <div className="inv-cell inv-actions-cell">
                      <button className="inv-adj-btn add" title="Add stock" onClick={() => { setAdjustItem(item); setAdjustAmt(''); }}>
                        <span className="material-icons">tune</span>
                      </button>
                      <button className="inv-adj-btn del" title="Remove item" onClick={() => {
                        setItems(prev => prev.filter(x => x.id !== item.id));
                        toast.success('Item removed');
                      }}>
                        <span className="material-icons">delete</span>
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
            {filtered.length === 0 && (
              <div className="inv-empty">
                <span className="material-icons">inventory</span>
                <p>No items match your search</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Adjust stock modal */}
      <AnimatePresence>
        {adjustItem && (
          <>
            <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setAdjustItem(null)} />
            <motion.div className="inv-modal glass-card"
              initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }} transition={{ type: 'spring', damping: 28, stiffness: 360 }}>
              <div className="modal-header">
                <h2><span className="material-icons">tune</span>Adjust Stock</h2>
                <button className="modal-close" onClick={() => setAdjustItem(null)}>
                  <span className="material-icons">close</span>
                </button>
              </div>
              <p className="adj-item-name">{adjustItem.name}</p>
              <p className="adj-current">Current: <strong>{adjustItem.quantity} {adjustItem.unit}</strong></p>
              <div className="adj-input-wrap">
                <span className="material-icons adj-icon">tune</span>
                <input className="adj-input" type="number" min="1" placeholder="Amount"
                  value={adjustAmt} onChange={e => setAdjustAmt(e.target.value)} />
              </div>
              <div className="adj-actions">
                <button className="adj-btn remove" onClick={() => doAdjust('remove')}>
                  <span className="material-icons">remove</span>Remove Stock
                </button>
                <button className="adj-btn add" onClick={() => doAdjust('add')}>
                  <span className="material-icons">add</span>Add Stock
                </button>
              </div>
            </motion.div>
          </>
        )}

        {showAddModal && (
          <>
            <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)} />
            <motion.div className="inv-modal glass-card wide"
              initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }} transition={{ type: 'spring', damping: 28, stiffness: 360 }}>
              <div className="modal-header">
                <h2><span className="material-icons">add_box</span>Add New Item</h2>
                <button className="modal-close" onClick={() => setShowAddModal(false)}>
                  <span className="material-icons">close</span>
                </button>
              </div>
              <div className="add-form">
                {[
                  { label: 'Item Name *', key: 'name', type: 'text', placeholder: 'e.g. CBC Reagent Kit' },
                  { label: 'Supplier', key: 'supplier', type: 'text', placeholder: 'Supplier name' },
                  { label: 'Unit *', key: 'unit', type: 'text', placeholder: 'kits, units, tubes…' },
                  { label: 'Expiry Date *', key: 'expiry', type: 'date', placeholder: '' },
                ].map(({ label, key, type, placeholder }) => (
                  <div key={key} className="add-field">
                    <label>{label}
                      <input className="add-input" type={type} placeholder={placeholder}
                        value={newItem[key]} onChange={e => setNewItem(p => ({ ...p, [key]: e.target.value }))} />
                    </label>
                  </div>
                ))}
                <div className="add-field">
                  <label>Category
                    <select className="add-select" value={newItem.category}
                      onChange={e => setNewItem(p => ({ ...p, category: e.target.value }))}>
                      {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </label>
                </div>
                <div className="add-row">
                  <div className="add-field">
                    <label>Quantity *
                      <input className="add-input" type="number" min="0" placeholder="0"
                        value={newItem.quantity} onChange={e => setNewItem(p => ({ ...p, quantity: e.target.value }))} />
                    </label>
                  </div>
                  <div className="add-field">
                    <label>Max Capacity *
                      <input className="add-input" type="number" min="1" placeholder="100"
                        value={newItem.maxQty} onChange={e => setNewItem(p => ({ ...p, maxQty: e.target.value }))} />
                    </label>
                  </div>
                  <div className="add-field">
                    <label>Unit Cost (₹)
                      <input className="add-input" type="number" min="0" placeholder="0"
                        value={newItem.cost} onChange={e => setNewItem(p => ({ ...p, cost: e.target.value }))} />
                    </label>
                  </div>
                </div>
              </div>
              <div className="modal-actions">
                <button className="modal-cancel-btn" onClick={() => setShowAddModal(false)}>Cancel</button>
                <motion.button className="modal-save-btn" onClick={addItem} whileTap={{ scale: 0.97 }}>
                  <span className="material-icons">add_box</span>Add to Inventory
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default InventoryTracker;
