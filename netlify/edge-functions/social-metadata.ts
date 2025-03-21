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
  
  // Extract description - this should be page-specific
  const descMatch = html.match(/<meta\s+name="description"\s+content="([^"]*)"[^>]*>/i);
  if (descMatch) defaults.description = descMatch[1];
  
  // Extract OG title - page specific
  const ogTitleMatch = html.match(/<meta\s+property="og:title"\s+content="([^"]*)"[^>]*>/i);
  if (ogTitleMatch) defaults.ogTitle = ogTitleMatch[1];
  
  // Extract OG description - page specific
  const ogDescMatch = html.match(/<meta\s+property="og:description"\s+content="([^"]*)"[^>]*>/i);
  if (ogDescMatch) defaults.ogDescription = ogDescMatch[1];
  
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
  // First, remove all existing Open Graph and Twitter tags
  let cleanedHtml = html.replace(/<meta\s+property="og:[^>]*>/gi, '');
  cleanedHtml = cleanedHtml.replace(/<meta\s+name="twitter:[^>]*>/gi, '');
  
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

// Main edge function handler
export default async function handler(req: Request, context: Context) {
  const url = req.url;
  
  // Check if this is a crawler or social media bot by examining the User-Agent
  const userAgent = req.headers.get('User-Agent') || '';
  const isSocialBot = /(facebookexternalhit|LinkedInBot|Twitterbot|WhatsApp|Slackbot|TelegramBot|Pinterest|Google-AMPHTML|Google-PageRenderer)/i.test(userAgent);
  
  // Add special handling for social media bots to ensure they get metadata
  if (isSocialBot) {
    console.log(`Social media bot detected: ${userAgent}`);
  }
  
  // Process blog posts
  if (isBlogPostUrl(url)) {
    const slug = getSlugFromUrl(url);
    const post = await getBlogPost(slug);
    
    // If post not found, continue to the next function
    if (!post) {
      return context.next();
    }
    
    // Get the original response
    const response = await context.next();
    const html = await response.text();
    
    // Prepare image URL if available
    const imageUrl = post.fields.featuredImage?.fields?.file?.url 
      ? `https:${post.fields.featuredImage.fields.file.url}?fm=webp&w=1200&h=630&fit=fill` 
      : post.fields.image?.fields?.file?.url 
        ? `https:${post.fields.image.fields.file.url}?fm=webp&w=1200&h=630&fit=fill` 
        : "https://enrizhulati.com/images/blog-social-image.jpg";
    
    // Create metadata tags
    const metaTags = `
      <!-- SEO Meta Tags -->
      <title>${post.fields.metaTitle || post.fields.title}</title>
      <meta name="description" content="${post.fields.metaDescription || post.fields.excerpt || ''}">
      ${post.fields.seoKeywords ? `<meta name="keywords" content="${post.fields.seoKeywords.join(', ')}">` : ''}
      
      <!-- Open Graph / Facebook -->
      <meta property="og:type" content="article">
      <meta property="og:url" content="https://enrizhulati.com/blog/${post.fields.customUrl || slug}">
      <meta property="og:title" content="${post.fields.ogTitle || post.fields.metaTitle || post.fields.title}">
      <meta property="og:description" content="${post.fields.ogDescription || post.fields.metaDescription || post.fields.excerpt || ''}">
      ${imageUrl ? `<meta property="og:image" content="${imageUrl}">` : ''}
      ${imageUrl ? `<meta property="og:image:width" content="1200">` : ''}
      ${imageUrl ? `<meta property="og:image:height" content="630">` : ''}
      <meta property="og:locale" content="en_US">
      
      <!-- Twitter -->
      <meta name="twitter:card" content="${post.fields.twitterCardType || 'summary_large_image'}">
      <meta name="twitter:url" content="https://enrizhulati.com/blog/${post.fields.customUrl || slug}">
      <meta name="twitter:title" content="${post.fields.ogTitle || post.fields.metaTitle || post.fields.title}">
      <meta name="twitter:description" content="${post.fields.ogDescription || post.fields.metaDescription || post.fields.excerpt || ''}">
      ${imageUrl ? `<meta name="twitter:image" content="${imageUrl}">` : ''}
      <meta name="twitter:site" content="@enrizhulati">
      <meta name="twitter:creator" content="@enrizhulati">
      
      <!-- Canonical -->
      <link rel="canonical" href="${post.fields.canonicalUrl || `https://enrizhulati.com/blog/${post.fields.customUrl || slug}`}">
    `;
    
    // Set better cache headers to ensure crawlers get fresh content
    const responseHeaders = new Headers(response.headers);
    
    // Don't cache for social bots
    if (isSocialBot) {
      responseHeaders.set('Cache-Control', 'no-store, max-age=0');
    } else {
      // Cache for regular visitors but revalidate
      responseHeaders.set('Cache-Control', 'public, max-age=60, s-maxage=300');
    }
    
    // Use our clean method to replace all existing meta tags and add new ones
    const updatedHtml = cleanAndAddMetadata(html, metaTags);
    
    // Return the modified HTML with updated headers
    return new Response(updatedHtml, {
      headers: responseHeaders,
    });
  }
  
  // For pages other than blog posts, only proceed if it's a social bot or we're testing
  if (isSocialBot) {
    // Get the original response
    const response = await context.next();
    const html = await response.text();
    
    // Extract existing metadata from the HTML
    const metadata = extractMetadata(html);
    
    // Process main tools page
    if (isMainToolsPageUrl(url)) {
      // For tools main page, prioritize page-specific metadata
      // Only fall back to defaults if we can't find page-specific data
      const title = metadata.ogTitle || metadata.title;
      const description = metadata.ogDescription || metadata.description;
      const ogImage = metadata.ogImage || "https://enrizhulati.com/images/tools-collection-preview.jpg";
      
      // Set better cache headers to ensure crawlers get fresh content
      const responseHeaders = new Headers(response.headers);
      responseHeaders.set('Cache-Control', 'no-store, max-age=0');
      
      // Special meta tags version that ensures visibility in social shares
      const metaTags = `
        <!-- Open Graph / Facebook - Enhanced for Social Sharing -->
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
      // For specific tool pages, always use the page's own metadata first
      // Only fall back to defaults if needed
      const title = metadata.ogTitle || metadata.title;
      const description = metadata.ogDescription || metadata.description;
      
      // Use the page's own image if available, or fall back to tool-specific image
      const ogImage = metadata.ogImage || getToolImage(url);
      
      // Set better cache headers to ensure crawlers get fresh content
      const responseHeaders = new Headers(response.headers);
      responseHeaders.set('Cache-Control', 'no-store, max-age=0');
      
      // Special meta tags version that ensures visibility in social shares
      const metaTags = `
        <!-- Open Graph / Facebook - Enhanced for Social Sharing -->
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
    const title = metadata.ogTitle || metadata.title;
    const description = metadata.ogDescription || metadata.description;
    
    // Default to the page's own image or fallback to homepage image
    const ogImage = metadata.ogImage || metadata.twitterImage || "https://enrizhulati.com/images/homepage-preview.jpg";
    
    // Set better cache headers to ensure crawlers get fresh content
    const responseHeaders = new Headers(response.headers);
    responseHeaders.set('Cache-Control', 'no-store, max-age=0');
    
    // Special meta tags version that ensures visibility in social shares
    const metaTags = `
      <!-- Open Graph / Facebook - Enhanced for Social Sharing -->
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
  
  // For all other URLs or if not a social bot, just continue
  return context.next();
} 