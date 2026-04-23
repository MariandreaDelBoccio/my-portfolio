import { useMouseParallax, useParallax } from "@/hooks/useScrollAnimation";
import heroImg from "../assets/hero-abstract.jpg";
import { useTranslation } from "react-i18next";

const HeroSection = () => {
  const mouse = useMouseParallax();
  const scroll = useParallax();
  const { t } = useTranslation();

  const heroTilt = Math.min(1, scroll / 420);
  const contentLift = -scroll * 0.12;

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 opacity-40"
        style={{
          transform: `translateY(${scroll * 0.35}px) scale(${1 + scroll * 0.0002})`,
        }}
      >
        <img src={heroImg} alt="" className="w-full h-full object-cover" width={1920} height={1080} />
      </div>

      {/* Gradient orbs */}
      <div
        className="absolute w-[600px] h-[600px] rounded-full bg-primary/20 blur-[120px] animate-pulse-glow"
        style={{ transform: `translate(${mouse.x * 30}px, ${mouse.y * 30}px)`, top: "10%", right: "10%" }}
      />
      <div
        className="absolute w-[400px] h-[400px] rounded-full bg-accent/15 blur-[100px] animate-pulse-glow"
        style={{ transform: `translate(${mouse.x * -20}px, ${mouse.y * -20}px)`, bottom: "20%", left: "15%", animationDelay: "1.5s" }}
      />

      {/* Content */}
      <div
        className="relative z-10 container mx-auto px-6 text-center transition-opacity duration-300 will-change-transform"
        style={{
          transform: `translate3d(0, ${contentLift}px, 0)`,
          opacity: Math.max(0.5, 1 - heroTilt * 0.35),
        }}
      >
        <div className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-1.5 mb-8 opacity-0 animate-fade-up">
          <span className="h-2 w-2 rounded-full bg-gradient-primary animate-pulse" />
          <span className="text-sm text-muted-foreground">{t("hero.available")}</span>
        </div>

        <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl xl:text-9xl font-bold leading-[0.9] tracking-tighter mb-6 opacity-0 animate-fade-up stagger-1">
          {t("hero.title")}<br />
          <span className="text-gradient">{t("hero.subtitle")}</span>
        </h1>

        <p className="max-w-xl mx-auto text-lg text-muted-foreground mb-10 opacity-0 animate-fade-up stagger-2 text-balance">
          {t("hero.description")}
        </p>

        <div className="flex items-center justify-center gap-4 opacity-0 animate-fade-up stagger-3">
          <a
            href="#projects"
            className="rounded-full bg-gradient-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:scale-105 glow"
          >
            {t("hero.cta1")}
          </a>
          <a
            href="#about"
            className="rounded-full glass px-8 py-3.5 text-sm font-semibold text-foreground transition-all duration-300 hover:scale-105"
          >
            {t("hero.cta2")}
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 opacity-0 animate-fade-up stagger-5">
        <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex justify-center pt-2">
          <div className="w-1 h-2 rounded-full bg-primary animate-bounce" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
