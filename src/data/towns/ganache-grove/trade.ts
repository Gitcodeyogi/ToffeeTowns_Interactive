export interface TradeRoute {
  name: string;
  connection: string;
  type: 'Rail' | 'Road' | 'River';
  description: string;
}

export interface TownTrade {
  routes: TradeRoute[];
  exportVolume: string;
  status: string;
}

export const trade: TownTrade = {
  routes: [
    {
      name: 'Forest Rail',
      connection: 'Ganache Grove ↔ Toffee Town',
      type: 'Rail',
      description: 'Used for shipping raw Velvet Cocoa Cream to the capital luxury market.'
    },
    {
      name: 'Cocoa Road',
      connection: 'Ganache Grove ↔ Hazelnut Terrace',
      type: 'Road',
      description: 'A bumpy overland trail for transporting premium chocolate blends.'
    },
    {
      name: 'River Route',
      connection: 'Ganache Grove ↔ Caramel Cove',
      type: 'River',
      description: 'A scenic water pathway delivering fillings to the coastal bakery industry.'
    }
  ],
  exportVolume: '1,200 Pods/Cycle',
  status: 'Operating Normally'
};
