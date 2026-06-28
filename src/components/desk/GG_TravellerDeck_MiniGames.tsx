import React, { useState } from 'react';
import { useTTStore } from '../../store/useTTStore';
import { FONT, type SubPage } from '../../lib/uiConstants';
import { GG_TravellerDeck_Header } from './GG_TravellerDeck_Header';
import { OvenTimingGame } from '../minigames/OvenTimingGame';

// ── Types ─────────────────────────────────────────────────────────────────────

interface ArcadeGame {
  id: string;
  title: string;
  tagline: string;
  category: string;
  categoryIcon: string;
  categoryColor: string;
  venue: string;
  venueIcon: string;
  icon: string;
  coverGradient: string;
  difficulty: 'Relaxed' | 'Moderate' | 'Challenging';
  duration: string;
  skill: 'builder' | 'explorer' | 'healer';
  rewards: { coins: number; xp: number; legacy: number };
  badgeId: number;
  status: 'available' | 'coming-soon';
  instructions: { step: string; text: string }[];
  winCondition: string;
  failCondition: string;
  lore: string;
}

const ARCADE_GAMES: ArcadeGame[] = [
  {
    id: 'oven-timing',
    title: 'Oven Timing',
    tagline: 'Keep the town fed, one golden batch at a time.',
    category: 'Town Kitchen',
    categoryIcon: '🍳',
    categoryColor: 'amber',
    venue: "Chef Caramel's Bakery, Ganache Grove",
    venueIcon: '🏠',
    icon: '🍞',
    coverGradient: 'from-amber-900/60 via-orange-900/40 to-black/80',
    difficulty: 'Challenging',
    duration: '4 Minutes',
    skill: 'healer',
    rewards: { coins: 10, xp: 45, legacy: 3 }, // Balanced: 10 coins (range 8-12), 3 legacy
    badgeId: 301,
    status: 'available',
    lore: "The Ganache Grove Festival Committee placed three urgent orders this morning. Chef Caramel is overseeing the decorations and needs a trusted hand to manage the ovens. Every golden batch feeds the town.",
    instructions: [
      { step: '1', text: 'Three ovens load automatically with town recipes. Each shows a required temperature.' },
      { step: '2', text: 'Use the −10° / −5° / +5° / +10° buttons to match the target temperature shown on each oven.' },
      { step: '3', text: 'Watch the baking progress bar. When it reaches the 🟡 golden zone (72–90%), the Pull Out button lights up.' },
      { step: '4', text: 'Click Pull Out immediately! Waiting past 90% burns the item. 3 burns = shift over.' },
      { step: '5', text: 'Temperature drift happens every few seconds. Keep adjusting! Perfect temp + golden timing = best result.' },
    ],
    winCondition: 'Complete 7 items before the 4-minute timer runs out.',
    failCondition: '3 burns OR timer runs out with fewer than 7 items completed.',
  },
  {
    id: 'crate-sort',
    title: 'Market Crate Sort',
    tagline: 'Sort the cargo. Keep the market moving.',
    category: 'Town Market',
    categoryIcon: '🏪',
    categoryColor: 'orange',
    venue: 'Mossberry Market Wharf, Ganache Grove',
    venueIcon: '🚢',
    icon: '📦',
    coverGradient: 'from-orange-900/60 via-amber-900/40 to-black/80',
    difficulty: 'Moderate',
    duration: '3 Minutes',
    skill: 'builder',
    rewards: { coins: 8, xp: 38, legacy: 2 }, // Balanced: 8 coins (range 5-10)
    badgeId: 302,
    status: 'coming-soon',
    lore: "The morning cargo barge arrived two hours early and the dock crew is shorthanded. Three categories of crates — Light, Medium, Heavy — need sorting before the Market opens.",
    instructions: [
      { step: '1', text: 'Crates appear on a conveyor. Each shows a weight.' },
      { step: '2', text: 'Drag each crate to the correct bin: Light, Medium, or Heavy.' },
      { step: '3', text: 'Crates pile up if you are slow. Too many piled = chaos penalty.' },
      { step: '4', text: 'Speed bonus for every 5 correct in a row.' },
    ],
    winCondition: 'Sort 20 crates correctly before the timer ends.',
    failCondition: 'More than 5 wrong sorts OR timer expires.',
  },
  {
    id: 'canal-sweep',
    title: 'Canal Leaf Sweep',
    tagline: 'Clear the waterway. Keep the town flowing.',
    category: 'Town Waterways',
    categoryIcon: '🌊',
    categoryColor: 'cyan',
    venue: 'Mossberry Canal, Ganache Grove',
    venueIcon: '🌿',
    icon: '🍃',
    coverGradient: 'from-cyan-900/60 via-teal-900/40 to-black/80',
    difficulty: 'Relaxed',
    duration: '3 Minutes',
    skill: 'healer',
    rewards: { coins: 9, xp: 30, legacy: 2 }, // Balanced: 9 coins (range 8-10)
    badgeId: 303,
    status: 'coming-soon',
    lore: "Autumn leaves from Cocoawood Forest have blocked the Mossberry Canal again. The water mill won't start until the path is clear. Sweep the leaves — but mind the ducks.",
    instructions: [
      { step: '1', text: 'Leaves float across the canal in gentle waves.' },
      { step: '2', text: 'Tap or click leaves to sweep them away.' },
      { step: '3', text: 'Avoid clicking fish (they scatter the path) or ducks (town fine!).' },
      { step: '4', text: 'Clear 80% of leaves to open the mill gate.' },
    ],
    winCondition: 'Sweep 80% of leaves within 3 minutes.',
    failCondition: 'Click 3 ducks OR timer runs out.',
  },
  {
    id: 'bottle-sort',
    title: 'Medicine Bottle Sort',
    tagline: 'Right medicine, right patient. No mistakes.',
    category: 'Town Clinic',
    categoryIcon: '🏥',
    categoryColor: 'rose',
    venue: 'Oakenhart Clinic, Ganache Grove',
    venueIcon: '⚕️',
    icon: '💊',
    coverGradient: 'from-rose-900/60 via-pink-900/40 to-black/80',
    difficulty: 'Moderate',
    duration: '3 Minutes',
    skill: 'healer',
    rewards: { coins: 9, xp: 35, legacy: 2 }, // Balanced: 9 coins (range 8-10)
    badgeId: 304,
    status: 'coming-soon',
    lore: "A delivery mix-up at Oakenhart Clinic has shuffled the medicine cabinet. Nurse Hazel needs the bottles sorted by colour before the morning rounds begin.",
    instructions: [
      { step: '1', text: 'Bottles appear in a jumbled row with colour labels.' },
      { step: '2', text: 'Drag each bottle to its matching colour bin.' },
      { step: '3', text: 'Speed matters — patients are waiting.' },
      { step: '4', text: 'Every 10 correct = bonus coins.' },
    ],
    winCondition: 'Sort all 30 bottles with fewer than 3 errors.',
    failCondition: '3 wrong sorts OR timer expires.',
  },
  {
    id: 'route-connect',
    title: 'Delivery Route Connect',
    tagline: 'Draw the fastest path. Every second matters.',
    category: 'Town Logistics',
    categoryIcon: '🗺️',
    categoryColor: 'emerald',
    venue: 'Ganache Grove Post House',
    venueIcon: '📮',
    icon: '🛤️',
    coverGradient: 'from-emerald-900/60 via-teal-900/40 to-black/80',
    difficulty: 'Moderate',
    duration: '3 Minutes',
    skill: 'explorer',
    rewards: { coins: 9, xp: 40, legacy: 2 }, // Balanced: 9 coins (range 8-10)
    badgeId: 305,
    status: 'coming-soon',
    lore: "The Post House has 5 letters to deliver before sundown. The roads are a tangle and only one messenger is available. Draw the shortest route that reaches every house.",
    instructions: [
      { step: '1', text: 'A town grid appears with a Start point and delivery stops.' },
      { step: '2', text: 'Click dots to draw a connected path that visits all stops.' },
      { step: '3', text: 'Shorter paths score higher — avoid unnecessary roads.' },
      { step: '4', text: 'Complete the route within the time limit to dispatch the messenger.' },
    ],
    winCondition: 'Connect all delivery stops in 5 rounds before time runs out.',
    failCondition: 'Leave any stop unvisited OR timer expires.',
  },
];

