// BakeryShift.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Level 1 — Bakery Shift: the daily earning game.
// Extracted from the original OvenTimingGame.tsx — identical gameplay,
// now modular and maintainable.
// ─────────────────────────────────────────────────────────────────────────────
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { FONT } from '../../../lib/uiConstants';
import { useTTStore } from '../../../store/useTTStore';
import { pickRotatingWallpaper } from '../../../constants/wallpapers';
import type { OvenState, OrderGroup, GameEvent, PulledItem, GamePhase, OvenTimingRewards } from './bakeryTypes';
import { RECIPES, INITIAL_ORDERS, POSSIBLE_EVENTS, ORDER_COMMENTS } from './bakeryData';
import {
  shuffle, makeOven, faceFor, qualityFor, starsFor, qualityLabel,
  tempColor, tempBarColor, formatTime,
  GOLDEN_START, GOLDEN_END, PREHEAT_TICKS, GAME_SECONDS, DRIFT_EVERY,
  EXIT_PENALTY, SHIFT_FAIL_PENALTY,
  loadBakeryStats, saveBakeryStats, mergeBakeryStats,
} from './bakeryEngine';
import { BAKERY_ACHIEVEMENTS } from './bakeryData';

interface BakeryShiftProps {
  rewards: OvenTimingRewards;
  onSuccess: () => void;
  onFail: () => void;
  onClose?: () => void;
}

// ─────────────────────────────────────────────────────────────────────────────


