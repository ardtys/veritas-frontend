'use client';

import { useState } from 'react';

const field: React.CSSProperties = {
  width: '100%', background: '#fff', border: '1.5px solid var(--border)', borderRadius: 10,
  padding: '12px 14px', fontSize: 15, color: 'var(--text-primary)',
  fontFamily: 'var(--font-dm-sans), sans-serif', outline: 'none', transition: 'border-color 160ms ease',
};
const label: React.CSSProperties = { display: 'block', fontSize: 13.5, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 7 };

function focus(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) { e.currentTarget.style.borderColor = 'var(--accent)'; }
function blur(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) { e.currentTarget.style.borderColor = 'var(--border)'; }

export default function ContactForm() {
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className="card" style={{ padding: '44px 32px', textAlign: 'center' }}>
        <div style={{ width: 52, height: 52, borderRadius: 14, background: 'var(--accent-soft)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
          <svg width="26" height="26" viewBox="0 0 26 26" fill="none"><path d="M6 13 L11 18 L20 8" stroke="#15A877" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
        <h3 className="font-display" style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 10 }}>Thanks, message received.</h3>
        <p style={{ fontSize: 16, color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: 340, margin: '0 auto' }}>
          We&rsquo;ll get back to you shortly to talk about what your factory needs.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="card" style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div><label style={label}>Your name</label><input required style={field} placeholder="Budi Santoso" onFocus={focus} onBlur={blur} /></div>
        <div><label style={label}>Company</label><input required style={field} placeholder="PT Baja Nusantara" onFocus={focus} onBlur={blur} /></div>
      </div>
      <div><label style={label}>Work email</label><input required type="email" style={field} placeholder="budi@pabrik.co.id" onFocus={focus} onBlur={blur} /></div>
      <div><label style={label}>What are you trying to solve?</label><textarea required rows={5} style={{ ...field, resize: 'vertical' }} placeholder="We lose two weeks every month arguing about quality with our buyers..." onFocus={focus} onBlur={blur} /></div>
      <button type="submit" className="btn-primary" style={{ justifyContent: 'center', padding: '14px', fontSize: 15.5 }}>Send message</button>
      <p style={{ fontSize: 13, color: 'var(--text-secondary)', textAlign: 'center' }}>No commitment, just a conversation.</p>
    </form>
  );
}
