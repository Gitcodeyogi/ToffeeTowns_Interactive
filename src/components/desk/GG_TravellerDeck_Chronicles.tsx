import React, { useState } from 'react';
import { useTTStore } from '../../store/useTTStore';
import { GG_TravellerDeck_Header } from './GG_TravellerDeck_Header';
import { type SubPage } from '../../lib/uiConstants';

interface GG_TravellerDeck_ChroniclesProps {
  setSubPage: (page: SubPage) => void;
  popPage: () => void;
  inventory: Record<string, number>;
  setInventory: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  triggerFeedback: (msg: string) => void;
}

interface ChronicleSegment {
  id: string;
  title: string;
  emoji: string;
  description: string;
}

const CHRONICLES_DATA: Record<string, { title: string; subtitle: string; segments: ChronicleSegment[] }> = {
  'ganache-grove': {
    title: 'The Great Glaze Famine',
    subtitle: 'Reliving the recovery of Mossberry River’s dark chocolate reservoirs.',
    segments: [
      { id: 'ganache-grove-1', title: 'The Empty Vats', emoji: '🍯', description: 'The reserve tanks of pure liquid dark chocolate ran dry under Mossberry Bridge, bringing production to a halt.' },
      { id: 'ganache-grove-2', title: 'The Sprout of Hope', emoji: '🌱', description: 'A rare sugar-crystal sprout was found in the deep roots of the Elder Tree, signaling the return of the flow.' },
      { id: 'ganache-grove-3', title: 'The Great Feast', emoji: '🎪', description: 'The town celebrated the return of the sweet, rich flows of dark chocolate with the first annual Honeyberry Feast.' }
    ]
  },
  'toffee-town': {
    title: 'The Great Caramel Sprout',
    subtitle: 'Reliving the founding of the Hazelnut Highland caramel fountains.',
    segments: [
      { id: 'toffee-town-1', title: 'Amber Seedlings', emoji: '🌰', description: 'The legendary amber seed was first sown on the steep Hazelnut Highlands by the early settlers.' },
      { id: 'toffee-town-2', title: 'The Sticky Fountain', emoji: '⛲', description: 'A high-pressure geyser of warm liquid caramel erupted in the center of the terrace, creating a natural trade hub.' },
      { id: 'toffee-town-3', title: 'The Toffee Spindle', emoji: '🗿', description: 'Citizens carved a giant decorative monument out of hardened sugar glass to celebrate their rich caramel harvests.' }
    ]
  },
  'eclair-square': {
    title: 'The Honeywood Tide',
    subtitle: 'Reliving the maritime adventures of the Caramel Cove flotilla.',
    segments: [
      { id: 'eclair-square-1', title: 'Golden Estuary', emoji: '🌊', description: 'Where the sweet honey rivers of the interior meet the salty waves on the sandy beaches of the Cove.' },
      { id: 'eclair-square-2', title: 'Eclair Flotilla', emoji: '⛵', description: 'Residents built a fleet of pastry boats to rescue floating sugar crates lost during a cargo storm.' },
      { id: 'eclair-square-3', title: 'Lighthouse Glaze', emoji: '🚨', description: 'The historic lighthouse beacon was refitted with a giant glowing sugar crystal, visible for twenty nautical miles.' }
    ]
  },
  'peppermint-peak': {
    title: 'The Frosty Avalanche',
    subtitle: 'Reliving the survival of Peppermint Peaks during the Mint Blizzard.',
    segments: [
      { id: 'peppermint-peak-1', title: 'The Mint Blizzard', emoji: '❄️', description: 'A cooling blizzard of powdered sugar covered the peaks, freezing the trade routes for three weeks.' },
      { id: 'peppermint-peak-2', title: 'The Crystalline Caves', emoji: '💎', description: 'Daring explorers discovered deep caves filled with glowing blue mint stones, providing warmth and fuel.' },
      { id: 'peppermint-peak-3', title: 'The Mint Sled Race', emoji: '🛷', description: 'The annual celebration of sliding down the icy mint slopes in hollow wafer sleds to celebrate the trade reopening.' }
    ]
  }
};

