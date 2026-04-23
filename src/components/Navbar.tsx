import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const { i18n, t } = useTranslation();

  const navItems = t("navbar.items", { returnObjects: true }) as {
    href: string;
    label: string;
  }[];

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50);
      const sections = navItems.map((i) => i.href.slice(1));
      for (const id of [...sections].reverse()) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top < 200) {
          setActiveSection(id);
          break;
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [i18n.language]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "glass-strong py-3" : "py-6"}`}
    >
      <div className="container mx-auto flex items-center justify-between px-6">
        <a
          href="#hero"
          className="font-display text-xl font-bold tracking-tight text-foreground"
        >
          Mariandrea<span className="text-gradient">.dev</span>
        </a>
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`text-sm font-medium transition-colors duration-300 ${
                activeSection === item.href.slice(1)
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {item.label}
            </a>
          ))}
        </div>
        <div>
          <a
            href="#contact"
            className="hidden md:inline-flex items-center gap-2 rounded-full bg-gradient-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:opacity-90 hover:scale-105"
          >
            Hablemos
          </a>
          <button
            onClick={() =>
              i18n.changeLanguage(i18n.language === "es" ? "en" : "es")
            }
            className="ml-4 hidden md:inline-flex items-center gap-2 rounded-full bg-gradient-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:opacity-90 hover:scale-105"
          >
            {i18n.language === "es" ? "EN" : "ES"}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
