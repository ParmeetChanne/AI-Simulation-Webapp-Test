import type { SimulationSession, SimulationState, DecisionRecord } from '@/types/simulation';
import { saveSimulationState, loadSimulationState, clearSimulationState } from '@/lib/utils/storage';

/**
 * State management functions for simulation sessions
 */

/**
 * Create a new simulation session
 */
export function createSession(
  simulationId: string,
  initialState: SimulationState
): SimulationSession {
  const session: SimulationSession = {
    simulationId,
    currentStep: 0,
    state: { ...initialState },
    decisionHistory: [],
    startedAt: Date.now(),
    externalEffectsApplied: [],
  };

  saveSimulationState(simulationId, session);
  return session;
}

/**
 * Load existing session or create new one
 */
export function getOrCreateSession(
  simulationId: string,
  initialState: SimulationState
): SimulationSession {
  const existing = loadSimulationState(simulationId);
  
  if (existing && existing.simulationId === simulationId) {
    return existing as SimulationSession;
  }

  return createSession(simulationId, initialState);
}

/**
 * Update session state after a decision
 */
export function updateSessionState(
  simulationId: string,
  newState: SimulationState,
  decisionRecord: DecisionRecord,
  nextStep: number
): SimulationSession {
  const session = loadSimulationState(simulationId) as SimulationSession;
  
  if (!session) {
    throw new Error('Session not found');
  }

  const updatedSession: SimulationSession = {
    ...session,
    state: newState,
    currentStep: nextStep,
    decisionHistory: [...session.decisionHistory, decisionRecord],
  };

  saveSimulationState(simulationId, updatedSession);
  return updatedSession;
}

/**
 * Advance the current step without adding a decision record.
 * Useful for informational/interstitial steps (e.g. round summaries).
 */
export function advanceSessionStep(
  simulationId: string,
  nextStep: number
): SimulationSession {
  const session = loadSimulationState(simulationId) as SimulationSession;
  if (!session) {
    throw new Error('Session not found');
  }

  const updatedSession: SimulationSession = {
    ...session,
    currentStep: nextStep,
  };

  saveSimulationState(simulationId, updatedSession);
  return updatedSession;
}

/**
 * Apply external effects for a step once and persist (step id marked as applied).
 */
export function applyExternalEffectsForStep(
  simulationId: string,
  stepId: string,
  newState: SimulationState
): SimulationSession {
  const session = loadSimulationState(simulationId) as SimulationSession;
  if (!session) throw new Error('Session not found');

  const applied = session.externalEffectsApplied ?? [];
  if (applied.includes(stepId)) return session;

  const updatedSession: SimulationSession = {
    ...session,
    state: newState,
    externalEffectsApplied: [...applied, stepId],
  };
  saveSimulationState(simulationId, updatedSession);
  return updatedSession;
}

/**
 * Reset session (clear and start fresh)
 */
export function resetSession(
  simulationId: string,
  initialState: SimulationState
): SimulationSession {
  clearSimulationState(simulationId);
  return createSession(simulationId, initialState);
}

/**
 * Get current session
 */
export function getCurrentSession(simulationId: string): SimulationSession | null {
  return loadSimulationState(simulationId) as SimulationSession | null;
}
