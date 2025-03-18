import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import BlogList from '../components/blog/BlogList';
import { Book } from 'lucide-react';
import AnimatedSection from '../components/AnimatedSection';
import PageTransition from '../components/PageTransition';
import { useAppContext } from '../context/AppContext';
import PreviewModeToggle from '../components/blog/PreviewModeToggle';

const Blog = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isDarkMode } = useAppContext();
  
  // Parse query params for category filtering
  const queryParams = new URLSearchParams(location.search);
  const category = queryParams.get('category');
  
  // Clear category filter
  const clearCategory = () => {
    navigate('/blog');
  };
  
  // Set page title and meta description
  useEffect(() => {
    document.title = category 
      ? `${category} Articles - Enri Zhulati Blog`
      : 'Blog - Enri Zhulati';
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        'content',
        category
          ? `Read articles about ${category} from digital growth strategist Enri Zhulati.`
          : 'Articles about web development, digital strategy, and content creation by Enri Zhulati.'
      );
    }
  }, [category]);
  
  return (
    <PageTransition>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <AnimatedSection>
          <header className="mb-12 md:mb-16 text-center">
            <h1 className={`text-4xl sm:text-5xl font-bold mb-4 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {category ? `${category} Articles` : 'Blog'}
            </h1>
            
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto rounded-full mb-6"></div>
            
            <p className={`text-lg max-w-2xl mx-auto ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              {category 
                ? `Articles about ${category.toLowerCase()} and related topics.`
                : 'Insights and ideas to help improve your online presence and digital strategy.'
              }
            </p>
            
            {category && (
              <button
                onClick={clearCategory}
                className={`mt-4 inline-flex items-center px-3 py-1.5 rounded-full text-sm ${
                  isDarkMode
                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Book size={14} className="mr-1" />
                All articles
              </button>
            )}
          </header>
          
          <BlogList />
        </AnimatedSection>
      </div>
      
      {/* Preview Mode Toggle */}
      <PreviewModeToggle />
    </PageTransition>
  );
};

export default Blog;