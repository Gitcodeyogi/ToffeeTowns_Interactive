import React from 'react';
import { FONT } from '../lib/uiConstants';

interface PuzzleModalProps {
  activePuzzleChore: any;
  puzzleAnswer: string;
  setPuzzleAnswer: (val: string) => void;
  showPuzzleHint: boolean;
  setShowPuzzleHint: (val: boolean) => void;
  puzzleError: string | null;
  setPuzzleError: (val: string | null) => void;
  onVerify: () => void;
  onClose: () => void;
}

export const PuzzleModal: React.FC<PuzzleModalProps> = ({
  activePuzzleChore,
  puzzleAnswer,
  setPuzzleAnswer,
  showPuzzleHint,
  setShowPuzzleHint,
  puzzleError,
  setPuzzleError,
  onVerify,
  onClose,
}) => {
  if (!activePuzzleChore) return null;

  return (
    <div className="w-[80vw] h-[80vh] flex flex-col md:flex-row overflow-hidden bg-neutral-950 border border-pink-500/30 rounded-[2.5rem] shadow-2xl relative text-left font-brand">
      {/* Left Column Image */}
      <div className="w-full md:w-[35%] shrink-0 h-48 md:h-full relative overflow-hidden border-b md:border-b-0 md:border-r border-white/10 bg-neutral-900">
        <img
          src="/Assets/Ganache Grove/Scene_0.1.png"
          alt="Chore illustration"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/80 to-transparent pointer-events-none" />
        <div className="absolute inset-0 flex flex-col justify-end p-6">
          <span className="text-white font-brand text-sm tracking-wider uppercase" style={{ fontFamily: '"Josefin Sans", sans-serif' }}>
            Cottage Chores
          </span>
          <span className="text-pink-400 text-[10px] font-black uppercase tracking-widest mt-0.5 animate-pulse">
            Activity HUD
          </span>
        </div>
      </div>

      {/* Right Column Content */}
      <div className="flex-1 p-8 flex flex-col justify-between h-full min-w-0 bg-[#0a0a0c]">
        {/* Header */}
        <div className="shrink-0 pb-3 border-b border-pink-950 flex justify-between items-start">
          <div>
            <span className="text-[8px] font-black uppercase tracking-[0.25em] text-pink-300">
              Cottage Chore Activity HUD
            </span>
            <h2 className="text-lg font-brand text-yellow-200 mt-0.5 flex items-center gap-2 uppercase" style={{ fontFamily: FONT }}>
              <span>{activePuzzleChore.hotspot.emoji}</span> {activePuzzleChore.chore.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 hover:scale-110 active:scale-95 transition-all flex items-center justify-center bg-pink-950/80 border border-pink-500/30 text-pink-300 font-bold rounded-full text-xs"
          >
            ✕
          </button>
        </div>

        {/* 3-Line Summary Guide */}
        <div className="mt-3 p-3 bg-white/5 border border-white/10 rounded-2xl shrink-0 font-sans">
          <p className="text-[11px] text-pink-200 leading-relaxed">
            1. Solve this sweet local puzzle to help maintain Toffee Town harmony.<br />
            2. Read the prompt and input your correct answer to verify your deed.<br />
            3. Earn XP in your traveler profession and secure extra coins!
          </p>
        </div>

        {/* Question & Input */}
        <div className="flex-grow my-4 overflow-y-auto custom-scrollbar pr-1 py-1 space-y-3 font-sans">
          <div className="space-y-1">
            <span className="text-[8px] font-bold text-pink-400 uppercase tracking-widest block">Chore Objective</span>
            <p className="text-xs text-pink-200 leading-relaxed">{activePuzzleChore.chore.chore}</p>
          </div>

          <div className="bg-black/40 border border-pink-950 p-4 rounded-2xl space-y-3">
            <span className="text-[8px] font-bold text-yellow-400 uppercase tracking-widest block">Puzzle Question</span>
            <p className="text-xs text-white font-medium leading-relaxed">{activePuzzleChore.chore.question}</p>

            <div className="pt-2">
              {activePuzzleChore.chore.type === 'calculation' ? (
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] text-pink-400 uppercase font-black tracking-wider">Your Numerical Answer</label>
                  <input
                    type="text"
                    placeholder="Enter numbers (e.g. 60 or 1.7)..."
                    value={puzzleAnswer}
                    onChange={(e) => {
                      setPuzzleAnswer(e.target.value);
                      setPuzzleError(null);
                    }}
                    className="px-3 py-2 bg-black/60 border border-pink-900/50 rounded-xl text-xs text-white focus:outline-none focus:border-pink-500 w-full font-mono placeholder-pink-850"
                  />
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {activePuzzleChore.chore.options?.map((opt: string) => {
                    const isSelected = puzzleAnswer === opt;
                    return (
                      <button
                        key={opt}
                        onClick={() => {
                          setPuzzleAnswer(opt);
                          setPuzzleError(null);
                        }}
                        className={
                          "px-3 py-2.5 rounded-xl border text-xs text-left font-semibold transition-all duration-200 " +
                          (isSelected
                            ? "bg-gradient-to-r from-pink-500 to-rose-600 border-white text-white shadow-[0_0_15px_rgba(236,72,153,0.5)] scale-[1.02]"
                            : "bg-[#1b050a] border-pink-950 text-pink-200/80 hover:bg-[#250810] hover:text-white hover:border-pink-900/55")
                        }
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Hint guide */}
          <div className="shrink-0">
            {showPuzzleHint ? (
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-[11px] text-amber-200 leading-relaxed animate-fade-in">
                <span className="font-bold block text-[9px] uppercase tracking-wider text-amber-400 mb-0.5">💡 Hint Guide</span>
                {activePuzzleChore.chore.hint}
              </div>
            ) : (
              <button
                onClick={() => setShowPuzzleHint(true)}
                className="text-[10px] text-amber-300 hover:text-amber-200 font-bold flex items-center gap-1 transition px-2 py-1 bg-amber-950/40 border border-amber-900/30 rounded-lg"
              >
                <span>💡</span> Need a Hint?
              </button>
            )}
          </div>

          {puzzleError && (
            <div className="text-[10px] text-rose-300 font-bold bg-rose-950/40 border border-rose-900/30 px-3.5 py-1.5 rounded-xl shrink-0 animate-shake">
              {puzzleError}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center gap-3 border-t border-pink-950 pt-3.5 shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-pink-950 hover:bg-pink-900 text-pink-200 border border-pink-900/50 text-[10px] font-brand uppercase tracking-wider rounded-xl transition"
            style={{ fontFamily: '"Josefin Sans", sans-serif' }}
          >
            Close & Return
          </button>
          <button
            disabled={!puzzleAnswer.trim()}
            onClick={onVerify}
            className={
              "px-5 py-2 text-black text-[10px] font-brand uppercase tracking-widest font-black rounded-xl transition shadow-md " +
              (puzzleAnswer.trim()
                ? "bg-gradient-to-r from-yellow-300 to-amber-500 hover:scale-103 active:scale-97"
                : "bg-neutral-800 text-neutral-500 cursor-not-allowed")
            }
            style={{ fontFamily: '"Josefin Sans", sans-serif' }}
          >
            Verify & Complete Action
          </button>
        </div>
      </div>
    </div>
  );
};
