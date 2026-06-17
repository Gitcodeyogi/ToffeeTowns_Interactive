const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/pages/TravellersDesk.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Convert content to unified LF for matching
content = content.replace(/\r\n/g, '\n');
const lines = content.split('\n');

// Let's print the current lines around line 2280
console.log('--- BEFORE FIX ---');
for (let i = 2277; i < 2286; i++) {
  console.log((i+1) + ': ' + lines[i]);
}

// We want to replace lines[2280], lines[2281], lines[2282] (indices 2280, 2281, 2282)
// which are currently:
// 2281: 
// 2282:                       </div>
// 2283:                     </div>
// with the correct closing tags:
//                             )}
//                           </div>
//                         )}

lines[2280] = '                            )}';
lines[2281] = '                          </div>';
lines[2282] = '                        )}';

console.log('--- AFTER FIX ---');
for (let i = 2277; i < 2286; i++) {
  console.log((i+1) + ': ' + lines[i]);
}

fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
console.log('Saved TravellersDesk.tsx successfully!');
