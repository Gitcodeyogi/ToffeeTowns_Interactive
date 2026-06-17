import { getAssetUrl } from '../utils/getAssetUrl';
export * from './town_dna';

export interface Town {
    id: string;
    name: string;
    slogan: string;
    miniCaption: string;
    activity: string;
    description: string;
    emoji: string;
    image: string;
    logo?: string;
    nearbyTowns: string[];
}

const TOWN_IMAGE_OVERRIDES: Record<string, string> = {
    'toffee-town': '/towns/Toffee-town.png',
    'sprinkle-sands': '/towns/sprinkle-sands-v2.png',
    'hazelnut-terrace': '/towns/hazelnut-terrace.png',
    'honeycomb-heights': '/towns/honeycomb-heights.png',
    'cocoa-canyon': '/towns/Cocoa-canyon.png',
    'lava-cake-lake': '/towns/Lava-cake-lake.png',
    'butterscotch-bay': '/towns/butterscotch-bay.png',
    'caramel-cove': '/towns/Caramel-Cove.png',
    'nougat-node': '/towns/Nougat-Node.png',
    'praline-port': '/towns/Praline-Port.png',
    'ganache-grove': '/towns/Ganache-Grove.png',
};

const TOWN_IMAGE_VERSIONS: Record<string, string> = {
    'hazelnut-terrace': '2026-02-23-r3',
    'honeycomb-heights': '2026-02-23-r3',
    'peanut-butter-falls': '2026-02-24-r1',
    'butterscotch-bay': '2026-02-23-r3',
    'eclair-square': '2026-02-23-r1',
    'creme-tunnels': '2026-02-24-r1',
    'brownie-crossroads': '2026-02-24-r1'
};

const townImage = (id: string) => {
    const base = getAssetUrl(TOWN_IMAGE_OVERRIDES[id] || `/towns/${id}.png`);
    const version = TOWN_IMAGE_VERSIONS[id];
    return version ? `${base}?v=${encodeURIComponent(version)}` : base;
};

export const TOWN_DNA_ACTIVITY: Record<string, string> = {
    'toffee-town': 'The Great Toffee Pull',
    'eclair-square': 'Pastry paths filled with joy',
    'hazelnut-terrace': 'Layers of nutty elegance',
    'peanut-butter-falls': 'Rapids of nutty adventure',
    'banoffee-valley': 'The valley of banana-toffee sweetness',
    'sprinkle-sands': 'Rainbow shores of playful sweetness',
    'butterscotch-bay': 'Golden waves of caramel delight',
    'praline-port': 'The docks of nutty delights',
    'caramel-cove': 'Surfing on sticky golden waves',
    'nougat-node': 'The chewy hub of roasted nuts',
    'cocoa-canyon': 'Mines of the richest cocoa veins',
    'honeycomb-heights': 'Towers of golden sweetness',
    'brownie-crossroads': 'Where all paths crumble meet',
    'ganache-grove': 'Forest of silky chocolate secrets',
    'peppermint-peak': 'Where frost meets mint delight',
    'lava-cake-lake': 'Molten heart of dessert bliss',
    'creme-tunnels': 'Glow of creamy caves',
};

export const TOWN_NARRATIVE_PATTERN_BY_ID: Record<string, 1 | 2 | 3 | 4> = {
    'toffee-town': 1,
    'eclair-square': 2,
    'hazelnut-terrace': 3,
    'peanut-butter-falls': 4,
    'sprinkle-sands': 2,
    'butterscotch-bay': 3,
    'praline-port': 4,
    'caramel-cove': 1,
    'nougat-node': 2,
    'cocoa-canyon': 3,
    'honeycomb-heights': 4,
    'brownie-crossroads': 1,
    'ganache-grove': 2,
    'peppermint-peak': 3,
    'lava-cake-lake': 4,
    'creme-tunnels': 1,
};

export const CHOCOBROOK_ZONES = [
    {
        zoneNumber: 1,
        zoneName: 'Nutwood County',
        zoneDescription: 'Wholesome orchards of nutty delight',
        townIds: ['hazelnut-terrace', 'peanut-butter-falls', 'nougat-node', 'praline-port']
    },
    {
        zoneNumber: 2,
        zoneName: 'Creamwood County',
        zoneDescription: 'Cool peaks and creamy dreams',
        townIds: ['peppermint-peak', 'banoffee-valley', 'creme-tunnels', 'eclair-square']
    },
    {
        zoneNumber: 3,
        zoneName: 'Cocoawood County',
        zoneDescription: 'Rich lands of molten chocolate',
        townIds: ['ganache-grove', 'cocoa-canyon', 'lava-cake-lake', 'butterscotch-bay']
    },
    {
        zoneNumber: 4,
        zoneName: 'Honeywood County',
        zoneDescription: 'Golden shores of sweetness',
        townIds: ['honeycomb-heights', 'caramel-cove', 'sprinkle-sands', 'brownie-crossroads']
    }
] as const;

