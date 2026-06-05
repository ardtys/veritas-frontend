import type { Metadata } from 'next';
import PageHeader from '@/components/site/PageHeader';
import Reveal from '@/components/site/Reveal';
import ContactForm from '@/components/site/ContactForm';

export const metadata: Metadata = { title: 'Contact | Veritas' };

const DETAILS = [
  { label: 'Email us', value: 'ardtys06@gmail.com', href: 'mailto:ardtys06@gmail.com' },
  { label: 'Based in', value: 'Indonesia', href: null },
  { label: 'Right now', value: 'Looking for pilot factories', href: null },
];

export default function ContactPage() {
  return (
    <>
      <PageHeader
        label="Get in touch"
        title={<>Let&rsquo;s talk about your factory</>}
        lead="Veritas is a proof of concept looking for its first partners. If you run a factory, or invest in ones that matter, we'd love to hear from you."
      />

      <section style={{ padding: '72px 0 100px', background: '#fff' }}>
        <div className="veritas-container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.15fr', gap: 64, alignItems: 'start' }}>
            <Reveal>
              <div>
                {DETAILS.map((d, i) => (
                  <div key={d.label} style={{ padding: '22px 0', borderTop: i === 0 ? 'none' : '1px solid var(--border)' }}>
                    <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 7 }}>{d.label}</div>
                    {d.href
                      ? <a href={d.href} className="edlink" style={{ fontSize: 21 }}>{d.value}</a>
                      : <div className="font-display" style={{ fontSize: 21, fontWeight: 700, color: 'var(--text-primary)' }}>{d.value}</div>}
                  </div>
                ))}
                <div className="card" style={{ marginTop: 28, padding: '24px 26px', background: 'var(--surface-1)' }}>
                  <p className="font-display" style={{ fontSize: 19, fontWeight: 600, lineHeight: 1.5, color: 'var(--text-primary)' }}>
                    &ldquo;Indonesian manufacturing runs on trust. Veritas makes it verifiable.&rdquo;
                  </p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <ContactForm />
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
