// bakeryData.ts
// ─────────────────────────────────────────────────────────────────────────────
// All static data for the Oven Timing mini-game system.
// Recipes, orders, events, daily modifiers, achievements.
// ─────────────────────────────────────────────────────────────────────────────

import type {
  Recipe, OrderGroup, GameEvent, DailyModifier,
  BakeryAchievement, ApprenticeChapter,
} from './bakeryTypes';

// ── Recipes (8 existing + 2 After-Hours exclusives) ───────────────────────────
// ── Recipes (8 existing + 2 After-Hours exclusives) ───────────────────────────
export const RECIPES: Recipe[] = [
  { id:1, name:'Midday Golden Bun',   icon:'🥯', requiredTemp:160, bakeDuration:28, tempLabel:'LOW',
    driftSpeed:6,  burnSpeed:1.0, goldenWidth:20, category:'dessert',
    phrases:['Rising...','Puffing up...','Almost set...','Setting nicely...'],
    story:"Lady Butterscotch's afternoon tea",
    ingredientsNeeded: { 'sweetbread': 1 } },
  { id:2, name:'Old Oak Honey Loaf',  icon:'🍯', requiredTemp:200, bakeDuration:38, tempLabel:'HIGH',
    driftSpeed:10, burnSpeed:1.3, goldenWidth:16, category:'loaf',
    phrases:['Rising...','Crust forming...','Browning...','Nearly ready...'],
    story:'Festival Committee centrepiece',
    ingredientsNeeded: { 'honey-syrup': 1, 'sweetbread': 1 } },
  { id:3, name:'Caramel Drizzle Tart', icon:'🍮', requiredTemp:175, bakeDuration:22, tempLabel:'MEDIUM',
    driftSpeed:7,  burnSpeed:0.9, goldenWidth:22, category:'dessert',
    phrases:['Custard setting...','Caramel bubbling...','Almost there...','Setting...'],
    story:'Oakenhart Clinic dessert round',
    ingredientsNeeded: { 'caramelized-roses': 1, 'honey-syrup': 1 } },
  { id:4, name:'Cozy Butter Croissant', icon:'🥐', requiredTemp:190, bakeDuration:26, tempLabel:'HIGH',
    driftSpeed:14, burnSpeed:1.4, goldenWidth:14, category:'pastry',
    phrases:['Rising fast!','Layers forming...','Browning quickly!','Almost golden!'],
    story:"Traveller's Inn morning batch",
    ingredientsNeeded: { 'sugar-beets': 1, 'butterscotch-blossoms': 1 } },
  { id:5, name:'Blueberry Forest Pie', icon:'🫐', requiredTemp:185, bakeDuration:32, tempLabel:'MEDIUM',
    driftSpeed:8,  burnSpeed:1.0, goldenWidth:18, category:'dessert',
    phrases:['Bubbling...','Berry steam rising...','Crumble crisping...','Nearly done...'],
    story:'Gossip Corner evening special',
    ingredientsNeeded: { 'honey-syrup': 1, 'marshmallow-strawberries': 1 } },
  { id:6, name:'Glazed Wafer',         icon:'🍪', requiredTemp:168, bakeDuration:14, tempLabel:'LOW',
    driftSpeed:5,  burnSpeed:1.8, goldenWidth:12, category:'pastry',
    phrases:['Crisping fast!','Browning quickly!','Watch it!','Almost done...'],
    story:"Schoolchildren's treat boxes",
    ingredientsNeeded: { 'sugar-beets': 1 } },
  { id:7, name:'Ganache Birthday Cake', icon:'🎂', requiredTemp:210, bakeDuration:44, tempLabel:'VERY HIGH',
    driftSpeed:12, burnSpeed:1.1, goldenWidth:16, category:'loaf',
    phrases:['Deep heating...','Setting slowly...','Chocolate setting...','Crust forming...'],
    story:"Sir Goldwhistle's birthday",
    ingredientsNeeded: { 'cocoa-pods': 1, 'sugar-beets': 2 } },
  { id:8, name:'Cinnamon Roll',        icon:'🌀', requiredTemp:172, bakeDuration:20, tempLabel:'LOW',
    driftSpeed:7,  burnSpeed:1.2, goldenWidth:18, category:'pastry',
    phrases:['Dough puffing...','Rising nicely...','Cinnamon fragrance!','Nearly ready...'],
    story:'Morning rush at Canal Café',
    ingredientsNeeded: { 'sugar-beets': 1 } },
  // After-Hours exclusives
  { id:9, name:'Chocolate Swirl Pastry', icon:'🍫', requiredTemp:195, bakeDuration:24, tempLabel:'HIGH',
    driftSpeed:16, burnSpeed:1.5, goldenWidth:10, category:'pastry',
    phrases:['Dark chocolate rising...','Choux puffing!','Almost there...','Delicate now!'],
    story:"After-Hours special — Chef Caramel's secret recipe",
    afterHoursOnly: true,
    ingredientsNeeded: { 'cocoa-pods': 1, 'ganache-cherries': 1 } },
  { id:10, name:'Golden Brioche',        icon:'✨', requiredTemp:180, bakeDuration:36, tempLabel:'MEDIUM',
    driftSpeed:6,  burnSpeed:0.8, goldenWidth:24, category:'loaf',
    phrases:['Rich dough rising...','Butter melting in...','Golden crust forming...','Almost perfect!'],
    story:'The legendary midnight bake',
    afterHoursOnly: true,
    ingredientsNeeded: { 'sweetbread': 1, 'honey-syrup': 1 } },
];