export const CANDYBROOK_ZONES = CHOCOBROOK_ZONES;


export const ZONE_TOWN_ORDER = CHOCOBROOK_ZONES.flatMap((z) => z.townIds);

export const CHOCOBROOK_ZONE_PROFILES = CHOCOBROOK_ZONES.map((z) => ({
    id: z.zoneNumber,
    name: z.zoneName,
    summary: `The core ${z.zoneName} region of CHOCOBROOK.`
}));

export const TOWN_ZONE_BY_ID: Record<string, { zoneNumber: number; zoneName: string }> = CHOCOBROOK_ZONES.reduce((acc, zone) => {
    zone.townIds.forEach((townId) => {
        acc[townId] = { zoneNumber: zone.zoneNumber, zoneName: zone.zoneName };
    });
    return acc;
}, {} as Record<string, { zoneNumber: number; zoneName: string }>);

export const getTownZoneMeta = (townId: string) => {
    const zone = CHOCOBROOK_ZONES.find((entry) => (entry.townIds as readonly string[]).includes(townId));
    if (!zone) return null;

    return {
        zoneNumber: zone.zoneNumber,
        zoneName: zone.zoneName,
        zoneDescription: zone.zoneDescription,
        townIds: [...zone.townIds],
        teaser: undefined as string | undefined,
    };
};

