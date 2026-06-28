import React from 'react';
import { FONT } from '../lib/uiConstants';

interface ConsequenceModalProps {
  consequenceModal: any;
  onClose: () => void;
}

export const ConsequenceModal: React.FC<ConsequenceModalProps> = ({
  consequenceModal,
  onClose,
}) => {
  if (!consequenceModal) return null;

  return (
    <div className="w-[80vw] h-[80vh] flex flex-col md:flex-row overflow-hidden bg-neutral-950 border border-white/10 rounded-[2.5rem] shadow-2xl relative text-left">
      {/* Left Column Image - 3:2 layout */}
      <div className="w-full md:w-[35%] shrink-0 h-48 md:h-full relative overflow-hidden border-b md:border-b-0 md:border-r border-white/10 bg-neutral-900">
        <img
          src="/Assets/Ganache Grove/Scene_0.1.png"
          alt="Consequence cover"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/80 to-transparent pointer-events-none" />
        <div className="absolute inset-0 flex flex-col justify-end p-6">
          <span className="text-white font-brand text-sm tracking-wider uppercase" style={{ fontFamily: '"Josefin Sans", sans-serif' }}>
            Citizenship Records
          </span>
          <span className="text-emerald-400 text-[10px] font-black uppercase tracking-widest mt-0.5 animate-pulse">
            Action Result
          </span>
        </div>
      </div>

      {/* Right Column Content */}
      <div className="flex-1 p-8 flex flex-col justify-between h-full min-w-0 bg-[#0a0a0c]">
        <div className="shrink-0 pb-3 border-b border-white/10 flex justify-between items-start">
          <div>
            <span className="text-[9px] font-black uppercase tracking-[0.25em] text-emerald-400">Activity Consequence</span>
            <h2 className="text-xl md:text-2xl font-brand text-white uppercase mt-0.5" style={{ fontFamily: FONT }}>
              {consequenceModal.title}
            </h2>
          </div>
          <div className="w-10 h-10 rounded-full border border-emerald-500/35 bg-emerald-500/10 flex items-center justify-center text-lg text-emerald-400 rotate-12 select-none">
            ✓
          </div>
        </div>

        {/* 3-Line Summary Guide */}
        <div className="mt-3 p-3 bg-white/5 border border-white/10 rounded-2xl shrink-0 font-sans">
          <p className="text-[11px] text-emerald-200 leading-relaxed">
            1. Read the outcome of your recently completed township deed.<br />
            2. Check the updated registry values in your permanent passport record.<br />
            3. Earn reputation standing points for supporting provincial tasks.
          </p>
        </div>

        <div className="flex-grow overflow-y-auto custom-scrollbar my-4 space-y-3 text-white/95 text-xs leading-relaxed font-sans pr-1">
          <p>{consequenceModal.text}</p>
          <div className="p-3 bg-white/5 border border-white/10 rounded-2xl">
            <span className="text-[8.5px] uppercase tracking-wider text-cyan-300 font-bold block mb-1">Permanent Passport Record:</span>
            <div className="flex justify-between text-[11px]">
              <span className="text-white/60">Legacy Reputation Points:</span>
              <span className="text-emerald-400 font-bold">Gained!</span>
            </div>
            <div className="flex justify-between text-[11px] mt-0.5">
              <span className="text-white/60">Profession Progress:</span>
              <span className="text-cyan-400 font-bold">Recorded!</span>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:scale-[1.02] text-black font-black uppercase tracking-widest text-xs rounded-xl transition active:scale-95 shadow-glow shrink-0 font-brand"
          style={{ fontFamily: '"Josefin Sans", sans-serif' }}
        >
          Acknowledge Deed 🎟️
        </button>
      </div>
    </div>
  );
};
