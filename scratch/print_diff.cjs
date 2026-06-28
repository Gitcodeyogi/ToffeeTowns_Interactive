const { execSync } = require('child_process');

try {
  const diff = execSync('git diff src/components/desk/GG_TravellerDeck_Home.tsx', { encoding: 'utf8' });
  const lines = diff.split('\n');
  
  console.log("=== Git Diff Highlights ===");
  let printing = false;
  let count = 0;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith('@@')) {
      printing = true;
      count = 0;
      console.log(line);
      continue;
    }
    if (printing) {
      if (line.startsWith('+') || line.startsWith('-')) {
        console.log(`${i}: ${line}`);
        count = 0;
      } else {
        count++;
        if (count > 5) {
          printing = false;
        } else {
          console.log(`${i}: ${line}`);
        }
      }
    }
  }
} catch (e) {
  console.error(e);
}
