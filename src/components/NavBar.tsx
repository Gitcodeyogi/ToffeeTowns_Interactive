import React, { useState } from 'react';
import { useTTStore } from '../store/useTTStore';
import type { AppPage, TownId } from '../store/useTTStore';
import { cozyAudio } from '../utils/audioHelper';

interface Props {
  currentPage: AppPage;
  onNav: (page: AppPage) => void;
  homeTown: TownId | null;
  hidden?: boolean;
}

const NAV_ITEMS: { page: AppPage; label: string; icon: string; color: string }[] = [
  { page: 'desk',        label: 'Desk',        icon: '🏠', color: 'text-amber-400'   },
  { page: 'characters',  label: 'Cast',         icon: '🎭', color: 'text-purple-400'  },
  { page: 'badges',      label: 'Badges',       icon: '🎖️', color: 'text-yellow-400'  },
  { page: 'leaderboard', label: 'Leaderboard',  icon: '🏆', color: 'text-emerald-400' },
  { page: 'coins',       label: 'Treasury',     icon: '🪙', color: 'text-orange-400'  },
  { page: 'pipkin-chat',  label: 'Pipkin Chat',   icon: '💬', color: 'text-pink-400'    },
];

const NavBar: React.FC<Props> = ({ currentPage, onNav, homeTown: _homeTown, hidden }) => {
  const [isMusicPlaying, setIsMusicPlaying] = useState(cozyAudio.getIsMusicPlaying());


  const handleNavClick = (page: AppPage) => {
    cozyAudio.playClick();
    onNav(page);
  };

  const handleToggleMusic = () => {
    cozyAudio.playClick();
    if (isMusicPlaying) {
      cozyAudio.stopMusic();
      setIsMusicPlaying(false);
    } else {
      cozyAudio.startMusic();
      setIsMusicPlaying(true);
    }
  };

  return (
    <header className={`relative z-50 flex items-center justify-between px-6 border-b border-white/10 bg-black/60 shrink-0 transition-all duration-500 ease-in-out ${
      hidden ? 'max-h-0 opacity-0 py-0 border-none overflow-hidden pointer-events-none' : 'max-h-[60px] opacity-100 py-2'
    }`}>
      {/* Brand */}
      <div 
        className="glassy-logo-container scale-90 origin-left"
        onClick={() => handleNavClick('desk')}
        title="ToffeeTowns.fun Home"
      >
        <div className="glassy-logo-icon">
          <span className="emblem-text">tt</span>
        </div>
        <span className="glassy-logo-text">Toffee Towns</span>
        <span className="glassy-logo-pill">.FUN</span>
      </div>

      {/* Nav links */}
      <nav className="flex items-center gap-1">
        {NAV_ITEMS.map(item => {
          const isActive = currentPage === item.page;
          return (
            <button
              key={item.page}
              onClick={() => handleNavClick(item.page)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all duration-200 border
                ${isActive
                  ? 'bg-white/10 border-white/20 text-white scale-105'
                  : 'border-transparent text-white/50 hover:text-white hover:bg-white/5'
                }`}
            >
              <span>{item.icon}</span>
              <span className={isActive ? item.color : ''}>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Status pills */}
      <div className="flex items-center gap-3">
        {/* Jukebox Toggle Button */}
        <button
          onClick={handleToggleMusic}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-300 hover:scale-105 active:scale-95 border cursor-pointer ${
            isMusicPlaying
              ? 'bg-amber-500/25 border-amber-500/40 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.2)]'
              : 'bg-white/5 border-white/10 text-white/60 hover:text-white'
          }`}
          title={isMusicPlaying ? 'Stop Cozy Music' : 'Start Cozy Music'}
        >
          <span>{isMusicPlaying ? '📻 🎶' : '📻 🔕'}</span>
          <span>Jukebox</span>
        </button>


        <button
          onClick={() => {
            cozyAudio.playClick();
            useTTStore.getState().setPage('desk');
            setTimeout(() => {
              window.dispatchEvent(new CustomEvent('tt_change_subpage', { detail: 'journal' }));
            }, 100);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-500/15 border border-purple-500/35 hover:bg-purple-500/25 text-purple-300 text-xs font-black transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-md"
          title="View Your Profile"
        >
          👤 <span>My Profile</span>
        </button>
        <button
          onClick={() => {
            cozyAudio.playClick();
            useTTStore.getState().logout();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-500/15 border border-red-500/35 hover:bg-red-500/25 text-red-300 text-xs font-black transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-md"
          title="Sign Out"
        >
          🚪 <span>Logout</span>
        </button>
        <button
          onClick={() => { cozyAudio.playClick(); useTTStore.getState().setShowHelpModal(true); }}
          className="w-8 h-8 rounded-full border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/25 flex items-center justify-center cursor-pointer shadow-[0_2px_10px_rgba(245,158,11,0.15)] hover:scale-110 active:scale-95 transition-all duration-300 text-xs"
          title="Guide & System Architecture"
        >
          ❓
        </button>
      </div>

      {/* Flap hide trigger */}
      {!hidden && (
        <button
          onClick={() => { cozyAudio.playClick(); useTTStore.getState().setHeaderHidden(true); }}
          className="absolute left-1/2 bottom-[-16px] transform -translate-x-1/2 z-[60] w-8 h-8 rounded-full border border-amber-500/30 bg-[#111116]/95 flex items-center justify-center cursor-pointer shadow-[0_2px_10px_rgba(245,158,11,0.25)] hover:scale-110 active:scale-95 transition-all duration-300 text-sm hover:border-amber-400"
          title="Hide Header"
        >
          ⭐
        </button>
      )}
    </header>
  );
};

export default NavBar;
