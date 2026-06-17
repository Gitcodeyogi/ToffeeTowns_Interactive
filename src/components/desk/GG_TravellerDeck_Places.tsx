import React, { useState, useEffect } from 'react';
import { useTTStore } from '../../store/useTTStore';
import { GG_TravellerDeck_Header } from './GG_TravellerDeck_Header';
import { TRANSPORT_SPEEDS, getPlayerLevelInfo, type SubPage } from '../../pages/TravellersDesk';
import { DAILY_ROTATION_DATA } from '../../data/newspaper_rotation';

interface GG_TravellerDeck_PlacesProps {
  setSubPage: (page: SubPage) => void;
  popPage: () => void;
  triggerFeedback: (msg: string) => void;
}

interface Activity {
  id: string;
  name: string;
  location: string;
  skill: 'builder' | 'explorer' | 'healer';
  description: string;
  images: string[];
  dist: number;
  dur: number;
  coins: number;
  xp: number;
  legacy: number;
  icon: string;
}

const ACTIVITIES: Activity[] = [
  // ── BUILDER TASKS ──
  {
    id: 'builder-civic',
    name: 'Submit Civic Request',
    location: 'Town Hall',
    skill: 'builder',
    description: 'Submit official blueprints for municipal expansion. Work with builders to design and lay down plans for the new plaza layout, fixing cracks in the foundation.',
    images: ["/Assets/Ganache Grove/Scene_0.1.png", "/Assets/Ganache Grove/Traveller'sHome_GanacheGrovez_Beginner_Exterior.png"],
    dist: 400,
    dur: 10000,
    coins: 30,
    xp: 15,
    legacy: 15,
    icon: '📋'
  },
  {
    id: 'builder-basics',
    name: 'Attend Builder Basics',
    location: 'Academy',
    skill: 'builder',
    description: 'Attend the daily workshop on structure building. Learn structural drafting, chocolate mortar mixtures, and wood carving skills under the academy lights.',
    images: ["/Assets/Ganache Grove/Copilot_20260425_143442.png", "/Assets/Ganache Grove/Copilot_20260425_151952.png"],
    dist: 800,
    dur: 12000,
    coins: 20,
    xp: 20,
    legacy: 15,
    icon: '📐'
  },
  {
    id: 'builder-cargo',
    name: 'Help Unload Cargo',
    location: 'Forest Rail Station',
    skill: 'builder',
    description: 'Assist Nigel and the station crew unloading cargo containers from the railway. Handle heavy bags of sugar, cocoa beans, and construction logs near the tracks.',
    images: ["/Assets/Ganache Grove/Copilot_20260425_151952.png", "/Assets/Ganache Grove/Ganache_BeginnerHome_backyard.png"],
    dist: 1200,
    dur: 10000,
    coins: 35,
    xp: 15,
    legacy: 10,
    icon: '📦'
  },
  {
    id: 'builder-merchant',
    name: 'Deliver Merchant Orders',
    location: 'Cocoa Market',
    skill: 'builder',
    description: 'Carry heavy supply sacks to the local merchant stalls. Verify delivery invoices, check for damaged items, and secure loose cargo straps around the market plaza.',
    images: ["/Assets/Ganache Grove/GanacheGrove_marketSquare.png", "/Assets/Ganache Grove/GanacheGrove_marketSquare1.png"],
    dist: 500,
    dur: 10000,
    coins: 35,
    xp: 15,
    legacy: 10,
    icon: '🛍️'
  },
  {
    id: 'builder-bell',
    name: 'Inspect Bell Gears',
    location: 'Bell Tower',
    skill: 'builder',
    description: 'Climb to the high spire of the bell tower. Clean, grease, and realign the copper clockwork gears to keep perfect time for Cocoawood County.',
    images: ["/Assets/Ganache Grove/Traveller'sHome_GanacheGrovez_Beginner_Exterior.png", "/Assets/Ganache Grove/Scene_0.1.png"],
    dist: 100,
    dur: 6000,
    coins: 15,
    xp: 10,
    legacy: 10,
    icon: '⚙️'
  },
  {
    id: 'builder-press',
    name: 'Print Daily Issue',
    location: 'Gazette Office',
    skill: 'builder',
    description: 'Prepare manual iron printing presses with ink. Feed blank parchment sheets and stack the fresh morning edition of the Gazette.',
    images: ["/Assets/Ganache Grove/Ganache_BeginnerHome_Living.png", "/Assets/Ganache Grove/GanacheGrove_GossipCorner.png"],
    dist: 300,
    dur: 8000,
    coins: 25,
    xp: 15,
    legacy: 10,
    icon: '⚙️'
  },
  {
    id: 'builder-dredge',
    name: 'Help Dredge Canal',
    location: 'Riverside Docks',
    skill: 'builder',
    description: 'Clear underwater logs and sticky molasses deposits blocking transit. Keep flow channels open for incoming steam barges near the docks.',
    images: ["/Assets/Ganache Grove/Ganache_BeginnerHome_backyard1.png", "/Assets/Ganache Grove/Scene_0.1.png"],
    dist: 900,
    dur: 10000,
    coins: 35,
    xp: 20,
    legacy: 10,
    icon: '🧹'
  },

  // ── EXPLORER JOURNEYS ──
  {
    id: 'explorer-meeting',
    name: 'Attend Town Meeting',
    location: 'Town Hall',
    skill: 'explorer',
    description: 'Take notes during town hall debates. Observe how faction leaders discuss environmental safety, walkway construction, and local truffles flora.',
    images: ["/Assets/Ganache Grove/Scene_0.1.png", "/Assets/Ganache Grove/Traveller'sHome_GanacheGrovez_Beginner_Exterior.png"],
    dist: 400,
    dur: 8000,
    coins: 20,
    xp: 10,
    legacy: 10,
    icon: '🏛️'
  },
  {
    id: 'explorer-rail',
    name: 'Plan County Transit Routes',
    location: 'Forest Rail Station',
    skill: 'explorer',
    description: 'Map upcoming railway line extensions. Track optimal coordinates linking Hazelnut Terrace to Caramel Cove to navigate transit logistics.',
    images: ["/Assets/Ganache Grove/Copilot_20260425_151952.png", "/Assets/Ganache Grove/Ganache_BeginnerHome_backyard.png"],
    dist: 1200,
    dur: 8000,
    coins: 20,
    xp: 10,
    legacy: 15,
    icon: '🗺️'
  },
  {
    id: 'explorer-trade',
    name: 'Trade Contracts',
    location: 'Cocoa Market',
    skill: 'explorer',
    description: 'Analyze broker tariffs for sugar imports. Review shipping records to trade raw cocoa pods at premium rates inside the trading hub.',
    images: ["/Assets/Ganache Grove/GanacheGrove_marketSquare.png", "/Assets/Ganache Grove/GanacheGrove_marketSquare1.png"],
    dist: 500,
    dur: 8000,
    coins: 25,
    xp: 10,
    legacy: 10,
    icon: '📄'
  },
  {
    id: 'explorer-mayor',
    name: 'Attend Mayor Announcements',
    location: 'Bell Tower',
    skill: 'explorer',
    description: "Gather in the plaza to receive Forester Mayor's official decrees. Learn about regional alerts, passport updates, and upcoming local events.",
    images: ["/Assets/Ganache Grove/Traveller'sHome_GanacheGrovez_Beginner_Exterior.png", "/Assets/Ganache Grove/Scene_0.1.png"],
    dist: 100,
    dur: 8000,
    coins: 20,
    xp: 10,
    legacy: 15,
    icon: '📢'
  },
  {
    id: 'explorer-notice',
    name: 'Read Local Notice Board',
    location: 'Gazette Office',
    skill: 'explorer',
    description: 'Browse community notices and posters. Spot active travel paths, local job opportunities, and regional bounties from other county sectors.',
    images: ["/Assets/Ganache Grove/Ganache_BeginnerHome_Living.png", "/Assets/Ganache Grove/GanacheGrove_GossipCorner.png"],
    dist: 300,
    dur: 6000,
    coins: 15,
    xp: 10,
    legacy: 10,
    icon: '📯'
  },
  {
    id: 'explorer-gossip',
    name: 'Uncover Local Rumours',
    location: 'Traveller Square',
    skill: 'explorer',
    description: 'Listen to tavern stories under lantern lights. Trade information with traveling cartographers to update your residency ledger.',
    images: ["/Assets/Ganache Grove/GanacheGrove_GossipCorner.png", "/Assets/Ganache Grove/Ganache_BeginnerHome_Balcony.png"],
    dist: 200,
    dur: 10000,
    coins: 25,
    xp: 15,
    legacy: 15,
    icon: '💬'
  },
  {
    id: 'explorer-park',
    name: 'Help Clear Trails',
    location: 'Mossberry Park',
    skill: 'explorer',
    description: 'Prune wild firefly bushes and repair guideposts. Ensure tourists do not get lost in deep green mud-filled bogs during path exploration.',
    images: ["/Assets/Ganache Grove/Ganache_BeginnerHome_backyard.png", "/Assets/Ganache Grove/Ganache_BeginnerHome_backyard1.png"],
    dist: 600,
    dur: 10000,
    coins: 25,
    xp: 15,
    legacy: 10,
    icon: '🧹'
  },
  {
    id: 'explorer-cargo-secure',
    name: 'Secure Cargo Barges',
    location: 'Riverside Docks',
    skill: 'explorer',
    description: 'Check mooring lines and secure locks on steam cargo barges. Coordinate dispatch schedules with harbor pilots to ensure cargo safety.',
    images: ["/Assets/Ganache Grove/Ganache_BeginnerHome_backyard1.png", "/Assets/Ganache Grove/Scene_0.1.png"],
    dist: 900,
    dur: 8000,
    coins: 20,
    xp: 15,
    legacy: 10,
    icon: '🎫'
  },

  // ── HEALER OPERATIONS ──
  {
    id: 'healer-study',
    name: 'Study Herbalism',
    location: 'Academy',
    skill: 'healer',
    description: 'Identify medicinal plants in ancient scroll books. Learn to prepare standard chamomile and lavender infusions to soothe local residents.',
    images: ["/Assets/Ganache Grove/Copilot_20260425_143442.png", "/Assets/Ganache Grove/Copilot_20260425_151952.png"],
    dist: 800,
    dur: 12000,
    coins: 20,
    xp: 20,
    legacy: 15,
    icon: '🌿'
  },
  {
    id: 'healer-herbs',
    name: 'Deliver Medical Herbs',
    location: 'Oakenhart Clinic',
    skill: 'healer',
    description: "Collect fresh lavender and mint leaves from the forest garden. Supply Dr. Cedric Oakenhart's healing pantry to secure medicines.",
    images: ["/Assets/Ganache Grove/Ganache_BeginnerHome_kitchen1.png", "/Assets/Ganache Grove/Ganache_BeginnerHome_Living.png"],
    dist: 700,
    dur: 10000,
    coins: 35,
    xp: 25,
    legacy: 15,
    icon: '🍵'
  },
  {
    id: 'healer-cots',
    name: 'Clean Medical Cots',
    location: 'Oakenhart Clinic',
    skill: 'healer',
    description: 'Sanitize recovery beds, fluff pillows, and prepare hot honey tea. Comfort patients recovering from local Moss Sneezles outbreaks.',
    images: ["/Assets/Ganache Grove/Ganache_BeginnerHome_kitchen1.png", "/Assets/Ganache Grove/Ganache_BeginnerHome_Living.png"],
    dist: 700,
    dur: 8000,
    coins: 20,
    xp: 15,
    legacy: 10,
    icon: '🛏️'
  },
  {
    id: 'healer-music',
    name: 'Listen to Square Musicians',
    location: 'Traveller Square',
    skill: 'healer',
    description: 'Absorb therapeutic melodies played on lutes. Relieve stress for tired travellers and improve general community wellness.',
    images: ["/Assets/Ganache Grove/GanacheGrove_GossipCorner.png", "/Assets/Ganache Grove/Ganache_BeginnerHome_Balcony.png"],
    dist: 200,
    dur: 8000,
    coins: 15,
    xp: 10,
    legacy: 15,
    icon: '🎵'
  },
  {
    id: 'healer-ducks',
    name: 'Feed Forest Ducks',
    location: 'Mossberry Park',
    skill: 'healer',
    description: 'Feed nutrient-rich grain to forest ducks at the pond. Study their behaviors and care for injured waterfowl under forest canopies.',
    images: ["/Assets/Ganache Grove/Ganache_BeginnerHome_backyard.png", "/Assets/Ganache Grove/Ganache_BeginnerHome_backyard1.png"],
    dist: 600,
    dur: 8000,
    coins: 15,
    xp: 10,
    legacy: 15,
    icon: '🦆'
  }
];