// Seasonal Recipes (inserted dynamically based on active season in engine)
export const SEASONAL_RECIPES = {
  spring: { name: 'Cozy Berry Tart', icon: '🍓', requiredTemp: 170, bakeDuration: 24, driftSpeed: 7, burnSpeed: 1.1, goldenWidth: 20, category: 'dessert' as const, story: 'Spring Equinox celebration sweet', ingredientsNeeded: { 'sugar-beets': 1, 'butterscotch-blossoms': 1 } },
  summer: { name: 'Citrus Lemon Cake', icon: '🍋', requiredTemp: 180, bakeDuration: 26, driftSpeed: 8, burnSpeed: 1.0, goldenWidth: 18, category: 'dessert' as const, story: 'Midsummer Solstice cool bake', ingredientsNeeded: { 'sugar-beets': 1, 'honey-syrup': 1 } },
  autumn: { name: 'Glazed Apple Pie', icon: '🍎', requiredTemp: 190, bakeDuration: 30, driftSpeed: 9, burnSpeed: 0.9, goldenWidth: 22, category: 'dessert' as const, story: 'Harvest festival special pie', ingredientsNeeded: { 'glazed-carrots': 1, 'honey-syrup': 1 } },
  winter: { name: 'Hot Chocolate Roll', icon: '🟫', requiredTemp: 205, bakeDuration: 34, driftSpeed: 11, burnSpeed: 1.2, goldenWidth: 16, category: 'pastry' as const, story: 'Frostbite shelter warmth bread', ingredientsNeeded: { 'cocoa-pods': 1, 'marshmallow-strawberries': 1 } },
};

// ── Bakery Customer Base ───────────────────────────────────────────────────────
export interface BakeryCustomerTemplate {
  id: string;
  name: string;
  avatar: string;
  dialogues: string[];
}

