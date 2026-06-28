import React, { useState } from 'react';
import { useTTStore } from '../store/useTTStore';
import type { TownId } from '../store/useTTStore';
import { motion, AnimatePresence } from 'framer-motion';
import GlassButton from '../components/GlassButton';

// ── Town Data ─────────────────────────────────────────────
interface Town {
  id: TownId | string;
  name: string;
  county: string;
  tagline: string;
  description: string;
  image: string;
  color: string;
  accent: string;
  gradient: string;
  traits: string[];
  professions: string[];
  emoji: string;
  comingSoon?: boolean;
}

const TOWNS: Town[] = [
  {
    id: 'ganache-grove',
    name: 'Ganache Grove',
    county: 'Cocoawood County',
    tagline: 'Where the Canopy Whispers in Cocoa',
    description:
      'A dense, mystical forest town alive with glowing mushroom clusters and rebel spirit. Olive Pine leads the Ranger patrols. Milo Spark studies acoustic vibrations from ancient mushroom colonies.',
    image: '/Assets/WelcomeShow/CocoawoodCounty.png',
    color: 'border-emerald-500/40',
    accent: 'text-emerald-300',
    gradient: 'from-emerald-950/60 to-teal-950/60',
    traits: ['Mystical', 'Rebellious', 'Forested', 'Curious'],
    professions: ['Builder', 'Explorer', 'Scientist'],
    emoji: '🌲',
  },
  {
    id: 'peppermint-peak',
    name: 'Peppermint Peaks',
    county: 'Creamwood County',
    tagline: 'Frozen Heights and Geothermal Springs',
    description:
      'A high-altitude town of frozen peppermint spires and hot chocolate-steam geysers. Dr. Fudge runs the clinic here. The mint patrol guards the upper passes.',
    image: '/Assets/WelcomeShow/CreamwoodCounty.png',
    color: 'border-cyan-500/40',
    accent: 'text-cyan-300',
    gradient: 'from-cyan-950/60 to-teal-950/60',
    traits: ['Glacial', 'Medicinal', 'Rugged', 'Precise'],
    professions: ['Healer', 'Social Work', 'Scientist'],
    emoji: '❄️',
    comingSoon: true,
  },
  {
    id: 'banoffee-valley',
    name: 'Banoffee Valley',
    county: 'Nutwood County',
    tagline: 'Sun-drenched Groves and Creamy Rivers',
    description:
      'A tropical valley filled with sweet banana trees, wild cream falls, and golden toffee mines. Milo Spark and other explorers gather exotic spice extracts here.',
    image: '/Assets/WelcomeShow/NutwoodCounty.png',
    color: 'border-yellow-500/40',
    accent: 'text-yellow-300',
    gradient: 'from-yellow-950/60 to-amber-950/60',
    traits: ['Tropical', 'Bountiful', 'Cheerful', 'Cozy'],
    professions: ['Explorer', 'Scientist', 'Chef'],
    emoji: '🍌',
    comingSoon: true,
  },
  {
    id: 'eclair-square',
    name: 'Caramel Cove',
    county: 'Honeywood County',
    tagline: 'Sweet Tides and Busy Markets',
    description:
      'A coastal town with sticky saltwater shorelines and golden caramel markets. Sailors and merchants thrive here. The province\'s best harbour is open day and night.',
    image: '/Assets/WelcomeShow/HoneywoodCounty.png',
    color: 'border-purple-500/40',
    accent: 'text-purple-300',
    gradient: 'from-purple-950/60 to-indigo-950/60',
    traits: ['Coastal', 'Mercantile', 'Adventurous', 'Sunny'],
    professions: ['Trader', 'Explorer', 'Healer'],
    emoji: '🌊',
    comingSoon: true,
  },
  // ── Coming Soon Locked Towns ──
  {
    id: 'toffee-town',
    name: 'Hazelnut Terrace',
    county: 'Nutwood County',
    tagline: 'Bonfires, Craft, and Ancient Tradition',
    description:
      'The warm heart of Nutwood County. Ancient nut-carving elders gather around the eternal bonfire. Known for its tight-knit community and the best roasted hazelnut trade in the province.',
    image: '/Assets/WelcomeShow/NutwoodCounty.png',
    color: 'border-amber-500/20',
    accent: 'text-amber-300/60',
    gradient: 'from-amber-950/30 to-orange-950/30',
    traits: ['Warm', 'Traditional', 'Industrious', 'Political'],
    professions: ['Politician', 'Architect', 'Trader'],
    emoji: '🌰',
    comingSoon: true,
  },
  {
    id: 'butterscotch-bay',
    name: 'Butterscotch Bay',
    county: 'Honeywood County',
    tagline: 'Salty Breeze and Butterscotch Docks',
    description:
      'A historic port famous for maritime trade, rich butterscotch candies, and massive wood-hulled trade galleons sailing the sweet tides of the province.',
    image: '/Assets/WelcomeShow/HoneywoodCounty.png',
    color: 'border-orange-500/20',
    accent: 'text-orange-300/60',
    gradient: 'from-orange-950/30 to-amber-950/30',
    traits: ['Maritime', 'Historic', 'Windy', 'Bustling'],
    professions: ['Trader', 'Sailor', 'Shipwright'],
    emoji: '⚓',
    comingSoon: true,
  },
  {
    id: 'honeycomb-heights',
    name: 'Honeycomb Heights',
    county: 'Cocoawood County',
    tagline: 'Sweet Altitude and Apiary Steppes',
    description:
      'A series of terraced cliffside apiaries high above the forest floor. Citizens here specialize in honey harvesting, bee keeping, and crafting medicinal wax balms.',
    image: '/Assets/WelcomeShow/CocoawoodCounty.png',
    color: 'border-yellow-500/20',
    accent: 'text-yellow-300/60',
    gradient: 'from-yellow-950/30 to-amber-950/30',
    traits: ['Apiary', 'Terraced', 'Buzzing', 'Highland'],
    professions: ['Healer', 'Farmer', 'Builder'],
    emoji: '🍯',
    comingSoon: true,
  },
  {
    id: 'praline-port',
    name: 'Praline Port',
    county: 'Creamwood County',
    tagline: 'Galleons, Spice Trade, and Sugar Canals',
    description:
      'A grand trading hub connected by wide cream canals. Praline Port features beautiful stone bridges, trading houses, and is the gateway to the outer oceans.',
    image: '/Assets/WelcomeShow/CreamwoodCounty.png',
    color: 'border-pink-500/20',
    accent: 'text-pink-300/60',
    gradient: 'from-pink-950/30 to-purple-950/30',
    traits: ['Canals', 'Grand', 'Mercantile', 'Regal'],
    professions: ['Merchant', 'Navigator', 'Diplomat'],
    emoji: '🚢',
    comingSoon: true,
  }
];

