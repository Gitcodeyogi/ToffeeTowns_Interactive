const fs = require('fs');

const file = 'c:/Yogesh Universe/TOFFEETOWNS_FUN/src/components/desk/GG_TravellerDeck_Places.tsx';
let content = fs.readFileSync(file, 'utf8');

// We need to add the import statement at the top of the file
const importMarker = "import { TRANSPORT_SPEEDS, getPlayerLevelInfo } from '../../pages/TravellersDesk';";
if (!content.includes("import { DAILY_ROTATION_DATA } from '../../data/newspaper_rotation';")) {
  content = content.replace(importMarker, importMarker + "\nimport { DAILY_ROTATION_DATA } from '../../data/newspaper_rotation';");
}

// Now replace the static OPPORTUNITIES array definition (lines 316-353 approx)
const staticOppStart = 'const OPPORTUNITIES = [';
const staticOppEnd = '];';

const startIndex = content.indexOf(staticOppStart);
if (startIndex !== -1) {
  // Let's find the closing bracket of the OPPORTUNITIES array
  let bracketCount = 1;
  let curIndex = startIndex + staticOppStart.length;
  while (bracketCount > 0 && curIndex < content.length) {
    if (content[curIndex] === '[') bracketCount++;
    if (content[curIndex] === ']') bracketCount--;
    curIndex++;
  }
  
  // We will replace the static array and insert our dynamic list inside the component instead
  // Let's delete the global OPPORTUNITIES array
  const beforeOpp = content.slice(0, startIndex);
  const afterOpp = content.slice(curIndex);
  content = beforeOpp + afterOpp;
}

// Now let's insert the dynamic calculation of opportunitiesList inside the component:
// We can insert it right after the component declaration and hook calls:
// e.g. after:
//   const {
//     activeTransport,
//     addToQueue,
//     skills,
//   } = useTTStore();
const hookCallMarker = '  const {\n    activeTransport,\n    addToQueue,\n    skills,\n  } = useTTStore();';
const targetString = '  const [activeTab, setActiveTab] = useState';

// Let's insert the dayIndex, dayContent, and opportunitiesList calculations
const injection = `
  const dayIndex = (new Date().getDate() % 10) + 1;
  const dayContent = DAILY_ROTATION_DATA.find(d => d.day === dayIndex) || DAILY_ROTATION_DATA[0];

  const opportunitiesList = [
    {
      name: dayContent.activityName,
      rewardText: \`+\${dayContent.activityRewardXP} XP • +\${dayContent.activityRewardCoins} Coins\`,
      place: dayContent.activityPlace,
      dist: 500,
      dur: 10000,
      coins: dayContent.activityRewardCoins,
      xp: dayContent.activityRewardXP,
      cat: dayContent.activitySkill,
      legacy: dayContent.activityRewardLegacy,
      icon: dayContent.activityIcon,
    },
    {
      name: 'Town Hall Meeting',
      rewardText: '+25 XP • +10 Coins',
      place: 'Town Hall',
      dist: 400,
      dur: 8000,
      coins: 10,
      xp: 25,
      cat: 'explorer',
      legacy: 15,
      icon: '🗳️',
    },
    {
      name: 'Forest Survey',
      rewardText: '+40 XP • +15 Coins',
      place: 'Mossberry Park',
      dist: 600,
      dur: 9000,
      coins: 15,
      xp: 40,
      cat: 'explorer',
      legacy: 10,
      icon: '🧭',
    }
  ];
`;

content = content.replace(targetString, injection + "\n  const [activeTab, setActiveTab] = useState");

// Now replace OPPORTUNITIES.map with opportunitiesList.map
content = content.replace(/OPPORTUNITIES\.map/g, 'opportunitiesList.map');

fs.writeFileSync(file, content, 'utf8');
console.log("Successfully updated GG_TravellerDeck_Places.tsx to support dynamic daily events!");
