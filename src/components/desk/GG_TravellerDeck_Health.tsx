import React, { useState } from 'react';
import { useTTStore } from '../../store/useTTStore';
import { GG_TravellerDeck_Header } from './GG_TravellerDeck_Header';
import { type SubPage } from '../../lib/uiConstants';

interface Props {
  setSubPage: (p: SubPage) => void;
  popPage: () => void;
  triggerFeedback: (msg: string) => void;
}

interface Patient {
  id: string;
  name: string;
  avatar: string;
  sickness: string;
  remedyRequired: string;
  status: 'sick' | 'cured';
  dialogueSick: string;
  dialogueCured: string;
}

export const GG_TravellerDeck_Health: React.FC<Props> = ({
  setSubPage,
  popPage,
  triggerFeedback,
}) => {
  const { addSkillXP, addCoins, coins, startResidencyTaskFlow } = useTTStore();

  const startStandaloneDuty = (
    name: string,
    dutyType: string,
    frame: string,
    profession: string,
    costCoins: number,
    costInv: Record<string, number>,
    rewards: { coins: number; xp: number; legacy: number }
  ) => {
    if (coins < costCoins) {
      triggerFeedback(`❌ Need ${costCoins} Coins!`);
      return;
    }
    
    if (name.includes("Brew")) {
      if (herbs.spores < 1 || herbs.mint < 1 || herbs.bark < 1) {
        triggerFeedback('❌ Need 1 Spore, 1 Mint, and 1 Bark to brew a Spore Remedy!');
        return;
      }
      setHerbs(prev => ({
        spores: prev.spores - 1,
        mint: prev.mint - 1,
        bark: prev.bark - 1
      }));
      setRemedies(prev => prev + 1);
    } else if (name.includes("Forage")) {
      const herbPool = ['spores', 'mint', 'bark'];
      const picked = herbPool[Math.floor(Math.random() * herbPool.length)];
      setHerbs(prev => ({ ...prev, [picked]: prev[picked] + 1 }));
      const herbName = picked === 'spores' ? 'Glowing Spores 🧪' : picked === 'mint' ? 'Velvet Mint Leaf 🌿' : 'Sugar Willow Bark 🪵';
      setTimeout(() => {
        triggerFeedback(`✓ Foraged: ${herbName}!`);
      }, 500);
    }

    startResidencyTaskFlow({
      travelTask: undefined,
      workTask: {
        name,
        type: 'work',
        duration: 8000,
        rewardCoins: rewards.coins,
        rewardXP: rewards.xp,
        rewardXPCat: profession,
        rewardLegacy: rewards.legacy,
        icon: '🩺',
        targetText: name,
        hasMiniGame: true,
        dutyType,
      },
      startDeductions: {
        coins: costCoins,
        inventory: {}
      }
    });
    useTTStore.setState({ residencyTaskStage: 'progress' });
  };

  // Local Clinic Inventory
  const [herbs, setHerbs] = useState<Record<string, number>>({ spores: 2, mint: 1, bark: 0 });
  const [remedies, setRemedies] = useState<number>(1);

  // Activity progress states
  const [foraging, setForaging] = useState<boolean>(false);
  const [brewing, setBrewing] = useState<boolean>(false);

  // Patients ward state
  const [patients, setPatients] = useState<Patient[]>([
    {
      id: 'pipkin',
      name: 'Pipkin Nutterby',
      avatar: '🐿️',
      sickness: 'Spore Sneezles (High Sneezles)',
      remedyRequired: 'Spore Remedy',
      status: 'sick',
      dialogueSick: '"Achoo! These glowing blue forest spores got in my nose when I was hiding in the hollow tree roots... my suspenders are shaking!"',
      dialogueCured: '"Wow! My nose is clear and my slingshot focus is back to 100%! Thanks, clinic assistant! Let\'s go climb some gates!"'
    },
    {
      id: 'rowan',
      name: 'Rowan Thistle',
      avatar: '🔨',
      sickness: 'Moss Rash & Splinters',
      remedyRequired: 'Spore Remedy',
      status: 'sick',
      dialogueSick: '"I was lifting old walkway timber logs without gloves. The green moss is scratching my fingers... my blueprint pencil keeps slipping."',
      dialogueCured: '"The swelling went down instantly. This peppermint mint coating is incredible. I can get back to alignment torques!"'
    },
    {
      id: 'petalworth',
      name: 'Mrs. Petalworth',
      avatar: '🌸',
      sickness: 'Sugar Lily Spore Allergies',
      remedyRequired: 'Spore Remedy',
      status: 'sick',
      dialogueSick: '"Oh my, the sugar lily pollen levels are extremely high today... *sniffle*... my secret messages are getting stained by eye-watering!"',
      dialogueCured: '"Ah, clear eyes at last! Now I can read Julie\'s quick-ink codes without getting a headache. Thank you, sweetheart!"'
    }
  ]);

  const handleForageHerbs = () => {
    if (coins < 5) {
      triggerFeedback('❌ Need 5 Coins to pay the canopy ranger fee!');
      return;
    }
    addCoins(-5, 'Forest Foraging Fee');
    setForaging(true);

    setTimeout(() => {
      setForaging(false);
      // Pick a random herb
      const herbPool = ['spores', 'mint', 'bark'];
      const picked = herbPool[Math.floor(Math.random() * herbPool.length)];
      setHerbs(prev => ({ ...prev, [picked]: prev[picked] + 1 }));
      addSkillXP('explorer', 10);

      const herbName = picked === 'spores' ? 'Glowing Spores 🧪' : picked === 'mint' ? 'Velvet Mint Leaf 🌿' : 'Sugar Willow Bark 🪵';
      triggerFeedback(`🌿 Foraged: ${herbName}! Paid 5 Coins, gained +10 Explorer XP.`);
    }, 2000);
  };

  const handleBrewRemedy = () => {
    if (herbs.spores < 1 || herbs.mint < 1 || herbs.bark < 1) {
      triggerFeedback('❌ Need 1 Spore, 1 Mint, and 1 Bark to brew a Spore Remedy!');
      return;
    }

    setBrewing(true);
    setHerbs(prev => ({
      spores: prev.spores - 1,
      mint: prev.mint - 1,
      bark: prev.bark - 1
    }));

    setTimeout(() => {
      setBrewing(false);
      setRemedies(prev => prev + 1);
      addSkillXP('healer', 25);
      triggerFeedback('🧪 Brewing complete! Created 1 Spore Remedy, +25 Healer XP.');
    }, 3000);
  };

  const handleTreatPatient = (id: string) => {
    if (remedies < 1) {
      triggerFeedback('❌ Brew a Spore Remedy at the Cauldron first!');
      return;
    }

    setRemedies(prev => prev - 1);
    setPatients(prev => prev.map(p => p.id === id ? { ...p, status: 'cured' } : p));
    addCoins(9, 'Patient Treatment Reward');
    addSkillXP('healer', 30);
    triggerFeedback('🩺 Patient treated successfully! +30 Healer XP, +9 Coins reward.');
  };

  return (
    <div className="w-full flex-grow flex flex-col min-h-0 overflow-hidden">
      {/* Header */}
      <GG_TravellerDeck_Header
        title="🩺 GROVE CLINIC & APOTHECARY"
        setSubPage={setSubPage}
        popPage={popPage}
      />

      {/* Main Grid */}
      <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar grid grid-cols-1 xl:grid-cols-3 gap-5 py-3 pr-1">
        
        {/* LEFT: Clinic Stats & Herb Foraging (33%) */}
        <div className="bg-black/45 border border-white/10 rounded-[2rem] p-5 flex flex-col justify-between">
          <div>
            <span className="text-[8px] font-black uppercase tracking-[0.25em] text-cyan-400 block mb-2">Clinic Bulletin</span>
            <div className="p-4 bg-gradient-to-br from-emerald-950/20 via-emerald-900/10 to-stone-900 border border-emerald-500/20 rounded-2xl space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-white/70">Town Wellness Index:</span>
                <span className="text-emerald-400 font-brand text-xs">85% HEALTHY</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-white/70">Outbreak Warning:</span>
                <span className="px-2 py-0.5 bg-yellow-500/25 text-yellow-300 rounded text-[7.5px] font-bold uppercase tracking-wider">MODERATE SPORES</span>
              </div>
              <p className="text-[9.5px] text-white/50 leading-relaxed pt-1.5 border-t border-white/5">
                Dr. Cedric cautions: glowing forest spores are drifting from the east. Keep clinic remedies prepared.
              </p>
            </div>

            {/* Apothecary Inventory */}
            <h5 className="text-[9px] font-black uppercase tracking-wider text-pink-400 mt-5 mb-2">Apothecary Cabinet</h5>
            <div className="p-3 bg-neutral-900/60 border border-white/5 rounded-2xl grid grid-cols-3 gap-2 text-center">
              <div className="p-2 bg-black/40 rounded-xl border border-white/5">
                <span className="text-lg block">🧪</span>
                <span className="text-[9px] font-bold text-cyan-300 block truncate">Spores</span>
                <span className="text-xs font-mono font-bold text-white mt-1 block">{herbs.spores}</span>
              </div>
              <div className="p-2 bg-black/40 rounded-xl border border-white/5">
                <span className="text-lg block">🌿</span>
                <span className="text-[9px] font-bold text-emerald-300 block truncate">Mint</span>
                <span className="text-xs font-mono font-bold text-white mt-1 block">{herbs.mint}</span>
              </div>
              <div className="p-2 bg-black/40 rounded-xl border border-white/5">
                <span className="text-lg block">🪵</span>
                <span className="text-[9px] font-bold text-orange-300 block truncate">Bark</span>
                <span className="text-xs font-mono font-bold text-white mt-1 block">{herbs.bark}</span>
              </div>
            </div>

            {/* Forage Action — MINI-GAME TASK */}
            <div className="mt-4 relative">
              <div className="absolute -top-2.5 left-4 z-10 flex items-center gap-1 px-2.5 py-0.5 rounded-full"
                style={{ background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', boxShadow: '0 0 12px rgba(124,58,237,0.6)', border: '1px solid rgba(255,255,255,0.2)' }}>
                <span className="text-[8px]" style={{ fontFamily: "'Luckiest Guy',cursive" }}>🎮 MINI-GAME</span>
                <span className="text-[8px] text-purple-200 font-bold">• Adventure</span>
              </div>
              <button
                onClick={() => startStandaloneDuty("Forage Canopy Herbs","adventure","clipboard","healer",5,{},{ coins: 20, xp: 30, legacy: 2 })}
                className="w-full pt-5 pb-3 px-4 rounded-2xl flex items-center justify-between cursor-pointer transition-all active:scale-95"
                style={{ background: 'linear-gradient(135deg,rgba(5,150,105,0.25),rgba(4,120,87,0.15))', border: '2px solid rgba(52,211,153,0.35)', boxShadow: '0 6px 0 rgba(0,0,0,0.4)' }}>
                <div className="flex items-center gap-2">
                  <span className="text-xl">🌲</span>
                  <div className="text-left">
                    <p className="text-emerald-300 font-black text-[10px] uppercase tracking-wide" style={{ fontFamily: "'Josefin Sans',sans-serif" }}>Search Forest Canopy</p>
                    <p className="text-white/40 text-[8.5px]">5🪙 Fee • Gain Herbs</p>
                  </div>
                </div>
                <span className="text-emerald-400 font-bold text-[9px] px-2 py-1 rounded-xl bg-emerald-500/15 border border-emerald-500/30">+30 XP</span>
              </button>
            </div>
          </div>

          <div className="text-[10px] text-white/40 text-center border-t border-white/5 pt-3">
            Your Wallet: <span className="text-amber-400 font-bold font-mono">🪙 {coins}</span>
          </div>
        </div>

        {/* MIDDLE: Cauldron Brewing (32%) */}
        <div className="bg-black/45 border border-white/10 rounded-[2rem] p-5 flex flex-col justify-between">
          <div>
            <span className="text-[8px] font-black uppercase tracking-[0.25em] text-cyan-400 block mb-3">Brewing Cauldron</span>
            <div className="p-4 bg-black/50 border border-white/5 rounded-2xl space-y-4 text-center">
              <span className="text-5xl block animate-bounce-subtle">🧙‍♂️</span>
              <div>
                <span className="text-[8px] font-bold text-cyan-300 uppercase tracking-widest block">Active Recipe</span>
                <h5 className="font-bold text-white text-xs mt-1">Spore Sneezle Remedy</h5>
                <p className="text-[9.5px] text-white/50 leading-relaxed mt-1">
                  Combines 1 Glowing Spore, 1 Velvet Mint Leaf, and 1 Sugar Willow Bark to synthesize a soothing elixir.
                </p>
              </div>

              {/* Cauldron Brewing status — MINI-GAME TASK */}
              <div className="relative">
                <div className="absolute -top-2.5 left-4 z-10 flex items-center gap-1 px-2.5 py-0.5 rounded-full"
                  style={{ background: 'linear-gradient(135deg,#7c3aed,#6d28d9)', boxShadow: '0 0 12px rgba(124,58,237,0.6)', border: '1px solid rgba(255,255,255,0.2)' }}>
                  <span className="text-[8px]" style={{ fontFamily: "'Luckiest Guy',cursive" }}>🎮 MINI-GAME</span>
                  <span className="text-[8px] text-purple-200 font-bold">• Boiler</span>
                </div>
                <button
                  onClick={() => startStandaloneDuty("Brew Cauldron Remedy","boiler","clipboard","healer",0,{ spores: 1, mint: 1, bark: 1 },{ coins: 35, xp: 45, legacy: 3 })}
                  className="w-full pt-5 pb-3 px-4 rounded-2xl flex items-center justify-between cursor-pointer transition-all active:scale-95"
                  style={{ background: 'linear-gradient(135deg,rgba(124,58,237,0.2),rgba(109,40,217,0.15))', border: '2px solid rgba(139,92,246,0.35)', boxShadow: '0 6px 0 rgba(0,0,0,0.4)' }}>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🧪</span>
                    <div className="text-left">
                      <p className="text-purple-300 font-black text-[10px] uppercase tracking-wide" style={{ fontFamily: "'Josefin Sans',sans-serif" }}>Brew Remedy</p>
                      <p className="text-white/40 text-[8.5px]">Consumes 1-1-1 herbs</p>
                    </div>
                  </div>
                  <span className="text-purple-400 font-bold text-[9px] px-2 py-1 rounded-xl bg-purple-500/15 border border-purple-500/30">+45 XP</span>
                </button>
              </div>
            </div>
          </div>

          {/* Cauldron Outputs */}
          <div className="mt-5 pt-3 border-t border-white/5">
            <span className="text-[8px] font-black uppercase tracking-wider text-neutral-400 block mb-1.5">Cauldron Storage</span>
            <div className="p-3 bg-neutral-900/60 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🧪</span>
                <div>
                  <h6 className="font-bold text-white text-xs">Spore Remedy</h6>
                  <span className="text-[8.5px] text-white/40 block">Wellness Elixir</span>
                </div>
              </div>
              <span className="text-base font-mono font-bold text-purple-300 bg-purple-500/20 border border-purple-500/35 px-3 py-1 rounded-xl">
                {remedies} ready
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT: Patient Ward (35%) */}
        <div className="bg-black/45 border border-white/10 rounded-[2rem] p-5 flex flex-col min-h-0">
          <span className="text-[8px] font-black uppercase tracking-[0.25em] text-cyan-400 block mb-3">Clinic Wards</span>
          
          <div className="flex-grow overflow-y-auto custom-scrollbar space-y-3 pr-1">
            {patients.map((p) => {
              const isCured = p.status === 'cured';

              return (
                <div key={p.id} className={`p-4 rounded-2xl border transition duration-200 text-xs flex flex-col justify-between gap-3 ${
                  isCured ? 'bg-emerald-950/10 border-emerald-500/25' : 'bg-white/5 border-white/5'
                }`}>
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl p-1 bg-white/5 border border-white/5 rounded-lg">{p.avatar}</span>
                      <div>
                        <h6 className="font-bold text-white text-xs leading-none">{p.name}</h6>
                        <span className="text-[8px] text-white/40 block mt-1">{p.sickness}</span>
                      </div>
                    </div>
                    {isCured ? (
                      <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded text-[7.5px] font-bold uppercase tracking-wider">CURED</span>
                    ) : (
                      <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-300 rounded text-[7.5px] font-bold uppercase tracking-wider">SICK</span>
                    )}
                  </div>

                  <p className="text-[10px] font-serif italic text-white/70 leading-normal bg-black/30 p-2 rounded-lg">
                    {isCured ? p.dialogueCured : p.dialogueSick}
                  </p>

                  {!isCured && (
                    <button
                      onClick={() => handleTreatPatient(p.id)}
                      className="w-full py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-brand font-black uppercase text-[8.5px] tracking-wider transition"
                      style={{ fontFamily: '"Josefin Sans", sans-serif' }}
                    >
                      🩺 Treat with Spore Remedy
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Footer message */}
      <div className="p-2 border-t border-white/10 text-center text-[10px] text-white/30 shrink-0">
        "Clean hands, fresh forest herbs, and regular checkups. Protect your fellow residents."
      </div>
    </div>
  );
};
