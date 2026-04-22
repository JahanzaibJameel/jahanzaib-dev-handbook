// Node.js script to generate favicon.ico and PNG icons for the mdBook handbook
// Run with: node create-icons.js

const fs = require('fs');
const path = require('path');

// Create a simple SVG icon as base64 data
const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
  <path d="M12 8v4"/>
  <path d="M12 16h.01"/>
</svg>`;

// Create a simple canvas-based icon generator
function createIconData(size) {
    // Simple blue shield icon with code brackets
    const canvas = {
        width: size,
        height: size,
        data: []
    };
    
    // Create a simple blue square with rounded corners for demonstration
    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            // Simple blue gradient
            const r = Math.floor(59 + (x / size) * 30);
            const g = Math.floor(130 + (y / size) * 20);
            const b = 246;
            const a = 255;
            
            canvas.data.push(r, g, b, a);
        }
    }
    
    return canvas;
}

// Create favicon.ico (simplified - just a 16x16 PNG)
function createFavicon() {
    const size = 16;
    const canvas = createIconData(size);
    
    // Simple PNG header for 16x16 image
    const pngData = Buffer.from([
        0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, // PNG signature
        0x00, 0x00, 0x00, 0x0D, // IHDR chunk length
        0x49, 0x48, 0x44, 0x52, // IHDR
        0x00, 0x00, 0x00, 0x10, // width: 16
        0x00, 0x00, 0x00, 0x10, // height: 16
        0x08, 0x02, 0x00, 0x00, 0x00, // bit depth, color type, compression, filter, interlace
        0x4B, 0x6D, 0x29, 0xDC, // CRC
        0x00, 0x00, 0x00, 0x0C, // IDAT chunk length
        0x49, 0x44, 0x41, 0x54, // IDAT
        0x08, 0x99, 0x01, 0x01, 0x00, 0x00, 0x00, 0x02, 0x00, 0x01, // Minimal image data
        0x00, 0x00, 0x00, 0x00, // CRC
        0x00, 0x00, 0x00, 0x00, // IEND chunk length
        0x49, 0x45, 0x4E, 0x44, // IEND
        0xAE, 0x42, 0x60, 0x82  // CRC
    ]);
    
    return pngData;
}

// Create PNG icon data
function createPNGIcon(size) {
    // Simple PNG data for demonstration
    const pngData = Buffer.from([
        0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, // PNG signature
        0x00, 0x00, 0x00, 0x0D, // IHDR chunk length
        0x49, 0x48, 0x44, 0x52, // IHDR
        ...sizeToBytes(size, 4), // width
        ...sizeToBytes(size, 4), // height
        0x08, 0x02, 0x00, 0x00, 0x00, // bit depth, color type, compression, filter, interlace
        0x4B, 0x6D, 0x29, 0xDC, // CRC
        0x00, 0x00, 0x00, 0x0C, // IDAT chunk length
        0x49, 0x44, 0x41, 0x54, // IDAT
        0x08, 0x99, 0x01, 0x01, 0x00, 0x00, 0x00, 0x02, 0x00, 0x01, // Minimal image data
        0x00, 0x00, 0x00, 0x00, // CRC
        0x00, 0x00, 0x00, 0x00, // IEND chunk length
        0x49, 0x45, 0x4E, 0x44, // IEND
        0xAE, 0x42, 0x60, 0x82  // CRC
    ]);
    
    return pngData;
}

function sizeToBytes(size, bytes) {
    const result = [];
    for (let i = bytes - 1; i >= 0; i--) {
        result.push((size >> (i * 8)) & 0xFF);
    }
    return result;
}

// Generate and save icons
function generateIcons() {
    const bookDir = path.join(__dirname, 'book');
    
    // Ensure book directory exists
    if (!fs.existsSync(bookDir)) {
        fs.mkdirSync(bookDir, { recursive: true });
    }
    
    // Create favicon.ico
    const faviconData = createFavicon();
    fs.writeFileSync(path.join(bookDir, 'favicon.ico'), faviconData);
    console.log('Created favicon.ico');
    
    // Create icon-192.png
    const icon192Data = createPNGIcon(192);
    fs.writeFileSync(path.join(bookDir, 'icon-192.png'), icon192Data);
    console.log('Created icon-192.png');
    
    // Create icon-512.png
    const icon512Data = createPNGIcon(512);
    fs.writeFileSync(path.join(bookDir, 'icon-512.png'), icon512Data);
    console.log('Created icon-512.png');
    
    console.log('All icons generated successfully!');
}

// Run the script
if (require.main === module) {
    generateIcons();
}

module.exports = { generateIcons, createFavicon, createPNGIcon };
