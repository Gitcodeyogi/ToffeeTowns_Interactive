import React, { useEffect, useState } from 'react';
import { useTTStore } from '../../../store/useTTStore';
import { FONT, type SubPage } from '../../../lib/uiConstants';
import { type WorldSimulationEvent } from '../../../store/slices/worldTimeSlice';

interface Props {
  pushPage: (page: SubPage) => void;
}

const COMPLETED_SUMMARIES: Record<string, string> = {
  // Sunny
  'Ganache Market Opens': 'The market opened successfully this morning. Baker Bramble Mortimer and local merchants completed stocking raw cane sugar and flour.',
  'Junia walks to Academy': 'Dr. Cedric Oakenhart and Junia completed the apothecary preparation class, teaching young citizens about herbal sanitation.',
  'Theatre tickets go on sale': 'Admissions box office successfully sold out today\'s tickets. The audience seats are fully reserved.',
  'Butter prices increase': 'Heavy butter demand inflated prices, but the trade hub completed all cargo balances.',
  'Lanterns light up': 'Path lanterns were lit on schedule, securing bright light for evening traveler curfews.',
  'Honeyblueberry play begins': 'The curtain rose and the cast completed a splendid re-enactment of the Honeyberry Chronicles.',
  'Train departs': 'The Monorail Night Express departed from central terminals safely without any gear issues.',
  'Town Curfew Begins': 'The curfew guidelines were established. Residents retired to their cottages for peaceful rest.',
  
  // Stormy
  'Heavy Rain Storm': 'A dense storm passed through, flooding local paths with mud and checking all walkway drainages.',
  'Transit Delayed': 'Wet rails forced a monorail delay, but station crews successfully cleared tracks.',
  'Market Attendance Drops': 'Storm rains reduced market trading volumes, lowering daily commodity prices.',
  'Shelter at the Academy': 'Professor Finley sheltered travelers inside the academy, conducting extra study sessions.',
  'Lanterns Short Circuit': 'Dimmer street lights were logged due to wet gas valves, requiring manual maintenance checks.',
  'Evening Show Cancelled': 'A ceiling leak forced a cancellation, but playhouse crews completed emergency repairs.',
  'Wind Speeds Calm': 'The wind and rain cleared, leaving a cool and crisp evening sky.',
  'Curfew in Storm': 'Storm recovery patrols completed sweeping pathway debris, ensuring a quiet night.',
  
  // Festival
  'Mayor Announces Festival': 'The Mayor kicked off the annual festival, doubling community legacy merits.',
  'Sugar Prices Spike': 'High demand for festival candy syrup inflated sugar prices, benefiting local traders.',
  'Parades in the Canopy': 'Ranger scouts led celebratory bands across the elevated boardwalk bridges.',
  'Free Theatre Tickets': 'Free passes were distributed to all citizens, packing the playhouse halls.',
  'Honeyberry Play Premiere': 'The premiere performance drew a massive crowd, celebrating the forest sprites.',
  'Festival Monorail Decorated': 'Monorail cars were decorated with glowing fairy lights, offering free scenic rides.',
  'Lantern Festival Glow': 'Hundreds of paper lanterns floated above the canopy, lighting up the redwood forests.',
  'Curfew post-festival': 'A late curfew went into effect, allowing festival-goers to return home safely.',
  
  // Migration
  'Fluttermoth Migration': 'Rare bioluminescent moths migrated through the valleys, nesting near the clinic.',
  'Special Monorail Available': 'The observation carriages were added to track the flight paths of fluttermoths.',
  'Moth Spores Cause Sneezles': 'Discharged wing spores triggered local spore sneezles, crowding the clinic.',
  'High Demand for Remedies': 'Emergency demand boosted remedy values, prompting high lavender shipments.',
  'Bioluminescent Night Glow': 'Moths nested in the ancient redwood canopy, painting the paths in glowing green light.',
  'Moth Sanctuary Talk': 'Rangers convened at Gossip Corner to debate environmental zone boundaries.',
  'Monorail Night Flight': 'The monorail completed its scenic flight beneath the bioluminescent canopy.',
  'Curfew sets in': 'Curfew began as the migrating moths settled, restoring quiet to the forest lanes.'
};

