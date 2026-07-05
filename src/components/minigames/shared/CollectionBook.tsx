// CollectionBook.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Reusable Scrapbook-style Album displaying unlocked/locked items.
// Displays locked items as mysterious silhouettes and unlocked items with lore.
// ─────────────────────────────────────────────────────────────────────────────
import React, { useState } from 'react';
import { FONT } from '../../../lib/uiConstants';

export interface CollectionItem {
  id: string;
  name: string;
  icon: string;
  description: string;
  category: string;
  rarity: 'common' | 'rare' | 'legendary';
  story?: string;
  rankRequired?: string;
}

interface CollectionBookProps {
  title: string;
  unlockedItemIds: string[]; // List of already discovered item IDs
  itemsPool: CollectionItem[]; // Complete catalog of all collectibles
  themeColor: string; // Tailwind class color, e.g. "purple", "amber", "cyan"
  onClose: () => void;
}

export const CollectionBook: React.FC<CollectionBookProps> = ({
  title,
  unlockedItemIds,
  itemsPool,
  themeColor,
  onClose,
}) => {
  const [selectedItem, setSelectedItem] = useState<CollectionItem | null>(null);
  if (false as boolean) { console.log(themeColor); }

  const unlockedCount = itemsPool.filter(x => unlockedItemIds.includes(x.id)).length;
  const totalCount = itemsPool.length;
  const completionPct = totalCount > 0 ? (unlockedCount / totalCount) * 100 : 0;

  const rarityColor = (r: CollectionItem['rarity']) => {
    return {
      common: 'text-white/60 bg-white/5 border-white/10',
      rare: 'text-cyan-300 bg-cyan-950/20 border-cyan-500/30',
      legendary: 'text-amber-400 bg-amber-950/30 border-amber-500/40 animate-pulse',
    }[r];
  };

  const getRarityBadge = (r: CollectionItem['rarity']) => {
    return {
      common: 'COMMON',
      rare: 'RARE',
      legendary: 'LEGENDARY',
    }[r];
  };

  return (
    <div className="absolute inset-0 z-[420] flex items-center justify-center p-4 bg-black/70">
      <div 
        className="relative flex flex-col overflow-hidden animate-fade-in w-[920px] max-w-[95vw] h-[85vh] max-h-[85vh] text-white"
        style={{ 
          borderRadius: '2.5rem', 
          border: '1px solid rgba(255,255,255,0.15)', 
          background: 'rgba(12, 10, 15, 0.97)',
          boxShadow: '0 25px 60px rgba(0,0,0,0.9)' 
        }}
      >
        {/* Book Header */}
        <div className="px-8 pt-6 pb-4 border-b border-white/10 flex items-center justify-between shrink-0 bg-black/35">
          <div>
            <span className="text-[9px] uppercase tracking-[0.35em] text-amber-400 font-brand">
              Mossberry Logbook
            </span>
            <h2 className="text-2xl font-black uppercase mt-0.5 tracking-tight" style={{ fontFamily: FONT }}>
              📖 {title}
            </h2>
          </div>
          <div className="text-right flex items-center gap-4">
            <div>
              <p className="text-[10px] text-white/45">Discovered Items</p>
              <p className="text-base font-bold font-mono">
                {unlockedCount} / {totalCount} ({Math.round(completionPct)}%)
              </p>
            </div>
            {/* Completion Mini Progress Bar */}
            <div className="w-24 h-2.5 bg-white/5 border border-white/10 rounded-full overflow-hidden hidden sm:block">
              <div 
                className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full transition-all duration-500" 
                style={{ width: `${completionPct}%` }}
              />
            </div>
          </div>
        </div>

        {/* Book Body split in 2 columns: List vs Detail */}
        <div className="flex-grow flex min-h-0 overflow-hidden">
          
          {/* Left Column: Grid Album (60%) */}
          <div className="w-[60%] h-full overflow-y-auto p-6 border-r border-white/10 custom-scrollbar grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 content-start">
            {itemsPool.map(item => {
              const unlocked = unlockedItemIds.includes(item.id);
              const isSelected = selectedItem?.id === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => unlocked && setSelectedItem(item)}
                  disabled={!unlocked}
                  className={`aspect-square rounded-2xl border transition-all flex flex-col items-center justify-center p-2 relative select-none ${
                    unlocked 
                      ? isSelected
                        ? 'bg-amber-500/10 border-amber-400/80 scale-[1.04] shadow-[0_0_12px_rgba(251,191,36,0.15)]'
                        : 'bg-white/4 border-white/8 hover:bg-white/8 hover:border-white/20 cursor-pointer active:scale-95'
                      : 'bg-black/45 border-white/5 opacity-35 cursor-not-allowed'
                  }`}
                >
                  {/* Lock Indicator */}
                  {!unlocked && (
                    <span className="absolute top-1 right-1.5 text-[8px] opacity-40">🔒</span>
                  )}
                  
                  {/* Icon */}
                  <span className={`text-3xl filter ${unlocked ? 'drop-shadow-lg' : 'brightness-0 contrast-50'}`}>
                    {unlocked ? item.icon : '❓'}
                  </span>

                  {/* Name label */}
                  <p className="text-[9px] font-bold text-center truncate w-full mt-1.5 opacity-80">
                    {unlocked ? item.name : 'Unknown'}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Right Column: Detailed Card (40%) */}
          <div className="w-[40%] h-full p-6 flex flex-col justify-between overflow-y-auto custom-scrollbar bg-black/15">
            {selectedItem ? (
              <div className="space-y-4 animate-fade-in flex-grow flex flex-col justify-between">
                <div className="space-y-4">
                  {/* Item Presentation */}
                  <div className="text-center space-y-2 pb-4 border-b border-white/5">
                    <span className="text-6xl filter drop-shadow-xl block animate-bounce-slow">
                      {selectedItem.icon}
                    </span>
                    <h3 className="text-lg font-black text-white font-brand" style={{ fontFamily: FONT }}>
                      {selectedItem.name}
                    </h3>
                    <div className="flex justify-center">
                      <span className={`px-2 py-0.5 rounded-lg border text-[8px] font-black tracking-widest ${rarityColor(selectedItem.rarity)}`}>
                        {getRarityBadge(selectedItem.rarity)}
                      </span>
                    </div>
                  </div>

                  {/* Descriptions */}
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-[9px] font-black uppercase text-white/30 tracking-wider">Item Details</h4>
                      <p className="text-xs text-white/85 leading-normal mt-0.5">{selectedItem.description}</p>
                    </div>
                    {selectedItem.story && (
                      <div className="p-3 bg-white/3 border border-white/5 rounded-xl italic font-serif">
                        <h4 className="text-[9px] font-black uppercase text-white/30 tracking-wider not-italic mb-1">Local Lore</h4>
                        <p className="text-[11px] text-white/60 leading-relaxed">"{selectedItem.story}"</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-[10px] text-white/35 mt-6 border-t border-white/5 pt-3">
                  Category: <span className="text-white/60 font-bold capitalize">{selectedItem.category}</span>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-center opacity-30 p-4">
                <div className="space-y-2">
                  <span className="text-4xl block">🔍</span>
                  <p className="text-xs italic leading-relaxed" style={{ fontFamily: 'Georgia, serif' }}>
                    Select any unlocked item from your logbook album on the left to read its description and local lore.
                  </p>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Footer actions */}
        <div className="px-8 py-5 border-t border-white/10 flex justify-end shrink-0 bg-black/35">
          <button 
            onClick={onClose}
            className="py-2.5 px-8 rounded-2xl border border-white/10 text-white/70 hover:bg-white/5 transition text-xs font-bold uppercase tracking-wider cursor-pointer"
          >
            Close Album
          </button>
        </div>
      </div>
    </div>
  );
};
