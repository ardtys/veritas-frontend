'use client';

import { useState } from 'react';
import { useDashboard, initials } from '@/lib/store';

const TABS = ['Account', 'Factory profile', 'Automation', 'Connections', 'Notifications', 'Team'];

const card: React.CSSProperties = { background: 'var(--surface-1)', border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' };
const field: React.CSSProperties = { width: '100%', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 6, padding: '10px 13px', fontSize: 13.5, color: 'var(--text-primary)', fontFamily: 'var(--font-dm-sans), sans-serif', outline: 'none' };
const label: React.CSSProperties = { display: 'block', fontSize: 11, fontFamily: 'var(--font-jetbrains), monospace', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: 8 };

function Toggle({ on: initial }: { on: boolean }) {
  const [on, setOn] = useState(initial);
  return <ToggleC on={on} onChange={setOn} />;
}

/** Controlled toggle, for settings that actually drive the system. */
function ToggleC({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!on)} style={{ width: 40, height: 22, borderRadius: 999, border: 'none', cursor: 'pointer', background: on ? 'var(--accent)' : 'rgba(255,255,255,0.12)', position: 'relative', transition: 'background 180ms', flexShrink: 0 }}>
      <span style={{ position: 'absolute', top: 3, left: on ? 21 : 3, width: 16, height: 16, borderRadius: '50%', background: on ? '#0C0E0D' : '#E4E1D8', transition: 'left 180ms' }} />
    </button>
  );
}

const INTEGRATIONS = [
  { name: 'SAP Business One (ERP)', desc: 'Pulls shipment and inventory events', status: 'Connected', on: true },
  { name: 'Quality sensor feed',     desc: 'Live readings from the QC station',  status: 'Connected', on: true },
  { name: 'Accurate (Accounting)',   desc: 'Reads invoices, writes payments',     status: 'Connected', on: true },
  { name: 'WhatsApp Business',       desc: 'Send buyers a tracking link',         status: 'Not connected', on: false },
];

const NOTIFS = [
  { name: 'A shipment is delayed',         desc: 'Alert when transit time is exceeded', on: true },
  { name: 'A batch fails quality',         desc: 'Alert the moment a batch scores below 70', on: true },
  { name: 'A payment is released',         desc: 'Confirmation when a vendor is paid', on: true },
  { name: 'Daily summary email',           desc: 'One digest at 18:00 WIB', on: false },
  { name: 'Weekly performance report',     desc: 'Every Monday morning', on: true },
];

const TEAM = [
  { initials: 'DA', name: 'Daffa Arditya', email: 'ardtys06@gmail.com', role: 'Owner' },
  { initials: 'SR', name: 'Siti Rahayu',   email: 'siti@pabrik.co.id',  role: 'Quality lead' },
  { initials: 'BS', name: 'Budi Santoso',  email: 'budi@pabrik.co.id',  role: 'Operations' },
  { initials: 'FN', name: 'Finance team',  email: 'finance@pabrik.co.id', role: 'Finance · view only' },
];

