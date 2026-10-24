import { useState } from "react";
import { useI18n } from "../i18n";

const PALETTES = ["blush", "lilac", "sage", "espresso"] as const;
const TYPES = ["soft", "fine", "grotesk"] as const;
const SHAPES = ["sharp", "soft", "pill"] as const;

type Palette = (typeof PALETTES)[number];
type Type = (typeof TYPES)[number];
type Shape = (typeof SHAPES)[number];

const TYPE_FONT: Record<Type, string> = {
  soft: '"Fraunces", Georgia, serif',
  fine: '"Instrument Serif", Georgia, serif',
  grotesk: '"Bricolage Grotesque", "Manrope", system-ui, sans-serif',
};

const pick = <T,>(list: readonly T[]) => list[Math.floor(Math.random() * list.length)];

function slugOf(name: string) {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

type GroupProps<T extends string> = {
  name: string;
  legend: string;
  value: T;
  options: readonly T[];
  labels: Record<T, string>;
  onChange: (v: T) => void;
  kind: "swatch" | "chip";
  glyph: (v: T) => React.ReactNode;
};

function Group<T extends string>({
  name,
  legend,
  value,
  options,
  labels,
  onChange,
  kind,
  glyph,
}: GroupProps<T>) {
  return (
    <fieldset className="play-group">
      <legend>{legend}</legend>
      <div
        className={`play-opts ${kind}`}
        style={{ ["--n" as string]: options.length }}
      >
        {options.map((o) => (
          <label key={o} className="play-opt">
            <input
              type="radio"
              name={name}
              value={o}
              checked={value === o}
              onChange={() => onChange(o)}
            />
            {glyph(o)}
            <span className="lbl">{labels[o]}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function Cup() {
  return (
    <svg
      className="cafe-cup"
      viewBox="0 0 200 230"
      aria-hidden="true"
      focusable="false"
    >
      <path
        className="steam"
        d="M82 58c-9-10 9-17 0-30M104 62c-9-10 9-17 0-30M126 58c-9-10 9-17 0-30"
      />
      <ellipse className="saucer" cx="100" cy="196" rx="76" ry="12" />
      <path className="handle" d="M152 114h8a20 20 0 0 1 0 40h-12" />
      <path className="cup" d="M44 98h112v30c0 34-25 60-56 60s-56-26-56-60z" />
      <ellipse className="coffee" cx="100" cy="98" rx="56" ry="10" />
      <path
        className="latte"
        d="M100 102c-10-5-8-10-3-8 2 1 3 2 3 2s1-1 3-2c5-2 7 3-3 8z"
      />
    </svg>
  );
}

export function Playground() {
  const { t } = useI18n();
  const p = t.play;

  const [palette, setPalette] = useState<Palette>("blush");
  const [type, setType] = useState<Type>("soft");
  const [shape, setShape] = useState<Shape>("soft");
  const [raw, setRaw] = useState("");

  const name = raw.trim() || p.defaultName;
  const slug = slugOf(name) || slugOf(p.defaultName);

  const recipe = `${p.palette.items[palette]} · ${p.type.items[type]} · ${p.shape.items[shape]}`;

  const shuffle = () => {
    let np = palette;
    let nt = type;
    let ns = shape;
    while (np === palette && nt === type && ns === shape) {
      np = pick(PALETTES);
      nt = pick(TYPES);
      ns = pick(SHAPES);
    }
    setPalette(np);
    setType(nt);
    setShape(ns);
  };

  const body = [
    p.mail.hello,
    "",
    `${p.name.label}: ${name}`,
    `${p.palette.label}: ${p.palette.items[palette]}`,
    `${p.type.label}: ${p.type.items[type]}`,
    `${p.shape.label}: ${p.shape.items[shape]}`,
  ].join("\n");
  const mailto = `mailto:${t.contact.email}?subject=${encodeURIComponent(p.mail.subject)}&body=${encodeURIComponent(body)}`;

  return (
    <section className="play" id="play" data-surface="light">
      <div className="play-head">
        <h2 data-reveal="rise">{p.title}</h2>
        <p className="lead" data-reveal="rise">
          {p.lead}
        </p>
      </div>

      <div className="play-stage">
        <div className="play-frame" role="img" aria-label={p.frameAria}>
          <div className="play-bar" aria-hidden="true">
            <i />
            <i />
            <i />
            <span className="play-url">{slug}.cafe</span>
          </div>

          <div
            className="cafe"
            data-palette={palette}
            data-type={type}
            data-shape={shape}
            aria-hidden="true"
          >
            <div className="cafe-nav">
              <span className="cafe-mark" key={`m-${type}`}>
                {name}
              </span>
              <span className="cafe-links">
                {p.cafe.nav.map((n) => (
                  <span key={n}>{n}</span>
                ))}
              </span>
              <span className="cafe-btn sm">{p.cafe.order}</span>
            </div>

            <div className="cafe-hero">
              <div className="cafe-copy">
                <p className="cafe-open">{p.cafe.open}</p>
                <p className="cafe-hl" key={`h-${type}`}>
                  {p.cafe.hl}
                </p>
                <p className="cafe-sub">{p.cafe.sub}</p>
                <span className="cafe-btn">{p.cafe.cta}</span>
              </div>
              <div className="cafe-art">
                <Cup />
              </div>
            </div>

            <ul className="cafe-menu">
              {p.cafe.menu.map((m) => (
                <li key={m.name}>
                  <span>{m.name}</span>
                  <span className="price">{m.price}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="play-controls">
        <div className="play-group">
          <label className="play-label" htmlFor="play-name">
            {p.name.label}
          </label>
          <input
            id="play-name"
            className="play-input"
            type="text"
            value={raw}
            maxLength={16}
            autoComplete="off"
            spellCheck={false}
            placeholder={p.name.placeholder}
            onChange={(e) => setRaw(e.target.value)}
          />
        </div>

        <Group
          name="play-palette"
          legend={p.palette.label}
          value={palette}
          options={PALETTES}
          labels={p.palette.items}
          onChange={setPalette}
          kind="swatch"
          glyph={(v) => <span className="dot" data-p={v} />}
        />

        <Group
          name="play-type"
          legend={p.type.label}
          value={type}
          options={TYPES}
          labels={p.type.items}
          onChange={setType}
          kind="chip"
          glyph={(v) => (
            <span className="aa" style={{ fontFamily: TYPE_FONT[v] }} aria-hidden="true">
              Aa
            </span>
          )}
        />

        <Group
          name="play-shape"
          legend={p.shape.label}
          value={shape}
          options={SHAPES}
          labels={p.shape.items}
          onChange={setShape}
          kind="chip"
          glyph={(v) => <span className="glyph" data-s={v} aria-hidden="true" />}
        />

        <div className="play-actions">
          <p className="play-recipe" aria-live="polite">
            <span>{p.recipe}</span>
            {recipe}
          </p>
          <div className="play-buttons">
            <button type="button" className="btn ghost" onClick={shuffle}>
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M12 2c.6 5.4 4.6 9.4 10 10-5.4.6-9.4 4.6-10 10-.6-5.4-4.6-9.4-10-10 5.4-.6 9.4-4.6 10-10z" />
              </svg>
              {p.shuffle}
            </button>
            <a className="btn ink" href={mailto}>
              {p.cta}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
