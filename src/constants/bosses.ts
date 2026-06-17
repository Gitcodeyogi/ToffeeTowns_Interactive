import type { CharacterProfile } from './index';
import { CHARACTER_IMAGES } from './characterAssets';

export const BOSSES_GUILD: CharacterProfile[] = [
    {
        id: 'boss_pompelmoose',
        name: 'Mayor Pompelmoose',
        role: 'Executive Leader of Candybrook',
        clan: 'Bosses',
        image: CHARACTER_IMAGES.bosses.pompelmoose,
        description: "Charismatic, theatrical, and deeply convinced that leadership is partly about good governance and partly about excellent stage presence.",
        stats: { mischief: 15, righteousness: 10, influence: 95, chaos: 20, style: 95, secrets: 65, sweetTooth: 90 },
        infoLines: [
            { label: "Circle of Influence", value: "Inner Circle", colorClass: "text-purple-400" },
            { label: "Core Role", value: "Executive Leader", colorClass: "text-purple-400" },
            { label: "Personality Traits", value: "Charismatic, theatrical, politically sharp" },
            { label: "Strategic Strength", value: "Master planner and public speaker who can rally entire towns with grand speeches" },
            { label: "Comic Weakness", value: "Cannot resist tasting desserts before approving policies, which sometimes delays meetings" },
            { label: "Signature Habit", value: "Practices speeches in front of a mirror and applauds his own phrasing" },
            { label: "Public Reputation", value: "Seen as visionary by supporters and overly dramatic by rebels" },
            { label: "Dialogue Flavor", value: '"My fellow citizens! Prosperity is not merely achieved — it is administratively organized!"', colorClass: "text-amber-300 italic" }
        ],
        dna: {
            publicRole: 'Capital Mayor and chief authority of Candybrook administration.',
            coreIntention: 'Maintain absolute civic control while preserving his public legacy.',
            signatureAction: 'Issues performative decrees and staged inspections to enforce order.',
            narrativeFunction: 'Primary antagonist pressure source across all town arcs.',
            pressurePoint: 'Fear of losing legitimacy before X audits and public trust checks.'
        }
    },
    {
        id: 'boss_stautwood',
        name: 'Sheriff Bumblewood',
        role: 'High Enforcer',
        clan: 'Bosses',
        image: CHARACTER_IMAGES.bosses.chief, // Using chief image
        description: "A bumbling sheriff who makes hilarious, well-meaning mistakes and constantly drops his clipboard.",
        stats: { mischief: 20, righteousness: 95, influence: 90, chaos: 45, style: 75, secrets: 35, sweetTooth: 40 },
        infoLines: [
            { label: "Circle of Influence", value: "Inner Circle", colorClass: "text-purple-400" },
            { label: "Core Role", value: "High Enforcer", colorClass: "text-purple-400" },
            { label: "Personality Traits", value: "Bumbling, enthusiastic, well-meaning" },
            { label: "Strategic Strength", value: "Attempts to maintain law, but ends up solving crimes by pure, spectacular accident" },
            { label: "Comic Weakness", value: "Drops his clipboard at the worst possible moments and gets tangled in his own enforcer cape" },
            { label: "Signature Habit", value: "Carries a giant clipboard, dropping it at least three times per conversation" },
            { label: "Public Reputation", value: "Citizens say they can track him easily by the trail of dropped pens and loose papers" },
            { label: "Dialogue Flavor", value: '"Hold on! The law clearly states... oops, my clipboard! Let me grab that... *papers scatter*"', colorClass: "text-amber-300 italic" }
        ]
    },
    {
        id: 'boss_mortimer',
        name: 'Bramble Mortimer',
        role: 'Grand Provisioner',
        clan: 'Bosses',
        image: CHARACTER_IMAGES.bosses.matron, // Fallback until baker image shared
        description: "A cheerful giant of a baker who believes bread is the foundation of civilization.",
        stats: { mischief: 20, righteousness: 80, influence: 85, chaos: 30, style: 60, secrets: 40, sweetTooth: 95 },
        infoLines: [
            { label: "Circle of Influence", value: "Inner Circle", colorClass: "text-purple-400" },
            { label: "Core Role", value: "Grand Provisioner", colorClass: "text-purple-400" },
            { label: "Personality Traits", value: "Cheerful, loud, practical" },
            { label: "Strategic Strength", value: "Controls bread, pastries, and grain supply across the province" },
            { label: "Comic Weakness", value: "Becomes distracted when inventing new pastries during council meetings" },
            { label: "Signature Habit", value: "Kneads dough while discussing politics" },
            { label: "Public Reputation", value: "Famous for detecting bakeries by smell" },
            { label: "Dialogue Flavor", value: '"No argument cannot be softened by a good cinnamon roll."', colorClass: "text-amber-300 italic" }
        ]
    },
    {
        id: 'boss_goldwhistle',
        name: 'Sir Goldwhistle',
        role: 'Tax Architect',
        clan: 'Bosses',
        image: CHARACTER_IMAGES.bosses.grimshade, // Fallback
        description: "Loves numbers with a passion normally reserved for music or poetry.",
        stats: { mischief: 5, righteousness: 90, influence: 92, chaos: 10, style: 80, secrets: 85, sweetTooth: 70 },
        infoLines: [
            { label: "Circle of Influence", value: "Strategic Circle", colorClass: "text-purple-400" },
            { label: "Core Role", value: "Tax Architect", colorClass: "text-purple-400" },
            { label: "Personality Traits", value: "Precise, analytical, extremely organized" },
            { label: "Strategic Strength", value: "Designs highly efficient taxation systems and trade regulations" },
            { label: "Comic Weakness", value: "Cannot understand jokes and once tried to tax festival laughter" },
            { label: "Signature Habit", value: "Carries three ledgers everywhere he goes" },
            { label: "Public Reputation", value: "Merchants fear the sound of his quill scratching" },
            { label: "Dialogue Flavor", value: '"This is not a new tax… merely an enhancement."', colorClass: "text-amber-300 italic" }
        ]
    },
    {
        id: 'boss_grimshade',
        name: 'Lady Grimshade',
        role: 'Arcane Strategist',
        clan: 'Bosses',
        image: CHARACTER_IMAGES.bosses.grimshade,
        description: "Calm, observant, and deeply fascinated by the magical currents flowing beneath Candybrook.",
        stats: { mischief: 10, righteousness: 90, influence: 85, chaos: 20, style: 40, secrets: 98, sweetTooth: 15 },
        infoLines: [
            { label: "Circle of Influence", value: "Strategic Circle", colorClass: "text-purple-400" },
            { label: "Core Role", value: "Arcane Strategist", colorClass: "text-purple-400" },
            { label: "Personality Traits", value: "Mysterious, observant, quietly brilliant" },
            { label: "Strategic Strength", value: "Studies magical Aether currents that influence the province" },
            { label: "Comic Weakness", value: "Her experiments occasionally produce glowing smoke or floating furniture" },
            { label: "Signature Habit", value: "Collects strange magical ingredients like caramel fog" },
            { label: "Public Reputation", value: "Citizens blame every strange sky glow on her research" },
            { label: "Dialogue Flavor", value: '"Fascinating… this potion may stabilize the leyline… or briefly turn us into pigeons."', colorClass: "text-amber-300 italic" }
        ]
    },
    {
        id: 'boss_syntax',
        name: 'Professor Finley Syntax',
        role: 'Strategic Analyst',
        clan: 'Bosses',
        image: CHARACTER_IMAGES.bosses.pompelmoose, // Fallback
        description: "Brilliant, analytical, and slightly absent-minded, living most of his life inside complicated diagrams.",
        stats: { mischief: 5, righteousness: 80, influence: 75, chaos: 40, style: 30, secrets: 90, sweetTooth: 60 },
        infoLines: [
            { label: "Circle of Influence", value: "Strategic Circle", colorClass: "text-purple-400" },
            { label: "Core Role", value: "Strategic Analyst", colorClass: "text-purple-400" },
            { label: "Personality Traits", value: "Brilliant, absent-minded, analytical" },
            { label: "Strategic Strength", value: "Predicts trade trends and political risks with mathematical models" },
            { label: "Comic Weakness", value: "Often predicts disasters but forgets where he left the prediction notes" },
            { label: "Signature Habit", value: 'Starts every explanation with "Statistically speaking…"' },
            { label: "Public Reputation", value: "Known for predicting rebel pranks that still happen anyway" },
            { label: "Dialogue Flavor", value: '"Statistically speaking… this meeting will become confusing."', colorClass: "text-amber-300 italic" }
        ]
    },
    {
        id: 'boss_frill',
        name: 'Marshal Frill',
        role: 'Artillery Commander',
        clan: 'Bosses',
        image: CHARACTER_IMAGES.bosses.stefon, // Fallback
        description: "Enthusiastic, loud, and absolutely delighted by the existence of cannons.",
        stats: { mischief: 40, righteousness: 85, influence: 80, chaos: 60, style: 50, secrets: 30, sweetTooth: 45 },
        infoLines: [
            { label: "Circle of Influence", value: "Operations Circle", colorClass: "text-purple-400" },
            { label: "Core Role", value: "Artillery Commander", colorClass: "text-purple-400" },
            { label: "Personality Traits", value: "Enthusiastic, loud, patriotic" },
            { label: "Strategic Strength", value: "Oversees provincial defense systems and artillery" },
            { label: "Comic Weakness", value: "Slightly too enthusiastic about firing cannons for demonstrations" },
            { label: "Signature Habit", value: "Names every cannon and introduces them proudly" },
            { label: "Public Reputation", value: "Soldiers admire him, merchants fear surprise cannon salutes" },
            { label: "Dialogue Flavor", value: '"Allow me to introduce Lady Butterscotch the Third!"', colorClass: "text-amber-300 italic" }
        ]
    },
    {
        id: 'boss_qrill',
        name: 'Marshal Qrill',
        role: 'Field Warden',
        clan: 'Bosses',
        image: CHARACTER_IMAGES.bosses.cop, // Using cop image
        description: "Patient, suspicious, and treaty every barrel as a puzzle waiting to reveal its secrets.",
        stats: { mischief: 10, righteousness: 92, influence: 78, chaos: 15, style: 40, secrets: 85, sweetTooth: 30 },
        infoLines: [
            { label: "Circle of Influence", value: "Operations Circle", colorClass: "text-purple-400" },
            { label: "Core Role", value: "Field Warden", colorClass: "text-purple-400" },
            { label: "Personality Traits", value: "Suspicious, patient, meticulous" },
            { label: "Strategic Strength", value: "Controls checkpoints and border inspections across the province" },
            { label: "Comic Weakness", value: "Inspects wagons so thoroughly that travelers fall asleep waiting" },
            { label: "Signature Habit", value: "Carries a magnifying glass for inspecting barrels" },
            { label: "Public Reputation", value: 'Known for interrogating barrels labeled "Pickles"', colorClass: "" },
            { label: "Dialogue Flavor", value: '"Interesting… and these twelve barrels contain… only pickles?"', colorClass: "text-amber-300 italic" }
        ]
    },
    {
        id: 'boss_crumblewise',
        name: 'Crumblewise',
        role: 'Master Smith',
        clan: 'Bosses',
        image: CHARACTER_IMAGES.bosses.chief, // Fallback
        description: "A cheerful engineering genius who treats machinery the way artists treat paint.",
        stats: { mischief: 30, righteousness: 75, influence: 82, chaos: 50, style: 60, secrets: 45, sweetTooth: 55 },
        infoLines: [
            { label: "Circle of Influence", value: "Operations Circle", colorClass: "text-purple-400" },
            { label: "Core Role", value: "Master Smith", colorClass: "text-purple-400" },
            { label: "Personality Traits", value: "Inventive, practical, cheerful" },
            { label: "Strategic Strength", value: "Builds bridges, railways, fortifications, and machinery" },
            { label: "Comic Weakness", value: "Occasionally invents devices that accidentally launch objects" },
            { label: "Signature Habit", value: "Builds gadgets during meetings when bored" },
            { label: "Public Reputation", value: "Famous for the self-buttering toast machine incident" },
            { label: "Dialogue Flavor", value: '"What if we solved this problem with gears?"', colorClass: "text-amber-300 italic" }
        ]
    },
    {
        id: 'boss_flutterby',
        name: 'Lady Flutterby',
        role: 'Intelligence Matriarch',
        clan: 'Bosses',
        image: CHARACTER_IMAGES.bosses.matron, // Fallback
        description: "Graceful, charming, and shockingly perceptive. Collects secrets the way gardeners collect flowers.",
        stats: { mischief: 20, righteousness: 70, influence: 88, chaos: 25, style: 90, secrets: 99, sweetTooth: 80 },
        infoLines: [
            { label: "Circle of Influence", value: "Operations Circle", colorClass: "text-purple-400" },
            { label: "Core Role", value: "Intelligence Matriarch", colorClass: "text-purple-400" },
            { label: "Personality Traits", value: "Elegant, perceptive, socially brilliant" },
            { label: "Strategic Strength", value: "Runs the council’s spy network using gossip and observation" },
            { label: "Comic Weakness", value: "Sometimes reveals secrets so quickly it unnerves everyone" },
            { label: "Signature Habit", value: "Keeps notes on every conversation she hears" },
            { label: "Public Reputation", value: "Rumored to know what you will say before you say it" },
            { label: "Dialogue Flavor", value: '"Ah yes… you were about to mention the caravan delay."', colorClass: "text-amber-300 italic" }
        ]
    },
    {
        id: 'boss_fossoway',
        name: 'Dr. Stefon Fossoway',
        role: 'Chief Medical Advisor to the Grand Mayor',
        clan: 'Bosses',
        image: CHARACTER_IMAGES.bosses.stefon,
        description: "The illusion of intelligence in action. A man trusted by power but misunderstood by people—a walking encyclopedia with missing chapters on 'real life'.",
        stats: { mischief: 5, righteousness: 75, influence: 85, chaos: 5, style: 90, secrets: 45, sweetTooth: 55 },
        infoLines: [
            { label: "Council Position", value: "Chief Medical Advisor", colorClass: "text-purple-400" },
            { label: "Personality", value: "Academic, Overthinking, Technically Correct" },
            { label: "The Pompelmoose Power", value: "The Mayor loves him because he makes chaos feel 'organized' with complex words." },
            { label: "Dialogue Style", value: "Speaks like a book that forgot it's talking to humans." },
            { label: "Comic Weakness", value: "Half his advice is too complicated to execute; the other half arrives after the patient is better." },
            { label: "Villager Gossip", value: "'He once treated a fever after the fever got bored and left.'" },
            { label: "Signature Phrase", value: '"Your recovery is proceeding within acceptable theoretical margins."', colorClass: "text-amber-300 italic" }
        ],
        loreSections: [
            {
                title: "Council Dynamics",
                content: "Sits very close to Mayor Pompelmoose in council meetings. Speaks rarely… but when he does, everyone pretends to understand. The Mayor loves him because he sounds intelligent and uses complex words."
            },
            {
                title: "Practical Reality",
                content: "Half his advice is too complicated to execute; the other half arrives too late. Example: Suggesting a 14-page sneeze classification system instead of a actual cure for the Toffee Town sniffles."
            },
            {
                title: "Hidden Depth",
                content: "Under all the theory, he genuinely believes he is helping. He fears making mistakes, so he overcompensates with paperwork. Reality is unpredictable, but documentation is permanent."
            }
        ]
    },
    {
        id: 'boss_dottie',
        name: 'Dottie Ticktockwell',
        role: 'Chief Curfew Warden of the Province',
        clan: 'Bosses',
        image: CHARACTER_IMAGES.bosses.dottie,
        description: "The human embodiment of bedtime. Walks like a ticking clock and speaks like rules are carved into stone. 'Rest is not optional.'",
        stats: { mischief: 5, righteousness: 98, influence: 85, chaos: 0, style: 95, secrets: 55, sweetTooth: 45 },
        infoLines: [
            { label: "Official Title", value: "Chief Curfew Warden", colorClass: "text-purple-400" },
            { label: "Personality", value: "Strict, Lovable, Emotionally Efficient" },
            { label: "Comic Weakness", value: "She once fined a rooster for crowing 3 minutes early." },
            { label: "Signature Tool", value: "The Bell of Absolute Authority" },
            { label: "Public Reputation", value: "People panic when they hear her bell… but sleep better because of it." },
            { label: "The Mayor Mandate", value: "Maintains order when the Mayor's chaos spills over." },
            { label: "Signature Phrase", value: '"You are 6 minutes past acceptable existence. Go home."', colorClass: "text-amber-300 italic" }
        ],
        loreSections: [
            {
                title: "The Bell of Absolute Authority",
                content: "1 ring: 'Wrap it up.' 2 rings: 'You are late.' 3 rings: 'I am already disappointed.' Legend says her bell once stopped a festival mid-dance… and everyone just went home."
            },
            {
                title: "Schedule Obsession",
                content: "Has a timetable for everything: sleep, eating, thinking, and 'appropriate levels of joy'. She once sent the moon behind a cloud for being too bright."
            },
            {
                title: "Hidden Soft Side",
                content: "Under all that discipline, she guards the town's peace. She secretly tucks blankets over sleeping children but denies it if anyone asks. Rest is not a suggestion—it's a path to happiness."
            }
        ]
    }
];
