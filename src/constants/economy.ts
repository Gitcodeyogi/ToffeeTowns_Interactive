// ──────────────────────────────────────────────
//  ECONOMY CONSTANTS — Town-level economic data for the Stories Page
//  Synced with Town DNA from towns.ts
// ──────────────────────────────────────────────

export interface TownEconomyNote {
    localTrade: string;
    currency: string;
    tradeStability: number;
    outboundTrade?: string;
    /**
     * What this town actually produces — the physical outputs.
     * This is the single source of truth for story narration.
     * Use in Scene 1 narrator dialogues and gossip cross-references.
     */
    produces: string[];
}

export const TOWN_ECONOMY_NOTES: Record<string, TownEconomyNote> = {
    'Toffee Town':          { produces: ['pulled toffee', 'premium toffee bars', 'caramel sauces', 'cocoa coins (Sugar-Bonds)', 'processed caramel sweets'],             localTrade: 'Premium toffee slabs and caramel sweets dominate the export manifest. Morning shifts at the Grand Pull define daily commerce.',                                                                             currency: 'Cocoa Coin',    tradeStability: 94 },
    'Eclair Square':        { produces: ['artisan eclairs', 'cream puffs', 'glazed pastries', 'pasty glaze', 'glazed biscuits'],                                           localTrade: 'Glaze exports and cream puff bundles flow outward through Pastry Lane. Every oven has a waiting list.',                                                                                                    currency: 'Puff Token',     tradeStability: 88 },
    'Banoffee Valley':      { produces: ['bananas', 'banoffee cream', 'caramel-banana paste', 'banoffee pie tins', 'orchard fruits'],                                      localTrade: 'Banana-caramel harvest carts and cooperative pie tins leave the valley before noon. Dawn mist makes the best fruit the fastest cargo.',                                                                    currency: 'Peel Note',      tradeStability: 84 },
    'Hazelnut Terrace':     { produces: ['hazelnuts', 'praline paste', 'roasted nut crates', 'nut oil', 'seasonal fruits', 'mixed berries'],                               localTrade: 'Roasted nut crates and praline paste barrels are the backbone of terrace trade. Altitude fees apply.',                                                                                                    currency: 'Nut Bond',       tradeStability: 91 },
    'Peanut Butter Falls':  { produces: ['peanut butter', 'peanut oil', 'ground peanut cakes', 'river-milled peanut paste'],                                               localTrade: 'Raft-shipped peanut butter jars ride the cascades down to the lowland markets. Freshness guaranteed by river speed.',                                                                                       currency: 'Crunch Note',    tradeStability: 85 },
    'Sprinkle Sands':       { produces: ['colored sprinkles', 'sugar beads', 'crystal decorations', 'rainbow sugar glass', 'neon sprinkle dust'],                          localTrade: 'Color-sorted sprinkle sacks and sugar-bead necklaces fetch premium prices at coastal bazaars.',                                                                                                           currency: 'Rainbow Chip',   tradeStability: 82 },
    'Nougat Node':          { produces: ['nougat blocks', 'soft nut candy', 'chewy nougat bars'],                                                                          localTrade: 'Transit taxes and nougat-toll revenues keep the Node afloat. Every crossroad has a fee booth.',                                                                                                           currency: 'Chewy Mark',     tradeStability: 90 },
    'Honeycomb Heights':    { produces: ['amber honey blocks', 'royal jelly', 'beeswax panels', 'raw honeycomb', 'wildflower honey'],                                      localTrade: 'Amber honey blocks and wax-sealed royal jelly are lowered by lift to valley buyers each morning.',                                                                                                        currency: 'Hex Bit',        tradeStability: 93 },
    'Butterscotch Bay':     { produces: ['butterscotch chips', 'sea-salted butterscotch', 'butter-toffee syrup', 'bay sea salt'],                                           localTrade: 'Slow-pour syrup barrels and salted butterscotch chips are shipped by sunset barge to the province.',                                                                                                       currency: 'Bay Doubloon',   tradeStability: 89 },
    'Brownie Crossroads':   { produces: ['brownie bricks', 'dark cocoa bricks', 'cocoa mortar mix', 'crossroads brownie loaf'],                                            localTrade: 'Brownie bricks and cocoa mortar mix travel by wagon in every direction. Junction tax is minimal but persistent.',                                                                                           currency: 'Crumb Cent',     tradeStability: 86 },
    'Ganache Grove':        { produces: ['premium ganache', 'glaze extract capsules', 'mirror-finish chocolate', 'cacao essence', 'darkness-roast ganache'],               localTrade: 'Mirror-finish ganache bottles and glaze extract capsules are grove exclusives. Quality control is obsessive.',                                                                                             currency: 'Gloss Franc',    tradeStability: 95 },
    'Peppermint Peak':      { produces: ['peppermint crystals', 'mint oil', 'white-chocolate bark strips', 'mint infusions', 'frost-preserved dairy'],                    localTrade: 'Mint crystal shards and white-chocolate bark strips are sled-delivered to the lowlands before sunrise.',                                                                                                  currency: 'Frost Penny',    tradeStability: 81 },
    'Lava Cake Lake':       { produces: ['geothermal cocoa concentrate', 'volcanic cocoa paste', 'thermal healing spring water', 'molten cocoa batter'],                  localTrade: 'Geothermal cocoa concentrate pipes directly into neighboring town water systems. Warmth is the true export.',                                                                                               currency: 'Ember Crown',    tradeStability: 92 },
    'Cocoa Canyon':         { produces: ['raw cocoa essence', 'deep-vein cocoa beans', 'mocha extract', 'cocoa pulp', 'canyon-floor cocoa bars'],                         localTrade: 'Deep-vein cocoa essence, harvested by pulley, commands the highest per-barrel price in the province.',                                                                                                    currency: 'Vein Drachma',   tradeStability: 96 },
    'Creme Tunnels':        { produces: ['crystalline cream', 'dream-dust', 'cream powder', 'glow-bug lanterns', 'underground spring cream'],                              localTrade: 'Dream-dust canisters and cream vein samples are tunnel-exclusive goods. Glow-bug lanterns are a bonus export.',                                                                                            currency: 'Cream Lira',     tradeStability: 84 },
    'Praline Port':         { produces: ['praline paste', 'nut-carved figurines', 'processed nut goods', 'harbour-cured praline blocks'],                                  localTrade: 'Nut-carved figurines and crunchy harbor teak planks are loaded onto trade ships at dawn. Dock fees are steep.',                                                                                            currency: 'Quay Shilling',  tradeStability: 88 },
    'Caramel Cove':         { produces: ['sea-salt caramel', 'tide-filtered caramel syrup', 'caramel surf wax', 'cove-brined caramel brine'],                              localTrade: 'Salted caramel surf wax and tide-filtered syrup are cove specialties. Surfers double as delivery riders.',                                                                                                currency: 'Drift Dollar',   tradeStability: 83 },
};

