'use client';

import { useState } from 'react';
import KPICard from '@/components/dashboard/KPICard';
import ActivityFeed from '@/components/dashboard/ActivityFeed';
import EventsChart from '@/components/dashboard/EventsChart';
import Modal from '@/components/shared/Modal';
import { generateHourlyData, HourlyEvent, EventType, ActivityEvent } from '@/lib/mockData';
import { useDashboard } from '@/lib/store';

/* Map a live activity event to the record-detail modal */
const EVENT_TO_MODAL: Record<EventType, { event: string; tone: 'ok' | 'warn' | 'bad' }> = {
  SHIPMENT_SEALED:   { event: 'SHIPMENT_SEALED',   tone: 'ok' },
  QC_PASSED:         { event: 'QC_CERTIFICATE',    tone: 'ok' },
  QC_FAILED:         { event: 'QC_RESULT',         tone: 'bad' },
  INVOICE_TRIGGERED: { event: 'CONTRACT_VERIFIED', tone: 'warn' },
  PAYMENT_RELEASED:  { event: 'PAYMENT_RELEASED',  tone: 'ok' },
};

/* ─── KPI icons ─── */
function IconSealed() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M8 1.5 L14 4.5 L14 8 C14 11.5 11 13.5 8 14.5 C5 13.5 2 11.5 2 8 L2 4.5 Z" stroke="#4CC38A" strokeWidth="1.3" fill="rgba(76,195,138,0.15)" strokeLinejoin="round" />
    <path d="M5.5 8 L7 9.5 L10.5 6" stroke="#4CC38A" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>;
}
function IconBatch() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="5.5" stroke="#4CC38A" strokeWidth="1.3" />
    <path d="M5.5 8 L7 9.5 L10.5 6" stroke="#4CC38A" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>;
}
function IconInvoice() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect x="2.5" y="1.5" width="9" height="12" rx="1.5" stroke="#4CC38A" strokeWidth="1.3" />
    <line x1="5" y1="5.5" x2="9" y2="5.5" stroke="#4CC38A" strokeWidth="1.2" strokeLinecap="round" />
    <line x1="5" y1="8" x2="9" y2="8" stroke="#4CC38A" strokeWidth="1.2" strokeLinecap="round" />
    <line x1="5" y1="10.5" x2="7" y2="10.5" stroke="#4CC38A" strokeWidth="1.2" strokeLinecap="round" />
  </svg>;
}
function IconTime() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="5.5" stroke="#4CC38A" strokeWidth="1.3" />
    <path d="M8 4.5 L8 8 L10.5 8" stroke="#4CC38A" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>;
}

/* ─── Event type summary ─── */
const TYPE_LABELS: Record<EventType, string> = {
  SHIPMENT_SEALED: 'Shipments',
  QC_PASSED: 'QC Pass',
  QC_FAILED: 'QC Fail',
  INVOICE_TRIGGERED: 'Invoices',
  PAYMENT_RELEASED: 'Payments',
};
const TYPE_COLORS: Record<EventType, string> = {
  SHIPMENT_SEALED: '#6B6E68',
  QC_PASSED: '#4CC38A',
  QC_FAILED: '#B84B44',
  INVOICE_TRIGGERED: '#C9853A',
  PAYMENT_RELEASED: '#4CC38A',
};

