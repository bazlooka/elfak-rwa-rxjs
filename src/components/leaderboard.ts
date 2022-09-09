import { MEDIUM_TEXT_FONT } from 'config';
import { GameState } from 'enums';
import { IKeysDown } from 'interfaces';
import { IPlayerProfile } from 'interfaces/IPlayerProfile';
import { drawCenteredText, drawText, fetchLeaderboard } from 'services';
import { Component } from './component';

class Leaderboard extends Component {
  private shown: boolean;

  private leaderboard: IPlayerProfile[];

  onCreate(): void {
    this.shown = false;
  }
  onResize(newWidth: number, newHeight: number): void {}
  update(delta: number, keysDown: IKeysDown): void {
    if (this.gameState.currentState !== GameState.ENTER_NICKNAME) {
      if (keysDown['KeyL']) {
        this.shown = !this.shown;
        if (this.shown) {
          fetchLeaderboard().then((leaderboard) => {
            this.leaderboard = leaderboard;
          });
        }
      }
    }
  }
  render(): void {
    if (this.shown && this.leaderboard) {
      drawText(
        this.context,
        'Leaderboard:',
        MEDIUM_TEXT_FONT,
        this.context.canvas.width * 0.7,
        100,
      );

      this.leaderboard.forEach((player, index) => {
        drawText(
          this.context,
          `${index + 1}. ${player.nickname.padEnd(8)}- ${player.highscore}`,
          MEDIUM_TEXT_FONT,
          this.context.canvas.width * 0.7,
          50 * index + 150,
        );
      });
    }
  }
}

export { Leaderboard };
