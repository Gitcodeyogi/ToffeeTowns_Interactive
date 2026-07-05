// AfterHoursBakery.tsx  — v2  (15-minute session)
// ─────────────────────────────────────────────────────────────────────────────
// Phase system + Order waves + Flash orders + Pause + Hint icon
// Phase 1 (0–5 min)  : Open Kitchen   — 3 orders,  normal drift
// Phase 2 (5–10 min) : Midnight Rush  — 4 orders,  drift ×1.2, 1 golden
// Phase 3 (10–14 min): Deep Night     — 5 orders,  drift ×1.4, 2 golden
// Phase 4 (last 60s) : CHAOS          — drift ×2,  bake ×1.5
// Flash orders at 7-min and 12-min marks (45s window, 3× score)
// ─────────────────────────────────────────────────────────────────────────────
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { FONT } from '../../../lib/uiConstants';
import { useTTStore } from '../../../store/useTTStore';
import { pickRotatingWallpaper } from '../../../constants/wallpapers';
import type { OvenState, OrderGroup, GameEvent, PulledItem } from './bakeryTypes';
import { RECIPES, POSSIBLE_EVENTS, AFTER_HOURS_ORDER_POOL } from './bakeryData';
import {
  shuffle, makeOven, faceFor, qualityFor, starsFor, qualityLabel,
  tempColor, tempBarColor, formatTime, scoreForQuality,
  GOLDEN_START, GOLDEN_END, PREHEAT_TICKS, DRIFT_EVERY,
  AFTER_HOURS_ENTRY_FEE, AFTER_HOURS_SECONDS,
  AFTER_HOURS_PHASE2_AT, AFTER_HOURS_PHASE3_AT, AFTER_HOURS_PHASE4_AT,
  FLASH_ORDER_1_AT, FLASH_ORDER_2_AT, FLASH_ORDER_DURATION,
  getTodayModifiers,
  loadBakeryStats, saveBakeryStats, mergeBakeryStats,
} from './bakeryEngine';
import { BAKERY_ACHIEVEMENTS } from './bakeryData';
import { HintPanel } from './HintPanel';
import type { ActiveHints } from './HintPanel';
import { ComboMeter, ScoreDisplay } from './ComboMeter';
import { AfterHoursResult } from './AfterHoursResult';
import { EventPopup } from './BakeryShift';

// ── Types ─────────────────────────────────────────────────────────────────────
type AfterPhase = 1 | 2 | 3 | 4;

interface FlashOrder {
  id: string; icon: string; customer: string; category: 'pastry' | 'dessert' | 'loaf';
  need: number; done: number; timeLeft: number; active: boolean;
}

interface AfterHoursBakeryProps { onClose: () => void; }

// ── Wave builder ──────────────────────────────────────────────────────────────
function buildWave(wave: 1 | 2 | 3): OrderGroup[] {
  const pool = shuffle([...AFTER_HOURS_ORDER_POOL]);
  const count = wave === 1 ? 3 : wave === 2 ? 4 : 5;
  const goldenCount = wave === 1 ? 0 : wave === 2 ? 1 : 2;
  return pool.slice(0, count).map((o, i) => ({
    ...o, done: 0, comment: '', face: '😊', patience: 100,
    isGolden: i < goldenCount,
  }));
}

// ── Flash order pool ──────────────────────────────────────────────────────────
const FLASH_POOL = [
  { id:'flash1', customer:'Midnight Express 🚂', icon:'🚂', category:'loaf'   as const, need:2 },
  { id:'flash2', customer:'Palace Kitchen 🏰',   icon:'🏰', category:'pastry' as const, need:2 },
  { id:'flash3', customer:'Opera House 🎭',       icon:'🎭', category:'dessert'as const, need:2 },
];

// ── Phase config ──────────────────────────────────────────────────────────────
const PHASE_CONFIG: Record<AfterPhase, {
  name: string; icon: string;
  accentColor: string; borderColor: string;
  driftMult: number; bakeSpeedMult: number;
  eventIntervalTicks: number;
}> = {
  1: { name: 'Open Kitchen',  icon: '🌿', accentColor: '#10b981', borderColor: 'rgba(16,185,129,0.25)', driftMult:1.0, bakeSpeedMult:1.0, eventIntervalTicks:450 },
  2: { name: 'Midnight Rush', icon: '🌙', accentColor: '#6366f1', borderColor: 'rgba(99,102,241,0.30)', driftMult:1.2, bakeSpeedMult:1.1, eventIntervalTicks:300 },
  3: { name: 'Deep Night',    icon: '🔥', accentColor: '#f59e0b', borderColor: 'rgba(245,158,11,0.30)', driftMult:1.4, bakeSpeedMult:1.2, eventIntervalTicks:225 },
  4: { name: 'CHAOS!',        icon: '⛈️', accentColor: '#ef4444', borderColor: 'rgba(239,68,68,0.45)', driftMult:2.0, bakeSpeedMult:1.5, eventIntervalTicks:150 },
};

// ── Phase announcement banner ─────────────────────────────────────────────────
const PhaseBanner: React.FC<{ phase: AfterPhase }> = ({ phase }) => {
  const cfg = PHASE_CONFIG[phase];
  const [visible, setVisible] = useState(true);
  useEffect(() => { const t = setTimeout(() => setVisible(false), 3200); return () => clearTimeout(t); }, [phase]);
  if (!visible) return null;
  return (
    <div className="absolute top-14 left-1/2 -translate-x-1/2 z-30 pointer-events-none animate-fade-in">
      <div className="px-8 py-3 rounded-2xl border text-center"
        style={{ borderColor: cfg.borderColor, background: 'rgba(5,2,0,0.92)', boxShadow: `0 0 40px ${cfg.accentColor}33` }}>
        <p className="text-xs font-black uppercase tracking-[0.3em]" style={{ color: cfg.accentColor }}>
          {cfg.icon} Phase {phase}: {cfg.name}
        </p>
        {phase === 2 && <p className="text-[10px] text-white/50 mt-0.5">New wave of orders! Drift increasing.</p>}
        {phase === 3 && <p className="text-[10px] text-white/50 mt-0.5">Deep Night — VIP orders active. Stay sharp!</p>}
        {phase === 4 && <p className="text-[10px] text-white/50 mt-0.5">🔥 CHAOS — everything speeds up. Final minute!</p>}
      </div>
    </div>
  );
};

