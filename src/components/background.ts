import { BACKGROUND_ASPECT_RATIO } from 'config';
import { IBackgroundProps, IGameState, IRectangle } from 'interfaces';
import { drawImage } from 'services';
import { Component } from './component';

class Background extends Component {
  private _image: HTMLImageElement;
  private _speed: number;

  private _bounds: IRectangle[];

  constructor(
    context: CanvasRenderingContext2D,
    gameState: IGameState,
    backgroundProps: IBackgroundProps,
  ) {
    super(context, gameState);

    this._speed = backgroundProps.speed;
    this._image = backgroundProps.image;
  }

  onCreate(): void {}

  onResize(screenWidth: number, screenHeight: number) {
    const backgroundWidth = screenHeight * BACKGROUND_ASPECT_RATIO;
    const backgroundHeight = screenHeight;

    this._bounds = [
      {
        x: 0,
        y: 0,
        width: backgroundWidth,
        height: backgroundHeight,
      },
      {
        x: backgroundWidth,
        y: 0,
        width: backgroundWidth,
        height: backgroundHeight,
      },
    ];
  }

  update(delta: number): void {
    const xTranslation = this._speed * delta;
    this._bounds.forEach((bounds) => {
      if (bounds.x <= -bounds.width) {
        this.returnToStartingPosition(bounds);
      }
      bounds.x -= xTranslation;
    });
  }

  returnToStartingPosition(bounds: IRectangle) {
    const overlapAmount = 10;
    bounds.x = bounds.width - overlapAmount;
  }

  render(): void {
    this._bounds.forEach((bounds) => {
      if (bounds.x <= this.context.canvas.width) {
        drawImage(this.context, this._image, bounds);
      }
    });
  }
}

export { Background };
