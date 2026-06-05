'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const AUDIENCES = [
  {
    who: 'Factory owners',
    body: 'Stop losing weeks to quality arguments and payment chasing. Every answer a buyer needs is already there.',
    metric: '2 weeks',
    metricLabel: 'saved every month',
  },
  {
    who: 'Buyers & banks',
    body: 'Check quality, delivery, and history yourself, without having to trust anyone’s word. Buy and lend with confidence.',
    metric: '100%',
    metricLabel: 'of records you can verify',
  },
  {
    who: 'Vendors & suppliers',
    body: 'Know exactly when the money arrives. Stop adding a “just in case” margin and quote your real, fair price.',
    metric: 'Seconds',
    metricLabel: 'from approval to payment',
  },
];

export default function Audiences() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} style={{ padding: '96px 0', background: '#fff' }}>
      <div className="veritas-container">
        <div style={{ maxWidth: 620, marginBottom: 52 }}>
          <motion.span initial={{ opacity: 0, y: 8 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }} className="section-label" style={{ marginBottom: 14 }}>
            Who it&rsquo;s for
          </motion.span>
          <motion.h2 initial={{ opacity: 0, y: 14 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.05 }}
            className="font-display" style={{ fontSize: 'clamp(30px,3.6vw,44px)', fontWeight: 800, lineHeight: 1.12, color: 'var(--text-primary)' }}>
            One shared record everyone can agree on
          </motion.h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
          {AUDIENCES.map((a, i) => (
            <motion.div key={a.who}
              initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, ease: 'easeOut' as const, delay: 0.08 + i * 0.1 }}
              className="card" style={{ padding: '30px 28px' }}
            >
              <h3 className="font-display" style={{ fontSize: 21, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12 }}>{a.who}</h3>
              <p style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--text-secondary)', marginBottom: 24 }}>{a.body}</p>
              <div style={{ paddingTop: 20, borderTop: '1px solid var(--border)' }}>
                <div className="font-display" style={{ fontSize: 30, fontWeight: 800, color: 'var(--accent-dark)', lineHeight: 1, marginBottom: 5 }}>{a.metric}</div>
                <div style={{ fontSize: 13.5, color: 'var(--text-secondary)' }}>{a.metricLabel}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
