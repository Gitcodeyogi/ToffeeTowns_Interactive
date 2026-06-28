import React from 'react';

interface CanalDocumentsPanelProps {
  currentSeriesStep: any;
  puzzleState: any;
  setPuzzleState: (v: any) => void;
  minigameSolved: boolean;
  handleSolveMinigame: () => void;
  triggerFeedback: (msg: string) => void;
  setAssignmentIndex: (idx: number) => void;
  getMinigameSubmitLabel: (id: string) => string;
}

export const CanalDocumentsPanel: React.FC<CanalDocumentsPanelProps> = ({
  currentSeriesStep,
  puzzleState,
  setPuzzleState,
  minigameSolved,
  handleSolveMinigame,
  triggerFeedback,
  setAssignmentIndex,
  getMinigameSubmitLabel,
}) => {
  if (minigameSolved) {
    return (
      <div className="space-y-4 max-w-md mx-auto">
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-center">
          <p className="text-emerald-400 font-bold text-sm">✓ Assignment 1 Completed</p>
          <p className="text-[14.5px] text-white/60 mt-1">You have successfully solved the visual newspaper layout challenge!</p>
          <button
            onClick={() => {
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
          if (!details) return null;
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
};
