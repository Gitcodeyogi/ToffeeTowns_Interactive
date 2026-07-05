// BakeryApprenticeship.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Level 0 — Guided 8-chapter tutorial with Chef Caramel.
// Teaches every mechanic without pressure or time limits.
// ─────────────────────────────────────────────────────────────────────────────
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FONT } from '../../../lib/uiConstants';
import { useTTStore } from '../../../store/useTTStore';
import { pickRotatingWallpaper } from '../../../constants/wallpapers';
import { APPRENTICE_CHAPTERS, POSSIBLE_EVENTS } from './bakeryData';
import {
  makeOven, qualityFor, qualityLabel, starsFor, tempColor, tempBarColor,
  GOLDEN_START, GOLDEN_END, PREHEAT_TICKS, DRIFT_EVERY,
  APPRENTICE_RETRY_COST, APPRENTICE_MAX_FAILS,
} from './bakeryEngine';
import { loadBakeryStats, saveBakeryStats } from './bakeryEngine';
import type { OvenState, GameEvent, ItemQuality } from './bakeryTypes';

type AppPhase = 'chapter' | 'baking' | 'event' | 'graduation' | 'fail';

interface BakeryApprenticeshipProps {
  onComplete: () => void;   // badge earned → unlock shift
  onClose:    () => void;
}

// ── Chef Caramel dialogue bubble ──────────────────────────────────────────────
const ChefBubble: React.FC<{ text: string }> = ({ text }) => (
  <div
    className="animate-fade-in max-w-lg mx-auto px-5 py-3 rounded-2xl border border-amber-500/30 text-center relative"
    style={{ background: 'rgba(30,15,0,0.92)', boxShadow: '0 0 30px rgba(251,191,36,0.12)' }}
  >
    <span className="text-2xl block mb-1">👨‍🍳</span>
    <p className="text-sm text-amber-100 leading-relaxed" style={{ fontFamily: 'Georgia,serif', fontStyle: 'italic' }}>
      "{text}"
    </p>
    <p className="text-[9px] text-amber-400/60 mt-1 font-black uppercase tracking-wider">— Chef Caramel</p>
  </div>
);

// ── Spotlight wrapper ─────────────────────────────────────────────────────────
const Spotlight: React.FC<{ id: string; active: boolean; onClick?: () => void; children: React.ReactNode }> = ({
  id, active, onClick, children,
}) => (
  <div
    id={id}
    onClick={onClick}
    className={`transition-all duration-500 rounded-2xl ${
      active
        ? 'ring-4 ring-amber-400/80 shadow-[0_0_30px_rgba(251,191,36,0.4)] opacity-100 cursor-pointer scale-105'
        : 'opacity-25 pointer-events-none'
    }`}
  >
    {children}
  </div>
);

