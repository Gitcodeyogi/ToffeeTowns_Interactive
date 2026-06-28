import React, { useState } from 'react';
import { useTTStore } from '../../store/useTTStore';
import { FONT, type SubPage } from '../../lib/uiConstants';
import { WorldTimeManager } from '../WorldTimeManager';

interface GG_TravellerDeck_HeaderProps {
  title: string;
  tagline?: string;
  setSubPage: (page: SubPage) => void;
  popPage: () => void;
  currentSubPage?: SubPage;
}

const NAV_OPTIONS: { id: SubPage; label: string; icon: string }[] = [
  { id: 'home',       label: 'Residence (Home)',  icon: '🏡' },
  { id: 'theatre',    label: 'Town Theatre',      icon: '🎭' },
  { id: 'gossip',     label: 'Gossip Corner',     icon: '🗣️' },
  { id: 'politics',   label: 'Town Council',      icon: '🏛️' },
  { id: 'economy',    label: 'Trade & Economy',   icon: '💰' },
  { id: 'places',     label: 'Town Landmarks',    icon: '🗺️' },
  { id: 'classroom',  label: 'Academy',           icon: '🏫' },
  { id: 'workshop',   label: 'Workshop',          icon: '🛠️' },
  { id: 'newspaper',  label: 'NewsPaper',         icon: '📰' },
  { id: 'transport',  label: 'Transit',           icon: '🚂' },
  { id: 'health',     label: 'Clinic',            icon: '🏥' },
  { id: 'shop',       label: 'Market',            icon: '🛍️' },
  { id: 'stampbook',  label: 'Passport',          icon: '🎫' },
  { id: 'journal',    label: 'Journal',           icon: '📖' },
  { id: 'mini-games', label: 'Games Page',        icon: '🎮' },
  { id: 'dashboard',  label: 'Desk Hub',          icon: '🎛️' },
];

export const GG_TravellerDeck_Header: React.FC<GG_TravellerDeck_HeaderProps> = ({
  title,
  tagline,
  setSubPage,
  popPage,
  currentSubPage = 'home',
}) => {
  const { coins, legacyPoints } = useTTStore();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-white/10 pb-4 mb-4 shrink-0 flex flex-row items-center justify-between gap-4 w-full select-none">
      
      {/* Left side: Back Navigation Split Button + Curfew Bell */}
      <div className="flex items-center justify-start gap-3 z-50">
        
        {/* Destination Split Button */}
        <div className="relative inline-flex items-center">
          {/* Main Back Button */}
          <button
            onClick={popPage}
            className="pl-4 pr-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 border-y border-l border-emerald-500/40 text-white rounded-l-full text-[10px] font-brand uppercase tracking-wider transition duration-200 active:scale-95 shadow-md font-black cursor-pointer"
            style={{ fontFamily: '"Josefin Sans", sans-serif' }}
          >
            <span>←</span> Back
          </button>
          
          {/* Split line */}
          <div className="h-6 w-[1px] bg-emerald-500/35 z-10" />

          {/* Destination Dropdown Arrow */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="pl-2 pr-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 border-y border-r border-emerald-500/40 text-white rounded-r-full text-[10px] font-brand transition duration-200 active:scale-95 shadow-md font-black cursor-pointer flex items-center justify-center gap-1"
            style={{ fontFamily: '"Josefin Sans", sans-serif' }}
          >
            <span>Destination ▼</span>
          </button>
          
          {isOpen && (
            <>
              {/* Invisible backdrop overlay to close the dropdown on click outside */}
              <div className="fixed inset-0 z-40 cursor-default" onClick={() => setIsOpen(false)} />
              
              <div className="absolute left-0 mt-8 w-56 rounded-2xl bg-[#0f0f13] border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.8)] z-50 py-2.5 overflow-hidden animate-fade-in text-left">
                <div className="text-[8px] font-black uppercase tracking-[0.25em] text-emerald-400 px-3.5 py-1 border-b border-white/5 font-sans mb-1">
                  Quick Destination
                </div>
                <div className="max-h-60 overflow-y-auto custom-scrollbar">
                  <button
                    onClick={() => {
                      popPage();
                      setIsOpen(false);
                    }}
                    className="w-full px-3.5 py-2 text-left hover:bg-white/5 transition flex items-center gap-2.5 text-emerald-400 font-bold"
                  >
                    <span className="text-sm shrink-0">🏡</span>
                    <span className="text-[10px] font-black uppercase tracking-wider" style={{ fontFamily: '"Josefin Sans", sans-serif' }}>
                      Exit to Town
                    </span>
                  </button>
                  <div className="h-[1px] bg-white/5 my-1" />
                  {NAV_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => {
                        setSubPage(opt.id);
                        setIsOpen(false);
                      }}
                      className="w-full px-3.5 py-2 text-left hover:bg-white/5 transition flex items-center gap-2.5 text-white/80 hover:text-white"
                    >
                      <span className="text-sm shrink-0">{opt.icon}</span>
                      <span className="text-[10px] font-bold uppercase tracking-wider" style={{ fontFamily: '"Josefin Sans", sans-serif' }}>
                        {opt.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Curfew Bell moved to Left Side */}
        <WorldTimeManager currentSubPage={currentSubPage} showBadge />
      </div>

      {/* Center: Sleek centered subpage Title */}
      <div className="hidden md:flex flex-col justify-center items-center text-center">
        <h2 
          className="text-sm md:text-base font-brand text-amber-400 uppercase tracking-widest font-black animate-pulse" 
          style={{ fontFamily: FONT }}
        >
          {title}
        </h2>
        {tagline && (
          <span className="text-[10px] md:text-[11px] text-white/60 italic font-sans mt-0.5 tracking-wide">
            {tagline}
          </span>
        )}
      </div>

      {/* Right side: Stats (Nice and Wider, coin emoji replaced) */}
      <div className="flex items-center justify-end gap-3 z-10">
        <div className="flex items-center gap-4 bg-black/60 px-6 py-2 rounded-full border border-white/10 text-xs font-black select-none text-white shadow-lg tracking-wider font-brand">
          <span className="text-emerald-400 flex items-center gap-1.5 font-sans">🪙 {coins} Coins</span>
          <span className="text-white/20">|</span>
          <span className="text-amber-400 flex items-center gap-1.5 font-sans">⭐ {legacyPoints} Legacy</span>
        </div>
      </div>
    </div>
  );
};
