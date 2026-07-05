export interface Actor {
  name: string;
  role: string;
  avatar: string;
}

export interface Series {
  id: string;
  title: string;
  category: string;
  posterUrl: string;
  cost: number;
  actsCount: number;
  type: 'chronicles' | 'lore';
  loreKey?: 'legend' | 'gossip' | 'politics' | 'economy' | 'transport';
  starring: Actor[];
  synopsis: string;
  headline: string;
}

export interface Story {
  id: string;
  title: string;
  description: string;
  instruction: string;
  icon: string;
  series: Series[];
}

export const STORIES_DATA: Story[] = [
  {
    id: 'story-honeyblueberry-loaf',
    title: 'The Honeyblueberry Loaf Incident',
    description: "Track the search for Baker Bramble Mortimer's missing masterpiece and the secret Acorn Commando.",
    instruction: 'Follow the case file to retrieve the loaf from Pipkin and uncover the hidden forest mystery.',
    icon: '🫐',
    series: [
      {
        id: 'chronicles-1',
        title: 'The Honeyblueberry Loaf Chronicles',
        category: 'Epic Town Reconstruction',
        posterUrl: '/Assets/Ganache Grove/Scene_0.1.png',
        cost: 50,
        actsCount: 5,
        type: 'chronicles',
        starring: [
          { name: 'Rowan Thistle', role: 'Builder Apprentice', avatar: '/Characters/Char Cards/Milo_Spark.png' },
          { name: 'Percival Tinkersprocket', role: 'Town Head', avatar: '/Characters/Char Cards/Hugo_Glass.png' },
          { name: 'Baker Bramble Mortimer', role: 'Town Baker', avatar: '/Characters/Char Cards/Zara_Quill.png' }
        ],
        synopsis: 'A live-action chronicle tracking the collective volunteer effort to build and secure the town canal system against sudden mountain overflows.',
        headline: 'Rowan Thistle and Percival Tinkersprocket lead the community through the canal emergency.'
      },
      {
        id: 'lore-legend',
        title: 'The Sacred Elder Tree Spirit',
        category: 'Ancient Folklore',
        posterUrl: '/Assets/Ganache Grove/GanacheGrove_GossipCorner.png',
        cost: 50,
        actsCount: 4,
        type: 'lore',
        loreKey: 'legend',
        starring: [
          { name: 'Professor Finley', role: 'Academy Principal', avatar: '/Characters/Char Cards/Hugo_Glass.png' },
          { name: 'Pipkin Nutterby', role: 'Forest Explorer', avatar: '/Characters/pipkin_nutterby.png' }
        ],
        synopsis: 'A mystical presentation detailing the relationship between local forest wood-sprites, honeyberry blossoms, and the community health.',
        headline: 'Professor Finley shares the legend of the ancient root caretakers.'
      }
    ]
  },
  {
    id: 'story-ganachetrain',
    title: 'The GanacheTrain Incident',
    description: 'Explore the elevated transit lines, high-canopy navigation, and the development of the glass monorails.',
    instruction: 'Review the dispatcher logs, safety guidelines, and the history of high-altitude travel.',
    icon: '🚂',
    series: [
      {
        id: 'lore-transport',
        title: 'Canopy Navigation & Safety',
        category: 'Forest Educational Adventure',
        posterUrl: '/Assets/Ganache Grove/GanacheGrove_GossipCorner.png',
        cost: 50,
        actsCount: 4,
        type: 'lore',
        loreKey: 'transport',
        starring: [
          { name: 'Horace Ticklebell', role: 'Railway Stationmaster', avatar: '/Characters/Char Cards/Olive_Pine.png' },
          { name: 'Professor Finley', role: 'Academy Principal', avatar: '/Characters/Char Cards/Hugo_Glass.png' }
        ],
        synopsis: 'A dramatic ranger briefing about the dangers of high-canopy navigation, balloon accidents, and owl patrol logistics.',
        headline: 'Horace Ticklebell teaches the rules of glass pods and forest tree line paths.'
      },
      {
        id: 'lore-economy',
        title: 'The Molasses Crisis of Year 398',
        category: 'Economic Action',
        posterUrl: '/Assets/Ganache Grove/GanacheGrove_GossipCorner.png',
        cost: 50,
        actsCount: 4,
        type: 'lore',
        loreKey: 'economy',
        starring: [
          { name: 'Rowan Thistle', role: 'Builder Apprentice', avatar: '/Characters/Char Cards/Milo_Spark.png' },
          { name: 'Captain Winston Butterfield', role: 'Town Explorer & Detective', avatar: '/Characters/Char Cards/Nico_Whistle.png' }
        ],
        synopsis: 'A historic re-enactment of the massive autumn storm that flooded highways with syrup and led to elevated monorail construction.',
        headline: 'Rowan Thistle shares how a mudslide birthed the glass monorail network.'
      }
    ]
  },
  {
    id: 'story-herbal-treatment',
    title: 'The Herbal Treatment Incident',
    description: 'Investigate the sudden spore sneezles outbreak at the Forest Academy and the quest for fresh mint remedies.',
    instruction: 'Examine the medical logs, quarantine files, and environmental debates surrounding the grove.',
    icon: '🌿',
    series: [
      {
        id: 'lore-politics',
        title: 'The Great Walkway Debate',
        category: 'Civic Drama',
        posterUrl: '/Assets/Ganache Grove/GanacheGrove_GossipCorner.png',
        cost: 50,
        actsCount: 4,
        type: 'lore',
        loreKey: 'politics',
        starring: [
          { name: 'Julie Frost', role: 'Gazette Reporter', avatar: '/Characters/Char Cards/Zara_Quill.png' },
          { name: 'Rowan Thistle', role: 'Builder Apprentice', avatar: '/Characters/Char Cards/Milo_Spark.png' },
          { name: 'Miss Page Bumblewick', role: 'Amateur Investigator', avatar: '/Characters/Char Cards/Olive_Pine.png' }
        ],
        synopsis: "A heated town council dispute between builder rowan thistle's modern elevated walkways and rebels who wish to protect low fluttermoth larvae.",
        headline: "Julie Frost details the compromise reached under Captain Butterfield's tiebreaker vote."
      },
      {
        id: 'lore-gossip',
        title: 'The Mossberry Whispers',
        category: 'Local Investigative Journal',
        posterUrl: '/Assets/Ganache Grove/GanacheGrove_GossipCorner.png',
        cost: 50,
        actsCount: 4,
        type: 'lore',
        loreKey: 'gossip',
        starring: [
          { name: 'Miss Page Bumblewick', role: 'Amateur Investigator', avatar: '/Characters/Char Cards/Olive_Pine.png' },
          { name: 'Captain Winston Butterfield', role: 'Town Explorer & Detective', avatar: '/Characters/Char Cards/Nico_Whistle.png' }
        ],
        synopsis: "A scandalous digest following miss page's reports of midnight tea auditing, acorn commando targets, and secret squirrel brigades.",
        headline: 'Miss Page Bumblewick exposes what really happens when the sun sets.'
      }
    ]
  }
];
