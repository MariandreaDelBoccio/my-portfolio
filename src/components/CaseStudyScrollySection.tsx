import { useRef, useEffect, useState } from "react";
import { useScrollyProgress } from "@/hooks/useScrollAnimation";
import { useTranslation } from "react-i18next";
import { CaseScrollFrame } from "@/components/CaseScrollFrame";
import { CASE_FRAME_MAX_CONTENT_PX } from "@/lib/caseFrame";
import { ExternalLink } from "lucide-react";

function smoothstep(edge0: number, edge1: number, t: number) {
  if (t <= edge0) return 0;
  if (t >= edge1) return 1;
  const x = (t - edge0) / (edge1 - edge0);
  return x * x * (3 - 2 * x);
}

export type CaseStudyScrollyProps = {
  id: string;
  i18nPrefix: string;
  beforeSrc: string;
  afterSrc: string;
  beforeIntrinsicW: number;
  afterIntrinsicW: number;
  beforeIntrinsicH?: number;
  afterIntrinsicH?: number;
  intrinsicH: number;
  liveUrl?: string;
  liveHostDisplay?: string;
  tone?: "default" | "muted";
};

const CaseStudyScrollySection = ({
  id,
  i18nPrefix,
  beforeSrc,
  afterSrc,
  beforeIntrinsicW,
  afterIntrinsicW,
  beforeIntrinsicH,
  afterIntrinsicH,
  intrinsicH,
  liveUrl,
  liveHostDisplay,
  tone = "default",
}: CaseStudyScrollyProps) => {
  const { t } = useTranslation();
  const pk = (key: string) => t(`${i18nPrefix}.${key}`);

  const bH = beforeIntrinsicH ?? intrinsicH;
  const aH = afterIntrinsicH ?? intrinsicH;
  const CASE_ALIGN_W = Math.min(beforeIntrinsicW, afterIntrinsicW);
  const CASE_ALIGNED_SCROLL_H = Math.max(
    (CASE_ALIGN_W * bH) / beforeIntrinsicW,
    (CASE_ALIGN_W * aH) / afterIntrinsicW
  );
  const hasLiveUrl = Boolean(liveUrl);

  const trackRef = useRef<HTMLDivElement>(null);
  const progress = useScrollyProgress(trackRef);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const rawBlend = smoothstep(0.28, 0.72, progress);
  const blend = reducedMotion ? 1 : rawBlend;

  const p = reducedMotion ? 1 : progress;
  const step0 = 1 - smoothstep(0.08, 0.38, p);
  const step1 = smoothstep(0.28, 0.4, p) * (1 - smoothstep(0.58, 0.7, p));
  const step2 = smoothstep(0.55, 0.78, p);

  const inactive = 0.3;
  const s0 = reducedMotion ? 1 : inactive + (1 - inactive) * step0;
  const s1 = reducedMotion ? 1 : inactive + (1 - inactive) * step1;
  const s2 = reducedMotion ? 1 : inactive + (1 - inactive) * step2;

  const sectionTone =
    tone === "muted"
      ? "border-y border-border/40 bg-background/80"
      : "border-y border-border/40 bg-secondary/20";

  return (
    <section id={id} aria-label={pk("ariaLabel")} className={`relative ${sectionTone}`}>
      <div
        ref={trackRef}
        className={reducedMotion ? "relative" : "relative min-h-[240vh] lg:min-h-[260vh]"}
      >
        <div
          className={
            reducedMotion
              ? "flex flex-col justify-center overflow-hidden px-4 py-20 sm:px-6 lg:px-8"
              : "sticky top-0 flex min-h-screen flex-col justify-center overflow-hidden px-4 py-16 sm:px-6 lg:px-8"
          }
        >
          <div className="container mx-auto max-w-7xl">
            <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-primary">
              {pk("kicker")}
            </p>
            <h2 className="font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl md:text-5xl text-balance">
              {pk("title")} <span className="text-gradient">{pk("titleGradient")}</span>
            </h2>

            <div className="mt-8 grid items-start gap-8 lg:mt-10 lg:grid-cols-12 lg:gap-x-8 lg:gap-y-0">
              <div className="order-2 flex min-h-0 flex-col gap-5 sm:gap-6 lg:order-1 lg:col-span-4">
                <p className="text-muted-foreground text-balance sm:text-lg">
                  {pk(reducedMotion ? "subtitleReduced" : "subtitle")}
                </p>
                <p>
                  {hasLiveUrl ? (
                    <a
                      href={liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-card/50 px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary/50 hover:text-primary"
                    >
                      <ExternalLink className="h-4 w-4 shrink-0 text-primary" aria-hidden />
                      {pk("visitSiteLabel")}
                      <span className="text-muted-foreground">—</span>
                      <span className="text-gradient font-medium">{liveHostDisplay}</span>
                    </a>
                  ) : (
                    <span className="inline-flex max-w-prose items-center gap-2 rounded-full border border-dashed border-border/80 bg-card/30 px-4 py-2 text-sm text-muted-foreground">
                      {pk("noPublicLinkNote")}
                    </span>
                  )}
                </p>
                <ol className="mt-1 flex w-full flex-col gap-6 sm:flex-row sm:items-start sm:gap-4 lg:mt-2 lg:flex-col lg:gap-7">
                  <li
                    className="flex gap-3 transition-opacity duration-500"
                    style={{ opacity: s0 }}
                  >
                    <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border bg-card text-xs font-mono text-primary">
                      1
                    </span>
                    <div>
                      <h3 className="font-display text-lg font-semibold">{pk("step1Title")}</h3>
                      <p className="mt-1 text-sm text-muted-foreground text-pretty">
                        {pk("step1Body")}
                      </p>
                    </div>
                  </li>
                  <li
                    className="flex gap-3 transition-opacity duration-500"
                    style={{ opacity: s1 }}
                  >
                    <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border bg-card text-xs font-mono text-primary">
                      2
                    </span>
                    <div>
                      <h3 className="font-display text-lg font-semibold">{pk("step2Title")}</h3>
                      <p className="mt-1 text-sm text-muted-foreground text-pretty">
                        {pk("step2Body")}
                      </p>
                    </div>
                  </li>
                  <li
                    className="flex gap-3 transition-opacity duration-500"
                    style={{ opacity: s2 }}
                  >
                    <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border bg-card text-xs font-mono text-primary">
                      3
                    </span>
                    <div>
                      <h3 className="font-display text-lg font-semibold">{pk("step3Title")}</h3>
                      <p className="mt-1 text-sm text-muted-foreground text-pretty">
                        {pk("step3Body")}
                      </p>
                    </div>
                  </li>
                </ol>
              </div>

              <div className="relative order-1 min-w-0 self-start lg:order-2 lg:col-span-8">
                {!reducedMotion && (
                  <div
                    className="pointer-events-none absolute -inset-2 rounded-3xl bg-gradient-to-br from-primary/8 via-transparent to-accent/8 blur-xl"
                    style={{ opacity: 0.35 + 0.25 * progress }}
                    aria-hidden
                  />
                )}
                {reducedMotion ? (
                  <div className="space-y-3">
                    <div className="grid items-start gap-6 sm:grid-cols-2 sm:gap-4">
                      <div className="space-y-2">
                        <CaseScrollFrame
                          mode="before"
                          beforeSrc={beforeSrc}
                          afterSrc={afterSrc}
                          beforeAlt={pk("beforeAlt")}
                          afterAlt={pk("afterAlt")}
                          beforeIntrinsicW={beforeIntrinsicW}
                          afterIntrinsicW={afterIntrinsicW}
                          beforeIntrinsicH={beforeIntrinsicH}
                          afterIntrinsicH={afterIntrinsicH}
                          intrinsicH={intrinsicH}
                          maxContentWidthPx={CASE_FRAME_MAX_CONTENT_PX}
                          minContentHeightPx={CASE_ALIGNED_SCROLL_H}
                          windowLabel={pk("windowLabel")}
                        />
                        <p className="text-center text-sm text-muted-foreground sm:text-left">
                          {pk("beforeLabel")}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <CaseScrollFrame
                          mode="after"
                          beforeSrc={beforeSrc}
                          afterSrc={afterSrc}
                          beforeAlt={pk("beforeAlt")}
                          afterAlt={pk("afterAlt")}
                          beforeIntrinsicW={beforeIntrinsicW}
                          afterIntrinsicW={afterIntrinsicW}
                          beforeIntrinsicH={beforeIntrinsicH}
                          afterIntrinsicH={afterIntrinsicH}
                          intrinsicH={intrinsicH}
                          maxContentWidthPx={CASE_FRAME_MAX_CONTENT_PX}
                          minContentHeightPx={CASE_ALIGNED_SCROLL_H}
                          windowLabel={pk("windowLabel")}
                        />
                        <p className="text-center text-sm text-muted-foreground sm:text-left">
                          {pk("afterLabel")}
                        </p>
                      </div>
                    </div>
                    <p className="text-center text-xs text-muted-foreground/80 sm:text-left">
                      {pk("frameHint")} {pk("reducedHint")}
                    </p>
                  </div>
                ) : (
                  <div className="mx-auto w-full min-w-0 max-w-full space-y-2">
                    <CaseScrollFrame
                      mode="crossfade"
                      beforeSrc={beforeSrc}
                      afterSrc={afterSrc}
                      beforeAlt={pk("beforeAlt")}
                      afterAlt={pk("afterAlt")}
                      beforeIntrinsicW={beforeIntrinsicW}
                      afterIntrinsicW={afterIntrinsicW}
                      beforeIntrinsicH={beforeIntrinsicH}
                      afterIntrinsicH={afterIntrinsicH}
                      intrinsicH={intrinsicH}
                      maxContentWidthPx={CASE_FRAME_MAX_CONTENT_PX}
                      crossfade={blend}
                      windowLabel={pk("windowLabel")}
                    />
                    <p className="text-center text-xs text-muted-foreground/80 sm:text-left">
                      {pk("frameHint")} <span className="text-muted-foreground/60">·</span>{" "}
                      {pk("scrollHint")}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CaseStudyScrollySection;
