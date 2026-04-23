import { useScrollAnimation, useParallax } from "@/hooks/useScrollAnimation";
import { useTranslation } from "react-i18next";

const AboutSection = () => {
  const { ref, isVisible } = useScrollAnimation();
  const scroll = useParallax();
  const { t } = useTranslation();

  const stats = [
    { value: "8+", label: t("stats.experience") },
    { value: "50+", label: t("stats.projects") },
    { value: "30+", label: t("stats.clients") },
    { value: "15", label: t("stats.awards") },
  ];

  return (
    <section id="about" className="py-32 relative overflow-hidden">
      {/* Floating shape */}
      <div
        className="absolute right-0 top-0 w-96 h-96 rounded-full bg-primary/5 blur-[80px]"
        style={{ transform: `translateY(${scroll * 0.1 - 200}px)` }}
      />

      <div ref={ref} className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div
            className={`transition-all duration-1000 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12"}`}
          >
            <span className="text-sm font-semibold text-primary uppercase tracking-widest mb-4 block">
              {t("about.subtitle")}
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold leading-tight mb-6">
              {t("about.title")}{" "}
              <span className="text-gradient">
                {t("about.subtitle.gradient.design")}
              </span>
              {t("about.subtitle.gradient.separator")}
              <span className="text-gradient">
                {t("about.subtitle.gradient.code")}
              </span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-6">
              {t("about.description")}
            </p>
            <p className="text-muted-foreground leading-relaxed">
              {t("about.subdescription")}
            </p>
          </div>

          <div
            className={`grid grid-cols-2 gap-4 transition-all duration-1000 delay-300 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"}`}
          >
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className={`glass rounded-2xl p-6 hover-lift stagger-${i + 1}`}
              >
                <div className="text-4xl md:text-5xl font-display font-bold text-gradient mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
