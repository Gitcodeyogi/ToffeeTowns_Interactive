import React, { useState, useEffect } from 'react';
import { CanalCalculator } from './CanalCalculator';
import { CanalDocumentsPanel } from './CanalDocumentsPanel';

interface CanalAssignmentPanelProps {
  currentSeriesStep: any;
  completedSeriesSteps: string[];
  completeSeriesStep: (id: string, optionLabel?: string) => void;
  addSkillXP: (cat: string, amt: number) => void;
  addLegacy: (amt: number) => void;
  addCoins: (amt: number, desc: string) => void;
  travellerName: string;
  triggerFeedback: (msg: string) => void;
  setSeriesPopupOpen: (v: boolean) => void;
  minigameSolved: boolean;
  setMinigameSolved: (v: boolean) => void;
  assignmentIndex: number;
  setAssignmentIndex: (idx: number) => void;
  cleanUpStepFlags: () => void;
  getMinigameSubmitLabel: (id: string) => string;
}

export const CanalAssignmentPanel: React.FC<CanalAssignmentPanelProps> = ({
  currentSeriesStep,
  completedSeriesSteps = [],
  completeSeriesStep,
  addSkillXP,
  addLegacy,
  addCoins,
  travellerName,
  triggerFeedback,
  setSeriesPopupOpen,
  minigameSolved,
  setMinigameSolved,
  assignmentIndex,
  setAssignmentIndex,
  cleanUpStepFlags,
  getMinigameSubmitLabel,
}) => {
  const [puzzleState, setPuzzleState] = useState<any>(null);

  // Initialize specific puzzle states when step or active step changes
  useEffect(() => {
    if (currentSeriesStep) {
      if (currentSeriesStep.id === 'canal-s1-1') {
        setPuzzleState({
          matches: {} as Record<number, number>,
          ratings: {} as Record<number, number>,
          selectedResident: null as number | null,
        });
      } else if (currentSeriesStep.id === 'canal-s1-2') {
        setPuzzleState([180, 270, 0, 180]);
      } else if (currentSeriesStep.id === 'canal-s1-3') {
        setPuzzleState({ lower: 0, middle: 0, upper: 0 });
      } else if (currentSeriesStep.id === 'canal-s1-4') {
        setPuzzleState([] as string[]);
      } else if (currentSeriesStep.id === 'canal-s1-5') {
        setPuzzleState(['roll', 'editor', 'headline', 'photo']);
      } else {
        setPuzzleState(null);
      }
    }
  }, [currentSeriesStep]);

  const handleSolveMinigame = () => {
    setMinigameSolved(true);
    localStorage.setItem(`tt_s1_solved_${currentSeriesStep?.id}`, 'true');
    triggerFeedback(`🎉 Challenge Complete! Proceed to select your contribution.`);
  };

  const isCompleted = completedSeriesSteps.includes(currentSeriesStep.id);

  return (
    <div className="flex-grow flex flex-col min-h-0">
      {/* 3-Assignment Step Indicator */}
      <div className="flex items-center justify-between border-b border-white/5 bg-black/30 px-6 py-3 shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setAssignmentIndex(0)}
            className={`text-[13px] font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition hover:opacity-80 active:scale-95 ${assignmentIndex === 0 ? 'text-amber-400' : 'text-white/40'}`}
          >
            <span className={`w-4 h-4 rounded-full flex items-center justify-center border text-[12.5px] ${
              assignmentIndex > 0 ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400' : assignmentIndex === 0 ? 'bg-amber-400/20 border-amber-400/30 text-amber-400' : 'bg-white/5 border-white/10 text-white/40'
            }`}>
              {assignmentIndex > 0 ? '✓' : '1'}
            </span>
            Minigame
          </button>
          <span className="text-white/10 text-[12px] font-bold">➔</span>
          <button
            onClick={() => setAssignmentIndex(1)}
            className={`text-[13px] font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition hover:opacity-80 active:scale-95 ${assignmentIndex === 1 ? 'text-amber-400' : 'text-white/40'}`}
          >
            <span className={`w-4 h-4 rounded-full flex items-center justify-center border text-[12.5px] ${
              assignmentIndex > 1 ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400' : assignmentIndex === 1 ? 'bg-amber-400/20 border-amber-400/30 text-amber-400' : 'bg-white/5 border-white/10 text-white/40'
            }`}>
              {assignmentIndex > 1 ? '✓' : '2'}
            </span>
            Calculation
          </button>
          <span className="text-white/10 text-[12px] font-bold">➔</span>
          <button
            onClick={() => setAssignmentIndex(2)}
            className={`text-[13px] font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition hover:opacity-80 active:scale-95 ${assignmentIndex === 2 ? 'text-amber-400' : 'text-white/40'}`}
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
                        
                        <div className="space-y-2">
                          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                            <div>
                              <span className="text-[14px] font-black text-white block">Lower Breach Wall (2x Pressure)</span>
                              <span className="text-[12px] text-white/40 block mt-0.5">Critical water gate base. Target: 6</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleAdjust('lower', -1)}
                                className="w-7 h-7 rounded-lg bg-white/5 border border-white/20 text-white font-bold hover:bg-white/10 flex items-center justify-center"
                              >
                                -
                              </button>
                              <span className={`w-8 text-center text-xs font-black font-mono ${balance.lower === 6 ? 'text-emerald-400' : 'text-amber-400'}`}>
                                {balance.lower} / 6
                              </span>
                              <button
                                onClick={() => handleAdjust('lower', 1)}
                                className="w-7 h-7 rounded-lg bg-white/5 border border-white/20 text-white font-bold hover:bg-white/10 flex items-center justify-center"
                              >
                                +
                              </button>
                            </div>
                          </div>

                          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                            <div>
                              <span className="text-[14px] font-black text-white block">Middle Breach Sluice (3x Pressure)</span>
                              <span className="text-[12px] text-white/40 block mt-0.5">Center leakage. Target: 4</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleAdjust('middle', -1)}
                                className="w-7 h-7 rounded-lg bg-white/5 border border-white/20 text-white font-bold hover:bg-white/10 flex items-center justify-center"
                              >
                                -
                              </button>
                              <span className={`w-8 text-center text-xs font-black font-mono ${balance.middle === 4 ? 'text-emerald-400' : 'text-amber-400'}`}>
                                {balance.middle} / 4
                              </span>
                              <button
                                onClick={() => handleAdjust('middle', 1)}
                                className="w-7 h-7 rounded-lg bg-white/5 border border-white/20 text-white font-bold hover:bg-white/10 flex items-center justify-center"
                              >
                                +
                              </button>
                            </div>
                          </div>

                          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                            <div>
                              <span className="text-[14px] font-black text-white block">Upper Spillway Overflow (1x Pressure)</span>
                              <span className="text-[12px] text-white/40 block mt-0.5">Spillway bank reinforcement. Target: 5</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleAdjust('upper', -1)}
                                className="w-7 h-7 rounded-lg bg-white/5 border border-white/20 text-white font-bold hover:bg-white/10 flex items-center justify-center"
                              >
                                -
                              </button>
                              <span className={`w-8 text-center text-xs font-black font-mono ${balance.upper === 5 ? 'text-emerald-400' : 'text-amber-400'}`}>
                                {balance.upper} / 5
                              </span>
                              <button
                                onClick={() => handleAdjust('upper', 1)}
                                className="w-7 h-7 rounded-lg bg-white/5 border border-white/20 text-white font-bold hover:bg-white/10 flex items-center justify-center"
                              >
                                +
                              </button>
                            </div>
                          </div>
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
                    return (
                      <CanalDocumentsPanel
                        currentSeriesStep={currentSeriesStep}
                        puzzleState={puzzleState}
                        setPuzzleState={setPuzzleState}
                        minigameSolved={minigameSolved}
                        handleSolveMinigame={handleSolveMinigame}
                        triggerFeedback={triggerFeedback}
                        setAssignmentIndex={setAssignmentIndex}
                        getMinigameSubmitLabel={getMinigameSubmitLabel}
                      />
                    );
                  }

                  return null;
                })()}
              </div>
            </div>
          )}

          {/* ASSIGNMENT 2: Math Calculation */}
          {assignmentIndex === 1 && (
            <CanalCalculator
              currentSeriesStep={currentSeriesStep}
              travellerName={travellerName}
              onVerifySuccess={() => setAssignmentIndex(2)}
              triggerFeedback={triggerFeedback}
            />
          )}

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
                  {currentSeriesStep.playerAssignment.options.map((opt: any, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => {
                        cleanUpStepFlags();
                        completeSeriesStep(currentSeriesStep.id, opt.label);
                        addCoins(currentSeriesStep.rewards.coins, currentSeriesStep.title);
                        addSkillXP(opt.xpSkill || currentSeriesStep.rewards.xpSkill, currentSeriesStep.rewards.xp);
                        if (currentSeriesStep.rewards.influence) addLegacy(currentSeriesStep.rewards.influence);
                        setSeriesPopupOpen(false);
                        triggerFeedback(`✅ "${opt.label}" recorded! +${currentSeriesStep.rewards.xp} XP · +${currentSeriesStep.rewards.coins} Coins`);
                      }}
                      className="w-full text-left px-5 py-4 rounded-xl text-[15px] font-semibold flex items-center gap-4 transition-all border border-white/8 bg-white/4 hover:bg-emerald-500/10 hover:border-emerald-500/40 active:scale-[0.98]"
                    >
                      <span className="text-xl w-6 text-center shrink-0">{opt.icon}</span>
                      <span className="text-neutral-200">{opt.label}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="pt-1">
                  <button
                    onClick={() => {
                      cleanUpStepFlags();
                      completeSeriesStep(currentSeriesStep.id);
                      addCoins(currentSeriesStep.rewards.coins, currentSeriesStep.title);
                      addSkillXP(currentSeriesStep.rewards.xpSkill, currentSeriesStep.rewards.xp);
                      if (currentSeriesStep.rewards.influence) addLegacy(currentSeriesStep.rewards.influence);
                      setSeriesPopupOpen(false);
                      triggerFeedback(`✅ Participated! +${currentSeriesStep.rewards.xp} XP · +${currentSeriesStep.rewards.coins} Coins`);
                    }}
                    className="w-full text-center px-5 py-4 rounded-xl text-[15px] font-brand uppercase tracking-wider transition-all border border-white/8 bg-white/4 hover:bg-emerald-500/10 hover:border-emerald-500/40 active:scale-[0.98] font-bold"
                  >
                    Confirm & Complete Day {currentSeriesStep.stepNumber} ⚡
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
