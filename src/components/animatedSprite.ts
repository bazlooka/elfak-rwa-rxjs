import { IAnimatedSpriteProps, IKeysDown, IRectangle } from 'interfaces';
import { drawImageRegion } from 'services';
import { Component } from './component';

class AnimatedSprite extends Component<IAnimatedSpriteProps> {
  private _currentTime: number;
  private _bounds: IRectangle;

  set bounds(bounds: IRectangle) {
    this._bounds = bounds;
  }

  onCreate(): void {
    this._currentTime = 0;
    this._bounds = { x: 0, y: 0, width: 0, height: 0 };
  }

  onResize(newWidth: number, newHeight: number): void {}

  update(delta: number, keysDown: IKeysDown): void {
    this._currentTime += delta;
  }

  render(): void {
    if (!this.props.image) {
      return;
    }

    const currFrame =
      Math.floor(this._currentTime / this.props.frameDuration) %
      this.props.frameCount;

    const sourceRect: IRectangle = {
      x: currFrame * this.props.frameSize,
      y: 0,
      width: this.props.frameSize,
      height: this.props.frameSize,
    };

    drawImageRegion(this.context, this.props.image, this._bounds, sourceRect);
  }
}

export { AnimatedSprite };
