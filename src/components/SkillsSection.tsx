import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Code, Lightbulb, Palette, Layers, Cloud, Zap, type LucideIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

const skillIcons: LucideIcon[] = [Code, Lightbulb, Palette, Layers, Cloud, Zap];
const iconColors = [
  "text-primary",
  "text-accent",
  "text-primary",
  "text-accent",
  "text-primary",
  "text-accent",
];

const SkillsSection = () => {
  const { ref, isVisible } = useScrollAnimation();
  const { t } = useTranslation();
  const items = t("skills.items", { returnObjects: true }) as { title: string; description: string }[];

  return (
    <section id="skills" className="py-32 relative overflow-hidden">
      <div className="absolute left-0 bottom-0 w-[500px] h-[500px] rounded-full bg-accent/5 blur-[100px]" />

      <div className="container mx-auto px-6">
        <div
          ref={ref}
          className={`mb-16 text-center transition-all duration-800 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <span className="text-sm font-semibold text-primary uppercase tracking-widest mb-4 block">
            {t("skills.kicker")}
          </span>
          <h2 className="font-display text-4xl md:text-6xl font-bold">
            {t("skills.title")}
            <span className="text-gradient">{t("skills.titleGradient")}</span>
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((skill, i) => {
            const Icon = skillIcons[i] ?? Code;
            return (
              <div
                key={skill.title}
                className={`glass rounded-2xl p-8 hover-lift transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
                style={{ transitionDelay: `${i * 100 + 200}ms` }}
              >
                <Icon className={`w-8 h-8 ${iconColors[i] ?? "text-primary"} mb-4`} />
                <h3 className="font-display text-xl font-semibold mb-2">{skill.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{skill.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
