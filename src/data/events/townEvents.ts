/**
 * townEvents.ts — ToffeeTowns Interactive
 * ─────────────────────────────────────────────────────────────
 * All timed pop-up event content. Events are wired to the
 * Ganache Gazette 10-day story arc and real-time flash news.
 *
 * LORE RULES:
 *  - Ganache Grove is a FOREST TOWN — no sea, no harbour.
 *  - Permitted transport: Horse Wagon · Glass Monorail only.
 *  - No hot-air balloons. No ferries. No ships.
 *
 * TIMING GUIDE (minutes between events of each type):
 *  gossip_drop      → fires every 10 min
 *  npc_encounter    → fires every 13 min
 *  transport_update → fires every 15 min
 *  trade_signal     → fires every 18 min
 *  politics_brief   → fires every 22 min
 *  tax_notice       → fires every 28 min
 *
 * Events within a type rotate randomly, never repeat consecutively.
 * ─────────────────────────────────────────────────────────────
 */

export type EventType =
  | 'flash_news'
  | 'tax_notice'
  | 'npc_encounter'
  | 'transport_update'
  | 'gossip_drop'
  | 'politics_brief'
  | 'trade_signal';

export interface EventChoice {
  id:          string;
  label:       string;
  icon:        string;
  subtitle?:   string;
  coinCost?:   number;
  coinGain?:   number;
  legacyGain?: number;
  xpGain?:     number;
  xpCategory?: string;
  result:      string;
}

export interface TownEvent {
  id:         string;
  type:       EventType;
  title:      string;
  category:   string;
  icon:       string;
  accentHex:  string;
  image:      string;
  leftLabel:  string;
  badgeText:  string;
  mainText:   string;
  choices:    EventChoice[];
  npcName?:   string;
  npcRole?:   string;
  /** Gazette tie-in: day number this event references (1–10) */
  gazetteDays?: number[];
}

// ── Asset paths ───────────────────────────────────────────────
const IMG_GOSSIP    = '/Assets/Ganache Grove/GanacheGrove_GossipCorner.png';
const IMG_MARKET    = '/Assets/Ganache Grove/GanacheGrove_marketSquare.png';
const IMG_MARKET2   = '/Assets/Ganache Grove/GanacheGrove_marketSquare1.png';
const IMG_SCENE     = '/Assets/Ganache Grove/Scene_0.1.png';
const IMG_EXTERIOR  = "/Assets/Ganache Grove/Traveller'sHome_GanacheGrovez_Beginner_Exterior.png";
const IMG_KITCHEN   = '/Assets/Ganache Grove/Ganache_BeginnerHome_kitchen1.png';
const IMG_LIVING    = '/Assets/Ganache Grove/Ganache_BeginnerHome_Living.png';
const IMG_BALCONY   = '/Assets/Ganache Grove/Ganache_BeginnerHome_Balcony.png';
// const IMG_BEDROOM   = '/Assets/Ganache Grove/Ganache_BeginnerHome_Bedroom.png';
// const IMG_BACKYARD  = '/Assets/Ganache Grove/Ganache_BeginnerHome_backyard.png';
const IMG_MIST_GLASSTRAIN = '/Assets/Ganache Grove/Pop-ups/Mist_Glasstrain_Pop-up.png';
const IMG_PLANK_PRICE_HIKE = '/Assets/Ganache Grove/Pop-ups/Plank_Price_Hike.png';
const IMG_HERB_DELIVERY = '/Assets/Ganache Grove/Pop-ups/Herb_Delivery.png';


