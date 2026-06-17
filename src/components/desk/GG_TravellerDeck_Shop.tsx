import React, { useState } from 'react';
import { useTTStore } from '../../store/useTTStore';
import { GG_TravellerDeck_Header } from './GG_TravellerDeck_Header';
import type { SubPage } from '../../pages/TravellersDesk';

interface GG_TravellerDeck_ShopProps {
  setSubPage: (page: SubPage) => void;
  popPage: () => void;
  triggerFeedback: (msg: string) => void;
}

export const GG_TravellerDeck_Shop: React.FC<GG_TravellerDeck_ShopProps> = ({
  setSubPage,
  popPage,
  triggerFeedback,
}) => {
  const {
    ownedDecorations,
    equippedDecorations,
    buyDecoration,
    toggleDecoration,
    ownedPets,
    equippedPet,
    buyPet,
    togglePet,
    ownedTransports,
    activeTransport,
    buyTransport,
    setTransport,
    ownedEstates,
    buyEstate,
    premiumPassport,
    buyPremiumPassport,
    activePasses,
    buyPass,
  } = useTTStore();

  const [shopTab, setShopTab] = useState<'decorations' | 'transports' | 'permits'>('decorations');

  return (
    <div className="w-full h-full flex flex-col justify-between">
      <GG_TravellerDeck_Header
        title="COZY RESIDENCY IMPROVEMENTS"
        setSubPage={setSubPage}
        popPage={popPage}
      />

      {/* Shop Tabs */}
      <div className="flex gap-2 mb-3 shrink-0">
        <button
          onClick={() => setShopTab('decorations')}
          className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase transition ${
            shopTab === 'decorations' ? 'bg-amber-500 text-black font-black' : 'bg-white/5 text-white hover:bg-white/10'
          }`}
          style={{ fontFamily: '"Josefin Sans", sans-serif' }}
        >
          🏡 Cottage & Companions
        </button>
        <button
          onClick={() => setShopTab('transports')}
          className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase transition ${
            shopTab === 'transports' ? 'bg-amber-500 text-black font-black' : 'bg-white/5 text-white hover:bg-white/10'
          }`}
          style={{ fontFamily: '"Josefin Sans", sans-serif' }}
        >
          🐎 Travel & Estates
        </button>
        <button
          onClick={() => setShopTab('permits')}
          className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase transition ${
            shopTab === 'permits' ? 'bg-amber-500 text-black font-black' : 'bg-white/5 text-white hover:bg-white/10'
          }`}
          style={{ fontFamily: '"Josefin Sans", sans-serif' }}
        >
          🎟️ Permits & Passes
        </button>
      </div>

      {/* Shop Items Grid */}
      <div className="flex-1 border border-white/10 bg-black/25 rounded-[2rem] p-6 overflow-y-auto custom-scrollbar my-2 min-h-0">
        
        {/* TAB 1: Cottage Upgrades & Companions */}
        {shopTab === 'decorations' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Improvements */}
            {[
              { id: 'lanterns', name: 'Glowcap Lanterns 🏮', cost: 40, desc: 'Provides a warm ambient light along your pathway.' },
              { id: 'flower-boxes', name: 'Window Flower Boxes 🌸', cost: 30, desc: 'Window boxes filled with candy blossoms.' },
              { id: 'smoke', name: 'Chocolate Chimney Smoke 💨', cost: 60, desc: 'Billows sweet chocolate-scented clouds from your cottage.' },
              { id: 'fence', name: 'Sweet Wafer Fence 🎫', cost: 50, desc: 'A white wafer log fence surrounding your forest lawn.' },
            ].map((d) => {
              const isOwned = ownedDecorations.includes(d.id);
              const isEquipped = equippedDecorations.includes(d.id);
              return (
                <div key={d.id} className="p-4 bg-white/5 border border-white/10 rounded-2xl flex flex-col justify-between gap-3 text-xs animate-fade-in shadow-md">
                  <div>
                    <h4 className="font-bold text-white text-sm">{d.name}</h4>
                    <p className="text-white/60 mt-1 leading-normal">{d.desc}</p>
                  </div>
                  <div className="flex items-center justify-between mt-1 pt-2 border-t border-white/5">
                    <span className="text-amber-400 font-bold font-mono">{d.cost} Coins</span>
                    {isOwned ? (
                      <button
                        onClick={() => toggleDecoration(d.id)}
                        className={`px-3 py-1 rounded-lg font-bold text-[10px] uppercase transition ${
                          isEquipped ? 'bg-emerald-600 text-white hover:bg-emerald-500' : 'bg-neutral-800 text-white/55 hover:bg-neutral-700'
                        }`}
                      >
                        {isEquipped ? 'Active ✓' : 'Use'}
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          if (buyDecoration(d.id, d.cost)) {
                            triggerFeedback(`🛒 Beautified Home! Installed ${d.name}`);
                          } else {
                            triggerFeedback('❌ Insufficient Coins!');
                          }
                        }}
                        className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-black font-extrabold uppercase rounded-lg text-[10px]"
                      >
                        Acquire
                      </button>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Pets */}
            {[
              { id: 'squirrel', name: 'Ganache Squirrel 🐿️', cost: 50, desc: 'A chatterbox squirrel who climbs your residence signs.' },
              { id: 'bunny', name: 'Marshmallow Bunny 🐇', cost: 80, desc: 'Munches sweet weeds by your flower boxes.' },
              { id: 'owl', name: 'Cocoawood Owl 🦉', cost: 120, desc: 'Watches from your cottage roof and hoots at midnight.' },
            ].map((p) => {
              const isOwned = ownedPets.includes(p.id);
              const isEquipped = equippedPet === p.id;
              return (
                <div key={p.id} className="p-4 bg-white/5 border border-white/10 rounded-2xl flex flex-col justify-between gap-3 text-xs animate-fade-in shadow-md">
                  <div>
                    <h4 className="font-bold text-white text-sm">{p.name}</h4>
                    <span className="text-[9px] uppercase tracking-wider text-cyan-400 font-bold">Woodland Companion</span>
                    <p className="text-white/60 mt-1 leading-normal">{p.desc}</p>
                  </div>
                  <div className="flex items-center justify-between mt-1 pt-2 border-t border-white/5">
                    <span className="text-amber-400 font-bold font-mono">{p.cost} Coins</span>
                    {isOwned ? (
                      <button
                        onClick={() => togglePet(isEquipped ? null : p.id)}
                        className={`px-3 py-1 rounded-lg font-bold text-[10px] uppercase transition ${
                          isEquipped ? 'bg-emerald-600 text-white hover:bg-emerald-500' : 'bg-neutral-800 text-white/55 hover:bg-neutral-700'
                        }`}
                      >
                        {isEquipped ? 'Welcomed ✓' : 'Invite'}
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          if (buyPet(p.id, p.cost)) {
                            triggerFeedback(`🐿️ Companion Welcomed! ${p.name} moved in.`);
                          } else {
                            triggerFeedback('❌ Insufficient Coins!');
                          }
                        }}
                        className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-black font-extrabold uppercase rounded-lg text-[10px]"
                      >
                        Invite
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 2: Travel & Estates */}
        {shopTab === 'transports' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Vehicles */}
            {[
              { id: 'horse-wagon', name: 'Caramel Wagon 🐎', cost: 80, speed: '2x Speed', desc: 'A carriage pulled by a caramel pony.' },
              { id: 'forest-train', name: 'Forest Rail Express Pass 🚂', cost: 150, speed: '4x Speed', desc: 'Official pass for the province rail transport line.' },
              { id: 'hot-air-balloon', name: 'Hot Air Balloon License 🎈', cost: 300, speed: '8x Speed', desc: 'Fly above the trees in a woven chocolate basket.' },
            ].map((t) => {
              const isOwned = ownedTransports.includes(t.id);
              const isActive = activeTransport === t.id;
              return (
                <div key={t.id} className="p-4 bg-white/5 border border-white/10 rounded-2xl flex flex-col justify-between gap-3 text-xs animate-fade-in shadow-md">
                  <div>
                    <h4 className="font-bold text-white text-sm">{t.name}</h4>
                    <span className="text-[9px] uppercase tracking-wider text-yellow-400 font-bold block">{t.speed} Transit multiplier</span>
                    <p className="text-white/60 mt-1 leading-normal">{t.desc}</p>
                  </div>
                  <div className="flex items-center justify-between mt-1 pt-2 border-t border-white/5">
                    <span className="text-amber-400 font-bold font-mono">{t.cost} Coins</span>
                    {isOwned ? (
                      <button
                        onClick={() => setTransport(t.id as 'walk' | 'horse-wagon' | 'forest-train' | 'hot-air-balloon')}
                        className={`px-3 py-1 rounded-lg font-bold text-[10px] uppercase transition ${
                          isActive ? 'bg-emerald-600 text-white hover:bg-emerald-500' : 'bg-neutral-800 text-white/55 hover:bg-neutral-700'
                        }`}
                      >
                        {isActive ? 'Active ✓' : 'Equip'}
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          if (buyTransport(t.id, t.cost)) {
                            triggerFeedback(`🐎 Transport Acquired: ${t.name}`);
                          } else {
                            triggerFeedback('❌ Insufficient Coins!');
                          }
                        }}
                        className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-black font-extrabold uppercase rounded-lg text-[10px]"
                      >
                        Buy vehicle
                      </button>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Estates */}
            {[
              { id: 'hazelnut-villa', name: 'Hazelnut Terrace Villa 🏡', cost: 250, desc: 'A spacious estate overlooking the Nutty Slopes district.' },
              { id: 'cove-mansion', name: 'Caramel Cove Mansion 🏰', cost: 400, desc: 'A grand coastal estate situated right on the Sticky Surf Beachfront.' },
              { id: 'peak-palace', name: 'Peppermint Peaks Palace 🏔️', cost: 600, desc: 'A luxury glacial fortress built into the Mint Ridge.' },
            ].map((e) => {
              const isOwned = ownedEstates.includes(e.id);
              return (
                <div key={e.id} className="p-4 bg-white/5 border border-white/10 rounded-2xl flex flex-col justify-between gap-3 text-xs animate-fade-in shadow-md">
                  <div>
                    <h4 className="font-bold text-white text-sm">{e.name}</h4>
                    <span className="text-[9px] uppercase tracking-wider text-purple-400 font-bold">Imperial Real Estate</span>
                    <p className="text-white/60 mt-1 leading-normal">{e.desc}</p>
                  </div>
                  <div className="flex items-center justify-between mt-1 pt-2 border-t border-white/5">
                    <span className="text-amber-400 font-bold font-mono">{e.cost} Coins</span>
                    {isOwned ? (
                      <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/35 text-emerald-400 text-[10px] font-bold uppercase rounded-lg">Owned</div>
                    ) : (
                      <button
                        onClick={() => {
                          if (buyEstate(e.id, e.cost)) {
                            triggerFeedback(`🏡 Estate Acquired: ${e.name}`);
                          } else {
                            triggerFeedback('❌ Insufficient Coins!');
                          }
                        }}
                        className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-black font-extrabold uppercase rounded-lg text-[10px]"
                      >
                        Acquire Land
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 3: Permits & Passes */}
        {shopTab === 'permits' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Premium Passport */}
            <div className="p-5 bg-white/5 border border-white/10 rounded-2xl flex flex-col justify-between gap-3 text-xs animate-fade-in shadow-md">
              <div>
                <h4 className="font-bold text-white text-sm">Imperial Golden Registry Upgrade 👑</h4>
                <p className="text-white/60 mt-1 leading-normal">
                  Permanently upgrades your traveler passport class. Boosts gained standing legacy points from all county deeds by +50%.
                </p>
              </div>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
                <span className="text-amber-400 font-bold font-mono">200 Coins</span>
                {premiumPassport ? (
                  <div className="px-3 py-1.5 bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 text-[10px] font-bold uppercase rounded-xl">Golden Class Registry</div>
                ) : (
                  <button
                    onClick={() => {
                      if (buyPremiumPassport(200)) {
                        triggerFeedback('👑 Passport permanently upgraded to Imperial Golden Class!');
                      } else {
                        triggerFeedback('❌ Insufficient Coins!');
                      }
                    }}
                    className="px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-black font-brand uppercase text-[10px] rounded-xl transition shadow-glow"
                    style={{ fontFamily: '"Josefin Sans", sans-serif' }}
                  >
                    Upgrade Passport
                  </button>
                )}
              </div>
            </div>

            {/* Seasonal Pass */}
            {[
              { id: 'cocoa-festival', name: 'Cocoa Festival Pass 🎟️', cost: 80, desc: 'Entry permit for the annual autumn cocoa harvest week.' },
              { id: 'marshmallow-week', name: 'Winter Marshmallow Pass 🎟️', cost: 100, desc: 'Entry permit for the marshmallow winter bonfire county week.' },
            ].map((p) => {
              const isOwned = activePasses.includes(p.id);
              return (
                <div key={p.id} className="p-5 bg-white/5 border border-white/10 rounded-2xl flex flex-col justify-between gap-3 text-xs animate-fade-in shadow-md">
                  <div>
                    <h4 className="font-bold text-white text-sm">{p.name}</h4>
                    <p className="text-white/60 mt-1 leading-normal">{p.desc}</p>
                  </div>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
                    <span className="text-amber-400 font-bold font-mono">{p.cost} Coins</span>
                    {isOwned ? (
                      <div className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/35 text-emerald-400 text-[10px] font-bold uppercase rounded-xl">Permit Logged</div>
                    ) : (
                      <button
                        onClick={() => {
                          if (buyPass(p.id, p.cost)) {
                            triggerFeedback(`🎟️ Festival Permit Purchased: ${p.name}`);
                          } else {
                            triggerFeedback('❌ Insufficient Coins!');
                          }
                        }}
                        className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-brand uppercase text-[10px] rounded-xl transition shadow-md"
                        style={{ fontFamily: '"Josefin Sans", sans-serif' }}
                      >
                        Acquire Permit
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};
