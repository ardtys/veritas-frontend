'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

/* A clean, friendly preview card, not a terminal */
function PreviewCard() {
  const rows = [
    { icon: 'truck', title: 'Your shipment', status: 'On the way to Jakarta', state: 'Arriving 2:30 PM', tone: 'amber' },
    { icon: 'check', title: 'Quality check', status: 'Passed, scored 97 / 100', state: 'Certificate ready', tone: 'green' },
    { icon: 'money', title: 'Vendor payment', status: 'Sent automatically', state: 'Rp 187,5 million', tone: 'green' },
  ];
  return (
    <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 20, boxShadow: 'var(--shadow-lg)', padding: 22, width: '100%', maxWidth: 420 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>Today at your factory</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--accent-dark)', fontWeight: 600 }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--accent)' }} className="animate-blink" />
          Live
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {rows.map(r => (
          <div key={r.title} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', background: 'var(--surface-1)', borderRadius: 13 }}>
            <span style={{ width: 38, height: 38, borderRadius: 10, background: '#fff', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <FeatureIcon name={r.icon} />
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text-primary)' }}>{r.title}</div>
              <div style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>{r.status}</div>
            </div>
            <span className={r.tone === 'green' ? 'badge badge-green' : 'badge badge-amber'} style={{ flexShrink: 0 }}>{r.state}</span>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-secondary)', fontSize: 12.5 }}>
        <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M8 1.5 L13.5 4 L13.5 8 C13.5 11 11 13.2 8 14 C5 13.2 2.5 11 2.5 8 L2.5 4 Z" stroke="#15A877" strokeWidth="1.3" strokeLinejoin="round"/><path d="M5.6 8 L7.2 9.6 L10.4 6" stroke="#15A877" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
        Every record here is permanent and can be checked by your buyer.
      </div>
    </div>
  );
}

export function FeatureIcon({ name }: { name: string }) {
  const c = '#15A877';
  if (name === 'truck') return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <rect x="1.5" y="5" width="10" height="8" rx="1.3" stroke={c} strokeWidth="1.4" />
      <path d="M11.5 7.5 L15 7.5 L17.5 10 L17.5 13 L11.5 13 Z" stroke={c} strokeWidth="1.4" strokeLinejoin="round" />
      <circle cx="5.5" cy="14.5" r="1.6" stroke={c} strokeWidth="1.4" /><circle cx="14" cy="14.5" r="1.6" stroke={c} strokeWidth="1.4" />
    </svg>
  );
  if (name === 'check') return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="7.5" stroke={c} strokeWidth="1.4" /><path d="M6.5 10 L9 12.5 L13.5 7.5" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
  );
  if (name === 'money') return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><rect x="2" y="5" width="16" height="10" rx="2" stroke={c} strokeWidth="1.4" /><circle cx="10" cy="10" r="2.4" stroke={c} strokeWidth="1.4" /></svg>
  );
  return null;
}

export default function HomeHero() {
  return (
    <section style={{ paddingTop: 132, paddingBottom: 80, background: 'linear-gradient(180deg, var(--surface-1) 0%, #fff 100%)' }}>
      <div className="veritas-container">
        <div style={{ display: 'grid', gridTemplateColumns: '1.05fr 0.95fr', gap: 56, alignItems: 'center' }}>

          {/* Left, copy */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--accent-soft)', borderRadius: 999, padding: '6px 14px', marginBottom: 24 }}
            >
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--accent)' }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent-dark)' }}>Built for Indonesian factories</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.05 }}
              className="font-display"
              style={{ fontSize: 'clamp(36px, 4.6vw, 56px)', fontWeight: 800, lineHeight: 1.1, color: 'var(--text-primary)', marginBottom: 22 }}
            >
              Track your goods. Prove your quality.{' '}
              <span style={{ color: 'var(--accent-dark)' }}>Get paid on time.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
              style={{ fontSize: 18.5, lineHeight: 1.7, color: 'var(--text-secondary)', maxWidth: 500, marginBottom: 32 }}
            >
              Veritas is one simple tool that follows every shipment, checks the quality of every
              batch, and makes sure your vendors get paid, automatically. No spreadsheets, no
              phone calls, no chasing.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.16 }}
              style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center', marginBottom: 22 }}
            >
              <Link href="/dashboard" className="btn-primary" style={{ fontSize: 15.5, padding: '14px 28px' }}>See it in action</Link>
              <Link href="/product" className="btn-ghost" style={{ fontSize: 15.5, padding: '13px 26px' }}>How it works</Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.24 }}
              style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: 'var(--text-secondary)' }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6.5 10.5 L4 8 M6.5 10.5 L11.5 5" stroke="#15A877" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Works with the systems you already use, nothing to rip out and replace.
            </motion.div>
          </div>

          {/* Right, preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
            style={{ display: 'flex', justifyContent: 'center' }}
          >
            <PreviewCard />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
