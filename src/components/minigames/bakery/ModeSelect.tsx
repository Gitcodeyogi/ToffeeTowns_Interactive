// ModeSelect.tsx — Complete redesign
// ─────────────────────────────────────────────────────────────────────────────
// Beautiful 3-level landing for the Oven Timing game.
// Shown immediately when the player opens Oven Timing from the Arcade.
// ─────────────────────────────────────────────────────────────────────────────
import React from 'react';
import { FONT } from '../../../lib/uiConstants';
import { useTTStore } from '../../../store/useTTStore';
import { BakeryMode } from './bakeryTypes';
import { loadBakeryStats } from './bakeryEngine';
import { AFTER_HOURS_ENTRY_FEE } from './bakeryEngine';

interface ModeSelectProps {
  onSelect: (mode: 'apprenticeship' | 'shift' | 'after-hours') => void;
  onClose: () => void;
}

const LEVELS = [
  {
    mode: 'apprenticeship',
    badge: '0',
    emoji: '🎓',
    name: 'Bakery Apprenticeship',
    sub: 'Free forever · No time pressure',
    tagline: 'Learn the craft. Earn your apron.',
    desc: 'Step into Chef Caramel\'s kitchen and learn every mechanic before the pressure starts. One oven. Guided steps. The Junior Baker badge waiting at the end.',
    features: [
      { icon: '📚', text: '10-chapter guided tutorial' },
      { icon: '🔒', text: '3 ovens locked — 1 active' },
      { icon: '🏅', text: 'Earn Junior Baker badge' },
      { icon: '🆓', text: 'Always free, no penalty' },
    ],
    earnNote: 'Unlocks Level 1 after completion.',
    accentFrom: '#0891b2',
    accentTo: '#22d3ee',
    badgeBg: 'linear-gradient(135deg, #0e7490, #06b6d4)',
    cardBorder: 'rgba(6,182,212,0.30)',
    cardBg: 'rgba(6,30,45,0.65)',
    glow: 'rgba(6,182,212,0.12)',
    btnStyle: {
      background: 'linear-gradient(135deg, #0891b2, #22d3ee)',
      boxShadow: '0 4px 24px rgba(6,182,212,0.4)',
      color: '#000',
    },
    btnText: 'Begin Apprenticeship →',
    locked: false,
  },
  {
    mode: 'shift',
    badge: '1',
    emoji: '🧤',
    name: 'Bakery Shift',
    sub: '5 min shift · Earns coins, XP & Legacy',
    tagline: 'Feed the town. Earn your coins.',
    desc: 'Three ovens, three orders, five minutes on the clock. Manage temperature drifts, handle kitchen events, and deliver golden batches to earn Cocoa Coins and Legacy for Ganache Grove.',
    features: [
      { icon: '🍳', text: '3 ovens · 1 locked oven' },
      { icon: '⏱️', text: '5-minute shift timer' },
      { icon: '🪙', text: 'Earns Cocoa Coins + XP' },
      { icon: '⚠️', text: 'Failure costs −10 coins' },
    ],
    earnNote: 'Requires Junior Baker badge.',
    accentFrom: '#d97706',
    accentTo: '#fbbf24',
    badgeBg: 'linear-gradient(135deg, #b45309, #fbbf24)',
    cardBorder: 'rgba(251,191,36,0.30)',
    cardBg: 'rgba(25,16,0,0.65)',
    glow: 'rgba(251,191,36,0.10)',
    btnStyle: {
      background: 'linear-gradient(135deg, #d97706, #fbbf24)',
      boxShadow: '0 4px 24px rgba(251,191,36,0.4)',
      color: '#000',
    },
    btnText: 'Start the Shift →',
    locked: false, // checked at render time
  },
  {
    mode: 'after-hours',
    badge: '2',
    emoji: '🌙',
    name: 'After-Hours Bakery',
    sub: `${AFTER_HOURS_ENTRY_FEE} 🪙 entry · Score-based · Daily modifiers`,
    tagline: 'Bake for love. Score for glory.',
    desc: 'The town is asleep. Four ovens are yours. Tonight\'s two daily modifiers change every 24 hours — everyone faces the same challenge. Beat your personal best. Pure skill, zero economy risk.',
    features: [
      { icon: '🍳', text: 'All 4 ovens active' },
      { icon: '🌟', text: 'Daily modifiers (everyone same)' },
      { icon: '🏆', text: 'Score only — no economy' },
      { icon: '🔥', text: 'Chaos Mode in last 60 seconds' },
    ],
    earnNote: `Entry fee: ${AFTER_HOURS_ENTRY_FEE} Cocoa Coins per session.`,
    accentFrom: '#7c3aed',
    accentTo: '#a855f7',
    badgeBg: 'linear-gradient(135deg, #6d28d9, #a855f7)',
    cardBorder: 'rgba(168,85,247,0.30)',
    cardBg: 'rgba(12,5,22,0.65)',
    glow: 'rgba(168,85,247,0.12)',
    btnStyle: {
      background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
      boxShadow: '0 4px 24px rgba(168,85,247,0.4)',
      color: '#fff',
    },
    btnText: 'Rent the Ovens →',
    locked: false,
  },
];

