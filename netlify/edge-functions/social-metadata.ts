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

// Check if URL is a tools page URL
function isToolsPageUrl(url: string): boolean {
  const pathname = new URL(url).pathname;
  return pathname === '/tools' || pathname.startsWith('/tools/');
}

// Extract slug from URL
function getSlugFromUrl(url: string): string {
  const pathname = new URL(url).pathname;
  const parts = pathname.split('/');
  return parts[parts.length - 1];
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
      <meta property="twitter:card" content="${post.fields.twitterCardType || 'summary_large_image'}">
      <meta property="twitter:url" content="https://enrizhulati.com/blog/${post.fields.customUrl || slug}">
      <meta property="twitter:title" content="${post.fields.ogTitle || post.fields.metaTitle || post.fields.title}">
      <meta property="twitter:description" content="${post.fields.ogDescription || post.fields.metaDescription || post.fields.excerpt || ''}">
      ${imageUrl ? `<meta property="twitter:image" content="${imageUrl}">` : ''}
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
    
    // Approach 2: Safer method that adds our critical tags at the top of head
    const updatedHtml = html.replace(
      '<head>',
      `<head>\n${metaTags}\n`
    );
    
    // Return the modified HTML with updated headers
    return new Response(updatedHtml, {
      headers: responseHeaders,
    });
  }
  
  // Process tools pages
  if (isToolsPageUrl(url)) {
    // Get the original response
    const response = await context.next();
    const html = await response.text();
    
    // We don't need to fetch from Contentful for tools - the metadata is static in the page
    // Just ensure it's properly included for social bots
    
    // Extract existing meta tags from the HTML
    const titleMatch = html.match(/<title>(.*?)<\/title>/i);
    const title = titleMatch ? titleMatch[1] : 'Marketing & SEO Tools';
    
    const descMatch = html.match(/<meta\s+name="description"\s+content="(.*?)"/i);
    const description = descMatch ? descMatch[1] : 'Boost your online performance with marketing calculators and SEO tools.';
    
    const ogImageMatch = html.match(/<meta\s+property="og:image"\s+content="(.*?)"/i);
    const ogImage = ogImageMatch ? ogImageMatch[1] : 'https://enrizhulati.com/images/tools-collection-preview.jpg';
    
    // Only modify if we're a social bot - regular page rendering should work fine normally
    if (isSocialBot) {
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
      
      // Approach 2: Safer method that adds our critical tags at the top of head
      const updatedHtml = html.replace(
        '<head>',
        `<head>\n${metaTags}\n`
      );
      
      // Return the modified HTML with updated headers
      return new Response(updatedHtml, {
        headers: responseHeaders,
      });
    }
  }
  
  // For all other URLs or if not a social bot, just continue
  return context.next();
} 