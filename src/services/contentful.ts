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
    slug: string;
    featuredImage: {
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
    excerpt: string;
    content: string;
    categories: string[];
    author: {
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
    const response = await getClient().getEntries({
      content_type: 'blogPost',
      order: '-sys.createdAt',
      limit: limit || 100,
    });

    return response.items as unknown as BlogPost[];
  } catch (error) {
    console.error('Error fetching blog posts from Contentful:', error);
    return [];
  }
};

/**
 * Get a single blog post by slug
 */
export const getBlogPostBySlug = async (slug: string): Promise<BlogPost | null> => {
  try {
    const response = await getClient().getEntries({
      content_type: 'blogPost',
      'fields.slug': slug,
      limit: 1,
    });

    if (response.items.length === 0) {
      return null;
    }

    return response.items[0] as unknown as BlogPost;
  } catch (error) {
    console.error(`Error fetching blog post with slug ${slug}:`, error);
    return null;
  }
};

/**
 * Get blog posts by category
 */
export const getBlogPostsByCategory = async (category: string): Promise<BlogPost[]> => {
  try {
    const response = await getClient().getEntries({
      content_type: 'blogPost',
      'fields.categories[in]': category,
      order: '-sys.createdAt',
    });

    return response.items as unknown as BlogPost[];
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