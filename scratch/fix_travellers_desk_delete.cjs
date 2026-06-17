const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/pages/TravellersDesk.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Convert content to unified LF for matching
content = content.replace(/\r\n/g, '\n');
const lines = content.split('\n');

console.log('Line 2281 before deletion:', lines[2280]);
console.log('Line 2282 before deletion:', lines[2281]);
console.log('Line 2283 before deletion:', lines[2282]);

// Deleting lines 2281, 2282, 2283 (indices 2280, 2281, 2282)
lines.splice(2280, 3);

fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
console.log('Successfully deleted the 3 extra lines and saved TravellersDesk.tsx!');
