import React from 'react';
import { FONT, FLASH_NEWS_DATA } from '../lib/uiConstants';

interface FlashNewsModalProps {
  onClose: () => void;
}

export const FlashNewsModal: React.FC<FlashNewsModalProps> = ({ onClose }) => {
  const currentHour = new Date().getHours();
  const currentBlock = Math.floor(currentHour / 3);
  const newsItem = FLASH_NEWS_DATA.find(x => x.block === currentBlock) || FLASH_NEWS_DATA[0];

  return (
    <div className="w-[80vw] h-[80vh] flex flex-col md:flex-row overflow-hidden bg-[#0d0d11] border-2 border-amber-500/50 rounded-[2.5rem] shadow-[0_0_60px_rgba(245,158,11,0.25)] relative text-left">
      
      {/* Decorative Art-Deco Corners */}
      <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-amber-500/30 pointer-events-none z-50" />
      <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-amber-500/30 pointer-events-none z-50" />
      <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-amber-500/30 pointer-events-none z-50" />
      <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-amber-500/30 pointer-events-none z-50" />

      {/* Left Column Image - 3:2 layout */}
      <div className="w-full md:w-[35%] shrink-0 h-48 md:h-full relative overflow-hidden border-b md:border-b-0 md:border-r-2 border-amber-950/40 bg-neutral-900 select-none">
        <img
          src="/Assets/Ganache Grove/GanacheGrove_GossipCorner.png"
          alt="Gossip Corner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#0d0d11] via-[#0d0d11]/45 to-transparent pointer-events-none z-10" />
        
        {/* Inner gold frame inside the image section */}
        <div className="absolute inset-3 border border-amber-500/20 rounded-[1.8rem] z-20 pointer-events-none" />

        <div className="absolute inset-0 flex flex-col justify-end p-8 z-30">
          <div className="flex items-center gap-1.5 mb-1 bg-amber-500/20 border border-amber-500/40 px-2.5 py-1 rounded-lg w-fit">
            <span className="text-[12px] animate-pulse">📡</span>
            <span className="text-amber-400 font-brand text-[9px] font-black uppercase tracking-[0.2em] leading-none" style={{ fontFamily: '"Josefin Sans", sans-serif' }}>
              Flash Wire
            </span>
          </div>
          
          <h3 className="text-white font-brand text-lg tracking-wide uppercase leading-tight mt-1" style={{ fontFamily: FONT }}>
            The Morning Dispatch
          </h3>
          <span className="text-white/40 text-[9.5px] font-mono tracking-widest mt-1 block uppercase">
            Cocoawood County Broadsheet
          </span>
        </div>
      </div>

      {/* Right Column Content */}
      <div className="flex-1 p-8 flex flex-col justify-between h-full min-w-0 bg-[#0e0e12] relative z-20">
        
        {/* Header */}
        <div className="shrink-0 pb-4 border-b border-white/10 flex justify-between items-start">
          <div>
            <span className="text-[8.5px] font-black uppercase tracking-[0.3em] text-amber-500">Urgent Broadcast Alert</span>
            <h2 className="text-xl font-brand text-white uppercase mt-0.5" style={{ fontFamily: FONT }}>
              Town Hall Gazette Bulletin
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 hover:scale-110 active:scale-95 transition-all flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-full border border-white/10 text-white font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* 3-Line Summary Guide - Styled like an elegant parchment slip */}
        <div className="mt-4 p-4 bg-[#FAF6EE] border-2 border-amber-950/20 rounded-2xl shrink-0 font-sans shadow-inner relative overflow-hidden select-text text-amber-950">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-900/5 rounded-full translate-x-12 -translate-y-12 pointer-events-none" />
          <span className="text-[9px] font-black uppercase tracking-wider text-amber-900/60 block mb-1.5 font-sans flex items-center gap-1">
            <span>📜</span> Municipal Broadwire Guidelines
          </span>
          <p className="text-[11.5px] text-amber-950 leading-relaxed font-serif">
            1. Check the local broadcast wire for updates across the township.<br />
            2. Follow recommended safety and resource steps described below.<br />
            3. Clear tasks or plan travel routes before the next bulletin arrives.
          </p>
        </div>

        {/* News Flash Text Area */}
        <div className="flex-grow overflow-y-auto custom-scrollbar my-4 pr-1 py-1 space-y-4">
          <div className="p-4 bg-amber-950/15 border-l-4 border-amber-500 rounded-r-2xl italic text-amber-200 text-xs leading-relaxed font-sans text-justify shadow-md">
            "{newsItem.news}"
          </div>

          {/* Recommended actions list */}
          <div className="space-y-3">
            <span className="text-[9.5px] font-brand uppercase tracking-[0.2em] text-cyan-400 block" style={{ fontFamily: '"Josefin Sans", sans-serif' }}>
              Recommended Actions & Tasks 🛠_
            </span>
            <div className="grid grid-cols-1 gap-2.5">
              {newsItem.recommendedActions.map((actText, idx) => (
                <div key={idx} className="flex gap-3 items-center p-3 bg-white/5 border border-white/5 hover:border-amber-500/30 rounded-xl hover:bg-white/[0.08] transition-all duration-300">
                  <span className="text-amber-400 text-xs flex items-center justify-center w-5 h-5 rounded-full bg-amber-500/10 border border-amber-500/30 font-bold shrink-0">✓</span>
                  <span className="font-sans text-[11px] text-neutral-300 leading-snug">{actText}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={onClose}
          className="w-full py-4 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:brightness-110 text-black font-brand font-black uppercase tracking-widest text-xs rounded-xl transition active:scale-95 shadow-md shadow-amber-500/10 shrink-0 cursor-pointer"
          style={{ fontFamily: '"Josefin Sans", sans-serif' }}
        >
          Acknowledge Bulletin 🎟️
        </button>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};
