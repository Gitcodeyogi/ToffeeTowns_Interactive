const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const imgPath = path.join(__dirname, '../public/Assets/Ganache Grove/Canal_Series1/Image_01.png');

if (!fs.existsSync(imgPath)) {
  console.error('File does not exist:', imgPath);
  process.exit(1);
}

const buffer = fs.readFileSync(imgPath);

// Parse PNG chunks
let pos = 8; // skip signature
let idatBuffers = [];
let colorType = 0;
let bitDepth = 0;
let width = 0;
let height = 0;

while (pos < buffer.length) {
  const length = buffer.readUInt32BE(pos);
  const type = buffer.toString('ascii', pos + 4, pos + 8);
  const data = buffer.slice(pos + 8, pos + 8 + length);
  
  if (type === 'IHDR') {
    width = data.readUInt32BE(0);
    height = data.readUInt32BE(4);
    bitDepth = data[8];
    colorType = data[9];
    console.log(`IHDR: ${width}x${height}, bitDepth=${bitDepth}, colorType=${colorType}`);
  } else if (type === 'IDAT') {
    idatBuffers.push(data);
  } else if (type === 'IEND') {
    break;
  }
  
  pos += 12 + length;
}

const idatBuffer = Buffer.concat(idatBuffers);
const decompressed = zlib.inflateSync(idatBuffer);

// Check if it's RGBA (6) or RGB (2) with 8 bits
if ((colorType === 2 || colorType === 6) && bitDepth === 8) {
  const bytesPerPixel = colorType === 6 ? 4 : 3;
  const scanlineLength = 1 + width * bytesPerPixel;
  
  // Let's check the first 50 pixels of the middle row
  const midRow = Math.floor(height / 2);
  const rowStart = midRow * scanlineLength;
  const filter = decompressed[rowStart];
  
  console.log(`Middle row (${midRow}) filter: ${filter}`);
  
  // Let's check first 10 pixels of this row (assuming filter 0 for simplicity, or we can just print the raw bytes)
  console.log('First 10 pixel RGB bytes in middle row:');
  for (let x = 0; x < 10; x++) {
    const idx = rowStart + 1 + x * bytesPerPixel;
    const r = decompressed[idx];
    const g = decompressed[idx + 1];
    const b = decompressed[idx + 2];
    console.log(`  Pixel ${x}: RGB(${r}, ${g}, ${b})`);
  }
} else {
  console.log('Unsupported colorType or bitDepth for simple parsing');
}
