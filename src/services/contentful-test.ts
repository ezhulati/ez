import { createClient } from 'contentful';

// Function to test Contentful connection
export const testContentfulConnection = async () => {
  // Log environment variables with more details for debugging
  console.log('Contentful Config Details:', {
    spaceId: import.meta.env.VITE_CONTENTFUL_SPACE_ID || '[NOT FOUND]',
    accessToken: import.meta.env.VITE_CONTENTFUL_ACCESS_TOKEN 
      ? `${import.meta.env.VITE_CONTENTFUL_ACCESS_TOKEN.substring(0, 5)}...` 
      : '[NOT FOUND]',
    previewToken: import.meta.env.VITE_CONTENTFUL_PREVIEW_TOKEN 
      ? `${import.meta.env.VITE_CONTENTFUL_PREVIEW_TOKEN.substring(0, 5)}...` 
      : '[NOT FOUND]',
    environment: import.meta.env.VITE_CONTENTFUL_ENVIRONMENT || 'master',
  });
  
  // Only attempt to create client if credentials exist
  if (!import.meta.env.VITE_CONTENTFUL_SPACE_ID || !import.meta.env.VITE_CONTENTFUL_ACCESS_TOKEN) {
    console.error('Contentful credentials missing! Check .env file and environment variables.');
    return {
      success: false,
      error: 'Missing credentials'
    };
  }
  
  try {
    // Create a test client
    const client = createClient({
      space: import.meta.env.VITE_CONTENTFUL_SPACE_ID as string,
      accessToken: import.meta.env.VITE_CONTENTFUL_ACCESS_TOKEN as string,
      environment: import.meta.env.VITE_CONTENTFUL_ENVIRONMENT as string || 'master',
    });
    
    // Try to get content types
    const contentTypes = await client.getContentTypes();
    console.log('Available content types:', contentTypes.items.map(item => item.sys.id));
    
    return {
      success: true,
      contentTypes: contentTypes.items.map(item => item.sys.id)
    };
  } catch (error) {
    console.error('Error connecting to Contentful:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

export default testContentfulConnection; 