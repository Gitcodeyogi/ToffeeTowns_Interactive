import React, { useState, useEffect, useCallback, useRef } from 'react';
import { SoundSynth } from '../shared/SoundSynth';
import {
  type GameProps, GameWrapper, TopBar, useEffects, EffectLayer, WinBanner, FailBanner, SVGGear
} from '../core/GameWorkbench';

export function ScaffoldingGame({ onWin, onScoreChange, difficulty = 1, easyMode = false }: GameProps) {
  const TARGET = difficulty === 3 ? 8 : difficulty === 2 ? 6 : 5;
  const SPEED = difficulty === 3 ? 5.5 : difficulty === 2 ? 4.2 : 3;
  const TOL = easyMode ? 22 : difficulty === 3 ? 7 : difficulty === 2 ? 11 : 15;

  const [beams, setBeams] = useState<{ offset: number; color: string }[]>([]);
  const [posX, setPosX] = useState(50);
  const [dir, setDir] = useState<'l' | 'r'>('r');
  const [crashed, setCrashed] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    onScoreChange?.(score);
  }, [score, onScoreChange]);
  const [won, setWon] = useState(false);
  const { effects, addEffect } = useEffects();
  const wonRef = useRef(false);

  const BEAM_COLORS = [
    'linear-gradient(135deg,#f59e0b,#fbbf24)',
    'linear-gradient(135deg,#10b981,#34d399)',
    'linear-gradient(135deg,#3b82f6,#60a5fa)',
    'linear-gradient(135deg,#8b5cf6,#a78bfa)',
    'linear-gradient(135deg,#ec4899,#f472b6)',
    'linear-gradient(135deg,#06b6d4,#22d3ee)',
    'linear-gradient(135deg,#ef4444,#f87171)',
    'linear-gradient(135deg,#84cc16,#a3e635)',
  ];

  // Slider animation
  useEffect(() => {
    if (wonRef.current || beams.length >= TARGET || crashed) return;
    const id = setInterval(() => {
      setPosX(prev => {
        if (prev >= 82) { setDir('l'); return 81; }
        if (prev <= 18) { setDir('r'); return 19; }
        return dir === 'r' ? prev + SPEED * 0.09 : prev - SPEED * 0.09;
      });
    }, 40);
    return () => clearInterval(id);
  }, [dir, beams.length, SPEED, TARGET, crashed]);

  const drop = () => {
    if (crashed || wonRef.current || beams.length >= TARGET) return;
    const diff = Math.abs(posX - 50);
    if (diff > TOL) {
      setCrashed(true);
      addEffect('💥 MISS!', '#f87171', 50, 45, true);
      setTimeout(() => { setBeams([]); setCrashed(false); }, 1800);
    } else {
      const pts = diff < 3 ? 100 : diff < 7 ? 70 : 40;
      const msg = diff < 3 ? '💯 PERFECT!' : diff < 7 ? '🔥 Great!' : '✅ Good!';
      const next = [...beams, { offset: posX - 50, color: BEAM_COLORS[beams.length % BEAM_COLORS.length] }];
      setBeams(next);
      setScore(p => p + pts);
      addEffect(msg, '#facc15', posX, 60 - next.length * 4);
      if (next.length === TARGET) {
        wonRef.current = true;
        setWon(true);
        addEffect('🏗️ BUILT!', '#86efac', 50, 40, true);
        setTimeout(onWin, 1800);
      }
    }
  };

  return (
    <div className="h-full flex flex-col py-3 px-2 relative select-none bg-transparent" onClick={drop}>
      <EffectLayer effects={effects} />

      <TopBar icon="🏗️" title="Stack the Scaffold!" score={score} scoreColor="#fbbf24"
        progress={{ current: beams.length, total: TARGET, label: 'beams' }} />

      <p className="text-center mg-nunito text-white/60 text-xs mb-2 shrink-0 pointer-events-none">
        🎯 Drop the beam inside the green zone — tap anywhere or press the button!
      </p>

      {/* Play Arena */}
      <div className="flex-1 relative rounded-3xl overflow-hidden mx-auto w-full max-w-md pointer-events-none"
        style={{ border: '2px solid rgba(251,191,36,0.2)', minHeight: 200, background: 'linear-gradient(180deg,rgba(15,23,42,0.8),rgba(30,41,59,0.6))' }}>

        {/* Stars background */}
        {[...Array(12)].map((_, i) => (
          <div key={i} className="absolute rounded-full bg-white/20"
            style={{ width: 2, height: 2, left: `${10 + i * 7.5}%`, top: `${15 + (i % 5) * 12}%`, animation: `mgPulse ${1 + i * 0.2}s ease infinite` }} />
        ))}

        {/* Safe zone indicator */}
        <div className="absolute top-0 bottom-0 pointer-events-none z-10"
          style={{
            left: `${50 - TOL}%`, width: `${TOL * 2}%`,
            background: 'rgba(52,211,153,0.07)',
            borderLeft: '2px dashed rgba(52,211,153,0.35)',
            borderRight: '2px dashed rgba(52,211,153,0.35)',
          }} />
        <div className="absolute top-3 left-1/2 -translate-x-1/2 mg-lucky text-[9px] text-emerald-400 z-10 pointer-events-none">▼ AIM HERE ▼</div>

        {/* Moving slider beam */}
        {!crashed && beams.length < TARGET && (
          <div className="absolute top-5 rounded-xl flex items-center justify-center z-20 pointer-events-none"
            style={{
              left: `${posX}%`, width: 110, height: 36,
              transform: 'translateX(-55px)',
              background: BEAM_COLORS[beams.length % BEAM_COLORS.length],
              boxShadow: '0 6px 0 rgba(0,0,0,0.5), 0 0 20px rgba(251,191,36,0.4)',
              transition: 'none',
            }}>
            <span className="mg-lucky text-black text-xs">🪵 BEAM {beams.length + 1}</span>
          </div>
        )}

        {/* Stacked beams */}
        <div className="absolute bottom-4 left-0 right-0 flex flex-col-reverse items-center gap-1 pointer-events-none">
          {beams.map((b, i) => (
            <div key={i} className="h-9 rounded-xl flex items-center justify-center"
              style={{
                width: 110,
                marginLeft: `${b.offset * 2}px`,
                background: b.color,
                boxShadow: '0 4px 0 rgba(0,0,0,0.4)',
                animation: i === beams.length - 1 ? 'mgBounceIn 0.3s ease' : 'none',
              }}>
              <span className="mg-lucky text-black text-[10px]">L{i + 1}</span>
            </div>
          ))}
        </div>

        {/* Crash overlay */}
        {crashed && (
          <div className="absolute inset-0 flex flex-col items-center justify-center rounded-3xl z-30 pointer-events-none"
            style={{ background: 'rgba(127,29,29,0.95)', animation: 'mgShake 0.4s ease' }}>
            <span className="text-6xl">💥</span>
            <p className="mg-lucky text-rose-300 text-lg mt-2">COLLAPSED!</p>
            <p className="mg-nunito text-white/50 text-xs mt-1">Rebuilding in 1s…</p>
          </div>
        )}
      </div>

      {/* Drop button */}
      <button onClick={e => { e.stopPropagation(); drop(); }}
        disabled={crashed || won || beams.length >= TARGET}
        className="mt-3 shrink-0 mx-auto px-12 py-3 rounded-2xl mg-lucky text-black text-lg uppercase transition-all active:scale-95 disabled:opacity-40 cursor-pointer"
        style={{
          background: 'linear-gradient(135deg,#fbbf24,#f59e0b)',
          boxShadow: '0 6px 0 rgba(0,0,0,0.5), 0 0 24px rgba(251,191,36,0.4)',
        }}>
        🪵 DROP BEAM!
      </button>

      {won && <WinBanner message="SCAFFOLD BUILT!" score={score + 300} />}
    </div>
  );
}
