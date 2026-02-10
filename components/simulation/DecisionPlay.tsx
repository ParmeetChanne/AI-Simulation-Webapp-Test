'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';
import Button from '@/components/ui/Button';
import DecisionStep from '@/components/simulation/DecisionStep';
import SwipeDecisionStep from '@/components/simulation/SwipeDecisionStep';
import RoundSummaryStep from '@/components/simulation/RoundSummaryStep';
import EconomicStateDisplay from '@/components/simulation/EconomicState';
import {
  getOrCreateSession,
  updateSessionState,
  applyExternalEffectsForStep,
  advanceSessionStep,
} from '@/lib/simulation/state';
import { applyDecision, createDecisionRecord, applyEffects } from '@/lib/simulation/engine';
import type { Decision, Simulation, SimulationState } from '@/types/simulation';
import { fadeInUp } from '@/lib/utils/animations';

function isSummaryStepId(stepId: string): boolean {
  return stepId.endsWith('_summary');
}

function getRoundNumber(stepId: string): number | null {
  const match = stepId.match(/^r(\d+)_/i);
  if (!match) return null;
  const n = Number(match[1]);
  return Number.isFinite(n) ? n : null;
}

interface DecisionPlayProps {
  simulationId: string;
  simulation: Simulation | undefined;
}

