import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import useInterval from './useInterval';

export const useAutoScroll = ({
  dom,
  play = false,
  delay,
  speed,
  direction,
  pauseOnHover,
}) => {
  const callback = useCallback(
    (dom, speed) => {
      directionMap?.[direction]?.();
    },
    [dom, speed, direction],
  );

  const directionMap = {
    up: () => {
      dom.scrollTop += speed;
      if (
        Math.ceil(dom.scrollTop) >=
        parseFloat((dom.scrollHeight - dom.clientHeight).toString())
      ) {
        dom.scrollTop = 0;
      }
    },
    down: () => {
      dom.scrollTop -= speed;
      if (dom.scrollTop <= 0) {
        dom.scrollTop = dom.scrollHeight;
      }
    },
    left: () => {
      dom.scrollLeft += speed;
      if (
        Math.ceil(dom.scrollLeft) >=
        parseFloat((dom.scrollWidth - dom.clientWidth).toString())
      ) {
        dom.scrollLeft = 0;
      }
    },
    right: () => {
      dom.scrollLeft -= speed;
      if (dom.scrollLeft <= 0) {
        dom.scrollLeft = dom.scrollWidth;
      }
    },
  };

  const { activate, pause, stop } = useInterval(
    {
      interval: delay,
      callback() {
        directionMap?.[direction]?.();
      },
      debug: true,
    },
    [],
  );

  useEffect(() => {
    if (play && !!dom) {
      activate();
    }
    return () => {
      console.log('close');
      stop();
    };
  }, [play, delay, pauseOnHover, direction, speed]);

  useEffect(() => {
    if (pauseOnHover && dom) {
      dom?.addEventListener('mouseover', pause);
      dom?.addEventListener('mouseout', activate);
    }
    return () => {
      console.log('close');
      stop();
      if (pauseOnHover && dom) {
        dom?.removeEventListener('mouseover', pause);
        dom?.removeEventListener('mouseout', activate);
      }
    };
  }, [dom, play, delay, speed, direction, pauseOnHover]);

  return {
    pause,
    activate,
    stop,
  };
};