export const CANDYBROOK_TOWNS: Town[] = [
    {
        id: 'toffee-town',
        name: 'Toffee Town',
        slogan: 'Sticky, sweet, and always elite.',
        miniCaption: 'The Capital City',
        activity: 'The Great Toffee Pull',
        description: 'The majestic heart of the province and its Grand Harbour hub. Here, caramel-paved streets shimmer under the golden skyway, serving as the ultimate destination for every train, ship, and balloon. It\'s where the province\'s raw sweetness is pulled into perfection.',
        emoji: '\u{1F36C}',
        image: townImage('toffee-town'),
        nearbyTowns: ['Eclair Square', 'Hazelnut Terrace']
    },
    {
        id: 'eclair-square',
        name: 'Eclair Square',
        slogan: 'Pastry paths filled with joy.',
        miniCaption: 'The Glaze Plaza',
        activity: 'Pastry paths filled with joy',
        description: 'A bustling highland plaza in Creamwood County, far above the sea. Master bakers in these high mists engage in friendly pastry duels, sending their glazed creations across the province via balloon couriers and the famous Pastry Line rail.',
        emoji: '\u{1F956}',
        image: townImage('eclair-square'),
        nearbyTowns: ['Toffee Town', 'Peppermint Peak']
    },
    {
        id: 'peppermint-peak',
        name: 'Peppermint Peak',
        slogan: 'Where frost meets mint delight.',
        miniCaption: 'The Mint Source',
        activity: 'Where frost meets mint delight',
        description: 'The cooling engine of the Creamwood highlands, where the sea is just a rumor. Established by herbalists who discovered that mountain frost sharpens mint into pure delight, it sends its icy shards down the Sled Rail to refresh the province.',
        emoji: '\u{1F3D4}\u{FE0F}',
        image: townImage('peppermint-peak'),
        nearbyTowns: ['Eclair Square', 'Creme Tunnels']
    },
    {
        id: 'creme-tunnels',
        name: 'Creme Tunnels',
        slogan: 'Glow of creamy caves.',
        miniCaption: 'The Cream Veins',
        activity: 'Glow of creamy caves',
        description: 'Luminous cream-veins carved deep into the Creamwood mountains. Lit by the gentle glow of sentient bugs, these tunnels harvest the province\'s purest subterranean dairy, moved swiftly by the Glow-Bug Metro to the master kitchens above.',
        emoji: '\u{1F9F1}',
        image: townImage('creme-tunnels'),
        nearbyTowns: ['Peppermint Peak', 'Banoffee Valley']
    },
    {
        id: 'banoffee-valley',
        name: 'Banoffee Valley',
        slogan: 'The valley of banana-toffee sweetness.',
        miniCaption: 'The Toffee Basin',
        activity: 'The valley of banana-toffee sweetness',
        description: 'A lush tapestry of orchards nestled in the Creamwood highlands. Born from a legendary storm, its dawn-ripened bananas and caramel pastes are whisked away by Valley Rail and cargo balloons to create the province\'s most beloved pies.',
        emoji: '\u{1F34C}',
        image: townImage('banoffee-valley'),
        nearbyTowns: ['Creme Tunnels', 'Ganache Grove']
    },
    {
        id: 'ganache-grove',
        name: 'Ganache Grove',
        slogan: 'Forest of silky chocolate secrets.',
        miniCaption: 'The Glaze Forest',
        activity: 'Forest of silky chocolate secrets',
        description: 'A mystical Cocoawood forest of ancient cacao trees. Farmers here hum soft melodies to ensure every bean reaches a mirror-finish gloss, producing the silky ganache that flows through the Moonlight Mono to the capital\'s elite workshops.',
        emoji: '\u{1F333}',
        image: townImage('ganache-grove'),
        nearbyTowns: ['Banoffee Valley', 'Cocoa Canyon']
    },
    {
        id: 'cocoa-canyon',
        name: 'Cocoa Canyon',
        slogan: 'Mines of the richest cocoa veins.',
        miniCaption: 'The Cocoa Vein',
        activity: 'Mines of the richest cocoa veins',
        description: 'A rugged marvel in Cocoawood County, where raw cocoa essence flows through deep-vein mines. Miners listen to the canyon\'s pulse to find the richest mocha deposits, hauling them up by cliff gondolas to feed the province\'s chocolate heart.',
        emoji: '\u{1F36B}',
        image: townImage('cocoa-canyon'),
        nearbyTowns: ['Ganache Grove', 'Lava Cake Lake']
    },
    {
        id: 'lava-cake-lake',
        name: 'Lava Cake Lake',
        slogan: 'Molten heart of dessert bliss.',
        miniCaption: 'The Molten Basin',
        activity: 'Molten heart of dessert bliss',
        description: 'The geothermal heart of Cocoawood County. Here, molten chocolate batter bubbles to the surface in warm, glowing springs, powering the province with sweet energy while providing the most relaxing hot-spring retreats in the world.',
        emoji: '\u{1F30B}',
        image: townImage('lava-cake-lake'),
        nearbyTowns: ['Cocoa Canyon', 'Brownie Crossroads']
    },
    {
        id: 'brownie-crossroads',
        name: 'Brownie Crossroads',
        slogan: 'Where all paths crumble meet.',
        miniCaption: 'The Traveler Junction',
        activity: 'Where all paths crumble meet',
        description: 'The busy, welcoming junction of Honeywood County where all paths meet. Every bakery here shares a piece of history, serving travelers at the province\'s busiest 4-way rail junction where the scent of warm brownies never fades.',
        emoji: '\u{1F6E4}\u{FE0F}',
        image: townImage('brownie-crossroads'),
        nearbyTowns: ['Lava Cake Lake', 'Hazelnut Terrace']
    },
    {
        id: 'hazelnut-terrace',
        name: 'Hazelnut Terrace',
        slogan: 'Layers of nutty elegance.',
        miniCaption: 'The Nut Bowl',
        activity: 'Layers of nutty elegance',
        description: 'The rolling green lifeblood of Nutwood County. These ancient terraces produce the premium hazelnuts that fuel the global market, sending crates down the Nut Elevator to the Nougat Node to reach every sweet-tooth across the four counties.',
        emoji: '\u{1F330}',
        image: townImage('hazelnut-terrace'),
        logo: '/towns/Nutwood County/Hazelnut_terrace_Logo.png',
        nearbyTowns: ['Brownie Crossroads', 'Peanut Butter Falls']
    },
    {
        id: 'peanut-butter-falls',
        name: 'Peanut Butter Falls',
        slogan: 'Rapids of nutty adventure.',
        miniCaption: 'The Peanut Rapids',
        activity: 'Rapids of nutty adventure',
        description: 'A modernizing marvel in Nutwood County, powered by the force of creamy rapids. Independent river crews race rafts down the peanut streams, delivering fresh-milled nut-pastes to the market towns with incredible speed and spirit.',
        emoji: '\u{1F95C}',
        image: townImage('peanut-butter-falls'),
        logo: '/towns/Nutwood County/peanut_Butter_Mills_Logo.png',
        nearbyTowns: ['Hazelnut Terrace', 'Honeycomb Heights']
    },
    {
        id: 'honeycomb-heights',
        name: 'Honeycomb Heights',
        slogan: 'Towers of golden sweetness.',
        miniCaption: 'The Amber Cliffs',
        activity: 'Towers of golden sweetness',
        description: 'Towers of golden sweetness clinging to the Honeywood cliffs. Giant honey-moths and audible bee harmonies define this vertical city, where amber honey blocks are lowered by gondola to sweeten the entire province.',
        emoji: '\u{1F36F}',
        image: townImage('honeycomb-heights'),
        nearbyTowns: ['Peanut Butter Falls', 'Nougat Node']
    },
    {
        id: 'nougat-node',
        name: 'Nougat Node',
        slogan: 'The chewy hub of roasted nuts.',
        miniCaption: 'The Crossroads Hub',
        activity: 'The chewy hub of roasted nuts',
        description: 'The hyper-organized logistical heart of Nutwood County. This massive intersection of chewy treats manages the synchronized ballet of hundreds of trains, ensuring that trade deals and transit cargo flow perfectly across the crossroads.',
        emoji: '\u{1F9ED}',
        image: townImage('nougat-node'),
        logo: '/towns/Nutwood County/Nougat_Node_Logo.png',
        nearbyTowns: ['Honeycomb Heights', 'Sprinkle Sands']
    },
    {
        id: 'praline-port',
        name: 'Praline Port',
        slogan: 'The docks of nutty delights.',
        miniCaption: 'The Nut Harbor',
        activity: 'The docks of nutty delights',
        description: 'The wealthy sea gate of Nutwood County, sheltered by jagged nut-crags. As a major export hub, its harbour promenade is alive with the sound of quay-bells and trade ships carrying the province\'s nutty treasures to distant lands.',
        emoji: '\u{2693}',
        image: townImage('praline-port'),
        logo: '/towns/Nutwood County/praline_Port_Logo.png',
        nearbyTowns: ['Nougat Node', 'Sprinkle Sands']
    },
    {
        id: 'sprinkle-sands',
        name: 'Sprinkle Sands',
        slogan: 'Rainbow shores of playful sweetness.',
        miniCaption: 'The Color Coast',
        activity: 'Rainbow shores of playful sweetness',
        description: 'The vibrant sea gate of Honeywood County, where tides wash up brilliant sugar crystals. From its international docks, coastal trams whisk rainbow sprinkles and neon sugar-glass to every festival across the continent.',
        emoji: '\u{2728}',
        image: townImage('sprinkle-sands'),
        nearbyTowns: ['Nougat Node', 'Butterscotch Bay']
    },
    {
        id: 'butterscotch-bay',
        name: 'Butterscotch Bay',
        slogan: 'Golden waves of caramel delight.',
        miniCaption: 'The Golden Harbor',
        activity: 'Golden waves of caramel delight',
        description: 'The golden sea port of Cocoawood County, shimmering under a six-hour sunset. Ships docked in its warm, caramel-scented waters carry butterscotch chips and sea-salt syrups to the capital and beyond, guided by the golden tide.',
        emoji: '\u{1F307}',
        image: townImage('butterscotch-bay'),
        nearbyTowns: ['Sprinkle Sands', 'Caramel Cove']
    },
    {
        id: 'caramel-cove',
        name: 'Caramel Cove',
        slogan: 'Surfing on sticky golden waves.',
        miniCaption: 'The Syrup Shore',
        activity: 'Surfing on sticky golden waves',
        description: 'A playful Honeywood shore where the syrup waves bring good fortune. Surfers double as delivery riders here, catching tide-filtered caramel syrup and sea-salt wax to share with the neighboring bay and the capital\'s busy candy shops.',
        emoji: '\u{1F30A}',
        image: townImage('caramel-cove'),
        nearbyTowns: ['Butterscotch Bay', 'Toffee Town']
    },
];

export const CHOCOBROOK_TOWNS = CANDYBROOK_TOWNS;


export const getRandomTown = (): Town => {
    return CHOCOBROOK_TOWNS[Math.floor(Math.random() * CHOCOBROOK_TOWNS.length)];
};

export const validateTownActivityDNA = (towns: Town[]): string[] => {
    return towns.flatMap((town) => {
        const expected = TOWN_DNA_ACTIVITY[town.id];
        if (!expected) return [`Missing DNA activity mapping for town: ${town.id}`];
        if (town.activity !== expected) {
            return [`Activity mismatch for ${town.id}: expected "${expected}" but found "${town.activity}"`];
        }
        return [];
    });
};
