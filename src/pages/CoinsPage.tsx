import React, { useState } from 'react';
import { useTTStore } from '../store/useTTStore';

const FONT = '"Luckiest Guy", cursive';

interface CoinPackage {
  id: string;
  name: string;
  coins: number;
  price: string;
  icon: string;
  description: string;
  recommended?: boolean;
}

interface GemPackage {
  id: string;
  name: string;
  gems: number;
  price: string;
  icon: string;
  description: string;
  recommended?: boolean;
}

interface PremiumItem {
  id: string;
  name: string;
  type: 'estate' | 'business';
  price: string;
  icon: string;
  description: string;
  perks: string[];
}

const COIN_PACKAGES: CoinPackage[] = [
  {
    id: 'pack-small',
    name: 'Tallow Bag of Coins',
    coins: 200,
    price: '₹99',
    icon: '💰',
    description: 'A modest coin bag to cover minor dues.',
  },
  {
    id: 'pack-medium',
    name: 'Chest of Hazelnut Coins',
    coins: 650,
    price: '₹299',
    icon: '📦',
    description: 'Settle multiple months of dues and unlock items!',
    recommended: true,
  },
  {
    id: 'pack-large',
    name: 'Imperial Coffer of Coins',
    coins: 1400,
    price: '₹599',
    icon: '👑',
    description: 'Become the wealthiest resident in Cocoawood County!',
  }
];

const GEM_PACKAGES: GemPackage[] = [
  {
    id: 'gems-small',
    name: 'Handful of Shiny Gems',
    gems: 100,
    price: '₹99',
    icon: '💎',
    description: 'A pocketful of crystals for story expansions.',
  },
  {
    id: 'gems-medium',
    name: 'Basket of Sparkly Gems',
    gems: 250,
    price: '₹199',
    icon: '🧺',
    description: 'Best value for active citizens wanting custom items.',
    recommended: true,
  },
  {
    id: 'gems-large',
    name: 'Imperial Gem Vault',
    gems: 600,
    price: '₹399',
    icon: '🔮',
    description: 'Unbounded crystal supply for elite county builders.',
  }
];

const PREMIUM_ITEMS: PremiumItem[] = [
  {
    id: 'lakeside-manor',
    name: 'Prime Lakeside Estate Deed',
    type: 'estate',
    price: '₹99',
    icon: '🏡',
    description: 'Deed to the premium Lakeside Manor in Ganache Grove. Build an elite second home.',
    perks: ['Exclusive horizontal riverside deck', 'Customizable premium lakeside decorations', 'Boosts overall status standing'],
  },
  {
    id: 'cocoa-brewery',
    name: 'Cozy Cocoa Brewery License',
    type: 'business',
    price: '₹99',
    icon: '🍺',
    description: 'Establish a commercial craft brewery business in Ganache Grove. Brew signature drinks.',
    perks: ['Brew custom recipe drinks (molasses base, honeyberry flavor)', 'Set custom product names', 'Earn passive coins & builder XP on sell cycles'],
  }
];

