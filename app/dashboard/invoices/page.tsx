'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { formatIDR, formatIDRCompact, formatTimestamp } from '@/lib/utils';
import { useDashboard } from '@/lib/store';
import Modal from '@/components/shared/Modal';

const VENDOR_OPTIONS = [
  'PT Baja Nusantara', 'CV Pratama Teknik', 'PT Sumber Makmur', 'UD Karya Mandiri',
  'PT Indo Polymer', 'CV Mitra Industri', 'PT Logam Jaya', 'UD Prima Plastik',
];
const ifield: React.CSSProperties = { width: '100%', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 6, padding: '10px 12px', fontSize: 13.5, color: 'var(--text-primary)', fontFamily: 'var(--font-dm-sans), sans-serif', outline: 'none' };
const ilabel: React.CSSProperties = { display: 'block', fontSize: 11, color: 'var(--text-secondary)', marginBottom: 7, fontFamily: 'var(--font-jetbrains), monospace', letterSpacing: '0.05em', textTransform: 'uppercase' };

function ActBtn({ label, tone = 'accent', onClick }: { label: string; tone?: 'accent' | 'amber' | 'danger'; onClick: () => void }) {
  const [h, setH] = useState(false);
  const c  = tone === 'danger' ? '#B84B44' : tone === 'amber' ? '#C9853A' : 'var(--accent)';
  const bc = tone === 'danger' ? 'rgba(184,75,68,0.45)' : tone === 'amber' ? 'rgba(201,133,58,0.45)' : 'rgba(76,195,138,0.45)';
  return (
    <button onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ background: h ? 'rgba(255,255,255,0.04)' : 'none', border: `1px solid ${h ? bc : 'var(--border)'}`, borderRadius: 5, color: h ? c : 'var(--text-secondary)', fontSize: 11, padding: '5px 11px', cursor: 'pointer', fontFamily: 'var(--font-jetbrains)', transition: 'all 150ms', whiteSpace: 'nowrap' }}>
      {label}
    </button>
  );
}

type InvoiceStatus = 'Pending' | 'Verified' | 'Released' | 'Failed';
const STATUS_BADGE: Record<InvoiceStatus, string> = {
  Released: 'badge badge-green', Verified: 'badge badge-neutral',
  Pending: 'badge badge-amber',  Failed: 'badge badge-red',
};
const STATUS_DOT: Record<InvoiceStatus, string> = {
  Released: '#4CC38A', Verified: '#6B6E68', Pending: '#C9853A', Failed: '#B84B44',
};

const DAILY_PAYMENTS = [
  { day: 'Sen', amount: 450_000_000, count: 8 },
  { day: 'Sel', amount: 280_000_000, count: 5 },
  { day: 'Rab', amount: 670_000_000, count: 11 },
  { day: 'Kam', amount: 390_000_000, count: 7 },
  { day: 'Jum', amount: 820_000_000, count: 14 },
  { day: 'Sab', amount: 150_000_000, count: 3 },
  { day: 'Min', amount: 200_000_000, count: 4 },
];

const VENDOR_SUMMARY = [
  { name: 'PT Baja Nusantara',  invoices: 12, released: 10, total: 2_450_000_000 },
  { name: 'CV Pratama Teknik',  invoices:  8, released:  7, total: 1_820_000_000 },
  { name: 'PT Sumber Makmur',   invoices:  6, released:  6, total: 3_100_000_000 },
  { name: 'UD Karya Mandiri',   invoices:  9, released:  8, total: 980_000_000 },
  { name: 'PT Indo Polymer',    invoices:  5, released:  4, total: 1_540_000_000 },
];

interface ModalState { id: string; }

