'use client';

import { ReactNode } from 'react';
import { Icon } from '@iconify/react';

interface IPhoneMockupProps {
  children: ReactNode;
  className?: string;
}

export default function IPhoneMockup({ children, className = '' }: IPhoneMockupProps) {
  return (
    <div
      className={`relative w-full max-w-[260px] mx-auto ${className}`}
      style={{ aspectRatio: '9 / 19' }}
    >
      {/* Outer body / bezel */}
      <div
        className="absolute inset-0 rounded-[2.5rem] shadow-2xl"
        style={{
          backgroundColor: '#0a0a0a',
          padding: '10px',
          border: '2px solid #06402B',
        }}
      >
        {/* Side buttons */}
        <span
          className="absolute -left-[3px] top-[88px] w-[3px] h-[28px] rounded-l"
          style={{ backgroundColor: '#1a1a1a' }}
        />
        <span
          className="absolute -left-[3px] top-[128px] w-[3px] h-[48px] rounded-l"
          style={{ backgroundColor: '#1a1a1a' }}
        />
        <span
          className="absolute -left-[3px] top-[188px] w-[3px] h-[48px] rounded-l"
          style={{ backgroundColor: '#1a1a1a' }}
        />
        <span
          className="absolute -right-[3px] top-[148px] w-[3px] h-[72px] rounded-r"
          style={{ backgroundColor: '#1a1a1a' }}
        />

        {/* Inner screen */}
        <div
          className="relative w-full h-full rounded-[2rem] overflow-hidden flex flex-col"
          style={{ backgroundColor: '#FFFFE3' }}
        >
          {/* Notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20 flex items-center justify-center">
            <div
              className="rounded-b-2xl flex items-center justify-center gap-1"
              style={{
                backgroundColor: '#0a0a0a',
                width: '88px',
                height: '20px',
              }}
            >
              <span
                className="rounded-full"
                style={{ width: '6px', height: '6px', backgroundColor: '#1a1a1a' }}
              />
              <span
                className="rounded-full"
                style={{ width: '4px', height: '4px', backgroundColor: '#0d2a1f' }}
              />
            </div>
          </div>

          {/* Status bar */}
          <div
            className="relative z-10 flex items-center justify-between px-4 pt-1.5 pb-1 text-[10px] font-bold"
            style={{ color: '#06402B', fontFamily: 'var(--font-inter)' }}
          >
            <span>9:41</span>
            <span className="flex items-center gap-1">
              <Icon icon="solar:wifi-router-bold" className="w-3 h-3" />
              <Icon icon="solar:battery-full-bold" className="w-4 h-4" />
            </span>
          </div>

          {/* Screen content */}
          <div className="relative flex-1 min-h-0 overflow-hidden">{children}</div>

          {/* Home indicator */}
          <div className="flex justify-center pb-1.5 pt-1">
            <span
              className="rounded-full"
              style={{ width: '50%', height: '3px', backgroundColor: '#06402B', opacity: 0.6 }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
