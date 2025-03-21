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

// Extract metadata from HTML
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
  
  // Extract title - this is page-specific by definition
  const titleMatch = html.match(/<title>(.*?)<\/title>/i);
  if (titleMatch) defaults.title = titleMatch[1];
  
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
  
  // Extract OG title - page specific
  const ogTitleMatch = html.match(/<meta\s+property="og:title"\s+content="([^"]*)"[^>]*>/i);
  if (ogTitleMatch) defaults.ogTitle = ogTitleMatch[1];
  
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
  
  // Extract Twitter title - page specific
  const twitterTitleMatch = html.match(/<meta\s+name="twitter:title"\s+content="([^"]*)"[^>]*>/i);
  if (twitterTitleMatch) defaults.twitterTitle = twitterTitleMatch[1];
  
  // Extract Twitter description - page specific
  const twitterDescMatch = html.match(/<meta\s+name="twitter:description"\s+content="([^"]*)"[^>]*>/i);
  if (twitterDescMatch) defaults.twitterDescription = twitterDescMatch[1];
  
  // Extract Twitter image - page specific
  const twitterImageMatch = html.match(/<meta\s+name="twitter:image"\s+content="([^"]*)"[^>]*>/i);
  if (twitterImageMatch) defaults.twitterImage = twitterImageMatch[1];
  
  return defaults;
}

// Helper function to clean HTML of existing OG and Twitter tags and add new metadata
function cleanAndAddMetadata(html: string, metaTags: string): string {
  console.log("Original HTML head meta tags:", html.match(/<meta[^>]*>/gi));
  
  // First, remove all existing Open Graph and Twitter tags
  let cleanedHtml = html.replace(/<meta\s+property="og:[^>]*>/gi, '');
  cleanedHtml = cleanedHtml.replace(/<meta\s+name="twitter:[^>]*>/gi, '');
  
  // More aggressive approach to remove meta description tags - try multiple patterns
  cleanedHtml = cleanedHtml.replace(/<meta\s+name=["']description["'][^>]*>/gi, '');
  cleanedHtml = cleanedHtml.replace(/<meta\s+name=description[^>]*>/gi, '');
  cleanedHtml = cleanedHtml.replace(/<meta\s+content=[^>]*\s+name=["']description["'][^>]*>/gi, '');
  
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
    
    // For blog posts, we'll take a more direct approach with hardcoded descriptions
    // This ensures we always have the correct description regardless of the Contentful API
    const blogPostDescription = getHardcodedBlogDescription(slug);
    console.log("Using hardcoded blog post description:", blogPostDescription);
    
    // Standard blog post image
    const imageUrl = "https://enrizhulati.com/images/blog-social-image.jpg";
    
    // Get the original response
    const response = await context.next();
    const html = await response.text();
    
    // Hardcoded approach - directly replace the meta tags with our own
    let updatedHtml = html;
    
    // Remove existing meta description
    updatedHtml = updatedHtml.replace(/<meta\s+name=["']description["'][^>]*>/gi, '');
    updatedHtml = updatedHtml.replace(/<meta\s+property=["']og:description["'][^>]*>/gi, '');
    updatedHtml = updatedHtml.replace(/<meta\s+name=["']twitter:description["'][^>]*>/gi, '');
    updatedHtml = updatedHtml.replace(/<meta\s+property=["']og:image["'][^>]*>/gi, '');
    updatedHtml = updatedHtml.replace(/<meta\s+name=["']twitter:image["'][^>]*>/gi, '');
    
    // Get the position to insert our meta tags (right after head opening)
    const headEndPos = updatedHtml.indexOf('</head>');
    if (headEndPos !== -1) {
      // Insert our meta tags right before the head closing tag
      const metaTags = `
      <!-- SEO Meta Tags (Blog) -->
      <meta name="description" content="${blogPostDescription}">
      <!-- Open Graph / Facebook (Blog) -->
      <meta property="og:description" content="${blogPostDescription}">
      <meta property="og:image" content="${imageUrl}">
      <!-- Twitter (Blog) -->
      <meta name="twitter:description" content="${blogPostDescription}">
      <meta name="twitter:image" content="${imageUrl}">
      `;
      
      // Insert the meta tags before the head closing tag
      updatedHtml = updatedHtml.slice(0, headEndPos) + metaTags + updatedHtml.slice(headEndPos);
    }
    
    // Set better cache headers to ensure crawlers get fresh content
    const responseHeaders = new Headers(response.headers);
    responseHeaders.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
    responseHeaders.set('Pragma', 'no-cache');
    responseHeaders.set('Expires', '0');
    
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
    const title = metadata.ogTitle || metadata.title;
    
    // Check if we have the default description (homepage) and replace it with a tools-specific one
    const pageDesc = metadata.ogDescription || metadata.description;
    const description = (pageDesc && pageDesc !== "Professional web development, content creation, and SEO services that help your business get found online. Clear strategies and measurable results at transparent pricing.") 
      ? pageDesc 
      : "Free marketing ROI calculators and tools to help you grow your business online. Measure the impact of SEO, website speed, and conversion optimization.";
    
    const ogImage = metadata.ogImage || "https://enrizhulati.com/images/tools-collection-preview.jpg";
    
    console.log("Tools page meta:", { title, description, ogImage });
    
    // Set better cache headers to ensure crawlers get fresh content
    const responseHeaders = new Headers(response.headers);
    responseHeaders.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
    responseHeaders.set('Pragma', 'no-cache');
    responseHeaders.set('Expires', '0');
    
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
    // For specific tool pages, always use the page's own metadata first
    // Only fall back to defaults if needed
    const title = metadata.ogTitle || metadata.title;
    
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
    const ogImage = metadata.ogImage || getToolImage(url);
    
    // Set better cache headers to ensure crawlers get fresh content
    const responseHeaders = new Headers(response.headers);
    responseHeaders.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
    responseHeaders.set('Pragma', 'no-cache');
    responseHeaders.set('Expires', '0');
    
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
  const title = metadata.ogTitle || metadata.title;
  
  // Check if we have the default description and handle accordingly
  const description = metadata.ogDescription || metadata.description;
  
  // Default to the page's own image or fallback to homepage image
  const ogImage = metadata.ogImage || metadata.twitterImage || "https://enrizhulati.com/images/homepage-preview.jpg";
  
  console.log("Page meta:", { title, description, ogImage });
  
  // Set better cache headers to ensure crawlers get fresh content
  const responseHeaders = new Headers(response.headers);
  responseHeaders.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
  responseHeaders.set('Pragma', 'no-cache');
  responseHeaders.set('Expires', '0');
  
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
  `;
  
  // Use our clean method to replace all existing meta tags and add new ones
  const updatedHtml = cleanAndAddMetadata(html, metaTags);
  
  // Return the modified HTML with updated headers
  return new Response(updatedHtml, {
    headers: responseHeaders,
  });
} 