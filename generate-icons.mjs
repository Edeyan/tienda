import sharp from 'sharp';
import fs from 'fs';

const svgPath = 'public/icon.svg';

async function generate() {
  const svgBuffer = fs.readFileSync(svgPath);

  // pwa-192x192.png
  await sharp(svgBuffer)
    .resize(192, 192)
    .toFile('public/pwa-192x192.png');

  // pwa-512x512.png
  await sharp(svgBuffer)
    .resize(512, 512)
    .toFile('public/pwa-512x512.png');

  // pwa-maskable-512x512.png (same, the SVG has a solid bg and the logo is well within the safe zone)
  await sharp(svgBuffer)
    .resize(512, 512)
    .toFile('public/pwa-maskable-512x512.png');

  // apple-touch-icon.png
  await sharp(svgBuffer)
    .resize(180, 180)
    .toFile('public/apple-touch-icon.png');

  console.log('Icons generated successfully.');
}

generate().catch(console.error);
