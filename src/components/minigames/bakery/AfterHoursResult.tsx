// AfterHoursResult.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Result screen for After-Hours Bakery mode.
// Shows score, personal best, cosmetic unlocks, achievements — no economy impact.
// ─────────────────────────────────────────────────────────────────────────────
import React, { useEffect, useState } from 'react';
import { FONT } from '../../../lib/uiConstants';
import type { PulledItem, DailyModifier } from './bakeryTypes';
import { COSMETIC_THRESHOLDS, BAKERY_ACHIEVEMENTS } from './bakeryData';
import { qualityLabel, starsFor, loadBakeryStats } from './bakeryEngine';
import { AFTER_HOURS_ENTRY_FEE } from './bakeryEngine';

interface AfterHoursResultProps {
  score:       number;
  personalBest: number;
  pulledItems: PulledItem[];
  burns:       number;
  comboMax:    number;
  goldenOrders: number;
  modifiers:   DailyModifier[];
  onPlayAgain: () => void;
  onBack:      () => void;
}

// Animated counter
function useCountUp(target: number, duration = 1500) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const steps = 60;
    const step = target / steps;
    let curr = 0;
    const interval = setInterval(() => {
      curr += step;
      if (curr >= target) { setValue(target); clearInterval(interval); }
      else setValue(Math.floor(curr));
    }, duration / steps);
    return () => clearInterval(interval);
  }, [target, duration]);
  return value;
}

