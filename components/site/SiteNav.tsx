'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogoFull } from '@/components/shared/Logo';

const LINKS = [
  { href: '/product',    label: 'Product' },
  { href: '/problem',    label: 'Why Veritas' },
  { href: '/technology', label: 'How it works' },
  { href: '/contact',    label: 'Contact' },
];

export default function SiteNav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  // Close the drawer whenever the route changes, and lock body scroll while open.
  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <nav
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 70,
        height: 70, display: 'flex', alignItems: 'center',
        background: '#fff',
        borderBottom: `1px solid ${scrolled || open ? 'var(--border)' : 'transparent'}`,
        boxShadow: scrolled ? 'var(--shadow-sm)' : 'none',
        transition: 'border-color 250ms ease, box-shadow 250ms ease',
      }}
    >
      <div className="veritas-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
        <Link href="/" style={{ textDecoration: 'none', color: 'var(--text-primary)' }}>
          <LogoFull size={30} fontSize={19} />
        </Link>

        {/* Desktop links */}
        <div className="desktop-only" style={{ display: 'flex', alignItems: 'center', gap: 34 }}>
          {LINKS.map(l => (
            <Link key={l.href} href={l.href} className="nav-link" data-active={pathname === l.href}>
              {l.label}
            </Link>
          ))}
          <Link href="/dashboard" className="btn-primary" style={{ fontSize: 14, padding: '10px 20px' }}>
            See it in action
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="mobile-only icon-btn"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen(o => !o)}
        >
          <Burger open={open} />
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <>
          <button className="drawer-backdrop mobile-only" aria-label="Close menu" onClick={() => setOpen(false)} style={{ top: 70 }} />
          <div
            className="mobile-only"
            style={{
              position: 'fixed', top: 70, left: 0, right: 0, zIndex: 70,
              flexDirection: 'column', gap: 4,
              background: '#fff', borderBottom: '1px solid var(--border)',
              boxShadow: 'var(--shadow)', padding: '14px 0 20px',
            }}
          >
            <div className="veritas-container" style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {LINKS.map(l => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="nav-link"
                  data-active={pathname === l.href}
                  style={{ padding: '12px 4px', fontSize: 16, borderBottom: '1px solid var(--border)' }}
                >
                  {l.label}
                </Link>
              ))}
              <Link href="/dashboard" className="btn-primary" style={{ justifyContent: 'center', marginTop: 12, fontSize: 15 }}>
                See it in action
              </Link>
            </div>
          </div>
        </>
      )}
    </nav>
  );
}

function Burger({ open }: { open: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <line x1="3" y1={open ? 10 : 6} x2="17" y2={open ? 10 : 6} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"
        style={{ transform: open ? 'rotate(45deg)' : 'none', transformOrigin: 'center', transition: 'transform 200ms ease' }} />
      <line x1="3" y1="10" x2="17" y2="10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"
        style={{ opacity: open ? 0 : 1, transition: 'opacity 150ms ease' }} />
      <line x1="3" y1={open ? 10 : 14} x2="17" y2={open ? 10 : 14} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"
        style={{ transform: open ? 'rotate(-45deg)' : 'none', transformOrigin: 'center', transition: 'transform 200ms ease' }} />
    </svg>
  );
}
