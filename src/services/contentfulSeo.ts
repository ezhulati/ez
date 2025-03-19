import { getBlogPostBySlug, getBlogPostByCustomUrl, getBlogPostById } from './contentful';
import client from './contentful';

/**
 * Get SEO fields for a blog post by slug, custom URL, or ID
 */
export const getPostSeoFields = async (identifier: string) => {
  // Try in this order: slug, custom URL, ID
  let post = await getBlogPostBySlug(identifier);
  
  // If not found, try by custom URL
  if (!post) {
    post = await getBlogPostByCustomUrl(identifier);
  }
  
  // If still not found, try by ID
  if (!post) {
    post = await getBlogPostById(identifier);
  }
  
  if (!post) {
    return null;
  }
  
  return {
    // Basic SEO
    title: post.fields.metaTitle || post.fields.title || '',
    description: post.fields.metaDescription || post.fields.excerpt || '',
    excerpt: post.fields.excerpt || '',
    keywords: post.fields.seoKeywords?.join(', ') || post.fields.categories?.join(', ') || '',
    canonicalUrl: post.fields.canonicalUrl || `${window.location.origin}/blog/${post.fields.customUrl || post.fields.slug || post.sys.id || ''}`,
    
    // Open Graph
    ogTitle: post.fields.ogTitle || post.fields.metaTitle || post.fields.title || '',
    ogDescription: post.fields.ogDescription || post.fields.metaDescription || post.fields.excerpt || '',
    ogImage: post.fields.featuredImage?.fields?.file?.url 
      ? `https:${post.fields.featuredImage.fields.file.url}?fm=webp&w=1200&h=630&fit=fill` 
      : post.fields.image?.fields?.file?.url 
        ? `https:${post.fields.image.fields.file.url}?fm=webp&w=1200&h=630&fit=fill` 
        : null,
    ogType: 'article',
    
    // Twitter
    twitterCard: post.fields.twitterCardType || 'summary_large_image',
    twitterTitle: post.fields.ogTitle || post.fields.metaTitle || post.fields.title || '',
    twitterDescription: post.fields.ogDescription || post.fields.metaDescription || post.fields.excerpt || '',
    twitterImage: post.fields.featuredImage?.fields?.file?.url 
      ? `https:${post.fields.featuredImage.fields.file.url}?fm=webp&w=1200&h=630&fit=fill` 
      : post.fields.image?.fields?.file?.url 
        ? `https:${post.fields.image.fields.file.url}?fm=webp&w=1200&h=630&fit=fill` 
        : null,
    
    // Schema.org
    schemaType: post.fields.schemaType || 'BlogPosting',
    publishDate: post.fields.articlePublishDate || post.fields.publishedDate || post.sys.createdAt,
    modifiedDate: post.fields.articleModifiedDate || post.sys.updatedAt,
    authorName: post.fields.author?.fields?.name || (post.sys.id === '4teKNzPkzDPysbkdacG8D0' ? 'Enri Zhulati' : 'Unknown Author'),
  };
};

/**
 * Generate Schema.org JSON-LD for a blog post
 */
export const generateSchemaMarkup = (seoData: any) => {
  if (!seoData) return null;
  
  return {
    '@context': 'https://schema.org',
    '@type': seoData.schemaType,
    headline: seoData.title,
    description: seoData.description,
    image: seoData.ogImage,
    datePublished: seoData.publishDate,
    dateModified: seoData.modifiedDate,
    author: {
      '@type': 'Person',
      name: seoData.authorName
    }
  };
}; 