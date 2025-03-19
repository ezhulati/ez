import { config } from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file
const envPath = path.resolve(__dirname, '../.env');

if (fs.existsSync(envPath)) {
  console.log(`Loading environment variables from ${envPath}`);
  config({ path: envPath });
} else {
  console.log('No .env file found, using environment variables from system');
}

// Extract Contentful configuration from Vite's environment variables in the .env file
// This is needed because Vite prefixes environment variables with VITE_
// and we need to expose them to Node.js process.env

const contentfulVars = {
  CONTENTFUL_SPACE_ID: process.env.VITE_CONTENTFUL_SPACE_ID,
  CONTENTFUL_ACCESS_TOKEN: process.env.VITE_CONTENTFUL_ACCESS_TOKEN,
  CONTENTFUL_PREVIEW_TOKEN: process.env.VITE_CONTENTFUL_PREVIEW_TOKEN,
  CONTENTFUL_ENVIRONMENT: process.env.VITE_CONTENTFUL_ENVIRONMENT || 'master',
};

// Set these variables in process.env so they're accessible without the VITE_ prefix
Object.entries(contentfulVars).forEach(([key, value]) => {
  if (value) {
    process.env[key] = value;
  }
});

export default contentfulVars; 