export const AfterHoursResult: React.FC<AfterHoursResultProps> = ({
  score, personalBest, pulledItems, burns, comboMax, goldenOrders,
  modifiers, onPlayAgain, onBack,
}) => {
  if (false as boolean) { console.log(goldenOrders); }
  const displayScore = useCountUp(score);
  const isNewRecord  = score > personalBest;

  const stats = loadBakeryStats();

  const earnedCosmetics = COSMETIC_THRESHOLDS.filter(c => score >= c.score);
  const newAchievements = BAKERY_ACHIEVEMENTS.filter(a => stats.earnedAchievements.includes(a.id));

  const perfects = pulledItems.filter(p => p.quality === 'perfect').length;
  const greats   = pulledItems.filter(p => p.quality === 'great').length;

  // Rating based on score
  const rating = score >= 3500 ? 5 : score >= 2000 ? 4 : score >= 1000 ? 3 : score >= 500 ? 2 : 1;
  const ratingLabel = ['','Rough Night','Decent Shift','Night Bake!','Great Session!','Midnight Legend!'][rating];
  const ratingColor = ['','text-rose-400','text-orange-400','text-emerald-400','text-yellow-300','text-amber-300'][rating];

  return (
    <div className="absolute inset-0 z-[420] flex items-center justify-center">
      <div className="absolute inset-0 bg-[#07040a]/80 backdrop-blur-md" />
      <div
        className="relative z-10 flex flex-col animate-fade-in overflow-hidden"
        style={{
          width: '680px', maxWidth: '95vw', maxHeight: '92vh',
          borderRadius: '2.5rem',
          border: isNewRecord ? '2px solid rgba(168,85,247,0.45)' : '2px solid rgba(168,85,247,0.20)',
          background: 'rgba(10,3,18,0.98)',
          boxShadow: isNewRecord ? '0 0 80px rgba(168,85,247,0.2), 0 0 160px rgba(251,191,36,0.08)' : '0 0 60px rgba(168,85,247,0.1)',
        }}
      >
        {/* Color strip */}
        <div className="h-1 shrink-0 rounded-t-[2.5rem]"
          style={{ background: 'linear-gradient(90deg, #7c3aed, #a855f7, #7c3aed)' }} />

        {/* Title */}
        <div className="px-10 pt-7 pb-5 border-b border-white/8 text-center shrink-0">
          <p className="text-[9px] uppercase tracking-[0.35em] text-purple-400/60 font-black">After-Hours Report</p>
          <p className="text-[11px] text-white/35 mt-0.5 italic" style={{ fontFamily: 'Georgia,serif' }}>
            Tonight: {modifiers.map(m => `${m.icon} ${m.name}`).join(' · ')}
          </p>

          <div className="flex justify-center gap-1 my-3">
            {[1,2,3,4,5].map(i => (
              <span key={i} className={`text-2xl transition-all ${i <= rating ? 'text-purple-400' : 'text-white/10'}`}>★</span>
            ))}
          </div>

          <h2 className={`text-3xl font-black uppercase ${ratingColor}`} style={{ fontFamily: FONT }}>
            {ratingLabel}
          </h2>

          {/* Score */}
          <div className="mt-4">
            <p className="text-[10px] uppercase tracking-[0.3em] text-white/30 font-black">Final Score</p>
            <p className={`text-5xl font-black tabular-nums mt-1 ${
              isNewRecord
                ? 'text-amber-300 drop-shadow-[0_0_20px_rgba(251,191,36,0.5)]'
                : 'text-white'
            }`}>
              {displayScore.toLocaleString()}
            </p>
            {isNewRecord ? (
              <p className="text-sm font-black text-amber-400 mt-1 animate-pulse">🏆 NEW PERSONAL BEST!</p>
            ) : (
              <p className="text-[11px] text-white/30 mt-1">Personal best: {personalBest.toLocaleString()}</p>
            )}
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-10 py-5 space-y-5">

          {/* Stats row */}
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: '✨ Perfects',   value: perfects,          color: 'text-amber-300' },
              { label: '⭐ Greats',     value: greats,            color: 'text-yellow-300' },
              { label: '🔥 Burns',      value: burns,             color: burns > 0 ? 'text-rose-400' : 'text-white/30' },
              { label: '🔥 Best Combo', value: `×${comboMax}`,   color: 'text-orange-300' },
            ].map(s => (
              <div key={s.label} className="px-3 py-3 bg-white/4 border border-white/8 rounded-xl text-center">
                <p className={`text-lg font-black ${s.color}`}>{s.value}</p>
                <p className="text-[9px] text-white/30 uppercase font-black mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Bake quality list */}
          {pulledItems.length > 0 && (
            <div className="space-y-2">
              <p className="text-[10px] uppercase tracking-[0.25em] text-purple-400/70 font-black">⭐ Bake Quality</p>
              <div className="grid grid-cols-2 gap-2">
                {pulledItems.map((item, i) => {
                  const q = qualityLabel(item.quality);
                  return (
                    <div key={i} className="flex items-center gap-2 px-3 py-2 bg-white/4 border border-white/8 rounded-xl">
                      <span className="text-base">{q.icon}</span>
                      <div className="min-w-0">
                        <p className="text-[11px] font-bold text-white truncate">{item.recipeName}</p>
                        <div className="flex gap-0.5 mt-0.5">
                          {[1,2,3,4,5].map(s => (
                            <span key={s} className={`text-[9px] ${s <= starsFor(item.quality) ? 'text-amber-400' : 'text-white/15'}`}>★</span>
                          ))}
                        </div>
                      </div>
                      <span className={`text-[10px] font-black ml-auto ${q.color}`}>{q.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Cosmetic unlocks */}
          {earnedCosmetics.length > 0 && (
            <div className="space-y-2">
              <p className="text-[10px] uppercase tracking-[0.25em] text-amber-400/70 font-black">🎖️ Cosmetics Earned</p>
              <div className="grid grid-cols-2 gap-2">
                {earnedCosmetics.map(c => (
                  <div key={c.score} className="flex items-center gap-3 p-3 bg-amber-950/15 border border-amber-500/25 rounded-xl">
                    <span className="text-2xl">{c.icon}</span>
                    <div>
                      <p className="text-[12px] font-black text-amber-300">{c.name}</p>
                      <p className="text-[9px] text-white/35">{c.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Achievements earned */}
          {newAchievements.length > 0 && (
            <div className="space-y-2">
              <p className="text-[10px] uppercase tracking-[0.25em] text-cyan-400/70 font-black">🏅 Achievements</p>
              {newAchievements.slice(-3).map(a => (
                <div key={a.id} className="flex items-center gap-3 p-3 bg-cyan-950/15 border border-cyan-500/20 rounded-xl">
                  <span className="text-2xl">{a.icon}</span>
                  <div>
                    <p className="text-[12px] font-black text-cyan-300">{a.name}</p>
                    <p className="text-[10px] text-white/40">{a.description}</p>
                  </div>
                  <span className="ml-auto text-emerald-400 text-xs font-black">✓ Earned</span>
                </div>
              ))}
            </div>
          )}

          {/* Economy note */}
          <div className="flex items-center gap-3 p-4 bg-white/3 border border-white/8 rounded-2xl">
            <span className="text-xl">🛡️</span>
            <p className="text-[11px] text-white/40 italic leading-snug" style={{ fontFamily: 'Georgia,serif' }}>
              After-Hours earnings don't affect your Cocoa Coins, XP or Legacy balance.
              This was pure fun — the town's economy stays untouched.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="px-10 py-6 border-t border-white/8 flex gap-4 shrink-0">
          <button onClick={onBack}
            className="flex-1 py-3 rounded-2xl border border-white/15 text-white/60 hover:bg-white/5 transition text-sm font-bold cursor-pointer"
            style={{ fontFamily: 'Georgia,serif', fontStyle: 'italic' }}>
            ← Back to Arcade
          </button>
          <button onClick={onPlayAgain}
            className="flex-[2] py-3.5 rounded-2xl font-bold text-sm text-white transition hover:scale-[1.02] active:scale-[0.97] cursor-pointer"
            style={{
              fontFamily: 'Georgia,serif', fontStyle: 'italic',
              background: 'linear-gradient(135deg, #7c3aed, #a855f7, #7c3aed)',
              boxShadow: '0 0 24px rgba(168,85,247,0.3)',
            }}>
            🌙 Play Again — {AFTER_HOURS_ENTRY_FEE} 🪙
          </button>
        </div>
      </div>
    </div>
  );
};
