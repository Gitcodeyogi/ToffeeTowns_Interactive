/* eslint-disable react-refresh/only-export-components */
// BakeryShift.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Level 1 — Bakery Shift: the daily earning game.
// Pixar/Nintendo style high-fidelity gameplay overhaul.
// ─────────────────────────────────────────────────────────────────────────────
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { FONT } from '../../../lib/uiConstants';
import { useTTStore } from '../../../store/useTTStore';
import { pickRotatingWallpaper } from '../../../constants/wallpapers';
import type { OvenState, OrderGroup, GameEvent, PulledItem, GamePhase, OvenTimingRewards, Recipe } from './bakeryTypes';
import { RECIPES, INITIAL_ORDERS, POSSIBLE_EVENTS, ORDER_COMMENTS, BAKERY_CUSTOMERS } from './bakeryData';
import {
  shuffle, tempColor, tempBarColor, formatTime,
  GOLDEN_START, GOLDEN_END, PREHEAT_TICKS, GAME_SECONDS, DRIFT_EVERY,
  EXIT_PENALTY, SHIFT_FAIL_PENALTY,
  loadBakeryStats, saveBakeryStats, mergeBakeryStats,
  faceFor,
} from './bakeryEngine';
import { BAKERY_ACHIEVEMENTS } from './bakeryData';
import { cozyAudio } from '../../../utils/audioHelper';

// CSS keyframes dynamic injector
const KF_ID = 'bakery-overhaul-kf';
if (typeof document !== 'undefined' && !document.getElementById(KF_ID)) {
  const s = document.createElement('style');
  s.id = KF_ID;
  s.textContent = `
    @keyframes hdgBoom { 0%{transform:scale(1)} 30%{transform:scale(1.15)} 65%{transform:scale(.95)} 100%{transform:scale(1)} }
    @keyframes hdgShake { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-8px) rotate(-1deg)} 40%{transform:translateX(8px) rotate(1deg)} 60%{transform:translateX(-5px)} 80%{transform:translateX(5px)} }
    @keyframes steamUp { 0%{opacity:0;transform:translateY(0) scale(1)} 50%{opacity:0.6;transform:translateY(-15px) scale(1.3)} 100%{opacity:0;transform:translateY(-30px) scale(1.6)} }
    @keyframes goldPulse { 0%,100%{box-shadow: 0 0 10px rgba(251,191,36,0.3); border-color: rgba(251,191,36,0.4); } 50%{box-shadow: 0 0 25px rgba(251,191,36,0.7); border-color: rgba(251,191,36,0.9); } }
    @keyframes floatText { 0%{opacity:0;transform:translateY(0)} 20%{opacity:1;transform:translateY(-12px)} 80%{opacity:1;transform:translateY(-24px)} 100%{opacity:0;transform:translateY(-36px)} }
    
    .animate-boom { animation: hdgBoom 0.6s cubic-bezier(0.25, 1, 0.5, 1) forwards; }
    .animate-shake { animation: hdgShake 0.5s ease-in-out forwards; }
    .animate-gold-pulse { animation: goldPulse 2s infinite; }
  `;
  document.head.appendChild(s);
}

