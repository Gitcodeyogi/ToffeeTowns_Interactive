/* eslint-disable react-refresh/only-export-components */
// PreGameScreen.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Universal pre-game instructions screen shown before every mini-game.
// Shows How-to-play rules and Reward/Penalty tiers side-by-side.
// Features magical celebration sparkles, floating cards, and interactive blueprints.
// ─────────────────────────────────────────────────────────────────────────────
import React, { useState, useEffect } from 'react';

export interface GameRewardTiers {
  xp50: number;   // XP for 50% completion
  xp75: number;   // XP for 75% completion
  xp100: number;  // XP for 100% completion (default finish)
  legacy50: number;
  legacy75: number;
  legacy100: number;
  xpCategory: string;
  penaltyXP: number;   // negative on early quit
  penaltyLegacy: number; // negative on early quit
}

export interface PreGameConfig {
  icon: string;
  title: string;
  subtitle: string;
  themeColor: string;        // e.g. '#f472b6'
  themeGlow: string;         // rgba glow color
  rules: string[];           // 3-5 bullet points
  tip?: string;              // optional quick tip
  rewards: GameRewardTiers;
  hintCostCoins: number;
}

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@700;900&family=Fredoka+One&family=Luckiest+Guy&display=swap');
  .pgs-fredoka { font-family: 'Fredoka One', sans-serif !important; }
  .pgs-nunito { font-family: 'Nunito', 'Fredoka One', sans-serif !important; }
  .pgs-lucky { font-family: 'Luckiest Guy', cursive !important; }

  @keyframes pgsCloudDrift {
    0% { transform: translateX(-150px); }
    100% { transform: translateX(110vw); }
  }

  .pgs-card-dance {
    transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.4s ease, border-color 0.4s ease;
  }
  .pgs-card-dance:hover {
    transform: translateY(-6px) scale(1.02) rotate(1.2deg);
    box-shadow: 0 20px 35px rgba(0, 0, 0, 0.35);
    border-color: rgba(255, 255, 255, 0.4);
  }
  .pgs-card-dance-alt {
    transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.4s ease, border-color 0.4s ease;
  }
  .pgs-card-dance-alt:hover {
    transform: translateY(-6px) scale(1.02) rotate(-1.2deg);
    box-shadow: 0 20px 35px rgba(0, 0, 0, 0.35);
    border-color: rgba(255, 255, 255, 0.4);
  }

  @keyframes pgsFloat {
    0%,100% { transform: translateY(0) rotate(-1.5deg); }
    50%      { transform: translateY(-7px) rotate(1.5deg); }
  }
  @keyframes pgsPulse {
    0%,100% { transform: scale(1); opacity: 0.95; }
    50%     { transform: scale(1.05); opacity: 1; }
  }
  @keyframes pgsBounce {
    0%,100% { transform: scale(1) translateY(0); }
    50%     { transform: scale(1.03) translateY(-4px); }
  }
  @keyframes pgsWiggle {
    0%,100% { transform: rotate(0deg); }
    25%     { transform: rotate(-5deg); }
    75%     { transform: rotate(5deg); }
  }
  @keyframes pgsSlideUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes pgsRuleIn {
    from { opacity: 0; transform: translateX(-16px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes pgsMagicFall {
    0% {
      transform: translateY(-40px) rotate(0deg) scale(0.85);
      opacity: 0;
    }
    15% {
      opacity: 0.9;
    }
    85% {
      opacity: 0.9;
    }
    100% {
      transform: translateY(105vh) rotate(360deg) scale(0.85);
      opacity: 0;
    }
  }

  .pgs-play-btn {
    transition: all 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }
  .pgs-play-btn:hover {
    transform: scale(1.06) translateY(-2px);
    filter: brightness(1.15) drop-shadow(0 0 15px rgba(251,191,36,0.6));
  }
  .pgs-play-btn:active {
    transform: scale(0.96) translateY(1px);
  }

  .pgs-btn { transition: all 0.2s ease; }
  .pgs-btn:hover { transform: scale(1.03); }
  .pgs-btn:active { transform: scale(0.97); }
`;

/* ─── Helper RuleBubble component ─── */
const RuleBubble: React.FC<{ n: number; color: string; delay?: number }> = ({ n, color, delay = 0 }) => {
  return (
    <div
      className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-black font-black text-xs font-sans mt-0.5"
      style={{
        background: color,
        boxShadow: `0 0 12px ${color}60`,
        animation: `pgsPulse 2s ease-in-out infinite`,
        animationDelay: `${delay}s`
      }}
    >
      {n}
    </div>
  );
};

/* ─── Extended Medical Details / Specs ─── */
export interface HerbDetail {
  id: number;
  name: string;
  emoji: string;
  property: string;
  description: string;
  clue: string;
  isPrankClue?: boolean;
}

export const HERBS_BY_CAT: Record<string, HerbDetail[]> = {
  fever: [
    { id: 1, name: 'Velvet Peppermint', emoji: '🌿', property: 'Cooling • Anti-pyretic', description: 'Harvested during first morning snow, its velvety leaves carry a freezing ether that subdues burning blood. Though its minty aroma is known to soothe tension headaches, its true power lies in cooling severe grove-fever.', clue: 'Primary remedy for high temperatures and burning nights, though it has minty side benefits.' },
    { id: 2, name: 'Frostfire Petal', emoji: '❄️', property: 'Cooling • Anti-inflammatory', description: 'A rare winter orchid that glows with a pale blue flame. It draws heat from its surroundings, cooling a patient\'s high fever instantly. It is occasionally brewed to settle standard stomach gas, but it is primarily a thermal calmer.', clue: 'A cool blue orchid, perfect for calming stomach cramps.', isPrankClue: true },
    { id: 3, name: 'Bitter Feverbark', emoji: '🪵', property: 'Cooling • Febrifuge', description: 'Stripped from ancient redwood branches, this intensely bitter bark reduces body temperature by promoting rapid sweat. It is sometimes used to ease chest congestion, but its core purpose is fever breaking.', clue: 'A dry, bitter tree bark designed to break fevers.' },
    { id: 4, name: 'Sun-Droplet Flower', emoji: '🌻', property: 'Diaphoretic • Calming', description: 'A bright yellow flower that absorbs solar heat. When crushed into a paste, it induces heavy perspiration, expelling high fevers. Its seeds are also known to ease stomach cramps, but the flower petals are purely for breaking fevers.', clue: 'Yellow petals that induce sweating to break grove-fever.' }
  ],
  cough: [
    { id: 5, name: 'Glowspore Mushroom', emoji: '🍄', property: 'Expectorant • Lung Tonic', description: 'A luminescent green mushroom that grows on decaying cedar logs. It expels sticky bronchial fluid and clears airways. Some travelers chew its stem to calm stress before long journeys, but the cap is a bronchial expectorant.', clue: 'Luminescent green caps that instantly cure severe tension headaches.', isPrankClue: true },
    { id: 6, name: 'Silver Pine-Needles', emoji: '🌲', property: 'Bronchial • Decongestant', description: 'Sharp, silver needles from the tallest pines. When infused in hot steam, they relieve dry, tickly coughing fits and soothe throat tissue. They are also known to clear minor sinus headaches, but their target is the chest.', clue: 'Relieves dry, tickly coughing fits and throat spasms.' },
    { id: 7, name: 'Eucalyptus Leaf', emoji: '🍃', property: 'Antiseptic • Expectorant', description: 'An oil-rich leaf with a sharp, medicinal scent. Its vapors penetrate deep into the lungs, clearing congestion and open airways. It is often inhaled to relieve temple pressure, but it is classified as a lung decongestant.', clue: 'Inhalant leaf for chest and lung decongestion.' },
    { id: 8, name: 'Honey-Sap Bark', emoji: '🍯', property: 'Demulcent • Antitussive', description: 'Sourced from sweet-drip maple trees, this thick bark coats dry, raw throat linings to stop hacking coughs. It is also a popular sweet treat that calms upset stomachs, but its medicinal target is dry throat spasms.', clue: 'Coats raw throat linings and stops hacking coughs.' }
  ],
  stress: [
    { id: 9, name: 'Sugar Lily Petal', emoji: '🌸', property: 'Anxiolytic • Nervine', description: 'A delicate pink petal that smells of spun sugar. It slows down a racing heartbeat, calms panic, and brings mental peace. While it can soothe tension headaches, it is mainly a heart-easing nervine.', clue: 'Eases a racing pulse and calms anxious thoughts.' },
    { id: 10, name: 'Cozy Lavender', emoji: '🪻', property: 'Relaxant • Aromatherapy', description: 'A classic purple herb known for its relaxing floral aroma. It calms frazzled nerves, reduces overthinking, and prepares the mind for deep sleep. It is also used to soothe mild stomach aches, but its true home is stress relief.', clue: 'Purple sprig that reduces body heat and breaks high fevers.', isPrankClue: true },
    { id: 11, name: 'Worry-Root Stem', emoji: '🪵', property: 'Anxiolytic • Sedative', description: 'A slow-growing root that contains calming adaptogens. It relaxes tight muscles and reduces anxiety. Healers brew it to lower high fevers, but its primary effect is soothing nervous tension.', clue: 'Anxiety reducer that brings peace to a worried mind.' },
    { id: 12, name: 'Dreamweave Orchid', emoji: '🌹', property: 'Relaxant • Sleep Aid', description: 'A rare rose-colored bloom that releases a calming vapor at dusk. It quietens the brain, dissolves stressful thoughts, and helps insomnia. Its leaves can be crushed to soothe sore throats, but the flower is a nerve sedative.', clue: 'Dissolves stressful thoughts and prepares for deep rest.' }
  ],
  stomach: [
    { id: 13, name: 'Peppermint Tea-Leaf', emoji: '🌱', property: 'Carminative • Digestant', description: 'Fragrant leaves brewed to calm indigestion, stop stomach spasms, and relieve abdominal gas.', clue: 'Soothing tea leaf designed to calm upset stomachs and intestines.' },
    { id: 14, name: 'Ginger Snap Root', emoji: '🫚', property: 'Digestive • Anti-nausea', description: 'A knobby, spicy root that settles nausea and stops stomach cramping.', clue: 'Knobby root to relieve dry, tickly coughing fits.', isPrankClue: true },
    { id: 15, name: 'Sweet Fennel Seed', emoji: '🌾', property: 'Carminative • Antispasmodic', description: 'Small aromatic seeds that reduce stomach bloating and diner cramps.', clue: 'Fragrant seeds to soothe bloating and intestinal cramps.' },
    { id: 16, name: 'Chamomile Flower', emoji: '🌼', property: 'Antispasmodic • Calming', description: 'Gentle yellow daisy-like flower that relaxes stomach muscles and relieves gas.', clue: 'Brewed flower to settle nervous stomach spasms.' }
  ],
  headache: [
    { id: 17, name: 'Willow Bark Powder', emoji: '🪵', property: 'Analgesic • Anti-inflammatory', description: 'Ground powder that blocks throbbing headache pain and temple pressure.', clue: 'Dry powder that relieves throbbing temple pressure and headache pain.' },
    { id: 18, name: 'Soothing Feverfew', emoji: '🌼', property: 'Analgesic • Vasodilator', description: 'Flowering weed that eases chronic migraine tension and relaxes skull nerves.', clue: 'Daisies that settle standard stomach gas and diner cramps.', isPrankClue: true },
    { id: 19, name: 'Magical Rosemary', emoji: '🌿', property: 'Stimulant • Analgesic', description: 'Fragrant leaves that stimulate skull blood flow, clearing tension headaches.', clue: 'Inhaled vapor to clear sinus congestion headaches.' },
    { id: 20, name: 'Wild Lavender Buds', emoji: '💜', property: 'Sedative • Analgesic', description: 'Dried buds that calm skull nerve endings, soothing cluster headaches.', clue: 'Buds that relax skull nerves to soothe stress headaches.' }
  ]
};

export const DIAGNOSTICS: Record<string, { title: string; status: string; desc: string }> = {
  fever: { title: 'High Body Temperature', status: 'CRITICAL', desc: 'Patient burning up, extreme chills, flushed skin. Requires cooling, sweat-promoting febrifuge herbs.' },
  cough: { title: 'Bronchial Chest Congestion', status: 'STABLE', desc: 'Heavy hacking fits, thick lung fluid, raw vocal cords. Requires expectorants and soothing throat bark.' },
  stress: { title: 'Severe Nervous Tension', status: 'STABLE', desc: 'Racing pulse, frazzled nerves, acute insomnia. Requires calming nervines, sedatives, and adaptogen roots.' },
  stomach: { title: 'Digestive Gastric Cramps', status: 'CRITICAL', desc: 'Severe bloating, bloating nausea, intestinal spasms. Requires carminatives, gingerols, and calming teas.' },
  headache: { title: 'Throbbing Temple Migraine', status: 'STABLE', desc: 'Sharp skull pressure, light sensitivity, cluster headache. Requires willow bark analgesics and skull stimulants.' }
};

interface BakeryDetail {
  id: number;
  name: string;
  emoji: string;
  property: string;
  description: string;
  clue: string;
}

export const BAKERY_BY_CAT: Record<string, BakeryDetail[]> = {
  fever: [
    { id: 1, name: 'Glazed Croissant', emoji: '🥐', property: 'Sweet • Flaky', description: 'Golden crust baked to flaky perfection.', clue: 'Ideal temperature range: 180°C - 195°C.' },
    { id: 2, name: 'Cinnamon Roll', emoji: '🌀', property: 'Spiced • Glazed', description: 'Warm cinnamon swirled dough.', clue: 'Requires high temperature burst: 200°C.' }
  ],
  cough: [
    { id: 3, name: 'Sourdough Loaf', emoji: '🍞', property: 'Crusty • Savory', description: 'Crunchy crust with a soft sour crumb.', clue: 'Thrives in steam-injected oven at 220°C.' },
    { id: 4, name: 'Rye Bread', emoji: '🥖', property: 'Dense • Seeded', description: 'Dark rye infused with caraway seeds.', clue: 'Slow bake at 170°C for dense crumb.' }
  ],
  stress: [
    { id: 5, name: 'Strawberry Tart', emoji: '🍓', property: 'Fruity • Custard', description: 'Fresh berries in sweet cream pastry.', clue: 'Pre-baked shell, finish at 160°C.' },
    { id: 6, name: 'Caramel Pudding', emoji: '🍮', property: 'Rich • Melted', description: 'Silky smooth caramel custard.', clue: 'Bake in water bath at 150°C.' }
  ]
};

export const BAKERY_DIAGNOSTICS: Record<string, { title: string; status: string; desc: string }> = {
  fever: { title: 'Pastry Oven Sync', status: 'READY', desc: 'Baking sweet puff pastries and cinnamon rolls. Watch the thermal wave indicators.' },
  cough: { title: 'Bread Oven Sync', status: 'READY', desc: 'Infusing steam for crusty sourdough loaves. Needs precise high heat timing.' },
  stress: { title: 'Dessert Oven Sync', status: 'READY', desc: 'Delicate custard tarts and puddings. Requires gentle low heat water bath.' }
};

interface PreGameScreenProps {
  config: PreGameConfig;
  onPlay: () => void;
  onClose: () => void;
  dutyType?: string;
}

export const PreGameScreen: React.FC<PreGameScreenProps> = ({ config, onPlay, onClose, dutyType }) => {
  const { rewards } = config;
  const [iconKey, setIconKey] = useState(0);
  const [trivia, setTrivia] = useState('');
  const [magicParticles, setMagicParticles] = useState<any[]>([]);
  const [showSpecsModal, setShowSpecsModal] = useState(false);
  const [showManualModal, setShowManualModal] = useState(false);
  const [activeRuleIdx, setActiveRuleIdx] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  // Compile exactly 6 rules for the carousel
  const carouselRules: string[] = [...config.rules];
  const defaultTips = [
    "Always check your active recipe blueprint by clicking the Check Workbench button below.",
    "Pay attention to the Clinical Warnings to avoid costly mistakes and penalty deductions.",
    "Higher completion percentages earn you superior XP and Legacy reputation badges.",
    "If you need to quit, use the Pause menu, but beware of early exit penalties!"
  ];
  while (carouselRules.length < 6) {
    carouselRules.push(defaultTips[carouselRules.length % defaultTips.length]);
  }
  const finalRules = carouselRules.slice(0, 6);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    if (diff > 50) {
      setActiveRuleIdx(prev => (prev + 1) % 6);
    } else if (diff < -50) {
      setActiveRuleIdx(prev => (prev - 1 + 6) % 6);
    }
    setTouchStart(null);
  };

  useEffect(() => {
    const id = setInterval(() => setIconKey(k => k + 1), 2800);
    return () => clearInterval(id);
  }, []);

  // Initialize magic background particles
  useEffect(() => {
    const syms = ['✨', '⭐', '🌈', '🌿', '🍯', '🌸', '🥇', '🔮', '🎉', '💖', '🍀', '⚙️', '🥖'];
    const list = Array.from({ length: 25 }, (_, i) => ({
      id: i,
      sym: syms[i % syms.length],
      x: 3 + Math.random() * 94,
      y: -10 - Math.random() * 45,
      scale: 0.6 + Math.random() * 0.7,
      delay: Math.random() * 6,
      duration: 5 + Math.random() * 5,
      rotation: Math.random() * 360,
    }));
    setMagicParticles(list);

    // Pick a random fun fact
    const facts = FUN_FACTS[dutyType || 'herb'] || FUN_FACTS.herb;
    setTrivia(facts[Math.floor(Math.random() * facts.length)]);
  }, [dutyType]);

  const tiers = [
    { label: 'GOLD - 100%', pct: 100, xp: rewards.xp100, leg: rewards.legacy100, icon: '🥇', grad: 'from-yellow-500 to-amber-600', glow: 'rgba(234,179,8,.5)', badge: 'bg-yellow-400 text-black' },
    { label: 'SILVER - 75%', pct: 75, xp: rewards.xp75, leg: rewards.legacy75, icon: '🥈', grad: 'from-slate-400 to-slate-600', glow: 'rgba(148,163,184,.4)', badge: 'bg-slate-300 text-black' },
    { label: 'BRONZE - 50%', pct: 50, xp: rewards.xp50, leg: rewards.legacy50, icon: '🥉', grad: 'from-amber-600 to-amber-800', glow: 'rgba(180,83,9,.4)', badge: 'bg-amber-600 text-white' }
  ];

  const showBlueprint = ['herb', 'bakery', 'wagon', 'boiler'].includes(dutyType || '');

  return (
    <div className="w-full h-full flex flex-col relative select-none overflow-hidden animate-fade-in text-white"
      style={{
        background: 'rgba(0,0,0,0.75)',
        backdropFilter: 'blur(14px)',
        borderRadius: '2.5rem',
      }}
    >
      <style>{CSS}</style>

      {/* CLOUDS BACKGROUND */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-55">
        <div className="absolute text-7xl select-none" style={{ top: '8%', left: '-150px', animation: 'pgsCloudDrift 38s linear infinite', animationDelay: '0s' }}>☁️</div>
        <div className="absolute text-[110px] select-none" style={{ top: '30%', left: '-250px', animation: 'pgsCloudDrift 55s linear infinite', animationDelay: '-15s' }}>☁️</div>
        <div className="absolute text-8xl select-none" style={{ top: '60%', left: '-180px', animation: 'pgsCloudDrift 45s linear infinite', animationDelay: '-8s' }}>☁️</div>
        <div className="absolute text-9xl select-none" style={{ top: '12%', left: '-200px', animation: 'pgsCloudDrift 68s linear infinite', animationDelay: '-25s' }}>☁️</div>
      </div>

      {/* DRIP DOWN CELEBRATION SHIFT DUST */}
      {magicParticles.map(p => (
        <div
          key={p.id}
          className="absolute pointer-events-none select-none text-2xl z-0"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            transform: `scale(${p.scale}) rotate(${p.rotation}deg)`,
            animation: `pgsMagicFall ${p.duration}s linear infinite`,
            animationDelay: `${p.delay}s`,
          }}
        >
          {p.sym}
        </div>
      ))}

      {/* Close button */}
      <button onClick={onClose}
        className="absolute top-4 right-5 z-30 w-10 h-10 rounded-full flex items-center justify-center font-black hover:scale-110 active:scale-95 transition-all cursor-pointer"
        style={{ background: 'rgba(255,255,255,0.18)', border: '1.5px solid rgba(255,255,255,0.3)', color: 'white' }}
      >✕</button>

      {/* COMPACT HEADER ROW */}
      <div className="shrink-0 flex items-center gap-4 pt-5 pb-3 px-6 relative z-10 border-b border-white/10"
        style={{ animation: 'pgsSlideUp .5s ease' }}
      >
        <div key={iconKey} className="text-5xl shrink-0"
          style={{ animation: 'pgsJump .6s ease both', filter: `drop-shadow(0 0 18px ${config.themeColor})` }}
        >{config.icon}</div>

        <div className="flex-1 min-w-0 text-left">
          <h1 className="pgs-lucky text-xl md:text-2xl uppercase leading-tight flex flex-wrap gap-x-2"
            style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.25))' }}
          >
            {config.title.split(" ").map((word, wIdx) => (
              <span key={wIdx} className="inline-block whitespace-nowrap">
                {word.split("").map((char, cIdx) => (
                  <span
                    key={cIdx}
                    className="inline-block hover:text-yellow-200 transition duration-150"
                    style={{
                      animation: `pgsJump 2.5s ease-in-out infinite`,
                      animationDelay: `${(wIdx * 5 + cIdx) * 0.08}s`,
                      background: `linear-gradient(90deg, #ffffff, #dbeafe, #ffffff)`,
                      backgroundSize: '200% auto',
                      WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                    }}
                  >
                    {char}
                  </span>
                ))}
              </span>
            ))}
          </h1>
          <p className="pgs-nunito text-[11px] font-black mt-0.5 leading-snug"
            style={{ color: 'rgba(255,255,255,0.85)', textShadow: '0 1px 2px rgba(0,0,0,0.15)', animation: 'pgsSlideUp .6s ease .2s both' }}
          >{config.subtitle}</p>
        </div>
      </div>

      {/* THREE COLUMN INSTRUCTIONS BODY */}
      <div className="flex-grow flex flex-col md:flex-row gap-5 px-6 pt-4 pb-2 z-10 min-h-0 text-left overflow-hidden">
        
        {/* Column 1: Instructions Swipe Carousel (33%) */}
        <div className="w-full md:w-[33%] shrink-0 flex flex-col gap-3 min-h-0 pgs-card-dance" style={{ animation: 'pgsSlideUp .5s ease .15s both' }}>
          <div className="flex items-center justify-between pr-2">
            <div className="flex items-center gap-2">
              <span className="text-xl" style={{ animation: 'pgsWiggle 2s ease-in-out infinite' }}>📖</span>
              <span className="pgs-lucky text-sm uppercase tracking-widest text-white" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.15)' }}>Instructions</span>
            </div>
            {/* Arrow controllers */}
            <div className="flex gap-1.5 shrink-0">
              <button
                onClick={() => setActiveRuleIdx(prev => (prev - 1 + 6) % 6)}
                className="w-6 h-6 rounded-full bg-black/40 border border-white/20 flex items-center justify-center text-[10px] text-white hover:bg-white/10 active:scale-90 transition cursor-pointer"
              >
                ◀
              </button>
              <button
                onClick={() => setActiveRuleIdx(prev => (prev + 1) % 6)}
                className="w-6 h-6 rounded-full bg-black/40 border border-white/20 flex items-center justify-center text-[10px] text-white hover:bg-white/10 active:scale-90 transition cursor-pointer"
              >
                ▶
              </button>
            </div>
          </div>

          <div 
            className="rounded-2xl p-4.5 relative overflow-hidden flex-grow flex flex-col justify-between items-center text-center cursor-grab active:cursor-grabbing select-none"
            style={{
              background: 'linear-gradient(145deg,rgba(15,32,67,0.7),rgba(10,25,47,0.65))',
              border: `1.5px solid rgba(255,255,255,0.2)`,
              boxShadow: `0 8px 32px rgba(0,0,0,.25), inset 0 1px 0 rgba(255,255,255,0.07)`,
              backdropFilter: 'blur(8px)',
            }}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* Double-digit Number on top with Luckiest Guy */}
            <div className="w-full mt-2 shrink-0">
              <span className="pgs-lucky text-5xl tracking-widest block select-none"
                style={{
                  color: config.themeColor,
                  textShadow: `0 0 16px ${config.themeColor}50, 0 2px 4px rgba(0,0,0,0.4)`,
                  animation: 'pgsBounce 2.5s ease-in-out infinite',
                }}
              >
                {String(activeRuleIdx + 1).padStart(2, '0')}
              </span>
            </div>

            {/* Instruction description below with Fredoka One */}
            <div className="flex-grow flex items-center justify-center px-2 py-4 select-none">
              <p className="pgs-fredoka text-[13px] leading-relaxed text-white/90 select-none"
                style={{
                  textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                  animation: 'pgsSlideUp 0.3s ease-out both',
                }}
                key={activeRuleIdx}
              >
                {finalRules[activeRuleIdx]}
              </p>
            </div>

            {/* Dot Indicators at the bottom */}
            <div className="flex gap-1.5 justify-center mb-1 shrink-0">
              {finalRules.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveRuleIdx(i)}
                  className={`w-2 h-2 rounded-full transition-all duration-200 cursor-pointer ${
                    activeRuleIdx === i 
                      ? 'bg-amber-400 scale-125 shadow-md shadow-amber-500/50' 
                      : 'bg-white/20 hover:bg-white/40'
                  }`}
                />
              ))}
            </div>
          </div>

          {showBlueprint && (
            <div className="mt-1 shrink-0">
              <h4 className="pgs-fredoka text-[11px] text-amber-300 uppercase tracking-widest block mb-1.5 text-left">Recommendations:</h4>
              <button
                onClick={() => setShowSpecsModal(true)}
                className="w-full p-3 rounded-2xl flex items-center justify-between transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer text-left border"
                style={{
                  background: 'linear-gradient(145deg, rgba(251,191,36,0.1), rgba(251,191,36,0.05))',
                  borderColor: 'rgba(251,191,36,0.45)',
                  boxShadow: '0 4px 12px rgba(251,191,36,0.1), inset 0 1px 0 rgba(255,255,255,0.05)',
                }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl animate-bounce">🛠️</span>
                  <div>
                    <span className="pgs-fredoka text-[12px] text-white block leading-none">Check Workbench</span>
                    <span className="pgs-nunito text-[9px] text-white/40 block mt-0.5">Blueprints & recipes</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-yellow-400 text-black font-black text-[8px] uppercase tracking-wider animate-pulse">
                  ★ RECOMMENDED
                </span>
              </button>
            </div>
          )}
        </div>


        {/* Column 2: Clinical Warnings & Tips (33%) */}
        <div className="w-full md:w-[33%] shrink-0 flex flex-col gap-3 min-h-0 pgs-card-dance-alt" style={{ animation: 'pgsSlideUp .5s ease .20s both' }}>
          <div className="flex items-center gap-2">
            <span className="text-xl animate-bounce" style={{ animationDuration: '2.5s' }}>⚠️</span>
            <span className="pgs-lucky text-sm uppercase tracking-widest text-white" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.15)' }}>Clinical Warnings</span>
          </div>

          <div className="space-y-2.5 flex-grow rounded-2xl p-3.5 relative overflow-hidden flex flex-col justify-between"
            style={{
              background: 'linear-gradient(145deg,rgba(15,32,67,0.7),rgba(10,25,47,0.65))',
              border: `1.5px solid rgba(255,255,255,0.2)`,
              boxShadow: `0 8px 32px rgba(0,0,0,.25), inset 0 1px 0 rgba(255,255,255,0.07)`,
              backdropFilter: 'blur(8px)',
            }}
          >
            <div className="space-y-2">
              <div className="rounded-xl p-2 bg-black/30 border border-red-500/35 flex items-start gap-2.5 shadow-md">
                <span className="text-base">🎭</span>
                <div className="text-left">
                  <span className="pgs-lucky text-red-300 text-[8.5px] uppercase tracking-wider block">Prank Clues Alert</span>
                  <p className="pgs-nunito text-white/70 text-[9.5px] leading-snug mt-0.5">Read descriptions carefully! Some card clues are pranks and lead to wrong diagnoses.</p>
                </div>
              </div>

              <div className="rounded-xl p-2 bg-black/30 border border-amber-500/35 flex items-start gap-2.5 shadow-md">
                <span className="text-base">🍞</span>
                <div className="text-left">
                  <span className="pgs-lucky text-amber-300 text-[8.5px] uppercase tracking-wider block">Decoys & Wastage</span>
                  <p className="pgs-nunito text-white/70 text-[9.5px] leading-snug mt-0.5">Non-herb items like Bread, Coffee, and Cupcakes clutter your deck. Do not add them to cauldrons!</p>
                </div>
              </div>

              <div className="rounded-xl p-2 bg-black/30 border border-blue-500/35 flex items-start gap-2.5 shadow-md">
                <span className="text-base">🚨</span>
                <div className="text-left">
                  <span className="pgs-lucky text-blue-300 text-[8.5px] uppercase tracking-wider block">Priority Ordering</span>
                  <p className="pgs-nunito text-white/70 text-[9.5px] leading-snug mt-0.5">Some herbs serve multiple purposes but have strict priorities. Mismatches waste vital lives!</p>
                </div>
              </div>
            </div>

            {/* Tip card */}
            {config.tip && (
              <div className="rounded-xl p-2 flex items-start gap-2 relative overflow-hidden shrink-0 mt-2"
                style={{ background: 'linear-gradient(135deg,#3b2500,#2a1a00)', border: '1px solid rgba(234,179,8,.3)', boxShadow: '0 0 12px rgba(234,179,8,.1)' }}
              >
                <span className="text-base shrink-0 animate-pulse">💡</span>
                <div className="text-left">
                  <span className="pgs-lucky text-yellow-400 text-[8px] uppercase tracking-widest block leading-none">Pro Tip</span>
                  <p className="pgs-nunito text-yellow-200/80 text-[9.5px] leading-snug mt-0.5">{config.tip}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Column 3: Rewards & Penalties (34%) */}
        <div className="w-full md:w-[34%] shrink-0 flex flex-col gap-3 min-h-0 pgs-card-dance" style={{ animation: 'pgsSlideUp .5s ease .25s both' }}>
          <div className="flex items-center gap-2">
            <span className="text-xl" style={{ animation: 'pgsWiggle 1.8s ease-in-out infinite', animationDelay: '.3s' }}>🏆</span>
            <span className="pgs-lucky text-sm uppercase tracking-widest text-white" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.15)' }}>Rewards & Tiers</span>
          </div>

          <div className="space-y-2 flex-grow justify-between flex flex-col rounded-2xl p-3.5 relative overflow-hidden"
            style={{
              background: 'linear-gradient(145deg,rgba(15,32,67,0.7),rgba(10,25,47,0.65))',
              border: `1.5px solid rgba(255,255,255,0.2)`,
              boxShadow: `0 8px 32px rgba(0,0,0,.25), inset 0 1px 0 rgba(255,255,255,0.07)`,
              backdropFilter: 'blur(8px)',
            }}
          >
            <div className="space-y-1.5">
              {tiers.map((tier, i) => (
                <div key={tier.pct} className="rounded-xl p-2 flex items-center gap-2.5 relative overflow-hidden"
                  style={{
                    background: `rgba(0,0,0,0.25)`,
                    border: `1px solid rgba(255,255,255,0.08)`,
                    boxShadow: `0 2px 8px rgba(0,0,0,.15)`,
                    animation: `pgsSlideUp .4s ease ${.2 + i * .12}s both`,
                  }}
                >
                  <span className="text-xl shrink-0" style={{ animation: `pgsFloat ${2.2 + i * .3}s ease-in-out infinite`, animationDelay: `${i * .4}s` }}>
                    {tier.icon}
                  </span>
                  <div className="flex-1 text-left">
                    <p className={`pgs-lucky text-[10px] tracking-wide bg-gradient-to-r ${tier.grad} bg-clip-text`}
                      style={{ WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1 }}
                    >{tier.label}</p>
                    <div className="flex gap-2 mt-0.5">
                      <span className="flex items-center gap-0.5 rounded text-[9px] font-black pgs-lucky text-emerald-300">
                        +{tier.xp} <span className="text-[7px] text-white/40 font-bold pgs-nunito">{rewards.xpCategory.toUpperCase()} XP</span>
                      </span>
                      <span className="flex items-center gap-0.5 rounded text-[9px] font-black pgs-lucky text-yellow-300">
                        +{tier.leg} <span className="text-[7px] text-white/40 font-bold pgs-nunito">LEGACY</span>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Penalty */}
            <div className="rounded-xl p-2 flex items-center gap-2.5 relative overflow-hidden"
              style={{ background: 'linear-gradient(135deg,#3b0a0a,#1a0505)', border: '1px solid rgba(239,68,68,.35)', boxShadow: '0 0 12px rgba(239,68,68,.1)' }}
            >
              <span className="text-xl shrink-0">🚪</span>
              <div className="flex-1 text-left">
                <p className="pgs-lucky text-[9.5px] text-red-300 tracking-wide font-black leading-none">EARLY EXIT PENALTY</p>
                <div className="flex gap-2 mt-0.5">
                  <span className="flex items-center gap-0.5 rounded text-[9px] font-black pgs-lucky text-red-300">
                    {rewards.penaltyXP} <span className="text-[7px] text-white/40 font-bold pgs-nunito">XP</span>
                  </span>
                  <span className="flex items-center gap-0.5 rounded text-[9px] font-black pgs-lucky text-red-300">
                    {rewards.penaltyLegacy} <span className="text-[7px] text-white/40 font-bold pgs-nunito">LEGACY</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Target and Bonus side-by-side cards */}
            <div className="grid grid-cols-2 gap-2 mt-1 shrink-0">
              <div className="rounded-xl bg-black/30 border border-emerald-500/25 p-2 flex flex-col justify-between items-center text-center shadow-sm">
                <span className="text-lg animate-bounce" style={{ animationDuration: '2.5s' }}>🌿</span>
                <span className="pgs-fredoka text-[8.5px] text-white/40 tracking-widest font-black leading-none mt-0.5">XP TARGET</span>
                <div className="bg-black/60 rounded-lg px-2 py-0.5 border border-emerald-500/10 mt-1">
                  <span className="pgs-fredoka text-emerald-300 text-[9.5px] font-black">+{rewards.xp100} XP</span>
                </div>
              </div>

              <div className="rounded-xl bg-black/30 border border-purple-500/25 p-2 flex flex-col justify-between items-center text-center shadow-sm">
                <span className="text-lg animate-bounce" style={{ animationDuration: '3s', animationDelay: '0.3s' }}>🔮</span>
                <span className="pgs-fredoka text-[8.5px] text-white/40 tracking-widest font-black leading-none mt-0.5">REP BONUS</span>
                <div className="bg-black/60 rounded-lg px-2 py-0.5 border border-purple-500/10 mt-1">
                  <span className="pgs-fredoka text-purple-300 text-[9.5px] font-black">+{rewards.legacy100} LEG</span>
                </div>
              </div>
            </div>
          </div>
        </div>


      </div>

      {/* PLAY BUTTON */}
      <div className="shrink-0 flex flex-wrap justify-center items-center gap-4 py-4 z-10">
        <button onClick={onPlay}
          className="pgs-play-btn pgs-lucky px-14 py-4 rounded-full text-black text-sm uppercase tracking-wider transition-all cursor-pointer relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${config.themeColor}, ${config.themeGlow})`,
            boxShadow: `0 0 28px ${config.themeColor}80, 0 6px 20px rgba(0,0,0,.5)`,
            animation: 'pgsBounce 2.2s ease-in-out infinite',
          }}
        >
          <span className="relative z-10">🎮 LET'S PLAY!</span>
        </button>
      </div>

      {/* Workbench specs modal overlay */}
      <WorkbenchSpecsModal
        isOpen={showSpecsModal}
        onClose={() => setShowSpecsModal(false)}
        dutyType={dutyType}
      />

      {/* Apothecary Manual modal overlay */}
      <ApothecaryManualModal
        isOpen={showManualModal}
        onClose={() => setShowManualModal(false)}
      />
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────────
   WORKBENCH SPECS MODAL
   ───────────────────────────────────────────────────────────────────── */
