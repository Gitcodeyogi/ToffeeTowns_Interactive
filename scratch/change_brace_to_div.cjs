const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/pages/TravellersDesk.tsx');
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace(/\r\n/g, '\n');
const lines = content.split('\n');

console.log('Line 2283 before change:', lines[2282]);

// Change line 2283 (index 2282) from '                        )}' to '                        </div>'
lines[2282] = '                        </div>';

console.log('Line 2283 after change:', lines[2282]);

fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
console.log('Saved TravellersDesk.tsx successfully!');