;

const getImmersiveTravelText = (distance: number) => {
  if (distance <= 200) return 'Quick Walk (1-2 min)';
  if (distance <= 500) return 'Short Journey (2-3 min)';
  if (distance <= 800) return 'Half-Day Visit (4-5 min)';
  return 'Scenic Expedition (6+ min)';
};

export const GG_TravellerDeck_Places: React.FC<GG_TravellerDeck_PlacesProps> = ({
  setSubPage,
  popPage,
  triggerFeedback,
}) => {
  const {
    activeTransport,
    addToQueue,
    skills,
  } = useTTStore();


  const dayIndex = (new Date().getDate() % 10) + 1;
  const dayContent = DAILY_ROTATION_DATA.find(d => d.day === dayIndex) || DAILY_ROTATION_DATA[0];

  const opportunitiesList = [
    {
      name: dayContent.activityName,
      rewardText: `+${dayContent.activityRewardXP} XP • +${dayContent.activityRewardCoins} Coins`,
      place: dayContent.activityPlace,
      dist: 500,
      dur: 10000,
      coins: dayContent.activityRewardCoins,
      xp: dayContent.activityRewardXP,
      cat: dayContent.activitySkill,
      legacy: dayContent.activityRewardLegacy,
      icon: dayContent.activityIcon,
    },
    {
      name: 'Town Hall Meeting',
      rewardText: '+25 XP • +10 Coins',
      place: 'Town Hall',
      dist: 400,
      dur: 8000,
      coins: 10,
      xp: 25,
      cat: 'explorer',
      legacy: 15,
      icon: '🗳️',
    },
    {
      name: 'Forest Survey',
      rewardText: '+40 XP • +15 Coins',
      place: 'Mossberry Park',
      dist: 600,
      dur: 9000,
      coins: 15,
      xp: 40,
      cat: 'explorer',
      legacy: 10,
      icon: '🧭',
    }
  ];

  const [activeTab, setActiveTab] = useState<'all' | 'builder' | 'explorer' | 'healer'>('all');
  const [selectedActId, setSelectedActId] = useState<string>(ACTIVITIES[0].id);
  const [slideIdx, setSlideIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSlideIdx(prev => (prev === 0 ? 1 : 0));
    }, 20000);
    return () => clearInterval(interval);
  }, []);

  const totalXP = Object.values(skills || {}).reduce((a, b) => a + b, 0);
  const levelInfo = getPlayerLevelInfo(totalXP);
  
  const progressBlocks = Math.round(levelInfo.progressPct / 10);
  const progressStr = '█'.repeat(progressBlocks) + '░'.repeat(10 - progressBlocks);

  const handleTravelToPlace = (
    placeName: string,
    distance: number,
    actionName: string,
    actionDuration: number,
    rewardCoins: number,
    rewardXP: number,
    rewardXPCat: string,
    rewardLegacy: number,
    icon: string,
    actionId: string
  ) => {
    const speedMult = TRANSPORT_SPEEDS[activeTransport] || 40;
    const travelDuration = Math.max(2000, Math.round((distance / speedMult) * 1000));
    
    addToQueue({
      name: `Travel to ${placeName}`,
      type: 'travel',
      duration: travelDuration,
      rewardCoins: 0,
      rewardXP: 0,
      rewardXPCat: '',
      rewardLegacy: 0,
      icon: '🚶',
      targetText: `${placeName} (${distance}m)`,
    });

    addToQueue({
      name: actionName,
      type: 'work',
      duration: actionDuration,
      rewardCoins,
      rewardXP,
      rewardXPCat,
      rewardLegacy,
      icon,
      targetText: placeName,
      actionId,
    });

    triggerFeedback(`📍 Queued travel to ${placeName} and activity: ${actionName}!`);
  };

  const currentActivity = ACTIVITIES.find(a => a.id === selectedActId) || ACTIVITIES[0];

  // Filter activities based on tab
  const filteredActivities = ACTIVITIES.filter(act => {
    if (activeTab === 'all') return true;
    return act.skill === activeTab;
  });

  return (
    <div className="w-full h-full flex flex-col justify-between">
      <GG_TravellerDeck_Header
        title="TOWN LANDMARKS & CONTRACTS"
        setSubPage={setSubPage}
        popPage={popPage}
      />

      {/* Main content grid */}
      <div className="flex-grow flex flex-col lg:flex-row gap-6 my-4 overflow-hidden min-h-0">
        
        {/* Left Column: Progress, Opportunities & Hero Selected Activity Card (42% width) */}
        <div className="w-full lg:w-[42%] shrink-0 h-full flex flex-col gap-4 overflow-y-auto custom-scrollbar pr-1">
          
          {/* Rank Progress Card */}
          <div className="border border-white/10 bg-black/45 rounded-3xl p-4 flex flex-col gap-1.5 shadow-lg">
            <span className="text-[10px] font-brand text-amber-400 uppercase tracking-widest" style={{ fontFamily: '"Josefin Sans", sans-serif' }}>
              🏆 Current Rank
            </span>
            <div className="flex items-center justify-between">
              <span className="text-base font-bold text-white font-sans">{levelInfo.title}</span>
              <span className="text-xs font-semibold text-white/80">{totalXP} / {levelInfo.totalLevelEndXP} XP</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono tracking-widest mt-1 bg-black/30 p-2 rounded-xl border border-white/5 justify-between">
              <span className="text-emerald-400 font-bold">{progressStr}</span>
              <span className="text-amber-300 font-black uppercase text-[10px]">
                {levelInfo.progressPct.toFixed(0)}% Done
              </span>
            </div>
          </div>

          {/* Today's Opportunities (Contracts) */}
          <div className="border border-white/10 bg-black/45 rounded-3xl p-4 flex flex-col gap-2.5 shadow-lg">
            <span className="text-[10px] font-brand text-amber-400 uppercase tracking-widest" style={{ fontFamily: '"Josefin Sans", sans-serif' }}>
              📯 Today's Opportunities
            </span>
            <div className="grid grid-cols-1 gap-2">
              {opportunitiesList.map((opp, idx) => (
                <div 
                  key={idx} 
                  className="flex items-center justify-between bg-white/5 border border-white/10 rounded-2xl p-3 hover:bg-white/10 transition group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{opp.icon}</span>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-white leading-normal">{opp.name}</span>
                      <span className="text-[9.5px] text-amber-300/90 font-medium">{opp.rewardText}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleTravelToPlace(
                      opp.place, 
                      opp.dist, 
                      opp.name, 
                      opp.dur, 
                      opp.coins, 
                      opp.xp, 
                      opp.cat, 
                      opp.legacy, 
                      opp.icon, 
                      `opportunity-${idx}`
                    )}
                    className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-black font-black uppercase text-[9px] rounded-lg tracking-wider transition duration-200"
                    style={{ fontFamily: '"Josefin Sans", sans-serif' }}
                  >
                    Accept
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Featured Activity Card */}
          <div className="border border-white/10 bg-black/45 rounded-3xl p-4 flex flex-col gap-3 shadow-lg">
            <span className="text-[10px] font-brand text-amber-400 uppercase tracking-widest" style={{ fontFamily: '"Josefin Sans", sans-serif' }}>
              📍 Featured Activity: {currentActivity.name}
            </span>

            {/* 3:2 Live Location Image with rotation support */}
            <div className="relative aspect-[3/2] w-full rounded-2xl overflow-hidden border border-white/10 bg-black shadow-inner">
              {currentActivity.images.map((imgUrl, i) => (
                <img 
                  key={imgUrl}
                  src={imgUrl} 
                  alt={currentActivity.name} 
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${slideIdx === i ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                />
              ))}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none z-20" />
              <div className="absolute bottom-3 left-3 z-30">
                <span className="px-2.5 py-0.5 bg-amber-400/90 text-black text-[9px] font-black uppercase rounded-lg shadow-md">
                  {currentActivity.location}
                </span>
              </div>
            </div>

            {/* Activity Meta */}
            <div>
              <h4 className="text-sm font-bold text-white font-sans flex items-center gap-1.5">
                {currentActivity.icon} {currentActivity.name}
              </h4>
              <span className="text-[9.5px] uppercase tracking-wider text-amber-400 font-semibold block mt-0.5">
                Reward: +{currentActivity.xp} XP ({currentActivity.skill.toUpperCase()}) • +{currentActivity.coins} Coins
              </span>
            </div>

            {/* Activity description */}
            <p className="text-[11px] text-white/80 leading-relaxed text-justify font-sans bg-black/20 p-3 rounded-xl border border-white/5">
              {currentActivity.description}
            </p>

            {/* Travel Time & Launch Button */}
            <button
              onClick={() => handleTravelToPlace(
                currentActivity.location, 
                currentActivity.dist, 
                currentActivity.name, 
                currentActivity.dur, 
                currentActivity.coins, 
                currentActivity.xp, 
                currentActivity.skill, 
                currentActivity.legacy, 
                currentActivity.icon, 
                `place-featured-act-${currentActivity.id}`
              )}
              className="w-full py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-brand text-[10px] uppercase tracking-wider rounded-xl transition font-black flex items-center justify-between px-4 shadow-md"
              style={{ fontFamily: '"Josefin Sans", sans-serif' }}
            >
              <span className="flex items-center gap-2">
                <span>🚀</span>
                <span>Travel & Perform Activity</span>
              </span>
              <span className="text-amber-300 font-bold">({getImmersiveTravelText(currentActivity.dist)})</span>
            </button>

          </div>

        </div>

        {/* Right Column: Activities Directory list with Tabs (58% width) */}
        <div className="w-full lg:w-[58%] shrink-0 h-full flex flex-col border border-white/10 bg-black/25 rounded-3xl p-5 overflow-hidden min-h-0">
          
          {/* Skill Tabs */}
          <div className="flex flex-wrap gap-1.5 mb-4 border-b border-white/15 pb-3 shrink-0">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-xl text-[10px] font-brand uppercase tracking-wider transition-all duration-200 border ${
                activeTab === 'all' 
                  ? 'bg-amber-500 border-amber-400 text-black font-black' 
                  : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
              }`}
              style={{ fontFamily: '"Josefin Sans", sans-serif' }}
            >
              🌟 All Activities ({ACTIVITIES.length})
            </button>
            <button
              onClick={() => setActiveTab('builder')}
              className={`px-3 py-1.5 rounded-xl text-[10px] font-brand uppercase tracking-wider transition-all duration-200 border ${
                activeTab === 'builder' 
                  ? 'bg-amber-500 border-amber-400 text-black font-black' 
                  : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
              }`}
              style={{ fontFamily: '"Josefin Sans", sans-serif' }}
            >
              👷 Builder ({ACTIVITIES.filter(a => a.skill === 'builder').length})
            </button>
            <button
              onClick={() => setActiveTab('explorer')}
              className={`px-3 py-1.5 rounded-xl text-[10px] font-brand uppercase tracking-wider transition-all duration-200 border ${
                activeTab === 'explorer' 
                  ? 'bg-amber-500 border-amber-400 text-black font-black' 
                  : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
              }`}
              style={{ fontFamily: '"Josefin Sans", sans-serif' }}
            >
              🧭 Explorer ({ACTIVITIES.filter(a => a.skill === 'explorer').length})
            </button>
            <button
              onClick={() => setActiveTab('healer')}
              className={`px-3 py-1.5 rounded-xl text-[10px] font-brand uppercase tracking-wider transition-all duration-200 border ${
                activeTab === 'healer' 
                  ? 'bg-amber-500 border-amber-400 text-black font-black' 
                  : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
              }`}
              style={{ fontFamily: '"Josefin Sans", sans-serif' }}
            >
              🩺 Healer ({ACTIVITIES.filter(a => a.skill === 'healer').length})
            </button>
          </div>

          {/* Activities List */}
          <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-1">
            {filteredActivities.map((act) => {
              const isSelected = selectedActId === act.id;
              return (
                <div 
                  key={act.id} 
                  onClick={() => {
                    setSelectedActId(act.id);
                    setSlideIdx(0); // Reset slide timer on selection change
                  }}
                  className={`p-3.5 rounded-2xl flex flex-col md:flex-row gap-4 border cursor-pointer transition-all items-start md:items-center justify-between ${
                    isSelected 
                      ? 'bg-amber-500/10 border-amber-400/40 shadow-glow' 
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
                >
                  {/* Left: 3:2 Image & details */}
                  <div className="flex items-center gap-4 min-w-0 flex-grow">
                    {/* Standard 3:2 Image inside the list card */}
                    <div className="w-24 h-16 shrink-0 rounded-xl overflow-hidden border border-white/10 bg-black relative">
                      <img 
                        src={act.images[0]} 
                        alt={act.name} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/15 pointer-events-none" />
                    </div>

                    <div className="min-w-0 flex-grow">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{act.icon}</span>
                        <h4 className={`text-xs font-bold leading-normal truncate ${isSelected ? 'text-amber-300' : 'text-white'}`}>
                          {act.name}
                        </h4>
                      </div>
                      <span className="text-[9.5px] uppercase tracking-wider text-amber-400 font-semibold block mt-0.5">
                        {act.location} • {getImmersiveTravelText(act.dist)}
                      </span>
                      {/* Expanded description (clamp to 3 lines) */}
                      <p className="text-[10px] text-white/50 leading-relaxed font-sans line-clamp-3 mt-1.5 text-justify pr-1">
                        {act.description}
                      </p>
                    </div>
                  </div>

                  {/* Right: Reward Pill */}
                  <div className="flex md:flex-col items-end gap-2 shrink-0 self-stretch justify-between md:justify-center border-t md:border-t-0 border-white/5 pt-2.5 md:pt-0">
                    <span className="text-[8.5px] uppercase tracking-wider text-neutral-300 font-black block font-sans bg-black/45 border border-white/5 px-2 py-0.5 rounded-full">
                      +{act.xp} XP ({act.skill.toUpperCase()})
                    </span>
                    <span className="text-[9.5px] font-black text-amber-300">
                      +{act.coins} Coins
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
