/**
 * Create Default Scan Image
 * 
 * This script creates a default placeholder image for scans.
 */
const fs = require('fs');
const path = require('path');

// Default content for a simple SVG placeholder
const defaultImageSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="224" height="224" viewBox="0 0 224 224">
  <rect width="224" height="224" fill="#f0f0f0"/>
  <text x="112" y="112" font-family="Arial" font-size="16" text-anchor="middle" dominant-baseline="middle" fill="#666">
    Image not available
  </text>
  <g transform="translate(112, 150)">
    <path d="M-20,-15 L20,-15 L0,15 Z" fill="#999"/>
    <rect x="-20" y="-40" width="40" height="20" fill="#999"/>
  </g>
</svg>`;

// Create the public directory if it doesn't exist
const publicDir = path.join(__dirname, '../../frontend/public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
  console.log(`Created directory: ${publicDir}`);
}

// Path to save the default image
const defaultImagePath = path.join(publicDir, 'default-scan.png');

// Write the SVG content to a file
fs.writeFileSync(
  path.join(publicDir, 'default-scan.svg'), 
  defaultImageSVG
);

console.log(`Default SVG image created at: ${path.join(publicDir, 'default-scan.svg')}`);
console.log('\nPlease convert the SVG to PNG using an online tool or image editor');
console.log(`and place it at: ${defaultImagePath}`);
console.log('\nScript completed successfully!');
