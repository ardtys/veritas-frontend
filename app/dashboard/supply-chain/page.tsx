'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SHIPMENTS, ShipmentRecord } from '@/lib/mockData';
import { formatTimestamp, generateVTXHash } from '@/lib/utils';
import Modal from '@/components/shared/Modal';

type Status = 'In Transit' | 'Delivered' | 'Flagged' | 'Pending';
const STATUSES: Status[] = ['In Transit', 'Delivered', 'Flagged', 'Pending'];
const STATUS_BADGE: Record<Status, string> = {
  'In Transit': 'badge badge-neutral', 'Delivered': 'badge badge-green', 'Flagged': 'badge badge-amber', 'Pending': 'badge badge-neutral',
};
const STATUS_DOT: Record<Status, string> = { 'In Transit': '#6B6E68', 'Delivered': '#4CC38A', 'Flagged': '#C9853A', 'Pending': '#4B5563' };

const CITIES = ['Surabaya', 'Jakarta', 'Bandung', 'Semarang', 'Medan', 'Makassar', 'Balikpapan', 'Palembang', 'Batam', 'Pekanbaru'];

interface ChainModal { id: string; event: string; label: string; }
interface FormState { id: string; origin: string; destination: string; status: Status; }

const field: React.CSSProperties = { width: '100%', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 6, padding: '10px 12px', fontSize: 13.5, color: 'var(--text-primary)', fontFamily: 'var(--font-dm-sans), sans-serif', outline: 'none' };
const flabel: React.CSSProperties = { display: 'block', fontSize: 11, color: 'var(--text-secondary)', marginBottom: 7, fontFamily: 'var(--font-jetbrains), monospace', letterSpacing: '0.05em', textTransform: 'uppercase' };

let counter = 5000;

