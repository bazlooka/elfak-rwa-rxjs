import { fromEvent, debounceTime, Observable, Subscription } from 'rxjs';

import { GAME_SPEED } from 'config';
import { IKeysDown } from 'interfaces';
import { Obsticle, Player, Background } from 'components';
import {
  hasPlayerCollided,
  loadBackroundImages,
  startSpawningObsticles,
  initializeMainLoop,
} from 'services';

class Game {
  private container: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;

  private player: Player;

  private frames$: Observable<[number, IKeysDown]>;

  private obsticles$: Observable<Obsticle>;
  private obsticles: Obsticle[];
  private obsticleSubscription: Subscription;

  private backgrounds: Background[];

  constructor(container: HTMLCanvasElement) {
    if (!container.getContext) {
      throw new Error('Canvas is not supported in this browser');
    }
    this.container = container;
    this.context = container.getContext('2d');
    this.context.imageSmoothingEnabled = false;

    this.player = new Player(this.context);

    this.obsticles = [];
    this.obsticles$ = startSpawningObsticles(this.context);

    this.backgrounds = [];
  }

  init() {
    this.frames$ = initializeMainLoop();
    this.frames$.subscribe(([deltaTime, keysDown]) => {
      this.update(deltaTime, keysDown);
      this.render();
    });

    fromEvent(window, 'resize')
      .pipe(debounceTime(100))
      .subscribe((event) => {
        this.container.width = window.innerWidth;
        this.container.height = window.innerHeight;
        this.context.imageSmoothingEnabled = false;
      });

    loadBackroundImages().subscribe((backgroundProps) => {
      this.backgrounds = backgroundProps.map((bgProp) => {
        return new Background(this.context, bgProp);
      });
    });
  }

  start() {
    this.obsticleSubscription = this.obsticles$.subscribe((obsticle) => {
      this.obsticles.push(obsticle);
    });
    this.player.start();
  }

  die(): void {
    this.obsticles = [];
    this.obsticleSubscription.unsubscribe();
    this.player.die();
  }

  update(deltaTime: number, keysDown: any) {
    const scaledDeltaTime = deltaTime * GAME_SPEED;

    if (!this.player.dead) {
      this.obsticles.forEach((obsticle) => {
        obsticle.update(scaledDeltaTime);
      });

      this.obsticles = this.obsticles.filter((obsticle) => {
        return obsticle.topObsticleBounds.x > -50;
      });

      if (hasPlayerCollided(this.player, this.obsticles)) {
        this.die();
      }
    } else {
      if (keysDown['Space']) {
        this.start();
      }
    }

    this.backgrounds.forEach((background) => {
      background.update(scaledDeltaTime);
    });

    this.player.update(scaledDeltaTime, keysDown);
  }

  render() {
    const screenWidth = this.context.canvas.width;
    const screenHeight = this.context.canvas.height;
    this.context.clearRect(0, 0, screenWidth, screenHeight);

    this.backgrounds.forEach((background) => {
      background.render();
    });
    this.obsticles.forEach((obsticle) => {
      obsticle.render();
    });
    this.player.render();
  }
}

export default Game;
