// HintPanel.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Bakery Shelf — tactile hint panel for After-Hours mode.
// Players click shelf items to activate hints using Cocoa Coins.
// ─────────────────────────────────────────────────────────────────────────────
import React, { useState } from 'react';

export interface ActiveHints {
  freezeOven: boolean;
  masterTimer: boolean;
  chefAssist: boolean;
  instantClean: boolean;
  luckyClover: boolean;
  autoStir: boolean;
}

export interface HintPanelProps {
  coins: number;
  onUseHint: (hint: keyof ActiveHints, cost: number) => void;
  activeHints: ActiveHints;
  freeAutoStir?: boolean; // from Apprentice Day modifier
}

interface HintItem {
  key: keyof ActiveHints;
  icon: string;
  name: string;
  effect: string;
  cost: number;
  duration?: string;
}

const HINTS: HintItem[] = [
  { key: 'freezeOven',  icon: '🧊', name: 'Ice Bucket',    effect: 'Stops temp drift on one oven', cost: 10, duration: '5 sec' },
  { key: 'autoStir',   icon: '🥄', name: 'Auto Stir',     effect: 'Auto-loads next empty oven',   cost: 5  },
  { key: 'masterTimer',icon: '⏱️', name: 'Master Timer',  effect: 'Highlights golden zone wider',  cost: 8,  duration: '10 sec' },
  { key: 'chefAssist', icon: '👨‍🍳', name: 'Chef Assist',   effect: 'Resolves current event instantly', cost: 15 },
  { key: 'instantClean',icon:'🧹', name: 'Instant Clean', effect: 'Removes spill effect instantly', cost: 5  },
  { key: 'luckyClover', icon: '🍀', name: 'Lucky Clover',  effect: 'Next order becomes Golden ×5',  cost: 20 },
];

export const HintPanel: React.FC<HintPanelProps> = ({
  coins, onUseHint, activeHints, freeAutoStir,
}) => {
  const [cooldowns, setCooldowns] = useState<Partial<Record<keyof ActiveHints, boolean>>>({});

  const handleUse = (hint: HintItem) => {
    const cost = (hint.key === 'autoStir' && freeAutoStir) ? 0 : hint.cost;
    if (coins < cost) return;
    if (cooldowns[hint.key]) return;
    if (activeHints[hint.key]) return;

    onUseHint(hint.key, cost);

    // Set cooldown to prevent double-click
    setCooldowns(prev => ({ ...prev, [hint.key]: true }));
    setTimeout(() => setCooldowns(prev => ({ ...prev, [hint.key]: false })), 2000);
  };

  return (
    <div
      className="w-40 shrink-0 flex flex-col rounded-[1.5rem] border border-purple-500/20 overflow-hidden"
      style={{ background: 'rgba(20,5,30,0.75)', backdropFilter: 'blur(8px)' }}
    >
      {/* Header */}
      <div className="px-3 py-2.5 border-b border-purple-500/15 text-center">
        <p className="text-[8px] uppercase tracking-[0.3em] text-purple-400 font-black">Bakery Shelf</p>
        <p className="text-[9px] text-white/30 mt-0.5">Your 🪙 {coins}</p>
      </div>

      {/* Hint items */}
      <div className="flex-1 p-2 space-y-1.5 overflow-y-auto custom-scrollbar">
        {HINTS.map(hint => {
          const isFree = hint.key === 'autoStir' && freeAutoStir;
          const cost = isFree ? 0 : hint.cost;
          const canAfford = coins >= cost;
          const isActive = activeHints[hint.key];
          const isCooling = cooldowns[hint.key];
          const disabled = !canAfford || isActive || isCooling;

          return (
            <button
              key={hint.key}
              onClick={() => handleUse(hint)}
              disabled={disabled}
              className={`w-full text-left p-2.5 rounded-xl border transition-all cursor-pointer ${
                isActive
                  ? 'border-emerald-500/40 bg-emerald-950/20'
                  : disabled
                  ? 'border-white/5 bg-white/2 opacity-40 cursor-not-allowed'
                  : 'border-purple-500/20 bg-purple-950/10 hover:border-purple-400/35 hover:bg-purple-950/25 active:scale-[0.97]'
              }`}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-base">{hint.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-black text-white leading-tight truncate">{hint.name}</p>
                  {hint.duration && (
                    <p className="text-[8px] text-white/30">{hint.duration}</p>
                  )}
                </div>
              </div>
              <p className="text-[9px] text-white/40 leading-snug">{hint.effect}</p>
              <div className="mt-1.5 flex items-center justify-between">
                <span className={`text-[9px] font-black ${
                  isActive ? 'text-emerald-400' : canAfford ? 'text-purple-300' : 'text-rose-400/60'
                }`}>
                  {isActive ? '✓ Active' : isFree ? 'FREE' : `${cost} 🪙`}
                </span>
                {!disabled && !isActive && (
                  <span className="text-[8px] text-white/30">Use</span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Footer tip */}
      <div className="px-3 py-2 border-t border-white/6 text-center">
        <p className="text-[8px] text-white/20 italic leading-snug" style={{ fontFamily: 'Georgia,serif' }}>
          Hints don't affect economy rewards.
        </p>
      </div>
    </div>
  );
};
