import { IRectangle } from 'interfaces';

const areRectanglesColliding = (
  rect1: IRectangle,
  rect2: IRectangle,
): boolean => {
  return (
    rect1.x + rect1.width > rect2.x &&
    rect1.x < rect2.x + rect2.width &&
    rect1.y + rect1.height > rect2.y &&
    rect1.y < rect2.y + rect2.height
  );
};

export { areRectanglesColliding };
