import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Mail, ArrowUpRight } from "lucide-react";
import { useTranslation } from "react-i18next";

const ContactSection = () => {
  const { ref, isVisible } = useScrollAnimation();
  const { t } = useTranslation();
  const email = t("contact.email");

  return (
    <section id="contact" className="py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card to-background" />

      <div ref={ref} className="container mx-auto px-6 relative z-10 text-center">
        <div className={`transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
          <span className="text-sm font-semibold text-primary uppercase tracking-widest mb-4 block">
            {t("contact.kicker")}
          </span>
          <h2 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold mb-6 text-balance">
            {t("contact.title1")}
            <br />
            <span className="text-gradient">{t("contact.title2")}</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-md mx-auto mb-10 text-pretty">
            {t("contact.description")}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={`mailto:${email}`}
              className="group inline-flex items-center gap-3 rounded-full bg-gradient-primary px-8 py-4 text-base font-semibold text-primary-foreground transition-all duration-300 hover:scale-105 glow"
            >
              <Mail className="w-5 h-5" />
              {email}
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
