/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║            TOFFEE TOWNS — TOWN DESIGN BIBLE                 ║
 * ║          Official Emoji & Icon Reference v1.0                ║
 * ╚══════════════════════════════════════════════════════════════╝
 *
 * This file is the SINGLE SOURCE OF TRUTH for all emojis used
 * across the Toffee Towns application. Every component, page,
 * and overlay MUST reference these constants.
 */

// ─────────────────────────────────────────────────────────────
// 👜 WEALTH & PROGRESSION
// ─────────────────────────────────────────────────────────────
export const EMOJI = {
  // Wealth & Progression
  SATCHEL:          '👜',  // Traveller's Satchel — Total Wealth
  COINS:            '🪙',  // Cocoa Coins — Currency
  LEGACY:           '🎖️',  // Legacy Points — Reputation
  PASSPORT:         '📜',  // Imperial Passport — Residency
  REPUTATION:       '🏵️',  // Town Reputation — Standing
  CONTRACT:         '📋',  // Contract — Work Orders
  ACHIEVEMENT:      '⭐',  // Achievement — Milestones

  // ─────────────────────────────────────────────────────────────
  // 🔨 CAREER PATHS
  // ─────────────────────────────────────────────────────────────
  CAREER_BUILDER:   '🔨',  // Builder
  CAREER_EXPLORER:  '🧭',  // Explorer
  CAREER_POLITICIAN:'🏛️',  // Politician
  CAREER_MERCHANT:  '🛒',  // Merchant
  CAREER_ENGINEER:  '🚂',  // Rail Engineer
  CAREER_HEALER:    '🌿',  // Doctor / Healer
  CAREER_JOURNALIST:'📰',  // Journalist
  CAREER_MUSICIAN:  '🎵',  // Musician

  // ─────────────────────────────────────────────────────────────
  // 🏗️ TOWN ACTIVITIES
  // ─────────────────────────────────────────────────────────────
  ACT_REPAIR:       '🪚',  // Repair Work
  ACT_CONSTRUCTION: '🏗️',  // Construction
  ACT_INVESTIGATE:  '🔎',  // Investigation
  ACT_DEBATE:       '🗣️',  // Town Debate
  ACT_FESTIVAL:     '🎪',  // Festival
  ACT_TRADING:      '📦',  // Trading
  ACT_DELIVERY:     '🚚',  // Delivery
  ACT_SURVEY:       '📍',  // Survey Mission

  // ─────────────────────────────────────────────────────────────
  // 🚶 TRANSPORTS
  // ─────────────────────────────────────────────────────────────
  TRANSPORT_WALK:     '🚶',  // Walking
  TRANSPORT_HORSE:    '🐎',  // Horse Wagon
  TRANSPORT_TRAIN:    '🚂',  // Forest Train
  TRANSPORT_BALLOON:  '🎈',  // Hot Air Balloon

  // ─────────────────────────────────────────────────────────────
  // 🏡 COTTAGE OBJECTS
  // ─────────────────────────────────────────────────────────────
  COTTAGE_DOOR:     '🚪',  // Cottage Door
  COTTAGE_GAZETTE:  '📰',  // Morning Gazette
  COTTAGE_LETTERS:  '✉️',  // Letters
  COTTAGE_LEDGER:   '📖',  // Residency Ledger
  COTTAGE_FIRESIDE: '🔥',  // Fireside Memories
  COTTAGE_ROUTINE:  '📜',  // Daily Routine
  COTTAGE_JOURNAL:  '🕯️',  // Memory Journal
  COTTAGE_WINDOW:   '🪟',  // Window View

  // ─────────────────────────────────────────────────────────────
  // 🏘️ GANACHE GROVE LANDMARKS
  // ─────────────────────────────────────────────────────────────
  LAND_COTTAGE:     '🏡',  // Mossberry Cottage
  LAND_ACADEMY:     '🎓',  // Academy
  LAND_TOWNHALL:    '🏛️',  // Town Hall
  LAND_MARKET:      '🛒',  // Market Square
  LAND_CLINIC:      '🌿',  // Lavender Clinic
  LAND_BELLTOWER:   '🔔',  // Bell Tower
  LAND_GAZETTE:     '📰',  // Gazette Office
  LAND_STATION:     '🚂',  // Forest Rail Station
  LAND_EXPLORER:    '🧭',  // Explorer Lodge
  LAND_DOCKS:       '⚓',  // Riverside Docks

  // ─────────────────────────────────────────────────────────────
  // 🐿️ COMPANIONS
  // ─────────────────────────────────────────────────────────────
  PET_SQUIRREL:     '🐿️',  // Ganache Squirrel
  PET_FOX:          '🦊',  // Cocoa Fox
  PET_BUNNY:        '🐇',  // Marshmallow Bunny
  PET_OWL:          '🦉',  // Mint Owl
  PET_BEAVER:       '🦫',  // Caramel Beaver

  // Companion Reactions
  PET_LOVE:         '❤️',  // Loves You
  PET_SLEEP:        '😴',  // Sleeping
  PET_ACORN:        '🌰',  // Found Acorn
  PET_COIN:         '🪙',  // Found Coin
  PET_EXCITED:      '🎉',  // Excited

  // ─────────────────────────────────────────────────────────────
  // 🌿 TOWN MOODS
  // ─────────────────────────────────────────────────────────────
  MOOD_RELAXED:     '🌿',  // Relaxed
  MOOD_CURIOUS:     '👀',  // Curious
  MOOD_BUSY:        '🏃',  // Busy
  MOOD_HOPEFUL:     '☀️',  // Hopeful
  MOOD_MYSTERIOUS:  '🌙',  // Mysterious
  MOOD_FESTIVE:     '🎉',  // Festive
  MOOD_PROSPEROUS:  '💰',  // Prosperous

  // ─────────────────────────────────────────────────────────────
  // 🌦️ WEATHER
  // ─────────────────────────────────────────────────────────────
  WEATHER_SUNNY:    '☀️',  // Sunny
  WEATHER_CLOUDY:   '☁️',  // Cloudy
  WEATHER_DRIZZLE:  '🌧️',  // Cocoa Drizzle
  WEATHER_BREEZY:   '🍃',  // Breezy
  WEATHER_FOGGY:    '🌫️',  // Foggy
  WEATHER_STORMY:   '⛈️',  // Stormy

  // ─────────────────────────────────────────────────────────────
  // 📰 GAZETTE SECTIONS
  // ─────────────────────────────────────────────────────────────
  GAZ_FRONT:        '📰',  // Front Page
  GAZ_GOSSIP:       '💬',  // Gossip & Whispers
  GAZ_HEALTH:       '🌿',  // Health Watch
  GAZ_TRADE:        '📦',  // Trade & Logistics
  GAZ_POLITICS:     '🏛️',  // Politics
  GAZ_EXPLORATION:  '🧭',  // Exploration
  GAZ_EVENTS:       '🎪',  // Events
  GAZ_SPECIES:      '🦋',  // Rare Species
} as const;

