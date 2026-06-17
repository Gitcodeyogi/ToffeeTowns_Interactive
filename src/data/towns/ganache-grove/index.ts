import { identity } from './identity';
import { economy } from './economy';
import { trade } from './trade';
import { gossip } from './gossip';
import { people } from './people';
import { problems } from './problems';
import { health } from './health';
import { fun } from './fun';

export const GanacheGroveTownData = {
  identity,
  economy,
  trade,
  gossip,
  people,
  problems,
  health,
  fun
};

export type TownData = typeof GanacheGroveTownData;
export { identity, economy, trade, gossip, people, problems, health, fun };
