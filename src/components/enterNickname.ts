import { MEDIUM_TEXT_FONT } from 'config';
import { GameState } from 'enums';
import { IKeysDown, IPlayerProfile } from 'interfaces';
import { drawCenteredText, fetchPlayerProfile } from 'services';
import { Component } from './component';

class EnterNickname extends Component {
  private _nickname: string;

  onCreate(): void {
    this._nickname = '';
  }

  onResize(newWidth: number, newHeight: number): void {}

  update(delta: number, keysDown: IKeysDown): void {
    if (this.gameState.currentState === GameState.ENTER_NICKNAME) {
      keysDown.keys.forEach((key) => {
        if (key.length === 1) {
          this.addCharToNickname(key);
        } else if (key === 'Backspace') {
          this.removeCharFromNickname();
        } else if (key === 'Enter') {
          this.submitNickname();
        }
      });
    }
  }

  addCharToNickname(char: string) {
    this._nickname += char;
  }

  removeCharFromNickname() {
    if (this._nickname.length > 0) {
      this._nickname = this._nickname.substring(0, this._nickname.length - 1);
    }
  }

  submitNickname() {
    if (this._nickname.length > 0) {
      this.gameState.player.nickname = this._nickname;
      this.gameState.currentState = GameState.READY;
      fetchPlayerProfile(this.gameState.player.nickname).then(
        (player: IPlayerProfile) => {
          this.gameState.player = player;
        },
      );
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
        this._nickname,
        MEDIUM_TEXT_FONT,
        this.context.canvas.width / 2,
        this.context.canvas.height / 2,
      );
    }
  }
}

export { EnterNickname };
