'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import type { Simulation } from '@/types/simulation';
import DemandCurveChart, { type XYPoint } from '@/components/charts/DemandCurveChart';
import { fadeInUp } from '@/lib/utils/animations';

type IncomeLevel = 'low' | 'medium' | 'high';
type SubstituteLevel = 'cheap' | 'same' | 'expensive';

const SETTINGS_KEY_PREFIX = 'elasticity_settings_';

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function formatMoney(n: number) {
  return `$${n.toFixed(2)}`;
}

function formatInt(n: number) {
  return Math.round(n).toLocaleString();
}

function formatElasticity(e: number | null) {
  if (e === null || !Number.isFinite(e)) return '—';
  return e.toFixed(2);
}

function elasticityLabel(e: number | null): { label: string; color: string } {
  if (e === null || !Number.isFinite(e)) return { label: 'N/A', color: '#64748b' };
  const a = Math.abs(e);
  if (a > 1.05) return { label: 'Elastic', color: '#16a34a' };
  if (a >= 0.95 && a <= 1.05) return { label: 'Unit elastic', color: '#f59e0b' };
  return { label: 'Inelastic', color: '#ef4444' };
}

function insightText(args: {
  elasticity: number | null;
  preference: number;
  horizon: number;
  income: IncomeLevel;
  substitute: SubstituteLevel;
}): string {
  const { elasticity, preference, horizon, income, substitute } = args;
  const { label } = elasticityLabel(elasticity);

  if (elasticity === null) {
    return 'At this price, quantity demanded is near zero — revenue will also be near zero. Try lowering price or shifting demand right.';
  }

  if (label === 'Elastic') {
    return 'Demand is elastic — price increases tend to reduce total revenue. Consumers are price-sensitive and react strongly.';
  }
  if (label === 'Unit elastic') {
    return 'Demand is unit elastic — small price changes leave total revenue roughly unchanged at this point on the curve.';
  }

  // Inelastic
  const extra: string[] = [];
  if (preference > 0.65) extra.push('Strong brand loyalty makes demand more inelastic.');
  if (horizon > 0.6) extra.push('Over time, consumers find alternatives → demand becomes more elastic.');
  if (income === 'high') extra.push('Higher income shifts demand right (normal good).');
  if (substitute === 'expensive') extra.push('A more expensive substitute shifts your demand right.');

  return (
    'Demand is inelastic — modest price increases can raise total revenue (up to a point).' +
    (extra.length ? ' ' + extra.join(' ') : '')
  );
}

interface ElasticityPlayProps {
  simulationId: string;
  simulation: Simulation;
}

