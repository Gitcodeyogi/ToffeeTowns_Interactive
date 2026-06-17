export const TOWN_ECONOMY_CAST: Record<string, { trader: string; farmer: string; merchant: string; banker: string }> = {
    'toffee-town': { trader: 'Goldie Swirl', farmer: 'Hank Sugarfield', merchant: 'Mabel Coinsworth', banker: 'Sir Reginald Vault' },
    'eclair-square': { trader: 'Fifi Glazeworth', farmer: 'Pierre Buttercrust', merchant: 'Yvette Puffington', banker: 'Claude Ledgerton' },
    'peppermint-peak': { trader: 'Frosty Flint', farmer: 'Minty Meadowsled', merchant: 'Crystal Bark Betty', banker: 'Summit Sam Vault' },
    'creme-tunnels': { trader: 'Dreamdust Dina', farmer: 'Glow-Bug Greg', merchant: 'Vein Violet Barter', banker: 'Cave-Keep Carlos' },
    'banoffee-valley': { trader: 'Beni Banana', farmer: 'Orchard Otis', merchant: 'Pie-Master Pip', banker: 'Caramel Cashier' },
    'ganache-grove': { trader: 'Gloss Gabriella', farmer: 'Velvet Vinewood', merchant: 'Mirror-Finish Mabel', banker: 'Silk Simon Ledgers' },
    'cocoa-canyon': { trader: 'Deep-Vein Dex', farmer: 'Canyon Coco Fields', merchant: 'Pulley Pete Trading', banker: 'Rift Rachel Savings' },
    'lava-cake-lake': { trader: 'Molten Murray', farmer: 'Ember Eve Hotsprings', merchant: 'Warmth Wanda', banker: 'Core Carl Finance' },
    'brownie-crossroads': { trader: 'Cocoa Cartwright', farmer: 'Fudge Fieldman', merchant: 'Crossway Clara', banker: 'Mortar Mike Savings' },
    'hazelnut-terrace': { trader: 'Rollo Crunchwell', farmer: 'Terri Nutgrove', merchant: 'Hazel Barterdale', banker: 'Otto Vaultridge' },
    'peanut-butter-falls': { trader: 'Skippy Torrent', farmer: 'Chuck Shellsworth', merchant: 'Nutella Streamgate', banker: 'Rapid Rex Savings' },
    'honeycomb-heights': { trader: 'Amber Liftwell', farmer: 'Buzz Pollenfield', merchant: 'Hexie Goldtrade', banker: 'Waxseal Winston' },
    'nougat-node': { trader: 'Chewy McRoads', farmer: 'Vanilla Nodsworth', merchant: 'Toll-Keeper Tess', banker: 'Hub Hank Finance' },
    'sprinkle-sands': { trader: 'Rainbow Ray', farmer: 'Sandy Sugarcone', merchant: 'Sparkle McBarter', banker: 'Chip Rainvault' },
    'butterscotch-bay': { trader: 'Syrup Sally Dockside', farmer: 'Butter Ben Fields', merchant: 'Salted Sara Barter', banker: 'Captain Goldpour' },
    'praline-port': { trader: 'Captain Nut-Cracker', farmer: 'Salty Sam', merchant: 'Praline Penny', banker: 'Harbor Hank' },
    'caramel-cove': { trader: 'Surfer Sal Caramel', farmer: 'Tidey Tom Fields', merchant: 'Wave Wanda Barter', banker: 'Drift Dave Savings' },
};

