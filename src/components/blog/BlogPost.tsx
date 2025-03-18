import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Calendar, Clock, ArrowLeft, User, Tag, Share2, Bookmark, BookmarkCheck, AlertTriangle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { getBlogPostBySlug, BlogPost as BlogPostType, isPreviewModeActive } from '../../services/contentful';
import { useAppContext } from '../../context/AppContext';
import AnimatedSection from '../AnimatedSection';
import PageTransition from '../PageTransition';

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const { isDarkMode } = useAppContext();
  const isPreview = isPreviewModeActive();
  
  useEffect(() => {
    if (!slug) return;
    
    const fetchPost = async () => {
      setIsLoading(true);
      try {
        const fetchedPost = await getBlogPostBySlug(slug);
        setPost(fetchedPost);
        
        if (!fetchedPost) {
          setError('Blog post not found');
        }
        
        // Check if post is bookmarked
        const bookmarks = JSON.parse(localStorage.getItem('blog-bookmarks') || '[]');
        setIsBookmarked(bookmarks.includes(slug));
        
      } catch (err) {
        console.error(`Error fetching blog post with slug ${slug}:`, err);
        setError('Failed to load blog post. Please try again later.');
      } finally {
        setIsLoading(false);
      }
      
      // Scroll to top of page
      window.scrollTo(0, 0);
    };
    
    fetchPost();
  }, [slug, isPreview]); // Refetch when preview mode changes
  
  const toggleBookmark = () => {
    const bookmarks = JSON.parse(localStorage.getItem('blog-bookmarks') || '[]');
    
    if (isBookmarked) {
      // Remove from bookmarks
      const updatedBookmarks = bookmarks.filter((s: string) => s !== slug);
      localStorage.setItem('blog-bookmarks', JSON.stringify(updatedBookmarks));
    } else {
      // Add to bookmarks
      bookmarks.push(slug);
      localStorage.setItem('blog-bookmarks', JSON.stringify(bookmarks));
    }
    
    setIsBookmarked(!isBookmarked);
  };
  
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: post?.fields.title || 'Blog Post',
          text: post?.fields.excerpt || '',
          url: window.location.href,
        });
      } else {
        navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center py-12">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-600 dark:text-gray-300">Loading article...</p>
      </div>
    );
  }
  
  if (error || !post) {
    return (
      <div className="min-h-[400px] flex items-center justify-center py-12">
        <div className="text-center p-8 max-w-md">
          <div className="text-red-500 text-5xl mb-4">😕</div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            {error || 'Blog post not found'}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            The article you're looking for doesn't seem to exist or has been moved.
          </p>
          <Link 
            to="/blog" 
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to all articles
          </Link>
        </div>
      </div>
    );
  }
  
  // Format date if available
  const formattedDate = post.fields.publishedDate 
    ? format(new Date(post.fields.publishedDate), 'MMMM d, yyyy')
    : format(new Date(post.sys.createdAt), 'MMMM d, yyyy');
  
  // Get image URL or use a placeholder
  const featuredImageUrl = post.fields.featuredImage?.fields?.file?.url 
    ? `https:${post.fields.featuredImage.fields.file.url}`
    : 'https://images.unsplash.com/photo-1519681393784-d120267933ba';
  
  // Determine reading time (rough estimate based on word count)
  const wordCount = post.fields.content?.split(/\s+/).length || 0;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200)); // Average reading speed of 200 wpm
  
  return (
    <PageTransition>
      <article className="max-w-4xl mx-auto px-4 py-12">
        {/* Back link */}
        <div className="mb-8">
          <Link 
            to="/blog" 
            className={`inline-flex items-center text-sm font-medium ${
              isDarkMode 
                ? 'text-gray-400 hover:text-blue-400' 
                : 'text-gray-500 hover:text-blue-600'
            } transition-colors`}
          >
            <ArrowLeft size={16} className="mr-1" />
            Back to all articles
          </Link>
        </div>
        
        {/* Preview mode banner */}
        {isPreview && (
          <div className={`mb-6 p-3 rounded-lg flex items-center gap-2 ${
            isDarkMode 
              ? 'bg-blue-900/30 text-blue-200 border border-blue-800' 
              : 'bg-blue-50 text-blue-800 border border-blue-200'
          }`}>
            <AlertTriangle size={18} />
            <p className="text-sm">
              You're viewing this post in <strong>preview mode</strong>. This might include unpublished changes.
            </p>
          </div>
        )}
        
        <AnimatedSection>
          {/* Categories */}
          {post.fields.categories && post.fields.categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.fields.categories.map(category => (
                <Link 
                  key={category}
                  to={`/blog?category=${encodeURIComponent(category)}`}
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    isDarkMode 
                      ? 'bg-blue-900/80 text-blue-200 hover:bg-blue-800/80' 
                      : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                  } transition-colors`}
                >
                  <Tag size={12} className="mr-1" />
                  {category}
                </Link>
              ))}
            </div>
          )}
          
          {/* Title */}
          <h1 className={`text-3xl sm:text-4xl font-bold mb-4 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            {post.fields.title}
          </h1>
          
          {/* Meta information */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <div className="flex items-center">
              {post.fields.author?.fields?.avatar?.fields?.file?.url ? (
                <img 
                  src={`https:${post.fields.author.fields.avatar.fields.file.url}`}
                  alt={post.fields.author.fields.name}
                  className="w-8 h-8 rounded-full mr-2 object-cover"
                />
              ) : (
                <div className={`w-8 h-8 rounded-full mr-2 flex items-center justify-center ${
                  isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                }`}>
                  <User size={16} className={isDarkMode ? 'text-gray-400' : 'text-gray-500'} />
                </div>
              )}
              <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                {post.fields.author?.fields?.name || 'Unknown Author'}
              </span>
            </div>
            
            <div className={`flex items-center ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              <Calendar size={16} className="mr-1" />
              <span>{formattedDate}</span>
            </div>
            
            <div className={`flex items-center ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              <Clock size={16} className="mr-1" />
              <span>{readingTime} min read</span>
            </div>
          </div>
          
          {/* Featured Image */}
          <div className="rounded-xl overflow-hidden mb-8">
            <img 
              src={featuredImageUrl}
              alt={post.fields.title}
              className="w-full h-auto max-h-[500px] object-cover"
            />
          </div>
          
          {/* Article sharing/actions */}
          <div className={`flex justify-end gap-3 mb-8 pb-4 border-b ${
            isDarkMode ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <button 
              onClick={handleShare}
              className={`p-2 rounded-full ${
                isDarkMode 
                  ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
                  : 'text-gray-500 hover:text-blue-600 hover:bg-gray-100'
              } transition-colors`}
              title="Share article"
            >
              <Share2 size={18} />
            </button>
            
            <button 
              onClick={toggleBookmark}
              className={`p-2 rounded-full ${
                isBookmarked
                  ? isDarkMode 
                    ? 'text-blue-400 bg-blue-900/30' 
                    : 'text-blue-600 bg-blue-50'
                  : isDarkMode 
                    ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
                    : 'text-gray-500 hover:text-blue-600 hover:bg-gray-100'
              } transition-colors`}
              title={isBookmarked ? "Remove bookmark" : "Bookmark article"}
            >
              {isBookmarked ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
            </button>
          </div>
          
          {/* Content */}
          <div className={`prose max-w-none ${
            isDarkMode ? 'prose-invert' : ''
          } prose-headings:font-semibold prose-a:text-blue-600 dark:prose-a:text-blue-400`}>
            <ReactMarkdown>
              {post.fields.content}
            </ReactMarkdown>
          </div>
        </AnimatedSection>
      </article>
    </PageTransition>
  );
};

export default BlogPost;