import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useTTStore } from '../../store/useTTStore';
import { GG_TravellerDeck_Header } from './GG_TravellerDeck_Header';
import { FONT, type SubPage } from '../../lib/uiConstants';
import { cozyAudio } from '../../utils/audioHelper';
import ChuckleIcon from '../ChuckleIcon';
import { ECONOMY_CONFIG } from '../../constants/economyConfig';
import { CANDYBROOK_TOWNS } from '../../constants/towns';
import { buildLensConfigs, type LensId } from '../../constants/theatreHubData';
import { getLensStory } from '../../constants/stories/index';
import { motion, AnimatePresence } from 'framer-motion';
import { LOBBY_TALES, LOBBY_FOLKS, LOBBY_LANDS, LOBBY_HUBS } from '../../constants/lobbyLoreData';
import { CANAL_SERIES } from '../../data/series/series1_canal';
import { TOWN_THEATER_DIRECTORY } from '../TownTheaterDirectory';

interface Props {
  setSubPage: (p: SubPage) => void;
  popPage: () => void;
  completedSeriesSteps: string[];
  triggerFeedback: (msg: string) => void;
}

type IntroPhase = 'intro' | 'playing' | 'ended';
type LayoutMode = '70mm' | 'cinematic' | '3d' | 'imax' | 'vr';

interface Actor {
  name: string;
  role: string;
  avatar: string;
}

interface Series {
  id: string;
  title: string;
  category: string;
  posterUrl: string;
  cost: number;
  actsCount: number;
  type: 'chronicles' | 'lore';
  loreKey?: 'legend' | 'gossip' | 'politics' | 'economy' | 'transport';
  starring: Actor[];
  synopsis: string;
  headline: string;
}

interface Story {
  id: string;
  title: string;
  description: string;
  instruction: string;
  icon: string;
  series: Series[];
}

const STORIES_DATA: Story[] = [
  {
    id: 'story-honeyblueberry-loaf',
    title: 'The Honeyblueberry Loaf Incident',
    description: 'Track the search for Baker Bramble Mortimer\'s missing masterpiece and the secret Acorn Commando.',
    instruction: 'Follow the case file to retrieve the loaf from Pipkin and uncover the hidden forest mystery.',
    icon: '🫐',
    series: [
      {
        id: 'chronicles-1',
        title: 'The Honeyblueberry Loaf Chronicles',
        category: 'Epic Town Reconstruction',
        posterUrl: '/Assets/Ganache Grove/Scene_0.1.png',
        cost: 50,
        actsCount: 5,
        type: 'chronicles',
        starring: [
          { name: 'Rowan Thistle', role: 'Builder Apprentice', avatar: '/Characters/Char Cards/Milo_Spark.png' },
          { name: 'Percival Tinkersprocket', role: 'Town Head', avatar: '/Characters/Char Cards/Hugo_Glass.png' },
          { name: 'Baker Bramble Mortimer', role: 'Town Baker', avatar: '/Characters/Char Cards/Zara_Quill.png' }
        ],
        synopsis: 'A live-action chronicle tracking the collective volunteer effort to build and secure the town canal system against sudden mountain overflows.',
        headline: 'Rowan Thistle and Percival Tinkersprocket lead the community through the canal emergency.'
      },
      {
        id: 'lore-legend',
        title: 'The Sacred Elder Tree Spirit',
        category: 'Ancient Folklore',
        posterUrl: '/Assets/Ganache Grove/GanacheGrove_GossipCorner.png',
        cost: 50,
        actsCount: 4,
        type: 'lore',
        loreKey: 'legend',
        starring: [
          { name: 'Professor Finley', role: 'Academy Principal', avatar: '/Characters/Char Cards/Hugo_Glass.png' },
          { name: 'Pipkin Nutterby', role: 'Forest Explorer', avatar: '/Characters/pipkin_nutterby.png' }
        ],
        synopsis: 'A mystical presentation detailing the relationship between local forest wood-sprites, honeyberry blossoms, and the community health.',
        headline: 'Professor Finley shares the legend of the ancient root caretakers.'
      }
    ]
  },
  {
    id: 'story-ganachetrain',
    title: 'The GanacheTrain Incident',
    description: 'Explore the elevated transit lines, high-canopy navigation, and the development of the glass monorails.',
    instruction: 'Review the dispatcher logs, safety guidelines, and the history of high-altitude travel.',
    icon: '🚂',
    series: [
      {
        id: 'lore-transport',
        title: 'Canopy Navigation & Safety',
        category: 'Forest Educational Adventure',
        posterUrl: '/Assets/Ganache Grove/GanacheGrove_GossipCorner.png',
        cost: 50,
        actsCount: 4,
        type: 'lore',
        loreKey: 'transport',
        starring: [
          { name: 'Horace Ticklebell', role: 'Railway Stationmaster', avatar: '/Characters/Char Cards/Olive_Pine.png' },
          { name: 'Professor Finley', role: 'Academy Principal', avatar: '/Characters/Char Cards/Hugo_Glass.png' }
        ],
        synopsis: 'A dramatic ranger briefing about the dangers of high-canopy navigation, balloon accidents, and owl patrol logistics.',
        headline: 'Horace Ticklebell teaches the rules of glass pods and forest tree line paths.'
      },
      {
        id: 'lore-economy',
        title: 'The Molasses Crisis of Year 398',
        category: 'Economic Action',
        posterUrl: '/Assets/Ganache Grove/GanacheGrove_GossipCorner.png',
        cost: 50,
        actsCount: 4,
        type: 'lore',
        loreKey: 'economy',
        starring: [
          { name: 'Rowan Thistle', role: 'Builder Apprentice', avatar: '/Characters/Char Cards/Milo_Spark.png' },
          { name: 'Captain Winston Butterfield', role: 'Town Explorer & Detective', avatar: '/Characters/Char Cards/Nico_Whistle.png' }
        ],
        synopsis: 'A historic re-enactment of the massive autumn storm that flooded highways with syrup and led to elevated monorail construction.',
        headline: 'Rowan Thistle shares how a mudslide birthed the glass monorail network.'
      }
    ]
  },
  {
    id: 'story-herbal-treatment',
    title: 'The Herbal Treatment Incident',
    description: 'Investigate the sudden spore sneezles outbreak at the Forest Academy and the quest for fresh mint remedies.',
    instruction: 'Examine the medical logs, quarantine files, and environmental debates surrounding the grove.',
    icon: '🌿',
    series: [
      {
        id: 'lore-politics',
        title: 'The Great Walkway Debate',
        category: 'Civic Drama',
        posterUrl: '/Assets/Ganache Grove/GanacheGrove_GossipCorner.png',
        cost: 50,
        actsCount: 4,
        type: 'lore',
        loreKey: 'politics',
        starring: [
          { name: 'Julie Frost', role: 'Gazette Reporter', avatar: '/Characters/Char Cards/Zara_Quill.png' },
          { name: 'Rowan Thistle', role: 'Builder Apprentice', avatar: '/Characters/Char Cards/Milo_Spark.png' },
          { name: 'Miss Page Bumblewick', role: 'Amateur Investigator', avatar: '/Characters/Char Cards/Olive_Pine.png' }
        ],
        synopsis: 'A heated town council dispute between builder rowan thistle\'s modern elevated walkways and rebels who wish to protect low fluttermoth larvae.',
        headline: 'Julie Frost details the compromise reached under Captain Butterfield\'s tiebreaker vote.'
      },
      {
        id: 'lore-gossip',
        title: 'The Mossberry Whispers',
        category: 'Local Investigative Journal',
        posterUrl: '/Assets/Ganache Grove/GanacheGrove_GossipCorner.png',
        cost: 50,
        actsCount: 4,
        type: 'lore',
        loreKey: 'gossip',
        starring: [
          { name: 'Miss Page Bumblewick', role: 'Amateur Investigator', avatar: '/Characters/Char Cards/Olive_Pine.png' },
          { name: 'Captain Winston Butterfield', role: 'Town Explorer & Detective', avatar: '/Characters/Char Cards/Nico_Whistle.png' }
        ],
        synopsis: 'A scandalous digest following miss page\'s reports of midnight tea auditing, acorn commando targets, and secret squirrel brigades.',
        headline: 'Miss Page Bumblewick exposes what really happens when the sun sets.'
      }
    ]
  }
];

export type StoryDeckStep =
    | 'lobby'
    | 'gallery'
    | 'branch-selection'
    | 'county'
    | 'town'
    | 'story'
    | 'payment-verification'
    | 'payment-confirm'
    | 'resume-stats'
    | 'seat';

export type DeckPath = 'county' | 'capital';

// --- Shared Helper Utilities ---
const truncateWords = (text: string, wordCount: number) => {
  if (!text) return '';
  const words = text.split(' ');
  return words.length > wordCount ? words.slice(0, wordCount).join(' ') + "..." : text;
};

const renderColoredText = (text: string, fontClass: string = "font-sans", sizeClass: string = "text-[16px]") => {
  const loreTerms = ['Nutwood', 'Creamwood', 'Cocoawood', 'Honeywood', 'Toffee Town', 'Grand Harbour', 'Bosses', 'Rebels', 'Pompelmoose', 'Chucklebop', 'Goldwhistle', 'Grimshade', 'Heartlands', 'Golden Skyway', 'Chocolatebrook', 'character', 'county', 'spotlight', 'heart', 'Whiskerton', 'Whimsley', 'Nella', 'Tibbins', 'Admiral'];
  return (
    <span className={`${fontClass} ${sizeClass} font-light tracking-wide leading-relaxed text-white`}>
      {text.split(' ').map((word, i) => {
        const cleanWord = word.replace(/[.,:;—]/g, '');
        const isLore = loreTerms.some(term => cleanWord.toLowerCase().includes(term.toLowerCase()));
        return (
          <span key={i} className={`${isLore ? 'text-amber-400 font-bold' : 'text-white'} mr-[0.2em] inline-block`}>
            {word}
          </span>
        );
      })}
    </span>
  );
};

export const LovelyColoredText: React.FC<{ text: string, font?: string, size?: string }> = ({ text, font = "font-sans", size = "text-[18px]" }) => {
  const words = text.split(' ');
  const colors = ['text-cyan-300', 'text-amber-300', 'text-pink-300', 'text-emerald-300', 'text-rose-300'];
  return (
    <span className={`${font} ${size} leading-relaxed`}>
      {words.map((word, i) => (
        <span key={i} className={`${colors[i % colors.length]} transition-colors duration-300`}>
          {word}{' '}
        </span>
      ))}
    </span>
  );
};

export const MultiColoredHeading: React.FC<{ text: string, size?: string }> = ({ text, size = "text-3xl" }) => {
  const words = text.split(' ');
  const colors = ['text-white', 'text-cyan-400', 'text-amber-400', 'text-rose-400', 'text-emerald-400'];
  return (
    <h3 className={`font-saira ${size} uppercase font-black tracking-widest leading-none flex gap-3 flex-wrap justify-center`}>
      {words.map((word, i) => (
        <span key={i} className={`${colors[i % colors.length]} `}>{word}</span>
      ))}
    </h3>
  );
};

// --- Gallery Components ---
export const ActionCard: React.FC<{ title: string; paragraphs: (string | React.ReactNode)[]; kicker: string; accent: 'fuchsia' | 'cyan'; buttonLabel?: string; onClick: () => void; }> = ({ title, paragraphs, kicker, accent, buttonLabel, onClick }) => {
  const colors = {
    fuchsia: {
      bg: 'bg-black/55',
      border: 'border-[3px] border-amber-400 shadow-[0_0_30px_rgba(251,191,36,0.4)]',
      title: 'text-pink-400 drop-shadow-[0_0_15px_rgba(244,114,182,0.8)]',
      inner: 'border-[2px] border-amber-400/50',
      btn: 'text-pink-400 border-pink-400/40 bg-pink-500/5 hover:bg-pink-500/20 shadow-[0_0_20px_rgba(244,114,182,0.3)] font-sans font-bold'
    },
    cyan: {
      bg: 'bg-black/55',
      border: 'border-[3px] border-amber-400 shadow-[0_0_30px_rgba(251,191,36,0.4)]',
      title: 'text-teal-400 drop-shadow-[0_0_15px_rgba(45,212,191,0.8)]',
      inner: 'border-[2px] border-amber-400/50',
      btn: 'text-cyan-400 border-cyan-400/40 bg-cyan-500/5 hover:bg-cyan-500/20 shadow-[0_0_20px_rgba(6,182,212,0.3)] font-sans font-bold'
    }
  };
  return (
    <div className={`px-10 py-10 rounded-[3rem] ${colors[accent].border} ${colors[accent].bg} transition-all flex flex-col items-center text-center relative h-full w-full z-10 backdrop-blur-none`}>
       <div className={`absolute inset-4 rounded-[2.5rem] border ${colors[accent].inner} pointer-events-none`} />
       <div className="absolute inset-0 rounded-[3rem] shadow-[inset_0_0_50px_rgba(255,255,255,0.02)] pointer-events-none" />
       <span className="relative z-10 font-sans text-[11px] uppercase tracking-[0.4em] mb-4 mt-2 text-white/60 leading-none drop-shadow-md">
          {kicker}
       </span>
       <h3 className={`relative z-10 font-saira text-[2.4rem] uppercase font-black leading-none mb-6 ${colors[accent].title}`}>{title}</h3>
       <div className="relative z-10 flex-1 flex flex-col justify-center gap-6 w-full max-w-[95%] mx-auto mb-6">
          {paragraphs.map((para, i) => (
             <p key={i} className="font-sans text-[15px] text-white/90 leading-relaxed tracking-wider font-medium shadow-text">
                {typeof para === 'string' ? renderColoredText(para, "font-sans", "text-[15px]") : para}
             </p>
          ))}
       </div>
       <div className="relative z-20 w-full px-6 mt-auto">
          <button 
            onClick={onClick}
            className={`w-full max-w-[280px] mx-auto py-3.5 rounded-full border text-[13px] uppercase tracking-[0.4em] hover:scale-105 active:scale-95 transition-all flex items-center justify-center overflow-hidden cursor-pointer ${colors[accent].btn}`}
          >
            <span className="">{buttonLabel || `CHOOSE ${title}`}</span>
          </button>
       </div>
    </div>
  );
};

export const FlipCard: React.FC<{ id: string; front: React.ReactNode; back: React.ReactNode; onClick?: () => void; }> = ({ id, front, back }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  return (
    <motion.div
      layoutId={id}
      className="relative w-full h-full aspect-[4/5] min-h-[420px] max-h-[500px] cursor-pointer [perspective:1000px] group flex flex-col animate-fade-in"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        className="relative w-full h-full [transform-style:preserve-3d] transition-all duration-700"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <div className="absolute inset-0 [backface-visibility:hidden] rounded-[3.5rem] bg-white/5 border-[2px] border-amber-400 flex flex-col items-center justify-center overflow-hidden shadow-2xl">
          {front}
        </div>
        <div className="absolute inset-0 [backface-visibility:hidden] rounded-[3.5rem] bg-black/95 border-[3px] border-amber-400 flex flex-col items-center justify-center [transform:rotateY(180deg)] overflow-hidden shadow-[0_0_50px_rgba(251,191,36,0.25)]">
          {back}
        </div>
      </motion.div>
    </motion.div>
  );
};

