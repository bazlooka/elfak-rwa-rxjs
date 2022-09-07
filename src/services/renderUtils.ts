import { IRectangle } from 'interfaces';

const fillRect = (context: CanvasRenderingContext2D, rect: IRectangle) => {
  context.fillRect(rect.x, rect.y, rect.width, rect.height);
};

const drawImage = (
  context: CanvasRenderingContext2D,
  img: HTMLImageElement,
  rect: IRectangle,
) => {
  context.drawImage(img, rect.x, rect.y, rect.width, rect.height);
};

export { fillRect, drawImage };
