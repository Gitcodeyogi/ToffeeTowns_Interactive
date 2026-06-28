const fs = require('fs');
const content = fs.readFileSync('src/components/desk/GG_TravellerDeck_NewsPaper.tsx', 'utf8');
const lines = content.split('\n');

lines.forEach((line, idx) => {
  if (line.includes('localStorage') || line.includes('complete') || line.includes('submit') || line.includes('addCoins') || line.includes('addLegacy')) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
  }
});
