import React, { useState, useEffect } from 'react';
import { useTTStore } from '../store/useTTStore';

const FONT = '"Luckiest Guy", cursive';

interface LeaderboardEntry {
  rank: number;
  name: string;
  town: string;
  score: number;
  title: string;
  emoji: string;
  isUser?: boolean;
}

const STATIC_LEGENDS = [
  { name: 'Archmage Oakenhart', town: 'Ganache Grove', score: 1200, title: 'Grand Elder Caretaker', emoji: '👑' },
  { name: 'Sheriff Brambleboots', town: 'Hazelnut Terrace', score: 1050, title: 'High Constable', emoji: '🥈' },
  { name: 'Lady Petalworth', town: 'Ganache Grove', score: 950, title: 'Master Botanist', emoji: '🥉' },
  { name: 'Auditor Goldwhistle', town: 'Toffee Towns', score: 850, title: 'Royal Treasurer', emoji: '⭐' },
  { name: 'Baker Butterbun', town: 'Eclair Square', score: 750, title: 'High-Flour Confectioner', emoji: '⭐' },
  { name: 'Inventor Tinkersprocket', town: 'Ganache Grove', score: 650, title: 'Grand Machinist', emoji: '⭐' },
  { name: 'Stationmaster Horace', town: 'Peppermint Peaks', score: 550, title: 'Monorail Architect', emoji: '⭐' },
  { name: 'Reporter Julio', town: 'Ganache Grove', score: 480, title: 'Senior Chronicle Lead', emoji: '⭐' },
  { name: 'Constable Rowan', town: 'Hazelnut Terrace', score: 400, title: 'Watch Commander', emoji: '⭐' },
  { name: 'Helper Rowan', town: 'Ganache Grove', score: 320, title: 'Community Organizer', emoji: '⭐' },
];

