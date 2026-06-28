import React, { useState, useEffect } from 'react';
import { useTTStore } from '../../store/useTTStore';
import { GG_TravellerDeck_Header } from './GG_TravellerDeck_Header';
import { FONT, type SubPage } from '../../lib/uiConstants';
import { ECONOMY_CONFIG } from '../../constants/economyConfig';

interface Props {
  setSubPage: (p: SubPage) => void;
  popPage: () => void;
  triggerFeedback: (msg: string) => void;
}

export const GG_TravellerDeck_Economy: React.FC<Props> = ({
  setSubPage,
  popPage,
  triggerFeedback,
}) => {
  const { coins, spendCoins, addCoins, addLegacy, skills } = useTTStore();

  // Calculate total XP and level details
  const totalXP = Object.values(skills || {}).reduce((a, b) => a + b, 0);
  const isContributor = totalXP >= 3000;

  // Business State
  const [businessStarted, setBusinessStarted] = useState<boolean>(() => {
    return localStorage.getItem('tt_business_started_v2') === 'true';
  });

  const [lastClaimTime, setLastClaimTime] = useState<number>(() => {
    const saved = localStorage.getItem('tt_last_business_profit_claim');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [canClaim, setCanClaim] = useState<boolean>(false);

  useEffect(() => {
    if (!businessStarted) return;
    const checkReadiness = () => {
      const now = Date.now();
      setCanClaim(now - lastClaimTime >= 30 * 1000);
    };
    checkReadiness();
    const interval = setInterval(checkReadiness, 5000);
    return () => clearInterval(interval);
  }, [businessStarted, lastClaimTime]);

  const handleStartBusiness = () => {
    if (coins < 200) {
      triggerFeedback('❌ You need 200 Coins to lease the shop premises!');
      return;
    }
    if (!isContributor) {
      triggerFeedback('❌ Contributor standing (Level 3) is required to start a business!');
      return;
    }

    if (spendCoins(200, 'Started Ganache Mirror Glaze Confectionery')) {
      localStorage.setItem('tt_business_started_v2', 'true');
      setBusinessStarted(true);
      setLastClaimTime(Date.now());
      localStorage.setItem('tt_last_business_profit_claim', Date.now().toString());
      addLegacy(50);
      triggerFeedback('🎉 Congratulations! You started the Ganache Mirror Glaze Confectionery! +50 Legacy.');
    }
  };

  const handleClaimProfit = () => {
    if (!canClaim) {
      const remainingSec = Math.ceil((30 * 1000 - (Date.now() - lastClaimTime)) / 1000);
      triggerFeedback(`⏳ Next profit cycle registers in ${remainingSec}s!`);
      return;
    }

    const min = ECONOMY_CONFIG.BUSINESS_YIELD_MIN;
    const max = ECONOMY_CONFIG.BUSINESS_YIELD_MAX;
    const profit = min + Math.floor(Math.random() * (max - min + 1));

    addCoins(profit, 'Business Revenues: Mirror Glaze Boutique');
    addLegacy(1);
    setLastClaimTime(Date.now());
    localStorage.setItem('tt_last_business_profit_claim', Date.now().toString());
    setCanClaim(false);
    triggerFeedback(`💰 Claimed ${profit} Coins and 🏛️ +1 Legacy from your Confectionery Shop revenues!`);
  };

  const produces = [
    { name: 'Premium Ganache', tag: 'Exclusive', icon: '🍯' },
    { name: 'Mirror-Finish Chocolate', tag: 'High Value', icon: '🍫' },
    { name: 'Glaze Extract Capsules', tag: 'Export', icon: '💊' },
    { name: 'Darkness-Roast Ganache', tag: 'Standard', icon: '☕' },
    { name: 'Cacao Essence', tag: 'Raw Material', icon: '🌿' }
  ];

  return (
    <div className="w-full flex-grow flex flex-col min-h-0 overflow-hidden text-white font-sans">
      <GG_TravellerDeck_Header
        title="💰 TRADE & ECONOMY HUB"
        setSubPage={setSubPage}
        popPage={popPage}
      />

      <div className="flex-grow min-h-0 overflow-y-auto custom-scrollbar grid grid-cols-1 xl:grid-cols-3 gap-5 py-3 pr-1">
        
        {/* LEFT PANEL: Trade Profiles */}
        <div className="bg-black/60 border border-amber-500/20 rounded-[2rem] p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden backdrop-blur-md">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
          
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-amber-400 block mb-2">Local Production Registry</span>
            <h3 className="text-xl font-brand text-white uppercase mb-3" style={{ fontFamily: FONT }}>
              Ganache Grove Output
            </h3>
            
            <p className="text-xs text-neutral-350 leading-relaxed font-sans mb-4 italic bg-white/5 border border-white/5 p-3 rounded-2xl">
              "Mirror-finish ganache bottles and glaze extract capsules are grove exclusives. Quality control is obsessive."
            </p>

            <h5 className="text-[9.5px] font-black uppercase tracking-wider text-neutral-400 mb-2">Primary Produces & Export Cargo</h5>
            <div className="space-y-2">
              {produces.map((prod) => (
                <div key={prod.name} className="p-3 bg-neutral-900/60 border border-white/5 rounded-2xl flex items-center justify-between gap-2 text-xs hover:border-amber-500/35 transition duration-200">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{prod.icon}</span>
                    <span className="font-semibold text-white">{prod.name}</span>
                  </div>
                  <span className="px-2 py-0.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-lg text-[8.5px] font-bold uppercase tracking-wider">
                    {prod.tag}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-3 border-t border-white/10 flex justify-between items-center text-[10px] text-neutral-400">
            <span>Province Registry: Cocoawood County</span>
            <span>Currency: Gloss Franc</span>
          </div>
        </div>

        {/* MIDDLE PANEL: Start a Business */}
        <div className="bg-black/60 border border-amber-500/20 rounded-[2rem] p-6 flex flex-col justify-between shadow-2xl backdrop-blur-md">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-pink-400 block mb-2">Merchant Ventures</span>
            <h3 className="text-xl font-brand text-white uppercase mb-3" style={{ fontFamily: FONT }}>
              Start a Business
            </h3>

            {!businessStarted ? (
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-br from-purple-950/20 via-purple-900/10 to-stone-900 border border-purple-500/20 rounded-2xl text-center space-y-3">
                  <span className="text-4xl block">🏪</span>
                  <h5 className="font-bold text-white text-sm">Mirror-Finish Confectionery Shop</h5>
                  <p className="text-xs text-neutral-355 leading-relaxed font-sans">
                    Lease prime space at the Docks to export mirror glazed products directly to Toffee Town. Generates recurring dividend profits!
                  </p>
                </div>

                <div className="p-3 bg-black/40 border border-white/5 rounded-2xl text-xs space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-400">Required Standing:</span>
                    <span className={`font-bold flex items-center gap-1 ${isContributor ? 'text-emerald-400' : 'text-red-400'}`}>
                      🍁 Contributor (Lvl 3) {isContributor ? '✓' : `(XP: ${totalXP}/3000)`}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-400">Required Investment:</span>
                    <span className={`font-mono font-bold ${coins >= 200 ? 'text-emerald-400' : 'text-red-400'}`}>
                      🪙 200 Coins {coins >= 200 ? '✓' : `(${coins} owned)`}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleStartBusiness}
                  className={`w-full py-3 rounded-2xl font-brand font-black uppercase text-[10px] tracking-wider transition ${
                    isContributor && coins >= 200
                      ? 'bg-amber-500 hover:bg-amber-400 text-black shadow-glow cursor-pointer'
                      : 'bg-neutral-800 text-white/40 cursor-not-allowed border border-white/5'
                  }`}
                  style={{ fontFamily: '"Josefin Sans", sans-serif' }}
                >
                  🚀 Lease &amp; Start Business (200🪙)
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-br from-emerald-950/20 via-emerald-900/10 to-stone-900 border border-emerald-500/20 rounded-2xl text-center space-y-3">
                  <span className="text-4xl block">🏪</span>
                  <h5 className="font-bold text-white text-sm">Mirror-Finish Confectionery Shop</h5>
                  <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded text-[8px] font-bold uppercase tracking-wider">
                    OPERATIONAL &amp; ACTIVE
                  </span>
                  <p className="text-xs text-neutral-350 leading-relaxed font-sans">
                    Your boutique is exporting glazed items daily. Payouts accumulate in real time!
                  </p>
                </div>

                <div className="p-3 bg-black/40 border border-white/5 rounded-2xl text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Revenues per Cycle:</span>
                    <span className="text-emerald-400 font-bold">{ECONOMY_CONFIG.BUSINESS_YIELD_MIN}–{ECONOMY_CONFIG.BUSINESS_YIELD_MAX} Coins 🪙</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Cycle Status:</span>
                    <span className={canClaim ? 'text-emerald-400 font-bold animate-pulse' : 'text-yellow-400'}>
                      {canClaim ? 'Ready to Claim! 💰' : 'Accruing Profits... ⏳'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleClaimProfit}
                  className={`w-full py-3 rounded-2xl font-brand font-black uppercase text-[10px] tracking-wider transition ${
                    canClaim
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-glow cursor-pointer'
                      : 'bg-neutral-850 text-white/30 cursor-not-allowed border border-white/5'
                  }`}
                  style={{ fontFamily: '"Josefin Sans", sans-serif' }}
                >
                  💰 Claim Confectionery Profits ({ECONOMY_CONFIG.BUSINESS_YIELD_MIN}–{ECONOMY_CONFIG.BUSINESS_YIELD_MAX}🪙)
                </button>
              </div>
            )}
          </div>

          <div className="text-[10px] text-white/40 text-center border-t border-white/5 pt-3">
            Available Capital: <span className="text-amber-400 font-bold font-mono">🪙 {coins}</span>
          </div>
        </div>

        {/* RIGHT PANEL: Trade Statistics */}
        <div className="bg-black/60 border border-amber-500/20 rounded-[2rem] p-6 flex flex-col justify-between shadow-2xl backdrop-blur-md">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-cyan-400 block mb-2">Market Intelligence</span>
            <h3 className="text-xl font-brand text-white uppercase mb-3" style={{ fontFamily: FONT }}>
              Trade Statistics
            </h3>

            <div className="space-y-4 text-xs font-sans">
              <div className="p-3 bg-white/5 border border-white/5 rounded-2xl">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-neutral-450">Trade Stability Index</span>
                  <span className="text-emerald-400 font-bold">95% (Stable)</span>
                </div>
                <div className="w-full h-1.5 bg-neutral-900 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '95%' }}></div>
                </div>
              </div>

              <div className="p-3 bg-white/5 border border-white/5 rounded-2xl space-y-2">
                <span className="text-[9px] font-black uppercase text-neutral-450 block">Active Logistics Connections</span>
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-neutral-300">Mossberry Wharf ➡️ Toffee Town:</span>
                    <span className="text-cyan-400 font-bold">Water barge</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-neutral-300">Grove Depot ➡️ Peppermint Peak:</span>
                    <span className="text-cyan-400 font-bold">Monorail pod</span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-white/5 border border-white/5 rounded-2xl space-y-2">
                <span className="text-[9px] font-black uppercase text-neutral-450 block">Weekly Commodity Demand</span>
                <div className="grid grid-cols-2 gap-2 text-center text-[10px]">
                  <div className="p-2 bg-neutral-950/60 rounded-xl border border-white/5">
                    <span className="text-amber-400 font-bold">High Demand</span>
                    <p className="text-white font-semibold mt-0.5">Mirror Chocolate</p>
                  </div>
                  <div className="p-2 bg-neutral-950/60 rounded-xl border border-white/5">
                    <span className="text-green-400 font-bold">Stable</span>
                    <p className="text-white font-semibold mt-0.5">Cacao Essence</p>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-amber-955/15 border border-amber-500/15 rounded-2xl flex items-center gap-3">
                <span className="text-2xl">🏆</span>
                <div>
                  <h6 className="font-bold text-white text-xs leading-none">Imperial Premium Quality</h6>
                  <p className="text-[9.5px] text-white/50 mt-1">Ganache Grove maintains a 99.8% pure cacao standards rating.</p>
                </div>
              </div>

            </div>
          </div>

          <div className="p-2 border-t border-white/5 text-center text-[10px] text-white/30 shrink-0">
            "Observe supply margins, minimize waste, and maintain mirror glaze standards."
          </div>
        </div>

      </div>
    </div>
  );
};
