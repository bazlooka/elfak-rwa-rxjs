import { LARGE_TEXT_FONT, MEDIUM_TEXT_FONT, SMALL_TEXT_FONT } from 'config';
import { GameState } from 'enums';
import { IKeysDown } from 'interfaces';
import { drawCenteredText, drawText } from 'services';
import { Component } from './component';

class ScoreOverlay extends Component {
  onCreate(): void {}

  onResize(newWidth: number, newHeight: number): void {}

  update(delta: number, keysDown: IKeysDown): void {}

  render(): void {
    switch (this.gameState.currentState) {
      case GameState.READY:
        this.renderDarkenScreen();
        this.renderJumpToStart();
        this.renderHighscore();
        this.renderControls();
        this.renderElectrons();
        break;
      case GameState.PLAYING:
        this.renderCurrentScore();
        this.renderElectrons();
        break;
      case GameState.GAME_OVER:
        this.renderDarkenScreen();
        this.renderGameOver();
        this.renderHighscore();
        this.renderControls();
        this.renderElectrons();
        break;
      case GameState.ENTER_NICKNAME:
        this.renderDarkenScreen();
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
  }

  renderControls() {
    drawText(
      this.context,
      '[L]-Leaderboard',
      SMALL_TEXT_FONT,
      10,
      this.context.canvas.height - 30,
    );
    drawText(
      this.context,
      '[Spacebar]-Jump',
      SMALL_TEXT_FONT,
      10,
      this.context.canvas.height - 10,
    );
  }

  renderElectrons() {
    const electronsText = `Electrons: ${this.gameState.player.electrons}`;
    drawCenteredText(
      this.context,
      electronsText,
      SMALL_TEXT_FONT,
      this.context.canvas.width / 2,
      this.context.canvas.height - 10,
    );
  }

  renderGameOver() {
    const scoreText = `Score: ${this.gameState.score}`;
    drawCenteredText(
      this.context,
      'GAME OVER',
      LARGE_TEXT_FONT,
      this.context.canvas.width / 2,
      100,
    );
    drawCenteredText(
      this.context,
      scoreText,
      MEDIUM_TEXT_FONT,
      this.context.canvas.width / 2,
      150,
    );
  }

  renderDarkenScreen() {
    this.context.globalAlpha = 0.3;
    this.context.fillStyle = 'black';
    this.context.fillRect(
      0,
      0,
      this.context.canvas.width,
      this.context.canvas.height,
    );
    this.context.globalAlpha = 1;
  }
}

export { ScoreOverlay };
