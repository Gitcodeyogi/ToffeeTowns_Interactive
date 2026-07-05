import React, { useState, useEffect } from 'react';
import { useTTStore } from '../store/useTTStore';
import { TownTalkModal } from '../components/TownTalkModal';
import { cozyAudio } from '../utils/audioHelper';
import { FONT } from '../lib/uiConstants';
import { MiniGameRouter } from '../components/minigames/MiniGameRouter';

interface WelcomeBubble {
  id: string;
  name: string;
  role: string;
  avatar: string;
  speech: string;
  colorClass: string;
  borderClass: string;
  glowClass: string;
}

const TownTalkEntrancePage: React.FC = () => {
  const { setPage, setShowTownTour } = useTTStore();
  const [activeChatChar, setActiveChatChar] = useState<string | null>(null);
  const [activeMiniGame, setActiveMiniGame] = useState<boolean>(false);

  const [inventory, setInventory] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem('tt_inventory');
      return saved ? JSON.parse(saved) : { wood: 2, bolts: 1, moss: 1, mucus: 0, parchment: 1, ink: 0 };
    } catch {
      return { wood: 2, bolts: 1, moss: 1, mucus: 0, parchment: 1, ink: 0 };
    }
  });

  useEffect(() => {
    localStorage.setItem('tt_inventory', JSON.stringify(inventory));
  }, [inventory]);

  const welcomeBubbles: WelcomeBubble[] = [
    {
      id: 'goldwhistle',
      name: 'Sir Goldwhistle',
      role: 'Tax Auditor',
      avatar: '/Characters/Char Cards/Nico_Whistle.png',
      speech: 'Identify yourself! Ensure your ledger is prepared for audits. Speak to me enroute to Ganache Grove.',
      colorClass: 'text-amber-300',
      borderClass: 'border-amber-500/20 hover:border-amber-400/50',
      glowClass: 'hover:shadow-[0_0_20px_rgba(245,158,11,0.15)]'
    },
    {
      id: 'cedric',
      name: 'Dr. Cedric Oakenhart',
      role: 'Town Physician',
      avatar: '/Characters/Char Cards/Dr_Cedric.png',
      speech: 'Yogesh, I have a fresh peppermint infusion ready at the clinic. Let’s discuss county health standing before you head in.',
      colorClass: 'text-emerald-300',
      borderClass: 'border-emerald-500/20 hover:border-emerald-400/50',
      glowClass: 'hover:shadow-[0_0_20px_rgba(16,185,129,0.15)]'
    },
    {
      id: 'rowan',
      name: 'Rowan Thistle',
      role: 'Apprentice Builder',
      avatar: '/Characters/Char Cards/Rowan_Thistle.png',
      speech: 'The gear ratios at the flour mill are slipping. Let’s talk logical upgrades when you have a moment, colleague.',
      colorClass: 'text-orange-350',
      borderClass: 'border-orange-500/20 hover:border-orange-400/50',
      glowClass: 'hover:shadow-[0_0_20px_rgba(249,115,22,0.15)]'
    },
    {
      id: 'julie',
      name: 'Julie Frost',
      role: 'Gazette Editor',
      avatar: '/Characters/Char Cards/Julie_Frost.png',
      speech: 'Got any hot gossip from the town center? I’m drafting the next morning edition of the Ganache Gazette!',
      colorClass: 'text-pink-300',
      borderClass: 'border-pink-500/20 hover:border-pink-400/50',
      glowClass: 'hover:shadow-[0_0_20px_rgba(236,72,153,0.15)]'
    }
  ];

  const handleBubbleClick = (charId: string) => {
    cozyAudio.playClick();
    setActiveChatChar(charId);
  };

  // Renders header text with letter-by-letter staggered jumping wave
  const renderAnimatedLetters = (text: string) => {
    return text.split('').map((char, idx) => (
      <span
        key={idx}
        className="inline-block animate-letter-jump hover:text-yellow-250 transition-colors duration-200 cursor-default"
        style={{ animationDelay: `${idx * 0.04}s` }}
      >
        {char === ' ' ? '\u00A0' : char}
      </span>
    ));
  };

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center p-0 overflow-hidden select-none bg-transparent relative">
      
      {/* ── MAIN ENROUTE GLASS CARD ── */}
      <div 
        className="w-[82vw] h-[82vh] rounded-[2.2rem] border-2 border-white/15 bg-black/60 shadow-[inset_0_1px_2px_rgba(255,255,255,0.15),_0_50px_140px_rgba(0,0,0,0.85)] flex flex-col justify-between overflow-hidden relative z-10 text-white"
        style={{ animation: 'ttSpringPop 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) both' }}
      >
        {/* Top decorative glow line */}
        <div className="absolute top-0 inset-x-0 h-[2.5px] bg-gradient-to-r from-transparent via-amber-400/60 to-transparent pointer-events-none z-20" />

        {/* ── HEADER AREA ── */}
        <div className="w-full shrink-0 relative z-10 overflow-hidden border-b border-white/10"
          style={{ background: 'linear-gradient(90deg, rgba(30,18,4,0.7) 0%, rgba(40,24,6,0.6) 50%, rgba(30,18,4,0.7) 100%)' }}
        >
          <div className="relative flex items-center justify-between px-8 py-5 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl md:text-2xl font-brand text-amber-300 uppercase tracking-[0.18em] leading-none flex items-center"
                  style={{ fontFamily: FONT, textShadow: '0 0 20px rgba(251,191,36,0.4)' }}
                >
                  {renderAnimatedLetters("Enroute to Ganache Grove")}
                </h1>
                <span className="px-2 py-0.5 bg-amber-400/15 border border-amber-400/30 text-amber-300 text-[8px] font-black uppercase tracking-widest rounded-full animate-pulse">Briefing</span>
              </div>
              <p className="text-[11px] text-amber-100/60 font-sans mt-1.5 leading-snug">
                Review your daily journal agenda or tap a welcoming resident's speech bubble to chat one-on-one.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  cozyAudio.playClick();
                  setShowTownTour(true);
                }}
                className="px-4 py-2 bg-rose-500/10 border border-rose-500/35 hover:bg-rose-500/25 hover:border-rose-400/60 text-rose-350 text-xs font-black uppercase tracking-wider rounded-xl transition duration-200 cursor-pointer shadow-lg flex items-center gap-1.5 hover-sway"
                style={{ fontFamily: '"Josefin Sans", sans-serif' }}
              >
                📖 Resident Journal
              </button>

              <button
                onClick={() => {
                  cozyAudio.playClick();
                  setPage('desk');
                }}
                className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 text-neutral-950 text-xs font-black uppercase tracking-wider rounded-xl transition duration-200 cursor-pointer shadow-lg flex items-center gap-1.5 hover-sway"
                style={{ fontFamily: '"Josefin Sans", sans-serif' }}
              >
                🚪 Enter Cottage - ✕
              </button>
            </div>
          </div>
        </div>

        {/* ── BUBBLES CONTAINER AREA ── */}
        <div className="flex-grow overflow-y-auto custom-scrollbar p-6 grid grid-cols-1 md:grid-cols-2 gap-5 items-center min-h-0 bg-transparent">
          {welcomeBubbles.map((bubble, index) => (
            <div
              key={bubble.id}
              onClick={() => handleBubbleClick(bubble.id)}
              className={`group flex items-start gap-4 p-4 rounded-3xl bg-neutral-950/45 border transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-1 hover:rotate-[0.5deg] cursor-pointer ${bubble.borderClass} ${bubble.glowClass}`}
              style={{ 
                animation: 'ttSpringPop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both',
                animationDelay: `${index * 0.1}s` 
              }}
            >
              {/* Resident Circular Avatar */}
              <div className="w-14 h-14 rounded-2xl overflow-hidden bg-stone-900 border border-white/10 shrink-0 shadow-md group-hover:border-amber-400/40 group-hover:scale-105 group-hover:rotate-[-3deg] transition duration-300">
                <img
                  src={bubble.avatar}
                  alt={bubble.name}
                  className="w-full h-full object-cover object-top scale-[1.1]"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = '/Assets/yogesh_character.png';
                  }}
                />
              </div>

              {/* Speech Bubble Box */}
              <div className="flex-grow min-w-0 flex flex-col relative text-left">
                <div className="flex items-center gap-2">
                  <span className={`text-[12px] font-black uppercase tracking-widest font-sans ${bubble.colorClass}`}>
                    {bubble.name}
                  </span>
                  <span className="text-[9px] text-white/40 bg-white/5 border border-white/5 px-2 py-0.5 rounded-full font-sans uppercase">
                    {bubble.role}
                  </span>
                </div>

                {/* Speech Bubble text */}
                <div className="mt-2 p-3 bg-white/5 border border-white/5 rounded-2xl text-[12px] text-neutral-200 leading-relaxed font-sans relative group-hover:bg-amber-950/10 group-hover:border-amber-400/25 transition duration-300">
                  {/* Decorative caret pointing to avatar */}
                  <div className="absolute left-[-6px] top-4 w-3 h-3 rotate-45 bg-neutral-900 border-l border-b border-white/5 group-hover:bg-amber-950/10 group-hover:border-amber-400/25 transition" />
                  "{bubble.speech}"
                  <span className="block text-[8.5px] text-amber-350/75 mt-1.5 font-bold uppercase tracking-wider group-hover:text-amber-300 transition flex items-center gap-1">
                    <span>💬</span> Click to Chat One-on-One
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── FOOTER AREA ── */}
        <div className="w-full py-3.5 px-8 border-t border-white/10 text-center shrink-0 flex items-center justify-between text-[10px] text-neutral-400 bg-black/40">
          <span className="font-sans italic">"Listen to the echoes of Ganache Grove before stoking the hearth."</span>
          <span className="font-mono text-amber-400/60 uppercase tracking-widest animate-pulse">Cozy Briefing Active</span>
        </div>
      </div>

      {/* ── ONE-ON-ONE CHAT MODAL OVERLAY ── */}
      {activeChatChar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 animate-fade-in">
          <TownTalkModal
            initialCharacterId={activeChatChar}
            onClose={() => {
              setActiveChatChar(null);
            }}
            inventory={inventory}
            setInventory={setInventory}
            size="large"
            startInChat={true}
            entranceMode={true}
            onStartHerbGame={() => {
              setActiveChatChar(null);
              setActiveMiniGame(true);
            }}
          />
        </div>
      )}

      {/* ── HERB DELIVERY MINI-GAME OVERLAY ── */}
      {activeMiniGame && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 animate-fade-in">
          <MiniGameRouter
            taskName="Herb Delivery to Oakenhart Clinic"
            skillCat="healer"
            dutyType="herb"
            frame="wooden"
            profession="healer"
            rewards={{
              coins: 30,
              xp: 40,
              legacy: 10,
              skill: 'healer',
            }}
            onSuccess={() => {
              cozyAudio.playSuccess();
              setActiveMiniGame(false);
              useTTStore.getState().addCoins(30, 'Completed Town Talk Mini-Game');
              useTTStore.getState().addLegacy(10);
              useTTStore.getState().addSkillXP('healer', 40);
            }}
            onFail={() => {
              setActiveMiniGame(false);
            }}
          />
        </div>
      )}

      <style>{`
        @keyframes ttSpringPop {
          0%   { opacity: 0; transform: scale(0.92) translateY(20px); }
          70%  { transform: scale(1.01) translateY(-2px); opacity: 0.9; }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes ttLetterJump {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-5px); }
        }
        .animate-letter-jump {
          animation: ttLetterJump 2.5s ease-in-out infinite;
        }
        @keyframes ttSway {
          0%, 100% { transform: rotate(0deg); }
          25%      { transform: rotate(-2deg) scale(1.02); }
          75%      { transform: rotate(2deg) scale(1.02); }
        }
        .hover-sway:hover {
          animation: ttSway 1.2s ease-in-out infinite;
        }
        .animate-fade-in {
          animation: ttFadeIn 0.3s ease-out forwards;
        }
        @keyframes ttFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default TownTalkEntrancePage;