// ═══════════════════════════════════════════════════════════════
// GOSSIP EVENTS  (colour: fuchsia)  · fires every 10 min
// All tied to the Gazette 10-day storyline.
// ═══════════════════════════════════════════════════════════════
export const GOSSIP_EVENTS: TownEvent[] = [
  {
    id: 'gossip_001',
    type: 'gossip_drop',
    gazetteDays: [1, 2],
    title: "Rowan's Walkway Row",
    category: 'Gossip Corner',
    icon: '🪵',
    accentHex: '#e879f9',
    image: IMG_GOSSIP,
    leftLabel: 'Grove Whispers',
    badgeText: '🔥 Hot Gossip!',
    mainText: "The Gossip Corner lantern post is buzzing! Rowan Thistle is once again insisting on his elevated wooden walkway through the mud pools — and Julie Frost from the Gazette was spotted furiously scribbling notes while he argued his case with a bundle of fresh survey documents under one arm.\n\nSome residents claim Rowan nearly stepped into the deepest mud pit and only the quick thinking of Mrs. Petalworth — who grabbed him by the collar — saved today's survey delivery entirely.",
    choices: [
      { id: 'support_rowan', label: "Back Rowan's walkway plan loudly", icon: '🪵', legacyGain: 8, result: '🪵 You publicly support Rowan! +8 Legacy. He waves gratefully from across the mud.' },
      { id: 'conservation',  label: 'Voice concerns for the Fluttermoths', icon: '🦋', legacyGain: 6, result: '🦋 Conservation noted! +6 Legacy. Julie Frost quotes you in the Gazette.' },
      { id: 'watch',         label: 'Watch from a safe, dry distance',      icon: '👀', result: '👀 You watch wisely from dry cobblestones. Excellent judgement on mud proximity.' },
    ],
  },
  {
    id: 'gossip_002',
    type: 'gossip_drop',
    gazetteDays: [3],
    title: 'Walkway Approved! Rowan Celebrates',
    category: 'Gossip Corner',
    icon: '🎉',
    accentHex: '#e879f9',
    image: IMG_GOSSIP,
    leftLabel: 'Grove Whispers',
    badgeText: '🏗️ Breaking Build!',
    mainText: "Sir Goldwhistle signed the construction permit and the entire Gossip Corner erupted! Rowan Thistle was seen doing what eyewitnesses describe as 'a small but enthusiastic victory shimmy' in the middle of the market square — only to trip on the very same mud patch that inspired the walkway in the first place.\n\nJulie Frost captured it all. The Gazette front page is already set.",
    choices: [
      { id: 'help_build',  label: 'Volunteer to carry planks tomorrow', icon: '🔨', xpGain: 15, xpCategory: 'builder', result: '🔨 Signed up! +15 Builder XP. Rowan adds you to the crew board in permanent ink.' },
      { id: 'donate',      label: 'Donate to the construction fund',     icon: '🪙', coinCost: 10, legacyGain: 12, result: '🪙 -10 Coins donated. +12 Legacy for civic generosity.' },
      { id: 'celebrate',   label: 'Celebrate at Baker Bramble\'s counter', icon: '🥐', result: '🥐 Excellent idea. Velvet cream buns all round. The whole town agrees.' },
    ],
  },
  {
    id: 'gossip_003',
    type: 'gossip_drop',
    gazetteDays: [4, 5],
    title: 'Moss Sneezles Hit the Academy!',
    category: 'Gossip Corner',
    icon: '🤧',
    accentHex: '#e879f9',
    image: IMG_GOSSIP,
    leftLabel: 'Grove Whispers',
    badgeText: '🌿 Health Alert!',
    mainText: "The word is out — green nose tips spotted all over the Forest Academy! Three entire classrooms sent home after an unofficial nature walk descended into a spore cloud incident.\n\nDr. Cedric Oakenhart is brewing industrial quantities of fresh mint tea and Rowan Thistle is hammering together isolation separators. Julie Frost reports: 'The situation smells heavily of mint and mild panic.'",
    choices: [
      { id: 'help_clinic', label: 'Volunteer at the clinic today',    icon: '🩺', xpGain: 12, xpCategory: 'healer', result: '🩺 You assist Dr. Cedric! +12 Healer XP for essential health service.' },
      { id: 'herbs',       label: 'Gather wild mint from the forest', icon: '🌿', xpGain: 8, xpCategory: 'explorer', result: '🌿 Fresh mint delivered! +8 Explorer XP for forest foraging.' },
      { id: 'stay',        label: 'Cautiously stay indoors',          icon: '🏠', result: '🏠 Entirely sensible. You brew your own mint tea and wait it out.' },
    ],
  },
  {
    id: 'gossip_004',
    type: 'gossip_drop',
    gazetteDays: [6],
    title: 'Sneezles Cured! Academy Reopens',
    category: 'Gossip Corner',
    icon: '✅',
    accentHex: '#e879f9',
    image: IMG_GOSSIP,
    leftLabel: 'Grove Whispers',
    badgeText: '🎊 Recovery News!',
    mainText: "Every green nose tip has returned to its natural hue! Dr. Cedric Oakenhart accepts a standing ovation at the market square. Rowan Thistle is already dismantling the isolation racks and stacking them neatly by the side gate.\n\nJulie Frost published a full front-page thank-you letter and Baker Bramble has set out complimentary recovery buns — three per cured child.",
    choices: [
      { id: 'thank_doc',  label: "Personally thank Dr. Cedric",       icon: '🤝', legacyGain: 8,  result: '🤝 He is genuinely moved. +8 Legacy for community appreciation.' },
      { id: 'clean_up',   label: 'Help Rowan clear the academy steps', icon: '🧹', xpGain: 10, xpCategory: 'builder', result: '🧹 Steps spotless! +10 Builder XP for post-crisis sanitation work.' },
      { id: 'bun',        label: 'Eat a recovery bun at the bakery',  icon: '🥐', xpGain: 10, xpCategory: 'healer', result: '🥐 Delicious and energizing! +10 Healer XP from the nutritional recovery buns.' },
    ],
  },
  {
    id: 'gossip_005',
    type: 'gossip_drop',
    gazetteDays: [7, 8],
    title: "Glowing Lights in the Old Ruins!",
    category: 'Gossip Corner',
    icon: '✨',
    accentHex: '#e879f9',
    image: IMG_GOSSIP,
    leftLabel: 'Grove Whispers',
    badgeText: '👻 Spooky Sighting!',
    mainText: "Rangers returning from the deep canopy are refusing to talk on record. One, however, whispered to this correspondent: 'floating white orbs, moving in spirals over the old granite archways.'\n\nJulie Frost is packing climbing gear. Rowan Thistle says it is almost certainly Glowcap Fluttermoths but is preparing lanterns just in case it is not. Captain Butterfield has marked the area 'caution territory' on the town map.",
    choices: [
      { id: 'investigate', label: 'Join the ranger investigation team', icon: '🔦', xpGain: 15, xpCategory: 'explorer', result: '🔦 Into the forest you go! +15 Explorer XP for frontier reconnaissance.' },
      { id: 'wait',        label: 'Wait for the official Gazette report', icon: '📰', result: '📰 Sensible! Tomorrow\'s Gazette will have full coverage and illustrations.' },
      { id: 'local_tale',  label: 'Share your own ghost theory',        icon: '👻', result: '👻 Excellent theory! Six gnomes entirely agree with your analysis.' },
    ],
  },
  {
    id: 'gossip_006',
    type: 'gossip_drop',
    gazetteDays: [8],
    title: 'Fluttermoth Migration Confirmed!',
    category: 'Gossip Corner',
    icon: '🦋',
    accentHex: '#e879f9',
    image: IMG_GOSSIP,
    leftLabel: 'Grove Whispers',
    badgeText: '🌟 Rare Discovery!',
    mainText: "Julie Frost's lens has captured thousands of them — luminous, shimmering, incredible. The rare Glowcap Fluttermoth migration is real and happening in the ancient archways of Mossberry Park right now.\n\nRowan Thistle has already built protective fence sections and is asking for volunteers. Dr. Cedric advises hikers to wear eye-goggles because glowing wing dust makes you briefly see everything as warm caramel.",
    choices: [
      { id: 'fence_help',  label: 'Help Rowan install the safety fencing', icon: '🪵', xpGain: 12, xpCategory: 'builder', result: '🪵 Fencing secured! +12 Builder XP for protecting the nesting site.' },
      { id: 'photograph',  label: "Try to photograph the moths yourself",  icon: '📸', result: '📸 Stunning photographs! Julie Frost is mildly jealous of your framing.' },
      { id: 'conservation', label: 'Sign the sanctuary petition',          icon: '📋', legacyGain: 10, result: '📋 Signed! +10 Legacy for protecting Ganache Grove\'s natural heritage.' },
    ],
  },
  {
    id: 'gossip_007',
    type: 'gossip_drop',
    gazetteDays: [9],
    title: "Clock Tower: Stopped at 4AM!",
    category: 'Gossip Corner',
    icon: '🕰️',
    accentHex: '#e879f9',
    image: IMG_GOSSIP,
    leftLabel: 'Grove Whispers',
    badgeText: '⚙️ Technical Crisis!',
    mainText: "Baker Bramble's entire morning batch of cocoa buns went five minutes over because the chime failed to ring! He is furious. Rowan Thistle was spotted scaling the spire in the pre-dawn dark with a cleaning brush.\n\nThe culprit, according to Rowan: a thick chocolate fudge deposit blocking the main regulator gear. How it got there is the subject of intense and creative speculation across the entire market square.",
    choices: [
      { id: 'help_repair', label: 'Offer to carry Rowan\'s tools up the spire', icon: '🔧', xpGain: 12, xpCategory: 'builder', result: '🔧 Teamwork on the spire! +12 Builder XP for high-altitude mechanical support.' },
      { id: 'theories',    label: 'Lead the fudge-deposit theory discussion',   icon: '🍫', result: '🍫 Your theory — "Pipkin, obviously" — receives strong popular support.' },
      { id: 'buns',        label: "Buy Baker Bramble's slightly over-baked buns", icon: '🥐', coinCost: 3, result: '🥐 Heroic solidarity! -3 Coins. The buns are still delicious. Baker Bramble is moved.' },
    ],
  },
  {
    id: 'gossip_008',
    type: 'gossip_drop',
    gazetteDays: [10],
    title: "Clock Fixed! Baker's Croissants All Round",
    category: 'Gossip Corner',
    icon: '🔔',
    accentHex: '#e879f9',
    image: IMG_GOSSIP,
    leftLabel: 'Grove Whispers',
    badgeText: '🎉 Celebration!',
    mainText: "The bells ring! The crisis is over! Rowan Thistle descended the spire holding a gear-cleaning brush and what witnesses describe as 'a look of profound personal triumph.'\n\nBaker Bramble personally sent chocolate croissants to the entire repair crew — and the town is celebrating what Captain Butterfield declared 'an excellent demonstration of Ganache Grove's community spirit.' Pipkin Nutterby is maintaining complete innocence regarding the fudge. Loudly.",
    choices: [
      { id: 'celebrate',  label: "Celebrate in the market square",       icon: '🎉', xpGain: 10, xpCategory: 'explorer', result: '🎉 Wonderful festivities! +10 Explorer XP from participating in the town-wide celebration.' },
      { id: 'pipkin',     label: "Ask Pipkin directly. Look him in the eye.", icon: '🎭', result: '🎭 He meets your gaze, blinks slowly, and offers you a croissant. Nothing confirmed.' },
      { id: 'record',     label: "Write the event in your journal",       icon: '📔', legacyGain: 6, result: '📔 Documented for history! +6 Legacy for civic record-keeping.' },
    ],
  },
];

