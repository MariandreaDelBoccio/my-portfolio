import { useEffect, useState } from "react";
import { Chapters } from "./components/Chapters";
import { Playground } from "./components/Playground";
import { WorkStage } from "./components/WorkStage";
import { VoidStage } from "./components/void/VoidStage";
import { scrollToId, useHdrTone, useLenis, useReducedMotion } from "./hooks";
import { useI18n } from "./i18n";

const navIds = ["work", "play", "proof", "services", "about", "contact"] as const;

export function App() {
  const { t, lang, setLang } = useI18n();
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(false);
  useLenis(!reduced);
  useHdrTone();

  useEffect(() => {
    document.body.classList.toggle("menu-open", open);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    window.setTimeout(() => scrollToId(id), open ? 60 : 0);
  };

  return (
    <div className="page">
      <div className="grain" aria-hidden="true" />

      <header className="hdr">
        <a className="mark" href="#top" onClick={go("top")} aria-label="mdb+">
          mdb<span className="plus">+</span>
        </a>
        <nav className="hdr-nav" aria-label="Primary">
          {navIds.map((id) => (
            <a key={id} href={`#${id}`} onClick={go(id)}>
              {t.nav[id]}
            </a>
          ))}
        </nav>
        <div className="hdr-end">
          <div className="lang" role="group" aria-label={t.langLabel}>
            {(["es", "en"] as const).map((l) => (
              <button
                key={l}
                type="button"
                className={lang === l ? "on" : ""}
                aria-pressed={lang === l}
                onClick={() => setLang(l)}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
          <button
            type="button"
            className="menu-btn"
            aria-expanded={open}
            aria-controls="menu-sheet"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? t.menu.close : t.menu.open}
          </button>
        </div>
      </header>

      <div className={`menu-sheet${open ? " is-open" : ""}`} id="menu-sheet" inert={!open}>
        <nav aria-label="Menu">
          {navIds.map((id) => (
            <a key={id} href={`#${id}`} onClick={go(id)}>
              {t.nav[id]}
            </a>
          ))}
        </nav>
      </div>

      <main>
        <VoidStage />
        <WorkStage />
        <Playground />
        <Chapters />
      </main>

      <footer className="foot" data-surface="dark">
        <span className="mark small">
          mdb<span className="plus">+</span>
        </span>
        <p>
          © {new Date().getFullYear()} m.d.b. {t.footer.rights}
        </p>
        <p>{t.footer.location}</p>
      </footer>
    </div>
  );
}
