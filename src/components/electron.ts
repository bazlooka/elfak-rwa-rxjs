import { fromEvent } from 'rxjs';

import {
  ELECTRON_ANIM_FRAME_COUNT,
  ELECTRON_ANIM_FRAME_DURATION,
  ELECTRON_ANIM_FRAME_SIZE,
  ELECTRON_FOLLOW_SPEED,
  ELECTRON_ROTATION_DIAMETER,
  ELECTRON_ROTATION_SPEED,
} from 'config';
import { ElectronState } from 'enums';
import { IKeysDown, IAnimatedSpriteProps, IElectronProps } from 'interfaces';
import { putPlayerProfile } from 'services';
import { AnimatedSprite } from './animatedSprite';
import { Component } from './component';

import ELECTRON_ANIM_IMG from 'assets/images/electron.png';

class Electron extends Component<IElectronProps> {
  private static img: HTMLImageElement;

  private _state: ElectronState;
  private _sprite: AnimatedSprite;

  private _currTime: number;
  private _totalTimeFollowing: number;

  onCreate(): void {
    this._currTime = 0;
    this._totalTimeFollowing = 0;
    this._state = ElectronState.FREE;

    if (!Electron.img) {
      this.loadImage();
    } else {
      this.createSprite();
    }
  }

  loadImage() {
    const img = new Image();
    fromEvent(img, 'load').subscribe(() => {
      Electron.img = img;
      this.createSprite();
    });
    img.src = ELECTRON_ANIM_IMG;
  }

  createSprite() {
    const spriteProps: IAnimatedSpriteProps = {
      image: Electron.img,
      frameCount: ELECTRON_ANIM_FRAME_COUNT,
      frameDuration: ELECTRON_ANIM_FRAME_DURATION,
      frameSize: ELECTRON_ANIM_FRAME_SIZE,
    };

    this._sprite = new AnimatedSprite(
      this.context,
      this.gameState,
      spriteProps,
    );
    this._sprite.bounds = this.props.bounds;
  }

  onResize(newWidth: number, newHeight: number): void {}

  update(delta: number, keysDown: IKeysDown, xTranslation?: number): void {
    this._currTime += delta;

    if (!xTranslation) {
      return;
    }

    switch (this._state) {
      case ElectronState.FREE:
        this.moveWithObsticles(xTranslation);
        break;
      case ElectronState.CAUGHT:
        this.followPlayer(delta);
        break;
    }

    if (this._sprite) {
      this._sprite.update(delta, keysDown);
    }
  }

  moveWithObsticles(xTranslation: number) {
    this.props.bounds.x -= xTranslation;
    if (this.props.bounds.x - this.props.player.bounds.x < 30) {
      this._state = ElectronState.CAUGHT;
    }
  }

  followPlayer(delta: number) {
    this._totalTimeFollowing += delta;

    const pX = this.props.player.bounds.x;
    const pY = this.props.player.bounds.y;

    this.props.bounds.x +=
      (pX +
        Math.cos(this._currTime * ELECTRON_ROTATION_SPEED) *
          ELECTRON_ROTATION_DIAMETER -
        this.props.bounds.x) *
      delta *
      ELECTRON_FOLLOW_SPEED;

    this.props.bounds.y +=
      (pY +
        Math.sin(this._currTime * ELECTRON_ROTATION_SPEED) *
          ELECTRON_ROTATION_DIAMETER -
        this.props.bounds.y) *
      delta *
      ELECTRON_FOLLOW_SPEED;

    if (this._totalTimeFollowing > 2) {
      this._state = ElectronState.DESTROYED;
      this.gameState.player.electrons++;
      putPlayerProfile(this.gameState.player).then((player) => {
        this.gameState.player = player;
      });
    }
  }

  render(): void {
    if (this._sprite && this._state !== ElectronState.DESTROYED) {
      this._sprite.render();
    }
  }
}

export { Electron };
