import { useState, useEffect } from 'react';

/**
 * Hook that tracks current screen size and provides device type information
 * @returns Object containing screen size information and device type
 */
export function useScreenSize() {
  const [width, setWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0);
  const [height, setHeight] = useState(typeof window !== 'undefined' ? window.innerHeight : 0);
  const [debounced, setDebounced] = useState(false);

  useEffect(() => {
    // Only run in browser environment
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      // Don't update state while we're debouncing
      if (debounced) return;

      // Set debounce flag
      setDebounced(true);

      // Update state after a short delay to avoid excessive re-renders
      setTimeout(() => {
        setWidth(window.innerWidth);
        setHeight(window.innerHeight);
        setDebounced(false);
      }, 250);
    };

    // Initial values
    setWidth(window.innerWidth);
    setHeight(window.innerHeight);

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Clean up
    return () => window.removeEventListener('resize', handleResize);
  }, [debounced]);

  // Determine device type
  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1024;
  const isDesktop = width >= 1024;
  const isLargeDesktop = width >= 1280;

  // Determine orientation
  const isPortrait = height > width;
  const isLandscape = width > height;

  return {
    width,
    height,
    isMobile,
    isTablet,
    isDesktop,
    isLargeDesktop,
    isPortrait,
    isLandscape,
  };
}

export default useScreenSize;