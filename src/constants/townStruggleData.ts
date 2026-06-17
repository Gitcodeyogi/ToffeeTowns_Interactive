export interface StruggleTool {
    id: string;
    name: string;
    icon: string;
    stars: number;
    description: string;
}

export interface StruggleStageDef {
    id: string;
    name: string;
    problem: string;
    requiredTool: string;
    advisorHelpful: string;
    advisorConfused: string;
}

export interface TownStruggleConfig {
    tools: StruggleTool[];
    stages: StruggleStageDef[];
    twist: {
        text: string;
        msg: string;
        optionA: string;
        optionB: string;
        penalty: number;
    };
}

export const TOWN_STRUGGLE_CONFIGS: Record<string, TownStruggleConfig> = {
    'lvl1_toffee': {
        tools: [
            { id: 'clock_oil', name: 'Clock Oil', icon: '💧', stars: 10, description: 'Dissolves syrup friction, cools grinding axles.' },
            { id: 'heavy_wrench', name: 'Heavy Wrench', icon: '🔧', stars: 15, description: 'Tightens anchor bolts on massive mainsprings.' },
            { id: 'brass_screw', name: 'Brass Screw', icon: '🔩', stars: 5, description: 'Secures copper bypass pipes and small plates.' },
            { id: 'rebel_tape', name: 'Rebel Tape', icon: '🎗️', stars: 5, description: 'Braces cracking rafters and patches steam vents.' },
            { id: 'steam_valve', name: 'Steam Valve', icon: '🎛️', stars: 20, description: 'Balances high-pressure syrup steam build-up.' },
            { id: 'sonic_duster', name: 'Sonic Duster', icon: '🧹', stars: 5, description: 'Clears thick sugar webs and gear debris.' }
        ],
        stages: [
            {
                id: 'toffee_s1',
                name: 'Stage 01: Secure the Perimeter',
                problem: 'Arrive at the central mechanism core in Toffee Town. The perimeter is unstable and steam is leaking. We must secure the perimeter before we can resolve the main issue.',
                requiredTool: 'rebel_tape',
                advisorHelpful: 'Hey, Mr. Gold! See here.. this is the important point: the perimeter is unstable! We need to brace the surrounding steam pipes with our Rebel Tape to ensure safety!',
                advisorConfused: 'Hey, Mr. Gold! Look here.. you need to act quickly... but wait, even I am totally confused! Maybe we should wrap everything in Rebel Tape to make it look nicer?!'
            },
            {
                id: 'toffee_s2',
                name: 'Stage 02: Stabilize Core Bracket',
                problem: 'The locals are shouting conflicting stories. The core component is vibrating violently and needs immediate stabilization.',
                requiredTool: 'brass_screw',
                advisorHelpful: 'Hey, Mr. Gold! Look here.. you need to act quickly! The core is vibrating! Fasten the main bracket with a Brass Screw to stabilize the expansion!',
                advisorConfused: 'Hey, Mr. Gold! Oh dear, the locals are shouting so loudly that even I am completely confused! Maybe we should throw Clock Oil into the crowd to quiet them down?!'
            },
            {
                id: 'toffee_s3',
                name: 'Stage 03: Clear the Main Axle',
                problem: 'You are face-to-face with the source of the problem! The main mechanism is jammed solid with crystallized toffee. Clear the friction obstacle!',
                requiredTool: 'clock_oil',
                advisorHelpful: 'Hey, Mr. Gold! See here.. this is the important point: the main axle is jammed! Lube the central spindle with Clock Oil so we can slide the friction plate free!',
                advisorConfused: 'Hey, Mr. Gold! Look here.. even I am confused! The axle is glowing red. Should we smash it with our Heavy Wrench? If it\'s broken, the stress technically vanishes!'
            }
        ],
        twist: {
            text: "CRYSTALLIZED SYRUP EXPLOSION!",
            msg: "A high-pressure pocket of dry toffee burst behind a small gear! We need immediate structural bracing!",
            optionA: "Pay 8 ⭐ to Anchor Safety Harness",
            optionB: "Ignore Warning & Continue Deployment",
            penalty: -15
        }
    },
    'lvl1_peppermint': {
        tools: [
            { id: 'cocoa_thermos', name: 'Cocoa Thermos', icon: '☕', stars: 10, description: 'Pours boiling cocoa to rapidly melt frozen surface layers.' },
            { id: 'ice_pick', name: 'Ice Pick', icon: '⛏️', stars: 15, description: 'Chips away stubborn, crystalized mint frost.' },
            { id: 'salt_shaker', name: 'Salt Shaker', icon: '🧂', stars: 5, description: 'Spreads coarse peppermint salt to prevent refreezing.' },
            { id: 'friction_wax', name: 'Friction Wax', icon: '🕯️', stars: 15, description: 'Polishes the slide surface after melting to restore speed.' },
            { id: 'warm_blanket', name: 'Warm Blanket', icon: '🛏️', stars: 5, description: 'Wraps the shivering penguins while you work.' },
            { id: 'hairdryer', name: 'Hairdryer', icon: '💨', stars: 20, description: 'Blasts localized warm air into frozen crevices.' }
        ],
        stages: [
            {
                id: 'pep_s1',
                name: 'Stage 01: Warm the Penguins',
                problem: 'Arrive at the top of Peppermint Peak. The penguins are shivering violently and blocking access to the slide\'s entry point.',
                requiredTool: 'warm_blanket',
                advisorHelpful: 'Hey, Mr. Gold! See here.. the penguins are freezing and panicking! Toss them a Warm Blanket to calm them down so we can access the slide!',
                advisorConfused: 'Hey, Mr. Gold! Look here.. I am so confused! The penguins are shivering! Should we throw Peppermint Salt at them to melt the snow off their feathers?!'
            },
            {
                id: 'pep_s2',
                name: 'Stage 02: Chip the Apex Block',
                problem: 'The very top of the slide is blocked by a massive, solid chunk of crystallized mint frost. It\'s too thick to melt quickly.',
                requiredTool: 'ice_pick',
                advisorHelpful: 'Hey, Mr. Gold! Look here.. you need to act quickly! That chunk of frost is holding the entire blockage together. Hit the structural fault line with the Ice Pick!',
                advisorConfused: 'Hey, Mr. Gold! Oh dear, the wind is howling! Maybe we should polish the icy blockage with Friction Wax? That will make it look shiny while we freeze!'
            },
            {
                id: 'pep_s3',
                name: 'Stage 03: Liquidate the Chute',
                problem: 'The main chute is covered in a thick layer of slippery surface ice. We need to melt a large area rapidly to restore the slide!',
                requiredTool: 'cocoa_thermos',
                advisorHelpful: 'Hey, Mr. Gold! See here.. this is the important point: the entire chute is frozen solid! Pour the boiling Cocoa Thermos down the slope to melt the surface instantly!',
                advisorConfused: 'Hey, Mr. Gold! Look here.. even I am confused! Should we blast the entire mountain with a tiny Hairdryer?! It might take three weeks!'
            }
        ],
        twist: {
            text: "SUDDEN BLIZZARD SQUALL!",
            msg: "A violent gust of freezing mint wind threatens to blow you off the slippery slide!",
            optionA: "Pay 8 ⭐ to Deploy Ice Cleats",
            optionB: "Ignore Warning & Brace Yourself",
            penalty: -15
        }
    },
    'lvl1_sprinkle': {
        tools: [
            { id: 'piping_bag', name: 'Piping Bag', icon: '🍦', stars: 10, description: 'Injects fresh, sticky frosting-mortar into structural cracks.' },
            { id: 'sprinkle_shovel', name: 'Sprinkle Shovel', icon: '🪣', stars: 15, description: 'Clears away massive dunes of collapsed rainbow sprinkles.' },
            { id: 'cracker_shingle', name: 'Cracker Shingle', icon: '🧇', stars: 5, description: 'Provides rigid support scaffolding for collapsing towers.' },
            { id: 'sugar_trowel', name: 'Sugar Trowel', icon: '🥄', stars: 10, description: 'Smooths and packs the frosting mortar tight.' },
            { id: 'sticky_syrup', name: 'Sticky Syrup', icon: '🍯', stars: 20, description: 'Fast-acting adhesive for emergency structural patches.' },
            { id: 'beach_pail', name: 'Beach Pail', icon: '🏖️', stars: 5, description: 'Transports heavy loads of wet, moldable sugar sand.' }
        ],
        stages: [
            {
                id: 'sprinkle_s1',
                name: 'Stage 01: Excavate the Dunes',
                problem: 'Arrive at the Sprinkle Sands beach. Massive dunes of collapsed rainbow sprinkles are blocking access to the castle\'s foundation.',
                requiredTool: 'sprinkle_shovel',
                advisorHelpful: 'Hey, Mr. Gold! See here.. the foundation is buried! We need to move these massive mounds of sprinkles fast. Grab the Sprinkle Shovel and start digging!',
                advisorConfused: 'Hey, Mr. Gold! Look here.. I am so confused! So many sprinkles! Should we use the Piping Bag to eat them all?!'
            },
            {
                id: 'sprinkle_s2',
                name: 'Stage 02: Brace the Towers',
                problem: 'The towering spires of the sandcastle are swaying in the coastal wind. The dried mortar is crumbling rapidly!',
                requiredTool: 'cracker_shingle',
                advisorHelpful: 'Hey, Mr. Gold! Look here.. you need to act quickly! The spires are about to collapse! We need to wedge rigid Cracker Shingles against the walls to brace them!',
                advisorConfused: 'Hey, Mr. Gold! Oh dear, the wind is howling! Maybe we should transport more sand in the Beach Pail? More weight might hold it down... or crush it entirely!'
            },
            {
                id: 'sprinkle_s3',
                name: 'Stage 03: Re-Mortar the Fault Lines',
                problem: 'You have stabilized the structure, but the main fault lines are completely dry. The castle needs fresh, sticky binding agent immediately!',
                requiredTool: 'piping_bag',
                advisorHelpful: 'Hey, Mr. Gold! See here.. this is the important point: the mortar is gone! Inject fresh, sticky frosting deep into the cracks using the Piping Bag!',
                advisorConfused: 'Hey, Mr. Gold! Look here.. even I am confused! Should we pour Sticky Syrup everywhere? It might glue us to the beach permanently!'
            }
        ],
        twist: {
            text: "ROGUE SEAGULL ATTACK!",
            msg: "A massive, sugar-crazed seagull swoops down trying to eat your structural crackers!",
            optionA: "Pay 8 ⭐ to Deploy Net Shield",
            optionB: "Ignore Warning & Shush the Bird",
            penalty: -15
        }
    }
};
