import { useRef, useEffect, useState } from "react";
import { useScrollyProgress } from "@/hooks/useScrollAnimation";
import { useTranslation } from "react-i18next";
import beforeImg from "@/assets/case-medbio-before.png";
import afterImg from "@/assets/case-medbio-after.png";
import { CaseScrollFrame } from "@/components/CaseScrollFrame";
import { ExternalLink } from "lucide-react";

const MEDBIO_LIVE_URL = "https://medbioinformatics.com";

/** Píxeles reales de cada PNG. Si exportas 2× (p. ej. 530 de ancho), actualiza el número. */
const CASE_BEFORE_W = 265;
const CASE_AFTER_W = 326;
const CASE_H = 1024;
/** Mismo ancho lógico para alinear el alto de scroll entre Antes y Después. */
const CASE_ALIGN_W = Math.min(CASE_BEFORE_W, CASE_AFTER_W);
const CASE_ALIGNED_SCROLL_H = Math.max(
  (CASE_ALIGN_W * CASE_H) / CASE_BEFORE_W,
  (CASE_ALIGN_W * CASE_H) / CASE_AFTER_W
);

function smoothstep(edge0: number, edge1: number, t: number) {
  if (t <= edge0) return 0;
  if (t >= edge1) return 1;
  const x = (t - edge0) / (edge1 - edge0);
  return x * x * (3 - 2 * x);
}

const ScrollyRedesignSection = () => {
  const { t } = useTranslation();
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
  // Tres fases con solapes suaves: el paso central necesita un tramo "plano" (trapecio),
  // no un pico en 0.5, o casi nunca se ve dominante.
  const step0 = 1 - smoothstep(0.08, 0.38, p);
  const step1 =
    smoothstep(0.28, 0.4, p) * (1 - smoothstep(0.58, 0.7, p));
  const step2 = smoothstep(0.55, 0.78, p);

  const inactive = 0.3;
  const s0 = reducedMotion ? 1 : inactive + (1 - inactive) * step0;
  const s1 = reducedMotion ? 1 : inactive + (1 - inactive) * step1;
  const s2 = reducedMotion ? 1 : inactive + (1 - inactive) * step2;

  return (
    <section
      id="case-study"
      aria-label={t("scrollyCase.ariaLabel")}
      className="relative border-y border-border/40 bg-secondary/20"
    >
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
          <div className="container mx-auto max-w-6xl">
            <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-primary">
              {t("scrollyCase.kicker")}
            </p>
            <h2 className="font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl md:text-5xl text-balance">
              {t("scrollyCase.title")}{" "}
              <span className="text-gradient">{t("scrollyCase.titleGradient")}</span>
            </h2>

            <div className="mt-8 grid items-start gap-8 lg:mt-10 lg:grid-cols-12 lg:gap-x-8 lg:gap-y-0">
              <div className="order-2 flex min-h-0 flex-col gap-5 sm:gap-6 lg:order-1 lg:col-span-6">
                <p className="text-muted-foreground text-balance sm:text-lg">
                  {t(reducedMotion ? "scrollyCase.subtitleReduced" : "scrollyCase.subtitle")}
                </p>
                <p>
                  <a
                    href={MEDBIO_LIVE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-card/50 px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary/50 hover:text-primary"
                  >
                    <ExternalLink className="h-4 w-4 shrink-0 text-primary" aria-hidden />
                    {t("scrollyCase.visitSiteLabel")}
                    <span className="text-muted-foreground">—</span>
                    <span className="text-gradient font-medium">medbioinformatics.com</span>
                  </a>
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
                      <h3 className="font-display text-lg font-semibold">
                        {t("scrollyCase.step1Title")}
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground text-pretty">
                        {t("scrollyCase.step1Body")}
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
                      <h3 className="font-display text-lg font-semibold">
                        {t("scrollyCase.step2Title")}
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground text-pretty">
                        {t("scrollyCase.step2Body")}
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
                      <h3 className="font-display text-lg font-semibold">
                        {t("scrollyCase.step3Title")}
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground text-pretty">
                        {t("scrollyCase.step3Body")}
                      </p>
                    </div>
                  </li>
                </ol>
              </div>

              <div className="relative order-1 self-start lg:order-2 lg:col-span-6">
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
                          beforeSrc={beforeImg}
                          afterSrc={afterImg}
                          beforeAlt={t("scrollyCase.beforeAlt")}
                          afterAlt={t("scrollyCase.afterAlt")}
                          beforeIntrinsicW={CASE_BEFORE_W}
                          afterIntrinsicW={CASE_AFTER_W}
                          intrinsicH={CASE_H}
                          maxContentWidthPx={CASE_ALIGN_W}
                          minContentHeightPx={CASE_ALIGNED_SCROLL_H}
                          windowLabel={t("scrollyCase.windowLabel")}
                        />
                        <p className="text-center text-sm text-muted-foreground sm:text-left">
                          {t("scrollyCase.beforeLabel")}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <CaseScrollFrame
                          mode="after"
                          beforeSrc={beforeImg}
                          afterSrc={afterImg}
                          beforeAlt={t("scrollyCase.beforeAlt")}
                          afterAlt={t("scrollyCase.afterAlt")}
                          beforeIntrinsicW={CASE_BEFORE_W}
                          afterIntrinsicW={CASE_AFTER_W}
                          intrinsicH={CASE_H}
                          maxContentWidthPx={CASE_ALIGN_W}
                          minContentHeightPx={CASE_ALIGNED_SCROLL_H}
                          windowLabel={t("scrollyCase.windowLabel")}
                        />
                        <p className="text-center text-sm text-muted-foreground sm:text-left">
                          {t("scrollyCase.afterLabel")}
                        </p>
                      </div>
                    </div>
                    <p className="text-center text-xs text-muted-foreground/80 sm:text-left">
                      {t("scrollyCase.frameHint")} {t("scrollyCase.reducedHint")}
                    </p>
                  </div>
                ) : (
                  <div className="mx-auto w-full max-w-[min(100%,320px)] space-y-2">
                    <CaseScrollFrame
                      mode="crossfade"
                      beforeSrc={beforeImg}
                      afterSrc={afterImg}
                      beforeAlt={t("scrollyCase.beforeAlt")}
                      afterAlt={t("scrollyCase.afterAlt")}
                      beforeIntrinsicW={CASE_BEFORE_W}
                      afterIntrinsicW={CASE_AFTER_W}
                      intrinsicH={CASE_H}
                      maxContentWidthPx={CASE_ALIGN_W}
                      crossfade={blend}
                      windowLabel={t("scrollyCase.windowLabel")}
                    />
                    <p className="text-center text-xs text-muted-foreground/80 sm:text-left">
                      {t("scrollyCase.frameHint")}{" "}
                      <span className="text-muted-foreground/60">·</span>{" "}
                      {t("scrollyCase.scrollHint")}
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

export default ScrollyRedesignSection;
