import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const Search = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get('q') || '';
  
  // Redirect to homepage after a brief delay
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/', { replace: true });
    }, 100);
    
    return () => clearTimeout(timer);
  }, [navigate]);
  
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Helmet>
        {/* Critical: Canonical URL to prevent search indexing issues */}
        <link rel="canonical" href="https://enrizhulati.com/" />
        <title>Search - Enri Zhulati</title>
        <meta name="robots" content="noindex, follow" />
      </Helmet>
      
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Redirecting...</h1>
        {searchQuery && (
          <p className="text-gray-600 dark:text-gray-400">
            Search query: {searchQuery}
          </p>
        )}
      </div>
    </div>
  );
};

export default Search; 