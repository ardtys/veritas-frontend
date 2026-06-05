'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateBlockchainRecord } from '@/lib/mockData';
import { formatTimestamp } from '@/lib/utils';

interface ModalProps {
  id: string;
  eventType: string;
  label: string;
  onClose: () => void;
}

/* Plain-language explanation per record type */
const EXPLANATION: Record<string, { title: string; body: string }> = {
  SHIPMENT_SEALED:   { title: 'Delivery record',  body: 'This shipment\'s journey is permanently recorded. The handoff details below cannot be edited or deleted by anyone, not us, not the buyer, not the supplier.' },
  QC_CERTIFICATE:    { title: 'Quality certificate', body: 'This batch passed quality control. The certificate below is permanent proof your buyer can verify independently, no need to take your word for it.' },
  PAYMENT_RELEASED:  { title: 'Payment record',   body: 'This payment was released automatically once quality and delivery were confirmed. The record below is permanent and can\'t be disputed.' },
  CONTRACT_VERIFIED: { title: 'Verification record', body: 'This invoice was verified against its quality and delivery conditions. The record below is permanent proof of what was checked and when.' },
};

export default function Modal({ id, eventType, label, onClose }: ModalProps) {
  const record = generateBlockchainRecord(id, eventType);
  const explain = EXPLANATION[eventType] ?? { title: 'Verification record', body: 'This record is permanent and can be verified by anyone with the link.' };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        className="modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.25, ease: 'easeOut' as const }}
          onClick={(e) => e.stopPropagation()}
          style={{
            background: 'var(--surface-1)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 10,
            padding: 0,
            maxWidth: 560,
            width: '100%',
            margin: '0 16px',
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div style={{ padding: '24px 28px 20px', borderBottom: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {/* Verified seal icon */}
                <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(76,195,138,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                    <path d="M11 2 L19 6 L19 11 C19 16 15 19.5 11 20.5 C7 19.5 3 16 3 11 L3 6 Z" fill="rgba(76,195,138,0.2)" stroke="#4CC38A" strokeWidth="1.3" strokeLinejoin="round" />
                    <path d="M7.5 11 L10 13.5 L14.5 8.5" stroke="#4CC38A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  </svg>
                </div>
                <div>
                  <div className="font-display" style={{ fontSize: 19, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2 }}>{explain.title}</div>
                  <div className="font-mono-custom" style={{ fontSize: 12, color: 'var(--accent)', marginTop: 2 }}>{label}</div>
                </div>
              </div>
              <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: 22, lineHeight: 1, padding: 4 }}>×</button>
            </div>

            {/* Plain-language explanation */}
            <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.65 }}>
              {explain.body}
            </p>
          </div>

          {/* Body */}
          <div style={{ padding: '20px 28px 24px' }}>

            {/* Status banner */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(76,195,138,0.08)', border: '1px solid rgba(76,195,138,0.2)', borderRadius: 8, padding: '12px 16px', marginBottom: 20 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)', flexShrink: 0 }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent)' }}>Confirmed &amp; permanent</span>
              <span className="font-mono-custom" style={{ fontSize: 11.5, color: 'var(--text-secondary)', marginLeft: 'auto' }}>{formatTimestamp(record.timestamp)}</span>
            </div>

            {/* Technical details, collapsible feel */}
            <div className="font-mono-custom" style={{ fontSize: 11, color: 'var(--text-secondary)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 10 }}>
              Technical details
            </div>

            {/* Reference ID */}
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 4 }}>Permanent reference ID</div>
              <div className="font-mono-custom" style={{ fontSize: 11.5, color: 'var(--accent)', wordBreak: 'break-all', lineHeight: 1.5, background: 'rgba(76,195,138,0.05)', border: '1px solid rgba(76,195,138,0.12)', borderRadius: 6, padding: '9px 12px' }}>
                {record.hash}
              </div>
            </div>

            {/* Meta grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 18 }}>
              <div>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 4 }}>Record number</div>
                <div className="font-mono-custom" style={{ fontSize: 13, color: 'var(--text-primary)' }}>#{record.blockNumber.toLocaleString()}</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 4 }}>Network</div>
                <div className="font-mono-custom" style={{ fontSize: 13, color: 'var(--text-primary)' }}>Solana Mainnet</div>
              </div>
            </div>

            {/* Raw data */}
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
