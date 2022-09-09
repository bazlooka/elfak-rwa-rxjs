import {
  ELECTRON_ANIM_FRAME_COUNT,
  ELECTRON_ANIM_FRAME_DURATION,
  ELECTRON_ANIM_FRAME_SIZE,
} from 'config';
import { IKeysDown } from 'interfaces';
import { IAnimatedSpriteProps } from 'interfaces/IAnimatedSpriteProps';
import { fromEvent } from 'rxjs';
import { AnimatedSprite } from './animatedSprite';
import { Component } from './component';

import ELECTRON_ANIM_IMG from 'assets/images/electron.png';
import { ElectronState } from 'enums/ElectronState';
import { IElectronProps } from 'interfaces/IElectronProps';
import { putPlayerProfile } from 'services';

class Electron extends Component<IElectronProps> {
  private sprite: AnimatedSprite;

  private currTime: number;
  private caughtTime: number;

  private static img: HTMLImageElement;

  private state: ElectronState;

  onCreate(): void {
    this.currTime = 0;
    this.caughtTime = 0;
    this.state = ElectronState.FREE;

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

    this.sprite = new AnimatedSprite(this.context, this.gameState, spriteProps);
    this.sprite.bounds = this.props.bounds;
  }

  onResize(newWidth: number, newHeight: number): void {}

  update(delta: number, keysDown: IKeysDown, xTranslation?: number): void {
    this.currTime += delta;
    if (this.state === ElectronState.FREE && xTranslation) {
      this.props.bounds.x -= xTranslation;
      if (this.props.bounds.x - this.props.player.bounds.x < 30) {
        this.state = ElectronState.CAUGHT;
      }
    } else if (this.state === ElectronState.CAUGHT) {
      this.caughtTime += delta;

      if (this.caughtTime > 2) {
        this.state = ElectronState.DESTROYED;
        this.gameState.player.electrons++;
        putPlayerProfile(this.gameState.player).then((player) => {
          this.gameState.player = player;
        });
        return;
      }
      const pX = this.props.player.bounds.x;
      const pY = this.props.player.bounds.y;

      this.props.bounds.x +=
        (pX + Math.cos(this.currTime * 8) * 20 - this.props.bounds.x) *
        delta *
        10;
      this.props.bounds.y +=
        (pY + Math.sin(this.currTime * 8) * 20 - this.props.bounds.y) *
        delta *
        10;
    }

    if (this.sprite) {
      this.sprite.update(delta, keysDown);
    }
  }
  render(): void {
    if (this.sprite && this.state !== ElectronState.DESTROYED) {
      this.sprite.render();
    }
  }
}

export { Electron };
