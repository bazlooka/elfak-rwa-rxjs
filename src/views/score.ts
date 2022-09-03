import { LARGE_TEXT_FONT } from '../config';
import { IView } from '../interfaces/IView';

class ScoreView implements IView {
  private _currentScore: number;

  constructor() {
    this._currentScore = 0;
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

  update(
    context: CanvasRenderingContext2D,
    tFrame: number,
    delta: number,
  ): void {}

  render(context: CanvasRenderingContext2D): void {
    const scoreText = 'Score: ' + this._currentScore;

    context.font = LARGE_TEXT_FONT;
    context.fillStyle = 'black';
    context.fillText(
      scoreText,
      (context.canvas.width - context.measureText(scoreText).width) / 2,
      50,
    );
  }
}

export default ScoreView;