const LeaderboardPage: React.FC = () => {
  const { legacyPoints, homeTown, setPage, travellerName, user, headerHidden, addCoins } = useTTStore();
  const [boardData, setBoardData] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showTop10Dialog, setShowTop10Dialog] = useState(false);

  const townNameFormatted = homeTown
    ? homeTown.replace('-', ' ').replace(/\b\w/g, (c) => c.toUpperCase())
    : 'None Selected';

  const userRankTitle =
    legacyPoints >= 500
      ? 'Local Legend'
      : legacyPoints >= 250
      ? 'Trusted Helper'
      : legacyPoints >= 100
      ? 'Helpful Neighbor'
      : 'New Resident';

  useEffect(() => {
    let active = true;
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        setError(null);

        const allEntries = STATIC_LEGENDS.map(s => ({
          name: s.name,
          town: s.town,
          score: s.score,
          title: s.title,
          isUser: false,
          emoji: '⭐',
        }));

        // Ensure current user is in the list
        const userExists = allEntries.some(e => e.isUser);
        if (!userExists) {
          allEntries.push({
            name: `${travellerName || 'You'} (You)`,
            town: townNameFormatted,
            score: legacyPoints,
            title: userRankTitle,
            isUser: true,
            emoji: '⭐',
          });
        }

        // Sort all by score desc
        allEntries.sort((a, b) => b.score - a.score);

        // Assign ranks and emojis
        const mapped = allEntries.map((item, idx) => {
          const rank = idx + 1;
          let emoji = '⭐';
          if (rank === 1) emoji = '👑';
          else if (rank === 2) emoji = '🥈';
          else if (rank === 3) emoji = '🥉';
          return {
            rank,
            name: item.name,
            town: item.town,
            score: item.score,
            title: item.title,
            emoji,
            isUser: item.isUser,
          };
        });

        if (active) {
          setBoardData(mapped);
        }
      } catch (err) {
        console.error('Unhandled leaderboard error:', err);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchLeaderboard();
    return () => {
      active = false;
    };
  }, [user, legacyPoints, homeTown, travellerName, townNameFormatted, userRankTitle]);

  const userEntry = boardData.find(e => e.isUser);
  const userRank = userEntry ? userEntry.rank : 999;

  useEffect(() => {
    if (userRank > 0 && userRank <= 10) {
      const alreadyClaimed = localStorage.getItem('tt_leaderboard_reward_claimed') === 'true';
      if (!alreadyClaimed) {
        addCoins(250, 'Provincial Top 10 Milestone Award');
        localStorage.setItem('tt_leaderboard_reward_claimed', 'true');
        setShowTop10Dialog(true);
      }
    }
  }, [userRank, addCoins]);

  return (
    <div className={`min-h-full w-full flex flex-col items-center justify-start select-none transition-all duration-700 bg-transparent ${headerHidden ? 'pt-2 pb-6 px-2' : 'pt-4 pb-8 px-4'}`}>
      <div className={`rounded-[2.5rem] border-[3px] border-amber-500/40 bg-black/60 p-6 flex flex-col justify-between overflow-visible shadow-[8px_8px_0px_0px_rgba(245,158,11,0.35)] relative transition-all duration-700 ease-in-out ${
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
              🏆 Provincial Hall of Records
            </h2>
          </div>
          <div className="w-[100px] z-10" /> {/* Spacer */}
        </div>

        {/* Content Board */}
        <div className="flex-grow my-6 flex flex-col justify-center max-w-4xl w-full mx-auto">
          <div className="bg-transparent border border-white/10 rounded-[2rem] p-6 flex flex-col gap-4">
            
            {/* Top Stats Banner */}
            <div className="grid grid-cols-3 gap-4 border-b border-white/5 pb-4 text-center shrink-0">
              <div>
                <span className="text-[15px] uppercase font-black text-white/40 tracking-wider">My Score</span>
                <p className="text-xl font-bold text-white mt-1">{legacyPoints} Legacy</p>
              </div>
              <div>
                <span className="text-[15px] uppercase font-black text-white/40 tracking-wider">Active Town</span>
                <p className="text-xl font-bold text-yellow-400 mt-1">{townNameFormatted}</p>
              </div>
              <div>
                <span className="text-[15px] uppercase font-black text-white/40 tracking-wider">My Title</span>
                <p className="text-xl font-bold text-cyan-400 mt-1">{userRankTitle}</p>
              </div>
            </div>

            {error && (
              <div className="text-center text-xs text-amber-500 bg-amber-950/20 border border-amber-500/20 py-2 rounded-lg font-body shrink-0">
                {error}
              </div>
            )}

            {/* Leaderboard Entries */}
            <div className="space-y-2 overflow-y-auto custom-scrollbar pr-2 flex-1">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3">
                  <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-[15px] text-neutral-400">Loading Provincial Ledger...</span>
                </div>
              ) : (
                boardData.map((player, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center justify-between p-4 rounded-2xl border transition duration-300
                      ${player.isUser 
                        ? 'bg-pink-500/10 border-pink-500/40 shadow-[0_0_15px_rgba(236,72,153,0.1)]' 
                        : 'bg-transparent border-white/10 hover:bg-white/5'}`}
                  >
                    <div className="flex items-center gap-4">
                      <span
                        className="text-lg font-brand flex items-center justify-center w-8 h-8 rounded-full bg-transparent border border-white/20 text-white"
                        style={{ fontFamily: '"Josefin Sans", sans-serif' }}
                      >
                        {player.rank}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm">{player.name}</span>
                          <span className="text-[15px] text-white/50">• {player.town}</span>
                        </div>
                        <p className="text-[15px] text-amber-400 uppercase tracking-wider font-semibold mt-0.5">
                          {player.emoji} {player.title}
                        </p>
                      </div>
                    </div>
                    <span className="font-brand text-base text-yellow-400" style={{ fontFamily: '"Josefin Sans", sans-serif' }}>
                      {player.score} pts
                    </span>
                  </div>
                ))
              )}
            </div>

            {/* Footnote note */}
            <div className="mt-2 text-center text-[15px] font-bold text-white py-1">
              {userRank <= 10 ? (
                <span className="text-emerald-300 font-sans tracking-wide">
                  🎉 Congratulations! You have entered the Top 10 and claimed the Special Provincial Honor (+250 🪙)!
                </span>
              ) : (
                <span className="text-white font-sans font-bold tracking-wide">
                  🏆 Note: Enter the Top 10 to receive the Special Provincial Honor and a bonus of 250 Cocoa Coins!
                </span>
              )}
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-white/10 flex items-center justify-center text-[15px] text-white/40 shrink-0">
          Rankings are updated dynamically based on your completed missions and dossier acknowledgments.
        </div>

      </div>

      {/* Top 10 Congratulations Dialog */}
      {showTop10Dialog && (
        <div className="fixed inset-0 z-[600] bg-black/60 flex items-center justify-center p-6 select-none animate-fade-in">
          <div className="w-[450px] rounded-[2.5rem] border-[3px] border-amber-400 bg-black/90 p-8 shadow-[0_0_50px_rgba(251,191,36,0.3)] relative text-center text-neutral-100 animate-scale-up">
            <span className="text-5xl block animate-bounce">🏆</span>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-400 block mt-4">Provincial Hall of Records</span>
            <h3 className="text-2xl font-brand text-white uppercase mt-1 mb-3" style={{ fontFamily: FONT }}>
              Top 10 Standing Achieved!
            </h3>
            <div className="w-24 h-[3px] bg-amber-400 mx-auto my-3" />
            <p className="text-xs text-neutral-300 leading-relaxed font-sans mb-6">
              Congratulations, traveller! Your dedication to Ganache Grove has earned you a place among the Top 10 most influential residents in the province. 
              <br />
              <span className="text-yellow-400 font-bold block mt-2">Award Granted: +250 Cocoa Coins 🪙</span>
            </p>
            <button
              onClick={() => setShowTop10Dialog(false)}
              className="w-full py-3 bg-gradient-to-r from-amber-400 to-yellow-500 hover:scale-102 text-black font-brand font-black uppercase text-xs rounded-xl shadow-md transition active:scale-95"
              style={{ fontFamily: '"Josefin Sans", sans-serif' }}
            >
              Claim Special Honor! 🎖️
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaderboardPage;
