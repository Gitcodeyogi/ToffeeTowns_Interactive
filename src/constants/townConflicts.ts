export interface TownConflict {
  unfairLaw: string;
  harmedCitizen: string;
  bosses: string;
  mayorAction: string;
  rebels: string;
  chucklebopAction: string;
  stakes: string;
}

export interface ConflictMeter {
  lawSeverity: number; // 0-100
  mayorEscalation: number; // 0-100
  citizenHarm: number; // 0-100
  stakesUrgency: number; // 0-100
  rebelActionStrength: number; // 0-100
  rebelCoordination: number; // 0-100
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export interface ConflictIndexes {
  bossPressureIndex: number;
  citizenStrain: number;
  rebelMomentum: number;
}

export const calculateConflictIndexesFromMeter = (meter: ConflictMeter): ConflictIndexes => {
  const lawSeverity = clamp(meter.lawSeverity / 100, 0, 1);
  const mayorEscalation = clamp(meter.mayorEscalation / 100, 0, 1);
  const harmIntensity = clamp(meter.citizenHarm / 100, 0, 1);
  const stakesUrgency = clamp(meter.stakesUrgency / 100, 0, 1);
  const rebelActionStrength = clamp(meter.rebelActionStrength / 100, 0, 1);
  const rebelCoordination = clamp(meter.rebelCoordination / 100, 0, 1);

  // Split model: Bosses vs Rebels must sum to 100 for instant readability.
  const bossForce =
    lawSeverity * 0.34 +
    mayorEscalation * 0.26 +
    harmIntensity * 0.22 +
    stakesUrgency * 0.18;

  const rebelForce =
    rebelActionStrength * 0.42 +
    rebelCoordination * 0.33 +
    (1 - lawSeverity) * 0.10 +
    (1 - harmIntensity) * 0.15;

  const totalForce = Math.max(0.0001, bossForce + rebelForce);
  const rawBossShare = clamp((bossForce / totalForce) * 100, 0, 100);
  // Story-display scaling: widen gaps so control swings are easy to read.
  const dramaticBossShare = clamp(50 + (rawBossShare - 50) * 1.65, 10, 90);
  const bossShare = clamp(Math.round(dramaticBossShare), 10, 90);
  const rebelShare = 100 - bossShare;

  // Citizen strain remains independent of control split.
  const citizenRaw =
    harmIntensity * 0.50 +
    stakesUrgency * 0.24 +
    lawSeverity * 0.16 +
    mayorEscalation * 0.10;

  return {
    bossPressureIndex: bossShare,
    citizenStrain: clamp(Math.round(22 + citizenRaw * 74), 22, 96),
    rebelMomentum: rebelShare,
  };
};

export const validateTownConflictMeters = (townIds: string[]): string[] => {
  const errors: string[] = [];
  const meterIds = Object.keys(TOWN_CONFLICT_METERS);

  for (const townId of townIds) {
    const meter = TOWN_CONFLICT_METERS[townId];
    if (!meter) {
      errors.push(`Missing meter for town id: ${townId}`);
      continue;
    }

    for (const [key, raw] of Object.entries(meter)) {
      const value = Number(raw);
      if (!Number.isFinite(value)) {
        errors.push(`Meter ${townId}.${key} is not a finite number`);
        continue;
      }
      if (value < 0 || value > 100) {
        errors.push(`Meter ${townId}.${key} out of range (${value}). Expected 0-100.`);
      }
    }
  }

  for (const meterId of meterIds) {
    if (!townIds.includes(meterId)) {
      errors.push(`Meter id has no matching town id: ${meterId}`);
    }
  }

  return errors;
};

// Explicit per-town meter configuration for stable, reviewable index outputs.
export const TOWN_CONFLICT_METERS: Record<string, ConflictMeter> = {
  'toffee-town': { lawSeverity: 90, mayorEscalation: 88, citizenHarm: 84, stakesUrgency: 92, rebelActionStrength: 68, rebelCoordination: 63 },
  'peppermint-peak': { lawSeverity: 82, mayorEscalation: 79, citizenHarm: 74, stakesUrgency: 81, rebelActionStrength: 77, rebelCoordination: 75 },
  'eclair-square': { lawSeverity: 66, mayorEscalation: 62, citizenHarm: 58, stakesUrgency: 64, rebelActionStrength: 82, rebelCoordination: 80 },
  'creme-tunnels': { lawSeverity: 86, mayorEscalation: 83, citizenHarm: 79, stakesUrgency: 88, rebelActionStrength: 75, rebelCoordination: 72 },
  'praline-port': { lawSeverity: 68, mayorEscalation: 61, citizenHarm: 59, stakesUrgency: 73, rebelActionStrength: 81, rebelCoordination: 79 },
  'banoffee-valley': { lawSeverity: 45, mayorEscalation: 40, citizenHarm: 35, stakesUrgency: 50, rebelActionStrength: 88, rebelCoordination: 92 },
  'ganache-grove': { lawSeverity: 93, mayorEscalation: 92, citizenHarm: 89, stakesUrgency: 96, rebelActionStrength: 78, rebelCoordination: 74 },
  'cocoa-canyon': { lawSeverity: 91, mayorEscalation: 89, citizenHarm: 92, stakesUrgency: 95, rebelActionStrength: 74, rebelCoordination: 72 },
  'lava-cake-lake': { lawSeverity: 88, mayorEscalation: 85, citizenHarm: 90, stakesUrgency: 93, rebelActionStrength: 76, rebelCoordination: 73 },
  'brownie-crossroads': { lawSeverity: 80, mayorEscalation: 78, citizenHarm: 72, stakesUrgency: 86, rebelActionStrength: 82, rebelCoordination: 80 },
  'hazelnut-terrace': { lawSeverity: 72, mayorEscalation: 69, citizenHarm: 63, stakesUrgency: 67, rebelActionStrength: 78, rebelCoordination: 76 },
  'peanut-butter-falls': { lawSeverity: 70, mayorEscalation: 64, citizenHarm: 66, stakesUrgency: 72, rebelActionStrength: 79, rebelCoordination: 81 },
  'honeycomb-heights': { lawSeverity: 78, mayorEscalation: 76, citizenHarm: 68, stakesUrgency: 74, rebelActionStrength: 72, rebelCoordination: 70 },
  'nougat-node': { lawSeverity: 84, mayorEscalation: 82, citizenHarm: 77, stakesUrgency: 89, rebelActionStrength: 74, rebelCoordination: 71 },
  'sprinkle-sands': { lawSeverity: 62, mayorEscalation: 58, citizenHarm: 54, stakesUrgency: 60, rebelActionStrength: 85, rebelCoordination: 84 },
  'butterscotch-bay': { lawSeverity: 60, mayorEscalation: 57, citizenHarm: 53, stakesUrgency: 59, rebelActionStrength: 84, rebelCoordination: 83 },
  'caramel-cove': { lawSeverity: 58, mayorEscalation: 55, citizenHarm: 50, stakesUrgency: 56, rebelActionStrength: 86, rebelCoordination: 85 },
};

export const TOWN_CONFLICTS: Record<string, TownConflict> = {
  'toffee-town': {
    unfairLaw: 'Morning Stretch Tax: every worker must join the Mayor\'s morning stretch parade, or lose the day\'s wages.',
    harmedCitizen: 'The parade starts very early and changes time often. People stand long on sticky streets, get tired before work, and small mistakes cost full pay.',
    bosses: 'Mayor Pompelmoose + Sheriff Bumblewood',
    mayorAction: 'The Mayor says, "Strong towns stretch together." The Town Head adds, "Discipline shows loyalty. No stretch, no wages. No excuse."',
    rebels: 'Nella Nudgepot and rebel helpers guide tired workers early and quietly defend the sick and weak.',
    chucklebopAction: 'Archer Chucklebop tries to win fair timing and humane exceptions, but the watcher sees everything, names are recorded, and rebels are forced to step back.',
    stakes: 'Work starts late, bodies ache all day, and families earn less even after obeying. Anyone late is stamped NO WAGES. The Town Head obeys the Mayor, the Mayor obeys X, and people obey because they are watched.',
  },
  'eclair-square': {
    unfairLaw: 'Glaze Queue Rule lets noble pastry lines skip all public ovens before festival hours.',
    harmedCitizen: 'Small bakers lose their morning bake window and throw away batter.',
    bosses: 'Mayor Pompelmoose + Sir Goldwhistle',
    mayorAction: 'The Mayor stamps gold queue passes and moves public bakers to late-night slots.',
    rebels: 'Whiskerton and plaza bakers collect side-by-side timing logs.',
    chucklebopAction: 'Archer Chucklebop runs a blind tasting line proving public ovens outperformed the premium queue.',
    stakes: 'If oven access is rigged here, fair trade pricing breaks across nearby market towns.',
  },
  'hazelnut-terrace': {
    unfairLaw: 'Harvest First Decree sends top hazelnut crates to elite terraces before town stalls open.',
    harmedCitizen: 'Family praline stalls get cracked leftovers and lose regular buyers.',
    bosses: 'Crumblewise + terrace guild clerks',
    mayorAction: 'The Mayor launches a "quality shield" policy and seals premium nut stock behind ribbon gates.',
    rebels: 'Nella Nudgepot gathers inventory slips from hillside loaders.',
    chucklebopAction: 'Archer Chucklebop opens a public weighing demo that exposes the diverted premium crates.',
    stakes: 'Nut quality control decides whether terrace workers can survive the season.',
  },
  'peanut-butter-falls': {
    unfairLaw: 'Raft Permit Lock forces independent river crews to buy triple-fee safety badges.',
    harmedCitizen: 'Young raft pilots are blocked from routes and miss daily cargo pay.',
    bosses: 'Marshal Frill + dock permit board',
    mayorAction: 'The Mayor converts common ramps into "premium launch lanes" guarded by collectors.',
    rebels: 'Bounce McDrizzle and river families map blocked ramps and empty elite slots.',
    chucklebopAction: 'Archer Chucklebop coordinates a timed rescue route proving shared lanes are safer and faster.',
    stakes: 'River access keeps food, medicine, and ferry jobs moving between zone towns.',
  },
  'sprinkle-sands': {
    unfairLaw: 'Color Purity Rule bans mixed-sprinkle families from beach stalls.',
    harmedCitizen: 'Young artists lose permits, stalls, and daily sales.',
    bosses: 'Marshal Frill enforces color checkpoints.',
    mayorAction: 'The Mayor runs a Pure Parade and gives permits only to one-color teams.',
    rebels: 'Bounce McDrizzle starts a mixed-team beach fair.',
    chucklebopAction: 'Archer Chucklebop hosts a public game where mixed teams sell more and win louder cheers.',
    stakes: 'Either the beach stays split, or the town learns to trade together.',
  },
  'honeycomb-heights': {
    unfairLaw: 'High Climb Permit allows only noble crews into rich honey chambers.',
    harmedCitizen: 'Skilled local climbers are locked out of their best work.',
    bosses: 'Crumblewise (Boss Authority) controls permit office.',
    mayorAction: 'The Mayor renames upper cliffs as heritage zones and sells shiny climb badges at gala prices.',
    rebels: 'Lanternella Glowfern maps safe side paths for workers.',
    chucklebopAction: 'Archer Chucklebop swaps score boards on lift day and exposes rigged permit marks.',
    stakes: 'Control of the richest honey decides who eats and who starves.',
  },
  'lava-cake-lake': {
    unfairLaw: 'Heat License is required to use healing hot springs.',
    harmedCitizen: 'Burned workers are turned away from treatment pools.',
    bosses: 'Marshal Qrill (Boss Authority)',
    mayorAction: 'The Mayor sells gold steam bands and sends paying guests ahead of injured workers.',
    rebels: 'Bounce McDrizzle sneaks first-aid kits to gate lines.',
    chucklebopAction: 'Archer Chucklebop brings medics to speak publicly until emergency entry becomes law.',
    stakes: 'In danger zones, healing must come first.',
  },
  'peppermint-peak': {
    unfairLaw: 'Sled Tax adds heavy fees to every downhill delivery.',
    harmedCitizen: 'Mountain couriers lose profit at every snow gate.',
    bosses: 'Sheriff Bumblewood (Boss Authority)',
    mayorAction: 'The Mayor creates Winter Revenue Patrol and turns snow checkpoints into coin traps.',
    rebels: 'Lanternella Glowfern opens safe side trails for couriers.',
    chucklebopAction: 'Archer Chucklebop runs one timed convoy that beats every checkpoint and proves the route can stay open.',
    stakes: 'Winter food and medicine flow for many towns.',
  },
  'butterscotch-bay': {
    unfairLaw: 'Sunset Dock Fee triples after one hour, favoring noble ships.',
    harmedCitizen: 'Local fishers cannot pay for evening dock time.',
    bosses: 'Rebel Authority (Led by Fisherman Whimsley)',
    mayorAction: 'The Mayor opens a luxury sunset lane and pushes town boats off the best docks.',
    rebels: 'Fisherman Whimsley unites dock workers and small crews.',
    chucklebopAction: 'Archer Chucklebop runs a lantern boat parade that shows noble berths sitting empty.',
    stakes: 'Dock fairness keeps the whole bay alive.',
  },
  'brownie-crossroads': {
    unfairLaw: 'Crossroad Gate Clock fines wagons if they miss a narrow boss-approved timing window.',
    harmedCitizen: 'Family caravans lose coin and sleep while elite convoys pass freely.',
    bosses: 'Mayor Pompelmoose (Boss Authority)',
    mayorAction: 'The Mayor installs golden gate clocks and doubles penalties on "late" public wagons.',
    rebels: 'Fisherman Whimsley and Tibbin Quickstep track real queue delays with route witnesses.',
    chucklebopAction: 'Archer Chucklebop projects live lane timing and exposes manipulated gate timings.',
    stakes: 'Crossroads fairness determines supply stability for almost every province route.',
  },
  'creme-tunnels': {
    unfairLaw: 'Vein Access Decree blocks regular explorers from central cream routes unless they buy premium permits.',
    harmedCitizen: 'Guides, cart workers, and family vendors lose safe passage and daily income.',
    bosses: 'Mayor Pompelmoose (Boss Authority)',
    mayorAction: 'The Mayor seals corridor hubs, adds checkpoint gates, and prioritizes elite tour passes.',
    rebels: 'Tibbin Quickstep and local route mappers publish blocked-lane evidence.',
    chucklebopAction: 'Archer Chucklebop opens a public route map at Vein Route Exchange and forces transparent access lanes.',
    stakes: 'If corridor access stays privatized, emergency supplies and family trade collapse across underground districts.',
  },
  'praline-port': {
    unfairLaw: 'Dock Waiver Waltz lets elite cargo ships bypass inspection and unload before local crews.',
    harmedCitizen: 'Independent traders lose hours at the quay and watch fresh stock spoil while premium berths sit protected.',
    bosses: 'Harbor clerks + waiver board',
    mayorAction: 'The Mayor adds ribbon-only waiver lanes and turns customs review into a pay-to-skip ceremony.',
    rebels: 'Tibbin Quickstep and harbor poets collect dock ledgers, wait times, and berth occupancy logs.',
    chucklebopAction: 'Archer Chucklebop projects the real dock schedule across the harbor wall and exposes the empty elite lanes.',
    stakes: 'Port fairness determines whether nut cargo, medicine, and family trade can move across the coast on time.',
  },
  'caramel-cove': {
    unfairLaw: 'Surf Permit Lottery is rigged for noble leisure clubs.',
    harmedCitizen: 'Local coaches and youth teams lose sea access.',
    bosses: 'Rebel Authority (Led by Tibbin Quickstep)',
    mayorAction: 'The Mayor turns the draw into a fancy gala where rich patrons pre-pick the winners.',
    rebels: 'Tibbin Quickstep records the full draw trick.',
    chucklebopAction: 'Archer Chucklebop restarts the lottery in open daylight with town heads watching.',
    stakes: 'Fair access for youth jobs and surf schools.',
  },
  'nougat-node': {
    unfairLaw: 'Crossroad Priority Pass lets noble caravans block public lanes.',
    harmedCitizen: 'Farm wagons wait so long that food spoils.',
    bosses: 'Marshal Frill (Boss Authority)',
    mayorAction: 'The Mayor orders Gold Lane Protocol: stop all town traffic when elite carts pass.',
    rebels: 'Bounce McDrizzle leads volunteer lane guides.',
    chucklebopAction: 'Archer Chucklebop flips route signs at rush hour and frees blocked supply lines.',
    stakes: 'Crossroads control food and medicine for the province.',
  },
  'ganache-grove': {
    unfairLaw: 'Twilight Curfew bans non-noble gathering after dusk.',
    harmedCitizen: 'Night workers and healers are stopped or arrested.',
    bosses: 'Marshal Qrill (Boss Authority)',
    mayorAction: 'The Mayor sounds curfew sirens and pays informants for every late lantern report.',
    rebels: 'Tibbin Quickstep guides safe night routes for workers.',
    chucklebopAction: 'Archer Chucklebop leads a calm lantern march until the curfew is rolled back.',
    stakes: 'Safe movement and equal rights at night.',
  },
  'cocoa-canyon': {
    unfairLaw: 'Rescue rafts and medicine boats pay double river toll.',
    harmedCitizen: 'Injured canyon workers wait too long for healers.',
    bosses: 'Professor Finley (Boss Authority) grants toll waivers only to friends.',
    mayorAction: 'The Mayor opens VIP river lanes while rescue rafts stand behind velvet ropes.',
    rebels: 'Fisherman Whimsley runs quiet night rescue routes.',
    chucklebopAction: 'Archer Chucklebop posts a simple board: toll coins up, patient safety down.',
    stakes: 'Fast care saves lives in canyon towns.',
  },
  'banoffee-valley': {
    unfairLaw: 'Banana Ripeness Tax: every orchard must pay a portion of their harvest based on the "perceived freshness" of the dawn mist.',
    harmedCitizen: 'Small orchard owners are fined for misty mornings they cannot control, causing them to lose their livelihood.',
    bosses: 'Beni Banana (Town Head) reports to Rebels',
    mayorAction: 'The Mayor claims the mist is provincial property. The Town Head coordinates with Rebels to hide the best harvests.',
    rebels: 'Beni Banana and the Orchard Underground lead the resistance against mist-taxes.',
    chucklebopAction: 'Archer Chucklebop helps divert inspectors and ensures fair distribution of the hidden fruit.',
    stakes: 'If the tax is enforced, the valley cooperative will collapse, ending the banoffee pie legacy.',
  },
};