export interface TownWorldDetail {
    population: string;
    landmark: string;
    festival: string;
}

export const TOWN_WORLD_DETAILS: Record<string, TownWorldDetail> = {
    'Toffee Town': { population: '~12,400', landmark: 'Grand SparrowX Plaza', festival: 'The Great Toffee Pull' },
    'Eclair Square': { population: '~8,200', landmark: 'Glaze-Art Plaza Fountain', festival: 'Glaze Parade' },
    'Banoffee Valley': { population: '~4,900', landmark: 'Golden Mist Orchard', festival: 'Banoffee Pie Jubilee' },
    'Hazelnut Terrace': { population: '~6,800', landmark: 'Golden Praline Oak', festival: 'Hazelnut Harvest Parade' },
    'Peanut Butter Falls': { population: '~5,100', landmark: 'Peanut Butter Falls', festival: 'Peanut Raft Racing' },
    'Sprinkle Sands': { population: '~4,500', landmark: 'Rainbow Bouncing Dunes', festival: 'Color Sorting Championship' },
    'Nougat Node': { population: '~9,600', landmark: 'Vanilla-Cloud Lanterns', festival: 'The Nut-Cracking Festival' },
    'Honeycomb Heights': { population: '~3,800', landmark: 'Amber Hex-Lift ', festival: 'Honeycomb Exchange Festival' },
    'Butterscotch Bay': { population: '~6,200', landmark: 'Syrup-Drip Mangrove Pier', festival: 'Sun-bathing on Butter Sands' },
    'Brownie Crossroads': { population: '~7,900', landmark: 'Hover-Snack Wagons', festival: "Traveler's Brownie Feast" },
    'Ganache Grove': { population: '~2,900', landmark: 'Glossy Emerald-Cacao Forest', festival: 'Glaze Harvesting' },
    'Peppermint Peak': { population: '~3,200', landmark: 'White-Chocolate Spruce Summit', festival: 'Bark Sledding' },
    'Lava Cake Lake': { population: '~4,100', landmark: 'Hot Chocolate Springs', festival: 'Hot Chocolate Springs' },
    'Cocoa Canyon': { population: '~5,500', landmark: 'Deep-Vein Mocha Birch', festival: 'River Rafting in Chocolate' },
    'Creme Tunnels': { population: '~3,400', landmark: 'Everlasting-Eclair Chambers', festival: 'Cream Vein Exploration' },
    'Praline Port': { population: '~6,700', landmark: 'Crunchy Harbor Teak Mast', festival: 'Nut-Carving Regatta' },
    'Caramel Cove': { population: '~4,800', landmark: 'Syrup-Salt Willow', festival: 'Caramel Surfing' },
};

