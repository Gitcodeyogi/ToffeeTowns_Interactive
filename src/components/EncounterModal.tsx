import React from 'react';
import { FONT } from '../lib/uiConstants';

interface EncounterModalProps {
  currentEncounter: any;
  onResolve: (idx: number) => void;
}

export const EncounterModal: React.FC<EncounterModalProps> = ({
  currentEncounter,
  onResolve,
}) => {
  if (!currentEncounter) return null;

  return (
    <div className="w-[80vw] h-[80vh] flex flex-col md:flex-row overflow-hidden bg-neutral-950 border border-white/10 rounded-[2.5rem] shadow-2xl relative text-left">
      {/* Left Column Image - 3:2 layout */}
      <div className="w-full md:w-[35%] shrink-0 h-48 md:h-full relative overflow-hidden border-b md:border-b-0 md:border-r border-white/10 bg-neutral-900">
        <img
          src="/Assets/WelcomeShow/CocoawoodCounty.png"
          alt="Roadside Encounter"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/80 to-transparent pointer-events-none" />
        <div className="absolute inset-0 flex flex-col justify-end p-6">
          <span className="text-white font-brand text-sm tracking-wider uppercase" style={{ fontFamily: '"Josefin Sans", sans-serif' }}>
            Provincial Paths
          </span>
          <span className="text-amber-400 text-[10px] font-black uppercase tracking-widest mt-0.5 animate-pulse">
            Encounter Event
          </span>
        </div>
      </div>

      {/* Right Column Content */}
      <div className="flex-1 p-8 flex flex-col justify-between h-full min-w-0 bg-[#0a0a0c]">
        <div className="shrink-0 pb-3 border-b border-white/10 flex justify-between items-start">
          <div>
            <span className="text-[9px] font-black uppercase tracking-[0.25em] text-amber-400">Roadside Encounter</span>
            <h2 className="text-xl font-brand text-white uppercase mt-0.5" style={{ fontFamily: FONT }}>
              {currentEncounter.title}
            </h2>
          </div>
          <div className="w-10 h-10 rounded-full border border-amber-500/25 bg-amber-500/5 flex items-center justify-center text-lg text-amber-400 rotate-12">
            🍂
          </div>
        </div>

        {/* 3-Line Summary Guide */}
        <div className="mt-3 p-3 bg-white/5 border border-white/10 rounded-2xl shrink-0 font-sans">
          <p className="text-[11px] text-amber-200 leading-relaxed">
            1. Read this random provincial event you encountered during your travels.<br />
            2. Select the optimal path forward to handle the roadside situation.<br />
            3. Earn extra coins, standing points, or skip penalties.
          </p>
        </div>

        <div className="flex-grow overflow-y-auto custom-scrollbar my-4 space-y-3 pr-1 py-1 font-sans">
          <p className="text-xs text-white/90 leading-relaxed bg-white/5 p-4 rounded-2xl border border-white/5 italic">
            "{currentEncounter.text}"
          </p>
          <div className="flex flex-col gap-2">
            {currentEncounter.options.map((opt: any, idx: number) => (
              <button
                key={idx}
                onClick={() => onResolve(idx)}
                className="w-full text-left p-3 bg-white/5 hover:bg-amber-500 hover:text-black border border-white/10 hover:border-amber-500 rounded-xl text-xs text-white transition font-medium flex items-center justify-between"
              >
                <span>{opt.label}</span>
                <span className="text-[10px] font-bold text-amber-400/80 group-hover:text-black font-mono">Select</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
