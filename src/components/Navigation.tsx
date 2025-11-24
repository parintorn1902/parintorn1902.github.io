import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'About', href: '#about', number: '01' },
    { name: 'Projects', href: '#projects', number: '02' },
    { name: 'Tech Stack', href: '#technologies', number: '03' },
    { name: 'Experience', href: '#experience', number: '04' },
    { name: 'Contact', href: '#contact', number: '05' },
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? 'bg-cyber-card/30 backdrop-blur-md shadow-lg' : 'bg-transparent'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.div
              className="text-cyber-primary font-bold text-xl"
              whileHover={{ scale: 1.05 }}
            >
              <span className="text-cyber-secondary">{'<'}</span>
              PS
              <span className="text-cyber-secondary">{'/>'}</span>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navItems.map((item, index) => (
                <motion.button
                  key={index}
                  onClick={() => scrollToSection(item.href)}
                  className="text-cyber-primary hover:text-cyber-secondary transition-colors duration-300 flex items-center gap-2 group"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <span className="text-cyber-secondary text-sm">{item.number}.</span>
                  <span className="neon-link text-sm">{item.name}</span>
                </motion.button>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-cyber-primary text-2xl"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <motion.div
        className={`fixed inset-0 bg-cyber-darker/95 backdrop-blur-lg z-40 md:hidden ${
          isOpen ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
        initial={{ opacity: 0 }}
        animate={{ opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-col items-center justify-center h-full gap-8">
          {navItems.map((item, index) => (
            <motion.button
              key={index}
              onClick={() => scrollToSection(item.href)}
              className="text-cyber-primary hover:text-cyber-secondary transition-colors duration-300 text-2xl"
              initial={{ opacity: 0, x: -50 }}
              animate={{
                opacity: isOpen ? 1 : 0,
                x: isOpen ? 0 : -50,
              }}
              transition={{ delay: index * 0.1 }}
            >
              <span className="text-cyber-secondary mr-4">{item.number}.</span>
              {item.name}
            </motion.button>
          ))}
        </div>
      </motion.div>
    </>
  );
};

export default Navigation;
