const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/pages/TravellersDesk.tsx');
let content = fs.readFileSync(filePath, 'utf8');

const lines = content.replace(/\r\n/g, '\n').split('\n');
const newLines = [...lines];
newLines.splice(2280, 3); // removes lines 2281, 2282, 2283

const testContent = newLines.join('\n');

let stack = [];
let inComment = false;
let inString = null;

const testLines = testContent.split('\n');
for (let lineIdx = 0; lineIdx < testLines.length; lineIdx++) {
  const line = testLines[lineIdx];
  const lineNum = lineIdx + 1;
  
  for (let colIdx = 0; colIdx < line.length; colIdx++) {
    const char = line[colIdx];
    const prev = colIdx > 0 ? line[colIdx - 1] : '';
    const next = colIdx < line.length - 1 ? line[colIdx + 1] : '';
    
    if (inString) {
      if (char === inString && prev !== '\\') {
        inString = null;
      }
      continue;
    }
    
    if (inComment) {
      if (char === '*' && next === '/') {
        inComment = false;
        colIdx++;
      }
      continue;
    }
    if (char === '/' && next === '*') {
      inComment = true;
      colIdx++;
      continue;
    }
    if (char === '/' && next === '/') {
      break;
    }
    
    if (char === "'" || char === '"' || char === '`') {
      inString = char;
      continue;
    }
    
    if (char === '(' || char === '{' || char === '[') {
      stack.push({ char, lineNum, col: colIdx + 1 });
    } else if (char === ')' || char === '}' || char === ']') {
      const match = { ')': '(', '}': '{', ']': '[' }[char];
      if (stack.length === 0) {
        console.error(`Error: Unmatched closing ${char} at line ${lineNum}:${colIdx + 1}`);
      } else {
        const last = stack.pop();
        if (last.char !== match) {
          console.error(`Mismatched bracket: Opened ${last.char} at line ${last.lineNum}:${last.col}, but closed with ${char} at line ${lineNum}:${colIdx + 1}`);
        }
      }
    }
  }
}

console.log('Finished scan.');
console.log('Remaining open brackets in stack:');
stack.forEach(item => {
  console.log(`  ${item.char} opened at line ${item.lineNum}:${item.col}`);
});
