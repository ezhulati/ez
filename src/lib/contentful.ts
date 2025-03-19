import { createClient } from 'contentful';

// Types for blog content
export type BlogPost = {
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
    introHook?: string;
    image?: {
      fields: {
        file: {
          url: string;
          details: {
            image: {
              width: number;
              height: number;
            };
          };
        };
        title: string;
      };
    };
    featuredImage?: {
      fields: {
        file: {
          url: string;
          details: {
            image: {
              width: number;
              height: number;
            };
          };
        };
        title: string;
      };
    };
    excerpt?: string;
    body?: string;
    recommendedPosts?: any[];
    categories?: string[];
    seoKeywords?: string[];
    ogTitle?: string;
    ogDescription?: string;
    twitterCardType?: string;
    canonicalUrl?: string;
    articlePublishDate?: string;
    articleModifiedDate?: string;
    schemaType?: string;
    author?: {
      fields: {
        name: string;
        avatar?: {
          fields: {
            file: {
              url: string;
            };
          };
        };
      };
    };
    publishedDate?: string;
  };
};

// Log environment variables without exposing sensitive data
if (process.env.NODE_ENV !== 'production') {
  console.log('Contentful Config:', {
    spaceId: process.env.CONTENTFUL_SPACE_ID ? 'Set' : 'Not set',
    accessToken: process.env.CONTENTFUL_ACCESS_TOKEN ? 'Set' : 'Not set',
    previewToken: process.env.CONTENTFUL_PREVIEW_TOKEN ? 'Set' : 'Not set',
    environment: process.env.CONTENTFUL_ENVIRONMENT || 'master',
  });
}

// Create a standard delivery client
const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID as string,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN as string,
  environment: process.env.CONTENTFUL_ENVIRONMENT as string || 'master',
});

// Create a preview client
const previewClient = createClient({
  space: process.env.CONTENTFUL_SPACE_ID as string,
  accessToken: process.env.CONTENTFUL_PREVIEW_TOKEN as string,
  environment: process.env.CONTENTFUL_ENVIRONMENT as string || 'master',
  host: 'preview.contentful.com'
});

// Helper to determine if we should use preview mode
const usePreviewMode = (preview: boolean = false): boolean => {
  return preview;
};

// Select the appropriate client based on preview mode
const getClient = (preview: boolean = false) => {
  return usePreviewMode(preview) ? previewClient : client;
};

/**
 * Get all blog posts with optional limit
 */
export const getBlogPosts = async (limit?: number, preview: boolean = false): Promise<BlogPost[]> => {
  try {
    // First try with blogPage content type
    try {
      const response = await getClient(preview).getEntries({
        content_type: 'blogPage',
        order: '-sys.createdAt',
        limit: limit || 100,
      });
      console.log('Blog posts found (blogPage):', response.items.length);
      return response.items as unknown as BlogPost[];
    } catch (error) {
      console.error('Error with blogPage type, trying blogPost:', error);
      // If that fails, try with blogPost content type
      const response = await getClient(preview).getEntries({
        content_type: 'blogPost',
        order: '-sys.createdAt',
        limit: limit || 100,
      });
      console.log('Blog posts found (blogPost):', response.items.length);
      return response.items as unknown as BlogPost[];
    }
  } catch (error) {
    console.error('Error fetching blog posts from Contentful:', error);
    // Log all available content types to help debugging
    try {
      const contentTypes = await getClient(preview).getContentTypes();
      console.log('Available content types:', contentTypes.items.map(item => item.sys.id));
    } catch (e) {
      console.error('Failed to fetch content types:', e);
    }
    return [];
  }
};

/**
 * Get a single blog post by custom URL
 */
export const getBlogPostByCustomUrl = async (customUrl: string, preview: boolean = false): Promise<BlogPost | null> => {
  try {
    // Try with blogPage first
    try {
      const response = await getClient(preview).getEntries({
        content_type: 'blogPage',
        'fields.customUrl': customUrl,
        limit: 1,
      });
      
      if (response.items.length > 0) {
        console.log(`Blog post found by custom URL (blogPage): ${customUrl}`);
        return response.items[0] as unknown as BlogPost;
      }
      
      throw new Error('Not found with blogPage type');
    } catch (error) {
      // If that fails, try with blogPost
      const response = await getClient(preview).getEntries({
        content_type: 'blogPost',
        'fields.customUrl': customUrl,
        limit: 1,
      });
      
      if (response.items.length === 0) {
        console.log(`Blog post not found with custom URL: ${customUrl}`);
        return null;
      }
      
      console.log(`Blog post found by custom URL (blogPost): ${customUrl}`);
      return response.items[0] as unknown as BlogPost;
    }
  } catch (error) {
    console.error(`Error fetching blog post with custom URL ${customUrl}:`, error);
    return null;
  }
};

/**
 * Get a single blog post by slug or custom URL
 */
export const getBlogPost = async (identifier: string, preview: boolean = false): Promise<BlogPost | null> => {
  // First try by custom URL
  const post = await getBlogPostByCustomUrl(identifier, preview);
  if (post) return post;
  
  // Then try by slug
  try {
    const response = await getClient(preview).getEntries({
      content_type: 'blogPage',
      'fields.slug': identifier,
      limit: 1,
    });
    
    if (response.items.length > 0) {
      return response.items[0] as unknown as BlogPost;
    }
    
    return null;
  } catch (error) {
    console.error(`Error fetching blog post with slug ${identifier}:`, error);
    return null;
  }
}; 