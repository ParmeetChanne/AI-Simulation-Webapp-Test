import type { Simulation } from '@/types/simulation';
import { macroeconomicSimulation } from './macrosim';
import { cafeSimulation } from './cafesim';
import { deliveryPlatformSimulation } from './deliverysim';
import { gymElasticitySimulation } from './elasticitysim';

const all: Simulation[] = [
  macroeconomicSimulation,
  cafeSimulation,
  deliveryPlatformSimulation,
  gymElasticitySimulation,
];

const byId: Record<string, Simulation> = Object.fromEntries(
  all.map((s) => [s.id, s])
);

export const allSimulations: Simulation[] = all;
export const simulationById: Record<string, Simulation> = byId;

export function getSimulation(id: string): Simulation | undefined {
  return byId[id];
}