export default function OverviewPage() {
  const { activity: events, counters, settings, updateSettings } = useDashboard();
  const eventsSealed = counters.sealed;
  const batchesQC    = counters.qcToday;
  const invoices     = counters.invoicesToday;
  const [hourlyData] = useState<HourlyEvent[]>(() => generateHourlyData());
  const [selected, setSelected] = useState<ActivityEvent | null>(null);

  function openEvent(e: ActivityEvent) {
    setSelected(e);
  }
  const selMap = selected ? EVENT_TO_MODAL[selected.type] : null;
  const selLabel = selected ? (selected.description.match(/\b[A-Z]+-\d+\b/)?.[0] ?? 'Live event') : '';

  /* event type breakdown */
  const breakdown = events.slice(0, 20).reduce<Record<string, number>>((acc, e) => {
    acc[e.type] = (acc[e.type] || 0) + 1;
    return acc;
  }, {});

  return (
    <>
    <div style={{ padding: '28px 32px', minHeight: '100vh' }}>

      {/* Page header */}
      <div style={{ marginBottom: 24 }}>
        <h1 className="font-display" style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
          Overview
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--accent)' }} />
          <span className="font-mono-custom" style={{ fontSize: 11.5, color: 'var(--text-secondary)' }}>
            Live · Jakarta time · updates every 5–8s
          </span>
        </div>
      </div>

      {/* KPI row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
        <KPICard index={0} label="Events Sealed Today"  value={eventsSealed}  trend="up" trendLabel="live"          accentColor="#4CC38A" icon={<IconSealed />}  href="/dashboard/supply-chain" />
        <KPICard index={1} label="Quality Checks Today" value={batchesQC}     sub="batches checked"                 accentColor="#4CC38A" icon={<IconBatch />}   href="/dashboard/quality-control" />
        <KPICard index={2} label="Invoices Processed"   value={invoices}      sub="since midnight"                  accentColor="#4CC38A" icon={<IconInvoice />} href="/dashboard/invoices" />
        <KPICard index={3} label="Avg. Settlement"      value="2.8s"          sub="smart contract trigger"          accentColor="#4CC38A" icon={<IconTime />} />
      </div>

      {/* Main layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 14 }}>

        {/* Activity feed */}
        <div style={{ background: 'var(--surface-1)', border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '13px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Activity feed</span>
            <button
              onClick={() => updateSettings({ liveFeed: !settings.liveFeed })}
              title={settings.liveFeed ? 'Pause live feed' : 'Resume live feed'}
              className="font-mono-custom"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6, cursor: 'pointer',
                fontSize: 10.5, padding: '4px 10px', borderRadius: 999,
                background: settings.liveFeed ? 'rgba(76,195,138,0.12)' : 'rgba(255,255,255,0.05)',
                border: `1px solid ${settings.liveFeed ? 'rgba(76,195,138,0.35)' : 'var(--border)'}`,
                color: settings.liveFeed ? 'var(--accent)' : 'var(--text-secondary)',
                transition: 'all 150ms',
              }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: settings.liveFeed ? 'var(--accent)' : 'var(--text-secondary)', display: 'inline-block' }} className={settings.liveFeed ? 'animate-blink' : undefined} />
              {settings.liveFeed ? 'live · pause' : 'paused · resume'}
            </button>
          </div>
          <div style={{ padding: '0 20px', flex: 1, overflow: 'auto', maxHeight: 520 }}>
            <ActivityFeed events={events} onSelect={openEvent} />
          </div>
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* Chart */}
          <div style={{ background: 'var(--surface-1)', border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}>
            <div style={{ padding: '13px 20px', borderBottom: '1px solid var(--border)' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>Events per hour</div>
              <div className="font-mono-custom" style={{ fontSize: 10.5, color: 'var(--text-secondary)' }}>last 12 hours</div>
            </div>
            <div style={{ padding: '16px 16px 8px' }}>
              <EventsChart data={hourlyData} />
            </div>
          </div>

          {/* Event type breakdown */}
          <div style={{ background: 'var(--surface-1)', border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}>
            <div style={{ padding: '13px 20px', borderBottom: '1px solid var(--border)' }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Last 20 events by type</span>
            </div>
            <div style={{ padding: '12px 20px' }}>
              {(Object.entries(breakdown) as [EventType, number][])
                .sort((a, b) => b[1] - a[1])
                .map(([type, count]) => {
                  const pct = Math.round((count / 20) * 100);
                  return (
                    <div key={type} style={{ marginBottom: 10 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span className="font-mono-custom" style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{TYPE_LABELS[type]}</span>
                        <span className="font-mono-custom" style={{ fontSize: 11, color: TYPE_COLORS[type] }}>{count}</span>
                      </div>
                      <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${pct}%`, background: TYPE_COLORS[type], borderRadius: 2, opacity: 0.8, transition: 'width 400ms ease' }} />
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </div>

      {selected && selMap && (
        <Modal
          id={selected.id}
          eventType={selMap.event}
          label={selLabel}
          tone={selMap.tone}
          subtitle="live activity"
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
}
