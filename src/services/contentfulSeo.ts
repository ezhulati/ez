import { getBlogPostBySlug } from './contentful';
import client from './contentful';

/**
 * Get SEO fields for a blog post by slug
 */
export const getPostSeoFields = async (slug: string) => {
  const post = await getBlogPostBySlug(slug);
  
  if (!post) {
    return null;
  }
  
  return {
    // Basic SEO
    title: post.fields.title || '',
    description: post.fields.excerpt || '',
    excerpt: post.fields.excerpt || '',
    keywords: post.fields.categories?.join(', ') || '',
    canonicalUrl: `${window.location.origin}/blog/${post.fields.customUrl || post.fields.slug || ''}`,
    
    // Open Graph
    ogTitle: post.fields.title || '',
    ogDescription: post.fields.excerpt || '',
    ogImage: post.fields.image?.fields?.file?.url 
      ? `https:${post.fields.image.fields.file.url}?fm=webp&w=1200&h=630&fit=fill` 
      : null,
    ogType: 'article',
    
    // Twitter
    twitterCard: 'summary_large_image',
    twitterTitle: post.fields.title || '',
    twitterDescription: post.fields.excerpt || '',
    twitterImage: post.fields.image?.fields?.file?.url 
      ? `https:${post.fields.image.fields.file.url}?fm=webp&w=1200&h=630&fit=fill` 
      : null,
    
    // Schema.org
    schemaType: 'BlogPosting',
    publishDate: post.fields.publishedDate || post.sys.createdAt,
    modifiedDate: post.sys.updatedAt,
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