import React, { useState, useMemo, useEffect } from 'react';
import { useTTStore } from '../../store/useTTStore';
import { GG_TravellerDeck_Header } from './GG_TravellerDeck_Header';
import { FONT, type SubPage, getPlayerLevelInfo, getProvincialStanding } from '../../lib/uiConstants';

interface GG_TravellerDeck_JournalProps {
  setSubPage: (page: SubPage) => void;
  popPage: () => void;
}

const ALL_BADGES = [
  { id: 101, name: 'Spring Blossom', icon: '🌸', desc: 'Participated in the Spring Flower Festival.' },
  { id: 102, name: 'Summer Breeze', icon: '☀️', desc: 'Completed tasks during summer.' },
  { id: 103, name: 'Autumn Harvest', icon: '🍁', desc: 'Gathered autumn ingredients for the bakery.' },
  { id: 104, name: 'Winter Frost', icon: '❄️', desc: 'Survived winter storms.' },
  { id: 105, name: 'Seasons Master', icon: '👑', desc: 'Earned all seasonal achievements.' },
  { id: 201, name: 'Master Baker', icon: '🥐', desc: 'Completed 5 bakery shifts.' },
  { id: 202, name: 'Alchemist', icon: '🧪', desc: 'Brewed 5 remedies in the clinic.' },
  { id: 203, name: 'Architect', icon: '⚙️', desc: 'Contributed to the Clock Spire.' },
];

const PROMOTION_PATH = [
  { level: 1, name: 'Newcomer', icon: '🌱', color: 'from-emerald-400 to-teal-500' },
  { level: 2, name: 'Resident', icon: '🏠', color: 'from-blue-400 to-indigo-500' },
  { level: 3, name: 'Settler', icon: '🪵', color: 'from-purple-400 to-fuchsia-500' },
  { level: 4, name: 'Townsman', icon: '🏘️', color: 'from-orange-400 to-red-500' },
  { level: 5, name: 'Citizen', icon: '🏛️', color: 'from-amber-400 to-yellow-500' },
];

