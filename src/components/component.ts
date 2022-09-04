import { IComponent } from 'interfaces';

abstract class Component implements IComponent {
  protected context: CanvasRenderingContext2D;

  constructor(context: CanvasRenderingContext2D) {
    this.context = context;
  }
  update(delta: number): void {}
  render(): void {}
}

export { Component };
