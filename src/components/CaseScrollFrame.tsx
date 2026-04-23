import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type Mode = "before" | "after" | "crossfade" | "sequence";

export type SequenceFrameImage = {
  src: string;
  intrinsicW: number;
  intrinsicH: number;
  alt: string;
};

type CaseScrollFrameProps = {
  mode: Mode;
  beforeSrc: string;
  afterSrc: string;
  beforeAlt: string;
  afterAlt: string;
  beforeIntrinsicW: number;
  afterIntrinsicW: number;
  beforeIntrinsicH?: number;
  afterIntrinsicH?: number;
  intrinsicH: number;
  crossfade?: number;
  sequenceImages?: SequenceFrameImage[];
  sequenceProgress?: number;
  windowLabel?: string;
  maxContentWidthPx?: number;
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
  beforeIntrinsicH,
  afterIntrinsicH,
  intrinsicH,
  crossfade = 0,
  sequenceImages = [],
  sequenceProgress = 0,
  windowLabel,
  maxContentWidthPx: maxContentWidthOverride,
  minContentHeightPx,
  className,
}: CaseScrollFrameProps) {
  const cap =
    maxContentWidthOverride ??
    (mode === "sequence" && sequenceImages.length > 0
      ? Math.min(...sequenceImages.map((i) => i.intrinsicW))
      : mode === "before"
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

  const bH = beforeIntrinsicH ?? intrinsicH;
  const aH = afterIntrinsicH ?? intrinsicH;
  const hBefore = contentHeight(w, beforeIntrinsicW, bH);
  const hAfter = contentHeight(w, afterIntrinsicW, aH);
  const blend = Math.max(0, Math.min(1, crossfade));

  const sequenceLayout =
    mode === "sequence" && sequenceImages.length > 0 && w > 0
      ? (() => {
          const n = sequenceImages.length;
          const heights = sequenceImages.map((im) =>
            contentHeight(w, im.intrinsicW, im.intrinsicH)
          );
          const p = Math.max(0, Math.min(1, sequenceProgress));
          const span = n > 1 ? n - 1 : 0;
          const u = span > 0 ? p * span : 0;
          const i = n === 1 ? 0 : Math.min(Math.floor(u), n - 1);
          const t = n === 1 ? 0 : u - i;
          let H: number;
          if (n === 1) {
            H = Math.max(1, heights[0] ?? 1);
          } else {
            const hi = heights[i] ?? 0;
            const hj = heights[Math.min(i + 1, n - 1)] ?? hi;
            if (t < 1e-4) {
              H = Math.max(1, hi);
            } else if (t > 1 - 1e-4) {
              H = Math.max(1, hj);
            } else {
              H = Math.max(1, Math.max(hi, hj));
            }
          }
          return { n, u, i, t, heights, H };
        })()
      : null;

  const crossfadeH =
    blend < 1e-4
      ? Math.max(1, hBefore)
      : blend > 1 - 1e-4
        ? Math.max(1, hAfter)
        : Math.max(1, hBefore, hAfter);

  const contentH = (() => {
    if (mode === "sequence" && sequenceLayout) {
      return sequenceLayout.H;
    }
    if (mode === "crossfade") {
      return Math.max(crossfadeH, minContentHeightPx ?? 0);
    }
    return Math.max(
      Math.max(hBefore, hAfter, 1),
      minContentHeightPx ?? 0
    );
  })();

  const fillBefore = Math.max(0, contentH - hBefore);
  const fillAfter = Math.max(0, contentH - hAfter);

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
        className="relative max-h-[min(65svh,560px)] touch-pan-y overflow-y-auto overflow-x-hidden overscroll-y-contain bg-white [scrollbar-color:hsl(240_5%_65%)_hsl(240_5%_92%)] [scrollbar-width:thin]"
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
              height={bH}
              className="case-capture-img m-0 block h-auto w-full max-w-none align-top"
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
              height={aH}
              className="case-capture-img m-0 block h-auto w-full max-w-none align-top"
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
                height={bH}
                className="case-capture-img m-0 block h-auto w-full max-w-none align-top"
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
                height={aH}
                className="case-capture-img m-0 block h-auto w-full max-w-none align-top"
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
        {mode === "sequence" && w > 0 && sequenceLayout && (
          <div className="relative w-full bg-white" style={{ height: contentH }}>
            {sequenceImages.map((img, k) => {
              const { n, i, t } = sequenceLayout;
              const hLayer = sequenceLayout.heights[k] ?? 0;
              const fill = Math.max(0, contentH - hLayer);
              let op = 0;
              if (n === 1) {
                op = 1;
              } else if (k < i) {
                op = 0;
              } else if (k > i + 1) {
                op = 0;
              } else if (k === i) {
                op = 1 - t;
              } else {
                op = t;
              }

              return (
                <div
                  key={`${img.src}-${k}`}
                  className="absolute left-0 top-0 w-full [font-size:0] leading-[0]"
                  style={{ opacity: op, pointerEvents: "none" }}
                >
                  <img
                    src={img.src}
                    alt={img.alt}
                    width={img.intrinsicW}
                    height={img.intrinsicH}
                    className="case-capture-img m-0 block h-auto w-full max-w-none align-top"
                    loading="lazy"
                    decoding="async"
                    draggable={false}
                    sizes={`${Math.round(cap)}px`}
                  />
                  {fill > 0 && (
                    <div
                      className="m-0 block w-full bg-white"
                      style={{ height: fill }}
                      aria-hidden
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}
        {mode === "sequence" && w === 0 && (
          <div className="h-72 w-full animate-pulse bg-zinc-100" aria-hidden />
        )}
      </div>
    </div>
  );
}
