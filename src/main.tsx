import { StrictMode, Suspense, lazy } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import './index.css';
import { HelmetProvider } from 'react-helmet-async';

// Lazy load the App component for better performance
const App = lazy(() => import('./App'));

// Loading fallback
const LoadingFallback = () => (
  <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
    <div className="animate-pulse text-blue-600 dark:text-blue-400 text-xl font-medium">
      Loading...
    </div>
  </div>
);

// Apply dark mode by default
document.documentElement.classList.add('dark');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <HelmetProvider>
        <AppProvider>
          <Suspense fallback={<LoadingFallback />}>
            <App />
          </Suspense>
        </AppProvider>
      </HelmetProvider>
    </Router>
  </StrictMode>
);