import { fromEvent, debounceTime, Subscription, Observable } from 'rxjs';
import { GAME_SPEED, LARGE_TEXT_FONT } from 'config';
import { FlappyBird } from 'games/flappyBird';
import { IGame, IKeysDown } from 'interfaces';
import { initializeMainLoop } from 'services';

class Game {
  private container: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;

  private selectedGame: IGame;

  private frames$: Observable<[number, IKeysDown]>;

  keysDown: any;

  constructor(container: HTMLCanvasElement) {
    if (!container.getContext) {
      throw new Error('Canvas is not supported in this browser');
    }
    this.container = container;
    this.context = container.getContext('2d');
    this.context.imageSmoothingEnabled = false;

    this.selectedGame = new FlappyBird(this.context);
  }

  start() {
    this.subscribeToResizeEvent();
    this.frames$ = initializeMainLoop();
    this.frames$.subscribe(([deltaTime, keysDown]) => {
      this.update(deltaTime, keysDown);
      this.render();
    });
  }

  subscribeToResizeEvent() {
    fromEvent(window, 'resize')
      .pipe(debounceTime(100))
      .subscribe((event) => {
        this.container.width = window.innerWidth;
        this.container.height = window.innerHeight;
      });
  }

  update(deltaTime: number, keysDown: any) {
    const scaledDeltaTime = deltaTime * GAME_SPEED;

    this.keysDown = keysDown;

    this.selectedGame.update(scaledDeltaTime, keysDown);
  }

  render() {
    const screenWidth = this.context.canvas.width;
    const screenHeight = this.context.canvas.height;

    this.context.clearRect(0, 0, screenWidth, screenHeight);

    this.selectedGame.render();

    this.context.font = LARGE_TEXT_FONT;
    this.context.fillText(JSON.stringify(this.keysDown), 50, 50);
  }
}

export default Game;
