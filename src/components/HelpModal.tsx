import React, { useState } from 'react';
import { useTTStore } from '../store/useTTStore';

const FONT = '"Luckiest Guy", cursive';

export const HelpModal: React.FC = () => {
  const { setShowHelpModal } = useTTStore();
  const [activeTab, setActiveTab] = useState<'guide' | 'architecture'>('guide');

  return (
    <div className="w-[85vw] h-[85vh] flex flex-col md:flex-row overflow-hidden bg-neutral-950/95 border border-amber-500/30 rounded-[2.5rem] shadow-2xl relative text-left select-none animate-fade-in text-white">
      
      {/* Left Column Graphic - Strict 3:2 aspect container on split layout */}
      <div className="w-full md:w-[35%] shrink-0 h-48 md:h-full relative overflow-hidden border-b md:border-b-0 md:border-r border-white/10 bg-neutral-900 flex items-center justify-center">
        <div className="w-full aspect-[3/2] relative">
          <img
            src="/Assets/WelcomeShow/Theme1_TheStart.png"
            alt="Guide Banner"
            className="w-full h-full object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/towns/hometown_lvl1.png';
            }}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/80 via-black/20 to-transparent pointer-events-none" />
        <div className="absolute inset-0 flex flex-col justify-end p-6">
          <span className="text-white font-brand text-sm tracking-wider uppercase" style={{ fontFamily: '"Josefin Sans", sans-serif' }}>
            County Registry Office
          </span>
          <span className="text-amber-400 text-[10px] font-black uppercase tracking-widest mt-0.5 animate-pulse">
            Information & Tech Desk
          </span>
        </div>
      </div>

      {/* Right Column Content */}
      <div className="flex-1 p-8 flex flex-col justify-between h-full min-w-0 bg-[#0a0a0c]">
        
        {/* Modal Header */}
        <div className="shrink-0 pb-3 border-b border-white/10 flex justify-between items-start">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-400">Resident Guide Board</span>
            <h2 className="text-2xl font-brand text-white uppercase mt-0.5" style={{ fontFamily: FONT }}>
              Guide & Architecture
            </h2>
          </div>
          <button
            onClick={() => setShowHelpModal(false)}
            className="w-8 h-8 hover:scale-110 active:scale-95 transition-all flex items-center justify-center bg-white/5 rounded-full border border-white/10 text-white font-bold"
          >
            ✕
          </button>
        </div>

        {/* 3-Line Summary Guide */}
        <div className="mt-3 p-3 bg-white/5 border border-white/10 rounded-2xl shrink-0 font-sans">
          <p className="text-[11.5px] text-amber-200 leading-relaxed">
            1. Learn details of the Toffee Towns modules and available activities.<br />
            2. Review technical architecture layers, state slices, and database schemas.<br />
            3. Master county lore navigation and complete daily chores efficiently.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mt-4 shrink-0">
          <button
            onClick={() => setActiveTab('guide')}
            className={`flex-1 py-2 text-[10px] font-black uppercase rounded-xl transition ${
              activeTab === 'guide'
                ? 'bg-amber-500 text-black'
                : 'bg-white/5 text-white/70 hover:bg-white/10'
            }`}
            style={{ fontFamily: '"Josefin Sans", sans-serif' }}
          >
            📖 Resident Guide
          </button>
          <button
            onClick={() => setActiveTab('architecture')}
            className={`flex-1 py-2 text-[10px] font-black uppercase rounded-xl transition ${
              activeTab === 'architecture'
                ? 'bg-amber-500 text-black'
                : 'bg-white/5 text-white/70 hover:bg-white/10'
            }`}
            style={{ fontFamily: '"Josefin Sans", sans-serif' }}
          >
            ⚙️ System Architecture
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto custom-scrollbar my-4 pr-1 text-neutral-300 font-sans text-xs space-y-4">
          
          {activeTab === 'guide' ? (
            <div className="space-y-4 leading-relaxed">
              <div>
                <h4 className="font-bold text-white text-sm">🏡 The Resident Desk</h4>
                <p className="mt-1">
                  Your primary operations hub. Here you monitor your active chores, view your passenger envelope mailbox, manage your leveling progress, and initiate relocation files.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-white text-sm">🎨 Town Map & Places</h4>
                <p className="mt-1">
                  Explore major local landmarks such as Mossberry Wharf, Gossip Corner, and the Geothermal Springs. Funding these landmarks triggers transit time and awards XP.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-white text-sm">🛠️ Workshop & Crafting</h4>
                <p className="mt-1">
                  Exchange your coins for construction materials (wood, bolts, and parchment). Use these resources to craft tools or repair broken sectors in the county.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-white text-sm">🗞️ Gazette Newspaper & Ballot</h4>
                <p className="mt-1">
                  Read up on daily briefings, vote on municipal ballots, and check live weather forecasts that impact travel durations.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-amber-400 text-sm">👑 Golden Citizen Pass & Premium Monetization</h4>
                <p className="mt-1">
                  Upgrade your membership or acquire real money assets at the Treasury (Coins Page) to support the county:
                </p>
                <ul className="list-disc pl-5 mt-1 space-y-1 text-neutral-400">
                  <li>
                    <strong className="text-white">Golden Citizen Pass (₹199/Month)</strong>: Grants 1.5x Skill XP multipliers, daily claims of 15 Gems, free Theater tickets, automatic unlocks for Early Access stories, 150 warehouse slots (instead of 50), a luxury private monorail cabin (6x speed), and the exclusive Golden Caramel Gala festival.
                  </li>
                  <li>
                    <strong className="text-white">Premium Land Deeds & Licenses (₹99 One-Time each)</strong>: Purchase the Lakeside Manor Estate deed or the Cozy Cocoa Brewery License. The Brewery permits you to run brewing cycles, naming and blending custom bases + infusions to claim high coin rewards.
                  </li>
                  <li>
                    <strong className="text-white">Progression Integrity</strong>: Gems (hard currency) are strictly for cosmetic, ticket, and story bypasses. Gems <span className="text-rose-400 font-bold">cannot</span> buy XP, level promotions, or workshop resources. All progression remains strictly earned.
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-emerald-400 text-sm">🎪 Town Classifieds & Festivals (Gazette Page 5)</h4>
                <p className="mt-1">
                  Participate in daily engagement loops at the town bulletin board:
                </p>
                <ul className="list-disc pl-5 mt-1 space-y-1 text-neutral-400">
                  <li>
                    <strong className="text-white">Daily Dispatch Raffle</strong>: Buy raffle tickets using soft coins (10 Coins) and draw to win up to 30 Gems, 200 Coins, or building materials.
                  </li>
                  <li>
                    <strong className="text-white">The Great Molasses Cook-off</strong>: Mix chocolate bases and flavor infusions, assign a custom recipe name, and submit for +10 Coins.
                  </li>
                  <li>
                    <strong className="text-white">Gossip Submission</strong>: Send anonymous rumors and messages directly to the next morning's printed issue.
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="space-y-4 leading-relaxed font-mono text-[11px]">
              <div>
                <h4 className="font-bold text-white text-sm font-sans">🧬 State Architecture (Zustand Slices)</h4>
                <p className="mt-1">
                  The application utilizes a single consolidated global store split into modular state slices:
                </p>
                <ul className="list-disc pl-5 mt-1 space-y-1 text-neutral-400">
                  <li><strong className="text-white">authSlice</strong>: Manages anonymous user logins, display names, and Firestore synchronization.</li>
                  <li><strong className="text-white">economySlice</strong>: Handles coffer balances, shop transactions, and payment logs.</li>
                  <li><strong className="text-white">progressionSlice</strong>: Controls local passport stamps, active town selections, and leveling XP thresholds.</li>
                  <li><strong className="text-white">taskQueueSlice</strong>: Manages a background queue that processes travel and work ticks every second.</li>
                  <li><strong className="text-white">encounterSlice</strong>: Determines when random highway events trigger during travel tasks.</li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-white text-sm font-sans">⏱️ Real-Time Queue Engine</h4>
                <p className="mt-1 text-neutral-400">
                  A global 1-second `setInterval` hook inside the root workspace component runs `resolveQueue()` and `checkEncounter()` to tick down pending tasks, add coins/XP rewards, and execute visual alerts dynamically.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-white text-sm font-sans">🎲 Deterministic Daily Seed Engine</h4>
                <p className="mt-1 text-neutral-400">
                  Daily campaigns and faction ballots are seeded using the player’s user UID and the current ISO date. This guarantees that every traveler experiences a unified, repeatable set of events each day.
                </p>
              </div>
            </div>
          )}

        </div>

        <div className="text-[10px] text-white/40 text-center font-sans border-t border-white/5 pt-3 shrink-0">
          Toffee Towns Interactive · TINBLINK STUDIOS · Built with React + Zustand
        </div>
      </div>
    </div>
  );
};
