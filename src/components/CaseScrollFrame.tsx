import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type Mode = "before" | "after" | "crossfade";

type CaseScrollFrameProps = {
  mode: Mode;
  beforeSrc: string;
  afterSrc: string;
  beforeAlt: string;
  afterAlt: string;
  beforeIntrinsicW: number;
  afterIntrinsicW: number;
  intrinsicH: number;
  /** 0 = antes, 1 = después (solo en mode crossfade) */
  crossfade?: number;
  /** Etiqueta de la "barra de ventana" (opcional) */
  windowLabel?: string;
  /**
   * Ancho máximo en CSS (px) del carril de la captura. Por defecto = ancho nativo
   * en modo before/after, o el menor de los dos en crossfade, para no submuestreoar.
   * Si subes un PNG 2× (p. ej. 530px), ajusta también beforeIntrinsicW/afterIntrinsicW
   * y deja un margen, o fija esto a ese ancho lógico.
   */
  maxContentWidthPx?: number;
  /** Altura mínima del contenido desplazable (p. ej. alinear Antes/Después en dos columnas) */
  minContentHeightPx?: number;
  className?: string;
};

function contentHeight(
  w: number,
  intrinsicW: number,
  intrinsicH: number
) {
  if (w <= 0 || intrinsicW <= 0) return 0;
  return (w * intrinsicH) / intrinsicW;
}

