/**
 * uiConstants.ts
 * ──────────────────────────────────────────────────────────────
 * Single source of truth for all UI-level constants & pure
 * utility functions used across ToffeeTowns.
 *
 * WHY THIS FILE EXISTS
 * Previously these constants lived in `pages/TravellersDesk.tsx`.
 * That caused circular-import chains: child components (modals,
 * desk panels) imported from their parent page, which itself
 * imported those components.  Moving the constants here breaks
 * every cycle cleanly.
 *
 * USAGE
 *   import { FONT, FLASH_NEWS_DATA } from '../lib/uiConstants';
 * ──────────────────────────────────────────────────────────────
 */

import type { TownId } from '../store/useTTStore';

// ── Navigation / Routing ─────────────────────────────────────
export type SubPage =
  | 'home'
  | 'dashboard'
  | 'workshop'
  | 'classroom'
  | 'missions'
  | 'newspaper'
  | 'stampbook'
  | 'shop'
  | 'permits'
  | 'places'
  | 'journal'
  | 'series'
  | 'mini-games'
  | 'theatre'
  | 'transport'
  | 'gossip'
  | 'health'
  | 'politics'
  | 'economy';

// ── Typography ───────────────────────────────────────────────
export const FONT = '"Luckiest Guy", cursive';

// ── Transport speeds (km/h equivalents) ──────────────────────
export const TRANSPORT_SPEEDS: Record<string, number> = {
  'walk': 40,
  'horse-wagon': 80,
  'forest-train': 160,
  'hot-air-balloon': 320,
};

// ── Town Metadata & Addresses ─────────────────────────────────
export interface TownDetails {
  houseNumber: string;
  street: string;
  district: string;
  county: string;
  imageLvl1: string;
  imageLvl2: string;
  imageLvl3: string;
  imageLvl4: string;
}

export const TOWN_DETAILS: Record<TownId, TownDetails> = {
  'ganache-grove': {
    houseNumber: 'Traveller Residence',
    street: 'Mossberry Lane 14',
    district: 'Ganache Grove',
    county: 'Cocoawood County',
    imageLvl1: "/Assets/Ganache%20Grove/Traveller'sHome_GanacheGrovez_Beginner_Exterior.png",
    imageLvl2: "/Assets/Ganache%20Grove/Traveller'sHome_GanacheGrovez_Beginner_Exterior.png",
    imageLvl3: "/Assets/Ganache%20Grove/Traveller'sHome_GanacheGrovez_Beginner_Exterior.png",
    imageLvl4: "/Assets/Ganache%20Grove/Traveller'sHome_GanacheGrovez_Beginner_Exterior.png",
  },
  'toffee-town': {
    houseNumber: 'Terrace House #11',
    street: 'Nutty Canopy Walk',
    district: 'Hazelton Highland Slopes',
    county: 'Nutwood County',
    imageLvl1: '/towns/hometown_lvl1.png',
    imageLvl2: '/towns/hometown_lvl2.png',
    imageLvl3: '/towns/hometown_lvl3.png',
    imageLvl4: '/towns/hometown_lvl4.png',
  },
  'eclair-square': {
    houseNumber: 'Cove Cabin #13',
    street: 'Sticky Surf Beachfront',
    district: 'Golden Salt Tide Shore',
    county: 'Honeywood County',
    imageLvl1: '/towns/hometown_lvl1.png',
    imageLvl2: '/towns/hometown_lvl2.png',
    imageLvl3: '/towns/hometown_lvl3.png',
    imageLvl4: '/towns/hometown_lvl4.png',
  },
  'peppermint-peak': {
    houseNumber: 'Peak Lodge #88',
    street: 'Frozen Avalanche Ridge',
    district: 'Mint Glacial Sector',
    county: 'Creamwood County',
    imageLvl1: '/towns/hometown_lvl1.png',
    imageLvl2: '/towns/hometown_lvl2.png',
    imageLvl3: '/towns/hometown_lvl3.png',
    imageLvl4: '/towns/hometown_lvl4.png',
  },
  'banoffee-valley': {
    houseNumber: 'Valley Villa #7',
    street: 'Banana Leaf Canopy Walk',
    district: 'Golden Toffee Mine Sector',
    county: 'Nutwood County',
    imageLvl1: "/Assets/WelcomeShow/NutwoodCounty.png",
    imageLvl2: "/Assets/WelcomeShow/NutwoodCounty.png",
    imageLvl3: "/Assets/WelcomeShow/NutwoodCounty.png",
    imageLvl4: "/Assets/WelcomeShow/NutwoodCounty.png",
  },
};

