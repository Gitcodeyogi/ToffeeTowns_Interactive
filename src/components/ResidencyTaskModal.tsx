import React, { useState, useEffect } from 'react';
import { useTTStore } from '../store/useTTStore';
import { getResidencyTaskDetails } from '../utils/residencyTaskData';
import { FONT } from '../lib/uiConstants';
import { MiniGameRouter } from './minigames/MiniGameRouter';

interface ResidencyTaskModalProps {
  setInventory?: React.Dispatch<React.SetStateAction<Record<string, number>>>;
}

export const ResidencyTaskModal: React.FC<ResidencyTaskModalProps> = ({ setInventory }) => {
  const {
    activeResidencyTask,
    residencyTaskStage,
    taskQueue,
    coins,
    payResidencyTaskHint,
    beginResidencyTask,
    solveResidencyTaskRiddle,
    failResidencyTask,
    dismissResidencyTaskModal,
    skills,
  } = useTTStore();

  const [nowTime, setNowTime] = useState(() => Date.now());

  // Keep ticking local time during progress stage
  useEffect(() => {
    if (residencyTaskStage !== 'progress' && residencyTaskStage !== 'pre-start') return;
    const interval = setInterval(() => {
      setNowTime(Date.now());
    }, 100);
    return () => clearInterval(interval);
  }, [residencyTaskStage]);

  // Monitor timer timeout — suppressed for mini-game tasks (game manages its own timer)
  useEffect(() => {
    if (residencyTaskStage === 'progress' && taskQueue.length > 0) {
      const active = taskQueue[0];
      if (active && (active as any).hasMiniGame) return; // mini-game controls timing
      const elapsed = active.startedAt !== null ? Date.now() - active.startedAt : 0;
      if (elapsed >= active.duration) {
        failResidencyTask();
      }
    }
  }, [nowTime, residencyTaskStage, taskQueue, failResidencyTask]);

  if (!residencyTaskStage || !activeResidencyTask) return null;

  const { workTask } = activeResidencyTask;
  const details = getResidencyTaskDetails(workTask.name, workTask.rewardXPCat);
  const active = taskQueue[0];

  // Helper variables for progress stage
  const elapsed = (residencyTaskStage === 'progress' && active && active.startedAt !== null)
    ? nowTime - active.startedAt
    : 0;
  const pct = (residencyTaskStage === 'progress' && active)
    ? Math.min(100, Math.max(0, Math.round((elapsed / active.duration) * 100)))
    : 0;
  const secondsLeft = (residencyTaskStage === 'progress' && active)
    ? Math.max(0, Math.ceil((active.duration - elapsed) / 1000))
    : Math.ceil(workTask.duration / 1000);

  const getProfessionTitle = (prof: string, xpVal: number) => {
    const p = prof.toLowerCase();
    if (p === 'builder') {
      if (xpVal < 100) return 'Apprentice Builder';
      if (xpVal < 250) return 'Journeyman Builder';
      return 'Master Builder';
    }
    if (p === 'healer') {
      if (xpVal < 100) return 'Clinic Helper';
      if (xpVal < 250) return 'Apothecary';
      return 'Master Healer';
    }
    if (p === 'baker') {
      if (xpVal < 100) return 'Pastry Hand';
      if (xpVal < 250) return 'Master Baker';
      return 'Patissier';
    }
    if (p === 'explorer') {
      if (xpVal < 100) return 'Novice Cartographer';
      if (xpVal < 250) return 'Wayfinder';
      return 'Master Explorer';
    }
    return 'Town Contributor';
  };

  const getNaturalNpcReaction = (prof: string, npc: string) => {
    const p = prof.toLowerCase();
    if (p === 'builder') {
      return `${npc}: "Perfect fit. That blueprint aligns perfectly with the foundation."`;
    }
    if (p === 'healer') {
      return `${npc}: "The herbs arrived just in time. These dried leaves will cure the sneezles."`;
    }
    if (p === 'baker') {
      return `${npc}: "Mmm, smell that yeast rise! The crust has the perfect golden glaze."`;
    }
    if (p === 'explorer') {
      return `${npc}: "Excellent path notations. The bogs are mapped correctly now."`;
    }
    return `${npc}: "The work is done properly. Let me index this entry into the registry."`;
  };

  const profKey = workTask.profession || 'general';
  const skillCategoryForXP = workTask.rewardXPCat || 'general';
  const currentXPForProf = skills[skillCategoryForXP] || 0;
  const activeTitle = getProfessionTitle(profKey, currentXPForProf);
  const naturalNpcQuote = getNaturalNpcReaction(profKey, details.reviewer || 'Rowan');

  const handleSelectAnswer = (option: string) => {
    if (residencyTaskStage !== 'progress') return;
    if (option === details.riddle.answer) {
      solveResidencyTaskRiddle();
    } else {
      failResidencyTask();
    }
  };

  const handleBeginTask = () => {
    if (activeResidencyTask.startDeductions?.inventory) {
      const costInv = activeResidencyTask.startDeductions.inventory;
      if (Object.keys(costInv).length > 0) {
        if (setInventory) {
          setInventory(prev => {
            const next = { ...prev };
            for (const [item, qty] of Object.entries(costInv)) {
              next[item] = Math.max(0, (next[item] || 0) - qty);
            }
            return next;
          });
        } else {
          // Fallback direct localStorage deduction
          const saved = localStorage.getItem('tt_inventory');
          const currentInv = saved ? JSON.parse(saved) : {};
          for (const [item, qty] of Object.entries(costInv)) {
            currentInv[item] = Math.max(0, (currentInv[item] || 0) - qty);
          }
          localStorage.setItem('tt_inventory', JSON.stringify(currentInv));
        }
      }
    }
    beginResidencyTask();
  };

  // Mini-game overlay — shown on top of modal during progress when hasMiniGame is true
  const isMiniGameTask = !!(activeResidencyTask?.workTask as any)?.hasMiniGame;
  const showMiniGame   = residencyTaskStage === 'progress' && isMiniGameTask;

  if (showMiniGame) {
    return (
      <div
        className="fixed inset-0 z-[320] flex items-center justify-center p-4 overflow-hidden select-none bg-no-repeat bg-cover bg-center animate-fade-in"
        style={{ backgroundImage: 'url("/Assets/Ganache Grove/Scene_0.1.png")' }}
      >
        <MiniGameRouter
          taskName={activeResidencyTask!.workTask.name}
          skillCat={activeResidencyTask!.workTask.rewardXPCat || 'healer'}
          dutyType={activeResidencyTask!.workTask.dutyType}
          frame={activeResidencyTask!.workTask.frame}
          profession={activeResidencyTask!.workTask.profession}
          rewards={{
            coins:  activeResidencyTask!.workTask.rewardCoins  ?? 35,
            xp:     activeResidencyTask!.workTask.rewardXP     ?? 45,
            legacy: activeResidencyTask!.workTask.rewardLegacy ?? 12,
            skill:  activeResidencyTask!.workTask.rewardXPCat  ?? 'healer',
          }}
          onSuccess={() => { solveResidencyTaskRiddle(); }}
          onFail={() => { failResidencyTask(); }}
        />
      </div>
    );
  }

  return (
    <>

    <div
      className="fixed inset-0 z-[320] flex items-center justify-center p-4 overflow-hidden select-none bg-no-repeat bg-cover bg-center animate-fade-in"
      style={{ backgroundImage: 'url("/Assets/Ganache Grove/Scene_0.1.png")' }}
    >
      <div 
        className="flex flex-col overflow-hidden shadow-2xl relative text-left font-body text-[16px] text-white"
        style={{
          width: '90vw',
          height: '90vh',
          borderRadius: '2.5rem',
          border: '1.5px solid rgba(255,255,255,0.12)',
          background: 'rgba(0, 0, 0, 0.60)',
          fontVariantNumeric: 'tabular-nums'
        }}
      >
        {/* Top Header Bar inside the panel */}
        <div className="shrink-0 px-8 py-4 border-b border-white/10 flex justify-between items-center bg-black/40">
          <h1 className="text-xl md:text-2xl font-brand text-yellow-400 uppercase tracking-wider leading-none" style={{ fontFamily: FONT }}>
            Ganache Town Task Register
          </h1>
          <button
            onClick={() => {
              if (residencyTaskStage === 'progress' && taskQueue.length > 0) {
                const active = taskQueue[0];
                if (active) {
                  useTTStore.getState().cancelTask(active.id);
                }
              }
              dismissResidencyTaskModal();
            }}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-500 active:scale-95 text-white font-brand text-[12px] uppercase tracking-wider rounded-xl transition-all duration-200 flex items-center gap-1.5 shadow-md font-bold cursor-pointer"
            style={{ fontFamily: FONT }}
          >
            Cancel & Return ✕
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
          
          {/* Left Column: Task Illustration / Summary - 35% Width */}
          <div className="w-full md:w-[35%] shrink-0 h-48 md:h-full relative overflow-hidden border-b md:border-b-0 md:border-r border-white/10 bg-neutral-900">
            <img
              src={
                residencyTaskStage === 'failed'
                  ? '/Assets/Ganache Grove/Copilot_20260425_143442.png'
                  : residencyTaskStage === 'completed'
                  ? '/Assets/task_complete_celebration.png'
                  : '/Assets/Ganache Grove/Scene_0.1.png'
              }
              alt="Task illustration"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/Assets/Ganache Grove/Scene_0.1.png';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/80 to-transparent pointer-events-none" />
            
            <div className="absolute inset-0 flex flex-col justify-end p-6">
              <span className="text-yellow-400 font-brand text-lg tracking-wider uppercase" style={{ fontFamily: FONT }}>
                Residency Task
              </span>
              <span className={`text-[11px] font-black uppercase tracking-widest mt-0.5 animate-pulse ${
                residencyTaskStage === 'completed'
                  ? 'text-emerald-400'
                  : residencyTaskStage === 'failed'
                  ? 'text-rose-400'
                  : 'text-amber-400'
              }`}>
                {residencyTaskStage === 'pre-start' && 'Preparation Phase'}
                {residencyTaskStage === 'progress' && 'Task in Progress'}
                {residencyTaskStage === 'completed' && 'Credentials Earned'}
                {residencyTaskStage === 'failed' && 'Task Incomplete'}
              </span>
            </div>
          </div>

          {/* Right Column: Dynamic Stage Content - 65% Width */}
          <div className="flex-1 p-8 flex flex-col justify-between h-full min-w-0 bg-[#0a0a0c]/40 text-white">
            
            {/* STAGE 1: PRE-START STAGE */}
            {residencyTaskStage === 'pre-start' && (
              <>
                {/* Header */}
                <div className="shrink-0 pb-3 border-b border-white/10">
                  <span className="text-[11px] font-black uppercase tracking-[0.25em] text-cyan-400 block mb-1 font-sans">
                    Residency Briefing
                  </span>
                  <h2 className="text-xl md:text-2xl font-brand text-yellow-300 uppercase" style={{ fontFamily: FONT }}>
                    {workTask.name}
                  </h2>
                </div>

                {/* Body */}
                <div className="flex-grow overflow-y-auto custom-scrollbar my-4 space-y-4 pr-1 py-1 text-[16px]">
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-amber-400 uppercase tracking-widest block font-sans">Instructions</span>
                    <p className="text-white/90 leading-relaxed bg-white/5 p-4 border border-white/5 rounded-2xl">
                      {details.instructions}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Rewards Box */}
                    <div className="p-4 bg-emerald-950/20 border border-emerald-500/20 rounded-2xl space-y-2">
                      <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-widest block font-sans">Rewards on Success</span>
                      <ul className="text-white/80 space-y-1 text-[16px]">
                        <li>• +{workTask.rewardCoins} Cocoa Coins</li>
                        <li>• +{workTask.rewardXP} {workTask.rewardXPCat?.toUpperCase()} XP</li>
                        <li>• +{workTask.rewardLegacy} Standing Legacy</li>
                      </ul>
                    </div>

                    {/* Penalty Box */}
                    <div className="p-4 bg-rose-950/20 border border-rose-500/20 rounded-2xl space-y-2">
                      <span className="text-[11px] font-bold text-rose-400 uppercase tracking-widest block font-sans">Failure Penalty</span>
                      <ul className="text-white/80 space-y-1 text-[16px]">
                        <li>• -10 Cocoa Coins</li>
                        <li>• -10 {workTask.rewardXPCat?.toUpperCase() || 'GENERAL'} XP</li>
                        <li>• Time limit: {Math.ceil(workTask.duration / 1000)}s</li>
                      </ul>
                    </div>
                  </div>

                  {/* Meticulous Hint Panel */}
                  <div className="p-4 bg-amber-950/10 border border-amber-500/20 rounded-2xl flex items-center justify-between gap-4 font-sans">
                    <div className="space-y-0.5">
                      <span className="text-[11px] font-bold text-amber-400 uppercase tracking-widest block">Meticulous Hint Option</span>
                      <p className="text-white/70 text-[15px] leading-relaxed">
                        Highlight the correct answer in the thinking challenge for an additional 5 coins.
                      </p>
                    </div>
                    <button
                      disabled={activeResidencyTask.hintPaid || coins < 5}
                      onClick={payResidencyTaskHint}
                      className={`px-4 py-2 text-[12px] font-brand font-black uppercase tracking-wider rounded-xl transition duration-200 shrink-0 ${
                        activeResidencyTask.hintPaid
                          ? 'bg-emerald-500 text-black cursor-default font-bold'
                          : coins < 5
                          ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                          : 'bg-amber-500 hover:bg-amber-400 text-black hover:scale-102 active:scale-98 font-bold'
                      }`}
                      style={{ fontFamily: FONT }}
                    >
                      {activeResidencyTask.hintPaid ? 'Paid ✓' : 'Pay 5 🪙'}
                    </button>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex gap-4 border-t border-white/10 pt-4 shrink-0">
                  <button
                    onClick={handleBeginTask}
                    className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-brand font-black uppercase text-[14px] tracking-widest rounded-xl transition hover:scale-102 active:scale-98 shadow-md"
                    style={{ fontFamily: FONT }}
                  >
                    Begin Task 🚀
                  </button>
                </div>
              </>
            )}

            {/* STAGE 2: PROGRESS & CHALLENGE STAGE */}
            {residencyTaskStage === 'progress' && (
              <>
                {/* Header */}
                <div className="shrink-0 pb-3 border-b border-white/10 flex justify-between items-end">
                  <div>
                    <span className="text-[11px] font-black uppercase tracking-[0.25em] text-amber-400 block mb-1">
                      Thinking Challenge
                    </span>
                    <h2 className="text-xl md:text-2xl font-brand text-yellow-300 uppercase" style={{ fontFamily: FONT }}>
                      {workTask.name}
                    </h2>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[11px] text-neutral-400 uppercase tracking-widest block font-sans">Time Remaining</span>
                    <span className="text-2xl font-mono text-amber-300 font-bold block mt-0.5">{secondsLeft}s</span>
                  </div>
                </div>

                {/* Body */}
                <div className="flex-grow overflow-y-auto custom-scrollbar my-4 space-y-4 pr-1 py-1 text-[16px]">
                  {/* Live progress bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[13px] text-neutral-400 uppercase font-sans">
                      <span>Task Progress</span>
                      <span>{pct}%</span>
                    </div>
                    <div className="h-2.5 bg-white/5 border border-white/10 rounded-full overflow-hidden flex shadow-[inset_0_1px_4px_rgba(0,0,0,0.5)] font-sans">
                      <div 
                        className="bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-100 ease-out" 
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>

                  {/* Question Block */}
                  <div className="p-5 bg-white/5 border border-white/10 rounded-2xl space-y-3 mt-2">
                    <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-widest block font-sans">Discipline Question</span>
                    <p className="text-white text-[17px] font-semibold leading-relaxed">
                      {details.riddle.question}
                    </p>

                    {activeResidencyTask.hintPaid && (
                      <div className="p-3 bg-emerald-950/20 border border-emerald-500/25 text-emerald-400 rounded-lg text-[15px] leading-relaxed flex items-start gap-1.5 animate-fade-in font-sans">
                        <span>💡</span>
                        <div>
                          <strong className="block font-bold text-[11px] uppercase text-emerald-300">Meticulous Hint</strong>
                          {details.riddle.hint}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Multiple choice options */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                    {details.riddle.options.map((option, idx) => {
                      const isCorrect = option === details.riddle.answer;
                      const showHintHighlight = activeResidencyTask.hintPaid && isCorrect;
                      
                      return (
                        <button
                          key={idx}
                          onClick={() => handleSelectAnswer(option)}
                          className={`p-4 rounded-2xl border text-left transition-all duration-200 flex items-center justify-between text-[16px] font-sans group ${
                            showHintHighlight
                              ? 'bg-emerald-950/30 border-emerald-400 text-emerald-300 ring-2 ring-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.15)] hover:scale-[1.02]'
                              : 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10 hover:border-white/20 hover:text-white active:scale-98'
                          }`}
                        >
                          <span className="font-medium leading-relaxed pr-2">{option}</span>
                          {showHintHighlight ? (
                            <span className="text-[11px] font-bold bg-emerald-400 text-black px-2 py-0.5 rounded-lg shrink-0 select-none uppercase tracking-wider">
                              ★ Hint
                            </span>
                          ) : (
                            <span className="text-[11px] font-bold text-neutral-500 group-hover:text-neutral-400 font-mono shrink-0 select-none uppercase">
                              Select
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Pinned warning note */}
                <div className="shrink-0 pt-2 border-t border-white/5 text-center font-sans">
                  <span className="text-[12px] text-rose-400/90 font-medium italic block">
                    ⚠️ Lock-in active: You cannot close, pause, or escape until you solve the riddle or the timer runs out!
                  </span>
                </div>
              </>
            )}

            {/* STAGE 3: COMPLETION STAGE */}
            {residencyTaskStage === 'completed' && (
              <>
                {/* Header */}
                <div className="shrink-0 pb-3 border-b border-white/10">
                  <span className="text-[11px] font-black uppercase tracking-[0.25em] text-emerald-400 block mb-1">
                    Residency Contribution Logged
                  </span>
                  <h2 className="text-xl md:text-2xl font-brand text-emerald-400 uppercase" style={{ fontFamily: FONT }}>
                    Task Completed Successfully!
                  </h2>
                </div>

                {/* Body */}
                <div className="flex-grow overflow-y-auto custom-scrollbar my-4 space-y-4 pr-1 py-1 text-[16px]">
                  {/* 1. Reviewer dialogue response */}
                  <div className="p-5 bg-white/5 border border-white/10 rounded-2xl space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-widest block font-sans">
                        Reviewer: {details.reviewer}
                      </span>
                      <span className="text-[10px] font-mono text-amber-300 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                        Rank: {activeTitle}
                      </span>
                    </div>
                    <p className="text-white/95 text-[16px] leading-relaxed italic border-l-2 border-cyan-500 pl-3">
                      {naturalNpcQuote}
                    </p>
                  </div>

                  {/* 2. Logged credits */}
                  <div className="bg-black/30 border border-white/10 p-4 rounded-2xl space-y-2.5">
                    <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-widest block font-sans">
                      Credits Registered in Ledger
                    </span>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="p-3 bg-white/5 border border-white/5 rounded-xl text-center font-sans">
                        <span className="text-[11.5px] font-black text-neutral-400 uppercase tracking-wider block">Coins Gained</span>
                        <span className="text-lg font-bold text-emerald-400 block mt-1">+{workTask.rewardCoins} 🪙</span>
                      </div>
                      <div className="p-3 bg-white/5 border border-white/5 rounded-xl text-center font-sans">
                        <span className="text-[11.5px] font-black text-neutral-400 uppercase tracking-wider block">{workTask.rewardXPCat?.toUpperCase()} XP</span>
                        <span className="text-lg font-bold text-cyan-400 block mt-1">+{workTask.rewardXP} XP</span>
                      </div>
                      <div className="p-3 bg-white/5 border border-white/5 rounded-xl text-center font-sans">
                        <span className="text-[11.5px] font-black text-neutral-400 uppercase tracking-wider block">Standing Legacy</span>
                        <span className="text-lg font-bold text-yellow-400 block mt-1">+{workTask.rewardLegacy} Pts</span>
                      </div>
                    </div>
                  </div>

                  {/* 3. Fun Fact Box */}
                  <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-2xl space-y-1">
                    <span className="text-[11px] font-bold text-amber-400 uppercase tracking-widest block font-sans">
                      💡 Did You Know? (Fun Fact)
                    </span>
                    <p className="text-amber-200/90 text-[16px] leading-relaxed">
                      {details.funFact}
                    </p>
                  </div>
                </div>

                {/* Footer */}
                <div className="shrink-0 border-t border-white/10 pt-4">
                  <button
                    onClick={dismissResidencyTaskModal}
                    className="w-full py-3.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-500 hover:scale-[1.01] text-black font-brand font-black uppercase text-[13px] tracking-widest rounded-xl transition active:scale-99 shadow-md shadow-emerald-500/10 font-bold"
                    style={{ fontFamily: FONT }}
                  >
                    Acknowledge Ledger 🎟️
                  </button>
                </div>
              </>
            )}

            {/* STAGE 4: FAILED STAGE */}
            {residencyTaskStage === 'failed' && (
              <>
                {/* Header */}
                <div className="shrink-0 pb-3 border-b border-white/10">
                  <span className="text-[11px] font-black uppercase tracking-[0.25em] text-rose-400 block mb-1">
                    Residency Report Failed
                  </span>
                  <h2 className="text-xl md:text-2xl font-brand text-rose-400 uppercase" style={{ fontFamily: FONT }}>
                    Task Incomplete!
                  </h2>
                </div>

                {/* Body */}
                <div className="flex-grow overflow-y-auto custom-scrollbar my-4 space-y-4 pr-1 py-1 text-[16px]">
                  <div className="p-5 bg-rose-950/15 border border-rose-500/20 rounded-2xl space-y-2 font-sans">
                    <span className="text-[11px] font-bold text-rose-400 uppercase tracking-widest block font-sans">
                      Registry Review: Incomplete Work
                    </span>
                    <p className="text-white/90 text-[16px] leading-relaxed">
                      You failed to answer the thinking riddle correctly or the time limit expired before completion.
                      The town registry requires meticulous attention to details from its residents.
                    </p>
                  </div>

                  <div className="p-5 bg-black/40 border border-white/10 rounded-2xl space-y-3 font-sans">
                    <span className="text-[11px] font-bold text-rose-400 uppercase tracking-widest block font-sans">
                      Penalties Logged in Ledger
                    </span>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3.5 bg-rose-950/20 border border-rose-950 rounded-xl text-center">
                        <span className="text-[11.5px] font-black text-neutral-400 uppercase tracking-wider block font-sans">Wallet Balance</span>
                        <span className="text-lg font-bold text-rose-400 block mt-1">-10 Cocoa Coins</span>
                      </div>
                      <div className="p-3.5 bg-rose-950/20 border border-rose-950 rounded-xl text-center">
                        <span className="text-[11.5px] font-black text-neutral-400 uppercase tracking-wider block">{workTask.rewardXPCat?.toUpperCase() || 'GENERAL'} XP</span>
                        <span className="text-lg font-bold text-rose-400 block mt-1">-10 XP</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="shrink-0 border-t border-white/10 pt-4">
                  <button
                    onClick={dismissResidencyTaskModal}
                    className="w-full py-3.5 bg-rose-500 hover:bg-rose-400 hover:scale-[1.01] text-black font-brand font-black uppercase text-[13px] tracking-widest rounded-xl transition active:scale-99 font-bold"
                    style={{ fontFamily: FONT }}
                  >
                    Dismiss & Return ✕
                  </button>
                </div>
              </>
            )}

          </div>
        </div>
      </div>
    </div>
    </>
  );
};
