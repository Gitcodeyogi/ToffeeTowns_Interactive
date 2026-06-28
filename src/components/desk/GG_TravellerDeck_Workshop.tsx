import React, { useState } from 'react';
import { useTTStore } from '../../store/useTTStore';
import { GG_TravellerDeck_Header } from './GG_TravellerDeck_Header';
import type { SubPage } from '../../lib/uiConstants';

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
  const { coins, spendCoins, addCoins, addLegacy, goldenCitizenPass } = useTTStore();
  const [accordionMode, setAccordionMode] = useState<'free' | 'exclusive'>('free');
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    stations: true,
    store: true,
  });

  const currentSlotsUsed = Object.values(inventory).reduce((a, b) => a + b, 0);
  const totalCapacity = goldenCitizenPass ? 150 : 50;

  const toggleSection = (key: string) => {
    setOpenSections(prev => {
      const isOpen = prev[key];
      if (accordionMode === 'exclusive') {
        const nextState: Record<string, boolean> = {};
        Object.keys(prev).forEach(k => {
          nextState[k] = k === key ? !isOpen : false;
        });
        return nextState;
      } else {
        return {
          ...prev,
          [key]: !isOpen
        };
      }
    });
  };

  const handleBuy = (itemKey: string, name: string, cost: number) => {
    if (currentSlotsUsed >= totalCapacity) {
      triggerFeedback('❌ Warehouse is full! Upgrade to Golden Citizen Pass for 150 slots!');
      return;
    }
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
    <div className="w-full h-full flex flex-col justify-between text-left">
      <GG_TravellerDeck_Header
        title="TOWN WORKSHOP"
        setSubPage={setSubPage}
        popPage={popPage}
      />

      {/* Accordion Control Toolbar */}
      <div className="sticky top-0 z-40 bg-black/60 border border-white/10 rounded-2xl p-3 flex flex-wrap items-center justify-between gap-3 shadow-md select-none mt-1">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black uppercase tracking-wider text-neutral-400">Accordion Mode:</span>
          <button
            onClick={() => setAccordionMode('free')}
            className={`px-3 py-1 text-[10px] uppercase font-bold tracking-wider rounded-xl transition ${
              accordionMode === 'free' ? 'bg-emerald-500 text-black font-black' : 'bg-white/5 text-white/60 hover:bg-white/10'
            }`}
            style={{ fontFamily: '"Josefin Sans", sans-serif' }}
          >
            🔓 Free Mode
          </button>
          <button
            onClick={() => setAccordionMode('exclusive')}
            className={`px-3 py-1 text-[10px] uppercase font-bold tracking-wider rounded-xl transition ${
              accordionMode === 'exclusive' ? 'bg-purple-600 text-white font-black' : 'bg-white/5 text-white/60 hover:bg-white/10'
            }`}
            style={{ fontFamily: '"Josefin Sans", sans-serif' }}
          >
            🔒 Exclusive Mode
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setOpenSections({
                stations: true,
                store: true,
              });
            }}
            className="px-3 py-1 bg-white/5 hover:bg-white/10 text-white/80 text-[10px] font-bold uppercase rounded-xl transition"
            style={{ fontFamily: '"Josefin Sans", sans-serif' }}
          >
            ➕ Expand All
          </button>
          <button
            onClick={() => {
              setOpenSections({
                stations: false,
                store: false,
              });
            }}
            className="px-3 py-1 bg-white/5 hover:bg-white/10 text-white/80 text-[10px] font-bold uppercase rounded-xl transition"
            style={{ fontFamily: '"Josefin Sans", sans-serif' }}
          >
            ➖ Collapse All
          </button>
        </div>
      </div>

      {/* Scrollable Dashboard Container */}
      <div className="flex-grow overflow-y-auto custom-scrollbar my-3 space-y-6 pr-1 min-h-0">

        {/* Accordion Panel 1: Workshop Stations */}
        <div className="rounded-[2.4rem] border border-white/10 bg-black/35 shadow-xl overflow-hidden transition-all duration-300">
          <button
            onClick={() => toggleSection('stations')}
            className="w-full px-6 py-4 flex items-center justify-between text-left border-b border-white/5 bg-white/5 hover:bg-white/10 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">🪵</span>
              <div>
                <h3 className="text-base font-brand uppercase tracking-wider text-white" style={{ fontFamily: '"Josefin Sans", sans-serif' }}>
                  Workshop Stations
                </h3>
                <p className="text-[10px] text-neutral-400">View status, operational capacities, and levels of local production units</p>
              </div>
            </div>
            <span className="text-lg text-neutral-400 font-bold">
              {openSections.stations ? '▼' : '▶'}
            </span>
          </button>
          {openSections.stations && (
            <div className="p-6 space-y-4 animate-fade-in text-left">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Station 1: Cozy Forestry Hangar */}
                <div className="bg-gradient-to-br from-emerald-950/80 via-emerald-900/40 to-stone-900 border border-emerald-500/35 rounded-3xl p-5 shadow-lg relative overflow-hidden group hover:border-emerald-400 transition-all duration-300">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />
                  <div className="flex items-start gap-4">
                    <span className="text-4xl p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl">🪵</span>
                    <div>
                      <h4 className="text-sm font-bold text-white font-brand">Cozy Forestry Hangar</h4>
                      <p className="text-[10px] text-emerald-300 font-semibold tracking-wider uppercase mt-0.5">Status: Operational</p>
                      <p className="text-[11px] text-white/60 mt-1.5 leading-relaxed font-sans">
                        Saws raw ganache logs into sturdy building timber. Harvests forest moss from undergrowth.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between border-t border-emerald-900/40 pt-3 mt-4 text-[10px]">
                    <span className="text-white/40">Produces: Wood, Moss</span>
                    <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded font-bold uppercase tracking-wider">Level 1</span>
                  </div>
                </div>

                {/* Station 2: Molten Candy Forge */}
                <div className="bg-gradient-to-br from-orange-950/80 via-orange-900/40 to-stone-900 border border-orange-500/35 rounded-3xl p-5 shadow-lg relative overflow-hidden group hover:border-orange-400 transition-all duration-300">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/10 rounded-full blur-xl pointer-events-none" />
                  <div className="flex items-start gap-4">
                    <span className="text-4xl p-3 bg-orange-500/10 border border-orange-500/30 rounded-2xl">🔥</span>
                    <div>
                      <h4 className="text-sm font-bold text-white font-brand">Molten Candy Forge</h4>
                      <p className="text-[10px] text-orange-300 font-semibold tracking-wider uppercase mt-0.5">Status: Ready</p>
                      <p className="text-[11px] text-white/60 mt-1.5 leading-relaxed font-sans">
                        Smelts golden brown sugar into heat-treated chewy bolts and iron plates.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between border-t border-orange-900/40 pt-3 mt-4 text-[10px]">
                    <span className="text-white/40">Produces: Bolts, Castings</span>
                    <span className="px-2 py-0.5 bg-orange-500/20 text-orange-300 rounded font-bold uppercase tracking-wider">Level 1</span>
                  </div>
                </div>

                {/* Station 3: Sweet Apothecary Lab */}
                <div className="bg-gradient-to-br from-purple-950/80 via-purple-900/40 to-stone-900 border border-purple-500/35 rounded-3xl p-5 shadow-lg relative overflow-hidden group hover:border-purple-400 transition-all duration-300">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-xl pointer-events-none" />
                  <div className="flex items-start gap-4">
                    <span className="text-4xl p-3 bg-purple-500/10 border border-purple-500/30 rounded-2xl">🧪</span>
                    <div>
                      <h4 className="text-sm font-bold text-white font-brand">Sweet Apothecary Lab</h4>
                      <p className="text-[10px] text-purple-300 font-semibold tracking-wider uppercase mt-0.5">Status: Resting</p>
                      <p className="text-[11px] text-white/60 mt-1.5 leading-relaxed font-sans">
                        Processes salamander mucus and glowing forest herbs into healing compounds.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between border-t border-purple-900/40 pt-3 mt-4 text-[10px]">
                    <span className="text-white/40">Produces: Mucus, Potions</span>
                    <span className="px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded font-bold uppercase tracking-wider">Level 1</span>
                  </div>
                </div>

                {/* Station 4: Baker's Oven Hangar */}
                <div className="bg-gradient-to-br from-yellow-950/50 via-neutral-900/40 to-stone-900 border border-white/10 rounded-3xl p-5 shadow-lg relative overflow-hidden group opacity-75 hover:opacity-100 transition-all duration-300">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500/5 rounded-full blur-xl pointer-events-none" />
                  <div className="flex items-start gap-4">
                    <span className="text-4xl p-3 bg-white/5 border border-white/10 rounded-2xl">🍞</span>
                    <div>
                      <h4 className="text-sm font-bold text-white/65 font-brand">Baker's Steaming Oven</h4>
                      <p className="text-[10px] text-yellow-500 font-semibold tracking-wider uppercase mt-0.5">Status: Locked</p>
                      <p className="text-[11px] text-white/50 mt-1.5 leading-relaxed font-sans">
                        Bakes legendary honeyberry loaves and sweet pastries. (Requires Town Expansion Level 2)
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between border-t border-white/5 pt-3 mt-4 text-[10px]">
                    <span className="text-white/40">Produces: Bread, Pastry</span>
                    <span className="px-2 py-0.5 bg-white/5 text-white/60 rounded font-bold uppercase tracking-wider">Locked</span>
                  </div>
                </div>

              </div>
            </div>
          )}
        </div>

        {/* Accordion Panel 2: Inventory & Store */}
        <div className="rounded-[2.4rem] border border-white/10 bg-black/35 shadow-xl overflow-hidden transition-all duration-300">
          <button
            onClick={() => toggleSection('store')}
            className="w-full px-6 py-4 flex items-center justify-between text-left border-b border-white/5 bg-white/5 hover:bg-white/10 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">🎒</span>
              <div>
                <h3 className="text-base font-brand uppercase tracking-wider text-white" style={{ fontFamily: '"Josefin Sans", sans-serif' }}>
                  My Inventory & Crafting Store
                </h3>
                <p className="text-[10px] text-neutral-400">Buy wood, bolts, moss, and perform district maintenance projects</p>
              </div>
            </div>
            <span className="text-lg text-neutral-400 font-bold">
              {openSections.store ? '▼' : '▶'}
            </span>
          </button>
          {openSections.store && (
            <div className="p-6 space-y-4 animate-fade-in text-left">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Left Side: Inventory & Merchant Store */}
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-1 select-none">
                      <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-yellow-400 font-brand">My Inventory</h3>
                      <span className={`text-[9px] font-black uppercase tracking-wider ${goldenCitizenPass ? 'text-amber-400' : 'text-neutral-400'}`}>
                        {goldenCitizenPass ? '👑 Golden Warehouse' : 'Standard'}: {currentSlotsUsed} / {totalCapacity} Slots
                      </span>
                    </div>
                    {/* Capacity meter */}
                    <div className="w-full h-1.5 bg-black/60 rounded-full overflow-hidden mb-3 border border-white/5 relative">
                      <div 
                        className={`h-full transition-all duration-350 ${
                          currentSlotsUsed >= totalCapacity ? 'bg-rose-500' : goldenCitizenPass ? 'bg-gradient-to-r from-amber-500 to-yellow-400' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${Math.min(100, (currentSlotsUsed / totalCapacity) * 100)}%` }}
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="p-2 bg-white/5 border border-white/10 rounded-xl text-xs">
                        <div className="text-white/50 font-bold uppercase text-[9px] font-brand">Wood</div>
                        <div className="text-base font-bold text-white mt-0.5 font-mono">{inventory.wood || 0}</div>
                      </div>
                      <div className="p-2 bg-white/5 border border-white/10 rounded-xl text-xs">
                        <div className="text-white/50 font-bold uppercase text-[9px] font-brand">Bolts</div>
                        <div className="text-base font-bold text-white mt-0.5 font-mono">{inventory.bolts || 0}</div>
                      </div>
                      <div className="p-2 bg-white/5 border border-white/10 rounded-xl text-xs">
                        <div className="text-white/50 font-bold uppercase text-[9px] font-brand">Moss</div>
                        <div className="text-base font-bold text-white mt-0.5 font-mono">{inventory.moss || 0}</div>
                      </div>
                      <div className="p-2 bg-white/5 border border-white/10 rounded-xl text-xs">
                        <div className="text-white/50 font-bold uppercase text-[9px] font-brand">Mucus</div>
                        <div className="text-base font-bold text-white mt-0.5 font-mono">{inventory.mucus || 0}</div>
                      </div>
                      <div className="p-2 bg-white/5 border border-white/10 rounded-xl text-xs">
                        <div className="text-white/50 font-bold uppercase text-[9px] font-brand">Parchment</div>
                        <div className="text-base font-bold text-white mt-0.5 font-mono">{inventory.parchment || 0}</div>
                      </div>
                      <div className="p-2 bg-white/5 border border-white/10 rounded-xl text-xs">
                        <div className="text-white/50 font-bold uppercase text-[9px] font-brand">Ink</div>
                        <div className="text-base font-bold text-white mt-0.5 font-mono">{inventory.ink || 0}</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-cyan-400 mb-2 font-brand">Merchant Store</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[220px] overflow-y-auto custom-scrollbar pr-1">
                      <div className="flex items-center justify-between p-2 bg-white/5 rounded-xl border border-white/10 text-xs">
                        <span>🌲 Ganache Wood</span>
                        <button onClick={() => handleBuy('wood', 'Ganache Wood', 10)} className="px-3 py-1 bg-yellow-600 hover:bg-yellow-500 rounded-lg text-black font-black uppercase text-[10px] font-brand">10 🪙</button>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-white/5 rounded-xl border border-white/10 text-xs">
                        <span>🔩 Chewy Bolts</span>
                        <button onClick={() => handleBuy('bolts', 'Chewy Bolts', 15)} className="px-3 py-1 bg-yellow-600 hover:bg-yellow-500 rounded-lg text-black font-black uppercase text-[10px] font-brand">15 🪙</button>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-white/5 rounded-xl border border-white/10 text-xs">
                        <span>🌿 Cooling Moss</span>
                        <button onClick={() => handleBuy('moss', 'Cooling Moss', 8)} className="px-3 py-1 bg-yellow-600 hover:bg-yellow-500 rounded-lg text-black font-black uppercase text-[10px] font-brand">8 🪙</button>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-white/5 rounded-xl border border-white/10 text-xs">
                        <span>🧪 Salamander Mucus</span>
                        <button onClick={() => handleBuy('mucus', 'Salamander Mucus', 20)} className="px-3 py-1 bg-yellow-600 hover:bg-yellow-500 rounded-lg text-black font-black uppercase text-[10px] font-brand">20 🪙</button>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-white/5 rounded-xl border border-white/10 text-xs">
                        <span>📄 Parchment Paper</span>
                        <button onClick={() => handleBuy('parchment', 'Parchment', 5)} className="px-3 py-1 bg-yellow-600 hover:bg-yellow-500 rounded-lg text-black font-black uppercase text-[10px] font-brand">5 🪙</button>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-white/5 rounded-xl border border-white/10 text-xs">
                        <span>✒️ Sweet Ink</span>
                        <button onClick={() => handleBuy('ink', 'Sweet Ink', 8)} className="px-3 py-1 bg-yellow-600 hover:bg-yellow-500 rounded-lg text-black font-black uppercase text-[10px] font-brand">8 🪙</button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Side: District Maintenance */}
                <div className="border border-white/10 bg-black/45 rounded-3xl p-5 shadow-lg flex flex-col justify-between">
                  <div>
                    <h3 className="text-[10px] font-brand text-pink-400 uppercase tracking-widest block mb-3">District Maintenance</h3>
                    <div className="p-3 bg-white/5 border border-white/10 rounded-2xl flex flex-col gap-2">
                      <div>
                        <h4 className="text-xs font-bold text-white font-brand">Repair the Town Water Well</h4>
                        <p className="text-[11px] text-white/60 mt-0.5">Requires: 3 Wood, 2 Bolts</p>
                      </div>
                      <button
                        onClick={() => {
                          if ((inventory.wood || 0) < 3 || (inventory.bolts || 0) < 2) {
                            triggerFeedback('❌ Insufficient Wood or Bolts!');
                            return;
                          }
                          setInventory(prev => ({ ...prev, wood: (prev.wood || 0) - 3, bolts: (prev.bolts || 0) - 2 }));
                          addCoins(14, 'Repaired Town Well');
                          addLegacy(2);
                          triggerFeedback('🛠 Well repaired! Gained +14 Coins & +2 Legacy!');
                        }}
                        className="w-full py-2 bg-cyan-600 hover:bg-cyan-500 rounded-xl text-[10px] font-brand uppercase tracking-wider text-white font-black"
                        style={{ fontFamily: '"Josefin Sans", sans-serif' }}
                      >
                        Construct Well Repair
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