import { getChocoDate, formatChocoShort } from '../utils/chocoCalendar';

export const getChocolateDate = (d?: Date): string => {
  const info = getChocoDate(d);
  return `${info.month} ${info.day}, ${info.yearShort} / ${info.timeBell}`;
};

export const getChocolateDateShort = (d?: Date): string => {
  return formatChocoShort(d);
};

export const getChocolateDateFull = (isoStr: string): string => {
  const dt = new Date(isoStr);
  return formatChocoShort(dt);
};

// ── Player Level System ───────────────────────────────────────
export interface LevelInfo {
  level: number;
  title: string;
  currentLevelXP: number;
  nextLevelXPNeeded: number;
  totalLevelStartXP: number;
  totalLevelEndXP: number;
  progressPct: number;
}

export const getPlayerLevelInfo = (totalXP: number): LevelInfo => {
  const thresholds = [
    { level: 1, name: '🌱 Newcomer',    needed: 250 },
    { level: 2, name: '🏠 Resident',    needed: 250 },
    { level: 3, name: '🪵 Settler',     needed: 500 },
    { level: 4, name: '🏘️ Townsman',    needed: 1500 },
    { level: 5, name: '🏛️ Citizen',     needed: 2500 },
  ];

  let accumulated = 0;
  for (let i = 0; i < thresholds.length; i++) {
    const t = thresholds[i];
    const startXP = accumulated;
    const endXP = accumulated + t.needed;
    if (totalXP < endXP) {
      const withinLevelXP = totalXP - startXP;
      const progress = Math.min(100, (withinLevelXP / t.needed) * 100);
      return {
        level: t.level,
        title: t.name,
        currentLevelXP: withinLevelXP,
        nextLevelXPNeeded: t.needed,
        totalLevelStartXP: startXP,
        totalLevelEndXP: endXP,
        progressPct: progress
      };
    }
    accumulated = endXP;
  }
  return {
    level: 5,
    title: '🏛️ Citizen',
    currentLevelXP: 2500,
    nextLevelXPNeeded: 2500,
    totalLevelStartXP: 2500,
    totalLevelEndXP: 5000,
    progressPct: 100
  };
};

// ── Standing Labels ───────────────────────────────────────────
export const getProvincialStanding = (points: number): string => {
  if (points >= 1500) return '🏛️ Citizen';
  if (points >= 750)  return '🏘️ Townsman';
  if (points >= 300)  return '🪵 Settler';
  if (points >= 150)  return '🏠 Resident';
  return '🌱 Newcomer';
};

export const getBuilderStanding = (xp: number): string => {
  const lvl = Math.floor(xp / 10) + 1;
  if (lvl >= 50) return 'Grand Architect';
  if (lvl >= 20) return 'Master Builder';
  if (lvl >= 10) return 'Engineer';
  if (lvl >= 5)  return 'Craftsman';
  if (lvl >= 2)  return 'Apprentice';
  return 'Probationer';
};

export const getExplorerStanding = (xp: number): string => {
  const lvl = Math.floor(xp / 10) + 1;
  if (lvl >= 50) return 'Legendary Cartographer';
  if (lvl >= 20) return 'Master Explorer';
  if (lvl >= 10) return 'Ranger';
  if (lvl >= 5)  return 'Pathfinder';
  if (lvl >= 2)  return 'Scout';
  return 'Probationer';
};

