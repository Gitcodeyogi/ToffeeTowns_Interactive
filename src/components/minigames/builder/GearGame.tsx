import React, { useState, useEffect, useCallback, useRef } from 'react';
import { SoundSynth } from '../shared/SoundSynth';
import {
  type GameProps, GameWrapper, TopBar, useEffects, EffectLayer, WinBanner, FailBanner, SVGGear
} from '../core/GameWorkbench';

export function GearGame({ onWin, onScoreChange }: GameProps) {
  const SLOT_COUNT = 4;
  const SIZES = ['S', 'M', 'L'] as const;
  type GSize = typeof SIZES[number];

  const [slots, setSlots] = useState<(GSize | null)[]>([null, null, null, null]);
  const [activeGear, setActiveGear] = useState<GSize>('M');
  const [score, setScore] = useState(0);

  useEffect(() => {
    onScoreChange?.(score);
  }, [score, onScoreChange]);
  const [won, setWon] = useState(false);
  const { effects, addEffect } = useEffects();
  const wonRef = useRef(false);

  const filled = slots.filter(Boolean).length;

  useEffect(() => {
    if (filled === SLOT_COUNT && !wonRef.current) {
      wonRef.current = true;
      setWon(true);
      addEffect('⚙️ POWERED UP!', '#fde047', 50, 45, true);
      setTimeout(onWin, 1800);
    }
  }, [slots, filled, onWin, addEffect]);

  const GS: Record<GSize, { color: string; bg: string; glow: string; lbl: string; emoji: string; size: number }> = {
    S: { color: '#f472b6', bg: 'rgba(244,114,182,0.2)', glow: '#f472b6', lbl: 'TINY', emoji: '⚙️', size: 2.2 },
    M: { color: '#60a5fa', bg: 'rgba(96,165,250,0.2)', glow: '#60a5fa', lbl: 'COGS', emoji: '⚙️', size: 3 },
    L: { color: '#fbbf24', bg: 'rgba(251,191,36,0.2)', glow: '#fbbf24', lbl: 'BOSS', emoji: '⚙️', size: 3.8 },
  };

  const handleSlot = (i: number) => {
    if (won) return;
    const cur = slots[i];
    if (cur === activeGear) {
      setSlots(s => { const n = [...s]; n[i] = null; return n; });
      addEffect('Removed', '#f87171', (i / 3) * 80 + 10, 55);
    } else {
      setSlots(s => { const n = [...s]; n[i] = activeGear; return n; });
      setScore(p => p + 25);
      addEffect(filled === SLOT_COUNT - 1 ? '🔥 LAST ONE!' : '✅ Click!', '#86efac', (i / 3) * 80 + 10, 55);
    }
  };

  return (
    <GameWrapper>
      <EffectLayer effects={effects} />

      <TopBar icon="⚙️" title="Power the Gear Mill!" score={score} scoreColor="#fbbf24"
        progress={{ current: filled, total: SLOT_COUNT, label: 'slots' }} />

      {/* Gear Picker */}
      <div className="flex justify-center gap-4 mb-4 shrink-0">
        {SIZES.map(size => {
          const g = GS[size]; const isAct = activeGear === size;
          const gearSize = size === 'S' ? 38 : size === 'M' ? 52 : 68;
          const gearTeeth = size === 'S' ? 8 : size === 'M' ? 12 : 16;
          return (
            <button key={size} onClick={() => setActiveGear(size)}
              className="flex flex-col items-center gap-1.5 px-6 py-3.5 rounded-2xl border-4 border-black transition-all duration-200 active:scale-90 cursor-pointer shadow-[3px_3px_0_rgba(0,0,0,1)]"
              style={{
                borderColor: isAct ? g.color : 'rgba(0,0,0,0.8)',
                background: isAct ? g.bg : 'rgba(255,255,255,0.03)',
                transform: isAct ? 'translateY(-2px)' : 'translateY(0)',
              }}>
              <span className="block" style={{ transform: isAct ? 'scale(1.05)' : 'scale(1)' }}>
                <SVGGear size={gearSize} color={g.color} teeth={gearTeeth} speed={isAct ? 2.5 : 0} />
              </span>
              <span className="mg-lucky text-[10px] mt-1" style={{ color: g.color }}>{g.lbl}</span>
            </button>
          );
        })}
      </div>

      {/* Shaft Row */}
      <div className="flex-1 flex flex-col justify-center">
        {/* Shaft beam */}
        <div className="relative flex items-center px-6 w-full max-w-xl mx-auto">
          {/* Custom copper pipe shaft backing */}
          <div className="absolute inset-x-6 h-5 rounded-full z-0 border-2 border-black"
            style={{
              background: won ? 'linear-gradient(90deg,#fbbf24,#34d399,#60a5fa,#f472b6)' : 'linear-gradient(90deg,#5c4308,#a37c22,#5c4308)',
              boxShadow: won ? '0 0 35px rgba(251,191,36,0.8)' : 'inset 0 2px 4px rgba(0,0,0,0.6)',
              animation: won ? 'mgRainbow 1.5s linear infinite' : 'none',
              transition: 'all 0.5s',
            }} />
          
          {/* Drive gear (fixed) */}
          <div className="relative z-10 flex flex-col items-center gap-2 mr-2 shrink-0">
            <div className="w-20 h-20 rounded-full flex items-center justify-center border-4 border-black bg-neutral-950/60 shadow-[4px_4px_0_rgba(0,0,0,0.4)]">
              <SVGGear size={64} color="#fbbf24" teeth={14} speed={2} />
            </div>
            <span className="mg-lucky text-[10px] text-yellow-400">DRIVE</span>
          </div>

          {/* Slots */}
          <div className="flex-1 flex justify-around">
            {slots.map((g, i) => {
              const gs = g ? GS[g] : null;
              const gSize = g === 'S' ? 36 : g === 'M' ? 52 : 68;
              const gTeeth = g === 'S' ? 8 : g === 'M' ? 12 : 16;
              return (
                <div key={i} onClick={() => handleSlot(i)}
                  className="relative z-10 flex flex-col items-center gap-2 cursor-pointer transition-all hover:scale-105 active:scale-95"
                >
                  <div className="w-18 h-18 rounded-full flex items-center justify-center border-4 border-black transition-all duration-300 bg-neutral-950/60 shadow-[4px_4px_0_rgba(0,0,0,0.4)]"
                    style={{
                      width: 72, height: 72,
                      borderColor: gs ? gs.color : 'rgba(255,255,255,0.08)',
                    }}>
                    {gs ? (
                      <SVGGear size={gSize} color={gs.color} teeth={gTeeth} speed={won ? 2.5 : 0} />
                    ) : (
                      <span className="text-white/20 text-3xl font-black">+</span>
                    )}
                  </div>
                  <span className="mg-lucky text-[10px] text-white/50">PEG {i + 1}</span>
                </div>
              );
            })}
          </div>

          {/* Spindle (fixed) */}
          <div className="relative z-10 flex flex-col items-center gap-2 ml-2 shrink-0">
            <div className="w-20 h-20 rounded-full flex items-center justify-center border-4 border-black bg-neutral-950/60 shadow-[4px_4px_0_rgba(0,0,0,0.4)]">
              <SVGGear size={64} color="#60a5fa" teeth={14} speed={won ? 2 : 0} />
            </div>
            <span className="mg-lucky text-[10px] text-blue-400">SPINDLE</span>
          </div>
        </div>

        <p className="text-center mt-4 mg-lucky text-white/60 text-xs">
          {won ? '🎉 Mill powered up!' : `Select a gear size above, then click the pegs to fill them! (${filled}/${SLOT_COUNT})`}
        </p>
      </div>

      {won && <WinBanner message="GEARS LOCKED!" score={score + 200} />}
    </GameWrapper>
  );
}