// ═══════════════════════════════════════════════════════════════
// TRANSPORT EVENTS  (colour: sky blue)  · fires every 15 min
// Horse Wagons and Glass Monorail ONLY — no balloons, no sea.
// ═══════════════════════════════════════════════════════════════
export const TRANSPORT_EVENTS: TownEvent[] = [
  {
    id: 'transport_001',
    type: 'transport_update',
    gazetteDays: [1, 2],
    title: 'Survey Wagon Route Disrupted',
    category: 'Transport Bulletin',
    icon: '🐎',
    accentHex: '#38bdf8',
    image: IMG_EXTERIOR,
    leftLabel: 'Transit Authority',
    badgeText: '⚠️ Route Alert!',
    mainText: "The south Mossberry forest trail is experiencing a significant slowdown. Three survey document wagons — believed to be Rowan Thistle's community survey delivery — are backed up at the Gossip Corner crossing due to a fallen silver-birch tree blocking the main road.\n\nThe Transit Committee advises travellers to use the Ridge Path detour. Horse wagon operators report clear going via the upper canopy road. Glass Monorail is unaffected and running normally.",
    choices: [
      { id: 'ridge_path', label: 'Take the Ridge Path detour',          icon: '🗺️', xpGain: 8,  xpCategory: 'explorer', result: '🗺️ Smart routing! +8 Explorer XP for navigating the forest detour.' },
      { id: 'monorail',   label: 'Ride the Glass Monorail instead',     icon: '🚝', coinCost: 6, result: '🚝 Smooth and scenic. -6 Coins for the monorail ticket. No delays whatsoever.' },
      { id: 'help_clear', label: 'Volunteer to help clear the tree',    icon: '🪵', xpGain: 12, xpCategory: 'builder', result: '🪵 Axe in hand! +12 Builder XP for forest road-clearing service.' },
    ],
  },
  {
    id: 'transport_002',
    type: 'transport_update',
    gazetteDays: [3, 4],
    title: 'Glass Monorail: Extra Runs for Construction!',
    category: 'Transport Bulletin',
    icon: '🚝',
    accentHex: '#38bdf8',
    image: IMG_EXTERIOR,
    leftLabel: 'Transit Authority',
    badgeText: '✅ New Schedule!',
    mainText: "The Ganache Grove Glass Monorail Authority has announced special additional service runs to handle increased demand from the Gossip Corner walkway construction project. Lumber wagons and citizen workers can board at Platform 2 for direct transport to the construction zone.\n\nStandard tickets: 8 Coins. Worker-crew passes: 5 Coins. The crystal-glass carriages are running beautifully through the forest canopy — sightseers are advised to book morning departures for best light.",
    choices: [
      { id: 'crew_pass',  label: 'Buy the worker-crew pass (5 Coins)', icon: '🚝', coinCost: 5,  xpGain: 10, xpCategory: 'builder', result: '🚝 All aboard! -5 Coins. +10 Builder XP for joining the construction crew run.' },
      { id: 'scenic',     label: 'Take the scenic morning departure',  icon: '🌅', coinCost: 8,  result: '🌅 Breathtaking canopy views. -8 Coins. Worth every centimes.' },
      { id: 'wagon',      label: 'Stick with your horse wagon today',  icon: '🐎', result: '🐎 Your faithful horse appreciates the loyalty and the carrots you brought.' },
    ],
  },
  {
    id: 'transport_003',
    type: 'transport_update',
    gazetteDays: [5, 6],
    title: 'Herb Delivery Wagons En Route!',
    category: 'Transport Bulletin',
    icon: '🌿',
    accentHex: '#38bdf8',
    image: IMG_HERB_DELIVERY,
    leftLabel: 'Transit Authority',
    badgeText: '🚨 Urgent Cargo!',
    mainText: "Four horse wagons loaded with fresh wild mint, dried lavender, and herbal tonic are currently en route from the Northern Forest Edge to Dr. Cedric Oakenhart's clinic. The cargo is urgently needed for the Moss Sneezles recovery programme.\n\nAll horse wagon traffic on Mossberry Lane is requested to give way to the herb convoy. The Glass Monorail has opened Platform 4 as an emergency unloading station for lighter cargo batches.",
    choices: [
      { id: 'clear_way',  label: 'Clear the lane for the herb wagons', icon: '🌿', legacyGain: 8,  result: '🌿 You wave the convoy through! +8 Legacy for emergency route assistance.' },
      { id: 'unload',     label: 'Help unload cargo at the clinic',    icon: '📦', xpGain: 10, xpCategory: 'healer', result: '📦 Herbs safely delivered! +10 Healer XP for critical supply chain support.' },
      { id: 'monorail2',  label: 'Use the Monorail Platform 4 route',  icon: '🚝', coinCost: 6,  result: '🚝 Fast alternative route used. -6 Coins. Efficient and tidy logistics.' },
    ],
  },
  {
    id: 'transport_004',
    type: 'transport_update',
    gazetteDays: [7],
    title: 'Forest Path Closed: Ruin Investigation',
    category: 'Transport Bulletin',
    icon: '⛔',
    accentHex: '#38bdf8',
    image: IMG_SCENE,
    leftLabel: 'Transit Authority',
    badgeText: '🚧 Path Closed!',
    mainText: "The Old Archway Forest Path — normally used by horse wagons travelling between the market and Mossberry Park — is temporarily closed for the ranger investigation of the mysterious glowing lights in the ruins.\n\nAll wagon traffic is diverted to the Northern Ridge Road (add 12 minutes). The Glass Monorail Mossberry Branch runs to within 200 metres of the archways and is the recommended access route for those involved in the investigation.",
    choices: [
      { id: 'monorail3',  label: 'Take the Monorail to Mossberry Branch', icon: '🚝', coinCost: 8,  xpGain: 10, xpCategory: 'explorer', result: '🚝 Glass carriage through the glowing canopy! -8 Coins, +10 Explorer XP.' },
      { id: 'detour',     label: 'Take the Northern Ridge Road detour',   icon: '🗺️', xpGain: 6,  xpCategory: 'explorer', result: '🗺️ Scenic ridge detour completed! +6 Explorer XP for the alternative route.' },
      { id: 'wait2',      label: 'Wait until the path reopens',           icon: '⏳', result: '⏳ You wait patiently. Julie Frost walks past with a camera and six questions.' },
    ],
  },
  {
    id: 'transport_005',
    type: 'transport_update',
    gazetteDays: [8],
    title: 'Moth Sanctuary: Special Monorail Viewing Run!',
    category: 'Transport Bulletin',
    icon: '🦋',
    accentHex: '#38bdf8',
    image: IMG_MIST_GLASSTRAIN,
    leftLabel: 'Transit Authority',
    badgeText: '✨ Special Service!',
    mainText: "The Ganache Grove Glass Monorail Authority has announced a limited-seats Fluttermoth Viewing Run! The glass-sided carriages will pass directly alongside the ancient archways at dusk, giving passengers an unobstructed view of the Glowcap Fluttermoth migration through the illuminated crystal panels.\n\nTickets: 15 Coins. Maximum 12 passengers per run. Departure: sunset bell. Goggles provided at Platform 1.",
    choices: [
      { id: 'moth_run',  label: 'Book the viewing run — 15 Coins',     icon: '🦋', coinCost: 15, xpGain: 15, xpCategory: 'explorer', result: '🦋 Breathtaking! Thousands of glowing moths. -15 Coins, +15 Explorer XP for the journey.' },
      { id: 'platform',  label: 'Watch from Platform 1 for free',      icon: '🚝', result: '🚝 Excellent free vantage point! You see the carriages glow as they pass the archways.' },
      { id: 'later',     label: 'Book for a future run',               icon: '📅', result: '📅 Future booking noted! The ticket office is pleasantly surprised by your organisation.' },
    ],
  },
  {
    id: 'transport_006',
    type: 'transport_update',
    gazetteDays: [9, 10],
    title: 'Clock Tower Repair Crew: Wagon Priority!',
    category: 'Transport Bulletin',
    icon: '⚙️',
    accentHex: '#38bdf8',
    image: IMG_EXTERIOR,
    leftLabel: 'Transit Authority',
    badgeText: '🏗️ Priority Route!',
    mainText: "The Transit Authority has issued a priority wagon clearance for all repair supply vehicles heading to the Bell Tower spire. Copper gear parts, cleaning tools, and scaffolding materials are being hauled by four large horse wagons from the market district.\n\nAll other wagon traffic must pull to the side at the main crossroads intersection. The Glass Monorail is carrying additional maintenance crew members to the East Platform stop — nearest stop to the spire.",
    choices: [
      { id: 'priority', label: 'Clear the crossroads for the wagons', icon: '🐎', legacyGain: 8,  result: '🐎 Wagons cleared safely through! +8 Legacy for traffic management support.' },
      { id: 'crew',     label: 'Join the monorail maintenance crew',  icon: '🚝', coinCost: 5,  xpGain: 12, xpCategory: 'builder', result: '🚝 -5 Coins ticket. +12 Builder XP for spire repair crew participation.' },
      { id: 'watch3',   label: 'Watch the wagons roll through town',  icon: '👀', result: '👀 Impressive sight! Four fully loaded horse wagons in formation. Very purposeful.' },
    ],
  },
  {
    id: 'transport_007',
    type: 'transport_update',
    gazetteDays: [2, 3],
    title: 'Morning Fog: Forest Roads Advisory',
    category: 'Transport Bulletin',
    icon: '🌫️',
    accentHex: '#38bdf8',
    image: IMG_SCENE,
    leftLabel: 'Transit Authority',
    badgeText: '🌫️ Weather Advisory!',
    mainText: "The Ganache Weather Station reports dense morning forest fog on all woodland roads and canopy paths. Horse wagon operators must light lanterns and reduce speed to a walking pace. Visibility reduced to approximately 10 metres.\n\nThe Glass Monorail is completely unaffected — the raised track sits above the fog layer and is running to its full schedule. Fog expected to lift by mid-morning bell. Walking travellers are advised to carry a whistle and stay on cobblestone routes only.",
    choices: [
      { id: 'monorail4', label: 'Travel by Monorail — above the fog!', icon: '🚝', coinCost: 8, result: '🚝 Brilliant! You glide above the fog through clear morning air. -8 Coins.' },
      { id: 'lantern',   label: 'Buy a fog lantern for your wagon',    icon: '🏮', coinCost: 5, result: '🏮 -5 Coins for a sturdy lantern. Your horse approves of the improved visibility.' },
      { id: 'wait_fog',  label: 'Wait for the fog to clear',           icon: '☕', result: '☕ Excellent excuse for a second cup of morning cocoa. No regrets whatsoever.' },
    ],
  },
  {
    id: 'transport_008',
    type: 'transport_update',
    gazetteDays: [4, 5],
    title: 'Urgent Courier Needed: Herb Documents!',
    category: 'Transport Bulletin',
    icon: '📦',
    accentHex: '#38bdf8',
    image: IMG_SCENE,
    leftLabel: 'Transit Authority',
    badgeText: '🚨 Courier Needed!',
    mainText: "The Ganache Grove Post Office has an urgent situation: a sealed document package marked 'HERB SUPPLY AUTHORISATION — TIME CRITICAL' must reach the Northern Forest Farm Collective by next bell. The regular courier horse is receiving emergency veterinary treatment.\n\nA volunteer rider with a horse wagon OR a Glass Monorail fast pass can complete the delivery. Reward: 25 Explorer XP and 15 Legacy points upon confirmed delivery at the Farm Gate.",
    choices: [
      { id: 'wagon_ride', label: 'Ride my wagon — I know the forest paths!', icon: '🐎', xpGain: 25, xpCategory: 'explorer', legacyGain: 15, result: '🐎 Delivery made on time! +25 Explorer XP and +15 Legacy points for urgent courier service.' },
      { id: 'monorail5',  label: 'Take the fast Monorail pass route',       icon: '🚝', coinCost: 8,  xpGain: 30, xpCategory: 'explorer', legacyGain: 10, result: '🚝 -8 Coins for the fast pass. +30 Explorer XP and +10 Legacy points delivery reward.' },
      { id: 'recommend2', label: 'Recommend Tiber Reedwell for the job',     icon: '👥', legacyGain: 5, result: '👥 Good recommendation! Problem solved swiftly. +5 Legacy for quick thinking.' },
    ],
  },
];

