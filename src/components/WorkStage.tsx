import { useEffect, useState } from "react";
import { projects, type ProjectId } from "../data";
import { useI18n } from "../i18n";
import { useReducedMotion } from "../hooks";

function easeOut(t: number) {
  return 1 - (1 - t) * (1 - t);
}

function clamp01(n: number) {
  return Math.min(1, Math.max(0, n));
}

function useMobile() {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const sync = () =>
      setMobile(window.matchMedia("(max-width: 720px)").matches);
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, []);
  return mobile;
}

export function WorkStage() {
  const { t } = useI18n();
  const reduced = useReducedMotion();
  const mobile = useMobile();
  const [pinEl, setPinEl] = useState<HTMLDivElement | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!pinEl) return;
    const onScroll = () => {
      const rect = pinEl.getBoundingClientRect();
      const total = pinEl.offsetHeight - window.innerHeight;
      setProgress(clamp01(-rect.top / Math.max(1, total)));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pinEl]);

  useEffect(() => {
    projects.forEach((p) => {
      const img = new Image();
      img.src = p.image;
    });
  }, []);

  const count = projects.length;
  const raw = progress * count;
  const active = Math.min(count - 1, Math.floor(raw));
  const local = raw - active;
  const pinHeight = Math.max(220, count * (mobile ? 100 : 110));

  return (
    <section id="work" className="work-reel" data-surface="dark">
      <div
        className="work-reel-pin"
        ref={setPinEl}
        style={{ height: `${pinHeight}vh` }}
      >
        <div className="work-reel-sticky">
          {projects.map((project, i) => {
            const distance = raw - i;
            const isActive = i === active;
            const enter = clamp01(1 - Math.abs(distance));
            const opacity =
              Math.abs(distance) > 1.05
                ? 0
                : isActive
                  ? 1
                  : distance > 0
                    ? clamp01(1 - distance) * 0.45
                    : clamp01(1 + distance);
            const scale = reduced
              ? 1
              : isActive
                ? 1.04 - easeOut(local) * 0.04
                : 1.06;
            const y = reduced ? 0 : clamp01(Math.abs(distance)) * (distance > 0 ? 6 : -4);
            const copy = t.projects[project.id as ProjectId];

            return (
              <article
                key={project.id}
                className={`work-reel-slide tone-${project.tone}${isActive ? " is-active" : ""}`}
                style={{
                  opacity,
                  zIndex: isActive ? 3 : Math.max(0, 2 - Math.round(Math.abs(distance))),
                  pointerEvents: isActive ? "auto" : "none",
                }}
                aria-hidden={!isActive}
              >
                <div
                  className="work-reel-media"
                  style={{
                    transform: `translate3d(0, ${y}vh, 0) scale(${scale})`,
                  }}
                >
                  <img
                    src={project.image}
                    alt=""
                    draggable={false}
                    loading={i === 0 ? "eager" : "lazy"}
                  />
                  <div className="work-reel-grade" aria-hidden />
                </div>

                <div
                  className="work-reel-copy"
                  style={{
                    opacity: isActive ? clamp01(0.25 + enter * 0.85) : 0,
                    transform: isActive
                      ? `translate3d(0, ${(1 - enter) * 24}px, 0)`
                      : "translate3d(0, 28px, 0)",
                  }}
                >
                  <h2 className="work-reel-name">{project.name}</h2>
                  <p className="work-reel-cat">{copy.category}</p>
                  <p className="work-reel-blurb">{copy.blurb}</p>
                  <span
                    className="work-reel-cta is-soon"
                    aria-disabled="true"
                  >
                    {t.work.open}
                  </span>
                </div>
              </article>
            );
          })}

          <aside className="work-reel-rail" aria-hidden>
            <p className="work-reel-rail-title">{t.work.title}</p>
            <ol className="work-reel-index">
              {projects.map((project, i) => (
                <li key={project.id} className={i === active ? "is-on" : ""}>
                  <span>{project.number}</span>
                  <em>{project.name}</em>
                </li>
              ))}
            </ol>
          </aside>

          <div className="work-reel-progress" aria-hidden>
            <i style={{ width: `${progress * 100}%` }} />
          </div>
        </div>
      </div>
    </section>
  );
}
