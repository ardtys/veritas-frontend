'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  LineChart, Line, CartesianGrid, ReferenceLine,
} from 'recharts';
import { formatTimestamp } from '@/lib/utils';
import { useDashboard, PRODUCT_LINES } from '@/lib/store';
import Modal from '@/components/shared/Modal';

interface ModalState { id: string; }

const field: React.CSSProperties = { width: '100%', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 6, padding: '10px 12px', fontSize: 13.5, color: 'var(--text-primary)', fontFamily: 'var(--font-dm-sans), sans-serif', outline: 'none' };
const flabel: React.CSSProperties = { display: 'block', fontSize: 11, color: 'var(--text-secondary)', marginBottom: 7, fontFamily: 'var(--font-jetbrains), monospace', letterSpacing: '0.05em', textTransform: 'uppercase' };

const scoreColor = (s: number) => s >= 90 ? '#4CC38A' : s >= 70 ? '#C9853A' : '#B84B44';
const scoreBadge = (s: string) => s === 'Passed' ? 'badge badge-green' : s === 'Failed' ? 'badge badge-red' : 'badge badge-neutral';

/* ─── Static mock data ─── */
const TREND_7D = [
  { day: 'Sen', rate: 88 }, { day: 'Sel', rate: 91 }, { day: 'Rab', rate: 87 },
  { day: 'Kam', rate: 94 }, { day: 'Jum', rate: 90 }, { day: 'Sab', rate: 96 },
  { day: 'Min', rate: 97 },
];

const PRODUCT_PERF = [
  { name: 'Baja Lembaran G-40',    batches: 18, passRate: 94, avg: 91 },
  { name: 'Komponen Otomotif K-12', batches: 12, passRate: 83, avg: 85 },
  { name: 'Kawat Las WL-200',       batches:  9, passRate: 100, avg: 94 },
  { name: 'Polymer PP-N50',         batches: 11, passRate: 73, avg: 78 },
  { name: 'Pipa Galvanis PG-8',     batches:  7, passRate: 100, avg: 96 },
];

const DEFECT_REASONS = [
  { reason: 'Dimensional variance',  count: 12 },
  { reason: 'Surface defects',       count:  8 },
  { reason: 'Material composition',  count:  5 },
  { reason: 'Weight out of spec',    count:  3 },
];

function CertBtn({ onClick, label = 'Certificate ↗' }: { onClick: () => void; label?: string }) {
  const [h, setH] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ background: h ? 'rgba(76,195,138,0.1)' : 'none', border: `1px solid ${h ? 'rgba(76,195,138,0.45)' : 'rgba(76,195,138,0.22)'}`, borderRadius: 5, color: 'var(--accent)', fontSize: 11, padding: '5px 12px', cursor: 'pointer', fontFamily: 'var(--font-jetbrains)', transition: 'all 150ms', whiteSpace: 'nowrap' }}>
      {label}
    </button>
  );
}

