'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useDashboard } from '@/lib/store';
import { formatIDR, formatTimestamp } from '@/lib/utils';

const TYPES = [
  { id: 'delivery',  name: 'Delivery report',     desc: 'Every shipment and handoff for the period, with proof.' },
  { id: 'quality',   name: 'Quality report',      desc: 'All batch scores and certificates issued.' },
  { id: 'payments',  name: 'Payment report',      desc: 'Invoices, settlement times, and amounts paid.' },
  { id: 'full',      name: 'Full audit pack',     desc: 'Everything above, ready to hand to a buyer or bank.' },
];

const RANGES = ['This week', 'This month', 'Last month', 'This quarter', 'Custom'];

interface ReportFile { name: string; type: string; size: string; date: string; by: string; content: string; }

const SEED_HISTORY: ReportFile[] = [
  { name: 'Full audit pack, May 2026',   type: 'Audit',    size: '2.4 MB', date: '01 Jun · 09:12', by: 'Daffa Arditya', content: 'VERITAS — Full audit pack, May 2026\nArchived snapshot.' },
  { name: 'Quality report, May 2026',    type: 'Quality',  size: '880 KB', date: '01 Jun · 09:05', by: 'Daffa Arditya', content: 'VERITAS — Quality report, May 2026\nArchived snapshot.' },
  { name: 'Payment report, May 2026',    type: 'Payment',  size: '1.1 MB', date: '01 Jun · 08:58', by: 'Auto · scheduled', content: 'VERITAS — Payment report, May 2026\nArchived snapshot.' },
  { name: 'Delivery report, Apr 2026',   type: 'Delivery', size: '1.6 MB', date: '02 Mei · 08:30', by: 'Auto · scheduled', content: 'VERITAS — Delivery report, Apr 2026\nArchived snapshot.' },
];

const SCHEDULED = [
  { name: 'Monthly payment report',  cadence: 'Every 1st · 09:00', to: 'finance@pabrik.co.id' },
  { name: 'Monthly delivery report', cadence: 'Every 1st · 09:00', to: 'ops@pabrik.co.id' },
];

const card: React.CSSProperties = { background: 'var(--surface-1)', border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' };

function DownloadBtn({ onClick }: { onClick: () => void }) {
  const [h, setH] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ background: 'none', border: `1px solid ${h ? 'rgba(76,195,138,0.45)' : 'var(--border)'}`, borderRadius: 5, color: h ? 'var(--accent)' : 'var(--text-secondary)', fontSize: 11.5, padding: '5px 13px', cursor: 'pointer', fontFamily: 'var(--font-jetbrains)', transition: 'all 150ms', whiteSpace: 'nowrap' }}>
      ↓ Download
    </button>
  );
}

