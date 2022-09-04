import { GRAVITY, JUMP_ACCELERATION, OFFSCREEN_THRESHOLD } from 'config';
import { IGame, IKeysDown } from 'interfaces';

class FlappyBird implements IGame {
  private context: CanvasRenderingContext2D;

  private birdY: number;
  private accelerationY: number;

  private dead: boolean;

  constructor(context: CanvasRenderingContext2D) {
    this.context = context;
    this.birdY = context.canvas.height / 2 - 25;

    this.accelerationY = 0.1;
    this.dead = false;
  }

  jump() {
    this.accelerationY = -JUMP_ACCELERATION;
  }

  update(delta: number, keysDown: IKeysDown): void {
    if (!this.dead) {
      this.accelerationY += GRAVITY * delta;
      this.birdY += this.accelerationY * delta;

      if (keysDown['Space']) {
        this.jump();
      }
    } else {
      if (keysDown['Space']) {
        this.dead = false;
        this.jump();
      }
    }

    if (
      this.birdY < -OFFSCREEN_THRESHOLD ||
      this.birdY > this.context.canvas.height + OFFSCREEN_THRESHOLD
    ) {
      this.dead = true;
      this.birdY = this.context.canvas.height / 2 - 25;
    }
  }

  render(): void {
    this.context.fillStyle = 'green';
    this.context.fillRect(
      this.context.canvas.width / 2 - 25,
      this.birdY - 25,
      50,
      50,
    );
  }
}

export { FlappyBird };
