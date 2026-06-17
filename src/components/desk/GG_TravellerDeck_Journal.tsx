import React, { useState } from 'react';
import { GG_TravellerDeck_Header } from './GG_TravellerDeck_Header';
import { FONT, type SubPage } from '../../pages/TravellersDesk';

interface JournalEntry {
  dayNumber: number;
  completedPhases: string[];
  coinsEarned: number;
  legacyEarned: number;
  memorableEvent: string;
}

interface GG_TravellerDeck_JournalProps {
  setSubPage: (page: SubPage) => void;
  popPage: () => void;
}

export const GG_TravellerDeck_Journal: React.FC<GG_TravellerDeck_JournalProps> = ({
  setSubPage,
  popPage,
}) => {
  const [journalEntries] = useState<Record<string, JournalEntry>>(() => {
    const saved = localStorage.getItem('tt_resident_journal');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse resident journal entries', e);
      }
    }
    return {};
  });

  const entriesArray = Object.entries(journalEntries).sort(
    (a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime()
  );

  return (
    <div className="w-full h-full flex flex-col justify-between">
      <GG_TravellerDeck_Header
        title="RESIDENT JOURNAL"
        setSubPage={setSubPage}
        popPage={popPage}
      />

      <div className="flex-1 border border-white/10 bg-black/25 rounded-[2rem] p-6 overflow-y-auto custom-scrollbar my-4 min-h-0">
        <div className="mb-4">
          <h3 className="text-sm font-brand text-amber-400 uppercase" style={{ fontFamily: FONT }}>
            📓 Permanent Residency Journal
          </h3>
          <p className="text-[10.5px] text-white/50 leading-relaxed mt-0.5">
            A comprehensive historical timeline log of all activities, allowances, and notable events.
          </p>
        </div>

        {entriesArray.length === 0 ? (
          <div className="h-60 flex flex-col items-center justify-center text-white/30 text-xs gap-2">
            <span className="text-4xl">📓</span>
            <span>No journal entries recorded. Complete loop steps or read briefings!</span>
          </div>
        ) : (
          <div className="space-y-4">
            {entriesArray.map(([dateKey, entry]) => (
              <div key={dateKey} className="p-4 bg-white/5 border border-white/10 rounded-2xl flex flex-col md:flex-row gap-4 justify-between animate-fade-in shadow-md">
                <div className="space-y-1.5 max-w-xl">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 bg-amber-500/20 text-amber-300 text-[10px] font-black uppercase rounded-md">
                      Day {entry.dayNumber}
                    </span>
                    <span className="text-[10.5px] text-white/40 font-mono">{dateKey}</span>
                  </div>
                  
                  {entry.completedPhases && entry.completedPhases.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {entry.completedPhases.map((phase, pIdx) => (
                        <span key={pIdx} className="px-2 py-0.5 bg-white/5 border border-white/10 text-white/60 text-[9px] rounded-md font-medium">
                          {phase}
                        </span>
                      ))}
                    </div>
                  )}

                  <p className="text-xs text-white/80 leading-relaxed italic mt-1 bg-black/30 p-2.5 rounded-xl border border-white/5">
                    "{entry.memorableEvent}"
                  </p>
                </div>

                <div className="flex md:flex-col items-end justify-between md:justify-center gap-2 border-t md:border-t-0 md:border-l border-white/5 pt-3 md:pt-0 md:pl-5 shrink-0 text-right">
                  <div>
                    <span className="text-[9px] text-neutral-400 block font-bold uppercase tracking-wider">Session Allowances</span>
                    <span className="text-xs font-semibold text-emerald-400">+{entry.coinsEarned} Coins</span>
                    <span className="text-white/20 mx-1.5 md:hidden">|</span>
                    <span className="text-xs font-semibold text-amber-300 block md:inline font-mono">+{entry.legacyEarned} Legacy</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
