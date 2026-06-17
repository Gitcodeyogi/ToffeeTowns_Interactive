const fs = require('fs');
const path = require('path');

const imgPath = path.join(__dirname, '../public/Assets/Ganache Grove/Canal_Series1/Image_01.png');

if (!fs.existsSync(imgPath)) {
  console.error('File does not exist:', imgPath);
  process.exit(1);
}

const buffer = fs.readFileSync(imgPath);

// PNG signature starts at 0, IHDR chunk starts at 12
// IHDR chunk format:
// Width: 4 bytes starting at 16
// Height: 4 bytes starting at 20
const width = buffer.readUInt32BE(16);
const height = buffer.readUInt32BE(20);

console.log('PNG Dimensions:', width, 'x', height);
console.log('Aspect Ratio:', width / height);
