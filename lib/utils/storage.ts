/**
 * localStorage utility functions for simulation state persistence
 */

const STORAGE_PREFIX = 'sim_';

/**
 * Save simulation session to localStorage
 */
export function saveSimulationState(simulationId: string, session: any): void {
  if (typeof window === 'undefined') return;
  
  try {
    const key = `${STORAGE_PREFIX}${simulationId}`;
    localStorage.setItem(key, JSON.stringify(session));
  } catch (error) {
    console.error('Failed to save simulation state:', error);
  }
}

/**
 * Load simulation session from localStorage
 */
export function loadSimulationState(simulationId: string): any | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const key = `${STORAGE_PREFIX}${simulationId}`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Failed to load simulation state:', error);
    return null;
  }
}

/**
 * Clear simulation state from localStorage
 */
export function clearSimulationState(simulationId: string): void {
  if (typeof window === 'undefined') return;
  
  try {
    const key = `${STORAGE_PREFIX}${simulationId}`;
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Failed to clear simulation state:', error);
  }
}

/**
 * Get simulation progress (current step)
 */
export function getSimulationProgress(simulationId: string): number {
  const session = loadSimulationState(simulationId);
  return session?.currentStep ?? 0;
}
