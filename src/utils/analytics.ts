// Simple analytics utility
// This is a privacy-friendly analytics solution that doesn't use cookies

/**
 * Track page views
 * @param path The path to track
 */
export const trackPageView = (path: string) => {
  try {
    // Only run in production
    if (import.meta.env.DEV) return;
    
    // Send pageview data to your endpoint
    fetch('https://formspree.io/f/xanewdzl', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'pageview',
        path,
        referrer: document.referrer,
        language: navigator.language,
        screenWidth: window.innerWidth,
        timestamp: new Date().toISOString(),
        _subject: 'Pageview Analytics'
      }),
    }).catch(error => console.error('Analytics error:', error));
  } catch (error) {
    // Fail silently
    console.error('Analytics error:', error);
  }
};

/**
 * Track events
 * @param category Event category
 * @param action Event action
 * @param label Optional event label
 * @param value Optional event value
 */
export const trackEvent = (category: string, action: string, label?: string, value?: number) => {
  try {
    // Only run in production
    if (import.meta.env.DEV) return;
    
    // Send event data to your endpoint
    fetch('https://formspree.io/f/xanewdzl', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'event',
        category,
        action,
        label,
        value,
        path: window.location.pathname,
        timestamp: new Date().toISOString(),
        _subject: 'Event Analytics'
      }),
    }).catch(error => console.error('Analytics error:', error));
  } catch (error) {
    // Fail silently
    console.error('Analytics error:', error);
  }
};

/**
 * Initialize analytics
 */
export const initAnalytics = () => {
  // Track initial page view
  trackPageView(window.location.pathname);
  
  // Listen for navigation events if using client-side routing
  window.addEventListener('popstate', () => {
    trackPageView(window.location.pathname);
  });
};

export default { trackPageView, trackEvent, initAnalytics };