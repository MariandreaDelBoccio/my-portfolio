import { useEffect, useRef, useState, useCallback, type RefObject } from "react";

export function useScrollAnimation(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, isVisible };
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export function useScrollyProgress(
  trackRef: RefObject<HTMLElement | null>
) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const el = trackRef.current;
      if (!el) {
        setProgress(0);
        return;
      }
      const h = el.offsetHeight;
      const wh = window.innerHeight;
      const scrollable = Math.max(1, h - wh);
      const y = -el.getBoundingClientRect().top;
      setProgress(clamp(y / scrollable, 0, 1));
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    const ro = new ResizeObserver(() => update());
    const el = trackRef.current;
    if (el) ro.observe(el);

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      ro.disconnect();
    };
  }, [trackRef]);

  return progress;
}

export function useParallax() {
  const [offset, setOffset] = useState(0);
  
  useEffect(() => {
    const onScroll = () => setOffset(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return offset;
}

export function useMouseParallax() {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const onMove = useCallback((e: MouseEvent) => {
    setPos({
      x: (e.clientX / window.innerWidth - 0.5) * 2,
      y: (e.clientY / window.innerHeight - 0.5) * 2,
    });
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [onMove]);

  return pos;
}
