import { useEffect, useRef, type PointerEvent as ReactPointerEvent } from "react";
import { projects, type ProjectId } from "../data";
import { useI18n } from "../i18n";
import { useReducedMotion } from "../hooks";

function useReveal() {
  const root = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    document.documentElement.classList.add("reveal-ready");
    const nodes = Array.from(el.querySelectorAll<HTMLElement>("[data-reveal]"));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0.08 },
    );
    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, []);
  return root;
}

function ProjectTile({
  href,
  name,
  number,
  category,
  image,
  openLabel,
  reduced,
  delay,
}: {
  href: string;
  name: string;
  number: string;
  category: string;
  image: string;
  openLabel: string;
  reduced: boolean;
  delay: number;
}) {
  const media = useRef<HTMLSpanElement>(null);
  const img = useRef<HTMLImageElement>(null);
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const raf = useRef(0);

  useEffect(() => {
    if (reduced) return;
    const tick = () => {
      current.current.x += (target.current.x - current.current.x) * 0.12;
      current.current.y += (target.current.y - current.current.y) * 0.12;
      if (img.current) {
        const hovering = Math.hypot(target.current.x, target.current.y) > 0.2;
        const s = hovering ? 1.02 : 1;
        img.current.style.transform = `translate3d(${current.current.x.toFixed(2)}px, ${current.current.y.toFixed(2)}px, 0) scale(${s})`;
      }
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [reduced]);

  const onMove = (e: ReactPointerEvent<HTMLAnchorElement>) => {
    if (reduced || !media.current) return;
    const r = media.current.getBoundingClientRect();
    const nx = ((e.clientX - r.left) / r.width - 0.5) * 2;
    const ny = ((e.clientY - r.top) / r.height - 0.5) * 2;
    target.current = { x: nx * 6, y: ny * 4 };
  };

  const onLeave = () => {
    target.current = { x: 0, y: 0 };
  };

  return (
    <a
      className="feat"
      href={href}
      target="_blank"
      rel="noreferrer"
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      data-reveal="rise"
      style={{ transitionDelay: `${delay}ms` }}
      aria-label={`${openLabel}: ${name}`}
    >
      <span className="feat-media" ref={media}>
        <img ref={img} src={image} alt="" draggable={false} loading="lazy" />
      </span>
      <span className="feat-meta">
        <span className="feat-tags">
          <span className="feat-num">{number}</span>
          <span aria-hidden>·</span>
          <span>{category}</span>
        </span>
        <span className="feat-title">
          <span className="feat-arrow" aria-hidden>
            →
          </span>
          <span className="feat-name">{name}</span>
        </span>
      </span>
    </a>
  );
}

export function WorkStage() {
  const { t } = useI18n();
  const reduced = useReducedMotion();
  const root = useReveal();

  useEffect(() => {
    projects.forEach((p) => {
      const img = new Image();
      img.src = p.image;
    });
  }, []);

  return (
    <section id="work" className="work" data-surface="light" ref={root}>
      <header className="work-head" data-reveal="rise">
        <h2>{t.work.title}</h2>
      </header>

      <div className="feat-grid">
        {projects.map((project, i) => {
          const copy = t.projects[project.id as ProjectId];
          return (
            <ProjectTile
              key={project.id}
              href={project.href}
              name={project.name}
              number={project.number}
              category={copy.category}
              image={project.image}
              openLabel={t.work.open}
              reduced={reduced}
              delay={i * 40}
            />
          );
        })}
      </div>
    </section>
  );
}
