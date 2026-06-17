import { getAssetUrl } from '../utils/getAssetUrl';

export interface Ability {
    name: string;
    description: string;
    effectType: string;
    cooldown: number; // in turns
}

export interface GameCharacter {
    id: string;
    name: string;
    role: string;
    motto: string;
    emoji: string;
    color: string;
    imageCard: string; // Path to character card image
    ability: Ability;
}

export interface Town {
    id: string;
    name: string;
    emoji: string;
    slogan: string;
    hazard: string;
    hazardDesc: string;
    boyPartner?: string;
    girlPartner?: string;
    countyName?: string;
    image?: string;
}

export interface County {
    id: string;
    name: string;
    emoji: string;
    color: string;
    terrain: string;
    terrainRule: string;
    towns: Town[];
}

export interface TownEvent {
    id: string;
    name: string;
    emoji: string;
    effect: string;
    description: string;
}

export const MAKERS: GameCharacter[] = [
    {
        id: 'chucklebop',
        name: 'Chucklebop',
        role: 'The Legendary Prankster & Archer',
        motto: 'I aim for fun, not the point!',
        emoji: '🏹',
        color: 'from-amber-400 to-amber-600',
        imageCard: getAssetUrl('/Assets/Games/Town Chase/Chuckle_Bop.png'),
        ability: {
            name: 'Distraction Arrow',
            description: 'Fires a sticky caramel arrow that blocks detector tiles in a 1-tile radius for 2 turns.',
            effectType: 'block_detector',
            cooldown: 3
        }
    },
    {
        id: 'hugo_glass',
        name: 'Hugo Glass',
        role: 'The Boy Who Can\'t Help But Chase Adventures',
        motto: 'Curious is my middle name!',
        emoji: '🔭',
        color: 'from-orange-400 to-orange-600',
        imageCard: getAssetUrl('/Characters/Char Cards/Hugo_Glass.png'),
        ability: {
            name: 'False Trail',
            description: 'Lays a fake trail, forcing the nearest detector to move in the opposite direction next turn.',
            effectType: 'divert_detector',
            cooldown: 3
        }
    },
    {
        id: 'bruno_blink',
        name: 'Bruno Blink',
        role: 'The Accidental Inventor',
        motto: 'It worked perfectly... until everyone started screaming.',
        emoji: '⚙️',
        color: 'from-rose-400 to-rose-600',
        imageCard: getAssetUrl('/Assets/Games/Town Chase/Bruno_Blink.png'),
        ability: {
            name: 'Accidental Gadget',
            description: 'Drops a glitching mechanism on a tile, blocking all movement through it for 2 turns.',
            effectType: 'create_obstacle',
            cooldown: 3
        }
    },
    {
        id: 'asher_glow',
        name: 'Asher Glow',
        role: 'The Loveable Prankster with a Golden Heart',
        motto: 'Laughter unlocks everything!',
        emoji: '📯',
        color: 'from-yellow-400 to-yellow-600',
        imageCard: getAssetUrl('/Assets/Games/Town Chase/Asher_Glow.png'),
        ability: {
            name: 'Charmed Townsfolk',
            description: 'Summons a friendly merchant NPC to block a detector\'s direct path for 1 turn.',
            effectType: 'npc_block',
            cooldown: 3
        }
    },
    {
        id: 'tobby_cliff',
        name: 'Tobby Cliff',
        role: 'The Trailblazer',
        motto: 'Maps are suggestions.',
        emoji: '🎒',
        color: 'from-red-400 to-red-600',
        imageCard: getAssetUrl('/Characters/Char Cards/Tobby_Cliff.png'),
        ability: {
            name: 'Blaze Shortcut',
            description: 'Unlocks a secret woodland route allowing the Maker team to jump 2 tiles next turn.',
            effectType: 'blaze_shortcut',
            cooldown: 3
        }
    },
    {
        id: 'kai_storm',
        name: 'Kai Storm',
        role: 'Clever. Mischievous. Impossible to Catch.',
        motto: 'Life\'s too short to be boring.',
        emoji: '🌬️',
        color: 'from-teal-400 to-teal-600',
        imageCard: getAssetUrl('/Characters/Char Cards/Kai_Storm.png'),
        ability: {
            name: 'Vanish',
            description: 'Throws a pocket smoke pellet, rendering all active Makers completely invisible to detectors for 1 turn.',
            effectType: 'vanish_makers',
            cooldown: 3
        }
    },
    {
        id: 'milo_spark',
        name: 'Milo Spark',
        role: 'The Brilliant Planner with a Bright Heart',
        motto: 'Plan it well, do it right.',
        emoji: '📝',
        color: 'from-amber-500 to-yellow-500',
        imageCard: getAssetUrl('/Characters/Char Cards/Milo_Spark.png'),
        ability: {
            name: 'Plan Ahead',
            description: 'Uses tactical map coordinates to preview the Detector team\'s planned paths for this round.',
            effectType: 'preview_moves',
            cooldown: 3
        }
    }
];

