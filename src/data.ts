export type ProjectId =
  | "lumiere"
  | "miga"
  | "muse"
  | "casa"
  | "mack"
  | "brasa"
  | "kai";

export type Project = {
  id: ProjectId;
  number: string;
  name: string;
  href: string;
  port: number;
  tone: "blush" | "lilac" | "sage" | "sand" | "ink" | "ember" | "soy";
  image: string;
};

const pages = (repo: string) =>
  `https://mariandreadelboccio.github.io/${repo}/`;

export const projects: Project[] = [
  {
    id: "lumiere",
    number: "01",
    name: "LUMIÈRE",
    href: pages("mdb-lumiere"),
    port: 5180,
    tone: "blush",
    image:
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1800&q=80",
  },
  {
    id: "miga",
    number: "02",
    name: "miga.",
    href: pages("mdb-miga"),
    port: 5181,
    tone: "lilac",
    image:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1800&q=80",
  },
  {
    id: "muse",
    number: "03",
    name: "MUSE",
    href: pages("mdb-muse"),
    port: 5176,
    tone: "ink",
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1800&q=80",
  },
  {
    id: "casa",
    number: "04",
    name: "CASA MARÉ",
    href: pages("mdb-casa-mare"),
    port: 5177,
    tone: "sand",
    image:
      "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=1800&q=80",
  },
  {
    id: "mack",
    number: "05",
    name: "MACK & CO.",
    href: pages("mdb-mack-and-co"),
    port: 5178,
    tone: "sage",
    image:
      "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1800&q=80",
  },
  {
    id: "brasa",
    number: "06",
    name: "BRASA",
    href: pages("mdb-brasa"),
    port: 5182,
    tone: "ember",
    image:
      "https://images.unsplash.com/photo-1602632066350-4206c806ebdb?auto=format&fit=crop&w=1800&q=80",
  },
  {
    id: "kai",
    number: "07",
    name: "KAI",
    href: pages("mdb-kai"),
    port: 5183,
    tone: "soy",
    image:
      "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=1800&q=80",
  },
];
