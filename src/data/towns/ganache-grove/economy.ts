export interface TownEconomy {
  primaryProduct: string;
  sourceTree: string;
  fruitInside: string;
  confectioneryUses: string[];
  exports: {
    targetTown: string;
    marketSector: string;
  }[];
}

export const economy: TownEconomy = {
  primaryProduct: 'Ganache Pods',
  sourceTree: 'Ganache Trees',
  fruitInside: 'Velvet Cocoa Cream',
  confectioneryUses: [
    'Ganache chocolate',
    'Chocolate fillings',
    'Luxury desserts',
    'Celebration cakes'
  ],
  exports: [
    { targetTown: 'Toffee Town', marketSector: 'Luxury confection market' },
    { targetTown: 'Caramel Cove', marketSector: 'Bakery industry' },
    { targetTown: 'Hazelnut Terrace', marketSector: 'Premium chocolate blends' },
    { targetTown: 'Peppermint Peaks', marketSector: 'Winter chocolate drinks' }
  ]
};
