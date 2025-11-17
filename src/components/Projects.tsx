import React from 'react';
import ProjectCard from './ProjectCard';
import { projects } from '../data/projects';
import { DarkMode } from '../types';

const Projects = ({ darkMode }: DarkMode) => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="text-center mb-12">
        <h1 className={`text-5xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Projects
        </h1>
        <p className={`text-xl ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          A selection of my work
        </p>
      </div>

      <div className="space-y-6">
        {projects.map((project, index) => (
          <ProjectCard key={index} project={project} darkMode={darkMode} />
        ))}
      </div>
    </div>
  );
};

export default Projects;
