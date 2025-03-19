import type { Context } from '@netlify/edge-functions';
import { createClient } from 'contentful';

// Add proper types
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

// Contentful client setup
const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID || 'hdo1k8om3hmw',
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN || 'g29C2epdpHoOQsex08PJXphQYxqVWsN-cUZBbO9QA4A',
  environment: process.env.CONTENTFUL_ENVIRONMENT || 'master',
});

// Function to get blog post by custom URL or slug
async function getBlogPost(identifier: string): Promise<BlogPostEntry | null> {
  try {
    // Try with blogPage first
    try {
      const response = await client.getEntries({
        content_type: 'blogPage',
        'fields.customUrl': identifier,
        limit: 1,
      });
      
      if (response.items.length > 0) {
        return response.items[0] as any as BlogPostEntry;
      }
      
      // Try with slug
      const slugResponse = await client.getEntries({
        content_type: 'blogPage',
        'fields.slug': identifier,
        limit: 1,
      });
      
      if (slugResponse.items.length > 0) {
        return slugResponse.items[0] as any as BlogPostEntry;
      }
      
    } catch (error) {
      // If that fails, try with blogPost
      const response = await client.getEntries({
        content_type: 'blogPost',
        'fields.customUrl': identifier,
        limit: 1,
      });
      
      if (response.items.length > 0) {
        return response.items[0] as any as BlogPostEntry;
      }
      
      // Try with slug
      const slugResponse = await client.getEntries({
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

// Extract slug from URL
function getSlugFromUrl(url: string): string {
  const pathname = new URL(url).pathname;
  const parts = pathname.split('/');
  return parts[parts.length - 1];
}

// Main edge function handler
export default async function handler(req: Request, context: Context) {
  const url = req.url;
  
  // Only process blog post URLs
  if (!isBlogPostUrl(url)) {
    return context.next();
  }
  
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
      : null;
  
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
  
  // Remove existing meta tags and insert our new ones
  const updatedHtml = html.replace(
    /<title>.*?<\/title>|<meta\s+(?:name|property)=["'](?:description|keywords|og:.*?|twitter:.*?)["']\s+content=["'].*?["']\s*\/?>/gi,
    ''
  ).replace(
    '</head>',
    `${metaTags}\n</head>`
  );
  
  // Return the modified HTML
  return new Response(updatedHtml, {
    headers: response.headers,
  });
} 