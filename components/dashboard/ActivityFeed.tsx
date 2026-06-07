'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ActivityEvent, EventType } from '@/lib/mockData';
import { formatTimestamp } from '@/lib/utils';

const EVENT_CONFIG: Record<EventType, { label: string; badgeClass: string; dot: string; icon: string }> = {
  SHIPMENT_SEALED:   { label: 'Shipment', badgeClass: 'badge badge-neutral', dot: '#6B6E68', icon: '⬡' },
  QC_PASSED:         { label: 'Passed',   badgeClass: 'badge badge-green',   dot: '#4CC38A', icon: '✓' },
  QC_FAILED:         { label: 'Failed',   badgeClass: 'badge badge-red',     dot: '#B84B44', icon: '✕' },
  INVOICE_TRIGGERED: { label: 'Invoice',  badgeClass: 'badge badge-amber',   dot: '#C9853A', icon: '◎' },
  PAYMENT_RELEASED:  { label: 'Payment',  badgeClass: 'badge badge-green',   dot: '#4CC38A', icon: '⚡' },
};

const FILTERS: { key: string; label: string; types: EventType[] }[] = [
  { key: 'all',      label: 'All',       types: ['SHIPMENT_SEALED', 'QC_PASSED', 'QC_FAILED', 'INVOICE_TRIGGERED', 'PAYMENT_RELEASED'] },
  { key: 'shipment', label: 'Shipments', types: ['SHIPMENT_SEALED'] },
  { key: 'qc',       label: 'Quality',   types: ['QC_PASSED', 'QC_FAILED'] },
  { key: 'invoice',  label: 'Invoices',  types: ['INVOICE_TRIGGERED'] },
  { key: 'payment',  label: 'Payments',  types: ['PAYMENT_RELEASED'] },
];

export default function ActivityFeed({ events, onSelect }: { events: ActivityEvent[]; onSelect?: (e: ActivityEvent) => void }) {
  const [filter, setFilter] = useState('all');
  const [hovered, setHovered] = useState<string | null>(null);
  const active = FILTERS.find(f => f.key === filter) ?? FILTERS[0];
  const shown = filter === 'all' ? events : events.filter(e => active.types.includes(e.type));

  return (
    <div>
      {/* Filter chips */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', padding: '12px 0 6px', position: 'sticky', top: 0, background: 'var(--surface-1)', zIndex: 1 }}>
        {FILTERS.map(f => {
          const count = f.key === 'all' ? events.length : events.filter(e => f.types.includes(e.type)).length;
          const on = filter === f.key;
          return (
            <button key={f.key} onClick={() => setFilter(f.key)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                fontSize: 11.5, padding: '4px 10px', borderRadius: 999, cursor: 'pointer',
                fontFamily: 'var(--font-dm-sans), sans-serif',
                background: on ? 'rgba(76,195,138,0.14)' : 'transparent',
                border: `1px solid ${on ? 'rgba(76,195,138,0.4)' : 'var(--border)'}`,
                color: on ? 'var(--accent)' : 'var(--text-secondary)',
                transition: 'background 150ms, border-color 150ms, color 150ms',
              }}>
              {f.label}
              <span className="font-mono-custom" style={{ fontSize: 10, opacity: 0.8 }}>{count}</span>
            </button>
          );
        })}
      </div>

      <AnimatePresence initial={false}>
        {shown.map((event, idx) => {
          const cfg = EVENT_CONFIG[event.type];
          const clickable = !!onSelect;
          return (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.28, ease: 'easeOut' as const }}
              style={{ overflow: 'hidden' }}
            >
              <div
                onClick={() => onSelect?.(event)}
                onMouseEnter={() => setHovered(event.id)}
                onMouseLeave={() => setHovered(h => (h === event.id ? null : h))}
                style={{
                  display: 'flex', alignItems: 'flex-start', gap: 14,
                  padding: '11px 10px', margin: '0 -10px',
                  borderBottom: '1px solid var(--border)',
                  borderRadius: 6,
                  cursor: clickable ? 'pointer' : 'default',
                  background: clickable && hovered === event.id ? 'rgba(255,255,255,0.03)' : 'transparent',
                  transition: 'background 140ms ease',
                }}
              >
                {/* Timeline dot */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 3, flexShrink: 0 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: cfg.dot, flexShrink: 0 }} />
                  {idx < shown.length - 1 && (
                    <div style={{ width: 1, flex: 1, background: 'var(--border)', marginTop: 4, minHeight: 12 }} />
                  )}
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span className={cfg.badgeClass} style={{ fontSize: 10 }}>{cfg.label}</span>
                    <span className="font-mono-custom" style={{ fontSize: 10.5, color: 'var(--text-secondary)' }}>
                      {formatTimestamp(event.timestamp)}
                    </span>
                    {clickable && (
                      <span style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--accent)', opacity: hovered === event.id ? 1 : 0, transition: 'opacity 140ms ease' }}>↗</span>
                    )}
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.5 }}>
                    {event.description}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {shown.length === 0 && (
        <div style={{ padding: '28px 10px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: 12.5 }}>
          No {active.label.toLowerCase()} events yet.
        </div>
      )}
    </div>
  );
}
