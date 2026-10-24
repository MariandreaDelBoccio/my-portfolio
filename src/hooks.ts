import { useEffect, useRef, useState } from "react";
import Lenis from "lenis";

function useMedia(query: string) {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const sync = () => setMatches(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, [query]);
  return matches;
}

export const useReducedMotion = () => useMedia("(prefers-reduced-motion: reduce)");
export const useIsMobile = () => useMedia("(max-width: 720px)");

let lenisSingleton: Lenis | null = null;

/** Smooth scroll, shared so anchor links can use the same instance. */
export function useLenis(enabled: boolean) {
  const raf = useRef(0);
  useEffect(() => {
    if (!enabled) return;
    const lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    lenisSingleton = lenis;
    const loop = (time: number) => {
      lenis.raf(time);
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf.current);
      lenis.destroy();
      lenisSingleton = null;
    };
  }, [enabled]);
}

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  if (lenisSingleton) lenisSingleton.scrollTo(el, { duration: 1.6 });
  else el.scrollIntoView({ behavior: "smooth" });
}

/** WebGL probe so the intro can fall back to a drawn frame. */
export function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return Boolean(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

/**
 * Keeps the fixed header readable: solid ivory on dark surfaces, ink on light.
 * Replaces mix-blend difference, which fails on mid-tone project photography.
 */
export function useHdrTone() {
  useEffect(() => {
    const root = document.documentElement;
    const pick = () => {
      const band = 88;
      const nodes = Array.from(document.querySelectorAll<HTMLElement>("[data-surface]"));
      let tone: "dark" | "light" = "dark";
      let bestArea = 0;
      for (const el of nodes) {
        const r = el.getBoundingClientRect();
        const area = Math.max(0, Math.min(band, r.bottom) - Math.max(0, r.top));
        if (area > bestArea) {
          bestArea = area;
          tone = el.dataset.surface === "light" ? "light" : "dark";
        }
      }
      if (root.dataset.hdr !== tone) root.dataset.hdr = tone;
    };
    let raf = 0;
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(() => {
        raf = 0;
        pick();
      });
    };
    pick();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
      delete root.dataset.hdr;
    };
  }, []);
}
