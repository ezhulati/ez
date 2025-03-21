#!/usr/bin/env node

/**
 * Post-build script to ensure critical files are copied to the dist folder
 * This ensures the sitemap.xml file is properly served by Netlify
 */

const fs = require('fs');
const path = require('path');

console.log('Running post-build steps...');

// Define paths
const publicDir = path.join(__dirname, '..', 'public');
const distDir = path.join(__dirname, '..', 'dist');

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
  const generateSitemap = require('./generate-sitemap');
  const sitemap = generateSitemap();
  fs.writeFileSync(sitemapDest, sitemap);
  console.log(`Generated fallback sitemap at ${sitemapDest}`);
}

console.log('Post-build steps completed successfully!'); 