export default function SupplyChainPage() {
  const [rows, setRows] = useState<ShipmentRecord[]>(SHIPMENTS);
  const [chain, setChain] = useState<ChainModal | null>(null);
  const [form, setForm] = useState<FormState | null>(null);   // null = closed
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const active    = rows.filter(s => s.status === 'In Transit').length;
  const delivered = rows.filter(s => s.status === 'Delivered').length;
  const flagged   = rows.filter(s => s.status === 'Flagged').length;

  function openAdd() {
    setEditingId(null);
    setForm({ id: `SHP-${++counter}`, origin: CITIES[0], destination: CITIES[1], status: 'In Transit' });
  }
  function openEdit(r: ShipmentRecord) {
    setEditingId(r.id);
    setForm({ id: r.id, origin: r.origin, destination: r.destination, status: r.status as Status });
  }
  function save() {
    if (!form) return;
    if (editingId) {
      setRows(prev => prev.map(r => r.id === editingId ? { ...r, origin: form.origin, destination: form.destination, status: form.status } : r));
    } else {
      setRows(prev => [{ id: form.id, origin: form.origin, destination: form.destination, status: form.status, timestamp: new Date(), hash: generateVTXHash() }, ...prev]);
    }
    setForm(null); setEditingId(null);
  }
  function doDelete(id: string) {
    setRows(prev => prev.filter(r => r.id !== id));
    setConfirmDelete(null);
  }

  return (
    <>
      <div style={{ padding: '28px 32px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 14 }}>
          <div>
            <h1 className="font-display" style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>Supply Chain</h1>
            <span style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>Track, add, and update shipments, every change is recorded</span>
          </div>
          <button className="btn-primary" style={{ fontSize: 13, padding: '10px 18px' }} onClick={openAdd}>+ Add shipment</button>
        </div>

        {/* KPIs (live) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 20 }}>
          {[
            { label: 'Total Shipments', value: rows.length, color: 'var(--text-primary)' },
            { label: 'In Transit',      value: active,      color: 'var(--text-primary)' },
            { label: 'Delivered',       value: delivered,   color: 'var(--accent)' },
            { label: 'Flagged',         value: flagged,     color: 'var(--amber)' },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: 'easeOut' as const, delay: i * 0.05 }}
              style={{ background: 'var(--surface-1)', border: '1px solid var(--border)', borderRadius: 8, padding: '18px 22px' }}>
              <div className="font-mono-custom" style={{ fontSize: 10.5, color: 'var(--text-secondary)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 10 }}>{s.label}</div>
              <div className="font-mono-custom" style={{ fontSize: 28, fontWeight: 700, color: s.color }}>{s.value}</div>
            </motion.div>
          ))}
        </div>

        {/* Table */}
        <div style={{ background: 'var(--surface-1)', border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}>
          <div style={{ padding: '13px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Shipment records</span>
            <span className="font-mono-custom" style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{rows.length} total</span>
          </div>
          <table className="dashboard-table">
            <thead>
              <tr><th>Shipment ID</th><th>From → To</th><th>Status</th><th>Updated</th><th style={{ width: 150 }}>Actions</th></tr>
            </thead>
            <tbody>
              <AnimatePresence initial={false}>
                {rows.map(r => (
                  <motion.tr key={r.id} initial={{ opacity: 0, backgroundColor: 'rgba(76,195,138,0.08)' }} animate={{ opacity: 1, backgroundColor: 'rgba(0,0,0,0)' }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
                    <td><span className="font-mono-custom" style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 600 }}>{r.id}</span></td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: STATUS_DOT[r.status as Status], flexShrink: 0 }} />
                        <span style={{ fontSize: 12.5, color: 'var(--text-primary)' }}>{r.origin}</span>
                        <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>→ {r.destination}</span>
                      </div>
                    </td>
                    <td><span className={STATUS_BADGE[r.status as Status]} style={{ fontSize: 10.5 }}>{r.status}</span></td>
                    <td><span className="font-mono-custom" style={{ fontSize: 11.5, color: 'var(--text-secondary)' }}>{formatTimestamp(r.timestamp)}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <IconBtn label="Edit" onClick={() => openEdit(r)} />
                        <IconBtn label="Delete" danger onClick={() => setConfirmDelete(r.id)} />
                        <IconBtn label="View" onClick={() => setChain({ id: r.id, event: 'SHIPMENT_SEALED', label: r.id })} />
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
          {rows.length === 0 && (
            <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: 13 }}>
              No shipments yet. Click “Add shipment” to create one.
            </div>
          )}
        </div>
      </div>

      {/* ─── Create / Edit form modal ─── */}
      <AnimatePresence>
        {form && (
          <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setForm(null)}>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.2 }} onClick={e => e.stopPropagation()}
              style={{ background: 'var(--surface-1)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, width: '100%', maxWidth: 440, margin: '0 16px', overflow: 'hidden' }}>
              <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)' }}>
                <div className="font-display" style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>{editingId ? 'Edit shipment' : 'Add a shipment'}</div>
                <div style={{ fontSize: 12.5, color: 'var(--text-secondary)', marginTop: 3 }}>{editingId ? 'Update the details below.' : 'This creates a new tracked shipment.'}</div>
              </div>
              <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={flabel}>Shipment ID</label>
                  <input style={{ ...field, opacity: editingId ? 0.6 : 1 }} value={form.id} disabled={!!editingId} onChange={e => setForm({ ...form, id: e.target.value })} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div>
                    <label style={flabel}>Origin</label>
                    <select style={field} value={form.origin} onChange={e => setForm({ ...form, origin: e.target.value })}>
                      {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={flabel}>Destination</label>
                    <select style={field} value={form.destination} onChange={e => setForm({ ...form, destination: e.target.value })}>
                      {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label style={flabel}>Status</label>
                  <select style={field} value={form.status} onChange={e => setForm({ ...form, status: e.target.value as Status })}>
                    {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                <button className="btn-ghost" style={{ fontSize: 13, padding: '9px 18px' }} onClick={() => setForm(null)}>Cancel</button>
                <button className="btn-primary" style={{ fontSize: 13, padding: '9px 18px' }} onClick={save}>{editingId ? 'Save changes' : 'Add shipment'}</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Delete confirm ─── */}
      <AnimatePresence>
        {confirmDelete && (
          <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setConfirmDelete(null)}>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.2 }} onClick={e => e.stopPropagation()}
              style={{ background: 'var(--surface-1)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, width: '100%', maxWidth: 380, margin: '0 16px', padding: 24 }}>
              <div className="font-display" style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>Delete {confirmDelete}?</div>
              <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 20 }}>This removes the shipment from your list. In a real deployment the sealed record stays on file.</p>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                <button className="btn-ghost" style={{ fontSize: 13, padding: '9px 18px' }} onClick={() => setConfirmDelete(null)}>Cancel</button>
                <button style={{ fontSize: 13, padding: '9px 18px', background: 'var(--red)', color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer', fontWeight: 600 }} onClick={() => doDelete(confirmDelete)}>Delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {chain && <Modal id={chain.id} eventType={chain.event} label={chain.label} onClose={() => setChain(null)} />}
    </>
  );
}

function IconBtn({ label, onClick, danger }: { label: string; onClick: () => void; danger?: boolean }) {
  const [h, setH] = useState(false);
  const activeColor = danger ? '#B84B44' : 'var(--accent)';
  const activeBorder = danger ? 'rgba(184,75,68,0.45)' : 'rgba(76,195,138,0.45)';
  return (
    <button onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ background: 'none', border: `1px solid ${h ? activeBorder : 'var(--border)'}`, borderRadius: 5, color: h ? activeColor : 'var(--text-secondary)', fontSize: 11.5, padding: '5px 11px', cursor: 'pointer', fontFamily: 'var(--font-dm-sans), sans-serif', transition: 'all 150ms', whiteSpace: 'nowrap' }}>
      {label}
    </button>
  );
}
