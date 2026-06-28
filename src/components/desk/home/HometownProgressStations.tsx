import React from 'react';
import type { LevelInfo } from '../../../lib/uiConstants';
import { FONT } from '../../../lib/uiConstants';
import type { StationInfo } from '../../../lib/uiConstants';

const LEVEL_THEMES: Record<number, {
  name: string;
  emoji: string;
  text: string;
}> = {
  1: { name: 'Probationer', emoji: '🏡', text: 'text-emerald-400' },
  2: { name: 'Resident', emoji: '🌿', text: 'text-teal-400' },
  3: { name: 'Contributor', emoji: '🍁', text: 'text-amber-400' },
  4: { name: 'Steward', emoji: '🌳', text: 'text-emerald-400' },
  5: { name: 'Benefactor', emoji: '🎁', text: 'text-purple-400' },
  6: { name: 'Champion', emoji: '⭐', text: 'text-pink-400' },
  7: { name: 'Citizen', emoji: '👑', text: 'text-yellow-400' },
};

interface HometownProgressStationsProps {
  selectedDropdownLevel: number;
  setSelectedDropdownLevel: (level: number) => void;
  selectedStation: StationInfo | null;
  setSelectedStation: (station: StationInfo | null) => void;
  levelStationsList: StationInfo[];
  playerLvlInfo: LevelInfo;
  currentStationIndexWithinLevel: number;
  totalXP: number;
}

export const HometownProgressStations: React.FC<HometownProgressStationsProps> = ({
  selectedDropdownLevel,
  setSelectedDropdownLevel,
  selectedStation,
  setSelectedStation,
  levelStationsList,
  playerLvlInfo,
  currentStationIndexWithinLevel,
  totalXP,
}) => {
  const selectedTheme = LEVEL_THEMES[selectedDropdownLevel] || LEVEL_THEMES[1];

  return (
    <div className="relative bg-black/55 border border-white/10 rounded-[2.2rem] p-5 shadow-lg select-none">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-4">
        <div className="text-left">
          <span className={`text-[9px] font-black uppercase tracking-[0.25em] ${selectedTheme.text}`}>
            Level Pathway · {selectedTheme.name}
          </span>
          <h3 className="text-sm font-brand uppercase text-white tracking-wide mt-0.5" style={{ fontFamily: FONT }}>
            Hometown Progress Stations
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Select Level:</label>
          <select
            value={selectedDropdownLevel}
            onChange={(e) => {
              setSelectedDropdownLevel(Number(e.target.value));
              setSelectedStation(null);
            }}
            className="bg-black/60 border border-white/15 rounded-xl text-xs text-white px-3 py-1.5 focus:outline-none focus:border-amber-400 font-brand uppercase tracking-wider"
            style={{ fontFamily: '"Josefin Sans", sans-serif' }}
          >
            {Array.from({ length: 7 }).map((_, i) => {
              const lvl = i + 1;
              const theme = LEVEL_THEMES[lvl];
              return (
                <option key={lvl} value={lvl} className="bg-neutral-900 text-white">
                  {theme.emoji} Lvl {lvl}: {theme.name}
                </option>
              );
            })}
          </select>
        </div>
      </div>

      <div className="h-32 relative flex items-center justify-between px-16 border border-white/5 rounded-2xl bg-black/20 overflow-hidden">
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="glowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="50%" stopColor="#fb923c" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
          </defs>
          <path
            d="M 20% 30% L 50% 70% L 80% 30%"
            fill="none"
            stroke="url(#glowGrad)"
            strokeWidth="4"
            strokeDasharray="8, 6"
            className="animate-key-dash"
          />
        </svg>

        {levelStationsList.map((st, index) => {
          const isCurrent = playerLvlInfo.level === selectedDropdownLevel && index === currentStationIndexWithinLevel;
          const isCompleted = (playerLvlInfo.level > selectedDropdownLevel) || (playerLvlInfo.level === selectedDropdownLevel && index < currentStationIndexWithinLevel);
          const isStSelected = selectedStation?.id === st.id;

          return (
            <div
              key={st.id}
              className="flex flex-col items-center z-10 relative cursor-pointer group"
              style={{ transform: `translateY(${st.offsetY}px)` }}
              onClick={() => setSelectedStation(st)}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-xs transition-all duration-300 border-2 ${
                  isCompleted
                    ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-[0_0_15px_rgba(52,211,153,0.5)]'
                    : isCurrent
                    ? 'bg-amber-500/20 border-amber-400 text-amber-300 animate-pulse shadow-[0_0_20px_rgba(245,158,11,0.8)] scale-110'
                    : 'bg-neutral-800/40 border-neutral-700 text-neutral-500'
                } ${isStSelected ? 'border-white scale-120 shadow-[0_0_25px_white]' : ''}`}
              >
                <span className="font-bold">{isCompleted ? '✓' : index + 1}</span>
              </div>
              <div className="absolute top-11 whitespace-nowrap text-[9px] font-brand uppercase tracking-wider font-black text-white/70 group-hover:text-white transition-colors">
                {st.name}
              </div>
            </div>
          );
        })}
      </div>

      {selectedStation && (
        <div className="mt-4 p-4 bg-[#0a0c10]/95 border border-white/10 rounded-2xl animate-key-slide-in text-left relative z-20 text-indigo-100 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
          <div className="flex justify-between items-start border-b border-white/10 pb-2 mb-2">
            <div>
              <span className={`text-[8px] font-black uppercase tracking-[0.25em] ${selectedTheme.text}`}>
                Station {selectedStation.id} Details · Lvl {selectedDropdownLevel}
              </span>
              <h4 className="text-xs font-brand uppercase text-white font-black mt-0.5" style={{ fontFamily: FONT }}>
                {selectedStation.name}
              </h4>
            </div>
            <button
              onClick={() => setSelectedStation(null)}
              className="text-[9px] text-neutral-400 hover:text-white bg-white/5 hover:bg-white/10 px-2 py-0.5 rounded border border-white/5 font-black uppercase tracking-wider transition"
            >
              Close Map Card
            </button>
          </div>
          <p className="text-[10px] text-neutral-400 mb-2.5 font-mono">
            XP Target: <strong className={selectedTheme.text}>{selectedStation.xpTarget} XP</strong> (Current Level Total XP: {totalXP})
          </p>
          <div className="space-y-1.5 text-[11px] font-sans">
            {selectedStation.tasks.map((tsk: { label: string; done: boolean }, i: number) => (
              <div key={i} className="flex items-center gap-2">
                <span className={tsk.done ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                  {tsk.done ? '✓' : '×'}
                </span>
                <span className={tsk.done ? 'text-white/80' : 'text-white/40'}>{tsk.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

