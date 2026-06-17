// Chuckle Mojo Game - Character Definitions
// These characters replace the colored bubbles with fun Halloween-themed monsters
// Currently using emoji sprites for maximum compatibility

// Character type definitions
export interface MojoCharacter {
    id: string;
    name: string;
    profession: string;
    emoji: string;
    color: string;          // Theme color for glow effects
    description: string;
    imageUrl: string;       // Link to the independent 3D render
    type: 'boss' | 'rebel'; // To easily distinguish factions
}

// 9 character slots for the match-3 game using independent 3D assets
export const MOJO_CHARACTERS: MojoCharacter[] = [
    // BOSSES
    { id: 'boss_grimshade', name: 'Grimshade', profession: 'Arch-Mage', emoji: '🧙‍♀️', color: '#8b5cf6', description: 'The cunning dark wizard of the Council.', imageUrl: '/characters/mojo/boss_grimshade.png', type: 'boss' },
    { id: 'boss_mayor', name: 'Pompelmoose', profession: 'Mayor', emoji: '👑', color: '#fbbf24', description: 'Rules with an iron fist and a cheesy smile.', imageUrl: '/characters/mojo/boss_mayor.png', type: 'boss' },
    { id: 'boss_matron', name: 'Stoutwood', profession: 'Matron', emoji: '🧹', color: '#0ea5e9', description: 'Enforces strict town curfews.', imageUrl: '/characters/mojo/boss_matron.png', type: 'boss' },
    { id: 'boss_chief', name: 'Whiskerton', profession: 'Police Chief', emoji: '🚓', color: '#3b82f6', description: 'The long arm of the law.', imageUrl: '/characters/mojo/boss_chief.png', type: 'boss' },
    { id: 'boss_cop', name: 'Goldwhistle', profession: 'Officer', emoji: '👮', color: '#6366f1', description: 'Collects all the bribes.', imageUrl: '/characters/mojo/boss_cop.png', type: 'boss' },

    // REBELS
    { id: 'rebel_baker', name: 'Master Baker', profession: 'Head Chef', emoji: '👨‍🍳', color: '#fb923c', description: 'Controls the yeast supply for the revolution.', imageUrl: '/characters/mojo/rebel_baker.png', type: 'rebel' },
    { id: 'rebel_lumberjack', name: 'Timber Baron', profession: 'Supply Manager', emoji: '🪓', color: '#b45309', description: 'Deforests for the cause of joy.', imageUrl: '/characters/mojo/rebel_lumberjack.png', type: 'rebel' },
    { id: 'rebel_professor', name: 'Syntax', profession: 'Intel Analyst', emoji: '👓', color: '#10b981', description: 'Calculates the rebellion\'s success.', imageUrl: '/characters/mojo/rebel_professor.png', type: 'rebel' },
    { id: 'rebel_chucklebop', name: 'Chucklebop', profession: 'Field Leader', emoji: '🏹', color: '#f472b6', description: 'The charismatic young leader of the rebellion.', imageUrl: '/characters/mojo/rebel_chucklebop.png', type: 'rebel' }
];

// Helper function to get a random character - Naturally balanced with 5 Bosses, 4 Rebels 
export const getRandomCharacter = (): MojoCharacter => {
    return MOJO_CHARACTERS[Math.floor(Math.random() * MOJO_CHARACTERS.length)];
};

// Helper function to get character by ID
export const getCharacterById = (id: string): MojoCharacter | undefined => {
    return MOJO_CHARACTERS.find(c => c.id === id);
};

// MAJOR TOWNS DNA
export interface TownDNA {
    id: string;
    name: string;
    county: string;
    vibe: string;
    description: string;
}

export const MAJOR_TOWNS: TownDNA[] = [
    { id: 'toffee-town', name: 'Toffee Town', county: 'Honeywood', vibe: 'Cheerful & Bustling', description: 'The hub of all sweet commerce and the center of the Bread Revolution.' },
    { id: 'nougat-node', name: 'Nougat Node', county: 'Nutwood', vibe: 'Industrial & High-Tech', description: 'The technical capital where surveillance grids and mechanical wonders are born.' },
    { id: 'butterscotch-bay', name: 'Butterscotch Bay', county: 'Cocoawood', vibe: 'Coastal & Nautical', description: 'A strategic port town where supply ships carry the weight of the province.' },
    { id: 'banoffee-valley', name: 'Banoffee Valley', county: 'Creamwood', vibe: 'Lush & Agricultural', description: 'The fertile valley providing the cream and fruit for the grandest feasts.' },
    { id: 'brownie-crossroads', name: 'Brownie Crossroads', county: 'Honeywood', vibe: 'Busy & Strategic', description: 'The grand intersection where all paths meet, monitored heavily by the Council.' }
];