const getEventSubpages = (ev: { category: string; affectedPlaces: string[] }): { label: string; page: SubPage }[] => {
  const links: { label: string; page: SubPage }[] = [];
  const places = ev.affectedPlaces.map(p => p.toLowerCase());
  const category = ev.category.toLowerCase();

  if (places.some(p => p.includes('market') || p.includes('trade') || p.includes('bakery')) || category === 'economy') {
    links.push({ label: '🏪 Visit Market Shop', page: 'shop' });
  }
  if (places.some(p => p.includes('academy') || p.includes('classroom') || p.includes('library'))) {
    links.push({ label: '🏫 Go to Academy Classroom', page: 'classroom' });
  }
  if (places.some(p => p.includes('theatre') || p.includes('playhouse')) || category === 'theatre') {
    links.push({ label: '🎭 Enter Playhouse Theatre', page: 'theatre' });
  }
  if (places.some(p => p.includes('station') || p.includes('transit') || p.includes('monorail') || p.includes('train')) || category === 'transport') {
    links.push({ label: '🚂 Go to Transit Station', page: 'transport' });
  }
  if (places.some(p => p.includes('gossip'))) {
    links.push({ label: '🗣️ Visit Gossip Corner', page: 'gossip' });
  }
  if (places.some(p => p.includes('clinic'))) {
    links.push({ label: '🏥 Visit Apothecary Clinic', page: 'health' });
  }
  if (places.some(p => p.includes('town hall') || p.includes('politics'))) {
    links.push({ label: '🏛️ Go to Town Hall', page: 'politics' });
  }

  // Fallback default
  if (links.length === 0) {
    links.push({ label: '🏪 Go to Town Shop', page: 'shop' });
  }
  return links;
};

