const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// Create icons directory
const iconsDir = path.join(__dirname, '..', 'public', 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// 1. Create a beautiful celestial SVG icon
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <radialGradient id="bg" cx="50%" cy="30%" r="70%">
      <stop offset="0%" stop-color="#1e2542"/>
      <stop offset="60%" stop-color="#0e1222"/>
      <stop offset="100%" stop-color="#070912"/>
    </radialGradient>
    <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fde68a"/>
      <stop offset="45%" stop-color="#f5c518"/>
      <stop offset="100%" stop-color="#b89125"/>
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="8" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
  </defs>
  
  <!-- Outer circular background -->
  <rect width="512" height="512" rx="128" fill="url(#bg)"/>
  
  <!-- Celestial rings -->
  <circle cx="256" cy="256" r="190" fill="none" stroke="url(#gold)" stroke-width="2.5" opacity="0.4" stroke-dasharray="4 8"/>
  <circle cx="256" cy="256" r="160" fill="none" stroke="url(#gold)" stroke-width="3" opacity="0.6"/>
  <circle cx="256" cy="256" r="130" fill="none" stroke="#8b5cf6" stroke-width="1.5" opacity="0.3"/>
  
  <!-- Zodiac Constellation Points -->
  <g fill="url(#gold)" opacity="0.75">
    <circle cx="256" cy="96" r="4.5"/>
    <circle cx="369" cy="143" r="4.5"/>
    <circle cx="416" cy="256" r="4.5"/>
    <circle cx="369" cy="369" r="4.5"/>
    <circle cx="256" cy="416" r="4.5"/>
    <circle cx="143" cy="369" r="4.5"/>
    <circle cx="96" cy="256" r="4.5"/>
    <circle cx="143" cy="143" r="4.5"/>
  </g>
  
  <!-- Central 8-pointed Star & Crescent Moon Motif -->
  <!-- 8-pointed Star -->
  <g filter="url(#glow)">
    <polygon points="256,120 274,210 364,210 292,260 320,346 256,296 192,346 220,260 148,210 238,210" fill="url(#gold)" opacity="0.95"/>
    <!-- Center Core Glow -->
    <circle cx="256" cy="256" r="28" fill="#ffffff" opacity="0.9"/>
    <circle cx="256" cy="256" r="14" fill="url(#gold)"/>
  </g>
  
  <!-- Tiny sparkling stars -->
  <circle cx="180" cy="180" r="2.5" fill="#fde68a" opacity="0.8"/>
  <circle cx="330" cy="175" r="2" fill="#fde68a" opacity="0.8"/>
  <circle cx="190" cy="330" r="2" fill="#fde68a" opacity="0.8"/>
  <circle cx="320" cy="335" r="3" fill="#fde68a" opacity="0.8"/>
</svg>`;

fs.writeFileSync(path.join(iconsDir, 'icon.svg'), svgContent, 'utf8');

// Function to generate a valid PNG programmatically without native dependencies
function createSolidPNG(width, height, r, g, b) {
  // Simple uncompressed or deflate PNG generator
  // Signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // Bit depth
  ihdr[9] = 2; // Color type (Truecolor, 24-bit RGB)
  ihdr[10] = 0; // Compression
  ihdr[11] = 0; // Filter
  ihdr[12] = 0; // Interlace

  const ihdrChunk = createChunk('IHDR', ihdr);

  // Raw Image Data (Filter 0 + RGB for each scanline)
  const rowSize = 1 + width * 3;
  const rawData = Buffer.alloc(rowSize * height);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0; // Filter type 0 (None)
    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 3;
      // Gradient center distance
      const dx = (x - width / 2) / (width / 2);
      const dy = (y - height / 2) / (height / 2);
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 0.25) {
        // Star gold core
        rawData[pxOffset] = 245;
        rawData[pxOffset + 1] = 197;
        rawData[pxOffset + 2] = 24;
      } else if (dist < 0.7) {
        // Celestial ring
        const ring = Math.abs(dist - 0.55);
        if (ring < 0.03) {
          rawData[pxOffset] = 229;
          rawData[pxOffset + 1] = 184;
          rawData[pxOffset + 2] = 66;
        } else {
          rawData[pxOffset] = Math.max(14, Math.floor(r * (1 - dist * 0.4)));
          rawData[pxOffset + 1] = Math.max(18, Math.floor(g * (1 - dist * 0.4)));
          rawData[pxOffset + 2] = Math.max(34, Math.floor(b * (1 - dist * 0.4)));
        }
      } else {
        // Outer dark navy
        rawData[pxOffset] = Math.max(7, Math.floor(r * 0.6));
        rawData[pxOffset + 1] = Math.max(9, Math.floor(g * 0.6));
        rawData[pxOffset + 2] = Math.max(15, Math.floor(b * 0.6));
      }
    }
  }

  const compressedData = zlib.deflateSync(rawData);
  const idatChunk = createChunk('IDAT', compressedData);
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function createChunk(type, data) {
  const length = data.length;
  const chunk = Buffer.alloc(8 + length + 4);
  chunk.writeUInt32BE(length, 0);
  chunk.write(type, 4, 4, 'ascii');
  data.copy(chunk, 8);
  const crc = crc32(chunk.subarray(4, 8 + length));
  chunk.writeUInt32BE(crc >>> 0, 8 + length);
  return chunk;
}

// Standard CRC32 table
const crcTable = [];
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return crc ^ 0xffffffff;
}

// Generate PNGs: 192x192, 512x512, maskable, apple touch icon
const png192 = createSolidPNG(192, 192, 26, 32, 56);
const png512 = createSolidPNG(512, 512, 26, 32, 56);

fs.writeFileSync(path.join(iconsDir, 'icon-192.png'), png192);
fs.writeFileSync(path.join(iconsDir, 'icon-512.png'), png512);
fs.writeFileSync(path.join(iconsDir, 'icon-maskable.png'), png512);
fs.writeFileSync(path.join(iconsDir, 'apple-touch-icon.png'), png192);
fs.writeFileSync(path.join(__dirname, '..', 'public', 'favicon.ico'), png192);

console.log('Successfully generated PWA icons in public/icons/');
