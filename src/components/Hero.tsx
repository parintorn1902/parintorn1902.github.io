import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { personalInfo } from '../data/portfolio';

const Hero = () => {
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const fullText = `> ${personalInfo.title}_`;

  useEffect(() => {
    let index = isDeleting ? fullText.length : 0;

    const timer = setInterval(() => {
      if (!isDeleting) {
        // Typing
        if (index <= fullText.length) {
          setDisplayedText(fullText.slice(0, index));
          index++;
        } else {
          // Pause before deleting
          setTimeout(() => setIsDeleting(true), 2000);
          clearInterval(timer);
        }
      } else {
        // Deleting
        if (index > 0) {
          setDisplayedText(fullText.slice(0, index));
          index--;
        } else {
          // Start typing again
          setIsDeleting(false);
          clearInterval(timer);
        }
      }
    }, isDeleting ? 50 : 100);

    return () => clearInterval(timer);
  }, [isDeleting, fullText]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="about" className="min-h-screen flex items-center justify-center relative overflow-hidden scanline pt-20">
      {/* Grid Background */}
      <div className="absolute inset-0 grid-background" />

      <motion.div
        className="container mx-auto px-6 relative z-10"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="max-w-4xl mx-auto">
          {/* Terminal Header */}
          <motion.div
            className="glass-card p-8 mb-8"
            variants={itemVariants}
          >
            <div className="flex items-center gap-2 mb-6">
              <div className="w-3 h-3 rounded-full bg-cyber-accent"></div>
              <div className="w-3 h-3 rounded-full bg-cyber-secondary"></div>
              <div className="w-3 h-3 rounded-full bg-cyber-primary"></div>
              <span className="ml-4 text-cyber-primary/70 text-sm">~/parintorn/portfolio</span>
            </div>

            {/* Typing Effect */}
            <div className="font-mono">
              <div className="text-cyber-secondary mb-2">$ whoami</div>
              <h1
                className="text-4xl md:text-6xl font-bold mb-4 text-cyber-primary glitch"
                data-text={personalInfo.name}
              >
                {personalInfo.name}
              </h1>

              <div className="text-xl md:text-2xl text-cyber-primary mb-6 min-h-[2rem]">
                {displayedText}
              </div>

              <div className="text-cyber-primary/80 mb-6 leading-relaxed">
                <span className="text-cyber-secondary">$ cat about.txt</span>
                <p className="mt-2 pl-4 border-l-2 border-cyber-primary/30">
                  {personalInfo.description}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            className="flex flex-wrap gap-4 justify-center"
            variants={itemVariants}
          >
            <button
              onClick={() => scrollToSection('projects')}
              className="cyber-button"
            >
              [ View Projects ]
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="cyber-button-outline"
            >
              [ Get in Touch ]
            </button>
          </motion.div>

          {/* Social Links */}
          <motion.div
            className="flex gap-6 justify-center mt-12"
            variants={itemVariants}
          >
            <a
              href={personalInfo.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyber-primary hover:text-cyber-secondary transition-colors duration-300 transform hover:scale-110"
              aria-label="GitHub"
            >
              <FaGithub size={32} />
            </a>
            <a
              href={personalInfo.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyber-primary hover:text-cyber-secondary transition-colors duration-300 transform hover:scale-110"
              aria-label="LinkedIn"
            >
              <FaLinkedin size={32} />
            </a>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            className="flex justify-center mt-16"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 1,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
          >
            <div className="text-cyber-primary/50 text-sm flex flex-col items-center gap-2">
              <span>scroll down</span>
              <svg
                className="w-6 h-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
              </svg>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
