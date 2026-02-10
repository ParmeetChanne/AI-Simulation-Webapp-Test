import type { Simulation, SimulationState, MetricDefinition } from '@/types/simulation';

/**
 * Elasticity Lab: Gym Membership Pricing
 * Continuous slider-based simulation (custom play UI).
 *
 * Note: The main /play route special-cases this simulation id and renders a custom
 * slider+graph experience instead of the step-based decision engine.
 */

const initialState: SimulationState = {
  price: 12,
};

const metrics: MetricDefinition[] = [];

export const gymElasticitySimulation: Simulation = {
  id: 'microecon-gym-elasticity',
  title: 'Elasticity Lab: Gym Pricing',
  description:
    'You’re the pricing manager for a gym. Adjust price and market conditions to see elastic vs inelastic demand, total revenue, and live elasticity.',
  tags: ['Microeconomics', 'Elasticity', 'Pricing'],
  timeEstimate: '2–3 mins',
  concepts: [
    'Elastic vs inelastic demand',
    'Total revenue',
    'Normal goods',
    'Cross-price elasticity',
    'Short-run vs long-run effects',
  ],
  context:
    `You are the pricing manager for a consumer gym membership business.\n\n` +
    `Your goal is to maximize total revenue by understanding when demand is elastic vs inelastic.\n\n` +
    `Use the sliders to move along the demand curve (price) and to shift or rotate the curve (income, substitutes, preferences, time horizon).`,
  initialState,
  metrics,
  resultsConfig: {
    chartMetrics: [],
    summaryMetrics: [],
  },
  // Placeholder step so /results never treats this as "completed".
  // The dedicated Elasticity play UI is rendered for this simulation id.
  steps: [
    {
      id: 'elasticity_lab',
      event: 'Elasticity lab',
      decisions: [],
      aiExplanation:
        'This lab uses sliders and a demand curve to build intuition for elasticity and total revenue.',
    },
  ],
  reflectionQuestions: [
    'When did raising price increase revenue? When did it decrease revenue?',
    'How did brand loyalty change elasticity?',
    'Why does demand become more elastic in the long run?',
  ],
};

