import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, '..', 'src', 'pages', 'TravellersDesk.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Revert wrapper card background to bg-black/60 (with original drop shadows)
content = content.replace(
  `bg-neutral-950/95 shadow-[inset_0_1px_2px_rgba(255,255,255,0.1),_0_40px_120px_rgba(0,0,0,0.85)]`,
  `bg-black/60 shadow-[inset_0_1px_2px_rgba(255,255,255,0.25),_0_40px_120px_rgba(0,0,0,0.65)]`
);

// 2. Locate the old grid range and replace it with the clean Report Card layout
// We will replace from index of '{/* ═══ 3-Column Info Grid ═══ */}' to the index of '{/* Divider & Header for Folio Section */}'
const gridHeaderStr = `{/* ═══ 3-Column Info Grid ═══ */}`;
const folioHeaderStr = `{/* Divider & Header for Folio Section */}`;

const gridStartIdx = content.indexOf(gridHeaderStr);
const folioStartIdx = content.indexOf(folioHeaderStr);

if (gridStartIdx !== -1 && folioStartIdx !== -1) {
  const newGridContent = `{/* ═══ Resident Report Card Section ═══ */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 p-1 shrink-0">
                
                {/* LEFT COLUMN: Resident Report Card (lg:col-span-7) */}
                <div className="lg:col-span-7 flex flex-col gap-4">
                  <div className="rounded-3xl border border-amber-500/25 bg-amber-500/5 p-5 flex flex-col gap-4 shadow-lg">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-amber-500/20 pb-2">
                      <h3 className="text-sm font-brand text-amber-300 uppercase flex items-center gap-1.5" style={{ fontFamily: FONT }}>
                        📋 Resident Report Card
                      </h3>
                      <span className="text-[9px] text-amber-400/80 font-black uppercase tracking-wider">Mossberry Lane 14</span>
                    </div>

                    {/* Section 1: Routine Progression */}
                    <div className="space-y-2.5">
                      <h4 className="text-[10px] font-black uppercase tracking-wider text-neutral-400">Residency Routine Progression</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {/* Task A */}
                        <div className="flex items-center justify-between p-2.5 bg-white/5 border border-white/5 rounded-xl">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="text-sm shrink-0">{dossierRead ? '✅' : '📥'}</span>
                            <span className={\`text-[11px] truncate \${dossierRead ? 'line-through text-white/30 font-medium' : 'text-white font-medium'}\`}>Morning Briefing</span>
                          </div>
                          {!dossierRead && (
                            <button onClick={() => setShowDossierPlaycard(true)} className="text-[9px] bg-amber-500 hover:bg-amber-400 text-black px-2 py-0.5 rounded-md uppercase font-black shrink-0">Open</button>
                          )}
                        </div>

                        {/* Task B */}
                        <div className="flex items-center justify-between p-2.5 bg-white/5 border border-white/5 rounded-xl">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="text-sm shrink-0">
                              {completedActions.filter(x => ['walkway', 'bell', 'sneezles', 'festival'].includes(x)).length >= 3 ? '✅' : '🛠️'}
                            </span>
                            <span className={\`text-[11px] truncate \${completedActions.filter(x => ['walkway', 'bell', 'sneezles', 'festival'].includes(x)).length >= 3 ? 'line-through text-white/30 font-medium' : 'text-white font-medium'}\`}>
                              Actions ({completedActions.filter(x => ['walkway', 'bell', 'sneezles', 'festival'].includes(x)).length}/3)
                            </span>
                          </div>
                        </div>

                        {/* Task C */}
                        <div className="flex items-center justify-between p-2.5 bg-white/5 border border-white/5 rounded-xl">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="text-sm shrink-0">{lastStampedDate === new Date().toISOString().slice(0, 10) ? '✅' : '🎫'}</span>
                            <span className={\`text-[11px] truncate \${lastStampedDate === new Date().toISOString().slice(0, 10) ? 'line-through text-white/30 font-medium' : 'text-white font-medium'}\`}>Passport Stamp</span>
                          </div>
                          {lastStampedDate !== new Date().toISOString().slice(0, 10) && (
                            <button onClick={() => setSubPage('stampbook')} className="text-[9px] bg-amber-500 hover:bg-amber-400 text-black px-2 py-0.5 rounded-md uppercase font-black shrink-0">Log</button>
                          )}
                        </div>

                        {/* Task D */}
                        <div className="flex items-center justify-between p-2.5 bg-white/5 border border-white/5 rounded-xl">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="text-sm shrink-0">{ownedDecorations.length > 0 || ownedPets.length > 0 ? '✅' : '🏡'}</span>
                            <span className={\`text-[11px] truncate \${(ownedDecorations.length > 0 || ownedPets.length > 0) ? 'line-through text-white/30 font-medium' : 'text-white font-medium'}\`}>Beautify Cottage</span>
                          </div>
                          {!(ownedDecorations.length > 0 || ownedPets.length > 0) && (
                            <button onClick={() => setSubPage('shop')} className="text-[9px] bg-amber-500 hover:bg-amber-400 text-black px-2 py-0.5 rounded-md uppercase font-black shrink-0">Shop</button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Section 2: Profession & standing standings */}
                    <div className="border-t border-white/5 pt-3 space-y-2.5">
                      <h4 className="text-[10px] font-black uppercase tracking-wider text-neutral-400">Resident Standings & Ranks</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="p-3 bg-white/5 border border-white/5 rounded-2xl flex flex-col gap-1 justify-between">
                          <span className="text-[8px] text-neutral-400 uppercase tracking-widest">Provincial Title</span>
                          <span className="text-white font-black text-xs uppercase" style={{ fontFamily: FONT }}>{getProvincialStanding(legacyPoints)}</span>
                          <span className="text-[9px] text-neutral-400 font-mono mt-0.5">{legacyPoints} Legacy Pts</span>
                        </div>
                        <div className="p-3 bg-white/5 border border-white/5 rounded-2xl flex flex-col gap-1 justify-between">
                          <span className="text-[8px] text-neutral-400 uppercase tracking-widest">Town Reputation</span>
                          <span className="text-amber-300 font-bold text-xs">
                            {completedActions.filter(x => ['walkway', 'bell', 'sneezles', 'festival'].includes(x)).length >= 3 ? '★★★★★ Champion' :
                             completedActions.filter(x => ['walkway', 'bell', 'sneezles', 'festival'].includes(x)).length === 2 ? '★★★★☆ Respected' :
                             completedActions.filter(x => ['walkway', 'bell', 'sneezles', 'festival'].includes(x)).length === 1 ? '★★★☆☆ Helper' :
                             '★★☆☆☆ Visitor'}
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

                {/* RIGHT COLUMN: Town Pulse & Matters Tracker (lg:col-span-5) */}
                <div className="lg:col-span-5 flex flex-col gap-4">
                  <div className="rounded-3xl border border-white/10 bg-black/25 p-5 flex flex-col gap-4 shadow-lg h-full justify-between">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-white/5 pb-2">
                      <h3 className="text-sm font-brand text-purple-400 uppercase flex items-center gap-1.5" style={{ fontFamily: FONT }}>
                        ⚡ Town Pulse & Active Projects
                      </h3>
                      <span className="px-1.5 py-0.5 bg-red-900/30 text-red-400 text-[8px] font-bold uppercase rounded border border-red-500/20 font-mono">
                        {dailyActivities.filter(a => !completedActions.includes(a.id)).length} Pending
                      </span>
                    </div>

                    {/* Pulse status */}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-2 bg-white/5 border border-white/5 rounded-xl flex items-center gap-2">
                        <span className="text-base shrink-0">🌲</span>
                        <div className="min-w-0">
                          <span className="text-[7.5px] text-neutral-400 tracking-wider block font-bold uppercase">Mood</span>
                          <span className="text-white font-medium text-[10px] truncate block">Relaxed & Mysterious</span>
                        </div>
                      </div>
                      <div className="p-2 bg-white/5 border border-white/5 rounded-xl flex items-center gap-2">
                        <span className="text-base shrink-0">🩺</span>
                        <div className="min-w-0">
                          <span className="text-[7.5px] text-neutral-400 tracking-wider block font-bold uppercase">Health</span>
                          <span className={\`font-bold text-[10px] truncate block \${completedActions.includes('sneezles') ? 'text-emerald-400' : 'text-red-400'}\`}>
                            {completedActions.includes('sneezles') ? 'Good' : 'Moss Sneezles Warning'}
                          </span>
                        </div>
                      </div>
                      <div className="p-2 bg-white/5 border border-white/5 rounded-xl flex items-center gap-2">
                        <span className="text-base shrink-0">🍫</span>
                        <div className="min-w-0">
                          <span className="text-[7.5px] text-neutral-400 tracking-wider block font-bold uppercase">Trade</span>
                          <span className="text-white font-medium text-[10px] truncate block">Busy (Ganache Pods)</span>
                        </div>
                      </div>
                      <div className="p-2 bg-white/5 border border-white/5 rounded-xl flex items-center gap-2">
                        <span className="text-base shrink-0">🚂</span>
                        <div className="min-w-0">
                          <span className="text-[7.5px] text-neutral-400 tracking-wider block font-bold uppercase">Transit</span>
                          <span className="text-white font-medium text-[10px] truncate block">Forest Rail Active</span>
                        </div>
                      </div>
                    </div>

                    {/* Active Matters Tracker */}
                    <div className="space-y-2 border-t border-white/5 pt-3 flex-grow overflow-y-auto custom-scrollbar pr-1">
                      <h4 className="text-[10px] font-black uppercase tracking-wider text-neutral-400 mb-1.5">Matters Requiring Attention</h4>
                      
                      {/* Matter 1 */}
                      <div className="flex items-center justify-between p-2 bg-white/5 border border-white/5 rounded-xl gap-2">
                        <div className="min-w-0">
                          <span className="text-[10px] font-bold text-white block truncate">Support: {selectedProj.title.replace('Support ', '')}</span>
                          <span className="text-[8.5px] text-neutral-400 block truncate leading-tight">{selectedProj.requirementsSummary}</span>
                        </div>
                        {completedActions.includes(selectedProj.id) ? (
                          <span className="text-[9px] text-emerald-400 font-bold shrink-0">✓ Done</span>
                        ) : (
                          <button
                            onClick={() => handleExecuteMatter(selectedProj.id)}
                            className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-black text-[8px] font-brand uppercase tracking-wider rounded-md transition shrink-0"
                            style={{ fontFamily: FONT }}
                          >
                            🛠️ Support
                          </button>
                        )}
                      </div>

                      {/* Matter 2 */}
                      <div className="flex items-center justify-between p-2 bg-white/5 border border-white/5 rounded-xl gap-2">
                        <div className="min-w-0">
                          <span className="text-[10px] font-bold text-white block truncate">Investigate: {selectedMyst.title.replace('Investigate ', '')}</span>
                          <span className="text-[8.5px] text-neutral-400 block truncate leading-tight">{selectedMyst.requirementsSummary}</span>
                        </div>
                        {completedActions.includes(selectedMyst.id) ? (
                          <span className="text-[9px] text-emerald-400 font-bold shrink-0">✓ Done</span>
                        ) : (
                          <button
                            onClick={() => handleExecuteMatter(selectedMyst.id)}
                            className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-black text-[8px] font-brand uppercase tracking-wider rounded-md transition shrink-0"
                            style={{ fontFamily: FONT }}
                          >
                            🔍 Search
                          </button>
                        )}
                      </div>

                      {/* Matter 3 */}
                      <div className="flex items-center justify-between p-2 bg-white/5 border border-white/5 rounded-xl gap-2">
                        <div className="min-w-0">
                          <span className="text-[10px] font-bold text-white block truncate">Campaign: {selectedCamp.title.replace('Sponsor ', '').replace('Dredge ', '').replace('Express ', '')}</span>
                          <span className={\`text-[8.5px] text-neutral-400 block truncate leading-tight\`}>Town Hall Campaign</span>
                        </div>
                        {completedActions.includes(selectedCamp.id) ? (
                          <span className="text-[9px] text-emerald-400 font-bold shrink-0">✓ Done</span>
                        ) : (
                          <button
                            onClick={() => setShowTownHallModal(true)}
                            className="px-2.5 py-1 bg-cyan-600 hover:bg-cyan-500 text-white text-[8px] font-brand uppercase tracking-wider rounded-md transition shrink-0"
                            style={{ fontFamily: FONT }}
                          >
                            🏛️ Go
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

              </div>
              
              `;
  content = content.substring(0, gridStartIdx) + newGridContent + content.substring(folioStartIdx);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log("Successfully replaced the clumsy lower grid with the streamlined Resident Report Card!");
} else {
  console.log("Failed to locate one or both grid boundary indices.");
}
