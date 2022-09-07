import { Component } from './component';
import { IKeysDown, IRectangle } from 'interfaces';
import {
  GRAVITY,
  JUMP_ACCELERATION,
  OFFSCREEN_THRESHOLD,
  PLAYER_SIZE,
} from 'config';

class Player extends Component {
  private _bounds: IRectangle;
  private accelerationY: number;
  private _dead: boolean;

  constructor(context: CanvasRenderingContext2D) {
    super(context);

    this._bounds = {
      x: (context.canvas.width - PLAYER_SIZE) / 2,
      y: (context.canvas.height - PLAYER_SIZE) / 2,
      width: PLAYER_SIZE,
      height: PLAYER_SIZE,
    };
    this._dead = true;
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
    this.bounds.y = (this.context.canvas.height - PLAYER_SIZE) / 2;
  }

  update(delta: number, keysDown: IKeysDown): void {
    if (!this._dead) {
      this.accelerationY += GRAVITY * delta;
      this.bounds.y += this.accelerationY * delta;

      if (keysDown['Space']) {
        this.jump();
      }

      if (
        this.bounds.y < -OFFSCREEN_THRESHOLD ||
        this.bounds.y > this.context.canvas.height + OFFSCREEN_THRESHOLD
      ) {
        this.die();
      }
    }
  }

  render(): void {
    this.context.fillRect(
      this.bounds.x,
      this.bounds.y,
      this.bounds.width,
      this.bounds.height,
    );
  }
}

export { Player };
