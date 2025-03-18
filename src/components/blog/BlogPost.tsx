import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Calendar, Clock, ArrowLeft, User, Tag, Share2, Bookmark, BookmarkCheck, AlertTriangle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { 
  getBlogPostBySlug, 
  getBlogPostById,
  BlogPost as BlogPostType, 
  isPreviewModeActive 
} from '../../services/contentful';
import { useAppContext } from '../../context/AppContext';
import AnimatedSection from '../AnimatedSection';
import PageTransition from '../PageTransition';

// Function to convert Contentful RichText to Markdown (or extract plain text)
const richTextToMarkdown = (richText: any): string => {
  if (!richText || typeof richText !== 'object') {
    console.log('RichText is not an object:', richText);
    return '';
  }

  try {
    // If it's a node with content
    if (richText.nodeType && richText.content) {
      // Process different node types
      if (richText.nodeType === 'document') {
        return richText.content.map((node: any) => richTextToMarkdown(node)).join('\n\n');
      }

      if (richText.nodeType === 'paragraph') {
        return richText.content.map((node: any) => richTextToMarkdown(node)).join('');
      }

      if (richText.nodeType === 'heading-1') {
        return '# ' + richText.content.map((node: any) => richTextToMarkdown(node)).join('') + '\n\n';
      }

      if (richText.nodeType === 'heading-2') {
        return '## ' + richText.content.map((node: any) => richTextToMarkdown(node)).join('') + '\n\n';
      }

      if (richText.nodeType === 'heading-3') {
        return '### ' + richText.content.map((node: any) => richTextToMarkdown(node)).join('') + '\n\n';
      }

      if (richText.nodeType === 'heading-4') {
        return '#### ' + richText.content.map((node: any) => richTextToMarkdown(node)).join('') + '\n\n';
      }

      if (richText.nodeType === 'heading-5') {
        return '##### ' + richText.content.map((node: any) => richTextToMarkdown(node)).join('') + '\n\n';
      }

      if (richText.nodeType === 'heading-6') {
        return '###### ' + richText.content.map((node: any) => richTextToMarkdown(node)).join('') + '\n\n';
      }

      if (richText.nodeType === 'unordered-list') {
        return richText.content.map((node: any) => richTextToMarkdown(node)).join('\n') + '\n\n';
      }

      if (richText.nodeType === 'ordered-list') {
        return richText.content.map((node: any, index: number) => {
          // Prepend with index + 1 and period for ordered list
          const listItem = richTextToMarkdown(node);
          return `${index + 1}. ${listItem.trim()}`;
        }).join('\n') + '\n\n';
      }

      if (richText.nodeType === 'list-item') {
        return '- ' + richText.content.map((node: any) => richTextToMarkdown(node)).join('') + '\n';
      }

      if (richText.nodeType === 'blockquote') {
        return '> ' + richText.content.map((node: any) => richTextToMarkdown(node)).join('') + '\n\n';
      }

      if (richText.nodeType === 'hr') {
        return '---\n\n';
      }

      if (richText.nodeType === 'text') {
        let text = richText.value || '';
        
        // Apply marks
        if (richText.marks && richText.marks.length > 0) {
          richText.marks.forEach((mark: any) => {
            if (mark.type === 'bold') {
              text = `**${text}**`;
            } else if (mark.type === 'italic') {
              text = `*${text}*`;
            } else if (mark.type === 'underline') {
              text = `<u>${text}</u>`;
            } else if (mark.type === 'code') {
              text = `\`${text}\``;
            }
          });
        }
        
        return text;
      }
    }
    
    // Fallback for unsupported types
    console.log('Unsupported node type:', richText.nodeType);
    return '';
    
  } catch (error) {
    console.error('Error parsing RichText:', error);
    return '';
  }
};

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
  
  // Get content as markdown
  const getContentMarkdown = () => {
    if (!post) return '';
    
    console.log('Post body type:', typeof post.fields.body);
    console.log('Post body structure:', post.fields.body);
    
    // If body is a string, assume it's already markdown
    if (typeof post.fields.body === 'string') {
      console.log('Using string content');
      return post.fields.body;
    }
    
    // If body is RichText object, convert to markdown
    if (post.fields.body && typeof post.fields.body === 'object') {
      try {
        console.log('Converting RichText to markdown');
        const markdown = richTextToMarkdown(post.fields.body);
        console.log('Markdown conversion result length:', markdown.length);
        console.log('First 100 chars:', markdown.substring(0, 100));
        return markdown;
      } catch (err) {
        console.error('Failed to convert RichText to markdown:', err);
        // Fallback to showing error with stringified content for debugging
        return `Error rendering content. Please check Contentful setup.\n\n\`\`\`json\n${JSON.stringify(post.fields.body, null, 2)}\n\`\`\``;
      }
    }
    
    console.log('No content found in post body');
    return 'No content available for this post.';
  };
  
  // Check if primary rendering method is empty after mount
  useEffect(() => {
    if (!isLoading && post) {
      setTimeout(() => {
        const proseElement = document.querySelector('.prose');
        const isEmpty = proseElement && proseElement.innerHTML.trim().length === 0;
        if (isEmpty && getContentMarkdown().trim().length > 0) {
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
          <div className={`prose prose-lg max-w-none my-8 p-8 border border-gray-100 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 shadow-sm ${
            isDarkMode ? 'prose-invert' : ''
          } prose-headings:font-bold prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-img:rounded-xl prose-img:shadow-md`}>
            {/* Primary rendering method: ReactMarkdown with plugins */}
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
            >
              {getContentMarkdown()}
            </ReactMarkdown>
          </div>
          
          {/* Fallback rendering if ReactMarkdown produces empty results */}
          {useAlternateRendering && (
            <div className="mt-8">
              <h3 className="text-lg font-medium mb-2">Alternative Rendering</h3>
              {/* Direct HTML approach */}
              <div 
                className="prose prose-lg max-w-none p-6 border border-blue-100 dark:border-blue-900 rounded-lg bg-white dark:bg-gray-900"
                dangerouslySetInnerHTML={{ __html: getContentMarkdown() }} 
              />
            </div>
          )}
          
          {/* Show raw content if markdown is empty */}
          {getContentMarkdown().trim().length === 0 && (
            <div className="mt-8 p-4 border rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
              <h3 className="text-lg font-medium mb-2">Debug Information - Raw Content</h3>
              <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                The markdown conversion produced no content. Here's the raw content from Contentful:
              </p>
              <pre className="whitespace-pre-wrap text-xs bg-white dark:bg-gray-900 p-4 rounded border dark:border-gray-700 overflow-auto max-h-[400px]">
                {JSON.stringify(post.fields.body, null, 2)}
              </pre>
            </div>
          )}
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