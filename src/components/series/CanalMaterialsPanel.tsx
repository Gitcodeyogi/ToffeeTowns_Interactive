import React, { useState } from 'react';

interface CanalMaterialsPanelProps {
  coins: number;
  material: {
    name: string;
    cost: number;
    description: string;
    icon: string;
  } | null;
  handlePurchaseMaterials: (cost: number, name: string) => void;
  onRedirectToShop: () => void;
}

export const CanalMaterialsPanel: React.FC<CanalMaterialsPanelProps> = ({
  coins,
  material,
  handlePurchaseMaterials,
  onRedirectToShop,
}) => {
  const [manifestFlipped, setManifestFlipped] = useState(false);
  const [auditFlipped, setAuditFlipped] = useState(false);
  const [agreementFlipped, setAgreementFlipped] = useState(false);

  if (!material) return null;

  const hasEnoughCoins = coins >= material.cost;

  return (
    <div className="flex-grow flex flex-col justify-start gap-4 p-6 min-h-0 overflow-y-auto">
      {/* Row 1: Header/Instructions */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0 shadow-sm">
        <div>
          <h4 className="text-white font-brand text-[15px] uppercase tracking-wider">Procurement Phase: Cargo Verification</h4>
          <p className="text-[12px] text-white/50">Flip all three cards below to verify cargo specs, verify coffer funds, and execute the signature agreement.</p>
        </div>
        <div className="flex gap-6 shrink-0 bg-black/30 border border-white/5 px-4 py-2 rounded-xl">
          <div className="text-right">
            <span className="text-[9px] text-white/40 uppercase tracking-wider block">Treasury Coffers</span>
            <span className="text-sm font-black text-amber-300 font-mono">{coins} 🪙</span>
          </div>
          <div className="text-right border-l border-white/10 pl-4">
            <span className="text-[9px] text-white/40 uppercase tracking-wider block">Acquisition Fee</span>
            <span className="text-sm font-black text-emerald-400 font-mono">{material.cost} 🪙</span>
          </div>
        </div>
      </div>

      {/* Row 2: Flipped Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full mx-auto pb-4">
        
        {/* Card 1: Manifest */}
        <div 
          className="w-full h-[260px] cursor-pointer"
          style={{ perspective: '1000px' }}
          onClick={() => setManifestFlipped(!manifestFlipped)}
        >
          <div 
            className="relative w-full h-full select-none"
            style={{
              transformStyle: 'preserve-3d',
              transform: manifestFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
              transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            {/* Front */}
            <div 
              className="absolute inset-0 w-full h-full flex flex-col items-center justify-center rounded-2xl border border-amber-500/20 bg-gradient-to-b from-[#1c1917]/90 to-[#0c0a09]/95 shadow-xl text-center p-6"
              style={{ backfaceVisibility: 'hidden' }}
            >
              <div className="w-14 h-14 rounded-full bg-amber-500/10 border border-amber-500/35 flex items-center justify-center text-2xl mb-3 animate-pulse">
                📦
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-400">Section I</span>
              <h4 className="text-[15px] font-bold text-white mt-1">Cargo Manifest</h4>
              <p className="text-[11px] text-white/45 mt-2 leading-relaxed">Click to inspect supply dimensions, quality labels, and origin stamps.</p>
              <span className="mt-4 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/25 text-[8.5px] text-amber-400 font-bold uppercase">Inspect Manifest 🔍</span>
            </div>
            {/* Back */}
            <div 
              className="absolute inset-0 w-full h-full flex flex-col justify-between rounded-2xl border border-emerald-500/20 bg-neutral-900 shadow-xl p-5 text-left"
              style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                  <span className="text-xl">{material.icon}</span>
                  <span className="text-[13px] font-black uppercase tracking-wider text-emerald-400">Specs Sheet</span>
                </div>
                <span className="text-[11px] font-black text-stone-300 block">{material.name}</span>
                <p className="text-[11px] text-neutral-300 leading-relaxed font-sans">{material.description}</p>
              </div>
              <div className="flex justify-between items-center text-[10px] text-white/30 border-t border-white/5 pt-2">
                <span>Origin: Ganache Merchant Guild</span>
                <span className="text-emerald-400 font-bold">Passed ✓</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Audit */}
        <div 
          className="w-full h-[260px] cursor-pointer"
          style={{ perspective: '1000px' }}
          onClick={() => setAuditFlipped(!auditFlipped)}
        >
          <div 
            className="relative w-full h-full select-none"
            style={{
              transformStyle: 'preserve-3d',
              transform: auditFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
              transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            {/* Front */}
            <div 
              className="absolute inset-0 w-full h-full flex flex-col items-center justify-center rounded-2xl border border-cyan-500/20 bg-gradient-to-b from-[#1c1917]/90 to-[#0c0a09]/95 shadow-xl text-center p-6"
              style={{ backfaceVisibility: 'hidden' }}
            >
              <div className="w-14 h-14 rounded-full bg-cyan-500/10 border border-cyan-500/35 flex items-center justify-center text-2xl mb-3 animate-pulse">
                🪙
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider text-cyan-400">Section II</span>
              <h4 className="text-[15px] font-bold text-white mt-1">Treasury Audit</h4>
              <p className="text-[11px] text-white/45 mt-2 leading-relaxed">Click to verify available local allowance coins and audit ledger balance.</p>
              <span className="mt-4 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/25 text-[8.5px] text-cyan-400 font-bold uppercase">Audit Ledgers 🪙</span>
            </div>
            {/* Back */}
            <div 
              className="absolute inset-0 w-full h-full flex flex-col justify-between rounded-2xl border border-emerald-500/20 bg-neutral-900 shadow-xl p-5 text-left"
              style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
            >
              <div className="space-y-2.5">
                <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                  <span className="text-xl">💰</span>
                  <span className="text-[13px] font-black uppercase tracking-wider text-cyan-400">Coffer Audit</span>
                </div>
                <div className="space-y-1 font-mono text-[11px]">
                  <div className="flex justify-between font-sans">
                    <span className="text-white/40">Coffer Gold:</span>
                    <span className="text-white font-bold">{coins} Coins</span>
                  </div>
                  <div className="flex justify-between font-sans">
                    <span className="text-white/40">Manifest Fee:</span>
                    <span className="text-amber-400 font-bold font-mono">-{material.cost} Coins</span>
                  </div>
                  <div className="flex justify-between border-t border-white/5 pt-1 mt-1 font-sans">
                    <span className="text-white/40">Net Remaining:</span>
                    <span className={coins >= material.cost ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
                      {coins - material.cost} Coins
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center text-[10px] text-white/30 border-t border-white/5 pt-2">
                <span>Allowance Audit</span>
                <span className={coins >= material.cost ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
                  {coins >= material.cost ? 'Verified ✓' : 'Insufficient ⚠️'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Agreement */}
        <div 
          className="w-full h-[260px] cursor-pointer"
          style={{ perspective: '1000px' }}
          onClick={() => setAgreementFlipped(!agreementFlipped)}
        >
          <div 
            className="relative w-full h-full select-none"
            style={{
              transformStyle: 'preserve-3d',
              transform: agreementFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
              transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            {/* Front */}
            <div 
              className="absolute inset-0 w-full h-full flex flex-col items-center justify-center rounded-2xl border border-purple-500/20 bg-gradient-to-b from-[#1c1917]/90 to-[#0c0a09]/95 shadow-xl text-center p-6"
              style={{ backfaceVisibility: 'hidden' }}
            >
              <div className="w-14 h-14 rounded-full bg-purple-500/10 border border-purple-500/35 flex items-center justify-center text-2xl mb-3 animate-pulse">
                📜
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider text-purple-400">Section III</span>
              <h4 className="text-[15px] font-bold text-white mt-1">Merchant Scroll</h4>
              <p className="text-[11px] text-white/45 mt-2 leading-relaxed">Click to unroll the official purchase pact and sign the release form.</p>
              <span className="mt-4 px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/25 text-[8.5px] text-purple-400 font-bold uppercase">Sign Pacts 📜</span>
            </div>
            {/* Back */}
            <div 
              className="absolute inset-0 w-full h-full flex flex-col justify-between rounded-2xl border border-emerald-500/20 bg-neutral-900 shadow-xl p-5 text-left"
              style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
              onClick={(e) => e.stopPropagation()} // Keep button clicks from flipping card back
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                  <span className="text-xl">🖋️</span>
                  <span className="text-[13px] font-black uppercase tracking-wider text-purple-400">Sign & Authorize</span>
                </div>
                <p className="text-[10px] text-stone-300 leading-normal font-sans">
                  By signing, you authorize the immediate debit of <span className="text-amber-400 font-semibold">{material.cost} coins</span> from your pocket.
                </p>
              </div>
              <div className="w-full mt-3">
                {hasEnoughCoins ? (
                  <button
                    onClick={() => handlePurchaseMaterials(material.cost, material.name)}
                    className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-brand font-black uppercase tracking-widest text-[11px] rounded-xl transition hover:scale-[1.02] active:scale-98 shadow-[0_0_15px_rgba(245,158,11,0.25)]"
                    style={{ fontFamily: '"Josefin Sans", sans-serif' }}
                  >
                    Sign & Buy ({material.cost} 🪙)
                  </button>
                ) : (
                  <div className="space-y-2">
                    <button
                      disabled
                      className="w-full py-2.5 bg-white/5 border border-white/10 text-white/20 font-black uppercase tracking-widest text-[11px] rounded-xl cursor-not-allowed"
                      style={{ fontFamily: '"Josefin Sans", sans-serif' }}
                    >
                      Need {material.cost} Coins
                    </button>
                    <button
                      onClick={onRedirectToShop}
                      className="w-full py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-black font-black uppercase tracking-wider text-[11px] rounded-xl transition flex items-center justify-center gap-1 font-bold hover:scale-[1.02] active:scale-98"
                      style={{ fontFamily: '"Josefin Sans", sans-serif' }}
                    >
                      Recharge Coins 🪙
                    </button>
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
