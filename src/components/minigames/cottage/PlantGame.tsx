import React, { useState, useEffect, useCallback, useRef } from 'react';
import { SoundSynth } from '../shared/SoundSynth';
import {
  type GameProps, GameWrapper, TopBar, useEffects, EffectLayer, WinBanner, FailBanner, SVGGear
} from '../core/GameWorkbench';

interface Plant {
  id: number;
  name: string;
  emoji: string;
  thirst: number;
  color: string;
  watered: boolean;
}

interface PipeTile {
  type: 'straight' | 'elbow' | 'tJunction' | 'cross';
  rotation: 0 | 90 | 180 | 270;
}

function getOpenings(type: string, rotation: number): number[] {
  if (type === 'cross') return [0, 1, 2, 3];
  if (type === 'straight') {
    return (rotation === 0 || rotation === 180) ? [1, 3] : [0, 2];
  }
  if (type === 'elbow') {
    if (rotation === 0) return [0, 1];   // Up, Right
    if (rotation === 90) return [1, 2];  // Right, Down
    if (rotation === 180) return [2, 3]; // Down, Left
    return [3, 0];                       // Left, Up
  }
  if (type === 'tJunction') {
    if (rotation === 0) return [1, 2, 3];  // Right, Down, Left
    if (rotation === 90) return [0, 1, 2];  // Up, Right, Down
    if (rotation === 180) return [0, 1, 3]; // Up, Right, Left
    return [0, 2, 3];                      // Up, Down, Left
  }
  return [];
}

function getConnectedGrid(grid: PipeTile[][]) {
  const visited = new Set<string>();
  const queue: { r: number; c: number; enterDir: number }[] = [];

  // Central pumps enter from bottom (dir 2) at (row 2, col 2) and (row 2, col 3)
  const startPoints = [
    { r: 2, c: 2, enterDir: 2 },
    { r: 2, c: 3, enterDir: 2 }
  ];

  startPoints.forEach(p => {
    const tile = grid[p.r][p.c];
    const openings = getOpenings(tile.type, tile.rotation);
    if (openings.includes(p.enterDir)) {
      queue.push(p);
      visited.add(`${p.r},${p.c}`);
    }
  });

  const reachedPlants: number[] = [];
  const connectedTiles = new Set<string>();

  while (queue.length > 0) {
    const { r, c, enterDir } = queue.shift()!;
    connectedTiles.add(`${r},${c}`);

    const tile = grid[r][c];
    const openings = getOpenings(tile.type, tile.rotation);

    // Exiting top (row 0, moving Up/0) reaches plant at column c
    if (r === 0 && openings.includes(0)) {
      if (!reachedPlants.includes(c)) reachedPlants.push(c);
    }

    for (const exitDir of openings) {
      if (exitDir === enterDir) continue;

      const nr = r + [-1, 0, 1, 0][exitDir];
      const nc = c + [0, 1, 0, -1][exitDir];

      if (nr >= 0 && nr < 3 && nc >= 0 && nc < 6) {
        const neighborKey = `${nr},${nc}`;
        if (!visited.has(neighborKey)) {
          const neighborTile = grid[nr][nc];
          const neighborOpenings = getOpenings(neighborTile.type, neighborTile.rotation);
          const requiredNeighborOpening = (exitDir + 2) % 4;
          if (neighborOpenings.includes(requiredNeighborOpening)) {
            visited.add(neighborKey);
            queue.push({ r: nr, c: nc, enterDir: requiredNeighborOpening });
          }
        }
      }
    }
  }

  return { reachedPlants, connectedTiles };
}

// ── Floating Particle Effects ─────────────────────────────────────────────────