export const ECONOMY_FUN_FACTS: Record<string, string[]> = {
    'toffee-town': ['The economy is driven by high-end auctions and the central dessert exchange.', 'Prices for every bean, nut, and crystal in the province are set here.', 'Financial epicenter of the global dessert trade.'],
    'eclair-square': ['Artisan pastry production and apprentice craft centers.', ' Master bakers engage in nightly competition.', 'Air is thick with the scent of whipped chocolate cream.'],
    'peppermint-peak': ['Refined peppermint oils and medicinal cooling sweets.', ' Frost concentrates the essence of mint.', 'Altitude infuses desserts with a unique clarity.'],
    'creme-tunnels': ['Cream refinement, custard bases, and provincial dairy supply.', 'Harvesting subterranean dairy springs discovered centuries ago.', 'Luminous tunnels lit by bioluminescent glowbugs.'],
    'banoffee-valley': ['Banoffee pie exports and agricultural cooperatives.', 'Tapestry of banana orchards and caramel plantations.', 'Heavy mist at dawn accelerates ripening.'],
    'ganache-grove': ['Luxury ganache production and master chocolatier workshops.', ' Bean gloss is improved by musical vibrations.', 'High-security zones protect luxury cacao harvests.'],
    'cocoa-canyon': ['Raw cocoa extraction and industrial-scale bean processing.', ' Miners track the canyon pulse for new deposits.', 'Heavy freight lines handle massive ore loads.'],
    'lava-cake-lake': ['Geothermal energy and molten chocolate extraction.', ' Eruptions are signals of culinary breakthroughs.', 'Powering regional energy grids using the earth core.'],
    'brownie-crossroads': ['Logistics management, traveler services, and wholesale trade.', ' Busiest junction for independent merchants.', 'Every bakery claims a secret ancestral recipe.'],
    'hazelnut-terrace': ['Hazelnut farming and praline ingredient refinement.', ' Farmers use terraces to maximize nut yield.', 'Oldest trees draw sweetness from underground caramel.'],
    'peanut-butter-falls': ['Peanut butter production and confectionary oil refinement.', ' First nut-grinding mills powered by waterfalls.', 'Annual raft races celebrate the harvest.'],
    'honeycomb-heights': ['Natural honey production and caramel sweeteners.', ' Giant honeycombs cling to the highest cliffs.', 'Giant bees hum in perfect audible harmony.'],
    'nougat-node': ['Trade logistics and distribution for nut/sugar markets.', ' The Node warehouse shadows hide lucrative deals.', 'Vast intersection of chewy treats and commerce.'],
    'sprinkle-sands': ['Sprinkle production and sugar crystal harvesting.', ' Brilliant sugar crystals wash up with the tides.', 'Protective sea barriers guard against coastal storms.'],
    'butterscotch-bay': ['Butterscotch candy trade and international maritime commerce.', ' Harbor waters dyed golden by a legendary spill.', 'Caramel scent clings to ships for miles.'],
    'praline-port': ['The busiest nut-trade harbor in the province.', 'Nut-crags protect the bay from sticky storms.', 'Ancient sea shanties are sung by the automated cranes.'],
    'caramel-cove': ['Tourism, beach-side markets, and festival trade.', ' Caramel waves are an omen of good fortune.', 'Popular surfing destination for world-class travelers.'],
};

export const MARKET_TIMES = ['Dawn Market', 'Sunrise Bazaar', 'Morning Exchange', 'Brunch Trade', 'Midday Mart', 'Afternoon Fair', 'Tea-Time Swap', 'Evening Emporium', 'Sunset Auction', 'Twilight Stall', 'Night Bazaar', 'Late-Night Exchange', 'Moonlit Market', 'Midnight Mart', 'Pre-Dawn Deal', 'Fog Market', 'Golden Hour Trade', 'Harvest Hour'];

// --- Theatre Hub Integration ---
export interface TheatreCastMember {
    role: string;
    name: string;
    color: string;
    textColor: string;
    icon: string;
}

export const ECONOMY_THEATRE_DATA: Record<string, {
    cast: TheatreCastMember[];
    synopsis: string;
    sneakPeek: { speaker: string; text: string }[];
}> = Object.keys(TOWN_ECONOMY_CAST).reduce((acc, townId) => {
    const e = TOWN_ECONOMY_CAST[townId];
    const facts = ECONOMY_FUN_FACTS[townId] || [];
    const townName = townId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

    acc[townId] = {
        cast: [
            { role: 'Trader',   name: e.trader,   color: 'from-emerald-400 to-green-500',  textColor: 'text-emerald-300', icon: '💰' },
            { role: 'Farmer',   name: e.farmer,   color: 'from-lime-400 to-yellow-500',    textColor: 'text-lime-300',    icon: '🍞' },
            { role: 'Merchant', name: e.merchant, color: 'from-cyan-400 to-sky-500',       textColor: 'text-cyan-300',    icon: '🏪' },
            { role: 'Banker',   name: e.banker,   color: 'from-amber-400 to-orange-500',   textColor: 'text-amber-300',   icon: '🏦' },
        ],
        synopsis: facts[0] || `The economy of ${townName} runs on a vibrant trade network unique to its region.`,
        sneakPeek: [
            { speaker: e.trader,  text: facts[1] || 'Business is brisk and the market never sleeps.' },
            { speaker: e.banker,  text: facts[2] || 'Every coin tells a story of this town.' },
        ],
    };
    return acc;
}, {} as Record<string, any>);
