// Transport constants for the provincial transit atlas.
// Synced with CHOCOBROOK_ZONES from towns.ts.

export interface TransportTownEntry {
    town: string;
    road: string;
    rail: string;
}

export interface TransportZone {
    zone: string;
    towns: TransportTownEntry[];
}

export const CHOCOBROOK_TRANSPORT_ATLAS: TransportZone[] = [
    {
        zone: 'Nutwood County',
        towns: [
            { town: 'Hazelnut Terrace', road: 'Praline Pass', rail: 'Nut Elevator' },
            { town: 'Peanut Butter Falls', road: 'River Gorge Road', rail: 'Falls Funicular' },
            { town: 'Nougat Node', road: 'Crossroad Central', rail: 'Node Junction' },
            { town: 'Praline Port', road: 'Harbor Highway', rail: 'Dock Shuttle' },
        ]
    },
    {
        zone: 'Creamwood County',
        towns: [
            { town: 'Peppermint Peak', road: 'Frost Switchback', rail: 'Sled Rail' },
            { town: 'Banoffee Valley', road: 'Orchard Valley Road', rail: 'Valley Rail' },
            { town: 'Creme Tunnels', road: 'Underground Passage', rail: 'Glow-Bug Metro' },
            { town: 'Eclair Square', road: 'Glaze Boulevard', rail: 'Pastry Line' },
        ]
    },
    {
        zone: 'Cocoawood County',
        towns: [
            { town: 'Ganache Grove', road: 'Glossy Forest Rd', rail: 'Moonlight Mono' },
            { town: 'Cocoa Canyon', road: 'Canyon Edge Rd', rail: 'River Pulley' },
            { town: 'Lava Cake Lake', road: 'Ember Ring Road', rail: 'Thermal Express' },
            { town: 'Butterscotch Bay', road: 'Sunset Promenade', rail: 'Bay Ferry Rail' },
        ]
    },
    {
        zone: 'Honeywood County',
        towns: [
            { town: 'Honeycomb Heights', road: 'Vertical Switchback', rail: 'Amber Cable Car' },
            { town: 'Caramel Cove', road: 'Tide Road', rail: 'Surf Line' },
            { town: 'Sprinkle Sands', road: 'Rainbow Coastal Rd', rail: 'Beach Tram' },
            { town: 'Brownie Crossroads', road: 'Junction Circle', rail: 'Brownie Loop' },
        ]
    },
    {
        zone: 'Capital City',
        towns: [
            { town: 'Toffee Town', road: 'Caramel Causeway', rail: 'Toffee Express' },
        ]
    }
];