export function PlantGame({ onWin, onFail, onScoreChange, addLog }: GameProps) {
  const [plants, setPlants] = useState<Plant[]>([
    { id: 0, name: 'Rose',      emoji: '🌹', thirst: 50, color: '#f87171', watered: false },
    { id: 1, name: 'Orchid',    emoji: '🌸', thirst: 65, color: '#f472b6', watered: false },
    { id: 2, name: 'Sunflower', emoji: '🌻', thirst: 45, color: '#facc15', watered: false },
    { id: 3, name: 'Fern',      emoji: '🌿', thirst: 55, color: '#34d399', watered: false },
    { id: 4, name: 'Tulip',     emoji: '🌷', thirst: 40, color: '#fb923c', watered: false },
    { id: 5, name: 'Lavender',  emoji: '🪻', thirst: 35, color: '#a78bfa', watered: false },
  ]);

  // Scramble 6x3 pipe grid
  const initialGrid = (): PipeTile[][] => {
    const types: ('straight'|'elbow'|'tJunction'|'cross')[] = ['straight', 'elbow', 'tJunction', 'cross'];
    const rots: (0|90|180|270)[] = [0, 90, 180, 270];
    return Array.from({ length: 3 }, () =>
      Array.from({ length: 6 }, () => ({
        type: types[Math.floor(Math.random() * types.length)],
        rotation: rots[Math.floor(Math.random() * rots.length)]
      }))
    );
  };

  const [grid, setGrid] = useState<PipeTile[][]>(initialGrid);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [pumping, setPumping] = useState(false);
  const [won, setWon] = useState(false);
  const [lost, setLost] = useState(false);
  const { effects, addEffect } = useEffects();

  const wonRef = useRef(false);
  const lostRef = useRef(false);

  const remaining = plants.filter(p => !p.watered);
  const nextId = remaining.length > 0 ? remaining.reduce((a, b) => a.thirst > b.thirst ? a : b).id : null;

  // Real-time path tracing to show pipe connections dynamically!
  const { reachedPlants, connectedTiles } = getConnectedGrid(grid);

  // Win condition checker
  useEffect(() => {
    if (remaining.length === 0 && !wonRef.current && !lost) {
      wonRef.current = true;
      setWon(true);
      addEffect('🌸 ALL BLOOMING!', '#4ade80', 50, 45, true);
      addLog?.('🎉 Magnificent work! The entire garden has burst into healthy bloom!');
      setTimeout(onWin, 10000);
    }
  }, [remaining.length, onWin, addEffect, addLog, lost]);

  // Thirst increment & wilting thread
  useEffect(() => {
    if (won || lost || pumping) return;
    const interval = setInterval(() => {
      setPlants(prev => {
        let wilted = false;
        const next = prev.map(p => {
          if (p.watered) return p;
          const nextThirst = Math.min(100, p.thirst + 3);
          if (nextThirst >= 100 && p.thirst < 100) {
            wilted = true;
            return { ...p, thirst: 30 }; // Reset thirst slightly
          }
          return { ...p, thirst: nextThirst };
        });

        if (wilted) {
          setLives(l => {
            const nextL = l - 1;
            addEffect('🥀 WILTED!', '#f87171', 50, 45, true);
            addLog?.('🥀 Oh no! A plant wilted due to dry roots. Lost 1 life.');
            if (nextL <= 0 && !lostRef.current) {
              lostRef.current = true;
              setLost(true);
              addLog?.('💀 Game Over! The garden has dried out.');
              if (onFail) setTimeout(onFail, 10000);
            }
            return Math.max(0, nextL);
          });
        }
        return next;
      });
    }, 1400);

    return () => clearInterval(interval);
  }, [won, lost, pumping, onFail, addLog, addEffect]);

  // Rotate tile 90 degrees
  const rotateTile = (r: number, c: number) => {
    if (pumping || won || lost) return;
    setGrid(prev => {
      const copy = prev.map(row => [...row]);
      const currentRot = copy[r][c].rotation;
      copy[r][c].rotation = ((currentRot + 90) % 360) as 0 | 90 | 180 | 270;
      return copy;
    });
  };

  // Trigger pump action
  const handlePump = () => {
    if (pumping || won || lost) return;
    setPumping(true);
    addLog?.('💧 Pump activated! Flushing water through the pipe network...');

    // Simulate animated water filling flow
    setTimeout(() => {
      setPumping(false);
      
      if (reachedPlants.length === 0) {
        // LEAK / DEAD END
        setLives(l => {
          const nextL = l - 1;
          addEffect('💨 PIPE LEAK! -1 Life', '#ef4444', 50, 60, true);
          addLog?.('💨 Water path blocked or leaking! The pump pressure dropped, causing a leak.');
          if (nextL <= 0 && !lostRef.current) {
            lostRef.current = true;
            setLost(true);
            addLog?.('💀 Out of lives! The garden withered.');
            if (onFail) setTimeout(onFail, 10000);
          }
          return Math.max(0, nextL);
        });
        return;
      }

      // Success: check which plants got watered
      let pointsTotal = 0;
      let logsAdded: string[] = [];

      setPlants(prev => {
        return prev.map((p, idx) => {
          if (reachedPlants.includes(idx) && !p.watered) {
            const isCombo = p.thirst >= 80;
            const targetScore = isCombo ? 35 : 15;
            pointsTotal += targetScore;

            if (isCombo) {
              addEffect('🔥 RESCUE COMBO! +35', '#fbbf24', 16 + idx * 13, 25, true);
              logsAdded.push(`🔥 Incredible save! Rescued ${p.name} from wilting! (+35 pts)`);
            } else {
              addEffect('💧 Watered! +15', p.color, 16 + idx * 13, 30);
              logsAdded.push(`💧 Successfully watered the ${p.name}. (+15 pts)`);
            }
            return { ...p, watered: true, thirst: 0 };
          }
          return p;
        });
      });

      if (pointsTotal > 0) {
        setScore(s => {
          const nextS = s + pointsTotal;
          onScoreChange?.(nextS);
          return nextS;
        });
        logsAdded.forEach(log => addLog?.(log));
      } else {
        addLog?.('💧 Water flushed but the connected plants were already healthy.');
      }

      // Randomize grid slightly on successful connections to keep the challenge fresh!
      setGrid(initialGrid());

    }, 1200);
  };

  // SVG representation for vectors
  const getPipeSvg = (type: string) => {
    const strokeColor = 'currentColor';
    if (type === 'straight') {
      return (
        <svg viewBox="0 0 50 50" className="w-full h-full">
          <line x1="0" y1="25" x2="50" y2="25" stroke={strokeColor} strokeWidth="8" strokeLinecap="round" />
        </svg>
      );
    }
    if (type === 'elbow') {
      return (
        <svg viewBox="0 0 50 50" className="w-full h-full">
          <path d="M 25,0 L 25,25 L 50,25" stroke={strokeColor} strokeWidth="8" strokeLinecap="round" fill="none" />
        </svg>
      );
    }
    if (type === 'tJunction') {
      return (
        <svg viewBox="0 0 50 50" className="w-full h-full">
          <line x1="0" y1="25" x2="50" y2="25" stroke={strokeColor} strokeWidth="8" strokeLinecap="round" />
          <line x1="25" y1="25" x2="25" y2="50" stroke={strokeColor} strokeWidth="8" strokeLinecap="round" />
        </svg>
      );
    }
    return (
      <svg viewBox="0 0 50 50" className="w-full h-full">
        <line x1="0" y1="25" x2="50" y2="25" stroke={strokeColor} strokeWidth="8" strokeLinecap="round" />
        <line x1="25" y1="0" x2="25" y2="50" stroke={strokeColor} strokeWidth="8" strokeLinecap="round" />
      </svg>
    );
  };

  return (
    <div className="h-full flex flex-col py-3 px-2 relative select-none bg-transparent">
      <EffectLayer effects={effects} />

      <TopBar 
        icon="🌱" 
        title="Balcony Plant Waterer" 
        score={score} 
        scoreColor="#4ade80"
        progress={{ current: plants.filter(p=>p.watered).length, total: plants.length, label: 'watered' }}
        extra={
          <div className="flex gap-1 ml-2 bg-black/40 px-3 py-1 rounded-full border border-white/5 shrink-0">
            {Array.from({ length: 3 }).map((_, i) => (
              <span key={i} className="text-sm transition-all duration-300" style={{ opacity: i < lives ? 1 : 0.15 }}>❤️</span>
            ))}
          </div>
        }
      />

      {/* ── PLANTS ROW ── */}
      <div className="grid grid-cols-6 gap-2 px-2 shrink-0">
        {plants.map((p, idx) => {
          const isDanger = p.thirst >= 80;
          const barColor = isDanger ? '#ef4444' : p.thirst > 45 ? '#fb923c' : '#4ade80';
          const isTargeted = reachedPlants.includes(idx);

          return (
            <div 
              key={p.id}
              className="flex flex-col items-center gap-1 p-2 rounded-2xl text-center relative overflow-hidden transition-all duration-300"
              style={{
                background: p.watered 
                  ? 'linear-gradient(135deg, rgba(52,211,153,0.06), rgba(0,0,0,0.5))' 
                  : isDanger 
                  ? 'linear-gradient(135deg, rgba(239,68,68,0.08), rgba(0,0,0,0.5))'
                  : 'linear-gradient(135deg, rgba(255,255,255,0.02), rgba(0,0,0,0.4))',
                border: `1.5px solid ${p.watered ? '#34d39960' : isTargeted ? '#60a5fa' : 'rgba(255,255,255,0.05)'}`,
                boxShadow: isTargeted ? '0 0 12px rgba(96,165,250,0.3)' : 'none',
              }}
            >
              {/* Plant Emoji */}
              <span className={`text-2xl ${p.watered ? 'animate-bounce' : ''}`} style={{ filter: `drop-shadow(0 0 8px ${p.color})` }}>
                {p.watered ? '🌸' : p.emoji}
              </span>

              {/* Name */}
              <span className="mg-lucky text-[9px] text-white/70 uppercase block leading-none">{p.name}</span>

              {/* Thirst progress bar */}
              {!p.watered ? (
                <div className="w-full mt-1.5">
                  <div className="w-full h-1.5 rounded-full overflow-hidden bg-white/5 border border-white/5">
                    <div className="h-full rounded-full transition-all duration-300" style={{ width: `${p.thirst}%`, background: barColor }} />
                  </div>
                  <span className="mg-lucky text-[8px] block mt-0.5" style={{ color: barColor }}>{Math.round(p.thirst)}%</span>
                </div>
              ) : (
                <span className="mg-lucky text-[8px] text-emerald-400 mt-1.5 block leading-none uppercase bg-emerald-950/20 border border-emerald-500/20 px-2 py-0.5 rounded-full">OK!</span>
              )}

              {/* Pipe connection inlet indicator */}
              <div className="w-3 h-3 rounded-full mt-1.5 border border-white/25 flex items-center justify-center"
                style={{ background: isTargeted ? '#60a5fa' : 'rgba(255,255,255,0.05)', boxShadow: isTargeted ? '0 0 8px #60a5fa' : 'none' }}
              >
                <div className="w-1 h-1 rounded-full bg-white" />
              </div>
            </div>
          );
        })}
      </div>

      {/* ── PIPE ROTATION PUZZLE GRID ── */}
      <div className="flex-grow flex flex-col justify-center my-3 relative px-4">
        {/* Pipe background container */}
        <div className="relative p-3 rounded-3xl border-4 border-black/60 mx-auto w-full max-w-[540px] flex flex-col gap-2"
          style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(30,27,75,0.35), rgba(10,10,15,0.9))', boxShadow: 'inset 0 0 24px rgba(0,0,0,0.8)' }}
        >
          {grid.map((row, rIdx) => (
            <div key={rIdx} className="grid grid-cols-6 gap-2">
              {row.map((tile, cIdx) => {
                const isConnected = connectedTiles.has(`${rIdx},${cIdx}`);
                const color = pumping 
                  ? (isConnected ? 'text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.9)]' : 'text-purple-950')
                  : (isConnected ? 'text-blue-500 drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]' : 'text-zinc-700');

                return (
                  <button
                    key={cIdx}
                    onClick={() => rotateTile(rIdx, cIdx)}
                    className="aspect-square rounded-xl flex items-center justify-center cursor-pointer transition-all duration-200 hover:bg-white/5 active:scale-95 border border-white/5"
                    style={{ background: 'rgba(255,255,255,0.01)', touchAction: 'none' }}
                  >
                    <div 
                      className={`w-full h-full ${color} transition-transform duration-200`}
                      style={{ transform: `rotate(${tile.rotation}deg)` }}
                    >
                      {getPipeSvg(tile.type)}
                    </div>
                  </button>
                );
              })}
            </div>
          ))}

          {/* Central Water Pump entrance indicators */}
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex gap-[58px]">
            <div className="w-4 h-4 rounded-t-full bg-blue-500 border border-blue-400 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
            <div className="w-4 h-4 rounded-t-full bg-blue-500 border border-blue-400 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
          </div>
        </div>
      </div>

      {/* ── PUMP CONTROLS ── */}
      <div className="shrink-0 flex flex-col items-center gap-1.5 pb-2">
        <button
          onClick={handlePump}
          disabled={pumping || won || lost}
          className="pgf-btn mg-lucky px-12 py-3 rounded-full text-black text-sm uppercase tracking-wider relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background: 'linear-gradient(135deg, #60a5fa, #3b82f6)',
            boxShadow: '0 0 24px rgba(59,130,246,0.5), 0 5px 0 #2563eb',
          }}
        >
          {pumping ? '💧 PUMPING WATER...' : '🚀 PUMP WATER!'}
        </button>
        <span className="mg-nunito text-[10px] text-white/40 block mt-1 font-bold">
          Align pipes starting from the bottom-center pump to connect targets!
        </span>
      </div>

      {won && <WinBanner message="GARDEN BLOOMS!" score={score + 150} stats={[
        { label:'Plants Watered', value:`${plants.filter(p=>p.watered).length}/${plants.length}`, color:'#4ade80' },
        { label:'Points Earned',  value:score + 150,                                      color:'#fbbf24' },
      ]} />}

      {lost && <FailBanner message="GARDEN WITHERED! 🥀" subtitle={`All lives lost! You saved ${plants.filter(p=>p.watered).length}/${plants.length} plants.`} score={score} />}
    </div>
  );
}
