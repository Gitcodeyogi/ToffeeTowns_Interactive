import React from 'react';
import { CANAL_SERIES, getCanalProgressPct } from '../../data/series/series1_canal';
import { FONT, type SubPage } from '../../pages/TravellersDesk';

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
  completedSeriesSteps,
  series1StartDate,
}) => {
  const progressPct = getCanalProgressPct(completedSeriesSteps);
  const stepsCompleted = completedSeriesSteps.length;

  return (
    <div className="w-full flex-grow flex flex-col min-h-0 overflow-hidden">

      {/* ── Header ── */}
      <div className="flex items-center justify-between pb-4 shrink-0"
           style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div>
          <span className="text-[8.5px] font-black uppercase tracking-[0.3em] text-amber-400 block">
            Ganache Grove · Probationer Programme
          </span>
          <h1 className="text-2xl text-white uppercase font-brand tracking-wide leading-none mt-1"
              style={{ fontFamily: FONT }}>
            Town Series
          </h1>
          <p className="text-[10.5px] text-white/40 mt-1">
            Participate in live town events to earn XP, Coins, Badges and Leaderboard standing.
          </p>
        </div>
        <button
          onClick={popPage}
          className="px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest text-white/40 hover:text-white transition"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
        >
          ← Back
        </button>
      </div>

      {/* ── Series cards list ── */}
      <div className="flex-1 overflow-y-auto custom-scrollbar py-4 space-y-4 pr-1">

        {SERIES_CATALOGUE.map((series) => {
          const isActive = series.status === 'active';
          const isS1 = series.id === 'series-1';

          return (
            <div
              key={series.id}
              className="relative rounded-3xl overflow-hidden transition-all duration-300"
              style={{
                background: isActive
                  ? 'linear-gradient(135deg, rgba(20,20,22,0.95) 0%, rgba(15,15,18,0.98) 100%)'
                  : 'rgba(12,12,14,0.8)',
                border: isActive
                  ? `1px solid ${series.accentColor}40`
                  : '1px solid rgba(255,255,255,0.06)',
                boxShadow: isActive ? `0 0 40px ${series.accentGlow}` : 'none',
              }}
            >
              {/* Active glow strip */}
              {isActive && (
                <div
                  className="absolute top-0 left-0 right-0 h-[2px]"
                  style={{ background: `linear-gradient(to right, transparent, ${series.accentColor}, transparent)` }}
                />
              )}

              <div className="flex gap-0">

                {/* ── Left: Image thumbnail ── */}
                <div className="relative shrink-0 overflow-hidden rounded-l-3xl" style={{ width: 200 }}>
                  <img
                    src={series.coverImage || series.fallbackImage}
                    alt={series.title}
                    className={`w-full h-full object-cover ${!isActive ? 'grayscale opacity-30' : ''}`}
                    style={{ minHeight: 180 }}
                    onError={(e) => { (e.target as HTMLImageElement).src = series.fallbackImage; }}
                  />
                  <div className="absolute inset-0" style={{
                    background: isActive
                      ? 'linear-gradient(to right, rgba(0,0,0,0.1) 0%, rgba(15,15,18,0) 60%, rgba(15,15,18,0.8) 100%)'
                      : 'rgba(0,0,0,0.6)',
                  }} />

                  {/* Series number badge */}
                  <div className="absolute top-3 left-3">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm"
                      style={{
                        background: isActive ? series.accentColor : 'rgba(255,255,255,0.08)',
                        color: isActive ? '#000' : '#ffffff40',
                      }}
                    >
                      {series.number}
                    </div>
                  </div>

                  {/* Lock icon for locked series */}
                  {!isActive && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-4xl opacity-30">🔒</div>
                    </div>
                  )}

                  {/* Badge preview */}
                  {isActive && (
                    <div className="absolute bottom-3 left-3 text-2xl">{series.badgeIcon}</div>
                  )}
                </div>

                {/* ── Middle: Info ── */}
                <div className="flex-1 px-6 py-5 space-y-3 min-w-0">

                  {/* Arc + Tag */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[7.5px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full"
                          style={{
                            background: isActive ? `${series.accentColor}20` : 'rgba(255,255,255,0.06)',
                            color: isActive ? series.accentColor : 'rgba(255,255,255,0.25)',
                            border: `1px solid ${isActive ? series.accentColor + '40' : 'rgba(255,255,255,0.08)'}`,
                          }}>
                      {series.arc}
                    </span>
                    <span className="text-[7.5px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full"
                          style={{
                            background: isActive ? `${series.tagColor}18` : 'rgba(255,255,255,0.04)',
                            color: isActive ? series.tagColor : 'rgba(255,255,255,0.2)',
                          }}>
                      {isActive ? '🟢 ' : '🔒 '}{series.tag}
                    </span>
                  </div>

                  {/* Title */}
                  <div>
                    <h3
                      className={`font-brand uppercase tracking-wide leading-tight ${isActive ? 'text-yellow-50 text-base' : 'text-white/25 text-sm'}`}
                      style={{ fontFamily: FONT }}
                    >
                      {series.title}
                    </h3>
                    <p className={`text-[9.5px] mt-0.5 ${isActive ? 'text-white/50' : 'text-white/20'}`}>
                      {series.subtitle}
                    </p>
                  </div>

                  {/* Description — only for active */}
                  {isActive && (
                    <p className="text-[10.5px] text-neutral-400 leading-relaxed max-w-xl">
                      {series.description}
                    </p>
                  )}

                  {/* Reward pills */}
                  <div className="flex flex-wrap gap-1.5">
                    <span className="px-2 py-1 rounded-lg text-[8.5px] font-black"
                          style={{
                            background: isActive ? 'rgba(6,182,212,0.12)' : 'rgba(255,255,255,0.04)',
                            border: `1px solid ${isActive ? 'rgba(6,182,212,0.25)' : 'rgba(255,255,255,0.06)'}`,
                            color: isActive ? '#67e8f9' : 'rgba(255,255,255,0.2)',
                          }}>
                      ✨ {series.totalXP} XP total
                    </span>
                    <span className="px-2 py-1 rounded-lg text-[8.5px] font-black"
                          style={{
                            background: isActive ? 'rgba(52,211,153,0.1)' : 'rgba(255,255,255,0.04)',
                            border: `1px solid ${isActive ? 'rgba(52,211,153,0.2)' : 'rgba(255,255,255,0.06)'}`,
                            color: isActive ? '#6ee7b7' : 'rgba(255,255,255,0.2)',
                          }}>
                      🪙 {series.totalCoins} Coins
                    </span>
                    <span className="px-2 py-1 rounded-lg text-[8.5px] font-black"
                          style={{
                            background: isActive ? 'rgba(251,191,36,0.1)' : 'rgba(255,255,255,0.04)',
                            border: `1px solid ${isActive ? 'rgba(251,191,36,0.2)' : 'rgba(255,255,255,0.06)'}`,
                            color: isActive ? '#fcd34d' : 'rgba(255,255,255,0.2)',
                          }}>
                      ⭐ {series.totalInfluence} Influence
                    </span>
                    <span className="px-2 py-1 rounded-lg text-[8.5px] font-black"
                          style={{
                            background: isActive ? 'rgba(167,139,250,0.1)' : 'rgba(255,255,255,0.04)',
                            border: `1px solid ${isActive ? 'rgba(167,139,250,0.2)' : 'rgba(255,255,255,0.06)'}`,
                            color: isActive ? '#c4b5fd' : 'rgba(255,255,255,0.2)',
                          }}>
                      {series.badgeIcon} {series.badge}
                    </span>
                    <span className="px-2 py-1 rounded-lg text-[8.5px] font-black"
                          style={{
                            background: isActive ? 'rgba(249,115,22,0.12)' : 'rgba(255,255,255,0.04)',
                            border: `1px solid ${isActive ? 'rgba(249,115,22,0.25)' : 'rgba(255,255,255,0.06)'}`,
                            color: isActive ? '#fb923c' : 'rgba(255,255,255,0.2)',
                          }}>
                      🏆 +{series.completionBonus} XP bonus on completion
                    </span>
                  </div>

                  {/* Series 1 progress bar */}
                  {isS1 && series1StartDate && (
                    <div className="space-y-1.5 pt-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[8px] font-black uppercase tracking-widest text-white/30">
                          Your Progress
                        </span>
                        <span className="text-[8px] font-black text-amber-400">
                          {stepsCompleted} / {series.steps} events participated
                        </span>
                      </div>
                      <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
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

                  {/* Steps info */}
                  <div className="flex items-center gap-1.5 text-[8.5px]"
                       style={{ color: isActive ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.15)' }}>
                    <span>📅</span>
                    <span>{series.steps} story events &nbsp;·&nbsp; Auto-advances daily &nbsp;·&nbsp; Skills: {series.skillsInvolved.join(' · ')}</span>
                  </div>
                </div>

                {/* ── Right: Action button ── */}
                <div className="flex flex-col items-center justify-center px-6 shrink-0 gap-3" style={{ minWidth: 160 }}>
                  {isActive ? (
                    <>
                      <button
                        onClick={() => setSeriesPopupOpen(true)}
                        className="w-full py-3.5 rounded-2xl font-black uppercase tracking-widest text-[10px] text-black transition active:scale-95"
                        style={{
                          background: `linear-gradient(135deg, ${series.accentColor} 0%, #f97316 100%)`,
                          boxShadow: `0 0 25px ${series.accentGlow}, 0 4px 15px rgba(0,0,0,0.4)`,
                        }}
                      >
                        Enter Series 1 →
                      </button>
                      <p className="text-[8px] text-white/25 text-center leading-tight">
                        Story auto-advances daily.<br/>You choose when to help.
                      </p>
                    </>
                  ) : (
                    <div className="w-full py-3.5 rounded-2xl font-black uppercase tracking-widest text-[10px] text-center cursor-not-allowed"
                         style={{
                           background: 'rgba(255,255,255,0.04)',
                           border: '1px solid rgba(255,255,255,0.08)',
                           color: 'rgba(255,255,255,0.2)',
                         }}>
                      🔒 Locked
                    </div>
                  )}
                </div>

              </div>
            </div>
          );
        })}

        {/* ── Bottom: Probationer note ── */}
        <div className="rounded-2xl px-5 py-4 text-center"
             style={{ background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.12)' }}>
          <p className="text-[10px] text-amber-300/60 leading-relaxed">
            <span className="font-black text-amber-400">As a Probationer</span>, you earn standing by participating in town events alongside real professionals.<br />
            You are never the hero — but every contribution counts toward your citizenship record.
          </p>
        </div>

        <div className="h-4 shrink-0" />
      </div>
    </div>
  );
};
