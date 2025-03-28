/**
 * Performance Patches
 * 
 * This module contains patches and optimizations to improve performance.
 * It focuses on reducing main thread work and JavaScript execution time.
 */

// Configuration settings for performance optimizations
export const performanceConfig = {
  // Always set to false to ensure Lottie animations work correctly
  replaceLottieWithStatic: false,
  
  // Set to false to load all third-party scripts immediately
  deferThirdPartyScripts: true,
  
  // Paths that should be prevented from loading
  preventScriptPaths: [
    'googletagmanager.com',
    'clarity.ms'
  ]
};

/**
 * Replaces Lottie animations with static content
 * This dramatically reduces JS execution time and DOM size
 */
export function replaceLottieAnimations(): void {
  // If script is running on server during SSR, do nothing
  if (typeof document === 'undefined') return;
  
  // Skip if configuration says to keep Lottie animations
  if (!performanceConfig.replaceLottieWithStatic) {
    // Instead of replacing, make sure the Lottie player script is loaded
    ensureLottiePlayerLoaded();
    return;
  }
  
  // Define global config to disable lottie animations
  (window as any).DISABLE_LOTTIE = true;
  
  // Wait for DOM to be ready
  const replaceLottieElements = () => {
    // Find all lottie player elements
    const lottieElements = document.querySelectorAll('dotlottie-player');
    
    if (lottieElements.length > 0) {
      console.log(`Replacing ${lottieElements.length} Lottie animations with static content`);
      
      lottieElements.forEach(function(element) {
        try {
          // Create static replacement
          const staticDiv = document.createElement('div');
          staticDiv.className = element.className + ' static-lottie-replacement';
          staticDiv.setAttribute('aria-label', element.getAttribute('aria-label') || 'Animation');
          
          // Apply same dimensions
          staticDiv.style.width = element.getAttribute('width') || '100%';
          staticDiv.style.height = element.getAttribute('height') || '100%';
          
          // Apply a gradient background or image instead
          staticDiv.style.background = 'linear-gradient(45deg, #4F46E5, #3B82F6)';
          staticDiv.style.borderRadius = '8px';
          
          // Replace element
          if (element.parentNode) {
            element.parentNode.replaceChild(staticDiv, element);
          }
        } catch (err) {
          console.error('Failed to replace Lottie element:', err);
        }
      });
    }
  };
  
  // Execute immediately if DOM is already loaded
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    replaceLottieElements();
  } else {
    // Otherwise wait for DOMContentLoaded
    document.addEventListener('DOMContentLoaded', replaceLottieElements);
  }
  
  // Also try replacing after window load (for dynamically added elements)
  window.addEventListener('load', replaceLottieElements);
}

/**
 * Ensures that the Lottie player script is loaded
 */
