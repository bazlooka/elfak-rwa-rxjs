import { filter, fromEvent, merge, Subscription } from 'rxjs';
import {
  GRAVITY,
  JUMP_ACCELERATION,
  LARGE_TEXT_FONT,
  OFFSCREEN_THRESHOLD,
} from '../config';
import { IGame } from '../interfaces/IGame';

class FlappyBird implements IGame {
  private birdY: number;

  private accelerationY: number;

  private subsciption: Subscription;

  private dead: boolean;

  constructor(context: CanvasRenderingContext2D) {
    this.birdY = context.canvas.height / 2 - 25;

    this.accelerationY = 0.1;
    this.dead = false;

    const spacePressed$ = fromEvent(window, 'keydown').pipe(
      filter((event: KeyboardEvent) => {
        return event.key === ' ';
      }),
    );

    const mousePressed$ = fromEvent(window, 'mousedown').pipe(
      filter((event: MouseEvent) => {
        return event.button === 0;
      }),
    );

    this.subsciption = merge(spacePressed$, mousePressed$).subscribe(() => {
      this.jump();
    });
  }

  jump() {
    this.accelerationY = -JUMP_ACCELERATION;
  }

  update(
    context: CanvasRenderingContext2D,
    tFrame: number,
    delta: number,
  ): void {
    if (!this.dead) {
      this.accelerationY += GRAVITY * delta;
      this.birdY += this.accelerationY * delta;
    }

    if (
      this.birdY < -OFFSCREEN_THRESHOLD ||
      this.birdY > context.canvas.height + OFFSCREEN_THRESHOLD
    ) {
      this.dead = true;
      this.subsciption.unsubscribe();
      this.birdY = context.canvas.height / 2 - 25;
    }
  }

  render(context: CanvasRenderingContext2D): void {
    context.fillStyle = 'green';
    context.fillRect(context.canvas.width / 2 - 25, this.birdY - 25, 50, 50);
  }
}

export default FlappyBird;
