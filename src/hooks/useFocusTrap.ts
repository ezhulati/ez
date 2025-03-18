import { useRef, useEffect } from 'react';

/**
 * Hook to trap focus within a component (e.g., modal, drawer, dialog)
 * This is an accessibility enhancement for keyboard navigation
 * 
 * @param isActive Boolean to determine if focus trap is active
 * @param onEscape Optional callback function when Escape key is pressed
 */
const useFocusTrap = (isActive: boolean, onEscape?: () => void) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!isActive || !containerRef.current) return;
    
    const container = containerRef.current;
    const focusableElements = container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length === 0) return;
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    // Set initial focus to the first element
    firstElement.focus();
    
    const handleKeyDown = (e: KeyboardEvent) => {
      // Handle escape key
      if (e.key === 'Escape' && onEscape) {
        e.preventDefault();
        onEscape();
        return;
      }
      
      // Handle tab key for focus trap
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          // If shift+tab and on first element, move to last element
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          // If tab and on last element, move to first element
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };
    
    // Add event listener
    document.addEventListener('keydown', handleKeyDown);
    
    // Store the previously focused element
    const previousActiveElement = document.activeElement as HTMLElement;
    
    return () => {
      // Clean up event listener
      document.removeEventListener('keydown', handleKeyDown);
      
      // Restore focus to previously focused element
      if (previousActiveElement) {
        previousActiveElement.focus();
      }
    };
  }, [isActive, onEscape]);
  
  return containerRef;
};

export default useFocusTrap;