export function ensureLottiePlayerLoaded(): void {
  if (typeof document === 'undefined') return;
  
  // Set a flag to indicate we're actively loading
  (window as any).LOTTIE_LOADING = true;
  
  // Function to initialize all Lottie players
  const initializeLottiePlayers = () => {
    console.log('Initializing Lottie players');
    const players = document.querySelectorAll('dotlottie-player');
    
    players.forEach(player => {
      // Force a reload or play action on each player
      try {
        const playerElement = player as any;
        
        // Handle already loaded players
        if (playerElement.shadowRoot && 
            playerElement.shadowRoot.querySelector('dotlottie-player-internal')) {
          console.log('Lottie player already loaded, playing...');
          if (playerElement.play) {
            playerElement.play();
          }
          return;
        }
        
        // For players that need initialization
        if (playerElement.load) {
          console.log('Loading Lottie player...');
          playerElement.load();
        }
        
        // For players with autoplay attribute
        if (player.hasAttribute('autoplay') && playerElement.play) {
          console.log('Playing Lottie animation...');
          playerElement.play();
        }
      } catch (error) {
        console.error('Error initializing Lottie player:', error);
      }
    });
    
    // Set flag indicating players are initialized
    (window as any).LOTTIE_INITIALIZED = true;
  };
  
  // Define a function to load the Lottie player
  const loadLottiePlayer = () => {
    // Skip if already defined
    if (customElements.get('dotlottie-player')) {
      console.log('DotLottie Player already defined, initializing players...');
      initializeLottiePlayers();
      return;
    }
    
    console.log('Loading DotLottie Player script...');
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/@dotlottie/player-component@2.7.12/dist/dotlottie-player.mjs';
    script.type = 'module';
    script.id = 'lottie-player-script';
    script.setAttribute('fetchpriority', 'high');
    
    script.onload = () => {
      console.log('DotLottie Player script loaded successfully');
      // Set flag indicating the player is loaded
      (window as any).LOTTIE_PLAYER_LOADED = true;
      
      // Give a short delay for the component to register
      setTimeout(() => {
        initializeLottiePlayers();
      }, 50);
    };
    
    document.head.appendChild(script);
  };
  
  // Execute initialization based on page state
  const executeInitialization = () => {
    if ((window as any).LOTTIE_INITIALIZED) {
      console.log('Lottie already initialized, skipping...');
      return;
    }
    
    // Check if script is already in the page
    const existingScript = document.querySelector('script[src*="dotlottie-player"]');
    if (existingScript) {
      console.log('Found existing Lottie script, waiting for it to load...');
      
      if (customElements.get('dotlottie-player')) {
        console.log('Component already defined, initializing players...');
        initializeLottiePlayers();
      } else {
        // Wait for the script to finish loading
        existingScript.addEventListener('load', () => {
          console.log('Existing script loaded, initializing players...');
          // Small delay to ensure component is registered
          setTimeout(initializeLottiePlayers, 50);
        });
        
        // Fallback in case the load event doesn't fire
        setTimeout(() => {
          if (!customElements.get('dotlottie-player')) {
            console.log('Fallback: Forcing Lottie script load...');
            loadLottiePlayer();
          } else {
            initializeLottiePlayers();
          }
        }, 1000);
      }
    } else {
      // No script found, load it
      loadLottiePlayer();
    }
  };
  
  // Execute with appropriate timing
  if (document.readyState === 'loading') {
    // Page is still loading, wait for DOM
    document.addEventListener('DOMContentLoaded', executeInitialization);
  } else {
    // DOM already loaded, execute now
    executeInitialization();
  }
  
  // Also attach to load event as a fallback
  window.addEventListener('load', () => {
    // Double check initialization after everything is loaded
    setTimeout(() => {
      if (!(window as any).LOTTIE_INITIALIZED) {
        console.log('Lottie not initialized after page load, retrying...');
        executeInitialization();
      } else {
        // Even if initialized, ensure all players are playing
        const players = document.querySelectorAll('dotlottie-player[autoplay]');
        players.forEach(player => {
          try {
            (player as any).play();
          } catch (e) {
            // Ignore errors
          }
        });
      }
    }, 500);
  });
}

/**
 * Defers loading of non-critical third-party scripts
 */
