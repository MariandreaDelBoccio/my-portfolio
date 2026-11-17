import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Lang = "en" | "es";
export type BeatKey = "hero" | "frame" | "type" | "color" | "open";

const en = {
  nav: {
    work: "Work",
    play: "Try",
    proof: "Proof",
    services: "Services",
    about: "About",
    contact: "Contact",
  },
  menu: { open: "Menu", close: "Close" },
  langLabel: "Language",
  hero: {
    tagline: "Quiet digital spaces.",
    cta: "Enter the work",
    scroll: "Scroll",
  },
  beats: {
    hero: { title: "Quiet digital spaces.", text: "Design · Build · Detail · Harmony" },
    frame: { title: "Every site starts as a blank frame.", text: "Lines first. Decisions later." },
    type: { title: "Type that ships, not just a mock.", text: "The brand lands in the page." },
    color: { title: "Then the brand moves in.", text: "Color, rhythm, a point of view." },
    open: { title: "Step inside the work.", text: "Three worlds, one studio." },
  } satisfies Record<BeatKey, { title: string; text: string }>,
  introAria: "A browser frame is drawn, typeset and painted as you scroll, then opens into the work",
  frameNav: ["Work", "Proof", "Services", "Contact"],
  work: {
    title: "Three worlds, one studio.",
    open: "Enter",
  },
  play: {
    title: "Make it yours. Right here.",
    lead: "A café site, four choices. Every combination holds together.",
    frameAria: "Live preview of a café website",
    defaultName: "Pocillo",
    name: { label: "Café name", placeholder: "Pocillo" },
    palette: {
      label: "Palette",
      items: { cream: "Cream", stone: "Stone", burgundy: "Burgundy", espresso: "Espresso" },
    },
    type: {
      label: "Type",
      items: { soft: "Soft serif", fine: "Fine serif", grotesk: "Grotesk" },
    },
    shape: {
      label: "Shape",
      items: { sharp: "Sharp", soft: "Soft", pill: "Pill" },
    },
    shuffle: "Surprise me",
    recipe: "Your pick",
    cta: "I want this look",
    mail: {
      subject: "A site with this look",
      hello: "Hi Mariandrea, I'd like a site with this look:",
    },
    cafe: {
      nav: ["Menu", "Visit", "Beans"],
      order: "Order",
      open: "Open today · 8–17h",
      hl: "Slow mornings, good coffee.",
      sub: "Specialty roasts and warm pastry, two minutes from the metro.",
      cta: "Order ahead",
      menu: [
        { name: "Cortado", price: "€2.80" },
        { name: "Flat white", price: "€3.40" },
        { name: "Croissant", price: "€2.60" },
      ],
    },
  },
  proof: {
    title: "What each piece proves.",
    lead: "Pretty is easy to prompt. Interaction with taste is not.",
    items: [
      {
        id: "miga",
        name: "miga.",
        proves: "Scrollytelling + cake builder with shareable state.",
        why: "No Shopify theme syncs layer storytelling with live price and URL config.",
        metric: "Sticky + IntersectionObserver · reduced-motion safe",
      },
      {
        id: "brasa",
        name: "BRASA",
        proves: "Drag-to-spin ceramic mug with live glazes.",
        why: "A theme cannot let you rotate clay or swap glaze live.",
        metric: "R3F lathe mug · mouse/touch · WebGL fallback",
      },
      {
        id: "kai",
        name: "KAI",
        proves: "Ramen that comes apart layer by layer, then gets served at the counter under a lantern.",
        why: "No restaurant theme ties one scroll to a 3D bowl that explodes, reassembles and ends lit by a paper lantern.",
        metric: "R3F sticky timeline · explode · counter · lantern · WebGL fallback",
      },
    ],
  },
  services: {
    title: "Design · Build · Detail · Harmony",
    items: [
      {
        word: "Design",
        name: "Web design and UI / UX",
        text: "Type, color and rhythm — and the parts people touch: carts, booking, empty states.",
      },
      {
        word: "Build",
        name: "Development",
        text: "React, TypeScript and interfaces that actually work on a phone.",
      },
      {
        word: "Detail",
        name: "Custom interaction",
        text: "Scrollytelling, builders, 3D and motion systems a theme will never ship.",
      },
    ],
  },
  about: {
    title: "A one-person studio for brands with presence.",
    text: "AUREA is Mariandrea Del Boccio. Based in Barcelona, working worldwide. I design and build digital spaces with quiet weight — the kind people stay with.",
    script: "Quiet digital spaces.",
  },
  contact: {
    title: "Let’s make something lasting.",
    text: "New shops, hotels, and brand sites. Tell me what you’re building.",
    email: "hello@mdb.studio",
    cta: "Write to me",
    note: "Portfolio demos — replace with your real inbox when you go live.",
  },
  footer: {
    rights: "All rights reserved.",
    location: "Barcelona / Worldwide",
  },
  projects: {
    miga: {
      category: "Bakery",
      blurb: "Layered scrollytelling and a cake builder — story and shop in one scroll.",
    },
    brasa: {
      category: "Ceramics",
      blurb: "A mug you drag to spin. Glazes a template cannot fake.",
    },
    kai: {
      category: "Ramen bar",
      blurb: "The bowl comes apart, comes back together and lands on a counter under a lantern that lights up. A template cannot fake it.",
    },
  },
};