const TOWN_GALLERY_PROJECTS: Record<string, { title: string; desc: string; targetWood: number; targetBolts: number; rewardDesc: string }> = {
  'ganache-grove': {
    title: 'Rebuild the Mossway Canopy Bridges',
    desc: 'The elevated moss bridges are sagging. Donate timber and bolts to secure them for travelers.',
    targetWood: 15,
    targetBolts: 10,
    rewardDesc: 'Speeds up travel times through Ganache Grove by +10%.'
  },
  'toffee-town': {
    title: 'Reinforce the Terrace Retaining Wall',
    desc: 'The caramel flow is pressing against the Hazelnut slopes. Reinforce the structural barriers.',
    targetWood: 20,
    targetBolts: 12,
    rewardDesc: 'Unlocks a +5% discount on all Toffee Town real estate upgrades.'
  },
  'eclair-square': {
    title: 'Glaze the Caramel Cove Wave Barrier',
    desc: 'Sticky surf tides are eroding the beach front docks. Help rebuild the protective breakwaters.',
    targetWood: 18,
    targetBolts: 8,
    rewardDesc: 'Increases the value of goods sold at the Caramel Cove market by +10%.'
  },
  'peppermint-peak': {
    title: 'Clear the Peppermint Avalanche Pass',
    desc: 'A sugar slide has blocked the Glacial sector pass. Provide timber for retaining struts and bolts.',
    targetWood: 15,
    targetBolts: 15,
    rewardDesc: 'Increases the chance of finding rare items during chores by +15%.'
  }
};