// ─────────────────────────────────────────────────────────────────────────────
// EVENT POPUP
// ─────────────────────────────────────────────────────────────────────────────
export const EventPopup: React.FC<{ event: GameEvent; onChoose: (good: boolean) => void }> = ({ event, onChoose }) => {
  const [secs, setSecs] = useState(event.timeLimit);
  useEffect(() => {
    const t = setInterval(() => setSecs(s => { if (s <= 1) { clearInterval(t); onChoose(false); return 0; } return s - 1; }), 1000);
    return () => clearInterval(t);
  }, [onChoose]);
  const pct = (secs / event.timeLimit) * 100;
  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.65)' }}>
      <div className="animate-fade-in text-center max-w-sm w-full mx-4 p-6 rounded-[2rem] border border-amber-400/30"
        style={{ background: 'rgba(20,10,2,0.97)', boxShadow: '0 0 60px rgba(251,191,36,0.2)' }}>
        <div className="text-5xl mb-3">{event.icon}</div>
        <h3 className="text-lg font-black text-amber-300 uppercase" style={{ fontFamily: FONT }}>{event.title}</h3>
        <p className="text-sm text-white/70 mt-1 mb-4 italic" style={{ fontFamily: 'Georgia,serif' }}>{event.body}</p>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-4">
          <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: pct < 40 ? '#ef4444' : '#f59e0b' }} />
        </div>
        <p className="text-[10px] text-white/35 mb-4 font-mono">{secs}s to decide</p>
        <div className={`grid gap-2 grid-cols-${event.choices.length}`}>
          {event.choices.map((c, i) => (
            <button key={i} onClick={() => onChoose(c.good)}
              className={`py-2.5 px-3 rounded-xl text-sm font-bold border transition hover:scale-[1.03] active:scale-[0.97] cursor-pointer ${
                c.good ? 'bg-emerald-500/15 border-emerald-500/35 text-emerald-300 hover:bg-emerald-500/25'
                       : 'bg-rose-500/10 border-rose-500/25 text-rose-300 hover:bg-rose-500/20'
              }`}
              style={{ fontFamily: 'Georgia,serif', fontStyle: 'italic' }}>
              {c.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// EXIT CONFIRM
// ─────────────────────────────────────────────────────────────────────────────
const ExitConfirm: React.FC<{ onConfirm: () => void; onCancel: () => void }> = ({ onConfirm, onCancel }) => (
  <div className="absolute inset-0 z-30 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.75)' }}>
    <div className="animate-fade-in max-w-sm w-full mx-4 p-8 rounded-[2rem] border border-rose-500/30 text-center"
      style={{ background: 'rgba(20,4,4,0.97)', boxShadow: '0 0 60px rgba(239,68,68,0.15)' }}>
      <div className="text-5xl mb-3">🚪</div>
      <h3 className="text-lg font-black text-rose-400 uppercase mb-2" style={{ fontFamily: FONT }}>Leave the Shift?</h3>
      <p className="text-sm text-white/70 leading-relaxed mb-2" style={{ fontFamily: 'Georgia,serif' }}>
        Chef Caramel's bakery still has orders to fill. Leaving now will cost you
      </p>
      <p className="text-3xl font-black text-rose-400 mb-4">-{EXIT_PENALTY} 🪙 Cocoa Coins</p>
      <div className="grid grid-cols-2 gap-3">
        <button onClick={onCancel}
          className="py-3 rounded-xl border border-emerald-500/35 text-emerald-300 font-bold text-sm hover:bg-emerald-500/15 transition cursor-pointer"
          style={{ fontFamily: 'Georgia,serif', fontStyle: 'italic' }}>Stay & Bake</button>
        <button onClick={onConfirm}
          className="py-3 rounded-xl border border-rose-500/35 text-rose-300 font-bold text-sm hover:bg-rose-500/15 transition cursor-pointer"
          style={{ fontFamily: 'Georgia,serif', fontStyle: 'italic' }}>Pay & Leave</button>
      </div>
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// SHIFT REPORT
// ─────────────────────────────────────────────────────────────────────────────
interface ShiftReportProps {
  orders: OrderGroup[]; pulledItems: PulledItem[];
  burns: number; rewards: OvenTimingRewards;
  bonusCoins: number; comboMax: number;
  exitedEarly: boolean;
  onTryAgain: () => void; onBack: () => void;
}

const ShiftReport: React.FC<ShiftReportProps> = ({
  orders, pulledItems, burns, rewards, bonusCoins, comboMax, exitedEarly, onTryAgain, onBack,
}) => {
  const totalNeed = orders.reduce((s, o) => s + o.need, 0);
  const totalDone = orders.reduce((s, o) => s + o.done, 0);
  const isWin = totalDone >= totalNeed;
  const stars5 = pulledItems.filter(p => p.quality === 'perfect').length;
  const coinsEarned = exitedEarly ? 0 : Math.max(0, rewards.coins + bonusCoins - burns * 3);
  const xpEarned = exitedEarly ? 0 : Math.max(0, Math.round(rewards.xp * (totalDone / Math.max(1, totalNeed))));
  const legacyEarned = exitedEarly ? 0 : orders.filter(o => o.done >= o.need).length * 4;
  const overallRating = exitedEarly ? 1 : isWin && burns === 0 && stars5 === totalDone ? 5 : isWin && burns === 0 ? 4 : isWin ? 3 : totalDone >= Math.floor(totalNeed * 0.6) ? 2 : 1;
  const ratingLabel = ['','Rough Shift','Getting There','Shift Complete','Great Shift!','Flawless!'][overallRating];
  const ratingColor = ['','text-rose-400','text-orange-400','text-emerald-400','text-yellow-300','text-amber-300'][overallRating];

  const getComment = (o: OrderGroup): string => {
    const key = o.id as keyof typeof ORDER_COMMENTS;
    const set = ORDER_COMMENTS[key];
    if (!set) return '';
    const pool = o.done >= o.need ? set.full : o.done > 0 ? set.partial : set.none;
    const charCodeSum = o.id.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    return pool[(charCodeSum + o.done + o.need) % pool.length];
  };

  return (
    <div className="absolute inset-0 z-[420] flex items-center justify-center"
      style={{ backgroundImage: `url(${pickRotatingWallpaper('games-arena')})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="absolute inset-0" style={{ background: 'rgba(5,3,0,0.82)' }} />
      <div className="relative z-10 flex flex-col animate-fade-in overflow-hidden"
        style={{ width: '720px', maxWidth: '95vw', maxHeight: '92vh', borderRadius: '2.5rem',
          border: isWin ? '2px solid rgba(251,191,36,0.30)' : '2px solid rgba(239,68,68,0.20)',
          background: isWin ? 'rgba(18,10,2,0.97)' : 'rgba(15,4,4,0.97)',
          boxShadow: isWin ? '0 0 80px rgba(251,191,36,0.15)' : '0 0 60px rgba(239,68,68,0.10)' }}>

        <div className="h-1 shrink-0 rounded-t-[2.5rem]"
          style={{ background: isWin ? 'linear-gradient(90deg,#f59e0b,#fbbf24,#f59e0b)' : 'linear-gradient(90deg,#ef4444,#f87171,#ef4444)' }} />

        <div className="px-10 pt-7 pb-4 border-b border-white/8 text-center shrink-0">
          <p className="text-[10px] uppercase tracking-[0.3em] text-amber-400/60 font-black">Morning Shift Report</p>
          <div className="flex justify-center gap-1 my-2">
            {[1,2,3,4,5].map(i => <span key={i} className={`text-2xl ${i <= overallRating ? 'text-amber-400' : 'text-white/15'}`}>★</span>)}
          </div>
          <h2 className={`text-3xl font-brand uppercase ${ratingColor}`} style={{ fontFamily: FONT }}>{ratingLabel}</h2>
          {exitedEarly && <p className="text-sm text-rose-400 mt-1 italic" style={{ fontFamily: 'Georgia,serif' }}>Shift abandoned — {EXIT_PENALTY} coins deducted.</p>}
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar px-10 py-5 space-y-5">
          <div className="space-y-2">
            <p className="text-[10px] uppercase tracking-[0.25em] text-amber-400 font-black">💬 Customer Feedback</p>
            {orders.map(o => (
              <div key={o.id} className={`flex gap-3 items-start p-4 rounded-2xl border ${
                o.done >= o.need ? 'bg-emerald-950/20 border-emerald-500/20' :
                o.done > 0 ? 'bg-amber-950/20 border-amber-500/20' :
                'bg-rose-950/20 border-rose-500/20'}`}>
                <span className="text-2xl">{o.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-black text-white">{o.customer}</p>
                    <span className="text-base">{faceFor(o.patience)}</span>
                    <span className={`text-[11px] font-black ml-auto ${o.done >= o.need ? 'text-emerald-400' : o.done > 0 ? 'text-amber-400' : 'text-rose-400'}`}>
                      {o.done}/{o.need} filled
                    </span>
                  </div>
                  <p className="text-[12px] text-white/60 italic mt-0.5" style={{ fontFamily: 'Georgia,serif' }}>"{getComment(o)}"</p>
                </div>
              </div>
            ))}
          </div>

          {pulledItems.length > 0 && (
            <div className="space-y-2">
              <p className="text-[10px] uppercase tracking-[0.25em] text-cyan-400 font-black">⭐ Bake Quality</p>
              <div className="grid grid-cols-2 gap-2">
                {pulledItems.map((item, i) => {
                  const q = qualityLabel(item.quality);
                  return (
                    <div key={i} className="flex items-center gap-2 px-3 py-2 bg-white/4 border border-white/8 rounded-xl">
                      <span className="text-lg">{q.icon}</span>
                      <div className="min-w-0">
                        <p className="text-[11px] font-bold text-white truncate">{item.recipeName}</p>
                        <div className="flex gap-0.5 mt-0.5">
                          {[1,2,3,4,5].map(s => <span key={s} className={`text-[10px] ${s <= starsFor(item.quality) ? 'text-amber-400' : 'text-white/15'}`}>★</span>)}
                        </div>
                      </div>
                      <span className={`text-[11px] font-black ml-auto ${q.color}`}>{q.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="grid grid-cols-4 gap-2">
            {[
              { label: 'Orders Done', value: `${totalDone}/${totalNeed}`, color: totalDone >= totalNeed ? 'text-emerald-400' : 'text-amber-400', icon: '📦' },
              { label: 'Burnt Items', value: burns, color: burns > 0 ? 'text-rose-400' : 'text-white/50', icon: '🔥' },
              { label: '⭐ Perfect',  value: stars5, color: 'text-amber-300', icon: '✨' },
              { label: 'Best Combo', value: `×${comboMax}`, color: 'text-purple-300', icon: '🔥' },
            ].map(s => (
              <div key={s.label} className="px-3 py-3 bg-white/4 border border-white/8 rounded-xl text-center">
                <p className="text-lg">{s.icon}</p>
                <p className={`text-base font-black ${s.color}`}>{s.value}</p>
                <p className="text-[9px] text-white/35 uppercase font-black mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="rounded-2xl p-px" style={{ background: isWin ? 'linear-gradient(135deg,#f59e0b,#d97706)' : 'linear-gradient(135deg,#6b7280,#4b5563)' }}>
            <div className="rounded-2xl bg-neutral-950/97 p-5 grid grid-cols-3 gap-4">
              {[
                { label: 'Cocoa Coins', value: `+${coinsEarned}`, icon: '🪙', color: 'text-amber-300' },
                { label: 'Healer XP',   value: `+${xpEarned}`,   icon: '✦',  color: 'text-rose-300' },
                { label: 'Legacy',      value: `+${legacyEarned}`,icon: '◈',  color: 'text-purple-300' },
              ].map(r => (
                <div key={r.label} className="text-center">
                  <p className="text-xs text-white/40 uppercase font-bold">{r.label}</p>
                  <p className={`text-2xl font-black ${r.color} mt-1`}>{r.value} {r.icon}</p>
                </div>
              ))}
            </div>
          </div>

          {exitedEarly && (
            <div className="px-4 py-3 bg-rose-950/20 border border-rose-500/25 rounded-xl text-center">
              <p className="text-sm text-rose-300 font-bold">-{EXIT_PENALTY} 🪙 Early exit penalty applied.</p>
            </div>
          )}
        </div>

        <div className="px-10 py-6 border-t border-white/8 flex gap-4 shrink-0">
          <button onClick={onBack}
            className="flex-1 py-3 rounded-2xl border border-white/15 text-white/60 hover:bg-white/5 transition text-sm font-bold cursor-pointer"
            style={{ fontFamily: 'Georgia,serif', fontStyle: 'italic' }}>← Back to Arcade</button>
          <button onClick={onTryAgain}
            className="flex-[2] py-3.5 rounded-2xl font-bold text-base text-black transition hover:scale-[1.02] active:scale-[0.97] cursor-pointer"
            style={{ fontFamily: 'Georgia,serif', fontStyle: 'italic',
              background: 'linear-gradient(135deg,#f59e0b,#fbbf24,#f59e0b)',
              boxShadow: '0 0 24px rgba(251,191,36,0.35)' }}>
            🔄 Try Another Shift
          </button>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN BAKERY SHIFT GAME
// ─────────────────────────────────────────────────────────────────────────────
export const BakeryShift: React.FC<BakeryShiftProps> = ({ rewards, onSuccess, onFail, onClose }) => {
  const { spendCoins } = useTTStore();

  const [phase, setPhase] = useState<GamePhase>('playing');
  const phaseRef = useRef<GamePhase>('playing');
  const [paused, setPaused]   = useState(false);
  const pausedRef             = useRef(false);
  const togglePause = () => { setPaused(p => { pausedRef.current = !p; return !p; }); };

  const recipeQueue   = useRef<any[]>(shuffle(RECIPES));
  const nextRecipeIdx = useRef(0);
  const ovensRef      = useRef<OvenState[]>([makeOven(), makeOven(), makeOven()]);
  const ordersRef     = useRef<OrderGroup[]>(INITIAL_ORDERS.map(o => ({ ...o })));
  const tickRef       = useRef(0);
  const timeRef       = useRef(GAME_SECONDS);
  const burnsRef      = useRef(0);
  const comboRef      = useRef(0);
  const comboMaxRef   = useRef(0);
  const bonusCoinsRef = useRef(0);
  const pulledItemsRef= useRef<PulledItem[]>([]);
  const activeEventRef= useRef<GameEvent | null>(null);
  const nextEventTick = useRef(100);
  const calledCbRef   = useRef(false);
  const exitedRef     = useRef(false);
  const startTimeRef  = useRef(Date.now());

  useEffect(() => { nextEventTick.current = 75 + Math.floor(Math.random() * 50); }, []);

  const [, forceUpdate]         = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_SECONDS);
  const [logLines, setLogLines] = useState<string[]>(['Chef Caramel: Gloves on, apron on — the town is waiting! 🧤']);
  const [activeEvent, setActiveEvent] = useState<GameEvent | null>(null);
  const [showExit, setShowExit] = useState(false);

  const addLog = useCallback((msg: string) => setLogLines(p => [msg, ...p].slice(0, 12)), []);

  const endGame = useCallback((win: boolean) => {
    if (calledCbRef.current) return;
    calledCbRef.current = true;
    phaseRef.current = 'result';
    setPhase('result');

    // Failure penalty
    if (!win && !exitedRef.current) {
      spendCoins(SHIFT_FAIL_PENALTY, 'Shift failure — Ganache Grove Bakery');
    }

    // Update lifetime stats
    const stats = loadBakeryStats();
    const mins = Math.round((Date.now() - startTimeRef.current) / 60000);
    const perfects = pulledItemsRef.current.filter(p => p.quality === 'perfect').length;
    const newStats = mergeBakeryStats(stats, perfects, burnsRef.current, comboMaxRef.current, 0, 0, mins, true);

    // Check achievements
    BAKERY_ACHIEVEMENTS.forEach(a => {
      if (!newStats.earnedAchievements.includes(a.id)) {
        if (a.check(newStats, burnsRef.current, comboMaxRef.current)) {
          newStats.earnedAchievements.push(a.id);
        }
      }
    });
    saveBakeryStats(newStats);

    if (win) onSuccess(); else onFail();
  }, [onSuccess, onFail, spendCoins]);

  const loadInto = useCallback((idx: number) => {
    const q = recipeQueue.current;
    const r = q[nextRecipeIdx.current % q.length];
    nextRecipeIdx.current++;
    ovensRef.current[idx] = { ...makeOven(), recipe: r, currentTemp: 60 + Math.floor(Math.random() * 20), status: 'preheating', lastDriftTick: tickRef.current };
    addLog(`Oven ${idx + 1}: Loaded ${r.name} — target ${r.requiredTemp}°C`);
  }, [addLog]);

  const adjustTemp = useCallback((idx: number, delta: number) => {
    if (phaseRef.current !== 'playing') return;
    const o = ovensRef.current[idx];
    if (!o.recipe || o.status === 'empty' || o.status === 'burnt' || o.status === 'done') return;
    ovensRef.current[idx] = { ...o, currentTemp: Math.max(50, Math.min(250, o.currentTemp + delta)) };
    forceUpdate(n => n + 1);
  }, []);

  const pullOut = useCallback((idx: number) => {
    if (phaseRef.current !== 'playing') return;
    const o = ovensRef.current[idx];
    if (o.status !== 'golden' || !o.recipe) return;
    const diff = o.currentTemp - o.recipe.requiredTemp;
    const quality = qualityFor(diff, o.bakeProgress);
    const ql = qualityLabel(quality);
    const matchOrder = ordersRef.current.find(ord => ord.category === o.recipe!.category && ord.done < ord.need);
    if (matchOrder) { matchOrder.done++; addLog(`${ql.icon} ${ql.label} — ${o.recipe.name} → ${matchOrder.customer}`); }
    else { addLog(`${ql.icon} ${ql.label} — ${o.recipe.name} (no open order)`); }
    if (quality === 'perfect' || quality === 'great') {
      comboRef.current++;
      if (comboRef.current > comboMaxRef.current) comboMaxRef.current = comboRef.current;
      if (comboRef.current >= 3) { bonusCoinsRef.current += comboRef.current * 2; addLog(`🔥 GOLDEN STREAK ×${comboRef.current}! Coins multiplying!`); }
    } else { comboRef.current = 0; }
    if (quality === 'perfect') bonusCoinsRef.current += 5;
    pulledItemsRef.current.push({ quality, recipeName: o.recipe.name });
    ovensRef.current[idx] = { ...makeOven(), status: 'done', feedback: { quality, name: o.recipe.name }, pulledQuality: quality };
    setTimeout(() => { if (ovensRef.current[idx].status === 'done') { ovensRef.current[idx] = makeOven(); forceUpdate(n => n + 1); } }, 2200);
    forceUpdate(n => n + 1);
    const allDone = ordersRef.current.every(ord => ord.done >= ord.need);
    if (allDone) setTimeout(() => endGame(true), 600);
  }, [addLog, endGame]);

  const handleEventChoice = useCallback((good: boolean) => {
    activeEventRef.current = null;
    setActiveEvent(null);
    phaseRef.current = 'playing';
    setPhase('playing');
    nextEventTick.current = tickRef.current + 75 + Math.floor(Math.random() * 50);
    if (good) { bonusCoinsRef.current += 3; addLog('✅ Good call! Bonus coins earned.'); }
    else { ordersRef.current.forEach(o => { o.patience = Math.max(0, o.patience - 12); }); addLog('⚠️ That cost the kitchen some goodwill.'); }
  }, [addLog]);

  const handleExitConfirm = useCallback(() => {
    exitedRef.current = true;
    spendCoins(EXIT_PENALTY, 'Early exit penalty — left shift at Ganache Grove Bakery', true);
    setShowExit(false);
    endGame(false);
  }, [spendCoins, endGame]);

  const resetAndRestart = useCallback(() => {
    calledCbRef.current = false; exitedRef.current = false; burnsRef.current = 0;
    comboRef.current = 0; comboMaxRef.current = 0; bonusCoinsRef.current = 0;
    pulledItemsRef.current = []; ovensRef.current = [makeOven(), makeOven(), makeOven()];
    ordersRef.current = INITIAL_ORDERS.map(o => ({ ...o }));
    tickRef.current = 0; timeRef.current = GAME_SECONDS;
    nextEventTick.current = 75 + Math.floor(Math.random() * 50);
    recipeQueue.current = shuffle(RECIPES); nextRecipeIdx.current = 0;
    startTimeRef.current = Date.now();
    setPhase('playing'); phaseRef.current = 'playing';
    setPaused(false); pausedRef.current = false;
    setTimeLeft(GAME_SECONDS); setLogLines(['Chef Caramel: New shift! Gloves on! 🧤']);
  }, []);

  // ── Game loop ───────────────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== 'playing') return;
    startTimeRef.current = Date.now();
    loadInto(0); setTimeout(() => loadInto(1), 500); setTimeout(() => loadInto(2), 1000);
    const interval = setInterval(() => {
      if (phaseRef.current === 'result') { clearInterval(interval); return; }
      if (phaseRef.current !== 'playing' || pausedRef.current) return;
      tickRef.current++;
      const tick = tickRef.current;
      if (tick % 5 === 0) {
        timeRef.current = Math.max(0, timeRef.current - 1);
        setTimeLeft(timeRef.current);
        const elapsed = GAME_SECONDS - timeRef.current;
        ordersRef.current.forEach(o => { if (o.done < o.need) o.patience = Math.max(0, 100 - (elapsed / GAME_SECONDS) * 80); });
        if (timeRef.current <= 0) { endGame(false); return; }
      }
      if (tick >= nextEventTick.current && !activeEventRef.current) {
        const pool = POSSIBLE_EVENTS.filter(e => !e.afterHoursOnly);
        const ev = pool[Math.floor(Math.random() * pool.length)];
        const gameEvent: GameEvent = { ...ev, resolved: false };
        activeEventRef.current = gameEvent;
        setActiveEvent(gameEvent);
        phaseRef.current = 'event';
        setPhase('event');
        addLog(`🔔 Event: ${ev.title}`);
      }
      let any = false;
      ovensRef.current = ovensRef.current.map((oven, idx) => {
        if (oven.status === 'empty') {
          setTimeout(() => { if (ovensRef.current[idx].status === 'empty' && phaseRef.current === 'playing') { loadInto(idx); forceUpdate(n => n + 1); } }, 300);
          return oven;
        }
        if (oven.status === 'done' || oven.status === 'burnt') return oven;
        const u = { ...oven }; any = true;
        if (oven.status === 'preheating') {
          u.preheatProgress = Math.min(100, oven.preheatProgress + (100 / PREHEAT_TICKS));
          if (oven.recipe) { const rise = (oven.recipe.requiredTemp - oven.currentTemp) * 0.10; u.currentTemp = Math.min(oven.recipe.requiredTemp + 10, oven.currentTemp + Math.max(1, rise)); }
          if (u.preheatProgress >= 100) { u.status = 'baking'; addLog(`Oven ${idx + 1}: ${oven.recipe?.name} ready — manage the temperature!`); }
          return u;
        }
        if (oven.status === 'baking' || oven.status === 'golden') {
          if (!oven.recipe) return oven;
          const bpp = (0.2 / oven.recipe.bakeDuration) * 100 * oven.recipe.burnSpeed;
          u.bakeProgress = Math.min(100, oven.bakeProgress + bpp);
          if (!oven.frozen && tick - oven.lastDriftTick >= DRIFT_EVERY) {
            const drift = (Math.random() < 0.6 ? -1 : 1) * (oven.recipe.driftSpeed * (0.5 + Math.random() * 0.8));
            u.currentTemp = Math.max(80, Math.min(240, oven.currentTemp + drift));
            u.lastDriftTick = tick;
          }
          u.status = u.bakeProgress >= GOLDEN_START && u.bakeProgress < GOLDEN_END + 4 ? 'golden'
            : u.bakeProgress < GOLDEN_START ? 'baking' : oven.status;
          if (u.bakeProgress >= GOLDEN_END + 4) {
            u.status = 'burnt'; u.feedback = { quality: 'poor', name: oven.recipe.name };
            burnsRef.current++; addLog(`🔥 BURNT — ${oven.recipe.name}! (-3 coins)`);
            bonusCoinsRef.current -= 3;
            if (burnsRef.current >= 4) setTimeout(() => endGame(false), 400);
            setTimeout(() => { if (ovensRef.current[idx].status === 'burnt') { ovensRef.current[idx] = makeOven(); forceUpdate(n => n + 1); } }, 3000);
          }
          return u;
        }
        return oven;
      });
      if (any) forceUpdate(n => n + 1);
    }, 200);
    return () => clearInterval(interval);
  }, [phase === 'playing']); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Phase routing ──────────────────────────────────────────────────────────
  // (briefing removed — instructions are in LevelDetail before game starts)

  if (phase === 'result') return (
    <ShiftReport
      orders={ordersRef.current} pulledItems={pulledItemsRef.current}
      burns={burnsRef.current} rewards={rewards}
      bonusCoins={bonusCoinsRef.current} comboMax={comboMaxRef.current}
      exitedEarly={exitedRef.current}
      onTryAgain={resetAndRestart}
      onBack={() => { if (onClose) onClose(); else onFail(); }}
    />
  );

  const ovens = ovensRef.current;
  const orders = ordersRef.current;

  return (
    <div className="w-full h-full flex flex-col overflow-hidden animate-fade-in relative">

        {phase === 'event' && activeEvent && <EventPopup event={activeEvent} onChoose={handleEventChoice} />}
        {showExit && <ExitConfirm onConfirm={handleExitConfirm} onCancel={() => setShowExit(false)} />}

        {/* Header */}
        <div className="shrink-0 px-6 py-3 border-b border-amber-500/12 flex items-center justify-between"
          style={{ background: 'linear-gradient(90deg,rgba(120,53,15,0.35),rgba(0,0,0,0.15))' }}>
          <div className="flex items-center gap-3">
            <button onClick={togglePause}
              className="w-9 h-9 rounded-xl border border-white/15 flex items-center justify-center text-white/60 hover:bg-white/8 transition cursor-pointer text-base"
              title="Pause / Instructions">
              {paused ? '▶' : '⏸'}
            </button>
            <button onClick={() => setShowExit(true)}
              className="px-3 py-1.5 rounded-xl border border-rose-500/25 text-rose-400/70 text-[10px] font-black uppercase hover:bg-rose-500/10 transition cursor-pointer">
              ✕ Exit
            </button>
            <div>
              <p className="text-[9px] uppercase tracking-[0.3em] text-amber-400/70 font-black">Ganache Grove Bakery</p>
              <h1 className="text-base font-brand text-white uppercase" style={{ fontFamily: FONT }}>🍞 Oven Timing</h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {orders.map(o => (
              <div key={o.id} className={`px-3 py-1.5 rounded-xl border text-center ${
                o.done >= o.need ? 'border-emerald-500/35 bg-emerald-950/20' :
                o.patience < 30 ? 'border-rose-500/35 bg-rose-950/15 animate-pulse' :
                'border-white/10 bg-white/3'}`}>
                <p className="text-[9px] text-white/40 uppercase font-black">{o.customer.split(' ')[0]}</p>
                <p className="text-base">{faceFor(o.patience)}</p>
                <p className={`text-[10px] font-black ${o.done >= o.need ? 'text-emerald-400' : 'text-white/60'}`}>{o.done}/{o.need}</p>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <div className="text-center">
              <p className="text-[9px] uppercase tracking-widest text-white/30">Burns</p>
              <p className={`text-lg font-black ${burnsRef.current >= 2 ? 'text-rose-400 animate-pulse' : 'text-white/45'}`}>{burnsRef.current}/4</p>
            </div>
            {comboRef.current >= 2 && (
              <div className="text-center px-2 py-1 bg-amber-500/15 border border-amber-500/25 rounded-xl animate-pulse">
                <p className="text-[9px] text-amber-400 uppercase font-black">Streak</p>
                <p className="text-lg font-black text-amber-300">×{comboRef.current}</p>
              </div>
            )}
            <div className={`px-4 py-2 rounded-xl border ${timeLeft < 60 ? 'border-rose-500/50 bg-rose-950/25' : 'border-amber-500/20 bg-amber-950/10'}`}>
              <p className="text-[9px] uppercase tracking-widest text-white/30">Time</p>
              <p className={`text-2xl font-mono font-black ${timeLeft < 60 ? 'text-rose-400 animate-pulse' : 'text-amber-300'}`}>{formatTime(timeLeft)}</p>
            </div>
          </div>
        </div>

        {/* Main — 2×2 oven grid: 3 active + 1 locked */}
        <div className="flex-1 min-h-0 flex gap-4 p-4 overflow-hidden">
          <div className="flex-1 grid grid-cols-2 grid-rows-2 gap-3">
            {ovens.map((oven, idx) => {
              const isGolden = oven.status === 'golden';
              const isBurnt = oven.status === 'burnt';
              const isDone = oven.status === 'done';
              const isPreheat = oven.status === 'preheating';
              const diff = oven.recipe ? oven.currentTemp - oven.recipe.requiredTemp : 0;
              const phraseIdx = oven.recipe ? Math.floor((oven.bakeProgress / 100) * oven.recipe.phrases.length) : 0;
              const phrase = oven.recipe?.phrases[Math.min(phraseIdx, oven.recipe.phrases.length - 1)] || '';
              return (
                <div key={idx} className={`flex flex-col rounded-[1.8rem] border overflow-hidden transition-all duration-300 ${
                  isGolden ? 'border-amber-400/55 shadow-[0_0_28px_rgba(251,191,36,0.2)] bg-amber-950/12' :
                  isBurnt  ? 'border-rose-500/40 bg-rose-950/10' :
                  isDone || oven.status === 'empty' ? 'border-white/6 bg-white/2' : 'border-white/10 bg-black/25'}`}>

                  <div className="shrink-0 px-3 py-2 border-b border-white/6 flex justify-between items-center bg-black/15">
                    <span className="text-[9px] font-black uppercase tracking-widest text-white/35">Oven {idx + 1}</span>
                    {isGolden && <span className="text-[8px] font-black uppercase text-amber-300 bg-amber-500/15 px-2 py-0.5 rounded-full animate-pulse">🟡 PULL!</span>}
                    {isBurnt && <span className="text-[8px] font-black uppercase text-rose-300 bg-rose-500/15 px-2 py-0.5 rounded-full">🔥 BURNT</span>}
                    {isPreheat && <span className="text-[8px] font-black uppercase text-cyan-300/70">♨️ Heating</span>}
                    {(oven.status === 'baking' || oven.status === 'golden') && oven.recipe && (
                      <span className="text-[8px] text-white/40 italic">{phrase}</span>
                    )}
                  </div>

                  <div className="flex-1 flex flex-col items-center justify-between p-3 gap-2">
                    {oven.status === 'empty' && <div className="flex-1 flex items-center justify-center opacity-25"><p className="text-[10px] text-white/40">Loading next recipe...</p></div>}
                    {isDone && oven.feedback && (
                      <div className="flex-1 flex items-center justify-center animate-fade-in">
                        <div className="text-center">
                          <div className="text-4xl mb-1">{qualityLabel(oven.feedback.quality).icon}</div>
                          <p className={`text-sm font-black uppercase ${qualityLabel(oven.feedback.quality).color}`}>{qualityLabel(oven.feedback.quality).label}</p>
                          <div className="flex justify-center gap-0.5 mt-1">
                            {[1,2,3,4,5].map(s => <span key={s} className={`text-[11px] ${s <= starsFor(oven.feedback!.quality) ? 'text-amber-400' : 'text-white/15'}`}>★</span>)}
                          </div>
                          <p className="text-[9px] text-white/40 mt-0.5">{oven.feedback.name}</p>
                        </div>
                      </div>
                    )}

                    {oven.recipe && !['empty','done'].includes(oven.status) && (
                      <>
                        <div className="text-center shrink-0">
                          <div className={`text-3xl mb-0.5 ${isGolden ? 'animate-bounce' : ''}`}>{oven.recipe.icon}</div>
                          <p className="text-[11px] font-black text-white">{oven.recipe.name}</p>
                          <p className="text-[8px] text-white/30 italic">{oven.recipe.story}</p>
                          {(() => {
                            const matchOrder = orders.find(o => o.category === oven.recipe!.category && o.done < o.need);
                            return matchOrder
                              ? <span className="text-[8px] text-emerald-400 font-black">→ {matchOrder.customer.split(' ')[0]}</span>
                              : <span className="text-[8px] text-white/25">No open order</span>;
                          })()}
                        </div>

                        <div className="w-full space-y-1">
                          <div className="flex justify-between">
                            <span className="text-[8px] uppercase text-white/30 font-black">Temp</span>
                            <span className={`text-xs font-mono font-black ${tempColor(diff)}`}>{Math.round(oven.currentTemp)}°C</span>
                          </div>
                          <div className="h-2 bg-white/8 rounded-full overflow-hidden relative">
                            <div className="absolute top-0 w-px h-full bg-white/50 z-10" style={{ left: `${(oven.recipe.requiredTemp / 250) * 100}%` }} />
                            <div className={`h-full rounded-full transition-all duration-200 ${tempBarColor(diff)}`} style={{ width: `${Math.min(100, Math.max(3, (oven.currentTemp / 250) * 100))}%` }} />
                          </div>
                          <div className="flex justify-between text-[8px]">
                            <span className="text-white/20">50°</span>
                            <span className="text-amber-300/50">Target {oven.recipe.requiredTemp}°</span>
                            <span className="text-white/20">250°</span>
                          </div>
                          <div className="text-[9px] text-center font-black" style={{ color: Math.abs(diff) <= 10 ? '#34d399' : Math.abs(diff) <= 20 ? '#fb923c' : '#f87171' }}>
                            {Math.abs(diff) <= 10 ? '✓ On target' : diff < 0 ? `${Math.abs(diff | 0)}° too cold` : `${diff | 0}° too hot`}
                          </div>
                          <div className="grid grid-cols-4 gap-1">
                            {([-10, -5, 5, 10] as const).map(d => (
                              <button key={d} onClick={() => adjustTemp(idx, d)}
                                className={`py-1 text-[9px] font-black rounded-lg border transition active:scale-90 cursor-pointer ${
                                  d < 0 ? 'bg-blue-500/15 border-blue-500/20 text-blue-300 hover:bg-blue-500/25'
                                        : 'bg-orange-500/15 border-orange-500/20 text-orange-300 hover:bg-orange-500/25'}`}>
                                {d > 0 ? `+${d}°` : `${d}°`}
                              </button>
                            ))}
                          </div>
                        </div>

                        {isPreheat && (
                          <div className="w-full space-y-1">
                            <div className="h-2.5 bg-white/8 rounded-full overflow-hidden">
                              <div className="h-full bg-gradient-to-r from-cyan-700 to-cyan-400 rounded-full transition-all" style={{ width: `${oven.preheatProgress}%` }} />
                            </div>
                            <p className="text-[8px] text-white/25 text-center">Preheating — {Math.round(oven.preheatProgress)}%</p>
                          </div>
                        )}

                        {(oven.status === 'baking' || oven.status === 'golden' || oven.status === 'burnt') && (
                          <div className="w-full space-y-1">
                            <div className="h-3 bg-white/8 rounded-full overflow-hidden relative">
                              <div className="absolute top-0 h-full bg-amber-500/20" style={{ left: `${GOLDEN_START}%`, width: `${GOLDEN_END - GOLDEN_START}%` }} />
                              <div className={`h-full rounded-full transition-all duration-150 ${isBurnt ? 'bg-rose-600' : isGolden ? 'bg-gradient-to-r from-amber-600 to-yellow-400' : 'bg-gradient-to-r from-orange-800 to-orange-500'}`}
                                style={{ width: `${oven.bakeProgress}%` }} />
                            </div>
                            <div className="flex justify-between text-[8px] text-white/20">
                              <span>Raw</span>
                              <span className={isGolden ? 'text-amber-400/80 font-black animate-pulse' : 'text-amber-400/40'}>🟡 {GOLDEN_START}–{GOLDEN_END}%</span>
                              <span className="text-rose-400/40">🔥</span>
                            </div>
                          </div>
                        )}

                        <button onClick={() => pullOut(idx)} disabled={!isGolden}
                          className={`w-full py-2 rounded-xl font-black text-[10px] uppercase tracking-wider transition-all shrink-0 ${
                            isGolden ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-black shadow-[0_0_16px_rgba(251,191,36,0.35)] animate-pulse cursor-pointer hover:scale-[1.02]'
                                     : 'bg-white/4 text-white/15 border border-white/6 cursor-not-allowed'}`}>
                          {isGolden ? '🧤 Pull Out!' : isBurnt ? '🔥 Burnt' : isPreheat ? '♨️ Heating' : `⏳ ${phrase || 'Baking...'}`}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
            {/* 4th locked oven card */}
            <div className="flex flex-col rounded-[1.8rem] border border-white/5 bg-black/40 opacity-40 items-center justify-center p-6 text-center">
              <span className="text-4xl mb-2">🔒</span>
              <p className="text-xs font-black text-white/50">Oven 4 Locked</p>
              <p className="text-[9px] text-white/25 mt-1">Available in After-Hours only</p>
            </div>
          </div>

          {/* Right panel */}
          <div className="w-44 shrink-0 flex flex-col gap-3">
            <div className="bg-black/30 border border-white/8 rounded-2xl p-3 space-y-2">
              <p className="text-[9px] uppercase tracking-[0.2em] text-amber-400/80 font-black">📦 Orders</p>
              {orders.map(o => (
                <div key={o.id} className={`px-2 py-2 rounded-xl border ${o.done >= o.need ? 'border-emerald-500/25 bg-emerald-950/15' : o.patience < 30 ? 'border-rose-500/25 bg-rose-950/10 animate-pulse' : 'border-white/8 bg-white/3'}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs">{o.icon}</span>
                    <span className="text-base">{faceFor(o.patience)}</span>
                    <span className={`text-[10px] font-black ${o.done >= o.need ? 'text-emerald-400' : 'text-white/50'}`}>{o.done}/{o.need}</span>
                  </div>
                  <p className="text-[9px] text-white/40 mt-0.5">{o.customer.split(' ')[0]}</p>
                  <p className="text-[8px] text-white/25 capitalize">{o.category}s</p>
                  <div className="h-1 bg-white/10 rounded-full mt-1 overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${o.done >= o.need ? 'bg-emerald-500' : o.patience < 30 ? 'bg-rose-500' : 'bg-amber-600'}`}
                      style={{ width: `${(o.done / o.need) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>

            {comboRef.current >= 2 && (
              <div className="bg-amber-500/10 border border-amber-500/25 rounded-2xl p-3 text-center animate-pulse">
                <p className="text-[9px] uppercase text-amber-400 font-black">🔥 Streak!</p>
                <p className="text-2xl font-black text-amber-300">×{comboRef.current}</p>
                <p className="text-[9px] text-amber-400/60">{comboRef.current >= 3 ? 'Coins multiplying!' : 'Keep going!'}</p>
              </div>
            )}

            <div className="flex-1 min-h-0 bg-black/30 border border-white/8 rounded-2xl p-3 flex flex-col overflow-hidden">
              <p className="text-[9px] uppercase tracking-[0.2em] text-white/30 font-black shrink-0 mb-2">Bakery Log</p>
              <div className="flex-1 overflow-y-auto space-y-1 custom-scrollbar">
                {logLines.map((l, i) => <p key={i} className={`text-[9px] leading-snug ${i === 0 ? 'text-white/80' : 'text-white/25'}`}>{l}</p>)}
              </div>
            </div>
          </div>
        </div>

        <div className="shrink-0 px-6 py-2 border-t border-white/6 flex justify-between items-center">
          <p className="text-[9px] text-white/25 italic" style={{ fontFamily: 'Georgia,serif' }}>"Every golden batch feeds the town." — Chef Caramel</p>
          <p className="text-[9px] text-white/20">4 burns = shift over · Fill all orders to win</p>
        </div>
      </div>
  );
};
