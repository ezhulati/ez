import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, User } from 'lucide-react';
import { format } from 'date-fns';
import { useFeaturedBlogPosts } from '../../utils/blog-hooks';
import AnimatedSection from '../AnimatedSection';
import { useAppContext } from '../../context/AppContext';

const FeaturedPosts = () => {
  const { featuredPosts, isLoading, error } = useFeaturedBlogPosts(3);
  const { isDarkMode } = useAppContext();
  
  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (error || featuredPosts.length === 0) {
    return null; // Don't show anything if there's an error or no posts
  }
  
  return (
    <section className={`py-16 ${
      isDarkMode ? 'bg-gray-900/70' : 'bg-gray-50'
    } relative overflow-hidden`}>
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-indigo-500/5 rounded-full filter blur-3xl"></div>
      </div>
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <AnimatedSection className="text-center mb-12">
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 inline-block mb-2">
            Latest Articles
          </h2>
          <div className="w-16 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto rounded-full mb-4"></div>
          <p className={`text-base ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Ideas and insights to help improve your digital presence
          </p>
        </AnimatedSection>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {featuredPosts.map((post, index) => {
            // Get image URL or use a placeholder
            const imageUrl = post.fields.image?.fields?.file?.url 
              ? `https:${post.fields.image.fields.file.url}`
              : 'https://images.unsplash.com/photo-1519681393784-d120267933ba';
              
            // Format date
            const formattedDate = post.fields.publishedDate 
              ? format(new Date(post.fields.publishedDate), 'MMMM d, yyyy')
              : format(new Date(post.sys.createdAt), 'MMMM d, yyyy');
            
            return (
              <AnimatedSection
                key={post.sys.id}
                className={`group overflow-hidden rounded-xl border shadow-sm hover:-translate-y-1 transition-all duration-300 ${
                  isDarkMode
                    ? 'bg-gray-800/50 border-gray-700/50 hover:shadow-blue-900/10'
                    : 'bg-white border-gray-200 hover:shadow-lg'
                }`}
                delay={0.1 * index}
              >
                <Link to={`/blog/${post.fields.customUrl || post.fields.slug || post.sys.id}`} className="block h-full">
                  <div className="h-40 overflow-hidden">
                    <img
                      src={imageUrl}
                      alt={post.fields.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  
                  <div className="p-5">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                        <Calendar size={12} className="mr-1" />
                        {formattedDate}
                      </div>
                      
                      {/* Author with image */}
                      {post.fields.author && (
                        <div className="flex items-center">
                          {post.fields.author.fields?.avatar?.fields?.file?.url ? (
                            <img
                              src={`https:${post.fields.author.fields.avatar.fields.file.url}`}
                              alt={post.fields.author.fields.name || "Author"}
                              className="w-5 h-5 rounded-full object-cover mr-1.5 border border-gray-200 dark:border-gray-700"
                              width="20"
                              height="20"
                              loading="lazy"
                            />
                          ) : (
                            <div className={`w-5 h-5 rounded-full mr-1.5 flex items-center justify-center ${
                              isDarkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-600'
                            }`}>
                              <User size={10} />
                            </div>
                          )}
                          <span className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            {post.fields.author.fields?.name || (post.sys.id === '4teKNzPkzDPysbkdacG8D0' ? 'Enri Zhulati' : 'Author')}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <h3 className={`text-lg font-semibold mb-2 group-hover:text-blue-600 transition-colors ${
                      isDarkMode ? 'text-white group-hover:text-blue-400' : 'text-gray-900'
                    }`}>
                      {post.fields.title}
                    </h3>
                    
                    <p className={`text-sm line-clamp-2 mb-4 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      {post.fields.excerpt}
                    </p>
                    
                    <div className="inline-flex items-center text-sm text-blue-600 dark:text-blue-400 group-hover:underline">
                      Read more
                      <ArrowRight size={14} className="ml-1.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </AnimatedSection>
            );
          })}
        </div>
        
        <div className="text-center mt-10">
          <Link
            to="/blog"
            className={`inline-flex items-center px-5 py-2.5 rounded-lg border transition-colors font-medium ${
              isDarkMode
                ? 'bg-gray-800 border-gray-700 text-gray-200 hover:bg-gray-700'
                : 'bg-white border-gray-200 text-gray-900 hover:bg-gray-50'
            }`}
          >
            View all articles
            <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedPosts;