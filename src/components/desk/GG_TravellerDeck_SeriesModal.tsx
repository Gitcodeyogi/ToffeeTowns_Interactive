import React from 'react';
import { FONT } from '../../lib/uiConstants';
import { CANAL_SERIES, getCanalProgressPct } from '../../data/series/series1_canal';

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

interface GG_TravellerDeck_SeriesModalProps {
  viewedStepIndex: number;
  setViewedStepIndex: React.Dispatch<React.SetStateAction<number>>;
  setSeriesPopupOpen: React.Dispatch<React.SetStateAction<boolean>>;
  showCanalAssignment: boolean;
  setShowCanalAssignment: React.Dispatch<React.SetStateAction<boolean>>;
  materialsPurchased: boolean;
  setMaterialsPurchased: React.Dispatch<React.SetStateAction<boolean>>;
  minigameSolved: boolean;
  setMinigameSolved: React.Dispatch<React.SetStateAction<boolean>>;
  assignmentIndex: number;
  setAssignmentIndex: React.Dispatch<React.SetStateAction<number>>;
  calcInput: string;
  setCalcInput: React.Dispatch<React.SetStateAction<string>>;
  manifestFlipped: boolean;
  setManifestFlipped: React.Dispatch<React.SetStateAction<boolean>>;
  auditFlipped: boolean;
  setAuditFlipped: React.Dispatch<React.SetStateAction<boolean>>;
  agreementFlipped: boolean;
  setAgreementFlipped: React.Dispatch<React.SetStateAction<boolean>>;
  expertConsulted: boolean;
  setExpertConsulted: React.Dispatch<React.SetStateAction<boolean>>;
  puzzleState: any;
  setPuzzleState: React.Dispatch<React.SetStateAction<any>>;
  setSubPage: (page: any) => void;
  triggerFeedback: (msg: string) => void;
  
  // Zustand store variables & actions
  coins: number;
  spendCoins: (cost: number, reason: string) => boolean;
  addCoins: (amount: number, reason: string) => void;
  addLegacy: (amount: number) => void;
  travellerName: string;
  skills: any;
  completedSeriesSteps: string[];
  completeSeriesStep: (stepId: string, contribution?: string) => void;
  addSkillXP: (skill: string, xp: number) => void;
}

