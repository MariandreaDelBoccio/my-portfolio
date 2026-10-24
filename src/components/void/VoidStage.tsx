import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { hasWebGL, scrollToId, useReducedMotion } from "../../hooks";
import { useI18n, type BeatKey } from "../../i18n";

const BrowserScene = lazy(() =>
  import("./BrowserScene").then((m) => ({ default: m.BrowserScene })),
);

const BEATS: { key: BeatKey; from: number }[] = [
  { key: "hero", from: 0 },
  { key: "frame", from: 0.08 },
  { key: "type", from: 0.3 },
  { key: "color", from: 0.52 },
  { key: "open", from: 0.78 },
];

function beatAt(p: number) {
  let idx = 0;
  BEATS.forEach((b, i) => {
    if (p >= b.from) idx = i;
  });
  return idx;
}

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));

function EnterButton({ label }: { label: string }) {
  return (
    <a
      className="btn solid"
      href="#work"
      onClick={(e) => {
        e.preventDefault();
        scrollToId("work");
      }}
    >
      {label}
    </a>
  );
}

/** No WebGL or reduced motion: the finished page, drawn in CSS. */
function StaticFrame({ reason }: { reason: "reduced" | "nogl" }) {
  const { t } = useI18n();
  useEffect(() => {
    document.documentElement.style.setProperty("--hero", "0");
  }, []);
  return (
    <section className="void-static" id="top" aria-label={t.introAria} data-surface="dark" data-reason={reason}>
      <div className="fb-frame">
        <div className="fb-bar" aria-hidden="true">
          <i />
          <i />
          <i />
          <span />
        </div>
        <div className="fb-screen">
          <div className="fb-image" aria-hidden="true" />
          <div className="fb-copy">
            <h1 className="fb-word">
              mdb<span>+</span>
            </h1>
            <p className="fb-tag">{t.hero.tagline}</p>
            <EnterButton label={t.hero.cta} />
          </div>
        </div>
      </div>
    </section>
  );
}

function PinnedIntro() {
  const { t } = useI18n();
  const sectionRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const wordRef = useRef<HTMLElement | null>(null);
  const progress = useRef(0);
  const pointer = useRef({ x: 0, y: 0 });
  const [beat, setBeat] = useState(0);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const section = sectionRef.current;
      const sticky = stickyRef.current;
      if (!section || !sticky) return;
      const rect = section.getBoundingClientRect();
      const total = Math.max(1, rect.height - window.innerHeight);
      const p = clamp01(-rect.top / total);
      progress.current = p;
      document.documentElement.style.setProperty("--hero", String(1 - clamp01((p - 0.04) / 0.1)));
      // Captions leave before the dolly — no scrim fighting the blush zoom.
      sticky.style.setProperty("--caption", String(1 - clamp01((p - 0.56) / 0.12)));
      sticky.style.setProperty("--wipe", String(clamp01((p - 0.935) / 0.065)));
      const next = beatAt(p);
      setBeat((prev) => (prev === next ? prev : next));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const copy = useMemo(
    () => ({
      brand: "mdb+",
      tagline: t.hero.tagline,
      cta: t.hero.cta,
      nav: t.frameNav,
    }),
    [t],
  );

  return (
    <section className="void" id="top" ref={sectionRef} aria-label={t.introAria} data-surface="dark">
      <div
        className="void-sticky"
        ref={stickyRef}
        onPointerMove={(e) => {
          pointer.current = {
            x: (e.clientX / window.innerWidth) * 2 - 1,
            y: -((e.clientY / window.innerHeight) * 2 - 1),
          };
        }}
      >
        <div className="void-light" aria-hidden="true" />

        <div className="void-stage" aria-hidden="true">
          <Suspense fallback={null}>
            <BrowserScene progress={progress} pointer={pointer} wordRef={wordRef} copy={copy} />
          </Suspense>
        </div>

        <h1
          className="void-word"
          ref={(el) => {
            wordRef.current = el;
          }}
        >
          <span className="void-word-in">
            mdb<span className="plus">+</span>
          </span>
        </h1>

        <div className="void-beats">
          {BEATS.map((b, i) => (
            <div
              key={b.key}
              className={`beat${beat === i ? " is-active" : ""}`}
              aria-hidden={beat !== i}
              inert={beat !== i}
            >
              <h2>{t.beats[b.key].title}</h2>
              <p>{t.beats[b.key].text}</p>
              {b.key === "hero" && <EnterButton label={t.hero.cta} />}
            </div>
          ))}
        </div>

        <p className="void-hint" aria-hidden="true">
          {t.hero.scroll}
          <span />
        </p>

        <div className="void-wipe" aria-hidden="true" />
      </div>
    </section>
  );
}

export function VoidStage() {
  const reduced = useReducedMotion();
  const [webgl] = useState(hasWebGL);
  if (reduced) return <StaticFrame reason="reduced" />;
  if (!webgl) return <StaticFrame reason="nogl" />;
  return <PinnedIntro />;
}
