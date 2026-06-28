import React, { useState, useEffect } from 'react';
import { CANAL_SERIES, getCanalProgressPct } from '../../data/series/series1_canal';
import { FONT } from '../../lib/uiConstants';
import { CanalMaterialsPanel } from './CanalMaterialsPanel';
import { CanalAssignmentPanel } from './CanalAssignmentPanel';

interface SeriesPopupProps {
  isOpen: boolean;
  onClose: () => void;
  completedSeriesSteps: string[];
  completeSeriesStep: (id: string, optionLabel?: string) => void;
  addSkillXP: (cat: string, amt: number) => void;
  addLegacy: (amt: number) => void;
  addCoins: (amt: number, desc: string) => void;
  spendCoins: (amt: number, desc: string) => boolean;
  coins: number;
  skills: any;
  travellerName: string;
  triggerFeedback: (msg: string) => void;
  viewedStepIndex: number;
  setViewedStepIndex: React.Dispatch<React.SetStateAction<number>>;
  setSubPage: (subPage: any) => void;
  headerHidden: boolean;
  setHeaderHidden: (v: boolean) => void;
}

interface StepMaterial {
  name: string;
  cost: number;
  description: string;
  icon: string;
}

const STEP_MATERIALS: Record<string, StepMaterial> = {
  'canal-s1-1': {
    name: 'Survey Clipboards & Ink',
    cost: 10,
    description: 'A set of cedar clipboards and permanent charcoal ink for gathering resident testimonies.',
    icon: '📋✍️',
  },
  'canal-s1-2': {
    name: 'Drafting Instruments & Blueprints',
    cost: 12,
    description: 'Precision brass compasses and master failure maps to analyze stress points.',
    icon: '📐🗺️',
  },
  'canal-s1-3': {
    name: 'Reinforced Sandbags & Ropes',
    cost: 15,
    description: 'Heavy duty hemp bags and high-tension rope from Mrs. Petalworth’s supply.',
    icon: '📦🪵',
  },
  'canal-s1-4': {
    name: 'Heavy Clearing Tools',
    cost: 18,
    description: 'Tempered steel axes and pulleys designed by Blacksmith Crumblewise.',
    icon: '🪓⚙️',
  },
  'canal-s1-5': {
    name: 'Premium Vellum & Printing Ink',
    cost: 20,
    description: 'High-grade paper pulp and dye for the Ganache Gazette commemorative celebration edition.',
    icon: '🗞️🖋️',
  },
};

