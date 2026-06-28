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

export const TOWN_THEATER_DIRECTORY: TownTheaterPackage[] = [
  {
    townId: 'ganache-grove',
    stories: {
      gossip: {
        title: 'The Mossberry Whispers',
        description: 'Miss Page Bumblewick shares secrets about Pipkin\'s secret squirrel academy and Captain Winston Butterfield\'s midnight tea auditing.',
        narratorName: 'Miss Page Bumblewick',
        narratorRole: 'Amateur Investigator',
        paragraphs: [
          'Step closer, dear traveler, and let me tell you about what goes on under the shadow of the velvet canopy when the sun drops.',
          'You see, everyone in the Grove thinks Pipkin Nutterby is just an ordinary troublemaker. But my scouts tell a different story. He is currently training a local troop of red-tailed squirrels led by Biglet. He calls it "The Acorn Commando". They practice targeting by throwing empty hazelnut shells at wooden logs!',
          'And Captain Winston Butterfield? Oh, he acts so clean and proper with his municipal laws. But last Tuesday at 2:00 AM, he was spotted drinking dark syrup tea and counting coins under a glowing mushroom, muttering about a two-cent budget gap in the municipal flowerbox funds!',
          'Keep your ears to the ground and your eyes on the moss. In Ganache Grove, even the trees have ears, and they whisper the sweetest secrets.'
        ]
      },
      politics: {
        title: 'The Great Walkway Debate',
        description: 'Julie Frost recounts the fiery debates in the town hall between the Rebels and the Bosses regarding local infrastructure.',
        narratorName: 'Julie Frost',
        narratorRole: 'Gazette Reporter',
        paragraphs: [
          'Welcome to the press box of the Council Chambers! I am Julie Frost, and I was there when the ink dried on the Elevated Walkway Act.',
          'The debate was absolutely boiling. On one side, Rowan Thistle and the builder guild argued that residents were ruining their velvet boots in the mud pools of Gossip Corner. "Progress requires solid pathways!" Rowan shouted, waving a blueprint.',
          'On the other side, Miss Page Bumblewick and the Rebels Clan staged a protest, arguing that wooden walkways would disrupt the rare Glowcap Fluttermoths who nest in the ground moss. "Nature needs space, not suspenders!" they cried.',
          'It took three days of intense auditing, two public surveys, and a final casting vote from Captain Winston Butterfield to approve a compromise: elevated paths built with narrow spacing to allow the fluttermoth larvae to crawl beneath safely. A triumph for local compromise!'
        ]
      },
      economy: {
        title: 'The Molasses Crisis of Year 398',
        description: 'Rowan Thistle details the economic chaos when the cargo wagons broke down and how the monorail proposal was born.',
        narratorName: 'Rowan Thistle',
        narratorRole: 'Builder Apprentice',
        paragraphs: [
          'Ah, the Molasses Crisis... I still get sticky nightmares thinking about that autumn.',
          'It was Year 398. The harvest of sweet molasses pods was the largest in Ganache history. We loaded twenty heavy horse wagons to transport the goods to Mossberry Wharf. But halfway down the road, a massive thunderstorm turned the clay tracks into thick, chocolatey mud.',
          'Every single wagon sank up to its axles! The molasses jars broke, and we had a river of sticky syrup flowing down the main street. The bakers couldn\'t get sugar, tariffs collapsed, and Captain Winston Butterfield was in tears over the lost tax records.',
          'That was the day we realized horse wagons weren\'t enough. I sat down with Professor Finley and sketched the first blueprint for the Glass Monorail Pod—an elevated, gravity-fed monorail network that runs safely above the mud. That crisis shaped our modern grove!'
        ]
      },
      transport: {
        title: 'Canopy Navigation and Safety',
        description: 'Horace Ticklebell narrating the history of the glass monorail, built to run above the roots, bypassing forest hazards.',
        narratorName: 'Horace Ticklebell',
        narratorRole: 'Railway Stationmaster',
        paragraphs: [
          'Listen carefully, newcomer. Exploring the high canopy of Ganache Grove is not like walking the city streets. One misstep and you\'re falling into a pool of wild nettles.',
          'That is why the monorail was built. We stationmasters and canopy rangers laid the tracks along the sturdy ironwood branches. The glass pods are made of hardened candy-pane glass, designed to withstand falling tree limbs and hyperactive squirrels like Biglet.',
          'You might wonder why we don\'t allow hot air balloons here. Some city folks once tried to fly a chocolate-balloon over the Grove. Within five minutes, a gust of wind caught the canopy, and the balloon was shredded by the sharp branches of the ancient redwoods. The pilot had to be rescued by our local rangers!',
          'So stick to the horse wagons on the low lanes and the glass monorail in the branches. Keep your harness buckled, and leave the flying to the forest owls.'
        ]
      },
      legend: {
        title: 'The Sacred Elder Tree Spirit',
        description: 'Professor Finley shares the legend of the ancient sprites who reside in the sacred elder roots.',
        narratorName: 'Professor Finley',
        narratorRole: 'Academy Principal',
        paragraphs: [
          'As a man of science and confectionery history, I don\'t usually believe in ghost stories. But the Sacred Elder Tree is an exception.',
          'For centuries, our ancestors spoke of the Wood-Sprites who live in the deep root hollows. They say the sprites are caretakers of the forest\'s health. When the ancient trees grow sick, the sprites sing to the roots, filtering toxic spores from the soil.',
          'However, the sprites are shy and fragile. They are powered by the sweet scent of honeyberry juice. If they go hungry, the canopy turns grey and the spore levels spike, bringing the dread Moss Sneezles to our residents.',
          'When Pipkin took Baker Bramble Mortimer\'s loaf to the roots, he was actually saving a nesting family of sprites who had fallen ill. That is the magic of Ganache Grove—history and legends are alive, and they are sweeter than we think.'
        ]
      }
    }
  }
];