export const GG_TravellerDeck_Journal: React.FC<GG_TravellerDeck_JournalProps> = ({
  setSubPage,
  popPage,
}) => {
  const {
    travellerName,
    coins,
    coinHistory,
    legacyPoints,
    skills,
    earnedBadges,
    completedSeriesSteps,
    goldenCitizenPass,
    homeTown,
    playerAvatar,
    setPlayerAvatar,
    avatarZoom,
    avatarX,
    avatarY,
    setAvatarAdjustments,
  } = useTTStore();

  const [showAdjustCard, setShowAdjustCard] = useState(false);
  const [tempZoom, setTempZoom] = useState(avatarZoom || 1);
  const [tempX, setTempX] = useState(avatarX || 0);
  const [tempY, setTempY] = useState(avatarY || 0);

  // Sync temp state when store values change (e.g. on load or new image)
  useEffect(() => {
    setTempZoom(avatarZoom || 1);
    setTempX(avatarX || 0);
    setTempY(avatarY || 0);
  }, [avatarZoom, avatarX, avatarY, showAdjustCard]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPlayerAvatar(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const [developerQuery, setDeveloperQuery] = useState('');
  const [developerEmail, setDeveloperEmail] = useState('');
  const [querySent, setQuerySent] = useState(false);

  // Calculate total XP and breakdowns
  const skillBuilder = skills?.builder || 0;
  const skillExplorer = skills?.explorer || 0;
  const skillHealer = skills?.healer || 0;
  const totalXP = skillBuilder + skillExplorer + skillHealer;

  const levelInfo = useMemo(() => getPlayerLevelInfo(totalXP), [totalXP]);
  const standing = useMemo(() => {
    const raw = getProvincialStanding(legacyPoints);
    return raw.split(' ').pop() || raw;
  }, [legacyPoints]);

  // Calculate total coins earned and spent from history
  const { totalEarned, totalSpent } = useMemo(() => {
    let earned = 0;
    let spent = 0;
    if (coinHistory) {
      coinHistory.forEach((t) => {
        if (t.type === 'earned') earned += t.amount;
        else if (t.type === 'spent') spent += t.amount;
      });
    }
    return { totalEarned: earned, totalSpent: spent };
  }, [coinHistory]);

  // Count mini-games played
  const miniGamesCount = useMemo(() => {
    if (!coinHistory) return { bakery: 0, clinic: 0, workshop: 0 };
    let bakery = 0;
    let clinic = 0;
    let workshop = 0;
    coinHistory.forEach((t) => {
      const src = t.source.toLowerCase();
      if (src.includes('bakery') || src.includes('oven')) bakery++;
      else if (src.includes('clinic') || src.includes('elixir')) clinic++;
      else if (src.includes('repair') || src.includes('well') || src.includes('workshop')) workshop++;
    });
    return { bakery, clinic, workshop };
  }, [coinHistory]);

  // Last 10 activities and transactions
  const lastTenActivities = useMemo(() => {
    if (!coinHistory) return [];
    return coinHistory.slice(0, 10);
  }, [coinHistory]);

  const lastTenTransactions = useMemo(() => {
    if (!coinHistory) return [];
    return coinHistory.slice(0, 10);
  }, [coinHistory]);

  const handleSendQuery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!developerQuery.trim()) return;
    setQuerySent(true);
    setTimeout(() => {
      setQuerySent(false);
      setDeveloperQuery('');
      setDeveloperEmail('');
    }, 3000);
  };

  return (
    <div className="w-full h-full flex flex-col justify-between">
      <GG_TravellerDeck_Header
        title="CITIZEN LEDGER & PROFILE"
        setSubPage={setSubPage}
        popPage={popPage}
      />

      {/* Main Scrollable Body */}
      <div className="flex-grow overflow-y-auto custom-scrollbar my-3 pr-1 space-y-6 z-10 text-left">
        
        {/* ROW 1: Multi-column Header (Unified Card & Horizontal Journey Map) */}
        <div className="flex flex-col lg:flex-row gap-6 items-stretch">
          
          {/* LEFT: Unified Player Profile & Avatar Card */}
          <div className="w-[490px] shrink-0 flex flex-col rounded-3xl bg-neutral-900/60 border-2 border-amber-500/50 backdrop-blur-md overflow-hidden shadow-[0_0_15px_rgba(245,158,11,0.15)] relative min-h-[260px] justify-between">
            
            {/* Card Header Sub-page / Tab selector */}
            <div className="flex justify-center p-3 border-b border-white/5 bg-black/10 gap-2">
              <button
                onClick={() => setShowAdjustCard(false)}
                className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-wider transition ${
                  !showAdjustCard 
                    ? 'bg-amber-500 text-neutral-950 shadow-md' 
                    : 'text-white/40 hover:text-white/70 hover:bg-white/5'
                }`}
                style={{ fontFamily: '"Josefin Sans", sans-serif' }}
              >
                📊 Profile
              </button>
              <button
                onClick={() => setShowAdjustCard(true)}
                className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-wider transition ${
                  showAdjustCard 
                    ? 'bg-amber-500 text-neutral-950 shadow-md' 
                    : 'text-white/40 hover:text-white/70 hover:bg-white/5'
                }`}
                style={{ fontFamily: '"Josefin Sans", sans-serif' }}
              >
                ⚙️ Adjust
              </button>
            </div>

            {/* Card Body - Side-by-side Avatar and Tab Content */}
            <div className="p-5 flex-1 flex flex-row items-stretch gap-3 justify-center">
              
              {/* Left Column: Standalone Avatar Circle (40% width) */}
              <div className="w-[40%] shrink-0 flex flex-col items-center justify-start pt-3">
                <div 
                  onClick={() => document.getElementById('avatar-file-input')?.click()}
                  className="rounded-full overflow-hidden bg-black/60 border-2 border-amber-500/50 hover:border-amber-400 cursor-pointer shadow-[0_0_20px_rgba(251,191,36,0.35)] relative group transition-all duration-300 flex items-center justify-center shrink-0 w-[130px] h-[130px]"
                  title="Click to Upload Avatar Image"
                >
                  {playerAvatar ? (
                    <img 
                      src={playerAvatar} 
                      alt="Player Avatar" 
                      className="w-full h-full object-cover transition-transform duration-150" 
                      style={{
                        transform: `scale(${avatarZoom || 1}) translate(${avatarX || 0}px, ${avatarY || 0}px)`,
                        transformOrigin: 'center center'
                      }}
                    />
                  ) : (
                    <div className="text-4xl select-none">
                      {goldenCitizenPass ? '👑' : '🚶'}
                    </div>
                  )}
                  
                  {/* Camera upload overlay on hover */}
                  <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-center p-2">
                    <span className="text-xl">📷</span>
                    <span className="text-[9px] font-black text-white uppercase tracking-wider mt-1">
                      Upload
                    </span>
                  </div>
                </div>

                {/* Hidden file input */}
                <input
                  id="avatar-file-input"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </div>

              {/* Visual Divider Line */}
              <div className="w-[1px] h-28 bg-white/10 self-center mx-1 shrink-0" />

              {/* Right Column: Tab Content (60% width) */}
              <div className="w-[60%] shrink-0 flex flex-col justify-center pl-2">
                {showAdjustCard ? (
                  <div className="space-y-3.5 animate-fade-in text-white w-full">
                    {/* Zoom */}
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-[9px] font-black text-neutral-300 uppercase font-sans">
                        <span>🔍 Zoom</span>
                        <span className="text-amber-400 font-mono font-bold">{tempZoom.toFixed(2)}X</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="3"
                        step="0.05"
                        value={tempZoom}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          setTempZoom(val);
                          setAvatarAdjustments(val, tempX, tempY);
                        }}
                        className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-amber-500"
                      />
                    </div>
                    {/* Pan X */}
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-[9px] font-black text-neutral-300 uppercase font-sans">
                        <span>↔️ Pan X</span>
                        <span className="text-amber-400 font-mono font-bold">{tempX > 0 ? `+${tempX}` : tempX}PX</span>
                      </div>
                      <input
                        type="range"
                        min="-80"
                        max="80"
                        step="1"
                        value={tempX}
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          setTempX(val);
                          setAvatarAdjustments(tempZoom, val, tempY);
                        }}
                        className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-amber-500"
                      />
                    </div>
                    {/* Pan Y */}
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-[9px] font-black text-neutral-300 uppercase font-sans">
                        <span>↕️ Pan Y</span>
                        <span className="text-amber-400 font-mono font-bold">{tempY > 0 ? `+${tempY}` : tempY}PX</span>
                      </div>
                      <input
                        type="range"
                        min="-80"
                        max="80"
                        step="1"
                        value={tempY}
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          setTempY(val);
                          setAvatarAdjustments(tempZoom, tempX, val);
                        }}
                        className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-amber-500"
                      />
                    </div>

                    <div className="flex justify-end pt-0.5">
                      <button
                        onClick={() => {
                          setTempZoom(1);
                          setTempX(0);
                          setTempY(0);
                          setAvatarAdjustments(1, 0, 0);
                        }}
                        className="px-3 py-1 bg-neutral-900 border border-white/20 hover:bg-white/5 text-white font-brand text-[9px] font-bold uppercase rounded-lg transition cursor-pointer"
                        style={{ fontFamily: '"Josefin Sans", sans-serif' }}
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col justify-center h-full space-y-3 text-white w-full animate-fade-in pl-1">
                    {/* Townfolk */}
                    <div className="flex items-center gap-3 border-b border-white/5 pb-2">
                      <span className="w-[85px] shrink-0 text-[15px] font-bold text-neutral-400 font-sans tracking-wide text-left" style={{ fontFamily: '"Josefin Sans", sans-serif' }}>
                        Townfolk
                      </span>
                      <span className="text-[14px] text-amber-300 font-brand uppercase tracking-wider text-left flex-1 whitespace-nowrap">
                        {travellerName || 'Yogesh Iyer'}
                      </span>
                    </div>

                    {/* Standing */}
                    <div className="flex items-center gap-3 border-b border-white/5 pb-2">
                      <span className="w-[85px] shrink-0 text-[15px] font-bold text-neutral-400 font-sans tracking-wide text-left" style={{ fontFamily: '"Josefin Sans", sans-serif' }}>
                        Standing
                      </span>
                      <span className="text-[14px] text-amber-300 font-brand uppercase tracking-wider text-left flex-1 whitespace-nowrap">
                        {standing}
                      </span>
                    </div>

                    {/* Town */}
                    <div className="flex items-center gap-3 border-b border-white/5 pb-2">
                      <span className="w-[85px] shrink-0 text-[15px] font-bold text-neutral-400 font-sans tracking-wide text-left" style={{ fontFamily: '"Josefin Sans", sans-serif' }}>
                        Town
                      </span>
                      <span className="text-[13px] text-amber-300 font-brand uppercase tracking-wider text-left flex-1 whitespace-nowrap" title={homeTown || undefined}>
                        {homeTown ? homeTown.replace('-', ' ') : 'Ganache Grove'}
                      </span>
                    </div>

                    {/* Province */}
                    <div className="flex items-center gap-3 pb-1">
                      <span className="w-[85px] shrink-0 text-[15px] font-bold text-neutral-400 font-sans tracking-wide text-left" style={{ fontFamily: '"Josefin Sans", sans-serif' }}>
                        Province
                      </span>
                      <span className="text-[13px] text-amber-300 font-brand uppercase tracking-wider text-left flex-1 whitespace-nowrap">
                        ChocoBrook
                      </span>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* RIGHT: Beautiful Colorful Horizontal Progression Journey Path */}
          <div className="flex-1 flex flex-col p-6 rounded-[2.5rem] bg-black/40 border-2 border-amber-500/50 backdrop-blur-md shadow-[0_0_15px_rgba(245,158,11,0.15)] relative overflow-hidden justify-between min-h-[260px]">
            <div className="absolute -right-20 -bottom-20 w-40 h-40 rounded-full bg-blue-500/5 blur-[50px] pointer-events-none" />
            
            <div className="text-left mb-2">
              <h4 className="text-[12px] font-black text-amber-300 uppercase tracking-widest flex items-center gap-1.5 font-sans">
                🏆 Provincial Journey & Milestone Path
              </h4>
              <p className="text-[9px] text-white/40 mt-0.5">
                Earn XP and Legacy to advance through milestones and unlock special privileges.
              </p>
            </div>

            {/* Horizontal Colorful Timeline without icons */}
            <div className="relative py-6 my-2 px-2">
              {/* Background connecting track line */}
              <div className="absolute top-[2.15rem] left-[5%] right-[5%] h-1 bg-white/10 rounded-full z-0" />
              
              {/* Filled color gradient progress line */}
              <div 
                className="absolute top-[2.15rem] left-[5%] h-1 bg-gradient-to-r from-emerald-500 via-blue-500 via-purple-500 to-amber-400 rounded-full z-0 transition-all duration-1000"
                style={{ width: `${Math.min(90, ((levelInfo.level - 1) / 4) * 90)}%` }}
              />

              <div className="flex justify-between items-center relative z-10">
                {PROMOTION_PATH.map((p) => {
                  const isCurrent = levelInfo.level === p.level;
                  const isPassed = levelInfo.level > p.level;
                  
                  // Milestone requirements mapping
                  const xpReq = p.level === 1 ? '0' : p.level === 2 ? '250' : p.level === 3 ? '500' : p.level === 4 ? '1000' : '2500';
                  const legReq = p.level === 1 ? '0' : p.level === 2 ? '60' : p.level === 3 ? '150' : p.level === 4 ? '300' : '750';
                  
                  return (
                    <div key={p.level} className="flex flex-col items-center w-1/5 select-none relative text-center">
                      {/* Stylized colorful dot marker instead of large icon */}
                      <div 
                        className={`w-4 h-4 rounded-full border-2 transition-all duration-500 ${
                          isCurrent 
                            ? 'bg-amber-400 border-white scale-125 shadow-[0_0_12px_rgba(251,191,36,0.8)] animate-pulse'
                            : isPassed
                              ? 'bg-emerald-500 border-emerald-300'
                              : 'bg-zinc-800 border-zinc-700'
                        }`}
                      />

                      {/* Rank Details Column below marker */}
                      <div className="mt-2.5 flex flex-col items-center">
                        <span 
                          style={{ fontSize: '11px' }} 
                          className={`font-black uppercase tracking-wider block ${
                            isCurrent ? 'text-amber-300 font-bold' : isPassed ? 'text-emerald-400' : 'text-white/30'
                          }`}
                        >
                          {p.name}
                        </span>
                        
                        <span style={{ fontSize: '15px' }} className="text-white/40 block font-mono font-bold mt-0.5 whitespace-nowrap">
                          {xpReq} XP / {legReq} ⭐
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Descriptive active rank privilege box */}
            <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 text-left mt-2">
              <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest block mb-0.5">
                Active Rank Privileges
              </span>
              <p style={{ fontSize: '11px' }} className="text-white/60 leading-relaxed font-sans">
                {levelInfo.level === 1 && "🌱 As a Newcomer, you are authorized to speak with local townsfolk, complete early chores, participate in daily events, and begin your provincial journey."}
                {levelInfo.level === 2 && "🏠 As a Resident, you are authorized to speak with local townsfolk, play town minigames, complete workshop repairs, and participate in daily events."}
                {levelInfo.level === 3 && "🪵 As a Settler, you are authorized to speak with local townsfolk, lease stall booths, play town minigames, and participate in daily events."}
                {levelInfo.level === 4 && "🏘️ As a Townsman, you are authorized to speak with local townsfolk, consult in the council hall, play town minigames, and participate in daily events."}
                {levelInfo.level === 5 && "🏛️ As a Citizen, you hold full provincial privileges, can speak with local townsfolk, play town minigames, and participate in daily events."}
              </p>
            </div>
          </div>

        </div>

        {/* ROW 2: The Four Spheres of Progression */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Sphere 1: Cocoa Coins */}
          <div className="p-5 rounded-[2rem] bg-gradient-to-tr from-emerald-500/15 to-emerald-500/5 border border-emerald-500/20 shadow-lg relative overflow-hidden">
            <div className="absolute top-3 right-3 text-2xl opacity-30">🪙</div>
            <span className="text-[9px] text-emerald-400 font-black uppercase tracking-widest block">Cocoa Coins Pouch</span>
            <span className="text-3xl font-black text-white font-mono mt-2 block">{coins} 🪙</span>
            <div className="mt-3 pt-3 border-t border-emerald-500/10 flex justify-between text-[10px] text-white/40 font-semibold">
              <span>Earned: <span className="text-emerald-400">+{totalEarned}</span></span>
              <span>Spent: <span className="text-rose-400">-{totalSpent}</span></span>
            </div>
          </div>

          {/* Sphere 2: Town Legacy */}
          <div className="p-5 rounded-[2rem] bg-gradient-to-tr from-amber-500/15 to-amber-500/5 border border-amber-500/20 shadow-lg relative overflow-hidden">
            <div className="absolute top-3 right-3 text-2xl opacity-30">⭐</div>
            <span className="text-[9px] text-amber-400 font-black uppercase tracking-widest block">Town Legacy</span>
            <span className="text-3xl font-black text-white font-mono mt-2 block">{legacyPoints} ⭐</span>
            <div className="mt-3 pt-3 border-t border-amber-500/10 flex justify-between text-[10px] text-white/40 font-semibold">
              <span>Standing: <span className="text-amber-300 uppercase font-bold">{standing}</span></span>
            </div>
          </div>

          {/* Sphere 3: Career XP */}
          <div className="p-5 rounded-[2rem] bg-gradient-to-tr from-blue-500/15 to-blue-500/5 border border-blue-500/20 shadow-lg relative overflow-hidden">
            <div className="absolute top-3 right-3 text-2xl opacity-30">⚡</div>
            <span className="text-[9px] text-blue-400 font-black uppercase tracking-widest block">Total Career XP</span>
            <span className="text-3xl font-black text-white font-mono mt-2 block">{totalXP} XP</span>
            <div className="mt-3 pt-3 border-t border-blue-500/10 flex justify-between text-[10px] text-white/40 font-semibold">
              <span>To Next: <span className="text-blue-300 font-bold">{levelInfo.nextLevelXPNeeded === 0 ? 'MAX' : `${levelInfo.nextLevelXPNeeded - levelInfo.currentLevelXP} XP`}</span></span>
            </div>
          </div>

          {/* Sphere 4: Mini-games & Stories */}
          <div className="p-5 rounded-[2rem] bg-gradient-to-tr from-purple-500/15 to-purple-500/5 border border-purple-500/20 shadow-lg relative overflow-hidden">
            <div className="absolute top-3 right-3 text-2xl opacity-30">🎮</div>
            <span className="text-[9px] text-purple-400 font-black uppercase tracking-widest block">Stories & Mini-games</span>
            <span className="text-3xl font-black text-white font-mono mt-2 block">
              {completedSeriesSteps.length} 🎭 / {miniGamesCount.bakery + miniGamesCount.clinic} 🎮
            </span>
            <div className="mt-3 pt-3 border-t border-purple-500/10 flex justify-between text-[10px] text-white/40 font-semibold">
              <span>Ovens: <span className="text-purple-300 font-bold">{miniGamesCount.bakery}</span></span>
              <span>Clinics: <span className="text-purple-300 font-bold">{miniGamesCount.clinic}</span></span>
            </div>
          </div>
        </div>

        {/* ROW 3: Professional Skills Breakdown & Milestone Badges */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Skill Breakdown */}
          <div className="p-6 rounded-[2.5rem] bg-black/40 border border-white/10 backdrop-blur-md shadow-xl flex flex-col justify-between">
            <div>
              <h4 className="text-sm font-black text-white uppercase tracking-wider mb-4" style={{ fontFamily: FONT }}>
                👷 Career Skill Breakdown
              </h4>
              <div className="space-y-4">
                {[
                  { label: '👷 Builder Skills', val: skillBuilder, color: '#f97316', bg: 'bg-orange-500' },
                  { label: '🏃 Explorer Skills', val: skillExplorer, color: '#06b6d4', bg: 'bg-cyan-500' },
                  { label: '🩺 Helper/Healer Skills', val: skillHealer, color: '#ec4899', bg: 'bg-pink-500' },
                ].map((sk) => {
                  const pct = totalXP > 0 ? Math.min(100, Math.round((sk.val / totalXP) * 100)) : 0;
                  return (
                    <div key={sk.label} className="space-y-1">
                      <div className="flex justify-between text-[11px] font-bold">
                        <span className="text-white/80">{sk.label}</span>
                        <span className="text-white font-mono">{sk.val} XP ({pct}%)</span>
                      </div>
                      <div className="w-full h-3 rounded-full bg-white/5 border border-white/5 overflow-hidden">
                        <div className={`h-full ${sk.bg} rounded-full transition-all duration-1000`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <p className="text-[10px] text-white/35 leading-relaxed mt-6">
              * Skills are gained by completing tasks on the Missions Board and working at the Bakery, Clinic, or Rowan's Workshop.
            </p>
          </div>

          {/* Badges Grid */}
          <div className="p-6 rounded-[2.5rem] bg-black/40 border border-white/10 backdrop-blur-md shadow-xl">
            <h4 className="text-sm font-black text-white uppercase tracking-wider mb-4" style={{ fontFamily: FONT }}>
              🏅 Earned Milestone Badges
            </h4>
            <div className="grid grid-cols-4 gap-3">
              {ALL_BADGES.map((bg) => {
                const isEarned = earnedBadges.includes(bg.id);
                return (
                  <div
                    key={bg.id}
                    className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center gap-1.5 relative overflow-hidden group ${
                      isEarned
                        ? 'bg-gradient-to-tr from-amber-500/10 to-yellow-500/5 border-amber-400/20 shadow-md'
                        : 'bg-black/20 border-white/5 opacity-40 grayscale'
                    }`}
                    title={bg.desc}
                  >
                    <span className="text-3xl">{bg.icon}</span>
                    <span className={`text-[9px] font-bold block leading-none truncate w-full ${isEarned ? 'text-amber-300' : 'text-white/40'}`}>
                      {bg.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ROW 4: Activity Ledger & Transaction Ledger */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Last 10 Activities */}
          <div className="p-6 rounded-[2.5rem] bg-black/40 border border-white/10 backdrop-blur-md shadow-xl flex flex-col min-h-60">
            <div className="mb-4">
              <h4 className="text-sm font-black text-white uppercase tracking-wider" style={{ fontFamily: FONT }}>
                📋 Recent Activity Logs
              </h4>
              <p className="text-[10px] text-white/40 mt-0.5">
                The last 10 activities completed in the province.
              </p>
            </div>

            {lastTenActivities.length === 0 ? (
              <div className="flex-grow flex flex-col items-center justify-center text-white/30 text-xs gap-2 py-8">
                <span className="text-3xl">📋</span>
                <span>No activities logged.</span>
              </div>
            ) : (
              <div className="space-y-2 overflow-y-auto max-h-[300px] pr-1 custom-scrollbar">
                {lastTenActivities.map((act) => {
                  const isEarned = act.type === 'earned';
                  return (
                    <div key={act.id} className="p-3 bg-white/5 border border-white/5 rounded-xl flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{isEarned ? '✅' : '💸'}</span>
                        <div>
                          <span className="text-xs font-bold text-white block">{act.source}</span>
                          <span className="text-[9px] text-white/30 block font-mono">
                            {new Date(act.date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <span className={`text-xs font-black font-mono shrink-0 ${isEarned ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {isEarned ? '+' : '-'}{act.amount} 🪙
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right: Last 10 Transactions */}
          <div className="p-6 rounded-[2.5rem] bg-black/40 border border-white/10 backdrop-blur-md shadow-xl flex flex-col min-h-60 justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-sm font-black text-white uppercase tracking-wider" style={{ fontFamily: FONT }}>
                    🪙 Transaction Ledger
                  </h4>
                  <p className="text-[10px] text-white/40 mt-0.5">
                    The last 10 cash transactions processed.
                  </p>
                </div>
                <button
                  onClick={() => setSubPage('theatre')}
                  className="px-3 py-1.5 bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 text-[10px] font-black uppercase rounded-lg border border-amber-400/20 transition-all cursor-pointer"
                >
                  🎭 Theatre Hub
                </button>
              </div>

              {lastTenTransactions.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-white/30 text-xs gap-2 py-8">
                  <span className="text-3xl">🪙</span>
                  <span>No transactions logged.</span>
                </div>
              ) : (
                <div className="space-y-2 overflow-y-auto max-h-[250px] pr-1 custom-scrollbar">
                  {lastTenTransactions.map((tx) => {
                    const isEarned = tx.type === 'earned';
                    return (
                      <div key={tx.id} className="p-3 bg-white/5 border border-white/5 rounded-xl flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{isEarned ? '📥' : '📤'}</span>
                          <div>
                            <span className="text-xs font-bold text-white block">{tx.source}</span>
                            <span className="text-[9px] text-white/30 block font-mono">
                              {new Date(tx.date).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <span className={`text-xs font-black font-mono shrink-0 ${isEarned ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {isEarned ? '+' : '-'}{tx.amount} 🪙
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="mt-4 p-3 bg-white/5 border border-white/5 rounded-xl flex items-center justify-between">
              <span className="text-[9.5px] text-white/40 leading-normal">
                This transaction history is linked to your **Theatre Ticket & Play Ledger**.
              </span>
              <button
                onClick={() => setSubPage('theatre')}
                className="px-4 py-1.5 bg-white/10 hover:bg-white/15 text-white font-bold text-[10.5px] rounded-lg transition-all border border-white/5 cursor-pointer"
              >
                Open Playbill 🎭
              </button>
            </div>
          </div>
        </div>

        {/* ROW 5: Transparency & Contact Developer Form */}
        <div className="p-6 rounded-[2.5rem] bg-black/40 border border-white/10 backdrop-blur-md shadow-xl">
          <div className="flex flex-col lg:flex-row gap-6 justify-between">
            {/* Explanation / Transparency statement */}
            <div className="lg:w-1/2 text-left space-y-3">
              <h4 className="text-sm font-black text-white uppercase tracking-wider" style={{ fontFamily: FONT }}>
                🤝 Developer Transparency & Support
              </h4>
              <p className="text-xs text-white/60 leading-relaxed">
                Toffee Towns is designed with absolute transparency in mind. Every single action, transaction, XP gain, and coin change is validated in real-time on our server and logged directly in your local profile. No hidden mechanics, no surprise deductions.
              </p>
              <p className="text-xs text-white/60 leading-relaxed">
                If you ever notice any discrepancy in your balance, or if you have any questions or queries regarding the game mechanics, please write to us. The developer team is always here to assist you!
              </p>
            </div>

            {/* Contact Form */}
            <div className="lg:w-1/2 bg-white/5 border border-white/5 p-5 rounded-2xl">
              {querySent ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-6 gap-2">
                  <span className="text-3xl animate-bounce">✉️</span>
                  <span className="text-sm font-bold text-emerald-400">Message Dispatched Successfully!</span>
                  <p className="text-[11px] text-white/50 max-w-xs">
                    Thank you for your feedback. Our developers will review your ledger query and respond shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSendQuery} className="space-y-3">
                  <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 block">
                    Submit Ledger Query
                  </span>
                  <div>
                    <input
                      type="email"
                      required
                      placeholder="Your Email Address"
                      value={developerEmail}
                      onChange={(e) => setDeveloperEmail(e.target.value)}
                      className="w-full bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-amber-400 transition-colors"
                    />
                  </div>
                  <div>
                    <textarea
                      required
                      rows={3}
                      placeholder="Describe your query, question, or feedback..."
                      value={developerQuery}
                      onChange={(e) => setDeveloperQuery(e.target.value)}
                      className="w-full bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-amber-400 transition-colors resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:scale-102 active:scale-98 text-neutral-900 font-bold text-xs rounded-xl transition-all shadow-md cursor-pointer uppercase tracking-wider"
                  >
                    Send Message to Developer ✉️
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
