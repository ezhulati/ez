import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Calendar, Tag, Clock, ArrowRight, Search, AlertTriangle, User } from 'lucide-react';
import { getBlogPosts, BlogPost } from '../../services/contentful';
import AnimatedSection from '../AnimatedSection';
import { useAppContext } from '../../context/AppContext';

const BlogList = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>('');
  const { isDarkMode } = useAppContext();
  
  // Extract all unique categories from posts
  const allCategories = [...new Set(posts.flatMap(post => post.fields.categories || []))];
  
  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        // Add debug information
        setDebugInfo('Fetching posts...');
        console.log('Fetching blog posts...');
        console.log('Contentful credentials:', {
          spaceId: import.meta.env.VITE_CONTENTFUL_SPACE_ID ? 'Found' : 'Missing',
          accessToken: import.meta.env.VITE_CONTENTFUL_ACCESS_TOKEN ? 'Found' : 'Missing'
        });
        
        // Check if credentials exist before attempting fetch
        if (!import.meta.env.VITE_CONTENTFUL_SPACE_ID || !import.meta.env.VITE_CONTENTFUL_ACCESS_TOKEN) {
          setError('Blog temporarily unavailable. Please check back later.');
          setDebugInfo(prev => prev + '\nContentful credentials missing. Check .env file.');
          return;
        }
        
        const fetchedPosts = await getBlogPosts();
        console.log('Fetched posts:', fetchedPosts);
        setDebugInfo(prev => prev + `\nFetched ${fetchedPosts.length} posts`);
        
        if (fetchedPosts.length === 0) {
          setDebugInfo(prev => prev + '\nNo posts found. Check Contentful setup.');
        } else {
          // Log the structure of the first post
          const firstPost = fetchedPosts[0];
          setDebugInfo(prev => prev + `\nFirst post: ${firstPost.fields.title}`);
          console.log('First post:', firstPost);
        }
        
        setPosts(fetchedPosts);
      } catch (err) {
        console.error('Error fetching blog posts:', err);
        setError('Failed to load blog posts. Please try again later.');
        setDebugInfo(prev => prev + `\nError: ${err instanceof Error ? err.message : 'Unknown error'}`);
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
        <div className="text-center p-8 max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-md">
          <div className="text-red-500 text-5xl mb-4">😕</div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Blog temporarily unavailable
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            {error}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 text-left whitespace-pre-wrap">
            {debugInfo}
          </p>
          <div className="flex justify-center gap-3">
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Try again
            </button>
            <a 
              href="/"
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg transition-colors"
            >
              Return home
            </a>
          </div>
        </div>
      </div>
    );
  }
  
  // Show empty state with debug info if no posts
  if (posts.length === 0) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center py-12 px-4">
        <div className="bg-yellow-50 dark:bg-yellow-900/30 p-6 rounded-lg border border-yellow-200 dark:border-yellow-800 max-w-lg">
          <div className="flex items-start">
            <AlertTriangle className="h-6 w-6 mr-3 mt-0.5 flex-shrink-0 text-yellow-600 dark:text-yellow-400" />
            <div>
              <h3 className="font-medium text-lg mb-2 text-yellow-800 dark:text-yellow-200">No blog posts found</h3>
              <p className="mb-3 text-yellow-700 dark:text-yellow-300">
                We couldn't find any blog posts in your Contentful space. Please check your Contentful setup.
              </p>
              <div className="bg-white dark:bg-gray-800 p-3 rounded text-xs font-mono text-gray-700 dark:text-gray-300 mb-3 max-h-48 overflow-auto whitespace-pre-wrap">
                {debugInfo || 'No debug information available'}
              </div>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                Make sure you've created blog content in Contentful and that your API credentials are correct.
              </p>
            </div>
          </div>
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
      
      {/* No results */}
      {filteredPosts.length === 0 && (
        <div className="min-h-[200px] flex flex-col items-center justify-center text-center p-8">
          <div className="text-3xl mb-4">🔍</div>
          <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            No matching articles found
          </h3>
          <p className={`max-w-md mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Try adjusting your search or filters to find what you're looking for.
          </p>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className={`px-4 py-2 rounded-lg mr-2 ${
                isDarkMode
                  ? 'bg-gray-800 text-gray-200 hover:bg-gray-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Clear search
            </button>
          )}
          {selectedCategory && (
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-lg ${
                isDarkMode
                  ? 'bg-gray-800 text-gray-200 hover:bg-gray-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Clear category filter
            </button>
          )}
        </div>
      )}
      
      {/* Blog post grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPosts.map((post, index) => (
          <BlogPostCard key={post.sys.id} post={post} index={index} />
        ))}
      </div>
    </div>
  );
};

interface BlogPostCardProps {
  post: BlogPost;
  index: number;
}

const BlogPostCard = ({ post, index }: BlogPostCardProps) => {
  const { isDarkMode } = useAppContext();
  
  // Format date
  const formattedDate = post.fields.publishedDate 
    ? format(new Date(post.fields.publishedDate), 'MMM d, yyyy')
    : format(new Date(post.sys.createdAt), 'MMM d, yyyy');
  
  // Get image URL or use a placeholder
  const imageUrl = post.fields.image?.fields?.file?.url 
    ? `https:${post.fields.image.fields.file.url}?fm=webp&w=600&h=400&fit=fill` 
    : `https://images.unsplash.com/photo-${1500000000000 + index}?fm=webp&w=600&h=400&fit=fill`;
  
  // Get excerpt from excerpt field or from body field
  const getExcerpt = () => {
    if (post.fields.excerpt) return post.fields.excerpt;
    
    // If body is a string, extract first 150 characters
    if (typeof post.fields.body === 'string') {
      return post.fields.body.substring(0, 150) + '...';
    }
    
    // If body is a RichText object, try to extract text from it
    if (post.fields.body && typeof post.fields.body === 'object') {
      try {
        // Try to find the first paragraph with text
        const content = post.fields.body as any;
        if (content.content) {
          for (const node of content.content) {
            if (node.nodeType === 'paragraph' && node.content) {
              const textParts = node.content
                .filter((item: any) => item.nodeType === 'text')
                .map((item: any) => item.value);
              
              if (textParts.length > 0) {
                const text = textParts.join(' ');
                return text.length > 150 ? text.substring(0, 150) + '...' : text;
              }
            }
          }
        }
      } catch (e) {
        console.log('Error extracting excerpt from body:', e);
      }
    }
    
    return 'Read this article on our blog...';
  };
  
  // Estimate reading time based on available content
  const estimateReadingTime = () => {
    let wordCount = 0;
    
    if (typeof post.fields.body === 'string') {
      wordCount = post.fields.body.split(/\s+/).length;
    } else if (post.fields.body && typeof post.fields.body === 'object') {
      try {
        // Try to count words in RichText object
        const content = post.fields.body as any;
        const countWordsInNode = (node: any): number => {
          if (!node) return 0;
          
          if (node.nodeType === 'text' && node.value) {
            return node.value.split(/\s+/).length;
          }
          
          if (node.content && Array.isArray(node.content)) {
            return node.content.reduce((sum: number, child: any) => sum + countWordsInNode(child), 0);
          }
          
          return 0;
        };
        
        wordCount = countWordsInNode(content);
      } catch (e) {
        console.log('Error counting words:', e);
        wordCount = 500; // Default if we can't count
      }
    }
    
    return Math.max(1, Math.ceil(wordCount / 200));
  };
  
  // Generate URL for blog post
  const getPostUrl = () => {
    // Prefer customUrl, then slug, then ID
    if (post.fields.customUrl) {
      return `/blog/${post.fields.customUrl}`;
    } else if (post.fields.slug) {
      return `/blog/${post.fields.slug}`;
    }
    return `/blog/${post.sys.id}`;
  };
  
  const excerpt = getExcerpt();
  const readingTime = estimateReadingTime();
  
  return (
    <AnimatedSection
      className={`group h-full rounded-xl overflow-hidden shadow-sm transition-shadow hover:shadow-md ${
        isDarkMode ? 'bg-gray-800 shadow-gray-900' : 'bg-white shadow-gray-200'
      }`}
      delay={index * 0.1}
    >
      <Link to={getPostUrl()} className="block h-full">
        <div className="relative h-48 overflow-hidden">
          <img 
            src={imageUrl}
            alt={post.fields.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            width="600"
            height="400"
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
          <h3 className={`text-xl font-bold mb-2 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          } group-hover:text-blue-600 transition-colors`}>
            {post.fields.title}
          </h3>
          
          {excerpt && (
            <p className={`mb-4 line-clamp-3 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              {excerpt}
            </p>
          )}
          
          <div className="flex justify-between items-center pt-2">
            <div className={`flex items-center text-sm ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              <Calendar size={14} className="mr-1" />
              <span>{formattedDate}</span>
            </div>
            
            <div className={`flex items-center text-sm ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              <Clock size={14} className="mr-1" />
              <span>{readingTime} min read</span>
            </div>
          </div>
          
          {/* Author information */}
          {post.fields.author && (
            <div className="flex items-center mt-4">
              {post.fields.author.fields?.avatar?.fields?.file?.url ? (
                <img
                  src={`https:${post.fields.author.fields.avatar.fields.file.url}`}
                  alt={post.fields.author.fields.name || "Author"}
                  className="w-6 h-6 rounded-full object-cover mr-2 border border-gray-200 dark:border-gray-700"
                  width="24"
                  height="24"
                  loading="lazy"
                />
              ) : (
                <div className={`w-6 h-6 rounded-full mr-2 flex items-center justify-center ${
                  isDarkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-600'
                }`}>
                  <User size={12} />
                </div>
              )}
              <span className={`text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {post.fields.author.fields?.name || (post.sys.id === '4teKNzPkzDPysbkdacG8D0' ? 'Enri Zhulati' : 'Author')}
              </span>
            </div>
          )}
        </div>
        
        <div className={`px-5 pb-5 pt-2 border-t flex justify-between items-center ${
          isDarkMode ? 'border-gray-700' : 'border-gray-100'
        }`}>
          <span className={`text-sm font-medium ${
            isDarkMode ? 'text-blue-400' : 'text-blue-600'
          } group-hover:underline`}>
            Read more
          </span>
          <ArrowRight size={16} className={
            isDarkMode ? 'text-blue-400' : 'text-blue-600'
          } />
        </div>
      </Link>
    </AnimatedSection>
  );
};

export default BlogList;