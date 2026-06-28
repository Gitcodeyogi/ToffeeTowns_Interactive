
import type { StateCreator } from 'zustand';

export type WorldTimePhase = 'morning' | 'afternoon' | 'sunset' | 'night';

export interface WorldEvent {
  time: string;
  hour: number;
  minute: number;
  title: string;
  description: string;
  effect: string;
  category: 'economy' | 'theatre' | 'transport' | 'citizens' | 'weather' | 'festival';
  reason: string;
  affectedPlaces: string[];
  duration: string;
  suggestion: string;
}

export const WORLD_EVENTS_SUNNY: WorldEvent[] = [
  { 
    time: '09:00', hour: 9, minute: 0, 
    title: 'Ganache Market Opens', 
    description: 'Merchant shops are fully stocked with fresh flour and sweet ingredients.', 
    effect: 'Market is open and fully stocked.',
    category: 'economy',
    reason: 'Standard daily opening',
    affectedPlaces: ['Trade Hub', 'Market'],
    duration: '3 Hours',
    suggestion: 'Visit Trade Hub to buy flour'
  },
  { 
    time: '09:15', hour: 9, minute: 15, 
    title: 'Junia walks to Academy', 
    description: 'Junia leaves for the classroom to prepare apothecary lessons.', 
    effect: 'Junia is study-active in the Academy.',
    category: 'citizens',
    reason: 'Apothecary study schedule',
    affectedPlaces: ['Academy'],
    duration: '4 Hours',
    suggestion: 'Check classroom for potion lessons'
  },
  { 
    time: '10:00', hour: 10, minute: 0, 
    title: 'Theatre tickets go on sale', 
    description: 'The playhouse opens ticket counters for the Honeyberry Loaf play.', 
    effect: 'Theatre tickets available at the box office.',
    category: 'theatre',
    reason: 'Morning box office opening',
    affectedPlaces: ['Theatre'],
    duration: '8 Hours',
    suggestion: 'Buy tickets for the evening show'
  },
  { 
    time: '12:00', hour: 12, minute: 0, 
    title: 'Butter prices increase', 
    description: 'Market butter prices spike by 25% due to baking demand.', 
    effect: 'Butter commodity prices are inflated.',
    category: 'economy',
    reason: 'Honeyblueberry Festival / High bakery demand',
    affectedPlaces: ['Trade Hub', 'Bakery', 'Workshop'],
    duration: '2 Hours',
    suggestion: 'Visit Trade Hub'
  },
  { 
    time: '17:00', hour: 17, minute: 0, 
    title: 'Lanterns light up', 
    description: 'Gas lamps are lit across Ganache Grove pathways.', 
    effect: 'Lanterns glowing; ambient evening setting active.',
    category: 'weather',
    reason: 'Dusk light transition',
    affectedPlaces: ['Town Square', 'Walkways'],
    duration: '5 Hours',
    suggestion: 'Enjoy the evening glowing ambience'
  },
  { 
    time: '18:00', hour: 18, minute: 0, 
    title: 'Honeyblueberry play begins', 
    description: 'Curtain rises for the grand theatrical production.', 
    effect: 'Theatre play is actively running.',
    category: 'theatre',
    reason: 'Evening play showtime',
    affectedPlaces: ['Theatre'],
    duration: '3 Hours',
    suggestion: 'Attend the Honeyblueberry Premiere'
  },
  { 
    time: '20:00', hour: 20, minute: 0, 
    title: 'Train departs', 
    description: 'The Night Express Monorail departs from central platforms.', 
    effect: 'Monorail transit route is open.',
    category: 'transport',
    reason: 'Night Monorail Schedule',
    affectedPlaces: ['Transit Station'],
    duration: '2 Hours',
    suggestion: 'Board the Express train'
  },
  { 
    time: '22:00', hour: 22, minute: 0, 
    title: 'Town Curfew Begins', 
    description: 'Curfew sets in; residents retire to their cottages.', 
    effect: 'Ambient crickets activated; quiet town curfew.',
    category: 'citizens',
    reason: 'Midnight safety guidelines',
    affectedPlaces: ['All Sectors'],
    duration: '8 Hours',
    suggestion: 'Rest at Mossberry Cottage'
  }
];

