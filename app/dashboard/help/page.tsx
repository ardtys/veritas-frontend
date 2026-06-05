'use client';

import { useState } from 'react';

const card: React.CSSProperties = { background: 'var(--surface-1)', border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' };

const GUIDES = [
  { title: 'Getting started', desc: 'Connect your first data source and see your first sealed record.', read: '4 min' },
  { title: 'Reading a quality score', desc: 'What the 0–100 score means and how the threshold works.', read: '3 min' },
  { title: 'Sharing proof with a buyer', desc: 'Send a tracking link or certificate anyone can verify.', read: '2 min' },
  { title: 'Setting up automatic payments', desc: 'Define the conditions that release a vendor payment.', read: '6 min' },
];

const FAQ = [
  { q: 'What does it mean when a record is "sealed"?', a: 'It means the record has been written permanently and can no longer be changed, by you, your buyer, or anyone else. That permanence is what makes it trustworthy. Think of it like a stamped, witnessed document that can never be quietly edited.' },
  { q: 'Do I need to change how my factory works?', a: 'No. Veritas connects to the systems you already use, your ERP, your QC station, your accounting software. Your team keeps working the same way. The tracking and record-keeping happen in the background.' },
  { q: 'How does the quality score work?', a: 'A camera-and-software system inspects each batch and scores it from 0 to 100 against your agreed standard. Above 90 is a clear pass, 70–89 is marginal, and below 70 fails. The same rules apply on every shift, so the score does not depend on who is checking.' },
  { q: 'When exactly does a vendor get paid?', a: 'The moment two things are confirmed: the quality matches what was agreed, and the delivery is recorded. Payment then releases automatically, usually in under three seconds, with no manual approval step.' },
  { q: 'Can a buyer check the records themselves?', a: 'Yes. You can send a buyer or bank a link. They see the same shipment history, quality certificate, or payment record you do, and they can confirm it is genuine without having to trust your word for it.' },
  { q: 'Is my factory data private?', a: 'Your commercial data stays private. What gets sealed is a verifiable proof, enough for a buyer to confirm a record is real, without exposing your full operations.' },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: '1px solid var(--border)' }}>
      <button onClick={() => setOpen(!open)} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: '18px 24px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
        <span style={{ fontSize: 14.5, fontWeight: 500, color: 'var(--text-primary)' }}>{q}</span>
        <span style={{ color: 'var(--accent)', fontSize: 18, flexShrink: 0, transform: open ? 'rotate(45deg)' : 'none', transition: 'transform 200ms' }}>+</span>
      </button>
      {open && (
        <div style={{ padding: '0 24px 20px', fontSize: 14, lineHeight: 1.75, color: 'var(--text-secondary)', maxWidth: 720 }}>{a}</div>
      )}
    </div>
  );
}

export default function HelpPage() {
  return (
    <div style={{ padding: '28px 32px', maxWidth: 960 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 className="font-display" style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>Help &amp; docs</h1>
        <span style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>Answers in plain language, no jargon required</span>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: 24 }}>
        <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" /><line x1="11" y1="11" x2="14" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
        </span>
        <input placeholder="Search for help, e.g. how do payments work?"
          style={{ width: '100%', background: 'var(--surface-1)', border: '1px solid var(--border)', borderRadius: 8, padding: '14px 16px 14px 44px', fontSize: 14, color: 'var(--text-primary)', fontFamily: 'var(--font-dm-sans), sans-serif', outline: 'none' }}
          onFocus={e => (e.currentTarget.style.borderColor = 'rgba(76,195,138,0.4)')}
          onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')} />
      </div>

      {/* Guides */}
      <div style={{ marginBottom: 24 }}>
        <div className="font-mono-custom" style={{ fontSize: 10.5, color: 'var(--text-secondary)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>Quick guides</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 12 }}>
          {GUIDES.map(g => (
            <div key={g.title} style={{ ...card, padding: '20px 22px', cursor: 'pointer', transition: 'border-color 200ms' }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border-strong)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)'; }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>{g.title}</span>
                <span className="font-mono-custom" style={{ fontSize: 11, color: 'var(--text-secondary)', flexShrink: 0 }}>{g.read}</span>
              </div>
              <p style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--text-secondary)' }}>{g.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div style={{ marginBottom: 24 }}>
        <div className="font-mono-custom" style={{ fontSize: 10.5, color: 'var(--text-secondary)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>Common questions</div>
        <div style={card}>
          {FAQ.map(f => <FaqItem key={f.q} {...f} />)}
        </div>
      </div>

      {/* Support */}
      <div style={{ ...card, padding: '24px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div className="font-display" style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>Still stuck?</div>
          <div style={{ fontSize: 13.5, color: 'var(--text-secondary)' }}>Talk to a real person. We usually reply within a few hours.</div>
        </div>
        <a href="mailto:ardtys06@gmail.com" className="btn-primary" style={{ fontSize: 13 }}>Contact support →</a>
      </div>
    </div>
  );
}
