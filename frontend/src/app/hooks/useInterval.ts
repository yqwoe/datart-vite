import { useCallback, useEffect, useRef, useState } from 'react';

type IUseIntervalProps = {
  interval: number;
  callback: (...args: any[]) => void | Promise<void>;
  delay?: number;
  deactivedAtFirst?: boolean;
  shouldRunImmediately?: boolean;
  debug?: boolean;
};
export default function useInterval(props: IUseIntervalProps, depts: any) {
  const {
    callback,
    interval,
    deactivedAtFirst,
    shouldRunImmediately,
    debug = false,
  } = props;

  const [isPaused, setIsPaused] = useState(!!deactivedAtFirst);

  /**
   * Reactivate the paused hook
   */
  const activate = useCallback(() => {
    setIsPaused(false);
  }, []);

  /**
   * Temporarily pause the hook, callbacks wil not be called, but timelapse still get updated
   */
  const pause = useCallback(() => {
    setIsPaused(true);
  }, []);

  const timerRef = useRef<NodeJS.Timer>();

  /*
   * Indicate the amount of time passed since the hook get initialized
   */
  const [timeLapse, setTimeLapse] = useState(0);

  /**
   * Clear the timer, timelapse stop updating, callback will not be called anymore
   */
  const stop = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = undefined;
    }
  }, []);

  useEffect(() => {
    if (isPaused) {
      return;
    }
    if (!timeLapse && !shouldRunImmediately) {
      return;
    }
    callback();
  }, [timeLapse, shouldRunImmediately,callback]);

  useEffect(() => {
    if (interval) {
      const timer = setInterval(() => {
        setTimeLapse(c => c + interval);
      }, interval);

      timerRef.current = timer;
    }

    return () => {
      stop();
    };
  });


  if (debug) {
    console.table([
      ['interval', interval],
      ['deactivedAtFirst', deactivedAtFirst],
      ['shouldRunImmediately', shouldRunImmediately],
      ['isPaused', isPaused],
      ['timeLapse', timeLapse],
    ]);
  }

  return {
    pause,
    activate,
    stop,
    timeLapse,
    isPaused,
    timerRef,
  };
}
