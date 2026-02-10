'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import Button from '@/components/ui/Button';
import SimulationCard from '@/components/simulation/SimulationCard';
import SimulationModal from '@/components/simulation/SimulationModal';
import { allSimulations } from '@/lib/simulation/registry';
import { fadeInUp, staggerChildren } from '@/lib/utils/animations';
import type { Simulation } from '@/types/simulation';

// Hide Macroeconomic Policy Simulator from home page for now
const simulations = allSimulations.filter((s) => s.id !== 'macroeconomic-policy');

export default function HomePage() {
  const router = useRouter();
  const [selectedSimulation, setSelectedSimulation] = useState<Simulation | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCardClick = (simulation: Simulation) => {
    setSelectedSimulation(simulation);
    setIsModalOpen(true);
  };

  const handleStartSimulation = () => {
    if (selectedSimulation) {
      router.push(`/simulation/${selectedSimulation.id}`);
    }
  };

  const handleStartDirectly = (simulation: Simulation) => {
    router.push(`/simulation/${simulation.id}`);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFFFE3' }}>
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32" style={{ backgroundColor: '#FFFF94' }}>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerChildren}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.h1
              variants={fadeInUp}
              className="text-4xl md:text-7xl font-bold mb-6 uppercase leading-tight"
              style={{ fontFamily: 'var(--font-luckiest-guy)', color: '#06402B', letterSpacing: '0.03em' }}
            >
              Learn Economics by Running an Economy
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="text-lg font-medium md:text-xl mb-8"
              style={{ fontFamily: 'var(--font-inter)', letterSpacing: '-0.04em', color: '#06402B', fontWeight: 500 }}
            >
              Interactive simulations that turn theory into real decisions.
            </motion.p>
            <motion.div variants={fadeInUp}>
              <button
                onClick={() => handleCardClick(simulations[0]!)}
                className="px-8 py-4 text-lg cursor-pointer"
                style={{ 
                  fontFamily: 'var(--font-inter)',
                  fontWeight: 700,
                  backgroundColor: '#82EDA6',
                  color: '#06402B',
                  letterSpacing: '-0.04em',
                  boxShadow: '4px 4px 0px 0px #03594D, 0px 0px 0px 2px #06402B',
                  border: 'none',
                  borderRadius: '9999px',
                  transition: 'all 0.15s ease',
                  outline: 'none'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '3px 3px 0px 0px #03594D, 0px 0px 0px 2px #06402B';
                  e.currentTarget.style.transform = 'translate(1px, 1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '4px 4px 0px 0px #03594D, 0px 0px 0px 2px #06402B';
                  e.currentTarget.style.transform = 'translate(0px, 0px)';
                }}
                onMouseDown={(e) => {
                  e.currentTarget.style.boxShadow = '2px 2px 0px 0px #03594D, 0px 0px 0px 2px #06402B';
                  e.currentTarget.style.transform = 'translate(2px, 2px)';
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.boxShadow = '3px 3px 0px 0px #03594D, 0px 0px 0px 2px #06402B';
                  e.currentTarget.style.transform = 'translate(1px, 1px)';
                }}
              >
                Explore Simulations
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Choose Simulation Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 uppercase tracking-tight" style={{ color: '#06402B', fontFamily: 'var(--font-luckiest-guy)', letterSpacing: '0.03em' }}>
              Choose a Simulation
            </h2>
            <p className="text-xl" style={{ fontFamily: 'var(--font-inter)', letterSpacing: '-0.04em', color: '#06402B', fontWeight: 500 }}>
              Explore different economic scenarios and see how your decisions shape outcomes
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {simulations.map((simulation, index) => (
              <SimulationCard
                key={simulation.id}
                simulation={simulation}
                onInfoClick={() => handleCardClick(simulation)}
                onStartClick={() => handleStartDirectly(simulation)}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Simulation Modal */}
      <SimulationModal
        simulation={selectedSimulation}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onStart={handleStartSimulation}
      />
    </div>
  );
}
