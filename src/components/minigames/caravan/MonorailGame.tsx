import React, { useState, useEffect, useCallback, useRef } from 'react';
import { SoundSynth } from '../shared/SoundSynth';
import {
  type GameProps, GameWrapper, TopBar, useEffects, EffectLayer, WinBanner, FailBanner, SVGGear
} from '../core/GameWorkbench';

export function MonorailGame({ onWin, onScoreChange, difficulty = 1, easyMode = false }: GameProps) {
  const cols = difficulty >= 3 ? 5 : 4;
  const rows = difficulty >= 2 ? 3 : 2;
  const total = cols * rows;

  const [tiles, setTiles] = useState<number[]>(() =>
    Array.from({ length: total }, (_, i) => (i % 4 === 0 ? 0 : i % 4 === 1 ? 90 : i % 4 === 2 ? 180 : 270))
  );
  const [score, setScore] = useState(0);

  useEffect(() => {
    onScoreChange?.(score);
  }, [score, onScoreChange]);
  const [won, setWon] = useState(false);
  const { effects, addEffect } = useEffects();
  const wonRef = useRef(false);

  const isAligned = (angle: number) => easyMode ? angle % 180 === 0 : angle === 0;
  const allAligned = tiles.every(isAligned);
  const alignedCount = tiles.filter(isAligned).length;

  useEffect(() => {
    if (allAligned && !wonRef.current) {
      wonRef.current = true;
      setWon(true);
      addEffect('⚡ SIGNAL ON!', '#facc15', 50, 45, true);
      setTimeout(onWin, 1800);
    }
  }, [allAligned, onWin, addEffect]);

  const handleClick = (idx: number) => {
    if (won) return;
    setTiles(prev => {
      const next = [...prev];
      next[idx] = (next[idx] + 90) % 360;
      return next;
    });
    const nextAngle = (tiles[idx] + 90) % 360;
    if (isAligned(nextAngle)) {
      setScore(p => p + 40);
      addEffect('⚡ Aligned!', '#facc15', (idx % cols) / (cols - 1) * 80 + 10, Math.floor(idx / cols) / rows * 60 + 20);
    }
  };

  const WIRE_COLORS = ['#facc15', '#60a5fa', '#f472b6', '#34d399'];

  const SVGTerminalBlock = ({ color, angle, aligned }: { color: string; angle: number; aligned: boolean }) => (
    <svg width="60" height="60" viewBox="0 0 60 60" className="overflow-visible"
      style={{
        transform: `rotate(${angle}deg)`,
        transition: 'transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)'
      }}
    >
      {/* Central ceramic hub */}
      <circle cx="30" cy="30" r="8" fill="#262626" stroke="#404040" strokeWidth="2" />
      {/* Wire line */}
      <rect x="5" y="27" width="50" height="6" rx="3" fill={aligned ? color : '#3f3f46'}
        style={{
          filter: aligned ? `drop-shadow(0 0 8px ${color})` : 'none',
          transition: 'fill 0.25s'
        }}
      />
      {/* Glow path */}
      {aligned && <rect x="8" y="29" width="44" height="2" rx="1" fill="#fff" opacity="0.8" />}
      {/* Left/Right screw terminals */}
      <rect x="8" y="23" width="6" height="14" rx="1.5" fill="#a1a1aa" stroke="#27272a" strokeWidth="1" />
      <circle cx="11" cy="30" r="1.5" fill="#52525b" />
      <rect x="46" y="23" width="6" height="14" rx="1.5" fill="#a1a1aa" stroke="#27272a" strokeWidth="1" />
      <circle cx="49" cy="30" r="1.5" fill="#52525b" />
      {/* Arrow indicator on wire */}
      <path d="M 40,26 L 47,30 L 40,34 Z" fill={aligned ? '#fff' : '#18181b'} />
    </svg>
  );

  return (
    <GameWrapper>
      <EffectLayer effects={effects} />

      <TopBar icon="⚡" title="Fix the Signal Wires!" score={score} scoreColor="#facc15"
        progress={{ current: alignedCount, total, label: 'wires' }} />

      {/* Instructions */}
      <p className="text-center mg-nunito text-white/70 text-xs mb-4 shrink-0 font-bold">
        Tap tiles to rotate — make all arrows point → RIGHT to send the signal!
      </p>

      {/* Grid */}
      <div className="flex-grow flex items-center justify-center min-h-0">
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)`, maxWidth: `${cols * 86}px` }}>
          {tiles.map((angle, idx) => {
            const aligned = isAligned(angle);
            const ci = idx % WIRE_COLORS.length;
            const wcolor = aligned ? WIRE_COLORS[ci] : '#6b7280';
            return (
              <button key={idx} onClick={() => handleClick(idx)}
                className="rounded-2xl flex items-center justify-center cursor-pointer relative overflow-hidden transition-all duration-200 active:scale-95 border-4 border-black shadow-[4px_4px_0_rgba(0,0,0,1)]"
                style={{
                  width: 74, height: 74,
                  background: aligned ? `${wcolor}15` : 'rgba(15,23,42,0.4)',
                  borderColor: aligned ? wcolor : 'rgba(255,255,255,0.08)',
                  boxShadow: aligned ? `0 0 25px ${wcolor}44, 4px 4px 0 rgba(0,0,0,1)` : '4px 4px 0 rgba(0,0,0,1)',
                  transform: aligned ? 'translateY(-2px)' : 'translateY(0)',
                }}>
                
                <SVGTerminalBlock color={wcolor} angle={angle} aligned={aligned} />

                {aligned && (
                  <span className="absolute text-sm top-1 right-1 select-none pointer-events-none" style={{ animation: 'mgPulse 1s ease infinite' }}>⚡</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {won && <WinBanner message="SIGNAL LIVE!" score={score + 300} />}
    </GameWrapper>
  );
}
