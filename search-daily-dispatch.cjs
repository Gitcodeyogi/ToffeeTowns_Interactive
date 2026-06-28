const fs = require('fs');
const content = fs.readFileSync('src/components/desk/GG_TravellerDeck_Home.tsx', 'utf8');
const lines = content.split('\n');

lines.forEach((line, idx) => {
  if (line.includes('showDailyDispatch') || line.includes('DailyDispatch')) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
  }
});
