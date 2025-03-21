#!/usr/bin/env node

/**
 * Post-build script to ensure critical files are copied to the dist folder
 * This ensures the sitemap.xml file is properly served by Netlify
 */

const fs = require('fs');
const path = require('path');

// Define paths
const publicDir = path.join(__dirname, '..', 'public');
const distDir = path.join(__dirname, '..', 'dist');

// Main function to run post-build steps
async function main() {
  console.log('Running post-build steps...');
  
  // Ensure sitemap.xml is copied to dist directory
  const sitemapSource = path.join(publicDir, 'sitemap.xml');
  const sitemapDest = path.join(distDir, 'sitemap.xml');

  // Check if sitemap exists in public folder
  if (fs.existsSync(sitemapSource)) {
    // Create dist directory if it doesn't exist
    if (!fs.existsSync(distDir)) {
      fs.mkdirSync(distDir, { recursive: true });
    }

    // Copy the sitemap to the dist folder
    fs.copyFileSync(sitemapSource, sitemapDest);
    console.log(`Copied ${sitemapSource} to ${sitemapDest}`);
  } else {
    console.error(`Sitemap file not found at ${sitemapSource}`);
    // Generate a basic sitemap if one doesn't exist
    if (!fs.existsSync(distDir)) {
      fs.mkdirSync(distDir, { recursive: true });
    }
    
    // Import the generate sitemap function and write directly to dist
    console.log('Generating a fallback sitemap...');
    try {
      const generateSitemap = require('./generate-sitemap');
      const sitemap = await generateSitemap(); // Call the imported async function
      fs.writeFileSync(sitemapDest, sitemap);
      console.log(`Generated fallback sitemap at ${sitemapDest}`);
    } catch (error) {
      console.error('Error generating fallback sitemap:', error);
      process.exit(1);
    }
  }

  console.log('Post-build steps completed successfully!');
}

// Run the main function
main().catch(error => {
  console.error('Post-build script failed:', error);
  process.exit(1);
}); 