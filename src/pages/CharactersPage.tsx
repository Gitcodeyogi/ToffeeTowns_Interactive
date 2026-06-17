import React, { useState } from 'react';
import { useTTStore } from '../store/useTTStore';

const FONT = '"Luckiest Guy", cursive';

interface Character {
  name: string;
  role: string;
  avatar: string;
  town: string;
  description: string;
  dialogue: string;
}

const CHARACTERS: Character[] = [
  {
    name: 'Mayor Pompelmoose',
    role: 'Town Mayor',
    avatar: '🏛',
    town: 'Toffee Town',
    description: 'A pompous mayor who thinks giant gold-plated cutlery will define the city\'s future.',
    dialogue: '"We must make this town look prestigious, even if it costs half the public budget!"',
  },
  {
    name: 'Chucklebop',
    role: 'Prankster Leader',
    avatar: '🤪',
    town: 'Peanut Butter Falls',
    description: 'A mischievous explorer who races rafts with pressurized mint-cream canisters.',
    dialogue: '"The Rapids Safety Commission has no sense of adventure! Mint-cream is clean fuel!"',
  },
  {
    name: 'Olive Pine',
    role: 'Rebel Ranger',
    avatar: '🏹',
    town: 'Ganache Grove',
    description: 'Leader of the forest rangers who actively protests curfews on night foraging.',
    dialogue: '"Curfew rules do not apply if we are already inside the canopy clears. Join the gathering!"',
  },
  {
    name: 'Dr. Fudge',
    role: 'Town Doctor',
    avatar: '💊',
    town: 'Peppermint Peaks',
    description: 'Treats Volcanic Chocolate Fever with cooling mint compresses and salamander mucus.',
    dialogue: '"Fever is a character-building experience! Just apply moss twice a day."',
  },
  {
    name: 'Milo Spark',
    role: 'Forest Scientist',
    avatar: '🔬',
    town: 'Ganache Grove',
    description: 'Researches acoustic frequencies from glowing mushrooms using custom gear boxes.',
    dialogue: '"The mushrooms are vibrating at exactly 40Hz. It matches the rhythm of elder jazz oral histories!"',
  },
  {
    name: 'Pipkin Nutterby',
    role: 'Official Prankster & Resident Troublemaker',
    avatar: '🐿️',
    town: 'Ganache Grove',
    description: 'A 12-year-old bundle of endless curiosity and wild ideas with messy dark brown hair and a signature wild front tuft. Dressed in a moss-green cap, cream shirt, brown suspenders, and striped socks, he wanders the root walkways with a wooden slingshot, rolled newspaper, and a small satchel of mysterious treasures. Always wearing an oversized grin and expressive eyebrows, Pipkin makes everyone smile immediately, turning ordinary mornings into unforgettable adventures.',
    dialogue: '"I have a brilliant idea! It involves three pinecones, a rolled newspaper, and absolutely zero adult supervision!"',
  },
];

const CharactersPage: React.FC = () => {
  const { setPage } = useTTStore();
  const [selectedIdx, setSelectedIdx] = useState(0);

  const char = CHARACTERS[selectedIdx];

  return (
    <div className="h-full w-full flex items-center justify-center p-6 select-none">
      <div className="w-[92vw] h-[92vh] max-h-[92vh] rounded-[2.5rem] border border-white/15 bg-black/60 p-6 flex flex-col justify-between overflow-hidden shadow-2xl relative">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 shrink-0">
          <button
            onClick={() => setPage('desk')}
            className="px-4 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 rounded-full text-xs font-brand uppercase tracking-wider transition duration-200"
            style={{ fontFamily: '"Josefin Sans", sans-serif' }}
          >
            🏠 Back to Desk
          </button>
          <h2 className="text-xl md:text-2xl font-brand text-amber-400 uppercase tracking-wider" style={{ fontFamily: FONT }}>
            👥 Citizens of ChocoBrook
          </h2>
          <div className="w-[100px]" /> {/* Spacer */}
        </div>

        {/* Content Panel */}
        <div className="flex-1 my-6 flex flex-row gap-6 overflow-hidden min-h-0 max-w-5xl w-full mx-auto">
          
          {/* LEFT: Character List (40%) */}
          <div className="w-[40%] shrink-0 h-full border border-white/10 bg-black/25 rounded-3xl p-6 flex flex-col justify-start overflow-hidden">
            <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-cyan-400 mb-3 shrink-0">
              Select Character
            </h3>
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 space-y-2">
              {CHARACTERS.map((c, i) => (
                <div
                  key={c.name}
                  onClick={() => setSelectedIdx(i)}
                  className={`p-3 rounded-2xl border transition duration-200 cursor-pointer flex items-center gap-3
                    ${i === selectedIdx 
                      ? 'bg-amber-500/10 border-amber-500/40 shadow-glow' 
                      : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                >
                  <span className="text-2xl">{c.avatar}</span>
                  <div>
                    <h4 className="font-bold text-white text-xs">{c.name}</h4>
                    <p className="text-[10px] text-white/50 mt-0.5">{c.role} • {c.town}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: Detail View (60%) */}
          <div className="w-[60%] shrink-0 h-full rounded-3xl border border-white/10 bg-black/30 flex flex-col justify-between p-6">
            
            {/* Header info */}
            <div className="space-y-4">
              <div className="flex items-center gap-4 border-b border-white/10 pb-4">
                <span className="text-5xl p-4 bg-white/5 border border-white/10 rounded-2xl">{char.avatar}</span>
                <div>
                  <h3 className="text-xl font-brand text-yellow-300 uppercase leading-none" style={{ fontFamily: FONT }}>
                    {char.name}
                  </h3>
                  <p className="text-xs text-white/50 mt-2 font-semibold font-sans uppercase tracking-wider">{char.role}</p>
                  <p className="text-xs text-cyan-400 mt-1 font-semibold font-sans">{char.town}</p>
                </div>
              </div>

              <div>
                <h4 className="text-[10px] font-black uppercase tracking-[0.25em] text-pink-400 mb-1">Description</h4>
                <p className="text-white/80 text-sm leading-relaxed font-body">{char.description}</p>
              </div>
            </div>

            {/* Quote Dialogue box */}
            <div className="bg-amber-500/5 border border-amber-500/20 p-5 rounded-2xl mt-4">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-400">Direct Quote</span>
              <p className="text-sm text-neutral-300 italic font-body mt-2 leading-relaxed">
                {char.dialogue}
              </p>
            </div>

          </div>

        </div>

        {/* Footer */}
        <div className="p-3 border-t border-white/10 flex items-center justify-center text-xs text-white/40 shrink-0">
          Earn reputations and complete local missions to unlock more storylines with town citizens.
        </div>

      </div>
    </div>
  );
};

export default CharactersPage;
