'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import DemoSwipeCard from '@/components/demo/DemoSwipeCard';
import { fadeInUp } from '@/lib/utils/animations';

export default function DemoSimPage() {
  const router = useRouter();

  return (
    <div
      className="min-h-dvh flex flex-col md:min-h-screen md:block md:py-8 lg:py-12"
      style={{ backgroundColor: '#FFFFE3' }}
    >
      <div className="container mx-auto hidden max-w-7xl px-4 md:block">
        <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="mb-8">
          <button
            type="button"
            onClick={() => router.push('/')}
            className="mb-4 flex items-center transition-colors"
            style={{ color: '#06402B', fontFamily: 'var(--font-inter)', fontWeight: 500 }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.7')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
          >
            <Icon icon="solar:arrow-left-bold" className="mr-2 h-5 w-5" />
            <span>Back to Home</span>
          </button>

          <h1
            className="mb-2 text-3xl font-bold uppercase md:text-5xl"
            style={{
              fontFamily: 'var(--font-luckiest-guy)',
              color: '#06402B',
              letterSpacing: '0.03em',
            }}
          >
            Swipe demo
          </h1>
          <p
            className="max-w-2xl text-base md:text-lg"
            style={{
              fontFamily: 'var(--font-inter)',
              color: '#06402B',
              fontWeight: 500,
              letterSpacing: '-0.04em',
            }}
          >
            Standalone preview of the lecture-style swipe simulation: one decision, accept or reject.
          </p>
        </motion.div>
      </div>

      {/* Phone: full-viewport “screen” only; minimal back control */}
      <button
        type="button"
        onClick={() => router.push('/')}
        className="fixed z-30 flex h-10 w-10 items-center justify-center rounded-full border-2 md:hidden"
        style={{
          top: 'max(0.75rem, env(safe-area-inset-top, 0px))',
          left: 'max(0.75rem, env(safe-area-inset-left, 0px))',
          backgroundColor: '#FFFF94',
          borderColor: '#06402B',
          color: '#06402B',
          boxShadow: '2px 2px 0px 0px #03594D',
        }}
        aria-label="Back to Home"
      >
        <Icon icon="solar:arrow-left-bold" className="h-5 w-5" />
      </button>

      <div className="flex min-h-0 flex-1 flex-col md:container md:mx-auto md:max-w-7xl md:flex-none md:px-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="flex min-h-0 flex-1 justify-center md:min-h-0 md:flex-none"
        >
          <div
            className="flex min-h-0 w-full flex-1 flex-col overflow-hidden border-0 bg-[#FFFFE3] md:aspect-[9/19] md:max-w-[260px] md:flex-none md:rounded-2xl md:border-2 md:border-[#06402B] md:shadow-[4px_4px_0px_0px_#03594D,0px_0px_0px_2px_#06402B]"
          >
            <div className="flex min-h-0 flex-1 flex-col">
              <DemoSwipeCard />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
