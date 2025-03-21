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
  
  const url = req.url;
  const requestUrl = new URL(url);
  const canonicalUrl = `https://enrizhulati.com${requestUrl.pathname}`;
  
  // Comprehensive bot detection - much more thorough than before
  const userAgent = req.headers.get('User-Agent') || '';
  
  // Detect social media crawlers with an expanded list
  const isSocialBot = /facebookexternalhit|LinkedInBot|twitter|Twitterbot|Pinterest|WhatsApp|Slack|TelegramBot|Googlebot|bingbot|google-inspectiontool|Baiduspider|Yandex|Bytespider|Discordbot|W3C_Validator|Embedly|Mastodon|Applebot|facebot|ia_archiver|paperli|flipboard/i.test(userAgent);
  
  // Detect mobile devices
  const isMobileDevice = /Mobile|Android|iPhone|iPad|Windows Phone/i.test(userAgent);
  
  console.log(`Request type: Social Bot: ${isSocialBot}, Mobile: ${isMobileDevice}, UserAgent: ${userAgent}`);

  // Process blog posts
  if (isBlogPostUrl(url)) {
    console.log("Blog post URL detected:", url);
    const slug = getSlugFromUrl(url);
    console.log("Blog slug:", slug);
    
    // For blog posts, use hardcoded values for reliability
    const blogPostTitle = getHardcodedBlogTitle(slug);
    const blogPostDescription = getHardcodedBlogDescription(slug);
    
    // Use static image URLs without dynamic parameters for social sharing
    // Social platforms often cache the first version they see, so avoid timestamps
    const staticImageUrl = "https://enrizhulati.com/images/blog-social-image.jpg";
    
    // Date information for article schema
    const publishDate = new Date().toISOString();
    
    // Get the original response
    const response = await context.next();
    const html = await response.text();
    
    // Create a completely new response for social bots
    if (isSocialBot) {
      console.log("Generating optimized response for social bot");
      
      // Set up response headers for social bots - focus on cache control
      const responseHeaders = new Headers(response.headers);
      responseHeaders.set('Content-Type', 'text/html; charset=UTF-8');
      responseHeaders.set('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0');
      responseHeaders.set('Pragma', 'no-cache');
      responseHeaders.set('Expires', '0');
      
      // Create a specialized minimal HTML document for social crawlers
      // This is what professional sites do - serve a simplified version to bots
      const socialBotHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${blogPostTitle}</title>
  
  <!-- Essential meta tags -->
  <meta name="description" content="${blogPostDescription}">
  <link rel="canonical" href="${canonicalUrl}">
  
  <!-- Schema.org for Google -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": "${blogPostTitle}",
    "image": "${staticImageUrl}",
    "datePublished": "${publishDate}",
    "dateModified": "${publishDate}",
    "author": {
      "@type": "Person",
      "name": "Enri Zhulati"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Enri Zhulati",
      "logo": {
        "@type": "ImageObject",
        "url": "https://enrizhulati.com/images/logo.png"
      }
    },
    "description": "${blogPostDescription}"
  }
  </script>
  
  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="article">
  <meta property="og:url" content="${canonicalUrl}">
  <meta property="og:site_name" content="Enri Zhulati">
  <meta property="og:title" content="${blogPostTitle}">
  <meta property="og:description" content="${blogPostDescription}">
  <meta property="og:image" content="${staticImageUrl}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="${blogPostTitle}">
  <meta property="article:author" content="https://enrizhulati.com/about">
  <meta property="article:published_time" content="${publishDate}">
  
  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:site" content="@enrizhulati">
  <meta name="twitter:creator" content="@enrizhulati">
  <meta name="twitter:url" content="${canonicalUrl}">
  <meta name="twitter:title" content="${blogPostTitle}">
  <meta name="twitter:description" content="${blogPostDescription}">
  <meta name="twitter:image" content="${staticImageUrl}">
  <meta name="twitter:image:alt" content="${blogPostTitle}">
  
  <!-- LinkedIn -->
  <meta property="linkedin:owner" content="Enri Zhulati">
  <meta property="linkedin:title" content="${blogPostTitle}">
  <meta property="linkedin:description" content="${blogPostDescription}">
  <meta property="linkedin:image" content="${staticImageUrl}">
  
  <!-- WhatsApp -->
  <meta property="og:site_name" content="Enri Zhulati">
  <meta property="og:title" content="${blogPostTitle}">
  <meta property="og:description" content="${blogPostDescription}">
  <meta property="og:image" content="${staticImageUrl}">
</head>
<body>
  <h1>${blogPostTitle}</h1>
  <p>${blogPostDescription}</p>
  <img src="${staticImageUrl}" alt="${blogPostTitle}" />
  <p>Visit <a href="${canonicalUrl}">Enri Zhulati's blog</a> to read the full article.</p>
</body>
</html>`;

      // Return the specialized version for bots
      return new Response(socialBotHtml, {
        headers: responseHeaders,
      });
    }
    
    // For regular browsers, update the existing HTML similar to before
    // But use a cleaner, more thorough approach to replacing meta tags
    let updatedHtml = html;
    
    // Remove existing meta tags with a more comprehensive approach
    // Use a single regex to catch all meta tags we want to replace
    updatedHtml = updatedHtml.replace(/<meta\s+(name|property)=["'](description|og:[^"']*|twitter:[^"']*)["'][^>]*>/gi, '');
    
    // Get the position to insert our meta tags
    const headEndPos = updatedHtml.indexOf('</head>');
    if (headEndPos !== -1) {
      // Create meta tags with timestamps for regular browsers
      const imageUrl = addTimestampToImageUrl(staticImageUrl);
      
      const metaTags = `
      <!-- SEO Meta Tags -->
      <meta name="description" content="${blogPostDescription}">
      <link rel="canonical" href="${canonicalUrl}">
      
      <!-- Open Graph / Facebook -->
      <meta property="og:type" content="article">
      <meta property="og:url" content="${canonicalUrl}">
      <meta property="og:site_name" content="Enri Zhulati">
      <meta property="og:title" content="${blogPostTitle}">
      <meta property="og:description" content="${blogPostDescription}">
      <meta property="og:image" content="${imageUrl}">
      <meta property="og:image:width" content="1200">
      <meta property="og:image:height" content="630">
      <meta property="og:image:alt" content="${blogPostTitle}">
      
      <!-- Twitter -->
      <meta name="twitter:card" content="summary_large_image">
      <meta name="twitter:site" content="@enrizhulati">
      <meta name="twitter:creator" content="@enrizhulati">
      <meta name="twitter:url" content="${canonicalUrl}">
      <meta name="twitter:title" content="${blogPostTitle}">
      <meta name="twitter:description" content="${blogPostDescription}">
      <meta name="twitter:image" content="${imageUrl}">
      <meta name="twitter:image:alt" content="${blogPostTitle}">
      `;
      
      // Insert the meta tags
      updatedHtml = updatedHtml.slice(0, headEndPos) + metaTags + updatedHtml.slice(headEndPos);
    }
    
    // Set cache headers for regular browsers
    const responseHeaders = new Headers(response.headers);
    setNoCacheHeaders(responseHeaders);
    
    // Return the updated HTML
    return new Response(updatedHtml, {
      headers: responseHeaders,
    });
  }
  
  // Process tool pages with similar bot-specific optimizations
  if (isSpecificToolPageUrl(url)) {
    console.log("Specific tool page detected:", url);
    const toolSlug = getToolSlugFromUrl(url);
    
    // Get the original response
    const response = await context.next();
    const html = await response.text();
    
    // Extract metadata from the HTML
    const metadata = extractMetadata(html);
    
    // Determine the appropriate title
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
    
    // Get the appropriate description
    const pageDesc = metadata.ogDescription || metadata.description;
    const toolDesc = getToolDescription(url);
    const description = (pageDesc && pageDesc !== "Professional web development, content creation, and SEO services that help your business get found online. Clear strategies and measurable results at transparent pricing.") 
      ? pageDesc 
      : toolDesc;
    
    // Use static URLs for social media bots
    const staticImageUrl = getToolImage(url);
    
    // For social bots, create a specialized minimal HTML document
    if (isSocialBot) {
      console.log("Generating optimized response for social bot");
      
      // Set up response headers
      const responseHeaders = new Headers(response.headers);
      responseHeaders.set('Content-Type', 'text/html; charset=UTF-8');
      responseHeaders.set('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0');
      responseHeaders.set('Pragma', 'no-cache');
      responseHeaders.set('Expires', '0');
      
      const socialBotHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
  
  <!-- Essential meta tags -->
  <meta name="description" content="${description}">
  <link rel="canonical" href="${canonicalUrl}">
  
  <!-- Schema.org for Google -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "${title}",
    "image": "${staticImageUrl}",
    "description": "${description}",
    "applicationCategory": "BusinessApplication",
    "offers": {
      "@type": "Offer",
      "price": "0.00",
      "priceCurrency": "USD"
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
  
  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="${canonicalUrl}">
  <meta property="og:site_name" content="Enri Zhulati">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:image" content="${staticImageUrl}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="${title}">
  
  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:site" content="@enrizhulati">
  <meta name="twitter:creator" content="@enrizhulati">
  <meta name="twitter:url" content="${canonicalUrl}">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image" content="${staticImageUrl}">
  <meta name="twitter:image:alt" content="${title}">
  
  <!-- LinkedIn -->
  <meta property="linkedin:owner" content="Enri Zhulati">
  <meta property="linkedin:title" content="${title}">
  <meta property="linkedin:description" content="${description}">
  <meta property="linkedin:image" content="${staticImageUrl}">
  
  <!-- WhatsApp -->
  <meta property="og:site_name" content="Enri Zhulati">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:image" content="${staticImageUrl}">
</head>
<body>
  <h1>${title}</h1>
  <p>${description}</p>
  <img src="${staticImageUrl}" alt="${title}" />
  <p>Visit <a href="${canonicalUrl}">Enri Zhulati's tools</a> to use this calculator.</p>
</body>
</html>`;

      // Return the specialized version
      return new Response(socialBotHtml, {
        headers: responseHeaders,
      });
    }
    
    // For regular browsers, update the existing HTML
    // This code is similar to before but more streamlined
    const responseHeaders = new Headers(response.headers);
    setNoCacheHeaders(responseHeaders);
    
    // Prepare the meta tags with dynamic timestamps for regular browsers
    const imageUrl = addTimestampToImageUrl(staticImageUrl);
    
    const metaTags = `
      <!-- Essential meta tags -->
      <meta name="description" content="${description}">
      <link rel="canonical" href="${canonicalUrl}">
      
      <!-- Open Graph / Facebook -->
      <meta property="og:type" content="website">
      <meta property="og:url" content="${canonicalUrl}">
      <meta property="og:site_name" content="Enri Zhulati">
      <meta property="og:title" content="${title}">
      <meta property="og:description" content="${description}">
      <meta property="og:image" content="${imageUrl}">
      <meta property="og:image:width" content="1200">
      <meta property="og:image:height" content="630">
      <meta property="og:image:alt" content="${title}">
      
      <!-- Twitter -->
      <meta name="twitter:card" content="summary_large_image">
      <meta name="twitter:site" content="@enrizhulati">
      <meta name="twitter:creator" content="@enrizhulati">
      <meta name="twitter:url" content="${canonicalUrl}">
      <meta name="twitter:title" content="${title}">
      <meta name="twitter:description" content="${description}">
      <meta name="twitter:image" content="${imageUrl}">
      <meta name="twitter:image:alt" content="${title}">
    `;
    
    // Clean the HTML and add the new meta tags
    const updatedHtml = cleanAndAddMetadata(html, metaTags);
    
    // Return the modified HTML
    return new Response(updatedHtml, {
      headers: responseHeaders,
    });
  }
  
  // For the main tools page and all other pages, use a similar approach
  // Get the original response
  const response = await context.next();
  const html = await response.text();
  
  // Extract existing metadata
  const metadata = extractMetadata(html);
  
  // For different page types, we'll follow similar patterns to above
  // This is a simplified version that focuses on the homepage
  const pathname = new URL(url).pathname;
  let title = metadata.ogTitle || metadata.twitterTitle || metadata.title;
  
  // Check if title is using the generic site title
  if (!title || title === "Growth Advisor - Web Development & Digital Strategy") {
    // For homepage
    if (pathname === "/" || pathname === "") {
      title = "Enri Zhulati | SEO & Digital Marketing Consultant";
    } else {
      // Generate a title from the pathname
      const pageName = pathname.split('/').pop() || '';
      const formattedPageName = pageName
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      title = formattedPageName ? `${formattedPageName} | Enri Zhulati` : "Enri Zhulati | SEO & Digital Marketing Consultant";
    }
  }
  
  // Get the description
  let description = metadata.ogDescription || metadata.description;
  
  // If we're on the main tools page, use a specific description
  if (isMainToolsPageUrl(url)) {
    description = "Free marketing ROI calculators and tools to help you grow your business online. Measure the impact of SEO, website speed, and conversion optimization.";
    title = "Free Digital Marketing Tools & Calculators | Enri Zhulati";
  }
  
  // Use static images for social bots
  const staticImageUrl = pathname === "/" || pathname === "" 
    ? "https://enrizhulati.com/images/homepage-preview.jpg"
    : isMainToolsPageUrl(url) 
      ? "https://enrizhulati.com/images/tools-collection-preview.jpg"
      : metadata.ogImage || "https://enrizhulati.com/images/homepage-preview.jpg";
  
  // For social bots, create a specialized HTML document
  if (isSocialBot) {
    console.log("Generating optimized response for social bot");
    
    // Set up response headers
    const responseHeaders = new Headers(response.headers);
    responseHeaders.set('Content-Type', 'text/html; charset=UTF-8');
    responseHeaders.set('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0');
    responseHeaders.set('Pragma', 'no-cache');
    responseHeaders.set('Expires', '0');
    
    // Create specialized HTML for social crawlers
    const schemaType = pathname === "/" || pathname === "" ? "WebSite" : "WebPage";
    
    const socialBotHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
  
  <!-- Essential meta tags -->
  <meta name="description" content="${description}">
  <link rel="canonical" href="${canonicalUrl}">
  
  <!-- Schema.org for Google -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "${schemaType}",
    "name": "${title}",
    "image": "${staticImageUrl}",
    "description": "${description}",
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
  
  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="${canonicalUrl}">
  <meta property="og:site_name" content="Enri Zhulati">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:image" content="${staticImageUrl}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="${title}">
  
  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:site" content="@enrizhulati">
  <meta name="twitter:creator" content="@enrizhulati">
  <meta name="twitter:url" content="${canonicalUrl}">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image" content="${staticImageUrl}">
  <meta name="twitter:image:alt" content="${title}">
  
  <!-- LinkedIn -->
  <meta property="linkedin:owner" content="Enri Zhulati">
  <meta property="linkedin:title" content="${title}">
  <meta property="linkedin:description" content="${description}">
  <meta property="linkedin:image" content="${staticImageUrl}">
  
  <!-- WhatsApp -->
  <meta property="og:site_name" content="Enri Zhulati">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:image" content="${staticImageUrl}">
</head>
<body>
  <h1>${title}</h1>
  <p>${description}</p>
  <img src="${staticImageUrl}" alt="${title}" />
  <p>Visit <a href="${canonicalUrl}">Enri Zhulati's website</a> to learn more.</p>
</body>
</html>`;

    // Return the specialized version
    return new Response(socialBotHtml, {
      headers: responseHeaders,
    });
  }
  
  // For regular browsers, update the existing HTML
  const responseHeaders = new Headers(response.headers);
  setNoCacheHeaders(responseHeaders);
  
  // Use dynamic timestamps for regular browsers
  const imageUrl = addTimestampToImageUrl(staticImageUrl);
  
  // Prepare meta tags
  const metaTags = `
    <!-- Essential meta tags -->
    <meta name="description" content="${description}">
    <link rel="canonical" href="${canonicalUrl}">
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="${canonicalUrl}">
    <meta property="og:site_name" content="Enri Zhulati">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    <meta property="og:image" content="${imageUrl}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:image:alt" content="${title}">
    
    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:site" content="@enrizhulati">
    <meta name="twitter:creator" content="@enrizhulati">
    <meta name="twitter:url" content="${canonicalUrl}">
    <meta name="twitter:title" content="${title}">
    <meta name="twitter:description" content="${description}">
    <meta name="twitter:image" content="${imageUrl}">
    <meta name="twitter:image:alt" content="${title}">
  `;
  
  // Clean the HTML and add the new meta tags
  const updatedHtml = cleanAndAddMetadata(html, metaTags);
  
  // Return the modified HTML
  return new Response(updatedHtml, {
    headers: responseHeaders,
  });
} 