import { Code2 } from "lucide-react";
import { skills } from "../data/skills";
import { DarkMode } from "../types";

const Skills = ({ darkMode }: DarkMode) => {
  return (
    <div className="mb-20">
      <h2
        className={`text-4xl font-bold mb-8 text-center ${
          darkMode ? "text-white" : "text-gray-900"
        }`}
      >
        <Code2 className="inline mr-3 text-purple-400" />
        Skills & Technologies
      </h2>
      <div className="flex flex-wrap justify-center gap-4">
        {skills.map((skill, index) => (
          <div
            key={skill}
            className={`px-6 py-3 ${
              darkMode ? "bg-gray-800/50" : "bg-white/50"
            } backdrop-blur-lg rounded-full border ${
              darkMode ? "border-gray-700" : "border-gray-300"
            } hover:scale-110 hover:border-purple-400 transition-all cursor-pointer`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <span
              className={`font-medium ${
                darkMode ? "text-gray-200" : "text-gray-800"
              }`}
            >
              {skill}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Skills;
