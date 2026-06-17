import type { TownDNA } from './types';

export const SUGARWAVE_COAST_DNA: Record<string, TownDNA> = {
  'sprinkle-sands': {
    id: 'sprinkle-sands',
    townName: 'Sprinkle Sands',
    county: 'Sugarwave Coast',
    trade: {
      primaryProduct: { name: 'Sugar Crystals', description: 'Rainbow-colored seaside crystals.' },
      secondaryProducts: [],
      tradePartners: [],
      exportRoute: [],
      localWorkforce: [],
      purpose: 'The source of color and texture for confections.'
    },
    transport: { mainRoads: [], riversCanals: [], infrastructure: [], tradeHubs: [], typicalVehicles: [] },
    town: { architectureStyle: '', layout: '', landmarks: [], dailyActivities: [], festivals: [] }
  },
  'butterscotch-bay': {
    id: 'butterscotch-bay',
    townName: 'Butterscotch Bay',
    county: 'Sugarwave Coast',
    trade: {
      primaryProduct: { name: 'Slow-Pour Syrup', description: 'Golden maritime syrup exports.' },
      secondaryProducts: [],
      tradePartners: [],
      exportRoute: [],
      localWorkforce: [],
      purpose: 'International trade port of the south.'
    },
    transport: { mainRoads: [], riversCanals: [], infrastructure: [], tradeHubs: [], typicalVehicles: [] },
    town: { architectureStyle: '', layout: '', landmarks: [], dailyActivities: [], festivals: [] }
  },
  'caramel-cove': {
    id: 'caramel-cove',
    townName: 'Caramel Cove',
    county: 'Sugarwave Coast',
    trade: {
      primaryProduct: { name: 'Surf-Filtered Syrup', description: 'Syrup refined by the waves.' },
      secondaryProducts: [],
      tradePartners: [],
      exportRoute: [],
      localWorkforce: [],
      purpose: 'Tourism and coastal resource gathering.'
    },
    transport: { mainRoads: [], riversCanals: [], infrastructure: [], tradeHubs: [], typicalVehicles: [] },
    town: { architectureStyle: '', layout: '', landmarks: [], dailyActivities: [], festivals: [] }
  }
};
