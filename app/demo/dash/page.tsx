'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import ProfessorAnalyticsDashboard from '@/components/demo/ProfessorAnalyticsDashboard';
import { fadeInUp } from '@/lib/utils/animations';

export default function DemoDashPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen py-8 md:py-12" style={{ backgroundColor: '#FFFFE3' }}>
      <div className="container mx-auto px-4 max-w-7xl">
        <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="mb-8">
          <button
            type="button"
            onClick={() => router.push('/')}
            className="flex items-center transition-opacity mb-4"
            style={{ color: '#06402B', fontFamily: 'var(--font-inter)', fontWeight: 500 }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '0.7';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '1';
            }}
          >
            <Icon icon="solar:arrow-left-bold" className="w-5 h-5 mr-2" />
            <span>Back to Home</span>
          </button>

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            <div>
              <h1
                className="text-3xl md:text-5xl font-bold uppercase mb-2"
                style={{
                  fontFamily: 'var(--font-luckiest-guy)',
                  color: '#06402B',
                  letterSpacing: '0.03em',
                }}
              >
                Class analytics
              </h1>
              <p
                className="text-base md:text-lg max-w-2xl"
                style={{
                  fontFamily: 'var(--font-inter)',
                  color: '#06402B',
                  fontWeight: 500,
                  letterSpacing: '-0.04em',
                }}
              >
                Demo dashboard for professors: cohort trends, simulation mix, and discussion-ready summaries. Data
                shown is illustrative until student analytics are connected.
              </p>
            </div>
            <button
              type="button"
              onClick={() => router.push('/demo/prof')}
              className="self-start lg:self-auto px-5 py-3 text-sm font-bold uppercase rounded-full border-2 transition-opacity"
              style={{
                backgroundColor: '#82EDA6',
                borderColor: '#06402B',
                color: '#06402B',
                fontFamily: 'var(--font-inter)',
                letterSpacing: '0.03em',
                boxShadow: '3px 3px 0px 0px #03594D',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '0.92';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '1';
              }}
            >
              <Icon icon="solar:document-text-bold" className="w-5 h-5 inline mr-2" />
              Professor studio
            </button>
          </div>
        </motion.div>

        <ProfessorAnalyticsDashboard />
      </div>
    </div>
  );
}
