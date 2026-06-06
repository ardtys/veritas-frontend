'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, Cell, PieChart, Pie,
} from 'recharts';
import { formatIDRCompact } from '@/lib/utils';

const PERIODS = ['7 days', '30 days', '3 months', '12 months'];

const VOLUME = [
  { m: 'Jan', events: 6800, sealed: 6720 },
  { m: 'Feb', events: 7400, sealed: 7330 },
  { m: 'Mar', events: 8100, sealed: 8010 },
  { m: 'Apr', events: 9600, sealed: 9510 },
  { m: 'Mei', events: 10800, sealed: 10720 },
  { m: 'Jun', events: 12400, sealed: 12330 },
];

const QUALITY = [
  { m: 'Jan', rate: 86 }, { m: 'Feb', rate: 88 }, { m: 'Mar', rate: 87 },
  { m: 'Apr', rate: 91 }, { m: 'Mei', rate: 94 }, { m: 'Jun', rate: 96 },
];

const SETTLEMENT = [
  { bucket: '< 3s', count: 184 },
  { bucket: '3–10s', count: 42 },
  { bucket: '10–60s', count: 18 },
  { bucket: '> 60s', count: 6 },
];

const EVENT_MIX = [
  { name: 'Shipments', value: 38, color: '#6B6E68' },
  { name: 'Quality checks', value: 31, color: '#4CC38A' },
  { name: 'Invoices', value: 18, color: '#C9853A' },
  { name: 'Payments', value: 13, color: '#3B82F6' },
];

const TOP_ROUTES = [
  { route: 'Surabaya → Jakarta', vol: 45, onTime: 89 },
  { route: 'Bandung → Makassar', vol: 23, onTime: 91 },
  { route: 'Medan → Semarang',   vol: 18, onTime: 83 },
  { route: 'Jakarta → Balikpapan', vol: 12, onTime: 100 },
];

