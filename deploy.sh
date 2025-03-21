#!/bin/bash

# Deploy script for the website

echo "📦 Building the project..."
npm run build

echo "🚀 Deploying to Netlify..."
netlify deploy --prod

echo "✅ Deployment complete!" 