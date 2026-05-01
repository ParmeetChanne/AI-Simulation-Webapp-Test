import { allSimulations } from '@/lib/simulation/registry';

/** Demo-only aggregate analytics. Replace with API data when available. */
export interface CohortKpis {
  totalCompletions: number;
  completionRatePercent: number;
  avgDecisionsPerRun: number;
  activeSimulationsCount: number;
}

export interface TimeSeriesPoint {
  label: string;
  completions: number;
}

export interface SimulationCompletionRow {
  simulationId: string;
  title: string;
  completions: number;
}

export interface OutcomeMixSlice {
  label: string;
  value: number;
  color: string;
}

export interface RadarAxisScore {
  label: string;
  value: number;
}

const MOCK_COMPLETIONS_BY_ID: Record<string, number> = {
  'macroeconomic-policy': 38,
  'microecon-cafe': 124,
  'microecon-delivery-platform': 96,
  'microecon-gym-elasticity': 71,
};

export function getCohortKpis(): CohortKpis {
  return {
    totalCompletions: 847,
    completionRatePercent: 87,
    avgDecisionsPerRun: 6.2,
    activeSimulationsCount: allSimulations.length,
  };
}

/** Last 14 days, weekday labels */
export function getCompletionsTimeSeries(): TimeSeriesPoint[] {
  return [
    { label: 'Mon', completions: 42 },
    { label: 'Tue', completions: 58 },
    { label: 'Wed', completions: 51 },
    { label: 'Thu', completions: 67 },
    { label: 'Fri', completions: 89 },
    { label: 'Sat', completions: 34 },
    { label: 'Sun', completions: 28 },
    { label: 'Mon', completions: 55 },
    { label: 'Tue', completions: 62 },
    { label: 'Wed', completions: 71 },
    { label: 'Thu', completions: 78 },
    { label: 'Fri', completions: 94 },
    { label: 'Sat', completions: 41 },
    { label: 'Sun', completions: 33 },
  ];
}

export function getCompletionsBySimulation(): SimulationCompletionRow[] {
  return allSimulations.map((s) => ({
    simulationId: s.id,
    title: s.title,
    completions: MOCK_COMPLETIONS_BY_ID[s.id] ?? 20,
  }));
}

export function getOutcomePathMix(): OutcomeMixSlice[] {
  return [
    { label: 'Growth-focused', value: 28, color: '#06402B' },
    { label: 'Balanced trade-offs', value: 41, color: '#03594D' },
    { label: 'Risk-averse / stable', value: 19, color: '#0d5c3d' },
    { label: 'Experimental paths', value: 12, color: '#82EDA6' },
  ];
}

/** Synthetic 0–100 rubric scores for cohort discussion prep */
export function getCohortSkillRadar(): RadarAxisScore[] {
  return [
    { label: 'Concept recall', value: 76 },
    { label: 'Trade-off reasoning', value: 68 },
    { label: 'Data interpretation', value: 72 },
    { label: 'Decision speed', value: 64 },
    { label: 'Reflection depth', value: 81 },
  ];
}
