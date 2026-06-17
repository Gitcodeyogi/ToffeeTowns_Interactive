import type { Theme, Badge } from '../types';
import { getAssetUrl } from '../utils/getAssetUrl';
import { BOSSES_GUILD } from './bosses';
import { REBELS_GUILD } from './rebels';

export const STUDIO_NAME = 'TINBLINK STUDIOS';
export const PLACEHOLDER_SCENE_URL = 'placeholder_scene';
export const PLACEHOLDER_CHARACTER_URL = 'placeholder_character';

// Standard Level Progression: Rookie to Legend
export const UNIFORM_LEVEL_NAMES = [
    "Rookie",
    "Scout",
    "Recruit",
    "Agent",
    "Elite",
    "Veteran",
    "Commander",
    "Titan",
    "Master",
    "Legend"
];

export const SHADE_COLORS: Record<string, string> = {
    pink: '236,72,153',
    green: '16,185,129',
    blue: '59,130,246',
    yellow: '234,179,8',
    black: '0,0,0',
    purple: '168,85,247',
    teal: '20,184,166',
    red: '239,68,68',
    orange: '249,115,22'
};

export const THEME_PREVIEWS: Partial<Record<Theme, string>> = {
    'nature': getAssetUrl('/themes/Sports Car Desert Donut Wallpaper.png'),
    'city': getAssetUrl('/themes/Morning Brightness.png'), // Fallback as City isn't in themes folder yet
    'wooden-flowers': getAssetUrl('/themes/Wooden Flowers.png'),
    'leaf-at-night': getAssetUrl('/themes/Leaf at Night.png'),
    'ocean': getAssetUrl('/themes/Elephants in Mist.png'), // Fallback for Ocean
    'space': getAssetUrl('/themes/colorful donuts.png'), // Fallback for Space
    'burger': getAssetUrl('/themes/exploded_wagyu_burger.png'), // Assuming this exists or will fail gracefully
    'serene-forest': getAssetUrl('/themes/Elephants in Mist.png'),
    'mountain-mist': getAssetUrl('/themes/Morning Brightness.png'),
    'golden-canyon': getAssetUrl('/themes/Sports Car Desert Donut Wallpaper.png'),
    'kittle-chickens': '/assets/Nature_Wall.jpg',
    'colorful-donuts': '/assets/Tram_Wall.jpg',
    'elephants-mist': '/assets/Boat_wall.jpg',
    'morning-brightness': getAssetUrl('/themes/Morning Brightness.png')
};

export const PRESERVED_TOKYO_CITY_URL = 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=2560&auto=format&fit=crop';

export const CHARACTER_PHRASES: { [key: string]: string } = {
    'Archer ChuckleBop': 'It looks like a joke... until it works.',
    'Mayor Pompelmoose': 'I demand order! And perhaps a larger statue of myself.',
    'Sheriff Stoutwood': 'No running in the square! I\'m watching you!',
    'Baker Jackson': 'A pie a day keeps the rebellion away... or does it?',
    'Nella Nudgepot': 'You were speaking. I was saving it.',
    'Mastermind Whiskerton': 'Checkmate is just patience... properly applied. Sugar?',
};

export const BADGES: Badge[] = [
    // --- STORY CHRONICLES ---
    { id: 101, level: 1, name: 'First Sight', icon: '👀', category: 'Story', requirement: 'Enter the Record Vault for the first time.', description: "The records have opened for your eyes only." },
    { id: 102, level: 2, name: 'Act 1 Finisher', icon: '🗺️', category: 'Story', requirement: 'Complete Act 1.', description: "You've survived the first leg of the journey!" },
    { id: 103, level: 3, name: 'Lore Keeper', icon: '📜', category: 'Story', requirement: 'Read 50 pages.', description: "Your knowledge of Candybrook is truly legendary." },
    { id: 104, level: 4, name: 'Page Turner', icon: '📖', category: 'Story', requirement: 'Bookmark 5 scenes.', description: "A true fan remembers the best moments." },
    { id: 105, level: 5, name: 'Story Master', icon: '🗝️', category: 'Story', requirement: 'Unlock all adventures.', description: "The entire chronicle is now yours to command." },
    { id: 106, level: 1, name: "Story Teller", icon: "📚", category: "Story", requirement: "Tell your first tale.", description: "Words have power in ToffeeTown." },

    // --- GAMES ---
    { id: 201, level: 1, name: 'Quick Blink', icon: '⚡', category: 'Games', requirement: 'Lvl 1 Clear', description: "A flash of memory in the grid!" },
    { id: 202, level: 3, name: 'Mind Palace', icon: '🏰', category: 'Games', requirement: 'Lvl 3 Clear', description: "Your focus is becoming a fortress." },
    { id: 203, level: 5, name: 'The Oracle', icon: '🔮', category: 'Games', requirement: 'Lvl 5 Clear', description: "You see the cards before they flip." },
    { id: 204, level: 2, name: "Mojo Master", icon: "⚡", category: "Games", requirement: "Master the mojo flow.", description: "Energy management is key." },
    { id: 205, level: 3, name: "Chess Grandmaster", icon: "♟️", category: "Games", requirement: "Win a 3D Chess match.", description: "Checkmate in the vertical dimension." },
    { id: 206, level: 1, name: "Puzzle Solver", icon: "🧩", category: "Games", requirement: "Solve 5 puzzles.", description: "Piece by piece, the truth emerges." },
    { id: 207, level: 2, name: "Memory Expert", icon: "🧠", category: "Games", requirement: "Perfect memory clear.", description: "Nothing escapes your notice." },
    { id: 208, level: 1, name: "Path Finder", icon: "🛣️", category: "Games", requirement: "Clear the first path.", description: "The road ahead is clear." },
    { id: 209, level: 4, name: "Arcade Champion", icon: "🕹️", category: "Games", requirement: "Place on the leaderboard.", description: "The champion of the Arena." },

    // --- GENERAL / COLORED ---
    { id: 601, level: 1, name: 'Medal Collector', icon: '🥇', category: 'General', requirement: 'Earn 10 Badges', description: "Your trophy case is starting to shine brightly." },
    { id: 602, level: 2, name: 'Arcade Addict', icon: '🕹️', category: 'General', requirement: 'Earn 1 Badge in every Game', description: "You've mastered every corner of the arena." },
    { id: 603, level: 3, name: 'Rebel Scholar', icon: '🎓', category: 'General', requirement: 'Earn 3 Story Badges & 3 Game Badges', description: "Balance between mind and action achieved." },
    { id: 604, level: 4, name: 'Badge Hunter', icon: '🎯', category: 'General', requirement: 'Earn 20 Badges', description: "A relentless pursuit of absolute honor." },
    { id: 605, level: 5, name: 'Absolute Legend', icon: '✨', category: 'General', requirement: 'Earn all Badges', description: "The god of Candybrook storytelling and gaming." },

    // --- COINS / ECONOMY ---
    { id: 301, level: 1, name: 'Coin Collector', icon: '💰', category: 'Coins', requirement: 'Collect 100 coins', description: "The jingling sound of success." },
    { id: 302, level: 2, name: 'Treasure Hunter', icon: '💎', category: 'Coins', requirement: 'Find a hidden treasure', description: "Sparkles in the dark." },
    { id: 303, level: 3, name: 'Wealthy Hero', icon: '🏦', category: 'Coins', requirement: 'Reach 1000 coins', description: "ToffeeTown's most affluent adventurer." },
    { id: 304, level: 4, name: 'Adventure Investor', icon: '📈', category: 'Coins', requirement: 'Unlock 3 premium acts', description: "Investing in future tales." },
    { id: 305, level: 2, name: 'Friend of the Shop', icon: '🤝', category: 'Coins', requirement: 'Make a purchase in every shop', description: "Boosting the local economy." },
];