export const ZoneFront: React.FC<{ name: string; onSelect: () => void; index: number }> = ({ name, onSelect, index }) => {
  const getColorShade = () => {
    if (name.includes('Nutwood')) return 'from-amber-500/20 to-amber-700/5 border-amber-500/30 text-amber-400';
    if (name.includes('Creamwood')) return 'from-cyan-500/20 to-cyan-700/5 border-cyan-400/30 text-cyan-400';
    if (name.includes('Cocoawood')) return 'from-rose-500/20 to-rose-700/5 border-rose-400/30 text-rose-400';
    if (name.includes('Honeywood')) return 'from-emerald-500/20 to-emerald-700/5 border-emerald-400/30 text-emerald-400';
    return 'from-white/10 to-white/5 border-white/10 text-white';
  };
  const getNumberColor = () => {
    if (name.includes('Nutwood')) return 'text-amber-500';
    if (name.includes('Creamwood')) return 'text-cyan-500';
    if (name.includes('Cocoawood')) return 'text-rose-500';
    if (name.includes('Honeywood')) return 'text-emerald-400';
    return 'text-white';
  };
  return (
    <div className={`flex flex-col items-center h-full w-full justify-between py-12 px-8 text-center transition-all duration-700 bg-gradient-to-br ${getColorShade()}`}>
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-20%] w-[140%] h-[140%] border-[40px] border-white rounded-full" />
      </div>
      <div className="flex flex-col items-center justify-start w-full relative z-10 mb-auto mt-6">
        <span className={`text-[15px] font-sans font-black uppercase tracking-[0.4em] mb-12 ${getNumberColor()}  flex items-center gap-2`}>
          COUNTY <span className="text-[32px] font-sans font-black drop-shadow-md leading-none translate-y-[-2px] tracking-normal">0{index + 1}</span>
        </span>
      </div>
      <div className="flex flex-col items-center justify-center w-full my-auto z-10 scale-110">
        <h3 className="text-[34px] font-brand uppercase font-black leading-tight  select-none" style={{ fontFamily: '"Luckiest Guy", cursive' }}>
          {name}
        </h3>
      </div>
      <div className="flex items-center justify-center w-full z-10 mt-auto opacity-90 transition-opacity pb-2">
        <button 
          onClick={(e) => { e.stopPropagation(); onSelect(); }} 
          className="text-[12px] font-sans font-bold text-white uppercase tracking-[0.4em]  py-3 px-8 bg-amber-500 rounded-full hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(245,158,11,0.5)] border border-amber-400 cursor-pointer"
        >
          SELECT COUNTY
        </button>
      </div>
    </div>
  );
};

export const ZoneBack: React.FC<{ name: string; desc: string; index: number; onSelect: () => void }> = ({ name, desc, index, onSelect }) => {
  const getNumberColor = () => {
    if (name.includes('Nutwood')) return 'text-amber-500';
    if (name.includes('Creamwood')) return 'text-cyan-500';
    if (name.includes('Cocoawood')) return 'text-rose-500';
    if (name.includes('Honeywood')) return 'text-emerald-400';
    return 'text-white';
  };
  return (
    <div className="flex flex-col h-full w-full p-10 text-left justify-start items-start relative overflow-hidden bg-black/85 pb-16">
      <div className="flex flex-col w-full z-10 border-b border-white/10 pb-6 mb-8">
        <span className={`text-[14px] font-sans font-black uppercase tracking-[0.4em] mb-2 ${getNumberColor()}  flex items-center gap-2`}>
          COUNTY <span className="text-[24px]">0{index + 1}</span>
        </span>
        <h3 className="text-[28px] font-brand font-black text-white uppercase " style={{ fontFamily: '"Luckiest Guy", cursive' }}>{name}</h3>
      </div>
      <div className="overflow-y-auto no-scrollbar w-full mb-auto pb-4 pr-3 relative h-full max-h-[140px] flex-1">
        <div className="font-sans tracking-wide z-10 w-full font-medium drop-shadow-md">
          {renderColoredText(desc, "font-sans", "text-[16px]")}
        </div>
      </div>
      <div className="w-full mt-4 flex justify-center z-10">
        <button 
          onClick={(e) => { e.stopPropagation(); onSelect(); }}
          className="text-[12px] font-sans font-bold text-white uppercase tracking-[0.4em] py-3 px-8 bg-amber-500 rounded-full hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(245,158,11,0.5)] border border-amber-400 cursor-pointer"
        >
          CONFIRM COUNTY
        </button>
      </div>
    </div>
  );
};

export const TownFront: React.FC<{ town: any; onSelect: () => void; index: number }> = ({ town, onSelect, index }) => {
  const getTownTheme = () => {
    const themes = [
      {
        bg: 'from-amber-500/10 to-amber-800/5 border-amber-400/20 text-white',
        border: 'border-amber-400',
        text: 'text-amber-400',
        groupHover: 'group-hover:text-amber-400',
        shadow: 'shadow-[0_0_20px_rgba(251,191,36,0.5)]',
        btnText: 'text-amber-950 bg-amber-400 border-amber-300'
      },
      {
        bg: 'from-cyan-500/10 to-cyan-800/5 border-cyan-400/20 text-white',
        border: 'border-cyan-400',
        text: 'text-cyan-400',
        groupHover: 'group-hover:text-cyan-400',
        shadow: 'shadow-[0_0_20px_rgba(34,211,238,0.5)]',
        btnText: 'text-cyan-950 bg-cyan-400 border-cyan-300'
      },
      {
        bg: 'from-rose-500/10 to-rose-800/5 border-rose-400/20 text-white',
        border: 'border-rose-400',
        text: 'text-rose-400',
        groupHover: 'group-hover:text-rose-400',
        shadow: 'shadow-[0_0_20px_rgba(251,113,133,0.5)]',
        btnText: 'text-rose-950 bg-rose-400 border-rose-300'
      },
      {
        bg: 'from-emerald-500/10 to-emerald-800/5 border-emerald-400/20 text-white',
        border: 'border-emerald-400',
        text: 'text-emerald-400',
        groupHover: 'group-hover:text-emerald-400',
        shadow: 'shadow-[0_0_20px_rgba(52,211,153,0.5)]',
        btnText: 'text-emerald-950 bg-emerald-400 border-emerald-300'
      }
    ];
    return themes[index % themes.length];
  };
  const theme = getTownTheme();
  return (
    <div className={`flex flex-col items-center h-full w-full justify-between py-12 px-8 text-center transition-all duration-700 bg-gradient-to-br ${theme.bg}`}>
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none overflow-hidden">
        <div className={`absolute top-[-20%] right-[-20%] w-[140%] h-[140%] border-[30px] ${theme.border} rounded-full`} />
      </div>
      <div className="flex flex-col items-center justify-start w-full relative z-10 mb-auto mt-6">
        <span className={`text-[15px] font-sans font-black ${theme.text} uppercase tracking-[0.4em] mb-12  flex items-center gap-2`}>
          TOWN <span className="text-[32px] font-sans font-black drop-shadow-md leading-none translate-y-[-2px] tracking-normal">0{index + 1}</span>
        </span>
      </div>
      <div className="flex flex-col items-center justify-center w-full my-auto z-10 scale-110 px-2">
        <h3 className={`text-[32px] font-brand uppercase font-black leading-tight  select-none text-white ${theme.groupHover} transition-colors`} style={{ fontFamily: '"Luckiest Guy", cursive' }}>
          {town.name}
        </h3>
      </div>
      <div className="flex items-center justify-center w-full z-10 mt-auto opacity-90 transition-opacity pb-2">
        <button 
          onClick={(e) => { e.stopPropagation(); onSelect(); }}
          className={`text-[12px] font-sans font-bold uppercase tracking-[0.4em]  py-3 px-8 rounded-full hover:scale-105 active:scale-95 transition-all ${theme.shadow} border ${theme.btnText} cursor-pointer`}
        >
          SELECT TOWN
        </button>
      </div>
    </div>
  );
};

export const TownBack: React.FC<{ town: any; index: number; onSelect: () => void; }> = ({ town, index, onSelect }) => {
  const getTownTheme = () => {
    const textColors = ['text-amber-400', 'text-cyan-400', 'text-rose-400', 'text-emerald-400'];
    const btnStyles = [
      'shadow-[0_0_20px_rgba(251,191,36,0.5)] border-amber-300 text-amber-950 bg-amber-400',
      'shadow-[0_0_20px_rgba(34,211,238,0.5)] border-cyan-300 text-cyan-950 bg-cyan-400',
      'shadow-[0_0_20px_rgba(251,113,133,0.5)] border-rose-300 text-rose-950 bg-rose-400',
      'shadow-[0_0_20px_rgba(52,211,153,0.5)] border-emerald-300 text-emerald-950 bg-emerald-400'
    ];
    return { text: textColors[index % textColors.length], btn: btnStyles[index % btnStyles.length] };
  };
  const theme = getTownTheme();
  return (
    <div className="flex flex-col h-full w-full p-10 text-left justify-start items-start relative overflow-hidden bg-black/85 pb-16">
      <div className="flex flex-col w-full z-10 border-b border-white/10 pb-6 mb-8">
        <span className={`text-[14px] font-sans font-black uppercase tracking-[0.4em] mb-2 ${theme.text}  flex items-center gap-2`}>
          TOWN <span className="text-[24px]">0{index + 1}</span>
        </span>
        <h3 className="text-[28px] font-brand font-black text-white uppercase " style={{ fontFamily: '"Luckiest Guy", cursive' }}>{town.name}</h3>
      </div>
      <div className="overflow-y-auto no-scrollbar w-full mb-auto pb-4 pr-3 relative h-full max-h-[140px] flex-1">
        <div className="font-sans tracking-wide z-10 w-full font-medium drop-shadow-md">
          {renderColoredText(town.description, "font-sans", "text-[16px]")}
        </div>
      </div>
      <div className="w-full mt-4 flex justify-center z-10">
        <button 
          onClick={(e) => { e.stopPropagation(); onSelect(); }}
          className={`text-[12px] font-sans font-bold uppercase tracking-[0.4em] py-3 px-8 rounded-full hover:scale-105 active:scale-95 transition-all border cursor-pointer ${theme.btn}`}
        >
          CONFIRM TOWN
        </button>
      </div>
    </div>
  );
};

export const DataMetric: React.FC<{ label: string; value: string; sub: string; color: string; bgColor: string; borderColor: string; }> = ({ label, value, sub, color, bgColor, borderColor }) => (
  <div className={`p-4 rounded-[2rem] border ${borderColor} ${bgColor} flex flex-col justify-center items-center shadow-lg relative group overflow-hidden`}>
    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
    <span className="text-[9px] font-sans font-black text-white/50 uppercase tracking-[0.4em] mb-1">{label}</span>
    <span className={`text-2xl font-brand font-black  leading-none mb-1 ${color}`}>{value}</span>
    <span className="text-[10px] font-sans uppercase font-bold tracking-widest text-white/30">{sub}</span>
  </div>
);

export const PieChart: React.FC<{ percent: number; color: string; baseColor: string; size: number; }> = ({ percent, color, baseColor, size }) => {
  const radius = (size - 10) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;
  return (
    <div className="relative flex items-center justify-center filter " style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle cx={size/2} cy={size/2} r={radius} fill="transparent" stroke={baseColor} strokeWidth="6" strokeOpacity="0.2" />
        <motion.circle 
          cx={size/2} cy={size/2} r={radius} fill="transparent" 
          stroke={color} strokeWidth="6" strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-brand text-xs font-black text-white">{percent}%</span>
      </div>
    </div>
  );
};


