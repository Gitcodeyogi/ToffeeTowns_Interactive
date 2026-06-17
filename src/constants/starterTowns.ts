// ============================================================
// CHOCOBROOK STARTER TOWNS & TOWN LOCK SYSTEM
// 4 towns open for residency from the start.
// All others locked by Provincial Standing.
// Developer bypass via triple-click on the province seal.
// ============================================================

// The 4 towns open to New Arrivals (one per county)
export const STARTER_TOWN_IDS = [
  'ganache-grove',    // Cocoawood County
  'hazelnut-terrace', // Nutwood County
  'caramel-cove',     // Honeywood County
  'peppermint-peak',  // Creamwood County
] as const;

export type StarterTownId = typeof STARTER_TOWN_IDS[number];

// Professions each town values — shapes the civic role experience
export const TOWN_VALUED_PROFESSIONS: Record<string, string[]> = {
  'ganache-grove':    ['explorer', 'healer'],
  'hazelnut-terrace': ['builder', 'architect'],
  'caramel-cove':     ['merchant', 'architect'],
  'peppermint-peak':  ['explorer', 'builder'],
  // Locked towns (values shown when visited)
  'toffee-town':         ['politician', 'architect'],
  'peanut-butter-falls': ['builder', 'social'],
  'banoffee-valley':     ['healer', 'social'],
  'eclair-square':       ['merchant', 'politician'],
  'creme-tunnels':       ['explorer', 'healer'],
  'lava-cake-lake':      ['builder', 'healer'],
  'nougat-node':         ['builder', 'merchant'],
  'cocoa-canyon':        ['explorer', 'architect'],
  'praline-port':        ['merchant', 'social'],
  'sprinkle-sands':      ['social', 'explorer'],
  'butterscotch-bay':    ['merchant', 'explorer'],
  'honeycomb-heights':   ['healer', 'architect'],
  'brownie-crossroads':  ['politician', 'merchant'],
};

// Town images
export const TOWN_IMAGES: Record<string, string> = {
  'ganache-grove':       '/towns/Ganache-Grove.png',
  'hazelnut-terrace':    '/towns/Hazelnut-Terrace.png',
  'caramel-cove':        '/towns/Caramel-Cove.png',
  'peppermint-peak':     '/towns/Peppermint-Peak.png',
  'toffee-town':         '/towns/Toffee-town.png',
  'peanut-butter-falls': '/towns/Peanut-Butter-Falls.png',
  'banoffee-valley':     '/towns/Banoffee-Valley.png',
  'eclair-square':       '/towns/Eclair-Square.png',
  'creme-tunnels':       '/towns/Creme-Tunnels.png',
  'lava-cake-lake':      '/towns/Lava-Cake-Lake.png',
  'nougat-node':         '/towns/Nougat-Node.png',
  'cocoa-canyon':        '/towns/Cocoa-Canyon.png',
  'praline-port':        '/towns/Praline-Port.png',
  'sprinkle-sands':      '/towns/Sprinkle-Sands.png',
  'butterscotch-bay':    '/towns/Butterscotch-Bay.png',
  'honeycomb-heights':   '/towns/Honeycomb-Heights.png',
  'brownie-crossroads':  '/towns/Brownie-Crossroads.png',
};

export interface TownLockRequirement {
  standingRequired: number;        // Provincial Standing level (1–5)
  standingTitle: string;           // Display name of required standing
  provincialLegacyNeeded: number;
  shortReason: string;             // One line for the lock card
  fullReason: string;              // Full paragraph shown on visit
  canVisit: boolean;               // Can the traveller visit without residency?
}

