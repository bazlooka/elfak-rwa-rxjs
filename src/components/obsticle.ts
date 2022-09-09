import { fromEvent } from 'rxjs';

import {
  ELECTRON_SIZE,
  ELECTRON_SPAWN_ODDS,
  OBSTICLE_ASPECT_RATIO,
  OBSTICLE_MARIGIN_Y,
  OBSTICLE_SPEED,
  OBSTICLE_STARTING_POS,
  OBSTICLE_WIDTH,
  OBSTICLE_WINDOW_HEIGHT,
} from 'config';
import { GameState } from 'enums';
import {
  IKeysDown,
  IRectangle,
  IObsticleProps,
  IElectronProps,
} from 'interfaces';
import { drawImage } from 'services';
import { Component } from './component';
import { Electron } from './electron';

import OBSTICLE_TOP_IMAGE from 'assets/images/obsticle-top.png';
import OBSTICLE_BOTTOM_IMAGE from 'assets/images/obsticle-bottom.png';

class Obsticle extends Component<IObsticleProps> {
  private static topObsticleImg: HTMLImageElement;
  private static bottomObsticleImg: HTMLImageElement;

  private _centerYRelative: number;
  private _centerY: number;

  private _topObsticleBounds: IRectangle;
  private _bottomObsticleBounds: IRectangle;

  private _passed: boolean;

  private _electron: Electron;

  static fetchImages() {
    if (!Obsticle.topObsticleImg) {
      const img = new Image();
      fromEvent(img, 'load').subscribe(() => {
        Obsticle.topObsticleImg = img;
      });
      img.src = OBSTICLE_TOP_IMAGE;
    }

    if (!Obsticle.bottomObsticleImg) {
      const img = new Image();
      fromEvent(img, 'load').subscribe(() => {
        Obsticle.bottomObsticleImg = img;
      });
      img.src = OBSTICLE_BOTTOM_IMAGE;
    }
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

  onCreate(): void {
    this._passed = false;

    this._centerYRelative =
      OBSTICLE_MARIGIN_Y + Math.random() * (1 - OBSTICLE_MARIGIN_Y);

    this._centerY = this._centerYRelative * this.context.canvas.height;
    const centerX = this.context.canvas.width + OBSTICLE_STARTING_POS;

    Obsticle.fetchImages();

    this._topObsticleBounds = {
      x: centerX,
      y: 0,
      width: OBSTICLE_WIDTH,
      height: 0,
    };

    this._bottomObsticleBounds = {
      x: centerX,
      y: 0,
      width: OBSTICLE_WIDTH,
      height: 0,
    };

    if (Math.floor(Math.random() * ELECTRON_SPAWN_ODDS) === 1) {
      this.spawnElectron();
    }
  }

  spawnElectron() {
    const elProps: IElectronProps = {
      player: this.props.player,
      bounds: {
        x: this.centerX - ELECTRON_SIZE / 2,
        y: this.centerY - ELECTRON_SIZE / 2,
        width: ELECTRON_SIZE,
        height: ELECTRON_SIZE,
      },
    };
    this._electron = new Electron(this.context, this.gameState, elProps);
  }

  onResize(newWidth: number, newHeight: number): void {
    this._centerY = this._centerYRelative * newHeight;

    const obsticleHeight = OBSTICLE_WIDTH * OBSTICLE_ASPECT_RATIO;

    this._topObsticleBounds.y =
      this._centerY - OBSTICLE_WINDOW_HEIGHT / 2 - obsticleHeight;
    this._topObsticleBounds.height = obsticleHeight;
    this._bottomObsticleBounds.y = this._centerY + OBSTICLE_WINDOW_HEIGHT / 2;
    this._bottomObsticleBounds.height = obsticleHeight;

    if (this._electron) {
      this._electron.onResize(newWidth, newHeight);
    }
  }

  update(delta: number, keysDown: IKeysDown): void {
    if (this.gameState.currentState === GameState.PLAYING) {
      const xTranslation = delta * OBSTICLE_SPEED;
      this.moveObsticle(xTranslation);

      if (this._electron) {
        this._electron.update(delta, keysDown, xTranslation);
      }
    }
  }

  moveObsticle(xTranslation: number) {
    this._topObsticleBounds.x -= xTranslation;
    this._bottomObsticleBounds.x -= xTranslation;
    if (!this._passed && this.centerX < this.context.canvas.width / 2) {
      this._passed = true;
      this.gameState.score++;
    }
  }

  render(): void {
    if (!Obsticle.topObsticleImg || !Obsticle.bottomObsticleImg) {
      return;
    }

    drawImage(this.context, Obsticle.topObsticleImg, this._topObsticleBounds);
    drawImage(
      this.context,
      Obsticle.bottomObsticleImg,
      this._bottomObsticleBounds,
    );

    if (this._electron) {
      this._electron.render();
    }
  }
}

export { Obsticle };
