import type { SimulationSession, EconomicState, DecisionRecord } from '@/types/simulation';
import { saveSimulationState, loadSimulationState, clearSimulationState } from '@/lib/utils/storage';

/**
 * State management functions for simulation sessions
 */

/**
 * Create a new simulation session
 */
export function createSession(
  simulationId: string,
  initialState: EconomicState
): SimulationSession {
  const session: SimulationSession = {
    simulationId,
    currentStep: 0,
    state: { ...initialState },
    decisionHistory: [],
    startedAt: Date.now(),
  };

  saveSimulationState(simulationId, session);
  return session;
}

/**
 * Load existing session or create new one
 */
export function getOrCreateSession(
  simulationId: string,
  initialState: EconomicState
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
  newState: EconomicState,
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
 * Reset session (clear and start fresh)
 */
export function resetSession(
  simulationId: string,
  initialState: EconomicState
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
