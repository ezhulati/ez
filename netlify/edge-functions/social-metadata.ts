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
      });
      
      if (response.items.length > 0) {
        return response.items[0] as any as BlogPostEntry;
      }
      
      // Try with slug
      const slugResponse = await fetchFromContentful({
        content_type: 'blogPage',
        'fields.slug': identifier,
        limit: 1,
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
      });
      
      if (response.items.length > 0) {
        return response.items[0] as any as BlogPostEntry;
      }
      
      // Try with slug
      const slugResponse = await fetchFromContentful({
        content_type: 'blogPost',
        'fields.slug': identifier,
        limit: 1,
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
  console.log("Original HTML head meta tags:", html.match(/<meta[^>]*>/gi));
  
  // First, remove all existing Open Graph and Twitter tags
  let cleanedHtml = html.replace(/<meta\s+property="og:[^>]*>/gi, '');
  cleanedHtml = cleanedHtml.replace(/<meta\s+name="twitter:[^>]*>/gi, '');
  
  // More aggressive approach to remove meta description and title tags - try multiple patterns
  cleanedHtml = cleanedHtml.replace(/<meta\s+name=["']description["'][^>]*>/gi, '');
  cleanedHtml = cleanedHtml.replace(/<meta\s+name=description[^>]*>/gi, '');
  cleanedHtml = cleanedHtml.replace(/<meta\s+content=[^>]*\s+name=["']description["'][^>]*>/gi, '');
  
  // Also remove title tags (except the main title tag)
  cleanedHtml = cleanedHtml.replace(/<meta\s+name=["']title["'][^>]*>/gi, '');
  cleanedHtml = cleanedHtml.replace(/<meta\s+name=title[^>]*>/gi, '');
  cleanedHtml = cleanedHtml.replace(/<meta\s+content=[^>]*\s+name=["']title["'][^>]*>/gi, '');
  
  console.log("Cleaned HTML - removed meta tags:", cleanedHtml.match(/<meta[^>]*>/gi));
  console.log("Adding new meta tags:", metaTags);
  
  // Now add our new meta tags right after the head opening tag
  return cleanedHtml.replace(
    '<head>',
    `<head>\n${metaTags}\n`
  );
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
  
  // Force our handler to run for all requests, not just social bots
  // This is needed during development to make sure the meta tags are updated
  const forceMeta = true;

  const url = req.url;
  
  // Check if this is a crawler or social media bot by examining the User-Agent
  const userAgent = req.headers.get('User-Agent') || '';
  const isSocialBot = /(facebookexternalhit|LinkedInBot|Twitterbot|WhatsApp|Slackbot|TelegramBot|Pinterest|Google-AMPHTML|Google-PageRenderer)/i.test(userAgent);
  
  // Add special handling for social media bots to ensure they get metadata
  if (isSocialBot) {
    console.log(`Social media bot detected: ${userAgent}`);
  }
  
  // Always process all requests - we're forcing this for development
  console.log("Processing request:", { url, forceMeta, isSocialBot });

  // Process blog posts
  if (isBlogPostUrl(url)) {
    console.log("Blog post URL detected:", url);
    const slug = getSlugFromUrl(url);
    console.log("Blog slug:", slug);
    
    // For blog posts, we'll take a more direct approach with hardcoded titles and descriptions
    // This ensures we always have the correct metadata regardless of the Contentful API
    const blogPostTitle = getHardcodedBlogTitle(slug);
    const blogPostDescription = getHardcodedBlogDescription(slug);
    console.log("Using hardcoded blog post title:", blogPostTitle);
    console.log("Using hardcoded blog post description:", blogPostDescription);
    
    // Standard blog post image with timestamp to prevent caching
    const imageUrl = addTimestampToImageUrl("https://enrizhulati.com/images/blog-social-image.jpg");
    
    // Get the original response
    const response = await context.next();
    const html = await response.text();
    
    // Hardcoded approach - directly replace the meta tags with our own
    let updatedHtml = html;
    
    // Remove existing meta tags
    updatedHtml = updatedHtml.replace(/<meta\s+name=["']description["'][^>]*>/gi, '');
    updatedHtml = updatedHtml.replace(/<meta\s+property=["']og:description["'][^>]*>/gi, '');
    updatedHtml = updatedHtml.replace(/<meta\s+name=["']twitter:description["'][^>]*>/gi, '');
    updatedHtml = updatedHtml.replace(/<meta\s+property=["']og:image["'][^>]*>/gi, '');
    updatedHtml = updatedHtml.replace(/<meta\s+name=["']twitter:image["'][^>]*>/gi, '');
    updatedHtml = updatedHtml.replace(/<meta\s+property=["']og:title["'][^>]*>/gi, '');
    updatedHtml = updatedHtml.replace(/<meta\s+name=["']twitter:title["'][^>]*>/gi, '');
    
    // Get the position to insert our meta tags (right after head opening)
    const headEndPos = updatedHtml.indexOf('</head>');
    if (headEndPos !== -1) {
      // Insert our meta tags right before the head closing tag
      const metaTags = `
      <!-- SEO Meta Tags (Blog) -->
      <meta name="description" content="${blogPostDescription}">
      <!-- Open Graph / Facebook (Blog) -->
      <meta property="og:title" content="${blogPostTitle}">
      <meta property="og:description" content="${blogPostDescription}">
      <meta property="og:image" content="${imageUrl}">
      <meta property="og:image:width" content="1200">
      <meta property="og:image:height" content="630">
      <meta property="og:url" content="https://enrizhulati.com/blog/${slug}">
      <meta property="og:type" content="article">
      <!-- Twitter (Blog) -->
      <meta name="twitter:title" content="${blogPostTitle}">
      <meta name="twitter:description" content="${blogPostDescription}">
      <meta name="twitter:image" content="${imageUrl}">
      <meta name="twitter:url" content="https://enrizhulati.com/blog/${slug}">
      <meta name="twitter:card" content="summary_large_image">
      <!-- Additional cache control meta tags -->
      <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
      <meta http-equiv="Pragma" content="no-cache">
      <meta http-equiv="Expires" content="0">
      `;
      
      // Insert the meta tags before the head closing tag
      updatedHtml = updatedHtml.slice(0, headEndPos) + metaTags + updatedHtml.slice(headEndPos);
    }
    
    // Set better cache headers to ensure crawlers get fresh content
    const responseHeaders = new Headers(response.headers);
    setNoCacheHeaders(responseHeaders);
    
    // Return the updated HTML
    return new Response(updatedHtml, {
      headers: responseHeaders,
    });
  }
  
  // For all other pages, we'll also process them
  // Get the original response
  const response = await context.next();
  const html = await response.text();
  
  // Extract existing metadata from the HTML
  const metadata = extractMetadata(html);
  console.log("Extracted metadata:", metadata);
  
  // Process main tools page
  if (isMainToolsPageUrl(url)) {
    console.log("Main tools page detected");
    // For tools main page, prioritize page-specific metadata
    // Only fall back to defaults if we can't find page-specific data
    const title = metadata.ogTitle || metadata.twitterTitle || metadata.title || "Free Digital Marketing Tools & Calculators | Enri Zhulati";
    
    // Check if we have the default description (homepage) and replace it with a tools-specific one
    const pageDesc = metadata.ogDescription || metadata.description;
    const description = (pageDesc && pageDesc !== "Professional web development, content creation, and SEO services that help your business get found online. Clear strategies and measurable results at transparent pricing.") 
      ? pageDesc 
      : "Free marketing ROI calculators and tools to help you grow your business online. Measure the impact of SEO, website speed, and conversion optimization.";
    
    const ogImage = addTimestampToImageUrl(metadata.ogImage || "https://enrizhulati.com/images/tools-collection-preview.jpg");
    
    console.log("Tools page meta:", { title, description, ogImage });
    
    // Set better cache headers to ensure crawlers get fresh content
    const responseHeaders = new Headers(response.headers);
    setNoCacheHeaders(responseHeaders);
    
    // Special meta tags version that ensures visibility in social shares
    const metaTags = `
      <!-- Open Graph / Facebook - Enhanced for Social Sharing -->
      <meta name="description" content="${description}">
      <meta property="og:type" content="website">
      <meta property="og:url" content="${url}">
      <meta property="og:title" content="${title}">
      <meta property="og:description" content="${description}">
      <meta property="og:image" content="${ogImage}">
      <meta property="og:image:width" content="1200">
      <meta property="og:image:height" content="630">
      <meta property="og:site_name" content="Enri Zhulati">
      
      <!-- Twitter -->
      <meta name="twitter:card" content="summary_large_image">
      <meta name="twitter:url" content="${url}">
      <meta name="twitter:title" content="${title}">
      <meta name="twitter:description" content="${description}">
      <meta name="twitter:image" content="${ogImage}">
      <meta name="twitter:site" content="@enrizhulati">
      <meta name="twitter:creator" content="@enrizhulati">
      
      <!-- Additional cache control meta tags -->
      <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
      <meta http-equiv="Pragma" content="no-cache">
      <meta http-equiv="Expires" content="0">
    `;
    
    // Use our clean method to replace all existing meta tags and add new ones
    const updatedHtml = cleanAndAddMetadata(html, metaTags);
    
    // Return the modified HTML with updated headers
    return new Response(updatedHtml, {
      headers: responseHeaders,
    });
  }
  
  // Process specific tool pages
  if (isSpecificToolPageUrl(url)) {
    console.log("Specific tool page detected:", url);
    const toolSlug = getToolSlugFromUrl(url);
    
    // For specific tool pages, use hardcoded titles if available, then page-specific, then defaults
    let title = metadata.ogTitle || metadata.twitterTitle || metadata.title;
    
    // Check if title is the generic site title and replace if needed
    if (!title || title === "Enri Zhulati" || title === "Growth Advisor - Web Development & Digital Strategy") {
      // Use tool-specific title based on slug
      if (toolSlug.includes('seo-roi-calculator')) {
        title = "SEO ROI Calculator: Calculate the Value of SEO for Your Business";
      } else if (toolSlug.includes('speed-roi-calculator')) {
        title = "Website Speed ROI Calculator: Calculate Revenue Impact of Page Speed";
      } else if (toolSlug.includes('conversion-rate-calculator')) {
        title = "Conversion Rate Calculator: See Revenue Impact of CRO";
      } else {
        title = "Free Digital Marketing Tools & Calculators | Enri Zhulati";
      }
    }
    
    // First try to get the page's own description, then fall back to our tool-specific descriptions
    const pageDesc = metadata.ogDescription || metadata.description;
    const toolDesc = getToolDescription(url);
    const description = (pageDesc && pageDesc !== "Professional web development, content creation, and SEO services that help your business get found online. Clear strategies and measurable results at transparent pricing.") 
      ? pageDesc 
      : toolDesc;
    
    console.log("Tool page meta:", { 
      title, 
      description,
      pageDesc,
      toolDesc
    });
    
    // Use the page's own image if available, or fall back to tool-specific image
    const ogImage = addTimestampToImageUrl(metadata.ogImage || getToolImage(url));
    
    // Set better cache headers to ensure crawlers get fresh content
    const responseHeaders = new Headers(response.headers);
    setNoCacheHeaders(responseHeaders);
    
    // Special meta tags version that ensures visibility in social shares
    const metaTags = `
      <!-- Open Graph / Facebook - Enhanced for Social Sharing -->
      <meta name="description" content="${description}">
      <meta property="og:type" content="website">
      <meta property="og:url" content="${url}">
      <meta property="og:title" content="${title}">
      <meta property="og:description" content="${description}">
      <meta property="og:image" content="${ogImage}">
      <meta property="og:image:width" content="1200">
      <meta property="og:image:height" content="630">
      <meta property="og:site_name" content="Enri Zhulati">
      
      <!-- Twitter -->
      <meta name="twitter:card" content="summary_large_image">
      <meta name="twitter:url" content="${url}">
      <meta name="twitter:title" content="${title}">
      <meta name="twitter:description" content="${description}">
      <meta name="twitter:image" content="${ogImage}">
      <meta name="twitter:site" content="@enrizhulati">
      <meta name="twitter:creator" content="@enrizhulati">
      
      <!-- Additional cache control meta tags -->
      <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
      <meta http-equiv="Pragma" content="no-cache">
      <meta http-equiv="Expires" content="0">
    `;
    
    // Use our clean method to replace all existing meta tags and add new ones
    const updatedHtml = cleanAndAddMetadata(html, metaTags);
    
    // Return the modified HTML with updated headers
    return new Response(updatedHtml, {
      headers: responseHeaders,
    });
  }
  
  // For any other pages (like homepage, etc.)
  console.log("Other page detected:", url);
  const pathname = new URL(url).pathname;
  let title = metadata.ogTitle || metadata.twitterTitle || metadata.title;
  
  // Check if title is using the default/generic site title
  if (!title || title === "Growth Advisor - Web Development & Digital Strategy") {
    // For homepage
    if (pathname === "/" || pathname === "") {
      title = "Enri Zhulati | SEO & Digital Marketing Consultant";
    } else {
      // Try to generate a title from the pathname
      const pageName = pathname.split('/').pop() || '';
      const formattedPageName = pageName
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      title = formattedPageName ? `${formattedPageName} | Enri Zhulati` : "Enri Zhulati | SEO & Digital Marketing Consultant";
    }
  }
  
  // Check if we have the default description and handle accordingly
  const description = metadata.ogDescription || metadata.description;
  
  // Default to the page's own image or fallback to homepage image with timestamp
  const ogImage = addTimestampToImageUrl(metadata.ogImage || metadata.twitterImage || "https://enrizhulati.com/images/homepage-preview.jpg");
  
  console.log("Page meta:", { title, description, ogImage });
  
  // Set better cache headers to ensure crawlers get fresh content
  const responseHeaders = new Headers(response.headers);
  setNoCacheHeaders(responseHeaders);
  
  // Special meta tags version that ensures visibility in social shares
  const metaTags = `
    <!-- Open Graph / Facebook - Enhanced for Social Sharing -->
    <meta name="description" content="${description}">
    <meta property="og:type" content="website">
    <meta property="og:url" content="${url}">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    <meta property="og:image" content="${ogImage}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:site_name" content="Enri Zhulati">
    
    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:url" content="${url}">
    <meta name="twitter:title" content="${title}">
    <meta name="twitter:description" content="${description}">
    <meta name="twitter:image" content="${ogImage}">
    <meta name="twitter:site" content="@enrizhulati">
    <meta name="twitter:creator" content="@enrizhulati">
    
    <!-- Additional cache control meta tags -->
    <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
    <meta http-equiv="Pragma" content="no-cache">
    <meta http-equiv="Expires" content="0">
  `;
  
  // Use our clean method to replace all existing meta tags and add new ones
  const updatedHtml = cleanAndAddMetadata(html, metaTags);
  
  // Return the modified HTML with updated headers
  return new Response(updatedHtml, {
    headers: responseHeaders,
  });
} 