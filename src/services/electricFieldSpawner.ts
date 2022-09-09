import { filter, interval, map, Observable } from 'rxjs';

import { EF_SPAWN_INTERVAL_MS, EF_SPAWN_ODDS } from 'config';
import { Player, ElectricField } from 'components';
import { IGameState } from 'interfaces';

const startSpawningElectricFields = (
  context: CanvasRenderingContext2D,
  gameState: IGameState,
  player: Player,
): Observable<ElectricField> => {
  return interval(EF_SPAWN_INTERVAL_MS).pipe(
    filter(() => {
      return Math.floor(Math.random() * EF_SPAWN_ODDS) === 1;
    }),
    map(() => {
      return new ElectricField(context, gameState, { player });
    }),
  );
};

const filterPassedElectircFields = (electricFields: ElectricField[]) => {
  return electricFields.filter((electricField) => {
    return electricField.endX >= 0;
  });
};

export { startSpawningElectricFields, filterPassedElectircFields };
