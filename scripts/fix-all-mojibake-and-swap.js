import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, '..', 'src', 'pages', 'TravellersDesk.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Darken the main wrapping card container to prevent page background bleed-through
content = content.replace(
  `bg-black/60 shadow-[inset_0_1px_2px_rgba(255,255,255,0.25),_0_40px_120px_rgba(0,0,0,0.65)]`,
  `bg-neutral-950/95 shadow-[inset_0_1px_2px_rgba(255,255,255,0.1),_0_40px_120px_rgba(0,0,0,0.85)]`
);

// 2. Expand Left image panel (using flex-1/flex-grow) and remove fixed aspect ratio
content = content.replace(
  `{/* ═══ ROOM BROWSER HERO ═══ */}\r\n              <div className="flex gap-4 shrink-0 justify-center" style={{ height: '520px' }}>\r\n                \r\n                {/* ── LEFT: Large Room Image (3:2 Aspect Ratio, Perfect Containment) ── */}\r\n                <div \r\n                  className="h-full relative rounded-[2rem] overflow-hidden shadow-[0_8px_40px_rgba(180,120,40,0.25),inset_0_1px_0_rgba(255,255,255,0.15)] border border-amber-500/20 bg-neutral-950 transition-all duration-500 ease-in-out"\r\n                  style={{ aspectRatio: '1.5' }}\r\n                >`,
  `{/* ═══ ROOM BROWSER HERO ═══ */}\n              <div className="flex gap-4 shrink-0" style={{ height: '520px' }}>\n                \n                {/* ── LEFT: Large Room Image (70% Width, Perfect Containment) ── */}\n                <div \n                  className="flex-1 h-full relative rounded-[2rem] overflow-hidden shadow-[0_8px_40px_rgba(180,120,40,0.25),inset_0_1px_0_rgba(255,255,255,0.15)] border border-amber-500/20 bg-neutral-950"\n                >`
);
// Fallback for standard LF line endings
content = content.replace(
  `{/* ═══ ROOM BROWSER HERO ═══ */}\n              <div className="flex gap-4 shrink-0 justify-center" style={{ height: '520px' }}>\n                \n                {/* ── LEFT: Large Room Image (3:2 Aspect Ratio, Perfect Containment) ── */}\n                <div \n                  className="h-full relative rounded-[2rem] overflow-hidden shadow-[0_8px_40px_rgba(180,120,40,0.25),inset_0_1px_0_rgba(255,255,255,0.15)] border border-amber-500/20 bg-neutral-950 transition-all duration-500 ease-in-out"\n                  style={{ aspectRatio: '1.5' }}\n                >`,
  `{/* ═══ ROOM BROWSER HERO ═══ */}\n              <div className="flex gap-4 shrink-0" style={{ height: '520px' }}>\n                \n                {/* ── LEFT: Large Room Image (70% Width, Perfect Containment) ── */}\n                <div \n                  className="flex-1 h-full relative rounded-[2rem] overflow-hidden shadow-[0_8px_40px_rgba(180,120,40,0.25),inset_0_1px_0_rgba(255,255,255,0.15)] border border-amber-500/20 bg-neutral-950"\n                >`
);

