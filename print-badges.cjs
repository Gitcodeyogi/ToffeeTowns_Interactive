const fs = require('fs');

const contents = [
  'src/constants/index.ts',
  'src/pages/BadgesPage.tsx'
];

contents.forEach(f => {
  if (fs.existsSync(f)) {
    console.log(`=== ${f} ===`);
    const content = fs.readFileSync(f, 'utf8');
    const lines = content.split('\n');
    lines.forEach(l => {
      if (l.includes('id:') && (l.includes('name:') || l.includes('title:'))) {
        console.log(l.trim());
      }
    });
  }
});
