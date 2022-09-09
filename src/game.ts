import { fromEvent, debounceTime, Observable, Subscription } from 'rxjs';

import { GAME_SPEED, INITIAL_GAME_STATE } from 'config';
import { IGameState, IKeysDown } from 'interfaces';
import { Obsticle, Player, Background, ScoreOverlay } from 'components';
import {
  hasPlayerCollided,
  loadBackroundImages,
  startSpawningObsticles,
  initializeMainLoop,
  isPlayerOffscreen,
  filterPassedObsticles,
  putPlayerProfile,
} from 'services';
import { GameState } from 'enums';
import { EnterNickname } from 'components/enterNickname';

class Game {
  private container: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;

  private readonly gameState: IGameState;

  private readonly player: Player;
  private readonly score: ScoreOverlay;
  private readonly enterNickname: EnterNickname;

  private backgrounds: Background[];

  private frames$: Observable<[number, IKeysDown]>;

  private obsticles$: Observable<Obsticle>;
  private obsticles: Obsticle[];
  private obsticleSubscription: Subscription;

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
    this.score = new ScoreOverlay(context, this.gameState);
    this.enterNickname = new EnterNickname(context, this.gameState);
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
      this.render();
    });

    loadBackroundImages().subscribe((backgroundProps) => {
      this.backgrounds = backgroundProps.map((bgProp) => {
        return new Background(this.context, this.gameState, bgProp);
      });
    });
  }

  startRound() {
    this.obsticleSubscription = this.obsticles$.subscribe((obsticle) => {
      this.obsticles.push(obsticle);
    });
    this.player.startRound();
    this.gameState.currentState = GameState.PLAYING;
    this.gameState.score = 0;
  }

  die(): void {
    this.obsticles = [];
    this.obsticleSubscription.unsubscribe();
    this.player.die();
    this.gameState.currentState = GameState.GAME_OVER;
    if (this.gameState.score > this.gameState.player.highscore) {
      this.gameState.player.highscore = this.gameState.score;
      putPlayerProfile(this.gameState.player).then((player) => {
        this.gameState.player = player;
      });
    }
  }

  resize(newWidth: number, newHeight: number) {
    this.container.width = newWidth;
    this.container.height = newHeight;
    this.context.imageSmoothingEnabled = false;

    this.backgrounds.forEach((background) => {
      background.onResize(newWidth, newHeight);
    });
    this.obsticles.forEach((obsticle) => {
      obsticle.onResize(newWidth, newHeight);
    });
    this.player.onResize(newWidth, newHeight);
    this.score.onResize(newWidth, newHeight);
    this.enterNickname.onResize(newWidth, newHeight);
  }

  update(deltaTime: number, keysDown: IKeysDown) {
    this.backgrounds.forEach((background) => {
      background.update(deltaTime);
    });
    this.obsticles.forEach((obsticle) => {
      obsticle.update(deltaTime);
    });
    this.player.update(deltaTime, keysDown);
    this.score.update(deltaTime, keysDown);
    this.enterNickname.update(deltaTime, keysDown);

    switch (this.gameState.currentState) {
      case GameState.FETCHING_PLAYER:
        this.obsticles$ = startSpawningObsticles(this.context, this.gameState);
        this.gameState.currentState = GameState.READY;
        break;
      case GameState.PLAYING:
        this.obsticles = filterPassedObsticles(this.obsticles);
        if (
          hasPlayerCollided(this.player, this.obsticles) ||
          isPlayerOffscreen(this.player, this.context.canvas.height)
        ) {
          this.die();
        }
        break;
      case GameState.READY:
      case GameState.GAME_OVER:
        if (keysDown['Space']) {
          this.startRound();
        }
        break;
    }
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
    this.score.render();
    this.enterNickname.render();
  }
}

export default Game;
