import React, { useState } from 'react';
import { useTTStore } from '../../store/useTTStore';
import { GG_TravellerDeck_Header } from './GG_TravellerDeck_Header';
import type { SubPage } from '../../lib/uiConstants';
import { FONT } from '../../lib/uiConstants';
import { updateResidentJournal } from '../../utils/journalHelper';
import { problems } from '../../data/towns/ganache-grove/problems';

interface GG_TravellerDeck_MissionsProps {
  setSubPage: (page: SubPage) => void;
  popPage: () => void;
  inventory: Record<string, number>;
  setInventory: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  triggerFeedback: (msg: string) => void;
}

const CATEGORY_META: Record<string, { label: string; icon: string; color: string; bg: string }> = {
  project:  { label: 'Project',  icon: '🔨', color: 'text-amber-300',  bg: 'bg-amber-500/10 border-amber-500/30' },
  mystery:  { label: 'Mystery',  icon: '🔍', color: 'text-cyan-300',   bg: 'bg-cyan-500/10 border-cyan-500/30'  },
  health:   { label: 'Health',   icon: '💊', color: 'text-pink-300',   bg: 'bg-pink-500/10 border-pink-500/30'  },
  market:   { label: 'Market',   icon: '🏪', color: 'text-yellow-300', bg: 'bg-yellow-500/10 border-yellow-500/30' },
  trade:    { label: 'Trade',    icon: '🛶', color: 'text-emerald-300',bg: 'bg-emerald-500/10 border-emerald-500/30' },
};

const getBonusXP = () => Math.floor(Math.random() * 5) + 10;

