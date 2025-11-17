import { Github, ExternalLink, Code2 } from 'lucide-react';
import { ProjectCardProps } from '../types';

const ProjectCard = ({ project, darkMode }: ProjectCardProps) => {
  return (
    <div
      className={`group ${darkMode ? 'bg-gray-800/30' : 'bg-white/30'} backdrop-blur-lg rounded-2xl p-8 border ${darkMode ? 'border-gray-700' : 'border-gray-300'} hover:scale-[1.02] transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20`}
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="flex-1">
          <div className="flex items-start gap-4 mb-4">
            <div
              className={`w-12 h-12 bg-gradient-to-br ${project.gradient} rounded-xl flex items-center justify-center flex-shrink-0`}
            >
              <Code2 className="text-white" size={24} />
            </div>
            <div>
              <h3
                className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'} group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:${project.gradient} group-hover:bg-clip-text transition-all`}
              >
                {project.title}
              </h3>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {project.tech.map((tech) => (
                  <span
                    key={tech}
                    className={`px-3 py-1 text-sm ${darkMode ? 'bg-gray-700/50' : 'bg-gray-200/50'} rounded-full ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-4 md:flex-col">
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center justify-center gap-2 px-6 py-3 ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} rounded-xl transition-all hover:scale-105 whitespace-nowrap`}
          >
            <Github size={20} />
            <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              View Code
            </span>
          </a>
          <a
            href={project.demo}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r ${project.gradient} text-white rounded-xl transition-all hover:scale-105 hover:shadow-lg whitespace-nowrap`}
          >
            <ExternalLink size={20} />
            <span className="font-medium">Live Demo</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
