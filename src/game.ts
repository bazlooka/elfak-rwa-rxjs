import { fromEvent, debounceTime } from 'rxjs';
import { GAME_SPEED } from './config';
import FlappyBird from './games/FlappyBird';
import { IGame } from './interfaces/IGame';

class Game {
  private container: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;

  private lastFrame: DOMHighResTimeStamp = 0;

  private selectedGame: IGame;

  constructor(container: HTMLCanvasElement) {
    if (!container.getContext) {
      throw new Error('Canvas is not supported in this browser');
    }
    this.container = container;
    this.context = container.getContext('2d');
    this.context.imageSmoothingEnabled = false;
    this.subscribeToResizeEvent();

    this.selectedGame = new FlappyBird(this.context);
  }

  subscribeToResizeEvent() {
    fromEvent(window, 'resize')
      .pipe(debounceTime(100))
      .subscribe((event) => {
        this.container.width = window.innerWidth;
        this.container.height = window.innerHeight;
      });
  }

  update(tFrame: DOMHighResTimeStamp) {
    const delta = (tFrame - this.lastFrame) * GAME_SPEED;
    this.lastFrame = tFrame;

    this.selectedGame.update(this.context, tFrame, delta);
  }

  render() {
    const screenWidth = this.context.canvas.width;
    const screenHeight = this.context.canvas.height;

    this.context.clearRect(0, 0, screenWidth, screenHeight);

    this.selectedGame.render(this.context);
  }
}

export default Game;
