import { fromEvent, debounceTime, Observable, Subscription } from 'rxjs';

import { GAME_SPEED, INITIAL_GAME_STATE } from 'config';
import { IGameState, IKeysDown } from 'interfaces';
import { Obsticle, Player, Background } from 'components';
import {
  hasPlayerCollided,
  loadBackroundImages,
  startSpawningObsticles,
  initializeMainLoop,
  isPlayerOffscreen,
  filterPassedObsticles,
} from 'services';
import { GameState } from 'enums';

class Game {
  private container: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;

  private gameState: IGameState;

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

    const context = container.getContext('2d');
    context.imageSmoothingEnabled = false;

    this.container = container;
    this.context = context;
    this.gameState = INITIAL_GAME_STATE;
    this.player = new Player(context, this.gameState);
    this.obsticles = [];
    this.backgrounds = [];
  }

  init() {
    fromEvent(window, 'resize')
      .pipe(debounceTime(100))
      .subscribe(() => {
        this.resize(window.innerWidth, window.innerHeight);
      });

    this.frames$ = initializeMainLoop();
    this.frames$.subscribe(([deltaTime, keysDown]) => {
      const scaledDeltaTime = deltaTime * GAME_SPEED;
      this.update(scaledDeltaTime, keysDown);
      this.render(this.context);
    });

    this.obsticles$ = startSpawningObsticles(this.context, this.gameState);

    loadBackroundImages().subscribe((backgroundProps) => {
      this.backgrounds = backgroundProps.map((bgProp) => {
        return new Background(this.context, this.gameState, bgProp);
      });
    });
  }

  start() {
    this.obsticleSubscription = this.obsticles$.subscribe((obsticle) => {
      this.obsticles.push(obsticle);
    });
    this.player.start();
    this.gameState.currentState = GameState.PLAYING;
  }

  die(): void {
    this.obsticles = [];
    this.obsticleSubscription.unsubscribe();
    this.player.die();
    this.gameState.currentState = GameState.GAME_OVER;
  }

  update(deltaTime: number, keysDown: any) {
    this.backgrounds.forEach((background) => {
      background.update(deltaTime);
    });

    this.player.update(deltaTime, keysDown);

    if (this.gameState.currentState === GameState.PLAYING) {
      this.obsticles.forEach((obsticle) => {
        obsticle.update(deltaTime);
      });

      this.obsticles = filterPassedObsticles(this.obsticles);

      if (
        hasPlayerCollided(this.player, this.obsticles) ||
        isPlayerOffscreen(this.player, this.context.canvas.height)
      ) {
        this.die();
      }
    } else {
      if (keysDown['Space']) {
        this.start();
      }
    }
  }

  render(ctx: CanvasRenderingContext2D) {
    const screenWidth = ctx.canvas.width;
    const screenHeight = ctx.canvas.height;
    ctx.clearRect(0, 0, screenWidth, screenHeight);

    this.backgrounds.forEach((background) => {
      background.render(ctx);
    });
    this.obsticles.forEach((obsticle) => {
      obsticle.render(ctx);
    });
    this.player.render(ctx);
  }

  resize(newWidth: number, newHeight: number) {
    this.container.width = newWidth;
    this.container.height = newHeight;
    this.context.imageSmoothingEnabled = false;

    this.player.onResize(newWidth, newHeight);

    this.backgrounds.forEach((background) => {
      background.onResize(newWidth, newHeight);
    });

    this.obsticles.forEach((obsticle) => {
      obsticle.onResize(newWidth, newHeight);
    });
  }
}

export default Game;
