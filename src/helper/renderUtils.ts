import { IRectangle } from 'interfaces/IRectangle';

const fillRect = (context: CanvasRenderingContext2D, rect: IRectangle) => {
  context.fillRect(rect.x, rect.y, rect.width, rect.height);
};

export { fillRect };
