#!/usr/bin/env node

/**
 * Script to set up a Contentful webhook that triggers a Netlify build
 * when content is published in Contentful.
 * 
 * Usage:
 * 1. CONTENTFUL_MANAGEMENT_TOKEN=your_token node scripts/setup-contentful-webhook.js
 * 
 * This will create or update a webhook in Contentful that calls the Netlify build hook
 * whenever content is published or unpublished.
 */

const https = require('https');

// Configuration from environment or defaults
const CONTENTFUL_SPACE_ID = process.env.VITE_CONTENTFUL_SPACE_ID || 'hdo1k8om3hmw';
const CONTENTFUL_ENVIRONMENT = process.env.VITE_CONTENTFUL_ENVIRONMENT || 'master';
const CONTENTFUL_MANAGEMENT_TOKEN = process.env.CONTENTFUL_MANAGEMENT_TOKEN;
const NETLIFY_BUILD_HOOK = process.env.CONTENTFUL_REBUILD_HOOK || 'https://api.netlify.com/build_hooks/67d782602c666be1d13a74e5';

// Check if we have a management token
if (!CONTENTFUL_MANAGEMENT_TOKEN) {
  console.error('Error: CONTENTFUL_MANAGEMENT_TOKEN is required');
  console.error('Please run the script with: CONTENTFUL_MANAGEMENT_TOKEN=your_token node scripts/setup-contentful-webhook.js');
  process.exit(1);
}

// Define the webhook configuration
const webhookName = 'Netlify Build Trigger';
const webhookConfig = {
  name: webhookName,
  url: NETLIFY_BUILD_HOOK,
  topics: [
    'Entry.publish',
    'Entry.unpublish',
    'ContentType.publish',
    'ContentType.unpublish'
  ],
  filters: [
    {
      equals: [
        { doc: 'sys.environment.sys.id' },
        CONTENTFUL_ENVIRONMENT
      ]
    }
  ],
  headers: [
    {
      key: 'Content-Type',
      value: 'application/json'
    }
  ],
  active: true
};

// Function to make authenticated requests to Contentful Management API
function contentfulRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.contentful.com',
      path,
      method,
      headers: {
        'Authorization': `Bearer ${CONTENTFUL_MANAGEMENT_TOKEN}`,
        'Content-Type': 'application/vnd.contentful.management.v1+json'
      }
    };

    const req = https.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            resolve(JSON.parse(responseData));
          } catch (e) {
            resolve(responseData);
          }
        } else {
          console.error(`HTTP Error: ${res.statusCode}`);
          console.error(`Response: ${responseData}`);
          reject(new Error(`HTTP Error: ${res.statusCode}`));
        }
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

// Function to list existing webhooks
async function listWebhooks() {
  try {
    const webhooks = await contentfulRequest('GET', `/spaces/${CONTENTFUL_SPACE_ID}/webhook_definitions`);
    return webhooks.items || [];
  } catch (error) {
    console.error('Error listing webhooks:', error);
    return [];
  }
}

// Function to create a new webhook
async function createWebhook() {
  try {
    const webhook = await contentfulRequest(
      'POST', 
      `/spaces/${CONTENTFUL_SPACE_ID}/webhook_definitions`,
      webhookConfig
    );
    console.log(`Created webhook '${webhook.name}' with ID: ${webhook.sys.id}`);
    return webhook;
  } catch (error) {
    console.error('Error creating webhook:', error);
    throw error;
  }
}

// Function to update an existing webhook
async function updateWebhook(webhookId) {
  try {
    const webhook = await contentfulRequest(
      'PUT', 
      `/spaces/${CONTENTFUL_SPACE_ID}/webhook_definitions/${webhookId}`,
      webhookConfig
    );
    console.log(`Updated webhook '${webhook.name}' with ID: ${webhook.sys.id}`);
    return webhook;
  } catch (error) {
    console.error('Error updating webhook:', error);
    throw error;
  }
}

// Main function
async function main() {
  try {
    console.log('Setting up Contentful webhook to trigger Netlify builds...');
    
    // List existing webhooks
    const webhooks = await listWebhooks();
    console.log(`Found ${webhooks.length} existing webhooks`);
    
    // Find if our webhook already exists
    const existingWebhook = webhooks.find(webhook => webhook.name === webhookName);
    
    if (existingWebhook) {
      console.log(`Found existing webhook '${webhookName}' with ID: ${existingWebhook.sys.id}`);
      await updateWebhook(existingWebhook.sys.id);
    } else {
      console.log(`No existing webhook named '${webhookName}' found, creating new one...`);
      await createWebhook();
    }
    
    console.log('Webhook setup completed successfully!');
  } catch (error) {
    console.error('Webhook setup failed:', error);
    process.exit(1);
  }
}

// Run the main function
main(); 