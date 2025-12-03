import { useEffect } from 'react';
import Scene from './components/3d/Scene';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import Projects from './components/Projects';
import Technologies from './components/Technologies';
import Experience from './components/Experience';
import Contact from './components/Contact';

function App() {
  useEffect(() => {
    // Smooth scrolling
    document.documentElement.style.scrollBehavior = 'smooth';

    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* Fixed 3D Background */}
      <div className="fixed inset-0 z-0">
        <Scene />
      </div>

      {/* Scrollable Content */}
      <div className="relative z-10">
        {/* Navigation */}
        <Navigation />

        {/* Main Content */}
        <main>
          {/* Hero Section */}
          <Hero />

          {/* Projects Section */}
          <Projects />

          {/* Technologies Section */}
          <Technologies />

          {/* Experience Section */}
          <Experience />

          {/* Contact Section */}
          <Contact />
        </main>
      </div>
    </div>
  );
}

export default App;
