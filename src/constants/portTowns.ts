export interface PortTown {
  id: string;
  title: string;
  tagline: string;
  description: string;
  imageUrl: string;
  role: string;
  vibe: string;
  hiddenTruth: string;
  storyHook: string;
  stats: {
    mischief: number;
    righteousness: number;
    influence: number;
    chaos: number;
    style: number;
    secrets: number;
    sweetTooth: number;
  };
  infoLines: Array<{ label: string; value: string; colorClass?: string }>;
  loreSections: Array<{ title: string; content: string }>;
}

export const PORT_TOWNS: PortTown[] = [
  {
    id: 'toffee-town-port',
    title: 'Toffee Town',
    tagline: 'The Grand Harbour',
    description: 'The crown jewel of ChocoBrook and its grandest gateway. A majestic harbor where golden-sailed ships arrive from distant lands to share their wonders with the capital.',
    imageUrl: '/Assets/PortTowns/ToffeeTown_Harbor.png',
    role: 'Royal Trade & Grand Gateway',
    vibe: 'Majestic, Bustling, Welcoming 🏛️',
    hiddenTruth: 'The city\'s heart beats in time with the tides of the Grand Harbor.',
    storyHook: '“Every ship brings a new friend and a new flavor.”',
    stats: {
      mischief: 10,
      righteousness: 90,
      influence: 95,
      chaos: 5,
      style: 95,
      secrets: 30,
      sweetTooth: 80
    },
    infoLines: [
      { label: 'Maritime Hub', value: 'Ornate stone piers, golden-trimmed sailing vessels, and grand welcome arches.', colorClass: 'text-amber-400' },
      { label: 'Lovely Trade', value: 'Exchange of rare spice-silks, artisan candies, and royal invitation scrolls.', colorClass: 'text-amber-300' },
      { label: 'People First', value: 'Guild masters and townspeople gather daily to celebrate the arrival of new cargo.', colorClass: 'text-sky-400' }
    ],
    loreSections: [
      {
        title: 'The Royal Welcome',
        content: 'Toffee Town\'s harbor is more than just a place of trade; it is the front porch of the province. Every arrival is met with the sound of silver trumpets and the warmth of the Toffee Townfolk who treat every sailor like family.'
      },
      {
        title: 'Artisan Manifest',
        content: 'The port is famous for its **Gilded Cocoa Cloth** and **Royal Caramel Glass**. These aren\'t just goods; they are pieces of art created by the finest craftsmen in the capital, destined to bring joy to every county.'
      },
      {
        title: 'The Harmony of Tides',
        content: 'Unlike the rigid schedules of the past, the Royal Harbor operates on a rhythm of community. When the grand sailing ships arrive, the entire town takes a moment to admire the beauty of the sea and the stories it carries.'
      }
    ]
  },
  {
    id: 'butterscotch-bay-port',
    title: 'Butterscotch Bay',
    tagline: 'The Strategic Trade Port',
    description: 'A whimsical medieval port in Cocawood where golden butterscotch waves lap against sturdy stone docks. A place of curiosity and wonderful clockwork inventions.',
    imageUrl: '/Assets/PortTowns/ButterscotchBay.png',
    role: 'Innovation & Discovery Gateway',
    vibe: 'Curious, Warm, Inventive ✨',
    hiddenTruth: 'Even the simplest tool here is made with a touch of alchemical magic.',
    storyHook: '“Magic is just science we haven\'t shared yet.”',
    stats: {
      mischief: 30,
      righteousness: 60,
      influence: 50,
      chaos: 20,
      style: 70,
      secrets: 40,
      sweetTooth: 85
    },
    infoLines: [
      { label: 'Whimsical Port', value: 'Stone docks with brass clockwork cranes and glowing alchemical lanterns.', colorClass: 'text-orange-400' },
      { label: 'Trade Manifest', value: 'Soft butterscotch ores, glowing spice-extracts, and clockwork toys.', colorClass: 'text-red-400' },
      { label: 'Local Heroes', value: 'Friendly alchemists and clockwork engineers who love to share their secrets.', colorClass: 'text-orange-200' }
    ],
    loreSections: [
      {
        title: 'The Warmth of Discovery',
        content: 'Butterscotch Bay is where the province\'s brightest minds gather to turn raw materials into magic. The air is filled with the gentle hum of clockwork gears and the sweet scent of warm butterscotch.'
      },
      {
        title: 'The People of the Bay',
        content: 'The "Bay-Watchers" are a group of elderly alchemists who spend their days guiding young apprentices through the art of ship-loading using magical pulleys and magnetic stone cranes.'
      },
      {
        title: 'A Medieval Marvel',
        content: 'Built into the ancient cliffs of Cocawood, the port uses a system of water-wheels and gravity-fed slides to move goods safely. It\'s a place of harmony between nature and human ingenuity.'
      }
    ]
  },
  {
    id: 'sprinkle-sands-port',
    title: 'Sprinkle Sands',
    tagline: 'The Free Spirit Port',
    description: 'The loveliest port in Honeywood, where every day is a celebration of friendship. A place of colorful boats, bright markets, and smiling faces.',
    imageUrl: '/Assets/PortTowns/SprinkleSands.png',
    role: 'Friendship & Cultural Exchange',
    vibe: 'Joyful, Friendly, Colorful 🎈',
    hiddenTruth: 'A smile is the only currency you truly need at Sprinkle Sands.',
    storyHook: '“The best things in life are shared with friends.”',
    stats: {
      mischief: 20,
      righteousness: 80,
      influence: 65,
      chaos: 10,
      style: 95,
      secrets: 15,
      sweetTooth: 95
    },
    infoLines: [
      { label: 'Lovely Port', value: 'Colorful sailing boats with rainbow sails and docks decorated with ribbons.', colorClass: 'text-pink-400' },
      { label: 'Market Joy', value: 'Exchange of friendship bracelets, colorful sprinkles, and fresh Honeywood fruit.', colorClass: 'text-violet-400' },
      { label: 'Community Bond', value: 'Children and characters of all kinds gather here to welcome every visitor with a cheer.', colorClass: 'text-cyan-400' }
    ],
    loreSections: [
      {
        title: 'The Harbor of Smiles',
        content: 'Sprinkle Sands is the favorite destination for families across ChocoBrook. The docks are lined with stalls selling "Ever-Sparkle" candies and "Friendship-Flutes" that play music when held by two people.'
      },
      {
        title: 'People & Characters',
        content: 'The "Sand-Scribes" are young artists who draw beautiful patterns in the sprinkle-sand for every ship that docks, ensuring that every traveller feels like the most important person in the world.'
      },
      {
        title: 'A Lovelier Trade',
        content: 'While other ports deal in bulk, Sprinkle Sands deals in moments. A handful of rare "Rainbow Seeds" might be traded for a story or a song, keeping the spirit of Honeywood alive and well.'
      }
    ]
  },
  {
    id: 'praline-port',
    title: 'Praline Port',
    tagline: 'The Quiet Backbone',
    description: 'The essential foundation of the province. A sturdy, reliable port where the community works together to ensure everyone in ChocoBrook has what they need.',
    imageUrl: '/Assets/PortTowns/PralinePort.png',
    role: 'Agricultural Community Hub',
    vibe: 'Steady, Kind, Reliable 🌾',
    hiddenTruth: 'The strength of the province lies in the hands of its hardworking farmers.',
    storyHook: '“True value is found in the things we build together.”',
    stats: {
      mischief: 5,
      righteousness: 90,
      influence: 80,
      chaos: 5,
      style: 30,
      secrets: 10,
      sweetTooth: 60
    },
    infoLines: [
      { label: 'Community Docks', value: 'Timber and stone piers, large grain vessels, and community silos.', colorClass: 'text-emerald-400' },
      { label: 'Reliable Trade', value: 'Exchange of raw nuts, golden honey-grains, and farm-fresh cocoa.', colorClass: 'text-emerald-300' },
      { label: 'Humble Heroes', value: 'The farmers of Nutwood who work with pride to sustain the entire realm.', colorClass: 'text-emerald-200' }
    ],
    loreSections: [
      {
        title: 'The Backbone of the Realm',
        content: 'Praline Port is where the hard work of the Nutwood farmers meets the rest of the world. It is a place of mutual respect, where every sack of pecans is treated with the care it deserves.'
      },
      {
        title: 'Collective Care',
        content: 'The port operates as a cooperative. When the harvest is large, the entire town pitches in to help, and in the evenings, they gather for "Harbor Stew" made from the freshest local ingredients.'
      },
      {
        title: 'Quiet Importance',
        content: 'While it may not have the gold of Toffee Town, Praline Port has the respect of everyone. It is the steady hand that ensures the "Sweet Life" continues for every child in the province.'
      }
    ]
  }
];
