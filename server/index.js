const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../dist')));

// Read the HTML file once at startup
let indexHTML = fs.readFileSync(path.join(__dirname, '../dist/index.html'), 'utf8');

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

// Simulated blog post data - in production you would fetch this from your API
const posts = {
  'my-first-blog': {
    title: 'My First Blog Post',
    metaTitle: 'My First Blog Post | Enri Zhulati',
    metaDescription: 'Learn about web development and digital marketing in this introductory post.',
    ogTitle: 'My First Blog Post - Discover Web Dev Tips',
    ogDescription: 'A comprehensive guide to getting started with web development and SEO.',
    ogImage: 'https://i.postimg.cc/1zv4LQjv/Screenshot-2025-03-09-at-11-05-05-AM.png',
    ogImageAlt: 'Web development illustration',
    twitterCard: 'summary_large_image',
    publishedDate: '2025-03-15T09:00:00Z',
    modifiedDate: '2025-03-16T10:00:00Z',
    author: 'Enri Zhulati',
    tags: 'web development, SEO, digital marketing'
  },
  'second-post': {
    title: 'SEO Best Practices',
    metaTitle: 'SEO Best Practices for 2025 | Enri Zhulati',
    metaDescription: 'Discover the latest SEO strategies to improve your website ranking.',
    ogTitle: 'SEO Best Practices for 2025',
    ogDescription: 'Comprehensive guide to improving your website\'s search engine ranking in 2025.',
    ogImage: 'https://i.postimg.cc/1zv4LQjv/Screenshot-2025-03-09-at-11-05-05-AM.png',
    ogImageAlt: 'SEO performance chart',
    twitterCard: 'summary_large_image',
    publishedDate: '2025-03-18T09:00:00Z',
    modifiedDate: '2025-03-18T09:00:00Z',
    author: 'Enri Zhulati',
    tags: 'SEO, marketing, strategy'
  }
};

// For SEO-friendly blog posts with dynamic meta tags
app.get('/blog/:slug', (req, res) => {
  const slug = req.params.slug;
  const post = posts[slug];
  
  if (!post) {
    // If post doesn't exist, serve regular index.html
    return res.sendFile(path.join(__dirname, '../dist/index.html'));
  }
  
  // Replace meta tag placeholders with actual content
  let html = indexHTML
    .replace('__META_TITLE__', escapeHTML(post.metaTitle || 'Enri Zhulati'))
    .replace('__META_DESCRIPTION__', escapeHTML(post.metaDescription || ''))
    .replace('__META_OG_TITLE__', escapeHTML(post.ogTitle || post.metaTitle || post.title))
    .replace('__META_OG_DESCRIPTION__', escapeHTML(post.ogDescription || post.metaDescription))
    .replace('__META_OG_TYPE__', 'article')
    .replace('__META_OG_IMAGE__', post.ogImage || '')
    .replace('__META_OG_IMAGE_ALT__', escapeHTML(post.ogImageAlt || post.title))
    .replace('__META_OG_URL__', `https://enrizhulati.com/blog/${slug}`)
    .replace('__META_ARTICLE_PUBLISHED_TIME__', post.publishedDate || '')
    .replace('__META_ARTICLE_MODIFIED_TIME__', post.modifiedDate || '')
    .replace('__META_ARTICLE_AUTHOR__', escapeHTML(post.author || 'Enri Zhulati'))
    .replace('__META_ARTICLE_TAGS__', escapeHTML(post.tags || ''))
    .replace('__META_TWITTER_CARD__', post.twitterCard || 'summary_large_image')
    .replace('__META_TWITTER_TITLE__', escapeHTML(post.ogTitle || post.metaTitle || post.title))
    .replace('__META_TWITTER_DESCRIPTION__', escapeHTML(post.ogDescription || post.metaDescription))
    .replace('__META_TWITTER_IMAGE__', post.ogImage || '')
    .replace('__META_TWITTER_IMAGE_ALT__', escapeHTML(post.ogImageAlt || post.title));
  
  res.send(html);
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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 