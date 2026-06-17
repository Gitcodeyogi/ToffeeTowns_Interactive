export interface TheaterStory {
  title: string;
  description: string;
  narratorName: string;
  narratorRole: string;
  paragraphs: string[];
}

export interface TownTheaterPackage {
  townId: string;
  stories: {
    gossip?: TheaterStory;
    politics?: TheaterStory;
    economy?: TheaterStory;
    transport?: TheaterStory;
    legend?: TheaterStory;
  };
}

export const TOWN_THEATER_DIRECTORY: TownTheaterPackage[] = [];
