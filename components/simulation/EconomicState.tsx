'use client';

import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import type { SimulationState, MetricDefinition } from '@/types/simulation';
import { formatMetricValue, getIndexLabel } from '@/lib/simulation/engine';

const DEFAULT_ICON = 'solar:chart-2-bold';
const METRIC_ICONS: Record<string, string> = {
  inflation: 'solar:chart-2-bold',
  gdpGrowth: 'solar:graph-up-bold',
  unemployment: 'solar:users-group-two-rounded-bold',
  governmentDebt: 'solar:bill-list-bold',
  publicConfidence: 'solar:heart-pulse-bold',
  coffeePrice: 'solar:cup-bold',
  dailyDemand: 'solar:users-group-rounded-bold',
  wage: 'solar:wallet-money-bold',
  workers: 'solar:users-group-two-rounded-bold',
  dailyProfit: 'solar:chart-bold',
  studentSatisfaction: 'solar:heart-pulse-bold',
  activeUsers: 'solar:users-group-rounded-bold',
  partnerRestaurants: 'solar:fork-knife-bold',
  averageCommissionPct: 'solar:tag-price-bold',
  platformProfit: 'solar:chart-bold',
  userSatisfaction: 'solar:heart-pulse-bold',
  competitivePressure: 'solar:shield-warning-bold',
};

interface EconomicStateProps {
  state: SimulationState;
  metrics: MetricDefinition[];
  previousState?: SimulationState;
}

const STATE_GREEN = '#06402B';

type ValueColor = { className?: string; style?: React.CSSProperties };

function getValueColor(metric: MetricDefinition, value: number): ValueColor {
  if (metric.format === 'index') {
    if (metric.key === 'competitivePressure') {
      if (value >= 70) return { className: 'text-red-600 dark:text-red-400' };
      if (value >= 40) return { className: 'text-yellow-600 dark:text-yellow-400' };
      return { style: { color: STATE_GREEN } };
    }
    if (value >= 70) return { style: { color: STATE_GREEN } };
    if (value >= 40) return { className: 'text-yellow-600 dark:text-yellow-400' };
    return { className: 'text-red-600 dark:text-red-400' };
  }
  // Cafe + Campus Delivery state metrics: use black
  const blackValueMetrics = [
    'coffeePrice', 'dailyDemand', 'wage', 'workers',
    'activeUsers', 'partnerRestaurants', 'averageCommissionPct', 'platformProfit',
  ];
  if (blackValueMetrics.includes(metric.key)) {
    return { className: 'text-black' };
  }
  if (metric.key === 'dailyProfit' || metric.key === 'platformProfit' || metric.key === 'gdpGrowth') {
    if (value > 0) return { style: { color: STATE_GREEN } };
    if (value < 0) return { className: 'text-red-600 dark:text-red-400' };
    return { className: 'text-slate-600 dark:text-slate-400' };
  }
  if (metric.key === 'unemployment') {
    if (value > 7) return { className: 'text-red-600 dark:text-red-400' };
    if (value < 4) return { style: { color: STATE_GREEN } };
    return { className: 'text-yellow-600 dark:text-yellow-400' };
  }
  return { className: 'text-slate-700 dark:text-slate-300' };
}

export default function EconomicStateDisplay({ state, metrics, previousState }: EconomicStateProps) {
  const getStateChange = (key: string) => {
    if (!previousState || state[key] === undefined || previousState[key] === undefined) return null;
    const change = state[key] - previousState[key];
    if (Math.abs(change) < 0.01) return null;
    return change > 0 ? 'up' : 'down';
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {metrics.map((metric, index) => {
        const value = state[metric.key] ?? 0;
        const change = getStateChange(metric.key);
        const valueColor = getValueColor(metric, value);
        const icon = METRIC_ICONS[metric.key] ?? DEFAULT_ICON;
        const displayText = metric.format === 'index'
          ? `${Math.round(value)}/100 (${getIndexLabel(value)})`
          : formatMetricValue(value, metric);

        return (
          <motion.div
            key={metric.key}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className="rounded-lg p-4 border-2 shadow-sm"
            style={{ backgroundColor: '#82EDA6', borderColor: '#06402B' }}
          >
            <div className="flex items-center justify-between mb-2">
              <Icon icon={icon} className="w-5 h-5" style={{ color: '#06402B' }} />
              {change && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  style={{ color: '#06402B' }}
                >
                  <Icon
                    icon={change === 'up' ? 'solar:arrow-up-bold' : 'solar:arrow-down-bold'}
                    className="w-4 h-4"
                  />
                </motion.div>
              )}
            </div>
            <div className="text-xs mb-1 font-medium" style={{ color: '#06402B', fontFamily: 'var(--font-inter)' }}>
              {metric.label}
            </div>
            <div
              className={`text-lg font-bold ${valueColor.className ?? ''}`}
              style={{ ...valueColor.style, fontFamily: 'var(--font-inter)' }}
            >
              {displayText}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
