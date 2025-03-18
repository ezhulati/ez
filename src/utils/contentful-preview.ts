import { useEffect } from 'react';
import { togglePreviewMode, isPreviewModeActive } from '../services/contentful';

/**
 * Enable preview mode from URL query parameter
 * Useful for creating preview links from Contentful
 * Example: https://example.com/blog/my-post?preview=true
 */
export const useContentfulPreview = () => {
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const previewParam = queryParams.get('preview');
    
    if (previewParam === 'true' && !isPreviewModeActive()) {
      togglePreviewMode();
      // Remove the preview parameter from the URL
      queryParams.delete('preview');
      const newUrl = window.location.pathname + (queryParams.toString() ? `?${queryParams.toString()}` : '');
      window.history.replaceState({}, '', newUrl);
      
      // Reload to apply preview mode
      window.location.reload();
    }
  }, []);
};

/**
 * Generate a preview link for a specific slug
 */
export const getContentfulPreviewLink = (slug: string): string => {
  return `${window.location.origin}/blog/${slug}?preview=true`;
};

/**
 * Shortcode for creating a preview button in Contentful UI
 * This can be added to the Contentful UI extension
 */
export const contentfulPreviewButtonSnippet = `
// Add this to your Contentful UI Extension
function createPreviewButton(entry) {
  const slug = entry.fields.slug?.['en-US'];
  if (!slug) return;
  
  const previewUrl = \`https://your-site.com/blog/\${slug}?preview=true\`;
  
  return {
    label: 'Open Preview',
    buttonType: 'positive',
    onClick: () => {
      window.open(previewUrl, '_blank');
    }
  };
}
`;

export default {
  useContentfulPreview,
  getContentfulPreviewLink,
  contentfulPreviewButtonSnippet
};