export const SeriesPopup: React.FC<SeriesPopupProps> = ({
  isOpen,
  onClose,
  completedSeriesSteps = [],
  completeSeriesStep,
  addSkillXP,
  addLegacy,
  addCoins,
  spendCoins,
  coins,
  skills,
  travellerName,
  triggerFeedback,
  viewedStepIndex,
  setViewedStepIndex,
  setSubPage,
  headerHidden,
  setHeaderHidden,
}) => {
  const [showCanalAssignment, setShowCanalAssignment] = useState<boolean>(false);
  const [materialsPurchased, setMaterialsPurchased] = useState<boolean>(false);
  const [minigameSolved, setMinigameSolved] = useState<boolean>(false);
  const [expertConsulted, setExpertConsulted] = useState<boolean>(false);
  const [assignmentIndex, setAssignmentIndex] = useState<number>(0);

  const currentSeriesStep = CANAL_SERIES[viewedStepIndex];

  useEffect(() => {
    if (currentSeriesStep) {
      const isCompleted = completedSeriesSteps.includes(currentSeriesStep.id);
      const purchased = isCompleted || localStorage.getItem(`tt_s1_purchased_${currentSeriesStep.id}`) === 'true';
      const solved = isCompleted || localStorage.getItem(`tt_s1_solved_${currentSeriesStep.id}`) === 'true';
      
      setMaterialsPurchased(purchased);
      setMinigameSolved(solved);
    }
  }, [viewedStepIndex, completedSeriesSteps, currentSeriesStep]);

  useEffect(() => {
    if (currentSeriesStep) {
      setExpertConsulted(localStorage.getItem(`tt_s1_expert_${currentSeriesStep.id}`) === 'true');
    }
  }, [viewedStepIndex, currentSeriesStep]);

  useEffect(() => {
    setAssignmentIndex(0);
    setShowCanalAssignment(false);
    setHeaderHidden(false);
  }, [viewedStepIndex, setHeaderHidden]);

  if (!isOpen || !currentSeriesStep) return null;

  const skillXP = (k: string) => (skills as Record<string, number>)?.[k] || 0;
  const topSkill = ['builder','explorer','healer'].reduce((a,b) => skillXP(a) >= skillXP(b) ? a : b);
  const skillLabel: Record<string,string> = { builder:'Builder', explorer:'Explorer', healer:'Helper' };
  const skillGrad: Record<string,string> = { builder:'from-orange-500 to-amber-400', explorer:'from-cyan-500 to-teal-400', healer:'from-pink-500 to-rose-400' };
  const skillEmoji: Record<string,string> = { builder:'🔨', explorer:'🧭', healer:'🌿' };
  const isCompleted = completedSeriesSteps.includes(currentSeriesStep.id);
  const xp = skillXP(topSkill);
  const lvl = Math.floor(xp / 10) + 1;
  const pct = (xp % 10) * 10;

  const getMinigameSubmitLabel = (stepId: string) => {
    switch (stepId) {
      case 'canal-s1-1': return 'Submit Survey & Load Assignment 2 ➡️';
      case 'canal-s1-2': return 'Submit Valve Alignment & Load Assignment 2 ➡️';
      case 'canal-s1-3': return 'Submit Sandbag Positions & Load Assignment 2 ➡️';
      case 'canal-s1-4': return 'Submit Log Sequence & Load Assignment 2 ➡️';
      case 'canal-s1-5': return 'Publish Newspaper Layout & Load Assignment 2 ➡️';
      default: return 'Submit Assignment 1 & Load Assignment 2 ➡️';
    }
  };

  const handlePurchaseMaterials = (cost: number, itemName: string) => {
    if (spendCoins(cost, `Material Purchase: ${itemName}`)) {
      setMaterialsPurchased(true);
      localStorage.setItem(`tt_s1_purchased_${currentSeriesStep?.id}`, 'true');
      triggerFeedback(`🛒 Purchased ${itemName}! -${cost} Coins`);
    } else {
      triggerFeedback(`❌ Not enough coins! Need ${cost} coins.`);
    }
  };

  const handleConsultExpert = () => {
    if (!currentSeriesStep) return;
    if (spendCoins(5, `Expert Consultation: ${currentSeriesStep.title}`)) {
      setExpertConsulted(true);
      localStorage.setItem(`tt_s1_expert_${currentSeriesStep.id}`, 'true');
      triggerFeedback('🧠 Expert consulted! Read their hints below.');
    } else {
      triggerFeedback('❌ Not enough coins! Need 5 coins.');
    }
  };

  const cleanUpStepFlags = () => {
    if (!currentSeriesStep) return;
    localStorage.removeItem(`tt_s1_purchased_${currentSeriesStep.id}`);
    localStorage.removeItem(`tt_s1_solved_${currentSeriesStep.id}`);
    localStorage.removeItem(`tt_s1_expert_${currentSeriesStep.id}`);
  };



  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[230] p-6 select-none backdrop-blur-none animate-fade-in">
      <div className="relative bg-[#0a0a0c] border border-white/10 rounded-3xl h-[92vh] w-[92vw] max-h-[92vh] max-w-[92vw] overflow-hidden flex shadow-2xl animate-fade-in">
        {!showCanalAssignment ? (
          <>
            {/* ══ LEFT — Strictly 70% width cinematic panel ══ */}
            <div className="relative shrink-0 overflow-hidden w-[70%] h-full flex flex-col bg-[#0b0a09] p-6">
              {/* Image container frame */}
              <div className="w-full h-full border border-white/10 rounded-2xl overflow-hidden relative flex items-center justify-center bg-[#080706] shadow-inner">
                <img
                  src={currentSeriesStep.imagePath}
                  alt={currentSeriesStep.title}
                  className="w-full h-full object-contain"
                  onError={(e) => { (e.target as HTMLImageElement).src = '/Assets/Ganache Grove/Scene_0.1.png'; }}
                />
                {/* Vignette: top & bottom */}
                <div className="absolute inset-0 pointer-events-none" style={{
                  background: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.4) 100%)',
                }} />
              </div>

              {/* Bottom Overlay: 10-step dots + progress */}
              <div className="absolute bottom-0 left-0 right-0 p-6 z-10 bg-gradient-to-t from-black/95 via-black/50 to-transparent">
                <div className="flex gap-1.5 items-center justify-center mb-2">
                  {CANAL_SERIES.map((s, i) => {
                    const done = completedSeriesSteps.includes(s.id);
                    const current = s.id === currentSeriesStep.id;
                    return (
                      <div
                        key={s.id}
                        title={`Day ${i+1}: ${s.title}`}
                        className="rounded-full transition-all duration-500"
                        style={{
                          width: current ? 20 : 8, height: 6,
                          background: done ? '#34d399' : current ? '#f59e0b' : 'rgba(255,255,255,0.2)',
                          boxShadow: done ? '0 0 6px rgba(52,211,153,0.7)' : current ? '0 0 8px rgba(245,158,11,0.9)' : 'none',
                        }}
                      />
                    );
                  })}
                </div>
                <div className="flex justify-between">
                  <p className="text-[9.5px] text-white/45 uppercase tracking-widest font-mono">Mossberry Canal Emergency</p>
                  <p className="text-[9.5px] text-amber-400 font-black">{getCanalProgressPct(completedSeriesSteps)}% participated</p>
                </div>
                <div className="w-full h-[3px] bg-white/15 rounded-full mt-1.5 overflow-hidden">
                  <div className="h-full rounded-full" style={{
                    width: `${Math.round((currentSeriesStep.stepNumber / CANAL_SERIES.length) * 100)}%`,
                    background: 'linear-gradient(to right,#f59e0b,#34d399)',
                    transition: 'width 0.7s ease',
                  }} />
                </div>
              </div>
            </div>

            {/* Static Divider with Floating vertical ACTION handle */}
            <div className="relative shrink-0 w-px bg-white/10 z-[270] flex items-center justify-center">
              <button
                onClick={() => setShowCanalAssignment(true)}
                className="absolute w-8 h-40 rounded-full border border-amber-500/40 bg-gradient-to-b from-[#1c1917]/95 to-[#0c0a09]/95 flex flex-col items-center justify-between py-4 shadow-[0_4px_25px_rgba(245,158,11,0.35)] cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95 z-50 transform -translate-x-1/2"
                title="Open Assignment Workspace"
              >
                <span className="text-[10px] text-amber-400 animate-pulse">⚡</span>
                <div className="flex flex-col items-center gap-1 font-black text-[9px] tracking-widest text-amber-400 font-mono">
                  <span>A</span>
                  <span>C</span>
                  <span>T</span>
                  <span>I</span>
                  <span>O</span>
                  <span>N</span>
                </div>
                <span className="text-[10px] text-amber-400">▶</span>
              </button>
            </div>

            {/* ══ RIGHT — Scrollable content panel (strictly 30% width) ══ */}
            <div
              className="w-[30%] shrink-0 min-w-0 flex flex-col overflow-hidden animate-fade-in animate-fade-in"
              style={{
                borderLeft: '1px solid rgba(255,255,255,0.06)',
                backgroundColor: 'rgba(0,0,0,0.60)',
              }}
            >
              {/* Top bar: category + headline + navigation */}
              <div className="px-6 pt-6 pb-4 shrink-0 flex flex-col justify-between gap-3"
                   style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.01)' }}>
                <div className="min-w-0">
                  <span className="text-[11px] font-black uppercase tracking-[0.2em] text-amber-400 block">
                    {currentSeriesStep.category}
                  </span>
                  <h2 className="text-[1.25rem] font-brand text-yellow-50 uppercase leading-tight mt-1 tracking-wide"
                      style={{ fontFamily: FONT, textShadow: '0 2px 20px rgba(245,158,11,0.2)' }}>
                    {currentSeriesStep.title}
                  </h2>
                </div>

                {/* Navigation Buttons in Colored Text */}
                <div className="flex items-center gap-1.5 shrink-0 justify-between">
                  <button
                    disabled={viewedStepIndex === 0}
                    onClick={() => setViewedStepIndex(prev => prev - 1)}
                    className={`font-black text-[11px] px-2.5 py-1.5 rounded-xl border transition ${
                      viewedStepIndex === 0
                        ? 'border-white/5 text-white/20 bg-transparent cursor-not-allowed'
                        : 'border-amber-500/30 bg-amber-500/10 text-amber-400 hover:bg-amber-500/25 active:scale-95'
                    }`}
                  >
                    ◀ PREV
                  </button>
                  <span className="text-[11.5px] font-black text-amber-300 font-mono px-1">
                    DAY {currentSeriesStep.stepNumber}
                  </span>
                  <button
                    disabled={viewedStepIndex >= CANAL_SERIES.length - 1}
                    onClick={() => setViewedStepIndex(prev => prev + 1)}
                    className={`font-black text-[11px] px-2.5 py-1.5 rounded-xl border transition ${
                      viewedStepIndex >= CANAL_SERIES.length - 1
                        ? 'border-white/5 text-white/20 bg-transparent cursor-not-allowed'
                        : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/25 active:scale-95'
                    }`}
                    title={viewedStepIndex >= CANAL_SERIES.length - 1 ? 'Last day' : 'Next day'}
                  >
                    NEXT ▶
                  </button>
                  <button
                    onClick={onClose}
                    className="font-black text-[11px] px-2.5 py-1.5 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/25 transition active:scale-95 ml-1"
                  >
                    ✕ CLOSE
                  </button>
                </div>
              </div>

              {/* Scrollable body */}
              <div className="flex-1 overflow-y-auto custom-scrollbar px-6 py-5 flex flex-col gap-4">
                {/* ── Player Skill ── */}
                <div className="flex items-center gap-3 p-3 rounded-2xl"
                     style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-[17px] shrink-0 bg-gradient-to-br ${skillGrad[topSkill]}`}>
                    {skillEmoji[topSkill]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-rose-300">Your Top Skill · {skillLabel[topSkill]}</span>
                      <span className="text-[11px] text-rose-300 font-black">Lv.{lvl}</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                      <div className={`h-full rounded-full bg-gradient-to-r ${skillGrad[topSkill]}`} style={{ width: `${pct}%`, transition: 'width 0.6s' }} />
                    </div>
                    <p className="text-[11px] text-white/40 mt-1">
                      Participating rewards <span className="text-cyan-300 font-bold">+{currentSeriesStep.rewards.xp} {currentSeriesStep.rewards.xpSkill.toUpperCase()} XP</span>
                    </p>
                  </div>
                </div>

                {/* ── Town Activity Feed / Professionals ── */}
                <div>
                  <span className="text-[11px] font-black uppercase tracking-[0.2em] text-emerald-400 block mb-2">🏙️ Town Professionals — Active Right Now</span>
                  <div className="space-y-1.5">
                    {(() => {
                      const dotColors = ['#f59e0b', '#3b82f6', '#10b981', '#a855f7', '#ec4899'];
                      return currentSeriesStep.professionals.map((pro: string, i: number) => {
                        const parts = pro.split(' · ');
                        const name = parts[0];
                        const role = parts.slice(1).join(' · ');
                        return (
                          <div key={pro} className="flex items-center gap-2.5 px-3 py-2 rounded-xl"
                               style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                            <span className="w-2 h-2 rounded-full shrink-0" style={{ background: dotColors[i % 5], boxShadow: `0 0 6px ${dotColors[i % 5]}` }} />
                            <div className="flex-1 min-w-0">
                              <span className="text-[12.5px] font-bold text-white block">{name}</span>
                              {role && <span className="text-[11px] text-stone-300 block">{role}</span>}
                            </div>
                          </div>
                        );
                      });
                    })()}
                  </div>
                </div>

                {/* Divider */}
                <div className="h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(245,158,11,0.2), transparent)' }} />

                {/* ── Assignment Preview & Status ── */}
                <div>
                  <span className="text-[11px] font-black uppercase tracking-[0.2em] text-amber-400 block mb-2">🎯 Task Checklist & Status</span>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[14px] font-black text-amber-300 flex-1">{currentSeriesStep.playerAssignment.title}</span>
                      <span className={`text-[11px] font-black uppercase px-2 py-0.5 rounded-full shrink-0 ${
                        isCompleted 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                          : 'bg-amber-400/10 text-amber-400 border border-amber-400/20'
                      }`}>
                        {isCompleted ? '✓ Completed' : '⚡ Active'}
                      </span>
                    </div>
                    <p className="text-[13px] text-stone-200/90 leading-relaxed font-sans">
                      {currentSeriesStep.playerAssignment.description}
                    </p>

                    {/* Status Breakdown items */}
                    <div className="space-y-1.5 pt-2 border-t border-white/5">
                      <div className="flex items-center justify-between text-[12px]">
                        <span className="text-white/40">Step 1: Materials Purchase</span>
                        <span className={materialsPurchased ? 'text-emerald-400 font-bold' : 'text-neutral-500 font-bold'}>
                          {materialsPurchased ? '✓ Purchased' : '⏳ Pending'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[12px]">
                        <span className="text-white/40">Step 2: Minigame Alignment</span>
                        <span className={minigameSolved ? 'text-emerald-400 font-bold' : 'text-neutral-500 font-bold'}>
                          {minigameSolved ? '✓ Solved' : '⏳ Pending'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[12px]">
                        <span className="text-white/40">Step 3: Math Calculation</span>
                        <span className={assignmentIndex > 1 ? 'text-emerald-400 font-bold' : 'text-neutral-500 font-bold'}>
                          {assignmentIndex > 1 ? '✓ Verified' : '⏳ Pending'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[12px]">
                        <span className="text-white/40">Step 4: Role Contribution</span>
                        <span className={isCompleted ? 'text-emerald-400 font-bold' : 'text-neutral-500 font-bold'}>
                          {isCompleted ? '✓ Logged' : '⏳ Pending'}
                        </span>
                      </div>
                    </div>

                    {/* Workspace shortcut button */}
                    {!isCompleted && (
                      <button
                        onClick={() => setShowCanalAssignment(true)}
                        className="w-full mt-2 py-2 text-center rounded-xl text-[12px] font-black uppercase tracking-wider border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 shadow-[0_0_12px_rgba(52,211,153,0.15)] transition-all duration-300"
                      >
                        ⚡ Open Assignment Workspace ▶
                      </button>
                    )}
                  </div>
                </div>

                {/* ── Rowan & Julie ── */}
                <div className="flex flex-col gap-3">
                  <div className="p-4 rounded-2xl space-y-2"
                       style={{ background: 'rgba(120,53,15,0.25)', border: '1px solid rgba(245,158,11,0.25)' }}>
                    <div className="flex items-center gap-2">
                      <span className="text-base">📝</span>
                      <div>
                        <span className="text-[11px] font-black uppercase tracking-wider text-amber-400 block">Rowan Thistle</span>
                        <span className="text-[10px] text-white/30 uppercase tracking-wider">Community Coordinator</span>
                      </div>
                    </div>
                    <p className="text-[12.5px] text-stone-200 italic leading-relaxed">"Hey {travellerName || 'Yogesh'}! {currentSeriesStep.rowanNote}"</p>
                  </div>
                  <div className="p-4 rounded-2xl space-y-2"
                       style={{ background: 'rgba(88,28,135,0.25)', border: '1px solid rgba(167,139,250,0.25)' }}>
                    <div className="flex items-center gap-2">
                      <span className="text-base">📰</span>
                      <div>
                        <span className="text-[11px] font-black uppercase tracking-wider text-purple-400 block">Julie Frost</span>
                        <span className="text-[10px] text-white/30 uppercase tracking-wider">Ganache Gazette</span>
                      </div>
                    </div>
                    <p className="text-[12.5px] text-stone-200 italic leading-relaxed">"Hey {travellerName || 'Yogesh'}! {currentSeriesStep.julieNote}"</p>
                  </div>
                </div>

                {/* ── Rewards ── */}
                <div className="rounded-2xl px-5 py-4"
                     style={{ background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <span className="text-[11px] font-black uppercase tracking-[0.2em] text-cyan-400 block mb-3">🏆 Rewards for Participating</span>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { label: `✨ +${currentSeriesStep.rewards.xp} ${currentSeriesStep.rewards.xpSkill.toUpperCase()} XP`, color: '#67e8f9' },
                      ...(currentSeriesStep.rewards.coins > 0 ? [{ label: `🪙 +${currentSeriesStep.rewards.coins} Coins`, color: '#6ee7b7' }] : []),
                      ...(currentSeriesStep.rewards.influence ? [{ label: `⭐ +${currentSeriesStep.rewards.influence} Influence`, color: '#fcd34d' }] : []),
                      ...(currentSeriesStep.rewards.badgeProgress ? [{ label: `🏅 ${currentSeriesStep.rewards.badgeProgress}`, color: '#c4b5fd' }] : []),
                    ].map(r => (
                      <div key={r.label} className="px-3 py-1.5 rounded-xl text-[12.5px] font-black"
                           style={{ background: `${r.color}12`, border: `1px solid ${r.color}22`, color: r.color }}>
                        {r.label}
                      </div>
                    ))}
                  </div>
                  <p className="text-[11px] text-white/25 italic mt-3">
                    The canal project continues whether you help or not. Your contributions are permanently recorded.
                  </p>
                </div>

                <div className="h-8 shrink-0" />
              </div>
            </div>
          </>
        ) : (
          /* ══ 100% Wide Assignment Page ══ */
          <div
            className="w-full h-full flex flex-col p-8 select-none pr-14"
            style={{
              background: 'radial-gradient(circle at top left, rgba(16,185,129,0.05), transparent 60%)',
              backgroundColor: 'rgba(0,0,0,0.60)',
            }}
          >
            {/* Header Row */}
            <div className="relative flex justify-between items-center border-b border-white/5 pb-4 shrink-0">
              <div>
                <span className="text-[12px] font-black uppercase tracking-[0.25em] text-emerald-400">Mossberry Canal Emergency</span>
                <h3 className="text-[1.525rem] font-brand text-yellow-50 uppercase leading-none mt-1 tracking-wide" style={{ fontFamily: FONT }}>
                  Assignment Workspace — Day {currentSeriesStep.stepNumber}
                </h3>
              </div>
              
              {/* Integrated Navigation and Close controls in header */}
              <div className="flex items-center gap-2">
                <button
                  disabled={viewedStepIndex === 0}
                  onClick={() => setViewedStepIndex(prev => prev - 1)}
                  className={`font-black text-[13px] px-3 py-2 rounded-xl border transition ${
                    viewedStepIndex === 0
                      ? 'border-white/5 text-white/20 bg-transparent cursor-not-allowed'
                      : 'border-amber-500/30 bg-amber-500/10 text-amber-400 hover:bg-amber-500/25 active:scale-95'
                  }`}
                >
                  ◀ PREV
                </button>
                <span className="text-[14px] font-black text-amber-300 font-mono px-2">
                  DAY {currentSeriesStep.stepNumber}
                </span>
                <button
                  disabled={viewedStepIndex >= CANAL_SERIES.length - 1}
                  onClick={() => setViewedStepIndex(prev => prev + 1)}
                  className={`font-black text-[13px] px-3 py-2 rounded-xl border transition ${
                    viewedStepIndex >= CANAL_SERIES.length - 1
                      ? 'border-white/5 text-white/20 bg-transparent cursor-not-allowed'
                      : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/25 active:scale-95'
                  }`}
                  title={viewedStepIndex >= CANAL_SERIES.length - 1 ? 'Last day' : 'Next day'}
                >
                  NEXT ▶
                </button>
                <button
                  onClick={onClose}
                  className="font-black text-[13px] px-3 py-2 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/25 transition active:scale-95 ml-2"
                >
                  ✕ CLOSE
                </button>
              </div>
            </div>

            {/* Row 1: Context and Guidance Details */}
            <div className="grid grid-cols-2 gap-6 mt-4 shrink-0 min-h-[120px] max-h-[160px]">
              {/* Left Column: What's Happening in Town */}
              <div className="p-4 rounded-2xl bg-[#131317]/50 border border-white/5 flex flex-col justify-center gap-1.5 overflow-y-auto custom-scrollbar">
                <span className="text-[12px] font-black uppercase tracking-[0.25em] text-cyan-400 block">📋 What's Happening in Town</span>
                <p className="text-[15px] text-neutral-300 leading-relaxed font-medium">{currentSeriesStep.storyContext}</p>
              </div>

              {/* Right Column: Expert Hint / Rewards summary */}
              <div className="p-4 rounded-2xl bg-[#131317]/50 border border-white/5 flex flex-col justify-between gap-1 overflow-y-auto custom-scrollbar">
                <div className="flex justify-between items-start">
                  <span className="text-[12px] font-black uppercase tracking-[0.25em] text-emerald-400">💡 Guidance & Rewards</span>
                  {/* Compact Rewards Badge */}
                  <div className="flex gap-1.5">
                    <span className="text-[11.5px] px-1.5 py-0.5 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-black">
                      XP: +{currentSeriesStep.rewards.xp}
                    </span>
                    {currentSeriesStep.rewards.coins > 0 && (
                      <span className="text-[11.5px] px-1.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-black">
                        Coins: +{currentSeriesStep.rewards.coins}
                      </span>
                    )}
                  </div>
                </div>

                {/* Interactive hint display or Complete state or Consult expert button */}
                {isCompleted ? (
                  <div className="text-[13.5px] text-emerald-400 font-medium italic">
                    ✓ Day {currentSeriesStep.stepNumber} is fully resolved! The town benefits from your quick coordination.
                  </div>
                ) : expertConsulted ? (
                  (() => {
                    let expertName = 'Rowan Thistle';
                    let expertAvatar = '📝';
                    let hintText = '';
                    
                    if (currentSeriesStep.id === 'canal-s1-1') {
                      expertName = 'Rowan Thistle · Coordinator';
                      expertAvatar = '📝';
                      hintText = "Rowan says: 'Mrs. Petalworth's wildflowers are priority 1, Baker Bramble's cart is 2, Tiber Reedwell's gate is 3. Total must sum to 6 stars!'";
                    } else if (currentSeriesStep.id === 'canal-s1-2') {
                      expertName = 'Tiber Reedwell · Plumber';
                      expertAvatar = '🔧';
                      hintText = "Tiber says: 'Set Inflow to 10 L/s (East ➡️), Bypass to 8 L/s (South ⬇️), Vent to 6 L/s (South ⬇️), Outflow to 8 L/s (East ➡️). Total flow 32 L/s.'";
                    } else if (currentSeriesStep.id === 'canal-s1-3') {
                      expertName = 'Mrs. Petalworth · Landscape';
                      expertAvatar = '🌸';
                      hintText = "Mrs. Petalworth says: 'Lower wall needs 6 bags, Middle sluice needs 4, Upper spillway needs 5. Blocks exactly 29 units of pressure.'";
                    } else if (currentSeriesStep.id === 'canal-s1-4') {
                      expertName = 'Blacksmith Crumblewise';
                      expertAvatar = '🪓';
                      hintText = "Crumblewise grunts: 'Twig is 5kg, Branch is 15kg, Log is 45kg, Trunk is 120kg, Boulder is 350kg. Clear in that sequence!'";
                    } else if (currentSeriesStep.id === 'canal-s1-5') {
                      expertName = 'Julie Frost · Broadcaster';
                      expertAvatar = '🗞️';
                      hintText = "Julie says: 'Sort sections by width from top: Headline (4 col) -> Photo (3 col) -> Honor Roll (2 col) -> Editor (1 col).'";
                    }

                    return (
                      <div className="text-[14px] text-blue-200 leading-relaxed italic flex gap-1.5 items-start">
                        <span className="text-sm shrink-0">{expertAvatar}</span>
                        <div>
                          <strong className="block not-italic text-[11.5px] uppercase tracking-wider text-blue-400">{expertName} Hint</strong>
                          "{hintText}"
                        </div>
                      </div>
                    );
                  })()
                ) : (
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-[13.5px] text-white/50 leading-snug">Need coordinates or specific targets to crack this assignment?</p>
                    {coins >= 5 ? (
                      <button
                        onClick={handleConsultExpert}
                        className="px-3 py-1.5 shrink-0 bg-blue-900/30 hover:bg-blue-900/50 border border-blue-500/30 text-blue-200 font-brand text-[12px] uppercase tracking-wider rounded-xl transition flex items-center justify-center gap-1 hover:scale-102 active:scale-98"
                      >
                        Consult Expert Helper 🧠 (-5 🪙)
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          onClose();
                          setSubPage('shop');
                          triggerFeedback('🪙 Directed to the Market for Coin Recharge!');
                        }}
                        className="px-3 py-1.5 shrink-0 bg-gradient-to-r from-amber-500 to-orange-500 text-black font-black text-[12px] uppercase tracking-wider rounded-xl transition hover:scale-102 active:scale-98"
                      >
                        Recharge Coins 🪙
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Row 2: Interactive Task Workspace */}
            <div className={`flex flex-col mt-4 transition-all duration-500 ${headerHidden ? 'max-w-[1200px] w-full mx-auto h-[60vh] shrink-0' : 'flex-1 min-h-0'}`}>
              <span className="text-[12px] font-black uppercase tracking-[0.25em] text-emerald-400 block mb-1.5">🎯 Interactive Task Workspace</span>
              <div className="flex-1 min-h-0 rounded-2xl overflow-hidden flex flex-col border border-emerald-500/20 bg-black/45 shadow-[inset_0_4px_40px_rgba(0,0,0,0.4)]">
                {!materialsPurchased ? (
                  <CanalMaterialsPanel
                    coins={coins}
                    material={STEP_MATERIALS[currentSeriesStep.id]}
                    handlePurchaseMaterials={handlePurchaseMaterials}
                    onRedirectToShop={() => {
                      onClose();
                      setSubPage('shop');
                      triggerFeedback('🪙 Directed to the Market for Coin Recharge!');
                    }}
                  />
                ) : (
                  <CanalAssignmentPanel
                    currentSeriesStep={currentSeriesStep}
                    completedSeriesSteps={completedSeriesSteps}
                    completeSeriesStep={completeSeriesStep}
                    addSkillXP={addSkillXP}
                    addLegacy={addLegacy}
                    addCoins={addCoins}
                    travellerName={travellerName}
                    triggerFeedback={triggerFeedback}
                    setSeriesPopupOpen={onClose}
                    minigameSolved={minigameSolved}
                    setMinigameSolved={setMinigameSolved}
                    assignmentIndex={assignmentIndex}
                    setAssignmentIndex={setAssignmentIndex}
                    cleanUpStepFlags={cleanUpStepFlags}
                    getMinigameSubmitLabel={getMinigameSubmitLabel}
                  />
                )}
              </div>
            </div>

            {/* Floating Toggle handle on the right edge of assignment page */}
            <button
              onClick={() => setShowCanalAssignment(false)}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 w-8 h-40 rounded-l-full border-y border-l border-emerald-500/40 bg-gradient-to-b from-[#064e3b]/95 to-[#022c22]/95 flex flex-col items-center justify-between py-4 shadow-[0_0_20px_rgba(52,211,153,0.3)] cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95 z-50 animate-fade-in"
              title="Back to Story Cinematic"
            >
              <span className="text-[10px] text-emerald-400 animate-pulse">📖</span>
              <div className="flex flex-col items-center gap-1 font-black text-[9px] tracking-widest text-emerald-400 font-mono">
                <span>S</span>
                <span>T</span>
                <span>O</span>
                <span>R</span>
                <span>Y</span>
              </div>
              <span className="text-[10px] text-emerald-400">◀</span>
            </button>

          </div>
        )}
      </div>
    </div>
  );
};
