const { execSync } = require('child_process');
try {
  const content = execSync('git show HEAD:src/components/desk/GG_TravellerDeck_Home.tsx', { encoding: 'utf8' });
  const lines = content.split('\n');
  console.log('Committed lines:', lines.length);
  console.log('First 20 lines of committed version:');
  console.log(lines.slice(0, 20).join('\n'));
} catch (err) {
  console.error(err);
}
