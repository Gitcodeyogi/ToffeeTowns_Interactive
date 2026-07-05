import React, { useState, useEffect, useRef } from 'react';
import { useTTStore } from '../store/useTTStore';
import { FONT } from '../lib/uiConstants';

interface MapNode {
  id: string;
  displayName: string;
  fullName: string;
  emoji: string;
  x: number;
  y: number;
  glowColor: string;
  type: string;
  snippet: string;
  npcs: string[];
  details: string;
}

const NODES: MapNode[] = [
  {
    id: 'home',
    displayName: 'Residence',
    fullName: 'Mossberry Cottage (Home)',
    emoji: '🏡',
    x: 100,
    y: 220,
    glowColor: 'rgba(234, 179, 8, 0.4)',
    type: 'Residence',
    snippet: '🏠 Cottage · Rent Paid',
    npcs: ['Your Companion Pet 🐶'],
    details: 'Your cozy personal quarters. Review daily checklists and manage furniture decorations.'
  },
  {
    id: 'health',
    displayName: 'Clinic',
    fullName: 'Oakenhart Clinic',
    emoji: '🏥',
    x: 200,
    y: 90,
    glowColor: 'rgba(239, 68, 68, 0.4)',
    type: 'Clinic',
    snippet: '❤️ Dr. Cedric available',
    npcs: ['Dr. Cedric Oakenhart'],
    details: 'Medical center of Ganache Grove. Heal forest sneezles and purchase herbal remedies.'
  },
  {
    id: 'newspaper',
    displayName: 'Gazette',
    fullName: 'Gazette Office',
    emoji: '📰',
    x: 380,
    y: 90,
    glowColor: 'rgba(245, 158, 11, 0.4)',
    type: 'Economy',
    snippet: '📰 Evening Edition Out',
    npcs: ['Julie Frost'],
    details: 'Headquarters of the local news. Scan stories, leak leads, or report community updates.'
  },
  {
    id: 'classroom',
    displayName: 'Academy',
    fullName: 'Academy (Library)',
    emoji: '🏫',
    x: 580,
    y: 90,
    glowColor: 'rgba(168, 85, 247, 0.4)',
    type: 'Library',
    snippet: '🏫 Research labs open',
    npcs: ['Professor Crumblewise'],
    details: 'The institute of learning. Solve puzzles to upgrade your builder, explorer, and helper skills.'
  },
  {
    id: 'theatre',
    displayName: 'Theatre',
    fullName: 'Town Theatre',
    emoji: '🎭',
    x: 800,
    y: 150,
    glowColor: 'rgba(236, 72, 153, 0.4)',
    type: 'Theatre',
    snippet: '🎭 Honeyblueberry incident',
    npcs: ['Junia Frostwell', 'Pipkin Nutterby'],
    details: 'Stage for classic tales. Watch local plays, purchase tickets, and review audience feedback.'
  },
  {
    id: 'transport',
    displayName: 'Transit',
    fullName: 'Rail Station (Transit)',
    emoji: '🚂',
    x: 800,
    y: 310,
    glowColor: 'rgba(59, 130, 246, 0.4)',
    type: 'Transport',
    snippet: '🚂 Platform 2 · Monorail active',
    npcs: ['Birchwood Courier'],
    details: 'The transport center. Manage cargo carriage dispatch and coordinate logistics routes.'
  },
  {
    id: 'politics',
    displayName: 'Council',
    fullName: 'Town Council Chamber',
    emoji: '🏛️',
    x: 620,
    y: 390,
    glowColor: 'rgba(234, 179, 8, 0.4)',
    type: 'Economy',
    snippet: '🏛️ Ordinance Votes active',
    npcs: ['Sir Goldwhistle'],
    details: 'Civil administration chambers. Vote on municipal rules and check tax frameworks.'
  },
  {
    id: 'gossip',
    displayName: 'Gossip Corner',
    emoji: '🗣️',
    fullName: 'Gossip Corner',
    x: 380,
    y: 390,
    glowColor: 'rgba(168, 85, 247, 0.4)',
    type: 'Library',
    snippet: '🗣️ Gossip Walkway debate',
    npcs: ['Mrs. Petalworth', 'Rowan Thistle'],
    details: 'Where residents trade secrets. Listen in, eavesdrop, and solve local mysteries.'
  },
  {
    id: 'workshop',
    displayName: 'Workshop',
    fullName: 'Workshop',
    emoji: '🛠️',
    x: 180,
    y: 390,
    glowColor: 'rgba(34, 197, 94, 0.4)',
    type: 'Workshop',
    snippet: '🛠️ Crafting forge lit',
    npcs: ['Rowan Thistle'],
    details: 'Forge tools, assemble construction plates, and repair structures.'
  },
  {
    id: 'places',
    displayName: 'Landmarks',
    fullName: 'Town Landmarks',
    emoji: '🏛️',
    x: 360,
    y: 240,
    glowColor: 'rgba(59, 130, 246, 0.4)',
    type: 'Transport',
    snippet: '🏛️ 4 active sights',
    npcs: ['Tour Guides'],
    details: 'Explore historical springs and local canal gates to trigger reputation multipliers.'
  },
  {
    id: 'economy',
    displayName: 'Trade Hub',
    fullName: 'Trade & Economy Hub',
    emoji: '💰',
    x: 560,
    y: 240,
    glowColor: 'rgba(249, 115, 22, 0.4)',
    type: 'Economy',
    snippet: '📈 Pine Planks: 24 🪙',
    npcs: ['Merchant Elder'],
    details: 'Confectionery trade center. Review currency rates, leases, and local commodity stocks.'
  },
  {
    id: 'shop',
    displayName: 'Market',
    fullName: 'Town Market Hub',
    emoji: '🌾',
    x: 480,
    y: 300,
    glowColor: 'rgba(34, 197, 94, 0.4)',
    type: 'Economy',
    snippet: '🌾 Produce Trade open',
    npcs: ['Merchant Elder', 'Baker Maplewood'],
    details: 'The trading floor of Ganache Grove. Trade vegetables, fruits, and flowers for Cocoa Coins.'
  }
];