// ── Wave complete banner ──────────────────────────────────────────────────────
const WaveBanner: React.FC<{ wave: number; bonus: number }> = ({ wave, bonus }) => {
  const [visible, setVisible] = useState(true);
  useEffect(() => { const t = setTimeout(() => setVisible(false), 2800); return () => clearTimeout(t); }, [wave]);
  if (!visible) return null;
  return (
    <div className="absolute top-28 left-1/2 -translate-x-1/2 z-30 pointer-events-none animate-fade-in">
      <div className="px-6 py-2.5 rounded-2xl border border-emerald-500/40 text-center"
        style={{ background: 'rgba(2,12,5,0.95)', boxShadow: '0 0 30px rgba(16,185,129,0.25)' }}>
        <p className="text-xs font-black text-emerald-400 uppercase tracking-widest">✅ Wave {wave} Complete! +{bonus} pts</p>
        {wave < 3 && <p className="text-[10px] text-white/45 mt-0.5">New orders incoming…</p>}
      </div>
    </div>
  );
};

// ── Flash order notice ────────────────────────────────────────────────────────
const FlashOrderBadge: React.FC<{ flash: FlashOrder; onFill?: () => void }> = ({ flash }) => {
  const pct = (flash.timeLeft / FLASH_ORDER_DURATION) * 100;
  return (
    <div className="animate-fade-in p-2.5 rounded-2xl border border-yellow-400/50 bg-yellow-950/25"
      style={{ boxShadow: '0 0 20px rgba(234,179,8,0.2)' }}>
      <div className="flex items-center justify-between mb-1">
        <p className="text-[9px] font-black uppercase text-yellow-400 tracking-widest">⚡ Flash Order!</p>
        <p className="text-[9px] font-mono text-yellow-300">{flash.timeLeft}s · 3×pts</p>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-lg">{flash.icon}</span>
        <div className="flex-1">
          <p className="text-[10px] font-black text-white">{flash.customer}</p>
          <p className="text-[9px] text-white/40">{flash.need} {flash.category}s → {flash.done}/{flash.need}</p>
        </div>
      </div>
      <div className="h-1.5 bg-white/8 rounded-full mt-1.5 overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: pct < 30 ? '#ef4444' : '#eab308' }} />
      </div>
    </div>
  );
};

