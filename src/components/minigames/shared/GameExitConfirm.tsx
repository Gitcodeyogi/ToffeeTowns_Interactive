// GameExitConfirm.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Reusable Exit Confirmation Modal.
// Warns the user about coin deductions if they leave mid-game.
// ─────────────────────────────────────────────────────────────────────────────
import React from 'react';
import { FONT } from '../../../lib/uiConstants';
import type { MiniGameConfig } from './MiniGameConfig';

interface GameExitConfirmProps {
  config: MiniGameConfig;
  exitPenalty: number;
  xpPenalty?: number;
  legacyPenalty?: number;
  onConfirm: () => void;
  onCancel: () => void;
}

export const GameExitConfirm: React.FC<GameExitConfirmProps> = ({
  config,
  exitPenalty,
  xpPenalty,
  legacyPenalty,
  onConfirm,
  onCancel,
}) => {
  return (
    <div className="absolute inset-0 z-[520] flex items-center justify-center bg-black/80">
      <div 
        className="animate-fade-in max-w-sm w-full mx-4 p-8 rounded-[2rem] border border-rose-500/30 text-center text-white"
        style={{ 
          background: 'rgba(20, 4, 4, 0.98)', 
          boxShadow: '0 0 60px rgba(239, 68, 68, 0.15)' 
        }}
      >
        <div className="text-5xl mb-3">🚪</div>
        <h3 className="text-lg font-brand font-black text-rose-400 uppercase mb-2" style={{ fontFamily: FONT }}>
          Abandon the Shift?
        </h3>
        <p className="text-xs text-white/70 leading-relaxed mb-2" style={{ fontFamily: 'Georgia, serif' }}>
          Leaving before completing this {config.title} session will trigger an abandonment penalty of:
        </p>
        <p className="text-2xl font-brand font-black text-rose-400 mb-4" style={{ fontFamily: FONT }}>
          -{exitPenalty} 🪙{xpPenalty ? ` & -${xpPenalty} XP` : ''}{legacyPenalty ? ` & -${legacyPenalty} Legacy` : ''}
        </p>
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={onCancel}
            className="py-2.5 rounded-xl border border-emerald-500/35 text-emerald-300 font-bold text-xs hover:bg-emerald-500/15 transition cursor-pointer"
            style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}
          >
            Stay & Complete
          </button>
          <button 
            onClick={onConfirm}
            className="py-2.5 rounded-xl border border-rose-500/35 text-rose-300 font-bold text-xs hover:bg-rose-500/15 transition cursor-pointer"
            style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}
          >
            Pay & Leave
          </button>
        </div>
      </div>
    </div>
  );
};
