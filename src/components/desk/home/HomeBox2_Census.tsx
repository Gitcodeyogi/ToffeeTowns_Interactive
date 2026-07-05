import React from 'react';
import { FONT } from '../../../lib/uiConstants';

interface Character {
  id: string;
  name: string;
  clan: string;
  role: string;
  description: string;
  image: string;
  age?: string;
  specialty?: string;
  favoriteProp?: string;
  stats: Record<string, number>;
  loreSections: { title: string; content: string }[];
  gender?: 'Boy' | 'Girl';
}

interface HomeBox2_CensusProps {
  characters: Character[];
  activeIndex: number;
  setActiveIndex: (idx: number) => void;
  charTab: 'registry' | 'lore';
  setCharTab: (tab: 'registry' | 'lore') => void;
  setPage: (page: any) => void;
  skills: Record<string, number>;
  legacyPoints: number;
  getProvincialStanding: (pts: number) => string;
}

const HomeBox2_Census: React.FC<HomeBox2_CensusProps> = ({
  characters,
  activeIndex,
  setActiveIndex,
  charTab,
  setCharTab,
  setPage,
  skills,
  legacyPoints,
  getProvincialStanding,
}) => {
  const char = characters[activeIndex];
  if (!char) return null;

  // Synced Character Lore Database
  const getCharacterDossier = (charId: string) => {
    const builderLvl = Math.floor((skills?.builder || 0) / 10) + 1;
    const explorerLvl = Math.floor((skills?.explorer || 0) / 10) + 1;
    const healerLvl = Math.floor((skills?.healer || 0) / 10) + 1;
    const standing = getProvincialStanding(legacyPoints);

    switch (charId) {
      case 'pipkin':
        return {
          quote: "I have a brilliant idea! It involves three pinecones, a rolled newspaper, and absolutely zero adult supervision!",
          activities: "Crafting pinecone launchers, sliding down monorail safety rails, and trying to feed caramel cows glowing berries.",
          record: "147 accidental incidents. High score in local hide-and-seek. Officially warned by the Town Council for 'excessive front-tuft wildness.'",
          sync: `Rowan Thistle whispers to you: 'Your builder skill (Level ${builderLvl}) is great, but don't let Pipkin borrow your hammer!'`
        };
      case 'rowan':
        return {
          quote: "Any problem in the county can be solved with a practical wood-and-mortar solution. We just need correct torque!",
          activities: "Sketching bridges at midnight, correcting citizens' wooden plank grains, and trying to build a dual-track monorail.",
          record: "Builder Apprentice of the Year. Zero structural failures recorded. Warning from Sir Goldwhistle: 'Monorails are too expensive; stop sketching them on public napkins.'",
          sync: `Rowan notes: 'At Builder Level ${builderLvl}, you have built enough bridges to understand the tension calculations! Keep it up!'`
        };
      case 'julie':
        return {
          quote: "I have a front-page scoop about Sir Goldwhistle's evening tea logs. Care to comment, traveler?",
          activities: "Chasing Pipkin with a high-speed news runner camera, collecting rumors at Gossip Corner, and writing the daily dispatches.",
          record: "Youngest Gazette Editor in county history. Once uncovered the 'Great Molasses Leak of 24'. Banned from Town Hall private archives for 'nosey behavior.'",
          sync: `Julie notes: 'Our demography logs record your current standing as a ${standing}. That makes you page-one material!'`
        };
      case 'cedric':
        return {
          quote: "A spore sneezle is just character-building! Apply moss ointment twice a day and drink warm bark tea.",
          activities: "Filtering glowing mushroom spores, brewing warm bark tea, and treating local green moss rashes.",
          record: "Certified Physician. Known for cured spore-sneezle cases (over 10,000). Council citation: 'For outstanding services in peppermint water sterilization.'",
          sync: `Dr. Cedric notes: 'Your Apothecary/Healer skill is currently Level ${healerLvl}. You are qualified to handle standard peppermint sterilizations!'`
        };
      case 'petalworth':
        return {
          quote: "I have some lovely yellow daisies today... and a message from the canopy scouts if you know the cipher.",
          activities: "Breeding bioluminescent sugar lilies in the night shadow zones, routing coded letters to canopy scouts, and arguing with tax auditors.",
          record: "Head Florist. Secret coord for the canopy protests. Fined 12 times for 'illegally decorative hats.'",
          sync: `Mrs. Petalworth whispers: 'Your Explorer skill (Level ${explorerLvl}) is perfect for finding hidden wild root paths!'`
        };
      case 'goldwhistle':
        return {
          quote: "Civic progress is not free, traveler! Every monorail ride and walkway plank is funded by strict civic dues.",
          activities: "Counting copper coins in the treasury, blowing his brass whistle at loiterers, and auditing Mrs. Petalworth's flower boxes.",
          record: "Senior Auditor & Treasurer. Identified 1,204 tax discrepancies. Winner of the 'Meticulous Ink Blot Award.' Warning: 'Extremely sensitive ears; do not blow whistles back at him.'",
          sync: `Sir Goldwhistle writes: 'Citizen Account Registry shows you have accumulated ${legacyPoints} legacy points. Dues compliance audit is satisfactory!'`
        };
      case 'olive':
        return {
          quote: "The forest canopy belongs to those who care for it, not the city council. The monorail is fine, but the paths are our home.",
          activities: "Climbing redwood trunks, guiding night foraging teams, and target practicing target boards.",
          record: "Ranger Captain. Splits falling leaves at fifty paces. 47 warnings from the Town Council for 'violating the after-dark forest curfews.'",
          sync: `Olive notes: 'With your Explorer level of ${explorerLvl}, you would make an excellent recruit for the canopy rangers. Join our night watch!'`
        };
      default:
        return {
          quote: "Welcome to Ganache Grove, traveller!",
          activities: "Enjoying the local cocoa products and helping builders keep paths safe.",
          record: "No infractions logged. Good standing citizens.",
          sync: `Citizens look forward to working with you, ${standing}!`
        };
    }
  };

  const dossier = getCharacterDossier(char.id);

  return (
    <div className="relative w-full shrink-0">
      {/* Solid backing layer */}
      <div className="absolute top-2 left-2 right-0 bottom-0 bg-purple-500/35 border-[3px] border-purple-500/40 rounded-3xl -z-10" />

      {/* Main container */}
      <div
        className="mr-2 mb-2 w-[calc(100%-8px)] lg:h-[500px] lg:max-h-[500px] lg:min-h-[500px] rounded-3xl overflow-hidden border-[3px] border-purple-500/40 bg-black/60 relative group z-10 flex flex-col lg:flex-row animate-fade-in"
      >

      {/* LEFT: Portrait (62%) */}
      <div className="w-full lg:w-[62%] lg:h-full lg:min-h-0 min-h-[380px] relative flex items-center justify-center border-b-[3px] lg:border-b-0 lg:border-r-[3px] border-purple-500/40 overflow-hidden bg-black">
        <img
          src={char.image}
          alt={char.name}
          className="w-full h-full object-cover z-10 transition-all duration-700 hover:scale-[1.03]"
          onError={(e) => { (e.target as HTMLImageElement).src = '/Assets/Ganache Grove/Scene_0.1.png'; }}
        />
        <div className="absolute inset-0 shadow-[inset_0_0_80px_rgba(0,0,0,0.5)] pointer-events-none z-20" />
        <div className="absolute bottom-4 left-4 right-4 z-30">
          <div className="bg-black/60 border border-purple-500/20 rounded-2xl px-4 py-2.5 flex items-center justify-between">
            <div>
              <span className="text-[9px] uppercase tracking-widest text-purple-300 font-black font-sans">{char.clan} Clan</span>
              <div className="text-sm font-brand text-white uppercase mt-0.5" style={{ fontFamily: FONT }}>{char.name}</div>
            </div>
            <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider font-sans">{char.role}{char.gender ? ` (${char.gender})` : ''}</span>
          </div>
        </div>
      </div>

      {/* RIGHT: Stats & Details panel (38%) */}
      <div className="w-full lg:w-[38%] lg:h-full lg:min-h-0 p-5 flex flex-col justify-between bg-transparent border-none">
        
        {/* Scrollable details content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 space-y-3 pb-2 min-h-0">
          {/* Header row */}
          <div className="flex justify-between items-start gap-2 pb-3 border-b border-white/5">
            <div>
              <p className="text-[8px] uppercase tracking-[0.25em] text-purple-300 font-sans font-black">Character Registry</p>
              <h4 className="text-base font-brand text-white uppercase leading-none mt-0.5" style={{ fontFamily: FONT }}>{char.name}</h4>
            </div>
            <button
              onClick={() => setPage('characters')}
              className="px-3 py-1.5 bg-gradient-to-r from-purple-500 to-indigo-600 hover:scale-105 active:scale-95 text-white text-[9px] font-black uppercase tracking-wider rounded-xl transition shadow-lg flex items-center gap-1 shrink-0"
              style={{ fontFamily: '"Josefin Sans", sans-serif' }}
            >
              <span>🎭</span> Directory
            </button>
          </div>

          {/* Quick Description */}
          <p className="text-[11px] text-white/70 leading-relaxed italic border-l-2 border-purple-500/40 pl-3">
            &ldquo;{char.description}&rdquo;
          </p>

          {/* Tab switch */}
          <div className="flex gap-2">
            <button
              onClick={() => setCharTab('registry')}
              className={`flex-1 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all duration-300 border ${charTab === 'registry' ? 'bg-cyan-400 text-black border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.3)] font-black' : 'bg-black/50 text-white/40 border-white/10 hover:bg-white/5'}`}
            >
              Overview
            </button>
            <button
              onClick={() => setCharTab('lore')}
              className={`flex-1 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all duration-300 border ${charTab === 'lore' ? 'bg-purple-500 text-white border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.3)] font-black' : 'bg-black/50 text-white/40 border-white/10 hover:bg-white/5'}`}
            >
              Deep Lore
            </button>
          </div>

          {/* Tab content */}
          {charTab === 'registry' ? (
            <div className="space-y-3 animate-fade-in">
              {/* Stats list */}
              <div className="rounded-[1.2rem] border-2 border-purple-500/30 bg-transparent p-3 space-y-2 text-xs">
                {[
                  { label: 'Gender', value: char.gender || 'Unknown', color: 'text-purple-300' },
                  { label: 'Age', value: char.age || 'Unknown', color: 'text-cyan-300' },
                  { label: 'Specialty', value: char.specialty || 'None', color: 'text-amber-300' },
                  { label: 'Favorite Prop', value: char.favoriteProp || 'None', color: 'text-pink-300' },
                ].map(row => (
                  <div key={row.label} className="flex items-center justify-between border-b border-white/5 pb-1.5 last:border-0 last:pb-0">
                    <span className="text-[9px] uppercase tracking-[0.18em] font-black text-white/40 font-sans">{row.label}</span>
                    <span className={`text-[11px] font-bold ${row.color}`}>{row.value}</span>
                  </div>
                ))}
              </div>

              {/* Progress Stats */}
              <div className="rounded-[1.2rem] border-2 border-purple-500/30 bg-transparent p-3 space-y-2">
                <p className="text-[8px] uppercase tracking-[0.3em] text-white/40 font-sans font-black">Character Attributes</p>
                <div className="space-y-2.5">
                  {[
                    { key: 'mischief', label: 'Mischief', color: 'from-pink-500 to-rose-600', glow: 'rgba(236,72,153,0.4)' },
                    { key: 'agility', label: 'Agility', color: 'from-amber-400 to-orange-500', glow: 'rgba(251,191,36,0.4)' },
                    { key: 'courage', label: 'Courage', color: 'from-blue-400 to-indigo-500', glow: 'rgba(96,165,250,0.4)' },
                    { key: 'strength', label: 'Strength', color: 'from-red-400 to-rose-600', glow: 'rgba(248,113,113,0.4)' },
                  ].map(stat => {
                    const val = char.stats[stat.key] || 0;
                    return (
                      <div key={stat.key}>
                        <div className="flex justify-between mb-0.5">
                          <span className="text-[8px] font-black uppercase tracking-widest text-white/50 font-sans">{stat.label}</span>
                          <span className="text-[9px] font-bold text-white/60 font-mono">{val}%</span>
                        </div>
                        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full bg-gradient-to-r ${stat.color}`}
                            style={{ width: val + '%', transition: 'width 1s ease-out', boxShadow: `0 0 8px ${stat.glow}` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3 animate-fade-in font-sans">
              {/* 1. Signature Quote */}
              <div className="rounded-xl border-2 border-purple-500/35 bg-transparent p-3 space-y-1">
                <span className="text-[7.5px] font-black uppercase tracking-[0.2em] text-purple-300 block">Personal Quote</span>
                <p className="text-[11px] text-white/80 italic leading-relaxed">
                  &ldquo;{dossier.quote}&rdquo;
                </p>
              </div>

              {/* 2. Daily Hobbies */}
              <div className="rounded-xl border-2 border-purple-500/30 bg-transparent p-3 space-y-1">
                <span className="text-[7.5px] font-black uppercase tracking-[0.2em] text-neutral-400 block">Daily Hobbies &amp; Duties</span>
                <p className="text-[11px] text-white/70 leading-relaxed">{dossier.activities}</p>
              </div>

              {/* 3. Clerk Past Record */}
              <div className="rounded-xl border-2 border-purple-500/30 bg-transparent p-3 space-y-1">
                <span className="text-[7.5px] font-black uppercase tracking-[0.2em] text-neutral-400 block">Official Clerk Record</span>
                <p className="text-[11px] text-rose-300/80 leading-relaxed font-mono text-[10.5px]">{dossier.record}</p>
              </div>

              {/* 4. Player Relation Status Sync */}
              <div className="rounded-xl border-2 border-cyan-500/35 bg-transparent p-3 space-y-1 border-dashed">
                <span className="text-[7.5px] font-black uppercase tracking-[0.2em] text-cyan-300 block">Player Standing Sync</span>
                <p className="text-[11px] text-cyan-200/80 italic leading-relaxed">{dossier.sync}</p>
              </div>
            </div>
          )}
        </div>

        {/* Slider controls (Pinned to bottom) */}
        <div className="flex items-center justify-between pt-3 mt-2 border-t border-white/5 shrink-0">
          <button
            onClick={() => setActiveIndex((activeIndex - 1 + characters.length) % characters.length)}
            className="w-8 h-8 rounded-full flex items-center justify-center border border-white/10 bg-white/5 hover:border-purple-400/50 hover:bg-purple-400/10 text-white/60 hover:text-purple-300 transition-all text-xs"
          >
            ‹
          </button>
          <div className="flex gap-1">
            {characters.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`h-1 rounded-full transition-all duration-500 ${idx === activeIndex ? 'w-4 bg-purple-400' : 'w-1 bg-white/20'}`}
              />
            ))}
          </div>
          <button
            onClick={() => setActiveIndex((activeIndex + 1) % characters.length)}
            className="w-8 h-8 rounded-full flex items-center justify-center border border-white/10 bg-white/5 hover:border-purple-400/50 hover:bg-purple-400/10 text-white/60 hover:text-purple-300 transition-all text-xs"
          >
            ›
          </button>
        </div>

      </div>
    </div>
    </div>
  );
};

export default HomeBox2_Census;
