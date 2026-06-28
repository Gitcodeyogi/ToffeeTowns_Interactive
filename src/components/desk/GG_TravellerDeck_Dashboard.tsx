import React from 'react';
import { useTTStore } from '../../store/useTTStore';
import { GG_TravellerDeck_Header } from './GG_TravellerDeck_Header';
import { FONT, type SubPage, getPlayerLevelInfo } from '../../lib/uiConstants';
import { getCanalProgressPct } from '../../data/series/series1_canal';
import { ROLES, MILESTONES, NPC_JOURNEY_LIST } from '../../data/journeyData';

interface GG_TravellerDeck_DashboardProps {
  setSubPage: (page: SubPage) => void;
  pushPage: (page: SubPage) => void;
  popPage: () => void;
  openRoadmap: (npcData?: { name: string; roleId: string; milestones: string[]; isNPC: boolean }) => void;
}

export const GG_TravellerDeck_Dashboard: React.FC<GG_TravellerDeck_DashboardProps> = ({
  setSubPage,
  pushPage,
  popPage,
  openRoadmap,
}) => {
  const {
    coins,
    legacyPoints,
    skills,
    activeTransport,
    completedSeriesSteps,
    setPage,
    currentRoleId,
    completedMilestones,
    travellerName,
  } = useTTStore();

  const progressPct = getCanalProgressPct(completedSeriesSteps);

  // Real career XP is the sum of all skill tracks
  const totalXP = (skills?.builder || 0) + (skills?.explorer || 0) + (skills?.healer || 0);
  const levelInfo = getPlayerLevelInfo(totalXP);

  // Legacy target based on current level
  const getLegacyTarget = (lvl: number): number => {
    const roles = [
      { level: 1, target: 60 },
      { level: 2, target: 150 },
      { level: 3, target: 300 },
      { level: 4, target: 750 },
      { level: 5, target: 1500 },
      { level: 6, target: 1500 },
    ];
    return roles.find(r => r.level === lvl)?.target || 60;
  };

  const legacyTarget = getLegacyTarget(levelInfo.level);
  const legacyProgressPct = Math.min(100, (legacyPoints / legacyTarget) * 100);

  const getProvincialStanding = (points: number): string => {
    if (points >= 1500) return '🏛️ Citizen';
    if (points >= 750)  return '🏘️ Townsman';
    if (points >= 300)  return '🪵 Settler';
    if (points >= 150)  return '🏠 Resident';
    return '🌱 Probationer';
  };

  const standingTitle = getProvincialStanding(legacyPoints);

  const getTransportIcon = (t: string) => {
    switch (t) {
      case 'horse-wagon': return '🐎';
      case 'forest-train': return '🚝';
      case 'hot-air-balloon': return '🎈';
      default: return '🚶';
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-between select-none">
      {/* Header */}
      <GG_TravellerDeck_Header
        title="TRAVELLER DASHBOARD"
        setSubPage={setSubPage}
        popPage={popPage}
      />

      {/* Main Container */}
      <div className="flex-1 overflow-y-auto custom-scrollbar my-3 pr-1 space-y-5 min-h-0">
        
        {/* NEW SECTION: Distinct Progress Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 shrink-0">
          {/* Card 1: Career Progress */}
          <div className="p-5 bg-white/5 border border-white/10 rounded-[2rem] relative overflow-hidden flex flex-col justify-between min-h-[120px] shadow-lg">
            <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500/5 rounded-full blur-xl pointer-events-none" />
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">⭐</span>
                <div>
                  <span className="text-[9px] font-black uppercase text-neutral-400 block tracking-widest font-sans">Professional Standing</span>
                  <h4 className="text-sm font-brand text-white uppercase mt-0.5" style={{ fontFamily: FONT }}>
                    {levelInfo.title.replace(/[^\w\s]/g, '').trim()}
                  </h4>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-yellow-400">Lvl {levelInfo.level}</span>
            </div>
            
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-[11px] font-semibold text-white/70 font-sans">
                <span>Career Progress</span>
                <span className="font-mono">{levelInfo.currentLevelXP} / {levelInfo.nextLevelXPNeeded || 'Max'} XP</span>
              </div>
              <div className="w-full h-2.5 bg-black/40 border border-white/5 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-yellow-500 to-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.4)] transition-all duration-500"
                  style={{ width: `${levelInfo.progressPct}%` }}
                />
              </div>
            </div>
          </div>

          {/* Card 2: Town Legacy */}
          <div className="p-5 bg-white/5 border border-white/10 rounded-[2rem] relative overflow-hidden flex flex-col justify-between min-h-[120px] shadow-lg">
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-xl pointer-events-none" />
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">🏛️</span>
                <div>
                  <span className="text-[9px] font-black uppercase text-neutral-400 block tracking-widest font-sans">Civic Reputation</span>
                  <h4 className="text-sm font-brand text-white uppercase mt-0.5" style={{ fontFamily: FONT }}>
                    {standingTitle.replace(/[^\w\s]/g, '').trim()}
                  </h4>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-indigo-300">{legacyPoints} Points</span>
            </div>

            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-[11px] font-semibold text-white/70 font-sans">
                <span>Town Legacy</span>
                <span className="font-mono">{legacyPoints} / {legacyTarget} Legacy</span>
              </div>
              <div className="w-full h-2.5 bg-black/40 border border-white/5 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 shadow-[0_0_8px_rgba(99,102,241,0.4)] transition-all duration-500"
                  style={{ width: `${legacyProgressPct}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 1: Player Overview Status (Horizontal glass banner) */}
        <div className="p-4 bg-white/5 border border-white/10 rounded-3xl flex flex-wrap md:flex-nowrap gap-4 justify-between items-center relative overflow-hidden shrink-0">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex items-center gap-3">
            <span className="text-3xl p-2 bg-amber-500/10 border border-amber-500/20 rounded-2xl">🏡</span>
            <div>
              <span className="text-[8px] font-black uppercase text-neutral-400 block tracking-wider">Provincial Rank</span>
              <h3 className="text-sm font-brand text-amber-300 uppercase leading-none mt-1" style={{ fontFamily: FONT }}>
                {standingTitle}
              </h3>
              <p className="text-[9.5px] text-white/50 mt-1 font-semibold">Legacy Score: {legacyPoints}</p>
            </div>
          </div>

          <div className="h-8 w-px bg-white/10 hidden md:block" />

          {/* Wallet */}
          <div className="flex items-center gap-3">
            <span className="text-3xl">🪙</span>
            <div>
              <span className="text-[8px] font-black uppercase text-neutral-400 block tracking-wider">Metal Coffers</span>
              <span className="text-sm font-brand text-yellow-400 uppercase leading-none mt-1" style={{ fontFamily: FONT }}>
                {coins} Coins
              </span>
              <p className="text-[9.5px] text-white/50 mt-1">Status: Liquid assets</p>
            </div>
          </div>

          <div className="h-8 w-px bg-white/10 hidden md:block" />

          {/* Equipped vehicle */}
          <div className="flex items-center gap-3">
            <span className="text-3xl p-2 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl">
              {getTransportIcon(activeTransport)}
            </span>
            <div>
              <span className="text-[8px] font-black uppercase text-neutral-400 block tracking-wider">Active Transit</span>
              <h4 className="text-sm font-brand text-cyan-300 uppercase leading-none mt-1" style={{ fontFamily: FONT }}>
                {activeTransport.replace('-', ' ')}
              </h4>
              <p className="text-[9.5px] text-white/50 mt-1 font-semibold">Speed: {activeTransport === 'forest-train' ? '4x' : activeTransport === 'horse-wagon' ? '2x' : '1x'}</p>
            </div>
          </div>
        </div>

        {/* SECTION 2: Interactive Sector Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          
          {/* Card 1: Story Theatre */}
          <div 
            onClick={() => pushPage('theatre')}
            className="flex flex-col justify-between bg-black/40 border border-white/10 rounded-[2.25rem] p-5 hover:border-amber-400 hover:scale-[1.02] transition duration-300 cursor-pointer group shadow-lg"
          >
            <div>
              <div className="aspect-[16/9] w-full rounded-2xl overflow-hidden border border-white/5 bg-neutral-900 relative">
                <img src="/Assets/Ganache Grove/Story_Series1/Scene_01.1.png" alt="Story Theatre" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" onError={(e) => { (e.target as HTMLImageElement).src = '/Assets/Ganache Grove/Scene_0.1.png'; }} />
                <div className="absolute inset-0 bg-black/40 z-10" />
                <div className="absolute top-3 left-3 z-20 px-2 py-0.5 bg-amber-500 text-black text-[8px] font-black uppercase rounded">
                  🎭 Live Act
                </div>
              </div>
              <h3 className="text-base font-brand text-white uppercase mt-4" style={{ fontFamily: FONT }}>
                🎭 Story Theatre
              </h3>
              <p className="text-[11.5px] text-neutral-300 mt-2 leading-relaxed">
                Watch active plays and read county legends. The Honeyblueberry Loaf Incident: <strong>{progressPct}% Completed</strong>.
              </p>
            </div>
            <button 
              className="w-full mt-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-[10px] font-brand uppercase tracking-wider transition"
              style={{ fontFamily: '"Josefin Sans", sans-serif' }}
            >
              Enter Theatre
            </button>
          </div>

          {/* Card 2: Monorail Station */}
          <div 
            onClick={() => pushPage('transport')}
            className="flex flex-col justify-between bg-black/40 border border-white/10 rounded-[2.25rem] p-5 hover:border-cyan-400 hover:scale-[1.02] transition duration-300 cursor-pointer group shadow-lg"
          >
            <div>
              <div className="aspect-[16/9] w-full rounded-2xl overflow-hidden border border-white/5 bg-neutral-900 relative">
                <img src="/towns/macaron-mews.png" alt="Monorail Depot" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                <div className="absolute inset-0 bg-black/40 z-10" />
                <div className="absolute top-3 left-3 z-20 px-2 py-0.5 bg-cyan-500 text-black text-[8px] font-black uppercase rounded">
                  🚝 Depot
                </div>
              </div>
              <h3 className="text-base font-brand text-white uppercase mt-4" style={{ fontFamily: FONT }}>
                🚝 Monorail Station
              </h3>
              <p className="text-[11.5px] text-neutral-300 mt-2 leading-relaxed">
                Manage transit passes, calculate speed multipliers, and send cargo runs. Active: <strong>{activeTransport.replace('-', ' ')}</strong>.
              </p>
            </div>
            <button 
              className="w-full mt-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-[10px] font-brand uppercase tracking-wider transition"
              style={{ fontFamily: '"Josefin Sans", sans-serif' }}
            >
              Board Train
            </button>
          </div>

          {/* Card 3: Gossip Corner */}
          <div 
            onClick={() => pushPage('gossip')}
            className="flex flex-col justify-between bg-black/40 border border-white/10 rounded-[2.25rem] p-5 hover:border-purple-400 hover:scale-[1.02] transition duration-300 cursor-pointer group shadow-lg"
          >
            <div>
              <div className="aspect-[16/9] w-full rounded-2xl overflow-hidden border border-white/5 bg-neutral-900 relative">
                <img src="/towns/eclair-square.png" alt="Gossip Corner" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                <div className="absolute inset-0 bg-black/40 z-10" />
                <div className="absolute top-3 left-3 z-20 px-2 py-0.5 bg-purple-500 text-white text-[8px] font-black uppercase rounded">
                  🗣️ Whispers
                </div>
              </div>
              <h3 className="text-base font-brand text-white uppercase mt-4" style={{ fontFamily: FONT }}>
                🗣️ Gossip Corner
              </h3>
              <p className="text-[11.5px] text-neutral-300 mt-2 leading-relaxed">
                Scan radio dialogs, intercept sweet local secrets, and leak scoops to Julie Frost for standing points.
              </p>
            </div>
            <button 
              className="w-full mt-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-[10px] font-brand uppercase tracking-wider transition"
              style={{ fontFamily: '"Josefin Sans", sans-serif' }}
            >
              Eavesdrop
            </button>
          </div>

          {/* Card 4: Healer Clinic */}
          <div 
            onClick={() => pushPage('health')}
            className="flex flex-col justify-between bg-black/40 border border-white/10 rounded-[2.25rem] p-5 hover:border-emerald-400 hover:scale-[1.02] transition duration-300 cursor-pointer group shadow-lg"
          >
            <div>
              <div className="aspect-[16/9] w-full rounded-2xl overflow-hidden border border-white/5 bg-neutral-900 relative">
                <img src="/towns/hometown_lvl1.png" alt="Clinic Wards" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                <div className="absolute inset-0 bg-black/40 z-10" />
                <div className="absolute top-3 left-3 z-20 px-2 py-0.5 bg-emerald-500 text-black text-[8px] font-black uppercase rounded">
                  🩺 Clinic
                </div>
              </div>
              <h3 className="text-base font-brand text-white uppercase mt-4" style={{ fontFamily: FONT }}>
                🩺 Healer Clinic
              </h3>
              <p className="text-[11.5px] text-neutral-300 mt-2 leading-relaxed">
                Forage for herbs, brew cures in the cauldron, and heal local citizens in the clinic ward.
              </p>
            </div>
            <button 
              className="w-full mt-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-[10px] font-brand uppercase tracking-wider transition"
              style={{ fontFamily: '"Josefin Sans", sans-serif' }}
            >
              Enter Clinic
            </button>
          </div>

          {/* Card 5: Council Chambers */}
          <div 
            onClick={() => pushPage('politics')}
            className="flex flex-col justify-between bg-black/40 border border-white/10 rounded-[2.25rem] p-5 hover:border-pink-400 hover:scale-[1.02] transition duration-300 cursor-pointer group shadow-lg"
          >
            <div>
              <div className="aspect-[16/9] w-full rounded-2xl overflow-hidden border border-white/5 bg-neutral-900 relative">
                <img src="/towns/Toffee-town.png" alt="Council hall" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                <div className="absolute inset-0 bg-black/40 z-10" />
                <div className="absolute top-3 left-3 z-20 px-2 py-0.5 bg-pink-500 text-black text-[8px] font-black uppercase rounded">
                  🏛️ Politics
                </div>
              </div>
              <h3 className="text-base font-brand text-white uppercase mt-4" style={{ fontFamily: FONT }}>
                🏛️ Council chamber
              </h3>
              <p className="text-[11.5px] text-neutral-300 mt-2 leading-relaxed">
                Vote on active bills, lobby the clans for passive bonuses, and collect your daily Citizen Dividend.
              </p>
            </div>
            <button 
              className="w-full mt-4 py-2 bg-pink-600 hover:bg-pink-500 text-white rounded-xl text-[10px] font-brand uppercase tracking-wider transition"
              style={{ fontFamily: '"Josefin Sans", sans-serif' }}
            >
              Lobby Bills
            </button>
          </div>

          {/* Card 6: Citizen Registry */}
          <div 
            onClick={() => setPage('characters')}
            className="flex flex-col justify-between bg-black/40 border border-white/10 rounded-[2.25rem] p-5 hover:border-yellow-400 hover:scale-[1.02] transition duration-300 cursor-pointer group shadow-lg"
          >
            <div>
              <div className="aspect-[16/9] w-full rounded-2xl overflow-hidden border border-white/5 bg-neutral-900 relative">
                <img src="/Assets/Ganache Grove/Scene_0.1.png" alt="Citizen roster" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                <div className="absolute inset-0 bg-black/40 z-10" />
                <div className="absolute top-3 left-3 z-20 px-2 py-0.5 bg-yellow-500 text-black text-[8px] font-black uppercase rounded">
                  👥 Cast
                </div>
              </div>
              <h3 className="text-base font-brand text-white uppercase mt-4" style={{ fontFamily: FONT }}>
                👥 Citizen Registry
              </h3>
              <p className="text-[11.5px] text-neutral-300 mt-2 leading-relaxed">
                Consult biographies of all 7 resident characters, view stats bars, and talk to them to earn standing.
              </p>
            </div>
            <button 
              className="w-full mt-4 py-2 bg-yellow-600 hover:bg-yellow-500 text-white rounded-xl text-[10px] font-brand uppercase tracking-wider transition"
              style={{ fontFamily: '"Josefin Sans", sans-serif' }}
            >
              Open Cast Page
            </button>
          </div>

        </div>

        {/* NEW SECTION: Player Journey Dashboard */}
        <div className="p-5 bg-black/40 border border-white/10 rounded-[2.25rem] space-y-4">
          <div className="flex justify-between items-center border-b border-white/5 pb-2">
            <div>
              <span className="text-[8px] font-black uppercase tracking-[0.25em] text-neutral-400 block font-sans">
                County Census
              </span>
              <h3 className="text-base font-brand text-amber-300 uppercase leading-none mt-0.5" style={{ fontFamily: FONT }}>
                🏛️ Citizen Journey Dashboard
              </h3>
            </div>
            <span className="text-[10px] text-white/40 italic font-sans">
              Click any citizen to inspect their roadmap
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-sans text-xs">
              <thead>
                <tr className="border-b border-white/10 text-neutral-400 font-bold uppercase tracking-wider text-[9px]">
                  <th className="py-2.5 px-3">Player</th>
                  <th className="py-2.5 px-3">Current Role</th>
                  <th className="py-2.5 px-3">Milestone Progress</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {/* Active Player Row */}
                {(() => {
                  const activeRole = ROLES.find(r => r.id === currentRoleId) || ROLES[0];
                  const activeMilestones = MILESTONES.filter(m => m.roleId === activeRole.id);
                  const activeClaimedCount = activeMilestones.filter(m => completedMilestones.includes(m.id)).length;
                  const activeTotalCount = activeMilestones.length;
                  const activeProgressPct = activeTotalCount > 0 
                    ? Math.round((activeClaimedCount / activeTotalCount) * 100) 
                    : 100;

                  return (
                    <tr 
                      onClick={() => openRoadmap()}
                      className="hover:bg-white/5 transition duration-150 cursor-pointer group"
                    >
                      <td className="py-3 px-3 flex items-center gap-2 font-bold text-amber-400">
                        <span className="text-lg">⭐</span>
                        <span>{travellerName || 'You (Probationer)'}</span>
                      </td>
                      <td className="py-3 px-3 font-semibold text-white uppercase tracking-wide">
                        {activeRole.badgeIcon} {activeRole.name}
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-3 w-full max-w-[200px]">
                          <div className="w-full h-1.5 bg-neutral-950/60 rounded-full overflow-hidden">
                            <div 
                              className="h-full rounded-full bg-gradient-to-r from-amber-400 to-yellow-300 shadow-[0_0_8px_rgba(245,158,11,0.5)] transition-all duration-300"
                              style={{ width: `${activeProgressPct}%` }}
                            />
                          </div>
                          <span className="font-bold font-mono text-neutral-300">{activeProgressPct}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-right text-amber-400 font-bold tracking-wider uppercase text-[10px] group-hover:underline">
                        View Journey ➔
                      </td>
                    </tr>
                  );
                })()}

                {/* NPC Rows */}
                {NPC_JOURNEY_LIST.map((npc) => {
                  const role = ROLES.find(r => r.id === npc.roleId)!;
                  return (
                    <tr 
                      key={npc.id}
                      onClick={() => openRoadmap({
                        name: npc.name,
                        roleId: npc.roleId,
                        milestones: npc.milestones,
                        isNPC: true
                      })}
                      className="hover:bg-white/5 transition duration-150 cursor-pointer group"
                    >
                      <td className="py-3 px-3 flex items-center gap-2 font-medium text-white/95">
                        <span className="text-lg">{npc.avatar}</span>
                        <span>{npc.name}</span>
                      </td>
                      <td className="py-3 px-3 text-neutral-300 uppercase tracking-wide">
                        {role.badgeIcon} {role.name}
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-3 w-full max-w-[200px]">
                          <div className="w-full h-1.5 bg-neutral-950/60 rounded-full overflow-hidden">
                            <div 
                              className="h-full rounded-full bg-neutral-700 transition-all duration-300"
                              style={{ width: `${npc.progressPct}%` }}
                            />
                          </div>
                          <span className="font-medium font-mono text-neutral-400">{npc.progressPct}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-right text-neutral-400 font-bold tracking-wider uppercase text-[10px] group-hover:underline">
                        Inspect ➔
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* SECTION 3: Compact Grid Shortcuts to Original Subpages */}
        <div className="p-5 bg-black/20 border border-white/5 rounded-3xl space-y-3">
          <span className="text-[8px] font-black uppercase tracking-[0.25em] text-neutral-400 block">Residency Subsystems</span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { id: 'places', label: '📍 Town Map', color: 'hover:border-emerald-500/50 hover:bg-emerald-500/5' },
              { id: 'journal', label: '📓 Daily Journal', color: 'hover:border-purple-500/50 hover:bg-purple-500/5' },
              { id: 'workshop', label: '🔧 Workshop', color: 'hover:border-yellow-500/50 hover:bg-yellow-500/5' },
              { id: 'classroom', label: '🎓 Academy', color: 'hover:border-cyan-500/50 hover:bg-cyan-500/5' },
              { id: 'mini-games', label: '🎮 Mini Games', color: 'hover:border-sky-500/50 hover:bg-sky-500/5' },
              { id: 'missions', label: '🏆 Missions Board', color: 'hover:border-pink-500/50 hover:bg-pink-500/5' },
              { id: 'newspaper', label: '📜 Gazette Gazette', color: 'hover:border-amber-500/50 hover:bg-amber-500/5' },
              { id: 'stampbook', label: '🎟️ Passport stamps', color: 'hover:border-rose-500/50 hover:bg-rose-500/5' },
            ].map((shortcut) => (
              <div
                key={shortcut.id}
                onClick={() => pushPage(shortcut.id as SubPage)}
                className={`p-2.5 bg-neutral-900/40 border border-white/5 rounded-2xl text-[10.5px] font-semibold text-center cursor-pointer transition duration-200 ${shortcut.color}`}
              >
                {shortcut.label}
              </div>
            ))}
          </div>
        </div>

      </div>

      <div className="p-3 border-t border-white/10 flex items-center justify-center text-xs text-white/40 shrink-0">
        Monitor details and navigate between city gates, monorail cars, and the playhouse.
      </div>
    </div>
  );
};
