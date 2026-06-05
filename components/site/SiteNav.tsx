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

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <nav
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        height: 70, display: 'flex', alignItems: 'center',
        background: '#fff',
        borderBottom: `1px solid ${scrolled ? 'var(--border)' : 'transparent'}`,
        boxShadow: scrolled ? 'var(--shadow-sm)' : 'none',
        transition: 'border-color 250ms ease, box-shadow 250ms ease',
      }}
    >
      <div className="veritas-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
        <Link href="/" style={{ textDecoration: 'none', color: 'var(--text-primary)' }}>
          <LogoFull size={30} fontSize={19} />
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: 34 }}>
          {LINKS.map(l => (
            <Link key={l.href} href={l.href} className="nav-link" data-active={pathname === l.href}>
              {l.label}
            </Link>
          ))}
          <Link href="/dashboard" className="btn-primary" style={{ fontSize: 14, padding: '10px 20px' }}>
            See it in action
          </Link>
        </div>
      </div>
    </nav>
  );
}
