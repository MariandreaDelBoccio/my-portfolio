import React from "react";
import { Mail, Github, Linkedin, MapPin } from "lucide-react";
import { DarkMode } from "../types";

const Hero = ({ darkMode }: DarkMode) => {
  return (
    <div className="text-center mb-20">
      <div className="mb-8 relative inline-block">
        <img
          src="/profile.jpeg"
          alt="Profile"
          className="w-32 h-32 rounded-full mx-auto mb-6 object-cover border-4 border-purple-500 relative z-10"
        />
        <div className="absolute inset-0 w-32 h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mx-auto blur-xl opacity-50 animate-pulse" />
      </div>

      <h1
        className={`text-6xl font-bold mb-4 ${
          darkMode ? "text-white" : "text-gray-900"
        }`}
      >
        Mariandrea Del Boccio
      </h1>
      <p className="text-2xl text-purple-400 mb-6">Senior Frontend Developer</p>
      <p
        className={`text-xl ${
          darkMode ? "text-gray-400" : "text-gray-600"
        } max-w-2xl mx-auto mb-8`}
      >
        Crafting beautiful, performant web experiences with modern technologies.
        Passionate about clean code, user experience, and continuous learning.
      </p>

      <div className="grid space-y-4 md:flex justify-center md:space-x-4 md:space-y-0 mb-8">
        <a
          href="mailto:maridelboccio@gmail.com"
          className="group flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full hover:scale-105 transition-transform"
        >
          <Mail size={20} />
          <span>Contact Me</span>
        </a>
        <a
          href="https://github.com/MariandreaDelBoccio"
          className={`flex items-center space-x-2 px-6 py-3 ${
            darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
          } rounded-full hover:scale-105 transition-transform border ${
            darkMode ? "border-gray-700" : "border-gray-300"
          }`}
        >
          <Github size={20} />
          <span>GitHub</span>
        </a>
        <a
          href="https://www.linkedin.com/in/mariandreadelboccio/"
          className={`flex items-center space-x-2 px-6 py-3 ${
            darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
          } rounded-full hover:scale-105 transition-transform border ${
            darkMode ? "border-gray-700" : "border-gray-300"
          }`}
        >
          <Linkedin size={20} />
          <span>LinkedIn</span>
        </a>
      </div>

      <div className="flex justify-center items-center space-x-2 text-gray-400">
        <MapPin size={18} />
        <span>Barceona, ES</span>
      </div>
    </div>
  );
};

export default Hero;
