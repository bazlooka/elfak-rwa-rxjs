import { Player } from 'components';
import { IRectangle } from './IRectangle';

export interface IElectronProps {
  player: Player;
  bounds: IRectangle;
}
