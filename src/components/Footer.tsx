const Footer = () => (
  <footer className="border-t border-border py-8">
    <div className="container mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
      <span className="font-display text-sm font-semibold text-muted-foreground">
        Mariandrea<span className="text-gradient">.dev</span>
      </span>
      <div className="flex items-center gap-6">
        {[
          { label: "LinkedIn", href: "https://www.linkedin.com/in/mariandreadelboccio/" },
          { label: "GitHub", href: "https://github.com/MariandreaDelBoccio" },
        ].map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300"
          >
            {link.label}
          </a>
        ))}
      </div>
      <span className="text-xs text-muted-foreground">© 2026 Todos los derechos reservados</span>
    </div>
  </footer>
);

export default Footer;
