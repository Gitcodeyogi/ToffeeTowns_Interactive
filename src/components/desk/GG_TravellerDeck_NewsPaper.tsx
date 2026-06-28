import React, { useState, useRef, useEffect } from 'react';
import { useTTStore } from '../../store/useTTStore';
import { GG_TravellerDeck_Header } from './GG_TravellerDeck_Header';
import { FONT, getChocolateDate, type SubPage } from '../../lib/uiConstants';
import { GanacheGroveTownData } from '../../data/towns/ganache-grove';
import { DAILY_ROTATION_DATA } from '../../data/newspaper_rotation';
import { updateResidentJournal } from '../../utils/journalHelper';
import { cozyAudio } from '../../utils/audioHelper';

interface GG_TravellerDeck_NewsPaperProps {
  setSubPage: (page: SubPage) => void;
  popPage: () => void;
  votedEvents: Record<string, string>;
  setVotedEvents: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  dossierRead: boolean;
  handleReadDossier: () => void;
  inventory: Record<string, number>;
  setInventory: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  triggerFeedback: (msg: string) => void;
}

export const GG_TravellerDeck_NewsPaper: React.FC<GG_TravellerDeck_NewsPaperProps> = ({
  setSubPage,
  popPage,
  votedEvents,
  setVotedEvents,
  dossierRead,
  handleReadDossier,
  inventory: _inventory,
  setInventory: _setInventory,
  triggerFeedback,
}) => {
  const { 
    coins, 
    spendCoins, 
    addCoins, 
    addLegacy, 
    user, 
    raffleTickets, 
    buyRaffleTicket, 
    drawRaffle, 
    gems 
  } = useTTStore();
  const [paperPage, setPaperPage] = useState<1 | 2 | 3 | 4 | 5>(() => {
    const saved = localStorage.getItem('tt_initial_paper_page');
    localStorage.removeItem('tt_initial_paper_page');
    if (saved === '2') return 2;
    if (saved === '3') return 3;
    if (saved === '4') return 4;
    if (saved === '5') return 5;
    return 1;
  });

  const [cookoffBase, setCookoffBase] = useState('Ganache');
  const [cookoffInfusion, setCookoffInfusion] = useState('Honeyberry');
  const [cookoffName, setCookoffName] = useState('');
  const [gossipRumor, setGossipRumor] = useState('');
  const [riddleAnswer, setRiddleAnswer] = useState('');
  const [riddleSolved, setRiddleSolved] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [bgSlideIdx, setBgSlideIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setBgSlideIdx(prev => (prev === 0 ? 1 : 0));
    }, 20000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [paperPage]);

  useEffect(() => {
    if (paperPage === 3) {
      localStorage.setItem('tt_goosebump_read', 'true');
    }
  }, [paperPage]);

  // ── Deterministic Daily Seed Engine ────────────────────────
  const seedRandom = (str: string) => {
    let h = 1779033703 ^ str.length;
    for (let i = 0; i < str.length; i++) {
      h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
      h = (h << 13) | (h >>> 19);
    }
    return () => {
      h = Math.imul(h ^ (h >>> 16), 2246822507);
      h = Math.imul(h ^ (h >>> 13), 3266489909);
      return ((h ^= h >>> 16) >>> 0) / 4294967296;
    };
  };

  const todayStr = new Date().toISOString().slice(0, 10);
  const userUid = user?.uid || 'guest-traveller';
  const rand = seedRandom(`${userUid}-${todayStr}`);

  const dayIndex = (new Date().getDate() % 10) + 1;
  const dayContent = DAILY_ROTATION_DATA.find(d => d.day === dayIndex) || DAILY_ROTATION_DATA[0];



  const renderDetailedStoryBlocks = (day: number) => {
    if (day === 1 || day === 2 || day === 3) {
      return (
        <div className="space-y-4 mt-3 font-sans">
          <div>
            <h4 className="text-[11px] font-black uppercase tracking-wider text-amber-900 border-b border-amber-900/10 pb-0.5 mb-1.5">
              🏛️ Town Hall & Trade Stance
            </h4>
            <ul className="list-disc pl-4 text-[11px] text-amber-950/85 space-y-1">
              <li>
                <strong>Sir Goldwhistle:</strong> Reviewing walkways and urging both factions to compromise for regional stability.
              </li>
              <li>
                <strong>Blacksmith Crumblewise:</strong> Unloading timber planks and insisting local commerce cannot wait for seasonal bugs.
              </li>
              <li>
                <strong>Julie Frost:</strong> Noting high tension as opinions are indexed for today's council presentation.
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-[11px] font-black uppercase tracking-wider text-emerald-900 border-b border-emerald-900/10 pb-0.5 mb-1.5">
              🌳 Conservation & Ecology
            </h4>
            <ul className="list-disc pl-4 text-[11px] text-amber-950/85 space-y-1">
              <li>
                <strong>Mrs. Petalworth:</strong> Setting up warning banners to steer travelers away from sensitive glowcap butterfly habitats.
              </li>
              <li>
                <strong>Rowan Thistle:</strong> Collecting resident surveys and drafting construction blueprints for the elevated walkway.
              </li>
              <li>
                <strong>Glowcap Watch:</strong> Warning that heavy steel machinery could disturb the fragile forest ecology.
              </li>
            </ul>
          </div>
        </div>
      );
    } else if (day === 4 || day === 5 || day === 6) {
      return (
        <div className="space-y-4 mt-3 font-sans">
          <div>
            <h4 className="text-[11px] font-black uppercase tracking-wider text-amber-900 border-b border-amber-900/10 pb-0.5 mb-1.5">
              🏥 Clinic Advisory & Health
            </h4>
            <ul className="list-disc pl-4 text-[11px] text-amber-950/85 space-y-1">
              <li>
                <strong>Dr. Cedric Oakenhart:</strong> Warning that if fresh mint leaves are not dried quickly, the outbreak could double in size.
              </li>
              <li>
                <strong>Sir Goldwhistle:</strong> Authorizing a special treasury fund to purchase clean linen masks for all affected students.
              </li>
              <li>
                <strong>Julie Frost:</strong> Spreading clinic guidelines on identifying bright green nose tips in children.
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-[11px] font-black uppercase tracking-wider text-cyan-900 border-b border-cyan-900/10 pb-0.5 mb-1.5">
              🛠️ Emergency Logistics & Chores
            </h4>
            <ul className="list-disc pl-4 text-[11px] text-amber-950/85 space-y-1">
              <li>
                <strong>Blacksmith Crumblewise:</strong> Building temporary courtyard isolation structures at the Forest Academy.
              </li>
              <li>
                <strong>Mrs. Petalworth:</strong> Leading resident foraging expeditions to harvest secret wild mint patches near riverbanks.
              </li>
              <li>
                <strong>Rowan Thistle:</strong> Setting up clean wooden drying racks to speed up fresh mint extract processing.
              </li>
            </ul>
          </div>
        </div>
      );
    } else {
      return (
        <div className="space-y-4 mt-3 font-sans">
          <div>
            <h4 className="text-[11px] font-black uppercase tracking-wider text-amber-900 border-b border-amber-900/10 pb-0.5 mb-1.5">
              📈 Wharf Commerce & Shipping
            </h4>
            <ul className="list-disc pl-4 text-[11px] text-amber-950/85 space-y-1">
              <li>
                <strong>Sir Goldwhistle:</strong> Welcoming traveling merchants and establishing custom trade rules for the season.
              </li>
              <li>
                <strong>Blacksmith Crumblewise:</strong> Supervising dock expansion at Mossberry Wharf to fit larger cargo ships.
              </li>
              <li>
                <strong>Mossberry Wharf:</strong> Tracking trade tariff rates on exported pine planks and sweet caramel milk.
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-[11px] font-black uppercase tracking-wider text-pink-900 border-b border-pink-900/10 pb-0.5 mb-1.5">
              🧭 Exploration & Border Watch
            </h4>
            <ul className="list-disc pl-4 text-[11px] text-amber-950/85 space-y-1">
              <li>
                <strong>Mrs. Petalworth:</strong> Safeguarding forest paths to protect native flower borders from visitor foot traffic.
              </li>
              <li>
                <strong>Dr. Cedric Oakenhart:</strong> Distributing warm herbal teas to keep cargo handlers and rangers healthy.
              </li>
              <li>
                <strong>Ranger Patrol:</strong> Reporting mysterious white glows and trailing safe night coordinate paths.
              </li>
            </ul>
          </div>
        </div>
      );
    }
  };

  const getDetailedStory = (briefDesc: string, pageType: 'page2' | 'page3' | 'page4'): string => {
    if (pageType === 'page2') {
      return `${briefDesc} To address the mounting civic tension, Forester Sir Goldwhistle has set up a ballot stand in the town square. Blacksmith Crumblewise argues that elevated pathways are essential to support heavier cargo loads from traveling merchants, while Mrs. Petalworth stands firm on protecting the ancient root systems. The council has officially opened voting to all residents, making today's faction ballot a critical turning point for the political landscape of Ganache Grove.`;
    } else if (pageType === 'page3') {
      return `${briefDesc} Dr. Cedric Oakenhart has issued a town-wide warning about seasonal moss sneezles, advising all residents to wash their hands in clean spring water and rest under the canopy. Mrs. Petalworth has offered to guide health assistants to the deep forest meadows to harvest fresh mint leaves. Meanwhile, Forester Sir Goldwhistle is coordinating with local historians to archive the newly discovered Cocoa Era artifacts found submerged near the wharf.`;
    } else {
      return `${briefDesc} Blacksmith Crumblewise has proposed a dock expansion project at Mossberry Wharf to accommodate larger trading vessels coming from Hazelton. Forester Sir Goldwhistle has agreed to review the shipping tariffs to ensure local resources like pine planks and sweet milk remain profitable. Dr. Cedric Oakenhart has also set up a temporary tea stand near the wharf to keep the hardworking cargo handlers refreshed throughout the day.`;
    }
  };

  // Select 3 gossip rumors dynamically
  const allGossip = [...GanacheGroveTownData.gossip];
  const selectedGossip: typeof allGossip = [];
  while (selectedGossip.length < 3 && allGossip.length > 0) {
    const idx = Math.floor(rand() * allGossip.length);
    selectedGossip.push(allGossip.splice(idx, 1)[0]);
  }

  const handleVote = (
    eventId: string,
    optionName: string,
    cost: number,
    coinsGained: number,
    legacyGained: number,
    consequence: string
  ) => {
    if (votedEvents[eventId]) return;
    if (cost > 0 && coins < cost) {
      triggerFeedback('❌ Insufficient Coins to vote on this!');
      return;
    }

    if (cost > 0) {
      spendCoins(cost, `Voted: ${optionName}`);
    }
    if (coinsGained > 0) {
      addCoins(coinsGained, `Event Reward: ${optionName}`);
    }
    if (legacyGained > 0) {
      addLegacy(legacyGained);
    }

    setVotedEvents(prev => ({ ...prev, [eventId]: optionName }));
    triggerFeedback(`🗳️ ${consequence}`);
    
    updateResidentJournal('vote', {
      coins: coinsGained - cost,
      legacy: legacyGained,
      phaseName: 'Faction Vote',
      description: `Cast ballot for "${optionName}" in the town square debate`
    });
  };

  return (
    <div className="w-full h-full flex flex-col justify-between items-center">
      <div className="w-full max-w-7xl flex-grow flex flex-col justify-between min-h-0">
        <GG_TravellerDeck_Header
          title="TOWN CHRONICLE GAZETTE"
          setSubPage={setSubPage}
          popPage={popPage}
        />

        {/* Main Newspaper container */}
        <div className="h-[92vh] mt-0 mb-0 bg-[#f7f2e8] border-[6px] border-amber-950/60 rounded-[2rem] p-6 text-amber-950 font-serif flex flex-col justify-between overflow-hidden shadow-2xl relative min-h-0 select-text">
          
          {/* Newspaper Top Header Section - Common for first page, simplified for others */}
          <div className="text-center border-b-4 border-double border-amber-950/40 pb-3 shrink-0 relative">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-900/80 font-sans block">
              Serving Cocoawood County Since Year 201
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold uppercase tracking-wide text-amber-950 mt-1 font-serif" style={{ fontFamily: FONT }}>
              The Ganache Gazette
            </h1>
            <div className="flex items-center justify-between text-[9px] uppercase tracking-widest font-black text-amber-900/70 mt-2 border-t border-b border-amber-950/20 py-1 px-4 font-sans">
              <span>Vol. 12 • Issue 400</span>
              <span>•</span>
              <span>Morning Edition</span>
              <span>•</span>
              <span>5 Centimes</span>
              <span>•</span>
              <span>{getChocolateDate()}</span>
            </div>
          </div>

          {/* Dynamic Page Scrollable Body */}
          <div ref={scrollRef} className="flex-grow overflow-y-auto newspaper-scrollbar my-4 pr-1 min-h-0">
            
            {/* PAGE 1: FRONT PAGE & LORE CHRONICLE */}
            {paperPage === 1 && (
              <div className="space-y-6 pb-12 min-h-0 animate-fade-in text-amber-950">
                {/* Row 1: Main Headline */}
                <div className="border-b border-amber-950/15 pb-2 text-left">
                  <h2 className="text-3xl font-extrabold uppercase leading-snug tracking-tight text-amber-950 font-serif">
                    {dayContent.headline}
                  </h2>
                </div>

                {/* Row 2: Main Story (2 Columns) */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                  {/* Left Column: Image (5 cols) */}
                  <div className="md:col-span-5 aspect-[3/2] w-full rounded-2xl overflow-hidden border-2 border-amber-950/25 bg-amber-950/5 shadow-md relative shrink-0">
                    {[
                      dayContent.image1 || "/Assets/Ganache Grove/Traveller'sHome_GanacheGrovez_Beginner_Exterior.png",
                      dayContent.image2 || "/Assets/Ganache Grove/Scene_0.1.png"
                    ].map((imgUrl, i) => (
                      <img 
                        key={imgUrl}
                        src={imgUrl} 
                        alt="Walkway Slide" 
                        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${bgSlideIdx === i ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                      />
                    ))}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none z-20" />
                  </div>

                  {/* Right Column: Story Text (7 cols) */}
                  <div className="md:col-span-7 space-y-3 text-left font-serif">
                    <p className="text-[13.5px] leading-relaxed text-amber-950 italic font-semibold border-b border-amber-900/10 pb-2 mb-2 text-justify">
                      <strong>FOREST GROVE</strong> — {dayContent.story}
                    </p>
                    {renderDetailedStoryBlocks(dayContent.day)}

                    {/* CIVIC DISPATCH STATISTICS & INQUIRIES */}
                    <div className="p-3 bg-amber-950/5 border border-amber-950/15 rounded-xl space-y-1.5 select-text text-left">
                      <span className="text-[9px] font-black uppercase tracking-wider text-amber-950 font-sans block border-b border-amber-950/10 pb-0.5">📋 CIVIC DISPATCH STATISTICS & INQUIRIES</span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px] font-sans">
                        <div className="space-y-0.5">
                          <span className="text-amber-900/60 text-[8px] uppercase font-bold block">🔍 The Inquiry: "Who is going to do this?"</span>
                          <p className="text-amber-950 font-semibold font-serif leading-normal">Rowan Thistle & community helpers.</p>
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-amber-900/60 text-[8px] uppercase font-bold block">🛠️ The Remedy: "How to resolve this issue?"</span>
                          <p className="text-amber-950 font-semibold font-serif leading-normal">Acknowledge briefs and complete active tasks.</p>
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-amber-900/60 text-[8px] uppercase font-bold block">🩺 Clinic Advisory: "Healer involvement?"</span>
                          <p className="text-amber-950 font-semibold font-serif leading-normal">Dr. Cedric Oakenhart has prepared mint extracts.</p>
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-amber-900/60 text-[8px] uppercase font-bold block">📊 Civic Census: "What is the consensus?"</span>
                          <p className="text-amber-950 font-semibold font-serif leading-normal">78% support urgent intervention.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Row 3: Editor's Desk & Middle News (3 Columns) */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 border-t border-amber-950/15 pt-4">
                  
                  {/* Column 1: Editor's Desk */}
                  <div className="space-y-2 text-left lg:pr-4 lg:border-r border-amber-950/15">
                    <div className="p-3 bg-amber-950/10 border border-amber-950/20 rounded-xl space-y-1 shadow-sm">
                      <h3 className="text-xs font-black uppercase tracking-wider font-sans text-amber-950 border-b border-amber-950/20 pb-0.5 mb-1">
                        ✍️ Editor's Desk
                      </h3>
                      <p className="text-[10px] leading-relaxed text-amber-900/90 font-serif text-justify italic">
                        "Greetings, citizens! As Ganache Grove experiences record-breaking growth this season, we face new community challenges daily. From walkway debates to dock congestion, anchor Rowan Thistle and reporter Julie Frost are on the scene. Help us shape our sweet county." — The Gazette Board
                      </p>
                    </div>
                  </div>

                  {/* Column 2: Spotlight */}
                  <div className="space-y-2 text-left lg:pr-4 lg:border-r border-amber-950/15">
                    <h3 className="text-sm font-black uppercase tracking-wider font-sans text-amber-950 border-b border-amber-950/20 pb-1 mb-2">
                      🦋 Rare Species Spotlight
                    </h3>
                    <p className="text-[11px] text-amber-900/95 leading-relaxed text-justify font-serif">
                      Sighted near ancient ganache trees. Appears only under white lighting in the deepest green forests. Researchers warn travelers not to feed them cocoa shavings, as they become hyperactive and disrupt local pollination rhythms.
                    </p>
                  </div>

                  {/* Column 3: Bulletins & Weather */}
                  <div className="space-y-4 text-left">
                    <div className="bg-[#f0e8d9] border border-amber-950/20 rounded-xl p-3 flex flex-col gap-1 shadow-inner">
                      <span className="text-[8px] font-black uppercase tracking-[0.2em] text-amber-900 font-sans">Imperial Bulletin</span>
                      <h4 className="text-[11px] font-bold text-amber-950 uppercase border-b border-amber-950/10 pb-0.5">Syrup Logistics</h4>
                      <p className="text-[10px] text-amber-900/80 leading-relaxed text-justify">
                        Molasses volumes spiked 15%. Acknowledge this report to update your passport logs.
                      </p>
                      {!dossierRead ? (
                        <button
                          onClick={handleReadDossier}
                          className="w-full py-1 bg-amber-900 hover:bg-amber-850 text-[#f7f2e8] font-bold rounded-lg text-[9px] font-brand uppercase tracking-wider transition mt-1 shadow"
                          style={{ fontFamily: '"Josefin Sans", sans-serif' }}
                        >
                          Acknowledge
                        </button>
                      ) : (
                        <div className="py-1 bg-emerald-800/10 border border-emerald-800/35 text-emerald-800 text-center rounded-lg text-[10px] font-bold mt-1 font-sans">
                          ✓ Acknowledged (+30🪙)
                        </div>
                      )}
                    </div>

                    <div className="p-3 border border-dashed border-amber-950/30 rounded-xl space-y-1">
                      <span className="text-[8px] font-black uppercase tracking-wider text-amber-900 font-sans block">Weather Forecast</span>
                      <div className="grid grid-cols-2 gap-2 text-[9.5px]">
                        <div>
                          <span className="text-amber-900/50 text-[8px] block font-sans">TODAY</span>
                          <span className="text-amber-950 font-bold">Ganache Drizzle 🌡️</span>
                        </div>
                        <div>
                          <span className="text-amber-900/50 text-[8px] block font-sans">WIND</span>
                          <span className="text-amber-950 font-bold">Cocoa Breeze</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Row: Local History and Classifieds (2 Columns) */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 border-t border-amber-950/15 pt-4">
                  {/* Left: Local History (8 cols) */}
                  <div className="md:col-span-8 space-y-2 text-left md:border-r border-amber-950/15 md:pr-6">
                    <h3 className="text-xs font-black uppercase tracking-wider font-sans text-amber-950 mb-1 flex items-center gap-1">
                      <span>📜</span> Ganache Chronicles: Local History Feature
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[10px] text-amber-900 leading-relaxed text-justify font-serif">
                      <div>
                        <h4 className="font-bold text-amber-950 uppercase mb-0.5">
                          The Great Syrup Flood of Year 104
                        </h4>
                        <p>
                          Few active residents remember when the grand reservoir at Peppermint Peak suffered an expansion rupture. Over three million gallons of warm peppermint syrup cascaded down the gorge, completely submerging the low-lying plains.
                        </p>
                      </div>
                      <div>
                        <p>
                          "We were stuck in our beds for four days," recalls Baker Bramble Mortimer. "Not because of fear, but because the syrup had seeped through the floorboards and glued all our carpets to our slippers." The cleanup effort took six months of warm water washes.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Right: Classifieds (4 cols) */}
                  <div className="md:col-span-4 space-y-2 text-left">
                    <h3 className="text-xs font-black uppercase tracking-wider font-sans text-amber-950 mb-1">
                      📰 Community Classifieds
                    </h3>
                    <div className="space-y-1.5 text-[9.5px] leading-relaxed text-amber-900/90 font-serif">
                      <div className="text-justify border-b border-amber-950/10 pb-1">
                        <p className="font-semibold text-amber-950 uppercase mb-0.5">🔍 Lost: Clockwork Squirrel</p>
                        <p>Answers to 'Nutty'. Last seen chasing acorns near eastern bridge. Reward: 10 coins.</p>
                      </div>
                      <div className="text-justify">
                        <p className="font-semibold text-amber-950 uppercase mb-0.5">📢 For Sale: Copper Cauldron</p>
                        <p>Perfect for slow-cooking ganache. Inquire at Mossberry Lane 14. 50 coins.</p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* PAGE 2: CITIZENS' OPINION BALLOTS & FACTION DEBATES */}
            {paperPage === 2 && (
              <div className="space-y-6 pb-12 min-h-0 animate-fade-in text-amber-950">
                {/* Standard Top Left 3:2 Image Layout */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                  {/* Top Left Image */}
                  <div className="md:col-span-5 aspect-[3/2] w-full rounded-2xl overflow-hidden border-2 border-amber-950/25 bg-amber-950/5 shadow-md relative shrink-0">
                    {[
                      "/Assets/Ganache Grove/Scene_0.1.png",
                      "/Assets/Ganache Grove/Ganache_BeginnerHome_backyard.png"
                    ].map((imgUrl, i) => (
                      <img 
                        key={imgUrl}
                        src={imgUrl} 
                        alt="Debate Slide" 
                        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${bgSlideIdx === i ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                      />
                    ))}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none z-20" />
                  </div>

                  {/* Top Right Title & Description */}
                  <div className="md:col-span-7 space-y-2 flex flex-col justify-between h-full text-left">
                    <div>
                      <h3 className="text-2xl font-bold text-amber-950 uppercase flex items-center gap-1.5 font-serif">
                        {dayContent.page2Title}
                      </h3>
                      <p className="text-xs text-amber-900/80 font-serif leading-relaxed text-justify">
                        {getDetailedStory(dayContent.page2Desc, 'page2')}
                      </p>
                      <p className="text-[10px] italic text-rose-800 font-semibold font-serif mt-1">
                        "If you don't vote, the moths will vote for you." — Ivy Frost's Editorial Column
                      </p>
                    </div>

                    <div className="bg-amber-905/5 border border-dashed border-amber-950/20 rounded-xl p-2.5 mt-1 space-y-0.5">
                      <span className="text-[8px] font-black uppercase tracking-wider text-amber-900 font-sans block">📢 ELECTION FLASH NOTICE</span>
                      <p className="text-[9.5px] text-amber-950/80 leading-normal font-serif">
                        Local registry warns that voting twice on the sugarwood path conservation proposal will result in a penalty of three sticky caramel bars. One citizen, one scoop!
                      </p>
                    </div>

                    <div className="mt-3 p-3.5 bg-amber-950/5 border border-amber-950/10 rounded-xl space-y-2 select-text text-left">
                      <span className="text-[9px] font-black uppercase tracking-wider text-amber-900 font-sans block">📊 Provincial Debate Polls</span>
                      <div className="space-y-1.5 text-[10px]">
                        <div className="flex justify-between items-center">
                          <span className="text-amber-950 font-bold">Sugarwood Conservation:</span>
                          <span className="text-emerald-800 font-extrabold">Rebels Leading (54%)</span>
                        </div>
                        <div className="w-full bg-amber-950/10 rounded-full h-1.5 overflow-hidden">
                          <div className="bg-emerald-600 h-full rounded-full" style={{ width: '54%' }} />
                        </div>
                        <div className="flex justify-between items-center pt-1">
                          <span className="text-amber-950 font-bold">Harbor Commercial Expansion:</span>
                          <span className="text-amber-700 font-extrabold">Bosses Leading (62%)</span>
                        </div>
                        <div className="w-full bg-amber-950/10 rounded-full h-1.5 overflow-hidden">
                          <div className="bg-amber-600 h-full rounded-full" style={{ width: '62%' }} />
                        </div>
                      </div>
                      <p className="text-[9.5px] italic text-amber-900/60 leading-normal mt-1.5">
                        "Elders predict a sweet turnout as residents clash over whether to build candy roads or preserve marshmallow swamps."
                      </p>
                    </div>
                  </div>
                </div>

                {/* Ballot options below */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-amber-950/15 pt-4 text-left">
                  {/* Affair 1: Politics */}
                  <div className="news-card-premium p-4 flex flex-col justify-between text-xs min-h-[220px]">
                    <div>
                      <div className="flex items-center justify-between font-sans mb-2 border-b border-amber-950/10 pb-1">
                        <span className="font-bold text-amber-950">{dayContent.page2AffairTitle}</span>
                        <span className="text-[9px] text-amber-900/50 uppercase">{dayContent.page2AffairCategory}</span>
                      </div>
                      <p className="text-amber-900 leading-relaxed text-[11.5px] font-serif">
                        {dayContent.page2AffairText}
                      </p>
                    </div>
                    <div className="mt-4">
                      {votedEvents[dayContent.day + '-vote'] ? (
                        <div className="p-2 bg-amber-900/5 border border-amber-950/10 text-center rounded-lg text-amber-950 text-[11px] font-sans font-bold">
                          Cast Ballot: <span className="text-emerald-800">{votedEvents[dayContent.day + '-vote']}</span>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => handleVote(dayContent.day + '-vote', dayContent.page2Option1, dayContent.page2Cost1, 0, dayContent.page2Legacy1, dayContent.page2Consequence1)}
                            className="py-1.5 bg-amber-950 hover:bg-amber-900 text-[#f7f2e8] rounded-lg text-[9.5px] font-bold font-sans uppercase transition"
                          >
                            {dayContent.page2Option1} ({dayContent.page2Cost1}🪙)
                          </button>
                          <button
                            onClick={() => handleVote(dayContent.day + '-vote', dayContent.page2Option2, dayContent.page2Cost2, 0, dayContent.page2Legacy2, dayContent.page2Consequence2)}
                            className="py-1.5 bg-red-900 hover:bg-red-800 text-white rounded-lg text-[9.5px] font-bold font-sans uppercase transition"
                          >
                            {dayContent.page2Option2} ({dayContent.page2Cost2}🪙)
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* CIVIC DISPATCH: BALLOT INQUIRIES & CENSUS */}
                  <div className="md:col-span-2 news-card-premium p-4 flex flex-col justify-between text-xs min-h-[220px]">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-amber-950 font-sans block border-b border-amber-950/10 pb-1 mb-2">
                        📋 CURRENT BALLOT INQUIRIES & CENSUS
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[10px] font-sans">
                        <div className="space-y-1">
                          <span className="text-amber-900/60 text-[8px] uppercase font-bold block">🔍 Faction Inquiry: "Why vote on this?"</span>
                          <p className="text-amber-950 font-semibold font-serif leading-normal">To align resources with the winning community proposal.</p>
                        </div>
                        <div className="space-y-1">
                          <span className="text-amber-900/60 text-[8px] uppercase font-bold block">⚖️ Project Impact: "What changes permanently?"</span>
                          <p className="text-amber-950 font-semibold font-serif leading-normal">Winning initiatives permanently alter town decorations and unlocks.</p>
                        </div>
                        <div className="space-y-1">
                          <span className="text-amber-900/60 text-[8px] uppercase font-bold block">🗳️ Voter Turnout: "Who has participated?"</span>
                          <p className="text-amber-950 font-semibold font-serif leading-normal">84% of local gnomes and merchants have cast ballots.</p>
                        </div>
                        <div className="space-y-1">
                          <span className="text-amber-900/60 text-[8px] uppercase font-bold block">📈 Standing Reward: "What do contributors gain?"</span>
                          <p className="text-amber-950 font-semibold font-serif leading-normal">Earn +10 to +30 Legacy points and shape town history.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* PAGE 3: GOSSIP, HEALTH CLINIC & ARCHAEOLOGY */}
            {paperPage === 3 && (
              <div className="space-y-6 pb-12 min-h-0 animate-fade-in text-amber-950">

                {/* Standard Top Left 3:2 Image Layout */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                  {/* Top Left Image */}
                  <div className="md:col-span-5 aspect-[3/2] w-full rounded-2xl overflow-hidden border-2 border-amber-950/25 bg-amber-950/5 shadow-md relative shrink-0">
                    {[
                      "/Assets/Ganache Grove/GanacheGrove_GossipCorner.png",
                      "/Assets/Ganache Grove/Ganache_BeginnerHome_Bedroom.png"
                    ].map((imgUrl, i) => (
                      <img 
                        key={imgUrl}
                        src={imgUrl} 
                        alt="Gossip Slide" 
                        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${bgSlideIdx === i ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                      />
                    ))}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none z-20" />
                  </div>

                  {/* Top Right Title & Description */}
                  <div className="md:col-span-7 space-y-2 text-left">
                    <h3 className="text-2xl font-bold text-amber-950 uppercase flex items-center gap-1.5 font-serif">
                      {dayContent.page3Title}
                    </h3>
                    <p className="text-xs text-amber-900/80 font-serif leading-relaxed text-justify">
                      {getDetailedStory(dayContent.page3Desc, 'page3')}
                    </p>
                    <p className="text-[10px] italic text-emerald-800 font-semibold font-serif mt-1">
                      "Clean hands make sweet candy; dirty hands make spore sneezles." — Dr. Cedric's Daily Motto
                    </p>
                    <div className="bg-emerald-950/5 border border-emerald-900/20 rounded-xl p-3 mt-3 space-y-1">
                      <span className="text-[8.5px] font-black uppercase tracking-wider text-emerald-900 font-sans block">⚠️ SPORE BULLETIN</span>
                      <p className="text-[10px] text-amber-955/80 leading-relaxed font-serif text-justify">
                        Health wardens advise travelers that looking directly at glowing forest mushrooms for more than 40 seconds may induce temporary peppermint hallucinations. Read below for full clinic updates.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 border-t border-amber-950/15 pt-4 text-left">
                  {/* Gossip & Whispers Column (Left 6 Columns) */}
                  <div className="lg:col-span-6 space-y-4 pr-0 lg:pr-4 lg:border-r border-amber-950/15">
                    <h3 className="text-sm font-black uppercase border-b border-amber-950/20 pb-1 tracking-wider font-sans flex items-center gap-1.5">
                      <span>👂</span> Gossip & Goosebump Findings
                    </h3>
                    
                    <div className="space-y-3 font-sans leading-relaxed text-[11px]">
                      {selectedGossip.map((g, idx) => (
                        <div key={g.id} className="p-3 bg-amber-900/5 border border-amber-950/10 rounded-xl">
                          <span className="font-bold text-amber-950 text-[10px] block">📢 RUMOUR #{idx + 1} (via {g.source})</span>
                          <p className="text-amber-900/80 mt-1 font-serif text-[11px] leading-normal">
                            {g.rumor}
                          </p>
                        </div>
                      ))}

                      {/* Goosebump Findings & Scandals */}
                      <div className="p-3 bg-amber-900/5 border border-amber-950/10 rounded-xl mt-3 space-y-2.5">
                        <span className="font-black text-amber-950 text-[10px] block border-b border-amber-950/10 pb-1">👻 Town Scandals & Goosebump Findings (by Julie Frost)</span>
                        
                        <div className="space-y-1">
                          <h5 className="font-bold text-red-955 text-[10px]">The Bakery Ghost Peaks:</h5>
                          <p className="text-amber-900/85 font-serif text-[10px] leading-relaxed text-justify">
                            "Reports say a flour-covered apparition has been rearranging Mortimer's rolling pins at 3 AM. Sir Goldwhistle suspects it is Pipkin in a sheet, but Dr. Cedric insists the ghostly footprints smell strongly of cinnamon!"
                          </p>
                        </div>

                        <div className="space-y-1">
                          <h5 className="font-bold text-red-955 text-[10px]">Sir Goldwhistle's Secret Tea Tithe:</h5>
                          <p className="text-amber-900/85 font-serif text-[10px] leading-relaxed text-justify">
                            "Leaked ledger logs suggest our chief auditor spends 12% of collected town taxes on premium imported Earl Grey tea. Sir Goldwhistle denies this, claiming it is 'essential office lubrication.'"
                          </p>
                        </div>

                        <div className="space-y-1">
                          <h5 className="font-bold text-red-955 text-[10px]">Glowcap Moth Messages:</h5>
                          <p className="text-amber-900/85 font-serif text-[10px] leading-relaxed text-justify">
                            "Recent reports of glowcap moths flying in binary formations. Julie Frost's findings suggest they are sending messages to Mrs. Petalworth's shop. A real goosebump finding!"
                          </p>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Health Watch: Clinic Update (Right 6 Columns) */}
                  <div className="lg:col-span-6 news-card-premium p-4 space-y-4">
                    <h3 className="text-sm font-black uppercase border-b border-amber-950/20 pb-1 tracking-wider font-sans flex items-center gap-1.5">
                      <span>🩺</span> Health Watch: Clinic Update
                    </h3>
                    <div className="space-y-2 text-[11px] text-amber-900 font-serif leading-relaxed text-justify">
                      <div className="flex gap-2.5 items-start p-2.5 bg-amber-900/5 border border-amber-950/10 rounded-xl">
                        <span className="text-2xl font-sans">🩺</span>
                        <div>
                          <span className="font-bold block text-amber-950 text-[11px] font-sans">Dr. Cedric Oakenhart</span>
                          <span className="text-[9px] uppercase tracking-wider text-amber-800/80 font-bold font-sans">Town Healer</span>
                        </div>
                      </div>
                      <p>
                        "Spore transfer is a natural part of forest life, but do wash your hands, dear. Here, drink this warm mint honey tea and rest under the canopy." Cases of Moss Sneezles remain stable.
                      </p>
                      <div className="text-[10px] bg-amber-950/5 p-2 rounded-lg mt-1 border border-amber-950/10 font-sans">
                        <span className="font-bold text-amber-950 block text-[9.5px]">💊 OUTBREAK WARNING</span>
                        <ul className="list-disc pl-4 space-y-0.5 mt-0.5 text-amber-900/80 text-[10px]">
                          <li>Scented sneezing, green nose tips.</li>
                          <li>Treatment: Mint Tea & Forest Rest.</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Archaeological Corner block */}
                <div className="border-t-4 border-double border-amber-950/20 pt-6 text-left">
                  <h3 className="text-sm font-black uppercase border-b border-amber-950/20 pb-1 tracking-wider font-sans mb-3 flex items-center gap-1.5">
                    <span>🔍</span> Archaeological & Historical Lore
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 text-[11.5px] text-amber-900 leading-relaxed font-serif">
                    <div className="md:col-span-7 news-card-premium p-4 space-y-1.5">
                      <span className="text-[9px] font-bold text-amber-800 uppercase block font-sans">Found under the Ganache River Bed</span>
                      <h5 className="font-serif font-bold text-amber-950 text-xs">{dayContent.page3LoreTitle}</h5>
                      <p className="text-[10.5px] text-amber-900/80 leading-normal">
                        {dayContent.page3LoreText}
                      </p>
                    </div>
                    <div className="md:col-span-5 ad-clipping-dashed p-4 flex flex-col justify-center text-center">
                      <span className="text-[10px] font-sans font-bold text-amber-950 block">📚 LOCAL LORE FACT</span>
                      <p className="text-[11px] text-amber-900/70 leading-relaxed mt-1">
                        {dayContent.page3LoreFact}
                      </p>
                    </div>
                  </div>
                </div>

                {/* HEALTH CLINIC & DISCOVERY INQUIRIES */}
                <div className="mt-4 news-card-premium p-4 space-y-1.5 text-left">
                  <span className="text-[9px] font-black uppercase tracking-wider text-amber-950 font-sans block border-b border-amber-950/10 pb-0.5">📋 HEALTH CLINIC & DISCOVERY DISPATCH</span>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-[10px] font-sans">
                    <div className="space-y-0.5">
                      <span className="text-amber-900/60 text-[8px] uppercase font-bold block">🔍 Health Inquiry: "Is moss fever contagious?"</span>
                      <p className="text-amber-950 font-semibold font-serif leading-normal">Yes, spreads via canopy spore inhalation.</p>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-amber-900/60 text-[8px] uppercase font-bold block">🌿 Remedy: "How is it treated?"</span>
                      <p className="text-amber-950 font-semibold font-serif leading-normal">Dr. Cedric Oakenhart prescribes mint tea & cottage rest.</p>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-amber-900/60 text-[8px] uppercase font-bold block">🏺 Artifact Discovery: "What was unearthed?"</span>
                      <p className="text-amber-950 font-semibold font-serif leading-normal">Ancient bronze syrup stirrers dating to the Cocoa Era.</p>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-amber-900/60 text-[8px] uppercase font-bold block">📊 Town Health Rate: "General wellness index?"</span>
                      <p className="text-amber-950 font-semibold font-serif leading-normal">92% active recovery; zero critical cases reported.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* PAGE 4: HARBOR MARKET, ADVERTISEMENTS & LEISURE */}
            {paperPage === 4 && (
              <div className="space-y-6 pb-12 min-h-0 animate-fade-in text-amber-950">

                {/* Standard Top Left 3:2 Image Layout */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                  {/* Top Left Image */}
                  <div className="md:col-span-5 aspect-[3/2] w-full rounded-2xl overflow-hidden border-2 border-amber-950/25 bg-amber-950/5 shadow-md relative shrink-0">
                    {[
                      "/Assets/Ganache Grove/GanacheGrove_marketSquare.png",
                      "/Assets/Ganache Grove/GanacheGrove_marketSquare1.png"
                    ].map((imgUrl, i) => (
                      <img 
                        key={imgUrl}
                        src={imgUrl} 
                        alt="Market Slide" 
                        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${bgSlideIdx === i ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                      />
                    ))}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none z-20" />
                  </div>

                  {/* Top Right Title & Description */}
                  <div className="md:col-span-7 space-y-2 text-left">
                    <h3 className="text-2xl font-bold text-amber-950 uppercase flex items-center gap-1.5 font-serif">
                      {dayContent.page4Title}
                    </h3>
                    <p className="text-xs text-amber-900/80 font-serif leading-relaxed text-justify">
                      {getDetailedStory(dayContent.page4Desc, 'page4')}
                    </p>
                    <p className="text-[10px] italic text-amber-800 font-semibold font-serif mt-1">
                      "A coin saved at the wharf is a coin you can spend on double-glazed doughnuts." — Old Wharf Proverb
                    </p>
                    <div className="bg-amber-950/5 border border-amber-900/20 rounded-xl p-3 mt-3 space-y-1">
                      <span className="text-[8.5px] font-black uppercase tracking-wider text-amber-900 font-sans block">⚓ MARITIME MEMO</span>
                      <p className="text-[10px] text-amber-955/80 leading-relaxed font-serif text-justify">
                        Due to high tide and molasses leakage near Wharf 3, all docking vessels are requested to coat their rudders in cocoa butter to prevent sticky drag. Check today's rate shifts below.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 border-t border-amber-950/15 pt-4 text-left">
                  {/* Left Column: Commodity Index Table (6 columns) */}
                  <div className="lg:col-span-6 news-card-premium p-4 space-y-4 pr-0 lg:pr-4 lg:border-r border-amber-950/15">
                    <h3 className="text-sm font-black uppercase border-b border-amber-950/20 pb-1 tracking-wider font-sans flex items-center gap-1.5">
                      <span>📈</span> Commodity Exchange Index
                    </h3>
                    <p className="text-[11px] text-amber-900/70 font-serif leading-relaxed">
                      Rates at Mossberry Wharf. Subject to daily tariff adjustments.
                    </p>
                    <div className="overflow-hidden border border-amber-950/20 rounded-xl bg-amber-950/5">
                      <table className="w-full text-left text-[11px] font-serif border-collapse">
                        <thead>
                          <tr className="bg-amber-950/10 text-amber-950 font-sans text-[10px] font-black uppercase tracking-wider border-b border-amber-950/20">
                            <th className="p-2.5">Resource</th>
                            <th className="p-2.5 text-right">Rate</th>
                            <th className="p-2.5 text-right">Shift</th>
                          </tr>
                        </thead>
                        <tbody>
                          {dayContent.page4CommodityRates.map((r, i) => (
                            <tr key={i} className="border-b border-amber-950/10">
                              <td className="p-2.5 font-bold">{r.resource}</td>
                              <td className="p-2.5 text-right">{r.rate}</td>
                              <td className={`p-2.5 text-right font-bold ${r.direction === 'up' ? 'text-emerald-700' : r.direction === 'down' ? 'text-red-700' : 'text-amber-900'}`}>
                                {r.shift}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Right Column: Classifieds & Advertisements (6 columns) */}
                  <div className="lg:col-span-6 space-y-4">
                    <h3 className="text-sm font-black uppercase border-b border-amber-950/20 pb-1 tracking-wider font-sans flex items-center gap-1.5">
                      <span>📰</span> Classifieds & Ads
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="ad-clipping-premium p-3 flex flex-col justify-between text-center relative group">
                        <span className="text-[8px] font-bold text-amber-900/60 uppercase tracking-widest block mb-1">PROVINCIAL AD</span>
                        <h4 className="text-[11px] font-extrabold uppercase font-serif text-amber-950">{dayContent.page4Classified1Title}</h4>
                        <p className="text-[10px] text-amber-900/80 leading-snug mt-1 font-serif">
                          "{dayContent.page4Classified1Text}"
                        </p>
                        <span className="text-[9px] font-bold text-amber-950 bg-amber-950/10 rounded-full px-2 py-0.5 mt-2 inline-block self-center">
                          {dayContent.page4Classified1Price}
                        </span>
                      </div>

                      <div className="ad-clipping-dashed p-3 flex flex-col justify-between text-center">
                        <span className="text-[8px] font-bold text-amber-900/60 uppercase tracking-widest block mb-1 font-sans">SERVICES</span>
                        <h4 className="text-[11px] font-extrabold uppercase font-serif text-amber-950">{dayContent.page4Classified2Title}</h4>
                        <p className="text-[10px] text-amber-900/80 leading-snug mt-1 font-serif">
                          "{dayContent.page4Classified2Text}"
                        </p>
                        <span className="text-[9px] font-bold italic text-amber-950 mt-2 block font-sans">
                          {dayContent.page4Classified2Contact}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* COMMERCE & TRADING STATISTICS */}
                <div className="mt-4 news-card-premium p-4 space-y-1.5 text-left">
                  <span className="text-[9px] font-black uppercase tracking-wider text-amber-950 font-sans block border-b border-amber-950/10 pb-0.5">📋 COMMERCE & WHARF TRADING DISPATCH</span>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-[10px] font-sans">
                    <div className="space-y-0.5">
                      <span className="text-amber-900/60 text-[8px] uppercase font-bold block">🔍 Market Inquiry: "Why are rates shifting?"</span>
                      <p className="text-amber-950 font-semibold font-serif leading-normal">Due to import traffic and seasonal cargo demands.</p>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-amber-900/60 text-[8px] uppercase font-bold block">⛵ Wharf Remedy: "How to get best deals?"</span>
                      <p className="text-amber-950 font-semibold font-serif leading-normal">Monitor shifts daily and sell when indicators are green.</p>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-amber-900/60 text-[8px] uppercase font-bold block">📦 Bulk Shipments: "Who is sponsoring docks?"</span>
                      <p className="text-amber-950 font-semibold font-serif leading-normal">Imperial logistics brokers from Toffee Town.</p>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-amber-900/60 text-[8px] uppercase font-bold block">📊 Daily Volume: "Total cargo cleared?"</span>
                      <p className="text-amber-950 font-semibold font-serif leading-normal">1,420 crates processed in the last 24 hours.</p>
                    </div>
                  </div>
                </div>

                {/* Leisure separator */}
                <div className="border-t-4 border-double border-amber-950/20 pt-6 text-left">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Interactive Riddle (7 columns) */}
                    <div className="lg:col-span-7 space-y-3">
                      <h3 className="text-sm font-black uppercase border-b border-amber-950/20 pb-1 tracking-wider font-sans flex items-center gap-1.5">
                        <span>🧩</span> Interactive Broadside Puzzle
                      </h3>
                      <div className="news-card-premium p-4 space-y-3">
                        <span className="text-[10px] font-sans font-bold text-amber-950 uppercase tracking-wider block">THE COCOA Riddle:</span>
                        <p className="text-xs font-serif text-amber-900 leading-relaxed">
                          "I am dark or milk, sweet or bittersweet. I begin in a pod on a tropical tree, get crushed and mixed to bring you glee. What am I?"
                        </p>
                        
                        <div className="space-y-2 mt-2">
                          {riddleSolved ? (
                            <div className="p-3 bg-emerald-800/10 border border-emerald-800/35 text-emerald-800 text-center rounded-xl text-xs font-bold font-sans">
                              ✓ Puzzle Solved! Answer: Chocolate (+15 Cocoa Coins claimed)
                            </div>
                          ) : (
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={riddleAnswer}
                                onChange={(e) => setRiddleAnswer(e.target.value)}
                                placeholder="Type answer here..."
                                className="flex-1 px-3 py-1.5 bg-white border border-amber-950/20 rounded-xl text-xs text-amber-950 font-sans focus:outline-none"
                              />
                              <button
                                onClick={() => {
                                  const clean = riddleAnswer.trim().toLowerCase();
                                  if (clean === 'chocolate' || clean === 'cocoa') {
                                    setRiddleSolved(true);
                                    addCoins(5, 'Solved Cocoa Gazette Riddle');
                                    triggerFeedback('🎉 Correct! You solved the Cocoa Riddle! (+5🪙)');
                                    
                                    updateResidentJournal('riddle', {
                                      coins: 5,
                                      legacy: 0,
                                      phaseName: 'Puzzle Solved',
                                      description: 'Solved the interactive broadside puzzle in the morning newspaper'
                                    });
                                  } else {
                                    triggerFeedback('❌ Incorrect answer. Keep thinking! Hint: Starts with C.');
                                  }
                                }}
                                className="px-4 py-1.5 bg-amber-950 hover:bg-amber-900 text-[#f7f2e8] rounded-xl text-xs font-bold font-sans uppercase transition"
                              >
                                Submit
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Cosmic Horoscope (5 columns) */}
                    <div className="lg:col-span-5 news-card-premium p-4 space-y-3">
                      <h3 className="text-sm font-black uppercase border-b border-amber-950/20 pb-1 tracking-wider font-sans flex items-center gap-1.5">
                        <span>✨</span> Cosmic Horoscopes
                      </h3>
                      <div className="space-y-2.5 text-[10.5px] font-serif text-amber-900">
                        <div className="border-b border-amber-950/10 pb-1.5">
                          <span className="font-bold text-amber-950 block font-sans">🍫 TRUFFLE (Jan 20 – Feb 18)</span>
                          <p className="text-amber-900/80 leading-normal">Incoming coins are coming! Stay away from warm stoves.</p>
                        </div>
                        <div>
                          <span className="font-bold text-amber-950 block font-sans">🍬 MARSHMALLOW (Feb 19 – Mar 20)</span>
                          <p className="text-amber-900/80 leading-normal">You are feeling soft and resilient today.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* PAGE 5: TOWN CLASSIFIEDS & FESTIVALS (Raffle, Cook-off, Gossip) */}
            {paperPage === 5 && (
              <div className="space-y-6 pb-12 min-h-0 animate-fade-in text-amber-950">
                {/* Header Grid */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                  <div className="md:col-span-5 aspect-[3/2] w-full rounded-2xl overflow-hidden border-2 border-amber-950/25 bg-amber-950/5 shadow-md relative shrink-0">
                    <img 
                      src="/Assets/Ganache Grove/Scene_0.1.png" 
                      alt="Festival Square" 
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
                  </div>
                  <div className="md:col-span-7 space-y-2 text-left">
                    <h3 className="text-2xl font-bold text-amber-950 uppercase flex items-center gap-1.5 font-serif">
                      🎪 Town Classifieds & Festivals
                    </h3>
                    <p className="text-xs text-amber-900/80 font-serif leading-relaxed text-justify">
                      Welcome to the County Engagement Board! Here, the Ganache Grove Town Hall sponsors crowd-pulling festivals, daily raffle drawings, and community gossip submissions. Participate to earn extra pocket coins, win premium gems, and spread sweet rumors across Toffee Towns!
                    </p>
                    <div className="bg-amber-950/5 border border-amber-900/20 rounded-xl p-3 mt-3 space-y-1">
                      <span className="text-[8.5px] font-black uppercase tracking-wider text-amber-900 font-sans block">🎟️ FESTIVAL MEMO</span>
                      <p className="text-[10px] text-amber-955/80 leading-relaxed font-serif text-justify">
                        All tickets purchased at the Admissions Desk are final. Cook-off participation is limited to one entry per cycle. Gossip submissions are audited by the Town Clerk before printing.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 border-t border-amber-950/15 pt-4 text-left">
                  
                  {/* Left Column: Raffle Draw Console (6 columns) */}
                  <div className="lg:col-span-6 space-y-4 pr-0 lg:pr-4 lg:border-r border-amber-950/15">
                    <h3 className="text-sm font-black uppercase border-b border-amber-950/20 pb-1 tracking-wider font-sans flex items-center gap-1.5">
                      <span>🎟️</span> Daily Dispatch Raffle Draw
                    </h3>
                    <p className="text-[11px] text-amber-900/70 font-serif leading-relaxed">
                      Exchange 10 soft coins for a County Raffle Ticket. Draw to win Coins, Gems, or wood!
                    </p>

                    <div className="news-card-premium p-4 space-y-4">
                      <div className="flex justify-between items-center text-xs">
                        <div>
                          <span className="font-bold text-amber-950 block">Your Raffle Tickets:</span>
                          <span className="text-emerald-800 font-extrabold font-mono text-sm">{raffleTickets} Tickets</span>
                        </div>
                        <div>
                          <span className="font-bold text-amber-950 block">Your Coffer Balance:</span>
                          <span className="text-amber-900 font-extrabold font-mono text-sm">{coins} 🪙 / {gems} 💎</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() => {
                            if (coins < 10) {
                              triggerFeedback('❌ Insufficient Coins to purchase a raffle ticket!');
                              return;
                            }
                            if (buyRaffleTicket(10)) {
                              triggerFeedback('🎉 Purchased 1 Raffle Ticket! (-10🪙)');
                              cozyAudio.playCoins();
                            }
                          }}
                          className="py-2.5 bg-amber-950 hover:bg-amber-900 text-[#f7f2e8] rounded-xl text-xs font-bold font-sans uppercase transition shadow-sm"
                        >
                          Buy Ticket (10 🪙)
                        </button>

                        <button
                          onClick={() => {
                            if (raffleTickets <= 0) {
                              triggerFeedback('❌ You need at least 1 Raffle Ticket to draw!');
                              return;
                            }
                            const res = drawRaffle();
                            if (res.success) {
                              triggerFeedback(res.message);
                              cozyAudio.playChime();
                              updateResidentJournal('dispatch', {
                                coins: res.reward === 'coins' ? 100 : 0,
                                legacy: 0,
                                phaseName: 'Raffle Draw',
                                description: res.message
                              });
                            } else {
                              triggerFeedback(`❌ ${res.message}`);
                            }
                          }}
                          className={`py-2.5 rounded-xl text-xs font-bold font-sans uppercase transition shadow-sm ${
                            raffleTickets > 0
                              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-110 text-white'
                              : 'bg-neutral-300 text-neutral-500 cursor-not-allowed border border-neutral-400/20'
                          }`}
                          disabled={raffleTickets <= 0}
                        >
                          Draw Prize! 🎲
                        </button>
                      </div>

                      <div className="text-[10px] bg-amber-950/5 p-2 rounded-lg border border-amber-950/10 text-amber-900/80 leading-normal font-sans">
                        <span className="font-bold text-amber-950 block text-[9.5px] mb-0.5">🏆 Possible Prize Tiers:</span>
                        <ul className="list-disc pl-4 space-y-0.5 text-[9.5px]">
                          <li>💎 15 or 30 Gems (Premium Currency)</li>
                          <li>🪙 100, 150, or 200 Cocoa Coins</li>
                          <li>🌲 Structural Wood Planks (Participating Credit)</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Cook-off & Gossip Box (6 columns) */}
                  <div className="lg:col-span-6 space-y-6">
                    {/* The Great Molasses Cook-off */}
                    <div className="space-y-3">
                      <h3 className="text-sm font-black uppercase border-b border-amber-950/20 pb-1 tracking-wider font-sans flex items-center gap-1.5">
                        <span>👩‍🍳</span> The Great Molasses Cook-off
                      </h3>
                      <p className="text-[11px] text-amber-900/70 font-serif leading-relaxed">
                        Mix base chocolates and infusions, name your recipe, and submit it to earn +10 Coins!
                      </p>

                      <div className="news-card-premium p-4 space-y-3">
                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <div>
                            <label className="font-bold text-amber-950 block mb-1">Base Chocolate:</label>
                            <select
                              value={cookoffBase}
                              onChange={(e) => setCookoffBase(e.target.value)}
                              className="w-full px-3 py-1.5 bg-white border border-amber-950/20 rounded-xl text-amber-950 focus:outline-none"
                            >
                              <option value="Ganache">Ganache</option>
                              <option value="Toffee">Toffee</option>
                              <option value="Caramel">Caramel</option>
                            </select>
                          </div>
                          <div>
                            <label className="font-bold text-amber-950 block mb-1">Infusion:</label>
                            <select
                              value={cookoffInfusion}
                              onChange={(e) => setCookoffInfusion(e.target.value)}
                              className="w-full px-3 py-1.5 bg-white border border-amber-950/20 rounded-xl text-amber-950 focus:outline-none"
                            >
                              <option value="Honeyberry">Honeyberry</option>
                              <option value="Sea Salt">Sea Salt</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="font-bold text-amber-950 block mb-1 text-xs">Recipe Name:</label>
                          <input
                            type="text"
                            value={cookoffName}
                            onChange={(e) => setCookoffName(e.target.value)}
                            placeholder="e.g. Grandma's Salted Glaze..."
                            className="w-full px-3 py-1.5 bg-white border border-amber-950/20 rounded-xl text-xs text-amber-950 focus:outline-none"
                          />
                        </div>

                        <button
                          onClick={() => {
                            if (!cookoffName.trim()) {
                              triggerFeedback('❌ Please give your recipe a name!');
                              return;
                            }
                            addCoins(3, `Molasses Cook-off entry: ${cookoffName}`);
                            triggerFeedback(`👩‍🍳 Recipe "${cookoffName}" submitted successfully! You earned +3🪙!`);
                            cozyAudio.playCoins();
                            
                            updateResidentJournal('chore', {
                                coins: 3,
                                legacy: 0,
                                phaseName: 'Molasses Cook-off',
                                description: `Submitted recipe "${cookoffName}" (Base: ${cookoffBase}, Infusion: ${cookoffInfusion}) to the Great Molasses Cook-off`
                            });

                            setCookoffName('');
                          }}
                          className="w-full py-2 bg-emerald-800 hover:bg-emerald-700 text-[#f7f2e8] rounded-xl text-xs font-bold font-sans uppercase transition shadow-sm"
                        >
                          Submit Recipe (+3 🪙)
                        </button>
                      </div>
                    </div>

                    {/* Gazette Gossip Box */}
                    <div className="space-y-3">
                      <h3 className="text-sm font-black uppercase border-b border-amber-950/20 pb-1 tracking-wider font-sans flex items-center gap-1.5">
                        <span>🤫</span> Gazette Gossip Box
                      </h3>
                      <p className="text-[11px] text-amber-900/70 font-serif leading-relaxed">
                        Submit a custom rumor to the Town Clerk. Fun rumors will be printed in tomorrow's edition!
                      </p>

                      <div className="news-card-premium p-4 space-y-3">
                        <textarea
                          value={gossipRumor}
                          onChange={(e) => setGossipRumor(e.target.value)}
                          placeholder="Type your rumor or town gossip here..."
                          rows={2}
                          className="w-full px-3 py-2 bg-white border border-amber-950/20 rounded-xl text-xs text-amber-950 focus:outline-none resize-none font-sans"
                        />

                        <button
                          onClick={() => {
                            if (!gossipRumor.trim()) {
                              triggerFeedback('❌ Gossip rumor cannot be empty!');
                              return;
                            }
                            triggerFeedback('🤫 Gossip submitted! The Town Clerk will audit it for the next issue.');
                            cozyAudio.playClick();
                            
                            updateResidentJournal('briefing', {
                              coins: 0,
                              legacy: 0,
                              phaseName: 'Gossip Submission',
                              description: `Submitted a custom rumor: "${gossipRumor}"`
                            });

                            setGossipRumor('');
                          }}
                          className="w-full py-2 bg-amber-950 hover:bg-amber-900 text-[#f7f2e8] rounded-xl text-xs font-bold font-sans uppercase transition shadow-sm"
                        >
                          Submit Gossip
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Paper Page Turner and Footer bar */}
          <div className="border-t-2 border-double border-amber-950/30 pt-3 mt-2 flex items-center justify-between shrink-0">
            <div className="flex gap-2">
              <button
                onClick={() => setPaperPage(prev => (prev > 1 ? (prev - 1) as any : 1))}
                disabled={paperPage === 1}
                className={`px-3 py-1 bg-amber-950 hover:bg-amber-900 text-[#f7f2e8] text-[9px] font-brand uppercase tracking-wider rounded-lg transition ${
                  paperPage === 1 ? 'opacity-30 cursor-not-allowed' : ''
                }`}
                style={{ fontFamily: '"Josefin Sans", sans-serif' }}
              >
                ← Prev Page
              </button>
              <button
                onClick={() => setPaperPage(prev => (prev < 5 ? (prev + 1) as any : 5))}
                disabled={paperPage === 5}
                className={`px-3 py-1 bg-amber-950 hover:bg-amber-900 text-[#f7f2e8] text-[9px] font-brand uppercase tracking-wider rounded-lg transition ${
                  paperPage === 5 ? 'opacity-30 cursor-not-allowed' : ''
                }`}
                style={{ fontFamily: '"Josefin Sans", sans-serif' }}
              >
                Next Page →
              </button>
            </div>

            <span className="text-[10px] font-sans font-bold text-amber-900/50 uppercase tracking-wider">
              Page {paperPage} of 5
            </span>

            <span className="text-[9px] font-sans font-bold text-amber-900/40 uppercase tracking-widest hidden sm:inline">
              "All the Chocolate News, Freshly Churned"
            </span>
          </div>
        </div>
      </div>
      <style>{`
        .newspaper-scrollbar::-webkit-scrollbar { display: none; }
        
        .news-card-premium {
          background-color: #FAF6EE;
          border: 1px solid rgba(120, 53, 15, 0.25);
          box-shadow: inset 0 0 30px rgba(120, 53, 15, 0.04), 0 2px 5px rgba(0, 0, 0, 0.05);
          position: relative;
          border-radius: 16px;
          transition: all 0.3s ease;
        }
        .news-card-premium::before {
          content: '';
          position: absolute;
          inset: 4px;
          border: 1px dashed rgba(120, 53, 15, 0.15);
          border-radius: 12px;
          pointer-events: none;
        }
        .news-card-premium:hover {
          transform: translateY(-2px);
          box-shadow: inset 0 0 40px rgba(120, 53, 15, 0.08), 0 6px 15px rgba(120, 53, 15, 0.12);
          border-color: rgba(120, 53, 15, 0.45);
        }

        .gossip-scrap {
          background-color: #fdfcf7;
          border: 1px solid rgba(120, 53, 15, 0.15);
          border-left: 4px solid #b45309;
          border-radius: 6px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.03);
          transition: all 0.2s ease;
        }
        .gossip-scrap:hover {
          background-color: #fffdfa;
          border-left-color: #d97706;
          transform: translateX(2px);
        }

        .scandal-card {
          background-color: #fffbf4;
          border: 1px solid rgba(120, 53, 15, 0.2);
          border-radius: 12px;
          box-shadow: inset 0 0 15px rgba(180, 83, 9, 0.03);
        }

        .ad-clipping-premium {
          background-color: #FAF6EE;
          border: 2px solid #78350f;
          border-radius: 12px;
          box-shadow: 1px 2px 4px rgba(0,0,0,0.06);
          transition: all 0.3s ease;
        }
        .ad-clipping-premium:hover {
          transform: scale(1.02);
          box-shadow: 2px 4px 8px rgba(120, 53, 15, 0.15);
        }

        .ad-clipping-dashed {
          background-color: #fcfbfa;
          border: 2px dashed rgba(120, 53, 15, 0.3);
          border-radius: 12px;
          box-shadow: inset 0 0 8px rgba(0,0,0,0.02);
          transition: all 0.3s ease;
        }
        .ad-clipping-dashed:hover {
          transform: scale(1.02);
          border-color: rgba(120, 53, 15, 0.5);
        }
      `}</style>
    </div>
  );
};
