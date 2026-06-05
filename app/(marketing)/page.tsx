import Link from 'next/link';
import type { Metadata } from 'next';
import HomeHero from '@/components/site/HomeHero';
import Features from '@/components/site/Features';
import HowItWorks from '@/components/site/HowItWorks';
import Audiences from '@/components/site/Audiences';
import FAQ from '@/components/site/FAQ';

export const metadata: Metadata = {
  title: 'Veritas | Track your goods, prove your quality, get paid on time',
};

const PROBLEMS = [
  { stat: '1 in 3', label: 'quality disputes end in a price cut, even when the product was fine' },
  { stat: '62%',    label: 'of factories get different quality results from different shifts' },
  { stat: '45 days', label: 'is the average wait to get paid, with no easy way to prove delivery' },
];

export default function HomePage() {
  return (
    <>
      <HomeHero />

      {/* Problem strip */}
      <section style={{ padding: '88px 0', background: '#fff', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="veritas-container">
          <div style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto 48px' }}>
            <span className="section-label" style={{ marginBottom: 14 }}>Why it matters</span>
            <h2 className="font-display" style={{ fontSize: 'clamp(28px,3.4vw,42px)', fontWeight: 800, lineHeight: 1.14, color: 'var(--text-primary)', marginBottom: 16 }}>
              Right now, trust between factories and buyers leaks money
            </h2>
            <p style={{ fontSize: 17, lineHeight: 1.7, color: 'var(--text-secondary)' }}>
              These aren’t technology problems. They’re trust problems, and they cost real money every single month.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
            {PROBLEMS.map(p => (
              <div key={p.stat} style={{ textAlign: 'center', padding: '8px 16px' }}>
                <div className="font-display" style={{ fontSize: 'clamp(40px,5vw,60px)', fontWeight: 800, color: 'var(--accent-dark)', lineHeight: 1, marginBottom: 14 }}>{p.stat}</div>
                <p style={{ fontSize: 15, lineHeight: 1.6, color: 'var(--text-secondary)', maxWidth: 280, margin: '0 auto' }}>{p.label}</p>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <Link href="/problem" className="edlink" style={{ fontSize: 15.5 }}>Read more about the problem →</Link>
          </div>
        </div>
      </section>

      <Features />
      <HowItWorks />
      <Audiences />
      <FAQ />

      {/* Final CTA */}
      <section style={{ padding: '100px 0', background: 'var(--accent-dark)' }}>
        <div className="veritas-container" style={{ textAlign: 'center' }}>
          <h2 className="font-display" style={{ fontSize: 'clamp(32px,4vw,50px)', fontWeight: 800, lineHeight: 1.12, color: '#fff', maxWidth: 680, margin: '0 auto 20px' }}>
            Ready to stop chasing shipments, quality, and payments?
          </h2>
          <p style={{ fontSize: 18, lineHeight: 1.6, color: 'rgba(255,255,255,0.85)', maxWidth: 500, margin: '0 auto 36px' }}>
            We’re looking for a few pilot factories to work with. No commitment, just a conversation about what you need.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 30px', background: '#fff', color: 'var(--accent-dark)', fontSize: 15.5, fontWeight: 700, borderRadius: 10, textDecoration: 'none' }}>
              See it in action
            </Link>
            <Link href="/contact" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '13px 28px', background: 'transparent', color: '#fff', fontSize: 15.5, fontWeight: 600, borderRadius: 10, textDecoration: 'none', border: '1.5px solid rgba(255,255,255,0.5)' }}>
              Talk to us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
