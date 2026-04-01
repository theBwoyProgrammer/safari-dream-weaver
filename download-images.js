import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';

const assetsDir = path.join(process.cwd(), 'src', 'assets');
const publicDir = path.join(process.cwd(), 'public');

// Ensure directories exist
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Image data with real free images from Unsplash, Pexels, and Pixabay
// These are direct links to high-quality wildlife and safari images
const images = [
  {
    name: 'hero-safari.jpg',
    url: 'https://images.pexels.com/photos/3220367/pexels-photo-3220367.jpeg?auto=compress&cs=tinysrgb&w=1200',
    description: 'African elephant at sunset'
  },
  {
    name: 'gorilla-trekking.jpg',
    url: 'https://images.unsplash.com/photo-1551316679-9c6ae9dec224?ixlib=rb-4.0.3&w=1200&q=95',
    description: 'Mountain gorilla family'
  },
  {
    name: 'lion-safari.jpg',
    url: 'https://images.unsplash.com/photo-1614027164847-1b28cfe1df60?ixlib=rb-4.0.3&w=1200&q=95',
    description: 'Lion in African savanna'
  },
  {
    name: 'murchison-falls.jpg',
    url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&w=1200&q=95',
    description: 'Powerful waterfall landscape'
  },
  {
    name: 'kidepo-wildlife.jpg',
    url: 'https://images.pexels.com/photos/3561339/pexels-photo-3561339.jpeg?auto=compress&cs=tinysrgb&w=1200',
    description: 'African wildlife in natural habitat'
  },
  {
    name: 'safari-tour.jpg',
    url: 'https://images.pexels.com/photos/349758/hummingbird-bird-birds-349758.jpeg?auto=compress&cs=tinysrgb&w=1200',
    description: 'Safari adventure scene',
    dir: assetsDir
  },
  {
    name: 'og-image.png',
    url: 'https://images.pexels.com/photos/3220367/pexels-photo-3220367.jpeg?auto=compress&cs=tinysrgb&w=1200&h=630&fit=crop',
    description: 'Social media thumbnail - African elephant',
    dir: publicDir
  }
];

// Function to download image
function downloadImage(imageUrl, filepath) {
  return new Promise((resolve, reject) => {
    const protocol = imageUrl.startsWith('https') ? https : http;
    
    protocol.get(imageUrl, (response) => {
      // Handle redirects
      if (response.statusCode === 301 || response.statusCode === 302) {
        downloadImage(response.headers.location, filepath)
          .then(resolve)
          .catch(reject);
        return;
      }

      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download: ${response.statusCode}`));
        return;
      }

      const fileStream = fs.createWriteStream(filepath);
      response.pipe(fileStream);

      fileStream.on('finish', () => {
        fileStream.close();
        resolve();
      });

      fileStream.on('error', reject);
    }).on('error', reject);
  });
}

// Download all images
async function downloadAllImages() {
  console.log('🌍 Starting to download safari images...\n');
  
  let downloaded = 0;
  let failed = 0;

  for (const image of images) {
    const directory = image.dir || assetsDir;
    const filepath = path.join(directory, image.name);
    
    try {
      console.log(`⏳ Downloading ${image.name} (${image.description})...`);
      await downloadImage(image.url, filepath);
      
      const stats = fs.statSync(filepath);
      const sizeKB = (stats.size / 1024).toFixed(2);
      console.log(`✅ Downloaded: ${image.name} (${sizeKB} KB)\n`);
      downloaded++;
    } catch (error) {
      console.error(`❌ Failed to download ${image.name}: ${error.message}\n`);
      failed++;
    }
  }

  console.log(`\n📊 Summary: ${downloaded} downloaded, ${failed} failed`);
  
  if (failed === 0) {
    console.log('✨ All images downloaded successfully!');
  }
}

downloadAllImages().catch(console.error);
