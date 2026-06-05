'use client';

import { useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const ITEMS = [
  { q: 'Do I have to change how my factory works?', a: 'No. Veritas connects to the tools you already use, your stock software, your quality station, your accounting system. Your team keeps working exactly the same way. The tracking happens quietly in the background.' },
  { q: 'What does “the record can’t be faked” mean?', a: 'Once something is recorded, it’s locked permanently. Nobody, not you, not your buyer, not your supplier, can quietly change it later. That permanence is exactly what makes a buyer or bank trust it.' },
  { q: 'How does the quality score work?', a: 'Each batch is checked and scored from 0 to 100 against your agreed standard. Above 90 passes clearly, 70–89 is borderline, below 70 fails. The same rules apply on every shift, so the result doesn’t depend on who is checking.' },
  { q: 'When exactly does a vendor get paid?', a: 'The moment two things are confirmed: the quality matches what was agreed, and the delivery is recorded. Payment then goes out automatically, usually in a few seconds, with no manual approval step.' },
  { q: 'Is my business data private?', a: 'Yes. Your commercial details stay private. What gets shared is a simple proof, just enough for a buyer to confirm a record is genuine, without exposing the rest of your operation.' },
  { q: 'How much does it cost?', a: 'Veritas is a proof of concept right now, and we’re working with our first pilot factories. Get in touch and we’ll talk about what makes sense for you, there’s no commitment.' },
];

function Item({ q, a, defaultOpen }: { q: string; a: string; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(!!defaultOpen);
  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
      <button onClick={() => setOpen(!open)} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: '20px 24px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
        <span style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)' }}>{q}</span>
        <span style={{ width: 26, height: 26, borderRadius: '50%', background: 'var(--accent-soft)', color: 'var(--accent-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0, transform: open ? 'rotate(45deg)' : 'none', transition: 'transform 200ms' }}>+</span>
      </button>
      {open && <div style={{ padding: '0 24px 22px', fontSize: 15, lineHeight: 1.75, color: 'var(--text-secondary)', maxWidth: 720 }}>{a}</div>}
    </div>
  );
}

export default function FAQ() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} style={{ padding: '96px 0', background: 'var(--surface-1)' }}>
      <div className="veritas-container" style={{ maxWidth: 820 }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <motion.span initial={{ opacity: 0, y: 8 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }} className="section-label" style={{ marginBottom: 14 }}>
            Questions
          </motion.span>
          <motion.h2 initial={{ opacity: 0, y: 14 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.05 }}
            className="font-display" style={{ fontSize: 'clamp(28px,3.4vw,42px)', fontWeight: 800, lineHeight: 1.12, color: 'var(--text-primary)' }}>
            Things people usually ask
          </motion.h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {ITEMS.map((it, i) => (
            <motion.div key={it.q} initial={{ opacity: 0, y: 12 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.04 * i }}>
              <Item {...it} defaultOpen={i === 0} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
