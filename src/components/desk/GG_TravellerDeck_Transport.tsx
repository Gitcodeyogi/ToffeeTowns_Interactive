import React, { useState, useEffect } from 'react';
import { useTTStore } from '../../store/useTTStore';
import { GG_TravellerDeck_Header } from './GG_TravellerDeck_Header';
import { FONT, type SubPage } from '../../lib/uiConstants';
import { cozyAudio } from '../../utils/audioHelper';
import { ECONOMY_CONFIG } from '../../constants/economyConfig';

interface Props {
  setSubPage: (p: SubPage) => void;
  popPage: () => void;
  triggerFeedback: (msg: string) => void;
}

const STATIONS = [
  { id: 'residence', name: 'Mossberry Residence 🏡', coords: { x: 15, y: 25 } },
  { id: 'wharf', name: 'Mossberry Wharf ⚓', coords: { x: 85, y: 30 } },
  { id: 'gossip', name: 'Gossip Corner 🗣️', coords: { x: 25, y: 75 } },
  { id: 'elder_tree', name: 'Sacred Elder Tree 🌳', coords: { x: 50, y: 85 } },
  { id: 'market', name: 'Market Square 🛒', coords: { x: 55, y: 50 } },
  { id: 'academy', name: 'Ganache Academy 🎓', coords: { x: 80, y: 70 } },
];

