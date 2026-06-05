'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { LogoFull } from '@/components/shared/Logo';
import { SHIPMENTS, QC_BATCHES, INVOICES } from '@/lib/mockData';

/* ─── icons ─── */
function IconOverview({ on }: { on: boolean }) {
  const c = on ? '#4CC38A' : '#6B6E68';
  return (<svg width="15" height="15" viewBox="0 0 15 15" fill="none">
    <rect x="1" y="1" width="5.5" height="5.5" rx="1.5" fill={c} />
    <rect x="8.5" y="1" width="5.5" height="5.5" rx="1.5" fill={c} opacity={on ? 0.75 : 0.55} />
    <rect x="1" y="8.5" width="5.5" height="5.5" rx="1.5" fill={c} opacity={on ? 0.75 : 0.55} />
    <rect x="8.5" y="8.5" width="5.5" height="5.5" rx="1.5" fill={c} opacity={on ? 0.45 : 0.3} />
  </svg>);
}
function IconChain({ on }: { on: boolean }) {
  const c = on ? '#4CC38A' : '#6B6E68';
  return (<svg width="15" height="15" viewBox="0 0 15 15" fill="none">
    <circle cx="2.5" cy="7.5" r="1.8" fill={c} /><circle cx="7.5" cy="7.5" r="1.8" fill={c} /><circle cx="12.5" cy="7.5" r="1.8" fill={c} />
    <line x1="4.3" y1="7.5" x2="5.7" y2="7.5" stroke={c} strokeWidth="1.4" strokeLinecap="round" />
    <line x1="9.3" y1="7.5" x2="10.7" y2="7.5" stroke={c} strokeWidth="1.4" strokeLinecap="round" />
  </svg>);
}
function IconQC({ on }: { on: boolean }) {
  const c = on ? '#4CC38A' : '#6B6E68';
  return (<svg width="15" height="15" viewBox="0 0 15 15" fill="none">
    <circle cx="7.5" cy="7.5" r="6" stroke={c} strokeWidth="1.4" />
    <path d="M4.5 7.5 L6.5 9.5 L10.5 5.5" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>);
}
function IconInvoice({ on }: { on: boolean }) {
  const c = on ? '#4CC38A' : '#6B6E68';
  return (<svg width="15" height="15" viewBox="0 0 15 15" fill="none">
    <rect x="2.5" y="1" width="8" height="12" rx="1.5" stroke={c} strokeWidth="1.4" />
    <line x1="4.5" y1="5" x2="8.5" y2="5" stroke={c} strokeWidth="1.2" strokeLinecap="round" />
    <line x1="4.5" y1="7.5" x2="8.5" y2="7.5" stroke={c} strokeWidth="1.2" strokeLinecap="round" />
    <line x1="4.5" y1="10" x2="6.5" y2="10" stroke={c} strokeWidth="1.2" strokeLinecap="round" />
  </svg>);
}
function IconReport({ on }: { on: boolean }) {
  const c = on ? '#4CC38A' : '#6B6E68';
  return (<svg width="15" height="15" viewBox="0 0 15 15" fill="none">
    <line x1="2" y1="13" x2="13" y2="13" stroke={c} strokeWidth="1.3" strokeLinecap="round" />
    <rect x="3" y="7" width="2.4" height="4" rx="0.6" fill={c} opacity="0.7" />
    <rect x="6.3" y="4" width="2.4" height="7" rx="0.6" fill={c} opacity="0.7" />
    <rect x="9.6" y="9" width="2.4" height="2" rx="0.6" fill={c} opacity="0.7" />
  </svg>);
}
function IconAnalytics({ on }: { on: boolean }) {
  const c = on ? '#4CC38A' : '#6B6E68';
  return (<svg width="15" height="15" viewBox="0 0 15 15" fill="none">
    <path d="M2 10 L5.5 6 L8 8.5 L13 3" stroke={c} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="13" cy="3" r="1.4" fill={c} />
  </svg>);
}
function IconGear({ on }: { on: boolean }) {
  const c = on ? '#4CC38A' : '#6B6E68';
  return (<svg width="15" height="15" viewBox="0 0 15 15" fill="none">
    <circle cx="7.5" cy="7.5" r="2.2" stroke={c} strokeWidth="1.3" />
    <circle cx="7.5" cy="7.5" r="5.2" stroke={c} strokeWidth="1.3" strokeDasharray="1.4 2.2" />
  </svg>);
}
function IconHelp({ on }: { on: boolean }) {
  const c = on ? '#4CC38A' : '#6B6E68';
  return (<svg width="15" height="15" viewBox="0 0 15 15" fill="none">
    <circle cx="7.5" cy="7.5" r="6" stroke={c} strokeWidth="1.3" />
    <path d="M5.8 5.8 Q5.8 4.4 7.5 4.4 Q9.2 4.4 9.2 6 Q9.2 7.2 7.5 7.6 L7.5 8.6" stroke={c} strokeWidth="1.2" fill="none" strokeLinecap="round" />
    <circle cx="7.5" cy="10.6" r="0.7" fill={c} />
  </svg>);
}