// ── Welcome Popup ─────────────────────────────────────────
const WelcomePopup: React.FC<{ town: Town; onContinue: () => void }> = ({ town, onContinue }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.8 }}
    className="fixed inset-0 z-50 flex items-center justify-center p-6"
  >
    <div className="absolute inset-0 bg-black/80" />
    <div className="relative z-10 max-w-xl w-full glass-strong rounded-3xl p-8 flex flex-col gap-6 border border-amber-400/30 shadow-[0_0_60px_rgba(251,191,36,0.15)]">
      {/* Top */}
      <div className="text-center">
        <div className="text-6xl mb-3 animate-float">{town.emoji}</div>
        <div className="font-brand text-3xl text-amber-400 drop-shadow-glow">Welcome, Traveller!</div>
        <div className="text-white/60 text-sm mt-1">You are now registered in {town.name}</div>
      </div>

      {/* Details */}
      <div className="bg-white/5 rounded-2xl p-4 border border-white/10 text-sm text-white/80 leading-relaxed font-body">
        <p>
          <span className={`font-black ${town.accent}`}>{town.name}</span> is your home town.
          You need to upgrade your skills and contribute to the town — and accordingly your{' '}
          <span className="text-amber-300 font-semibold">Legacy</span> will be calculated.
        </p>
        <div className="mt-3 flex flex-col gap-1.5 text-xs text-white/60">
          <div>🎖 <span className="text-white">Badges</span> are awarded on mission completion</div>
          <div>🪙 <span className="text-white">200 Cocoa Coins</span> awarded as your starter purse</div>
          <div>📋 <span className="text-white">Missions</span> unlock as you participate in town activities</div>
          <div>📊 <span className="text-white">Dashboard</span> tracks your points, titles, and rank</div>
          <div>🏆 <span className="text-white">Leaderboard</span> shows your standing among all Travellers</div>
        </div>
      </div>

      {/* Traits */}
      <div className="flex flex-wrap gap-2 justify-center">
        {town.traits.map(t => (
          <span key={t} className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border ${town.color} bg-white/5 ${town.accent}`}>
            {t}
          </span>
        ))}
      </div>

      <GlassButton
        label={`Enter ${town.name} →`}
        onClick={onContinue}
        variant={town.id === 'ganache-grove' ? 'accent' : town.id === 'toffee-town' ? 'primary' : town.id === 'eclair-square' ? 'secondary' : 'accent'}
        className="w-full !rounded-2xl"
      />
    </div>
  </motion.div>
);

// ── Choose Town Page ──────────────────────────────────────
const ChooseTown: React.FC = () => {
  const { 
    setHomeTown, 
    setPage, 
    addCoins, 
    setTownWelcomeShown, 
    townWelcomeShown, 
    setWelcomeDone, 
    homeTown, 
    skills, 
    coins, 
    spendCoins 
  } = useTTStore();
  const [selected, setSelected] = useState<Town | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [errorFeedback, setErrorFeedback] = useState<string | null>(null);

  React.useEffect(() => {
    useTTStore.setState({ taskQueue: [], residencyTaskStage: null, activeResidencyTask: null });
  }, []);

  const totalXP = Object.values(skills || {}).reduce((a, b) => a + b, 0);

  const handleChoose = (town: Town) => {
    if (homeTown && homeTown !== town.id) {
      // Relocating check
      if (totalXP < 3000) {
        setErrorFeedback(`❌ Relocation Locked! Requires Citizen Level 3 (3,000+ total XP). You have ${totalXP} XP.`);
        setTimeout(() => setErrorFeedback(null), 5000);
        return;
      }
      if (coins < 15) {
        setErrorFeedback(`❌ Relocation Locked! Requires a processing fee of 15 Cocoa Coins. You have ${coins} coins.`);
        setTimeout(() => setErrorFeedback(null), 5000);
        return;
      }
    }
    setSelected(town);
  };

  const handleConfirm = () => {
    if (!selected) return;
    if (homeTown && homeTown !== selected.id) {
      // Deduct processing fee
      spendCoins(15, `Relocation Registry processing fee to ${selected.name}`);
      
      // Relocating - queue a travel task
      const speeds: Record<string, number> = {
        'walk': 40,
        'horse-wagon': 80,
        'forest-train': 160,
        'hot-air-balloon': 320,
      };
      const currentStore = useTTStore.getState();
      const activeTransport = currentStore.activeTransport || 'walk';
      const speedMult = speeds[activeTransport] || 40;
      const travelDist = 4000; // 4km distance between county sectors
      const travelDuration = Math.max(5000, Math.round((travelDist / speedMult) * 1000));

      currentStore.addToQueue({
        name: `Relocating to ${selected.name}`,
        type: 'travel',
        duration: travelDuration,
        rewardCoins: 0,
        rewardXP: 0,
        rewardXPCat: '',
        rewardLegacy: 30,
        icon: '🚂',
        targetText: `${selected.name} Registry`,
        destinationTownId: selected.id,
      });

      setWelcomeDone(true);
      setPage('town-talk-entrance');
    } else {
      // First time home selection
      setHomeTown(selected.id as TownId);
      setWelcomeDone(true);
      if (!townWelcomeShown) {
        addCoins(200, 'Welcome Gift — Starter Purse');
        setTownWelcomeShown(true);
      }
      setPage('town-talk-entrance');
    }
  };

  return (
    <div className="relative w-full h-screen flex items-center justify-center p-4 md:p-8 overflow-hidden select-none">
      {/* Popup overlay */}
      <AnimatePresence>
        {selected && <WelcomePopup town={selected} onContinue={handleConfirm} />}
      </AnimatePresence>

      {/* Error feedback banner */}
      {errorFeedback && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[100] px-8 py-3 rounded-2xl bg-stone-900 border border-rose-500/40 text-rose-300 font-brand text-xs uppercase tracking-wide shadow-[0_8px_32px_rgba(220,38,38,0.3)] animate-fade-in max-w-2xl text-center">
          {errorFeedback}
        </div>
      )}

      {/* 92vw x 96vh Glassmorphism Container (Zero Blur) */}
      <div
        className="relative z-10 w-[92vw] h-[96vh] max-h-[96vh] rounded-[2.5rem] border-2 border-white/35 bg-black/60 shadow-[inset_0_1px_2px_rgba(255,255,255,0.25),_0_40px_120px_rgba(0,0,0,0.65)] overflow-hidden flex flex-col p-8 justify-between"
        style={{ backdropFilter: 'none', WebkitBackdropFilter: 'none' }}
      >
        {/* Header */}
        <div className="flex justify-between items-start animate-fade-in-up shrink-0 w-full relative">
          <div className="w-24 text-left">
            {homeTown && (
              <button
                onClick={() => setPage('desk')}
                className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 border border-white/10 text-[10px] font-brand uppercase tracking-wider text-white rounded-xl transition"
                style={{ fontFamily: '"Josefin Sans", sans-serif' }}
              >
                ← Desk
              </button>
            )}
          </div>
          <div className="text-center flex-1 pr-24">
            <div className="text-[10px] font-black uppercase tracking-[0.35em] text-white/40 mb-1">
              The Imperial Province of ChocoBrook
            </div>
            <h1
              className="font-brand text-4xl text-amber-400 uppercase tracking-wider leading-none"
              style={{ fontFamily: '"Luckiest Guy", cursive' }}
            >
              Choose Your Home Town
            </h1>
            <p className="mt-2 text-white/60 font-body italic text-sm max-w-2xl mx-auto">
              Every Traveller must establish residency in one of the four outer county towns.
              Your choice determines your starting professions, initial missions, and your legacy path.
            </p>
          </div>
        </div>

        {/* Town Cards — scrollable row */}
        <div className="w-full flex-1 overflow-y-auto custom-scrollbar my-3 pr-2">
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-fade-in-up delay-200 py-2">
            {TOWNS.map((town, i) => {
              const isCurrent = homeTown === town.id;
              const isComingSoon = town.comingSoon;
              return (
                <motion.div
                  key={town.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => !isComingSoon && !isCurrent && handleChoose(town as any)}
                  className={`relative flex flex-col rounded-3xl overflow-hidden border-2 transition-all duration-300 h-[52vh] min-h-[360px]
                    ${isCurrent ? 'border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.2)]' : isComingSoon ? 'border-white/10 opacity-60 grayscale-[40%] cursor-not-allowed' : town.color} 
                    bg-gradient-to-b ${town.gradient}
                    ${hovered === town.id && !isComingSoon ? 'scale-[1.02] shadow-[0_0_30px_rgba(0,0,0,0.5)] cursor-pointer' : ''}`}
                  onMouseEnter={() => !isComingSoon && setHovered(town.id)}
                  onMouseLeave={() => setHovered(null)}
                >
                  {/* Image */}
                  <div className="relative h-[38%] overflow-hidden bg-black/20 flex items-center justify-center">
                    <img
                      src={town.image}
                      alt={town.name}
                      className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    <div className="absolute top-3 right-3 text-3xl">{town.emoji}</div>
                    {isCurrent && (
                      <div className="absolute top-3 left-3 bg-amber-500 text-black text-[9px] font-brand uppercase tracking-wider px-2 py-0.5 rounded-md shadow-md">
                        Current Home
                      </div>
                    )}
                    {isComingSoon && (
                      <div className="absolute top-3 left-3 bg-neutral-800 text-neutral-400 border border-white/10 text-[9px] font-brand uppercase tracking-wider px-2 py-0.5 rounded-md shadow-md flex items-center gap-1">
                        <span>🔒</span> Coming Soon
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex flex-col gap-2 p-4 flex-1 justify-between text-left">
                    <div>
                      <div className="text-[9px] font-black uppercase tracking-[0.3em] text-white/40">{town.county}</div>
                      <h3 className={`font-brand text-[1.2rem] ${town.accent} tracking-wider mt-0.5`} style={{ fontFamily: '"Luckiest Guy", cursive' }}>
                        {town.name}
                      </h3>
                      <p className="text-[10px] text-white/60 italic font-body mt-0.5 leading-tight">{town.tagline}</p>
                    </div>

                    <p className="text-[11px] text-white/70 leading-relaxed font-body flex-1 overflow-y-auto custom-scrollbar pr-1">{town.description}</p>

                    {/* Professions */}
                    <div className="flex flex-wrap gap-1 mt-1 shrink-0">
                      {town.professions.map(p => (
                        <span key={p} className="text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/50">
                          {p}
                        </span>
                      ))}
                    </div>

                    {/* CTA */}
                    {isComingSoon ? (
                      <GlassButton
                        label="Coming Soon 🔒"
                        disabled={true}
                        variant="primary"
                        className="!w-full !min-w-0 !h-9 !min-h-9 !rounded-xl !py-0 !text-xs mt-2 shrink-0 opacity-40 cursor-not-allowed"
                      />
                    ) : (
                      <GlassButton
                        label={isCurrent ? "Current Home" : "Choose Town"}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!isCurrent) handleChoose(town as any);
                        }}
                        disabled={isCurrent}
                        variant={town.id === 'ganache-grove' ? 'accent' : town.id === 'toffee-town' ? 'primary' : town.id === 'eclair-square' ? 'secondary' : 'accent'}
                        className={`!w-full !min-w-0 !h-9 !min-h-9 !rounded-xl !py-0 !text-xs mt-2 shrink-0 ${isCurrent ? 'opacity-50 cursor-default' : ''}`}
                      />
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Info strip */}
        <div className="w-full rounded-2xl bg-white/5 border border-white/10 p-4 text-center animate-fade-in delay-500 shrink-0">
          <p className="text-white/50 text-xs font-body italic">
            🪙 Relocation requires <span className="text-amber-400 font-semibold font-sans">Citizen Level 3</span> and a processing fee of <span className="text-emerald-400 font-semibold font-sans">15 Cocoa Coins</span>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChooseTown;