export const DETECTORS: GameCharacter[] = [
    {
        id: 'nella_nudgepot',
        name: 'Nella Nudgepot',
        role: 'Notice everything. Miss nothing.',
        motto: 'You were speaking. I was saving it.',
        emoji: '📓',
        color: 'from-indigo-400 to-indigo-600',
        imageCard: getAssetUrl('/Characters/Char Cards/Nella_pot.png'),
        ability: {
            name: 'Reveal Trails',
            description: 'Reveals all active and false trails within a 2-tile radius of Nella.',
            effectType: 'reveal_trails',
            cooldown: 3
        }
    },
    {
        id: 'aria_bloom',
        name: 'Aria Bloom',
        role: 'Brave heart. Bright mind.',
        motto: 'Adventure calls, and I must answer!',
        emoji: '🌺',
        color: 'from-pink-400 to-pink-600',
        imageCard: getAssetUrl('/Characters/Char Cards/Aria_Bloom.png'),
        ability: {
            name: 'Brave Dash',
            description: 'Triggers a massive burst of energy, allowing Aria to move up to 3 tiles in a single turn.',
            effectType: 'triple_move',
            cooldown: 3
        }
    },
    {
        id: 'willow_frost',
        name: 'Willow Frost',
        role: 'Calm mind. Clever soul.',
        motto: 'Clear thoughts freeze chaotic actions.',
        emoji: '❄️',
        color: 'from-cyan-400 to-cyan-600',
        imageCard: getAssetUrl('/Characters/Char Cards/Willow_Frost.png'),
        ability: {
            name: 'Glacial Freeze',
            description: 'Blasts an icy wind that freezes one targeted Mischief Maker in place for 1 full turn.',
            effectType: 'freeze_maker',
            cooldown: 3
        }
    },
    {
        id: 'pippa_bolt',
        name: 'Pippa Bolt',
        role: 'Fixing things. Fueling dreams.',
        motto: 'No puzzle is too broken to fix.',
        emoji: '🔧',
        color: 'from-teal-500 to-teal-700',
        imageCard: getAssetUrl('/Characters/Char Cards/Pippa_Bolt.png'),
        ability: {
            name: 'Fix Route',
            description: 'Quickly dismantles any obstacles placed by Bruno Blink or triggers next to Pippa.',
            effectType: 'remove_obstacle',
            cooldown: 3
        }
    },
    {
        id: 'zara_quill',
        name: 'Zara Quill',
        role: 'Every mystery deserves a story.',
        motto: 'Let\'s read between the sweet lines.',
        emoji: '🖋️',
        color: 'from-purple-400 to-purple-600',
        imageCard: getAssetUrl('/Characters/Char Cards/Zara_Quill.png'),
        ability: {
            name: 'Read Backstory',
            description: 'Consults her chronicle to highlight the exact last 3 moves made by the Mischief team.',
            effectType: 'reveal_history',
            cooldown: 3
        }
    },
    {
        id: 'bella_daisy',
        name: 'Bella Daisy',
        role: 'A good day gets even better when shared.',
        motto: 'Sniff out the adventure!',
        emoji: '🐶',
        color: 'from-emerald-400 to-emerald-600',
        imageCard: getAssetUrl('/Assets/Games/Town Chase/Bella_Daisy.png'),
        ability: {
            name: 'Call Doggo',
            description: 'Unleashes her tracking dog to sniff out and reveal invisible makers (like Kai Storm).',
            effectType: 'reveal_invisible',
            cooldown: 3
        }
    },
    {
        id: 'olive_pine',
        name: 'Olive Pine',
        role: 'Find the light even in the snow.',
        motto: 'Always look for the glowing path.',
        emoji: '🌲',
        color: 'from-green-500 to-green-700',
        imageCard: getAssetUrl('/Characters/Char Cards/Olive_Pine.png'),
        ability: {
            name: 'Lantern Light',
            description: 'Illuminates the active county map, completely clearing any darkness and hazard penalties for 2 turns.',
            effectType: 'clear_hazards',
            cooldown: 3
        }
    }
];

