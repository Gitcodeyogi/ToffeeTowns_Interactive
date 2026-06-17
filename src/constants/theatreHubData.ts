// theatreHubData.ts
import { CHOCOBROOK_TOWNS } from './towns';
import { TOWN_SPOTLIGHT_FACTS, TOWN_CONFLICTS } from './town_details';
import { TOWN_ECONOMY_NOTES } from './economy';
import { TOWN_LEGENDS } from './townLegends';
import { CHOCOBROOK_TRANSPORT_ATLAS } from './transport';
import { TOWN_TRANSPORT_LORE } from './transport_lore';
import { TOWN_LEGEND_LORE } from './legend_lore';

export type LensId = 'legend' | 'gossip' | 'politics' | 'economy' | 'transport';

export type LensConfig = {
    id: LensId;
    title: string;
    kicker: string;
    accent: string;
    border: string;
    glow: string;
    teaser: string;
};

export const COUNTY_NARRATIVE: Record<number, string> = {
    1: 'The Central Heartlands are a sanctuary where the air is thick with the scent of roasted harvest. Every leaf tells a story of the province\'s enduring stability and the warmth of its people who have lived here for generations.',
    2: 'A territory of crystalline serenity, where mountains are carved from sugar stone and valleys are filled with clouds of vanilla-scented fog, where time seems to slow to a peaceful, creamy dream.',
    3: 'Pulsing with the primal heartbeat of the land, ancient rivers flow through emerald forests where trees are heavy with the finest bounty and the earth itself feels alive with the spirit of pure indulgence.',
    4: 'Paradise along the coast, where the tides wash up grains of caramel sand and the cliffs are built from giant natural honeycombs that hum with the harmony of nature\'s most refined and silken secrets.'
};

export const COUNTY_FRIENDLY_NARRATIVE: Record<number, string> = {
    1: 'Step into the warm, roasted heart of the province where history is baked into every corner with a smile. This is the birthplace of the Nutwood tradition—perfect for those who love a story of enduring heritage, bowtied beans, and cozy, hazelnut-scented secrets.',
    2: 'A refreshing escape into the high-altitude peaks where the air is scented with cool mint and vanilla mist pulled from the clouds. This region is a sanctuary for dreamers looking for crystalline serenity and creamy, cinematic wonders that melt in the soul.',
    3: 'Deep, rich, and mysterious—this territory is where the finest cocoa veins run beneath emerald shadows that dance at night. An indulgence for the senses, where ancient mocha-rivers whisper the secrets of the land\'s primal and powerful chocolate magic.',
    4: 'Prepare for golden infinity along the caramel shores, where the tides wash up sparkle crystals under a honey-moth moon. With honeycombs as tall as towers and a horizon of sweet possibility, this is the coastal gateway where every tide brings a new legendary tale.'
};

export const ENTRANCE_LENSES = [
    { label: 'LEGEND FILES', tone: 'border-amber-300 text-amber-100 shadow-[0_0_16px_rgba(251,191,36,0.45)]' },
    { label: 'GOSSIP FILES', tone: 'border-cyan-300 text-cyan-100 shadow-[0_0_16px_rgba(103,232,249,0.45)]' },
    { label: 'POLITICS FILES', tone: 'border-emerald-300 text-emerald-100 shadow-[0_0_16px_rgba(110,231,183,0.45)]' },
    { label: 'ECONOMY FILES', tone: 'border-fuchsia-300 text-fuchsia-100 shadow-[0_0_16px_rgba(232,121,249,0.45)]' },
    { label: 'TRANSPORT FILES', tone: 'border-rose-300 text-rose-100 shadow-[0_0_16px_rgba(251,113,133,0.45)]' }
] as const;

