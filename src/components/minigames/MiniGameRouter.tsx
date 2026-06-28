import React from 'react';
import { OvenTimingGame, type OvenTimingRewards } from './OvenTimingGame';

interface MiniGameRouterProps {
  taskName: string;
  skillCat: string;
  rewards: OvenTimingRewards;
  onSuccess: () => void;
  onFail: () => void;
}

export const MiniGameRouter: React.FC<MiniGameRouterProps> = ({
  taskName, skillCat, rewards, onSuccess, onFail,
}) => {
  const name  = taskName.toLowerCase();
  const skill = skillCat.toLowerCase();

  if (
    skill === 'healer' || name.includes('bak') || name.includes('food') ||
    name.includes('meal') || name.includes('cook') || name.includes('deliver') ||
    name.includes('herb') || name.includes('medicine')
  ) {
    return <OvenTimingGame rewards={rewards} onSuccess={onSuccess} onFail={onFail} />;
  }

  return <OvenTimingGame rewards={rewards} onSuccess={onSuccess} onFail={onFail} />;
};
