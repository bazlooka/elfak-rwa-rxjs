import { LARGE_TEXT_FONT } from 'config';
import { IGameState } from 'interfaces';
import { Component } from './component';

class Score extends Component {
  private _currentScore: number;

  constructor(context: CanvasRenderingContext2D, gameState: IGameState) {
    super(context, gameState);
  }

  set currentScore(currentScore: number) {
    if (currentScore < 0) {
      throw new Error('Score cannot be negative');
    }
    this._currentScore = currentScore;
  }

  get currentScore() {
    return this._currentScore;
  }

  onCreate(context: CanvasRenderingContext2D): void {
    this._currentScore = 0;
  }

  onResize(newWidth: number, newHeight: number): void {}

  update(delta: number): void {}

  render(ctx: CanvasRenderingContext2D): void {
    const scoreText = 'Score: ' + this._currentScore;

    ctx.font = LARGE_TEXT_FONT;
    ctx.fillStyle = 'black';
    ctx.fillText(
      scoreText,
      (ctx.canvas.width - ctx.measureText(scoreText).width) / 2,
      50,
    );
  }
}

export default Score;
