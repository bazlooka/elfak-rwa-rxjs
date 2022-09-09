import { MEDIUM_TEXT_FONT } from 'config';
import { GameState } from 'enums';
import { IKeysDown, IPlayerProfile } from 'interfaces';
import { drawText, fetchLeaderboard } from 'services';
import { Component } from './component';

class Leaderboard extends Component {
  private _shown: boolean;
  private _leaderboard: IPlayerProfile[];

  onCreate(): void {
    this._shown = false;
  }

  onResize(newWidth: number, newHeight: number): void {}

  update(delta: number, keysDown: IKeysDown): void {
    if (this.gameState.currentState !== GameState.ENTER_NICKNAME) {
      if (keysDown['KeyL']) {
        this._shown = !this._shown;
        if (this._shown) {
          fetchLeaderboard().then((leaderboard) => {
            this._leaderboard = leaderboard;
          });
        }
      }
    }
  }

  render(): void {
    if (this._shown && this._leaderboard) {
      drawText(
        this.context,
        'Leaderboard:',
        MEDIUM_TEXT_FONT,
        this.context.canvas.width * 0.7,
        100,
      );

      this._leaderboard.forEach((player, index) => {
        drawText(
          this.context,
          `${index + 1}. ${player.nickname.padEnd(8)}- ${player.highscore
            .toString()
            .padStart(2)}`,
          MEDIUM_TEXT_FONT,
          this.context.canvas.width * 0.7,
          50 * index + 150,
        );
      });
    }
  }
}

export { Leaderboard };
