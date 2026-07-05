import React, { useState, useEffect, useCallback, useRef } from 'react';
import { SoundSynth } from '../shared/SoundSynth';
import {
  type GameProps, GameWrapper, TopBar, useEffects, EffectLayer, WinBanner, FailBanner, SVGGear
} from '../core/GameWorkbench';

export function SortGame({ onWin, onScoreChange }: GameProps) {
  interface PantryItem { name: string; emoji: string; shelf: string; }
  const SHELVES = [
    { key: 'jars',  label: 'Jars',   emoji: '🥫', color: '#f97316', bg: 'rgba(249,115,22,0.15)'  },
    { key: 'bakes', label: 'Bakes',  emoji: '🧁', color: '#f472b6', bg: 'rgba(244,114,182,0.15)' },
    { key: 'herbs', label: 'Herbs',  emoji: '🌿', color: '#4ade80', bg: 'rgba(74,222,128,0.15)'  },
    { key: 'tools', label: 'Tools',  emoji: '🔧', color: '#60a5fa', bg: 'rgba(96,165,250,0.15)'  },
  ];
  const ITEMS: PantryItem[] = [
    { name: 'Honey Jar',      emoji: '🍯', shelf: 'jars'  }, { name: 'Cocoa Powder',   emoji: '🟫', shelf: 'jars'  },
    { name: 'Croissant',      emoji: '🥐', shelf: 'bakes' }, { name: 'Muffin',         emoji: '🧁', shelf: 'bakes' },
    { name: 'Mint Leaves',    emoji: '🌿', shelf: 'herbs' }, { name: 'Lavender Bunch', emoji: '🪻', shelf: 'herbs' },
    { name: 'Wrench',         emoji: '🔧', shelf: 'tools' }, { name: 'Measuring Tape', emoji: '📏', shelf: 'tools' },
    { name: 'Jam Jar',        emoji: '🍓', shelf: 'jars'  }, { name: 'Cookie',         emoji: '🍪', shelf: 'bakes' },
  ];
  const [queue] = useState<PantryItem[]>(() => [...ITEMS].sort(() => Math.random() - 0.5));
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);

  useEffect(() => {
    onScoreChange?.(score);
  }, [score, onScoreChange]);
  const [timer, setTimer] = useState(60);
  const [wrong, setWrong] = useState<string | null>(null);
  const [won, setWon] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const { effects, addEffect } = useEffects();
  const wonRef = useRef(false);

  useEffect(() => {
    if (won || timedOut) return;
    const id = setInterval(() => setTimer(t => {
      if (t <= 1) { setTimedOut(true); addEffect('⏰ TIME UP!', '#f87171', 50, 45, true); return 0; }
      return t - 1;
    }), 1000);
    return () => clearInterval(id);
  }, [won, timedOut, addEffect]);

  const place = (shelfKey: string) => {
    if (won || timedOut || wrong) return;
    const item = queue[current];
    if (item.shelf !== shelfKey) {
      setWrong(shelfKey); addEffect('❌ Wrong shelf!', '#f87171', 50, 50);
      setTimeout(() => setWrong(null), 600); return;
    }
    setScore(s => s + 25 + Math.floor(timer / 6));
    addEffect(`✅ ${item.name}!`, SHELVES.find(s => s.key === shelfKey)!.color, 50, 40);
    const next = current + 1;
    if (next >= queue.length) { wonRef.current = true; setWon(true); addEffect('📦 ALL SORTED!', '#facc15', 50, 45, true); setTimeout(onWin, 1800); }
    else setCurrent(next);
  };

  const item = queue[current];
  const sh = item ? SHELVES.find(s => s.key === item.shelf) : null;

  return (
    <div className="h-full flex flex-col py-3 px-2 relative select-none bg-transparent">
      <EffectLayer effects={effects} />
      <TopBar icon="📦" title="Pantry Sort Sprint" score={score} scoreColor="#fda4af"
        timer={timer} progress={{ current, total: queue.length, label: 'sorted' }} />
      {item && (
        <div className="flex flex-col items-center mb-4 shrink-0">
          <p className="mg-nunito text-white/50 text-xs mb-2">TAP THE CORRECT SHELF FOR:</p>
          <div className="flex flex-col items-center gap-2 px-8 py-4 rounded-2xl"
            style={{ background: sh ? `${sh.color}15` : 'rgba(255,255,255,0.05)', border: `2px solid ${sh ? sh.color + '40' : 'rgba(255,255,255,0.1)'}`, animation: 'mgBounceIn 0.3s ease' }}>
            <span style={{ fontSize: '3.2rem', animation: 'mgBounce 1.5s ease infinite', filter: `drop-shadow(0 0 12px ${sh?.color || 'white'})` }}>{item.emoji}</span>
            <span className="mg-lucky text-white text-xl">{item.name}</span>
          </div>
        </div>
      )}
      <div className="grid grid-cols-2 gap-3 flex-1 max-w-md mx-auto w-full">
        {SHELVES.map(s => {
          const isWrong = wrong === s.key;
          return (
            <button key={s.key} onClick={() => place(s.key)}
              className="flex flex-col items-center justify-center gap-2 rounded-2xl cursor-pointer active:scale-90"
              style={{ background: s.bg, border: `3px solid ${isWrong ? '#ef4444' : s.color + '60'}`, boxShadow: '0 6px 0 rgba(0,0,0,0.4)', animation: isWrong ? 'mgShake 0.4s ease' : 'none' }}>
              <span style={{ fontSize: '2.8rem', filter: `drop-shadow(0 0 10px ${s.color})` }}>{s.emoji}</span>
              <span className="mg-lucky text-lg" style={{ color: s.color }}>{s.label}</span>
            </button>
          );
        })}
      </div>
      {timedOut && !won && (
        <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl z-30"
          style={{ background: 'rgba(15,23,42,0.95)', animation: 'mgBounceIn 0.4s ease' }}>
          <span className="text-6xl mb-3">⏰</span>
          <p className="mg-lucky text-yellow-400 text-2xl">TIME'S UP!</p>
          <p className="mg-nunito text-white/60 text-sm mt-2">Sorted {current}/{queue.length} items</p>
        </div>
      )}
      {won && <WinBanner message="PANTRY SORTED!" score={score + 150} />}
    </div>
  );
}