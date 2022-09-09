import { MEDIUM_TEXT_FONT } from 'config';
import { GameState } from 'enums';
import { IKeysDown, IPlayerProfile } from 'interfaces';
import { drawCenteredText, fetchPlayerProfile } from 'services';
import { Component } from './component';

class EnterNickname extends Component {
  private nickname: string;

  onCreate(): void {
    this.nickname = '';
  }

  onResize(newWidth: number, newHeight: number): void {}

  update(delta: number, keysDown: IKeysDown): void {
    if (this.gameState.currentState === GameState.ENTER_NICKNAME) {
      keysDown.keys.forEach((key) => {
        if (key.length === 1) {
          this.nickname += key;
        } else if (key === 'Backspace' && this.nickname.length > 0) {
          this.nickname = this.nickname.substring(0, this.nickname.length - 1);
        } else if (key === 'Enter' && this.nickname.length > 0) {
          this.gameState.player.nickname = this.nickname;
          this.gameState.currentState = GameState.READY;
          fetchPlayerProfile(this.gameState.player.nickname).then(
            (player: IPlayerProfile) => {
              this.gameState.player = player;
            },
          );
        }
      });
    }
  }

  render(): void {
    if (this.gameState.currentState === GameState.ENTER_NICKNAME) {
      drawCenteredText(
        this.context,
        'Enter nickname:',
        MEDIUM_TEXT_FONT,
        this.context.canvas.width / 2,
        this.context.canvas.height / 2 - 60,
      );
      drawCenteredText(
        this.context,
        this.nickname,
        MEDIUM_TEXT_FONT,
        this.context.canvas.width / 2,
        this.context.canvas.height / 2,
      );
    }
  }
}

export { EnterNickname };
