/**
 * Helper functions for smooth scrolling
 */

/**
 * Scrolls to an element with a given ID with smooth animation
 * @param elementId The ID of the element to scroll to
 * @param offset Optional offset from the top of the element (default: 0)
 * @param duration Optional duration of the scroll animation in ms (default: 500)
 */
export const scrollToElement = (elementId: string, offset = 0, duration = 500): void => {
  const element = document.getElementById(elementId);
  if (!element) return;

  const elementPosition = element.getBoundingClientRect().top + window.scrollY;
  const offsetPosition = elementPosition - offset;

  // Use native smooth scrolling if available and preferred
  if ('scrollBehavior' in document.documentElement.style) {
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
    return;
  }

  // Fallback for browsers without smooth scrolling
  const startPosition = window.scrollY;
  const startTime = performance.now();

  const animateScroll = (currentTime: number) => {
    const elapsedTime = currentTime - startTime;
    const progress = Math.min(elapsedTime / duration, 1);
    
    // Easing function - easeInOutCubic
    const easeInOutCubic = progress < 0.5
      ? 4 * progress * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 3) / 2;
    
    window.scrollTo(0, startPosition + (offsetPosition - startPosition) * easeInOutCubic);
    
    if (progress < 1) {
      requestAnimationFrame(animateScroll);
    }
  };

  requestAnimationFrame(animateScroll);
};

/**
 * Handles anchor link clicks with smooth scrolling
 * @param event The click event
 * @param headerHeight Height of fixed header to offset (default: 80)
 */
export const handleAnchorClick = (event: React.MouseEvent<HTMLAnchorElement>, headerHeight = 80): void => {
  const href = event.currentTarget.getAttribute('href');
  
  // Only handle anchor links
  if (href && href.startsWith('#')) {
    event.preventDefault();
    
    const targetId = href.substring(1);
    scrollToElement(targetId, headerHeight);
    
    // Update URL without triggering a page reload
    if (history.pushState) {
      history.pushState(null, '', href);
    }
  }
};

export default { scrollToElement, handleAnchorClick };