// ── Pause Panel ───────────────────────────────────────────────────────────────
const PausePanel: React.FC<{
  phase: AfterPhase; score: number; timeLeft: number;
  onResume: () => void; onQuit: () => void;
}> = ({ phase, score, timeLeft, onResume, onQuit }) => {
  const cfg = PHASE_CONFIG[phase];
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="max-w-3xl w-full mx-4 animate-fade-in overflow-hidden"
        style={{ borderRadius: '2.5rem', border: `1px solid ${cfg.borderColor}`, background: 'rgba(8,3,15,0.98)',
          boxShadow: `0 0 60px ${cfg.accentColor}22` }}>
        <div className="h-1 rounded-t-[2.5rem]" style={{ background: `linear-gradient(90deg, transparent, ${cfg.accentColor}, transparent)` }} />
        <div className="p-8 space-y-6">
          <div className="text-center">
            <p className="text-[10px] uppercase tracking-[0.35em] text-white/30 font-black">PAUSED</p>
            <h2 className="text-4xl font-black text-white mt-1" style={{ fontFamily: FONT }}>⏸ After-Hours</h2>
            <p className="text-sm text-white/40 mt-1">{cfg.icon} {cfg.name} · Score: {score.toLocaleString()} · {formatTime(timeLeft)} left</p>
          </div>

          <div className="space-y-2">
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/25 font-black">Quick Reference</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                ['🟡', 'Golden Zone (72–90%)', 'Pull as soon as bar enters golden range'],
                ['🌡️', 'Temperature drift',     'Adjust every few seconds — it drifts on its own'],
                ['🔥', 'Burns',                  'Costs −50pts each. Pull early when unsure.'],
                ['⚡', 'Flash Orders',           'Appear twice per session — 3× score for 45s'],
                ['🍬', 'Sugar Rush',             '5 perfect bakes in a row → 1.5× bake speed'],
                ['🛒', 'Bakery Shelf',           'Spend coins for Freeze Oven, Auto Stir, Lucky Clover'],
              ].map(([icon, title, desc]) => (
                <div key={title} className="flex gap-3 p-3 bg-white/3 border border-white/6 rounded-2xl">
                  <span className="text-lg shrink-0">{icon}</span>
                  <div>
                    <p className="text-[12px] font-black text-white">{title}</p>
                    <p className="text-[11px] text-white/40 leading-snug">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/25 font-black">Phases tonight</p>
            <div className="grid grid-cols-2 gap-3">
              {(Object.entries(PHASE_CONFIG) as [string, typeof PHASE_CONFIG[1]][]).map(([p, c]) => (
                <div key={p} className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl border ${Number(p) === phase ? 'border-white/20 bg-white/6' : 'border-white/5'}`}>
                  <span className="text-base">{c.icon}</span>
                  <p className="text-[12px] font-bold text-white flex-1">Phase {p}: {c.name}</p>
                  {Number(p) < phase && <span className="text-[10px] text-emerald-400 font-black">✓ Done</span>}
                  {Number(p) === phase && <span className="text-[10px] font-black animate-pulse" style={{ color: c.accentColor }}>NOW</span>}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button onClick={onQuit}
              className="py-3 rounded-xl border border-white/10 text-white/50 text-sm font-bold hover:bg-white/5 transition cursor-pointer"
              style={{ fontFamily: 'Georgia,serif', fontStyle: 'italic' }}>
              Quit Session
            </button>
            <button onClick={onResume}
              className="py-3 rounded-xl font-black text-sm text-white cursor-pointer hover:scale-[1.02] transition-all"
              style={{ fontFamily: 'Josefin Sans,sans-serif',
                background: `linear-gradient(135deg, ${cfg.accentColor}, ${cfg.accentColor}99)`,
                boxShadow: `0 0 20px ${cfg.accentColor}44` }}>
              ▶ Resume
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
export const AfterHoursBakery: React.FC<AfterHoursBakeryProps> = ({ onClose }) => {
  const { spendCoins } = useTTStore();
  const coins = useTTStore(s => s.coins ?? 0);

  const modifiers = useMemo(() => getTodayModifiers(), []);
  const freeAutoStir = modifiers.some(m => m.id === 'apprentice');

  const [gameState, setGameState] = useState<'gate' | 'playing' | 'result'>('gate');
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(false);
  const [, forceUpdate] = useState(0);

  // ── Phase + Wave state ─────────────────────────────────────────────────────
  const [phase, setPhase]               = useState<AfterPhase>(1);
  const [phaseChanged, setPhaseChanged] = useState<AfterPhase | null>(null);
  const [waveCompleted, setWaveCompleted] = useState<{wave:number;bonus:number}|null>(null);
  const currentWave = useRef<1|2|3>(1);
  const phaseRef    = useRef<AfterPhase>(1);

  // ── Flash orders ───────────────────────────────────────────────────────────
  const [flashOrder, setFlashOrder]     = useState<FlashOrder | null>(null);
  const flashRef    = useRef<FlashOrder | null>(null);
  const flash1Fired = useRef(false);
  const flash2Fired = useRef(false);

  // ── Game refs ──────────────────────────────────────────────────────────────
  const ovensRef        = useRef<OvenState[]>([makeOven(), makeOven(), makeOven(), makeOven()]);
  const ordersRef       = useRef<OrderGroup[]>([]);
  const tickRef         = useRef(0);
  const timeRef         = useRef(AFTER_HOURS_SECONDS);
  const burnsRef        = useRef(0);
  const comboRef        = useRef(0);
  const comboMaxRef     = useRef(0);
  const scoreRef        = useRef(0);
  const sugarRushFill   = useRef(0);
  const sugarRushTicks  = useRef(0);
  const pulledItemsRef  = useRef<PulledItem[]>([]);
  const goldenOrdersRef = useRef(0);
  const nextEventTick   = useRef(300);
  const gamePhaseRef    = useRef<'playing'|'event'>('playing');
  const calledEnd       = useRef(false);
  const startTimeRef    = useRef(Date.now());
  const recipeQueue     = useRef<typeof RECIPES[0][]>(shuffle([...RECIPES]));
  const nextRecipeIdx   = useRef(0);
  const luckyClover     = useRef(false);
  const waveBonuses     = useRef([150, 300, 500]);

  // ── Display state ──────────────────────────────────────────────────────────
  const [timeLeft, setTimeLeft]         = useState(AFTER_HOURS_SECONDS);
  const [logLines, setLogLines]         = useState<string[]>(['🌙 The bakery is yours. 15 minutes. Make it count.']);
  const [activeEvent, setActiveEvent]   = useState<GameEvent | null>(null);
  const [activeHints, setActiveHints]   = useState<ActiveHints>({
    freezeOven: false, masterTimer: false, chefAssist: false,
    instantClean: false, luckyClover: false, autoStir: false,
  });
  const [sugarRushFillPct, setSugarRushFillPct] = useState(0);
  const [sugarRushActive, setSugarRushActive]   = useState(false);
  const [scoreDisplay, setScoreDisplay]         = useState(0);
  const [personalBest] = useState(() => loadBakeryStats().lifetimeBestScore);

  const addLog = useCallback((msg: string) => setLogLines(p => [msg, ...p].slice(0, 16)), []);

  // ── Toggle pause ───────────────────────────────────────────────────────────
  const togglePause = useCallback(() => {
    setPaused(p => { pausedRef.current = !p; return !p; });
  }, []);

  // ── Load recipe into oven ──────────────────────────────────────────────────
  const loadInto = useCallback((idx: number) => {
    const q = recipeQueue.current;
    const r = q[nextRecipeIdx.current % q.length];
    nextRecipeIdx.current++;
    ovensRef.current[idx] = {
      ...makeOven(), recipe: r, currentTemp: 60 + Math.floor(Math.random() * 20),
      status: 'preheating', lastDriftTick: tickRef.current,
    };
    addLog(`Oven ${idx + 1}: ${r.name} loaded`);
  }, [addLog]);

  // ── Load new order wave ────────────────────────────────────────────────────
  const loadWave = useCallback((wave: 1|2|3, bonus: number) => {
    ordersRef.current = buildWave(wave);
    currentWave.current = wave;
    scoreRef.current += bonus;
    setScoreDisplay(scoreRef.current);
    setWaveCompleted({ wave: wave - 1, bonus });
    addLog(`🌊 Wave ${wave} orders loaded! (+${bonus} pts wave bonus)`);
    setTimeout(() => setWaveCompleted(null), 3000);
  }, [addLog]);

  // ── Adjust temp ────────────────────────────────────────────────────────────
  const adjustTemp = useCallback((idx: number, delta: number) => {
    const o = ovensRef.current[idx];
    if (!o.recipe || ['empty','burnt','done'].includes(o.status)) return;
    ovensRef.current[idx] = { ...o, currentTemp: Math.max(50, Math.min(250, o.currentTemp + delta)) };
    forceUpdate(n => n + 1);
  }, []);

  // ── Pull item ──────────────────────────────────────────────────────────────
  const pullOut = useCallback((idx: number) => {
    if (gamePhaseRef.current !== 'playing' || pausedRef.current) return;
    const o = ovensRef.current[idx];
    if (o.status !== 'golden' || !o.recipe) return;

    const diff = o.currentTemp - o.recipe.requiredTemp;
    const quality = qualityFor(diff, o.bakeProgress);
    const ql = qualityLabel(quality);

    // Check flash order first
    let isFlash = false;
    if (flashRef.current?.active && flashRef.current.category === o.recipe.category && flashRef.current.done < flashRef.current.need) {
      flashRef.current = { ...flashRef.current, done: flashRef.current.done + 1 };
      setFlashOrder({ ...flashRef.current });
      isFlash = true;
      addLog(`⚡ Flash Order filled! (${flashRef.current.done}/${flashRef.current.need})`);
    }

    // Check regular order
    const matchOrder = ordersRef.current.find(ord => ord.category === o.recipe!.category && ord.done < ord.need);
    const isGolden = matchOrder?.isGolden ?? luckyClover.current;
    luckyClover.current = false;

    if (matchOrder) matchOrder.done++;

    // Score
    const flashMult = isFlash ? 3 : 1;
    const modMult = modifiers.reduce((m, mod) => m * (mod.effects.scoreMultiplier ?? 1), 1);
    const comboMult = comboRef.current >= 3 ? 1.5 : 1;
    const pts = scoreForQuality(quality, isGolden, comboMult * flashMult, modMult);
    scoreRef.current += pts;
    setScoreDisplay(scoreRef.current);

    addLog(`${ql.icon} ${ql.label} — ${o.recipe.name} +${pts}pts${isFlash ? ' ⚡3×' : ''}${isGolden ? ' 🌟' : ''}`);

    if (quality === 'perfect' || quality === 'great') {
      comboRef.current++;
      if (comboRef.current > comboMaxRef.current) comboMaxRef.current = comboRef.current;
      if (comboRef.current >= 3) addLog(`🔥 COMBO ×${comboRef.current}!`);
    } else { comboRef.current = 0; }

    if (quality === 'perfect') {
      sugarRushFill.current = Math.min(100, sugarRushFill.current + 20);
      setSugarRushFillPct(sugarRushFill.current);
      if (sugarRushFill.current >= 100 && !sugarRushTicks.current) {
        sugarRushTicks.current = 250; setSugarRushActive(true);
        addLog('🍬 SUGAR RUSH! 1.5× bake speed for 10 seconds!');
        sugarRushFill.current = 0; setSugarRushFillPct(0);
      }
    }

    if (isGolden && matchOrder) goldenOrdersRef.current++;
    pulledItemsRef.current.push({ quality, recipeName: o.recipe.name });

    ovensRef.current[idx] = { ...makeOven(), status: 'done', feedback: { quality, name: o.recipe.name }, pulledQuality: quality };
    setTimeout(() => { if (ovensRef.current[idx].status === 'done') { ovensRef.current[idx] = makeOven(); forceUpdate(n => n + 1); } }, 2000);
    forceUpdate(n => n + 1);

    // Check wave completion
    const allDone = ordersRef.current.every(o => o.done >= o.need);
    if (allDone && currentWave.current < 3) {
      const nextWave = (currentWave.current + 1) as 2|3;
      setTimeout(() => loadWave(nextWave, waveBonuses.current[nextWave - 1]), 800);
    }
  }, [modifiers, addLog, loadWave]);

  // ── Hint handler ───────────────────────────────────────────────────────────
  const handleHint = useCallback((hint: keyof ActiveHints, cost: number) => {
    if (cost > 0) spendCoins(cost, `After-Hours hint: ${hint}`);
    if (hint === 'freezeOven') {
      ovensRef.current = ovensRef.current.map(o => ({ ...o, frozen: true }));
      setActiveHints(h => ({ ...h, freezeOven: true }));
      setTimeout(() => { ovensRef.current = ovensRef.current.map(o => ({ ...o, frozen: false })); setActiveHints(h => ({ ...h, freezeOven: false })); }, 5000);
    } else if (hint === 'masterTimer') {
      ovensRef.current = ovensRef.current.map(o => ({ ...o, masterTimer: true }));
      setActiveHints(h => ({ ...h, masterTimer: true }));
      setTimeout(() => { ovensRef.current = ovensRef.current.map(o => ({ ...o, masterTimer: false })); setActiveHints(h => ({ ...h, masterTimer: false })); }, 10000);
    } else if (hint === 'chefAssist') {
      if (activeEvent) { setActiveEvent(null); gamePhaseRef.current = 'playing'; scoreRef.current += 50; setScoreDisplay(scoreRef.current); addLog('👨‍🍳 Chef Assist! +50pts'); }
      setActiveHints(h => ({ ...h, chefAssist: false }));
    } else if (hint === 'luckyClover') {
      luckyClover.current = true; setActiveHints(h => ({ ...h, luckyClover: false })); addLog('🍀 Next order is GOLDEN!');
    } else if (hint === 'autoStir') {
      const emptyIdx = ovensRef.current.findIndex(o => o.status === 'empty');
      if (emptyIdx >= 0) { loadInto(emptyIdx); forceUpdate(n => n + 1); }
      setActiveHints(h => ({ ...h, autoStir: false }));
    } else if (hint === 'instantClean') {
      setActiveHints(h => ({ ...h, instantClean: false })); addLog('🧹 Cleaned!');
    }
    forceUpdate(n => n + 1);
  }, [spendCoins, activeEvent, loadInto, addLog]);

  // ── Event choice ───────────────────────────────────────────────────────────
  const handleEventChoice = useCallback((good: boolean) => {
    setActiveEvent(null);
    gamePhaseRef.current = 'playing';
    nextEventTick.current = tickRef.current + PHASE_CONFIG[phaseRef.current].eventIntervalTicks;
    if (good) { scoreRef.current += 25; setScoreDisplay(scoreRef.current); addLog('✅ Good call! +25pts'); }
    else { ordersRef.current.forEach(o => { o.patience = Math.max(0, o.patience - 15); }); addLog('⚠️ Kitchen took a hit.'); }
    forceUpdate(n => n + 1);
  }, [addLog]);

  // ── End game ───────────────────────────────────────────────────────────────
  const endGame = useCallback(() => {
    if (calledEnd.current) return;
    calledEnd.current = true;
    const mins = Math.round((Date.now() - startTimeRef.current) / 60000);
    const perfects = pulledItemsRef.current.filter(p => p.quality === 'perfect').length;
    const stats = loadBakeryStats();
    const newStats = mergeBakeryStats(stats, perfects, burnsRef.current, comboMaxRef.current, scoreRef.current, goldenOrdersRef.current, mins, false);
    BAKERY_ACHIEVEMENTS.forEach(a => {
      if (!newStats.earnedAchievements.includes(a.id) && a.check(newStats, burnsRef.current, comboMaxRef.current)) {
        newStats.earnedAchievements.push(a.id);
      }
    });
    saveBakeryStats(newStats);
    setGameState('result');
  }, []);

  // ── Enter game ─────────────────────────────────────────────────────────────
  const enterGame = useCallback(() => {
    spendCoins(AFTER_HOURS_ENTRY_FEE, 'After-Hours Bakery — Ganache Grove');
    ordersRef.current = buildWave(1);
    startTimeRef.current = Date.now();
    setGameState('playing');
  }, [spendCoins]);

  // ── Game loop ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (gameState !== 'playing') return;
    loadInto(0); setTimeout(() => loadInto(1), 400);
    setTimeout(() => loadInto(2), 800); setTimeout(() => loadInto(3), 1200);

    const interval = setInterval(() => {
      if (calledEnd.current) { clearInterval(interval); return; }
      if (pausedRef.current || gamePhaseRef.current !== 'playing') return;

      tickRef.current++;
      const tick = tickRef.current;

      // Sugar Rush countdown
      if (sugarRushTicks.current > 0) { sugarRushTicks.current--; if (!sugarRushTicks.current) setSugarRushActive(false); }

      // Flash order timer
      if (flashRef.current?.active) {
        const fl = { ...flashRef.current, timeLeft: flashRef.current.timeLeft - (tick % 5 === 0 ? 1 : 0) };
        if (tick % 5 === 0) {
          if (fl.timeLeft <= 0) {
            flashRef.current = null; setFlashOrder(null);
            if (fl.done < fl.need) addLog('⚡ Flash Order expired — missed!');
          } else {
            flashRef.current = fl; setFlashOrder(fl);
          }
        }
      }

      // Countdown
      if (tick % 5 === 0) {
        timeRef.current = Math.max(0, timeRef.current - 1);
        const tLeft = timeRef.current;
        setTimeLeft(tLeft);

        // Phase transitions
        const newPhase: AfterPhase =
          tLeft <= AFTER_HOURS_PHASE4_AT ? 4 :
          tLeft <= AFTER_HOURS_PHASE3_AT ? 3 :
          tLeft <= AFTER_HOURS_PHASE2_AT ? 2 : 1;

        if (newPhase !== phaseRef.current) {
          phaseRef.current = newPhase;
          setPhase(newPhase);
          setPhaseChanged(newPhase);
          nextEventTick.current = tickRef.current + PHASE_CONFIG[newPhase].eventIntervalTicks;
          // Load wave 2 at phase 2, wave 3 at phase 3
          if (newPhase === 2 && currentWave.current === 1) {
            loadWave(2, waveBonuses.current[1]);
          } else if (newPhase === 3 && currentWave.current === 2) {
            loadWave(3, waveBonuses.current[2]);
          }
          setTimeout(() => setPhaseChanged(null), 3500);
          addLog(`${PHASE_CONFIG[newPhase].icon} Phase ${newPhase}: ${PHASE_CONFIG[newPhase].name} begins!`);
        }

        // Flash orders
        if (!flash1Fired.current && tLeft <= FLASH_ORDER_1_AT) {
          flash1Fired.current = true;
          const fo = FLASH_POOL[0];
          const newFlash: FlashOrder = { ...fo, done: 0, timeLeft: FLASH_ORDER_DURATION, active: true };
          flashRef.current = newFlash; setFlashOrder(newFlash);
          addLog('⚡ FLASH ORDER appeared! 45 seconds — 3× score!');
        }
        if (!flash2Fired.current && tLeft <= FLASH_ORDER_2_AT) {
          flash2Fired.current = true;
          const fo = FLASH_POOL[1 + Math.floor(Math.random() * 2)];
          const newFlash: FlashOrder = { ...fo, done: 0, timeLeft: FLASH_ORDER_DURATION, active: true };
          flashRef.current = newFlash; setFlashOrder(newFlash);
          addLog('⚡ Second FLASH ORDER! Final stretch — 3× score!');
        }

        // Patient update
        const elapsed = AFTER_HOURS_SECONDS - tLeft;
        ordersRef.current.forEach(o => { if (o.done < o.need) o.patience = Math.max(0, 100 - (elapsed / AFTER_HOURS_SECONDS) * 90); });

        if (tLeft <= 0) { endGame(); return; }
      }

      // Events
      if (tick >= nextEventTick.current && !activeEvent && !pausedRef.current) {
        const pool = POSSIBLE_EVENTS;
        const ev = pool[Math.floor(Math.random() * pool.length)];
        setActiveEvent({ ...ev, resolved: false });
        gamePhaseRef.current = 'event';
        addLog(`🔔 ${ev.title}`);
      }

      // Oven updates
      const pCfg = PHASE_CONFIG[phaseRef.current];
      const driftMult = modifiers.reduce((m, mod) => m * (mod.effects.driftMultiplier ?? 1), pCfg.driftMult);

      let any = false;
      ovensRef.current = ovensRef.current.map((oven, idx) => {
        if (oven.status === 'empty') {
          setTimeout(() => { if (ovensRef.current[idx].status === 'empty' && !calledEnd.current && !pausedRef.current) { loadInto(idx); forceUpdate(n => n + 1); } }, 350);
          return oven;
        }
        if (oven.status === 'done' || oven.status === 'burnt') return oven;
        const u = { ...oven }; any = true;

        if (oven.status === 'preheating') {
          u.preheatProgress = Math.min(100, oven.preheatProgress + (100 / PREHEAT_TICKS));
          if (oven.recipe) { const rise = (oven.recipe.requiredTemp - oven.currentTemp) * 0.12; u.currentTemp = Math.min(oven.recipe.requiredTemp + 8, oven.currentTemp + Math.max(1, rise)); }
          if (u.preheatProgress >= 100) u.status = 'baking';
          return u;
        }

        if (oven.status === 'baking' || oven.status === 'golden') {
          if (!oven.recipe) return oven;
          const sugarBoost = sugarRushTicks.current > 0 ? 1.5 : 1;
          const bpp = (0.2 / oven.recipe.bakeDuration) * 100 * oven.recipe.burnSpeed * pCfg.bakeSpeedMult * sugarBoost;
          u.bakeProgress = Math.min(100, oven.bakeProgress + bpp);

          const effectiveDrift = DRIFT_EVERY;
          if (!oven.frozen && tick - oven.lastDriftTick >= effectiveDrift) {
            const drift = (Math.random() < 0.6 ? -1 : 1) * (oven.recipe.driftSpeed * driftMult * (0.5 + Math.random() * 0.8));
            u.currentTemp = Math.max(80, Math.min(240, oven.currentTemp + drift));
            u.lastDriftTick = tick;
          }

          const goldenEnd = oven.masterTimer ? GOLDEN_END + 5 : GOLDEN_END;
          u.status = u.bakeProgress >= GOLDEN_START && u.bakeProgress < goldenEnd + 4 ? 'golden'
            : u.bakeProgress < GOLDEN_START ? 'baking' : oven.status;

          if (u.bakeProgress >= goldenEnd + 4) {
            u.status = 'burnt'; u.feedback = { quality: 'poor', name: oven.recipe.name };
            burnsRef.current++;
            const burnPenalty = Math.round(50 * modifiers.reduce((m, mod) => m * (mod.effects.burnPenaltyMultiplier ?? 1), 1));
            scoreRef.current = Math.max(0, scoreRef.current - burnPenalty);
            setScoreDisplay(scoreRef.current);
            addLog(`🔥 BURNT — ${oven.recipe.name}! −${burnPenalty}pts`);
            setTimeout(() => { if (ovensRef.current[idx].status === 'burnt') { ovensRef.current[idx] = makeOven(); forceUpdate(n => n + 1); } }, 2500);
          }
          return u;
        }
        return oven;
      });
      if (any) forceUpdate(n => n + 1);
    }, 200);
    return () => clearInterval(interval);
  }, [gameState === 'playing']); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Result screen ──────────────────────────────────────────────────────────
  if (gameState === 'result') {
    return (
      <AfterHoursResult
        score={scoreRef.current} personalBest={personalBest}
        pulledItems={pulledItemsRef.current} burns={burnsRef.current}
        comboMax={comboMaxRef.current} goldenOrders={goldenOrdersRef.current}
        modifiers={modifiers}
        onPlayAgain={() => {
          calledEnd.current = false; burnsRef.current = 0; comboRef.current = 0;
          comboMaxRef.current = 0; scoreRef.current = 0; sugarRushFill.current = 0;
          sugarRushTicks.current = 0; pulledItemsRef.current = []; goldenOrdersRef.current = 0;
          tickRef.current = 0; timeRef.current = AFTER_HOURS_SECONDS;
          nextEventTick.current = 300; phaseRef.current = 1; currentWave.current = 1;
          flash1Fired.current = false; flash2Fired.current = false; flashRef.current = null;
          ovensRef.current = [makeOven(), makeOven(), makeOven(), makeOven()];
          recipeQueue.current = shuffle([...RECIPES]); nextRecipeIdx.current = 0;
          setPhase(1); setPhaseChanged(null); setWaveCompleted(null); setFlashOrder(null);
          setSugarRushActive(false); setScoreDisplay(0); setSugarRushFillPct(0);
          setTimeLeft(AFTER_HOURS_SECONDS); setLogLines(['🌙 Ready for another night? Let\'s go!']);
          setPaused(false); pausedRef.current = false;
          setGameState('gate');
        }}
        onBack={onClose}
      />
    );
  }

  // ── Entry gate ─────────────────────────────────────────────────────────────
  if (gameState === 'gate') {
    const canAfford = coins >= AFTER_HOURS_ENTRY_FEE;
    return (
      <div className="absolute inset-0 z-[400] flex items-center justify-center p-4"
        style={{ backgroundImage: `url(${pickRotatingWallpaper('games-arena')})`, backgroundSize:'cover', backgroundPosition:'center' }}>
        <div className="absolute inset-0 bg-black/65" />
        <div className="relative z-10 max-w-2xl w-full animate-fade-in"
          style={{ borderRadius:'2.5rem', border:'1px solid rgba(168,85,247,0.25)',
            background:'rgba(10,3,18,0.97)', backdropFilter:'blur(16px)',
            boxShadow:'0 0 80px rgba(168,85,247,0.15)' }}>
          <div className="h-1 rounded-t-[2.5rem]" style={{ background:'linear-gradient(90deg,#7c3aed,#a855f7,#7c3aed)' }} />
          <div className="p-8 space-y-5 text-center">
            <span className="text-6xl block">🌙</span>
            <div>
              <p className="text-[9px] uppercase tracking-[0.35em] text-purple-400 font-black">After-Hours Bakery</p>
              <h1 className="text-3xl font-black text-white mt-1" style={{ fontFamily: FONT }}>15-Minute Session</h1>
              <p className="text-[12px] italic text-white/50 mt-2" style={{ fontFamily:'Georgia,serif' }}>
                "4 ovens. 3 order waves. 2 flash orders. 1 personal best to beat."
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[10px]">
              {[['🌿','Phase 1','Open Kitchen — 3 orders'],['🌙','Phase 2','Midnight Rush — 4 orders'],
                ['🔥','Phase 3','Deep Night — 5 golden orders'],['⛈️','Phase 4','Chaos Mode — last 60s'],
                ['⚡','Flash Orders','×2 per session, 3× score'],['⏱️','15 Minutes','Full night in the kitchen']
              ].map(([icon, label, sub]) => (
                <div key={label} className="flex items-start gap-2 p-2 bg-white/4 border border-white/8 rounded-xl text-left">
                  <span className="text-sm shrink-0">{icon}</span>
                  <div><p className="font-black text-white">{label}</p><p className="text-white/35">{sub}</p></div>
                </div>
              ))}
            </div>
            <div>
              <p className="text-[11px] text-white/50">Balance: <span className={`font-black ${canAfford ? 'text-amber-400' : 'text-rose-400'}`}>{coins} 🪙</span>
                <span className="text-white/25 mx-2">/</span>Entry: <span className="text-purple-300 font-black">{AFTER_HOURS_ENTRY_FEE} 🪙</span>
              </p>
            </div>
            <button onClick={enterGame} disabled={!canAfford}
              className={`w-full py-3.5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all ${canAfford ? 'cursor-pointer hover:scale-[1.02] active:scale-[0.98]' : 'opacity-40 cursor-not-allowed'}`}
              style={canAfford ? { fontFamily:'Josefin Sans,sans-serif', background:'linear-gradient(135deg,#7c3aed,#a855f7)', boxShadow:'0 4px 24px rgba(124,58,237,0.4)', color:'#fff' }
                              : { fontFamily:'Josefin Sans,sans-serif', background:'rgba(255,255,255,0.05)', color:'#fff' }}>
              🌙 Rent the Ovens — {AFTER_HOURS_ENTRY_FEE} 🪙
            </button>
            <button onClick={onClose}
              className="w-full py-2.5 rounded-2xl border border-white/10 text-white/40 text-sm hover:bg-white/5 transition cursor-pointer"
              style={{ fontFamily:'Georgia,serif', fontStyle:'italic' }}>← Back</button>
          </div>
        </div>
      </div>
    );
  }

  // ── Playing ────────────────────────────────────────────────────────────────
  const pCfg = PHASE_CONFIG[phase];
  const ovens = ovensRef.current;
  const orders = ordersRef.current;
  const isChaos = phase === 4;

  return (
    <div className="w-full h-full flex flex-col overflow-hidden animate-fade-in relative">

        {/* Overlays */}
        {activeEvent && !paused && <EventPopup event={activeEvent} onChoose={handleEventChoice} />}
        {paused && <PausePanel phase={phase} score={scoreRef.current} timeLeft={timeLeft} onResume={togglePause} onQuit={() => { setPaused(false); endGame(); }} />}
        {phaseChanged && <PhaseBanner phase={phaseChanged} />}
        {waveCompleted && <WaveBanner wave={waveCompleted.wave} bonus={waveCompleted.bonus} />}

        {/* ── Header ── */}
        <div className="shrink-0 flex items-center justify-between px-4 py-2 border-b transition-all duration-2000"
          style={{ borderColor: pCfg.borderColor, background: isChaos ? 'rgba(60,5,5,0.5)' : 'rgba(20,8,35,0.4)' }}>

          {/* Left: phase + controls */}
          <div className="flex items-center gap-3">
            <button onClick={togglePause}
              className="w-9 h-9 rounded-xl border border-white/15 flex items-center justify-center text-white/60 hover:bg-white/8 transition cursor-pointer text-base"
              title="Pause / Instructions">
              {paused ? '▶' : '⏸'}
            </button>
            <div>
              <p className="text-[8px] uppercase tracking-[0.3em] font-black" style={{ color: pCfg.accentColor }}>
                {pCfg.icon} Phase {phase}: {pCfg.name}
              </p>
              <p className="text-[9px] text-white/30">Wave {currentWave.current}/3 · {burnsRef.current} burns</p>
            </div>
          </div>

          {/* Centre: Combo + Score */}
          <div className="flex items-center gap-3">
            <ComboMeter combo={comboRef.current} maxCombo={comboMaxRef.current} sugarRushFill={sugarRushFillPct} sugarRushActive={sugarRushActive} />
            <ScoreDisplay score={scoreDisplay} personalBest={personalBest} isNewRecord={scoreDisplay > personalBest} />
          </div>

          {/* Right: Orders + Timer */}
          <div className="flex items-center gap-2">
            {orders.map(o => (
              <div key={o.id} className={`px-1.5 py-1 rounded-xl border text-center ${
                o.done >= o.need ? 'border-emerald-500/30 bg-emerald-950/15' :
                o.patience < 25 ? 'border-rose-500/30 bg-rose-950/12 animate-pulse' :
                o.isGolden ? 'border-yellow-500/30 bg-yellow-950/12' :
                'border-white/8 bg-white/3'}`}>
                <p className="text-[7px] text-white/30 font-black">{o.customer.split(' ')[0]}</p>
                <p className="text-sm">{faceFor(o.patience)}</p>
                <p className={`text-[8px] font-black ${o.done>=o.need?'text-emerald-400':o.isGolden?'text-yellow-400':'text-white/45'}`}>{o.done}/{o.need}{o.isGolden?' ⭐':''}</p>
              </div>
            ))}
            <div className={`px-3 py-1.5 rounded-xl border text-center ${isChaos ? 'border-rose-500/50 bg-rose-950/25' : 'border-white/10'}`}>
              <p className="text-[7px] uppercase text-white/20 font-black">Time</p>
              <p className={`text-lg font-mono font-black ${isChaos ? 'text-rose-400 animate-pulse' : 'text-white/70'}`} style={{ color: !isChaos ? pCfg.accentColor : undefined }}>
                {formatTime(timeLeft)}
              </p>
            </div>
          </div>
        </div>

        {/* ── Main: 4 ovens + right panel ── */}
        <div className="flex-1 min-h-0 flex gap-2 p-2 overflow-hidden">
          {/* 2×2 oven grid */}
          <div className="flex-1 grid grid-cols-2 grid-rows-2 gap-2 min-h-0">
            {ovens.map((oven, idx) => {
              const isGolden = oven.status === 'golden';
              const isBurnt  = oven.status === 'burnt';
              const isDone   = oven.status === 'done';
              const isPreheat= oven.status === 'preheating';
              const diff     = oven.recipe ? oven.currentTemp - oven.recipe.requiredTemp : 0;
              const phraseIdx= oven.recipe ? Math.floor((oven.bakeProgress/100)*oven.recipe.phrases.length) : 0;
              const phrase   = oven.recipe?.phrases[Math.min(phraseIdx, oven.recipe.phrases.length-1)] || '';
              const goldenEnd= oven.masterTimer ? GOLDEN_END+5 : GOLDEN_END;
              return (
                <div key={idx} className={`flex flex-col rounded-[1.4rem] border overflow-hidden transition-all duration-300 ${
                  isGolden ? 'border-amber-400/60 shadow-[0_0_20px_rgba(251,191,36,0.18)] bg-amber-950/12' :
                  isBurnt  ? 'border-rose-500/40 bg-rose-950/10' :
                  isDone||oven.status==='empty' ? 'border-white/6 bg-white/2' :
                  oven.frozen ? 'border-cyan-500/35 bg-cyan-950/8' : 'border-white/8 bg-black/20'}`}>
                  {/* Oven mini-header */}
                  <div className="shrink-0 px-2.5 py-1 border-b border-white/6 flex justify-between items-center bg-black/15">
                    <span className="text-[8px] font-black uppercase tracking-widest text-white/25">{oven.frozen?'🧊 ':''}Oven {idx+1}</span>
                    {isGolden && <span className="text-[7px] font-black text-amber-300 bg-amber-500/15 px-1.5 py-0.5 rounded-full animate-pulse">🟡 PULL!</span>}
                    {isBurnt && <span className="text-[7px] font-black text-rose-300 bg-rose-500/15 px-1.5 py-0.5 rounded-full">🔥 Burnt</span>}
                    {oven.recipe && !['empty','done','burnt'].includes(oven.status) && <span className="text-[7px] text-white/25 italic truncate max-w-[70px]">{phrase}</span>}
                  </div>

                  <div className="flex-1 flex flex-col items-center justify-between p-2 gap-1 min-h-0">
                    {oven.status==='empty' && <div className="flex-1 flex items-center justify-center opacity-20"><p className="text-[8px] text-white/30">Loading…</p></div>}
                    {isDone && oven.feedback && (
                      <div className="flex-1 flex items-center justify-center animate-fade-in">
                        <div className="text-center">
                          <div className="text-3xl mb-0.5">{qualityLabel(oven.feedback.quality).icon}</div>
                          <p className={`text-xs font-black uppercase ${qualityLabel(oven.feedback.quality).color}`}>{qualityLabel(oven.feedback.quality).label}</p>
                          <div className="flex justify-center gap-0.5 mt-0.5">{[1,2,3,4,5].map(s=><span key={s} className={`text-[8px] ${s<=starsFor(oven.feedback!.quality)?'text-amber-400':'text-white/15'}`}>★</span>)}</div>
                        </div>
                      </div>
                    )}
                    {oven.recipe && !['empty','done'].includes(oven.status) && (
                      <>
                        <div className="text-center shrink-0">
                          <div className={`text-2xl mb-0.5 ${isGolden?'animate-bounce':''}`}>{oven.recipe.icon}</div>
                          <p className="text-[10px] font-black text-white leading-tight">{oven.recipe.name}</p>
                          {(() => {
                            const m = orders.find(o => o.category===oven.recipe!.category && o.done<o.need);
                            return m ? <span className={`text-[7px] font-black ${m.isGolden?'text-yellow-400':'text-emerald-400'}`}>→{m.customer.split(' ')[0]}{m.isGolden?' ⭐':''}</span>
                                     : <span className="text-[7px] text-white/15">Flash?</span>;
                          })()}
                        </div>
                        <div className="w-full space-y-0.5">
                          <div className="flex justify-between">
                            <span className="text-[6px] uppercase text-white/20 font-black">Temp</span>
                            <span className={`text-[9px] font-mono font-black ${tempColor(diff)}`}>{Math.round(oven.currentTemp)}°</span>
                          </div>
                          <div className="h-1.5 bg-white/8 rounded-full overflow-hidden relative">
                            <div className="absolute top-0 w-px h-full bg-white/40 z-10" style={{ left:`${(oven.recipe.requiredTemp/250)*100}%` }} />
                            <div className={`h-full rounded-full transition-all duration-200 ${tempBarColor(diff)}`} style={{ width:`${Math.min(100,Math.max(3,(oven.currentTemp/250)*100))}%` }} />
                          </div>
                          <div className="grid grid-cols-4 gap-0.5">
                            {([-10,-5,5,10] as const).map(d=>(
                              <button key={d} onClick={()=>adjustTemp(idx,d)}
                                className={`py-0.5 text-[7px] font-black rounded-md border transition active:scale-90 cursor-pointer ${d<0?'bg-blue-500/15 border-blue-500/20 text-blue-300':'bg-orange-500/15 border-orange-500/20 text-orange-300'}`}>
                                {d>0?`+${d}°`:`${d}°`}
                              </button>
                            ))}
                          </div>
                        </div>
                        {isPreheat && <div className="w-full"><div className="h-2 bg-white/8 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-cyan-700 to-cyan-400 rounded-full transition-all" style={{ width:`${oven.preheatProgress}%` }} /></div></div>}
                        {['baking','golden','burnt'].includes(oven.status) && (
                          <div className="w-full space-y-0.5">
                            <div className="h-2.5 bg-white/8 rounded-full overflow-hidden relative">
                              <div className="absolute top-0 h-full bg-amber-500/20" style={{ left:`${GOLDEN_START}%`, width:`${goldenEnd-GOLDEN_START}%` }} />
                              <div className={`h-full rounded-full transition-all duration-150 ${isBurnt?'bg-rose-600':isGolden?'bg-gradient-to-r from-amber-600 to-yellow-400':'bg-gradient-to-r from-orange-800 to-orange-500'}`} style={{ width:`${oven.bakeProgress}%` }} />
                            </div>
                          </div>
                        )}
                        <button onClick={()=>pullOut(idx)} disabled={!isGolden}
                          className={`w-full py-1.5 rounded-xl font-black text-[8px] uppercase tracking-wider transition-all shrink-0 ${isGolden?'bg-gradient-to-r from-amber-500 to-yellow-400 text-black animate-pulse cursor-pointer hover:scale-[1.02]':'bg-white/4 text-white/15 border border-white/6 cursor-not-allowed'}`}>
                          {isGolden?'🧤 Pull!':isBurnt?'🔥':isPreheat?'♨️':'⏳'}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right panel */}
          <div className="w-44 shrink-0 flex flex-col gap-2">
            {/* Orders */}
            <div className="bg-black/30 border border-white/8 rounded-2xl p-2.5 space-y-1.5">
              <p className="text-[7px] uppercase tracking-[0.2em] font-black" style={{ color: pCfg.accentColor }}>📦 Wave {currentWave.current} Orders</p>
              {orders.map(o => (
                <div key={o.id} className={`px-2 py-1.5 rounded-xl border ${o.done>=o.need?'border-emerald-500/25 bg-emerald-950/15':o.patience<25?'border-rose-500/25 bg-rose-950/10 animate-pulse':o.isGolden?'border-yellow-500/25 bg-yellow-950/10':'border-white/6 bg-white/3'}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs">{o.icon}</span>
                    <span className="text-sm">{faceFor(o.patience)}</span>
                    <span className={`text-[8px] font-black ${o.done>=o.need?'text-emerald-400':o.isGolden?'text-yellow-400':'text-white/40'}`}>{o.done}/{o.need}</span>
                  </div>
                  <p className="text-[7px] text-white/30 mt-0.5">{o.customer.split(' ')[0]} {o.isGolden?'⭐':''}</p>
                  <div className="h-1 bg-white/8 rounded-full mt-1 overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${o.done>=o.need?'bg-emerald-500':o.isGolden?'bg-yellow-500':'bg-purple-600'}`} style={{ width:`${(o.done/o.need)*100}%` }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Flash order */}
            {flashOrder && flashOrder.active && (
              <FlashOrderBadge flash={flashOrder} onFill={() => {}} />
            )}

            {/* Hints */}
            <div className="flex-1 min-h-0">
              <HintPanel coins={coins} onUseHint={handleHint} activeHints={activeHints} freeAutoStir={freeAutoStir} />
            </div>

            {/* Log */}
            <div className="h-28 bg-black/30 border border-white/6 rounded-2xl p-2 flex flex-col overflow-hidden">
              <div className="flex-1 overflow-y-auto space-y-0.5 custom-scrollbar">
                {logLines.map((l, i) => <p key={i} className={`text-[7px] leading-snug ${i===0?'text-white/70':'text-white/20'}`}>{l}</p>)}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="shrink-0 px-4 py-1 border-t border-white/6 flex justify-between items-center">
          <p className="text-[7px] italic text-white/15" style={{ fontFamily:'Georgia,serif' }}>"The best bakers bake for love." — Chef Caramel</p>
          <p className="text-[7px] text-white/10">⏸ Pause anytime · Burns: {burnsRef.current} · Score: {scoreDisplay.toLocaleString()}</p>
        </div>
      </div>
  );
};
