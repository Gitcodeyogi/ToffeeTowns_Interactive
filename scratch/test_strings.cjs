const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/pages/TravellersDesk.tsx');
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.replace(/\r\n/g, '\n').split('\n');

let inString = null;
let inComment = false;

for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
  const line = lines[lineIdx];
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
    }
  }
  
  // If we end a line with an unclosed string, check if it's template literal (backtick)
  // standard strings shouldn't cross lines in TS unless escaped, but template literals can
  if (inString && inString !== '`') {
    console.log(`Line ${lineNum} ends with unclosed standard string literal of type ${inString}`);
    // Reset it so we don't pollute subsequent lines
    inString = null;
  }
}
