const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/pages/TravellersDesk.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Remove unused modalRef
const modalRefPattern = /const modalRef = React\.useRef<HTMLDivElement>\(null\);\s*/;
if (modalRefPattern.test(content)) {
  console.log('Found and removing modalRef...');
  content = content.replace(modalRefPattern, '');
}

// 2. Add xp, lvl, pct definitions inside the IIFE
const topIIFEPattern = `          const skillEmoji: Record<string,string> = { builder:'🔨', explorer:'🧭', healer:'🌿' };
          const isCompleted = completedSeriesSteps.includes(currentSeriesStep.id);`;

const replacementIIFE = `          const skillEmoji: Record<string,string> = { builder:'🔨', explorer:'🧭', healer:'🌿' };
          const isCompleted = completedSeriesSteps.includes(currentSeriesStep.id);
          const xp = skillXP(topSkill);
          const lvl = Math.floor(xp / 10) + 1;
          const pct = (xp % 10) * 10;`;

content = content.replace(/\r\n/g, '\n');
const topIIFEnormalized = topIIFEPattern.replace(/\r\n/g, '\n');
const replacementIIFEnormalized = replacementIIFE.replace(/\r\n/g, '\n');

if (content.includes(topIIFEnormalized)) {
  console.log('Found IIFE header, adding xp, lvl, pct...');
  content = content.replace(topIIFEnormalized, replacementIIFEnormalized);
} else {
  console.error('Could not find IIFE header pattern!');
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Saved TravellersDesk.tsx successfully!');