export const ENTRANCE_PATH = [
    { label: 'CHOOSE YOUR COUNTY', tone: 'border-amber-300 text-amber-100 shadow-[0_0_16px_rgba(251,191,36,0.45)]' },
    { label: 'PICK YOUR TOWN', tone: 'border-cyan-300 text-cyan-100 shadow-[0_0_16px_rgba(103,232,249,0.45)]' },
    { label: 'DISCOVER A STORY', tone: 'border-emerald-300 text-emerald-100 shadow-[0_0_16px_rgba(110,231,183,0.45)]' },
    { label: 'ENJOY THE SHOW', tone: 'border-fuchsia-300 text-fuchsia-100 shadow-[0_0_16px_rgba(232,121,249,0.45)]' },
    { label: 'LAND IN YOUR SEAT', tone: 'border-rose-300 text-rose-100 shadow-[0_0_16px_rgba(251,113,133,0.45)]' }
] as const;

export const SCREEN_TYPES = [
    { label: '70 MM', tone: 'border-amber-300 text-amber-100 shadow-[0_0_16px_rgba(251,191,36,0.45)]' },
    { label: 'CINEMATIC', tone: 'border-cyan-300 text-cyan-100 shadow-[0_0_16px_rgba(103,232,249,0.45)]' },
    { label: 'THREE D', tone: 'border-emerald-300 text-emerald-100 shadow-[0_0_16px_rgba(110,231,183,0.45)]' },
    { label: 'VIRTUAL R', tone: 'border-fuchsia-300 text-fuchsia-100 shadow-[0_0_16px_rgba(232,121,249,0.45)]' },
    { label: 'IMAX', tone: 'border-rose-300 text-rose-100 shadow-[0_0_16px_rgba(251,113,133,0.45)]' }
] as const;

export const getTownTransportEntry = (townName: string) =>
    CHOCOBROOK_TRANSPORT_ATLAS.flatMap((zone) => zone.towns).find((entry) => entry.town.toLowerCase() === townName.toLowerCase());

export const truncateAt = (str: string, maxLen = 72) => str && str.length > maxLen ? str.slice(0, maxLen).trimEnd() + '...' : str;