// ═══════════════════════════════════════════════════════════════
// POLITICS EVENTS  (colour: indigo)  · fires every 22 min
// Tied to the Gazette voting debates on each story-arc day.
// ═══════════════════════════════════════════════════════════════
export const POLITICS_EVENTS: TownEvent[] = [
  {
    id: 'politics_001',
    type: 'politics_brief',
    gazetteDays: [1, 2],
    title: 'Walkway vs. Wilderness: Cast Your Vote!',
    category: 'Politics Digest',
    icon: '⚖️',
    accentHex: '#818cf8',
    image: IMG_SCENE,
    leftLabel: 'Council Chambers',
    badgeText: '🗳️ Vote Open!',
    mainText: "The Town Council has opened an official vote: should Ganache Grove prioritise Rowan Thistle's elevated walkway project OR enforce full conservation protection of the Gossip Corner Glowcap Fluttermoth habitat?\n\nRowan argues that a proper walkway prevents mud-related civic incidents. Conservation advocates — including Mrs. Petalworth — insist the moth ecosystem is irreplaceable. Sir Goldwhistle is observing proceedings with what observers describe as 'pointed professional neutrality.'",
    choices: [
      { id: 'walkway_vote', label: 'Vote: Support the walkway project',      icon: '🪵', subtitle: 'Supports modernization and convenience.', legacyGain: 5, result: '🪵 Voted for the walkway! +5 Legacy. Rowan gives a thumbs-up. Modernists appreciate your decision.' },
      { id: 'nature_vote',  label: 'Vote: Protect the moth habitat',         icon: '🦋', subtitle: 'Supports conservation and ecology.', legacyGain: 5, result: '🦋 Conservation vote cast! +5 Legacy. Mrs. Petalworth nods approvingly. Traditionalists appreciate your decision.' },
      { id: 'abstain',      label: 'Abstain — need more information',  icon: '📊', subtitle: 'A cautious, analytical stance.', legacyGain: 5,  result: '📊 Measured neutrality recorded. +5 Legacy for considered civic thoughtfulness.' },
    ],
  },
  {
    id: 'politics_002',
    type: 'politics_brief',
    gazetteDays: [2],
    title: 'Fast-Track Review: Should We Rush This?',
    category: 'Politics Digest',
    icon: '⚡',
    accentHex: '#818cf8',
    image: IMG_SCENE,
    leftLabel: 'Council Chambers',
    badgeText: '⚡ Policy Vote!',
    mainText: "With Rowan Thistle's survey documents now at the Town Hall, a vote is underway: should the walkway proposal receive priority fast-track review status, or follow the standard full audit timeline?\n\nProponents of fast-tracking argue the mud season is approaching and delays are dangerous. Standard-review supporters — primarily Sir Goldwhistle — note that 'due process is not optional merely because one's shoes are wet.'",
    choices: [
      { id: 'fast_track',  label: 'Vote: Fast-track the review!', icon: '⚡', subtitle: 'Speeds up the walkway execution.', legacyGain: 5, result: '⚡ Fast-tracked! +5 Legacy. Rowan begins tool preparation. Modernists appreciate your decision.' },
      { id: 'standard',    label: 'Vote: Standard review process', icon: '📋', subtitle: 'Ensures safety and due diligence.', legacyGain: 5, result: '📋 Standard review process! +5 Legacy. Safety inspectors are content. Traditionalists appreciate your decision.' },
      { id: 'submit',      label: 'Submit a formal recommendation', icon: '✍️', subtitle: 'Provide third-party mediator notes.', legacyGain: 5, result: '✍️ Formal recommendation logged! +5 Legacy. Sir Goldwhistle adds it to the review file.' },
    ],
  },
  {
    id: 'politics_003',
    type: 'politics_brief',
    gazetteDays: [3],
    title: 'Walkway Materials: Which Should We Use?',
    category: 'Politics Digest',
    icon: '🔨',
    accentHex: '#818cf8',
    image: IMG_SCENE,
    leftLabel: 'Council Chambers',
    badgeText: '🏗️ Materials Vote!',
    mainText: "With the walkway permit signed, the construction debate has shifted to materials. Rowan Thistle insists on premium wafer-coated surface panels — scented, springy, and visually outstanding. The more practical faction supports standard spruce planks — durable, affordable, and less likely to attract forest creatures who enjoy eating construction materials.\n\nSir Goldwhistle notes dryly that both options 'remain available for purchase at Mossberry Market.'",
    choices: [
      { id: 'wafer',  label: 'Vote: Premium wafer surface coating', icon: '✨', subtitle: 'Supports modern, sensory architecture.', legacyGain: 5, result: '✨ Wafer coating approved! +5 Legacy. The walkway smells wonderful. Modernists appreciate your decision.' },
      { id: 'spruce', label: 'Vote: Solid spruce planks',          icon: '🌲', subtitle: 'Supports traditional, sturdy materials.', legacyGain: 5, result: '🌲 Spruce planks chosen! +5 Legacy. Sturdy and reliable. Heritage Society appreciates your decision.' },
      { id: 'both',   label: 'Propose a hybrid design',            icon: '💡', subtitle: 'A creative, balanced compromise.', legacyGain: 5, result: '💡 Hybrid proposal submitted! +5 Legacy. Rowan sketches furiously. This has real potential.' },
    ],
  },
  {
    id: 'politics_004',
    type: 'politics_brief',
    gazetteDays: [4],
    title: 'Mint Tea Mandate: Vote Now!',
    category: 'Politics Digest',
    icon: '🍃',
    accentHex: '#818cf8',
    image: IMG_SCENE,
    leftLabel: 'Council Chambers',
    badgeText: '🏥 Health Policy!',
    mainText: "The Town Council is voting on Dr. Cedric Oakenhart's proposed Mandatory Mint Tea Protocol for the Forest Academy. All students would receive three cups of mint tea per school day during the Moss Sneezles outbreak period.\n\nDr. Cedric has scientific support. Baker Bramble strongly supports it (increased demand). Sir Goldwhistle questions the cost. Captain Butterfield says he will vote whichever way involves fewer green nose tips in the Town Hall.",
    choices: [
      { id: 'tea_mandate',   label: 'Vote: Enforce the tea mandate',   icon: '🍃', subtitle: 'Prioritizes immediate community health.', legacyGain: 5, result: '🍃 Tea mandate passed! +5 Legacy. Dr. Cedric is thoroughly pleased.' },
      { id: 'natural_rest',  label: 'Vote: Natural outdoor recovery',  icon: '🌳', subtitle: 'Supports fresh air and play over mandates.', legacyGain: 5, result: '🌳 Natural recovery endorsed! +5 Legacy. Children play in the sun.' },
      { id: 'compromise_tea', label: 'Propose voluntary tea distribution', icon: '☕', subtitle: 'Enables personal choice for families.', legacyGain: 5, result: '☕ Voluntary approach proposed. +5 Legacy. Most students choose tea anyway.' },
    ],
  },
  {
    id: 'politics_005',
    type: 'politics_brief',
    gazetteDays: [5],
    title: 'Emergency Herb Funding: Import or Local?',
    category: 'Politics Digest',
    icon: '🌿',
    accentHex: '#818cf8',
    image: IMG_SCENE,
    leftLabel: 'Council Chambers',
    badgeText: '🚨 Emergency Vote!',
    mainText: "The clinic's mint herb reserves are critically low. An emergency council vote must resolve: should Ganache Grove import premium herbs from the ChocoBrook Mountain settlements via horse wagon convoy (costly but immediate), or should we subsidise local forest growers with direct grants?\n\nThe wagon convoy will arrive in 4 hours if approved. Local growers can increase harvest by 40% within 2 days with proper funding. Both options require immediate council approval.",
    choices: [
      { id: 'import_herbs',  label: 'Vote: Import via wagon convoy now', icon: '🐎', subtitle: 'Prioritizes speed and immediate relief.', legacyGain: 5, result: '🐎 Import approved! +5 Legacy. Wagon convoy departs immediately.' },
      { id: 'local_subsidy', label: 'Vote: Subsidise local growers',     icon: '🌿', subtitle: 'Invests in local farming self-reliance.', legacyGain: 5, result: '🌿 Local grant approved! +5 Legacy. Forest farms begin at dawn.' },
      { id: 'both_approach', label: 'Vote: Use both approaches',          icon: '💡', subtitle: 'A comprehensive, multi-faceted plan.', legacyGain: 5, result: '💡 Both approved! +5 Legacy. Fastest and most thorough solution.' },
    ],
  },
  {
    id: 'politics_006',
    type: 'politics_brief',
    gazetteDays: [7],
    title: 'Ruins Curfew: Should We Restrict Access?',
    category: 'Politics Digest',
    icon: '🏛️',
    accentHex: '#818cf8',
    image: IMG_SCENE,
    leftLabel: 'Council Chambers',
    badgeText: '⚖️ Safety Debate!',
    mainText: "Following ranger reports of unknown glowing activity at the old forest archways, the council is debating: strict sunset curfew closing the ruins to all visitors OR a funded official night-guide programme with ranger-led lantern tours?\n\nCaptain Butterfield wants safety first. Rowan Thistle argues that guided tours could fund the conservation effort. Sir Goldwhistle has noted that guided tours 'would generate taxable revenue' and is watching closely.",
    choices: [
      { id: 'curfew',      label: 'Vote: Daylight-only curfew',    icon: '⛔', subtitle: 'Prioritizes safety and caution.', legacyGain: 5, result: '⛔ Curfew enacted! +5 Legacy. Safety measures appreciated by all.' },
      { id: 'night_tours', label: 'Vote: Fund official night tours', icon: '🏮', subtitle: 'Encourages managed tourism and revenue.', legacyGain: 5, result: '🏮 Night tours funded! +5 Legacy. Lanterns light the ancient paths.' },
      { id: 'joint_plan',  label: 'Propose a joint safety-tour plan', icon: '💡', subtitle: 'Combines ranger patrols with limited tours.', legacyGain: 5, result: '💡 Joint plan submitted! +5 Legacy for finding the balanced middle ground.' },
    ],
  },
  {
    id: 'politics_007',
    type: 'politics_brief',
    gazetteDays: [9, 10],
    title: 'Spire Clock: Electric or Mechanical?',
    category: 'Politics Digest',
    icon: '⚙️',
    accentHex: '#818cf8',
    image: IMG_SCENE,
    leftLabel: 'Council Chambers',
    badgeText: '🔔 Heritage Vote!',
    mainText: "With the Spire Clock repaired, the council is debating its future. The Heritage Commission proposes restoring the original mechanical clockwork to its Year 150 specification. The Modernisation Council advocates installing a quiet electric motor with a self-cleaning anti-fudge system (aimed squarely at preventing future incidents).\n\nBaker Bramble's position: 'I don't care how it works, just make it reliable before the morning bun bell.'",
    choices: [
      { id: 'electric',    label: 'Vote: Install the electric motor',  icon: '⚡', subtitle: 'Supports modernization and low maintenance.', legacyGain: 5, result: '⚡ Electric approved! +5 Legacy. Self-cleaning engaged. Modernists appreciate your decision.' },
      { id: 'mechanical',  label: 'Vote: Restore original clockwork',  icon: '⚙️', subtitle: 'Supports heritage preservation and history.', legacyGain: 5, result: '⚙️ Heritage preserved! +5 Legacy. Master clocksmith is honoured. Heritage Society appreciates your decision.' },
      { id: 'mesh_option', label: 'Just add the protective mesh first', icon: '🛡️', subtitle: 'A cautious, pragmatic middle ground.', legacyGain: 5, result: '🛡️ Pragmatic! +5 Legacy. Anti-fudge mesh installed. Good enough.' },
    ],
  },
];

