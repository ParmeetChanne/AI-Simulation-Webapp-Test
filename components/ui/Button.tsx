'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { buttonPress, buttonRelease } from '@/lib/utils/animations';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  style?: React.CSSProperties;
}

export default function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  type = 'button',
  style,
}: ButtonProps) {
  const baseClasses = 'btn-game font-semibold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantClasses = {
    primary: 'bg-primary-600 hover:bg-primary-700 text-white focus:ring-primary-500',
    secondary: 'bg-game-accent hover:bg-purple-600 text-white focus:ring-purple-500',
    outline: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900 focus:ring-primary-500',
    ghost: 'text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900 focus:ring-primary-500',
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  // If className is provided with custom styling, use it instead of variant classes
  const hasCustomStyling = className.includes('bg-') || className.includes('border-') || className.includes('text-');
  const finalClasses = hasCustomStyling
    ? `${baseClasses} ${sizeClasses[size]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`
    : `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`;

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? buttonPress : {}}
      animate={!disabled ? buttonRelease : {}}
      className={finalClasses}
      style={style}
    >
      {children}
    </motion.button>
  );
}
