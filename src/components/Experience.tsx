import { motion } from 'framer-motion';
import { useRef } from 'react';
import { FaBriefcase, FaHome, FaCalendar } from 'react-icons/fa';
import { experiences } from '../data/portfolio';
import { useMousePosition } from '../hooks/useMousePosition';

const ExperienceCard = ({ exp, index, variants }: { exp: typeof experiences[0], index: number, variants: any }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const { mousePosition, isHovering } = useMousePosition(cardRef);

  return (
    <motion.div
      className={`relative mb-16 ${
        index % 2 === 0 ? 'md:pr-8' : 'md:pl-8 md:ml-auto'
      } md:w-1/2`}
      variants={variants}
    >
      {/* Timeline Dot */}
      <div className={`absolute left-0 top-6 ${
        index % 2 === 0 ? 'md:left-auto md:right-0 md:mr-[-17px]' : 'md:left-0 md:ml-[-17px]'
      } md:top-0`}>
        <motion.div
          className="w-8 h-8 rounded-full bg-cyber-darker border-4 border-cyber-primary flex items-center justify-center"
          whileHover={{ scale: 1.2, rotate: 180 }}
          transition={{ duration: 0.3 }}
        >
          <div className="w-3 h-3 rounded-full bg-cyber-primary animate-ping"></div>
        </motion.div>
      </div>

      {/* Experience Card */}
      <motion.div
        ref={cardRef}
        className="glass-card p-6 ml-12 md:ml-0 terminal-border group hover:bg-cyber-card/50 transition-all duration-500 overflow-hidden relative"
        whileHover={{ y: -5 }}
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

        <div className="relative z-10">
          {/* Period */}
          <div className="flex items-center gap-2 text-cyber-secondary text-sm mb-3">
            <FaCalendar />
            <span>{exp.period}</span>
          </div>

          {/* Position */}
          <h3 className="text-2xl font-bold text-cyber-primary mb-2 group-hover:text-cyber-secondary transition-colors duration-300">
            {exp.position}
          </h3>

          {/* Workplace */}
          <div className="flex items-center gap-2 text-cyber-primary/80 mb-4">
            {exp.wfh ? <FaHome /> : <FaBriefcase />}
            <span>{exp.workplace}</span>
          </div>

          {/* Details */}
          <ul className="space-y-2 mb-4">
            {exp.detail.map((item, i) => (
              <li key={i} className="text-cyber-primary/70 flex items-start gap-2">
                <span className="text-cyber-secondary mt-1">▹</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          {/* Tech Stack */}
          <div className="flex flex-wrap gap-2 mt-4">
            {exp.techStacks.map((tech, i) => (
              <span
                key={i}
                className="px-3 py-1 text-xs bg-cyber-primary/10 border border-cyber-primary/30 text-cyber-primary rounded-full hover:border-cyber-primary/60 hover:bg-cyber-primary/20 transition-all duration-300"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Decorative Corner */}
          <div className="absolute top-0 right-0 w-12 h-12 border-t border-r border-cyber-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="absolute bottom-0 left-0 w-12 h-12 border-b border-l border-cyber-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const Experience = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  return (
    <section id="experience" className="min-h-screen py-20 relative">
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
            <span className="text-cyber-secondary text-2xl font-bold">04.</span>
            <h2 className="text-4xl md:text-5xl font-bold text-cyber-primary glitch" data-text="Experience">
              Experience
            </h2>
            <div className="flex-1 h-[1px] bg-gradient-to-r from-cyber-primary/50 to-transparent ml-4"></div>
          </div>
          <p className="text-cyber-primary/70 ml-16">
            <span className="text-cyber-secondary">$</span> git log --all --graph
          </p>
        </motion.div>

        {/* Timeline */}
        <motion.div
          className="max-w-4xl mx-auto relative"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Timeline Line - positioned at left-4 on mobile, center on desktop */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-cyber-secondary via-cyber-primary to-transparent md:-translate-x-1/2"></div>

          {experiences.map((exp, index) => (
            <ExperienceCard key={index} exp={exp} index={index} variants={itemVariants} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Experience;
