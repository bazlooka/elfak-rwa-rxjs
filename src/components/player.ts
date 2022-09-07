import { Component } from './component';
import { IKeysDown, IRectangle } from 'interfaces';
import { GRAVITY, JUMP_ACCELERATION, PLAYER_SIZE } from 'config';
import { fillRect } from 'services';

class Player extends Component {
  private _bounds: IRectangle;
  private accelerationY: number;
  private _dead: boolean;
  private _startY: number;

  constructor(context: CanvasRenderingContext2D) {
    super(context);
  }

  get bounds() {
    return this._bounds;
  }

  get dead() {
    return this._dead;
  }

  start() {
    this.accelerationY = 0;
    this._dead = false;
    this.jump();
  }

  jump(): void {
    this.accelerationY = -JUMP_ACCELERATION;
  }

  die(): void {
    this._dead = true;
    this.bounds.y = this._startY;
  }

  onCreate(context: CanvasRenderingContext2D): void {
    this._bounds = {
      x: (context.canvas.width - PLAYER_SIZE) / 2,
      y: (context.canvas.height - PLAYER_SIZE) / 2,
      width: PLAYER_SIZE,
      height: PLAYER_SIZE,
    };
    this._dead = true;
  }

  onResize(newWidth: number, newHeight: number): void {
    this._startY = (newHeight - PLAYER_SIZE) / 2;
    this._bounds.x = (newWidth - PLAYER_SIZE) / 2;
    if (this.dead) {
      this._bounds.y = (newHeight - PLAYER_SIZE) / 2;
    }
  }

  update(delta: number, keysDown: IKeysDown): void {
    if (!this._dead) {
      this.accelerationY += GRAVITY * delta;
      this.bounds.y += this.accelerationY * delta;

      if (keysDown['Space']) {
        this.jump();
      }
    }
  }

  render(ctx: CanvasRenderingContext2D): void {
    fillRect(ctx, this.bounds);
  }
}

export { Player };
