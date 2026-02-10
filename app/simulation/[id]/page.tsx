'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import QRCode from '@/components/ui/QRCode';
import { getSimulation } from '@/lib/simulation/registry';
import { resetSession } from '@/lib/simulation/state';
import { fadeInUp } from '@/lib/utils/animations';

export default function SimulationStartPage() {
  const router = useRouter();
  const params = useParams();
  const simulationId = params.id as string;
  const simulation = getSimulation(simulationId);
  const [shareableLink, setShareableLink] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setShareableLink(window.location.href);
    }
  }, []);

  if (!simulation) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
            Simulation not found
          </h1>
          <Button onClick={() => router.push('/')}>Return Home</Button>
        </div>
      </div>
    );
  }

  const handleStart = () => {
    // Reset any existing session
    resetSession(simulationId, simulation.initialState);
    router.push(`/simulation/${simulationId}/play`);
  };

  return (
    <div className="min-h-screen py-8 md:py-12" style={{ backgroundColor: '#FFFFE3' }}>
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="mb-6"
        >
          <button
            onClick={() => router.push('/')}
            className="flex items-center transition-colors mb-4"
            style={{ color: '#06402B', fontFamily: 'var(--font-inter)', fontWeight: 500 }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
          >
            <Icon icon="solar:arrow-left-bold" className="w-5 h-5 mr-2" />
            <span>Back to Home</span>
          </button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - QR Code */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="lg:col-span-1"
          >
            <Card className="text-center">
              <h3 className="text-lg font-bold uppercase mb-4" style={{ fontFamily: 'var(--font-luckiest-guy)', color: '#06402B', letterSpacing: '0.03em' }}>
                Share This Simulation
              </h3>
              <div className="flex justify-center mb-4">
                <QRCode value={shareableLink} size={180} />
              </div>
              <p className="text-sm" style={{ fontFamily: 'var(--font-inter)', letterSpacing: '-0.04em', color: '#06402B', fontWeight: 500 }}>
                Scan to access on mobile or share with others
              </p>
            </Card>
          </motion.div>

          {/* Right Column - Context and Info */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Context Panel */}
            <Card>
              <h2 className="text-2xl font-bold uppercase mb-4" style={{ fontFamily: 'var(--font-luckiest-guy)', color: '#06402B', letterSpacing: '0.03em' }}>
                {simulation.title}
              </h2>
              <div className="max-w-none">
                <p className="text-lg leading-relaxed whitespace-pre-line" style={{ fontFamily: 'var(--font-inter)', letterSpacing: '-0.04em', color: '#06402B', fontWeight: 500 }}>
                  {simulation.context}
                </p>
              </div>
            </Card>

            {/* Reference Section */}
            <Card>
              <h3 className="text-xl font-bold uppercase mb-4 flex items-center" style={{ fontFamily: 'var(--font-luckiest-guy)', color: '#06402B', letterSpacing: '0.03em' }}>
                <Icon icon="solar:book-bookmark-bold" className="w-6 h-6 mr-2" style={{ color: '#06402B' }} />
                Key Concepts & Resources
              </h3>
              <div className="space-y-3">
                <p style={{ fontFamily: 'var(--font-inter)', letterSpacing: '-0.04em', color: '#06402B', fontWeight: 500 }}>
                  This simulation explores the following economic concepts:
                </p>
                <div className="flex flex-wrap gap-2">
                  {simulation.concepts.map((concept) => (
                    <span
                      key={concept}
                      className="px-3 py-1 text-sm font-medium rounded-full border"
                      style={{ backgroundColor: '#FFFFE3', borderColor: '#06402B', color: '#06402B' }}
                    >
                      {concept}
                    </span>
                  ))}
                </div>
                <div className="mt-4 p-4 rounded-lg border-2" style={{ backgroundColor: '#FFFFE3', borderColor: '#06402B' }}>
                  <p className="text-sm italic" style={{ fontFamily: 'var(--font-inter)', letterSpacing: '-0.04em', color: '#06402B', fontWeight: 500 }}>
                    <Icon icon="solar:info-circle-bold" className="w-4 h-4 inline mr-1" />
                    Reference materials and readings can be added here. For now, focus on the core concepts listed above.
                  </p>
                </div>
              </div>
            </Card>

            {/* Bottom Controls */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between pt-4">
              <button
                onClick={() => router.push('/')}
                className="transition-colors flex items-center"
                style={{ color: '#06402B', fontFamily: 'var(--font-inter)', fontWeight: 500 }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
              >
                <Icon icon="solar:home-smile-bold" className="w-5 h-5 mr-2" />
                <span>End Simulation → Home</span>
              </button>
              <button
                onClick={handleStart}
                className="px-8 py-4 text-lg cursor-pointer w-full sm:w-auto"
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
              >
                <Icon icon="solar:play-circle-bold" className="w-5 h-5 inline mr-2" />
                Start
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
