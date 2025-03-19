import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Calendar, Clock, ArrowLeft, User, Tag, Share2, Bookmark, BookmarkCheck, AlertTriangle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { BLOCKS, INLINES, MARKS } from '@contentful/rich-text-types';
import { 
  getBlogPostBySlug, 
  getBlogPostById,
  BlogPost as BlogPostType, 
  isPreviewModeActive,
  getBlogPostByCustomUrl
} from '../../services/contentful';
import { getPostSeoFields } from '../../services/contentfulSeo';
import { useAppContext } from '../../context/AppContext';
import AnimatedSection from '../AnimatedSection';
import PageTransition from '../PageTransition';
import BlogSeo from '../BlogSeo';

// Configure Contentful Rich Text options
const richTextOptions = (isDark: boolean) => ({
  renderMark: {
    [MARKS.BOLD]: (text: React.ReactNode) => <strong>{text}</strong>,
    [MARKS.ITALIC]: (text: React.ReactNode) => <em>{text}</em>,
    [MARKS.UNDERLINE]: (text: React.ReactNode) => <u>{text}</u>,
    [MARKS.CODE]: (text: React.ReactNode) => <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 font-mono text-sm">{text}</code>,
  },
  renderNode: {
    [BLOCKS.PARAGRAPH]: (node: any, children: React.ReactNode) => <p className="mb-4">{children}</p>,
    [BLOCKS.HEADING_1]: (node: any, children: React.ReactNode) => <h1 className="text-3xl font-bold mb-4 mt-8">{children}</h1>,
    [BLOCKS.HEADING_2]: (node: any, children: React.ReactNode) => <h2 className="text-2xl font-bold mb-3 mt-6">{children}</h2>,
    [BLOCKS.HEADING_3]: (node: any, children: React.ReactNode) => <h3 className="text-xl font-bold mb-3 mt-5">{children}</h3>,
    [BLOCKS.HEADING_4]: (node: any, children: React.ReactNode) => <h4 className="text-lg font-bold mb-2 mt-4">{children}</h4>,
    [BLOCKS.HEADING_5]: (node: any, children: React.ReactNode) => <h5 className="text-md font-bold mb-2 mt-4">{children}</h5>,
    [BLOCKS.HEADING_6]: (node: any, children: React.ReactNode) => <h6 className="text-sm font-bold mb-2 mt-4">{children}</h6>,
    [BLOCKS.UL_LIST]: (node: any, children: React.ReactNode) => <ul className="list-disc pl-5 mb-4">{children}</ul>,
    [BLOCKS.OL_LIST]: (node: any, children: React.ReactNode) => <ol className="list-decimal pl-5 mb-4">{children}</ol>,
    [BLOCKS.LIST_ITEM]: (node: any, children: React.ReactNode) => <li className="mb-1">{children}</li>,
    [BLOCKS.QUOTE]: (node: any, children: React.ReactNode) => (
      <blockquote className={`border-l-4 ${isDark ? 'border-blue-600 bg-gray-800' : 'border-blue-500 bg-gray-50'} pl-4 py-2 mb-4 italic`}>
        {children}
      </blockquote>
    ),
    [BLOCKS.HR]: () => <hr className="my-6 border-gray-300 dark:border-gray-700" />,
    [BLOCKS.EMBEDDED_ASSET]: (node: any) => {
      const { data: { target: { fields } } } = node;
      if (fields?.file?.url) {
        return (
          <img
            src={`https:${fields.file.url}`}
            alt={fields.title || 'Embedded asset'}
            className="my-4 rounded-lg shadow-md max-h-96 mx-auto"
          />
        );
      }
      return null;
    },
    [INLINES.HYPERLINK]: (node: any, children: React.ReactNode) => (
      <a 
        href={node.data.uri} 
        target="_blank" 
        rel="noopener noreferrer"
        className={`${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'} underline`}
      >
        {children}
      </a>
    ),
  },
});

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [missingEnvVars, setMissingEnvVars] = useState(false);
  const [useAlternateRendering, setUseAlternateRendering] = useState(false);
  const [rawHtml, setRawHtml] = useState<string>('');
  const [seoData, setSeoData] = useState<any>(null);
  const { isDarkMode } = useAppContext();
  const isPreview = isPreviewModeActive();
  
  // Global error handler - MOVED INSIDE COMPONENT
  useEffect(() => {
    console.log('Setting up global error handler');
    const handleError = (e: ErrorEvent) => {
      console.error('GLOBAL ERROR:', e);
      // Try to show error visibly on page
      const errorDiv = document.createElement('div');
      errorDiv.style.position = 'fixed';
      errorDiv.style.bottom = '0';
      errorDiv.style.left = '0';
      errorDiv.style.right = '0';
      errorDiv.style.background = 'red';
      errorDiv.style.color = 'white';
      errorDiv.style.padding = '20px';
      errorDiv.style.zIndex = '9999';
      errorDiv.innerText = `Error: ${e.message || 'Unknown error'}`;
      document.body.appendChild(errorDiv);
    };

    window.addEventListener('error', handleError);
    
    // Check for specific post ID in URL and log it
    const urlPath = window.location.pathname;
    console.log('CURRENT URL PATH:', urlPath);
    
    if (urlPath.includes('/blog/')) {
      const postId = urlPath.split('/blog/')[1];
      console.log('POST ID FROM URL:', postId);
    }
    
    return () => {
      window.removeEventListener('error', handleError);
    };
  }, []);
  
  // Log when component mounts
  useEffect(() => {
    console.log('BLOG POST COMPONENT MOUNTED. Slug:', slug);
  }, [slug]);
  
  // Fetch post data
  useEffect(() => {
    if (!slug) {
      console.log('NO SLUG FOUND');
      return;
    }
    
    const fetchPost = async () => {
      console.log('FETCHING POST WITH SLUG OR CUSTOM URL:', slug);
      setIsLoading(true);
      try {
        // Check if environment variables are set
        if (!import.meta.env.VITE_CONTENTFUL_SPACE_ID || !import.meta.env.VITE_CONTENTFUL_ACCESS_TOKEN) {
          console.error('MISSING ENV VARS');
          setMissingEnvVars(true);
          setIsLoading(false);
          return;
        }
        
        // Try in this order: slug, custom URL, ID
        // 1. First try to fetch by slug
        console.log('TRYING TO FETCH BY SLUG:', slug);
        let fetchedPost = await getBlogPostBySlug(slug);
        
        // 2. If not found by slug, try by custom URL
        if (!fetchedPost) {
          console.log(`POST NOT FOUND BY SLUG "${slug}", TRYING AS CUSTOM URL...`);
          fetchedPost = await getBlogPostByCustomUrl(slug);
        }
        
        // 3. If still not found, try by ID
        if (!fetchedPost) {
          console.log(`POST NOT FOUND BY CUSTOM URL "${slug}", TRYING AS ID...`);
          fetchedPost = await getBlogPostById(slug);
        }
        
        if (fetchedPost) {
          console.log('POST FOUND!', {
            id: fetchedPost.sys?.id,
            title: fetchedPost.fields?.title,
            bodyType: typeof fetchedPost.fields.body,
            hasBody: !!fetchedPost.fields.body
          });
          
          // Fetch SEO data
          const seo = await getPostSeoFields(slug || '');
          setSeoData(seo);
          console.log('SEO DATA LOADED:', seo);
          
          // Create raw HTML version for direct rendering fallback
          if (typeof fetchedPost.fields.body === 'string') {
            setRawHtml(fetchedPost.fields.body);
          } else if (fetchedPost.fields.body) {
            try {
              // Create simple HTML representation of the post
              const htmlContent = `
                <h1 class="text-2xl font-bold mb-4">${fetchedPost.fields.title || 'Blog Post'}</h1>
                <p>${fetchedPost.fields.excerpt || ''}</p>
                <div>
                  <p>The original content is in Rich Text format and requires proper rendering.</p>
                  <p>If you're seeing this, the automatic conversion process failed.</p>
                </div>
              `;
              setRawHtml(htmlContent);
            } catch (err: any) {
              console.error('ERROR CREATING RAW HTML:', err);
              setRawHtml(`<p>Error rendering content: ${err?.message || 'Unknown error'}</p>`);
            }
          }
        } else {
          console.error(`BLOG POST NOT FOUND WITH SLUG/ID: ${slug}`);
          setError('Blog post not found');
        }
        
        setPost(fetchedPost);
        
        // Check if post is bookmarked
        const bookmarks = JSON.parse(localStorage.getItem('blog-bookmarks') || '[]');
        setIsBookmarked(bookmarks.includes(slug));
        
      } catch (err: any) {
        console.error(`ERROR FETCHING BLOG POST WITH SLUG ${slug}:`, err);
        setError(`Failed to load blog post: ${err?.message || 'Unknown error'}`);
      } finally {
        setIsLoading(false);
      }
      
      // Scroll to top of page
      window.scrollTo(0, 0);
    };
    
    fetchPost();
  }, [slug, isPreview]); // Refetch when preview mode changes
  
  // Check if primary rendering method is empty after mount
  useEffect(() => {
    if (!isLoading && post) {
      setTimeout(() => {
        const proseElement = document.querySelector('.prose');
        const isEmpty = proseElement && proseElement.innerHTML.trim().length === 0;
        
        // Check if content exists but isn't rendering properly
        if (isEmpty && post.fields.body) {
          console.log('Primary rendering produced empty result, using alternative rendering');
          setUseAlternateRendering(true);
        }
      }, 500); // Give React time to render
    }
  }, [isLoading, post]);
  
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
  
  // Render content using the appropriate method based on the content type
  const renderContent = () => {
    console.log('RENDER CONTENT CALLED');
    if (!post || !post.fields.body) {
      console.log('NO POST OR POST BODY FOUND');
      return (
        <div className="p-4 bg-yellow-100 text-yellow-800 rounded">
          <p className="font-bold">No content available</p>
          <p>Post: {post ? 'exists' : 'null'}</p>
          <p>Body: {post?.fields?.body ? 'exists' : 'null'}</p>
        </div>
      );
    }
    
    // If body is a string (markdown or HTML), use ReactMarkdown
    if (typeof post.fields.body === 'string') {
      console.log('RENDERING STRING CONTENT WITH REACTMARKDOWN');
      try {
        return (
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
          >
            {post.fields.body}
          </ReactMarkdown>
        );
      } catch (err: any) {
        console.error('ERROR RENDERING MARKDOWN:', err);
        return (
          <div className="p-4 border border-red-300 rounded bg-red-50">
            <p className="font-bold">Error rendering markdown</p>
            <p>{err?.message || 'Unknown error'}</p>
            <pre className="mt-2 bg-white p-2 rounded text-xs overflow-auto">
              {post.fields.body.substring(0, 500)}...
            </pre>
          </div>
        );
      }
    }
    
    // If body is a Contentful Rich Text object, use the contentful renderer
    if (typeof post.fields.body === 'object') {
      try {
        console.log('RENDERING RICH TEXT CONTENT WITH CONTENTFUL RENDERER');
        return documentToReactComponents(post.fields.body, richTextOptions(isDarkMode));
      } catch (err: any) {
        console.error('ERROR RENDERING RICH TEXT:', err);
        return (
          <div className="p-4 border border-red-300 rounded bg-red-50 dark:bg-red-900/20 dark:border-red-900 text-red-800 dark:text-red-300">
            <h3 className="font-bold mb-2">Error rendering content</h3>
            <p>There was an error rendering the content from Contentful. Please check your content structure.</p>
            <p className="font-bold mt-2">Error: {err?.message || 'Unknown error'}</p>
          </div>
        );
      }
    }
    
    // If we can't determine how to render the content
    return (
      <div className="p-4 border border-yellow-300 rounded bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-900">
        <h3 className="font-bold text-yellow-800 dark:text-yellow-300 mb-2">Unknown content format</h3>
        <p className="text-yellow-700 dark:text-yellow-400">
          The content format is not recognized.
        </p>
      </div>
    );
  };
  
  if (missingEnvVars) {
    return (
      <div className={`p-6 rounded-lg border ${
        isDarkMode 
          ? 'bg-yellow-900/30 border-yellow-800 text-yellow-200' 
          : 'bg-yellow-50 border-yellow-200 text-yellow-800'
      }`}>
        <div className="flex items-start">
          <AlertTriangle className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-lg mb-2">Contentful Configuration Required</h3>
            <p className="mb-3">
              Missing Contentful environment variables. To display blog content, please set up the following in your .env file:
            </p>
            <ul className="list-disc pl-5 mb-4 space-y-1 text-sm">
              <li>VITE_CONTENTFUL_SPACE_ID</li>
              <li>VITE_CONTENTFUL_ACCESS_TOKEN</li>
              <li>VITE_CONTENTFUL_PREVIEW_TOKEN (optional for preview mode)</li>
            </ul>
            <p className="text-sm">
              See the README.md file for complete setup instructions.
            </p>
          </div>
        </div>
      </div>
    );
  }
  
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
  const featuredImageUrl = post.fields.image?.fields?.file?.url 
    ? `https:${post.fields.image.fields.file.url}?fm=webp&w=1200&h=600&fit=fill`
    : 'https://images.unsplash.com/photo-1519681393784-d120267933ba?fm=webp&w=1200&h=600&fit=fill';
  
  // Determine reading time (rough estimate based on word count)
  const content = post.fields.body || '';
  const wordCount = typeof content === 'string' ? content.split(/\s+/).length : 500;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200)); // Average reading speed of 200 wpm
  
  return (
    <PageTransition>
      {/* Add SEO metadata */}
      {seoData && <BlogSeo seoData={seoData} />}
      
      <article className="max-w-4xl mx-auto px-4 py-12 pt-16 lg:pt-28">
        {/* Back link with improved styling */}
        <div className="mb-10">
          <Link 
            to="/blog" 
            className={`inline-flex items-center text-sm font-medium transition-all hover:translate-x-[-3px] ${
              isDarkMode 
                ? 'text-gray-400 hover:text-blue-400' 
                : 'text-gray-500 hover:text-blue-600'
            }`}
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to all articles
          </Link>
        </div>
        
        <AnimatedSection>
          {/* Categories with improved styling */}
          {post.fields.categories && post.fields.categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-5">
              {post.fields.categories.map(category => (
                <Link 
                  key={category}
                  to={`/blog?category=${encodeURIComponent(category)}`}
                  className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                    isDarkMode 
                      ? 'bg-blue-900/80 text-blue-200 hover:bg-blue-800/80' 
                      : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                  }`}
                >
                  <Tag size={12} className="mr-1.5" />
                  {category}
                </Link>
              ))}
            </div>
          )}
          
          {/* Title with enhanced typography */}
          <h1 className={`text-3xl sm:text-4xl md:text-5xl font-bold mb-6 leading-tight ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            {post.fields.title}
          </h1>
          
          {/* Meta information with improved layout */}
          <div className="flex flex-wrap items-center gap-5 mb-8 border-b border-gray-100 dark:border-gray-800 pb-6">
            <div className="flex items-center">
              {post.fields.author?.fields?.avatar?.fields?.file?.url ? (
                <img 
                  src={`https:${post.fields.author.fields.avatar.fields.file.url}`}
                  alt={post.fields.author.fields.name || 'Author'}
                  className="w-10 h-10 rounded-full mr-3 object-cover border-2 border-white dark:border-gray-800 shadow-md"
                  width="40"
                  height="40"
                  loading="eager"
                />
              ) : (
                <div className={`w-10 h-10 rounded-full mr-3 flex items-center justify-center ${
                  isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                }`}>
                  <User size={20} className={isDarkMode ? 'text-gray-400' : 'text-gray-500'} />
                </div>
              )}
              <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {post.fields.author?.fields?.name || (post.sys.id === '4teKNzPkzDPysbkdacG8D0' ? 'Enri Zhulati' : 'Unknown Author')}
              </span>
            </div>
            
            <div className={`flex items-center ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              <Calendar size={16} className="mr-1.5" />
              <span>{formattedDate}</span>
            </div>
            
            <div className={`flex items-center ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              <Clock size={16} className="mr-1.5" />
              <span>{readingTime} min read</span>
            </div>
          </div>
          
          {/* Featured Image with enhanced styling */}
          <div className="rounded-xl overflow-hidden mb-10 shadow-lg">
            <img 
              src={featuredImageUrl}
              alt={post.fields.title}
              className="w-full h-auto max-h-[500px] object-cover transform hover:scale-105 transition-transform duration-700"
              loading="lazy"
              width="1200"
              height="600"
            />
          </div>
          
          {/* Article sharing/actions with improved styling */}
          <div className="flex justify-end mb-8 space-x-2">
            <button
              onClick={toggleBookmark}
              className={`p-2.5 rounded-full transition-all hover:scale-110 ${
                isDarkMode 
                  ? isBookmarked ? 'bg-blue-900/50 text-blue-300' : 'bg-gray-800 text-gray-400 hover:text-gray-300 hover:bg-gray-700'
                  : isBookmarked ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500 hover:text-gray-700 hover:bg-gray-200'
              }`}
              aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark this article'}
            >
              {isBookmarked ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
            </button>
            
            <button
              onClick={handleShare}
              className={`p-2.5 rounded-full transition-all hover:scale-110 ${
                isDarkMode 
                  ? 'bg-gray-800 text-gray-400 hover:text-gray-300 hover:bg-gray-700'
                  : 'bg-gray-100 text-gray-500 hover:text-gray-700 hover:bg-gray-200'
              }`}
              aria-label="Share this article"
            >
              <Share2 size={18} />
            </button>
          </div>
          
          {/* Main content area with enhanced styling */}
          <div 
            className="my-8 p-8 sm:p-10 border border-gray-100 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 shadow-md"
          >
            {renderContent()}
          </div>
          
          {/* Add author bio section */}
          <div className="mt-16 p-6 border border-gray-100 dark:border-gray-800 rounded-lg bg-gray-50 dark:bg-gray-800/50">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden border-4 ${
                isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-200 border-gray-100'
              }`}>
                {post.fields.author?.fields?.avatar?.fields?.file?.url ? (
                  <img 
                    src={`https:${post.fields.author.fields.avatar.fields.file.url}?fm=webp&w=160&h=160&fit=fill`}
                    alt={post.fields.author?.fields?.name || 'Author'}
                    className="w-full h-full object-cover"
                    width="80"
                    height="80"
                    loading="lazy"
                  />
                ) : (
                  <User size={32} className={isDarkMode ? 'text-gray-400' : 'text-gray-500'} />
                )}
              </div>
              <div>
                <h3 className={`text-xl font-bold mb-2 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>About the Author</h3>
                <p className={`${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                } leading-relaxed`}>
                  {post.fields.author?.fields?.name || (post.sys.id === '4teKNzPkzDPysbkdacG8D0' ? 'Enri Zhulati' : 'Unknown Author')} is a digital marketing specialist with expertise in SEO,
                  content strategy, and website optimization.
                </p>
                <div className="flex gap-3">
                  <a href="#" className={`text-sm font-medium ${
                    isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'
                  }`}>Twitter</a>
                  <a href="#" className={`text-sm font-medium ${
                    isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'
                  }`}>LinkedIn</a>
                  <a href="#" className={`text-sm font-medium ${
                    isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'
                  }`}>Website</a>
                </div>
              </div>
            </div>
          </div>
          
          {/* Add related articles section */}
          <div className="mt-16">
            <h2 className={`text-2xl font-bold mb-8 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              You might also like
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className={`rounded-lg overflow-hidden border ${
                isDarkMode ? 'border-gray-800 bg-gray-900' : 'border-gray-100 bg-white'
              } shadow-sm hover:shadow-md transition-shadow`}>
                <div className="h-48 bg-gray-200 dark:bg-gray-800">
                  {/* Placeholder for image */}
                </div>
                <div className="p-5">
                  <h3 className={`text-lg font-bold mb-2 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>5 Essential SEO Tools Every Website Owner Should Use</h3>
                  <p className={`text-sm mb-3 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>Discover the must-have tools to improve your website's search engine visibility.</p>
                  <Link to="/blog" className={`text-sm font-medium flex items-center ${
                    isDarkMode ? 'text-blue-400' : 'text-blue-600'
                  }`}>
                    Read more <ArrowLeft size={14} className="ml-1 rotate-180" />
                  </Link>
                </div>
              </div>
              <div className={`rounded-lg overflow-hidden border ${
                isDarkMode ? 'border-gray-800 bg-gray-900' : 'border-gray-100 bg-white'
              } shadow-sm hover:shadow-md transition-shadow`}>
                <div className="h-48 bg-gray-200 dark:bg-gray-800">
                  {/* Placeholder for image */}
                </div>
                <div className="p-5">
                  <h3 className={`text-lg font-bold mb-2 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>How to Create Content That Ranks in 2023</h3>
                  <p className={`text-sm mb-3 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>Learn the latest strategies for creating high-ranking content in today's competitive landscape.</p>
                  <Link to="/blog" className={`text-sm font-medium flex items-center ${
                    isDarkMode ? 'text-blue-400' : 'text-blue-600'
                  }`}>
                    Read more <ArrowLeft size={14} className="ml-1 rotate-180" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
          
          {/* Add newsletter signup */}
          <div className="mt-16 p-8 border border-blue-100 dark:border-blue-900/30 rounded-lg bg-blue-50 dark:bg-blue-900/10">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className={`text-xl sm:text-2xl font-bold mb-4 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>Get more SEO tips straight to your inbox</h2>
              <p className={`mb-6 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>Sign up for my newsletter to receive exclusive tips and strategies to improve your website's ranking.</p>
              <div className="flex flex-col sm:flex-row gap-3 items-center">
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className={`w-full py-3 px-4 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isDarkMode 
                      ? 'bg-gray-900 border-gray-700 text-white' 
                      : 'bg-white border-gray-300 text-gray-800'
                  }`}
                />
                <button 
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors w-full sm:w-auto"
                >
                  Subscribe
                </button>
              </div>
              <p className={`text-xs mt-3 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>I respect your privacy. Unsubscribe at any time.</p>
            </div>
          </div>
        </AnimatedSection>
      </article>
    </PageTransition>
  );
};

export default BlogPost;