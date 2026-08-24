// Simple script to generate valid PNG icon files without external native dependencies
// Using pure zlib/png encoding in Node.js
import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

function createPNG(width, height, drawFn) {
  // RGBA buffer
  const rowSize = width * 4;
  const rawData = Buffer.alloc((rowSize + 1) * height);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * (rowSize + 1);
    rawData[rowOffset] = 0; // Filter type: None
    for (let x = 0; x < width; x++) {
      const pixelOffset = rowOffset + 1 + x * 4;
      const [r, g, b, a] = drawFn(x / width, y / height, x, y);
      rawData[pixelOffset] = r;
      rawData[pixelOffset + 1] = g;
      rawData[pixelOffset + 2] = b;
      rawData[pixelOffset + 3] = a;
    }
  }

  const deflated = zlib.deflateSync(rawData);

  // PNG Header
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // Bit depth
  ihdr[9] = 6; // Color type: RGBA
  ihdr[10] = 0; // Compression method
  ihdr[11] = 0; // Filter method
  ihdr[12] = 0; // Interlace method

  const ihdrChunk = makeChunk('IHDR', ihdr);
  const idatChunk = makeChunk('IDAT', deflated);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function makeChunk(type, data) {
  const len = data.length;
  const buf = Buffer.alloc(8 + len + 4);
  buf.writeUInt32BE(len, 0);
  buf.write(type, 4, 4, 'ascii');
  data.copy(buf, 8);

  const crcData = Buffer.alloc(4 + len);
  buf.copy(crcData, 0, 4, 8 + len);
  const crc = crc32(crcData);
  buf.writeUInt32BE(crc >>> 0, 8 + len);

  return buf;
}

// CRC32 implementation for PNG chunks
const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    if (c & 1) c = 0xedb88320 ^ (c >>> 1);
    else c = c >>> 1;
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

// Draw Sudoku Icon: Dark obsidian background (#121212), 3x3 grid (#334155), indigo focus (#6366f1)
function drawSudokuIcon(u, v) {
  // Distance from center for rounded corner check
  const margin = 0.08;
  const cornerRadius = 0.22;

  // Background
  const inGrid = u >= 0.18 && u <= 0.82 && v >= 0.18 && v <= 0.82;
  const inCenterCell = u >= 0.39 && u <= 0.61 && v >= 0.39 && v <= 0.61;

  // Lines
  const isLineV1 = Math.abs(u - 0.39) < 0.015 && v >= 0.18 && v <= 0.82;
  const isLineV2 = Math.abs(u - 0.61) < 0.015 && v >= 0.18 && v <= 0.82;
  const isLineH1 = Math.abs(v - 0.39) < 0.015 && u >= 0.18 && u <= 0.82;
  const isLineH2 = Math.abs(v - 0.61) < 0.015 && u >= 0.18 && u <= 0.82;

  const isBorder = inGrid && (u < 0.195 || u > 0.805 || v < 0.195 || v > 0.805);

  if (isLineV1 || isLineV2 || isLineH1 || isLineH2 || isBorder) {
    return [71, 85, 105, 255]; // #475569
  }

  if (inCenterCell) {
    // Glowing Indigo Center Cell (#4f46e5 to #6366f1)
    return [79, 70, 229, 255];
  }

  if (inGrid) {
    return [24, 24, 27, 255]; // #18181b
  }

  // Base background
  return [18, 18, 18, 255]; // #121212
}

const iconsDir = path.resolve('public/icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Generate 192x192
const icon192 = createPNG(192, 192, drawSudokuIcon);
fs.writeFileSync(path.join(iconsDir, 'icon-192.png'), icon192);

// Generate 512x512
const icon512 = createPNG(512, 512, drawSudokuIcon);
fs.writeFileSync(path.join(iconsDir, 'icon-512.png'), icon512);
fs.writeFileSync(path.join(iconsDir, 'icon-maskable-512.png'), icon512);
fs.writeFileSync(path.join(iconsDir, 'apple-touch-icon.png'), icon192);
fs.writeFileSync(path.resolve('public/apple-touch-icon.png'), icon192);

console.log('Successfully generated PWA PNG icons in public/icons/');
