import type { EconomicState, Decision, DecisionRecord } from '@/types/simulation';

/**
 * Core simulation engine - applies decisions and calculates state changes
 */

/**
 * Initialize default economic state
 */
export function initializeState(): EconomicState {
  return {
    inflation: 2.5,           // 2.5% inflation (moderate)
    gdpGrowth: 2.8,           // 2.8% GDP growth (healthy)
    unemployment: 5.2,        // 5.2% unemployment (moderate)
    governmentDebt: 65,       // 65% of GDP (moderate)
    publicConfidence: 55,     // 55/100 (neutral-positive)
  };
}

/**
 * Apply a decision's effects to the current economic state
 */
export function applyDecision(
  decision: Decision,
  currentState: EconomicState
): EconomicState {
  const newState: EconomicState = { ...currentState };

  // Apply each effect from the decision
  if (decision.effects.inflation !== undefined) {
    newState.inflation = Math.max(0, newState.inflation + decision.effects.inflation);
  }
  if (decision.effects.gdpGrowth !== undefined) {
    newState.gdpGrowth = Math.max(-10, Math.min(10, newState.gdpGrowth + decision.effects.gdpGrowth));
  }
  if (decision.effects.unemployment !== undefined) {
    newState.unemployment = Math.max(0, Math.min(20, newState.unemployment + decision.effects.unemployment));
  }
  if (decision.effects.governmentDebt !== undefined) {
    newState.governmentDebt = Math.max(0, Math.min(200, newState.governmentDebt + decision.effects.governmentDebt));
  }
  if (decision.effects.publicConfidence !== undefined) {
    newState.publicConfidence = Math.max(0, Math.min(100, newState.publicConfidence + decision.effects.publicConfidence));
  }

  return newState;
}

/**
 * Get the effects that a decision will have (returns delta values)
 */
export function getStateEffects(decision: Decision): Partial<EconomicState> {
  return decision.effects;
}

/**
 * Create a decision record for history tracking
 */
export function createDecisionRecord(
  stepId: string,
  decision: Decision,
  stateBefore: EconomicState,
  stateAfter: EconomicState
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
 * Format state value for display
 */
export function formatStateValue(key: keyof EconomicState, value: number): string {
  switch (key) {
    case 'inflation':
    case 'gdpGrowth':
    case 'unemployment':
    case 'governmentDebt':
      return `${value.toFixed(1)}%`;
    case 'publicConfidence':
      return `${Math.round(value)}/100`;
    default:
      return value.toString();
  }
}