export default function QualityControlPage() {
  const { qcBatches, runQC, deleteBatch, settings, notify } = useDashboard();
  const [modal, setModal] = useState<ModalState | null>(null);
  const [runOpen, setRunOpen] = useState(false);
  const [runLine, setRunLine] = useState(PRODUCT_LINES[0]);
  const [runScore, setRunScore] = useState('');     // '' = simulate a reading
  const [qcFilter, setQcFilter] = useState<'all' | 'Passed' | 'Failed'>('all');

  const passed   = qcBatches.filter(b => b.status === 'Passed').length;
  const failed   = qcBatches.filter(b => b.status === 'Failed').length;
  const avgScore = qcBatches.length ? Math.round(qcBatches.reduce((s, b) => s + b.score, 0) / qcBatches.length) : 0;
  const passRate = qcBatches.length ? Math.round((passed / qcBatches.length) * 100) : 0;
  const chartData = qcBatches.map(b => ({ id: b.id.replace('BATCH-0', '#'), score: b.score }));
  const shownBatches = qcFilter === 'all' ? qcBatches : qcBatches.filter(b => b.status === qcFilter);
  const toggleQc = (s: 'Passed' | 'Failed') => setQcFilter(cur => (cur === s ? 'all' : s));

  function doRun() {
    const parsed = runScore.trim() === '' ? undefined : Math.max(0, Math.min(100, Number(runScore)));
    runQC(runLine, parsed);
    const verdict = parsed === undefined ? '' : parsed >= settings.qcThreshold ? ' — passed' : ' — failed';
    notify(`QC check recorded for ${runLine}${verdict}`, verdict.includes('failed') ? 'warn' : 'ok');
    setRunOpen(false);
    setRunScore('');
  }

  return (
    <>
      <div style={{ padding: '28px 32px' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 14 }}>
          <div>
            <h1 className="font-display" style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>Quality Control</h1>
            <span className="font-mono-custom" style={{ fontSize: 11.5, color: 'var(--text-secondary)' }}>
              Batch scores · quality certificates · pass threshold {settings.qcThreshold}
            </span>
          </div>
          <button className="btn-primary" style={{ fontSize: 13, padding: '10px 18px' }} onClick={() => setRunOpen(true)}>+ Run QC check</button>
        </div>

        {/* KPIs (Passed / Failed are clickable filters) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 20 }}>
          {([
            { label: 'Passed Today',    value: passed,         color: '#4CC38A',          filter: 'Passed' as const },
            { label: 'Failed Today',    value: failed,         color: '#B84B44',          filter: 'Failed' as const },
            { label: 'Average Score',   value: `${avgScore}`,  color: 'var(--text-primary)', filter: null },
            { label: '7-day Pass Rate', value: `${passRate}%`, color: '#4CC38A',          filter: null },
          ]).map((s, i) => {
            const on = s.filter !== null && qcFilter === s.filter;
            const clickable = s.filter !== null;
            return (
              <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: 'easeOut' as const, delay: i * 0.06 }}
                whileHover={clickable ? { y: -2 } : undefined}
                onClick={clickable ? () => toggleQc(s.filter!) : undefined}
                style={{ background: on ? 'rgba(76,195,138,0.08)' : 'var(--surface-1)', border: `1px solid ${on ? 'rgba(76,195,138,0.45)' : 'var(--border)'}`, borderRadius: 8, padding: '18px 22px', cursor: clickable ? 'pointer' : 'default', transition: 'background 160ms, border-color 160ms' }}>
                <div className="font-mono-custom" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10.5, color: 'var(--text-secondary)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 10 }}>{s.label}{on && <span style={{ color: 'var(--accent)', textTransform: 'none', letterSpacing: 0 }}>· on</span>}</div>
                <div className="font-mono-custom" style={{ fontSize: 28, fontWeight: 700, color: s.color }}>{s.value}</div>
              </motion.div>
            );
          })}
        </div>

        {/* Two charts: trend + score dist */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>

          {/* 7-day pass rate trend */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }}
            style={{ background: 'var(--surface-1)', border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}>
            <div style={{ padding: '13px 20px', borderBottom: '1px solid var(--border)' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>Pass rate trend</div>
              <div className="font-mono-custom" style={{ fontSize: 10.5, color: 'var(--text-secondary)' }}>Last 7 days (%)</div>
            </div>
            <div style={{ padding: '16px 12px 8px' }}>
              <ResponsiveContainer width="100%" height={160}>
                <LineChart data={TREND_7D} margin={{ top: 4, right: 4, bottom: 0, left: -24 }}>
                  <CartesianGrid strokeDasharray="2 4" stroke="rgba(255,255,255,0.04)" vertical={false} />
                  <XAxis dataKey="day" tick={{ fontFamily: 'var(--font-jetbrains)', fontSize: 9.5, fill: '#6B6E68' }} axisLine={false} tickLine={false} />
                  <YAxis domain={[75, 100]} tick={{ fontFamily: 'var(--font-jetbrains)', fontSize: 9.5, fill: '#6B6E68' }} axisLine={false} tickLine={false} />
                  <ReferenceLine y={90} stroke="rgba(76,195,138,0.25)" strokeDasharray="3 3" label={{ value: 'target', fontSize: 9, fill: '#6B6E68', position: 'right' }} />
                  <Tooltip contentStyle={{ backgroundColor: '#191D18', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 6, fontFamily: 'var(--font-jetbrains)', fontSize: 11.5, color: '#E4E1D8' }} cursor={{ stroke: 'rgba(255,255,255,0.07)' }} formatter={v => [`${v}%`, 'Pass rate']} />
                  <Line type="monotone" dataKey="rate" stroke="#4CC38A" strokeWidth={2} dot={{ r: 3, fill: '#4CC38A', strokeWidth: 0 }} activeDot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Score distribution */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.24 }}
            style={{ background: 'var(--surface-1)', border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}>
            <div style={{ padding: '13px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>Score distribution</div>
                <div className="font-mono-custom" style={{ fontSize: 10.5, color: 'var(--text-secondary)' }}>All {qcBatches.length} recent batches</div>
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                {[{ c: '#4CC38A', l: '90+' }, { c: '#C9853A', l: '70-89' }, { c: '#B84B44', l: '<70' }].map(x => (
                  <div key={x.l} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <div style={{ width: 7, height: 7, borderRadius: 2, background: x.c }} />
                    <span className="font-mono-custom" style={{ fontSize: 9.5, color: 'var(--text-secondary)' }}>{x.l}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ padding: '16px 12px 8px' }}>
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={chartData} margin={{ top: 0, right: 4, bottom: 0, left: -24 }} barSize={14}>
                  <XAxis dataKey="id" tick={{ fontFamily: 'var(--font-jetbrains)', fontSize: 9, fill: '#6B6E68' }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 100]} tick={{ fontFamily: 'var(--font-jetbrains)', fontSize: 9.5, fill: '#6B6E68' }} axisLine={false} tickLine={false} />
                  <ReferenceLine y={90} stroke="rgba(76,195,138,0.2)" strokeDasharray="3 3" />
                  <ReferenceLine y={70} stroke="rgba(201,133,58,0.2)" strokeDasharray="3 3" />
                  <Tooltip contentStyle={{ backgroundColor: '#191D18', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 6, fontFamily: 'var(--font-jetbrains)', fontSize: 11.5, color: '#E4E1D8' }} cursor={{ fill: 'rgba(255,255,255,0.03)' }} formatter={v => [`${v}/100`, 'Score']} />
                  <Bar dataKey="score" radius={[2, 2, 0, 0]}>
                    {chartData.map((e, i) => <Cell key={i} fill={scoreColor(e.score)} opacity={0.85} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* Bottom row: product perf + defect reasons */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16, marginBottom: 20 }}>

          {/* Product line performance */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.28 }}
            style={{ background: 'var(--surface-1)', border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}>
            <div style={{ padding: '13px 20px', borderBottom: '1px solid var(--border)' }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Product line performance</span>
            </div>
            <div className="table-scroll"><table className="dashboard-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Batches</th>
                  <th>Pass rate</th>
                  <th>Avg score</th>
                </tr>
              </thead>
              <tbody>
                {PRODUCT_PERF.map(p => (
                  <tr key={p.name}>
                    <td style={{ fontSize: 13, color: 'var(--text-primary)' }}>{p.name}</td>
                    <td><span className="font-mono-custom" style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{p.batches}</span></td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ height: 4, width: 64, background: 'rgba(255,255,255,0.07)', borderRadius: 2, overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${p.passRate}%`, background: p.passRate >= 90 ? '#4CC38A' : '#C9853A', borderRadius: 2 }} />
                        </div>
                        <span className="font-mono-custom" style={{ fontSize: 12, color: p.passRate >= 90 ? 'var(--accent)' : 'var(--amber)' }}>{p.passRate}%</span>
                      </div>
                    </td>
                    <td><span className="font-mono-custom" style={{ fontSize: 13, fontWeight: 600, color: scoreColor(p.avg) }}>{p.avg}</span></td>
                  </tr>
                ))}
              </tbody>
            </table></div>
          </motion.div>

          {/* Defect reasons */}
          <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.45, delay: 0.3 }}
            style={{ background: 'var(--surface-1)', border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}>
            <div style={{ padding: '13px 20px', borderBottom: '1px solid var(--border)' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>Top defect reasons</div>
              <div className="font-mono-custom" style={{ fontSize: 10.5, color: 'var(--text-secondary)' }}>This month</div>
            </div>
            <div style={{ padding: '16px 20px' }}>
              {DEFECT_REASONS.map((d, i) => (
                <div key={d.reason} style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                    <span style={{ fontSize: 13, color: 'var(--text-primary)' }}>{d.reason}</span>
                    <span className="font-mono-custom" style={{ fontSize: 12, color: '#B84B44' }}>{d.count}</span>
                  </div>
                  <div style={{ height: 4, background: 'rgba(255,255,255,0.07)', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${(d.count / DEFECT_REASONS[0].count) * 100}%`, background: '#B84B44', opacity: 0.7 - i * 0.1, borderRadius: 2 }} />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Batch card grid */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.3 }}>
          <div style={{ padding: '0 0 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
              Individual batch results
              {qcFilter !== 'all' && (
                <button onClick={() => setQcFilter('all')} style={{ marginLeft: 8, fontWeight: 400, fontSize: 12, background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', textDecoration: 'underline' }}>
                  {qcFilter} only · clear
                </button>
              )}
            </span>
            <span className="font-mono-custom" style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
              {qcFilter === 'all' ? `${qcBatches.length} batches` : `${shownBatches.length} of ${qcBatches.length}`}
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
            {shownBatches.map((b, i) => (
              <motion.div key={b.id}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: 'easeOut' as const, delay: 0.3 + i * 0.03 }}
                style={{ background: 'var(--surface-1)', border: '1px solid var(--border)', borderRadius: 8, padding: '18px 20px', transition: 'border-color 200ms' }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.1)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)'; }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                  <span className="font-mono-custom" style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 600 }}>{b.id}</span>
                  <span className={scoreBadge(b.status)} style={{ fontSize: 10 }}>{b.status}</span>
                </div>
                <div className="font-mono-custom" style={{ fontSize: 44, fontWeight: 800, lineHeight: 1, color: scoreColor(b.score), letterSpacing: '-0.03em', marginBottom: 4 }}>{b.score}</div>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 10 }}>/ 100</div>
                <div style={{ height: 4, background: 'rgba(255,255,255,0.07)', borderRadius: 2, marginBottom: 12, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${b.score}%`, background: scoreColor(b.score), borderRadius: 2 }} />
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 14 }}>{b.productLine}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTop: '1px solid var(--border)' }}>
                  <span className="font-mono-custom" style={{ fontSize: 10.5, color: 'var(--text-secondary)', opacity: 0.7 }}>{formatTimestamp(b.timestamp)}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <CertBtn label={b.status === 'Passed' ? 'Certificate ↗' : 'Result ↗'} onClick={() => setModal({ id: b.id })} />
                    <button title="Delete batch" onClick={() => { deleteBatch(b.id); notify(`Batch ${b.id} removed`, 'warn'); }}
                      style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 5, color: 'var(--text-secondary)', fontSize: 11, lineHeight: 1, padding: '5px 9px', cursor: 'pointer', fontFamily: 'var(--font-jetbrains)' }}>✕</button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ─── Run QC check modal ─── */}
      <AnimatePresence>
        {runOpen && (
          <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setRunOpen(false)}>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.2 }} onClick={e => e.stopPropagation()}
              style={{ background: 'var(--surface-1)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, width: '100%', maxWidth: 440, margin: '0 16px', overflow: 'hidden' }}>
              <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)' }}>
                <div className="font-display" style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>Run a quality check</div>
                <div style={{ fontSize: 12.5, color: 'var(--text-secondary)', marginTop: 3 }}>Records a new batch result. Anything below {settings.qcThreshold} fails.</div>
              </div>
              <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={flabel}>Product line</label>
                  <select style={field} value={runLine} onChange={e => setRunLine(e.target.value)}>
                    {PRODUCT_LINES.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label style={flabel}>Score (leave blank to simulate a sensor reading)</label>
                  <input style={field} type="number" min={0} max={100} placeholder="auto" value={runScore} onChange={e => setRunScore(e.target.value)} />
                </div>
              </div>
              <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                <button className="btn-ghost" style={{ fontSize: 13, padding: '9px 18px' }} onClick={() => setRunOpen(false)}>Cancel</button>
                <button className="btn-primary" style={{ fontSize: 13, padding: '9px 18px' }} onClick={doRun}>Run check</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {modal && (() => {
        const b = qcBatches.find(x => x.id === modal.id);
        if (!b) return null;
        const passed = b.status === 'Passed';
        const ts = formatTimestamp(b.timestamp);
        return (
          <Modal
            id={b.id} eventType={passed ? 'QC_CERTIFICATE' : 'QC_RESULT'} label={b.id}
            subtitle={b.productLine}
            tone={passed ? 'ok' : b.status === 'Failed' ? 'bad' : 'warn'}
            statusText={passed ? 'Passed quality control' : b.status === 'Failed' ? 'Failed quality control' : 'Pending review'}
            hero={{ value: b.score, caption: `Score out of 100 · pass mark ${settings.qcThreshold}`, color: scoreColor(b.score) }}
            details={[
              { label: 'Product line', value: b.productLine, full: true },
              { label: 'Result', value: <span className={scoreBadge(b.status)} style={{ fontSize: 10.5 }}>{b.status}</span> },
              { label: 'Score vs threshold', value: `${b.score} / ${settings.qcThreshold}`, mono: true },
              { label: 'Inspected', value: ts, mono: true },
            ]}
            timeline={[
              { label: 'Sample received', note: 'Pulled from production line', state: 'done' },
              { label: 'Inspection complete', note: 'Measurements & visual check', state: 'done' },
              { label: passed ? 'Certificate issued' : 'Result recorded', note: passed ? 'Buyer can verify independently' : `Below the ${settings.qcThreshold} pass mark`, time: ts, state: 'done' },
            ]}
            onClose={() => setModal(null)}
          />
        );
      })()}
    </>
  );
}
