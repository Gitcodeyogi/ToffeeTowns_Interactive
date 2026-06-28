import React, { useState } from 'react';
import { useTTStore } from '../store/useTTStore';

const FONT = '"Luckiest Guy", cursive';

interface LoreSection {
  title: string;
  content: string;
}

interface CharacterStats {
  mischief: number;
  agility: number;
  courage: number;
  strength: number;
}

interface Character {
  id: string;
  name: string;
  role: string;
  clan: 'Neutral' | 'Rebels' | 'Bosses';
  image: string;
  description: string;
  age: string;
  specialty: string;
  favoriteProp: string;
  dialogues: string[];
  loreSections: LoreSection[];
  stats: CharacterStats;
  gender: 'Boy' | 'Girl';
}

const CHARACTERS: Character[] = [
  {
    id: 'goldwhistle',
    name: 'Sir Goldwhistle',
    role: 'Tax Auditor',
    clan: 'Bosses',
    image: '/Characters/Char Cards/Nico_Whistle.png',
    description: 'The most feared man in town, not for his strength, but for his audit logs. Sir Goldwhistle can find a penny in a haystack and will tax you for finding it.',
    age: '48',
    specialty: 'Financial Auditing',
    favoriteProp: 'Auditing Ledger',
    dialogues: [
      '"Ensure your financial ledger is prepared for inspections."',
      '"Every relocation request must be verified by local bylaws."',
      '"Time is money, and money is coins!"'
    ],
    loreSections: [
      { title: 'Audit Book', content: 'Sir Goldwhistle carries a golden pocket calculator and keeps record of every penny.' }
    ],
    stats: { mischief: 5, agility: 45, courage: 70, strength: 50 },
    gender: 'Boy'
  },
  {
    id: 'pipkin',
    name: 'Pipkin Nutterby',
    role: 'Prankster & Adventurer',
    clan: 'Neutral',
    image: '/Characters/pipkin_nutterby.png',
    description: 'A 11-year-old bundle of endless curiosity and wild ideas with messy dark brown forest hair and a signature wild front tuft.',
    age: '11',
    specialty: 'Accidental Heroism',
    favoriteProp: 'Wooden Slingshot',
    dialogues: [
      '"I have a brilliant idea! It involves three pinecones and zero adult supervision!"',
      '"If we feed caramel cows glowing berries, do you think they\'ll produce glowing cream?"',
      '"Sir Goldwhistle\'s audit ledger makes a great slide!"'
    ],
    loreSections: [
      { title: 'The Satchel Mystery', content: 'Pipkin carries a small leather satchel everywhere. Nobody in Ganache Grove knows what is inside—including Pipkin himself.' }
    ],
    stats: { mischief: 98, agility: 98, courage: 95, strength: 40 },
    gender: 'Boy'
  },
  {
    id: 'winston',
    name: 'Captain Winston Butterfield',
    role: 'Town Explorer & Detective',
    clan: 'Bosses',
    image: '/Characters/Char Cards/Hugo_Glass.png',
    description: 'The bombastic and sharp detective of Ganache Grove, wearer of the county\'s largest explorer helmet. He solves local mysteries and routes cargo traffic.',
    age: '55',
    specialty: 'Clue Tracking & Navigation',
    favoriteProp: 'Golden Compass',
    dialogues: [
      '"Splendid day! The civic security of this district is my personal responsibility, you understand."',
      '"I am tracing a trail of crumb residues leading straight from the bakery to the docks!"',
      '"A clean case is a happy case!"'
    ],
    loreSections: [
      { title: 'The Compass', content: 'Winston\'s compass is gold-plated and points directly to the nearest sugar deposit when shaken.' }
    ],
    stats: { mischief: 10, agility: 50, courage: 85, strength: 60 },
    gender: 'Boy'
  },
  {
    id: 'percival',
    name: 'Percival Tinkersprocket',
    role: 'Town Head',
    clan: 'Bosses',
    image: '/Characters/Char Cards/Hugo_Glass.png',
    description: 'The official Town Head of Ganache Grove. He drafts the local bylaws, manages the council chamber, and ensures the elevated walkways are in perfect code.',
    age: '41',
    specialty: 'Bylaw Writing & Administration',
    favoriteProp: 'Gavel of Authority',
    dialogues: [
      '"Order! Order in the council chambers!"',
      '"Let us vote on the new cottage storage expansion policies immediately."',
      '"Every resident registry must be signed and certified by my office."'
    ],
    loreSections: [
      { title: 'Council Chair', content: 'Percival has held the Town Head title for three consecutive terms, surviving seven procedural disputes.' }
    ],
    stats: { mischief: 15, agility: 55, courage: 75, strength: 60 },
    gender: 'Boy'
  },
  {
    id: 'rowan',
    name: 'Rowan Thistle',
    role: 'Builder Apprentice',
    clan: 'Rebels',
    image: '/Characters/Char Cards/Milo_Spark.png',
    description: 'The hardworking apprentice builder who maintains the elevated walkways and helps construct cozy houses for new residents.',
    age: '24',
    specialty: 'Carpentry & Layouts',
    favoriteProp: 'Steel Carpenter Rule',
    dialogues: [
      '"Greetings, traveller! Can I help you with some carpentry calculations?"',
      '"Measure twice and cut once—especially when working with chocolate logs!"',
      '"The Ganache Boardwalk is safe under my watch!"'
    ],
    loreSections: [
      { title: 'The Boardwalk Bridge', content: 'Rowan spent three months reinforcing the bridge arches spanning the Ganache River rapids.' }
    ],
    stats: { mischief: 20, agility: 75, courage: 80, strength: 80 },
    gender: 'Boy'
  },
  {
    id: 'sheriff',
    name: 'Sheriff Aldous Bramfield',
    role: 'Town Sheriff',
    clan: 'Bosses',
    image: '/Characters/Char Cards/Zara_Quill.png',
    description: 'The brave and colorful sheriff of the town. He monitors path curfews and ensures no sugar thieves wander into the forest after hours.',
    age: '30',
    specialty: 'Lanes Patrol & Law Enforcement',
    favoriteProp: 'Polished Silver Badge',
    dialogues: [
      '"Halt! State your name and business in Ganache Grove."',
      '"Keep your passport stamped and stay alert!"',
      '"Justice is sweet, but the law is tough!"'
    ],
    loreSections: [
      { title: 'The Bramble Chase', content: 'Sheriff Aldous Bramfield once chased down a pack of wild sugar gliders that took off with a chest of coins.' }
    ],
    stats: { mischief: 15, agility: 80, courage: 90, strength: 75 },
    gender: 'Boy'
  },
  {
    id: 'frill',
    name: 'Marshal Frill',
    role: 'Sheriff Deputy',
    clan: 'Bosses',
    image: '/characters/boss_Marshal_-_Frill.png',
    description: 'The strict deputy enforcer who loves writing citations for minor pathway infractions and loitering after curfew hours.',
    age: '29',
    specialty: 'Bylaw Citations & Curfew Checks',
    favoriteProp: 'Citation Pen',
    dialogues: [
      '"Running with honey jars is a class B county infraction!"',
      '"Officer logs recorded. Carry on, citizen."',
      '"No loitering near the monorail terminal!"'
    ],
    loreSections: [
      { title: 'The Citation Record', content: 'Frill has filed over 120 citations this month alone, mostly for public slingshot usage.' }
    ],
    stats: { mischief: 10, agility: 70, courage: 75, strength: 80 },
    gender: 'Boy'
  },
  {
    id: 'qrill',
    name: 'Marshal Qrill',
    role: 'Sheriff Deputy',
    clan: 'Bosses',
    image: '/characters/boss_Marshal_-_Qrill.png',
    description: 'The detail-oriented deputy marshal who coordinates patrol sectors and calibrates security gates around the town square.',
    age: '28',
    specialty: 'Grid Patrol & Security Mechanics',
    favoriteProp: 'Terminal Keycard',
    dialogues: [
      '"Marshal Qrill here. Main gate coordinates verified."',
      '"Maintain grid position, citizen."',
      '"Tactical security checks are running on schedule."'
    ],
    loreSections: [
      { title: 'Signal Calibration', content: 'Qrill designed the automated signal lanterns that light up during curfews.' }
    ],
    stats: { mischief: 12, agility: 78, courage: 70, strength: 75 },
    gender: 'Boy'
  },
  {
    id: 'petalworth',
    name: 'Mrs. Petalworth',
    role: 'Flower Merchant',
    clan: 'Rebels',
    image: '/characters/boss_FlowerVendor-Mrs._petalworth.png',
    description: 'The town\'s flower vendor whose shop is a key coordination point for citizen letters and forest pathways.',
    age: '62',
    specialty: 'Floral Merchandising',
    favoriteProp: 'Secateurs & Scissors',
    dialogues: [
      '"Hello, dear heart! The sugar lilies are blooming beautifully today."',
      '"If you wrap sugar lily stems in wet vellum, it preserves the scent for weeks."',
      '"A bit of water and sunshine makes all of Ganache Grove smile."'
    ],
    loreSections: [
      { title: 'The Seed Ledger', content: 'Mrs. Petalworth keeps a catalog of over 200 rare flower seeds from the valleys.' }
    ],
    stats: { mischief: 40, agility: 65, courage: 75, strength: 40 },
    gender: 'Girl'
  },
  {
    id: 'maribel',
    name: 'Maribel Nutterby',
    role: 'Seamstress',
    clan: 'Neutral',
    image: '/Characters/Char Cards/Bella_Daisy.png',
    description: 'Pipkin\'s patient mother and the town\'s premier seamstress, who keeps everyone\'s velvet coats and backpacks neatly repaired.',
    age: '38',
    specialty: 'Mending & Thread Craft',
    favoriteProp: 'Silver Needle',
    dialogues: [
      '"Pipkin! If you have launched another pinecone, so help me..."',
      '"A good stitch in time saves nine."',
      '"I\'m sewing a new lining for Captain Winston\'s hat."'
    ],
    loreSections: [
      { title: 'Mending Master', content: 'Maribel has patched over a thousand pocket tears caused by Pipkin\'s slingshot bolts.' }
    ],
    stats: { mischief: 20, agility: 85, courage: 70, strength: 45 },
    gender: 'Girl'
  },
  {
    id: 'page',
    name: 'Miss Page Bumblewick',
    role: 'Troubled Neighbor',
    clan: 'Neutral',
    image: '/Characters/Char Cards/Bella_Daisy.png',
    description: 'A troubled neighbor who spends her hours watching the street and growing rare, delicate glowing plants in her backyard garden.',
    age: '65',
    specialty: 'Rare Horticulture',
    favoriteProp: 'Botanical Watering Can',
    dialogues: [
      '"I\'m busy weeding my rare plants. Don\'t stomp on my lawn hedges!"',
      '"My glowing orchids only open their petals when the bells ring for curfew."',
      '"Keep those noisy slingshot children away from my greenhouse!"'
    ],
    loreSections: [
      { title: 'The Orchid Garden', content: 'Miss Page has bred a special purple orchid that glows in the dark and smells like peppermint.' }
    ],
    stats: { mischief: 55, agility: 40, courage: 65, strength: 30 },
    gender: 'Girl'
  },
  {
    id: 'crumbleton',
    name: 'Baker Bramble Mortimer',
    role: 'Baker',
    clan: 'Neutral',
    image: '/Characters/Char Cards/Milo_Spark.png',
    description: 'The jolly proprietor of the Butterbun Bakery. He believes a warm croissant is the solution to any dispute.',
    age: '45',
    specialty: 'Bread Chemistry & Pastry',
    favoriteProp: 'Golden Rolling Pin',
    dialogues: [
      '"A fresh batch of cocoa-buns is out! Get them while they\'re warm!"',
      '"Why did the cake go to the doctor? Because it was feeling a bit crumby!"',
      '"Folding the butter seventy-two times makes the perfect puff pastry."'
    ],
    loreSections: [
      { title: 'The Flying Loaf', content: 'Baker Bramble Mortimer once baked a cake so light that it floated right out of the chimney.' }
    ],
    stats: { mischief: 15, agility: 40, courage: 60, strength: 80 },
    gender: 'Boy'
  },
  {
    id: 'cedric_w',
    name: 'Professor Finley',
    role: 'Academy Principal',
    clan: 'Neutral',
    image: '/Characters/Char Cards/Hugo_Glass.png',
    description: 'The scholarly principal of the academy, whose spectacles are always perched on the tip of his nose.',
    age: '50',
    specialty: 'Grammar & Town History',
    favoriteProp: 'Oversized Chalk',
    dialogues: [
      '"Grammar is the sugar-mortar that binds the bricks of society together!"',
      '"Today we study the Great Molasses Flood of Year 120."',
      '"A fine mind is the resident\'s greatest asset."'
    ],
    loreSections: [
      { title: 'Historical Records', content: 'Professor Finley has translated over forty ancient scrolls detailing early county settlements.' }
    ],
    stats: { mischief: 5, agility: 45, courage: 70, strength: 50 },
    gender: 'Boy'
  },
  {
    id: 'horace',
    name: 'Horace Ticklebell',
    role: 'Railway Stationmaster',
    clan: 'Bosses',
    image: '/Characters/Char Cards/Nico_Whistle.png',
    description: 'The schedule-obsessed stationmaster of the monorail terminal, always seen polishing clocks and checking schedules.',
    age: '42',
    specialty: 'Terminal Schedule Synchronization',
    favoriteProp: 'Brass Pocket Watch',
    dialogues: [
      '"The 10:14 Cocoa Express waits for no one! Board immediately!"',
      '"Punctuality is the courtesy of kings, and railway stationmasters."',
      '"Keep luggage clear of the gate sensors, please."'
    ],
    loreSections: [
      { title: 'Second Hand Sync', content: 'Horace checks his pocket watch seventy times a day against the station master pendulum.' }
    ],
    stats: { mischief: 10, agility: 65, courage: 75, strength: 65 },
    gender: 'Boy'
  },
  {
    id: 'hazel',
    name: 'Dr. Cedric Oakenhart',
    role: 'Town Physician',
    clan: 'Neutral',
    image: '/Characters/Char Cards/Bella_Daisy.png',
    description: 'The warm-hearted physician of Ganache Grove. She mixes herbal salves, cough syrups, and cooling remedies to heal local ailments.',
    age: '33',
    specialty: 'Herbal Medicine & Diagnostic Care',
    favoriteProp: 'Apothecary Mortar & Pestle',
    dialogues: [
      '"Welcome! Sit down, rest your feet, and let me check that spore cough."',
      '"High-purity forest moss makes the best cooling pack for fevers."',
      '"A quiet day at the clinic is a sign of a healthy town."'
    ],
    loreSections: [
      { title: 'Clinic Apothecary', content: 'Dr. Cedric Oakenhart keeps a cabinet of dried lavender, cooling moss, and healing syrups to treat residents.' }
    ],
    stats: { mischief: 15, agility: 60, courage: 70, strength: 45 },
    gender: 'Boy'
  },
  {
    id: 'hugo',
    name: 'Blacksmith Crumblewise',
    role: 'Forge Master',
    clan: 'Neutral',
    image: '/Characters/Char Cards/Hugo_Glass.png',
    description: 'The soft-spoken blacksmith who shapes iron tools, structural carriage brackets, and copper gears in his workshop.',
    age: '40',
    specialty: 'Forge Operation & Steelcrafting',
    favoriteProp: 'Heavy Sledgehammer',
    dialogues: [
      '"The forge is hot and the metal is ready. Need a tool repaired?"',
      '"Metal might be hard, but you have to treat it with a soft touch."',
      '"Wood and steel are the true backbone of this town."'
    ],
    loreSections: [
      { title: 'The Harmonica Melodies', content: 'Blacksmith Crumblewise plays quiet mouth-harp songs while waiting for the furnace coal to heat up.' }
    ],
    stats: { mischief: 10, agility: 50, courage: 85, strength: 95 },
    gender: 'Boy'
  },
  {
    id: 'cinder',
    name: 'Bounce McDrizzle',
    role: 'Innkeeper',
    clan: 'Rebels',
    image: '/Assets/Ganache Grove/Characters/Innkeeper_townsfolk.png',
    description: 'The friendly innkeeper of Ganache Grove, owner of the Hearthstone Tavern & Inn, who welcomes all weary travelers with a warm bowl of cocoa stew.',
    age: '26',
    specialty: 'Innkeeping & Cocoa Stew',
    favoriteProp: 'Golden Ladle',
    dialogues: [
      '"Welcome! Sit by the hearth and let me get you a warm bowl of cocoa stew!"',
      '"A cozy room and a soft bed will cure any traveler\'s exhaustion!"',
      '"The Hearthstone Tavern is always open for friends!"'
    ],
    loreSections: [
      { title: 'The Cinnamon Recipe', content: 'Bounce uses a pinch of spicy cinnamon in the tavern fireplace to keep guest rooms extra warm.' }
    ],
    stats: { mischief: 30, agility: 82, courage: 88, strength: 70 },
    gender: 'Boy'
  },
  {
    id: 'finch',
    name: 'Caramel Finch',
    role: 'Businessman & Merchant',
    clan: 'Neutral',
    image: '/characters/rebel_Fisherman-Whimsley.png',
    description: 'The fast-talking businessman and general merchant who handles wholesale imports and coordinates trade routes across the province.',
    age: '35',
    specialty: 'Commerce & Guild Trading',
    favoriteProp: 'Golden Fountain Pen',
    dialogues: [
      '"Time is coins, and coins are opportunity! Let\'s talk business!"',
      '"Buy low, sell high, and keep your cargo warehouse clean!"',
      '"For wholesale items, sign off on my route invoices."'
    ],
    loreSections: [
      { title: 'Finch Guild License', content: 'Caramel Finch holds a rare golden business permit signed by the central governor.' }
    ],
    stats: { mischief: 45, agility: 70, courage: 75, strength: 55 },
    gender: 'Boy'
  }
];

