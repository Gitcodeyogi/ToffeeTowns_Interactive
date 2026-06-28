import React from 'react';
import { useTTStore } from '../store/useTTStore';

const FONT = '"Luckiest Guy", cursive';

interface BadgeDefinition {
  id: number;
  name: string;
  emoji: string;
  description: string;
  requirement: string;
}

const BADGES: BadgeDefinition[] = [
  {
    id: 101,
    name: 'Pathmaker',
    emoji: '🪵',
    description: 'Helped build the Gossip Corner elevated walkway.',
    requirement: 'Complete Walkway Crisis tasks in Season 1.',
  },
  {
    id: 102,
    name: 'Market Friend',
    emoji: '🛒',
    description: 'Assisted in expanding the overflowing Market Square.',
    requirement: 'Complete Market Expansion tasks in Season 1.',
  },
  {
    id: 103,
    name: 'Canal Keeper',
    emoji: '🚤',
    description: 'Helped restore and clear Mossberry Canal.',
    requirement: 'Complete Canal Restoration tasks in Season 1.',
  },
  {
    id: 104,
    name: 'Friend of Learning',
    emoji: '📚',
    description: 'Supported Academy classroom expansions.',
    requirement: 'Complete Academy Expansion tasks in Season 1.',
  },
  {
    id: 105,
    name: 'Season One Pioneer',
    emoji: '🏆',
    description: 'Resolved all four growing pains of Ganache Grove Season 1.',
    requirement: 'Earn all four Season 1 badges (Pathmaker, Market Friend, Canal Keeper, and Friend of Learning).',
  },
  {
    id: 10,
    name: 'Master Builder',
    emoji: '🌉',
    description: 'Constructed the canopy bridge in Ganache Grove.',
    requirement: 'Complete the "Restoration of Canopy Bridge" mission.',
  },
  {
    id: 11,
    name: 'Springs Savior',
    emoji: '🌋',
    description: 'Sanitized the Geothermal Springs area under Dr. Fudge.',
    requirement: 'Complete the "Sanitize Geothermal Springs" mission.',
  },
  {
    id: 12,
    name: 'Rebel Voice',
    emoji: '📄',
    description: 'Drafted leaflets protesting the forest curfew decree.',
    requirement: 'Complete the "Draft Leaflets Against Curfew" mission.',
  },
  {
    id: 201,
    name: 'Quick Blink',
    emoji: '⚡',
    description: 'Cleared Cocoa Card Memory in the Traveller Deck arcade.',
    requirement: 'Win Cocoa Card Memory.',
  },
  {
    id: 206,
    name: 'Puzzle Solver',
    emoji: '🧩',
    description: 'Solved a civic mini-game puzzle for the market ledger.',
    requirement: 'Win Market Crate Sort.',
  },
  {
    id: 208,
    name: 'Path Finder',
    emoji: '🛣️',
    description: 'Tuned a living-world route challenge in the mini-game arcade.',
    requirement: 'Win Canal Flow Tune.',
  },
  {
    id: 1,
    name: 'First Settle In',
    emoji: '🧳',
    description: 'Successfully unpacked and settled in your registered residence.',
    requirement: 'Settle in your registered home for the first time.',
  },
  {
    id: 2,
    name: 'County Passport',
    emoji: '🗺️',
    description: 'Granted a passport and citizenship in the outer counties.',
    requirement: 'Choose a starting home town during onboarding.',
  },
];

const BadgesPage: React.FC = () => {
  const { earnedBadges, setPage, welcomeDone, headerHidden } = useTTStore();

  const activeEarned = [...earnedBadges];
  if (welcomeDone && !activeEarned.includes(2)) {
    activeEarned.push(2);
  }
  const isSettled = localStorage.getItem('tt_is_settled') === 'true';
  if (isSettled && !activeEarned.includes(1)) {
    activeEarned.push(1);
  }

  return (
    <div className={`min-h-full w-full flex flex-col items-center justify-start select-none transition-all duration-700 bg-transparent ${headerHidden ? 'pt-2 pb-6 px-2' : 'pt-4 pb-8 px-4'}`}>
      <div className={`rounded-[2.5rem] border-[3px] border-purple-500/40 bg-black/60 p-6 flex flex-col justify-between overflow-visible shadow-[8px_8px_0px_0px_rgba(168,85,247,0.35)] relative transition-all duration-700 ease-in-out ${
        headerHidden
          ? 'w-[92vw] h-auto min-h-[90vh]'
          : 'w-[92vw] h-auto min-h-[82vh]'
      }`}>
        
        {/* Header */}
        <div className="relative flex items-center justify-between border-b border-white/10 pb-4 shrink-0">
          <div className="z-10">
            <button
              onClick={() => setPage('desk')}
              className="px-4 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 rounded-full text-xs font-brand uppercase tracking-wider transition duration-200"
              style={{ fontFamily: '"Josefin Sans", sans-serif' }}
            >
              🏠 Back to Desk
            </button>
          </div>
          <div className="absolute inset-x-0 top-0 bottom-4 flex items-center justify-center pointer-events-none">
            <h2 className="text-xl md:text-2xl font-brand text-amber-400 uppercase tracking-wider pointer-events-auto" style={{ fontFamily: FONT }}>
              🎖️ Confectionery Medallions
            </h2>
          </div>
          <div className="w-[100px] z-10" /> {/* Spacer */}
        </div>

        {/* Content Grid */}
        <div className="flex-grow my-6 max-w-4xl w-full mx-auto pr-2">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {BADGES.map((b) => {
              const earned = activeEarned.includes(b.id);
              return (
                <div
                  key={b.id}
                  className={`p-5 rounded-[2rem] border transition duration-300 flex flex-col items-center text-center justify-between min-h-[220px]
                    ${earned 
                      ? 'bg-amber-500/10 border-amber-400/30 shadow-[0_0_20px_rgba(245,158,11,0.1)]' 
                      : 'bg-transparent border-white/10 opacity-55'}`}
                >
                  <div className="flex flex-col items-center gap-3">
                    <span
                      className={`text-5xl w-16 h-16 rounded-2xl flex items-center justify-center border shadow-md
                        ${earned 
                          ? 'bg-amber-500/20 border-amber-400/40 text-amber-300 animate-pulse-glow' 
                          : 'bg-white/5 border-white/10 filter grayscale'}`}
                    >
                      {b.emoji}
                    </span>
                    <div>
                      <h4 className="font-brand text-base text-white uppercase mt-2" style={{ fontFamily: FONT }}>
                        {b.name}
                      </h4>
                      <p className="text-[15px] text-white/70 leading-relaxed font-body mt-2">
                        {earned ? b.description : 'Locked'}
                      </p>
                    </div>
                  </div>

                  <div className="w-full border-t border-white/10 pt-3 mt-3">
                    <span className="text-[15px] uppercase font-black tracking-wider text-amber-400">
                      {earned ? '✓ Unlocked' : `Requires: ${b.requirement}`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-white/10 flex items-center justify-center text-[15px] text-white/40 shrink-0">
          Unlock medallions by contributing to towns, upgrading your classroom skills, and embarking on missions.
        </div>

      </div>
    </div>
  );
};

export default BadgesPage;
