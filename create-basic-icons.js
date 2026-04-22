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

// Create minimal PNG placeholder (1x1 pixel)
const minimalPng = Buffer.from([
  0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, // PNG signature
  0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52, // IHDR chunk
  0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, // 1x1 dimensions
  0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53,
  0xDE, 0x00, 0x00, 0x00, 0x0C, 0x49, 0x44, 0x41, // IDAT chunk
  0x54, 0x08, 0x99, 0x01, 0x01, 0x01, 0x00, 0x00,
  0xFE, 0xFF, 0xFF, 0x00, 0x00, 0x00, 0x02, 0x00,
  0x01, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4E, 0x44, // IEND chunk
  0xAE, 0x42, 0x60, 0x82
]);

// Write files to root directory
try {
  fs.writeFileSync('icon.svg', svgContent);
  fs.writeFileSync('site.webmanifest', JSON.stringify(manifest, null, 2));
  fs.writeFileSync('favicon.ico', minimalPng);
  fs.writeFileSync('icon-192.png', minimalPng);
  fs.writeFileSync('icon-512.png', minimalPng);
  
  console.log('Created all icon files:');
  console.log('- icon.svg');
  console.log('- site.webmanifest');
  console.log('- favicon.ico');
  console.log('- icon-192.png');
  console.log('- icon-512.png');
  console.log('\nNote: These are placeholder files. For production, use the generate-icons.html in a browser.');
} catch (error) {
  console.error('Error creating files:', error);
}
