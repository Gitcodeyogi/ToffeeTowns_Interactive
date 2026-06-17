const fs = require('fs');
const path = require('path');

const filePaths = [
  'src/components/desk/GG_TravellerDeck_NewsPaper.tsx',
  'src/components/desk/GG_TravellerDeck_Places.tsx',
  'src/pages/TravellersDesk.tsx',
  'src/data/newspaper_rotation.ts',
  'src/data/towns/ganache-grove/problems.ts',
  'src/data/towns/ganache-grove/health.ts',
  'src/data/towns/ganache-grove/gossip.ts'
];

const replacements = [
  { from: /Dr\.\s*Lavender\s*Sweetbloom/g, to: 'Dr. Cedric Oakenhart' },
  { from: /Dr\.\s*Lavender/g, to: 'Dr. Cedric' },
  { from: /Lavender Clinic/g, to: 'Oakenhart Clinic' },
  { from: /Mayor\s*Maple\s*Truffle/g, to: 'Sir Goldwhistle' },
  { from: /Mayor\s*Maple/g, to: 'Sir Goldwhistle' },
  { from: /Maple Truffle/g, to: 'Sir Goldwhistle' },
  { from: /Boss\s*Builder\s*Brom/g, to: 'Blacksmith Crumblewise' },
  { from: /Builder Brom/g, to: 'Blacksmith Crumblewise' },
  { from: /Brom/g, to: 'Crumblewise' },
  { from: /Rebel\s*Ranger\s*Lyra/g, to: 'Mrs. Petalworth' },
  { from: /Ranger Lyra/g, to: 'Mrs. Petalworth' },
  { from: /Lyra/g, to: 'Mrs. Petalworth' },
  { from: /Elder Pecan/g, to: 'Baker Bramble Mortimer' }
];

filePaths.forEach(relPath => {
  const absPath = path.resolve(relPath);
  if (!fs.existsSync(absPath)) {
    console.log(`Skipping: ${relPath} (does not exist)`);
    return;
  }
  let content = fs.readFileSync(absPath, 'utf8');
  let original = content;
  replacements.forEach(rep => {
    content = content.replace(rep.from, rep.to);
  });
  if (content !== original) {
    fs.writeFileSync(absPath, content, 'utf8');
    console.log(`Updated: ${relPath}`);
  } else {
    console.log(`No changes needed: ${relPath}`);
  }
});
console.log('Town cast replacement complete!');
