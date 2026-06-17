export interface TransportLore {
    overview: string;
    primaryMode: string;
    specialRules: string[];
    travelerSightseeing: string;
}

export const TOWN_TRANSPORT_LORE: Record<string, TransportLore> = {
    'toffee-town': {
        overview: 'The metropolitan marvel where caramel-paved roads are polished to a mirror finish. It is the financial epicenter and starting point for all travelers.',
        primaryMode: 'Heavy Rail, Sea-Vessels & Skyway',
        specialRules: [
            'Yield to the synchronized ballet of converging logistics.',
            'Always yield to slow-moving fresh toffee deliveries.'
        ],
        travelerSightseeing: 'The Grand Caramel Station where the four great modes of travel converge into one golden terminal.'
    },
    'peppermint-peak': {
        overview: 'A cooling engine for the province where frost sharpens the senses and concentrates mint oils.',
        primaryMode: 'Mountain Railway & Emergency Balloons',
        specialRules: [
            'Layered clothing is mandatory for the preservation of delicate dairy.',
            'Yield to the medicinal cooling sweet couriers.'
        ],
        travelerSightseeing: 'High-altitude observation decks where the frost infuses desserts with legendary clarity.'
    },
    'eclair-square': {
        overview: 'A sprawling plaza dedicated to the art of the eclair, nestled within the cooling highland mists.',
        primaryMode: 'Highland Rail & Balloon Couriers',
        specialRules: [
            'No industrial baking processes allowed within the artisan zone.',
            'Watch for morning cream-fog density checks.'
        ],
        travelerSightseeing: 'The central square where master bakers engage in nightly high-stakes folding competitions.'
    },
    'creme-tunnels': {
        overview: 'Veins carved into the mountain to harvest subterranean dairy springs. The tunnels are structurally edible but reinforced.',
        primaryMode: 'Underground Metro & Vertical Lifts',
        specialRules: [
            'Do not blind the sentient glowbugs with flash photography.',
            'Weight limits strictly enforced on vertical cream-lifts.'
        ],
        travelerSightseeing: 'Luminous metro rides through white-corridor labyrinths lit by bioluminescent guides.'
    },
    'banoffee-valley': {
        overview: 'A tapestry of banana orchards and caramel plantations born from a legendary mountain storm.',
        primaryMode: 'Valley Railway & Cargo Balloons',
        specialRules: [
            'Yield to heavy-lift balloon cargo during dawn harvest.',
            'Respect the ripeness-acceleration mist zones.'
        ],
        travelerSightseeing: 'Panoramic rides through orchard valleys where the mist smells of caramelized bananas.'
    },
    'ganache-grove': {
        overview: 'A mystical forest territory of ancient cacao trees, protected by high-security checkpoints from smugglers.',
        primaryMode: 'Forest Rail & Secure Caravans',
        specialRules: [
            'Maintain silence for bean-gloss musical vibrations.',
            'Authorized personnel only in luxury ganache pressing zones.'
        ],
        travelerSightseeing: 'Midnight glass-bottomed rail tours through the glossy leaves and chocolate eaves.'
    },
    'cocoa-canyon': {
        overview: 'Rugged canyon terrain established along rich cocoa mineral veins. The canyon pulse guides discovery.',
        primaryMode: 'Freight Rail & Cliff Gondolas',
        specialRules: [
            'Check landslide safety status before canyon-floor descent.',
            'Pulley weight limits strictly enforced by echo-measure.'
        ],
        travelerSightseeing: 'Cliffside gondola rides with industrial views of raw cocoa extraction mines.'
    },
    'lava-cake-lake': {
        overview: 'A geothermal wonder where molten chocolate batter bubbles to the surface, powering the regional energy grid.',
        primaryMode: 'Molten Cargo Lines & Industrial Rail',
        specialRules: [
            'Keep hands inside the carriages for thermal protection.',
            'Evacuation required during geothermal pressure spikes.'
        ],
        travelerSightseeing: 'Floating spa skiffs that drift across the warm, glowing molten chocolate basin.'
    },
    'brownie-crossroads': {
        overview: 'The busy traveler hub where raw chocolate meets the world. Every bakery here holds a piece of history.',
        primaryMode: 'Four-Way Railway Junction & Caravans',
        specialRules: [
            'Prepare for traffic congestion at the provinces busiest logistics nexus.',
            'Respect the secret recipe zones in the crossroads bazaar.'
        ],
        travelerSightseeing: "The Great 'Crossway Bazaar' where independent merchants and four rail lines meet."
    },
    'hazelnut-terrace': {
        overview: 'Tiered hills carved for nut-harvesting efficiency. Prized nut orchards draw sweetness from the deep Earth.',
        primaryMode: 'Hillside Lifts & Freight Wagons',
        specialRules: [
            'Boot quarantine required to prevent orchard plant disease.',
            'Premium access only for top-tier terrace harvests.'
        ],
        travelerSightseeing: 'Vertical lifts providing bird-eye views of the cascading praline estates.'
    },
    'peanut-butter-falls': {
        overview: 'Mills powered by the force of peanut rapids. A town modernizing its historical water-powered engines.',
        primaryMode: 'River Routes & Integrated Rail',
        specialRules: [
            'Yield to the annual raft-racing merchants.',
            'Waterproof gear mandatory near the mill-churn mist.'
        ],
        travelerSightseeing: 'Famous raft races where peanut cargo boats navigate the thick, creamy rapids.'
    },
    'honeycomb-heights': {
        overview: 'Vertical cities clinging to cliff faces. Giant honey-moths and audible bee harmony define the heights.',
        primaryMode: 'High-Tension Gondolas & Safety Lifts',
        specialRules: [
            'Keep vertical flight silence in the upper quadrants.',
            'Do not disturb the giant honeycomb structure supports.'
        ],
        travelerSightseeing: 'Free-fall gondola tours that plunge from the cliffs before locking onto cables.'
    },
    'nougat-node': {
        overview: 'A snug node originally a simple checkpoint, now a massive intersection for the nut and sugar markets.',
        primaryMode: 'Railway Interchange & Caravan Highways',
        specialRules: [
            'Keep to passenger lanes to avoid heavy chewy-load convoys.',
            'Observe the synchronized ballet of 400 trains passing hourly.'
        ],
        travelerSightseeing: 'Watch-towers overlooking the hyper-organized logistical heart of the trade.'
    },
    'sprinkle-sands': {
        overview: 'Gateway to the world where tides deposit brilliant sugar crystals across the colorful coastline.',
        primaryMode: 'Coastal Trams & International Ships',
        specialRules: [
            'Yield to crystal harvesting teams during golden tide.',
            'Respect the rainbow-beach sea barrier zones.'
        ],
        travelerSightseeing: 'Coastal tram rides past thousands of floating candy-drop balloons.'
    },
    'butterscotch-bay': {
        overview: 'A golden bay shimmering with butterscotch scent. Harbor infrastructure is often at its trade limit.',
        primaryMode: 'Maritime Vessels & Port Rail Hubs',
        specialRules: [
            'Docking priority given to deep-sea maritime cargo.',
            'Butterscotch chips required for the harbor-master toll.'
        ],
        travelerSightseeing: 'Yacht tours sailing through gold-dyed waters under the six-hour sunset.'
    },
    'praline-port': {
        overview: 'A heavily trafficked harbor where nut-crags shield the docks and every manifest is checked against the tide clock.',
        primaryMode: 'Harbor Rail Spurs & Deep-Water Cargo Ships',
        specialRules: [
            'Respect the quay-bell loading order during sunrise cargo windows.',
            'Independent crews must clear nut-dust safety checks before entering heavy berths.'
        ],
        travelerSightseeing: 'Harbor promenade rides past crane choirs, cargo lifts, and the famous praline bell tower.'
    },
    'caramel-cove': {
        overview: 'Playful waves and warm currents drawing surfers and tourists for traditional trade omens.',
        primaryMode: 'Coastal Rail & Regional Roads',
        specialRules: [
            'Yield to surfers catching the good-fortune waves.',
            'Respect the beach-side hospitality curfews.'
        ],
        travelerSightseeing: 'Traditional caramel wave-surfing exhibitions celebrating the trade year.'
    }
};
