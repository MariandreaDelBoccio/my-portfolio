import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Code, Palette, Layers, Zap, Monitor, Figma } from "lucide-react";

const skills = [
  { icon: Code, title: "Frontend Dev", desc: "React, TypeScript, Next.js — código limpio y performante.", color: "text-primary" },
  { icon: Palette, title: "UI Design", desc: "Interfaces visualmente impactantes con atención al detalle.", color: "text-accent" },
  { icon: Layers, title: "Design Systems", desc: "Sistemas escalables que mantienen consistencia en todo el producto.", color: "text-primary" },
  { icon: Zap, title: "Performance", desc: "Optimización web, Core Web Vitals, lazy loading y más.", color: "text-accent" },
  { icon: Monitor, title: "Responsive", desc: "Experiencias perfectas en cada dispositivo y tamaño de pantalla.", color: "text-primary" },
  { icon: Figma, title: "Prototipado", desc: "De wireframes a prototipos interactivos de alta fidelidad.", color: "text-accent" },
];

const SkillsSection = () => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="skills" className="py-32 relative overflow-hidden">
      <div className="absolute left-0 bottom-0 w-[500px] h-[500px] rounded-full bg-accent/5 blur-[100px]" />

      <div className="container mx-auto px-6">
        <div ref={ref} className={`mb-16 text-center transition-all duration-800 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <span className="text-sm font-semibold text-primary uppercase tracking-widest mb-4 block">Habilidades</span>
          <h2 className="font-display text-4xl md:text-6xl font-bold">
            Lo que <span className="text-gradient">hago mejor</span>
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {skills.map((skill, i) => {
            const Icon = skill.icon;
            return (
              <div
                key={skill.title}
                className={`glass rounded-2xl p-8 hover-lift transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
                style={{ transitionDelay: `${i * 100 + 200}ms` }}
              >
                <Icon className={`w-8 h-8 ${skill.color} mb-4`} />
                <h3 className="font-display text-xl font-semibold mb-2">{skill.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{skill.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
