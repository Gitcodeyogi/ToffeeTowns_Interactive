/* eslint-disable react-hooks/purity */
import React, { useState, useEffect } from 'react';
import { useTTStore } from '../../store/useTTStore';
import { GanacheGroveTownData } from '../../data/towns/ganache-grove';
import type { SubPage } from '../../pages/TravellersDesk';
import {
  FONT,
  TOWN_DETAILS,
  HOME_ROOMS,
  HOME_NAV_ITEMS,
  getChocolateDate,
  getProvincialStanding,
  getBuilderStanding,
  getExplorerStanding,
  getHealerStanding,
  TRANSPORT_SPEEDS,
} from '../../pages/TravellersDesk';

interface AcceptedItem {
  id: string;
  room: string;
  title: string;
  description: string;
  type: 'letter' | 'opportunity' | 'task' | 'notice' | 'coin';
  reward?: number;
  acceptedAt: string;
  status: 'pending' | 'done';
}

interface GG_TravellerDeck_HomeProps {
  setSubPage: (page: SubPage) => void;
  pushPage: (page: SubPage) => void;
  popPage: () => void;
  inventory: Record<string, number>;
  setInventory: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  setShowDossierPlaycard: (show: boolean) => void;
  setShowTownHallModal: (show: boolean) => void;
  dossierRead: boolean;
  triggerFeedback: (msg: string) => void;
  setShowFlashNewsModal?: (show: boolean) => void;
  activePuzzleChore: any;
  setActivePuzzleChore: React.Dispatch<React.SetStateAction<any>>;
}

export interface ChorePuzzle {
  title: string;
  chore: string;
  question: string;
  type: 'multiple-choice' | 'calculation' | 'ordering';
  options?: string[];
  answer: string;
  hint: string;
  xpReward: number;
  xpCategory: 'builder' | 'explorer' | 'healer';
}

export interface HotspotConfig {
  id: string;
  emoji: string;
  top: string;
  left: string;
  title: string;
  chores: [ChorePuzzle, ChorePuzzle];
}

const ROOM_HOTSPOTS: Record<string, HotspotConfig[]> = {
  exterior: [
    {
      id: 'ext-gate',
      emoji: '≡ƒÜº',
      top: '65%',
      left: '25%',
      title: 'Garden Gate Latch',
      chores: [
        {
          title: 'Secure Gate Hinges',
          chore: 'The heavy wooden gate is sagging. We need to calculate the correct screw torque load to hold it steady.',
          question: 'If the gate weighs 40 kg and has 2 hinges, and each hinge requires 15 Nm of torque per 10 kg of gate weight, what is the total torque needed (in Nm) for both hinges combined?',
          type: 'calculation',
          answer: '60',
          hint: 'Multiply the total weight (40 kg) by the torque rate (15 Nm / 10 kg) to find the combined requirement.',
          xpReward: 15,
          xpCategory: 'builder'
        },
        {
          title: 'Hinges Alignment',
          chore: 'The gate latch is misaligned. Order the steps correctly to reinstall the latch system.',
          question: 'Order these steps: A) Tighten mounting screws, B) Mark screw holes, C) Align latch with strike plate, D) Drill pilot holes.',
          type: 'ordering',
          options: ['A-B-C-D', 'C-B-D-A', 'B-D-C-A', 'C-D-B-A'],
          answer: 'C-B-D-A',
          hint: 'First align the latch (C), then mark the holes (B), drill pilot holes (D), and finally tighten (A).',
          xpReward: 15,
          xpCategory: 'builder'
        }
      ]
    },
    {
      id: 'ext-mail',
      emoji: '≡ƒô¼',
      top: '75%',
      left: '80%',
      title: 'Incoming Mail Box',
      chores: [
        {
          title: 'Sort Postcodes',
          chore: 'Sort incoming letters from Mrs. Petalworth. One letter is misaddressed.',
          question: 'Which postcode belongs to Ganache Grove if the county prefix is "GG" followed by a prime number under 10?',
          type: 'multiple-choice',
          options: ['GG-09', 'GG-07', 'GG-08', 'GG-06'],
          answer: 'GG-07',
          hint: '7 is the only prime number under 10 in the options.',
          xpReward: 10,
          xpCategory: 'explorer'
        },
        {
          title: 'Package Weight Verify',
          chore: 'Confirm the total delivery weight of Sir Goldwhistle\'s parcel crates.',
          question: 'If crate A weighs 14 lbs, crate B weighs twice as much as A, and crate C weighs 5 lbs less than B, what is the combined weight (in lbs) of all three crates?',
          type: 'calculation',
          answer: '65',
          hint: 'Crate A = 14. Crate B = 28. Crate C = 23. Add them up!',
          xpReward: 12,
          xpCategory: 'explorer'
        }
      ]
    }
  ],
  livingroom: [
    {
      id: 'liv-books',
      emoji: '≡ƒôÜ',
      top: '45%',
      left: '20%',
      title: 'Lore Bookshelf',
      chores: [
        {
          title: 'Arrange Library Books',
          chore: 'Organize historical volumes of Cocoawood County by author name.',
          question: 'Sort these authors alphabetically: A) Zola, B) Mortimer, C) Amberwood, D) Petalworth.',
          type: 'ordering',
          options: ['C-B-D-A', 'C-D-B-A', 'B-C-D-A', 'A-B-C-D'],
          answer: 'C-B-D-A',
          hint: 'A = Amberwood, B = Mortimer, C = Petalworth, D = Zola.',
          xpReward: 12,
          xpCategory: 'builder'
        },
        {
          title: 'Missing Journal Volume',
          chore: 'Determine the missing volume number in the historic registry series.',
          question: 'Identify the missing number in the sequence: 3, 8, 18, 38, ?, 158.',
          type: 'calculation',
          answer: '78',
          hint: 'The pattern is: next number = (current number * 2) + 2.',
          xpReward: 15,
          xpCategory: 'builder'
        }
      ]
    },
    {
      id: 'liv-fire',
      emoji: '≡ƒöÑ',
      top: '70%',
      left: '50%',
      title: 'Eternal Hearth',
      chores: [
        {
          title: 'Wood Stack Selection',
          chore: 'Select the optimal wood stack layout for a clean burn.',
          question: 'Which wood stacking method provides the maximum oxygen airflow for slow hazelnut logs?',
          type: 'multiple-choice',
          options: ['Parallel tight packing', 'Criss-cross log cabin stack', 'Conical teepee stacking', 'Horizontal overlapping pile'],
          answer: 'Criss-cross log cabin stack',
          hint: 'A criss-cross stack allows vertical drafts while supporting heavy, slow-burning hazelnut wood logs.',
          xpReward: 15,
          xpCategory: 'explorer'
        },
        {
          title: 'Calculate Airflow Draft',
          chore: 'A steady chimney draft is needed to prevent sweet molasses smoke from backing up.',
          question: 'If the draft velocity needs to be 3.5 meters per second, and the chimney is currently drawing at 1.8 m/s, how much velocity increase (in m/s) is required?',
          type: 'calculation',
          answer: '1.7',
          hint: 'Subtract 1.8 from 3.5 to get the difference.',
          xpReward: 12,
          xpCategory: 'explorer'
        }
      ]
    }
  ],
  bedroom: [
    {
      id: 'bed-mirror',
      emoji: '≡ƒ¬₧',
      top: '55%',
      left: '15%',
      title: 'Vanity Mirror',
      chores: [
        {
          title: 'Polish Mirror Glass',
          chore: 'Mix the perfect clinical potion of vinegar and lavender oil to clean the vanity mirror.',
          question: 'If the cleaning spray ratio is 5 parts water, 2 parts vinegar, and 1 part lavender oil, how many ml of vinegar are needed to make a 400 ml mixture?',
          type: 'calculation',
          answer: '100',
          hint: 'Total parts = 5 + 2 + 1 = 8. Each part is 400 / 8 = 50 ml. Vinegar is 2 parts.',
          xpReward: 10,
          xpCategory: 'healer'
        },
        {
          title: 'Streak-Free Finish',
          chore: 'Select the optimal cloth type to prevent scratching the historic silver backing.',
          question: 'Which cloth material is best for polishing silver-plated glass?',
          type: 'multiple-choice',
          options: ['Coarse wool fleece', 'Woven flax linen', 'Microfiber cloth', 'Compressed cotton wad'],
          answer: 'Microfiber cloth',
          hint: 'Microfiber has the highest density of soft, non-abrasive fibers for a streak-free reflection.',
          xpReward: 12,
          xpCategory: 'healer'
        }
      ]
    },
    {
      id: 'bed-journal',
      emoji: 'Γ£ì∩╕Å',
      top: '75%',
      left: '70%',
      title: 'Dream Journal',
      chores: [
        {
          title: 'Dream Symbol Analysis',
          chore: 'Interpret the glowing forest dream symbol from last night.',
          question: 'In Cocoawood folklore, what does a glowing blue oak leaf symbolise?',
          type: 'multiple-choice',
          options: ['Impending rain storm', 'A visit from a forest sprite', 'Discovery of a new path', 'A rich chocolate harvest'],
          answer: 'Discovery of a new path',
          hint: 'The glowing blue oak leaf is the classic mark of the Explorer, representing new pathways.',
          xpReward: 15,
          xpCategory: 'healer'
        },
        {
          title: 'Chronology of Dreams',
          chore: 'Put the fragments of your forest dream in chronological order.',
          question: 'Order these dream events: A) Entering the glowing canopy, B) Hearing the river roar, C) Waking up in bed, D) Spotting a golden bunny.',
          type: 'ordering',
          options: ['A-D-B-C', 'B-A-D-C', 'A-B-D-C', 'D-A-B-C'],
          answer: 'A-D-B-C',
          hint: 'You first enter the canopy (A), spot the bunny (D), follow it to hear the river (B), and then wake up (C).',
          xpReward: 15,
          xpCategory: 'healer'
        }
      ]
    }
  ],
  kitchen: [
    {
      id: 'kit-spices',
      emoji: '≡ƒî╢∩╕Å',
      top: '35%',
      left: '30%',
      title: 'Spice Rack',
      chores: [
        {
          title: 'Spice Ratio Calculation',
          chore: 'Balance the cinnamon chips and velvet cocoa extract jars in the rack.',
          question: 'If you have 18 jars of cinnamon chips and need a 3:2 ratio of cinnamon to cocoa, how many jars of cocoa extract should you have?',
          type: 'calculation',
          answer: '12',
          hint: 'If 3 parts = 18 jars, then 1 part = 6 jars. Cocoa needs 2 parts.',
          xpReward: 12,
          xpCategory: 'healer'
        },
        {
          title: 'Organize Spice Heat',
          chore: 'Organize these native forest spices from mildest to hottest.',
          question: 'Order from mild to hot: A) Sweet Fennel, B) Spicy Nutmeg, C) Volcano Pepper, D) Warm Cardamom.',
          type: 'ordering',
          options: ['A-D-B-C', 'A-B-D-C', 'D-A-B-C', 'C-B-D-A'],
          answer: 'A-D-B-C',
          hint: 'Sweet Fennel is mildest, followed by Cardamom, then Nutmeg, and Volcano Pepper is hottest.',
          xpReward: 15,
          xpCategory: 'healer'
        }
      ]
    },
    {
      id: 'kit-pots',
      emoji: '≡ƒì│',
      top: '60%',
      left: '65%',
      title: 'Copper Kettles',
      chores: [
        {
          title: 'Polish Copper Kettles',
          chore: 'Reorder the steps to clean sticky molasses residue off the pans.',
          question: 'Order the steps: A) Rinse with warm water, B) Apply salt & lemon scrub, C) Dry with soft cloth, D) Let sit for 5 minutes.',
          type: 'ordering',
          options: ['B-D-A-C', 'B-A-D-C', 'A-B-D-C', 'D-B-A-C'],
          answer: 'B-D-A-C',
          hint: 'Apply scrub first (B), let it sit (D), rinse (A), and dry (C).',
          xpReward: 15,
          xpCategory: 'builder'
        },
        {
          title: 'Calculate Molasses Residue',
          chore: 'Determine the weight of sugar scale to scrape off.',
          question: 'A copper kettle weighs 1200 grams empty. With molasses scale, it weighs 1385 grams. How many grams of residue need to be scraped?',
          type: 'calculation',
          answer: '185',
          hint: 'Subtract 1200 from 1385 to find the scale weight.',
          xpReward: 12,
          xpCategory: 'builder'
        }
      ]
    }
  ],
  balcony: [
    {
      id: 'bal-pots',
      emoji: '≡ƒî╕',
      top: '30%',
      left: '20%',
      title: 'Orchid Flowerpots',
      chores: [
        {
          title: 'Water Hanging Orchid',
          chore: 'Water the glowing forest orchid according to its light conditions.',
          question: 'Glowing orchids require watering only when soil moisture drops below 20%. If current moisture is 45% and drops by 5% daily, in how many days should you water it?',
          type: 'calculation',
          answer: '5',
          hint: 'Difference is 45 - 20 = 25%. Dividing 25% by 5% daily gives 5 days.',
          xpReward: 12,
          xpCategory: 'healer'
        },
        {
          title: 'Orchid Nutrient Mix',
          chore: 'Select the optimal nitrogen-phosphorus mixture for blooms.',
          question: 'What is the ideal N-P-K nutrient ratio for blooming glowing forest orchids?',
          type: 'multiple-choice',
          options: ['10-30-20', '30-10-10', '10-10-10', '20-20-20'],
          answer: '10-30-20',
          hint: 'High phosphorus (middle number) encourages root development and bright bioluminescent blooms.',
          xpReward: 15,
          xpCategory: 'healer'
        }
      ]
    },
    {
      id: 'bal-scope',
      emoji: '≡ƒö¡',
      top: '45%',
      left: '75%',
      title: 'Telescope Stand',
      chores: [
        {
          title: 'Comet Path Angle',
          chore: 'Calculate the telescope angle to spot the Sugarwave Comet.',
          question: 'If the comet rises at 42 degrees azimuth and moves 3 degrees east every hour, what will be its azimuth (in degrees) after 4 hours?',
          type: 'calculation',
          answer: '54',
          hint: '4 hours * 3 degrees/hour = 12 degrees. Add this to 42 degrees.',
          xpReward: 15,
          xpCategory: 'explorer'
        },
        {
          title: 'Lenses Calibration',
          chore: 'Arrange the telescope focal lenses from lowest magnification to highest.',
          question: 'Order from low to high zoom: A) 40mm wide-field, B) 10mm high-contrast, C) 25mm medium-zoom.',
          type: 'ordering',
          options: ['A-C-B', 'A-B-C', 'C-A-B', 'B-C-A'],
          answer: 'A-C-B',
          hint: 'Longer focal lengths have lower magnification. So 40mm (A) is lowest, 25mm (C) is medium, 10mm (B) is highest.',
          xpReward: 12,
          xpCategory: 'explorer'
        }
      ]
    }
  ],
  lawn: [
    {
      id: 'law-weeds',
      emoji: '≡ƒî▒',
      top: '80%',
      left: '40%',
      title: 'Lawn Ivy & Weeds',
      chores: [
        {
          title: 'Identify Creep Weed',
          chore: 'Identify the creeping wood-parasite choking the hedgerows.',
          question: 'Which of these is a parasitic vine that weakens native hazelnut fences?',
          type: 'multiple-choice',
          options: ['Sweet Clover', 'Bramble Ivy', 'Dodder Creeper', 'Dandelion Puff'],
          answer: 'Dodder Creeper',
          hint: 'Dodder Creeper is a yellow, leafless parasitic vine that wraps around host plants to steal nutrients.',
          xpReward: 10,
          xpCategory: 'healer'
        },
        {
          title: 'Weed Killer Mix',
          chore: 'Calculate the water-to-soap ratio for safe weed eradication.',
          question: 'If you mix 30 ml of herbal soap per 1 liter of water, how many ml of soap are needed for 4.5 liters of water?',
          type: 'calculation',
          answer: '135',
          hint: 'Multiply 4.5 liters by 30 ml/liter.',
          xpReward: 12,
          xpCategory: 'healer'
        }
      ]
    },
    {
      id: 'law-pet',
      emoji: '≡ƒº╢',
      top: '65%',
      left: '80%',
      title: 'Companion Pet',
      chores: [
        {
          title: 'Select Brush Type',
          chore: 'Brush your companion bunny\'s soft coat to keep it neat and clean.',
          question: 'Which brush type is best for removing loose undercoat fur without irritating sensitive bunny skin?',
          type: 'multiple-choice',
          options: ['Coarse metal wire rake', 'Soft bristle finish brush', 'Double-sided pin brush', 'Rubber shedding mitt'],
          answer: 'Soft bristle finish brush',
          hint: 'Bunnies have extremely delicate skin, so a soft bristle brush is safest for daily grooming.',
          xpReward: 12,
          xpCategory: 'healer'
        },
        {
          title: 'Grooming Routine Order',
          chore: 'Correctly order the steps for your pet\'s weekly grooming routine.',
          question: 'Order the steps: A) Wipe paws with damp cloth, B) Brush back fur, C) Reward with dried apple treat, D) Check ears for twigs.',
          type: 'ordering',
          options: ['D-B-A-C', 'B-D-A-C', 'A-B-D-C', 'D-A-B-C'],
          answer: 'D-B-A-C',
          hint: 'Always check ears first (D), brush down the coat (B), wipe the paws (A), and end with a delicious treat (C).',
          xpReward: 15,
          xpCategory: 'healer'
        }
      ]
    }
  ]
};

