// ============================================================
// CHOCOBROOK PROVINCE CITIZENSHIP PROGRESSION SYSTEM
// The language of this world: Legacy, Rank, Standing.
// Never XP. Never Levels. Never Points.
// ============================================================

// ── PROFESSION TRACKS & RANK TITLES ─────────────────────────

export interface ProfessionRank {
  stage: number;
  title: string;
  legacyRequired: number;
  description: string;
}

export interface ProfessionTrack {
  id: string;
  label: string;
  emoji: string;
  color: string;
  barColor: string;
  borderColor: string;
  bgColor: string;
  domain: string;
  ranks: ProfessionRank[];
}

export const PROFESSION_TRACKS: ProfessionTrack[] = [
  {
    id: 'builder',
    label: 'Builder',
    emoji: '🏗',
    color: 'text-yellow-400',
    barColor: 'bg-yellow-500',
    borderColor: 'border-yellow-500/30',
    bgColor: 'bg-yellow-500/10',
    domain: 'infrastructure & construction',
    ranks: [
      { stage: 1, title: 'Apprentice Builder',  legacyRequired: 0,    description: 'You have just begun. The province watches your first efforts.' },
      { stage: 2, title: 'Junior Builder',       legacyRequired: 50,   description: 'You have shown you can complete what you start.' },
      { stage: 3, title: 'Town Builder',         legacyRequired: 150,  description: 'The town knows your name. Your work is visible on its streets.' },
      { stage: 4, title: 'Senior Builder',       legacyRequired: 350,  description: 'Other builders look to you. Your projects shape the community.' },
      { stage: 5, title: 'Master Builder',       legacyRequired: 700,  description: 'A rare distinction. The province has recorded your contributions.' },
      { stage: 6, title: 'Grand Builder',        legacyRequired: 1200, description: 'Your legacy is permanent. Buildings you touched will outlast you.' },
    ]
  },
  {
    id: 'architect',
    label: 'Architect',
    emoji: '📐',
    color: 'text-cyan-400',
    barColor: 'bg-cyan-500',
    borderColor: 'border-cyan-500/30',
    bgColor: 'bg-cyan-500/10',
    domain: 'planning & design',
    ranks: [
      { stage: 1, title: 'Apprentice Architect',  legacyRequired: 0,    description: 'Drawing plans, learning the province\'s spatial language.' },
      { stage: 2, title: 'Junior Architect',       legacyRequired: 50,   description: 'First designs approved and executed.' },
      { stage: 3, title: 'Town Architect',         legacyRequired: 150,  description: 'Your blueprints shape how the town grows.' },
      { stage: 4, title: 'Senior Architect',       legacyRequired: 350,  description: 'County planning boards seek your input.' },
      { stage: 5, title: 'Master Architect',       legacyRequired: 700,  description: 'Provincial landmarks bear your design signature.' },
      { stage: 6, title: 'Imperial Architect',     legacyRequired: 1200, description: 'A title granted by the Capital. You design for ChocoBrook itself.' },
    ]
  },
  {
    id: 'healer',
    label: 'Healer',
    emoji: '💊',
    color: 'text-red-400',
    barColor: 'bg-red-500',
    borderColor: 'border-red-500/30',
    bgColor: 'bg-red-500/10',
    domain: 'health & wellbeing',
    ranks: [
      { stage: 1, title: 'Apprentice Healer',   legacyRequired: 0,    description: 'Learning the first remedies. Watching the town doctors work.' },
      { stage: 2, title: 'Junior Healer',        legacyRequired: 50,   description: 'Trusted to assist. Recognised by the medical community.' },
      { stage: 3, title: 'Community Healer',     legacyRequired: 150,  description: 'Townspeople ask for you by name when illness comes.' },
      { stage: 4, title: 'Senior Healer',        legacyRequired: 350,  description: 'County-wide reputation. Called to consult on difficult cases.' },
      { stage: 5, title: 'Master Healer',        legacyRequired: 700,  description: 'A designation of honour. Your treatments are now documented practice.' },
      { stage: 6, title: 'Grand Healer',         legacyRequired: 1200, description: 'The province consults you. Your methods are taught to others.' },
    ]
  },
  {
    id: 'social',
    label: 'Social Work',
    emoji: '🤝',
    color: 'text-emerald-400',
    barColor: 'bg-emerald-500',
    borderColor: 'border-emerald-500/30',
    bgColor: 'bg-emerald-500/10',
    domain: 'community & advocacy',
    ranks: [
      { stage: 1, title: 'Volunteer',              legacyRequired: 0,    description: 'You showed up. That already matters here.' },
      { stage: 2, title: 'Community Helper',       legacyRequired: 50,   description: 'The community has noticed your consistency.' },
      { stage: 3, title: 'Town Advocate',          legacyRequired: 150,  description: 'You speak for those who struggle to be heard.' },
      { stage: 4, title: 'Senior Advocate',        legacyRequired: 350,  description: 'Town meetings reference your work. Councils listen.' },
      { stage: 5, title: 'Master Advocate',        legacyRequired: 700,  description: 'County-level recognition. Your advocacy changes decisions.' },
      { stage: 6, title: 'Provincial Champion',    legacyRequired: 1200, description: 'The province considers you a pillar of civic life.' },
    ]
  },
  {
    id: 'politician',
    label: 'Politician',
    emoji: '🏛',
    color: 'text-amber-400',
    barColor: 'bg-amber-500',
    borderColor: 'border-amber-500/30',
    bgColor: 'bg-amber-500/10',
    domain: 'governance & law',
    ranks: [
      { stage: 1, title: 'Civic Observer',          legacyRequired: 0,    description: 'Watching how decisions are made. Learning the language of power.' },
      { stage: 2, title: 'Civic Participant',        legacyRequired: 50,   description: 'Your vote has been cast. Your opinion recorded.' },
      { stage: 3, title: 'Town Representative',      legacyRequired: 150,  description: 'You speak officially. The town council acknowledges your seat.' },
      { stage: 4, title: 'County Representative',    legacyRequired: 350,  description: 'Elevated to county affairs. Other representatives know your name.' },
      { stage: 5, title: 'Provincial Councillor',    legacyRequired: 700,  description: 'A seat at the provincial table. Your voice shapes ChocoBrook law.' },
      { stage: 6, title: 'Statesman of ChocoBrook', legacyRequired: 1200, description: 'The highest civic title available to a non-born citizen. Rare. Earned.' },
    ]
  },
  {
    id: 'explorer',
    label: 'Explorer',
    emoji: '🗺',
    color: 'text-purple-400',
    barColor: 'bg-purple-500',
    borderColor: 'border-purple-500/30',
    bgColor: 'bg-purple-500/10',
    domain: 'discovery & cartography',
    ranks: [
      { stage: 1, title: 'Wanderer',                     legacyRequired: 0,    description: 'Every province needs those who simply walk and observe.' },
      { stage: 2, title: 'Pathfinder',                   legacyRequired: 50,   description: 'You\'ve marked new routes. Others follow your tracks.' },
      { stage: 3, title: 'Town Guide',                   legacyRequired: 150,  description: 'The town sends visitors to you for orientation.' },
      { stage: 4, title: 'County Ranger',                legacyRequired: 350,  description: 'Your knowledge spans a full county. Maps reference your findings.' },
      { stage: 5, title: 'Provincial Cartographer',      legacyRequired: 700,  description: 'Official designation. Your maps are used by the province itself.' },
      { stage: 6, title: 'Grand Explorer of ChocoBrook', legacyRequired: 1200, description: 'A title belonging to fewer than ten living people. The province is your record.' },
    ]
  }
];

