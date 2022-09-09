import { GameState } from 'enums';
import { IPlayerProfile } from './IPlayerProfile';

export interface IGameState {
  currentState: GameState;
  score: number;
  player: IPlayerProfile;
  gravityCoefficient: number;
}
