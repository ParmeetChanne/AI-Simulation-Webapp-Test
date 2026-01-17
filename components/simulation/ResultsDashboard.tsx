'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import EconomicChart from '@/components/charts/EconomicChart';
import type { EconomicState, DecisionRecord } from '@/types/simulation';

interface ResultsDashboardProps {
  initialState: EconomicState;
  finalState: EconomicState;
  decisionHistory: DecisionRecord[];
}

export default function ResultsDashboard({
  initialState,
  finalState,
  decisionHistory,
}: ResultsDashboardProps) {
  const [revealed, setRevealed] = useState(false);

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
          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <EconomicChart
              type="line"
              title="Inflation Rate"
              initialState={initialState}
              finalState={finalState}
              decisionHistory={decisionHistory}
              dataKey="inflation"
              color="#ef4444"
              delay={0.1}
            />
            <EconomicChart
              type="line"
              title="GDP Growth"
              initialState={initialState}
              finalState={finalState}
              decisionHistory={decisionHistory}
              dataKey="gdpGrowth"
              color="#10b981"
              delay={0.2}
            />
            <EconomicChart
              type="bar"
              title="Unemployment Rate"
              initialState={initialState}
              finalState={finalState}
              decisionHistory={decisionHistory}
              dataKey="unemployment"
              color="#f59e0b"
              delay={0.3}
            />
            <EconomicChart
              type="line"
              title="Public Confidence"
              initialState={initialState}
              finalState={finalState}
              decisionHistory={decisionHistory}
              dataKey="publicConfidence"
              color="#8b5cf6"
              delay={0.4}
            />
          </div>

          {/* Summary Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-2 md:grid-cols-5 gap-4 rounded-xl p-6 border-2"
            style={{ backgroundColor: '#FFFFE3', borderColor: '#06402B' }}
          >
            {(['inflation', 'gdpGrowth', 'unemployment', 'governmentDebt', 'publicConfidence'] as Array<keyof EconomicState>).map((key) => {
              const change = finalState[key] - initialState[key];
              const isPositive = change > 0;
              return (
                <div key={key} className="text-center">
                  <div className="text-xs mb-1 capitalize font-medium" style={{ color: '#06402B', fontFamily: 'var(--font-inter)' }}>
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </div>
                  <div className="text-lg font-bold" style={{ color: '#06402B', fontFamily: 'var(--font-inter)' }}>
                    {key === 'publicConfidence'
                      ? `${Math.round(finalState[key])}/100`
                      : `${finalState[key].toFixed(1)}%`}
                  </div>
                  <div
                    className="text-sm font-medium"
                    style={{ color: '#06402B', fontFamily: 'var(--font-inter)' }}
                  >
                    {isPositive ? '+' : ''}
                    {key === 'publicConfidence'
                      ? Math.round(change)
                      : change.toFixed(1)}
                    {key !== 'publicConfidence' && '%'}
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