export default function DecisionPlay({ simulationId, simulation }: DecisionPlayProps) {
  const router = useRouter();

  const [session, setSession] = useState<any>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [previousState, setPreviousState] = useState<SimulationState | undefined>();
  const [isProcessing, setIsProcessing] = useState(false);
  const [decisionProcessed, setDecisionProcessed] = useState(false);

  useEffect(() => {
    if (!simulation) return;

    // Load or create session
    const currentSession = getOrCreateSession(simulationId, simulation.initialState);
    setSession(currentSession);
    setCurrentStepIndex(currentSession.currentStep);
  }, [simulationId, simulation]);

  // Apply external (system-controlled) effects when entering a step that has them
  useEffect(() => {
    if (!session || !simulation) return;
    const step = simulation.steps[currentStepIndex];
    if (!step?.externalEffects) return;
    const applied = session.externalEffectsApplied ?? [];
    if (applied.includes(step.id)) return;

    const newState = applyEffects(session.state, step.externalEffects, simulation.metrics);
    const updated = applyExternalEffectsForStep(simulationId, step.id, newState);
    setSession(updated);
  }, [simulationId, simulation, session, currentStepIndex]);

  if (!simulation) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FFFFE3' }}>
        <div className="text-center">
          <h1
            className="text-2xl font-bold uppercase mb-4"
            style={{ fontFamily: 'var(--font-luckiest-guy)', color: '#06402B', letterSpacing: '0.03em' }}
          >
            Simulation not found
          </h1>
          <Button onClick={() => router.push('/')}>Return Home</Button>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FFFFE3' }}>
        <div
          className="text-lg"
          style={{ fontFamily: 'var(--font-inter)', letterSpacing: '-0.04em', color: '#06402B', fontWeight: 500 }}
        >
          Loading...
        </div>
      </div>
    );
  }

  const currentStep = simulation.steps[currentStepIndex];
  const isLastStep = currentStepIndex >= simulation.steps.length - 1;
  const isSwipeSimulation = simulation.tags?.includes('Swipe') || simulation.id === 'microecon-delivery-platform';
  const isRoundSummary = isSwipeSimulation && currentStep ? isSummaryStepId(currentStep.id) : false;

  const handleDecision = (decision: Decision) => {
    if (isProcessing || !currentStep) return;

    setIsProcessing(true);

    // Store previous state for animation
    setPreviousState({ ...session.state });

    // Apply decision effects
    const newState = applyDecision(decision, session.state, simulation.metrics);

    // Create decision record
    const decisionRecord = createDecisionRecord(currentStep.id, decision, session.state, newState);

    // Update session
    const updatedSession = updateSessionState(simulationId, newState, decisionRecord, currentStepIndex + 1);

    setSession(updatedSession);
    setDecisionProcessed(true);
    setIsProcessing(false);
  };

  const getRoundStartStateForSummary = (): SimulationState => {
    if (!currentStep) return simulation.initialState;
    const round = getRoundNumber(currentStep.id);
    if (!round || round <= 1) return simulation.initialState;

    let decisionsInEarlierRounds = 0;

    for (const step of simulation.steps) {
      if (step.id === currentStep.id) break;

      const stepRound = getRoundNumber(step.id);
      if (!stepRound) continue;
      if (stepRound < round && !isSummaryStepId(step.id)) {
        decisionsInEarlierRounds += 1;
      }
    }

    const idx = decisionsInEarlierRounds - 1;
    const record = session?.decisionHistory?.[idx];
    return record?.stateAfter ?? simulation.initialState;
  };

  const handleContinue = () => {
    if (!currentStep) return;

    if (isLastStep) {
      if (isRoundSummary) {
        // Mark as completed so results page doesn't redirect back to play.
        const advanced = advanceSessionStep(simulationId, simulation.steps.length);
        setSession(advanced);
      }
      router.push(`/simulation/${simulationId}/results`);
    } else {
      if (isRoundSummary) {
        const advanced = advanceSessionStep(simulationId, currentStepIndex + 1);
        setSession(advanced);
      }
      setCurrentStepIndex((prev) => prev + 1);
      setPreviousState(undefined);
      setDecisionProcessed(false);
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const progressPercentage = ((currentStepIndex + 1) / Math.max(1, simulation.steps.length)) * 100;

  if (!currentStep) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FFFFE3' }}>
        <div className="text-center">
          <h1
            className="text-2xl font-bold uppercase mb-4"
            style={{ fontFamily: 'var(--font-luckiest-guy)', color: '#06402B', letterSpacing: '0.03em' }}
          >
            No steps available
          </h1>
          <Button onClick={() => router.push(`/simulation/${simulationId}`)}>Return</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 md:py-12" style={{ backgroundColor: '#FFFFE3' }}>
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
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

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2" style={{ color: '#06402B', fontFamily: 'var(--font-inter)', fontWeight: 500 }}>
              <span>
                Step {Math.min(currentStepIndex + 1, simulation.steps.length)} of {simulation.steps.length}
              </span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <div className="w-full rounded-full h-2 overflow-hidden border-2" style={{ backgroundColor: '#FFFFE3', borderColor: '#06402B' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.5 }}
                className="h-full"
                style={{ backgroundColor: '#06402B' }}
              />
            </div>
          </div>
        </motion.div>

        {/* Economic State Display */}
        <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="mb-8">
          <h2 className="text-xl font-bold uppercase mb-4" style={{ fontFamily: 'var(--font-luckiest-guy)', color: '#06402B', letterSpacing: '0.03em' }}>
            Current State
          </h2>
          <EconomicStateDisplay state={session.state} metrics={simulation.metrics} previousState={previousState} />
        </motion.div>

        {/* Decision Step */}
        {isSwipeSimulation ? (
          <motion.div
            key={currentStep.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25 }}
          >
            {isRoundSummary ? (
              <RoundSummaryStep
                title={
                  isLastStep
                    ? 'Final Summary'
                    : getRoundNumber(currentStep.id)
                      ? `End of Round ${getRoundNumber(currentStep.id)}`
                      : 'Round Summary'
                }
                message={currentStep.event}
                metrics={simulation.metrics}
                roundStartState={getRoundStartStateForSummary()}
                currentState={session.state}
                onContinue={handleContinue}
                isFinal={isLastStep}
              />
            ) : (
              <SwipeDecisionStep step={currentStep} onDecision={handleDecision} isProcessing={isProcessing} />
            )}
          </motion.div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStepIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <DecisionStep step={currentStep} onDecision={handleDecision} isProcessing={isProcessing} />
            </motion.div>
          </AnimatePresence>
        )}

        {/* Continue Button - shown after decision is processed */}
        <AnimatePresence>
          {decisionProcessed && !isRoundSummary && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex justify-end mt-6">
              <button
                onClick={handleContinue}
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
                {isLastStep ? 'View Results' : 'Continue to Next Step'}
                <Icon icon="solar:arrow-right-bold" className="w-5 h-5 inline ml-2" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