const STATION_PCTS: Record<string, number> = {
  home: 0.0,
  health: 0.086,
  newspaper: 0.188,
  classroom: 0.303,
  theatre: 0.434,
  transport: 0.526,
  politics: 0.640,
  gossip: 0.777,
  workshop: 0.891,
};

interface TownGuideModalProps {
  embedMode?: boolean;
  onClose?: () => void;
}

export const TownGuideModal: React.FC<TownGuideModalProps> = ({ embedMode = false, onClose }) => {
  const {
    currentLocation,
    taskQueue,
    addToQueue,
    completedActions,
    setShowTownGuide,
    coins,
    spendCoins,
  } = useTTStore();

  const pathRef = useRef<SVGPathElement>(null);
  const [trainPos, setTrainPos] = useState<{ x: number; y: number } | null>(null);
  const [hoveredNode, setHoveredNode] = useState<MapNode | null>(null);
  const [currentTime, setCurrentTime] = useState<number>(() => Date.now());
  const [progress, setProgress] = useState(0);

  const isTrainRoute = (fromId?: string, toId?: string): boolean => {
    if (!fromId || !toId) return false;
    const trainNodes = ['home', 'health', 'newspaper', 'classroom', 'workshop', 'transport'];
    return trainNodes.includes(fromId) && trainNodes.includes(toId);
  };

  const isBalloonRoute = (fromId?: string, toId?: string): boolean => {
    if (!fromId || !toId) return false;
    return fromId === 'politics' || fromId === 'theatre' || toId === 'politics' || toId === 'theatre';
  };

  // Time-based day/night state
  const [timeState, setTimeState] = useState(() => {
    const hrs = new Date().getHours();
    if (hrs >= 17 && hrs < 20) return 'evening';
    if (hrs >= 20 || hrs < 6) return 'night';
    return 'morning';
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now());
    }, 100);
    return () => clearInterval(timer);
  }, []);

  const activeTravelTask = taskQueue.find(t => t.type === 'travel');

  useEffect(() => {
    if (activeTravelTask && isTrainRoute(activeTravelTask.originSubPage, activeTravelTask.destinationSubPage) && pathRef.current) {
      const pOrig = STATION_PCTS[activeTravelTask.originSubPage || ''] ?? 0;
      const pDest = STATION_PCTS[activeTravelTask.destinationSubPage || ''] ?? 0;
      let diff = pDest - pOrig;
      if (diff > 0.5) diff -= 1.0;
      else if (diff < -0.5) diff += 1.0;

      const currentPct = (pOrig + diff * progress + 1.0) % 1.0;
      try {
        const totalLen = pathRef.current.getTotalLength();
        const pt = pathRef.current.getPointAtLength(currentPct * totalLen);
        setTrainPos({ x: pt.x, y: pt.y });
      } catch (e) {
        setTrainPos(null);
      }
    } else {
      setTrainPos(null);
    }
  }, [activeTravelTask, progress]);

  useEffect(() => {
    if (!activeTravelTask) {
      setProgress(0);
      return;
    }
    const elapsed = currentTime - (activeTravelTask.startedAt || currentTime);
    const pct = Math.min(1, elapsed / activeTravelTask.duration);
    setProgress(pct);
  }, [activeTravelTask, currentTime]);

  const originNode = activeTravelTask
    ? NODES.find(n => n.id === activeTravelTask.originSubPage) || NODES.find(n => n.id === 'home')
    : null;
  const destNode = activeTravelTask
    ? NODES.find(n => n.id === activeTravelTask.destinationSubPage)
    : null;

  const playerX = trainPos
    ? trainPos.x
    : originNode && destNode
    ? originNode.x + (destNode.x - originNode.x) * progress
    : null;
  const playerY = trainPos
    ? trainPos.y
    : originNode && destNode
    ? originNode.y + (destNode.y - originNode.y) * progress
    : null;

  // Day/night configs
  const getHourConfig = () => {
    if (timeState === 'evening') {
      return {
        bgClass: 'bg-[#0f0704]/95',
        overlayGrad: 'from-orange-500/10 via-transparent to-black/30',
        titleSuffix: 'Evening Lanterns 🟠',
        glowColor: '#ea580c',
      };
    } else if (timeState === 'night') {
      return {
        bgClass: 'bg-[#030612]/95',
        overlayGrad: 'from-blue-900/20 via-transparent to-black/40',
        titleSuffix: 'Moonlit Night 🔵',
        glowColor: '#1e3a8a',
      };
    } else {
      return {
        bgClass: 'bg-[#0a0d0a]/95',
        overlayGrad: 'from-amber-500/5 via-transparent to-black/20',
        titleSuffix: 'Warm Sunshine ☀️',
        glowColor: '#4d7c0f',
      };
    }
  };

  const hourConfig = getHourConfig();

  const getReputationLabel = (nodeId: string) => {
    if (nodeId === 'home') return ' Loved 🏆';
    const count = completedActions.length;
    if (count >= 4) return ' Loved 🏆';
    if (count >= 2) return ' Known 🌿';
    if (count >= 1) return ' Familiar 🧭';
    return ' Unvisited 👵';
  };

  const getReputationClass = (nodeId: string) => {
    if (nodeId === 'home') return 'text-amber-400 font-extrabold';
    const count = completedActions.length;
    if (count >= 4) return 'text-amber-400 font-extrabold';
    if (count >= 2) return 'text-emerald-400 font-extrabold';
    if (count >= 1) return 'text-cyan-400 font-extrabold';
    return 'text-neutral-500 font-bold';
  };

  // Travel action
  const handleStartTravel = (destId: string, destName: string) => {
    if (currentLocation === destId) return;
    if (activeTravelTask) return;

    const isTrain = isTrainRoute(currentLocation, destId);
    const isBalloon = isBalloonRoute(currentLocation, destId);

    const fare = isTrain ? 4 : isBalloon ? 6 : 2;
    const finalFare = Math.min(fare, coins);
    if (finalFare > 0) {
      spendCoins(finalFare, `Transit Fare: ${isTrain ? 'Monorail Train' : isBalloon ? 'Air Balloon' : 'Horse Wagon'} to ${destName}`);
    }

    let travelDuration: number;
    let distance: number;

    if (isTrain) {
      const pOrig = STATION_PCTS[currentLocation] ?? 0;
      const pDest = STATION_PCTS[destId] ?? 0;
      let diff = Math.abs(pDest - pOrig);
      if (diff > 0.5) diff = 1.0 - diff;
      distance = Math.max(100, Math.round(2400 * diff));
      travelDuration = Math.round(180000 + (diff / 0.5) * 60000); // 3 to 4 minutes (180s to 240s)
    } else {
      const startNode = NODES.find(n => n.id === currentLocation) || NODES.find(n => n.id === 'home')!;
      const endNode = NODES.find(n => n.id === destId)!;
      const dx = endNode.x - startNode.x;
      const dy = endNode.y - startNode.y;
      distance = Math.max(100, Math.round(Math.sqrt(dx * dx + dy * dy) * 2.5));
      travelDuration = isBalloon 
        ? Math.max(15000, Math.min(30000, distance * 15)) 
        : Math.max(10000, Math.min(25000, distance * 25));
    }

    const modeName = isTrain ? 'Train' : isBalloon ? 'Balloon' : 'Wagon';
    const modeIcon = isTrain ? '🚂' : isBalloon ? '🎈' : '🐎';

    addToQueue({
      name: `${modeName} to ${destName}`,
      type: 'travel',
      duration: travelDuration,
      rewardCoins: 0,
      rewardXP: 0,
      rewardXPCat: '',
      rewardLegacy: 0,
      icon: modeIcon,
      targetText: `${destName} (${modeName}: ${distance}m)`,
      destinationSubPage: destId,
      originSubPage: currentLocation,
      transitFare: finalFare,
    });

    setShowTownGuide(false);
  };

  const pathConnections = [
    { from: { x: 100, y: 220 }, to: { x: 360, y: 240 }, label: '400m' },
    { from: { x: 100, y: 220 }, to: { x: 180, y: 390 }, label: '300m' },
    { from: { x: 100, y: 220 }, to: { x: 200, y: 90 }, label: '700m' },
    { from: { x: 360, y: 240 }, to: { x: 380, y: 90 }, label: '300m' },
    { from: { x: 360, y: 240 }, to: { x: 580, y: 90 }, label: '800m' },
    { from: { x: 360, y: 240 }, to: { x: 380, y: 390 }, label: '200m' },
    { from: { x: 380, y: 390 }, to: { x: 800, y: 150 }, label: '300m' },
    { from: { x: 380, y: 390 }, to: { x: 560, y: 240 }, label: '500m' },
    { from: { x: 560, y: 240 }, to: { x: 800, y: 310 }, label: '600m' },
    { from: { x: 560, y: 240 }, to: { x: 620, y: 390 }, label: '400m' },
    { from: { x: 360, y: 240 }, to: { x: 480, y: 300 }, label: '350m' },
    { from: { x: 560, y: 240 }, to: { x: 480, y: 300 }, label: '250m' },
  ];

  if (embedMode) {
    return (
      <div className="w-full h-full relative overflow-hidden flex flex-col justify-between text-left select-none font-body">
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes mapDash {
            to { stroke-dashoffset: -30; }
          }
          .animate-map-dash {
            animation: mapDash 2s linear infinite;
          }
          @keyframes subtlePulse {
            0%, 100% { opacity: 0.15; transform: scale(1); }
            50% { opacity: 0.25; transform: scale(1.03); }
          }
          .animate-subtle-pulse {
            animation: subtlePulse 5s ease-in-out infinite;
          }
        `}} />

        <div className="w-full h-full bg-black/35 border border-white/5 rounded-3xl relative overflow-hidden flex items-center justify-center p-1 shadow-inner min-h-0">
          <div className="relative w-[900px] h-[460px] shrink-0 transform scale-[0.62] md:scale-[0.70] lg:scale-[0.80] xl:scale-[0.85] transition-transform duration-300">
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
              <defs>
                <linearGradient id="mapGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.2" />
                </linearGradient>

                <radialGradient id="forestGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
                  <stop offset="70%" stopColor="#047857" stopOpacity="0.05" />
                  <stop offset="100%" stopColor="#064e3b" stopOpacity="0" />
                </radialGradient>
              </defs>

              <circle cx="220" cy="240" r="140" fill="url(#forestGrad)" stroke="#10b981" strokeWidth="1" strokeDasharray="5,5" opacity="0.5" className="animate-subtle-pulse" />
              <circle cx="680" cy="200" r="150" fill="url(#forestGrad)" stroke="#10b981" strokeWidth="1" strokeDasharray="5,5" opacity="0.5" className="animate-subtle-pulse" />
              <circle cx="420" cy="390" r="120" fill="url(#forestGrad)" stroke="#10b981" strokeWidth="1" strokeDasharray="5,5" opacity="0.5" className="animate-subtle-pulse" />

              <text x="220" y="320" fill="#a7f3d0" fontSize="8px" fontWeight="black" letterSpacing="0.2em" opacity="0.25" textAnchor="middle">MOSSBERRY DEEPWOOD</text>
              <text x="680" y="300" fill="#a7f3d0" fontSize="8px" fontWeight="black" letterSpacing="0.2em" opacity="0.25" textAnchor="middle">CANOPY WHISPERS RESERVE</text>
              <text x="420" y="440" fill="#a7f3d0" fontSize="8px" fontWeight="black" letterSpacing="0.2em" opacity="0.25" textAnchor="middle">SOUTHERN SHADOW PINES</text>

              <path d="M 0,150 Q 250,50 430,220 T 900,320" fill="none" stroke="#0891b2" strokeWidth="8" opacity="0.06" strokeLinecap="round" />
              <path d="M 0,150 Q 250,50 430,220 T 900,320" fill="none" stroke="#22d3ee" strokeWidth="2.5" opacity="0.15" strokeLinecap="round" strokeDasharray="4,8" />
              <text x="490" y="160" fill="#22d3ee" fontSize="7.5px" fontWeight="bold" letterSpacing="0.1em" opacity="0.25" transform="rotate(15 490 160)" textAnchor="middle">CHOCOBROOK STREAM CANAL</text>

              <g opacity="0.15" fontSize="13px">
                <text x="140" y="140">🌲</text>
                <text x="110" y="310">🌲</text>
                <text x="290" y="60">🌲</text>
                <text x="620" y="130">🌲</text>
                <text x="730" y="210">🌲</text>
                <text x="700" y="380">🌲</text>
                <text x="450" y="50">🏔️</text>
                <text x="510" y="60">🏔️</text>
                <text x="250" y="340">🏡</text>
                <text x="690" y="80">🏡</text>
                <text x="325" y="185">🏮</text>
                <text x="475" y="315">🏮</text>
                <text x="725" y="255">🏮</text>
              </g>

              <g opacity="0.8">
                <text fontSize="11px" textAnchor="middle" y="4">🦊</text>
                <animateMotion dur="24s" repeatCount="indefinite" path="M 180,390 C 250,320 300,450 380,390 C 450,320 500,450 560,390" />
              </g>
              <g opacity="0.8">
                <text fontSize="9.5px" textAnchor="middle" y="4">🐿️</text>
                <animateMotion dur="19s" repeatCount="indefinite" path="M 360,240 Q 460,240 560,240 Q 460,300 360,240" />
              </g>
              <g opacity="0.8">
                <text fontSize="10.5px" textAnchor="middle" y="4">🦋</text>
                <animateMotion dur="15s" repeatCount="indefinite" path="M 800,150 Q 500,80 200,90" />
              </g>

              <path
                d="M 100,220 C 120,120 150,90 200,90 H 380 H 580 C 720,90 800,110 800,150 V 310 C 800,360 720,390 620,390 H 380 H 180 C 120,390 100,320 100,220 Z"
                fill="none"
                stroke="#06b6d4"
                strokeWidth="5"
                strokeLinecap="round"
                opacity="0.08"
              />
              <path
                d="M 100,220 C 120,120 150,90 200,90 H 380 H 580 C 720,90 800,110 800,150 V 310 C 800,360 720,390 620,390 H 380 H 180 C 120,390 100,320 100,220 Z"
                fill="none"
                stroke="#0891b2"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeDasharray="14,6"
                style={{ filter: 'drop-shadow(0 0 3px rgba(6,182,212,0.35))' }}
              />
              <path
                ref={pathRef}
                d="M 100,220 C 120,120 150,90 200,90 H 380 H 580 C 720,90 800,110 800,150 V 310 C 800,360 720,390 620,390 H 380 H 180 C 120,390 100,320 100,220 Z"
                fill="none"
                stroke="#ffffff"
                strokeWidth="0.8"
                strokeLinecap="round"
                opacity="0.6"
              />
              
              <text x="480" y="80" fill="#a5f3fc" fontSize="6px" fontWeight="bold" letterSpacing="0.1em" opacity="0.3" textAnchor="middle">GLASS MONORAIL ELEVATED HIGH-WAY SYSTEM</text>

              {pathConnections.map((path, idx) => (
                <g key={idx}>
                  <line
                    x1={path.from.x}
                    y1={path.from.y}
                    x2={path.to.x}
                    y2={path.to.y}
                    stroke="rgba(251,191,36,0.06)"
                    strokeWidth="6"
                    strokeLinecap="round"
                  />
                  <line
                    x1={path.from.x}
                    y1={path.from.y}
                    x2={path.to.x}
                    y2={path.to.y}
                    stroke="url(#mapGlow)"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeDasharray="5,15"
                    className="animate-map-dash"
                  />
                  <text
                    x={(path.from.x + path.to.x) / 2}
                    y={(path.from.y + path.to.y) / 2 - 5}
                    fill="rgba(251,191,36,0.6)"
                    fontSize="7.5px"
                    fontWeight="bold"
                    textAnchor="middle"
                    className="font-mono"
                  >
                    {path.label}
                  </text>
                </g>
              ))}
            </svg>

            {NODES.map((node) => {
              const isCurrent = currentLocation === node.id;
              const isTargeted = activeTravelTask?.destinationSubPage === node.id;

              return (
                <button
                  key={node.id}
                  onMouseEnter={() => setHoveredNode(node)}
                  onMouseLeave={() => setHoveredNode(null)}
                  onClick={() => handleStartTravel(node.id, node.fullName)}
                  className={`absolute w-[114px] h-[50px] rounded-2xl flex flex-col items-center justify-center p-1 cursor-pointer transition-all duration-300 font-sans border text-white
                    ${isCurrent ? 'ring-2 ring-cyan-400 ring-offset-1 ring-offset-black scale-105' : 'hover:scale-[1.06] hover:border-white/55'}
                  `}
                  style={{
                    left: node.x - 57,
                    top: node.y - 25,
                    background: 'rgba(0, 0, 0, 0.70)',
                    borderWidth: isCurrent ? '2px' : '1px',
                    borderColor: isCurrent ? '#22d3ee' : 'rgba(255,255,255,0.15)',
                    boxShadow: isCurrent
                      ? '0 0 20px rgba(34, 211, 238, 0.5)'
                      : isTargeted
                      ? '0 0 18px rgba(251, 191, 36, 0.6)'
                      : `0 0 10px ${node.glowColor}`,
                  }}
                >
                  <div className="flex items-center gap-1.5">
                    <span className="text-[17px]">{node.emoji}</span>
                    <span className="text-[9.5px] font-extrabold uppercase tracking-wide truncate max-w-[70px]">
                      {node.displayName}
                    </span>
                  </div>
                  
                  <span className="text-[6.5px] text-neutral-400/90 font-medium truncate max-w-[95px] leading-tight font-sans block mt-0.5 uppercase tracking-wide">
                    {node.id === 'home' ? 'Residence' : node.displayName === 'Landmarks' ? 'Sights' : node.displayName}
                  </span>

                  {isCurrent && (
                    <span className="absolute inset-0 rounded-2xl bg-cyan-400/5 animate-ping pointer-events-none" />
                  )}

                  {isCurrent && (
                    <span className="absolute -top-2.5 bg-cyan-400 text-black font-extrabold text-[6px] px-1 py-0.2 rounded uppercase tracking-wider scale-90 border border-cyan-300 shadow">
                      YOU
                    </span>
                  )}
                  
                  {isTargeted && (
                    <span className="absolute -top-2.5 bg-amber-400 text-black font-extrabold text-[6px] px-1 py-0.2 rounded uppercase tracking-wider scale-90 border border-amber-300 shadow animate-pulse">
                      DEST
                    </span>
                  )}
                </button>
              );
            })}

            {activeTravelTask && playerX !== null && playerY !== null && (
              <div
                className="absolute pointer-events-none z-30 transition-all duration-100 flex items-center justify-center"
                style={{ left: playerX - 18, top: playerY - 18, width: 36, height: 36 }}
              >
                <span className="absolute inset-0 rounded-full bg-amber-400/50 animate-ping" />
                <div className="w-8 h-8 rounded-full border-2 border-amber-300 bg-black flex items-center justify-center text-base shadow-[0_0_15px_rgba(245,158,11,0.6)]">
                  {activeTravelTask && isTrainRoute(activeTravelTask.originSubPage, activeTravelTask.destinationSubPage) 
                    ? '🚂' 
                    : activeTravelTask && (activeTravelTask.destinationSubPage === 'politics' || activeTravelTask.destinationSubPage === 'theatre' || activeTravelTask.originSubPage === 'politics' || activeTravelTask.originSubPage === 'theatre')
                    ? '🎈' 
                    : '🐎'}
                </div>
              </div>
            )}

            {hoveredNode && (
              <div
                className="absolute z-[120] bg-[#0c0d12]/95 border border-white/20 rounded-2xl p-4 shadow-2xl w-[230px] text-left pointer-events-none animate-fade-in font-sans text-white transition-all duration-200"
                style={{
                  left: hoveredNode.x > 500 ? hoveredNode.x - 290 : hoveredNode.x + 65,
                  top: hoveredNode.y - 75,
                  boxShadow: `0 10px 35px rgba(0,0,0,0.6), 0 0 15px ${hoveredNode.glowColor}`,
                }}
              >
                <div className="flex items-center gap-2 border-b border-white/10 pb-2 mb-2">
                  <span className="text-xl">{hoveredNode.emoji}</span>
                  <div>
                    <h4 className="text-[11px] font-black tracking-wide uppercase text-amber-300 font-brand">
                      {hoveredNode.fullName}
                    </h4>
                    <span className="text-[7.5px] uppercase tracking-widest text-neutral-400 font-bold block leading-none mt-0.5">
                      {hoveredNode.type} Sector
                    </span>
                  </div>
                </div>

                <p className="text-[9px] text-white/70 leading-relaxed font-sans mb-2">
                  {hoveredNode.details}
                </p>

                <div className="space-y-1 text-[8px] pt-1.5 border-t border-white/5">
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-400 font-bold">Activity:</span>
                    <span className="text-amber-250 font-medium font-mono">{hoveredNode.snippet}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-400 font-bold">People:</span>
                    <span className="text-cyan-300 font-medium truncate max-w-[125px]">
                      {hoveredNode.npcs.join(', ')}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[490] bg-black/60 flex items-center justify-center p-4 select-none animate-fade-in">
      
      {/* CSS style injected directly for map animated dashes */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes mapDash {
          to { stroke-dashoffset: -30; }
        }
        .animate-map-dash {
          animation: mapDash 2s linear infinite;
        }
        @keyframes subtlePulse {
          0%, 100% { opacity: 0.15; transform: scale(1); }
          50% { opacity: 0.25; transform: scale(1.03); }
        }
        .animate-subtle-pulse {
          animation: subtlePulse 5s ease-in-out infinite;
        }
      `}} />

      <div className={`relative ${hourConfig.bgClass} border-2 border-cyan-500/20 rounded-[2.5rem] p-7 h-[85vh] w-[95vw] max-w-5xl shadow-2xl flex flex-col justify-between text-left font-body overflow-hidden transition-all duration-500`}>
        
        {/* Day/Night Tint Layer */}
        <div className={`absolute inset-0 bg-gradient-to-tr ${hourConfig.overlayGrad} pointer-events-none z-0`} />

        {/* Header Row */}
        <div className="flex justify-between items-center border-b border-white/10 pb-3 shrink-0 z-10">
          <div>
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-cyan-400">Cocoawood County Navigation</span>
            <h2 className="text-xl md:text-2xl font-brand text-white uppercase mt-0.5" style={{ fontFamily: FONT }}>
              🗺️ Ganache Grove living Guide
            </h2>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Day / Night Switcher */}
            <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-2 py-0.5 text-[10px] text-white/70 font-semibold">
              <button 
                onClick={() => setTimeState('morning')} 
                className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${timeState === 'morning' ? 'bg-amber-500 text-black scale-110' : 'hover:bg-white/5'}`}
                title="Morning Warmth"
              >
                ☀️
              </button>
              <button 
                onClick={() => setTimeState('evening')} 
                className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${timeState === 'evening' ? 'bg-orange-500 text-black scale-110' : 'hover:bg-white/5'}`}
                title="Evening Lanterns"
              >
                🟠
              </button>
              <button 
                onClick={() => setTimeState('night')} 
                className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${timeState === 'night' ? 'bg-blue-600 text-white scale-110' : 'hover:bg-white/5'}`}
                title="Moonlit Night"
              >
                🔵
              </button>
            </div>

            <button
              onClick={() => setShowTownGuide(false)}
              className="px-4 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-full text-xs font-brand uppercase tracking-wider transition duration-200 cursor-pointer"
              style={{ fontFamily: '"Josefin Sans", sans-serif' }}
            >
              ✕ Close Map
            </button>
          </div>
        </div>

        {/* Current Location HUD */}
        <div className="my-2 p-3 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-between shrink-0 z-10 font-sans">
          <div className="flex items-center gap-2">
            <span className="text-xl animate-pulse">📍</span>
            <div>
              <span className="text-[8px] font-bold text-neutral-400 uppercase tracking-widest block">Current Position</span>
              <span className="text-xs font-bold text-white uppercase flex items-center gap-1.5">
                <span>
                  {currentLocation === 'home' ? 'Mossberry Cottage (Home)' :
                   NODES.find(n => n.id === currentLocation)?.fullName || 'Ganache Grove'}
                </span>
                <span className="text-[9.5px] text-neutral-400 font-normal">
                  ({hourConfig.titleSuffix})
                </span>
              </span>
            </div>
          </div>
          
          <div className="flex gap-2">
            {activeTravelTask && (
              <span className="text-[9px] bg-cyan-500/20 text-cyan-300 font-bold px-2 py-1 rounded-lg uppercase tracking-wider font-mono">
                Traveling to {activeTravelTask.name.replace('Travel to ', '')}... {Math.round(progress * 100)}%
              </span>
            )}
            <span className="text-[9px] bg-amber-500/20 text-amber-300 font-bold px-2 py-1 rounded-lg uppercase tracking-wider font-mono">
              {activeTravelTask ? 'In Transit 🚶' : 'Settle Down 🏡'}
            </span>
          </div>
        </div>

        {/* Living Map Grid (SVG & Frosted Nodes) */}
        <div className="flex-1 my-2 bg-black/45 border border-white/5 rounded-3xl relative overflow-hidden flex items-center justify-center p-2 min-h-0 z-10 shadow-inner">
          <div className="relative w-[900px] h-[460px] shrink-0 transform scale-[0.65] sm:scale-75 md:scale-[0.88] lg:scale-100 transition-transform duration-300">
            
            {/* SVG CANVAS LAYERS */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
              <defs>
                <linearGradient id="mapGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.2" />
                </linearGradient>

                <radialGradient id="forestGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
                  <stop offset="70%" stopColor="#047857" stopOpacity="0.05" />
                  <stop offset="100%" stopColor="#064e3b" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* LAYER 1: Forest Sectors */}
              <circle cx="220" cy="240" r="140" fill="url(#forestGrad)" stroke="#10b981" strokeWidth="1" strokeDasharray="5,5" opacity="0.5" className="animate-subtle-pulse" />
              <circle cx="680" cy="200" r="150" fill="url(#forestGrad)" stroke="#10b981" strokeWidth="1" strokeDasharray="5,5" opacity="0.5" className="animate-subtle-pulse" />
              <circle cx="420" cy="390" r="120" fill="url(#forestGrad)" stroke="#10b981" strokeWidth="1" strokeDasharray="5,5" opacity="0.5" className="animate-subtle-pulse" />

              {/* Forest Area Labelings */}
              <text x="220" y="320" fill="#a7f3d0" fontSize="8px" fontWeight="black" letterSpacing="0.2em" opacity="0.25" textAnchor="middle">MOSSBERRY DEEPWOOD</text>
              <text x="680" y="300" fill="#a7f3d0" fontSize="8px" fontWeight="black" letterSpacing="0.2em" opacity="0.25" textAnchor="middle">CANOPY WHISPERS RESERVE</text>
              <text x="420" y="440" fill="#a7f3d0" fontSize="8px" fontWeight="black" letterSpacing="0.2em" opacity="0.25" textAnchor="middle">SOUTHERN SHADOW PINES</text>

              {/* LAYER 2: Canal River Stream winding across town */}
              <path d="M 0,150 Q 250,50 430,220 T 900,320" fill="none" stroke="#0891b2" strokeWidth="8" opacity="0.06" strokeLinecap="round" />
              <path d="M 0,150 Q 250,50 430,220 T 900,320" fill="none" stroke="#22d3ee" strokeWidth="2.5" opacity="0.15" strokeLinecap="round" strokeDasharray="4,8" />
              <text x="490" y="160" fill="#22d3ee" fontSize="7.5px" fontWeight="bold" letterSpacing="0.1em" opacity="0.25" transform="rotate(15 490 160)" textAnchor="middle">CHOCOBROOK STREAM CANAL</text>

              {/* Faint Decorative Assets */}
              <g opacity="0.15" fontSize="13px">
                <text x="140" y="140">🌲</text>
                <text x="110" y="310">🌲</text>
                <text x="290" y="60">🌲</text>
                <text x="620" y="130">🌲</text>
                <text x="730" y="210">🌲</text>
                <text x="700" y="380">🌲</text>
                <text x="450" y="50">🏔️</text>
                <text x="510" y="60">🏔️</text>
                <text x="250" y="340">🏡</text>
                <text x="690" y="80">🏡</text>
                <text x="325" y="185">🏮</text>
                <text x="475" y="315">🏮</text>
                <text x="725" y="255">🏮</text>
              </g>

              {/* LAYER 3: Animated Citizens traveling on invisible paths */}
              <g opacity="0.8">
                <text fontSize="11px" textAnchor="middle" y="4">🦊</text>
                <animateMotion dur="24s" repeatCount="indefinite" path="M 180,390 C 250,320 300,450 380,390 C 450,320 500,450 560,390" />
              </g>
              <g opacity="0.8">
                <text fontSize="9.5px" textAnchor="middle" y="4">🐿️</text>
                <animateMotion dur="19s" repeatCount="indefinite" path="M 360,240 Q 460,240 560,240 Q 460,300 360,240" />
              </g>
              <g opacity="0.8">
                <text fontSize="10.5px" textAnchor="middle" y="4">🦋</text>
                <animateMotion dur="15s" repeatCount="indefinite" path="M 800,150 Q 500,80 200,90" />
              </g>

              {/* LAYER 4: Monorail Track Loop */}
              <path
                d="M 100,220 C 120,120 150,90 200,90 H 380 H 580 C 720,90 800,110 800,150 V 310 C 800,360 720,390 620,390 H 380 H 180 C 120,390 100,320 100,220 Z"
                fill="none"
                stroke="#06b6d4"
                strokeWidth="5"
                strokeLinecap="round"
                opacity="0.08"
              />
              <path
                d="M 100,220 C 120,120 150,90 200,90 H 380 H 580 C 720,90 800,110 800,150 V 310 C 800,360 720,390 620,390 H 380 H 180 C 120,390 100,320 100,220 Z"
                fill="none"
                stroke="#0891b2"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeDasharray="14,6"
                style={{ filter: 'drop-shadow(0 0 3px rgba(6,182,212,0.35))' }}
              />
              <path
                ref={pathRef}
                d="M 100,220 C 120,120 150,90 200,90 H 380 H 580 C 720,90 800,110 800,150 V 310 C 800,360 720,390 620,390 H 380 H 180 C 120,390 100,320 100,220 Z"
                fill="none"
                stroke="#ffffff"
                strokeWidth="0.8"
                strokeLinecap="round"
                opacity="0.6"
              />
              
              {/* Monorail Label */}
              <text x="480" y="80" fill="#a5f3fc" fontSize="6px" fontWeight="bold" letterSpacing="0.1em" opacity="0.3" textAnchor="middle">GLASS MONORAIL ELEVATED HIGH-WAY SYSTEM</text>

              {/* LAYER 5: Walking Connectors */}
              {pathConnections.map((path, idx) => (
                <g key={idx}>
                  <line
                    x1={path.from.x}
                    y1={path.from.y}
                    x2={path.to.x}
                    y2={path.to.y}
                    stroke="rgba(251,191,36,0.06)"
                    strokeWidth="6"
                    strokeLinecap="round"
                  />
                  <line
                    x1={path.from.x}
                    y1={path.from.y}
                    x2={path.to.x}
                    y2={path.to.y}
                    stroke="url(#mapGlow)"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeDasharray="5,15"
                    className="animate-map-dash"
                  />
                  {/* Distance Text Tag */}
                  <text
                    x={(path.from.x + path.to.x) / 2}
                    y={(path.from.y + path.to.y) / 2 - 5}
                    fill="rgba(251,191,36,0.6)"
                    fontSize="7.5px"
                    fontWeight="bold"
                    textAnchor="middle"
                    className="font-mono"
                  >
                    {path.label}
                  </text>
                </g>
              ))}
            </svg>

            {/* LAYER 6: Frosted Glass Capsule Nodes */}
            {NODES.map((node) => {
              const isCurrent = currentLocation === node.id;
              const isTargeted = activeTravelTask?.destinationSubPage === node.id;

              return (
                <button
                  key={node.id}
                  onMouseEnter={() => setHoveredNode(node)}
                  onMouseLeave={() => setHoveredNode(null)}
                  onClick={() => handleStartTravel(node.id, node.fullName)}
                  className={`absolute w-[114px] h-[50px] rounded-2xl flex flex-col items-center justify-center p-1 cursor-pointer transition-all duration-300 font-sans border text-white
                    ${isCurrent ? 'ring-2 ring-cyan-400 ring-offset-1 ring-offset-black scale-105' : 'hover:scale-[1.06] hover:border-white/50'}
                  `}
                  style={{
                    left: node.x - 57,
                    top: node.y - 25,
                    background: 'rgba(0, 0, 0, 0.60)',
                    borderWidth: isCurrent ? '2px' : '1px',
                    borderColor: isCurrent ? '#22d3ee' : 'rgba(255,255,255,0.15)',
                    boxShadow: isCurrent
                      ? '0 0 20px rgba(34, 211, 238, 0.5)'
                      : isTargeted
                      ? '0 0 18px rgba(251, 191, 36, 0.6)'
                      : `0 0 10px ${node.glowColor}`,
                  }}
                >
                  <div className="flex items-center gap-1.5">
                    <span className="text-[17px]">{node.emoji}</span>
                    <span className="text-[9.5px] font-extrabold uppercase tracking-wide truncate max-w-[70px]">
                      {node.displayName}
                    </span>
                  </div>
                  
                  {/* Small Live Snippet */}
                  <span className="text-[6.5px] text-neutral-400/90 font-medium truncate max-w-[95px] leading-tight font-sans block mt-0.5 uppercase tracking-wide">
                    {node.id === 'home' ? 'Residence' : node.displayName === 'Landmarks' ? 'Sights' : node.displayName}
                  </span>

                  {/* Pulsing ring inside button if player matches active location */}
                  {isCurrent && (
                    <span className="absolute inset-0 rounded-2xl bg-cyan-400/5 animate-ping pointer-events-none" />
                  )}

                  {isCurrent && (
                    <span className="absolute -top-2.5 bg-cyan-400 text-black font-extrabold text-[6px] px-1 py-0.2 rounded uppercase tracking-wider scale-90 border border-cyan-300 shadow">
                      YOU
                    </span>
                  )}
                  
                  {isTargeted && (
                    <span className="absolute -top-2.5 bg-amber-400 text-black font-extrabold text-[6px] px-1 py-0.2 rounded uppercase tracking-wider scale-90 border border-amber-300 shadow animate-pulse">
                      DEST
                    </span>
                  )}
                </button>
              );
            })}

            {/* LAYER 7: Real-Time Travel Indicator pin overlay */}
            {activeTravelTask && playerX !== null && playerY !== null && (
              <div
                className="absolute pointer-events-none z-30 transition-all duration-100 flex items-center justify-center"
                style={{ left: playerX - 18, top: playerY - 18, width: 36, height: 36 }}
              >
                {/* Ping Ring */}
                <span className="absolute inset-0 rounded-full bg-amber-400/50 animate-ping" />
                {/* Avatar Icon */}
                <div className="w-8 h-8 rounded-full border-2 border-amber-300 bg-black flex items-center justify-center text-base shadow-[0_0_15px_rgba(245,158,11,0.6)]">
                  {activeTravelTask && isTrainRoute(activeTravelTask.originSubPage, activeTravelTask.destinationSubPage) 
                    ? '🚂' 
                    : activeTravelTask && (activeTravelTask.destinationSubPage === 'politics' || activeTravelTask.destinationSubPage === 'theatre' || activeTravelTask.originSubPage === 'politics' || activeTravelTask.originSubPage === 'theatre')
                    ? '🎈' 
                    : '🐎'}
                </div>
              </div>
            )}

            {/* LAYER 8: Hover Details Glass Card Popup */}
            {hoveredNode && (
              <div
                className="absolute z-[120] bg-[#0c0d12]/95 border border-white/20 rounded-2xl p-4 shadow-2xl w-[230px] text-left pointer-events-none animate-fade-in font-sans text-white transition-all duration-200"
                style={{
                  left: hoveredNode.x + 65,
                  top: hoveredNode.y - 75,
                  boxShadow: `0 10px 35px rgba(0,0,0,0.6), 0 0 15px ${hoveredNode.glowColor}`,
                }}
              >
                <div className="flex items-center gap-2 border-b border-white/10 pb-2 mb-2">
                  <span className="text-xl">{hoveredNode.emoji}</span>
                  <div>
                    <h4 className="text-[11px] font-black tracking-wide uppercase text-amber-300 font-brand">
                      {hoveredNode.fullName}
                    </h4>
                    <span className="text-[7.5px] uppercase tracking-widest text-neutral-400 font-bold block leading-none mt-0.5">
                      {hoveredNode.type} Sector
                    </span>
                  </div>
                </div>

                <p className="text-[9.5px] text-white/70 leading-relaxed font-sans mb-2.5">
                  {hoveredNode.details}
                </p>

                <div className="space-y-1.5 text-[8.5px] pt-1.5 border-t border-white/5">
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-450 font-bold">Activity:</span>
                    <span className="text-amber-200 font-medium font-mono">{hoveredNode.snippet}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-450 font-bold">People:</span>
                    <span className="text-cyan-300 font-medium truncate max-w-[125px]">
                      {hoveredNode.npcs.join(', ')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-450 font-bold">Reputation:</span>
                    <span className={getReputationClass(hoveredNode.id)}>
                      {getReputationLabel(hoveredNode.id)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Travel warning / description */}
        <p className="text-[9.5px] text-neutral-400 text-center shrink-0 z-10 font-sans">
          *Select any frosted glass node destination to begin traveling. Traveling creates an active transit queue card at the bottom right.
        </p>
      </div>
    </div>
  );
};