// ── PROVINCIAL STANDING LADDER ───────────────────────────────
// This is the citizenship progression path.
// Unlocks are tied to Provincial Standing, not any single Legacy value.

export interface ProvinceStandingLevel {
  standing: number;   // ordinal 1-5
  title: string;
  subtitle: string;
  provincialLegacyRequired: number;
  description: string;
  colour: string;
  badgeColour: string;
  unlocksText: string;
}

export const PROVINCIAL_STANDING: ProvinceStandingLevel[] = [
  {
    standing: 1,
    title: 'New Arrival',
    subtitle: 'Traveller',
    provincialLegacyRequired: 0,
    description: 'You have just arrived. The province is watching.',
    colour: 'text-neutral-400',
    badgeColour: 'bg-neutral-500/15 border-neutral-500/30 text-neutral-400',
    unlocksText: '4 starter county towns available for residency'
  },
  {
    standing: 2,
    title: 'Resident',
    subtitle: 'Established Resident',
    provincialLegacyRequired: 100,
    description: 'You have contributed. The community recognises your presence.',
    colour: 'text-green-400',
    badgeColour: 'bg-green-500/15 border-green-500/30 text-green-400',
    unlocksText: '3 additional towns open for residency'
  },
  {
    standing: 3,
    title: 'Known Citizen',
    subtitle: 'Recognised Citizen',
    provincialLegacyRequired: 300,
    description: 'Your name is known beyond your home town. Multi-town recognition.',
    colour: 'text-blue-400',
    badgeColour: 'bg-blue-500/15 border-blue-500/30 text-blue-400',
    unlocksText: 'Further towns unlock. Province Gazette mentions you by name.'
  },
  {
    standing: 4,
    title: 'Provincial Citizen',
    subtitle: 'Significant Contributor',
    provincialLegacyRequired: 700,
    description: 'Your contributions span the province. Council members know your work.',
    colour: 'text-purple-400',
    badgeColour: 'bg-purple-500/15 border-purple-500/30 text-purple-400',
    unlocksText: 'Most towns now available. Capital application begins.'
  },
  {
    standing: 5,
    title: 'Capital Candidate',
    subtitle: 'Provincial Elder',
    provincialLegacyRequired: 1200,
    description: 'You have earned the right to apply for Capital Residency in Toffee Town.',
    colour: 'text-amber-400',
    badgeColour: 'bg-amber-500/15 border-amber-500/40 text-amber-400',
    unlocksText: 'Toffee Town residency application opens. Imperial Letter received.'
  }
];

