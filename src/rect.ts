import { IEntity } from './interfaces/IEntity';

class Rect implements IEntity {
  x: number;
  y: number;
  color: string;
  back: boolean = false;

  constructor(x: number = 0, y: number = 0) {
    this.x = x;
    this.y = y;
    this.color = ['green', 'blue', 'red', 'yellow', 'black', 'gray'][
      Math.round(Math.random() * 5)
    ];
  }

  update(context: CanvasRenderingContext2D, tFrame: number, delta: number) {
    if (!this.back && this.x + delta / 2 >= context.canvas.width - 50) {
      this.back = true;
    } else if (this.x - delta / 2 <= 0) {
      this.back = false;
    }

    this.x = this.back ? this.x - delta / 2 : this.x + delta / 2;
  }

  render(context: CanvasRenderingContext2D) {
    context.fillStyle = this.color;
    context.fillRect(this.x, this.y, 50, 50);
  }
}

export default Rect;
