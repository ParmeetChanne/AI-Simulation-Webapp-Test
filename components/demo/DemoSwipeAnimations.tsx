'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion, animate, useReducedMotion } from 'framer-motion';
import { Icon } from '@iconify/react';
import CafeHeroAnimation from '@/components/demo/CafeHeroAnimation';
import CafeCelebration from '@/components/demo/CafeCelebration';

const BRAND = {
  cream: '#FFFFE3',
  yellow: '#FFFF94',
  mint: '#82EDA6',
  green: '#06402B',
  shadow: '#03594D',
} as const;

export type DemoSwipeVisualVariant = 0 | 1 | 2 | 3;

function mulberry32(seed: number) {
  return () => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Round 2: rush / staffing — queue bars, team pulse, clock */
function StaffingRushHero({ className = '' }: { className?: string }) {
  const reduceMotion = useReducedMotion();
  const live = reduceMotion !== true;

  return (
    <div
      className={`relative h-full w-full overflow-hidden ${className}`}
      style={{
        background: `linear-gradient(165deg, ${BRAND.yellow} 0%, ${BRAND.cream} 35%, ${BRAND.mint} 100%)`,
      }}
    >
      {live && (
        <motion.div
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            background: `repeating-linear-gradient(90deg, transparent, transparent 12px, ${BRAND.green}22 12px, ${BRAND.green}22 14px)`,
          }}
          animate={{ x: [0, -28, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
        />
      )}

      {[0, 1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="pointer-events-none absolute bottom-[18%] flex flex-col items-center gap-0.5"
          style={{ left: `${22 + i * 18}%`, transform: 'translateX(-50%)' }}
          animate={
            live
              ? { scaleY: [0.35, 1, 0.5, 0.9, 0.35], opacity: [0.6, 1, 0.7, 1, 0.6] }
              : { scaleY: 0.6, opacity: 0.8 }
          }
          transition={{ duration: 1.8 + i * 0.15, repeat: live ? Infinity : 0, ease: 'easeInOut', delay: i * 0.12 }}
        >
          <div
            className="w-2 rounded-t border-2 border-b-0 md:w-1.5"
            style={{
              height: 28 + i * 6,
              backgroundColor: i % 2 === 0 ? BRAND.mint : BRAND.yellow,
              borderColor: BRAND.green,
              boxShadow: `2px 0 0 ${BRAND.shadow}`,
            }}
          />
        </motion.div>
      ))}

      <div className="pointer-events-none absolute left-1/2 top-[38%] w-[70%] max-w-[180px] -translate-x-1/2 -translate-y-1/2">
        <motion.div
          className="relative mx-auto flex aspect-square w-full max-w-[140px] items-center justify-center rounded-3xl border-[3px]"
          style={{
            borderColor: BRAND.green,
            backgroundColor: BRAND.cream,
            boxShadow: `0 8px 0 ${BRAND.shadow}, inset 0 -8px 0 rgba(6,64,43,0.06)`,
          }}
          animate={live ? { scale: [1, 1.04, 1], rotate: [-2, 2, -2] } : {}}
          transition={{ duration: 2.2, repeat: live ? Infinity : 0, ease: 'easeInOut' }}
        >
          {live && (
            <motion.span
              className="absolute inset-[-6px] rounded-[28px] border-2 border-dashed opacity-60"
              style={{ borderColor: BRAND.green }}
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
            />
          )}
          <Icon icon="solar:users-group-rounded-bold" className="h-[42%] w-[42%]" style={{ color: BRAND.green }} />
        </motion.div>
      </div>

      <motion.div
        className="pointer-events-none absolute left-[8%] top-[14%] rounded-2xl border-2 px-2 py-1.5 md:px-1.5 md:py-1"
        style={{
          backgroundColor: BRAND.cream,
          borderColor: BRAND.green,
          boxShadow: `3px 3px 0 ${BRAND.shadow}`,
        }}
        animate={live ? { y: [0, -5, 0] } : {}}
        transition={{ duration: 2.4, repeat: live ? Infinity : 0, ease: 'easeInOut' }}
      >
        <Icon icon="solar:clock-circle-bold" className="h-6 w-6 md:h-5 md:w-5" style={{ color: BRAND.green }} />
      </motion.div>

      <motion.div
        className="pointer-events-none absolute right-[6%] top-[16%] rounded-xl border-2 px-2 py-1"
        style={{
          backgroundColor: BRAND.mint,
          borderColor: BRAND.green,
          boxShadow: `2px 2px 0 ${BRAND.shadow}`,
        }}
        animate={live ? { scale: [1, 1.12, 1] } : {}}
        transition={{ duration: 1.2, repeat: live ? Infinity : 0, ease: 'easeInOut' }}
      >
        <span className="text-xs font-extrabold md:text-[9px]" style={{ color: BRAND.green, fontFamily: 'var(--font-inter)' }}>
          PEAK
        </span>
      </motion.div>

      {live && (
        <div className="pointer-events-none absolute bottom-[10%] left-1/2 flex -translate-x-1/2 gap-1">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="h-2 w-2 rounded-full border"
              style={{ backgroundColor: BRAND.yellow, borderColor: BRAND.green }}
              animate={{ y: [0, -6, 0], opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.2, ease: 'easeInOut' }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/** Round 3: delivery / platform — phone frame, scooter route, commission chip */
function DeliveryMapHero({ className = '' }: { className?: string }) {
  const reduceMotion = useReducedMotion();
  const live = reduceMotion !== true;

  return (
    <div
      className={`relative h-full w-full overflow-hidden ${className}`}
      style={{
        background: `linear-gradient(200deg, ${BRAND.mint} 0%, ${BRAND.cream} 45%, ${BRAND.yellow} 100%)`,
      }}
    >
      {live && (
        <>
          <motion.div
            className="pointer-events-none absolute left-[-20%] top-[30%] h-[3px] w-[140%] rounded-full opacity-25"
            style={{ background: `linear-gradient(90deg, transparent, ${BRAND.green}, transparent)` }}
            animate={{ x: ['-10%', '10%'] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="pointer-events-none absolute left-[-20%] top-[55%] h-[2px] w-[140%] rounded-full opacity-20"
            style={{ background: `linear-gradient(90deg, transparent, ${BRAND.green}, transparent)` }}
            animate={{ x: ['10%', '-10%'] }}
            transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        </>
      )}

      <div className="pointer-events-none absolute left-1/2 top-[40%] w-[58%] max-w-[150px] -translate-x-1/2 -translate-y-1/2">
        <motion.div
          className="relative rounded-[1.35rem] border-[3px] p-2"
          style={{
            borderColor: BRAND.green,
            backgroundColor: BRAND.cream,
            boxShadow: `0 10px 0 ${BRAND.shadow}`,
            aspectRatio: '10 / 16',
          }}
          animate={live ? { y: [0, -4, 0] } : {}}
          transition={{ duration: 3, repeat: live ? Infinity : 0, ease: 'easeInOut' }}
        >
          <div
            className="relative h-[72%] w-full overflow-hidden rounded-xl border-2"
            style={{ borderColor: BRAND.green, backgroundColor: BRAND.yellow }}
          >
            <motion.div
              className="absolute left-[8%] top-1/2 -translate-y-1/2"
              animate={live ? { x: [0, 72, 0] } : { x: 0 }}
              transition={{ duration: 3.2, repeat: live ? Infinity : 0, ease: 'easeInOut' }}
            >
              <Icon icon="solar:scooter-bold" className="h-8 w-8 md:h-7 md:w-7" style={{ color: BRAND.green }} />
            </motion.div>
            {live && (
              <svg className="absolute inset-0 h-full w-full opacity-35" preserveAspectRatio="none">
                <motion.path
                  d="M 20 75 Q 50 40 85 65"
                  fill="none"
                  stroke={BRAND.green}
                  strokeWidth="3"
                  strokeDasharray="6 6"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                />
              </svg>
            )}
          </div>
          <div className="mt-1 flex justify-center gap-1">
            {[0, 1, 2].map((i) => (
              <span key={i} className="h-1 w-1 rounded-full" style={{ backgroundColor: BRAND.green, opacity: 0.35 + i * 0.2 }} />
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div
        className="pointer-events-none absolute left-[6%] top-[20%] flex items-center gap-1 rounded-full border-2 px-2 py-1"
        style={{
          backgroundColor: BRAND.yellow,
          borderColor: BRAND.green,
          boxShadow: `2px 2px 0 ${BRAND.shadow}`,
        }}
        animate={live ? { rotate: [-4, 4, -4] } : {}}
        transition={{ duration: 2.8, repeat: live ? Infinity : 0, ease: 'easeInOut' }}
      >
        <Icon icon="solar:map-point-bold" className="h-4 w-4 md:h-3.5 md:w-3.5" style={{ color: BRAND.green }} />
        <span className="text-xs font-bold md:text-[9px]" style={{ color: BRAND.green, fontFamily: 'var(--font-inter)' }}>
          2.1 mi
        </span>
      </motion.div>

      <motion.div
        className="pointer-events-none absolute right-[5%] top-[18%] rounded-lg border-2 px-2 py-1.5"
        style={{
          backgroundColor: BRAND.cream,
          borderColor: BRAND.green,
          boxShadow: `3px 3px 0 ${BRAND.shadow}`,
        }}
        animate={live ? { scale: [1, 1.08, 1] } : {}}
        transition={{ duration: 1.6, repeat: live ? Infinity : 0, ease: 'easeInOut' }}
      >
        <span className="text-xs font-black md:text-[9px]" style={{ color: BRAND.green, fontFamily: 'var(--font-inter)' }}>
          28% fee
        </span>
      </motion.div>
    </div>
  );
}

/** Round 4: beans, cups & input costs — high-contrast motion (readable on cream/yellow) */
function CostPriceHero({ className = '' }: { className?: string }) {
  const reduceMotion = useReducedMotion();
  const live = reduceMotion !== true;

  return (
    <div
      className={`relative h-full min-h-[100px] w-full overflow-hidden ${className}`}
      style={{
        background: `linear-gradient(185deg, #fffef0 0%, ${BRAND.yellow} 42%, ${BRAND.mint} 100%)`,
      }}
    >
      {/* Drifting grid — always visible “activity” */}
      <motion.div
        className="pointer-events-none absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage: `linear-gradient(${BRAND.green} 1.5px, transparent 1.5px), linear-gradient(90deg, ${BRAND.green} 1.5px, transparent 1.5px)`,
          backgroundSize: '22px 22px',
        }}
        animate={live ? { backgroundPosition: ['0 0', '22px 22px'] } : {}}
        transition={{ duration: 14, repeat: live ? Infinity : 0, ease: 'linear' }}
      />

      {/* Supplier cost chips — white fill so they pop */}
      {[
        { i: 0, left: '6%', top: '10%', price: '$2.40', sub: 'beans' },
        { i: 1, left: '38%', top: '6%', price: '$0.18', sub: 'cup' },
        { i: 2, left: '72%', top: '12%', price: '+6%', sub: 'freight' },
      ].map(({ i, left, top, price, sub }) => (
        <motion.div
          key={i}
          className="pointer-events-none absolute z-[1] rounded-xl border-[2.5px] px-2 py-1 shadow-md md:px-1.5 md:py-0.5"
          style={{
            left,
            top,
            backgroundColor: '#ffffff',
            borderColor: BRAND.green,
            boxShadow: `3px 3px 0 ${BRAND.shadow}`,
          }}
          animate={
            live
              ? {
                  y: [0, -8 - i * 2, 0],
                  rotate: [-6 + i * 5, -2 + i * 5, -6 + i * 5],
                }
              : { y: 0, rotate: -6 + i * 5 }
          }
          transition={{ duration: 2.4 + i * 0.25, repeat: live ? Infinity : 0, ease: 'easeInOut', delay: i * 0.15 }}
        >
          <span
            className="block text-sm font-black leading-none md:text-[10px]"
            style={{ color: BRAND.green, fontFamily: 'var(--font-inter)' }}
          >
            {price}
          </span>
          <span
            className="text-[10px] font-bold uppercase opacity-80 md:text-[6px]"
            style={{ color: BRAND.green, fontFamily: 'var(--font-inter)' }}
          >
            {sub}
          </span>
        </motion.div>
      ))}

      {/* Center: cup + bean shapes (clear “cafe inputs” story) */}
      <div className="pointer-events-none absolute left-1/2 top-[48%] z-[2] flex w-[92%] max-w-[200px] -translate-x-1/2 -translate-y-1/2 items-center justify-center gap-2">
        <motion.div
          className="flex flex-col items-center gap-1"
          animate={live ? { y: [0, -5, 0] } : {}}
          transition={{ duration: 1.9, repeat: live ? Infinity : 0, ease: 'easeInOut' }}
        >
          <motion.div
            aria-hidden
            className="rounded-full border-2 border-[#06402B] shadow-sm"
            style={{
              width: 11,
              height: 18,
              background: `linear-gradient(145deg, #2d1810 0%, ${BRAND.green} 100%)`,
            }}
            animate={
              live ? { rotate: [-18, -8, -18], scale: [1, 1.08, 1] } : { rotate: -18, scale: 1 }
            }
            transition={{ duration: 2.1, repeat: live ? Infinity : 0, ease: 'easeInOut' }}
          />
          <motion.div
            aria-hidden
            className="rounded-full border-2 border-[#06402B]"
            style={{
              width: 10,
              height: 16,
              background: `linear-gradient(145deg, #3d2418 0%, #0d3d28 95%)`,
            }}
            animate={live ? { rotate: [14, 22, 14], y: [0, 3, 0] } : { rotate: 14, y: 0 }}
            transition={{ duration: 1.7, repeat: live ? Infinity : 0, ease: 'easeInOut', delay: 0.2 }}
          />
        </motion.div>

        <motion.div
          className="relative flex items-center justify-center rounded-[1.75rem] border-[3px] px-4 py-3 md:px-3 md:py-2.5"
          style={{
            borderColor: BRAND.green,
            backgroundColor: BRAND.cream,
            boxShadow: `0 10px 0 ${BRAND.shadow}, inset 0 -6px 0 rgba(6,64,43,0.06)`,
          }}
          animate={live ? { scale: [1, 1.06, 1] } : {}}
          transition={{ duration: 2.2, repeat: live ? Infinity : 0, ease: 'easeInOut' }}
        >
          {live && (
            <motion.div
              className="pointer-events-none absolute -top-1 left-1/2 flex -translate-x-1/2 gap-1"
              initial={false}
            >
              {[0, 1, 2].map((s) => (
                <motion.span
                  key={s}
                  className="w-1 rounded-full bg-[#06402B]/70"
                  style={{ height: 10 + s * 3 }}
                  animate={{ y: [0, -7, 0], opacity: [0.35, 0.95, 0.35] }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: s * 0.15, ease: 'easeInOut' }}
                />
              ))}
            </motion.div>
          )}
          <Icon icon="solar:cup-hot-bold" className="h-14 w-14 md:h-11 md:w-11" style={{ color: BRAND.green }} />
        </motion.div>

        <motion.div
          className="flex flex-col items-center"
          animate={live ? { y: [0, -4, 0] } : {}}
          transition={{ duration: 2.3, repeat: live ? Infinity : 0, ease: 'easeInOut', delay: 0.1 }}
        >
          <Icon icon="solar:arrow-up-bold" className="h-7 w-7 md:h-5 md:w-5" style={{ color: BRAND.green }} />
          <span
            className="mt-0.5 rounded-md border-2 px-1.5 py-0.5 text-[10px] font-black uppercase md:text-[7px]"
            style={{
              backgroundColor: BRAND.yellow,
              borderColor: BRAND.green,
              color: BRAND.green,
              fontFamily: 'var(--font-inter)',
            }}
          >
            COGS
          </span>
        </motion.div>
      </div>

      {/* Bottom compare bar — stays inside hero, never clipped */}
      <motion.div
        className="pointer-events-none absolute bottom-[6%] left-1/2 z-[1] flex w-[88%] max-w-[220px] -translate-x-1/2 items-center justify-between gap-2 rounded-xl border-[2.5px] px-2 py-1.5 md:py-1"
        style={{
          backgroundColor: '#ffffff',
          borderColor: BRAND.green,
          boxShadow: `3px 3px 0 ${BRAND.shadow}`,
        }}
        animate={live ? { y: [0, -3, 0] } : {}}
        transition={{ duration: 2.8, repeat: live ? Infinity : 0, ease: 'easeInOut' }}
      >
        <div className="flex items-center gap-1">
          <Icon icon="solar:box-bold" className="h-5 w-5 shrink-0 md:h-4 md:w-4" style={{ color: BRAND.green }} />
          <span
            className="text-xs font-bold leading-tight md:text-[8px]"
            style={{ color: BRAND.green, fontFamily: 'var(--font-inter)' }}
          >
            Inputs up
          </span>
        </div>
        <motion.div
          animate={live ? { x: [0, 4, 0], opacity: [0.85, 1, 0.85] } : {}}
          transition={{ duration: 1.5, repeat: live ? Infinity : 0, ease: 'easeInOut' }}
        >
          <Icon icon="solar:arrow-right-bold" className="h-5 w-5 md:h-4 md:w-4" style={{ color: BRAND.green }} />
        </motion.div>
        <div className="flex items-center gap-1">
          <Icon icon="solar:tag-price-bold" className="h-5 w-5 shrink-0 md:h-4 md:w-4" style={{ color: BRAND.green }} />
          <span
            className="text-xs font-bold leading-tight md:text-[8px]"
            style={{ color: BRAND.green, fontFamily: 'var(--font-inter)' }}
          >
            Menu?
          </span>
        </div>
      </motion.div>
    </div>
  );
}

function VariantCelebration({
  pick,
  className,
  seedBase,
  acceptIcon,
  rejectIcon,
  acceptLabel,
  rejectLabel,
  acceptTarget,
  rejectTarget,
  acceptSuffix,
  rejectSuffix,
  gradient,
}: {
  pick: 'accept' | 'reject';
  className?: string;
  seedBase: number;
  acceptIcon: string;
  rejectIcon: string;
  acceptLabel: string;
  rejectLabel: string;
  acceptTarget: number;
  rejectTarget: number;
  acceptSuffix: string;
  rejectSuffix: string;
  gradient: string;
}) {
  const reduceMotion = useReducedMotion();
  const live = reduceMotion !== true;
  const [metric, setMetric] = useState(0);

  const target = pick === 'accept' ? acceptTarget : rejectTarget;
  const label = pick === 'accept' ? acceptLabel : rejectLabel;
  const suffix = pick === 'accept' ? acceptSuffix : rejectSuffix;

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
    const rand = mulberry32(pick === 'accept' ? seedBase : seedBase + 7);
    const n = 18;
    return Array.from({ length: n }, (_, i) => {
      const angle = rand() * Math.PI * 2;
      const dist = pick === 'accept' ? 32 + rand() * 55 : 28 + rand() * 40;
      const colors = [BRAND.yellow, BRAND.mint, BRAND.green, BRAND.cream];
      const color = colors[i % colors.length];
      const w = 3 + rand() * 6;
      const h = 5 + rand() * 9;
      const rot = rand() * 360;
      return { angle, dist, color, w, h, rot, delay: rand() * 0.1 };
    });
  }, [pick, seedBase]);

  const icon = pick === 'accept' ? acceptIcon : rejectIcon;

  return (
    <div className={`relative h-full w-full overflow-hidden ${className ?? ''}`} style={{ background: gradient }}>
      {live
        ? confetti.map((c, i) => (
            <motion.span
              key={i}
              className="pointer-events-none absolute left-1/2 top-[42%] rounded-sm"
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
                x: Math.cos(c.angle) * c.dist * (pick === 'accept' ? 1 : 0.85),
                y: Math.sin(c.angle) * c.dist * (pick === 'accept' ? 1 : 0.85) - (pick === 'reject' ? 12 : 0),
                opacity: [1, 1, 0],
                rotate: c.rot + (pick === 'accept' ? 200 : -160),
                scale: [1, 1.05, 0.55],
              }}
              transition={{
                duration: pick === 'accept' ? 1.2 : 1,
                delay: c.delay,
                ease: [0.22, 1, 0.36, 1],
              }}
            />
          ))
        : null}

      <motion.div
        className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-2 px-3"
        initial={live ? { opacity: 0 } : false}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.25 }}
      >
        <motion.div
          initial={live ? { scale: 0.3, rotate: pick === 'accept' ? -14 : 14, y: 18 } : false}
          animate={{ scale: 1, rotate: 0, y: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 15 }}
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
          initial={live ? { y: 16, opacity: 0 } : false}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 240, damping: 16, delay: 0.06 }}
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
            {suffix === '/10' ? '' : '+'}
            {metric}
            <span className="ml-0.5 text-xs font-bold md:text-[10px]" style={{ fontFamily: 'var(--font-inter)' }}>
              {suffix}
            </span>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}

export function DemoSwipeHero({ variant, className = '' }: { variant: DemoSwipeVisualVariant; className?: string }) {
  switch (variant) {
    case 0:
      return <CafeHeroAnimation className={className} />;
    case 1:
      return <StaffingRushHero className={className} />;
    case 2:
      return <DeliveryMapHero className={className} />;
    case 3:
      return <CostPriceHero className={className} />;
    default:
      return <CafeHeroAnimation className={className} />;
  }
}

export function DemoSwipeCelebration({
  variant,
  pick,
  className = '',
}: {
  variant: DemoSwipeVisualVariant;
  pick: 'accept' | 'reject';
  className?: string;
}) {
  switch (variant) {
    case 0:
      return <CafeCelebration pick={pick} className={className} />;
    case 1:
      return (
        <VariantCelebration
          pick={pick}
          className={className}
          seedBase={201}
          acceptIcon="solar:chart-2-bold"
          rejectIcon="solar:wallet-bold"
          acceptLabel="Throughput"
          rejectLabel="Labor saved"
          acceptTarget={18}
          rejectTarget={8}
          acceptSuffix="%"
          rejectSuffix="%"
          gradient={`radial-gradient(110% 85% at 50% 15%, ${BRAND.yellow} 0%, ${BRAND.mint} 50%, ${BRAND.cream} 100%)`}
        />
      );
    case 2:
      return (
        <VariantCelebration
          pick={pick}
          className={className}
          seedBase={307}
          acceptIcon="solar:delivery-bold"
          rejectIcon="solar:shop-bold"
          acceptLabel="Online orders"
          rejectLabel="Fees avoided"
          acceptTarget={24}
          rejectTarget={11}
          acceptSuffix="%"
          rejectSuffix="%"
          gradient={`radial-gradient(100% 90% at 30% 20%, ${BRAND.mint} 0%, ${BRAND.yellow} 55%, ${BRAND.cream} 100%)`}
        />
      );
    case 3:
      return (
        <VariantCelebration
          pick={pick}
          className={className}
          seedBase={412}
          acceptIcon="solar:tag-price-bold"
          rejectIcon="solar:heart-bold"
          acceptLabel="Avg ticket"
          rejectLabel="Loyalty score"
          acceptTarget={50}
          rejectTarget={7}
          acceptSuffix="¢"
          rejectSuffix="/10"
          gradient={`radial-gradient(115% 85% at 50% 18%, ${BRAND.yellow} 0%, ${BRAND.cream} 50%, ${BRAND.mint} 100%)`}
        />
      );
    default:
      return <CafeCelebration pick={pick} className={className} />;
  }
}
