import React, { useState } from 'react';
import { CANAL_SERIES, getCanalProgressPct } from '../../data/series/series1_canal';
import { FONT, type SubPage } from '../../lib/uiConstants';

interface Props {
  setSubPage: (p: SubPage) => void;
  popPage: () => void;
  triggerFeedback: (msg: string) => void;
  setSeriesPopupOpen: (open: boolean) => void;
  completedSeriesSteps: string[];
  series1StartDate: string | null;
}

// ── Series catalogue ──────────────────────────────────────────
const SERIES_CATALOGUE = [
  {
    id: 'series-1',
    number: 1,
    status: 'active' as const,
    arc: 'Probationer Arc',
    title: 'The Honeyberry Loaf Incident',
    subtitle: 'Pipkin Nutterby has run off with Baker Mortimer\'s prize loaf!',
    description:
      'Baker Mortimer left his newly glazed Honeyberry Loaf cooling on the sill, but it has vanished! Pipkin Nutterby was seen running towards the East Canopy with a suspicious cloth bundle. Help Rowan Thistle and the volunteer search crews pursue Pipkin, deal with wild canopy squirrels, and track down the loaf across the elevated mossway bridges.',
    steps: CANAL_SERIES.length,
    totalXP: 250,
    totalCoins: 65,
    totalInfluence: 15,
    badge: 'Honeyberry Hero',
    badgeIcon: '🏅',
    completionBonus: 100,
    skillsInvolved: ['Explorer', 'Builder', 'Helper'],
    coverImage: '/Assets/Ganache Grove/Story_Series1/Scene_01.1.png',
    fallbackImage: '/Assets/Ganache Grove/Scene_0.1.png',
    accentColor: '#f59e0b',
    accentGlow: 'rgba(245,158,11,0.25)',
    tag: 'LIVE NOW',
    tagColor: '#f59e0b',
  },
  {
    id: 'series-2',
    number: 2,
    status: 'locked' as const,
    arc: 'Probationer Arc',
    title: 'The Market Square Fire',
    subtitle: 'Smoke rises over the beloved merchant quarter.',
    description: 'A mysterious fire has broken out in Market Square, threatening the livelihoods of Ganache Grove\'s traders. Marshal Qrill leads the investigation while Milklady Flutterby and Baker Bramble need community volunteers to rebuild.',
    steps: 10,
    totalXP: 300,
    totalCoins: 80,
    totalInfluence: 20,
    badge: 'Market Guardian',
    badgeIcon: '🔥',
    completionBonus: 120,
    skillsInvolved: ['Builder', 'Explorer'],
    coverImage: '',
    fallbackImage: '/Assets/Ganache Grove/Scene_0.1.png',
    accentColor: '#ef4444',
    accentGlow: 'rgba(239,68,68,0.2)',
    tag: 'SERIES 2',
    tagColor: '#ef4444',
  },
  {
    id: 'series-3',
    number: 3,
    status: 'locked' as const,
    arc: 'Resident Arc',
    title: 'The Academy Expansion',
    subtitle: 'Professor Finley needs community scholars.',
    description: 'Ganache Grove Academy is growing! Professor Finley has secured funding for new classrooms, but construction requires volunteers with knowledge, skill, and dedication to education.',
    steps: 12,
    totalXP: 350,
    totalCoins: 90,
    totalInfluence: 25,
    badge: 'Academy Patron',
    badgeIcon: '📚',
    completionBonus: 150,
    skillsInvolved: ['Explorer', 'Helper'],
    coverImage: '',
    fallbackImage: '/Assets/Ganache Grove/Scene_0.1.png',
    accentColor: '#8b5cf6',
    accentGlow: 'rgba(139,92,246,0.2)',
    tag: 'SERIES 3',
    tagColor: '#8b5cf6',
  },
  {
    id: 'series-4',
    number: 4,
    status: 'locked' as const,
    arc: 'Resident Arc',
    title: 'The Clinic Herb Shortage',
    subtitle: 'Dr Cedric Thornwell needs your help urgently.',
    description: 'A rare herb shortage has left the Ganache Clinic unable to treat common ailments. Dr Thornwell needs volunteers to travel to distant meadows to gather the necessary supplies.',
    steps: 8,
    totalXP: 280,
    totalCoins: 70,
    totalInfluence: 18,
    badge: 'Clinic Friend',
    badgeIcon: '💊',
    completionBonus: 110,
    skillsInvolved: ['Helper', 'Explorer'],
    coverImage: '',
    fallbackImage: '/Assets/Ganache Grove/Scene_0.1.png',
    accentColor: '#10b981',
    accentGlow: 'rgba(16,185,129,0.2)',
    tag: 'SERIES 4',
    tagColor: '#10b981',
  },
  {
    id: 'series-5',
    number: 5,
    status: 'locked' as const,
    arc: 'Citizen Arc',
    title: 'The Grand Harvest Festival',
    subtitle: 'Ganache Grove\'s biggest celebration needs your help.',
    description: 'The annual Harvest Festival is approaching and the whole town is buzzing. Mayor Maple Truffle needs community members to organise stalls, performances, and the legendary Caramel Parade.',
    steps: 15,
    totalXP: 450,
    totalCoins: 120,
    totalInfluence: 35,
    badge: 'Festival Champion',
    badgeIcon: '🎪',
    completionBonus: 200,
    skillsInvolved: ['Builder', 'Explorer', 'Helper'],
    coverImage: '',
    fallbackImage: '/Assets/Ganache Grove/Scene_0.1.png',
    accentColor: '#ec4899',
    accentGlow: 'rgba(236,72,153,0.2)',
    tag: 'SERIES 5',
    tagColor: '#ec4899',
  },
];