export const BAKERY_CUSTOMERS: BakeryCustomerTemplate[] = [
  {
    id: 'marshal',
    name: 'Marshal Frill',
    avatar: '/Assets/Ganache Grove/Characters/Marshal_Frill_townsfolk.png',
    dialogues: [
      'Hearty Old Oak Honey Loaf keeps my energy up on forest patrol!',
      'I need a warm croissant before patrol duty.',
      'A quick bite, Chef, the borders are busy!'
    ]
  },
  {
    id: 'pipkin',
    name: 'Pipkin',
    avatar: '/Assets/Ganache Grove/Characters/Pipkin_Nutterby_townsfolk.png',
    dialogues: [
      "Bramble's tarts are the talk of the Nutterby clan!",
      'Mmm... sweetbread rolls! Can I get three?',
      'A perfect bake makes my hazelnut tail twitch!'
    ]
  },
  {
    id: 'professor',
    name: 'Professor Oats',
    avatar: '/Assets/Ganache Grove/Characters/Teacher_townsfolk.png',
    dialogues: [
      'Ah, bakery sciences! A Cinnamon Roll for cerebral fuel.',
      'I\'m researching local yeasts, let me inspect a slice.',
      'A quick bun, Chef, the academy bell is about to ring!'
    ]
  },
  {
    id: 'innkeeper',
    name: 'Innkeeper',
    avatar: '/Assets/Ganache Grove/Characters/Innkeeper_townsfolk.png',
    dialogues: [
      'Our travelers won\'t stop asking for your Blueberry Pies!',
      'Need a large batch for the morning room service.',
      'A fresh loaf, Lady Butterscotch just checked in!'
    ]
  },
  {
    id: 'vendor',
    name: 'Vegetable Vendor',
    avatar: '/Assets/Ganache Grove/Characters/vegetablevendor_townsfolk.png',
    dialogues: [
      'Bake it sweet! I traded my best carrots for this tart.',
      'A sweetbread for energy, it\'s market day!',
      'Looking for a caramelized rose dessert today.'
    ]
  },
  {
    id: 'explorer',
    name: 'Explorer',
    avatar: '/Assets/Ganache Grove/Characters/Explorer1_townsfolk.png',
    dialogues: [
      'A Cinnamon Roll to pack for the Mossberry expedition!',
      'I need a dense honey loaf that won\'t spoil in my bag.',
      'A quick pastry before I head past the whispering trees.'
    ]
  },
  {
    id: 'beggar',
    name: 'Beggar',
    avatar: '/Assets/Ganache Grove/Characters/Begger_townsfolk.png',
    dialogues: [
      'Smells like heaven in here... any warm buns to spare?',
      'Thank you, Chef, a waft of this bread is a warm hug.',
      'A simple sweetbread roll would bless my morning.'
    ]
  }
];

// ── Standard shift orders ──────────────────────────────────────────────────────
export const INITIAL_ORDERS: OrderGroup[] = [
  { id:'inn',      customer:"Traveller's Inn",    customerName: 'Innkeeper',      avatarImage: '/Assets/Ganache Grove/Characters/Innkeeper_townsfolk.png',      customerDialogue: "Our travelers won't stop asking for your Blueberry Pies!", icon:'🏨', face:'😊', need:3, done:0, patience:100, category:'pastry',  comment:'', ingredientsNeeded: { 'sugar-beets': 1 } },
  { id:'clinic',   customer:'Oakenhart Clinic',   customerName: 'Professor Oats',  avatarImage: '/Assets/Ganache Grove/Characters/Teacher_townsfolk.png',        customerDialogue: "Ah, bakery sciences! A Cinnamon Roll for cerebral fuel.",  icon:'⚕️', face:'😊', need:2, done:0, patience:100, category:'dessert', comment:'', ingredientsNeeded: { 'sugar-beets': 1 } },
  { id:'festival', customer:'Festival Committee', customerName: 'Marshal Frill',   avatarImage: '/Assets/Ganache Grove/Characters/Marshal_Frill_townsfolk.png',   customerDialogue: "Hearty Old Oak Honey Loaf keeps my energy up on forest patrol!", icon:'🎪', face:'😊', need:4, done:0, patience:100, category:'loaf',    comment:'', ingredientsNeeded: { 'sweetbread': 1 } },
];

// ── After-Hours order templates (shuffled per session) ─────────────────────────
export const AFTER_HOURS_ORDER_POOL: Omit<OrderGroup, 'done' | 'comment' | 'face'>[] = [
  { id:'midnight', customer:'Midnight Tavern',   icon:'🌙', need:3, patience:100, category:'pastry'  },
  { id:'manor',    customer:'Goldwhistle Manor', icon:'🏰', need:2, patience:100, category:'loaf'    },
  { id:'theatre',  customer:'Grove Theatre',     icon:'🎭', need:4, patience:100, category:'dessert' },
  { id:'railway',  customer:'Railway Buffet',    icon:'🚂', need:3, patience:100, category:'loaf'    },
  { id:'guild',    customer:'Baker\'s Guild',    icon:'⚜️', need:2, patience:100, category:'pastry'  },
];

