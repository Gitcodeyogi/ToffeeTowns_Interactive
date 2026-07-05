import React, { useState, useEffect, useCallback, useRef } from 'react';
import { SoundSynth } from '../shared/SoundSynth';
import {
  type GameProps, GameWrapper, TopBar, useEffects, EffectLayer, WinBanner, FailBanner, SVGGear
} from '../core/GameWorkbench';

export function SweepGame({ onWin, onScoreChange }: GameProps) {
  interface Bunny { id: string; x: number; y: number; speed: number; emoji: string; }
  const TOTAL = 12; const MAX_LIVES = 3;
  const EMOJIS = ['🐇', '🐰', '🐾', '🫧', '🪶'];
  const [bunnies, setBunnies] = useState<Bunny[]>([]);
  const [lives, setLives] = useState(MAX_LIVES);
  const [swept, setSwept] = useState(0);
  const [score, setScore] = useState(0);

  useEffect(() => {
    onScoreChange?.(score);
  }, [score, onScoreChange]);
  const [won, setWon] = useState(false);
  const [lost, setLost] = useState(false);
  const { effects, addEffect } = useEffects();
  const wonRef = useRef(false);
  const spawnedRef = useRef(0);
  const gameOver = won || lost;

  useEffect(() => {
    if (gameOver) return;
    const id = setInterval(() => {
      if (spawnedRef.current >= TOTAL) { clearInterval(id); return; }
      setBunnies(prev => [...prev, {
        id: `b-${Date.now()}-${Math.random()}`, emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
        x: 8 + Math.random() * 84, y: 0, speed: 0.5 + Math.random() * 0.8,
      }]);
      spawnedRef.current += 1;
    }, 950);
    return () => clearInterval(id);
  }, [gameOver]);

  useEffect(() => {
    if (gameOver) return;
    const id = setInterval(() => {
      setBunnies(prev => {
        const next: Bunny[] = []; let missed = 0;
        for (const b of prev) {
          if (b.y >= 88) { missed++; addEffect('💨 Missed!', '#f87171', b.x, 83); }
          else next.push({ ...b, y: b.y + b.speed });
        }
        if (missed > 0) setLives(l => {
          const nl = l - missed;
          if (nl <= 0 && !wonRef.current) { setLost(true); addEffect('💔 NO LIVES!', '#f87171', 50, 45, true); }
          return Math.max(0, nl);
        });
        return next;
      });
    }, 40);
    return () => clearInterval(id);
  }, [gameOver, addEffect]);

  useEffect(() => {
    if (swept >= TOTAL && spawnedRef.current >= TOTAL && !wonRef.current) {
      wonRef.current = true; setWon(true);
      addEffect('🧹 ALL SWEPT!', '#86efac', 50, 45, true);
      setTimeout(onWin, 1800);
    }
  }, [swept, onWin, addEffect]);

  const tap = (id: string, x: number, y: number) => {
    if (gameOver) return;
    setBunnies(prev => prev.filter(b => b.id !== id));
    setSwept(s => s + 1); setScore(p => p + 30);
    addEffect('🧹 Got it!', '#a78bfa', x, y);
  };

  return (
    <div className="h-full flex flex-col py-3 px-2 relative select-none bg-transparent">
      <EffectLayer effects={effects} />
      <TopBar icon="🧹" title="Dust Bunny Sweep" score={score} scoreColor="#a78bfa"
        progress={{ current: swept, total: TOTAL, label: 'swept' }}
        extra={<div className="flex gap-1 ml-1">{[...Array(MAX_LIVES)].map((_, i) => <span key={i} className="text-base" style={{ opacity: i < lives ? 1 : 0.2 }}>❤️</span>)}</div>} />
      <p className="text-center mg-nunito text-white/50 text-xs mb-2 shrink-0">Tap each bunny before it hits the floor!</p>
      <div className="flex-1 relative rounded-3xl overflow-hidden mx-auto w-full max-w-lg"
        style={{ background: 'radial-gradient(ellipse at 50% 0%,rgba(167,139,250,0.12),rgba(15,23,42,0.8))', border: '2px solid rgba(167,139,250,0.25)' }}>
        <div className="absolute bottom-0 inset-x-0 h-6 rounded-b-3xl flex items-center justify-center"
          style={{ background: 'linear-gradient(0deg,rgba(167,139,250,0.2),transparent)' }}>
          <span className="mg-lucky text-[9px] text-purple-400/60 uppercase">⚡ DANGER FLOOR ⚡</span>
        </div>
        {bunnies.map(b => (
          <button key={b.id} onClick={() => tap(b.id, b.x, b.y)}
            className="absolute cursor-pointer active:scale-75 rounded-full flex items-center justify-center"
            style={{ left: `${b.x}%`, top: `${b.y}%`, transform: 'translate(-50%,-50%)', width: 54, height: 54,
              background: 'radial-gradient(circle,rgba(255,255,255,0.15),rgba(167,139,250,0.2))',
              boxShadow: '0 0 16px rgba(167,139,250,0.5), 0 4px 0 rgba(0,0,0,0.3)',
              border: '2px solid rgba(167,139,250,0.4)' }}>
            <span style={{ fontSize: '1.9rem', animation: 'mgWiggle 0.8s ease infinite' }}>{b.emoji}</span>
          </button>
        ))}
        {lost && (
          <div className="absolute inset-0 flex flex-col items-center justify-center rounded-3xl z-30"
            style={{ background: 'rgba(127,29,29,0.97)', animation: 'mgShake 0.4s ease' }}>
            <span className="text-6xl mb-2">💔</span>
            <p className="mg-lucky text-rose-300 text-2xl">OUT OF LIVES!</p>
            <p className="mg-nunito text-white/50 text-sm mt-1">Swept {swept}/{TOTAL}</p>
          </div>
        )}
      </div>
      {won && <WinBanner message="SWEPT CLEAN!" score={score + 150} />}
    </div>
  );
}