export const FUN_FACTS = [
    "Archer ChuckleBop uses bubble arrows to spread joy, not hurt!",
    "Mayor Pompelmoose once commissioned a statue of himself made entirely of cheese.",
    "Mastermind Whiskerton has over 100 secret plans for taking over the town bakery.",
    "Baker Jackson's secret ingredient is actually a tiny pinch of stardust.",
    "The Sheriff's hat is so heavy because he stores confiscated toys inside it.",
    "Candybrook was founded on a giant, ancient digestive biscuit.",
    "Nella Nudgepot can overhear a whisper from three streets away.",
    "Lanternella Glowfern's lantern never runs out of light as long as someone is laughing nearby."
];

export const FONT_OPTIONS: { title: string[]; body: string[]; brand: string[] } = {
    title: ['Josefin Sans', 'Lora', 'Bangers', 'Nunito'],
    body: ['Josefin Sans', 'Nunito', 'Lora', 'Kalam'],
    brand: ['Luckiest Guy', 'Inter', 'Roboto', 'Outfit'] // Consolidated brand fonts
};

// --- 7-STAT SYSTEM: Mischief, Righteousness, Influence, Chaos, Style, Secrets, Sweet Tooth ---
// Using 0-100 scale for finer granularity in graphs
export interface Town {
    name: string;
    emoji: string;
    slogan: string;
    description: string;
    activity: string;
}

export interface CharacterProfile {
    id: string;
    name: string;
    role: string;
    clan: 'Bosses' | 'Rebels' | 'Heroes' | 'Neutral';
    image: string;
    description: string;
    stats: {
        mischief: number;
        righteousness: number;
        influence: number;
        chaos: number;
        style: number;
        secrets: number;
        sweetTooth: number;
    };
    infoLines?: Array<{ label: string; value: string; colorClass?: string }>;
    loreSections?: Array<{ title: string; content: string; image?: string }>;
    dna?: {
        publicRole: string;
        coreIntention: string;
        signatureAction: string;
        narrativeFunction: string;
        pressurePoint: string;
    };
}

export const ALL_CHARACTERS: CharacterProfile[] = [
    ...BOSSES_GUILD,
    ...REBELS_GUILD,
];

export const GAMES_LIST = [
    { id: 'town', title: 'Toffee Town Struggle', category: 'City Builder', status: 'Live', cover: getAssetUrl('/assets/game_town.jpg'), players: '12k' },
    { id: 'debate', title: 'Toffee Town - Card Battler', category: 'Debate', status: 'Beta', cover: getAssetUrl('/assets/game_debate.jpg'), players: '4k' },
    { id: 'mojo', title: 'Toffee Town - Intel', category: 'Focus', status: 'Live', cover: getAssetUrl('/assets/game_mojo.jpg'), players: '6k' },
    { id: 'memory', title: 'Toffee Town - Chronicles', category: 'Puzzle', status: 'Live', cover: getAssetUrl('/assets/game_memory.jpg'), players: '8k' },
    { id: 'tycoon', title: 'Toffee Town - Tycoon', category: 'Simulation', status: 'Live', cover: getAssetUrl('/assets/game_tycoon.jpg'), players: '15k' },
];