export const WORLD_EVENTS_STORMY: WorldEvent[] = [
  { 
    time: '09:00', hour: 9, minute: 0, 
    title: 'Heavy Rain Storm', 
    description: 'A dense warm front brings heavy rain downpour over the forest.', 
    effect: 'Outdoor walkways are muddy and slippery.',
    category: 'weather',
    reason: 'High humidity rain front',
    affectedPlaces: ['All outdoor pathways'],
    duration: '4 Hours',
    suggestion: 'Stay indoors or wear a rain hood'
  },
  { 
    time: '10:00', hour: 10, minute: 0, 
    title: 'Transit Delayed', 
    description: 'Wet rails force the Monorail to slow down transit rates.', 
    effect: 'Transit travel duration increased by 20%.',
    category: 'transport',
    reason: 'Slippery monorail rails',
    affectedPlaces: ['Transit Station'],
    duration: '6 Hours',
    suggestion: 'Expect slower travel durations'
  },
  { 
    time: '12:00', hour: 12, minute: 0, 
    title: 'Market Attendance Drops', 
    description: 'Fewer citizens attend the outdoor market due to the storm.', 
    effect: 'Commodity sell prices reduced by -20%.',
    category: 'economy',
    reason: 'Residents stay home during peak storm',
    affectedPlaces: ['Market'],
    duration: '4 Hours',
    suggestion: 'Avoid selling goods now'
  },
  { 
    time: '15:00', hour: 15, minute: 0, 
    title: 'Shelter at the Academy', 
    description: 'Professor Crumblewise welcomes travelers to study inside the warm library.', 
    effect: 'Double training merits on study chores.',
    category: 'citizens',
    reason: 'Dry community labs',
    affectedPlaces: ['Academy'],
    duration: '3 Hours',
    suggestion: 'Great time to solve puzzles in the Classroom'
  },
  { 
    time: '18:00', hour: 18, minute: 0, 
    title: 'Lanterns Short Circuit', 
    description: 'Water leaks in gas valves cause dimmer lighting.', 
    effect: 'Dimmer evening town visuals.',
    category: 'weather',
    reason: 'Rain water logs gas valves',
    affectedPlaces: ['Town Square'],
    duration: '2 Hours',
    suggestion: 'Take caution on pathways'
  },
  { 
    time: '19:00', hour: 19, minute: 0, 
    title: 'Evening Show Cancelled', 
    description: 'The playhouse canopy has a leak, forcing the crew to halt.', 
    effect: 'Theatre is closed for repairs.',
    category: 'theatre',
    reason: 'Water leaks in theatre ceiling',
    affectedPlaces: ['Theatre'],
    duration: '4 Hours',
    suggestion: 'No ticket sales tonight'
  },
  { 
    time: '21:00', hour: 21, minute: 0, 
    title: 'Wind Speeds Calm', 
    description: 'The rain halts and the night breeze becomes cool and crisp.', 
    effect: 'Storm front departs.',
    category: 'weather',
    reason: 'Storm head moving east',
    affectedPlaces: ['Forest Canopy'],
    duration: '3 Hours',
    suggestion: 'Paths clearing up soon'
  },
  { 
    time: '22:00', hour: 22, minute: 0, 
    title: 'Curfew in Storm', 
    description: 'Curfew sets in early so workers can sweep storm debris.', 
    effect: 'Curfew active.',
    category: 'citizens',
    reason: 'Storm recovery curfew',
    affectedPlaces: ['All Sectors'],
    duration: '8 Hours',
    suggestion: 'Rest early at Cottage'
  }
];