interface BakeryShiftProps {
  rewards: OvenTimingRewards;
  onSuccess: () => void;
  onFail: () => void;
  onClose?: () => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// EVENT POPUP (IN-GAME POPUPS)
// ─────────────────────────────────────────────────────────────────────────────
export const EventPopup: React.FC<{ event: GameEvent; onChoose: (good: boolean) => void }> = ({ event, onChoose }) => {
  const [secs, setSecs] = useState(event.timeLimit);
  useEffect(() => {
    const t = setInterval(() => setSecs(s => { if (s <= 1) { clearInterval(t); onChoose(false); return 0; } return s - 1; }), 1000);
    return () => clearInterval(t);
  }, [onChoose]);
  const pct = (secs / event.timeLimit) * 100;
  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/75 backdrop-blur-sm">
      <div className="animate-boom max-w-sm w-full mx-4 p-6 rounded-[2rem] border border-amber-500/35 bg-[#1a0f07] shadow-[0_0_60px_rgba(251,191,36,0.25)]">
        <div className="text-5xl mb-3 text-center">{event.icon}</div>
        <h3 className="text-lg font-black text-amber-300 uppercase text-center" style={{ fontFamily: FONT }}>{event.title}</h3>
        <p className="text-sm text-amber-100/70 mt-2 mb-4 text-center italic" style={{ fontFamily: 'Georgia,serif' }}>{event.body}</p>
        <div className="h-2 bg-stone-900 rounded-full overflow-hidden mb-4 border border-white/5">
          <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: pct < 40 ? '#ef4444' : '#f59e0b' }} />
        </div>
        <div className="grid gap-2">
          {event.choices.map((c, i) => (
            <button key={i} onClick={() => onChoose(c.good)}
              className={`py-2.5 px-3 rounded-xl text-sm font-bold border transition hover:scale-[1.02] active:scale-[0.98] cursor-pointer ${
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
// EXIT CONFIRMATION
// ─────────────────────────────────────────────────────────────────────────────
export const ExitConfirm: React.FC<{ onConfirm: () => void; onCancel: () => void }> = ({ onConfirm, onCancel }) => (
  <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/75 backdrop-blur-sm">
    <div className="animate-boom max-w-sm w-full mx-4 p-8 rounded-[2rem] border border-rose-500/30 text-center bg-[#150404] shadow-[0_0_60px_rgba(239,68,68,0.2)]">
      <div className="text-5xl mb-3">🚪</div>
      <h3 className="text-lg font-black text-rose-400 uppercase mb-2" style={{ fontFamily: FONT }}>Abandon Shift?</h3>
      <p className="text-sm text-stone-300 leading-relaxed mb-2" style={{ fontFamily: 'Georgia,serif' }}>
        Mortimer's ovens are still hot. Leaving now incurs a union penalty of:
      </p>
      <p className="text-3xl font-black text-rose-400 mb-4">-{EXIT_PENALTY} 🪙 Cocoa Coins</p>
      <div className="grid grid-cols-2 gap-3">
        <button onClick={onCancel}
          className="py-3 rounded-xl border border-emerald-500/35 text-emerald-300 font-bold text-sm hover:bg-emerald-500/15 transition cursor-pointer">Stay & Bake</button>
        <button onClick={onConfirm}
          className="py-3 rounded-xl border border-rose-500/35 text-rose-300 font-bold text-sm hover:bg-rose-500/15 transition cursor-pointer">Pay & Exit</button>
      </div>
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// CHALKBOARD END-OF-DAY REPORT
// ─────────────────────────────────────────────────────────────────────────────
export interface ShiftReportProps {
  pulledItems: PulledItem[];
  burns: number;
  score: number;
  happyPercent: number;
  onTryAgain: () => void;
  onBack: () => void;
}

export const ShiftReportChalkboard: React.FC<ShiftReportProps> = ({
  pulledItems, burns, score, happyPercent, onTryAgain, onBack,
}) => {
  const perfects = pulledItems.filter(p => p.quality === 'perfect').length;
  const isWin = happyPercent >= 60;
  
  return (
    <div className="absolute inset-0 z-[420] flex items-center justify-center bg-black/85 p-4">
      <div className="relative w-[580px] max-w-full p-8 rounded-[2.5rem] border-[6px] border-amber-900 bg-[#161d18] text-stone-100 shadow-[2px_10px_35px_rgba(0,0,0,0.9)] flex flex-col justify-between"
        style={{
          boxShadow: 'inset 0 0 80px rgba(0,0,0,0.95), 0 20px 40px rgba(0,0,0,0.85)',
          fontFamily: 'Fredoka One, sans-serif'
        }}>
        
        {/* Chalk Dusty Frame Overlay */}
        <div className="absolute inset-0 border border-white/5 pointer-events-none rounded-[2.2rem] m-1" />
        
        <div className="text-center border-b border-dashed border-white/20 pb-5">
          <span className="text-[11px] uppercase tracking-[0.3em] text-white/40">Bramble Mortimer's Chalkboard</span>
          <h2 className="text-3xl text-amber-300 uppercase mt-1 tracking-wide">Daily Shift Report</h2>
          <p className="text-[12px] text-white/50 italic font-serif mt-1">"Bake well, feed the Grove."</p>
        </div>

        <div className="my-6 space-y-5 px-4 font-mono text-lg">
          <div className="flex justify-between items-center">
            <span className="text-white/60">🍞 Bread Sold</span>
            <span className="font-bold text-xl">{pulledItems.length} loaves</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-white/60">🥐 Perfect Bakes</span>
            <span className="font-bold text-amber-400 text-xl">{perfects} perfect</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-white/60">🔥 Burnt Batches</span>
            <span className="font-bold text-rose-400 text-xl">{burns} burnt</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-white/60">😊 Happy Customers</span>
            <span className={`font-bold text-xl ${happyPercent >= 80 ? 'text-emerald-400' : 'text-amber-400'}`}>{happyPercent}%</span>
          </div>
          <div className="flex justify-between items-center border-t border-white/10 pt-4">
            <span className="text-amber-300 font-bold">Reputation Gain</span>
            <span className="font-bold text-2xl text-amber-300">+{Math.round(score * 0.05)}%</span>
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <button onClick={onBack}
            className="flex-1 py-3.5 rounded-2xl border border-white/20 text-white/70 hover:bg-white/5 hover:text-white transition text-sm font-bold cursor-pointer">
            ← Leave Kitchen
          </button>
          <button onClick={onTryAgain}
            className="flex-[2] py-4 rounded-2xl font-bold text-base text-black transition hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            style={{
              background: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
              boxShadow: '0 0 20px rgba(251,191,36,0.3)'
            }}>
            🥖 Start Next Shift
          </button>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN BAKERY SHIFT GAMEPLAY
// ─────────────────────────────────────────────────────────────────────────────
export const BakeryShift: React.FC<BakeryShiftProps> = ({ rewards, onSuccess, onFail, onClose }) => {
  const { spendCoins, addCoins } = useTTStore();

  const [phase, setPhase] = useState<GamePhase>('briefing');
  const phaseRef = useRef<GamePhase>('briefing');
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(false);
  const togglePause = () => setPaused(p => { pausedRef.current = !p; return !p; });

  const [, forceUpdate] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_SECONDS);
  const [activeEvent, setActiveEvent] = useState<GameEvent | null>(null);
  const [showExit, setShowExit] = useState(false);

  // ── Pantry Stock state ──
  const [pantry, setPantry] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('tt_market_produce_inventory');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      'cocoa-pods': 10, 'honey-syrup': 8, 'sweetbread': 12, 'sugar-beets': 6,
      'butterscotch-blossoms': 6, 'marshmallow-strawberries': 8,
      'caramelized-roses': 4, 'ganache-cherries': 4, 'peppermint-orchids': 4,
      'glazed-carrots': 6
    };
  });

  const savePantry = (nextPantry: Record<string, number>) => {
    setPantry(nextPantry);
    localStorage.setItem('tt_market_produce_inventory', JSON.stringify(nextPantry));
  };

  const topupPantryItem = (key: string) => {
    const cost = 15;
    const storeCoins = useTTStore.getState().coins;
    if (storeCoins < cost) {
      addLog("❌ Not enough Cocoa Coins to buy ingredients!");
      cozyAudio.playFailure();
      return;
    }
    spendCoins(cost, `Purchased ${key} at bakery counter`);
    const next = { ...pantry, [key]: (pantry[key] || 0) + 1 };
    savePantry(next);
    cozyAudio.playCoins();
    addLog(`🛒 Purchased 1x ${key.replace('-', ' ')} for 15 🪙.`);
  };

  // ── Ovens State ──
  const ovensRef = useRef<OvenState[]>([
    { id: 'stone', type: 'stone', recipe: null, currentTemp: 60, bakeProgress: 0, preheatProgress: 0, status: 'empty', lastDriftTick: 0, feedback: null, pulledQuality: null },
    { id: 'copper', type: 'copper', recipe: null, currentTemp: 60, bakeProgress: 0, preheatProgress: 0, status: 'empty', lastDriftTick: 0, feedback: null, pulledQuality: null },
    { id: 'brick', type: 'brick', recipe: null, currentTemp: 60, bakeProgress: 0, preheatProgress: 0, status: 'empty', lastDriftTick: 0, feedback: null, pulledQuality: null },
  ]);

  // ── Game Stats ──
  const tickRef = useRef(0);
  const timeRef = useRef(GAME_SECONDS);
  const burnsRef = useRef(0);
  const comboRef = useRef(0);
  const comboMaxRef = useRef(0);
  const scoreRef = useRef(0);
  const pulledItemsRef = useRef<PulledItem[]>([]);
  const activeEventRef = useRef<GameEvent | null>(null);
  const nextEventTick = useRef(80);
  const calledCbRef = useRef(false);
  const exitedRef = useRef(false);
  const startTimeRef = useRef(Date.now());

  // ── Atmosphere & Messiness ──
  const [mess, setMess] = useState(0);
  const [cleaning, setCleaning] = useState(false);
  const [timePhase, setTimePhase] = useState<'morning' | 'rush' | 'evening' | 'closing'>('morning');
  const [displayCounter, setDisplayCounter] = useState<string[]>([]);
  const [brambleState, setBrambleState] = useState<'idle' | 'inspecting' | 'proud' | 'sooty' | 'harmony'>('idle');
  const [brambleSays, setBrambleSays] = useState('Apron on, ovens clean! Ready for a cozy day of baking. 🌾');
  const [assistantBell, setAssistantBell] = useState<string | null>(null);

  // ── Customer Queue ──
  const [customerQueue, setCustomerQueue] = useState<OrderGroup[]>([]);
  const [currentCustomerIndex, setCurrentCustomerIndex] = useState(0);
  const [acceptedOrders, setAcceptedOrders] = useState<OrderGroup[]>([]);

  const addLog = useCallback((msg: string) => {
    setBrambleSays(msg);
  }, []);

  const getBrambleEmoji = () => {
    if (brambleState === 'proud') return '👨‍🍳✨';
    if (brambleState === 'sooty') return '😭🌫️';
    if (brambleState === 'harmony') return '🥰🎶';
    if (brambleState === 'inspecting') return '🔍🧐';
    return '👨‍🍳🧹';
  };

  const handleMorningBriefingClose = () => {
    phaseRef.current = 'playing';
    setPhase('playing');
    startTimeRef.current = Date.now();
    
    // Seed initial customer queue
    const queue = [];
    const pool = shuffle([...BAKERY_CUSTOMERS]);
    const recipes = RECIPES;
    for (let i = 0; i < 6; i++) {
      const cust = pool[i % pool.length];
      const rec = recipes[i % recipes.length];
      queue.push({
        id: `ord-${i}-${Math.random().toString(36).slice(2, 6)}`,
        customer: cust.name,
        customerName: cust.name,
        avatarImage: cust.avatar,
        customerDialogue: cust.dialogues[Math.floor(Math.random() * cust.dialogues.length)],
        icon: rec.icon,
        face: '😊',
        need: 1 + Math.floor(Math.random() * 2),
        done: 0,
        patience: 100,
        category: rec.category,
        comment: rec.name,
        ingredientsNeeded: rec.ingredientsNeeded ?? { 'sweetbread': 1 }
      });
    }
    setCustomerQueue(queue);
    setCurrentCustomerIndex(0);
    setAcceptedOrders([]);
    
    cozyAudio.playSuccess();
  };

  const acceptCustomerOrder = () => {
    const cust = customerQueue[currentCustomerIndex];
    if (!cust) return;

    // Check ingredients
    const req = cust.ingredientsNeeded || {};
    let ok = true;
    for (const [key, amt] of Object.entries(req)) {
      if ((pantry[key] || 0) < amt) ok = false;
    }

    if (!ok) {
      addLog("❌ Missing required pantry ingredients! Tap pantry item to buy.");
      cozyAudio.playFailure();
      return;
    }

    // Deduct ingredients
    const nextPantry = { ...pantry };
    for (const [key, amt] of Object.entries(req)) {
      nextPantry[key] = nextPantry[key] - amt;
    }
    savePantry(nextPantry);

    // Accept order into active list
    setAcceptedOrders(prev => [...prev, { ...cust }]);
    setCustomerQueue(prev => prev.filter((_, idx) => idx !== currentCustomerIndex));
    addLog(`👍 Accepted ${cust.customer}'s order for ${cust.need}x ${cust.comment}!`);
    cozyAudio.playCoins();

    // Trigger Mortimer animation
    setBrambleState('inspecting');
    setTimeout(() => setBrambleState('idle'), 2000);
  };

  const passCustomerOrder = () => {
    const cust = customerQueue[currentCustomerIndex];
    if (!cust) return;
    scoreRef.current = Math.max(0, scoreRef.current - 10);
    setCustomerQueue(prev => prev.filter((_, idx) => idx !== currentCustomerIndex));
    addLog(`Not today for ${cust.customerName}. Reputation adjusted.`);
    cozyAudio.playFailure();
  };

  const adjustTemp = useCallback((idx: number, delta: number) => {
    if (phaseRef.current !== 'playing') return;
    const o = ovensRef.current[idx];
    if (!o.recipe || o.status === 'empty' || o.status === 'burnt' || o.status === 'done') return;
    
    // Copper oven reacts faster
    const finalDelta = o.type === 'copper' ? delta * 1.5 : delta;
    ovensRef.current[idx] = { ...o, currentTemp: Math.max(50, Math.min(250, o.currentTemp + finalDelta)) };
    
    setBrambleState('inspecting');
    setBrambleSays(`Mortimer: Checking ${o.type} hearth dials. Keep it steady!`);
    forceUpdate(n => n + 1);
  }, []);

  const loadIntoOven = useCallback((idx: number, recipe: Recipe) => {
    if (phaseRef.current !== 'playing') return;
    const o = ovensRef.current[idx];
    if (o.recipe) return;

    ovensRef.current[idx] = {
      ...o,
      recipe,
      currentTemp: 60 + Math.floor(Math.random() * 20),
      status: 'preheating',
      lastDriftTick: tickRef.current,
      preheatProgress: 0,
      bakeProgress: 0
    };
    addLog(`Loading ${recipe.icon} ${recipe.name} into the ${o.type} oven.`);
  }, []);

  const pullOut = useCallback((idx: number) => {
    if (phaseRef.current !== 'playing') return;
    const o = ovensRef.current[idx];
    if (o.status !== 'golden' || !o.recipe) return;
    const diff = o.currentTemp - o.recipe.requiredTemp;
    const quality = o.bakeProgress >= 76 && o.bakeProgress <= 86 ? 'perfect' as const : 'great' as const;
    
    // Match with accepted orders
    let matchIdx = -1;
    for (let i = 0; i < acceptedOrders.length; i++) {
      if (acceptedOrders[i].category === o.recipe.category && acceptedOrders[i].done < acceptedOrders[i].need) {
        matchIdx = i;
        break;
      }
    }

    if (matchIdx !== -1) {
      const nextAccepted = [...acceptedOrders];
      nextAccepted[matchIdx].done++;
      
      if (nextAccepted[matchIdx].done >= nextAccepted[matchIdx].need) {
        // Customer fully served!
        const servedCust = nextAccepted[matchIdx];
        addLog(`😊 Served ${servedCust.customerName}! They left happily.`);
        setDisplayCounter(prev => [...prev, o.recipe!.icon]);
        nextAccepted.splice(matchIdx, 1);
        scoreRef.current += 100;
        cozyAudio.playSuccess();
      } else {
        addLog(`Baking ${o.recipe.name}: order progress ${nextAccepted[matchIdx].done}/${nextAccepted[matchIdx].need}.`);
        cozyAudio.playCoins();
      }
      setAcceptedOrders(nextAccepted);
    } else {
      addLog(`Baked ${o.recipe.name} (${quality}), but no matching order queue.`);
    }

    pulledItemsRef.current.push({ quality, recipeName: o.recipe.name });

    // Handle combo and state
    if (quality === 'perfect') {
      comboRef.current++;
      scoreRef.current += 50;
      if (comboRef.current > comboMaxRef.current) comboMaxRef.current = comboRef.current;
      setBrambleState('proud');
      if (comboRef.current >= 3) {
        setBrambleState('harmony');
        addLog(`🎶 Oven Harmony activated! (Combo ×${comboRef.current})`);
      }
    } else {
      comboRef.current = 0;
      setBrambleState('idle');
    }

    ovensRef.current[idx] = { ...o, recipe: null, status: 'done', feedback: { quality, name: o.recipe.name }, pulledQuality: quality };
    setTimeout(() => {
      if (ovensRef.current[idx].status === 'done') {
        ovensRef.current[idx].status = 'empty';
        forceUpdate(n => n + 1);
      }
    }, 2000);
    forceUpdate(n => n + 1);
  }, [acceptedOrders, addLog]);

  const cleanKitchen = () => {
    if (cleaning) return;
    setCleaning(true);
    setBrambleState('idle');
    setBrambleSays("🧹 Bramble Mortimer is wiping the baking workspace...");
    cozyAudio.playTradeEconomySound();
    setTimeout(() => {
      setMess(0);
      setCleaning(false);
      setBrambleSays("✨ Workplace is clean as a whistle!");
      cozyAudio.playSuccess();
    }, 3000);
  };

  const handleAssistantBell = () => {
    if (!assistantBell) return;
    const req = assistantBell;
    if ((pantry[req] || 0) < 1) {
      addLog(`❌ We need ${req.replace('-', ' ')} to assist Bramble! Tap pantry to top-up.`);
      return;
    }
    const nextPantry = { ...pantry, [req]: pantry[req] - 1 };
    savePantry(nextPantry);
    setAssistantBell(null);
    scoreRef.current += 75;
    setBrambleState('proud');
    setBrambleSays("👨‍🍳 Mortimer: Thanks, apprentice! Perfect teamwork.");
    cozyAudio.playSuccess();
  };

  const endGame = useCallback((win: boolean) => {
    if (calledCbRef.current) return;
    calledCbRef.current = true;
    phaseRef.current = 'result';
    setPhase('result');
    
    // Add coins reward on win
    if (win) {
      addCoins(rewards.coins + Math.round(scoreRef.current * 0.1), 'Bakery Shift Success');
    } else {
      spendCoins(SHIFT_FAIL_PENALTY, 'Shift failure - Ganache Grove Bakery');
    }

    // Save stats
    const stats = loadBakeryStats();
    const mins = Math.round((Date.now() - startTimeRef.current) / 60000);
    const perfects = pulledItemsRef.current.filter(p => p.quality === 'perfect').length;
    const newStats = mergeBakeryStats(stats, perfects, burnsRef.current, comboMaxRef.current, 0, 0, mins, true);
    saveBakeryStats(newStats);

    if (win) onSuccess(); else onFail();
  }, [onSuccess, onFail, spendCoins, addCoins, rewards.coins]);

  const resetAndRestart = () => {
    calledCbRef.current = false;
    exitedRef.current = false;
    burnsRef.current = 0;
    comboRef.current = 0;
    comboMaxRef.current = 0;
    scoreRef.current = 0;
    pulledItemsRef.current = [];
    ovensRef.current = [
      { id: 'stone', type: 'stone', recipe: null, currentTemp: 60, bakeProgress: 0, preheatProgress: 0, status: 'empty', lastDriftTick: 0, feedback: null, pulledQuality: null },
      { id: 'copper', type: 'copper', recipe: null, currentTemp: 60, bakeProgress: 0, preheatProgress: 0, status: 'empty', lastDriftTick: 0, feedback: null, pulledQuality: null },
      { id: 'brick', type: 'brick', recipe: null, currentTemp: 60, bakeProgress: 0, preheatProgress: 0, status: 'empty', lastDriftTick: 0, feedback: null, pulledQuality: null },
    ];
    tickRef.current = 0;
    timeRef.current = GAME_SECONDS;
    nextEventTick.current = 80;
    setMess(0);
    setCleaning(false);
    setTimePhase('morning');
    setDisplayCounter([]);
    setBrambleState('idle');
    setBrambleSays('New shift started! Keep it golden. 🥯');
    setAssistantBell(null);
    setPhase('briefing');
    phaseRef.current = 'briefing';
  };

  const handleExitConfirm = useCallback(() => {
    exitedRef.current = true;
    spendCoins(EXIT_PENALTY, 'Early exit penalty — left shift at Ganache Grove Bakery', true);
    setShowExit(false);
    endGame(false);
  }, [spendCoins, endGame]);

  const handleEventChoice = useCallback((good: boolean) => {
    activeEventRef.current = null;
    setActiveEvent(null);
    phaseRef.current = 'playing';
    setPhase('playing');
    nextEventTick.current = tickRef.current + 75 + Math.floor(Math.random() * 50);
    if (good) {
      scoreRef.current += 50;
      addLog('✅ Good call! Mortimer is pleased.');
      cozyAudio.playSuccess();
    } else {
      setCustomerQueue(prev => prev.map(c => ({ ...c, patience: Math.max(0, c.patience - 15) })));
      addLog('⚠️ That cost the kitchen some goodwill.');
      cozyAudio.playFailure();
    }
  }, [addLog]);

  // ── Game loop effect ──
  useEffect(() => {
    if (phase !== 'playing') return;
    const interval = setInterval(() => {
      if (phaseRef.current === 'result') { clearInterval(interval); return; }
      if (phaseRef.current !== 'playing' || pausedRef.current) return;

      tickRef.current++;
      const tick = tickRef.current;

      // Increment messiness slightly over time
      if (tick % 45 === 0) setMess(m => Math.min(100, m + 8));

      // Visual Time Phase mapping
      if (tick % 5 === 0) {
        timeRef.current = Math.max(0, timeRef.current - 1);
        setTimeLeft(timeRef.current);
        const progress = (GAME_SECONDS - timeRef.current) / GAME_SECONDS;
        if (progress < 0.25) setTimePhase('morning');
        else if (progress < 0.65) setTimePhase('rush');
        else if (progress < 0.90) setTimePhase('evening');
        else setTimePhase('closing');

        // Customer patience decay
        setCustomerQueue(prev => prev.map(c => ({
          ...c,
          patience: Math.max(0, c.patience - (timePhase === 'rush' ? 2 : 1.5))
        })));

        if (timeRef.current <= 0) {
          // Emotional closing pause
          setBrambleSays("🌙 Closing shop... let's sweep up and check the ledger.");
          setTimeout(() => endGame(true), 4000);
          return;
        }
      }

      // Random assistant request from Bramble
      if (tick % 120 === 0 && !assistantBell) {
        const ingredients = ['sweetbread', 'honey-syrup', 'sugar-beets', 'cocoa-pods'];
        const req = ingredients[Math.floor(Math.random() * ingredients.length)];
        setAssistantBell(req);
        setBrambleSays(`🔔 Mortimer: Hand me 1x ${req.replace('-', ' ')} quickly!`);
      }

      // Ovens baking update loop
      ovensRef.current = ovensRef.current.map((oven, idx) => {
        if (oven.status === 'empty') return oven;
        if (oven.status === 'done' || oven.status === 'burnt') return oven;
        const u = { ...oven };

        // Unique oven preheating multipliers
        const pSpeed = oven.type === 'stone' ? 1.4 : oven.type === 'brick' ? 0.6 : 1.0;
        if (oven.status === 'preheating') {
          u.preheatProgress = Math.min(100, oven.preheatProgress + (100 / PREHEAT_TICKS) * pSpeed);
          if (oven.recipe) {
            const rise = (oven.recipe.requiredTemp - oven.currentTemp) * 0.10 * pSpeed;
            u.currentTemp = Math.min(oven.recipe.requiredTemp + 10, oven.currentTemp + Math.max(1, rise));
          }
          if (u.preheatProgress >= 100) {
            u.status = 'baking';
            addLog(`Oven ${idx + 1} (${oven.type}): Baking ${oven.recipe?.name}!`);
          }
          return u;
        }

        // Baking phase temperature drift & progression
        if (oven.status === 'baking' || oven.status === 'golden') {
          if (!oven.recipe) return oven;
          
          // Stone oven bakes 1.3x faster, Brick bakes 0.7x slower
          const bSpeed = oven.type === 'stone' ? 1.3 : oven.type === 'brick' ? 0.7 : 1.0;
          const bpp = (0.2 / oven.recipe.bakeDuration) * 100 * oven.recipe.burnSpeed * bSpeed;
          u.bakeProgress = Math.min(100, oven.bakeProgress + bpp);

          // Stone drifts 1.6x faster, Brick drifts 0.5x slower
          const driftMult = oven.type === 'stone' ? 1.6 : oven.type === 'brick' ? 0.5 : 1.0;
          if (tick - oven.lastDriftTick >= DRIFT_EVERY) {
            const drift = (Math.random() < 0.65 ? -1 : 1) * (oven.recipe.driftSpeed * (0.5 + Math.random() * 0.8) * driftMult);
            u.currentTemp = Math.max(80, Math.min(240, oven.currentTemp + drift));
            u.lastDriftTick = tick;
          }

          u.status = u.bakeProgress >= GOLDEN_START && u.bakeProgress < GOLDEN_END + 4 ? 'golden'
            : u.bakeProgress < GOLDEN_START ? 'baking' : oven.status;

          // Burnt condition
          if (u.bakeProgress >= GOLDEN_END + 4) {
            u.status = 'burnt';
            u.feedback = { quality: 'poor', name: oven.recipe.name };
            burnsRef.current++;
            setBrambleState('sooty');
            addLog(`🔥 Burnt ${oven.recipe.name} in the ${oven.type} oven!`);
            cozyAudio.playFailure();
            setMess(m => Math.min(100, m + 15)); // Burnt items make a mess

            setTimeout(() => {
              if (ovensRef.current[idx].status === 'burnt') {
                ovensRef.current[idx].recipe = null;
                ovensRef.current[idx].status = 'empty';
                setBrambleState('idle');
                forceUpdate(n => n + 1);
              }
            }, 3000);
          }
          return u;
        }

        return oven;
      });

      forceUpdate(n => n + 1);
    }, 200);

    return () => clearInterval(interval);
  }, [phase, timePhase, assistantBell, endGame]);

  // Shifting background overlay filters for the time phases
  const getPhaseStyle = () => {
    if (timePhase === 'morning') return { background: 'linear-gradient(135deg, #2b1f13, #150f09)' };
    if (timePhase === 'rush') return { background: 'linear-gradient(135deg, #351c0c, #1a0a04)' };
    if (timePhase === 'evening') return { background: 'linear-gradient(135deg, #27141f, #130a0f)' };
    return { background: 'linear-gradient(135deg, #110e1a, #06050b)' };
  };

  const getPhaseBadge = () => {
    if (timePhase === 'morning') return '🌅 Morning';
    if (timePhase === 'rush') return '☀ Rush Hour';
    if (timePhase === 'evening') return '🌇 Evening';
    return '🌙 Closing';
  };

  // ── Render functions ──
  const activeCustomer = customerQueue[currentCustomerIndex];

  if (phase === 'briefing') {
    return (
      <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-6">
        <div className="max-w-xl w-full p-8 rounded-[2.5rem] border-[4px] border-amber-900 bg-[#1e1208] text-stone-100 shadow-[0_20px_50px_rgba(0,0,0,0.85)] flex flex-col items-center text-center">
          <div className="w-40 h-40 rounded-full border-4 border-amber-500 overflow-hidden bg-amber-950 mb-5 shadow-lg">
            <img src="/Assets/Ganache Grove/Characters/Baker_townsfolk.png" className="w-full h-full object-cover object-top scale-110" alt="Mortimer" />
          </div>
          <h2 className="text-3xl text-amber-300 font-brand uppercase tracking-wider" style={{ fontFamily: FONT }}>Bramble Mortimer</h2>
          <p className="text-sm text-amber-400 font-serif italic mt-1">Master Baker & Mentor</p>
          <div className="p-5 my-5 bg-black/40 border border-white/5 rounded-2xl italic leading-relaxed text-stone-200/90 text-sm font-serif" style={{ fontFamily: 'Georgia, serif' }}>
            "Good morning, apprentice! The grove is waking up, and the sweet aroma of yeast is in the air. 
            The Traveller's Inn and Oakenhart Clinic have ordered their breakfast batches. Make sure we check the recipe sheets, monitor oven heat, and bake everything to a perfect golden glaze!"
          </div>
          <button onClick={handleMorningBriefingClose}
            className="w-full py-4 rounded-2xl text-black font-black text-base uppercase tracking-widest transition hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            style={{
              background: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
              boxShadow: '0 5px 25px rgba(251,191,36,0.35)'
            }}>
            🥖 Let's Bake!
          </button>
        </div>
      </div>
    );
  }

  if (phase === 'result') {
    const totalDone = acceptedOrders.reduce((s, o) => s + o.done, 0);
    const happyPct = pulledItemsRef.current.length > 0 ? Math.round((pulledItemsRef.current.filter(p => p.quality === 'perfect').length / pulledItemsRef.current.length) * 100) : 100;
    return (
      <ShiftReportChalkboard
        pulledItems={pulledItemsRef.current}
        burns={burnsRef.current}
        score={scoreRef.current}
        happyPercent={happyPct}
        onTryAgain={resetAndRestart}
        onBack={onClose || onFail}
      />
    );
  }

  return (
    <div className="w-full h-full flex flex-col overflow-hidden relative select-none rounded-[2.5rem] border border-amber-900/35 transition-all duration-700"
      style={getPhaseStyle()}>
      
      {/* Dynamic Heatwave Overlay */}
      {mess > 40 && (
        <div className="absolute inset-0 bg-rose-500/[0.03] pointer-events-none transition-opacity duration-500" />
      )}

      {/* Top HUD bar */}
      <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-black/25 shrink-0 relative z-10">
        <div className="flex items-center gap-3">
          <button onClick={() => setShowExit(true)}
            className="w-10 h-10 rounded-xl border border-white/10 flex items-center justify-center text-stone-400 hover:text-white hover:bg-white/5 transition cursor-pointer">🚪</button>
          <div>
            <span className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-black">Ganache Grove Bakery</span>
            <h1 className="text-xl font-brand text-amber-200 tracking-wide" style={{ fontFamily: FONT }}>Baking Shift</h1>
          </div>
        </div>

        {/* Display Shelf Panel */}
        {displayCounter.length > 0 && (
          <div className="flex items-center gap-1.5 px-4 py-2 bg-amber-950/20 border border-amber-900/35 rounded-2xl shadow-inner max-w-sm overflow-hidden">
            <span className="text-[10px] text-amber-400 uppercase tracking-wider font-black shrink-0">Display:</span>
            <div className="flex gap-1 overflow-x-auto custom-scrollbar">
              {displayCounter.map((icon, idx) => (
                <span key={idx} className="text-lg animate-shelf-fly">{icon}</span>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-[9px] uppercase tracking-widest text-white/30 font-black">Time Period</p>
            <p className="text-sm font-black text-amber-300">{getPhaseBadge()}</p>
          </div>
          <div className="px-4 py-2 rounded-2xl bg-black/40 border border-white/10 text-center font-mono">
            <p className="text-[11px] font-black text-amber-400">{formatTime(timeLeft)}</p>
            <p className="text-[8px] text-white/35 font-bold uppercase tracking-widest">remaining</p>
          </div>
        </div>
      </div>

      {/* Two Pane Split Body */}
      <div className="flex-1 flex overflow-hidden min-h-0 relative z-10">
        
        {/* LEFT COLUMN: THE KITCHEN WORKSPACE */}
        <div className="w-[62%] flex flex-col p-4 border-r border-white/10 overflow-y-auto custom-scrollbar relative space-y-4">
          
          {/* Bramble Mortimer Card & Assistant Bell */}
          <div className="flex gap-4 p-4 rounded-2xl border border-amber-900/30 bg-amber-950/15 items-center">
            <div className={`w-16 h-16 rounded-2xl border-2 overflow-hidden bg-amber-900/40 shrink-0 ${brambleState === 'proud' ? 'border-amber-400 animate-bounce' : 'border-amber-900/30'}`}>
              <img src="/Assets/Ganache Grove/Characters/Baker_townsfolk.png" className="w-full h-full object-cover object-top scale-125" alt="Mortimer" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[11px] uppercase tracking-wider text-amber-400 font-black">Bramble Mortimer {getBrambleEmoji()}</span>
                {comboRef.current >= 3 && <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-black animate-pulse">OVEN HARMONY ×{comboRef.current}</span>}
              </div>
              <p className="text-[13px] text-stone-200/90 italic font-serif leading-relaxed mt-0.5" style={{ fontFamily: 'Georgia, serif' }}>
                "{brambleSays}"
              </p>
            </div>
            
            {/* Assistant bell trigger */}
            {assistantBell && (
              <button onClick={handleAssistantBell}
                className="py-2.5 px-3 rounded-xl border border-amber-400 bg-amber-500 text-black font-black text-xs hover:scale-105 active:scale-95 transition cursor-pointer animate-pulse shrink-0">
                🔔 Give {assistantBell.replace('-', ' ')}!
              </button>
            )}
          </div>

          {/* Ovens grid layout */}
          <div className="flex flex-col gap-3">
            {ovensRef.current.map((oven, idx) => {
              const borderCol = oven.type === 'stone' ? 'border-stone-500/40' : oven.type === 'copper' ? 'border-amber-700/50 bg-[#25150c]' : 'border-amber-900/50 bg-[#2a130f]';
              const ovenName = oven.type === 'stone' ? 'Stone Hearth' : oven.type === 'copper' ? 'Copper Vault' : 'Brick Dome';
              const details = oven.type === 'stone' ? 'Bakes 1.3x faster, volatile temperature' : oven.type === 'copper' ? 'Standard bake, fast dial adjustments' : 'Bakes 0.7x slower, holds heat stable';

              return (
                <div key={oven.id} className={`p-4 rounded-[2rem] border-2 flex gap-4 items-center relative transition-all duration-300 ${borderCol} ${oven.status === 'golden' ? 'animate-gold-pulse' : ''}`}>
                  
                  {/* Left Column: Temperature and status details */}
                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-[9px] uppercase tracking-widest text-white/30 font-bold">{details}</span>
                        <h3 className="text-base font-black text-white" style={{ fontFamily: FONT }}>{ovenName}</h3>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-black uppercase ${
                        oven.status === 'preheating' ? 'bg-amber-500/20 text-amber-400 animate-pulse' :
                        oven.status === 'baking' ? 'bg-indigo-500/20 text-indigo-400' :
                        oven.status === 'golden' ? 'bg-amber-400 text-black font-bold animate-bounce' :
                        oven.status === 'burnt' ? 'bg-rose-500/20 text-rose-400' :
                        'bg-stone-800 text-stone-400'
                      }`}>{oven.status}</span>
                    </div>

                    {/* Gradient Temp Slider */}
                    {oven.recipe && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px] text-white/50 font-mono">
                          <span>Target: {oven.recipe.requiredTemp}°C ({oven.recipe.tempLabel})</span>
                          <span className={tempColor(oven.currentTemp - oven.recipe.requiredTemp)}>{Math.round(oven.currentTemp)}°C</span>
                        </div>
                        <div className="h-3 bg-stone-950 rounded-full overflow-hidden relative border border-white/5">
                          <div className="h-full rounded-full transition-all"
                            style={{
                              width: `${(oven.currentTemp / 250) * 100}%`,
                              background: tempBarColor(oven.currentTemp - oven.recipe.requiredTemp)
                            }} />
                          {/* Target Temperature alignment marker line */}
                          <div className="absolute top-0 bottom-0 w-1 bg-white border border-black shadow"
                            style={{ left: `${(oven.recipe.requiredTemp / 250) * 100}%` }} />
                        </div>
                      </div>
                    )}

                    {/* Bake Progress bar */}
                    {oven.recipe && oven.status !== 'preheating' && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] text-white/40">
                          <span>Baking progress:</span>
                          <span>{Math.round(oven.bakeProgress)}%</span>
                        </div>
                        <div className="h-2.5 bg-stone-950 rounded-full overflow-hidden relative border border-white/5">
                          <div className="h-full rounded-full bg-amber-500 transition-all"
                            style={{ width: `${oven.bakeProgress}%` }} />
                          {/* Golden baking zone boundaries */}
                          <div className="absolute top-0 bottom-0 bg-amber-400/40"
                            style={{ left: `${GOLDEN_START}%`, right: `${100 - GOLDEN_END}%` }} />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Column: Interaction Dials and Load/Pull Buttons */}
                  <div className="flex flex-col items-center gap-2 shrink-0">
                    {oven.status === 'empty' ? (
                      <div className="flex flex-col gap-1.5">
                        <span className="text-[10px] text-center text-white/30 uppercase font-black">Load Recipe</span>
                        <div className="grid grid-cols-2 gap-1.5">
                          {RECIPES.filter(r => !r.afterHoursOnly).slice(0, 4).map(r => (
                            <button key={r.id} onClick={() => loadIntoOven(idx, r)}
                              className="w-10 h-10 rounded-xl bg-amber-900/20 border border-amber-900/30 text-lg flex items-center justify-center hover:scale-105 active:scale-95 transition cursor-pointer">
                              {r.icon}
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        {/* Dial controllers */}
                        {oven.status !== 'burnt' && oven.status !== 'done' && (
                          <div className="flex gap-1.5">
                            <button onClick={() => adjustTemp(idx, -10)} className="w-8 h-8 rounded-lg bg-stone-900 border border-white/10 hover:bg-stone-800 text-stone-300 font-black cursor-pointer">-</button>
                            <button onClick={() => adjustTemp(idx, 10)} className="w-8 h-8 rounded-lg bg-stone-900 border border-white/10 hover:bg-stone-800 text-stone-300 font-black cursor-pointer">+</button>
                          </div>
                        )}
                        {/* Pull/Preheat action button */}
                        {oven.status === 'preheating' && (
                          <div className="w-20 py-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-[11px] font-black text-center animate-pulse">
                            Preheating...
                          </div>
                        )}
                        {oven.status === 'baking' && (
                          <div className="w-20 py-2.5 rounded-xl bg-stone-900 border border-white/10 text-stone-500 text-[11px] font-black text-center">
                            Baking...
                          </div>
                        )}
                        {oven.status === 'golden' && (
                          <button onClick={() => pullOut(idx)}
                            className="w-20 py-2.5 rounded-xl bg-amber-500 text-black font-black text-[11px] hover:scale-105 active:scale-95 transition cursor-pointer animate-pulse">
                            🥖 PULL!
                          </button>
                        )}
                        {oven.status === 'burnt' && (
                          <div className="w-20 py-2.5 rounded-xl bg-rose-500/15 border border-rose-500/35 text-rose-400 text-[11px] font-black text-center">
                            BURNT! 💀
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Clean and mess controls */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-black/20 border border-white/5">
            <div>
              <p className="text-xs text-white/35 font-bold uppercase tracking-wider">Kitchen Messiness</p>
              <div className="flex items-center gap-2 mt-1.5">
                <div className="w-36 h-2 rounded-full bg-stone-900 overflow-hidden border border-white/5">
                  <div className="h-full rounded-full transition-all" style={{ width: `${mess}%`, background: mess > 60 ? '#ef4444' : '#f59e0b' }} />
                </div>
                <span className="text-xs font-mono text-white/50">{mess}%</span>
              </div>
            </div>
            {mess >= 20 && (
              <button onClick={cleanKitchen} disabled={cleaning}
                className="py-2.5 px-4 rounded-xl border border-amber-900 bg-amber-950/20 text-amber-300 font-black text-xs hover:bg-amber-900/30 transition cursor-pointer">
                {cleaning ? '🧹 Cleaning...' : '🧹 Clean Kitchen (3s)'}
              </button>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: THE SHOP COUNTER (CUSTOMER & QUEUE) */}
        <div className="w-[38%] flex flex-col p-4 bg-black/40 overflow-y-auto custom-scrollbar relative justify-between">
          
          {/* Top Counter details */}
          <div className="space-y-4">
            <div className="border-b border-white/10 pb-3 flex justify-between items-center">
              <div>
                <span className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-black">Active Counter</span>
                <h3 className="text-base font-black text-amber-100" style={{ fontFamily: FONT }}>Customer Counter</h3>
              </div>
              <span className="text-xs font-mono text-amber-400/70">{customerQueue.length} waiting in line</span>
            </div>

            {/* Customer Portrait image and dialogue card */}
            {activeCustomer ? (
              <div className="p-4 rounded-2xl border border-amber-900/30 bg-amber-950/10 space-y-4 flex flex-col">
                <div className="flex gap-4 items-center">
                  <div className={`w-20 h-20 rounded-2xl border-2 overflow-hidden bg-amber-900/20 shrink-0 ${activeCustomer.patience < 35 ? 'border-rose-500/60 animate-shake grayscale' : 'border-amber-900/40'}`}>
                    <img src={activeCustomer.avatarImage} className="w-full h-full object-cover object-top scale-110" alt="Customer" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-black text-white">{activeCustomer.customerName}</span>
                      <span className="text-base">{faceFor(activeCustomer.patience)}</span>
                    </div>
                    <div className="flex gap-1.5 items-center mt-1">
                      <span className="text-[10px] uppercase tracking-wider text-amber-400/80 font-black">Wants:</span>
                      <span className="text-xs bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full font-bold text-amber-300">
                        {activeCustomer.need}x {activeCustomer.icon} {activeCustomer.comment}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 bg-black/30 border border-white/5 rounded-xl italic font-serif text-stone-200/90 text-sm" style={{ fontFamily: 'Georgia, serif' }}>
                  "{activeCustomer.customerDialogue}"
                </div>

                {/* Accept / Not Today choices */}
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={acceptCustomerOrder}
                    className="py-3 rounded-xl bg-emerald-500 text-black font-black text-xs hover:scale-[1.03] active:scale-[0.97] transition cursor-pointer">
                    Accept Order 🥖
                  </button>
                  <button onClick={passCustomerOrder}
                    className="py-3 rounded-xl border border-rose-500/35 text-rose-300 font-black text-xs hover:bg-rose-500/10 transition cursor-pointer">
                    Not Today ✖
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-white/30 border border-dashed border-white/10 rounded-2xl">
                ☕ No customers at the counter right now. Monitor baking ovens!
              </div>
            )}

            {/* Active Baking Queue orders */}
            <div className="space-y-2">
              <span className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-black">Active Baking Queue</span>
              {acceptedOrders.length > 0 ? (
                <div className="space-y-1.5">
                  {acceptedOrders.map(o => (
                    <div key={o.id} className="flex gap-3 items-center p-3 rounded-xl border border-amber-900/30 bg-amber-950/5">
                      <span className="text-xl">{o.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-black text-white">{o.customerName}</p>
                        <p className="text-[10px] text-white/40 italic">{o.comment}</p>
                      </div>
                      <span className="text-xs font-mono font-black text-amber-400">{o.done}/{o.need} baked</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-white/20 border border-white/5 bg-white/2 rounded-xl text-xs font-serif italic">
                  Kitchen queue empty. Accept customer orders from counter.
                </div>
              )}
            </div>
          </div>

          {/* Pantry Stocks (One Click Buy) */}
          <div className="border-t border-white/10 pt-4 space-y-2">
            <span className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-black">Bakery Pantry (Tap to buy +1 for 15 🪙)</span>
            <div className="grid grid-cols-5 gap-1.5">
              {[
                { key: 'sweetbread', label: 'Bun', icon: '🍞' },
                { key: 'honey-syrup', label: 'Honey', icon: '🍯' },
                { key: 'cocoa-pods', label: 'Cocoa', icon: '🟫' },
                { key: 'sugar-beets', label: 'Beet', icon: '🍠' },
                { key: 'marshmallow-strawberries', label: 'Berry', icon: '🍓' },
              ].map(p => {
                const count = pantry[p.key] || 0;
                return (
                  <button key={p.key} onClick={() => topupPantryItem(p.key)}
                    className={`p-2 rounded-xl border flex flex-col items-center justify-center hover:scale-105 active:scale-95 transition cursor-pointer relative ${count === 0 ? 'border-rose-500/40 bg-rose-950/20' : 'border-amber-900/35 bg-amber-950/5'}`}>
                    <span className="text-lg">{p.icon}</span>
                    <span className={`text-[10px] font-black mt-1 ${count === 0 ? 'text-rose-400' : 'text-stone-300'}`}>{count}</span>
                    <span className="text-[7px] text-white/30 font-bold uppercase">{p.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* PAUSE OVERLAY */}
      {paused && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-brand text-amber-300 uppercase tracking-widest" style={{ fontFamily: FONT }}>Baking Paused</h2>
            <button onClick={togglePause}
              className="py-3 px-6 rounded-2xl bg-amber-500 text-black font-black uppercase text-sm hover:scale-105 transition cursor-pointer">Resume Shift</button>
          </div>
        </div>
      )}

      {/* EVENT AND EXIT DIALOGS */}
      {activeEvent && (
        <EventPopup event={activeEvent} onChoose={handleEventChoice} />
      )}
      {showExit && (
        <ExitConfirm onConfirm={handleExitConfirm} onCancel={() => setShowExit(false)} />
      )}
    </div>
  );
};
