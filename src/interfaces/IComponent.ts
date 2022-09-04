import { IKeysDown } from './IKeysDown';

export interface IComponent {
  update(delta: number, keysDown: IKeysDown): void;
  render(): void;
}