export const getHealerStanding = (xp: number): string => {
  const lvl = Math.floor(xp / 10) + 1;
  if (lvl >= 50) return 'Grand Physician';
  if (lvl >= 20) return 'Master Healer';
  if (lvl >= 10) return 'Practitioner';
  if (lvl >= 5)  return 'Caregiver';
  if (lvl >= 2)  return 'Assistant';
  return 'Probationer';
};

// ── Nav Items ─────────────────────────────────────────────────
export const HOME_NAV_ITEMS: {
  id: SubPage;
  label: string;
  icon: string;
  color: string;
  desc: string;
}[] = [
  { id: 'places',     label: 'Town Map',   icon: '/Assets/Icons/Icon_1_q1.png',                         color: '#34d399', desc: 'Explore landmarks' },
  { id: 'classroom',  label: 'Academy',    icon: '/Assets/Icons/cropped/Ganache_Academy.png',           color: '#60a5fa', desc: 'Train your skills' },
  { id: 'shop',       label: 'Market',     icon: '/Assets/Icons/cropped/Ganache_Market.png',            color: '#fb923c', desc: 'Buy upgrades' },
  { id: 'newspaper',  label: 'NewsPaper',  icon: '/Assets/Icons/cropped/Ganache_Gazette.png',           color: '#facc15', desc: 'Read the news' },
  { id: 'journal',    label: 'Journal',    icon: '/Assets/Icons/Icons_Chocobrook_q2.png',               color: '#c084fc', desc: 'Your diary' },
  { id: 'stampbook',  label: 'Passport',   icon: '/Assets/Icons/Icons_Chocobrook_q3.png',               color: '#f472b6', desc: 'Stamp & travel log' },
  { id: 'workshop',   label: 'Workshop',   icon: '/Assets/Icons/Icon_1_q2.png',                         color: '#a3e635', desc: 'Craft items' },
  { id: 'mini-games', label: 'Games',      icon: '/Assets/Icons/cropped/Ganache_Games.png',             color: '#e879f9', desc: 'Town job arcade' },
  { id: 'dashboard',  label: 'Desk Hub',   icon: '/Assets/Icons/Icons_Chocobrook_q4.png',               color: '#94a3b8', desc: 'Manage everything' },
];

// ── Flash News Data ───────────────────────────────────────────
export interface FlashNewsItem {
  block: number;
  timeRange: string;
  news: string;
  recommendedActions: string[];
}

