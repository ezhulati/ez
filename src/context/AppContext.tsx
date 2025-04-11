import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define the shape of our context
interface AppContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  isPricingOpen: boolean;
  setIsPricingOpen: (isOpen: boolean) => void;
  isScheduleOpen: boolean;
  setIsScheduleOpen: (isOpen: boolean) => void;
  isResultsOpen: boolean;
  setIsResultsOpen: (isOpen: boolean) => void;
  isScrolled: boolean;
  prefersReducedMotion: boolean;
}

// Create the context with a default value
const AppContext = createContext<AppContextType>({
  isDarkMode: true,
  toggleDarkMode: () => {},
  isPricingOpen: false,
  setIsPricingOpen: () => {},
  isScheduleOpen: false,
  setIsScheduleOpen: () => {},
  isResultsOpen: false,
  setIsResultsOpen: () => {},
  isScrolled: false,
  prefersReducedMotion: false,
});

// Provider component
interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
  // State for dark mode
  const [isDarkMode, setIsDarkMode] = useState(true); // Default to dark
  
  // Modal states
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [isResultsOpen, setIsResultsOpen] = useState(false);
  
  // Scroll state
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Check for reduced motion preference
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  
  // Initialize dark mode from localStorage with validation
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('theme');
      // Only change from default if explicitly set to light and valid
      if (savedTheme === 'light') {
        setIsDarkMode(false);
        document.documentElement.classList.remove('dark');
      } else {
        // Default is dark mode
        setIsDarkMode(true);
        document.documentElement.classList.add('dark');
      }
    } catch (e) {
      console.error('Error reading theme preference:', e);
      // Default to dark mode if there's an error
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
    
    // Force reduced motion by default (to avoid glitches)
    setPrefersReducedMotion(true);
    
    // Check for reduced motion preference (if users explicitly want animations)
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setPrefersReducedMotion(true);
    }
    
    // Listen for changes in reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleMotionPreferenceChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    
    // Add event listener (use appropriate method depending on browser support)
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleMotionPreferenceChange);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handleMotionPreferenceChange);
    }
    
    return () => {
      // Clean up listener
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleMotionPreferenceChange);
      } else {
        // Fallback for older browsers
        mediaQuery.removeListener(handleMotionPreferenceChange);
      }
    };
  }, []);
  
  // Toggle dark mode function
  const toggleDarkMode = () => {
    setIsDarkMode(prev => {
      const newMode = !prev;
      if (newMode) {
        document.documentElement.classList.add('dark');
        try {
          localStorage.setItem('theme', 'dark');
        } catch (e) {
          console.error('Error saving theme preference:', e);
        }
      } else {
        document.documentElement.classList.remove('dark');
        try {
          localStorage.setItem('theme', 'light');
        } catch (e) {
          console.error('Error saving theme preference:', e);
        }
      }
      return newMode;
    });
  };
  
  // Handle scroll events
  useEffect(() => {
    // Use a variable to track if we need to update
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        // Use requestAnimationFrame to limit updates
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 20);
          ticking = false;
        });
        
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Context value
  const value = {
    isDarkMode,
    toggleDarkMode,
    isPricingOpen,
    setIsPricingOpen,
    isScheduleOpen,
    setIsScheduleOpen,
    isResultsOpen,
    setIsResultsOpen,
    isScrolled,
    prefersReducedMotion,
  };
  
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Custom hook to use the context
export const useAppContext = () => useContext(AppContext);

export default AppContext;