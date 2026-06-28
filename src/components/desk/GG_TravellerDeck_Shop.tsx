import React, { useState, useEffect, useCallback } from 'react';
import { useTTStore } from '../../store/useTTStore';
import { GG_TravellerDeck_Header } from './GG_TravellerDeck_Header';
import type { SubPage } from '../../lib/uiConstants';
import { cozyAudio } from '../../utils/audioHelper';

interface GG_TravellerDeck_ShopProps {
  setSubPage: (page: SubPage) => void;
  popPage: () => void;
  triggerFeedback: (msg: string) => void;
}

interface ProduceItem {
  id: string;
  name: string;
  category: 'Vegetable' | 'Fruit' | 'Flower' | 'Commodity';
  basePrice: number;
  desc: string;
  theme: string;
  border: string;
  glow: string;
  textCol: string;
  emoji: string;
}

const PRODUCE_ITEMS: ProduceItem[] = [
  // Primary commodities (from screenshot)
  {
    id: 'cocoa-pods',
    name: 'Cocoa Pods',
    category: 'Commodity',
    basePrice: 10,
    desc: 'Rich, raw cocoa beans harvested from the premium pods of Ganache Grove.',
    theme: 'from-amber-955/60 via-amber-900/35 to-stone-900',
    border: 'border-amber-500/30',
    glow: 'shadow-[0_0_15px_rgba(245,158,11,0.15)]',
    textCol: 'text-amber-300',
    emoji: '🟫'
  },
  {
    id: 'honey-syrup',
    name: 'Honey Syrup',
    category: 'Commodity',
    basePrice: 24,
    desc: 'Thick, sweet nectar harvested from bees nesting in the chocolate valleys.',
    theme: 'from-yellow-950/60 via-yellow-900/35 to-stone-900',
    border: 'border-yellow-500/30',
    glow: 'shadow-[0_0_15px_rgba(234,179,8,0.15)]',
    textCol: 'text-yellow-300',
    emoji: '🍯'
  },
  {
    id: 'sweetbread',
    name: 'Sweetbread',
    category: 'Commodity',
    basePrice: 12,
    desc: 'Golden oven-baked rolls infused with fine sucrose crystals and cinnamon.',
    theme: 'from-orange-950/60 via-orange-900/35 to-stone-900',
    border: 'border-orange-500/30',
    glow: 'shadow-[0_0_15px_rgba(249,115,22,0.15)]',
    textCol: 'text-orange-300',
    emoji: '🍞'
  },
  {
    id: 'lavender-bunch',
    name: 'Lavender Bunch',
    category: 'Commodity',
    basePrice: 18,
    desc: 'Fragrant purple flower bunches carrying a calming aroma from the peaks.',
    theme: 'from-purple-950/60 via-purple-900/35 to-stone-900',
    border: 'border-purple-500/30',
    glow: 'shadow-[0_0_15px_rgba(168,85,247,0.15)]',
    textCol: 'text-purple-300',
    emoji: '🪻'
  },
  
  // Vegetables (Original list)
  {
    id: 'glazed-carrots',
    name: 'Glazed Carrots',
    category: 'Vegetable',
    basePrice: 10,
    desc: 'Harvested from the sticky soils of Ganache Grove, these carrots have a natural sugary glaze.',
    theme: 'from-emerald-950/60 via-emerald-900/35 to-stone-900',
    border: 'border-emerald-500/30',
    glow: 'shadow-[0_0_15px_rgba(16,185,129,0.15)]',
    textCol: 'text-emerald-300',
    emoji: '🥕'
  },
  {
    id: 'sugar-beets',
    name: 'Sugar Beets',
    category: 'Vegetable',
    basePrice: 15,
    desc: 'Dense, purple beets crystallizing with high-purity sucrose from underground veins.',
    theme: 'from-emerald-955/60 via-emerald-900/35 to-stone-900',
    border: 'border-emerald-500/30',
    glow: 'shadow-[0_0_15px_rgba(16,185,129,0.15)]',
    textCol: 'text-emerald-300',
    emoji: '🍠'
  },
  {
    id: 'honey-mushrooms',
    name: 'Honey Mushrooms',
    category: 'Vegetable',
    basePrice: 25,
    desc: 'Glowing cap mushrooms growing under dark cocoa canopies, oozing sweet golden honey nectar.',
    theme: 'from-emerald-900/60 via-emerald-950/40 to-stone-900',
    border: 'border-emerald-500/30',
    glow: 'shadow-[0_0_15px_rgba(16,185,129,0.15)]',
    textCol: 'text-emerald-300',
    emoji: '🍄'
  },
  
  // Fruits (Original list)
  {
    id: 'canopy-bananas',
    name: 'Canopy Bananas',
    category: 'Fruit',
    basePrice: 12,
    desc: 'Creamy, yellow bananas grown in the high humid canopy of Banoffee Valley.',
    theme: 'from-rose-955/60 via-rose-900/35 to-stone-900',
    border: 'border-rose-500/30',
    glow: 'shadow-[0_0_15px_rgba(244,63,94,0.15)]',
    textCol: 'text-rose-300',
    emoji: '🍌'
  },
  {
    id: 'marshmallow-strawberries',
    name: 'Marshmallow Strawberries',
    category: 'Fruit',
    basePrice: 20,
    desc: 'Soft, fluffy berries tasting exactly like sweet strawberry-infused marshmallows.',
    theme: 'from-rose-950/60 via-rose-900/35 to-stone-900',
    border: 'border-rose-500/30',
    glow: 'shadow-[0_0_15px_rgba(244,63,94,0.15)]',
    textCol: 'text-rose-300',
    emoji: '🍓'
  },
  {
    id: 'ganache-cherries',
    name: 'Ganache Cherries',
    category: 'Fruit',
    basePrice: 30,
    desc: 'Grown in the royal orchards, these cherries are naturally dipped in a dark chocolate skin.',
    theme: 'from-rose-955/70 via-rose-900/40 to-stone-900',
    border: 'border-rose-500/30',
    glow: 'shadow-[0_0_15px_rgba(244,63,94,0.15)]',
    textCol: 'text-rose-300',
    emoji: '🍒'
  },
  
  // Flowers (Original list)
  {
    id: 'butterscotch-blossoms',
    name: 'Butterscotch Blossoms',
    category: 'Flower',
    basePrice: 18,
    desc: 'Sunny yellow wildflowers with petals that taste of warm, rich butterscotch syrup.',
    theme: 'from-amber-955/60 via-amber-900/35 to-stone-900',
    border: 'border-amber-500/30',
    glow: 'shadow-[0_0_15px_rgba(245,158,11,0.15)]',
    textCol: 'text-amber-300',
    emoji: '🌼'
  },
  {
    id: 'peppermint-orchids',
    name: 'Peppermint Orchids',
    category: 'Flower',
    basePrice: 28,
    desc: 'Breathtaking orchids with a cooling minty scent that grow on glacial peaks.',
    theme: 'from-amber-900/60 via-amber-950/35 to-stone-900',
    border: 'border-amber-500/30',
    glow: 'shadow-[0_0_15px_rgba(245,158,11,0.15)]',
    textCol: 'text-amber-300',
    emoji: '🌸'
  },
  {
    id: 'caramelized-roses',
    name: 'Caramelized Roses',
    category: 'Flower',
    basePrice: 40,
    desc: 'Deep crimson roses with crystallized caramel dew drops frozen on their petals.',
    theme: 'from-amber-955/70 via-amber-900/40 to-stone-900',
    border: 'border-amber-500/30',
    glow: 'shadow-[0_0_15px_rgba(245,158,11,0.15)]',
    textCol: 'text-amber-300',
    emoji: '🌹'
  },
];

const COMMODITIES = [
  { id: 'cocoa-pods', name: 'Cocoa Pods', basePrice: 10, icon: '🟫', textCol: 'text-amber-300' },
  { id: 'honey-syrup', name: 'Honey Syrup', basePrice: 24, icon: '🍯', textCol: 'text-yellow-300' },
  { id: 'sweetbread', name: 'Sweetbread', basePrice: 12, icon: '🍞', textCol: 'text-orange-300' },
  { id: 'lavender-bunch', name: 'Lavender Bunch', basePrice: 18, icon: '🪻', textCol: 'text-purple-300' }
];

const RANK_WAREHOUSE_LIMITS: Record<string, { limit: number; cottage: string; color: string }> = {
  'newcomer': { limit: 15, cottage: 'Tent Shelter', color: 'text-stone-400' },
  'apprentice': { limit: 30, cottage: 'Tiny Oak Hollow', color: 'text-amber-400' },
  'resident': { limit: 50, cottage: 'Mossberry Stone Cottage', color: 'text-emerald-400' },
  'contributor': { limit: 100, cottage: 'Sweet Wafer Chalet', color: 'text-cyan-400' },
  'steward': { limit: 250, cottage: 'Hazelnut Terrace Villa', color: 'text-purple-400' },
};

