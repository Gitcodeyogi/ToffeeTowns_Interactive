export interface RareSpecies {
  name: string;
  habitat: string;
  appearanceTime: string;
  behavior: string;
}

export interface TownFun {
  rareFauna: RareSpecies;
  festivals: string[];
  folklore: {
    title: string;
    description: string;
  }[];
}

export const fun: TownFun = {
  rareFauna: {
    name: 'Glowcap Fluttermoth',
    habitat: 'Near ancient ganache trees in the deep forest.',
    appearanceTime: 'Midnight under white lighting.',
    behavior: 'Attracted to glowing mushroom spores and sweet cocoa cream cups.'
  },
  festivals: [
    'Ganache Harvest Festival',
    'Woodcarving Forestry Championship',
    'Midnight Glow-Mushroom Tour'
  ],
  folklore: [
    {
      title: 'The Ghostly Belfry',
      description: 'Legend says the old forest bell rings at midnight when wood sprites dance.'
    },
    {
      title: 'Whispering Cocoa Roots',
      description: 'Foresters claim the ancient roots whisper recipes for chocolate fillings to sleeping travellers.'
    }
  ]
};