const es: typeof en = {
  nav: {
    work: "Trabajo",
    play: "Prueba",
    proof: "Pruebas",
    services: "Servicios",
    about: "Estudio",
    contact: "Contacto",
  },
  menu: { open: "Menú", close: "Cerrar" },
  langLabel: "Idioma",
  hero: {
    tagline: "Espacios digitales serenos.",
    cta: "Entrar al trabajo",
    scroll: "Scroll",
  },
  beats: {
    hero: { title: "Espacios digitales serenos.", text: "Diseño · Construcción · Detalle · Armonía" },
    frame: { title: "Toda web empieza en un marco en blanco.", text: "Primero las líneas. Las decisiones, después." },
    type: { title: "Tipografía que llega a producción, no solo al mock.", text: "La marca aterriza en la página." },
    color: { title: "Y entonces entra la marca.", text: "Color, ritmo, un punto de vista." },
    open: { title: "Entra al trabajo.", text: "Tres mundos, un estudio." },
  },
  introAria: "Un marco de navegador se dibuja, se compone y se pinta con el scroll, y luego se abre al trabajo",
  frameNav: ["Trabajo", "Pruebas", "Servicios", "Contacto"],
  work: {
    title: "Tres mundos, un estudio.",
    open: "Entrar",
  },
  play: {
    title: "Hazla tuya. Aquí mismo.",
    lead: "Una web de cafetería, cuatro decisiones. Todas las combinaciones funcionan.",
    frameAria: "Vista previa en vivo de la web de una cafetería",
    defaultName: "Pocillo",
    name: { label: "Nombre del café", placeholder: "Pocillo" },
    palette: {
      label: "Paleta",
      items: { cream: "Crema", stone: "Piedra", burgundy: "Burdeos", espresso: "Espresso" },
    },
    type: {
      label: "Tipografía",
      items: { soft: "Serif suave", fine: "Serif fina", grotesk: "Grotesca" },
    },
    shape: {
      label: "Forma",
      items: { sharp: "Recta", soft: "Suave", pill: "Píldora" },
    },
    shuffle: "Sorpréndeme",
    recipe: "Tu elección",
    cta: "Quiero este look",
    mail: {
      subject: "Una web con este look",
      hello: "Hola Mariandrea, me gustaría una web con este look:",
    },
    cafe: {
      nav: ["Carta", "Visítanos", "Granos"],
      order: "Pedir",
      open: "Abierto hoy · 8–17 h",
      hl: "Mañanas lentas, buen café.",
      sub: "Tuestes de especialidad y bollería caliente, a dos pasos del metro.",
      cta: "Pide y recoge",
      menu: [
        { name: "Cortado", price: "2,80 €" },
        { name: "Flat white", price: "3,40 €" },
        { name: "Croissant", price: "2,60 €" },
      ],
    },
  },
  proof: {
    title: "Lo que cada pieza demuestra.",
    lead: "Lo bonito se puede pedir a una IA. La interacción con criterio, no.",
    items: [
      {
        id: "miga",
        name: "miga.",
        proves: "Scrollytelling + configurador con estado compartible.",
        why: "Ningún tema sincroniza capas narradas con precio en vivo y URL.",
        metric: "Sticky + IntersectionObserver · reduced-motion",
      },
      {
        id: "brasa",
        name: "BRASA",
        proves: "Taza 3D que giras con el ratón y esmaltes en vivo.",
        why: "Un tema no deja rotar barro ni cambiar esmalte en vivo.",
        metric: "Taza R3F · mouse/touch · fallback WebGL",
      },
      {
        id: "kai",
        name: "KAI",
        proves: "Ramen que se desarma capa a capa y termina servido en la barra bajo un farol.",
        why: "Ningún tema de restaurante enlaza un scroll con un bowl 3D que explota, se rearma y termina bajo un farol encendido.",
        metric: "Timeline R3F sticky · explode · barra · farol · fallback WebGL",
      },
    ],
  },
  services: {
    title: "Diseño · Construcción · Detalle · Armonía",
    items: [
      {
        word: "Diseño",
        name: "Diseño web y UI / UX",
        text: "Tipo, color y ritmo — y lo que la gente toca: carritos, reservas, estados vacíos.",
      },
      {
        word: "Construcción",
        name: "Desarrollo",
        text: "React, TypeScript e interfaces que de verdad funcionan en el móvil.",
      },
      {
        word: "Detalle",
        name: "Interacción a medida",
        text: "Scrollytelling, configuradores, 3D y sistemas de motion que un tema no envía.",
      },
    ],
  },
  about: {
    title: "Un estudio de una persona para marcas con presencia.",
    text: "AUREA es Mariandrea Del Boccio. Desde Barcelona, para cualquier sitio. Diseño y construyo espacios digitales con peso sereno — del tipo en el que la gente se queda.",
    script: "Espacios digitales serenos.",
  },
  contact: {
    title: "Hagamos algo que dure.",
    text: "Tiendas nuevas, hoteles y sitios de marca. Cuéntame qué estás construyendo.",
    email: "hello@mdb.studio",
    cta: "Escríbeme",
    note: "Demos de portfolio — cambia esto por tu correo real cuando publiques.",
  },
  footer: {
    rights: "Todos los derechos reservados.",
    location: "Barcelona / Worldwide",
  },
  projects: {
    miga: {
      category: "Pastelería",
      blurb: "Scrollytelling por capas y un configurador de pastel — historia y compra en un solo scroll.",
    },
    brasa: {
      category: "Cerámica",
      blurb: "Una taza que arrastras para girar. Esmaltes que una plantilla no finge.",
    },
    kai: {
      category: "Ramen bar",
      blurb: "El bowl se desarma, se vuelve a armar y aterriza en una barra bajo un farol que se enciende. Una plantilla no lo finge.",
    },
  },
};

const dicts = { en, es };

type I18nValue = {
  lang: Lang;
  t: typeof en;
  setLang: (lang: Lang) => void;
};

const I18nContext = createContext<I18nValue | null>(null);

function readLang(): Lang {
  if (typeof window === "undefined") return "es";
  const saved = window.localStorage.getItem("aurea-lang");
  if (saved === "en" || saved === "es") return saved;
  return navigator.language.toLowerCase().startsWith("es") ? "es" : "en";
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(readLang);

  const setLang = (next: Lang) => {
    window.localStorage.setItem("aurea-lang", next);
    setLangState(next);
  };

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const value = useMemo(() => ({ lang, t: dicts[lang], setLang }), [lang]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside I18nProvider");
  return ctx;
}
