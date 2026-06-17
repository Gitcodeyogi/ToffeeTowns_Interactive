// ============================================================
// TOWN CONNECTIONS — Province-wide transport route map
// Candybrook Province, Chocolate Era
//
// PURPOSE:
//   Single source of truth for which towns connect to which,
//   via what transport mode, carrying what cargo.
//   Used by: Gossip stories, Transport stories, Economy dialogues,
//             and any cross-town narrative that must be geographically accurate.
//
// RULE: If a gossip dialogue says "I heard it from the rail driver between
//        Hazelnut Terrace and Nougat Node", this file must confirm that
//        that rail connection EXISTS. No fictional routes.
// ============================================================

export type TransportMode =
    | 'rail'           // Steam-caramel rail (main province backbone)
    | 'road'           // Road cart / wagon (daily short-distance)
    | 'sea'            // Sea ship (bulk coastal/port cargo)
    | 'river-raft'     // River raft / barge (downstream fast delivery)
    | 'air-balloon'    // Mint-gas air balloon (mountain + luxury + emergency)
    | 'horse-caravan'  // Horse caravan (heavy goods, forest/remote routes)
    | 'gondola'        // Cliff gondola / canal gondola (vertical + internal)
    | 'cable-car';     // Cable car / lift (height-elevation towns)

export interface TownConnection {
    /** destination townId */
    to: string;
    /** transport modes available on this route (may be multiple) */
    modes: TransportMode[];
    /** official route name for dialogue use */
    routeName: string;
    /** what typically flows on this route (for gossip accuracy) */
    cargo: string[];
    /** approximate travel time in the world's terms */
    travelTime: string;
    /** direction of primary cargo flow: 'both' | 'outbound' | 'inbound' */
    primaryFlow: 'both' | 'outbound' | 'inbound';
}

// ─── ALL TOWN CONNECTIONS ──────────────────────────────────────────────────
// Each entry lists connections FROM that town.
// Connections are bidirectional unless primaryFlow says otherwise.
// ──────────────────────────────────────────────────────────────────────────

