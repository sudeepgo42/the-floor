'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function ScenarioGlyph({ glyph, accent, size = 120 }: { glyph: string; accent: string; size?: number }) {
  if (glyph === 'sun') {
    return (
      <motion.svg width={size} height={size} viewBox="0 0 120 120" fill="none">
        <motion.circle cx="60" cy="60" r="20" fill={accent}
          animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }} />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
          <motion.line key={i} x1="60" y1="60"
            x2={60 + Math.cos((angle * Math.PI) / 180) * 50}
            y2={60 + Math.sin((angle * Math.PI) / 180) * 50}
            stroke={accent} strokeWidth="2" strokeLinecap="round"
            initial={{ opacity: 0.3 }} animate={{ opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 3, repeat: Infinity, delay: i * 0.15 }} />
        ))}
      </motion.svg>
    );
  }

  if (glyph === 'storm') {
    return (
      <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
        <motion.path
          d="M30 50 Q40 30, 60 35 Q85 25, 90 50 Q95 65, 80 70 L40 70 Q20 65, 30 50 Z"
          fill={accent} fillOpacity="0.2" stroke={accent} strokeWidth="2"
          animate={{ x: [0, -2, 2, 0] }} transition={{ duration: 0.8, repeat: Infinity }} />
        <motion.path d="M55 70 L48 88 L58 88 L52 105"
          stroke={accent} strokeWidth="3" strokeLinecap="round" fill="none"
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 1.5 }} />
        <motion.circle cx="35" cy="80" r="2" fill={accent} animate={{ y: [0, 30, 0], opacity: [0.8, 0, 0.8] }} transition={{ duration: 2, repeat: Infinity }} />
        <motion.circle cx="75" cy="85" r="2" fill={accent} animate={{ y: [0, 25, 0], opacity: [0.8, 0, 0.8] }} transition={{ duration: 2, repeat: Infinity, delay: 0.5 }} />
        <motion.circle cx="85" cy="80" r="2" fill={accent} animate={{ y: [0, 30, 0], opacity: [0.8, 0, 0.8] }} transition={{ duration: 2, repeat: Infinity, delay: 1 }} />
      </svg>
    );
  }

  if (glyph === 'rocket') {
    return (
      <motion.svg width={size} height={size} viewBox="0 0 120 120" fill="none"
        animate={{ y: [0, -5, 0] }} transition={{ duration: 3, repeat: Infinity }}>
        <path d="M60 20 L75 60 L60 75 L45 60 Z" fill={accent} />
        <circle cx="60" cy="50" r="5" fill="#0A0A0F" />
        <motion.path d="M55 75 L60 95 L65 75" fill={accent} fillOpacity="0.6"
          animate={{ scaleY: [1, 1.3, 1] }} transition={{ duration: 0.5, repeat: Infinity }} />
      </motion.svg>
    );
  }

  if (glyph === 'mountain') {
    return (
      <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
        <motion.path d="M10 90 L40 40 L60 65 L85 25 L110 90 Z"
          fill={accent} fillOpacity="0.25" stroke={accent} strokeWidth="2.5"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2 }} />
        <motion.circle cx="85" cy="25" r="3" fill={accent}
          animate={{ scale: [1, 1.5, 1] }} transition={{ duration: 2, repeat: Infinity }} />
      </svg>
    );
  }

  if (glyph === 'flame') {
    return (
      <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
        <motion.path
          d="M60 20 Q40 50, 50 75 Q40 85, 50 100 Q60 95, 60 90 Q70 95, 80 100 Q70 85, 80 70 Q90 50, 60 20 Z"
          fill={accent} fillOpacity="0.3" stroke={accent} strokeWidth="2"
          animate={{ scale: [1, 1.05, 1, 0.97, 1], rotate: [0, 1, -1, 0] }}
          transition={{ duration: 2, repeat: Infinity }} />
        <motion.path d="M60 50 Q55 65, 58 80 Q60 75, 60 70 Q63 80, 65 80 Q63 65, 60 50 Z"
          fill={accent}
          animate={{ scale: [1, 1.1, 0.95, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
      </svg>
    );
  }

  if (glyph === 'pulse') {
    return (
      <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
        <motion.path
          d="M10 60 L30 60 L40 30 L50 90 L60 45 L70 75 L80 55 L90 60 L110 60"
          stroke={accent} strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: [0, 1, 1, 0] }}
          transition={{ duration: 3, repeat: Infinity, times: [0, 0.5, 0.9, 1] }} />
        <motion.circle cx="60" cy="60" r="3" fill={accent}
          animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }} />
      </svg>
    );
  }

  // Default wave
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      <motion.path d="M10 60 Q30 40, 60 60 T110 60"
        stroke={accent} strokeWidth="3" fill="none"
        animate={{ d: ['M10 60 Q30 40, 60 60 T110 60', 'M10 60 Q30 80, 60 60 T110 60', 'M10 60 Q30 40, 60 60 T110 60'] }}
        transition={{ duration: 4, repeat: Infinity }} />
    </svg>
  );
}

export function Confetti({ trigger }: { trigger: number }) {
  const [pieces, setPieces] = useState<Array<{ id: number; left: number; color: string; delay: number }>>([]);
  const colors = ['#00E676', '#00D4FF', '#B47BFF', '#FFB020', '#FF3B5C'];

  useEffect(() => {
    if (trigger === 0) return;
    const newPieces = Array.from({ length: 60 }, (_, i) => ({
      id: trigger * 1000 + i,
      left: Math.random() * 100,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 0.4,
    }));
    setPieces(newPieces);
    const timeout = setTimeout(() => setPieces([]), 3000);
    return () => clearTimeout(timeout);
  }, [trigger]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map((p) => (
        <div key={p.id} className="confetti-dot"
          style={{ left: `${p.left}%`, top: '-20px', background: p.color, animationDelay: `${p.delay}s` }} />
      ))}
    </div>
  );
}

export function LiveDot({ color = '#00E676' }: { color?: string }) {
  return (
    <span className="relative inline-flex h-2 w-2">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60" style={{ background: color }} />
      <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: color }} />
    </span>
  );
}

export function Particles({ accent }: { accent: string }) {
  const particles = Array.from({ length: 12 }, (_, i) => i);
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((i) => (
        <motion.div key={i} className="absolute w-1 h-1 rounded-full"
          style={{ background: accent, left: `${(i * 8.3) % 100}%`, top: `${(i * 17) % 100}%` }}
          animate={{ y: [0, -30, 0], opacity: [0.2, 0.6, 0.2] }}
          transition={{ duration: 4 + (i % 3), repeat: Infinity, delay: i * 0.3, ease: 'easeInOut' }} />
      ))}
    </div>
  );
}