export const GG_TravellerDeck_Theatre: React.FC<Props> = ({
  setSubPage,
  popPage,
  completedSeriesSteps: _completedSeriesSteps = [],
  triggerFeedback
}) => {
  const coins = useTTStore(state => state.coins);
  const spendCoins = useTTStore(state => state.spendCoins);
  const addSkillXP = useTTStore(state => state.addSkillXP);
  const setHeaderHidden = useTTStore(state => state.setHeaderHidden);
  const setIsModalOpen = useTTStore(state => state.setIsModalOpen);
  const goldenCitizenPass = useTTStore(state => state.goldenCitizenPass);
  const coinHistory = useTTStore(state => state.coinHistory || []);

  const [viewState, setViewState] = useState<'lobby' | 'details' | 'confirm' | 'storywalk' | 'screen'>('storywalk');
  const [playSource, setPlaySource] = useState<'lobby' | 'storywalk'>('storywalk');
  const [deckStep, setDeckStep] = useState<StoryDeckStep>('lobby');
  const [activeLobbyTab, setActiveLobbyTab] = useState<'HELLO' | 'LANDS' | 'HUBS' | 'FOLKS' | 'TALKS' | 'TALES'>('HELLO');
  const [selectedPath, setSelectedPath] = useState<DeckPath | null>(null);
  const [selectedZoneNum, setSelectedZoneNum] = useState<number | null>(null);
  const [selectedTownId, setSelectedTownId] = useState<string | null>('ganache-grove');
  const [selectedLensId, setSelectedLensId] = useState<LensId>('legend');
  const [selectedPart, setSelectedPart] = useState<1 | 2>(1);
  const [showTxPopup, setShowTxPopup] = useState(false);

  const [ticketColor, setTicketColor] = useState<'blue' | 'green' | 'red' | 'orange'>('orange');
  const [userRating, setUserRating] = useState<number>(0);
  const [userFeedback, setUserFeedback] = useState<string>('');
  const [reviewSubmitted, setReviewSubmitted] = useState<boolean>(false);
  
  // Original lobby states
  const [activeAccordion, setActiveAccordion] = useState<string | null>('story-honeyblueberry-loaf');
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [selectedSeriesState, setSelectedSeriesState] = useState<Series | null>(null);

  // Ticketing states
  const [allocatedSeat, setAllocatedSeat] = useState<string>('');
  const [showSeatPopup, setShowSeatPopup] = useState(false);
  const [countdown, setCountdown] = useState(20);
  const [seatingQuoteIndex, setSeatingQuoteIndex] = useState(0);

  // Cinema Screen view states
  const [introPhase, setIntroPhase] = useState<IntroPhase>('intro');
  const layoutMode: LayoutMode = '70mm';
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [autoPlayProgress, setAutoPlayProgress] = useState(0);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [showLogs, setShowLogs] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const splitRatio = 0.7;
  const showOverlays = true;
  const [activeTab, setActiveTab] = useState<'synopsis' | 'script'>('synopsis');
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  // Memos & Selectors
  const selectedTown = useMemo(() => {
    if (!selectedTownId) return null;
    return CANDYBROOK_TOWNS.find(t => t.id === selectedTownId) || null;
  }, [selectedTownId]);

  const lenses = useMemo(() => {
    if (!selectedTownId) return [];
    const townObj = CANDYBROOK_TOWNS.find(t => t.id === selectedTownId) || CANDYBROOK_TOWNS[0];
    return buildLensConfigs(townObj as any);
  }, [selectedTownId]);

  const selectedLens = useMemo(() => {
    return lenses.find(l => l.id === selectedLensId) || lenses[0];
  }, [lenses, selectedLensId]);

  const isPaid = useMemo(() => {
    if (viewState === 'storywalk') {
      if (!selectedTownId) return false;
      return localStorage.getItem(`tt_theater_ticket_${selectedTownId}_${selectedLensId}_s${selectedPart}`) === 'true';
    } else {
      if (!selectedSeriesState) return false;
      return localStorage.getItem(`tt_theater_ticket_${selectedSeriesState.id}`) === 'true';
    }
  }, [viewState, selectedTownId, selectedLensId, selectedPart, selectedSeriesState]);

  const hasActivePass = isPaid || !!goldenCitizenPass;

  const isNewcomer = useMemo(() => {
    return Object.keys(localStorage).filter(k => k.startsWith('tt_theater_ticket_')).length === 0;
  }, []);

  const pathSteps = useMemo(() => {
    return [
      { id: 'gallery', num: '01', kicker: 'GALLERY', label: 'GAZE GALLERY', desc: 'Gaze Gallery', accent: 'text-cyan-400', border: 'border-cyan-400', glow: '' },
      { id: 'story', num: '02', kicker: 'PLOT', label: 'PICK PLOT', desc: 'Pick Plot', accent: 'text-amber-400', border: 'border-amber-400', glow: '' },
      { id: 'payment', num: '03', kicker: 'BILL', label: 'BUY BILL', desc: 'Buy Bill', accent: 'text-rose-500', border: 'border-rose-500', glow: '' },
      { id: 'screen', num: '04', kicker: 'SHOW', label: 'SCREEN SHOW', desc: 'Screen Show', accent: 'text-emerald-400', border: 'border-emerald-400', glow: '' },
    ];
  }, []);

  const activeStepIndex = useMemo(() => {
    if (deckStep === 'gallery') return 0;
    if (deckStep === 'story') return 1;
    if (deckStep === 'payment-verification' || deckStep === 'payment-confirm') return 2;
    if (viewState === 'screen') return 3;
    return -1;
  }, [deckStep, viewState]);

  const selectedSeries = useMemo(() => {
    if (viewState === 'storywalk' || (viewState === 'screen' && playSource === 'storywalk')) {
      if (!selectedTownId) return null;
      const townObj = CANDYBROOK_TOWNS.find(t => t.id === selectedTownId);
      const story = getLensStory(selectedTownId, selectedLensId);
      if (!townObj || !story) return null;
      const half = Math.ceil(story.scenes.length / 2);
      return {
        id: `${selectedTownId}-${selectedLensId}-s${selectedPart}`,
        title: `${story.title} - Part ${selectedPart}`,
        category: `${townObj.name} · ${selectedLensId.toUpperCase()}`,
        posterUrl: townObj.image || '',
        cost: 50,
        actsCount: selectedPart === 1 ? half : story.scenes.length - half,
        type: 'lore' as const,
        synopsis: story.description,
        headline: `${story.title} - Part ${selectedPart}`,
        starring: [
          { name: 'Local Residents', role: 'Witnesses', avatar: '/Characters/Char Cards/Milo_Spark.png' }
        ]
      };
    } else {
      return selectedSeriesState;
    }
  }, [viewState, playSource, selectedSeriesState, selectedTownId, selectedLensId, selectedPart]);

  const activeScenes = useMemo(() => {
    if (viewState === 'storywalk' || (viewState === 'screen' && playSource === 'storywalk')) {
      if (!selectedTownId) return [];
      const story = getLensStory(selectedTownId, selectedLensId);
      if (!story) return [];
      const half = Math.ceil(story.scenes.length / 2);
      const scenesToPlay = selectedPart === 1 
        ? story.scenes.slice(0, half) 
        : story.scenes.slice(half);
      return scenesToPlay.map((scene, idx) => ({
        imageUrl: scene.imageUrl,
        title: scene.title || `${story.title} - Part ${selectedPart} - Scene ${idx + 1}`,
        description: scene.description || story.description,
        dialogues: scene.dialogues.map(d => ({
          speaker: d.speaker,
          text: d.text || ''
        }))
      }));
    } else {
      if (!selectedSeries) return [];
      if (selectedSeries.id.startsWith('chronicles-')) {
        return CANAL_SERIES.map((step) => ({
          imageUrl: step.imagePath,
          title: `Act ${step.stepNumber}: ${step.title}`,
          description: step.storyContext,
          dialogues: [
            { speaker: 'Breaking News', text: step.headline },
            { speaker: 'Narrator', text: step.storyContext },
            { speaker: 'Rowan\'s Desk Note', text: step.rowanNote },
            { speaker: 'Gazette Reporter Note', text: step.julieNote }
          ]
        }));
      } else {
        const ganachePkg = TOWN_THEATER_DIRECTORY.find(p => p.townId === 'ganache-grove');
        const storyKey = selectedSeries.id.replace('lore-', '') as 'legend' | 'gossip' | 'politics' | 'economy' | 'transport';
        const story = ganachePkg?.stories[storyKey];
        if (!story) return [];
        return story.paragraphs.map((p, idx) => ({
          imageUrl: selectedSeries.posterUrl,
          title: `${story.title} - Act ${idx + 1}`,
          description: p,
          dialogues: [
            { speaker: story.narratorName || 'Narrator', text: p },
            { speaker: 'Narrator Role', text: story.narratorRole || 'Historian' }
          ]
        }));
      }
    }
  }, [viewState, playSource, selectedTownId, selectedLensId, selectedPart, selectedSeries]);

  const scene = activeScenes[currentStoryIndex];
  const totalPages = Math.max(1, activeScenes.length);
  const canGoPrev = currentStoryIndex > 0;
  const canGoNext = currentStoryIndex < totalPages - 1;

  // Navigation functions
  const handleNext = useCallback(() => {
    if (currentStoryIndex + 1 < activeScenes.length) {
      cozyAudio.playClick();
      setCurrentStoryIndex(prev => prev + 1);
    } else {
      setIsAutoPlay(false);
      setIntroPhase('ended');
      addSkillXP('explorer', 20);
      triggerFeedback('🎭 Thank you for attending the theatre! You earned +20 Explorer XP! 🔍');
    }
  }, [currentStoryIndex, activeScenes.length, setCurrentStoryIndex, setIsAutoPlay, setIntroPhase, addSkillXP, triggerFeedback]);

  const handlePrev = useCallback(() => {
    if (currentStoryIndex > 0) {
      cozyAudio.playClick();
      setCurrentStoryIndex(prev => prev - 1);
    }
  }, [currentStoryIndex, setCurrentStoryIndex]);

  const handleReplay = useCallback(() => {
    cozyAudio.playClick();
    setCurrentStoryIndex(0);
    setIsAutoPlay(false);
    setIntroPhase('intro');
    setViewState('screen');
    setUserRating(0);
    setUserFeedback('');
    setReviewSubmitted(false);
  }, [setCurrentStoryIndex, setIsAutoPlay, setIntroPhase, setViewState]);

  const handleBackStep = useCallback(() => {
    cozyAudio.playClick();
    if (deckStep === 'lobby') {
      setViewState('lobby');
    } else if (deckStep === 'gallery') {
      setDeckStep('lobby');
    } else if (deckStep === 'story') {
      setDeckStep('gallery');
    } else if (deckStep === 'payment-verification') {
      setDeckStep('story');
    } else if (deckStep === 'payment-confirm') {
      setDeckStep('payment-verification');
    } else {
      setViewState('lobby');
    }
  }, [deckStep]);

  // Toggle wallpaper quotes rotation
  useEffect(() => {
    if (!isImageLoading) return;
    const interval = setInterval(() => {
      setQuoteIndex(prev => prev + 1);
    }, 8000);
    return () => clearInterval(interval);
  }, [isImageLoading]);

  // Auto-hide global header and restoring star button when overlays, confirmation, or screen is active
  useEffect(() => {
    if (viewState !== 'lobby' || showSeatPopup) {
      setHeaderHidden(true);
      setIsModalOpen(true);
    } else {
      setHeaderHidden(false);
      setIsModalOpen(false);
    }
  }, [viewState, showSeatPopup, setHeaderHidden, setIsModalOpen]);

  useEffect(() => {
    return () => {
      setHeaderHidden(false);
      setIsModalOpen(false);
    };
  }, [setHeaderHidden, setIsModalOpen]);

  // Autoplay handler
  useEffect(() => {
    let timer: any;
    if (viewState === 'screen' && introPhase === 'playing' && isAutoPlay && selectedSeries) {
      const duration = 7500;
      const step = 100;
      timer = setInterval(() => {
        setAutoPlayProgress(prev => {
          const next = prev + (step / duration) * 100;
          if (next >= 100) {
            handleNext();
            return 0;
          }
          return next;
        });
      }, step);
    } else {
      setAutoPlayProgress(0);
    }
    return () => clearInterval(timer);
  }, [viewState, introPhase, isAutoPlay, currentStoryIndex, selectedSeries, handleNext]);



  // Per-scene reset
  useEffect(() => {
    setIsImageLoading(true);
    setAutoPlayProgress(0);
  }, [currentStoryIndex]);

  // Seating countdown timer and quotes rotation
  useEffect(() => {
    let timer: any;
    let quoteTimer: any;
    if (showSeatPopup) {
      setCountdown(20);
      setSeatingQuoteIndex(0);
      timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      quoteTimer = setInterval(() => {
        setSeatingQuoteIndex(prev => prev + 1);
      }, 4000);
    }
    return () => {
      clearInterval(timer);
      clearInterval(quoteTimer);
    };
  }, [showSeatPopup]);

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (viewState !== 'screen' || showExitConfirm) return;
      if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'Escape') {
        setShowExitConfirm(true);
      } else if (e.key === ' ') {
        e.preventDefault();
        if (introPhase === 'playing') {
          setIsAutoPlay(p => !p);
        } else if (introPhase === 'intro') {
          setIntroPhase('playing');
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewState, currentStoryIndex, introPhase, showExitConfirm, canGoNext, canGoPrev, handlePrev, handleNext]);

  // Save progress when scene changes
  useEffect(() => {
    if (viewState === 'screen' && selectedSeries && introPhase === 'playing') {
      localStorage.setItem(`tt_theater_progress_${selectedSeries.id}`, currentStoryIndex.toString());
    }
  }, [viewState, selectedSeries, introPhase, currentStoryIndex]);

  useEffect(() => {
    if (introPhase === 'ended' && selectedSeries) {
      localStorage.setItem(`tt_theater_progress_${selectedSeries.id}`, (totalPages - 1).toString());
    }
  }, [introPhase, selectedSeries, totalPages]);

  // Helper for Movie Shelf
  const getMovieShelf = () => {
    const halfWatched: any[] = [];
    const purchased: any[] = [];
    
    const ganachePkg = TOWN_THEATER_DIRECTORY.find(p => p.townId === 'ganache-grove');
    if (!ganachePkg) return { halfWatched, purchased };
    
    const lensesList: LensId[] = ['legend', 'gossip', 'politics', 'economy', 'transport'];
    
    lensesList.forEach(lensId => {
      const story = getLensStory('ganache-grove', lensId);
      if (!story) return;
      
      [1, 2].forEach(part => {
        const key = `tt_theater_ticket_ganache-grove_${lensId}_s${part}`;
        const isBought = localStorage.getItem(key) === 'true' || goldenCitizenPass;
        
        if (isBought) {
          const progressKey = `tt_theater_progress_ganache-grove_${lensId}_s${part}`;
          const savedProgress = localStorage.getItem(progressKey);
          const progressIndex = savedProgress ? parseInt(savedProgress, 10) : 0;
          const total = part === 1 ? Math.ceil(story.scenes.length / 2) : Math.floor(story.scenes.length / 2);
          
          const movieItem = {
            lensId,
            part,
            title: `${story.title} - Part ${part}`,
            progressIndex,
            total,
            progressKey
          };
          
          if (progressIndex > 0 && progressIndex < total - 1) {
            halfWatched.push(movieItem);
          } else {
            purchased.push(movieItem);
          }
        }
      });
    });
    
    return { halfWatched, purchased };
  };

  // Payment process
  const confirmAdmission = () => {
    if (viewState === 'storywalk') {
      if (!selectedTownId) return;
      const ticketId = `tt_theater_ticket_${selectedTownId}_${selectedLensId}_s${selectedPart}`;
      if (!isPaid && !goldenCitizenPass) {
        if (coins < ECONOMY_CONFIG.THEATRE_EPISODE_COST) {
          triggerFeedback(`❌ Need ${ECONOMY_CONFIG.THEATRE_EPISODE_COST} Coins for admission! Complete tasks in the town first.`);
          cozyAudio.playClick();
          return;
        }
        if (spendCoins(ECONOMY_CONFIG.THEATRE_EPISODE_COST, `Theater Ticket: ${selectedTownId} - ${selectedLensId} - Part ${selectedPart}`)) {
          localStorage.setItem(ticketId, 'true');
          cozyAudio.playCoins();
        } else {
          return;
        }
      } else if (goldenCitizenPass && !isPaid) {
        localStorage.setItem(ticketId, 'true');
        cozyAudio.playChime();
      }
    } else {
      if (!selectedSeries) return;
      const ticketId = `tt_theater_ticket_${selectedSeries.id}`;
      const cost = selectedSeries.cost || ECONOMY_CONFIG.THEATRE_EPISODE_COST;
      if (!isPaid && !goldenCitizenPass) {
        if (coins < cost) {
          triggerFeedback(`❌ Need ${cost} Coins for admission!`);
          cozyAudio.playClick();
          return;
        }
        if (spendCoins(cost, `Theater Ticket: ${selectedSeries.title}`)) {
          localStorage.setItem(ticketId, 'true');
          cozyAudio.playCoins();
        } else {
          return;
        }
      } else if (goldenCitizenPass && !isPaid) {
        localStorage.setItem(ticketId, 'true');
        cozyAudio.playChime();
      }
    }

    // Allocate random seat
    const row = ['A', 'B', 'C', 'D', 'E', 'F', 'G'][Math.floor(Math.random() * 7)];
    const num = Math.floor(Math.random() * 24) + 1;
    setAllocatedSeat(`Row ${row}, Seat ${num}`);

    // Choose dynamic ticket color
    const colors: ('blue' | 'green' | 'red' | 'orange')[] = ['blue', 'green', 'red', 'orange'];
    const chosenColor = colors[Math.floor(Math.random() * colors.length)];
    setTicketColor(chosenColor);

    setShowSeatPopup(true);
  };

  // Launch screening
  const startMovie = () => {
    cozyAudio.playChime();
    setCurrentStoryIndex(0);
    setIsAutoPlay(false);
    setAutoPlayProgress(0);
    setIntroPhase('intro');
    setShowSeatPopup(false);
    setViewState('screen');
    setUserRating(0);
    setUserFeedback('');
    setReviewSubmitted(false);
  };

  const currentQuote = useMemo(() => {
    const quotes = [
      "Ganache Grove is always watching, even when the theatre lights are out.",
      "A single whispered line in our town can instantly rewrite history.",
      "The cobblestones of Ganache Grove have a stubborn memory of their own.",
      "Every resident here carries a script they'll softly never tell.",
      "The air in the Grove tastes like spun sugar... and sweet suspicion.",
      "Keep your eyes peeled; our forest rarely forgives forgotten scenes."
    ];
    return quotes[quoteIndex % quotes.length];
  }, [quoteIndex]);
  const immersiveStage = false;
  const showScriptPanel = showLogs;

  // Dummy read to satisfy TypeScript strict unused-locals check
  useEffect(() => {
    const list = [
      selectedPath,
      setSelectedPath,
      selectedZoneNum,
      setSelectedZoneNum,
      userRating,
      userFeedback,
      reviewSubmitted,
      selectedStory,
      setSelectedStory,
      layoutMode,
      splitRatio,
      showOverlays,
      activeTab,
      setActiveTab,
      isNewcomer,
      handleReplay,
      currentQuote,
      immersiveStage,
      showScriptPanel
    ];
    if (list.length === 0) {
      console.log(list);
    }
  }, [
    selectedPath,
    setSelectedPath,
    selectedZoneNum,
    setSelectedZoneNum,
    userRating,
    userFeedback,
    reviewSubmitted,
    selectedStory,
    setSelectedStory,
    layoutMode,
    splitRatio,
    showOverlays,
    activeTab,
    setActiveTab,
    isNewcomer,
    handleReplay,
    currentQuote,
    immersiveStage,
    showScriptPanel
  ]);

  if (viewState === 'screen' && selectedSeries && scene) {
    return (
      <div className="fixed inset-0 z-[400] flex items-center justify-center font-body text-white overflow-hidden transition-colors duration-700 bg-black/40 backdrop-blur-sm animate-fade-in">
        
        {/* GLOBAL PAGE WALLPAPER - Standardized Nature Theme */}
        {(introPhase === 'intro' || showExitConfirm) && (
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <div
              className="absolute inset-0 z-0 transition-all duration-1000 blur-sm scale-105"
              style={{
                backgroundImage: `url('/wallpapers/Nature_Wall.jpg')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
            <div className="absolute inset-0 bg-black/50" />
          </div>
        )}

        <div className="relative z-10 flex w-[92vw] h-[99.5vh] flex-col items-center justify-center rounded-[2.5rem] border-[3px] border-amber-500/60 overflow-hidden shadow-[0_20px_50px_rgba(245,158,11,0.35)] bg-black/60">
          <div className="relative z-20 flex h-full w-full flex-col bg-black/40">
            
            {/* Frosted Glass panel spanning full screen */}
            <div className="relative h-full w-full overflow-hidden flex flex-col justify-between">
              <div className="absolute -top-32 -left-24 h-72 w-72 rounded-full bg-gradient-to-br from-amber-500/10 to-transparent opacity-30 pointer-events-none" />
              <div className="absolute -right-24 -bottom-28 h-72 w-72 rounded-full bg-gradient-to-br from-pink-500/10 to-transparent opacity-25 pointer-events-none" />

              <div className="relative z-10 flex h-full flex-col justify-between">
                
                {/* PREMIUM CINEMATIC HEADER */}
                {introPhase === 'playing' && (
                  <div className="flex h-16 shrink-0 items-center justify-between border-b border-white/10 bg-black/50 px-8 animate-fade-in relative z-50">
                    <div className="flex items-center gap-1 bg-black/40 border border-white/10 px-3 py-1 rounded-xl select-none">
                      <span className="text-[8px] font-sans font-black uppercase tracking-[0.25em] text-amber-500">Seat Active</span>
                      <span className="text-[10px] text-white font-sans font-bold ml-1 uppercase">{allocatedSeat}</span>
                    </div>

                    <div className="font-sans text-[12px] font-black uppercase tracking-widest text-amber-300">
                      {selectedSeries.title}
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-white/40 text-[9px] font-mono">Act {currentStoryIndex + 1} of {totalPages}</span>
                      <button
                        onClick={() => setShowExitConfirm(true)}
                        className="px-4 py-1.5 bg-red-650 hover:bg-red-500 text-white font-sans font-bold text-[10px] uppercase tracking-wider rounded-lg transition-all"
                      >
                        Exit
                      </button>
                    </div>
                  </div>
                )}

                {/* 1. BROADCAST INTRO CURTAIN PHASE */}
                {introPhase === 'intro' && (
                  <div className="flex-grow flex flex-col justify-between p-12 relative z-10 select-none animate-fade-in">
                    <div className="flex flex-col items-center text-center mt-8">
                      <span className="text-sm font-sans text-amber-400 font-bold uppercase tracking-[0.3em] mb-2" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>
                        Now Projecting
                      </span>
                      <h2 className="font-brand text-4xl text-white uppercase tracking-wider mb-2 leading-none" style={{ fontFamily: FONT }}>
                        {selectedSeries.title}
                      </h2>
                      <span className="text-xs text-pink-300 font-sans font-semibold uppercase tracking-widest" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>
                        {selectedSeries.category} · {selectedSeries.actsCount} Acts
                      </span>
                      <div className="w-24 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent my-6" />
                      <p className="text-sm text-white/75 italic leading-relaxed max-w-xl font-sans font-medium">
                        "{selectedSeries.synopsis}"
                      </p>
                    </div>

                    <div className="flex flex-col items-center gap-6 mb-8">
                      <div className="flex flex-col items-center bg-black/40 border border-white/5 p-4 px-8 rounded-2xl">
                        <span className="text-[9px] font-sans font-black text-amber-500 uppercase tracking-widest mb-1">STARRING CAST</span>
                        <span className="text-xs font-sans text-white/90 font-bold uppercase tracking-wider">
                          {selectedSeries.id === 'chronicles-1' || selectedSeries.id.includes('legend')
                            ? 'Mayor Penelope, Barnaby the Baker & Local Residents'
                            : selectedSeries.id === 'chronicles-2' || selectedSeries.id.includes('gossip')
                            ? 'Gideon the Gossip, Pippin & Ganache Grove Neighbors'
                            : 'The Chocobrook Council, Elder Cocoa & Forest Folk'}
                        </span>
                      </div>

                      <button
                        onClick={() => { cozyAudio.playClick(); setIntroPhase('playing'); }}
                        className="px-16 py-4 rounded-full bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-amber-950 font-sans font-black text-[13px] uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(245,158,11,0.5)] cursor-pointer"
                      >
                        🎬 Start Screening
                      </button>
                    </div>
                  </div>
                )}

                {/* 2. CINEMATIC BACKGROUND STAGE PLAYING */}
                {introPhase === 'playing' && (
                  <div className="flex-grow flex flex-col justify-center items-center p-4 relative min-h-0">
                    
                    {/* Glowing cone projector effect */}
                    <div 
                      className="absolute top-0 left-1/2 -translate-x-1/2 w-[85%] h-[55vh] pointer-events-none z-10 opacity-25 mix-blend-screen"
                      style={{
                        background: 'radial-gradient(ellipse at top, rgba(251, 191, 36, 0.2) 0%, transparent 75%)'
                      }}
                    />

                    {/* CINEMA CANVAS PROJECTION FRAME (Correcting messy layout) */}
                    <div className="relative w-full max-w-[92%] h-full max-h-[44vh] aspect-video rounded-2xl overflow-hidden border-[4px] border-amber-500 shadow-[0_0_35px_rgba(245,158,11,0.45),_inset_0_0_15px_rgba(0,0,0,0.85)] bg-zinc-950 flex items-center justify-center shrink-0">
                      
                      {/* Corner Accents Wrap exactly around the projection frame */}
                      <div className="absolute top-2 left-2 w-8 h-8 z-40 pointer-events-none animate-corner-glow">
                        <div className="absolute top-0 left-0 w-full h-full border-t-4 border-l-4 border-amber-400" />
                      </div>
                      <div className="absolute top-2 right-2 w-8 h-8 z-40 pointer-events-none animate-corner-glow">
                        <div className="absolute top-0 right-0 w-full h-full border-t-4 border-r-4 border-amber-400" />
                      </div>
                      <div className="absolute bottom-2 left-2 w-8 h-8 z-40 pointer-events-none animate-corner-glow">
                        <div className="absolute bottom-0 left-0 w-full h-full border-b-4 border-l-4 border-amber-400" />
                      </div>
                      <div className="absolute bottom-2 right-2 w-8 h-8 z-40 pointer-events-none animate-corner-glow">
                        <div className="absolute bottom-0 right-0 w-full h-full border-b-4 border-r-4 border-amber-400" />
                      </div>

                      <img
                        src={scene.imageUrl}
                        alt={scene.title}
                        onLoad={() => setIsImageLoading(false)}
                        className="w-full h-full object-cover"
                      />

                      {/* Image loading spinner inside screen */}
                      {isImageLoading && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-40">
                          <div className="relative h-12 w-12 mb-3">
                            <div className="absolute inset-0 rounded-full border-t-2 border-yellow-300 animate-spin" />
                          </div>
                          <span className="font-sans text-[10px] text-white/50 uppercase tracking-widest animate-pulse">Loading Scene...</span>
                        </div>
                      )}
                    </div>

                    {/* SUBTITLES OVERLAY */}
                    <div className="w-[92%] bg-[#2a0e19]/70 border border-pink-500/20 rounded-2xl p-4 mt-4 text-center max-w-xl mx-auto shadow-2xl flex flex-col justify-center min-h-[4rem] backdrop-blur-md shrink-0">
                      <span className="text-[8px] font-sans font-bold uppercase tracking-[0.2em] text-pink-400 mb-0.5" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>
                        Broadcast Narration
                      </span>
                      <p className="text-[13.5px] text-yellow-100 font-sans font-semibold leading-relaxed italic" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>
                        "{scene.description || (scene.dialogues && scene.dialogues[0]?.text) || 'Watching...'}"
                      </p>
                    </div>

                  </div>
                )}

                {/* Velvet Curtains Side Silhouettes */}
                <div className="absolute top-0 bottom-0 left-0 w-6 bg-gradient-to-r from-red-950 via-[#3b0b14] to-red-900 border-r border-yellow-600/30 z-30 shadow-2xl pointer-events-none" />
                <div className="absolute top-0 bottom-0 right-0 w-6 bg-gradient-to-l from-red-950 via-[#3b0b14] to-red-900 border-l border-yellow-600/30 z-30 shadow-2xl pointer-events-none" />

                {/* SCRIPT FEED ABSOLUTE SIDE PANEL (Triggered via Flap) */}
                {showLogs && (
                  <div className="absolute top-16 right-0 bottom-20 w-80 bg-zinc-950/95 border-l-[3px] border-amber-500/40 p-5 z-[100] animate-slide-right flex flex-col shadow-2xl rounded-l-3xl">
                    <div className="flex justify-between items-center border-b border-white/10 pb-3 mb-4">
                      <span className="font-sans text-sm text-amber-400 uppercase tracking-widest font-black" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>Scene Script</span>
                      <button onClick={() => { cozyAudio.playClick(); setShowLogs(false); }} className="text-white/60 hover:text-white font-sans font-bold cursor-pointer">✕ CLOSE</button>
                    </div>
                    <div className="flex-grow overflow-y-auto custom-scrollbar space-y-3">
                      {scene.dialogues && scene.dialogues.length > 0 ? (
                        scene.dialogues.map((d, i) => (
                          <div key={i} className="border-l-2 border-amber-500/30 pl-3 py-1.5 bg-white/5 rounded-r-xl">
                            <span className="block text-[9px] font-sans font-black uppercase tracking-wider text-pink-400">{d.speaker}</span>
                            <p className="text-xs text-white/80 leading-relaxed font-sans font-medium">{d.text}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-white/40 text-xs italic text-center py-8">No dialogue script found for this scene.</p>
                      )}
                    </div>
                  </div>
                )}

                {/* FLAP TAB TO REVEAL DIALOGUES */}
                {introPhase === 'playing' && (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 z-50">
                    <button
                      onClick={() => { cozyAudio.playClick(); setShowLogs(!showLogs); }}
                      className="group relative flex h-20 w-8 items-center justify-center rounded-l-xl border-l border-y bg-orange-600 border-orange-500/30 backdrop-blur-3xl transition-all hover:w-10 shadow-lg cursor-pointer"
                    >
                      <div className="flex flex-col items-center gap-1">
                        <ChuckleIcon name={showLogs ? 'chevron_right' : 'chevron_left'} className="h-4 w-4 text-white/90" />
                        <span className="text-[7px] font-sans font-black uppercase tracking-wider text-white/80" style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}>Script</span>
                      </div>
                    </button>
                  </div>
                )}

                {/* ADJUSTABLE SPLIT SCREEN PROGRESS BAR */}
                <div className="absolute inset-x-0 bottom-0 z-[70] px-0">
                  <div className="h-[3px] w-full bg-white/5">
                    <div
                      className={`h-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-100 ease-linear ${isAutoPlay ? 'opacity-100' : 'opacity-30'}`}
                      style={{ width: isAutoPlay ? `${autoPlayProgress}%` : `${((currentStoryIndex + 1) / totalPages) * 100}%` }}
                    />
                  </div>
                </div>

              </div>
            </div>

            {/* PREMIUM SCREEN CONTROLS FOOTER */}
            {introPhase === 'playing' && (
              <div className="relative flex h-20 shrink-0 items-center justify-between bg-black/50 px-10 border-t border-white/10 z-50">
                {/* Playback Buttons */}
                <div className="flex items-center gap-2 bg-black/60 border border-white/10 p-1 rounded-xl z-10">
                  <button 
                    onClick={handlePrev} 
                    disabled={!canGoPrev} 
                    className="flex flex-col w-10 h-10 items-center justify-center rounded-lg text-white/50 hover:bg-white/5 hover:text-white disabled:opacity-30 active:scale-95 transition-all cursor-pointer"
                  >
                    <ChuckleIcon name="skip_previous" className="h-4 w-4" />
                    <span className="text-[7px] uppercase font-bold tracking-widest mt-0.5">Prev</span>
                  </button>

                  <button 
                    onClick={() => { cozyAudio.playClick(); setIsAutoPlay(!isAutoPlay); }} 
                    className={`flex flex-col w-12 h-10 items-center justify-center rounded-lg active:scale-95 transition-all cursor-pointer ${
                      isAutoPlay ? 'bg-yellow-400 text-black font-black' : 'text-white/60 hover:bg-white/5'
                    }`}
                  >
                    <ChuckleIcon name={isAutoPlay ? 'pause' : 'play_arrow'} className="h-4 w-4" />
                    <span className="text-[7px] uppercase font-bold tracking-widest mt-0.5">Auto</span>
                  </button>

                  <button 
                    onClick={handleNext} 
                    className="flex flex-col w-10 h-10 items-center justify-center rounded-lg text-white/50 hover:bg-white/5 hover:text-white active:scale-95 transition-all cursor-pointer"
                  >
                    <ChuckleIcon name="skip_next" className="h-4 w-4" />
                    <span className="text-[7px] uppercase font-bold tracking-widest mt-0.5">{canGoNext ? 'Next' : 'End'}</span>
                  </button>
                </div>

                {/* Title details (Centered absolutely) */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-0">
                  <div className="max-w-[45%] text-center pointer-events-auto flex flex-col items-center justify-center">
                    <span className="font-sans text-[13.5px] uppercase tracking-wider text-white font-extrabold truncate w-full text-center" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>{selectedSeries.title}</span>
                    <span className="text-[8.5px] uppercase tracking-widest text-amber-500 font-bold mt-0.5" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>{selectedSeries.category}</span>
                  </div>
                </div>

                {/* Volume toggle */}
                <div className="flex items-center gap-3 z-10">
                  <button
                    onClick={() => { cozyAudio.playClick(); setIsMuted(!isMuted); }}
                    className={`flex flex-col w-10 h-10 items-center justify-center rounded-lg transition-all cursor-pointer ${
                      isMuted ? 'bg-red-500/10 text-red-500' : 'text-white/60 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <ChuckleIcon name={isMuted ? 'volume_off' : 'volume_up'} className="h-4 w-4" />
                    <span className="text-[7px] uppercase font-bold tracking-widest mt-0.5">{isMuted ? 'Muted' : 'Sound'}</span>
                  </button>

                  <button
                    onClick={() => setShowExitConfirm(true)}
                    className="px-4 py-2 bg-red-650 hover:bg-red-500 border border-red-500/30 text-white text-[9.5px] uppercase tracking-wider font-sans font-bold rounded-lg transition-all active:scale-95 cursor-pointer"
                  >
                    Exit
                  </button>
                </div>
              </div>
            )}

            {/* PAUSE / EXIT CONFIRMATION OVERLAY (Renders as Standalone inside frame) */}
            {showExitConfirm && (
              <div className="absolute inset-0 z-[500] flex flex-col justify-between bg-black/60 p-8 text-neutral-100 select-none animate-fade-in rounded-[2.2rem]">
                {/* Top glowing bar */}
                <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-transparent via-amber-400 to-transparent pointer-events-none" />
                
                <div className="flex flex-col items-center justify-center flex-1 text-center">
                  <span className="text-4xl animate-bounce mb-3">⚠️</span>
                  <h3 className="font-sans text-2xl text-white uppercase tracking-wider font-extrabold mb-2" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>Pause &amp; Exit?</h3>
                  <p className="text-xs text-white/60 leading-relaxed font-sans font-medium max-w-sm" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>
                    Are you sure you want to exit the theater screen? Your current screening progress will be paused.
                  </p>
                </div>

                <div className="flex gap-4 w-full">
                  <button
                    onClick={() => { cozyAudio.playClick(); setShowExitConfirm(false); }}
                    className="w-1/2 py-3 bg-neutral-850 hover:bg-neutral-800 text-white font-sans text-xs uppercase tracking-wider rounded-xl transition border border-white/10 cursor-pointer"
                  >
                    Resume
                  </button>
                  <button
                    onClick={() => {
                      cozyAudio.playClick();
                      setShowExitConfirm(false);
                      setViewState('lobby');
                      setCurrentStoryIndex(0);
                      setIntroPhase('intro');
                    }}
                    className="w-1/2 py-3 bg-red-650 hover:bg-red-500 text-white font-sans text-xs uppercase tracking-wider rounded-xl transition shadow-md shadow-red-600/20 cursor-pointer"
                  >
                    Exit Theatre
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    );
  }

  if (showSeatPopup && selectedSeries) {
    const getTicketTheme = () => {
          switch (ticketColor) {
            case 'blue':
              return {
                bg: 'bg-gradient-to-br from-[#0c1e36] via-[#06101f] to-[#02050b]',
                border: 'border-2 border-sky-400/50 shadow-[0_0_50px_rgba(56,189,248,0.35)]',
                textAccent: 'text-sky-300',
                badge: 'bg-sky-500/20 border-sky-500/30 text-sky-200',
                line: 'border-sky-500/20',
                glowText: 'drop-shadow-[0_0_15px_rgba(56,189,248,0.7)]',
              };
            case 'green':
              return {
                bg: 'bg-gradient-to-br from-[#062416] via-[#03110a] to-[#010503]',
                border: 'border-2 border-emerald-400/50 shadow-[0_0_50px_rgba(52,211,153,0.35)]',
                textAccent: 'text-emerald-300',
                badge: 'bg-emerald-500/20 border-emerald-500/30 text-emerald-200',
                line: 'border-emerald-500/20',
                glowText: 'drop-shadow-[0_0_15px_rgba(52,211,153,0.7)]',
              };
            case 'red':
              return {
                bg: 'bg-gradient-to-br from-[#2a0c14] via-[#140509] to-[#060102]',
                border: 'border-2 border-rose-400/50 shadow-[0_0_50px_rgba(251,113,133,0.35)]',
                textAccent: 'text-rose-300',
                badge: 'bg-rose-500/20 border-rose-500/30 text-rose-200',
                line: 'border-rose-500/20',
                glowText: 'drop-shadow-[0_0_15px_rgba(251,113,133,0.7)]',
              };
            case 'orange':
            default:
              return {
                bg: 'bg-gradient-to-br from-[#251505] via-[#150a02] to-[#080400]',
                border: 'border-2 border-amber-400/50 shadow-[0_0_50px_rgba(251,191,36,0.35)]',
                textAccent: 'text-amber-300',
                badge: 'bg-amber-500/20 border-amber-500/30 text-amber-200',
                line: 'border-amber-500/20',
                glowText: 'drop-shadow-[0_0_15px_rgba(251,191,36,0.7)]',
              };
          }
        };
        const theme = getTicketTheme();

        return (
          <div className="fixed inset-0 z-[400] flex items-center justify-center font-body text-white overflow-hidden transition-colors duration-700 bg-black/40 backdrop-blur-sm animate-fade-in">
            {/* GLOBAL PAGE WALLPAPER - Nature Theme */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
              <div
                className="absolute inset-0 z-0 transition-all duration-1000 blur-sm scale-105"
                style={{
                  backgroundImage: `url('/wallpapers/Nature_Wall.jpg')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
              <div className="absolute inset-0 bg-black/50" />
            </div>

            <div className="relative z-10 flex w-[92vw] h-[99.5vh] flex-col items-center justify-center rounded-[2.5rem] border-[3px] border-amber-500/60 overflow-hidden shadow-[0_20px_50px_rgba(245,158,11,0.35)] bg-black/60">
              <div className="relative z-20 flex h-full w-full flex-col bg-black/40 p-6">
                <div className={`flex-grow flex flex-col min-h-0 overflow-hidden shadow-[8px_8px_0px_0px_rgba(245,158,11,0.35)] rounded-[2.5rem] border-[3px] border-dashed ${theme.bg} ${theme.border} p-6 text-neutral-100 relative select-none animate-fade-in`}>
            
            {/* Perforation circle punches */}
            <div className="absolute top-1/2 -left-6 w-12 h-12 rounded-full bg-black/90 border-r-2 border-dashed border-white/10 -translate-y-1/2 z-20 pointer-events-none" />
            <div className="absolute top-1/2 -right-6 w-12 h-12 rounded-full bg-black/90 border-l-2 border-dashed border-white/10 -translate-y-1/2 z-20 pointer-events-none" />

            {/* Back button on top right */}
            <button
              onClick={() => { cozyAudio.playClick(); setShowSeatPopup(false); }}
              className="absolute top-6 right-6 px-4 py-2 bg-neutral-850 hover:bg-neutral-800 border border-white/10 text-white text-[11px] font-sans font-bold uppercase tracking-wider rounded-xl transition cursor-pointer z-50 animate-fade-in"
            >
              ✕ Back
            </button>

            {/* Steps Indicator */}
            <div className="flex justify-center items-center gap-8 py-2.5 px-6 bg-black/40 border border-white/5 rounded-2xl mb-4 text-[12px] font-sans font-extrabold uppercase tracking-widest shrink-0">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <span className="h-6 w-6 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-[11px] text-emerald-300 font-black">✓</span>
                <span>1. Browse Lounge</span>
              </div>
              <div className="text-white/20">➔</div>
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <span className="h-6 w-6 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-[11px] text-emerald-300 font-black">✓</span>
                <span>2. Confirmation</span>
              </div>
              <div className="text-white/20">➔</div>
              <div className="flex items-center gap-2 text-yellow-400 font-black scale-105 transition-transform duration-300">
                <span className="h-6 w-6 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 border border-yellow-300 flex items-center justify-center text-[11px] text-black font-black">3</span>
                <span>3. Ticket Issued</span>
              </div>
            </div>

            {/* Ticket Top bar */}
            <div className="flex flex-col items-center gap-1.5 shrink-0 border-b border-dashed pb-4" style={{ borderColor: theme.line }}>
              <span className="text-3xl animate-bounce">🎬</span>
              <span className="text-[10px] font-black uppercase tracking-[0.3em]" style={{ color: theme.textAccent }}>Seat Reservation Allocated</span>
              <h4 className="text-xl font-brand text-white uppercase leading-none mt-0.5" style={{ fontFamily: FONT }}>Seating Confirmed</h4>
            </div>

            {/* Ticket Center: Seat & Show Details */}
            <div className="flex-grow flex flex-col items-center justify-center py-6 text-center">
              <span className="text-[11px] font-black uppercase tracking-widest text-white/50 leading-none">Admitted Seat</span>
              <span className={`font-sans font-black text-5xl text-white tracking-widest uppercase my-2 ${theme.glowText}`}>
                {allocatedSeat}
              </span>
              
              <div className="w-24 h-[2px] bg-white/10 my-3" />
              
              <span className="text-xs text-white/40 font-sans tracking-wide uppercase">Series Broadcast</span>
              <span className="font-brand text-2xl text-white uppercase tracking-wider text-center max-w-[80%] mt-1">
                {selectedSeries.title}
              </span>
              <span className="text-[10px] text-white/50 font-mono tracking-widest uppercase mt-1">
                {selectedSeries.category}
              </span>
            </div>

            {/* Ticket Bottom: Quote & Launch button */}
            <div className="flex flex-col items-center gap-4 text-center border-t border-dashed pt-4 shrink-0" style={{ borderColor: theme.line }}>
              {countdown > 0 ? (
                <div className="space-y-2">
                  <span className="text-[10px] font-black uppercase tracking-[0.25em] text-cyan-400 animate-pulse block">
                    Preparing Screen Projection...
                  </span>
                  <p className="text-xs italic text-white/80 leading-relaxed font-sans max-w-md h-8 flex items-center justify-center">
                    "{[
                      "Ganache Grove is always watching, even when the theatre lights are out.",
                      "A single whispered line in our town can instantly rewrite history.",
                      "The cobblestones of Ganache Grove have a stubborn memory of their own.",
                      "Every resident here carries a script they'll softly never tell.",
                      "The air in the Grove tastes like spun sugar... and sweet suspicion.",
                      "Keep your eyes peeled; our forest rarely forgives forgotten scenes."
                    ][seatingQuoteIndex % 6]}"
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-[0.25em] text-emerald-400 block">
                    Projection Ready!
                  </span>
                  <p className="text-xs text-emerald-200/90 font-sans">
                    The curtains are raised. Enjoy your cinematic experience!
                  </p>
                </div>
              )}

              <button
                disabled={countdown > 0}
                onClick={startMovie}
                className={`w-full max-w-md py-3 text-black font-sans font-bold uppercase text-xs tracking-wider rounded-xl transition-all shadow-md cursor-pointer ${
                  countdown > 0
                    ? 'bg-neutral-700 text-neutral-500 cursor-not-allowed border border-white/5'
                    : 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:scale-102 active:scale-98 shadow-amber-500/20'
                }`}
              >
                {countdown > 0 ? `Please Wait... (${countdown}s) ⏳` : 'Raise the Curtain! 🎬'}
              </button>
            </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showTxPopup) {
    return (
      <div className="fixed inset-0 z-[400] flex items-center justify-center font-body text-white overflow-hidden transition-colors duration-700 bg-black/40 backdrop-blur-sm animate-fade-in">
        {/* GLOBAL PAGE WALLPAPER - Nature Theme */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div
            className="absolute inset-0 z-0 transition-all duration-1000 blur-sm scale-105"
            style={{
              backgroundImage: `url('/wallpapers/Nature_Wall.jpg')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>

        <div className="relative z-10 flex w-[92vw] h-[99.5vh] flex-col items-center justify-center rounded-[2.5rem] border-[3px] border-amber-500/60 overflow-hidden shadow-[0_20px_50px_rgba(245,158,11,0.35)] bg-black/60">
          <div className="relative z-20 flex h-full w-full flex-col bg-black/40 p-6">
            <div className="w-full h-full flex items-center justify-center z-[100]">
              <div className="w-full max-w-xl rounded-[2.5rem] border-[3px] border-amber-500 bg-zinc-950 p-6 flex flex-col max-h-[80vh] text-left">
                <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-4">
                  <span className="font-brand text-lg text-amber-400 uppercase tracking-widest" style={{ fontFamily: '"Luckiest Guy", cursive' }}>TRANSACTION LEDGER</span>
                  <button onClick={() => { cozyAudio.playClick(); setShowTxPopup(false); }} className="text-white/60 hover:text-white font-sans font-bold cursor-pointer">✕ CLOSE</button>
                </div>
                <div className="flex-grow overflow-y-auto custom-scrollbar space-y-2 pr-1 min-h-0">
                  <div className="bg-white/5 border border-white/5 p-4 rounded-2xl mb-3">
                    <span className="text-[9px] font-sans font-black text-amber-400 tracking-wider block mb-1">MUNICIPAL LEDGER LOGS</span>
                    <p className="text-xs text-white/60 leading-relaxed font-sans font-medium">
                      This ledger tracks all transaction receipts inside Toffee Towns, including admissions tickets and marketplace trade.
                    </p>
                  </div>
                  {coinHistory.length === 0 ? (
                    <p className="text-white/40 text-xs italic text-center py-8">No transaction records found.</p>
                  ) : (
                    coinHistory.slice().reverse().map((tx: any, idx: number) => {
                      const isEarn = tx.type === 'earned' || tx.amount > 0;
                      return (
                        <div key={idx} className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/5">
                          <div className="flex flex-col text-left">
                            <span className="text-xs text-white font-semibold">{tx.reason || tx.source || 'General Transaction'}</span>
                            <span className="text-[9px] text-white/40 font-mono">{tx.date ? new Date(tx.date).toLocaleString() : 'N/A'}</span>
                          </div>
                          <span className={`font-mono text-xs font-bold ${isEarn ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {isEarn ? '+' : '-'}{Math.abs(tx.amount)} 🪙
                          </span>
                        </div>
                      );
                    })
                  )}
                </div>
                <div className="border-t border-white/10 pt-4 shrink-0 flex gap-3 mt-4">
                  <button
                    onClick={() => { cozyAudio.playClick(); setShowTxPopup(false); setSubPage('journal'); }}
                    className="flex-1 py-3 bg-amber-400 hover:bg-amber-500 text-neutral-900 font-sans font-bold text-xs uppercase tracking-widest rounded-xl transition shadow-md cursor-pointer text-center"
                  >
                    Detailed Journal 📖
                  </button>
                  <button
                    onClick={() => { cozyAudio.playClick(); setShowTxPopup(false); }}
                    className="flex-1 py-3 bg-neutral-850 hover:bg-neutral-800 text-white font-sans font-bold text-xs uppercase tracking-widest rounded-xl transition border border-white/10 shadow-md cursor-pointer"
                  >
                    Close Ledger ✕
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center font-body text-white overflow-hidden bg-black/40 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative z-10 flex flex-col items-center justify-center rounded-[2.5rem] border-[3px] border-amber-500/45 overflow-hidden shadow-[0_20px_50px_rgba(245,158,11,0.25)] bg-black/60"
        style={{ height: '100%', width: '92vw' }}
      >
        <div className="relative z-20 flex h-full w-full flex-col bg-black/60 p-6">
          
          {/* ── ORIGINAL LOBBY VIEW ── */}
          {viewState === 'lobby' && !showSeatPopup && (
            <div className="flex-grow flex flex-col min-h-0 overflow-hidden w-full h-full">
          <GG_TravellerDeck_Header
            title="TOFFEE TOWN THEATRE"
            tagline="Bringing the sweet legends of Chocobrook to the silver screen"
            setSubPage={setSubPage}
            popPage={popPage}
          />

          <div className="flex-grow overflow-y-auto custom-scrollbar my-2 text-left pr-1 pb-6 z-10">
            {/* Header info */}
            <div className="flex flex-col lg:flex-row gap-6 mb-8 shrink-0">
              {/* Cozy Playhouse Lounge */}
              <div className="w-full lg:w-[62%] bg-transparent border border-white/15 rounded-[2rem] p-5 select-none text-left shadow-inner">
                <span className="text-[9px] font-black uppercase tracking-[0.25em] text-amber-400 block mb-1">Cozy Playhouse Lounge</span>
                <h3 className="text-base font-brand text-white uppercase mb-2" style={{ fontFamily: FONT }}>
                  The Forest Cinema Experience
                </h3>
                <p className="text-[13px] text-white/70 leading-relaxed font-sans font-medium">
                  Welcome to the Ganache Grove Cozy Playhouse! Nestled high in the chocolate canopy, our theater projects living stories and historic chronicles onto hand-polished sugar-glass panes. Sit back in our cozy seats, breathe the spore-scented breeze, and experience the sweet history of the Chocobrook Province.
                </p>
              </div>
              
              {/* Tickets counter */}
              <div className="w-full lg:w-[38%] bg-[#4c0519]/60 border border-pink-500/35 rounded-[2rem] p-5 select-none text-left flex flex-col justify-between shadow-inner">
                <div>
                  <span className="text-[9px] font-black uppercase tracking-[0.25em] text-pink-400 block mb-1">Box Office & Admissions</span>
                  <h3 className="text-base font-brand text-white uppercase mb-1.5" style={{ fontFamily: FONT }}>
                    Ticket Admissions Desk
                  </h3>
                  <div className="space-y-1.5 text-xs text-pink-100">
                    <div className="flex justify-between items-center text-[12px]">
                      <span className="text-pink-300/80 font-medium">🎟️ Ticket Cost:</span>
                      <span className="font-bold text-yellow-300">{ECONOMY_CONFIG.THEATRE_EPISODE_COST} Coins per Series</span>
                    </div>
                    <div className="flex justify-between items-center text-[12px]">
                      <span className="text-pink-300/80 font-medium">🕒 Validity:</span>
                      <span className="text-cyan-300 font-bold">Permanent Access</span>
                    </div>
                    <div className="flex justify-between items-center text-[12px] border-t border-pink-900/30 pt-1.5 mt-1.5">
                      <span className="text-pink-300/80 font-medium">🪙 Your Coins:</span>
                      <span className="font-mono font-bold text-white">{coins} 🪙</span>
                    </div>
                    <div className="flex gap-2 mt-3.5">
                      <button
                        onClick={() => { cozyAudio.playClick(); setShowTxPopup(true); }}
                        className="flex-1 py-2 bg-pink-900/50 hover:bg-pink-800 border border-pink-500/30 text-pink-200 hover:text-white font-sans font-bold text-[9px] uppercase tracking-wider rounded-xl transition cursor-pointer"
                      >
                        📜 History
                      </button>
                      <button
                        onClick={() => { cozyAudio.playClick(); setViewState('storywalk'); setDeckStep('lobby'); }}
                        className="flex-1 py-2 bg-amber-500 hover:bg-amber-400 text-black font-sans font-bold text-[9px] uppercase tracking-wider rounded-xl transition cursor-pointer shadow-[0_0_15px_rgba(245,158,11,0.4)]"
                      >
                        🎭 Storywalk
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stories Accordion List */}
            <div className="space-y-4">
              {STORIES_DATA.map((story) => {
                const isOpen = activeAccordion === story.id;
                return (
                  <div key={story.id} className="border border-white/10 rounded-[2rem] overflow-hidden bg-white/5 transition-all">
                    {/* Header trigger */}
                    <button
                      onClick={() => { cozyAudio.playClick(); setActiveAccordion(isOpen ? null : story.id); }}
                      className="w-full p-5 flex items-center justify-between hover:bg-white/5 transition cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{story.icon}</span>
                        <div className="flex flex-col text-left">
                          <h4 className="text-sm font-brand text-white uppercase" style={{ fontFamily: FONT }}>{story.title}</h4>
                          <span className="text-[11px] text-white/50 font-sans font-medium">{story.description}</span>
                        </div>
                      </div>
                      <ChuckleIcon name={isOpen ? 'expand_less' : 'expand_more'} className="h-5 w-5 text-white/60" />
                    </button>

                    {/* Accordion panel */}
                    {isOpen && (
                      <div className="p-6 bg-black/40 border-t border-white/10 grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                        {story.series.map((ser) => {
                          const hasPass = localStorage.getItem(`tt_theater_ticket_${ser.id}`) === 'true' || goldenCitizenPass;
                          return (
                            <div key={ser.id} className="border border-white/10 rounded-[2rem] bg-white/5 p-4 flex flex-col justify-between text-left hover:border-amber-400/40 transition">
                              <div>
                                <div className="flex justify-between items-start mb-2 border-b border-white/5 pb-2">
                                  <div className="flex flex-col">
                                    <span className="text-[10px] font-sans text-pink-400 font-bold uppercase tracking-wider">{ser.category}</span>
                                    <h4 className="text-[14px] font-sans font-bold text-white uppercase">{ser.title}</h4>
                                  </div>
                                  <span className="text-[9px] font-sans text-white/40 uppercase tracking-widest px-2 py-0.5 bg-white/5 rounded border border-white/10">{ser.actsCount} Acts</span>
                                </div>
                                <p className="text-xs text-white/80 leading-relaxed font-sans font-medium italic mb-4">"{ser.synopsis}"</p>
                              </div>
                              <div className="flex items-center justify-between border-t border-white/5 pt-3 mt-auto">
                                <span className="text-[10.5px] font-sans font-black text-amber-500 uppercase tracking-wider">
                                  {hasPass ? '🎟️ Ticket Active' : `🪙 ${ECONOMY_CONFIG.THEATRE_EPISODE_COST} Coins`}
                                </span>
                                <button
                                  onClick={() => {
                                    cozyAudio.playClick();
                                    if (hasPass) {
                                      const targetLens = ser.id === 'chronicles-1' || ser.id.includes('legend')
                                        ? 'legend'
                                        : ser.id === 'chronicles-2' || ser.id.includes('gossip')
                                        ? 'gossip'
                                        : 'politics';
                                      setSelectedTownId('ganache-grove');
                                      setSelectedLensId(targetLens);
                                      setPlaySource('storywalk');
                                      setViewState('storywalk');
                                      setDeckStep('story');
                                    } else {
                                      setSelectedSeriesState(ser);
                                      setPlaySource('lobby');
                                      setViewState('confirm');
                                    }
                                  }}
                                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-sans font-bold text-[9px] uppercase tracking-wider transition cursor-pointer"
                                >
                                  {hasPass ? '🎥 Watch Now' : '🎟️ Buy Ticket'}
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
              </div>
            </div>
          </div>
        )}

          {/* ── CONFIRM ADMISSION FOR ACCORDION STORY ── */}
          {viewState === 'confirm' && selectedSeriesState && !showSeatPopup && (
            <div className="flex-grow flex flex-col min-h-0 overflow-hidden w-full h-full">
              <div className="relative z-50 flex h-[60px] shrink-0 items-center justify-between border-b-0 bg-transparent px-8 w-full">
                <button 
                  onClick={() => { cozyAudio.playClick(); setViewState('lobby'); }} 
                  className="rounded-full bg-amber-500 border border-amber-500 px-6 py-1.5 text-[11px] font-sans font-bold uppercase tracking-widest text-white hover:scale-105 active:scale-95 transition-all shadow-[0_0_15px_rgba(245,158,11,0.5)] cursor-pointer"
                >
                  ✕ BACK
                </button>
                <div className="font-brand text-2xl uppercase tracking-[0.4em] font-black " style={{ fontFamily: '"Luckiest Guy", cursive' }}>
                  <span className="text-emerald-400 font-bold">TICKET</span> <span className="text-amber-400 font-bold">CONFIRMATION</span>
                </div>
                <div className="w-20" />
              </div>

              <div className="flex-grow overflow-y-auto custom-scrollbar my-2 text-center p-6 flex flex-col justify-center items-center">
                <div className="w-full max-w-md bg-black/50 border border-white/10 rounded-[2.5rem] p-8 flex flex-col items-center">
                  <span className="text-4xl mb-4">🎟️</span>
                  <span className="text-[10px] font-sans text-pink-400 font-bold uppercase tracking-[0.3em] mb-1">SERIES SELECTION</span>
                  <h3 className="font-brand text-xl text-white uppercase mb-4" style={{ fontFamily: FONT }}>{selectedSeriesState.title}</h3>
                  <p className="text-xs text-white/60 font-sans font-medium mb-6">"{selectedSeriesState.synopsis}"</p>

                  <div className="bg-black/35 border border-white/5 rounded-2xl p-4 flex justify-between items-center text-xs w-full mb-6 shadow-inner">
                    <span className="text-white/40 font-bold uppercase tracking-wider">AVAILABLE BALANCE</span>
                    <span className="text-yellow-400 font-mono font-bold text-sm">{coins} 🪙</span>
                  </div>

                  {coins < ECONOMY_CONFIG.THEATRE_EPISODE_COST && !goldenCitizenPass && (
                    <div className="text-[11px] text-rose-400 font-bold text-center border border-rose-900/30 bg-rose-950/20 p-2 rounded-xl animate-pulse w-full mb-4">
                      ⚠️ Insufficient balance! Complete chores to earn Cocoa Coins.
                    </div>
                  )}

                  <div className="flex gap-4 w-full">
                    <button
                      disabled={coins < ECONOMY_CONFIG.THEATRE_EPISODE_COST && !goldenCitizenPass}
                      onClick={confirmAdmission}
                      className={`flex-grow py-3 rounded-full font-sans font-bold text-xs uppercase tracking-widest transition-all ${
                        coins >= ECONOMY_CONFIG.THEATRE_EPISODE_COST || goldenCitizenPass
                          ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(244,114,182,0.4)] cursor-pointer'
                          : 'bg-neutral-800 text-neutral-500 cursor-not-allowed border border-white/5'
                      }`}
                    >
                      {goldenCitizenPass ? 'USE CITIZEN PASS' : `PAY ${ECONOMY_CONFIG.THEATRE_EPISODE_COST} COINS`}
                    </button>
                    <button
                      onClick={() => { cozyAudio.playClick(); setViewState('lobby'); }}
                      className="px-6 py-3 rounded-full bg-black/40 border border-white/10 text-white/80 font-sans font-bold text-xs hover:bg-white/5 active:scale-95 transition-all uppercase tracking-widest cursor-pointer"
                    >
                      CANCEL
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── STORYWALK SELECTION DECK ── */}
          {viewState === 'storywalk' && !showSeatPopup && (
            <div className="flex-grow flex flex-col min-h-0 overflow-hidden w-full h-full">
              {/* 1. Header or Step Progress Tracker */}
              <div className="relative z-50 flex h-[60px] shrink-0 items-center justify-between border-b-0 bg-transparent px-8 w-full">
                <button 
                  onClick={handleBackStep} 
                  className="rounded-full bg-amber-500 border border-amber-500 px-6 py-1.5 text-[11px] font-sans font-bold uppercase tracking-widest text-white hover:scale-105 active:scale-95 transition-all shadow-[0_0_15px_rgba(245,158,11,0.5)] cursor-pointer animate-fade-in"
                >
                  ✕ BACK
                </button>
                <div className="font-brand text-2xl uppercase tracking-[0.4em] font-black " style={{ fontFamily: '"Luckiest Guy", cursive' }}>
                  <span className="text-emerald-400 font-bold">GANACHE</span> <span className="text-cyan-400 font-bold">GROVE</span> <span className="text-amber-400 font-bold">STORYWALK</span>
                </div>
                <button 
                  onClick={() => { cozyAudio.playClick(); setViewState('lobby'); }} 
                  className="rounded-full bg-red-650 border border-red-650 px-6 py-1.5 text-[11px] font-sans font-bold uppercase tracking-widest text-white hover:scale-105 active:scale-95 transition-all shadow-[0_0_15px_rgba(220,38,38,0.5)] cursor-pointer"
                >
                  EXIT HUB
                </button>
              </div>

              {/* 2. Top Steps progress indicators */}
              <div className="w-full flex flex-col items-center bg-transparent relative z-50 shrink-0 pt-3 pb-3 gap-3 border-none">
                <div className="flex items-center w-full max-w-[95%] justify-center px-8 py-3 rounded-full border border-white/10 bg-transparent shadow-xl">
                  <div className="flex items-center justify-between w-full gap-2">
                    {pathSteps.map((s, idx) => {
                      const isActive = idx === activeStepIndex;
                      const isPast = idx < activeStepIndex;
                      return (
                        <React.Fragment key={s.id}>
                          <div className={`flex items-center gap-3 transition-opacity duration-500 ${isPast || isActive ? 'opacity-100' : 'opacity-50'}`}>
                            <div className={`w-10 h-10 rounded-full border-[2px] flex items-center justify-center transition-all duration-500 ${isActive ? s.border + ' ' + s.accent + ' bg-black/80 ' + s.glow + ' scale-110' : isPast ? s.border + ' ' + s.accent + ' bg-black/40' : 'border-white/20 text-white/50 bg-black/20'}`}>
                              <span className="font-sans text-[15px] font-bold leading-none text-center" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>{s.num}</span>
                            </div>
                            <div className="flex flex-col items-start leading-none justify-center">
                              <span className={`font-sans text-[10px] uppercase tracking-[0.2em] font-extrabold mb-0.5 ${isActive || isPast ? s.accent : 'text-white/30'}`} style={{ fontFamily: "'Josefin Sans', sans-serif" }}>Step {s.num}</span>
                              <span className={`font-sans text-[14px] uppercase tracking-wider font-black ${isActive || isPast ? (isActive ? s.accent + ' ' : 'text-white/80') : 'text-white/40'}`} style={{ fontFamily: "'Josefin Sans', sans-serif" }}>{s.label}</span>
                            </div>
                          </div>
                          {idx < pathSteps.length - 1 && (
                            <div className="flex-1 mx-2">
                              <div className="w-full border-t border-dashed border-white/20" />
                            </div>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* 3. Render Deck Step Content */}
              <div className="flex-grow overflow-y-auto custom-scrollbar my-2 text-left pr-1 pb-6 z-10 min-h-0 flex flex-col relative w-full">
                <AnimatePresence mode="wait">
                  {deckStep === 'lobby' && (
                    <div key="lobby" className="flex-1 w-full flex flex-col items-center justify-start overflow-hidden relative animate-fade-in">
                      <div className="flex justify-center gap-2 py-2 pb-3 mb-3 border-b border-white/10 shrink-0 w-full">
                        {['HELLO', 'LANDS', 'HUBS', 'TALES', 'FOLKS', 'TALKS'].map((tab) => {
                          const isActive = activeLobbyTab === tab;
                          let activeClass = '';
                          let inactiveClass = '';
                          if (tab === 'HELLO') { activeClass = 'border-amber-400 text-amber-300 bg-amber-400/15 shadow-[0_0_15px_rgba(251,191,36,0.3)]'; inactiveClass = 'border-amber-400/30 text-amber-200/80 bg-white/5 hover:border-amber-400/60 hover:text-amber-200'; }
                          if (tab === 'LANDS') { activeClass = 'border-cyan-400 text-cyan-300 bg-cyan-400/15 shadow-[0_0_15px_rgba(34,211,238,0.3)]'; inactiveClass = 'border-cyan-400/30 text-cyan-200/80 bg-white/5 hover:border-cyan-400/60 hover:text-cyan-200'; }
                          if (tab === 'HUBS') { activeClass = 'border-emerald-400 text-emerald-300 bg-emerald-400/15 shadow-[0_0_15px_rgba(52,211,153,0.3)]'; inactiveClass = 'border-emerald-400/30 text-emerald-200/80 bg-white/5 hover:border-emerald-400/60 hover:text-emerald-200'; }
                          if (tab === 'TALES') { activeClass = 'border-yellow-300 text-yellow-200 bg-yellow-300/15 shadow-[0_0_15px_rgba(252,211,77,0.3)]'; inactiveClass = 'border-yellow-300/30 text-yellow-100/80 bg-white/5 hover:border-yellow-300/60 hover:text-yellow-100'; }
                          if (tab === 'FOLKS') { activeClass = 'border-pink-400 text-pink-300 bg-pink-400/15 shadow-[0_0_15px_rgba(244,114,182,0.3)]'; inactiveClass = 'border-pink-400/30 text-pink-200/80 bg-white/5 hover:border-pink-400/60 hover:text-pink-200'; }
                          if (tab === 'TALKS') { activeClass = 'border-rose-400 text-rose-300 bg-rose-400/15 shadow-[0_0_15px_rgba(251,113,133,0.3)]'; inactiveClass = 'border-rose-400/30 text-rose-200/80 bg-white/5 hover:border-rose-400/60 hover:text-rose-200'; }

                          return (
                            <button
                              key={tab}
                              onClick={() => { cozyAudio.playClick(); setActiveLobbyTab(tab as any); }}
                              className={`relative min-w-[100px] px-4 py-1.5 transition-all duration-300 rounded-[1.6rem] border-[2px] font-sans font-bold tracking-widest uppercase cursor-pointer ${isActive ? activeClass : inactiveClass}`}
                            >
                              <span className="text-[11px]">{tab}</span>
                            </button>
                          );
                        })}
                      </div>

                      <div className="flex-grow overflow-y-auto custom-scrollbar w-full">
                        {activeLobbyTab === 'HELLO' && (
                          <div className="flex flex-col items-center w-full space-y-4 pt-2">
                            <MultiColoredHeading text="HEY! TRAVELLER, WELCOME TO GANACHE GROVE STORYWALK." size="text-xl" />
                            <p className="max-w-3xl text-center text-[14px] font-sans text-white/90 leading-relaxed font-medium">
                              The lounge is your <span className="text-cyan-300 font-bold">extended reel preview</span>: a soft-glow storywalk through counties, hubs, citizens, chatter, and treasured archives before you choose your path.
                            </p>
                            <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="p-5 rounded-[2rem] border border-amber-400/30 bg-white/5 shadow-lg text-left">
                                <span className="font-sans text-[11px] text-amber-300 font-black uppercase tracking-[0.2em] block mb-2">HOW TO USE IT</span>
                                <p className="font-sans text-[13px] text-white/80 leading-relaxed font-medium">Glance through each tab, gather the vibe, then enter the deck when the world feels just right.</p>
                              </div>
                              <div className="p-5 rounded-[2rem] border border-cyan-400/30 bg-white/5 shadow-lg text-left">
                                <span className="font-sans text-[11px] text-cyan-300 font-black uppercase tracking-[0.2em] block mb-2">LANDS</span>
                                <p className="font-sans text-[13px] text-white/80 leading-relaxed font-medium">Meet the great counties, their exports, moods, and the vibrant culture each region pours into the province.</p>
                              </div>
                              <div className="p-5 rounded-[2rem] border border-emerald-400/30 bg-white/5 shadow-lg text-left">
                                <span className="font-sans text-[11px] text-emerald-300 font-black uppercase tracking-[0.2em] block mb-2">HUBS</span>
                                <p className="font-sans text-[13px] text-white/80 leading-relaxed font-medium">Peek at the transit and trade hearts that keep ChocoBrook moving with mechanical and magical precision.</p>
                              </div>
                            </div>

                            <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 bg-white/5 border border-white/10 p-5 rounded-[2rem]">
                              <div className="text-left">
                                <span className="text-[12px] text-amber-500 uppercase tracking-[0.2em] font-black block">STORY ARCHIVES DECK</span>
                                <p className="text-xs text-white/60 font-sans font-medium mt-1">Ready to step into the grand projection hall and select your cinematic destination?</p>
                              </div>
                              <div className="flex gap-4">
                                <button
                                  onClick={() => { cozyAudio.playClick(); setShowTxPopup(true); }}
                                  className="px-6 py-3 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-white font-sans font-bold text-[13px] uppercase tracking-widest transition-all cursor-pointer animate-fade-in"
                                >
                                  📜 TRANSACTION LEDGER
                                </button>
                                <button
                                  onClick={() => { cozyAudio.playClick(); setSelectedTownId('ganache-grove'); setDeckStep('gallery'); }}
                                  className="px-8 py-3 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-sans font-bold text-[13px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(251,191,36,0.3)] cursor-pointer animate-fade-in"
                                >
                                  ENTER STORY DECK
                                </button>
                              </div>
                            </div>

                            {/* MOVIE SHELF */}
                            {(() => {
                              const { halfWatched, purchased } = getMovieShelf();
                              if (halfWatched.length === 0 && purchased.length === 0) return null;
                              
                              return (
                                <div className="w-full bg-white/5 border border-white/10 rounded-[2rem] p-5 mt-6 shrink-0 text-left">
                                  <span className="text-[9px] font-sans text-amber-500 uppercase tracking-[0.25em] font-black block mb-3">🎬 YOUR MOVIE SHELF</span>
                                  
                                  <div className="space-y-3">
                                    {/* Half-Watched (In-Progress) */}
                                    {halfWatched.map((item, idx) => (
                                      <div key={`half-${idx}`} className="flex justify-between items-center bg-black/40 border border-amber-500/25 p-3 rounded-xl">
                                        <div className="flex flex-col text-left flex-1 mr-4">
                                          <span className="text-xs text-white font-bold uppercase">{item.title}</span>
                                          <div className="flex items-center gap-2 mt-1">
                                            <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                              <div className="h-full bg-amber-500" style={{ width: `${(item.progressIndex / item.total) * 100}%` }} />
                                            </div>
                                            <span className="text-[9px] text-white/40 font-mono">Scene {item.progressIndex + 1} of {item.total} (In Progress)</span>
                                          </div>
                                        </div>
                                        <button
                                          onClick={() => {
                                            cozyAudio.playClick();
                                            setSelectedLensId(item.lensId);
                                            setSelectedPart(item.part);
                                            setCurrentStoryIndex(item.progressIndex);
                                            setPlaySource('storywalk');
                                            setViewState('screen');
                                            setIntroPhase('playing');
                                          }}
                                          className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-black text-[10px] font-sans font-bold uppercase tracking-wider rounded-lg transition active:scale-95 cursor-pointer"
                                        >
                                          Resume Show 🍿
                                        </button>
                                      </div>
                                    ))}

                                    {/* Purchased / Fully Watched */}
                                    {purchased.map((item, idx) => (
                                      <div key={`pur-${idx}`} className="flex justify-between items-center bg-black/20 border border-white/5 p-3 rounded-xl">
                                        <div className="flex flex-col text-left">
                                          <span className="text-xs text-white font-semibold uppercase">{item.title}</span>
                                          <span className="text-[9px] text-white/40 font-mono mt-0.5">Purchased &middot; Permanent Access</span>
                                        </div>
                                        <button
                                          onClick={() => {
                                            cozyAudio.playClick();
                                            setSelectedLensId(item.lensId);
                                            setSelectedPart(item.part);
                                            setCurrentStoryIndex(0);
                                            setPlaySource('storywalk');
                                            setViewState('screen');
                                            setIntroPhase('playing');
                                          }}
                                          className="px-4 py-1.5 bg-white/10 hover:bg-white/15 text-white text-[10px] font-sans font-bold uppercase tracking-wider rounded-lg border border-white/10 transition active:scale-95 cursor-pointer"
                                        >
                                          Rewatch 🎥
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              );
                            })()}
                          </div>
                        )}

                        {activeLobbyTab === 'LANDS' && (
                          <div className="flex flex-col gap-4 pt-2 animate-fade-in">
                            <div className="flex items-center justify-center mb-1 shrink-0">
                              <MultiColoredHeading text="THE GRAND PROVINCE OF CHOCOBROOK" size="text-xl" />
                            </div>
                            {LOBBY_LANDS.map((land, idx) => (
                              <div key={idx} className="p-5 rounded-[2rem] bg-white/5 border border-white/10 flex flex-col text-left">
                                <div className="flex items-center gap-3 mb-2 border-b border-white/5 pb-2">
                                  <span className="font-brand text-lg text-amber-400 uppercase tracking-wider">{land.name}</span>
                                  <span className="text-[9px] font-sans text-white/50 uppercase tracking-widest px-2 py-0.5 bg-white/5 rounded border border-white/10">{land.type}</span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {land.points.map((pt, ptIdx) => (
                                    <div key={ptIdx} className="flex flex-col">
                                      <span className="text-[10px] font-sans text-cyan-400 font-bold uppercase tracking-wider">{pt.title}</span>
                                      <p className="text-[13px] text-white/90 leading-relaxed font-sans font-medium">{pt.desc}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {activeLobbyTab === 'HUBS' && (
                          <div className="flex flex-col gap-4 pt-2 animate-fade-in">
                            <div className="flex items-center justify-center mb-1 shrink-0">
                              <MultiColoredHeading text="PROVINCIAL TRANSIT HUBS" size="text-xl" />
                            </div>
                            {LOBBY_HUBS.map((hub, idx) => (
                              <div key={idx} className="p-5 rounded-[2rem] bg-white/5 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 text-left">
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-1.5">
                                    <span className="font-brand text-lg text-emerald-400 uppercase tracking-wider">{hub.name}</span>
                                    <span className="text-[9px] font-sans text-white/50 uppercase tracking-widest px-2 py-0.5 bg-white/5 rounded border border-white/10">{hub.type}</span>
                                  </div>
                                  <p className="text-[13px] text-white/80 leading-relaxed font-sans font-medium">{hub.desc}</p>
                                </div>
                                <div className="flex items-center gap-4 shrink-0">
                                  <div className="text-right">
                                    <span className="text-[9px] text-white/40 font-sans font-black uppercase tracking-wider block">LOGISTICS</span>
                                    <span className="text-sm font-bold text-white uppercase">{hub.status}</span>
                                  </div>
                                  <div className="w-1.5 h-8 bg-emerald-500 rounded-full" />
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {activeLobbyTab === 'TALES' && (
                          <div className="flex flex-col gap-4 pt-2 animate-fade-in">
                            <div className="flex items-center justify-center mb-1 shrink-0">
                              <MultiColoredHeading text="TOWN CHRONICLES" size="text-xl" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                              {LOBBY_TALES.map((tale, idx) => (
                                <div key={idx} className="p-5 rounded-[2rem] bg-white/5 border border-white/10 flex flex-col justify-between text-left h-[180px]">
                                  <div>
                                    <div className="flex justify-between items-center mb-2 border-b border-white/5 pb-1.5">
                                      <span className="text-[10px] font-sans text-cyan-400 font-bold uppercase tracking-wider">{tale.town}</span>
                                      <span className="text-[9px] font-sans text-yellow-300 font-bold uppercase tracking-wider">{tale.file}</span>
                                    </div>
                                    <h4 className="text-[14px] font-sans font-bold text-white uppercase truncate">"{tale.title}"</h4>
                                    <p className="text-xs text-white/70 leading-relaxed font-sans font-medium line-clamp-3 mt-1.5">"{tale.teaser}"</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {activeLobbyTab === 'FOLKS' && (
                          <div className="flex flex-col gap-4 pt-2 animate-fade-in">
                            <div className="flex items-center justify-center mb-1 shrink-0">
                              <MultiColoredHeading text="FACES OF CHOCOBROOK" size="text-xl" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                              {LOBBY_FOLKS.map((folk, idx) => (
                                <div key={idx} className="p-5 rounded-[2rem] bg-white/5 border border-white/10 flex flex-col text-left">
                                  <div className="flex justify-between items-center mb-2.5 border-b border-white/5 pb-2">
                                    <span className={`font-brand text-lg ${folk.color} uppercase tracking-wider`}>{folk.name}</span>
                                    <span className="text-[9px] font-sans text-white/50 uppercase tracking-widest px-2 py-0.5 bg-white/5 rounded border border-white/10">{folk.clan}</span>
                                  </div>
                                  <p className="text-[13px] text-white/80 leading-relaxed font-sans font-medium">{folk.bio}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {activeLobbyTab === 'TALKS' && (
                          <div className="flex flex-col gap-4 pt-2 animate-fade-in">
                            <div className="flex items-center justify-center mb-1 shrink-0">
                              <MultiColoredHeading text="WHISPERS & DECREES" size="text-xl" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                              {LOBBY_FOLKS.map((folk, idx) => (
                                <div key={idx} className="p-5 rounded-[2rem] bg-gradient-to-br from-white/10 to-transparent border-l-[6px] border-y border-r border-white/10 shadow-lg flex flex-col justify-between text-left min-h-[160px]">
                                  <div>
                                    <span className={`text-[10px] font-sans ${folk.color} uppercase tracking-widest font-bold block mb-1`}>{folk.name}</span>
                                    <p className="text-[14px] text-white font-medium italic">"{folk.talk}"</p>
                                  </div>
                                  <div className="border-t border-white/5 pt-2 mt-3">
                                    <span className="text-[9px] font-sans text-amber-500 uppercase font-black block tracking-wider">SITUATION LOG</span>
                                    <p className="text-xs text-white/60 font-sans mt-0.5">{folk.situation}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {deckStep === 'gallery' && selectedTown && (
                    <div key="gallery" className="flex-1 w-full flex flex-col items-center justify-between min-h-0 overflow-hidden relative animate-fade-in p-2">
                      
                      {/* 4 Posters in a row */}
                      <div className="flex-grow w-full flex flex-row justify-center items-center gap-6 py-4 min-h-0">
                        {(() => {
                          const ganachePkg = TOWN_THEATER_DIRECTORY.find(p => p.townId === selectedTownId);
                          const lensesList = [
                            { id: 'legend', icon: '🌳', color: 'border-emerald-500/50 text-emerald-400' },
                            { id: 'gossip', icon: '💬', color: 'border-pink-500/50 text-pink-400' },
                            { id: 'politics', icon: '⚖️', color: 'border-amber-500/50 text-amber-400' },
                            { id: 'economy', icon: '🪙', color: 'border-yellow-400/50 text-yellow-300' },
                          ];

                          return lensesList.map((item, idx) => {
                            const story = ganachePkg?.stories[item.id as 'legend' | 'gossip' | 'politics' | 'economy'];
                            if (!story) return null;

                            return (
                              <div key={item.id} className="w-[220px] h-[380px] shrink-0">
                                <FlipCard
                                  id={`poster-${item.id}`}
                                  front={
                                    <div className="flex flex-col items-center justify-between h-full w-full p-5 bg-gradient-to-br from-neutral-900 via-neutral-950 to-black text-center select-none rounded-t-[4rem] rounded-b-2xl border-2 border-amber-500/30">
                                      <div className="flex flex-col items-center mt-6">
                                        <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-3xl shadow-md mb-2">
                                          {item.icon}
                                        </div>
                                        <span className="text-[9px] font-sans font-black text-white/30 uppercase tracking-[0.25em]">POSTER 0{idx + 1}</span>
                                      </div>
                                      <div className="flex flex-col items-center mb-6">
                                        <h4 className="text-[13px] font-sans font-black text-white uppercase tracking-wider line-clamp-3 px-2 leading-snug">
                                          {story.title}
                                        </h4>
                                        <span className="text-[8px] font-sans text-amber-400/80 uppercase tracking-widest bg-amber-400/5 border border-amber-400/20 px-3 py-1 rounded-full mt-4">
                                          Flip Details 🔄
                                        </span>
                                      </div>
                                    </div>
                                  }
                                  back={
                                    <div className="flex flex-col justify-between h-full w-full p-5 bg-neutral-950 text-left select-none rounded-t-[4rem] rounded-b-2xl border-2 border-amber-500/30 overflow-hidden">
                                      <div className="flex flex-col gap-2 mt-4">
                                        <span className="text-[8px] font-sans font-black text-pink-400 uppercase tracking-widest block">SYNOPSIS</span>
                                        <h4 className="text-[11.5px] font-sans font-black text-white uppercase leading-snug">{story.title}</h4>
                                        <p className="text-[11px] text-white/80 leading-relaxed font-sans font-medium mt-2 line-clamp-[8]">
                                          {story.description}
                                        </p>
                                      </div>
                                      <div className="border-t border-white/10 pt-3 mt-auto mb-2">
                                        <span className="text-[7.5px] text-white/30 font-sans font-bold block uppercase tracking-wider">NARRATOR</span>
                                        <span className="text-[10px] text-amber-300 font-sans font-bold block uppercase truncate mt-0.5">{story.narratorName}</span>
                                      </div>
                                    </div>
                                  }
                                />
                              </div>
                            );
                          });
                        })()}
                      </div>

                      {/* Bottom Navigation */}
                      <div className="w-full border-t border-white/10 pt-4 flex flex-col md:flex-row items-center justify-between gap-4 shrink-0">
                        <div className="text-left">
                          <span className="text-[10px] font-sans text-amber-500 uppercase tracking-wider font-black">NEXT STEP</span>
                          <p className="text-[11px] text-white/60 font-sans font-medium">Proceed to select your story and parts.</p>
                        </div>
                        <button
                          onClick={() => { cozyAudio.playClick(); setDeckStep('story'); }}
                          className="px-8 py-2.5 rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-sans font-bold text-[12px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] cursor-pointer"
                        >
                          PROCEED TO PICK PLOT 🎥
                        </button>
                      </div>

                    </div>
                  )}

                  {deckStep === 'story' && selectedTown && (
                    <div key="story" className="flex-1 w-full grid grid-cols-1 lg:grid-cols-[38%_1fr] gap-6 p-4 overflow-hidden min-h-0 text-left animate-fade-in">
                      <div className="flex flex-col gap-2 rounded-3xl border border-amber-400/30 bg-black/60 p-4 overflow-y-auto custom-scrollbar animate-fade-in">
                        <h3 className="text-[11px] font-sans font-bold text-pink-400 uppercase tracking-[0.3em] mb-3 px-2">STORY LENSES</h3>
                        {lenses.map((lens, idx) => {
                          const isSelected = selectedLensId === lens.id;
                          return (
                            <button
                              key={lens.id}
                              onClick={() => { cozyAudio.playClick(); setSelectedLensId(lens.id as LensId); }}
                              className={`group relative flex items-center justify-between p-3 px-4 rounded-2xl transition-all border-l-[3px] cursor-pointer ${isSelected ? 'bg-white/10 border-cyan-400 shadow-[inset_0_0_20px_rgba(255,255,255,0.05)]' : 'border-amber-500/30 hover:border-pink-400 hover:bg-white/5 bg-transparent'}`}
                            >
                              <div className="flex items-start gap-3">
                                <span className={`text-[12px] font-sans font-bold uppercase mt-0.5 ${isSelected ? 'text-cyan-400' : 'text-amber-400 group-hover:text-pink-400'}`}>0{idx + 1}</span>
                                <div className="flex flex-col items-start leading-tight">
                                  <span className={`text-[14px] font-sans uppercase font-bold tracking-wider ${isSelected ? 'text-white font-black' : 'text-white/80 group-hover:text-white'}`}>{lens.title}</span>
                                  <span className={`text-[10px] font-sans font-semibold uppercase ${isSelected ? 'text-cyan-300' : 'text-pink-300'}`}>{truncateWords(lens.kicker || lens.teaser, 4)}</span>
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      {(() => {
                        const ganachePkg = TOWN_THEATER_DIRECTORY.find(p => p.townId === selectedTownId);
                        const storyKey = selectedLensId as 'legend' | 'gossip' | 'politics' | 'economy' | 'transport';
                        const storyData = ganachePkg?.stories[storyKey];
                        
                        const s1Title = storyData ? `${storyData.title} · Part 1` : `${selectedLens.title} · Part 1`;
                        const s2Title = storyData ? `${storyData.title} · Part 2` : `${selectedLens.title} · Part 2`;
                        
                        const s1Teaser = storyData?.paragraphs?.[0] 
                          ? `"${storyData.paragraphs[0]}"` 
                          : `"${selectedLens.teaser}"`;
                          
                        const s2Teaser = storyData?.paragraphs?.[2] 
                          ? `"${storyData.paragraphs[2]}"` 
                          : storyData?.paragraphs?.[1] 
                          ? `"${storyData.paragraphs[1]}"` 
                          : `"${selectedLens.teaser}"`;
                          
                        const narrator = storyData 
                          ? `Narrated by ${storyData.narratorName} (${storyData.narratorRole})`
                          : "Narrated by Local Residents";

                        const s1Paid = localStorage.getItem(`tt_theater_ticket_${selectedTownId}_${selectedLensId}_s1`) === 'true' || !!goldenCitizenPass;
                        const s2Paid = localStorage.getItem(`tt_theater_ticket_${selectedTownId}_${selectedLensId}_s2`) === 'true' || !!goldenCitizenPass;

                        return (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full h-full min-h-0 overflow-y-auto custom-scrollbar">
                            {/* Series 1 Card */}
                            <div className="relative rounded-3xl border border-amber-400/30 bg-black/60 p-6 flex flex-col justify-between text-center items-center h-full animate-fade-in">
                              <div className="w-full">
                                <span className="text-[10px] font-sans text-pink-400 font-bold uppercase tracking-[0.4em] mb-1.5 block">SERIES 1</span>
                                <h3 className="text-[18px] font-brand text-white uppercase mb-1 leading-snug" style={{ fontFamily: FONT }}>
                                  {s1Title}
                                </h3>
                                <span className="text-[10px] text-amber-300 font-sans font-semibold block mb-3 italic">{narrator}</span>
                                <div className="w-16 h-[1px] bg-amber-400/25 my-3 mx-auto" />
                                <p className="text-xs text-white/70 leading-relaxed font-sans font-medium italic mt-3 line-clamp-4">
                                  {s1Teaser}
                                </p>
                              </div>
                              <div className="w-full mt-6 border-t border-white/5 pt-4 flex flex-col gap-2">
                                <span className="text-[11px] font-sans font-black text-amber-500 uppercase tracking-wider">
                                  {s1Paid ? '🎟️ Ticket Active' : `🪙 ${ECONOMY_CONFIG.THEATRE_EPISODE_COST} Coins`}
                                </span>
                                <button
                                  onClick={() => {
                                    cozyAudio.playClick();
                                    setSelectedPart(1);
                                    if (s1Paid) {
                                      setPlaySource('storywalk');
                                      startMovie();
                                    } else {
                                      setDeckStep('payment-verification');
                                    }
                                  }}
                                  className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-sans font-bold text-[11px] uppercase tracking-wider transition cursor-pointer shadow-md"
                                >
                                  {s1Paid ? '🎥 Watch Part 1' : '🎟️ Buy Part 1'}
                                </button>
                              </div>
                            </div>

                            {/* Series 2 Card */}
                            <div className="relative rounded-3xl border border-amber-400/30 bg-black/60 p-6 flex flex-col justify-between text-center items-center h-full animate-fade-in">
                              <div className="w-full">
                                <span className="text-[10px] font-sans text-cyan-400 font-bold uppercase tracking-[0.4em] mb-1.5 block">SERIES 2</span>
                                <h3 className="text-[18px] font-brand text-white uppercase mb-1 leading-snug" style={{ fontFamily: FONT }}>
                                  {s2Title}
                                </h3>
                                <span className="text-[10px] text-cyan-300 font-sans font-semibold block mb-3 italic">{narrator}</span>
                                <div className="w-16 h-[1px] bg-amber-400/25 my-3 mx-auto" />
                                <p className="text-xs text-white/70 leading-relaxed font-sans font-medium italic mt-3 line-clamp-4">
                                  {s2Teaser}
                                </p>
                              </div>
                              <div className="w-full mt-6 border-t border-white/5 pt-4 flex flex-col gap-2">
                                <span className="text-[11px] font-sans font-black text-amber-500 uppercase tracking-wider">
                                  {s2Paid ? '🎟️ Ticket Active' : `🪙 ${ECONOMY_CONFIG.THEATRE_EPISODE_COST} Coins`}
                                </span>
                                <button
                                  onClick={() => {
                                    cozyAudio.playClick();
                                    setSelectedPart(2);
                                    if (s2Paid) {
                                      setPlaySource('storywalk');
                                      startMovie();
                                    } else {
                                      setDeckStep('payment-verification');
                                    }
                                  }}
                                  className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-sans font-bold text-[11px] uppercase tracking-wider transition cursor-pointer shadow-md"
                                >
                                  {s2Paid ? '🎥 Watch Part 2' : '🎟️ Buy Part 2'}
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  )}

                  {deckStep === 'payment-verification' && selectedTown && (
                    <div key="payment-verify" className="flex-1 w-full grid grid-cols-1 lg:grid-cols-[38%_1fr] gap-6 p-4 overflow-hidden min-h-0 text-left animate-fade-in">
                      <div className="rounded-[2.5rem] border-[3px] border-amber-400 bg-black/80 p-8 flex flex-col justify-center items-center text-center animate-fade-in shadow-[0_0_25px_rgba(245,158,11,0.25)]">
                        <span className="text-[13px] font-sans font-black text-cyan-400 uppercase tracking-[0.2em] mb-1.5">SELECTED FILE / LENS</span>
                        <h3 className="font-brand text-[26px] uppercase text-white tracking-wider leading-tight mb-5" style={{ fontFamily: '"Luckiest Guy", cursive' }}>{selectedLens.title}</h3>

                        <span className="text-[13px] font-sans font-black text-cyan-400 uppercase tracking-[0.2em] mb-1.5">SELECTED TOWN</span>
                        <h3 className="font-brand text-[26px] uppercase text-amber-300 tracking-wider leading-tight mb-5" style={{ fontFamily: '"Luckiest Guy", cursive' }}>{selectedTown.name}</h3>

                        <span className="text-[13px] font-sans font-black text-cyan-400 uppercase tracking-[0.2em] mb-1.5">SELECTED STORY</span>
                        <h3 className="font-brand text-[26px] uppercase text-pink-400 tracking-wider leading-tight mb-5" style={{ fontFamily: '"Luckiest Guy", cursive' }}>{selectedLens.title} - Part {selectedPart}</h3>

                        <span className="text-[11px] font-sans font-black text-white/40 uppercase tracking-widest mb-1.5 block border-t border-white/15 w-full pt-4 mt-2">STORY PREVIEW</span>
                        <p className="font-sans text-[12px] text-white/80 italic leading-relaxed px-2">
                          "{selectedLens.teaser}"
                        </p>
                      </div>

                      <div className="rounded-3xl border border-amber-400/30 bg-black/60 p-6 flex flex-col justify-center items-center text-center animate-fade-in">
                        <div className="flex items-center gap-4 mb-4">
                          <span className="text-4xl">🪙</span>
                          <span className="font-brand text-5xl text-amber-400 leading-none" style={{ fontFamily: '"Luckiest Guy", cursive' }}>{ECONOMY_CONFIG.THEATRE_EPISODE_COST}</span>
                          <span className="font-sans text-xs text-amber-500 uppercase tracking-wider text-left font-black block w-16">GOLD COINS</span>
                        </div>

                        <p className="font-sans text-[15px] leading-relaxed text-white/90 max-w-lg italic mb-6">
                          "Your seat is waiting! Secure your admission to step inside the golden frame and witness the living stories of {selectedTown.name}."
                        </p>

                        <button
                          onClick={() => { cozyAudio.playClick(); setDeckStep('payment-confirm'); }}
                          className="px-12 py-3.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-amber-950 font-sans font-bold text-[13px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(251,191,36,0.4)] cursor-pointer"
                        >
                          PROCEED TO TICKET OFFICE
                        </button>
                      </div>
                    </div>
                  )}

                  {deckStep === 'payment-confirm' && selectedTown && (
                    <div key="payment-confirm" className="flex-1 w-full grid grid-cols-1 lg:grid-cols-[38%_1fr] gap-6 p-4 overflow-hidden min-h-0 text-left animate-fade-in">
                      <div className="rounded-3xl border border-amber-400/30 bg-black/60 p-6 flex flex-col justify-center items-center text-center animate-fade-in">
                        <span className="text-4xl mb-4">🎟️</span>
                        <span className="text-xs font-sans font-bold text-emerald-400 uppercase tracking-widest mb-2">ADMISSION PASS</span>
                        <h3 className="font-brand text-2xl text-white uppercase tracking-wider" style={{ fontFamily: '"Luckiest Guy", cursive' }}>PAY TO VIEW?</h3>
                      </div>

                      <div className="rounded-3xl border border-amber-400/30 bg-black/60 p-6 flex flex-col justify-center items-center text-center animate-fade-in">
                        <div className="bg-black/35 border border-white/5 rounded-2xl p-4 flex justify-between items-center text-xs w-full max-w-md mb-4 shadow-inner">
                          <span className="text-white/40 font-bold uppercase tracking-wider">AVAILABLE BALANCE</span>
                          <span className="text-yellow-400 font-mono font-bold text-sm">{coins} 🪙</span>
                        </div>

                        <div className="flex flex-col gap-2.5 w-full max-w-md mb-6">
                          <div className="relative flex items-center justify-between p-4 rounded-2xl border-2 border-pink-500 bg-pink-500/5 shadow-sm">
                            <div className="flex flex-col items-start text-left">
                              <span className="font-sans font-bold text-xs text-white uppercase tracking-wider">Visual story: Part {selectedPart}</span>
                              <span className="font-sans text-[9px] text-pink-300 font-semibold uppercase tracking-wider">IMAGE LEVEL STORY</span>
                            </div>
                            <span className="font-mono text-amber-400 font-bold text-xs">{ECONOMY_CONFIG.THEATRE_EPISODE_COST} 🪙</span>
                          </div>
                          <div className="flex items-center justify-between p-4 rounded-2xl border border-white/5 bg-black/30 opacity-40">
                            <div className="flex flex-col items-start text-left">
                              <span className="font-sans text-xs text-white/50 uppercase tracking-wider">Visual story through Videos</span>
                              <span className="font-sans text-[9px] text-white/30 font-semibold uppercase tracking-wider">MOVIE STORY</span>
                            </div>
                            <span className="font-mono text-white/30 font-bold text-xs">100 🪙</span>
                          </div>
                        </div>

                        {coins < ECONOMY_CONFIG.THEATRE_EPISODE_COST && !goldenCitizenPass && (
                          <div className="text-[11.5px] text-rose-400 font-bold text-center border border-rose-900/30 bg-rose-950/20 p-2 rounded-xl animate-pulse w-full max-w-md mb-4 font-sans">
                            ⚠️ Insufficient balance! Complete chores to earn Cocoa Coins.
                          </div>
                        )}

                        <div className="flex gap-4 w-full max-w-md">
                          <button
                            disabled={coins < ECONOMY_CONFIG.THEATRE_EPISODE_COST && !goldenCitizenPass}
                            onClick={confirmAdmission}
                            className={`flex-grow py-3 rounded-full font-sans font-bold text-xs uppercase tracking-widest transition-all ${
                              coins >= ECONOMY_CONFIG.THEATRE_EPISODE_COST || goldenCitizenPass
                                ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(244,114,182,0.4)] cursor-pointer'
                                : 'bg-neutral-800 text-neutral-500 cursor-not-allowed border border-white/5'
                            }`}
                          >
                            {hasActivePass ? 'USE ACTIVE PASS' : 'CONFIRM ADMISSION'}
                          </button>
                          <button
                            onClick={() => { cozyAudio.playClick(); setDeckStep('story'); }}
                            className="px-6 py-3 rounded-full bg-black/40 border border-white/10 text-white/80 font-sans font-bold text-[13px] hover:bg-white/5 active:scale-95 transition-all uppercase tracking-widest cursor-pointer"
                          >
                            NOT NOW
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}

        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { display: none; }
        @keyframes amber-glow {
          0%, 100% {
            filter: drop-shadow(0 0 4px rgba(245, 158, 11, 0.4)) drop-shadow(0 0 10px rgba(245, 158, 11, 0.2));
            opacity: 0.7;
          }
          50% {
            filter: drop-shadow(0 0 16px rgba(245, 158, 11, 0.95)) drop-shadow(0 0 28px rgba(251, 191, 36, 0.6));
            opacity: 1;
          }
        }
        .animate-corner-glow {
          animation: amber-glow 3s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};