function ViewBtn({ onClick }: { onClick: () => void }) {
  const [h, setH] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ background: 'none', border: `1px solid ${h ? 'rgba(76,195,138,0.45)' : 'var(--border)'}`, borderRadius: 5, color: h ? 'var(--accent)' : 'var(--text-secondary)', fontSize: 11, padding: '5px 13px', cursor: 'pointer', fontFamily: 'var(--font-jetbrains)', transition: 'all 150ms', whiteSpace: 'nowrap' }}>
      View ↗
    </button>
  );
}

export default function InvoicesPage() {
  const { invoices: INVOICES, contractLog, settings, verifyInvoice, releaseInvoice, failInvoice, retryInvoice, addInvoice, notify } = useDashboard();
  const [modal, setModal] = useState<ModalState | null>(null);
  const [newOpen, setNewOpen] = useState(false);
  const [nvVendor, setNvVendor] = useState(VENDOR_OPTIONS[0]);
  const [nvAmount, setNvAmount] = useState('');
  const [invFilter, setInvFilter] = useState<InvoiceStatus | 'all'>('all');

  const totalReleased = INVOICES.filter(i => i.status === 'Released').reduce((s, i) => s + i.amount, 0);
  const countReleased = INVOICES.filter(i => i.status === 'Released').length;
  const countPending  = INVOICES.filter(i => i.status === 'Pending').length;
  const countFailed   = INVOICES.filter(i => i.status === 'Failed').length;

  const shownInv = invFilter === 'all' ? INVOICES : INVOICES.filter(i => i.status === invFilter);
  const toggleInv = (s: InvoiceStatus) => setInvFilter(cur => (cur === s ? 'all' : s));

  const maxPayment = Math.max(...DAILY_PAYMENTS.map(d => d.amount));

  function doVerify(id: string) {
    verifyInvoice(id);
    if (settings.autoRelease) {
      notify(`Invoice ${id} verified — releasing payment…`);
      setTimeout(() => { releaseInvoice(id); notify(`Payment sent for ${id}`); }, 750);
    } else {
      notify(`Invoice ${id} verified`);
    }
  }
  function doRelease(id: string) { releaseInvoice(id); notify(`Payment sent for ${id}`); }
  function doReject(id: string)  { failInvoice(id); notify(`Invoice ${id} held — flagged for review`, 'warn'); }
  function doRetry(id: string)   { retryInvoice(id); notify(`Invoice ${id} re-queued`); }
  function doCreate() {
    const amount = Math.round(Number(nvAmount.replace(/[^\d]/g, '')));
    if (!amount || amount <= 0) { notify('Enter a valid amount', 'warn'); return; }
    addInvoice(nvVendor, amount);
    notify(`Invoice raised for ${nvVendor}`);
    setNewOpen(false); setNvAmount('');
  }

  return (
    <>
      <div style={{ padding: '28px 32px' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 14 }}>
          <div>
            <h1 className="font-display" style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>Invoices</h1>
            <span className="font-mono-custom" style={{ fontSize: 11.5, color: 'var(--text-secondary)' }}>
              Vendor settlement · auto-release {settings.autoRelease ? 'on' : 'off'}
            </span>
          </div>
          <button className="btn-primary" style={{ fontSize: 13, padding: '10px 18px' }} onClick={() => setNewOpen(true)}>+ New invoice</button>
        </div>

        {/* KPIs */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 12, marginBottom: 20 }}>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: 'easeOut' as const }}
            style={{ background: 'var(--surface-1)', border: '1px solid var(--border)', borderRadius: 8, padding: '20px 24px' }}>
            <div className="font-mono-custom" style={{ fontSize: 10.5, color: 'var(--text-secondary)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 10 }}>Total Released Today</div>
            <div className="font-mono-custom" style={{ fontSize: 28, fontWeight: 700, color: 'var(--accent)', letterSpacing: '-0.02em', marginBottom: 5 }}>{formatIDRCompact(totalReleased)}</div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{formatIDR(totalReleased)} · {countReleased} transactions</div>
          </motion.div>
          {([
            { label: 'Released', value: countReleased, color: '#4CC38A', status: 'Released' as InvoiceStatus },
            { label: 'Pending',  value: countPending,  color: '#C9853A', status: 'Pending'  as InvoiceStatus },
            { label: 'Failed',   value: countFailed,   color: '#B84B44', status: 'Failed'   as InvoiceStatus },
          ]).map((s, i) => {
            const on = invFilter === s.status;
            return (
            <motion.button key={s.label} type="button" onClick={() => toggleInv(s.status)} whileHover={{ y: -2 }}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut' as const, delay: (i + 1) * 0.06 }}
              style={{ textAlign: 'left', cursor: 'pointer', background: on ? 'rgba(76,195,138,0.08)' : 'var(--surface-1)', border: `1px solid ${on ? 'rgba(76,195,138,0.45)' : 'var(--border)'}`, borderRadius: 8, padding: '20px 22px', transition: 'background 160ms, border-color 160ms' }}>
              <div className="font-mono-custom" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10.5, color: 'var(--text-secondary)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 10 }}>{s.label}{on && <span style={{ color: 'var(--accent)', textTransform: 'none', letterSpacing: 0 }}>· on</span>}</div>
              <div className="font-mono-custom" style={{ fontSize: 28, fontWeight: 700, color: s.color }}>{s.value}</div>
            </motion.button>
            );
          })}
        </div>

        {/* Three columns: daily chart + table + contract log */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 16, marginBottom: 20 }}>

          {/* Daily payment chart */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }}
            style={{ background: 'var(--surface-1)', border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}>
            <div style={{ padding: '13px 20px', borderBottom: '1px solid var(--border)' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>Daily payment volume</div>
              <div className="font-mono-custom" style={{ fontSize: 10.5, color: 'var(--text-secondary)' }}>This week (IDR)</div>
            </div>
            <div style={{ padding: '16px 12px 8px' }}>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={DAILY_PAYMENTS} margin={{ top: 0, right: 4, bottom: 0, left: -24 }} barSize={18}>
                  <XAxis dataKey="day" tick={{ fontFamily: 'var(--font-jetbrains)', fontSize: 9.5, fill: '#6B6E68' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontFamily: 'var(--font-jetbrains)', fontSize: 9.5, fill: '#6B6E68' }} axisLine={false} tickLine={false} tickFormatter={v => `${Math.round(v / 1_000_000)}jt`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#191D18', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 6, fontFamily: 'var(--font-jetbrains)', fontSize: 11.5, color: '#E4E1D8' }}
                    cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                    formatter={v => [formatIDRCompact(v as number), 'Released']}
                  />
                  <Bar dataKey="amount" radius={[3, 3, 0, 0]}>
                    {DAILY_PAYMENTS.map((d, i) => (
                      <Cell key={i} fill={d.amount === maxPayment ? '#4CC38A' : 'rgba(76,195,138,0.45)'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Invoice table */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.24 }}
            style={{ background: 'var(--surface-1)', border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}>
            <div style={{ padding: '13px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
                Invoice records
                {invFilter !== 'all' && <span style={{ fontWeight: 400, color: 'var(--text-secondary)' }}> · {invFilter}</span>}
              </span>
              <span className="font-mono-custom" style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
                {invFilter === 'all' ? `${INVOICES.length} total` : `${shownInv.length} of ${INVOICES.length}`}
              </span>
            </div>
            <div className="table-scroll"><table className="dashboard-table cards">
              <thead>
                <tr>
                  <th>Invoice</th>
                  <th>Vendor</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Trigger time</th>
                  <th style={{ width: 180 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {shownInv.map(inv => (
                  <tr key={inv.id}>
                    <td data-label="Invoice"><span className="font-mono-custom" style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 600 }}>{inv.id}</span></td>
                    <td data-label="Vendor" style={{ fontSize: 13, color: 'var(--text-primary)' }}>{inv.vendor}</td>
                    <td data-label="Amount"><span className="font-mono-custom" style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>{formatIDR(inv.amount)}</span></td>
                    <td data-label="Status">
                      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: STATUS_DOT[inv.status as InvoiceStatus], flexShrink: 0 }} />
                        <span className={STATUS_BADGE[inv.status as InvoiceStatus]} style={{ fontSize: 10.5 }}>{inv.status}</span>
                      </div>
                    </td>
                    <td data-label="Trigger time"><span className="font-mono-custom" style={{ fontSize: 11.5, color: 'var(--text-secondary)' }}>{inv.triggeredAt ? formatTimestamp(inv.triggeredAt) : '-'}</span></td>
                    <td data-label="Actions">
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                        {inv.status === 'Pending'  && <><ActBtn label="Verify" onClick={() => doVerify(inv.id)} /><ActBtn label="Hold" tone="danger" onClick={() => doReject(inv.id)} /></>}
                        {inv.status === 'Verified' && <><ActBtn label="Release" onClick={() => doRelease(inv.id)} /><ViewBtn onClick={() => setModal({ id: inv.id })} /></>}
                        {inv.status === 'Released' && <ViewBtn onClick={() => setModal({ id: inv.id })} />}
                        {inv.status === 'Failed'   && <><ActBtn label="Retry" tone="amber" onClick={() => doRetry(inv.id)} /><ViewBtn onClick={() => setModal({ id: inv.id })} /></>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table></div>
          </motion.div>
        </div>

        {/* Vendor summary + contract log */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>

          {/* Vendor breakdown */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.3 }}
            style={{ background: 'var(--surface-1)', border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}>
            <div style={{ padding: '13px 20px', borderBottom: '1px solid var(--border)' }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Vendor payment summary</span>
            </div>
            <div className="table-scroll"><table className="dashboard-table">
              <thead>
                <tr>
                  <th>Vendor</th>
                  <th>Invoices</th>
                  <th>Settlement rate</th>
                  <th>Total paid (IDR)</th>
                </tr>
              </thead>
              <tbody>
                {VENDOR_SUMMARY.map(v => {
                  const rate = Math.round((v.released / v.invoices) * 100);
                  return (
                    <tr key={v.name}>
                      <td style={{ fontSize: 13, color: 'var(--text-primary)' }}>{v.name}</td>
                      <td><span className="font-mono-custom" style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{v.invoices}</span></td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ height: 4, width: 64, background: 'rgba(255,255,255,0.07)', borderRadius: 2, overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${rate}%`, background: rate === 100 ? '#4CC38A' : '#C9853A', borderRadius: 2 }} />
                          </div>
                          <span className="font-mono-custom" style={{ fontSize: 12, color: rate === 100 ? 'var(--accent)' : 'var(--amber)' }}>{rate}%</span>
                        </div>
                      </td>
                      <td><span className="font-mono-custom" style={{ fontSize: 13, color: 'var(--text-primary)' }}>{formatIDRCompact(v.total)}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table></div>
          </motion.div>

          {/* Contract log */}
          <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.45, delay: 0.32 }}
            style={{ background: 'rgba(76,195,138,0.04)', border: '1px solid rgba(76,195,138,0.14)', borderRadius: 8, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '13px 16px', borderBottom: '1px solid rgba(76,195,138,0.14)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#4CC38A' }} className="animate-blink" />
              <span style={{ fontSize: 12.5, color: 'var(--text-primary)', fontWeight: 500 }}>Recent payments</span>
            </div>
            <div style={{ padding: '14px 14px', flex: 1, overflow: 'auto', maxHeight: 360 }}>
              {contractLog.map((entry, i) => (
                <div key={entry.id} style={{ marginBottom: 16 }}>
                  <div className="font-mono-custom" style={{ fontSize: 10, color: '#475569', marginBottom: 3 }}>{formatTimestamp(entry.timestamp)}</div>
                  <div className="font-mono-custom" style={{ fontSize: 11, color: '#4CC38A', lineHeight: 1.65, wordBreak: 'break-word' }}>{entry.event}</div>
                  {i < contractLog.length - 1 && <div style={{ height: 1, background: 'rgba(76,195,138,0.08)', marginTop: 14 }} />}
                </div>
              ))}
              <span className="font-mono-custom" style={{ fontSize: 13, color: '#4CC38A' }}>▌</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ─── New invoice modal ─── */}
      <AnimatePresence>
        {newOpen && (
          <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setNewOpen(false)}>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.2 }} onClick={e => e.stopPropagation()}
              style={{ background: 'var(--surface-1)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, width: '100%', maxWidth: 440, margin: '0 16px', overflow: 'hidden' }}>
              <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)' }}>
                <div className="font-display" style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>Raise an invoice</div>
                <div style={{ fontSize: 12.5, color: 'var(--text-secondary)', marginTop: 3 }}>Creates a pending invoice. Verify it to release payment.</div>
              </div>
              <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={ilabel}>Vendor</label>
                  <select style={ifield} value={nvVendor} onChange={e => setNvVendor(e.target.value)}>
                    {VENDOR_OPTIONS.map(v => <option key={v} value={v}>{v}</option>)}
                  </select>
                </div>
                <div>
                  <label style={ilabel}>Amount (IDR)</label>
                  <input style={ifield} inputMode="numeric" placeholder="e.g. 125000000" value={nvAmount} onChange={e => setNvAmount(e.target.value)} />
                  {nvAmount.replace(/[^\d]/g, '') && (
                    <div style={{ fontSize: 11.5, color: 'var(--accent)', marginTop: 6 }}>{formatIDR(Number(nvAmount.replace(/[^\d]/g, '')))}</div>
                  )}
                </div>
              </div>
              <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                <button className="btn-ghost" style={{ fontSize: 13, padding: '9px 18px' }} onClick={() => setNewOpen(false)}>Cancel</button>
                <button className="btn-primary" style={{ fontSize: 13, padding: '9px 18px' }} onClick={doCreate}>Create invoice</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {modal && (() => {
        const inv = INVOICES.find(x => x.id === modal.id);
        if (!inv) return null;
        const trig = inv.triggeredAt ? formatTimestamp(inv.triggeredAt) : undefined;
        const released = inv.status === 'Released';
        const failed = inv.status === 'Failed';
        const event = released ? 'PAYMENT_RELEASED' : 'CONTRACT_VERIFIED';
        return (
          <Modal
            id={inv.id} eventType={event} label={inv.id}
            subtitle={inv.vendor}
            tone={failed ? 'bad' : released ? 'ok' : 'warn'}
            statusText={released ? 'Payment released' : failed ? 'Payment held' : 'Verified · payment pending'}
            hero={{ value: formatIDRCompact(inv.amount), caption: formatIDR(inv.amount), color: failed ? '#B84B44' : 'var(--accent)' }}
            details={[
              { label: 'Vendor', value: inv.vendor, full: true },
              { label: 'Amount', value: formatIDR(inv.amount), mono: true },
              { label: 'Status', value: <span className={STATUS_BADGE[inv.status as InvoiceStatus]} style={{ fontSize: 10.5 }}>{inv.status}</span> },
              { label: 'Verified at', value: trig ?? '—', mono: true },
            ]}
            timeline={[
              { label: 'Invoice raised', note: `From ${inv.vendor}`, state: 'done' },
              { label: 'Checked against quality & delivery', note: failed ? 'Conditions not met — held' : 'Conditions matched', time: trig, state: failed ? 'current' : 'done' },
              { label: 'Payment released', note: released ? 'Sent to vendor automatically' : failed ? 'Blocked until resolved' : 'Awaiting release', time: released ? trig : undefined, state: released ? 'done' : failed ? 'todo' : 'current' },
            ]}
            onClose={() => setModal(null)}
          />
        );
      })()}
    </>
  );
}
