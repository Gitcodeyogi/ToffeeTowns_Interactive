const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/pages/TravellersDesk.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Strip standard JS comments
content = content.replace(/\/\*[\s\S]*?\*\//g, '');
content = content.replace(/\/\/.*$/gm, '');

// Strip string literals to avoid tags in strings
content = content.replace(/'[^']*'/g, "''");
content = content.replace(/"[^"]*"/g, '""');
content = content.replace(/`[^`]*`/g, '``');

const lines = content.replace(/\r\n/g, '\n').split('\n');

let stack = [];

// Match JSX tags
const tagRegex = /<(\/?[a-zA-Z0-9_]+)(?:\s+[^>]*?)?>/g;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const lineNum = i + 1;
  
  let match;
  // We need to be careful with self-closing tags like <img ... /> or <input ... />
  // So let's find tags on the line
  const cleanLine = line.trim();
  
  let pos = 0;
  while (pos < cleanLine.length) {
    const nextTagIdx = cleanLine.indexOf('<', pos);
    if (nextTagIdx === -1) break;
    
    // Find matching '>'
    const closeTagIdx = cleanLine.indexOf('>', nextTagIdx);
    if (closeTagIdx === -1) {
      pos = nextTagIdx + 1;
      continue;
    }
    
    const tagText = cleanLine.substring(nextTagIdx, closeTagIdx + 1);
    pos = closeTagIdx + 1;
    
    // Check if self-closing
    if (tagText.endsWith('/>')) {
      continue;
    }
    
    // Extract tag name
    const nameMatch = tagText.match(/<(\/?[a-zA-Z0-9_:\.]+)/);
    if (!nameMatch) continue;
    
    const name = nameMatch[1];
    
    // Ignore html tags inside JSX style templates or non-JSX entities
    if (name.includes('.') || name.includes(':') || name.startsWith('!') || name === 'h' || name === 'p') {
      // Custom filtering if needed, but let's keep it simple
    }
    
    if (name.startsWith('/')) {
      const closingName = name.slice(1);
      if (stack.length === 0) {
        console.log(`Unmatched closing tag </${closingName}> at line ${lineNum}`);
      } else {
        const last = stack.pop();
        if (last.name !== closingName) {
          console.log(`Mismatched JSX tags: Opened <${last.name}> at line ${last.lineNum}, but closed with </${closingName}> at line ${lineNum}`);
        }
      }
    } else {
      stack.push({ name, lineNum });
    }
  }
}

console.log('Finished tag analysis.');
console.log('Remaining open tags in stack:');
stack.forEach(t => {
  console.log(`  <${t.name}> opened at line ${t.lineNum}`);
});
