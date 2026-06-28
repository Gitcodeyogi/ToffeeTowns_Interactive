import React from 'react';
import { FONT } from '../../../pages/TravellersDesk';
import type { SubPage } from '../../../pages/TravellersDesk';
import { useTTStore } from '../../../store/useTTStore';

interface MatterItem {
  id: string;
  title: string;
  requirementsSummary: string;
}

interface HomeBox5_OrientationProps {
  dossierRead: boolean;
  lastStampedDate: string | null;
  completedActions: string[];
  selectedProj: MatterItem;
  selectedMyst: MatterItem;
  selectedCamp: MatterItem;
  pushPage: (page: SubPage) => void;
  setSubPage: (page: SubPage) => void;
  triggerFeedback: (msg: string) => void;
}

const STREAK_MILESTONES = [
  { days: 3,  icon: '🌱', label: 'Seedling',   reward: '+5 Legacy'   },
  { days: 7,  icon: '🔥', label: 'Weeklong',   reward: '+20 Legacy'  },
  { days: 14, icon: '⭐', label: 'Fortnight',   reward: '+50 Legacy'  },
  { days: 30, icon: '👑', label: 'Golden Seal', reward: 'Golden Passport' },
];

const HomeBox5_Orientation: React.FC<HomeBox5_OrientationProps> = ({
  dossierRead,
  lastStampedDate,
  completedActions,
  selectedProj,
  selectedMyst,
  selectedCamp,
  pushPage,
  setSubPage,
  triggerFeedback,
}) => {
  const {
    homeTown,
    claimedStamps = [],
    claimDailyStamp,
  } = useTTStore();

  const todayStr = new Date().toISOString().slice(0, 10);
  const isStampedToday = lastStampedDate === todayStr;

  // Compute streak
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

  const matterIds = ['walkway', 'bell', 'sneezles', 'festival', selectedProj.id, selectedMyst.id, selectedCamp.id];
  const matterDone = completedActions.some(x => matterIds.includes(x));

  const steps = [
    {
      step: 'Step 1',
      title: 'Read Daily Briefing',
      desc: 'Open the Newspaper to claim your 30🪙 daily allowance and stay informed.',
      icon: '📰',
      done: dossierRead,
      doneLabel: '✓ Done',
      accentColor: 'from-amber-500 to-orange-500',
      accentText: 'text-black',
      action: () => pushPage('newspaper'),
      actionLabel: 'Read Now',
    },
    {
      step: 'Step 2',
      title: 'Log Daily Presence',
      desc: 'Stamp your passport to log 10 XP and keep your attendance streak alive.',
      icon: '📮',
      done: isStampedToday,
      doneLabel: '✓ Logged',
      accentColor: 'from-blue-500 to-indigo-600',
      accentText: 'text-white',
      action: () => setSubPage('stampbook'),
      actionLabel: 'Log Presence',
    },
    {
      step: 'Step 3',
      title: 'Assist with Town Matter',
      desc: 'Support a project or investigation in Ganache Grove to build your Legacy score.',
      icon: '🏛️',
      done: matterDone,
      doneLabel: '✓ Complete',
      accentColor: 'from-purple-500 to-indigo-600',
      accentText: 'text-white',
      action: null,
      actionLabel: 'See Chronicles ↑',
    },
  ];

  const allDone = dossierRead && isStampedToday && matterDone;

  return (
    <div className="relative w-full shrink-0">
      {/* Solid backing layer */}
      <div className="absolute top-2 left-2 right-0 bottom-0 bg-blue-500/35 border-[3px] border-blue-500/40 rounded-3xl -z-10" />

      {/* Main container */}
      <div
        className="mr-2 mb-2 w-[calc(100%-8px)] lg:h-[500px] lg:max-h-[500px] lg:min-h-[500px] rounded-3xl overflow-hidden border-[3px] border-blue-500/40 bg-black/60 relative group z-10 flex flex-col lg:flex-row animate-fade-in"
      >

      {/* LEFT COLUMN: Routine Steps (62%) */}
      <div className="w-full lg:w-[62%] lg:h-full lg:min-h-0 min-h-[380px] p-5 flex flex-col justify-between border-b-[3px] lg:border-b-0 lg:border-r-[3px] border-blue-500/40 bg-transparent">
        <div className="space-y-4">
          {/* Header row */}
          <div className="flex justify-between items-start gap-2 pb-3 border-b border-white/5">
            <div>
              <p className="text-[8px] uppercase tracking-[0.25em] text-blue-400 font-sans font-black">Daily Routine</p>
              <h4 className="text-base font-brand text-white uppercase leading-none mt-0.5" style={{ fontFamily: FONT }}>Orientation Checklist</h4>
            </div>
            <span className="text-[9px] font-black bg-blue-500/10 border border-blue-500/30 text-blue-400 px-2.5 py-1 rounded-full uppercase tracking-wider font-sans shrink-0">
              Active Tracker
            </span>
          </div>

          {/* Steps list */}
          <div className="space-y-3 font-sans">
            {steps.map((s, i) => (
              <div
                key={i}
                className={`rounded-[1.2rem] border-2 p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 transition-all duration-500 ${
                  s.done
                    ? 'border-emerald-500/40 bg-emerald-500/5'
                    : 'border-blue-500/30 bg-transparent hover:border-blue-500/45 hover:bg-white/5'
                }`}
              >
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 border ${s.done ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300' : 'bg-transparent border-blue-500/30 text-blue-300'}`}>
                    {i + 1}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] uppercase tracking-[0.2em] text-blue-300 font-black font-sans">{s.step}</span>
                      {s.done && <span className="text-[9.5px] text-emerald-400 font-bold font-sans">{s.doneLabel}</span>}
                    </div>
                    <h5 className="text-[12.5px] font-bold text-white leading-tight mt-0.5">{s.title}</h5>
                    <p className="text-[11px] text-white/50 leading-relaxed mt-1">{s.desc}</p>
                  </div>
                </div>

                <div className="shrink-0 flex items-center">
                  {s.done ? (
                    <div className="px-3.5 py-1.5 rounded-lg text-center text-[9px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
                      ✓ Complete
                    </div>
                  ) : s.action ? (
                    <button
                      onClick={s.action}
                      className={`px-4 py-2 bg-gradient-to-r ${s.accentColor} ${s.accentText} text-[9px] font-black uppercase tracking-wider rounded-lg transition hover:scale-[1.02] active:scale-[0.98] shadow-md`}
                      style={{ fontFamily: '"Josefin Sans", sans-serif' }}
                    >
                      {s.actionLabel}
                    </button>
                  ) : (
                    <div className="px-3.5 py-1.5 text-center text-[9px] font-black uppercase tracking-wider text-amber-400 border border-amber-500/30 rounded-lg animate-pulse">
                      {s.actionLabel}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom routine stats */}
        <div className="rounded-xl border-2 border-blue-500/30 bg-transparent px-4 py-2.5 flex items-center justify-between mt-4">
          <div className="flex items-center gap-2.5 font-sans">
            <span className="text-base">📋</span>
            <div>
              <p className="text-[8px] uppercase tracking-widest text-white/35 font-black">Routine Steps Progress</p>
              <p className="text-[11.5px] text-white font-bold">
                {[dossierRead, isStampedToday, matterDone].filter(Boolean).length} / 3 Complete
              </p>
            </div>
          </div>

          {allDone && (
            <div className="px-2.5 py-1 rounded-lg border border-emerald-500/25 bg-emerald-500/10 flex items-center gap-1.5 animate-pulse">
              <span className="text-[10px]">🌟</span>
              <span className="text-[9px] uppercase tracking-widest text-emerald-400 font-black">ALL DONE! (+50 XP)</span>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT COLUMN: Presence Stamp controls (38%) */}
      <div className="w-full lg:w-[38%] lg:h-full lg:min-h-0 p-5 flex flex-col justify-between bg-transparent overflow-y-auto custom-scrollbar border-none">
        <div className="space-y-4">
          <div className="pb-3 border-b border-white/5">
            <p className="text-[8px] uppercase tracking-[0.25em] text-orange-400 font-sans font-black font-brand">Town Presence Seal</p>
            <h4 className="text-base font-brand text-white uppercase leading-none mt-0.5" style={{ fontFamily: FONT }}>Daily Attendance</h4>
          </div>

          {/* Streak card */}
          <div className="rounded-[1.2rem] border-2 border-orange-500/45 bg-transparent p-4 space-y-3 font-sans">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/25 flex items-center justify-center text-xl shrink-0">
                {streak >= 30 ? '👑' : streak >= 14 ? '⭐' : streak >= 7 ? '🔥' : streak >= 3 ? '🌱' : '⬜'}
              </div>
              <div>
                <div className="text-lg font-black text-white font-mono leading-none">{streak}<span className="text-[10px] text-white/40 ml-1 font-sans font-bold">days</span></div>
                <p className="text-[9px] text-orange-300 font-black uppercase tracking-wider">
                  {streak === 0 ? 'No Streak Active' : `${streak}-Day Attendance Streak!`}
                </p>
              </div>
            </div>

            {nextMilestone && (
              <div className="pt-2 border-t border-white/5">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-white/40">Next Milestone in {daysToNext} day{daysToNext !== 1 ? 's' : ''}:</span>
                  <span className="text-amber-400 font-bold">{nextMilestone.label} ({nextMilestone.reward})</span>
                </div>
                <div className="mt-1.5 h-1.5 bg-white/8 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-400 transition-all duration-1000"
                    style={{ width: `${Math.min(100, (streak / nextMilestone.days) * 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Milestone badges */}
          <div className="grid grid-cols-4 gap-1.5 font-sans">
            {STREAK_MILESTONES.map(m => (
              <div
                key={m.days}
                title={`${m.days}-day streak: ${m.label}`}
                className={`rounded-lg p-1.5 text-center text-base transition-all ${
                  streak >= m.days
                    ? 'border-2 border-amber-500/50 bg-amber-500/10 text-white'
                    : 'border border-blue-500/15 bg-transparent opacity-30'
                }`}
              >
                <div>{m.icon}</div>
                <div className="text-[7.5px] text-white/50 mt-0.5 font-black">{m.days}d</div>
              </div>
            ))}
          </div>
        </div>

        {/* Stamp Action */}
        <div className="pt-4 border-t border-white/5 mt-4">
          {isStampedToday ? (
            <div className="space-y-2 text-center font-sans">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-lg mx-auto">✓</div>
              <div className="text-[10px] font-bold text-emerald-400 py-2.5 bg-emerald-500/10 border border-emerald-500/25 rounded-xl">
                ✓ Presence Logged Today
              </div>
              <p className="text-[9px] text-white/35">Come back tomorrow to extend your streak!</p>
            </div>
          ) : (
            <div className="space-y-3 font-sans">
              <button
                onClick={() => {
                  let icon = '🌳';
                  let color = 'text-emerald-400';
                  if (homeTown === 'toffee-town') {
                    icon = '🌰';
                    color = 'text-amber-400';
                  } else if (homeTown === 'eclair-square') {
                    icon = '🌊';
                    color = 'text-purple-400';
                  } else if (homeTown === 'peppermint-peak') {
                    icon = '🏔';
                    color = 'text-cyan-400';
                  }
                  claimDailyStamp(homeTown || 'ganache-grove', icon, color);
                  const streakBonus = streak >= 7 ? '🔥 Streak Bonus!' : '';
                  triggerFeedback(`🎫 Stamped! Earned +20🪙 allowance! ${streakBonus}`);
                }}
                className="w-full py-3 bg-gradient-to-r from-amber-400 to-orange-500 hover:scale-[1.02] text-black font-black uppercase text-xs rounded-xl shadow-[0_0_20px_rgba(251,146,60,0.2)] transition active:scale-95 animate-pulse"
                style={{ fontFamily: '"Josefin Sans", sans-serif' }}
              >
                🎫 Stamp Daily Presence
              </button>
              <p className="text-[9px] text-white/35 text-center leading-snug">
                Claim allowance (+20🪙) &amp; +10 Explorer XP. Streaks boost your local reputation!
              </p>
            </div>
          )}
      </div>
    </div>
    </div>
    </div>
  );
};

export default HomeBox5_Orientation;
