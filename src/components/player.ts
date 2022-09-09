import { fromEvent } from 'rxjs';

import { Component } from './component';
import { IGameState, IKeysDown, IRectangle } from 'interfaces';
import {
  GRAVITY,
  JUMP_ACCELERATION,
  PLAYER_ANIM_FRAME_COUNT,
  PLAYER_ANIM_FRAME_DURATION,
  PLAYER_ANIM_FRAME_SIZE,
  PLAYER_SIZE,
} from 'config';
import { drawImageRegion } from 'services';
import { GameState } from 'enums';

import PLAYER_ANIM_IMG from 'assets/images/player.png';

class Player extends Component {
  private _bounds: IRectangle;
  private accelerationY: number;
  private _startY: number;

  private img: HTMLImageElement;

  private currentTime: number;

  get bounds() {
    return this._bounds;
  }

  startRound() {
    this.accelerationY = 0;
    this.jump();
  }

  jump(): void {
    this.accelerationY = -JUMP_ACCELERATION;
  }

  die(): void {
    this.bounds.y = this._startY;
  }

  onCreate(): void {
    this._bounds = {
      x: (this.context.canvas.width - PLAYER_SIZE) / 2,
      y: (this.context.canvas.height - PLAYER_SIZE) / 2,
      width: PLAYER_SIZE,
      height: PLAYER_SIZE,
    };
    this.currentTime = 0;

    const img = new Image();
    fromEvent(img, 'load').subscribe(() => {
      this.img = img;
    });
    img.src = PLAYER_ANIM_IMG;
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

  render(): void {
    if (!this.img || this.gameState.currentState === GameState.ENTER_NICKNAME) {
      return;
    }

    const currFrame =
      Math.floor(this.currentTime / PLAYER_ANIM_FRAME_DURATION) %
      PLAYER_ANIM_FRAME_COUNT;
    const sourceRect: IRectangle = {
      x: currFrame * PLAYER_ANIM_FRAME_SIZE,
      y: 0,
      width: PLAYER_ANIM_FRAME_SIZE,
      height: PLAYER_ANIM_FRAME_SIZE,
    };
    drawImageRegion(this.context, this.img, this._bounds, sourceRect);
  }
}

export { Player };