interface NavItem {
  href: string;
  label: string;
  Icon: (p: { on: boolean }) => React.ReactElement;
  count?: number;
  tone?: 'neutral' | 'amber' | 'red';
  disabled?: boolean;
}

function Clock() {
  const [t, setT] = useState('');
  useEffect(() => {
    const tick = () => setT(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'Asia/Jakarta', hour12: false }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return <>{t} WIB</>;
}

function CountBadge({ count, tone }: { count: number; tone: 'neutral' | 'amber' | 'red' }) {
  const map = {
    neutral: { bg: 'rgba(255,255,255,0.06)', fg: 'var(--text-secondary)' },
    amber:   { bg: 'rgba(201,133,58,0.16)',  fg: '#C9853A' },
    red:     { bg: 'rgba(184,75,68,0.16)',   fg: '#B84B44' },
  }[tone];
  return (
    <span className="font-mono-custom" style={{ marginLeft: 'auto', fontSize: 10.5, fontWeight: 600, color: map.fg, background: map.bg, borderRadius: 999, padding: '1px 7px', minWidth: 20, textAlign: 'center' }}>
      {count}
    </span>
  );
}

function NavLink({ item, pathname }: { item: NavItem; pathname: string }) {
  const on = item.href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(item.href);
  if (item.disabled) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '8px 10px', borderRadius: 6, marginBottom: 2, borderLeft: '2px solid transparent', cursor: 'not-allowed' }}>
        <span style={{ opacity: 0.4, display: 'flex' }}><item.Icon on={false} /></span>
        <span style={{ fontSize: 13.5, color: 'rgba(107,110,104,0.4)' }}>{item.label}</span>
        <span className="badge badge-neutral" style={{ marginLeft: 'auto', fontSize: 9, padding: '1px 7px' }}>soon</span>
      </div>
    );
  }
  return (
    <Link href={item.href}
      style={{
        display: 'flex', alignItems: 'center', gap: 9, padding: '8px 10px', borderRadius: 6, marginBottom: 2,
        fontSize: 13.5, fontWeight: on ? 500 : 400,
        color: on ? 'var(--text-primary)' : 'var(--text-secondary)',
        background: on ? 'rgba(76,195,138,0.1)' : 'transparent',
        textDecoration: 'none', borderLeft: `2px solid ${on ? 'var(--accent)' : 'transparent'}`,
        transition: 'background 150ms, color 150ms',
      }}
      onMouseEnter={e => { if (!on) { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = 'var(--text-primary)'; } }}
      onMouseLeave={e => { if (!on) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; } }}
    >
      <item.Icon on={on} />
      {item.label}
      {item.count !== undefined && item.count > 0 && <CountBadge count={item.count} tone={item.tone ?? 'neutral'} />}
    </Link>
  );
}

