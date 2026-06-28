import React from 'react';
import { FONT } from '../../../pages/TravellersDesk';
import type { SubPage } from '../../../pages/TravellersDesk';

interface MatterItem {
  id: string;
  title: string;
  requirementsSummary: string;
}

interface HomeBox3_ChroniclesProps {
  selectedProj: MatterItem;
  selectedMyst: MatterItem;
  selectedCamp: MatterItem;
  completedActions: string[];
  handleExecuteMatter: (id: string) => void;
  setShowTownHallModal: (show: boolean) => void;
  pushPage: (page: SubPage) => void;
  setPage: (page: any) => void;
  setSubPage: (page: SubPage) => void;
  completedSeriesSteps?: string[];
}

const HomeBox3_Chronicles: React.FC<HomeBox3_ChroniclesProps> = ({
  selectedProj,
  selectedMyst,
  selectedCamp,
  completedActions,
  handleExecuteMatter,
  setShowTownHallModal,
  pushPage,
  setPage,
  setSubPage,
  completedSeriesSteps = [],
}) => {
  const stepsCompleted = completedSeriesSteps.length;
  const isSeriesDone = stepsCompleted >= 15;

  return (
    <div className="relative w-full shrink-0">
      {/* Solid backing layer */}
      <div className="absolute top-2 left-2 right-0 bottom-0 bg-orange-500/35 border-[3px] border-orange-500/40 rounded-3xl -z-10" />

      {/* Main container */}
      <div
        className="mr-2 mb-2 w-[calc(100%-8px)] lg:h-[500px] lg:max-h-[500px] lg:min-h-[500px] rounded-3xl overflow-hidden border-[3px] border-orange-500/40 bg-black/60 relative group z-10 flex flex-col lg:flex-row animate-fade-in"
      >

      {/* LEFT COLUMN: Featured Series Cover (62%) */}
      <div className="w-full lg:w-[62%] lg:h-full lg:min-h-0 min-h-[380px] p-5 flex flex-col justify-between border-b-[3px] lg:border-b-0 lg:border-r-[3px] border-orange-500/40 bg-black">

        {/* Cover Header */}
        <div className="relative z-10 flex justify-between items-start">
          <div>
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-amber-400 block font-sans">Featured Campaign</span>
            <span className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-red-500 text-white animate-pulse font-sans inline-block mt-1">🔴 LIVE</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => pushPage('series')}
              className="px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-600 hover:scale-105 active:scale-95 text-black font-black text-[9px] uppercase tracking-wider rounded-xl transition shadow-md flex items-center gap-1"
              style={{ fontFamily: '"Josefin Sans", sans-serif' }}
            >
              <span>📚</span> Catalog
            </button>
            <button
              onClick={() => setPage('theatre')}
              className="px-3 py-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:scale-105 active:scale-95 text-black font-black text-[9px] uppercase tracking-wider rounded-xl transition shadow-md flex items-center gap-1"
              style={{ fontFamily: '"Josefin Sans", sans-serif' }}
            >
              <span>🎬</span> Theatre
            </button>
          </div>
        </div>

        {/* Book Art Center */}
        <div className="relative z-10 my-4 flex justify-center items-center h-[180px]">
          <img
            src="/Assets/Ganache Grove/Story_Series1/Scene_01.1.png"
            alt="Series 1"
            className="max-h-full max-w-full object-contain rounded-2xl border border-white/10 shadow-[0_12px_36px_rgba(0,0,0,0.6)] hover:rotate-2 transition-transform duration-500"
            onError={(e) => { (e.target as HTMLImageElement).src = '/Assets/Ganache Grove/Scene_0.1.png'; }}
          />
        </div>

        {/* Book Footer Info & Progress */}
        <div className="relative z-10 space-y-3 pt-3 border-t border-white/5">
          <div>
            <p className="text-[9px] uppercase tracking-[0.25em] text-white/40 font-black font-sans">Series 1 · Arc 1</p>
            <h3 className="text-base font-brand text-yellow-55 uppercase leading-none mt-1" style={{ fontFamily: FONT }}>The Honeyberry Loaf Incident</h3>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="flex-1 min-w-0 font-sans">
              {stepsCompleted > 0 ? (
                <div className="space-y-1">
                  <div className="flex justify-between text-[9px] font-black text-amber-400">
                    <span>YOUR PROGRESS</span>
                    <span>{stepsCompleted} / 15 EVENTS</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-700" style={{ width: `${(stepsCompleted / 15) * 100}%` }} />
                  </div>
                </div>
              ) : (
                <p className="text-[11px] text-white/50 leading-snug">
                  Pipkin Nutterby has run off with Baker Mortimer's Honeyberry Loaf! Chase him and earn badges.
                </p>
              )}
            </div>

            <button
              onClick={() => setSubPage('series')}
              className="py-2.5 px-6 rounded-xl font-black uppercase tracking-widest text-[9.5px] text-black transition active:scale-95 hover:brightness-110 shrink-0"
              style={{ background: 'linear-gradient(135deg,#f59e0b 0%,#f97316 100%)', boxShadow: '0 0 15px rgba(245,158,11,0.25)', fontFamily: '"Josefin Sans", sans-serif' }}
            >
              {isSeriesDone ? 'View Badges ✓' : stepsCompleted > 0 ? 'Resume Story →' : 'Begin Story →'}
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Active Matters & Companion (38%) */}
      <div className="w-full lg:w-[38%] lg:h-full lg:min-h-0 p-5 flex flex-col gap-4 justify-between bg-transparent overflow-y-auto custom-scrollbar border-none">

        {/* Lore Keeper Companion */}
        <div
          onClick={() => setPage('pipkin-chat')}
          className="rounded-2xl border-2 border-rose-500/35 bg-transparent p-4 flex flex-col justify-between cursor-pointer hover:border-rose-500/40 transition duration-200"
        >
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[8px] font-black uppercase tracking-widest text-pink-400 font-sans">Companion Chat</span>
              <span className="text-xs">🐿️</span>
            </div>
            <h4 className="text-xs font-brand text-pink-100 uppercase" style={{ fontFamily: FONT }}>Chat with Pipkin</h4>
            <p className="text-[11px] text-pink-200/50 leading-normal mt-1 font-sans">
              Need guidance on town secrets? Ask Pipkin the Prankster &amp; Adventurer!
            </p>
          </div>
          <button className="mt-3 py-1.5 w-full bg-gradient-to-r from-pink-600 to-rose-600 rounded-xl text-[9px] font-black uppercase tracking-widest text-white hover:brightness-110 active:scale-95 transition" style={{ fontFamily: '"Josefin Sans", sans-serif' }}>
            Chat ✉️
          </button>
        </div>

        {/* Active Matters Registry */}
        <div className="rounded-2xl border-2 border-orange-500/30 bg-transparent p-4 flex-grow flex flex-col justify-between">
          <div>
            <span className="text-[8.5px] uppercase tracking-[0.25em] text-amber-400 font-black block font-sans mb-3">Active Matters Registry</span>

            <div className="space-y-2.5">
              {[
                { label: `Support: ${selectedProj.title.replace('Support ', '')}`, desc: selectedProj.requirementsSummary, id: selectedProj.id, btnLabel: '🛠️ Support', btnColor: 'from-amber-500 to-orange-500', textColor: 'text-black' },
                { label: `Investigate: ${selectedMyst.title.replace('Investigate ', '')}`, desc: selectedMyst.requirementsSummary, id: selectedMyst.id, btnLabel: '🔍 Search', btnColor: 'from-cyan-500 to-blue-600', textColor: 'text-white' },
                { label: `Campaign: ${selectedCamp.title.replace('Sponsor ', '').replace('Dredge ', '').replace('Express ', '')}`, desc: 'Town Hall Campaign', id: selectedCamp.id, btnLabel: '🏛️ Go', btnColor: 'from-indigo-500 to-purple-600', textColor: 'text-white' },
              ].map((item) => (
                <div key={item.id} className="rounded-xl border border-orange-500/20 bg-transparent px-3.5 py-2.5 flex items-center justify-between gap-3">
                  <div className="min-w-0 flex-grow font-sans">
                    <span className="text-[11px] font-bold text-white block truncate leading-tight">{item.label}</span>
                    <span className="text-[9.5px] text-white/40 block truncate leading-tight mt-0.5">{item.desc}</span>
                  </div>
                  {completedActions.includes(item.id) ? (
                    <span className="text-[9.5px] text-emerald-400 font-bold shrink-0 font-sans">✓ Done</span>
                  ) : (
                    <button
                      onClick={() => {
                        if (item.id === selectedCamp.id) {
                          setShowTownHallModal(true);
                        } else {
                          handleExecuteMatter(item.id);
                        }
                      }}
                      className={`px-2.5 py-1 bg-gradient-to-r ${item.btnColor} ${item.textColor} text-[9px] font-black uppercase tracking-wider rounded-lg transition shrink-0 hover:scale-105 active:scale-95`}
                      style={{ fontFamily: '"Josefin Sans", sans-serif' }}
                    >
                      {item.btnLabel}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default HomeBox3_Chronicles;
