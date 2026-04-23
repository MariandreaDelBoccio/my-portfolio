const words = [
  "React",
  "TypeScript",
  "Node",
  "Tailwind",
  "Next.js",
  "Serverless",
  "Design systems",
  "Accessibility",
  "Product",
  "React",
  "TypeScript",
  "Node",
  "Tailwind",
  "Next.js",
  "Serverless",
  "Design systems",
  "Accessibility",
  "Product",
];

const MarqueeSection = () => (
  <div className="py-8 border-y border-border overflow-hidden">
    <div className="flex animate-marquee whitespace-nowrap">
      {words.map((word, i) => (
        <span key={i} className="mx-8 text-2xl md:text-4xl font-display font-bold text-muted-foreground/20">
          {word}
          <span className="text-primary/30 mx-8">✦</span>
        </span>
      ))}
    </div>
  </div>
);

export default MarqueeSection;
