import { useEffect, useRef } from 'react';
import LocomotiveScroll from 'locomotive-scroll';
import 'locomotive-scroll/dist/locomotive-scroll.css';

interface UseLocomotiveScrollOptions {
  smooth?: boolean;
  multiplier?: number;
  lerp?: number;
  class?: string;
}

export const useLocomotiveScroll = (options: UseLocomotiveScrollOptions = {}) => {
  const scrollRef = useRef<HTMLElement | null>(null);
  const locomotiveScrollRef = useRef<LocomotiveScroll | null>(null);

  useEffect(() => {
    if (!scrollRef.current) return;

    locomotiveScrollRef.current = new LocomotiveScroll({
      el: scrollRef.current,
      smooth: options.smooth ?? true,
      multiplier: options.multiplier ?? 1,
      lerp: options.lerp ?? 0.1,
      class: options.class ?? 'is-revealed',
    });

    return () => {
      locomotiveScrollRef.current?.destroy();
    };
  }, [options.smooth, options.multiplier, options.lerp, options.class]);

  const scrollTo = (target: string | number | HTMLElement, options = {}) => {
    locomotiveScrollRef.current?.scrollTo(target, options);
  };

  return { scrollRef, scrollTo };
}; 