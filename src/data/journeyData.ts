export interface Role {
  id: string;
  name: string;
  description: string;
  orderNo: number;
  badgeIcon: string;
  xpRequired: number;
  legacyRequired: number;
  colorTheme: string;
}

export interface Milestone {
  id: string;
  roleId: string;
  title: string;
  description: string;
  required: boolean;
  xpReward: number;
  autoType?: 'profile' | 'chore' | 'mission' | 'rent' | 'legacy' | 'skills' | 'campaign' | 'donations' | 'fragments' | 'pets' | 'canal' | 'transports' | 'estates';
  autoValue?: any;
}

export const ROLES: Role[] = [
  {
    id: 'newcomer',
    name: 'Newcomer',
    description: 'A fresh face in the county, learning the local ways and setting up your residency.',
    orderNo: 1,
    badgeIcon: '🌱',
    xpRequired: 0,
    legacyRequired: 0,
    colorTheme: 'from-emerald-500/80 to-teal-500/80',
  },
  {
    id: 'apprentice',
    name: 'Resident',
    description: 'You have settled into your new cottage and begun your life in Toffee Town.',
    orderNo: 2,
    badgeIcon: '🏠',
    xpRequired: 250,
    legacyRequired: 60,
    colorTheme: 'from-blue-500/80 to-indigo-500/80',
  },
  {
    id: 'resident',
    name: 'Settler',
    description: "You've put down roots, contribute regularly, and are becoming a familiar face.",
    orderNo: 3,
    badgeIcon: '🪵',
    xpRequired: 500,
    legacyRequired: 150,
    colorTheme: 'from-purple-500/80 to-fuchsia-500/80',
  },
  {
    id: 'contributor',
    name: 'Townsman',
    description: "The town knows and trusts you. You're an active and respected member of the community.",
    orderNo: 4,
    badgeIcon: '🏘️',
    xpRequired: 1000,
    legacyRequired: 300,
    colorTheme: 'from-orange-500/80 to-red-500/80',
  },
  {
    id: 'steward',
    name: 'Citizen',
    description: 'The highest civic honour. The Town Council officially recognizes your dedication and service to Toffee Town.',
    orderNo: 5,
    badgeIcon: '🏛️',
    xpRequired: 2500,
    legacyRequired: 750,
    colorTheme: 'from-amber-500/80 to-yellow-500/80',
  },
];

