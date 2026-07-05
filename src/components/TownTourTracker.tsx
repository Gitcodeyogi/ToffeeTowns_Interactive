import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTTStore } from '../store/useTTStore';
import { FONT } from '../lib/uiConstants';
import { cozyAudio } from '../utils/audioHelper';
import { TownGuideModal } from './TownGuideModal';

interface SeededOpportunity {
  id: string;
  emoji: string;
  title: string;
  desc: string;
  phase: 'morning' | 'afternoon' | 'evening' | 'night';
  travelId: string;
}

const getSeededOpportunities = (daySeed: number, weather: string, mood: string, season: string): SeededOpportunity[] => {
  // Morning - Gazette
  let gazetteDesc = "Read Julie Frost's morning news bulletin about regional trade changes.";
  if (weather.includes('Rain')) {
    gazetteDesc = "Julie Frost is printing warnings about the airborne spore rain hazards. Read the Gazette.";
  } else if (weather.includes('Wind')) {
    gazetteDesc = "Julie is chasing stories about the fluttermoth migration flight paths. Read the Gazette.";
  } else if (mood.includes('Festive')) {
    gazetteDesc = "Julie is reporting live from the Clock Tower festival setup. Read the Gazette.";
  }

  // Morning - Academy
  let academyDesc = "Prof. Crumblewise is holding logic and career upgrades tests today.";
  if (season.includes('Winter')) {
    academyDesc = "Prof. Crumblewise is hosting a cozy fireplace history seminar. Visit the Academy.";
  } else if (weather.includes('Rain')) {
    academyDesc = "Researching herbal resistance to spore fevers in the library vaults. Visit the Academy.";
  }

  // Afternoon - Chores
  let choresDesc = "Polish your bedroom's vanity mirror and tidy up your companion pet's room.";
  if (weather.includes('Rain')) {
    choresDesc = "Clear the wet leaves and moss blocking your cottage porch gutters.";
  } else if (mood.includes('Quiet')) {
    choresDesc = "Stoke the eternal fireplace logs to keep Mossberry Cottage warm.";
  }

  // Afternoon - Civic Duty
  let dutyDesc = "Check the board to align gear cogs or repair canopy pathways.";
  if (mood.includes('Festive')) {
    dutyDesc = "Mortimer the Baker needs assistance stacking and decorating festival cake boxes.";
  } else if (weather.includes('Rain')) {
    dutyDesc = "Dr. Cedric requests delivery of dry herb boxes to the clinic vaults.";
  } else if (weather.includes('Wind')) {
    dutyDesc = "Rowan Thistle is clearing fallen redwood branches from monorail tracks.";
  }

  // Evening - Gossip
  let gossipDesc = "Visit Gossip Corner to chat with residents and earn standing legacy.";
  if (weather.includes('Rain')) {
    gossipDesc = "Mrs. Petalworth is hiding from rain under the awning, sharing secrets. Go talk.";
  } else if (mood.includes('Festive')) {
    gossipDesc = "Eavesdrop on the lively festival planners near the town monument.";
  }

  // Evening - Clinic
  let clinicDesc = "Assist Dr. Cedric in treating patient sneezles or cataloging herbs.";
  if (weather.includes('Rain') || weather.includes('Spore')) {
    clinicDesc = "Dr. Cedric is swamped with sneezing patients! Help prepare fever remedies.";
  }

  // Night - Council
  let councilDesc = "Propose town ordinances and check tax regulations with Sir Goldwhistle.";
  if (mood.includes('Festive')) {
    councilDesc = "Sir Goldwhistle has drafted a festival funding bill. Vote at the chambers.";
  }

  // Night - Theatre
  let theatreDesc = "Watch Junia and Pipkin rehearse the classic puppet play at the stage.";
  if (mood.includes('Festive')) {
    theatreDesc = "Watch the special festival showing of 'The Honeyberry Incident' play!";
  }

  return [
    { id: 'newspaper', emoji: '📰', title: "Read Today's Gazette", desc: gazetteDesc, phase: 'morning', travelId: 'newspaper' },
    { id: 'classroom', emoji: '🏫', title: 'Study at the Academy', desc: academyDesc, phase: 'morning', travelId: 'classroom' },
    { id: 'home', emoji: '🏡', title: 'Cottage Chores', desc: choresDesc, phase: 'afternoon', travelId: 'home' },
    { id: 'duty', emoji: '🛠️', title: 'Resolve Civic Duty', desc: dutyDesc, phase: 'afternoon', travelId: 'workshop' },
    { id: 'gossip', emoji: '🗣️', title: 'Gossip with Residents', desc: gossipDesc, phase: 'evening', travelId: 'gossip' },
    { id: 'clinic', emoji: '🏥', title: 'Help Oakenhart Clinic', desc: clinicDesc, phase: 'evening', travelId: 'health' },
    { id: 'politics', emoji: '🏛️', title: 'Vote on Council Policy', desc: councilDesc, phase: 'night', travelId: 'politics' },
    { id: 'theatre', emoji: '🎭', title: 'Watch Theatre Show', desc: theatreDesc, phase: 'night', travelId: 'theatre' },
  ];
};

interface Props {
  defaultTab?: 'today' | 'chronicle' | 'archive' | 'guide';
}