export const GG_TravellerDeck_SeriesModal: React.FC<GG_TravellerDeck_SeriesModalProps> = ({
  viewedStepIndex,
  setViewedStepIndex,
  setSeriesPopupOpen,
  showCanalAssignment,
  setShowCanalAssignment,
  materialsPurchased,
  setMaterialsPurchased,
  minigameSolved,
  setMinigameSolved,
  assignmentIndex,
  setAssignmentIndex,
  calcInput,
  setCalcInput,
  manifestFlipped,
  setManifestFlipped,
  auditFlipped,
  setAuditFlipped,
  agreementFlipped,
  setAgreementFlipped,
  expertConsulted,
  setExpertConsulted,
  puzzleState,
  setPuzzleState,
  setSubPage,
  triggerFeedback,
  coins,
  spendCoins,
  addCoins,
  addLegacy,
  travellerName,
  skills,
  completedSeriesSteps,
  completeSeriesStep,
  addSkillXP,
}) => {
  const currentSeriesStep = CANAL_SERIES[viewedStepIndex];
  if (!currentSeriesStep) return null;

  const getCalcData = (stepId: string) => {
    switch (stepId) {
      case 'canal-s1-1':
        return {
          title: 'Emergency Priority Weighted Score',
          question: `Rowan Thistle needs to compile the total priority weights for the town council meeting.
          
Hey ${travellerName || 'Probationer'}! If we apply a multiplier factor of 5 to Mrs. Petalworth's wildflowers (1 star), 8 to Baker Bramble's cart (2 stars), and 12 to Tiber Reedwell's sluice gate (3 stars), what is the total weighted score of our emergency report?
          
Calculate: (5 * 1) + (8 * 2) + (12 * 3)`,
          hint: 'Calculate Mrs. Petalworth (5 * 1 = 5) plus Baker Bramble (8 * 2 = 16) plus Tiber (12 * 3 = 36). Sum them up!',
          answer: '57',
          placeholder: 'Enter total weighted score...',
          cta: 'Submit Survey Report 📝',
        };
      case 'canal-s1-2':
        return {
          title: 'Reservoir Safety Margin Calculation',
          question: `Tiber Reedwell needs a quick calculation of the safety margin before we adjust the bypass junctions.
          
Hey ${travellerName || 'Probationer'}! If our reservoir inflow is 32 L/s, but the main drainage canal can only process 24 L/s, how many total liters of water will overflow onto the cobblestone path in 15 seconds if we do not adjust the vents?
          
Calculate: (32 - 24) * 15`,
          hint: 'Calculate flow difference first (32 - 24 = 8 L/s), then multiply by 15 seconds.',
          answer: '120',
          placeholder: 'Enter overflow volume in liters...',
          cta: 'Submit Safety Estimate 📐',
        };
      case 'canal-s1-3':
        return {
          title: 'Volunteer Provisions Ledger',
          question: `Baker Bramble Mortimer is setting up the mobile soup kitchen and needs to verify the logistics ledger.
          
Hey ${travellerName || 'Probationer'}! We have 150 volunteers registered for the work crews. If each volunteer consumes 2 hot meals and 3 cups of herbal tea during their shift, how many total food and drink items must we prepare in the kitchen wagon?
          
Calculate: 150 * (2 + 3)`,
          hint: 'Calculate total items per volunteer first (2 + 3 = 5 items), then multiply by 150 volunteers.',
          answer: '750',
          placeholder: 'Enter total items count...',
          cta: 'Confirm Kitchen Ledger 📦',
        };
      case 'canal-s1-4':
        return {
          title: 'Pulley Mechanical Advantage Review',
          question: `Blacksmith Crumblewise is preparing the heavy pulley ropes to lift the giant boulder out of the upstream channel.
          
Hey ${travellerName || 'Probationer'}! The giant boulder weighs exactly 350 kg. If we set up a compound pulley system that gives us a mechanical advantage of 5, how much total input force (in kilograms-force) must our crew apply collectively to lift it clear of the stream?
          
Calculate: 350 / 5`,
          hint: 'Divide the boulder weight (350 kg) by the mechanical advantage of the pulley system (5).',
          answer: '70',
          placeholder: 'Enter required force in kgf...',
          cta: 'Confirm Force Calculations 🪓',
        };
      case 'canal-s1-5':
        return {
          title: 'Gazette Circulation Vellum Sheets Count',
          question: `Julie Frost is setting up the heavy iron printing presses for the Celebration Edition.
          
Hey ${travellerName || 'Probationer'}! Our printing press yields exactly 45 newspapers for every single large sheet of premium vellum. If we need to print and distribute exactly 900 newspapers across Cocoawood County, how many sheets of vellum must we load into the press?
          
Calculate: 900 / 45`,
          hint: 'Divide the total required newspapers (900) by the yield per sheet (45).',
          answer: '20',
          placeholder: 'Enter required sheets count...',
          cta: 'Publish Print Order 🗞️',
        };
      default:
        return null;
    }
  };

  const skillXP = (k: string) => (skills as Record<string, number>)?.[k] || 0;
  const topSkill = ['builder','explorer','healer'].reduce((a,b) => skillXP(a) >= skillXP(b) ? a : b);
  const skillLabel: Record<string,string> = { builder:'Builder', explorer:'Explorer', healer:'Helper' };
  const skillGrad: Record<string,string> = { builder:'from-orange-500 to-amber-400', explorer:'from-cyan-500 to-teal-400', healer:'from-pink-500 to-rose-400' };
  const skillEmoji: Record<string,string> = { builder:'🔨', explorer:'🧭', healer:'🌿' };
  const isCompleted = completedSeriesSteps.includes(currentSeriesStep.id);
  const xp = skillXP(topSkill);
  const lvl = Math.floor(xp / 10) + 1;
  const pct = (xp % 10) * 10;

  const cleanUpStepFlags = () => {
    localStorage.removeItem(`tt_s1_purchased_${currentSeriesStep.id}`);
    localStorage.removeItem(`tt_s1_solved_${currentSeriesStep.id}`);
    localStorage.removeItem(`tt_s1_expert_${currentSeriesStep.id}`);
  };

  const handlePurchaseMaterials = (cost: number, itemName: string) => {
    if (spendCoins(cost, `Material Purchase: ${itemName}`)) {
      setMaterialsPurchased(true);
      localStorage.setItem(`tt_s1_purchased_${currentSeriesStep.id}`, 'true');
      triggerFeedback(`🛒 Purchased ${itemName}! -${cost} Coins`);
    } else {
      triggerFeedback(`❌ Not enough coins! Need ${cost} coins.`);
    }
  };

  const handleSolveMinigame = () => {
    setMinigameSolved(true);
    localStorage.setItem(`tt_s1_solved_${currentSeriesStep.id}`, 'true');
    triggerFeedback(`🎉 Challenge Complete! Proceed to select your contribution.`);
  };

  const handleConsultExpert = () => {
    if (spendCoins(5, `Expert Consultation: ${currentSeriesStep.title}`)) {
      setExpertConsulted(true);
      localStorage.setItem(`tt_s1_expert_${currentSeriesStep.id}`, 'true');
      triggerFeedback('🧠 Expert consulted! Read their hints below.');
    } else {
      triggerFeedback('❌ Not enough coins! Need 5 coins to consult expert.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[230] p-6 select-none animate-fade-in">
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
              className="w-[30%] shrink-0 min-w-0 flex flex-col overflow-hidden animate-fade-in"
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
                    onClick={() => setSeriesPopupOpen(false)}
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
                      return currentSeriesStep.professionals.map((pro, i) => {
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
                  onClick={() => setSeriesPopupOpen(false)}
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
                      hintText = "Rowan says: 'Mrs. Petalworth's wildflowers are priority 1, Baker Bramble's stuck cart is 2, Tiber Reedwell's gate is 3. Total must sum to 6 stars!'";
                    } else if (currentSeriesStep.id === 'canal-s1-2') {
                      expertName = 'Tiber Reedwell · Plumber';
                      expertAvatar = '🔧';
                      hintText = "Tiber says: 'Set Inflow to 10 L/s (East ➡️), Bypass to 8 L/s (South ⬇️), Vent to 6 L/s (South ⬇️), Outflow to 8 L/s (East ➡️). Total flow 32 L/s.'";
                    } else if (currentSeriesStep.id === 'canal-s1-3') {
                      expertName = 'Mrs. Petalworth · Landscape';
                      expertAvatar = '🌸';
                      hintText = "Mrs. Petalworth says: 'Lower reservoir needs 6 bags, middle needs 4 bags, and upper needs 5 bags. Total 15 bags. Check calculations!'";
                    } else if (currentSeriesStep.id === 'canal-s1-4') {
                      expertName = 'Crumblewise · Blacksmith';
                      expertAvatar = '🪓';
                      hintText = "Crumblewise says: 'Sort from lightest to heaviest: Twig (5kg), Branch (15kg), Log (45kg), Trunk (120kg), Boulder (350kg).'";
                    } else if (currentSeriesStep.id === 'canal-s1-5') {
                      expertName = 'Julie Frost · Editor';
                      expertAvatar = '📰';
                      hintText = "Julie says: 'Typographic hierarchy goes: Headline Banner (top), cutting Photo, Honor Roll List, and finally Editor Desk Column.'";
                    }
                    
                    return (
                      <div className="flex gap-2 items-start animate-fade-in">
                        <span className="text-xl shrink-0">{expertAvatar}</span>
                        <div className="min-w-0">
                          <span className="text-[10px] font-black text-amber-400 block leading-tight">{expertName}</span>
                          <p className="text-[12px] text-stone-350 italic leading-snug line-clamp-2">{hintText}</p>
                        </div>
                      </div>
                    );
                  })()
                ) : (
                  <div className="flex justify-between items-center bg-black/20 px-3 py-2 rounded-xl border border-white/5">
                    <span className="text-[12px] text-white/55">Need a hint from the local professionals?</span>
                    <button
                      onClick={handleConsultExpert}
                      className="px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 text-[11.5px] font-black uppercase rounded-lg transition active:scale-95 cursor-pointer"
                    >
                      Consult Expert (-5 🪙)
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Row 2: Interactive Workspace */}
            <div className="flex-grow flex flex-col border border-white/10 rounded-3xl bg-[#080708]/65 mt-4 min-h-0 overflow-hidden relative">
              
              {/* Steps Progress Header inside Workspace */}
              <div className="shrink-0 px-6 py-3 border-b border-white/8 bg-white/3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setMaterialsPurchased(true);
                      setAssignmentIndex(0);
                    }}
                    className={`text-[13px] font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition hover:opacity-80 active:scale-95 ${assignmentIndex === 0 ? 'text-emerald-400 font-bold' : 'text-white/40'}`}
                  >
                    <span className={`w-4 h-4 rounded-full flex items-center justify-center border text-[12.5px] ${
                      minigameSolved ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400' : 'bg-white/5 border-white/10 text-white/40'
                    }`}>
                      {minigameSolved ? '✓' : '1'}
                    </span>
                    Puzzle Alignment
                  </button>
                  <span className="text-white/10 text-[12px] font-bold">➔</span>
                  <button
                    onClick={() => {
                      setMaterialsPurchased(true);
                      setAssignmentIndex(1);
                    }}
                    className={`text-[13px] font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition hover:opacity-80 active:scale-95 ${assignmentIndex === 1 ? 'text-cyan-400 font-bold' : 'text-white/40'}`}
                  >
                    <span className={`w-4 h-4 rounded-full flex items-center justify-center border text-[12.5px] ${
                      assignmentIndex > 1 ? 'bg-cyan-500/20 border-cyan-500/30 text-cyan-400' : 'bg-white/5 border-white/10 text-white/40'
                    }`}>
                      {assignmentIndex > 1 ? '✓' : '2'}
                    </span>
                    Calculation
                  </button>
                  <span className="text-white/10 text-[12px] font-bold">➔</span>
                  <button
                    onClick={() => {
                      setMaterialsPurchased(true);
                      setAssignmentIndex(2);
                    }}
                    className={`text-[13px] font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition hover:opacity-80 active:scale-95 ${assignmentIndex === 2 ? 'text-amber-400 font-bold' : 'text-white/40'}`}
                  >
                    <span className={`w-4 h-4 rounded-full flex items-center justify-center border text-[12.5px] ${
                      assignmentIndex === 2 ? 'bg-amber-400/20 border-amber-400/30 text-amber-400' : 'bg-white/5 border-white/10 text-white/40'
                    }`}>
                      3
                    </span>
                    Contribution
                  </button>
                </div>
                <div className="text-[12.5px] font-black text-white/45 bg-white/5 px-3 py-1 rounded-full font-mono">
                  Stage {assignmentIndex + 1} of 3
                </div>
              </div>

              {/* Content Area */}
              <div className="flex-1 flex flex-col min-h-0">
                {isCompleted && (
                  <div className="mx-6 mt-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-center shrink-0">
                    <span className="text-emerald-400 font-black text-[14px]">✓ Assignment Completed (Developer Inspection Mode)</span>
                  </div>
                )}
                {!materialsPurchased ? (
                  /* Phase 1: Purchase Materials */
                  (() => {
                    const material = STEP_MATERIALS[currentSeriesStep.id];
                    const hasEnoughCoins = coins >= (material?.cost || 0);

                    return (
                      <div className="flex-grow flex flex-col justify-start gap-4 p-6 min-h-0 overflow-y-auto">
                        {/* Row 1: Header/Instructions */}
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0 shadow-sm">
                          <div>
                            <h4 className="text-white font-brand text-[15px] uppercase tracking-wider">Procurement Phase: Cargo Verification</h4>
                            <p className="text-[12px] text-white/50">Flip all three cards below to verify cargo specs, verify coffer funds, and execute the signature agreement.</p>
                          </div>
                          <div className="flex gap-6 shrink-0 bg-black/30 border border-white/5 px-4 py-2 rounded-xl">
                            <div className="text-right">
                              <span className="text-[9px] text-white/40 uppercase tracking-wider block">Treasury Coffers</span>
                              <span className="text-sm font-black text-amber-300 font-mono">{coins} 🪙</span>
                            </div>
                            <div className="text-right border-l border-white/10 pl-4">
                              <span className="text-[9px] text-white/40 uppercase tracking-wider block">Acquisition Fee</span>
                              <span className="text-sm font-black text-emerald-400 font-mono">{material?.cost} 🪙</span>
                            </div>
                          </div>
                        </div>

                        {/* Row 2: Flipped Cards Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full mx-auto pb-4">
                          
                          {/* Card 1: Manifest */}
                          <div 
                            className="w-full h-[260px] cursor-pointer"
                            style={{ perspective: '1000px' }}
                            onClick={() => setManifestFlipped(!manifestFlipped)}
                          >
                            <div 
                              className="relative w-full h-full select-none"
                              style={{
                                transformStyle: 'preserve-3d',
                                transform: manifestFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                                transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                              }}
                            >
                              {/* Front */}
                              <div 
                                className="absolute inset-0 w-full h-full flex flex-col items-center justify-center rounded-2xl border border-amber-500/20 bg-gradient-to-b from-[#1c1917]/90 to-[#0c0a09]/95 shadow-xl text-center p-6"
                                style={{ backfaceVisibility: 'hidden' }}
                              >
                                <div className="w-14 h-14 rounded-full bg-amber-500/10 border border-amber-500/35 flex items-center justify-center text-2xl mb-3 animate-pulse">
                                  📦
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-wider text-amber-400">Section I</span>
                                <h4 className="text-[15px] font-bold text-white mt-1">Cargo Manifest</h4>
                                <p className="text-[11px] text-white/45 mt-2 leading-relaxed">Click to inspect supply dimensions, quality labels, and origin stamps.</p>
                                <span className="mt-4 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/25 text-[8.5px] text-amber-400 font-bold uppercase">Inspect Manifest 🔍</span>
                              </div>
                              {/* Back */}
                              <div 
                                className="absolute inset-0 w-full h-full flex flex-col justify-between rounded-2xl border border-emerald-500/20 bg-neutral-900 shadow-xl p-5 text-left"
                                style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                              >
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                                    <span className="text-xl">{material?.icon}</span>
                                    <span className="text-[13px] font-black uppercase tracking-wider text-emerald-400">Specs Sheet</span>
                                  </div>
                                  <span className="text-[11px] font-black text-stone-300 block">{material?.name}</span>
                                  <p className="text-[11px] text-neutral-300 leading-relaxed font-sans">{material?.description}</p>
                                </div>
                                <div className="flex justify-between items-center text-[10px] text-white/30 border-t border-white/5 pt-2">
                                  <span>Origin: Ganache Merchant Guild</span>
                                  <span className="text-emerald-400 font-bold">Passed ✓</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Card 2: Audit */}
                          <div 
                            className="w-full h-[260px] cursor-pointer"
                            style={{ perspective: '1000px' }}
                            onClick={() => setAuditFlipped(!auditFlipped)}
                          >
                            <div 
                              className="relative w-full h-full select-none"
                              style={{
                                transformStyle: 'preserve-3d',
                                transform: auditFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                                transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                              }}
                            >
                              {/* Front */}
                              <div 
                                className="absolute inset-0 w-full h-full flex flex-col items-center justify-center rounded-2xl border border-cyan-500/20 bg-gradient-to-b from-[#1c1917]/90 to-[#0c0a09]/95 shadow-xl text-center p-6"
                                style={{ backfaceVisibility: 'hidden' }}
                              >
                                <div className="w-14 h-14 rounded-full bg-cyan-500/10 border border-cyan-500/35 flex items-center justify-center text-2xl mb-3 animate-pulse">
                                  🪙
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-wider text-cyan-400">Section II</span>
                                <h4 className="text-[15px] font-bold text-white mt-1">Treasury Audit</h4>
                                <p className="text-[11px] text-white/45 mt-2 leading-relaxed">Click to verify available local allowance coins and audit ledger balance.</p>
                                <span className="mt-4 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/25 text-[8.5px] text-cyan-400 font-bold uppercase">Audit Ledgers 🪙</span>
                              </div>
                              {/* Back */}
                              <div 
                                className="absolute inset-0 w-full h-full flex flex-col justify-between rounded-2xl border border-emerald-500/20 bg-neutral-900 shadow-xl p-5 text-left"
                                style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                              >
                                <div className="space-y-2.5">
                                  <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                                    <span className="text-xl">💰</span>
                                    <span className="text-[13px] font-black uppercase tracking-wider text-cyan-400">Coffer Audit</span>
                                  </div>
                                  <div className="space-y-1 font-mono text-[11px]">
                                    <div className="flex justify-between font-sans">
                                      <span className="text-white/40">Coffer Gold:</span>
                                      <span className="text-white font-bold">{coins} Coins</span>
                                    </div>
                                    <div className="flex justify-between font-sans">
                                      <span className="text-white/40">Manifest Fee:</span>
                                      <span className="text-amber-400 font-bold">-{material?.cost} Coins</span>
                                    </div>
                                    <div className="flex justify-between border-t border-white/5 pt-1 mt-1 font-sans">
                                      <span className="text-white/40">Net Remaining:</span>
                                      <span className={coins >= (material?.cost || 0) ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
                                        {coins - (material?.cost || 0)} Coins
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex justify-between items-center text-[10px] text-white/30 border-t border-white/5 pt-2">
                                  <span>Allowance Audit</span>
                                  <span className={coins >= (material?.cost || 0) ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
                                    {coins >= (material?.cost || 0) ? 'Verified ✓' : 'Insufficient ⚠️'}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Card 3: Agreement */}
                          <div 
                            className="w-full h-[260px] cursor-pointer"
                            style={{ perspective: '1000px' }}
                            onClick={() => setAgreementFlipped(!agreementFlipped)}
                          >
                            <div 
                              className="relative w-full h-full select-none"
                              style={{
                                transformStyle: 'preserve-3d',
                                transform: agreementFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                                transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                              }}
                            >
                              {/* Front */}
                              <div 
                                className="absolute inset-0 w-full h-full flex flex-col items-center justify-center rounded-2xl border border-purple-500/20 bg-gradient-to-b from-[#1c1917]/90 to-[#0c0a09]/95 shadow-xl text-center p-6"
                                style={{ backfaceVisibility: 'hidden' }}
                              >
                                <div className="w-14 h-14 rounded-full bg-purple-500/10 border border-purple-500/35 flex items-center justify-center text-2xl mb-3 animate-pulse">
                                  📜
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-wider text-purple-400">Section III</span>
                                <h4 className="text-[15px] font-bold text-white mt-1">Merchant Scroll</h4>
                                <p className="text-[11px] text-white/45 mt-2 leading-relaxed">Click to unroll the official purchase pact and sign the release form.</p>
                                <span className="mt-4 px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/25 text-[8.5px] text-purple-400 font-bold uppercase">Sign Pacts 📜</span>
                              </div>
                              {/* Back */}
                              <div 
                                className="absolute inset-0 w-full h-full flex flex-col justify-between rounded-2xl border border-emerald-500/20 bg-neutral-900 shadow-xl p-5 text-left"
                                style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                                onClick={(e) => e.stopPropagation()} // Keep button clicks from flipping card back
                              >
                                <div className="space-y-1.5">
                                  <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                                    <span className="text-xl">🖋️</span>
                                    <span className="text-[13px] font-black uppercase tracking-wider text-purple-400">Sign & Authorize</span>
                                  </div>
                                  <p className="text-[10px] text-stone-300 leading-normal font-sans">
                                    By signing, you authorize the immediate debit of <span className="text-amber-400 font-semibold">{material?.cost} coins</span> from your pocket.
                                  </p>
                                </div>
                                <div className="w-full mt-3">
                                  {hasEnoughCoins ? (
                                    <button
                                      onClick={() => handlePurchaseMaterials(material.cost, material.name)}
                                      className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-black uppercase tracking-widest text-[11px] rounded-xl transition hover:scale-[1.02] active:scale-98 shadow-[0_0_15px_rgba(245,158,11,0.25)]"
                                      style={{ fontFamily: '"Josefin Sans", sans-serif' }}
                                    >
                                      Sign & Buy ({material.cost} 🪙)
                                    </button>
                                  ) : (
                                    <div className="space-y-2">
                                      <button
                                        disabled
                                        className="w-full py-2.5 bg-white/5 border border-white/10 text-white/20 font-black uppercase tracking-widest text-[11px] rounded-xl cursor-not-allowed"
                                        style={{ fontFamily: '"Josefin Sans", sans-serif' }}
                                      >
                                        Need {material?.cost} Coins
                                      </button>
                                      <button
                                        onClick={() => {
                                          setSeriesPopupOpen(false);
                                          setSubPage('shop');
                                          triggerFeedback('🪙 Directed to the Market for Coin Recharge!');
                                        }}
                                        className="w-full py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-black font-black uppercase tracking-wider text-[11px] rounded-xl transition flex items-center justify-center gap-1 font-bold hover:scale-[1.02] active:scale-98"
                                        style={{ fontFamily: '"Josefin Sans", sans-serif' }}
                                      >
                                        Recharge Coins 🪙
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>

                        </div>
                      </div>
                    );
                  })()
                ) : (
                  /* Materials Purchased -> Render 3 sub-assignments sequentially */
                  <div className="flex-1 flex flex-col min-h-0">
                    {/* Scrollable inner workspace to handle minigames */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                    {/* ASSIGNMENT 1: Visual Minigame */}
                    {assignmentIndex === 0 && (
                      <div className="max-w-3xl mx-auto space-y-4 animate-fade-in">
                        <div>
                          <h4 className="font-black text-white text-[18px] leading-snug mb-1" style={{ fontFamily: '"Josefin Sans",sans-serif' }}>
                            Assignment 1: {currentSeriesStep.playerAssignment.title}
                          </h4>
                          <p className="text-[15px] text-neutral-300 leading-normal">{currentSeriesStep.playerAssignment.description}</p>
                        </div>

                        <div className="border-t border-white/5 pt-3">
                          {/* Render Puzzle Component */}
                          {(() => {
                            if (minigameSolved) {
                              return (
                                <div className="space-y-4 max-w-md mx-auto">
                                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-center">
                                    <p className="text-emerald-400 font-bold text-sm">✓ Assignment 1 Completed</p>
                                    <p className="text-[14.5px] text-white/60 mt-1">You have successfully solved the visual puzzle challenge!</p>
                                    <button
                                      onClick={() => {
                                        setMinigameSolved(false);
                                        setPuzzleState(null);
                                      }}
                                      className="text-[12px] text-amber-400 hover:text-amber-300 underline mt-2.5 block mx-auto transition cursor-pointer"
                                    >
                                      Re-activate / Test Minigame Puzzle
                                    </button>
                                  </div>
                                  <button
                                    onClick={() => setAssignmentIndex(1)}
                                    className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-black uppercase tracking-widest text-[15px] rounded-xl transition hover:scale-101 active:scale-98 shadow-[0_0_15px_rgba(52,211,153,0.2)]"
                                    style={{ fontFamily: '"Josefin Sans", sans-serif' }}
                                  >
                                    {getMinigameSubmitLabel(currentSeriesStep.id)}
                                  </button>
                                </div>
                              );
                            }

                            if (currentSeriesStep.id === 'canal-s1-1') {
                              const step1State = puzzleState || { matches: {}, ratings: {}, selectedResident: null };
                              const matches = step1State.matches || {};
                              const ratings = step1State.ratings || {};
                              const selectedResident = step1State.selectedResident;

                              const residents = [
                                { id: 0, name: 'Mrs. Petalworth 🌸' },
                                { id: 1, name: 'Baker Bramble 🍞' },
                                { id: 2, name: 'Tiber Reedwell 🔧' },
                              ];
                              const complaints = [
                                { id: 1, text: '"My flour delivery cart is stuck near the canal path!"' },
                                { id: 0, text: '"The mudslide is ruin\' my wildflower seedlings!"' },
                                { id: 2, text: '"The water pressure at the main sluice is dangerously high!"' },
                              ];

                              const totalRating = Object.values(ratings).reduce((a: any, b: any) => a + b, 0) as number;

                              return (
                                <div className="space-y-4">
                                  <div className="p-3 bg-white/5 border border-white/10 rounded-xl text-[13.5px] text-white/70">
                                    💡 <strong>Matcher:</strong> Pair residents with complaints, then click stars to set their <strong>Priority Rating (1-3 stars)</strong>. Total stars must equal exactly <strong>6</strong>.
                                  </div>
                                  <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-2">
                                      <span className="text-[12px] font-black uppercase tracking-wider text-white/35 block">Residents & Priority</span>
                                      {residents.map(r => {
                                        const isMatched = matches[r.id] !== undefined;
                                        const isSelected = selectedResident === r.id;
                                        const currentRating = ratings[r.id] || 0;
                                        return (
                                          <div key={r.id} className="space-y-1">
                                            <button
                                              disabled={isMatched}
                                              onClick={() => {
                                                setPuzzleState((prev: any) => ({ ...prev, selectedResident: r.id }));
                                              }}
                                              className={`w-full text-left p-2 rounded-xl text-[14px] font-bold border transition ${
                                                isMatched
                                                  ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
                                                  : isSelected
                                                    ? 'border-amber-400 bg-amber-400/10 text-amber-300'
                                                    : 'border-white/10 bg-white/5 text-white/90 hover:bg-white/10'
                                              }`}
                                            >
                                              {r.name} {isMatched && '✓'}
                                            </button>
                                            
                                            {isMatched && (
                                              <div className="flex gap-1 items-center px-1">
                                                <span className="text-[12.5px] text-white/40">Priority:</span>
                                                {[1, 2, 3].map(star => (
                                                  <button
                                                    key={star}
                                                    onClick={() => {
                                                      const nextRatings = { ...ratings, [r.id]: star };
                                                      const nextState = { ...step1State, ratings: nextRatings };
                                                      setPuzzleState(nextState);
                                                      
                                                      const sum = Object.values(nextRatings).reduce((a: any, b: any) => a + b, 0) as number;
                                                      if (Object.keys(matches).length === 3 && sum === 6 && nextRatings[0] === 1 && nextRatings[1] === 2 && nextRatings[2] === 3) {
                                                        handleSolveMinigame();
                                                      }
                                                    }}
                                                    className={`text-xs transition ${currentRating >= star ? 'text-yellow-400 scale-110' : 'text-white/20 hover:text-white/55'}`}
                                                  >
                                                    ★
                                                  </button>
                                                ))}
                                              </div>
                                            )}
                                          </div>
                                        );
                                      })}
                                    </div>

                                    <div className="space-y-2">
                                      <span className="text-[12px] font-black uppercase tracking-wider text-white/35 block">Complaints</span>
                                      {complaints.map(c => {
                                        const isMatched = Object.values(matches).includes(c.id);
                                        return (
                                          <button
                                            key={c.id}
                                            disabled={isMatched}
                                            onClick={() => {
                                              if (selectedResident === null) {
                                                triggerFeedback("⚠️ Select a resident first!");
                                                return;
                                              }
                                              if (selectedResident === c.id) {
                                                const nextMatches = { ...matches, [selectedResident]: c.id };
                                                setPuzzleState({
                                                  ...step1State,
                                                  matches: nextMatches,
                                                  selectedResident: null,
                                                });
                                                triggerFeedback("✨ Match correct! Select priority rating.");
                                              } else {
                                                triggerFeedback("❌ Incorrect complaint! Try again.");
                                                setPuzzleState((prev: any) => ({ ...prev, selectedResident: null }));
                                              }
                                            }}
                                            className={`w-full text-left p-2 rounded-xl text-[13px] leading-snug border transition h-[45px] overflow-hidden flex items-center ${
                                              isMatched
                                                ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
                                                : selectedResident !== null
                                                  ? 'border-cyan-500/35 bg-cyan-500/5 text-white hover:bg-cyan-500/10'
                                                  : 'border-white/10 bg-white/5 text-white/70'
                                            }`}
                                          >
                                            {c.text}
                                          </button>
                                        );
                                      })}
                                    </div>
                                  </div>
                                  
                                  {totalRating === 6 && (ratings[0] !== 1 || ratings[1] !== 2 || ratings[2] !== 3) && (
                                    <div className="p-2 bg-red-500/15 border border-red-500/30 rounded-xl text-[13.5px] text-red-300">
                                      ⚠️ <strong>Incorrect rating distribution!</strong> Total stars is 6, but check priorities: Mrs. Petalworth's wildflowers are low priority (1★), Baker Bramble's stuck cart is medium (2★), and Tiber's sluice gate is critical (3★).
                                    </div>
                                  )}

                                  <div className="text-[13.5px] text-white/50 flex justify-between px-2 pt-1 font-mono">
                                    <span>Matched: {Object.keys(matches).length} / 3</span>
                                    <span>Total Stars: <span className={totalRating === 6 ? 'text-emerald-400' : 'text-amber-400'}>{totalRating}</span> / 6</span>
                                  </div>
                                </div>
                              );
                            }

                            if (currentSeriesStep.id === 'canal-s1-2') {
                              const rotations = puzzleState || [180, 270, 0, 180];
                              const valveDetails = [
                                { name: 'Inflow Regulator', targetText: '➡️ (East)', desc: 'Directs the reservoir intake.' },
                                { name: 'Bypass Junction', targetText: '⬇️ (South)', desc: 'Controls emergency overflow.' },
                                { name: 'Pressure Vent', targetText: '⬇️ (South)', desc: 'Relieves backpressure.' },
                                { name: 'Outflow Valve', targetText: '➡️ (East)', desc: 'Feeds the town canal.' },
                              ];
                              const getArrow = (deg: number) => {
                                  if (deg === 0) return '➡️';
                                  if (deg === 90) return '⬇️';
                                  if (deg === 180) return '⬅️';
                                  return '⬆️';
                              };
                              const getFlow = (idx: number, deg: number) => {
                                  if (idx === 0) return deg === 0 ? 10 : deg === 90 ? 5 : deg === 180 ? 2 : 8;
                                  if (idx === 1) return deg === 0 ? 4 : deg === 90 ? 8 : deg === 180 ? 6 : 2;
                                  if (idx === 2) return deg === 0 ? 9 : deg === 90 ? 6 : deg === 180 ? 3 : 5;
                                  return deg === 0 ? 8 : deg === 90 ? 4 : deg === 180 ? 5 : 2;
                              };

                              const totalFlow = rotations.reduce((acc: number, curr: number, idx: number) => acc + getFlow(idx, curr), 0);

                              return (
                                <div className="space-y-4">
                                  <div className="p-3 bg-white/5 border border-white/10 rounded-xl text-[13.5px] text-white/70">
                                    🔧 Rotate dials to connect the flow. Total combined flow capacity must equal exactly <strong>32 L/s</strong>.
                                  </div>
                                  <div className="grid grid-cols-2 gap-3">
                                    {valveDetails.map((v, idx) => {
                                      const currentRot = rotations[idx];
                                      const arrow = getArrow(currentRot);
                                      const flowVal = getFlow(idx, currentRot);
                                      const isMatched = (idx === 0 && currentRot === 0) ||
                                                        (idx === 1 && currentRot === 90) ||
                                                        (idx === 2 && currentRot === 90) ||
                                                        (idx === 3 && currentRot === 0);
                                      return (
                                        <button
                                          key={idx}
                                          onClick={() => {
                                            const nextRotations = [...rotations];
                                            nextRotations[idx] = (currentRot + 90) % 360;
                                            setPuzzleState(nextRotations);
                                            
                                            const sum = nextRotations.reduce((acc: number, curr: number, index: number) => acc + getFlow(index, curr), 0);
                                            const isAllSolved = nextRotations[0] === 0 && 
                                                                nextRotations[1] === 90 && 
                                                                nextRotations[2] === 90 && 
                                                                nextRotations[3] === 0 &&
                                                                sum === 32;
                                            if (isAllSolved) {
                                              handleSolveMinigame();
                                            }
                                          }}
                                          className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition active:scale-98 ${
                                            isMatched 
                                              ? 'border-emerald-500/40 bg-emerald-500/10 text-white' 
                                              : 'border-white/10 bg-white/5 text-white/90 hover:bg-white/10'
                                          }`}
                                        >
                                          <div>
                                            <span className="text-[14px] font-black block">{v.name}</span>
                                            <span className="text-[12.5px] text-white/40 block mt-0.5">Flow: <span className="text-cyan-400 font-bold">{flowVal} L/s</span></span>
                                            <span className="text-[12.5px] text-amber-400 font-bold block mt-1">Target: {v.targetText}</span>
                                          </div>
                                          <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm border transition-all duration-300 shrink-0 ${
                                            isMatched ? 'border-emerald-400 bg-emerald-500/20 text-emerald-300' : 'border-amber-400/40 bg-amber-400/5 text-amber-300'
                                          }`}>
                                            {arrow}
                                          </div>
                                        </button>
                                      );
                                    })}
                                  </div>
                                  <div className="text-[13.5px] text-white/50 text-center font-mono font-bold pt-1">
                                    Combined Flow: <span className={totalFlow === 32 ? 'text-emerald-400' : 'text-amber-400'}>{totalFlow}</span> / 32 L/s
                                  </div>
                                </div>
                              );
                            }

                            if (currentSeriesStep.id === 'canal-s1-3') {
                              const balance = puzzleState || { lower: 0, middle: 0, upper: 0 };
                              const totalAssigned = balance.lower + balance.middle + balance.upper;
                              const remaining = 15 - totalAssigned;
                              const currentPressure = balance.lower * 2 + balance.middle * 3 + balance.upper * 1;

                              const handleAdjust = (field: 'lower' | 'middle' | 'upper', delta: number) => {
                                if (delta > 0 && remaining <= 0) {
                                  triggerFeedback("⚠️ No sandbags left in your inventory wagon!");
                                  return;
                                }
                                if (delta < 0 && balance[field] <= 0) return;
                                
                                const nextBalance = { ...balance, [field]: Math.max(0, balance[field] + delta) };
                                setPuzzleState(nextBalance);
                                
                                const pressure = nextBalance.lower * 2 + nextBalance.middle * 3 + nextBalance.upper * 1;
                                if (nextBalance.lower === 6 && nextBalance.middle === 4 && nextBalance.upper === 5 && pressure === 29) {
                                  handleSolveMinigame();
                                }
                              };

                              return (
                                <div className="space-y-4">
                                  <div className="flex items-center justify-between p-2.5 bg-white/5 border border-white/10 rounded-xl">
                                    <span className="text-[13.5px] text-white/70">📦 Sandbags in Wagon:</span>
                                    <span className="text-[15px] font-black text-amber-300 font-mono">{remaining} / 15 remaining</span>
                                  </div>
                                  <div className="grid grid-cols-1 gap-3">
                                    {[
                                      { id: 'lower', name: 'Lower Reservoir Spillway', factor: '2x pressure per bag', limit: 8 },
                                      { id: 'middle', name: 'Middle Canal Embankment', factor: '3x pressure per bag', limit: 6 },
                                      { id: 'upper', name: 'Upper Intake Floodgate', factor: '1x pressure per bag', limit: 5 },
                                    ].map((zone) => {
                                      const field = zone.id as 'lower' | 'middle' | 'upper';
                                      return (
                                        <div key={zone.id} className="p-3 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between">
                                          <div>
                                            <span className="text-[14px] font-black text-white block">{zone.name}</span>
                                            <span className="text-[12px] text-white/40 block mt-0.5">{zone.factor} (Limit: {zone.limit})</span>
                                          </div>
                                          <div className="flex items-center gap-2">
                                            <button
                                              onClick={() => handleAdjust(field, -1)}
                                              className="w-7 h-7 rounded-lg bg-white/5 border border-white/20 text-white font-bold hover:bg-white/10 flex items-center justify-center"
                                            >
                                              -
                                            </button>
                                            <span className={`w-8 text-center text-xs font-black font-mono ${balance[field] === zone.limit ? 'text-emerald-400' : 'text-amber-400'}`}>
                                              {balance[field]} / {zone.limit}
                                            </span>
                                            <button
                                              onClick={() => handleAdjust(field, 1)}
                                              className="w-7 h-7 rounded-lg bg-white/5 border border-white/20 text-white font-bold hover:bg-white/10 flex items-center justify-center"
                                            >
                                              +
                                            </button>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                  <div className="text-[13.5px] text-white/50 text-center font-mono font-bold flex justify-between px-2 pt-1">
                                    <span>Total Used: {totalAssigned} / 15</span>
                                    <span>Pressure Blocked: <span className={currentPressure === 29 ? 'text-emerald-400' : 'text-amber-400'}>{currentPressure}</span> / 29</span>
                                  </div>
                                </div>
                              );
                            }

                            if (currentSeriesStep.id === 'canal-s1-4') {
                              const clickedIds = puzzleState || [];
                              const logItems = [
                                { id: 'twig', name: 'Twig Debris 🌿', expr: '(12 - 7) kg', weight: 5 },
                                { id: 'branch', name: 'Small Branch 🪵', expr: '(45 / 3) kg', weight: 15 },
                                { id: 'log', name: 'Medium Log 🪵', expr: '(9 * 5) kg', weight: 45 },
                                { id: 'trunk', name: 'Fallen Trunk 🪵', expr: '(60 * 2) kg', weight: 120 },
                                { id: 'boulder', name: 'Giant Boulder 🪨', expr: '(400 - 50) kg', weight: 350 },
                              ];
                              const sortedOrder = ['twig', 'branch', 'log', 'trunk', 'boulder'];

                              return (
                                <div className="space-y-4">
                                  <div className="p-3 bg-white/5 border border-white/10 rounded-xl text-[13.5px] text-white/70">
                                    🪓 Solve the weight calculations in your head, then click logs in order of weight from **lightest** to **heaviest**.
                                  </div>
                                  <div className="grid grid-cols-1 gap-2">
                                    {logItems.map((item) => {
                                      const isClicked = clickedIds.includes(item.id);
                                      return (
                                        <button
                                          key={item.id}
                                          disabled={isClicked}
                                          onClick={() => {
                                            const currentStepIdx = clickedIds.length;
                                            const expectedId = sortedOrder[currentStepIdx];
                                            if (item.id === expectedId) {
                                              const nextClicked = [...clickedIds, item.id];
                                              setPuzzleState(nextClicked);
                                              triggerFeedback(`✨ Cleared ${item.name} (${item.weight}kg)`);
                                              if (nextClicked.length === sortedOrder.length) {
                                                handleSolveMinigame();
                                              }
                                            } else {
                                              setPuzzleState([]);
                                              triggerFeedback("⚠️ Wrong order! The pile collapsed. Try again from the lightest!");
                                            }
                                          }}
                                          className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all duration-300 ${
                                            isClicked
                                              ? 'border-emerald-500/30 bg-emerald-500/5 text-emerald-500/50 line-through scale-95'
                                              : 'border-white/10 bg-white/5 text-white hover:bg-white/10 hover:border-amber-500/30 active:scale-99'
                                          }`}
                                        >
                                          <span className="text-[14px] font-black">{item.name}</span>
                                          <span className={`text-[13.5px] font-mono font-bold ${isClicked ? 'text-emerald-500/40' : 'text-amber-400'}`}>
                                            Weight: {item.expr}
                                          </span>
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>
                              );
                            }

                            if (currentSeriesStep.id === 'canal-s1-5') {
                              const layoutOrder = puzzleState || ['roll', 'editor', 'headline', 'photo'];
                              const itemDetails: Record<string, { title: string; desc: string; bg: string; width: number }> = {
                                headline: { title: '📰 Main Headline Banner', desc: 'MOSSBERRY CANAL REOPENED — CELEBRATION!', bg: 'rgba(239,68,68,0.08)', width: 4 },
                                photo: { title: '🖼️ Ribbon Cutting Hero Photo', desc: 'Rowan, Julie, and the volunteers smiling by the canal.', bg: 'rgba(59,130,246,0.08)', width: 3 },
                                roll: { title: '📜 Volunteer Honor Roll List', desc: 'Commemorating all probationers and helpers.', bg: 'rgba(16,185,129,0.08)', width: 2 },
                                editor: { title: '✍️ Editor\'s Desk Column', desc: 'Reflections from Julie Frost on civic efforts.', bg: 'rgba(245,158,11,0.08)', width: 1 },
                              };

                              const handleSwap = (idx: number, direction: 'up' | 'down') => {
                                const nextOrder = [...layoutOrder];
                                const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
                                const temp = nextOrder[idx];
                                nextOrder[idx] = nextOrder[targetIdx];
                                nextOrder[targetIdx] = temp;
                                setPuzzleState(nextOrder);
                              };

                              const isCorrectOrder = layoutOrder[0] === 'headline' && layoutOrder[1] === 'photo' && layoutOrder[2] === 'roll' && layoutOrder[3] === 'editor';

                              return (
                                <div className="space-y-4">
                                  <div className="p-3 bg-white/5 border border-white/10 rounded-xl text-[13.5px] text-white/70">
                                    🗞️ Arrange sections in typographic order. Layout width constraints require wider columns on top (Headline &rarr; Photo &rarr; Roll &rarr; Editor).
                                  </div>
                                  
                                  <div className="space-y-2">
                                    {layoutOrder.map((id: string, idx: number) => {
                                      const details = itemDetails[id];
                                      return (
                                        <div
                                          key={id}
                                          className="p-2.5 rounded-xl border border-white/10 bg-white/5 flex items-center justify-between"
                                          style={{ backgroundColor: details.bg }}
                                        >
                                          <div>
                                            <span className="text-[14px] font-black text-white block">{details.title} ({details.width} Columns)</span>
                                            <span className="text-[12.5px] text-white/60 block mt-0.5">{details.desc}</span>
                                          </div>
                                          <div className="flex items-center gap-1 shrink-0">
                                            <button
                                              disabled={idx === 0}
                                              onClick={() => handleSwap(idx, 'up')}
                                              className={`w-6 h-6 rounded-lg border flex items-center justify-center font-bold text-xs ${
                                                idx === 0 
                                                  ? 'border-white/5 text-white/20 bg-transparent' 
                                                  : 'border-white/20 text-white hover:bg-white/10 bg-white/5'
                                              }`}
                                            >
                                              ▲
                                            </button>
                                            <button
                                              disabled={idx === 3}
                                              onClick={() => handleSwap(idx, 'down')}
                                              className={`w-6 h-6 rounded-lg border flex items-center justify-center font-bold text-xs ${
                                                idx === 3 
                                                  ? 'border-white/5 text-white/20 bg-transparent' 
                                                  : 'border-white/20 text-white hover:bg-white/10 bg-white/5'
                                              }`}
                                            >
                                              ▼
                                            </button>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                  
                                  <button
                                    onClick={() => {
                                      if (isCorrectOrder) {
                                        handleSolveMinigame();
                                      } else {
                                        triggerFeedback("⚠️ The page layout is invalid! Sort Headline -> Photo -> Roll -> Editor.");
                                      }
                                    }}
                                    disabled={!isCorrectOrder}
                                    className={`w-full py-2.5 rounded-xl font-bold uppercase tracking-wider text-[14.5px] transition flex items-center justify-center gap-2 ${
                                      isCorrectOrder
                                        ? 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-[0_0_15px_rgba(52,211,153,0.3)] active:scale-98'
                                        : 'bg-white/5 border border-white/10 text-white/30 cursor-not-allowed'
                                    }`}
                                  >
                                    Publish Front Page Edition {isCorrectOrder && '✨'}
                                  </button>
                                </div>
                              );
                            }

                            return null;
                          })()}
                        </div>
                      </div>
                    )}

                    {/* ASSIGNMENT 2: Math Calculation */}
                    {assignmentIndex === 1 && (() => {
                      const calcData = getCalcData(currentSeriesStep.id);
                      return (
                        <div className="max-w-2xl mx-auto space-y-4 animate-fade-in">
                          <div>
                            <h4 className="font-black text-white text-[18px] leading-snug mb-1" style={{ fontFamily: '"Josefin Sans",sans-serif' }}>
                              Assignment 2: {calcData?.title}
                            </h4>
                            <p className="text-[14.5px] text-cyan-400 font-bold uppercase tracking-wider">Calculate logic values to verify report</p>
                          </div>

                          <div className="p-4 bg-white/5 border border-white/10 rounded-xl text-[15px] text-neutral-300 leading-relaxed whitespace-pre-line">
                            {calcData?.question}
                          </div>

                          <div className="space-y-2.5 pt-1">
                            <label className="text-[13.5px] font-bold text-white/50 block">Your Calculated Answer:</label>
                            <div className="flex gap-3">
                              <input
                                type="text"
                                value={calcInput}
                                onChange={(e) => setCalcInput(e.target.value)}
                                placeholder={calcData?.placeholder}
                                className="flex-1 px-4 py-2.5 rounded-xl bg-black/40 border border-white/20 text-white font-mono text-sm focus:border-amber-400 focus:outline-none"
                              />
                              <button
                                onClick={() => {
                                  if (calcInput.trim() === calcData?.answer) {
                                    triggerFeedback("✨ Correct answer! Calculation verified.");
                                    setAssignmentIndex(2);
                                  } else {
                                    triggerFeedback("❌ Incorrect calculation answer. Check the hint!");
                                  }
                                }}
                                className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 text-black font-black uppercase tracking-wider text-[14.5px] rounded-xl transition active:scale-98 hover:scale-[1.01]"
                              >
                                Verify
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })()}

                    {/* ASSIGNMENT 3: Contribution Selection */}
                    {assignmentIndex === 2 && (
                      <div className="max-w-xl mx-auto space-y-4 animate-fade-in">
                        <div>
                          <h4 className="font-black text-white text-[18px] leading-snug mb-1" style={{ fontFamily: '"Josefin Sans",sans-serif' }}>
                            Assignment 3: Contribution Option
                          </h4>
                          <p className="text-[14.5px] text-emerald-400 font-bold uppercase tracking-wider">Choose how you wish to log your work</p>
                        </div>

                        {currentSeriesStep.playerAssignment.options ? (
                          <div className="space-y-2.5 pt-1">
                            {currentSeriesStep.playerAssignment.options.map((opt, idx) => (
                              <button
                                key={idx}
                                onClick={() => {
                                  cleanUpStepFlags();
                                  completeSeriesStep(currentSeriesStep.id, opt.label);
                                  addCoins(currentSeriesStep.rewards.coins, currentSeriesStep.title);
                                  addSkillXP(opt.xpSkill || currentSeriesStep.rewards.xpSkill, currentSeriesStep.rewards.xp);
                                  if (currentSeriesStep.rewards.influence) addLegacy(currentSeriesStep.rewards.influence);
                                  setSeriesPopupOpen(false);
                                  triggerFeedback(`` + (opt.label ? `✅ "${opt.label}"` : '✅ Contribution') + ` recorded! +${currentSeriesStep.rewards.xp} XP · +${currentSeriesStep.rewards.coins} Coins`);
                                }}
                                className="w-full text-left px-5 py-4 rounded-xl text-[15px] font-semibold flex items-center gap-4 transition-all border border-white/8 bg-white/4 hover:bg-emerald-500/10 hover:border-emerald-500/40 active:scale-[0.98]"
                              >
                                <span className="text-xl w-6 text-center shrink-0">{opt.icon}</span>
                                <span className="text-neutral-200">{opt.label}</span>
                              </button>
                            ))}
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              cleanUpStepFlags();
                              completeSeriesStep(currentSeriesStep.id);
                              addCoins(currentSeriesStep.rewards.coins, currentSeriesStep.title);
                              addSkillXP(currentSeriesStep.rewards.xpSkill, currentSeriesStep.rewards.xp);
                              if (currentSeriesStep.rewards.influence) addLegacy(currentSeriesStep.rewards.influence);
                              setSeriesPopupOpen(false);
                              triggerFeedback(`✅ Contribution recorded! +${currentSeriesStep.rewards.xp} XP · +${currentSeriesStep.rewards.coins} Coins`);
                            }}
                            className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-black uppercase tracking-widest text-[15px] rounded-xl transition hover:scale-101 active:scale-98 shadow-[0_0_15px_rgba(52,211,153,0.2)]"
                            style={{ fontFamily: '"Josefin Sans", sans-serif' }}
                          >
                            Complete & Log Contribution ➡️
                          </button>
                        )}
                      </div>
                    )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
