const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  // Handle root path
  let filePath = req.url === '/' ? 'index.html' : req.url;
  
  // Remove leading slash if present
  if (filePath.startsWith('/')) {
    filePath = filePath.substring(1);
  }
  
  const fullPath = path.join(__dirname, filePath);
  
  // Set content type based on file extension
  const ext = path.extname(filePath).toLowerCase();
  let contentType = 'text/html';
  
  switch (ext) {
    case '.ico':
      contentType = 'image/x-icon';
      break;
    case '.png':
      contentType = 'image/png';
      break;
    case '.svg':
      contentType = 'image/svg+xml';
      break;
    case '.webmanifest':
      contentType = 'application/manifest+json';
      break;
    case '.css':
      contentType = 'text/css';
      break;
    case '.js':
      contentType = 'application/javascript';
      break;
    case '.json':
      contentType = 'application/json';
      break;
  }
  
  // Try to read and serve the file
  try {
    const data = fs.readFileSync(fullPath);
    res.writeHead(200, {
      'Content-Type': contentType,
      'Access-Control-Allow-Origin': '*'
    });
    res.end(data);
    console.log(`200: ${req.url}`);
  } catch (err) {
    console.log(`404: ${req.url} - ${fullPath}`);
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found');
  }
});

server.listen(3001, () => {
  console.log('Jahanzaib Dev Handbook running on http://localhost:3001');
  console.log('Serving files from:', __dirname);
});
