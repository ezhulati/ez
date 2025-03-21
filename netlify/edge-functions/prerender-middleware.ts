import type { Context } from '@netlify/edge-functions';

// Comprehensive bot detection regex
const botUserAgents = /bot|googlebot|bingbot|yandex|baiduspider|twitterbot|facebookexternalhit|linkedinbot|snapchat|pinterest|vkshare|w3c_validator|whatsapp|telegrambot|slackbot|discordbot|applebot|embedly|ia_archiver|prerender|headlesschrome|lighthouse|bytespider|msie|bingpreview|twitterbot|googlebot-image|discord|curl|wget/i;

export default async function handler(req: Request, context: Context) {
  // Get the user agent
  const userAgent = req.headers.get('User-Agent') || '';
  
  // Get the URL and path
  const url = new URL(req.url);
  const path = url.pathname;
  
  // Special handling for sitemap.xml to ensure it's delivered quickly
  if (path === '/sitemap.xml') {
    console.log('Sitemap.xml request detected, serving directly');
    try {
      // Get the sitemap directly from the site
      const sitemapUrl = 'https://enrizhulati.com/sitemap.xml';
      const sitemapResponse = await fetch(sitemapUrl, {
        headers: {
          'User-Agent': 'Netlify Edge Function',
          'Accept': 'application/xml',
          'Cache-Control': 'max-age=3600'
        }
      });
      
      if (!sitemapResponse.ok) {
        console.error(`Failed to fetch sitemap: ${sitemapResponse.status}`);
        return context.next();
      }
      
      // Return the sitemap with appropriate headers
      const headers = new Headers();
      headers.set('Content-Type', 'application/xml');
      headers.set('Cache-Control', 'public, max-age=3600');
      headers.set('X-Content-Type-Options', 'nosniff');
      
      return new Response(await sitemapResponse.text(), {
        status: 200,
        headers: headers
      });
    } catch (error) {
      console.error(`Error serving sitemap: ${error}`);
      // Fall back to the normal file serving
      return context.next();
    }
  }
  
  // Check if this is a bot request
  const isBot = botUserAgents.test(userAgent);
  
  // Check for escaped fragment parameter
  const hasEscapedFragment = url.searchParams.has('_escaped_fragment_');
  
  // Check if this is prerender.io itself making the request
  const isPrerenderRecursive = userAgent.includes('prerender');
  
  // Log the bot detection
  console.log(`Request URL: ${req.url}`);
  console.log(`User Agent: ${userAgent}`);
  console.log(`Is bot: ${isBot}`);
  console.log(`Has escaped fragment: ${hasEscapedFragment}`);
  console.log(`Is prerender recursive: ${isPrerenderRecursive}`);
  
  // Skip prerendering if this is prerender.io itself to avoid recursion
  if (isPrerenderRecursive) {
    console.log("Prerender recursive request detected, passing through");
    return context.next();
  }
  
  // If this is a bot, forward to prerender.io
  if ((isBot || hasEscapedFragment) && !isPrerenderRecursive) {
    // For bots, forward the request to prerender.io
    console.log("Bot detected, forwarding to prerender.io");
    
    // Make sure the URL is properly formed for prerender.io
    // Use the canonical URL to avoid URL encoding issues
    const canonicalUrl = `https://enrizhulati.com${url.pathname}${url.search}`;
    
    // Build the prerender URL with a timeout parameter to avoid excessive render times
    const prerenderUrl = `https://service.prerender.io/${canonicalUrl}`;
    console.log("Prerender URL:", prerenderUrl);
    
    // Add the Prerender token and extra headers to the request
    const headers = new Headers();
    headers.set('X-Prerender-Token', 'DXHxiXW4lVGsLvOASJvj');
    
    // Important headers that should be forwarded
    const forwardHeaders = ['user-agent', 'accept-language', 'accept-encoding', 'accept'];
    forwardHeaders.forEach(name => {
      const value = req.headers.get(name);
      if (value) headers.set(name, value);
    });
    
    // Optimize for fastest possible render
    headers.set('X-Prerender-Rendertype', 'html');
    headers.set('X-Prerender-Version', '3');
    
    // Fetch from prerender.io with a timeout
    try {
      const controller = new AbortController();
      // Set a timeout of 8 seconds to avoid long waiting times
      const timeoutId = setTimeout(() => controller.abort(), 8000);
      
      const prerenderResponse = await fetch(prerenderUrl, {
        headers: headers,
        method: req.method,
        redirect: 'follow',
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!prerenderResponse.ok) {
        console.error(`Prerender service returned status: ${prerenderResponse.status}`);
        return context.next();
      }
      
      // Create a new response with prerendered content
      const responseHeaders = new Headers(prerenderResponse.headers);
      responseHeaders.set('X-Prerendered', 'true');
      responseHeaders.set('X-Prerender-Status', prerenderResponse.status.toString());
      
      return new Response(await prerenderResponse.text(), {
        status: prerenderResponse.status,
        headers: responseHeaders
      });
    } catch (error) {
      console.error("Prerender fetch error:", error);
      // Fall back to normal rendering
      return context.next();
    }
  }
  
  // For normal users, continue to regular rendering
  return context.next();
} 