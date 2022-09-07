import {
  OBSTICLE_SPEED,
  OBSTICLE_STARTING_POS,
  OBSTICLE_WIDTH,
  OBSTICLE_WINDOW_HEIGHT,
} from 'config';
import { Component } from './component';
import { IRectangle } from 'interfaces';
import { fillRect } from 'services';

class Obsticle extends Component {
  topObsticleBounds: IRectangle;
  bottomObsticleBounds: IRectangle;

  constructor(context: CanvasRenderingContext2D, y: number) {
    super(context);

    const originX = context.canvas.width + OBSTICLE_STARTING_POS;
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

export { Obsticle };
