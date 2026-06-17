import React, { useState, useEffect } from 'react';
import { useTTStore } from '../store/useTTStore';
import { db } from '../firebaseConfig';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';

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

const LeaderboardPage: React.FC = () => {
  const { legacyPoints, homeTown, setPage, travellerName, user } = useTTStore();
  const [boardData, setBoardData] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        
        const usersRef = collection(db, 'users');
        const q = query(usersRef, orderBy('legacyPoints', 'desc'), limit(15));
        const snapshot = await getDocs(q);
        
        if (!active) return;
        
        const fetched: LeaderboardEntry[] = [];
        let index = 1;
        let userInTop15 = false;
        
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          const isCurrentUser = !!user && docSnap.id === user.uid;
          if (isCurrentUser) {
            userInTop15 = true;
          }
          
          const tName = data.travellerName || 'Anonymous Resident';
          const townId = data.homeTown || '';
          const formattedTown = townId
            ? townId.replace('-', ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())
            : 'None Selected';
          
          const score = data.legacyPoints ?? 0;
          const titles = data.legacyTitles || [];
          const userTitle = titles[titles.length - 1] || (score >= 500 ? 'Local Legend' : score >= 250 ? 'Trusted Helper' : 'New Resident');
          
          fetched.push({
            rank: index++,
            name: isCurrentUser ? `${tName} (You)` : tName,
            town: formattedTown,
            score: score,
            title: userTitle,
            emoji: index === 2 ? '👑' : index === 3 ? '🥈' : index === 4 ? '🥉' : '⭐',
            isUser: isCurrentUser,
          });
        });
        
        // If current user is logged in but not in the top 15, append them!
        if (user && !userInTop15) {
          fetched.push({
            rank: 16,
            name: `${travellerName || 'You'} (You)`,
            town: townNameFormatted,
            score: legacyPoints,
            title: userRankTitle,
            emoji: '👤',
            isUser: true,
          });
        }
        
        setBoardData(fetched);
      } catch (err) {
        console.error('Error fetching leaderboard:', err);
        setError('⚠️ Failed to fetch live standings. Showing local offline data.');
        
        // Fallback to local offline data
        const fallback = [
          { rank: 1, name: 'Traveller Arjun', town: 'Hazelnut Terrace', score: 620, title: 'Most Helpful Citizen', emoji: '👑' },
          { rank: 2, name: 'Traveller Meera', town: 'Ganache Grove', score: 580, title: 'Forest Protector', emoji: '🥈' },
          { rank: 3, name: 'Traveller David', town: 'Peppermint Peaks', score: 510, title: 'Bridge Builder', emoji: '🥉' },
          {
            rank: legacyPoints >= 620 ? 1 : legacyPoints >= 580 ? 2 : legacyPoints >= 510 ? 3 : 4,
            name: `${travellerName || 'You'} (You)`,
            town: townNameFormatted,
            score: legacyPoints,
            title: userRankTitle,
            emoji: '⭐',
            isUser: true,
          },
        ].sort((a, b) => b.score - a.score);
        
        // Re-assign ranks after sorting
        const fallbackWithRanks = fallback.map((p, i) => ({ ...p, rank: i + 1 }));
        setBoardData(fallbackWithRanks);
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

  return (
    <div className="h-full w-full flex items-center justify-center p-6 select-none">
      <div className="w-[92vw] h-[92vh] max-h-[92vh] rounded-[2.5rem] border border-white/15 bg-black/60 p-6 flex flex-col justify-between overflow-hidden shadow-2xl relative">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 shrink-0">
          <button
            onClick={() => setPage('desk')}
            className="px-4 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 rounded-full text-xs font-brand uppercase tracking-wider transition duration-200"
            style={{ fontFamily: '"Josefin Sans", sans-serif' }}
          >
            🏠 Back to Desk
          </button>
          <h2 className="text-xl md:text-2xl font-brand text-amber-400 uppercase tracking-wider" style={{ fontFamily: FONT }}>
            🏆 Provincial Hall of Records
          </h2>
          <div className="w-[100px]" /> {/* Spacer */}
        </div>

        {/* Content Board */}
        <div className="flex-1 my-6 flex flex-col justify-center max-w-4xl w-full mx-auto overflow-hidden">
          <div className="bg-black/30 border border-white/10 rounded-[2rem] p-6 flex flex-col gap-4 overflow-hidden h-full">
            
            {/* Top Stats Banner */}
            <div className="grid grid-cols-3 gap-4 border-b border-white/5 pb-4 text-center shrink-0">
              <div>
                <span className="text-[10px] uppercase font-black text-white/40 tracking-wider">My Score</span>
                <p className="text-xl font-bold text-white mt-1">{legacyPoints} Legacy</p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-black text-white/40 tracking-wider">Active Town</span>
                <p className="text-xl font-bold text-yellow-400 mt-1">{townNameFormatted}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-black text-white/40 tracking-wider">My Title</span>
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
                  <span className="text-xs text-neutral-400">Loading Provincial Ledger...</span>
                </div>
              ) : (
                boardData.map((player, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center justify-between p-4 rounded-2xl border transition duration-300
                      ${player.isUser 
                        ? 'bg-pink-500/10 border-pink-500/40 shadow-[0_0_15px_rgba(236,72,153,0.1)]' 
                        : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                  >
                    <div className="flex items-center gap-4">
                      <span
                        className="text-lg font-brand flex items-center justify-center w-8 h-8 rounded-full bg-black/40 border border-white/10 text-white"
                        style={{ fontFamily: '"Josefin Sans", sans-serif' }}
                      >
                        {player.rank}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm">{player.name}</span>
                          <span className="text-xs text-white/50">• {player.town}</span>
                        </div>
                        <p className="text-[11px] text-amber-400 uppercase tracking-wider font-semibold mt-0.5">
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

          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-white/10 flex items-center justify-center text-xs text-white/40 shrink-0">
          Rankings are updated dynamically based on your completed missions and dossier acknowledgments.
        </div>

      </div>
    </div>
  );
};

export default LeaderboardPage;
