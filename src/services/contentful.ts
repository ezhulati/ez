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
    excerpt?: string;
    body?: string;
    recommendedPosts?: any[];
    categories?: string[];
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
console.log('Contentful Config:', {
  spaceId: import.meta.env.VITE_CONTENTFUL_SPACE_ID ? 'Set' : 'Not set',
  accessToken: import.meta.env.VITE_CONTENTFUL_ACCESS_TOKEN ? 'Set' : 'Not set',
  previewToken: import.meta.env.VITE_CONTENTFUL_PREVIEW_TOKEN ? 'Set' : 'Not set',
  environment: import.meta.env.VITE_CONTENTFUL_ENVIRONMENT || 'master',
});

// Create a standard delivery client
const client = createClient({
  space: import.meta.env.VITE_CONTENTFUL_SPACE_ID as string,
  accessToken: import.meta.env.VITE_CONTENTFUL_ACCESS_TOKEN as string,
  environment: import.meta.env.VITE_CONTENTFUL_ENVIRONMENT as string || 'master',
});

// Create a preview client
const previewClient = createClient({
  space: import.meta.env.VITE_CONTENTFUL_SPACE_ID as string,
  accessToken: import.meta.env.VITE_CONTENTFUL_PREVIEW_TOKEN as string,
  environment: import.meta.env.VITE_CONTENTFUL_ENVIRONMENT as string || 'master',
  host: 'preview.contentful.com'
});

// Helper to determine if we should use preview mode
const usePreviewMode = (): boolean => {
  // Check for preview mode in query params or localStorage
  const isPreview = localStorage.getItem('contentful-preview-mode') === 'true';
  console.log('Preview mode:', isPreview);
  return isPreview;
};

// Select the appropriate client based on preview mode
const getClient = () => {
  return usePreviewMode() ? previewClient : client;
};

/**
 * Get all blog posts with optional limit
 */
export const getBlogPosts = async (limit?: number): Promise<BlogPost[]> => {
  try {
    // First try with blogPage content type
    try {
      const response = await getClient().getEntries({
        content_type: 'blogPage',
        order: '-sys.createdAt',
        limit: limit || 100,
      });
      console.log('Blog posts found (blogPage):', response.items.length);
      return response.items as unknown as BlogPost[];
    } catch (error) {
      console.error('Error with blogPage type, trying blogPost:', error);
      // If that fails, try with blogPost content type
      const response = await getClient().getEntries({
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
      const contentTypes = await getClient().getContentTypes();
      console.log('Available content types:', contentTypes.items.map(item => item.sys.id));
    } catch (e) {
      console.error('Failed to fetch content types:', e);
    }
    return [];
  }
};

/**
 * Get a single blog post by slug
 */
export const getBlogPostBySlug = async (slug: string): Promise<BlogPost | null> => {
  try {
    // First try with blogPage
    try {
      const response = await getClient().getEntries({
        content_type: 'blogPage',
        'fields.slug': slug,
        limit: 1,
      });
      
      if (response.items.length > 0) {
        console.log('Blog post found (blogPage):', response.items[0].sys.id);
        return response.items[0] as unknown as BlogPost;
      }
      
      throw new Error('Not found with blogPage type');
    } catch (error) {
      console.log('Trying with blogPost type');
      // If that fails, try with blogPost
      const response = await getClient().getEntries({
        content_type: 'blogPost',
        'fields.slug': slug,
        limit: 1,
      });
      
      if (response.items.length === 0) {
        console.log('Blog post not found with either type');
        return null;
      }
      
      console.log('Blog post found (blogPost):', response.items[0].sys.id);
      return response.items[0] as unknown as BlogPost;
    }
  } catch (error) {
    console.error(`Error fetching blog post with slug ${slug}:`, error);
    return null;
  }
};

/**
 * Get a single blog post by ID
 */
export const getBlogPostById = async (id: string): Promise<BlogPost | null> => {
  try {
    // Try to get the entry directly by ID (works for both content types)
    const response = await getClient().getEntry(id);
    
    if (response) {
      console.log(`Blog post found with ID ${id}`);
      return response as unknown as BlogPost;
    }
    
    return null;
  } catch (error) {
    console.error(`Error fetching blog post with ID ${id}:`, error);
    return null;
  }
};

/**
 * Get blog posts by category
 */
export const getBlogPostsByCategory = async (category: string): Promise<BlogPost[]> => {
  try {
    // Try both content types
    let posts: BlogPost[] = [];
    
    try {
      const response = await getClient().getEntries({
        content_type: 'blogPage',
        'fields.categories[in]': category,
        order: '-sys.createdAt',
      });
      posts = [...posts, ...(response.items as unknown as BlogPost[])];
    } catch (e) {
      console.log('Error with blogPage type for category:', e);
    }
    
    try {
      const response = await getClient().getEntries({
        content_type: 'blogPost',
        'fields.categories[in]': category,
        order: '-sys.createdAt',
      });
      posts = [...posts, ...(response.items as unknown as BlogPost[])];
    } catch (e) {
      console.log('Error with blogPost type for category:', e);
    }
    
    return posts;
  } catch (error) {
    console.error(`Error fetching blog posts with category ${category}:`, error);
    return [];
  }
};

/**
 * Toggle preview mode
 */
export const togglePreviewMode = (): boolean => {
  const currentMode = localStorage.getItem('contentful-preview-mode') === 'true';
  const newMode = !currentMode;
  localStorage.setItem('contentful-preview-mode', newMode.toString());
  return newMode;
};

/**
 * Check if preview mode is active
 */
export const isPreviewModeActive = (): boolean => {
  return localStorage.getItem('contentful-preview-mode') === 'true';
};

export default client;