// ─────────────────────────────────────────────────────────────
// Helper: Get career icon by career key
// ─────────────────────────────────────────────────────────────
export const CAREER_ICONS: Record<string, string> = {
  builder:    EMOJI.CAREER_BUILDER,
  explorer:   EMOJI.CAREER_EXPLORER,
  politician: EMOJI.CAREER_POLITICIAN,
  merchant:   EMOJI.CAREER_MERCHANT,
  engineer:   EMOJI.CAREER_ENGINEER,
  healer:     EMOJI.CAREER_HEALER,
  journalist: EMOJI.CAREER_JOURNALIST,
  musician:   EMOJI.CAREER_MUSICIAN,
};

// ─────────────────────────────────────────────────────────────
// Helper: Get transport icon by key
// ─────────────────────────────────────────────────────────────
export const TRANSPORT_ICONS: Record<string, string> = {
  walk:             EMOJI.TRANSPORT_WALK,
  'horse-wagon':    EMOJI.TRANSPORT_HORSE,
  'forest-train':   EMOJI.TRANSPORT_TRAIN,
  'hot-air-balloon': EMOJI.TRANSPORT_BALLOON,
};

// ─────────────────────────────────────────────────────────────
// Helper: Get companion icon by key
// ─────────────────────────────────────────────────────────────
export const COMPANION_ICONS: Record<string, string> = {
  squirrel: EMOJI.PET_SQUIRREL,
  fox:      EMOJI.PET_FOX,
  bunny:    EMOJI.PET_BUNNY,
  owl:      EMOJI.PET_OWL,
  beaver:   EMOJI.PET_BEAVER,
};

// ─────────────────────────────────────────────────────────────
// Helper: Get landmark icon by key
// ─────────────────────────────────────────────────────────────
export const LANDMARK_ICONS: Record<string, string> = {
  cottage:    EMOJI.LAND_COTTAGE,
  academy:    EMOJI.LAND_ACADEMY,
  townhall:   EMOJI.LAND_TOWNHALL,
  market:     EMOJI.LAND_MARKET,
  clinic:     EMOJI.LAND_CLINIC,
  belltower:  EMOJI.LAND_BELLTOWER,
  gazette:    EMOJI.LAND_GAZETTE,
  station:    EMOJI.LAND_STATION,
  explorer:   EMOJI.LAND_EXPLORER,
  docks:      EMOJI.LAND_DOCKS,
};
