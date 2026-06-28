const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/components/desk/GG_TravellerDeck_Home.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// First, revert the file if it has the backslash errors from the python run
// Or simply replace the import target if it's there
const importTarget = "import type { SubPage } from '../../pages/TravellersDesk';";
const importReplacement = "import type { SubPage } from '../../pages/TravellersDesk';\nimport HomeBox2_Census from './home/HomeBox2_Census';\nimport HomeBox3_Chronicles from './home/HomeBox3_Chronicles';\nimport HomeBox4_Ledger from './home/HomeBox4_Ledger';\nimport HomeBox5_Orientation from './home/HomeBox5_Orientation';";

if (content.includes(importTarget) && !content.includes("import HomeBox2_Census")) {
  content = content.replace(importTarget, importReplacement);
}

// Revert the container if it was partially/badly replaced
// The bad replacement contains "═══ BOX 1: Cottage Exploration ═══" but has backslashes
// Let's just restore it by git checkout first!
const startMarker = '<div className="w-full space-y-6 my-4 select-none">';
const endMarker = '{/* ── DAILY DISPATCH POPUP ── */}';

const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker);

if (startIndex === -1 || endIndex === -1) {
  // If the file was already modified and startMarker was replaced, let's git checkout and retry
  console.log("Could not find start/end marker. Reverting file via git first...");
  const { execSync } = require('child_process');
  execSync('git checkout -- src/components/desk/GG_TravellerDeck_Home.tsx');
  content = fs.readFileSync(filePath, 'utf8');
}

// Add imports
if (content.includes(importTarget) && !content.includes("import HomeBox2_Census")) {
  content = content.replace(importTarget, importReplacement);
}

const sIdx = content.indexOf(startMarker);
const eIdx = content.indexOf(endMarker);

if (sIdx === -1) {
  console.error("Error: Start marker still not found!");
  process.exit(1);
}
if (eIdx === -1) {
  console.error("Error: End marker still not found!");
  process.exit(1);
}

const replacement = `<div className="flex-grow overflow-y-auto custom-scrollbar my-3 space-y-12 pr-1 min-h-0">

        {/* ═══ BOX 1: Cottage Exploration ═══ */}
        <div className="relative w-full shrink-0">
          {/* Solid backing layer */}
          <div className="absolute top-2 left-2 right-0 bottom-0 bg-amber-500/35 border-[3px] border-amber-500/40 rounded-3xl -z-10" />

          {/* Main container */}
          <div
            className="mr-2 mb-2 w-[calc(100%-8px)] lg:h-[500px] rounded-3xl overflow-hidden border-[3px] border-amber-500/40 bg-black/60 relative group z-10 flex flex-col lg:flex-row animate-fade-in"
          >
            {/* ── LEFT: Large Room Image (62%) ── */}
            <div className="w-full lg:w-[62%] lg:h-full lg:min-h-0 min-h-[380px] overflow-hidden relative bg-black flex items-center justify-center border-b-[3px] lg:border-b-0 lg:border-r-[3px] border-amber-500/40">
              {HOME_ROOMS.map(room => (
                <img
                  key={room.id}
                  src={room.image}
                  alt={room.name}
                  className={\`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out \${activeRoom === room.id ? 'opacity-100 z-10' : 'opacity-0 z-0'}\`}
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
                <div className={\`flex flex-col items-center gap-1.5 mb-2 transition-all duration-300 origin-bottom \${showHomeNav ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-75 pointer-events-none'}\`}>
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
                  className={\`w-9 h-9 rounded-full flex items-center justify-center text-base shadow-2xl border transition-all duration-300 \${showHomeNav ? 'bg-amber-500 border-amber-400 scale-110' : 'bg-black/70 border-white/25 hover:bg-black/90'}\`}
                  title="Explore Cottage Rooms"
                >
                  {showHomeNav ? '✖' : '🏡'}
                </button>
              </div>
            </div>

            {/* ── RIGHT: Page Navigation Grid (38%) ── */}
            <div className="w-full lg:w-[38%] p-6 flex flex-col justify-between bg-black/40 overflow-y-auto custom-scrollbar">
              <div className="text-[9px] font-black uppercase tracking-[0.25em] text-neutral-500 px-1 shrink-0 mb-3 border-b border-white/5 pb-2">
                Town Directory
              </div>

              {/* Navigation buttons in 2 rows, glassy and lovelier */}
              <div className="grid grid-cols-4 gap-2.5 flex-grow min-h-0">
                {HOME_NAV_ITEMS.map(nav => {
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
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between shrink-0">
                <span className="text-[8px] font-black uppercase tracking-[0.2em] text-neutral-500 font-sans">Residency Action Log</span>
                <span className="text-[8px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full font-black font-sans">
                  {acceptedItems.filter(i => i.status === 'pending').length} Active Tasks
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Box 2: Census Group */}
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

        {/* Box 3: Chronicles & Campaigns Group */}
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

        {/* Box 4: Ledger Group */}
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
            <p className="text-xs text-neutral-350 italic max-w-4xl mx-auto leading-relaxed">
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

      </div>`;

const newContent = content.substring(0, sIdx) + replacement + content.substring(eIdx);
fs.writeFileSync(filePath, newContent, 'utf8');
console.log('Fixed replacement applied successfully!');
