const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/components/desk/GG_TravellerDeck_Home.tsx');
let content = fs.readFileSync(filePath, 'utf8');

const startMarker = '{/* ── DAILY DISPATCH POPUP ── */}';
const endMarker = '{/* Bottom Info bar */}';

const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker);

if (startIndex === -1 || endIndex === -1 || endIndex < startIndex) {
  console.error("Could not find markers!");
  console.log("startIndex:", startIndex, "endIndex:", endIndex);
  process.exit(1);
}

const before = content.substring(0, startIndex);
const after = content.substring(endIndex);

fs.writeFileSync(filePath, before + after, 'utf8');
console.log("Successfully removed modals!");
