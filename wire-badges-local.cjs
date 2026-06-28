const fs = require('fs');

const targetPath = 'src/pages/TravellersDesk.tsx';
let content = fs.readFileSync(targetPath, 'utf8').replace(/\r\n/g, '\n');

// 1. Add imports at the top
const importSearch = "import { CANAL_SERIES, getActiveCanalStep } from '../data/series/series1_canal';";
const importIndex = content.indexOf(importSearch);

if (importIndex === -1) {
  console.error("Could not find series1_canal import line!");
  process.exit(1);
}

const insertPos = importIndex + importSearch.length;
const newImports = `
import BadgeUnlockedModal from '../components/BadgeUnlockedModal';
import { BADGES } from '../constants';
`;

content = content.substring(0, insertPos) + newImports + content.substring(insertPos);

// 2. Destructure earnedBadges from useTTStore
const destructureSearch = "checkEncounter,\n    addSkillXP,\n    completeActionDirect,";
const destructureIndex = content.indexOf(destructureSearch);

if (destructureIndex === -1) {
  console.error("Could not find destructuring block!");
  process.exit(1);
}

const destructureInsertPos = destructureIndex + destructureSearch.length;
content = content.substring(0, destructureInsertPos) + `\n    earnedBadges,` + content.substring(destructureInsertPos);

// 3. Add states and useEffect after setSubPage state
const stateSearch = "const [subPage, setSubPage] = useState<SubPage>('home');";
const stateIndex = content.indexOf(stateSearch);

if (stateIndex === -1) {
  console.error("Could not find subPage state line!");
  process.exit(1);
}

const stateInsertPos = stateIndex + stateSearch.length;
const newStates = `
  const [prevBadgesCount, setPrevBadgesCount] = useState<number>(() => earnedBadges.length);
  const [activeBadgeModal, setActiveBadgeModal] = useState<{
    badgeTitle: string;
    badgeIcon?: string;
    missionName: string;
    xpGained: number;
    legacyGained: number;
  } | null>(null);

  useEffect(() => {
    if (earnedBadges.length > prevBadgesCount) {
      const lastBadgeId = earnedBadges[earnedBadges.length - 1];
      const badgeDetails = BADGES.find(b => b.id === lastBadgeId);
      if (badgeDetails) {
        setActiveBadgeModal({
          badgeTitle: badgeDetails.name,
          badgeIcon: badgeDetails.icon,
          missionName: badgeDetails.requirement || badgeDetails.description,
          xpGained: badgeDetails.level * 15,
          legacyGained: badgeDetails.level * 10
        });
      }
      setPrevBadgesCount(earnedBadges.length);
    } else if (earnedBadges.length < prevBadgesCount) {
      setPrevBadgesCount(earnedBadges.length);
    }
  }, [earnedBadges, prevBadgesCount]);
`;

content = content.substring(0, stateInsertPos) + newStates + content.substring(stateInsertPos);

// 4. Render BadgeUnlockedModal at the bottom of the return statement
const renderSearch = "setInventory={setInventory}\n          />\n        </div>\n      )}";
const renderIndex = content.indexOf(renderSearch);

if (renderIndex === -1) {
  console.error("Could not find TownTalkModal render section!");
  process.exit(1);
}

const renderInsertPos = renderIndex + renderSearch.length;
const modalRender = `
      {activeBadgeModal && (
        <BadgeUnlockedModal
          badgeTitle={activeBadgeModal.badgeTitle}
          badgeIcon={activeBadgeModal.badgeIcon}
          missionName={activeBadgeModal.missionName}
          xpGained={activeBadgeModal.xpGained}
          legacyGained={activeBadgeModal.legacyGained}
          onClose={() => setActiveBadgeModal(null)}
        />
      )}
`;

content = content.substring(0, renderInsertPos) + modalRender + content.substring(renderInsertPos);

fs.writeFileSync(targetPath, content.replace(/\n/g, '\r\n'), 'utf8');
console.log("Successfully connected BadgeUnlockedModal to TravellersDesk.tsx!");
