import { BACKGROUND_ASPECT_RATIO } from 'config';
import { Component } from './component';
import { IBackgroundProps, IRectangle } from 'interfaces';
import { drawImage } from 'services';

class Background extends Component {
  private image: HTMLImageElement;
  private speed: number;

  private bounds: IRectangle[];

  constructor(
    context: CanvasRenderingContext2D,
    backgroundProps: IBackgroundProps,
  ) {
    super(context);

    this.speed = backgroundProps.speed;
    this.image = backgroundProps.image;

    const backgroundWidth = context.canvas.height * BACKGROUND_ASPECT_RATIO;
    const backgroundHeight = context.canvas.height;

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

  resize(screenWidth: number, screenHeight: number) {
    this.bounds.forEach((bounds) => {
      bounds.width = screenHeight * BACKGROUND_ASPECT_RATIO;
      bounds.height = screenHeight;
    });
  }

  update(delta: number): void {
    const xTranslation = this.speed * delta;
    this.bounds.forEach((bounds) => {
      if (bounds.x <= -bounds.width) {
        bounds.x = bounds.width;
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