export const ModeSelect: React.FC<ModeSelectProps> = ({ onSelect, onClose }) => {
  const coins = useTTStore(s => s.coins ?? 0);
  const stats = loadBakeryStats();

  const juniorEarned = stats.juniorBakerEarned;
  const lifetimeShifts = stats.shiftsCompleted ?? 0;

  return (
    <div className="w-full h-full flex flex-col overflow-hidden relative">
      <div className="relative z-10 flex flex-col h-full">

        {/* ── Header ── */}
        <div className="shrink-0 flex items-center justify-between px-8 pt-6 pb-4">
          <div className="flex items-center gap-4">
            <button onClick={onClose}
              className="px-4 py-2 rounded-xl border border-white/10 text-white/50 text-[11px] font-black uppercase tracking-wider hover:bg-white/5 transition cursor-pointer">
              ← Back
            </button>
            <div>
              <p className="text-[9px] uppercase tracking-[0.4em] text-amber-400/60 font-black">Ganache Grove · Town Kitchen</p>
              <h1 className="text-3xl font-black text-white tracking-tight" style={{ fontFamily: FONT }}>
                🍞 Oven Timing
              </h1>
            </div>
          </div>

          {/* Player stats strip */}
          <div className="flex items-center gap-4 text-right">
            <div className="px-4 py-2 bg-black/30 border border-white/8 rounded-xl">
              <p className="text-[8px] uppercase text-white/25 font-black">Balance</p>
              <p className="text-base font-black text-amber-300">{coins} 🪙</p>
            </div>
            {juniorEarned && (
              <div className="px-4 py-2 bg-black/30 border border-amber-500/20 rounded-xl">
                <p className="text-[8px] uppercase text-amber-400/50 font-black">Badge</p>
                <p className="text-base">🏅 Junior Baker</p>
              </div>
            )}
            {lifetimeShifts > 0 && (
              <div className="px-4 py-2 bg-black/30 border border-white/8 rounded-xl">
                <p className="text-[8px] uppercase text-white/25 font-black">Shifts Played</p>
                <p className="text-base font-black text-white/60">{lifetimeShifts}</p>
              </div>
            )}
          </div>
        </div>

        {/* Subtitle */}
        <div className="shrink-0 px-8 pb-5">
          <p className="text-[13px] text-white/45 italic" style={{ fontFamily: 'Georgia,serif' }}>
            "Every golden batch feeds the town." — Choose your level and step into the kitchen.
          </p>
        </div>

        {/* ── Level Cards ── */}
        <div className="flex-1 min-h-0 px-6 pb-6 overflow-y-auto">
          <div className="grid grid-cols-3 gap-4 h-full" style={{ minHeight: '480px' }}>
            {LEVELS.map((level) => {
              // Dev bypass: enable play for all levels and bypass entry fee constraints
              const isLocked       = false;
              const cantAfford     = false;
              const isDisabled     = false;

              return (
                <div
                  key={level.mode}
                  className="relative flex flex-col overflow-hidden transition-all duration-300"
                  style={{
                    borderRadius: '2rem',
                    border: `1px solid ${isLocked ? 'rgba(255,255,255,0.08)' : level.cardBorder}`,
                    background: isLocked ? 'rgba(10,8,6,0.5)' : level.cardBg,
                    backdropFilter: 'blur(16px)',
                    boxShadow: isLocked ? 'none' : `0 20px 50px rgba(0,0,0,0.4), 0 0 60px ${level.glow}`,
                    opacity: isLocked ? 0.55 : 1,
                  }}
                >
                  {/* Top accent */}
                  {!isLocked && (
                    <div className="absolute top-0 left-0 right-0 h-[2px]"
                      style={{ background: `linear-gradient(90deg, transparent, ${level.accentTo}, transparent)` }} />
                  )}

                  {/* Lock overlay */}
                  {isLocked && (
                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center"
                      style={{ background: 'rgba(0,0,0,0.35)', borderRadius: '2rem' }}>
                      <span className="text-4xl mb-2">🔒</span>
                      <p className="text-[12px] font-black text-white/60 text-center px-4">
                        Earn Junior Baker badge
                      </p>
                    </div>
                  )}

                  {/* Card content */}
                  <div className="flex flex-col h-full p-5">

                    {/* Level badge row */}
                    <div className="flex items-center justify-between mb-3 shrink-0">
                      <div className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-lg text-black"
                          style={{ background: isLocked ? 'rgba(255,255,255,0.1)' : level.badgeBg }}>
                          {isLocked ? '🔒' : level.badge}
                        </div>
                        <div>
                          <p className="text-[8px] uppercase tracking-[0.25em] text-white/30 font-black">Level {level.badge}</p>
                        </div>
                      </div>
                      <span className={`text-[9px] font-black uppercase px-2 py-1 rounded-lg tracking-wide ${
                        level.mode === BakeryMode.Apprenticeship ? 'bg-cyan-500/15 text-cyan-300' :
                        level.mode === BakeryMode.Shift ? 'bg-amber-500/15 text-amber-300' :
                        'bg-purple-500/15 text-purple-300'
                      }`}>
                        {level.mode === BakeryMode.Apprenticeship ? 'Tutorial' :
                         level.mode === BakeryMode.Shift ? 'Daily Earn' : 'Score Run'}
                      </span>
                    </div>

                    {/* Level name */}
                    <div className="mb-3 shrink-0">
                      <div className="text-3xl mb-1">{level.emoji}</div>
                      <h2 className="text-xl font-black text-white leading-tight" style={{ fontFamily: FONT }}>
                        {level.name}
                      </h2>
                      <p className="text-[10px] text-white/35 mt-0.5 font-bold">{level.sub}</p>
                    </div>

                    {/* Tagline */}
                    <p className="text-[12px] italic text-white/55 leading-snug mb-3 shrink-0"
                      style={{ fontFamily: 'Georgia,serif' }}>
                      "{level.tagline}"
                    </p>

                    {/* Description */}
                    <p className="text-[11px] text-white/50 leading-relaxed mb-4 flex-1"
                      style={{ fontFamily: 'Georgia,serif' }}>
                      {level.desc}
                    </p>

                    {/* Features */}
                    <div className="grid grid-cols-2 gap-1.5 mb-4 shrink-0">
                      {level.features.map((f, i) => (
                        <div key={i} className="flex items-center gap-2 p-2 bg-white/4 border border-white/6 rounded-xl">
                          <span className="text-sm">{f.icon}</span>
                          <p className="text-[9px] text-white/55 font-bold leading-tight">{f.text}</p>
                        </div>
                      ))}
                    </div>

                    {/* Earn note */}
                    <p className="text-[10px] text-white/30 mb-3 italic shrink-0" style={{ fontFamily: 'Georgia,serif' }}>
                      {cantAfford && !isLocked
                        ? `Need ${AFTER_HOURS_ENTRY_FEE - coins} more coins`
                        : level.earnNote}
                    </p>

                    {/* CTA */}
                    <button
                      onClick={() => !isDisabled && onSelect(level.mode as 'apprenticeship' | 'shift' | 'after-hours')}
                      disabled={isDisabled}
                      className={`w-full py-3.5 rounded-2xl font-black text-[12px] uppercase tracking-widest transition-all shrink-0 ${
                        isDisabled
                          ? 'bg-white/5 border border-white/10 text-white/25 cursor-not-allowed'
                          : 'cursor-pointer hover:scale-[1.02] active:scale-[0.97]'
                      }`}
                      style={isDisabled ? { fontFamily: 'Josefin Sans, sans-serif' } : {
                        fontFamily: 'Josefin Sans, sans-serif',
                        ...level.btnStyle,
                      }}
                    >
                      {isLocked ? '🔒 Locked' : cantAfford ? `Need ${AFTER_HOURS_ENTRY_FEE} 🪙` : level.btnText}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="shrink-0 px-8 pb-4 flex items-center justify-between">
          <p className="text-[9px] text-white/20 italic" style={{ fontFamily: 'Georgia,serif' }}>
            Chef Caramel's Bakery · Ganache Grove · Level 0 is always free · Failure at Level 1 costs 10 🪙
          </p>
          <p className="text-[9px] text-white/15">Press Pause ⏸ anytime in-game to re-read instructions</p>
        </div>
      </div>
    </div>
  );
};
