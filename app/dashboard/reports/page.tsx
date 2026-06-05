'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

const TYPES = [
  { id: 'delivery',  name: 'Delivery report',     desc: 'Every shipment and handoff for the period, with proof.' },
  { id: 'quality',   name: 'Quality report',      desc: 'All batch scores and certificates issued.' },
  { id: 'payments',  name: 'Payment report',      desc: 'Invoices, settlement times, and amounts paid.' },
  { id: 'full',      name: 'Full audit pack',     desc: 'Everything above, ready to hand to a buyer or bank.' },
];

const RANGES = ['This week', 'This month', 'Last month', 'This quarter', 'Custom'];

const HISTORY = [
  { name: 'Full audit pack, May 2026',   type: 'Audit',    size: '2.4 MB', date: '01 Jun · 09:12', by: 'Daffa Arditya' },
  { name: 'Quality report, May 2026',    type: 'Quality',  size: '880 KB', date: '01 Jun · 09:05', by: 'Daffa Arditya' },
  { name: 'Payment report, May 2026',    type: 'Payment',  size: '1.1 MB', date: '01 Jun · 08:58', by: 'Auto · scheduled' },
  { name: 'Delivery report, Apr 2026',   type: 'Delivery', size: '1.6 MB', date: '02 Mei · 08:30', by: 'Auto · scheduled' },
  { name: 'Full audit pack, Q1 2026',    type: 'Audit',    size: '5.8 MB', date: '02 Apr · 10:14', by: 'Daffa Arditya' },
];

const SCHEDULED = [
  { name: 'Monthly payment report',  cadence: 'Every 1st · 09:00', to: 'finance@pabrik.co.id' },
  { name: 'Monthly delivery report', cadence: 'Every 1st · 09:00', to: 'ops@pabrik.co.id' },
];

const card: React.CSSProperties = { background: 'var(--surface-1)', border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' };

function DownloadBtn() {
  const [h, setH] = useState(false);
  return (
    <button onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ background: 'none', border: `1px solid ${h ? 'rgba(76,195,138,0.45)' : 'var(--border)'}`, borderRadius: 5, color: h ? 'var(--accent)' : 'var(--text-secondary)', fontSize: 11.5, padding: '5px 13px', cursor: 'pointer', fontFamily: 'var(--font-jetbrains)', transition: 'all 150ms', whiteSpace: 'nowrap' }}>
      ↓ Download
    </button>
  );
}

export default function ReportsPage() {
  const [type, setType] = useState('full');
  const [range, setRange] = useState('This month');

  return (
    <div style={{ padding: '28px 32px' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 className="font-display" style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>Reports</h1>
        <span style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>Generate proof you can hand to buyers, banks, and auditors</span>
      </div>

      {/* Generate */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: 'easeOut' as const }} style={{ ...card, marginBottom: 18 }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)' }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Generate a new report</span>
        </div>
        <div style={{ padding: 20 }}>
          {/* Type cards */}
          <div className="font-mono-custom" style={{ fontSize: 10.5, color: 'var(--text-secondary)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 12 }}>Report type</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: 24 }}>
            {TYPES.map(t => {
              const on = type === t.id;
              return (
                <button key={t.id} onClick={() => setType(t.id)}
                  style={{ textAlign: 'left', cursor: 'pointer', background: on ? 'rgba(76,195,138,0.07)' : 'var(--bg)', border: `1px solid ${on ? 'rgba(76,195,138,0.4)' : 'var(--border)'}`, borderRadius: 8, padding: '16px 16px', transition: 'all 150ms' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text-primary)' }}>{t.name}</span>
                    <span style={{ width: 14, height: 14, borderRadius: '50%', border: `1.5px solid ${on ? 'var(--accent)' : 'var(--border-strong)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {on && <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--accent)' }} />}
                    </span>
                  </div>
                  <div style={{ fontSize: 11.5, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{t.desc}</div>
                </button>
              );
            })}
          </div>

          {/* Range + action */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <div className="font-mono-custom" style={{ fontSize: 10.5, color: 'var(--text-secondary)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 10 }}>Time range</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {RANGES.map(r => (
                  <button key={r} onClick={() => setRange(r)}
                    style={{ fontSize: 12, padding: '7px 14px', borderRadius: 6, cursor: 'pointer', fontFamily: 'var(--font-dm-sans), sans-serif', background: range === r ? 'rgba(76,195,138,0.14)' : 'var(--bg)', border: `1px solid ${range === r ? 'rgba(76,195,138,0.35)' : 'var(--border)'}`, color: range === r ? 'var(--accent)' : 'var(--text-secondary)', transition: 'all 150ms' }}>
                    {r}
                  </button>
                ))}
              </div>
            </div>
            <button className="btn-primary" style={{ fontSize: 13 }}>Generate report →</button>
          </div>
        </div>
      </motion.div>

      {/* Two columns: history + scheduled */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.12 }} style={card}>
          <div style={{ padding: '13px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Recent reports</span>
            <span className="font-mono-custom" style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{HISTORY.length} files</span>
          </div>
          <table className="dashboard-table">
            <thead><tr><th>Report</th><th>Size</th><th>Generated</th><th></th></tr></thead>
            <tbody>
              {HISTORY.map(h => (
                <tr key={h.name}>
                  <td>
                    <div style={{ fontSize: 13, color: 'var(--text-primary)', marginBottom: 2 }}>{h.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>by {h.by}</div>
                  </td>
                  <td><span className="font-mono-custom" style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{h.size}</span></td>
                  <td><span className="font-mono-custom" style={{ fontSize: 11.5, color: 'var(--text-secondary)' }}>{h.date}</span></td>
                  <td><DownloadBtn /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.45, delay: 0.16 }} style={card}>
          <div style={{ padding: '13px 20px', borderBottom: '1px solid var(--border)' }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Sent automatically</span>
          </div>
          <div style={{ padding: '8px 20px 16px' }}>
            {SCHEDULED.map((s, i) => (
              <div key={s.name} style={{ padding: '14px 0', borderBottom: i < SCHEDULED.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--accent)', flexShrink: 0 }} />
                  <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>{s.name}</span>
                </div>
                <div className="font-mono-custom" style={{ fontSize: 11, color: 'var(--text-secondary)', paddingLeft: 15, lineHeight: 1.7 }}>
                  {s.cadence}<br />→ {s.to}
                </div>
              </div>
            ))}
            <button style={{ marginTop: 14, width: '100%', background: 'var(--bg)', border: '1px dashed var(--border-strong)', borderRadius: 6, color: 'var(--text-secondary)', fontSize: 12.5, padding: '10px', cursor: 'pointer', fontFamily: 'var(--font-dm-sans), sans-serif' }}>
              + Schedule a new report
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