// ── Graduation badge ceremony ─────────────────────────────────────────────────
const GraduationCeremony: React.FC<{ onContinue: () => void }> = ({ onContinue }) => {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 600),
      setTimeout(() => setPhase(2), 1800),
      setTimeout(() => setPhase(3), 3200),
      setTimeout(() => setPhase(4), 4500),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div
      className="absolute inset-0 z-[450] flex items-center justify-center animate-fade-in"
      style={{ background: 'rgba(5,2,0,0.94)' }}
    >
      <div className="text-center space-y-6 px-8 max-w-md">

        {/* Chef slides in */}
        <div className={`transition-all duration-700 ${phase >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <span className="text-8xl block">👨‍🍳</span>
          <p className="text-base text-amber-200/80 italic mt-2" style={{ fontFamily: 'Georgia,serif' }}>
            Chef Caramel steps forward…
          </p>
        </div>

        {/* Badge rises */}
        <div className={`transition-all duration-1000 ${phase >= 2 ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-75'}`}>
          <div className="relative inline-block">
            <span className="text-7xl block animate-bounce">🏅</span>
            {phase >= 2 && (
              <div className="absolute inset-0 rounded-full" style={{
                background: 'radial-gradient(circle, rgba(251,191,36,0.3) 0%, transparent 70%)',
                animation: 'ping 1.5s cubic-bezier(0,0,0.2,1) infinite'
              }} />
            )}
          </div>
        </div>

        {/* Title fades in */}
        <div className={`transition-all duration-700 delay-300 ${phase >= 3 ? 'opacity-100' : 'opacity-0'}`}>
          <p className="text-[10px] uppercase tracking-[0.4em] text-amber-400 font-black">Ganache Grove Bakery</p>
          <h1 className="text-4xl font-black text-white mt-2" style={{ fontFamily: FONT }}>
            Junior Baker
          </h1>
          <p className="text-sm text-amber-300/70 mt-1 italic" style={{ fontFamily: 'Georgia,serif' }}>
            Certified — with pride
          </p>
        </div>

        {/* Confetti dots & continue button */}
        <div className={`transition-all duration-700 ${phase >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="flex justify-center gap-2 mb-4">
            {['🎊','🎉','✨','🎊','🎉'].map((e, i) => (
              <span key={i} className="text-xl animate-bounce" style={{ animationDelay: `${i * 100}ms` }}>{e}</span>
            ))}
          </div>
          <p className="text-[12px] text-white/50 mb-4" style={{ fontFamily: 'Georgia,serif' }}>
            Bakery Shift is now unlocked!
          </p>
          <button
            onClick={onContinue}
            className="px-8 py-3 rounded-2xl font-black text-sm uppercase tracking-widest text-black cursor-pointer hover:scale-[1.03] active:scale-[0.97] transition-all"
            style={{
              fontFamily: 'Josefin Sans, sans-serif',
              background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
              boxShadow: '0 0 30px rgba(251,191,36,0.4)',
            }}
          >
            🧤 Start My First Shift →
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Main component ────────────────────────────────────────────────────────────
export const BakeryApprenticeship: React.FC<BakeryApprenticeshipProps> = ({ onComplete, onClose }) => {
  const { spendCoins } = useTTStore();
  const coinBalance = useTTStore(s => s.coins ?? 0);

  const [chapterIdx, setChapterIdx]   = useState(0);
  const [phase, setPhase]             = useState<AppPhase>('chapter');
  const [failCount, setFailCount]     = useState(0);
  const [activeEvent, setActiveEvent] = useState<GameEvent | null>(null);
  const [, forceUpdate]               = useState(0);

  // Single-oven state for baking chapter
  const ovenRef    = useRef<OvenState>(makeOven());
  const tickRef    = useRef(0);
  const doneRef    = useRef(false);
  const pulledRef  = useRef<ItemQuality | null>(null);

  const chapter = APPRENTICE_CHAPTERS[chapterIdx];
  const spotId  = chapter?.spotlight;

  // ── Advance chapter ─────────────────────────────────────────────────────────
  const advance = useCallback(() => {
    const next = chapterIdx + 1;
    if (next >= APPRENTICE_CHAPTERS.length - 1) {
      // Fire one random event before graduation
      const ev = POSSIBLE_EVENTS[Math.floor(Math.random() * 3)]; // first 3 are simple
      setActiveEvent({ ...ev, resolved: false });
      setPhase('event');
    } else if (next === APPRENTICE_CHAPTERS.length - 1) {
      setPhase('graduation');
    } else {
      setChapterIdx(next);
      if (APPRENTICE_CHAPTERS[next].action === 'wait') {
        startBaking();
      }
    }
  }, [chapterIdx]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Start the baking chapter (single oven simulation) ──────────────────────
  const startBaking = useCallback(() => {
    const TOFFEE_SPONGE = {
      id: 1, name: 'Toffee Sponge', icon: '🍮', requiredTemp: 160, bakeDuration: 28,
      tempLabel: 'LOW', driftSpeed: 5, burnSpeed: 0.9, goldenWidth: 22, category: 'dessert' as const,
      phrases: ['Rising...', 'Puffing up...', 'Almost set...', 'Setting nicely...'],
      story: "Your first bake!",
    };
    ovenRef.current = {
      ...makeOven(),
      recipe: TOFFEE_SPONGE,
      currentTemp: 120,
      status: 'preheating',
    };
    setPhase('baking');
  }, []);

  // ── Baking loop for tutorial ────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== 'baking') return;
    const interval = setInterval(() => {
      tickRef.current++;
      const tick = tickRef.current;
      const oven = ovenRef.current;
      if (!oven.recipe || oven.status === 'burnt' || oven.status === 'done') return;

      const u = { ...oven };

      if (oven.status === 'preheating') {
        u.preheatProgress = Math.min(100, oven.preheatProgress + (100 / PREHEAT_TICKS));
        const rise = (oven.recipe.requiredTemp - oven.currentTemp) * 0.12;
        u.currentTemp = Math.min(oven.recipe.requiredTemp + 5, oven.currentTemp + Math.max(1, rise));
        if (u.preheatProgress >= 100) u.status = 'baking';
      } else if (oven.status === 'baking' || oven.status === 'golden') {
        const bpp = (0.18 / oven.recipe.bakeDuration) * 100;
        u.bakeProgress = Math.min(100, oven.bakeProgress + bpp);

        if (tick - oven.lastDriftTick >= DRIFT_EVERY) {
          const drift = (Math.random() < 0.5 ? -1 : 1) * (oven.recipe.driftSpeed * 0.6);
          u.currentTemp = Math.max(80, Math.min(240, oven.currentTemp + drift));
          u.lastDriftTick = tick;
        }

        u.status = u.bakeProgress >= GOLDEN_START && u.bakeProgress < GOLDEN_END + 4 ? 'golden'
          : u.bakeProgress < GOLDEN_START ? 'baking' : oven.status;

        if (u.bakeProgress >= GOLDEN_END + 4 && !doneRef.current) {
          u.status = 'burnt';
          setFailCount(f => {
            const next = f + 1;
            if (next >= APPRENTICE_MAX_FAILS) setPhase('fail');
            return next;
          });
        }
      }

      ovenRef.current = u;
      forceUpdate(n => n + 1);
    }, 200);
    return () => clearInterval(interval);
  }, [phase]);

  // ── Pull item ───────────────────────────────────────────────────────────────
  const handlePull = () => {
    const oven = ovenRef.current;
    if (oven.status !== 'golden' || !oven.recipe) return;
    const diff = oven.currentTemp - oven.recipe.requiredTemp;
    const quality = qualityFor(diff, oven.bakeProgress);
    pulledRef.current = quality;
    doneRef.current = true;
    ovenRef.current = { ...oven, status: 'done', feedback: { quality, name: oven.recipe.name } };
    forceUpdate(n => n + 1);
    // Pause then advance to event chapter
    setTimeout(() => {
      setChapterIdx(APPRENTICE_CHAPTERS.findIndex(c => c.id === 9));
      advance();
    }, 1800);
  };

  // ── Handle event choice ─────────────────────────────────────────────────────
  const handleEventChoice = (good: boolean) => {
    if (!good) {
      setFailCount(f => {
        const next = f + 1;
        if (next >= APPRENTICE_MAX_FAILS) { setActiveEvent(null); setPhase('fail'); }
        return next;
      });
    }
    setActiveEvent(null);
    setPhase('graduation');
  };

  // ── Graduation complete ─────────────────────────────────────────────────────
  const handleGraduationComplete = () => {
    const stats = loadBakeryStats();
    stats.juniorBakerEarned = true;
    saveBakeryStats(stats);
    onComplete();
  };

  // ── Temp adjust ─────────────────────────────────────────────────────────────
  const adjustTemp = (delta: number) => {
    const oven = ovenRef.current;
    ovenRef.current = { ...oven, currentTemp: Math.max(50, Math.min(250, oven.currentTemp + delta)) };
    forceUpdate(n => n + 1);
  };

  const oven = ovenRef.current;

  // ── Render fail state ───────────────────────────────────────────────────────
  if (phase === 'fail') {
    return (
      <div className="absolute inset-0 z-[400] flex items-center justify-center"
        style={{ backgroundImage: `url(${pickRotatingWallpaper('games-arena')})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="absolute inset-0 bg-black/65" />
        <div className="relative z-10 max-w-sm w-full mx-4 p-8 rounded-[2rem] border border-amber-500/20 text-center"
          style={{ background: 'rgba(20,10,0,0.97)', boxShadow: '0 0 60px rgba(251,191,36,0.1)' }}>
          <span className="text-6xl block mb-3">👨‍🍳</span>
          <h2 className="text-2xl font-black text-amber-300" style={{ fontFamily: FONT }}>Not quite yet!</h2>
          <p className="text-sm text-white/60 italic mt-2 mb-6 leading-relaxed" style={{ fontFamily: 'Georgia,serif' }}>
            "Every baker burns a few loaves. The oven teaches patience — not panic."
          </p>
          <div className="space-y-3">
            <button
              onClick={() => {
                if (coinBalance >= APPRENTICE_RETRY_COST) spendCoins(APPRENTICE_RETRY_COST, 'Apprenticeship retry');
                setChapterIdx(0); setPhase('chapter'); setFailCount(0); doneRef.current = false; ovenRef.current = makeOven();
              }}
              className={`w-full py-3 rounded-2xl font-black text-sm uppercase tracking-wider transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer ${
                coinBalance >= APPRENTICE_RETRY_COST
                  ? 'bg-amber-500/20 border border-amber-500/35 text-amber-300 hover:bg-amber-500/30'
                  : 'bg-white/5 border border-white/10 text-white/50'
              }`}
              style={{ fontFamily: 'Josefin Sans, sans-serif' }}
            >
              {coinBalance >= APPRENTICE_RETRY_COST ? `🔄 Try Again — ${APPRENTICE_RETRY_COST} 🪙` : '🔄 Try Again — Free (low coins)'}
            </button>
            <button onClick={onClose}
              className="w-full py-2.5 rounded-2xl border border-white/10 text-white/40 text-sm hover:bg-white/5 transition cursor-pointer"
              style={{ fontFamily: 'Georgia,serif', fontStyle: 'italic' }}>
              Back to Arcade
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'graduation') {
    return <GraduationCeremony onContinue={handleGraduationComplete} />;
  }

  // ── Main render ─────────────────────────────────────────────────────────────
  return (
    <div className="w-full h-full flex flex-col overflow-hidden animate-fade-in relative">

        {/* Header */}
        <div className="px-6 pt-5 pb-3 border-b border-white/8 flex items-center justify-between shrink-0">
          <div>
            <p className="text-[8px] uppercase tracking-[0.35em] text-amber-400 font-black">Bakery Apprenticeship</p>
            <h1 className="text-lg font-black text-white" style={{ fontFamily: FONT }}>🎓 Learning the Craft</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex gap-1">
              {APPRENTICE_CHAPTERS.map((_, i) => (
                <div key={i} className={`h-1.5 rounded-full transition-all ${
                  i < chapterIdx ? 'w-4 bg-amber-400' :
                  i === chapterIdx ? 'w-6 bg-amber-400/80 animate-pulse' :
                  'w-2 bg-white/15'
                }`} />
              ))}
            </div>
            <button onClick={onClose} className="text-white/30 hover:text-white/60 text-xs transition cursor-pointer">✕</button>
          </div>
        </div>

        {/* Chapter content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">

          {/* Chapter title */}
          <div className="text-center">
            <p className="text-[9px] uppercase tracking-[0.3em] text-amber-400/60 font-black">
              Step {chapterIdx + 1} of {APPRENTICE_CHAPTERS.length}
            </p>
            <h2 className="text-xl font-black text-white mt-1" style={{ fontFamily: FONT }}>
              {chapter?.title}
            </h2>
          </div>

          {/* Chef dialogue */}
          {chapter?.chefSays && <ChefBubble text={chapter.chefSays} />}

          {/* ── Know Your Bakery — clickable items (chapters 1-5) ── */}
          {chapterIdx >= 1 && chapterIdx <= 5 && phase === 'chapter' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { id: 'flour-sack',  icon: '🌾', label: 'Flour Sack',      idx: 1 },
                { id: 'the-oven',    icon: '🔥', label: 'Oven',             idx: 2 },
                { id: 'temp-dial',   icon: '🌡️', label: 'Temperature Dial', idx: 3 },
                { id: 'cooling-rack',icon: '🍽️', label: 'Cooling Rack',     idx: 4 },
                { id: 'order-bell',  icon: '🔔', label: 'Order Bell',       idx: 5 },
              ].map(item => (
                <Spotlight key={item.id} id={item.id} active={spotId === item.id}
                  onClick={() => { if (spotId === item.id) { setChapterIdx(item.idx); } }}>
                  <div className="p-4 border border-white/10 rounded-2xl text-center bg-white/4">
                    <span className="text-3xl block mb-1">{item.icon}</span>
                    <p className="text-[11px] font-black text-white">{item.label}</p>
                  </div>
                </Spotlight>
              ))}
            </div>
          )}

          {/* ── Load Oven chapter (6) ── */}
          {chapterIdx === 6 && phase === 'chapter' && (
            <div className="flex justify-center">
              <Spotlight id="oven-load" active={spotId === 'the-oven'}
                onClick={() => { setChapterIdx(7); }}>
                <div className="p-8 border border-amber-500/25 rounded-3xl text-center bg-amber-950/10 cursor-pointer">
                  <span className="text-5xl block mb-2">🔥</span>
                  <p className="text-sm font-black text-amber-300">Click to Load Oven</p>
                  <p className="text-[10px] text-white/40 mt-1">The dough is ready</p>
                </div>
              </Spotlight>
            </div>
          )}

          {/* ── Temperature Practice + Baking ── */}
          {(chapterIdx >= 7 && phase === 'baking') && oven.recipe && (
            <div className="space-y-4">
              {/* Single oven display */}
              <div className="rounded-[1.8rem] border border-amber-500/20 bg-amber-950/8 p-5 space-y-4">
                <div className="text-center">
                  <span className={`text-5xl block mb-1 ${oven.status === 'golden' ? 'animate-bounce' : ''}`}>
                    {oven.recipe.icon}
                  </span>
                  <p className="text-sm font-black text-white">{oven.recipe.name}</p>
                  <p className="text-[10px] text-white/30 italic">{oven.recipe.story}</p>
                </div>

                {/* Preheat */}
                {oven.status === 'preheating' && (
                  <div className="space-y-1">
                    <p className="text-[10px] text-cyan-400 text-center font-black">♨️ Preheating...</p>
                    <div className="h-3 bg-white/8 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-cyan-700 to-cyan-400 rounded-full transition-all"
                        style={{ width: `${oven.preheatProgress}%` }} />
                    </div>
                  </div>
                )}

                {/* Temperature */}
                <Spotlight id="temp-dial" active={chapterIdx === 7 && oven.status !== 'preheating'}>
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px]">
                      <span className="text-white/40 font-black">Temperature</span>
                      <span className={`font-mono font-black ${tempColor(oven.currentTemp - oven.recipe.requiredTemp)}`}>
                        {Math.round(oven.currentTemp)}°C
                      </span>
                    </div>
                    <div className="h-3 bg-white/8 rounded-full overflow-hidden relative">
                      <div className="absolute top-0 w-0.5 h-full bg-white/60 z-10"
                        style={{ left: `${(oven.recipe.requiredTemp / 250) * 100}%` }} />
                      <div className="h-full rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(100, (oven.currentTemp / 250) * 100)}%`,
                          background: tempBarColor(oven.currentTemp - oven.recipe.requiredTemp) }} />
                    </div>
                    <p className="text-[9px] text-center font-black" style={{
                      color: Math.abs(oven.currentTemp - oven.recipe.requiredTemp) <= 12 ? '#34d399' : '#fb923c'
                    }}>
                      Target: {oven.recipe.requiredTemp}°C ({oven.recipe.tempLabel})
                    </p>
                    <div className="grid grid-cols-4 gap-2">
                      {([-10, -5, 5, 10] as const).map(d => (
                        <button key={d} onClick={() => adjustTemp(d)}
                          className={`py-2 text-sm font-black rounded-xl border transition active:scale-95 cursor-pointer ${
                            d < 0 ? 'bg-blue-500/15 border-blue-500/25 text-blue-300 hover:bg-blue-500/25'
                                  : 'bg-orange-500/15 border-orange-500/25 text-orange-300 hover:bg-orange-500/25'
                          }`}>
                          {d > 0 ? `+${d}°` : `${d}°`}
                        </button>
                      ))}
                    </div>
                  </div>
                </Spotlight>

                {/* Bake progress bar */}
                {(oven.status === 'baking' || oven.status === 'golden' || oven.status === 'burnt') && (
                  <Spotlight id="progress-bar" active={chapterIdx === 8}>
                    <div className="space-y-2">
                      <div className="h-4 bg-white/8 rounded-full overflow-hidden relative">
                        <div className="absolute top-0 h-full bg-amber-500/20"
                          style={{ left: `${GOLDEN_START}%`, width: `${GOLDEN_END - GOLDEN_START}%` }} />
                        <div
                          className={`h-full rounded-full transition-all duration-150 ${
                            oven.status === 'burnt' ? 'bg-rose-600' :
                            oven.status === 'golden' ? 'bg-gradient-to-r from-amber-600 to-yellow-400' :
                            'bg-gradient-to-r from-orange-800 to-orange-500'
                          }`}
                          style={{ width: `${oven.bakeProgress}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[9px]">
                        <span className="text-white/20">Raw</span>
                        <span className={`font-black ${oven.status === 'golden' ? 'text-amber-400 animate-pulse' : 'text-amber-400/40'}`}>
                          🟡 Golden Zone {GOLDEN_START}–{GOLDEN_END}%
                        </span>
                        <span className="text-rose-400/40">🔥 Burn</span>
                      </div>
                    </div>
                  </Spotlight>
                )}

                {/* Done feedback */}
                {oven.status === 'done' && oven.feedback && (
                  <div className="text-center py-4 animate-fade-in">
                    <span className="text-5xl block mb-2">{qualityLabel(oven.feedback.quality).icon}</span>
                    <p className={`text-xl font-black ${qualityLabel(oven.feedback.quality).color}`}>
                      {qualityLabel(oven.feedback.quality).label}!
                    </p>
                    <div className="flex justify-center gap-1 mt-1">
                      {[1,2,3,4,5].map(s => (
                        <span key={s} className={`text-base ${s <= starsFor(oven.feedback!.quality) ? 'text-amber-400' : 'text-white/15'}`}>★</span>
                      ))}
                    </div>
                    <p className="text-sm text-white/50 mt-2 italic" style={{ fontFamily: 'Georgia,serif' }}>
                      Well done! Preparing incident practice…
                    </p>
                  </div>
                )}

                {/* Pull button */}
                <Spotlight id="pull-btn" active={oven.status === 'golden'}>
                  <button
                    onClick={handlePull}
                    disabled={oven.status !== 'golden'}
                    className={`w-full py-3 rounded-2xl font-black text-sm uppercase tracking-wider transition-all ${
                      oven.status === 'golden'
                        ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-black animate-pulse hover:scale-[1.02] cursor-pointer shadow-[0_0_20px_rgba(251,191,36,0.4)]'
                        : 'bg-white/4 text-white/20 border border-white/8 cursor-not-allowed'
                    }`}
                    style={{ fontFamily: 'Josefin Sans, sans-serif' }}
                  >
                    {oven.status === 'golden' ? '🧤 Pull Out Now!' :
                     oven.status === 'preheating' ? '♨️ Heating…' :
                     oven.status === 'done' ? '✓ Pulled!' :
                     '⏳ Baking…'}
                  </button>
                </Spotlight>
              </div>
            </div>
          )}

          {/* ── Welcome chapter (0) ── */}
          {chapterIdx === 0 && (
            <div className="flex justify-center">
              <button
                onClick={() => setChapterIdx(1)}
                className="px-8 py-3 rounded-2xl font-black text-sm uppercase tracking-widest text-black cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all"
                style={{
                  fontFamily: 'Josefin Sans, sans-serif',
                  background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
                  boxShadow: '0 4px 20px rgba(6,182,212,0.3)',
                }}
              >
                🎓 Begin Apprenticeship
              </button>
            </div>
          )}

          {/* ── Temp practice advance button ── */}
          {chapterIdx === 7 && phase === 'baking' && oven.status !== 'preheating' && (
            <div className="text-center">
              <p className="text-[11px] text-amber-400/60 italic mb-2" style={{ fontFamily: 'Georgia,serif' }}>
                {Math.abs(oven.currentTemp - (oven.recipe?.requiredTemp ?? 160)) <= 15
                  ? '✓ Temperature is in range! Now watch the bake progress…'
                  : 'Adjust the temperature to match the target, then watch the bake.'}
              </p>
              {Math.abs(oven.currentTemp - (oven.recipe?.requiredTemp ?? 160)) <= 15 && (
                <button onClick={() => setChapterIdx(8)}
                  className="px-6 py-2 rounded-xl text-xs font-black uppercase text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/10 transition cursor-pointer"
                  style={{ fontFamily: 'Josefin Sans, sans-serif' }}>
                  Continue → Watch it Bake
                </button>
              )}
            </div>
          )}
        </div>

        {/* Event popup */}
        {phase === 'event' && activeEvent && (
          <div className="absolute inset-0 z-30 flex items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.75)' }}>
            <div className="animate-fade-in text-center max-w-sm w-full mx-4 p-6 rounded-[2rem] border border-amber-400/30"
              style={{ background: 'rgba(20,10,2,0.97)', boxShadow: '0 0 60px rgba(251,191,36,0.2)' }}>
              <div className="text-5xl mb-3">{activeEvent.icon}</div>
              <h3 className="text-lg font-black text-amber-300 uppercase" style={{ fontFamily: FONT }}>
                {activeEvent.title}
              </h3>
              <p className="text-sm text-white/70 mt-1 mb-5 italic" style={{ fontFamily: 'Georgia,serif' }}>
                {activeEvent.body}
              </p>
              <p className="text-[10px] text-amber-400/50 mb-4">Choose wisely — this is your training!</p>
              <div className={`grid gap-2 grid-cols-${activeEvent.choices.length}`}>
                {activeEvent.choices.map((c, i) => (
                  <button key={i} onClick={() => handleEventChoice(c.good)}
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
        )}

        {/* Footer — fail count indicator */}
        {failCount > 0 && (
          <div className="px-6 py-2 border-t border-white/6 flex items-center gap-2 shrink-0">
            <div className="flex gap-1">
              {[0,1,2].map(i => (
                <span key={i} className={`text-sm ${i < failCount ? 'text-rose-400' : 'text-white/15'}`}>❤️</span>
              ))}
            </div>
            <p className="text-[9px] text-white/30">{APPRENTICE_MAX_FAILS - failCount} attempts remaining</p>
          </div>
        )}
      </div>
  );
};
