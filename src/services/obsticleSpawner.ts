import { interval, map, Observable } from 'rxjs';

import { OBSTICLE_MARIGIN_Y, OBSTICLE_SPAWN_INTERVAL_MS } from 'config';
import { Obsticle } from 'components';

const startSpawningObsticles = (
  context: CanvasRenderingContext2D,
): Observable<Obsticle> => {
  return interval(OBSTICLE_SPAWN_INTERVAL_MS).pipe(
    map(() => {
      const obsticleY =
        OBSTICLE_MARIGIN_Y +
        Math.random() * (context.canvas.height - OBSTICLE_MARIGIN_Y);
      return new Obsticle(context, obsticleY);
    }),
  );
};

export { startSpawningObsticles };