export const WORLD_EVENTS_FESTIVAL: WorldEvent[] = [
  { 
    time: '09:00', hour: 9, minute: 0, 
    title: 'Mayor Announces Festival', 
    description: 'The Mayor kicks off the Annual Honeyberry Harvest Festival!', 
    effect: 'Sponsor Harvest Festival for double legacy rewards.',
    category: 'festival',
    reason: 'Annual Honeyberry Harvest',
    affectedPlaces: ['Town Square'],
    duration: '12 Hours',
    suggestion: 'Check the Town Hall Desk'
  },
  { 
    time: '10:00', hour: 10, minute: 0, 
    title: 'Sugar Prices Spike', 
    description: 'Confectioners buy sugar at premium rates to brew festival taffy.', 
    effect: 'Sugar syrup buy/sell prices inflated +30%.',
    category: 'economy',
    reason: 'Candy making rush',
    affectedPlaces: ['Market', 'Workshop'],
    duration: '4 Hours',
    suggestion: 'Sell sugar syrup for extra coin profits'
  },
  { 
    time: '12:00', hour: 12, minute: 0, 
    title: 'Parades in the Canopy', 
    description: 'Dancers and bands perform on the wooden suspension walks.', 
    effect: 'Ranger patrols active.',
    category: 'citizens',
    reason: 'Canopy scout festival dancers',
    affectedPlaces: ['Gossip Corner'],
    duration: '3 Hours',
    suggestion: 'Listen to forest gossip for clues'
  },
  { 
    time: '15:00', hour: 15, minute: 0, 
    title: 'Free Theatre Tickets', 
    description: 'The box office distributes free passes for the afternoon show.',
    effect: 'Free entry for all citizens.',
    category: 'theatre',
    reason: 'Mayor subsidizes citizen entry',
    affectedPlaces: ['Theatre'],
    duration: '3 Hours',
    suggestion: 'Claim free show seat'
  },
  { 
    time: '18:00', hour: 18, minute: 0, 
    title: 'Honeyberry Play Premiere', 
    description: 'A special theater production of "The Honeyberry Loaf" begins.', 
    effect: 'Theatre attendance doubled.',
    category: 'theatre',
    reason: 'Festival special performance',
    affectedPlaces: ['Theatre'],
    duration: '4 Hours',
    suggestion: 'Enjoy the play!'
  },
  { 
    time: '20:00', hour: 20, minute: 0, 
    title: 'Festival Monorail Decorated', 
    description: 'Fairy lights and paper lanterns cover the monorail carriages.', 
    effect: 'Free monorail rides.',
    category: 'transport',
    reason: 'Lanterns on the monorail cars',
    affectedPlaces: ['Transit Station'],
    duration: '3 Hours',
    suggestion: 'Ride train for free XP'
  },
  { 
    time: '22:00', hour: 22, minute: 0, 
    title: 'Lantern Festival Glow', 
    description: 'Hundreds of glowing lanterns drift above the canopy.', 
    effect: 'Glow ambient light active.',
    category: 'festival',
    reason: 'Festival night lighting',
    affectedPlaces: ['All pathways'],
    duration: '6 Hours',
    suggestion: 'Check the beautiful lights'
  },
  { 
    time: '23:00', hour: 23, minute: 0, 
    title: 'Curfew post-festival', 
    description: 'Curfew sets in slightly later due to festival celebrations.', 
    effect: 'Late curfew active.',
    category: 'citizens',
    reason: 'End of festival events',
    affectedPlaces: ['All Sectors'],
    duration: '7 Hours',
    suggestion: 'Retire to Mossberry Cottage'
  }
];

