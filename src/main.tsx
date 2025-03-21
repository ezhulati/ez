// Performance patches should be loaded before anything else
import './patches/performance-patches';

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { HelmetProvider } from 'react-helmet-async';

// Flag to indicate when app is ready for prerendering
declare global {
  interface Window {
    prerenderReady?: boolean;
  }
}

// Conditionally render the application
const renderApp = () => {
  // Only render when document is ready
  const root = document.getElementById('root');
  if (!root) return false;

  // Initially set prerenderReady to false
  window.prerenderReady = false;
  
  // Create react root and render app
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <HelmetProvider>
        <AppProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </AppProvider>
      </HelmetProvider>
    </React.StrictMode>
  );
  
  // Signal the app is mounted and hydrated
  // This helps prerender.io know when to capture the page
  setTimeout(() => {
    console.log("App is mounted and hydrated");
    window.prerenderReady = true;
  }, 1000);
  
  // Fallback timer to ensure prerender.io doesn't time out
  setTimeout(() => {
    if (window.prerenderReady === false) {
      console.log("Fallback: Setting prerenderReady to true after timeout");
      window.prerenderReady = true;
    }
  }, 3000);
  
  return true;
};

// Try to render immediately if DOM is ready
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  renderApp();
} else {
  // Or wait for DOM to be ready
  document.addEventListener('DOMContentLoaded', renderApp);
}

// Preload critical assets after page load
window.addEventListener('load', () => {
  // Mark page as ready for prerender if it hasn't been done already
  setTimeout(() => {
    if (window.prerenderReady === false) {
      console.log("Load event: Setting prerenderReady to true");
      window.prerenderReady = true;
    }
  }, 500);

  // Try preloading critical assets
  if ('requestIdleCallback' in window) {
    (window as any).requestIdleCallback(() => {
      // Preload critical images
      const preloadImages = [
        '/favicon.svg'
      ];
      
      preloadImages.forEach(url => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = url;
        document.head.appendChild(link);
      });
    });
  }
});