export const HomeBox6_WorldEngine: React.FC<Props> = ({ pushPage }) => {
  const { worldTime, refreshWorldTime } = useTTStore();
  const [timeStr, setTimeStr] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<WorldSimulationEvent | null>(null);

  // Keep simulated time and engine phases updated
  useEffect(() => {
    refreshWorldTime();
    const updateTime = () => {
      const now = new Date();
      const pad = (n: number) => n.toString().padStart(2, '0');
      setTimeStr(`${pad(now.getHours())}:${pad(now.getMinutes())}`);
    };
    updateTime();
    
    const interval = setInterval(() => {
      refreshWorldTime();
      updateTime();
    }, 5000); // refresh every 5 seconds
    
    return () => clearInterval(interval);
  }, [refreshWorldTime]);

  const handleCardClick = (ev: WorldSimulationEvent) => {
    if (selectedEvent?.title === ev.title) {
      setSelectedEvent(null);
    } else {
      setSelectedEvent(ev);
    }
  };

  return (
    <div className="relative w-full shrink-0">
      {/* Solid backing shadow */}
      <div className="absolute top-2 left-2 right-0 bottom-0 bg-amber-500/25 border-[3px] border-amber-500/40 rounded-3xl -z-10" />

      {/* Main container */}
      <div className="mr-2 mb-2 w-[calc(100%-8px)] rounded-3xl overflow-hidden border-[3px] border-amber-500/40 bg-black/60 relative z-10 flex flex-col p-6 gap-5">
        
        {/* Title & World Clock Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-4 gap-3">
          <div className="text-left">
            <span className="text-[8px] font-black uppercase tracking-[0.25em] text-amber-400 font-sans">Simulation Layer</span>
            <h3 className="text-base font-brand text-white uppercase mt-0.5" style={{ fontFamily: FONT }}>
              World Simulation Engine
            </h3>
          </div>
          
          {/* Engine Status Clock */}
          <div className="flex items-center gap-2.5 bg-black/55 border border-amber-500/35 px-4 py-2 rounded-2xl shadow-inner w-fit">
            <span className="text-base animate-pulse">⚙️</span>
            <div className="text-left font-mono">
              <span className="text-[9px] uppercase tracking-wider text-amber-400 font-black block">Ganache Town Time</span>
              <span className="text-sm font-bold text-white tracking-widest">{timeStr || '00:00'}</span>
            </div>
          </div>
        </div>

        {/* Timeline Grid: 8 simulated events */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {worldTime.eventsTimeline?.map((ev, idx) => {
            const isActive = ev.status === 'active';
            const isPassed = ev.status === 'passed';
            const isSelected = selectedEvent?.title === ev.title;
            
            return (
              <div 
                key={idx}
                onClick={() => handleCardClick(ev)}
                className={`relative p-4 rounded-2xl border transition-all duration-300 flex flex-col justify-between gap-2.5 text-left select-none cursor-pointer hover:scale-[1.02] ${
                  isActive 
                    ? isSelected 
                      ? 'bg-yellow-500/20 border-yellow-400 shadow-[0_0_20px_rgba(234,179,8,0.3)]'
                      : 'bg-yellow-500/10 border-yellow-400/50 shadow-[0_0_15px_rgba(234,179,8,0.15)] scale-[1.01]' 
                    : isPassed 
                    ? isSelected
                      ? 'bg-red-500/20 border-red-400 shadow-[0_0_20px_rgba(239,68,68,0.3)]'
                      : 'bg-red-500/10 border-red-500/20 opacity-80' 
                    : isSelected
                    ? 'bg-blue-500/25 border-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.3)]'
                    : 'bg-blue-500/10 border-blue-500/20 opacity-85'
                }`}
              >
                {/* Event Time badge + Ticker */}
                <div className="flex justify-between items-center">
                  <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded-lg ${
                    isActive 
                      ? 'bg-yellow-500 text-black font-black' 
                      : isPassed 
                      ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                      : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  }`}>
                    {ev.time}
                  </span>
                  
                  {/* Status Indicator */}
                  {isActive ? (
                    <span className="text-[8px] font-black uppercase tracking-wider bg-yellow-500 text-black px-2 py-0.5 rounded-md animate-pulse">
                      Active Now
                    </span>
                  ) : isPassed ? (
                    <span className="text-[10px] text-red-400 font-bold">✓ Passed</span>
                  ) : (
                    <span className="text-[10px] text-blue-400 font-bold">⏳ Upcoming</span>
                  )}
                </div>

                {/* Event Title */}
                <div>
                  <h4 className={`text-xs font-brand uppercase tracking-wide leading-snug ${
                    isActive ? 'text-yellow-300 font-bold' : isPassed ? 'text-red-300' : 'text-blue-300'
                  }`} style={{ fontFamily: FONT }}>
                    {ev.title}
                  </h4>
                  <p className="text-[10px] text-white/60 leading-relaxed font-sans mt-1 line-clamp-2">
                    {ev.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Event Details Panel (Only shown on click) */}
        {selectedEvent && (
          <div className="p-5 bg-neutral-900/80 border border-amber-500/30 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-5 font-sans text-left animate-fade-in shadow-inner relative overflow-hidden border-t-4 border-t-amber-500">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full translate-x-12 -translate-y-12 pointer-events-none" />
            
            <div className="space-y-2 z-10 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xl">🌟</span>
                <div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-amber-400 block font-sans">
                    Simulation Details &amp; Options ({selectedEvent.time})
                  </span>
                  <h4 className="text-sm font-bold text-white uppercase" style={{ fontFamily: FONT }}>
                    {selectedEvent.title}
                  </h4>
                </div>
              </div>

              {selectedEvent.status === 'passed' ? (
                // 2-line description for completed events
                <p className="text-white/80 text-xs leading-relaxed font-medium bg-black/40 border border-white/5 p-3 rounded-xl mt-1.5">
                  {COMPLETED_SUMMARIES[selectedEvent.title] || `${selectedEvent.title} has completed on schedule today. The local parameters have successfully updated accordingly.`}
                </p>
              ) : (
                // Active or upcoming event details
                <div className="space-y-1.5 mt-1.5">
                  <p className="text-white/95 text-xs leading-relaxed">
                    <strong>Situation:</strong> {selectedEvent.description}
                  </p>
                  <p className="text-amber-300 text-xs leading-relaxed">
                    <strong>Active Effect:</strong> {selectedEvent.effect}
                  </p>
                  <p className="text-neutral-400 text-[11px] leading-relaxed italic">
                    <strong>Suggestion:</strong> {selectedEvent.suggestion}
                  </p>
                </div>
              )}
            </div>

            {/* Navigation options to participate (Only if active or upcoming) */}
            {selectedEvent.status !== 'passed' && (
              <div className="z-10 shrink-0 flex flex-col gap-2">
                {getEventSubpages(selectedEvent).map((link, lIdx) => (
                  <button
                    key={lIdx}
                    onClick={() => pushPage(link.page)}
                    className="px-5 py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-brand font-black uppercase text-[10px] tracking-wider rounded-xl transition duration-150 shadow-md hover:scale-102 active:scale-98 cursor-pointer flex items-center justify-center gap-1"
                    style={{ fontFamily: '"Josefin Sans", sans-serif' }}
                  >
                    {link.label} 🚀
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
