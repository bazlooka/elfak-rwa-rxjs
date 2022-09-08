import { GameState } from 'enums';

export interface IGameState {
  currentState: GameState;
  score: number;
  highscore: number;
  nickname: string;
  electrons: number;
  playerId: number;
}
