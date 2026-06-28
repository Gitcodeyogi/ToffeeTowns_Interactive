const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, '../src/components/desk/GG_TravellerDeck_Home.tsx');
let content = fs.readFileSync(filePath, 'utf8');
let lines = content.split(/\r?\n/);

// 1. Add imports at the top
let hasHomeBox2 = false;
for (const line of lines) {
  if (line.includes('HomeBox2_Census')) hasHomeBox2 = true;
}
if (!hasHomeBox2) {
  const insertIndex = lines.findIndex(l => l.includes("import React"));
  lines.splice(insertIndex + 1, 0,
    "import HomeBox2_Census from './home/HomeBox2_Census';",
    "import HomeBox3_Chronicles from './home/HomeBox3_Chronicles';",
    "import HomeBox4_Ledger from './home/HomeBox4_Ledger';",
    "import HomeBox5_Orientation from './home/HomeBox5_Orientation';"
  );
}

// 2. Remove getChocolateDate from imports if present
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('getChocolateDate')) {
    lines[i] = lines[i].replace('getChocolateDate,', '');
  }
}

// 3. Find interface GG_TravellerDeck_HomeProps and append openTownTalk
let interfaceStartIndex = lines.findIndex(l => l.includes('interface GG_TravellerDeck_HomeProps'));
if (interfaceStartIndex !== -1) {
  let interfaceEndIndex = -1;
  for (let i = interfaceStartIndex; i < lines.length; i++) {
    if (lines[i].trim() === '}') {
      interfaceEndIndex = i;
      break;
    }
  }
  if (interfaceEndIndex !== -1) {
    const hasOpenTownTalk = lines.slice(interfaceStartIndex, interfaceEndIndex).some(l => l.includes('openTownTalk'));
    if (!hasOpenTownTalk) {
      lines.splice(interfaceEndIndex, 0, '  openTownTalk?: (charId: string) => void;');
    }
  }
}

// 4. Find export const GG_TravellerDeck_Home and destructure openTownTalk
let compIndex = lines.findIndex(l => l.includes('export const GG_TravellerDeck_Home'));
if (compIndex !== -1) {
  let endParamIndex = -1;
  for (let i = compIndex; i < lines.length; i++) {
    if (lines[i].includes('}) => {')) {
      endParamIndex = i;
      break;
    }
  }
  if (endParamIndex !== -1) {
    const hasOpenTownTalkDestructure = lines.slice(compIndex, endParamIndex + 1).some(l => l.includes('openTownTalk'));
    if (!hasOpenTownTalkDestructure) {
      lines.splice(endParamIndex, 0, '  openTownTalk,');
    }
  }
}

fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
console.log('Successfully ran line-based fix!');
