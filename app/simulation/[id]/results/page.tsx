'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import ResultsDashboard from '@/components/simulation/ResultsDashboard';
import DecisionHistory from '@/components/simulation/DecisionHistory';
import { getSimulation } from '@/lib/simulation/registry';
import { getCurrentSession, resetSession } from '@/lib/simulation/state';
import { getConceptDescription } from '@/lib/simulation/conceptDescriptions';
import { formatMetricValue } from '@/lib/simulation/engine';
import type { SimulationResult } from '@/types/simulation';
import { fadeInUp } from '@/lib/utils/animations';

export default function ResultsPage() {
  const router = useRouter();
  const params = useParams();
  const simulationId = params.id as string;
  const simulation = getSimulation(simulationId);

  const [result, setResult] = useState<SimulationResult | null>(null);

  useEffect(() => {
    if (!simulation) return;

    const session = getCurrentSession(simulationId);
    if (!session || session.currentStep < simulation.steps.length) {
      // Not completed, redirect to play
      router.push(`/simulation/${simulationId}/play`);
      return;
    }

    // Create result from session
    const simulationResult: SimulationResult = {
      simulationId,
      initialState: simulation.initialState,
      finalState: session.state,
      decisionHistory: session.decisionHistory,
      completedAt: session.startedAt,
    };

    setResult(simulationResult);
  }, [simulationId, simulation, router]);

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

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FFFFE3' }}>
        <div className="text-lg" style={{ fontFamily: 'var(--font-inter)', letterSpacing: '-0.04em', color: '#06402B', fontWeight: 500 }}>Loading results...</div>
      </div>
    );
  }

  const handleRestart = () => {
    resetSession(simulationId, simulation.initialState);
    router.push(`/simulation/${simulationId}/play`);
  };

  const getNarrativeExplanation = () => {
    const { finalState, initialState } = result;
    const summaryKeys = simulation.resultsConfig?.summaryMetrics ?? simulation.metrics.map((m) => m.key);
    const parts: string[] = [];

    for (const metric of simulation.metrics) {
      if (!summaryKeys.includes(metric.key)) continue;
      const init = initialState[metric.key] ?? 0;
      const final = finalState[metric.key] ?? 0;
      const change = final - init;
      if (Math.abs(change) < 0.01) continue;
      parts.push(
        `${metric.label} went from ${formatMetricValue(init, metric)} to ${formatMetricValue(final, metric)}.`
      );
    }

    return parts.length > 0
      ? 'Your decisions led to these outcomes: ' + parts.join(' ')
      : 'Your decisions created a balanced outcome, with moderate changes across key indicators.';
  };

  return (
    <div className="min-h-screen py-8 md:py-12" style={{ backgroundColor: '#FFFFE3' }}>
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="mb-6"
        >
          <h1 className="text-3xl md:text-4xl font-bold uppercase mb-2" style={{ fontFamily: 'var(--font-luckiest-guy)', color: '#06402B', letterSpacing: '0.03em' }}>
            Simulation Complete!
          </h1>
          <p className="text-lg" style={{ fontFamily: 'var(--font-inter)', letterSpacing: '-0.04em', color: '#06402B', fontWeight: 500 }}>
            Review your decisions and their outcomes
          </p>
        </motion.div>

        {/* Results Dashboard */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="mb-8"
        >
          <ResultsDashboard
            initialState={result.initialState}
            finalState={result.finalState}
            decisionHistory={result.decisionHistory}
            metrics={simulation.metrics}
            resultsConfig={simulation.resultsConfig}
          />
        </motion.div>

        {/* Narrative Explanation */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Card>
            <h2 className="text-xl font-bold uppercase mb-4" style={{ fontFamily: 'var(--font-luckiest-guy)', color: '#06402B', letterSpacing: '0.03em' }}>
              What Happened?
            </h2>
            <p className="text-lg leading-relaxed" style={{ fontFamily: 'var(--font-inter)', letterSpacing: '-0.04em', color: '#06402B', fontWeight: 500 }}>
              {getNarrativeExplanation()}
            </p>
          </Card>
        </motion.div>

        {/* Concept Mapping */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <Card>
            <h2 className="text-xl font-bold uppercase mb-4" style={{ fontFamily: 'var(--font-luckiest-guy)', color: '#06402B', letterSpacing: '0.03em' }}>
              Key Concepts You Explored
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {simulation.concepts.map((concept) => (
                <div
                  key={concept}
                  className="p-4 rounded-lg border-2"
                  style={{ backgroundColor: '#FFFFE3', borderColor: '#06402B' }}
                >
                  <h3 className="font-bold uppercase mb-2" style={{ fontFamily: 'var(--font-luckiest-guy)', color: '#06402B', letterSpacing: '0.03em' }}>
                    {concept}
                  </h3>
                  <p className="text-sm" style={{ fontFamily: 'var(--font-inter)', letterSpacing: '-0.04em', color: '#06402B', fontWeight: 500 }}>
                    {getConceptDescription(concept)}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Decision History */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <Card>
            <DecisionHistory
              decisionHistory={result.decisionHistory}
              simulationSteps={simulation.steps}
            />
          </Card>
        </motion.div>

        {/* Discussion Prompts */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <Card>
            <h2 className="text-xl font-bold uppercase mb-4" style={{ fontFamily: 'var(--font-luckiest-guy)', color: '#06402B', letterSpacing: '0.03em' }}>
              Reflection Questions
            </h2>
            <ul className="space-y-3" style={{ fontFamily: 'var(--font-inter)', letterSpacing: '-0.04em', color: '#06402B', fontWeight: 500 }}>
              {(simulation.reflectionQuestions ?? [
                'What if you had chosen different options at key decision points?',
                'Who benefited from your decisions, and who bore the costs?',
                'How did short-term decisions affect long-term outcomes?',
                'What trade-offs did you face between growth, profit, and satisfaction?',
              ]).map((q) => (
                <li key={q} className="flex items-start">
                  <Icon
                    icon="solar:question-circle-bold"
                    className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0"
                    style={{ color: '#06402B' }}
                  />
                  <span>{q}</span>
                </li>
              ))}
            </ul>
          </Card>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <button
            onClick={handleRestart}
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
            <Icon icon="solar:refresh-bold" className="w-5 h-5 inline mr-2" />
            Restart Simulation
          </button>
          <button
            onClick={() => router.push('/')}
            className="px-8 py-4 text-lg cursor-pointer border-2"
            style={{ 
              fontFamily: 'var(--font-inter)',
              fontWeight: 700,
              backgroundColor: '#FFFFE3',
              color: '#06402B',
              borderColor: '#06402B',
              letterSpacing: '-0.04em',
              borderRadius: '9999px',
              transition: 'all 0.15s ease',
              outline: 'none'
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
          >
            <Icon icon="solar:home-smile-bold" className="w-5 h-5 inline mr-2" />
            Return Home
          </button>
        </motion.div>
      </div>
    </div>
  );
}
