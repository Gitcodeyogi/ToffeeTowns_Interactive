import React, { useState, useEffect, useCallback, useRef } from 'react';
import { SoundSynth } from '../shared/SoundSynth';
import {
  type GameProps, GameWrapper, TopBar, useEffects, EffectLayer, WinBanner, FailBanner, SVGGear
} from '../core/GameWorkbench';

export interface BoilerGameProps extends GameProps {
  gameTimeLeft?: number;
  isPaused?: boolean;
  setIsPaused?: (v: boolean) => void;
  coins?: number;
  hintCostCoins?: number;
  hintRevealed?: boolean;
  onUseHint?: () => void;
  sessionLogs?: { time: string; msg: string }[];
  requestEarlyExit?: () => void;
}

export function BoilerGame({
  onWin,
  onFail,
  onScoreChange,
  difficulty = 1,
  easyMode = false,
  gameTimeLeft,
  isPaused,
  setIsPaused,
  coins,
  hintCostCoins,
  hintRevealed,
  onUseHint,
  sessionLogs,
  requestEarlyExit
}: BoilerGameProps) {
  // Config parameters
  const GREEN_LOW = easyMode ? 25 : 38;
  const GREEN_HIGH = easyMode ? 90 : 78;
  const WIN_SEC = 15;

  // Local values or fallback mock data
  const timerVal = gameTimeLeft !== undefined ? gameTimeLeft : 167;
  const walletCoins = coins !== undefined ? coins : 615;
  const costHint = hintCostCoins !== undefined ? hintCostCoins : 2;
  const isGamePaused = isPaused || false;
  const logsList = sessionLogs && sessionLogs.length > 0 ? sessionLogs : [];

  // Core physical states
  const [pressure, setPressure] = useState(64);
  const [waterLevel, setWaterLevel] = useState(72);
  const [fireIntensity, setFireIntensity] = useState(45);
  const [ventValue, setVentValue] = useState(25);
  const [waterPump, setWaterPump] = useState(15);
  const [health, setHealth] = useState(84);
  const [stableTime, setStableTime] = useState(0);
  const [won, setWon] = useState(false);
  const [exploded, setExploded] = useState(false);
  const [localLogs, setLocalLogs] = useState<{ time: string; msg: string }[]>([]);
  const [pressureHistory, setPressureHistory] = useState<number[]>([60, 62, 65, 64, 63, 64]);
  const [surgeActive, setSurgeActive] = useState(false);
  const [surgeCountdown, setSurgeCountdown] = useState(0);
  const [lastSurgeTime, setLastSurgeTime] = useState(Date.now());

  const { effects, addEffect } = useEffects();
  const wonRef = useRef(false);
  const logEndRef = useRef<HTMLDivElement>(null);

  const activeLogs = logsList.length > 0 ? logsList : localLogs;

  const triggerLog = useCallback((msg: string) => {
    const timeStr = new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setLocalLogs(prev => [...prev, { time: timeStr, msg }]);
  }, []);

  // Format time MM:SS
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Scroll logs to bottom
  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeLogs]);

  // Main physics loop (runs every 200ms)
  useEffect(() => {
    if (won || isGamePaused || health <= 0) return;

    const interval = setInterval(() => {
      // 1. Steam Surge Random Generator (every ~20 seconds chance)
      const now = Date.now();
      if (!surgeActive && now - lastSurgeTime > 20000 && Math.random() < 0.15) {
        setSurgeActive(true);
        setSurgeCountdown(15); // 3 seconds (15 * 200ms)
        setLastSurgeTime(now);
        triggerLog("⚠️ Pressure surge detected! Open vent valve!");
        addEffect('🚨 PRESSURE SURGE!', '#ef4444', 50, 30, true);
      }

      if (surgeActive) {
        setSurgeCountdown(prev => {
          if (prev <= 1) {
            setSurgeActive(false);
            triggerLog("✅ Pressure surge subsided.");
            return 0;
          }
          return prev - 1;
        });
      }

      // 2. Pressure physics calculation
      const surgeAdder = surgeActive ? 12 : 0;
      // Target pressure driven by fire, reduced by vent openings
      const pressureTarget = (fireIntensity * 1.6) - (ventValue * 1.5) + surgeAdder;
      
      setPressure(prev => {
        const diff = pressureTarget - prev;
        const next = Math.max(0, Math.min(200, prev + diff * 0.08 + (Math.random() - 0.5) * 1.5));
        
        // Overpressure explosion triggers at 195+ PSI
        if (next >= 195) {
          setExploded(true);
          setHealth(h => {
            const nextH = Math.max(0, h - 25);
            triggerLog("💥 Boiler Overpressure release! System took 25% damage!");
            if (nextH <= 0) {
              triggerLog("💀 Boiler exploded! Duty failed.");
              setTimeout(() => onFail?.(), 1500);
            }
            return nextH;
          });
          addEffect('💥 BOOM!', '#ef4444', 50, 45, true);
          setTimeout(() => setExploded(false), 800);
          return 90; // vent resets pressure to 90
        }
        return next;
      });

      // 3. Water level physics calculation
      // Heat evaporates water
      const evap = (fireIntensity * 0.05) + 0.04;
      // Pump stokes water
      const pumpInflow = (waterPump * 0.18);
      setWaterLevel(prev => {
        const next = Math.max(0, Math.min(100, prev - evap + pumpInflow));
        
        // Low water damage check
        if (next <= 15) {
          setHealth(h => {
            const nextH = Math.max(0, h - 0.6);
            if (nextH <= 0) {
              triggerLog("💀 Boiler cracked from dry-out! Duty failed.");
              setTimeout(() => onFail?.(), 1500);
            }
            return nextH;
          });
        }
        return next;
      });

      // 4. Overheat damage (>85 PSI equivalent, which is > 130 on our 0-200 gauge)
      setPressure(p => {
        if (p > 130) {
          setHealth(h => {
            const nextH = Math.max(0, h - 0.4);
            if (nextH <= 0) {
              triggerLog("💀 Boiler melted from overheat! Duty failed.");
              setTimeout(() => onFail?.(), 1500);
            }
            return nextH;
          });
        }
        return p;
      });

    }, 200);

    return () => clearInterval(interval);
  }, [won, isGamePaused, health, fireIntensity, ventValue, waterPump, surgeActive, lastSurgeTime, triggerLog, onFail, addEffect]);

  // Safe zone stability checker (runs every 1s)
  const isGreen = pressure >= GREEN_LOW && pressure <= GREEN_HIGH;
  const isDanger = pressure > GREEN_HIGH;
  const score = Math.round(stableTime * 82); // stable score target: 1240 max score
  const combo = stableTime >= 10 ? 3 : stableTime >= 5 ? 2 : 1;

  useEffect(() => {
    if (won || isGamePaused || health <= 0) return;

    const interval = setInterval(() => {
      // Add to sparkline chart history
      setPressureHistory(prev => [...prev.slice(-15), Math.round(pressure)]);

      if (isGreen) {
        setStableTime(prev => {
          const next = prev + 1;
          const ptsEarned = 82 * combo;
          onScoreChange?.(ptsEarned);

          if (next >= WIN_SEC && !wonRef.current) {
            wonRef.current = true;
            setWon(true);
            triggerLog("🎉 Boiler pressure stabilized! Clean run completed.");
            addEffect('✅ STABILIZED!', '#34d399', 50, 45, true);
            setTimeout(() => onWin(), 1800);
          }
          return next;
        });
      } else {
        setStableTime(0);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isGreen, pressure, won, isGamePaused, health, onScoreChange, triggerLog, onWin, combo, addEffect]);

  // Quick manual vent release wheel tap
  const handleWheelTap = () => {
    if (exploded || won) return;
    setPressure(p => Math.max(10, p - 35));
    triggerLog("💨 Release Valve operated. Venting steam.");
    addEffect('💨 Vented!', '#38bdf8', 35, 55);
  };

  // Sparkline path generator
  const getSparklinePath = () => {
    if (pressureHistory.length === 0) return '';
    const width = 120;
    const height = 40;
    const maxVal = 200;
    const points = pressureHistory.map((val, idx) => {
      const x = (idx / (pressureHistory.length - 1)) * width;
      const y = height - (val / maxVal) * height;
      return `${x},${y}`;
    });
    return `M ${points.join(' L ')}`;
  };

  return (
    <div className="w-full h-full flex select-none text-left bg-neutral-900 overflow-hidden font-sans relative"
      style={{
        background: 'radial-gradient(ellipse at 50% 30%, #201815 0%, #0d0a09 100%)',
        boxSizing: 'border-box'
      }}
    >
      <style>{`
        @keyframes furnaceFlicker {
          0%, 100% { transform: scale(1) translateY(0); filter: brightness(1); }
          50% { transform: scale(1.08) translateY(-2px); filter: brightness(1.2); }
        }
        @keyframes valveSpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(45deg); }
        }
        .furnace-fire {
          animation: furnaceFlicker 0.15s ease infinite alternate;
        }
        .valve-wheel:active {
          animation: valveSpin 0.3s linear;
        }
      `}</style>
      <EffectLayer effects={effects} />

      {/* ── COLUMN 1: LEFT SIDEBAR (CONSOLE & CONTROLS) ── */}
      <div className="w-[26%] shrink-0 flex flex-col justify-between border-r-4 border-black p-4 z-10"
        style={{
          background: 'linear-gradient(135deg, #1b1612 0%, #110e0c 100%)',
          boxShadow: 'inset -2px 0 10px rgba(0,0,0,0.5)'
        }}
      >
        <div className="space-y-4">
          {/* Live Status Card */}
          <div className="rounded-2xl border-4 border-black p-3"
            style={{
              background: 'linear-gradient(135deg, #FAF7F0, #EAE4D9)',
              color: '#1a0f00',
              boxShadow: '4px 4px 0 rgba(0,0,0,0.85)'
            }}
          >
            <span className="mg-nunito text-[8px] font-black uppercase tracking-[0.25em] text-neutral-600 block">Live Status</span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="mg-lucky text-3xl font-black">{score}</span>
              <span className="mg-lucky text-sm text-amber-600">x{combo} 🔥</span>
            </div>
            {stableTime > 0 && (
              <span className="inline-block mt-1.5 px-2 py-0.5 rounded-lg border-2 border-black bg-yellow-400 text-[8px] mg-lucky uppercase tracking-wider animate-pulse">
                STEADY HAND!
              </span>
            )}
          </div>

          {/* Time Remaining Card */}
          <div className="rounded-2xl border-4 border-black p-3 text-center"
            style={{
              background: 'linear-gradient(135deg, #0f1c24, #050a0d)',
              boxShadow: '4px 4px 0 rgba(0,0,0,0.85)'
            }}
          >
            <span className="mg-nunito text-[8px] font-black uppercase tracking-[0.25em] text-cyan-500/70 block">Time Remaining</span>
            <span className="mg-lucky text-2xl mt-1 block tracking-wider font-mono text-cyan-400"
              style={{ textShadow: '0 0 10px rgba(34,211,238,0.5)' }}
            >
              ⏱️ {formatTime(timerVal)}
            </span>
          </div>

          {/* System Hint Card */}
          <div className="rounded-2xl border-4 border-black p-3.5"
            style={{
              background: 'linear-gradient(135deg, #2b1f15, #17100b)',
              borderLeftColor: '#f59e0b',
              boxShadow: '4px 4px 0 rgba(0,0,0,0.85)'
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">🐹</span>
              <span className="mg-lucky text-[9px] uppercase tracking-wider text-amber-400">Dr. Cedric's Guide</span>
            </div>
            <p className="mg-nunito text-[10px] leading-relaxed text-amber-200/80 italic font-bold">
              {pressure > 130 ? '"Pressure is climbing fast! Open the release valve slightly to balance."'
               : waterLevel < 25 ? '"Water is boiling dry! Stoke the pump to top up."'
               : '"Adjust the fuel and vents to keep the gauge resting in the green zone."'}
            </p>
            {!hintRevealed ? (
              <button onClick={onUseHint} disabled={walletCoins < costHint}
                className="w-full mt-2.5 py-1.5 rounded-xl bg-yellow-500 hover:bg-yellow-400 disabled:opacity-40 text-black border-2 border-black shadow-[2px_2px_0_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all mg-lucky text-[9px] uppercase tracking-wider cursor-pointer text-center"
              >
                Get Hint (🪙 {costHint})
              </button>
            ) : (
              <p className="mt-2 text-[9px] text-yellow-300 font-bold bg-yellow-950/30 p-2 rounded-lg border border-yellow-500/10">
                Tip: Maintain pressure near 60 PSI for maximum combo!
              </p>
            )}
          </div>

          {/* Event Log */}
          <div className="flex flex-col gap-1">
            <span className="mg-lucky text-[9px] uppercase tracking-wider text-neutral-500 block mb-1">Event Log</span>
            <div className="h-32 rounded-2xl border-4 border-black p-2.5 overflow-y-auto custom-scrollbar font-mono text-[8px] text-emerald-400 bg-black shadow-[4px_4px_0_rgba(0,0,0,0.95)]">
              {activeLogs.length > 0 ? (
                activeLogs.map((l, idx) => (
                  <div key={idx} className="pb-0.5 border-b border-white/5 leading-normal">
                    <span className="text-neutral-600">{l.time}</span> {l.msg}
                  </div>
                ))
              ) : (
                <>
                  <div><span className="text-neutral-600">12:00</span> Geothermal system online.</div>
                  <div><span className="text-neutral-600">12:00</span> Safe pressure targets loaded.</div>
                </>
              )}
              <div ref={logEndRef} />
            </div>
          </div>
        </div>

        {/* Wallet */}
        <div className="text-[10px] text-neutral-500 border-t border-white/5 pt-3 shrink-0 font-bold flex justify-between">
          <span>WALLET</span>
          <span className="text-amber-500 font-brand">🪙 {walletCoins} Coins</span>
        </div>
      </div>

      {/* ── COLUMN 2: CENTER BOILER DEVICE ── */}
      <div className="flex-grow flex flex-col justify-between p-4 relative z-0">
        
        {/* Objective & Safe Zone status plaques */}
        <div className="flex gap-4 shrink-0 relative z-10 justify-between items-start">
          <div className="rounded-2xl border-4 border-black px-4 py-2 bg-neutral-950/60 max-w-sm flex items-center gap-2.5 shadow-[4px_4px_0_rgba(0,0,0,0.9)]">
            <span className="text-2xl shrink-0 animate-bounce">⚠️</span>
            <div className="min-w-0">
              <span className="mg-lucky text-[8.5px] uppercase tracking-wider text-amber-400 block leading-none">Objective</span>
              <p className="mg-nunito text-[10px] font-bold text-white/90 leading-tight mt-0.5">
                Keep the pressure in the <span className="text-emerald-400 font-black">green zone ({GREEN_LOW}-{GREEN_HIGH} PSI)</span>!
              </p>
            </div>
          </div>

          <div className="rounded-2xl border-4 border-black px-4 py-2.5 bg-neutral-950/80 flex flex-col items-center min-w-[200px] shadow-[4px_4px_0_rgba(0,0,0,0.9)]">
            <span className="mg-lucky text-[8px] uppercase tracking-[0.2em] text-emerald-400">Safe Zone Status</span>
            <div className="w-full h-2 rounded-full overflow-hidden bg-white/10 mt-1.5 border border-emerald-500/20">
              <div className="h-full rounded-full transition-all duration-300"
                style={{ width: `${(stableTime / WIN_SEC) * 100}%`, background: 'linear-gradient(90deg,#10b981,#34d399)' }} />
            </div>
            <span className="mg-lucky text-[9px] text-emerald-300 mt-1 leading-none">
              Stabilizing: {stableTime}s / {WIN_SEC}s
            </span>
          </div>
        </div>

        {/* The Steampunk Boiler Console */}
        <div className="flex-grow flex items-center justify-center relative py-6">
          
          {/* Main Boiler Housing Shield */}
          <div className="relative w-[340px] h-[300px] rounded-[3.5rem] border-8 border-black flex items-center justify-center shadow-[10px_10px_0_rgba(0,0,0,0.95)]"
            style={{
              background: 'radial-gradient(circle at center, #2e241c 0%, #150f0c 100%)',
            }}
          >
            {/* Stud Details */}
            {[
              'top-4 left-4', 'top-4 right-4', 'bottom-4 left-4', 'bottom-4 right-4',
              'top-4 left-[50%] -translate-x-[50%]', 'bottom-4 left-[50%] -translate-x-[50%]',
              'left-4 top-[50%] -translate-y-[50%]', 'right-4 top-[50%] -translate-y-[50%]'
            ].map((pos, i) => (
              <div key={i} className={`absolute w-3.5 h-3.5 rounded-full border-2 border-black bg-neutral-700 shadow-inner ${pos}`}
                style={{ background: 'radial-gradient(circle, #5c4e46, #1f1a17)' }} />
            ))}

            {/* ANALOG PRESSURE GAUGE */}
            <div className="w-[170px] h-[170px] rounded-full border-8 border-black flex items-center justify-center relative shadow-2xl z-10"
              style={{
                background: 'radial-gradient(circle, #fcfaf5 0%, #dfd9cc 100%)',
                boxShadow: 'inset 0 4px 15px rgba(0,0,0,0.6)'
              }}
            >
              {/* Scale Tick marks */}
              <div className="absolute inset-2 rounded-full border border-black/10 pointer-events-none" />
              
              {/* Safe green sector highlight arc */}
              <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none">
                <circle cx="85" cy="85" r="58" fill="transparent" stroke="rgba(16,185,129,0.3)" strokeWidth="8"
                  strokeDasharray={`${(GREEN_HIGH - GREEN_LOW) * 1.5} 360`}
                  strokeDashoffset={-GREEN_LOW * 1.5}
                />
                <circle cx="85" cy="85" r="58" fill="transparent" stroke="rgba(239,68,68,0.3)" strokeWidth="8"
                  strokeDasharray="180 360"
                  strokeDashoffset={-130 * 1.5}
                />
              </svg>

              {/* Gauge readings labels */}
              {[0, 50, 100, 150, 200].map((psiVal, idx) => {
                const ang = (psiVal / 200) * 270 - 135;
                const r = 40;
                const rad = (ang * Math.PI) / 180;
                const tx = Math.sin(rad) * r;
                const ty = -Math.cos(rad) * r;
                return (
                  <span key={psiVal} className="absolute mg-lucky text-[7.5px] text-[#423116] select-none"
                    style={{ transform: `translate(${tx}px, ${ty}px)` }}
                  >
                    {psiVal}
                  </span>
                );
              })}

              {/* Central text readouts */}
              <div className="absolute bottom-[44px] flex flex-col items-center select-none pointer-events-none">
                <span className="mg-lucky text-[6.5px] text-[#8c6d40] tracking-widest leading-none">PRESSURE</span>
                <span className="mg-lucky text-xs text-[#2c1d11] font-bold mt-0.5 leading-none">{Math.round(pressure)} PSI</span>
              </div>

              {/* Indicator Needle */}
              <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                <div className="relative w-1.5 h-20 -top-8 origin-bottom transition-transform duration-200 ease-out"
                  style={{
                    transform: `rotate(${((pressure - 0) / (200 - 0)) * 270 - 135}deg)`
                  }}
                >
                  {/* Needle Stem */}
                  <div className="absolute w-[2px] h-[55px] left-[2px] bg-red-600 rounded-full" />
                  <div className="absolute w-[3px] h-[10px] left-[1.5px] top-[45px] bg-black" />
                </div>
              </div>

              {/* Gauge center cap cap */}
              <div className="absolute w-4 h-4 rounded-full border-2 border-black bg-neutral-800 shadow-md z-30 pointer-events-none" />
            </div>

            {/* PRESSURE VALVE PIPE & WHEEL (LEFT) */}
            <div className="absolute -left-14 top-[50%] -translate-y-[50%] flex flex-col items-center">
              <span className="mg-lucky text-[7.5px] text-amber-200/50 uppercase tracking-wider mb-1.5">Vent Valve</span>
              <div onClick={handleWheelTap}
                className="valve-wheel w-14 h-14 rounded-full border-4 border-black flex items-center justify-center cursor-pointer shadow-lg active:scale-95 transition-transform duration-200"
                style={{
                  background: 'radial-gradient(circle, #b91c1c, #7f1d1d)',
                  boxShadow: 'inset 0 2px 6px rgba(255,255,255,0.4), 0 4px 10px rgba(0,0,0,0.6)'
                }}
              >
                {/* Spokes of valve */}
                <div className="absolute w-12 h-1 bg-black" />
                <div className="absolute w-12 h-1 bg-black rotate-90" />
                <div className="absolute w-12 h-1 bg-black rotate-45" />
                <div className="absolute w-12 h-1 bg-black -rotate-45" />
                <div className="w-5 h-5 rounded-full border-2 border-black bg-amber-400 z-10" />
              </div>
              <span className="mg-lucky text-[7px] text-neutral-400 mt-1 leading-none block">TAP WHEEL</span>
            </div>

            {/* GLOWING WATER TUBE (RIGHT) */}
            <div className="absolute -right-12 top-[44%] -translate-y-[50%] flex flex-col items-center">
              <span className="mg-lucky text-[7px] text-cyan-300/80 uppercase tracking-wider mb-1">Water level</span>
              
              {/* Glass Tube Container */}
              <div className="w-6 h-28 rounded-full border-4 border-black p-0.5 overflow-hidden flex items-end relative"
                style={{
                  background: 'linear-gradient(90deg, #1b262e, #0e1418)',
                  boxShadow: 'inset 0 0 10px rgba(0,0,0,0.8)'
                }}
              >
                {/* Glowing cyan liquid */}
                <div className="w-full rounded-b-full transition-all duration-300 relative"
                  style={{
                    height: `${waterLevel}%`,
                    background: 'linear-gradient(90deg, #06b6d4, #22d3ee, #0891b2)',
                    boxShadow: '0 0 15px #06b6d4, inset 0 2px 5px rgba(255,255,255,0.5)'
                  }}
                >
                  <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.25),transparent)] animate-pulse" />
                </div>

                {/* Level indicators */}
                <span className="absolute right-1 top-2 mg-lucky text-[6px] text-cyan-300/60 leading-none">F</span>
                <span className="absolute right-1 bottom-2 mg-lucky text-[6px] text-cyan-300/60 leading-none">L</span>
              </div>
            </div>

            {/* FURNACE FIRE DOOR (BOTTOM CENTER) */}
            <div className="absolute bottom-5 w-[110px] h-[55px] border-4 border-black rounded-t-3xl overflow-hidden flex items-end justify-center shadow-inner"
              style={{
                background: 'radial-gradient(circle at bottom, #2b0b00 0%, #0d0400 100%)',
              }}
            >
              {/* Grate bars */}
              <div className="absolute inset-0 flex justify-around px-2 pt-2 z-15 pointer-events-none">
                <div className="w-1.5 h-full bg-black rounded-full" />
                <div className="w-1.5 h-full bg-black rounded-full" />
                <div className="w-1.5 h-full bg-black rounded-full" />
              </div>

              {/* Animated flickering flame */}
              <div className="furnace-fire w-full h-[85%] rounded-t-full transition-all duration-300 flex items-end justify-center"
                style={{
                  background: 'radial-gradient(ellipse at bottom, #f97316 20%, #ef4444 60%, transparent 100%)',
                  transformOrigin: 'bottom center',
                  opacity: fireIntensity > 0 ? 0.35 + (fireIntensity / 100) * 0.65 : 0
                }}
              >
                <div className="w-12 h-10 bg-gradient-to-t from-yellow-400 to-amber-500 rounded-t-full filter blur-[1px]" />
              </div>
            </div>
          </div>

          {/* CHALKBOARD PANEL */}
          <div className="absolute bottom-1 right-2 w-[160px] rounded-2xl border-4 border-black p-2.5 rotate-2 shadow-lg hidden md:block"
            style={{
              background: '#252926',
              boxShadow: '4px 4px 0 rgba(0,0,0,0.85), inset 0 0 10px rgba(0,0,0,0.6)',
              border: '4px solid #5c432b'
            }}
          >
            <p className="font-sans text-[8.5px] leading-relaxed text-[#dfeae2]/80 font-bold italic">
              📌 Don't forget to keep the water topped up and fire steady!
            </p>
          </div>
        </div>

        {/* 🚨 EXPLODE OVERLAY */}
        {exploded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center rounded-3xl z-40"
            style={{ background: 'rgba(127,29,29,0.95)', animation: 'mgShake 0.4s ease' }}>
            <span className="text-6xl mb-2 animate-bounce">💥</span>
            <p className="mg-lucky text-rose-300 text-2xl uppercase">Overpressurized!</p>
            <p className="mg-nunito text-white/50 text-xs mt-1">Gaskets venting pressure...</p>
          </div>
        )}
      </div>

      {/* ── COLUMN 3: RIGHT SIDEBAR (STATUS & HAZARDS) ── */}
      <div className="w-[24%] shrink-0 flex flex-col justify-between border-l-4 border-black p-4 z-10"
        style={{
          background: 'linear-gradient(135deg, #1b1612 0%, #110e0c 100%)',
          boxShadow: 'inset 2px 0 10px rgba(0,0,0,0.5)'
        }}
      >
        <div className="space-y-4">
          
          {/* Boiler Health Card */}
          <div className="rounded-2xl border-4 border-black p-3"
            style={{
              background: 'linear-gradient(135deg, #2b0b0a, #140505)',
              boxShadow: '4px 4px 0 rgba(0,0,0,0.85)'
            }}
          >
            <div className="flex justify-between items-center select-none">
              <span className="mg-nunito text-[8px] font-black uppercase tracking-[0.25em] text-red-500/70">Boiler Health</span>
              <span className="mg-lucky text-[10px] text-red-400">{health}%</span>
            </div>
            <div className="w-full h-2.5 rounded-full overflow-hidden bg-white/5 mt-1.5 border border-red-500/10">
              <div className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${health}%`,
                  background: health > 50 ? 'linear-gradient(90deg, #22c55e, #4ade80)' : 'linear-gradient(90deg, #ef4444, #f87171)'
                }}
              />
            </div>
            <span className="mg-nunito text-[7.5px] font-bold text-neutral-400/75 block mt-1.5 uppercase tracking-wide">
              {health > 60 ? '💚 HEALTHY' : health > 30 ? '⚠️ WARNING' : '🚨 DANGER STATE'}
            </span>
          </div>

          {/* Hazards Monitoring */}
          <div className="space-y-2">
            <span className="mg-lucky text-[9px] uppercase tracking-wider text-neutral-500 block">Active Hazards</span>
            
            <div className="space-y-2 text-[10px]">
              {/* Overheat Hazard */}
              <div className={`flex items-center gap-2 p-2 rounded-xl border-2 transition-all duration-300 ${isDanger ? 'bg-red-500/10 border-red-500/40 text-red-300' : 'bg-neutral-900/40 border-neutral-800 text-neutral-500 opacity-60'}`}
                style={{ boxShadow: isDanger ? '0 0 10px rgba(239,68,68,0.2)' : 'none' }}
              >
                <span className="text-sm">🔥</span>
                <div className="min-w-0">
                  <span className="mg-lucky text-[7.5px] uppercase tracking-wider block">Overheat Risk</span>
                  <span className="mg-nunito text-[8px] block font-bold leading-none mt-0.5">PSI &gt; 85 for 10s = Damage</span>
                </div>
              </div>

              {/* Steam Surge */}
              <div className={`flex items-center gap-2 p-2 rounded-xl border-2 transition-all duration-300 ${surgeActive ? 'bg-orange-500/10 border-orange-500/40 text-orange-300' : 'bg-neutral-900/40 border-neutral-800 text-neutral-500 opacity-60'}`}
                style={{ boxShadow: surgeActive ? '0 0 10px rgba(249,115,22,0.2)' : 'none' }}
              >
                <span className="text-sm">💨</span>
                <div className="min-w-0">
                  <span className="mg-lucky text-[7.5px] uppercase tracking-wider block">Steam Surge</span>
                  <span className="mg-nunito text-[8px] block font-bold leading-none mt-0.5">Random surges active</span>
                </div>
              </div>

              {/* Low Water */}
              <div className={`flex items-center gap-2 p-2 rounded-xl border-2 transition-all duration-300 ${waterLevel < 25 ? 'bg-blue-500/10 border-blue-500/40 text-blue-300' : 'bg-neutral-900/40 border-neutral-800 text-neutral-500 opacity-60'}`}
                style={{ boxShadow: waterLevel < 25 ? '0 0 10px rgba(59,130,246,0.2)' : 'none' }}
              >
                <span className="text-sm">💧</span>
                <div className="min-w-0">
                  <span className="mg-lucky text-[7.5px] uppercase tracking-wider block">Low Water</span>
                  <span className="mg-nunito text-[8px] block font-bold leading-none mt-0.5">Water too low dry-out</span>
                </div>
              </div>
            </div>
          </div>

          {/* Active Boosts */}
          <div className="space-y-2">
            <span className="mg-lucky text-[9px] uppercase tracking-wider text-neutral-500 block">Active Boosts</span>
            
            <div className="space-y-2 text-[10px]">
              <div className="flex items-center gap-2 p-2 rounded-xl bg-indigo-500/10 border-2 border-indigo-500/30 text-indigo-300">
                <span className="text-sm">⏱️</span>
                <div className="min-w-0">
                  <span className="mg-lucky text-[7.5px] uppercase tracking-wider block">Extra Time</span>
                  <span className="mg-nunito text-[8px] block font-bold leading-none mt-0.5">+30s active duration</span>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2 rounded-xl bg-emerald-500/10 border-2 border-emerald-500/30 text-emerald-300">
                <span className="text-sm">🧤</span>
                <div className="min-w-0">
                  <span className="mg-lucky text-[7.5px] uppercase tracking-wider block">Steady Hands</span>
                  <span className="mg-nunito text-[8px] block font-bold leading-none mt-0.5">Better slider accuracy</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Console Action Buttons */}
        <div className="flex gap-2 pt-3 border-t border-white/5 shrink-0 select-none">
          <button onClick={() => setIsPaused?.(!isGamePaused)}
            className="flex-1 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black border-2 border-black shadow-[2px_2px_0_rgba(0,0,0,1)] active:scale-95 transition-all mg-lucky text-[9.5px] uppercase tracking-wider cursor-pointer text-center"
          >
            {isGamePaused ? "▶️ Resume" : "⏸️ Pause"}
          </button>
          <button onClick={requestEarlyExit}
            className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-black border-2 border-black shadow-[2px_2px_0_rgba(0,0,0,1)] active:scale-95 transition-all mg-lucky text-[9.5px] uppercase tracking-wider cursor-pointer text-center"
          >
            🚪 Quit
          </button>
        </div>
      </div>

      {/* ── BOTTOM CONTROL BAR (HORIZONTAL PANEL) ── */}
      <div className="absolute bottom-0 left-0 right-0 h-24 border-t-4 border-black p-3.5 z-20 flex justify-between gap-4 select-none"
        style={{
          background: 'linear-gradient(180deg, #1b1612 0%, #110e0c 100%)',
          boxShadow: '0 -4px 15px rgba(0,0,0,0.6)'
        }}
      >
        {/* Slider 1: Vent Valve */}
        <div className="flex-1 flex flex-col justify-between">
          <div className="flex justify-between items-center text-[7.5px] mg-lucky text-amber-500/70">
            <span>CLOSED</span>
            <span>💨 VENT VALVE ({ventValue}%)</span>
            <span>OPEN</span>
          </div>
          <input type="range" min="0" max="100" value={ventValue} onChange={e => setVentValue(parseInt(e.target.value))}
            className="w-full accent-amber-500 bg-neutral-900 border border-black rounded-lg cursor-pointer h-2 mt-1" />
        </div>

        {/* Indicator 2: Current Pressure Sparkline Chart */}
        <div className="w-[180px] shrink-0 border-2 border-black rounded-2xl p-2 flex items-center justify-between gap-2 bg-black shadow-inner">
          <div className="shrink-0 flex flex-col justify-center min-w-[70px]">
            <span className="mg-nunito text-[7.5px] font-black uppercase tracking-[0.1em] text-neutral-600 leading-none">PRESSURE</span>
            <span className={`mg-lucky text-base mt-1 leading-none ${isDanger ? 'text-red-400 animate-pulse' : isGreen ? 'text-emerald-400' : 'text-amber-400'}`}>
              {Math.round(pressure)} PSI
            </span>
          </div>
          
          {/* Sparkline chart SVG */}
          <div className="flex-1 h-10 relative overflow-hidden bg-neutral-950 rounded-lg border border-white/5">
            <svg className="w-full h-full" viewBox="0 0 120 40">
              {/* Green Safe Zone Indicator Lines */}
              <line x1="0" y1={40 - (GREEN_LOW/200)*40} x2="120" y2={40 - (GREEN_LOW/200)*40} stroke="rgba(16,185,129,0.2)" strokeWidth="1" strokeDasharray="3,3" />
              <line x1="0" y1={40 - (GREEN_HIGH/200)*40} x2="120" y2={40 - (GREEN_HIGH/200)*40} stroke="rgba(16,185,129,0.2)" strokeWidth="1" strokeDasharray="3,3" />
              <path d={getSparklinePath()} fill="none" stroke={isDanger ? '#f87171' : isGreen ? '#34d399' : '#fbbf24'} strokeWidth="1.5" />
            </svg>
          </div>
        </div>

        {/* Display 3: Combo Box */}
        <div className="w-[70px] shrink-0 border-2 border-black rounded-2xl flex flex-col items-center justify-center bg-black/40 shadow-inner">
          <span className="mg-nunito text-[7.5px] font-black uppercase text-neutral-600 leading-none">COMBO</span>
          <span className="mg-lucky text-2xl text-amber-400 mt-1 leading-none">x{combo}</span>
        </div>

        {/* Slider 4: Fire Intensity (Stoker) */}
        <div className="flex-1 flex flex-col justify-between">
          <div className="flex justify-between items-center text-[7.5px] mg-lucky text-orange-500/70">
            <span>LOW</span>
            <span>🔥 FIRE INTENSITY ({fireIntensity}%)</span>
            <span>HIGH</span>
          </div>
          <input type="range" min="0" max="100" value={fireIntensity} onChange={e => setFireIntensity(parseInt(e.target.value))}
            className="w-full accent-orange-500 bg-neutral-900 border border-black rounded-lg cursor-pointer h-2 mt-1" />
        </div>

        {/* Slider 5: Water Pump */}
        <div className="flex-1 flex flex-col justify-between">
          <div className="flex justify-between items-center text-[7.5px] mg-lucky text-cyan-500/70">
            <span>MIN</span>
            <span>💧 WATER PUMP ({waterPump}%)</span>
            <span>MAX</span>
          </div>
          <input type="range" min="0" max="100" value={waterPump} onChange={e => setWaterPump(parseInt(e.target.value))}
            className="w-full accent-cyan-500 bg-neutral-900 border border-black rounded-lg cursor-pointer h-2 mt-1" />
        </div>

      </div>
    </div>
  );
}
