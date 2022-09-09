import { IGameState, IKeysDown } from 'interfaces';

abstract class Component {
  protected readonly context: CanvasRenderingContext2D;
  protected readonly gameState: IGameState;

  constructor(
    context: CanvasRenderingContext2D,
    gameState: IGameState,
    ...args: any[]
  ) {
    this.context = context;
    this.gameState = gameState;
    this.onCreate(args);
    this.onResize(context.canvas.width, context.canvas.height);
  }

  abstract onCreate(...args: any[]): void;
  abstract onResize(newWidth: number, newHeight: number): void;
  abstract update(delta: number, keysDown: IKeysDown): void;
  abstract render(): void;
}

export { Component };
