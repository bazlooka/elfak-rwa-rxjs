import {
  OBSTICLE_ASPECT_RATIO,
  OBSTICLE_SPEED,
  OBSTICLE_STARTING_POS,
  OBSTICLE_WIDTH,
  OBSTICLE_WINDOW_HEIGHT,
} from 'config';
import { Component } from './component';
import { IRectangle } from 'interfaces';
import { drawImage, fillRect } from 'services';
import { fromEvent } from 'rxjs';

import OBSTICLE_TOP_IMAGE from 'assets/images/obsticle-top.png';
import OBSTICLE_BOTTOM_IMAGE from 'assets/images/obsticle-bottom.png';
import { GameState } from 'enums';

class Obsticle extends Component {
  static topObsticleImg: HTMLImageElement;
  static bottomObsticleImg: HTMLImageElement;

  private _centerYRelative: number;
  private _centerY: number;

  private _topObsticleBounds: IRectangle;
  private _bottomObsticleBounds: IRectangle;

  private _passed: boolean;

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

  onCreate([y]: any[]): void {
    this._centerYRelative = y;
    this._passed = false;

    const centerX = this.context.canvas.width + OBSTICLE_STARTING_POS;

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
  }

  onResize(newWidth: number, newHeight: number): void {
    this._centerY = this._centerYRelative * newHeight;

    const obsticleHeight = OBSTICLE_WIDTH * OBSTICLE_ASPECT_RATIO;

    this._topObsticleBounds.y =
      this._centerY - OBSTICLE_WINDOW_HEIGHT / 2 - obsticleHeight;
    this._topObsticleBounds.height = obsticleHeight;
    this._bottomObsticleBounds.y = this._centerY + OBSTICLE_WINDOW_HEIGHT / 2;
    this._bottomObsticleBounds.height = obsticleHeight;
  }

  update(delta: number): void {
    if (this.gameState.currentState === GameState.PLAYING) {
      const xTranslation = delta * OBSTICLE_SPEED;
      this._topObsticleBounds.x -= xTranslation;
      this._bottomObsticleBounds.x -= xTranslation;

      if (!this._passed && this.centerX < this.context.canvas.width / 2) {
        this._passed = true;
        this.gameState.score++;
      }
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

    fillRect(this.context, {
      x: this.centerX - 2,
      y: this.centerY - 2,
      width: 4,
      height: 4,
    });
  }
}

export { Obsticle };