export const TownTourTracker: React.FC<Props> = ({ defaultTab = 'today' }) => {
  const {
    showTownTour,
    setShowTownTour,
    setShowTownGuide,
    tourReadNewspaper,
    tourChattedTownsfolk,
    tourVisitedTheatre,
    completedDutiesToday,
    workdayArchive,
    sleepAndCompleteWorkday,
    coins,
    worldTime,
  } = useTTStore();

  const [activeTab, setActiveTab] = useState<'today' | 'chronicle' | 'archive' | 'guide'>(defaultTab);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [isClosing, setIsClosing] = useState(false);
  const [selectedArchiveIdx, setSelectedArchiveIdx] = useState<number | null>(null);

  useEffect(() => {
    setActiveTab(defaultTab);
  }, [defaultTab]);

  if (!showTownTour && !useTTStore.getState().showTownGuide) return null;

  // Basic flags
  const isGazetteRead = tourReadNewspaper;
  const isAcademyTrained = completedDutiesToday.some(
    d => d.location === 'classroom' || d.name.toLowerCase().includes('exam') || d.name.toLowerCase().includes('classroom')
  );
  const isCottageChoreDone = completedDutiesToday.some(
    d => d.location === 'home' || 
         d.name.toLowerCase().includes('polish') || 
         d.name.toLowerCase().includes('mirror') || 
         d.name.toLowerCase().includes('hearth') || 
         d.name.toLowerCase().includes('symbol') ||
         d.name.toLowerCase().includes('postcodes') || 
         d.name.toLowerCase().includes('weight')
  );
  const isProfessionalDutyDone = completedDutiesToday.some(
    d => d.location !== 'home' && d.location !== 'classroom'
  );
  const isGossipDone = tourChattedTownsfolk;
  const isClinicDone = completedDutiesToday.some(
    d => d.location === 'health' || d.name.toLowerCase().includes('clinic') || d.name.toLowerCase().includes('remedy')
  );
  const isPoliticsDone = completedDutiesToday.some(
    d => d.location === 'politics' || d.name.toLowerCase().includes('policy') || d.name.toLowerCase().includes('council')
  );
  const isTheatreWatched = tourVisitedTheatre;

  const getStepDone = (id: string): boolean => {
    switch (id) {
      case 'newspaper': return isGazetteRead;
      case 'classroom': return isAcademyTrained;
      case 'home': return isCottageChoreDone;
      case 'duty': return isProfessionalDutyDone;
      case 'gossip': return isGossipDone;
      case 'clinic': return isClinicDone;
      case 'politics': return isPoliticsDone;
      case 'theatre': return isTheatreWatched;
      default: return false;
    }
  };

  // Seeding parameters
  const dayOfMonth = new Date().getDate();
  const dayIndex = (dayOfMonth % 10) + 1;
  
  // Emerged Weather
  const weather = 
    (dayIndex === 4 || dayIndex === 5) ? 'Spore Rain 🌧️' :
    (dayIndex === 6 || dayIndex === 7) ? 'Canopy Wind 💨' :
    (dayIndex === 8 || dayIndex === 9 || dayIndex === 10) ? 'Festive Gold 🌤️' :
    'Sunny Sky ☀️';

  // Emerged Mood
  const totalCompletedDuties = completedDutiesToday.length;
  const mood = (() => {
    if (dayIndex === 4 || dayIndex === 5) return 'Concerned 😷';
    if (dayIndex === 8 || dayIndex === 9 || dayIndex === 10) return 'Festive 🎉';
    if (dayIndex === 6 || dayIndex === 7) return 'Bustling 🦋';
    return totalCompletedDuties >= 3 ? 'Prosperous 😊' : 'Quiet 🍂';
  })();

  const getSeason = () => {
    const month = new Date().getMonth();
    if (month === 11 || month <= 1) return 'Winter ❄️';
    if (month >= 2 && month <= 4) return 'Spring 🌸';
    if (month >= 5 && month <= 7) return 'Summer ☀️';
    return 'Autumn 🍂';
  };

  const currentSeason = getSeason();
  const seededOpportunities = getSeededOpportunities(dayOfMonth, weather, mood, currentSeason);
  const totalDone = seededOpportunities.filter(s => getStepDone(s.id)).length;
  const pctDone = Math.round((totalDone / seededOpportunities.length) * 100);

  // Prosperity / Health / Culture calculations
  const prosperityPct = Math.min(100, 70 + totalCompletedDuties * 3);
  const healthPct = Math.min(100, 60 + (isClinicDone ? 15 : 0) + (weather.includes('Rain') ? -10 : 5));
  const culturePct = Math.min(100, 75 + (isTheatreWatched ? 15 : 0) + (isAcademyTrained ? 10 : 0));

  // Determine most interacted NPC based on completed tasks
  const getMostInteractedNPC = (): { name: string; avatar: string; quote: string } => {
    const hasRowan = completedDutiesToday.some(d => d.location === 'workshop' || d.name.toLowerCase().includes('gear') || d.name.toLowerCase().includes('bridge'));
    const hasCedric = completedDutiesToday.some(d => d.location === 'health' || d.name.toLowerCase().includes('clinic') || d.name.toLowerCase().includes('remedy'));
    const hasJulie = completedDutiesToday.some(d => d.location === 'newspaper' || d.name.toLowerCase().includes('gazette'));
    const hasCrumble = completedDutiesToday.some(d => d.location === 'classroom' || d.name.toLowerCase().includes('exam'));
    const hasGoldwhistle = completedDutiesToday.some(d => d.location === 'politics' || d.name.toLowerCase().includes('council') || d.name.toLowerCase().includes('mayor'));
    const hasJunia = completedDutiesToday.some(d => d.location === 'theatre' || d.name.toLowerCase().includes('play'));

    if (hasRowan) return { name: 'Rowan Thistle', avatar: '🐿️', quote: "A highly productive day! The gears are spinning smoothly and the bridges are secure. Thanks for the extra hands." };
    if (hasCedric) return { name: 'Dr. Cedric', avatar: '🩺', quote: "We managed to treat several cases of sneezles today. The apothecary stocks are restored. Good health to all." };
    if (hasJulie) return { name: 'Julie Frost', avatar: '🦊', quote: "Chasing leads and printing truths! Today's stories are filed, and tomorrow's print is looking extra juicy." };
    if (hasCrumble) return { name: 'Prof. Crumblewise', avatar: '🦉', quote: "A fine display of intellect today. The mind is a muscle, and the archives grow richer with your studies." };
    if (hasGoldwhistle) return { name: 'Sir Goldwhistle', avatar: '🎩', quote: "Ordinance votes have been logged. The municipal budget balances, and Ganache Grove's civic order remains firm." };
    if (hasJunia) return { name: 'Junia Frostwell', avatar: '🦄', quote: "The curtain fell to loud applause! The local theater scene is thriving, and the box office is warm." };
    
    return { name: 'Mrs. Petalworth', avatar: '👵', quote: "Oh, what a lovely day in the Grove! A quiet stroll, a shared secret, and the town feels warmer already." };
  };

  const activeNPC = getMostInteractedNPC();

  const handleClose = () => {
    cozyAudio.playClick();
    setShowTownTour(false);
    setShowTownGuide(false);
  };

  const handleQuickTravel = (subPageId: string) => {
    cozyAudio.playClick();
    window.dispatchEvent(new CustomEvent('tt_change_subpage', { detail: subPageId }));
    useTTStore.getState().setPage('desk');
    setShowTownTour(false);
    setShowTownGuide(false);
  };

  const handleRetire = () => {
    cozyAudio.playClick();
    setIsClosing(true);
    setTimeout(() => {
      sleepAndCompleteWorkday();
      setIsClosing(false);
      setShowTownTour(false);
      setShowTownGuide(false);
    }, 1800);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setMousePos({ x, y });
  };

  const tabRibbons = [
    { key: 'today', label: '🌅 Today', color: 'bg-rose-500 hover:bg-rose-400', left: '12%' },
    { key: 'chronicle', label: '📜 Chronicle', color: 'bg-amber-500 hover:bg-amber-400', left: '32%' },
    { key: 'archive', label: '📚 Archive', color: 'bg-emerald-500 hover:bg-emerald-400', left: '52%' },
    { key: 'guide', label: '🗺 Guide', color: 'bg-sky-500 hover:bg-sky-400', left: '72%' }
  ];

  const getWaxSealColor = (day: number) => {
    const idx = (day % 10) + 1;
    if (idx === 8 || idx === 9 || idx === 10) return 'text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]'; // Festival
    if (idx === 4 || idx === 5) return 'text-sky-400 drop-shadow-[0_0_8px_rgba(56,189,248,0.5)]'; // Stormy
    return 'text-amber-700 drop-shadow-[0_0_8px_rgba(180,83,9,0.3)]'; // Normal
  };

  // Decorative corners based on tab
  const getCornerIcons = () => {
    if (activeTab === 'today') return { tl: '🧭', br: '⏳' };
    if (activeTab === 'chronicle') return { tl: '✒️', br: '🪶' };
    if (activeTab === 'archive') return { tl: '📖', br: '🔑' };
    return { tl: '📜', br: '🔭' };
  };

  const corners = getCornerIcons();

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in text-left select-none font-sans" onMouseMove={handleMouseMove}>
      
      {/* Typewriter animations & ladybug movements */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes walkBug {
          0% { transform: translate(50px, 480px) rotate(45deg); opacity: 0; }
          5% { opacity: 0.85; }
          45% { transform: translate(480px, 200px) rotate(40deg); }
          50% { transform: translate(480px, 200px) rotate(160deg); }
          95% { transform: translate(250px, 600px) rotate(155deg); opacity: 0.85; }
          100% { transform: translate(150px, 750px) rotate(150deg); opacity: 0; }
        }
        .animate-ladybug {
          animation: walkBug 45s linear infinite;
          animation-delay: 8s;
        }
        @keyframes floatParticles {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0.15; }
          50% { transform: translateY(-15px) scale(1.08); opacity: 0.35; }
        }
        .animate-float-particle {
          animation: floatParticles 8s ease-in-out infinite;
        }
        @keyframes glowPulse {
          0%, 100% { filter: drop-shadow(0 0 4px rgba(245,158,11,0.25)); }
          50% { filter: drop-shadow(0 0 12px rgba(245,158,11,0.55)); }
        }
        .animate-glow-pulse {
          animation: glowPulse 3s ease-in-out infinite;
        }
        @keyframes ttJournalJump {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-4px); }
        }
        .animate-journal-jump {
          animation: ttJournalJump 2.8s ease-in-out infinite;
        }
      `}} />

      <motion.div
        initial={{ scale: 0.94, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.94, opacity: 0, y: 15 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="w-full max-w-5xl h-[86vh] max-h-[86vh] border border-white/20 bg-neutral-950/65 rounded-[2.5rem] p-6 shadow-[0_25px_65px_rgba(0,0,0,0.85)] flex flex-col justify-between relative overflow-hidden backdrop-blur-md"
      >
        {/* Layer 1: Ambient Background Gradients */}
        <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/5 via-transparent to-cyan-500/5 pointer-events-none z-0" />
        
        {/* Layer 2: Floating Particle Systems */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white/20 animate-float-particle pointer-events-none -z-10"
            style={{
              width: Math.random() * 3.5 + 2,
              height: Math.random() * 3.5 + 2,
              top: `${Math.random() * 80 + 10}%`,
              left: `${Math.random() * 80 + 10}%`,
              animationDelay: `${i * 1.2}s`,
              animationDuration: `${7 + Math.random() * 5}s`
            }}
          />
        ))}

        {/* Layer 3: Crystal Glass Glare reflection (linked to mouse pointer) */}
        <div 
          className="absolute inset-0 pointer-events-none z-40 rounded-[2.5rem] mix-blend-overlay transition-all duration-100" 
          style={{
            backgroundImage: `radial-gradient(circle at ${mousePos.x * 100}% ${mousePos.y * 100}%, rgba(255,255,255,0.06) 0%, transparent 60%)`
          }}
        />

        {/* Layer 4: Wandering Ladybug Surprises */}
        <div className="absolute pointer-events-none z-40 text-xs animate-ladybug select-none">🐞</div>

        {/* Layer 5: Bookmark Ribbons */}
        <div className="absolute top-0 left-0 right-0 h-10 pointer-events-auto z-30">
          {tabRibbons.map(rib => {
            const isActive = activeTab === rib.key;
            return (
              <button
                key={rib.key}
                onClick={() => { cozyAudio.playClick(); setActiveTab(rib.key as any); }}
                className={`absolute w-24 text-[10.5px] font-black uppercase text-black text-center pt-2 pb-4 rounded-b-2xl shadow-lg border-x border-b border-black/20 select-none cursor-pointer transition-all duration-300 hover:rotate-[1.5deg] hover:scale-105 ${rib.color} ${
                  isActive ? 'h-14 -translate-y-0.5 scale-105 filter brightness-110 z-30' : 'h-10 -translate-y-2 hover:translate-y-0 opacity-75 z-20'
                }`}
                style={{ left: rib.left }}
              >
                {rib.label.split(' ')[0]}
                <span className="block text-[7.5px] tracking-tight opacity-75">{rib.label.split(' ')[1]}</span>
              </button>
            );
          })}
        </div>

        {/* Header Block */}
        <div className="flex justify-between items-end shrink-0 pb-3 border-b border-white/10 mt-6 z-10">
          <div>
            <div className="flex items-center gap-1.5 text-[8.5px] font-black uppercase tracking-[0.25em] text-neutral-400">
              <span>📖 Resident Journal</span>
              <span>·</span>
              <span className="text-amber-400 animate-pulse">Ganache Grove Chronicle</span>
            </div>
            <h2 className="text-lg md:text-xl font-brand text-white uppercase mt-0.5 tracking-wider flex items-center" style={{ fontFamily: FONT }}>
              {"🌞 A Day in Ganache Grove".split('').map((char, index) => (
                <span
                  key={index}
                  className="inline-block animate-journal-jump hover:text-yellow-300 transition-colors duration-200"
                  style={{ animationDelay: `${index * 0.04}s` }}
                >
                  {char === ' ' ? '\u00A0' : char}
                </span>
              ))}
            </h2>
          </div>

          <div className="flex items-center gap-4 text-[10px] font-mono text-white/50 bg-white/5 border border-white/5 px-3 py-1 rounded-2xl">
            <div>
              Cycle <span className="text-white font-bold">12</span> · Pulse <span className="text-white font-bold">{10 + (dayOfMonth % 15)}</span>
            </div>
            <div className="w-px h-3.5 bg-white/15" />
            <div className="flex items-center gap-1">
              <span>{worldTime.emoji}</span>
              <span className="text-white font-bold uppercase">{worldTime.label}</span>
            </div>
          </div>
        </div>

        {/* Decorative Watermark Icons on book corners */}
        <div className="absolute top-16 left-6 text-2xl opacity-10 pointer-events-none z-0">{corners.tl}</div>
        <div className="absolute bottom-6 right-6 text-2xl opacity-10 pointer-events-none z-0">{corners.br}</div>

        {/* Page Area (Double Page Layout) */}
        <div className="flex-1 my-4 flex flex-col md:flex-row gap-6 overflow-hidden min-h-0 z-10 relative">
          <AnimatePresence mode="wait">
            
            {/* TAB: TODAY (Opportunities & Mood) */}
            {activeTab === 'today' && (
              <motion.div
                key="today-tab"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12 }}
                transition={{ duration: 0.2 }}
                className="w-full h-full flex flex-col md:flex-row gap-6 overflow-hidden"
              >
                {/* LEFT PAGE: Opportunities list */}
                <div className="flex-1 flex flex-col justify-between overflow-y-auto pr-2 custom-scrollbar min-w-0">
                  <div className="space-y-4">
                    <div className="border-b border-white/5 pb-2">
                      <h3 className="text-sm font-black text-amber-300 uppercase tracking-wider">🌿 Today's Opportunities</h3>
                      <p className="text-[10px] text-neutral-400">Randomized daily events that shape the grove.</p>
                    </div>

                    <div className="space-y-4">
                      {/* Morning */}
                      <div className="space-y-2">
                        <span className="text-[9px] font-black uppercase tracking-widest text-neutral-400 flex items-center gap-1.5">
                          🌅 Morning
                        </span>
                        <div className="grid grid-cols-1 gap-2.5">
                          {seededOpportunities.filter(o => o.phase === 'morning').map(item => {
                            const isDone = getStepDone(item.id);
                            return (
                              <div key={item.id} className={`p-3 rounded-2xl border flex items-center justify-between gap-3 text-white transition-all duration-200 ${
                                isDone ? 'bg-neutral-950/15 border-emerald-500/10 opacity-60' : 'bg-black/25 border-white/5 hover:border-white/10'
                              }`}>
                                <div className="flex items-start gap-2.5">
                                  <span className="text-xl p-1 bg-white/5 border border-white/5 rounded-xl shrink-0">{item.emoji}</span>
                                  <div>
                                    <span className={`text-[11.5px] font-bold block ${isDone ? 'line-through text-white/35' : 'text-white'}`}>{item.title}</span>
                                    <p className="text-[9.5px] text-white/45 mt-0.5 leading-relaxed">{item.desc}</p>
                                  </div>
                                </div>
                                {!isDone && (
                                  <button onClick={() => handleQuickTravel(item.travelId)} className="px-2.5 py-1 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-[9px] uppercase font-black tracking-wider rounded-lg transition shrink-0 cursor-pointer">
                                    📍 Visit
                                  </button>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Afternoon */}
                      <div className="space-y-2">
                        <span className="text-[9px] font-black uppercase tracking-widest text-neutral-400 flex items-center gap-1.5">
                          ☀️ Afternoon
                        </span>
                        <div className="grid grid-cols-1 gap-2.5">
                          {seededOpportunities.filter(o => o.phase === 'afternoon').map(item => {
                            const isDone = getStepDone(item.id);
                            return (
                              <div key={item.id} className={`p-3 rounded-2xl border flex items-center justify-between gap-3 text-white transition-all duration-200 ${
                                isDone ? 'bg-neutral-950/15 border-emerald-500/10 opacity-60' : 'bg-black/25 border-white/5 hover:border-white/10'
                              }`}>
                                <div className="flex items-start gap-2.5">
                                  <span className="text-xl p-1 bg-white/5 border border-white/5 rounded-xl shrink-0">{item.emoji}</span>
                                  <div>
                                    <span className={`text-[11.5px] font-bold block ${isDone ? 'line-through text-white/35' : 'text-white'}`}>{item.title}</span>
                                    <p className="text-[9.5px] text-white/45 mt-0.5 leading-relaxed">{item.desc}</p>
                                  </div>
                                </div>
                                {!isDone && (
                                  <button onClick={() => handleQuickTravel(item.travelId)} className="px-2.5 py-1 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-[9px] uppercase font-black tracking-wider rounded-lg transition shrink-0 cursor-pointer">
                                    📍 Visit
                                  </button>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Evening & Night */}
                      <div className="space-y-2">
                        <span className="text-[9px] font-black uppercase tracking-widest text-neutral-400 flex items-center gap-1.5">
                          🌇 Dusk &amp; Night
                        </span>
                        <div className="grid grid-cols-1 gap-2.5">
                          {seededOpportunities.filter(o => o.phase === 'evening' || o.phase === 'night').map(item => {
                            const isDone = getStepDone(item.id);
                            return (
                              <div key={item.id} className={`p-3 rounded-2xl border flex items-center justify-between gap-3 text-white transition-all duration-200 ${
                                isDone ? 'bg-neutral-950/15 border-emerald-500/10 opacity-60' : 'bg-black/25 border-white/5 hover:border-white/10'
                              }`}>
                                <div className="flex items-start gap-2.5">
                                  <span className="text-xl p-1 bg-white/5 border border-white/5 rounded-xl shrink-0">{item.emoji}</span>
                                  <div>
                                    <span className={`text-[11.5px] font-bold block ${isDone ? 'line-through text-white/35' : 'text-white'}`}>{item.title}</span>
                                    <p className="text-[9.5px] text-white/45 mt-0.5 leading-relaxed">{item.desc}</p>
                                  </div>
                                </div>
                                {!isDone && (
                                  <button onClick={() => handleQuickTravel(item.travelId)} className="px-2.5 py-1 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-[9px] uppercase font-black tracking-wider rounded-lg transition shrink-0 cursor-pointer">
                                    📍 Visit
                                  </button>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* SPINE DIVIDER */}
                <div className="hidden md:block w-px bg-gradient-to-b from-white/5 via-white/15 to-white/5 relative" />

                {/* RIGHT PAGE: Status, Mood, Town Improvements */}
                <div className="flex-1 flex flex-col justify-between overflow-y-auto pr-2 custom-scrollbar min-w-0">
                  <div className="space-y-5">
                    <div className="border-b border-white/5 pb-2">
                      <h3 className="text-sm font-black text-amber-300 uppercase tracking-wider">🏡 Town Standing &amp; Ambient</h3>
                      <p className="text-[10px] text-neutral-400 font-medium">Emerging statistics of Ganache Grove.</p>
                    </div>

                    {/* Mood Card */}
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1.5 relative overflow-hidden">
                      <div className="absolute inset-0 bg-amber-500/[0.02] pointer-events-none" />
                      <span className="text-[8px] font-black uppercase text-amber-400 tracking-wider">Town Mood today</span>
                      <h4 className="text-sm font-black text-white">{mood}</h4>
                      <p className="text-[10px] text-white/60 leading-relaxed">
                        {mood.includes('Concerned') && "Spore rain warnings are active. Residents are staying indoors, coughing and sipping remedies."}
                        {mood.includes('Festive') && "Lanterns are lit across central avenues. The sweet baking scents draw travelers."}
                        {mood.includes('Bustling') && "Fluttermoths fill the skies, and local cargo lines are packed with transit courier cargo wagons."}
                        {mood.includes('Prosperous') && " Walkways are clean, local budgets balance, and commerce flows smoothly. Cheerful vibes!"}
                        {mood.includes('Quiet') && "A peaceful slow day in Mossberry woods. Only the wind blowing redwood leaves."}
                      </p>
                    </div>

                    {/* Town Metrics Progress Bars */}
                    <div className="space-y-4 pt-1">
                      <span className="text-[8.5px] font-black uppercase tracking-wider text-neutral-400">County Development Indicators</span>
                      
                      {/* Prosperity Bar */}
                      <div className="space-y-1 font-sans">
                        <div className="flex justify-between text-[9.5px]">
                          <span className="text-white font-bold">🌱 Prosperity Level</span>
                          <span className="text-amber-400 font-bold">{prosperityPct}%</span>
                        </div>
                        <div className="w-full h-2.5 bg-neutral-950/70 border border-white/5 rounded-full overflow-hidden p-0.5 shadow-inner">
                          <div className="h-full rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 shadow-[0_0_8px_rgba(245,158,11,0.5)] transition-all duration-500" style={{ width: `${prosperityPct}%` }} />
                        </div>
                        <p className="text-[7.5px] text-neutral-400 block tracking-tight">Increases per duty finished. Drives regional cargo and trade tariffs.</p>
                      </div>

                      {/* Health Bar */}
                      <div className="space-y-1 font-sans">
                        <div className="flex justify-between text-[9.5px]">
                          <span className="text-white font-bold">❤️ Health Standing</span>
                          <span className="text-cyan-400 font-bold">{healthPct}%</span>
                        </div>
                        <div className="w-full h-2.5 bg-neutral-950/70 border border-white/5 rounded-full overflow-hidden p-0.5 shadow-inner">
                          <div className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-sky-400 shadow-[0_0_8px_rgba(6,182,212,0.5)] transition-all duration-500" style={{ width: `${healthPct}%` }} />
                        </div>
                        <p className="text-[7.5px] text-neutral-400 block tracking-tight">Apothecary health rating. Influenced by weather sneezles and clinic help.</p>
                      </div>

                      {/* Culture Bar */}
                      <div className="space-y-1 font-sans">
                        <div className="flex justify-between text-[9.5px]">
                          <span className="text-white font-bold">🎭 Culture &amp; Art</span>
                          <span className="text-purple-400 font-bold">{culturePct}%</span>
                        </div>
                        <div className="w-full h-2.5 bg-neutral-950/70 border border-white/5 rounded-full overflow-hidden p-0.5 shadow-inner">
                          <div className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-400 shadow-[0_0_8px_rgba(168,85,247,0.5)] transition-all duration-500" style={{ width: `${culturePct}%` }} />
                        </div>
                        <p className="text-[7.5px] text-neutral-400 block tracking-tight">Town cultural standing. Boosted by study tests and theatre attendance.</p>
                      </div>
                    </div>
                  </div>

                  {/* Quick summary notice */}
                  <div className="text-[8px] text-neutral-400 font-mono border-t border-white/5 pt-3 text-center italic mt-4">
                    "Every civic chore done leaves Ganache Grove slightly warmer tomorrow."
                  </div>
                </div>
              </motion.div>
            )}
               {/* TAB: CHRONICLE (Accomplishments, Incompletes, Events, Sector logs) */}
            {activeTab === 'chronicle' && (
              <motion.div
                key="chronicle-tab"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12 }}
                transition={{ duration: 0.2 }}
                className="w-full h-full flex flex-col md:flex-row gap-6 overflow-hidden text-left"
              >
                {/* LEFT PAGE: Incomplete & Recent Events */}
                <div className="flex-1 flex flex-col justify-between overflow-y-auto pr-2 custom-scrollbar min-w-0">
                  <div className="space-y-6">
                    {/* Section 1: Incomplete Chores from Previous */}
                    <div className="space-y-3">
                      <div className="border-b border-white/5 pb-1">
                        <h3 className="text-xs font-black text-rose-300 uppercase tracking-widest flex items-center gap-1.5">
                          <span>⏳</span> Incomplete Tasks (Previous Days)
                        </h3>
                        <p className="text-[9px] text-neutral-400 font-sans">Routines that require your urgent focus.</p>
                      </div>
                      
                      <div className="space-y-2 font-sans">
                        <div className="p-2.5 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center justify-between">
                          <div>
                            <span className="text-[11.5px] font-bold text-rose-200 block">Regulate Steam Boiler Pressure</span>
                            <span className="text-[8px] text-neutral-400 uppercase font-mono">Location: Oakenhart Clinic</span>
                          </div>
                          <span className="px-2 py-0.5 bg-rose-500/20 border border-rose-500/40 text-rose-300 text-[8px] font-bold uppercase rounded-md">Pending</span>
                        </div>
                        <div className="p-2.5 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center justify-between">
                          <div>
                            <span className="text-[11.5px] font-bold text-rose-200 block">Stack Timber Scaffolding</span>
                            <span className="text-[8px] text-neutral-400 uppercase font-mono">Location: Walkways</span>
                          </div>
                          <span className="px-2 py-0.5 bg-rose-500/20 border border-rose-500/40 text-rose-300 text-[8px] font-bold uppercase rounded-md">Pending</span>
                        </div>
                        <div className="p-2.5 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center justify-between">
                          <div>
                            <span className="text-[11.5px] font-bold text-rose-200 block">Dust Bunny Sweep</span>
                            <span className="text-[8px] text-neutral-400 uppercase font-mono">Location: Cottage Hallways</span>
                          </div>
                          <span className="px-2 py-0.5 bg-rose-500/20 border border-rose-500/40 text-rose-300 text-[8px] font-bold uppercase rounded-md">Pending</span>
                        </div>
                      </div>
                    </div>

                    {/* Section 2: Important Events Participated */}
                    <div className="space-y-3">
                      <div className="border-b border-white/5 pb-1">
                        <h3 className="text-xs font-black text-cyan-300 uppercase tracking-widest flex items-center gap-1.5">
                          <span>🏆</span> Recent Important Events
                        </h3>
                        <p className="text-[9px] text-neutral-400 font-sans">Milestone events you participated in recently.</p>
                      </div>

                      <div className="space-y-2 font-sans">
                        <div className="p-2.5 bg-cyan-500/10 border border-cyan-500/20 rounded-xl flex items-center justify-between">
                          <div>
                            <span className="text-[11.5px] font-bold text-cyan-200 block">Ganache Grove Autumn Festival</span>
                            <span className="text-[8px] text-cyan-400/70 block mt-0.5">Assisted Mortimer with the baking ovens &amp; pastry stacks</span>
                          </div>
                          <span className="px-2 py-0.5 bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-[8px] font-bold uppercase rounded-md">Attended</span>
                        </div>
                        <div className="p-2.5 bg-cyan-500/10 border border-cyan-500/20 rounded-xl flex items-center justify-between">
                          <div>
                            <span className="text-[11.5px] font-bold text-cyan-200 block">Clock Tower Mechanical Calibration</span>
                            <span className="text-[8px] text-cyan-400/70 block mt-0.5">Helped realign Rowan's brass gear pinions</span>
                          </div>
                          <span className="px-2 py-0.5 bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-[8px] font-bold uppercase rounded-md">Attended</span>
                        </div>
                        <div className="p-2.5 bg-cyan-500/10 border border-cyan-500/20 rounded-xl flex items-center justify-between">
                          <div>
                            <span className="text-[11.5px] font-bold text-cyan-200 block">The Great Chocolate Canal Audit</span>
                            <span className="text-[8px] text-cyan-400/70 block mt-0.5">Reviewed Ledgers with Senior Auditor Sir Goldwhistle</span>
                          </div>
                          <span className="px-2 py-0.5 bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-[8px] font-bold uppercase rounded-md">Attended</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* SPINE DIVIDER */}
                <div className="hidden md:block w-px bg-gradient-to-b from-white/5 via-white/15 to-white/5 relative" />

                {/* RIGHT PAGE: Top 3 Activities per Page/Sector */}
                <div className="flex-1 flex flex-col justify-between overflow-y-auto pr-2 custom-scrollbar min-w-0">
                  <div className="space-y-4">
                    <div className="border-b border-white/5 pb-2">
                      <h3 className="text-sm font-black text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                        <span>🌳</span> Activities &amp; Logs (Top 3)
                      </h3>
                      <p className="text-[10px] text-neutral-400 font-sans">Recent logs from each county sector.</p>
                    </div>

                    <div className="space-y-4 font-sans max-h-[52vh] overflow-y-auto pr-1 custom-scrollbar">
                      {/* Clinic Card */}
                      <div className="p-3 bg-white/5 border border-white/10 rounded-2xl space-y-2">
                        <span className="text-[9.5px] font-black uppercase text-rose-300 tracking-wider flex items-center gap-1">🩺 Clinic &amp; Apothecary</span>
                        <ul className="text-[10.5px] space-y-1 text-neutral-300 list-decimal list-inside">
                          <li>Prepared Fever Remedy <span className="text-emerald-400 text-[8px] font-bold uppercase ml-1">(Done)</span></li>
                          <li>Catalogued Spore Herbs <span className="text-emerald-400 text-[8px] font-bold uppercase ml-1">(Done)</span></li>
                          <li>Restored Apothecary Stocks <span className="text-rose-400 text-[8px] font-bold uppercase ml-1">(Pending)</span></li>
                        </ul>
                      </div>

                      {/* Trade & Economy Card */}
                      <div className="p-3 bg-white/5 border border-white/10 rounded-2xl space-y-2">
                        <span className="text-[9.5px] font-black uppercase text-amber-300 tracking-wider flex items-center gap-1">⚖️ Trade &amp; Economy</span>
                        <ul className="text-[10.5px] space-y-1 text-neutral-300 list-decimal list-inside">
                          <li>Balanced Harbor Ledger <span className="text-emerald-400 text-[8px] font-bold uppercase ml-1">(Done)</span></li>
                          <li>Audited Quota Taxes <span className="text-emerald-400 text-[8px] font-bold uppercase ml-1">(Done)</span></li>
                          <li>Cleared Caravan Towpath <span className="text-emerald-400 text-[8px] font-bold uppercase ml-1">(Done)</span></li>
                        </ul>
                      </div>

                      {/* Town Hall & Politics Card */}
                      <div className="p-3 bg-white/5 border border-white/10 rounded-2xl space-y-2">
                        <span className="text-[9.5px] font-black uppercase text-blue-300 tracking-wider flex items-center gap-1">🏛️ Town Hall &amp; Politics</span>
                        <ul className="text-[10.5px] space-y-1 text-neutral-300 list-decimal list-inside">
                          <li>Voted on Festival Funding <span className="text-emerald-400 text-[8px] font-bold uppercase ml-1">(Done)</span></li>
                          <li>Authorized Metal Quotas <span className="text-emerald-400 text-[8px] font-bold uppercase ml-1">(Done)</span></li>
                          <li>Audited Geothermal Safety <span className="text-rose-400 text-[8px] font-bold uppercase ml-1">(Pending)</span></li>
                        </ul>
                      </div>

                      {/* Gossip & Community Card */}
                      <div className="p-3 bg-white/5 border border-white/10 rounded-2xl space-y-2">
                        <span className="text-[9.5px] font-black uppercase text-purple-300 tracking-wider flex items-center gap-1">🗣️ Gossip &amp; Community</span>
                        <ul className="text-[10.5px] space-y-1 text-neutral-300 list-decimal list-inside">
                          <li>Exchanged Secrets at Corner <span className="text-emerald-400 text-[8px] font-bold uppercase ml-1">(Done)</span></li>
                          <li>Uncovered Satchel Mystery <span className="text-emerald-400 text-[8px] font-bold uppercase ml-1">(Done)</span></li>
                          <li>Eavesdropped on Planners <span className="text-rose-400 text-[8px] font-bold uppercase ml-1">(Pending)</span></li>
                        </ul>
                      </div>

                      {/* Sheriff Office Card */}
                      <div className="p-3 bg-white/5 border border-white/10 rounded-2xl space-y-2">
                        <span className="text-[9.5px] font-black uppercase text-teal-300 tracking-wider flex items-center gap-1">🤠 Sheriff Office</span>
                        <ul className="text-[10.5px] space-y-1 text-neutral-300 list-decimal list-inside">
                          <li>Investigated Cargo Theft <span className="text-emerald-400 text-[8px] font-bold uppercase ml-1">(Done)</span></li>
                          <li>Patrolled Canopy Pathways <span className="text-emerald-400 text-[8px] font-bold uppercase ml-1">(Done)</span></li>
                          <li>Verified Gate Audits <span className="text-emerald-400 text-[8px] font-bold uppercase ml-1">(Done)</span></li>
                        </ul>
                      </div>

                      {/* Games & Leisure Card */}
                      <div className="p-3 bg-white/5 border border-white/10 rounded-2xl space-y-2">
                        <span className="text-[9.5px] font-black uppercase text-orange-350 tracking-wider flex items-center gap-1">🎮 Games &amp; Leisure</span>
                        <ul className="text-[10.5px] space-y-1 text-neutral-300 list-decimal list-inside">
                          <li>Played Bubble Sort <span className="text-emerald-400 text-[8px] font-bold uppercase ml-1">(Done)</span></li>
                          <li>Cleaned Molasses Pots <span className="text-rose-400 text-[8px] font-bold uppercase ml-1">(Pending)</span></li>
                          <li>Visited Baking Oven Shift <span className="text-emerald-400 text-[8px] font-bold uppercase ml-1">(Done)</span></li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/10 shrink-0 text-center flex items-center justify-between mt-2 font-sans">
                    <span className="text-[8px] text-neutral-400 italic">"Every chore logged warms Ganache Grove."</span>
                    <button
                      onClick={handleClose}
                      className="px-3.5 py-1.5 bg-neutral-900 border border-white/10 text-white hover:text-yellow-400 text-[9.5px] font-black uppercase tracking-wider rounded-lg transition cursor-pointer"
                    >
                      Close Journal
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB: ARCHIVE (Previous Days) */}
            {activeTab === 'archive' && (
              <motion.div
                key="archive-tab"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12 }}
                transition={{ duration: 0.2 }}
                className="w-full h-full flex flex-col md:flex-row gap-6 overflow-hidden"
              >
                {/* LEFT PAGE: Archive List */}
                <div className="flex-1 flex flex-col justify-between overflow-y-auto pr-2 custom-scrollbar min-w-0">
                  <div className="space-y-4">
                    <div className="border-b border-white/5 pb-2">
                      <h3 className="text-sm font-black text-amber-300 uppercase tracking-wider">📚 Chronicles Archive</h3>
                      <p className="text-[10px] text-neutral-400">Past completed ledger workdays record.</p>
                    </div>

                    <div className="space-y-2">
                      {workdayArchive.length === 0 ? (
                        <div className="p-8 text-center bg-white/5 border border-white/5 rounded-2xl italic text-xs text-neutral-400">
                          The archives are currently empty. Complete workdays to see past stamps.
                        </div>
                      ) : (
                        [...workdayArchive].reverse().map((entry: any, idx: number) => {
                          const originalIdx = workdayArchive.length - 1 - idx;
                          const isSelected = selectedArchiveIdx === originalIdx;

                          return (
                            <button
                              key={idx}
                              onClick={() => { cozyAudio.playClick(); setSelectedArchiveIdx(originalIdx); }}
                              className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all duration-200 cursor-pointer ${
                                isSelected ? 'bg-white/10 border-white/20' : 'bg-black/25 border-white/5 hover:border-white/10'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <span className={`text-xl ${getWaxSealColor(entry.dayNumber)}`}>🟨</span>
                                <div>
                                  <span className="text-[11.5px] font-bold block text-white">Workday Day {entry.dayNumber}</span>
                                  <span className="text-[8px] text-neutral-400 font-mono block tracking-wider mt-0.5">{entry.dateStr}</span>
                                </div>
                              </div>
                              <span className="text-[9px] font-bold text-neutral-400">Inspect →</span>
                            </button>
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>

                {/* SPINE DIVIDER */}
                <div className="hidden md:block w-px bg-gradient-to-b from-white/5 via-white/15 to-white/5 relative" />

                {/* RIGHT PAGE: Selected Archive Inspector */}
                <div className="flex-1 flex flex-col justify-between overflow-y-auto pr-2 custom-scrollbar min-w-0">
                  {selectedArchiveIdx !== null && workdayArchive[selectedArchiveIdx] ? (
                    (() => {
                      const entry = workdayArchive[selectedArchiveIdx];
                      return (
                        <div className="space-y-4">
                          <div className="border-b border-white/5 pb-2">
                            <h3 className="text-sm font-brand text-white uppercase" style={{ fontFamily: FONT }}>🔍 Day {entry.dayNumber} Stats</h3>
                            <span className="text-[9px] font-mono text-neutral-400 font-bold block mt-0.5">{entry.dateStr}</span>
                          </div>

                          <div className="p-4 bg-white/5 border border-white/5 rounded-2xl space-y-3 text-xs font-sans">
                            <div className="flex justify-between items-center text-[11px]">
                              <span className="text-neutral-400">Total Coins Earned:</span>
                              <span className="text-yellow-400 font-bold font-mono">🪙 {entry.totalCoins}</span>
                            </div>
                            <div className="flex justify-between items-center text-[11px]">
                              <span className="text-neutral-400">Standing Legacy Earned:</span>
                              <span className="text-amber-400 font-bold font-mono">🎖️ {entry.totalLegacy}</span>
                            </div>
                            <div className="flex justify-between items-center text-[11px]">
                              <span className="text-neutral-400">Prosperity Contribution:</span>
                              <span className="text-emerald-400 font-bold font-mono">+{entry.prosperityGain || 0}%</span>
                            </div>

                            <div className="h-px bg-white/5" />

                            <span className="text-[9px] font-black uppercase text-neutral-400 block tracking-wider">Duties Resolved</span>
                            <div className="space-y-2">
                              {entry.duties.map((d: any, i: number) => (
                                <div key={i} className="flex justify-between items-center text-[10px] pl-1 border-l border-white/10">
                                  <span className="text-white font-medium truncate max-w-[150px]">{d.name}</span>
                                  <span className="text-emerald-400 font-bold font-mono">+{d.coins} 🪙</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    })()
                  ) : (
                    <div className="h-full flex items-center justify-center p-6 text-center text-xs text-neutral-400 italic">
                      Select a historical journal workday from the archive page to inspect its standing logs.
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* TAB: GUIDE (Travel Map & Scout info) */}
            {activeTab === 'guide' && (
              <motion.div
                key="guide-tab"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12 }}
                transition={{ duration: 0.2 }}
                className="w-full h-full flex flex-col md:flex-row gap-6 overflow-hidden"
              >
                {/* LEFT PAGE: Embedded Interactive Guide Map */}
                <div className="flex-1 h-full min-w-0">
                  <div className="h-full w-full">
                    <TownGuideModal embedMode={true} />
                  </div>
                </div>

                {/* SPINE DIVIDER */}
                <div className="hidden md:block w-px bg-gradient-to-b from-white/5 via-white/15 to-white/5 relative" />

                {/* RIGHT PAGE: Scout ledger & schedule */}
                <div className="flex-1 flex flex-col justify-between overflow-y-auto pr-2 custom-scrollbar min-w-0">
                  <div className="space-y-4">
                    <div className="border-b border-white/5 pb-2">
                      <h3 className="text-sm font-black text-amber-300 uppercase tracking-wider">🗺️ Scout Ledger &amp; Sights</h3>
                      <p className="text-[10px] text-neutral-400 font-medium font-sans">Active town parameters and schedules.</p>
                    </div>

                    <div className="p-4 bg-white/5 border border-white/5 rounded-2xl space-y-2.5 text-xs text-left font-sans">
                      <div className="flex justify-between items-center text-[10.5px]">
                        <span className="text-neutral-400">Position Sector:</span>
                        <span className="text-white font-bold">Ganache Grove</span>
                      </div>
                      <div className="flex justify-between items-center text-[10.5px]">
                        <span className="text-neutral-400">Season:</span>
                        <span className="text-white font-bold">{currentSeason}</span>
                      </div>
                      <div className="flex justify-between items-center text-[10.5px]">
                        <span className="text-neutral-400">Weather Status:</span>
                        <span className="text-cyan-400 font-bold">{weather}</span>
                      </div>
                      <div className="flex justify-between items-center text-[10.5px]">
                        <span className="text-neutral-400">Approx. Population:</span>
                        <span className="text-white font-bold">{140 + (dayOfMonth * 3) % 20} Active</span>
                      </div>
                    </div>

                    {/* Timeline Events list */}
                    <div className="space-y-2">
                      <span className="text-[8.5px] font-black uppercase tracking-wider text-neutral-400 block px-1">Today's World Schedule</span>
                      <div className="space-y-2 overflow-y-auto max-h-[22vh] pr-1 custom-scrollbar">
                        {worldTime.eventsTimeline.map((ev, i) => (
                          <div key={i} className={`p-2.5 rounded-xl border flex items-center justify-between gap-3 text-white text-[10px] ${
                            ev.status === 'active' 
                              ? 'bg-amber-500/10 border-amber-400/40 shadow-[0_0_10px_rgba(245,158,11,0.15)] font-bold animate-pulse'
                              : ev.status === 'passed'
                              ? 'bg-neutral-950/10 border-white/5 opacity-55'
                              : 'bg-black/20 border-white/5'
                          }`}>
                            <div>
                              <span className="text-white font-medium block">{ev.time} - {ev.title}</span>
                              <span className="text-[8px] text-neutral-400 block leading-tight mt-0.5">{ev.effect}</span>
                            </div>
                            <span className={`text-[7.5px] font-black uppercase px-1.5 py-0.5 rounded ${
                              ev.status === 'active' ? 'bg-amber-500 text-black' : ev.status === 'passed' ? 'bg-neutral-800 text-neutral-400' : 'bg-neutral-900 text-neutral-400'
                            }`}>{ev.status}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <p className="text-[7.5px] text-neutral-400 font-mono italic text-center border-t border-white/5 pt-3 mt-4">
                    *Select map frosted nodes on the left page to trigger monorail train travel routes.
                  </p>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* Footer Info Row */}
        <div className="pt-3 border-t border-white/10 shrink-0 text-center text-[10px] text-white/50 z-10 flex justify-between items-center">
          <span>Ledger Wallet: <span className="text-amber-400 font-mono font-bold">🪙 {coins} Coins</span></span>
          <button 
            onClick={handleClose}
            className="px-5 py-2 rounded-xl bg-white/5 border border-white/10 text-white font-brand font-black text-[9px] uppercase tracking-wider hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
          >
            Acknowledge 📖
          </button>
        </div>

      </motion.div>

      {/* Dim lights retire fade-to-black ceremony overlay */}
      {isClosing && (
        <div className="fixed inset-0 z-[1000] bg-black flex flex-col items-center justify-center select-none" style={{ animation: 'fadeIn 1.2s forwards' }}>
          <div className="text-center space-y-4">
            <span className="text-4xl animate-pulse">🕯️</span>
            <h2 className="text-lg font-brand text-amber-300 uppercase tracking-widest animate-pulse" style={{ fontFamily: FONT }}>
              Closing the Journal...
            </h2>
            <p className="text-xs text-neutral-400 font-mono italic">
              "The ink dries. Today becomes chronicle. Sleep well."
            </p>
          </div>
        </div>
      )}

    </div>
  );
};

