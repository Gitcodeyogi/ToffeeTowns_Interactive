import React, { useEffect, useState } from 'react';
import { useTTStore } from './store/useTTStore';
import type { AppPage } from './store/useTTStore';

// Pages
import WelcomeShow    from './pages/WelcomeShow';
import ChooseTown     from './pages/ChooseTown';
import TravellersDesk from './pages/TravellersDesk';
import LeaderboardPage from './pages/LeaderboardPage';
import CoinsPage       from './pages/CoinsPage';
import CharactersPage  from './pages/CharactersPage';
import BadgesPage      from './pages/BadgesPage';
import CocoaChatPage   from './pages/CocoaChatPage';
import NavBar          from './components/NavBar';
import BgCanvas        from './components/BgCanvas';
import LoginPage       from './components/LoginPage';
import LoadingSpinner   from './components/LoadingSpinner';

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
  '/wallpapers/RiceTerraces.png',
  '/wallpapers/SereneCountry.png',
  '/wallpapers/DewyRainbow.png',
  '/wallpapers/SwissWall_1.png',
  '/wallpapers/MoonlitWinter.png',
  '/wallpapers/CandyTaxi.png',
  '/wallpapers/GoldenSun.png',
  '/wallpapers/LakeView.png',
  '/wallpapers/GreenHorizon.png',
  '/wallpapers/Alpine_1.png',
  '/wallpapers/OceanView.png',
  '/wallpapers/SereneSunset.png',
  '/wallpapers/TwilightMoments.png',
  '/wallpapers/WhiteDandoleon.png',
  '/wallpapers/colorfulLeaves.png',
  '/wallpapers/tropicalrain.png'
];

const App: React.FC = () => {
  const {
    currentPage,
    setPage,
    welcomeDone,
    user,
    authLoading,
    initAuth,
    logout,
    headerHidden
  } = useTTStore();

  const [bgUrl, setBgUrl] = useState(() => {
    const initialIndex = Math.floor(Math.random() * LOVELY_WALLPAPERS.length);
    return LOVELY_WALLPAPERS[initialIndex] || FALLBACK_BG;
  });

  // Initialize Auth
  useEffect(() => {
    initAuth();
    // Force sign-out on initial load so the Login screen displays
    logout();
  }, [initAuth, logout]);

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
          console.log("Wallpaper rotated to:", nextBg);
        };
        img.src = nextBg;
        return nextBg;
      });
    }, 15 * 60 * 1000); // 15 minutes

    return () => clearInterval(interval);
  }, []);

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

  const showNav = welcomeDone && currentPage !== 'welcome' && currentPage !== 'choose-town';

  return (
    <div className="relative w-full h-screen overflow-hidden flex flex-col">

      {/* ── Global animated background ── */}
      <BgCanvas bgUrl={bgUrl} />

      {/* ── Top Nav (shown after onboarding) ── */}
      {showNav && (
        <NavBar
          currentPage={currentPage}
          onNav={(page) => setPage(page as AppPage)}
          homeTown={useTTStore.getState().homeTown}
          hidden={headerHidden}
        />
      )}

      {/* ── Page Content ── */}
      <div className={`relative z-10 flex-1 overflow-hidden ${showNav ? '' : 'h-full'}`}>
        {currentPage === 'welcome'      && <WelcomeShow />}
        {currentPage === 'choose-town' && <ChooseTown />}
        {currentPage === 'desk'         && <TravellersDesk />}
        {currentPage === 'leaderboard'  && <LeaderboardPage />}
        {currentPage === 'coins'        && <CoinsPage />}
        {currentPage === 'characters'   && <CharactersPage />}
        {currentPage === 'badges'       && <BadgesPage />}
        {currentPage === 'cocoa-chat'   && <CocoaChatPage />}
      </div>

      {/* Global resting unhide star when website header is hidden */}
      {headerHidden && (
        <button
          onClick={() => useTTStore.getState().setHeaderHidden(false)}
          className="fixed top-4 right-4 z-[240] w-8 h-8 rounded-full border border-amber-500/30 bg-[#111116]/95 flex items-center justify-center cursor-pointer shadow-[0_2px_10px_rgba(245,158,11,0.25)] hover:scale-110 active:scale-95 transition-all duration-300 text-sm hover:border-amber-400"
          title="Show Header"
        >
          ⭐
        </button>
      )}
    </div>
  );
};

export default App;