export const TOWN_LENS_KICKERS: Record<string, Record<LensId, string>> = {
    'toffee-town': {
        legend: 'Sweetness forged this grand golden capital',
        gossip: 'Even the chocolate walls have tiny ears',
        politics: 'Sticky decrees govern the aromatic harbor',
        economy: 'Caramel paves the global market dreams',
        transport: 'All lovely paths lead back to Toffee'
    },
    'eclair-square': {
        legend: 'Highland mists hide ancient dough',
        gossip: 'Glazed rumors sail by balloon',
        politics: 'Pastry duels decide local law',
        economy: 'A soaring market of treats',
        transport: 'Riding the swift Pastry Line'
    },
    'peppermint-peak': {
        legend: 'Mint frost birthed the mountain',
        gossip: 'Cold whispers shatter the silence',
        politics: 'Frigid rules freeze the dissent',
        economy: 'Ice crystals drive the coin',
        transport: 'Rapid descent down Sled Rail'
    },
    'creme-tunnels': {
        legend: 'Glowing bugs carved these caves',
        gossip: 'Echoes travel deep subterranean veins',
        politics: 'Harvest quotas stir quiet unrest',
        economy: 'Pure dairy mined like gold',
        transport: 'Riding the swift Glow-bug Metro'
    },
    'banoffee-valley': {
        legend: 'A legendary storm baked heaven',
        gossip: 'Sweet breezes convey valley secrets',
        politics: 'Orchard disputes sour the harvest',
        economy: 'Banana paste fuels local wealth',
        transport: 'Cargo balloons trace the canopy'
    },
    'ganache-grove': {
        legend: 'Ancient cacao sings at night',
        gossip: 'Shadows whisper between mirror leaves',
        politics: 'Forest elders guard secret yields',
        economy: 'Silky gloss commands high prices',
        transport: 'Gliding the silent Moonlight Mono'
    },
    'cocoa-canyon': {
        legend: 'Mocha veins run deep forever',
        gossip: 'Miners share tales in darkness',
        politics: 'Rugged laws clash with miners',
        economy: 'Raw essence drives heavy trade',
        transport: 'Cliff gondolas conquer the drop'
    },
    'lava-cake-lake': {
        legend: 'Molten springs warm the earth',
        gossip: 'Bubbling rumors breach the surface',
        politics: 'Hot tempers flare over energy',
        economy: 'Geothermal chocolate heats the market',
        transport: 'Steam engines ride the heat'
    },
    'brownie-crossroads': {
        legend: 'History baked in every stone',
        gossip: 'Travelers trade tales and crumbs',
        politics: 'Crossroads tolls divide the merchants',
        economy: 'The busiest market in Honeywood',
        transport: 'Four ways to sweet adventure'
    },
    'hazelnut-terrace': {
        legend: 'Ancient terraces feed the world',
        gossip: 'Nutty secrets pass through generations',
        politics: 'Noble families guard the green',
        economy: 'Premium crops fund global dreams',
        transport: 'Crates descend the Nut Elevator'
    },
    'peanut-butter-falls': {
        legend: 'Force of creamy rapids roars with pride',
        gossip: 'River crews shout the news at sunrise',
        politics: 'Raft rivalries challenge the local river law',
        economy: 'Trade becomes cinematic grand theatre here',
        transport: 'Navigating the wild, wonderful peanut streams'
    },
    'honeycomb-heights': {
        legend: 'Amber cliffs hum a song',
        gossip: 'Giant moths carry sweet messages',
        politics: 'Vertical decrees rule the hive',
        economy: 'Golden blocks sweeten the province',
        transport: 'Gondolas drop through buzzing skies'
    },
    'nougat-node': {
        legend: 'Trade built this chewy hub',
        gossip: 'Conductors swap tales between stops',
        politics: 'Schedules dictate absolute local law',
        economy: 'Massive deals signed in transit',
        transport: 'A synchronized ballet of trains'
    },
    'praline-port': {
        legend: 'Sea breezes shaped nutty crags',
        gossip: 'Sailors bring news from afar',
        politics: 'Harbor taxes anchor heavy debates',
        economy: 'Rich exports fund coastal grandeur',
        transport: 'Ships sail the sweet horizon'
    },
    'sprinkle-sands': {
        legend: 'Tides wash up colorful crystals',
        gossip: 'Neon rumors glow at dusk',
        politics: 'Festivals spark bright local drama',
        economy: 'Sugar glass buys worldly favor',
        transport: 'Coastal trams chase the sunset'
    },
    'butterscotch-bay': {
        legend: 'Sunsetting skies blessed the water',
        gossip: 'Golden tides mask deep secrets',
        politics: 'Salt-syrup quotas stir the docks',
        economy: 'Warm waters yield rich chips',
        transport: 'Ships glide the caramel sea'
    },
    'caramel-cove': {
        legend: 'Syrup waves bring good fortune',
        gossip: 'Surfers share the sweetest trends',
        politics: 'Beach turf wars get sticky',
        economy: 'Sea-salt wax builds sweet empires',
        transport: 'Riding the wild golden tide'
    }
};

export const PROVINCIAL_HUB_LORE: Record<string, { title: string; description: string; stats: Record<string, string> }> = {
    'Toffee Town Capital': {
        title: "The Great Toffee Pull Center",
        description: "The rhythmic heart of the province's commerce. Massive mechanical pull-arms recalibrate the golden gloss of the Capital's signature aromatic scent. Currently recovering from the overwhelm of the Harvest Festival, it remains the essential junction for all nougat-binding logistics.",
        stats: {
            "Mechanical Status": "Recalibrating",
            "Aromatic Density": "94%",
            "Logistics Load": "Peak"
        }
    },
    'Praline Port': {
        title: "The Salted Horizon Docks",
        description: "Where nutty sea crags meet industrial ingenuity. The harbor is currently managing a massive influx of export-ledgers while the Noble Galleons watch from the berths. Sir Goldwhistle's presence is rarely seen but his tax-stamps are everywhere.",
        stats: {
            "Harbor Depth": "Deep-Syrup",
            "Export Velocity": "Steady",
            "Noble Presence": "High"
        }
    },
    'Peppermint Peak': {
        title: "The Sled Rail Terminus",
        description: "A high-altitude marvel of engineering. The Sled Rails are currently being de-iced by specialized frost crews to ensure the flow of mint-shards to the valley below continues without friction.",
        stats: {
            "Frost Level": "Crystal-Clear",
            "Descent Speed": "Max",
            "Mint Purity": "99.9%"
        }
    }
};

