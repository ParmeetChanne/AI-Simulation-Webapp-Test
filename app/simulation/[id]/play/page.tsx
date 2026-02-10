'use client';

import { useParams } from 'next/navigation';
import { getSimulation } from '@/lib/simulation/registry';
import DecisionPlay from '@/components/simulation/DecisionPlay';
import ElasticityPlay from '@/components/simulation/ElasticityPlay';

export default function PlayPage() {
  const params = useParams();
  const simulationId = params.id as string;
  const simulation = getSimulation(simulationId);

  if (simulation?.id === 'microecon-gym-elasticity') {
    return <ElasticityPlay simulationId={simulationId} simulation={simulation} />;
  }

  return <DecisionPlay simulationId={simulationId} simulation={simulation} />;
}
