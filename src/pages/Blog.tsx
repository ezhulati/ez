import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import BlogList from '../components/blog/BlogList';
import { Book } from 'lucide-react';
import AnimatedSection from '../components/AnimatedSection';
import PageTransition from '../components/PageTransition';
import { useAppContext } from '../context/AppContext';

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
  
  // Prepare SEO metadata
  const pageTitle = category 
    ? `${category} Articles - Enri Zhulati Blog`
    : 'Expert SEO & Web Strategy Insights – Blog';
    
  const pageDescription = category
    ? `Read expert articles about ${category} from digital growth strategist Enri Zhulati.`
    : 'Discover actionable tips on SEO, content marketing, and web design to grow your business.';
  
  const canonicalUrl = `https://enrizhulati.com${location.pathname}${location.search}`;
  
  // Structured data for better search engine and AI bot indexing
  const blogSchema = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    'name': 'Enri Zhulati Blog',
    'description': 'Expert insights on SEO, web design, and digital marketing strategies',
    'url': 'https://enrizhulati.com/blog',
    'author': {
      '@type': 'Person',
      'name': 'Enri Zhulati',
      'url': 'https://enrizhulati.com',
      'sameAs': [
        'https://twitter.com/enrizhulati',
        'https://linkedin.com/in/enrizhulati'
      ]
    },
    'publisher': {
      '@type': 'Person',
      'name': 'Enri Zhulati',
      'logo': {
        '@type': 'ImageObject',
        'url': 'https://enrizhulati.com/favicon.svg'
      }
    },
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': 'https://enrizhulati.com/blog'
    },
    'keywords': 'SEO, content marketing, web design, digital marketing, website optimization, lead generation',
    'inLanguage': 'en-US'
  };
  
  return (
    <PageTransition>
      <Helmet>
        {/* Basic SEO */}
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content="SEO, content marketing, web design, digital marketing, website optimization, lead generation" />
        <link rel="canonical" href={canonicalUrl} />
        
        {/* OpenGraph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:site_name" content="Enri Zhulati" />
        <meta property="og:image" content="https://enrizhulati.com/blog-social-image.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content="en_US" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@enrizhulati" />
        <meta name="twitter:creator" content="@enrizhulati" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content="https://enrizhulati.com/blog-social-image.jpg" />
        
        {/* Additional meta for AI bots and search engines */}
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <meta name="bingbot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        
        {/* Schema.org structured data for better indexing */}
        <script type="application/ld+json">
          {JSON.stringify(blogSchema)}
        </script>
      </Helmet>
      
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
    </PageTransition>
  );
};

export default Blog;