import { getAssetUrl } from '../utils/getAssetUrl';

export interface ImportedCharacter {
    id: string;
    name: string;
    clan: 'Bosses' | 'Rebels' | 'Neutral';
    role: string;
    image: string;
    model?: string;
    description?: string;
    stats?: {
        courage: number;
        strength: number;
        agility: number;
    };
}

const RAW_IMPORTED_CHARACTERS: ImportedCharacter[] = [
    {
        id: 'mayor_pompelmoose',
        name: 'Mayor Pompelmoose',
        clan: 'Bosses',
        role: 'Leader',
        image: '/characters/boss_Mayor_Pompelmoose.png',
        description: "The grandiose and slightly pompous leader of the Bosses. He believes order is maintained through strict regulations and lengthy speeches. Despite his bluster, he genuinely cares for the town's prosperity, albeit in his own controlling way.",
        stats: { courage: 65, strength: 50, agility: 40 }
    },
    {
        id: 'baker_bramble',
        name: 'Bramble Mortimer',
        clan: 'Bosses',
        role: 'Baker',
        image: '/characters/boss_Baker-Bramble_Mortimer.png',
        description: 'A stern baker whose crusts are as hard as his resolve. He supplies the Boss clan with sustenance and believes that a well-fed army is an efficient one. Rumor has it his sourdough starter is older than the town itself.',
        stats: { courage: 70, strength: 85, agility: 55 }
    },
    {
        id: 'blacksmith_crumblewise',
        name: 'Crumblewise',
        clan: 'Bosses',
        role: 'Blacksmith',
        image: '/characters/boss_Blacksmith-Crumblewise.png',
        description: "A legendary smith capable of forging metal with mere whispers. He crafts the heavy armor used by the Bosses' enforcers. His workshop is a fortress of heat and noise, where he shapes the very backbone of the regime.",
        stats: { courage: 80, strength: 95, agility: 45 }
    },
    {
        id: 'flower_petalworth',
        name: 'Mrs. Petalworth',
        clan: 'Rebels',
        role: 'Flower Vendor',
        image: '/characters/boss_FlowerVendor-Mrs._petalworth.png',
        description: "Don't let the sweet smell of roses fool you. Her flower shop is the Rebels' quiet coordination point, where citizen messages, supplies, and witness routes are organized under the cover of daily trade.",
        stats: { courage: 55, strength: 40, agility: 85 }
    },
    {
        id: 'marshal_frill',
        name: 'Marshal Frill',
        clan: 'Bosses',
        role: 'Law Enforcer',
        image: '/characters/boss_Marshal_-_Frill.png',
        description: "One half of the town's law enforcement duo. Frill is the 'bad cop' who enjoys writing tickets a little too much. His uniform is always impeccable, and his patience is non-existent.",
        stats: { courage: 75, strength: 80, agility: 70 }
    },
    {
        id: 'marshal_qrill',
        name: 'Marshal Qrill',
        clan: 'Bosses',
        role: 'Law Enforcer',
        image: '/characters/boss_Marshal_-_Qrill.png',
        description: 'The strategic mind behind the law enforcement. Qrill prefers traps and tactics over brute force. He considers every jaywalker a personal affront to the geometry of the streets.',
        stats: { courage: 70, strength: 75, agility: 80 }
    },
    {
        id: 'milklady_flutterby',
        name: 'Lady Flutterby',
        clan: 'Bosses',
        role: 'Milk Vendor',
        image: '/characters/boss_Milklady_Flutterby.png',
        description: 'Elegant and poised, she controls the dairy supply with an iron fist in a velvet glove. She claims her milk gives the Bosses their superior bone density and fortitude.',
        stats: { courage: 60, strength: 55, agility: 75 }
    },
    {
        id: 'prof_finley',
        name: 'Professor Finley',
        clan: 'Bosses',
        role: 'Scholar',
        image: '/characters/boss_Professor-Finley.png',
        description: "The intellectual architect of the Bosses' ideology. He writes the history books and ensures they favor the current regime. His knowledge is vast, but his morals are flexible.",
        stats: { courage: 50, strength: 45, agility: 60 }
    },
    {
        id: 'sheriff_stautwood',
        name: 'Sheriff Bumblewood',
        clan: 'Bosses',
        role: 'Sheriff',
        image: '/characters/boss_Sheriff-stautwood.png',
        description: 'A bumbling sheriff who makes hilarious, well-meaning mistakes and constantly drops his clipboard. Despite his chaos, he somehow manages to solve cases by pure accident.',
        stats: { courage: 90, strength: 85, agility: 65 }
    },
    {
        id: 'tax_goldwhistle',
        name: 'Sir Goldwhistle',
        clan: 'Bosses',
        role: 'Tax Collector',
        image: '/characters/boss_Tax_Collector_-_Sir_Goldwhistle.png',
        description: 'The most feared man in town, not for his strength, but for his audit logs. Sir Goldwhistle can find a penny in a haystack and will tax you for finding it.',
        stats: { courage: 65, strength: 30, agility: 90 }
    },
    {
        id: 'madam_grimshade',
        name: 'Madam Grimshade',
        clan: 'Bosses',
        role: 'Headmistress',
        image: '/characters/Boss_Madam_Grimshade.png',
        description: 'A cold disciplinarian who weaponizes rules, records, and fear. Grimshade rewrites standards overnight and punishes anyone who cannot keep up.',
        stats: { courage: 72, strength: 52, agility: 68 }
    },
    {
        id: 'dr_stefon_fossoway',
        name: 'Dr. Stefon Fossoway',
        clan: 'Bosses',
        role: 'Chief Medical Advisor',
        image: '/characters/Boss_Dr. Stefon_Fossoway.png',
        description: "The illusion of intelligence in action. He makes everything feel 'scientific and official' for the Mayor, even if his 14-page sneeze classification system doesn't actually cure the sneeze.",
        stats: { courage: 60, strength: 40, agility: 50 }
    },
    {
        id: 'boss_dottie',
        name: 'Dottie Ticktockwell',
        clan: 'Bosses',
        role: 'Chief Curfew Warden',
        image: '/characters/Boss_Dottie_Ticktockwell.png',
        description: "The human embodiment of bedtime. She guards the town's peace with her Bell of Absolute Authority. 'Rest is not optional.'",
        stats: { courage: 75, strength: 55, agility: 65 }
    },
    {
        id: 'bounce_mcdrizzle',
        name: 'Bounce McDrizzle',
        clan: 'Rebels',
        role: 'Agitator',
        image: '/characters/Rebel_Barrelton_Bounce_McDrizzle.png',
        description: "A chaotic ball of energy who loves to disrupt public events. Bounce believes that a little rain - or mayhem - is necessary for growth. He's always the first to start a chant.",
        stats: { courage: 85, strength: 60, agility: 95 }
    },
    {
        id: 'fisher_whimsley',
        name: 'Fisherman Whimsley',
        clan: 'Rebels',
        role: 'Gatherer',
        image: '/characters/rebel_Fisherman-Whimsley.png',
        description: 'A patient soul who gathers secrets from the river. Whimsley knows the tides of change are coming and prepares the Rebels with supplies and wisdom from the waters.',
        stats: { courage: 75, strength: 70, agility: 65 }
    },
    {
        id: 'mastermind_whiskerton',
        name: 'Whiskerton',
        clan: 'Rebels',
        role: 'Mastermind',
        image: '/characters/rebel_Mastermind-Whiskerton.png',
        description: 'The brilliant strategist of the rebellion. Whiskerton plans operations with chess-like precision. He operates from the shadows, ensuring the Rebels are always two steps ahead.',
        stats: { courage: 80, strength: 55, agility: 90 }
    },
    {
        id: 'night_glowfern',
        name: 'Lanternella Glowfern',
        clan: 'Rebels',
        role: 'Night Watcher',
        image: '/characters/Rebel_Lanternella Glowfen.png',
        description: 'She guides lost souls and rebel operatives through the darkest nights. Her lantern is said to burn with the fire of hope itself, signaling safety to those fighting for freedom.',
        stats: { courage: 90, strength: 50, agility: 85 }
    },
    {
        id: 'rebel_chucklebop',
        name: 'Archer ChuckleBop',
        clan: 'Rebels',
        role: 'Field Executor',
        image: '/characters/Rebel_Archer_ChuckleBop.png',
        description: "The heart and movement of the Rebels. A prankster who turns every 'Oops' into a victory. 'If it made you laugh... it probably fixed something.'",
        stats: { courage: 95, strength: 75, agility: 99 }
    },
    {
        id: 'spy_quickstep',
        name: 'Tibbin Quickstep',
        clan: 'Rebels',
        role: 'Spy',
        image: '/characters/rebel_Spy_-_Tibbin_Quickstep.png',
        description: 'Faster than a rumor and twice as hard to catch. Tibbin delivers urgent messages across enemy lines. He treats every mission like a high-stakes race.',
        stats: { courage: 85, strength: 60, agility: 98 }
    },
    {
        id: 'captain_honeyflare',
        name: 'Captain Honeyflare',
        clan: 'Rebels',
        role: 'Sky Rider',
        image: '/characters/rebel_Night_Watcher-Lanternella_Glowfern.png',
        description: 'A fearless aerial scout who rides sugar-gliders above canyon winds and stormfronts. She maps hidden routes between settlements and signals safe passage during crackdowns.',
        stats: { courage: 92, strength: 58, agility: 94 }
    },
    {
        id: 'myra_thornwhip',
        name: 'Myra Thornwhip',
        clan: 'Rebels',
        role: 'Beast Whisperer',
        image: '/characters/rebel_Spy_-_Nella_Nudgepot.png',
        description: 'A wilderness expert who can calm wild creatures and redirect danger away from civilians. She leads rescue runs through forests, cliffs, and unstable border paths.',
        stats: { courage: 88, strength: 72, agility: 84 }
    },
    {
        id: 'orrin_geargrit',
        name: 'Orrin Geargrit',
        clan: 'Rebels',
        role: 'Clockwork Tactician',
        image: '/characters/rebel_Mastermind-Whiskerton.png',
        description: 'A precision planner who builds mechanical decoys, timed diversions, and non-lethal defense rigs. Orrin turns impossible missions into synchronized rebel operations.',
        stats: { courage: 82, strength: 68, agility: 78 }
    },
    {
        id: 'pipibolt',
        name: 'PipiBolt',
        clan: 'Neutral',
        role: 'Electric Trickster',
        image: '/characters/rebel_Barrelton_Bounce_McDrizzle.png',
        description: 'A being of pure static energy and mischief. PipiBolt zips through the power lines, causing blackouts and jump-starting excitement wherever he goes.',
        stats: { courage: 88, strength: 80, agility: 99 }
    },
    {
        id: 'asher_glow',
        name: 'Asher Glow',
        clan: 'Neutral',
        role: 'Light Weaver',
        image: '/characters/rebel_Fisherman-Whimsley.png',
        description: 'A guardian of the ancient lights. Asher can manipulate photons to create dazzling displays or blinding shields. He seeks to restore balance to the spectrum.',
        stats: { courage: 85, strength: 70, agility: 85 }
    },
    {
        id: 'rurik_3d_v2',
        name: 'Rurik Ironfell (V2)',
        clan: 'Neutral',
        role: 'Double Agent of X',
        image: '/characters/Boss_2025-12-09_161850.jpg',
        model: '/characters/3D Character_M.glb',
        description: 'An embedded operative of X who appears on both sides without public allegiance. Rurik records critical moves, feeds selective truths, and reports directly to X when the balance of Candybrook is at risk.',
        stats: { courage: 95, strength: 98, agility: 70 }
    },
    {
        id: 'pipkin_nutterby',
        name: 'Pipkin Nutterby',
        clan: 'Neutral',
        role: 'Official Ganache Grove Prankster',
        image: '/characters/pipkin_nutterby.png',
        description: 'A 12-year-old resident troublemaker and professional idea-haver with a heart of gold. With messy dark brown forest hair, a signature front tuft, and a permanently curious face sporting an oversized grin, Pipkin is the official prankster of Ganache Grove. Armed with a moss-green cap, cream shirt, suspenders, striped socks, a wooden slingshot, and a mysterious satchel of unknown items, he brings a whirlwind of joy, laughter, and high-agility chaos wherever he goes, proving to be an accidental hero when the town needs him most.',
        stats: { courage: 95, strength: 40, agility: 98 }
    }
];

export const IMPORTED_CHARACTERS: ImportedCharacter[] = RAW_IMPORTED_CHARACTERS.map((character) => ({
    ...character,
    image: getAssetUrl(character.image),
    model: character.model ? getAssetUrl(character.model) : undefined
}));
