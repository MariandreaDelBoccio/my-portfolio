import { useEffect } from "react";
import { useI18n } from "../i18n";

function useReveal() {
  useEffect(() => {
    const root = document.documentElement;
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (!("IntersectionObserver" in window)) return;
    root.classList.add("reveal-ready");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.05 },
    );
    els.forEach((el) => io.observe(el));
    return () => {
      io.disconnect();
      root.classList.remove("reveal-ready");
    };
  }, []);
}

const HL = ["blush", "lilac", "sage"] as const;

export function Chapters() {
  const { t } = useI18n();
  useReveal();

  return (
    <>
      <section className="proof" id="proof" data-surface="light">
        <div className="proof-head">
          <h2 data-reveal="rise">{t.proof.title}</h2>
          <p className="lead" data-reveal="rise">
            {t.proof.lead}
          </p>
        </div>
        <ul className="proof-list">
          {t.proof.items.map((item) => (
            <li key={item.id} className="proof-row" data-reveal="hair">
              <h3>{item.name}</h3>
              <div className="proof-body">
                <p className="proves">{item.proves}</p>
                <p className="why">{item.why}</p>
              </div>
              <p className="metric">{item.metric}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="make" id="services" data-surface="light">
        <h2 className="sr-only">{t.services.title}</h2>
        <ol className="make-list">
          {t.services.items.map((item, i) => (
            <li key={item.word} className="make-row" data-reveal="hair">
              <span className={`make-word hl-${HL[i]}`} data-reveal="rise">
                {item.word}
              </span>
              <div className="make-body">
                <h3>{item.name}</h3>
                <p>{item.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="about" id="about" data-surface="light">
        <h2 data-reveal="rise">{t.about.title}</h2>
        <div className="about-side">
          <p>{t.about.text}</p>
          <p className="script" lang="en">
            {t.about.script}
          </p>
        </div>
      </section>

      <section className="contact" id="contact" data-surface="dark">
        <h2 data-reveal="rise">{t.contact.title}</h2>
        <p className="lead">{t.contact.text}</p>
        <a className="btn blush" href={`mailto:${t.contact.email}`}>
          {t.contact.cta}
        </a>
        <p className="contact-mail">{t.contact.email}</p>
        <p className="note">{t.contact.note}</p>
      </section>
    </>
  );
}
