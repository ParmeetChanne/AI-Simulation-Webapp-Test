/**
 * Economic State - Core simulation state variables
 */
export interface EconomicState {
  inflation: number;        // Inflation rate (%)
  gdpGrowth: number;        // GDP Growth rate (%)
  unemployment: number;     // Unemployment rate (%)
  governmentDebt: number;   // Government debt (% of GDP)
  publicConfidence: number; // Public confidence index (0-100)
}

/**
 * Decision Option - A single choice in a decision step
 */
export interface Decision {
  id: string;
  text: string;
  effects: Partial<EconomicState>; // State changes this decision causes
  feedback?: string; // Optional narrative feedback after selection
}

/**
 * Decision Step - A single event/decision point in the simulation
 */
export interface DecisionStep {
  id: string;
  event: string; // Narrative event description
  decisions: Decision[]; // Array of 4 decision options
}

/**
 * Simulation Metadata - Information about a simulation
 */
export interface Simulation {
  id: string;
  title: string;
  description: string;
  tags: string[];
  timeEstimate: string; // e.g., "2-3 mins"
  concepts: string[]; // Economic concepts covered
  context: string; // Story context for the simulation
  steps: DecisionStep[];
  initialState: EconomicState;
}

/**
 * Decision Record - Tracks a decision made during simulation
 */
export interface DecisionRecord {
  stepId: string;
  decisionId: string;
  decisionText: string;
  stateBefore: EconomicState;
  stateAfter: EconomicState;
  timestamp: number;
}

/**
 * Simulation Result - Final outcome of a completed simulation
 */
export interface SimulationResult {
  simulationId: string;
  initialState: EconomicState;
  finalState: EconomicState;
  decisionHistory: DecisionRecord[];
  completedAt: number;
}

/**
 * Simulation Session - Active simulation state
 */
export interface SimulationSession {
  simulationId: string;
  currentStep: number;
  state: EconomicState;
  decisionHistory: DecisionRecord[];
  startedAt: number;
}