export interface KnowYourTownEntry {
    town: string;
    activity: string;
    slogan: string;
    previousLogic?: string;
    nextLogic?: string;
}

export const ORDERED_KNOW_YOUR_TOWNS_DATA: KnowYourTownEntry[] = [
    { town: 'Toffee Town', activity: 'The Great Toffee Pull', slogan: 'Sticky, sweet, and always elite.' },
    { town: 'Eclair Square', activity: 'Glaze Parade', slogan: 'Pastry pride with chocolate inside.' },
    { town: 'Banoffee Valley', activity: 'Banoffee Pie Jubilee', slogan: 'Misty orchards and caramel rewards.' },
    { town: 'Hazelnut Terrace', activity: 'Hazelnut Harvest Parade', slogan: 'Nutty layers and cocoa flavors.' },
    { town: 'Peanut Butter Falls', activity: 'Peanut Raft Racing', slogan: 'Nutty streams in cocoa dreams.' },
    { town: 'Sprinkle Sands', activity: 'Color Sorting Championship', slogan: 'Rainbow shores and crunchy floors.' },
    { town: 'Nougat Node', activity: 'The Nut-Cracking Festival', slogan: 'Nutty crossroads and chewy codes.' },
    { town: 'Honeycomb Heights', activity: 'Honeycomb Exchange Festival', slogan: 'Golden peaks and chocolate streaks.' },
    { town: 'Butterscotch Bay', activity: 'Sun-bathing on Butter Sands', slogan: 'Golden bay and buttery day.' },
    { town: 'Brownie Crossroads', activity: "Traveler's Brownie Feast", slogan: 'Where paths meet in cocoa heat.' },
    { town: 'Ganache Grove', activity: 'Glaze Harvesting', slogan: 'Glossy leaves and chocolate eaves.' },
    { town: 'Peppermint Peak', activity: 'Bark Sledding', slogan: 'Cool, minty, and chocolate wintry.' },
    { town: 'Lava Cake Lake', activity: 'Hot Chocolate Springs', slogan: 'Molten core and brownie shore.' },
    { town: 'Cocoa Canyon', activity: 'River Rafting in Chocolate', slogan: 'Rich, deep, and chocolate steep.' },
    { town: 'Creme Tunnels', activity: 'Cream Vein Exploration', slogan: 'Silky paths of chocolate cream.' },
    { town: 'Praline Port', activity: 'Nut-Carving Regatta', slogan: 'Nutty docks and cocoa stocks.' },
    { town: 'Caramel Cove', activity: 'Caramel Surfing', slogan: 'Sticky tide and golden slide.' },
];

export const KNOW_YOUR_TOWNS_DATA = ORDERED_KNOW_YOUR_TOWNS_DATA;

export const TOWN_TO_ZONE: Record<string, { title: string }> = {
    'Toffee Town': { title: 'The Capital City' },
    'Eclair Square': { title: 'Creamwood County' },
    'Banoffee Valley': { title: 'Creamwood County' },
    'Hazelnut Terrace': { title: 'Nutwood County' },
    'Peanut Butter Falls': { title: 'Nutwood County' },
    'Sprinkle Sands': { title: 'Honeywood County' },
    'Nougat Node': { title: 'Nutwood County' },
    'Honeycomb Heights': { title: 'Honeywood County' },
    'Butterscotch Bay': { title: 'Cocoawood County' },
    'Brownie Crossroads': { title: 'Honeywood County' },
    'Ganache Grove': { title: 'Cocoawood County' },
    'Peppermint Peak': { title: 'Creamwood County' },
    'Lava Cake Lake': { title: 'Cocoawood County' },
    'Cocoa Canyon': { title: 'Cocoawood County' },
    'Creme Tunnels': { title: 'Creamwood County' },
    'Praline Port': { title: 'Nutwood County' },
    'Caramel Cove': { title: 'Honeywood County' },
};

export const ECONOMY_STANDARD_LINES = [
    'The market is humming with potential.',
    'Trade routes remain clear and profitable.',
    'Local merchants report steady growth.'
];

export const TOWN_DIRECTION_LINKS: Record<string, { prev: string; next: string }> = {
    'Toffee Town': { prev: 'Caramel Cove', next: 'Eclair Square' },
    // Simplified for now to fix regression
};

export const SHIP_TOWNS = new Set(['Toffee Town', 'Eclair Square', 'Sprinkle Sands', 'Butterscotch Bay', 'Praline Port', 'Caramel Cove']);

export const SWEETLANDS_ROUTE_LINKS: Record<string, string> = {};
