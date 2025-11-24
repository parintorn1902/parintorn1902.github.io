import { motion } from 'framer-motion';
import { useRef } from 'react';
import { FaExternalLinkAlt, FaGithub } from 'react-icons/fa';
import { projects } from '../data/portfolio';
import { useMousePosition } from '../hooks/useMousePosition';

const ProjectCard = ({ project, variants }: { project: typeof projects[0], variants: any }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const { mousePosition, isHovering } = useMousePosition(cardRef);

  return (
    <motion.div
      ref={cardRef}
      className="group relative glass-card p-6 hover:bg-cyber-card/50 transition-all duration-500 terminal-border overflow-hidden"
      variants={variants}
      whileHover={{ y: -8 }}
      style={{
        background: isHovering
          ? `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(0, 255, 65, 0.08), transparent 40%)`
          : undefined,
      }}
    >
      {/* Mouse tracking light effect */}
      {isHovering && (
        <div
          className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: `radial-gradient(400px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(0, 255, 65, 0.15), transparent 50%)`,
          }}
        />
      )}

      {/* Project Image */}
      {project.projectPreviewImage && (
        <div className="mb-4 overflow-hidden rounded border border-cyber-primary/20 relative z-10">
          <img
            src={`/images/${project.projectPreviewImage}`}
            alt={project.projectName}
            className="w-full h-48 object-cover object-top transition-transform duration-500 group-hover:scale-110"
          />
        </div>
      )}

      {/* Project Content */}
      <div className="space-y-4 relative z-10">
        <div>
          <h3 className="text-2xl font-bold text-cyber-primary group-hover:text-cyber-secondary transition-colors duration-300 mb-2">
            <span className="text-cyber-secondary/50">{'>'}</span> {project.projectName}
          </h3>
          <p className="text-cyber-primary/70 leading-relaxed">
            {project.projectDesc}
          </p>
        </div>

        {/* Tags */}
        {project.tags && (
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 text-xs border border-cyber-primary/30 text-cyber-primary/80 rounded hover:border-cyber-primary/60 hover:bg-cyber-primary/5 transition-all duration-300"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4 pt-4">
          {project.projectDemoLink && (
            <a
              href={project.projectDemoLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-cyber-primary hover:text-cyber-secondary transition-colors duration-300 group/link"
            >
              <FaExternalLinkAlt className="group-hover/link:translate-x-1 group-hover/link:-translate-y-1 transition-transform duration-300" />
              <span className="neon-link text-sm">Live Demo</span>
            </a>
          )}
          {project.projectSourceLink && (
            <a
              href={project.projectSourceLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-cyber-primary hover:text-cyber-secondary transition-colors duration-300 group/link"
            >
              <FaGithub className="group-hover/link:rotate-12 transition-transform duration-300" />
              <span className="neon-link text-sm">Source Code</span>
            </a>
          )}
        </div>
      </div>

      {/* Decorative Corner */}
      <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-cyber-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
      <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-cyber-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
    </motion.div>
  );
};

const Projects = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  return (
    <section id="projects" className="min-h-screen py-20 relative">
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
            <span className="text-cyber-secondary text-2xl font-bold">02.</span>
            <h2 className="text-4xl md:text-5xl font-bold text-cyber-primary glitch" data-text="Projects">
              Projects
            </h2>
            <div className="flex-1 h-[1px] bg-gradient-to-r from-cyber-primary/50 to-transparent ml-4"></div>
          </div>
          <p className="text-cyber-primary/70 ml-16">
            <span className="text-cyber-secondary">$</span> ls -la ~/projects/
          </p>
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {projects.map((project) => (
            <ProjectCard key={project.projectId} project={project} variants={itemVariants} />
          ))}
        </motion.div>

        {/* More Projects Link */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <a
            href="https://github.com/parintorn1902"
            target="_blank"
            rel="noopener noreferrer"
            className="cyber-button-outline inline-block"
          >
            [ View More on GitHub ]
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;
