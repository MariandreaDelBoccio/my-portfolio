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

export type MultiPageImage = {
  src: string;
  intrinsicW: number;
  intrinsicH: number;
};

export type CaseStudyMultiPageProps = {
  id: string;
  i18nPrefix: string;
  images: MultiPageImage[];
  liveUrl: string;
  liveHostDisplay: string;
  tone?: "default" | "muted";
};

const STEP_COUNT = 5;

function fiveStepWeights(p: number) {
  return [
    1 - smoothstep(0.06, 0.24, p),
    smoothstep(0.16, 0.28, p) * (1 - smoothstep(0.36, 0.46, p)),
    smoothstep(0.36, 0.48, p) * (1 - smoothstep(0.54, 0.64, p)),
    smoothstep(0.52, 0.64, p) * (1 - smoothstep(0.72, 0.8, p)),
    smoothstep(0.7, 0.84, p),
  ];
}

const CaseStudyMultiPageSection = ({
  id,
  i18nPrefix,
  images,
  liveUrl,
  liveHostDisplay,
  tone = "default",
}: CaseStudyMultiPageProps) => {
  const { t } = useTranslation();
  const pk = (key: string) => t(`${i18nPrefix}.${key}`);

  const n = images.length;
  const trans = Math.max(0, n - 1);

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

  const p = reducedMotion ? 0.5 : progress;
  const seqBlend = trans > 0 ? Math.max(0, Math.min(1, progress)) : 0;
  const inactive = 0.28;
  const rawWeights = fiveStepWeights(p);
  const opacities = rawWeights.map((w) =>
    reducedMotion ? 1 : inactive + (1 - inactive) * w
  );

  const sectionTone =
    tone === "muted"
      ? "border-y border-border/40 bg-background/80"
      : "border-y border-border/40 bg-secondary/20";

  return (
    <section id={id} aria-label={pk("ariaLabel")} className={`relative ${sectionTone}`}>
      <div
        ref={trackRef}
        className={reducedMotion ? "relative" : "relative min-h-[300vh] lg:min-h-[340vh]"}
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
                </p>
                <ol className="mt-1 flex w-full flex-col gap-5 sm:gap-4 lg:mt-2">
                  {Array.from({ length: STEP_COUNT }, (_, idx) => (
                    <li
                      key={idx}
                      className="flex gap-3 transition-opacity duration-500"
                      style={{ opacity: opacities[idx] }}
                    >
                      <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border bg-card text-xs font-mono text-primary">
                        {idx + 1}
                      </span>
                      <div>
                        <h3 className="font-display text-lg font-semibold">
                          {pk(`step${idx + 1}Title`)}
                        </h3>
                        <p className="mt-1 text-sm text-muted-foreground text-pretty">
                          {pk(`step${idx + 1}Body`)}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="relative order-1 min-w-0 self-start lg:order-2 lg:col-span-8">
                {!reducedMotion && (
                  <div
                    className="pointer-events-none absolute -inset-2 rounded-3xl bg-gradient-to-br from-primary/8 via-transparent to-accent/8 blur-xl"
                    style={{ opacity: 0.35 + 0.2 * progress }}
                    aria-hidden
                  />
                )}
                {reducedMotion ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-3">
                      {images.map((im, i) => (
                        <div key={i} className="space-y-1.5">
                          <CaseScrollFrame
                            mode="before"
                            beforeSrc={im.src}
                            afterSrc={im.src}
                            beforeAlt={pk(`img${i + 1}Alt`)}
                            afterAlt={pk(`img${i + 1}Alt`)}
                            beforeIntrinsicW={im.intrinsicW}
                            afterIntrinsicW={im.intrinsicW}
                            intrinsicH={im.intrinsicH}
                            maxContentWidthPx={CASE_FRAME_MAX_CONTENT_PX}
                            windowLabel={pk("windowLabel")}
                          />
                          <p className="text-center text-xs text-muted-foreground sm:text-left">
                            {pk(`img${i + 1}Label`)}
                          </p>
                        </div>
                      ))}
                    </div>
                    <p className="text-center text-xs text-muted-foreground/80 sm:text-left">
                      {pk("frameHint")} {pk("reducedHint")}
                    </p>
                  </div>
                ) : (
                  <div className="mx-auto w-full min-w-0 max-w-full space-y-2">
                    <CaseScrollFrame
                      mode="sequence"
                      beforeSrc={images[0]!.src}
                      afterSrc={images[0]!.src}
                      beforeAlt={pk("img1Alt")}
                      afterAlt={pk("img1Alt")}
                      beforeIntrinsicW={images[0]!.intrinsicW}
                      afterIntrinsicW={images[0]!.intrinsicW}
                      intrinsicH={images[0]!.intrinsicH}
                      sequenceImages={images.map((im, i) => ({
                        src: im.src,
                        intrinsicW: im.intrinsicW,
                        intrinsicH: im.intrinsicH,
                        alt: pk(`img${i + 1}Alt`),
                      }))}
                      sequenceProgress={seqBlend}
                      maxContentWidthPx={CASE_FRAME_MAX_CONTENT_PX}
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

export default CaseStudyMultiPageSection;