interface WorkbenchSpecsModalProps {
  isOpen: boolean;
  onClose: () => void;
  dutyType?: string;
}

export const WorkbenchSpecsModal: React.FC<WorkbenchSpecsModalProps> = ({ isOpen, onClose, dutyType }) => {
  const [activeTab, setActiveTab] = useState<'fever' | 'cough' | 'stress' | 'stomach' | 'headache'>('fever');
  const [selectedHerb, setSelectedHerb] = useState<number | null>(null);

  if (!isOpen) return null;

  const isHerb = dutyType === 'herb' || dutyType === 'herb2';
  const currentItems = isHerb ? HERBS_BY_CAT : BAKERY_BY_CAT;
  const diagnostics = isHerb ? DIAGNOSTICS : BAKERY_DIAGNOSTICS;

  const tabList = isHerb 
    ? (['fever', 'cough', 'stress', 'stomach', 'headache'] as const)
    : (['fever', 'cough', 'stress'] as const);

  const diag = diagnostics[activeTab] || { title: 'Unknown', status: 'UNKNOWN', desc: 'No specs available.' };
  const herbs = currentItems[activeTab] || [];
  const inspectHerb = selectedHerb
    ? herbs.find((h: any) => h.id === selectedHerb)
    : null;

  const imgPath = dutyType === 'bakery'
    ? '/Assets/Ganache Grove/Games/Workbench_Bakerygame.png'
    : '/Assets/Ganache Grove/Games/Workbench_Herbalgame.png';

  return (
    <div className="fixed inset-0 z-[600] flex items-center justify-center p-6 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-6xl h-[85vh] rounded-[2.5rem] bg-gradient-to-b from-[#1a0f30] to-[#0a0518] border-2 border-amber-500/40 p-6 flex flex-col justify-between shadow-2xl relative text-white">
        
        {/* Close */}
        <button onClick={onClose}
          className="absolute top-5 right-6 z-30 w-9 h-9 rounded-full flex items-center justify-center font-black hover:scale-110 active:scale-95 transition-all cursor-pointer bg-white/5 border border-white/10"
        >✕</button>

        {/* Title */}
        <div className="shrink-0 mb-4 text-left">
          <span className="pgs-fredoka text-[9.5px] uppercase tracking-wider text-amber-400 block">Rowan's Workshop Blueprints</span>
          <h2 className="pgs-fredoka text-xl text-white mt-0.5">🛠️ Workbench Specifications</h2>
        </div>

        {/* Tab Buttons */}
        <div className="shrink-0 flex gap-2 overflow-x-auto pb-2 border-b border-white/10">
          {tabList.map(tab => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab as any); setSelectedHerb(null); }}
              className={`px-4 py-2 rounded-xl pgs-fredoka text-[11px] uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === tab 
                  ? 'bg-amber-400 text-black font-black shadow-lg shadow-amber-500/20' 
                  : 'bg-white/5 hover:bg-white/10 text-white/70'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content Pane */}
        <div className="flex-grow flex flex-col md:flex-row gap-5 overflow-hidden my-4 min-h-0">
          
          {/* Column 1: Workbench Layout Image */}
          <div className="w-full md:w-[32%] flex flex-col gap-3 min-h-0 text-left shrink-0">
            <div className="rounded-2xl p-2 bg-white/3 border border-white/5 flex flex-col items-center justify-center flex-grow overflow-hidden relative">
              <img
                src={imgPath}
                alt="Workbench Blueprint"
                className="w-full h-full object-cover rounded-xl shadow-inner"
                style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.5))' }}
              />
              <span className="absolute bottom-3 left-3 bg-black/75 px-2 py-0.5 rounded-md font-sans text-[8px] font-bold text-white/50 uppercase tracking-widest">
                Workbench Layout View
              </span>
            </div>
          </div>

          {/* Column 2: Diagnostics */}
          <div className="w-full md:w-[30%] flex flex-col gap-3 min-h-0 text-left">
            <div className="rounded-2xl p-4 bg-white/3 border border-white/5">
              <span className="text-[9px] uppercase tracking-widest font-black block text-amber-400 font-sans">Active Diagnostic Title</span>
              <h4 className="font-bold text-sm text-white font-sans mt-0.5">{diag.title}</h4>
              <div className="inline-block px-2.5 py-0.5 rounded text-[8.5px] font-black uppercase mt-2 bg-red-500/20 border border-red-500/35 text-red-300">
                STATUS: {diag.status}
              </div>
            </div>

            <div className="rounded-2xl p-4 bg-white/3 border border-white/5 flex-grow overflow-y-auto custom-scrollbar">
              <span className="text-[9px] uppercase tracking-widest font-black block text-white/40 font-sans">Diagnostic Description</span>
              <p className="font-sans text-[12.5px] text-white/80 leading-relaxed mt-1">{diag.desc}</p>
            </div>
          </div>

          {/* Column 3: Herb List & Details */}
          <div className="w-full md:w-[38%] flex flex-col gap-3 min-h-0 text-left">
            <div className="rounded-2xl p-4 bg-white/3 border border-white/5 flex flex-wrap gap-2.5 shrink-0">
              {herbs.map((h: any) => (
                <button
                  key={h.id}
                  onClick={() => setSelectedHerb(selectedHerb === h.id ? null : h.id)}
                  className={`px-3 py-2 rounded-xl flex items-center gap-2 border transition-all cursor-pointer ${
                    selectedHerb === h.id
                      ? 'bg-amber-400/15 border-amber-400 text-white'
                      : 'bg-black/30 border-white/5 hover:bg-white/5 text-white/70'
                  }`}
                >
                  <span className="text-lg">{h.emoji}</span>
                  <span className="font-sans text-xs font-bold">{h.name}</span>
                </button>
              ))}
            </div>

            {inspectHerb ? (
              <div className="rounded-2xl p-4.5 bg-yellow-500/5 border border-yellow-500/15 flex-grow overflow-y-auto custom-scrollbar space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-2.5xl">{inspectHerb.emoji}</span>
                  <div>
                    <h3 className="font-sans font-bold text-sm text-white leading-tight">{inspectHerb.name}</h3>
                    <span className="text-[10px] font-black uppercase text-yellow-400 font-sans">{inspectHerb.property}</span>
                  </div>
                </div>
                <p className="pgs-nunito text-[11px] text-white/80 leading-relaxed">{inspectHerb.description}</p>
                <div className="pt-2 border-t border-white/5 text-[10px] text-yellow-200/70 font-semibold leading-none">
                  💡 Clue: {inspectHerb.clue}
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-white/10 flex-grow flex flex-col items-center justify-center text-center p-6 text-white/35">
                <span className="text-3xl block mb-1">🔍</span>
                <p className="font-sans text-xs">Select an item above to inspect specifications.</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="shrink-0 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-sans font-black text-xs uppercase tracking-wider cursor-pointer shadow-md"
          >
            Close Workbench specifications
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────────
   APOTHECARY MANUAL MODAL
   ───────────────────────────────────────────────────────────────────── */
interface ApothecaryManualModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApothecaryManualModal: React.FC<ApothecaryManualModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[650] flex items-center justify-center p-6 bg-black/75 backdrop-blur-md animate-fade-in text-white">
      <div className="w-full max-w-3xl h-[80vh] rounded-[2.5rem] bg-gradient-to-b from-[#0f172a] to-[#020617] border-2 border-emerald-500/40 p-6 flex flex-col justify-between shadow-2xl relative">
        <button onClick={onClose}
          className="absolute top-5 right-6 z-30 w-9 h-9 rounded-full flex items-center justify-center font-black hover:scale-110 active:scale-95 transition-all cursor-pointer bg-white/5 border border-white/10"
        >✕</button>
        <div className="shrink-0 mb-4 text-left">
          <span className="font-sans text-[9px] font-black uppercase tracking-wider text-emerald-400 block">Clinic Archive</span>
          <h2 className="font-sans font-bold text-xl text-white mt-0.5">📖 Apothecary Herb Manual</h2>
        </div>
        <div className="flex-grow overflow-y-auto custom-scrollbar space-y-4 pr-1 text-left">
          {Object.entries(HERBS_BY_CAT).map(([cat, list]) => (
            <div key={cat} className="space-y-2 border-b border-white/5 pb-3">
              <span className="font-sans font-bold text-[12px] uppercase text-emerald-300 tracking-wider">Cures: {cat}</span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {list.map(h => (
                  <div key={h.id} className="p-3 rounded-2xl bg-white/3 border border-white/5 space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xl">{h.emoji}</span>
                      <span className="font-sans font-bold text-[13px] text-white">{h.name}</span>
                    </div>
                    <p className="font-sans text-[11px] text-white/55 leading-tight">{h.property}</p>
                    <p className="font-sans text-[12px] text-white/75 leading-normal mt-1 italic">"{h.description}"</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <button onClick={onClose}
          className="shrink-0 w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-sans font-black text-xs uppercase tracking-wider transition-all mt-4 text-center cursor-pointer"
        >
          Got it, Close Manual
        </button>
      </div>
    </div>
  );
};

const FUN_FACTS: Record<string, string[]> = {
  herb: [
    "Feverfew blossoms look like simple white daisies, but they have natural salicin properties to cure severe migraine tension!",
    "Frostfire Petal glows with a cool blue flame because it absorbs ambient heat to lower burning temperatures.",
    "Eucalyptus leaf oil expands blood vessels in the lungs, instantly clearing blocked airways during coughing spells.",
    "Cozy Lavender contains sweet linalool compounds that slow down a racing pulse and soothe the central nervous system.",
    "Ginger Snap Root promotes active digestion and works as a natural anti-nausea remedy in the village diner."
  ],
  bakery: [
    "Sourdough bread rises due to wild lactobacillus cultures that create healthy, bubble-filled crusts.",
    "Baking at exactly 220°C with steam injection creates the crunchiest, thinnest crust on a rye loaf.",
    "Strawberry tarts require pre-baked shells to prevent the fresh vanilla custard from making the pastry soggy."
  ],
  gear: [
    "Rowan's watermill cogs utilize sequential gear teeth ratios to multiply mechanical torque by four times!",
    "Boss gears have 24 teeth, Cogs have 16 teeth, and Tiny gears have 8 teeth. Use them strategically!"
  ]
};

export const PREGAME_CONFIGS: Record<string, PreGameConfig> = {
  gear: {
    icon: '⚙️',
    title: 'Gear Mill Challenge',
    subtitle: 'Power the old mill by locking all gears in place!',
    themeColor: '#fbbf24',
    themeGlow: '#f59e0b',
    rules: [
      'Select a gear size (Tiny, Cogs, or Boss) from the picker at the top.',
      'Click each empty shaft peg to place your selected gear on it.',
      'Fill ALL 4 shaft pegs to connect the Drive gear to the Spindle gear.',
      'Click a filled peg again to remove and replace with a different size.',
    ],
    tip: 'You can use any mix of gear sizes - just fill all the pegs!',
    rewards: { xp50: 8, xp75: 12, xp100: 18, legacy50: 1, legacy75: 2, legacy100: 2, xpCategory: 'builder', penaltyXP: -5, penaltyLegacy: -1 },
    hintCostCoins: 3,
  },
  wagon: {
    icon: '🚢',
    title: 'Canal Cargo Clear',
    subtitle: 'Slide all crates off the towpath to let the barge through!',
    themeColor: '#34d399',
    themeGlow: '#10b981',
    rules: [
      'The top row (Towpath) is blocked by cargo crates.',
      'Click a crate to drop it down into the empty ditch rows below.',
      'Clear ALL crates from the top Towpath row.',
      'The barge needs a completely clear path to reach the exit gate!',
    ],
    tip: 'Crates only fall - they cannot move sideways. Plan before tapping!',
    rewards: { xp50: 8, xp75: 12, xp100: 18, legacy50: 1, legacy75: 2, legacy100: 2, xpCategory: 'explorer', penaltyXP: -5, penaltyLegacy: -1 },
    hintCostCoins: 3,
  },
  monorail: {
    icon: '🚂',
    title: 'Signal Wire Fix',
    subtitle: 'Rotate all the tiles so the electric signal can flow!',
    themeColor: '#facc15',
    themeGlow: '#eab308',
    rules: [
      'Each tile has a wire segment that can be rotated by tapping it.',
      'Each tap rotates the wire 90° clockwise.',
      'Get all wires pointing HORIZONTALLY to complete the circuit.',
      'A yellow spark appears on correctly aligned tiles!',
    ],
    tip: 'Aligned tiles glow - use that feedback to guide your next move.',
    rewards: { xp50: 8, xp75: 13, xp100: 20, legacy50: 1, legacy75: 2, legacy100: 2, xpCategory: 'explorer', penaltyXP: -5, penaltyLegacy: -1 },
    hintCostCoins: 4,
  },
  scaffolding: {
    icon: '🏗️',
    title: 'Scaffold Stack',
    subtitle: 'Drop beams into the green zone to build the scaffold tower!',
    themeColor: '#60a5fa',
    themeGlow: '#3b82f6',
    rules: [
      'A beam slides left and right at the top of the arena.',
      'Tap the DROP button (or anywhere on the arena) to release it.',
      'The beam must land inside the green zone to count - too far left or right = collapse!',
      'Stack all beams without collapsing to complete the scaffold.',
    ],
    tip: 'The beam speeds up with difficulty. Time your drop when it\'s centered!',
    rewards: { xp50: 8, xp75: 13, xp100: 22, legacy50: 1, legacy75: 2, legacy100: 3, xpCategory: 'builder', penaltyXP: -6, penaltyLegacy: -1 },
    hintCostCoins: 3,
  },
  boiler: {
    icon: '🔥',
    title: 'Steam Boiler Control',
    subtitle: 'Keep the pressure in the safe zone for 15 steady seconds!',
    themeColor: '#fb923c',
    themeGlow: '#f97316',
    rules: [
      'The boiler pressure rises automatically over time.',
      'Press the RELEASE VALVE button to vent steam and lower pressure.',
      'Keep the pressure bar inside the GREEN ZONE for a full 15 seconds.',
      'If pressure hits 100% - BOOM! The boiler resets and you start the stable timer again.',
    ],
    tip: 'Small, frequent taps work better than waiting and panic-pressing!',
    rewards: { xp50: 8, xp75: 13, xp100: 22, legacy50: 1, legacy75: 2, legacy100: 3, xpCategory: 'healer', penaltyXP: -6, penaltyLegacy: -1 },
    hintCostCoins: 4,
  },
  steam: {
    icon: '💨',
    title: 'Pipeline Leak Patrol',
    subtitle: 'Tap each steam cloud to patch the pipe leaks!',
    themeColor: '#67e8f9',
    themeGlow: '#22d3ee',
    rules: [
      'Steam clouds are leaking from the pipeline at several points.',
      'Tap each steam cloud repeatedly to reduce its leak level to zero.',
      'The number badge on each cloud shows how many taps are needed.',
      'Seal ALL clouds to restore the pipeline! On harder levels, sealed leaks can regrow!',
    ],
    tip: 'Focus on the biggest (highest number) leaks first - they take the most taps!',
    rewards: { xp50: 8, xp75: 12, xp100: 20, legacy50: 1, legacy75: 2, legacy100: 2, xpCategory: 'healer', penaltyXP: -5, penaltyLegacy: -1 },
    hintCostCoins: 3,
  },
  bubble: {
    icon: '🫧',
    title: 'Bubble Sort Garden',
    subtitle: 'Pop the bubbles in the correct colour rainbow order!',
    themeColor: '#e879f9',
    themeGlow: '#d946ef',
    rules: [
      'Bubbles of 5 rainbow colours float around the garden.',
      'You must pop them in rainbow order: Red -> Orange -> Yellow -> Green -> Blue.',
      'Tap the CORRECT next colour to pop it and score points!',
      'Tapping the wrong colour resets your streak - stay focused!',
    ],
    tip: 'The next expected colour is always shown in the top bar - keep one eye on it!',
    rewards: { xp50: 7, xp75: 11, xp100: 18, legacy50: 1, legacy75: 1, legacy100: 2, xpCategory: 'healer', penaltyXP: -4, penaltyLegacy: -1 },
    hintCostCoins: 2,
  },
  sweep: {
    icon: '🧹',
    title: 'Dust Bunny Sweep',
    subtitle: 'Tap the falling dust bunnies before they reach the floor!',
    themeColor: '#a78bfa',
    themeGlow: '#7c3aed',
    rules: [
      'Fluffy dust bunnies fall from the ceiling at random positions.',
      'Tap each dust bunny before it hits the floor to sweep it away.',
      'Missing a bunny that touches the floor costs you a life (3 lives total).',
      'Clear all 12 bunnies before you lose all 3 lives to win!',
    ],
    tip: 'Watch the edges - bunnies like to sneak in from the corners!',
    rewards: { xp50: 7, xp75: 11, xp100: 18, legacy50: 1, legacy75: 1, legacy100: 2, xpCategory: 'builder', penaltyXP: -4, penaltyLegacy: -1 },
    hintCostCoins: 2,
  },
  plant: {
    icon: '🪴',
    title: 'Balcony Plant Waterer',
    subtitle: 'Water the thirsty plants in the correct sequence!',
    themeColor: '#4ade80',
    themeGlow: '#16a34a',
    rules: [
      'A row of potted plants is displayed, each with a thirst level bar.',
      'Tap the MOST thirsty plant (lowest water bar) to water it first.',
      'Water them in descending thirst order - thirstiest first!',
      'Water all plants correctly in sequence to make the balcony bloom!',
    ],
    tip: 'Thirst bars shrink over time, so act quickly before they all become equal!',
    rewards: { xp50: 7, xp75: 11, xp100: 18, legacy50: 1, legacy75: 1, legacy100: 2, xpCategory: 'healer', penaltyXP: -4, penaltyLegacy: -1 },
    hintCostCoins: 2,
  },
  sort: {
    icon: '🗄️',
    title: 'Pantry Sort Sprint',
    subtitle: 'Sort the pantry items into the right shelves before time runs out!',
    themeColor: '#fda4af',
    themeGlow: '#e11d48',
    rules: [
      'Items (Jars, Bakes, Herbs, Tools) appear one at a time.',
      'Each item belongs to one of 4 colour-coded shelves.',
      'Tap the correct shelf button to place the item there.',
      'Sort all items correctly before the timer hits zero!',
    ],
    tip: 'Each shelf has a matching emoji icon - memorise them in the first few seconds!',
    rewards: { xp50: 7, xp75: 11, xp100: 18, legacy50: 1, legacy75: 1, legacy100: 2, xpCategory: 'explorer', penaltyXP: -4, penaltyLegacy: -1 },
    hintCostCoins: 2,
  },
  adventure: {
    icon: '🧭',
    title: 'Ganache Grove Expedition',
    subtitle: 'Explore the forest and collect resources for the clinic!',
    themeColor: '#86efac',
    themeGlow: '#22c55e',
    rules: [
      'Navigate your explorer through the glowing forest paths.',
      'Collect herbs, spores, and forest items scattered along the way.',
      'Avoid obstacles and hazards that block your route.',
      'Reach the forest clearing within the time limit to complete the expedition!',
    ],
    tip: 'Herb nodes respawn - revisit old paths if you need more items!',
    rewards: { xp50: 10, xp75: 15, xp100: 25, legacy50: 2, legacy75: 3, legacy100: 4, xpCategory: 'explorer', penaltyXP: -7, penaltyLegacy: -1 },
    hintCostCoins: 5,
  },
  bakery: {
    icon: '🥖',
    title: 'Bakery Oven Timing',
    subtitle: 'Hit the perfect temperature windows to bake each item!',
    themeColor: '#fbbf24',
    themeGlow: '#d97706',
    rules: [
      'The oven temperature rises and falls in a wave pattern.',
      'Each pastry has a specific temperature window shown on the gauge.',
      'Press BAKE when the needle is inside the green window.',
      'Bake all items on the tray to complete your shift!',
    ],
    tip: 'Watch the wave rhythm - it\'s predictable! after 2-3 cycles!',
    rewards: { xp50: 10, xp75: 15, xp100: 25, legacy50: 2, legacy75: 3, legacy100: 4, xpCategory: 'healer', penaltyXP: -7, penaltyLegacy: -1 },
    hintCostCoins: 4,
  },
  herb: {
    icon: '🌿',
    title: 'Herb Delivery Sorting',
    subtitle: 'Sort remedy herbs into cauldrons to cure village diseases!',
    themeColor: '#4ade80',
    themeGlow: '#15803d',
    rules: [
      'A deck of 20 randomized remedy herbs is dealt one card at a time.',
      'Read the herb description, properties, and hint clue carefully.',
      'Tap/drop the herb onto the matching cauldron (Fever, Cough, Stress, Stomach, Headache).',
      'Each cauldron requires exactly 2 correct herbs to complete the recipe!',
      'Warning: Sorting incorrect herbs costs lives. Leaving any cauldron incomplete fails the task!',
    ],
    tip: 'Confusing herbs (like Feverfew or Peppermint sprigs) have tricky categories. Read the properties!',
    rewards: { xp50: 12, xp75: 18, xp100: 28, legacy50: 2, legacy75: 3, legacy100: 5, xpCategory: 'healer', penaltyXP: -8, penaltyLegacy: -2 },
    hintCostCoins: 3,
  },
  herb2: {
    icon: '🚨',
    title: 'Urgent Care Clinic — Level 2',
    subtitle: 'Elite healer challenge with doctor calls, decoys & drain pressure!',
    themeColor: '#f87171',
    themeGlow: '#b91c1c',
    rules: [
      '25 cards are dealt — 20 real herbs and 5 DECOY herbs that belong to no cauldron.',
      'Read properties AND descriptions carefully — decoys look convincing!',
      'Doctor issues URGENT CALLS every 45 seconds — prioritize that disease for +75 bonus.',
      'Cauldrons drain herbs after 90s of inactivity. Refill before they empty!',
      'Only 2 lives — every wrong drop or decoy costs you dearly. Cure at least 3 diseases.',
      'Minimum score of 200 required to pass. Partial pass: 3+ diseases cured + 200+ pts.',
    ],
    tip: '🎭 Prank clues and decoy herbs are designed to mislead — always check the property badge, not just the name or clue!',
    rewards: { xp50: 20, xp75: 30, xp100: 50, legacy50: 4, legacy75: 6, legacy100: 10, xpCategory: 'healer', penaltyXP: -15, penaltyLegacy: -4 },
    hintCostCoins: 3,
  }
};
