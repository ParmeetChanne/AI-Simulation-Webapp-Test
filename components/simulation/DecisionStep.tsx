'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { DecisionStep as DecisionStepType, Decision } from '@/types/simulation';

interface DecisionStepProps {
  step: DecisionStepType;
  onDecision: (decision: Decision) => void;
  isProcessing?: boolean;
}

export default function DecisionStep({ step, onDecision, isProcessing = false }: DecisionStepProps) {
  const [selectedDecision, setSelectedDecision] = useState<Decision | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleDecisionClick = (decision: Decision) => {
    if (isProcessing || selectedDecision !== null) return;

    setSelectedDecision(decision);
    if (decision.feedback) {
      setFeedback(decision.feedback);
    }
    // Immediately process the decision to update state
    onDecision(decision);
  };

  return (
    <div className="space-y-6">
      {/* Event Narrative */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl p-6 border-2"
        style={{ backgroundColor: '#FFFFE3', borderColor: '#06402B', borderLeft: '4px solid #06402B' }}
      >
        <p className="text-lg leading-relaxed whitespace-pre-line" style={{ fontFamily: 'var(--font-inter)', letterSpacing: '-0.04em', color: '#06402B', fontWeight: 500 }}>
          {step.event}
        </p>
      </motion.div>

      {/* Feedback Message */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-lg p-4 border-2"
            style={{ backgroundColor: '#FFFFE3', borderColor: '#06402B' }}
          >
            <p className="font-medium" style={{ fontFamily: 'var(--font-inter)', letterSpacing: '-0.04em', color: '#06402B', fontWeight: 500 }}>{feedback}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Decision Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {step.decisions.map((decision, index) => {
          const isSelected = selectedDecision?.id === decision.id;
          const isDisabled = isProcessing || (selectedDecision !== null && selectedDecision.id !== decision.id);

          return (
            <motion.div
              key={decision.id}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={!isDisabled ? { scale: 1.02 } : {}}
              whileTap={!isDisabled ? { scale: 0.98 } : {}}
            >
              <button
                onClick={() => handleDecisionClick(decision)}
                disabled={isDisabled}
                className="w-full p-4 text-left rounded-lg border-2 transition-all"
                style={{
                  backgroundColor: isSelected ? '#82EDA6' : '#FFFFE3',
                  borderColor: '#06402B',
                  cursor: isDisabled ? 'not-allowed' : 'pointer',
                  opacity: isDisabled ? 0.5 : 1,
                  boxShadow: isSelected ? '0px 4px 6px rgba(0, 0, 0, 0.1)' : 'none'
                }}
              >
                <div className="flex items-start">
                  <div
                    className="flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center mr-3 mt-0.5"
                    style={{
                      borderColor: '#06402B',
                      backgroundColor: isSelected ? '#06402B' : 'transparent'
                    }}
                  >
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: '#FFFFE3' }}
                      />
                    )}
                  </div>
                  <span
                    className={isSelected ? 'font-semibold' : ''}
                    style={{ fontFamily: 'var(--font-inter)', letterSpacing: '-0.04em', color: '#06402B', fontWeight: isSelected ? 600 : 500 }}
                  >
                    {decision.text}
                  </span>
                </div>
              </button>
            </motion.div>
          );
        })}
      </div>

    </div>
  );
}
