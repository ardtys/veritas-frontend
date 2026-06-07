'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface KPICardProps {
  label: string;
  value: string | number;
  sub?: string;
  trend?: 'up' | 'neutral';
  trendLabel?: string;
  accentColor?: string;
  index: number;
  icon: React.ReactNode;
  href?: string;        // makes the card a navigable, clickable tile
}

/** Tween a number toward its target so live updates read as motion, not jumps. */
function useCountUp(target: number, enabled: boolean) {
  const [display, setDisplay] = useState(target);
  const fromRef = useRef(target);
  useEffect(() => {
    if (!enabled) { setDisplay(target); return; }
    const from = fromRef.current;
    if (from === target) return;
    const start = performance.now();
    const dur = 600;
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(from + (target - from) * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
      else fromRef.current = target;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, enabled]);
  return display;
}

export default function KPICard(props: KPICardProps) {
  const { label, value, sub, trend, trendLabel, accentColor = 'var(--accent)', index, icon, href } = props;
  const isNum = typeof value === 'number';
  const display = useCountUp(isNum ? (value as number) : 0, isNum);
  const [hover, setHover] = useState(false);
  const [bump, setBump] = useState(false);

  // Pulse the value briefly whenever a numeric KPI changes (live tick).
  const prev = useRef(value);
  useEffect(() => {
    if (isNum && prev.current !== value) {
      setBump(true);
      const id = setTimeout(() => setBump(false), 450);
      prev.current = value;
      return () => clearTimeout(id);
    }
    prev.current = value;
  }, [value, isNum]);

  const inner = (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' as const, delay: index * 0.07 }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: 'var(--surface-1)',
        border: `1px solid ${hover && href ? 'var(--border-strong)' : 'var(--border)'}`,
        borderRadius: 8,
        padding: '20px 22px',
        display: 'flex',
        flexDirection: 'column',
        gap: 0,
        height: '100%',
        cursor: href ? 'pointer' : 'default',
        transform: hover && href ? 'translateY(-2px)' : 'translateY(0)',
        boxShadow: hover && href ? 'var(--shadow)' : 'none',
        transition: 'transform 180ms ease, box-shadow 200ms ease, border-color 180ms ease',
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
      <div
        className="font-mono-custom"
        style={{
          fontSize: 30, fontWeight: 700, lineHeight: 1, marginBottom: 8, letterSpacing: '-0.02em',
          color: bump ? accentColor : 'var(--text-primary)',
          transition: 'color 200ms ease',
        }}
      >
        {isNum ? display.toLocaleString('id-ID') : value}
      </div>

      {/* Sub / trend */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {trend === 'up' && <span style={{ fontSize: 11, color: 'var(--accent)' }}>↑</span>}
        {trendLabel && (
          <span className="font-mono-custom" style={{ fontSize: 11, color: trend === 'up' ? 'var(--accent)' : 'var(--text-secondary)' }}>
            {trendLabel}
          </span>
        )}
        {sub && !trendLabel && <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{sub}</span>}

        {href && (
          <span style={{ marginLeft: 'auto', fontSize: 13, color: 'var(--accent)', opacity: hover ? 1 : 0, transform: hover ? 'translateX(0)' : 'translateX(-4px)', transition: 'opacity 180ms ease, transform 180ms ease' }}>
            →
          </span>
        )}
      </div>
    </motion.div>
  );

  if (href) {
    return <Link href={href} style={{ textDecoration: 'none', display: 'block', height: '100%' }}>{inner}</Link>;
  }
  return inner;
}
