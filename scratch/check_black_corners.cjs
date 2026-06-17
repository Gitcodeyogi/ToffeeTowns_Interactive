const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const imgPath = path.join(__dirname, '../public/Assets/Ganache Grove/Canal_Series1/Image_01.png');
const buffer = fs.readFileSync(imgPath);

let pos = 8;
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
  } else if (type === 'IDAT') {
    idatBuffers.push(data);
  } else if (type === 'IEND') {
    break;
  }
  pos += 12 + length;
}

const idatBuffer = Buffer.concat(idatBuffers);
const decompressed = zlib.inflateSync(idatBuffer);

const bytesPerPixel = colorType === 6 ? 4 : 3;
const scanlineLength = 1 + width * bytesPerPixel;

// Let's defilter the top-left corner (first 50 pixels of row 0 to 50)
// and check if they are black (all R, G, B values < 10)
let prevRow = Buffer.alloc(width * bytesPerPixel);
let currentRow = Buffer.alloc(width * bytesPerPixel);

let cornerIsBlack = true;

for (let r = 0; r < 50; r++) {
  const rowStart = r * scanlineLength;
  const filter = decompressed[rowStart];
  
  for (let c = 0; c < width * bytesPerPixel; c++) {
    const rawByte = decompressed[rowStart + 1 + c];
    const x = c;
    const a = x >= bytesPerPixel ? currentRow[x - bytesPerPixel] : 0;
    const b = prevRow[x];
    const cVal = x >= bytesPerPixel ? prevRow[x - bytesPerPixel] : 0;
    
    let recon = 0;
    if (filter === 0) recon = rawByte;
    else if (filter === 1) recon = rawByte + a;
    else if (filter === 2) recon = rawByte + b;
    else if (filter === 3) recon = rawByte + Math.floor((a + b) / 2);
    else if (filter === 4) {
      const p = a + b - cVal;
      const pa = Math.abs(p - a);
      const pb = Math.abs(p - b);
      const pc = Math.abs(p - cVal);
      let pr = 0;
      if (pa <= pb && pa <= pc) pr = a;
      else if (pb <= pc) pr = b;
      else pr = cVal;
      recon = rawByte + pr;
    }
    currentRow[c] = recon & 0xFF;
  }
  
  // Check first 10 pixels of this row
  for (let x = 0; x < 10; x++) {
    const rVal = currentRow[x * bytesPerPixel];
    const gVal = currentRow[x * bytesPerPixel + 1];
    const bVal = currentRow[x * bytesPerPixel + 2];
    if (rVal > 15 || gVal > 15 || bVal > 15) {
      cornerIsBlack = false;
    }
  }
  prevRow = Buffer.from(currentRow);
}

console.log('Top-left corner is black:', cornerIsBlack);
console.log('Sample top-left pixel (0,0) RGB:', currentRow[0], currentRow[1], currentRow[2]);
