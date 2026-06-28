/* eslint-disable react-hooks/purity */
import React, { useState, useEffect } from 'react';
import { useTTStore } from '../../store/useTTStore';
import { GanacheGroveTownData } from '../../data/towns/ganache-grove';
import { ECONOMY_CONFIG } from '../../constants/economyConfig';
import type { SubPage } from '../../pages/TravellersDesk';
import HomeBox2_Census from './home/HomeBox2_Census';
import HomeBox3_Chronicles from './home/HomeBox3_Chronicles';
import HomeBox4_Ledger from './home/HomeBox4_Ledger';
import HomeBox5_Orientation from './home/HomeBox5_Orientation';
import { HomeBox6_WorldEngine } from './home/HomeBox6_WorldEngine';
import { TownHallModal } from '../TownHallModal';
import { FlashNewsModal } from '../FlashNewsModal';
import { WorldTimeManager } from '../WorldTimeManager';
import {
  FONT,
  TOWN_DETAILS,
  HOME_ROOMS,
  getProvincialStanding,
  getBuilderStanding,
  getExplorerStanding,
  getHealerStanding,
  TRANSPORT_SPEEDS,
} from '../../pages/TravellersDesk';


interface GG_TravellerDeck_HomeProps {
  setSubPage: (page: SubPage) => void;
  pushPage: (page: SubPage) => void;
  popPage: () => void;
  inventory: Record<string, number>;
  setInventory: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  setShowDossierPlaycard: (show: boolean) => void;
  dossierRead: boolean;
  triggerFeedback: (msg: string) => void;
  activePuzzleChore: any;
  setActivePuzzleChore: React.Dispatch<React.SetStateAction<any>>;
  openTownTalk: (charId: string) => void;
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
      emoji: '🚧',
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
      emoji: '📬',
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
      emoji: '📚',
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
      emoji: '🔥',
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
      emoji: '🪞',
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
      emoji: '✍️',
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
      emoji: '🌶️',
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
      emoji: '🍳',
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
      emoji: '🌸',
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
      emoji: '🔭',
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
      emoji: '🌱',
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
      emoji: '🧶',
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
      { title: 'The Satchel Mystery', content: 'Pipkin carries a small leather satchel everywhere. Nobody in Ganache Grove knows what is inside—including Pipkin himself, who claims it contains "brilliant ideas awaiting their perfect moment."' },
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

const _SHADOW_SLIDER_CSS = `
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
  setShowDossierPlaycard: _setShowDossierPlaycard,
  dossierRead,
  triggerFeedback,
  setActivePuzzleChore,
  openTownTalk,
}) => {
  const [showTownHallModal, setShowTownHallModal] = useState(false);
  const [showFlashNewsModal, setShowFlashNewsModal] = useState(false);
  const {
    homeTown,
    coins,
    spendCoins,
    addCoins,
    skills,
    completedActions,
    legacyPoints,
    setPage,
    logout,
    user,
    lastStampedDate,
    equippedDecorations,
    equippedPet,
    activeTransport,
    addToQueue,
    addSkillXP,
    setShowTownGuide,
    setShowRoadmapModal,
    setShowDailyChores,
    setShowHelpModal,
    goldenCitizenPass,
    earnedBadges,
  } = useTTStore();

  // Removed currentHomeSlide state to fix unused warning
  const [activeRoom, setActiveRoom] = useState<string>('exterior');
  const [isGridExpanded, setIsGridExpanded] = useState(false);
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

  // Daily Visit Coin Reward (max 5 or 8 coins per day depending on Golden Citizen Pass)
  useEffect(() => {
    const today = new Date().toDateString();
    const lastVisit = localStorage.getItem('tt_last_daily_visit_reward');
    if (lastVisit !== today) {
      localStorage.setItem('tt_last_daily_visit_reward', today);
      const amount = goldenCitizenPass ? ECONOMY_CONFIG.RESIDENT_DAILY_ALLOWANCE : ECONOMY_CONFIG.DAILY_ALLOWANCE;
      addCoins(amount, 'Daily Visit Allowance');
      setTimeout(() => {
        triggerFeedback(`🌞 Welcome back to Ganache Grove! Daily visit allowance received: +${amount} Cocoa Coins! 🪙`);
      }, 1200);
    }
  }, [addCoins, triggerFeedback, goldenCitizenPass]);

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







  const handleOpenPuzzle = (spot: HotspotConfig, chore: ChorePuzzle) => {
    setActiveHotspot(null);
    setActivePuzzleChore({
      hotspot: spot,
      chore,
      expiresAt: hudChoresState[spot.id]?.expiresAt ?? (Date.now() + 7200 * 1000)
    });
    setLastInteractionTime(Date.now());
  };

  // ── Deterministic Daily Seed Engine ────────────────────────
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

  const handleExecuteMatter = (id: string) => {
    if (completedActions.includes(id)) {
      triggerFeedback('✅ Action already completed today!');
      return;
    }

    const act = GanacheGroveTownData.problems.find(a => a.id === id);
    if (!act) {
      triggerFeedback('❌ Action not found!');
      return;
    }

    if (!act.costCheck(inventory, coins)) {
      triggerFeedback(`❌ Insufficient resources! ${act.requirementsSummary}`);
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
      icon: '🚶',
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
      icon: '🛠️',
      targetText: act.title,
      actionId: id,
    });

    triggerFeedback(`📦 Task initiated! Funded resources and added 2 transit tasks to your Residency Queue.`);
  };


  const details = TOWN_DETAILS[homeTown || 'ganache-grove'] || TOWN_DETAILS['ganache-grove'];
  const townName = (homeTown || 'ganache-grove').replace('-', ' ').replace(/\b\w/g, c => c.toUpperCase());

  return (
    <div className="w-full flex-grow flex flex-col justify-between min-h-0 relative">
      <style>{_SHADOW_SLIDER_CSS}</style>

      {/* Title Header */}
      {/* Title Header (3-Column Layout Matching Other Sub-pages) */}
      <div 
        className="border-b border-white/10 pb-4 mb-3 shrink-0 flex flex-col md:flex-row items-center justify-between gap-4 w-full select-none"
      >
        {/* Left Side: Clock Year Button + Dashboard Title */}
        <div className="flex items-center justify-start gap-4">
          {/* Year Clock Button */}
          <WorldTimeManager currentSubPage="home" showBadge />
          
          <div className="text-left">
            <span className="text-[9px] font-black uppercase tracking-[0.35em] text-amber-400 block">
              {details.county}
            </span>
            <h1 className="text-xl md:text-2xl font-brand uppercase text-white tracking-tight leading-none" style={{ fontFamily: FONT }}>
              Ganache Grove Dashboard
            </h1>
          </div>
        </div>

        {/* Center: Standing, Actions, and Badges stats */}
        <div className="hidden md:flex flex-row items-center gap-3 bg-black/60 px-5 py-2 rounded-full border border-white/10 text-xs font-black select-none text-white shadow-md tracking-wider font-brand">
          <div className="flex flex-col text-left px-2.5 border-r border-white/5">
            <span className="text-[8px] uppercase tracking-widest text-neutral-400 font-sans">Standing</span>
            <span className="text-amber-400 font-brand text-[11px] uppercase mt-0.5" style={{ fontFamily: FONT }}>
              {getProvincialStanding(legacyPoints).split(' ').pop()}
            </span>
          </div>
          <div className="flex flex-col text-left px-2.5 border-r border-white/5">
            <span className="text-[8px] uppercase tracking-widest text-neutral-400 font-sans font-bold">Actions</span>
            <span className="text-cyan-400 font-brand text-[11px] uppercase mt-0.5" style={{ fontFamily: FONT }}>
              {4 - completedActions.filter(x => ['walkway', 'bell', 'sneezles', 'festival'].includes(x)).length} Pending
            </span>
          </div>
          <div className="flex flex-col text-left px-2.5 font-bold">
            <span className="text-[8px] uppercase tracking-widest text-neutral-400 font-sans font-bold">Badges</span>
            <span className="text-purple-400 font-brand text-[11px] uppercase mt-0.5" style={{ fontFamily: FONT }}>
              {earnedBadges?.length || 0} Earned
            </span>
          </div>
        </div>

        {/* Right side: Stats (🪙 Coins | ⭐ Legacy) */}
        <div className="flex items-center justify-end gap-3 z-10">
          <div className="flex items-center gap-4 bg-black/60 px-6 py-2 rounded-full border border-white/10 text-xs font-black select-none text-white shadow-lg tracking-wider font-brand">
            <span className="text-emerald-400 flex items-center gap-1.5 font-sans">🪙 {coins} Coins</span>
            <span className="text-white/20">|</span>
            <span className="text-amber-400 flex items-center gap-1.5 font-sans">⭐ {legacyPoints} Legacy</span>
          </div>
        </div>
      </div>

      {/* Sub-Header Actions Row (Flash News, Daily Dispatch, Relocate, Logout) */}
      <div className="flex flex-wrap items-center justify-end gap-3 mb-2 shrink-0">
        {setShowFlashNewsModal && (
          <button
            onClick={() => setShowFlashNewsModal(true)}
            className="px-3.5 py-1.5 bg-amber-500/20 hover:bg-amber-500/35 border border-amber-500/40 text-[10px] font-brand uppercase tracking-wider text-amber-300 rounded-xl transition flex items-center gap-1 shadow-md cursor-pointer"
            style={{ fontFamily: '"Josefin Sans", sans-serif' }}
          >
            <span>📯</span> Flash News
          </button>
        )}

        <button
          onClick={() => setShowDailyDispatch(true)}
          className="px-3.5 py-1.5 bg-gradient-to-r from-pink-500/20 to-purple-500/20 hover:bg-gradient-to-r hover:from-pink-500/35 hover:to-purple-500/35 border border-pink-500/40 text-[10px] font-brand uppercase tracking-wider text-pink-300 rounded-xl transition flex items-center gap-1 shadow-md animate-pulse cursor-pointer"
          style={{ fontFamily: '"Josefin Sans", sans-serif' }}
        >
          <span>📯</span> Daily Dispatch
        </button>

        <button
          onClick={() => {
            if (coins < 15) {
              triggerFeedback("❌ Cannot Relocate! Relocation fee is 15 Cocoa Coins.");
            } else {
              setPage('choose-town');
            }
          }}
          className="px-3.5 py-1.5 bg-neutral-850 hover:bg-neutral-800 border border-white/10 text-[10px] font-brand uppercase tracking-wider text-white rounded-xl transition shadow-md cursor-pointer"
          style={{ fontFamily: '"Josefin Sans", sans-serif' }}
        >
          Relocate (-15 🪙)
        </button>
        <button
          onClick={() => logout()}
          className="px-3.5 py-1.5 bg-red-900/30 hover:bg-red-800/40 border border-red-500/30 text-[10px] font-brand uppercase tracking-wider text-red-300 rounded-xl transition shadow-md cursor-pointer"
          style={{ fontFamily: '"Josefin Sans", sans-serif' }}
        >
          Logout
        </button>
      </div>

      {/* Scrollable Dashboard Container */}
      <div className="flex-grow overflow-y-auto custom-scrollbar my-3 space-y-12 pr-1 min-h-0">

        {/* ═══ BOX 1: Cottage Exploration (Full Width) ═══ */}
        <div className="relative w-full shrink-0">
          {/* Solid backing layer */}
          <div className="absolute top-2 left-2 right-0 bottom-0 bg-amber-500/35 border-[3px] border-amber-500/40 rounded-3xl -z-10" />

          {/* Main container */}
          <div
            className="mr-2 mb-2 w-[calc(100%-8px)] h-[500px] rounded-3xl overflow-hidden border-[3px] border-amber-500/40 bg-black/60 relative group z-10 flex flex-row animate-fade-in"
          >
            {/* Left Side: Room Image Explorer (60%) */}
            {!isGridExpanded && (
              <div className="w-[60%] h-full overflow-hidden relative bg-black flex items-center justify-center border-r-[3px] border-amber-500/40">
                {HOME_ROOMS.map(room => (
                  <img
                    key={room.id}
                    src={room.image}
                    alt={room.name}
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${activeRoom === room.id ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                    style={{ objectPosition: 'center bottom' }}
                  />
                ))}

                {/* Gradients */}
                <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-black/75 to-transparent z-20 pointer-events-none" />
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/50 to-transparent z-20 pointer-events-none" />

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
                            <span>🕒 Expires in:</span>
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
                          ✕ Close
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
                          Complete Chore 🧹
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
                    {showHomeNav ? '✖' : '🏡'}
                  </button>
                </div>
              </div>
            )}

            {/* Right Side: Ganache Locations Panel (40% or 100% when expanded) */}
            <div className={`${isGridExpanded ? 'w-full' : 'w-[40%]'} h-full bg-[#110e0e]/95 p-5 flex flex-col select-none relative transition-all duration-350 ${!isGridExpanded ? 'border-l-[3px] border-amber-500/40' : ''}`}>
              <div className="border-b border-white/10 pb-2 mb-3 flex justify-between items-center shrink-0">
                <div className="text-left">
                  <span className="text-[8px] font-black uppercase tracking-[0.25em] text-amber-400 font-sans">County Gateways</span>
                  <h3 className="text-base font-brand text-white uppercase mt-0.5" style={{ fontFamily: FONT }}>
                    Ganache Locations
                  </h3>
                </div>
                <button
                  onClick={() => setIsGridExpanded(!isGridExpanded)}
                  className="px-3.5 py-1.5 bg-amber-500/10 hover:bg-amber-500/25 border border-amber-500/35 hover:border-amber-500/50 text-amber-300 text-[10px] font-brand uppercase tracking-wider rounded-xl transition duration-200 cursor-pointer shadow-md select-none flex items-center gap-1.5"
                  style={{ fontFamily: '"Josefin Sans", sans-serif' }}
                >
                  {isGridExpanded ? '🏡 Split View' : '🖥️ View All Icons'}
                </button>
              </div>

              {/* Scrollable Container with grid of columns, no text, and larger icons */}
              <div className="flex-grow overflow-y-auto custom-scrollbar pr-1 py-1">
                <div className={`grid ${isGridExpanded ? 'grid-cols-5 sm:grid-cols-6 md:grid-cols-7 lg:grid-cols-8' : 'grid-cols-3'} gap-3.5`}>
                  {[
                    {
                      id: 'Academy',
                      icon: '/Assets/Icons/cropped/Ganache_Academy.png',
                      action: () => pushPage('classroom'),
                    },
                    {
                      id: 'Clinic',
                      icon: '/Assets/Icons/cropped/Ganache_Clinic.png',
                      action: () => pushPage('health'),
                    },
                    {
                      id: 'Finance',
                      icon: '/Assets/Icons/cropped/Ganache_Finance.png',
                      action: () => pushPage('economy'),
                    },
                    {
                      id: 'Gazette',
                      icon: '/Assets/Icons/cropped/Ganache_Gazette.png',
                      action: () => pushPage('newspaper'),
                    },
                    {
                      id: 'Gossip',
                      icon: '/Assets/Icons/cropped/Ganache_Gossipcenter.png',
                      action: () => pushPage('gossip'),
                    },
                    {
                      id: 'Market',
                      icon: '/Assets/Icons/cropped/Ganache_Market.png',
                      action: () => pushPage('shop'),
                    },
                    {
                      id: 'Museum',
                      icon: '/Assets/Icons/cropped/Ganache_Museum.png',
                      action: () => pushPage('places'),
                    },
                    {
                      id: 'Sheriff',
                      icon: '/Assets/Icons/cropped/Ganache_Sheriff.png',
                      action: () => pushPage('places'),
                    },
                    {
                      id: 'Theatre',
                      icon: '/Assets/Icons/cropped/Ganache_Theatre.png',
                      action: () => pushPage('theatre'),
                    },
                    {
                      id: 'Townhall',
                      icon: '/Assets/Icons/cropped/Ganache_Townhall.png',
                      action: () => pushPage('politics'),
                    },
                    {
                      id: 'Trade',
                      icon: '/Assets/Icons/cropped/Ganache_Trade.png',
                      action: () => pushPage('workshop'),
                    },
                    {
                      id: 'Transport',
                      icon: '/Assets/Icons/cropped/Ganache_Transport.png',
                      action: () => pushPage('transport'),
                    },
                    {
                      id: 'Games',
                      icon: '/Assets/Icons/cropped/Ganache_Games.png',
                      action: () => pushPage('mini-games'),
                    },
                  ].map(w => {
                    return (
                      <button
                        key={w.id}
                        onClick={w.action}
                        className="aspect-square flex items-center justify-center p-0 rounded-2xl border-2 border-amber-500/40 bg-neutral-900/60 shadow-[0_0_10px_rgba(245,158,11,0.15)] hover:border-amber-400 hover:bg-amber-500/15 transition-all duration-300 hover:scale-105 active:scale-95 group overflow-hidden cursor-pointer"
                        title={w.id}
                      >
                        <img
                          src={w.icon}
                          alt={w.id}
                          className="w-full h-full object-contain p-1 transition-all duration-300 filter brightness-100 group-hover:brightness-[1.08] drop-shadow-[0_4px_8px_rgba(0,0,0,0.4)]"
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ═══ BOX 2: World Engine Group (Moved beneath Cottage) ═══ */}
        <div className="flex flex-col space-y-3 shrink-0">
          <div className="text-center shrink-0">
            <span className="px-3.5 py-1 bg-amber-500 text-neutral-900 rounded-full text-[9px] font-black uppercase tracking-[0.25em] inline-block shadow-md">
              Simulation Engine
            </span>
            <h2 className="text-xl md:text-2xl font-brand uppercase text-amber-400 tracking-tight leading-none mt-2 mb-1" style={{ fontFamily: FONT }}>
              World Simulation Timeline
            </h2>
            <p className="text-xs text-neutral-300 italic max-w-4xl mx-auto leading-relaxed">
              Living inside a world that has its own rhythm. Check the scheduled events of Ganache Grove, and watch how it shifts ambient light and market prices.
            </p>
          </div>

          <HomeBox6_WorldEngine pushPage={pushPage} />
        </div>

        {/* ═══ BOX 3: Ganache Widget Container (Clean Image Hyperlinks) ═══ */}
        <div className="relative w-full shrink-0">
          {/* Solid backing shadow */}
          <div className="absolute top-2 left-2 right-0 bottom-0 bg-amber-500/25 border-[3px] border-amber-500/40 rounded-3xl -z-10" />

          {/* Main container */}
          <div className="mr-2 mb-2 w-[calc(100%-8px)] rounded-3xl overflow-hidden border-[3px] border-amber-500/40 bg-black/60 relative z-10 flex flex-col p-6 gap-5">
            {/* Header */}
            <div className="text-left border-b border-white/10 pb-4">
              <span className="text-[8px] font-black uppercase tracking-[0.25em] text-amber-400 font-sans">Town Gateway</span>
              <h3 className="text-base font-brand text-white uppercase mt-0.5" style={{ fontFamily: FONT }}>
                Ganache Widget Panel
              </h3>
            </div>

            {/* Stand out, bigger, brilliant image hyperlinks with NO extra text or buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-6 justify-center py-2">
              {[
                {
                  id: 'guide_map',
                  icon: '/Assets/Icons/cropped/widget_guide_map.png',
                  action: () => setShowTownGuide(true),
                },
                {
                  id: 'journey',
                  icon: '/Assets/Icons/cropped/widget_journey.png',
                  action: () => setShowRoadmapModal(true),
                },
                {
                  id: 'dispatch',
                  icon: '/Assets/Icons/cropped/widget_dispatch.png',
                  action: () => setShowDailyChores(true),
                },
                {
                  id: 'calling',
                  icon: '/Assets/Icons/cropped/widget_calling.png',
                  action: () => openTownTalk('pipkin'),
                },
                {
                  id: 'help',
                  icon: '/Assets/Icons/cropped/widget_help.png',
                  action: () => setShowHelpModal(true),
                },
              ].map(widget => (
                <button
                  key={widget.id}
                  onClick={widget.action}
                  className="relative flex items-center justify-center p-0 rounded-2xl border border-white/5 hover:border-amber-400/40 bg-transparent hover:bg-white/5 transition-all duration-300 hover:scale-105 group shadow-xl active:scale-[0.97] overflow-hidden cursor-pointer"
                >
                  <img
                    src={widget.icon}
                    alt={widget.id}
                    className="w-full h-auto max-h-[140px] md:max-h-[170px] object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)] group-hover:drop-shadow-[0_12px_24px_rgba(245,158,11,0.35)] transition-all duration-300"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>


        {/* Box 4: Census Group */}
        <div className="flex flex-col space-y-3 shrink-0">
          {/* Heading: Box 2 */}
          <div className="text-center shrink-0">
            <span className="px-3.5 py-1 bg-purple-500 text-white rounded-full text-[9px] font-black uppercase tracking-[0.25em] inline-block shadow-md">
              Ganache Grove Registry
            </span>
            <h2 className="text-xl md:text-2xl font-brand uppercase text-purple-400 tracking-tight leading-none mt-2 mb-1" style={{ fontFamily: FONT }}>
              Meet the Residents of the Town
            </h2>
            <p className="text-xs text-neutral-300 italic max-w-4xl mx-auto leading-relaxed">
              Get to know the unique souls residing in this sweet sweet county. Flip through their profiles, read their secrets, and check their strengths.
            </p>
          </div>

          <HomeBox2_Census
            characters={GANACHE_CHARACTERS}
            activeIndex={activeCharIndex}
            setActiveIndex={setActiveCharIndex}
            charTab={charContentTab}
            setCharTab={setCharContentTab}
            setPage={setPage}
            skills={skills}
            legacyPoints={legacyPoints}
            getProvincialStanding={getProvincialStanding}
          />
        </div>

        {/* Box 5: Chronicles & Campaigns Group */}
        <div className="flex flex-col space-y-3 shrink-0">
          {/* Heading: Box 3 */}
          <div className="text-center shrink-0">
            <span className="px-3.5 py-1 bg-orange-500 text-white rounded-full text-[9px] font-black uppercase tracking-[0.25em] inline-block shadow-md">
              Chronicles &amp; Campaigns
            </span>
            <h2 className="text-xl md:text-2xl font-brand uppercase text-orange-400 tracking-tight leading-none mt-2 mb-1" style={{ fontFamily: FONT }}>
              Active Storylines &amp; Town Affairs
            </h2>
            <p className="text-xs text-neutral-300 italic max-w-4xl mx-auto leading-relaxed">
              Embark on local tales and help resolve the critical matters of the parish. Earn unique badges, valuable coins, and rank standing by participating.
            </p>
          </div>

          <HomeBox3_Chronicles
            selectedProj={selectedProj}
            selectedMyst={selectedMyst}
            selectedCamp={selectedCamp}
            completedActions={completedActions}
            handleExecuteMatter={handleExecuteMatter}
            setShowTownHallModal={setShowTownHallModal}
            pushPage={pushPage}
            setPage={setPage}
            setSubPage={setSubPage}
          />
        </div>


        {/* Box 7: Ledger Group */}
        <div className="flex flex-col space-y-3 shrink-0">
          {/* Heading: Box 4 */}
          <div className="text-center shrink-0">
            <span className="px-3.5 py-1 bg-emerald-500 text-black rounded-full text-[9px] font-black uppercase tracking-[0.25em] inline-block shadow-md">
              Resident Ledger &amp; Asset Portfolio
            </span>
            <h2 className="text-xl md:text-2xl font-brand uppercase text-emerald-400 tracking-tight leading-none mt-2 mb-1" style={{ fontFamily: FONT }}>
              Finance, Standing &amp; Asset Registry
            </h2>
            <p className="text-xs text-neutral-300 italic max-w-4xl mx-auto leading-relaxed">
              Review your financial standing, active transportation, and equipped pets. Pay your housing dues on time and track your progressive ranks in town.
            </p>
          </div>

          <HomeBox4_Ledger
            coins={coins}
            legacyPoints={legacyPoints}
            skills={skills}
            rentPaid={rentPaid}
            setRentPaid={setRentPaid}
            spendCoins={spendCoins}
            townName={townName}
            activeTransport={activeTransport}
            equippedPet={equippedPet}
            equippedDecorations={equippedDecorations}
            pushPage={pushPage}
            triggerFeedback={triggerFeedback}
            getProvincialStanding={getProvincialStanding}
            getBuilderStanding={getBuilderStanding}
            getExplorerStanding={getExplorerStanding}
            getHealerStanding={getHealerStanding}
          />
        </div>

        {/* Box 5: Orientation Group */}
        <div className="flex flex-col space-y-3 shrink-0">
          {/* Heading: Box 5 */}
          <div className="text-center shrink-0">
            <span className="px-3.5 py-1 bg-blue-500 text-white rounded-full text-[9px] font-black uppercase tracking-[0.25em] inline-block shadow-md">
              Daily Routine
            </span>
            <h2 className="text-xl md:text-2xl font-brand uppercase text-blue-400 tracking-tight leading-none mt-2 mb-1" style={{ fontFamily: FONT }}>
              Orientation &amp; Daily Checklist
            </h2>
            <p className="text-xs text-neutral-300 italic max-w-4xl mx-auto leading-relaxed">
              Complete three daily check steps to stay active and log your daily presence. Claim your administrative coin allowances and keep streaks alive.
            </p>
          </div>

          <HomeBox5_Orientation
            dossierRead={dossierRead}
            lastStampedDate={lastStampedDate}
            completedActions={completedActions}
            selectedProj={selectedProj}
            selectedMyst={selectedMyst}
            selectedCamp={selectedCamp}
            pushPage={pushPage}
            setSubPage={setSubPage}
            triggerFeedback={triggerFeedback}
          />
        </div>


      </div>

      {/* ── DAILY DISPATCH POPUP ── */}{/* ── DAILY DISPATCH POPUP ── */}
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
                ✕
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
                  <h4 className="font-bold text-white text-sm flex items-center gap-1">📝 County Census Registry</h4>
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
                          <option value="builder">🔨 Town Construction (Builder)</option>
                          <option value="explorer">🧭 Wilderness Mapping (Explorer)</option>
                          <option value="healer">🌿 Forest Apothecary (Healer)</option>
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
                      addCoins(4, 'Daily Census Registry');
                      setDispatch1Done(true);
                      triggerFeedback('📝 Census registered! +35 Healer XP & +4 Coins.');
                    }}
                    className={`w-full py-2 rounded-xl text-black font-brand text-[10px] uppercase tracking-wider font-black transition ${
                      censusName.trim() ? 'bg-gradient-to-r from-pink-500 to-purple-500 hover:scale-102 active:scale-98' : 'bg-neutral-700 text-neutral-500 cursor-not-allowed'
                    }`}
                  >
                    Submit Census Form 🎟️
                  </button>
                ) : (
                  <div className="text-center text-[10px] text-white/30 italic font-sans py-2">✓ Census updated for this cycle.</div>
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
                  <h4 className="font-bold text-white text-sm flex items-center gap-1">⚖️ Baker's Supply Ledger</h4>
                  <p className="text-xs text-white/50 leading-relaxed font-sans">
                    Baker Mortimer needs exactly 100 lbs of balanced materials for the wedding cake. Balance the ratios:
                  </p>

                  {!dispatch2Done && (
                    <div className="space-y-2 pt-1 font-sans text-xs">
                      <div className="flex items-center justify-between">
                        <span>🌾 Flour: {flourQty} lbs</span>
                        <div className="flex gap-1">
                          <button onClick={() => setFlourQty(q => Math.max(0, q - 5))} className="w-6 h-6 bg-white/10 rounded flex items-center justify-center font-black hover:bg-white/25">-</button>
                          <button onClick={() => setFlourQty(q => Math.min(100, q + 5))} className="w-6 h-6 bg-white/10 rounded flex items-center justify-center font-black hover:bg-white/25">+</button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>🍬 Sugar: {sugarQty} lbs</span>
                        <div className="flex gap-1">
                          <button onClick={() => setSugarQty(q => Math.max(0, q - 5))} className="w-6 h-6 bg-white/10 rounded flex items-center justify-center font-black hover:bg-white/25">-</button>
                          <button onClick={() => setSugarQty(q => Math.min(100, q + 5))} className="w-6 h-6 bg-white/10 rounded flex items-center justify-center font-black hover:bg-white/25">+</button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>🍫 Cocoa: {cocoaQty} lbs</span>
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
                      addCoins(6, 'Balanced Baker Supplies');
                      setDispatch2Done(true);
                      triggerFeedback('⚖️ Recipe balanced and logged! +45 Builder XP & +6 Coins.');
                    }}
                    className={`w-full py-2 rounded-xl text-black font-brand text-[10px] uppercase tracking-wider font-black transition ${
                      flourQty + sugarQty + cocoaQty === 100 ? 'bg-gradient-to-r from-pink-500 to-purple-500 hover:scale-102 active:scale-98' : 'bg-neutral-700 text-neutral-500 cursor-not-allowed'
                    }`}
                  >
                    Deliver Rations 🚚
                  </button>
                ) : (
                  <div className="text-center text-[10px] text-white/30 italic font-sans py-2">✓ Recipe ledger approved by Baker.</div>
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
                  <h4 className="font-bold text-white text-sm flex items-center gap-1">🩹 Clinic Disinfectant Review</h4>
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
                        <span>Linen sheets boiled at 100°C</span>
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
                      addCoins(3, 'Apothecary Safety Check');
                      setDispatch3Done(true);
                      triggerFeedback('🩹 Safety check verified! +30 Explorer XP & +3 Coins.');
                    }}
                    className={`w-full py-2 rounded-xl text-black font-brand text-[10px] uppercase tracking-wider font-black transition ${
                      cleanSafety.box1 && cleanSafety.box2 && cleanSafety.box3 ? 'bg-gradient-to-r from-pink-500 to-purple-500 hover:scale-102 active:scale-98' : 'bg-neutral-700 text-neutral-500 cursor-not-allowed'
                    }`}
                  >
                    Confirm Checklist 🛡️
                  </button>
                ) : (
                  <div className="text-center text-[10px] text-white/30 italic font-sans py-2">✓ Safety protocols logged.</div>
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

      {/* Bottom Info bar */}
      <div className="p-4 border-t border-white/10 flex items-center justify-between w-full gap-4 shrink-0 select-none bg-black/40 backdrop-blur-sm rounded-b-3xl">
        <span className="text-amber-300 font-bold italic text-xs md:text-sm text-center flex-1 transition hover:scale-[1.02] duration-200">
          "The sweet river heals our land" <span className="text-white/60 not-italic font-semibold text-[10px] md:text-xs">— Rowan</span>
        </span>
        <span className="text-yellow-400 font-black text-sm shrink-0">⭐</span>
        <span className="text-cyan-300 font-bold italic text-xs md:text-sm text-center flex-1 transition hover:scale-[1.02] duration-200">
          "Ganache is woven with pure magic" <span className="text-white/60 not-italic font-semibold text-[10px] md:text-xs">— Chucklebop</span>
        </span>
        <span className="text-yellow-400 font-black text-sm shrink-0">⭐</span>
        <span className="text-pink-300 font-bold italic text-xs md:text-sm text-center flex-1 transition hover:scale-[1.02] duration-200">
          "Peace grows under the green canopy" <span className="text-white/60 not-italic font-semibold text-[10px] md:text-xs">— Mayor Truffle</span>
        </span>
      </div>

      {showTownHallModal && (
        <div className="fixed inset-0 z-[280] bg-black/60 backdrop-blur-md flex items-center justify-center p-6 select-none animate-fade-in">
          <TownHallModal
            selectedCamp={selectedCamp}
            completedActions={completedActions}
            onExecuteMatter={handleExecuteMatter}
            onClose={() => setShowTownHallModal(false)}
          />
        </div>
      )}

      {showFlashNewsModal && (
        <div className="fixed inset-0 z-[280] bg-black/60 backdrop-blur-md flex items-center justify-center p-6 select-none animate-fade-in">
          <FlashNewsModal onClose={() => setShowFlashNewsModal(false)} />
        </div>
      )}
    </div>
  );
};
