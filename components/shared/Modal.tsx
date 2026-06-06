'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateBlockchainRecord } from '@/lib/mockData';
import { formatTimestamp } from '@/lib/utils';

export interface DetailRow { label: string; value: React.ReactNode; mono?: boolean; full?: boolean; }
export interface TimelineStep { label: string; time?: string; note?: string; state: 'done' | 'current' | 'todo'; }
export type ModalTone = 'ok' | 'warn' | 'bad';

interface ModalProps {
  id: string;
  eventType: string;
  label: string;
  onClose: () => void;
  /* Optional rich, record-specific content */
  subtitle?: string;
  tone?: ModalTone;
  statusText?: string;
  hero?: { value: React.ReactNode; caption?: string; color?: string };
  details?: DetailRow[];
  timeline?: TimelineStep[];
}

/* Plain-language explanation per record type */
const EXPLANATION: Record<string, { title: string; body: string }> = {
  SHIPMENT_SEALED:   { title: 'Delivery record',  body: 'This shipment\'s journey is permanently recorded. The handoff details below cannot be edited or deleted by anyone, not us, not the buyer, not the supplier.' },
  QC_CERTIFICATE:    { title: 'Quality certificate', body: 'This batch passed quality control. The certificate below is permanent proof your buyer can verify independently, no need to take your word for it.' },
  QC_RESULT:         { title: 'Quality result', body: 'The full result of this quality check is recorded below and cannot be altered after the fact.' },
  PAYMENT_RELEASED:  { title: 'Payment record',   body: 'This payment was released automatically once quality and delivery were confirmed. The record below is permanent and can\'t be disputed.' },
  CONTRACT_VERIFIED: { title: 'Verification record', body: 'This invoice was verified against its quality and delivery conditions. The record below is permanent proof of what was checked and when.' },
};

const TONE = {
  ok:   { c: '#4CC38A', bg: 'rgba(76,195,138,0.08)', bd: 'rgba(76,195,138,0.2)', text: 'Confirmed & permanent' },
  warn: { c: '#C9853A', bg: 'rgba(201,133,58,0.08)', bd: 'rgba(201,133,58,0.22)', text: 'Recorded · awaiting action' },
  bad:  { c: '#B84B44', bg: 'rgba(184,75,68,0.08)', bd: 'rgba(184,75,68,0.22)', text: 'Recorded · did not pass' },
};

