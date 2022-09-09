import { LARGE_TEXT_FONT, MEDIUM_TEXT_FONT, SMALL_TEXT_FONT } from 'config';
import { GameState } from 'enums';
import { IGameState, IKeysDown } from 'interfaces';
import { drawCenteredText, drawText } from 'services';
import { Component } from './component';

class ScoreOverlay extends Component {
  constructor(context: CanvasRenderingContext2D, gameState: IGameState) {
    super(context, gameState);
  }

  onCreate(): void {}

  onResize(newWidth: number, newHeight: number): void {}

  update(delta: number, keysDown: IKeysDown): void {}

  render(): void {
    switch (this.gameState.currentState) {
      case GameState.READY:
        this.renderJumpToStart();
        this.renderHighscore();
        break;
      case GameState.PLAYING:
        this.renderCurrentScore();
        break;
      case GameState.GAME_OVER:
        this.renderGameOver();
        this.renderHighscore();
        break;
    }
  }

  renderCurrentScore(): void {
    const scoreText = this.gameState.score.toString();
    drawCenteredText(
      this.context,
      scoreText,
      LARGE_TEXT_FONT,
      this.context.canvas.width / 2,
      100,
    );
  }

  renderJumpToStart(): void {
    drawCenteredText(
      this.context,
      'Jump to start',
      MEDIUM_TEXT_FONT,
      this.context.canvas.width / 2,
      this.context.canvas.height / 4,
    );
  }

  renderHighscore(): void {
    const highscoreText = `Highscore: ${this.gameState.player.highscore}`;

    drawCenteredText(
      this.context,
      this.gameState.player.nickname,
      MEDIUM_TEXT_FONT,
      this.context.canvas.width / 2,
      this.context.canvas.height - 100,
    );
    drawCenteredText(
      this.context,
      highscoreText,
      MEDIUM_TEXT_FONT,
      this.context.canvas.width / 2,
      this.context.canvas.height - 50,
    );
    drawText(
      this.context,
      '[Spacebar]-Jump',
      SMALL_TEXT_FONT,
      20,
      this.context.canvas.height - 20,
    );
  }

  renderGameOver() {
    drawCenteredText(
      this.context,
      'GAME OVER',
      LARGE_TEXT_FONT,
      this.context.canvas.width / 2,
      100,
    );
    const scoreText = `Score: ${this.gameState.score}`;
    drawCenteredText(
      this.context,
      scoreText,
      MEDIUM_TEXT_FONT,
      this.context.canvas.width / 2,
      150,
    );
  }
}

export { ScoreOverlay };
