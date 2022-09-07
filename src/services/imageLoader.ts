import { filter, from, fromEvent, map, mergeMap, Observable, scan } from 'rxjs';

import { BACKGROUNDS } from 'config';
import { IBackgroundProps } from 'interfaces';

const loadBackroundImages = (): Observable<IBackgroundProps[]> => {
  return from(BACKGROUNDS).pipe(
    mergeMap((background) => {
      const img = new Image();
      img.src = background.imageSrc;
      return fromEvent(img, 'load').pipe(
        map((e) => {
          return {
            image: e.target as HTMLImageElement,
            speed: background.speed,
            zIndex: background.zIndex,
          } as IBackgroundProps;
        }),
      );
    }),
    scan(
      (acc: IBackgroundProps[], curr: IBackgroundProps) => [...acc, curr],
      [],
    ),
    filter((bgProps) => bgProps.length === BACKGROUNDS.length),
    map((bgProps) => {
      return bgProps.sort(
        (bgProp1, bgProp2) => bgProp1.zIndex - bgProp2.zIndex,
      );
    }),
  );
};

export { loadBackroundImages };