// ── Events (6 standard + 6 After-Hours exclusive) ─────────────────────────────
export const POSSIBLE_EVENTS: Omit<GameEvent, 'resolved'>[] = [
  { id:'butter',   icon:'🔥', title:'Butter Overflow!',           body:'Oven 2 is bubbling over — act fast!',         timeLimit:6,
    choices:[{ label:'Clean it',        good:true  }, { label:'Ignore',          good:false }, { label:'Use spare tray', good:true }] },
  { id:'steam',    icon:'💨', title:'Steam Valve Loose!',          body:'Excess moisture can ruin the crust!',          timeLimit:6,
    choices:[{ label:'Tighten it',      good:true  }, { label:'Open vent',       good:true  }, { label:'Ignore',         good:false }] },
  { id:'glaze',    icon:'👨‍🍳', title:'Apprentice asks:',            body:'"Should I glaze the tart now, Chef?"',        timeLimit:7,
    choices:[{ label:'Yes, glaze it',   good:true  }, { label:'Not yet',         good:true  }, { label:'Skip it',        good:false }] },
  { id:'bell',     icon:'🔔', title:'Oven 1 Overheating!',         body:'Reduce heat immediately — 5 seconds!',         timeLimit:5,
    choices:[{ label:'Reduce heat',     good:true  }, { label:'Open door',       good:false }] },
  { id:'order',    icon:'📜', title:"Mayor's Office — Rush Order!", body:'"The council needs a fresh Cocoa Loaf!"',      timeLimit:8,
    choices:[{ label:'Accept (+rep)',   good:true  }, { label:'Politely decline', good:true }, { label:'Delay it',       good:false }] },
  { id:'flour',    icon:'🐭', title:'Mouse in the Pantry!',        body:"It's eyeing the flour — shoo it away!",        timeLimit:5,
    choices:[{ label:'Shoo it out!',    good:true  }, { label:'Ignore it',       good:false }] },
  // After-Hours exclusive events
  { id:'cat',      icon:'🐱', title:'Cat on the Oven!',            body:'The bakery cat found the warmest spot!',       timeLimit:5,
    choices:[{ label:'Shoo it gently',  good:true  }, { label:'Let it sleep',    good:false }], afterHoursOnly:true },
  { id:'spill',    icon:'🧈', title:'Butter Spill!',               body:'Wipe it before it reaches the floor!',         timeLimit:5,
    choices:[{ label:'Wipe quickly',    good:true  }, { label:'Leave it',        good:false }], afterHoursOnly:true },
  { id:'changed',  icon:'📋', title:'Customer Changed Order!',     body:'They now want pastries instead of loaves!',    timeLimit:6,
    choices:[{ label:'Adapt quickly',   good:true  }, { label:'Refuse change',   good:false }], afterHoursOnly:true },
  { id:'fireworks',icon:'🎆', title:'Festival Fireworks!',         body:'Everyone looks outside — stay focused!',       timeLimit:4,
    choices:[{ label:'Stay focused',    good:true  }, { label:'Look outside',    good:false }], afterHoursOnly:true },
  { id:'light',    icon:'💡', title:'Oven Light Failed!',          body:'Tap the lantern to restore visibility!',       timeLimit:6,
    choices:[{ label:'Tap lantern',     good:true  }, { label:'Bake in dark',    good:false }], afterHoursOnly:true },
  { id:'rush',     icon:'👑', title:'VIP Arrives Early!',          body:'The Mayor wants his order in 2 minutes!',      timeLimit:7,
    choices:[{ label:'Rush the order',  good:true  }, { label:'Politely stall',  good:true  }, { label:'Say no',         good:false }], afterHoursOnly:true },
];

