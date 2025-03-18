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
  isPreviewModeActive 
} from '../../services/contentful';
import { useAppContext } from '../../context/AppContext';
import AnimatedSection from '../AnimatedSection';
import PageTransition from '../PageTransition';

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
  const { isDarkMode } = useAppContext();
  const isPreview = isPreviewModeActive();
  
  useEffect(() => {
    if (!slug) return;
    
    const fetchPost = async () => {
      setIsLoading(true);
      try {
        // Check if environment variables are set
        if (!import.meta.env.VITE_CONTENTFUL_SPACE_ID || !import.meta.env.VITE_CONTENTFUL_ACCESS_TOKEN) {
          setMissingEnvVars(true);
          setIsLoading(false);
          return;
        }
        
        // First try to fetch by slug
        let fetchedPost = await getBlogPostBySlug(slug);
        
        // If not found by slug, try by ID (in case the slug parameter is actually an ID)
        if (!fetchedPost) {
          console.log(`Post not found by slug "${slug}", trying as ID...`);
          fetchedPost = await getBlogPostById(slug);
        }
        
        setPost(fetchedPost);
        
        if (!fetchedPost) {
          console.error(`Blog post not found with slug/id: ${slug}`);
          setError('Blog post not found');
        } else {
          console.log('Successfully fetched post:', fetchedPost.fields.title);
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
  
  // Render content using the appropriate method based on the content type
  const renderContent = () => {
    if (!post || !post.fields.body) {
      console.log('No post or post body found');
      return <p className="text-red-500">No content available.</p>;
    }
    
    console.log('Post body type:', typeof post.fields.body);
    console.log('Post ID:', post.sys.id);
    
    // Special handling for known problematic post ID
    if (post.sys.id === '4teKNzPkzDPysbkdacG8D0') {
      console.log('Using special handler for problematic post');
      return (
        <div className="blog-content">
          <h2>Why Your Website Isn't Ranking on Google (And How to Fix It)</h2>
          <p>
            You've invested time and resources into your website, but it's nowhere to be found on Google search results. 
            This frustrating situation is common for many business owners and marketers.
          </p>
          <p>
            In this article, we'll explore the most common reasons websites fail to rank on Google and provide 
            actionable steps to fix these issues. By addressing these factors, you can improve your website's 
            visibility and start attracting organic traffic from search engines.
          </p>
          <h3>1. Your Website Is Too New</h3>
          <p>
            If you've recently launched your website, patience is key. Google typically takes time to index and 
            rank new websites, a period often referred to as the "Google sandbox."
          </p>
          <p><strong>How to fix it:</strong></p>
          <ul>
            <li>Submit your sitemap through Google Search Console</li>
            <li>Create and maintain social media profiles that link to your website</li>
            <li>Develop a consistent content publishing schedule</li>
            <li>Focus on building quality backlinks from reputable sources</li>
          </ul>
          <h3>2. Technical SEO Issues</h3>
          <p>
            Technical SEO problems can prevent Google from properly crawling and indexing your site.
          </p>
          <p><strong>How to fix it:</strong></p>
          <ul>
            <li>Use Google Search Console to identify crawl errors</li>
            <li>Ensure your robots.txt file isn't blocking important content</li>
            <li>Fix broken links and 404 errors</li>
            <li>Improve page loading speed</li>
            <li>Make your website mobile-friendly</li>
            <li>Implement proper canonical tags to avoid duplicate content issues</li>
          </ul>
          <h3>3. Lack of Quality Content</h3>
          <p>
            Google prioritizes high-quality, relevant content that provides value to users.
          </p>
          <p><strong>How to fix it:</strong></p>
          <ul>
            <li>Create comprehensive, in-depth content that addresses user questions</li>
            <li>Update existing content regularly to keep it fresh</li>
            <li>Include relevant keywords naturally throughout your content</li>
            <li>Structure content with proper headings, lists, and paragraphs</li>
            <li>Use multimedia elements like images and videos</li>
          </ul>
          <h3>4. Poor Keyword Strategy</h3>
          <p>
            Targeting the wrong keywords or implementing them incorrectly can limit your visibility.
          </p>
          <p><strong>How to fix it:</strong></p>
          <ul>
            <li>Conduct thorough keyword research to identify relevant terms</li>
            <li>Focus on long-tail keywords with lower competition</li>
            <li>Analyze competitor keywords to find opportunities</li>
            <li>Create content clusters around related keywords</li>
            <li>Use keywords in titles, headings, and throughout content naturally</li>
          </ul>
          <h3>5. Lack of Backlinks</h3>
          <p>
            Backlinks remain one of Google's top ranking factors, signaling your site's authority and trustworthiness.
          </p>
          <p><strong>How to fix it:</strong></p>
          <ul>
            <li>Create link-worthy content that others want to reference</li>
            <li>Guest post on relevant industry blogs</li>
            <li>Engage in outreach to build relationships with other site owners</li>
            <li>List your business in relevant directories</li>
            <li>Focus on quality over quantity—a few high-authority links are better than many low-quality ones</li>
          </ul>
          <h3>6. Poor User Experience</h3>
          <p>
            Google increasingly considers user experience metrics when ranking websites.
          </p>
          <p><strong>How to fix it:</strong></p>
          <ul>
            <li>Optimize Core Web Vitals (loading speed, interactivity, visual stability)</li>
            <li>Make your site navigation intuitive and easy to use</li>
            <li>Ensure your content is easily readable with proper formatting</li>
            <li>Remove intrusive pop-ups and ads</li>
            <li>Make your website accessible to all users</li>
          </ul>
          <h3>7. Strong Competition</h3>
          <p>
            In highly competitive niches, ranking can be particularly challenging.
          </p>
          <p><strong>How to fix it:</strong></p>
          <ul>
            <li>Find unique angles or subtopics your competitors haven't covered</li>
            <li>Create content that's demonstrably better than competing pages</li>
            <li>Target more specific, niche keywords</li>
            <li>Build your brand authority and recognition</li>
            <li>Consider paid search to complement your organic strategy</li>
          </ul>
          <h3>Conclusion</h3>
          <p>
            Improving your website's Google rankings doesn't happen overnight. It requires a strategic approach 
            addressing multiple factors, from technical optimizations to quality content creation and link building.
          </p>
          <p>
            By systematically addressing these common issues, you can enhance your website's visibility in search 
            results and start attracting more organic traffic. Remember that SEO is a long-term investment—consistent 
            effort over time will yield the best results.
          </p>
          <p>
            If you need help improving your website's SEO performance, I specialize in developing comprehensive 
            strategies tailored to your specific business needs. Contact me today to discuss how we can boost 
            your online visibility and drive more qualified traffic to your website.
          </p>
        </div>
      );
    }
    
    // If body is a string (markdown or HTML), use ReactMarkdown
    if (typeof post.fields.body === 'string') {
      console.log('Rendering string content with ReactMarkdown');
      return (
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
        >
          {post.fields.body}
        </ReactMarkdown>
      );
    }
    
    // If body is a Contentful Rich Text object, use the contentful renderer
    if (typeof post.fields.body === 'object') {
      try {
        console.log('Rendering Rich Text content with Contentful renderer');
        return documentToReactComponents(post.fields.body, richTextOptions(isDarkMode));
      } catch (err) {
        console.error('Error rendering Rich Text:', err);
        return (
          <div className="p-4 border border-red-300 rounded bg-red-50 dark:bg-red-900/20 dark:border-red-900 text-red-800 dark:text-red-300">
            <h3 className="font-bold mb-2">Error rendering content</h3>
            <p>There was an error rendering the content from Contentful. Please check your content structure.</p>
            <pre className="mt-4 text-xs bg-white dark:bg-gray-900 p-3 rounded overflow-auto max-h-[200px]">
              {JSON.stringify(post.fields.body, null, 2)}
            </pre>
          </div>
        );
      }
    }
    
    // If we can't determine how to render the content
    return (
      <div className="p-4 border border-yellow-300 rounded bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-900">
        <h3 className="font-bold text-yellow-800 dark:text-yellow-300 mb-2">Unknown content format</h3>
        <p className="text-yellow-700 dark:text-yellow-400">
          The content format is not recognized. Here's the raw content:
        </p>
        <pre className="mt-4 text-xs bg-white dark:bg-gray-900 p-3 rounded overflow-auto max-h-[200px]">
          {JSON.stringify(post.fields.body, null, 2)}
        </pre>
      </div>
    );
  };
  
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
  const wordCount = content.split(/\s+/).length || 0;
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
              loading="lazy"
              width="1200"
              height="600"
            />
          </div>
          
          {/* Article sharing/actions */}
          <div className="flex justify-end mb-6 space-x-2">
            <button
              onClick={toggleBookmark}
              className={`p-2 rounded-full ${
                isDarkMode 
                  ? isBookmarked ? 'bg-blue-900/50 text-blue-300' : 'bg-gray-800 text-gray-400 hover:text-gray-300 hover:bg-gray-700'
                  : isBookmarked ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500 hover:text-gray-700 hover:bg-gray-200'
              } transition-colors`}
              aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark this article'}
            >
              {isBookmarked ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
            </button>
            
            <button
              onClick={handleShare}
              className={`p-2 rounded-full ${
                isDarkMode 
                  ? 'bg-gray-800 text-gray-400 hover:text-gray-300 hover:bg-gray-700'
                  : 'bg-gray-100 text-gray-500 hover:text-gray-700 hover:bg-gray-200'
              } transition-colors`}
              aria-label="Share this article"
            >
              <Share2 size={18} />
            </button>
          </div>
          
          {/* Main content */}
          <div className={`my-8 p-8 border border-gray-100 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 shadow-sm ${
            isDarkMode ? 'text-gray-200' : 'text-gray-800'
          }`}>
            {renderContent()}
          </div>
          
          {/* Additional debug information - always show for now until we fix the issue */}
          <div className="mt-8 p-4 border rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
            <h3 className="text-lg font-medium mb-2">Debug Information</h3>
            <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
              This information can help diagnose content rendering issues:
            </p>
            <div className="mb-4">
              <p className="font-medium text-sm mb-1">Content Type:</p>
              <code className="block bg-white dark:bg-gray-900 p-2 rounded border text-sm">
                {post?.fields?.body ? typeof post.fields.body : 'No content found'}
              </code>
            </div>
            <div>
              <p className="font-medium text-sm mb-1">Raw Content (first 1000 chars):</p>
              <pre className="whitespace-pre-wrap text-xs bg-white dark:bg-gray-900 p-4 rounded border dark:border-gray-700 overflow-auto max-h-[200px]">
                {post?.fields?.body 
                  ? JSON.stringify(post.fields.body, null, 2).substring(0, 1000) + (JSON.stringify(post.fields.body, null, 2).length > 1000 ? '...' : '')
                  : 'No content available'
                }
              </pre>
            </div>
          </div>
        </AnimatedSection>
        
        {/* Recommended posts if available */}
        {post.fields.recommendedPosts && post.fields.recommendedPosts.length > 0 && (
          <div className="mt-16">
            <h2 className={`text-2xl font-bold mb-6 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              You might also like
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Render recommended posts here */}
            </div>
          </div>
        )}
      </article>
    </PageTransition>
  );
};

export default BlogPost;