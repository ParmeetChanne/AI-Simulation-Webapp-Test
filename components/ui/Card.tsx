'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export default function Card({ children, className = '', hover = false, onClick }: CardProps) {
  const baseClasses = 'rounded-xl shadow-lg p-6 border-2';
  const hoverClasses = hover ? 'card-hover cursor-pointer' : '';

  const props = onClick
    ? {
        onClick,
        whileHover: { scale: 1.02, y: -4 },
        whileTap: { scale: 0.98 },
      }
    : {};

  return (
    <motion.div
      {...props}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`${baseClasses} ${hoverClasses} ${className}`}
      style={{ backgroundColor: '#82EDA6', borderColor: '#06402B' }}
    >
      {children}
    </motion.div>
  );
}
