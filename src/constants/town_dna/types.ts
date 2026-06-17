export interface TradeBlueprint {
  primaryProduct: {
    name: string;
    description: string;
  };
  secondaryProducts: string[];
  tradePartners: string[];
  exportRoute: string[];
  localWorkforce: string[];
  purpose: string; // Why This Town Exists
}

export interface TransportBlueprint {
  mainRoads: string[];
  riversCanals: string[];
  infrastructure: string[]; // Bridges, Passes, Ports
  tradeHubs: string[];
  typicalVehicles: string[];
}

export interface TownBlueprint {
  architectureStyle: string;
  layout: string;
  landmarks: string[];
  dailyActivities: string[];
  festivals: string[];
}

export interface TownDNA {
  id: string;
  townName: string;
  county: string;
  trade: TradeBlueprint;
  transport: TransportBlueprint;
  town: TownBlueprint;
}
