'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import EconomicChart from '@/components/charts/EconomicChart';
import type { SimulationState, DecisionRecord, MetricDefinition, ResultsConfig } from '@/types/simulation';
import { formatMetricValue } from '@/lib/simulation/engine';

interface ResultsDashboardProps {
  initialState: SimulationState;
  finalState: SimulationState;
  decisionHistory: DecisionRecord[];
  metrics: MetricDefinition[];
  resultsConfig?: ResultsConfig;
}

const CHART_COLORS = ['#06402B', '#03594D', '#0d5c3d', '#82EDA6', '#06402B', '#03594D'];

export default function ResultsDashboard({
  initialState,
  finalState,
  decisionHistory,
  metrics,
  resultsConfig,
}: ResultsDashboardProps) {
  const [revealed, setRevealed] = useState(false);

  const chartMetrics = resultsConfig?.chartMetrics
    ? metrics.filter((m) => resultsConfig.chartMetrics!.includes(m.key) && m.chartType)
    : metrics.filter((m) => m.chartType);
  const summaryKeys = resultsConfig?.summaryMetrics ?? metrics.map((m) => m.key);
  const summaryMetrics = metrics.filter((m) => summaryKeys.includes(m.key));

  const handleReveal = () => {
    setRevealed(true);
  };

  return (
    <div className="space-y-6">
      {!revealed && (
        <div className="text-center py-8">
          <button
            onClick={handleReveal}
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
              outline: 'none'
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
            Reveal Results
          </button>
        </div>
      )}

      {revealed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {chartMetrics.map((metric, index) => (
              <EconomicChart
                key={metric.key}
                type={metric.chartType ?? 'line'}
                metric={metric}
                initialState={initialState}
                finalState={finalState}
                decisionHistory={decisionHistory}
                color={CHART_COLORS[index % CHART_COLORS.length]}
                delay={0.1 * (index + 1)}
              />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 rounded-xl p-6 border-2"
            style={{ backgroundColor: '#FFFFE3', borderColor: '#06402B' }}
          >
            {summaryMetrics.map((metric) => {
              const initialVal = initialState[metric.key] ?? 0;
              const finalVal = finalState[metric.key] ?? 0;
              const change = finalVal - initialVal;
              const isPositive = change > 0;
              return (
                <div key={metric.key} className="text-center">
                  <div className="text-xs mb-1 font-medium" style={{ color: '#06402B', fontFamily: 'var(--font-inter)' }}>
                    {metric.label}
                  </div>
                  <div className="text-lg font-bold" style={{ color: '#06402B', fontFamily: 'var(--font-inter)' }}>
                    {formatMetricValue(finalVal, metric)}
                  </div>
                  <div className="text-sm font-medium" style={{ color: '#06402B', fontFamily: 'var(--font-inter)' }}>
                    {metric.format === 'currency' && (isPositive ? '+' : '') + `$${change.toFixed(2)}`}
                    {metric.format === 'percent' && (isPositive ? '+' : '') + `${change.toFixed(1)}%`}
                    {(metric.format === 'integer' || metric.format === 'index') && (isPositive ? '+' : '') + Math.round(change).toString()}
                  </div>
                </div>
              );
            })}
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
