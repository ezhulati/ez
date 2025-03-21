import type { Context } from '@netlify/edge-functions';

// Types
type ContentfulAsset = {
  fields: {
    file: {
      url: string;
      details?: {
        image?: {
          width: number;
          height: number;
        };
      };
    };
    title?: string;
  };
};

type ContentfulAuthor = {
  fields: {
    name: string;
    avatar?: ContentfulAsset;
  };
};

type BlogPostEntry = {
  sys: {
    id: string;
    createdAt: string;
    updatedAt: string;
  };
  fields: {
    title: string;
    slug?: string;
    customUrl?: string;
    metaTitle?: string;
    metaDescription?: string;
    excerpt?: string;
    body?: string;
    featuredImage?: ContentfulAsset;
    image?: ContentfulAsset;
    seoKeywords?: string[];
    categories?: string[];
    ogTitle?: string;
    ogDescription?: string;
    twitterCardType?: string;
    canonicalUrl?: string;
    articlePublishDate?: string;
    articleModifiedDate?: string;
    author?: ContentfulAuthor;
    publishedDate?: string;
  };
};

// Contentful API constants
const CONTENTFUL_SPACE_ID = 'hdo1k8om3hmw';
const CONTENTFUL_ACCESS_TOKEN = 'g29C2epdpHoOQsex08PJXphQYxqVWsN-cUZBbO9QA4A';
const CONTENTFUL_ENVIRONMENT = 'master';

