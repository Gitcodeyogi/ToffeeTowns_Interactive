
// SkeuomorphicFrame.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Skeuomorphic framing layout that wraps all mini-games, classroom tasks,
// and theatre activities. Houses standard buttons and border assets.
// ─────────────────────────────────────────────────────────────────────────────
import React from 'react';

export type SkeuomorphicTheme = 'wooden' | 'clipboard' | 'ledger' | 'theater';

interface SkeuomorphicFrameProps {
  theme: SkeuomorphicTheme;
  title: string;
  width?: string;
  height?: string;
  isGameplay?: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const SkeuomorphicFrame: React.FC<SkeuomorphicFrameProps> = ({
  theme,
  title,
  width,
  height,
  isGameplay = false,
  onClose,
  children,
}) => {
  const getThemeStyles = () => {
    switch (theme) {
      case 'wooden':
        return {
          containerClass: 'bg-[#2b1704] border-[14px] border-[#4e2f13] rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.8)] text-[#fef08a] relative overflow-hidden',
          headerClass: 'border-b-2 border-amber-950/40 bg-[#3a2006] px-8 py-4 flex justify-between items-center z-20',
          titleClass: 'font-brand uppercase tracking-wider text-base text-yellow-400 font-bold',
          bodyClass: 'p-6 flex-grow flex flex-col relative z-10 bg-transparent text-white min-h-0',
          innerCardClass: 'bg-[#150903] border border-amber-950/40 rounded-2xl shadow-inner p-4 w-full h-full flex flex-col relative z-10 text-white min-h-0',
          decorations: (
            <>
              {/* Copper corner rivets */}
              <div className="absolute top-3 left-3 w-4 h-4 rounded-full bg-gradient-to-r from-amber-500 to-amber-700 border border-amber-900 shadow-md z-10 pointer-events-none" />
              <div className="absolute top-3 right-3 w-4 h-4 rounded-full bg-gradient-to-r from-amber-500 to-amber-700 border border-amber-900 shadow-md z-10 pointer-events-none" />
              <div className="absolute bottom-3 left-3 w-4 h-4 rounded-full bg-gradient-to-r from-amber-500 to-amber-700 border border-amber-900 shadow-md z-10 pointer-events-none" />
              <div className="absolute bottom-3 right-3 w-4 h-4 rounded-full bg-gradient-to-r from-amber-500 to-amber-700 border border-amber-900 shadow-md z-10 pointer-events-none" />
            </>
          ),
          closeButtonClass: 'px-3.5 py-1.5 bg-yellow-400 hover:bg-yellow-300 text-black font-brand font-black rounded-lg text-[10px] uppercase tracking-wider transition duration-150 cursor-pointer shadow-md shadow-amber-950/30',
        };

      case 'clipboard':
        return {
          containerClass: 'bg-[#d97706] border-[12px] border-[#b45309] rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.75)] text-[#fef3c7] relative overflow-hidden',
          headerClass: 'border-b-2 border-amber-950/40 bg-[#92400e] px-8 py-4 flex justify-between items-center z-20',
          titleClass: 'font-brand uppercase tracking-wider text-base text-yellow-300 font-bold',
          bodyClass: 'p-6 flex-grow flex flex-col relative z-10 bg-transparent text-white min-h-0',
          innerCardClass: 'bg-[#fef3c7] border border-amber-900/20 rounded-2xl shadow-inner p-4 w-full h-full flex flex-col relative z-10 text-neutral-800 min-h-0',
          decorations: (
            <>
              {/* Metallic clip bar at top center */}
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-48 h-10 bg-gradient-to-b from-zinc-300 via-zinc-400 to-zinc-600 rounded-b-xl border-x border-b border-zinc-500 shadow-md flex items-center justify-center gap-4 z-30 pointer-events-none">
                <div className="w-2.5 h-2.5 rounded-full bg-zinc-800 border border-zinc-400 shadow-inner" />
                <div className="w-16 h-3 bg-zinc-700 rounded-full border border-zinc-500 shadow-inner" />
                <div className="w-2.5 h-2.5 rounded-full bg-zinc-800 border border-zinc-400 shadow-inner" />
              </div>
            </>
          ),
          closeButtonClass: 'px-3.5 py-1.5 bg-[#451a03] hover:bg-[#270e02] text-white font-brand font-black rounded-lg text-[10px] uppercase tracking-wider transition duration-150 cursor-pointer shadow-md shadow-amber-950/40',
        };

      case 'ledger':
        return {
          containerClass: 'bg-[#155e75] border-[14px] border-[#0e7490] rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.78)] text-[#ecfeff] relative overflow-hidden',
          headerClass: 'border-b-2 border-cyan-950/40 bg-[#0f766e] px-8 py-4 flex justify-between items-center z-20',
          titleClass: 'font-brand uppercase tracking-wider text-base text-cyan-200 font-bold',
          bodyClass: 'p-6 flex-grow flex flex-col relative z-10 bg-transparent text-white min-h-0',
          innerCardClass: 'bg-[#f0fdfa] border border-teal-900/20 rounded-2xl shadow-inner p-4 w-full h-full flex flex-col relative z-10 text-neutral-800 min-h-0',
          decorations: (
            <>
              {/* Copper ring binders on left side */}
              <div className="absolute top-24 left-1.5 w-6 h-6 rounded-full border-[3px] border-zinc-300 bg-transparent shadow-md z-30 pointer-events-none" />
              <div className="absolute top-1/2 -translate-y-1/2 left-1.5 w-6 h-6 rounded-full border-[3px] border-zinc-300 bg-transparent shadow-md z-30 pointer-events-none" />
              <div className="absolute bottom-24 left-1.5 w-6 h-6 rounded-full border-[3px] border-zinc-300 bg-transparent shadow-md z-30 pointer-events-none" />

              {/* Decorative mini yellow stickers */}
              <div className="absolute top-14 right-6 w-20 h-10 bg-yellow-200/90 border border-yellow-400/50 shadow-md rotate-[6deg] z-20 pointer-events-none p-1.5 text-[8px] text-yellow-900 font-brand">
                <div className="font-bold border-b border-amber-800/10 pb-0.5 mb-0.5">📜 Spore Study</div>
                <div>Glowcap spores luminesce at night...</div>
              </div>
            </>
          ),
          closeButtonClass: 'px-3 py-1.5 bg-[#5e3019] hover:bg-[#462210] text-white font-brand font-black rounded-lg text-[10px] uppercase tracking-wider transition duration-150 cursor-pointer shadow-md',
        };

      case 'theater':
      default:
        return {
          containerClass: 'bg-[#180808] border-[14px] border-[#3b0d0d] rounded-[2.5rem] shadow-[0_30px_90px_rgba(220,38,38,0.2)] text-white relative overflow-hidden',
          headerClass: 'border-b-2 border-red-950/30 bg-[#240606] px-8 py-4 flex justify-between items-center z-20',
          titleClass: 'font-brand uppercase tracking-widest text-lg text-amber-300 drop-shadow-[0_2px_6px_rgba(251,191,36,0.5)]',
          bodyClass: 'p-7 flex-grow flex flex-col relative z-10 bg-transparent text-white min-h-0',
          innerCardClass: 'bg-[#0c0202] border border-red-950/60 rounded-2xl shadow-inner p-4 w-full h-full flex flex-col relative z-10 text-white min-h-0',
          decorations: (
            <>
              {/* Red Velvet drapery curtain overlays */}
              <div className="absolute top-0 bottom-0 left-0 w-5 bg-gradient-to-r from-red-950 via-red-800 to-red-950 border-r border-yellow-500/20 z-10 pointer-events-none" />
              <div className="absolute top-0 bottom-0 right-0 w-5 bg-gradient-to-l from-red-950 via-red-800 to-red-950 border-l border-yellow-500/20 z-10 pointer-events-none" />
              
              {/* Gold fringe tassels at the top */}
              <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-b from-amber-400 to-amber-600 z-20 pointer-events-none" />

              {/* Spotlight beam glow overlay */}
              <div className="absolute -top-[10%] left-1/4 w-[50%] h-[120%] bg-gradient-to-b from-white/4 via-transparent to-transparent -rotate-12 pointer-events-none z-10" />

              {/* Wooden Stage boards at the bottom */}
              <div className="absolute bottom-0 inset-x-0 h-4 bg-[#2b1704] border-t border-[#4e2f13] z-20 pointer-events-none flex justify-around">
                <div className="w-[1px] h-full bg-black/40" />
                <div className="w-[1px] h-full bg-black/40" />
                <div className="w-[1px] h-full bg-black/40" />
                <div className="w-[1px] h-full bg-black/40" />
                <div className="w-[1px] h-full bg-black/40" />
              </div>
            </>
          ),
          closeButtonClass: 'px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-black font-brand font-black rounded-lg text-[10px] uppercase tracking-wider transition duration-150 cursor-pointer shadow-md shadow-amber-950/30',
        };
    }
  };

  const baseTheme = getThemeStyles();
  const isTheater = theme === 'theater';
  
  // Standard bg-black/65 glass styling applies for everything EXCEPT theater mode (no borders, stretches fully)
  const styles = (!isTheater) ? {
    containerClass: 'bg-black/65 border border-white/10 backdrop-blur-md rounded-[2.5rem] shadow-2xl relative overflow-hidden text-white',
    headerClass: 'border-b border-white/10 bg-black/45 px-8 py-4 flex justify-between items-center relative z-20',
    titleClass: 'font-brand uppercase tracking-wider text-base text-yellow-400 font-bold',
    bodyClass: 'p-0 flex-grow flex flex-col relative z-10 min-h-0',
    innerCardClass: 'w-full h-full flex flex-col relative z-10 min-h-0 border-0 p-0 bg-transparent',
    decorations: null,
    closeButtonClass: 'px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 active:scale-95 text-white font-brand text-[10px] uppercase tracking-wider rounded-xl transition duration-150 cursor-pointer shadow-md font-bold',
  } : baseTheme;

  return (
    <div 
      className={`flex flex-col ${styles.containerClass} animate-fade-in`}
      style={{
        width: width || '88vw',
        height: height || '88vh',
        maxWidth: width ? 'none' : '1024px',
        transition: 'width 0.3s ease, height 0.3s ease',
      }}
    >
      {styles.decorations}
      
      {/* Header */}
      {!isGameplay && (
        <header className={styles.headerClass}>
          <div className="flex items-center gap-3">
            <span className={styles.titleClass}>
              {title}
            </span>
          </div>
          <button onClick={onClose} className={styles.closeButtonClass}>
            Close Task ✕
          </button>
        </header>
      )}

      {/* Body container with innerCard styling */}
      <main className={styles.bodyClass}>
        <div className={styles.innerCardClass}>
          {children}
        </div>
      </main>
    </div>
  );
};
