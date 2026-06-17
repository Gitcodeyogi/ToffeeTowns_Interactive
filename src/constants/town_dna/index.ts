import { GOLDEN_CARAMEL_DNA } from './golden_caramel';
import { MINTED_HIGHLANDS_DNA } from './minted_highlands';
import { VELVET_COCOA_DNA } from './velvet_cocoa';
import { SUGARWAVE_COAST_DNA } from './sugarwave_coast';
import type { TownDNA } from './types';

export const TOWN_DNA_BY_ID: Record<string, TownDNA> = {
  ...MINTED_HIGHLANDS_DNA,
  ...VELVET_COCOA_DNA,
  ...GOLDEN_CARAMEL_DNA,
  ...SUGARWAVE_COAST_DNA
};

export const getTownDNA = (id: string): TownDNA | undefined => {
  return TOWN_DNA_BY_ID[id];
};

export * from './types';
