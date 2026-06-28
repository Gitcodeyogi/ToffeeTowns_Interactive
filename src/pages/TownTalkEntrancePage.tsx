import React, { useState, useEffect } from 'react';
import { useTTStore } from '../store/useTTStore';
import { TownTalkModal } from '../components/TownTalkModal';

const TownTalkEntrancePage: React.FC = () => {
  const { setPage } = useTTStore();
  const [inventory, setInventory] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem('tt_inventory');
      return saved ? JSON.parse(saved) : { wood: 2, bolts: 1, moss: 1, mucus: 0, parchment: 1, ink: 0 };
    } catch {
      return { wood: 2, bolts: 1, moss: 1, mucus: 0, parchment: 1, ink: 0 };
    }
  });

  // Keep localStorage in sync when inventory changes
  useEffect(() => {
    localStorage.setItem('tt_inventory', JSON.stringify(inventory));
  }, [inventory]);

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center p-0 overflow-hidden select-none bg-transparent">
      <div 
        className="w-[90vw] h-[90vh] flex items-center justify-center"
        style={{ animation: 'ttFadeScaleUp 0.65s cubic-bezier(0.22,1,0.36,1) both' }}
      >
        <TownTalkModal
          initialCharacterId="goldwhistle"
          onClose={() => {
            setPage('desk');
          }}
          inventory={inventory}
          setInventory={setInventory}
          size="large"
        />
      </div>

      <style>{`
        @keyframes ttFadeScaleUp {
          0%   { opacity: 0; transform: scale(0.95) translateY(12px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default TownTalkEntrancePage;
