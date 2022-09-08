import { LARGE_TEXT_FONT, MEDIUM_TEXT_FONT, SMALL_TEXT_FONT } from 'config';
import { GameState } from 'enums';
import { IGameState } from 'interfaces';
import { drawCenteredText, drawText } from 'services';
import { Component } from './component';

class Score extends Component {
  constructor(context: CanvasRenderingContext2D, gameState: IGameState) {
    super(context, gameState);
  }

  onCreate(context: CanvasRenderingContext2D): void {}

  onResize(newWidth: number, newHeight: number): void {}

  update(delta: number): void {}

  render(ctx: CanvasRenderingContext2D): void {
    switch (this.gameState.currentState) {
      case GameState.INITIAL:
        this.renderHighScore(ctx);
        break;
      case GameState.PLAYING:
        this.renderCurrentScore(ctx);
        break;
      case GameState.GAME_OVER:
        this.renderGameOver(ctx);
        this.renderHighScore(ctx);
        break;
    }
  }

  renderCurrentScore(ctx: CanvasRenderingContext2D): void {
    const scoreText = this.gameState.score.toString();
    drawCenteredText(
      ctx,
      scoreText,
      LARGE_TEXT_FONT,
      ctx.canvas.width / 2,
      100,
    );
  }

  renderHighScore(ctx: CanvasRenderingContext2D): void {
    const highscoreText = `Highscore: ${this.gameState.highscore}`;

    drawCenteredText(
      ctx,
      'Jump to start',
      MEDIUM_TEXT_FONT,
      ctx.canvas.width / 2,
      ctx.canvas.height * 0.3,
    );
    drawCenteredText(
      ctx,
      highscoreText,
      MEDIUM_TEXT_FONT,
      ctx.canvas.width / 2,
      ctx.canvas.height - 50,
    );

    drawText(
      ctx,
      '[Spacebar]-Jump',
      SMALL_TEXT_FONT,
      20,
      ctx.canvas.height - 20,
    );
  }

  renderGameOver(ctx: CanvasRenderingContext2D) {
    drawCenteredText(
      ctx,
      'GAME OVER',
      LARGE_TEXT_FONT,
      ctx.canvas.width / 2,
      100,
    );
    const scoreText = `Score: ${this.gameState.score}`;
    drawCenteredText(
      ctx,
      scoreText,
      MEDIUM_TEXT_FONT,
      ctx.canvas.width / 2,
      150,
    );
  }
}

export { Score };
