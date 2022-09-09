import { BACKGROUND_ASPECT_RATIO } from 'config';
import { Component } from './component';
import { IBackgroundProps, IGameState, IRectangle } from 'interfaces';
import { drawImage } from 'services';

class Background extends Component {
  private image: HTMLImageElement;
  private speed: number;

  private bounds: IRectangle[];

  constructor(
    context: CanvasRenderingContext2D,
    gameState: IGameState,
    backgroundProps: IBackgroundProps,
  ) {
    super(context, gameState);

    this.speed = backgroundProps.speed;
    this.image = backgroundProps.image;
  }

  onCreate(): void {}

  onResize(screenWidth: number, screenHeight: number) {
    const backgroundWidth = screenHeight * BACKGROUND_ASPECT_RATIO;
    const backgroundHeight = screenHeight;

    this.bounds = [
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
    const xTranslation = this.speed * delta;
    this.bounds.forEach((bounds) => {
      if (bounds.x <= -bounds.width) {
        bounds.x = bounds.width - 5;
      }
      bounds.x -= xTranslation;
    });
  }

  render(): void {
    this.bounds.forEach((bounds) => {
      if (bounds.x <= this.context.canvas.width) {
        drawImage(this.context, this.image, bounds);
      }
    });
  }
}

export { Background };
