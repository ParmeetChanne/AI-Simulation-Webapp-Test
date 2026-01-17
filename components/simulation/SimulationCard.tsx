'use client';

import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import Button from '@/components/ui/Button';
import type { Simulation } from '@/types/simulation';

interface SimulationCardProps {
  simulation: Simulation;
  onInfoClick: () => void;
  onStartClick: () => void;
  index: number;
}

export default function SimulationCard({ simulation, onInfoClick, onStartClick, index }: SimulationCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02, y: -4 }}
      className="rounded-xl shadow-lg p-6 border-2"
      style={{ backgroundColor: '#82EDA6', borderColor: '#06402B' }}
    >
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-2xl font-bold uppercase flex-1" style={{ fontFamily: 'var(--font-luckiest-guy)', color: '#06402B', letterSpacing: '0.035em' }}>
          {simulation.title}
        </h3>
        <Icon
          icon="solar:play-circle-bold"
          className="w-6 h-6 flex-shrink-0 ml-2"
          style={{ color: '#06402B' }}
        />
      </div>

      <p className="mb-4 text-lg line-clamp-2" style={{ fontFamily: 'var(--font-inter)', letterSpacing: '-0.04em', color: '#06402B' }}>
        {simulation.description}
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        {simulation.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="px-3 py-1 text-xs font-medium rounded-full border"
            style={{ backgroundColor: '#82EDA6', borderColor: '#06402B', color: '#06402B' }}
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="flex items-center text-sm font-medium mb-4" style={{ color: '#06402B' }}>
        <Icon icon="solar:clock-circle-bold" className="w-4 h-4 mr-1" />
        <span>{simulation.timeEstimate}</span>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          onClick={onInfoClick}
          className="flex-1 px-4 py-2 border-2 font-semibold rounded-lg transition-colors"
          style={{ 
            backgroundColor: '#82EDA6',
            borderColor: '#06402B',
            color: '#06402B'
          }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
        >
          <Icon icon="solar:info-circle-bold" className="w-4 h-4 inline mr-1" />
          Info
        </button>
        <button
          onClick={onStartClick}
          className="flex-1 px-4 py-2 border-2 font-semibold rounded-lg transition-colors text-white"
          style={{ 
            backgroundColor: '#06402B',
            borderColor: '#06402B'
          }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
        >
          <Icon icon="solar:play-circle-bold" className="w-4 h-4 inline mr-1" />
          Start
        </button>
      </div>
    </motion.div>
  );
}
