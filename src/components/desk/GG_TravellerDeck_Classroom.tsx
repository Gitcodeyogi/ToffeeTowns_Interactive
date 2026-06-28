import React from 'react';
import { useTTStore } from '../../store/useTTStore';
import { GG_TravellerDeck_Header } from './GG_TravellerDeck_Header';
import { TRANSPORT_SPEEDS, type SubPage } from '../../lib/uiConstants';

interface GG_TravellerDeck_ClassroomProps {
  setSubPage: (page: SubPage) => void;
  popPage: () => void;
  triggerFeedback: (msg: string) => void;
}

export const GG_TravellerDeck_Classroom: React.FC<GG_TravellerDeck_ClassroomProps> = ({
  setSubPage,
  popPage,
  triggerFeedback,
}) => {
  const { coins, skills, activeTransport, currentLocation, startResidencyTaskFlow } = useTTStore();

  const handleTrain = (skillKey: string, name: string, cost: number, xp: number) => {
    if (coins < cost) {
      triggerFeedback('❌ Insufficient Cocoa Coins!');
      return;
    }
    const speedMult = TRANSPORT_SPEEDS[activeTransport] || 40;
    const travelDist = 800; // Academy is 800m
    const travelDuration = Math.max(2000, Math.round((travelDist / speedMult) * 1000));
    const studyDuration = 12000; // 12s study class

    const trainNodes = ['home', 'health', 'classroom', 'newspaper', 'workshop', 'transport'];
    const isTrain = trainNodes.includes(currentLocation || '') && trainNodes.includes('classroom');
    const isBalloon = currentLocation === 'politics' || currentLocation === 'theatre';
    const modeName = isTrain ? 'Train' : isBalloon ? 'Balloon' : 'Wagon';
    const modeIcon = isTrain ? '🚂' : isBalloon ? '🎈' : '🐎';

    startResidencyTaskFlow({
      travelTask: {
        name: `${modeName} to Academy`,
        type: 'travel',
        duration: travelDuration,
        rewardCoins: 0,
        rewardXP: 0,
        rewardXPCat: '',
        rewardLegacy: 0,
        icon: modeIcon,
        targetText: `Academy Classroom (${modeName}: 800m)`,
        originSubPage: currentLocation,
        destinationSubPage: 'classroom',
        transitFare: 0,
      },
      workTask: {
        name: `Attend Seminar: ${name}`,
        type: 'study',
        duration: studyDuration,
        rewardCoins: 15,
        rewardXP: xp,
        rewardXPCat: skillKey,
        rewardLegacy: 15,
        icon: '🎓',
        targetText: name,
      },
      startDeductions: {
        coins: cost,
        inventory: {}
      }
    });

    triggerFeedback(`🎓 Briefing opened for: ${name}!`);
  };

  return (
    <div className="w-full h-full flex flex-col justify-between">
      <GG_TravellerDeck_Header
        title="ACADEMY CLASSROOM"
        setSubPage={setSubPage}
        popPage={popPage}
      />

      {/* Split view */}
      <div className="flex-1 flex flex-row gap-6 my-4 overflow-hidden min-h-0">
        {/* Left slot: Image (Strictly 60%) */}
        <div className="w-[60%] shrink-0 h-full rounded-3xl border border-white/10 bg-black/35 overflow-hidden relative flex items-center justify-center p-3">
          <img src="/towns/eclair-square.png" alt="Classroom" className="w-full h-full object-contain rounded-2xl" />
          <span className="absolute bottom-6 left-6 right-6 p-3 bg-black/75 border border-white/5 text-xs text-white/70 rounded-xl text-center">
            "Upgrade your skill ranks to master county trades and earn public credentials."
          </span>
        </div>

        {/* Right slot: Skills & Training (Strictly 40%) */}
        <div className="w-[40%] shrink-0 h-full flex flex-col justify-between border border-white/10 bg-black/25 rounded-3xl p-6 overflow-y-auto custom-scrollbar">
          
          {/* Skill Levels */}
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-cyan-400 mb-2">My Skill Levels</h3>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-2.5 bg-white/5 border border-white/10 rounded-xl">
                <div className="text-[9px] font-black uppercase tracking-wider text-white/40">Builder</div>
                <div className="text-sm font-bold text-white mt-0.5">Lv. {Math.floor((skills.builder || 0) / 10) + 1}</div>
                <div className="w-full h-1 bg-white/10 rounded-full mt-1.5 overflow-hidden">
                  <div className="h-full bg-cyan-400" style={{ width: `${((skills.builder || 0) % 10) * 10}%` }}></div>
                </div>
              </div>
              <div className="p-2.5 bg-white/5 border border-white/10 rounded-xl">
                <div className="text-[9px] font-black uppercase tracking-wider text-white/40">Explorer</div>
                <div className="text-sm font-bold text-white mt-0.5">Lv. {Math.floor((skills.explorer || 0) / 10) + 1}</div>
                <div className="w-full h-1 bg-white/10 rounded-full mt-1.5 overflow-hidden">
                  <div className="h-full bg-cyan-400" style={{ width: `${((skills.explorer || 0) % 10) * 10}%` }}></div>
                </div>
              </div>
              <div className="p-2.5 bg-white/5 border border-white/10 rounded-xl">
                <div className="text-[9px] font-black uppercase tracking-wider text-white/40">Architect</div>
                <div className="text-sm font-bold text-white mt-0.5">Lv. {Math.floor((skills.architect || 0) / 10) + 1}</div>
                <div className="w-full h-1 bg-white/10 rounded-full mt-1.5 overflow-hidden">
                  <div className="h-full bg-cyan-400" style={{ width: `${((skills.architect || 0) % 10) * 10}%` }}></div>
                </div>
              </div>
              <div className="p-2.5 bg-white/5 border border-white/10 rounded-xl">
                <div className="text-[9px] font-black uppercase tracking-wider text-white/40">Healer</div>
                <div className="text-sm font-bold text-white mt-0.5">Lv. {Math.floor((skills.healer || 0) / 10) + 1}</div>
                <div className="w-full h-1 bg-white/10 rounded-full mt-1.5 overflow-hidden">
                  <div className="h-full bg-cyan-400" style={{ width: `${((skills.healer || 0) % 10) * 10}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Training Seminars */}
          <div className="border-t border-white/10 pt-4">
            <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-yellow-400 mb-2.5">Available Seminars</h3>
            <div className="space-y-3">
              <div className="p-3 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between text-xs gap-3">
                <div>
                  <h4 className="font-bold text-white">Structural Carpentry</h4>
                  <p className="text-[10px] text-white/50 mt-0.5">+10 Builder XP • +15 Legacy</p>
                </div>
                <button onClick={() => handleTrain('builder', 'Structural Carpentry', 20, 10)} className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 rounded-lg text-white font-black uppercase text-[10px] tracking-wider shrink-0">20 🪙</button>
              </div>
              <div className="p-3 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between text-xs gap-3">
                <div>
                  <h4 className="font-bold text-white">Valley Navigation</h4>
                  <p className="text-[10px] text-white/50 mt-0.5">+10 Explorer XP • +15 Legacy</p>
                </div>
                <button onClick={() => handleTrain('explorer', 'Valley Navigation', 25, 10)} className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 rounded-lg text-white font-black uppercase text-[10px] tracking-wider shrink-0">25 🪙</button>
              </div>
              <div className="p-3 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between text-xs gap-3">
                <div>
                  <h4 className="font-bold text-white">Geothermal Sanitizer</h4>
                  <p className="text-[10px] text-white/50 mt-0.5">+10 Healer XP • +15 Legacy</p>
                </div>
                <button onClick={() => handleTrain('healer', 'Geothermal Sanitizer', 20, 10)} className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 rounded-lg text-white font-black uppercase text-[10px] tracking-wider shrink-0">20 🪙</button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
