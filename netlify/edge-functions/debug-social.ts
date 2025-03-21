import type { Context } from '@netlify/edge-functions';

/**
 * A debug tool to help test social sharing metadata
 * Access at /debug-social?url=/blog/your-blog-post
 */
export default async function handler(req: Request, context: Context) {
  const url = new URL(req.url);
  const testUrl = url.searchParams.get('url');
  
  if (!testUrl) {
    return new Response(
      `<html>
        <head>
          <title>Social Media Debug Tool</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
            h1 { color: #333; }
            input { padding: 8px; width: 70%; margin-right: 10px; border: 1px solid #ddd; border-radius: 4px; }
            button { padding: 8px 16px; background: #4f46e5; color: white; border: none; border-radius: 4px; cursor: pointer; }
            .form { margin: 20px 0; display: flex; }
          </style>
        </head>
        <body>
          <h1>Social Media Debug Tool</h1>
          <p>Enter a path (e.g., /blog/your-post-slug) to test how it would appear when shared on social media:</p>
          <div class="form">
            <input type="text" id="url" placeholder="/blog/your-post-slug" />
            <button onclick="window.location.href='/debug-social?url='+document.getElementById('url').value">Test</button>
          </div>
        </body>
      </html>`,
      {
        headers: {
          'Content-Type': 'text/html',
        },
      }
    );
  }
  
  // Construct full URL if only path was provided
  const fullUrl = testUrl.startsWith('http') 
    ? testUrl 
    : `https://${url.hostname}${testUrl}`;
  
  // Create headers for each social crawler
  const crawlers = [
    { name: 'Facebook', userAgent: 'facebookexternalhit/1.1' },
    { name: 'Twitter', userAgent: 'Twitterbot/1.0' },
    { name: 'LinkedIn', userAgent: 'LinkedInBot/1.0' },
    { name: 'Generic Browser', userAgent: 'Mozilla/5.0' }
  ];
  
  const results = await Promise.all(
    crawlers.map(async crawler => {
      try {
        const response = await fetch(fullUrl, {
          headers: {
            'User-Agent': crawler.userAgent,
          },
        });
        
        const html = await response.text();
        
        // Extract meta tags
        const titleMatch = html.match(/<title>(.*?)<\/title>/i);
        const title = titleMatch ? titleMatch[1] : 'No title found';
        
        const descMatch = html.match(/<meta\s+name="description"\s+content="(.*?)"/i) || 
                           html.match(/<meta\s+property="og:description"\s+content="(.*?)"/i);
        const description = descMatch ? descMatch[1] : 'No description found';
        
        const ogImageMatch = html.match(/<meta\s+property="og:image"\s+content="(.*?)"/i);
        const ogImage = ogImageMatch ? ogImageMatch[1] : 'No OG image found';
        
        return {
          crawler: crawler.name,
          userAgent: crawler.userAgent,
          title,
          description,
          ogImage
        };
      } catch (error) {
        return {
          crawler: crawler.name,
          userAgent: crawler.userAgent,
          error: (error as Error).message
        };
      }
    })
  );
  
  return new Response(
    `<html>
      <head>
        <title>Social Media Debug Results</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
          h1, h2 { color: #333; }
          .result { margin-bottom: 30px; border: 1px solid #ddd; padding: 15px; border-radius: 8px; }
          .result h2 { margin-top: 0; }
          .field { margin-bottom: 10px; }
          .label { font-weight: bold; display: inline-block; width: 120px; }
          .value { word-break: break-all; }
          .image-preview { max-width: 100%; height: auto; margin-top: 10px; max-height: 200px; }
          .back { display: inline-block; margin-top: 20px; color: #4f46e5; text-decoration: none; }
          .back:hover { text-decoration: underline; }
          pre { background: #f5f5f5; padding: 10px; overflow-x: auto; border-radius: 4px; }
        </style>
      </head>
      <body>
        <h1>Social Media Debug Results</h1>
        <p>Showing how <code>${fullUrl}</code> appears to different crawlers:</p>
        
        ${results.map(result => `
          <div class="result">
            <h2>${result.crawler}</h2>
            <div class="field">
              <span class="label">User Agent:</span>
              <span class="value">${result.userAgent}</span>
            </div>
            ${result.error ? `
              <div class="field">
                <span class="label">Error:</span>
                <span class="value">${result.error}</span>
              </div>
            ` : `
              <div class="field">
                <span class="label">Title:</span>
                <span class="value">${result.title}</span>
              </div>
              <div class="field">
                <span class="label">Description:</span>
                <span class="value">${result.description}</span>
              </div>
              <div class="field">
                <span class="label">OG Image:</span>
                <span class="value">${result.ogImage}</span>
              </div>
              ${result.ogImage && !result.ogImage.startsWith('No') ? `
                <img src="${result.ogImage}" alt="OG Image Preview" class="image-preview" />
              ` : ''}
            `}
          </div>
        `).join('')}
        
        <a href="/debug-social" class="back">← Back to debug tool</a>
      </body>
    </html>`,
    {
      headers: {
        'Content-Type': 'text/html',
      },
    }
  );
} 