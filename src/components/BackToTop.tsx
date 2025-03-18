import { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../context/AppContext';

/**
 * BackToTop component - Appears when user scrolls down and allows them to quickly
 * get back to the top of the page with a single click
 */
const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { prefersReducedMotion } = useAppContext();

  // Check scroll position to determine visibility
  useEffect(() => {
    const toggleVisibility = () => {
      // Get halfway point of the page
      const halfwayPoint = document.body.scrollHeight / 2;
      
      // Show when scrolled down halfway, accounting for viewport height
      if (window.scrollY > Math.min(halfwayPoint, window.innerHeight * 1.5)) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    
    // Add event listener with passive option for better performance
    window.addEventListener('scroll', toggleVisibility, { passive: true });
    
    // Initial check in case page is already scrolled
    toggleVisibility();
    
    // Cleanup
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);
  
  // Smooth scroll to top
  const scrollToTop = () => {
    if (prefersReducedMotion) {
      // Instant scroll for reduced motion preference
      window.scrollTo(0, 0);
    } else {
      // Smooth scroll for others
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };
  
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.2 }}
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white p-3 rounded-full shadow-lg hover:shadow-blue-500/30 transition-all duration-300"
          aria-label="Back to top"
        >
          <ChevronUp className="h-6 w-6" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default BackToTop;