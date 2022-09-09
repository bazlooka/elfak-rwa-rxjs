import { Obsticle, Player } from 'components';
import { ElectricField } from 'components/electricField';
import { OFFSCREEN_THRESHOLD } from 'config';

import { areRectanglesColliding } from './rectCollisionDetection';

const hasPlayerCollided = (player: Player, obsticles: Obsticle[]): boolean => {
  return obsticles.some((obsticle) => {
    return (
      areRectanglesColliding(player.bounds, obsticle.topObsticleBounds) ||
      areRectanglesColliding(player.bounds, obsticle.bottomObsticleBounds)
    );
  });
};

const isPlayerOffscreen = (player: Player, canvasHeight: number): boolean => {
  return (
    player.bounds.y < -OFFSCREEN_THRESHOLD ||
    player.bounds.y > canvasHeight + OFFSCREEN_THRESHOLD
  );
};

const isPlayerInElecticField = (
  player: Player,
  electricFields: ElectricField[],
): boolean => {
  return electricFields.some((electricField) => {
    return areRectanglesColliding(player.bounds, electricField.bounds);
  });
};

export { hasPlayerCollided, isPlayerOffscreen, isPlayerInElecticField };
