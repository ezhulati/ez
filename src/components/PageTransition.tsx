import { ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useAppContext } from '../context/AppContext';

interface PageTransitionProps {
  children: ReactNode;
}

/**
 * Page transition component that provides a smooth fade-in effect for page content
 * with accessibility considerations for users who prefer reduced motion
 */
const PageTransition = ({ children }: PageTransitionProps) => {
  const shouldReduceMotion = useReducedMotion();
  const { prefersReducedMotion } = useAppContext();
  
  // Determine if we should use reduced motion
  const reduceMotion = shouldReduceMotion || prefersReducedMotion;
  
  // If reduced motion is preferred, render with minimal animation
  if (reduceMotion) {
    return <div>{children}</div>;
  }
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1.0] }}
      style={{ 
        position: 'relative', 
        zIndex: 1,
        willChange: 'opacity' 
      }}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;