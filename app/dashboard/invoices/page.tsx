'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { INVOICES, CONTRACT_LOG } from '@/lib/mockData';
import { formatIDR, formatIDRCompact, formatTimestamp } from '@/lib/utils';
import Modal from '@/components/shared/Modal';

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

interface ModalState { id: string; event: string; label: string; }

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
  const [modal, setModal] = useState<ModalState | null>(null);
  const totalReleased = INVOICES.filter(i => i.status === 'Released').reduce((s, i) => s + i.amount, 0);
  const countReleased = INVOICES.filter(i => i.status === 'Released').length;
  const countPending  = INVOICES.filter(i => i.status === 'Pending').length;
  const countFailed   = INVOICES.filter(i => i.status === 'Failed').length;

  const maxPayment = Math.max(...DAILY_PAYMENTS.map(d => d.amount));

  return (
    <>
      <div style={{ padding: '28px 32px' }}>

        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <h1 className="font-display" style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>Invoices</h1>
          <span className="font-mono-custom" style={{ fontSize: 11.5, color: 'var(--text-secondary)' }}>
            Automatic payment records · vendor settlement history
          </span>
        </div>

        {/* KPIs */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 12, marginBottom: 20 }}>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: 'easeOut' as const }}
            style={{ background: 'var(--surface-1)', border: '1px solid var(--border)', borderRadius: 8, padding: '20px 24px' }}>
            <div className="font-mono-custom" style={{ fontSize: 10.5, color: 'var(--text-secondary)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 10 }}>Total Released Today</div>
            <div className="font-mono-custom" style={{ fontSize: 28, fontWeight: 700, color: 'var(--accent)', letterSpacing: '-0.02em', marginBottom: 5 }}>{formatIDRCompact(totalReleased)}</div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{formatIDR(totalReleased)} · {countReleased} transactions</div>
          </motion.div>
          {[
            { label: 'Released', value: countReleased, color: '#4CC38A' },
            { label: 'Pending',  value: countPending,  color: '#C9853A' },
            { label: 'Failed',   value: countFailed,   color: '#B84B44' },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut' as const, delay: (i + 1) * 0.06 }}
              style={{ background: 'var(--surface-1)', border: '1px solid var(--border)', borderRadius: 8, padding: '20px 22px' }}>
              <div className="font-mono-custom" style={{ fontSize: 10.5, color: 'var(--text-secondary)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 10 }}>{s.label}</div>
              <div className="font-mono-custom" style={{ fontSize: 28, fontWeight: 700, color: s.color }}>{s.value}</div>
            </motion.div>
          ))}
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
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Invoice records</span>
              <span className="font-mono-custom" style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{INVOICES.length} total</span>
            </div>
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Invoice</th>
                  <th>Vendor</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Trigger time</th>
                  <th style={{ width: 70 }}></th>
                </tr>
              </thead>
              <tbody>
                {INVOICES.map(inv => (
                  <tr key={inv.id}>
                    <td><span className="font-mono-custom" style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 600 }}>{inv.id}</span></td>
                    <td style={{ fontSize: 13, color: 'var(--text-primary)' }}>{inv.vendor}</td>
                    <td><span className="font-mono-custom" style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>{formatIDR(inv.amount)}</span></td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: STATUS_DOT[inv.status as InvoiceStatus], flexShrink: 0 }} />
                        <span className={STATUS_BADGE[inv.status as InvoiceStatus]} style={{ fontSize: 10.5 }}>{inv.status}</span>
                      </div>
                    </td>
                    <td><span className="font-mono-custom" style={{ fontSize: 11.5, color: 'var(--text-secondary)' }}>{inv.triggeredAt ? formatTimestamp(inv.triggeredAt) : '-'}</span></td>
                    <td>{inv.status !== 'Pending' && <ViewBtn onClick={() => setModal({ id: inv.id, event: inv.status === 'Released' ? 'PAYMENT_RELEASED' : 'CONTRACT_VERIFIED', label: inv.id })} />}</td>
                  </tr>
                ))}
              </tbody>
            </table>
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
            <table className="dashboard-table">
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
            </table>
          </motion.div>

          {/* Contract log */}
          <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.45, delay: 0.32 }}
            style={{ background: 'rgba(76,195,138,0.04)', border: '1px solid rgba(76,195,138,0.14)', borderRadius: 8, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '13px 16px', borderBottom: '1px solid rgba(76,195,138,0.14)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#4CC38A' }} className="animate-blink" />
              <span style={{ fontSize: 12.5, color: 'var(--text-primary)', fontWeight: 500 }}>Recent payments</span>
            </div>
            <div style={{ padding: '14px 14px', flex: 1, overflow: 'auto' }}>
              {CONTRACT_LOG.map((entry, i) => (
                <div key={entry.id} style={{ marginBottom: 16 }}>
                  <div className="font-mono-custom" style={{ fontSize: 10, color: '#475569', marginBottom: 3 }}>{formatTimestamp(entry.timestamp)}</div>
                  <div className="font-mono-custom" style={{ fontSize: 11, color: '#4CC38A', lineHeight: 1.65, wordBreak: 'break-word' }}>{entry.event}</div>
                  {i < CONTRACT_LOG.length - 1 && <div style={{ height: 1, background: 'rgba(76,195,138,0.08)', marginTop: 14 }} />}
                </div>
              ))}
              <span className="font-mono-custom" style={{ fontSize: 13, color: '#4CC38A' }}>▌</span>
            </div>
          </motion.div>
        </div>
      </div>

      {modal && <Modal id={modal.id} eventType={modal.event} label={modal.label} onClose={() => setModal(null)} />}
    </>
  );
}