export const MILESTONES: Milestone[] = [
  // Newcomer Milestones (to reach Resident: 250 XP / 60 Legacy)
  {
    id: 'm-new-profile',
    roleId: 'newcomer',
    title: 'Complete Profile',
    description: 'Register your character name at the Traveller Desk.',
    required: true,
    xpReward: 20,
    autoType: 'profile',
  },
  {
    id: 'm-new-login',
    roleId: 'newcomer',
    title: 'First Login',
    description: 'Establish secure credentials with the Ganache Grove gate.',
    required: true,
    xpReward: 10,
    autoType: 'profile',
  },
  {
    id: 'm-new-intro',
    roleId: 'newcomer',
    title: 'Introduce Yourself',
    description: 'Say hello to local characters at the Gossip Corner.',
    required: true,
    xpReward: 30,
  },
  {
    id: 'm-new-legacy',
    roleId: 'newcomer',
    title: '60 Legacy Points',
    description: 'Build your standing to 60 points.',
    required: true,
    xpReward: 20,
    autoType: 'legacy',
    autoValue: 60,
  },
  {
    id: 'm-new-townhall',
    roleId: 'newcomer',
    title: 'Visit Town Hall',
    description: 'Inspect the Mayor\'s bulletin and review county campaigns.',
    required: false,
    xpReward: 20,
    autoType: 'campaign',
  },

  // Resident Milestones (apprentice ID - to reach Settler: 500 XP / 150 Legacy)
  {
    id: 'm-app-chore',
    roleId: 'apprentice',
    title: 'Complete a Chore',
    description: 'Resolve any cottage maintenance task (e.g. Garden Gate).',
    required: true,
    xpReward: 25,
    autoType: 'chore',
    autoValue: 1,
  },
  {
    id: 'm-app-mission',
    roleId: 'apprentice',
    title: 'Complete a Mission',
    description: 'Finish one entry on the Missions Board.',
    required: true,
    xpReward: 30,
    autoType: 'mission',
    autoValue: 1,
  },
  {
    id: 'm-app-legacy',
    roleId: 'apprentice',
    title: '150 Legacy Points',
    description: 'Build your standing to 150 points.',
    required: true,
    xpReward: 30,
    autoType: 'legacy',
    autoValue: 150,
  },
  {
    id: 'm-app-skills',
    roleId: 'apprentice',
    title: 'Study at Academy',
    description: 'Gain some skill XP in the Academy Classroom.',
    required: false,
    xpReward: 20,
    autoType: 'skills',
    autoValue: 1,
  },
  {
    id: 'm-app-craft',
    roleId: 'apprentice',
    title: 'Craft in Workshop',
    description: 'Use raw ingredients to assemble items in your workshop.',
    required: true,
    xpReward: 25,
  },

  // Settler Milestones (resident ID - to reach Townsman: 1000 XP / 300 Legacy)
  {
    id: 'm-res-rent',
    roleId: 'resident',
    title: 'Pay Cottage Rent',
    description: 'Keep your cottage ledger solvent for the coming fortnight.',
    required: true,
    xpReward: 30,
    autoType: 'rent',
  },
  {
    id: 'm-res-encounter',
    roleId: 'resident',
    title: 'Resolve Encounter',
    description: 'Resolve a Roadside Encounter while exploring the county.',
    required: true,
    xpReward: 35,
  },
  {
    id: 'm-res-legacy',
    roleId: 'resident',
    title: '300 Legacy Points',
    description: 'Build your standing to 300 points.',
    required: true,
    xpReward: 40,
    autoType: 'legacy',
    autoValue: 300,
  },
  {
    id: 'm-res-transport',
    roleId: 'resident',
    title: 'Acquire Transport',
    description: 'Unlock a new form of transportation beyond walking.',
    required: false,
    xpReward: 25,
    autoType: 'transports',
    autoValue: 2,
  },

  // Townsman Milestones (contributor ID - to reach Citizen: 2500 XP / 750 Legacy)
  {
    id: 'm-con-level',
    roleId: 'contributor',
    title: 'Reach 2500 XP',
    description: 'Accumulate 2500 total career experience points.',
    required: true,
    xpReward: 50,
    autoType: 'legacy',
    autoValue: 2500,
  },
  {
    id: 'm-con-chores',
    roleId: 'contributor',
    title: 'Complete 5 Chores',
    description: 'Solve 5 different cottage maintenance challenges.',
    required: true,
    xpReward: 40,
    autoType: 'chore',
    autoValue: 5,
  },
  {
    id: 'm-con-legacy',
    roleId: 'contributor',
    title: '750 Legacy Points',
    description: 'Build your standing to 750 points.',
    required: true,
    xpReward: 40,
    autoType: 'legacy',
    autoValue: 750,
  },
  {
    id: 'm-con-campaign',
    roleId: 'contributor',
    title: 'Support a Campaign',
    description: 'Assist the Town Council in resolving one county affair.',
    required: true,
    xpReward: 50,
    autoType: 'campaign',
  },
  {
    id: 'm-con-talk',
    roleId: 'contributor',
    title: 'NPC Dialogue',
    description: 'Consult a Town Professional about local gossip.',
    required: false,
    xpReward: 30,
  },

  // Citizen Milestones (steward ID - to reach max victory: 5000 XP / 1500 Legacy)
  {
    id: 'm-ste-donations',
    roleId: 'steward',
    title: 'Donate 10 Resources',
    description: 'Contribute 10 resources to the Town Hall project.',
    required: true,
    xpReward: 60,
    autoType: 'donations',
    autoValue: 10,
  },
  {
    id: 'm-ste-level',
    roleId: 'steward',
    title: 'Reach 5000 XP',
    description: 'Accumulate 5000 total career experience points.',
    required: true,
    xpReward: 80,
    autoType: 'legacy',
    autoValue: 5000,
  },
  {
    id: 'm-ste-legacy',
    roleId: 'steward',
    title: '1500 Legacy Points',
    description: 'Establish yourself as a community leader with 1500 points.',
    required: true,
    xpReward: 70,
    autoType: 'legacy',
    autoValue: 1500,
  },
  {
    id: 'm-ste-fragment',
    roleId: 'steward',
    title: 'Find Memory Fragment',
    description: 'Locate a hidden memory fragment in the county.',
    required: true,
    xpReward: 60,
    autoType: 'fragments',
    autoValue: 1,
  },
  {
    id: 'm-ste-pet',
    roleId: 'steward',
    title: 'Equip Companion Pet',
    description: 'Have an active companion pet at your desk.',
    required: false,
    xpReward: 40,
    autoType: 'pets',
  },
];

