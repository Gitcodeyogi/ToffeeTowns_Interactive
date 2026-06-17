export interface ProvincialDecree {
  id: string;
  taxTitle: string;
  reasonHeading: string;
  reasonBody: string;
  socialHeading: string;
  socialBody: string;
  linkageHeading: string;
  linkageTitle: string;
  linkageBody: string;
  accentColor: string; // e.g., 'text-amber-400', 'text-cyan-400'
  glowColor: string; // e.g., 'shadow-amber-500/20'
}

export const PROVINCIAL_DECREES: ProvincialDecree[] = [
  {
    id: 'syrup-shore',
    taxTitle: 'THE STICKY SYRUP SURCHARGE',
    reasonHeading: 'THE IMPERIAL INCIDENT',
    reasonBody: 'An unusual heavy tide has washed coarse sea-salt into the rainbow-sprinkle reefs of Sprinkle Sands, contaminating the harvest. This mineral intrusion has compromised the structural integrity of the local Toffee Tides.',
    socialHeading: 'SOCIAL IMPACT REPORT',
    socialBody: 'The visual purity of the Color Coast is under threat. Export quality has dropped from premium to standard, impacting the whimsical glow of the sugar-glass across the province.',
    linkageHeading: 'PROVINCIAL LINKAGES',
    linkageTitle: 'CONNECTED HORIZONS:',
    linkageBody: 'Affects the sprinkle-to-toffee trade pipeline; Praline Port and the Capital are running dangerously low on high-gloss garnish.',
    accentColor: 'text-amber-400',
    glowColor: 'shadow-amber-500/20'
  },
  {
    id: 'peppermint-peaks',
    taxTitle: 'THE PEPPERMINT PURITY LEVY',
    reasonHeading: 'THE GLOW-BUG GRIEVANCE',
    reasonBody: 'A sudden bloom of wild vanilla orchids in the Peppermint Peaks has caused the local sentinel glow-bugs to enter a state of sugar-induced hibernation, leaving the archives unlit.',
    socialHeading: 'REGIONAL MOOD ANALYSIS',
    socialBody: 'Highland towns report a 40% increase in involuntary smiling, which, while lovely, has led to a critical shortage of "Seriousness Essence" required for official ledger filing.',
    linkageHeading: 'DISTRIBUTION LOGISTICS',
    linkageTitle: 'MINISTRY ADVISORY:',
    linkageBody: 'The mint-scented mist has thickened. Rail transit through the Peaks is now restricted to "Double-Glazed" carriages only.',
    accentColor: 'text-cyan-400',
    glowColor: 'shadow-cyan-500/20'
  },
  {
    id: 'cocoa-canyons',
    taxTitle: 'THE DARK-MATTER COCOA DUTY',
    reasonHeading: 'THE GANACHE GUSH',
    reasonBody: 'Deep-vein exploration in the Cocoa Canyons hit a high-pressure pocket of molten fudge. The resulting overflow has filled the lower vaults with delicious, yet poorly organized, historical essence.',
    socialHeading: 'ESSENCE STABILITY SURVEY',
    socialBody: 'The province is currently "Over-Rich". Citizens are advised to consume extra wafer-biscuits to maintain internal buoyancy and prevent sinking into the fudge-plains.',
    linkageHeading: 'CORE INFRASTRUCTURE',
    linkageTitle: 'ARCHIVAL SYNC:',
    linkageBody: 'Chocolatebrook core stability has reached 99% viscosity. Thermal regulators at the Nougat Node are working overtime.',
    accentColor: 'text-rose-400',
    glowColor: 'shadow-rose-500/20'
  },
  {
    id: 'honey-infinity',
    taxTitle: 'THE GOLDEN HONEY TITHES',
    reasonHeading: 'THE NECTAR OVERFLOW',
    reasonBody: 'The Golden Infinity shores are experiencing a peak nectar-moth migration. The sheer volume of wing-sparkles has created a localized "Glitter Storm" that obscures the archive sensors.',
    socialHeading: 'VISIBILITY REPORT',
    socialBody: 'Sunglasses are now mandatory for all Ministry staff. The sunset is currently so beautiful it has been classified as a "Distraction Level 5" event.',
    linkageHeading: 'PROVINCIAL TRADE',
    linkageTitle: 'MARITIME STATUS:',
    linkageBody: 'Honey-moth wings are causing drag on the syrup-barges. Delivery of golden infinity concentrates is delayed by 2 beats.',
    accentColor: 'text-emerald-400',
    glowColor: 'shadow-emerald-500/20'
  },
  {
    id: 'marshmallow-moat',
    taxTitle: 'THE MARSHMALLOW MAINTENANCE FEE',
    reasonHeading: 'THE FLUFFY FRONTIER',
    reasonBody: 'Recent humidity levels in the Marshmallow Moat have reached "Extra-Squish" status. The structural marshmallows are losing their bounce, necessitating a strategic injection of toasted essence.',
    socialHeading: 'RESIDENT SATISFACTION',
    socialBody: 'Local children have started using the moat as a trampoline. Safety wardens are out of breath and require extra licorice-whistles to maintain order.',
    linkageHeading: 'DEFENSE LOGISTICS',
    linkageTitle: 'CONSTRUCTION STATUS:',
    linkageBody: 'The drawbridge is currently stuck in a "Semi-Solid" state. Please approach the Capital with caution.',
    accentColor: 'text-pink-400',
    glowColor: 'shadow-pink-500/20'
  },
  {
    id: 'licorice-lines',
    taxTitle: 'THE LICORICE LOGISTICS LEVY',
    reasonHeading: 'THE TANGLED TRACKS',
    reasonBody: 'The high-speed Licorice Lines have experienced a "Twist-Level 9" event due to excessive summer heat. Trains are arriving in knots, literally.',
    socialHeading: 'COMMUTER FEEDBACK',
    socialBody: 'Commuters from Whiskerton report that their 10-minute journey now takes 40 minutes of unraveling. On the bright side, the ride is now "Deliciously Recursive".',
    linkageHeading: 'TRANSPORT NETWORK',
    linkageTitle: 'RAIL ADVISORY:',
    linkageBody: 'Switching nodes at the Chocolatebrook Core are being lubricated with grade-A caramel to prevent further stickiness.',
    accentColor: 'text-indigo-400',
    glowColor: 'shadow-indigo-500/20'
  }
];
