// Script to generate a preview image for the SEO ROI Calculator
const { createCanvas, loadImage, registerFont } = require('canvas');
const fs = require('fs');
const path = require('path');

// Ensure the images directory exists
const imagesDir = path.join(__dirname, 'public', 'images');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// Canvas configuration
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

// Add a subtle pattern of search related icons
ctx.fillStyle = 'rgba(16, 185, 129, 0.05)'; // green-500 with low opacity
for (let i = 0; i < 15; i++) {
  const x = Math.random() * width;
  const y = Math.random() * height;
  const size = 10 + Math.random() * 40;
  
  // Draw chart icon
  ctx.beginPath();
  ctx.moveTo(x, y + size);
  ctx.lineTo(x, y);
  ctx.lineTo(x + size / 3, y + size / 3);
  ctx.lineTo(x + size / 3 * 2, y - size / 3);
  ctx.lineTo(x + size, y + size / 2);
  ctx.stroke();
}

// Set text styles
ctx.textAlign = 'center';
ctx.fillStyle = '#111827'; // gray-900

// Title
ctx.font = 'bold 64px Arial';
ctx.fillText('SEO ROI Calculator', width / 2, height / 2 - 50);

// Description
ctx.font = '32px Arial';
ctx.fillStyle = '#4b5563'; // gray-600
ctx.fillText('Measure Your Search Investment Returns', width / 2, height / 2 + 30);

// Website URL
ctx.font = '28px Arial';
ctx.fillStyle = '#10b981'; // green-500
ctx.fillText('enrizhulati.com', width / 2, height - 50);

// Business logo or name
ctx.font = 'bold 36px Arial';
ctx.fillStyle = '#111827'; // gray-900
ctx.textAlign = 'left';
ctx.fillText('Enri Zhulati', 50, 50);

// Draw a decorative chart to represent ROI growth
ctx.strokeStyle = '#10b981'; // green-500
ctx.lineWidth = 6;
ctx.beginPath();
ctx.moveTo(width - 300, height - 100);
ctx.lineTo(width - 250, height - 150);
ctx.lineTo(width - 200, height - 140);
ctx.lineTo(width - 150, height - 180);
ctx.lineTo(width - 100, height - 250);
ctx.stroke();

// Add a magnifying glass icon
ctx.beginPath();
ctx.arc(width - 200, 200, 50, 0, Math.PI * 2);
ctx.strokeStyle = '#10b981'; // green-500
ctx.lineWidth = 8;
ctx.stroke();
ctx.beginPath();
ctx.moveTo(width - 160, 240);
ctx.lineTo(width - 120, 280);
ctx.stroke();

// Save the image
const buffer = canvas.toBuffer('image/jpeg', { quality: 0.9 });
fs.writeFileSync(path.join(imagesDir, 'seo-roi-calculator-preview.jpg'), buffer);

console.log('SEO ROI Calculator preview image created successfully!'); 