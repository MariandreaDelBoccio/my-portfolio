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