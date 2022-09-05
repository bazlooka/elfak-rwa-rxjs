import { Component } from 'components/component';
import {
  OBSTICLE_SPAWN_INTERVAL_MS,
  OBSTICLE_SPEED,
  OBSTICLE_VERTICAL_MARIGIN,
  OBSTICLE_WIDTH,
  OBSTICLE_WINDOW_HEIGHT,
} from 'config';
import { fillRect } from 'helper';
import { IRectangle } from 'interfaces/IRectangle';
import { interval, map } from 'rxjs';

class Obsticle extends Component {
  topObsticleBounds: IRectangle;
  bottomObsticleBounds: IRectangle;

  constructor(context: CanvasRenderingContext2D, y: number) {
    super(context);

    const originX = context.canvas.width + 20;
    const originY = y;
    const obsticleHeight = this.context.canvas.height;

    this.topObsticleBounds = {
      x: originX,
      y: originY - OBSTICLE_WINDOW_HEIGHT / 2 - obsticleHeight,
      width: OBSTICLE_WIDTH,
      height: obsticleHeight,
    };

    this.bottomObsticleBounds = {
      x: originX,
      y: originY + OBSTICLE_WINDOW_HEIGHT / 2,
      width: OBSTICLE_WIDTH,
      height: obsticleHeight,
    };
  }

  update(delta: number): void {
    const xTranslation = delta * OBSTICLE_SPEED;
    this.topObsticleBounds.x -= xTranslation;
    this.bottomObsticleBounds.x -= xTranslation;
  }

  render(): void {
    fillRect(this.context, this.topObsticleBounds);
    fillRect(this.context, this.bottomObsticleBounds);
  }
}

const startSpawningObsticles = (context: CanvasRenderingContext2D) => {
  return interval(OBSTICLE_SPAWN_INTERVAL_MS).pipe(
    map(() => {
      const obsticleY =
        OBSTICLE_VERTICAL_MARIGIN +
        Math.random() * (context.canvas.height - OBSTICLE_VERTICAL_MARIGIN);
      return new Obsticle(context, obsticleY);
    }),
  );
};

export { Obsticle, startSpawningObsticles };
