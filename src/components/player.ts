import { fromEvent } from 'rxjs';

import {
  GRAVITY,
  JUMP_ACCELERATION,
  PLAYER_ANIM_FRAME_COUNT,
  PLAYER_ANIM_FRAME_DURATION,
  PLAYER_ANIM_FRAME_SIZE,
  PLAYER_SIZE,
} from 'config';
import { IKeysDown, IRectangle, IAnimatedSpriteProps } from 'interfaces';
import { GameState } from 'enums';
import { AnimatedSprite } from './animatedSprite';
import { Component } from './component';

import PLAYER_ANIM_IMG from 'assets/images/player.png';

class Player extends Component {
  private _bounds: IRectangle;
  private _accelerationY: number;
  private _startY: number;

  private _sprite: AnimatedSprite;

  get bounds() {
    return this._bounds;
  }

  startRound() {
    this._accelerationY = 0;
    this.jump();
  }

  jump(): void {
    this._accelerationY =
      -JUMP_ACCELERATION * this.gameState.gravityCoefficient;
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

    const img = new Image();
    fromEvent(img, 'load').subscribe(() => {
      const spriteProps: IAnimatedSpriteProps = {
        image: img,
        frameCount: PLAYER_ANIM_FRAME_COUNT,
        frameDuration: PLAYER_ANIM_FRAME_DURATION,
        frameSize: PLAYER_ANIM_FRAME_SIZE,
      };

      this._sprite = new AnimatedSprite(
        this.context,
        this.gameState,
        spriteProps,
      );
      this._sprite.bounds = this._bounds;
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
    if (this._sprite) {
      this._sprite.update(delta, keysDown);
    }

    if (this.gameState.currentState === GameState.PLAYING) {
      this._accelerationY +=
        GRAVITY * delta * this.gameState.gravityCoefficient;
      this.bounds.y += this._accelerationY * delta;

      if (keysDown['Space']) {
        this.jump();
      }
    }
  }

  render(): void {
    if (this.gameState.currentState !== GameState.ENTER_NICKNAME) {
      if (this._sprite) {
        this._sprite.render();
      }
    }
  }
}

export { Player };
