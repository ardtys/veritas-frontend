'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Sidebar from '@/components/dashboard/Sidebar';
import { LogoFull } from '@/components/shared/Logo';

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close the drawer on navigation; lock scroll while it's open.
  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <div className="theme-dark dashboard-shell" style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#0C0E0D' }}>
      {/* Sidebar: in-flow column on desktop, slide-in drawer on mobile */}
      <div className={`dashboard-sidebar${open ? ' is-open' : ''}`}>
        <Sidebar />
      </div>
      {open && (
        <button className="drawer-backdrop mobile-only" aria-label="Close menu" onClick={() => setOpen(false)} />
      )}

      <main style={{ flex: 1, minWidth: 0, overflow: 'auto', background: 'var(--bg)' }}>
        {/* Mobile top bar */}
        <div className="mobile-only dashboard-topbar">
          <button className="icon-btn" aria-label="Open menu" onClick={() => setOpen(true)}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <line x1="3" y1="6"  x2="17" y2="6"  stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              <line x1="3" y1="10" x2="17" y2="10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              <line x1="3" y1="14" x2="17" y2="14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
          <Link href="/" style={{ textDecoration: 'none', color: 'var(--text-primary)' }}>
            <LogoFull size={24} fontSize={14} />
          </Link>
          <span style={{ width: 40 }} />
        </div>

        {children}
      </main>
    </div>
  );
}
