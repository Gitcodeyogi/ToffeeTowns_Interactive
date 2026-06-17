import React from 'react';
import { useTTStore } from '../../store/useTTStore';
import { GG_TravellerDeck_Header } from './GG_TravellerDeck_Header';
import type { SubPage } from '../../pages/TravellersDesk';

interface GG_TravellerDeck_WorkshopProps {
  setSubPage: (page: SubPage) => void;
  popPage: () => void;
  inventory: Record<string, number>;
  setInventory: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  triggerFeedback: (msg: string) => void;
}

export const GG_TravellerDeck_Workshop: React.FC<GG_TravellerDeck_WorkshopProps> = ({
  setSubPage,
  popPage,
  inventory,
  setInventory,
  triggerFeedback,
}) => {
  const { coins, spendCoins, addCoins, addLegacy } = useTTStore();

  const handleBuy = (itemKey: string, name: string, cost: number) => {
    if (coins < cost) {
      triggerFeedback('❌ Insufficient Cocoa Coins!');
      return;
    }
    if (spendCoins(cost, `Bought ${name}`)) {
      setInventory(prev => ({
        ...prev,
        [itemKey]: (prev[itemKey] || 0) + 1,
      }));
      triggerFeedback(`🛒 Bought 1 ${name} for ${cost} Coins!`);
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-between">
      <GG_TravellerDeck_Header
        title="TOWN WORKSHOP"
        setSubPage={setSubPage}
        popPage={popPage}
      />

      {/* Split view */}
      <div className="flex-1 flex flex-row gap-6 my-4 overflow-hidden min-h-0">
        {/* Left slot: Image (Strictly 60%) */}
        <div className="w-[60%] shrink-0 h-full rounded-3xl border border-white/10 bg-black/35 overflow-hidden relative flex items-center justify-center p-3">
          <img src="/towns/Nougat-Node.png" alt="Workshop" className="w-full h-full object-contain rounded-2xl" />
          <span className="absolute bottom-6 left-6 right-6 p-3 bg-black/75 border border-white/5 text-xs text-white/70 rounded-xl text-center">
            "Gather resources, build inventory, and perform structural repairs."
          </span>
        </div>

        {/* Right slot: Shop & Repairs (Strictly 40%) */}
        <div className="w-[40%] shrink-0 h-full flex flex-col justify-between border border-white/10 bg-black/25 rounded-3xl p-6 overflow-y-auto custom-scrollbar">
          
          {/* Inventory List */}
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-yellow-400 mb-2">My Inventory</h3>
            <div className="grid grid-cols-3 gap-2 mb-4 text-center">
              <div className="p-2 bg-white/5 border border-white/10 rounded-xl text-xs">
                <div className="text-white/50 font-bold uppercase text-[9px]">Wood</div>
                <div className="text-base font-bold text-white mt-0.5">{inventory.wood || 0}</div>
              </div>
              <div className="p-2 bg-white/5 border border-white/10 rounded-xl text-xs">
                <div className="text-white/50 font-bold uppercase text-[9px]">Bolts</div>
                <div className="text-base font-bold text-white mt-0.5">{inventory.bolts || 0}</div>
              </div>
              <div className="p-2 bg-white/5 border border-white/10 rounded-xl text-xs">
                <div className="text-white/50 font-bold uppercase text-[9px]">Moss</div>
                <div className="text-base font-bold text-white mt-0.5">{inventory.moss || 0}</div>
              </div>
              <div className="p-2 bg-white/5 border border-white/10 rounded-xl text-xs">
                <div className="text-white/50 font-bold uppercase text-[9px]">Mucus</div>
                <div className="text-base font-bold text-white mt-0.5">{inventory.mucus || 0}</div>
              </div>
              <div className="p-2 bg-white/5 border border-white/10 rounded-xl text-xs">
                <div className="text-white/50 font-bold uppercase text-[9px]">Parchment</div>
                <div className="text-base font-bold text-white mt-0.5">{inventory.parchment || 0}</div>
              </div>
              <div className="p-2 bg-white/5 border border-white/10 rounded-xl text-xs">
                <div className="text-white/50 font-bold uppercase text-[9px]">Ink</div>
                <div className="text-base font-bold text-white mt-0.5">{inventory.ink || 0}</div>
              </div>
            </div>

            {/* Shop */}
            <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-cyan-400 mb-2">Merchant Store</h3>
            <div className="space-y-2 max-h-[20vh] overflow-y-auto custom-scrollbar pr-1">
              <div className="flex items-center justify-between p-2 bg-white/5 rounded-xl border border-white/10 text-xs">
                <span>🌲 Ganache Wood</span>
                <button onClick={() => handleBuy('wood', 'Ganache Wood', 10)} className="px-3 py-1 bg-yellow-600 hover:bg-yellow-500 rounded-lg text-black font-black uppercase text-[10px]">10 🪙</button>
              </div>
              <div className="flex items-center justify-between p-2 bg-white/5 rounded-xl border border-white/10 text-xs">
                <span>🔩 Chewy Bolts</span>
                <button onClick={() => handleBuy('bolts', 'Chewy Bolts', 15)} className="px-3 py-1 bg-yellow-600 hover:bg-yellow-500 rounded-lg text-black font-black uppercase text-[10px]">15 🪙</button>
              </div>
              <div className="flex items-center justify-between p-2 bg-white/5 rounded-xl border border-white/10 text-xs">
                <span>🌿 Cooling Moss</span>
                <button onClick={() => handleBuy('moss', 'Cooling Moss', 8)} className="px-3 py-1 bg-yellow-600 hover:bg-yellow-500 rounded-lg text-black font-black uppercase text-[10px]">8 🪙</button>
              </div>
              <div className="flex items-center justify-between p-2 bg-white/5 rounded-xl border border-white/10 text-xs">
                <span>🧪 Salamander Mucus</span>
                <button onClick={() => handleBuy('mucus', 'Salamander Mucus', 20)} className="px-3 py-1 bg-yellow-600 hover:bg-yellow-500 rounded-lg text-black font-black uppercase text-[10px]">20 🪙</button>
              </div>
              <div className="flex items-center justify-between p-2 bg-white/5 rounded-xl border border-white/10 text-xs">
                <span>📄 Parchment Paper</span>
                <button onClick={() => handleBuy('parchment', 'Parchment', 5)} className="px-3 py-1 bg-yellow-600 hover:bg-yellow-500 rounded-lg text-black font-black uppercase text-[10px]">5 🪙</button>
              </div>
              <div className="flex items-center justify-between p-2 bg-white/5 rounded-xl border border-white/10 text-xs">
                <span>✒️ Sweet Ink</span>
                <button onClick={() => handleBuy('ink', 'Sweet Ink', 8)} className="px-3 py-1 bg-yellow-600 hover:bg-yellow-500 rounded-lg text-black font-black uppercase text-[10px]">8 🪙</button>
              </div>
            </div>
          </div>

          {/* Local Repairs */}
          <div className="border-t border-white/10 pt-3 mt-3">
            <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-pink-400 mb-2">District Maintenance</h3>
            <div className="p-3 bg-white/5 border border-white/10 rounded-2xl flex flex-col gap-2">
              <div>
                <h4 className="text-xs font-bold text-white">Repair the Town Water Well</h4>
                <p className="text-[11px] text-white/60 mt-0.5">Requires: 3 Wood, 2 Bolts</p>
              </div>
              <button
                onClick={() => {
                  if ((inventory.wood || 0) < 3 || (inventory.bolts || 0) < 2) {
                    triggerFeedback('❌ Insufficient Wood or Bolts!');
                    return;
                  }
                  setInventory(prev => ({ ...prev, wood: (prev.wood || 0) - 3, bolts: (prev.bolts || 0) - 2 }));
                  addCoins(100, 'Repaired Town Well');
                  addLegacy(40);
                  triggerFeedback('🛠 Well repaired! Gained +100 Coins & +40 Legacy!');
                }}
                className="w-full py-2 bg-cyan-600 hover:bg-cyan-500 rounded-xl text-[10px] font-brand uppercase tracking-wider text-white"
                style={{ fontFamily: '"Josefin Sans", sans-serif' }}
              >
                Construct Well Repair
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
