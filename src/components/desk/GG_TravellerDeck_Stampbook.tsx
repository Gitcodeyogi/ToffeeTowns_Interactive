import React from 'react';
import { useTTStore } from '../../store/useTTStore';
import { GG_TravellerDeck_Header } from './GG_TravellerDeck_Header';
import { FONT, getProvincialStanding, type SubPage } from '../../pages/TravellersDesk';

interface GG_TravellerDeck_StampbookProps {
  setSubPage: (page: SubPage) => void;
  popPage: () => void;
  triggerFeedback: (msg: string) => void;
}

export const GG_TravellerDeck_Stampbook: React.FC<GG_TravellerDeck_StampbookProps> = ({
  setSubPage,
  popPage,
  triggerFeedback,
}) => {
  const {
    travellerName,
    homeTown,
    legacyPoints,
    claimedStamps,
    premiumPassport,
    lastStampedDate,
    claimDailyStamp,
  } = useTTStore();

  const townName = (homeTown || 'ganache-grove').replace('-', ' ').replace(/\b\w/g, c => c.toUpperCase());

  return (
    <div className="w-full h-full flex flex-col justify-between">
      <GG_TravellerDeck_Header
        title="MY IMPERIAL PASSPORT SEALS"
        setSubPage={setSubPage}
        popPage={popPage}
      />

      <div className="flex-1 flex flex-col md:flex-row gap-6 my-4 overflow-hidden min-h-0">
        {/* Left slot: Passport Card */}
        <div className="w-full md:w-[40%] shrink-0 h-full rounded-[2rem] border border-amber-500/25 bg-amber-900/5 p-6 flex flex-col justify-between shadow-lg relative select-none">
          <div className="space-y-4">
            <div className="text-center pb-3 border-b border-white/10">
              <span className="text-6xl">📖</span>
              <h3 className="text-lg font-brand text-amber-400 uppercase mt-2" style={{ fontFamily: FONT }}>
                Citizenship Ledger
              </h3>
              <p className="text-[11px] text-white/50 italic mt-0.5">Registered Residency Passport</p>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-white/40">Resident Name:</span>
                <span className="text-white font-medium">{travellerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">Current Parish:</span>
                <span className="text-white font-medium">{townName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">Standing Rank:</span>
                <span className="text-amber-300 font-brand uppercase text-xs" style={{ fontFamily: '"Josefin Sans", sans-serif' }}>
                  {getProvincialStanding(legacyPoints)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">Seals Logged:</span>
                <span className="text-cyan-400 font-bold">{claimedStamps.length} Stamps</span>
              </div>
              <div className="flex justify-between border-t border-white/5 pt-2 mt-2">
                <span className="text-white/40">Premium Class:</span>
                <span className={`font-bold ${premiumPassport ? 'text-yellow-400' : 'text-white/30'}`}>
                  {premiumPassport ? '👑 GOLDEN REGISTRY' : 'STANDARD'}
                </span>
              </div>
            </div>
          </div>

          {/* Stamp Action */}
          {(() => {
            const todayStr = new Date().toISOString().slice(0, 10);
            const isStampedToday = lastStampedDate === todayStr;
            
            return (
              <div className="space-y-2">
                {isStampedToday ? (
                  <div className="py-3 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-center rounded-xl text-xs font-bold font-sans">
                    ✓ Presence Logged Today
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      let icon = '🌳';
                      let color = 'text-emerald-400';
                      if (homeTown === 'toffee-town') { icon = '🌰'; color = 'text-amber-400'; }
                      else if (homeTown === 'eclair-square') { icon = '🌊'; color = 'text-purple-400'; }
                      else if (homeTown === 'peppermint-peak') { icon = '🏔'; color = 'text-cyan-400'; }
                      
                      claimDailyStamp(homeTown || 'ganache-grove', icon, color);
                      triggerFeedback('🎫 Stamped! Earned +20 Coins allowance!');
                    }}
                    className="w-full py-3 bg-gradient-to-r from-amber-400 to-orange-500 hover:scale-[1.02] text-black font-black uppercase text-xs rounded-xl shadow-glow transition active:scale-95 animate-pulse"
                    style={{ fontFamily: '"Josefin Sans", sans-serif' }}
                  >
                    Stamp Daily Presence (+20🪙)
                  </button>
                )}
                <p className="text-[9px] text-white/30 text-center">Enforces active citizenship in the province counties.</p>
              </div>
            );
          })()}
        </div>

        {/* Right slot: Stamp Book grid */}
        <div className="w-full md:w-[60%] shrink-0 h-full border border-white/10 bg-black/25 rounded-[2rem] p-6 overflow-y-auto custom-scrollbar flex flex-col justify-start">
          <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-amber-400 mb-4">Collected County Seals</h3>

          {claimedStamps.length === 0 ? (
            <div className="flex-grow flex flex-col items-center justify-center text-white/30 text-xs gap-2">
              <span className="text-4xl">📭</span>
              <span>No seals collected yet. Stamp your daily presence to start logs!</span>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
              {claimedStamps.map((s, idx) => (
                <div key={idx} className="p-3 bg-white/5 border border-white/10 rounded-2xl text-center relative overflow-hidden flex flex-col items-center justify-center animate-fade-in">
                  <div className="w-12 h-12 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center text-2xl mb-1 bg-white/5 shadow-[inset_0_1px_4px_rgba(0,0,0,0.4)]">
                    <span className={s.color}>{s.icon}</span>
                  </div>
                  <span className="text-[10px] text-white font-semibold block uppercase tracking-tight">
                    {s.townId.replace('-', ' ')}
                  </span>
                  <span className="text-[8px] text-white/40 block mt-0.5 font-mono">{s.date}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
