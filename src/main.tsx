// Performance patches should be loaded before anything else
import './patches/performance-patches';

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { HelmetProvider } from 'react-helmet-async';

// Conditionally render the application
const renderApp = () => {
  // Only render when document is ready
  const root = document.getElementById('root');
  if (!root) return false;
  
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