export interface AnimatedBackgroundProps {
  mousePosition: {
    x: number;
    y: number;
  };
  darkMode: boolean;
}

export interface NavbarProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  activeSection: "home" | "projects";
  setActiveSection: (section: "home" | "projects") => void;
}

export type DarkMode = {
  darkMode: boolean;
};

export interface ProjectCardProps {
  project: {
    title: string;
    description: string;
    tech: string[];
    github: string;
    demo: string;
    gradient: string;
  };
  darkMode: boolean;
}