export default function Sidebar() {
  const pathname = usePathname();

  const inTransit = SHIPMENTS.filter(s => s.status === 'In Transit').length;
  const flagged   = SHIPMENTS.filter(s => s.status === 'Flagged').length;
  const qcFailed  = QC_BATCHES.filter(b => b.status === 'Failed').length;
  const invPending = INVOICES.filter(i => i.status === 'Pending').length;

  const OPERATIONS: NavItem[] = [
    { href: '/dashboard',                 label: 'Overview',        Icon: IconOverview },
    { href: '/dashboard/supply-chain',    label: 'Supply Chain',    Icon: IconChain,   count: flagged > 0 ? flagged : inTransit, tone: flagged > 0 ? 'amber' : 'neutral' },
    { href: '/dashboard/quality-control', label: 'Quality Control', Icon: IconQC,      count: qcFailed,  tone: 'red' },
    { href: '/dashboard/invoices',        label: 'Invoices',        Icon: IconInvoice, count: invPending, tone: 'amber' },
  ];
  const INSIGHTS: NavItem[] = [
    { href: '/dashboard/reports',   label: 'Reports',   Icon: IconReport },
    { href: '/dashboard/analytics', label: 'Analytics', Icon: IconAnalytics },
  ];
  const ACCOUNT: NavItem[] = [
    { href: '/dashboard/settings', label: 'Settings',    Icon: IconGear },
    { href: '/dashboard/help',     label: 'Help & docs', Icon: IconHelp },
  ];

  const Section = ({ title, items }: { title: string; items: NavItem[] }) => (
    <div style={{ marginBottom: 14 }}>
      <div className="font-mono-custom" style={{ fontSize: 10, color: 'var(--text-secondary)', letterSpacing: '0.12em', textTransform: 'uppercase', padding: '4px 10px 7px' }}>{title}</div>
      {items.map(it => <NavLink key={it.label} item={it} pathname={pathname} />)}
    </div>
  );

  return (
    <aside style={{ width: 244, minWidth: 244, height: '100vh', position: 'sticky', top: 0, background: 'var(--surface-1)', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column' }}>

      {/* Logo */}
      <div style={{ padding: '20px 18px 16px', borderBottom: '1px solid var(--border)' }}>
        <Link href="/" style={{ textDecoration: 'none', color: 'var(--text-primary)', display: 'block' }}>
          <LogoFull size={26} fontSize={15} />
        </Link>
        <div className="font-mono-custom" style={{ fontSize: 10, color: 'var(--text-secondary)', marginTop: 6, paddingLeft: 37 }}>
          Dashboard · v0.9
        </div>
      </div>

      {/* Nav (scrollable) */}
      <nav style={{ padding: '14px 10px', flex: 1, overflowY: 'auto' }}>
        <Section title="Operations" items={OPERATIONS} />
        <div className="rule" style={{ margin: '4px 10px 14px', width: 'auto' }} />
        <Section title="Insights" items={INSIGHTS} />
        <div className="rule" style={{ margin: '4px 10px 14px', width: 'auto' }} />
        <Section title="Account" items={ACCOUNT} />
      </nav>

      {/* System status block */}
      <div style={{ borderTop: '1px solid var(--border)', padding: '14px 18px' }}>
        <div className="font-mono-custom" style={{ fontSize: 10, color: 'var(--text-secondary)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>Records</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 7 }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--accent)', flexShrink: 0 }} />
          <span style={{ fontSize: 12, color: 'var(--text-primary)' }}>Online &amp; verified</span>
        </div>
        <div style={{ fontSize: 11.5, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
          12,400 sealed today<br />
          Last one 2s ago · <span className="font-mono-custom"><Clock /></span>
        </div>
      </div>

      {/* Account block */}
      <div style={{ borderTop: '1px solid var(--border)', padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(76,195,138,0.14)', border: '1px solid rgba(76,195,138,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <span className="font-mono-custom" style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent)' }}>DA</span>
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Daffa Arditya</div>
          <div className="font-mono-custom" style={{ fontSize: 10.5, color: 'var(--text-secondary)' }}>PT Demo Pabrik</div>
        </div>
      </div>
    </aside>
  );
}
