'use client';

import { motion } from 'framer-motion';

interface KPICardProps {
  label: string;
  value: string | number;
  sub?: string;
  trend?: 'up' | 'neutral';
  trendLabel?: string;
  accentColor?: string;
  index: number;
  icon: React.ReactNode;
}

export default function KPICard({ label, value, sub, trend, trendLabel, accentColor = 'var(--accent)', index, icon }: KPICardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' as const, delay: index * 0.07 }}
      style={{
        background: 'var(--surface-1)',
        border: '1px solid var(--border)',
        borderRadius: 8,
        padding: '20px 22px',
        display: 'flex',
        flexDirection: 'column',
        gap: 0,
      }}
    >
      {/* Top row: label + icon */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <span className="font-mono-custom" style={{ fontSize: 11, color: 'var(--text-secondary)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          {label}
        </span>
        <div style={{ width: 32, height: 32, borderRadius: 7, background: `${accentColor}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          {icon}
        </div>
      </div>

      {/* Value */}
      <div className="font-mono-custom" style={{ fontSize: 30, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1, marginBottom: 8, letterSpacing: '-0.02em' }}>
        {typeof value === 'number' ? value.toLocaleString('id-ID') : value}
      </div>

      {/* Sub / trend */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {trend === 'up' && (
          <span style={{ fontSize: 11, color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: 2 }}>
            ↑
          </span>
        )}
        {trendLabel && (
          <span className="font-mono-custom" style={{ fontSize: 11, color: trend === 'up' ? 'var(--accent)' : 'var(--text-secondary)' }}>
            {trendLabel}
          </span>
        )}
        {sub && !trendLabel && (
          <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{sub}</span>
        )}
      </div>
    </motion.div>
  );
}
