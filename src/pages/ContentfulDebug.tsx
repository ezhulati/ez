import React, { useEffect, useState } from 'react';
import { testContentfulConnection } from '../services/contentful-test';

const ContentfulDebug = () => {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<any>(null);
  const [envVars, setEnvVars] = useState<Record<string, string>>({});

  useEffect(() => {
    const testConnection = async () => {
      setLoading(true);
      try {
        // Get all env vars that start with VITE_ to check what's available
        const allEnvVars: Record<string, string> = {};
        Object.keys(import.meta.env).forEach(key => {
          if (key.startsWith('VITE_')) {
            allEnvVars[key] = typeof import.meta.env[key] === 'string' 
              ? `${(import.meta.env[key] as string).substring(0, 3)}...` 
              : String(import.meta.env[key]);
          }
        });
        setEnvVars(allEnvVars);
        
        // Test Contentful connection
        const testResult = await testContentfulConnection();
        setResult(testResult);
      } catch (error) {
        console.error('Test failed:', error);
        setResult({ 
          success: false, 
          error: error instanceof Error ? error.message : 'Unknown error' 
        });
      } finally {
        setLoading(false);
      }
    };

    testConnection();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Contentful Connection Debug</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Environment Variables</h2>
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded overflow-auto">
          <pre>{JSON.stringify(envVars, null, 2)}</pre>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center">
          <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Connection Test Result</h2>
          <div className={`p-4 rounded overflow-auto ${
            result?.success 
              ? 'bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800' 
              : 'bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800'
          }`}>
            <pre>{JSON.stringify(result, null, 2)}</pre>
          </div>
          
          {!result?.success && (
            <div className="mt-6 p-4 bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded">
              <h3 className="font-semibold mb-2">Troubleshooting Steps:</h3>
              <ol className="list-decimal pl-5 space-y-2">
                <li>Check that your <code>.env</code> file contains the proper Contentful credentials.</li>
                <li>Make sure you've set the environment variables in your Netlify dashboard if deploying there.</li>
                <li>Verify that your Contentful space ID and access tokens are correct.</li>
                <li>Ensure that you have blog content created in your Contentful space.</li>
                <li>Check network requests in the browser developer tools for any CORS issues.</li>
              </ol>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ContentfulDebug; 