export const GG_TravellerDeck_Series: React.FC<Props> = ({
  popPage,
  setSeriesPopupOpen,
  completedSeriesSteps = [],
  series1StartDate,
}) => {
  const [selectedIdx, setSelectedIdx] = useState<number>(0);
  const series = SERIES_CATALOGUE[selectedIdx];
  const progressPct = getCanalProgressPct(completedSeriesSteps);
  const stepsCompleted = completedSeriesSteps.length;
  const isActive = series.status === 'active';
  const isS1 = series.id === 'series-1';

  return (
    <div className="w-full flex-grow flex flex-col min-h-0 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 shrink-0" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div>
          <span className="text-[8.5px] font-black uppercase tracking-[0.3em] text-amber-400 block font-sans">
            Ganache Grove · Probationer Programme
          </span>
          <h1 className="text-2xl text-white uppercase font-brand tracking-wide leading-none mt-1" style={{ fontFamily: FONT }}>
            Town Series
          </h1>
          <p className="text-[10.5px] text-white/40 mt-1 font-sans">
            Participate in live town events to earn XP, Coins, Badges and Leaderboard standing.
          </p>
        </div>
        <button
          onClick={popPage}
          className="px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest text-white/40 hover:text-white transition font-sans"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
        >
          ← Back
        </button>
      </div>

      {/* Split Panels */}
      <div className="flex-grow my-4 flex flex-col lg:flex-row gap-5 overflow-hidden min-h-0 w-full max-w-7xl mx-auto">
        
        {/* LEFT COLUMN: Featured Series cover and description (62%) */}
        <div className="w-full lg:w-[62%] h-full flex flex-col justify-start min-h-0 overflow-hidden">
          <div className="w-full h-full rounded-[1.8rem] border border-white/10 bg-neutral-950/40 p-5 flex flex-col justify-between overflow-y-auto custom-scrollbar">
            
            <div className="space-y-4">
              {/* Header row */}
              <div className="flex justify-between items-start gap-4 border-b border-white/5 pb-3">
                <div>
                  <span className="text-[8.5px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full inline-block"
                        style={{
                          background: isActive ? `${series.accentColor}20` : 'rgba(255,255,255,0.06)',
                          color: isActive ? series.accentColor : 'rgba(255,255,255,0.25)',
                          border: `1px solid ${isActive ? series.accentColor + '40' : 'rgba(255,255,255,0.08)'}`,
                        }}>
                    {series.arc}
                  </span>
                  <h3 className="text-lg font-brand text-white uppercase mt-1 tracking-wide leading-tight" style={{ fontFamily: FONT }}>
                    {series.title}
                  </h3>
                  <p className="text-[11px] text-white/50 leading-relaxed font-sans">{series.subtitle}</p>
                </div>

                <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shrink-0"
                     style={{
                       background: isActive ? series.accentColor : 'rgba(255,255,255,0.08)',
                       color: isActive ? '#000' : '#ffffff40',
                     }}>
                  {series.number}
                </div>
              </div>

              {/* Cover Art Box */}
              <div className="relative rounded-2xl border border-white/10 bg-black/40 overflow-hidden flex items-center justify-center h-[200px] shrink-0">
                <img
                  src={series.coverImage || series.fallbackImage}
                  alt={series.title}
                  className={`max-h-full max-w-full object-contain ${!isActive ? 'grayscale opacity-30' : ''}`}
                  onError={(e) => { (e.target as HTMLImageElement).src = series.fallbackImage; }}
                />
                {!isActive && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <span className="text-xs text-white/40 uppercase tracking-widest font-black font-sans">🔒 Locked Series</span>
                  </div>
                )}
                {isActive && (
                  <div className="absolute bottom-3 left-3 text-2xl">{series.badgeIcon}</div>
                )}
              </div>

              {/* Description & Rewards */}
              <div className="space-y-3 font-sans">
                <p className="text-xs text-neutral-300 leading-relaxed">
                  {series.description}
                </p>

                {/* Reward pill badges */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="px-2 py-1 rounded-lg text-[8.5px] font-black bg-cyan-950/40 border border-cyan-800/30 text-cyan-300">
                    ✨ {series.totalXP} XP
                  </span>
                  <span className="px-2 py-1 rounded-lg text-[8.5px] font-black bg-emerald-950/40 border border-emerald-800/30 text-emerald-300">
                    🪙 {series.totalCoins} Coins
                  </span>
                  <span className="px-2 py-1 rounded-lg text-[8.5px] font-black bg-amber-950/40 border border-amber-800/30 text-amber-300">
                    ⭐ {series.totalInfluence} Influence
                  </span>
                  <span className="px-2 py-1 rounded-lg text-[8.5px] font-black bg-purple-950/40 border border-purple-800/30 text-purple-300">
                    {series.badgeIcon} {series.badge} Badge
                  </span>
                </div>

                {/* Active series progress */}
                {isS1 && series1StartDate && (
                  <div className="space-y-1.5 p-3 rounded-xl border border-white/5 bg-black/25 mt-2">
                    <div className="flex items-center justify-between text-[8px] font-black uppercase tracking-widest text-white/30">
                      <span>Your Campaign Progress</span>
                      <span className="text-amber-400 font-bold">
                        {stepsCompleted} / {series.steps} completed
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full overflow-hidden bg-white/8">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${progressPct}%`,
                          background: 'linear-gradient(to right, #f59e0b, #34d399)',
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Enter/Locked CTA */}
            <div className="mt-4 pt-3 border-t border-white/5 font-sans flex items-center justify-between gap-4">
              <span className="text-[9px] text-white/35 leading-tight">
                {isActive ? 'This campaign is currently active in Ganache Grove.' : 'This campaign will unlock as you build standing.'}
              </span>

              {isActive ? (
                <button
                  onClick={() => setSeriesPopupOpen(true)}
                  className="px-5 py-2.5 rounded-xl font-black uppercase tracking-widest text-[9.5px] text-black transition active:scale-95 shrink-0 bg-gradient-to-r from-amber-400 to-orange-500 hover:scale-[1.02] shadow-lg"
                  style={{ fontFamily: '"Josefin Sans", sans-serif' }}
                >
                  Enter Campaign Workspace →
                </button>
              ) : (
                <div className="px-5 py-2.5 rounded-xl font-black uppercase tracking-widest text-[9.5px] text-center bg-white/5 border border-white/10 text-white/30 cursor-not-allowed shrink-0">
                  🔒 Campaign Locked
                </div>
              )}
            </div>

          </div>
        </div>

        {/* RIGHT COLUMN: Series Selection Registry (38%) */}
        <div className="w-full lg:w-[38%] h-full flex flex-col justify-start min-h-0 overflow-hidden">
          <div className="w-full h-full rounded-[1.8rem] border border-white/10 bg-neutral-950/40 p-5 flex flex-col justify-between overflow-y-auto custom-scrollbar">
            
            <div className="space-y-4">
              <div className="pb-3 border-b border-white/5">
                <p className="text-[8px] uppercase tracking-[0.25em] text-cyan-400 font-sans font-black">Campaign Catalogue</p>
                <h4 className="text-base font-brand text-white uppercase leading-none mt-0.5" style={{ fontFamily: FONT }}>Select Episode</h4>
              </div>

              {/* Selector List */}
              <div className="space-y-3 font-sans">
                {SERIES_CATALOGUE.map((item, idx) => {
                  const isSelected = idx === selectedIdx;
                  const itemActive = item.status === 'active';
                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedIdx(idx)}
                      className={`p-3 rounded-2xl border transition duration-200 cursor-pointer flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'bg-amber-500/15 border-amber-500/50 shadow-md'
                          : 'bg-white/5 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs shrink-0 ${isSelected ? 'bg-amber-400 text-black font-black' : 'bg-white/5 text-white/50'}`}>
                          {item.number}
                        </div>
                        <div className="min-w-0">
                          <h5 className="font-bold text-white text-xs truncate leading-snug">{item.title}</h5>
                          <p className="text-[9.5px] text-white/40 truncate leading-none mt-0.5">{item.arc}</p>
                        </div>
                      </div>

                      <div className="shrink-0">
                        {itemActive ? (
                          <span className="px-2 py-0.5 bg-amber-500/15 border border-amber-500/30 text-amber-400 text-[8px] font-black rounded-md uppercase tracking-wider">LIVE</span>
                        ) : (
                          <span className="text-[12px] opacity-40">🔒</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom mini-dossier */}
            <div className="rounded-xl border border-white/5 bg-black/25 p-3 text-center mt-4">
              <p className="text-[9px] text-amber-300/50 leading-relaxed font-sans">
                Participate in story events to earn standing. As a probationer, all contributions count toward your local citizenship record!
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