export const GG_TravellerDeck_Shop: React.FC<GG_TravellerDeck_ShopProps> = ({
  setSubPage,
  popPage,
  triggerFeedback,
}) => {
  const {
    coins,
    spendCoins,
    addCoins,
    addLegacy,
    currentRoleId,
    homeTown,
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
    worldTime,
    setHeaderHidden,
  } = useTTStore();

  const [shopTab, setShopTab] = useState<'produce' | 'improvements' | 'estates' | 'permits'>('produce');



  // Periodic Cozy Market Sound effect playing every 35 seconds
  useEffect(() => {
    try {
      cozyAudio.playTradeEconomySound();
      cozyAudio.playCoins();
    } catch (e) {
      // Ignore background music block errors
    }

    const soundInterval = setInterval(() => {
      try {
        cozyAudio.playTradeEconomySound();
        setTimeout(() => {
          cozyAudio.playCoins();
        }, 600);
      } catch (e) {
        // Ignore background music block errors
      }
    }, 35000);

    return () => clearInterval(soundInterval);
  }, []);

  // Modals
  const [showWarehouseModal, setShowWarehouseModal] = useState(false);
  const [showMerchantModal, setShowMerchantModal] = useState(false);

  useEffect(() => {
    if (showWarehouseModal || showMerchantModal) {
      setHeaderHidden(true);
    } else {
      setHeaderHidden(false);
    }
    return () => {
      setHeaderHidden(false);
    };
  }, [showWarehouseModal, showMerchantModal, setHeaderHidden]);

  // Produce Inventory State
  const [inventory, setInventory] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('tt_market_produce_inventory');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return {
      'cocoa-pods': 12,
      'honey-syrup': 4,
      'sweetbread': 6,
      'lavender-bunch': 3,
      'glazed-carrots': 0,
      'sugar-beets': 0,
      'honey-mushrooms': 0,
      'canopy-bananas': 0,
      'marshmallow-strawberries': 0,
      'ganache-cherries': 0,
      'butterscotch-blossoms': 0,
      'peppermint-orchids': 0,
      'caramelized-roses': 0,
    };
  });

  const [marketPrices, setMarketPrices] = useState<Record<string, number>>({});
  const [marketDemands, setMarketDemands] = useState<Record<string, 'High' | 'Normal' | 'Low'>>({});
  const [marketTrends, setMarketTrends] = useState<Record<string, 'up' | 'down' | 'flat'>>({});

  // Market metrics (matching screenshot initially)
  const [earningsToday, setEarningsToday] = useState(() => {
    const saved = localStorage.getItem('tt_market_earnings_today');
    return saved ? parseInt(saved, 10) : 240;
  });
  const [totalTradesToday, setTotalTradesToday] = useState(() => {
    const saved = localStorage.getItem('tt_market_total_trades_today');
    return saved ? parseInt(saved, 10) : 7;
  });
  const [merchantLevel, setMerchantLevel] = useState(() => {
    const saved = localStorage.getItem('tt_market_merchant_level');
    return saved ? parseInt(saved, 10) : 2;
  });
  const [merchantXP, setMerchantXP] = useState(() => {
    const saved = localStorage.getItem('tt_market_merchant_xp');
    return saved ? parseInt(saved, 10) : 120;
  });

  // Ticking refresh countdown
  const [refreshTimeLeft, setRefreshTimeLeft] = useState(() => {
    const savedTime = localStorage.getItem('tt_market_refresh_time_left');
    if (savedTime) {
      const parsed = parseInt(savedTime, 10);
      if (!isNaN(parsed) && parsed > 0) return parsed;
    }
    return 20088; // ~05:34:48 in seconds
  });

  // Extra storage slots purchased
  const [extraSlots, setExtraSlots] = useState(() => {
    const saved = localStorage.getItem('tt_market_extra_warehouse_slots');
    return saved ? parseInt(saved, 10) : 0;
  });

  useEffect(() => {
    localStorage.setItem('tt_market_earnings_today', earningsToday.toString());
  }, [earningsToday]);

  useEffect(() => {
    localStorage.setItem('tt_market_total_trades_today', totalTradesToday.toString());
  }, [totalTradesToday]);

  useEffect(() => {
    localStorage.setItem('tt_market_merchant_level', merchantLevel.toString());
  }, [merchantLevel]);

  useEffect(() => {
    localStorage.setItem('tt_market_merchant_xp', merchantXP.toString());
  }, [merchantXP]);

  useEffect(() => {
    localStorage.setItem('tt_market_produce_inventory', JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem('tt_market_extra_warehouse_slots', extraSlots.toString());
  }, [extraSlots]);

  const shiftMarketRates = useCallback(() => {
    const newPrices: Record<string, number> = {};
    const newDemands: Record<string, 'High' | 'Normal' | 'Low'> = {};
    const newTrends: Record<string, 'up' | 'down' | 'flat'> = {};

    PRODUCE_ITEMS.forEach((item) => {
      const randVal = Math.random();
      let demand: 'High' | 'Normal' | 'Low';
      let trend: 'up' | 'down' | 'flat';
      let multiplier: number;

      if (randVal < 0.3) {
        demand = 'High';
        trend = 'up';
        multiplier = 1.3 + Math.random() * 0.5;
      } else if (randVal < 0.6) {
        demand = 'Low';
        trend = 'down';
        multiplier = 0.4 + Math.random() * 0.4;
      } else {
        demand = 'Normal';
        trend = Math.random() > 0.5 ? 'up' : 'down';
        multiplier = 0.9 + Math.random() * 0.2;
      }

      const finalPrice = Math.max(2, Math.round(item.basePrice * multiplier));
      newPrices[item.id] = finalPrice;
      newDemands[item.id] = demand;
      newTrends[item.id] = trend;
    });

    setMarketPrices(newPrices);
    setMarketDemands(newDemands);
    setMarketTrends(newTrends);

    localStorage.setItem('tt_market_prices', JSON.stringify(newPrices));
    localStorage.setItem('tt_market_demands', JSON.stringify(newDemands));
    localStorage.setItem('tt_market_trends', JSON.stringify(newTrends));
    triggerFeedback('📈 Market Shift! Commodity prices and demand tickers updated.');
  }, [triggerFeedback]);

  // Clock countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setRefreshTimeLeft((prev) => {
        const next = prev - 1;
        if (next <= 0) {
          shiftMarketRates();
          return 21600; // Reset to 6 hours
        }
        if (next % 10 === 0) {
          localStorage.setItem('tt_market_refresh_time_left', next.toString());
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [shiftMarketRates]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const addMerchantXP = (amount: number) => {
    const newXP = merchantXP + amount;
    const xpNeeded = 300;
    if (newXP >= xpNeeded) {
      setMerchantXP(newXP - xpNeeded);
      setMerchantLevel(prev => prev + 1);
      triggerFeedback(`🎉 Level Up! You are now a Level ${merchantLevel + 1} Merchant Novice!`);
    } else {
      setMerchantXP(newXP);
    }
  };

    // shiftMarketRates has been moved above the countdown timer effect

  useEffect(() => {
    const savedPrices = localStorage.getItem('tt_market_prices');
    const savedDemands = localStorage.getItem('tt_market_demands');
    const savedTrends = localStorage.getItem('tt_market_trends');

    if (savedPrices && savedDemands && savedTrends) {
      try {
        setMarketPrices(JSON.parse(savedPrices));
        setMarketDemands(JSON.parse(savedDemands));
        setMarketTrends(JSON.parse(savedTrends));
        return;
      } catch (e) {
        console.error(e);
      }
    }
    shiftMarketRates();
  }, [shiftMarketRates]);

  // Base and maximum capacity calculations
  const baseLimit = RANK_WAREHOUSE_LIMITS[currentRoleId || 'newcomer']?.limit || 15;
  const maxWarehouseCapacity = baseLimit + extraSlots;

  const getTotalWarehouseStock = () => {
    return Object.values(inventory).reduce((a, b) => a + b, 0);
  };

  // Derived Buy and Sell Price calculators
  const getCommodityPrices = (itemId: string, centerPrice: number) => {
    const isButterInflated = worldTime?.currentEvent?.title === 'Butter prices increase';
    const isSugarSpiked = worldTime?.currentEvent?.title === 'Sugar Prices Spike';
    const isRemedyHigh = worldTime?.currentEvent?.title === 'High Demand for Remedies';
    const isMarketLow = worldTime?.currentEvent?.title === 'Market Attendance Drops';

    let price = centerPrice;
    if (itemId === 'sweetbread' && isButterInflated) {
      price = Math.round(centerPrice * 1.25);
    }
    if (itemId === 'honey-syrup' && isSugarSpiked) {
      price = Math.round(centerPrice * 1.30);
    }
    if (itemId === 'lavender-bunch' && isRemedyHigh) {
      price = Math.round(centerPrice * 1.30);
    }
    if (isMarketLow) {
      price = Math.round(price * 0.80);
    }

    if (itemId === 'cocoa-pods') return { buy: Math.round(price * 0.8), sell: Math.round(price * 1.2) };
    if (itemId === 'honey-syrup') return { buy: Math.round(price * 0.83), sell: Math.round(price * 1.17) };
    if (itemId === 'sweetbread') return { buy: Math.round(price * 0.83), sell: Math.round(price * 1.17) };
    if (itemId === 'lavender-bunch') return { buy: Math.round(price * 0.83), sell: Math.round(price * 1.22) };
    return { buy: Math.max(1, Math.round(price * 0.85)), sell: Math.round(price * 1.15) };
  };

  const handleBuyProduce = (itemId: string, price: number, name: string) => {
    const currentStockTotal = getTotalWarehouseStock();
    if (currentStockTotal >= maxWarehouseCapacity) {
      triggerFeedback(`❌ Warehouse full (${currentStockTotal}/${maxWarehouseCapacity})! Expand storage or sell items.`);
      return;
    }

    if (coins < price) {
      triggerFeedback('❌ Insufficient Coins to purchase produce!');
      return;
    }
    if (spendCoins(price, `Bought produce option: ${name}`)) {
      setInventory((prev) => ({
        ...prev,
        [itemId]: (prev[itemId] || 0) + 1,
      }));
      setTotalTradesToday(prev => prev + 1);
      addMerchantXP(10);
      cozyAudio.playCoins();
      triggerFeedback(`🛒 Purchased 1x ${name} for ${price} Coins.`);
    }
  };

  const handleSellProduce = (itemId: string, price: number, name: string) => {
    const currentStock = inventory[itemId] || 0;
    if (currentStock <= 0) {
      triggerFeedback(`❌ You do not have any ${name} to sell!`);
      return;
    }
    
    // Featured merchant (+10% on cocoa pods)
    let finalPrice = price;
    if (itemId === 'cocoa-pods') {
      finalPrice = Math.round(price * 1.1);
    }

    addCoins(finalPrice, `Sold produce option: ${name}`);
    setInventory((prev) => ({
      ...prev,
      [itemId]: Math.max(0, prev[itemId] - 1),
    }));
    setEarningsToday(prev => prev + finalPrice);
    setTotalTradesToday(prev => prev + 1);
    addMerchantXP(15);
    cozyAudio.playCoins();
    triggerFeedback(`💰 Sold 1x ${name} for ${finalPrice} Coins ${itemId === 'cocoa-pods' ? '(+10% Finch Bonus!)' : ''}.`);
  };

  const buyExtraStorage = (cost: number, slotsToAdd: number) => {
    if (coins < cost) {
      triggerFeedback('❌ Insufficient Coins to upgrade warehouse!');
      return false;
    }
    if (spendCoins(cost, `Purchased Warehouse Upgrade +${slotsToAdd} slots`)) {
      setExtraSlots(prev => prev + slotsToAdd);
      cozyAudio.playCoins();
      cozyAudio.playChime();
      triggerFeedback(`🎉 Warehouse expanded! Added +${slotsToAdd} slots.`);
      return true;
    }
    return false;
  };

  // Opportunity Contracts State & Logic
  const [completedContracts, setCompletedContracts] = useState<Record<number, boolean>>({});

  const opportunities = [
    {
      id: 0,
      title: 'Trade Delivery',
      desc: 'Deliver cocoa crates to Riverside Docks.',
      coins: 60,
      legacy: 5,
      requires: { 'cocoa-pods': 2 },
      emoji: '🦫',
      color: 'border-emerald-500/20 text-emerald-400'
    },
    {
      id: 1,
      title: 'Caravan Supply Run',
      desc: 'Supply goods to the Forest Caravan.',
      coins: 90,
      legacy: 8,
      requires: { 'cocoa-pods': 1, 'honey-syrup': 1 },
      emoji: '🐎',
      color: 'border-amber-500/20 text-amber-400'
    },
    {
      id: 2,
      title: 'Festival Goods Delivery',
      desc: 'Deliver festival supplies to Town Square.',
      coins: 120,
      legacy: 10,
      requires: { 'sweetbread': 1, 'lavender-bunch': 1 },
      emoji: '🎁',
      color: 'border-rose-500/20 text-rose-400'
    }
  ];

  const handleCompleteContract = (index: number, reqItems: Record<string, number>, coinsReward: number, legacyReward: number, name: string) => {
    if (completedContracts[index]) {
      triggerFeedback("✉️ Contract is already completed!");
      return;
    }

    for (const [itemId, qty] of Object.entries(reqItems)) {
      const stock = inventory[itemId] || 0;
      if (stock < qty) {
        const itemName = PRODUCE_ITEMS.find(c => c.id === itemId)?.name || itemId;
        triggerFeedback(`❌ Need ${qty}x ${itemName} to complete this contract!`);
        return;
      }
    }

    setInventory((prev) => {
      const updated = { ...prev };
      for (const [itemId, qty] of Object.entries(reqItems)) {
        updated[itemId] = Math.max(0, updated[itemId] - qty);
      }
      return updated;
    });

    addCoins(coinsReward, `Completed market contract: ${name}`);
    addLegacy(legacyReward);
    setEarningsToday(prev => prev + coinsReward);
    setTotalTradesToday(prev => prev + 1);
    addMerchantXP(30);
    setCompletedContracts(prev => ({ ...prev, [index]: true }));

    cozyAudio.playCoins();
    cozyAudio.playChime();
    triggerFeedback(`✅ Delivered contract! Earned 🪙 ${coinsReward} and ⭐ ${legacyReward} Legacy.`);
  };

  const getWallpaper = () => {
    if (homeTown === 'ganache-grove') return '/wallpapers/MagicalGarden.png';
    if (homeTown === 'toffee-town') return '/wallpapers/AutumnForest.png';
    if (homeTown === 'eclair-square') return '/wallpapers/SereneSunset.png';
    if (homeTown === 'peppermint-peak') return '/wallpapers/Cherry blossoms.png';
    if (homeTown === 'banoffee-valley') return '/wallpapers/LakeView.png';
    return '/wallpapers/MagicalGarden.png';
  };

  return (
    <div 
      className="w-full h-full flex flex-col justify-between p-5 rounded-[2.5rem] relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)] border border-white/10 select-none"
      style={{
        backgroundImage: `url('${getWallpaper()}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* 60% darkness overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[1.5px] pointer-events-none z-0" />

      {/* CSS Animations & Layout Enhancements */}
      <style>{`
        @keyframes shine {
          0% { transform: translateX(-150%) skewX(-15deg); }
          100% { transform: translateX(150%) skewX(-15deg); }
        }
        .shine-card {
          position: relative;
          overflow: hidden;
        }
        .shine-card::after {
          content: '';
          position: absolute;
          top: 0;
          left: -150%;
          width: 50%;
          height: 100%;
          background: linear-gradient(
            to right,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.22) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          transform: skewX(-15deg);
          pointer-events: none;
        }
        .shine-card:hover::after {
          animation: shine 0.9s ease-out;
        }
      `}</style>

      {/* Main content layer */}
      <div className="relative z-10 w-full h-full flex flex-col justify-between min-h-0">
        {!showWarehouseModal && !showMerchantModal && (
          <GG_TravellerDeck_Header
            title="COZY RESIDENCY IMPROVEMENTS & TRADING MARKET"
            setSubPage={setSubPage}
            popPage={popPage}
          />
        )}

        {/* Shop Content Canvas */}
        <div className="flex-grow overflow-y-auto custom-scrollbar my-2 min-h-0">
          
          {/* TAB 1: Market Board */}
          {shopTab === 'produce' && (
            <div className="space-y-4 pb-4 animate-fade-in">
              
              {/* Top row: Market Banner (Left) & Opportunities (Right) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                
                {/* Market Square Banner Card */}
                <div className="lg:col-span-7 bg-black/60 border border-white/10 backdrop-blur-md rounded-[2rem] p-6 relative overflow-hidden flex flex-col justify-between min-h-[220px] shadow-2xl shine-card group">
                  <div 
                    className="absolute inset-0 bg-cover bg-center pointer-events-none opacity-45 mix-blend-overlay transition-transform duration-700 group-hover:scale-105"
                    style={{ backgroundImage: `url('/Assets/Ganache Grove/GanacheGrove_marketSquare.png')` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/65 to-transparent pointer-events-none" />
                  
                  <div className="relative z-10">
                    <span className="px-3 py-0.5 bg-amber-500/20 text-amber-400 border border-amber-500/35 rounded-full text-[9px] font-black uppercase tracking-widest font-sans">
                      County Trade Desk
                    </span>
                    <h3 className="text-2xl md:text-3xl font-bold text-white uppercase tracking-wide mt-2" style={{ fontFamily: '"Luckiest Guy", cursive' }}>
                      MARKET SQUARE
                    </h3>
                    <p className="text-xs text-white/70 font-sans leading-relaxed mt-1 max-w-md">
                      Buy, sell and trade goods. Complete active delivery contracts from local merchants to earn golden coins and increase your county legacy credentials!
                    </p>
                  </div>

                  <div className="relative z-10 flex gap-2.5 mt-4">
                    <button
                      onClick={shiftMarketRates}
                      className="px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:scale-105 active:scale-95 text-black font-black uppercase text-[10px] tracking-wider rounded-xl transition-all duration-300 shadow-md font-bold"
                      style={{ fontFamily: '"Josefin Sans", sans-serif' }}
                    >
                      🔄 Shift Market Rates
                    </button>
                    <button
                      onClick={() => setShowWarehouseModal(true)}
                      className="px-4 py-2 bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-500/40 text-emerald-300 font-black uppercase text-[10px] tracking-wider rounded-xl transition-all duration-300 font-bold"
                      style={{ fontFamily: '"Josefin Sans", sans-serif' }}
                    >
                      📦 View Warehouse
                    </button>
                  </div>
                </div>

                {/* Opportunities Panel */}
                <div className="lg:col-span-5 bg-black/60 border border-white/10 backdrop-blur-md rounded-[2rem] p-5 shadow-2xl flex flex-col justify-between">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-xs font-black uppercase tracking-widest text-amber-400 font-sans">
                      Today's Opportunities
                    </h4>
                    <span className="text-[10px] text-white/40 uppercase font-black tracking-wider px-2 py-0.5 border border-white/5 bg-white/5 rounded">
                      View All
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {opportunities.map((opt) => {
                      const isDone = completedContracts[opt.id];
                      return (
                        <div 
                          key={opt.id}
                          className="bg-black/40 border border-white/10 rounded-2xl p-3 flex flex-col justify-between text-center min-h-[155px] hover:border-amber-400/30 transition-all duration-300 group"
                        >
                          <div className="flex flex-col items-center">
                            <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">{opt.emoji}</span>
                            <h5 className="text-[10px] font-black uppercase tracking-wide text-white line-clamp-1">{opt.title}</h5>
                            <p className="text-[8.5px] text-white/50 leading-tight mt-1 min-h-[22px] line-clamp-2">{opt.desc}</p>
                          </div>

                          <div className="mt-2 space-y-1.5">
                            <div className="flex justify-center gap-2 text-[9px] font-mono text-white/60">
                              <span>🪙 {opt.coins}</span>
                              <span>⭐ {opt.legacy}</span>
                            </div>
                            {isDone ? (
                              <button
                                disabled
                                className="w-full py-1 bg-emerald-950/40 border border-emerald-500/40 text-emerald-400 text-[8px] font-black uppercase tracking-wider rounded-lg cursor-not-allowed"
                              >
                                ✓ Completed
                              </button>
                            ) : (
                              <button
                                onClick={() => handleCompleteContract(opt.id, opt.requires as unknown as Record<string, number>, opt.coins, opt.legacy, opt.title)}
                                className="w-full py-1 bg-amber-500 hover:bg-amber-400 text-black text-[8px] font-black uppercase tracking-wider rounded-lg transition-all active:scale-95 font-bold"
                                style={{ fontFamily: '"Josefin Sans", sans-serif' }}
                              >
                                Deliver
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* Bottom Row: Trading Board (Left) | Featured Merchant (Middle) | Market Summary (Right) */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                
                {/* Trading Board (5-span) */}
                <div className="md:col-span-5 bg-black/60 border border-white/10 backdrop-blur-md rounded-[2rem] p-5 shadow-2xl flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="text-xs font-black uppercase tracking-widest text-amber-400 font-sans flex items-center gap-1">
                        Trading Board <span className="text-[9px] text-white/40 cursor-help" title="Click price box to buy/sell commodities">❓</span>
                      </h4>
                      <span className="text-[9.5px] text-white/40 font-mono flex items-center gap-1">
                        🕒 Prices refresh: <strong className="text-amber-300">{formatTime(refreshTimeLeft)}</strong>
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {/* Inventory */}
                      <div>
                        <div className="flex justify-between items-end mb-2">
                          <h5 className="text-[9px] font-black uppercase text-white/45 tracking-widest">Your Inventory</h5>
                          <span className="text-[8px] font-mono text-emerald-400">{getTotalWarehouseStock()}/{maxWarehouseCapacity}</span>
                        </div>
                        <div className="space-y-2">
                          {COMMODITIES.map((c) => {
                            const stock = inventory[c.id] || 0;
                            return (
                              <div key={c.id} className="flex items-center justify-between bg-black/30 border border-white/5 p-2 rounded-xl">
                                <span className="text-[10px] text-white flex items-center gap-1.5">
                                  <span>{c.icon}</span> {c.name}
                                </span>
                                <span className="text-xs font-bold text-white font-mono">{stock}</span>
                              </div>
                            );
                          })}
                        </div>
                        
                        <button
                          onClick={() => setShowWarehouseModal(true)}
                          className="w-full mt-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/20 text-emerald-300 text-[9px] font-black uppercase tracking-wider rounded-xl transition flex items-center justify-center gap-1 font-bold"
                          style={{ fontFamily: '"Josefin Sans", sans-serif' }}
                        >
                          🗃️ View Warehouse
                        </button>
                      </div>

                      {/* Market Prices */}
                      <div>
                        <h5 className="text-[9px] font-black uppercase text-white/45 tracking-widest mb-2">Market Prices</h5>
                        <div className="space-y-2">
                          {COMMODITIES.map((c) => {
                            const rawPrice = marketPrices[c.id] || c.basePrice;
                            const prices = getCommodityPrices(c.id, rawPrice);
                            
                            // Featured merchant cocoa pods bonus
                            const displaySellPrice = c.id === 'cocoa-pods' ? Math.round(prices.sell * 1.1) : prices.sell;
                            
                            return (
                              <div key={c.id} className="grid grid-cols-12 gap-1 items-center bg-black/30 border border-white/5 p-1.5 rounded-xl">
                                <span className="col-span-4 text-[9.5px] font-black text-white/60 uppercase text-center">{c.name.split(' ')[0]}</span>
                                <button
                                  onClick={() => handleBuyProduce(c.id, prices.buy, c.name)}
                                  className="col-span-4 py-0.5 bg-emerald-950/50 hover:bg-emerald-600/20 border border-emerald-500/30 rounded text-[9.5px] font-mono text-emerald-400 flex flex-col items-center justify-center active:scale-95 transition-all"
                                  title="Click to purchase 1"
                                >
                                  <span className="text-[7px] text-emerald-500/60 uppercase font-black">Buy</span>
                                  🪙{prices.buy}
                                </button>
                                <button
                                  onClick={() => handleSellProduce(c.id, prices.sell, c.name)}
                                  className="col-span-4 py-0.5 bg-amber-950/50 hover:bg-amber-600/20 border border-amber-500/30 rounded text-[9.5px] font-mono text-amber-400 flex flex-col items-center justify-center active:scale-95 transition-all"
                                  title="Click to sell 1"
                                >
                                  <span className="text-[7px] text-amber-500/60 uppercase font-black">Sell</span>
                                  🪙{displaySellPrice}
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Featured Merchant (3-span) */}
                <div className="md:col-span-3 bg-black/60 border border-white/10 backdrop-blur-md rounded-[2rem] p-5 shadow-2xl flex flex-col justify-between items-center text-center relative group overflow-hidden shine-card">
                  <h4 className="text-xs font-black uppercase tracking-widest text-amber-400 font-sans">
                    Featured Merchant
                  </h4>
                  
                  <div className="my-3 flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full border-2 border-amber-400/50 bg-black/55 flex items-center justify-center text-3xl shadow-inner relative group-hover:scale-105 transition-transform duration-300">
                      🐦
                      <span className="absolute bottom-0 right-0 text-xs">🎩</span>
                    </div>
                    <h5 className="text-[11px] font-black uppercase text-white tracking-wide mt-1.5">Caramel Finch</h5>
                    
                    {/* Chat speech bubble */}
                    <div className="relative mt-2 bg-white/10 border border-white/10 px-3 py-1.5 rounded-xl max-w-[180px]">
                      <p className="text-[9px] text-white/80 font-sans leading-tight italic">
                        "Cocoa prices are soaring today, traveler!"
                      </p>
                      <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white/10 border-t border-l border-white/10 rotate-45" />
                    </div>
                  </div>

                  <div className="w-full space-y-2">
                    <div className="py-1 bg-gradient-to-r from-purple-900/60 to-purple-800/60 border border-purple-500/40 rounded-xl text-[9px] font-black uppercase text-purple-300 tracking-wider flex items-center justify-center gap-1">
                      <span>🟫</span> +10% SELL PRICE ON COCOA
                    </div>
                    <button
                      onClick={() => setShowMerchantModal(true)}
                      className="w-full py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-[9px] font-black uppercase tracking-wider rounded-xl transition-all duration-300 shadow-md font-bold"
                      style={{ fontFamily: '"Josefin Sans", sans-serif' }}
                    >
                      Visit Merchant
                    </button>
                  </div>
                </div>

                {/* Market Summary (4-span) */}
                <div className="md:col-span-4 bg-black/60 border border-white/10 backdrop-blur-md rounded-[2rem] p-5 shadow-2xl flex flex-col justify-between hover:scale-[1.01] transition-transform duration-300">
                  <h4 className="text-xs font-black uppercase tracking-widest text-amber-400 font-sans text-center">
                    Market Summary
                  </h4>

                  <div className="grid grid-cols-3 gap-2.5 my-3.5 text-center select-none">
                    {/* Gross Earnings Pouch Card */}
                    <div className="bg-black/50 border-2 border-amber-500/35 rounded-full p-2 flex flex-col items-center justify-between min-h-[125px] transition-all hover:scale-105 shadow-inner">
                      <span className="text-[7.5px] font-black uppercase tracking-wider text-amber-300 leading-tight">Your Pouch</span>
                      <span className="text-2xl filter drop-shadow-[0_2px_4px_rgba(245,158,11,0.3)]">👛</span>
                      <div className="flex flex-col items-center leading-none">
                        <span className="text-xs font-black text-amber-300 font-mono">🪙 {earningsToday}</span>
                      </div>
                    </div>

                    {/* Total Trades Crate Card */}
                    <div className="bg-black/50 border-2 border-emerald-500/35 rounded-full p-2 flex flex-col items-center justify-between min-h-[125px] transition-all hover:scale-105 shadow-inner">
                      <span className="text-[7.5px] font-black uppercase tracking-wider text-emerald-300 leading-tight flex flex-col items-center">
                        <span>Cargo</span>
                        <span>Trades</span>
                      </span>
                      <span className="text-2xl filter drop-shadow-[0_2px_4px_rgba(16,185,129,0.3)]">📦</span>
                      <div className="flex flex-col items-center leading-none">
                        <span className="text-xs font-black text-white font-mono">{totalTradesToday}</span>
                        <span className="text-[7.5px] uppercase text-emerald-400 font-black mt-0.5">Cargo</span>
                      </div>
                    </div>

                    {/* Merchant Level Shield/Laurels Card */}
                    <div className="bg-black/50 border-2 border-purple-500/35 rounded-full p-2 flex flex-col items-center justify-between min-h-[125px] transition-all hover:scale-105 shadow-inner relative overflow-hidden">
                      <span className="text-[7.5px] font-black uppercase tracking-wider text-purple-300 leading-tight">Merits</span>
                      <div className="relative flex items-center justify-center">
                        <span className="text-2xl filter drop-shadow-[0_1px_4px_rgba(168,85,247,0.4)]">🛡️</span>
                        <span className="absolute text-[8px] font-mono font-black text-black select-none mt-[-1px]">{merchantLevel}</span>
                      </div>
                      <div className="flex flex-col items-center leading-none">
                        <span className="text-[10px] font-black text-purple-300">LV</span>
                        <span className="text-[11px] font-black text-purple-300 font-mono mt-0.5">{merchantLevel}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {/* Level progress bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[8px] font-mono text-white/40 uppercase">
                        <span>Progress XP</span>
                        <span>{merchantXP}/300 XP</span>
                      </div>
                      <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden border border-white/5">
                        <div 
                          className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-500"
                          style={{ width: `${(merchantXP / 300) * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Tip bar with Hamster */}
                    <div className="py-2 px-3 bg-gradient-to-r from-yellow-950/40 via-amber-950/30 to-black/20 border border-yellow-500/20 rounded-xl flex items-center justify-between text-left gap-2">
                      <p className="text-[8.5px] text-yellow-300/90 leading-normal font-sans">
                        <strong>Trading Tip:</strong> Buy low in the morning, sell high in the evening! Watch the trends.
                      </p>
                      <span className="text-xl shrink-0 filter drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]">🐹</span>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 2: Home Improvements */}
          {shopTab === 'improvements' && (
            <div className="space-y-6 pb-4 animate-fade-in">
              <div>
                <h4 className="text-sm font-black uppercase tracking-widest pl-2 text-amber-400 font-sans">
                  🏡 Cozy Cottage Upgrades
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-3">
                  {[
                    { id: 'lanterns', name: 'Glowcap Lanterns 🏮', cost: 40, desc: 'Provides a warm ambient light along your cottage pathway.', theme: 'from-amber-955/60 via-amber-900/35 to-stone-900', border: 'border-amber-500/30', glow: 'shadow-[0_0_15px_rgba(245,158,11,0.15)]', textCol: 'text-amber-300' },
                    { id: 'flower-boxes', name: 'Window Flower Boxes 🌸', cost: 30, desc: 'Window boxes filled with fragrant candy blossoms.', theme: 'from-rose-955/60 via-rose-900/35 to-stone-900', border: 'border-rose-500/30', glow: 'shadow-[0_0_15px_rgba(244,63,94,0.15)]', textCol: 'text-rose-300' },
                    { id: 'smoke', name: 'Chocolate Chimney Smoke 💨', cost: 60, desc: 'Billows sweet, chocolate-scented clouds from your cottage chimney.', theme: 'from-yellow-955/45 via-yellow-900/20 to-stone-900', border: 'border-yellow-600/30', glow: 'shadow-[0_0_15px_rgba(202,138,4,0.15)]', textCol: 'text-yellow-300' },
                    { id: 'fence', name: 'Sweet Wafer Fence 🎫', cost: 50, desc: 'A white wafer log fence surrounding your private cottage garden lawn.', theme: 'from-orange-955/40 via-orange-900/25 to-stone-900', border: 'border-orange-500/30', glow: 'shadow-[0_0_15px_rgba(249,115,22,0.15)]', textCol: 'text-orange-300' },
                  ].map((d) => {
                    const isOwned = ownedDecorations.includes(d.id);
                    const isEquipped = equippedDecorations.includes(d.id);
                    return (
                      <div 
                        key={d.id}
                        className={`p-5 bg-black/60 border border-white/10 backdrop-blur-md rounded-[2rem] flex flex-col justify-between gap-4 text-xs animate-fade-in hover:scale-[1.02] hover:border-amber-400/50 hover:bg-white/10 hover:shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all duration-300 relative group overflow-hidden shine-card`}
                      >
                        <div>
                          <div className="flex justify-between items-start gap-1">
                            <h4 className={`font-bold text-sm tracking-tight ${d.textCol}`}>{d.name}</h4>
                            {isOwned && (
                              <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded text-[8px] font-bold uppercase tracking-wider">Owned</span>
                            )}
                          </div>
                          <p className="text-white/60 mt-2 leading-relaxed font-sans">{d.desc}</p>
                        </div>
                        <div className="flex items-center justify-between mt-2 pt-2.5 border-t border-white/5 z-10">
                          <span className="text-amber-400 font-bold font-mono flex items-center gap-0.5">🪙 {d.cost}</span>
                          {isOwned ? (
                            <button
                              onClick={() => toggleDecoration(d.id)}
                              className={`px-3.5 py-1.5 rounded-xl text-[9px] uppercase tracking-wider transition-all font-black ${
                                isEquipped ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_10px_rgba(16,185,129,0.3)]' : 'bg-neutral-800 text-white/55 hover:bg-neutral-700'
                              }`}
                              style={{ fontFamily: '"Josefin Sans", sans-serif' }}
                            >
                              {isEquipped ? 'Active ✓' : 'Use'}
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                if (buyDecoration(d.id, d.cost)) {
                                  cozyAudio.playCoins();
                                  triggerFeedback(`🛒 Installed ${d.name}`);
                                } else {
                                  triggerFeedback('❌ Insufficient Coins!');
                                }
                              }}
                              className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-black font-black uppercase rounded-xl text-[9px] tracking-wider transition-all font-bold"
                              style={{ fontFamily: '"Josefin Sans", sans-serif' }}
                            >
                              Acquire
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-black uppercase tracking-widest pl-2 text-emerald-400 font-sans">
                  🐿️ Woodland Companions
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-3">
                  {[
                    { id: 'squirrel', name: 'Ganache Squirrel 🐿️', cost: 50, desc: 'A chatterbox squirrel who climbs your residence signs and collects nuts.', theme: 'from-emerald-955/60 via-emerald-900/35 to-stone-900', border: 'border-emerald-500/30', glow: 'shadow-[0_0_15px_rgba(16,185,129,0.15)]', textCol: 'text-emerald-300' },
                    { id: 'bunny', name: 'Marshmallow Bunny 🐇', cost: 80, desc: 'Munches sweet weeds by your flower boxes and hops around your porch.', theme: 'from-pink-955/60 via-pink-900/35 to-stone-900', border: 'border-pink-500/30', glow: 'shadow-[0_0_15px_rgba(236,72,153,0.15)]', textCol: 'text-pink-300' },
                    { id: 'owl', name: 'Cocoawood Owl 🦉', cost: 120, desc: 'Watches from your cottage roof and hoots cozy melodies at midnight.', theme: 'from-indigo-955/60 via-indigo-900/35 to-stone-900', border: 'border-indigo-500/30', glow: 'shadow-[0_0_15px_rgba(99,102,241,0.15)]', textCol: 'text-indigo-300' },
                  ].map((p) => {
                    const isOwned = ownedPets.includes(p.id);
                    const isEquipped = equippedPet === p.id;
                    return (
                      <div 
                        key={p.id}
                        className={`p-5 bg-black/60 border border-white/10 backdrop-blur-md rounded-[2rem] flex flex-col justify-between gap-4 text-xs animate-fade-in hover:scale-[1.02] hover:border-amber-400/50 hover:bg-white/10 hover:shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all duration-300 relative group overflow-hidden shine-card`}
                      >
                        <div>
                          <div className="flex justify-between items-start gap-1">
                            <div>
                              <h4 className={`font-bold text-sm tracking-tight ${p.textCol}`}>{p.name}</h4>
                              <span className="text-[8px] uppercase tracking-wider text-cyan-400 font-bold block mt-0.5">Woodland Companion</span>
                            </div>
                            {isOwned && (
                              <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded text-[8px] font-bold uppercase tracking-wider">Acquired</span>
                            )}
                          </div>
                          <p className="text-white/60 mt-2 leading-relaxed font-sans">{p.desc}</p>
                        </div>
                        <div className="flex items-center justify-between mt-2 pt-2.5 border-t border-white/5 z-10">
                          <span className="text-amber-400 font-bold font-mono flex items-center gap-0.5">🪙 {p.cost}</span>
                          {isOwned ? (
                            <button
                              onClick={() => togglePet(isEquipped ? null : p.id)}
                              className={`px-3.5 py-1.5 rounded-xl text-[9px] uppercase tracking-wider transition font-black ${
                                isEquipped ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_10px_rgba(16,185,129,0.3)]' : 'bg-neutral-800 text-white/55 hover:bg-neutral-700'
                              }`}
                              style={{ fontFamily: '"Josefin Sans", sans-serif' }}
                            >
                              {isEquipped ? 'Welcomed ✓' : 'Invite'}
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                if (buyPet(p.id, p.cost)) {
                                  cozyAudio.playCoins();
                                  triggerFeedback(`🐿️ companion Welcomed! ${p.name} moved in.`);
                                } else {
                                  triggerFeedback('❌ Insufficient Coins!');
                                }
                              }}
                              className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-black font-black uppercase rounded-xl text-[9px] tracking-wider transition font-bold"
                              style={{ fontFamily: '"Josefin Sans", sans-serif' }}
                            >
                              Invite
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Travels & Estates */}
          {shopTab === 'estates' && (
            <div className="space-y-6 pb-4 animate-fade-in">
              <div>
                <h4 className="text-sm font-black uppercase tracking-widest pl-2 text-rose-400 font-sans">
                  🐎 Provincial Vehicles (Transit Boosters)
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-3">
                  {[
                    { id: 'horse-wagon', name: 'Caramel Wagon 🐎', cost: 80, speed: '2x Speed', desc: 'A comfortable carriage pulled by a caramel pony. Greatly reduces travel transit duration.', theme: 'from-amber-955/70 via-amber-900/35 to-stone-900', border: 'border-amber-500/30', glow: 'shadow-[0_0_15px_rgba(245,158,11,0.15)]', textCol: 'text-amber-300' },
                    { id: 'forest-train', name: 'Forest Rail Express Pass 🚂', cost: 150, speed: '4x Speed', desc: 'Official pass for the local high-speed steam rail transport line.', theme: 'from-slate-900/80 via-slate-800/40 to-stone-900', border: 'border-slate-500/30', glow: 'shadow-[0_0_15px_rgba(100,116,139,0.15)]', textCol: 'text-slate-300' },
                    { id: 'hot-air-balloon', name: 'Hot Air Balloon License 🎈', cost: 300, speed: '8x Speed', desc: 'Fly above the tree canopy in a woven chocolate basket. Maximum transit multiplier.', theme: 'from-rose-950/60 via-pink-900/35 to-stone-900', border: 'border-pink-500/30', glow: 'shadow-[0_0_15px_rgba(236,72,153,0.15)]', textCol: 'text-rose-300' },
                  ].map((t) => {
                    const isOwned = ownedTransports.includes(t.id);
                    const isActive = activeTransport === t.id;
                    return (
                      <div 
                        key={t.id}
                        className={`p-5 bg-black/60 border border-white/10 backdrop-blur-md rounded-[2rem] flex flex-col justify-between gap-4 text-xs animate-fade-in hover:scale-[1.02] hover:border-amber-400/50 hover:bg-white/10 hover:shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all duration-300 relative group overflow-hidden shine-card`}
                      >
                        <div>
                          <div className="flex justify-between items-start gap-1">
                            <div>
                              <h4 className={`font-bold text-sm tracking-tight ${t.textCol}`}>{t.name}</h4>
                              <span className="text-[8px] uppercase tracking-wider text-yellow-400 font-bold block mt-0.5">{t.speed} Transit multiplier</span>
                            </div>
                            {isOwned && (
                              <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded text-[8px] font-bold uppercase tracking-wider">Licensed</span>
                            )}
                          </div>
                          <p className="text-white/60 mt-2 leading-relaxed font-sans">{t.desc}</p>
                        </div>
                        <div className="flex items-center justify-between mt-2 pt-2.5 border-t border-white/5 z-10">
                          <span className="text-amber-400 font-bold font-mono flex items-center gap-0.5">🪙 {t.cost}</span>
                          {isOwned ? (
                            <button
                              onClick={() => setTransport(t.id as any)}
                              className={`px-3.5 py-1.5 rounded-xl text-[9px] uppercase tracking-wider transition font-black ${
                                isActive ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_10px_rgba(16,185,129,0.3)]' : 'bg-neutral-800 text-white/55 hover:bg-neutral-700'
                              }`}
                              style={{ fontFamily: '"Josefin Sans", sans-serif' }}
                            >
                              {isActive ? 'Active ✓' : 'Equip'}
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                if (buyTransport(t.id, t.cost)) {
                                  cozyAudio.playCoins();
                                  triggerFeedback(`🐎 Transport Acquired: ${t.name}`);
                                } else {
                                  triggerFeedback('❌ Insufficient Coins!');
                                }
                              }}
                              className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-black font-black uppercase rounded-xl text-[9px] tracking-wider transition font-bold"
                              style={{ fontFamily: '"Josefin Sans", sans-serif' }}
                            >
                              Buy vehicle
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-black uppercase tracking-widest pl-2 text-cyan-400 font-sans">
                  🏰 Imperial Real Estate Estates
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-3">
                  {[
                    { id: 'hazelnut-villa', name: 'Hazelnut Terrace Villa 🏡', cost: 250, desc: 'A spacious estate overlooking the beautiful Nutty Slopes district. Grants a standing bonus.', theme: 'from-amber-955/60 via-orange-950/35 to-stone-900', border: 'border-orange-500/30', glow: 'shadow-[0_0_15px_rgba(249,115,22,0.15)]', textCol: 'text-orange-300' },
                    { id: 'cove-mansion', name: 'Caramel Cove Mansion 🏰', cost: 400, desc: 'A grand coastal estate situated right on the Sticky Surf Beachfront.', theme: 'from-cyan-955/60 via-blue-900/35 to-stone-900', border: 'border-cyan-500/30', glow: 'shadow-[0_0_15px_rgba(6,182,212,0.15)]', textCol: 'text-cyan-300' },
                    { id: 'peak-palace', name: 'Peppermint Peaks Palace 🏔️', cost: 600, desc: 'A luxury glacial fortress built directly into the towering Mint Ridge.', theme: 'from-sky-955/60 via-teal-900/35 to-stone-900', border: 'border-teal-500/30', glow: 'shadow-[0_0_15px_rgba(20,184,166,0.15)]', textCol: 'text-teal-300' },
                  ].map((e) => {
                    const isOwned = ownedEstates.includes(e.id);
                    return (
                      <div 
                        key={e.id}
                        className={`p-5 bg-black/60 border border-white/10 backdrop-blur-md rounded-[2rem] flex flex-col justify-between gap-4 text-xs animate-fade-in hover:scale-[1.02] hover:border-amber-400/50 hover:bg-white/10 hover:shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all duration-300 relative group overflow-hidden shine-card`}
                      >
                        <div>
                          <div className="flex justify-between items-start gap-1">
                            <div>
                              <h4 className={`font-bold text-sm tracking-tight ${e.textCol}`}>{e.name}</h4>
                              <span className="text-[8px] uppercase tracking-wider text-purple-400 font-bold block mt-0.5">Imperial Real Estate</span>
                            </div>
                            {isOwned && (
                              <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded text-[8px] font-bold uppercase tracking-wider">Deeded</span>
                            )}
                          </div>
                          <p className="text-white/60 mt-2 leading-relaxed font-sans">{e.desc}</p>
                        </div>
                        <div className="flex items-center justify-between mt-2 pt-2.5 border-t border-white/5 z-10">
                          <span className="text-amber-400 font-bold font-mono flex items-center gap-0.5">🪙 {e.cost}</span>
                          {isOwned ? (
                            <div className="px-3.5 py-1.5 bg-emerald-500/10 border border-emerald-500/35 text-emerald-400 text-[9px] font-black uppercase rounded-xl tracking-wider">Owned</div>
                          ) : (
                            <button
                              onClick={() => {
                                if (buyEstate(e.id, e.cost)) {
                                  cozyAudio.playCoins();
                                  triggerFeedback(`🏡 Estate Acquired: ${e.name}`);
                                } else {
                                  triggerFeedback('❌ Insufficient Coins!');
                                }
                              }}
                              className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-black font-black uppercase rounded-xl text-[9px] tracking-wider transition font-bold"
                              style={{ fontFamily: '"Josefin Sans", sans-serif' }}
                            >
                              Acquire Land
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Permits & Passes */}
          {shopTab === 'permits' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-4 animate-fade-in">
              {/* Premium Passport */}
              <div className="p-5 bg-black/60 border border-white/10 backdrop-blur-md rounded-[2.2rem] flex flex-col justify-between gap-4 text-xs animate-fade-in hover:scale-[1.02] hover:border-amber-400/50 hover:bg-white/10 hover:shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all duration-300 relative group overflow-hidden shine-card">
                <div>
                  <h4 className="text-yellow-300 text-sm font-bold flex items-center gap-1.5">
                    <span>👑</span> Imperial Golden Registry Upgrade
                  </h4>
                  <p className="text-white/60 mt-2 leading-relaxed font-sans">
                    Permanently upgrades your traveler passport class. Boosts all gained standing legacy points from completed chores and tasks by +50%.
                  </p>
                </div>
                <div className="flex items-center justify-between mt-2 pt-2.5 border-t border-white/5 z-10">
                  <span className="text-amber-400 font-bold font-mono">🪙 200</span>
                  {premiumPassport ? (
                    <div className="px-3.5 py-1.5 bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 text-[9px] font-black uppercase rounded-xl tracking-wider">Golden Class Registry</div>
                  ) : (
                    <button
                      onClick={() => {
                        if (buyPremiumPassport(200)) {
                          cozyAudio.playChime();
                          cozyAudio.playCoins();
                          triggerFeedback('👑 Passport permanently upgraded to Imperial Golden Class!');
                        } else {
                          triggerFeedback('❌ Insufficient Coins!');
                        }
                      }}
                      className="px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-black font-black uppercase text-[9px] tracking-wider rounded-xl transition shadow-glow font-bold"
                      style={{ fontFamily: '"Josefin Sans", sans-serif' }}
                    >
                      Upgrade Passport
                    </button>
                  )}
                </div>
              </div>

              {/* Warehouse Expansion Permit */}
              <div className="p-5 bg-black/60 border border-white/10 backdrop-blur-md rounded-[2.2rem] flex flex-col justify-between gap-4 text-xs animate-fade-in hover:scale-[1.02] hover:border-amber-400/50 hover:bg-white/10 hover:shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all duration-300 relative group overflow-hidden shine-card">
                <div>
                  <h4 className="text-emerald-300 text-sm font-bold flex items-center gap-1.5">
                    <span>🔨</span> Warehouse Expansion Permit
                  </h4>
                  <p className="text-white/60 mt-2 leading-relaxed font-sans">
                    Acquire custom waiver paperwork to expand your residency storage limits. Grants <strong>+15 extra item slots</strong> inside the warehouse. Can be purchased repeatedly!
                  </p>
                </div>
                <div className="flex items-center justify-between mt-2 pt-2.5 border-t border-white/5 z-10">
                  <span className="text-amber-400 font-bold font-mono">🪙 40</span>
                  <button
                    onClick={() => buyExtraStorage(40, 15)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase text-[9px] tracking-wider rounded-xl transition shadow-md font-bold"
                    style={{ fontFamily: '"Josefin Sans", sans-serif' }}
                  >
                    Expand +15 Slots
                  </button>
                </div>
              </div>

              {/* Seasonal Pass */}
              {[
                { id: 'cocoa-festival', name: 'Cocoa Festival Pass 🎟️', cost: 80, desc: 'Official entry permit for the annual autumn cocoa harvest week festivities.', theme: 'from-orange-955/60 via-orange-900/35 to-stone-900', border: 'border-orange-500/30', glow: 'shadow-[0_0_15px_rgba(249,115,22,0.15)]', textCol: 'text-orange-300' },
                { id: 'marshmallow-week', name: 'Winter Marshmallow Pass 🎟️', cost: 100, desc: 'Entry permit for the winter marshmallow bonfire and village county week.', theme: 'from-sky-955/60 via-blue-900/35 to-stone-900', border: 'border-sky-500/30', glow: 'shadow-[0_0_15px_rgba(14,165,233,0.15)]', textCol: 'text-sky-300' },
              ].map((p) => {
                const isOwned = activePasses.includes(p.id);
                return (
                  <div 
                    key={p.id}
                    className={`p-5 bg-black/60 border border-white/10 backdrop-blur-md rounded-[2rem] flex flex-col justify-between gap-4 text-xs animate-fade-in hover:scale-[1.02] hover:border-amber-400/50 hover:bg-white/10 hover:shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all duration-300 relative group overflow-hidden shine-card`}
                  >
                    <div>
                      <div className="flex justify-between items-start gap-1">
                        <h4 className={`font-bold text-sm tracking-tight ${p.textCol}`}>{p.name}</h4>
                        {isOwned && (
                          <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded text-[8px] font-bold uppercase tracking-wider">Permit Logged</span>
                        )}
                      </div>
                      <p className="text-white/60 mt-2 leading-relaxed font-sans">{p.desc}</p>
                    </div>
                    <div className="flex items-center justify-between mt-2 pt-2.5 border-t border-white/5 z-10">
                      <span className="text-amber-400 font-bold font-mono flex items-center gap-0.5">🪙 {p.cost}</span>
                      {isOwned ? (
                        <div className="px-3.5 py-1.5 bg-emerald-500/10 border border-emerald-500/35 text-emerald-400 text-[9px] font-black uppercase rounded-xl tracking-wider">Permit Logged</div>
                      ) : (
                        <button
                          onClick={() => {
                            if (buyPass(p.id, p.cost)) {
                              cozyAudio.playCoins();
                              triggerFeedback(`🎟️ Festival Permit Purchased: ${p.name}`);
                            } else {
                              triggerFeedback('❌ Insufficient Coins!');
                            }
                          }}
                          className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-black uppercase text-[9px] tracking-wider rounded-xl transition shadow-md font-bold"
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

      {/* MODAL 1: Imperial Town Warehouse (Comprehensive Produce Trading) */}
      {showWarehouseModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#0e0e12]/95 border-2 border-white/10 rounded-[2.5rem] max-w-4xl w-full max-h-[85vh] flex flex-col p-6 overflow-hidden shadow-2xl animate-fade-in">
            {/* Modal Header */}
            <div className="flex justify-between items-center pb-4 border-b border-white/10 shrink-0">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Inventory Depot</span>
                <h3 className="text-xl font-bold text-white uppercase mt-0.5" style={{ fontFamily: '"Luckiest Guy", cursive' }}>
                  🏛️ Imperial Town Warehouse
                </h3>
              </div>
              <button 
                onClick={() => setShowWarehouseModal(false)}
                className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-black uppercase rounded-xl transition"
              >
                Close (Esc)
              </button>
            </div>

            {/* Warehouse Status (Limits based on rank + upgrades) */}
            <div className="mt-4 p-4 bg-black/40 border border-white/10 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 shrink-0">
              <div className="text-left">
                <span className="text-[8px] font-black uppercase tracking-wider text-white/50 block">Residence Cottage Allocation</span>
                <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                  🏠 Cottage Tier: <span className={RANK_WAREHOUSE_LIMITS[currentRoleId || 'newcomer']?.color || 'text-stone-400'}>
                    {RANK_WAREHOUSE_LIMITS[currentRoleId || 'newcomer']?.cottage || 'Tent Shelter'}
                  </span>
                </h4>
                <p className="text-[9.5px] text-white/40 mt-0.5">
                  Base capacity is {baseLimit} slots. You have expanded it by +{extraSlots} slots using expansion permits.
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right">
                  <span className="text-[8.5px] font-mono text-white/55 block">Occupancy Load</span>
                  <span className="text-sm font-black font-mono text-emerald-400">
                    {getTotalWarehouseStock()} / {maxWarehouseCapacity} items
                  </span>
                </div>
                <button
                  onClick={() => buyExtraStorage(40, 15)}
                  className="px-3.5 py-1.5 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:scale-105 active:scale-95 text-white font-bold uppercase text-[9px] tracking-wider rounded-xl transition"
                >
                  🔨 Expand (+15 slots) - 🪙40
                </button>
              </div>
            </div>

            {/* Warehouse Grid */}
            <div className="flex-grow overflow-y-auto custom-scrollbar my-4 pr-1">
              <p className="text-xs text-white/55 font-sans leading-relaxed mb-4">
                View your complete collection of agricultural commodities, wild vegetables, valley fruits, and mountain flowers. Click buy/sell to exchange at general store base values!
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {PRODUCE_ITEMS.map((item) => {
                  const stock = inventory[item.id] || 0;
                  const price = marketPrices[item.id] || item.basePrice;
                  
                  return (
                    <div 
                      key={item.id}
                      className="bg-black/45 border border-white/5 p-3 rounded-2xl flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-3xl shrink-0">{item.emoji}</span>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h5 className="font-bold text-white tracking-tight">{item.name}</h5>
                            <span className={`text-[7.5px] font-black uppercase px-1 rounded bg-white/5 border border-white/5 ${
                              (marketDemands[item.id] || 'Normal') === 'High' ? 'text-red-400 border-red-500/20' : 
                              (marketDemands[item.id] || 'Normal') === 'Low' ? 'text-cyan-400 border-cyan-500/20' : 'text-emerald-400 border-emerald-500/20'
                            }`}>
                              {marketDemands[item.id] || 'Normal'} {marketTrends[item.id] === 'up' ? '📈' : marketTrends[item.id] === 'down' ? '📉' : '➡️'}
                            </span>
                          </div>
                          <span className="text-[9px] text-white/40 block mt-0.5 max-w-[190px] line-clamp-1">{item.desc}</span>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-1.5 shrink-0">
                        <span className="text-[10px] text-white/55 font-mono">Stock: <strong className="text-emerald-300">{stock} held</strong></span>
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleBuyProduce(item.id, price, item.name)}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-[8px] font-black uppercase rounded-lg transition"
                          >
                            Buy 🪙{price}
                          </button>
                          <button
                            onClick={() => handleSellProduce(item.id, price, item.name)}
                            className="px-2.5 py-1 bg-amber-600 hover:bg-amber-500 text-white text-[8px] font-black uppercase rounded-lg transition"
                          >
                            Sell 🪙{price}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Warehouse Footer */}
            <div className="pt-4 border-t border-white/10 flex justify-between items-center text-[10px] font-mono text-white/50 shrink-0">
              <span>Vault Capacity Limit: <strong className="text-white">{maxWarehouseCapacity} slots</strong></span>
              <span>Total Coins: <strong className="text-amber-400">🪙 {coins}</strong></span>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Featured Merchant Shop (Caramel Finch Dealership) */}
      {showMerchantModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#0e0e12]/95 border-2 border-white/10 rounded-[2.5rem] max-w-md w-full p-6 text-center animate-fade-in relative shadow-2xl">
            <div className="w-20 h-20 rounded-full border-2 border-amber-400/50 bg-black/55 flex items-center justify-center text-4xl shadow-inner mx-auto mb-3 relative">
              🐦
              <span className="absolute bottom-0 right-0 text-lg">🎩</span>
            </div>
            
            <h3 className="text-xl font-bold text-white uppercase" style={{ fontFamily: '"Luckiest Guy", cursive' }}>
              Merchant Caramel Finch
            </h3>
            <span className="text-[9px] font-black uppercase tracking-widest text-amber-400 font-sans block mt-0.5">
              Royal Trade Guild Ambassador
            </span>

            <div className="my-4 bg-white/5 border border-white/10 p-4 rounded-2xl text-left">
              <p className="text-xs text-white/80 font-sans leading-relaxed italic">
                "Welcome to my humble boutique, traveler! Cocoa prices are at an all-time high, but I also have a special deal today. Trade me 5x Cocoa Pods, and I will gift you an official 🪶 <strong>Golden Finch Feather</strong> (worth <strong>+50 Legacy points</strong>)!"
              </p>
            </div>

            <div className="space-y-2.5">
              <div className="flex justify-between items-center bg-black/30 p-2.5 rounded-xl border border-white/5 text-xs">
                <span className="text-white/60">Your Cocoa Pods:</span>
                <span className="font-mono font-bold text-white">{inventory['cocoa-pods'] || 0} / 5</span>
              </div>

              <button
                onClick={() => {
                  const pods = inventory['cocoa-pods'] || 0;
                  if (pods < 5) {
                    triggerFeedback("❌ You do not have 5x Cocoa Pods!");
                    return;
                  }
                  setInventory(prev => ({ ...prev, 'cocoa-pods': Math.max(0, prev['cocoa-pods'] - 5) }));
                  addLegacy(50);
                  addMerchantXP(50);
                  setTotalTradesToday(prev => prev + 1);
                  cozyAudio.playChime();
                  triggerFeedback("🎉 Traded! You obtained a Golden Finch Feather (+50 Legacy, +50 Merchant XP)!");
                  setShowMerchantModal(false);
                }}
                className={`w-full py-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-black uppercase text-xs tracking-wider rounded-xl transition shadow-md font-bold ${
                  (inventory['cocoa-pods'] || 0) < 5 ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'
                }`}
                style={{ fontFamily: '"Josefin Sans", sans-serif' }}
              >
                Accept Special Trade
              </button>
              
              <button
                onClick={() => setShowMerchantModal(false)}
                className="w-full py-2 bg-neutral-800 hover:bg-neutral-700 text-white font-black uppercase text-[10px] tracking-wider rounded-xl transition font-bold"
                style={{ fontFamily: '"Josefin Sans", sans-serif' }}
              >
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Tab Switcher */}
      <div className="flex justify-center items-center gap-2 py-2 px-5 border border-white/15 bg-black/85 shrink-0 rounded-full max-w-xl mx-auto shadow-2xl relative mb-1.5 mt-2.5 select-none z-10">
        <button
          onClick={() => { cozyAudio.playClick(); setShopTab('produce'); }}
          className={`px-4.5 py-1.5 rounded-full text-[11px] font-bold uppercase transition-all duration-300 ${
            shopTab === 'produce'
              ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-black shadow-[0_0_10px_rgba(245,158,11,0.4)] scale-105'
              : 'bg-transparent text-white/60 hover:text-white hover:bg-white/5'
          }`}
          style={{ fontFamily: '"Josefin Sans", sans-serif' }}
        >
          🌾 Market Board
        </button>
        <button
          onClick={() => { cozyAudio.playClick(); setShopTab('improvements'); }}
          className={`px-4.5 py-1.5 rounded-full text-[11px] font-bold uppercase transition-all duration-300 ${
            shopTab === 'improvements'
              ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-black shadow-[0_0_10px_rgba(245,158,11,0.4)] scale-105'
              : 'bg-transparent text-white/60 hover:text-white hover:bg-white/5'
          }`}
          style={{ fontFamily: '"Josefin Sans", sans-serif' }}
        >
          🏡 Home Improvements
        </button>
        <button
          onClick={() => { cozyAudio.playClick(); setShopTab('estates'); }}
          className={`px-4.5 py-1.5 rounded-full text-[11px] font-bold uppercase transition-all duration-300 ${
            shopTab === 'estates'
              ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-black shadow-[0_0_10px_rgba(245,158,11,0.4)] scale-105'
              : 'bg-transparent text-white/60 hover:text-white hover:bg-white/5'
          }`}
          style={{ fontFamily: '"Josefin Sans", sans-serif' }}
        >
          🐎 Travels & Estates
        </button>
        <button
          onClick={() => { cozyAudio.playClick(); setShopTab('permits'); }}
          className={`px-4.5 py-1.5 rounded-full text-[11px] font-bold uppercase transition-all duration-300 ${
            shopTab === 'permits'
              ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-black shadow-[0_0_10px_rgba(245,158,11,0.4)] scale-105'
              : 'bg-transparent text-white/60 hover:text-white hover:bg-white/5'
          }`}
          style={{ fontFamily: '"Josefin Sans", sans-serif' }}
        >
          🎟️ Permits & Passes
        </button>
      </div>
    </div>
  );
};
