const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/pages/TravellersDesk.tsx');
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace(/\r\n/g, '\n');
const lines = content.split('\n');

console.log('--- BEFORE ---');
for (let i = 2278; i < 2285; i++) {
  console.log((i+1) + ': ' + lines[i]);
}

// Replace lines[2280] to lines[2282] (indices 2280 to 2282)
// which are currently:
// 2281:                             )}
// 2282:                           </div>
// 2283:                         </div>
// with the correct six lines:
// 2281:                             )}
// 2282:                           </div>
// 2283:                         )}
// 2284:                       </div>
// 2285:                     </div>

const linesBefore = lines.slice(0, 2280);
const linesAfter = lines.slice(2283);

const correctInsert = [
  '                            )}',
  '                          </div>',
  '                        )}',
  '                      </div>',
  '                    </div>'
];

const newLines = [...linesBefore, ...correctInsert, ...linesAfter];

console.log('--- AFTER ---');
for (let i = 2278; i < 2288; i++) {
  console.log((i+1) + ': ' + newLines[i]);
}

fs.writeFileSync(filePath, newLines.join('\n'), 'utf8');
console.log('Saved TravellersDesk.tsx successfully!');
