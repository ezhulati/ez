// Script to generate a homepage preview image
const { createCanvas, loadImage, registerFont } = require('canvas');
const fs = require('fs');
const path = require('path');

// Ensure the images directory exists
const imagesDir = path.join(__dirname, 'public', 'images');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// Canvas configuration for Open Graph image (1200x630 is recommended)
const width = 1200;
const height = 630;
const canvas = createCanvas(width, height);
const ctx = canvas.getContext('2d');

// Background gradient matching site theme
const gradient = ctx.createLinearGradient(0, 0, 0, height);
gradient.addColorStop(0, '#f9fafb'); // light gray-50
gradient.addColorStop(1, '#ffffff'); // white
ctx.fillStyle = gradient;
ctx.fillRect(0, 0, width, height);

// Add border
ctx.strokeStyle = '#e5e7eb'; // gray-200
ctx.lineWidth = 4;
ctx.strokeRect(2, 2, width - 4, height - 4);

// Draw decorative element
ctx.fillStyle = '#10b981'; // green-500
ctx.beginPath();
ctx.moveTo(0, 0);
ctx.lineTo(400, 0);
ctx.lineTo(0, 150);
ctx.closePath();
ctx.fill();

// Add site title
ctx.textAlign = 'center';
ctx.fillStyle = '#111827'; // gray-900
ctx.font = 'bold 64px Arial';
ctx.fillText('Enri Zhulati', width / 2, height / 2 - 50);

// Add tagline
ctx.font = '32px Arial';
ctx.fillStyle = '#4b5563'; // gray-600
ctx.fillText('Digital Marketing & Web Strategy', width / 2, height / 2 + 30);

// Website URL at bottom
ctx.font = '28px Arial';
ctx.fillStyle = '#10b981'; // green-500
ctx.fillText('enrizhulati.com', width / 2, height - 50);

async function addLottieFrameAndSave() {
  try {
    // OPTION 1: If you have a static image of your Lottie animation
    // Load the Lottie frame image (you need to create this separately)
    // const lottieFrame = await loadImage('path/to/your/lottie-frame.png');
    // Draw the Lottie frame in a circle
    // ctx.save();
    // ctx.beginPath();
    // ctx.arc(width - 250, 200, 150, 0, Math.PI * 2);
    // ctx.clip();
    // ctx.drawImage(lottieFrame, width - 400, 50, 300, 300);
    // ctx.restore();
    
    // OPTION 2: If you don't have the static image, just leave a placeholder note
    ctx.beginPath();
    ctx.arc(width - 250, 200, 150, 0, Math.PI * 2);
    ctx.strokeStyle = '#10b981'; // green-500
    ctx.lineWidth = 8;
    ctx.stroke();
    ctx.fillStyle = 'rgba(16, 185, 129, 0.1)';
    ctx.fill();
    ctx.textAlign = 'center';
    ctx.fillStyle = '#111827';
    ctx.font = '24px Arial';
    ctx.fillText('Lottie Animation', width - 250, 200);
    ctx.font = '18px Arial';
    ctx.fillText('Frame', width - 250, 230);
    
    // Save the image
    const buffer = canvas.toBuffer('image/jpeg', { quality: 0.9 });
    fs.writeFileSync(path.join(imagesDir, 'homepage-preview.jpg'), buffer);
    console.log('Homepage preview image created successfully!');
  } catch (error) {
    console.error('Error creating preview image:', error);
  }
}

addLottieFrameAndSave(); 