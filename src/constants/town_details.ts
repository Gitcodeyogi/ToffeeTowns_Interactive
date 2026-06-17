import { TOWN_CONFLICTS } from './townConflicts';

export interface TownSpotlightFact {
    tree: string;
    joyBits: string[];
    gossip: string[];
    eclairSquareNote?: string;
    hazelnutTerraceNote?: string;
    peanutButterFallsNote?: string;
}

export const TOWN_SPOTLIGHT_FACTS: Record<string, TownSpotlightFact> = {
    'toffee-town': {
        tree: 'Giant Chocolate Tree',
        joyBits: [
            'A wide smile is the best currency.',
            'A sticky handshake is a sign of true trust.'
        ],
        gossip: [
            "I heard the morning caramel-fountain was spraying clockwise today... Carrow Meltwright says it's a sign of a very lucky week!",
            "Did you see the canal-ducks? They're wearing tiny paper hats! Secret moon-lit cocoa-tasting tonight?",
            "The Bosses are trying to tax the 'Morning Toffee-Tug' again... workers made the meters giggle instead!"
        ]
    },
    'peppermint-peak': {
        tree: 'White-Chocolate Spruce',
        joyBits: [
            'Warm hearts melt the deepest ice.',
            'Cool heads and minty breaths lead to clear paths.'
        ],
        gossip: [
            "The Mint Vault guards wear five layers of coats, but they still shiver because the mint is too fresh.",
            "Peppermint-sledders are breaking the speed limit. The snow patrol is giving them spicy-gum tickets.",
            "The shivering stars aren’t cold. They are just vibrating because they had too much hot cocoa."
        ]
    },
    'eclair-square': {
        tree: 'Puff-Pastry Willow',
        joyBits: [
            'When the glaze-bell rings, the heart sings.',
            'A puff without a polish is like a song without a soul.'
        ],
        gossip: [
            "The cream puffs staged a 'Great Escape'! Used licorice ropes but got distracted by a sprinkle-football match.",
            "Oma Vee's secret ingredient is actually a whispered 'Please' to the dough.",
            "The Glaze-Art Plaza fountain was used to frost a giant cake, and now the pigeons are sticky."
        ]
    },
    'creme-tunnels': {
        tree: 'Velvety Cream Vine',
        joyBits: [
            'Light is just visible love.',
            'The smoothest paths are paved with patience and cream.'
        ],
        gossip: [
            "The Glow-Bugs in the gallery aren’t insects. They are just little flying marshmallows with lightbulbs.",
            "The dream-dust conveyors are giving everyone weird dreams about giant flying spatulas.",
            "The Everlasting-Eclair chambers are not everlasting. Bob ate part of one yesterday."
        ]
    },
    'banoffee-valley': {
        tree: 'Caramelized Banana Palm',
        joyBits: [
            'A bruised banana is a bruised heart.',
            'Let the mist ripen your soul and the caramel sweeten your path.'
        ],
        gossip: [
            "The valley-mist was so thick today I accidentally took a bite out of my neighbor's balloon thinking it was a pie.",
            "Beni Banana found a banana that looks exactly like the Mayor. It's now the town mascot.",
            "The caramel plantations are seeing record-breaking stickiness this quarter."
        ]
    },
    'ganache-grove': {
        tree: 'Glossy Emerald-Cacao',
        joyBits: [
            'True shine comes from a happy soul.',
            'Starlight is the best seasoning for midnight snacks.'
        ],
        gossip: [
            "The Sheen Scientist’s mirrors are so shiny, they reflect your thoughts. Mine showed a giant donut.",
            "The leaf-lounges are actually just giant, edible kale leaves dipped in chocolate.",
            "The disco-ball cocoa flowers only dance if you sing them an embarrassing song from your childhood."
        ]
    },
    'cocoa-canyon': {
        tree: 'Deep-Vein Mocha Birch',
        joyBits: [
            'Deep heart, loud joy.',
            'An echo of kindness travels the furthest.'
        ],
        gossip: [
            "The drumming pits are so loud because the drums are made of hollowed-out chocolate truffles.",
            "The cargo-pulleys are powered by very muscular, very tiny gummy worms.",
            "If you shout a secret into the canyon, the echoes summarize it and shout it back louder."
        ]
    },
    'lava-cake-lake': {
        tree: 'Molten Sponge Ash',
        joyBits: [
            'Pure warmth is a shared gift.',
            'A bubbling joke is better than a steaming decree.'
        ],
        gossip: [
            "The Core Thermalist accidentally dropped his lunch in the vent, and it came back perfectly flambéed!",
            "The bouncy lava-cake islands are actually just sleeping chocolate turtles. Step softly!",
            "The geothermal hula-hoop contest ended in disaster. Everyone just ate their hoops."
        ]
    },
    'brownie-crossroads': {
        tree: 'Rich Cocoa Redwood',
        joyBits: [
            'Every path is a potential friendship.',
            'A warm brownie is a hug with a crust.'
        ],
        gossip: [
            "The Hearth Steward’s giant fireplace is powered entirely by spicy peppermint wrappers.",
            "The Hover-Snack wagons fly because they are simply too delicious to touch the ground.",
            "The Junction Scout on the lookout tower isn’t watching the stars. He’s looking for flying cookies."
        ]
    },
    'hazelnut-terrace': {
        tree: 'Golden Praline Oak',
        joyBits: [
            'Every nut has a heart, and every heart has a nut to crack.',
            'High-altitude roasting leads to high-altitude dreaming.'
        ],
        gossip: [
            "The nut-crackers union is demanding more cocoa breaks. Roasting heat is brutal!",
            "Brann's personal roaster is calibrated to the exact temperature of a summer sunrise.",
            "Sage Hama’s perpetual bonfire isn’t wood—it’s just aggressively spicy cinnamon sticks."
        ]
    },
    'peanut-butter-falls': {
        tree: 'Crunchy Legume Pine',
        joyBits: [
            'Kindness is the stickiest bond in the province.',
            'A heavy heart sinks, but a crunchy laugh floats.'
        ],
        gossip: [
            "If you drop your keys in the river churner, they emerge perfectly roasted.",
            "A tourist brought jelly to the falls yesterday... it caused an international incident.",
            "The marshmallow-foam at the river edge is definitely self-aware. I saw it wave!"
        ]
    },
    'honeycomb-heights': {
     tree: 'Amber Hex-Poplar',
     joyBits: [
         'Golden hearts reach the highest.',
         'Sweet synergy is the best kind of gravity.'
     ],
     gossip: [
         "The Nectar Sculptor dropped his chisel, and it took three days to reach the bottom.",
         "The giant amber-lift stuck midway, and everyone had to eat their way out. Best commute ever.",
         "The sleeping honey-moths snore to the tune of classical symphonies."
     ]
    },
    'nougat-node': {
        tree: 'Chewy White-Wood',
        joyBits: [
            'A quick pun is the best shortcut.',
            'Chew on the good times, and the hard times will melt away.'
        ],
        gossip: [
            "The Entry Logist’s desk isn’t vanilla-scented. She secretly hides an entire cake under her paperwork.",
            "A Caramel Caravan stalled today because the driver ate the steering wheel. Again.",
            "Under the Vanilla-Cloud lanterns, you can hear the trade secrets... mostly about who stole the last biscuit."
        ]
    },
    'sprinkle-sands': {
        tree: 'Rainbow Sugar Palm',
        joyBits: [
            'Colors are just moods you can eat.',
            'Joy is tax-free on the rainbow shore.'
        ],
        gossip: [
            "Prism Grader admitted he’s colorblind. He just guesses the sprinkle colors and hopes for the best!",
            "I tried surfing the bouncing dunes and ended up with rainbow sand in my teeth for a week.",
            "The sunset aurora is just the reflection of the giant gummy bears in the sky."
        ]
    },
    'butterscotch-bay': {
        tree: 'Syrup-Drip Mangrove',
        joyBits: [
            'The glow is in the sharing.',
            'Let your tide be high and your syrup be sweet.'
        ],
        gossip: [
            "The Pier Fisherman caught a marzipan-whale. Instead of throwing it back, they had tea together!",
            "Surf couriers are deliberately dropping packages just to 'accidentally' fall into the caramel tide.",
            "The Caramel-Dolphins are organizing a strike. They want more sprinkles in their daily diet."
        ]
    },
    'praline-port': {
        tree: 'Salted Praline Palm',
        joyBits: [
            'The tide brings sweetness to those who wait.',
            'A smooth sail is better than a fast one.'
        ],
        gossip: [
            "The Cargo-Cranes are secretly being updated to sing sea shanties while they lift.",
            "Captain Nut-Cracker found a message in a bottle, but it was just a laundry list for the Mayor.",
            "The Nut-Crags are actually made of petrified hazelnut-praline, but they're too hard to eat."
        ]
    },
    'caramel-cove': {
        tree: 'Syrup-Salt Willow',
        joyBits: [
            'Ride the wave of kindness.',
            'Life is a golden slide; enjoy the slip and the stick!'
        ],
        gossip: [
            "The Tide-Salt Merchant sneezed and accidentally cured an entire ham. It was delicious.",
            "Hydro-surf riders complain the water is too sticky, yet they refuse to surf anywhere else.",
            "The Giggle-Eddies whirlpools are just ticklish spots in the cove. Try throwing a feather in!"
        ]
    }
};

export const TOWN_GOSSIPS: Record<string, string[]> = Object.keys(TOWN_SPOTLIGHT_FACTS).reduce((acc, id) => {
    acc[id] = TOWN_SPOTLIGHT_FACTS[id].gossip;
    return acc;
}, {} as Record<string, string[]>);

export { TOWN_CONFLICTS };
