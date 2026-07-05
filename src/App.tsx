import React, { useEffect, useState, useRef, Suspense, lazy } from 'react';
import { useTTStore } from './store/useTTStore';
import type { AppPage } from './store/useTTStore';
import { type SubPage } from './lib/uiConstants';


// Pages - Lazy loaded for optimization
const WelcomeShow = lazy(() => import('./pages/WelcomeShow'));
const ChooseTown = lazy(() => import('./pages/ChooseTown'));
const TownTalkEntrancePage = lazy(() => import('./pages/TownTalkEntrancePage'));
const TravellersDesk = lazy(() => import('./pages/TravellersDesk'));
const LeaderboardPage = lazy(() => import('./pages/LeaderboardPage'));
const CoinsPage = lazy(() => import('./pages/CoinsPage'));
const CharactersPage = lazy(() => import('./pages/CharactersPage'));
const BadgesPage = lazy(() => import('./pages/BadgesPage'));
const PipkinChatPage = lazy(() => import('./pages/CocoaChatPage'));import NavBar          from './components/NavBar';
import BgCanvas        from './components/BgCanvas';
import LoginPage       from './components/LoginPage';
import LoadingSpinner   from './components/LoadingSpinner';
import { HelpModal }   from './components/HelpModal';
import { TownEventModal } from './components/TownEventModal';
import { JourneyPopup } from './components/desk/home/JourneyPopup';
import { TownGuideModal } from './components/TownGuideModal';
import { DailyChoresModal } from './components/DailyChoresModal';
import { ResidencyTaskModal } from './components/ResidencyTaskModal';
import { TownTourTracker } from './components/TownTourTracker';
import { ALL_TIMED_EVENTS } from './data/events/townEvents';
import { getDailyWorldEvents } from './store/slices/worldTimeSlice';

const FALLBACK_BG = '/wallpapers/Nature_Wall.jpg';

const LOVELY_WALLPAPERS = [
  '/wallpapers/MagicalGarden.png',
  '/wallpapers/AutumnForest.png',
  '/wallpapers/Cherry blossoms.png',
  '/wallpapers/MoonlitLakeside.png',
  '/wallpapers/LushFields.png',
  '/wallpapers/LakeSide.png',
  '/wallpapers/ElCapitan.png',
  '/wallpapers/SpringSerenity.png',
  '/wallpapers/MoonlitWinter.png',
  '/wallpapers/LakeView.png',
  '/wallpapers/Alpine_1.png',
  '/wallpapers/DewyRainbow.png',
  '/wallpapers/SereneCountry.png'
];

