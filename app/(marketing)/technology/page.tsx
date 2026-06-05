import Link from 'next/link';
import type { Metadata } from 'next';
import PageHeader from '@/components/site/PageHeader';
import Reveal from '@/components/site/Reveal';

export const metadata: Metadata = { title: 'How it works | Veritas' };

const FLOW = [
  { no: '1', title: 'What goes in', items: ['Shipment updates', 'Quality readings', 'Vendor invoices'], note: 'Pulled from the systems you already use.' },
  { no: '2', title: 'What Veritas does', items: ['Spots problems early', 'Scores every batch', 'Checks it all matches'], note: 'Software does the watching, so your team doesn’t have to.' },
  { no: '3', title: 'What you get out', items: ['Delivery records', 'Quality certificates', 'Automatic payments'], note: 'Permanent proof anyone can check.' },
];

const STACK = [
  { name: 'A simple web app', role: 'What you see and click, works in any browser.' },
  { name: 'Smart quality checking', role: 'Camera-and-software that scores each batch the same way every time.' },
  { name: 'A tamper-proof ledger', role: 'Where every record is locked so it can’t be quietly changed.' },
  { name: 'Connectors', role: 'Links Veritas to your existing stock, quality, and accounting tools.' },
  { name: 'A secure database', role: 'Stores every shipment, batch, and invoice safely.' },
];

const PRINCIPLES = [
  { title: 'Records nobody can quietly edit', body: 'Every record is locked the moment it’s made. That permanence is the whole point, it’s what makes a buyer or bank trust it.' },
  { title: 'Sits on top of what you run', body: 'No new factory hardware, no ripping out your systems, no retraining your team. Veritas connects to what you already have.' },
  { title: 'Fast where it matters', body: 'A quality certificate appears within seconds of a batch passing. A payment settles in under three. Speed counts when cash flow is on the line.' },
];

export default function TechnologyPage() {
  return (
    <>
      <PageHeader
        label="How it works"
        title={<>Powerful underneath, simple on top</>}
        lead="You don't need to understand any of this to use Veritas. But if you're curious, or you're a technical buyer, here's what's happening behind the scenes."
      />

      {/* Flow */}
      <section style={{ padding: '80px 0', background: '#fff' }}>
        <div className="veritas-container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
            {FLOW.map((f, i) => (
              <Reveal key={f.no} delay={i * 0.08}>
                <div className="card" style={{ padding: '32px 28px', height: '100%' }}>
                  <div style={{ width: 40, height: 40, borderRadius: 11, background: 'var(--accent)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, fontWeight: 800, marginBottom: 18 }}>{f.no}</div>
                  <h3 className="font-display" style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16 }}>{f.title}</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
                    {f.items.map(it => (
                      <div key={it} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', flexShrink: 0 }} />
                        <span style={{ fontSize: 15, color: 'var(--text-primary)' }}>{it}</span>
                      </div>
                    ))}
                  </div>
                  <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--text-secondary)' }}>{f.note}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* The parts */}
      <section style={{ padding: '80px 0', background: 'var(--surface-1)', borderTop: '1px solid var(--border)' }}>
        <div className="veritas-container">
          <Reveal>
            <h2 className="font-display" style={{ fontSize: 'clamp(26px,3vw,38px)', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 12 }}>The parts that make it work</h2>
            <p style={{ fontSize: 17, color: 'var(--text-secondary)', maxWidth: 560, marginBottom: 40 }}>Five pieces, each doing one clear job, described in plain words.</p>
          </Reveal>
          <div className="card" style={{ overflow: 'hidden' }}>
            {STACK.map((t, i) => (
              <Reveal key={t.name} delay={i * 0.04}>
                <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 24, padding: '22px 28px', borderBottom: i < STACK.length - 1 ? '1px solid var(--border)' : 'none', alignItems: 'baseline' }}>
                  <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>{t.name}</span>
                  <span style={{ fontSize: 15.5, lineHeight: 1.6, color: 'var(--text-secondary)' }}>{t.role}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Principles */}
      <section style={{ padding: '80px 0', background: '#fff' }}>
        <div className="veritas-container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24, marginBottom: 56 }}>
            {PRINCIPLES.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.08}>
                <div style={{ padding: '4px 0' }}>
                  <h3 className="font-display" style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12, lineHeight: 1.3 }}>{p.title}</h3>
                  <p style={{ fontSize: 15.5, lineHeight: 1.7, color: 'var(--text-secondary)' }}>{p.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <div style={{ textAlign: 'center', paddingTop: 40, borderTop: '1px solid var(--border)' }}>
              <h2 className="font-display" style={{ fontSize: 'clamp(24px,2.8vw,34px)', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 22 }}>Want to see it working end to end?</h2>
              <Link href="/dashboard" className="btn-primary" style={{ fontSize: 15.5 }}>Open the live demo →</Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
