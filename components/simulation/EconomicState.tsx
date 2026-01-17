'use client';

import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import type { EconomicState } from '@/types/simulation';
import { formatStateValue } from '@/lib/simulation/engine';

interface EconomicStateProps {
  state: EconomicState;
  previousState?: EconomicState;
}

export default function EconomicStateDisplay({ state, previousState }: EconomicStateProps) {
  const getStateChange = (key: keyof EconomicState) => {
    if (!previousState) return null;
    const change = state[key] - previousState[key];
    if (Math.abs(change) < 0.1) return null;
    return change > 0 ? 'up' : 'down';
  };

  const getValueColor = (key: keyof EconomicState, value: number) => {
    switch (key) {
      case 'inflation':
        return value > 3 ? 'text-red-600 dark:text-red-400' : value < 2 ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400';
      case 'gdpGrowth':
        return value > 3 ? 'text-green-600 dark:text-green-400' : value < 1 ? 'text-red-600 dark:text-red-400' : 'text-yellow-600 dark:text-yellow-400';
      case 'unemployment':
        return value > 7 ? 'text-red-600 dark:text-red-400' : value < 4 ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400';
      case 'governmentDebt':
        return value > 80 ? 'text-red-600 dark:text-red-400' : value < 50 ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400';
      case 'publicConfidence':
        return value > 70 ? 'text-green-600 dark:text-green-400' : value < 40 ? 'text-red-600 dark:text-red-400' : 'text-yellow-600 dark:text-yellow-400';
      default:
        return 'text-slate-600 dark:text-slate-400';
    }
  };

  const stateItems: Array<{ key: keyof EconomicState; label: string; icon: string }> = [
    { key: 'inflation', label: 'Inflation', icon: 'solar:chart-2-bold' },
    { key: 'gdpGrowth', label: 'GDP Growth', icon: 'solar:graph-up-bold' },
    { key: 'unemployment', label: 'Unemployment', icon: 'solar:users-group-two-rounded-bold' },
    { key: 'governmentDebt', label: 'Gov. Debt', icon: 'solar:bill-list-bold' },
    { key: 'publicConfidence', label: 'Confidence', icon: 'solar:heart-pulse-bold' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {stateItems.map((item, index) => {
        const change = getStateChange(item.key);
        const value = state[item.key];
        const color = getValueColor(item.key, value);

        return (
          <motion.div
            key={item.key}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className="rounded-lg p-4 border-2 shadow-sm"
            style={{ backgroundColor: '#82EDA6', borderColor: '#06402B' }}
          >
            <div className="flex items-center justify-between mb-2">
              <Icon icon={item.icon} className="w-5 h-5" style={{ color: '#06402B' }} />
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
              {item.label}
            </div>
            <div className="text-lg font-bold" style={{ color: '#06402B', fontFamily: 'var(--font-inter)' }}>
              {formatStateValue(item.key, value)}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
