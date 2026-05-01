'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Icon } from '@iconify/react';

const BRAND = {
  cream: '#FFFFE3',
  yellow: '#FFFF94',
  mint: '#82EDA6',
  green: '#06402B',
  shadow: '#03594D',
} as const;

interface CafeHeroAnimationProps {
  className?: string;
}

function HeroCup({ live }: { live: boolean }) {
  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <motion.div
        className="relative w-[68%] max-w-[168px] overflow-hidden rounded-[26px] border-[3px]"
        style={{
          aspectRatio: '4 / 5',
          borderColor: BRAND.green,
          background: `linear-gradient(168deg, ${BRAND.cream} 0%, ${BRAND.mint} 42%, ${BRAND.yellow} 100%)`,
          boxShadow: `inset 0 -14px 0 rgba(6, 64, 43, 0.07), 0 8px 0 ${BRAND.shadow}`,
        }}
        animate={
          live
            ? {
                scale: [0.93, 1.04, 0.93],
                rotate: [-1.4, 1.4, -1.4],
              }
            : { scale: 1, rotate: 0 }
        }
        transition={{ duration: 2.35, repeat: live ? Infinity : 0, ease: 'easeInOut' }}
      >
        <div
          className="absolute left-3 right-3 top-2 h-3 rounded-full opacity-90"
          style={{
            background: 'linear-gradient(90deg, transparent, #fff, transparent)',
            borderBottom: `2px solid ${BRAND.green}`,
          }}
        />

        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute bottom-full mb-0.5 w-1.5 rounded-full"
            style={{
              left: `calc(50% + ${(i - 1) * 10}px)`,
              marginLeft: -3,
              height: 14,
              backgroundColor: BRAND.green,
            }}
            animate={
              live
                ? {
                    y: [0, -18, 0],
                    opacity: [0.12, 0.42, 0.12],
                    scaleY: [0.6, 1.15, 0.6],
                  }
                : { opacity: 0.2 }
            }
            transition={{
              duration: 2.1,
              repeat: live ? Infinity : 0,
              ease: 'easeOut',
              delay: i * 0.32,
            }}
          />
        ))}

        <div className="absolute inset-0 flex items-center justify-center pt-3">
          <Icon icon="solar:cup-hot-bold" className="h-[38%] w-[38%]" style={{ color: BRAND.green }} />
        </div>

        {live && (
          <motion.div
            className="pointer-events-none absolute inset-0 overflow-hidden rounded-[22px]"
            initial={false}
          >
            <motion.div
              className="absolute inset-y-4 w-[28%] skew-x-[-18deg] bg-white/35"
              initial={{ left: '-45%' }}
              animate={{ left: '125%' }}
              transition={{
                duration: 2.6,
                repeat: Infinity,
                repeatDelay: 1.4,
                ease: 'easeInOut',
              }}
            />
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

export default function CafeHeroAnimation({ className = '' }: CafeHeroAnimationProps) {
  const reduceMotion = useReducedMotion();
  const live = reduceMotion !== true;

  return (
    <div
      className={`relative h-full w-full overflow-hidden ${className}`}
      style={{ background: `linear-gradient(180deg, ${BRAND.cream} 0%, ${BRAND.yellow} 38%, ${BRAND.mint} 100%)` }}
    >
      {live ? (
        <>
          <motion.div
            className="absolute left-[6%] top-[8%] h-[14%] w-[28%] rounded-full border-2 opacity-90"
            style={{ borderColor: BRAND.green, backgroundColor: '#fff' }}
            animate={{ x: [0, 10, 0] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute right-[4%] top-[5%] h-[11%] w-[22%] rounded-full border-2 opacity-85"
            style={{ borderColor: BRAND.green, backgroundColor: BRAND.cream }}
            animate={{ x: [0, -8, 0] }}
            transition={{ duration: 6.2, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
          />
        </>
      ) : (
        <>
          <div
            className="absolute left-[6%] top-[8%] h-[14%] w-[28%] rounded-full border-2 opacity-90"
            style={{ borderColor: BRAND.green, backgroundColor: '#fff' }}
          />
          <div
            className="absolute right-[4%] top-[5%] h-[11%] w-[22%] rounded-full border-2 opacity-85"
            style={{ borderColor: BRAND.green, backgroundColor: BRAND.cream }}
          />
        </>
      )}

      <div
        className="pointer-events-none absolute left-1/2 top-[42%] aspect-square w-[72%] max-w-[200px] -translate-x-1/2 -translate-y-1/2"
        style={{ filter: 'drop-shadow(0 6px 0 #03594D)' }}
      >
        <HeroCup live={live} />
      </div>

      {[
        { delay: 0, left: '8%', top: '52%', icon: 'solar:dollar-minimalistic-bold' as const },
        { delay: 0.4, left: '78%', top: '48%', icon: 'solar:star-bold' as const },
        { delay: 0.8, left: '18%', top: '72%', icon: 'solar:cup-hot-bold' as const },
        { delay: 1.1, left: '82%', top: '68%', icon: 'solar:dollar-minimalistic-bold' as const },
      ].map((c, i) => (
        <motion.div
          key={i}
          className="pointer-events-none absolute flex h-[26px] w-[26px] items-center justify-center rounded-full border-2 md:h-[22px] md:w-[22px]"
          style={{
            left: c.left,
            top: c.top,
            borderColor: BRAND.green,
            backgroundColor: BRAND.yellow,
            boxShadow: `2px 2px 0 ${BRAND.shadow}`,
          }}
          animate={
            live
              ? {
                  y: [0, -12, 0],
                  rotate: [0, 8, -6, 0],
                  transition: {
                    duration: 2.8,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: c.delay,
                  },
                }
              : false
          }
        >
          <Icon icon={c.icon} className="h-4 w-4 md:h-3 md:w-3" style={{ color: BRAND.green }} />
        </motion.div>
      ))}

      <motion.div
        className="pointer-events-none absolute left-[4%] top-[18%] z-[5] rounded-lg border-2 px-2 py-1"
        style={{
          backgroundColor: BRAND.yellow,
          borderColor: BRAND.green,
          boxShadow: `3px 3px 0 ${BRAND.shadow}`,
          transform: 'rotate(-6deg)',
        }}
        initial={live ? { y: -28, rotate: -14, opacity: 0 } : false}
        animate={live ? { y: 0, rotate: -6, opacity: 1 } : {}}
        transition={{ type: 'spring', stiffness: 260, damping: 16 }}
      >
        <span
          className="text-xs font-extrabold tabular-nums md:text-[9px]"
          style={{ fontFamily: 'var(--font-inter)', color: BRAND.green }}
        >
          $5.00
        </span>
      </motion.div>

      <motion.div
        className="pointer-events-none absolute right-[4%] top-[20%] z-[5]"
        initial={live ? { y: -32, rotate: 14, opacity: 0 } : false}
        animate={live ? { y: 0, rotate: 5, opacity: 1 } : {}}
        transition={{ type: 'spring', stiffness: 280, damping: 15 }}
      >
        <motion.div
          className="rounded-lg border-2 px-2 py-1"
          style={{
            backgroundColor: BRAND.mint,
            borderColor: BRAND.green,
            boxShadow: `3px 3px 0 ${BRAND.shadow}`,
          }}
          animate={live ? { scale: [1, 1.07, 1] } : {}}
          transition={{ duration: 1.45, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="flex flex-col items-center gap-0.5">
            <span
              className="text-xs font-extrabold tabular-nums md:text-[9px]"
              style={{ fontFamily: 'var(--font-inter)', color: BRAND.green }}
            >
              $4.25
            </span>
            <span
              className="rounded px-1 text-[10px] font-bold uppercase md:text-[6px]"
              style={{ backgroundColor: BRAND.cream, color: BRAND.green }}
            >
              -15%
            </span>
          </div>
        </motion.div>
      </motion.div>

      {live && (
        <div className="pointer-events-none absolute bottom-[12%] left-1/2 flex -translate-x-1/2 items-center justify-center">
          <motion.span
            className="absolute rounded-full border-2"
            style={{ width: 28, height: 28, borderColor: BRAND.green }}
            animate={{ scale: [1, 2.4], opacity: [0.45, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
          />
          <motion.span
            className="absolute rounded-full border-2"
            style={{ width: 28, height: 28, borderColor: BRAND.green }}
            animate={{ scale: [1, 2.4], opacity: [0.35, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut', delay: 0.5 }}
          />
          <span
            className="relative h-3 w-3 rounded-full border-2"
            style={{ backgroundColor: BRAND.mint, borderColor: BRAND.green }}
          />
        </div>
      )}
    </div>
  );
}