export default function ElasticityPlay({ simulationId, simulation }: ElasticityPlayProps) {
  const router = useRouter();

  const [price, setPrice] = useState(12);
  const [income, setIncome] = useState<IncomeLevel>('medium');
  const [substitute, setSubstitute] = useState<SubstituteLevel>('same');
  const [preference, setPreference] = useState(0.6);
  const [horizon, setHorizon] = useState(0.2);

  const prevRevenueRef = useRef<number | null>(null);

  // Load saved settings
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem(`${SETTINGS_KEY_PREFIX}${simulationId}`);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Partial<{
        price: number;
        income: IncomeLevel;
        substitute: SubstituteLevel;
        preference: number;
        horizon: number;
      }>;

      if (typeof parsed.price === 'number') setPrice(clamp(parsed.price, 5, 25));
      if (parsed.income === 'low' || parsed.income === 'medium' || parsed.income === 'high') setIncome(parsed.income);
      if (parsed.substitute === 'cheap' || parsed.substitute === 'same' || parsed.substitute === 'expensive')
        setSubstitute(parsed.substitute);
      if (typeof parsed.preference === 'number') setPreference(clamp(parsed.preference, 0, 1));
      if (typeof parsed.horizon === 'number') setHorizon(clamp(parsed.horizon, 0, 1));
    } catch {
      // ignore
    }
  }, [simulationId]);

  // Persist settings
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(
        `${SETTINGS_KEY_PREFIX}${simulationId}`,
        JSON.stringify({ price, income, substitute, preference, horizon })
      );
    } catch {
      // ignore
    }
  }, [simulationId, price, income, substitute, preference, horizon]);

  const demand = useMemo(() => {
    // Base demand parameters for a gym membership market (toy model).
    const baseA = 220; // intercept (market size / baseline demand)
    const baseB = 8; // slope factor (responsiveness)

    const incomeShift = income === 'low' ? -35 : income === 'high' ? 35 : 0;
    const substituteShift = substitute === 'cheap' ? -30 : substitute === 'expensive' ? 30 : 0;
    const a = baseA + incomeShift + substituteShift;

    // Preference strength (brand loyalty) makes curve steeper (more inelastic) when strong.
    const prefMultiplier = lerp(1.4, 0.7, clamp(preference, 0, 1));

    // Time horizon: long run makes demand more elastic (flatter), short run steeper.
    const horizonMultiplier = lerp(0.8, 1.3, clamp(horizon, 0, 1));

    const b = baseB * prefMultiplier * horizonMultiplier;

    const q = Math.max(0, a - b * price);
    const revenue = price * q;

    // Point elasticity: E = (dQ/dP) * (P/Q) = (-b) * (P/Q)
    const elasticity = q <= 0.0001 ? null : (-b * price) / q;

    // Build a (Q,P) curve within reasonable plot bounds.
    const qAtPMin = Math.max(0, a - b * 5);
    const qMax = Math.max(60, qAtPMin);
    const points: XYPoint[] = [];
    const N = 30;
    for (let i = 0; i <= N; i++) {
      const qi = (qMax * i) / N;
      const pi = (a - qi) / b;
      if (!Number.isFinite(pi)) continue;
      if (pi < 0 || pi > 30) continue;
      points.push({ x: qi, y: pi });
    }

    const xMax = Math.ceil((qMax * 1.1) / 10) * 10;

    return {
      a,
      b,
      quantity: q,
      revenue,
      elasticity,
      curve: points,
      xMax,
      point: { x: q, y: price } satisfies XYPoint,
    };
  }, [price, income, substitute, preference, horizon]);

  const revenueDelta = useMemo(() => {
    const prev = prevRevenueRef.current;
    if (prev === null) return 0;
    return demand.revenue - prev;
  }, [demand.revenue]);

  useEffect(() => {
    prevRevenueRef.current = demand.revenue;
  }, [demand.revenue]);

  const el = elasticityLabel(demand.elasticity);
  const revenueColor = revenueDelta > 0 ? '#16a34a' : revenueDelta < 0 ? '#ef4444' : '#06402B';

  const incomeShiftLabel =
    income === 'high'
      ? 'Demand increased due to higher income (normal good).'
      : income === 'low'
        ? 'Demand decreased due to lower income (normal good).'
        : '';

  const subShiftLabel =
    substitute === 'expensive'
      ? 'Substitute got more expensive → your demand shifts right.'
      : substitute === 'cheap'
        ? 'Substitute got cheaper → your demand shifts left.'
        : '';

  return (
    <div className="min-h-screen py-8 md:py-12" style={{ backgroundColor: '#FFFFE3' }}>
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="mb-6">
          <button
            onClick={() => router.push(`/simulation/${simulationId}`)}
            className="flex items-center transition-colors mb-4"
            style={{ color: '#06402B', fontFamily: 'var(--font-inter)', fontWeight: 500 }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.7')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
          >
            <Icon icon="solar:arrow-left-bold" className="w-5 h-5 mr-2" />
            <span>Back</span>
          </button>

          <h1
            className="text-3xl md:text-4xl font-bold uppercase mb-2"
            style={{ fontFamily: 'var(--font-luckiest-guy)', color: '#06402B', letterSpacing: '0.03em' }}
          >
            {simulation.title}
          </h1>
          <p
            className="text-lg"
            style={{ fontFamily: 'var(--font-inter)', letterSpacing: '-0.04em', color: '#06402B', fontWeight: 500 }}
          >
            Maximize total revenue by learning when demand is elastic vs inelastic.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Controls */}
          <div className="lg:col-span-2 space-y-4">
            <div className="rounded-xl shadow-lg p-6 border-2" style={{ backgroundColor: '#82EDA6', borderColor: '#06402B' }}>
              <h2 className="text-xl font-bold uppercase mb-4" style={{ fontFamily: 'var(--font-luckiest-guy)', color: '#06402B', letterSpacing: '0.03em' }}>
                Sliders
              </h2>

              {/* Price */}
              <div className="mb-5">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-bold" style={{ fontFamily: 'var(--font-inter)', color: '#06402B' }}>
                    Price ($)
                  </div>
                  <div className="font-bold" style={{ fontFamily: 'var(--font-inter)', color: '#06402B' }}>
                    {formatMoney(price)}
                  </div>
                </div>
                <input
                  type="range"
                  min={5}
                  max={25}
                  step={0.5}
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full"
                />
                <p className="mt-2 text-sm" style={{ fontFamily: 'var(--font-inter)', color: '#06402B', fontWeight: 500, letterSpacing: '-0.04em' }}>
                  Moves <strong>along</strong> the demand curve (quantity updates automatically).
                </p>
              </div>

              {/* Income */}
              <div className="mb-5">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-bold" style={{ fontFamily: 'var(--font-inter)', color: '#06402B' }}>
                    Average Consumer Income
                  </div>
                  <div className="font-bold capitalize" style={{ fontFamily: 'var(--font-inter)', color: '#06402B' }}>
                    {income}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {(['low', 'medium', 'high'] as const).map((v) => (
                    <button
                      key={v}
                      onClick={() => setIncome(v)}
                      className="px-3 py-2 rounded-lg border-2 text-sm font-semibold"
                      style={{
                        fontFamily: 'var(--font-inter)',
                        borderColor: '#06402B',
                        backgroundColor: income === v ? '#06402B' : '#82EDA6',
                        color: income === v ? '#FFFFE3' : '#06402B',
                      }}
                    >
                      {v[0]!.toUpperCase() + v.slice(1)}
                    </button>
                  ))}
                </div>
                <p className="mt-2 text-sm" style={{ fontFamily: 'var(--font-inter)', color: '#06402B', fontWeight: 500, letterSpacing: '-0.04em' }}>
                  Shifts demand (normal good assumption).
                </p>
              </div>

              {/* Substitute */}
              <div className="mb-5">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-bold" style={{ fontFamily: 'var(--font-inter)', color: '#06402B' }}>
                    Price of Closest Substitute
                  </div>
                  <div className="font-bold capitalize" style={{ fontFamily: 'var(--font-inter)', color: '#06402B' }}>
                    {substitute}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {(['cheap', 'same', 'expensive'] as const).map((v) => (
                    <button
                      key={v}
                      onClick={() => setSubstitute(v)}
                      className="px-3 py-2 rounded-lg border-2 text-sm font-semibold"
                      style={{
                        fontFamily: 'var(--font-inter)',
                        borderColor: '#06402B',
                        backgroundColor: substitute === v ? '#06402B' : '#82EDA6',
                        color: substitute === v ? '#FFFFE3' : '#06402B',
                      }}
                    >
                      {v[0]!.toUpperCase() + v.slice(1)}
                    </button>
                  ))}
                </div>
                <p className="mt-2 text-sm" style={{ fontFamily: 'var(--font-inter)', color: '#06402B', fontWeight: 500, letterSpacing: '-0.04em' }}>
                  Builds intuition for <strong>cross-price</strong> effects (substitutes).
                </p>
              </div>

              {/* Preference strength */}
              <div className="mb-5">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-bold" style={{ fontFamily: 'var(--font-inter)', color: '#06402B' }}>
                    Brand Loyalty / Preferences
                  </div>
                  <div className="font-bold" style={{ fontFamily: 'var(--font-inter)', color: '#06402B' }}>
                    {preference < 0.34 ? 'Weak' : preference < 0.67 ? 'Medium' : 'Strong'}
                  </div>
                </div>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={preference}
                  onChange={(e) => setPreference(Number(e.target.value))}
                  className="w-full"
                />
                <p className="mt-2 text-sm" style={{ fontFamily: 'var(--font-inter)', color: '#06402B', fontWeight: 500, letterSpacing: '-0.04em' }}>
                  Controls curve <strong>steepness</strong>: weak preference → more elastic; strong loyalty → more inelastic.
                </p>
              </div>

              {/* Time horizon */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="font-bold" style={{ fontFamily: 'var(--font-inter)', color: '#06402B' }}>
                    Time Horizon
                  </div>
                  <div className="font-bold" style={{ fontFamily: 'var(--font-inter)', color: '#06402B' }}>
                    {horizon < 0.5 ? 'Short run' : 'Long run'}
                  </div>
                </div>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={horizon}
                  onChange={(e) => setHorizon(Number(e.target.value))}
                  className="w-full"
                />
                <div
                  className="mt-2 p-3 rounded-lg border-2"
                  style={{ backgroundColor: '#FFFFE3', borderColor: '#06402B' }}
                >
                  <p className="text-sm italic" style={{ fontFamily: 'var(--font-inter)', color: '#06402B', fontWeight: 500, letterSpacing: '-0.04em' }}>
                    <Icon icon="solar:info-circle-bold" className="w-4 h-4 inline mr-1" />
                    Consumers find alternatives over time → demand becomes more elastic.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Chart + Metrics */}
          <div className="lg:col-span-3 space-y-4">
            <div className="rounded-xl shadow-lg p-6 border-2" style={{ backgroundColor: '#82EDA6', borderColor: '#06402B' }}>
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-2 mb-3">
                <h2 className="text-xl font-bold uppercase" style={{ fontFamily: 'var(--font-luckiest-guy)', color: '#06402B', letterSpacing: '0.03em' }}>
                  Demand Curve
                </h2>
                <div className="text-sm" style={{ fontFamily: 'var(--font-inter)', color: '#06402B', fontWeight: 600, letterSpacing: '-0.04em' }}>
                  X: Quantity • Y: Price
                </div>
              </div>

              {(incomeShiftLabel || subShiftLabel) && (
                <div className="mb-3 space-y-1">
                  {incomeShiftLabel && (
                    <div className="text-sm" style={{ fontFamily: 'var(--font-inter)', color: '#06402B', fontWeight: 600, letterSpacing: '-0.04em' }}>
                      {incomeShiftLabel}
                    </div>
                  )}
                  {subShiftLabel && (
                    <div className="text-sm" style={{ fontFamily: 'var(--font-inter)', color: '#06402B', fontWeight: 600, letterSpacing: '-0.04em' }}>
                      {subShiftLabel}
                    </div>
                  )}
                </div>
              )}

              <div className="h-72 md:h-80 rounded-lg border-2 p-3" style={{ backgroundColor: '#FFFFE3', borderColor: '#06402B' }}>
                <DemandCurveChart curve={demand.curve} point={demand.point} xMax={demand.xMax} yMax={30} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Quantity */}
              <div className="rounded-xl shadow-lg p-5 border-2" style={{ backgroundColor: '#82EDA6', borderColor: '#06402B' }}>
                <div className="text-xs font-semibold uppercase mb-1" style={{ fontFamily: 'var(--font-inter)', color: '#06402B', letterSpacing: '0.04em' }}>
                  Quantity (members)
                </div>
                <div className="text-2xl font-bold" style={{ fontFamily: 'var(--font-inter)', color: '#06402B' }}>
                  {formatInt(demand.quantity)}
                </div>
                <div className="text-sm mt-1" style={{ fontFamily: 'var(--font-inter)', color: '#06402B', fontWeight: 600, letterSpacing: '-0.04em' }}>
                  Updates automatically from the curve.
                </div>
              </div>

              {/* Elasticity */}
              <div className="rounded-xl shadow-lg p-5 border-2" style={{ backgroundColor: '#82EDA6', borderColor: '#06402B' }}>
                <div className="text-xs font-semibold uppercase mb-1" style={{ fontFamily: 'var(--font-inter)', color: '#06402B', letterSpacing: '0.04em' }}>
                  Elasticity (point)
                </div>
                <div className="flex items-baseline justify-between">
                  <div className="text-2xl font-bold" style={{ fontFamily: 'var(--font-inter)', color: '#06402B' }}>
                    {formatElasticity(demand.elasticity)}
                  </div>
                  <div
                    className="text-sm font-bold px-3 py-1 rounded-full border-2"
                    style={{
                      fontFamily: 'var(--font-inter)',
                      borderColor: '#06402B',
                      backgroundColor: '#FFFFE3',
                      color: el.color,
                    }}
                  >
                    {el.label}
                  </div>
                </div>
                <div className="text-sm mt-1" style={{ fontFamily: 'var(--font-inter)', color: '#06402B', fontWeight: 600, letterSpacing: '-0.04em' }}>
                  Elasticity = %ΔQ / %ΔP (shown as a point elasticity).
                </div>
              </div>

              {/* Total revenue */}
              <div className="rounded-xl shadow-lg p-5 border-2" style={{ backgroundColor: '#82EDA6', borderColor: '#06402B' }}>
                <div className="text-xs font-semibold uppercase mb-1" style={{ fontFamily: 'var(--font-inter)', color: '#06402B', letterSpacing: '0.04em' }}>
                  Total revenue
                </div>
                <div className="text-2xl font-bold" style={{ fontFamily: 'var(--font-inter)', color: revenueColor }}>
                  {formatMoney(demand.revenue)}
                </div>
                <div className="text-sm mt-1" style={{ fontFamily: 'var(--font-inter)', color: '#06402B', fontWeight: 600, letterSpacing: '-0.04em' }}>
                  Price × Quantity
                  {revenueDelta !== 0 && (
                    <span style={{ color: revenueColor }}>
                      {' '}
                      ({revenueDelta > 0 ? '+' : ''}
                      {formatMoney(revenueDelta)})
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="rounded-xl shadow-lg p-6 border-2" style={{ backgroundColor: '#82EDA6', borderColor: '#06402B' }}>
              <h2 className="text-xl font-bold uppercase mb-3" style={{ fontFamily: 'var(--font-luckiest-guy)', color: '#06402B', letterSpacing: '0.03em' }}>
                Key insight
              </h2>
              <p className="text-lg leading-relaxed" style={{ fontFamily: 'var(--font-inter)', color: '#06402B', fontWeight: 500, letterSpacing: '-0.04em' }}>
                {insightText({
                  elasticity: demand.elasticity,
                  preference,
                  horizon,
                  income,
                  substitute,
                })}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <button
                onClick={() => router.push('/')}
                className="transition-colors flex items-center"
                style={{ color: '#06402B', fontFamily: 'var(--font-inter)', fontWeight: 600 }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.7')}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
              >
                <Icon icon="solar:home-smile-bold" className="w-5 h-5 mr-2" />
                <span>End Simulation → Home</span>
              </button>
              <button
                onClick={() => {
                  setPrice(12);
                  setIncome('medium');
                  setSubstitute('same');
                  setPreference(0.6);
                  setHorizon(0.2);
                }}
                className="px-6 py-3 text-base cursor-pointer"
                style={{
                  fontFamily: 'var(--font-inter)',
                  fontWeight: 800,
                  backgroundColor: '#82EDA6',
                  color: '#06402B',
                  letterSpacing: '-0.04em',
                  boxShadow: '4px 4px 0px 0px #03594D, 0px 0px 0px 2px #06402B',
                  border: 'none',
                  borderRadius: '9999px',
                  transition: 'all 0.15s ease',
                  outline: 'none',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '3px 3px 0px 0px #03594D, 0px 0px 0px 2px #06402B';
                  e.currentTarget.style.transform = 'translate(1px, 1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '4px 4px 0px 0px #03594D, 0px 0px 0px 2px #06402B';
                  e.currentTarget.style.transform = 'translate(0px, 0px)';
                }}
              >
                Reset sliders
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

