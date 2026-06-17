const fs = require('fs');

const file = 'c:/Yogesh Universe/TOFFEETOWNS_FUN/src/components/desk/GG_TravellerDeck_NewsPaper.tsx';
let content = fs.readFileSync(file, 'utf8');

// We will find the range where scrollable pages are rendered
const startMarker = '<div ref={scrollRef} className="flex-grow overflow-y-auto newspaper-scrollbar my-4 pr-1 min-h-0">';
const endMarker = '</div>\n\n          {/* Paper Page Turner and Footer bar */}';

const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker);

if (startIndex === -1 || endIndex === -1) {
  console.error("Could not find start or end markers for refactoring.");
  process.exit(1);
}

const newBody = `<div ref={scrollRef} className="flex-grow overflow-y-auto newspaper-scrollbar my-4 pr-1 min-h-0">
            
            {/* PAGE 1: FRONT PAGE & LORE CHRONICLE */}
            {paperPage === 1 && (
              <div className="space-y-6 pb-12 min-h-0 animate-fade-in text-amber-950">
                {/* 6 to 8 Lines of Interesting Introduction Text */}
                <div className="text-xs text-amber-900/90 leading-relaxed text-justify font-serif p-4 bg-amber-950/5 border border-amber-950/10 rounded-2xl select-text">
                  Here in the heart of Ganache Grove, where the warm autumn breezes carry the fragrant scent of roasted cocoa and the sugarbirds chirp their sweet harmonies from the ancient oak branches, the local community remains as bustling as ever. From the early morning shifts at the Riverside Docks to the late-night study sessions at the Academy, residents and travelers alike contribute their skills to make this district the sweetest corner of Cocoawood County. Our writers have traversed the mossy pathways and interviewed local elders to bring you the latest dispatches, ensuring that every citizen is well-informed on regional developments. As we open this morning edition of the Ganache Gazette, we remind all readers to check their passport logs, trade their cargo tickets, and keep their tools ready for the day's community tasks.
                </div>

                {/* Standard Top Left 3:2 Image Layout */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                  {/* Top Left Image */}
                  <div className="md:col-span-5 aspect-[3/2] w-full rounded-2xl overflow-hidden border-2 border-amber-950/25 bg-amber-950/5 shadow-md relative shrink-0">
                    {[
                      "/Assets/Ganache Grove/Traveller'sHome_GanacheGrovez_Beginner_Exterior.png",
                      "/Assets/Ganache Grove/Scene_0.1.png"
                    ].map((imgUrl, i) => (
                      <img 
                        key={imgUrl}
                        src={imgUrl} 
                        alt="Walkway Slide" 
                        className={\`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out \${bgSlideIdx === i ? 'opacity-100 z-10' : 'opacity-0 z-0'}\`}
                      />
                    ))}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none z-20" />
                  </div>

                  {/* Top Right Headline */}
                  <div className="md:col-span-7 space-y-3 text-left">
                    <div className="space-y-2">
                      <h2 className="text-2xl font-extrabold uppercase leading-snug tracking-tight text-amber-950 font-serif">
                        {dayContent.headline}
                      </h2>
                      <p className="text-[12.5px] leading-relaxed text-amber-900/90 font-serif text-justify">
                        <strong>FOREST GROVE</strong> — {dayContent.story}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 border-t border-amber-950/15 pt-4">
                  {/* Spotlight (Left 8 columns) */}
                  <div className="lg:col-span-8 space-y-4 pr-0 lg:pr-4 lg:border-r border-amber-950/15">
                    <div className="space-y-2 text-left">
                      <h3 className="text-lg font-bold text-amber-950 uppercase mb-2 font-serif">
                        🦋 Rare Species Spotlight: Glowcap Fluttermoth
                      </h3>
                      <p className="text-xs text-amber-900/95 leading-relaxed text-justify">
                        Sighted near ancient ganache trees. Appears only under white lighting in the deepest green forests. Researchers warn travelers not to feed them cocoa shavings, as they become hyperactive and disrupt local pollination rhythms.
                      </p>
                    </div>

                    <div className="border-t-4 border-double border-amber-950/20 pt-4 text-left">
                      <h3 className="text-sm font-black uppercase border-b border-amber-950/20 pb-1 tracking-wider font-sans mb-3 flex items-center gap-1.5">
                        <span>📜</span> Ganache Chronicles: Local History Feature
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[11px] text-amber-900 leading-relaxed text-justify font-serif">
                        <div>
                          <h4 className="font-bold text-amber-950 uppercase mb-1">
                            The Great Syrup Flood of Year 104
                          </h4>
                          <p>
                            Few active residents remember when the grand reservoir at Peppermint Peak suffered an expansion rupture. Over three million gallons of warm peppermint syrup cascaded down the gorge, completely submerging the low-lying plains.
                          </p>
                        </div>
                        <div>
                          <p>
                            "We were stuck in our beds for four days," recalls Elder Pecan. "Not because of fear, but because the syrup had seeped through the floorboards and glued all our carpets to our slippers." The cleanup effort took six months of warm water washes.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-dashed border-amber-950/25 pt-4 mt-4 select-text text-left">
                      <h3 className="text-xs font-black uppercase tracking-wider font-sans text-amber-950 mb-2">
                        📰 Cocoawood Community Notices & Classifieds
                      </h3>
                      <div className="grid grid-cols-2 gap-4 text-[10.5px] leading-relaxed text-amber-900/90 font-serif">
                        <div className="text-justify">
                          <p className="font-semibold text-amber-950 uppercase mb-0.5">🔍 Lost: Clockwork Squirrel</p>
                          <p>Answers to 'Nutty'. Last seen chasing chocolate acorns near the eastern bridge path. Reward: 10 coins.</p>
                        </div>
                        <div className="text-justify">
                          <p className="font-semibold text-amber-950 uppercase mb-0.5">📢 For Sale: Vintage Copper Cauldron</p>
                          <p>Perfect for slow-cooking ganache. Light scratches on the handle. Inquire at Mossberry Lane 14. 50 coins or best offer.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Daily Briefing & Forecast (Right 4 Columns) */}
                  <div className="lg:col-span-4 space-y-4 text-left">
                    <div className="bg-[#f0e8d9] border-2 border-amber-950/20 rounded-2xl p-4 flex flex-col gap-2 shadow-inner">
                      <span className="text-[9px] font-black uppercase tracking-[0.2em] text-amber-900 font-sans">Imperial Bulletin</span>
                      <h4 className="text-sm font-bold text-amber-950 uppercase border-b border-amber-950/10 pb-1">Syrup Logistics Briefing</h4>
                      <p className="text-xs text-amber-900/80 leading-relaxed text-justify">
                        Molasses import volumes spiked 15%. Acknowledge this report to update your permanent citizen record.
                      </p>
                      {!dossierRead ? (
                        <button
                          onClick={handleReadDossier}
                          className="w-full py-2 bg-amber-900 hover:bg-amber-850 text-[#f7f2e8] font-bold rounded-xl text-[10px] font-brand uppercase tracking-wider transition mt-2 shadow"
                          style={{ fontFamily: '"Josefin Sans", sans-serif' }}
                        >
                          Acknowledge Report
                        </button>
                      ) : (
                        <div className="py-2 bg-emerald-800/10 border border-emerald-800/35 text-emerald-800 text-center rounded-xl text-xs font-bold mt-2 font-sans">
                          ✓ Report Acknowledged (+30🪙, +30🎖️)
                        </div>
                      )}
                    </div>

                    <div className="p-4 border border-dashed border-amber-950/30 rounded-2xl space-y-2">
                      <span className="text-[9px] font-black uppercase tracking-wider text-amber-900 font-sans block">Weather Forecast</span>
                      <div className="grid grid-cols-2 gap-2 text-[10.5px]">
                        <div>
                          <span className="text-amber-900/50 text-[9px] block font-sans">TODAY</span>
                          <span className="text-amber-950 font-bold">Ganache Drizzle 🌡️</span>
                        </div>
                        <div>
                          <span className="text-amber-900/50 text-[9px] block font-sans">WIND</span>
                          <span className="text-amber-950 font-bold">Cocoa Breeze</span>
                        </div>
                      </div>
                    </div>

                    {latestFlashNews && (
                      <div className="bg-amber-950/5 border border-dashed border-amber-950/40 rounded-2xl p-4 space-y-1.5 text-left">
                        <span className="text-[9px] font-black uppercase tracking-wider text-amber-900 font-sans block">⚡ Yesterday's Flash News Bulletin</span>
                        <h4 className="text-xs font-bold text-amber-950 uppercase border-b border-amber-950/10 pb-0.5">Breaking Dispatch</h4>
                        <p className="text-[11px] text-amber-900/90 leading-relaxed italic">
                          "{latestFlashNews}"
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* PAGE 2: CITIZENS' OPINION BALLOTS & FACTION DEBATES */}
            {paperPage === 2 && (
              <div className="space-y-6 pb-12 min-h-0 animate-fade-in text-amber-950">
                {/* 6 to 8 Lines of Interesting Introduction Text */}
                <div className="text-xs text-amber-900/90 leading-relaxed text-justify font-serif p-4 bg-amber-950/5 border border-amber-950/10 rounded-2xl select-text">
                  The town council hall has been alive with debates as local factions gather under the glowing lanterns to voice their opinions on crucial county matters. From taxes on chocolate spoons to resource allocations for wharf infrastructure, the decisions made here shape the future of Ganache Grove for seasons to come. Our correspondents have observed that faction leaders from the BossesClan and the Rebels Clan are actively lobbying for votes, creating a lively atmosphere filled with spirited discussions. As citizens, your voices are recorded directly in the imperial golden registry, and your votes determine how public coffers are spent. We encourage everyone to review the current affairs ballots, weigh the options carefully, and make their choices known at the town boxes before the midnight curfew ticks.
                </div>

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
                        className={\`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out \${bgSlideIdx === i ? 'opacity-100 z-10' : 'opacity-0 z-0'}\`}
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
                        {dayContent.page2Desc}
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
                  <div className="p-4 bg-white/45 border border-amber-950/15 rounded-2xl flex flex-col justify-between text-xs min-h-[220px]">
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
                </div>
              </div>
            )}

            {/* PAGE 3: GOSSIP, HEALTH CLINIC & ARCHAEOLOGY */}
            {paperPage === 3 && (
              <div className="space-y-6 pb-12 min-h-0 animate-fade-in text-amber-950">
                {/* 6 to 8 Lines of Interesting Introduction Text */}
                <div className="text-xs text-amber-900/90 leading-relaxed text-justify font-serif p-4 bg-amber-950/5 border border-amber-950/10 rounded-2xl select-text">
                  Wellness and history go hand-in-hand in Ganache Grove, where our local healer clinics work tirelessly to maintain the health of both residents and traveling woodland companions. Dr. Lavender Sweetbloom has released her weekly warnings on forest spores and herbal remedies, urging everyone to keep their tea kettles boiling with fresh mint. Meanwhile, near the ancient riverbanks, archaeological teams have unearthed fascinating relics that offer a window into the Pre-Melt Era and the early bonbon settlers who first cultivated these lands. Learning our history helps us appreciate the chocolate foundations of our town, and studying local herbalism keeps our communities active. Read on to discover the latest clinic reports, town whispers, and archaeological findings directly excavated from our local soil.
                </div>

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
                        className={\`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out \${bgSlideIdx === i ? 'opacity-100 z-10' : 'opacity-0 z-0'}\`}
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
                      {dayContent.page3Desc}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 border-t border-amber-950/15 pt-4 text-left">
                  {/* Gossip & Whispers Column (Left 6 Columns) */}
                  <div className="lg:col-span-6 space-y-4 pr-0 lg:pr-4 lg:border-r border-amber-950/15">
                    <h3 className="text-sm font-black uppercase border-b border-amber-950/20 pb-1 tracking-wider font-sans flex items-center gap-1.5">
                      <span>👂</span> Gossip & Whispers
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
                    </div>
                  </div>

                  {/* Health Watch: Clinic Update (Right 6 Columns) */}
                  <div className="lg:col-span-6 space-y-4">
                    <h3 className="text-sm font-black uppercase border-b border-amber-950/20 pb-1 tracking-wider font-sans flex items-center gap-1.5">
                      <span>🩺</span> Health Watch: Clinic Update
                    </h3>
                    <div className="space-y-2 text-[11px] text-amber-900 font-serif leading-relaxed text-justify">
                      <div className="flex gap-2.5 items-start p-2.5 bg-amber-900/5 border border-amber-950/10 rounded-xl">
                        <span className="text-2xl font-sans">🩺</span>
                        <div>
                          <span className="font-bold block text-amber-950 text-[11px] font-sans">Dr. Lavender Sweetbloom</span>
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
                    <div className="md:col-span-7 p-3 bg-amber-950/5 border border-amber-950/10 rounded-xl space-y-1.5">
                      <span className="text-[9px] font-bold text-amber-800 uppercase block font-sans">Found under the Ganache River Bed</span>
                      <h5 className="font-serif font-bold text-amber-950 text-xs">{dayContent.page3LoreTitle}</h5>
                      <p className="text-[10.5px] text-amber-900/80 leading-normal">
                        {dayContent.page3LoreText}
                      </p>
                    </div>
                    <div className="md:col-span-5 border border-dashed border-amber-950/30 rounded-xl p-3 flex flex-col justify-center text-center bg-white/10">
                      <span className="text-[10px] font-sans font-bold text-amber-950 block">📚 LOCAL LORE FACT</span>
                      <p className="text-[11px] text-amber-900/70 leading-relaxed mt-1">
                        {dayContent.page3LoreFact}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* PAGE 4: HARBOR MARKET, ADVERTISEMENTS & LEISURE */}
            {paperPage === 4 && (
              <div className="space-y-6 pb-12 min-h-0 animate-fade-in text-amber-950">
                {/* 6 to 8 Lines of Interesting Introduction Text */}
                <div className="text-xs text-amber-900/90 leading-relaxed text-justify font-serif p-4 bg-amber-950/5 border border-amber-950/10 rounded-2xl select-text">
                  The commodity markets at Mossberry Wharf are experiencing high trading volumes as caravans and steam barges arrive carrying sweet imports from the Peppermint Peak district. Traders are bargaining over timber logs, sugar crystals, and cocoa bags, creating a vibrant center of commerce that keeps the provincial economy thriving. Our market analysts have compiled the latest price index shifts to help you trade contracts at optimal margins and secure maximum profit. Alongside the commerce desks, local businesses have posted classified advertisements for specialized gear, travel wagon rentals, and village chore opportunities. In this leisure section, we also present our daily broadside riddle, designed to test the quick-witted minds of our travelers. Step into the market plaza, review the exchange rates, and enjoy the local leisure notices.
                </div>

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
                        className={\`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out \${bgSlideIdx === i ? 'opacity-100 z-10' : 'opacity-0 z-0'}\`}
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
                      {dayContent.page4Desc}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 border-t border-amber-950/15 pt-4 text-left">
                  {/* Left Column: Commodity Index Table (6 columns) */}
                  <div className="lg:col-span-6 space-y-4 pr-0 lg:pr-4 lg:border-r border-amber-950/15">
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
                              <td className={\`p-2.5 text-right font-bold \${r.direction === 'up' ? 'text-emerald-700' : r.direction === 'down' ? 'text-red-700' : 'text-amber-900'}\`}>
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
                      <div className="p-3 border-2 border-amber-950/30 rounded-xl flex flex-col justify-between bg-white/20 text-center relative group">
                        <span className="text-[8px] font-bold text-amber-900/60 uppercase tracking-widest block mb-1">PROVINCIAL AD</span>
                        <h4 className="text-[11px] font-extrabold uppercase font-serif text-amber-950">{dayContent.page4Classified1Title}</h4>
                        <p className="text-[10px] text-amber-900/80 leading-snug mt-1 font-serif">
                          "{dayContent.page4Classified1Text}"
                        </p>
                        <span className="text-[9px] font-bold text-amber-950 bg-amber-950/10 rounded-full px-2 py-0.5 mt-2 inline-block self-center">
                          {dayContent.page4Classified1Price}
                        </span>
                      </div>

                      <div className="p-3 border-2 border-dashed border-amber-950/20 rounded-xl flex flex-col justify-between bg-[#FAF6EE] text-center">
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

                {/* Leisure separator */}
                <div className="border-t-4 border-double border-amber-950/20 pt-6 text-left">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Interactive Riddle (7 columns) */}
                    <div className="lg:col-span-7 space-y-3">
                      <h3 className="text-sm font-black uppercase border-b border-amber-950/20 pb-1 tracking-wider font-sans flex items-center gap-1.5">
                        <span>🧩</span> Interactive Broadside Puzzle
                      </h3>
                      <div className="p-4 bg-white/45 border border-amber-950/20 rounded-2xl space-y-3">
                        <span className="text-[10px] font-sans font-bold text-amber-950 uppercase tracking-wider block">THE COCOA Riddle:</span>
                        <p className="text-xs font-serif text-amber-900 leading-relaxed">
                          "I am dark or milk, sweet or bittersweet. I begin in a pod on a tropical tree, get crushed and mixed to bring you glee. What am I?"
                        </p>
                        
                        <div className="space-y-2 mt-2">
                          {riddleSolved ? (
                            <div className="p-3 bg-emerald-800/10 border border-emerald-800/35 text-emerald-800 text-center rounded-xl text-xs font-bold font-sans">
                              ✓ Puzzle Solved! Answer: Chocolate (+15 Toffee Coins claimed)
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
                                    addCoins(15, 'Solved Cocoa Gazette Riddle');
                                    triggerFeedback('🎉 Correct! You solved the Cocoa Riddle! (+15🪙)');
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
                    <div className="lg:col-span-5 space-y-3">
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
            )}`;

const startPos = startIndex;
const endPos = endIndex + endMarker.length - 1; // Wait, keep the tuner turner footer at the bottom!
// Let's replace only the inner pages part:
const beforeText = content.slice(0, startIndex + startMarker.length);
const afterText = content.slice(endIndex);

fs.writeFileSync(file, beforeText + "\n" + newBody + "\n          " + afterText, 'utf8');
console.log("Successfully refactored newspaper pages in GG_TravellerDeck_NewsPaper.tsx!");