export function deferThirdPartyScripts(): void {
  // Skip if configuration says not to defer
  if (!performanceConfig.deferThirdPartyScripts) return;
  
  if (typeof document === 'undefined') return;
  
  // Flag to track if analytics has been loaded
  let analyticsLoaded = false;
  
  // Load analytics after user interaction or when idle
  const loadAnalytics = () => {
    if (analyticsLoaded) return;
    analyticsLoaded = true;
    
    // Load Google Analytics
    const gaScript = document.createElement('script');
    gaScript.async = true;
    gaScript.src = 'https://www.googletagmanager.com/gtag/js?id=G-PRRRS3L42H';
    document.head.appendChild(gaScript);
    
    // Initialize analytics
    const gaInit = document.createElement('script');
    gaInit.textContent = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-PRRRS3L42H', { 
        'send_page_view': false,
        'anonymize_ip': true 
      });
      // Delay pageview event
      setTimeout(function() {
        gtag('event', 'page_view');
      }, 5000);
    `;
    document.head.appendChild(gaInit);
    
    // Load Microsoft Clarity
    setTimeout(() => {
      const clarityScript = document.createElement('script');
      clarityScript.async = true;
      clarityScript.src = 'https://www.clarity.ms/tag/qlv8zx6uv2';
      document.head.appendChild(clarityScript);
    }, 5000);
  };
  
  // Listen for user interaction to load analytics
  const onUserInteraction = () => {
    loadAnalytics();
    ['click', 'scroll', 'touchstart'].forEach(event => {
      document.removeEventListener(event, onUserInteraction);
    });
  };
  
  // Wait for load event to add listeners
  window.addEventListener('load', () => {
    // Add listeners for user interaction
    ['click', 'scroll', 'touchstart'].forEach(event => {
      document.addEventListener(event, onUserInteraction);
    });
    
    // Load analytics after idle time or as fallback
    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(() => loadAnalytics(), { timeout: 10000 });
    } else {
      setTimeout(loadAnalytics, 10000);
    }
  });
}

/**
 * Removes existing script tags by URL pattern to prevent them from loading
 */
export function preventScriptLoading(urlPatterns: string[]): void {
  if (typeof document === 'undefined') return;
  
  // Use the configured paths from performanceConfig
  const patternsToBlock = urlPatterns || performanceConfig.preventScriptPaths;
  
  // Don't block Lottie if we're not replacing it
  if (!performanceConfig.replaceLottieWithStatic) {
    // Filter out any Lottie-related patterns to ensure they can load
    const filteredPatterns = patternsToBlock.filter(
      pattern => !pattern.includes('lottie')
    );
    
    // If no patterns left, exit early
    if (filteredPatterns.length === 0) return;
    
    // Remove existing script tags that match patterns
    const removeMatchingScripts = () => {
      const scripts = document.getElementsByTagName('script');
      for (let i = 0; i < scripts.length; i++) {
        const script = scripts[i];
        const src = script.src || '';
        
        if (filteredPatterns.some(pattern => src.includes(pattern))) {
          if (script.parentNode) {
            script.parentNode.removeChild(script);
            console.log(`Removed script: ${src}`);
            // Decrement index since we removed an item
            i--;
          }
        }
      }
    };
    
    // Run immediately
    if (document.readyState !== 'loading') {
      removeMatchingScripts();
    } else {
      // Or wait for DOM to be ready
      document.addEventListener('DOMContentLoaded', removeMatchingScripts);
    }
    
    // Also observe the DOM for new script additions
    if ('MutationObserver' in window) {
      const observer = new MutationObserver(mutations => {
        for (const mutation of mutations) {
          if (mutation.type === 'childList') {
            for (const node of Array.from(mutation.addedNodes)) {
              if (node.nodeName === 'SCRIPT') {
                const script = node as HTMLScriptElement;
                const src = script.src || '';
                
                if (filteredPatterns.some(pattern => src.includes(pattern))) {
                  if (script.parentNode) {
                    script.parentNode.removeChild(script);
                    console.log(`Prevented script loading: ${src}`);
                  }
                }
              }
            }
          }
        }
      });
      
      // Start observing once DOM is loaded
      document.addEventListener('DOMContentLoaded', () => {
        observer.observe(document.documentElement, { 
          childList: true, 
          subtree: true 
        });
      });
    }
  } else {
    // Remove existing script tags that match patterns
    const removeMatchingScripts = () => {
      const scripts = document.getElementsByTagName('script');
      for (let i = 0; i < scripts.length; i++) {
        const script = scripts[i];
        const src = script.src || '';
        
        if (patternsToBlock.some(pattern => src.includes(pattern))) {
          if (script.parentNode) {
            script.parentNode.removeChild(script);
            console.log(`Removed script: ${src}`);
            // Decrement index since we removed an item
            i--;
          }
        }
      }
    };
    
    // Run immediately
    if (document.readyState !== 'loading') {
      removeMatchingScripts();
    } else {
      // Or wait for DOM to be ready
      document.addEventListener('DOMContentLoaded', removeMatchingScripts);
    }
    
    // Also observe the DOM for new script additions
    if ('MutationObserver' in window) {
      const observer = new MutationObserver(mutations => {
        for (const mutation of mutations) {
          if (mutation.type === 'childList') {
            for (const node of Array.from(mutation.addedNodes)) {
              if (node.nodeName === 'SCRIPT') {
                const script = node as HTMLScriptElement;
                const src = script.src || '';
                
                if (patternsToBlock.some(pattern => src.includes(pattern))) {
                  if (script.parentNode) {
                    script.parentNode.removeChild(script);
                    console.log(`Prevented script loading: ${src}`);
                  }
                }
              }
            }
          }
        }
      });
      
      // Start observing once DOM is loaded
      document.addEventListener('DOMContentLoaded', () => {
        observer.observe(document.documentElement, { 
          childList: true, 
          subtree: true 
        });
      });
    }
  }
}

/**
 * Initialize all performance patches
 */
export function initPerformanceOptimizations(): void {
  // Replace Lottie animations with static content or ensure they're loaded
  if (performanceConfig.replaceLottieWithStatic) {
    replaceLottieAnimations();
  } else {
    ensureLottiePlayerLoaded();
  }
  
  // Defer third-party scripts if configured
  if (performanceConfig.deferThirdPartyScripts) {
    deferThirdPartyScripts();
  }
  
  // Prevent loading of scripts based on configuration
  preventScriptLoading(performanceConfig.preventScriptPaths);
}

// Auto-initialize if this module is directly included
if (typeof window !== 'undefined') {
  // Initialize after a tiny delay to ensure it runs after other scripts
  setTimeout(initPerformanceOptimizations, 0);
}

// Initialize Lottie immediately
ensureLottiePlayerLoaded();