const card: React.CSSProperties = { background: 'var(--surface-1)', border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' };
const cardHead: React.CSSProperties = { padding: '13px 20px', borderBottom: '1px solid var(--border)' };
const tooltipStyle = { backgroundColor: '#191D18', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 6, fontFamily: 'var(--font-jetbrains)', fontSize: 11.5, color: '#E4E1D8' };

export default function AnalyticsPage() {
  const [period, setPeriod] = useState('12 months');

  return (
    <div style={{ padding: '28px 32px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 className="font-display" style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>Analytics</h1>
          <span style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>Trends across deliveries, quality, and payments</span>
        </div>
        <div style={{ display: 'flex', gap: 4, background: 'var(--surface-1)', border: '1px solid var(--border)', borderRadius: 8, padding: 4 }}>
          {PERIODS.map(p => (
            <button key={p} onClick={() => setPeriod(p)}
              style={{
                fontSize: 12, padding: '6px 14px', borderRadius: 5, border: 'none', cursor: 'pointer',
                fontFamily: 'var(--font-dm-sans), sans-serif',
                background: period === p ? 'rgba(76,195,138,0.14)' : 'transparent',
                color: period === p ? 'var(--accent)' : 'var(--text-secondary)',
                transition: 'all 150ms',
              }}>
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* KPI row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 16 }}>
        {[
          { label: 'Total events', value: '55,100', delta: '+18% vs last period', up: true },
          { label: 'On-time delivery', value: '90.4%', delta: '+2.1 pts', up: true },
          { label: 'Avg. quality score', value: '93', delta: '+4 pts', up: true },
          { label: 'Total paid', value: formatIDRCompact(8_420_000_000), delta: '+12%', up: true },
        ].map((k, i) => (
          <motion.div key={k.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' as const, delay: i * 0.05 }}
            style={{ ...card, padding: '18px 20px' }}>
            <div className="font-mono-custom" style={{ fontSize: 10.5, color: 'var(--text-secondary)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 10 }}>{k.label}</div>
            <div className="font-mono-custom" style={{ fontSize: 26, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>{k.value}</div>
            <div style={{ fontSize: 11.5, color: k.up ? 'var(--accent)' : 'var(--red)' }}>↑ {k.delta}</div>
          </motion.div>
        ))}
      </div>

      {/* Row: volume area + quality line */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 16, marginBottom: 16 }}>
        <div style={card}>
          <div style={cardHead}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>Records sealed per month</div>
            <div className="font-mono-custom" style={{ fontSize: 10.5, color: 'var(--text-secondary)' }}>Total events vs. successfully sealed</div>
          </div>
          <div style={{ padding: '16px 16px 8px' }}>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={VOLUME} margin={{ top: 4, right: 8, bottom: 0, left: -16 }}>
                <defs>
                  <linearGradient id="vg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4CC38A" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#4CC38A" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="2 4" stroke="rgba(255,255,255,0.04)" vertical={false} />
                <XAxis dataKey="m" tick={{ fontFamily: 'var(--font-jetbrains)', fontSize: 10, fill: '#6B6E68' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontFamily: 'var(--font-jetbrains)', fontSize: 10, fill: '#6B6E68' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: 'rgba(255,255,255,0.07)' }} />
                <Area type="monotone" dataKey="events" stroke="#4CC38A" strokeWidth={2} fill="url(#vg)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={card}>
          <div style={cardHead}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>Quality pass rate</div>
            <div className="font-mono-custom" style={{ fontSize: 10.5, color: 'var(--text-secondary)' }}>Climbing toward target (%)</div>
          </div>
          <div style={{ padding: '16px 16px 8px' }}>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={QUALITY} margin={{ top: 4, right: 8, bottom: 0, left: -16 }}>
                <CartesianGrid strokeDasharray="2 4" stroke="rgba(255,255,255,0.04)" vertical={false} />
                <XAxis dataKey="m" tick={{ fontFamily: 'var(--font-jetbrains)', fontSize: 10, fill: '#6B6E68' }} axisLine={false} tickLine={false} />
                <YAxis domain={[80, 100]} tick={{ fontFamily: 'var(--font-jetbrains)', fontSize: 10, fill: '#6B6E68' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: 'rgba(255,255,255,0.07)' }} formatter={v => [`${v}%`, 'Pass rate']} />
                <Line type="monotone" dataKey="rate" stroke="#4CC38A" strokeWidth={2} dot={{ r: 3, fill: '#4CC38A', strokeWidth: 0 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row: settlement bars + event mix pie + top routes */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.2fr', gap: 16 }}>
        <div style={card}>
          <div style={cardHead}><span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Payment speed</span></div>
          <div style={{ padding: '16px 12px 8px' }}>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={SETTLEMENT} margin={{ top: 4, right: 8, bottom: 0, left: -20 }} barSize={26}>
                <XAxis dataKey="bucket" tick={{ fontFamily: 'var(--font-jetbrains)', fontSize: 9.5, fill: '#6B6E68' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontFamily: 'var(--font-jetbrains)', fontSize: 9.5, fill: '#6B6E68' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                <Bar dataKey="count" radius={[3,3,0,0]}>
                  {SETTLEMENT.map((s, i) => <Cell key={i} fill={i === 0 ? '#4CC38A' : 'rgba(76,195,138,0.4)'} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={card}>
          <div style={cardHead}><span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>What we track</span></div>
          <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <ResponsiveContainer width="50%" height={150}>
              <PieChart>
                <Pie data={EVENT_MIX} dataKey="value" innerRadius={36} outerRadius={56} paddingAngle={2} stroke="none">
                  {EVENT_MIX.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} formatter={(v, n) => [`${v}%`, n]} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {EVENT_MIX.map(e => (
                <div key={e.name} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <span style={{ width: 8, height: 8, borderRadius: 2, background: e.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 11.5, color: 'var(--text-secondary)', flex: 1 }}>{e.name}</span>
                  <span className="font-mono-custom" style={{ fontSize: 11.5, color: 'var(--text-primary)' }}>{e.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={card}>
          <div style={cardHead}><span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Busiest routes</span></div>
          <div className="table-scroll"><table className="dashboard-table">
            <thead><tr><th>Route</th><th>Trips</th><th>On-time</th></tr></thead>
            <tbody>
              {TOP_ROUTES.map(r => (
                <tr key={r.route}>
                  <td style={{ fontSize: 12.5, color: 'var(--text-primary)' }}>{r.route}</td>
                  <td><span className="font-mono-custom" style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>{r.vol}</span></td>
                  <td>
                    <span className="font-mono-custom" style={{ fontSize: 12, color: r.onTime >= 90 ? 'var(--accent)' : 'var(--amber)' }}>{r.onTime}%</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table></div>
        </div>
      </div>
    </div>
  );
}
