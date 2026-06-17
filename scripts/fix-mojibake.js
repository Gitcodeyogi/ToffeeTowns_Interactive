import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, '..', 'src', 'pages', 'TravellersDesk.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Systematic replacements for corrupted mojibake strings
const replacements = [
  // Room definition emojis
  ["'ðŸŒ²'", "'🌳'"],
  ["'ðŸ›‹ï¸ '", "'🛋️'"],
  ["'ðŸ› ï¸ '", "'🛏️'"],
  ["'ðŸ ³'", "'🍳'"],
  ["'ðŸŒ¿'", "'🌿'"],
  ["'ðŸŒ±'", "'🌱'"],

  // Navigation icons
  ["'ðŸ—ºï¸ '", "'🗺️'"],
  ["'ðŸ“š'", "'📚'"],
  ["'ðŸ›’'", "'🛒'"],
  ["'ðŸ“°'", "'📰'"],
  ["'ðŸ““'", "'📓'"],
  ["'ðŸª¶'", "'🎫'"],
  ["'âš™ï¸ '", "'⚙️'"],

  // Subpage triggers
  ["showHomeNav ? 'âœ•' : 'ðŸ§­'", "showHomeNav ? '✖' : '🧭'"],

  // Address and date separators
  ["Mossberry Lane 14 Â· Ganache Grove", "Mossberry Lane 14 · Ganache Grove"],
  ["{getChocolateDate()} Â· Mossberry Lane 14", "{getChocolateDate()} · Mossberry Lane 14"],
  ["Confection Year {CONFECTION_YEAR} Â· Cocoawood County", "Confection Year {CONFECTION_YEAR} · Cocoawood County"],

  // HUD elements
  ["<span>ðŸª™ {coins}</span>", "<span>🪙 {coins}</span>"],
  ["<span>ðŸŽ–ï¸  {legacyPoints}</span>", "<span>🎖️ {legacyPoints}</span>"],

  // Accepted item types check (lines 1049 & 1096)
  [
    "item.type === 'coin' ? 'ðŸª™' : item.type === 'opportunity' ? 'ðŸ“œ' : item.type === 'letter' ? 'âœ‰ï¸ ' : item.type === 'task' ? 'ðŸ› ï¸ ' : 'ðŸ“¢'",
    "item.type === 'coin' ? '🪙' : item.type === 'opportunity' ? '📜' : item.type === 'letter' ? '✉️' : item.type === 'task' ? '🛠️' : '📢'"
  ],

  // Room popups
  ["âœ… Accept", "✅ Accept"],
  ["ðŸ’¾ Save", "💾 Save"],
  ["â Œ Reject", "❌ Reject"],
  ["ðŸ¤  Share", "🤝 Share"],
  ['triggerFeedback(`ðŸ’¾ Saved "${item.title}" for later.`);', 'triggerFeedback(`💾 Saved "${item.title}" for later.`);'],
  ['triggerFeedback(`â Œ Rejected "${item.title}".`);', 'triggerFeedback(`❌ Rejected "${item.title}".`);'],
  ['triggerFeedback(`ðŸ¤  Copied "${item.title}" to share with a friend!`);', 'triggerFeedback(`🤝 Copied "${item.title}" to share with a friend!`);'],
  ['const shareText = `ðŸ « Toffee Towns â€” ${item.title}\\n"${item.desc}"\\nJoin me in Ganache Grove! toffeetowns.fun`;', 'const shareText = `🍫 Toffee Towns — ${item.title}\\n"${item.desc}"\\nJoin me in Ganache Grove! toffeetowns.fun`;'],

  // Daily loop rewards claim section
  ["Claim Loop Rewards ({completedCount}/5 Done: +{completedCount * 10}ðŸª™, +{completedCount * 4}ðŸŽ–ï¸ )", "Claim Loop Rewards ({completedCount}/5 Done: +{completedCount * 10}🪙, +{completedCount * 4}🎖️)"],
  ["triggerFeedback(`ðŸ † Claimed Loop Rewards! +${rewardCoins} Coins, +${rewardLegacy} Legacy, & Presence Stamp!`);", "triggerFeedback(`🏆 Claimed Loop Rewards! +${rewardCoins} Coins, +${rewardLegacy} Legacy, & Presence Stamp!`);"],
  ["icon: 'ðŸ †'", "icon: '🏆'"],

  // Checklist / Dossier
  ["dossierRead ? 'âœ…' : 'ðŸ...'", "dossierRead ? '✅' : '📥'"],
  ["completedActions.filter(x => ['walkway', 'bell', 'sneezles', 'festival'].includes(x)).length >= 3 ? 'âœ…' : 'ðŸ› ï¸ '", "completedActions.filter(x => ['walkway', 'bell', 'sneezles', 'festival'].includes(x)).length >= 3 ? '✅' : '🛠️'"],
  ["lastStampedDate === new Date().toISOString().slice(0, 10) ? 'âœ…' : 'ðŸª¶'", "lastStampedDate === new Date().toISOString().slice(0, 10) ? '✅' : '📜'"],
  ["ownedDecorations.length > 0 || ownedPets.length > 0 ? 'âœ…' : 'ðŸ  '", "ownedDecorations.length > 0 || ownedPets.length > 0 ? '✅' : '🏡'"],

  // Daily loop status text and feedback
  ["triggerFeedback('ðŸ“° Morning Loop: Read Gazette Completed! +15 Coins & +10 Legacy!');", "triggerFeedback('📰 Morning Loop: Read Gazette Completed! +15 Coins & +10 Legacy!');"],
  ["triggerFeedback('ðŸ› ï¸  Afternoon Loop: Walkway Repair Completed! +20 Coins & +15 Legacy!');", "triggerFeedback('🛠️ Afternoon Loop: Walkway Repair Completed! +20 Coins & +15 Legacy!');"],
  ["triggerFeedback('ðŸŽ“ Midday Loop: Builder Seminar Completed! +15 Coins & +15 Legacy!');", "triggerFeedback('🎓 Midday Loop: Builder Seminar Completed! +15 Coins & +15 Legacy!');"],
  ["triggerFeedback('ðŸ  Evening Loop: Tavern Gossip Completed! +10 Coins & +10 Legacy!');", "triggerFeedback('🍻 Evening Loop: Tavern Gossip Completed! +10 Coins & +10 Legacy!');"],
  ["triggerFeedback('ðŸŒ¹ Night Loop: Rest & Reflection Completed! +10 Coins & +15 Legacy!');", "triggerFeedback('🌹 Night Loop: Rest & Reflection Completed! +10 Coins & +15 Legacy!');"],

  // Loop phases info/labels
  ["icon: 'ðŸš¶'", "icon: '🚶'"],
  ["icon: 'ðŸŽ“'", "icon: '🎓'"],
  ["icon: 'ðŸ› ï¸ '", "icon: '🛠️'"],
  ["icon: 'ðŸš‚'", "icon: '🚂'"],
  ["icon: 'ðŸ“ '", "icon: '📋'"],
  ["icon: 'ðŸ“¦'", "icon: '📦'"],
  ["icon: 'ðŸ©º'", "icon: '🩺'"],
  ["icon: 'ðŸ””'", "icon: '🔔'"],
  ["icon: 'ðŸ ›ï¸ '", "icon: '🏛️'"],
  ["icon: 'ðŸ »'", "icon: '🍻'"],
  ["icon: 'ðŸ’¬'", "icon: '💬'"],
  ["icon: 'ðŸŽµ'", "icon: '🎵'"],
  ["icon: 'ðŸ§¹'", "icon: '🧹'"],
  ["icon: 'ðŸ¦†'", "icon: '🦆'"],
  ["icon: 'âš“'", "icon: '⚓'"],
  ["icon: 'ðŸŒ¤'", "icon: '🌤️'"],
  ["icon: 'ðŸ †'", "icon: '🏆'"],
  ["icon: 'ðŸª™'", "icon: '🪙'"],
  ["icon: 'ðŸŽ–ï¸ '", "icon: '🎖️'"],
  ["icon: 'ðŸ§­'", "icon: '🧭'"],
  
  ["icon: 'ðŸŒ°'", "icon: '🍰'"],
  ["icon: 'ðŸŒŠ'", "icon: '🌊'"],
  ["icon: 'ðŸ ”'", "icon: '🏔️'"],

  // Directories and Logs
  ["ðŸ“  Ganache Grove Landmark Directory", "📍 Ganache Grove Landmark Directory"],
  ["ðŸ“Œ Note:", "📌 Note:"],
  ["ðŸ““ Resident Logs", "📓 Resident Logs"],
  ["ðŸ““ Resident Journal", "📓 Resident Journal"],
  ['<span className="text-4xl">ðŸ““</span>', '<span className="text-4xl">📓</span>'],

  // Months
  ["PralinÃ©e", "Praline"],
  ["Velvetine", "Velv"],
  ["Mossbloom", "Moss"],
  ["Caramelle", "Cara"],
  ["Truffleshire", "Truf"],
  ["Ganachember", "Gana"],
  ["Cocoveil", "Coco"],
  ["Butterscotch", "Butt"],
  ["Candlewick", "Cand"],
  ["Mintmere", "Mint"],
  ["Cinnascent", "Cinn"],
  ["Fondantide", "Fond"],

  // Weather reading Ganachember to June
  ["ðŸŒ¤ Ganachember morning", "🌤️ June morning"],

  // Miscellaneous feedback / popup characters
  ["âœ…", "✅"],
  ["â Œ", "❌"],
  ["Â·", "·"],
  ["â€”", "—"],
  ["â€¢", "•"],
  ["Ã©", "é"],
  ["â• â• â• ", "═══"],
  ["â”€â”€", "──"]
];

// Perform replacements
let replacedCount = 0;
replacements.forEach(([target, replacement]) => {
  if (content.includes(target)) {
    content = content.split(target).join(replacement);
    replacedCount++;
  }
});

// Update the month arrays to English 4-letter months
content = content.replace(
  `const CHOC_MONTHS = ['Pral','Velv','Moss','Cara','Truf','Gana','Coco','Butt','Cand','Mint','Cinn','Fond'];`,
  `const CHOC_MONTHS = ['Janu', 'Febr', 'Marc', 'Apri', 'May ', 'June', 'July', 'Augu', 'Sept', 'Octo', 'Nove', 'Dece'];`
);

content = content.replace(
  `const CHOC_MONTH_FULL = ['PralinÃ©e','Velvetine','Mossbloom','Caramelle','Truffleshire','Ganachember','Cocoveil','Butterscotch','Candlewick','Mintmere','Cinnascent','Fondantide'];`,
  `const CHOC_MONTH_FULL = ['Janu', 'Febr', 'Marc', 'Apri', 'May ', 'June', 'July', 'Augu', 'Sept', 'Octo', 'Nove', 'Dece'];`
);

fs.writeFileSync(filePath, content, 'utf8');
console.log(`Successfully completed ${replacedCount} string replacements!`);
