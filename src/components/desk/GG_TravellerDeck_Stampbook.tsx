import React from 'react';
import { useTTStore } from '../../store/useTTStore';
import { GG_TravellerDeck_Header } from './GG_TravellerDeck_Header';
import { FONT, getProvincialStanding, type SubPage } from '../../lib/uiConstants';

interface GG_TravellerDeck_StampbookProps {
  setSubPage: (page: SubPage) => void;
  popPage: () => void;
  triggerFeedback: (msg: string) => void;
}

const STREAK_MILESTONES = [
  { days: 3,  icon: '🌱', label: 'Seedling',   reward: '+5 Legacy'   },
  { days: 7,  icon: '🔥', label: 'Weeklong',   reward: '+20 Legacy'  },
  { days: 14, icon: '⭐', label: 'Fortnight',   reward: '+50 Legacy'  },
  { days: 30, icon: '👑', label: 'Golden Seal', reward: 'Golden Passport' },
];

export const GG_TravellerDeck_Stampbook: React.FC<GG_TravellerDeck_StampbookProps> = ({
  setSubPage,
  popPage,
  triggerFeedback,
}) => {
  const {
    travellerName,
    homeTown,
    legacyPoints,
    claimedStamps,
    premiumPassport,
    lastStampedDate,
    claimDailyStamp,
  } = useTTStore();

  const townName = (homeTown || 'ganache-grove').replace('-', ' ').replace(/\b\w/g, c => c.toUpperCase());
  const todayStr = new Date().toISOString().slice(0, 10);
  const isStampedToday = lastStampedDate === todayStr;

  // Compute streak: count how many consecutive days up to today
  const streak = (() => {
    let count = 0;
    const dates = claimedStamps.map(s => s.date).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    for (let i = 0; i < dates.length; i++) {
      const expected = new Date();
      expected.setDate(expected.getDate() - (isStampedToday ? i : i + 1));
      if (dates[i] !== expected.toISOString().slice(0, 10)) break;
      count++;
    }
    return count;
  })();

  const nextMilestone = STREAK_MILESTONES.find(m => m.days > streak);
  const daysToNext = nextMilestone ? nextMilestone.days - streak : 0;

  return (
    <div className="w-full h-full flex flex-col">
      <GG_TravellerDeck_Header
        title="PASSPORT SEAL REGISTRY"
        setSubPage={setSubPage}
        popPage={popPage}
      />

      <div className="flex-1 flex flex-col md:flex-row gap-4 mt-4 overflow-hidden min-h-0">

        {/* LEFT: Passport Card + Streak */}
        <div className="w-full md:w-[38%] shrink-0 flex flex-col gap-3 overflow-y-auto custom-scrollbar">

          {/* Passport */}
          <div className="rounded-[2rem] border border-amber-500/25 bg-gradient-to-b from-amber-950/20 to-black/40 p-5 flex flex-col gap-3">
            <div className="text-center border-b border-white/8 pb-3">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-3xl mx-auto mb-2">📖</div>
              <h3 className="text-base font-brand text-amber-400 uppercase" style={{ fontFamily: FONT }}>
                Imperial Passport
              </h3>
              <p className="text-[10px] text-white/40 mt-0.5 font-sans italic">Registered Residency Seal Ledger</p>
            </div>

            <div className="space-y-2">
              {[
                { label: 'Resident',   value: travellerName, color: 'text-white' },
                { label: 'Parish',     value: townName, color: 'text-white' },
                { label: 'Standing',   value: getProvincialStanding(legacyPoints), color: 'text-amber-300' },
                { label: 'Seals',      value: `${claimedStamps.length} Stamps`, color: 'text-cyan-400' },
                { label: 'Class',      value: premiumPassport ? '👑 Golden Registry' : 'Standard', color: premiumPassport ? 'text-yellow-400' : 'text-white/30' },
              ].map(row => (
                <div key={row.label} className="flex justify-between items-center border-b border-white/5 pb-1.5 last:border-0 last:pb-0">
                  <span className="text-[10px] text-white/40 font-black uppercase tracking-wider font-sans">{row.label}:</span>
                  <span className={`text-[11px] font-bold ${row.color}`}>{row.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Streak Counter */}
          <div className="rounded-[2rem] border border-orange-500/20 bg-gradient-to-b from-orange-950/20 to-black/40 p-5">
            <p className="text-[10px] uppercase tracking-[0.3em] text-orange-400 font-black font-sans mb-3">Presence Streak</p>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/25 flex items-center justify-center text-2xl">
                {streak >= 30 ? '👑' : streak >= 14 ? '⭐' : streak >= 7 ? '🔥' : streak >= 3 ? '🌱' : '⬜'}
              </div>
              <div>
                <div className="text-3xl font-brand text-white" style={{ fontFamily: FONT }}>{streak}<span className="text-sm text-white/40 ml-1">days</span></div>
                <div className="text-[10px] text-orange-300 font-black uppercase tracking-wider font-sans">
                  {streak === 0 ? 'No Streak' : `${streak}-Day Run!`}
                </div>
              </div>
            </div>

            {nextMilestone && (
              <div className="rounded-xl bg-black/30 border border-white/8 p-3">
                <p className="text-[10px] text-white/40 font-sans mb-1.5">
                  Next milestone in <span className="text-amber-400 font-bold">{daysToNext} day{daysToNext !== 1 ? 's' : ''}</span>
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-xl">{nextMilestone.icon}</span>
                  <div>
                    <p className="text-[11px] font-bold text-white font-sans">{nextMilestone.label}</p>
                    <p className="text-[10px] text-emerald-400 font-sans">{nextMilestone.reward}</p>
                  </div>
                </div>
                <div className="mt-2 h-1.5 bg-white/8 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-400 transition-all duration-1000"
                    style={{ width: `${Math.min(100, (streak / nextMilestone.days) * 100)}%` }}
                  />
                </div>
              </div>
            )}

            {/* Milestone badges row */}
            <div className="flex gap-2 mt-3">
              {STREAK_MILESTONES.map(m => (
                <div
                  key={m.days}
                  title={`${m.days}-day streak: ${m.label}`}
                  className={`flex-1 rounded-xl border p-2 text-center text-lg transition-all ${
                    streak >= m.days
                      ? 'border-amber-500/40 bg-amber-500/10 text-white'
                      : 'border-white/8 bg-black/20 grayscale opacity-40'
                  }`}
                >
                  {m.icon}
                  <div className="text-[8px] text-white/50 mt-0.5 font-sans">{m.days}d</div>
                </div>
              ))}
            </div>
          </div>

          {/* Stamp Action */}
          <div className="rounded-[2rem] border border-white/10 bg-black/30 p-5">
            {isStampedToday ? (
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-2xl mx-auto mb-3">✅</div>
                <div className="text-center text-[11px] font-bold text-emerald-400 py-2.5 bg-emerald-500/10 border border-emerald-500/25 rounded-xl font-sans">
                  ✓ Presence Logged Today
                </div>
                <p className="text-[10px] text-white/30 text-center mt-2 font-sans">Come back tomorrow to extend your streak!</p>
              </div>
            ) : (
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-blue-300 font-black font-sans mb-3 text-center">Daily Presence Log</p>
                <button
                  onClick={() => {
                    let icon = '🌳'; let color = 'text-emerald-400';
                    if (homeTown === 'toffee-town') { icon = '🌰'; color = 'text-amber-400'; }
                    else if (homeTown === 'eclair-square') { icon = '🌊'; color = 'text-purple-400'; }
                    else if (homeTown === 'peppermint-peak') { icon = '🏔'; color = 'text-cyan-400'; }
                    claimDailyStamp(homeTown || 'ganache-grove', icon, color);
                    const streakBonus = streak >= 7 ? '🔥 Streak Bonus!' : '';
                    triggerFeedback(`🎫 Stamped! Earned +20🪙 allowance! ${streakBonus}`);
                  }}
                  className="w-full py-3 bg-gradient-to-r from-amber-400 to-orange-500 hover:scale-[1.02] text-black font-black uppercase text-xs rounded-xl shadow-[0_0_20px_rgba(251,146,60,0.3)] transition active:scale-95 animate-pulse"
                  style={{ fontFamily: '"Josefin Sans", sans-serif' }}
                >
                  🎫 Stamp Daily Presence (+20🪙)
                </button>
                <p className="text-[9px] text-white/30 text-center mt-2 font-sans">Logging enforces active citizenship in the county.</p>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: Stamp Book grid */}
        <div className="w-full md:flex-1 border border-white/10 bg-black/25 rounded-[2rem] p-5 overflow-y-auto custom-scrollbar flex flex-col min-h-0">
          <div className="flex items-center justify-between mb-4 shrink-0">
            <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-amber-400 font-sans">Collected County Seals</h3>
            <span className="text-[10px] text-white/30 font-sans">{claimedStamps.length} total</span>
          </div>

          {claimedStamps.length === 0 ? (
            <div className="flex-grow flex flex-col items-center justify-center gap-3 text-white/30">
              <span className="text-5xl">📭</span>
              <p className="text-xs font-sans text-center max-w-48">No seals yet. Log your daily presence to begin collecting county stamps!</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 xl:grid-cols-5 gap-3">
              {claimedStamps.slice().reverse().map((s, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-white/5 border border-white/10 rounded-2xl text-center flex flex-col items-center justify-center group hover:border-amber-500/30 hover:bg-amber-500/5 transition-all duration-200 animate-fade-in"
                >
                  <div className="w-11 h-11 rounded-full border-2 border-dashed border-white/20 group-hover:border-amber-400/40 flex items-center justify-center text-2xl mb-1.5 bg-white/5 shadow-inner transition-all">
                    <span className={s.color}>{s.icon}</span>
                  </div>
                  <span className="text-[9px] text-white font-bold block uppercase tracking-tight font-sans">
                    {s.townId.replace('-', ' ')}
                  </span>
                  <span className="text-[8px] text-white/35 block mt-0.5 font-mono">{s.date}</span>
                  {idx === 0 && (
                    <span className="text-[8px] px-1.5 py-0.5 mt-1 bg-amber-500/20 border border-amber-500/30 text-amber-300 rounded-md font-black font-sans">NEW</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