// ── 15 Daily Modifiers (roguelike — seeded from current date) ─────────────────
export const ALL_DAILY_MODIFIERS: DailyModifier[] = [
  { id:'rainy',      name:'Rainy Day',          icon:'🌧️', difficulty:2,
    description:'Temperature drops 30% faster in the damp air.',
    effects:{ driftMultiplier:1.3 } },
  { id:'summer',     name:'Summer Heat',        icon:'☀️', difficulty:3,
    description:'Temperature rises 40% faster — ovens are unpredictable.',
    effects:{ driftMultiplier:1.4 } },
  { id:'flour',      name:'Flour Shortage',     icon:'🌾', difficulty:2,
    description:'Smaller recipes only. They bake faster but earn less.',
    effects:{ bakingSpeedMultiplier:1.3 } },
  { id:'vip',        name:'VIP Inspection',     icon:'👑', difficulty:4,
    description:'Chef Goldwhistle is watching. Burns cost double — but perfects reward double.',
    effects:{ burnPenaltyMultiplier:2, scoreMultiplier:1.5 } },
  { id:'festival',   name:'Children\'s Festival',icon:'🎠', difficulty:2,
    description:'Tiny recipes, quick bakes, happy children.',
    effects:{ bakingSpeedMultiplier:1.5, goldenChanceBonus:0.15 } },
  { id:'holiday',    name:'Holiday Rush',       icon:'🎉', difficulty:3,
    description:'Double the customers, double the orders.',
    effects:{ extraCustomers:2 } },
  { id:'outage',     name:'Power Outage',       icon:'💡', difficulty:4,
    description:'Temperature readout flickers every 8 seconds.',
    effects:{ driftMultiplier:1.0 } }, // handled visually
  { id:'choc',       name:'Double Choc Week',   icon:'🍫', difficulty:1,
    description:'Golden bread appears more often. The town loves chocolate.',
    effects:{ goldenChanceBonus:0.2, moreGoldenOrders:true } },
  { id:'night',      name:'Night Shift',        icon:'🌙', difficulty:3,
    description:'Double drift. 20% better chance of golden bread.',
    effects:{ driftMultiplier:2.0, goldenChanceBonus:0.2 } },
  { id:'sweet',      name:'Sweet Festival',     icon:'🎪', difficulty:1,
    description:'More golden orders today. No butter spills.',
    effects:{ moreGoldenOrders:true, noButterSpill:true } },
  { id:'cat',        name:'Cat Event Night',    icon:'🐱', difficulty:2,
    description:'The bakery cats are restless. Frequent feline interruptions.',
    effects:{ catEventsFrequent:true } },
  { id:'midnight',   name:'Midnight Special',   icon:'🌟', difficulty:3,
    description:'Score ×1.5. Temperature drifts ×1.5. High risk, high reward.',
    effects:{ driftMultiplier:1.5, scoreMultiplier:1.5 } },
  { id:'apprentice', name:'Apprentice Day',     icon:'🎓', difficulty:1,
    description:'A free Auto-Stir hint available for today\'s session.',
    effects:{} }, // handled in hint panel
  { id:'storm',      name:'Storm Warning',      icon:'⛈️', difficulty:5,
    description:'Random oven shutdowns for 5 seconds. Survive the chaos.',
    effects:{ driftMultiplier:1.8 } },
  { id:'golden',     name:'Golden Morning',     icon:'✨', difficulty:1,
    description:'The perfect bake window is 10% wider today.',
    effects:{ widerGoldenZone:true } },
];

// ── Achievements ───────────────────────────────────────────────────────────────
export const BAKERY_ACHIEVEMENTS: BakeryAchievement[] = [
  {
    id: 'no_burns',
    name: 'Never Burned a Loaf',
    icon: '🏆',
    description: 'Complete a full Bakery Shift with 0 burns.',
    check: (_stats, sessionBurns) => sessionBurns === 0,
  },
  {
    id: 'perfect_25',
    name: 'Perfect 25',
    icon: '✨',
    description: 'Reach 25 lifetime perfect bakes.',
    check: (stats) => stats.lifetimePerfectBakes >= 25,
  },
  {
    id: 'combo_master',
    name: 'Combo Master',
    icon: '🔥',
    description: 'Reach a ×10 combo in a single session.',
    check: (_stats, _burns, sessionCombo) => (sessionCombo ?? 0) >= 10,
  },
  {
    id: 'golden_baker',
    name: 'Golden Baker',
    icon: '🥇',
    description: 'Fulfil 10 lifetime golden orders.',
    check: (stats) => stats.lifetimeGoldenOrders >= 10,
  },
  {
    id: 'festival_hero',
    name: 'Festival Hero',
    icon: '🎪',
    description: 'Complete the Festival Committee order 3 times in one shift.',
    check: (_stats) => false, // checked separately via session flag
  },
];