export const FLASH_NEWS_DATA: FlashNewsItem[] = [
  {
    block: 0,
    timeRange: '12:00 AM - 3:00 AM',
    news: 'Night Whispers: Eerie blue lights spotted near the old forest belfry. Night guards report a faint chiming sound echoing under the dark canopy.',
    recommendedActions: [
      'Investigate Midnight Bell at the Town Places (+25 Explorer XP)',
      'Study mystical phenomena in the Academy Classroom (+15 XP)',
      'Rest at your Mossberry Cottage to secure a Daily Stamp (+10 XP)',
    ],
  },
  {
    block: 1,
    timeRange: '3:00 AM - 6:00 AM',
    news: 'Pre-Dawn Logistics: Cargo transport wagons spotted at Mossberry Wharf loading extra crates of velvet cocoa cream and raw molasses.',
    recommendedActions: [
      'Engage in Express Pod Delivery at the Town Places (+25 Builder XP)',
      'Manage resources and check inventory at the Workshop',
      'Sponsor harbor logistics to grow your town standing',
    ],
  },
  {
    block: 2,
    timeRange: '6:00 AM - 9:00 AM',
    news: 'Morning Dam Release: The Ganache River water levels rose by 4 inches. Flow rates remain extremely fast, carrying twigs and silt.',
    recommendedActions: [
      'Dredge the River Route at the Town Places (+30 Explorer XP)',
      'Claim your Daily Presence Stamp for a quick wallet boost (+20 Coins)',
      'Collect wood to prepare for logistics construction',
    ],
  },
  {
    block: 3,
    timeRange: '9:00 AM - 12:00 PM',
    news: 'Midday Market Speculation: Syrup brokers forecast a spike in molasses tariffs. Traders gather at Mossberry Wharf to secure supply.',
    recommendedActions: [
      'Deliver trade cargo to Ganache Grove docks (+30 Legacy)',
      'Sponsor regional projects at the Town Hall campaigns',
      'Check shop updates for tools to increase production',
    ],
  },
  {
    block: 4,
    timeRange: '12:00 PM - 3:00 PM',
    news: 'Afternoon High Heat: Temperature spikes to 32°C. Baker Bramble reports a risk of velvet cocoa mixture spoiling in the sun.',
    recommendedActions: [
      'Help Baker Bramble insulate cooling boxes at the Workshop',
      'Attend advanced chemistry training in the Classroom (+20 XP)',
      'Equip your companion pet to secure extra task multipliers',
    ],
  },
  {
    block: 5,
    timeRange: '3:00 PM - 6:00 PM',
    news: 'Sunset Traffic: Influx of caravans arriving from Hazelton Highlands. Border patrol reports minor delays near Peppermint Peak paths.',
    recommendedActions: [
      'Clear forest debris from provincial roads (+25 Explorer XP)',
      'Read the daily dossier in the Gazette for legacy bonuses',
      'Draft city planning proposals in the Dashboard Desk',
    ],
  },
  {
    block: 6,
    timeRange: '6:00 PM - 9:00 PM',
    news: 'Dusk Gathering: Lanterns are lit along Mossberry Lane. Citizens gather at the Market Square to hear Sir Goldwhistle\'s weekly address.',
    recommendedActions: [
      "Listen to Sir Goldwhistle's address at the Town Center",
      'Complete lingering tasks before the night registry closes',
      'Trade resources at the local shop to secure coins',
    ],
  },
  {
    block: 7,
    timeRange: '9:00 PM - 12:00 AM',
    news: 'Late Night Operations: Sluice gate audits show stable pressure. Maintenance teams request raw coal blocks to stoke the pump boilers.',
    recommendedActions: [
      'Sponsor boiler operations at the Town Hall Desk (+35 Coins)',
      'Refine raw materials in the Workshop queue',
      "Prepare inventory clipboards for tomorrow's shift",
    ],
  },
];

export interface RecommendedActionMapping {
  text: string;
  subpage: string;
  coins?: number;
}

export const FLASH_NEWS_RECOMMENDED_MAP: Record<number, RecommendedActionMapping> = {
  0: { text: "Investigate Midnight Bell at the Bell Tower", subpage: 'places' },
  1: { text: "Engage in Express Pod Delivery at the Forest Rail Station", subpage: 'places' },
  2: { text: "Dredge the River Route at Riverside Docks", subpage: 'places' },
  3: { text: "Deliver trade cargo to Ganache Grove docks", subpage: 'places' },
  4: { text: "Help Baker Bramble insulate cooling boxes at the Workshop", subpage: 'workshop' },
  5: { text: "Clear forest debris from provincial roads at Mossberry Park", subpage: 'places' },
  6: { text: "Listen to Sir Goldwhistle's address at the Town Center (+3 🪙)", subpage: 'places', coins: 3 },
  7: { text: "Sponsor boiler operations at the Town Hall", subpage: 'places' },
};

// ── Home Room Definitions ─────────────────────────────────────
export interface HomeRoomItem {
  title: string;
  desc: string;
  type: 'letter' | 'opportunity' | 'task' | 'notice' | 'coin';
  reward?: number;
}

