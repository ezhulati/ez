import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createClient } from 'contentful';
import './env.js';  // Import environment variables first

// Setup correct __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../dist')));

// Read the HTML file once at startup
let indexHTML = fs.readFileSync(path.join(__dirname, '../dist/index.html'), 'utf8');

// Initialize Contentful client
const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID || process.env.VITE_CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN || process.env.VITE_CONTENTFUL_ACCESS_TOKEN,
  environment: process.env.CONTENTFUL_ENVIRONMENT || process.env.VITE_CONTENTFUL_ENVIRONMENT || 'master'
});

// Helper to safely clean strings for HTML
const escapeHTML = (str) => {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

// Get blog post by custom URL or slug
async function getBlogPost(identifier) {
  try {
    // Try by custom URL first
    let response = await client.getEntries({
      content_type: 'blogPage',
      'fields.customUrl': identifier,
      limit: 1,
    });
    
    if (response.items.length > 0) {
      console.log(`Found blog post by custom URL: ${identifier}`);
      return response.items[0];
    }
    
    // Then try by slug
    response = await client.getEntries({
      content_type: 'blogPage',
      'fields.slug': identifier,
      limit: 1,
    });
    
    if (response.items.length > 0) {
      console.log(`Found blog post by slug: ${identifier}`);
      return response.items[0];
    }
    
    // Finally, try by ID
    try {
      const entry = await client.getEntry(identifier);
      if (entry) {
        console.log(`Found blog post by ID: ${identifier}`);
        return entry;
      }
    } catch (err) {
      console.log(`Not a valid entry ID: ${identifier}`);
    }
    
    console.log(`Blog post not found: ${identifier}`);
    return null;
  } catch (error) {
    console.error(`Error fetching blog post: ${error.message}`);
    return null;
  }
}

// For SEO-friendly blog posts with dynamic meta tags
app.get('/blog/:slug', async (req, res) => {
  const slug = req.params.slug;
  
  try {
    // Fetch the post from Contentful
    const contentfulPost = await getBlogPost(slug);
    
    if (!contentfulPost) {
      // If post doesn't exist, serve regular index.html
      console.log(`Post not found for slug: ${slug}, serving default page`);
      return res.sendFile(path.join(__dirname, '../dist/index.html'));
    }
    
    const fields = contentfulPost.fields;
    console.log(`Processing metadata for blog post: ${fields.title}`);
    
    // Prepare metadata from Contentful
    const postData = {
      title: fields.title || '',
      metaTitle: fields.metaTitle || fields.title || '',
      metaDescription: fields.metaDescription || fields.excerpt || '',
      ogTitle: fields.ogTitle || fields.metaTitle || fields.title || '',
      ogDescription: fields.ogDescription || fields.metaDescription || fields.excerpt || '',
      ogImage: fields.featuredImage?.fields?.file?.url 
        ? `https:${fields.featuredImage.fields.file.url}?fm=webp&w=1200&h=630&fit=fill` 
        : fields.image?.fields?.file?.url 
          ? `https:${fields.image.fields.file.url}?fm=webp&w=1200&h=630&fit=fill` 
          : '',
      ogImageAlt: fields.featuredImage?.fields?.title || fields.image?.fields?.title || fields.title || '',
      twitterCard: fields.twitterCardType || 'summary_large_image',
      publishedDate: fields.articlePublishDate || fields.publishedDate || contentfulPost.sys.createdAt || '',
      modifiedDate: fields.articleModifiedDate || contentfulPost.sys.updatedAt || '',
      author: fields.author?.fields?.name || 'Enri Zhulati',
      keywords: fields.seoKeywords?.join(', ') || fields.categories?.join(', ') || '',
    };
    
    console.log('Meta data prepared for:', postData.title);
    console.log('Image URL:', postData.ogImage);
    
    // Replace meta tag placeholders with actual content
    let html = indexHTML
      .replace('__META_TITLE__', escapeHTML(postData.metaTitle))
      .replace('__META_DESCRIPTION__', escapeHTML(postData.metaDescription))
      .replace('__META_OG_TITLE__', escapeHTML(postData.ogTitle))
      .replace('__META_OG_DESCRIPTION__', escapeHTML(postData.ogDescription))
      .replace('__META_OG_TYPE__', 'article')
      .replace('__META_OG_IMAGE__', postData.ogImage)
      .replace('__META_OG_IMAGE_ALT__', escapeHTML(postData.ogImageAlt))
      .replace('__META_OG_URL__', `https://enrizhulati.com/blog/${slug}`)
      .replace('__META_ARTICLE_PUBLISHED_TIME__', postData.publishedDate)
      .replace('__META_ARTICLE_MODIFIED_TIME__', postData.modifiedDate)
      .replace('__META_ARTICLE_AUTHOR__', escapeHTML(postData.author))
      .replace('__META_ARTICLE_TAGS__', escapeHTML(postData.keywords))
      .replace('__META_TWITTER_CARD__', postData.twitterCard)
      .replace('__META_TWITTER_TITLE__', escapeHTML(postData.ogTitle))
      .replace('__META_TWITTER_DESCRIPTION__', escapeHTML(postData.ogDescription))
      .replace('__META_TWITTER_IMAGE__', postData.ogImage)
      .replace('__META_TWITTER_IMAGE_ALT__', escapeHTML(postData.ogImageAlt));
    
    res.send(html);
  } catch (error) {
    console.error(`Error processing blog post ${slug}:`, error);
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  }
});

// For all other routes, serve index.html with default meta tags
app.get('*', (req, res) => {
  // For non-blog pages, use default meta tags
  let html = indexHTML
    .replace('__META_TITLE__', 'Growth Advisor - Web Development & Digital Strategy')
    .replace('__META_DESCRIPTION__', 'Professional web development, content creation, and SEO services that help your business get found online.')
    .replace('__META_OG_TITLE__', 'Growth Advisor - Web Development & Digital Strategy')
    .replace('__META_OG_DESCRIPTION__', 'Professional web development, content creation, and SEO services that help your business get found online.')
    .replace('__META_OG_TYPE__', 'website')
    .replace('__META_OG_IMAGE__', 'https://i.postimg.cc/1zv4LQjv/Screenshot-2025-03-09-at-11-05-05-AM.png')
    .replace('__META_OG_IMAGE_ALT__', 'Digital marketing dashboard visualization')
    .replace('__META_OG_URL__', 'https://enrizhulati.com')
    .replace('__META_ARTICLE_PUBLISHED_TIME__', '')
    .replace('__META_ARTICLE_MODIFIED_TIME__', '')
    .replace('__META_ARTICLE_AUTHOR__', 'Enri Zhulati')
    .replace('__META_ARTICLE_TAGS__', '')
    .replace('__META_TWITTER_CARD__', 'summary_large_image')
    .replace('__META_TWITTER_TITLE__', 'Growth Advisor - Web Development & Digital Strategy')
    .replace('__META_TWITTER_DESCRIPTION__', 'Professional web development, content creation, and SEO services that help your business get found online.')
    .replace('__META_TWITTER_IMAGE__', 'https://i.postimg.cc/1zv4LQjv/Screenshot-2025-03-09-at-11-05-05-AM.png')
    .replace('__META_TWITTER_IMAGE_ALT__', 'Digital marketing dashboard visualization');
  
  res.send(html);
});

// Start server with environment variables
console.log('Starting server with Contentful configuration:');
console.log('- Space ID:', process.env.CONTENTFUL_SPACE_ID || process.env.VITE_CONTENTFUL_SPACE_ID ? 'Set' : 'Missing');
console.log('- Access Token:', process.env.CONTENTFUL_ACCESS_TOKEN || process.env.VITE_CONTENTFUL_ACCESS_TOKEN ? 'Set' : 'Missing');
console.log('- Environment:', process.env.CONTENTFUL_ENVIRONMENT || process.env.VITE_CONTENTFUL_ENVIRONMENT || 'master');

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 