'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const STEPS = [
  {
    no: '1',
    title: 'Connect what you already use',
    body: 'We link Veritas to your current systems, your stock software, your quality station, your accounting. Nothing on the factory floor changes, and your team keeps working the same way.',
  },
  {
    no: '2',
    title: 'Everything gets recorded for you',
    body: 'In the background, every shipment, every quality check, and every invoice is logged automatically. No extra forms to fill in, no double entry, no one chasing updates.',
  },
  {
    no: '3',
    title: 'Anyone can check it, instantly',
    body: 'When a buyer or bank asks “where is it?”, “did it pass?”, or “was it paid?”, the answer is already there, on their screen, in seconds, and impossible to fake.',
  },
];

export default function HowItWorks() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="how" ref={ref} style={{ padding: '96px 0', background: 'var(--surface-1)' }}>
      <div className="veritas-container">
        <div style={{ textAlign: 'center', maxWidth: 620, margin: '0 auto 56px' }}>
          <motion.span initial={{ opacity: 0, y: 8 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }} className="section-label" style={{ marginBottom: 14 }}>
            How it works
          </motion.span>
          <motion.h2 initial={{ opacity: 0, y: 14 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.05 }}
            className="font-display" style={{ fontSize: 'clamp(30px,3.6vw,44px)', fontWeight: 800, lineHeight: 1.12, color: 'var(--text-primary)', marginBottom: 16 }}>
            Up and running in three simple steps
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 12 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.1 }}
            style={{ fontSize: 17.5, lineHeight: 1.7, color: 'var(--text-secondary)' }}>
            You run the factory. Veritas quietly handles the tracking and the record-keeping.
          </motion.p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
          {STEPS.map((s, i) => (
            <motion.div key={s.no}
              initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, ease: 'easeOut' as const, delay: 0.1 + i * 0.1 }}
              className="card" style={{ padding: '32px 28px' }}
            >
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--accent)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 800, marginBottom: 20 }}>
                {s.no}
              </div>
              <h3 className="font-display" style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.25, marginBottom: 12 }}>{s.title}</h3>
              <p style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--text-secondary)' }}>{s.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
