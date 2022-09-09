import { IGameState, IKeysDown } from 'interfaces';

abstract class Component<Props = object> {
  protected readonly context: CanvasRenderingContext2D;
  protected readonly gameState: IGameState;
  protected readonly props?: Props;

  constructor(
    context: CanvasRenderingContext2D,
    gameState: IGameState,
    props?: Props,
  ) {
    this.context = context;
    this.gameState = gameState;
    this.props = props;
    this.onCreate();
    this.onResize(context.canvas.width, context.canvas.height);
  }

  abstract onCreate(): void;
  abstract onResize(newWidth: number, newHeight: number): void;
  abstract update(delta: number, keysDown: IKeysDown): void;
  abstract render(): void;
}

export { Component };
