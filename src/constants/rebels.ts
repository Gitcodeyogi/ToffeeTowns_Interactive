import type { CharacterProfile } from './index';
import { CHARACTER_IMAGES } from './characterAssets';

export const REBELS_GUILD: CharacterProfile[] = [
    {
        id: 'rebel_whiskerton',
        name: 'Mastermind Whiskerton',
        role: 'Head of Resistance Strategy',
        clan: 'Rebels',
        image: CHARACTER_IMAGES.rebels.whiskerton,
        description: "The calm brain of the resistance. If the Mayor is a parade, Whiskerton is the man who already planned where the parade will trip. 'Checkmate is just patience... properly applied.'",
        stats: { mischief: 20, righteousness: 90, influence: 85, chaos: 10, style: 50, secrets: 95, sweetTooth: 40 },
        infoLines: [
            { label: "Resistance Role", value: "Head Strategist", colorClass: "text-emerald-400" },
            { label: "Personality", value: "Calm, Soft-spoken, Dangerously Ahead" },
            { label: "Strategic Style", value: "He doesn't rush decisions; he lets decisions walk into him." },
            { label: "The Tea Ritual", value: "Always holding a silver teacup; takes a sip before delivering devastatingly accurate conclusions." },
            { label: "Comedy of Order", value: "Surrounded by an 'Important Mess' of books that only he understands." },
            { label: "The Cat Advisor", value: "His cat sits on his shoulder like a silent, judging advisor." },
            { label: "Signature Phrase", value: '"You planned today. I planned your tomorrow."', colorClass: "text-amber-300 italic" }
        ],
        loreSections: [
            {
                title: "The Tea Strategist",
                content: "Whiskerton never raises his voice. He takes a sip of his tea, looks at the chaos, and says: 'Hmm... yes... this will fail in 2 days. Sugar?' His calm is his most terrifying weapon."
            },
            {
                title: "A Spicy Rivalry",
                content: "Once a spy and constant irritation to a young Pompelmoose, he now outplays the Mayor quietly. The Mayor laughs loudly to the crowds, but always checks the rooftops to see if Whiskerton is watching."
            },
            {
                title: "The Silent Duo",
                content: "He trusts Nella Nudgepot more than most adults. 'What did you hear?' he asks. 'What they didn't mean to say,' she replies. He smiles. The plan is already in motion."
            }
        ]
    },
    {
        id: 'rebel_chucklebop',
        name: 'Archer Chucklebop',
        role: 'Field Executor & Distraction Specialist',
        clan: 'Rebels',
        image: CHARACTER_IMAGES.rebels.chucklebop,
        description: "The spark that makes things happen. A prankster who turns every 'Oops' into a victory. 'If it made you laugh... it probably fixed something.'",
        stats: { mischief: 95, righteousness: 85, influence: 70, chaos: 85, style: 65, secrets: 30, sweetTooth: 99 },
        infoLines: [
            { label: "🎡 Rebel Role", value: "Field Executor & Distraction Specialist", colorClass: "text-emerald-400" },
            { label: "🎯 Persona", value: "The Accidental Genius Prankster", colorClass: "text-blue-300" },
            { label: "🐖 Animal Magnet", value: "Pigs and birds follow him everywhere." },
            { label: "🏹 Signature Gear", value: "Enchanted bow & messy ponytail energy." },
            { label: "⚡ The Secret", value: "His mistakes are actually perfectly timed successes." },
            { label: "🗣️ Signature Dialogue", value: '"It looks like a joke... until it works."', colorClass: "text-amber-300 italic" }
        ],
        loreSections: [
            {
                title: "🎯 The 'Accidental Genius'",
                content: "ChuckleBop throws a pebble at a bird, it misses, hits a bucket, which falls on a guard, who then accidentally unlocks the cell door. He just smiles and says, 'Meant to do that.' He looks lucky, but he's quietly very, very good."
            },
            {
                title: "🐖 Animal Magnet (Unplanned?)",
                content: "Animals follow him like he's their leader. Legend says a certain town pig once provided him with a distraction so perfect it felt scripted. 'The pig listens to him. That’s suspicious,' the villagers whisper."
            },
            {
                title: "🏹 Dynamic Duo with Nella",
                content: "He is the heart and movement to Nella’s ears and eyes. She whispers a secret, and he creates a glitter-bomb distraction to extract whatever is needed. He doesn't ask questions; he just moves."
            },
            {
                title: "🧠 Hidden in Plain Sight",
                content: "Understands situations faster than he admits. He uses humor to keep fear away and carries the weight of the rebellion lightly. He doesn't want to be a hero; he just doesn't walk away.",
                image: CHARACTER_IMAGES.rebels.chucklebop_alt
            }
        ],
        dna: {
            publicRole: 'Youth rebel figurehead and symbolic hope of ordinary citizens.',
            coreIntention: 'Restore fairness without cruelty by turning fear into courage.',
            signatureAction: 'Uses playful disruption, truth reveals, and morale-first leadership.',
            narrativeFunction: 'Hero catalyst who converts grievance into collective action.',
            pressurePoint: 'Carries responsibility of outcomes while staying compassionate.'
        }
    },
    {
        id: 'rebel_whimsley',
        name: 'Fisherman Whimsley',
        role: 'River Smuggler',
        clan: 'Rebels',
        image: CHARACTER_IMAGES.rebels.whimsley,
        description: "Keeper of quiet wisdom. Guided by dharma and the belief that doing the right thing matters most.",
        stats: { mischief: 65, righteousness: 92, influence: 65, chaos: 30, style: 40, secrets: 85, sweetTooth: 92 },
        infoLines: [
            { label: "Role", value: "River Smuggler & Keeper of Wisdom", colorClass: "text-emerald-400" },
            { label: "Personality", value: "Calm, patient, thoughtful" },
            { label: "Philosophy", value: "Protecting people is more important than winning arguments." },
            { label: "Habits & Quirks", value: "Mends fishing nets to help him think; speaks in riddles that contain hidden lessons." },
            { label: "Reputation", value: "Highly respected by common folk and even some Bosses." },
            { label: "Typical Dialogue", value: '"The river teaches patience. If you rush the current, you only end up wet."', colorClass: "text-amber-300 italic" }
        ]
    },
    {
        id: 'rebel_quickstep',
        name: 'Tibbin Quickstep',
        role: 'Messenger & Scout',
        clan: 'Rebels',
        image: CHARACTER_IMAGES.rebels.tibbin,
        description: "A whirlwind disguised as a small boy. Faster than a melting ice cream cone.",
        stats: { mischief: 85, righteousness: 70, influence: 40, chaos: 75, style: 55, secrets: 65, sweetTooth: 80 },
        infoLines: [
            { label: "Role", value: "Scout Master & Lightning Messenger", colorClass: "text-emerald-400" },
            { label: "Personality", value: "Restless, bright-eyed, magical sense of direction" },
            { label: "Speed", value: "Messenger who reaches destinations in minutes; uses laundry lines as shortcuts." },
            { label: "Habits & Quirks", value: "Cannot stand still; keeps tiny bells in his pockets that jingle when he runs." },
            { label: "Reputation", value: "Known as 'The Wind with Shoes.' Frustrates every Boss patrol." },
            { label: "Typical Dialogue", value: '"Message delivered! Where do I run next?"', colorClass: "text-amber-300 italic" }
        ]
    },
    {
        id: 'rebel_nudgepot',
        name: 'Nella Nudgepot',
        role: 'Field Recorder & Silent Executor',
        clan: 'Rebels',
        image: CHARACTER_IMAGES.rebels.nella,
        description: "The eyes and ears of the rebellion. While others were busy talking, Nella was busy keeping it. 'I don't interrupt... I remember.'",
        stats: { mischief: 30, righteousness: 85, influence: 50, chaos: 20, style: 45, secrets: 99, sweetTooth: 70 },
        infoLines: [
            { label: "🕵️ Resistance Role", value: "Field Intelligence & Silent Execution", colorClass: "text-emerald-400" },
            { label: "👂 Persona", value: "The Professional Listener (Sneaky-Funny)" },
            { label: "🐾 Stealth Level", value: "Nearly perfect... until she steps on a loose tile." },
            { label: "📓 The Asset", value: "A legendary notebook filled with shorthand symbols." },
            { label: "⚡ Mischief Duo", value: "Chucklebop creates the noise; Nella harvests the secrets." },
            { label: "🗣️ Signature Dialogue", value: '"You were speaking. I was saving it."', colorClass: "text-amber-300 italic" }
        ],
        loreSections: [
            {
                title: "👂 The Professional Listener",
                content: "Nella has the uncanny ability to become 'part of the wall.' She stands still so long that people forget she's there, accidentally revealing their darkest secrets. 'Too late,' she whispers as her pencil scratches the page."
            },
            {
                title: "🐾 Stealth... with Tiny Chaos",
                content: "She is the Rebels' best spy, but with a lovely flaw: she occasionally freezes like a statue the moment she's noticed, or drops a small coin at the worst time. People don't catch her—they just become unsettled by the silence."
            },
            {
                title: "📓 The Legendary Notebook",
                content: "Tucked in her side pouch is a book nobody has seen properly. It's filled with symbols only she and Whiskerton understand. Rumor says if she writes your name, something important is about to happen to you."
            },
            {
                title: "🤝 The Mischief Duo",
                content: "She is the perfect counterpart to Archer Chucklebop. He sets off a ridiculous glitter-bomb distraction, and in the three minutes of chaos, Nella successfully records four guard patrol schedules and a Mayor's secret snack list."
            }
        ]
    },
    {
        id: 'rebel_glowfern',
        name: 'Lanternella Glowfern',
        role: 'Light Guardian',
        clan: 'Rebels',
        image: CHARACTER_IMAGES.rebels.lanternella,
        description: "Night Watcher and Scout. Her lantern reveals more than just light; it disarms tense situations.",
        stats: { mischief: 40, righteousness: 95, influence: 60, chaos: 20, style: 75, secrets: 85, sweetTooth: 55 },
        infoLines: [
            { label: "Role", value: "Light Guardian & Night Scout", colorClass: "text-emerald-400" },
            { label: "Personality", value: "Kind, thoughtful, disarmingly calm" },
            { label: "Lantern", value: "Reveals hidden traps and magical traces; guided by the belief that light is patient." },
            { label: "Habits & Quirks", value: "Polishes her lantern like a companion; hums old country melodies that make the light brighter." },
            { label: "Rivalry", value: "Stubbornly debates curfew rules with Matron Stoutwood every evening." },
            { label: "Typical Dialogue", value: '"Stay close to the lantern. Darkness is clever, but light is patient."', colorClass: "text-amber-300 italic" }
        ]
    },
    {
        id: 'rebel_mcdrizzle',
        name: 'Bounce McDrizzle',
        role: 'Chaos Specialist',
        clan: 'Rebels',
        image: CHARACTER_IMAGES.rebels.bounce,
        description: "Chaos Specialist and Inventor of Unnecessary Genius. Where some see obstacles, he sees glitter cannon opportunities.",
        stats: { mischief: 98, righteousness: 50, influence: 45, chaos: 99, style: 80, secrets: 60, sweetTooth: 85 },
        infoLines: [
            { label: "Role", value: "Chaos Specialist & Distraction Engineer", colorClass: "text-emerald-400" },
            { label: "Personality", value: "High energy, creative, whirlwind of troublemaking" },
            { label: "Inventions", value: "Bouncing smoke bombs, spring boots, and mechanical pigeons for confusing patrols." },
            { label: "Habits & Quirks", value: "Satchel rattles loudly with springs and gears; sketches gadgets on everything." },
            { label: "Reputation", value: "Inventor of success stories; his devices are 'unnecessarily confusing mechanical nonsense'." },
            { label: "Typical Dialogue", value: '"Don’t worry, it only explodes a little."', colorClass: "text-amber-300 italic" }
        ]
    },
    {
        id: 'rebel_petalworth',
        name: 'Mrs. Petalworth',
        role: 'Velvet Spy',
        clan: 'Rebels',
        image: CHARACTER_IMAGES.rebels.petalworth,
        description: "Graceful, warm, and the 'quietest storm in Candybrook.' Her flower shop is a hub of intelligence.",
        stats: { mischief: 70, righteousness: 95, influence: 75, chaos: 30, style: 95, secrets: 98, sweetTooth: 75 },
        infoLines: [
            { label: "Role", value: "The Velvet Spy & Flower Merchant", colorClass: "text-emerald-400" },
            { label: "Personality", value: "Elegant, disarmingly polite, sharp-minded" },
            { label: "Intelligence", value: "Uses symbolic flower arrangements to signal messages to the Underground." },
            { label: "Habits & Quirks", value: "Murmurs to flowers ('behave yourself'); store smells so good guards forget to be suspicious." },
            { label: "Reputation", value: "Seen as harmless by Bosses; known as one of the most valuable rebel sources." },
            { label: "Typical Dialogue", value: '"Flowers hear everything… you simply have to listen carefully."', colorClass: "text-amber-300 italic" }
        ]
    },
    {
        id: 'rebel_rowanridge',
        name: 'Timber Rowanridge',
        role: 'Rebel Builder',
        clan: 'Rebels',
        image: CHARACTER_IMAGES.rebels.timber,
        description: "Rebel Builder and Pathmaster. Solves problems with tools, patience, and a very large hammer.",
        stats: { mischief: 15, righteousness: 85, influence: 65, chaos: 25, style: 40, secrets: 85, sweetTooth: 60 },
        infoLines: [
            { label: "Role", value: "Rebel Builder & Forest Pathmaster", colorClass: "text-emerald-400" },
            { label: "Personality", value: "Steady, practical, dry sense of humor" },
            { label: "Construction", value: "Builds hideouts with hidden doors; specializes in structures that look like dull storage spaces." },
            { label: "Habits & Quirks", value: "Taps doorways three times with his hammer for luck; listens to beams to know 'where the door should be'." },
            { label: "Reputation", value: "The quiet builder who makes daring missions possible." },
            { label: "Typical Dialogue", value: '"A good wall keeps secrets."', colorClass: "text-amber-300 italic" }
        ]
    },
    {
        id: 'rebel_banana',
        name: 'Beni Banana',
        role: 'Community Organizer',
        clan: 'Rebels',
        image: CHARACTER_IMAGES.rebels.beni,
        description: "Bridge between the rebellion and the countryside. Believes most problems can be solved with a basket of fruit.",
        stats: { mischief: 10, righteousness: 95, influence: 88, chaos: 15, style: 45, secrets: 50, sweetTooth: 95 },
        infoLines: [
            { label: "Role", value: "Community Organizer & Voice of the Orchards", colorClass: "text-emerald-400" },
            { label: "Personality", value: "Cheerful, warm-hearted, contagious laughter" },
            { label: "Organization", value: "Builds support networks in villages; ensures rebels have food, shelter, and safe rest zones." },
            { label: "Habits & Quirks", value: "Shares fruit during serious discussions; offering banana slices successfully ends arguments." },
            { label: "Reputation", value: "Highly respected by orchard workers; even Boss officials like him (and his fruit)." },
            { label: "Typical Dialogue", value: '"A hungry crowd is an unhappy crowd. Have a banana."', colorClass: "text-amber-300 italic" }
        ]
    },
    {
        id: 'rebel_sweetloop',
        name: 'Greta Sweetloop',
        role: 'Underground Courier',
        clan: 'Rebels',
        image: CHARACTER_IMAGES.rebels.greta,
        description: "The 'Pathfinder' of the Underground. Knows secret tunnels, abandoned staircases, and hidden market doors.",
        stats: { mischief: 50, righteousness: 80, influence: 60, chaos: 45, style: 55, secrets: 98, sweetTooth: 65 },
        infoLines: [
            { label: "Role", value: "Underground Courier & Master of Routes", colorClass: "text-emerald-400" },
            { label: "Personality", value: "Sharp, quick-thinking, quietly adventurous" },
            { label: "Organization", value: "Coordinates messages across towns; uses colored ribbons to organize routes without writing anything down." },
            { label: "Habits & Quirks", value: "Leaves tiny spiral marks on walls as personal route symbols; studies maps while drinking tea in crowded cafes." },
            { label: "Reputation", value: "Nearly impossible to catch; Boss reports describe her as 'a traveler who was not there'." },
            { label: "Typical Dialogue", value: '"There are always three ways through a city. Most people only notice one."', colorClass: "text-amber-300 italic" }
        ]
    },
    {
        id: 'rebel_merriweather',
        name: 'Dr. Marmalade Merriweather',
        role: 'Underground Physician',
        clan: 'Rebels',
        image: CHARACTER_IMAGES.rebels.merriweather,
        description: "The People's Physician. Relies on experience and careful listening to cure what ails Candybrook citizens.",
        stats: { mischief: 25, righteousness: 98, influence: 92, chaos: 30, style: 45, secrets: 85, sweetTooth: 80 },
        infoLines: [
            { label: "Role", value: "People's Physician & Healer", colorClass: "text-emerald-400" },
            { label: "Personality", value: "Gentle, cheerful, endlessly curious" },
            { label: "Medicine", value: "Expert in herbal remedies; treats injured rebels and sick villagers equally." },
            { label: "Habits & Quirks", value: " Clinic smells wonderful and alarming; writes notes like 'avoid arguing with stubborn relatives'." },
            { label: "Rivalry", value: "Successfully cures patients Dr. Fossoway could not help, to the Boss's frustration." },
            { label: "Typical Dialogue", value: '"A good cure begins with listening."', colorClass: "text-amber-300 italic" }
        ]
    }
];
