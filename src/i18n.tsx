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
    tagline: "Cute websites for cute businesses",
    cta: "Enter the work",
    scroll: "Scroll",
  },
  beats: {
    hero: { title: "Cute websites for cute businesses", text: "Make. Design. Build." },
    frame: { title: "Every site starts as a blank frame.", text: "Lines first. Decisions later." },
    type: { title: "Type that ships, not just a mock.", text: "The brand lands in the page." },
    color: { title: "Then the brand moves in.", text: "Color, rhythm, a point of view." },
    open: { title: "Step inside the work.", text: "Seven worlds, one studio." },
  } satisfies Record<BeatKey, { title: string; text: string }>,
  introAria: "A browser frame is drawn, typeset and painted as you scroll, then opens into the work",
  frameNav: ["Work", "Proof", "Services", "Contact"],
  work: {
    title: "Seven worlds, one studio.",
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
      items: { blush: "Blush", lilac: "Lilac", sage: "Sage", espresso: "Espresso" },
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
        id: "lumiere",
        name: "LUMIÈRE",
        proves: "Full ecommerce craft — filters, PDP, cart states.",
        why: "A theme ships components. It does not ship a quiet skincare rhythm.",
        metric: "Target: Lighthouse ≥ 90 · bilingual cart",
      },
      {
        id: "miga",
        name: "miga.",
        proves: "Scrollytelling + cake builder with shareable state.",
        why: "No Shopify theme syncs layer storytelling with live price and URL config.",
        metric: "Sticky + IntersectionObserver · reduced-motion safe",
      },
      {
        id: "muse",
        name: "MUSE",
        proves: "Editorial fashion composition.",
        why: "Lookbooks and grids that feel adult — not a product dump.",
        metric: "Editorial grids · bilingual shop",
      },
      {
        id: "casa",
        name: "CASA MARÉ",
        proves: "Atmosphere that shifts with the visitor’s hour.",
        why: "Templates do not change light with the day or ritualize booking errors.",
        metric: "Day / dusk / night tokens · booking validation",
      },
      {
        id: "mack",
        name: "MACK & CO.",
        proves: "Subscription UX with a strong pet brand.",
        why: "Recurring boxes need states, not just a pretty home.",
        metric: "Shop + subscribe flow",
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
        proves: "Ramen that comes apart layer by layer, then packs itself to go.",
        why: "No restaurant theme ties one scroll to a 3D bowl that explodes, reassembles and closes a box.",
        metric: "R3F sticky timeline · explode · box · WebGL fallback",
      },
    ],
  },
  services: {
    title: "Make. Design. Build.",
    items: [
      {
        word: "Make",
        name: "Custom interaction",
        text: "Scrollytelling, builders, 3D and motion systems a theme will never ship.",
      },
      {
        word: "Design",
        name: "Web design and UI / UX",
        text: "Type, color and rhythm — plus the parts people touch: carts, booking, empty states.",
      },
      {
        word: "Build",
        name: "Development",
        text: "React, TypeScript and interfaces that actually work on a phone.",
      },
    ],
  },
  about: {
    title: "A one-person studio for brands with taste.",
    text: "m.d.b. is Mariandrea Del Boccio — Make. Design. Build. Based in Barcelona, working worldwide. I make the kind of sites people save, share, and remember.",
    script: "good code, pretty things",
  },
  contact: {
    title: "Let’s make something soft and sharp.",
    text: "New shops, hotels, and brand sites. Tell me what you’re building.",
    email: "maridelboccio@gmail.com",
    cta: "Write to me",
    note: "Portfolio demos — replace with your real inbox when you go live.",
  },
  footer: {
    rights: "All rights reserved.",
    location: "Barcelona / Worldwide",
  },
  projects: {
    lumiere: {
      category: "Skincare",
      blurb: "Cream and blush. A quiet shop with filters, product pages, and a cart.",
    },
    miga: {
      category: "Bakery",
      blurb: "Layered scrollytelling and a cake builder — story and shop in one scroll.",
    },
    muse: {
      category: "Boutique",
      blurb: "Editorial fashion. Less cute, more still — lookbooks and new arrivals.",
    },
    casa: {
      category: "Hotel",
      blurb: "Light that shifts with the hour. Rooms, gallery, and a ritual booking bar.",
    },
    mack: {
      category: "Pets",
      blurb: "Accessories, treats, toys — and a monthly subscription box.",
    },
    brasa: {
      category: "Ceramics",
      blurb: "A mug you drag to spin. Glazes a template cannot fake.",
    },
    kai: {
      category: "Ramen bar",
      blurb: "The bowl comes apart, comes back together and shuts itself in a box. A template cannot fake it.",
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
    tagline: "webs bonitas para negocios bonitos",
    cta: "Entrar al trabajo",
    scroll: "Scroll",
  },
  beats: {
    hero: { title: "Webs bonitas para negocios bonitos", text: "Make. Design. Build." },
    frame: { title: "Toda web empieza en un marco en blanco.", text: "Primero las líneas. Las decisiones, después." },
    type: { title: "Tipografía que llega a producción, no solo al mock.", text: "La marca aterriza en la página." },
    color: { title: "Y entonces entra la marca.", text: "Color, ritmo, un punto de vista." },
    open: { title: "Entra al trabajo.", text: "Siete mundos, un estudio." },
  },
  introAria: "Un marco de navegador se dibuja, se compone y se pinta con el scroll, y luego se abre al trabajo",
  frameNav: ["Trabajo", "Pruebas", "Servicios", "Contacto"],
  work: {
    title: "Siete mundos, un estudio.",
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
      items: { blush: "Rosa", lilac: "Lila", sage: "Salvia", espresso: "Espresso" },
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
        id: "lumiere",
        name: "LUMIÈRE",
        proves: "Ecommerce completo — filtros, PDP, estados de carrito.",
        why: "Un tema envía componentes. No envía el ritmo quieto de un skincare.",
        metric: "Objetivo: Lighthouse ≥ 90 · carrito bilingüe",
      },
      {
        id: "miga",
        name: "miga.",
        proves: "Scrollytelling + configurador con estado compartible.",
        why: "Ningún tema sincroniza capas narradas con precio en vivo y URL.",
        metric: "Sticky + IntersectionObserver · reduced-motion",
      },
      {
        id: "muse",
        name: "MUSE",
        proves: "Composición editorial de moda.",
        why: "Lookbooks y grids adultos — no un catálogo tirado.",
        metric: "Grids editoriales · shop bilingüe",
      },
      {
        id: "casa",
        name: "CASA MARÉ",
        proves: "Atmósfera que cambia con la hora del visitante.",
        why: "Las plantillas no cambian la luz del día ni ritualizan la reserva.",
        metric: "Tokens día / atardecer / noche · validación",
      },
      {
        id: "mack",
        name: "MACK & CO.",
        proves: "UX de suscripción con marca pet fuerte.",
        why: "Una caja recurrente necesita estados, no solo un home bonito.",
        metric: "Flujo shop + subscribe",
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
        proves: "Ramen que se desarma capa a capa y se empaqueta solo para llevar.",
        why: "Ningún tema de restaurante enlaza un scroll con un bowl 3D que explota, se rearma y cierra una caja.",
        metric: "Timeline R3F sticky · explode · caja · fallback WebGL",
      },
    ],
  },
  services: {
    title: "Make. Design. Build.",
    items: [
      {
        word: "Make",
        name: "Interacción a medida",
        text: "Scrollytelling, configuradores, 3D y sistemas de motion que un tema no envía.",
      },
      {
        word: "Design",
        name: "Diseño web y UI / UX",
        text: "Tipo, color y ritmo — y lo que la gente toca: carritos, reservas, estados vacíos.",
      },
      {
        word: "Build",
        name: "Desarrollo",
        text: "React, TypeScript e interfaces que de verdad funcionan en el móvil.",
      },
    ],
  },
  about: {
    title: "Un estudio de una persona para marcas con gusto.",
    text: "m.d.b. es Mariandrea Del Boccio — Make. Design. Build. Desde Barcelona, para cualquier sitio. Hago el tipo de páginas que la gente guarda, comparte y recuerda.",
    script: "good code, pretty things",
  },
  contact: {
    title: "Hagamos algo suave y preciso.",
    text: "Tiendas nuevas, hoteles y sitios de marca. Cuéntame qué estás construyendo.",
    email: "maridelboccio@gmail.com",
    cta: "Escríbeme",
    note: "Demos de portfolio — cambia esto por tu correo real cuando publiques.",
  },
  footer: {
    rights: "Todos los derechos reservados.",
    location: "Barcelona / Worldwide",
  },
  projects: {
    lumiere: {
      category: "Skincare",
      blurb: "Crema y rosa. Una tienda quieta con filtros, fichas y carrito.",
    },
    miga: {
      category: "Pastelería",
      blurb: "Scrollytelling por capas y un configurador de pastel — historia y compra en un solo scroll.",
    },
    muse: {
      category: "Boutique",
      blurb: "Moda editorial. Menos cute, más still — lookbooks y novedades.",
    },
    casa: {
      category: "Hotel",
      blurb: "Luz que cambia con la hora. Habitaciones, galería y una reserva como ritual.",
    },
    mack: {
      category: "Mascotas",
      blurb: "Accesorios, snacks, juguetes — y una caja de suscripción mensual.",
    },
    brasa: {
      category: "Cerámica",
      blurb: "Una taza que arrastras para girar. Esmaltes que una plantilla no finge.",
    },
    kai: {
      category: "Ramen bar",
      blurb: "El bowl se desarma, se vuelve a armar y se cierra solo en una caja. Una plantilla no lo finge.",
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
  const saved = window.localStorage.getItem("mdb-lang");
  if (saved === "en" || saved === "es") return saved;
  return navigator.language.toLowerCase().startsWith("es") ? "es" : "en";
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(readLang);

  const setLang = (next: Lang) => {
    window.localStorage.setItem("mdb-lang", next);
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