// ═══════════════════════════════════════════════════════════════
// TRADE EVENTS  (colour: emerald)  · fires every 18 min
// Commodities from the Gazette's Page 4 commodity indices.
// ═══════════════════════════════════════════════════════════════
export const TRADE_EVENTS: TownEvent[] = [
  {
    id: 'trade_001',
    type: 'trade_signal',
    gazetteDays: [1],
    title: 'Pine Planks Surge! Sell Now?',
    category: 'Trade Ledger',
    icon: '🪵',
    accentHex: '#34d399',
    image: IMG_PLANK_PRICE_HIKE,
    leftLabel: 'Market Intelligence',
    badgeText: '📈 Price Spike!',
    mainText: "The Mossberry Market commodity board is showing Pine Planks at 18 Coins per log — up 8.5%! The surge is directly linked to Rowan Thistle's walkway project driving construction demand across the grove.\n\nTraders are snapping up inventory quickly. Market analysts at the Gazette report this is a classic short-cycle spike: expect prices to stabilise once construction materials are delivered. Window to sell is approximately 2 hours.",
    choices: [
      { id: 'sell_planks', label: 'Sell your pine plank stock now!',  icon: '🪵', xpGain: 15, xpCategory: 'builder', legacyGain: 10, result: '🪵 Smart timing! You support the construction and receive +15 Builder XP & +10 Legacy.' },
      { id: 'hold_planks', label: 'Hold and watch the market',        icon: '⏳', result: '⏳ You monitor carefully. Prices hold steady through the afternoon bell.' },
      { id: 'buy_planks',  label: 'Buy now for the construction rush', icon: '🛒', coinCost: 15, xpGain: 20, xpCategory: 'builder', result: '🛒 -15 Coins invested in planks. You sell them to Rowan\'s crew directly for +20 Builder XP.' },
    ],
  },
  {
    id: 'trade_002',
    type: 'trade_signal',
    gazetteDays: [3],
    title: 'Wafer Tiles Flying Off the Shelves!',
    category: 'Trade Ledger',
    icon: '🍫',
    accentHex: '#34d399',
    image: IMG_KITCHEN,
    leftLabel: 'Market Intelligence',
    badgeText: '📈 Demand Surge!',
    mainText: "Wafer Tiles — beloved of the construction debate — are selling at 24 Coins per bundle, up 8.5% since the council approved the walkway surface vote. Rowan Thistle's supplier is backlogged by two full days.\n\nAnyone holding wafer tile stock can sell at premium rates directly to the Gossip Corner construction site. Alternatively, iron brackets remain flat at 15 Coins — potentially undervalued given the construction boom.",
    choices: [
      { id: 'sell_wafer',  label: 'Sell wafer tiles to the building crew', icon: '🍫', xpGain: 20, xpCategory: 'builder', legacyGain: 10, result: '🍫 Sold! Rowan is delighted. +20 Builder XP & +10 Legacy from the construction assistance.' },
      { id: 'buy_iron',    label: 'Buy iron brackets at the flat rate',    icon: '🔩', coinCost: 15, xpGain: 18, xpCategory: 'builder', result: '🔩 -15 Coins. Iron brackets resold directly to Rowan\'s crew for +18 Builder XP.' },
      { id: 'wait_market', label: 'Monitor the situation for 1 more hour', icon: '📊', result: '📊 You watch the board carefully. Your patience is noted as professional composure.' },
    ],
  },
  {
    id: 'trade_003',
    type: 'trade_signal',
    gazetteDays: [4, 5],
    title: 'Mint Leaf Prices Explode!',
    category: 'Trade Ledger',
    icon: '🌿',
    accentHex: '#34d399',
    image: IMG_MARKET,
    leftLabel: 'Market Intelligence',
    badgeText: '🚨 Shortage Alert!',
    mainText: "Fresh Mint has surged to 22 Coins per bag — up 12.4% — as Dr. Cedric Oakenhart's clinic places emergency bulk orders. Honey Jar prices also spiked to 30 Coins (up 4.2%).\n\nAnyone with forest herb stock should consider selling immediately. However, the Gazette's market column warns: 'profiteering from medical emergencies carries permanent reputation consequences in Ganache Grove.' Rowan Thistle's drying rack designs are now selling separately for 20 Coins per block.",
    choices: [
      { id: 'donate_herbs', label: 'Donate your mint to the clinic',     icon: '💚', legacyGain: 20, result: '💚 Donated! Dr. Cedric is genuinely grateful. +20 Legacy for medical solidarity.' },
      { id: 'fair_sell',   label: 'Sell at the fair standard rate',      icon: '🌿', xpGain: 12, xpCategory: 'healer', legacyGain: 8, result: '🌿 Fair pricing maintained. +12 Healer XP and +8 Legacy for ethical market conduct.' },
      { id: 'drying_rack', label: 'Invest in drying rack materials',     icon: '🪵', coinCost: 10, xpGain: 10, xpCategory: 'builder', result: '🪵 -10 Coins. +10 Builder XP. Your drying rack investment aids the recovery effort.' },
    ],
  },
  {
    id: 'trade_004',
    type: 'trade_signal',
    gazetteDays: [7, 8],
    title: 'Lantern Oil Price Surges at Mossberry!',
    category: 'Trade Ledger',
    icon: '🏮',
    accentHex: '#34d399',
    image: IMG_MARKET2,
    leftLabel: 'Market Intelligence',
    badgeText: '📈 Exploration Demand!',
    mainText: "Lantern Oil is selling at 16 Coins per can — up 4.5% — driven by the sudden demand from rangers, explorers, and curious citizens all heading to investigate the Glowcap Fluttermoth lights at the old ruins.\n\nCopper Lamps are also up 2.1% at 35 Coins each. The Gazette commodity board notes that Silk Cord remains flat at 20 Coins, making it potentially undervalued as the rope-and-rigging demand for Rowan's fence installation grows.",
    choices: [
      { id: 'sell_oil',   label: 'Sell your lantern oil stock at peak', icon: '🏮', xpGain: 15, xpCategory: 'explorer', legacyGain: 8, result: '🏮 Perfect timing! You supply the rangers and receive +15 Explorer XP & +8 Legacy.' },
      { id: 'buy_cord',   label: 'Buy silk cord at the flat rate',      icon: '🕸️', coinCost: 12, xpGain: 15, xpCategory: 'builder', result: '🕸️ -12 Coins. Silk cord resold to Rowan\'s crew for +15 Builder XP.' },
      { id: 'equip',      label: 'Keep a lantern for your own use',     icon: '🔦', result: '🔦 Excellent plan. The ruins at night absolutely warrant your own light source.' },
    ],
  },
  {
    id: 'trade_005',
    type: 'trade_signal',
    gazetteDays: [8],
    title: 'Moth Silk: Rare Market Opportunity!',
    category: 'Trade Ledger',
    icon: '🕸️',
    accentHex: '#34d399',
    image: IMG_MARKET2,
    leftLabel: 'Market Intelligence',
    badgeText: '🦋 Rare Commodity!',
    mainText: "The confirmed Glowcap Fluttermoth migration has created a once-in-a-generation trading opportunity. Naturally shed Moth Silk — collected from old cocoon casings in the archway ruins — is now selling at 55 Coins per yard, up a staggering 15.2%!\n\nHowever, the Gazette's wildlife column reminds readers that 'active collection from living moths constitutes a conservation violation punishable by compulsory gnome walkway duty for six months.'",
    choices: [
      { id: 'sell_silk',   label: 'Sell legally-held moth silk stock',   icon: '🕸️', xpGain: 25, xpCategory: 'explorer', legacyGain: 15, result: '🕸️ Excellent! Naturally shed silk delivered. +25 Explorer XP & +15 Legacy.' },
      { id: 'exhibit',     label: 'Donate a sample to the Gazette exhibit', icon: '🦋', legacyGain: 15, result: '🦋 Feature article published! +15 Legacy for contributing to natural history.' },
      { id: 'tour_pass',   label: 'Buy a viewing entry pass for tomorrow', icon: '🎫', coinCost: 12, xpGain: 8, xpCategory: 'explorer', result: '🎫 -12 Coins. +8 Explorer XP for the official viewing tour. Stunning experience.' },
    ],
  },
  {
    id: 'trade_006',
    type: 'trade_signal',
    gazetteDays: [9, 10],
    title: 'Brass Gears Flying Off the Shelves!',
    category: 'Trade Ledger',
    icon: '⚙️',
    accentHex: '#34d399',
    image: IMG_MARKET,
    leftLabel: 'Market Intelligence',
    badgeText: '⚙️ Repair Boom!',
    mainText: "Brass Gears are selling at 28 Coins per unit — up 8.2% — following the Town Hall Clock Tower crisis and the resulting spike in maintenance demand. Gear Grease has also risen to 12 Coins per tub (up 1.5%).\n\nThe Gazette's market section reports that every clockwork repair shop within 30 kilometres is now backlogged. Anyone with spare mechanical components can sell directly to Rowan Thistle's repair crew at a guaranteed premium.",
    choices: [
      { id: 'sell_gears', label: 'Sell gears to the repair crew',      icon: '⚙️', xpGain: 18, xpCategory: 'builder', legacyGain: 8, result: '⚙️ Gears delivered! Rowan pays with +18 Builder XP & +8 Legacy.' },
      { id: 'buy_copper', label: 'Buy copper bar stock at flat rates',  icon: '🪵', coinCost: 15, xpGain: 20, xpCategory: 'builder', result: '🪵 -15 Coins. Copper bars delivered to clock tower crew for +20 Builder XP.' },
      { id: 'clean_brush', label: 'Buy a cleaning brush — the real hero', icon: '🧹', coinCost: 5, result: '🧹 -5 Coins for the spire cleaning brush. Rowan is grateful for the thinking.' },
    ],
  },
  {
    id: 'trade_007',
    type: 'trade_signal',
    gazetteDays: [6],
    title: 'Sanitizer Oil Drop: Buy the Dip?',
    category: 'Trade Ledger',
    icon: '🧴',
    accentHex: '#34d399',
    image: IMG_MARKET,
    leftLabel: 'Market Intelligence',
    badgeText: '⬇️ Buy Opportunity!',
    mainText: "With the Moss Sneezles outbreak resolved, Sanitizer Oil has dropped to 22 Coins per jar — down 5% — and Bristle Brooms are also down 2.5% to 12 Coins. The Gazette market column calls this a classic post-crisis correction.\n\nAnalysts suggest: 'Academy cleaning season always returns; this dip is temporary.' Anyone who stocks up now should expect prices to recover to normal within the week as school maintenance resumes.",
    choices: [
      { id: 'buy_low',  label: 'Stock up at the reduced price',         icon: '🧴', coinCost: 18, xpGain: 22, xpCategory: 'builder', result: '🧴 -18 Coins. Sanitizer stock delivered to Academy maintenance for +22 Builder XP.' },
      { id: 'broom',    label: 'Buy the brooms too while they\'re cheap', icon: '🧹', coinCost: 10, xpGain: 12, xpCategory: 'builder', result: '🧹 -10 Coins. Brooms delivered to Academy maintenance for +12 Builder XP.' },
      { id: 'careful',  label: 'Observe before committing funds',         icon: '📊', result: '📊 Careful position noted. You track the price movement with professional attention.' },
    ],
  },
  {
    id: 'trade_008',
    type: 'trade_signal',
    gazetteDays: [2],
    title: 'Parchment Prices Rising at Town Hall!',
    category: 'Trade Ledger',
    icon: '📄',
    accentHex: '#34d399',
    image: IMG_MARKET,
    leftLabel: 'Market Intelligence',
    badgeText: '📄 Document Rush!',
    mainText: "Parchment rolls are up 2% to 14 Coins as the Town Hall floods with survey documents and administrative filings related to Rowan Thistle's walkway proposal. Walnut Ink remains steady at 18 Coins per vial.\n\nThe Registry Office alone has placed orders for 40 extra parchment rolls this week. The Gazette classifieds section is receiving unusual numbers of archive-assistant applications. Office supply traders are having an excellent week.",
    choices: [
      { id: 'sell_parch', label: 'Sell parchment rolls at the peak',     icon: '📄', xpGain: 10, xpCategory: 'builder', legacyGain: 6, result: '📄 Quick delivery to the Registry Office! +10 Builder XP & +6 Legacy.' },
      { id: 'buy_ink',    label: 'Buy walnut ink while it\'s flat',      icon: '✒️', coinCost: 12, xpGain: 12, xpCategory: 'explorer', result: '✒️ -12 Coins. Walnut ink delivered to Registry Office for +12 Explorer XP.' },
      { id: 'apply',      label: 'Apply to be an archive assistant',     icon: '📚', xpGain: 8, xpCategory: 'builder', result: '📚 Application submitted! +8 Builder XP for administrative competency training.' },
    ],
  },
];

