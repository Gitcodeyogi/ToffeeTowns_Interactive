const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/pages/TravellersDesk.tsx');
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.replace(/\r\n/g, '\n').split('\n');

// Let's analyze JSX tags between line 1315 and 2306
const subLines = lines.slice(1314, 2305);

let tagStack = [];

const regex = /<(\/?[a-zA-Z0-9_]+)(?:\s+[^>]*?)?>/g;

subLines.forEach((line, idx) => {
  const lineNum = idx + 1315;
  let match;
  // Simple regex tag finder (ignoring self-closing tags and comments)
  const cleanLine = line.replace(/\{\/\*.*?\*\/\}/g, '').replace(/<[a-zA-Z0-9_]+\s+[^>]*?\/>/g, '');
  
  const tagRegex = /<(\/?[a-zA-Z0-9_]+)(?:\s+[^>]*?)?>/g;
  while ((match = tagRegex.exec(cleanLine)) !== null) {
    const tagName = match[1];
    
    // Ignore self-closing tags check
    if (match[0].endsWith('/>')) continue;
    
    if (tagName.startsWith('/')) {
      const closingName = tagName.slice(1);
      if (tagStack.length === 0) {
        console.log(`Warning: Unmatched closing tag </${closingName}> at line ${lineNum}`);
      } else {
        const last = tagStack.pop();
        if (last.name !== closingName) {
          console.log(`Mismatched tag: Opened <${last.name}> at line ${last.lineNum}, but closed with </${closingName}> at line ${lineNum}`);
        }
      }
    } else {
      // It's an opening tag
      tagStack.push({ name: tagName, lineNum });
    }
  }
});

console.log('Finished tag scan.');
if (tagStack.length > 0) {
  console.log('Remaining open tags:');
  tagStack.forEach(t => console.log(`  <${t.name}> opened at line ${t.lineNum}`));
} else {
  console.log('All JSX tags balanced in this sub-block!');
}