export function CaseScrollFrame({
  mode,
  beforeSrc,
  afterSrc,
  beforeAlt,
  afterAlt,
  beforeIntrinsicW,
  afterIntrinsicW,
  intrinsicH,
  crossfade = 0,
  windowLabel,
  maxContentWidthPx: maxContentWidthOverride,
  minContentHeightPx,
  className,
}: CaseScrollFrameProps) {
  const cap =
    maxContentWidthOverride ??
    (mode === "before"
      ? beforeIntrinsicW
      : mode === "after"
        ? afterIntrinsicW
        : Math.min(beforeIntrinsicW, afterIntrinsicW));

  const scrollRef = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(0);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const update = () => setW(el.clientWidth);
    const ro = new ResizeObserver(update);
    ro.observe(el);
    update();
    return () => ro.disconnect();
  }, []);

  const hBefore = contentHeight(w, beforeIntrinsicW, intrinsicH);
  const hAfter = contentHeight(w, afterIntrinsicW, intrinsicH);
  const naturalCrossfadeH = Math.max(hBefore, hAfter, 1);
  const contentH = Math.max(naturalCrossfadeH, minContentHeightPx ?? 0);
  const fillBefore = Math.max(0, contentH - hBefore);
  const fillAfter = Math.max(0, contentH - hAfter);
  const blend = Math.max(0, Math.min(1, crossfade));

  const beforeTargetH =
    mode === "before" && minContentHeightPx != null
      ? Math.max(hBefore, minContentHeightPx)
      : hBefore;
  const afterTargetH =
    mode === "after" && minContentHeightPx != null
      ? Math.max(hAfter, minContentHeightPx)
      : hAfter;
  const fillBeforeSingle = Math.max(0, beforeTargetH - hBefore);
  const fillAfterSingle = Math.max(0, afterTargetH - hAfter);

  return (
    <div
      className={cn(
        "mx-auto w-full overflow-hidden rounded-xl border border-white/10 bg-zinc-950/90 shadow-2xl ring-1 ring-white/5",
        className
      )}
      style={{ maxWidth: `min(100%, ${cap}px)` }}
    >
      <div
        className="flex shrink-0 items-center gap-1.5 bg-zinc-800/95 px-3 py-2 shadow-[0_1px_0_0_hsl(0_0%_100%_/_0.08)]"
        aria-hidden
      >
        <span className="h-2.5 w-2.5 rounded-full bg-zinc-600" />
        <span className="h-2.5 w-2.5 rounded-full bg-zinc-600" />
        <span className="h-2.5 w-2.5 rounded-full bg-zinc-600" />
        {windowLabel && (
          <span className="ml-1 truncate font-mono text-[10px] tracking-wide text-zinc-500">
            {windowLabel}
          </span>
        )}
      </div>
      <div
        ref={scrollRef}
        className="relative max-h-[min(64svh,600px)] touch-pan-y overflow-y-auto overflow-x-hidden overscroll-y-contain bg-white [scrollbar-color:hsl(240_5%_65%)_hsl(240_5%_92%)] [scrollbar-width:thin]"
      >
        {mode === "before" && w > 0 && (
          <div
            className="min-h-0 bg-white [font-size:0] leading-[0]"
            style={{ minHeight: beforeTargetH }}
          >
            <img
              src={beforeSrc}
              alt={beforeAlt}
              width={beforeIntrinsicW}
              height={intrinsicH}
              className="m-0 block h-auto w-full max-w-none align-top"
              loading="lazy"
              decoding="async"
              draggable={false}
              sizes={`${Math.round(cap)}px`}
            />
            {fillBeforeSingle > 0 && (
              <div
                className="m-0 block w-full bg-white"
                style={{ height: fillBeforeSingle }}
                aria-hidden
              />
            )}
          </div>
        )}
        {mode === "before" && w === 0 && (
          <div className="h-72 w-full animate-pulse bg-zinc-100" aria-hidden />
        )}
        {mode === "after" && w > 0 && (
          <div
            className="min-h-0 bg-white [font-size:0] leading-[0]"
            style={{ minHeight: afterTargetH }}
          >
            <img
              src={afterSrc}
              alt={afterAlt}
              width={afterIntrinsicW}
              height={intrinsicH}
              className="m-0 block h-auto w-full max-w-none align-top"
              loading="lazy"
              decoding="async"
              draggable={false}
              sizes={`${Math.round(cap)}px`}
            />
            {fillAfterSingle > 0 && (
              <div
                className="m-0 block w-full bg-white"
                style={{ height: fillAfterSingle }}
                aria-hidden
              />
            )}
          </div>
        )}
        {mode === "after" && w === 0 && (
          <div className="h-72 w-full animate-pulse bg-zinc-100" aria-hidden />
        )}
        {mode === "crossfade" && w > 0 && (
          <div className="relative w-full bg-white" style={{ height: contentH }}>
            <div
              className="absolute left-0 top-0 w-full [font-size:0] leading-[0]"
              style={{ opacity: 1 - blend, pointerEvents: "none" }}
            >
              <img
                src={beforeSrc}
                alt={beforeAlt}
                width={beforeIntrinsicW}
                height={intrinsicH}
                className="m-0 block h-auto w-full max-w-none align-top"
                loading="lazy"
                decoding="async"
                draggable={false}
                sizes={`${Math.round(cap)}px`}
              />
              {fillBefore > 0 && (
                <div
                  className="m-0 block w-full bg-white"
                  style={{ height: fillBefore }}
                  aria-hidden
                />
              )}
            </div>
            <div
              className="absolute left-0 top-0 w-full [font-size:0] leading-[0]"
              style={{ opacity: blend, pointerEvents: "none" }}
            >
              <img
                src={afterSrc}
                alt={afterAlt}
                width={afterIntrinsicW}
                height={intrinsicH}
                className="m-0 block h-auto w-full max-w-none align-top"
                loading="lazy"
                decoding="async"
                draggable={false}
                sizes={`${Math.round(cap)}px`}
              />
              {fillAfter > 0 && (
                <div
                  className="m-0 block w-full bg-white"
                  style={{ height: fillAfter }}
                  aria-hidden
                />
              )}
            </div>
          </div>
        )}
        {mode === "crossfade" && w === 0 && (
          <div className="h-72 w-full animate-pulse bg-zinc-100" aria-hidden />
        )}
      </div>
    </div>
  );
}