const CharactersPage: React.FC = () => {
  const { setPage, addLegacy, skills, legacyPoints, headerHidden } = useTTStore();
  const [selectedIdx, setSelectedIdx] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'bio' | 'lore' | 'chat'>('bio');
  const [activeQuote, setActiveQuote] = useState<string | null>(null);

  const char = CHARACTERS[selectedIdx];
  const getCharacterDossier = (charId: string) => {
    const builderLvl = Math.floor((skills?.builder || 0) / 10) + 1;
    
    const getStanding = (points: number) => {
      if (points >= 1000) return 'Legend of Chocobrook';
      if (points >= 500) return 'Provincial Figure';
      if (points >= 250) return 'Community Leader';
      if (points >= 100) return 'Trusted Citizen';
      if (points >= 50) return 'Resident';
      return 'New Arrival';
    };
    
    const standing = getStanding(legacyPoints || 0);

    switch (charId) {
      case 'goldwhistle':
        return {
          quote: "Time is money, and money is coins. Ensure your accounts are compliant.",
          activities: "Auditing registry books, compiling tax reports, and checking treasury balances.",
          record: "Identified 47 financial irregularities this quarter. Zero missed ledgers.",
          sync: `Sir Goldwhistle stamps your profile: 'You are registered as a compliant ${standing} in the county logs!'`
        };
      case 'pipkin':
        return {
          quote: "I have a brilliant idea! It involves three pinecones and absolutely zero adult supervision!",
          activities: "Crafting pinecone launchers, sliding down monorail safety rails, and exploring old belfries.",
          record: "147 accidental incidents. Warned twice for excessive tuft wildness.",
          sync: `Pipkin whispers: 'Your builder skill (Level ${builderLvl}) is great, but don't let me borrow your hammer!'`
        };
      case 'winston':
        return {
          quote: "I am tracing a trail of crumb residues leading straight from the bakery to the docks!",
          activities: "Tracking footprints on moss lanes, logging river currents, and inspecting dock cargo.",
          record: "Solved 14 minor mysteries. Logged 400 harbor vessel arrivals.",
          sync: `Detective Winston nods: 'Excellent work, citizen. As a ${standing}, your standing keeps the grove safe.'`
        };
      case 'percival':
        return {
          quote: "Order! Order in the council chambers! The registry needs certifying.",
          activities: "Presiding over council meetings, signing housing deeds, and drafting monorail codes.",
          record: "3 consecutive terms as Town Head. Zero regulatory deadlocks.",
          sync: `Town Head Percival smiles: 'Your contributions to local building (Level ${builderLvl}) are highly valued!'`
        };
      case 'rowan':
        return {
          quote: "Greetings, traveller! Can I help you with some carpentry calculations?",
          activities: "Hammering walkway trusses, cutting chocolate timber, and aligning boardwalk lanes.",
          record: "Completed Ganache River bridge restoration. Zero safety failures.",
          sync: `Rowan waves: 'Your builder skill is level ${builderLvl}! Let's build something grand together.'`
        };
      case 'sheriff':
        return {
          quote: "Halt! State your name and business. I keep these lanes safe from sugar thieves.",
          activities: "Patrolling moss walkway lanes, monitoring curfews, and filing report sheets.",
          record: "Recovered 3 stolen coffer chests. Curfew violations reduced by 30%.",
          sync: `Sheriff Aldous Bramfield salutes: 'The office of the Sheriff is glad to have a ${standing} on our side!'`
        };
      case 'frill':
        return {
          quote: "Running with honey jars is a class B county infraction! That is a citation.",
          activities: "Writing ticket slips, checking walkway speed limits, and inspecting monorail passengers.",
          record: "Filed 120 citations this month. Highest record in county history.",
          sync: `Deputy Frill points his pencil: 'No infractions logged for you, resident. Maintain compliance!'`
        };
      case 'qrill':
        return {
          quote: "Tactical security checks are running on schedule. Maintain coordinates.",
          activities: "Aligning station signals, reinforcing gate locks, and mapping sector patrol grids.",
          record: "Upgraded 12 gate latch mechanisms. Secured all belfry belford gates.",
          sync: `Deputy Qrill nods: 'Your alignment of town signals matches standard coordinates perfectly.'`
        };
      case 'petalworth':
        return {
          quote: "Oh, this moss will keep the garden soil so moist! Bless you, dear heart!",
          activities: "Selling sugar lilies, packaging seed packets, and cataloging valley flora.",
          record: "Supplied flowers for 45 civic ceremonies. Zero damaged plants.",
          sync: `Mrs. Petalworth smiles: 'Hello dear! Your standing is ${standing}, what a helpful soul you are.'`
        };
      case 'maribel':
        return {
          quote: "A good stitch in time saves nine... and prevents Pipkin's pockets from tearing.",
          activities: "Patching suspenders, mending velvet hats, and sewing messenger bags.",
          record: "Mended 140 trousers. Zero needle accidents.",
          sync: `Maribel smiles: 'Thank you for keeping an eye on Pipkin. He means well, even when pranking.'`
        };
      case 'page':
        return {
          quote: "I'm busy weeding my rare plants. Keep those slingshots away from my garden hedges!",
          activities: "Watering glowing orchids, sorting botanical fertilizers, and weeding garden beds.",
          record: "Cultivated 3 rare hybrid sugar species. Logged zero crop damage.",
          sync: `Miss Page peer through curtains: 'I know you're a ${standing}, but don't walk on my seedlings!'`
        };
      case 'crumbleton':
        return {
          quote: "A fresh batch of cocoa-buns is out! Get them while they're warm!",
          activities: "Preheating ovens, folding croissant dough, and baking sourdough rounds.",
          record: "Baked the largest floating cake in town history. Voted coziest bakery owner.",
          sync: `Baker Bramble Mortimer hands you a roll: 'Excellent progress, traveler! At builder level ${builderLvl}, you appreciate good dough!'`
        };
      case 'cedric_w':
        return {
          quote: "Grammar, my dear traveler, is the sugar-mortar that binds the bricks of society.",
          activities: "Spelling corrections, reading historical books, and teaching local lessons.",
          record: "Taught three generations of residents. Cataloged forty ancient scrolls.",
          sync: `Professor Finley nods: 'Your intellectual curiosity is commendable. A fine mind indeed!'`
        };
      case 'horace':
        return {
          quote: "The 10:14 Cocoa Express waits for no one! Board immediately, resident!",
          activities: "Polishing clock hands, verifying monorail schedule charts, and updating cargo logs.",
          record: "12 years of zero terminal delays. Zero missed ticket checks.",
          sync: `Horace checks his pocket watch: 'Punctual as always, resident. Your progress is on time!'`
        };
      case 'hazel':
        return {
          quote: "Hello there, traveler. Let me brew a hot cup of honey-mint tea to soothe that spore cough.",
          activities: "Mixing apothecary ointments, checking clinic thermometers, and wrapping sprained ankles.",
          record: "Treated 412 residents for moss cough. 0 medical complications.",
          sync: `Dr. Cedric Oakenhart smiles: 'Let's chat. I hear you are a ${standing} now. That is wonderful!'`
        };
      case 'hugo':
        return {
          quote: "The forge is hot and the anvil is ready. Need a tool repaired, traveler?",
          activities: "Hammering iron hinges, drawing gear teeth blueprints, and playing mouth harp.",
          record: "Forged 10,000 horse nails. zero workspace burns.",
          sync: `Blacksmith Crumblewise wipes his brow: 'Your builder skill is level ${builderLvl}. Need steel brackets?'`
        };
      case 'cinder':
        return {
          quote: "A warm stew and a comfortable bed are the finest cures for a long day's journey!",
          activities: "Cooking potato-cocoa stews, preparing cozy guest beds, and welcoming weary travelers.",
          record: "Served over 10,000 warm bowls. Zero unsatisfied guests.",
          sync: `Bounce McDrizzle waves: 'Welcome to the Inn! Relax and have a warm cup of cocoa!'`
        };
      case 'finch':
        return {
          quote: "Time is coins, and coins are opportunity! Caramel Finch at your service.",
          activities: "Signing ledger invoices, tracking wholesale supply prices, and inspecting cargo boxes.",
          record: "Exported 5,000 cocoa crates this season. Voted leading businessman.",
          sync: `Caramel Finch winks: 'A ${standing} is an excellent trading partner. Let's make a deal!'`
        };
      default:
        return {
          quote: "Welcome to Ganache Grove, traveller!",
          activities: "Enjoying local cocoa products and helping builders keep paths safe.",
          record: "No infractions logged. Good standing citizen.",
          sync: `Citizens look forward to working with you, ${standing}!`
        };
    }
  };

  const handleSimulateChat = () => {
    const list = char.dialogues;
    const idx = Math.floor(Math.random() * list.length);
    setActiveQuote(list[idx]);
    addLegacy(5); // Reward minor standing for chatting
  };

  const getClanBadgeColor = (clan: Character['clan']) => {
    switch (clan) {
      case 'Rebels': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/35';
      case 'Bosses': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/35';
      default: return 'bg-neutral-500/20 text-neutral-300 border-white/10';
    }
  };

  return (
    <div className={`min-h-full w-full flex flex-col items-center justify-start select-none transition-all duration-700 bg-transparent ${headerHidden ? 'pt-2 pb-6 px-2' : 'pt-4 pb-8 px-4'}`}>
      <div className={`rounded-[2.5rem] border-[3px] border-purple-500/40 bg-black/60 p-6 flex flex-col justify-between overflow-visible shadow-[8px_8px_0px_0px_rgba(168,85,247,0.35)] relative transition-all duration-700 ease-in-out ${
        headerHidden
          ? 'w-[92vw] h-auto min-h-[90vh]'
          : 'w-[92vw] h-auto min-h-[82vh]'
      }`}>
        
        {/* Header */}
        <div className="relative flex items-center justify-between border-b border-white/10 pb-4 shrink-0">
          <div className="z-10">
            <button
              onClick={() => setPage('desk')}
              className="px-4 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 rounded-full text-xs font-brand uppercase tracking-wider transition duration-200"
              style={{ fontFamily: '"Josefin Sans", sans-serif' }}
            >
              🏠 Back to Desk
            </button>
          </div>
          <div className="absolute inset-x-0 top-0 bottom-4 flex items-center justify-center pointer-events-none">
            <h2 className="text-xl md:text-2xl font-brand text-amber-400 uppercase tracking-wider pointer-events-auto" style={{ fontFamily: FONT }}>
              👥 Citizens of ChocoBrook
            </h2>
          </div>
          <div className="w-[100px] z-10 hidden md:block" /> {/* Spacer */}
        </div>

        {/* Content Panel */}
        <div className="flex-grow my-4 flex flex-col md:flex-row gap-6 w-full max-w-7xl mx-auto">
          
          {/* LEFT: Character Cards Grid Selector (40%) */}
          <div className="w-full md:w-[40%] shrink-0 h-full border-2 border-purple-500/35 bg-transparent rounded-3xl p-4 flex flex-col justify-start overflow-hidden">
            <h3 className="text-[8px] font-black uppercase tracking-[0.25em] text-purple-400 mb-3 shrink-0">
              Grove Residents Registry
            </h3>
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 space-y-3">
              {CHARACTERS.map((c, i) => {
                const isSelected = i === selectedIdx;
                return (
                  <div
                    key={c.id}
                    onClick={() => {
                      setSelectedIdx(i);
                      setActiveQuote(null);
                      setActiveTab('bio');
                    }}
                    className={`p-3 rounded-[1.5rem] border transition duration-200 cursor-pointer flex items-center gap-4 ${
                      isSelected 
                        ? 'bg-amber-500/15 border-amber-500/50 shadow-md' 
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    {/* Compact Image slot */}
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-neutral-900 border border-white/10 shrink-0">
                      <img
                        src={c.image}
                        alt={c.name}
                        className="w-full h-full object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).src = '/Assets/Ganache Grove/Scene_0.1.png'; }}
                      />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-white text-xs truncate">{c.name}</h4>
                      <p className="text-[10px] text-white/50 mt-1 truncate">{c.role} ({c.gender})</p>
                      <span className={`inline-block px-2 py-0.5 border text-[7.5px] font-bold rounded-full mt-1.5 ${getClanBadgeColor(c.clan)}`}>
                        {c.clan}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT: Detail View Dossier (60%) */}
          <div className="flex-1 h-full rounded-3xl border border-white/10 bg-black/30 flex flex-col justify-between p-5 min-h-0 overflow-y-auto custom-scrollbar">
            
            <div className="space-y-4">
              {/* 3:2 Horizontal Portrait Image Slot */}
              <div className="aspect-[3/2] w-full rounded-2xl overflow-hidden bg-neutral-900 border border-white/10 shrink-0 relative shadow-lg">
                <img
                  src={char.image}
                  alt={char.name}
                  className="w-full h-full object-cover object-center animate-fade-in"
                  onError={(e) => { (e.target as HTMLImageElement).src = '/Assets/Ganache Grove/Models/Scene_01.png'; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-4 left-4 right-4 text-left">
                  <span className="text-[15px] text-white/50 uppercase tracking-widest font-bold">Ganache Grove Core Cast</span>
                  <h3 className="text-xl md:text-2xl font-brand text-yellow-300 uppercase leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" style={{ fontFamily: FONT }}>
                    {char.name}
                  </h3>
                </div>
              </div>

              {/* Dossier Header Info */}
              <div className="flex items-center justify-between border-b border-white/10 pb-3 mt-2">
                <div>
                  <span className={`inline-block px-2.5 py-0.5 border text-[15px] font-bold rounded-full ${getClanBadgeColor(char.clan)}`}>
                    {char.clan} Affiliation
                  </span>
                  <span className="text-[15px] text-white/70 ml-3 font-semibold uppercase tracking-wider">
                    {char.role} · Age {char.age} · {char.gender}
                  </span>
                </div>
              </div>

              {/* Dossier Tabs */}
              <div className="flex gap-2 border-b border-white/5 pb-2 shrink-0">
                {['bio', 'lore', 'chat'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={`px-3 py-1 rounded-lg text-[15px] font-bold uppercase transition ${
                      activeTab === tab ? 'bg-amber-500/20 text-amber-300 border border-amber-500/35' : 'text-white/55 hover:text-white'
                    }`}
                  >
                    {tab === 'bio' ? '📝 Biography' : tab === 'lore' ? '📁 Deep Secrets' : '💬 Talk'}
                  </button>
                ))}
              </div>

              {/* Tab Contents */}
              <div className="min-h-[140px]">
                {activeTab === 'bio' && (
                  <div className="space-y-3 text-left">
                    <p className="text-white/85 text-[15px] leading-relaxed font-body">
                      {char.description}
                    </p>

                    {/* In-between Fun Fact panel */}
                    {char.loreSections && char.loreSections.length > 0 && (
                      <div className="p-3.5 bg-amber-500/10 border border-amber-500/20 rounded-xl my-4 text-left">
                        <span className="text-[15px] font-bold text-amber-300 block mb-1">💡 Resident Fun Fact</span>
                        <span className="text-[15px] font-semibold text-amber-400 block mb-0.5">
                          {char.loreSections[0].title}
                        </span>
                        <p className="text-[15px] text-amber-200/90 leading-relaxed italic">
                          {char.loreSections[0].content}
                        </p>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <div className="p-2.5 bg-white/5 rounded-xl border border-white/5">
                        <span className="text-[15px] font-bold text-cyan-300 uppercase tracking-widest block">Core Specialty</span>
                        <span className="text-[15px] text-white mt-1 block font-semibold">{char.specialty}</span>
                      </div>
                      <div className="p-2.5 bg-white/5 rounded-xl border border-white/5">
                        <span className="text-[15px] font-bold text-rose-300 uppercase tracking-widest block">Signature Prop</span>
                        <span className="text-[15px] text-white mt-1 block font-semibold">{char.favoriteProp}</span>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'lore' && (() => {
                  const dossier = getCharacterDossier(char.id);
                  return (
                    <div className="space-y-3 font-sans animate-fade-in text-left">
                      {/* 1. Signature Quote */}
                      <div className="rounded-xl border border-purple-500/20 bg-purple-950/15 p-3.5 space-y-1">
                        <span className="text-[15px] font-black uppercase tracking-[0.2em] text-purple-300 block">Personal Quote</span>
                        <p className="text-[15px] text-white/80 italic leading-relaxed">
                          &ldquo;{dossier.quote}&rdquo;
                        </p>
                      </div>

                      {/* 2. Daily Hobbies */}
                      <div className="rounded-xl border border-white/5 bg-black/25 p-3 space-y-1">
                        <span className="text-[15px] font-black uppercase tracking-[0.2em] text-neutral-400 block">Daily Hobbies &amp; Duties</span>
                        <p className="text-[15px] text-white/70 leading-relaxed">{dossier.activities}</p>
                      </div>

                      {/* 3. Clerk Past Record */}
                      <div className="rounded-xl border border-white/5 bg-black/25 p-3 space-y-1">
                        <span className="text-[15px] font-black uppercase tracking-[0.2em] text-neutral-400 block">Official Clerk Record</span>
                        <p className="text-[15px] text-rose-350 leading-relaxed font-mono">{dossier.record}</p>
                      </div>

                      {/* 4. Player Relation Status Sync */}
                      <div className="rounded-xl border border-cyan-500/20 bg-cyan-950/15 p-3 space-y-1 border-dashed">
                        <span className="text-[15px] font-black uppercase tracking-[0.2em] text-cyan-300 block">Player Standing Sync</span>
                        <p className="text-[15px] text-cyan-200/80 italic leading-relaxed">{dossier.sync}</p>
                      </div>
                    </div>
                  );
                })()}

                {activeTab === 'chat' && (
                  <div className="space-y-4 text-center animate-fade-in">
                    <p className="text-[15px] text-white/55 italic leading-normal max-w-md mx-auto">
                      Click the dialogue button below to simulate a conversation. Chatting builds standing with local residents.
                    </p>

                    {activeQuote ? (
                      <div className="bg-amber-500/5 border border-amber-500/20 p-4 rounded-2xl text-left animate-fade-in-up">
                        <span className="text-[15px] font-black uppercase tracking-[0.2em] text-amber-400">Direct Quote</span>
                        <p className="text-[15px] text-neutral-300 italic font-body mt-1.5 leading-relaxed">
                          {activeQuote}
                        </p>
                      </div>
                    ) : (
                      <button
                        onClick={handleSimulateChat}
                        className="py-2.5 px-6 bg-amber-500 hover:bg-amber-400 text-black font-brand font-black uppercase text-[15px] tracking-wider rounded-xl transition shadow-glow inline-block"
                        style={{ fontFamily: '"Josefin Sans", sans-serif' }}
                      >
                        🗣️ Speak to {char.name.split(' ')[0]}
                      </button>
                    )}

                    {activeQuote && (
                      <button
                        onClick={handleSimulateChat}
                        className="text-[15px] font-bold text-amber-400 hover:underline block mx-auto mt-2"
                      >
                        Ask another question →
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Stats section */}
            <div className="mt-5 pt-3 border-t border-white/10 space-y-3 text-left">
              <span className="text-[15px] font-black uppercase tracking-[0.25em] text-pink-400 block">Dossier Skill Stats</span>
              
              <div className="grid grid-cols-2 gap-3 text-[15px]">
                {/* Mischief */}
                <div className="space-y-1">
                  <div className="flex justify-between font-semibold text-neutral-400">
                    <span>Mischief & Cunning</span>
                    <span className="font-mono text-white">{char.stats.mischief}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-neutral-900 rounded-full overflow-hidden border border-white/5">
                    <div className="h-full bg-yellow-500" style={{ width: `${char.stats.mischief}%` }} />
                  </div>
                </div>

                {/* Agility */}
                <div className="space-y-1">
                  <div className="flex justify-between font-semibold text-neutral-400">
                    <span>Agility & Reflexes</span>
                    <span className="font-mono text-white">{char.stats.agility}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-neutral-900 rounded-full overflow-hidden border border-white/5">
                    <div className="h-full bg-cyan-500" style={{ width: `${char.stats.agility}%` }} />
                  </div>
                </div>

                {/* Courage */}
                <div className="space-y-1">
                  <div className="flex justify-between font-semibold text-neutral-400">
                    <span>Courage & Bravery</span>
                    <span className="font-mono text-white">{char.stats.courage}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-neutral-900 rounded-full overflow-hidden border border-white/5">
                    <div className="h-full bg-rose-500" style={{ width: `${char.stats.courage}%` }} />
                  </div>
                </div>

                {/* Strength */}
                <div className="space-y-1">
                  <div className="flex justify-between font-semibold text-neutral-400">
                    <span>Physical Strength</span>
                    <span className="font-mono text-white">{char.stats.strength}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-neutral-900 rounded-full overflow-hidden border border-white/5">
                    <div className="h-full bg-emerald-500" style={{ width: `${char.stats.strength}%` }} />
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Footer */}
        <div className="p-2 border-t border-white/10 flex items-center justify-center text-[15px] text-white/40 shrink-0">
          Earn reputations and complete local missions to unlock more deep secrets with town citizens.
        </div>

      </div>
    </div>
  );
};

export default CharactersPage;