export const evaluateMilestone = (milestone: Milestone, state: any): boolean => {
  const { completedActions, completedMissions, rentPaidUntil, legacyPoints, ownedTransports, donatedResources, unlockedFragments, equippedPet, completedSeriesSteps, ownedEstates, skills } = state;
  const totalXP = (skills?.builder || 0) + (skills?.explorer || 0) + (skills?.healer || 0);

  switch (milestone.autoType) {
    case 'profile':
      if (milestone.id === 'm-new-profile') {
        return !!state.travellerName && state.travellerName.trim().length > 0;
      }
      return true;
    case 'chore': {
      const choreCount = completedActions ? completedActions.filter((x: string) =>
        x.startsWith('ext-') || x.startsWith('liv-') || x.startsWith('bed-') || x.startsWith('kit-') || x.startsWith('bal-') || x.startsWith('law-')
      ).length : 0;
      return choreCount >= (milestone.autoValue || 1);
    }
    case 'mission':
      return (completedMissions?.length || 0) >= (milestone.autoValue || 1);
    case 'rent':
      return !!rentPaidUntil;
    case 'legacy':
      if (milestone.id === 'm-con-level' || milestone.id === 'm-ste-level') {
        return (totalXP || 0) >= (milestone.autoValue || 0);
      }
      return (legacyPoints || 0) >= (milestone.autoValue || 0);
    case 'transports':
      return (ownedTransports?.length || 0) >= (milestone.autoValue || 1);
    case 'donations': {
      const donationCount = donatedResources ? Object.values(donatedResources).reduce((a: any, b: any) => (a as number) + (b as number), 0) : 0;
      return (donationCount as number) >= (milestone.autoValue || 1);
    }
    case 'fragments':
      return (unlockedFragments?.length || 0) >= (milestone.autoValue || 1);
    case 'pets':
      return !!equippedPet;
    case 'canal':
      return (completedSeriesSteps?.length || 0) >= (milestone.autoValue || 1);
    case 'estates':
      return (ownedEstates?.length || 0) >= (milestone.autoValue || 1);
    case 'campaign': {
      const campaignCompleted = completedActions && completedActions.some((x: string) =>
        ['walkway', 'bell', 'sneezles', 'festival'].includes(x)
      );
      return !!campaignCompleted;
    }
    default:
      return false;
  }
};

export interface NpcJourneyData {
  id: string;
  name: string;
  avatar: string;
  roleId: string;
  progressPct: number;
  milestones: string[];
}

export const NPC_JOURNEY_LIST: NpcJourneyData[] = [
  {
    id: 'theo',
    name: 'Theo',
    avatar: '🐿️',
    roleId: 'steward',
    progressPct: 84,
    milestones: [
      'm-new-profile', 'm-new-login', 'm-new-intro', 'm-new-townhall',
      'm-app-chore', 'm-app-mission', 'm-app-skills', 'm-app-craft',
      'm-res-rent', 'm-res-encounter', 'm-res-legacy', 'm-res-transport',
      'm-con-level', 'm-con-chores', 'm-con-campaign', 'm-con-talk'
    ]
  },
  {
    id: 'bella',
    name: 'Bella',
    avatar: '🦉',
    roleId: 'steward',
    progressPct: 92,
    milestones: [
      'm-new-profile', 'm-new-login', 'm-new-intro', 'm-new-townhall',
      'm-app-chore', 'm-app-mission', 'm-app-skills', 'm-app-craft',
      'm-res-rent', 'm-res-encounter', 'm-res-legacy', 'm-res-transport',
      'm-con-level', 'm-con-chores', 'm-con-campaign', 'm-con-talk',
      'm-ste-donations', 'm-ste-legacy', 'm-ste-fragment'
    ]
  },
  {
    id: 'olive',
    name: 'Olive',
    avatar: '🌿',
    roleId: 'contributor',
    progressPct: 48,
    milestones: [
      'm-new-profile', 'm-new-login', 'm-new-intro', 'm-new-townhall',
      'm-app-chore', 'm-app-mission', 'm-app-skills', 'm-app-craft'
    ]
  }
];
