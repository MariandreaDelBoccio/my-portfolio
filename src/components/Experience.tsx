import React from "react";
import { Briefcase } from "lucide-react";
import { experience } from "../data/experience";
import { DarkMode } from "../types";

const Experience = ({ darkMode }: DarkMode) => {
  return (
    <div className="mb-20">
      <h2
        className={`text-4xl font-bold mb-12 text-center ${
          darkMode ? "text-white" : "text-gray-900"
        }`}
      >
        <Briefcase className="inline mr-3 text-purple-400" />
        Experience
      </h2>
      <div className="max-w-4xl mx-auto">
        {experience.map((exp, index) => (
          <div key={index} className="relative pl-0 md:pl-8 pb-12 last:pb-0">
            <div
              className="invisible md:visible absolute left-0 top-0 w-4 h-4 rounded-full bg-gradient-to-br from-purple-500 to-pink-500
                after:absolute after:top-4 after:left-1/2 after:-translate-x-1/2 after:w-0.5 after:h-full after:bg-gradient-to-b after:from-purple-500 after:to-transparent"
            />
            <div
              className={`${
                darkMode ? "bg-gray-800/50" : "bg-white/50"
              } backdrop-blur-lg rounded-2xl p-6 border ${
                darkMode ? "border-gray-700" : "border-gray-300"
              } hover:scale-105 transition-transform`}
            >
              <div className="text-purple-400 font-semibold mb-2">
                {exp.year}
              </div>
              <h3
                className={`text-2xl font-bold mb-1 ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {exp.role}
              </h3>
              <div
                className={`${
                  darkMode ? "text-gray-400" : "text-gray-600"
                } mb-3`}
              >
                {exp.company}
              </div>
              <p className={darkMode ? "text-gray-300" : "text-gray-700"}>
                {exp.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Experience;
