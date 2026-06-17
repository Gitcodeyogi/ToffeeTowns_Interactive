// Script to replace emoji literals with EMOJI constants in TravellersDesk.tsx
const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '..', 'src', 'pages', 'TravellersDesk.tsx');
let content = fs.readFileSync(file, 'utf8');

// ── Systematic replacements ──
// These replacements target specific emoji patterns in JSX text and template literals
// We need to be careful to only replace emojis in the RIGHT context

const replacements = [
  // HUD / Wealth indicators — replace emoji in JSX text spans
  // 🪙 coins → EMOJI.COINS
  // Pattern: <span>🪙 {coins}</span> → <span>{EMOJI.COINS} {coins}</span>
  [/>🪙 \{coins\}</g, `>{EMOJI.COINS} {coins}<`],
  [/>🪙 \{legacyPoints\}/g, `>{EMOJI.COINS} {legacyPoints}<`],
  
  // 🎖️ legacy  
  [/>🎖️ \{legacyPoints\}/g, `>{EMOJI.LEGACY} {legacyPoints}<`],
  
  // Career icons in standing panels
  // Builder
  [/>Builder</g, `>{EMOJI.CAREER_BUILDER} Builder<`],
  [/>Explorer</g, `>{EMOJI.CAREER_EXPLORER} Explorer<`],
  [/>Healer</g, `>{EMOJI.CAREER_HEALER} Healer<`],
  
  // Transport icon
  [/icon: '🚶'/g, `icon: EMOJI.TRANSPORT_WALK`],
  [/icon: '🎓'/g, `icon: EMOJI.LAND_ACADEMY`],
  [/icon: '🛠️'/g, `icon: EMOJI.ACT_REPAIR`],
  
  // Landmark emojis in nav
  [/icon: '🗺️'/g, `icon: '🗺️'`],  // keep map
  [/icon: '📚'/g, `icon: EMOJI.LAND_ACADEMY`],
  [/icon: '🛒'/g, `icon: EMOJI.LAND_MARKET`],
  [/icon: '📰'/g, `icon: EMOJI.COTTAGE_GAZETTE`],
  [/icon: '📓'/g, `icon: EMOJI.COTTAGE_JOURNAL`],
  [/icon: '🪶'/g, `icon: EMOJI.PASSPORT`],
  [/icon: '⚙️'/g, `icon: '⚙️'`],  // keep settings
  
  // Town Pulse section
  [/>🌲<\/span>/g, `>{EMOJI.MOOD_RELAXED}</span>`],
  
  // Room items
  [/icon: '🛒'/, `icon: EMOJI.LAND_MARKET`],
];

// Apply simple string replacements more carefully
// Let's do targeted find-and-replace

// Pet companion emoji fix
content = content.replace(
  /equippedPet === 'squirrel' \? '🐿️' : equippedPet === 'bunny' \? '🐇' : equippedPet === 'owl' \? '🦉' : '🐾'/g,
  `COMPANION_ICONS[equippedPet || ''] || '🐾'`
);

fs.writeFileSync(file, content, 'utf8');
console.log('Done!');
