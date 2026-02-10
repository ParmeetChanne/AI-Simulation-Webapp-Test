/**
 * Simulation state is a generic map of metric keys to numeric values.
 * Each simulation defines its own metrics via MetricDefinition[].
 */
export type SimulationState = Record<string, number>;

/**
 * Backward compatibility: macro simulation and others use the same state shape.
 */
export type EconomicState = SimulationState;

/**
 * How a metric is displayed and optionally charted.
 */
export interface MetricDefinition {
  key: string;
  label: string;
  format: 'percent' | 'currency' | 'integer' | 'index'; // index = 0-100 scale
  min?: number;
  max?: number;
  chartType?: 'line' | 'bar';
}

/**
 * Decision Option - A single choice in a decision step
 */
export interface Decision {
  id: string;
  text: string;
  effects: Partial<SimulationState>;
  feedback?: string;
}

/**
 * Decision Step - A single event/decision point in the simulation.
 * externalEffects are applied once when the step is entered (system-controlled shock).
 */
export interface DecisionStep {
  id: string;
  event: string;
  decisions: Decision[];
  externalEffects?: Partial<SimulationState>;
  aiExplanation?: string;
}

/**
 * Configuration for results summary and narrative.
 */
export interface ResultsConfig {
  chartMetrics?: string[]; // metric keys to chart; defaults to all with chartType
  summaryMetrics?: string[]; // metric keys to show in summary cards
}

/**
 * Simulation Metadata - Information about a simulation
 */
export interface Simulation {
  id: string;
  title: string;
  description: string;
  tags: string[];
  timeEstimate: string;
  concepts: string[];
  context: string;
  steps: DecisionStep[];
  initialState: SimulationState;
  metrics: MetricDefinition[];
  resultsConfig?: ResultsConfig;
  reflectionQuestions?: string[];
}

/**
 * Decision Record - Tracks a decision made during simulation
 */
export interface DecisionRecord {
  stepId: string;
  decisionId: string;
  decisionText: string;
  stateBefore: SimulationState;
  stateAfter: SimulationState;
  timestamp: number;
}

/**
 * Simulation Result - Final outcome of a completed simulation
 */
export interface SimulationResult {
  simulationId: string;
  initialState: SimulationState;
  finalState: SimulationState;
  decisionHistory: DecisionRecord[];
  completedAt: number;
}

/**
 * Simulation Session - Active simulation state.
 * externalEffectsApplied: step ids for which external effects have already been applied.
 */
export interface SimulationSession {
  simulationId: string;
  currentStep: number;
  state: SimulationState;
  decisionHistory: DecisionRecord[];
  startedAt: number;
  externalEffectsApplied?: string[];
}
