/**
 * Create Default PNG Image
 * 
 * This script creates a PNG placeholder image for scans.
 */
const fs = require('fs');
const path = require('path');

// Default content for a simple 1x1 PNG (transparent)
// This is a base64-encoded 1x1 transparent PNG
const defaultPngBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

// Create the public directory if it doesn't exist
const publicDir = path.join(__dirname, '../../frontend/public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
  console.log(`Created directory: ${publicDir}`);
}

// Path to save the default PNG image
const defaultImagePath = path.join(publicDir, 'default-scan.png');

// Write the PNG content to a file
fs.writeFileSync(
  defaultImagePath, 
  Buffer.from(defaultPngBase64, 'base64')
);

console.log(`Default PNG image created at: ${defaultImagePath}`);
console.log('\nScript completed successfully!');