export default function Modal({ id, eventType, label, onClose, subtitle, tone = 'ok', statusText, hero, details, timeline }: ModalProps) {
  const record = generateBlockchainRecord(id, eventType);
  const explain = EXPLANATION[eventType] ?? { title: 'Verification record', body: 'This record is permanent and can be verified by anyone with the link.' };
  const t = TONE[tone];
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  function copyHash() {
    navigator.clipboard?.writeText(record.hash).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    }).catch(() => {});
  }

  return (
    <AnimatePresence>
      <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.25, ease: 'easeOut' as const }}
          onClick={(e) => e.stopPropagation()}
          className="modal-card"
          style={{ background: 'var(--surface-1)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: 0, maxWidth: 580, width: '100%', margin: '0 16px', maxHeight: '90vh', overflow: 'auto' }}
        >
          {/* Header */}
          <div style={{ padding: '24px 28px 20px', borderBottom: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: t.bg, border: `1px solid ${t.bd}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                    <path d="M11 2 L19 6 L19 11 C19 16 15 19.5 11 20.5 C7 19.5 3 16 3 11 L3 6 Z" fill={`${t.c}33`} stroke={t.c} strokeWidth="1.3" strokeLinejoin="round" />
                    <path d="M7.5 11 L10 13.5 L14.5 8.5" stroke={t.c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  </svg>
                </div>
                <div>
                  <div className="font-display" style={{ fontSize: 19, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2 }}>{explain.title}</div>
                  <div className="font-mono-custom" style={{ fontSize: 12, color: t.c, marginTop: 2 }}>{label}{subtitle ? ` · ${subtitle}` : ''}</div>
                </div>
              </div>
              <button onClick={onClose} aria-label="Close" style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: 22, lineHeight: 1, padding: 4 }}>×</button>
            </div>
            <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.65 }}>{explain.body}</p>
          </div>

          {/* Body */}
          <div style={{ padding: '20px 28px 24px' }}>

            {/* Status banner */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: t.bg, border: `1px solid ${t.bd}`, borderRadius: 8, padding: '12px 16px', marginBottom: 20 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: t.c, flexShrink: 0 }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: t.c }}>{statusText ?? t.text}</span>
              <span className="font-mono-custom" style={{ fontSize: 11.5, color: 'var(--text-secondary)', marginLeft: 'auto' }}>{formatTimestamp(record.timestamp)}</span>
            </div>

            {/* Hero value (score / amount) */}
            {hero && (
              <div style={{ textAlign: 'center', padding: '4px 0 20px', marginBottom: 4, borderBottom: '1px solid var(--border)' }}>
                <div className="font-mono-custom modal-hero" style={{ fontSize: 46, fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1, color: hero.color ?? t.c }}>{hero.value}</div>
                {hero.caption && <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 8 }}>{hero.caption}</div>}
              </div>
            )}

            {/* Record-specific details */}
            {details && details.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, margin: '18px 0' }}>
                {details.map((d, i) => (
                  <div key={i} style={d.full ? { gridColumn: '1 / -1' } : undefined}>
                    <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 4 }}>{d.label}</div>
                    <div className={d.mono ? 'font-mono-custom' : undefined} style={{ fontSize: 13.5, color: 'var(--text-primary)', lineHeight: 1.5 }}>{d.value}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Chain of custody / workflow timeline */}
            {timeline && timeline.length > 0 && (
              <div style={{ margin: '20px 0' }}>
                <div className="font-mono-custom" style={{ fontSize: 11, color: 'var(--text-secondary)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 12 }}>Chain of custody</div>
                {timeline.map((s, i) => {
                  const col = s.state === 'done' ? '#4CC38A' : s.state === 'current' ? '#C9853A' : 'var(--text-secondary)';
                  const last = i === timeline.length - 1;
                  return (
                    <div key={i} style={{ display: 'flex', gap: 12 }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ width: 12, height: 12, borderRadius: '50%', background: s.state === 'todo' ? 'transparent' : col, border: `2px solid ${col}`, flexShrink: 0, marginTop: 2 }} />
                        {!last && <div style={{ width: 2, flex: 1, minHeight: 22, background: s.state === 'done' ? 'rgba(76,195,138,0.35)' : 'var(--border)' }} />}
                      </div>
                      <div style={{ paddingBottom: last ? 0 : 14 }}>
                        <div style={{ fontSize: 13, fontWeight: 500, color: s.state === 'todo' ? 'var(--text-secondary)' : 'var(--text-primary)' }}>{s.label}</div>
                        {s.note && <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 1 }}>{s.note}</div>}
                        {s.time && <div className="font-mono-custom" style={{ fontSize: 10.5, color: 'var(--text-secondary)', marginTop: 2 }}>{s.time}</div>}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Technical / verification details */}
            <div className="font-mono-custom" style={{ fontSize: 11, color: 'var(--text-secondary)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 10 }}>
              Verification details
            </div>

            <div style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Permanent reference ID</span>
                <button onClick={copyHash} style={{ background: 'none', border: 'none', color: copied ? 'var(--accent)' : 'var(--text-secondary)', cursor: 'pointer', fontSize: 11, fontFamily: 'var(--font-jetbrains)', padding: 0 }}>
                  {copied ? '✓ copied' : 'copy'}
                </button>
              </div>
              <div className="font-mono-custom" style={{ fontSize: 11.5, color: 'var(--accent)', wordBreak: 'break-all', lineHeight: 1.5, background: 'rgba(76,195,138,0.05)', border: '1px solid rgba(76,195,138,0.12)', borderRadius: 6, padding: '9px 12px' }}>
                {record.hash}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginBottom: 18 }}>
              <div>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 4 }}>Record number</div>
                <div className="font-mono-custom" style={{ fontSize: 13, color: 'var(--text-primary)' }}>#{record.blockNumber.toLocaleString()}</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 4 }}>Confirmations</div>
                <div className="font-mono-custom" style={{ fontSize: 13, color: 'var(--accent)' }}>{32 + (record.blockNumber % 30)}</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 4 }}>Network</div>
                <div className="font-mono-custom" style={{ fontSize: 13, color: 'var(--text-primary)' }}>Solana</div>
              </div>
            </div>

            <details>
              <summary style={{ fontSize: 12, color: 'var(--text-secondary)', cursor: 'pointer', userSelect: 'none', marginBottom: 8 }}>
                Show raw data
              </summary>
              <pre className="font-mono-custom" style={{ fontSize: 11.5, color: 'var(--text-primary)', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 6, padding: '12px 14px', overflow: 'auto', lineHeight: 1.7, marginTop: 4 }}>
                {JSON.stringify(record.data, null, 2)}
              </pre>
            </details>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
