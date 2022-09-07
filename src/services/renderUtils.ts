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

const drawImageRegion = (
  context: CanvasRenderingContext2D,
  img: HTMLImageElement,
  targetRect: IRectangle,
  sourceRect: IRectangle,
) => {
  context.drawImage(
    img,
    sourceRect.x,
    sourceRect.y,
    sourceRect.width,
    sourceRect.height,
    targetRect.x,
    targetRect.y,
    targetRect.width,
    targetRect.height,
  );
};

export { fillRect, drawImage, drawImageRegion };
