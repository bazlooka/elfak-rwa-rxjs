import { IGame } from 'interfaces';

class Intersect implements IGame {
  private context: CanvasRenderingContext2D;

  constructor(context: CanvasRenderingContext2D) {
    this.context = context;
  }

  update(delta: number): void {
    throw new Error('Method not implemented.');
  }

  render(): void {
    throw new Error('Method not implemented.');
  }
}
