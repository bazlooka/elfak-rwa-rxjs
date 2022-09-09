import { interval, map, Observable } from 'rxjs';

import {
  OBSTICLE_OFFSCREEN_THRESHOLD,
  OBSTICLE_SPAWN_INTERVAL_MS,
} from 'config';
import { Obsticle, Player } from 'components';
import { IGameState } from 'interfaces';

const startSpawningObsticles = (
  context: CanvasRenderingContext2D,
  gameState: IGameState,
  player: Player,
): Observable<Obsticle> => {
  return interval(OBSTICLE_SPAWN_INTERVAL_MS).pipe(
    map(() => {
      return new Obsticle(context, gameState, { player });
    }),
  );
};

const filterPassedObsticles = (obsticles: Obsticle[]) => {
  return obsticles.filter((obsticle) => {
    return obsticle.centerX > -OBSTICLE_OFFSCREEN_THRESHOLD;
  });
};

export { startSpawningObsticles, filterPassedObsticles };
