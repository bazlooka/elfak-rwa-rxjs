import { Obsticle, Player } from 'components';

import { areRectanglesColliding } from './rectCollisionDetection';

const hasPlayerCollided = (player: Player, obsticles: Obsticle[]): boolean => {
  return obsticles.some((obsticle) => {
    return (
      areRectanglesColliding(player.bounds, obsticle.topObsticleBounds) ||
      areRectanglesColliding(player.bounds, obsticle.bottomObsticleBounds)
    );
  });
};

export { hasPlayerCollided };
