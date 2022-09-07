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
  private _centerY: number;

  private _topObsticleBounds: IRectangle;
  private _bottomObsticleBounds: IRectangle;

  constructor(context: CanvasRenderingContext2D, y: number) {
    super(context, y);
  }

  get centerX() {
    return this._topObsticleBounds.x + OBSTICLE_WIDTH / 2;
  }

  get centerY() {
    return this._centerY;
  }

  get topObsticleBounds() {
    return this._topObsticleBounds;
  }

  get bottomObsticleBounds() {
    return this._bottomObsticleBounds;
  }

  onCreate(context: CanvasRenderingContext2D, [y]: any[]): void {
    this._centerY = y;
    const originX = context.canvas.width + OBSTICLE_STARTING_POS;

    this._topObsticleBounds = {
      x: originX,
      y: 0,
      width: OBSTICLE_WIDTH,
      height: 0,
    };

    this._bottomObsticleBounds = {
      x: originX,
      y: 0,
      width: OBSTICLE_WIDTH,
      height: 0,
    };
  }

  onResize(newWidth: number, newHeight: number): void {
    this._topObsticleBounds.y =
      this._centerY - OBSTICLE_WINDOW_HEIGHT / 2 - newHeight;
    this._topObsticleBounds.height = newHeight;

    this._bottomObsticleBounds.y = this._centerY + OBSTICLE_WINDOW_HEIGHT / 2;
    this._bottomObsticleBounds.height = newHeight;
  }

  update(delta: number): void {
    const xTranslation = delta * OBSTICLE_SPEED;
    this._topObsticleBounds.x -= xTranslation;
    this._bottomObsticleBounds.x -= xTranslation;
  }

  render(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = 'red';
    fillRect(ctx, this._topObsticleBounds);
    fillRect(ctx, this._bottomObsticleBounds);
    ctx.fillStyle = 'black';
    fillRect(ctx, {
      x: this.centerX,
      y: this.centerY,
      width: 5,
      height: 5,
    });
  }
}

export { Obsticle };