export const WORLD_EVENTS_MIGRATION: WorldEvent[] = [
  { 
    time: '09:00', hour: 9, minute: 0, 
    title: 'Fluttermoth Migration', 
    description: 'Rare glowing fluttermoths migrate through the redwood valleys.', 
    effect: 'Moth sightings near the Oakenhart Clinic.',
    category: 'weather',
    reason: 'Warm southern winds',
    affectedPlaces: ['Forest Canopy'],
    duration: '10 Hours',
    suggestion: 'Look out for rare glowing insects'
  },
  { 
    time: '10:00', hour: 10, minute: 0, 
    title: 'Special Monorail Available', 
    description: 'A special observation car is added to the monorail for moth watching.', 
    effect: 'Unique observation carriage open.',
    category: 'transport',
    reason: 'Monorail tracking flight paths',
    affectedPlaces: ['Transit Station'],
    duration: '8 Hours',
    suggestion: 'Special express lines open'
  },
  { 
    time: '12:00', hour: 12, minute: 0, 
    title: 'Moth Spores Cause Sneezles', 
    description: 'Glowing spores dropped by the moths trigger sneezles in residents.', 
    effect: 'Herbal remedy demand increases +40%.',
    category: 'weather',
    reason: 'Spore discharge in forest air',
    affectedPlaces: ['Clinic'],
    duration: '6 Hours',
    suggestion: 'Clinic crowded; visit Dr. Cedric'
  },
  { 
    time: '15:00', hour: 15, minute: 0, 
    title: 'High Demand for Remedies', 
    description: 'Merchants offer premium coin rates for lavender bunches.', 
    effect: 'Lavender bunches sell price +30% boost.',
    category: 'economy',
    reason: 'Fever remedy demand',
    affectedPlaces: ['Market', 'Trade Hub'],
    duration: '4 Hours',
    suggestion: 'Sell lavender bunch at premium rates'
  },
  { 
    time: '17:00', hour: 17, minute: 0, 
    title: 'Bioluminescent Night Glow', 
    description: 'Moths nest in the redwoods, creating a glowing green canopy.', 
    effect: 'Emerald night glow active.',
    category: 'weather',
    reason: 'Moths nesting in redwoods',
    affectedPlaces: ['All paths'],
    duration: '6 Hours',
    suggestion: 'Lanterns glow bright emerald'
  },
  { 
    time: '19:00', hour: 19, minute: 0, 
    title: 'Moth Sanctuary Talk', 
    description: 'Rangers debate local preservation laws at Gossip Corner.', 
    effect: 'Canopy scout debates active.',
    category: 'citizens',
    reason: 'Environmental preservation debates',
    affectedPlaces: ['Gossip Corner'],
    duration: '3 Hours',
    suggestion: 'Check the Gossip Corner dialogs'
  },
  { 
    time: '21:00', hour: 21, minute: 0, 
    title: 'Monorail Night Flight', 
    description: 'The final scenic flight under the bioluminescent skies departs.', 
    effect: 'Scenic monorail open.',
    category: 'transport',
    reason: 'Scenic moth watching train',
    affectedPlaces: ['Transit Station'],
    duration: '2 Hours',
    suggestion: 'Take the night train'
  },
  { 
    time: '22:00', hour: 22, minute: 0, 
    title: 'Curfew sets in', 
    description: 'Curfew begins as the moths settle into the canopy tree branches.', 
    effect: 'Curfew active.',
    category: 'citizens',
    reason: 'Standard daily rest guidelines',
    affectedPlaces: ['All Sectors'],
    duration: '8 Hours',
    suggestion: 'Rest at Cottage'
  }
];

export const getDailyWorldEvents = (): WorldEvent[] => {
  // Map weather/simulation events directly to the newspaper calendar Day 1-10
  const dayIndex = (new Date().getDate() % 10) + 1;
  
  if (dayIndex === 4 || dayIndex === 5) {
    return WORLD_EVENTS_STORMY; // Days 4-5: Spore Outbreak
  }
  if (dayIndex === 6 || dayIndex === 7) {
    return WORLD_EVENTS_MIGRATION; // Days 6-7: Fluttermoth Migration
  }
  if (dayIndex === 8 || dayIndex === 9 || dayIndex === 10) {
    return WORLD_EVENTS_FESTIVAL; // Days 8-10: Clock Tower Festival
  }
  return WORLD_EVENTS_SUNNY; // Days 1-3: Sunny Walkway Construction
};

export interface WorldSimulationEvent extends WorldEvent {
  status: 'passed' | 'active' | 'upcoming';
}