export const GG_TravellerDeck_Transport: React.FC<Props> = ({
  setSubPage,
  popPage,
  triggerFeedback,
}) => {
  const {
    coins,
    ownedTransports,
    activeTransport,
    buyTransport,
    setTransport,
    addSkillXP,
    addCoins,
    spendCoins,
    goldenCitizenPass,
  } = useTTStore();

  // Transit Calculator State
  const [departStation, setDepartStation] = useState<string>('residence');
  const [arriveStation, setArriveStation] = useState<string>('market');
  const [isTravelling, setIsTravelling] = useState<boolean>(false);
  const [travelProgress, setTravelProgress] = useState<number>(0);
  const [travelLog, setTravelLog] = useState<string[]>(() => {
    const saved = localStorage.getItem('tt_travel_logs');
    return saved ? JSON.parse(saved) : [];
  });

  // Cargo Dispatch State
  const [cargoStatus, setCargoStatus] = useState<'idle' | 'shipping' | 'ready'>('idle');
  const [cargoSecondsLeft, setCargoSecondsLeft] = useState<number>(0);
  const [dispatchLog, setDispatchLog] = useState<string[]>(() => {
    const saved = localStorage.getItem('tt_dispatch_logs');
    return saved ? JSON.parse(saved) : [];
  });

  // Save logs helper
  const saveLogs = (key: string, data: string[]) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  // Speed factor helper
  const getSpeedFactor = (t: string) => {
    switch (t) {
      case 'horse-wagon': return 2;
      case 'forest-train': return goldenCitizenPass ? 6 : 4;
      default: return 1;
    }
  };

  const getTransportEmoji = (t: string) => {
    switch (t) {
      case 'horse-wagon': return '🐎';
      case 'forest-train': return goldenCitizenPass ? '👑' : '🚝';
      case 'hot-air-balloon': return '🎈';
      default: return '🚶';
    }
  };

  const activeEmoji = getTransportEmoji(activeTransport);

  const getDistance = (s1: string, s2: string) => {
    const st1 = STATIONS.find(s => s.id === s1);
    const st2 = STATIONS.find(s => s.id === s2);
    if (!st1 || !st2) return 0;
    const dx = st1.coords.x - st2.coords.x;
    const dy = st1.coords.y - st2.coords.y;
    return Math.round(Math.sqrt(dx * dx + dy * dy));
  };

  const currentDistance = getDistance(departStation, arriveStation);
  const travelDuration = Math.max(2, Math.round(currentDistance / (getSpeedFactor(activeTransport) * 2)));

  // Route Calculator Timer Effect
  useEffect(() => {
    if (!isTravelling) return;
    const timer = setInterval(() => {
      setTravelProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setIsTravelling(false);
          addSkillXP('explorer', 15);
          triggerFeedback('📍 Arrived at destination! Gained +15 Explorer XP.');
          const depName = STATIONS.find(s => s.id === departStation)?.name.split(' ')[0] || '';
          const arrName = STATIONS.find(s => s.id === arriveStation)?.name.split(' ')[0] || '';
          const nextLog = [
            `Arrived at ${arrName} from ${depName} via ${activeTransport.replace('-', ' ')} (${currentDistance} miles). +15 Explorer XP.`,
            ...travelLog.slice(0, 4)
          ];
          setTravelLog(nextLog);
          saveLogs('tt_travel_logs', nextLog);
          return 100;
        }
        return prev + (100 / travelDuration);
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isTravelling, travelDuration, departStation, arriveStation, activeTransport, currentDistance, addSkillXP, triggerFeedback, travelLog]);

  // Cargo Dispatch Timer Effect
  useEffect(() => {
    if (cargoStatus !== 'shipping') return;
    const timer = setInterval(() => {
      setCargoSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCargoStatus('ready');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [cargoStatus]);

  const handleStartTravel = () => {
    if (departStation === arriveStation) {
      triggerFeedback('❌ Departure and Arrival stations must be different!');
      return;
    }

    // Determine travel cost
    let cost = 0;
    let modeName = 'Walking';
    if (activeTransport === 'forest-train') {
      cost = ECONOMY_CONFIG.MONORAIL_COST;
      modeName = 'Glass Monorail';
    } else if (activeTransport === 'horse-wagon') {
      cost = ECONOMY_CONFIG.HORSE_WAGON_COST;
      modeName = 'Caramel Wagon';
    }

    if (cost > 0 && !goldenCitizenPass) {
      if (coins < cost) {
        triggerFeedback(`❌ Need ${cost} Coins for the ${modeName} fare!`);
        return;
      }
      spendCoins(cost, `Transit Fare: ${modeName} to ${arriveStation}`);
    }

    cozyAudio.playRailwayStationSound();
    setIsTravelling(true);
    setTravelProgress(0);
    if (goldenCitizenPass && cost > 0) {
      triggerFeedback(`🚝 Started transit via ${modeName}. Free via Golden Pass!`);
    } else if (cost > 0) {
      triggerFeedback(`🚝 Started transit via ${modeName}. Paid ${cost} Coins fare.`);
    } else {
      triggerFeedback('🚶 Started walking. Safe travels!');
    }
  };

  const handleStartDispatch = () => {
    const baseTime = 20;
    const actualTime = Math.round(baseTime / getSpeedFactor(activeTransport));
    cozyAudio.playRailwayStationSound();
    setCargoSecondsLeft(actualTime);
    setCargoStatus('shipping');
    triggerFeedback('🚝 Cargo monorail pod dispatched!');
  };

  const handleClaimCargoRewards = () => {
    addCoins(8, 'Cargo Dispatch Run'); // Reduced from 30 to 8 coins
    addSkillXP('builder', 20);
    setCargoStatus('idle');
    triggerFeedback('🪙 Cargo delivered! Earned 8 Coins & +20 Builder XP.');
    const nextLog = [
      `Delivered 4 crates of velvet cocoa cream to the Wharf. Earned 8🪙 & +20 Builder XP!`,
      ...dispatchLog.slice(0, 4)
    ];
    setDispatchLog(nextLog);
    saveLogs('tt_dispatch_logs', nextLog);
  };

  return (
    <div className="w-full flex-grow flex flex-col min-h-0 overflow-hidden text-white font-sans">
      {/* Header */}
      <GG_TravellerDeck_Header
        title="🚝 TRANSPORT & CANOPY LOGISTICS"
        setSubPage={setSubPage}
        popPage={popPage}
      />

      {/* Main Grid */}
      <div className="flex-grow min-h-0 overflow-y-auto custom-scrollbar grid grid-cols-1 xl:grid-cols-3 gap-5 py-3 pr-1">
        
        {/* LEFT: Depot & Upgrades (33%) */}
        <div className="bg-black/60 border border-amber-500/20 rounded-[2rem] p-5 flex flex-col justify-between shadow-xl">
          <div>
            <span className="text-[9px] font-black uppercase tracking-[0.25em] text-cyan-400 block mb-2">Canopy Transit Depot</span>
            
            <div className="p-4 bg-white/5 border border-white/5 rounded-2xl flex items-center gap-3">
              <span className="text-4xl">{activeEmoji}</span>
              <div>
                <span className="text-[8px] font-black uppercase text-neutral-400 block">Equipped Transport</span>
                <h4 className="font-brand text-yellow-300 text-sm uppercase leading-none mt-1" style={{ fontFamily: FONT }}>
                  {activeTransport.replace('-', ' ')}
                </h4>
                <p className="text-[10px] text-white/50 mt-1">Transit speed factor: {getSpeedFactor(activeTransport)}x</p>
              </div>
            </div>

            {/* Upgrades */}
            <h5 className="text-[9.5px] font-black uppercase tracking-wider text-pink-400 mt-5 mb-2">Acquire Vehicles</h5>
            <div className="space-y-3">
              {/* Horse Wagon */}
              {(() => {
                const isOwned = ownedTransports.includes('horse-wagon');
                const isActive = activeTransport === 'horse-wagon';
                return (
                  <div className="p-3 bg-neutral-900/60 border border-white/5 rounded-2xl flex items-center justify-between gap-2 text-xs">
                    <div>
                      <h6 className="font-bold text-white">Caramel Wagon 🐎</h6>
                      <p className="text-[9.5px] text-white/45 mt-0.5">2x Speed · Classic carriage and a caramel pony</p>
                    </div>
                    {isOwned ? (
                      <button
                        onClick={() => {
                          cozyAudio.playClick();
                          setTransport('horse-wagon');
                        }}
                        disabled={isActive}
                        className={`px-3 py-1 rounded-xl text-[9px] uppercase font-black tracking-wider transition ${
                          isActive ? 'bg-emerald-600/35 border border-emerald-500/40 text-emerald-300' : 'bg-neutral-800 text-white/60 hover:bg-neutral-700'
                        }`}
                        style={{ fontFamily: '"Josefin Sans", sans-serif' }}
                      >
                        {isActive ? 'Active' : 'Equip'}
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          if (buyTransport('horse-wagon', 80)) {
                            triggerFeedback('🛒 Purchased Caramel Wagon!');
                          } else {
                            triggerFeedback('❌ Need 80 Coins!');
                          }
                        }}
                        className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-black font-black text-[9px] uppercase rounded-xl tracking-wider transition cursor-pointer"
                        style={{ fontFamily: '"Josefin Sans", sans-serif' }}
                      >
                        80🪙
                      </button>
                    )}
                  </div>
                );
              })()}

              {/* Glass Monorail */}
              {(() => {
                const isOwned = ownedTransports.includes('forest-train');
                const isActive = activeTransport === 'forest-train';
                return (
                  <div className="p-3 bg-neutral-900/60 border border-white/5 rounded-2xl flex items-center justify-between gap-2 text-xs">
                    <div>
                      <h6 className="font-bold text-white">Glass Monorail Pod 🚝</h6>
                      <p className="text-[9.5px] text-white/45 mt-0.5">4x Speed · Suspended monorail lines access</p>
                    </div>
                    {isOwned ? (
                      <button
                        onClick={() => {
                          cozyAudio.playRailwayStationSound();
                          setTransport('forest-train');
                        }}
                        disabled={isActive}
                        className={`px-3 py-1 rounded-xl text-[9px] uppercase font-black tracking-wider transition ${
                          isActive ? 'bg-emerald-600/35 border border-emerald-500/40 text-emerald-300' : 'bg-neutral-800 text-white/60 hover:bg-neutral-700'
                        }`}
                        style={{ fontFamily: '"Josefin Sans", sans-serif' }}
                      >
                        {isActive ? 'Active' : 'Equip'}
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          if (buyTransport('forest-train', 150)) {
                            triggerFeedback('🛒 Purchased Glass Monorail Pod!');
                          } else {
                            triggerFeedback('❌ Need 150 Coins!');
                          }
                        }}
                        className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-black font-black text-[9px] uppercase rounded-xl tracking-wider transition cursor-pointer"
                        style={{ fontFamily: '"Josefin Sans", sans-serif' }}
                      >
                        150🪙
                      </button>
                    )}
                  </div>
                );
              })()}

              {/* Private Golden Cabin Monorail perk */}
              <div className={`p-3 rounded-2xl border flex items-center justify-between gap-2 text-xs transition ${
                goldenCitizenPass ? 'bg-gradient-to-br from-neutral-900 via-amber-950/20 to-neutral-950 border-amber-400/40' : 'bg-neutral-900/40 border-white/5 opacity-80'
              }`}>
                <div>
                  <h6 className="font-bold text-white flex items-center gap-1">
                    Private Golden Cabin 👑
                  </h6>
                  <p className="text-[9.5px] text-white/45 mt-0.5 font-sans">
                    {goldenCitizenPass ? '6x Speed · Elite private monorail compartment' : '6x Speed · Exclusive Monorail perk'}
                  </p>
                </div>
                {goldenCitizenPass ? (
                  <button
                    onClick={() => {
                      cozyAudio.playRailwayStationSound();
                      setTransport('forest-train');
                      triggerFeedback('👑 Private Golden Monorail Cabin equipped!');
                    }}
                    disabled={activeTransport === 'forest-train'}
                    className={`px-3 py-1 rounded-xl text-[9px] uppercase font-black tracking-wider transition ${
                      activeTransport === 'forest-train' ? 'bg-emerald-600/35 border border-emerald-500/40 text-emerald-300' : 'bg-neutral-800 text-white/60 hover:bg-neutral-700'
                    }`}
                    style={{ fontFamily: '"Josefin Sans", sans-serif' }}
                  >
                    {activeTransport === 'forest-train' ? 'Active' : 'Equip'}
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setSubPage('shop' as any);
                      triggerFeedback('🔒 Private Cabin is exclusive to Golden Citizen Pass holders!');
                    }}
                    className="px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-black font-black text-[9px] uppercase rounded-xl tracking-wider transition cursor-pointer"
                    style={{ fontFamily: '"Josefin Sans", sans-serif' }}
                  >
                    Get Pass
                  </button>
                )}
              </div>

              {/* Hot Air Balloon Prohibited Warning */}
              <div className="p-3 bg-red-950/20 border border-red-500/20 rounded-2xl flex flex-col gap-1 text-xs">
                <div className="flex justify-between items-center">
                  <h6 className="font-bold text-red-300">Hot Air Balloon 🎈</h6>
                  <span className="px-1.5 py-0.5 bg-red-500/20 text-red-400 rounded text-[7.5px] font-bold uppercase tracking-wider">RESTRICTED</span>
                </div>
                <p className="text-[9.5px] text-red-200/50 leading-normal">
                  Balloon flight is illegal inside the grove due to overhead branch entanglement hazards.
                </p>
              </div>
            </div>
          </div>

          <div className="text-[10px] text-white/40 text-center border-t border-white/5 pt-3">
            Liquid Funds: <span className="text-amber-400 font-bold font-mono">🪙 {coins}</span>
          </div>
        </div>

        {/* MIDDLE: Visual Map & Route Calculator (34%) */}
        <div className="bg-black/60 border border-amber-500/20 rounded-[2rem] p-5 flex flex-col justify-between shadow-xl">
          <div>
            <span className="text-[9px] font-black uppercase tracking-[0.25em] text-cyan-400 block mb-2">Transit Control</span>
            
            {/* Visual Station Map */}
            <div className="relative h-36 w-full bg-neutral-950/80 border border-white/5 rounded-2xl overflow-hidden mb-4 shadow-inner">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-neutral-900 via-neutral-950 to-black opacity-80" />
              {/* Connecting Monorail Lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <path d="M 50,110 L 160,110 L 250,70 L 160,35 L 50,35 Z" fill="none" stroke="rgba(6, 182, 212, 0.15)" strokeWidth="3" strokeDasharray="5,5" />
                <path d="M 50,35 L 130,70 L 250,70" fill="none" stroke="rgba(245, 158, 11, 0.15)" strokeWidth="2" />
              </svg>

              {/* Station Dots */}
              {STATIONS.map((st) => {
                const isDepart = st.id === departStation;
                const isArrive = st.id === arriveStation;
                return (
                  <div
                    key={st.id}
                    className="absolute transition-all duration-300"
                    style={{ left: `${st.coords.x}%`, top: `${st.coords.y}%` }}
                    title={st.name}
                  >
                    <div
                      onClick={() => {
                        if (isTravelling) return;
                        cozyAudio.playClick();
                        if (departStation === st.id) {
                          triggerFeedback(`ℹ️ Already set as departure station.`);
                        } else if (arriveStation === st.id) {
                          setArriveStation(departStation);
                          setDepartStation(st.id);
                          triggerFeedback(`🔄 Swapped departure and arrival stations!`);
                        } else {
                          setArriveStation(st.id);
                          triggerFeedback(`📍 Set arrival destination to ${st.name.split(' ')[0]}`);
                        }
                      }}
                      className={`w-4 h-4 rounded-full flex items-center justify-center -translate-x-2 -translate-y-2 cursor-pointer relative group`}
                    >
                      <span className={`absolute inset-0 rounded-full animate-ping opacity-75 ${
                        isDepart 
                          ? 'bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.6)]' 
                          : isArrive 
                            ? 'bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.6)]' 
                            : 'bg-amber-500/30'
                      }`} />
                      <span className={`w-2.5 h-2.5 rounded-full relative z-10 border transition-all ${
                        isDepart 
                          ? 'bg-emerald-400 border-emerald-200 shadow-[0_0_8px_#34d399]' 
                          : isArrive 
                            ? 'bg-cyan-300 border-cyan-100 shadow-[0_0_8px_#67e8f9]' 
                            : 'bg-amber-600 border-transparent hover:bg-amber-400'
                      }`} />
                      <span className="absolute left-4 -translate-y-1 bg-black/90 px-2 py-1 rounded text-[8px] border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 font-bold uppercase tracking-wider">
                        {st.name.split(' ')[0]}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[8px] font-bold uppercase text-neutral-400 block mb-1">Departure</label>
                  <select
                    value={departStation}
                    onChange={(e) => setDepartStation(e.target.value)}
                    disabled={isTravelling}
                    className="w-full bg-neutral-900 border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                  >
                    {STATIONS.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-[8px] font-bold uppercase text-neutral-400 block mb-1">Arrival</label>
                  <select
                    value={arriveStation}
                    onChange={(e) => setArriveStation(e.target.value)}
                    disabled={isTravelling}
                    className="w-full bg-neutral-900 border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                  >
                    {STATIONS.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
              </div>

              {/* Transit calculation metrics */}
              <div className="p-3 bg-neutral-900/60 rounded-xl border border-white/5 space-y-1.5 mt-3 text-xs">
                <div className="flex justify-between">
                  <span className="text-neutral-400">Canopy Distance:</span>
                  <span className="text-white font-bold">{currentDistance} miles</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Transit Duration:</span>
                  <span className="text-white font-bold">{travelDuration} seconds</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Transit Mode:</span>
                  <span className="text-yellow-400 font-bold">{activeTransport.replace('-', ' ')}</span>
                </div>
              </div>

              {/* Transit animation progress */}
              {isTravelling ? (
                <div className="mt-4 space-y-1.5">
                  <div className="flex justify-between items-center text-[9px] text-cyan-300">
                    <span>Monorail Pod flying...</span>
                    <span>{Math.round(travelProgress)}%</span>
                  </div>
                  <div className="w-full h-4 bg-neutral-950 border border-white/10 rounded-full overflow-hidden relative flex items-center shadow-inner">
                    <div
                      className="absolute text-sm transition-all duration-1000 ease-linear"
                      style={{ left: `calc(${travelProgress}% - 14px)` }}
                    >
                      {activeEmoji}
                    </div>
                    <div className="h-full bg-cyan-500/25 rounded-full" style={{ width: `${travelProgress}%` }} />
                  </div>
                </div>
              ) : (
                <button
                  onClick={handleStartTravel}
                  className="w-full mt-4 py-2.5 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white rounded-2xl font-brand font-black uppercase text-[10px] tracking-wider transition cursor-pointer"
                  style={{ fontFamily: '"Josefin Sans", sans-serif' }}
                >
                  🚀 {
                    goldenCitizenPass ? (
                      activeTransport === 'forest-train' ? 'Start Monorail Run (Free - Pass)' :
                      activeTransport === 'horse-wagon' ? 'Start Wagon Ride (Free - Pass)' :
                      'Start Walking (Free)'
                    ) : (
                      activeTransport === 'forest-train' ? `Start Monorail Run (${ECONOMY_CONFIG.MONORAIL_COST} 🪙)` :
                      activeTransport === 'horse-wagon' ? `Start Wagon Ride (${ECONOMY_CONFIG.HORSE_WAGON_COST} 🪙)` :
                      'Start Walking (Free)'
                    )
                  }
                </button>
              )}
            </div>
          </div>

          {/* Travel Logs */}
          <div className="mt-4 pt-3 border-t border-white/5">
            <span className="text-[8px] font-black uppercase tracking-wider text-neutral-400 block mb-1">Depot Logs</span>
            <div className="text-[9px] font-mono text-white/55 space-y-1 max-h-[70px] overflow-y-auto custom-scrollbar">
              {travelLog.length > 0 ? (
                travelLog.map((log, i) => <div key={i} className="truncate">· {log}</div>)
              ) : (
                <div className="italic text-white/30">No transit dispatches logged.</div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT: Cargo Dispatch Board (33%) */}
        <div className="bg-black/60 border border-amber-500/20 rounded-[2rem] p-5 flex flex-col justify-between shadow-xl">
          <div>
            <span className="text-[9px] font-black uppercase tracking-[0.25em] text-cyan-400 block mb-2">Freight Cargo Board</span>
            
            <div className="p-4 bg-gradient-to-br from-purple-950/20 via-purple-900/10 to-stone-900 border border-purple-500/20 rounded-2xl space-y-3">
              <div>
                <span className="px-2 py-0.5 bg-purple-500/25 text-purple-300 rounded text-[7.5px] font-bold uppercase tracking-wider">Active Contract</span>
                <h5 className="font-bold text-white text-xs mt-1.5">Deliver Velvet Cocoa Cream Crate</h5>
                <p className="text-[10px] text-white/60 mt-1 leading-normal">
                  Transport 4 cargo bundles from Mossberry Residence to Mossberry Wharf. Yields standard county wage.
                </p>
              </div>

              <div className="p-2.5 bg-black/40 border border-white/5 rounded-xl text-[9.5px] space-y-1">
                <div className="flex justify-between">
                  <span className="text-neutral-400">Reward:</span>
                  <span className="text-emerald-400 font-bold">8 Coins 🪙</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Bonus:</span>
                  <span className="text-cyan-400 font-bold">+20 Builder XP ✨</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">ETA:</span>
                  <span className="text-white font-bold">{Math.round(20 / getSpeedFactor(activeTransport))}s ({activeTransport.replace('-', ' ')})</span>
                </div>
              </div>

              {cargoStatus === 'idle' && (
                <button
                  onClick={handleStartDispatch}
                  className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-brand font-black uppercase text-[9px] tracking-wider transition shadow-md cursor-pointer"
                  style={{ fontFamily: '"Josefin Sans", sans-serif' }}
                >
                  🚚 Dispatch Cargo Crate
                </button>
              )}

              {cargoStatus === 'shipping' && (
                <div className="p-3 bg-neutral-905 text-center rounded-xl border border-white/5 space-y-1">
                  <div className="text-[9px] text-purple-300 font-bold uppercase animate-pulse">Pod En-route in Canopy...</div>
                  <div className="text-sm font-mono font-bold text-white">{cargoSecondsLeft}s left</div>
                  <div className="w-full h-1 bg-neutral-950 rounded-full overflow-hidden mt-1">
                    <div
                      className="h-full bg-purple-500 transition-all duration-1000 ease-linear"
                      style={{ width: `${((20 / getSpeedFactor(activeTransport) - cargoSecondsLeft) / (20 / getSpeedFactor(activeTransport))) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {cargoStatus === 'ready' && (
                <button
                  onClick={handleClaimCargoRewards}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-brand font-black uppercase text-[9px] tracking-wider transition animate-bounce shadow-glow cursor-pointer"
                  style={{ fontFamily: '"Josefin Sans", sans-serif' }}
                >
                  💰 Claim Courier Pay (30🪙)
                </button>
              )}
            </div>
          </div>

          {/* Dispatch Logs */}
          <div className="mt-4 pt-3 border-t border-white/5">
            <span className="text-[8px] font-black uppercase tracking-wider text-neutral-400 block mb-1">Cargo Manifest Logs</span>
            <div className="text-[9px] font-mono text-white/55 space-y-1 max-h-[70px] overflow-y-auto custom-scrollbar">
              {dispatchLog.length > 0 ? (
                dispatchLog.map((log, i) => <div key={i} className="truncate">· {log}</div>)
              ) : (
                <div className="italic text-white/30">No cargo runs logged.</div>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Footer message */}
      <div className="p-2 border-t border-white/10 text-center text-[10px] text-white/30 shrink-0">
        "Canopy Monorail: 🟢 OPERATIONAL · Wagon Routes: 🟡 SLOWED BY HONEYBERRY LEAVES"
      </div>
    </div>
  );
};
