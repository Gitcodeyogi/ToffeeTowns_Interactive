import type { CharacterTalk } from '../components/TownTalkModal';

export const TALK_CHARACTERS: CharacterTalk[] = [
  {
    id: 'goldwhistle',
    name: 'Sir Goldwhistle',
    role: 'Tax Auditor',
    avatar: '/Characters/Char Cards/Nico_Whistle.png',
    color: 'from-yellow-500 to-amber-600',
    lovedItems: ['parchment'],
    dislikedItems: ['mucus'],
    loveReaction: "Meticulous ledger sheets. Extremely neat spacing. This will do nicely for today's audits.",
    normalReaction: "I suppose this holds minor financial value. It will be recorded in my ledger book.",
    greeting: "Identify yourself, Yogesh! I am Sir Goldwhistle, senior auditor of Cocoawood County. Ensure your financial ledger is prepared for inspections.",
    responses: {
      secret: [
        "The town treasury has a triple-secured vault behind the mayor's chambers. I hold the golden key.",
        "I audit every single cocoa coin relocation request to ensure compliance with county bylaws."
      ],
      joke: [
        "Why don't auditors play hide and seek? Because good luck hiding when we examine your accounts!",
        "What do you call a tax collector who doesn't use a whistle? Quiet, but still very expensive."
      ],
      chore: [
        "Our daily dispatches must be verified! Complete the Baker's ledger or the Clinic disinfectant audits immediately!",
        "Housing rent must be settled! Do not let your daily relocation dues expire!"
      ],
      default: [
        "Time is money, and money is coins. Run along now, I have ledgers to audit.",
        "Every citizen, including you, Yogesh, must contribute their fair share of Cocoa Coins for harbor dredging."
      ]
    },
    keywords: [
      {
        keys: ['tax', 'coin', 'audit', 'ledger', 'coins'],
        replies: [
          "Dues fund our elevated walkways. Any evasion is a serious county offense!",
          "Make sure you carry at least 15 coins if you plan to relocate towns!"
        ]
      }
    ]
  },
  {
    id: 'pipkin',
    name: 'Pipkin Nutterby',
    role: 'Prankster & Adventurer',
    avatar: '/Assets/Ganache Grove/Characters/Pipkin_Nutterby_townsfolk.png',
    color: 'from-amber-500 to-orange-600',
    lovedItems: ['bolts', 'mucus'],
    dislikedItems: ['parchment'],
    loveReaction: "Whoa! Perfect slingshot ammo! Sir Goldwhistle's audit teapots won't stand a chance!",
    normalReaction: "Awesome, thanks! I can probably find a mischievous way to use this!",
    greeting: "Oh, hi! Are you here to help me load pinecones into the tax collector's teapot? Sir Goldwhistle will be so surprised!",
    responses: {
      secret: [
        "I found a secret hatch under the floorboards in the old forest belfry! It smells like old cinnamon rolls.",
        "Don't tell Sir Goldwhistle, but I accidentally buried his favorite golden auditing ledger in the lawn shrubbery!"
      ],
      joke: [
        "Why did the marshmallow cross the river? To get to the other chocolate slide! Haha!",
        "What do you call a happy gnome? A chuckle-puffed marshmallow!"
      ],
      chore: [
        "The garden gate latch is super loose! I think if you shake it three times, it makes a funny squeak. You should go fix it!",
        "Mrs. Petalworth's mailbox is overflowing with secret letters. I think one of them has a cookie inside... maybe?"
      ],
      default: [
        "Wait, did you hear that? I think Chucklebop is calling my name! I gotta go check my slingshot!",
        "If you mix molasses with sugar flowers, does it explode? Only one way to find out!"
      ]
    },
    keywords: [
      {
        keys: ['prank', 'mischief', 'slingshot', 'teapot'],
        replies: [
          "I'm planning to launch sugar lilies into the town square tonight! Keep it a secret!",
          "My slingshot is calibrated for maximum range! Want to test it on Sir Goldwhistle's ledger?"
        ]
      },
      {
        keys: ['goldwhistle', 'tax', 'auditor'],
        replies: [
          "He's so stuffy! He wants to tax my slingshot! Can you believe it?",
          "Goldwhistle needs a bucket of molasses poured on his velvet suit!"
        ]
      }
    ]
  },
  {
    id: 'winston',
    name: 'Captain Winston Butterfield',
    role: 'Town Explorer & Detective',
    avatar: '/Characters/Char Cards/Hugo_Glass.png',
    color: 'from-blue-500 to-indigo-600',
    lovedItems: ['ink', 'parchment'],
    dislikedItems: ['mucus'],
    loveReaction: "Excellent clues and logging gear! This will help trace the missing sweetbread trails!",
    normalReaction: "A fine cargo addition! I will secure this in the investigation deck.",
    greeting: "Ahoy! Detective Winston Butterfield here. I'm investigating suspicious activities near the old forest docks today.",
    responses: {
      secret: [
        "They say the midnight tides carry glowing blue algae that can cure any spore cough.",
        "I secretly keep a jar of imported Peppermint syrup under my berth. Don't tell the tax collector!"
      ],
      joke: [
        "What is a pirate's favorite county? Cocoa-wood, of course! Ayyy!",
        "Why did the cargo boat sink? It had too many heavy chocolate bars on board!"
      ],
      chore: [
        "The express cargo pods at the wharf need scheduling. Go check the Town Map and see if they need transit help!",
        "Sir Goldwhistle's harbor accounts have a minor discrepancy. Check today's dispatches!"
      ],
      default: [
        "Keep your sails high and your cocoa warm, traveller!",
        "The river is running fast today. Make sure your wagon wheels are locked at the wharf!"
      ]
    },
    keywords: [
      {
        keys: ['harbor', 'wharf', 'boat', 'cargo', 'shipping'],
        replies: [
          "Mossberry Wharf is the beating heart of Ganache Grove commerce! Keep those pods moving!",
          "Our transport wagons carry the finest cocoa paste in the land!"
        ]
      }
    ]
  },
  {
    id: 'percival',
    name: 'Percival Tinkersprocket',
    role: 'Town Head',
    avatar: '/Characters/Char Cards/Hugo_Glass.png',
    color: 'from-yellow-600 to-orange-600',
    lovedItems: ['bolts', 'wood'],
    dislikedItems: ['moss'],
    loveReaction: "Splendid raw materials! These will secure the town square clockwork structures.",
    normalReaction: "A fine resource donation. Every piece helps govern the townsfolk smoothly.",
    greeting: "Greetings, Yogesh. As your Town Head, I oversee all community structures and civic regulations. How can I serve the town today?",
    responses: {
      secret: [
        "The city archive contains blueprints of the original elevated walkway trusses from the first settlers.",
        "Between you and me, running the council meetings requires twice as much coffee as I initially estimated."
      ],
      joke: [
        "Why did the Town Head go to the bakery? To ensure all pastry budgets were rising appropriately!",
        "How do you know a meeting is going well? When the clockwork timer doesn't break down halfway through."
      ],
      chore: [
        "We need to audit the town square decorations. Check if the window flower boxes are watered!",
        "Please ensure the community message boards are clear of outdated event flyers."
      ],
      default: [
        "Order and organization are the foundations of Toffee Towns.",
        "Remember to register your census address. It keeps our monorail funding in order."
      ]
    },
    keywords: [
      {
        keys: ['council', 'rule', 'town', 'head', 'mayor'],
        replies: [
          "My duty is to ensure you and every resident has a cozy home and stable trades.",
          "We are planning to expand the local warehouse limits for you and other active citizens soon."
        ]
      }
    ]
  },
  {
    id: 'rowan',
    name: 'Rowan Thistle',
    role: 'Builder Apprentice',
    avatar: '/Characters/Char Cards/Milo_Spark.png',
    color: 'from-emerald-500 to-teal-600',
    lovedItems: ['wood'],
    dislikedItems: ['mucus'],
    loveReaction: "Ah, premium timber! Perfect for the library trusses. Thank you, Yogesh!",
    normalReaction: "Appreciated! A good craftsman can find a use for almost any supply.",
    greeting: "Greetings, Yogesh! I'm currently reviewing the calculations for the elevated walkway. Can I help you with some carpentry?",
    responses: {
      secret: [
        "The senior builders say there's a hidden water gate in the ChocoBrook bypass that hasn't been opened since Year 100.",
        "I might have used a bit of extra sugar-sap glue on the library shelves... they are never coming down!"
      ],
      joke: [
        "Why did the builder go to school? To get a little more mortar-vation! Get it?",
        "How many apprentices does it take to fix a bridge? Six, but only if one holds the blueprint upside down."
      ],
      chore: [
        "The eternal hearth is drawing molasses smoke. We need to calculate the draft velocity in the living room!",
        "The copper kettles in the kitchen are caked in sticky molasses. A good salt-and-lemon scrub will do wonders!"
      ],
      default: [
        "Fascinating! A double-layered truss design would double the load capacity of our boardwalks.",
        "Remember, a good builder always measures twice and cuts once. Especially when working with expensive chocolate logs!"
      ]
    },
    keywords: [
      {
        keys: ['bridge', 'build', 'walkway', 'wood'],
        replies: [
          "The walkways keep us safe from the damp root floor. We must maintain them daily.",
          "My dream is to build a massive bridge spanning the entire Ganache River!"
        ]
      }
    ]
  },
  {
    id: 'sheriff',
    name: 'Sheriff Aldous Bramfield',
    role: 'Town Sheriff',
    avatar: '/Characters/Char Cards/Zara_Quill.png',
    color: 'from-pink-500 to-rose-600',
    lovedItems: ['bolts'],
    dislikedItems: ['ink'],
    loveReaction: "Very useful civic supply! This will secure our local holding cell gate locks.",
    normalReaction: "I will log this into the town registry evidence locker. Thank you.",
    greeting: "Halt! State your name and business in Ganache Grove. I'm Sheriff Aldous Bramfield, keeping these lanes safe from sugar thieves!",
    responses: {
      secret: [
        "I'm tracking a mysterious squirrel cartel that has been hoarding hemp ropes from the wharf.",
        "Sir Goldwhistle thinks I don't know about his secret stash of Peppermint cream, but the law sees everything!"
      ],
      joke: [
        "Why did the jellybean go to jail? Because it was a little candy-crook!",
        "What do you call a policeman who loves hot cocoa? A sheriff with good taste!"
      ],
      chore: [
        "We've had reports of wild creeping wood-parasites choking the lawn fences. Grab some herbicide and clear them out!",
        "A suspicious character was spotted near the old forest belfry. Keep an eye out when exploring the Town Map!"
      ],
      default: [
        "Stay alert, stay safe, and don't take any candy from suspicious gnomes!",
        "Justice is sweet, but the law is tough! Remember to register your census form!"
      ]
    },
    keywords: [
      {
        keys: ['law', 'sheriff', 'arrest', 'crime', 'jail'],
        replies: [
          "No crime is too small for Sheriff Aldous Bramfield! I once arrested a squirrel for petty pinecone theft!",
          "Our lockup is cozy, but you don't want to spend the night there! Keep your passport stamped!"
        ]
      }
    ]
  },
  {
    id: 'frill',
    name: 'Marshal Frill',
    role: 'Sheriff Deputy',
    avatar: '/characters/boss_Marshal_-_Frill.png',
    color: 'from-slate-600 to-zinc-700',
    lovedItems: ['bolts', 'parchment'],
    dislikedItems: ['mucus'],
    loveReaction: "Great! I can write more curfew compliance citations with these clean sheets!",
    normalReaction: "Officer ticket logs recorded. Carry on, Yogesh. Thank you for your support!",
    greeting: "Hello, Yogesh! Marshal Frill on duty. I'm here to ensure all our paths are safe, clean, and cozy. How can I help you today?",
    responses: {
      secret: [
        "Someone keeps swapping the mayor's speech notes with recipes for caramel sauce. I suspect the prankster, but let's keep it friendly!",
        "Curfew hours are designed to keep everyone safe and sound under the canopy!"
      ],
      joke: [
        "Why did the deputy who falls into molasses? A sticky situation for the police department!",
        "Why did the ticket book cross the road? To fine the chicken on the other side."
      ],
      chore: [
        "If you have time, could you help sweep the leaves blocking the monorail stairs? It makes walks much safer!",
        "Please let me know if you see any unusual activities near the town gate so I can help."
      ],
      default: [
        "Keep safe and enjoy your day, Yogesh.",
        "A quiet, peaceful town is a happy town. Let me know if you need anything, Yogesh!"
      ]
    },
    keywords: [
      {
        keys: ['ticket', 'fine', 'marshal', 'deputy'],
        replies: [
          "I have written 45 tickets this week. That is a personal record!",
          "Sheriff Bramfield is too soft. I believe in strict enforcement."
        ]
      }
    ]
  },
  {
    id: 'qrill',
    name: 'Marshal Qrill',
    role: 'Sheriff Deputy',
    avatar: '/characters/boss_Marshal_-_Qrill.png',
    color: 'from-slate-600 to-zinc-700',
    lovedItems: ['ink', 'bolts'],
    dislikedItems: ['moss'],
    loveReaction: "Excellent. Precision materials for calibrating target locks and fence defenses.",
    normalReaction: "Duly noted in the strategic security log. Thank you for your help, Yogesh.",
    greeting: "Hello, Yogesh. Marshal Qrill here. I'm analyzing our town path layouts to make your walks as safe and pleasant as possible. What can I do for you today?",
    responses: {
      secret: [
        "We are installing mechanical barricades around the treasury vaults. The trigger is highly sensitive and precisely calibrated for safety.",
        "The sheriff's office keeps an archive of all confiscated prank gear to keep things organized."
      ],
      joke: [
        "How does a tactical deputy drink tea? With extreme situational awareness!",
        "Why did the compass go to jail? Because it was caught plotting directions."
      ],
      chore: [
        "Would you be able to help verify the alignment coordinates of the monorail signals? That would be of great assistance!",
        "Could you check the locks on the old forest belfry to ensure they are secure?"
      ],
      default: [
        "Safe travels on the pathways, Yogesh.",
        "Vigilance and community cooperation are the keys to a cozy home. Have a wonderful day!"
      ]
    },
    keywords: [
      {
        keys: ['deputy', 'patrol', 'tactics', 'security'],
        replies: [
          "I plan patrol routes with strict geometric efficiency.",
          "Our security locks are impenetrable to average forest creatures."
        ]
      }
    ]
  },
  {
    id: 'petalworth',
    name: 'Mrs. Petalworth',
    role: 'Flower Merchant',
    avatar: '/characters/boss_FlowerVendor-Mrs._petalworth.png',
    color: 'from-red-400 to-pink-600',
    lovedItems: ['moss'],
    dislikedItems: ['bolts'],
    loveReaction: "Oh, this moss will keep the garden soil so moist! Bless you, dear heart!",
    normalReaction: "Oh, thank you, sweet Yogesh! I can always appreciate a helpful token.",
    greeting: "Hello, dear heart! The sugar lilies are blooming beautifully today. Care to purchase a fresh bouquet, or perhaps exchange a bit of local news?",
    responses: {
      secret: [
        "If you wrap a sugar lily stems in wet vellum, it preserves the scent for weeks.",
        "Sometimes local message couriers leave encoded letters in the bottom of my garden buckets."
      ],
      joke: [
        "What did the flower say to the bee? Stop bugging me, honey!",
        "Why did the orchid go to the party? Because it was a wild bloomer!"
      ],
      chore: [
        "The garden orchids require watering. Check your balcony plants when you get back to your cottage!",
        "Lawn weeds have creeping brambles. We must clean them to preserve the floral pathways!"
      ],
      default: [
        "A bit of water and sunshine makes all of Ganache Grove smile.",
        "The forest rangers are busy today. I hope they find time to rest."
      ]
    },
    keywords: [
      {
        keys: ['flower', 'orchid', 'lily', 'garden'],
        replies: [
          "The soil in Ganache Grove is enriched with sweet syrup, which is why our flowers grow so large!",
          "I grow special glowing lilies that shine in the dark forest canopy."
        ]
      }
    ]
  },
  {
    id: 'maribel',
    name: 'Maribel Nutterby',
    role: 'Seamstress',
    avatar: '/Characters/Char Cards/Bella_Daisy.png',
    color: 'from-purple-400 to-pink-500',
    lovedItems: ['parchment', 'wood'],
    dislikedItems: ['bolts'],
    loveReaction: "Splendid fabric liners and wood rollers! My thread spindles will run beautifully.",
    normalReaction: "Thank you, dear. A good sewing kit can always use clean materials.",
    greeting: "Hello, dear. I'm sewing a new velvet lining for Winston's hat. Do you need something mended?",
    responses: {
      secret: [
        "Pipkin has a secret box under his bed filled with shiny buttons. He thinks I haven't noticed.",
        "The velvet ribbon I use for the mayor's sashes is imported from the sweet peaks."
      ],
      joke: [
        "Why did the needle get mad at the thread? Because it kept pulling its leg!",
        "What do you call a happy sewing machine? A seamstress's dream!"
      ],
      chore: [
        "I need a wooden rod to hold my new lace rolls. Could you find some timber?",
        "Please check if Pipkin has cleaned his satchel recently. It gets so cluttered!"
      ],
      default: [
        "Keep your garments clean and your spirits high, dear.",
        "A single neat stitch can save an entire velvet sleeve from unraveling."
      ]
    },
    keywords: [
      {
        keys: ['sewing', 'needle', 'thread', 'fabric'],
        replies: [
          "I can mend almost any tear, from wool cloaks to monorail seat cushions.",
          "Pipkin's trousers require patching nearly every single day!"
        ]
      }
    ]
  },
  {
    id: 'page',
    name: 'Miss Page Bumblewick',
    role: 'Troubled Neighbor',
    avatar: '/Characters/Char Cards/Bella_Daisy.png',
    color: 'from-stone-500 to-zinc-600',
    lovedItems: ['moss', 'mucus'],
    dislikedItems: ['bolts'],
    loveReaction: "Perfect fertilizer for my glowing orchids! They require high moisture levels.",
    normalReaction: "Very well, I will add this to my botanical garden compost pile.",
    greeting: "Oh, hello Yogesh! I'm busy weeding my rare sugar plants today. How are you doing under the beautiful canopy?",
    responses: {
      secret: [
        "I noticed the stationmaster was checking his watch five seconds early yesterday. Highly irregular!",
        "My rare glowing orchids only open their petals when the town bells ring for curfew."
      ],
      joke: [
        "Why did the neighbor buy binoculars? To keep a very close eye on the lawn weeds!",
        "What is the nosiest flower? A dandelion, because it always blows secrets!"
      ],
      chore: [
        "Some creeping vines are encroaching on my private garden wall. Go trim them back!",
        "Find me some fresh cooling moss to protect my delicate seedlings from the sun."
      ],
      default: [
        "I have documented three noise disturbances this morning already.",
        "Make sure you lock your cottage gate. People are always wandering around."
      ]
    },
    keywords: [
      {
        keys: ['garden', 'plants', 'neighbor', 'weeds'],
        replies: [
          "My garden contains the rarest confectionery flora in the province.",
          "If Pipkin's slingshot breaks one of my greenhouse windows, I will file a formal complaint!"
        ]
      }
    ]
  },
  {
    id: 'crumbleton',
    name: 'Baker Bramble Mortimer',
    role: 'Baker',
    avatar: '/Characters/Char Cards/Milo_Spark.png',
    color: 'from-amber-400 to-yellow-600',
    lovedItems: ['wood', 'moss'],
    dislikedItems: ['mucus'],
    loveReaction: "Excellent! Dry firewood to bake the perfect honeyberry loaf!",
    normalReaction: "Ah, thank you! Let's get the oven preheated.",
    greeting: "A fresh batch of honeyberry rolls is in the oven! Care for a warm pastry, Yogesh?",
    responses: {
      secret: [
        "The secret to my floating cakes is adding a pinch of refined mint-sugar crystals.",
        "I keep my sourdough recipe locked in a bronze biscuit tin behind the flour sacks."
      ],
      joke: [
        "Why did the cake go to the doctor? Because it was feeling a bit crumby!",
        "What do bakers say when they meet? Dough-lighted to see you!"
      ],
      chore: [
        "The oven fires need dry wood to maintain the baking temperature. Can you supply some timber?",
        "Go sweep the flour dust off the bakery front steps before the inspectors arrive."
      ],
      default: [
        "Life is short, eat more sweetbread!",
        "A warm kitchen is a happy kitchen."
      ]
    },
    keywords: [
      {
        keys: ['bread', 'bake', 'pastry', 'bakery', 'croissant'],
        replies: [
          "My croissants have exactly seventy-two layers of fresh butter fold.",
          "Chirp the messenger bird is a regular guest. He loves pastry crumbs!"
        ]
      }
    ]
  },
  {
    id: 'cedric_w',
    name: 'Professor Finley',
    role: 'Academy Principal',
    avatar: '/Characters/Char Cards/Hugo_Glass.png',
    color: 'from-emerald-600 to-teal-700',
    lovedItems: ['parchment', 'ink'],
    dislikedItems: ['bolts'],
    loveReaction: "A fine supply of ink and vellum! Ideal for cataloging confectionery history.",
    normalReaction: "Thank you. A scholar is always in need of writing instruments.",
    greeting: "Class is in session! Grammar and history bind our society. I am Professor Finley, Principal of the Academy. What knowledge do you seek today?",
    responses: {
      secret: [
        "The library has a hidden compartment containing scrolls from the founding architects of Mossberry Wharf.",
        "The Great Molasses Flood of Year 120 was actually caused by an experimental pressure valve."
      ],
      joke: [
        "Why did the spelling book look sad? Because it had too many problems!",
        "What do you call a dinosaur that knows a lot of synonyms? A thesaurus!"
      ],
      chore: [
        "The student desks are cluttered. Organize the archives and return the borrowed scrolls.",
        "I need a fresh ink bottle to finish my review of the county charter."
      ],
      default: [
        "Continuous education leads to civic excellence.",
        "Study the past if you wish to build a better future."
      ]
    },
    keywords: [
      {
        keys: ['school', 'study', 'class', 'grammar', 'history'],
        replies: [
          "We must teach younger residents like you, Yogesh, the value of proper ledger cataloging.",
          "My chalk is imported from the limestone cliffs of Peppermint Peaks."
        ]
      }
    ]
  },
  {
    id: 'horace',
    name: 'Horace Ticklebell',
    role: 'Railway Stationmaster',
    avatar: '/Characters/Char Cards/Nico_Whistle.png',
    color: 'from-cyan-500 to-blue-600',
    lovedItems: ['bolts', 'ink'],
    dislikedItems: ['moss'],
    loveReaction: "Perfect timing! These bolts will reinforce the monorail station schedule boards.",
    normalReaction: "Thank you. All goods must be cataloged in the terminal cargo registry.",
    greeting: "The Monorail runs exactly on schedule! Watch your step on the platform, Yogesh.",
    responses: {
      secret: [
        "The transit company is planning to test steam-powered cargo pods on the main bridge next week.",
        "I synchronize my watch with the central belfry clock once every twelve hours."
      ],
      joke: [
        "Why did the train go to school? To check its track record!",
        "What is a locomotive's favorite snack? Chew-chew cookies!"
      ],
      chore: [
        "The terminal schedule board is dirty. Grab some soap and scrub the glass panels.",
        "Please deliver this shipping ledger template to the harbor master's deck."
      ],
      default: [
        "Punctuality is the courtesy of kings, and railway conductors.",
        "Please keep all active luggage clear of the monorail gate sensor."
      ]
    },
    keywords: [
      {
        keys: ['train', 'station', 'schedule', 'monorail', 'railway'],
        replies: [
          "Our express monorail connects Ganache Grove to the central trade valleys.",
          "Keep your travel permits active. Sir Goldwhistle inspects tickets regularly!"
        ]
      }
    ]
  },
  {
    id: 'hazel',
    name: 'Dr. Cedric Oakenhart',
    role: 'Town Physician',
    avatar: '/Characters/Char Cards/Bella_Daisy.png',
    color: 'from-teal-400 to-emerald-600',
    lovedItems: ['moss', 'mucus'],
    dislikedItems: ['bolts'],
    loveReaction: "Wonderful! High-purity forest moss makes the best cooling pack for spore coughs.",
    normalReaction: "Appreciated. These clinic supplies will be added to my apothecary drawer.",
    greeting: "Hello there, Yogesh. I am Dr. Cedric Oakenhart. If you are feeling under the weather, I have a soothing herbal brew ready.",
    responses: {
      secret: [
        "Bioluminescent moss has remarkable antiseptic properties. I grow a small batch in my clinic basement.",
        "The local spring water contains sweet minerals that naturally reduce physical exhaustion."
      ],
      joke: [
        "Why did the stethoscope go to school? To learn how to listen properly!",
        "What do you call a doctor who loves sweets? A sugar pill expert!"
      ],
      chore: [
        "The clinic shelves are low on cooling moss packs. Can you gather some from the forest floor?",
        "Please sterilize the medical vials on the counter with fresh spring water."
      ],
      default: [
        "Remember to rest between travel routes. Spore cough is highly contagious!",
        "Drink plenty of water and keep a warm blanket in your tent."
      ]
    },
    keywords: [
      {
        keys: ['doctor', 'clinic', 'medicine', 'heal', 'physician'],
        replies: [
          "I diagnose and treat all local ailments, from sticky fingers to monorail motion sickness.",
          "My mint tea is brewed for therapeutic benefit, not just daily drinking!"
        ]
      }
    ]
  },
  {
    id: 'hugo',
    name: 'Blacksmith Crumblewise',
    role: 'Forge Master',
    avatar: '/Characters/Char Cards/Hugo_Glass.png',
    color: 'from-stone-600 to-neutral-700',
    lovedItems: ['wood', 'bolts'],
    dislikedItems: ['parchment'],
    loveReaction: "Heavy bolts and premium firewood! Now we can heat the forge to maximum temperature!",
    normalReaction: "Thank you, Yogesh. Wood and steel are the backbone of this town.",
    greeting: "The forge is hot and the anvil is ready. I am Blacksmith Crumblewise. Need your tools reinforced, Yogesh?",
    responses: {
      secret: [
        "I once forged a golden gear for the central clockwork tower that took three weeks to calibrate.",
        "Percival keeps asking for copper alloy springs. They are extremely difficult to shape without sugar syrup!"
      ],
      joke: [
        "Why did the blacksmith get a medal? For outstanding metal-work!",
        "What is an anvil's favorite movie? Iron Man, of course!"
      ],
      chore: [
        "The bellows need fresh grease, and the forge fires need timber. Can you drop off some wood?",
        "Carry this heavy iron bracket to the elevated walkway building site."
      ],
      default: [
        "A strong hammer makes a sturdy gate.",
        "Keep your tool gears oiled. The damp forest air causes rust quickly."
      ]
    },
    keywords: [
      {
        keys: ['forge', 'iron', 'steel', 'blacksmith', 'hammer'],
        replies: [
          "I forge high-strength axes, structural trusses, and custom steel rails.",
          "Playing my mouth harp helps cool down the hot metal bars."
        ]
      }
    ]
  },
  {
    id: 'cinder',
    name: 'Bounce McDrizzle',
    role: 'Innkeeper',
    avatar: '/Assets/Ganache Grove/Characters/Innkeeper_townsfolk.png',
    color: 'from-orange-600 to-red-700',
    lovedItems: ['wood', 'bolts'],
    dislikedItems: ['parchment'],
    loveReaction: "Aha! Perfect fuel for the tavern hearth! This will keep the inn warm and cozy for our guests.",
    normalReaction: "Thank you! I will store this at the front desk.",
    greeting: "Welcome to the Hearthstone Inn! I'm Bounce McDrizzle, your friendly innkeeper. Let me know if you need a warm bed or some hot cocoa stew!",
    responses: {
      secret: [
        "The tavern's fireplace secret recipe uses a pinch of spicy cinnamon to keep the rooms warm.",
        "Sometimes travelers leave behind interesting maps of the mountain trails in their rooms."
      ],
      joke: [
        "Why did the innkeeper go to sleep? To get a little rest-oration!",
        "What do you call a happy traveler? A guest with a full stomach!"
      ],
      chore: [
        "The guest linens need washing with fresh mountain mint water. Can you help clean them?",
        "We're running low on firewood for the main hearth. Can you fetch some dry timber?"
      ],
      default: [
        "Make yourself at home at the Hearthstone Inn!",
        "Enjoy your stay, and remember to rest before traveling the canopy paths."
      ]
    },
    keywords: [
      {
        keys: ['inn', 'tavern', 'stew', 'bed', 'room'],
        replies: [
          "We offer the coziest beds in all of Ganache Grove!",
          "My potato-cocoa stew is brewed fresh daily for our guests."
        ]
      }
    ]
  },
  {
    id: 'finch',
    name: 'Caramel Finch',
    role: 'Businessman & Merchant',
    avatar: '/characters/rebel_Fisherman-Whimsley.png',
    color: 'from-indigo-600 to-purple-800',
    lovedItems: ['ink', 'parchment'],
    dislikedItems: ['mucus'],
    loveReaction: "Splendid! Premium ledger sheets to sign off on our major trade routes!",
    normalReaction: "Very good. Every deal starts with clean inventory tracking.",
    greeting: "Time is coins, and coins are opportunity! Caramel Finch at your service. Let's talk business!",
    responses: {
      secret: [
        "I have a secret contract with the shipping guild to export sweetbread to the outer provinces.",
        "If you invest in premium passport credentials, the tax rate on your trades decreases significantly."
      ],
      joke: [
        "Why did the merchant carry a scale? To see if the deals were well-balanced!",
        "What is a businessman's favorite sport? Currency trading!"
      ],
      chore: [
        "I need a fresh inkwell to sign a wholesale shipment contract. Find me one!",
        "Deliver this sealed invoice to the tax auditor's desk at the treasury hall."
      ],
      default: [
        "Let's see what inventory you have to offer today.",
        "A wise merchant always keeps a ledger of daily earnings."
      ]
    },
    keywords: [
      {
        keys: ['money', 'coins', 'trade', 'business', 'merchant'],
        replies: [
          "Buy low, sell high, and always keep your cargo warehouse clean.",
          "I handle wholesale trades. For daily items, check the Market Board."
        ]
      }
    ]
  }
];