interface HotspotChoreState {
  choreIndex: number;
  expiresAt: number;
  completed: boolean;
}
export type HudChoresState = Record<string, HotspotChoreState>;

const getInitialHudState = (existingRaw: string | null): HudChoresState => {
  let state: HudChoresState = {};
  if (existingRaw) {
    try {
      state = JSON.parse(existingRaw);
    } catch (e) {
      state = {};
    }
  }

  let updated = false;
  const now = Date.now();

  Object.entries(ROOM_HOTSPOTS).forEach(([_, spots]) => {
    spots.forEach(spot => {
      const current = state[spot.id];
      if (!current || current.expiresAt <= now) {
        const prevIdx = current ? current.choreIndex : -1;
        const nextIdx = prevIdx === 0 ? 1 : prevIdx === 1 ? 0 : Math.floor(Math.random() * 2);
        const duration = (2 + Math.random()) * 3600 * 1000;
        state[spot.id] = {
          choreIndex: nextIdx,
          expiresAt: now + duration,
          completed: false
        };
        updated = true;
      }
    });
  });

  if (updated) {
    localStorage.setItem('tt_hud_chores_state', JSON.stringify(state));
  }
  return state;
};

interface CharacterSlide {
  id: string;
  name: string;
  role: string;
  clan: 'Bosses' | 'Rebels' | 'Neutral';
  image: string;
  description: string;
  age?: string;
  specialty?: string;
  favoriteProp?: string;
  loreSections: Array<{ title: string; content: string }>;
  stats: Record<string, number>;
}

const GANACHE_CHARACTERS: CharacterSlide[] = [
  {
    id: 'pipkin',
    name: 'Pipkin Nutterby',
    role: 'Official Prankster & Resident Troublemaker',
    clan: 'Neutral',
    image: '/Characters/pipkin_nutterby.png',
    description: 'A 12-year-old bundle of endless curiosity and wild ideas with messy dark brown forest hair and a signature wild front tuft. Always wearing an oversized friendly grin and carrying a mysterious satchel.',
    age: '12',
    specialty: 'Accidental Heroism',
    favoriteProp: 'Wooden Slingshot',
    loreSections: [
      { title: 'The Satchel Mystery', content: 'Pipkin carries a small leather satchel everywhere. Nobody in Ganache Grove knows what is insideΓÇöincluding Pipkin himself, who claims it contains "brilliant ideas awaiting their perfect moment."' },
      { title: 'Town Mischief', content: 'Responsible for 147 accidental incidents, including the time he accidentally launched a pinecone into Sir Goldwhistle\'s audit tea cup.' }
    ],
    stats: { mischief: 98, agility: 98, courage: 95, strength: 40 }
  },
  {
    id: 'rowan',
    name: 'Rowan Thistle',
    role: 'Builder Apprentice',
    clan: 'Neutral',
    image: '/Characters/Char Cards/Milo_Spark.png',
    description: 'A young, eager-eyed builder apprentice wearing a leather work apron full of miniature blueprints, with a pencil constantly behind his ear.',
    age: '19',
    specialty: 'Structural Carpentry',
    favoriteProp: 'Pocket Blueprint Ruler',
    loreSections: [
      { title: 'Engineering Dreams', content: 'Rowan believes that any problem in the county can be solved with a practical wood-and-mortar solution. He spends late nights designing bridges.' },
      { title: 'Apprentice Dedication', content: 'Under the guidance of the senior builders, Rowan helps construct the elevated walkways that keep Ganache Grove connected above the root floor.' }
    ],
    stats: { mischief: 15, agility: 70, courage: 85, strength: 75 }
  },
  {
    id: 'julie',
    name: 'Julie Frost',
    role: 'Gazette Reporter',
    clan: 'Neutral',
    image: '/Characters/Char Cards/Zara_Quill.png',
    description: 'A sharp-eyed Gazette reporter wearing a velvet newsboy cap, constantly holding a quick-ink quill and a small notepad to record local gossip.',
    age: '21',
    specialty: 'Investigative Journalism',
    favoriteProp: 'Quick-ink Quill',
    loreSections: [
      { title: 'Rumor Catcher', content: 'Julie is known to capture the sweetest details of the news before breakfast. Her quick wit makes her a beloved and feared presence in local council meetings.' },
      { title: 'The Gazette Desk', content: 'She coordinates directly with local scouts to compile the daily dispatches that help residents navigate the changing tides of ChocoBrook.' }
    ],
    stats: { mischief: 45, agility: 80, courage: 75, strength: 45 }
  },
  {
    id: 'cedric',
    name: 'Dr. Cedric Oakenhart',
    role: 'Town Physician & Herbalist',
    clan: 'Neutral',
    image: '/Characters/Char Cards/Hugo_Glass.png',
    description: 'A tall physician with kind hazel eyes, wearing a cozy sweater spun from herbal yarn and carrying a flask of warm bark tea.',
    age: '48',
    specialty: 'Forest Remedies & Medicine',
    favoriteProp: 'Molasses Flask & Spore Filter',
    loreSections: [
      { title: 'Outbreak Specialist', content: 'Dr. Cedric treats local spore sneezles with honey mint compresses and warm herbal tea. He advocates rest, clean air, and hygiene above all.' },
      { title: 'Secret Research', content: 'He maintains a botanical garden near the clinic, researching the medicinal properties of glowing mushroom spores.' }
    ],
    stats: { mischief: 5, agility: 60, courage: 85, strength: 55 }
  },
  {
    id: 'petalworth',
    name: 'Mrs. Petalworth',
    role: 'Flower Merchant & Rebel Coordinate',
    clan: 'Rebels',
    image: '/Characters/Char Cards/Bella_Daisy.png',
    description: 'A cheerful merchant wearing a wide straw hat decorated with real sugar lilies, tending her botanical stalls near the market square.',
    age: '42',
    specialty: 'Botanical Mysteries & Message Routing',
    favoriteProp: 'Watering Can & Secret Cipher',
    loreSections: [
      { title: 'The Rebel Connection', content: 'While she appears to be a simple flower seller, her shop is the primary coordinate point for the Rebel clan, routing secret messages in bouquet wrappings.' },
      { title: 'Sugar Lily Cultivation', content: 'Mrs. Petalworth is the only florist in ChocoBrook who can successfully grow sugar lilies in night shadow zones.' }
    ],
    stats: { mischief: 65, agility: 85, courage: 55, strength: 40 }
  },
  {
    id: 'goldwhistle',
    name: 'Sir Goldwhistle',
    role: 'Tax Collector & Auditor',
    clan: 'Bosses',
    image: '/Characters/Char Cards/Nico_Whistle.png',
    description: 'A meticulous tax collector in a crisp velvet suit, holding a golden ledger and a whistle made of pure brass.',
    age: '35',
    specialty: 'Accounts Auditing',
    favoriteProp: 'Pure Brass Whistle',
    loreSections: [
      { title: 'The Gold Standard', content: 'Sir Goldwhistle can find a coin hidden in a haystack and will gladly tax you for finding it. He believes civic progress is funded by strict civic dues.' },
      { title: 'Council Influence', content: 'He is the Mayor\'s right-hand auditor, managing the treasury accounts and organizing harbor expansions to boost commerce.' }
    ],
    stats: { mischief: 30, agility: 90, courage: 65, strength: 30 }
  },
  {
    id: 'olive',
    name: 'Olive Pine',
    role: 'Rebel Ranger Captain',
    clan: 'Rebels',
    image: '/Characters/Char Cards/Olive_Pine.png',
    description: 'The fearless leader of the forest canopy rangers who actively protests curfews and restrictions on night foraging.',
    age: '24',
    specialty: 'Canopy Navigation & Archery',
    favoriteProp: 'Oak Recurve Bow',
    loreSections: [
      { title: 'Canopy Rebellion', content: 'Olive believes the forest belongs to those who care for it, not the city council. She leads night excursions to gather medicinal herbs under the stars.' },
      { title: 'Target Practice', content: 'Can hit a floating leaf from fifty paces away in pitch darkness. Her agility in the branches is unmatched.' }
    ],
    stats: { mischief: 75, agility: 95, courage: 90, strength: 65 }
  }
];

const SHADOW_SLIDER_CSS = `
  @keyframes key-fade-scale {
    0% { opacity: 0; transform: scale(1.05); }
    100% { opacity: 1; transform: scale(1); }
  }
  .animate-key-fade-scale {
    animation: key-fade-scale 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
  }
  @keyframes key-slide-in {
    0% { opacity: 0; transform: translateX(20px); }
    100% { opacity: 1; transform: translateX(0); }
  }
  .animate-key-slide-in {
    animation: key-slide-in 0.6s ease-out forwards;
  }
`;