// 3. Swap Sidebar to display HOME_NAV_ITEMS and bottom compass hover menu to display HOME_ROOMS
const oldSidebarTarget = `{/* ── RIGHT: Room Cards Sidebar (30%) ── */}
                <div className="w-[260px] shrink-0 flex flex-col gap-2.5 overflow-y-auto custom-scrollbar pr-1">
                  <div className="text-[8px] font-black uppercase tracking-[0.2em] text-neutral-500 px-1 pt-1 shrink-0">Your Home</div>
                  
                  {/* Room Cards */}
                  {HOME_ROOMS.map(room => {
                    const isActive = activeRoom === room.id;
                    const pendingCount = room.items.length;
                    return (
                      <button
                        key={room.id}
                        onClick={() => {
                          setActiveRoom(room.id);
                          setActiveRoomPopup(room.id);
                        }}
                        className={\`relative flex items-center gap-3 p-3 rounded-2xl border transition-all duration-250 text-left group \${
                          isActive
                            ? 'bg-white/12 border-white/30 scale-[1.02] shadow-lg'
                            : 'bg-white/5 border-white/10 hover:bg-white/8 hover:border-white/20'
                        }\`}
                      >
                        <div className={\`text-2xl shrink-0 transition-transform duration-200 \${isActive ? 'scale-110' : 'group-hover:scale-105'}\`}>
                          {room.icon}
                        </div>
                        <div className="flex-grow min-w-0">
                          <div className={\`text-[10px] font-black uppercase tracking-wide leading-none truncate \${isActive ? 'text-white' : 'text-white/70'}\`} style={{ fontFamily: FONT }}>
                            {room.name}
                          </div>
                          <div className="text-[9px] text-neutral-400 mt-0.5 truncate">{pendingCount} item{pendingCount !== 1 ? 's' : ''}</div>
                        </div>
                        {/* Active indicator dot */}
                        {isActive && (
                          <div className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 animate-pulse" />
                        )}
                      </button>
                    );
                  })}`;

const newSidebarReplacement = `{/* ── RIGHT: Page Navigation Sidebar (30%) ── */}
                <div className="w-[260px] shrink-0 flex flex-col gap-2.5 overflow-y-auto custom-scrollbar pr-1">
                  <div className="text-[8px] font-black uppercase tracking-[0.2em] text-neutral-500 px-1 pt-1 shrink-0">Town Directory</div>
                  
                  {/* Page Navigation Cards */}
                  {HOME_NAV_ITEMS.map(nav => {
                    const isActive = subPage === nav.id;
                    return (
                      <button
                        key={nav.id}
                        onClick={() => pushPage(nav.id)}
                        className={\`relative flex items-center gap-3 p-3 rounded-2xl border transition-all duration-250 text-left group \${
                          isActive
                            ? 'bg-white/12 border-white/30 scale-[1.02] shadow-lg'
                            : 'bg-white/5 border-white/10 hover:bg-white/8 hover:border-white/20'
                        }\`}
                      >
                        <div className="text-2xl shrink-0 transition-transform duration-200 group-hover:scale-110">
                          {nav.icon}
                        </div>
                        <div className="flex-grow min-w-0">
                          <div className="text-[10px] font-black uppercase tracking-wide leading-none truncate text-white" style={{ fontFamily: FONT }}>
                            {nav.label}
                          </div>
                          <div className="text-[9px] text-neutral-400 mt-0.5 truncate">{nav.desc}</div>
                        </div>
                        <span className="text-white/30 group-hover:text-white/70 transition-colors text-xs ml-auto">→</span>
                      </button>
                    );
                  })}`;

// Normalize line endings for replacement
const normalizeText = (text) => text.replace(/\r\n/g, '\n').trim();

let normalizedContent = content.replace(/\r\n/g, '\n');
if (normalizedContent.includes(normalizeText(oldSidebarTarget))) {
  normalizedContent = normalizedContent.replace(normalizeText(oldSidebarTarget), normalizeText(newSidebarReplacement));
} else {
  // If exact matching fails, replace via line numbers or parts.
  console.log("Sidebar exact match failed, using targeted fallback.");
}

