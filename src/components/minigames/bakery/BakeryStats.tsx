// BakeryStats.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Lifetime bakery statistics and achievement panel.
// Used inline in ModeSelect and as a standalone panel in results.
// ─────────────────────────────────────────────────────────────────────────────
import React from 'react';
import { FONT } from '../../../lib/uiConstants';
import type { BakeryLifetimeStats } from './bakeryTypes';
import { BAKERY_ACHIEVEMENTS } from './bakeryData';

interface BakeryStatsPanelProps {
  stats: BakeryLifetimeStats;
  compact?: boolean;
}

export const BakeryStatsPanel: React.FC<BakeryStatsPanelProps> = ({ stats, compact }) => {
  const statItems = [
    { label: 'Perfect Bakes',  value: stats.lifetimePerfectBakes.toLocaleString(),  icon: '✨', color: 'text-amber-300' },
    { label: 'Burned',         value: stats.lifetimeBurns.toLocaleString(),          icon: '🔥', color: 'text-rose-400' },
    { label: 'Highest Combo',  value: `×${stats.lifetimeHighestCombo}`,              icon: '🔥', color: 'text-orange-300' },
    { label: 'Best Score',     value: stats.lifetimeBestScore.toLocaleString(),      icon: '🏆', color: 'text-yellow-300' },
    { label: 'Golden Orders',  value: stats.lifetimeGoldenOrders.toLocaleString(),   icon: '🌟', color: 'text-purple-300' },
    { label: 'Hours Baked',    value: `${(stats.minutesBaked / 60).toFixed(1)}h`,   icon: '⏱️', color: 'text-cyan-300' },
  ];

  if (compact) {
    return (
      <div className="p-4 bg-white/3 border border-white/8 rounded-2xl">
        <p className="text-[9px] uppercase tracking-[0.25em] text-white/30 font-black mb-3">📊 Your Bakery Record</p>
        <div className="grid grid-cols-6 gap-2">
          {statItems.map(s => (
            <div key={s.label} className="text-center">
              <p className="text-sm">{s.icon}</p>
              <p className={`text-sm font-black ${s.color}`}>{s.value}</p>
              <p className="text-[8px] text-white/25 uppercase leading-tight">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const earnedAchievements = BAKERY_ACHIEVEMENTS.filter(a =>
    stats.earnedAchievements.includes(a.id)
  );

  return (
    <div
      className="rounded-[2rem] border border-white/10 overflow-hidden animate-fade-in"
      style={{ background: 'rgba(10,5,1,0.92)', backdropFilter: 'blur(16px)' }}
    >
      <div className="px-6 py-4 border-b border-white/8">
        <h3 className="text-lg font-black text-white" style={{ fontFamily: FONT }}>📊 Your Bakery Record</h3>
      </div>

      <div className="p-6 grid grid-cols-2 md:grid-cols-3 gap-4">
        {statItems.map(s => (
          <div key={s.label} className="flex items-center gap-3 p-4 bg-white/4 border border-white/8 rounded-2xl">
            <span className="text-2xl">{s.icon}</span>
            <div>
              <p className={`text-xl font-black ${s.color}`}>{s.value}</p>
              <p className="text-[10px] text-white/35 uppercase font-bold">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Achievements */}
      <div className="px-6 pb-6 space-y-3">
        <p className="text-[10px] uppercase tracking-[0.25em] text-amber-400/70 font-black">🏅 Achievements</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {BAKERY_ACHIEVEMENTS.map(a => {
            const earned = stats.earnedAchievements.includes(a.id);
            return (
              <div key={a.id} className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                earned
                  ? 'border-amber-500/30 bg-amber-950/15'
                  : 'border-white/6 bg-white/2 opacity-50'
              }`}>
                <span className={`text-xl ${earned ? '' : 'grayscale opacity-30'}`}>{a.icon}</span>
                <div>
                  <p className={`text-[12px] font-black ${earned ? 'text-amber-300' : 'text-white/30'}`}>{a.name}</p>
                  <p className="text-[10px] text-white/35 leading-snug">{a.description}</p>
                </div>
                {earned && <span className="ml-auto text-emerald-400 text-xs font-black">✓</span>}
              </div>
            );
          })}
        </div>

        {earnedAchievements.length === 0 && (
          <p className="text-[11px] text-white/25 italic text-center py-2" style={{ fontFamily: 'Georgia,serif' }}>
            Complete shifts and after-hours sessions to earn achievements.
          </p>
        )}
      </div>
    </div>
  );
};
