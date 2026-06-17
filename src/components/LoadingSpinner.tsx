import React, { forwardRef, useState, useEffect } from 'react';

interface LoadingSpinnerProps {
  message?: string;
}

const TOFFEE_TALK_MESSAGES = [
  "Toffee Townfolks says: Did you know Toffee Towns is built on pure imagination?",
  "Toffee Townfolks says: Don't forget to check the Leaderboard for top scores!",
  "Toffee Townfolks says: Explore the Traveller's Desk for daily adventure Chronicles!",
  "Toffee Townfolks says: Every badge you earn unlocks a new secret...",
  "Toffee Townfolks says: Mayor Pompelmoose's giant golden spoon is already 12 feet tall!",
  "Toffee Townfolks says: Chucklebop's rocket raft is safety commission approved (unofficially)!",
  "Toffee Townfolks says: Pippa Bolt's pre-flight checklists are entirely optional...",
  "Toffee Townfolks says: Level up your builder, explorer, or healer tracks to unlock quests!"
];

const LoadingSpinner = forwardRef<HTMLDivElement, LoadingSpinnerProps>(({ message = "Loading..." }, ref) => {
  const [talkMessage, setTalkMessage] = useState(TOFFEE_TALK_MESSAGES[0]);

  useEffect(() => {
    const randomMsg = TOFFEE_TALK_MESSAGES[Math.floor(Math.random() * TOFFEE_TALK_MESSAGES.length)];
    setTalkMessage(randomMsg);

    const interval = setInterval(() => {
      const nextMsg = TOFFEE_TALK_MESSAGES[Math.floor(Math.random() * TOFFEE_TALK_MESSAGES.length)];
      setTalkMessage(nextMsg);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      ref={ref}
      className="fixed inset-0 flex flex-col items-center justify-center space-y-12 text-center z-[99999] bg-black/95 animate-fade-in"
      style={{ backdropFilter: 'none', WebkitBackdropFilter: 'none' }}
    >
      {/* PREMIUM CINEMATIC SPINNER - As loved by the user */}
      <div className="relative h-28 w-28 md:h-32 md:w-32">
        {/* Outer orbital - Clockwise */}
        <div className="absolute inset-0 rounded-full border-t-2 border-r-2 border-yellow-400 animate-spin shadow-[0_0_15px_rgba(250,204,21,0.5)]" style={{ animationDuration: '1.2s' }} />
        
        {/* Middle orbital - Counter-Clockwise */}
        <div className="absolute inset-3 rounded-full border-b-2 border-l-2 border-orange-500 animate-spin-reverse shadow-[0_0_15px_rgba(249,115,22,0.5)]" style={{ animationDuration: '0.8s' }} />
        
        {/* Inner core - Pulse */}
        <div className="absolute inset-8 rounded-full border-white/20 border-l-2 animate-pulse flex items-center justify-center bg-white/5" />
        
        {/* Global Glow */}
        <div className="absolute inset-0 rounded-full bg-yellow-500/5 blur-[40px] animate-pulse" />
      </div>

      <div className="flex flex-col items-center gap-4 px-6 max-w-xl">
        <h2 className="text-[12px] font-black uppercase tracking-[0.8em] text-white/40 animate-pulse">
            {message}
        </h2>

        {/* Toffee Sparrow Talk */}
        <div className="mt-4 px-8 py-4 rounded-2xl bg-white/5 border border-white/10 shadow-xl relative overflow-hidden group hover:bg-white/10 transition-all duration-500">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-yellow-400/30 to-transparent" />
            <p className="text-sm md:text-md text-yellow-500/80 italic font-medium font-brand tracking-wide">
                "{talkMessage}"
            </p>
        </div>
      </div>

      <style>{`
        @keyframes spin-reverse {
            from { transform: rotate(0deg); }
            to { transform: rotate(-360deg); }
        }
        .animate-spin-reverse {
            animation: spin-reverse 1s linear infinite;
        }
      `}</style>
    </div>
  );
});

export default React.memo(LoadingSpinner);
