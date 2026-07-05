import React, { useState, useEffect, useCallback, useRef } from 'react';
import { SoundSynth } from '../shared/SoundSynth';
import {
  type GameProps, GameWrapper, TopBar, useEffects, EffectLayer, WinBanner, FailBanner, SVGGear
} from '../core/GameWorkbench';

export function BubbleGame({ onWin, onScoreChange }: GameProps) {
  const COLORS = [
    { key: 'red',    emoji: '🌸', hex: '#f43f5e', glow: 'rgba(244,63,94,0.4)',  label: 'Rose Petal' },
    { key: 'orange', emoji: '🍁', hex: '#f97316', glow: 'rgba(249,115,22,0.4)', label: 'Autumn Leaf' },
    { key: 'yellow', emoji: '🌻', hex: '#eab308', glow: 'rgba(234,179,8,0.4)',  label: 'Sun Orchid' },
    { key: 'green',  emoji: '🌿', hex: '#22c55e', glow: 'rgba(34,197,94,0.4)',  label: 'Mint Shoot' },
    { key: 'blue',   emoji: '🪻', hex: '#3b82f6', glow: 'rgba(59,130,246,0.4)',  label: 'Bluebell' },
  ];
  const TOTAL = 15;

  const makeBubbles = () => COLORS.flatMap((c, ci) =>
    [0, 1, 2].map((_, bi) => ({
      id: `${ci}-${bi}`, colorIdx: ci,
      x: 15 + ((ci * 3 + bi) * 18) % 70,
      y: 20 + ((ci + bi) * 22) % 60,
      size: 58 + ((ci + bi) % 3) * 12,
      popped: false, wobble: (ci + bi) % 3,
    }))
  );

  const [bubbles, setBubbles] = useState(makeBubbles);
  const [nextIdx, setNextIdx] = useState(0);
  const [score, setScore] = useState(0);

  useEffect(() => {
    onScoreChange?.(score);
  }, [score, onScoreChange]);
  const [streak, setStreak] = useState(0);
  const [wrong, setWrong] = useState<string | null>(null);
  const [won, setWon] = useState(false);
  const { effects, addEffect } = useEffects();
  const wonRef = useRef(false);

  // Particle list for popping dewdrops
  const [droplets, setDroplets] = useState<{ id: string; x: number; y: number; dx: number; dy: number; color: string }[]>([]);
  // Rising butterflies
  const [butterflies, setButterflies] = useState<{ id: string; x: number; y: number; emoji: string }[]>([]);

  const poppedCount = bubbles.filter(b => b.popped).length;

  useEffect(() => {
    if (poppedCount === TOTAL && !wonRef.current) {
      wonRef.current = true;
      setWon(true);
      SoundSynth.playBell();
      addEffect('🌈 GARDEN TIDY!', '#a78bfa', 50, 45, true);
      setTimeout(onWin, 2000);
    }
  }, [poppedCount, onWin, addEffect]);

  const handleBubble = (id: string, colorIdx: number, bx: number, by: number) => {
    if (won || wrong) return;
    if (colorIdx !== nextIdx) {
      setWrong(id);
      setStreak(0);
      SoundSynth.playThud();
      addEffect('❌ Out of Order!', '#ef4444', bx, by);
      setTimeout(() => setWrong(null), 600);
      return;
    }

    setBubbles(prev => prev.map(b => b.id === id ? { ...b, popped: true } : b));
    setScore(p => p + 20 + streak * 10);
    setStreak(s => s + 1);
    SoundSynth.playPop();

    // 🌊 Spawn physical water droplets
    const c = COLORS[colorIdx];
    const newDrops = Array.from({ length: 8 }).map((_, i) => {
      const angle = (i * Math.PI) / 4;
      return {
        id: `${id}-drop-${i}-${Math.random()}`,
        x: bx,
        y: by,
        dx: Math.cos(angle) * (3 + Math.random() * 3),
        dy: Math.sin(angle) * (3 + Math.random() * 3) - 2, // slightly upward gravity drift
        color: c.hex,
      };
    });
    setDroplets(d => [...d, ...newDrops]);

    // 🦋 Rare butterfly flies away from pop location
    if (Math.random() > 0.4) {
      const bfly = {
        id: `${id}-bfly-${Math.random()}`,
        x: bx,
        y: by,
        emoji: ['🦋', '✨', '🌸'][Math.floor(Math.random() * 3)],
      };
      setButterflies(b => [...b, bfly]);
      // Remove butterfly after animation
      setTimeout(() => {
        setButterflies(b => b.filter(x => x.id !== bfly.id));
      }, 1600);
    }

    const remaining = bubbles.filter(b => b.colorIdx === colorIdx && !b.popped && b.id !== id).length;
    if (remaining === 0) {
      setNextIdx(ni => ni + 1);
      addEffect(`${c.label} Clear! 🌸`, c.hex, 50, 42, true);
    } else {
      addEffect(streak >= 2 ? '🔥 STREAK!' : '💧 Splash', c.hex, bx, by - 6);
    }
  };

  // Droplet movement loop
  useEffect(() => {
    if (droplets.length === 0) return;
    const interval = setInterval(() => {
      setDroplets(prev =>
        prev
          .map(d => ({
            ...d,
            x: d.x + d.dx,
            y: d.y + d.dy,
            dy: d.dy + 0.3, // simulated gravity pulling drops down
          }))
          .filter(d => d.y < 100 && d.x > 0 && d.x < 100)
      );
    }, 30);
    return () => clearInterval(interval);
  }, [droplets.length]);

  const nextColor = COLORS[nextIdx];
  const WOBBLES = ['mgBounce 2s ease infinite', 'mgBounce 2.5s ease 0.4s infinite', 'mgBounce 1.8s ease 0.8s infinite'];

  return (
    <div className="h-full flex flex-col py-3 px-2 relative select-none"
      style={{
        background: 'radial-gradient(circle at 50% 50%, #0d2c16 0%, #051307 100%)', // Deep moss green background
      }}>
      <EffectLayer effects={effects} />

      <TopBar icon="🫧" title="Bubble Sort Garden" score={score} scoreColor="#e879f9"
        progress={{ current: poppedCount, total: TOTAL, label: 'popped' }} />

      {nextColor && (
        <div className="flex items-center justify-center gap-3 mb-2 shrink-0">
          <span className="mg-nunito text-white/50 text-[10px]">CURRENT DEW TARGET:</span>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full"
            style={{ background: `${nextColor.hex}15`, border: `1.5px solid ${nextColor.hex}40`, boxShadow: `0 0 16px ${nextColor.glow}` }}>
            <span className="text-xl" style={{ animation: 'mgBounce 0.8s ease infinite' }}>{nextColor.emoji}</span>
            <span className="mg-lucky text-xs" style={{ color: nextColor.hex }}>{nextColor.label}</span>
          </div>
        </div>
      )}

      {/* The Garden Leaf Table View */}
      <div className="flex-1 relative rounded-3xl overflow-hidden mx-auto w-full max-w-lg"
        style={{
          background: 'linear-gradient(160deg, #163c1f 0%, #0a1f0f 100%)',
          border: '2px solid rgba(74, 222, 128, 0.25)',
          boxShadow: 'inset 0 0 30px rgba(0,0,0,0.8)',
        }}>
        
        {/* Soft morning sunlight beam */}
        <div className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at 10% 10%, rgba(253,224,71,0.18) 0%, transparent 60%)',
          }} />

        {/* Textured leaf outlines */}
        <div className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px)',
            backgroundSize: '16px 16px',
          }} />

        {/* Droplets splash render layer */}
        {droplets.map(d => (
          <div key={d.id} className="absolute w-2 h-2 rounded-full pointer-events-none shadow"
            style={{
              left: `${d.x}%`, top: `${d.y}%`,
              background: d.color,
              filter: 'brightness(1.1) blur(0.5px)',
            }} />
        ))}

        {/* Butterflies flying away layer */}
        {butterflies.map(b => (
          <div key={b.id} className="absolute text-xl pointer-events-none select-none"
            style={{
              left: `${b.x}%`, top: `${b.y}%`,
              animation: 'mgFloat 1.6s cubic-bezier(0.25, 1, 0.5, 1) forwards',
              textShadow: '0 0 10px rgba(255,255,255,0.8)',
            }}>
            {b.emoji}
          </div>
        ))}

        {/* Translucent glass dewdrops */}
        {bubbles.map(b => {
          const c = COLORS[b.colorIdx];
          const isNext = b.colorIdx === nextIdx && !b.popped;
          const isWrong = wrong === b.id;
          if (b.popped) return null;
          return (
            <button key={b.id} onClick={() => handleBubble(b.id, b.colorIdx, b.x, b.y)}
              className="absolute flex items-center justify-center rounded-full cursor-pointer transition-all duration-150 active:scale-75"
              style={{
                left: `${b.x}%`, top: `${b.y}%`, width: b.size, height: b.size,
                transform: 'translate(-50%, -50%)',
                // Glassmorphism translucent dew style
                background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.15) 30%, rgba(255,255,255,0.02) 70%, rgba(0,0,0,0.2) 100%)',
                border: isNext ? `3.5px solid ${c.hex}` : '2.5px solid rgba(255,255,255,0.4)',
                boxShadow: isWrong
                  ? '0 0 24px rgba(239,68,68,0.9), inset 0 2px 4px rgba(255,255,255,0.6)'
                  : isNext
                    ? `0 0 20px ${c.glow}, 0 4px 6px rgba(0,0,0,0.3), inset 0 2px 4px rgba(255,255,255,0.7)`
                    : '0 3px 5px rgba(0,0,0,0.2), inset 0 2px 3px rgba(255,255,255,0.5)',
                animation: WOBBLES[b.wobble],
                backdropFilter: 'blur(3px)',
              }}>
              
              {/* Internal sky reflection / bubble ring */}
              <div className="absolute w-4 h-2 bg-white/40 rounded-full top-1.5 left-2.5 rotate-[-15deg] pointer-events-none" />
              
              {/* Inner petal emoji */}
              <span className="pointer-events-none select-none opacity-45 filter grayscale-[20%]" style={{ fontSize: b.size * 0.38 }}>
                {c.emoji}
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex justify-center gap-2 mt-3 shrink-0">
        {COLORS.map((c, ci) => {
          const cnt = bubbles.filter(b => b.colorIdx === ci && b.popped).length;
          return (
            <div key={c.key} className="flex flex-col items-center gap-1">
              <div className="flex gap-0.5">
                {[0,1,2].map(bi => (
                  <div key={bi} className="w-2.5 h-2.5 rounded-full border"
                    style={{ background: bi < cnt ? c.hex : 'rgba(255,255,255,0.1)', borderColor: bi < cnt ? c.hex : 'rgba(255,255,255,0.2)' }} />
                ))}
              </div>
              <span className="text-sm">{c.emoji}</span>
            </div>
          );
        })}
      </div>

      {won && <WinBanner message="GARDEN DEW SORTED!" score={score + 200} />}
    </div>
  );
}