const App: React.FC = () => {
  const {
    currentPage,
    setPage,
    welcomeDone,
    user,
    authLoading,
    initAuth,
    headerHidden,
    showHelpModal,
    isModalOpen,
    coins,
    spendCoins,
    addCoins,
    addLegacy,
    addSkillXP,
    activeTimedEvent,
    setActiveTimedEvent,
    setActiveEventResult,
    showRoadmapModal,
    setShowRoadmapModal,
    roadmapNPCData,
    setRoadmapNPCData,
    showTownGuide,
    showDailyChores,
    showTownTour,
    residencyTaskStage
  } = useTTStore();

  const [bgUrl, setBgUrl] = useState(() => {
    const initialIndex = Math.floor(Math.random() * LOVELY_WALLPAPERS.length);
    return LOVELY_WALLPAPERS[initialIndex] || FALLBACK_BG;
  });

  const [activeResolution, setActiveResolution] = useState<{
    event: any;
    choice: any;
  } | null>(null);

  interface SimulationAlert {
    title: string;
    time: string;
    type: 'starting' | 'upcoming';
    description: string;
    effect: string;
  }

  const [simulationAlert, setSimulationAlert] = useState<SimulationAlert | null>(null);

  // Initialize Auth
  useEffect(() => {
    initAuth();
  }, [initAuth]);

  // Redirect if welcome not done (only if logged in)
  useEffect(() => {
    if (user && !welcomeDone && currentPage !== 'welcome' && currentPage !== 'choose-town') {
      setPage('welcome');
    }
  }, [user, welcomeDone, currentPage, setPage]);

  // Rotate wallpaper every 15 minutes (900,000ms) - continuous and independent of page changes
  useEffect(() => {
    const interval = setInterval(() => {
      setBgUrl((prev) => {
        const pool = LOVELY_WALLPAPERS.filter(w => w !== prev);
        const nextBg = pool[Math.floor(Math.random() * pool.length)] || LOVELY_WALLPAPERS[0];
        const img = new Image();
        img.onload = () => {
          // Wallpaper loaded
        };
        img.src = nextBg;
        return nextBg;
      });
    }, 15 * 60 * 1000); // 15 minutes
    return () => clearInterval(interval);
  }, []);

  // ── Central helper to record when a popup closes ──
  const recordPopupClosed = () => {
    localStorage.setItem('tt_last_popup_closed_time', Date.now().toString());
  };

  // ── Monitor popup states and record closed time when going from open to closed ──
  const prevPopupsOpenRef = useRef(false);
  useEffect(() => {
    const isAnyPopupOpen = !!(showHelpModal || activeTimedEvent || activeResolution || showRoadmapModal || showTownGuide || showDailyChores || showTownTour);
    if (prevPopupsOpenRef.current && !isAnyPopupOpen) {
      recordPopupClosed();
    }
    prevPopupsOpenRef.current = isAnyPopupOpen;
  }, [showHelpModal, activeTimedEvent, activeResolution, showRoadmapModal, showTownGuide, showDailyChores, showTownTour]);

  // ── Auto-close effect for system-triggered popups (max 90 seconds display time) ──
  useEffect(() => {
    if (activeTimedEvent || activeResolution) {
      const timer = setTimeout(() => {
        if (activeTimedEvent) {
          setActiveTimedEvent(null);
        }
        if (activeResolution) {
          setActiveResolution(null);
          setActiveEventResult(null);
        }
      }, 90000); // 90 seconds

      return () => clearTimeout(timer);
    }
  }, [activeTimedEvent, activeResolution, setActiveTimedEvent, setActiveResolution, setActiveEventResult]);

  // ── 1-Hour Timed Popups Checkers (Global) ──
  useEffect(() => {
    if (!user || !welcomeDone || currentPage === 'welcome' || currentPage === 'choose-town') return;

    const checkTimedEvents = () => {
      const now = Date.now();
      const isAnyPopupOpen = !!(showHelpModal || activeTimedEvent || activeResolution || showRoadmapModal);
      if (isAnyPopupOpen) return;

      // Only show when the player is inside the town (not at home, desk hub, or outside the desk page)
      const activeSubPage = localStorage.getItem('tt_active_subpage') || 'home';
      const isInTown = currentPage === 'desk' &&
        activeSubPage !== 'home' &&
        activeSubPage !== 'dashboard' &&
        activeSubPage !== 'journal' &&
        activeSubPage !== 'stampbook';
      if (!isInTown) return;

      // Don't show if it has been less than 20 minutes since the last popup closed
      const lastClosedStr = localStorage.getItem('tt_last_popup_closed_time');
      const lastClosedTime = lastClosedStr ? parseInt(lastClosedStr, 10) : 0;
      if (now - lastClosedTime < 20 * 60 * 1000) return;

      // Timed Pop-up Events (every 1 hour of active play)
      const lastEventStr = localStorage.getItem('tt_last_hourly_event_time');
      if (!lastEventStr) {
        localStorage.setItem('tt_last_hourly_event_time', now.toString());
      } else {
        const lastEventTime = parseInt(lastEventStr, 10);
        if (now - lastEventTime >= 60 * 60 * 1000) {
          const dayIndex = (new Date().getDate() % 10) + 1;
          const filteredEvents = ALL_TIMED_EVENTS.filter(
            ev => !ev.gazetteDays || ev.gazetteDays.includes(dayIndex)
          );
          const randomEvent = filteredEvents[Math.floor(Math.random() * filteredEvents.length)];
          if (randomEvent) {
            setActiveTimedEvent(randomEvent);
            localStorage.setItem('tt_last_hourly_event_time', now.toString());
          }
        }
      }
    };

    checkTimedEvents();
    const checkInterval = setInterval(checkTimedEvents, 10000);
    return () => clearInterval(checkInterval);
  }, [user, welcomeDone, currentPage, setActiveTimedEvent, showHelpModal, activeTimedEvent, activeResolution, showRoadmapModal, showTownGuide, showDailyChores, showTownTour]);

  // ── Simulation Event Timeline pop-ups (on-time and 10 mins before) ──
  useEffect(() => {
    if (!user || !welcomeDone || currentPage === 'welcome' || currentPage === 'choose-town') return;

    const checkSimulationTimeline = () => {
      const dailySimEvents = getDailyWorldEvents();
      const nowTime = new Date();
      const currentHour = nowTime.getHours();
      const currentMin = nowTime.getMinutes();
      const totalMinutesNow = currentHour * 60 + currentMin;

      dailySimEvents.forEach(ev => {
        const evMinutes = ev.hour * 60 + ev.minute;

        // 1. Check "Active Now" (starts exactly now, e.g. 15:00)
        if (totalMinutesNow === evMinutes) {
          const shownKey = `tt_sim_alert_${ev.time}_${ev.title}_active_${nowTime.toDateString()}`;
          if (!localStorage.getItem(shownKey)) {
            localStorage.setItem(shownKey, 'true');
            setSimulationAlert({
              title: ev.title,
              time: ev.time,
              type: 'starting',
              description: ev.description,
              effect: ev.effect
            });
            // Play a gentle alert sound
            try {
              const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
              const osc = audioCtx.createOscillator();
              const gain = audioCtx.createGain();
              osc.type = 'sine';
              osc.frequency.setValueAtTime(600, audioCtx.currentTime);
              osc.frequency.exponentialRampToValueAtTime(1000, audioCtx.currentTime + 0.15);
              gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
              gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
              osc.connect(gain);
              gain.connect(audioCtx.destination);
              osc.start();
              osc.stop(audioCtx.currentTime + 0.3);
            } catch (e) {
              // Ignore web audio errors in background simulation checking
            }
          }
        }

        // 2. Check "Starts in 10 mins" (10 minutes before, e.g. 14:50)
        const targetUpcomingMinutes = (evMinutes - 10 + 1440) % 1440;
        if (totalMinutesNow === targetUpcomingMinutes) {
          const shownKey = `tt_sim_alert_${ev.time}_${ev.title}_upcoming_${nowTime.toDateString()}`;
          if (!localStorage.getItem(shownKey)) {
            localStorage.setItem(shownKey, 'true');
            setSimulationAlert({
              title: ev.title,
              time: ev.time,
              type: 'upcoming',
              description: ev.description,
              effect: ev.effect
            });
            // Play a gentle double chirp sound
            try {
              const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
              const osc = audioCtx.createOscillator();
              const gain = audioCtx.createGain();
              osc.type = 'sine';
              osc.frequency.setValueAtTime(800, audioCtx.currentTime);
              gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
              gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
              osc.connect(gain);
              gain.connect(audioCtx.destination);
              osc.start();
              osc.stop(audioCtx.currentTime + 0.15);
            } catch (e) {
              // Ignore web audio errors in background simulation checking
            }
          }
        }
      });
    };

    checkSimulationTimeline();
    const interval = setInterval(checkSimulationTimeline, 15000); // Check every 15 seconds
    return () => clearInterval(interval);
  }, [user, welcomeDone, currentPage]);

  const handleParticipateInSimulation = (ev: SimulationAlert) => {
    // Map event description / title / details to target SubPage
    const title = ev.title.toLowerCase();
    const desc = ev.description.toLowerCase();
    let targetPage: SubPage = 'shop';

    if (title.includes('market') || title.includes('butter') || title.includes('price') || title.includes('sugar') || desc.includes('market') || desc.includes('merchant')) {
      targetPage = 'shop';
    } else if (title.includes('academy') || title.includes('classroom') || title.includes('study') || desc.includes('classroom') || desc.includes('library')) {
      targetPage = 'classroom';
    } else if (title.includes('theatre') || title.includes('play') || title.includes('show') || desc.includes('theatre') || desc.includes('playhouse')) {
      targetPage = 'theatre';
    } else if (title.includes('monorail') || title.includes('train') || title.includes('transit') || desc.includes('monorail') || desc.includes('transit')) {
      targetPage = 'transport';
    } else if (title.includes('gossip') || title.includes('whisper') || desc.includes('gossip') || desc.includes('whisper')) {
      targetPage = 'gossip';
    } else if (title.includes('clinic') || title.includes('remed') || title.includes('sneezles') || desc.includes('clinic') || desc.includes('remedy')) {
      targetPage = 'health';
    } else if (title.includes('town hall') || title.includes('politics') || desc.includes('town hall')) {
      targetPage = 'politics';
    }

    window.dispatchEvent(new CustomEvent('tt_change_subpage', { detail: targetPage }));
    setPage('desk');
    setSimulationAlert(null);
  };

  const handleTimedEventChoice = (choice: any) => {
    // 1. Deduct cost
    if (choice.coinCost) {
      spendCoins(choice.coinCost, `Event Choice: ${choice.label}`);
    }
    // 2. Add gain
    if (choice.coinGain) {
      addCoins(choice.coinGain, `Event Choice: ${choice.label}`);
    }
    // 3. Add legacy
    if (choice.legacyGain) {
      addLegacy(choice.legacyGain);
    }
    // 4. Add XP
    if (choice.xpGain && choice.xpCategory) {
      addSkillXP(choice.xpCategory, choice.xpGain);
    }

    // Set active resolution with the full event and choice data
    setActiveResolution({
      event: activeTimedEvent,
      choice: choice
    });

    // Show outcome feedback in a smaller standalone pop-up (75vw x 75vh)
    setActiveEventResult(choice.result);

    // Close the choice modal
    setActiveTimedEvent(null);
  };

  // Loading Screen
  if (authLoading) {
    return <LoadingSpinner message="Opening the Forest Gate..." />;
  }

  // Auth Guard
  if (!user) {
    return (
      <div className="relative w-full h-screen overflow-hidden flex flex-col">
        {/* Global animated background */}
        <BgCanvas bgUrl={bgUrl} />
        <LoginPage />
      </div>
    );
  }

  const showNav = welcomeDone && currentPage !== 'welcome' && currentPage !== 'choose-town' && currentPage !== 'town-talk-entrance' && !residencyTaskStage;
  const isPopupActive = !!(showHelpModal || activeTimedEvent || activeResolution || showRoadmapModal || showTownGuide || showDailyChores || showTownTour);

  return (
    <div className="relative w-full h-screen overflow-hidden flex flex-col">

      {/* ── Global animated background ── */}
      <BgCanvas bgUrl={bgUrl} />

      {/* ── Page Layout Wrapper (Blurs & zoom-out scale when modal is active) ── */}
      <div className={`relative z-10 flex-1 flex flex-col min-h-0 transition-all duration-500 origin-center ${
        isPopupActive ? 'blur-[8px] brightness-[0.4] scale-[0.985] pointer-events-none select-none' : ''
      }`}>
        {/* ── Top Nav (shown after onboarding) ── */}
        {showNav && (
          <div>
            <NavBar
              currentPage={currentPage}
              onNav={(page) => setPage(page as AppPage)}
              homeTown={useTTStore.getState().homeTown}
              hidden={headerHidden}
            />
          </div>
        )}

        {/* ── Page Content ── */}
        <div className={`flex-1 overflow-y-auto custom-scrollbar ${showNav ? '' : 'h-full'}`}>
          {residencyTaskStage ? (
            <ResidencyTaskModal />
          ) : (
            <>
              <Suspense fallback={
                <div className="w-full h-full flex flex-col items-center justify-center p-8 text-neutral-400 font-brand">
                  <div className="w-12 h-12 rounded-full border-2 border-amber-500/20 border-t-amber-500 animate-spin mb-4" />
                  <span className="text-xs uppercase tracking-widest">Entering Ganache Grove...</span>
                </div>
              }>
                {currentPage === 'welcome'      && <WelcomeShow />}
              {currentPage === 'choose-town' && <ChooseTown />}
              {currentPage === 'town-talk-entrance' && <TownTalkEntrancePage />}
              {currentPage === 'desk'         && <TravellersDesk />}
              {currentPage === 'leaderboard'  && <LeaderboardPage />}
              {currentPage === 'coins'        && <CoinsPage />}
              {currentPage === 'characters'   && <CharactersPage />}
              {currentPage === 'badges'       && <BadgesPage />}
              {currentPage === 'pipkin-chat'   && <PipkinChatPage />}
              </Suspense>
            </>
          )}
        </div>
      </div>

      {/* Global resting unhide star when website header is hidden */}
      {headerHidden && !isModalOpen && !isPopupActive && (
        <button
          onClick={() => useTTStore.getState().setHeaderHidden(false)}
          className="fixed top-4 right-4 z-[240] w-8 h-8 rounded-full border border-amber-500/30 bg-[#111116]/95 flex items-center justify-center cursor-pointer shadow-[0_2px_10px_rgba(245,158,11,0.25)] hover:scale-110 active:scale-95 transition-all duration-300 text-sm hover:border-amber-400"
          title="Show Header"
        >
          ⭐
        </button>
      )}

      {/* Help Modal Overlay */}
      {showHelpModal && (
        <div className="fixed inset-0 z-[500] bg-black/10 flex items-center justify-center p-4 animate-fade-in">
          <HelpModal />
        </div>
      )}

      {/* Hourly Timed Pop-up Event Modal Overlay (85vw x 85vh) */}
      {activeTimedEvent && !showHelpModal && (
        <div className="fixed inset-0 bg-black/10 flex items-center justify-center z-[310] p-4 animate-fade-in">
          <TownEventModal
            event={activeTimedEvent}
            onChoice={handleTimedEventChoice}
            onClose={() => setActiveTimedEvent(null)}
            coins={coins}
          />
        </div>
      )}

      {/* Timed Event Outcome Popup Overlay (85vw x 85vh) - Standalone Layout */}
      {activeResolution && !activeTimedEvent && !showHelpModal && (
        <div className="fixed inset-0 bg-black/10 flex items-center justify-center z-[330] p-4 animate-fade-in">
          <div
            className="flex overflow-hidden shadow-[0_40px_140px_rgba(0,0,0,0.8)] animate-fade-in"
            style={{
              width:        '85vw',
              height:       '85vh',
              borderRadius: '2.5rem',
              border:       '1.5px solid rgba(255,255,255,0.15)',
              background:   'rgba(0, 0, 0, 0.60)',
            }}
          >
            {/* LEFT PANEL — 55% width */}
            <div
              className="relative shrink-0 flex flex-col overflow-hidden"
              style={{
                width:       '55%',
                height:      '100%',
                borderRight: '1px solid rgba(255,255,255,0.07)',
                background:  '#09090b',
              }}
            >
              {/* ── 3:2 Image Slot ── */}
              <div
                className="relative w-full shrink-0 overflow-hidden"
                style={{ aspectRatio: '3/2' }}
              >
                <img
                  src={activeResolution.event?.image || '/Assets/Ganache Grove/Scene_0.1.png'}
                  alt="Event Outcome"
                  className="absolute inset-0 w-full h-full object-cover object-top"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/Assets/Ganache Grove/Scene_0.1.png';
                  }}
                />

                {/* Top-left: icon */}
                <div className="absolute top-5 left-5 z-10 bg-black/60 border border-white/10 p-2.5 rounded-2xl shadow-lg flex items-center justify-center">
                  <span className="text-4xl select-none leading-none">
                    {activeResolution.event?.icon || '🌟'}
                  </span>
                </div>

                {/* Bottom-left: category label + resolution badge */}
                <div className="absolute bottom-4 left-5 z-10 bg-black/60 border border-white/10 p-3 rounded-2xl shadow-lg space-y-1 text-left">
                  <span
                    className="text-[9px] font-black uppercase tracking-[0.22em] text-white block"
                    style={{ fontFamily: '"Josefin Sans", sans-serif' }}
                  >
                    {activeResolution.event?.leftLabel || 'Town Bulletin'}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[9px] font-black uppercase tracking-widest rounded-full bg-emerald-500 text-black select-none font-sans">
                    Outcome Resolved ✓
                  </span>
                </div>
              </div>

              {/* Info section below image */}
              <div className="flex-1 flex flex-col justify-between px-6 py-5 bg-[#09090b] text-left">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-400 block mb-1 font-sans">Original Event</span>
                  <h5 className="font-brand text-white uppercase text-base" style={{ fontFamily: '"Josefin Sans", sans-serif' }}>
                    {activeResolution.event?.title}
                  </h5>
                </div>
                <p className="text-[9px] font-mono text-white/20 uppercase tracking-widest mt-auto">
                  Image Slot 3:2 · 1536 × 1024
                </p>
              </div>
            </div>

            {/* RIGHT PANEL — 45% width */}
            <div
              className="flex flex-col"
              style={{
                width:      '45%',
                height:     '100%',
                background: 'rgba(0,0,0,0.6)',
              }}
            >
              {/* Fixed header */}
              <div className="shrink-0 px-8 pt-8 pb-5 border-b border-white/5 text-left">
                <span className="text-[9px] font-black uppercase tracking-[0.28em] block mb-2 text-amber-400 font-sans">
                  Resolution Filed
                </span>
                <h2 className="text-[1.55rem] font-black text-white uppercase leading-tight tracking-wide" style={{ fontFamily: '"Josefin Sans", sans-serif' }}>
                  Event Resolved 🌟
                </h2>
                <div className="h-[2.5px] mt-3 rounded-full w-20 bg-gradient-to-r from-amber-400 to-transparent" />
              </div>

              {/* Scrollable body */}
              <div className="flex-1 overflow-y-auto px-8 py-6 space-y-5 text-left custom-scrollbar" style={{ scrollbarWidth: 'thin' }}>
                
                {/* 1. Player's Response Choice */}
                <div className="p-4 rounded-2xl border border-white/10 bg-white/5 space-y-1.5 font-sans">
                  <span className="text-[9.5px] font-black uppercase tracking-[0.2em] text-neutral-400 block" style={{ fontFamily: '"Josefin Sans", sans-serif' }}>
                    Your Stance &amp; Choice
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-xl shrink-0 select-none">{activeResolution.choice.icon}</span>
                    <span className="text-[12.5px] font-semibold text-white leading-snug">{activeResolution.choice.label}</span>
                  </div>
                </div>

                {/* 2. Narrative Outcome Card */}
                <div className="p-5 rounded-2xl border border-emerald-500/20 bg-emerald-950/15 space-y-2 font-sans">
                  <span className="text-[9.5px] font-black uppercase tracking-[0.2em] text-emerald-400 block" style={{ fontFamily: '"Josefin Sans", sans-serif' }}>
                    Resolution Narrative
                  </span>
                  <p className="text-[13px] text-white/90 leading-[1.85] whitespace-pre-line">
                    {activeResolution.choice.result}
                  </p>
                </div>

                {/* 3. Rewards / Effects Summary Card */}
                <div className="p-4 rounded-2xl border border-white/5 bg-black/35 space-y-3 font-sans">
                  <span className="text-[9.5px] font-black uppercase tracking-[0.2em] text-neutral-400 block" style={{ fontFamily: '"Josefin Sans", sans-serif' }}>
                    Transaction Ledger &amp; Standing Change
                  </span>
                  
                  <div className="flex flex-wrap gap-2 pt-1 font-sans">
                    {activeResolution.choice.coinCost && (
                      <span className="text-[10px] font-black px-2.5 py-1 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400">
                        🪙 -{activeResolution.choice.coinCost} Coins
                      </span>
                    )}
                    {activeResolution.choice.coinGain && (
                      <span className="text-[10px] font-black px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                        🪙 +{activeResolution.choice.coinGain} Coins
                      </span>
                    )}
                    {activeResolution.choice.xpGain && (
                      <span className="text-[10px] font-black px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                        ⚡ +{activeResolution.choice.xpGain} {activeResolution.choice.xpCategory?.toUpperCase() || 'XP'}
                      </span>
                    )}
                    {activeResolution.choice.legacyGain && (
                      <span className="text-[10px] font-black px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
                        🎖️ +{activeResolution.choice.legacyGain} Legacy
                      </span>
                    )}
                    {!activeResolution.choice.coinCost &&
                     !activeResolution.choice.coinGain &&
                     !activeResolution.choice.xpGain   &&
                     !activeResolution.choice.legacyGain && (
                      <span className="text-[11px] text-white/40 italic font-mono">No standing changes.</span>
                    )}
                  </div>
                </div>

                <p className="text-xs text-white/40 italic mt-6 block text-center font-sans">
                  "Your choice has been permanently stamped in the county chronicles."
                </p>

              </div>

              {/* Pinned footer action */}
              <div className="shrink-0 p-8 border-t border-white/5">
                <button
                  onClick={() => {
                    setActiveResolution(null);
                    setActiveEventResult(null);
                  }}
                  className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-brand font-black uppercase text-xs tracking-wider rounded-xl hover:brightness-110 active:scale-95 transition-all shadow-md shadow-amber-500/10"
                  style={{ fontFamily: '"Josefin Sans", sans-serif' }}
                >
                  Acknowledge Resolution 📜
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Global Standalone Roadmap Modal Overlay */}
      {showRoadmapModal && !activeResolution && !activeTimedEvent && !showHelpModal && (
        <JourneyPopup
          isOpen={showRoadmapModal}
          onClose={() => {
            setShowRoadmapModal(false);
            setRoadmapNPCData(null);
          }}
          playerName={roadmapNPCData?.name}
          playerRoleId={roadmapNPCData?.roleId}
          playerMilestones={roadmapNPCData?.milestones}
          isNPC={roadmapNPCData?.isNPC}
        />
      )}

      {/* Unified Resident Journal Modal Overlay */}
      {(showTownTour || showTownGuide) && (
        <TownTourTracker defaultTab={showTownGuide ? 'guide' : 'today'} />
      )}

      {/* Standalone Daily Chores Modal Overlay */}
      {showDailyChores && (
        <DailyChoresModal />
      )}

      {/* Simulation Engine Live Alerts */}
      {simulationAlert && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-neutral-900/95 border-2 border-amber-500/40 rounded-[2rem] p-6 max-w-md w-full text-left space-y-4 shadow-[0_20px_50px_rgba(245,158,11,0.25)] relative text-white border-t-8 border-t-amber-500">
            
            {/* Header / Badge */}
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-400 font-sans">
                ⚙️ World Simulation Engine
              </span>
              <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md animate-pulse ${
                simulationAlert.type === 'starting' ? 'bg-red-500 text-white' : 'bg-yellow-500 text-black'
              }`}>
                {simulationAlert.type === 'starting' ? 'ACTIVE NOW 🌟' : 'Upcoming (10 mins) ⏳'}
              </span>
            </div>

            {/* Event Title */}
            <div>
              <h2 className="text-xl font-brand text-white uppercase tracking-wide leading-tight" style={{ fontFamily: '"Luckiest Guy", cursive' }}>
                {simulationAlert.title}
              </h2>
              <span className="text-[10.5px] font-mono text-amber-300 font-bold block mt-1">
                ⏱️ Scheduled Time: {simulationAlert.time}
              </span>
            </div>

            {/* Main Details */}
            <div className="p-4 bg-white/5 border border-white/5 rounded-2xl text-xs text-neutral-300 leading-relaxed font-sans">
              {simulationAlert.description}
            </div>

            {/* Active Effect Card */}
            <div className="p-3.5 bg-amber-950/20 border border-amber-500/25 rounded-2xl text-xs font-sans">
              <span className="text-[9px] font-black text-amber-400 uppercase tracking-widest block mb-0.5">Active Simulation Effect</span>
              <p className="text-amber-100 font-medium">{simulationAlert.effect}</p>
            </div>

            {/* Footer action buttons */}
            <div className="flex gap-2.5 pt-1">
              <button
                onClick={() => handleParticipateInSimulation(simulationAlert)}
                className="flex-1 py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-brand font-black uppercase text-[10px] tracking-wider rounded-xl transition duration-150 shadow-md hover:scale-102 active:scale-98 cursor-pointer text-center"
                style={{ fontFamily: '"Josefin Sans", sans-serif' }}
              >
                Participate in Event 🚀
              </button>
              <button
                onClick={() => setSimulationAlert(null)}
                className="px-4 py-2.5 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-brand font-black uppercase text-[10px] rounded-xl transition duration-150 active:scale-98 cursor-pointer text-center"
                style={{ fontFamily: '"Josefin Sans", sans-serif' }}
              >
                Not Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
