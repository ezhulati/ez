import { ReactNode, forwardRef, useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useAppContext } from '../context/AppContext';

type AnimatedSectionProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  id?: string;
  // Animation strength options
  distance?: 'none' | 'small' | 'medium' | 'large';
  duration?: 'fast' | 'medium' | 'slow';
  disableOnMobile?: boolean; // New prop to explicitly disable animations on mobile
};

const AnimatedSection = forwardRef<HTMLDivElement, AnimatedSectionProps>(({ 
  children, 
  className = "", 
  delay = 0,
  id,
  distance = 'medium',
  duration = 'medium',
  disableOnMobile = true // Default to true to disable animations on mobile
}, ref) => {
  const [isMobile, setIsMobile] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const { prefersReducedMotion } = useAppContext();
  
  // Only count as animated once to prevent re-triggering animations
  const [hasAnimated, setHasAnimated] = useState(false);
  
  // Determine if we should reduce animations based on context or hook
  const reduceMotion = shouldReduceMotion || prefersReducedMotion;
  
  // Check for mobile device on mount
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkMobile();
    
    // Listen for resize events with debounce
    let resizeTimer: number;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(checkMobile, 100);
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimer);
    };
  }, []);
  
  // Explicitly disable all animations if conditions match
  const shouldDisableAnimations = 
    (isMobile && disableOnMobile) || // Disable on mobile
    reduceMotion ||                  // Respect reduced motion preferences
    distance === 'none';             // Explicitly disabled
  
  // If animations should be disabled, just render the content directly
  if (shouldDisableAnimations) {
    return (
      <div
        ref={ref}
        className={className}
        id={id}
      >
        {children}
      </div>
    );
  }
  
  // Configure animation distance based on props
  const getAnimationDistance = () => {
    switch (distance) {
      case 'small': return 10;
      case 'large': return 30;
      case 'medium': 
      default: return 20;
    }
  };
  
  // Configure animation duration
  const getAnimationDuration = () => {
    switch (duration) {
      case 'fast': return 0.4;
      case 'slow': return 0.8;
      case 'medium':
      default: return 0.6;
    }
  };
  
  // IntersectionObserver setup
  const [inViewRef, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  // Mark as animated when in view
  useEffect(() => {
    if (inView && !hasAnimated) {
      setHasAnimated(true);
    }
  }, [inView, hasAnimated]);
  
  // Animation configuration
  const animationDistance = getAnimationDistance();
  const animationDuration = getAnimationDuration();

  // Used to add hardware acceleration to animations
  const variants = {
    hidden: { 
      opacity: 0, 
      y: animationDistance,
      willChange: 'opacity, transform',
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: animationDuration, 
        ease: [0.25, 0.1, 0.25, 1.0],
        willChange: 'auto',
      }
    }
  };

  return (
    <motion.div
      ref={(node) => {
        // Combine refs
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
        inViewRef(node);
      }}
      variants={variants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      style={{ willChange: 'opacity, transform' }}
      transition={{ 
        delay: hasAnimated ? 0 : delay // Only apply delay on first animation
      }}
      className={className}
      id={id}
    >
      {children}
    </motion.div>
  );
});

AnimatedSection.displayName = 'AnimatedSection';

export default AnimatedSection;