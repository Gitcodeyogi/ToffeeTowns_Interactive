import React from 'react';
import { useTTStore } from '../../store/useTTStore';
import { FONT, type SubPage } from '../../pages/TravellersDesk';

interface GG_TravellerDeck_HeaderProps {
  title: string;
  setSubPage: (page: SubPage) => void;
  popPage: () => void;
}

export const GG_TravellerDeck_Header: React.FC<GG_TravellerDeck_HeaderProps> = ({
  title,
  setSubPage,
  popPage,
}) => {
  const { coins, legacyPoints } = useTTStore();

  return (
    <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4 shrink-0">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setSubPage('home')}
          className="px-4 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 rounded-full text-xs font-brand uppercase tracking-wider transition duration-200"
          style={{ fontFamily: '"Josefin Sans", sans-serif' }}
        >
          🏡 Back to Residence
        </button>
        <button
          onClick={popPage}
          className="px-4 py-1.5 bg-white/5 hover:bg-white/10 border border-white/15 text-white rounded-full text-xs font-brand uppercase tracking-wider transition duration-200"
          style={{ fontFamily: '"Josefin Sans", sans-serif' }}
        >
          ← Back
        </button>
        <button
          onClick={() => {
            const state = useTTStore.getState();
            state.setWelcomeDone(false);
            state.setPage('welcome');
          }}
          className="px-4 py-1.5 bg-neutral-800 hover:bg-neutral-700 border border-white/10 text-white rounded-full text-xs font-brand uppercase tracking-wider transition duration-200"
          style={{ fontFamily: '"Josefin Sans", sans-serif' }}
        >
          📜 Replay Onboarding
        </button>
      </div>
      <h2 className="text-xl md:text-2xl font-brand text-amber-400 uppercase tracking-wider" style={{ fontFamily: FONT }}>
        {title}
      </h2>
      <div className="flex items-center gap-3 bg-black/40 px-3 py-1.5 rounded-full border border-white/10 text-xs font-semibold select-none text-white">
        <span>🪙 {coins} Coins</span>
        <span className="text-white/20">|</span>
        <span>🎖️ {legacyPoints} Legacy</span>
      </div>
    </div>
  );
};
