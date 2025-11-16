import { Sparkles, Moon, Sun } from "lucide-react";
import { NavbarProps } from "../types";

const Navbar = ({
  activeSection,
  setActiveSection,
  darkMode,
  setDarkMode,
}: NavbarProps) => {
  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 ${
        darkMode ? "bg-gray-900/80" : "bg-white/80"
      } backdrop-blur-lg border-b ${
        darkMode ? "border-gray-800" : "border-gray-200"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Sparkles
            className={`${
              darkMode ? "text-purple-400" : "text-purple-600"
            } animate-pulse`}
            size={24}
          />
          <span className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
            Portfolio
          </span>
        </div>

        <div className="flex items-center space-x-6">
          <button
            onClick={() => setActiveSection("home")}
            className={`${
              activeSection === "home"
                ? darkMode
                  ? "text-purple-400"
                  : "text-purple-600"
                : darkMode
                ? "text-gray-400"
                : "text-gray-600"
            } hover:text-purple-400 transition-colors font-medium`}
          >
            Home
          </button>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-full ${
              darkMode
                ? "bg-gray-800 text-yellow-400"
                : "bg-gray-200 text-gray-800"
            } hover:scale-110 transition-transform`}
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