export interface MojoVariant {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    situation: string;
    steps: string[];
    details: string;
    labels: string[];
    targetType: 'rebel' | 'boss' | 'mixed' | 'all' | 'specific' | 'sequential';
    sequenceIds?: string[];
    specificIds?: string[];
    objectives: string[];
    intelHint: string;
    completionMessage: string;
}

// Story scenarios connected to game levels
export interface MojoScenario {
    level: number;
    variants: MojoVariant[];
}

export const MOJO_SCENARIOS: MojoScenario[] = [
    {
        level: 1,
        variants: [
            {
                id: 'l1v1',
                title: "VILLAGE BREADLINE",
                subtitle: "Rebel Support",
                description: "Toffee Town is hungry! Link the Rebels to deliver the bread.",
                situation: "The local bakeries are under a strict flour lockdown. You must secure the supply line by connecting any Rebels on the grid to create a safe path for distribution.",
                steps: [
                    "Locate any Rebel characters (the ones with brown/green icons).",
                    "Link 3 or more Rebels together in a single chain.",
                    "The longer the chain, the more bread you deliver!",
                    "Avoid the Council Bosses—they will block the shipment."
                ],
                details: "Simple and direct. Focus on creating long Rebel chains to stabilize the village.",
                labels: ["Rookie Mission", "Rebel Support", "Basic Training"],
                targetType: 'rebel',
                objectives: ["Link 3+ Rebels", "Avoid all Bosses", "Score 3000 XP"],
                intelHint: "Just link any Rebels you see in a chain of 3 or more.",
                completionMessage: "The yeast is distributed! Toffee Town will have its bread."
            },
            {
                id: 'l1v2',
                title: "COUNCIL SWEEP",
                subtitle: "Order Enforcement",
                description: "The Council is mobilizing. Link the Officials to initiate the sweep.",
                situation: "Mayor Pompelmoose has ordered a surprise audit. You must connect the Council Bosses to ensure the inspectors have full legal coverage to search the town.",
                steps: [
                    "Identify the Council Bosses (the ones with blue/gold/dark icons).",
                    "Connect any 3 or more Bosses in a single path.",
                    "Ignore the Rebels—this is a high-level government operation.",
                    "Reach the XP target to finalize the audit warrants."
                ],
                details: "Law and order must prevail. Link the elite to sweep the streets.",
                labels: ["Council Decree", "Standard Audit", "Official Business"],
                targetType: 'boss',
                objectives: ["Link 3+ Bosses", "Ignore the Rebels", "High precision"],
                intelHint: "Connect only the Council Bosses to clear the mission.",
                completionMessage: "The sweep is authorized. The streets are under control."
            },
            {
                id: 'l1v3',
                title: "URGENT DISPATCH",
                subtitle: "The Courier Path",
                description: "A secret message needs to cross the Crossroads. Link the Rebels.",
                situation: "A coded message needs to reach the safehouse. Create a path of Rebels to pass the scroll secretly across Brownie Crossroads.",
                steps: [
                    "Find the Rebel couriers on the grid.",
                    "Create a continuous link of 3 or more Rebels.",
                    "Avoid Bosses—they are searching for the coded message.",
                    "Clear the path to reach the stabilization target."
                ],
                details: "Stay quiet. Every Rebel connection helps the message get closer to its destination.",
                labels: ["Stealth Path", "Coded Intel", "Beginner Friendly"],
                targetType: 'rebel',
                objectives: ["Link 3+ Rebels", "No Boss Interference", "Stabilize the Grid"],
                intelHint: "Link as many Rebels as possible in one go.",
                completionMessage: "The message is safe. The Mayor's secrets are ours."
            }
        ]
    },
    {
        level: 2,
        variants: [
            {
                id: 'l2v1',
                title: "REBEL ESCORT",
                subtitle: "Infiltration Safety",
                description: "The Rebellion leaders are moving. Secure their path by linking ONLY Rebels.",
                situation: "Escort a group of refugees through the Nougat Node surveillance grid. The Bosses are searching every corner, so you must create a continuous path of Rebel safety.",
                steps: [
                    "Scan for Rebel signals on the grid.",
                    "Create chains of 3 or more Rebel units.",
                    "Target 5+ links to trigger a 'Mojo Burst' distracter.",
                    "Keep the path clear of any Council officials."
                ],
                details: "Longer chains provide better cover. A single Boss link will blow the entire group's cover.",
                labels: ["Escort Mission", "Surveillance Bypass", "High Stake"],
                targetType: 'rebel',
                objectives: ["Link 5+ Rebels for Burst", "Avoid Boss interference", "Speed is critical"],
                intelHint: "Focus exclusively on the pink and orange glow units.",
                completionMessage: "The leaders have reached the safehouse. Well done."
            },
            {
                id: 'l2v2',
                title: "BOSS HUNTER",
                subtitle: "Council Disruption",
                description: "Disrupt the Mayor's cabinet. Link ONLY Bosses to neutralize their influence.",
                situation: "Butterscotch Bay is being taxed into oblivion. The only way to stop it is to disrupt the Council members while they are in transit. Isolate them and break their communication chain.",
                steps: [
                    "Identify Boss signatures in the tactical view.",
                    "Link only those with the Council faction tag.",
                    "Aim for high-ranking officials first.",
                    "Ignore Rebel distractions to maintain focus."
                ],
                details: "The Council is resilient. You need consistent links to effectively disrupt their command structure.",
                labels: ["Counter-Op", "Faction Sabotage", "Precision Strike"],
                targetType: 'boss',
                objectives: ["Match only Bosses", "Ignore Rebel signals", "Target High-Ranking Officials"],
                intelHint: "Focus on the blue and purple glow units.",
                completionMessage: "The Council's influence is wavering. The town breathes easier."
            },
            {
                id: 'l2v3',
                title: "THE GREAT ROUNDUP",
                subtitle: "Security Sweep",
                description: "Officer Goldwhistle is clearing the plaza. Help him round up the officials.",
                situation: "A grand celebration is planned at Banoffee Valley, and all Council members must be gathered for the processional. Guide the Officer by linking all available officials into a single group.",
                steps: [
                    "Begin the sweep with any Boss unit.",
                    "Link as many Bosses as possible in one go.",
                    "Clear the grid of all Council interference.",
                    "Avoid Rebel protesters at all costs."
                ],
                details: "The more officials you gather, the more points the Mayor awards for 'Administrative Excellence'.",
                labels: ["Organization", "Official Gathering", "Bureaucracy"],
                targetType: 'boss',
                objectives: ["Clear all Bosses", "Maintain high multiplier", "Avoid Protesters"],
                intelHint: "Gather every Boss you see. Don't leave anyone behind.",
                completionMessage: "The processional was a success. The Mayor is pleased with your efficiency."
            }
        ]
    },
    {
        level: 3,
        variants: [
            {
                id: 'l3v1',
                title: "DOUBLE AGENT",
                subtitle: "Faction Swap",
                description: "Balance the signals. Alternate between Rebel and Boss units.",
                situation: "To maintain cover as a double agent in Nougat Node, you must carefully balance your interactions. Too much focus on one faction will raise suspicion from the other.",
                steps: [
                    "Start with any unit.",
                    "Your next link MUST be from the opposing faction.",
                    "Maintain this alternating cycle as long as possible.",
                    "Use Mojo Bursts to clear suspicion if the cycle breaks."
                ],
                details: "This is a high-level cognitive challenge. Keep the cycle steady: Rebel, Boss, Rebel, Boss.",
                labels: ["Covert Ops", "Cognitive Balance", "Undercover"],
                targetType: 'mixed',
                objectives: ["Alternate Factions", "Don't break the chain", "Mojo Burst at 6+ links"],
                intelHint: "Think: Rebel, Boss, Rebel, Boss. Keep the cycle going.",
                completionMessage: "The signal is stabilized. You've successfully masked the operation."
            },
            {
                id: 'l3v2',
                title: "NEUTRAL ZONE",
                subtitle: "Cross-Faction Peace",
                description: "Establish a neutral zone at the Crossroads by alternating links.",
                situation: "The Crossroads are a powder keg. Rebels and Bosses are facing off. You must intercede and establish a neutral zone by linking them together in a perfect alternating sequence.",
                steps: [
                    "Identify the tension points between factions.",
                    "Create a bridge by linking a Boss to a Rebel.",
                    "Continue the bridge with the opposite faction.",
                    "Ensure no two units of the same faction touch in your chain."
                ],
                details: "The peace is fragile. Two same-faction units touching will trigger a riot and end the session.",
                labels: ["Mediation", "Fragile Peace", "High Stakes"],
                targetType: 'mixed',
                objectives: ["Perfect Alternation", "Min 5 links per chain", "Avoid Faction Clashes"],
                intelHint: "Bridge the gap: Boss -> Rebel -> Boss -> Rebel.",
                completionMessage: "Peace is restored for now. You are the master of the Crossroads."
            },
            {
                id: 'l3v3',
                title: "THE DUALITY GRID",
                subtitle: "Binary Stabilization",
                description: "The energy grid requires binary stabilization. Alternate signals.",
                situation: "The Butterscotch Bay lighthouse is failing! Its binary beam requires alternating pulses of Rebel energy and Boss logic to pierce through the magical fog.",
                steps: [
                    "Initialize the pulse with any character.",
                    "Feed the opposite signal next.",
                    "Repeat until the lighthouse grid is fully stabilized.",
                    "Don't let the same signal repeat twice in a row."
                ],
                details: "Watch the colors: Green/Orange vs Purple/Blue. Keep them swapping!",
                labels: ["Engineering", "Energy Grid", "Synchronization"],
                targetType: 'mixed',
                objectives: ["Binary Sequence", "Stabilize 100% Grid", "No Pulse Echoes"],
                intelHint: "Switch signals every single link. No repeats.",
                completionMessage: "The lighthouse is bright! The supply ships can finally dock."
            }
        ]
    },
    {
        level: 4,
        variants: [
            {
                id: 'l4v1',
                title: "SABOTAGE PROTOCOL",
                subtitle: "High Priority Targets",
                description: "A specific team is planning a sabotage. Secure the key players.",
                situation: "Grimshade has been spotted meeting with Whiskerton and Chucklebop. This unlikely trio is up to something big in the Nougat Node archives. Secure them specifically to stop the sabotage.",
                steps: [
                    "Locate Arch-Mage Grimshade on the grid.",
                    "Find Police Chief Whiskerton.",
                    "Find Field Leader Chucklebop.",
                    "Link ONLY these three in any order."
                ],
                details: "The archives are heavily guarded. Any other links will trigger the alarms and fail the mission.",
                labels: ["Targeted Strike", "Archive Security", "Specific Intel"],
                targetType: 'specific',
                specificIds: ['boss_grimshade', 'boss_chief', 'rebel_chucklebop'],
                objectives: ["Specific IDs only", "Ignore the distractions", "Extreme precision required"],
                intelHint: "Only link Grimshade, Whiskerton, and Chucklebop.",
                completionMessage: "The sabotage team is neutralized. Crisis averted."
            },
            {
                id: 'l4v2',
                title: "THE CAPITOL THREE",
                subtitle: "Diplomatic Envoy",
                description: "Secure the Diplomatic Envoy: The Mayor, the Analyst, and the Manager.",
                situation: "A high-level meeting is happening at Banoffee Valley. We need to secure the envoy consisting of Mayor Pompelmoose, Professor Syntax, and the Timber Baron.",
                steps: [
                    "Find the Mayor in the crowd.",
                    "Locate the Analyst (Syntax).",
                    "Locate the Manager (Timber Baron).",
                    "Create a chain linking only these specific leaders."
                ],
                details: "Diplomacy is delicate. Including anyone else in the chain will be seen as an act of aggression.",
                labels: ["Diplomacy", "High Value Targets", "Executive Security"],
                targetType: 'specific',
                specificIds: ['boss_mayor', 'rebel_professor', 'rebel_lumberjack'],
                objectives: ["Envoy Only", "No Collateral Links", "Dignitary Protection"],
                intelHint: "Mayor, Analyst, and Manager. No one else.",
                completionMessage: "The envoy is secure. The treaty talks can proceed."
            },
            {
                id: 'l4v3',
                title: "STABILIZATION TRIO",
                subtitle: "The Core Nodes",
                description: "Stabilize the core nodes: The Matron, the Officer, and the Chef.",
                situation: "The energy core of Brownie Crossroads is leaking! To stop the leak, we must synchronize the signatures of the Matron, the Officer, and the Head Chef simultaneously.",
                steps: [
                    "Identify the Matron (Stoutwood).",
                    "Identify the Officer (Goldwhistle).",
                    "Identify the Head Chef (Master Baker).",
                    "Link these three cores together."
                ],
                details: "The core is unstable. You must link all three correctly to prevent a total town blackout.",
                labels: ["Maintenance", "Critical Core", "Stabilization"],
                targetType: 'specific',
                specificIds: ['boss_matron', 'boss_cop', 'rebel_baker'],
                objectives: ["Core Trio Only", "Prevent Blackout", "Zero Error Margin"],
                intelHint: "Matron, Officer, and Chef. The core depends on them.",
                completionMessage: "The core is stabilized. Crossroads power is back at 100%."
            }
        ]
    },
    {
        level: 5,
        variants: [
            {
                id: 'l5v1',
                title: "ULTIMATE STABILIZATION",
                subtitle: "The Master Sequence",
                description: "The grid is failing! Follow the 8-step master sequence.",
                situation: "This is it. The entire province's energy grid is collapsing into Toffee Town. The only way to save it is the Master Sequence—a perfect loop of all 8 key figures in the town.",
                steps: [
                    "Start with the Officer and Analyst.",
                    "Connect to the Matron and Manager.",
                    "Pass through the Chief and Chef.",
                    "Finish with the Mayor and the Field Leader."
                ],
                details: "This is the ultimate test. One wrong link will cause a chain reaction that resets the entire grid.",
                labels: ["World Event", "Legendary Trial", "Grid Mastery"],
                targetType: 'sequential',
                sequenceIds: ['boss_cop', 'rebel_professor', 'boss_matron', 'rebel_lumberjack', 'boss_chief', 'rebel_baker', 'boss_mayor', 'rebel_chucklebop'],
                objectives: ["8-Step Master Sequence", "One mistake ends the mission", "Legendary speed bonus"],
                intelHint: "Memorize: Officer, Analyst, Matron, Manager, Chief, Chef, Mayor, Leader.",
                completionMessage: "Legendary! The grid is permanently stabilized. You are a Town Match Hero."
            },
            {
                id: 'l5v2',
                title: "THE REVOLUTIONARY CIRCLE",
                subtitle: "Full Alignment",
                description: "Align all 8 leaders in the Revolutionary Circle sequence.",
                situation: "At the peak of Nougat Node, the revolution must come full circle. We need to align every major player into a perfect circle of cooperation to override the Council's master locks.",
                steps: [
                    "Begin with the Field Leader (Chucklebop).",
                    "Follow the secret path through all 7 other members.",
                    "The sequence must be exactly as dictated by the Intel Analyst.",
                    "Don't miss a single step."
                ],
                details: "The sequence is reversed this time: Leader, Mayor, Chef, Chief, Manager, Matron, Analyst, Officer.",
                labels: ["Rebellion Peak", "Full Override", "Elite Strategy"],
                targetType: 'sequential',
                sequenceIds: ['rebel_chucklebop', 'boss_mayor', 'rebel_baker', 'boss_chief', 'rebel_lumberjack', 'boss_matron', 'rebel_professor', 'boss_cop'],
                objectives: ["Reverse Master Sequence", "High Speed required", "Zero Signal Drift"],
                intelHint: "Leader, Mayor, Chef, Chief, Manager, Matron, Analyst, Officer.",
                completionMessage: "The master locks are broken! The Nougat Node belongs to the people."
            },
            {
                id: 'l5v3',
                title: "CROSSROADS CONVERGENCE",
                subtitle: "The Grand Convergence",
                description: "Follow the grand convergence path to save the province.",
                situation: "All paths meet here at Brownie Crossroads. The energy surge is at its peak! You must guide the convergence through all 8 leaders to channel the energy safely away from the town.",
                steps: [
                    "Start the convergence with the Chief.",
                    "Flow through the Chef, Matron, and Manager.",
                    "Navigate through the Officer, Analyst, Mayor, and Leader.",
                    "Do it all in one fluid, legendary motion."
                ],
                details: "The energy is fast! You need to link all 8 in record time to achieve the Grand Convergence.",
                labels: ["Final Stand", "Energy Channeling", "Grand Finale"],
                targetType: 'sequential',
                sequenceIds: ['boss_chief', 'rebel_baker', 'boss_matron', 'rebel_lumberjack', 'boss_cop', 'rebel_professor', 'boss_mayor', 'rebel_chucklebop'],
                objectives: ["Convergence Sequence", "Record Breaking Speed", "Total Stability"],
                intelHint: "Chief, Chef, Matron, Manager, Officer, Analyst, Mayor, Leader.",
                completionMessage: "The convergence is successful! You have saved the province from total meltdown."
            }
        ]
    }
];

export default MOJO_CHARACTERS;

