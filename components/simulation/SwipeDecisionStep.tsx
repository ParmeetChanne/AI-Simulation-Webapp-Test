'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { Icon } from '@iconify/react';
import type { DecisionStep as DecisionStepType, Decision } from '@/types/simulation';

interface SwipeDecisionStepProps {
  step: DecisionStepType;
  onDecision: (decision: Decision) => void;
  isProcessing?: boolean;
}

function pickDecision(step: DecisionStepType, kind: 'accept' | 'reject'): Decision | undefined {
  const byId = step.decisions.find((d) => d.id === kind);
  if (byId) return byId;

  // Try heuristics for older/alternate ids.
  const byText = step.decisions.find((d) =>
    kind === 'accept'
      ? /accept|right/i.test(d.text)
      : /reject|left/i.test(d.text)
  );
  if (byText) return byText;

  // Fallback: assume [reject, accept] ordering.
  return kind === 'accept' ? step.decisions[1] : step.decisions[0];
}

export default function SwipeDecisionStep({
  step,
  onDecision,
  isProcessing = false,
}: SwipeDecisionStepProps) {
  const [selectedDecision, setSelectedDecision] = useState<Decision | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const reject = useMemo(() => pickDecision(step, 'reject'), [step]);
  const accept = useMemo(() => pickDecision(step, 'accept'), [step]);

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-12, 12]);
  const acceptOpacity = useTransform(x, [40, 120], [0, 1]);
  const rejectOpacity = useTransform(x, [-120, -40], [1, 0]);

  const isDisabled = isProcessing || selectedDecision !== null;

  const handlePick = (decision?: Decision) => {
    if (!decision || isDisabled) return;
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/c4689686-3772-4969-89d9-48002f99311f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'components/simulation/SwipeDecisionStep.tsx:handlePick',message:'Swipe decision picked',data:{stepId:step?.id,decisionId:decision?.id,isDisabled,hasFeedback:!!decision?.feedback},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H3'})}).catch(()=>{});
    // #endregion
    setSelectedDecision(decision);
    if (decision.feedback) setFeedback(decision.feedback);
    onDecision(decision);
  };

  const SWIPE_THRESHOLD = 120;

  return (
    <div className="space-y-6">
      {/* Card area */}
      <div className="relative h-[360px] md:h-[420px]">
        <motion.div
          drag={isDisabled ? false : 'x'}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          style={{ x, rotate }}
          onDragEnd={(_, info) => {
            if (isDisabled) return;
            const offsetX = info.offset.x;
            // #region agent log
            fetch('http://127.0.0.1:7242/ingest/c4689686-3772-4969-89d9-48002f99311f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'components/simulation/SwipeDecisionStep.tsx:onDragEnd',message:'Drag ended',data:{stepId:step?.id,offsetX,threshold:SWIPE_THRESHOLD},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H2'})}).catch(()=>{});
            // #endregion
            if (offsetX > SWIPE_THRESHOLD) {
              handlePick(accept);
            } else if (offsetX < -SWIPE_THRESHOLD) {
              handlePick(reject);
            } else {
              x.set(0);
            }
          }}
          className="absolute inset-0 rounded-2xl border-2 shadow-lg overflow-hidden"
          style={{
            backgroundColor: '#FFFFE3',
            borderColor: '#06402B',
            cursor: isDisabled ? 'not-allowed' : 'grab',
          }}
          whileTap={!isDisabled ? { cursor: 'grabbing' } : {}}
        >
          {/* Swipe labels */}
          <motion.div
            className="absolute top-4 left-4 px-3 py-1 rounded-full border-2 text-sm font-bold uppercase"
            aria-hidden
            style={{ opacity: acceptOpacity, backgroundColor: '#82EDA6', borderColor: '#06402B' }}
          >
            <span style={{ color: '#06402B' }}>Accept</span>
          </motion.div>
          <motion.div
            className="absolute top-4 right-4 px-3 py-1 rounded-full border-2 text-sm font-bold uppercase"
            aria-hidden
            style={{ opacity: rejectOpacity, backgroundColor: '#FFFFE3', borderColor: '#06402B' }}
          >
            <span style={{ color: '#06402B' }}>Reject</span>
          </motion.div>

          <div className="p-6 h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#06402B', fontFamily: 'var(--font-inter)' }}>
                Swipe left or right
              </div>
              <div className="flex items-center gap-2" style={{ color: '#06402B' }}>
                <Icon icon="solar:arrow-left-bold" className="w-4 h-4" />
                <Icon icon="solar:arrow-right-bold" className="w-4 h-4" />
              </div>
            </div>

            <div className="flex-1 overflow-auto">
              <p
                className="text-lg leading-relaxed whitespace-pre-line"
                style={{ fontFamily: 'var(--font-inter)', letterSpacing: '-0.04em', color: '#06402B', fontWeight: 600 }}
              >
                {step.event}
              </p>
            </div>

            <div className="pt-4 text-xs" style={{ color: '#06402B', fontFamily: 'var(--font-inter)', fontWeight: 500 }}>
              Tip: you can also use the buttons below.
            </div>
          </div>
        </motion.div>
      </div>

      {/* Buttons fallback */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={() => handlePick(reject)}
          disabled={isDisabled || !reject}
          className="w-full p-4 rounded-lg border-2 transition-all"
          style={{
            backgroundColor: selectedDecision?.id === reject?.id ? '#82EDA6' : '#FFFFE3',
            borderColor: '#06402B',
            cursor: isDisabled ? 'not-allowed' : 'pointer',
            opacity: isDisabled && selectedDecision?.id !== reject?.id ? 0.5 : 1,
          }}
        >
          <div className="flex items-center justify-between">
            <span style={{ fontFamily: 'var(--font-inter)', letterSpacing: '-0.04em', color: '#06402B', fontWeight: 700 }}>
              Reject
            </span>
            <Icon icon="solar:close-circle-bold" className="w-6 h-6" style={{ color: '#06402B' }} />
          </div>
          <div className="mt-2 text-sm" style={{ fontFamily: 'var(--font-inter)', letterSpacing: '-0.04em', color: '#06402B', fontWeight: 500 }}>
            {reject?.text ?? 'Swipe left'}
          </div>
        </button>

        <button
          onClick={() => handlePick(accept)}
          disabled={isDisabled || !accept}
          className="w-full p-4 rounded-lg border-2 transition-all"
          style={{
            backgroundColor: selectedDecision?.id === accept?.id ? '#82EDA6' : '#FFFFE3',
            borderColor: '#06402B',
            cursor: isDisabled ? 'not-allowed' : 'pointer',
            opacity: isDisabled && selectedDecision?.id !== accept?.id ? 0.5 : 1,
          }}
        >
          <div className="flex items-center justify-between">
            <span style={{ fontFamily: 'var(--font-inter)', letterSpacing: '-0.04em', color: '#06402B', fontWeight: 700 }}>
              Accept
            </span>
            <Icon icon="solar:check-circle-bold" className="w-6 h-6" style={{ color: '#06402B' }} />
          </div>
          <div className="mt-2 text-sm" style={{ fontFamily: 'var(--font-inter)', letterSpacing: '-0.04em', color: '#06402B', fontWeight: 500 }}>
            {accept?.text ?? 'Swipe right'}
          </div>
        </button>
      </div>

      {/* Feedback */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-lg p-4 border-2"
            style={{ backgroundColor: '#FFFFE3', borderColor: '#06402B' }}
          >
            <p style={{ fontFamily: 'var(--font-inter)', letterSpacing: '-0.04em', color: '#06402B', fontWeight: 600 }}>
              {feedback}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Explanation (after decision, when step provides one) */}
      <AnimatePresence>
        {selectedDecision && step.aiExplanation && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-lg p-4 border-2 border-dashed"
            style={{ backgroundColor: '#FFFFE3', borderColor: '#03594D' }}
          >
            <p className="text-sm italic" style={{ fontFamily: 'var(--font-inter)', letterSpacing: '-0.04em', color: '#06402B', fontWeight: 500 }}>
              {step.aiExplanation}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

