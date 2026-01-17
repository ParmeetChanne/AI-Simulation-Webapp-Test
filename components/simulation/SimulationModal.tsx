'use client';

import { Icon } from '@iconify/react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import QRCode from '@/components/ui/QRCode';
import type { Simulation } from '@/types/simulation';

interface SimulationModalProps {
  simulation: Simulation | null;
  isOpen: boolean;
  onClose: () => void;
  onStart: () => void;
}

export default function SimulationModal({
  simulation,
  isOpen,
  onClose,
  onStart,
}: SimulationModalProps) {
  if (!simulation) return null;

  const shareableLink = typeof window !== 'undefined' 
    ? `${window.location.origin}/simulation/${simulation.id}`
    : '';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={simulation.title}>
      <div className="space-y-6">
        {/* Description */}
        <p className="text-lg" style={{ fontFamily: 'var(--font-inter)', letterSpacing: '-0.04em', color: '#06402B', fontWeight: 500 }}>
          {simulation.description}
        </p>

        {/* What you'll do */}
        <div>
          <h3 className="text-lg font-bold mb-2 uppercase" style={{ fontFamily: 'var(--font-luckiest-guy)', color: '#06402B', letterSpacing: '0.03em' }}>
            What you&apos;ll do:
          </h3>
          <ul className="list-disc list-inside space-y-1" style={{ fontFamily: 'var(--font-inter)', letterSpacing: '-0.04em', color: '#06402B', fontWeight: 500 }}>
            <li>Make critical economic policy decisions as an Economic Policy Advisor</li>
            <li>See real-time impacts on inflation, GDP, unemployment, and more</li>
            <li>Experience how policy choices create trade-offs and consequences</li>
            <li>Learn key macroeconomic concepts through interactive decision-making</li>
          </ul>
        </div>

        {/* Concepts */}
        <div>
          <h3 className="text-lg font-bold mb-2 uppercase" style={{ fontFamily: 'var(--font-luckiest-guy)', color: '#06402B', letterSpacing: '0.03em' }}>
            Concepts you&apos;ll explore:
          </h3>
          <div className="flex flex-wrap gap-2">
            {simulation.concepts.map((concept) => (
              <span
                key={concept}
                className="px-3 py-1 text-sm font-medium rounded-full border"
                style={{ backgroundColor: '#82EDA6', borderColor: '#06402B', color: '#06402B' }}
              >
                {concept}
              </span>
            ))}
          </div>
        </div>

        {/* Time Estimate */}
        <div className="flex items-center text-sm font-medium" style={{ color: '#06402B' }}>
          <Icon icon="solar:clock-circle-bold" className="w-5 h-5 mr-2" />
          <span>Time to complete: <strong>{simulation.timeEstimate}</strong></span>
        </div>

        {/* QR Code and Share Link */}
        <div className="pt-6" style={{ borderTop: '2px solid #06402B' }}>
          <h3 className="text-lg font-bold mb-4 uppercase" style={{ fontFamily: 'var(--font-luckiest-guy)', color: '#06402B', letterSpacing: '0.03em' }}>
            Share this simulation:
          </h3>
          <div className="flex flex-col md:flex-row items-center gap-6">
            <QRCode value={shareableLink} size={150} />
            <div className="flex-1">
              <p className="text-sm mb-2" style={{ fontFamily: 'var(--font-inter)', letterSpacing: '-0.04em', color: '#06402B', fontWeight: 500 }}>
                Shareable link:
              </p>
              <div className="flex items-center gap-2 p-3 rounded-lg border-2" style={{ backgroundColor: '#82EDA6', borderColor: '#06402B' }}>
                <input
                  type="text"
                  value={shareableLink}
                  readOnly
                  className="flex-1 bg-transparent text-sm outline-none"
                  style={{ color: '#06402B', fontFamily: 'var(--font-inter)' }}
                  onClick={(e) => (e.target as HTMLInputElement).select()}
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(shareableLink);
                  }}
                  className="p-1 rounded transition-colors"
                  style={{ color: '#06402B' }}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                  aria-label="Copy link"
                >
                  <Icon icon="solar:copy-bold" className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Start Button */}
        <div className="flex justify-end pt-4" style={{ borderTop: '2px solid #06402B' }}>
          <button
            onClick={onStart}
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
          >
            Start Simulation
          </button>
        </div>
      </div>
    </Modal>
  );
}
