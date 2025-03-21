#!/usr/bin/env node

/**
 * Sitemap Generator for enrizhulati.com
 * 
 * This script generates a comprehensive sitemap.xml file including:
 * - Static pages
 * - Blog posts (automatically fetched from Contentful)
 * - Tool pages
 * 
 * The sitemap follows the sitemap protocol standard and includes
 * lastmod, changefreq, and priority attributes.
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// Base URL of the site
const BASE_URL = 'https://enrizhulati.com';

// Current date in YYYY-MM-DD format
const today = new Date().toISOString().split('T')[0];

// Contentful API details
const CONTENTFUL_SPACE_ID = process.env.VITE_CONTENTFUL_SPACE_ID || 'hdo1k8om3hmw';
const CONTENTFUL_ACCESS_TOKEN = process.env.VITE_CONTENTFUL_ACCESS_TOKEN || 'g29C2epdpHoOQsex08PJXphQYxqVWsN-cUZBbO9QA4A';
const CONTENTFUL_ENVIRONMENT = process.env.VITE_CONTENTFUL_ENVIRONMENT || 'master';

// List of tools - hardcoded for now as this changes less frequently
const TOOLS = [
  'seo-roi-calculator',
  'speed-roi-calculator',
  'conversion-rate-calculator'
];

// Static pages
const STATIC_PAGES = [
  { url: '/', priority: '1.0', changefreq: 'weekly' },
  { url: '/privacy.html', priority: '0.5', changefreq: 'monthly' },
  { url: '/resume.html', priority: '0.7', changefreq: 'monthly' },
  { url: '/blog', priority: '0.9', changefreq: 'daily' },
  { url: '/tools', priority: '0.9', changefreq: 'weekly' },
];

// URLs with hash fragments (sections of the page)
const HASH_FRAGMENTS = [
  { url: '/#services', priority: '0.9', changefreq: 'monthly' },
  { url: '/#process', priority: '0.8', changefreq: 'monthly' },
  { url: '/#about', priority: '0.8', changefreq: 'monthly' },
  { url: '/#contact', priority: '0.9', changefreq: 'monthly' },
];

// Function to fetch blog posts from Contentful
async function fetchBlogPosts() {
  return new Promise((resolve, reject) => {
    console.log('Fetching blog posts from Contentful...');
    
    const url = `https://cdn.contentful.com/spaces/${CONTENTFUL_SPACE_ID}/environments/${CONTENTFUL_ENVIRONMENT}/entries?access_token=${CONTENTFUL_ACCESS_TOKEN}&content_type=blogPost&limit=1000`;
    
    https.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          if (response.items && Array.isArray(response.items)) {
            const blogSlugs = response.items
              .filter(item => item.fields && item.fields.slug)
              .map(item => item.fields.slug);
            
            console.log(`Found ${blogSlugs.length} blog posts in Contentful`);
            resolve(blogSlugs);
          } else {
            console.log('No blog posts found or unexpected response format');
            resolve([]);
          }
        } catch (error) {
          console.error('Error parsing Contentful response:', error);
          // In case of error, fall back to empty array
          resolve([]);
        }
      });
    }).on('error', (error) => {
      console.error('Error fetching from Contentful:', error);
      // In case of error, return an empty array
      resolve([]);
    });
  });
}

// Fallback blog posts in case the Contentful API call fails
const FALLBACK_BLOG_POSTS = [
  'how-to-create-ai-content-that-people-actually-want-to-read',
  'ai-content-people-want-to-read',
  'seo-content-pyramid-for-driving-traffic-and-growth',
  'why-high-quality-content-is-your-most-powerful-seo-weapon',
  'hidden-seo-opportunities-underutilized-tactics-that-drive-massive-traffic',
  'technical-seo-roi-investment-worth',
  'reducing-bounce-rates-intuitive-ux-design',
  'website-speed-optimization-guide',
  'how-to-use-claude-ai-for-small-business',
  'fix-google-ranking-seo-solutions',
  'ai-chatbot-citations-content-strategy',
  'web-design-mistakes-losing-customers',
  'the-psychology-of-search-understanding-user-intent-to-boost-rankings'
];

// Generate XML sitemap
async function generateSitemap() {
  // Fetch blog posts from Contentful
  let blogPosts = [];
  try {
    blogPosts = await fetchBlogPosts();
    
    // If no blog posts were found, use the fallback list
    if (blogPosts.length === 0) {
      console.log('Using fallback blog post list');
      blogPosts = FALLBACK_BLOG_POSTS;
    }
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    console.log('Using fallback blog post list');
    blogPosts = FALLBACK_BLOG_POSTS;
  }
  
  // Start building the sitemap XML
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
`;

  // Add static pages
  STATIC_PAGES.forEach(page => {
    sitemap += `  <url>
    <loc>${BASE_URL}${page.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`;
  });

  // Add hash fragments
  HASH_FRAGMENTS.forEach(fragment => {
    sitemap += `  <url>
    <loc>${BASE_URL}${fragment.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${fragment.changefreq}</changefreq>
    <priority>${fragment.priority}</priority>
  </url>
`;
  });

  // Add blog posts
  blogPosts.forEach(slug => {
    sitemap += `  <url>
    <loc>${BASE_URL}/blog/${slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
`;
  });

  // Add tools
  TOOLS.forEach(tool => {
    sitemap += `  <url>
    <loc>${BASE_URL}/tools/${tool}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
`;
  });

  sitemap += `</urlset>
`;

  return sitemap;
}

// Main function when script is run directly
async function main() {
  try {
    // Generate the sitemap XML
    const sitemap = await generateSitemap();
    
    // Ensure the public directory exists
    const publicDir = path.join(__dirname, '..', 'public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    // Write the sitemap to file
    const sitemapPath = path.join(publicDir, 'sitemap.xml');
    fs.writeFileSync(sitemapPath, sitemap);

    console.log(`Sitemap generated successfully at ${sitemapPath}`);
  } catch (error) {
    console.error('Error generating sitemap:', error);
    process.exit(1);
  }
}

// Run main function if script is called directly
if (require.main === module) {
  main();
}

// Export the generateSitemap function for use in other scripts
module.exports = generateSitemap; 