const SKILL_LABELS: Record<string, string> = {
  builder: 'Builder XP',
  explorer: 'Explorer XP',
  healer: 'Healer XP',
};

const DIFFICULTY_COLORS: Record<string, string> = {
  Relaxed: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/25',
  Moderate: 'text-amber-400 bg-amber-500/10 border-amber-500/25',
  Challenging: 'text-rose-400 bg-rose-500/10 border-rose-500/25',
};

const CATEGORY_BG: Record<string, string> = {
  amber: 'from-amber-500/20 to-transparent',
  orange: 'from-orange-500/20 to-transparent',
  cyan: 'from-cyan-500/20 to-transparent',
  rose: 'from-rose-500/20 to-transparent',
  emerald: 'from-emerald-500/20 to-transparent',
};

// ── Component ─────────────────────────────────────────────────────────────────

interface GG_TravellerDeck_MiniGamesProps {
  setSubPage: (page: SubPage) => void;
  popPage: () => void;
  triggerFeedback: (msg: string) => void;
}

export const GG_TravellerDeck_MiniGames: React.FC<GG_TravellerDeck_MiniGamesProps> = ({
  setSubPage,
  popPage,
  triggerFeedback,
}) => {
  const { addCoins, addSkillXP, addLegacy, awardBadge, earnedBadges } = useTTStore();

  const [selectedId, setSelectedId] = useState<string>(ARCADE_GAMES[0].id);
  const [activeGame, setActiveGame] = useState<string | null>(null);

  const selected = ARCADE_GAMES.find(g => g.id === selectedId) || ARCADE_GAMES[0];

  const handleGameSuccess = (game: ArcadeGame) => {
    setActiveGame(null);
    addCoins(game.rewards.coins, `Town Job: ${game.title}`);
    addSkillXP(game.skill, game.rewards.xp);
    addLegacy(game.rewards.legacy);
    awardBadge(game.badgeId);
    triggerFeedback(`Town job complete! +${game.rewards.coins} coins, +${game.rewards.xp} ${SKILL_LABELS[game.skill]}.`);
  };

  const handleGameFail = () => {
    setActiveGame(null);
    triggerFeedback('Shift ended. The town will need you to try again!');
  };

  // Active game overlay
  if (activeGame === 'oven-timing') {
    const g = ARCADE_GAMES.find(x => x.id === 'oven-timing')!;
    return (
      <OvenTimingGame
        rewards={{ coins: g.rewards.coins, xp: g.rewards.xp, legacy: g.rewards.legacy, skill: g.skill }}
        onSuccess={() => handleGameSuccess(g)}
        onFail={handleGameFail}
      />
    );
  }

  return (
    <div className="w-full h-full flex flex-col">
      <GG_TravellerDeck_Header
        title="TOWN JOB ARCADE"
        setSubPage={setSubPage}
        popPage={popPage}
      />

      {/* ── Body ── */}
      <div className="flex-1 min-h-0 flex gap-4 my-4 overflow-hidden">

        {/* Left sidebar — game list */}
        <aside className="w-64 shrink-0 flex flex-col gap-3 overflow-y-auto custom-scrollbar pr-1">

          {/* Arcade intro */}
          <div className="bg-gradient-to-br from-amber-500/10 to-transparent border border-amber-500/20 rounded-2xl p-4 space-y-1">
            <p className="text-[9px] uppercase tracking-[0.3em] text-amber-400 font-black">Town Job Arcade</p>
            <p className="text-[11px] text-white/55 leading-relaxed">
              Real jobs. Real stakes. Every shift helps the town. Pick a job below — available shifts can be worked now.
            </p>
          </div>

          {/* Game cards */}
          {ARCADE_GAMES.map(game => {
            const isActive = game.id === selectedId;
            const isComingSoon = game.status === 'coming-soon';
            const badgeEarned = earnedBadges.includes(game.badgeId);

            return (
              <button
                key={game.id}
                onClick={() => setSelectedId(game.id)}
                className={`w-full text-left rounded-2xl border p-3.5 transition-all duration-200 relative overflow-hidden ${
                  isActive
                    ? 'border-white/30 bg-white/8'
                    : 'border-white/8 bg-white/3 hover:bg-white/6 hover:border-white/15'
                } ${isComingSoon ? 'opacity-60' : ''}`}
              >
                {/* Category stripe */}
                <div className={`absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b ${CATEGORY_BG[game.categoryColor]}`} />

                <div className="flex gap-3 items-start">
                  <span className="text-2xl shrink-0 mt-0.5">{game.icon}</span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-1">
                      <p className="text-xs font-black text-white uppercase leading-tight">{game.title}</p>
                      {badgeEarned && <span className="text-[9px] text-amber-300 shrink-0">★</span>}
                    </div>
                    <p className="text-[9px] text-white/40 mt-0.5">{game.category} · {game.duration}</p>
                    {isComingSoon && (
                      <span className="text-[8px] uppercase tracking-wider font-black text-white/30 bg-white/5 px-1.5 py-0.5 rounded mt-1 inline-block">
                        Coming Soon
                      </span>
                    )}
                    {!isComingSoon && (
                      <span className={`text-[8px] uppercase tracking-wider font-black px-1.5 py-0.5 rounded mt-1 inline-block border ${DIFFICULTY_COLORS[game.difficulty]}`}>
                        {game.difficulty}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </aside>

        {/* Main panel — selected game detail */}
        <main className="flex-1 min-h-0 overflow-y-auto custom-scrollbar rounded-[2rem] border border-white/10 bg-black/20 flex flex-col overflow-hidden">

          {/* Hero banner */}
          <div className={`shrink-0 relative h-44 bg-gradient-to-br ${selected.coverGradient} flex flex-col justify-end p-7 overflow-hidden`}>
            {/* Decorative large icon */}
            <div className="absolute right-8 top-4 text-8xl opacity-15 select-none" style={{ filter: 'blur(1px)' }}>
              {selected.icon}
            </div>

            {/* Category badge */}
            <div className={`inline-flex items-center gap-1.5 mb-3 px-3 py-1 rounded-full border bg-black/30 w-fit`}
              style={{ borderColor: `rgba(255,255,255,0.15)` }}>
              <span className="text-xs">{selected.categoryIcon}</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-white/70">{selected.category}</span>
            </div>

            <h2 className="text-3xl font-brand text-white uppercase leading-none" style={{ fontFamily: FONT }}>
              {selected.title}
            </h2>
            <p className="text-sm text-white/60 italic mt-1.5">{selected.tagline}</p>
          </div>

          {/* Content area */}
          <div className="flex-1 p-7 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_280px] gap-6">

            {/* Left: Lore + instructions */}
            <div className="space-y-5">

              {/* Venue + meta row */}
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 bg-white/5 border border-white/8 rounded-xl px-3 py-2">
                  <span className="text-sm">{selected.venueIcon}</span>
                  <span className="text-[10px] text-white/60 font-black">{selected.venue}</span>
                </div>
                <div className={`flex items-center gap-2 border rounded-xl px-3 py-2 ${DIFFICULTY_COLORS[selected.difficulty]}`}>
                  <span className="text-[10px] font-black uppercase">{selected.difficulty}</span>
                </div>
                <div className="flex items-center gap-2 bg-white/5 border border-white/8 rounded-xl px-3 py-2">
                  <span className="text-[10px] text-white/60 font-black">⏱ {selected.duration}</span>
                </div>
              </div>

              {/* Lore */}
              <div className="space-y-2">
                <p className="text-[10px] uppercase tracking-[0.25em] text-amber-400/80 font-black">Town Bulletin</p>
                <p className="text-sm text-white/70 leading-relaxed bg-white/3 border border-white/8 rounded-2xl p-4 italic">
                  "{selected.lore}"
                </p>
              </div>

              {/* Instructions */}
              <div className="space-y-3">
                <p className="text-[10px] uppercase tracking-[0.25em] text-cyan-400/80 font-black">How to Play</p>
                <div className="space-y-2">
                  {selected.instructions.map((inst, i) => (
                    <div key={i} className="flex gap-3 items-start">
                      <div className="w-6 h-6 rounded-full bg-white/8 border border-white/12 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-[10px] font-black text-white/60">{inst.step}</span>
                      </div>
                      <p className="text-[11px] text-white/65 leading-relaxed pt-0.5">{inst.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Win / Fail conditions */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 bg-emerald-950/20 border border-emerald-500/20 rounded-2xl space-y-1.5">
                  <p className="text-[9px] uppercase tracking-[0.25em] text-emerald-400 font-black">Victory</p>
                  <p className="text-[11px] text-white/65 leading-relaxed">{selected.winCondition}</p>
                </div>
                <div className="p-4 bg-rose-950/20 border border-rose-500/20 rounded-2xl space-y-1.5">
                  <p className="text-[9px] uppercase tracking-[0.25em] text-rose-400 font-black">Failure</p>
                  <p className="text-[11px] text-white/65 leading-relaxed">{selected.failCondition}</p>
                </div>
              </div>
            </div>

            {/* Right: Rewards + Action */}
            <div className="space-y-4">

              {/* Rewards card */}
              <div className="bg-black/25 border border-white/10 rounded-2xl p-5 space-y-4">
                <p className="text-[10px] uppercase tracking-[0.25em] text-white/40 font-black">Shift Rewards</p>

                {/* Gradient reward pill */}
                <div className={`rounded-xl p-px bg-gradient-to-br ${
                  selected.skill === 'healer'   ? 'from-rose-500 to-pink-700' :
                  selected.skill === 'builder'  ? 'from-orange-500 to-amber-700' :
                  'from-cyan-500 to-teal-700'
                }`}>
                  <div className="rounded-xl bg-neutral-950/95 p-4 space-y-2.5">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-white/45 uppercase font-black">Cocoa Coins</span>
                      <span className="text-base font-black text-amber-300">+{selected.rewards.coins} 🪙</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-white/45 uppercase font-black">{SKILL_LABELS[selected.skill]}</span>
                      <span className={`text-base font-black ${
                        selected.skill === 'healer' ? 'text-rose-300' :
                        selected.skill === 'builder' ? 'text-orange-300' : 'text-cyan-300'
                      }`}>+{selected.rewards.xp}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-white/45 uppercase font-black">Legacy Points</span>
                      <span className="text-base font-black text-purple-300">+{selected.rewards.legacy}</span>
                    </div>
                  </div>
                </div>

                {/* Badge */}
                <div className="flex items-center gap-3 p-3 bg-white/4 border border-white/8 rounded-xl">
                  <span className="text-2xl">{earnedBadges.includes(selected.badgeId) ? '🏅' : '🔒'}</span>
                  <div>
                    <p className="text-[9px] uppercase tracking-wider text-white/35 font-black">Town Job Badge</p>
                    <p className={`text-[10px] font-black mt-0.5 ${
                      earnedBadges.includes(selected.badgeId) ? 'text-amber-300' : 'text-white/30'
                    }`}>
                      {earnedBadges.includes(selected.badgeId) ? '★ Badge Earned' : `Badge #${selected.badgeId} — Locked`}
                    </p>
                  </div>
                </div>
              </div>

              {/* Start button */}
              {selected.status === 'available' ? (
                <button
                  onClick={() => setActiveGame(selected.id)}
                  className="w-full py-4 rounded-2xl font-brand font-black uppercase tracking-wider text-sm bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-black hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-[0_0_24px_rgba(251,191,36,0.3)] hover:shadow-[0_0_36px_rgba(251,191,36,0.45)]"
                  style={{ fontFamily: FONT }}
                >
                  🧤 Start Shift — {selected.title}
                </button>
              ) : (
                <div className="w-full py-4 rounded-2xl text-center border border-white/10 bg-white/3">
                  <p className="text-[10px] uppercase tracking-widest text-white/30 font-black">Coming to the Arcade Soon</p>
                  <p className="text-[11px] text-white/20 mt-1">This town job is being prepared.</p>
                </div>
              )}

              {/* Flavour note */}
              <p className="text-[10px] text-white/25 italic text-center leading-snug px-2">
                Town jobs reward real effort. Every shift you complete makes Ganache Grove a little more alive. 🌿
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
