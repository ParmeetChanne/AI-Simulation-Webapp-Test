'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode } from 'react';
import { Icon } from '@iconify/react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
}

export default function Modal({ isOpen, onClose, children, title }: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border-2"
              style={{ backgroundColor: '#FFFFE3', borderColor: '#06402B' }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6" style={{ borderBottom: '2px solid #06402B' }}>
                {title && (
                  <h2 className="text-2xl font-bold uppercase" style={{ fontFamily: 'var(--font-luckiest-guy)', color: '#06402B', letterSpacing: '0.03em' }}>
                    {title}
                  </h2>
                )}
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg transition-colors"
                  style={{ color: '#06402B' }}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                  aria-label="Close modal"
                >
                  <Icon icon="solar:close-circle-bold" className="w-6 h-6" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">{children}</div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