export const TOWN_CONNECTIONS: Record<string, TownConnection[]> = {

    // ─── CAPITAL ────────────────────────────────────────────────────────────
    'toffee-town': [
        { to: 'eclair-square',      modes: ['rail'],                       routeName: 'Pastry Line',         cargo: ['glazes', 'cream', 'eclairs', 'pastry exports'],          travelTime: 'half a day',   primaryFlow: 'both' },
        { to: 'brownie-crossroads', modes: ['rail'],                       routeName: 'Brownie Loop',        cargo: ['brownie bricks', 'cocoa mortar', 'crossroads goods'],     travelTime: 'a few hours',  primaryFlow: 'inbound' },
        { to: 'nougat-node',        modes: ['rail'],                       routeName: 'Node Junction',       cargo: ['nougat blocks', 'nut candy', 'transit cargo'],            travelTime: 'half a day',   primaryFlow: 'both' },
        { to: 'ganache-grove',      modes: ['rail'],                       routeName: 'Moonlight Mono',      cargo: ['ganache capsules', 'glaze extract', 'cacao essence'],      travelTime: 'one day',      primaryFlow: 'inbound' },
        { to: 'cocoa-canyon',       modes: ['rail'],                       routeName: 'River Pulley',        cargo: ['cocoa essence', 'cocoa barrels', 'mocha extract'],         travelTime: 'one day',      primaryFlow: 'inbound' },
        { to: 'praline-port',       modes: ['sea'],                        routeName: 'Harbor Route',        cargo: ['praline paste', 'nut exports', 'sea cargo'],              travelTime: 'one day',      primaryFlow: 'both' },
        { to: 'butterscotch-bay',   modes: ['sea'],                        routeName: 'Sunset Barge',        cargo: ['butterscotch chips', 'sea-salt syrup', 'bay goods'],       travelTime: 'one day',      primaryFlow: 'inbound' },
        { to: 'caramel-cove',       modes: ['sea', 'rail'],                routeName: 'Surf Line',           cargo: ['sea-salt caramel', 'tide-filtered syrup'],                travelTime: 'half a day',   primaryFlow: 'inbound' },
        { to: 'sprinkle-sands',     modes: ['sea'],                        routeName: 'Beach Tram Sea Line', cargo: ['sprinkle sacks', 'sugar beads', 'crystal decor'],         travelTime: 'one day',      primaryFlow: 'inbound' },
        { to: 'banoffee-valley',    modes: ['rail'],                       routeName: 'Valley Line',         cargo: ['banoffee tins', 'caramel-banana paste'],                  travelTime: 'one day',      primaryFlow: 'inbound' },
    ],

    // ─── NUTWOOD COUNTY (Zone 1) ─────────────────────────────────────────────
    'hazelnut-terrace': [
        { to: 'nougat-node',        modes: ['rail', 'road'],               routeName: 'Nut Elevator → Node', cargo: ['hazelnuts', 'praline paste', 'nut oil'],                 travelTime: 'a few hours',  primaryFlow: 'outbound' },
        { to: 'praline-port',       modes: ['rail'],                       routeName: 'Nut Elevator → Harbor', cargo: ['raw hazelnuts', 'nut oil for praline processing'],      travelTime: 'half a day',   primaryFlow: 'outbound' },
        { to: 'peanut-butter-falls', modes: ['road'],                      routeName: 'River Gorge Road',    cargo: ['nut supplies', 'people', 'local trade'],                  travelTime: 'half a day',   primaryFlow: 'both' },
        { to: 'toffee-town',        modes: ['rail'],                       routeName: 'Nut Elevator → Pastry Line', cargo: ['premium hazelnut crates', 'seasonal fruit'],      travelTime: 'one day',      primaryFlow: 'outbound' },
    ],
    'peanut-butter-falls': [
        { to: 'nougat-node',        modes: ['river-raft', 'road'],         routeName: 'Falls Funicular → Node', cargo: ['peanut butter jars', 'peanut oil', 'ground cakes'],  travelTime: 'half a day',   primaryFlow: 'outbound' },
        { to: 'hazelnut-terrace',   modes: ['road'],                       routeName: 'River Gorge Road',    cargo: ['local goods', 'people'],                                  travelTime: 'half a day',   primaryFlow: 'both' },
        { to: 'toffee-town',        modes: ['river-raft', 'rail'],         routeName: 'Falls Funicular → Node Junction', cargo: ['peanut butter', 'peanut oil'],              travelTime: 'one day',      primaryFlow: 'outbound' },
    ],
    'nougat-node': [
        { to: 'toffee-town',        modes: ['rail'],                       routeName: 'Node Junction',       cargo: ['nougat blocks', 'all transit cargo from county'],        travelTime: 'half a day',   primaryFlow: 'outbound' },
        { to: 'praline-port',       modes: ['rail'],                       routeName: 'Dock Shuttle',        cargo: ['nougat', 'nut goods for export'],                         travelTime: 'half a day',   primaryFlow: 'both' },
        { to: 'hazelnut-terrace',   modes: ['rail', 'road'],               routeName: 'Nut Elevator',        cargo: ['return supplies', 'goods from capital'],                  travelTime: 'a few hours',  primaryFlow: 'inbound' },
        { to: 'peanut-butter-falls', modes: ['road', 'river-raft'],        routeName: 'River Gorge Road',    cargo: ['supplies from capital', 'return cargo'],                  travelTime: 'half a day',   primaryFlow: 'inbound' },
        { to: 'brownie-crossroads', modes: ['rail'],                       routeName: 'Brownie Loop connecting spur', cargo: ['county-to-county transit goods'],              travelTime: 'half a day',   primaryFlow: 'both' },
    ],
    'praline-port': [
        { to: 'toffee-town',        modes: ['sea'],                        routeName: 'Harbor Route',        cargo: ['praline paste', 'processed nuts', 'sea cargo'],          travelTime: 'one day',      primaryFlow: 'outbound' },
        { to: 'sprinkle-sands',     modes: ['sea'],                        routeName: 'Coast Line',          cargo: ['nut goods', 'sea trade'],                                 travelTime: 'half a day',   primaryFlow: 'both' },
        { to: 'butterscotch-bay',   modes: ['sea'],                        routeName: 'Bay Coastal Route',   cargo: ['nuts', 'sea goods'],                                      travelTime: 'one day',      primaryFlow: 'both' },
        { to: 'nougat-node',        modes: ['rail'],                       routeName: 'Dock Shuttle',        cargo: ['sea imports', 'incoming cargo for province'],             travelTime: 'half a day',   primaryFlow: 'inbound' },
        { to: 'hazelnut-terrace',   modes: ['rail'],                       routeName: 'Nut Elevator return', cargo: ['provincial imports for terrace'],                         travelTime: 'half a day',   primaryFlow: 'inbound' },
    ],

    // ─── CREAMWOOD COUNTY (Zone 2) ────────────────────────────────────────────
    'peppermint-peak': [
        { to: 'eclair-square',      modes: ['rail'],                       routeName: 'Sled Rail',           cargo: ['mint crystal shards', 'mint oil', 'white-chocolate bark'], travelTime: 'half a day', primaryFlow: 'outbound' },
        { to: 'creme-tunnels',      modes: ['air-balloon'],                routeName: 'Peak Balloon Route',  cargo: ['mint extracts', 'emergency medical mint supplies'],       travelTime: 'a few hours',  primaryFlow: 'outbound' },
        { to: 'banoffee-valley',    modes: ['rail', 'horse-caravan'],      routeName: 'Sled Rail / Mountain Pass', cargo: ['mint goods', 'cold-air goods'],                   travelTime: 'half a day',   primaryFlow: 'both' },
        { to: 'toffee-town',        modes: ['rail'],                       routeName: 'Sled Rail → Pastry Line', cargo: ['mint crystal shards', 'white bark strips'],          travelTime: 'one day',      primaryFlow: 'outbound' },
    ],
    'banoffee-valley': [
        { to: 'eclair-square',      modes: ['rail', 'air-balloon'],        routeName: 'Valley Railway / Cargo Balloon', cargo: ['banoffee tins', 'banana crates', 'caramel-banana paste'], travelTime: 'half a day', primaryFlow: 'outbound' },
        { to: 'toffee-town',        modes: ['rail'],                       routeName: 'Valley Line',         cargo: ['banoffee cream', 'banana paste'],                         travelTime: 'one day',      primaryFlow: 'outbound' },
        { to: 'peppermint-peak',    modes: ['rail', 'horse-caravan'],      routeName: 'Mountain Pass',       cargo: ['valley produce', 'local trade'],                          travelTime: 'half a day',   primaryFlow: 'both' },
        { to: 'creme-tunnels',      modes: ['road', 'horse-caravan'],      routeName: 'Valley Road',         cargo: ['fresh banana delivery', 'county trade'],                  travelTime: 'half a day',   primaryFlow: 'both' },
    ],
    'creme-tunnels': [
        { to: 'eclair-square',      modes: ['rail'],                       routeName: 'Glow-Bug Metro → Highland Rail', cargo: ['crystalline cream', 'cream powder', 'dream-dust'], travelTime: 'half a day', primaryFlow: 'outbound' },
        { to: 'peppermint-peak',    modes: ['air-balloon'],                routeName: 'Peak Balloon Route',  cargo: ['cream emergency supplies', 'tunnel goods'],               travelTime: 'a few hours',  primaryFlow: 'inbound' },
        { to: 'ganache-grove',      modes: ['rail'],                       routeName: 'Underground spur → Forest Rail', cargo: ['cream for ganache production'],                travelTime: 'half a day',   primaryFlow: 'outbound' },
        { to: 'banoffee-valley',    modes: ['road', 'horse-caravan'],      routeName: 'Valley Road',         cargo: ['cream goods', 'county trade'],                            travelTime: 'half a day',   primaryFlow: 'both' },
    ],
    'eclair-square': [
        { to: 'toffee-town',        modes: ['rail'],                       routeName: 'Pastry Line',         cargo: ['artisan eclairs', 'cream puffs', 'glazed pastries'],      travelTime: 'half a day',   primaryFlow: 'outbound' },
        { to: 'peppermint-peak',    modes: ['rail'],                       routeName: 'Sled Rail (return)',  cargo: ['supplies for peak', 'imported goods'],                    travelTime: 'half a day',   primaryFlow: 'inbound' },
        { to: 'banoffee-valley',    modes: ['rail'],                       routeName: 'Valley Railway',      cargo: ['pastry supplies', 'county trade'],                         travelTime: 'half a day',   primaryFlow: 'inbound' },
        { to: 'creme-tunnels',      modes: ['rail'],                       routeName: 'Highland Rail → Metro', cargo: ['eclair orders', 'pastry supplies for tunnels'],         travelTime: 'half a day',   primaryFlow: 'inbound' },
        { to: 'honeycomb-heights',  modes: ['air-balloon'],                routeName: 'Balloon Courier',     cargo: ['cream glazes needing honey', 'honey deliveries'],          travelTime: 'a few hours',  primaryFlow: 'inbound' },
    ],

    // ─── COCOAWOOD COUNTY (Zone 3) ────────────────────────────────────────────
    'ganache-grove': [
        { to: 'toffee-town',        modes: ['rail'],                       routeName: 'Moonlight Mono',      cargo: ['premium ganache', 'glaze extract capsules'],              travelTime: 'one day',      primaryFlow: 'outbound' },
        { to: 'cocoa-canyon',       modes: ['rail', 'horse-caravan'],      routeName: 'Forest Freight Rail', cargo: ['ganache for canyon processing', 'forest cacao'],          travelTime: 'half a day',   primaryFlow: 'both' },
        { to: 'lava-cake-lake',     modes: ['rail'],                       routeName: 'Thermal Express spur', cargo: ['ganache needing thermal concentrate'],                    travelTime: 'half a day',   primaryFlow: 'inbound' },
        { to: 'creme-tunnels',      modes: ['rail'],                       routeName: 'Forest Rail → Metro', cargo: ['cacao for cream pairing', 'ganache-cream orders'],        travelTime: 'half a day',   primaryFlow: 'inbound' },
        { to: 'eclair-square',      modes: ['rail'],                       routeName: 'Moonlight Mono → Pastry Line', cargo: ['premium ganache for eclair glazing'],            travelTime: 'one day',      primaryFlow: 'outbound' },
    ],
    'cocoa-canyon': [
        { to: 'toffee-town',        modes: ['rail'],                       routeName: 'River Pulley',        cargo: ['deep-vein cocoa essence', 'raw cocoa barrels'],           travelTime: 'one day',      primaryFlow: 'outbound' },
        { to: 'ganache-grove',      modes: ['rail', 'horse-caravan'],      routeName: 'Forest Freight Rail', cargo: ['raw cocoa for ganache production'],                       travelTime: 'half a day',   primaryFlow: 'outbound' },
        { to: 'lava-cake-lake',     modes: ['rail'],                       routeName: 'Thermal Express',     cargo: ['raw cocoa for thermal concentrate processing'],           travelTime: 'a few hours',  primaryFlow: 'both' },
        { to: 'brownie-crossroads', modes: ['rail'],                       routeName: 'River Pulley → Brownie Loop', cargo: ['cocoa mortar mix', 'raw cocoa bricks'],           travelTime: 'half a day',   primaryFlow: 'outbound' },
    ],
    'lava-cake-lake': [
        { to: 'cocoa-canyon',       modes: ['rail'],                       routeName: 'Thermal Express',     cargo: ['geothermal cocoa concentrate', 'volcanic paste'],         travelTime: 'a few hours',  primaryFlow: 'outbound' },
        { to: 'ganache-grove',      modes: ['rail'],                       routeName: 'Thermal Express spur', cargo: ['thermal cocoa for ganache richness'],                    travelTime: 'half a day',   primaryFlow: 'outbound' },
        { to: 'butterscotch-bay',   modes: ['road', 'horse-caravan'],      routeName: 'Ember Ring Road',     cargo: ['thermal goods', 'lake county trade'],                     travelTime: 'half a day',   primaryFlow: 'both' },
        { to: 'brownie-crossroads', modes: ['rail'],                       routeName: 'Thermal Express → Brownie Loop', cargo: ['cocoa concentrate for brownie production'],    travelTime: 'half a day',   primaryFlow: 'outbound' },
    ],
    'butterscotch-bay': [
        { to: 'toffee-town',        modes: ['sea'],                        routeName: 'Sunset Barge',        cargo: ['butterscotch chips', 'sea-salt butterscotch', 'bay syrup'], travelTime: 'one day',   primaryFlow: 'outbound' },
        { to: 'praline-port',       modes: ['sea'],                        routeName: 'Bay Coastal Route',   cargo: ['butterscotch goods', 'sea cargo'],                        travelTime: 'half a day',   primaryFlow: 'both' },
        { to: 'caramel-cove',       modes: ['sea', 'road'],                routeName: 'Sunset Promenade',    cargo: ['butterscotch', 'coastal salt trade'],                     travelTime: 'a few hours',  primaryFlow: 'both' },
        { to: 'sprinkle-sands',     modes: ['sea'],                        routeName: 'Coast Line',          cargo: ['butterscotch for coastal bazaars'],                        travelTime: 'half a day',   primaryFlow: 'outbound' },
        { to: 'lava-cake-lake',     modes: ['road', 'horse-caravan'],      routeName: 'Ember Ring Road',     cargo: ['sea salt for cocoa processing', 'bay imports'],           travelTime: 'half a day',   primaryFlow: 'both' },
    ],

    // ─── HONEYWOOD COUNTY (Zone 4) ────────────────────────────────────────────
    'honeycomb-heights': [
        { to: 'brownie-crossroads', modes: ['gondola', 'road'],            routeName: 'Amber Cable Car → Brownie Loop', cargo: ['honey blocks', 'royal jelly', 'beeswax'], travelTime: 'a few hours', primaryFlow: 'outbound' },
        { to: 'nougat-node',        modes: ['air-balloon'],                routeName: 'Honey Balloon Route', cargo: ['honey for nougat production', 'royal jelly'],             travelTime: 'half a day',   primaryFlow: 'outbound' },
        { to: 'eclair-square',      modes: ['air-balloon'],                routeName: 'Balloon Courier',     cargo: ['honey for eclair glazing', 'premium royal jelly'],        travelTime: 'half a day',   primaryFlow: 'outbound' },
        { to: 'caramel-cove',       modes: ['road'],                       routeName: 'Vertical Switchback', cargo: ['honey products', 'local county trade'],                   travelTime: 'half a day',   primaryFlow: 'both' },
    ],
    'caramel-cove': [
        { to: 'butterscotch-bay',   modes: ['sea', 'road'],                routeName: 'Sunset Promenade',    cargo: ['sea-salt caramel', 'caramel trade with bay'],              travelTime: 'a few hours',  primaryFlow: 'both' },
        { to: 'sprinkle-sands',     modes: ['rail'],                       routeName: 'Surf Line → Beach Tram', cargo: ['caramel for sprinkle coating', 'coastal trade'],       travelTime: 'a few hours',  primaryFlow: 'both' },
        { to: 'toffee-town',        modes: ['sea', 'rail'],                routeName: 'Tide Road',           cargo: ['tide-filtered caramel syrup', 'sea-salt caramel'],        travelTime: 'half a day',   primaryFlow: 'outbound' },
        { to: 'brownie-crossroads', modes: ['road'],                       routeName: 'Coastal Road',        cargo: ['caramel supplies for brownie production'],                 travelTime: 'half a day',   primaryFlow: 'both' },
        { to: 'honeycomb-heights',  modes: ['road'],                       routeName: 'Vertical Switchback', cargo: ['caramel for honey pairing', 'county trade'],              travelTime: 'half a day',   primaryFlow: 'both' },
    ],
    'sprinkle-sands': [
        { to: 'toffee-town',        modes: ['sea'],                        routeName: 'Beach Tram Sea Line', cargo: ['sprinkle sacks', 'sugar beads', 'crystal decor'],         travelTime: 'one day',      primaryFlow: 'outbound' },
        { to: 'praline-port',       modes: ['sea'],                        routeName: 'Coast Line',          cargo: ['sprinkle goods for sea export'],                           travelTime: 'half a day',   primaryFlow: 'outbound' },
        { to: 'butterscotch-bay',   modes: ['sea', 'rail'],                routeName: 'Beach Tram → Bay',    cargo: ['sprinkles for bay bazaars'],                               travelTime: 'half a day',   primaryFlow: 'both' },
        { to: 'caramel-cove',       modes: ['rail'],                       routeName: 'Beach Tram',          cargo: ['sprinkles for caramel-coating'],                           travelTime: 'a few hours',  primaryFlow: 'both' },
    ],
    'brownie-crossroads': [
        { to: 'toffee-town',        modes: ['rail'],                       routeName: 'Brownie Loop',        cargo: ['brownie bricks', 'dark cocoa bricks', 'cocoa mortar'],    travelTime: 'a few hours',  primaryFlow: 'outbound' },
        { to: 'nougat-node',        modes: ['rail'],                       routeName: 'Brownie Loop spur',   cargo: ['crossroads transit goods', 'brownie exports'],             travelTime: 'half a day',   primaryFlow: 'both' },
        { to: 'honeycomb-heights',  modes: ['road', 'gondola'],            routeName: 'Junction Circle → Cable Car', cargo: ['supplies for heights', 'honey return cargo'],   travelTime: 'half a day',   primaryFlow: 'both' },
        { to: 'ganache-grove',      modes: ['rail'],                       routeName: 'Brownie Loop → Moonlight Mono', cargo: ['cocoa bricks for ganache production'],          travelTime: 'half a day',   primaryFlow: 'outbound' },
        { to: 'caramel-cove',       modes: ['road'],                       routeName: 'Coastal Road',        cargo: ['brownie goods', 'county trade'],                           travelTime: 'half a day',   primaryFlow: 'both' },
        { to: 'cocoa-canyon',       modes: ['rail'],                       routeName: 'Brownie Loop → River Pulley', cargo: ['brownie production cocoa', 'mortar raw materials'], travelTime: 'half a day', primaryFlow: 'inbound' },
    ],
};

