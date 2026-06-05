import Link from 'next/link';
import { LogoFull } from '@/components/shared/Logo';

const COLUMNS = [
  {
    title: 'Product',
    links: [
      { href: '/product',    label: 'Track shipments' },
      { href: '/product',    label: 'Check quality' },
      { href: '/product',    label: 'Automatic payments' },
      { href: '/dashboard',  label: 'See the demo' },
    ],
  },
  {
    title: 'Company',
    links: [
      { href: '/problem',    label: 'Why Veritas' },
      { href: '/technology', label: 'How it works' },
      { href: '/contact',    label: 'Contact us' },
    ],
  },
];

export default function SiteFooter() {
  return (
    <footer style={{ borderTop: '1px solid var(--border)', background: 'var(--surface-1)' }}>
      <div className="veritas-container" style={{ padding: '60px 40px 36px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr 1fr', gap: 48, marginBottom: 48 }}>
          <div>
            <Link href="/" style={{ textDecoration: 'none', color: 'var(--text-primary)', display: 'inline-block', marginBottom: 16 }}>
              <LogoFull size={28} fontSize={18} />
            </Link>
            <p style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--text-secondary)', maxWidth: 320 }}>
              Veritas helps Indonesian factories track their goods, prove their quality,
              and get paid on time, all in one simple place.
            </p>
          </div>

          {COLUMNS.map(col => (
            <div key={col.title}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16 }}>{col.title}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {col.links.map((l, i) => (
                  <Link key={`${l.href}-${i}`} href={l.href} className="footer-link">{l.label}</Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{ height: 1, background: 'var(--border)', marginBottom: 24 }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <span style={{ fontSize: 13.5, color: 'var(--text-secondary)' }}>© 2026 Veritas · A proof of concept</span>
          <span style={{ fontSize: 13.5, color: 'var(--text-secondary)' }}>Made in Indonesia</span>
        </div>
      </div>
    </footer>
  );
}
