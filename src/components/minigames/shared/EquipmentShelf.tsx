// EquipmentShelf.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Reusable pre-game equipment prep room ("Old Captain's Shack", etc.)
// Renders items on categorized wooden shelves for immersive preparation.
// ─────────────────────────────────────────────────────────────────────────────
import React, { useState } from 'react';
import { FONT } from '../../../lib/uiConstants';
import type { MiniGameConfig, EquipmentItem } from './MiniGameConfig';

interface EquipmentShelfProps {
  config: MiniGameConfig;
  coins: number;
  unlockedPermanents: string[]; // List of unlocked permanent item IDs
  onBuyPermanent: (itemId: string, cost: number) => void; // Callback to save purchase
  onStartGame: (selectedConsumables: EquipmentItem[], selectedPermanents: EquipmentItem[]) => void;
  onBack: () => void;
  titleOverride?: string; // e.g. "Captain's Shack", "Chef's Pantry"
}

export const EquipmentShelf: React.FC<EquipmentShelfProps> = ({
  config,
  coins,
  unlockedPermanents,
  onBuyPermanent,
  onStartGame,
  onBack,
  titleOverride,
}) => {
  const [selectedConsumables, setSelectedConsumables] = useState<Record<string, number>>({});
  const [activePermanents, setActivePermanents] = useState<Record<string, boolean>>(() => {
    // Automatically activate unlocked permanent gear
    const initial: Record<string, boolean> = {};
    unlockedPermanents.forEach(id => {
      initial[id] = true;
    });
    return initial;
  });

  const categories: { key: EquipmentItem['category']; label: string; desc: string; icon: string }[] = [
    { key: 'tool', label: 'Consumables: Hand Tools', desc: 'Cheaper, single-run conveniences', icon: '🧰' },
    { key: 'storage', label: 'Consumables: Storage & Holds', desc: 'Single-run carrying helpers', icon: '🧺' },
    { key: 'helper', label: 'Consumables: Helpers & Aids', desc: 'Single-run HUD hints and cues', icon: '🧭' },
    { key: 'booster', label: 'Consumables: Boosters', desc: 'Single-run temporary speed & timing buffers', icon: '✨' },
    { key: 'permanent', label: 'Permanent Gear & Accessories', desc: 'High-cost, permanent additions to your setup', icon: '🏆' },
  ];

  // Helper to calculate total prep coins cost
  const getConsumablesTotalCost = () => {
    let sum = 0;
    config.equipment.forEach(item => {
      if (!item.isPermanent && selectedConsumables[item.id]) {
        sum += item.cost * selectedConsumables[item.id];
      }
    });
    return sum;
  };

  const totalCost = getConsumablesTotalCost();
  const canAfford = coins >= totalCost;

  const handleAddConsumable = (item: EquipmentItem) => {
    const currentQty = selectedConsumables[item.id] || 0;
    const itemCost = item.cost;
    const futureCost = totalCost - (currentQty * itemCost) + ((currentQty + 1) * itemCost);
    if (coins >= futureCost && currentQty < 2) { // Cap at 2 per consumable
      setSelectedConsumables(prev => ({ ...prev, [item.id]: currentQty + 1 }));
    }
  };

  const handleRemoveConsumable = (item: EquipmentItem) => {
    const currentQty = selectedConsumables[item.id] || 0;
    if (currentQty > 0) {
      setSelectedConsumables(prev => ({ ...prev, [item.id]: currentQty - 1 }));
    }
  };

  const handleTogglePermanent = (item: EquipmentItem) => {
    const unlocked = unlockedPermanents.includes(item.id);
    if (unlocked) {
      // Toggle active status
      setActivePermanents(prev => ({ ...prev, [item.id]: !prev[item.id] }));
    } else {
      // Buy it
      if (coins >= item.cost) {
        onBuyPermanent(item.id, item.cost);
        setActivePermanents(prev => ({ ...prev, [item.id]: true }));
      }
    }
  };

  const handleStart = () => {
    if (!canAfford) return;

    // Compile selection lists
    const consumablesList: EquipmentItem[] = [];
    config.equipment.forEach(item => {
      if (!item.isPermanent) {
        const qty = selectedConsumables[item.id] || 0;
        for (let i = 0; i < qty; i++) {
          consumablesList.push(item);
        }
      }
    });

    const activePermsList = config.equipment.filter(
      item => item.isPermanent && activePermanents[item.id]
    );

    onStartGame(consumablesList, activePermsList);
  };

  return (
    <div 
      className="absolute inset-0 z-[400] flex items-center justify-center p-4"
      style={{ backgroundImage: `url(${config.backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="absolute inset-0 bg-black/70" />
      <div 
        className="relative z-10 flex flex-col overflow-hidden animate-fade-in w-[980px] max-w-[95vw] max-h-[92vh] text-white"
        style={{ 
          borderRadius: '2.5rem', 
          border: '1px solid rgba(255,255,255,0.15)', 
          background: 'rgba(15, 8, 20, 0.96)',
          backdropFilter: 'blur(16px)', 
          boxShadow: `0 25px 60px rgba(0,0,0,0.85)` 
        }}
      >
        {/* Header */}
        <div className="px-8 pt-6 pb-4 border-b border-white/10 flex justify-between items-center shrink-0">
          <div>
            <span className="text-[9px] uppercase tracking-[0.35em] text-cyan-400 font-brand">
              Preparation Room
            </span>
            <h1 className="text-2xl font-black text-white uppercase mt-0.5 tracking-tight" style={{ fontFamily: FONT }}>
              🚪 {titleOverride || `${config.title} Prep Shed`}
            </h1>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-white/50">Your Coins Balance</p>
            <p className="text-xl font-brand font-black text-amber-300" style={{ fontFamily: FONT }}>
              {coins} 🪙
            </p>
          </div>
        </div>

        {/* Categorized Shelves */}
        <div className="flex-grow overflow-y-auto px-8 py-6 space-y-6 custom-scrollbar min-h-0">
          {categories.map(cat => {
            const items = config.equipment.filter(item => item.category === cat.key);
            if (items.length === 0) return null;

            return (
              <div key={cat.key} className="space-y-2 border-b border-white/5 pb-5 last:border-b-0">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{cat.icon}</span>
                  <div>
                    <h3 className="text-xs font-black uppercase text-white/80 tracking-wider">
                      {cat.label}
                    </h3>
                    <p className="text-[9.5px] text-white/40">{cat.desc}</p>
                  </div>
                </div>

                {/* Wooden Rack Shelf Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
                  {items.map(item => {
                    const isPerm = item.isPermanent;
                    const unlocked = isPerm && unlockedPermanents.includes(item.id);
                    const active = isPerm && activePermanents[item.id];
                    const qty = !isPerm ? selectedConsumables[item.id] || 0 : 0;

                    return (
                      <div 
                        key={item.id} 
                        className={`p-3 rounded-2xl border transition-all duration-300 flex flex-col justify-between h-[105px] ${
                          isPerm 
                            ? active 
                              ? 'bg-purple-950/20 border-purple-500/40 shadow-[0_0_12px_rgba(168,85,247,0.1)]' 
                              : unlocked
                                ? 'bg-white/4 border-white/10 opacity-70 hover:opacity-100'
                                : 'bg-black/30 border-white/6 hover:border-purple-500/25'
                            : qty > 0 
                              ? 'bg-cyan-950/20 border-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.1)]' 
                              : 'bg-black/30 border-white/6 hover:border-cyan-500/20'
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          <span className="text-3xl p-1 bg-white/5 border border-white/5 rounded-xl shrink-0">
                            {item.icon}
                          </span>
                          <div className="min-w-0">
                            <h4 className="text-xs font-bold text-white truncate">{item.name}</h4>
                            <p className="text-[9.5px] text-white/50 leading-tight truncate-2-lines mt-0.5">
                              {item.description}
                            </p>
                          </div>
                        </div>

                        <div className="flex justify-between items-center mt-2 pt-2 border-t border-white/5 shrink-0">
                          {/* Cost / Status */}
                          <div className="text-[10px]">
                            {isPerm ? (
                              unlocked ? (
                                <span className="text-purple-400 font-bold">Owned Gear</span>
                              ) : (
                                <span className="text-amber-400 font-black">Cost: {item.cost} 🪙</span>
                              )
                            ) : (
                              <span className="text-cyan-400 font-black">Cost: {item.cost} 🪙</span>
                            )}
                          </div>

                          {/* Control Button */}
                          <div className="flex items-center gap-1.5">
                            {isPerm ? (
                              <button
                                onClick={() => handleTogglePermanent(item)}
                                className={`px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-wider cursor-pointer transition ${
                                  active 
                                    ? 'bg-purple-500 text-black font-black hover:bg-purple-400' 
                                    : unlocked 
                                      ? 'border border-white/15 text-white hover:bg-white/5'
                                      : coins >= item.cost
                                        ? 'bg-purple-950/40 border border-purple-500/40 text-purple-300 hover:bg-purple-500/20'
                                        : 'bg-white/5 border border-white/5 text-white/30 cursor-not-allowed'
                                }`}
                              >
                                {active ? 'Active' : unlocked ? 'Equip' : `Buy`}
                              </button>
                            ) : (
                              <div className="flex items-center bg-black/40 border border-white/8 rounded-xl overflow-hidden h-6">
                                <button
                                  onClick={() => handleRemoveConsumable(item)}
                                  disabled={qty === 0}
                                  className="w-6 h-full flex items-center justify-center font-bold text-xs hover:bg-white/5 disabled:opacity-20 cursor-pointer"
                                >
                                  −
                                </button>
                                <span className="w-5 text-center font-mono text-[10px] font-black">{qty}</span>
                                <button
                                  onClick={() => handleAddConsumable(item)}
                                  disabled={qty >= 2}
                                  className="w-6 h-full flex items-center justify-center font-bold text-xs hover:bg-white/5 disabled:opacity-20 cursor-pointer"
                                >
                                  +
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Checkout */}
        <div className="px-8 py-5 border-t border-white/10 flex items-center justify-between shrink-0 bg-black/50">
          <div>
            {totalCost > 0 ? (
              <p className="text-xs text-white/50">
                Total Prepared Cost: <span className="text-amber-300 font-brand font-black text-sm">{totalCost} 🪙</span>
              </p>
            ) : (
              <p className="text-xs text-white/40">Select consumables above to carry into the shift.</p>
            )}
          </div>
          <div className="flex gap-4">
            <button 
              onClick={onBack}
              className="py-2.5 px-6 rounded-2xl border border-white/10 text-white/60 hover:bg-white/5 transition text-xs font-bold uppercase tracking-wider cursor-pointer"
            >
              ← Back
            </button>
            <button
              onClick={handleStart}
              disabled={!canAfford}
              className={`py-2.5 px-8 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
                canAfford 
                  ? 'cursor-pointer hover:scale-[1.02] active:scale-[0.98]' 
                  : 'opacity-40 cursor-not-allowed'
              }`}
              style={{
                background: canAfford ? 'linear-gradient(135deg, #a855f7, #7c3aed)' : 'rgba(255,255,255,0.05)',
                boxShadow: canAfford ? '0 4px 20px rgba(124,58,237,0.35)' : 'none',
                color: '#fff'
              }}
            >
              {totalCost > 0 ? `Pay & Rent Gear — ${totalCost} 🪙` : 'Start Shift'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
