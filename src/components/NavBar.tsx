import React from 'react';
import { useTTStore } from '../store/useTTStore';
import type { AppPage, TownId } from '../store/useTTStore';

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
  { page: 'cocoa-chat',  label: 'Cocoa Chat',   icon: '💬', color: 'text-pink-400'    },
];

const NavBar: React.FC<Props> = ({ currentPage, onNav, homeTown, hidden }) => {
  const { coins, earnedBadges } = useTTStore();

  const townLabel = homeTown
    ? homeTown.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ')
    : 'No Town';

  return (
    <header className={`relative z-50 flex items-center justify-between px-6 border-b border-white/10 bg-black/60 shrink-0 transition-all duration-500 ease-in-out ${
      hidden ? 'max-h-0 opacity-0 py-0 border-none overflow-hidden pointer-events-none' : 'max-h-[60px] opacity-100 py-2'
    }`}>
      {/* Brand */}
      <div className="flex items-center gap-3">
        <span className="font-brand text-2xl text-amber-400 tracking-wide">
          Toffee Towns
        </span>
        <span className="text-xs font-black uppercase tracking-[0.3em] text-white/30 border border-white/10 px-2 py-0.5 rounded-full">
          .FUN
        </span>
      </div>

      {/* Nav links */}
      <nav className="flex items-center gap-1">
        {NAV_ITEMS.map(item => {
          const isActive = currentPage === item.page;
          return (
            <button
              key={item.page}
              onClick={() => onNav(item.page)}
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
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-black">
          🪙 <span>{coins.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-xs font-black">
          🎖️ <span>{earnedBadges.length}</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-black">
          🏘 <span>{townLabel}</span>
        </div>
      </div>

      {/* Flap hide trigger */}
      {!hidden && (
        <button
          onClick={() => useTTStore.getState().setHeaderHidden(true)}
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
