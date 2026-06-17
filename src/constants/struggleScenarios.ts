export type StruggleTrait = 'Strength' | 'Intellect' | 'Wit' | 'Agility' | 'Luck' | 'Magic';

export interface StruggleScenario {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    situation: string;
    image: string;
    emoji: string;
    requiredTrait: StruggleTrait;
    threshold: number;
    successMessage: string;
    failureMessage: string;
    twist?: string;
    labels: string[];
    town: {
        name: string;
        color: string;
        county: string;
        region: string;
    };
    category: 'Rebel Support' | 'Council Decree' | 'Neutral Crisis';
}

export interface StruggleLevel {
    level: number;
    title: string;
    variants: StruggleScenario[];
}

export const STRUGGLE_SCENARIOS: StruggleLevel[] = [
    {
        level: 1,
        title: "LEVEL 1: FUNNY LITTLE MISHAPS",
        variants: [
            {
                id: 'lvl1_toffee',
                title: "FIX THE GOLDEN CLOCK",
                subtitle: "Clock Stuck at Lunch Time",
                description: "Toffee Town's big clock is stuck at 12 noon! Everyone is eating lunch non-stop. Can you fix the clock before they run out of sweet rolls?",
                situation: "The big golden clock in the middle of Toffee Town is stuck! The hands won't move from 12 noon. Because of this, the townspeople think it is always lunch time! They have been eating sandwiches and sweet rolls all day long. The bakeries are running out of food, and everyone has a very full tummy. We need someone smart to climb up and fix the clock so time can move forward and people can take a nap!",
                image: 'clock_face_freeze.png',
                emoji: '🍬',
                requiredTrait: 'Wit',
                threshold: 60,
                labels: ["Frozen Clock", "Lunch Crisis", "Full Tummies"],
                town: { name: "Toffee Town", color: "text-amber-400", county: "ChocoBrook Province", region: "Capital City" },
                category: 'Neutral Crisis',
                successMessage: "Great job! You fixed the clock hands. Time is moving again, and the townspeople are finally taking a break from eating!",
                failureMessage: "Oh no! The clock is still stuck. The mayor just ordered another hundred sweet rolls. Try again!"
            },
            {
                id: 'lvl1_peppermint',
                title: "WARM THE ICE SLIDE",
                subtitle: "The Mint Slide Froze Solid",
                description: "Peppermint Peak's famous minty ice slide has frozen too hard! The penguins are stuck at the top. Can you warm it up and save the fun?",
                situation: "At the top of Peppermint Peak, the giant ice slide has frozen into a solid block of hard ice! Nobody can slide down, and a group of local penguins are stuck at the top, shivering and waiting for their turn. Someone needs to climb up there and carefully chip away the extra ice so the town can go back to having frosty fun!",
                image: 'peppermint_chime.png',
                emoji: '🌿',
                requiredTrait: 'Agility',
                threshold: 60,
                labels: ["Frozen Slide", "Penguin Rescue", "Slippery Fun"],
                town: { name: "Peppermint Peak", color: "text-cyan-400", county: "Creamwood County", region: "Chill & Hilly Region" },
                category: 'Neutral Crisis',
                successMessage: "Ice-cold brilliance! You chipped the extra ice away. The penguins are sliding again and having a blast!",
                failureMessage: "You slipped on an icicle and slid down the wrong path! The penguins are still waiting. Try again!"
            },
            {
                id: 'lvl1_sprinkle',
                title: "DIG OUT THE ICE CREAM",
                subtitle: "Statue Lost in Sprinkles",
                description: "A huge storm blew across Sprinkle Sands, burying the giant ice cream statue under tons of rainbow sprinkles! The crabs are lost. Can you dig it out?",
                situation: "A windy storm swept through Sprinkle Sands and dropped a mountain of rainbow sprinkles right on top of the town's giant ice cream statue! It is totally hidden under the colorful sugary sand. Even worse, three little tourist crabs are lost inside the sprinkle mountain. The lifeguards need your help to dig them out and save the beach!",
                image: 'sprinkle_hourglass.png',
                emoji: '🎉',
                requiredTrait: 'Strength',
                threshold: 60,
                labels: ["Sprinkle Storm", "Beach Rescue", "Sweet Digging"],
                town: { name: "Sprinkle Sands", color: "text-pink-400", county: "Honeywood County", region: "Colorful Sandy Beach" },
                category: 'Rebel Support',
                successMessage: "Awesome digging! You moved the sprinkle mountain and saved the crabs. The giant ice cream statue looks beautiful again!",
                failureMessage: "You sank into the deep sprinkle dune. The statue is still buried, and the crabs are building a sprinkle castle. Try again!"
            }
        ]
    },
    {
        level: 2,
        title: "LEVEL 2: SILLY ANIMAL TROUBLES",
        variants: [
            {
                id: 'lvl2_toffee',
                title: "CATCH THE CANDY CAT",
                subtitle: "Kitty on the Bakery Roof",
                description: "A giant, fluffy candy cat got scared of a balloon and ran up the bakery roof! Now it won't come down. Can you help get the kitty down safely?",
                situation: "A giant, fluffy candy cat was chasing a butterfly and accidentally got stuck on the very top of the Toffee Town Bakery roof! The poor kitty is meowing very loudly, and dropping candy wrappers on the people below. The town baker cannot bake his cakes because the cat keeps peeking down the chimney. We need a lucky and gentle hero to coax the kitty down with a warm bowl of milk!",
                image: 'candy_cat.png',
                emoji: '🐱',
                requiredTrait: 'Luck',
                threshold: 65,
                labels: ["Stuck Kitty", "Roof Rescue", "Meow Alert"],
                town: { name: "Toffee Town", color: "text-amber-400", county: "ChocoBrook Province", region: "Capital City" },
                category: 'Neutral Crisis',
                successMessage: "Purr-fect! You offered the warm milk and the candy cat jumped safely into your arms. The bakery is open again!",
                failureMessage: "Oh no, the cat got spooked and climbed even higher onto the weathervane! Try again!"
            },
            {
                id: 'lvl2_peppermint',
                title: "MOVE THE GIANT SNOWBALL",
                subtitle: "Town Gate Blocked",
                description: "The playful snow-bears rolled a snowball that got way too big! Now it is blocking the main gate of Peppermint Peak. Can you move it?",
                situation: "Some playful little snow-bears were having a snowball fight on the mountain, but one snowball rolled down the hill and got bigger, and bigger, and BIGGER! Now it is a giant ball of snow blocking the main gate of Peppermint Peak. Nobody can go in or out! We need a strong friend to help push the giant snowball out of the way before it freezes to the ground.",
                image: 'giant_snowball.png',
                emoji: '⛄',
                requiredTrait: 'Strength',
                threshold: 65,
                labels: ["Snow Block", "Push the Ball", "Bear Mischief"],
                town: { name: "Peppermint Peak", color: "text-cyan-400", county: "Creamwood County", region: "Chill & Hilly Region" },
                category: 'Neutral Crisis',
                successMessage: "Heave-ho! You gave it a mighty push and the giant snowball rolled away harmlessly. The town gate is open!",
                failureMessage: "The snowball is too heavy and slippery! You just slid right off it. Try again with more strength!"
            },
            {
                id: 'lvl2_sprinkle',
                title: "CATCH THE RUNAWAY BEACH BALL",
                subtitle: "Bouncing Through Town",
                description: "A super giant beach ball blew away in the wind and is bouncing all over Sprinkle Sands, knocking over umbrellas! Can you catch it?",
                situation: "The mayor bought a super giant beach ball for the summer festival, but a big gust of wind blew it away! Now the massive bouncy ball is rolling all over Sprinkle Sands, knocking down beach umbrellas, splashing in the pools, and causing silly chaos everywhere. We need a very fast and agile hero to chase it down and grab the string before it squishes the sandcastles!",
                image: 'runaway_beachball.png',
                emoji: '🏖️',
                requiredTrait: 'Agility',
                threshold: 65,
                labels: ["Bouncy Chaos", "Fast Chase", "Save the Umbrellas"],
                town: { name: "Sprinkle Sands", color: "text-pink-400", county: "Honeywood County", region: "Colorful Sandy Beach" },
                category: 'Neutral Crisis',
                successMessage: "Great catch! You ran super fast and grabbed the string. The beach ball is safe, and the umbrellas are back up!",
                failureMessage: "Boing! The giant beach ball bounced right over your head and squished another sandcastle. Catch it next time!"
            }
        ]
    },
    {
        level: 3,
        title: "LEVEL 3: SWEET MESSES",
        variants: [
            {
                id: 'lvl3_toffee',
                title: "STOP THE CHOCOLATE FOUNTAIN",
                subtitle: "Chocolate is Spraying Everywhere",
                description: "The main chocolate fountain is broken and spraying yummy chocolate all over the streets! It's very messy. Can you fix the pipes?",
                situation: "The town's famous chocolate fountain has gone crazy! A pipe broke inside, and now it is spraying warm, yummy chocolate all over the town square. Everything is covered in chocolate—the benches, the trees, and even the mayor's hat! It's a very tasty mess, but everyone is slipping and sliding. We need someone smart to figure out the puzzle of the pipes and turn the fountain off!",
                image: 'chocolate_fountain.png',
                emoji: '🍫',
                requiredTrait: 'Intellect',
                threshold: 70,
                labels: ["Chocolate Spray", "Sticky Mess", "Pipe Puzzle"],
                town: { name: "Toffee Town", color: "text-amber-400", county: "ChocoBrook Province", region: "Capital City" },
                category: 'Neutral Crisis',
                successMessage: "Smart thinking! You turned the right valves and fixed the pipe. The fountain is back to normal, but everyone is still eating chocolate off the benches!",
                failureMessage: "Oops! You turned the wrong valve and the chocolate sprayed even higher! Now you are covered in chocolate too. Try again!"
            },
            {
                id: 'lvl3_peppermint',
                title: "UNPLUG THE HOT COCOA GEYSER",
                subtitle: "Too Many Marshmallows",
                description: "Someone dropped way too many giant marshmallows into the hot cocoa geyser, and now it's totally plugged up! Can you clear it?",
                situation: "The natural Hot Cocoa Geyser in Peppermint Peak is a wonderful place to warm up, but someone accidentally dropped a whole bag of giant, puffy marshmallows into it! The marshmallows melted together and created a huge, squishy plug. The hot cocoa can't bubble up, and the pressure is building. We need a clever hero to find a way to unplug the sweet geyser safely!",
                image: 'cocoa_geyser.png',
                emoji: '☕',
                requiredTrait: 'Wit',
                threshold: 70,
                labels: ["Marshmallow Plug", "Hot Cocoa", "Squishy Problem"],
                town: { name: "Peppermint Peak", color: "text-cyan-400", county: "Creamwood County", region: "Chill & Hilly Region" },
                category: 'Neutral Crisis',
                successMessage: "Brilliant idea! You used a long stick to poke a hole in the marshmallow plug. The hot cocoa is bubbling happily again!",
                failureMessage: "The marshmallows expanded and became even stickier! You couldn't pull the plug out. Try a different idea!"
            },
            {
                id: 'lvl3_sprinkle',
                title: "SAVE THE ROYAL SANDCASTLE",
                subtitle: "The Waves are Too Close",
                description: "The kids built the biggest, most beautiful sandcastle ever, but the tide is coming in fast! Can you build a wall to save it?",
                situation: "The children of Sprinkle Sands worked all morning to build the most beautiful, giant Royal Sandcastle! It has towers, a moat, and little sprinkle flags. But oh no! The ocean tide is coming in much faster than expected, and the waves are getting dangerously close to melting the castle. We need someone strong and fast to help build a thick wall of sand to block the water!",
                image: 'sandcastle_save.png',
                emoji: '🏰',
                requiredTrait: 'Strength',
                threshold: 70,
                labels: ["Ocean Waves", "Build a Wall", "Save the Castle"],
                town: { name: "Sprinkle Sands", color: "text-pink-400", county: "Honeywood County", region: "Colorful Sandy Beach" },
                category: 'Neutral Crisis',
                successMessage: "Amazing strength! You built a huge sand wall just in time. The waves crashed against the wall, and the Royal Sandcastle is safe!",
                failureMessage: "A big wave sneaked past you and washed away the front gate of the castle! Quick, try again before the whole castle is gone!"
            }
        ]
    },
    {
        level: 4,
        title: "LEVEL 4: TOWN WIDE SURPRISES",
        variants: [
            {
                id: 'lvl4_toffee',
                title: "CATCH THE BALLOON HOUSE",
                subtitle: "The Mayor's House is Flying",
                description: "Too many balloons were tied to the Mayor's house for his birthday party, and now it's floating away into the sky! Can you pull it down?",
                situation: "It's the Mayor's birthday! To celebrate, the town tied thousands of colorful balloons to the roof of his house. But they tied too many! The house has lifted off the ground and is slowly floating away into the sky! The Mayor is waving from his window, looking very surprised. We need a very agile hero to jump up, grab the dangling rope, and pull the house safely back to the ground!",
                image: 'flying_house.png',
                emoji: '🎈',
                requiredTrait: 'Agility',
                threshold: 75,
                labels: ["Flying House", "Pull the Rope", "Birthday Surprise"],
                town: { name: "Toffee Town", color: "text-amber-400", county: "ChocoBrook Province", region: "Capital City" },
                category: 'Neutral Crisis',
                successMessage: "Incredible jump! You grabbed the rope, tied it to a strong tree, and gently pulled the house down. The Mayor says thank you!",
                failureMessage: "You missed the rope, and the house floated a little higher! The Mayor is starting to enjoy the view, but we need to try again!"
            },
            {
                id: 'lvl4_peppermint',
                title: "UNTANGLE THE SLED RACE",
                subtitle: "The Great Sled Pile-Up",
                description: "During the big sled race, everyone crashed at the finish line! Now there is a giant pile of tangled sleds and dizzy racers. Can you untangle them?",
                situation: "The annual Peppermint Peak Sled Race was super exciting this year, maybe too exciting! All the racers crossed the finish line at the exact same time and crashed into a giant, tangled pile of colorful sleds, ropes, and very dizzy racers! Nobody knows whose sled is whose, and everyone is stuck together. We need a smart thinker to carefully untangle the mess without pulling the wrong rope!",
                image: 'sled_pileup.png',
                emoji: '🛷',
                requiredTrait: 'Intellect',
                threshold: 75,
                labels: ["Tangled Ropes", "Dizzy Racers", "Puzzle Time"],
                town: { name: "Peppermint Peak", color: "text-cyan-400", county: "Creamwood County", region: "Chill & Hilly Region" },
                category: 'Neutral Crisis',
                successMessage: "Genius! You figured out the puzzle and untangled every single rope. The racers are free and ready for hot cocoa!",
                failureMessage: "You pulled the red rope instead of the blue one, and the knot got even tighter! The racers are still dizzy. Try again!"
            },
            {
                id: 'lvl4_sprinkle',
                title: "SHOO THE SNACK SEAGULLS",
                subtitle: "The Great Beach Snack Attack",
                description: "A huge flock of cheeky seagulls has taken over the beach snack bar! They are eating all the chips. Can you shoo them away with magic?",
                situation: "Oh dear! A massive flock of very cheeky seagulls has swooped down and completely taken over the Sprinkle Sands snack bar! They are eating all the potato chips, stealing the ice cream cones, and making a huge mess. They are not scared of loud noises or waving arms. We need someone with a little bit of sparkly Magic to gently float them away back to the ocean!",
                image: 'seagull_snack.png',
                emoji: '🐦',
                requiredTrait: 'Magic',
                threshold: 75,
                labels: ["Cheeky Birds", "Save the Snacks", "Magic Sparkles"],
                town: { name: "Sprinkle Sands", color: "text-pink-400", county: "Honeywood County", region: "Colorful Sandy Beach" },
                category: 'Neutral Crisis',
                successMessage: "Ta-da! With a wave of your sparkly magic wand, the seagulls happily flew back to the ocean. The snacks are safe!",
                failureMessage: "Your magic fizzled, and the seagulls just laughed! One of them stole a hot dog. You must focus your magic and try again!"
            }
        ]
    },
    {
        level: 5,
        title: "LEVEL 5: THE GRAND HILARIOUS FINALE",
        variants: [
            {
                id: 'lvl5_toffee',
                title: "CALM THE TOFFEE MONSTER",
                subtitle: "A Giant Blob Wants a Hug",
                description: "A giant blob of sweet toffee magically came to life, and it just wants to hug everyone! But it's too sticky! Can you calm it down?",
                situation: "In the middle of the Toffee Town candy factory, a magical spark hit a giant vat of toffee, bringing it to life! Now, a huge, friendly Toffee Monster is roaming the streets. It isn't mean, it just wants to give everyone a big, sticky hug! But if it hugs you, you'll be stuck in candy all day! We need a lucky hero to find the monster's sweet spot and tickle it until it falls asleep.",
                image: 'toffee_monster.png',
                emoji: '👹',
                requiredTrait: 'Luck',
                threshold: 80,
                labels: ["Sticky Hugs", "Tickle Time", "Friendly Blob"],
                town: { name: "Toffee Town", color: "text-amber-400", county: "ChocoBrook Province", region: "Capital City" },
                category: 'Neutral Crisis',
                successMessage: "How lucky! You found the exact spot to tickle. The Toffee Monster laughed so hard it turned back into a normal puddle of candy!",
                failureMessage: "Oh no! The Toffee Monster hugged you! Now you are stuck in a giant, sweet, sticky mess. Wiggle out and try again!"
            },
            {
                id: 'lvl5_peppermint',
                title: "HELP THE YETI'S TUMMY ACHE",
                subtitle: "He Ate Too Much Snow",
                description: "A friendly, giant Yeti ate way too much yellow snow and now has a terrible tummy ache! He is blocking the road. Can you help him feel better?",
                situation: "A friendly, giant Yeti came down from the high mountains to visit Peppermint Peak. But he was so hungry that he ate a whole pile of lemon-flavored snow cones very fast, and now he has a terrible tummy ache! He is lying right in the middle of the main road, groaning and holding his belly. Nobody can get past him. We need someone smart to mix a giant cup of soothing mint tea for him!",
                image: 'yeti_tummy.png',
                emoji: '🐾',
                requiredTrait: 'Wit',
                threshold: 80,
                labels: ["Giant Yeti", "Tummy Ache", "Make Mint Tea"],
                town: { name: "Peppermint Peak", color: "text-cyan-400", county: "Creamwood County", region: "Chill & Hilly Region" },
                category: 'Neutral Crisis',
                successMessage: "Brilliant recipe! The Yeti drank your giant cup of mint tea, burped loudly, and felt much better. The road is clear!",
                failureMessage: "You mixed the wrong herbs, and the Yeti's tummy grumbled even louder! He is still blocking the road. Try another recipe!"
            },
            {
                id: 'lvl5_sprinkle',
                title: "STOP THE CRAB DANCE PARTY",
                subtitle: "The Giant Crab is Dancing",
                description: "A giant, musical crab heard a fun song and won't stop dancing on the beach! His dancing is causing little earthquakes. Can you stop the music?",
                situation: "Someone left a radio playing a very catchy song on the beach. A giant, ancient sea crab heard it, came out of the water, and started dancing! The crab loves the music, but his heavy dancing feet are causing mini-earthquakes that are making all the beach umbrellas fall down. He won't stop dancing until the music changes. We need an agile hero to sneak under his dancing legs and turn off the radio!",
                image: 'dancing_crab.png',
                emoji: '🦀',
                requiredTrait: 'Agility',
                threshold: 80,
                labels: ["Dancing Crab", "Mini Earthquakes", "Turn Off Radio"],
                town: { name: "Sprinkle Sands", color: "text-pink-400", county: "Honeywood County", region: "Colorful Sandy Beach" },
                category: 'Neutral Crisis',
                successMessage: "Great moves! You dodged the giant dancing claws, reached the radio, and turned it off. The crab bowed and went back to the ocean!",
                failureMessage: "The crab accidentally stepped near you, and the mini-earthquake made you fall over! The dance party continues. Try again!"
            }
        ]
    }
];
