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
  color: string;
}

const COIN_PACKAGES: CoinPackage[] = [
  {
    id: 'pack-small',
    name: 'Tallow Bag of Cocoa Coins',
    coins: 120,
    price: '$0.99',
    icon: '💰',
    description: 'A modest coin bag to cover minor dues.',
    color: 'border-yellow-600/30 text-yellow-500 bg-yellow-950/10'
  },
  {
    id: 'pack-medium',
    name: 'Chest of Hazelnut Cocoa Coins',
    coins: 550,
    price: '$3.99',
    icon: '📦',
    description: 'Settle multiple months of dues and unlock items!',
    recommended: true,
    color: 'border-amber-400/50 text-amber-400 bg-amber-950/20'
  },
  {
    id: 'pack-large',
    name: 'Imperial Coffer of Cocoa Coins',
    coins: 1500,
    price: '$9.99',
    icon: '👑',
    description: 'Become the wealthiest resident in Cocoawood County!',
    color: 'border-emerald-500/30 text-emerald-400 bg-emerald-950/10'
  }
];

const CoinsPage: React.FC = () => {
  const { coins, addCoins, coinHistory, setPage } = useTTStore();
  const [clickCount, setClickCount] = useState(0);

  // Shop checkout states
  const [activePackage, setActivePackage] = useState<CoinPackage | null>(null);
  const [checkoutStep, setCheckoutStep] = useState<'form' | 'processing' | 'success'>('form');
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [invoiceId, setInvoiceId] = useState('');

  const handleCoinClick = () => {
    setClickCount((c) => c + 1);
    if (clickCount + 1 >= 10) {
      addCoins(25, 'Cocoa Clicker Reward');
      setClickCount(0);
    }
  };

  const startCheckout = (pack: CoinPackage) => {
    setActivePackage(pack);
    setCheckoutStep('form');
    setCheckoutError(null);
    // eslint-disable-next-line react-hooks/purity
    setInvoiceId('TX-' + Math.random().toString(36).slice(2).toUpperCase());
  };

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutError(null);
    setCheckoutStep('processing');
    
    setTimeout(() => {
      if (activePackage) {
        addCoins(activePackage.coins, `Imperial Shop: ${activePackage.name}`);
        setCheckoutStep('success');
      }
    }, 2050);
  };

  return (
    <div className="h-full w-full flex items-center justify-center p-6 select-none relative">
      
      {/* ── CHECKOUT MODAL OVERLAY ── */}
      {activePackage && (
        <div className="fixed inset-0 z-[270] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative bg-stone-900 border-2 border-amber-500/40 rounded-[2rem] p-6 max-w-md w-full shadow-2xl flex flex-col gap-4 text-left font-sans animate-fade-in text-white">
            
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
                  onClick={() => setActivePackage(null)}
                  className="w-8 h-8 rounded-full bg-white/5 border border-white/10 text-white font-bold flex items-center justify-center hover:scale-105 transition"
                >
                  ✕
                </button>
              )}
            </div>

            {checkoutStep === 'form' && (
              <form onSubmit={handlePayment} className="space-y-4 text-xs">
                {/* Package summary banner */}
                <div className="p-3 bg-white/5 border border-white/5 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{activePackage.icon}</span>
                    <div>
                      <span className="font-bold block text-yellow-50">{activePackage.name}</span>
                      <span className="text-emerald-400 font-bold block">+{activePackage.coins} Coins</span>
                    </div>
                  </div>
                  <span className="text-base font-bold text-white bg-white/15 px-3 py-1 rounded-lg">
                    {activePackage.price}
                  </span>
                </div>

                {checkoutError && (
                  <p className="text-red-400 font-bold animate-pulse text-[11px]">{checkoutError}</p>
                )}

                <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 text-stone-300 space-y-2 leading-relaxed font-sans">
                  <p className="text-amber-400 font-bold text-[11px] uppercase tracking-wider">🔒 Sandbox Test Mode</p>
                  <p className="text-[11px]">
                    Toffeetowns real money billing is currently in development. We are integrating secure checkouts with Stripe and Razorpay.
                  </p>
                  <p className="text-[10px] text-white/50">
                    No actual payment details will be requested. Click the button below to simulate a successful sandbox transaction.
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-brand font-black uppercase tracking-wider text-xs rounded-xl hover:scale-102 active:scale-98 transition duration-200"
                >
                  Complete Sandbox Purchase (Free) 🧪
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
                <span className="text-5xl animate-bounce">✓</span>
                <div>
                  <h4 className="font-brand text-emerald-400 text-lg uppercase leading-none" style={{ fontFamily: FONT }}>Transaction Success!</h4>
                  <p className="text-xs text-neutral-200 mt-2 font-medium">
                    Deposited <span className="text-emerald-400 font-bold">+{activePackage.coins} Coins</span> into Cocoa Treasury.
                  </p>
                </div>
                <div className="bg-white/5 border border-white/5 p-3 rounded-xl w-full text-[10px] text-neutral-400 space-y-1 text-left font-mono">
                  <div>Status: Settled</div>
                  <div>Invoice: {invoiceId}</div>
                  <div>Settled On: {new Date().toLocaleDateString()}</div>
                </div>
                <button
                  onClick={() => setActivePackage(null)}
                  className="w-full py-2.5 bg-neutral-850 border border-white/10 hover:bg-neutral-800 hover:text-white text-white font-bold rounded-xl text-xs transition"
                >
                  Return to Treasury Page
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* ── MAIN LAYOUT CONTAINER ── */}
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
            🪙 Confection Treasury & Coin Shop
          </h2>
          <div className="w-[100px]" /> {/* Spacer */}
        </div>

        {/* Content Panel */}
        <div className="flex-1 my-6 flex flex-col lg:flex-row gap-6 overflow-hidden min-h-0 max-w-5xl w-full mx-auto">
          
          {/* LEFT: Coin clicker + Transaction History */}
          <div className="w-full lg:w-[45%] shrink-0 h-full flex flex-col gap-5 min-h-0">
            {/* Clicker Card */}
            <div className="flex-grow rounded-3xl border border-white/10 bg-black/30 flex flex-col items-center justify-center p-5 gap-4 relative shrink-0 overflow-hidden">
              {/* Premium background radial glow */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(251,191,36,0.08)_0%,transparent_70%)] pointer-events-none" />
              
              <h3 className="text-sm font-brand text-yellow-300 uppercase tracking-wider animate-pulse" style={{ fontFamily: FONT }}>
                🍬 Cocoa Coin Clicker
              </h3>
              <p className="text-[10px] text-white/50 text-center max-w-xs leading-normal">
                Tap the coin 10 times to claim 25 free Cocoa Coins!
              </p>

              <button
                onClick={handleCoinClick}
                className="w-28 h-28 rounded-full bg-gradient-to-tr from-yellow-500 via-amber-400 to-yellow-600 hover:scale-110 active:scale-90 active:rotate-12 shadow-[0_0_20px_rgba(251,191,36,0.4)] hover:shadow-[0_0_40px_rgba(251,191,36,0.7)] active:shadow-[0_0_60px_rgba(251,191,36,0.9)] transition-all duration-150 flex items-center justify-center relative group"
              >
                <span className="text-4xl group-hover:scale-110 group-hover:rotate-12 transition-transform duration-200 select-none">🪙</span>
                {clickCount > 0 && (
                  <span className="absolute inset-0 flex items-center justify-center bg-black/40 text-white font-brand text-base rounded-full backdrop-blur-[1px] border-2 border-amber-400/30 scale-105 transition-all" style={{ fontFamily: '"Josefin Sans", sans-serif' }}>
                    {clickCount}/10
                  </span>
                )}
              </button>

              <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1 rounded-full text-[11px] font-semibold text-white/70">
                <span>Wallet:</span>
                <span className="text-yellow-400 font-bold">{coins} Coins</span>
              </div>
            </div>

            {/* Transaction History Card */}
            <div className="h-[45%] border border-white/10 bg-black/25 rounded-3xl p-4 flex flex-col justify-start overflow-hidden min-h-0">
              <h3 className="text-[9px] font-black uppercase tracking-[0.25em] text-cyan-400 mb-2 shrink-0">
                Transaction Ledger History
              </h3>
              <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 space-y-1.5">
                {coinHistory.length === 0 ? (
                  <p className="text-[11.5px] text-white/40 italic text-center mt-6">No recent transactions.</p>
                ) : (
                  coinHistory.map((tx) => (
                    <div key={tx.id} className="p-2 bg-white/5 border border-white/5 rounded-xl flex items-center justify-between text-[11px] gap-2">
                      <div className="min-w-0">
                        <p className="font-bold text-white truncate">{tx.source}</p>
                        <p className="text-[9.5px] text-white/40 mt-0.5">{new Date(tx.date).toLocaleTimeString()}</p>
                      </div>
                      <span
                        className={`font-bold shrink-0 font-mono text-[10.5px] ${
                          tx.type === 'earned' ? 'text-emerald-400' : 'text-red-400'
                        }`}
                      >
                        {tx.type === 'earned' ? '+' : '-'}{tx.amount}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* RIGHT: Curated Imperial Coin Shop */}
          <div className="flex-1 h-full border border-white/10 bg-black/35 rounded-3xl p-5 flex flex-col justify-between overflow-hidden gap-4">
            <div>
              <span className="text-[9px] font-black uppercase tracking-[0.25em] text-amber-400 block">Imperial Coin Shop</span>
              <h3 className="text-base font-brand text-white uppercase mt-0.5" style={{ fontFamily: FONT }}>
                Premium Treasury Registry
              </h3>
              <p className="text-[11.5px] text-neutral-400 leading-normal mt-1 text-left">
                Purchase currency allowance directly from the county registry. Supports the province developers and unlocks immediate game benefits.
              </p>
            </div>

            <div className="space-y-3 flex-1 overflow-y-auto custom-scrollbar pr-1">
              {COIN_PACKAGES.map((pack) => (
                <div
                  key={pack.id}
                  className={`p-4 rounded-2xl border-2 flex flex-col md:flex-row justify-between items-center gap-3.5 transition-all duration-200 hover:scale-[1.01] ${
                    pack.recommended ? 'border-amber-400/60 bg-amber-500/5 shadow-[0_0_15px_rgba(245,158,11,0.1)]' : 'border-white/10 bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3 w-full md:w-auto">
                    <span className="text-3xl filter drop-shadow-md">{pack.icon}</span>
                    <div className="text-left">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-yellow-50 text-sm leading-none">{pack.name}</h4>
                        {pack.recommended && (
                          <span className="bg-amber-400 text-black text-[8px] font-brand uppercase tracking-wider px-1.5 py-0.5 rounded font-black animate-pulse">
                            Best Value
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-black text-emerald-400 block mt-1">+{pack.coins} Cocoa Coins</span>
                      <p className="text-[10.5px] text-white/50 mt-0.5 font-sans leading-snug">{pack.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-white/5 pt-2.5 md:pt-0">
                    <span className="text-sm font-bold text-white px-3 py-1 rounded bg-black/45 border border-white/10 font-mono">
                      {pack.price}
                    </span>
                    <button
                      onClick={() => startCheckout(pack)}
                      className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-black font-brand font-black uppercase text-[10px] tracking-wider rounded-xl transition hover:scale-105 active:scale-95 shadow-md shrink-0 animate-bounce"
                      style={{ fontFamily: '"Josefin Sans", sans-serif' }}
                    >
                      Purchase 💳
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-3 border-t border-white/10 flex items-center justify-center text-xs text-white/40 shrink-0 select-none">
          Cocoa Coins are the local currency. Use them to train skills, buy tools, and fund town events.
        </div>

      </div>
    </div>
  );
};

export default CoinsPage;
