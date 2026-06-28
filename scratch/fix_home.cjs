const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/components/desk/GG_TravellerDeck_Home.tsx');
let content = fs.readFileSync(filePath, 'utf8');

const replacements = [
  {
    search: "import {\n  FONT,\n  TOWN_DETAILS,\n  HOME_ROOMS,\n  HOME_NAV_ITEMS,\n  getChocolateDate,\n  getProvincialStanding,\n  getBuilderStanding,\n  getExplorerStanding,\n  getHealerStanding,\n  TRANSPORT_SPEEDS,\n} from '../../pages/TravellersDesk';",
    replace: "import {\n  FONT,\n  TOWN_DETAILS,\n  HOME_ROOMS,\n  HOME_NAV_ITEMS,\n  getProvincialStanding,\n  getBuilderStanding,\n  getExplorerStanding,\n  getHealerStanding,\n  TRANSPORT_SPEEDS,\n} from '../../pages/TravellersDesk';\nimport HomeBox2_Census from './home/HomeBox2_Census';\nimport HomeBox3_Chronicles from './home/HomeBox3_Chronicles';\nimport HomeBox4_Ledger from './home/HomeBox4_Ledger';\nimport HomeBox5_Orientation from './home/HomeBox5_Orientation';"
  },
  {
    search: "interface GG_TravellerDeck_HomeProps {\n  setSubPage: (page: SubPage) => void;\n  pushPage: (page: SubPage) => void;\n  popPage: () => void;\n  inventory: Record<string, number>;\n  setInventory: React.Dispatch<React.SetStateAction<Record<string, number>>>;\n  setShowDossierPlaycard: (show: boolean) => void;\n  setShowTownHallModal: (show: boolean) => void;\n  dossierRead: boolean;\n  triggerFeedback: (msg: string) => void;\n  setShowFlashNewsModal?: (show: boolean) => void;\n  activePuzzleChore: any;\n  setActivePuzzleChore: React.Dispatch<React.SetStateAction<any>>;\n}",
    replace: "interface GG_TravellerDeck_HomeProps {\n  setSubPage: (page: SubPage) => void;\n  pushPage: (page: SubPage) => void;\n  popPage: () => void;\n  inventory: Record<string, number>;\n  setInventory: React.Dispatch<React.SetStateAction<Record<string, number>>>;\n  setShowDossierPlaycard: (show: boolean) => void;\n  setShowTownHallModal: (show: boolean) => void;\n  dossierRead: boolean;\n  triggerFeedback: (msg: string) => void;\n  setShowFlashNewsModal?: (show: boolean) => void;\n  activePuzzleChore: any;\n  setActivePuzzleChore: React.Dispatch<React.SetStateAction<any>>;\n  openTownTalk: (charId: string) => void;\n}"
  },
  {
    search: "const SHADOW_SLIDER_CSS = `",
    replace: "const _SHADOW_SLIDER_CSS = `"
  },
  {
    search: "export const GG_TravellerDeck_Home: React.FC<GG_TravellerDeck_HomeProps> = ({\n  setSubPage,\n  pushPage,\n  inventory,\n  setInventory,\n  setShowDossierPlaycard,\n  setShowTownHallModal,\n  dossierRead,\n  triggerFeedback,\n  setShowFlashNewsModal,\n  setActivePuzzleChore,\n}) => {",
    replace: "export const GG_TravellerDeck_Home: React.FC<GG_TravellerDeck_HomeProps> = ({\n  setSubPage,\n  pushPage,\n  inventory,\n  setInventory,\n  setShowDossierPlaycard: _setShowDossierPlaycard,\n  setShowTownHallModal,\n  dossierRead,\n  triggerFeedback,\n  setShowFlashNewsModal,\n  setActivePuzzleChore,\n}) => {"
  },
  {
    search: "    ownedDecorations,\n    equippedDecorations,\n    ownedPets,\n    equippedPet,\n    activeTransport,\n    addToQueue,\n    taskQueue,\n    addSkillXP,\n  } = useTTStore();",
    replace: "    equippedDecorations,\n    equippedPet,\n    activeTransport,\n    addToQueue,\n    taskQueue,\n    addSkillXP,\n  } = useTTStore();"
  },
  {
    search: "  const [activeRoom, setActiveRoom] = useState<string>('exterior');\n  const [activeRoomPopup, setActiveRoomPopup] = useState<string | null>(null);",
    replace: "  const [activeRoom, setActiveRoom] = useState<string>('exterior');"
  },
  {
    search: "  const selectedCamp = campaignPool[Math.floor(rand() * campaignPool.length)] || GanacheGroveTownData.problems[2];\n\n  const dailyActivities = [selectedProj, selectedMyst, selectedCamp];\n\n  const handleExecuteMatter = (id: string) => {",
    replace: "  const selectedCamp = campaignPool[Math.floor(rand() * campaignPool.length)] || GanacheGroveTownData.problems[2];\n\n  const handleExecuteMatter = (id: string) => {"
  }
];

// Normalize line endings to LF to avoid CRLF mismatch in searches
content = content.replace(/\r\n/g, '\n');

replacements.forEach((rep, i) => {
  const normalizedSearch = rep.search.replace(/\r\n/g, '\n');
  const normalizedReplace = rep.replace.replace(/\r\n/g, '\n');
  if (content.indexOf(normalizedSearch) === -1) {
    console.error('Error: Replacement ' + i + ' search string not found!');
    process.exit(1);
  }
  content = content.replace(normalizedSearch, normalizedReplace);
});

// Also remove acceptItem function
const acceptItemStart = '  const acceptItem = (';
const startIdx = content.indexOf(acceptItemStart);
if (startIdx === -1) {
  console.error('Error: acceptItem start not found!');
  process.exit(1);
}

const endStr = 'setActiveRoomPopup(null);\n  };';
const endIdx = content.indexOf(endStr, startIdx);
if (endIdx === -1) {
  console.error('Error: acceptItem end not found!');
  process.exit(1);
}
const matchLen = endStr.length;

content = content.substring(0, startIdx) + content.substring(endIdx + matchLen);

// Save with native CRLF/LF as matches original platform, or just write it back
fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully applied all fixes to GG_TravellerDeck_Home.tsx!');
