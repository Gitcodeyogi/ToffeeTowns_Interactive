const { execSync } = require('child_process');
try {
  const diff = execSync('git diff src/components/desk/GG_TravellerDeck_Home.tsx', { encoding: 'utf8' });
  const lines = diff.split('\n');
  console.log('Total diff lines:', lines.length);
  // print first 50 lines of diff
  console.log(lines.slice(0, 50).join('\n'));
} catch (err) {
  console.error(err);
}
