'use client';

import { motion } from 'framer-motion';

interface PageHeaderProps {
  label: string;
  title: React.ReactNode;
  lead?: string;
}

export default function PageHeader({ label, title, lead }: PageHeaderProps) {
  return (
    <header style={{ paddingTop: 132, paddingBottom: 56, background: 'linear-gradient(180deg, var(--surface-1) 0%, #fff 100%)', borderBottom: '1px solid var(--border)' }}>
      <div className="veritas-container" style={{ textAlign: 'center', maxWidth: 760, marginLeft: 'auto', marginRight: 'auto' }}>
        <motion.span
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="section-label" style={{ display: 'inline-block', marginBottom: 16 }}
        >
          {label}
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.05 }}
          className="font-display"
          style={{ fontSize: 'clamp(34px,4.4vw,54px)', fontWeight: 800, lineHeight: 1.1, color: 'var(--text-primary)', marginBottom: lead ? 22 : 0 }}
        >
          {title}
        </motion.h1>
        {lead && (
          <motion.p
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
            style={{ fontSize: 18.5, lineHeight: 1.7, color: 'var(--text-secondary)', maxWidth: 600, margin: '0 auto' }}
          >
            {lead}
          </motion.p>
        )}
      </div>
    </header>
  );
}
