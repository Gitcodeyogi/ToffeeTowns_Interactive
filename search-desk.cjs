const fs = require('fs');
const content = fs.readFileSync('src/pages/TravellersDesk.tsx', 'utf8');
const lines = content.split('\n');

function findText(text) {
  let count = 0;
  lines.forEach((line, idx) => {
    if (line.includes(text)) {
      count++;
      if (count <= 15) {
        console.log(`Line ${idx + 1}: ${line.trim()}`);
      }
    }
  });
  console.log(`Total found for "${text}": ${count}`);
}

findText('useTTStore');
findText('const [');
findText('return (');