// Helper: get current standing from total legacy
export const getProvinceStanding = (totalLegacy: number): ProvinceStandingLevel => {
  for (let i = PROVINCIAL_STANDING.length - 1; i >= 0; i--) {
    if (totalLegacy >= PROVINCIAL_STANDING[i].provincialLegacyRequired) {
      return PROVINCIAL_STANDING[i];
    }
  }
  return PROVINCIAL_STANDING[0];
};

// Helper: get rank within a profession track
export const getProfessionRank = (trackId: string, legacy: number): ProfessionRank => {
  const track = PROFESSION_TRACKS.find(t => t.id === trackId);
  if (!track) return { stage: 1, title: 'Apprentice', legacyRequired: 0, description: '' };
  for (let i = track.ranks.length - 1; i >= 0; i--) {
    if (legacy >= track.ranks[i].legacyRequired) return track.ranks[i];
  }
  return track.ranks[0];
};

// Helper: progress % within current rank
export const getRankProgress = (trackId: string, legacy: number): number => {
  const track = PROFESSION_TRACKS.find(t => t.id === trackId);
  if (!track) return 0;
  const rank = getProfessionRank(trackId, legacy);
  const nextRank = track.ranks.find(r => r.stage === rank.stage + 1);
  if (!nextRank) return 100;
  const prev = rank.legacyRequired;
  return Math.min(100, Math.round(((legacy - prev) / (nextRank.legacyRequired - prev)) * 100));
};

// Milestone narrative letters (triggered at Legacy milestones)
export interface NarrativeLetter {
  id: string;
  triggerLegacy: number;
  from: string;
  fromTitle: string;
  subject: string;
  body: string;
  isImperial: boolean;
}

export const NARRATIVE_MILESTONE_LETTERS: NarrativeLetter[] = [
  {
    id: 'bella-daisy-notice',
    triggerLegacy: 100,
    from: 'Bella Daisy',
    fromTitle: 'Rebel Alliance Leader, Creamwood County',
    subject: 'Word Is Spreading',
    body: 'Traveller. Word of your contributions has reached me — and believe me, not much reaches me that I don\'t already know about. Word is spreading about your work. Even Toffee Town has started noticing. Keep going. The province needs people like you more than it needs another committee meeting.',
    isImperial: false
  },
  {
    id: 'mayor-falls-recommendation',
    triggerLegacy: 700,
    from: 'Mayor Fluffernutter',
    fromTitle: 'Mayor of Peanut Butter Falls',
    subject: 'A Letter of Recognition',
    body: 'To the Traveller who has become so much more. We in Peanut Butter Falls would be reluctant to see any resident of standing move away — but the Capital would be lucky to have you. I am formally recording this letter in the Provincial Registry as a Letter of Recognition. It will count toward your Capital Candidacy, should you choose to pursue it. The rapids will miss you. We all will.',
    isImperial: false
  },
  {
    id: 'imperial-capital-eligibility',
    triggerLegacy: 1200,
    from: 'Office of Provincial Residency',
    fromTitle: 'Imperial Registry — Toffee Town',
    subject: 'CAPITAL HOUSING ELIGIBILITY — Official Notice',
    body: 'To the Traveller now formally recognised as Capital Candidate. The Office of Provincial Residency has reviewed your Legacy Record and finds it consistent with the requirements for Capital Residency Application in Toffee Town, Grand Harbour District. Your application may now be formally submitted. This notice constitutes the official invitation to proceed. — By authority of the Grand Caramel Council, Confection Year Cycle.',
    isImperial: true
  }
];
