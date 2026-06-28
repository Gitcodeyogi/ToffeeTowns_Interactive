import React from 'react';
import { FONT } from '../lib/uiConstants';

interface TownHallModalProps {
  selectedCamp: any;
  completedActions: string[];
  onExecuteMatter: (id: string) => void;
  onClose: () => void;
}

export const TownHallModal: React.FC<TownHallModalProps> = ({
  selectedCamp,
  completedActions,
  onExecuteMatter,
  onClose,
}) => {
  return (
    <div className="w-[80vw] h-[80vh] flex flex-col md:flex-row overflow-hidden bg-neutral-950 border border-white/10 rounded-[2.5rem] shadow-2xl relative text-left">
      {/* Left Column Image - 3:2 layout */}
      <div className="w-full md:w-[35%] shrink-0 h-48 md:h-full relative overflow-hidden border-b md:border-b-0 md:border-r border-white/10 bg-neutral-900">
        <img
          src="/Assets/Ganache Grove/GanacheGrove_marketSquare.png"
          alt="Town Hall"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/80 to-transparent pointer-events-none" />
        <div className="absolute inset-0 flex flex-col justify-end p-6">
          <span className="text-white font-brand text-sm tracking-wider uppercase" style={{ fontFamily: '"Josefin Sans", sans-serif' }}>
            Town Council
          </span>
          <span className="text-cyan-400 text-[10px] font-black uppercase tracking-widest mt-0.5 animate-pulse">
            Campaign Desk
          </span>
        </div>
      </div>

      {/* Right Column Content */}
      <div className="flex-1 p-8 flex flex-col justify-between h-full min-w-0 bg-[#0a0a0c]">
        <div className="shrink-0 pb-3 border-b border-white/10 flex justify-between items-start">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-400">Town Hall Council</span>
            <h2 className="text-2xl font-brand text-white uppercase mt-0.5" style={{ fontFamily: FONT }}>
              County Campaigns
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 hover:scale-110 active:scale-95 transition-all flex items-center justify-center bg-white/5 rounded-full border border-white/10 text-white font-bold"
          >
            ✕
          </button>
        </div>

        {/* 3-Line Summary Guide */}
        <div className="mt-3 p-3 bg-white/5 border border-white/10 rounded-2xl shrink-0 font-sans">
          <p className="text-[11px] text-cyan-200 leading-relaxed">
            1. View active community campaigns proposed by the regional merchants.<br />
            2. Support ongoing projects by pledging required local materials or coins.<br />
            3. Earn reputation standing in your passport and help develop the township.
          </p>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar my-4 space-y-4 pr-1">
          {/* Dynamic Campaign */}
          <div className="p-4 bg-white/5 border border-white/10 rounded-2xl space-y-3 font-sans">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-white text-sm">{selectedCamp.title}</h4>
                <p className="text-[10px] text-white/40 uppercase tracking-widest font-mono">{selectedCamp.category} Campaign</p>
              </div>
              {completedActions.includes(selectedCamp.id) ? (
                <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-bold rounded-lg uppercase">Completed</span>
              ) : (
                <span className="text-[9px] text-amber-400 uppercase tracking-wider font-semibold">Active Campaign</span>
              )}
            </div>
            <p className="text-xs text-white/70 leading-normal">
              {selectedCamp.description} ({selectedCamp.requirementsSummary})
            </p>
            {!completedActions.includes(selectedCamp.id) ? (
              <button
                onClick={() => onExecuteMatter(selectedCamp.id)}
                className="w-full py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-brand text-[10px] uppercase tracking-wider rounded-xl transition"
                style={{ fontFamily: '"Josefin Sans", sans-serif' }}
              >
                Support Campaign 🎟️
              </button>
            ) : (
              <div className="text-center text-[10px] text-white/40 italic">This campaign is completed for today. The town expresses its thanks!</div>
            )}
          </div>
        </div>

        <div className="text-[10px] text-white/40 text-center font-sans border-t border-white/5 pt-3 shrink-0">
          Sir Goldwhistle handles all logistics. Gained standing is recorded in your passport.
        </div>
      </div>
    </div>
  );
};
