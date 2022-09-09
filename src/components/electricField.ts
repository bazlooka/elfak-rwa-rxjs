import { fromEvent } from 'rxjs';

import {
  EF_ASPECT_RATIO,
  EF_SCALE,
  EF_VERTICAL_SPEED,
  OBSTICLE_SPEED,
  OBSTICLE_STARTING_POS,
} from 'config';
import { GameState } from 'enums';
import { IKeysDown, IRectangle, IObsticleProps } from 'interfaces';
import { drawImage } from 'services';
import { Component } from './component';

import ELECTRIC_FIELD_IMG from 'assets/images/electric-field.png';

class ElectricField extends Component<IObsticleProps> {
  private static img: HTMLImageElement;

  private _bounds: IRectangle;

  get endX() {
    return this._bounds.x + this._bounds.width;
  }

  get bounds() {
    return this._bounds;
  }

  onCreate(): void {
    if (!ElectricField.img) {
      const img = new Image();
      fromEvent(img, 'load').subscribe(() => {
        ElectricField.img = img;
      });
      img.src = ELECTRIC_FIELD_IMG;
    }

    this._bounds = {
      x: this.context.canvas.width + OBSTICLE_STARTING_POS,
      y: 0,
      width: this.context.canvas.height * EF_ASPECT_RATIO * EF_SCALE,
      height: this.context.canvas.height * EF_SCALE,
    };
  }

  onResize(newWidth: number, newHeight: number): void {}

  update(delta: number, keysDown: IKeysDown): void {
    if (this.gameState.currentState === GameState.PLAYING) {
      this._bounds.x -= delta * OBSTICLE_SPEED;
      this._bounds.y -= delta * EF_VERTICAL_SPEED;
    }
  }

  render(): void {
    this.context.globalAlpha = 0.5;
    drawImage(this.context, ElectricField.img, this._bounds);
    this.context.globalAlpha = 1;
  }
}

export { ElectricField };
