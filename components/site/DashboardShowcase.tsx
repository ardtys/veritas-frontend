'use client';

/**
 * Product showcase for the landing page.
 *
 * A faithful, in-page recreation of the real dashboard so visitors can SEE
 * what Veritas is before they click through. It reuses the app's dark theme
 * tokens (via the `theme-dark` class) so it always matches the real product,
 * and lets people flip through each module the way they would in the app.
 */

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { useRef } from 'react';

const TABS = [
  { id: 'overview',  label: 'Overview' },
  { id: 'supply',    label: 'Supply chain' },
  { id: 'quality',   label: 'Quality' },
  { id: 'invoices',  label: 'Invoices' },
  { id: 'analytics', label: 'Analytics' },
] as const;

type TabId = typeof TABS[number]['id'];

const mono = 'var(--font-jetbrains), monospace';
const surface1 = 'var(--surface-1)';
const border = 'var(--border)';

/* ── small shared bits ── */
function Panel({ title, sub, children, right }: { title: string; sub?: string; children: React.ReactNode; right?: React.ReactNode }) {
  return (
    <div style={{ background: surface1, border: `1px solid ${border}`, borderRadius: 8, overflow: 'hidden' }}>
      <div style={{ padding: '11px 16px', borderBottom: `1px solid ${border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
        <div>
          <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text-primary)' }}>{title}</div>
          {sub && <div style={{ fontFamily: mono, fontSize: 10, color: 'var(--text-secondary)', marginTop: 1 }}>{sub}</div>}
        </div>
        {right}
      </div>
      {children}
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div style={{ background: surface1, border: `1px solid ${border}`, borderRadius: 8, padding: '14px 16px' }}>
      <div style={{ fontFamily: mono, fontSize: 9.5, color: 'var(--text-secondary)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8 }}>{label}</div>
      <div style={{ fontFamily: mono, fontSize: 22, fontWeight: 700, color: accent ? 'var(--accent)' : 'var(--text-primary)', letterSpacing: '-0.02em' }}>{value}</div>
    </div>
  );
}

function MiniBtn({ children, tone = 'neutral' }: { children: React.ReactNode; tone?: 'neutral' | 'accent' }) {
  return (
    <span style={{ fontFamily: mono, fontSize: 10.5, padding: '4px 9px', borderRadius: 5, border: `1px solid ${tone === 'accent' ? 'rgba(76,195,138,0.4)' : border}`, color: tone === 'accent' ? 'var(--accent)' : 'var(--text-secondary)', whiteSpace: 'nowrap' }}>{children}</span>
  );
}

/* ── module mockups ── */
function OverviewMock() {
  const feed = [
    { badge: 'badge-green',   tag: 'Payment',  dot: '#4CC38A', text: 'Payment sent automatically for INV-3847', t: '12:51' },
    { badge: 'badge-green',   tag: 'Passed',   dot: '#4CC38A', text: 'Batch BATCH-0094 passed quality check — scored 97/100', t: '12:50' },
    { badge: 'badge-neutral', tag: 'Shipment', dot: '#6B6E68', text: 'Shipment SHP-2281 recorded — Surabaya to Jakarta', t: '12:48' },
    { badge: 'badge-amber',   tag: 'Invoice',  dot: '#C9853A', text: 'Invoice INV-3848 checked — quality and delivery matched', t: '12:46' },
  ];
  const bars = [34, 48, 30, 56, 42, 61, 38, 52, 64, 47, 58, 70];
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: 14 }}>
        <Stat label="Records Saved" value="12.400" accent />
        <Stat label="Quality Checks" value="84" />
        <Stat label="Invoices" value="31" />
        <Stat label="Avg. Payment" value="2.8s" accent />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 12 }}>
        <Panel title="Activity feed" right={<span style={{ fontFamily: mono, fontSize: 10, color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: 5 }}><span className="animate-blink" style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)' }} />live</span>}>
          <div style={{ padding: '4px 16px 10px' }}>
            {feed.map((e, i) => (
              <div key={i} style={{ display: 'flex', gap: 11, padding: '10px 0', borderBottom: i < feed.length - 1 ? `1px solid ${border}` : 'none' }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: e.dot, marginTop: 4, flexShrink: 0 }} />
                <div style={{ minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 3 }}>
                    <span className={`badge ${e.badge}`} style={{ fontSize: 9 }}>{e.tag}</span>
                    <span style={{ fontFamily: mono, fontSize: 9.5, color: 'var(--text-secondary)' }}>{e.t}</span>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-primary)', lineHeight: 1.45 }}>{e.text}</div>
                </div>
              </div>
            ))}
          </div>
        </Panel>
        <Panel title="Activity per hour" sub="last 12 hours">
          <div style={{ padding: '18px 16px 14px', display: 'flex', alignItems: 'flex-end', gap: 4, height: 150 }}>
            {bars.map((h, i) => (
              <div key={i} style={{ flex: 1, height: `${h}%`, background: i === bars.length - 1 ? 'var(--accent)' : 'rgba(76,195,138,0.4)', borderRadius: '2px 2px 0 0' }} />
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderBottom: `1px solid ${border}` }}>{children}</div>;
}

function SupplyMock() {
  const rows = [
    { id: 'SHP-2281', route: 'Surabaya → Jakarta', badge: 'badge-amber', status: 'Flagged', dot: '#C9853A' },
    { id: 'SHP-2282', route: 'Bandung → Makassar', badge: 'badge-neutral', status: 'In Transit', dot: '#6B6E68' },
    { id: 'SHP-2280', route: 'Jakarta → Balikpapan', badge: 'badge-green', status: 'Delivered', dot: '#4CC38A' },
    { id: 'SHP-2277', route: 'Balikpapan → Surabaya', badge: 'badge-neutral', status: 'In Transit', dot: '#6B6E68' },
  ];
  return (
    <Panel title="Shipment records" right={<span style={{ fontFamily: mono, fontSize: 10.5, color: 'var(--text-secondary)' }}>10 total</span>}>
      <div>
        {rows.map(r => (
          <Row key={r.id}>
            <span style={{ fontFamily: mono, fontSize: 12.5, color: 'var(--accent)', fontWeight: 600, width: 78, flexShrink: 0 }}>{r.id}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1, minWidth: 0 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: r.dot, flexShrink: 0 }} />
              <span style={{ fontSize: 12.5, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.route}</span>
            </span>
            <span className={`badge ${r.badge}`} style={{ fontSize: 9.5, flexShrink: 0 }}>{r.status}</span>
            <span style={{ display: 'flex', gap: 5, flexShrink: 0 }}><MiniBtn tone="accent">Advance</MiniBtn><MiniBtn>View</MiniBtn></span>
          </Row>
        ))}
      </div>
    </Panel>
  );
}

function ScoreCard({ score, line, badge, status, color }: { score: number; line: string; badge: string; status: string; color: string }) {
  return (
    <div style={{ background: surface1, border: `1px solid ${border}`, borderRadius: 8, padding: '16px 18px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
        <span style={{ fontFamily: mono, fontSize: 11, color: 'var(--accent)', fontWeight: 600 }}>BATCH-009{score === 97 ? '4' : '6'}</span>
        <span className={`badge ${badge}`} style={{ fontSize: 9 }}>{status}</span>
      </div>
      <div style={{ fontFamily: mono, fontSize: 38, fontWeight: 800, lineHeight: 1, color, letterSpacing: '-0.03em', marginBottom: 8 }}>{score}</div>
      <div style={{ height: 4, background: 'rgba(255,255,255,0.07)', borderRadius: 2, overflow: 'hidden', marginBottom: 10 }}>
        <div style={{ height: '100%', width: `${score}%`, background: color, borderRadius: 2 }} />
      </div>
      <div style={{ fontSize: 11.5, color: 'var(--text-secondary)' }}>{line}</div>
    </div>
  );
}

function QualityMock() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <ScoreCard score={97} line="Baja Lembaran G-40" badge="badge-green" status="Passed" color="#4CC38A" />
        <ScoreCard score={63} line="Pelat Aluminium A3" badge="badge-red" status="Failed" color="#B84B44" />
      </div>
      {/* The verifiable proof — your trust payoff */}
      <div style={{ background: surface1, border: '1px solid rgba(76,195,138,0.22)', borderRadius: 8, padding: '18px 18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 12 }}>
          <span style={{ width: 30, height: 30, borderRadius: 8, background: 'rgba(76,195,138,0.12)', border: '1px solid rgba(76,195,138,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="16" height="16" viewBox="0 0 22 22" fill="none"><path d="M11 2 L19 6 L19 11 C19 16 15 19.5 11 20.5 C7 19.5 3 16 3 11 L3 6 Z" fill="rgba(76,195,138,0.2)" stroke="#4CC38A" strokeWidth="1.3" strokeLinejoin="round" /><path d="M7.5 11 L10 13.5 L14.5 8.5" stroke="#4CC38A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </span>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>Quality certificate</div>
        </div>
        <div style={{ fontSize: 11.5, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 14 }}>Your buyer can open this and confirm it themselves — no need to take your word for it.</div>
        <div style={{ fontSize: 10.5, color: 'var(--text-secondary)', marginBottom: 4 }}>Reference number</div>
        <div style={{ fontFamily: mono, fontSize: 12.5, color: 'var(--accent)', letterSpacing: '0.04em', background: 'rgba(76,195,138,0.05)', border: '1px solid rgba(76,195,138,0.12)', borderRadius: 6, padding: '9px 12px' }}>E62E 168D 2D95 C3E6</div>
      </div>
    </div>
  );
}

function InvoicesMock() {
  const rows = [
    { id: 'INV-3847', vendor: 'PT Baja Nusantara', amt: 'Rp 187.500.000', badge: 'badge-green', status: 'Released', action: 'View', hl: false },
    { id: 'INV-3848', vendor: 'CV Pratama Teknik', amt: 'Rp 94.200.000', badge: 'badge-neutral', status: 'Verified', action: 'Release', hl: true },
    { id: 'INV-3844', vendor: 'PT Indo Polymer', amt: 'Rp 210.000.000', badge: 'badge-amber', status: 'Pending', action: 'Verify', hl: false },
    { id: 'INV-3846', vendor: 'PT Sumber Makmur', amt: 'Rp 340.000.000', badge: 'badge-green', status: 'Released', action: 'View', hl: false },
  ];
  return (
    <Panel title="Vendor settlement" sub="auto-release on">
      <div>
        {rows.map(r => (
          <Row key={r.id}>
            <span style={{ fontFamily: mono, fontSize: 12, color: 'var(--accent)', fontWeight: 600, width: 76, flexShrink: 0 }}>{r.id}</span>
            <span style={{ fontSize: 12.5, color: 'var(--text-primary)', flex: 1, minWidth: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.vendor}</span>
            <span style={{ fontFamily: mono, fontSize: 12, color: 'var(--text-primary)', flexShrink: 0, display: 'none' }} className="inv-amt">{r.amt}</span>
            <span className={`badge ${r.badge}`} style={{ fontSize: 9.5, flexShrink: 0 }}>{r.status}</span>
            <MiniBtn tone={r.action === 'View' ? 'neutral' : 'accent'}>{r.action}</MiniBtn>
          </Row>
        ))}
      </div>
    </Panel>
  );
}

function AnalyticsMock() {
  const pts = [22, 30, 26, 38, 34, 48, 44, 58, 64, 72];
  const w = 280, h = 90;
  const path = pts.map((p, i) => `${(i / (pts.length - 1)) * w},${h - (p / 80) * h}`).join(' ');
  const routes = [
    { r: 'Surabaya → Jakarta', v: 45, o: 89 },
    { r: 'Bandung → Makassar', v: 23, o: 91 },
    { r: 'Medan → Semarang', v: 18, o: 83 },
  ];
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: 14 }}>
        {[['Records saved', '55.100', '+18%'], ['On-time', '90.4%', '+2.1'], ['Avg. score', '93', '+4'], ['Total paid', 'Rp 8.4M', '+12%']].map(([l, v, d]) => (
          <div key={l} style={{ background: surface1, border: `1px solid ${border}`, borderRadius: 8, padding: '13px 15px' }}>
            <div style={{ fontFamily: mono, fontSize: 9.5, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 7 }}>{l}</div>
            <div style={{ fontFamily: mono, fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>{v}</div>
            <div style={{ fontSize: 10.5, color: 'var(--accent)' }}>↑ {d}</div>
          </div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 12 }}>
        <Panel title="Records saved per month">
          <div style={{ padding: '16px 16px 10px' }}>
            <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={120} preserveAspectRatio="none">
              <defs><linearGradient id="sg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#4CC38A" stopOpacity="0.28" /><stop offset="100%" stopColor="#4CC38A" stopOpacity="0" /></linearGradient></defs>
              <polygon points={`0,${h} ${path} ${w},${h}`} fill="url(#sg)" />
              <polyline points={path} fill="none" stroke="#4CC38A" strokeWidth="2" />
            </svg>
          </div>
        </Panel>
        <Panel title="Busiest routes">
          <div style={{ padding: '6px 0' }}>
            {routes.map(x => (
              <div key={x.r} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 16px', borderBottom: `1px solid ${border}` }}>
                <span style={{ fontSize: 11.5, color: 'var(--text-primary)' }}>{x.r}</span>
                <span style={{ fontFamily: mono, fontSize: 11, color: x.o >= 90 ? 'var(--accent)' : 'var(--amber)' }}>{x.o}%</span>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}

const VALUE_PROPS = [
  { t: 'You operate it', b: 'Add a shipment, run a quality check, raise an invoice — it all really works, right in the demo.' },
  { t: 'Proof anyone can check', b: 'Every record gets a reference your buyer, bank, or auditor can verify — and it can never be quietly changed.' },
  { t: 'Reports & analytics built in', b: 'Download an audit-ready report in one click, and watch the trends across deliveries, quality, and payments.' },
];

export default function DashboardShowcase() {
  const [tab, setTab] = useState<TabId>('overview');
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} style={{ padding: '96px 0', background: 'var(--surface-1)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
      <div className="veritas-container">
        <div style={{ textAlign: 'center', maxWidth: 660, margin: '0 auto 44px' }}>
          <span className="section-label" style={{ marginBottom: 14, display: 'inline-block' }}>The actual product</span>
          <h2 className="font-display" style={{ fontSize: 'clamp(30px,3.6vw,44px)', fontWeight: 800, lineHeight: 1.12, color: 'var(--text-primary)', marginBottom: 16 }}>
            Your whole factory, on one screen you can operate
          </h2>
          <p style={{ fontSize: 17.5, lineHeight: 1.7, color: 'var(--text-secondary)' }}>
            Not a slide — the real dashboard. Flip through it here, then open the live demo and try it yourself.
          </p>
        </div>

        {/* App window */}
        <motion.div
          initial={{ opacity: 0, y: 26 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, ease: 'easeOut' as const }}
          className="theme-dark showcase-frame"
          style={{ background: '#0C0E0D', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, overflow: 'hidden', boxShadow: 'var(--shadow-lg)', maxWidth: 1000, margin: '0 auto' }}
        >
          {/* window bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', background: '#131610' }}>
            <span style={{ display: 'flex', gap: 6 }}>
              {['#B84B44', '#C9853A', '#4CC38A'].map(c => <span key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c, opacity: 0.7 }} />)}
            </span>
            <span style={{ fontFamily: mono, fontSize: 11, color: '#6B6E68', background: '#0C0E0D', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 6, padding: '4px 12px', margin: '0 auto' }}>veritas.app/dashboard</span>
            <span style={{ fontFamily: mono, fontSize: 10, color: '#4CC38A', display: 'flex', alignItems: 'center', gap: 5 }}><span className="animate-blink" style={{ width: 6, height: 6, borderRadius: '50%', background: '#4CC38A' }} />live</span>
          </div>
          {/* tabs */}
          <div className="tab-strip" style={{ display: 'flex', gap: 4, padding: '10px 12px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            {TABS.map(t => {
              const on = tab === t.id;
              return (
                <button key={t.id} onClick={() => setTab(t.id)}
                  style={{ fontSize: 12.5, padding: '6px 13px', borderRadius: 6, border: 'none', cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'var(--font-dm-sans), sans-serif', background: on ? 'rgba(76,195,138,0.14)' : 'transparent', color: on ? '#4CC38A' : '#6B6E68', transition: 'all 150ms' }}>
                  {t.label}
                </button>
              );
            })}
          </div>
          {/* content */}
          <div style={{ padding: 18, minHeight: 360 }}>
            <AnimatePresence mode="wait">
              <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.22 }}>
                {tab === 'overview' && <OverviewMock />}
                {tab === 'supply' && <SupplyMock />}
                {tab === 'quality' && <QualityMock />}
                {tab === 'invoices' && <InvoicesMock />}
                {tab === 'analytics' && <AnalyticsMock />}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* value props + CTA */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24, maxWidth: 1000, margin: '44px auto 0' }}>
          {VALUE_PROPS.map(v => (
            <div key={v.t}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 8 }}>
                <span style={{ width: 20, height: 20, borderRadius: '50%', background: 'var(--accent-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2.5 6 L5 8.5 L9.5 3.5" stroke="#15A877" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </span>
                <span style={{ fontSize: 15.5, fontWeight: 700, color: 'var(--text-primary)' }}>{v.t}</span>
              </div>
              <p style={{ fontSize: 14.5, lineHeight: 1.65, color: 'var(--text-secondary)', paddingLeft: 29 }}>{v.b}</p>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <Link href="/dashboard" className="btn-primary" style={{ fontSize: 15.5 }}>Open the live demo →</Link>
          <div style={{ fontSize: 13.5, color: 'var(--text-secondary)', marginTop: 12 }}>No sign-up. Add a shipment, run a quality check, watch a payment release itself.</div>
        </div>
      </div>
    </section>
  );
}