function triggerDownload(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export default function ReportsPage() {
  const { shipments, qcBatches, invoices, settings, notify } = useDashboard();
  const [type, setType] = useState('full');
  const [range, setRange] = useState('This month');
  const [history, setHistory] = useState<ReportFile[]>(SEED_HISTORY);
  const [busy, setBusy] = useState(false);

  const totalPaid = invoices.filter(i => i.status === 'Released').reduce((a, i) => a + i.amount, 0);
  const certs = qcBatches.filter(b => b.status === 'Passed').length;

  // What each report type will include, from live data
  const included: Record<string, { k: string; v: string }[]> = {
    delivery: [{ k: 'Shipments', v: `${shipments.length}` }, { k: 'Delivered', v: `${shipments.filter(s => s.status === 'Delivered').length}` }, { k: 'Flagged', v: `${shipments.filter(s => s.status === 'Flagged').length}` }],
    quality:  [{ k: 'Batches', v: `${qcBatches.length}` }, { k: 'Certificates', v: `${certs}` }, { k: 'Failures', v: `${qcBatches.filter(b => b.status === 'Failed').length}` }],
    payments: [{ k: 'Invoices', v: `${invoices.length}` }, { k: 'Released', v: `${invoices.filter(i => i.status === 'Released').length}` }, { k: 'Total paid', v: formatIDR(totalPaid) }],
    full:     [{ k: 'Shipments', v: `${shipments.length}` }, { k: 'Batches', v: `${qcBatches.length}` }, { k: 'Invoices', v: `${invoices.length}` }, { k: 'Total paid', v: formatIDR(totalPaid) }],
  };

  function buildContent(t: string): string {
    const line = '─'.repeat(48);
    const head = `VERITAS — ${TYPES.find(x => x.id === t)?.name}\nRange: ${range}   Generated: ${new Date().toLocaleString('id-ID')}\nFactory: ${settings.companyName}\n${line}\n`;
    const delivery = () => `SHIPMENTS (${shipments.length})\n` + shipments.map(s => `  ${s.id}  ${s.origin} → ${s.destination}  [${s.status}]  ${s.hash}`).join('\n');
    const quality = () => `QUALITY BATCHES (${qcBatches.length})\n` + qcBatches.map(b => `  ${b.id}  ${b.productLine}  score ${b.score}/100  [${b.status}]  ${b.hash}`).join('\n');
    const payments = () => `INVOICES (${invoices.length}) — total released ${formatIDR(totalPaid)}\n` + invoices.map(i => `  ${i.id}  ${i.vendor}  ${formatIDR(i.amount)}  [${i.status}]  ${i.hash}`).join('\n');
    const parts: string[] = [];
    if (t === 'delivery' || t === 'full') parts.push(delivery());
    if (t === 'quality'  || t === 'full') parts.push(quality());
    if (t === 'payments' || t === 'full') parts.push(payments());
    return head + parts.join(`\n\n`) + `\n${line}\nEvery reference above is permanent and independently verifiable.\n`;
  }

  function generate() {
    setBusy(true);
    const content = buildContent(type);
    const typeMeta = TYPES.find(x => x.id === type)!;
    const now = new Date();
    const name = `${typeMeta.name}, ${now.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}.txt`;
    const sizeKB = Math.max(1, Math.round((content.length / 1024) * 10) / 10);
    const file: ReportFile = {
      name, type: typeMeta.name.split(' ')[0], size: `${sizeKB} KB`,
      date: formatTimestamp(now), by: settings.operatorName, content,
    };
    setTimeout(() => {
      setHistory(h => [file, ...h]);
      triggerDownload(name, content);
      notify(`${typeMeta.name} generated & downloaded`);
      setBusy(false);
    }, 450);
  }

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

          {/* What's included (live) */}
          <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 8, padding: '12px 16px', marginBottom: 20 }}>
            <div className="font-mono-custom" style={{ fontSize: 10, color: 'var(--text-secondary)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 10 }}>Included from your live data</div>
            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
              {included[type].map(x => (
                <div key={x.k}>
                  <div className="font-mono-custom" style={{ fontSize: 16, fontWeight: 700, color: 'var(--accent)' }}>{x.v}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{x.k}</div>
                </div>
              ))}
            </div>
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
            <button className="btn-primary" style={{ fontSize: 13, opacity: busy ? 0.7 : 1 }} disabled={busy} onClick={generate}>
              {busy ? 'Generating…' : 'Generate report →'}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Two columns: history + scheduled */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.12 }} style={card}>
          <div style={{ padding: '13px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Recent reports</span>
            <span className="font-mono-custom" style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{history.length} files</span>
          </div>
          <div className="table-scroll"><table className="dashboard-table cards">
            <thead><tr><th>Report</th><th>Size</th><th>Generated</th><th></th></tr></thead>
            <tbody>
              {history.map((h, i) => (
                <tr key={`${h.name}-${i}`}>
                  <td data-label="Report">
                    <div style={{ fontSize: 13, color: 'var(--text-primary)', marginBottom: 2 }}>{h.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>by {h.by}</div>
                  </td>
                  <td data-label="Size"><span className="font-mono-custom" style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{h.size}</span></td>
                  <td data-label="Generated"><span className="font-mono-custom" style={{ fontSize: 11.5, color: 'var(--text-secondary)' }}>{h.date}</span></td>
                  <td data-label=""><DownloadBtn onClick={() => triggerDownload(h.name.endsWith('.txt') ? h.name : `${h.name}.txt`, h.content)} /></td>
                </tr>
              ))}
            </tbody>
          </table></div>
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
