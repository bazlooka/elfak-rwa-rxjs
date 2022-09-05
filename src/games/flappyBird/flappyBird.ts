import {
  GRAVITY,
  JUMP_ACCELERATION,
  OFFSCREEN_THRESHOLD,
  PLAYER_SIZE,
} from 'config';
import { areRectanglesColliding } from 'helper';
import { IGame, IKeysDown } from 'interfaces';
import { IRectangle } from 'interfaces/IRectangle';
import { Observable, Subscription } from 'rxjs';
import { Obsticle, startSpawningObsticles } from './obsticles';

class FlappyBird implements IGame {
  private context: CanvasRenderingContext2D;

  private bounds: IRectangle;

  private accelerationY: number;

  private dead: boolean;

  private obsticles$: Observable<Obsticle>;
  private obsticles: Obsticle[];
  private obsticleSubscription: Subscription;

  constructor(context: CanvasRenderingContext2D) {
    this.context = context;
    this.bounds = {
      x: (context.canvas.width - PLAYER_SIZE) / 2,
      y: (context.canvas.height - PLAYER_SIZE) / 2,
      width: PLAYER_SIZE,
      height: PLAYER_SIZE,
    };
    this.dead = true;

    this.obsticles = [];
    this.obsticles$ = startSpawningObsticles(context);
  }

  start() {
    this.accelerationY = 0;
    this.dead = false;

    this.obsticleSubscription = this.obsticles$.subscribe((obsticle) => {
      this.obsticles.push(obsticle);
    });
    this.jump();
  }

  jump(): void {
    this.accelerationY = -JUMP_ACCELERATION;
  }

  die(): void {
    this.dead = true;
    this.bounds.y = (this.context.canvas.height - PLAYER_SIZE) / 2;
    this.obsticles = [];
    this.obsticleSubscription.unsubscribe();
  }

  update(delta: number, keysDown: IKeysDown): void {
    if (!this.dead) {
      this.accelerationY += GRAVITY * delta;
      this.bounds.y += this.accelerationY * delta;

      if (keysDown['Space']) {
        this.jump();
      }

      this.obsticles.forEach((obsticle: Obsticle) => {
        obsticle.update(delta);
      });

      if (
        this.bounds.y < -OFFSCREEN_THRESHOLD ||
        this.bounds.y > this.context.canvas.height + OFFSCREEN_THRESHOLD
      ) {
        this.die();
      }

      this.obsticles = this.obsticles.filter((obsticle: Obsticle) => {
        return obsticle.topObsticleBounds.x > -50;
      });

      const index = this.obsticles.findIndex((obsticle) => {
        return (
          areRectanglesColliding(this.bounds, obsticle.topObsticleBounds) ||
          areRectanglesColliding(this.bounds, obsticle.topObsticleBounds)
        );
      });

      if (index !== -1) {
        this.die();
      }
    } else {
      if (keysDown['Space']) {
        this.start();
      }
    }
  }

  render(): void {
    this.context.fillStyle = 'green';
    this.context.fillRect(
      this.bounds.x,
      this.bounds.y,
      this.bounds.width,
      this.bounds.height,
    );

    this.obsticles.forEach((obsticle: Obsticle) => {
      obsticle.render();
    });
  }
}

export { FlappyBird };
