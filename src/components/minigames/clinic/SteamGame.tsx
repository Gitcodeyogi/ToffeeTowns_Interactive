import React, { useState, useEffect, useCallback, useRef } from 'react';
import { SoundSynth } from '../shared/SoundSynth';
import {
  type GameProps, GameWrapper, TopBar, useEffects, EffectLayer, WinBanner, FailBanner, SVGGear
} from '../core/GameWorkbench';

export function SteamGame({ onWin, onScoreChange, difficulty = 1, easyMode = false }: GameProps) {
  const INIT_LEVEL = easyMode ? 2 : difficulty === 3 ? 5 : difficulty === 2 ? 3 : 2;
  const REGROW = difficulty >= 2;
  const REGROW_INTERVAL = difficulty === 3 ? 4000 : 6500;

  const [leaks, setLeaks] = useState(() => {
    const base = [
      { id: 1, x: 18, y: 38, level: INIT_LEVEL, angle: -15 },
      { id: 2, x: 40, y: 55, level: INIT_LEVEL, angle: 10 },
      { id: 3, x: 63, y: 40, level: INIT_LEVEL, angle: -8 },
      { id: 4, x: 82, y: 52, level: INIT_LEVEL, angle: 5 },
    ];
    if (difficulty === 3) {
      base.push({ id: 5, x: 52, y: 28, level: INIT_LEVEL, angle: -20 });
    }
    return base;
  });
  const [score, setScore] = useState(0);

  useEffect(() => {
    onScoreChange?.(score);
  }, [score, onScoreChange]);
  const [won, setWon] = useState(false);
  const [tapEffects, setTapEffects] = useState<{ id: string; x: number; y: number }[]>([]);
  const { effects, addEffect } = useEffects();
  const wonRef = useRef(false);

  // Regrow sealed leaks
  useEffect(() => {
    if (!REGROW || wonRef.current) return;
    const id = setInterval(() => {
      setLeaks(prev => prev.map(l => l.level === 0 ? { ...l, level: 1 } : l));
    }, REGROW_INTERVAL);
    return () => clearInterval(id);
  }, [REGROW, REGROW_INTERVAL]);

  // Win check
  useEffect(() => {
    if (leaks.every(l => l.level === 0) && !wonRef.current) {
      wonRef.current = true;
      setWon(true);
      addEffect('🔧 ALL SEALED!', '#86efac', 50, 45, true);
      setTimeout(onWin, 1800);
    }
  }, [leaks, onWin, addEffect]);

  const handlePatch = (id: number, x: number, y: number) => {
    if (wonRef.current) return;
    const fxId = `${Date.now()}-${id}`;
    setTapEffects(e => [...e, { id: fxId, x, y }]);
    setTimeout(() => setTapEffects(e => e.filter(ef => ef.id !== fxId)), 500);

    setLeaks(prev => prev.map(l => {
      if (l.id !== id) return l;
      const newLevel = Math.max(0, l.level - 1);
      const pts = newLevel === 0 ? 80 : 25;
      setScore(p => p + pts);
      addEffect(newLevel === 0 ? '🔧 SEALED!' : '💨 Patched', newLevel === 0 ? '#86efac' : '#fbbf24', l.x, l.y - 15);
      return { ...l, level: newLevel };
    }));
  };

  const STEAM_SIZES = [0, 2.2, 3.2, 4.2, 5, 5.8];
  const sealed = leaks.filter(l => l.level === 0).length;

  return (
    <div className="h-full flex flex-col py-3 px-2 relative select-none bg-transparent">
      <EffectLayer effects={effects} />

      <TopBar icon="🔧" title="Seal the Steam Leaks!" score={score} scoreColor="#67e8f9"
        progress={{ current: sealed, total: leaks.length, label: 'sealed' }} />

      <p className="text-center mg-nunito text-white/60 text-xs mb-2 shrink-0">
        Tap the 💨 steam clouds {INIT_LEVEL}× to seal each leak — be quick!
      </p>

      {/* Pipe arena */}
      <div className="flex-1 relative mx-auto w-full max-w-lg rounded-3xl overflow-hidden"
        style={{ border: '2px solid rgba(103,232,249,0.2)', background: 'linear-gradient(180deg,rgba(7,89,133,0.3),rgba(15,23,42,0.6))' }}>

        {/* Background pipe */}
        <div className="absolute left-6 right-6 rounded-2xl"
          style={{ top: '45%', height: '14%', background: 'linear-gradient(180deg,#9ca3af,#6b7280,#4b5563)', boxShadow: '0 4px 0 rgba(0,0,0,0.4)', border: '2px solid rgba(255,255,255,0.15)' }} />

        {/* Pipe bolts */}
        {[12, 28, 44, 60, 76, 90].map(x => (
          <div key={x} className="absolute w-3 h-4 rounded-sm"
            style={{ left: `${x}%`, top: '43%', background: '#374151', border: '1px solid rgba(255,255,255,0.2)', transform: 'translateY(-50%)' }} />
        ))}

        {/* Leak buttons */}
        {leaks.map(leak => {
          const isSealed = leak.level === 0;
          const steamSize = STEAM_SIZES[Math.min(leak.level, 5)];
          const urgency = leak.level >= 4 ? '#ef4444' : leak.level >= 3 ? '#f97316' : '#fbbf24';
          return (
            <button key={leak.id}
              onClick={() => handlePatch(leak.id, leak.x, leak.y)}
              disabled={isSealed}
              className="absolute flex flex-col items-center justify-center transition-all cursor-pointer z-10"
              style={{
                left: `${leak.x}%`, top: `${leak.y}%`,
                transform: 'translate(-50%,-50%)',
                filter: isSealed ? 'none' : 'drop-shadow(0 0 12px rgba(103,232,249,0.6))',
              }}>
              {!isSealed ? (
                <div className="relative flex flex-col items-center">
                  {/* Steam clouds stacked */}
                  {[...Array(Math.min(leak.level, 3))].map((_, i) => (
                    <span key={i} className="block"
                      style={{
                        fontSize: `${steamSize - i * 0.4}rem`,
                        opacity: 1 - i * 0.25,
                        marginBottom: -8,
                        animation: `mgSteamRise ${1.2 + i * 0.3}s ease ${i * 0.2}s infinite`,
                        filter: `drop-shadow(0 0 10px ${urgency})`,
                      }}>
                      💨
                    </span>
                  ))}
                  {/* Tap counter badge */}
                  <span className="absolute -top-2 -right-3 mg-lucky text-white rounded-full flex items-center justify-center"
                    style={{
                      fontSize: '0.85rem',
                      width: 26, height: 26,
                      background: `radial-gradient(circle,${urgency},${urgency}aa)`,
                      boxShadow: `0 3px 0 rgba(0,0,0,0.5), 0 0 12px ${urgency}`,
                      animation: 'mgPulse 0.8s ease infinite',
                    }}>
                    {leak.level}
                  </span>
                </div>
              ) : (
                <span className="text-3xl" style={{ animation: 'mgBounceIn 0.4s ease' }}>✅</span>
              )}
            </button>
          );
        })}

        {/* Tap ripple effects */}
        {tapEffects.map(fx => (
          <div key={fx.id} className="absolute pointer-events-none rounded-full border-2 border-cyan-400"
            style={{
              left: `${fx.x}%`, top: `${fx.y}%`,
              width: 60, height: 60,
              transform: 'translate(-50%,-50%)',
              animation: 'mgBounceIn 0.5s ease forwards',
              opacity: 0.8,
            }} />
        ))}
      </div>

      {/* Leak progress dots */}
      <div className="flex justify-center gap-3 mt-3 shrink-0">
        {leaks.map(l => (
          <div key={l.id} className="w-9 h-9 rounded-full border-2 flex items-center justify-center text-lg transition-all duration-300"
            style={{
              borderColor: l.level === 0 ? '#34d399' : l.level >= 4 ? '#f87171' : '#fbbf24',
              background: l.level === 0 ? 'rgba(52,211,153,0.2)' : 'rgba(251,191,36,0.1)',
              boxShadow: l.level === 0 ? '0 0 12px rgba(52,211,153,0.4)' : 'none',
            }}>
            {l.level === 0 ? '✅' : '💨'}
          </div>
        ))}
        <span className="mg-lucky text-white/50 text-sm self-center ml-1">{sealed}/{leaks.length}</span>
      </div>

      {won && <WinBanner message="ALL PATCHED!" score={score + 200} />}
    </div>
  );
}
