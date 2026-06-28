const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log("Reverting GG_TravellerDeck_Home.tsx...");
execSync('git checkout -- src/components/desk/GG_TravellerDeck_Home.tsx');

const filePath = path.join(__dirname, '../src/components/desk/GG_TravellerDeck_Home.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Insert imports
const importTarget = "import type { SubPage } from '../../pages/TravellersDesk';";
const importReplacement = "import type { SubPage } from '../../pages/TravellersDesk';\nimport HomeBox2_Census from './home/HomeBox2_Census';\nimport HomeBox3_Chronicles from './home/HomeBox3_Chronicles';\nimport HomeBox4_Ledger from './home/HomeBox4_Ledger';\nimport HomeBox5_Orientation from './home/HomeBox5_Orientation';";

if (content.includes(importTarget)) {
  content = content.replace(importTarget, importReplacement);
  console.log("Imports added.");
} else {
  console.error("Import target not found!");
  process.exit(1);
}

const startMarker = '<div className="flex-grow overflow-y-auto custom-scrollbar my-3 space-y-6 pr-1 min-h-0">';
const endMarker = '{/* ── DAILY DISPATCH POPUP ── */}';

const sIdx = content.indexOf(startMarker);
const eIdx = content.indexOf(endMarker);

if (sIdx === -1) {
  console.error("Start marker not found!");
  process.exit(1);
}
if (eIdx === -1) {
  console.error("End marker not found!");
  process.exit(1);
}

const scriptPath = path.join(__dirname, 'replace_boxes.js');
const scriptContent = fs.readFileSync(scriptPath, 'utf8');
const repStartToken = 'const replacement = `';
const repStartIdx = scriptContent.indexOf(repStartToken);

// Find end of replacement string (either \r\n or \n)
let repEndIdx = scriptContent.indexOf('`;\r\n\r\nconst newContent =');
if (repEndIdx === -1) {
  repEndIdx = scriptContent.indexOf('`;\n\nconst newContent =');
}

if (repStartIdx === -1 || repEndIdx === -1) {
  console.error("Failed to parse replace_boxes.js content!");
  process.exit(1);
}

const stringLiteral = scriptContent.substring(repStartIdx + repStartToken.length - 1, repEndIdx + 1);
const replacementText = eval(stringLiteral);

const newContent = content.substring(0, sIdx) + replacementText + content.substring(eIdx);
fs.writeFileSync(filePath, newContent, 'utf8');

console.log("Success! Containerized boxes layout applied to homepage with correct unescaped template literals.");