export const GG_TravellerDeck_Missions: React.FC<GG_TravellerDeck_MissionsProps> = ({
  setSubPage,
  popPage,
  inventory,
  setInventory,
  triggerFeedback,
}) => {
  const { completedMissions, completeMission, coins, spendCoins } = useTTStore();
  const [activeFilter, setActiveFilter] = useState<string>('all');

  // Only show top-level (stage 1 or no stage) and unlocked child missions
  const visibleMissions = problems.filter(p => {
    if (p.parentIncidentId && !completedMissions.includes(p.parentIncidentId)) return false;
    return true;
  });

  const filtered = activeFilter === 'all'
    ? visibleMissions
    : visibleMissions.filter(p => p.category === activeFilter);

  const handleEmbark = (missionId: string, missionTitle: string, p: typeof problems[0]) => {
    if (completedMissions.includes(missionId)) {
      triggerFeedback('✅ Already completed!');
      return;
    }
    const canAfford = p.costCheck(inventory, coins);
    if (!canAfford) {
      triggerFeedback(`❌ Missing resources! ${p.requirementsSummary}`);
      return;
    }
    const result = p.execute(inventory, coins);
    // Apply deductions
    const newInv = { ...inventory };
    for (const [k, v] of Object.entries(result.deductions.inventory)) {
      newInv[k] = Math.max(0, (newInv[k] || 0) - v);
    }
    setInventory(newInv);
    if (result.deductions.coins > 0) spendCoins(result.deductions.coins, missionTitle);
    completeMission(missionId, missionTitle, getBonusXP());
    triggerFeedback(`🏆 ${result.consequenceTitle} +${result.xp.amount} ${result.xp.skill.toUpperCase()} XP, +${result.legacy} Legacy!`);
    
    updateResidentJournal('dispatch', {
      coins: result.deductions.coins > 0 ? -result.deductions.coins : 0,
      legacy: result.legacy,
      phaseName: `Mission: ${missionTitle}`,
      description: `Successfully completed county operation: "${missionTitle}"`
    });
  };

  return (
    <div className="w-full h-full flex flex-col">
      <GG_TravellerDeck_Header
        title="COUNTY OPERATIONS BOARD"
        setSubPage={setSubPage}
        popPage={popPage}
      />

      {/* Filters */}
      <div className="flex gap-2 mt-4 mb-3 flex-wrap shrink-0">
        {['all', 'project', 'mystery', 'health', 'trade', 'market'].map(f => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all duration-200 ${
              activeFilter === f
                ? 'bg-amber-500 border-amber-400 text-black'
                : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10'
            }`}
            style={{ fontFamily: '"Josefin Sans", sans-serif' }}
          >
            {f === 'all' ? '🗂 All' : `${CATEGORY_META[f]?.icon} ${CATEGORY_META[f]?.label}`}
          </button>
        ))}
        <span className="ml-auto text-[10px] text-white/30 self-center font-sans">
          {filtered.filter(p => completedMissions.includes(p.id)).length}/{filtered.length} done
        </span>
      </div>

      {/* Mission cards grid */}
      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 min-h-0 pr-1">
        {filtered.map((p) => {
          const isDone = completedMissions.includes(p.id);
          const meta = CATEGORY_META[p.category] || CATEGORY_META.project;
          const canAfford = p.costCheck(inventory, coins);
          const isChainChild = !!p.parentIncidentId;

          return (
            <div
              key={p.id}
              className={`rounded-[1.8rem] border overflow-hidden transition-all duration-300 ${
                isDone
                  ? 'border-emerald-500/20 bg-emerald-500/5'
                  : isChainChild
                  ? 'border-cyan-500/20 bg-cyan-950/20 shadow-[0_0_20px_rgba(34,211,238,0.05)]'
                  : 'border-white/10 bg-black/35 hover:border-white/20 hover:bg-black/45'
              }`}
            >
              <div className="p-5">
                {/* Header row */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={`w-9 h-9 rounded-xl border flex items-center justify-center text-lg shrink-0 ${meta.bg}`}>
                      {meta.icon}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-[9px] uppercase tracking-widest font-black ${meta.color} font-sans`}>
                          {meta.label}
                        </span>
                        {p.stage && (
                          <span className="text-[9px] uppercase tracking-widest font-black text-white/25 font-sans">
                            Stage {p.stage}
                          </span>
                        )}
                        {isChainChild && (
                          <span className="text-[9px] px-2 py-0.5 bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 rounded-full font-black font-sans">
                            🔗 Chain
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-brand text-white uppercase leading-tight mt-0.5" style={{ fontFamily: FONT }}>
                        {p.title}
                      </h4>
                    </div>
                  </div>
                  {isDone
                    ? <span className="text-[11px] text-emerald-400 font-bold shrink-0 font-sans">✓ Done</span>
                    : !canAfford
                    ? <span className="text-[10px] text-red-400/70 font-bold shrink-0 font-sans">❌ Resources</span>
                    : <span className="text-[10px] text-amber-400 font-bold shrink-0 font-sans">✅ Ready</span>
                  }
                </div>

                {/* Description */}
                {p.townReactionBefore && (
                  <div className="mb-2 pl-3 border-l-2 border-white/10">
                    <p className="text-[11px] text-white/50 italic leading-relaxed font-sans">
                      &ldquo;{p.townReactionBefore}&rdquo;
                    </p>
                  </div>
                )}
                <p className="text-[12px] text-white/70 leading-relaxed font-sans mb-3">
                  {p.description}
                </p>

                {/* Requirements + Action row */}
                <div className="flex items-center justify-between gap-3 pt-3 border-t border-white/5">
                  <div className="space-y-0.5 min-w-0 flex-1">
                    <p className="text-[10px] font-black text-amber-400/80 font-sans uppercase tracking-wide">Req: {p.requirementsSummary}</p>
                    <p className="text-[10px] text-white/30 font-sans">{p.costCheck(inventory, coins) ? '✅ You have resources' : '❌ Missing resources'}</p>
                  </div>
                  {!isDone ? (
                    <button
                      onClick={() => handleEmbark(p.id, p.title, p)}
                      disabled={!canAfford}
                      className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition shrink-0 ${
                        canAfford
                          ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-black hover:scale-105 active:scale-95 shadow-md'
                          : 'bg-white/5 text-white/25 border border-white/10 cursor-not-allowed'
                      }`}
                      style={{ fontFamily: '"Josefin Sans", sans-serif' }}
                    >
                      Embark →
                    </button>
                  ) : (
                    <div className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 font-sans">
                      ✓ Completed
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center h-48 gap-3 text-white/30">
            <span className="text-5xl">🗂️</span>
            <p className="text-xs font-sans">No missions in this category yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};
