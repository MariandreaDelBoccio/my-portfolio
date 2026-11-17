export type ProjectId = "miga" | "brasa" | "kai";

export type Project = {
  id: ProjectId;
  number: string;
  name: string;
  href: string;
  port: number;
  tone: "lilac" | "ember" | "soy";
  image: string;
};

const pages = (repo: string) =>
  `https://mariandreadelboccio.github.io/${repo}/`;

const shot = (id: ProjectId) => `/work/${id}.jpg`;

export const projects: Project[] = [
  {
    id: "miga",
    number: "01",
    name: "miga.",
    href: pages("mdb-miga"),
    port: 5181,
    tone: "lilac",
    image: shot("miga"),
  },
  {
    id: "brasa",
    number: "02",
    name: "BRASA",
    href: pages("mdb-brasa"),
    port: 5182,
    tone: "ember",
    image: shot("brasa"),
  },
  {
    id: "kai",
    number: "03",
    name: "KAI",
    href: pages("mdb-kai"),
    port: 5183,
    tone: "soy",
    image: shot("kai"),
  },
];
