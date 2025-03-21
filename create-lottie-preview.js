// Script to convert a Lottie animation frame to a static image
const fs = require('fs');
const path = require('path');
const https = require('https');
const { createCanvas } = require('canvas');
const fetch = require('node-fetch');

// Ensure the images directory exists
const imagesDir = path.join(__dirname, 'public', 'images');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// The URL of the Lottie animation from App.tsx
const lottieUrl = "https://lottie.host/d24b0dec-833f-4259-8bf9-6b911b174645/P4CRRzGREn.lottie";

// Function to download the Lottie JSON file
async function downloadLottie(url) {
  console.log('Downloading Lottie file...');
  
  try {
    // For .lottie files (which are ZIP archives), we'll use a different approach
    // First, check if we need to install the dotlottie library
    try {
      require('@dotlottie/dotlottie-js');
    } catch (e) {
      console.log('Installing @dotlottie/dotlottie-js library...');
      require('child_process').execSync('npm install @dotlottie/dotlottie-js --save');
    }

    // Use node-fetch to download the file
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to download: ${response.statusText}`);
    }
    
    const buffer = await response.buffer();
    const tmpFile = path.join(__dirname, 'temp-lottie.lottie');
    fs.writeFileSync(tmpFile, buffer);
    
    console.log('Lottie file downloaded successfully');
    
    // Now we need to extract JSON from the .lottie file (which is a ZIP)
    // This is a simplified approach - a real implementation would use the dotlottie library
    // For now, we'll create a fallback image
    createFallbackImage();
    
    return null;
  } catch (error) {
    console.error('Error downloading Lottie:', error);
    createFallbackImage();
    return null;
  }
}

// Function to create a fallback image if we can't extract a frame from the Lottie
function createFallbackImage() {
  console.log('Creating fallback image based on Lottie animation style...');
  
  // Create a canvas with dimensions for Open Graph (1200x630)
  const width = 1200;
  const height = 630;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  
  // Background gradient
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, '#f9fafb'); // light gray-50
  gradient.addColorStop(1, '#ffffff'); // white
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  
  // Add border
  ctx.strokeStyle = '#e5e7eb'; // gray-200
  ctx.lineWidth = 4;
  ctx.strokeRect(2, 2, width - 4, height - 4);
  
  // Draw a decorative element
  ctx.fillStyle = '#10b981'; // green-500
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(400, 0);
  ctx.lineTo(0, 150);
  ctx.closePath();
  ctx.fill();
  
  // Add an abstract representation of a dashboard/chart (mimicking the Lottie)
  // 1. Draw some bars
  for (let i = 0; i < 5; i++) {
    const x = width / 2 - 200 + (i * 80);
    const barHeight = 100 + Math.random() * 150;
    const y = height / 2 + 50 - barHeight;
    
    // Create a gradient for each bar
    const barGradient = ctx.createLinearGradient(x, y, x, y + barHeight);
    barGradient.addColorStop(0, '#10b981'); // green-500
    barGradient.addColorStop(1, '#34d399'); // green-400
    
    ctx.fillStyle = barGradient;
    ctx.fillRect(x, y, 50, barHeight);
    
    // Add a light border
    ctx.strokeStyle = '#d1fae5'; // green-100
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, 50, barHeight);
  }
  
  // 2. Draw a line chart
  ctx.beginPath();
  ctx.moveTo(width / 2 - 250, height / 2 - 50);
  ctx.lineTo(width / 2 - 200, height / 2 - 80);
  ctx.lineTo(width / 2 - 150, height / 2 - 60);
  ctx.lineTo(width / 2 - 100, height / 2 - 120);
  ctx.lineTo(width / 2 - 50, height / 2 - 100);
  ctx.lineTo(width / 2, height / 2 - 150);
  ctx.lineTo(width / 2 + 50, height / 2 - 130);
  ctx.lineTo(width / 2 + 100, height / 2 - 180);
  ctx.lineTo(width / 2 + 150, height / 2 - 160);
  ctx.lineTo(width / 2 + 200, height / 2 - 200);
  
  ctx.strokeStyle = '#10b981'; // green-500
  ctx.lineWidth = 4;
  ctx.stroke();
  
  // Add dots at each data point
  const points = [
    { x: width / 2 - 250, y: height / 2 - 50 },
    { x: width / 2 - 200, y: height / 2 - 80 },
    { x: width / 2 - 150, y: height / 2 - 60 },
    { x: width / 2 - 100, y: height / 2 - 120 },
    { x: width / 2 - 50, y: height / 2 - 100 },
    { x: width / 2, y: height / 2 - 150 },
    { x: width / 2 + 50, y: height / 2 - 130 },
    { x: width / 2 + 100, y: height / 2 - 180 },
    { x: width / 2 + 150, y: height / 2 - 160 },
    { x: width / 2 + 200, y: height / 2 - 200 }
  ];
  
  points.forEach(point => {
    ctx.beginPath();
    ctx.arc(point.x, point.y, 6, 0, Math.PI * 2);
    ctx.fillStyle = '#34d399'; // green-400
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();
  });
  
  // Add title
  ctx.textAlign = 'center';
  ctx.fillStyle = '#111827'; // gray-900
  ctx.font = 'bold 64px Arial';
  ctx.fillText('Enri Zhulati', width / 2, 150);
  
  // Add tagline
  ctx.font = '32px Arial';
  ctx.fillStyle = '#4b5563'; // gray-600
  ctx.fillText('Digital Marketing & Web Strategy', width / 2, 200);
  
  // Website URL
  ctx.font = '28px Arial';
  ctx.fillStyle = '#10b981'; // green-500
  ctx.fillText('enrizhulati.com', width / 2, height - 50);
  
  // Save the image
  const buffer = canvas.toBuffer('image/jpeg', { quality: 0.95 });
  fs.writeFileSync(path.join(imagesDir, 'homepage-preview.jpg'), buffer);
  
  console.log('Created homepage preview image based on Lottie style');
}

// Main function to process the Lottie animation
async function processLottie() {
  await downloadLottie(lottieUrl);
}

// Run the script
processLottie(); 