export interface WorldTimeInfo {
  phase: WorldTimePhase;
  hour: number;           // 0-23 real hour
  label: string;          // Pretty label e.g. "Morning"
  emoji: string;
  skyGradient: string;    // CSS gradient class key for the sky overlay
  isTheatreOpen: boolean; // Theatre only opens in evening (18-22)
  isClinicOpen: boolean;  // Clinic closed at night (22-6)
  isMarketBusy: boolean;  // Market is busiest in mornings (6-12)
  currentEvent: WorldEvent | null;
  eventsTimeline: WorldSimulationEvent[];
}

/** Derive the world-time snapshot from a real Date. */
export function deriveWorldTime(now: Date): WorldTimeInfo {
  const hour = now.getHours();
  const minute = now.getMinutes();
  const currentMinutes = hour * 60 + minute;
  const worldEvents = getDailyWorldEvents();

  // Find the active event (the most recent event that has passed)
  let activeIndex = -1;
  let maxTime = -1;
  for (let i = 0; i < worldEvents.length; i++) {
    const evTime = worldEvents[i].hour * 60 + worldEvents[i].minute;
    if (evTime <= currentMinutes && evTime > maxTime) {
      maxTime = evTime;
      activeIndex = i;
    }
  }

  // If no event has passed today yet, the active event is the last event of yesterday
  if (activeIndex === -1) {
    activeIndex = worldEvents.length - 1;
  }

  const eventsTimeline: WorldSimulationEvent[] = worldEvents.map((ev, idx) => {
    let status: 'passed' | 'active' | 'upcoming';
    const evTime = ev.hour * 60 + ev.minute;
    
    if (idx === activeIndex) {
      status = 'active';
    } else {
      const isActiveLast = activeIndex === worldEvents.length - 1 && currentMinutes < worldEvents[0].hour * 60;
      if (isActiveLast) {
        status = idx === activeIndex ? 'active' : 'upcoming';
      } else {
        status = evTime < currentMinutes ? 'passed' : 'upcoming';
      }
    }

    return { ...ev, status };
  });

  const currentEvent = worldEvents[activeIndex] || null;

  let phase: WorldTimePhase;
  let label: string;
  let emoji: string;
  let skyGradient: string;

  if (hour >= 6 && hour < 12) {
    phase = 'morning';
    label = 'Morning';
    emoji = '🌅';
    skyGradient = 'morning';
  } else if (hour >= 12 && hour < 17) {
    phase = 'afternoon';
    label = 'Afternoon';
    emoji = '☀️';
    skyGradient = 'afternoon';
  } else if (hour >= 17 && hour < 21) {
    phase = 'sunset';
    label = 'Sunset';
    emoji = '🌆';
    skyGradient = 'sunset';
  } else {
    phase = 'night';
    label = 'Night';
    emoji = '🌙';
    skyGradient = 'night';
  }

  return {
    phase,
    hour,
    label,
    emoji,
    skyGradient,
    isTheatreOpen: hour >= 18 && hour < 22,
    isClinicOpen: !(hour >= 22 || hour < 6),
    isMarketBusy: hour >= 6 && hour < 12,
    currentEvent,
    eventsTimeline,
  };
}

// ─── Ambient Sound Keys ───────────────────────────────────────────────────────
export type AmbientKey = 'birds' | 'hammering' | 'water' | 'applause' | 'train-bell' | 'crowd' | 'crickets' | 'none';

export const LOCATION_AMBIENT: Record<string, AmbientKey> = {
  home:      'birds',
  economy:   'hammering',
  workshop:  'hammering',
  transport: 'train-bell',
  theatre:   'applause',
  gossip:    'crowd',
  health:    'none',
  classroom: 'none',
  newspaper: 'none',
  places:    'birds',
  shop:      'crowd',
  dashboard: 'none',
  journal:   'none',
  stampbook: 'none',
  politics:  'crowd',
};

// ─── Slice Types ──────────────────────────────────────────────────────────────
export interface WorldTimeSlice {
  worldTime: WorldTimeInfo;
  refreshWorldTime: () => void;
}

export const createWorldTimeSlice: StateCreator<WorldTimeSlice, [], [], WorldTimeSlice> = (set) => ({
  worldTime: deriveWorldTime(new Date()),
  refreshWorldTime: () => set({ worldTime: deriveWorldTime(new Date()) }),
});
