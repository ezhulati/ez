import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Calendar, Tag, Clock, ArrowRight, Search } from 'lucide-react';
import { getBlogPosts, BlogPost } from '../../services/contentful';
import AnimatedSection from '../AnimatedSection';
import { useAppContext } from '../../context/AppContext';

const BlogList = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { isDarkMode } = useAppContext();
  
  // Extract all unique categories from posts
  const allCategories = [...new Set(posts.flatMap(post => post.fields.categories || []))];
  
  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const fetchedPosts = await getBlogPosts();
        setPosts(fetchedPosts);
      } catch (err) {
        console.error('Error fetching blog posts:', err);
        setError('Failed to load blog posts. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPosts();
  }, []);
  
  // Filter posts based on search query and selected category
  const filteredPosts = posts.filter(post => {
    const matchesQuery = searchQuery.trim() === '' || 
      post.fields.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.fields.excerpt && post.fields.excerpt.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === null || 
      (post.fields.categories && post.fields.categories.includes(selectedCategory));
    
    return matchesQuery && matchesCategory;
  });
  
  const handleCategoryClick = (category: string) => {
    setSelectedCategory(prevCategory => prevCategory === category ? null : category);
  };
  
  if (isLoading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-600 dark:text-gray-300">Loading blog posts...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center p-8 max-w-md">
          <div className="text-red-500 text-5xl mb-4">😕</div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Something went wrong
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            {error}
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div>
      {/* Search and filters */}
      <div className="mb-8 space-y-4">
        <div className={`relative rounded-lg overflow-hidden border ${
          isDarkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <input
            type="text"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full px-4 py-3 pl-10 ${
              isDarkMode 
                ? 'bg-gray-800 text-white placeholder-gray-400'
                : 'bg-white text-gray-800 placeholder-gray-500'
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        </div>
        
        {allCategories.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {allCategories.map(category => (
              <button
                key={category}
                onClick={() => handleCategoryClick(category)}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : isDarkMode
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
            {selectedCategory && (
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-3 py-1 text-sm rounded-full ${
                  isDarkMode
                    ? 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                }`}
              >
                Clear filter
              </button>
            )}
          </div>
        )}
      </div>
      
      {/* Results count */}
      <p className={`mb-6 text-sm ${
        isDarkMode ? 'text-gray-400' : 'text-gray-500'
      }`}>
        {filteredPosts.length === 0 
          ? 'No posts found' 
          : `Showing ${filteredPosts.length} ${filteredPosts.length === 1 ? 'post' : 'posts'}`
        }
      </p>
      
      {/* Blog posts grid */}
      {filteredPosts.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post, index) => (
            <BlogPostCard key={post.sys.id} post={post} index={index} />
          ))}
        </div>
      ) : (
        <div className={`text-center py-16 ${
          isDarkMode ? 'bg-gray-800/40' : 'bg-gray-50'
        } rounded-lg`}>
          <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">
            No matching blog posts
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Try adjusting your search or filter criteria
          </p>
          {selectedCategory && (
            <button
              onClick={() => setSelectedCategory(null)}
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Clear category filter
            </button>
          )}
        </div>
      )}
    </div>
  );
};

interface BlogPostCardProps {
  post: BlogPost;
  index: number;
}

const BlogPostCard = ({ post, index }: BlogPostCardProps) => {
  const { isDarkMode } = useAppContext();
  
  // Calculate animation delay based on index
  const delay = 0.1 + (index * 0.1);
  
  // Format date if available
  const formattedDate = post.fields.publishedDate 
    ? format(new Date(post.fields.publishedDate), 'MMMM d, yyyy')
    : format(new Date(post.sys.createdAt), 'MMMM d, yyyy');
  
  // Get image URL or use a placeholder
  const imageUrl = post.fields.featuredImage?.fields?.file?.url 
    ? `https:${post.fields.featuredImage.fields.file.url}`
    : 'https://images.unsplash.com/photo-1519681393784-d120267933ba';
  
  return (
    <AnimatedSection
      delay={delay}
      className={`group overflow-hidden rounded-xl border shadow-sm transition-all duration-300 hover:-translate-y-1 ${
        isDarkMode 
          ? 'bg-gray-800/50 border-gray-700/50 hover:shadow-gray-800/40' 
          : 'bg-white border-gray-200 hover:shadow-lg'
      }`}
    >
      <Link to={`/blog/${post.fields.slug}`} className="block h-full">
        <div className="relative h-48 overflow-hidden">
          <img 
            src={imageUrl}
            alt={post.fields.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          {post.fields.categories && post.fields.categories.length > 0 && (
            <div className="absolute top-3 left-3">
              <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                isDarkMode 
                  ? 'bg-blue-900/80 text-blue-200' 
                  : 'bg-blue-100 text-blue-800'
              }`}>
                <Tag size={12} className="mr-1" />
                {post.fields.categories[0]}
              </div>
            </div>
          )}
        </div>
        
        <div className="p-5">
          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-3">
            <span className="flex items-center">
              <Calendar size={12} className="mr-1" />
              {formattedDate}
            </span>
            <span className="mx-2">•</span>
            <span className="flex items-center">
              <Clock size={12} className="mr-1" />
              5 min read
            </span>
          </div>
          
          <h3 className={`text-lg font-semibold leading-tight mb-2 group-hover:text-blue-600 ${
            isDarkMode ? 'text-white group-hover:text-blue-400' : 'text-gray-900'
          }`}>
            {post.fields.title}
          </h3>
          
          <p className={`text-sm line-clamp-2 mb-4 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            {post.fields.excerpt}
          </p>
          
          <div className="flex items-center mt-auto">
            <div className="inline-flex items-center justify-center text-sm text-blue-600 dark:text-blue-400 group-hover:underline">
              Read more
              <ArrowRight size={14} className="ml-1.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </Link>
    </AnimatedSection>
  );
};

export default BlogList;