// ═══════════════════════════════════════════════════════════════
// TAX EVENTS  (colour: orange)  · fires every 28 min
// Goldwhistle-driven, all in-lore with Ganache Grove setting.
// ═══════════════════════════════════════════════════════════════
export const TAX_EVENTS: TownEvent[] = [
  {
    id: 'tax_001',
    type: 'tax_notice',
    gazetteDays: [1, 2],
    title: 'Annual Property Levy Notice',
    category: 'Provincial Treasury',
    icon: '🏠',
    accentHex: '#f97316',
    image: IMG_LIVING,
    leftLabel: 'Tax Authority',
    badgeText: '💸 Payment Due!',
    mainText: "Sir Cornelius Goldwhistle presents the Annual Residential Property Levy. Your Mossberry Cottage, classified as a Grade-2 Residential Dwelling in the Provincial Forest Registry, is assessed at 15 Cocoa Coins for the current civic year.\n\nPayment ensures full standing in the Imperial Registry, access to civic ballots, and — as Sir Goldwhistle notes — 'the continued goodwill of this office, which should not be underestimated.'",
    choices: [
      { id: 'pay_full',  label: 'Pay the 15-Coin levy now',    icon: '✅', coinCost: 15, legacyGain: 10, result: '✅ -15 Coins. Goldwhistle stamps your record with unusual enthusiasm. +10 Legacy.' },
      { id: 'defer',     label: 'Request a 3-day deferral',    icon: '📅', coinCost: 2,  result: '📅 -2 Coins admin fee. Deferral granted! Goldwhistle narrows his eyes precisely once.' },
      { id: 'dispute',   label: 'Formally dispute the levy',   icon: '⚖️', result: '⚖️ Dispute filed! A tribunal is scheduled. Goldwhistle opens an additional ledger.' },
    ],
  },
  {
    id: 'tax_002',
    type: 'tax_notice',
    gazetteDays: [3],
    title: 'Walkway Construction Civic Assessment',
    category: 'Provincial Treasury',
    icon: '🏗️',
    accentHex: '#f97316',
    image: IMG_LIVING,
    leftLabel: 'Tax Authority',
    badgeText: '🏛️ Special Levy!',
    mainText: "Sir Goldwhistle has swiftly calculated that the Gossip Corner walkway project — now approved — will require a one-time Civic Construction Assessment of 12 Cocoa Coins from all Grade-2 and above residents.\n\nHe produces documentation suggesting this was 'implicit in the council vote outcome' and assures residents that it is 'entirely legally sound.' Rowan Thistle has diplomatically declined to comment on the timing.",
    choices: [
      { id: 'pay_assess', label: 'Pay the 12-Coin assessment',          icon: '🏗️', coinCost: 12, legacyGain: 10, result: '🏗️ -12 Coins paid. Walkway gets funded! +10 Legacy for prompt civic contribution.' },
      { id: 'verify_docs', label: 'Request sight of the documentation', icon: '📋', result: '📋 Goldwhistle produces 8 pages of supporting paperwork. Very thorough indeed.' },
      { id: 'pro_bono',   label: 'Volunteer labour instead',            icon: '🔨', xpGain: 12, xpCategory: 'builder', result: '🔨 Labour-credit offer accepted! +12 Builder XP. Goldwhistle marks it "approved".' },
    ],
  },
  {
    id: 'tax_003',
    type: 'tax_notice',
    gazetteDays: [4, 5],
    title: 'Emergency Health Levy: Clinic Funding',
    category: 'Provincial Treasury',
    icon: '🌿',
    accentHex: '#f97316',
    image: IMG_LIVING,
    leftLabel: 'Tax Authority',
    badgeText: '🚨 Emergency Levy!',
    mainText: "The Moss Sneezles outbreak has triggered an Emergency Health Levy of 20 Coins per registered household. The collected funds will directly purchase Dr. Cedric Oakenhart's herb supply and produce the mint tea mandate Sir Goldwhistle now — reluctantly — acknowledges is 'medically justified.'\n\nHe notes with some professional satisfaction that this makes three separate levies this month, which is 'a new personal record.'",
    choices: [
      { id: 'pay_health', label: 'Pay the 20-Coin emergency levy',  icon: '🌿', coinCost: 20, legacyGain: 15, result: '🌿 -20 Coins. +15 Legacy. Clinic funded! Dr. Cedric can now treat everyone.' },
      { id: 'labour3',    label: 'Offer herb-gathering service',     icon: '🌱', xpGain: 12, xpCategory: 'healer', result: '🌱 Labour-credit accepted! +12 Healer XP. You gather herbs in lieu of coins.' },
      { id: 'challenge2', label: 'Challenge the levy timeline',      icon: '⚖️', result: '⚖️ Challenge noted! Captain Butterfield will review it... after the sneezles clear.' },
    ],
  },
  {
    id: 'tax_006',
    type: 'tax_notice',
    gazetteDays: [8],
    title: 'Moth Sanctuary: Conservation Contribution',
    category: 'Provincial Treasury',
    icon: '🦋',
    accentHex: '#f97316',
    image: IMG_LIVING,
    leftLabel: 'Tax Authority',
    badgeText: '🌿 Wildlife Levy!',
    mainText: "Following the council vote to protect the Glowcap Fluttermoth nesting sites, Sir Goldwhistle has calculated the Moth Sanctuary Establishment Contribution at 22 Coins per household. The funds finance Rowan's protective fencing, ranger patrols, and a small memorial plaque.\n\nHe notes with visible satisfaction that this is 'an exceptionally well-structured environmental levy' and that he personally finds moth-related taxation 'a charming novelty.'",
    choices: [
      { id: 'pay_moth',    label: 'Pay the 22-Coin conservation levy',  icon: '🦋', coinCost: 22, legacyGain: 18, result: '🦋 -22 Coins. +18 Legacy. Sanctuary funded! Your plaque inscription to follow.' },
      { id: 'fence_help2', label: 'Help install Rowan\'s fencing today', icon: '🪵', xpGain: 12, xpCategory: 'builder', result: '🪵 In-kind contribution! +12 Builder XP. Goldwhistle marks it properly recorded.' },
      { id: 'goggles',     label: 'Buy the protective goggles and comply', icon: '🥽', coinCost: 10, result: '🥽 -10 Coins for proper equipment. Levy noted separately. Goldwhistle approves.' },
    ],
  },
];

