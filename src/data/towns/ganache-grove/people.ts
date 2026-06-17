export interface CharacterProfile {
  id: string;
  name: string;
  role: string;
  appearance: string;
  traits: string[];
  quote: string;
  clan?: 'Bosses' | 'Rebels' | 'Neutral';
}

export const people: CharacterProfile[] = [
  {
    id: 'rowan-thistle',
    name: 'Rowan Thistle',
    role: 'Builder Apprentice',
    appearance: 'Young, eager eyes, wearing a leather work apron with pockets full of miniature blueprints, pencil behind ear.',
    traits: ['Optimistic', 'Industrious', 'Always trying to improve things'],
    quote: '"Every problem in the county has a practical wood-and-mortar solution!"',
    clan: 'Neutral'
  },
  {
    id: 'julie-frost',
    name: 'Julie Frost',
    role: 'Gazette Reporter',
    appearance: 'Sharp eyes, wearing a velvet newsboy cap, constantly holding a quick-ink quill and a small notepad.',
    traits: ['Curious', 'Expressive', 'Knows every rumor before breakfast'],
    quote: '"I don\'t make the news, I just capture its sweetest details!"',
    clan: 'Neutral'
  },
  {
    id: 'doctor-cedric',
    name: 'Dr. Cedric Oakenhart',
    role: 'Town Physician',
    appearance: 'Tall, kind hazel eyes, cozy sweater spun with green herbal yarn, carrying a flask of bark tea.',
    traits: ['Gentle', 'Wise', 'Obsessively hygienic', 'Loves forest remedies'],
    quote: '"Rest and warm tea cure most things. The rest is just clean air and good behavior."',
    clan: 'Neutral'
  },
  {
    id: 'professor-finley',
    name: 'Professor Finley',
    role: 'Academy Principal',
    appearance: 'Polished tweed vest, wire-rimmed glasses, holding a stack of leatherbound encyclopedias.',
    traits: ['Scholarly', 'Strict but fair', 'Loves local history'],
    quote: '"A mind uncultivated is like a grove overrun by wild cocoa weeds."',
    clan: 'Neutral'
  },
  {
    id: 'baker-mortimer',
    name: 'Baker Bramble Mortimer',
    role: 'Bakery Owner',
    appearance: 'Flour-dusted hands, round cheeks, smelling strongly of toasted walnuts and fresh dough.',
    traits: ['Jolly', 'Generous', 'Secretly competitive baker'],
    quote: '"If a problem can\'t be solved with a warm bun, it\'s a very big problem indeed."',
    clan: 'Neutral'
  },
  {
    id: 'blacksmith-crumblewise',
    name: 'Blacksmith Crumblewise',
    role: 'Forge Master',
    appearance: 'Soot-covered face, thick muscles, wearing a heavy iron-reinforced leather tunic.',
    traits: ['Gruff', 'Honest', 'Uncompromising craftsman'],
    quote: '"Steel holds its shape. Words do not. Let\'s build things that last."',
    clan: 'Bosses'
  },
  {
    id: 'mrs-petalworth',
    name: 'Mrs. Petalworth',
    role: 'Flower Merchant',
    appearance: 'Bright flowery apron, wearing a wide straw hat adorned with real sugar lilies.',
    traits: ['Cheerful', 'Talkative', 'Loves botanical mysteries'],
    quote: '"Flowers have a language of their own, and usually they are asking for water."',
    clan: 'Rebels'
  },
  {
    id: 'marshal-qrill',
    name: 'Marshal Qrill',
    role: 'Investigator & Sheriff',
    appearance: 'Polished silver star badge, sharp dark coat, carrying a brass magnifying spyglass.',
    traits: ['Observant', 'No-nonsense', 'Always alert'],
    quote: '"There are secrets in the bark of these woods, and I intend to read them all."',
    clan: 'Neutral'
  },
  {
    id: 'sir-goldwhistle',
    name: 'Sir Goldwhistle',
    role: 'Tax Collector',
    appearance: 'Crisp velvet suit, holding a golden ledger and a whistle made of pure brass.',
    traits: ['Meticulous', 'Stubborn', 'Always on time'],
    quote: '"Civic progress is funded by civic dues. Simple arithmetic, my friend."',
    clan: 'Neutral'
  },
  {
    id: 'pipkin-nutterby',
    name: 'Pipkin Nutterby',
    role: 'Resident Troublemaker & Accidental Hero',
    appearance: 'Permanently curious face with an oversized grin, wild messy dark brown hair with a signature silhouette front tuft. Wears a moss-green cap, cream shirt, suspenders, striped socks, and worn boots, carrying a small satchel whose contents are a mystery.',
    traits: ['Accidental Hero', 'Professional Idea-Haver', 'Permanently Curious'],
    quote: '"I have a brilliant idea!"',
    clan: 'Neutral'
  }
];
