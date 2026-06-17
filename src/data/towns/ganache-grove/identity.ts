export interface TownIdentity {
  id: string;
  name: string;
  positioning: string;
  county: string;
  type: string;
  specialty: string;
  knownFor: string[];
  mood: string;
  residence: {
    sign: string;
    street: string;
    district: string;
    county: string;
  };
}

export const identity: TownIdentity = {
  id: 'ganache-grove',
  name: 'Ganache Grove',
  positioning: 'The Forest of Velvet Chocolate',
  county: 'Cocoawood County',
  type: '🌲 Forest Settlement',
  specialty: '🍫 Ganache Chocolate',
  knownFor: [
    'Ancient Ganache Trees',
    'Chocolate Forestry',
    'Woodland Researchers',
    'Rare Chocolate Ingredients',
    'Rebels activity',
    'Strange glowing mushrooms'
  ],
  mood: 'Relaxed, curious, slightly mysterious.',
  residence: {
    sign: 'Traveller Residence',
    street: 'Mossberry Lane 14',
    district: 'Ganache Grove',
    county: 'Cocoawood County'
  }
};
