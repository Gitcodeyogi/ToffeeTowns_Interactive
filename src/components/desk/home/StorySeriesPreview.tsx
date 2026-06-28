import React from 'react';
import { CANAL_SERIES, type CanalSeriesStep } from '../../../data/series/series1_canal';
import { FONT } from '../../../lib/uiConstants';
import type { SubPage } from '../../../lib/uiConstants';

interface StorySeriesPreviewProps {
  open: boolean;
  toggleSection: (key: string) => void;
  activeStoryPreview: CanalSeriesStep;
  completedSeriesSteps: string[];
  seriesProgressPct: number;
  pushPage: (page: SubPage) => void;
}

export const StorySeriesPreview: React.FC<StorySeriesPreviewProps> = ({
  open,
  toggleSection,
  activeStoryPreview,
  completedSeriesSteps,
  seriesProgressPct,
  pushPage,
}) => (
  <div className="rounded-[2.4rem] border border-white/10 bg-black/35 shadow-xl overflow-hidden transition-all duration-300">
    <button
      onClick={() => toggleSection('series')}
      className="w-full px-6 py-4 flex items-center justify-between text-left border-b border-white/5 bg-white/5 hover:bg-white/10 transition-colors"
    >
      <div className="flex items-center gap-3">
        <span className="text-xl">🎬</span>
        <div>
          <h3 className="text-base font-brand uppercase tracking-wider text-white" style={{ fontFamily: FONT }}>
            Story Series Preview
          </h3>
          <p className="text-[10px] text-neutral-400">A homepage glance at the town story. The theatre opens on its own page.</p>
        </div>
      </div>
      <span className="text-lg text-neutral-400 font-bold">
        {open ? '▼' : '▶'}
      </span>
    </button>

    {open && (
      <div className="p-6 animate-fade-in text-left">
        <div className="grid grid-cols-1 xl:grid-cols-10 gap-5 bg-white/5 border border-pink-500/20 rounded-[1.8rem] p-4 overflow-hidden">
          <div className="xl:col-span-6 rounded-[1.4rem] border border-white/10 bg-black overflow-hidden">
            <div className="flex gap-3 overflow-x-auto custom-scrollbar p-3">
              {CANAL_SERIES.map((step) => {
                const isDone = completedSeriesSteps.includes(step.id);
                const isActive = activeStoryPreview.id === step.id;
                return (
                  <button
                    key={step.id}
                    onClick={() => pushPage('series')}
                    className={`shrink-0 w-[230px] rounded-2xl border overflow-hidden bg-black/60 text-left transition-all duration-200 ${
                      isActive ? 'border-pink-300 shadow-[0_0_24px_rgba(236,72,153,0.22)]' : 'border-white/10 hover:border-white/30'
                    }`}
                  >
                    <div className="aspect-[3/2] bg-black flex items-center justify-center">
                      <img
                        src={step.imagePath}
                        alt={step.title}
                        className="w-full h-full object-contain"
                        onError={(e) => { (e.target as HTMLImageElement).src = '/Assets/Ganache Grove/Scene_0.1.png'; }}
                      />
                    </div>
                    <div className="p-3">
                      <span className={`text-[8px] font-black uppercase tracking-widest ${isDone ? 'text-emerald-300' : isActive ? 'text-pink-300' : 'text-neutral-500'}`}>
                        {isDone ? 'Completed' : isActive ? 'Current' : `Step ${step.stepNumber}`}
                      </span>
                      <h4 className="text-[11px] font-black uppercase text-white leading-tight mt-1">{step.title}</h4>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="xl:col-span-4 p-5 rounded-[1.4rem] border border-white/10 bg-black/45 flex flex-col justify-between gap-5">
            <div>
              <span className="text-[8px] bg-pink-500/20 text-pink-300 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                Act I Series
              </span>
              <h4 className="text-xl font-brand text-white uppercase mt-3 leading-tight" style={{ fontFamily: FONT }}>
                The Honeyberry Loaf Incident
              </h4>
              <p className="text-xs text-neutral-300 leading-relaxed mt-3">
                {activeStoryPreview.storyContext}
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-[9px] uppercase tracking-wider text-neutral-400 mb-1">
                  <span>Town Story Progress</span>
                  <span className="text-pink-300 font-black">{Math.round(seriesProgressPct)}%</span>
                </div>
                <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-pink-400 to-amber-300" style={{ width: `${seriesProgressPct}%` }} />
                </div>
              </div>
              <button
                onClick={() => pushPage('series')}
                className="w-full px-4 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-[10px] font-black uppercase tracking-wider rounded-xl transition hover:scale-[1.02] active:scale-95"
              >
                Open Theatre Page
              </button>
            </div>
          </div>
        </div>
      </div>
    )}
  </div>
);
