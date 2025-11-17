import { useState } from 'react';
import Navbar from './components/Navbar';
import AnimatedBackground from './components/AnimatedBackground';
import Hero from './components/Hero';
import Skills from './components/Skills';
import Experience from './components/Experience';
import Stats from './components/Stats';
import Projects from './components/Projects';
import { useMousePosition } from './hooks/useMousePosition';

function App() {
  const [activeSection, setActiveSection] = useState<'home' | 'projects'>('home');
  const [darkMode, setDarkMode] = useState(true);
  const mousePosition = useMousePosition();

  return (
    <div
      className={`min-h-screen ${
        darkMode ? 'bg-gray-900' : 'bg-gray-50'
      } transition-colors duration-300 relative overflow-hidden`}
    >
      <AnimatedBackground mousePosition={mousePosition} darkMode={darkMode} />

      <Navbar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      <div className="pt-20 relative z-10">
        {activeSection === 'home' ? (
          <div className="max-w-7xl mx-auto px-6 py-12">
            <Hero darkMode={darkMode} />
            <Skills darkMode={darkMode} />
            <Experience darkMode={darkMode} />
            <Stats darkMode={darkMode} />
          </div>
        ) : (
          <Projects darkMode={darkMode} />
        )}
      </div>
    </div>
  );
}

export default App;
