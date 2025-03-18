import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';

type AnimatedTextProps = {
  text: string;
  className?: string;
  once?: boolean;
  delay?: number;
};

const AnimatedText = ({ text, className = "", once = true, delay = 0 }: AnimatedTextProps) => {
  const [isMobile, setIsMobile] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const { prefersReducedMotion } = useAppContext();
  
  // Determine if animations should be reduced
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
  
  // If on mobile or reduced motion is preferred, render without animation
  if (isMobile || reduceMotion) {
    return <div className={className}>{text}</div>;
  }
  
  // Split text into words
  const words = text.split(' ');
  
  // Simplified animation for many words
  if (words.length > 6) {
    return (
      <motion.div
        className={className}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.4, delay }}
        viewport={{ once, margin: "-10px" }}
      >
        {text}
      </motion.div>
    );
  }
  
  // Animation variants for word-by-word animation
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { 
        staggerChildren: 0.06, 
        delayChildren: delay,
        ease: [0.25, 0.1, 0.25, 1.0],
      }
    }
  };
  
  const word = {
    hidden: {
      opacity: 0,
      y: 10,
      willChange: 'opacity, transform',
    },
    visible: {
      opacity: 1,
      y: 0,
      willChange: 'auto',
      transition: {
        duration: 0.4,
        ease: [0.25, 0.1, 0.25, 1.0]
      }
    }
  };
  
  return (
    <motion.div
      className={className}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-50px" }}
      style={{ overflow: 'hidden' }}
    >
      {words.map((word, index) => (
        <motion.span
          key={index}
          variants={word}
          style={{ 
            display: 'inline-block', 
            marginRight: '0.25em',
            willChange: 'opacity, transform' 
          }}
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
};

export default AnimatedText;