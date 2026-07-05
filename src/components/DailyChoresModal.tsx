import React, { useState, useEffect } from 'react';
import { useTTStore } from '../store/useTTStore';
import { FONT } from '../lib/uiConstants';

export const DailyChoresModal: React.FC = () => {
  const {
    addSkillXP,
    addCoins,
    setShowDailyChores
  } = useTTStore();

  const [feedback, setFeedback] = useState<string | null>(null);

  const triggerLocalFeedback = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 3000);
  };

  // Persisted inputs in localStorage using chore namespace
  const [censusName, setCensusName] = useState(() => localStorage.getItem('tt_chore_census_name') || '');
  const [censusProf, setCensusProf] = useState(() => localStorage.getItem('tt_chore_census_prof') || 'builder');
  
  const [flourQty, setFlourQty] = useState(() => {
    const val = localStorage.getItem('tt_chore_flour');
    return val !== null ? parseInt(val) : 30;
  });
  const [sugarQty, setSugarQty] = useState(() => {
    const val = localStorage.getItem('tt_chore_sugar');
    return val !== null ? parseInt(val) : 30;
  });
  const [cocoaQty, setCocoaQty] = useState(() => {
    const val = localStorage.getItem('tt_chore_cocoa');
    return val !== null ? parseInt(val) : 40;
  });

  const [cleanSafety, setCleanSafety] = useState(() => {
    const val = localStorage.getItem('tt_chore_safety');
    return val !== null ? JSON.parse(val) : { box1: false, box2: false, box3: false };
  });

  const [chore1Done, setChore1Done] = useState(() => localStorage.getItem('tt_chore1_done') === 'true');
  const [chore2Done, setChore2Done] = useState(() => localStorage.getItem('tt_chore2_done') === 'true');
  const [chore3Done, setChore3Done] = useState(() => localStorage.getItem('tt_chore3_done') === 'true');

  const [secondsToNext, setSecondsToNext] = useState(7200);

  // Sync inputs
  useEffect(() => {
    localStorage.setItem('tt_chore_census_name', censusName);
  }, [censusName]);
  useEffect(() => {
    localStorage.setItem('tt_chore_census_prof', censusProf);
  }, [censusProf]);
  useEffect(() => {
    localStorage.setItem('tt_chore_flour', flourQty.toString());
    localStorage.setItem('tt_chore_sugar', sugarQty.toString());
    localStorage.setItem('tt_chore_cocoa', cocoaQty.toString());
  }, [flourQty, sugarQty, cocoaQty]);
  useEffect(() => {
    localStorage.setItem('tt_chore_safety', JSON.stringify(cleanSafety));
  }, [cleanSafety]);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsToNext(s => {
        if (s <= 1) {
          setChore1Done(false);
          setChore2Done(false);
          setChore3Done(false);
          localStorage.removeItem('tt_chore1_done');
          localStorage.removeItem('tt_chore2_done');
          localStorage.removeItem('tt_chore3_done');
          return 7200;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (sec: number) => {
    const hrs = Math.floor(sec / 3600).toString().padStart(2, '0');
    const mins = Math.floor((sec % 3600) / 60).toString().padStart(2, '0');
    const secs = (sec % 60).toString().padStart(2, '0');
    return `${hrs}h ${mins}m ${secs}s`;
  };

  return (
    <div className="fixed inset-0 z-[490] bg-black/10 flex items-center justify-center p-6 select-none animate-fade-in">
      
      {feedback && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[600] px-10 py-2.5 rounded-2xl bg-stone-900 border border-pink-500/40 text-pink-300 font-brand text-xs uppercase tracking-wide shadow-[0_8px_32px_rgba(200,60,100,0.3)] animate-fade-in max-w-2xl w-[60vw] text-center">
          {feedback}
        </div>
      )}

      <div className="relative bg-neutral-950/95 border-2 border-white/20 rounded-[2.5rem] p-6 h-[85vh] w-[85vw] max-w-5xl shadow-2xl flex flex-col justify-between text-left font-body overflow-hidden">
        
        {/* Header Row */}
        <div className="flex justify-between items-center border-b border-white/10 pb-3 shrink-0 z-10">
          <div>
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-pink-400">Daily Administrative Chores</span>
            <h2 className="text-xl md:text-2xl font-brand text-white uppercase mt-0.5" style={{ fontFamily: FONT }}>
              Community Chores Registry
            </h2>
          </div>
          <button
            onClick={() => setShowDailyChores(false)}
            className="w-10 h-10 hover:scale-110 active:scale-95 transition-all flex items-center justify-center filter drop-shadow-md bg-white/5 rounded-full border border-white/10 text-white font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* 3-Line Summary Guide */}
        <div className="mt-3 p-3 bg-white/5 border border-white/10 rounded-2xl shrink-0 font-sans">
          <p className="text-[11.5px] text-pink-200 leading-relaxed">
            1. Complete the county census registration form to declare your professional field interest.<br />
            2. Assist Mortimer the Baker in balancing his wedding cake ratios to exactly 100 lbs.<br />
            3. Verify safety protocol checklists for Apothecary Oakenhart at the local clinic.
          </p>
        </div>

        {/* Content Body - 3 Columns */}
        <div className="flex-1 my-4 grid grid-cols-1 lg:grid-cols-3 gap-5 overflow-y-auto custom-scrollbar pr-1 py-1 z-10">
          
          {/* Chore 1: County Census */}
          <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex flex-col justify-between space-y-4 font-sans">
            <div className="space-y-2.5">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black uppercase tracking-wider text-neutral-400 font-brand">Chore #1</span>
                {chore1Done ? (
                  <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-bold rounded-lg uppercase">Completed</span>
                ) : (
                  <span className="px-2 py-0.5 bg-pink-500/10 border border-pink-500/20 text-pink-400 text-[9px] font-bold rounded-lg uppercase">Active</span>
                )}
              </div>
              <h4 className="font-bold text-white text-sm flex items-center gap-1 font-brand">📝 County Census Registry</h4>
              <p className="text-xs text-white/55 leading-relaxed">
                Register your presence with the clerk. Tell us your traveler interest to keep demographic files up to date.
              </p>
              
              {!chore1Done && (
                <div className="space-y-2 pt-1.5 font-sans">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-neutral-400 font-bold uppercase">Traveler Name</label>
                    <input
                      type="text"
                      placeholder="Your Name..."
                      value={censusName}
                      onChange={(e) => setCensusName(e.target.value)}
                      className="px-3 py-1.5 bg-black/40 border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-pink-500 font-medium"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-neutral-400 font-bold uppercase">Primary Field Interest</label>
                    <select
                      value={censusProf}
                      onChange={(e) => setCensusProf(e.target.value)}
                      className="px-3 py-1.5 bg-black/40 border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-pink-500 font-medium cursor-pointer"
                    >
                      <option value="builder">🔨 Town Construction (Builder)</option>
                      <option value="explorer">🧭 Wilderness Mapping (Explorer)</option>
                      <option value="healer">🌿 Forest Apothecary (Healer)</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {!chore1Done ? (
              <button
                disabled={!censusName.trim()}
                onClick={() => {
                  addSkillXP('healer', 35);
                  addCoins(4, 'Daily Census Registry');
                  setChore1Done(true);
                  localStorage.setItem('tt_chore1_done', 'true');
                  triggerLocalFeedback('📝 Census registered! +35 Healer XP & +4 Coins.');
                }}
                className={`w-full py-2.5 rounded-xl text-black font-brand text-[10px] uppercase tracking-wider font-black transition cursor-pointer ${
                  censusName.trim() ? 'bg-gradient-to-r from-pink-500 to-purple-500 hover:scale-[1.02] active:scale-98 shadow-md' : 'bg-neutral-800 text-neutral-600 cursor-not-allowed border border-white/5'
                }`}
              >
                Submit Census Form 🎟️
              </button>
            ) : (
              <div className="text-center text-[10px] text-white/30 italic font-sans py-2.5 bg-white/5 border border-white/5 rounded-xl font-bold">✓ Census updated for this cycle.</div>
            )}
          </div>

          {/* Chore 2: Baker's Recipe Balance */}
          <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex flex-col justify-between space-y-4 font-sans">
            <div className="space-y-2.5">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black uppercase tracking-wider text-neutral-400 font-brand">Chore #2</span>
                {chore2Done ? (
                  <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-bold rounded-lg uppercase">Completed</span>
                ) : (
                  <span className="px-2 py-0.5 bg-pink-500/10 border border-pink-500/20 text-pink-400 text-[9px] font-bold rounded-lg uppercase">Active</span>
                )}
              </div>
              <h4 className="font-bold text-white text-sm flex items-center gap-1 font-brand">⚖️ Baker's Supply Ledger</h4>
              <p className="text-xs text-white/55 leading-relaxed">
                Baker Mortimer needs exactly 100 lbs of balanced materials for the wedding cake. Balance the ratios:
              </p>

              {!chore2Done && (
                <div className="space-y-2 pt-1 font-sans text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">🌾 Flour: {flourQty} lbs</span>
                    <div className="flex gap-1">
                      <button onClick={() => setFlourQty(q => Math.max(0, q - 5))} className="w-6 h-6 bg-white/10 hover:bg-white/20 rounded flex items-center justify-center font-black cursor-pointer">-</button>
                      <button onClick={() => setFlourQty(q => Math.min(100, q + 5))} className="w-6 h-6 bg-white/10 hover:bg-white/20 rounded flex items-center justify-center font-black cursor-pointer">+</button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">🍬 Sugar: {sugarQty} lbs</span>
                    <div className="flex gap-1">
                      <button onClick={() => setSugarQty(q => Math.max(0, q - 5))} className="w-6 h-6 bg-white/10 hover:bg-white/20 rounded flex items-center justify-center font-black cursor-pointer">-</button>
                      <button onClick={() => setSugarQty(q => Math.min(100, q + 5))} className="w-6 h-6 bg-white/10 hover:bg-white/20 rounded flex items-center justify-center font-black cursor-pointer">+</button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">🍫 Cocoa: {cocoaQty} lbs</span>
                    <div className="flex gap-1">
                      <button onClick={() => setCocoaQty(q => Math.max(0, q - 5))} className="w-6 h-6 bg-white/10 hover:bg-white/20 rounded flex items-center justify-center font-black cursor-pointer">-</button>
                      <button onClick={() => setCocoaQty(q => Math.min(100, q + 5))} className="w-6 h-6 bg-white/10 hover:bg-white/20 rounded flex items-center justify-center font-black cursor-pointer">+</button>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-white/15 flex justify-between font-bold text-[11px]">
                    <span>Total Weight:</span>
                    <span className={flourQty + sugarQty + cocoaQty === 100 ? 'text-emerald-400' : 'text-rose-450 animate-pulse'}>
                      {flourQty + sugarQty + cocoaQty} / 100 lbs
                    </span>
                  </div>
                </div>
              )}
            </div>

            {!chore2Done ? (
              <button
                disabled={flourQty + sugarQty + cocoaQty !== 100}
                onClick={() => {
                  addSkillXP('builder', 45);
                  addCoins(6, 'Balanced Baker Supplies');
                  setChore2Done(true);
                  localStorage.setItem('tt_chore2_done', 'true');
                  triggerLocalFeedback('⚖️ Recipe balanced and logged! +45 Builder XP & +6 Coins.');
                }}
                className={`w-full py-2.5 rounded-xl text-black font-brand text-[10px] uppercase tracking-wider font-black transition cursor-pointer ${
                  flourQty + sugarQty + cocoaQty === 100 ? 'bg-gradient-to-r from-pink-500 to-purple-500 hover:scale-[1.02] active:scale-98 shadow-md' : 'bg-neutral-800 text-neutral-600 cursor-not-allowed border border-white/5'
                }`}
              >
                Deliver Rations 🚚
              </button>
            ) : (
              <div className="text-center text-[10px] text-white/30 italic font-sans py-2.5 bg-white/5 border border-white/5 rounded-xl font-bold">✓ Recipe ledger approved by Baker.</div>
            )}
          </div>

          {/* Chore 3: Clinic Safety Checks */}
          <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex flex-col justify-between space-y-4 font-sans">
            <div className="space-y-2.5">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black uppercase tracking-wider text-neutral-400 font-brand">Chore #3</span>
                {chore3Done ? (
                  <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-bold rounded-lg uppercase">Completed</span>
                ) : (
                  <span className="px-2 py-0.5 bg-pink-500/10 border border-pink-500/20 text-pink-400 text-[9px] font-bold rounded-lg uppercase">Active</span>
                )}
              </div>
              <h4 className="font-bold text-white text-sm flex items-center gap-1 font-brand">🩹 Clinic Disinfectant Review</h4>
              <p className="text-xs text-white/55 leading-relaxed">
                Apothecary Oakenhart needs confirmation on basic wellness checks. Verify these items:
              </p>

              {!chore3Done && (
                <div className="space-y-2.5 pt-1 font-sans text-xs flex flex-col">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={cleanSafety.box1}
                      onChange={(e) => setCleanSafety((prev: any) => ({ ...prev, box1: e.target.checked }))}
                      className="rounded border-white/20 bg-black/40 text-pink-500 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                    />
                    <span className="font-medium text-white/80">Pestles washed in peppermint water</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={cleanSafety.box2}
                      onChange={(e) => setCleanSafety((prev: any) => ({ ...prev, box2: e.target.checked }))}
                      className="rounded border-white/20 bg-black/40 text-pink-555 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                    />
                    <span className="font-medium text-white/80">Linen sheets boiled at 100°C</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={cleanSafety.box3}
                      onChange={(e) => setCleanSafety((prev: any) => ({ ...prev, box3: e.target.checked }))}
                      className="rounded border-white/20 bg-black/40 text-pink-500 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                    />
                    <span className="font-medium text-white/80">Mold spores vacuum-sealed in glass</span>
                  </label>
                </div>
              )}
            </div>

            {!chore3Done ? (
              <button
                disabled={!cleanSafety.box1 || !cleanSafety.box2 || !cleanSafety.box3}
                onClick={() => {
                  addSkillXP('explorer', 30);
                  addCoins(3, 'Apothecary Safety Check');
                  setChore3Done(true);
                  localStorage.setItem('tt_chore3_done', 'true');
                  triggerLocalFeedback('🩹 Safety check verified! +30 Explorer XP & +3 Coins.');
                }}
                className={`w-full py-2.5 rounded-xl text-black font-brand text-[10px] uppercase tracking-wider font-black transition cursor-pointer ${
                  cleanSafety.box1 && cleanSafety.box2 && cleanSafety.box3 ? 'bg-gradient-to-r from-pink-500 to-purple-500 hover:scale-[1.02] active:scale-98 shadow-md' : 'bg-neutral-800 text-neutral-600 cursor-not-allowed border border-white/5'
                }`}
              >
                Confirm Checklist 🛡️
              </button>
            ) : (
              <div className="text-center text-[10px] text-white/30 italic font-sans py-2.5 bg-white/5 border border-white/5 rounded-xl font-bold">✓ Safety protocols logged.</div>
            )}
          </div>

        </div>

        {/* Bottom Timer Status */}
        <div className="border-t border-white/10 pt-3 flex justify-between items-center text-xs text-white/40 shrink-0 font-sans z-10">
          <div className="flex items-center gap-2 font-bold">
            <span>Completed:</span>
            <span className="font-extrabold text-pink-400">
              {([chore1Done, chore2Done, chore3Done].filter(Boolean).length)} / 3 Chores
            </span>
          </div>
          <div className="flex items-center gap-2 font-mono">
            <span>New Chores in:</span>
            <span className="text-yellow-400 font-extrabold">{formatTimer(secondsToNext)}</span>
          </div>
        </div>

      </div>
    </div>
  );
};