// ═══════════════════════════════════════════════════════════════
// NPC ENCOUNTER EVENTS  (colour: warm amber)  · fires every 13 min
// ═══════════════════════════════════════════════════════════════
export const NPC_ENCOUNTER_EVENTS: TownEvent[] = [
  {
    id: 'npc_001',
    type: 'npc_encounter',
    gazetteDays: [1, 2],
    title: "Rowan Has the Survey Papers!",
    category: 'Character Encounter',
    icon: '📝',
    accentHex: '#fb923c',
    image: IMG_BALCONY,
    leftLabel: 'Town Character',
    badgeText: '🚪 Visitor!',
    mainText: "Rowan Thistle arrives at your gate clutching a bundle of survey documents roughly the size of a small dog. He is visibly anxious.\n\n\"The council meets at third bell and I am meant to deliver EVERY single one of these survey forms before then. I've dropped half of them near the Gossip Corner and Mrs. Petalworth's cat is sitting on three of them and refuses to move. I need someone to retrieve the forms from the cat. Urgently. Please.\"",
    npcName: 'Rowan Thistle',
    npcRole: 'Builder Apprentice & Survey Coordinator',
    choices: [
      { id: 'retrieve',   label: 'Help rescue the forms from the cat',  icon: '🐱', xpGain: 10, xpCategory: 'builder', result: '🐱 Forms retrieved! +10 Builder XP. The cat watches you leave with great dignity.' },
      { id: 'carry',      label: 'Help carry the bundle to the Town Hall', icon: '📋', legacyGain: 8, result: '📋 Documents delivered on time! +8 Legacy for civic survey support.' },
      { id: 'organise',   label: 'Sort and number the pages for him',   icon: '🗂️', xpGain: 8, xpCategory: 'builder', result: '🗂️ Organised and indexed! +8 Builder XP. Rowan stares in grateful amazement.' },
    ],
  },
  {
    id: 'npc_002',
    type: 'npc_encounter',
    gazetteDays: [3, 4],
    title: "Captain Butterfield's Residency Review",
    category: 'Character Encounter',
    icon: '🎩',
    accentHex: '#fb923c',
    image: IMG_BALCONY,
    leftLabel: 'Town Character',
    badgeText: '📋 Official Visit!',
    mainText: "Captain Winston Butterfield, Town Explorer and Detective, appears for the Annual Residency Review. He has a clipboard, two sharpened quills, and his Official Expression of Professional Purpose.\n\n\"Splendid day! Seven standard questions. Question One: Can you identify all current active council votes? Question Two: Have you read the Ganache Gazette this week? The civic literacy of this district is my personal responsibility, you understand.\"",
    npcName: 'Captain Winston Butterfield',
    npcRole: 'Town Explorer & Detective',
    choices: [
      { id: 'full_answers', label: 'Answer all seven questions fully',   icon: '📋', legacyGain: 18, result: '📋 "EXEMPLARY CIVIC CITIZEN" written in capitals. +18 Legacy! Captain Butterfield beams.' },
      { id: 'honest_try',  label: 'Answer honestly: you know most of it', icon: '🤷', xpGain: 10, xpCategory: 'builder', result: '🤷 He lectures for 20 minutes. +10 Builder XP for the civic education received.' },
      { id: 'newspaper',   label: 'Show him your copy of today\'s Gazette', icon: '📰', legacyGain: 10, result: '📰 Excellent demonstration! +10 Legacy. He notes you have "commendable media literacy."' },
    ],
  },
  {
    id: 'npc_003',
    type: 'npc_encounter',
    gazetteDays: [4, 5, 6],
    title: "Dr. Cedric's Emergency House Call",
    category: 'Character Encounter',
    icon: '⚕️',
    accentHex: '#fb923c',
    image: IMG_BALCONY,
    leftLabel: 'Town Character',
    badgeText: '🏥 Medical Visit!',
    mainText: "Dr. Cedric Oakenhart appears carrying a medical bag, a stethoscope, and a thermos of fresh mint tea described as 'precautionary.'\n\n\"I'm checking all residents near the Academy corridor — purely as a precaution regarding the Moss Sneezles situation. Now: green tips anywhere? Any unusual nose sensations? Excellent. Here, drink this. You look like someone who has been breathing canopy air without proper filtration. How many cups of mint tea per day are you having? Fewer than two is a concern.\"",
    npcName: 'Dr. Cedric Oakenhart',
    npcRole: 'Town Physician & Wellness Advocate',
    choices: [
      { id: 'full_checkup', label: 'Accept the full health assessment',   icon: '⚕️', xpGain: 12, xpCategory: 'healer', result: '⚕️ Clean bill of health! +12 Healer XP and a signed Wellness Certificate issued.' },
      { id: 'tea_accepted', label: 'Accept the mint tea gratefully',      icon: '🍃', xpGain: 10, xpCategory: 'healer', result: '🍃 Therapeutic! +10 Healer XP from the nutritional herbal health tonics.' },
      { id: 'volunteer',   label: 'Offer to volunteer at the clinic',    icon: '🏥', xpGain: 10, xpCategory: 'healer', result: '🏥 Accepted! +10 Healer XP. Dr. Cedric hands you a mint-tipped name badge.' },
    ],
  },
  {
    id: 'npc_004',
    type: 'npc_encounter',
    gazetteDays: [1, 2, 3],
    title: "Sir Goldwhistle's Surprise Audit!",
    category: 'Character Encounter',
    icon: '📒',
    accentHex: '#fb923c',
    image: IMG_BALCONY,
    leftLabel: 'Town Character',
    badgeText: '🚨 AUDIT!',
    mainText: "Sir Goldwhistle arrives at your door holding three oversized ledgers, a brass measurement instrument, and what can only be described as 'professional excitement.'\n\n\"ROUTINE AUDIT! Do not be alarmed — entirely standard. I require: all Cocoa Coin transaction records for the last quarter, your current inventory list, proof of civic registration, and — if available — confirmation of how you came to possess those wafer tiles during the construction demand period. This will take approximately three hours.\"",
    npcName: 'Sir Goldwhistle',
    npcRole: 'Tax Collector & Auditor',
    choices: [
      { id: 'full_coop',  label: 'Full cooperation — open every book', icon: '📖', legacyGain: 20, result: '📖 Spotless records! "CITIZEN IN GOOD STANDING" stamped in gold. +20 Legacy.' },
      { id: 'partial',    label: 'Cooperate but ask smart questions',  icon: '😅', legacyGain: 8,  result: '😅 Minor items queried. All resolved. +8 Legacy. One sidelong glance given.' },
      { id: 'legal_rep',  label: 'Request a formal legal representative', icon: '⚖️', result: '⚖️ Formal request filed! Sir Goldwhistle nods, signs a form, and books a tribunal date.' },
    ],
  },
  {
    id: 'npc_005',
    type: 'npc_encounter',
    gazetteDays: [6, 7],
    title: "Mrs. Petalworth Brings Recovery Gifts!",
    category: 'Character Encounter',
    icon: '🌸',
    accentHex: '#fb923c',
    image: IMG_BALCONY,
    leftLabel: 'Town Character',
    badgeText: '🎁 Neighbourly Visit!',
    mainText: "Mrs. Petalworth arrives carrying pinecone tarts, forest honey jam, and a sprig of something she describes as 'very cleansing for the post-sneezle aura.'\n\n\"I made these tarts entirely by accident in quantities of forty. Now that the Academy is recovered I thought: recovery tarts! You look pale. You've been outside near the ruins, haven't you. Have you seen the moths? Rowan showed me three of them through his rangefinder lens. Absolutely divine. Anyway. Eat a tart.\"",
    npcName: 'Mrs. Petalworth',
    npcRole: 'Flower Vendor & Rebel Coordinate',
    choices: [
      { id: 'accept_all',  label: 'Accept all the tarts and jam!',          icon: '🥧', xpGain: 12, xpCategory: 'healer', result: '🥧 Delicious! +12 Healer XP. Mrs. Petalworth beams with satisfaction.' },
      { id: 'moth_chat',   label: 'Ask all about the moths she saw',         icon: '🦋', legacyGain: 8,  result: '🦋 Forty-minute conversation! +8 Legacy. You now know every moth species by wing pattern.' },
      { id: 'tea_invite',  label: 'Invite her in for a recovery tea',       icon: '🍵', legacyGain: 8,  xpGain: 8, xpCategory: 'healer', result: '🍵 +8 Legacy & +8 Healer XP. Best neighbour ever.' },
    ],
  },
  {
    id: 'npc_006',
    type: 'npc_encounter',
    gazetteDays: [9],
    title: "Rowan Needs Your Engineering Logic!",
    category: 'Character Encounter',
    icon: '🔧',
    accentHex: '#fb923c',
    image: IMG_BALCONY,
    leftLabel: 'Town Character',
    badgeText: '📐 Help Needed!',
    mainText: "Rowan Thistle arrives with chalk-dusted hands and deep concern.\n\n\"I've worked out the load calculation for the Bell Tower scaffold. The main platform needs to hold the electric motor parts — 380 kg. I have 6 timber beams rated at 80 kg each. That's 480 kg capacity total. But wait — do the joints lose 15% of rated load capacity? If yes, that's 408 kg. Am I safe? Please say I'm safe.\"",
    npcName: 'Rowan Thistle',
    npcRole: 'Builder Apprentice & Structural Enthusiast',
    choices: [
      { id: 'correct_calc', label: "408 kg > 380 kg — You're safely above threshold!", icon: '🧮', xpGain: 15, xpCategory: 'builder', result: "🧮 Correct! 408 > 380 safely. +15 Builder XP. Rowan's relief is visible from 10 metres." },
      { id: 'extra_beams',  label: 'Recommend 2 extra beams for safety margin',        icon: '🔧', xpGain: 10, xpCategory: 'builder', result: '🔧 Smart engineering practice! +10 Builder XP. Extra beams added. Excellent margin.' },
      { id: 'call_expert',  label: 'Suggest calling a master engineer too',            icon: '📞', legacyGain: 5, result: '📞 Very responsible! +5 Legacy for knowing when to call in professional oversight.' },
    ],
  },
  {
    id: 'npc_007',
    type: 'npc_encounter',
    gazetteDays: [5, 6],
    title: "Sheriff Bramfield's Document Check",
    category: 'Character Encounter',
    icon: '⭐',
    accentHex: '#fb923c',
    image: IMG_BALCONY,
    leftLabel: 'Town Character',
    badgeText: '🔍 Document Check!',
    mainText: "Sheriff Aldous Bramfield stops you on Mossberry Lane holding his shiny sheriff badge and an expression suggesting he invented the concept of professional thoroughness.\n\n\"Identification papers, please, Citizen. Provincial Residency Certificate. Your Imperial Registry stamp for the current quarter — noting this is mid-outbreak season and compliance rates have been... colourful. Have you been to the Academy district recently? Dr. Cedric has asked us to run standard wellness checks.\"",
    npcName: 'Sheriff Aldous Bramfield',
    npcRole: 'Town Sheriff & Chief Law Enforcer',
    choices: [
      { id: 'all_papers',  label: 'Present all papers — all perfectly in order!', icon: '📜', legacyGain: 12, result: '📜 Exemplary documentation! Sheriff Bramfield stamps your record with approval. +12 Legacy.' },
      { id: 'missing_doc', label: 'Missing the seasonal wellness stamp',          icon: '😬', coinCost: 5,  result: '😬 -5 Coins admin fee. Stamp secured on the spot. Sheriff Bramfield is thorough but fair.' },
      { id: 'hat_distract', label: "Compliment his official sheriff hat",          icon: '🎩', result: '🎩 He spends 7 minutes on badge-and-hat specifications. You depart. Technically checked.' },
    ],
  },
  {
    id: 'npc_008',
    type: 'npc_encounter',
    gazetteDays: [10],
    title: "Baker Bramble's Celebratory Trade Offer",
    category: 'Character Encounter',
    icon: '🥐',
    accentHex: '#fb923c',
    image: IMG_BALCONY,
    leftLabel: 'Town Character',
    badgeText: '🤝 Trade Offer!',
    mainText: "Baker Bramble Mortimer arrives carrying what smells like the finest chocolate croissants in living memory — part of the celebratory batch he baked. He has extras.\n\n\"Right. The bell is ringing! Business is back! I have 8 surplus celebration croissants and I hear you have copper brackets in your workshop. One bracket — any size, any age — for four croissants. I am in an excellent mood and am prepared to be generous.\"",
    npcName: 'Baker Bramble Mortimer',
    npcRole: 'Town Baker & Confectioner',
    choices: [
      { id: 'accept_trade', label: 'Accept! 1 bracket for 4 croissants!',   icon: '🤝', xpGain: 10, xpCategory: 'healer', result: '🤝 Done! 4 croissants received. +10 Healer XP for culinary support.' },
      { id: 'counter',      label: 'Counter: 1 bracket for all 8 croissants', icon: '🧮', xpGain: 15, xpCategory: 'healer', result: '🧮 All 8 croissants secured. +15 Healer XP.' },
      { id: 'gift',         label: 'Give her a bracket — her day deserves it', icon: '🎁', legacyGain: 8,  result: '🎁 You give it as a gift! +8 Legacy. Baker Bramble insists on leaving you six croissants anyway.' },
    ],
  },
];

// ═══════════════════════════════════════════════════════════════
// COMBINED EXPORT — used by the event queue engine in TravellersDesk
// ═══════════════════════════════════════════════════════════════
export const ALL_TIMED_EVENTS: TownEvent[] = [
  ...GOSSIP_EVENTS,
  ...TRANSPORT_EVENTS,
  ...POLITICS_EVENTS,
  ...TRADE_EVENTS,
  ...TAX_EVENTS,
  ...NPC_ENCOUNTER_EVENTS,
];

/**
 * Event timing intervals in milliseconds.
 * Used by the queue engine in TravellersDesk.tsx.
 * Staggered so no two types can fire simultaneously.
 */
export const EVENT_INTERVALS_MS: Record<EventType, number> = {
  flash_news:       0,          // handled separately via 3h block
  gossip_drop:      30 * 60000, // every 30 min
  npc_encounter:    33 * 60000, // every 33 min
  transport_update: 36 * 60000, // every 36 min
  trade_signal:     39 * 60000, // every 39 min
  politics_brief:   42 * 60000, // every 42 min
  tax_notice:       45 * 60000, // every 45 min
};
