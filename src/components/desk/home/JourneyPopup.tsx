import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTTStore } from '../../../store/useTTStore';
import { ROLES, MILESTONES, evaluateMilestone } from '../../../data/journeyData';
import type { Milestone } from '../../../data/journeyData';
import { AchievementEffects } from './AchievementEffects';

interface JourneyPopupProps {
  isOpen: boolean;
  onClose: () => void;
  // Dynamic props to view NPC or Player progress
  playerName?: string;
  playerRoleId?: string;
  playerMilestones?: string[];
  isNPC?: boolean;
}

export const JourneyPopup: React.FC<JourneyPopupProps> = ({
  isOpen,
  onClose,
  playerName,
  playerRoleId,
  playerMilestones,
  isNPC = false
}) => {
  const state = useTTStore();
  const activeUser = state.user;
  
  // Resolve active state values based on whether it is the active player or an NPC
  const activeName = playerName || state.travellerName || activeUser?.displayName || 'Traveller';
  const activeRoleId = playerRoleId || state.currentRoleId || 'newcomer';
  const activeCompleted = playerMilestones || state.completedMilestones || [];

  const currentRole = ROLES.find(r => r.id === activeRoleId) || ROLES[0];
  
  // Selected role in the drawer inspector
  const [selectedRoleId, setSelectedRoleId] = useState<string>(activeRoleId);
  const selectedRole = ROLES.find(r => r.id === selectedRoleId) || currentRole;

  // Track promotion celebration modal
  const [promoCelebration, setPromoCelebration] = useState<{
    show: boolean;
    from: string;
    to: string;
    icon: string;
  } | null>(null);

  const [activeTab, setActiveTab] = useState<'map' | 'guide'>('map');

  // Sync selected role when active role changes (e.g. on promotion)
  useEffect(() => {
    setSelectedRoleId(activeRoleId);
  }, [activeRoleId]);

  if (!isOpen) return null;

  // Node Positions for the vertical zig-zag roadmap
  // Coordinates are defined on a 400x800 relative canvas
  const nodePositions = [
    { id: 'newcomer',    x: 120, y: 100 },
    { id: 'apprentice',  x: 280, y: 250 },
    { id: 'resident',    x: 120, y: 400 },
    { id: 'contributor', x: 280, y: 550 },
    { id: 'steward',     x: 200, y: 700 }
  ];

  // Helper to determine status of a role node
  const getRoleStatus = (roleId: string) => {
    const target = ROLES.find(r => r.id === roleId);
    const current = ROLES.find(r => r.id === activeRoleId);
    if (!target || !current) return 'frosted';
    
    if (target.orderNo < current.orderNo) return 'completed';
    if (target.orderNo === current.orderNo) return 'current';
    return 'frosted';
  };

  const selectedRoleMilestones = MILESTONES.filter(m => m.roleId === selectedRoleId);
  const selectedClaimedCount = selectedRoleMilestones.filter(m => activeCompleted.includes(m.id)).length;
  const selectedTotalCount = selectedRoleMilestones.length;
  const selectedProgressPct = selectedTotalCount > 0 
    ? Math.round((selectedClaimedCount / selectedTotalCount) * 100) 
    : 100;

  // Promotion Readiness Checker
  // All required milestones for current role must be in activeCompleted list
  const currentRoleMilestones = MILESTONES.filter(m => m.roleId === activeRoleId);
  const requiredMilestones = currentRoleMilestones.filter(m => m.required);
  const allRequiredClaimed = requiredMilestones.length > 0 && requiredMilestones.every(m => activeCompleted.includes(m.id));
  
  // Find next role for promotion action
  const currentRoleIndex = ROLES.findIndex(r => r.id === activeRoleId);
  const nextRole = currentRoleIndex !== -1 && currentRoleIndex < ROLES.length - 1 
    ? ROLES[currentRoleIndex + 1] 
    : null;

  const handleClaimReward = (m: Milestone) => {
    if (isNPC) return;
    state.claimMilestoneReward(m.id, m.xpReward, m.xpReward);
  };

  const handlePromote = () => {
    if (isNPC || !nextRole) return;
    
    // Trigger celebration state
    setPromoCelebration({
      show: true,
      from: currentRole.name,
      to: nextRole.name,
      icon: nextRole.badgeIcon
    });

    // Execute promotion in store
    state.promoteRole();
  };

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center select-none p-4 overflow-hidden">
      {/* Background overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 cursor-pointer"
      />

      {/* Main glass panel modal window */}
      <motion.div
        initial={{ scale: 0.93, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.93, opacity: 0, y: 30 }}
        className="relative z-10 w-[95vw] md:w-[85vw] h-[85vh] max-h-[85vh] rounded-[2.5rem] border border-white/20 bg-neutral-900/60 shadow-2xl flex flex-col md:flex-row overflow-hidden"
      >
        {/* Left Side: Scrollable Road Map Tree (60% width) */}
        <div className="w-full md:w-[60%] h-full flex flex-col justify-between p-6 overflow-hidden">
          {/* Header */}
          <div className="shrink-0 flex items-center justify-between border-b border-white/5 pb-3">
            <div>
              <span className="text-[9px] font-black uppercase tracking-[0.25em] text-amber-400 block font-sans">
                County Standing Records
              </span>
              <h2 
                className="text-xl md:text-2xl font-brand text-white uppercase tracking-wide leading-none mt-0.5"
                style={{ fontFamily: '"Luckiest Guy", cursive' }}
              >
                {activeName}'s Journey Roadmap
              </h2>
            </div>
            
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-full text-xs font-brand uppercase tracking-wider transition duration-200 cursor-pointer"
              style={{ fontFamily: '"Josefin Sans", sans-serif' }}
            >
              ← Back to Desk
            </button>
          </div>

          {/* Navigation Tab Bar for Roadmap Modal */}
          <div className="flex gap-4 border-b border-white/5 pb-2 mt-2 shrink-0">
            <button
              onClick={() => setActiveTab('map')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'map'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/35'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>🌳</span> Journey Path
            </button>
            <button
              onClick={() => setActiveTab('guide')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'guide'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/35'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>📖</span> How It Works
            </button>
          </div>

          {/* Content Pane: Map Path vs Educational Guide */}
          {activeTab === 'map' ? (
            <div className="flex-1 overflow-y-auto custom-scrollbar my-4 pr-1 relative min-h-0 flex justify-center bg-black/20 rounded-3xl border border-white/5 shadow-inner">
            <div className="relative w-[400px] h-[800px] shrink-0">
              
              {/* SVG connection lines between nodes */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <defs>
                  <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#fbbf24" />
                    <stop offset="100%" stopColor="#d97706" />
                  </linearGradient>
                </defs>

                {/* Draw the base connector lines */}
                {nodePositions.slice(0, -1).map((pos, i) => {
                  const nextPos = nodePositions[i + 1];
                  const segmentStatus = getRoleStatus(nextPos.id);
                  
                  const isGoldSegment = segmentStatus === 'completed' || segmentStatus === 'current';
                  
                  return (
                    <g key={i}>
                      {/* Background shadow line */}
                      <line
                        x1={pos.x}
                        y1={pos.y}
                        x2={nextPos.x}
                        y2={nextPos.y}
                        stroke="rgba(0,0,0,0.4)"
                        strokeWidth="10"
                        strokeLinecap="round"
                      />
                      {/* Foreground line */}
                      <line
                        x1={pos.x}
                        y1={pos.y}
                        x2={nextPos.x}
                        y2={nextPos.y}
                        stroke={isGoldSegment ? 'url(#goldGrad)' : 'rgba(255, 255, 255, 0.08)'}
                        strokeWidth="6"
                        strokeLinecap="round"
                        className={isGoldSegment ? 'stroke-[url(#goldGrad)]' : ''}
                        style={{
                          filter: isGoldSegment ? 'drop-shadow(0 0 8px rgba(245, 158, 11, 0.5))' : 'none'
                        }}
                      />
                      
                      {/* Particle flow stream inside gold segments */}
                      {isGoldSegment && (
                        <line
                          x1={pos.x}
                          y1={pos.y}
                          x2={nextPos.x}
                          y2={nextPos.y}
                          stroke="#fff"
                          strokeWidth="2"
                          strokeDasharray="6 20"
                          strokeLinecap="round"
                          className="opacity-75"
                          style={{
                            animation: 'dash 3s linear infinite',
                          }}
                        />
                      )}
                    </g>
                  );
                })}
              </svg>

              {/* Node Buttons */}
              {nodePositions.map((pos) => {
                const role = ROLES.find(r => r.id === pos.id)!;
                const status = getRoleStatus(pos.id);
                const isSelected = selectedRoleId === pos.id;
                
                // Color formatting
                let borderClass = 'border-white/10 bg-white/5 text-neutral-500';
                let glowStyle: React.CSSProperties = {};

                if (status === 'completed') {
                  borderClass = 'border-amber-400 bg-amber-500/10 text-amber-300';
                  glowStyle = { boxShadow: '0 0 20px rgba(245,158,11,0.25)' };
                } else if (status === 'current') {
                  borderClass = 'border-cyan-400 bg-cyan-500/15 text-cyan-200 animate-pulse';
                  glowStyle = { boxShadow: '0 0 35px rgba(34,211,238,0.5)', scale: 1.1 };
                }

                if (isSelected) {
                  glowStyle = {
                    ...glowStyle,
                    borderColor: '#ffffff',
                    boxShadow: status === 'current' 
                      ? '0 0 40px rgba(34,211,238,0.7), 0 0 0 2px white' 
                      : '0 0 30px rgba(245,158,11,0.5), 0 0 0 2px white'
                  };
                }

                return (
                  <motion.button
                    key={pos.id}
                    onClick={() => setSelectedRoleId(pos.id)}
                    whileHover={{ scale: 1.12 }}
                    whileTap={{ scale: 0.95 }}
                    className={`absolute w-14 h-14 rounded-full border-[3px] flex items-center justify-center text-2xl transition-all duration-200 cursor-pointer z-20 ${borderClass}`}
                    style={{ 
                      left: pos.x - 28, 
                      top: pos.y - 28,
                      ...glowStyle
                    }}
                  >
                    {role.badgeIcon}

                    {/* Glowing status tag */}
                    <div className="absolute top-full mt-1.5 bg-neutral-900/90 border border-white/10 px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider text-white whitespace-nowrap">
                      {role.name}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
          ) : (
            <div className="flex-1 overflow-y-auto custom-scrollbar my-4 pr-3 py-4 text-left space-y-5 bg-black/20 rounded-3xl border border-white/5 shadow-inner p-6 font-sans">
              <div className="space-y-2">
                <h3 className="text-base font-bold text-cyan-300 flex items-center gap-2">
                  <span>🎓</span> About the Citizen Journey
                </h3>
                <p className="text-xs text-neutral-350 leading-relaxed">
                  The Citizen Journey tracks your residency, skill masteries, and community standing in the sweet counties of ChocoBrook. 
                  By completing milestones, you progress through 5 sequential ranks to earn the highest municipal honor: **Town Citizen**.
                </p>
              </div>

              <div className="h-px bg-white/10" />

              <div className="space-y-3">
                <h4 className="text-[11px] font-black uppercase tracking-wider text-amber-400">
                  The 5 Citizen Ranks
                </h4>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { rank: "1. Newcomer", icon: "🌱", desc: "A recognized beginner in the valley, learning the local ways and setting up your residency." },
                    { rank: "2. Resident", icon: "🏠", desc: "You have settled into your new cottage and begun your life in Toffee Town." },
                    { rank: "3. Settler", icon: "🪵", desc: "You've put down roots, contribute regularly, and are becoming a familiar face." },
                    { rank: "4. Townsman", icon: "🏘️", desc: "The town knows and trusts you. You're an active and respected member of the community." },
                    { rank: "5. Citizen", icon: "🏛️", desc: "The highest civic honour. The Town Council officially recognizes your dedication and service to Toffee Town." },
                  ].map((tier) => (
                    <div key={tier.rank} className="flex gap-3 p-2.5 rounded-xl bg-white/5 border border-white/5 items-start">
                      <span className="text-xl shrink-0">{tier.icon}</span>
                      <div>
                        <span className="text-[12px] font-bold text-white block">{tier.rank}</span>
                        <span className="text-[10.5px] text-neutral-400 block leading-tight mt-0.5">{tier.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="h-px bg-white/10" />

              <div className="space-y-3 font-sans">
                <h4 className="text-[11px] font-black uppercase tracking-wider text-amber-400">
                  How Progression Works
                </h4>
                <div className="space-y-2.5 text-xs text-neutral-300 font-sans leading-relaxed">
                  <div className="flex gap-2">
                    <span className="text-emerald-400 font-bold shrink-0">1.</span>
                    <p>
                      <strong>Fulfill Milestones:</strong> Select any rank on the map path to view its required milestones in the right-hand panel. Required goals are tagged with a red <span className="text-red-400 font-bold text-[9px] bg-red-500/10 px-1 py-0.5 rounded">REQ</span> label.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-emerald-400 font-bold shrink-0">2.</span>
                    <p>
                      <strong>Automatic vs Roleplay Checks:</strong> Many milestones (like First Login, profile setups, and active chores) check your stats automatically. Manual tasks allow you to mark off roleplay goals when ready.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-emerald-400 font-bold shrink-0">3.</span>
                    <p>
                      <strong>Claim standing rewards:</strong> Completing a milestone allows you to claim rewards, yielding valuable <strong>Cocoa Coins</strong> and <strong>Legacy Points</strong>.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-emerald-400 font-bold shrink-0">4.</span>
                    <p>
                      <strong>Perform Rank Promotion:</strong> When all required milestones for your current rank are claimed, the bounce button <strong>"Promote to Next Rank"</strong> will unlock in the details panel, triggering high-chime animations and confetti celebrations!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="shrink-0 text-[10px] text-white/30 text-center font-sans">
            Animated line flows represent the path of active participation. Future roles stay frosted.
          </div>
        </div>

        {/* Right Side: sliding Detail Panel / Drawer (40% width) */}
        <div 
          className="w-full md:w-[40%] h-full flex flex-col justify-between border-t md:border-t-0 md:border-l border-white/10 p-6 relative overflow-hidden flex-grow"
          style={{
            backgroundColor: 'rgba(0,0,0,0.3)'
          }}
        >
          {/* Header */}
          <div className="shrink-0 border-b border-white/5 pb-3">
            <span className="text-[9px] font-black uppercase tracking-[0.25em] text-neutral-400 block font-sans">
              Role Details & Goals
            </span>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-3xl filter drop-shadow-md">{selectedRole.badgeIcon}</span>
              <h3 
                className="text-lg font-brand text-white uppercase tracking-wider leading-none"
                style={{ fontFamily: '"Luckiest Guy", cursive' }}
              >
                {selectedRole.name}
              </h3>
            </div>
            <p className="text-[11px] text-neutral-300 leading-relaxed font-sans mt-2">
              {selectedRole.description}
            </p>
          </div>

          {/* Milestone List Container */}
          <div className="flex-1 overflow-y-auto custom-scrollbar my-4 pr-1 space-y-3 min-h-0">
            {/* Progress bar info */}
            <div className="p-3 bg-white/5 border border-white/5 rounded-2xl space-y-1.5">
              <div className="flex justify-between items-center text-[10px] font-sans">
                <span className="text-neutral-400">Milestone Progress</span>
                <span className="text-amber-400 font-black">{selectedClaimedCount} / {selectedTotalCount} ({selectedProgressPct}%)</span>
              </div>
              <div className="w-full h-1.5 bg-neutral-950/60 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-300"
                  style={{ width: `${selectedProgressPct}%` }}
                />
              </div>
            </div>

            {/* Milestones list */}
            <div className="space-y-2">
              <span className="text-[8.5px] font-bold uppercase tracking-wider text-neutral-500 block px-1">
                Milestones Required for Promotion
              </span>

              {selectedRoleMilestones.map((m) => {
                const isClaimed = activeCompleted.includes(m.id);
                const isCompleted = evaluateMilestone(m, state);
                const canClaim = isCompleted && !isClaimed;
                const isManual = m.autoType === undefined;

                return (
                  <div 
                    key={m.id}
                    className={`p-3.5 rounded-2xl border transition duration-200 flex items-center justify-between gap-3 text-left font-sans
                      ${isClaimed 
                        ? 'bg-emerald-950/10 border-emerald-500/20 opacity-80' 
                        : canClaim 
                          ? 'bg-amber-500/5 border-amber-400/40 shadow-[0_0_15px_rgba(245,158,11,0.05)]' 
                          : 'bg-white/5 border-white/5'}`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[12px] font-bold text-white block truncate">{m.title}</span>
                        {m.required && (
                          <span className="text-[7.5px] bg-red-500/20 text-red-400 px-1 py-0.5 rounded font-black font-sans shrink-0">REQ</span>
                        )}
                      </div>
                      <p className="text-[10px] text-neutral-400 leading-normal mt-0.5">
                        {m.description}
                      </p>
                      
                      {/* Reward Tag */}
                      <div className="flex items-center gap-2 mt-1.5 font-mono text-[9px]">
                        <span className="text-emerald-400 font-bold">🪙 +{m.xpReward}</span>
                        <span className="text-neutral-500">|</span>
                        <span className="text-yellow-400 font-bold">🎖️ +{m.xpReward}</span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="shrink-0">
                      {isClaimed ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 font-sans">
                          ✓ Claimed
                        </span>
                      ) : isNPC ? (
                        <span className="text-[10px] font-bold text-neutral-500 italic font-sans">
                          Pending
                        </span>
                      ) : canClaim ? (
                        <button
                          onClick={() => handleClaimReward(m)}
                          className="px-3 py-1.5 bg-gradient-to-r from-amber-400 to-yellow-500 hover:brightness-110 active:scale-95 text-black text-[9.5px] font-bold rounded-xl transition cursor-pointer"
                        >
                          Claim 🪙
                        </button>
                      ) : isManual ? (
                        <button
                          onClick={() => handleClaimReward(m)}
                          className="px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:brightness-110 active:scale-95 text-black text-[9.5px] font-bold rounded-xl transition cursor-pointer"
                        >
                          Complete ✓
                        </button>
                      ) : (
                        <span className="text-[9px] font-semibold text-neutral-500 uppercase tracking-wider font-mono">
                          Locked
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Drawer Promotion Action */}
          <div className="shrink-0 border-t border-white/5 pt-4">
            {selectedRoleId === activeRoleId ? (
              nextRole ? (
                allRequiredClaimed ? (
                  <button
                    onClick={handlePromote}
                    className="w-full py-3.5 bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 hover:brightness-110 active:scale-[0.98] text-black font-brand font-black uppercase text-xs tracking-widest rounded-2xl shadow-[0_0_30px_rgba(34,211,238,0.4)] transition-all duration-200 cursor-pointer animate-bounce"
                    style={{ fontFamily: '"Josefin Sans", sans-serif' }}
                  >
                    🎉 Promote to {nextRole.name} 🎉
                  </button>
                ) : (
                  <div className="p-3 bg-neutral-900/60 border border-white/5 rounded-2xl text-[10px] text-neutral-400 leading-normal text-center italic">
                    💡 Complete all required milestones above to unlock rank promotion!
                  </div>
                )
              ) : (
                <div className="p-3 bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border border-yellow-500/20 rounded-2xl text-[11px] text-yellow-300 font-bold text-center font-sans">
                  👑 Maximum rank achieved! You are a Citizen of the Town!
                </div>
              )
            ) : (
              <button
                onClick={() => setSelectedRoleId(activeRoleId)}
                className="w-full py-2 bg-white/5 hover:bg-white/10 active:scale-95 border border-white/10 text-neutral-300 hover:text-white text-[10px] font-brand uppercase tracking-widest rounded-xl transition-all duration-150 cursor-pointer"
                style={{ fontFamily: '"Josefin Sans", sans-serif' }}
              >
                Inspect Current Rank
              </button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Confetti & Promotion modal overlay */}
      {promoCelebration && (
        <AchievementEffects
          isOpen={promoCelebration.show}
          onClose={() => {
            setPromoCelebration(null);
            // Auto close the roadmap popup on successful elevation if desired, or keep open
          }}
          fromRoleName={promoCelebration.from}
          toRoleName={promoCelebration.to}
          badgeIcon={promoCelebration.icon}
          colorTheme={ROLES.find(r => r.name === promoCelebration.to)?.colorTheme || ''}
        />
      )}

      {/* Add static CSS animations for SVG dash particles */}
      <style>{`
        @keyframes dash {
          to {
            stroke-dashoffset: -40;
          }
        }
      `}</style>
    </div>
  );
};