export const COUNTIES: County[] = [
    {
        id: 'chocolate_brook',
        name: 'ChocoBrook County',
        emoji: '🍯',
        color: '#fbbf24',
        terrain: 'A peaceful, sugary valley filled with secrets.',
        terrainRule: 'Frees characters from standard limits, promoting tactical stealth maneuvers.',
        towns: [
            { id: 'toffee_town', name: 'Toffee Town', countyName: 'Toffee Capital', emoji: '🍬', slogan: 'Capital of caramel sweetness.', hazard: 'Traffic Congestion', hazardDesc: 'Dense pedestrian crossings block routes', boyPartner: 'chucklebop', girlPartner: 'nella_nudgepot', image: '/wallpapers/CandyTaxi.png' },
            { id: 'nougat_node', name: 'Nougat Node', countyName: 'Nutwood County', emoji: '🍭', slogan: 'Chewy hub of roasted commerce.', hazard: 'Crowded Market', hazardDesc: 'Market stalls limit line of sight', boyPartner: 'hugo_glass', girlPartner: 'aria_bloom', image: '/wallpapers/AutumnForest.png' },
            { id: 'banoffee_valley', name: 'Banoffee Valley', countyName: 'Creamwood County', emoji: '🍌', slogan: 'Creamy hills of banana farms.', hazard: 'Tall Grass', hazardDesc: 'Slows detector sweeps', boyPartner: 'bruno_blink', girlPartner: 'willow_frost', image: '/wallpapers/LakeView.png' },
            { id: 'peppermint_peak', name: 'Peppermint Peak', countyName: 'Creamwood County', emoji: '🏔️', slogan: 'Minty heights of pure ice.', hazard: 'Slippery Slopes', hazardDesc: 'Slide forward on movement', boyPartner: 'milo_spark', girlPartner: 'olive_pine', image: '/wallpapers/Cherry blossoms.png' },
            { id: 'ganache_grove', name: 'Ganache Grove', countyName: 'Cocoawood County', emoji: '🌳', slogan: 'Forest of silky chocolate secrets.', hazard: 'Silky Fog', hazardDesc: 'Reduces vision range to 1 tile', boyPartner: 'asher_glow', girlPartner: 'pippa_bolt', image: '/wallpapers/MagicalGarden.png' },
            { id: 'caramel_cove', name: 'Caramel Cove', countyName: 'Honeywood County', emoji: '🏖️', slogan: 'Surfing on sticky golden waves.', hazard: 'Caramel Tide', hazardDesc: 'Grid rows shift every 2 turns', boyPartner: 'tobby_cliff', girlPartner: 'zara_quill', image: '/wallpapers/SereneSunset.png' },
            { id: 'sprinkle_sands', name: 'Sprinkle Sands', countyName: 'Honeywood County', emoji: '🎨', slogan: 'Rainbow shores of sweetness.', hazard: 'Sugar Sludge', hazardDesc: 'Slippery sands trigger sliding', boyPartner: 'kai_storm', girlPartner: 'bella_daisy', image: '/wallpapers/DewyRainbow.png' }
        ]
    }
];

export const TOWN_EVENTS: TownEvent[] = [
    { id: 'caramel_spill', name: 'Caramel Spill', emoji: '🍯', effect: 'sticky_tiles', description: '3 random tiles become sticky for 2 turns! Players entering them pause.' },
    { id: 'cocoa_rain', name: 'Cocoa Rain', emoji: '🌧️', effect: 'darkness', description: 'Silky cocoa storm darkens the county! Vision drops to 1-tile radius.' },
    { id: 'bellas_dog', name: 'Bella\'s Dog Loose', emoji: '🐕', effect: 'dog_patrol', description: 'Bella\'s golden retriever wanders randomly, blocking and sniffing out Makers.' },
    { id: 'curfew_bell', name: 'Toffee Town Bell', emoji: '🎺', effect: 'curfew_freeze', description: 'Imperial bell rings! All active players freeze in place for 1 turn.' },
    { id: 'bakers_delivery', name: 'Baker\'s Delivery', emoji: '🧁', effect: 'npc_baker', description: 'A slow baker carrying a cream cart crosses the map, blocking a random row.' },
    { id: 'golden_praline', name: 'Golden Praline Found', emoji: '⭐', effect: 'bonus_move', description: 'A sparkling praline was discovered! Makers get one free additional move.' },
    { id: 'gadget_backfire', name: 'Bruno\'s Backfire', emoji: '🔧', effect: 'self_trap', description: 'Bruno Blink\'s experimental gears backfire, trapping one Maker for 1 turn.' },
    { id: 'story_leak', name: 'Zara\'s Story Leak', emoji: '📖', effect: 'reveal_next', description: 'Zara\'s draft chronicles are leaked! Detectors preview the Makers\' target paths.' },
    { id: 'peppermint_wind', name: 'Peppermint Wind', emoji: '🌬️', effect: 'slide_wind', description: 'A chilling blizzard sweeps the board, sliding all characters 1 tile east.' },
    { id: 'town_festival', name: 'Town Festival', emoji: '🎉', effect: 'festival_crowd', description: 'Glitzy town street festival spawns a crowd! Maximum coverage for the Makers.' }
];

export const DIFFICULTY_TIERS = [
    { tier: 1, name: 'Sweet Stroll', desc: 'Relaxed patrol routes, zero unexpected events.', eventsPerMatch: 0 },
    { tier: 2, name: 'Cobblestone Chase', desc: 'Standard challenge, 3 events per match trigger.', eventsPerMatch: 3 },
    { tier: 3, name: 'Grand Heist', desc: 'High stakes, regular events and fast AI response.', eventsPerMatch: 5 },
    { tier: 4, name: 'Legendary Run', desc: 'Pre-set environmental twist + constant chaos events.', eventsPerMatch: 8 }
];
