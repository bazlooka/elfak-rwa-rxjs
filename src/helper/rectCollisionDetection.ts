import { IRectangle } from 'interfaces/IRectangle';

const areRectanglesColliding = (
  rect1: IRectangle,
  rect2: IRectangle,
): boolean => {
  const rect1LeftEdge = rect1.x;
  const rect1RightEdge = rect1.x + rect1.width;
  const rect1TopEdge = rect1.y;
  const rect1BottomEdge = rect1.y + rect1.height;

  const rect2LeftEdge = rect2.x;
  const rect2RightEdge = rect2.x + rect2.width;
  const rect2TopEdge = rect2.y;
  const rect2BottomEdge = rect2.y + rect2.height;

  return (
    rect1RightEdge > rect2LeftEdge &&
    rect1LeftEdge < rect2RightEdge &&
    rect1BottomEdge > rect2TopEdge &&
    rect1TopEdge < rect2BottomEdge
  );
};

export { areRectanglesColliding };
