import { useEffect } from 'react';
import MatrixRain from './components/MatrixRain';
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

    // Disable right-click context menu for aesthetic (optional)
    // document.addEventListener('contextmenu', e => e.preventDefault());

    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* Matrix Rain Background */}
      <MatrixRain />

      {/* Navigation */}
      <Navigation />

      {/* Main Content */}
      <main className="relative z-10">
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
  );
}

export default App;