// ── Apprenticeship chapters ────────────────────────────────────────────────────
export const APPRENTICE_CHAPTERS: ApprenticeChapter[] = [
  {
    id: 0, title: 'Welcome', spotlight: null, action: 'none',
    chefSays: 'Welcome to Ganache Grove Bakery! Every baker starts as an apprentice. Let\'s see if you\'re ready to earn your apron.',
  },
  {
    id: 1, title: 'Know Your Bakery', spotlight: 'flour-sack', action: 'click', clickTarget: 'flour-sack',
    chefSays: 'This is the flour sack — our most important ingredient. Click on it!',
  },
  {
    id: 2, title: 'Know Your Bakery', spotlight: 'the-oven', action: 'click', clickTarget: 'the-oven',
    chefSays: 'Good! Now click the Oven — this is where the magic happens.',
  },
  {
    id: 3, title: 'Know Your Bakery', spotlight: 'temp-dial', action: 'click', clickTarget: 'temp-dial',
    chefSays: 'Excellent! Now the Temperature Dial — you\'ll use this constantly.',
  },
  {
    id: 4, title: 'Know Your Bakery', spotlight: 'cooling-rack', action: 'click', clickTarget: 'cooling-rack',
    chefSays: 'The Cooling Rack — where fresh bread rests before serving.',
  },
  {
    id: 5, title: 'Know Your Bakery', spotlight: 'order-bell', action: 'click', clickTarget: 'order-bell',
    chefSays: 'And the Order Bell — when it rings, a customer is waiting!',
  },
  {
    id: 6, title: 'Load the Oven', spotlight: 'the-oven', action: 'click', clickTarget: 'oven-load',
    chefSays: 'Now let\'s bake! I\'ve prepared the dough. Place it in the oven — click the oven door.',
  },
  {
    id: 7, title: 'Set the Temperature', spotlight: 'temp-dial', action: 'adjust',
    chefSays: 'Turn the temperature dial until the pointer reaches the GREEN zone. Use the + and − buttons.',
  },
  {
    id: 8, title: 'Baking!', spotlight: 'progress-bar', action: 'wait',
    chefSays: 'Now we wait. Watch the progress bar. When it glows golden — click PULL immediately!',
  },
  {
    id: 9, title: 'One Small Incident', spotlight: null, action: 'watch',
    chefSays: 'Ah! Something has happened in the kitchen. Read carefully and choose wisely!',
  },
  {
    id: 10, title: 'Graduation', spotlight: null, action: 'none',
    chefSays: '',
  },
];

// ── Order comment pools ────────────────────────────────────────────────────────
export const ORDER_COMMENTS = {
  inn: {
    full:    ["Breakfast was wonderful, thank you!", "Our guests are delighted!"],
    partial: ["Could've been a bit more...", "We managed, but barely."],
    none:    ["We had to send our guests elsewhere.", "Disappointing morning."],
  },
  clinic: {
    full:    ["Nurse Hazel sends her thanks!", "The patients loved it."],
    partial: ["Better than nothing, appreciate it.", "Just enough for the ward."],
    none:    ["We had nothing for the patients.", "Chef, the clinic needed you."],
  },
  festival: {
    full:    ["The crowd loved every bite!", "Sir Goldwhistle was impressed!"],
    partial: ["The festival made do with what we had.", "A few guests went without."],
    none:    ["The festival went without bakery goods.", "A difficult day for the committee."],
  },
};

// ── Score thresholds for cosmetic unlocks ──────────────────────────────────────
export const COSMETIC_THRESHOLDS = [
  { score: 500,  name: 'Bronze Apron',        icon: '🥉', description: 'Earned 500+ in After-Hours' },
  { score: 1000, name: 'Golden Rolling Pin',  icon: '🥖', description: 'Earned 1,000+ in After-Hours' },
  { score: 2000, name: 'Chocolate Oven Skin', icon: '🍰', description: 'Earned 2,000+ in After-Hours' },
  { score: 3500, name: 'Master Baker Portrait', icon: '🎖️', description: 'Earned 3,500+ in After-Hours' },
];