// Lock requirements — graduated by provincial standing
// Standing 1 = New Arrival, 2 = Resident, 3 = Known Citizen, 4 = Provincial Citizen, 5 = Capital Candidate
export const TOWN_LOCK_REQUIREMENTS: Record<string, TownLockRequirement> = {
  'toffee-town': {
    standingRequired: 5,
    standingTitle: 'Capital Candidate',
    provincialLegacyNeeded: 1200,
    shortReason: 'Capital Residency reserved for Capital Candidates only.',
    fullReason: 'Toffee Town — the Imperial Capital of ChocoBrook — reserves its residency for travellers who have built a genuine provincial legacy. Complete 10 Local Matters, earn recognition across at least 3 towns, and achieve Capital Candidate standing. Until then, you are welcome to visit, attend festivals, read the daily gazette, and meet Bella Daisy and Mayor Buttercrumb — but your permanent address must wait.',
    canVisit: true,
  },
  'peanut-butter-falls': {
    standingRequired: 2,
    standingTitle: 'Resident',
    provincialLegacyNeeded: 100,
    shortReason: 'Requires Established Resident standing.',
    fullReason: 'Peanut Butter Falls welcomes travellers who have already put down roots somewhere in the province. Earn your Resident standing in your starter town, and the Falls will open its doors to you.',
    canVisit: true,
  },
  'banoffee-valley': {
    standingRequired: 2,
    standingTitle: 'Resident',
    provincialLegacyNeeded: 100,
    shortReason: 'Requires Established Resident standing.',
    fullReason: 'The Valley is a quiet, close-knit place that prefers to know who you are before allocating a residence. Establish yourself elsewhere first.',
    canVisit: true,
  },
  'eclair-square': {
    standingRequired: 3,
    standingTitle: 'Known Citizen',
    provincialLegacyNeeded: 300,
    shortReason: 'Requires Known Citizen standing.',
    fullReason: 'Eclair Square is a prestigious district. Its residency committee reviews applications from travellers who are already known across the province. Build your legacy in your starter town and beyond.',
    canVisit: true,
  },
  'creme-tunnels': {
    standingRequired: 2,
    standingTitle: 'Resident',
    provincialLegacyNeeded: 100,
    shortReason: 'Requires Established Resident standing.',
    fullReason: 'The underground tunnels require residents who understand the province. Establish yourself first.',
    canVisit: false,
  },
  'lava-cake-lake': {
    standingRequired: 3,
    standingTitle: 'Known Citizen',
    provincialLegacyNeeded: 300,
    shortReason: 'Requires Known Citizen standing.',
    fullReason: 'The Volcanic District is selective — only those with proven standing are granted a residence near the geothermal springs.',
    canVisit: true,
  },
  'nougat-node': {
    standingRequired: 2,
    standingTitle: 'Resident',
    provincialLegacyNeeded: 100,
    shortReason: 'Requires Established Resident standing.',
    fullReason: 'The Node is a working logistics hub. It accepts residents who have shown commitment to the province.',
    canVisit: true,
  },
  'cocoa-canyon': {
    standingRequired: 3,
    standingTitle: 'Known Citizen',
    provincialLegacyNeeded: 300,
    shortReason: 'Requires Known Citizen standing.',
    fullReason: 'Deep-vein canyon territory. Only travellers with proven provincial recognition may establish permanent residence here.',
    canVisit: true,
  },
  'praline-port': {
    standingRequired: 2,
    standingTitle: 'Resident',
    provincialLegacyNeeded: 100,
    shortReason: 'Requires Established Resident standing.',
    fullReason: 'The Port accepts residents with provincial ties. Establish yourself and return.',
    canVisit: true,
  },
  'sprinkle-sands': {
    standingRequired: 2,
    standingTitle: 'Resident',
    provincialLegacyNeeded: 100,
    shortReason: 'Requires Established Resident standing.',
    fullReason: 'The beach communities are welcoming but selective. Build a track record first.',
    canVisit: true,
  },
  'butterscotch-bay': {
    standingRequired: 3,
    standingTitle: 'Known Citizen',
    provincialLegacyNeeded: 300,
    shortReason: 'Requires Known Citizen standing.',
    fullReason: 'The Bay\'s maritime residency committee requires provincial recognition before granting a permanent address.',
    canVisit: true,
  },
  'honeycomb-heights': {
    standingRequired: 3,
    standingTitle: 'Known Citizen',
    provincialLegacyNeeded: 300,
    shortReason: 'Requires Known Citizen standing.',
    fullReason: 'The cliff-top heights community is close-knit and requires provincial standing before opening its residency registry.',
    canVisit: true,
  },
  'brownie-crossroads': {
    standingRequired: 2,
    standingTitle: 'Resident',
    provincialLegacyNeeded: 100,
    shortReason: 'Requires Established Resident standing.',
    fullReason: 'The junction town is always busy and open — but its residency registry requires proof of provincial connection first.',
    canVisit: true,
  },
};

// Helper: is a town available to a traveller?
export const isTownAvailable = (townId: string, totalLegacy: number, isDev: boolean): boolean => {
  if (isDev) return true;
  if (STARTER_TOWN_IDS.includes(townId as StarterTownId)) return true;
  const req = TOWN_LOCK_REQUIREMENTS[townId];
  if (!req) return true;
  return totalLegacy >= req.provincialLegacyNeeded;
};

// Helper: can the town be visited (read-only)?
export const canVisitTown = (townId: string): boolean => {
  if (STARTER_TOWN_IDS.includes(townId as StarterTownId)) return true;
  const req = TOWN_LOCK_REQUIREMENTS[townId];
  return req?.canVisit ?? true;
};

// Developer bypass: check localStorage
export const isDeveloperMode = (): boolean => {
  try {
    return localStorage.getItem('sparrowx_dev_mode') === 'true';
  } catch {
    return false;
  }
};
