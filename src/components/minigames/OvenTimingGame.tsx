import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useTTStore } from '../../store/useTTStore';
import { pickRotatingWallpaper } from '../../constants/wallpapers';

export type { OvenTimingRewards } from './bakery/bakeryTypes';
import type { OvenTimingRewards } from './bakery/bakeryTypes';
import { BakeryMode } from './bakery/bakeryTypes';
import { ModeSelect }           from './bakery/ModeSelect';
import { LevelDetail }          from './bakery/LevelDetail';
import { BakeryApprenticeship } from './bakery/BakeryApprenticeship';
import { BakeryShift }          from './bakery/BakeryShift';
import { AfterHoursBakery }     from './bakery/AfterHoursBakery';

type PlayableMode = 'apprenticeship' | 'shift' | 'after-hours';

interface AppState {
  view: 'select' | 'detail' | 'playing';
  mode?: PlayableMode;
}

interface OvenTimingGameProps {
  rewards:   OvenTimingRewards;
  onSuccess: () => void;
  onFail:    () => void;
  onClose?:  () => void;
}

export const OvenTimingGame: React.FC<OvenTimingGameProps> = ({
  rewards, onSuccess, onFail, onClose,
}) => {
  const [state, setState] = useState<AppState>({ view: 'select' });
  const setHeaderHidden = useTTStore(s => s.setHeaderHidden);

  // Hide global header when the game is active (any page/subpage)
  useEffect(() => {
    setHeaderHidden(true);
    return () => {
      setHeaderHidden(false);
    };
  }, [setHeaderHidden]);

  const goSelect = () => setState({ view: 'select' });
  const goDetail = (mode: PlayableMode) => setState({ view: 'detail', mode });
  const goPlay   = (mode: PlayableMode) => setState({ view: 'playing', mode });
  const handleClose = () => { onClose?.() ?? onFail(); };

  const renderContent = () => {
    // ── Menus (82vw x 82vh, inside menu glass panel) ───────────────────────
    if (state.view === 'select') {
      return (
        <div className="w-[82vw] h-[82vh] max-h-[82vh] max-w-[82vw] rounded-[2.5rem] overflow-hidden relative shadow-[0_25px_60px_rgba(0,0,0,0.85)] flex flex-col border border-white/12 bg-black/60 backdrop-blur-md animate-fade-in">
          <ModeSelect
            onSelect={goDetail}
            onClose={handleClose}
          />
        </div>
      );
    }

    if (state.view === 'detail' && state.mode) {
      return (
        <div className="w-[82vw] h-[82vh] max-h-[82vh] max-w-[82vw] rounded-[2.5rem] overflow-hidden relative shadow-[0_25px_60px_rgba(0,0,0,0.85)] flex flex-col border border-white/12 bg-black/60 backdrop-blur-md animate-fade-in">
          <LevelDetail
            mode={state.mode}
            onStart={() => goPlay(state.mode!)}
            onBack={goSelect}
          />
        </div>
      );
    }

    // ── Playing (92vw x 99.5vh, inside gameplay glass panel) ─────────────────
    if (state.view === 'playing' && state.mode) {
      const activeComponent = (() => {
        if (state.mode === BakeryMode.Apprenticeship) {
          return (
            <BakeryApprenticeship
              onComplete={() => goPlay(BakeryMode.Shift)}
              onClose={goSelect}
            />
          );
        }

        if (state.mode === BakeryMode.Shift) {
          return (
            <BakeryShift
              rewards={rewards}
              onSuccess={() => { onSuccess(); goSelect(); }}
              onFail={() => { onFail(); goSelect(); }}
              onClose={goSelect}
            />
          );
        }

        return (
          <AfterHoursBakery
            onClose={goSelect}
          />
        );
      })();

      return (
        <div className="w-[92vw] h-[99.5vh] max-h-[99.5vh] max-w-[92vw] rounded-[2.5rem] overflow-hidden relative shadow-[0_25px_60px_rgba(0,0,0,0.85)] flex flex-col border border-white/12 bg-black/60 backdrop-blur-md animate-fade-in">
          {activeComponent}
        </div>
      );
    }

    return (
      <div className="w-[82vw] h-[82vh] max-h-[82vh] max-w-[82vw] rounded-[2.5rem] overflow-hidden relative shadow-[0_25px_60px_rgba(0,0,0,0.85)] flex flex-col border border-white/12 bg-black/60 backdrop-blur-md animate-fade-in">
        <ModeSelect
          onSelect={goDetail}
          onClose={handleClose}
        />
      </div>
    );
  };

  const wallpaperUrl = pickRotatingWallpaper('games-arena');

  return createPortal(
    <div className="fixed inset-0 z-[400] flex items-center justify-center p-2 animate-fade-in"
         style={{ backgroundImage: `url(${wallpaperUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      {renderContent()}
    </div>,
    document.body
  );
};
