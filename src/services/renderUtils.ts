import { IRectangle } from 'interfaces';

const fillRect = (ctx: CanvasRenderingContext2D, rect: IRectangle) => {
  ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
};

const drawImage = (
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  rect: IRectangle,
) => {
  ctx.drawImage(img, rect.x, rect.y, rect.width, rect.height);
};

const drawImageRegion = (
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  targetRect: IRectangle,
  sourceRect: IRectangle,
) => {
  ctx.drawImage(
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

const applyFont = (ctx: CanvasRenderingContext2D, font: string) => {
  ctx.font = font;
  ctx.fillStyle = 'white';
  ctx.shadowColor = 'gray';
  ctx.shadowOffsetX = 3;
  ctx.shadowOffsetY = 3;
};

const clearFont = (ctx: CanvasRenderingContext2D) => {
  ctx.shadowColor = undefined;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
};

const drawText = (
  ctx: CanvasRenderingContext2D,
  text: string,
  font: string,
  x: number,
  y: number,
) => {
  applyFont(ctx, font);
  ctx.fillText(text, x, y);
  clearFont(ctx);
};

const drawCenteredText = (
  ctx: CanvasRenderingContext2D,
  text: string,
  font: string,
  centerX: number,
  y: number,
) => {
  applyFont(ctx, font);
  ctx.fillText(text, centerX - ctx.measureText(text).width / 2, y);
  clearFont(ctx);
};

export { fillRect, drawImage, drawImageRegion, drawText, drawCenteredText };
