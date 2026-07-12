import { useLayoutEffect } from 'react';
import gsap from 'gsap';

export function useGsap(callback, dependencies = []) {
  useLayoutEffect(() => {
    let ctx = gsap.context(callback);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);
}
