import React from 'react';
import { FONT } from '../lib/uiConstants';

interface BankruptcyModalProps {
  coins: number;
  onRedirectToCoins: () => void;
}

export const BankruptcyModal: React.FC<BankruptcyModalProps> = ({
  coins,
  onRedirectToCoins,
}) => {
  return (
    <div className="w-[80vw] h-[80vh] flex flex-col md:flex-row overflow-hidden bg-neutral-950 border border-red-500/30 rounded-[2.5rem] shadow-2xl relative text-left">
      {/* Left Column Image - 3:2 horizontal image slot */}
      <div className="w-full md:w-[35%] shrink-0 h-48 md:h-full relative overflow-hidden border-b md:border-b-0 md:border-r border-white/10 bg-neutral-900">
        <img
          src="/Assets/WelcomeShow/Theme4_TheFever.png"
          alt="Bankrupt"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/80 to-transparent pointer-events-none" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-7xl animate-bounce">🚫</span>
        </div>
      </div>

      {/* Right Column Content */}
      <div className="flex-1 p-8 flex flex-col justify-between h-full min-w-0 bg-[#0a0a0c]">
        <div className="shrink-0 pb-3 border-b border-white/10">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-red-400">Imperial Treasury Registry</span>
          <h2 className="text-2xl font-brand text-rose-500 uppercase mt-1" style={{ fontFamily: FONT }}>
            Account Bankrupt!
          </h2>
        </div>

        {/* 3-Line Summary Guide */}
        <div className="mt-3 p-3 bg-white/5 border border-white/10 rounded-2xl shrink-0 font-sans">
          <p className="text-[11.5px] text-rose-200 leading-relaxed">
            1. Resolve negative wallet balance to unlock Toffee Town operations.<br />
            2. Check current provincial allowances or visit the coin store.<br />
            3. Submit correct answers to outstanding chores once coins are acquired.
          </p>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar my-4 pr-1">
          <div className="p-4 bg-red-950/20 border border-red-900/30 rounded-2xl">
            <p className="text-sm text-rose-200 leading-relaxed font-sans">
              Your wallet is currently in arrears at <span className="text-rose-400 font-bold font-mono">{coins} Cocoa Coins</span>.
              All activities are locked until you clear your debts.
            </p>
          </div>
        </div>

        <button
          onClick={onRedirectToCoins}
          className="w-full py-3.5 bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 text-black font-brand font-black uppercase tracking-wider text-xs rounded-xl shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 shrink-0"
          style={{ fontFamily: '"Josefin Sans", sans-serif' }}
        >
          Purchase Cocoa Coins 🪙
        </button>
      </div>
    </div>
  );
};
