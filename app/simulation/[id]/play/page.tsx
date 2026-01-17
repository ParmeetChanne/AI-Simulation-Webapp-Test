'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';
import Button from '@/components/ui/Button';
import DecisionStep from '@/components/simulation/DecisionStep';
import EconomicStateDisplay from '@/components/simulation/EconomicState';
import { macroeconomicSimulation } from '@/lib/simulation/macrosim';
import {
  getOrCreateSession,
  updateSessionState,
  getCurrentSession,
} from '@/lib/simulation/state';
import { applyDecision, createDecisionRecord } from '@/lib/simulation/engine';
import type { Decision, EconomicState } from '@/types/simulation';
import { fadeInUp } from '@/lib/utils/animations';

const simulations: Record<string, typeof macroeconomicSimulation> = {
  'macroeconomic-policy': macroeconomicSimulation,
};

export default function PlayPage() {
  const router = useRouter();
  const params = useParams();
  const simulationId = params.id as string;
  const simulation = simulations[simulationId];

  const [session, setSession] = useState<any>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [previousState, setPreviousState] = useState<EconomicState | undefined>();
  const [isProcessing, setIsProcessing] = useState(false);
  const [decisionProcessed, setDecisionProcessed] = useState(false);

  useEffect(() => {
    if (!simulation) return;

    // Load or create session
    const currentSession = getOrCreateSession(simulationId, simulation.initialState);
    setSession(currentSession);
    setCurrentStepIndex(currentSession.currentStep);
  }, [simulationId, simulation]);

  if (!simulation) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FFFFE3' }}>
        <div className="text-center">
          <h1 className="text-2xl font-bold uppercase mb-4" style={{ fontFamily: 'var(--font-luckiest-guy)', color: '#06402B', letterSpacing: '0.03em' }}>
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
        <div className="text-lg" style={{ fontFamily: 'var(--font-inter)', letterSpacing: '-0.04em', color: '#06402B', fontWeight: 500 }}>Loading...</div>
      </div>
    );
  }

  const currentStep = simulation.steps[currentStepIndex];
  const isLastStep = currentStepIndex >= simulation.steps.length - 1;

  const handleDecision = (decision: Decision) => {
    if (isProcessing) return;

    setIsProcessing(true);

    // Store previous state for animation
    setPreviousState({ ...session.state });

    // Apply decision effects
    const newState = applyDecision(decision, session.state);

    // Create decision record
    const decisionRecord = createDecisionRecord(
      currentStep.id,
      decision,
      session.state,
      newState
    );

    // Update session
    const updatedSession = updateSessionState(
      simulationId,
      newState,
      decisionRecord,
      currentStepIndex + 1
    );

    setSession(updatedSession);
    setDecisionProcessed(true);
    setIsProcessing(false);
  };

  const handleContinue = () => {
    if (isLastStep) {
      router.push(`/simulation/${simulationId}/results`);
    } else {
      setCurrentStepIndex(currentStepIndex + 1);
      setPreviousState(undefined);
      setDecisionProcessed(false);
    }
  };

  const progressPercentage = ((currentStepIndex + 1) / simulation.steps.length) * 100;

  return (
    <div className="min-h-screen py-8 md:py-12" style={{ backgroundColor: '#FFFFE3' }}>
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="mb-6"
        >
          <button
            onClick={() => router.push(`/simulation/${simulationId}`)}
            className="flex items-center transition-colors mb-4"
            style={{ color: '#06402B', fontFamily: 'var(--font-inter)', fontWeight: 500 }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
          >
            <Icon icon="solar:arrow-left-bold" className="w-5 h-5 mr-2" />
            <span>Back</span>
          </button>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2" style={{ color: '#06402B', fontFamily: 'var(--font-inter)', fontWeight: 500 }}>
              <span>Step {currentStepIndex + 1} of {simulation.steps.length}</span>
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
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="mb-8"
        >
          <h2 className="text-xl font-bold uppercase mb-4" style={{ fontFamily: 'var(--font-luckiest-guy)', color: '#06402B', letterSpacing: '0.03em' }}>
            Current Economic State
          </h2>
          <EconomicStateDisplay state={session.state} previousState={previousState} />
        </motion.div>

        {/* Decision Step */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStepIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <DecisionStep
              step={currentStep}
              onDecision={handleDecision}
              isProcessing={isProcessing}
            />
          </motion.div>
        </AnimatePresence>

        {/* Continue Button - shown after decision is processed */}
        <AnimatePresence>
          {decisionProcessed && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex justify-end mt-6"
            >
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
