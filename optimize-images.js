import sharp from 'sharp';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create directory if it doesn't exist
if (!fs.existsSync('./public/images')) {
  fs.mkdirSync('./public/images', { recursive: true });
}

// Sizes to generate
const sizes = [32, 64, 128, 256];

// Convert and optimize images
async function optimizeImages() {
  try {
    const inputImage = './headshot-original.png';

    // Create WebP versions
    for (const size of sizes) {
      await sharp(inputImage)
        .resize(size, size)
        .webp({ quality: 80 })
        .toFile(`./public/images/headshot-${size}.webp`);
      
      console.log(`Created headshot-${size}.webp`);
    }

    // Create PNG versions (as fallback)
    for (const size of sizes) {
      await sharp(inputImage)
        .resize(size, size)
        .png({ quality: 80 })
        .toFile(`./public/images/headshot-${size}.png`);
      
      console.log(`Created headshot-${size}.png`);
    }

    console.log('Image optimization complete!');
  } catch (error) {
    console.error('Error optimizing images:', error);
  }
}

optimizeImages(); 