export interface HomeRoom {
  id: string;
  name: string;
  icon: string;
  image: string;
  color: string;
  badge?: string;
  items: HomeRoomItem[];
}

export const HOME_ROOMS: HomeRoom[] = [
  {
    id: 'exterior',
    name: 'Exterior',
    icon: '🌳',
    image: "/Assets/Ganache%20Grove/Traveller'sHome_GanacheGrovez_Beginner_Exterior.png",
    color: 'emerald',
    items: [
      { title: 'Check Mailbox', desc: 'A letter from the Cocoawood County Registry awaits you outside.', type: 'letter' },
      { title: 'Inspect Garden Gate', desc: 'The gate latch needs tightening. A quick fix earns +5 coins.', type: 'task', reward: 5 },
    ],
  },
  {
    id: 'livingroom',
    name: 'Living Room',
    icon: '🛋️',
    image: "/Assets/Ganache%20Grove/Ganache_BeginnerHome_Living.png",
    color: 'amber',
    items: [
      { title: 'Read Morning Gazette', desc: 'The Ganache Gazette sits open on the coffee table.', type: 'notice' },
      { title: 'Fireside Property Deeds', desc: 'Review your cottage deeds and upgrade options.', type: 'task' },
      { title: 'NPC Visit: Sir Goldwhistle', desc: 'Sir Goldwhistle has left a calling card for you!', type: 'letter' },
    ],
  },
  {
    id: 'bedroom',
    name: 'Bedroom',
    icon: '🛌',
    image: "/Assets/Ganache%20Grove/Ganache_BeginnerHome_Bedroom.png",
    color: 'purple',
    items: [
      { title: 'Passport Letter (Unread)', desc: 'A notice from the Imperial Passport Registry — your stamp record is due.', type: 'letter' },
      { title: 'Dream Journal Entry', desc: 'Record last night\'s dream for +8 Legacy Points.', type: 'task', reward: 8 },
    ],
  },
  {
    id: 'kitchen',
    name: 'Kitchen',
    icon: '🍳',
    image: "/Assets/Ganache%20Grove/Ganache_BeginnerHome_kitchen1.png",
    color: 'orange',
    items: [
      { title: 'Brew Morning Cocoa', desc: 'The kettle is whistling. Brew a cocoa and earn a morale boost (+10 coins).', type: 'coin', reward: 10 },
      { title: 'Market Supply Request', desc: 'Cocoa Market needs 3 bundles of fresh ganache pods. Can you help?', type: 'opportunity', reward: 30 },
    ],
  },
  {
    id: 'balcony',
    name: 'Balcony',
    icon: '🌿',
    image: "/Assets/Ganache%20Grove/Ganache_BeginnerHome_Balcony.png",
    color: 'cyan',
    items: [
      { title: 'Weather Reading', desc: '🌅 Gana morning: warm cocoa breeze. Town mood: Curious & Cheerful.', type: 'notice' },
      { title: 'Spot Forest Opportunity', desc: 'From the balcony you see Mossberry Park rangers posting work boards.', type: 'opportunity', reward: 40 },
    ],
  },
  {
    id: 'lawn',
    name: 'Lawn',
    icon: '🌱',
    image: "/Assets/Ganache%20Grove/Traveller'sHome_GanacheGrovez_Beginner_Exterior.png",
    color: 'lime',
    items: [
      { title: 'Pet Corner Activity', desc: 'Your companion is digging near the ganache shrub — they found something!', type: 'coin', reward: 3 },
      { title: 'Tend the Hedgerows', desc: 'Trim the mossberry hedges for the weekly civic beauty bonus (+15 Legacy).', type: 'task', reward: 15 },
    ],
  },
];

// ── Progress Station Definitions ──────────────────────────────
export interface StationInfo {
  id: number | string;
  name: string;
  xpTarget: number;
  offsetY: number;
  tasks: { label: string; done: boolean }[];
}
