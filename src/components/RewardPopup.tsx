import React from 'react';
import { FONT } from '../lib/uiConstants';

const COFFER_REWARD_FUNNY_TEXTS = [
  "Huzzah! Your metal coffers clang merrily. Added {coins} coins to your treasury stash!",
  "A sweet clink sounds in your pocket! You got {coins} shiny coins!",
  "The tax collector looks away as you tuck {coins} coins into your leather pouch!",
  "Splendid! Your financial ledger shows a healthy growth of {coins} coins!",
  "Cha-ching! You acquired {coins} coins. Don't spend them all on candy canes!"
];

const getFunnyRewardText = (coins: number): string => {
  const idx = Math.floor(Math.random() * COFFER_REWARD_FUNNY_TEXTS.length);
  return COFFER_REWARD_FUNNY_TEXTS[idx].replace('{coins}', coins.toString());
};

interface RewardPopupProps {
  reward: any;
  premiumPassport: boolean;
  onDismiss: (id: string) => void;
}

export const RewardPopup: React.FC<RewardPopupProps> = ({
  reward,
  premiumPassport,
  onDismiss,
}) => {
  if (!reward) return null;
  const comment = getFunnyRewardText(reward.coins);

  return (
    <div className="w-[80vw] h-[80vh] flex flex-col md:flex-row overflow-hidden bg-neutral-950 border border-emerald-500/40 rounded-[2.5rem] shadow-2xl relative text-left">
      {/* Left Column: Celebration Image */}
      <div className="w-full md:w-[35%] shrink-0 h-48 md:h-full relative overflow-hidden border-b md:border-b-0 md:border-r border-white/10 bg-neutral-900">
        <img 
          src="/Assets/task_complete_celebration.png" 
          alt="Celebration" 
          className="w-full h-full object-cover animate-fade-in" 
        />
        <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/80 to-transparent pointer-events-none" />
        <div className="absolute inset-0 flex flex-col justify-end p-6">
          <span className="text-white font-brand text-sm tracking-wider uppercase" style={{ fontFamily: '"Josefin Sans", sans-serif' }}>Task Success!</span>
          <span className="text-emerald-400 text-[10px] font-black uppercase tracking-widest mt-0.5 animate-pulse">Allowance Released</span>
        </div>
        <div className="absolute -top-3 -right-3 text-5xl rotate-12 animate-bounce">
          🪙
        </div>
      </div>

      {/* Right Column: Ledger Details */}
      <div className="flex-1 p-8 flex flex-col justify-between h-full min-w-0 bg-[#0a0a0c]">
        <div className="shrink-0 pb-3 border-b border-white/10">
          <span className="text-[9px] font-black uppercase tracking-[0.25em] text-emerald-400 font-brand">Treasury Coffer Credit</span>
          <h2 className="text-2xl font-brand text-white uppercase mt-0.5" style={{ fontFamily: FONT }}>
            Coffers Updated!
          </h2>
        </div>

        {/* 3-Line Summary Guide */}
        <div className="mt-3 p-3 bg-white/5 border border-white/10 rounded-2xl shrink-0 font-sans">
          <p className="text-[11px] text-emerald-200 leading-relaxed">
            1. Confirm receipt of your completed local residency task.<br />
            2. Review the credit updates registered in your wallet ledger.<br />
            3. Check your passport standing and verify your currency rewards.
          </p>
        </div>

        <div className="flex-grow overflow-y-auto custom-scrollbar my-4 space-y-4 pr-1 py-1 font-sans">
          <p className="text-xs text-white/95 leading-relaxed italic border-l-2 border-emerald-500 pl-3 bg-emerald-950/20 py-2 pr-2 rounded-r-xl">
            "{comment}"
          </p>

          <div className="bg-white/5 border border-white/10 p-4 rounded-2xl space-y-2.5 shadow-[inset_0_1px_4px_rgba(0,0,0,0.5)]">
            <span className="text-[9px] font-black uppercase tracking-wider text-cyan-300">Credits Logged:</span>
            <div className="flex justify-between text-xs border-b border-white/5 pb-1.5">
              <span className="text-white/60">Task Completed:</span>
              <span className="text-white font-medium">{reward.name}</span>
            </div>
            {reward.coins > 0 && (
              <div className="flex justify-between text-xs border-b border-white/5 pb-1.5">
                <span className="text-white/60 font-semibold text-emerald-400/80">Local Allowance:</span>
                <span className="text-emerald-400 font-bold">+{reward.coins} Coins</span>
              </div>
            )}
            {reward.xp > 0 && (
              <div className="flex justify-between text-xs border-b border-white/5 pb-1.5">
                <span className="text-white/60 font-semibold text-cyan-400/80">{reward.xpCat?.toUpperCase()} XP:</span>
                <span className="text-cyan-400 font-bold">+{reward.xp} XP</span>
              </div>
            )}
            {reward.legacy > 0 && (
              <div className="flex justify-between text-xs">
                <span className="text-white/60 font-semibold text-yellow-400/80">Standing Legacy:</span>
                <span className="text-yellow-400 font-bold">+{premiumPassport ? Math.ceil(reward.legacy * 1.5) : reward.legacy} Pts</span>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={() => onDismiss(reward.id)}
          className="w-full py-3.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-500 hover:scale-[1.02] text-black font-black uppercase tracking-widest text-xs rounded-xl transition active:scale-95 shadow-glow shrink-0 font-brand"
          style={{ fontFamily: '"Josefin Sans", sans-serif' }}
        >
          Acknowledge Ledger 🎟️
        </button>
      </div>
    </div>
  );
};
