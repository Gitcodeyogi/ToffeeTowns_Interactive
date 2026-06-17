import React from 'react';
import { GG_TravellerDeck_Header } from './GG_TravellerDeck_Header';
import { FONT, type SubPage } from '../../pages/TravellersDesk';

interface GG_TravellerDeck_DashboardProps {
  setSubPage: (page: SubPage) => void;
  pushPage: (page: SubPage) => void;
  popPage: () => void;
}

export const GG_TravellerDeck_Dashboard: React.FC<GG_TravellerDeck_DashboardProps> = ({
  setSubPage,
  pushPage,
  popPage,
}) => {
  return (
    <div className="w-full h-full flex flex-col justify-between">
      <GG_TravellerDeck_Header
        title="TRAVELLER DASHBOARD"
        setSubPage={setSubPage}
        popPage={popPage}
      />

      {/* Hub Places Grid */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-5 my-4 min-h-0 overflow-y-auto custom-scrollbar">
        
        {/* Places Board Card */}
        <div 
          onClick={() => pushPage('places')}
          className="flex flex-col justify-between bg-black/40 border border-white/10 rounded-[2rem] p-5 hover:border-emerald-400 hover:scale-[1.02] transition duration-300 cursor-pointer group shadow-lg"
        >
          <div>
            <div className="aspect-[4/3] w-full rounded-2xl overflow-hidden border border-white/5 bg-neutral-900 relative">
              <img src="/towns/hometown_lvl1.png" alt="Places & Daily Loop" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
            </div>
            <h3 className="text-base font-brand text-white uppercase mt-4" style={{ fontFamily: FONT }}>
              📍 Places & Loop
            </h3>
            <p className="text-[11px] text-neutral-300 mt-2 leading-relaxed">
              Explore landmarks, complete daily loop phases, and travel routes.
            </p>
          </div>
          <button 
            className="w-full mt-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-[10px] font-brand uppercase tracking-wider transition"
            style={{ fontFamily: '"Josefin Sans", sans-serif' }}
          >
            Explore Town
          </button>
        </div>

        {/* Resident Journal Card */}
        <div 
          onClick={() => pushPage('journal')}
          className="flex flex-col justify-between bg-black/40 border border-white/10 rounded-[2rem] p-5 hover:border-purple-400 hover:scale-[1.02] transition duration-300 cursor-pointer group shadow-lg"
        >
          <div>
            <div className="aspect-[4/3] w-full rounded-2xl overflow-hidden border border-white/5 bg-neutral-900 relative">
              <img src="/towns/macaron-mews.png" alt="Resident Journal" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
            </div>
            <h3 className="text-base font-brand text-white uppercase mt-4" style={{ fontFamily: FONT }}>
              📓 Daily Journal
            </h3>
            <p className="text-[11px] text-neutral-300 mt-2 leading-relaxed">
              Scroll through your residency history, achievements, and events.
            </p>
          </div>
          <button 
            className="w-full mt-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-[10px] font-brand uppercase tracking-wider transition"
            style={{ fontFamily: '"Josefin Sans", sans-serif' }}
          >
            Read Journal
          </button>
        </div>

        {/* Workshop Card */}
        <div 
          onClick={() => pushPage('workshop')}
          className="flex flex-col justify-between bg-black/40 border border-white/10 rounded-[2rem] p-5 hover:border-yellow-400 hover:scale-[1.02] transition duration-300 cursor-pointer group shadow-lg"
        >
          <div>
            <div className="aspect-[4/3] w-full rounded-2xl overflow-hidden border border-white/5 bg-neutral-900 relative">
              <img src="/towns/Nougat-Node.png" alt="Workshop" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
            </div>
            <h3 className="text-base font-brand text-white uppercase mt-4" style={{ fontFamily: FONT }}>
              🔧 Workshop
            </h3>
            <p className="text-[11px] text-neutral-300 mt-2 leading-relaxed">
              Buy materials, tools, and construct structural repairs for the district.
            </p>
          </div>
          <button 
            className="w-full mt-4 py-2 bg-yellow-600 hover:bg-yellow-500 text-white rounded-xl text-[10px] font-brand uppercase tracking-wider transition"
            style={{ fontFamily: '"Josefin Sans", sans-serif' }}
          >
            Enter Workshop
          </button>
        </div>

        {/* Classroom Card */}
        <div 
          onClick={() => pushPage('classroom')}
          className="flex flex-col justify-between bg-black/40 border border-white/10 rounded-[2rem] p-5 hover:border-cyan-400 hover:scale-[1.02] transition duration-300 cursor-pointer group shadow-lg"
        >
          <div>
            <div className="aspect-[4/3] w-full rounded-2xl overflow-hidden border border-white/5 bg-neutral-900 relative">
              <img src="/towns/eclair-square.png" alt="Classroom" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
            </div>
            <h3 className="text-base font-brand text-white uppercase mt-4" style={{ fontFamily: FONT }}>
              🎓 Classroom
            </h3>
            <p className="text-[11px] text-neutral-300 mt-2 leading-relaxed">
              Upgrade your skillset and attend professional seminars.
            </p>
          </div>
          <button 
            className="w-full mt-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-[10px] font-brand uppercase tracking-wider transition"
            style={{ fontFamily: '"Josefin Sans", sans-serif' }}
          >
            Attend Academy
          </button>
        </div>

        {/* Missions Board Card */}
        <div 
          onClick={() => pushPage('missions')}
          className="flex flex-col justify-between bg-black/40 border border-white/10 rounded-[2rem] p-5 hover:border-pink-400 hover:scale-[1.02] transition duration-300 cursor-pointer group shadow-lg"
        >
          <div>
            <div className="aspect-[4/3] w-full rounded-2xl overflow-hidden border border-white/5 bg-neutral-900 relative">
              <img src="/towns/Toffee-town.png" alt="Missions" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
            </div>
            <h3 className="text-base font-brand text-white uppercase mt-4" style={{ fontFamily: FONT }}>
              🏆 Missions Board
            </h3>
            <p className="text-[11px] text-neutral-300 mt-2 leading-relaxed">
              Plan county operations, embark on quests, and collect badges.
            </p>
          </div>
          <button 
            className="w-full mt-4 py-2 bg-pink-600 hover:bg-pink-500 text-white rounded-xl text-[10px] font-brand uppercase tracking-wider transition"
            style={{ fontFamily: '"Josefin Sans", sans-serif' }}
          >
            View Missions
          </button>
        </div>

        {/* NewsPaper Card */}
        <div 
          onClick={() => pushPage('newspaper')}
          className="flex flex-col justify-between bg-black/40 border border-white/10 rounded-[2rem] p-5 hover:border-amber-400 hover:scale-[1.02] transition duration-300 cursor-pointer group shadow-lg"
        >
          <div>
            <div className="aspect-[4/3] w-full rounded-2xl overflow-hidden border border-white/5 bg-neutral-900 relative">
              <img src="/towns/macaron-mews.png" alt="NewsPaper" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
            </div>
            <h3 className="text-base font-brand text-white uppercase mt-4" style={{ fontFamily: FONT }}>
              📜 NewsPaper Page
            </h3>
            <p className="text-[11px] text-neutral-300 mt-2 leading-relaxed">
              Read daily dossiers, vote on affairs, and participate in all sectors.
            </p>
          </div>
          <button 
            className="w-full mt-4 py-2 bg-amber-600 hover:bg-amber-400 text-black font-extrabold rounded-xl text-[10px] font-brand uppercase tracking-wider transition"
            style={{ fontFamily: '"Josefin Sans", sans-serif' }}
          >
            Read NewsPaper
          </button>
        </div>

      </div>

      <div className="p-3 border-t border-white/10 flex items-center justify-center text-xs text-white/40 shrink-0">
        Select an area of the town to take action, train, or buy items.
      </div>
    </div>
  );
};
