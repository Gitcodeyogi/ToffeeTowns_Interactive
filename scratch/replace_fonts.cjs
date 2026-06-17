const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      walkDir(dirPath, callback);
    } else {
      callback(dirPath);
    }
  });
}

const targetDir = 'c:/Yogesh Universe/TOFFEETOWNS_FUN/src';

walkDir(targetDir, filePath => {
  if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts')) return;
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // Replace 'Stay Funky' font families with Josefin Sans
  content = content.replace(/fontFamily:\s*['"]Stay Funky['"]/g, 'fontFamily: \'"Josefin Sans", sans-serif\'');
  
  // Replace class font-funky with font-sans
  content = content.replace(/\bfont-funky\b/g, 'font-sans');

  // Replace FONT on non-heading tags
  content = content.replace(
    /(fontFamily:\s*['"]"Luckiest Guy",\s*cursive['"])/g,
    (match, p1, offset, fullText) => {
      if (typeof offset !== 'number') {
        // signature is (match, offset, fullText) when there is no capture group
        fullText = offset;
        offset = p1;
      }
      const prefix = fullText.slice(Math.max(0, offset - 150), offset);
      const lastTagOpen = prefix.lastIndexOf('<');
      if (lastTagOpen !== -1) {
        const tagPart = prefix.slice(lastTagOpen + 1);
        const tagMatch = tagPart.match(/^([a-zA-Z0-9]+)/);
        if (tagMatch) {
          const tagName = tagMatch[1].toLowerCase();
          if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tagName)) {
            return match; // Keep for headings
          }
        }
      }
      return 'fontFamily: \'"Josefin Sans", sans-serif\'';
    }
  );

  content = content.replace(
    /(fontFamily:\s*FONT)/g,
    (match, p1, offset, fullText) => {
      if (typeof offset !== 'number') {
        fullText = offset;
        offset = p1;
      }
      const prefix = fullText.slice(Math.max(0, offset - 150), offset);
      const lastTagOpen = prefix.lastIndexOf('<');
      if (lastTagOpen !== -1) {
        const tagPart = prefix.slice(lastTagOpen + 1);
        const tagMatch = tagPart.match(/^([a-zA-Z0-9]+)/);
        if (tagMatch) {
          const tagName = tagMatch[1].toLowerCase();
          if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tagName)) {
            return match; // Keep for headings
          }
        }
      }
      return 'fontFamily: \'"Josefin Sans", sans-serif\'';
    }
  );

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated fonts in: ${filePath}`);
  }
});
