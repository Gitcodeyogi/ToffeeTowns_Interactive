// GameLayout.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Reusable master template shell for all mini-games.
// Enforces rulebook layout: w-[92vw] h-[96vh] glass panel.
// ─────────────────────────────────────────────────────────────────────────────
import React from 'react';
import { FONT } from '../../../lib/uiConstants';
import type { MiniGameConfig, EquipmentItem } from './MiniGameConfig';

interface ObjectiveItem {
  label: string;
  current: number;
  target: number;
  icon?: string;
}

interface GameLayoutProps {
  config: MiniGameConfig;
  timeLeft: number;
  score: number;
  combo: number;
  maxCombo: number;
  objectives: ObjectiveItem[];
  logLines: string[];
  activeEquipment: EquipmentItem[];
  unlockedPermanents: string[]; // item IDs
  onUseConsumable: (item: EquipmentItem) => void;
  onPause: () => void;
  onExit: () => void;
  children: React.ReactNode; // The game canvas component
  bottomControls?: React.ReactNode; // Optional custom overlays/inputs for the bottom HUD
  sugarRushProgress?: number; // 0-100 progress for special boost
  sugarRushActive?: boolean;
}

export const GameLayout: React.FC<GameLayoutProps> = ({
  config,
  timeLeft,
  score,
  combo,
  maxCombo,
  objectives,
  logLines,
  activeEquipment,
  unlockedPermanents,
  onUseConsumable,
  onPause,
  onExit,
  children,
  bottomControls,
  sugarRushProgress = 0,
  sugarRushActive = false,
}) => {
  if (false as boolean) { console.log(maxCombo, unlockedPermanents); }
  const formatTime = (s: number): string => {
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  };

  const bgGradient = `linear-gradient(135deg, rgba(0, 0, 0, 0.8), rgba(15, 10, 25, 0.95))`;

  // Get active items on the prep list
  const consumables = activeEquipment.filter(item => !item.isPermanent);
  const permanentUpgrades = activeEquipment.filter(item => item.isPermanent);

  return (
    <div 
      className="w-full h-full flex flex-col overflow-hidden animate-fade-in relative rounded-[2.5rem] border border-white/12 text-white"
      style={{ background: bgGradient, backdropFilter: 'blur(16px)' }}
    >
      {/* ── Top Header ── */}
      <div 
        className="shrink-0 px-6 py-3 border-b border-white/10 flex items-center justify-between"
        style={{ background: 'rgba(0, 0, 0, 0.25)' }}
      >
        <div className="flex items-center gap-3">
          <button 
            onClick={onPause}
            className="w-9 h-9 rounded-xl border border-white/15 flex items-center justify-center text-white/60 hover:bg-white/8 transition cursor-pointer text-sm"
            title="Pause Instructions"
          >
            ⏸
          </button>
          <button 
            onClick={onExit}
            className="px-3 py-1.5 rounded-xl border border-rose-500/25 text-rose-400/80 text-[10px] font-black uppercase hover:bg-rose-500/10 transition cursor-pointer"
          >
            ✕ Exit
          </button>
          <div>
            <p className="text-[9px] uppercase tracking-[0.3em] opacity-60 font-black">Arcade Arena</p>
            <h1 className="text-base font-brand text-white uppercase" style={{ fontFamily: FONT }}>
              {config.title}
            </h1>
          </div>
        </div>

        {/* Center Title and Subtitle */}
        <div className="hidden md:block text-center">
          <p className="text-[10px] tracking-wider text-white/50">{config.subtitle}</p>
        </div>

        {/* Right Info: Time & Score */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-[8px] uppercase tracking-widest text-white/30">Score</p>
            <p className="text-lg font-black text-amber-300 font-brand" style={{ fontFamily: FONT }}>{score.toLocaleString()}</p>
          </div>
          {combo >= 2 && (
            <div className="text-center px-2 py-0.5 bg-amber-500/10 border border-amber-500/25 rounded-lg animate-pulse">
              <p className="text-[8px] text-amber-400 uppercase font-black">Streak</p>
              <p className="text-xs font-black text-amber-300">×{combo}</p>
            </div>
          )}
          <div className="px-4 py-1.5 rounded-xl border border-white/10 bg-white/3 text-center">
            <p className="text-[8px] uppercase tracking-widest text-white/30">Time</p>
            <p className={`text-base font-mono font-black ${timeLeft < 30 ? 'text-rose-400 animate-pulse' : 'text-white'}`}>
              {formatTime(timeLeft)}
            </p>
          </div>
        </div>
      </div>

      {/* ── Main Layout Split ── */}
      <div className="flex-grow min-h-0 flex overflow-hidden">
        {/* Left Gameplay Area (65%) */}
        <div className="w-[65%] h-full relative overflow-hidden border-r border-white/10 flex flex-col">
          <div className="flex-1 relative overflow-hidden bg-black/10">
            {children}
          </div>

          {/* Action/Bottom HUD controls panel */}
          {bottomControls && (
            <div className="shrink-0 p-3 bg-black/30 border-t border-white/8 flex items-center justify-between">
              {bottomControls}
            </div>
          )}
        </div>

        {/* Right Workspace Sidebar (35%) */}
        <div className="w-[35%] h-full flex flex-col overflow-hidden bg-black/20">
          
          {/* Objectives Card */}
          <div className="p-4 border-b border-white/10 space-y-3 shrink-0">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-400">
              📋 Current Objectives
            </h3>
            <div className="space-y-2">
              {objectives.map((obj, i) => {
                const complete = obj.current >= obj.target;
                return (
                  <div 
                    key={i} 
                    className={`flex items-center gap-3 px-3 py-2 rounded-xl border transition-all duration-300 ${
                      complete ? 'bg-emerald-950/20 border-emerald-500/25 text-emerald-300' : 'bg-white/4 border-white/8'
                    }`}
                  >
                    {obj.icon && <span className="text-xl">{obj.icon}</span>}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold truncate">{obj.label}</p>
                    </div>
                    <span className="text-xs font-black font-mono">
                      {obj.current} / {obj.target}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Equipment Shelf & Active Boosts (Prep tools active) */}
          <div className="p-4 border-b border-white/10 flex-grow overflow-y-auto space-y-3 custom-scrollbar min-h-0">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-400">
              🛠️ Gear & Consumables
            </h3>
            
            {/* Consumable buttons list */}
            {consumables.length > 0 ? (
              <div className="grid grid-cols-2 gap-2">
                {consumables.map(item => (
                  <button
                    key={item.id}
                    onClick={() => onUseConsumable(item)}
                    className="p-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-cyan-400/40 text-left transition-all active:scale-95 flex flex-col justify-between h-[64px] cursor-pointer"
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="text-lg leading-none">{item.icon}</span>
                      <span className="text-[10px] font-black text-white truncate">{item.name}</span>
                    </div>
                    <p className="text-[8px] text-white/50 leading-tight truncate-2-lines">{item.description}</p>
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-[10px] text-white/35 italic">No consumables prepared for this shift.</p>
            )}

            {/* Permanent Gear list */}
            {permanentUpgrades.length > 0 && (
              <div className="pt-2 border-t border-white/5">
                <h4 className="text-[9px] font-black uppercase text-white/40 tracking-wider mb-2">Equipped Gear</h4>
                <div className="flex flex-wrap gap-1.5">
                  {permanentUpgrades.map(item => (
                    <div 
                      key={item.id} 
                      className="px-2 py-1 rounded-lg border border-purple-500/30 bg-purple-950/20 text-purple-200 text-[10px] font-bold flex items-center gap-1"
                    >
                      <span>{item.icon}</span>
                      <span>{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sugar Rush / Boost Meter if present */}
            {sugarRushProgress > 0 && (
              <div className="pt-3 border-t border-white/5 space-y-1">
                <div className="flex justify-between items-center text-[9px] font-black tracking-wider uppercase">
                  <span className={sugarRushActive ? 'text-amber-400 animate-pulse' : 'text-purple-400'}>
                    {sugarRushActive ? '🍬 Sugar Rush Active!' : '🍬 Sugar Rush Meter'}
                  </span>
                  <span className="font-mono">{Math.round(sugarRushProgress)}%</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/8">
                  <div 
                    className={`h-full rounded-full transition-all duration-300 ${
                      sugarRushActive ? 'bg-gradient-to-r from-amber-400 to-orange-500 animate-pulse' : 'bg-purple-500'
                    }`}
                    style={{ width: `${sugarRushProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Live Catch Log */}
          <div className="p-4 shrink-0 h-[150px] flex flex-col bg-black/40">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-2">
              📜 Live Broadcast Log
            </h3>
            <div className="flex-1 overflow-y-auto custom-scrollbar font-mono text-[9px] space-y-1 text-white/60 leading-normal select-none">
              {logLines.length > 0 ? (
                logLines.map((line, i) => (
                  <div key={i} className="animate-fade-in border-l-2 border-white/10 pl-2 py-0.5 truncate">
                    {line}
                  </div>
                ))
              ) : (
                <div className="text-white/20 italic">Awaiting logs...</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
