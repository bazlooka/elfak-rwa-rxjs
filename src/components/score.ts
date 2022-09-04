import { LARGE_TEXT_FONT } from 'config';
import { Component } from './component';

class ScoreComponent extends Component {
  private _currentScore: number;

  constructor(context: CanvasRenderingContext2D) {
    super(context);
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

  update(delta: number): void {}

  render(): void {
    const scoreText = 'Score: ' + this._currentScore;

    this.context.font = LARGE_TEXT_FONT;
    this.context.fillStyle = 'black';
    this.context.fillText(
      scoreText,
      (this.context.canvas.width - this.context.measureText(scoreText).width) /
        2,
      50,
    );
  }
}

export default ScoreComponent;
