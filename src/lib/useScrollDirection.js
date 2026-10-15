import { useEffect, useRef, useState } from 'react';

// Tracks window scroll direction for a "hide on scroll down, reveal on scroll up" header. Always
// `true` at/near the top of the page (within `topThreshold`), regardless of direction, so the
// header never hides itself before the person has scrolled anywhere. A small `delta` ignores
// sub-pixel/rubber-band jitter so it doesn't flicker.
export default function useScrollDirection({ topThreshold = 10, delta = 5 } = {}) {
  const [visible, setVisible] = useState(true);
  const lastY = useRef(0);

  useEffect(() => {
    lastY.current = window.scrollY;
    let ticking = false;

    const update = () => {
      const y = window.scrollY;
      if (y <= topThreshold) {
        setVisible(true);
      } else if (Math.abs(y - lastY.current) > delta) {
        setVisible(y < lastY.current);
      }
      lastY.current = y;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [topThreshold, delta]);

  return visible;
}
