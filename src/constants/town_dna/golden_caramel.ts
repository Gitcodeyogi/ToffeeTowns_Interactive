import type { TownDNA } from './types';

export const GOLDEN_CARAMEL_DNA: Record<string, TownDNA> = {
  'hazelnut-terrace': {
    id: 'hazelnut-terrace',
    townName: 'Hazelnut Terrace',
    county: 'Golden Caramel County',
    trade: {
      primaryProduct: {
        name: 'Roasted Hazelnuts and Premium Nut Paste',
        description: 'Produced on terraced orchards that receive perfect sunlight and mountain soil nutrients. Ground into a rich nut paste used across the province.'
      },
      secondaryProducts: ['Nut Oils', 'Hazelnut Flour', 'Candied Nuts'],
      tradePartners: ['Nougat Node', 'Honeycomb Heights', 'Peanut Butter Falls', 'Toffee Town'],
      exportRoute: ['Hazelnut Terrace', 'Nougat Node', 'Toffee Town'],
      localWorkforce: ['Orchard Farmers', 'Roasting Artisans', 'Mill Workers', 'Caravan Traders'],
      purpose: 'Agricultural Foundation of Golden Caramel County. Supplies essential nut ingredients to nearby production centers.'
    },
    transport: {
      mainRoads: ['Orchard Road', 'Terrace Pass Road', 'Golden Trade Road'],
      riversCanals: ['Irrigation Streams', 'Orchard Water Channels'],
      infrastructure: ['Stone Orchard Bridges', 'Terrace Pass'],
      tradeHubs: ['Nut Market Square', 'Caravan Loading Yard'],
      typicalVehicles: ['Nut Wagons', 'Pack Mules', 'Caramel Oxen']
    },
    town: {
      architectureStyle: 'Golden Farmhouses, Windmills, Orchard Barns. Made from warm golden wood and stone.',
      layout: 'Terraced Orchards Surrounding a Central Village.',
      landmarks: ['The Great Terrace Mill', 'The Golden Orchard Gate', 'Nut Market Hall'],
      dailyActivities: ['Harvesting', 'Roasting', 'Grinding', 'Trading'],
      festivals: ['Autumn Nut Harvest Festival']
    }
  },
  'honeycomb-heights': {
    id: 'honeycomb-heights',
    townName: 'Honeycomb Heights',
    county: 'Golden Caramel County',
    trade: {
      primaryProduct: {
        name: 'Golden Honey and Royal Nectar Syrup',
        description: 'Thick golden honey collected from towers and a rare nectar syrup distilled from select flowers, prized for intense sweetness.'
      },
      secondaryProducts: ['Beeswax', 'Honey Caramel', 'Nectar Candies'],
      tradePartners: ['Hazelnut Terrace', 'Nougat Node', 'Toffee Town'],
      exportRoute: ['Honeycomb Heights', 'Nougat Node', 'Toffee Town Markets'],
      localWorkforce: ['Beekeepers', 'Honey Collectors', 'Wax Artisans', 'Nectar Brewers'],
      purpose: 'The Sweet Energy Source of the County. Transforms natural resources from flowering meadows into honey and nectar products.'
    },
    transport: {
      mainRoads: ['Honey Road', 'Terrace Connector Road'],
      riversCanals: ['Cooling Streams', 'Nectar Channels'],
      infrastructure: ['Hive Bridges', 'Meadow Crossings'],
      tradeHubs: ['The Honey Exchange Plaza'],
      typicalVehicles: ['Honey Barrel Wagons', 'Beekeeper Carts', 'Caravan Oxen']
    },
    town: {
      architectureStyle: 'Hexagonal Honey Towers and Golden Glass Windows. Buildings mimic natural honeycombs reflected in glowing glass.',
      layout: 'Vertical Hive City Surrounded by Flower Meadows.',
      landmarks: ['The Grand Honey Tower', 'Nectar Cathedral', 'Bee Garden Fields'],
      dailyActivities: ['Hive Maintenance', 'Honey Harvesting', 'Wax Crafting'],
      festivals: ['The Golden Drip Festival']
    },
  },
  'nougat-node': {
    id: 'nougat-node',
    townName: 'Nougat Node',
    county: 'Golden Caramel County',
    trade: {
      primaryProduct: {
        name: 'Nougat Confectionery and Candy Trade Processing',
        description: 'Central city where hazelnuts and honey are combined in massive kitchens to produce dense nougat blocks for provincial distribution.'
      },
      secondaryProducts: ['Caramel Bricks', 'Nut Candy Bars', 'Trade Packaging'],
      tradePartners: ['Hazelnut Terrace', 'Honeycomb Heights', 'Peanut Butter Falls', 'Toffee Town'],
      exportRoute: ['Nougat Node', 'Rail Terminal', 'Toffee Town'],
      localWorkforce: ['Confectioners', 'Warehouse Managers', 'Rail Operators', 'Trade Merchants'],
      purpose: 'The Economic Engine of Golden Caramel County. Strategic location at the crossroads of all trade routes in the county.'
    },
    transport: {
      mainRoads: ['Hazelnut Road', 'Honey Road', 'Mill Road', 'Capital Route'],
      riversCanals: [],
      infrastructure: ['Nougat Central Rail Terminal', 'Mountain Winch Transport Lines (Highline)', 'Golden Balloon Dock (Air Balloon)'],
      tradeHubs: ['Grand Caravan Square', 'Rail Freight Yard'],
      typicalVehicles: ['Freight Wagons', 'Rail Trains', 'Cargo Balloons', 'Cable Baskets']
    },
    town: {
      architectureStyle: 'Industrial Candy Warehouses and Trade Towers. Large brick warehouses with caramel-colored roofs and tall trade towers.',
      layout: 'Circular Trade City with Transport Rings (Trade Markets -> Factories -> Transport Hubs).',
      landmarks: ['Nougat Central Station', 'The Grand Trade Exchange', 'The Balloon Dock Tower'],
      dailyActivities: ['Candy Production', 'Trade Negotiation', 'Cargo Transport'],
      festivals: ['The Great Trade Fair']
    }
  },
  'peanut-butter-falls': {
    id: 'peanut-butter-falls',
    townName: 'Peanut Butter Falls',
    county: 'Golden Caramel County',
    trade: {
      primaryProduct: {
        name: 'Creamy Peanut Butter and Roasted Peanut Base',
        description: 'Vast farms supply mills that use waterfall energy to grind peanuts into rich butter continuously throughout the year.'
      },
      secondaryProducts: ['Peanut Oil', 'Roasted Peanuts', 'Peanut Caramel Mix', 'Peanut Crumble'],
      tradePartners: ['Nougat Node', 'Hazelnut Terrace', 'Toffee Town'],
      exportRoute: ['Peanut Butter Falls', 'Nougat Node', 'Rail Terminal', 'Toffee Town'],
      localWorkforce: ['Peanut Farmers', 'Mill Workers', 'Barrel Makers', 'Transport Caravans'],
      purpose: 'Natural Water Power Meets Nut Agriculture. Settlement grew around powerful waterfalls that power grinding mills for bulk peanut processing.'
    },
    transport: {
      mainRoads: ['Mill Road', 'Peanut Trade Route to Nougat Node'],
      riversCanals: ['The Peanut River', 'Mill Channels'],
      infrastructure: ['Mill Bridges', 'Waterwheel Platforms'],
      tradeHubs: ['The Mill Exchange Yard'],
      typicalVehicles: ['Peanut Freight Wagons', 'River Barges', 'Cargo Balloons']
    },
    town: {
      architectureStyle: 'Mill Houses, Waterwheel Workshops, Wooden Bridges. Timber and stone built to withstand moisture.',
      layout: 'Waterfall Industrial Village with mills positioned along water flows.',
      landmarks: ['The Great Peanut Mill', 'The Butterfall Cascade', 'The Barrelmaker Guild Hall'],
      dailyActivities: ['Harvesting Peanuts', 'Grinding Nuts', 'Preparing Shipments'],
      festivals: ['The Mill Turning Festival']
    }
  }
};
