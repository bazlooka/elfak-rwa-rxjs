export interface IView {
  update(
    context: CanvasRenderingContext2D,
    tFrame: number,
    delta: number,
  ): void;
  render(context: CanvasRenderingContext2D): void;
}
