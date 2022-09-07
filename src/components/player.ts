import { fromEvent } from 'rxjs';

import { Component } from './component';
import { IGameState, IKeysDown, IRectangle } from 'interfaces';
import { GRAVITY, JUMP_ACCELERATION, PLAYER_SIZE } from 'config';
import { drawImageRegion } from 'services';
import PLAYER_IMG from 'assets/images/player.png';
import { GameState } from 'enums';

const FRAME_DURATION = 1 / 15;
const FRAME_COUNT = 8;
const FRAME_SIZE = 32;

class Player extends Component {
  private _bounds: IRectangle;
  private accelerationY: number;
  private _startY: number;

  private img: HTMLImageElement;

  private currentTime: number;

  constructor(context: CanvasRenderingContext2D, gameState: IGameState) {
    super(context, gameState);
  }

  get bounds() {
    return this._bounds;
  }

  start() {
    this.accelerationY = 0;
    this.jump();
  }

  jump(): void {
    this.accelerationY = -JUMP_ACCELERATION;
  }

  die(): void {
    this.bounds.y = this._startY;
  }

  onCreate(context: CanvasRenderingContext2D): void {
    this._bounds = {
      x: (context.canvas.width - PLAYER_SIZE) / 2,
      y: (context.canvas.height - PLAYER_SIZE) / 2,
      width: PLAYER_SIZE,
      height: PLAYER_SIZE,
    };
    this.currentTime = 0;

    const img = new Image();
    fromEvent(img, 'load').subscribe(() => {
      this.img = img;
    });
    img.src = PLAYER_IMG;
  }

  onResize(newWidth: number, newHeight: number): void {
    this._startY = (newHeight - PLAYER_SIZE) / 2;
    this._bounds.x = (newWidth - PLAYER_SIZE) / 2;
    if (this.gameState.currentState !== GameState.PLAYING) {
      this._bounds.y = (newHeight - PLAYER_SIZE) / 2;
    }
  }

  update(delta: number, keysDown: IKeysDown): void {
    this.currentTime += delta;
    if (this.gameState.currentState === GameState.PLAYING) {
      this.accelerationY += GRAVITY * delta;
      this.bounds.y += this.accelerationY * delta;

      if (keysDown['Space']) {
        this.jump();
      }
    }
  }

  render(ctx: CanvasRenderingContext2D): void {
    if (!this.img) {
      return;
    }
    const currFrame =
      Math.floor(this.currentTime / FRAME_DURATION) % FRAME_COUNT;
    const sourceRect: IRectangle = {
      x: currFrame * FRAME_SIZE,
      y: 0,
      width: FRAME_SIZE,
      height: FRAME_SIZE,
    };
    drawImageRegion(ctx, this.img, this._bounds, sourceRect);
  }
}

export { Player };