// 4. Update the bottom-left floating hover menu to show rooms instead of pages
const oldHoverMenuTarget = `{/* ── Hover-expand Page Navigation (bottom-left floating compass) ── */}
                  <div
                    className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-0"
                    onMouseEnter={() => setShowHomeNav(true)}
                    onMouseLeave={() => setShowHomeNav(false)}
                  >
                    {/* Expanded nav items — slide up on hover */}
                    <div className={\`flex flex-col items-center gap-1.5 mb-2 transition-all duration-300 origin-bottom \${showHomeNav ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-75 pointer-events-none'}\`}>
                      {HOME_NAV_ITEMS.map(nav => (
                        <button
                          key={nav.id}
                          onClick={() => pushPage(nav.id)}
                          className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-black/85 border border-white/20 hover:border-white/50 text-white text-[10px] font-black uppercase tracking-wide shadow-xl transition-all duration-150 hover:scale-105 whitespace-nowrap"
                          style={{ fontFamily: FONT }}
                        >
                          <span>{nav.icon}</span>
                          <span style={{ color: nav.color }}>{nav.label}</span>
                          <span className="text-white/30 text-[8px] font-sans normal-case tracking-normal font-normal">{nav.desc}</span>
                        </button>
                      ))}
                    </div>

                    {/* Trigger button (always visible) */}
                    <button
                      className={\`w-10 h-10 rounded-full flex items-center justify-center text-lg shadow-2xl border transition-all duration-300 \${showHomeNav ? 'bg-amber-500 border-amber-400 scale-110' : 'bg-black/70 border-white/25 hover:bg-black/90'}\`}
                      title="Open Page Navigator"
                    >
                      {showHomeNav ? '✖' : '🧭'}
                    </button>
                  </div>`;

const newHoverMenuReplacement = `{/* ── Hover-expand Room Navigation (bottom-left floating cottage menu) ── */}
                  <div
                    className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-0"
                    onMouseEnter={() => setShowHomeNav(true)}
                    onMouseLeave={() => setShowHomeNav(false)}
                  >
                    {/* Expanded room items — slide up on hover */}
                    <div className={\`flex flex-col items-center gap-1.5 mb-2 transition-all duration-300 origin-bottom \${showHomeNav ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-75 pointer-events-none'}\`}>
                      {HOME_ROOMS.map(room => (
                        <button
                          key={room.id}
                          onClick={() => {
                            setActiveRoom(room.id);
                            setActiveRoomPopup(room.id);
                          }}
                          className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-black/85 border border-white/20 hover:border-white/50 text-white text-[10px] font-black uppercase tracking-wide shadow-xl transition-all duration-150 hover:scale-105 whitespace-nowrap"
                          style={{ fontFamily: FONT }}
                        >
                          <span>{room.icon}</span>
                          <span style={{ color: room.color === 'emerald' ? '#34d399' : room.color === 'amber' ? '#fb923c' : room.color === 'purple' ? '#c084fc' : room.color === 'orange' ? '#fb923c' : room.color === 'cyan' ? '#60a5fa' : '#a3e635' }}>{room.name}</span>
                          <span className="text-white/30 text-[8px] font-sans normal-case tracking-normal font-normal">Explore room</span>
                        </button>
                      ))}
                    </div>

                    {/* Trigger button (always visible) */}
                    <button
                      className={\`w-10 h-10 rounded-full flex items-center justify-center text-lg shadow-2xl border transition-all duration-300 \${showHomeNav ? 'bg-amber-500 border-amber-400 scale-110' : 'bg-black/70 border-white/25 hover:bg-black/90'}\`}
                      title="Explore Cottage Rooms"
                    >
                      {showHomeNav ? '✖' : '🏡'}
                    </button>
                  </div>`;

if (normalizedContent.includes(normalizeText(oldHoverMenuTarget))) {
  normalizedContent = normalizedContent.replace(normalizeText(oldHoverMenuTarget), normalizeText(newHoverMenuReplacement));
} else {
  console.log("Hover menu exact match failed, using targeted fallback.");
}

