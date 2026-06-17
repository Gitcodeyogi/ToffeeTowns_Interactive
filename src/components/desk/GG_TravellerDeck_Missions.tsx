import React from 'react';
import { useTTStore } from '../../store/useTTStore';
import { GG_TravellerDeck_Header } from './GG_TravellerDeck_Header';
import type { SubPage } from '../../pages/TravellersDesk';

interface GG_TravellerDeck_MissionsProps {
  setSubPage: (page: SubPage) => void;
  popPage: () => void;
  inventory: Record<string, number>;
  setInventory: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  triggerFeedback: (msg: string) => void;
}

export const GG_TravellerDeck_Missions: React.FC<GG_TravellerDeck_MissionsProps> = ({
  setSubPage,
  popPage,
  inventory,
  setInventory,
  triggerFeedback,
}) => {
  const { completedMissions, completeMission } = useTTStore();

  const handleEmbark = (missionKey: string, name: string, req: Record<string, number>, badgeId: number, title: string) => {
    if (completedMissions.includes(missionKey)) {
      triggerFeedback('✅ Mission already completed!');
      return;
    }
    for (const [item, qty] of Object.entries(req)) {
      if ((inventory[item] || 0) < qty) {
        triggerFeedback(`❌ Missing items! Requires ${qty} ${item.toUpperCase()}`);
        return;
      }
    }
    const newInv = { ...inventory };
    for (const [item, qty] of Object.entries(req)) {
      newInv[item] = Math.max(0, (newInv[item] || 0) - qty);
    }
    setInventory(newInv);
    completeMission(missionKey, title, badgeId);
    triggerFeedback(`🏆 Completed Mission: ${name}! Gained Badge, Title "${title}" and +50 Legacy!`);
  };

  return (
    <div className="w-full h-full flex flex-col justify-between">
      <GG_TravellerDeck_Header
        title="MISSIONS BOARD"
        setSubPage={setSubPage}
        popPage={popPage}
      />

      {/* Split view */}
      <div className="flex-1 flex flex-row gap-6 my-4 overflow-hidden min-h-0">
        {/* Left slot: Image (Strictly 60%) */}
        <div className="w-[60%] shrink-0 h-full rounded-3xl border border-white/10 bg-black/35 overflow-hidden relative flex items-center justify-center p-3">
          <img src="/towns/Toffee-town.png" alt="Missions" className="w-full h-full object-contain rounded-2xl" />
          <span className="absolute bottom-6 left-6 right-6 p-3 bg-black/75 border border-white/5 text-xs text-white/70 rounded-xl text-center">
            "Deliver materials to execute operations, claim titles, and earn commemorative badges."
          </span>
        </div>

        {/* Right slot: Missions list (Strictly 40%) */}
        <div className="w-[40%] shrink-0 h-full flex flex-col justify-start border border-white/10 bg-black/25 rounded-3xl p-6 overflow-y-auto custom-scrollbar gap-4">
          <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-pink-400 shrink-0">County Operations</h3>
          
          {/* Mission A */}
          <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex flex-col gap-3">
            <div>
              <h4 className="text-sm font-bold text-white">Restoration of Canopy Bridge</h4>
              <p className="text-xs text-cyan-400 font-semibold mt-0.5">Required: 4 Wood, 2 Bolts</p>
              <p className="text-[10.5px] text-white/50 mt-1 leading-normal">Helps the Rebel Rangers patrol safely across tree lines.</p>
            </div>
            {completedMissions.includes('canopy-bridge') ? (
              <div className="py-1.5 bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 text-center rounded-xl text-xs font-bold font-sans">✓ Mission Completed (Title: Bridge Warden)</div>
            ) : (
              <button
                onClick={() => handleEmbark('canopy-bridge', 'Restoration of Canopy Bridge', { wood: 4, bolts: 2 }, 10, 'Bridge Warden')}
                className="py-2.5 bg-pink-600 hover:bg-pink-500 text-white font-brand text-[10px] uppercase tracking-wider rounded-xl transition"
                style={{ fontFamily: '"Josefin Sans", sans-serif' }}
              >
                Embark on Mission
              </button>
            )}
          </div>

          {/* Mission B */}
          <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex flex-col gap-3">
            <div>
              <h4 className="text-sm font-bold text-white">Sanitize Geothermal Springs</h4>
              <p className="text-xs text-cyan-400 font-semibold mt-0.5">Required: 3 Moss, 1 Mucus</p>
              <p className="text-[10.5px] text-white/50 mt-1 leading-normal">Dr Fudge needs compresses clear of steam sulfur.</p>
            </div>
            {completedMissions.includes('springs-sanitize') ? (
              <div className="py-1.5 bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 text-center rounded-xl text-xs font-bold font-sans">✓ Mission Completed (Title: Springs Savior)</div>
            ) : (
              <button
                onClick={() => handleEmbark('springs-sanitize', 'Sanitize Geothermal Springs', { moss: 3, mucus: 1 }, 11, 'Springs Savior')}
                className="py-2.5 bg-pink-600 hover:bg-pink-500 text-white font-brand text-[10px] uppercase tracking-wider rounded-xl transition"
                style={{ fontFamily: '"Josefin Sans", sans-serif' }}
              >
                Embark on Mission
              </button>
            )}
          </div>

          {/* Mission C */}
          <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex flex-col gap-3">
            <div>
              <h4 className="text-sm font-bold text-white">Draft Leaflets Against Curfew</h4>
              <p className="text-xs text-cyan-400 font-semibold mt-0.5">Required: 5 Parchment, 2 Ink</p>
              <p className="text-[10.5px] text-white/50 mt-1 leading-normal">Inform citizens about the midnight meeting logs.</p>
            </div>
            {completedMissions.includes('curfew-leaflets') ? (
              <div className="py-1.5 bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 text-center rounded-xl text-xs font-bold font-sans">✓ Mission Completed (Title: Voice of Curfew)</div>
            ) : (
              <button
                onClick={() => handleEmbark('curfew-leaflets', 'Draft Leaflets Against Curfew', { parchment: 5, ink: 2 }, 12, 'Voice of Curfew')}
                className="py-2.5 bg-pink-600 hover:bg-pink-500 text-white font-brand text-[10px] uppercase tracking-wider rounded-xl transition"
                style={{ fontFamily: '"Josefin Sans", sans-serif' }}
              >
                Embark on Mission
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