const CoinsPage: React.FC = () => {
  const {
    coins,
    gems,
    addCoins,
    coinHistory,
    setPage,
    headerHidden,
    goldenCitizenPass,
    goldenCitizenPassExpiry,
    lastGemClaimDate,
    ownedEstates,
    ownedBusinesses,
    buyGoldenCitizenPass,
    claimDailyGems,
    buyGemsWithRealMoney,
    buyPremiumEstate,
    buyBusinessLicense
  } = useTTStore();

  const [activeItem, setActiveItem] = useState<{
    id: string;
    name: string;
    type: 'pass' | 'coin' | 'gem' | 'estate' | 'business';
    price: string;
    value: number;
    icon: string;
  } | null>(null);

  const [checkoutStep, setCheckoutStep] = useState<'form' | 'processing' | 'success'>('form');
  const [invoiceId, setInvoiceId] = useState('');
  const [dailyClaimMessage, setDailyClaimMessage] = useState<string | null>(null);

  const startCheckout = (
    id: string,
    name: string,
    type: 'pass' | 'coin' | 'gem' | 'estate' | 'business',
    price: string,
    value: number,
    icon: string
  ) => {
    setActiveItem({ id, name, type, price, value, icon });
    setCheckoutStep('form');
    setInvoiceId('TX-' + Math.random().toString(36).slice(2).toUpperCase());
  };

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutStep('processing');

    setTimeout(() => {
      if (activeItem) {
        switch (activeItem.type) {
          case 'pass':
            buyGoldenCitizenPass();
            break;
          case 'coin':
            addCoins(activeItem.value, `Imperial Shop: ${activeItem.name}`);
            break;
          case 'gem':
            buyGemsWithRealMoney(activeItem.value, parseFloat(activeItem.price.replace('₹', '')));
            break;
          case 'estate':
            buyPremiumEstate(activeItem.id);
            break;
          case 'business':
            buyBusinessLicense(activeItem.id);
            break;
        }
        setCheckoutStep('success');
      }
    }, 2000);
  };

  const handleClaimGems = () => {
    const res = claimDailyGems();
    setDailyClaimMessage(res.message);
    setTimeout(() => setDailyClaimMessage(null), 4000);
  };

  return (
    <div className={`min-h-full w-full flex flex-col items-center justify-start select-none relative transition-all duration-700 bg-transparent ${headerHidden ? 'pt-2 pb-6 px-2' : 'pt-4 pb-8 px-4'}`}>
      
      {/* ── CHECKOUT MODAL OVERLAY ── */}
      {activeItem && (
        <div className="fixed inset-0 z-[270] bg-black/85 flex items-center justify-center p-4">
          <div className="relative bg-neutral-900 border-2 border-amber-500/40 rounded-[2.5rem] p-6 max-w-md w-full shadow-2xl flex flex-col gap-4 text-left font-sans animate-fade-in text-white">
            
            {/* Header */}
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <div>
                <span className="text-[9px] font-black uppercase tracking-[0.25em] text-amber-400">Imperial Banking Guild</span>
                <h3 className="text-lg font-brand text-white uppercase mt-0.5" style={{ fontFamily: FONT }}>
                  Secure Checkout
                </h3>
              </div>
              {checkoutStep !== 'processing' && (
                <button
                  onClick={() => setActiveItem(null)}
                  className="w-8 h-8 rounded-full bg-white/5 border border-white/10 text-white font-bold flex items-center justify-center hover:scale-105 transition"
                >
                  ✕
                </button>
              )}
            </div>

            {checkoutStep === 'form' && (
              <form onSubmit={handlePayment} className="space-y-4 text-xs">
                {/* Item summary banner */}
                <div className="p-3 bg-white/5 border border-white/5 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-3xl">{activeItem.icon}</span>
                    <div>
                      <span className="font-bold block text-yellow-50 text-[13px]">{activeItem.name}</span>
                      <span className="text-amber-400 font-bold block">
                        {activeItem.type === 'coin' && `+${activeItem.value} Coins`}
                        {activeItem.type === 'gem' && `+${activeItem.value} Gems`}
                        {activeItem.type === 'pass' && '30-Day Golden Pass'}
                        {activeItem.type === 'estate' && 'Premium Estate Land Deed'}
                        {activeItem.type === 'business' && 'Commercial Business License'}
                      </span>
                    </div>
                  </div>
                  <span className="text-base font-bold text-white bg-white/15 px-3 py-1 rounded-lg">
                    {activeItem.price}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 text-stone-300 space-y-2 leading-relaxed font-sans">
                  <p className="text-amber-400 font-bold text-[11px] uppercase tracking-wider">🔒 Sandbox Test Mode</p>
                  <p className="text-[11px]">
                    Toffeetowns real money billing simulation. We support secure checkouts with UPI, Stripe and Razorpay.
                  </p>
                  <p className="text-[10px] text-white/50">
                    No actual payment details will be requested. Click the button below to simulate a successful sandbox transaction of {activeItem.price}.
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-brand font-black uppercase tracking-wider text-xs rounded-xl hover:scale-102 active:scale-98 transition duration-200"
                >
                  Pay {activeItem.price} (Sandbox) 🧪
                </button>
              </form>
            )}

            {checkoutStep === 'processing' && (
              <div className="flex flex-col items-center justify-center py-10 gap-4 text-center">
                <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                <div>
                  <h4 className="font-bold text-white text-sm">Processing Payment</h4>
                  <p className="text-[11px] text-neutral-400 mt-1">Settle dues through Imperial Bank registry vault...</p>
                </div>
              </div>
            )}

            {checkoutStep === 'success' && (
              <div className="flex flex-col items-center justify-center py-6 gap-4 text-center">
                <span className="text-5xl animate-bounce text-emerald-400">✓</span>
                <div>
                  <h4 className="font-brand text-emerald-400 text-lg uppercase leading-none" style={{ fontFamily: FONT }}>Transaction Success!</h4>
                  <p className="text-xs text-neutral-200 mt-2 font-medium">
                    Unlocked <span className="text-emerald-400 font-bold">{activeItem.name}</span> successfully.
                  </p>
                </div>
                <div className="bg-white/5 border border-white/5 p-3 rounded-xl w-full text-[10px] text-neutral-400 space-y-1 text-left font-mono">
                  <div>Status: Settled</div>
                  <div>Invoice: {invoiceId}</div>
                  <div>Amount: {activeItem.price}</div>
                  <div>Settled On: {new Date().toLocaleDateString()}</div>
                </div>
                <button
                  onClick={() => setActiveItem(null)}
                  className="w-full py-2.5 bg-neutral-800 border border-white/10 hover:bg-neutral-750 text-white font-bold rounded-xl text-xs transition"
                >
                  Return to Treasury Page
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* ── MAIN LAYOUT CONTAINER ── */}
      <div className={`rounded-[2.5rem] border-[3px] border-emerald-500/40 bg-black/60 p-6 flex flex-col justify-between overflow-visible shadow-[8px_8px_0px_0px_rgba(16,185,129,0.35)] relative transition-all duration-700 ease-in-out ${
        headerHidden ? 'w-[92vw] h-auto min-h-[90vh]' : 'w-[92vw] h-auto min-h-[82vh]'
      }`}>
        
        {/* Header */}
        <div className="relative flex items-center justify-between border-b border-white/10 pb-4 shrink-0">
          <div className="z-10">
            <button
              onClick={() => setPage('desk')}
              className="px-4 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 rounded-full text-xs font-brand uppercase tracking-wider transition duration-200"
              style={{ fontFamily: '"Josefin Sans", sans-serif' }}
            >
              🏠 Back to Desk
            </button>
          </div>
          <div className="absolute inset-x-0 top-0 bottom-4 flex items-center justify-center pointer-events-none">
            <h2 className="text-xl md:text-2xl font-brand text-amber-400 uppercase tracking-wider pointer-events-auto" style={{ fontFamily: FONT }}>
              🪙 Confection Treasury & Premium Shop
            </h2>
          </div>
          <div className="flex gap-4 items-center z-10 font-mono text-xs">
            <div className="flex items-center gap-1 bg-white/5 border border-white/10 px-3 py-1 rounded-full text-yellow-400">
              <span>🪙</span> <span>{coins} Coins</span>
            </div>
            <div className="flex items-center gap-1 bg-white/5 border border-white/10 px-3 py-1 rounded-full text-cyan-400">
              <span>💎</span> <span>{gems} Gems</span>
            </div>
          </div>
        </div>

        {/* Content Panel */}
        <div className="flex-grow my-6 flex flex-col xl:flex-row gap-6 max-w-6xl w-full mx-auto text-left">
          
          {/* LEFT: Golden Citizen Pass Subscription */}
          <div className="w-full xl:w-[45%] flex flex-col gap-5">
            
            {/* Membership Card */}
            <div className="rounded-3xl border-2 border-amber-400/50 bg-gradient-to-br from-neutral-900 via-amber-950/20 to-neutral-950 p-6 flex flex-col justify-between relative overflow-hidden shadow-xl min-h-[380px]">
              {/* Shining Overlay */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.12)_0%,transparent_75%)] pointer-events-none" />
              
              <div>
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[9px] font-black uppercase tracking-[0.25em] text-amber-400 block mb-1">Monthly Subscription</span>
                    <h3 className="text-xl font-brand text-white uppercase" style={{ fontFamily: FONT }}>
                      👑 Golden Citizen Pass
                    </h3>
                  </div>
                  <span className="text-lg font-black text-amber-300 bg-amber-400/10 border border-amber-400/30 px-3 py-0.5 rounded-full font-mono">
                    ₹199 / mo
                  </span>
                </div>

                <p className="text-[11.5px] text-white/70 leading-relaxed mt-2 font-sans">
                  The ultimate premium allowance passport for Ganache Grove. Support the developers and unlock extreme quality-of-life upgrades.
                </p>

                {/* 8 Perks List */}
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10.5px] text-neutral-300">
                  <div className="flex items-center gap-1.5">
                    <span className="text-amber-400">💎</span> <span>Daily Gems (20/day)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-amber-400">🎟️</span> <span>Exclusive Festivals</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-amber-400">🎒</span> <span>Larger Warehouse (+200%)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-amber-400">✨</span> <span>Bonus XP (1.5x Multiplier)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-amber-400">🛋️</span> <span>Monthly Furniture Set</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-amber-400">🎭</span> <span>Free Theatre Entries</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-amber-400">Monorail</span> <span>Private Cabin (6x speed)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-amber-400">📖</span> <span>Early Access Stories</span>
                  </div>
                </div>
              </div>

              {/* Status or Checkout action */}
              <div className="mt-6 pt-4 border-t border-white/10 z-10">
                {goldenCitizenPass ? (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center bg-emerald-500/10 border border-emerald-500/25 p-3 rounded-2xl">
                      <div>
                        <span className="text-emerald-400 text-[10px] uppercase font-bold tracking-wider block">Pass Status: Active ✓</span>
                        <span className="text-[10px] text-white/50">Expires: {new Date(goldenCitizenPassExpiry || '').toLocaleDateString()}</span>
                      </div>
                      <button
                        onClick={handleClaimGems}
                        disabled={lastGemClaimDate === new Date().toDateString()}
                        className={`px-4 py-2 font-brand font-black uppercase text-[10px] tracking-wider rounded-xl transition ${
                          lastGemClaimDate === new Date().toDateString()
                            ? 'bg-neutral-800 text-neutral-500 border border-white/5'
                            : 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-black hover:scale-105 active:scale-95 animate-pulse'
                        }`}
                        style={{ fontFamily: '"Josefin Sans", sans-serif' }}
                      >
                        {lastGemClaimDate === new Date().toDateString() ? 'Claimed Today ✓' : 'Claim Daily Gems 💎'}
                      </button>
                    </div>
                    {dailyClaimMessage && (
                      <p className="text-center font-bold text-cyan-400 text-[11px] animate-pulse">{dailyClaimMessage}</p>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => startCheckout('golden-pass', 'Golden Citizen Pass', 'pass', '₹199', 0, '👑')}
                    className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-brand font-black uppercase tracking-wider text-xs rounded-2xl hover:scale-102 active:scale-98 transition duration-200 shadow-lg text-center"
                    style={{ fontFamily: '"Josefin Sans", sans-serif' }}
                  >
                    Subscribe for ₹199 / month 💳
                  </button>
                )}
              </div>
            </div>

            {/* Transaction Ledger */}
            <div className="flex-1 rounded-3xl border-2 border-emerald-500/35 bg-black/45 p-4 flex flex-col min-h-[160px] overflow-hidden">
              <h3 className="text-[9px] font-black uppercase tracking-[0.25em] text-cyan-400 mb-2 shrink-0">
                Transaction Ledger History
              </h3>
              <div className="flex-grow overflow-y-auto custom-scrollbar pr-1 space-y-1.5 text-xs">
                {coinHistory.length === 0 ? (
                  <p className="text-white/40 italic text-center mt-6">No recent transactions.</p>
                ) : (
                  coinHistory.map((tx) => (
                    <div key={tx.id} className="p-2 bg-white/5 border border-white/5 rounded-xl flex items-center justify-between gap-2">
                      <div>
                        <p className="font-bold text-white truncate text-[11px]">{tx.source}</p>
                        <p className="text-[9.5px] text-white/40 mt-0.5">{new Date(tx.date).toLocaleTimeString()}</p>
                      </div>
                      <span className={`font-bold font-mono text-[10.5px] ${tx.type === 'earned' ? 'text-emerald-400' : 'text-red-400'}`}>
                        {tx.type === 'earned' ? '+' : '-'}{tx.amount}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* RIGHT: Coin Packs, Gem Packs, and Deeds & Licenses */}
          <div className="flex-1 flex flex-col gap-6">
            
            {/* Deeds & Business Licenses (₹99 One-Time each) */}
            <div className="rounded-3xl border-2 border-pink-500/30 bg-black/45 p-5">
              <span className="text-[9px] font-black uppercase tracking-[0.25em] text-pink-400 block mb-1">One-Time Premium Expansion Permitting</span>
              <h3 className="text-base font-brand text-white uppercase mt-0.5" style={{ fontFamily: FONT }}>
                🏡 Local Estates &amp; Businesses (Ganache Grove)
              </h3>
              <p className="text-[11px] text-neutral-400 mt-1 mb-4 leading-normal">
                These premium expansions are **not included** in the membership. Establish ownership of private lands or trade licenses.
              </p>

              <div className="space-y-4">
                {PREMIUM_ITEMS.map((item) => {
                  const isOwned = item.type === 'estate' 
                    ? ownedEstates.includes(item.id) 
                    : ownedBusinesses.includes(item.id);

                  return (
                    <div key={item.id} className={`p-4 rounded-2xl border-2 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all ${
                      isOwned ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-white/10 bg-white/5 hover:border-white/20'
                    }`}>
                      <div className="flex gap-3">
                        <span className="text-3xl shrink-0">{item.icon}</span>
                        <div>
                          <h4 className="font-bold text-white text-sm">{item.name}</h4>
                          <p className="text-[10px] text-neutral-400 leading-snug mt-0.5">{item.description}</p>
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {item.perks.map((p, idx) => (
                              <span key={idx} className="bg-white/5 border border-white/5 px-2 py-0.5 rounded text-[8px] text-neutral-300 font-semibold font-sans">
                                ✓ {p}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="shrink-0 w-full md:w-auto flex md:flex-col items-center md:items-end justify-between gap-2 border-t md:border-t-0 border-white/5 pt-3 md:pt-0">
                        <span className="text-xs font-mono font-bold text-white px-2.5 py-1 rounded bg-black/45 border border-white/10">
                          {item.price}
                        </span>
                        {isOwned ? (
                          <span className="px-3 py-1 bg-emerald-600/35 border border-emerald-500/40 text-emerald-300 text-[9px] uppercase font-black tracking-wider rounded-xl">
                            Unlocked ✓
                          </span>
                        ) : (
                          <button
                            onClick={() => startCheckout(item.id, item.name, item.type, item.price, 0, item.icon)}
                            className="px-3.5 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-brand font-black uppercase text-[9px] tracking-wider rounded-xl hover:scale-105 active:scale-95 transition"
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
            </div>

            {/* Gems Packages */}
            <div className="rounded-3xl border-2 border-cyan-500/35 bg-black/45 p-5">
              <span className="text-[9px] font-black uppercase tracking-[0.25em] text-cyan-400 block mb-1">County Hard Currency Shop</span>
              <h3 className="text-base font-brand text-white uppercase mt-0.5" style={{ fontFamily: FONT }}>
                💎 Premium Gem Packages
              </h3>
              <p className="text-[11px] text-neutral-400 mt-1 mb-4 leading-normal">
                Acquire premium crystals to unlock early access theatrical plays and exclusive furniture cosmetics.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {GEM_PACKAGES.map((pack) => (
                  <div key={pack.id} className={`p-4 rounded-2xl border-2 flex flex-col justify-between text-center gap-3 transition hover:scale-[1.01] ${
                    pack.recommended ? 'border-cyan-400/50 bg-cyan-500/5 shadow-md' : 'border-white/10 bg-white/5'
                  }`}>
                    <div className="space-y-1">
                      <span className="text-3xl block filter drop-shadow-md">{pack.icon}</span>
                      <h4 className="font-bold text-white text-xs font-brand truncate">{pack.name}</h4>
                      <span className="text-sm font-black text-cyan-400 block font-mono">+{pack.gems} Gems</span>
                      <p className="text-[10px] text-white/50 leading-snug">{pack.description}</p>
                    </div>

                    <div className="space-y-2 border-t border-white/5 pt-2 mt-1">
                      <span className="text-xs font-mono font-bold text-neutral-300 block">{pack.price}</span>
                      <button
                        onClick={() => startCheckout(pack.id, pack.name, 'gem', pack.price, pack.gems, pack.icon)}
                        className="w-full py-1.5 bg-gradient-to-r from-cyan-500 to-blue-500 text-black font-brand font-black uppercase text-[9px] tracking-wider rounded-xl hover:scale-105 active:scale-95 transition"
                        style={{ fontFamily: '"Josefin Sans", sans-serif' }}
                      >
                        Buy Pack
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cocoa Coins Packages */}
            <div className="rounded-3xl border-2 border-emerald-500/35 bg-black/45 p-5">
              <span className="text-[9px] font-black uppercase tracking-[0.25em] text-emerald-400 block mb-1">Local Soft Currency Shop</span>
              <h3 className="text-base font-brand text-white uppercase mt-0.5" style={{ fontFamily: FONT }}>
                🪙 Cocoa Coins Allowance Packages
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                {COIN_PACKAGES.map((pack) => (
                  <div key={pack.id} className={`p-4 rounded-2xl border-2 flex flex-col justify-between text-center gap-3 transition hover:scale-[1.01] ${
                    pack.recommended ? 'border-amber-400/50 bg-amber-500/5 shadow-md' : 'border-white/10 bg-white/5'
                  }`}>
                    <div className="space-y-1">
                      <span className="text-3xl block filter drop-shadow-md">{pack.icon}</span>
                      <h4 className="font-bold text-white text-xs font-brand truncate">{pack.name}</h4>
                      <span className="text-sm font-black text-emerald-400 block font-mono">+{pack.coins} Coins</span>
                      <p className="text-[10px] text-white/50 leading-snug">{pack.description}</p>
                    </div>

                    <div className="space-y-2 border-t border-white/5 pt-2 mt-1">
                      <span className="text-xs font-mono font-bold text-neutral-300 block">{pack.price}</span>
                      <button
                        onClick={() => startCheckout(pack.id, pack.name, 'coin', pack.price, pack.coins, pack.icon)}
                        className="w-full py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-black font-brand font-black uppercase text-[9px] tracking-wider rounded-xl hover:scale-105 active:scale-95 transition"
                        style={{ fontFamily: '"Josefin Sans", sans-serif' }}
                      >
                        Buy Pack
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* Footer */}
        <div className="p-3 border-t border-white/10 flex items-center justify-center text-xs text-white/40 shrink-0 select-none">
          All real-money purchases are simulated in sandbox test mode. Premium deeds and licenses apply inside Ganache Grove province.
        </div>

      </div>
    </div>
  );
};

export default CoinsPage;