export const GG_TravellerDeck_Chronicles: React.FC<GG_TravellerDeck_ChroniclesProps> = ({
  setSubPage,
  popPage,
  inventory,
  setInventory,
  triggerFeedback
}) => {
  const {
    homeTown,
    unlockedFragments,
    donatedResources,
    donateResource,
    travellerName
  } = useTTStore();

  const [activeTab, setActiveTab] = useState<'chronicles' | 'townhall'>('chronicles');
  const [selectedTown, setSelectedTown] = useState<string>(homeTown || 'ganache-grove');

  const activeProject = TOWN_GALLERY_PROJECTS[homeTown || 'ganache-grove'] || TOWN_GALLERY_PROJECTS['ganache-grove'];
  const donatedWood = donatedResources['wood'] || 0;
  const donatedBolts = donatedResources['bolts'] || 0;
  
  const isProjectCompleted = donatedWood >= activeProject.targetWood && donatedBolts >= activeProject.targetBolts;

  const handleDonate = (resourceType: 'wood' | 'bolts') => {
    const currentQty = inventory[resourceType] || 0;
    if (currentQty < 1) {
      triggerFeedback(`❌ You do not have any ${resourceType} in your inventory!`);
      return;
    }

    // Deduct from inventory
    setInventory(prev => {
      const next = { ...prev, [resourceType]: currentQty - 1 };
      localStorage.setItem('tt_inventory', JSON.stringify(next));
      return next;
    });

    // Register donation in store (awards coins/legacy)
    donateResource(resourceType, 1);
    triggerFeedback(`📦 Donated 1 ${resourceType.toUpperCase()}! Gained +10 Coins & +5 Legacy Standing.`);
  };

  const getTownDisplayName = (id: string) => {
    return id.replace('-', ' ').replace(/\b\w/g, c => c.toUpperCase());
  };

  return (
    <div className="w-full h-full flex flex-col justify-between">
      <GG_TravellerDeck_Header
        title="TOWN CHRONICLES & HALL"
        setSubPage={setSubPage}
        popPage={popPage}
      />

      {/* Tabs */}
      <div className="flex gap-2 mb-3 shrink-0">
        <button
          onClick={() => setActiveTab('chronicles')}
          className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase transition ${
            activeTab === 'chronicles' ? 'bg-amber-500 text-black font-black' : 'bg-white/5 text-white hover:bg-white/10'
          }`}
          style={{ fontFamily: '"Josefin Sans", sans-serif' }}
        >
          📖 Chronicle Book
        </button>
        <button
          onClick={() => setActiveTab('townhall')}
          className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase transition ${
            activeTab === 'townhall' ? 'bg-amber-500 text-black font-black' : 'bg-white/5 text-white hover:bg-white/10'
          }`}
          style={{ fontFamily: '"Josefin Sans", sans-serif' }}
        >
          🏛️ Town Hall Gallery
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 border border-white/10 bg-black/25 rounded-[2rem] p-6 overflow-y-auto custom-scrollbar my-2 min-h-0">
        
        {activeTab === 'chronicles' && (
          <div className="space-y-6">
            
            {/* Town Selector Sub-tabs */}
            <div className="flex gap-1.5 border-b border-white/5 pb-3">
              {Object.keys(CHRONICLES_DATA).map(townId => (
                <button
                  key={townId}
                  onClick={() => setSelectedTown(townId)}
                  className={`px-3 py-1 rounded-xl text-[10px] font-bold uppercase transition ${
                    selectedTown === townId ? 'bg-amber-500/20 text-amber-300 border border-amber-500/35' : 'text-white/50 hover:text-white/80'
                  }`}
                  style={{ fontFamily: '"Josefin Sans", sans-serif' }}
                >
                  {getTownDisplayName(townId)}
                </button>
              ))}
            </div>

            {/* Story Title Banner */}
            <div>
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-yellow-400">
                County Living Encyclopedia
              </span>
              <h3 className="text-lg font-bold text-white font-brand mt-0.5">
                {CHRONICLES_DATA[selectedTown].title}
              </h3>
              <p className="text-xs text-white/50 leading-relaxed font-sans mt-1">
                {CHRONICLES_DATA[selectedTown].subtitle}
              </p>
            </div>

            {/* Chronicles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {CHRONICLES_DATA[selectedTown].segments.map((segment, idx) => {
                const isUnlocked = unlockedFragments.includes(segment.id);
                
                // Color cards based on selected town theme
                let cardStyle: string;
                if (selectedTown === 'toffee-town') {
                  cardStyle = "from-amber-950/60 via-amber-900/30 to-stone-900 border-amber-500/30";
                } else if (selectedTown === 'eclair-square') {
                  cardStyle = "from-purple-950/60 via-indigo-900/30 to-stone-900 border-indigo-500/30";
                } else if (selectedTown === 'peppermint-peak') {
                  cardStyle = "from-cyan-950/60 via-blue-900/30 to-stone-900 border-cyan-500/30";
                } else {
                  cardStyle = "from-emerald-950/60 via-emerald-900/30 to-stone-900 border-emerald-500/30";
                }

                if (!isUnlocked) {
                  return (
                    <div 
                      key={segment.id} 
                      className="p-5 bg-neutral-900/80 border border-white/5 rounded-3xl flex flex-col items-center justify-center text-center gap-3 relative min-h-[180px] shadow-lg grayscale select-none"
                    >
                      <span className="text-3xl text-neutral-600 blur-[1px]">🔒</span>
                      <div className="space-y-1">
                        <h4 className="text-white/30 text-xs uppercase tracking-wider font-bold">Segment {idx + 1} Locked</h4>
                        <p className="text-[10px] text-white/20 font-sans">Complete chores or crafting to find this Memory Fragment.</p>
                      </div>
                    </div>
                  );
                }

                return (
                  <div 
                    key={segment.id} 
                    className={`p-5 bg-gradient-to-br ${cardStyle} border rounded-3xl flex flex-col justify-between gap-4 text-xs shadow-lg animate-fade-in hover:scale-[1.02] transition-all duration-300 relative group`}
                  >
                    <div className="absolute top-0 right-0 w-12 h-12 bg-white/5 rounded-full blur-xl pointer-events-none group-hover:bg-white/10" />
                    <div>
                      <div className="flex justify-between items-center border-b border-white/5 pb-2 mb-2">
                        <span className="text-[8.5px] uppercase tracking-wider text-yellow-400 font-bold">Segment {idx + 1} Unlocked</span>
                        <span className="text-lg">{segment.emoji}</span>
                      </div>
                      <h4 className="font-brand text-white text-sm font-bold tracking-tight">{segment.title}</h4>
                      <p className="text-white/60 mt-2 leading-relaxed font-sans">{segment.description}</p>
                    </div>
                    <div className="text-[9.5px] text-emerald-400 font-semibold flex items-center gap-1 mt-1">
                      <span>✓</span> Recorded in Chronicles
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'townhall' && (
          <div className="space-y-6">
            <div>
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-pink-400">
                Cooperative Community Project
              </span>
              <h3 className="text-lg font-bold text-white font-brand mt-0.5">
                {activeProject.title}
              </h3>
              <p className="text-xs text-white/60 leading-relaxed font-sans mt-1">
                {activeProject.desc}
              </p>
            </div>

            {/* Donation Status / Progress Bars */}
            <div className="space-y-5 bg-white/5 border border-white/10 rounded-3xl p-5 shadow-inner">
              
              {/* Resource 1: Wood */}
              <div>
                <div className="flex justify-between items-center text-xs font-semibold text-white/80 mb-1.5 font-brand">
                  <span className="flex items-center gap-1">🪵 Wood Donated</span>
                  <span className="font-mono text-cyan-300">{donatedWood} / {activeProject.targetWood}</span>
                </div>
                <div className="w-full h-3 bg-black/60 rounded-full overflow-hidden border border-white/5 relative">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500" 
                    style={{ width: `${Math.min(100, (donatedWood / activeProject.targetWood) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Resource 2: Bolts */}
              <div>
                <div className="flex justify-between items-center text-xs font-semibold text-white/80 mb-1.5 font-brand">
                  <span className="flex items-center gap-1">🔩 Bolts Donated</span>
                  <span className="font-mono text-cyan-300">{donatedBolts} / {activeProject.targetBolts}</span>
                </div>
                <div className="w-full h-3 bg-black/60 rounded-full overflow-hidden border border-white/5 relative">
                  <div 
                    className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-500" 
                    style={{ width: `${Math.min(100, (donatedBolts / activeProject.targetBolts) * 100)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Donation Controls or Completion Banner */}
            {isProjectCompleted ? (
              <div className="p-5 bg-gradient-to-br from-emerald-950/80 via-emerald-900/40 to-stone-900 border border-emerald-500/45 rounded-3xl flex flex-col items-center text-center gap-3 shadow-glow animate-fade-in">
                <span className="text-4xl animate-bounce">🎉</span>
                <div>
                  <h4 className="text-base font-bold text-yellow-300 font-brand">Project Fully Completed!</h4>
                  <p className="text-xs text-white/70 mt-1 leading-relaxed max-w-md font-sans">
                    Thanks to your generous contributions, the Town Square has erected a brass founding plague honoring <span className="text-white font-bold">{travellerName}</span>.
                  </p>
                  <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-[11px] text-emerald-300 font-semibold font-brand">
                    Active Hometown Benefit: {activeProject.rewardDesc}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col md:flex-row gap-4">
                
                {/* Donate Wood Card */}
                <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col justify-between gap-3 text-xs">
                  <div>
                    <h4 className="font-brand text-white font-bold flex items-center gap-1">🪵 Contribute Wood</h4>
                    <p className="text-white/50 text-[10px] mt-0.5">Inventory available: {inventory.wood || 0} Wood</p>
                  </div>
                  <button 
                    disabled={(inventory.wood || 0) < 1 || donatedWood >= activeProject.targetWood}
                    onClick={() => handleDonate('wood')}
                    className="w-full py-2 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 disabled:from-neutral-800 disabled:to-neutral-800 disabled:text-white/30 text-white font-brand text-[10px] uppercase tracking-wider rounded-xl transition"
                    style={{ fontFamily: '"Josefin Sans", sans-serif' }}
                  >
                    {donatedWood >= activeProject.targetWood ? 'target met ✓' : 'Donate 1 Wood'}
                  </button>
                </div>

                {/* Donate Bolts Card */}
                <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col justify-between gap-3 text-xs">
                  <div>
                    <h4 className="font-brand text-white font-bold flex items-center gap-1">🔩 Contribute Bolts</h4>
                    <p className="text-white/50 text-[10px] mt-0.5">Inventory available: {inventory.bolts || 0} Bolts</p>
                  </div>
                  <button 
                    disabled={(inventory.bolts || 0) < 1 || donatedBolts >= activeProject.targetBolts}
                    onClick={() => handleDonate('bolts')}
                    className="w-full py-2 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 disabled:from-neutral-800 disabled:to-neutral-800 disabled:text-white/30 text-white font-brand text-[10px] uppercase tracking-wider rounded-xl transition"
                    style={{ fontFamily: '"Josefin Sans", sans-serif' }}
                  >
                    {donatedBolts >= activeProject.targetBolts ? 'target met ✓' : 'Donate 1 Bolt'}
                  </button>
                </div>

              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
