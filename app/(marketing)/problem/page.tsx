import Link from 'next/link';
import type { Metadata } from 'next';
import PageHeader from '@/components/site/PageHeader';
import Reveal from '@/components/site/Reveal';

export const metadata: Metadata = { title: 'Why Veritas | Veritas' };

const FAILURES = [
  {
    no: '1',
    stat: '1 in 3',
    statLabel: 'disputes end in a price cut',
    title: 'The data exists. Nobody trusts it.',
    body: 'Buyers, banks, and auditors each hold a piece of the picture, and none of them can check the others. So when a customer disputes a shipment, the factory has no independent proof, and ends up giving a discount, arguing for weeks, or losing the relationship. The information is all there. The trust isn’t.',
  },
  {
    no: '2',
    stat: '62%',
    statLabel: 'of factories get mixed QC results',
    title: 'Quality depends on who’s awake.',
    body: 'A check done at 3am isn’t the same as one done at 9am. The same batch can pass on one shift and fail on the next, depending on who’s looking and how tired they are. And when a defect slips through, nobody can prove what was actually checked.',
  },
  {
    no: '3',
    stat: '45 days',
    statLabel: 'average wait to get paid',
    title: 'Late payment becomes the norm.',
    body: 'Buyers drag out payment because there’s no clear, independent proof of quality or delivery. So vendors wait, and while they wait, they send the same message for the third time: “has the payment been processed yet?” Then they raise their prices to cover the risk.',
  },
];

export default function ProblemPage() {
  return (
    <>
      <PageHeader
        label="Why Veritas"
        title={<>Three everyday problems, one shared cause</>}
        lead="Walk into most factories in Java or Sumatra and you'll find the same thing. It's not that people aren't trying, it's that there's no shared, trustworthy record everyone can rely on."
      />

      <section style={{ padding: '80px 0', background: '#fff' }}>
        <div className="veritas-container" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {FAILURES.map((f, i) => (
            <Reveal key={f.no} delay={i * 0.05}>
              <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr' }}>
                  {/* Left stat panel */}
                  <div style={{ background: 'var(--surface-1)', padding: '40px 36px', display: 'flex', flexDirection: 'column', justifyContent: 'center', borderRight: '1px solid var(--border)' }}>
                    <div style={{ width: 40, height: 40, borderRadius: 11, background: 'var(--accent)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 800, marginBottom: 20 }}>{f.no}</div>
                    <div className="font-display" style={{ fontSize: 'clamp(36px,4vw,48px)', fontWeight: 800, color: 'var(--accent-dark)', lineHeight: 1, marginBottom: 10 }}>{f.stat}</div>
                    <div style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{f.statLabel}</div>
                  </div>
                  {/* Right body */}
                  <div style={{ padding: '40px 40px' }}>
                    <h2 className="font-display" style={{ fontSize: 'clamp(22px,2.6vw,30px)', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2, marginBottom: 16 }}>{f.title}</h2>
                    <p style={{ fontSize: 16.5, lineHeight: 1.8, color: 'var(--text-secondary)' }}>{f.body}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 0', background: 'var(--surface-1)', borderTop: '1px solid var(--border)' }}>
        <div className="veritas-container" style={{ textAlign: 'center' }}>
          <Reveal>
            <h2 className="font-display" style={{ fontSize: 'clamp(28px,3.4vw,40px)', fontWeight: 800, lineHeight: 1.15, color: 'var(--text-primary)', maxWidth: 560, margin: '0 auto 24px' }}>
              One missing layer. Here’s how Veritas fills it.
            </h2>
            <Link href="/product" className="btn-primary" style={{ fontSize: 15.5 }}>See the product →</Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
