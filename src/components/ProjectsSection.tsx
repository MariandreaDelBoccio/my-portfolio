import { useMemo } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useTranslation } from "react-i18next";
import project1 from "@/assets/project-1.jpg";
import project2 from "@/assets/project-2.jpg";
import project3 from "@/assets/project-3.jpg";
import { ArrowUpRight, ExternalLink } from "lucide-react";

type Project = {
  title: string;
  description: string;
  tags: string[];
  image: string;
  color: string;
  liveUrl?: string;
  liveDomain?: string;
};

const ProjectCard = ({ project, index }: { project: Project; index: number }) => {
  const { t } = useTranslation();
  const { ref, isVisible } = useScrollAnimation(0.1);
  const isEven = index % 2 === 0;

  return (
    <div
      ref={ref}
      className={`grid lg:grid-cols-2 gap-8 lg:gap-16 items-center transition-all duration-1000 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className={isEven ? "" : "lg:order-2"}>
        {project.liveUrl ? (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
            aria-label={`${t("projects.visitLive")} — ${project.title}`}
          >
            <div className={`relative group rounded-2xl overflow-hidden bg-gradient-to-br ${project.color}`}>
              <img
                src={project.image}
                alt=""
                loading="lazy"
                width={800}
                height={600}
                className="w-full aspect-[4/3] object-cover object-top transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-background/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                <div className="rounded-full bg-gradient-primary p-4 scale-75 group-hover:scale-100 transition-transform duration-500">
                  <ExternalLink className="w-6 h-6 text-primary-foreground" />
                </div>
              </div>
            </div>
          </a>
        ) : (
          <div className={`relative group rounded-2xl overflow-hidden bg-gradient-to-br ${project.color}`}>
            <img
              src={project.image}
              alt=""
              loading="lazy"
              width={800}
              height={600}
              className="w-full aspect-[4/3] object-cover object-top transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-background/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
              <div className="rounded-full bg-gradient-primary p-4 scale-75 group-hover:scale-100 transition-transform duration-500">
                <ArrowUpRight className="w-6 h-6 text-primary-foreground" />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className={isEven ? "" : "lg:order-1"}>
        <span className="text-sm font-mono text-primary mb-2 block">0{index + 1}</span>
        <h3 className="font-display text-3xl md:text-4xl font-bold mb-4">{project.title}</h3>
        <p className="text-muted-foreground text-lg leading-relaxed mb-6">{project.description}</p>
        <div className="flex flex-wrap gap-2 mb-6">
          {project.tags.map((tag) => (
            <span key={tag} className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
              {tag}
            </span>
          ))}
        </div>
        {project.liveUrl && project.liveDomain && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-card/50 px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-primary/50 hover:text-primary"
          >
            <ExternalLink className="h-4 w-4 shrink-0 text-primary" aria-hidden />
            {t("projects.visitLive")}
            <span className="text-muted-foreground">—</span>
            <span className="text-gradient font-medium">{project.liveDomain}</span>
          </a>
        )}
      </div>
    </div>
  );
};

const ProjectsSection = () => {
  const { t } = useTranslation();
  const { ref, isVisible } = useScrollAnimation();

  const projects: Project[] = useMemo(
    () => [
      {
        title: "Aura Health App",
        description:
          "Diseño y desarrollo de una app de bienestar mental con animaciones fluidas y una experiencia de usuario envolvente.",
        tags: ["React Native", "Motion", "UX Research"],
        image: project1,
        color: "from-primary/20 to-accent/20",
      },
      {
        title: "Nova Analytics",
        description:
          "Dashboard de analíticas en tiempo real con visualizaciones de datos interactivas y un design system escalable.",
        tags: ["React", "D3.js", "Design System"],
        image: project2,
        color: "from-accent/20 to-primary/20",
      },
      {
        title: "Luxe E-Commerce",
        description:
          "Rediseño completo de una tienda online de lujo, incrementando la conversión un 40% con micro-interacciones.",
        tags: ["Next.js", "Figma", "A/B Testing"],
        image: project3,
        color: "from-primary/15 to-accent/15",
      },
    ],
    [t]
  );

  return (
    <section id="projects" className="py-32 relative">
      <div className="container mx-auto px-6">
        <div
          ref={ref}
          className={`mb-20 transition-all duration-800 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <span className="text-sm font-semibold text-primary uppercase tracking-widest mb-4 block">
            {t("projects.badge")}
          </span>
          <h2 className="font-display text-4xl md:text-6xl font-bold text-balance">
            {t("projects.description")}{" "}
            <span className="text-gradient">{t("projects.subtitle")}</span>
          </h2>
          <p className="mt-4 max-w-2xl text-muted-foreground text-pretty">{t("projects.scrollyIntro")}</p>
        </div>

        <div className="space-y-32">
          {projects.map((project, i) => (
            <ProjectCard key={project.title} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
