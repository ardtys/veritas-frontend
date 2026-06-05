import Link from 'next/link';
import type { Metadata } from 'next';
import PageHeader from '@/components/site/PageHeader';
import Reveal from '@/components/site/Reveal';

export const metadata: Metadata = { title: 'Product | Veritas' };

/* ─── Friendly preview panels (light, no terminals) ─── */

function ShipmentPanel() {
  const stops = [
    { city: 'Surabaya', note: 'Left the warehouse · 08:14', done: true },
    { city: 'Semarang', note: 'Arrived at transit hub · 11:42', done: true },
    { city: 'Jakarta',  note: 'Arriving around 14:30', done: false },
  ];
  return (
    <div className="card" style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>Shipment to PT Auto Nusa</span>
        <span className="badge badge-amber">On the way</span>
      </div>
      {stops.map((s, i) => (
        <div key={s.city} style={{ display: 'flex', gap: 14 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ width: 22, height: 22, borderRadius: '50%', background: s.done ? 'var(--accent)' : '#fff', border: s.done ? 'none' : '2px solid var(--border-strong)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {s.done && <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2.5 6 L5 8.5 L9.5 3.5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>}
            </span>
            {i < stops.length - 1 && <span style={{ width: 2, height: 30, background: s.done ? 'var(--accent)' : 'var(--border)', margin: '3px 0' }} />}
          </div>
          <div style={{ paddingBottom: 14 }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: s.done ? 'var(--text-primary)' : 'var(--text-secondary)' }}>{s.city}</div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{s.note}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function QualityPanel() {
  return (
    <div className="card" style={{ padding: 28, textAlign: 'center' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, textAlign: 'left' }}>
        <div>
          <div style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>Batch of steel sheets</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>Baja Lembaran G-40</div>
        </div>
        <span className="badge badge-green">Passed</span>
      </div>
      <div className="font-display" style={{ fontSize: 76, fontWeight: 800, color: 'var(--accent-dark)', lineHeight: 1 }}>97</div>
      <div style={{ fontSize: 15, color: 'var(--text-secondary)', marginBottom: 20 }}>out of 100, above your standard</div>
      <div style={{ height: 8, background: 'var(--surface-2)', borderRadius: 4, overflow: 'hidden', marginBottom: 10 }}>
        <div style={{ height: '100%', width: '97%', background: 'var(--accent)', borderRadius: 4 }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, color: 'var(--text-secondary)' }}>
        <span>Fail</span><span>Borderline</span><span>Pass</span>
      </div>
    </div>
  );
}

function PaymentPanel() {
  const steps = [
    { label: 'Invoice arrives from your vendor', time: 'Step 1' },
    { label: 'Quality matches, scored 97/100', time: 'Step 2' },
    { label: 'Delivery confirmed', time: 'Step 3' },
    { label: 'Payment sent, Rp 187,5 million', time: 'Done', highlight: true },
  ];
  return (
    <div className="card" style={{ padding: 24 }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 18 }}>From invoice to payment, automatically</div>
      {steps.map((s, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', borderRadius: 11, background: s.highlight ? 'var(--accent-soft)' : 'var(--surface-1)', marginBottom: 8 }}>
          <span style={{ width: 22, height: 22, borderRadius: '50%', background: s.highlight ? 'var(--accent)' : '#fff', border: s.highlight ? 'none' : '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2.5 6 L5 8.5 L9.5 3.5" stroke={s.highlight ? '#fff' : '#15A877'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </span>
          <span style={{ flex: 1, fontSize: 14, fontWeight: s.highlight ? 700 : 500, color: s.highlight ? 'var(--accent-dark)' : 'var(--text-primary)' }}>{s.label}</span>
          <span style={{ fontSize: 12, color: 'var(--text-secondary)', flexShrink: 0 }}>{s.time}</span>
        </div>
      ))}
    </div>
  );
}

const MODULES = [
  {
    no: '01', label: 'Shipment tracking',
    title: 'Always know where your goods are.',
    body: 'From the warehouse floor to the final delivery, every handoff is recorded the moment it happens, who passed it on, who received it, and when. When a buyer asks where their order is, the answer is already on the screen. And the record can never be changed afterwards.',
    points: ['Real-time location for every shipment', 'A full, permanent history of every handoff', 'A link you can share with any buyer'],
    panel: <ShipmentPanel />, panelLeft: false,
  },
  {
    no: '02', label: 'Quality checks',
    title: 'The same quality check, every shift.',
    body: 'A camera-and-software system scores each batch against your standard, exactly the same way at 9am and at 3am. When a batch passes, it gets a certificate your buyer can open and check themselves, without having to trust your word for it.',
    points: ['One consistent standard, day and night', 'Catches defects before goods ship', 'A certificate buyers can verify'],
    panel: <QualityPanel />, panelLeft: true,
  },
  {
    no: '03', label: 'Automatic payments',
    title: 'Vendors get paid the moment they earn it.',
    body: 'When the quality matches what was agreed and the delivery is confirmed, payment goes out on its own, in seconds. Nobody chases an approval, and nobody wonders when the money is coming.',
    points: ['Pays out in seconds, not weeks', 'No manual approval steps', 'Predictable cash flow for everyone'],
    panel: <PaymentPanel />, panelLeft: false,
  },
];

function Copy({ no, label, title, body, points }: typeof MODULES[number]) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: '#fff', background: 'var(--accent)', borderRadius: 8, padding: '4px 10px' }}>{no}</span>
        <span className="section-label">{label}</span>
      </div>
      <h2 className="font-display" style={{ fontSize: 'clamp(26px,3vw,38px)', fontWeight: 800, lineHeight: 1.15, color: 'var(--text-primary)', marginBottom: 18 }}>{title}</h2>
      <p style={{ fontSize: 17, lineHeight: 1.8, color: 'var(--text-secondary)', marginBottom: 24 }}>{body}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {points.map(p => (
          <div key={p} style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
            <span style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--accent-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2.5 6 L5 8.5 L9.5 3.5" stroke="#15A877" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </span>
            <span style={{ fontSize: 15.5, color: 'var(--text-primary)' }}>{p}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ProductPage() {
  return (
    <>
      <PageHeader
        label="The product"
        title={<>One simple tool that does three big jobs</>}
        lead="Veritas follows your goods, checks your quality, and handles your payments, and keeps a permanent, shareable record of all of it."
      />

      {MODULES.map((m, idx) => (
        <section key={m.no} style={{ padding: '88px 0', background: idx % 2 === 1 ? 'var(--surface-1)' : '#fff', borderBottom: '1px solid var(--border)' }}>
          <div className="veritas-container">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
              {m.panelLeft ? (
                <>
                  <Reveal>{m.panel}</Reveal>
                  <Reveal delay={0.1}><Copy {...m} /></Reveal>
                </>
              ) : (
                <>
                  <Reveal><Copy {...m} /></Reveal>
                  <Reveal delay={0.1}>{m.panel}</Reveal>
                </>
              )}
            </div>
          </div>
        </section>
      ))}

      <section style={{ padding: '80px 0', background: '#fff' }}>
        <div className="veritas-container" style={{ textAlign: 'center' }}>
          <Reveal>
            <h2 className="font-display" style={{ fontSize: 'clamp(28px,3.4vw,40px)', fontWeight: 800, lineHeight: 1.15, color: 'var(--text-primary)', maxWidth: 540, margin: '0 auto 24px' }}>
              See all three working together
            </h2>
            <Link href="/dashboard" className="btn-primary" style={{ fontSize: 15.5 }}>Open the live demo →</Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
