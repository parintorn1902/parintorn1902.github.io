import { motion } from 'framer-motion';
import { useRef } from 'react';
import { FaReact, FaNodeJs } from 'react-icons/fa';
import { technologies, skills } from '../data/portfolio';
import { useMousePosition } from '../hooks/useMousePosition';

const TechCard = ({ children, className = '', ...motionProps }: { children: React.ReactNode, className?: string, [key: string]: any }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const { mousePosition, isHovering } = useMousePosition(cardRef);

  return (
    <motion.div
      ref={cardRef}
      className={`relative overflow-hidden ${className}`}
      style={{
        background: isHovering
          ? `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(0, 255, 65, 0.08), transparent 40%)`
          : undefined,
      }}
      {...motionProps}
    >
      {isHovering && (
        <div
          className="pointer-events-none absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300"
          style={{
            background: `radial-gradient(400px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(0, 255, 65, 0.15), transparent 50%)`,
          }}
        />
      )}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};

const Technologies = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <section id="technologies" className="min-h-screen py-20 relative">
      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-4 mb-4">
            <span className="text-cyber-secondary text-2xl font-bold">03.</span>
            <h2 className="text-4xl md:text-5xl font-bold text-cyber-primary glitch" data-text="Tech Stack">
              Tech Stack
            </h2>
            <div className="flex-1 h-[1px] bg-gradient-to-r from-cyber-primary/50 to-transparent ml-4"></div>
          </div>
          <p className="text-cyber-primary/70 ml-16">
            <span className="text-cyber-secondary">$</span> cat stack.json
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto space-y-12">
          {/* Frontend & Backend */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Frontend */}
            <TechCard
              className="glass-card p-8 terminal-border group"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-4 mb-6">
                <FaReact className="text-5xl text-cyber-secondary animate-spin-slow" />
                <h3 className="text-2xl font-bold text-cyber-primary">
                  {technologies.frontend.category}
                </h3>
              </div>

              <div className="space-y-4">
                {technologies.frontend.techs.map((tech, index) => (
                  <div key={index}>
                    <h4 className="text-cyber-secondary font-bold mb-2">{tech.name}</h4>
                    <div className="flex flex-wrap gap-2">
                      {tech.items.map((item, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 text-sm bg-cyber-primary/5 border border-cyber-primary/30 text-cyber-primary rounded hover:border-cyber-secondary/60 hover:text-cyber-secondary transition-all duration-300"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </TechCard>

            {/* Backend */}
            <TechCard
              className="glass-card p-8 terminal-border group"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-4 mb-6">
                <FaNodeJs className="text-5xl text-cyber-primary animate-float" />
                <h3 className="text-2xl font-bold text-cyber-primary">
                  {technologies.backend.category}
                </h3>
              </div>

              <div className="space-y-4">
                {technologies.backend.techs.map((tech, index) => (
                  <div key={index}>
                    <h4 className="text-cyber-secondary font-bold mb-2">{tech.name}</h4>
                    <div className="flex flex-wrap gap-2">
                      {tech.items.map((item, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 text-sm bg-cyber-primary/5 border border-cyber-primary/30 text-cyber-primary rounded hover:border-cyber-secondary/60 hover:text-cyber-secondary transition-all duration-300"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </TechCard>
          </div>

          {/* Skills Overview */}
          <TechCard
            className="glass-card p-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-2xl font-bold text-cyber-primary mb-6">
              <span className="text-cyber-secondary">$</span> skills.list()
            </h3>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {/* Programming Skills */}
              <motion.div variants={itemVariants}>
                <h4 className="text-cyber-secondary font-bold mb-4 flex items-center gap-2">
                  <span className="text-lg">{'>'}</span> Programming
                </h4>
                <ul className="space-y-2">
                  {skills.programming.map((skill, index) => (
                    <li
                      key={index}
                      className="text-cyber-primary/80 hover:text-cyber-primary hover:translate-x-2 transition-all duration-300 cursor-default"
                    >
                      <span className="text-cyber-secondary/50">■</span> {skill}
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Tools */}
              <motion.div variants={itemVariants}>
                <h4 className="text-cyber-secondary font-bold mb-4 flex items-center gap-2">
                  <span className="text-lg">{'>'}</span> Tools
                </h4>
                <ul className="space-y-2">
                  {skills.tools.map((tool, index) => (
                    <li
                      key={index}
                      className="text-cyber-primary/80 hover:text-cyber-primary hover:translate-x-2 transition-all duration-300 cursor-default"
                    >
                      <span className="text-cyber-secondary/50">■</span> {tool}
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* AI Skills */}
              <motion.div variants={itemVariants}>
                <h4 className="text-cyber-secondary font-bold mb-4 flex items-center gap-2">
                  <span className="text-lg">{'>'}</span> AI Proficiency
                </h4>
                <ul className="space-y-2">
                  {skills.ai.map((ai, index) => (
                    <li
                      key={index}
                      className="text-cyber-primary/80 hover:text-cyber-primary hover:translate-x-2 transition-all duration-300 cursor-default"
                    >
                      <span className="text-cyber-secondary/50">■</span> {ai}
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Cloud */}
              <motion.div variants={itemVariants}>
                <h4 className="text-cyber-secondary font-bold mb-4 flex items-center gap-2">
                  <span className="text-lg">{'>'}</span> Cloud & Services
                </h4>
                <ul className="space-y-2">
                  {skills.cloud.map((service, index) => (
                    <li
                      key={index}
                      className="text-cyber-primary/80 hover:text-cyber-primary hover:translate-x-2 transition-all duration-300 cursor-default"
                    >
                      <span className="text-cyber-secondary/50">■</span> {service}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </motion.div>
          </TechCard>
        </div>
      </div>
    </section>
  );
};

export default Technologies;
