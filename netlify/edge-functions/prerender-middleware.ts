import type { Context } from '@netlify/edge-functions';

// Comprehensive bot detection regex
const botUserAgents = /bot|googlebot|bingbot|yandex|baiduspider|twitterbot|facebookexternalhit|linkedinbot|snapchat|pinterest|vkshare|w3c_validator|whatsapp|telegrambot|slackbot|discordbot|applebot|embedly|ia_archiver|prerender|headlesschrome|lighthouse|bytespider|msie|bingpreview|twitterbot|googlebot-image|discord|curl|wget/i;

export default async function handler(req: Request, context: Context) {
  // Get the user agent
  const userAgent = req.headers.get('User-Agent') || '';
  
  // Check if this is a bot request
  const isBot = botUserAgents.test(userAgent);
  
  // Check for escaped fragment parameter
  const url = new URL(req.url);
  const hasEscapedFragment = url.searchParams.has('_escaped_fragment_');
  
  // Log the bot detection
  console.log(`Request URL: ${req.url}`);
  console.log(`User Agent: ${userAgent}`);
  console.log(`Is bot: ${isBot}`);
  console.log(`Has escaped fragment: ${hasEscapedFragment}`);
  
  // If this is a bot, set a response header that our edge function can use
  if (isBot || hasEscapedFragment) {
    // For bots, forward the request to prerender.io
    console.log("Bot detected, forwarding to prerender.io");
    
    // Build the prerender URL
    const prerenderUrl = `https://service.prerender.io/${url.toString()}`;
    
    // Add the Prerender token to the request
    const headers = new Headers(req.headers);
    headers.set('X-Prerender-Token', 'DXHxiXW4lVGsLvOASJvj');
    
    // Fetch from prerender.io
    try {
      const prerenderResponse = await fetch(prerenderUrl, {
        headers: headers,
        method: req.method,
        redirect: 'follow',
      });
      
      // Create a new response with prerendered content
      const responseHeaders = new Headers(prerenderResponse.headers);
      responseHeaders.set('X-Prerendered', 'true');
      
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