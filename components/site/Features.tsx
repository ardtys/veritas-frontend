'use client';

import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const FEATURES = [
  {
    icon: 'truck',
    name: 'Shipment tracking',
    headline: 'Always know where your goods are.',
    body: 'Every time your goods change hands, it’s logged automatically, who passed them on, who received them, and when. Send your buyer a link and they can follow along too.',
    points: ['Real-time location', 'Full delivery history', 'No more “let me call the driver”'],
  },
  {
    icon: 'check',
    name: 'Quality checks',
    headline: 'Prove your quality to any buyer.',
    body: 'Each batch gets a quality score out of 100, judged the same way on every shift. When a batch passes, you get a certificate your buyer can open and verify themselves.',
    points: ['Same standard every time', 'Catches problems early', 'A certificate buyers trust'],
  },
  {
    icon: 'money',
    name: 'Automatic payments',
    headline: 'Pay vendors the moment they earn it.',
    body: 'When the quality matches and the delivery is confirmed, payment goes out on its own, in seconds. No approval chains, and vendors stop pricing in the risk of getting paid late.',
    points: ['Pays out in seconds', 'No manual approvals', 'Predictable cash flow'],
  },
];

function Icon({ name }: { name: string }) {
  const c = '#15A877';
  if (name === 'truck') return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
      <rect x="2" y="6.5" width="13" height="11" rx="1.6" stroke={c} strokeWidth="1.6" />
      <path d="M15 9.5 L19.5 9.5 L23 13 L23 17.5 L15 17.5 Z" stroke={c} strokeWidth="1.6" strokeLinejoin="round" />
      <circle cx="7" cy="19.5" r="2.1" stroke={c} strokeWidth="1.6" /><circle cx="18.5" cy="19.5" r="2.1" stroke={c} strokeWidth="1.6" />
    </svg>
  );
  if (name === 'check') return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none"><circle cx="13" cy="13" r="10" stroke={c} strokeWidth="1.6" /><path d="M8.5 13 L11.5 16 L17.5 9.5" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
  );
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none"><rect x="2.5" y="6.5" width="21" height="13" rx="2.4" stroke={c} strokeWidth="1.6" /><circle cx="13" cy="13" r="3.2" stroke={c} strokeWidth="1.6" /></svg>
  );
}

export default function Features() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="features" ref={ref} style={{ padding: '96px 0', background: '#fff' }}>
      <div className="veritas-container">
        <div style={{ textAlign: 'center', marginBottom: 56, maxWidth: 640, margin: '0 auto 56px' }}>
          <motion.span initial={{ opacity: 0, y: 8 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }} className="section-label" style={{ display: 'inline-block', marginBottom: 14 }}>
            Three jobs, one tool
          </motion.span>
          <motion.h2 initial={{ opacity: 0, y: 14 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.05 }}
            className="font-display" style={{ fontSize: 'clamp(30px,3.6vw,44px)', fontWeight: 800, lineHeight: 1.12, color: 'var(--text-primary)', marginBottom: 16 }}>
            Everything your factory needs to be trusted
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 12 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.1 }}
            style={{ fontSize: 17.5, lineHeight: 1.7, color: 'var(--text-secondary)' }}>
            Veritas does three things really well, and they work together so nothing falls through the cracks.
          </motion.p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
          {FEATURES.map((f, i) => (
            <motion.div key={f.name}
              className="card card-hover"
              initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, ease: 'easeOut' as const, delay: 0.1 + i * 0.1 }}
              style={{ padding: '32px 28px', display: 'flex', flexDirection: 'column' }}
            >
              <div style={{ width: 56, height: 56, borderRadius: 14, background: 'var(--accent-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 22 }}>
                <Icon name={f.icon} />
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent-dark)', marginBottom: 8 }}>{f.name}</div>
              <h3 className="font-display" style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.25, marginBottom: 12 }}>{f.headline}</h3>
              <p style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--text-secondary)', marginBottom: 20 }}>{f.body}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 'auto' }}>
                {f.points.map(p => (
                  <div key={p} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ width: 18, height: 18, borderRadius: '50%', background: 'var(--accent-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <svg width="11" height="11" viewBox="0 0 12 12" fill="none"><path d="M2.5 6 L5 8.5 L9.5 3.5" stroke="#15A877" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </span>
                    <span style={{ fontSize: 14, color: 'var(--text-primary)' }}>{p}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <Link href="/product" className="edlink" style={{ fontSize: 15.5 }}>See each one in detail →</Link>
        </div>
      </div>
    </section>
  );
}
