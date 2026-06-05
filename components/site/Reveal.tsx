'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

interface RevealProps {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  style?: React.CSSProperties;
  as?: 'div' | 'section' | 'span';
}

/**
 * Staggered fade-up reveal, 600ms, ease-out, the Bloomberg-terminal feel.
 * No bounce, no spring.
 */
export default function Reveal({ children, delay = 0, y = 16, className, style, as = 'div' }: RevealProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const MotionTag = motion[as];

  return (
    <MotionTag
      ref={ref}
      className={className}
      style={style}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: 'easeOut' as const, delay }}
    >
      {children}
    </MotionTag>
  );
}
