'use client';

import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import type { DecisionRecord } from '@/types/simulation';

interface DecisionHistoryProps {
  decisionHistory: DecisionRecord[];
  simulationSteps: Array<{ id: string; event: string }>;
}

export default function DecisionHistory({
  decisionHistory,
  simulationSteps,
}: DecisionHistoryProps) {
  const getStepEvent = (stepId: string) => {
    return simulationSteps.find((step) => step.id === stepId)?.event || 'Unknown event';
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold uppercase mb-4" style={{ fontFamily: 'var(--font-luckiest-guy)', color: '#06402B', letterSpacing: '0.03em' }}>
        Your Decision Journey
      </h3>
      <div className="space-y-4">
        {decisionHistory.map((record, index) => (
          <motion.div
            key={record.timestamp}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="rounded-lg p-4 border-2"
            style={{ backgroundColor: '#FFFFE3', borderColor: '#06402B' }}
          >
            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-4 mt-1 border-2" style={{ backgroundColor: '#82EDA6', borderColor: '#06402B' }}>
                <span className="text-sm font-bold" style={{ color: '#06402B', fontFamily: 'var(--font-inter)' }}>
                  {index + 1}
                </span>
              </div>
              <div className="flex-1">
                <p className="text-sm mb-1 line-clamp-2" style={{ fontFamily: 'var(--font-inter)', letterSpacing: '-0.04em', color: '#06402B', fontWeight: 500 }}>
                  {getStepEvent(record.stepId)}
                </p>
                <p className="font-semibold" style={{ fontFamily: 'var(--font-inter)', letterSpacing: '-0.04em', color: '#06402B', fontWeight: 600 }}>
                  {record.decisionText}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