// ─── HELPER FUNCTIONS ───────────────────────────────────────────────────────

/**
 * Get all connections FROM a given town.
 * Use in gossip stories: "how does information travel FROM town X?"
 */
export function getConnectionsFrom(townId: string): TownConnection[] {
    return TOWN_CONNECTIONS[townId] || [];
}

/**
 * Get a specific connection between two towns (if it exists).
 * Use in gossip dialogue validation: "can character from A plausibly
 * have heard news from B via a specific mode?"
 */
export function getConnection(from: string, to: string): TownConnection | undefined {
    return TOWN_CONNECTIONS[from]?.find(c => c.to === to);
}

/**
 * Get all towns this town connects to, by a specific transport mode.
 * e.g. getConnectedByMode('toffee-town', 'sea') → ['praline-port', 'butterscotch-bay', ...]
 */
export function getConnectedByMode(townId: string, mode: TransportMode): string[] {
    return (TOWN_CONNECTIONS[townId] || [])
        .filter(c => c.modes.includes(mode))
        .map(c => c.to);
}

/**
 * Check if two towns are connected (directly, not via hub).
 * Use to validate gossip source claims.
 */
export function areTownsConnected(from: string, to: string): boolean {
    return (TOWN_CONNECTIONS[from] || []).some(c => c.to === to) ||
           (TOWN_CONNECTIONS[to]   || []).some(c => c.to === from);
}

/**
 * Get the primary cargo flowing between two towns.
 * Use in transport story dialogues: "what does the driver typically carry?"
 */
export function getPrimaryCargo(from: string, to: string): string[] {
    return getConnection(from, to)?.cargo
        ?? getConnection(to, from)?.cargo
        ?? [];
}
