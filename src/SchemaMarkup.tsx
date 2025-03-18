import { useEffect } from 'react';
import getAllSchemaMarkup from './utils/schema';

/**
 * Component that adds schema.org structured data to the page
 * This is important for SEO and rich results in search engines
 */
const SchemaMarkup = () => {
  useEffect(() => {
    // Get all schema markup objects
    const schemaObjects = getAllSchemaMarkup();
    
    // Add each schema markup to the page as separate script tags
    schemaObjects.forEach(schemaString => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.innerHTML = schemaString;
      document.head.appendChild(script);
    });

    // Clean up function to remove the scripts when component unmounts
    return () => {
      const scripts = document.querySelectorAll('script[type="application/ld+json"]');
      scripts.forEach(script => {
        if (document.head.contains(script)) {
          document.head.removeChild(script);
        }
      });
    };
  }, []);

  // This component doesn't render anything visible
  return null;
};

export default SchemaMarkup;