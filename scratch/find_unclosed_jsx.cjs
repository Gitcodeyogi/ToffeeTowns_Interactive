const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, '../src/components/desk/GG_TravellerDeck_Home.tsx');
const content = fs.readFileSync(filePath, 'utf8');

const lines = content.split('\n');
let tagStack = [];

// Simple tag parsing using regex
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  // Match both opening/closing tags or comments
  const matches = line.matchAll(/<\/?([a-zA-Z0-9_]+)(?:\s+[^>]*?)?>/g);
  for (const match of matches) {
    const fullTag = match[0];
    const tagName = match[1];
    
    // Ignore self-closing tags
    if (fullTag.endsWith('/>')) {
      continue;
    }
    
    if (fullTag.startsWith('</')) {
      // Closing tag
      if (tagStack.length > 0) {
        const top = tagStack[tagStack.length - 1];
        if (top.name === tagName) {
          tagStack.pop();
        } else {
          console.log(`Mismatch on line ${i + 1}: found closing tag </${tagName}>, but expected </${top.name}> (opened on line ${top.line})`);
        }
      } else {
        console.log(`Mismatch on line ${i + 1}: found closing tag </${tagName}> with empty stack`);
      }
    } else {
      // Opening tag (excluding self-closing checked before)
      tagStack.push({ name: tagName, line: i + 1 });
    }
  }
}

console.log("Remaining tags in stack at end of file:");
console.log(tagStack);
