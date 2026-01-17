/**
 * Reusable Framer Motion animation variants and utilities
 */

export const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 },
};

export const staggerChildren = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const springTransition = {
  type: 'spring',
  stiffness: 300,
  damping: 30,
};

export const smoothTransition = {
  duration: 0.3,
  ease: [0.4, 0, 0.2, 1],
};

export const buttonPress = {
  scale: 0.95,
  transition: {
    duration: 0.1,
  },
};

export const buttonRelease = {
  scale: 1,
  transition: {
    duration: 0.2,
    type: 'spring',
    stiffness: 400,
  },
};
