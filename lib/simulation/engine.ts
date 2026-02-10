import type {
  SimulationState,
  Decision,
  DecisionRecord,
  MetricDefinition,
} from '@/types/simulation';

/**
 * Core simulation engine - applies decisions and calculates state changes
 */

/**
 * Initialize default economic state (macro simulation)
 */
export function initializeState(): SimulationState {
  return {
    inflation: 2.5,
    gdpGrowth: 2.8,
    unemployment: 5.2,
    governmentDebt: 65,
    publicConfidence: 55,
  };
}

/**
 * Clamp a value using optional min/max from a metric definition
 */
function clampValue(
  value: number,
  metric?: MetricDefinition
): number {
  if (!metric) return value;
  let result = value;
  if (metric.min !== undefined) result = Math.max(metric.min, result);
  if (metric.max !== undefined) result = Math.min(metric.max, result);
  return result;
}

/**
 * Apply a delta map to state, with optional clamping by metric definitions.
 */
export function applyEffects(
  currentState: SimulationState,
  effects: Partial<SimulationState>,
  metrics?: MetricDefinition[]
): SimulationState {
  const metricMap = new Map(metrics?.map((m) => [m.key, m]) ?? []);
  const newState: SimulationState = { ...currentState };

  for (const [key, delta] of Object.entries(effects)) {
    if (delta === undefined) continue;
    const prev = newState[key] ?? 0;
    const metric = metricMap.get(key);
    newState[key] = clampValue(prev + delta, metric);
  }

  return newState;
}

/**
 * Apply a decision's effects to the current state.
 */
export function applyDecision(
  decision: Decision,
  currentState: SimulationState,
  metrics?: MetricDefinition[]
): SimulationState {
  return applyEffects(currentState, decision.effects, metrics);
}

/**
 * Get the effects that a decision will have (returns delta values)
 */
export function getStateEffects(decision: Decision): Partial<SimulationState> {
  return decision.effects;
}

/**
 * Create a decision record for history tracking
 */
export function createDecisionRecord(
  stepId: string,
  decision: Decision,
  stateBefore: SimulationState,
  stateAfter: SimulationState
): DecisionRecord {
  return {
    stepId,
    decisionId: decision.id,
    decisionText: decision.text,
    stateBefore: { ...stateBefore },
    stateAfter: { ...stateAfter },
    timestamp: Date.now(),
  };
}

/**
 * Format a single metric value for display
 */
export function formatMetricValue(
  value: number,
  metric: MetricDefinition
): string {
  switch (metric.format) {
    case 'percent':
      return `${value.toFixed(1)}%`;
    case 'currency':
      return `$${value.toFixed(2)}`;
    case 'integer':
      return Math.round(value).toString();
    case 'index':
      return `${Math.round(value)}/100`;
    default:
      return value.toString();
  }
}

/**
 * Get satisfaction-style label from a 0-100 index (for display only)
 */
export function getIndexLabel(value: number): 'High' | 'Medium' | 'Low' {
  if (value >= 70) return 'High';
  if (value >= 40) return 'Medium';
  return 'Low';
}

/**
 * Legacy: format state value by key (for backward compat when no metric def).
 * Prefer formatMetricValue when simulation.metrics is available.
 */
export function formatStateValue(key: string, value: number): string {
  const percentKeys = ['inflation', 'gdpGrowth', 'unemployment', 'governmentDebt'];
  if (percentKeys.includes(key)) return `${value.toFixed(1)}%`;
  if (key === 'publicConfidence') return `${Math.round(value)}/100`;
  return value.toString();
}