export const GG_TravellerDeck_Home: React.FC<GG_TravellerDeck_HomeProps> = ({
  setSubPage,
  pushPage,
  inventory,
  setInventory,
  setShowDossierPlaycard,
  setShowTownHallModal,
  dossierRead,
  triggerFeedback,
  setShowFlashNewsModal,
  setActivePuzzleChore,
}) => {
  const {
    homeTown,
    coins,
    spendCoins,
    addCoins,
    skills,
    completedActions,
    legacyPoints,
    addLegacy,
    setPage,
    logout,
    user,
    lastStampedDate,
    ownedDecorations,
    equippedDecorations,
    ownedPets,
    equippedPet,
    activeTransport,
    addToQueue,
    taskQueue,
    addSkillXP,
  } = useTTStore();

  // Removed currentHomeSlide state to fix unused warning
  const [activeRoom, setActiveRoom] = useState<string>('exterior');
  const [activeRoomPopup, setActiveRoomPopup] = useState<string | null>(null);
  const [showHomeNav, setShowHomeNav] = useState(false);
  const [activeCharIndex, setActiveCharIndex] = useState(0);
  const [charContentTab, setCharContentTab] = useState<'registry' | 'lore'>('registry');

  const [activeHotspot, setActiveHotspot] = useState<HotspotConfig | null>(null);
  const [hudChoresState, setHudChoresState] = useState<HudChoresState>(() => {
    return getInitialHudState(localStorage.getItem('tt_hud_chores_state'));
  });

  const [lastInteractionTime, setLastInteractionTime] = useState<number>(Date.now());
  const [showDailyDispatch, setShowDailyDispatch] = useState<boolean>(false);
  const [rentPaid, setRentPaid] = useState<boolean>(() => {
    return localStorage.getItem('tt_rent_paid_cycle') === 'true';
  });

  const [dispatch1Done, setDispatch1Done] = useState(false);
  const [dispatch2Done, setDispatch2Done] = useState(false);
  const [dispatch3Done, setDispatch3Done] = useState(false);

  const [censusName, setCensusName] = useState('');
  const [censusProf, setCensusProf] = useState('builder');
  const [flourQty, setFlourQty] = useState(30);
  const [sugarQty, setSugarQty] = useState(30);
  const [cocoaQty, setCocoaQty] = useState(40);
  const [cleanSafety, setCleanSafety] = useState({ box1: false, box2: false, box3: false });

  const [secondsToNext, setSecondsToNext] = useState(7200);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsToNext(s => (s > 0 ? s - 1 : 7200));

      // 1-second dynamic expiration check & rotation
      setHudChoresState(currentState => {
        const now = Date.now();
        let updated = false;
        const nextState = { ...currentState };
        Object.entries(ROOM_HOTSPOTS).forEach(([_, spots]) => {
          spots.forEach(spot => {
            const current = nextState[spot.id];
            if (!current || current.expiresAt <= now) {
              const prevIdx = current ? current.choreIndex : -1;
              const nextIdx = prevIdx === 0 ? 1 : 0;
              const duration = (2 + Math.random()) * 3600 * 1000;
              nextState[spot.id] = {
                choreIndex: nextIdx,
                expiresAt: now + duration,
                completed: false
              };
              updated = true;
            }
          });
        });
        if (updated) {
          localStorage.setItem('tt_hud_chores_state', JSON.stringify(nextState));
          return nextState;
        }
        return currentState;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveCharIndex((prev) => (prev + 1) % GANACHE_CHARACTERS.length);
    }, 12000);
    return () => clearInterval(timer);
  }, [activeCharIndex]);

  useEffect(() => {
    setCharContentTab('registry');
  }, [activeCharIndex]);

  const formatTimer = (sec: number) => {
    const hrs = Math.floor(sec / 3600).toString().padStart(2, '0');
    const mins = Math.floor((sec % 3600) / 60).toString().padStart(2, '0');
    const secs = (sec % 60).toString().padStart(2, '0');
    return `${hrs}h ${mins}m ${secs}s`;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      if (now - lastInteractionTime >= 120000) {
        const roomIds = HOME_ROOMS.map(r => r.id);
        setActiveRoom(current => {
          const idx = roomIds.indexOf(current);
          const nextIdx = (idx + 1) % roomIds.length;
          return roomIds[nextIdx];
        });
      }
    }, 20000);
    return () => clearInterval(interval);
  }, [lastInteractionTime]);


  const [acceptedItems, setAcceptedItems] = useState<AcceptedItem[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('tt_accepted_items') || '[]');
    } catch {
      return [];
    }
  });



  const acceptItem = (
    room: string,
    item: { title: string; desc: string; type: AcceptedItem['type']; reward?: number }
  ) => {
    const newItem: AcceptedItem = {
      id: `${room}-${item.title}-${Date.now()}`,
      room,
      title: item.title,
      description: item.desc,
      type: item.type,
      reward: item.reward,
      acceptedAt: new Date().toISOString(),
      status: 'pending',
    };
    const updated = [newItem, ...acceptedItems].slice(0, 20);
    setAcceptedItems(updated);
    localStorage.setItem('tt_accepted_items', JSON.stringify(updated));
    if (item.reward) {
      if (item.type === 'coin' || item.type === 'task' || item.type === 'opportunity') {
        addCoins(item.reward, item.title);
      } else if (item.type === 'letter') {
        addLegacy(item.reward);
      }
    }
    triggerFeedback(`Γ£à Accepted: ${item.title}${item.reward ? ` ┬╖ +${item.reward}${item.type === 'letter' ? ' Legacy' : ' Coins'}` : ''}`);
    setActiveRoomPopup(null);
  };

  const handleOpenPuzzle = (spot: HotspotConfig, chore: ChorePuzzle) => {
    setActiveHotspot(null);
    setActivePuzzleChore({
      hotspot: spot,
      chore,
      expiresAt: hudChoresState[spot.id]?.expiresAt ?? (Date.now() + 7200 * 1000)
    });
    setLastInteractionTime(Date.now());
  };

  // ΓöÇΓöÇ Deterministic Daily Seed Engine ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
  const seedRandom = (str: string) => {
    let h = 1779033703 ^ str.length;
    for (let i = 0; i < str.length; i++) {
      h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
      h = (h << 13) | (h >>> 19);
    }
    return () => {
      h = Math.imul(h ^ (h >>> 16), 2246822507);
      h = Math.imul(h ^ (h >>> 13), 3266489909);
      return ((h ^= h >>> 16) >>> 0) / 4294967296;
    };
  };

  const todayStr = new Date().toISOString().slice(0, 10);
  const userUid = user?.uid || 'guest-traveller';
  const rand = seedRandom(`${userUid}-${todayStr}`);

  // Select 3 activities dynamically (1 project, 1 mystery, 1 campaign)
  const projectPool = GanacheGroveTownData.problems.filter(p => p.category === 'project');
  const mysteryPool = GanacheGroveTownData.problems.filter(p => p.category === 'mystery');
  const campaignPool = GanacheGroveTownData.problems.filter(p => ['health', 'market', 'trade'].includes(p.category));

  const selectedProj = projectPool[Math.floor(rand() * projectPool.length)] || GanacheGroveTownData.problems[0];
  const selectedMyst = mysteryPool[Math.floor(rand() * mysteryPool.length)] || GanacheGroveTownData.problems[1];
  const selectedCamp = campaignPool[Math.floor(rand() * campaignPool.length)] || GanacheGroveTownData.problems[2];

  const dailyActivities = [selectedProj, selectedMyst, selectedCamp];

  const handleExecuteMatter = (id: string) => {
    if (completedActions.includes(id)) {
      triggerFeedback('Γ£à Action already completed today!');
      return;
    }

    const act = GanacheGroveTownData.problems.find(a => a.id === id);
    if (!act) {
      triggerFeedback('Γ¥î Action not found!');
      return;
    }

    if (!act.costCheck(inventory, coins)) {
      triggerFeedback(`Γ¥î Insufficient resources! ${act.requirementsSummary}`);
      return;
    }

    const res = act.execute(inventory, coins);

    if (res.deductions.coins > 0) {
      spendCoins(res.deductions.coins, `Funded Action: ${act.title}`);
    }

    if (Object.keys(res.deductions.inventory).length > 0) {
      setInventory(prev => {
        const next = { ...prev };
        for (const [item, qty] of Object.entries(res.deductions.inventory)) {
          next[item] = Math.max(0, (next[item] || 0) - qty);
        }
        return next;
      });
    }

    const speedMult = TRANSPORT_SPEEDS[activeTransport] || 40;
    const travelDist = 1200;
    const travelDuration = Math.max(2000, Math.round((travelDist / speedMult) * 1000));
    const workDuration = 10000;

    addToQueue({
      name: `Travel to ${act.title} Site`,
      type: 'travel',
      duration: travelDuration,
      rewardCoins: 0,
      rewardXP: 0,
      rewardXPCat: '',
      rewardLegacy: 0,
      icon: '≡ƒÜ╢',
      targetText: 'Maintenance Site (1200m)',
    });

    addToQueue({
      name: act.title,
      type: 'work',
      duration: workDuration,
      rewardCoins: 35,
      rewardXP: res.xp.amount,
      rewardXPCat: res.xp.skill,
      rewardLegacy: res.legacy,
      icon: '≡ƒ¢á∩╕Å',
      targetText: act.title,
      actionId: id,
    });

    triggerFeedback(`≡ƒôª Task initiated! Funded resources and added 2 transit tasks to your Residency Queue.`);
  };

  useEffect(() => {
    // Auto-trigger the first quest to pull the player into the activity immediately
    if (taskQueue.length === 0 && !completedActions.includes(selectedProj.id)) {
      const timer = setTimeout(() => {
        handleExecuteMatter(selectedProj.id);
      }, 1500);
      return () => clearTimeout(timer);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProj.id, taskQueue.length, completedActions]);

  const details = TOWN_DETAILS[homeTown || 'ganache-grove'] || TOWN_DETAILS['ganache-grove'];
  const townName = (homeTown || 'ganache-grove').replace('-', ' ').replace(/\b\w/g, c => c.toUpperCase());

  return (
    <div className="w-full flex-grow flex flex-col justify-between min-h-0 relative">

      {/* Title Header */}
      <div 
        className="flex flex-col md:flex-row items-center justify-between border-b border-white/10 pb-1.5 shrink-0 gap-3 relative mb-1"
      >
        <div>
          <span className="text-[9px] font-black uppercase tracking-[0.35em] text-amber-400">
            {details.county} ΓÇó Valid Passport Holder
          </span>
          <h1 className="text-xl md:text-2xl font-brand uppercase text-white tracking-tight leading-none" style={{ fontFamily: FONT }}>
            {townName} Resident Desk
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {/* Statistics Banner */}
          <div className="flex items-center gap-3 bg-black/60 border border-white/15 px-3 py-1 rounded-2xl text-xs font-semibold select-none text-white">
            <div className="flex flex-col text-left px-1 border-r border-white/10">
              <span className="text-[8px] uppercase tracking-widest text-neutral-400">Standing</span>
              <span className="text-amber-400 font-brand text-xs uppercase" style={{ fontFamily: '"Josefin Sans", sans-serif' }}>
                {getProvincialStanding(legacyPoints)}
              </span>
            </div>
            <div className="flex flex-col text-left px-1 border-r border-white/10">
              <span className="text-[8px] uppercase tracking-widest text-neutral-400">Actions</span>
              <span className="text-cyan-400 font-brand text-xs uppercase" style={{ fontFamily: '"Josefin Sans", sans-serif' }}>
                {4 - completedActions.filter(x => ['walkway', 'bell', 'sneezles', 'festival'].includes(x)).length} Pending
              </span>
            </div>
            <div className="flex flex-col text-left px-1">
              <span className="text-[8px] uppercase tracking-widest text-neutral-400">Wallet</span>
              <span className="text-emerald-400 font-semibold text-xs flex items-center gap-0.5">
                <span>≡ƒÆÄ</span> {coins}
              </span>
            </div>
          </div>

          {setShowFlashNewsModal && (
            <button
              onClick={() => setShowFlashNewsModal(true)}
              className="px-3.5 py-1.5 bg-amber-500/20 hover:bg-amber-500/35 border border-amber-500/40 text-[10px] font-brand uppercase tracking-wider text-amber-300 rounded-xl transition flex items-center gap-1 shadow-md"
              style={{ fontFamily: '"Josefin Sans", sans-serif' }}
            >
              <span>≡ƒô»</span> Flash News
            </button>
          )}

          <button
            onClick={() => setShowDailyDispatch(true)}
            className="px-3.5 py-1.5 bg-gradient-to-r from-pink-500/20 to-purple-500/20 hover:bg-gradient-to-r hover:from-pink-500/35 hover:to-purple-500/35 border border-pink-500/40 text-[10px] font-brand uppercase tracking-wider text-pink-300 rounded-xl transition flex items-center gap-1 shadow-md animate-pulse"
            style={{ fontFamily: '"Josefin Sans", sans-serif' }}
          >
            <span>≡ƒô»</span> Daily Dispatch
          </button>

          <button
            onClick={() => {
              if (coins < 15) {
                triggerFeedback("Γ¥î Cannot Relocate! Relocation fee is 15 Cocoa Coins.");
              } else {
                setPage('choose-town');
              }
            }}
            className="px-3.5 py-1.5 bg-neutral-850 hover:bg-neutral-800 border border-white/10 text-[10px] font-brand uppercase tracking-wider text-white rounded-xl transition shadow-md"
            style={{ fontFamily: '"Josefin Sans", sans-serif' }}
          >
            Relocate (-15 ≡ƒ¬Ö)
          </button>
          <button
            onClick={() => logout()}
            className="px-3.5 py-1.5 bg-red-900/30 hover:bg-red-800/40 border border-red-500/30 text-[10px] font-brand uppercase tracking-wider text-red-300 rounded-xl transition shadow-md"
            style={{ fontFamily: '"Josefin Sans", sans-serif' }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Scrollable Dashboard Container */}
      <div className="flex-grow overflow-y-auto custom-scrollbar my-3 space-y-6 pr-1 min-h-0">

        {/* ΓòÉΓòÉΓòÉ ROOM BROWSER HERO ΓòÉΓòÉΓòÉ */}
        <div className="flex gap-4 shrink-0 h-[450px] md:h-[480px]">
          {/* ΓöÇΓöÇ LEFT: Large Room Image ΓöÇΓöÇ */}
          <div className="w-[60%] shrink-0 h-full relative rounded-[2rem] overflow-hidden shadow-[0_8px_40px_rgba(180,120,40,0.25),inset_0_1px_0_rgba(255,255,255,0.25)] border border-amber-500/20 bg-black">
            {HOME_ROOMS.map(room => (
              <img
                key={room.id}
                src={room.image}
                alt={room.name}
                className={`absolute inset-0 w-full h-full object-cover rounded-[2rem] transition-opacity duration-700 ease-in-out ${activeRoom === room.id ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                style={{ objectPosition: 'center bottom' }}
              />
            ))}

            {/* Gradients */}
            <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-black/75 to-transparent z-20 pointer-events-none" />
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/50 to-transparent z-20 pointer-events-none" />

            {/* HUD top bar removed */}

            {/* Bottom room label */}
            <div className="absolute bottom-4 left-4 right-4 z-30 flex items-end justify-between pointer-events-none">
              <div>
                <div className="text-[9px] text-white/50 uppercase tracking-wider font-black">Current View</div>
                <div className="text-white font-black text-base leading-none" style={{ fontFamily: '"Josefin Sans", sans-serif' }}>
                  {HOME_ROOMS.find(r => r.id === activeRoom)?.name}
                </div>
              </div>
            </div>

            {/* Hotspot HUD pins overlay */}
            {ROOM_HOTSPOTS[activeRoom]
              ?.filter(spot => {
                const spotState = hudChoresState[spot.id];
                return spotState && !spotState.completed;
              })
              .map((spot) => {
                const spotState = hudChoresState[spot.id];
                const activeChore = spot.chores[spotState?.choreIndex ?? 0];
                const remainingMs = Math.max(0, (spotState?.expiresAt ?? 0) - Date.now());
                const formattedTime = formatTimer(Math.floor(remainingMs / 1000));
                return (
                  <button
                    key={spot.id}
                    onClick={() => {
                      setActiveHotspot(spot);
                      setLastInteractionTime(Date.now());
                    }}
                    className="group absolute z-30 w-10 h-10 rounded-full border-2 border-pink-300 bg-gradient-to-tr from-rose-700 via-pink-600 to-rose-500 flex items-center justify-center cursor-pointer shadow-[0_0_20px_rgba(236,72,153,0.9),_0_0_40px_rgba(236,72,153,0.4)] hover:scale-125 hover:rotate-6 hover:border-white transition-all duration-300 text-lg"
                    style={{ top: spot.top, left: spot.left }}
                  >
                    {/* Custom Tooltip */}
                    <div className="absolute bottom-full mb-2.5 hidden group-hover:flex flex-col items-start bg-black/95 border border-pink-500 text-white text-[10px] px-3 py-2 rounded-2xl shadow-2xl whitespace-nowrap z-50 pointer-events-none transition-all duration-200">
                      <div className="font-bold text-yellow-300 flex items-center gap-1.5">
                        <span>{spot.emoji}</span>
                        <span>{activeChore.title}</span>
                      </div>
                      <div className="text-pink-300 font-mono mt-0.5 flex items-center gap-1">
                        <span>≡ƒòÆ Expires in:</span>
                        <span className="font-bold">{formattedTime}</span>
                      </div>
                      <div className="text-[9px] text-cyan-300 mt-0.5">
                        Reward: +{activeChore.xpReward} XP ({activeChore.xpCategory.toUpperCase()})
                      </div>
                    </div>

                    {/* Ping effect ring for max visibility */}
                    <span className="absolute -inset-1.5 rounded-full bg-pink-400/40 animate-ping z-0 pointer-events-none" />
                    <span className="relative z-10">{spot.emoji}</span>
                  </button>
                );
              })}

            {/* Pink/Maroon Hotspot Detail Overlay Card */}
            {activeHotspot && (() => {
              const spotState = hudChoresState[activeHotspot.id];
              const activeChore = activeHotspot.chores[spotState?.choreIndex ?? 0];
              if (!activeChore) return null;
              return (
                <div className="absolute z-40 inset-x-4 bottom-4 bg-[#4c0519]/95 border border-pink-500/50 rounded-2xl p-4 shadow-2xl flex flex-col gap-2.5 animate-slide-up text-left select-none text-pink-100">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[8px] font-black uppercase tracking-[0.25em] text-pink-300">Cottage Chore HUD</span>
                      <h4 className="text-sm font-bold text-yellow-200 mt-0.5 flex items-center gap-1.5 font-brand">
                        <span>{activeHotspot.emoji}</span> {activeChore.title}
                      </h4>
                    </div>
                    <button
                      onClick={() => {
                        setActiveHotspot(null);
                        setLastInteractionTime(Date.now());
                      }}
                      className="text-pink-300 hover:text-white text-xs font-black px-1.5 py-0.5 rounded bg-pink-950 border border-pink-800/40"
                    >
                      Γ£ò Close
                    </button>
                  </div>
                  <p className="text-[11px] text-pink-200/90 leading-relaxed font-sans">{activeChore.chore}</p>
                  <div className="flex justify-between items-center pt-1 border-t border-pink-900/40">
                    <span className="text-[10px] text-cyan-300 font-bold">XP Reward: +{activeChore.xpReward} {activeChore.xpCategory.toUpperCase()} XP</span>
                    <button
                      onClick={() => {
                        handleOpenPuzzle(activeHotspot, activeChore);
                      }}
                      className="px-3.5 py-1.5 bg-gradient-to-r from-pink-500 to-rose-600 hover:scale-105 active:scale-95 text-white text-[10px] font-black uppercase tracking-wider rounded-xl transition shadow-md"
                      style={{ fontFamily: '"Josefin Sans", sans-serif' }}
                    >
                      Complete Chore ≡ƒº╣
                    </button>
                  </div>
                </div>
              );
            })()}

            {/* Cottage Room Navigation */}
            <div
              className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-0"
              onMouseEnter={() => {
                setShowHomeNav(true);
                setLastInteractionTime(Date.now());
              }}
              onMouseLeave={() => {
                setShowHomeNav(false);
                setLastInteractionTime(Date.now());
              }}
            >
              <div className={`flex flex-col items-center gap-1.5 mb-2 transition-all duration-300 origin-bottom ${showHomeNav ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-75 pointer-events-none'}`}>
                {HOME_ROOMS.map(room => (
                  <button
                    key={room.id}
                    onClick={() => {
                      setActiveRoom(room.id);
                      setLastInteractionTime(Date.now());
                    }}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-black/85 border border-white/20 hover:border-white/50 text-white text-[10px] font-black uppercase tracking-wide shadow-xl transition-all duration-150 hover:scale-105 whitespace-nowrap"
                    style={{ fontFamily: '"Josefin Sans", sans-serif' }}
                  >
                    <span>{room.icon}</span>
                    <span style={{ color: room.color === 'emerald' ? '#34d399' : room.color === 'amber' ? '#fb923c' : room.color === 'purple' ? '#c084fc' : room.color === 'orange' ? '#fb923c' : room.color === 'cyan' ? '#60a5fa' : '#a3e635' }}>{room.name}</span>
                  </button>
                ))}
              </div>
              <button
                className={`w-9 h-9 rounded-full flex items-center justify-center text-base shadow-2xl border transition-all duration-300 ${showHomeNav ? 'bg-amber-500 border-amber-400 scale-110' : 'bg-black/70 border-white/25 hover:bg-black/90'}`}
                title="Explore Cottage Rooms"
              >
                {showHomeNav ? 'Γ£û' : '≡ƒÅí'}
              </button>
            </div>
          </div>

          {/* ΓöÇΓöÇ RIGHT: Page Navigation Grid (40%) ΓöÇΓöÇ */}
          <div className="flex-1 h-full flex flex-col justify-between pr-1 min-w-0">
            <div className="text-[9px] font-black uppercase tracking-[0.2em] text-neutral-500 px-1 shrink-0 mb-1.5">
              Town Directory
            </div>

            {/* Navigation buttons in 2 rows, glassy and lovelier */}
            <div className="grid grid-cols-4 gap-2.5 flex-grow min-h-0">
              {HOME_NAV_ITEMS.map(nav => {
                // To keep it 2 rows: 8 items fit nicely in 4 columns
                return (
                  <button
                    key={nav.id}
                    onClick={() => pushPage(nav.id)}
                    className="relative flex flex-col items-center justify-center p-2 rounded-2xl border border-white/10 hover:border-amber-400/40 bg-black/60 hover:bg-black/80 transition-all duration-250 hover:scale-[1.03] text-center group shadow-lg select-none min-h-0"
                  >
                    <div className="w-16 h-16 shrink-0 transition-transform duration-200 group-hover:scale-110 flex items-center justify-center">
                      {nav.icon.startsWith('/') ? (
                        <img src={nav.icon} alt={nav.label} className="w-full h-full object-contain filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.4)]" />
                      ) : (
                        <span className="text-4xl filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.4)]">{nav.icon}</span>
                      )}
                    </div>
                    <div className="text-[10px] font-brand uppercase tracking-wider text-white group-hover:text-amber-300 transition-colors mt-2" style={{ fontFamily: '"Josefin Sans", sans-serif' }}>
                      {nav.label}
                    </div>
                    <div className="text-[8px] text-neutral-400 mt-0.5 truncate max-w-full hidden xl:block px-1">
                      {nav.desc}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Quick Action Log summary at the bottom */}
            <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between shrink-0">
              <span className="text-[8px] font-black uppercase tracking-[0.2em] text-neutral-500">Residency Action Log</span>
              <span className="text-[8px] bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded-full font-black">
                {acceptedItems.filter(i => i.status === 'pending').length} Active Tasks
              </span>
            </div>
          </div>
        </div>

        {/* Gap */}
        <div className="h-10 shrink-0" />

        {/* Heading: Meet the characters of the town */}
        <div className="text-left shrink-0">
          <span className="text-[9px] font-black uppercase tracking-[0.35em] text-cyan-400">
            Ganache Grove Registry
          </span>
          <h2 className="text-xl md:text-2xl font-brand uppercase text-white tracking-tight leading-none mt-1.5 mb-6" style={{ fontFamily: FONT }}>
            Meet the characters of the town
          </h2>
        </div>

        {/* ΓòÉΓòÉΓòÉ CHARACTER SHOWCASE SLIDER ΓòÉΓòÉΓòÉ */}
        <div 
          className="w-full h-[60vh] min-h-[550px] rounded-[2.4rem] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.8)] border-2 border-white/10 relative group bg-black/60 z-10 select-none shrink-0" 
        >
          <div className="w-full h-full flex flex-col md:flex-row relative">

            {/* LEFT: HERO IMAGE PANE (60%) - Edge to edge cinematic cover inside frame */}
            <div className="w-full md:w-[60%] bg-black/60 flex items-center justify-center p-3 relative overflow-hidden group border-r border-white/5 h-full">
              {/* Background Ambient Glow */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.5)_0%,transparent_100%)] opacity-100" />

              <div key={GANACHE_CHARACTERS[activeCharIndex].id} className="w-full h-full relative animate-key-fade-scale flex items-center justify-center">
                <div className="relative w-full h-full rounded-[1.6rem] border-2 border-white/15 shadow-[0_20px_60px_rgba(0,0,0,0.8)] bg-gradient-to-br from-[#141d12] via-[#0a0f09] to-[#050704] overflow-hidden flex items-center justify-center">
                  {/* Sharp foreground portrait image centered without cropping */}
                  <img
                    src={GANACHE_CHARACTERS[activeCharIndex].image}
                    alt={GANACHE_CHARACTERS[activeCharIndex].name}
                    className="relative max-w-full max-h-full object-contain z-10 p-2"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/Assets/Ganache Grove/Scene_0.1.png';
                    }}
                  />
                  {/* Vignette for depth */}
                  <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.75)] pointer-events-none z-20" />
                  {/* Flash Effect on Change */}
                  <div className="absolute inset-0 bg-white/5 animate-pulse pointer-events-none"></div>
                </div>
              </div>
            </div>

            {/* RIGHT: TEXT & STATS CONTENT (40%) */}
            <div className="w-full md:w-[40%] flex flex-col justify-center p-3 relative z-20 h-full flex-shrink-0 bg-gradient-to-l from-black/60 to-transparent transition-all duration-500">
              <div className="w-full h-full rounded-[1.6rem] border border-white/15 shadow-[0_20px_60px_rgba(0,0,0,0.8)] bg-black/25 overflow-hidden relative p-5 flex flex-col justify-between">
                <div className="flex-1 min-h-0 overflow-y-auto pr-1 custom-scrollbar animate-key-slide-in pointer-events-auto">
                  {/* Name */}
                  <div className="mb-1">
                    <span className="text-[8px] font-black uppercase tracking-[0.25em] text-amber-400">
                      {GANACHE_CHARACTERS[activeCharIndex].clan} Clan
                    </span>
                    <h2 
                      className="text-xl md:text-2xl font-brand uppercase leading-tight tracking-tight text-white mt-0.5"
                      style={{ fontFamily: FONT }}
                    >
                      {GANACHE_CHARACTERS[activeCharIndex].name}
                    </h2>
                  </div>

                  {/* Role & Slogan */}
                  <div className="text-xs font-semibold text-cyan-300 uppercase tracking-wider mb-2">
                    {GANACHE_CHARACTERS[activeCharIndex].role}
                  </div>

                  {/* Description */}
                  <div className="max-w-xl transition-all duration-700 mb-3 border-l-2 border-white/20 pl-3 py-1">
                    <div className="text-xs md:text-sm font-body text-white/80 leading-relaxed italic filter drop-shadow-md">
                      {GANACHE_CHARACTERS[activeCharIndex].description}
                    </div>
                  </div>

                  {/* PAGE TOGGLE TABS */}
                  <div className="flex gap-2 mb-4">
                    <button 
                      onClick={() => setCharContentTab('registry')}
                      className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-300 border ${charContentTab === 'registry' ? 'bg-cyan-400 text-black border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.5)]' : 'bg-black/60 text-white/40 border-white/10 hover:bg-black/60'}`}
                    >
                      Registry
                    </button>
                    <button 
                      onClick={() => setCharContentTab('lore')}
                      className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-300 border ${charContentTab === 'lore' ? 'bg-purple-500 text-white border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.5)]' : 'bg-black/60 text-white/40 border-white/10 hover:bg-black/60'}`}
                    >
                      Deep Lore
                    </button>
                  </div>

                  <div className="relative overflow-hidden">
                    {charContentTab === 'registry' ? (
                      <div className="space-y-4 animate-key-slide-in">
                        {/* Info Lines Grid */}
                        <div className="w-full grid grid-cols-1 gap-2 bg-black/30 p-3 rounded-xl border border-white/10 shadow-inner">
                          <div className="rounded-lg border border-white/10 bg-black/35 px-2.5 py-1.5 flex justify-between items-center">
                            <span className="text-[9px] uppercase tracking-[0.16em] font-black text-cyan-300">Age</span>
                            <span className="text-xs text-white/90 font-bold">{GANACHE_CHARACTERS[activeCharIndex].age || 'Unknown'}</span>
                          </div>
                          <div className="rounded-lg border border-white/10 bg-black/35 px-2.5 py-1.5 flex justify-between items-center">
                            <span className="text-[9px] uppercase tracking-[0.16em] font-black text-cyan-300">Specialty</span>
                            <span className="text-xs text-white/90 font-semibold">{GANACHE_CHARACTERS[activeCharIndex].specialty || 'None'}</span>
                          </div>
                          <div className="rounded-lg border border-white/10 bg-black/35 px-2.5 py-1.5 flex justify-between items-center">
                            <span className="text-[9px] uppercase tracking-[0.16em] font-black text-cyan-300">Favorite Prop</span>
                            <span className="text-xs text-white/90 font-semibold">{GANACHE_CHARACTERS[activeCharIndex].favoriteProp || 'None'}</span>
                          </div>
                        </div>

                        {/* STATISTICS GRAPHS */}
                        <div className="w-full grid grid-cols-2 gap-x-4 gap-y-2 bg-black/30 p-3 rounded-xl border border-white/10 shadow-inner">
                          {[
                            { key: 'mischief', label: 'Mischief', color: 'bg-pink-500' },
                            { key: 'agility', label: 'Agility', color: 'bg-amber-500' },
                            { key: 'courage', label: 'Courage', color: 'bg-blue-500' },
                            { key: 'strength', label: 'Strength', color: 'bg-red-500' }
                          ].map((stat) => {
                            const val = GANACHE_CHARACTERS[activeCharIndex].stats[stat.key] || 0;
                            return (
                              <div key={stat.key} className="flex flex-col gap-1 group/stat">
                                <div className="flex justify-between items-end">
                                  <span className="text-[9px] font-black uppercase tracking-widest text-white/40 group-hover/stat:text-white/70 transition-colors">{stat.label}</span>
                                  <span className="text-[9px] font-bold text-white/60">{val}%</span>
                                </div>
                                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                  <div
                                    className={`h-full rounded-full ${stat.color} shadow-[0_0_8px_currentColor] opacity-90`}
                                    style={{ width: val + '%', transition: 'width 1s ease-out' }}
                                  ></div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3 animate-key-slide-in">
                        {GANACHE_CHARACTERS[activeCharIndex].loreSections.map((section, idx) => (
                          <div key={idx} className="bg-black/30 p-3 rounded-xl border border-purple-500/20">
                            <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-purple-400 mb-1 flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,1)]"></span>
                              {section.title}
                            </h4>
                            <p className="text-[11px] text-white/80 leading-relaxed font-body">
                              {section.content}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Indicators - Sleek & Minimal Navigation */}
                <div className="flex items-center justify-between w-full mt-auto pt-3 border-t border-white/5 px-1 shrink-0">
                  <button
                    onClick={() => {
                      setActiveCharIndex((prev) => (prev - 1 + GANACHE_CHARACTERS.length) % GANACHE_CHARACTERS.length);
                    }}
                    className="group/nav flex items-center gap-1.5 transition-all duration-300 text-white/40 hover:text-cyan-300"
                    aria-label="Previous character"
                  >
                    <div className="w-7 h-7 rounded-full flex items-center justify-center border border-white/10 bg-white/5 group-hover/nav:border-cyan-300/50 group-hover/nav:bg-cyan-300/10">
                      <span className="text-base leading-none">ΓÇ╣</span>
                    </div>
                    <span className="text-[9px] font-black tracking-widest uppercase opacity-0 group-hover/nav:opacity-100 -translate-x-2 group-hover/nav:translate-x-0 transition-all hidden sm:block">PREV</span>
                  </button>

                  <div className="flex gap-1 px-2 max-w-[120px] sm:max-w-none overflow-x-auto no-scrollbar">
                    {GANACHE_CHARACTERS.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveCharIndex(idx)}
                        className={`h-1.5 rounded-full transition-all duration-500 flex-shrink-0 ${idx === activeCharIndex ? 'w-6 bg-white shadow-[0_0_8px_white]' : 'w-2 bg-white/20 hover:bg-white/40'}`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={() => {
                      setActiveCharIndex((prev) => (prev + 1) % GANACHE_CHARACTERS.length);
                    }}
                    className="group/nav flex items-center gap-1.5 transition-all duration-300 text-white/40 hover:text-cyan-300"
                    aria-label="Next character"
                  >
                    <span className="text-[9px] font-black tracking-widest uppercase opacity-0 group-hover/nav:opacity-100 translate-x-2 group-hover/nav:translate-x-0 transition-all hidden sm:block">NEXT</span>
                    <div className="w-7 h-7 rounded-full flex items-center justify-center border border-white/10 bg-white/5 group-hover/nav:border-cyan-300/50 group-hover/nav:bg-cyan-300/10">
                      <span className="text-base leading-none">ΓÇ║</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>

          </div>

          <style dangerouslySetInnerHTML={{ __html: SHADOW_SLIDER_CSS }} />
        </div>

        {/* ΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉ */}
        {/* SERIES 1 ΓÇö LIVE ENTRY BANNER (Top of every home page) */}
        {/* ΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉΓòÉ */}
        <div
          className="relative overflow-hidden rounded-3xl cursor-pointer group"
          style={{
            background: 'linear-gradient(135deg, rgba(20,12,5,0.97) 0%, rgba(14,12,8,0.99) 100%)',
            border: '1px solid rgba(245,158,11,0.35)',
            boxShadow: '0 0 40px rgba(245,158,11,0.12), 0 8px 30px rgba(0,0,0,0.5)',
          }}
          onClick={() => setSubPage('series')}
        >
          {/* Amber top glow line */}
          <div className="absolute top-0 left-0 right-0 h-[1.5px]"
               style={{ background: 'linear-gradient(to right, transparent 0%, #f59e0b 40%, #fb923c 60%, transparent 100%)' }} />

          <div className="flex items-stretch gap-0">
            {/* Left: Image */}
            <div className="relative overflow-hidden rounded-l-3xl shrink-0" style={{ width: 150, minHeight: 110 }}>
              <img
                src="/Assets/Ganache Grove/Story_Series1/Scene_01.1.png"
                alt="Series 1"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => { (e.target as HTMLImageElement).src = '/Assets/Ganache Grove/Scene_0.1.png'; }}
              />
              <div className="absolute inset-0"
                   style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.1) 0%, rgba(14,12,8,0.85) 100%)' }} />
              <div className="absolute bottom-2 left-2">
                <span className="text-[7px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-red-500 text-white animate-pulse">
                  ≡ƒö┤ LIVE
                </span>
              </div>
            </div>

            {/* Middle: Content */}
            <div className="flex-1 px-5 py-4 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-[7.5px] font-black uppercase tracking-widest text-amber-400">
                  ≡ƒÜ¿ Series 1 ┬╖ Probationer Arc ┬╖ 5 Events
                </span>
              </div>
              <h3 className="text-base font-brand text-yellow-50 uppercase tracking-wide leading-tight"
                  style={{ fontFamily: FONT }}>
                The Honeyberry Loaf Incident
              </h3>
              <p className="text-[10px] text-neutral-400 leading-relaxed max-w-sm">
                Pipkin Nutterby has run off with Baker Mortimer\'s Honeyberry Loaf! Participate in 5 town events to chase Pipkin and earn the Honeyberry Hero badge.
              </p>
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {[
                  { label: 'Γ£¿ Up to 250 XP', color: '#67e8f9' },
                  { label: '≡ƒ¬Ö Up to 65 Coins', color: '#6ee7b7' },
                  { label: '≡ƒÅà Honeyberry Hero Badge', color: '#c4b5fd' },
                  { label: '≡ƒÅå +100 XP Completion Bonus', color: '#fb923c' },
                ].map(pill => (
                  <span key={pill.label} className="px-2 py-0.5 rounded-lg text-[8px] font-black"
                        style={{
                          background: `${pill.color}18`,
                          border: `1px solid ${pill.color}30`,
                          color: pill.color,
                        }}>
                    {pill.label}
                  </span>
                ))}
              </div>
            </div>

            {/* Right: CTA */}
            <div className="flex flex-col items-center justify-center px-5 shrink-0 gap-2" style={{ minWidth: 140 }}>
              <button
                className="w-full py-3 rounded-2xl font-black uppercase tracking-widest text-[9.5px] text-black transition active:scale-95 group-hover:brightness-110"
                style={{
                  background: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)',
                  boxShadow: '0 0 20px rgba(245,158,11,0.3)',
                  fontFamily: '"Josefin Sans", sans-serif',
                }}
              >
                View Series ΓåÆ
              </button>
              <span className="text-[7.5px] text-white/25 text-center">Auto-advances daily</span>
            </div>
          </div>
        </div>

        {/* Cocoa Chat Promotional Card */}
        <div
          onClick={() => setPage('cocoa-chat')}
          className="relative overflow-hidden rounded-3xl cursor-pointer group border border-pink-500/30 bg-gradient-to-r from-pink-950/20 via-rose-950/10 to-pink-950/20 p-5 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-[0_8px_30px_rgba(244,63,94,0.08)] hover:shadow-[0_8px_40px_rgba(244,63,94,0.15)] transition-all duration-300 select-none"
        >
          {/* Sparkles backdrop */}
          <div className="absolute top-0 right-0 p-3 text-3xl opacity-20 pointer-events-none select-none">
            ≡ƒÆ¼
          </div>
          <div className="flex items-center gap-4">
            <span className="text-3xl shrink-0">≡ƒî╕</span>
            <div className="text-left">
              <span className="text-[9px] font-black uppercase tracking-[0.25em] text-pink-400">LORE COMPANION</span>
              <h3 className="text-base font-brand text-pink-100 uppercase mt-0.5" style={{ fontFamily: FONT }}>
                Talk with Cocoa the Lore Keeper!
              </h3>
              <p className="text-[11.5px] text-pink-200/60 leading-normal font-sans">
                Have questions about Cocoa Coins, relocation guidelines, or the Honeyberry Incident? Ask Cocoa for patient, friendly advice!
              </p>
            </div>
          </div>
          <button
            className="px-4 py-2.5 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-brand font-black uppercase text-[10px] tracking-wider rounded-xl transition hover:scale-105 shrink-0"
            style={{ fontFamily: '"Josefin Sans", sans-serif' }}
          >
            Chat with Cocoa Γ£ë∩╕Å
          </button>
        </div>


        {/* Onboarding Guide Card */}
        <div className="p-5 bg-gradient-to-r from-amber-500/10 via-yellow-500/5 to-cyan-500/10 border-2 border-amber-500/35 rounded-3xl text-left space-y-3 shadow-lg relative overflow-hidden shrink-0 select-none animate-pulse-slow">

          <div className="absolute top-0 right-0 p-3 text-3xl opacity-20 pointer-events-none select-none">
            ≡ƒº¡
          </div>
          <div>
            <span className="text-[9px] font-black uppercase tracking-[0.25em] text-amber-400">ORIENTATION BULLETIN</span>
            <h3 className="text-base font-brand text-white uppercase mt-0.5" style={{ fontFamily: FONT }}>
              Welcome to Ganache Grove! Here is Your Daily Checklist:
            </h3>
            <p className="text-[11px] text-neutral-300">New around here? Follow these three essential steps to start earning coins, reputation, and experience points.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Step 1: Read News */}
            <div className={`p-3 rounded-2xl border flex items-center justify-between gap-2 transition-all ${dossierRead ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-white/5 border-white/10 text-white'}`}>
              <div className="min-w-0">
                <span className="text-[8px] uppercase tracking-wider block font-bold text-neutral-400">Step 1</span>
                <span className="text-[11px] font-semibold block truncate">Read Daily Briefing</span>
                <span className="text-[9.5px] opacity-80 block">Open Newspaper to claim 30≡ƒ¬Ö</span>
              </div>
              {dossierRead ? (
                <span className="text-xs font-bold shrink-0">Γ£à Done</span>
              ) : (
                <button
                  onClick={() => setShowDossierPlaycard(true)}
                  className="px-2 py-1 bg-amber-500 hover:bg-amber-400 text-black text-[9px] font-brand uppercase tracking-wider rounded-lg transition shrink-0"
                  style={{ fontFamily: '"Josefin Sans", sans-serif' }}
                >
                  Read
                </button>
              )}
            </div>

            {/* Step 2: Stamp Passport */}
            {(() => {
              const isStamped = lastStampedDate === new Date().toISOString().slice(0, 10);
              return (
                <div className={`p-3 rounded-2xl border flex items-center justify-between gap-2 transition-all ${isStamped ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-white/5 border-white/10 text-white'}`}>
                  <div className="min-w-0">
                    <span className="text-[8px] uppercase tracking-wider block font-bold text-neutral-400">Step 2</span>
                    <span className="text-[11px] font-semibold block truncate">Log Daily Presence</span>
                    <span className="text-[9.5px] opacity-80 block">Go to Passport for 10 XP</span>
                  </div>
                  {isStamped ? (
                    <span className="text-xs font-bold shrink-0">Γ£à Logged</span>
                  ) : (
                    <button
                      onClick={() => setSubPage('stampbook')}
                      className="px-2 py-1 bg-amber-500 hover:bg-amber-400 text-black text-[9px] font-brand uppercase tracking-wider rounded-lg transition shrink-0"
                      style={{ fontFamily: '"Josefin Sans", sans-serif' }}
                    >
                      Log
                    </button>
                  )}
                </div>
              );
            })()}

            {/* Step 3: Complete Town Matter */}
            {(() => {
              const completedCount = completedActions.filter(x => ['walkway', 'bell', 'sneezles', 'festival', selectedProj.id, selectedMyst.id, selectedCamp.id].includes(x)).length;
              const isDone = completedCount > 0;
              return (
                <div className={`p-3 rounded-2xl border flex items-center justify-between gap-2 transition-all ${isDone ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-white/5 border-white/10 text-white'}`}>
                  <div className="min-w-0">
                    <span className="text-[8px] uppercase tracking-wider block font-bold text-neutral-400">Step 3</span>
                    <span className="text-[11px] font-semibold block truncate">Assist with Town Matter</span>
                    <span className="text-[9.5px] opacity-80 block">Support a project below</span>
                  </div>
                  {isDone ? (
                    <span className="text-xs font-bold shrink-0">Γ£à Complete</span>
                  ) : (
                    <span className="text-[9px] text-amber-400 font-bold uppercase shrink-0 font-mono tracking-wider animate-pulse">Pending</span>
                  )}
                </div>
              );
            })()}
          </div>
        </div>

        {/* ΓöÇΓöÇ ROOM POPUP OVERLAY ΓöÇΓöÇ */}
        {activeRoomPopup && (() => {
          const room = HOME_ROOMS.find(r => r.id === activeRoomPopup);
          if (!room) return null;
          return (
            <div
              className="fixed inset-0 z-[250] flex items-center justify-center p-4"
              style={{ background: 'rgba(0,0,0,0.8)' }}
              onClick={() => setActiveRoomPopup(null)}
            >
              <div
                className="relative bg-neutral-950 border border-white/20 rounded-[2rem] p-6 w-full max-w-2xl shadow-2xl flex flex-col gap-4"
                style={{ maxHeight: '80vh', overflowY: 'auto' }}
                onClick={e => e.stopPropagation()}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[8px] font-black uppercase tracking-[0.3em] text-neutral-400">{getChocolateDate()} ┬╖ Mossberry Lane 14</div>
                    <h2 className="text-xl font-brand text-white uppercase mt-0.5 flex items-center gap-2" style={{ fontFamily: FONT }}>
                      <span>{room.icon}</span> {room.name}
                    </h2>
                  </div>
                  <button
                    onClick={() => setActiveRoomPopup(null)}
                    className="w-10 h-10 hover:scale-110 active:scale-95 transition-all flex items-center justify-center filter drop-shadow-md"
                  >
                    <img src="/Assets/Icons/Icons_Chocobrook_q2.png" alt="Close" className="w-full h-full object-contain" />
                  </button>
                </div>

                <div className="space-y-3">
                  {room.items.map((item, idx) => (
                    <div key={idx} className="p-4 bg-white/5 border border-white/10 rounded-2xl flex flex-col gap-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-base">{item.type === 'coin' ? '≡ƒ¬Ö' : item.type === 'opportunity' ? '≡ƒô£' : item.type === 'letter' ? 'Γ£ë∩╕Å' : item.type === 'task' ? '∩╕Å' : '≡ƒôó'}</span>
                            <span className="text-xs font-black text-white uppercase tracking-wide">{item.title}</span>
                          </div>
                          <p className="text-[11px] text-white/60 mt-1 leading-relaxed">{item.desc}</p>
                        </div>
                        {item.reward && (
                          <div className="shrink-0 text-right">
                            <span className="text-[9px] text-amber-400 font-black block">Reward</span>
                            <span className="text-base font-black text-amber-400">+{item.reward}</span>
                            <span className="text-[8px] text-amber-400/60 block">{item.type === 'letter' ? 'Legacy' : 'Coins'}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2 flex-wrap">
                        <button
                          onClick={() => acceptItem(room.id, item)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-black text-[9px] font-black uppercase rounded-xl transition"
                        >
                          Γ£à Accept
                        </button>
                        <button
                          onClick={() => {
                            triggerFeedback(`≡ƒÆ╛ Saved "${item.title}" for later.`);
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/15 border border-white/15 text-white text-[9px] font-black uppercase rounded-xl transition"
                        >
                          ≡ƒÆ╛ Save
                        </button>
                        <button
                          onClick={() => {
                            triggerFeedback(`Γ¥î Rejected "${item.title}".`);
                            setActiveRoomPopup(null);
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-red-900/30 hover:bg-red-900/50 border border-red-500/25 text-red-300 text-[9px] font-black uppercase rounded-xl transition"
                        >
                          Γ¥î Reject
                        </button>
                        <button
                          onClick={() => {
                            const shareText = `≡ƒì½ Toffee Towns ΓÇó ${item.title}\n"${item.desc}"\nJoin me in Ganache Grove! toffeetowns.fun`;
                            navigator.clipboard.writeText(shareText).then(() => triggerFeedback(`≡ƒñ¥ Copied "${item.title}" to share with a friend!`));
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-900/30 hover:bg-purple-900/50 border border-purple-500/25 text-purple-300 text-[9px] font-black uppercase rounded-xl transition"
                        >
                          ≡ƒñ¥ Share
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between text-[9px] text-white/30 border-t border-white/5 pt-3">
                  <span>≡ƒì½ Confection Year Cycle ΓÇó Cocoawood County</span>
                  <button
                    onClick={() => setActiveRoomPopup(null)}
                    className="px-3 py-1 bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 rounded-xl font-black uppercase text-[8px] transition"
                  >
                    Close Room
                  </button>
                </div>
              </div>
            </div>
          );
        })()}

        {/* ΓòÉΓòÉΓòÉ Resident Report Card Section ΓòÉΓòÉΓòÉ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 p-1 shrink-0">
          {/* LEFT COLUMN: Resident Report Card */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="rounded-3xl border border-amber-500/25 bg-amber-500/5 p-5 flex flex-col gap-4 shadow-lg">
              <div className="flex items-center justify-between border-b border-amber-500/20 pb-2">
                <h3 className="text-sm font-brand text-amber-300 uppercase flex items-center gap-1.5" style={{ fontFamily: FONT }}>
                  ≡ƒôï Resident Report Card
                </h3>
                <span className="text-[9px] text-amber-400/80 font-black uppercase tracking-wider">Mossberry Lane 14</span>
              </div>

              <div className="space-y-2.5">
                <h4 className="text-[10px] font-black uppercase tracking-wider text-neutral-400">Residency Routine Progression</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="flex items-center justify-between p-2.5 bg-white/5 border border-white/5 rounded-xl">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-sm shrink-0">{dossierRead ? 'Γ£à' : '≡ƒôÑ'}</span>
                      <span className={`text-[11px] truncate ${dossierRead ? 'line-through text-white/30 font-medium' : 'text-white font-medium'}`}>Morning Briefing</span>
                    </div>
                    {!dossierRead && (
                      <button onClick={() => setShowDossierPlaycard(true)} className="text-[9px] bg-amber-500 hover:bg-amber-400 text-black px-2 py-0.5 rounded-md uppercase font-black shrink-0">Open</button>
                    )}
                  </div>

                  <div className="flex items-center justify-between p-2.5 bg-white/5 border border-white/5 rounded-xl">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-sm shrink-0">
                        {completedActions.filter(x => ['walkway', 'bell', 'sneezles', 'festival'].includes(x)).length >= 3 ? 'Γ£à' : '≡ƒ¢á∩╕Å'}
                      </span>
                      <span className={`text-[11px] truncate ${completedActions.filter(x => ['walkway', 'bell', 'sneezles', 'festival'].includes(x)).length >= 3 ? 'line-through text-white/30 font-medium' : 'text-white font-medium'}`}>
                        Actions ({completedActions.filter(x => ['walkway', 'bell', 'sneezles', 'festival'].includes(x)).length}/3)
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-2.5 bg-white/5 border border-white/5 rounded-xl">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-sm shrink-0">{lastStampedDate === new Date().toISOString().slice(0, 10) ? 'Γ£à' : '≡ƒÄ½'}</span>
                      <span className={`text-[11px] truncate ${lastStampedDate === new Date().toISOString().slice(0, 10) ? 'line-through text-white/30 font-medium' : 'text-white font-medium'}`}>Passport Stamp</span>
                    </div>
                    {lastStampedDate !== new Date().toISOString().slice(0, 10) && (
                      <button onClick={() => setSubPage('stampbook')} className="text-[9px] bg-amber-500 hover:bg-amber-400 text-black px-2 py-0.5 rounded-md uppercase font-black shrink-0">Log</button>
                    )}
                  </div>

                  <div className="flex items-center justify-between p-2.5 bg-white/5 border border-white/5 rounded-xl">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-sm shrink-0">{ownedDecorations.length > 0 || ownedPets.length > 0 ? 'Γ£à' : '≡ƒÅí'}</span>
                      <span className={`text-[11px] truncate ${(ownedDecorations.length > 0 || ownedPets.length > 0) ? 'line-through text-white/30 font-medium' : 'text-white font-medium'}`}>Beautify Cottage</span>
                    </div>
                    {!(ownedDecorations.length > 0 || ownedPets.length > 0) && (
                      <button onClick={() => setSubPage('shop')} className="text-[9px] bg-amber-500 hover:bg-amber-400 text-black px-2 py-0.5 rounded-md uppercase font-black shrink-0">Shop</button>
                    )}
                  </div>
                </div>
              </div>

              <div className="border-t border-white/5 pt-3 space-y-2.5">
                <h4 className="text-[10px] font-black uppercase tracking-wider text-neutral-400">Resident Standings & Ranks</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 bg-white/5 border border-white/5 rounded-2xl flex flex-col gap-1 justify-between">
                    <span className="text-[8px] text-neutral-400 uppercase tracking-widest">Provincial Title</span>
                    <span className="text-white font-black text-xs uppercase" style={{ fontFamily: '"Josefin Sans", sans-serif' }}>{getProvincialStanding(legacyPoints)}</span>
                    <span className="text-[9px] text-neutral-400 font-mono mt-0.5">{legacyPoints} Legacy Pts</span>
                  </div>
                  <div className="p-3 bg-white/5 border border-white/5 rounded-2xl flex flex-col gap-1 justify-between">
                    <span className="text-[8px] text-neutral-400 uppercase tracking-widest">Town Reputation</span>
                    <span className="text-amber-300 font-bold text-xs">
                      {completedActions.filter(x => ['walkway', 'bell', 'sneezles', 'festival'].includes(x)).length >= 3 ? 'ΓÿàΓÿàΓÿàΓÿàΓÿà Champion' :
                       completedActions.filter(x => ['walkway', 'bell', 'sneezles', 'festival'].includes(x)).length === 2 ? 'ΓÿàΓÿàΓÿàΓÿàΓÿå Respected' :
                       completedActions.filter(x => ['walkway', 'bell', 'sneezles', 'festival'].includes(x)).length === 1 ? 'ΓÿàΓÿàΓÿàΓÿåΓÿå Helper' :
                       'ΓÿàΓÿàΓÿåΓÿåΓÿå Visitor'}
                    </span>
                    <span className="text-[9px] text-neutral-400 font-mono mt-0.5">Ganache Grove Parish</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                  <div className="p-2 bg-white/5 border border-white/5 rounded-xl">
                    <span className="text-[8px] text-neutral-400 uppercase tracking-wider block font-bold">Builder</span>
                    <span className="text-white font-semibold text-[10px] block truncate mt-0.5">{getBuilderStanding(skills.builder || 0)}</span>
                    <span className="text-[8.5px] text-cyan-400">Lv. {Math.floor((skills.builder || 0) / 10) + 1}</span>
                  </div>
                  <div className="p-2 bg-white/5 border border-white/5 rounded-xl">
                    <span className="text-[8px] text-neutral-400 uppercase tracking-wider block font-bold">Explorer</span>
                    <span className="text-white font-semibold text-[10px] block truncate mt-0.5">{getExplorerStanding(skills.explorer || 0)}</span>
                    <span className="text-[8.5px] text-cyan-400">Lv. {Math.floor((skills.explorer || 0) / 10) + 1}</span>
                  </div>
                  <div className="p-2 bg-white/5 border border-white/5 rounded-xl">
                    <span className="text-[8px] text-neutral-400 uppercase tracking-wider block font-bold">Healer</span>
                    <span className="text-white font-semibold text-[10px] block truncate mt-0.5">{getHealerStanding(skills.healer || 0)}</span>
                    <span className="text-[8.5px] text-cyan-400">Lv. {Math.floor((skills.healer || 0) / 10) + 1}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Town Pulse & Active Projects */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="rounded-3xl border border-white/10 bg-black/25 p-5 flex flex-col gap-4 shadow-lg h-full justify-between">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <h3 className="text-sm font-brand text-purple-400 uppercase flex items-center gap-1.5" style={{ fontFamily: FONT }}>
                  ≡ƒôï Town Pulse & Active Projects
                </h3>
                <span className="px-1.5 py-0.5 bg-red-900/30 text-red-400 text-[8px] font-bold uppercase rounded border border-red-500/20 font-mono">
                  {dailyActivities.filter(a => !completedActions.includes(a.id)).length} Pending
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 bg-white/5 border border-white/5 rounded-xl flex items-center gap-2">
                  <span className="text-base shrink-0">≡ƒî▓</span>
                  <div className="min-w-0">
                    <span className="text-[7.5px] text-neutral-400 tracking-wider block font-bold uppercase">Mood</span>
                    <span className="text-white font-medium text-[10px] truncate block">Relaxed & Mysterious</span>
                  </div>
                </div>
                <div className="p-2 bg-white/5 border border-white/5 rounded-xl flex items-center gap-2">
                  <span className="text-base shrink-0">≡ƒ⌐║</span>
                  <div className="min-w-0">
                    <span className="text-[7.5px] text-neutral-400 tracking-wider block font-bold uppercase">Health</span>
                    <span className={`font-bold text-[10px] truncate block ${completedActions.includes('sneezles') ? 'text-emerald-400' : 'text-red-400'}`}>
                      {completedActions.includes('sneezles') ? 'Good' : 'Moss Sneezles Warning'}
                    </span>
                  </div>
                </div>
                <div className="p-2 bg-white/5 border border-white/5 rounded-xl flex items-center gap-2">
                  <span className="text-base shrink-0">≡ƒì½</span>
                  <div className="min-w-0">
                    <span className="text-[7.5px] text-neutral-400 tracking-wider block font-bold uppercase">Trade</span>
                    <span className="text-white font-medium text-[10px] truncate block">Busy (Ganache Pods)</span>
                  </div>
                </div>
                <div className="p-2 bg-white/5 border border-white/5 rounded-xl flex items-center gap-2">
                  <span className="text-base shrink-0">≡ƒÜé</span>
                  <div className="min-w-0">
                    <span className="text-[7.5px] text-neutral-400 tracking-wider block font-bold uppercase">Transit</span>
                    <span className="text-white font-medium text-[10px] truncate block">Forest Rail Active</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 border-t border-white/5 pt-3 flex-grow overflow-y-auto custom-scrollbar pr-1">
                <h4 className="text-[10px] font-black uppercase tracking-wider text-neutral-400 mb-1.5">Matters Requiring Attention</h4>

                <div className="flex items-center justify-between p-2 bg-white/5 border border-white/5 rounded-xl gap-2">
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold text-white block truncate">Support: {selectedProj.title.replace('Support ', '')}</span>
                    <span className="text-[8.5px] text-neutral-400 block truncate leading-tight">{selectedProj.requirementsSummary}</span>
                  </div>
                  {completedActions.includes(selectedProj.id) ? (
                    <span className="text-[9px] text-emerald-400 font-bold shrink-0">Γ£ô Done</span>
                  ) : (
                    <button
                      onClick={() => handleExecuteMatter(selectedProj.id)}
                      className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-black text-[8px] font-brand uppercase tracking-wider rounded-md transition shrink-0"
                      style={{ fontFamily: '"Josefin Sans", sans-serif' }}
                    >
                      ≡ƒ¢á∩╕Å Support
                    </button>
                  )}
                </div>

                <div className="flex items-center justify-between p-2 bg-white/5 border border-white/5 rounded-xl gap-2">
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold text-white block truncate">Investigate: {selectedMyst.title.replace('Investigate ', '')}</span>
                    <span className="text-[8.5px] text-neutral-400 block truncate leading-tight">{selectedMyst.requirementsSummary}</span>
                  </div>
                  {completedActions.includes(selectedMyst.id) ? (
                    <span className="text-[9px] text-emerald-400 font-bold shrink-0">Γ£ô Done</span>
                  ) : (
                    <button
                      onClick={() => handleExecuteMatter(selectedMyst.id)}
                      className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-black text-[8px] font-brand uppercase tracking-wider rounded-md transition shrink-0"
                      style={{ fontFamily: '"Josefin Sans", sans-serif' }}
                    >
                      ≡ƒöì Search
                    </button>
                  )}
                </div>

                <div className="flex items-center justify-between p-2 bg-white/5 border border-white/5 rounded-xl gap-2">
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold text-white block truncate">Campaign: {selectedCamp.title.replace('Sponsor ', '').replace('Dredge ', '').replace('Express ', '')}</span>
                    <span className="text-[8.5px] text-neutral-400 block truncate leading-tight">Town Hall Campaign</span>
                  </div>
                  {completedActions.includes(selectedCamp.id) ? (
                    <span className="text-[9px] text-emerald-400 font-bold shrink-0">Γ£ô Done</span>
                  ) : (
                    <button
                      onClick={() => setShowTownHallModal(true)}
                      className="px-2.5 py-1 bg-cyan-600 hover:bg-cyan-500 text-white text-[8px] font-brand uppercase tracking-wider rounded-md transition shrink-0"
                      style={{ fontFamily: '"Josefin Sans", sans-serif' }}
                    >
                      ≡ƒÅ¢∩╕Å Go
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Divider & Header for Folio Section */}
        <div className="flex items-center gap-4 py-2 shrink-0">
          <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent flex-grow" />
          <span className="text-[10px] font-black uppercase tracking-[0.25em] text-neutral-400 font-sans flex items-center gap-1.5 select-none">
            ≡ƒô» Resident Folio & Asset Portfolio
          </span>
          <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent flex-grow" />
        </div>

        {/* Folio Grid Row */}
        <div className="flex flex-col gap-6 p-1 pb-8">
          {/* 1. Citizen Standing & Professional Ranks */}
          <div className="rounded-[2rem] border border-white/10 bg-black/35 p-6 shadow-xl flex flex-col md:flex-row gap-6 items-center justify-between">
            <div className="w-full md:w-1/3 flex flex-col items-center md:items-start text-center md:text-left border-b md:border-b-0 md:border-r border-white/10 pb-4 md:pb-0 md:pr-6">
              <span className="text-[9px] uppercase tracking-widest text-cyan-400 font-bold font-sans">Imperial Residency Rank</span>
              <div className="flex items-center gap-3 mt-2 justify-center md:justify-start">
                <div className="w-16 h-16 rounded-full border border-amber-500/30 bg-amber-500/5 flex items-center justify-center text-3xl shadow-inner shrink-0">
                  ≡ƒÄû∩╕Å
                </div>
                <div>
                  <h4 className="text-base font-brand text-white uppercase leading-tight" style={{ fontFamily: FONT }}>
                    {getProvincialStanding(legacyPoints)}
                  </h4>
                  <span className="text-[10.5px] text-neutral-400 font-semibold font-sans">{legacyPoints} Legacy Points</span>
                </div>
              </div>
              <p className="text-[10.5px] text-neutral-400/80 mt-3 italic font-sans">
                "Your standing reflects your overall civic contributions to Cocoawood County."
              </p>
            </div>

            <div className="w-full md:w-2/3 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center text-[11px] mb-1">
                    <span className="text-neutral-300 font-bold">≡ƒæ╖ Builder</span>
                    <span className="text-cyan-400 font-bold font-mono">Lv. {Math.floor((skills.builder || 0) / 10) + 1}</span>
                  </div>
                  <div className="w-full bg-white/5 border border-white/10 h-2 rounded-full overflow-hidden my-1.5">
                    <div className="bg-cyan-500 h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(100, ((skills.builder || 0) % 10) * 10)}%` }} />
                  </div>
                </div>
                <div className="mt-2">
                  <span className="text-[8.5px] text-neutral-400 block font-bold uppercase tracking-wider">Rank Status</span>
                  <span className="text-white font-semibold text-[10.5px] block truncate">{getBuilderStanding(skills.builder || 0)}</span>
                  <span className="text-[8.5px] text-cyan-400/80 mt-0.5 block font-mono">{skills.builder || 0} Total XP</span>
                </div>
              </div>

              <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center text-[11px] mb-1">
                    <span className="text-neutral-300 font-bold">≡ƒº¡ Explorer</span>
                    <span className="text-cyan-400 font-bold font-mono">Lv. {Math.floor((skills.explorer || 0) / 10) + 1}</span>
                  </div>
                  <div className="w-full bg-white/5 border border-white/10 h-2 rounded-full overflow-hidden my-1.5">
                    <div className="bg-cyan-500 h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(100, ((skills.explorer || 0) % 10) * 10)}%` }} />
                  </div>
                </div>
                <div className="mt-2">
                  <span className="text-[8.5px] text-neutral-400 block font-bold uppercase tracking-wider">Rank Status</span>
                  <span className="text-white font-semibold text-[10.5px] block truncate">{getExplorerStanding(skills.explorer || 0)}</span>
                  <span className="text-[8.5px] text-cyan-400/80 mt-0.5 block font-mono">{skills.explorer || 0} Total XP</span>
                </div>
              </div>

              <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center text-[11px] mb-1">
                    <span className="text-neutral-300 font-bold">≡ƒî┐ Healer</span>
                    <span className="text-cyan-400 font-bold font-mono">Lv. {Math.floor((skills.healer || 0) / 10) + 1}</span>
                  </div>
                  <div className="w-full bg-white/5 border border-white/10 h-2 rounded-full overflow-hidden my-1.5">
                    <div className="bg-cyan-500 h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(100, ((skills.healer || 0) % 10) * 10)}%` }} />
                  </div>
                </div>
                <div className="mt-2">
                  <span className="text-[8.5px] text-neutral-400 block font-bold uppercase tracking-wider">Rank Status</span>
                  <span className="text-white font-semibold text-[10.5px] block truncate">{getHealerStanding(skills.healer || 0)}</span>
                  <span className="text-[8.5px] text-cyan-400/80 mt-0.5 block font-mono">{skills.healer || 0} Total XP</span>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Residency Budget Planner & Rent Registry */}
          <div className="rounded-[2rem] border border-amber-500/25 bg-amber-500/5 p-6 shadow-xl flex flex-col md:flex-row gap-6 items-center justify-between">
            <div className="w-full md:w-[45%] flex flex-col items-center md:items-start text-center md:text-left border-b md:border-b-0 md:border-r border-white/10 pb-4 md:pb-0 md:pr-6 justify-between min-h-[160px]">
              <div>
                <span className="text-[9px] uppercase tracking-widest text-amber-400 font-bold font-sans">Residency Budget Planner</span>
                <div className="flex items-center gap-3 mt-2 justify-center md:justify-start">
                  <div className="w-12 h-12 rounded-full border border-amber-500/30 bg-amber-500/5 flex items-center justify-center text-2xl shadow-inner shrink-0">
                    ≡ƒÅá
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white leading-none">
                      Mossberry Lane 14
                    </h4>
                    <span className="text-[9.5px] text-neutral-400 font-sans mt-0.5 block">Residency Dues Ledger</span>
                  </div>
                </div>
              </div>
              <div className="w-full mt-3">
                <div className="flex justify-between items-center text-xs mb-2">
                  <span className="text-white/60">Rent Status:</span>
                  {rentPaid ? (
                    <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/25 rounded-lg text-[9px] text-emerald-400 uppercase font-black font-sans">
                      Γ£ô Paid / solvent
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 bg-red-500/10 border border-red-500/25 rounded-lg text-[9px] text-red-400 uppercase font-black font-sans animate-pulse">
                      ≡ƒÜ¿ Rent Unpaid
                    </span>
                  )}
                </div>
                {!rentPaid ? (
                  <button
                    onClick={() => {
                      if (spendCoins(100, 'Monthly Housing Dues (Rent + Cleaning + Provisions)')) {
                        setRentPaid(true);
                        localStorage.setItem('tt_rent_paid_cycle', 'true');
                        triggerFeedback('≡ƒÆ│ Monthly housing dues paid! Ledger settled.');
                      } else {
                        // Allow overdrawing and go negative to trigger bankruptcy
                        spendCoins(100, 'Monthly Housing Dues (Rent + Cleaning + Provisions)', true);
                        setRentPaid(true);
                        localStorage.setItem('tt_rent_paid_cycle', 'true');
                        triggerFeedback('≡ƒÆ│ Paid dues via overdraft! Account now bankrupt.');
                      }
                    }}
                    className="w-full py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-black text-[10px] font-brand uppercase tracking-wider rounded-xl transition font-black hover:scale-102 active:scale-98"
                    style={{ fontFamily: '"Josefin Sans", sans-serif' }}
                  >
                    Settle Monthly Dues (-100 ≡ƒ¬Ö)
                  </button>
                ) : (
                  <button
                    disabled
                    className="w-full py-2 bg-white/5 border border-white/10 text-white/20 text-[10px] font-brand uppercase tracking-wider rounded-xl cursor-default text-center font-bold"
                    style={{ fontFamily: '"Josefin Sans", sans-serif' }}
                  >
                    Γ£ô Dues Settled
                  </button>
                )}
              </div>
            </div>

            <div className="flex-1 w-full flex flex-col gap-3 font-sans">
              <span className="text-[9px] text-neutral-400 uppercase tracking-widest font-black block">Residency Cashflow Ledger</span>
              <div className="grid grid-cols-2 gap-4">
                {/* Expenditures */}
                <div className="bg-black/35 border border-white/5 p-3 rounded-2xl space-y-1.5 text-xs">
                  <span className="text-[8px] font-black uppercase tracking-wider text-rose-400 block">Monthly Expenses</span>
                  <div className="flex justify-between text-[11px] text-neutral-300">
                    <span>Cottage Rent:</span>
                    <span className="font-mono font-bold">-50 ≡ƒ¬Ö</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-neutral-300">
                    <span>Cleaners fee:</span>
                    <span className="font-mono font-bold">-10 ≡ƒ¬Ö</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-neutral-300">
                    <span>Provisions/Veg:</span>
                    <span className="font-mono font-bold">-30 ≡ƒ¬Ö</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-neutral-300">
                    <span>Misc/Utilities:</span>
                    <span className="font-mono font-bold">-10 ≡ƒ¬Ö</span>
                  </div>
                  <div className="h-px bg-white/10 my-1" />
                  <div className="flex justify-between text-[11px] font-black text-rose-300">
                    <span>Total Expenses:</span>
                    <span className="font-mono">-100 ≡ƒ¬Ö</span>
                  </div>
                </div>

                {/* Earnings estimation */}
                <div className="bg-black/35 border border-white/5 p-3 rounded-2xl space-y-1.5 text-xs">
                  <span className="text-[8px] font-black uppercase tracking-wider text-emerald-400 block">Estimated Income</span>
                  <div className="flex justify-between text-[11px] text-neutral-300">
                    <span>Daily Stamp:</span>
                    <span className="font-mono font-bold">+20 ≡ƒ¬Ö/d</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-neutral-300">
                    <span>Daily Dispatches:</span>
                    <span className="font-mono font-bold">+60 ≡ƒ¬Ö/d</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-neutral-300">
                    <span>Series Pod Tasks:</span>
                    <span className="font-mono font-bold">+150 ≡ƒ¬Ö/d</span>
                  </div>
                  <div className="h-px bg-white/10 my-1" />
                  <div className="flex justify-between text-[11px] font-black text-emerald-300 animate-pulse">
                    <span>Expected Wallet:</span>
                    <span className="font-mono">+{coins + 230} ≡ƒ¬Ö</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Asset Portfolio */}
          <div className="rounded-[2rem] border border-white/10 bg-black/35 p-6 shadow-xl flex flex-col md:flex-row gap-6 items-center justify-between">
            <div className="w-full md:w-1/3 flex flex-col items-center md:items-start text-center md:text-left border-b md:border-b-0 md:border-r border-white/10 pb-4 md:pb-0 md:pr-6 justify-between h-full min-h-[110px]">
              <div>
                <span className="text-[9px] uppercase tracking-widest text-amber-400 font-bold font-sans">Asset Portfolio</span>
                <h4 className="text-base font-brand text-white uppercase mt-1" style={{ fontFamily: FONT }}>
                  Collections Ledger
                </h4>
              </div>
              <div className="flex gap-2 mt-4 w-full justify-center md:justify-start">
                <button
                  onClick={() => pushPage('shop')}
                  className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-black text-[9.5px] font-brand uppercase tracking-wider rounded-xl transition font-black"
                  style={{ fontFamily: '"Josefin Sans", sans-serif' }}
                >
                  Shop Upgrades
                </button>
              </div>
            </div>

            <div className="w-full md:w-2/3 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-white/5 border border-white/10 rounded-2xl text-center flex flex-col items-center justify-between">
                <span className="text-2xl">≡ƒÅí</span>
                <div className="mt-1">
                  <span className="text-[7.5px] uppercase tracking-wider text-neutral-400 font-bold block">Hometown Estate</span>
                  <span className="text-amber-300 font-semibold text-[10.5px] block uppercase truncate mt-0.5">{townName} Cottage</span>
                </div>
              </div>

              <div className="p-3 bg-white/5 border border-white/10 rounded-2xl text-center flex flex-col items-center justify-between">
                <span className="text-2xl">
                  {activeTransport === 'walk' ? '≡ƒÜ╢' : activeTransport === 'horse-wagon' ? '≡ƒÉÄ' : activeTransport === 'forest-train' ? '≡ƒÜé' : '≡ƒÄê'}
                </span>
                <div className="mt-1">
                  <span className="text-[7.5px] uppercase tracking-wider text-neutral-400 font-bold block">Active Transport</span>
                  <span className="text-cyan-400 font-semibold text-[10.5px] block uppercase truncate mt-0.5">{activeTransport.replace('-', ' ')}</span>
                </div>
              </div>

              <div className="p-3 bg-white/5 border border-white/10 rounded-2xl text-center flex flex-col items-center justify-between">
                <span className="text-2xl">≡ƒÉ┐∩╕Å</span>
                <div className="mt-1">
                  <span className="text-[7.5px] uppercase tracking-wider text-neutral-400 font-bold block">Equipped Companion</span>
                  <span className="text-pink-400 font-semibold text-[10.5px] block uppercase truncate mt-0.5">{equippedPet ? equippedPet : 'None'}</span>
                </div>
              </div>

              <div className="p-3 bg-white/5 border border-white/10 rounded-2xl text-center flex flex-col items-center justify-between">
                <span className="text-2xl">≡ƒÅ«</span>
                <div className="mt-1">
                  <span className="text-[7.5px] uppercase tracking-wider text-neutral-400 font-bold block">Upgrades Applied</span>
                  <span className="text-yellow-400 font-bold text-[10.5px] block uppercase truncate mt-0.5">{equippedDecorations.length} Items</span>
                </div>
            </div>
          </div>
        </div>
      </div>

      {/* ΓöÇΓöÇ DAILY DISPATCH POPUP ΓöÇΓöÇ */}
      {showDailyDispatch && (
        <div className="fixed inset-0 z-[280] bg-black/60 backdrop-blur-md flex items-center justify-center p-6 select-none animate-fade-in">
          <div className="relative bg-neutral-950/95 border-2 border-white/25 rounded-[2.5rem] p-6 h-[80vh] w-[85vw] max-w-5xl shadow-2xl flex flex-col justify-between text-left font-body overflow-hidden">
            
            {/* Header Row */}
            <div className="flex justify-between items-center border-b border-white/10 pb-3.5 shrink-0">
              <div>
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-pink-400">Daily Administrative Chores</span>
                <h2 className="text-xl md:text-2xl font-brand text-white uppercase mt-0.5" style={{ fontFamily: FONT }}>
                  Community Dispatch Registry
                </h2>
              </div>
              <button
                onClick={() => setShowDailyDispatch(false)}
                className="w-10 h-10 hover:scale-110 active:scale-95 transition-all flex items-center justify-center filter drop-shadow-md bg-white/5 rounded-full border border-white/10 text-white font-bold"
              >
                Γ£ò
              </button>
            </div>

            {/* Content Body - 3 Columns */}
            <div className="flex-1 my-4 grid grid-cols-1 lg:grid-cols-3 gap-5 overflow-y-auto custom-scrollbar pr-1 py-1">
              
              {/* Chore 1: County Census */}
              <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex flex-col justify-between space-y-4">
                <div className="space-y-2.5">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase tracking-wider text-neutral-400">Dispatch #1</span>
                    {dispatch1Done ? (
                      <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-bold rounded-lg uppercase">Completed</span>
                    ) : (
                      <span className="px-2 py-0.5 bg-pink-500/10 border border-pink-500/20 text-pink-400 text-[9px] font-bold rounded-lg uppercase">Active</span>
                    )}
                  </div>
                  <h4 className="font-bold text-white text-sm flex items-center gap-1">≡ƒô¥ County Census Registry</h4>
                  <p className="text-xs text-white/50 leading-relaxed font-sans">
                    Register your presence with the clerk. Tell us your traveler interest to keep demographic files up to date.
                  </p>
                  
                  {!dispatch1Done && (
                    <div className="space-y-2 pt-1.5 font-sans">
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] text-neutral-400 font-bold uppercase">Traveler Name</label>
                        <input
                          type="text"
                          placeholder="Your Name..."
                          value={censusName}
                          onChange={(e) => setCensusName(e.target.value)}
                          className="px-3 py-1.5 bg-black/40 border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-pink-500"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] text-neutral-400 font-bold uppercase">Primary Field Interest</label>
                        <select
                          value={censusProf}
                          onChange={(e) => setCensusProf(e.target.value)}
                          className="px-3 py-1.5 bg-black/40 border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-pink-500"
                        >
                          <option value="builder">≡ƒö¿ Town Construction (Builder)</option>
                          <option value="explorer">≡ƒº¡ Wilderness Mapping (Explorer)</option>
                          <option value="healer">≡ƒî┐ Forest Apothecary (Healer)</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>

                {!dispatch1Done ? (
                  <button
                    disabled={!censusName.trim()}
                    onClick={() => {
                      addSkillXP('healer', 35);
                      addCoins(15, 'Daily Census Registry');
                      setDispatch1Done(true);
                      triggerFeedback('≡ƒô¥ Census registered! +35 Healer XP & +15 Coins.');
                    }}
                    className={`w-full py-2 rounded-xl text-black font-brand text-[10px] uppercase tracking-wider font-black transition ${
                      censusName.trim() ? 'bg-gradient-to-r from-pink-500 to-purple-500 hover:scale-102 active:scale-98' : 'bg-neutral-700 text-neutral-500 cursor-not-allowed'
                    }`}
                  >
                    Submit Census Form ≡ƒÄƒ∩╕Å
                  </button>
                ) : (
                  <div className="text-center text-[10px] text-white/30 italic font-sans py-2">Γ£ô Census updated for this cycle.</div>
                )}
              </div>

              {/* Chore 2: Baker's Recipe Balance */}
              <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex flex-col justify-between space-y-4">
                <div className="space-y-2.5">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase tracking-wider text-neutral-400">Dispatch #2</span>
                    {dispatch2Done ? (
                      <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-bold rounded-lg uppercase">Completed</span>
                    ) : (
                      <span className="px-2 py-0.5 bg-pink-500/10 border border-pink-500/20 text-pink-400 text-[9px] font-bold rounded-lg uppercase">Active</span>
                    )}
                  </div>
                  <h4 className="font-bold text-white text-sm flex items-center gap-1">ΓÜû∩╕Å Baker's Supply Ledger</h4>
                  <p className="text-xs text-white/50 leading-relaxed font-sans">
                    Baker Mortimer needs exactly 100 lbs of balanced materials for the wedding cake. Balance the ratios:
                  </p>

                  {!dispatch2Done && (
                    <div className="space-y-2 pt-1 font-sans text-xs">
                      <div className="flex items-center justify-between">
                        <span>≡ƒî╛ Flour: {flourQty} lbs</span>
                        <div className="flex gap-1">
                          <button onClick={() => setFlourQty(q => Math.max(0, q - 5))} className="w-6 h-6 bg-white/10 rounded flex items-center justify-center font-black hover:bg-white/25">-</button>
                          <button onClick={() => setFlourQty(q => Math.min(100, q + 5))} className="w-6 h-6 bg-white/10 rounded flex items-center justify-center font-black hover:bg-white/25">+</button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>≡ƒì¼ Sugar: {sugarQty} lbs</span>
                        <div className="flex gap-1">
                          <button onClick={() => setSugarQty(q => Math.max(0, q - 5))} className="w-6 h-6 bg-white/10 rounded flex items-center justify-center font-black hover:bg-white/25">-</button>
                          <button onClick={() => setSugarQty(q => Math.min(100, q + 5))} className="w-6 h-6 bg-white/10 rounded flex items-center justify-center font-black hover:bg-white/25">+</button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>≡ƒì½ Cocoa: {cocoaQty} lbs</span>
                        <div className="flex gap-1">
                          <button onClick={() => setCocoaQty(q => Math.max(0, q - 5))} className="w-6 h-6 bg-white/10 rounded flex items-center justify-center font-black hover:bg-white/25">-</button>
                          <button onClick={() => setCocoaQty(q => Math.min(100, q + 5))} className="w-6 h-6 bg-white/10 rounded flex items-center justify-center font-black hover:bg-white/25">+</button>
                        </div>
                      </div>
                      <div className="pt-1.5 border-t border-white/5 flex justify-between font-bold text-[11px]">
                        <span>Total Weight:</span>
                        <span className={flourQty + sugarQty + cocoaQty === 100 ? 'text-emerald-400' : 'text-rose-400 animate-pulse'}>
                          {flourQty + sugarQty + cocoaQty} / 100 lbs
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {!dispatch2Done ? (
                  <button
                    disabled={flourQty + sugarQty + cocoaQty !== 100}
                    onClick={() => {
                      addSkillXP('builder', 45);
                      addCoins(25, 'Balanced Baker Supplies');
                      setDispatch2Done(true);
                      triggerFeedback('ΓÜû∩╕Å Recipe balanced and logged! +45 Builder XP & +25 Coins.');
                    }}
                    className={`w-full py-2 rounded-xl text-black font-brand text-[10px] uppercase tracking-wider font-black transition ${
                      flourQty + sugarQty + cocoaQty === 100 ? 'bg-gradient-to-r from-pink-500 to-purple-500 hover:scale-102 active:scale-98' : 'bg-neutral-700 text-neutral-500 cursor-not-allowed'
                    }`}
                  >
                    Deliver Rations ≡ƒÜÜ
                  </button>
                ) : (
                  <div className="text-center text-[10px] text-white/30 italic font-sans py-2">Γ£ô Recipe ledger approved by Baker.</div>
                )}
              </div>

              {/* Chore 3: Clinic Safety Checks */}
              <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex flex-col justify-between space-y-4">
                <div className="space-y-2.5">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase tracking-wider text-neutral-400">Dispatch #3</span>
                    {dispatch3Done ? (
                      <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-bold rounded-lg uppercase">Completed</span>
                    ) : (
                      <span className="px-2 py-0.5 bg-pink-500/10 border border-pink-500/20 text-pink-400 text-[9px] font-bold rounded-lg uppercase">Active</span>
                    )}
                  </div>
                  <h4 className="font-bold text-white text-sm flex items-center gap-1">≡ƒ⌐╣ Clinic Disinfectant Review</h4>
                  <p className="text-xs text-white/50 leading-relaxed font-sans">
                    Apothecary Oakenhart needs confirmation on basic wellness checks. Verify these items:
                  </p>

                  {!dispatch3Done && (
                    <div className="space-y-2 pt-1 font-sans text-xs">
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={cleanSafety.box1}
                          onChange={(e) => setCleanSafety(prev => ({ ...prev, box1: e.target.checked }))}
                          className="rounded border-white/20 bg-black/40 text-pink-500 focus:ring-0 focus:ring-offset-0"
                        />
                        <span>Pestles washed in peppermint water</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={cleanSafety.box2}
                          onChange={(e) => setCleanSafety(prev => ({ ...prev, box2: e.target.checked }))}
                          className="rounded border-white/20 bg-black/40 text-pink-500 focus:ring-0 focus:ring-offset-0"
                        />
                        <span>Linen sheets boiled at 100┬░C</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={cleanSafety.box3}
                          onChange={(e) => setCleanSafety(prev => ({ ...prev, box3: e.target.checked }))}
                          className="rounded border-white/20 bg-black/40 text-pink-500 focus:ring-0 focus:ring-offset-0"
                        />
                        <span>Mold spores vacuum-sealed in glass</span>
                      </label>
                    </div>
                  )}
                </div>

                {!dispatch3Done ? (
                  <button
                    disabled={!cleanSafety.box1 || !cleanSafety.box2 || !cleanSafety.box3}
                    onClick={() => {
                      addSkillXP('explorer', 30);
                      addCoins(10, 'Apothecary Safety Check');
                      setDispatch3Done(true);
                      triggerFeedback('≡ƒ⌐╣ Safety check verified! +30 Explorer XP & +10 Coins.');
                    }}
                    className={`w-full py-2 rounded-xl text-black font-brand text-[10px] uppercase tracking-wider font-black transition ${
                      cleanSafety.box1 && cleanSafety.box2 && cleanSafety.box3 ? 'bg-gradient-to-r from-pink-500 to-purple-500 hover:scale-102 active:scale-98' : 'bg-neutral-700 text-neutral-500 cursor-not-allowed'
                    }`}
                  >
                    Confirm Checklist ≡ƒ¢í∩╕Å
                  </button>
                ) : (
                  <div className="text-center text-[10px] text-white/30 italic font-sans py-2">Γ£ô Safety protocols logged.</div>
                )}
              </div>

            </div>

            {/* Bottom Timer Status */}
            <div className="border-t border-white/10 pt-3 flex justify-between items-center text-xs text-white/40 shrink-0">
              <div className="flex items-center gap-2">
                <span>Completed:</span>
                <span className="font-bold text-pink-400">
                  {([dispatch1Done, dispatch2Done, dispatch3Done].filter(Boolean).length)} / 3 Chores
                </span>
              </div>
              <div className="flex items-center gap-2 font-mono">
                <span>New Dispatches:</span>
                <span className="text-yellow-400 font-bold">{formatTimer(secondsToNext)}</span>
              </div>
            </div>

          </div>
        </div>
      )}



      </div>

      {/* Bottom Info bar */}
      <div className="p-4 border-t border-white/10 flex items-center justify-between w-full gap-4 shrink-0 select-none bg-black/40 backdrop-blur-sm rounded-b-3xl">
        <span className="text-amber-300 font-bold italic text-xs md:text-sm text-center flex-1 transition hover:scale-[1.02] duration-200">
          "The sweet river heals our land" <span className="text-white/60 not-italic font-semibold text-[10px] md:text-xs">ΓÇö Rowan</span>
        </span>
        <span className="text-yellow-400 font-black text-sm shrink-0">Γ¡É</span>
        <span className="text-cyan-300 font-bold italic text-xs md:text-sm text-center flex-1 transition hover:scale-[1.02] duration-200">
          "Ganache is woven with pure magic" <span className="text-white/60 not-italic font-semibold text-[10px] md:text-xs">ΓÇö Chucklebop</span>
        </span>
        <span className="text-yellow-400 font-black text-sm shrink-0">Γ¡É</span>
        <span className="text-pink-300 font-bold italic text-xs md:text-sm text-center flex-1 transition hover:scale-[1.02] duration-200">
          "Peace grows under the green canopy" <span className="text-white/60 not-italic font-semibold text-[10px] md:text-xs">ΓÇö Mayor Truffle</span>
        </span>
      </div>
    </div>
  );
};
