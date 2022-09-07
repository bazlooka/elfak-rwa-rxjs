import { IGameState, IKeysDown } from 'interfaces';

abstract class Component {
  protected gameState: IGameState;

  constructor(
    context: CanvasRenderingContext2D,
    gameState: IGameState,
    ...args: any[]
  ) {
    this.gameState = gameState;
    this.onCreate(context, args);
    this.onResize(context.canvas.width, context.canvas.height);
  }

  abstract onCreate(context: CanvasRenderingContext2D, ...args: any[]): void;
  abstract onResize(newWidth: number, newHeight: number): void;
  abstract update(delta: number, keysDown: IKeysDown): void;
  abstract render(ctx: CanvasRenderingContext2D): void;
}

export { Component };
