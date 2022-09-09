import { fromEvent, debounceTime, Observable, Subscription } from 'rxjs';

import { GAME_SPEED, INITIAL_GAME_STATE } from 'config';
import { IGameState, IKeysDown } from 'interfaces';
import {
  Obsticle,
  Player,
  Background,
  ScoreOverlay,
  EnterNickname,
  Leaderboard,
  ElectricField,
} from 'components';
import {
  hasPlayerCollided,
  loadBackroundImages,
  startSpawningObsticles,
  initializeMainLoop,
  isPlayerOffscreen,
  filterPassedObsticles,
  putPlayerProfile,
  isPlayerInElecticField,
  filterPassedElectircFields,
  startSpawningElectricFields,
} from 'services';
import { GameState } from 'enums';

class Game {
  private readonly container: HTMLCanvasElement;
  private readonly context: CanvasRenderingContext2D;

  private readonly gameState: IGameState;

  private readonly player: Player;
  private readonly score: ScoreOverlay;
  private readonly enterNickname: EnterNickname;
  private readonly leaderboard: Leaderboard;

  private backgrounds: Background[];

  private obsticles$: Observable<Obsticle>;
  private obsticles: Obsticle[];
  private obsticleSubscription: Subscription;

  private electricField$: Observable<ElectricField>;
  private electricFields: ElectricField[];
  private electricFieldSubscription: Subscription;

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
    this.leaderboard = new Leaderboard(context, this.gameState);
    this.obsticles = [];
    this.electricFields = [];
    this.backgrounds = [];
  }

  init() {
    fromEvent(window, 'resize')
      .pipe(debounceTime(100))
      .subscribe(() => {
        this.resize(window.innerWidth, window.innerHeight);
      });

    initializeMainLoop().subscribe(([deltaTime, keysDown]) => {
      const scaledDeltaTime = deltaTime * GAME_SPEED;
      this.update(scaledDeltaTime, keysDown);
      this.render();
    });

    loadBackroundImages().subscribe((backgroundProps) => {
      this.backgrounds = backgroundProps.map((bgProp) => {
        return new Background(this.context, this.gameState, bgProp);
      });
    });

    this.obsticles$ = startSpawningObsticles(
      this.context,
      this.gameState,
      this.player,
    );

    this.electricField$ = startSpawningElectricFields(
      this.context,
      this.gameState,
      this.player,
    );
  }

  startRound() {
    this.obsticleSubscription = this.obsticles$.subscribe((obsticle) => {
      this.obsticles.push(obsticle);
    });

    this.electricFieldSubscription = this.electricField$.subscribe(
      (electricField) => {
        this.electricFields.push(electricField);
      },
    );

    this.player.startRound();
    this.gameState.currentState = GameState.PLAYING;
    this.gameState.score = 0;
  }

  die(): void {
    this.obsticles = [];
    this.obsticleSubscription.unsubscribe();
    this.electricFields = [];
    this.electricFieldSubscription.unsubscribe();

    this.player.die();
    this.gameState.currentState = GameState.GAME_OVER;
    this.gameState.gravityCoefficient = 1;

    if (this.gameState.score > this.gameState.player.highscore) {
      this.gameState.player.highscore = this.gameState.score;
      putPlayerProfile(this.gameState.player).then((player) => {
        this.gameState.player = player;
      });
    }
  }

  updateLogic(deltaTime: number, keysDown: IKeysDown) {
    switch (this.gameState.currentState) {
      case GameState.PLAYING:
        this.obsticles = filterPassedObsticles(this.obsticles);
        this.electricFields = filterPassedElectircFields(this.electricFields);
        this.detectCollision();
        this.detectElectricFiled();
        break;
      case GameState.READY:
      case GameState.GAME_OVER:
        if (keysDown['Space']) {
          this.startRound();
        }
        break;
    }
  }

  detectCollision() {
    if (
      hasPlayerCollided(this.player, this.obsticles) ||
      isPlayerOffscreen(this.player, this.context.canvas.height)
    ) {
      this.die();
    }
  }

  detectElectricFiled() {
    if (isPlayerInElecticField(this.player, this.electricFields)) {
      this.gameState.gravityCoefficient = -0.75;
    } else {
      this.gameState.gravityCoefficient = 1;
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
    this.leaderboard.onResize(newWidth, newHeight);
  }

  update(deltaTime: number, keysDown: IKeysDown) {
    this.backgrounds.forEach((background) => {
      background.update(deltaTime);
    });
    this.electricFields.forEach((electricField) => {
      electricField.update(deltaTime, keysDown);
    });
    this.obsticles.forEach((obsticle) => {
      obsticle.update(deltaTime, keysDown);
    });
    this.player.update(deltaTime, keysDown);
    this.score.update(deltaTime, keysDown);
    this.enterNickname.update(deltaTime, keysDown);
    this.leaderboard.update(deltaTime, keysDown);

    this.updateLogic(deltaTime, keysDown);
  }

  render() {
    const screenWidth = this.context.canvas.width;
    const screenHeight = this.context.canvas.height;
    this.context.clearRect(0, 0, screenWidth, screenHeight);

    this.backgrounds.forEach((background) => {
      background.render();
    });
    this.electricFields.forEach((electricField) => {
      electricField.render();
    });
    this.obsticles.forEach((obsticle) => {
      obsticle.render();
    });
    this.player.render();
    this.score.render();
    this.enterNickname.render();
    this.leaderboard.render();
  }
}

export default Game;
