'use client';

import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import type { MetricDefinition, SimulationState } from '@/types/simulation';
import { formatMetricValue } from '@/lib/simulation/engine';

interface RoundSummaryStepProps {
  title: string;
  message: string;
  metrics: MetricDefinition[];
  roundStartState: SimulationState;
  currentState: SimulationState;
  onContinue: () => void;
  isFinal?: boolean;
}

function pickSummaryMetrics(metrics: MetricDefinition[]) {
  const preferred = new Set([
    'platformProfit',
    'activeUsers',
    'partnerRestaurants',
    'averageCommissionPct',
    'userSatisfaction',
    'competitivePressure',
  ]);
  const found = metrics.filter((m) => preferred.has(m.key));
  return found.length ? found : metrics.slice(0, 6);
}

export default function RoundSummaryStep({
  title,
  message,
  metrics,
  roundStartState,
  currentState,
  onContinue,
  isFinal = false,
}: RoundSummaryStepProps) {
  const summaryMetrics = pickSummaryMetrics(metrics);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl p-6 border-2"
        style={{ backgroundColor: '#FFFFE3', borderColor: '#06402B', borderLeft: '4px solid #06402B' }}
      >
        <h3
          className="text-2xl font-bold uppercase mb-2"
          style={{ fontFamily: 'var(--font-luckiest-guy)', color: '#06402B', letterSpacing: '0.03em' }}
        >
          {title}
        </h3>
        <p className="text-lg leading-relaxed whitespace-pre-line" style={{ fontFamily: 'var(--font-inter)', letterSpacing: '-0.04em', color: '#06402B', fontWeight: 500 }}>
          {message}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {summaryMetrics.map((metric) => {
          const start = roundStartState[metric.key] ?? 0;
          const end = currentState[metric.key] ?? 0;
          const delta = end - start;
          const deltaAbs = Math.abs(delta);
          const showDelta = deltaAbs >= 0.01;

          const deltaText =
            metric.format === 'currency'
              ? `${delta >= 0 ? '+' : '-'}$${Math.abs(delta).toFixed(2)}`
              : metric.format === 'percent'
                ? `${delta >= 0 ? '+' : ''}${delta.toFixed(1)}%`
                : `${delta >= 0 ? '+' : ''}${Math.round(delta)}`;

          return (
            <div
              key={metric.key}
              className="rounded-lg p-4 border-2"
              style={{ backgroundColor: '#82EDA6', borderColor: '#06402B' }}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="text-xs font-medium" style={{ color: '#06402B', fontFamily: 'var(--font-inter)' }}>
                  {metric.label}
                </div>
                {showDelta && (
                  <div className="text-xs font-semibold flex items-center" style={{ color: '#06402B', fontFamily: 'var(--font-inter)' }}>
                    <Icon
                      icon={delta >= 0 ? 'solar:arrow-up-bold' : 'solar:arrow-down-bold'}
                      className="w-4 h-4 mr-1"
                      style={{ color: '#06402B' }}
                    />
                    {deltaText}
                  </div>
                )}
              </div>
              <div className="text-lg font-bold" style={{ color: '#06402B', fontFamily: 'var(--font-inter)' }}>
                {formatMetricValue(end, metric)}
              </div>
              <div className="text-xs mt-1" style={{ color: '#06402B', fontFamily: 'var(--font-inter)', fontWeight: 500, opacity: 0.9 }}>
                Round start: {formatMetricValue(start, metric)}
              </div>
            </div>
          );
        })}
      </motion.div>

      <div className="flex justify-end">
        <button
          onClick={onContinue}
          className="px-8 py-4 text-lg cursor-pointer"
          style={{
            fontFamily: 'var(--font-inter)',
            fontWeight: 700,
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
          {isFinal ? 'View Results' : 'Continue'}
          <Icon icon="solar:arrow-right-bold" className="w-5 h-5 inline ml-2" />
        </button>
      </div>
    </div>
  );
}

