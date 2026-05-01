'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion, animate, useReducedMotion } from 'framer-motion';
import { Icon } from '@iconify/react';

const BRAND = {
  cream: '#FFFFE3',
  yellow: '#FFFF94',
  mint: '#82EDA6',
  green: '#06402B',
  shadow: '#03594D',
} as const;

interface CafeCelebrationProps {
  pick: 'accept' | 'reject';
  className?: string;
}

function mulberry32(seed: number) {
  return () => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export default function CafeCelebration({ pick, className = '' }: CafeCelebrationProps) {
  const reduceMotion = useReducedMotion();
  const live = reduceMotion !== true;
  const [metric, setMetric] = useState(0);

  const target = pick === 'accept' ? 12 : 5;
  const label = pick === 'accept' ? 'Market share' : 'Margin kept';

  useEffect(() => {
    if (!live) {
      setMetric(target);
      return;
    }
    const controls = animate(0, target, {
      duration: 0.85,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setMetric(Math.round(v)),
    });
    return () => controls.stop();
  }, [target, live]);

  const confetti = useMemo(() => {
    const rand = mulberry32(pick === 'accept' ? 42 : 99);
    return Array.from({ length: 20 }, (_, i) => {
      const angle = rand() * Math.PI * 2;
      const dist = 38 + rand() * 52;
      const colors = [BRAND.yellow, BRAND.mint, BRAND.green, BRAND.cream];
      const color = colors[i % colors.length];
      const w = 4 + rand() * 5;
      const h = 6 + rand() * 8;
      const rot = rand() * 360;
      return { angle, dist, color, w, h, rot, delay: rand() * 0.08 };
    });
  }, [pick]);

  const icon =
    pick === 'accept' ? ('solar:cup-hot-bold' as const) : ('solar:shield-check-bold' as const);

  return (
    <div
      className={`relative w-full h-full overflow-hidden ${className}`}
      style={{
        background: `radial-gradient(120% 80% at 50% 20%, ${BRAND.yellow} 0%, ${BRAND.mint} 45%, ${BRAND.cream} 100%)`,
      }}
    >
      {live ? (
        confetti.map((c, i) => (
          <motion.span
            key={i}
            className="absolute left-1/2 top-[40%] rounded-sm pointer-events-none"
            style={{
              width: c.w,
              height: c.h,
              marginLeft: -c.w / 2,
              marginTop: -c.h / 2,
              backgroundColor: c.color,
              border: `1px solid ${BRAND.green}`,
              boxShadow: `1px 1px 0 ${BRAND.shadow}`,
            }}
            initial={{ x: 0, y: 0, opacity: 1, rotate: c.rot, scale: 1 }}
            animate={{
              x: Math.cos(c.angle) * c.dist,
              y: Math.sin(c.angle) * c.dist,
              opacity: [1, 1, 0],
              rotate: c.rot + (pick === 'accept' ? 220 : -200),
              scale: [1, 1.1, 0.6],
            }}
            transition={{
              duration: 1.15,
              delay: c.delay,
              ease: [0.22, 1, 0.36, 1],
            }}
          />
        ))
      ) : null}

      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-3 pointer-events-none"
        initial={live ? { opacity: 0 } : false}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.25 }}
      >
        <motion.div
          initial={live ? { scale: 0.35, rotate: -18, y: 16 } : false}
          animate={{ scale: 1, rotate: 0, y: 0 }}
          transition={{ type: 'spring', stiffness: 280, damping: 14 }}
          className="rounded-2xl border-2 p-2.5"
          style={{
            backgroundColor: BRAND.cream,
            borderColor: BRAND.green,
            boxShadow: `4px 4px 0 ${BRAND.shadow}`,
          }}
        >
          <Icon icon={icon} className="h-12 w-12 md:h-10 md:w-10" style={{ color: BRAND.green }} />
        </motion.div>

        <motion.div
          className="rounded-xl border-2 px-3 py-2 text-center"
          style={{
            backgroundColor: BRAND.yellow,
            borderColor: BRAND.green,
            boxShadow: `3px 3px 0 ${BRAND.shadow}`,
          }}
          initial={live ? { y: 14, opacity: 0 } : false}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 240, damping: 16, delay: 0.08 }}
        >
          <p
            className="mb-0.5 text-xs font-bold uppercase tracking-wide md:text-[7px]"
            style={{ fontFamily: 'var(--font-inter)', color: BRAND.green }}
          >
            {label}
          </p>
          <p
            className="text-2xl font-black tabular-nums leading-none md:text-xl"
            style={{ fontFamily: 'var(--font-luckiest-guy)', color: BRAND.green, letterSpacing: '0.04em' }}
          >
            +{metric}
            <span
              className="ml-0.5 text-xs font-bold md:text-[10px]"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              %
            </span>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
