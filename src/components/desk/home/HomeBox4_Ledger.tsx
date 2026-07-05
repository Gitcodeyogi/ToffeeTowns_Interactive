import React from 'react';
import { FONT } from '../../../lib/uiConstants';
import type { SubPage } from '../../../lib/uiConstants';

interface HomeBox4_LedgerProps {
  coins: number;
  legacyPoints: number;
  skills: Record<string, number>;
  rentPaid: boolean;
  setRentPaid: (v: boolean) => void;
  spendCoins: (amount: number, reason: string, overdraft?: boolean) => boolean;
  townName: string;
  activeTransport: string;
  equippedPet: string | null;
  equippedDecorations: string[];
  pushPage: (page: SubPage) => void;
  triggerFeedback: (msg: string) => void;
  getProvincialStanding: (pts: number) => string;
  getBuilderStanding: (pts: number) => string;
  getExplorerStanding: (pts: number) => string;
  getHealerStanding: (pts: number) => string;
}

const HomeBox4_Ledger: React.FC<HomeBox4_LedgerProps> = ({
  coins,
  legacyPoints,
  skills,
  rentPaid,
  setRentPaid,
  spendCoins,
  townName,
  activeTransport,
  equippedPet,
  equippedDecorations,
  pushPage,
  triggerFeedback,
  getProvincialStanding,
  getBuilderStanding,
  getExplorerStanding,
  getHealerStanding,
}) => {
  const transportEmoji =
    activeTransport === 'walk' ? '🚶'
    : activeTransport === 'horse-wagon' ? '🐎'
    : activeTransport === 'forest-train' ? '🚂'
    : '🎈';

  return (
    <div className="relative w-full shrink-0">
      {/* Solid backing layer */}
      <div className="absolute top-2 left-2 right-0 bottom-0 bg-emerald-500/35 border-[3px] border-emerald-500/40 rounded-3xl -z-10" />

      {/* Main container */}
      <div
        className="mr-2 mb-2 w-[calc(100%-8px)] lg:h-[500px] lg:max-h-[500px] lg:min-h-[500px] rounded-3xl overflow-hidden border-[3px] border-emerald-500/40 bg-black/60 relative group z-10 flex flex-col lg:flex-row animate-fade-in"
      >

      {/* LEFT COLUMN: Asset Portfolio & Wallet (62%) */}
      <div className="w-full lg:w-[62%] lg:h-full lg:min-h-0 min-h-[380px] p-5 flex flex-col justify-between border-b-[3px] lg:border-b-0 lg:border-r-[3px] border-emerald-500/40 bg-transparent">

        {/* Section Header */}
        <div className="flex justify-between items-center pb-3 border-b border-white/5">
          <div>
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-emerald-400 block font-sans">Asset Ledger</span>
            <h4 className="text-base font-brand text-white uppercase mt-0.5" style={{ fontFamily: FONT }}>Resident Collections</h4>
          </div>
          <button
            onClick={() => pushPage('shop')}
            className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-black text-[9.5px] font-brand uppercase tracking-wider rounded-xl transition font-black"
            style={{ fontFamily: '"Josefin Sans", sans-serif' }}
          >
            Shop Upgrades
          </button>
        </div>

        {/* Grid of collections */}
        <div className="grid grid-cols-2 gap-3 my-4">
          <div className="p-3 bg-transparent border-2 border-emerald-500/30 rounded-2xl text-center flex flex-col items-center justify-between min-h-[90px]">
            <span className="text-2xl">🏡</span>
            <div className="mt-1 font-sans">
              <span className="text-[7.5px] uppercase tracking-wider text-neutral-400 font-bold block">Hometown Estate</span>
              <span className="text-amber-300 font-semibold text-[10.5px] block uppercase truncate mt-0.5">{townName} Cottage</span>
            </div>
          </div>

          <div className="p-3 bg-transparent border-2 border-emerald-500/30 rounded-2xl text-center flex flex-col items-center justify-between min-h-[90px]">
            <span className="text-2xl">{transportEmoji}</span>
            <div className="mt-1 font-sans">
              <span className="text-[7.5px] uppercase tracking-wider text-neutral-400 font-bold block">Active Transport</span>
              <span className="text-cyan-400 font-semibold text-[10.5px] block uppercase truncate mt-0.5">{activeTransport.replace('-', ' ')}</span>
            </div>
          </div>

          <div className="p-3 bg-transparent border-2 border-emerald-500/30 rounded-2xl text-center flex flex-col items-center justify-between min-h-[90px]">
            <span className="text-2xl">🐿️</span>
            <div className="mt-1 font-sans">
              <span className="text-[7.5px] uppercase tracking-wider text-neutral-400 font-bold block">Equipped Companion</span>
              <span className="text-pink-400 font-semibold text-[10.5px] block uppercase truncate mt-0.5">{equippedPet ? equippedPet : 'None'}</span>
            </div>
          </div>

          <div className="p-3 bg-transparent border-2 border-emerald-500/30 rounded-2xl text-center flex flex-col items-center justify-between min-h-[90px]">
            <span className="text-2xl">🏮</span>
            <div className="mt-1 font-sans">
              <span className="text-[7.5px] uppercase tracking-wider text-neutral-400 font-bold block">Upgrades Applied</span>
              <span className="text-yellow-400 font-bold text-[10.5px] block uppercase truncate mt-0.5">{equippedDecorations.length} Items</span>
            </div>
          </div>
        </div>

        {/* Currencies Bar */}
        <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-xl">🪙</div>
            <div>
              <span className="text-[8px] uppercase tracking-widest text-neutral-400 font-bold block font-sans">Wallet Balance</span>
              <span className="text-base font-black text-emerald-400 leading-none">{coins} Cocoa Coins</span>
            </div>
          </div>
          <div className="flex items-center gap-3 text-right">
            <div>
              <span className="text-[8px] uppercase tracking-widest text-neutral-400 font-bold block font-sans">Town Standing</span>
              <span className="text-sm font-brand text-amber-400 uppercase leading-none" style={{ fontFamily: FONT }}>{getProvincialStanding(legacyPoints)}</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-xl">🎖️</div>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Standing Levels & Housing Rent (38%) */}
      <div className="w-full lg:w-[38%] lg:h-full lg:min-h-0 p-5 flex flex-col justify-between bg-transparent overflow-y-auto custom-scrollbar gap-4 border-none">

        {/* Action Toolbar */}
        <div className="flex justify-between items-center pb-3 border-b border-white/5">
          <div>
            <span className="text-[8px] uppercase tracking-[0.2em] text-emerald-300 font-black block font-sans">Standing &amp; Progress</span>
            <h4 className="text-xs font-brand text-white uppercase mt-0.5" style={{ fontFamily: FONT }}>Skill Experience</h4>
          </div>
          <button
            onClick={() => pushPage('dashboard')}
            className="px-3 py-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:scale-105 active:scale-95 text-black font-black text-[9px] uppercase tracking-wider rounded-xl transition shadow-md flex items-center gap-1 shrink-0"
            style={{ fontFamily: '"Josefin Sans", sans-serif' }}
          >
            <span>📊</span> Desk Hub
          </button>
        </div>

        {/* Skill Progress Stats */}
        <div className="rounded-2xl border-2 border-emerald-500/30 bg-transparent p-4 space-y-3 flex-grow justify-between flex flex-col">
          <div className="space-y-3 w-full">
            {[
              { label: 'Builder', standing: getBuilderStanding(skills.builder || 0), lv: Math.floor((skills.builder || 0) / 10) + 1, exp: skills.builder || 0, color: 'text-amber-300', barColor: 'bg-amber-400' },
              { label: 'Explorer', standing: getExplorerStanding(skills.explorer || 0), lv: Math.floor((skills.explorer || 0) / 10) + 1, exp: skills.explorer || 0, color: 'text-cyan-300', barColor: 'bg-cyan-400' },
              { label: 'Healer', standing: getHealerStanding(skills.healer || 0), lv: Math.floor((skills.healer || 0) / 10) + 1, exp: skills.healer || 0, color: 'text-pink-300', barColor: 'bg-pink-400' },
            ].map(s => {
              const pct = (s.exp % 10) * 10;
              return (
                <div key={s.label} className="space-y-1 font-sans">
                  <div className="flex justify-between items-center text-[10px]">
                    <div>
                      <span className="font-black text-white">{s.label}</span>
                      <span className={`ml-2 text-[9px] font-bold ${s.color}`}>{s.standing}</span>
                    </div>
                    <span className="font-mono text-white/50">Lvl {s.lv}</span>
                  </div>
                  <div className="w-full h-1 bg-neutral-900 rounded-full overflow-hidden">
                    <div className={`h-full ${s.barColor}`} style={{ width: `${pct || 10}%` }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Dues checklist area */}
          <div className="pt-3 border-t border-white/5 space-y-2 mt-4">
            <span className="text-[7.5px] uppercase tracking-widest text-neutral-400 font-bold block font-sans">Monthly Housing Dues</span>

            <div className="flex items-center justify-between gap-4 bg-transparent rounded-xl p-2.5 border-2 border-emerald-500/30">
              <div className="font-sans">
                <span className="text-[10px] text-white font-bold block leading-none">Cottage Rent Fee</span>
                <span className="text-[9px] text-white/40 block mt-1 font-semibold">100 Cocoa Coins / cycle</span>
              </div>

              {!rentPaid ? (
                <button
                  onClick={() => {
                    if (spendCoins(100, 'Monthly Cottage Rent Dues')) {
                      setRentPaid(true);
                      localStorage.setItem('tt_rent_paid_cycle', 'true');
                      triggerFeedback('🏡 Rent paid! Cottage residency status secured.');
                    } else {
                      triggerFeedback('❌ Insufficient coins! Settle balance immediately.');
                    }
                  }}
                  className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-black text-[9px] font-brand uppercase tracking-wider rounded-xl transition font-black shrink-0 shadow-md active:scale-95"
                  style={{ fontFamily: '"Josefin Sans", sans-serif' }}
                >
                  Pay (-100 🪙)
                </button>
              ) : (
                <div className="px-3.5 py-1.5 bg-emerald-500/10 border border-emerald-500/35 text-emerald-400 text-[9px] font-black uppercase tracking-wider rounded-xl cursor-default text-center shrink-0">
                  ✓ Settled
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default HomeBox4_Ledger;