export default function SettingsPage() {
  const { settings, updateSettings, resetAll, notify } = useDashboard();
  const [tab, setTab] = useState('Account');

  // Local edit buffers for the text forms (committed on Save).
  const [name, setName] = useState(settings.operatorName);
  const [role, setRole] = useState(settings.operatorRole);
  const [email, setEmail] = useState(settings.operatorEmail);
  const [company, setCompany] = useState(settings.companyName);
  const [address, setAddress] = useState(settings.companyAddress);

  function saveAccount() {
    updateSettings({ operatorName: name, operatorRole: role, operatorEmail: email });
    notify('Account saved');
  }
  function saveFactory() {
    updateSettings({ companyName: company, companyAddress: address });
    notify('Factory profile saved');
  }

  return (
    <div style={{ padding: '28px 32px', maxWidth: 920 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 className="font-display" style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>Settings</h1>
        <span style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>Manage your account, factory, and connections</span>
      </div>

      {/* Tabs */}
      <div className="tab-strip" style={{ display: 'flex', gap: 4, borderBottom: '1px solid var(--border)', marginBottom: 24 }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            style={{ fontSize: 13.5, padding: '10px 16px', background: 'none', border: 'none', borderBottom: `2px solid ${tab === t ? 'var(--accent)' : 'transparent'}`, color: tab === t ? 'var(--text-primary)' : 'var(--text-secondary)', cursor: 'pointer', fontWeight: tab === t ? 500 : 400, fontFamily: 'var(--font-dm-sans), sans-serif', marginBottom: -1, transition: 'color 150ms' }}>
            {t}
          </button>
        ))}
      </div>

      {/* Account */}
      {tab === 'Account' && (
        <div style={{ ...card, padding: 28, maxWidth: 560 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28, paddingBottom: 24, borderBottom: '1px solid var(--border)' }}>
            <div style={{ width: 56, height: 56, borderRadius: 12, background: 'rgba(76,195,138,0.14)', border: '1px solid rgba(76,195,138,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span className="font-mono-custom" style={{ fontSize: 18, fontWeight: 700, color: 'var(--accent)' }}>{initials(name)}</span>
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)' }}>{name}</div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{role} · {company}</div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 20 }}>
            <div><label style={label}>Full name</label><input style={field} value={name} onChange={e => setName(e.target.value)} /></div>
            <div><label style={label}>Role</label><input style={field} value={role} onChange={e => setRole(e.target.value)} /></div>
          </div>
          <div style={{ marginBottom: 24 }}><label style={label}>Email</label><input style={field} value={email} onChange={e => setEmail(e.target.value)} /></div>
          <button className="btn-primary" style={{ fontSize: 13 }} onClick={saveAccount}>Save changes</button>
        </div>
      )}

      {/* Factory profile */}
      {tab === 'Factory profile' && (
        <div style={{ ...card, padding: 28, maxWidth: 560 }}>
          <div style={{ marginBottom: 20 }}><label style={label}>Company name</label><input style={field} value={company} onChange={e => setCompany(e.target.value)} /></div>
          <div style={{ marginBottom: 20 }}><label style={label}>Factory address</label><input style={field} value={address} onChange={e => setAddress(e.target.value)} /></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 20 }}>
            <div><label style={label}>Industry</label><input style={field} defaultValue="Steel & metal components" /></div>
            <div><label style={label}>Employees</label><input style={field} defaultValue="240" /></div>
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={label}>Product lines</label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {['Baja Lembaran G-40', 'Komponen Otomotif', 'Kawat Las WL-200', 'Pipa Galvanis'].map(p => (
                <span key={p} className="badge badge-neutral" style={{ fontSize: 11.5, padding: '5px 12px' }}>{p}</span>
              ))}
              <span className="badge badge-green" style={{ fontSize: 11.5, padding: '5px 12px', cursor: 'pointer' }}>+ Add</span>
            </div>
          </div>
          <button className="btn-primary" style={{ fontSize: 13 }} onClick={saveFactory}>Save changes</button>
        </div>
      )}

      {/* Automation — these settings actually drive the dashboard */}
      {tab === 'Automation' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 620 }}>
          <div style={{ ...card, padding: 24 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>Quality pass threshold</div>
            <div style={{ fontSize: 12.5, color: 'var(--text-secondary)', marginBottom: 16 }}>Batches scoring at or above this pass. Used live when you run a QC check.</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <input type="range" min={50} max={95} value={settings.qcThreshold} onChange={e => updateSettings({ qcThreshold: Number(e.target.value) })} style={{ flex: 1, accentColor: 'var(--accent)' }} />
              <span className="font-mono-custom" style={{ fontSize: 20, fontWeight: 700, color: 'var(--accent)', minWidth: 36, textAlign: 'right' }}>{settings.qcThreshold}</span>
            </div>
          </div>

          <div style={{ ...card }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '18px 24px', borderBottom: '1px solid var(--border)' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 2 }}>Auto-release payments</div>
                <div style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>Pay vendors automatically the moment an invoice is verified.</div>
              </div>
              <ToggleC on={settings.autoRelease} onChange={v => { updateSettings({ autoRelease: v }); notify(`Auto-release ${v ? 'on' : 'off'}`); }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '18px 24px' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 2 }}>Live activity feed</div>
                <div style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>Keep the plant-floor feed and counters ticking in real time.</div>
              </div>
              <ToggleC on={settings.liveFeed} onChange={v => { updateSettings({ liveFeed: v }); notify(`Live feed ${v ? 'resumed' : 'paused'}`); }} />
            </div>
          </div>

          <div style={{ ...card, padding: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 2 }}>Reset demo data</div>
              <div style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>Restore shipments, batches and invoices to the starting set.</div>
            </div>
            <button onClick={() => { resetAll(); notify('Workspace reset to defaults', 'warn'); }}
              style={{ fontSize: 13, padding: '9px 18px', background: 'rgba(184,75,68,0.12)', color: '#B84B44', border: '1px solid rgba(184,75,68,0.3)', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>
              Reset data
            </button>
          </div>
        </div>
      )}

      {/* Connections */}
      {tab === 'Connections' && (
        <div style={card}>
          {INTEGRATIONS.map((it, i) => (
            <div key={it.name} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '18px 24px', borderBottom: i < INTEGRATIONS.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <div style={{ width: 38, height: 38, borderRadius: 8, background: it.on ? 'rgba(76,195,138,0.12)' : 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: it.on ? 'var(--accent)' : 'var(--text-secondary)' }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 2 }}>{it.name}</div>
                <div style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>{it.desc}</div>
              </div>
              <span className={it.on ? 'badge badge-green' : 'badge badge-neutral'} style={{ fontSize: 10.5 }}>{it.status}</span>
              <Toggle on={it.on} />
            </div>
          ))}
        </div>
      )}

      {/* Notifications */}
      {tab === 'Notifications' && (
        <div style={card}>
          {NOTIFS.map((n, i) => (
            <div key={n.name} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 24px', borderBottom: i < NOTIFS.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 2 }}>{n.name}</div>
                <div style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>{n.desc}</div>
              </div>
              <Toggle on={n.on} />
            </div>
          ))}
        </div>
      )}

      {/* Team */}
      {tab === 'Team' && (
        <div style={card}>
          <div style={{ padding: '13px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{TEAM.length} people</span>
            <button className="btn-ghost" style={{ fontSize: 12, padding: '7px 14px' }}>+ Invite</button>
          </div>
          {TEAM.map((m, i) => (
            <div key={m.email} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 24px', borderBottom: i < TEAM.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(76,195,138,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span className="font-mono-custom" style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent)' }}>{m.initials}</span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)' }}>{m.name}</div>
                <div className="font-mono-custom" style={{ fontSize: 11.5, color: 'var(--text-secondary)' }}>{m.email}</div>
              </div>
              <span className="badge badge-neutral" style={{ fontSize: 10.5 }}>{m.role}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
