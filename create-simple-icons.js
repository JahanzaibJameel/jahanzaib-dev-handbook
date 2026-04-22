const fs = require('fs');
const path = require('path');

// Create a simple SVG icon
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="#6366f1" rx="100"/>
  <text x="256" y="380" font-size="280" text-anchor="middle" fill="white" font-family="monospace">&lt;/&gt;</text>
</svg>`;

// Create site.webmanifest
const manifest = {
  name: "Jahanzaib Dev Handbook",
  short_name: "Dev Handbook",
  icons: [
    { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
    { src: "/icon-512.png", sizes: "512x512", type: "image/png" }
  ],
  theme_color: "#6366f1",
  background_color: "#0f172a",
  display: "standalone"
};

// Write files to root directory
fs.writeFileSync('icon.svg', svgContent);
fs.writeFileSync('site.webmanifest', JSON.stringify(manifest, null, 2));

// Create a simple favicon.ico (using a basic approach)
const canvas = require('canvas') || null;
if (canvas) {
  // Use canvas if available
  const { createCanvas } = canvas;
  const canv = createCanvas(32, 32);
  const ctx = canv.getContext('2d');
  
  // Draw simple icon
  ctx.fillStyle = '#6366f1';
  ctx.fillRect(0, 0, 32, 32);
  ctx.fillStyle = 'white';
  ctx.font = 'bold 16px monospace';
  ctx.fillText('</>', 16, 20);
  
  // Save as PNG (will work as favicon)
  const buffer = canv.toBuffer('image/png');
  fs.writeFileSync('favicon.ico', buffer);
  
  // Create 192x192 and 512x512 versions
  const canv192 = createCanvas(192, 192);
  const ctx192 = canv192.getContext('2d');
  ctx192.fillStyle = '#6366f1';
  ctx192.fillRect(0, 0, 192, 192);
  ctx192.fillStyle = 'white';
  ctx192.font = 'bold 96px monospace';
  ctx192.fillText('</>', 96, 120);
  fs.writeFileSync('icon-192.png', canv192.toBuffer('image/png'));
  
  const canv512 = createCanvas(512, 512);
  const ctx512 = canv512.getContext('2d');
  ctx512.fillStyle = '#6366f1';
  ctx512.fillRect(0, 0, 512, 512);
  ctx512.fillStyle = 'white';
  ctx512.font = 'bold 256px monospace';
  ctx512.fillText('</>', 256, 320);
  fs.writeFileSync('icon-512.png', canv512.toBuffer('image/png'));
  
} else {
  // Fallback: create simple placeholder files
  console.log('Canvas not available, creating placeholder files...');
  
  // Create a simple favicon.ico placeholder
  const icoPlaceholder = Buffer.from('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'base64');
  fs.writeFileSync('favicon.ico', icoPlaceholder);
  
  // Create placeholder PNG files
  fs.writeFileSync('icon-192.png', icoPlaceholder);
  fs.writeFileSync('icon-512.png', icoPlaceholder);
}

console.log('Created all icon files:');
console.log('- icon.svg');
console.log('- site.webmanifest');
console.log('- favicon.ico');
console.log('- icon-192.png');
console.log('- icon-512.png');