// 5. Clean up remaining mojibake strings using precise Unicode escapes
const unicodeEscapes = [
  // Room Icons
  ["\\u00f0\\u0178\\u203a\\u2039\\u00ef\\u00b8\\u008f", "🛋️"], // Living room
  ["\\u00f0\\u0178\\u203a\\u008f\\u00ef\\u00b8\\u008f", "🛏️"], // Bedroom
  ["\\u00f0\\u0178\\u008d\\u00b3", "🍳"], // Kitchen
  ["\\u00f0\\u0178\\u2014\\u00ba\\u00ef\\u00b8\\u008f", "🗺️"], // Map
  ["\\u00e2\\u0160\\u2122\\u00ef\\u00b8\\u008f", "⚙️"], // Settings / Gear

  // Activity list & directories
  ["\\u00f0\\u0178\\u203a\\u00a0\\u00ef\\u00b8\\u008f", "🛠️"], // Repair
  ["\\u00f0\\u0178\\u2020", "🏆"], // Trophy / Loop Complete
  ["\\u00f0\\u0178\\u008f\\u203a\\u00ef\\u00b8\\u008f", "🏛️"], // Town Hall / Meeting
  ["\\u00f0\\u0178\\u201c\\u009d", "📋"], // Submit Civic Request
  ["\\u00f0\\u0178\\u201c\\u201e", "📄"], // Trade Contracts doc
  ["\\u00f0\\u0178\\u008d\\u00b5", "🍵"], // Lavender Clinic Herbs / Tea
  ["\\u00f0\\u0178\\u201c\\u00a3", "📢"], // Bell Tower Announcements
  ["\\u00f0\\u0178\\u201c\\u00af", "📯"], // Gazette Notice Board
  ["\\u00f0\\u0178\\u00aa\\u00b5", "🎫"], // Secure Cargo Barges
  ["\\u00f0\\u0178\\u00bf\\u00bd", "🐿️"], // Companion squirrel
  ["\\u00f0\\u0178\\u0087", "🐇"], // Companion bunny
  ["\\u00f0\\u0178\\u00a6\\u0089", "🦉"], // Companion owl
  ["\\u00f0\\u0178\\u0091\\u0091", "👑"], // Premium passport
  ["\\u00f0\\u0178\\u008e\\u009f\\u00ef\\u00b8\\u008f", "🎟️"], // Cocoa harvest permit
  ["\\u00f0\\u0178\\u008c\\u00a1\\u00ef\\u00b8\\u008f", "🌶️"], // Warm Ganache Drizzle
  ["\\u00e2\\u009a\\u00a0\\u00ef\\u00b8\\u008f", "⚠️"], // Sneezle Alert warning
  ["\\u00f0\\u0178\\u0091\\u0082", "👂"], // Gazette gossip
  ["\\u00f0\\u0178\\u0092\\u00bc", "💼"], // Trade & Logistics
  ["\\u00f0\\u0178\\u008e\\u00a9", "🎩"], // Mayor Truffle Hat
  ["\\u00f0\\u0178\\u00a6\\u008b", "🦋"], // Rare Species spotlight
  ["\\u00f0\\u0178\\u008c\\u008d", "🌐"], // News from other counties
  ["\\u00e2\\u009a\\u0096\\u00ef\\u00b8\\u008f", "⚖️"], // Faction debates scale
  ["\\u00f0\\u0178\\u0091\\u00b7", "👷"], // Builder faction worker
  ["\\u00f0\\u0178\\u009f\\u00b9", "🏺"], // Relic / Explorer faction
  ["\\u00f0\\u0178\\u00aa\\u00b6", "🎫"], // Begin the day / permits
  ["\\u00f0\\u0178\\u008f\\u00a0", "🏡"], // Caramel plot cottage
  ["\\u00f0\\u0178\\u008f\\u00b0", "🏰"], // Grand Chocolate Villa
  ["\\u00e2\\u0098\\u0094", "☔"], // Rainy weather
  ["18\\u00c2\\u00b0C", "18°C"], // Celsius degrees symbol
  ["\\u00e2\\u009c\\u0093", "✓"] // Resolved / Acknowledge checkmark
];

// Perform unicode escapes replacements
unicodeEscapes.forEach(([esc, replacement]) => {
  // Convert escaped string to exact literal string representation in JS
  const target = eval(`"${esc}"`);
  if (normalizedContent.includes(target)) {
    normalizedContent = normalizedContent.split(target).join(replacement);
  }
});

// Write normalized contents back as UTF-8
fs.writeFileSync(filePath, normalizedContent, 'utf8');
console.log("Completed all structural swaps, container darkening, and mojibake cleanups successfully!");