// Function to fetch from Contentful
async function fetchFromContentful(query: Record<string, string | number>): Promise<any> {
  const queryString = Object.entries(query)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
    .join('&');
    
  const url = `https://cdn.contentful.com/spaces/${CONTENTFUL_SPACE_ID}/environments/${CONTENTFUL_ENVIRONMENT}/entries?access_token=${CONTENTFUL_ACCESS_TOKEN}&${queryString}`;
  
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Contentful API error: ${response.status} ${response.statusText}`);
  }
  
  return await response.json();
}

// Function to get blog post by custom URL or slug
async function getBlogPost(identifier: string): Promise<BlogPostEntry | null> {
  try {
    // Try with blogPage first
    try {
      const response = await fetchFromContentful({
        content_type: 'blogPage',
        'fields.customUrl': identifier,
        limit: 1,
        select: 'sys.id,sys.createdAt,sys.updatedAt,fields.title,fields.slug,fields.customUrl,fields.metaTitle,fields.metaDescription,fields.excerpt,fields.featuredImage,fields.seoKeywords,fields.categories,fields.ogTitle,fields.ogDescription,fields.twitterCardType,fields.canonicalUrl,fields.articlePublishDate,fields.articleModifiedDate,fields.author,fields.publishedDate'
      });
      
      if (response.items.length > 0) {
        return response.items[0] as any as BlogPostEntry;
      }
      
      // Try with slug
      const slugResponse = await fetchFromContentful({
        content_type: 'blogPage',
        'fields.slug': identifier,
        limit: 1,
        select: 'sys.id,sys.createdAt,sys.updatedAt,fields.title,fields.slug,fields.customUrl,fields.metaTitle,fields.metaDescription,fields.excerpt,fields.featuredImage,fields.seoKeywords,fields.categories,fields.ogTitle,fields.ogDescription,fields.twitterCardType,fields.canonicalUrl,fields.articlePublishDate,fields.articleModifiedDate,fields.author,fields.publishedDate'
      });
      
      if (slugResponse.items.length > 0) {
        return slugResponse.items[0] as any as BlogPostEntry;
      }
      
    } catch (error) {
      // If that fails, try with blogPost
      const response = await fetchFromContentful({
        content_type: 'blogPost',
        'fields.customUrl': identifier,
        limit: 1,
        select: 'sys.id,sys.createdAt,sys.updatedAt,fields.title,fields.slug,fields.customUrl,fields.metaTitle,fields.metaDescription,fields.excerpt,fields.featuredImage,fields.seoKeywords,fields.categories,fields.ogTitle,fields.ogDescription,fields.twitterCardType,fields.canonicalUrl,fields.articlePublishDate,fields.articleModifiedDate,fields.author,fields.publishedDate'
      });
      
      if (response.items.length > 0) {
        return response.items[0] as any as BlogPostEntry;
      }
      
      // Try with slug
      const slugResponse = await fetchFromContentful({
        content_type: 'blogPost',
        'fields.slug': identifier,
        limit: 1,
        select: 'sys.id,sys.createdAt,sys.updatedAt,fields.title,fields.slug,fields.customUrl,fields.metaTitle,fields.metaDescription,fields.excerpt,fields.featuredImage,fields.seoKeywords,fields.categories,fields.ogTitle,fields.ogDescription,fields.twitterCardType,fields.canonicalUrl,fields.articlePublishDate,fields.articleModifiedDate,fields.author,fields.publishedDate'
      });
      
      if (slugResponse.items.length > 0) {
        return slugResponse.items[0] as any as BlogPostEntry;
      }
    }
    
    return null;
  } catch (error) {
    console.error(`Error fetching blog post with identifier ${identifier}:`, error);
    return null;
  }
}

// Check if URL is a blog post URL
function isBlogPostUrl(url: string): boolean {
  const pathname = new URL(url).pathname;
  return pathname.startsWith('/blog/') && pathname.split('/').length > 2;
}

// Check if URL is the main tools page URL
function isMainToolsPageUrl(url: string): boolean {
  const pathname = new URL(url).pathname;
  return pathname === '/tools' || pathname === '/tools/';
}

// Check if URL is a specific tool page
function isSpecificToolPageUrl(url: string): boolean {
  const pathname = new URL(url).pathname;
  return pathname.startsWith('/tools/') && pathname.split('/').length > 2;
}

// Get tool slug from URL
function getToolSlugFromUrl(url: string): string {
  const pathname = new URL(url).pathname;
  const parts = pathname.split('/');
  return parts[parts.length - 1];
}

// Extract slug from URL
function getSlugFromUrl(url: string): string {
  const pathname = new URL(url).pathname;
  const parts = pathname.split('/');
  return parts[parts.length - 1];
}

// Extract metadata from HTML with improved patterns
function extractMetadata(html: string): {
  title: string;
  description: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
} {
  // Default values - only used as a last resort
  const defaults = {
    title: 'Enri Zhulati',
    description: 'SEO & Marketing Consultant helping businesses grow their online presence.',
    ogTitle: '',
    ogDescription: '',
    ogImage: '',
    twitterTitle: '',
    twitterDescription: '',
    twitterImage: ''
  };
  
  // Extract title - this is page-specific by definition - try multiple patterns
  const titlePatterns = [
    /<title>(.*?)<\/title>/i,
    /<meta\s+name="title"\s+content="([^"]*)"[^>]*>/i,
    /<meta\s+property="og:title"\s+content="([^"]*)"[^>]*>/i,
    /<meta\s+name="twitter:title"\s+content="([^"]*)"[^>]*>/i
  ];
  
  for (const pattern of titlePatterns) {
    const match = html.match(pattern);
    if (match && match[1]) {
      defaults.title = match[1];
      console.log("Found title with pattern:", pattern, "Value:", match[1]);
      break;
    }
  }
  
  // Extract description - use multiple patterns to be more reliable
  const descPatterns = [
    /<meta\s+name="description"\s+content="([^"]*)"[^>]*>/i,
    /<meta\s+name='description'\s+content='([^']*)'[^>]*>/i,
    /<meta\s+name=description\s+content="([^"]*)"[^>]*>/i,
    /<meta\s+name=description\s+content='([^']*)'[^>]*>/i,
    /<meta\s+content="([^"]*)"\s+name="description"[^>]*>/i,
    /<meta\s+content='([^']*)'\s+name="description"[^>]*>/i
  ];
  
  for (const pattern of descPatterns) {
    const match = html.match(pattern);
    if (match && match[1]) {
      defaults.description = match[1];
      console.log("Found description with pattern:", pattern, "Value:", match[1]);
      break;
    }
  }
  
  // Extract OG title with multiple patterns
  const ogTitlePatterns = [
    /<meta\s+property="og:title"\s+content="([^"]*)"[^>]*>/i,
    /<meta\s+property='og:title'\s+content='([^']*)'[^>]*>/i,
    /<meta\s+content="([^"]*)"\s+property="og:title"[^>]*>/i,
    /<meta\s+content='([^']*)'\s+property="og:title"[^>]*>/i
  ];
  
  for (const pattern of ogTitlePatterns) {
    const match = html.match(pattern);
    if (match && match[1]) {
      defaults.ogTitle = match[1];
      console.log("Found OG title with pattern:", pattern, "Value:", match[1]);
      break;
    }
  }
  
  // Extract OG description - page specific - try multiple patterns
  const ogDescPatterns = [
    /<meta\s+property="og:description"\s+content="([^"]*)"[^>]*>/i,
    /<meta\s+property='og:description'\s+content='([^']*)'[^>]*>/i,
    /<meta\s+content="([^"]*)"\s+property="og:description"[^>]*>/i,
    /<meta\s+content='([^']*)'\s+property="og:description"[^>]*>/i
  ];
  
  for (const pattern of ogDescPatterns) {
    const match = html.match(pattern);
    if (match && match[1]) {
      defaults.ogDescription = match[1];
      console.log("Found OG description with pattern:", pattern, "Value:", match[1]);
      break;
    }
  }
  
  // Extract OG image - page specific
  const ogImageMatch = html.match(/<meta\s+property="og:image"\s+content="([^"]*)"[^>]*>/i);
  if (ogImageMatch) defaults.ogImage = ogImageMatch[1];
  
  // Extract Twitter title with multiple patterns
  const twitterTitlePatterns = [
    /<meta\s+name="twitter:title"\s+content="([^"]*)"[^>]*>/i,
    /<meta\s+name='twitter:title'\s+content='([^']*)'[^>]*>/i,
    /<meta\s+content="([^"]*)"\s+name="twitter:title"[^>]*>/i,
    /<meta\s+content='([^']*)'\s+name="twitter:title"[^>]*>/i
  ];
  
  for (const pattern of twitterTitlePatterns) {
    const match = html.match(pattern);
    if (match && match[1]) {
      defaults.twitterTitle = match[1];
      console.log("Found Twitter title with pattern:", pattern, "Value:", match[1]);
      break;
    }
  }
  
  // Extract Twitter description - page specific
  const twitterDescMatch = html.match(/<meta\s+name="twitter:description"\s+content="([^"]*)"[^>]*>/i);
  if (twitterDescMatch) defaults.twitterDescription = twitterDescMatch[1];
  
  // Extract Twitter image - page specific
  const twitterImageMatch = html.match(/<meta\s+name="twitter:image"\s+content="([^"]*)"[^>]*>/i);
  if (twitterImageMatch) defaults.twitterImage = twitterImageMatch[1];
  
  return defaults;
}

// Helper function to clean HTML of existing meta tags and add new metadata
function cleanAndAddMetadata(html: string, metaTags: string): string {
  // More targeted approach to remove meta tags
  let updatedHtml = html;
  
  // First, remove all existing keywords meta tags
  updatedHtml = updatedHtml.replace(/<meta\s+name=["']keywords["'][^>]*>/gi, '');
  
  // Then remove other meta tags we'll be replacing
  updatedHtml = updatedHtml.replace(/<meta\s+name=["']description["'][^>]*>/gi, '');
  updatedHtml = updatedHtml.replace(/<meta\s+property=["']og:[^"']*["'][^>]*>/gi, '');
  updatedHtml = updatedHtml.replace(/<meta\s+name=["']twitter:[^"']*["'][^>]*>/gi, '');
  
  // Remove canonical links
  updatedHtml = updatedHtml.replace(/<link\s+rel=["']canonical["'][^>]*>/gi, '');
  
  // Find the position to insert our meta tags
  const headEndPos = updatedHtml.indexOf('</head>');
  if (headEndPos !== -1) {
    // Insert the meta tags just before </head>
    updatedHtml = updatedHtml.slice(0, headEndPos) + metaTags + updatedHtml.slice(headEndPos);
  }
  
  return updatedHtml;
}

// Get specific image for a tool page based on the tool URL
function getToolImage(url: string): string {
  const pathname = new URL(url).pathname;
  const toolSlug = getToolSlugFromUrl(url);
  
  // Check for specific tool pages by slug or pathname
  if (pathname.includes('seo-roi-calculator')) {
    return "https://enrizhulati.com/images/seo-roi-calculator-preview.jpg";
  } else if (pathname.includes('website-speed-impact-calculator') || pathname.includes('speed-roi-calculator')) {
    return "https://enrizhulati.com/images/speed-roi-calculator-preview.jpg";
  } else if (pathname.includes('conversion-rate-calculator')) {
    return "https://enrizhulati.com/images/conversion-rate-calculator-preview.jpg";
  }
  
  // Default tools image
  return "https://enrizhulati.com/images/tools-collection-preview.jpg";
}

// Get specific description for a tool page based on the tool URL
function getToolDescription(url: string): string {
  const pathname = new URL(url).pathname;
  
  // Check for specific tool pages by path
  if (pathname.includes('seo-roi-calculator')) {
    return "Calculate the ROI of your SEO investment with this free SEO ROI calculator. See projected revenue, rankings, traffic, and leads based on your specific business metrics.";
  } else if (pathname.includes('website-speed-impact-calculator') || pathname.includes('speed-roi-calculator')) {
    return "Calculate how website speed impacts your business revenue with our free Website Speed ROI Calculator. See how improving page load time affects conversion rates and revenue.";
  } else if (pathname.includes('conversion-rate-calculator')) {
    return "Calculate how small improvements in conversion rate can dramatically impact your business revenue with our free Conversion Rate Calculator.";
  }
  
  // Default tools description
  return "Free marketing ROI calculators and tools to help you grow your business online. Measure the impact of SEO, website speed, and conversion optimization.";
}

// Function to get specific hardcoded description for a blog post by slug
function getHardcodedBlogDescription(slug: string): string {
  // Define a map of slug to description
  const blogDescriptions: Record<string, string> = {
    'how-to-create-ai-content-that-people-actually-want-to-read': 'Learn how to create AI-generated content that delivers value to readers. Tips on leveraging AI tools while maintaining authenticity and quality.',
    'best-wordpress-plugins-for-business-websites': 'Discover the essential WordPress plugins every business website needs. From SEO to security, these tools will supercharge your WordPress site.',
    'is-chat-gpt-good-for-seo': 'Explore how ChatGPT can enhance your SEO strategy when used correctly. Learn best practices, pitfalls to avoid, and how to leverage AI for better search rankings.',
    'how-often-should-you-publish-blog-posts': 'Find the ideal blogging frequency for your business goals. Quality over quantity? Learn how to determine the optimal publishing schedule.',
    'website-redesign-b2b-seo-checklist': 'Essential SEO checklist for B2B website redesigns. Avoid traffic losses and maintain rankings with these critical steps.',
    'website-development-cost-calculator': 'Understand the true cost of professional website development. This calculator helps budget for your next website project.'
  };
  
  // Return the description if found, otherwise a generic one
  return blogDescriptions[slug] || 'SEO & Marketing insights to help your business grow online. Professional tips, strategies and actionable advice from Enri Zhulati.';
}

// Function to get specific hardcoded title for a blog post by slug
function getHardcodedBlogTitle(slug: string): string {
  // Define a map of slug to title
  const blogTitles: Record<string, string> = {
    'how-to-create-ai-content-that-people-actually-want-to-read': 'How to Create AI Content That People Actually Want to Read',
    'best-wordpress-plugins-for-business-websites': 'Best WordPress Plugins for Business Websites in 2023',
    'is-chat-gpt-good-for-seo': 'Is ChatGPT Good for SEO? How AI Can Improve Your Search Rankings',
    'how-often-should-you-publish-blog-posts': 'How Often Should You Publish Blog Posts? Finding Your Ideal Frequency',
    'website-redesign-b2b-seo-checklist': 'B2B Website Redesign SEO Checklist: Protect Your Traffic & Rankings',
    'website-development-cost-calculator': 'Website Development Cost Calculator: Budget Your Next Project'
  };
  
  // Return the title if found, otherwise a generic one
  return blogTitles[slug] || 'SEO & Digital Marketing Blog | Enri Zhulati';
}

// Add timestamp to image URLs to prevent caching
function addTimestampToImageUrl(imageUrl: string): string {
  const timestamp = Date.now();
  const separator = imageUrl.includes('?') ? '&' : '?';
  return `${imageUrl}${separator}t=${timestamp}`;
}

// Enhanced function to set strong cache-busting headers
function setNoCacheHeaders(headers: Headers): void {
  // Standard cache control headers
  headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
  headers.set('Pragma', 'no-cache');
  headers.set('Expires', '0');
  
  // Social media specific cache headers
  headers.set('X-Robots-Tag', 'noarchive');
  
  // Facebook specific
  headers.set('X-FB-Debug', Date.now().toString());
  
  // Twitter/X specific
  headers.set('X-Twitter-Cache', 'MISS');
  
  // LinkedIn specific
  headers.set('X-LinkedIn-Cache-Control', 'no-cache');
  
  // Vary header to differentiate responses by user agent
  headers.set('Vary', 'User-Agent');
}

// Main edge function handler
export default async function handler(req: Request, context: Context) {
  console.log("Processing request for URL:", req.url);
  
  const url = req.url;
  const requestUrl = new URL(url);
  const canonicalUrl = `https://enrizhulati.com${requestUrl.pathname}`;
  
  // Get user agent for bot detection
  const userAgent = req.headers.get('User-Agent') || '';
  console.log("User-Agent:", userAgent);
  
  // Check if this request was already prerendered
  const wasPrerendered = req.headers.get('X-Prerendered') === 'true';
  
  // If this was prerendered, just pass through the response
  if (wasPrerendered) {
    console.log("Request was already prerendered, passing through");
    return context.next();
  }

  // Get the original response
  const response = await context.next();
  
  try {
    // Read the HTML content
    const html = await response.text();
    
    let updatedHtml = html;
    const responseHeaders = new Headers(response.headers);
    
    // Create a unique marker that won't be in the original HTML
    const marker = `<!--EZ-META-${Date.now()}-${Math.random().toString(36).substring(2, 15)}-->`;
    
    // Find head tag and prepare it for insertion
    const headMatch = html.match(/<head\b[^>]*>([\s\S]*?)<\/head>/i);
    
    if (!headMatch) {
      console.log("No head tag found in HTML");
      return new Response(html, {
        headers: responseHeaders,
      });
    }
    
    const fullHeadTag = headMatch[0]; // The entire <head>...</head> section
    const headContent = headMatch[1]; // Just the content between <head> and </head>
    
    // Prepare to generate our new meta tags
    let metaTags = '';
    
    // Handle blog posts specifically
    if (isBlogPostUrl(url)) {
      console.log("Blog post URL detected, fetching data");
      const slug = getSlugFromUrl(url);
      
      // Fetch blog post data
      let blogPost = null;
      try {
        blogPost = await getBlogPost(slug);
        console.log("Blog post data fetched:", blogPost ? blogPost.fields.title : "Not found");
        
        // Debug logging
        if (blogPost) {
          console.log("Blog post meta fields debug:");
          console.log("- metaTitle:", blogPost.fields.metaTitle);
          console.log("- title:", blogPost.fields.title);
          console.log("- metaDescription:", blogPost.fields.metaDescription);
          console.log("- excerpt:", blogPost.fields.excerpt);
          console.log("- seoKeywords:", blogPost.fields.seoKeywords);
          console.log("- categories:", blogPost.fields.categories);
        }
      } catch (error) {
        console.error("Error fetching blog post:", error);
      }
      
      // Get the data
      const blogPostTitle = blogPost?.fields.metaTitle || blogPost?.fields.title || getHardcodedBlogTitle(slug);
      const blogPostDescription = blogPost?.fields.metaDescription || blogPost?.fields.excerpt || getHardcodedBlogDescription(slug);
      const blogPostKeywords = blogPost?.fields.seoKeywords?.join(', ') || blogPost?.fields.categories?.join(', ') || "ai content, content creation, content strategy, AI writing, marketing content, SEO content";
      
      // Escape the content
      const escapeHtml = (str: string) => {
        if (!str) return '';
        return str
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#039;');
      };
      
      const safeTitle = escapeHtml(blogPostTitle);
      const safeDescription = escapeHtml(blogPostDescription);
      const safeKeywords = escapeHtml(blogPostKeywords);
      
      // Image URL
      const imageUrl = blogPost?.fields.featuredImage?.fields?.file?.url 
        ? `https:${blogPost.fields.featuredImage.fields.file.url}?fm=webp&w=1200&h=630&fit=fill` 
        : addTimestampToImageUrl("https://enrizhulati.com/images/blog-social-image.jpg");
        
      // Create our meta tags string
      metaTags = `
      <!-- START: Injected SEO Meta Tags -->
      <meta name="description" content="${safeDescription}">
      <meta name="keywords" content="${safeKeywords}">
      <link rel="canonical" href="${canonicalUrl}">
      
      <!-- Open Graph / Facebook -->
      <meta property="og:type" content="article">
      <meta property="og:url" content="${canonicalUrl}">
      <meta property="og:site_name" content="Enri Zhulati">
      <meta property="og:title" content="${safeTitle}">
      <meta property="og:description" content="${safeDescription}">
      <meta property="og:image" content="${imageUrl}">
      <meta property="article:published_time" content="${blogPost?.fields.articlePublishDate || blogPost?.fields.publishedDate || '2023-07-15T08:00:00+00:00'}">
      <meta property="article:author" content="https://enrizhulati.com">
      
      <!-- Twitter -->
      <meta name="twitter:card" content="${blogPost?.fields.twitterCardType || 'summary_large_image'}">
      <meta name="twitter:site" content="@enrizhulati">
      <meta name="twitter:title" content="${safeTitle}">
      <meta name="twitter:description" content="${safeDescription}">
      <meta name="twitter:image" content="${imageUrl}">
      
      <!-- Structured data for BlogPosting -->
      <script type="application/ld+json">
      {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": "${canonicalUrl}"
        },
        "headline": "${safeTitle}",
        "description": "${safeDescription}",
        "image": "${imageUrl}",
        "author": {
          "@type": "Person",
          "name": "${blogPost?.fields.author?.fields?.name || 'Enri Zhulati'}",
          "url": "https://enrizhulati.com"
        },
        "publisher": {
          "@type": "Organization",
          "name": "Enri Zhulati",
          "logo": {
            "@type": "ImageObject",
            "url": "https://enrizhulati.com/images/logo.png"
          }
        },
        "keywords": "${safeKeywords}",
        "datePublished": "${blogPost?.fields.articlePublishDate || blogPost?.fields.publishedDate || '2023-07-15T08:00:00+00:00'}",
        "dateModified": "${blogPost?.fields.articleModifiedDate || blogPost?.sys.updatedAt || '2023-08-30T10:00:00+00:00'}"
      }
      </script>
      <!-- END: Injected SEO Meta Tags -->
      `;
    } else {
      // Handle other pages (not blog posts)
      // Extract existing metadata from the HTML
      const metadata = extractMetadata(html);
      
      // Determine title and description based on the page type
      let title = metadata.ogTitle || metadata.twitterTitle || metadata.title || "Enri Zhulati | SEO & Digital Marketing Consultant";
      let description = metadata.ogDescription || metadata.description || "Professional web development, content creation, and SEO services that help your business get found online.";
      
      // Extract keywords from the HTML
      let keywords = "";
      const keywordsMatch = html.match(/<meta\s+name="keywords"\s+content="([^"]*)"[^>]*>/i);
      if (keywordsMatch && keywordsMatch[1]) {
        keywords = keywordsMatch[1];
      }
      
      // If no keywords found, use default keywords based on page type
      if (!keywords) {
        if (isSpecificToolPageUrl(url)) {
          keywords = "SEO tools, marketing calculators, ROI calculator, conversion rate calculator, SEO ROI, web performance";
        } else if (isMainToolsPageUrl(url)) {
          keywords = "marketing tools, SEO tools, free calculators, web tools, SEO resources";
        } else {
          keywords = "SEO, web development, content marketing, digital strategy, marketing consultant";
        }
      }
      
      // Handle tool pages
      if (isSpecificToolPageUrl(url)) {
        const toolSlug = getToolSlugFromUrl(url);
        
        // Use tool-specific title if needed
        if (!title || title === "Enri Zhulati" || title === "Growth Advisor - Web Development & Digital Strategy") {
          if (toolSlug === "seo-roi-calculator") {
            title = "SEO ROI Calculator | Measure SEO Investment Returns";
            description = "Calculate the potential return on investment for your SEO campaigns with this free SEO ROI calculator.";
            keywords = "SEO ROI, SEO calculator, return on investment, SEO investment, SEO value calculator";
          } else if (toolSlug === "speed-roi-calculator") {
            title = "Web Speed ROI Calculator | Performance Impact Calculator";
            description = "Calculate how web performance and page speed impacts your business metrics with this speed ROI calculator.";
            keywords = "speed ROI, web performance, page speed impact, performance ROI, website speed calculator";
          } else if (toolSlug === "conversion-rate-calculator") {
            title = "Conversion Rate Calculator | Optimize Your Funnel";
            description = "Calculate and optimize your conversion rates with this free calculator. See how changes affect your bottom line.";
            keywords = "conversion rate calculator, funnel optimization, CR calculator, sales conversion, lead conversion";
          }
        }
        
        // Use tool-specific description if needed
        const toolDesc = getToolDescription(url);
        if (!description || description === "Professional web development, content creation, and SEO services that help your business get found online.") {
          description = toolDesc;
        }
      } 
      // Main tools page
      else if (isMainToolsPageUrl(url)) {
        title = "Free Digital Marketing Tools & Calculators | Enri Zhulati";
        description = "Free marketing ROI calculators and tools to help you grow your business online. Measure the impact of SEO, website speed, and conversion optimization.";
      }
      
      // Determine image URL based on page type
      let imageUrl;
      if (isSpecificToolPageUrl(url)) {
        imageUrl = addTimestampToImageUrl(getToolImage(url));
      } else if (isMainToolsPageUrl(url)) {
        imageUrl = addTimestampToImageUrl("https://enrizhulati.com/images/tools-collection-preview.jpg");
      } else {
        imageUrl = addTimestampToImageUrl(metadata.ogImage || "https://enrizhulati.com/images/homepage-preview.jpg");
      }
      
      // Escape HTML characters for meta tag content
      const escapeHtml = (str: string) => {
        if (!str) return '';
        return str
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#039;');
      };

      const safeTitle = escapeHtml(title);
      const safeDescription = escapeHtml(description);
      const safeKeywords = escapeHtml(keywords);
      
      // Create meta tags for other page types
      metaTags = `
      <!-- START: Injected SEO Meta Tags -->
      <meta name="description" content="${safeDescription}">
      <meta name="keywords" content="${safeKeywords}">
      <link rel="canonical" href="${canonicalUrl}">
      
      <!-- Open Graph / Facebook -->
      <meta property="og:type" content="${isSpecificToolPageUrl(url) ? 'website' : 'website'}">
      <meta property="og:url" content="${canonicalUrl}">
      <meta property="og:site_name" content="Enri Zhulati">
      <meta property="og:title" content="${safeTitle}">
      <meta property="og:description" content="${safeDescription}">
      <meta property="og:image" content="${imageUrl}">
      
      <!-- Twitter -->
      <meta name="twitter:card" content="summary_large_image">
      <meta name="twitter:site" content="@enrizhulati">
      <meta name="twitter:creator" content="@enrizhulati">
      <meta name="twitter:url" content="${canonicalUrl}">
      <meta name="twitter:title" content="${safeTitle}">
      <meta name="twitter:description" content="${safeDescription}">
      <meta name="twitter:image" content="${imageUrl}">
      
      <!-- Structured data for WebPage -->
      <script type="application/ld+json">
      {
        "@context": "https://schema.org",
        "@type": "${isSpecificToolPageUrl(url) ? 'SoftwareApplication' : 'WebPage'}",
        "name": "${safeTitle}",
        "description": "${safeDescription}",
        "url": "${canonicalUrl}",
        "image": "${imageUrl}",
        ${isSpecificToolPageUrl(url) ? `
        "applicationCategory": "BusinessApplication",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        ` : ''}
        "author": {
          "@type": "Person",
          "name": "Enri Zhulati",
          "url": "https://enrizhulati.com"
        },
        "publisher": {
          "@type": "Organization",
          "name": "Enri Zhulati",
          "logo": {
            "@type": "ImageObject",
            "url": "https://enrizhulati.com/images/logo.png"
          }
        }
      }
      </script>
      <!-- END: Injected SEO Meta Tags -->
      `;
    }
    
    // Now carefully remove the old meta tags we want to replace
    // This is a simplified approach - we don't try to parse HTML structure
    // Just remove whole tag instances based on unique strings
    
    // Define patterns to find the meta tags we want to remove
    const patternsToRemove = [
      /<meta\s+name=["']keywords["'][^>]*>/gi,
      /<meta\s+name=["']description["'][^>]*>/gi,
      /<meta\s+property=["']og:title["'][^>]*>/gi,
      /<meta\s+property=["']og:description["'][^>]*>/gi,
      /<meta\s+property=["']og:image["'][^>]*>/gi,
      /<meta\s+property=["']og:url["'][^>]*>/gi,
      /<meta\s+property=["']og:type["'][^>]*>/gi,
      /<meta\s+property=["']og:site_name["'][^>]*>/gi,
      /<meta\s+name=["']twitter:card["'][^>]*>/gi,
      /<meta\s+name=["']twitter:site["'][^>]*>/gi,
      /<meta\s+name=["']twitter:title["'][^>]*>/gi,
      /<meta\s+name=["']twitter:description["'][^>]*>/gi,
      /<meta\s+name=["']twitter:image["'][^>]*>/gi,
      /<link\s+rel=["']canonical["'][^>]*>/gi
    ];
    
    // Clean up the head content by removing the old meta tags
    let cleanedHeadContent = headContent;
    for (const pattern of patternsToRemove) {
      cleanedHeadContent = cleanedHeadContent.replace(pattern, '');
    }
    
    // Construct a new head tag with our meta tags inserted at the beginning
    // This ensures they're not buried within other tags in the head
    const newHeadTag = `<head>${metaTags}${cleanedHeadContent}</head>`;
    
    // Replace the old head tag with our new one
    updatedHtml = html.replace(fullHeadTag, newHeadTag);
    
    // Set cache control headers
    setNoCacheHeaders(responseHeaders);
    
    // Return the updated HTML
    return new Response(updatedHtml, {
      headers: responseHeaders,
    });
  } catch (error) {
    console.error("Error processing response:", error);
    return response;
  }
} 