export const buildLensConfigs = (town: (typeof CHOCOBROOK_TOWNS)[number]): LensConfig[] => {
    const facts = TOWN_SPOTLIGHT_FACTS[town.id];
    const conflict = TOWN_CONFLICTS[town.id];
    const economy = TOWN_ECONOMY_NOTES[town.name];
    const transport = getTownTransportEntry(town.name);
    const transportLore = TOWN_TRANSPORT_LORE[town.id];
    const legendLore = TOWN_LEGEND_LORE[town.id];
    const legend = TOWN_LEGENDS[town.id];
    
    // Fetch sleek, lovely 5-word phrases
    const kickers = TOWN_LENS_KICKERS[town.id] || {
        legend: 'Myth and memory deeply unfold',
        gossip: 'Whispers echo across the streets',
        politics: 'Tension enters the local frame',
        economy: 'Trade becomes cinematic grand theatre',
        transport: 'Routes reveal the hidden map'
    };

    return [
        {
            id: 'legend', title: 'Legend Files',
            kicker: kickers.legend,
            accent: 'text-amber-300', border: 'border-amber-400/40', glow: 'from-amber-500/25',
            teaser: `${legend || `This territory carries an old story that still shapes its present.`}${legendLore ? ` ${legendLore.pastStruggle} Yet today, ${legendLore.modernTriumph.toLowerCase()}` : ` Guided by ${facts?.tree || 'an ancient relic'}, this lens gives the province its oldest and most majestic voice.`}`
        },
        {
            id: 'gossip', title: 'Gossip Files',
            kicker: kickers.gossip,
            accent: 'text-lime-300', border: 'border-lime-400/40', glow: 'from-lime-500/25',
            teaser: `${facts?.gossip?.[0] || 'Whispers move quickly through the area.'} ${facts?.gossip?.[1] || ''} This lens follows bakers, lantern keepers, and delighted witnesses as rumor turns into the heartbeat of the local streets.`
        },
        {
            id: 'politics', title: 'Politics Files',
            kicker: kickers.politics,
            accent: 'text-rose-400', border: 'border-rose-400/40', glow: 'from-rose-500/25',
            teaser: `${conflict?.unfairLaw || `A local rule is pressing too hard on daily life in the area.`} ${conflict?.harmedCitizen || `One harmed resident becomes the emotional center of the story.`} ${conflict?.rebels ? `The resistance is led by ${conflict.rebels.split(' ')[0]}.` : ''}`
        },
        {
            id: 'economy', title: 'Economy Files',
            kicker: kickers.economy,
            accent: 'text-cyan-300', border: 'border-cyan-400/40', glow: 'from-cyan-500/25',
            teaser: `${economy?.localTrade || `The region is sustained by a tightly woven local trade network.`} ${economy?.currency ? `Currency of the realm: the ${economy.currency}.` : ''} Markets, cargo, and schedules become cinematic theatre here.`
        },
        {
            id: 'transport', title: 'Transport Files',
            kicker: kickers.transport,
            accent: 'text-violet-400', border: 'border-violet-400/40', glow: 'from-violet-500/25',
            teaser: `${transportLore?.overview || `Its local routes shape how people, cargo, and rumor move between counties.`} ${transportLore ? `Primary mode: ${transportLore.primaryMode}. Sightseeing highlight: ${transportLore.travelerSightseeing}` : (transport ? `${transport.road} and ${transport.rail} define how the province breathes.` : '')}`
        }
    ];
};
