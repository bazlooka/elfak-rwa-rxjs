import {
  buffer,
  expand,
  filter,
  fromEvent,
  map,
  Observable,
  of,
  withLatestFrom,
} from 'rxjs';

import { MAXIMUM_DELTA_TIME } from 'config';
import { IFrameData, IKeysDown } from 'interfaces';

const initializeMainLoop = (): Observable<[number, IKeysDown]> => {
  const frames$ = createMainLoop();
  const bufferedKeysDown$ = getBufferedKeysDown(frames$);
  return frames$.pipe(withLatestFrom(bufferedKeysDown$));
};

const createMainLoop = () => {
  const calculateDelta = (prevFrame: IFrameData) => {
    return new Observable<IFrameData>((observer) => {
      window.requestAnimationFrame((currTimeStamp) => {
        const deltaTimeInMs = prevFrame
          ? currTimeStamp - prevFrame.timeStamp
          : 0;

        const MS_IN_A_SECOND = 1000;
        const deltaTime = deltaTimeInMs / MS_IN_A_SECOND;

        observer.next({
          timeStamp: currTimeStamp,
          deltaTime,
        });
      });
    });
  };

  const frames$ = of(undefined).pipe(
    expand((val) => calculateDelta(val)),
    filter((frame) => frame !== undefined),
    map((frame: IFrameData) => {
      return Math.min(frame.deltaTime, MAXIMUM_DELTA_TIME);
    }),
  );
  return frames$;
};

const getBufferedKeysDown = (frames$: Observable<number>) => {
  const keysDown$ = fromEvent(document, 'keydown').pipe(
    map((event: KeyboardEvent) => {
      return event.code;
    }),
    filter((key) => key != null),
  );

  const bufferedKeysDown$ = keysDown$.pipe(
    buffer(frames$),
    map((keysDown: string[]) => {
      return keysDown.reduce((acc: IKeysDown, currKey: string) => {
        return { ...acc, [currKey]: true };
      }, {});
    }),
  );

  return bufferedKeysDown$;
};

export { initializeMainLoop };
