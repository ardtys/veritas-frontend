'use client';

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

export default function ActivityFeed({ events }: { events: ActivityEvent[] }) {
  return (
    <div>
      <AnimatePresence initial={false}>
        {events.map((event, idx) => {
          const cfg = EVENT_CONFIG[event.type];
          return (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.28, ease: 'easeOut' as const }}
              style={{ overflow: 'hidden' }}
            >
              <div style={{
                display: 'flex', alignItems: 'flex-start', gap: 14,
                padding: '11px 0',
                borderBottom: '1px solid var(--border)',
              }}>
                {/* Timeline dot */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 3, flexShrink: 0 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: cfg.dot, flexShrink: 0 }} />
                  {idx < events.length - 1 && (
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
    </div>
  );
}
