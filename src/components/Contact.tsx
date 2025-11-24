import { motion } from 'framer-motion';
import { useRef } from 'react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { personalInfo } from '../data/portfolio';
import { useMousePosition } from '../hooks/useMousePosition';

const ContactCard = ({ children, className = '', ...otherProps }: { children: React.ReactNode, className?: string, [key: string]: any }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const { mousePosition, isHovering } = useMousePosition(cardRef);

  return (
    <div
      ref={cardRef}
      className={`relative overflow-hidden ${className}`}
      {...otherProps}
    >
      {/* Base background layer */}
      <div className="absolute inset-0 bg-cyber-primary/5"></div>

      {/* Mouse tracking light effect */}
      {isHovering && (
        <div
          className="pointer-events-none absolute inset-0 transition-opacity duration-300"
          style={{
            background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(0, 255, 65, 0.15), transparent 40%)`,
          }}
        />
      )}

      <div className="relative z-10">{children}</div>
    </div>
  );
};

const Contact = () => {
  return (
    <section id="contact" className="min-h-screen py-20 relative flex items-center">
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
            <span className="text-cyber-secondary text-2xl font-bold">05.</span>
            <h2 className="text-4xl md:text-5xl font-bold text-cyber-primary glitch" data-text="Get In Touch">
              Get In Touch
            </h2>
            <div className="flex-1 h-[1px] bg-gradient-to-r from-cyber-primary/50 to-transparent ml-4"></div>
          </div>
          <p className="text-cyber-primary/70 ml-16">
            <span className="text-cyber-secondary">$</span> contact --init
          </p>
        </motion.div>

        {/* Contact Content */}
        <motion.div
          className="max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="glass-card p-8 md:p-12 terminal-border">
            <div className="mb-8">
              <p className="text-cyber-primary/80 text-lg leading-relaxed mb-6">
                I'm currently open to new opportunities and interesting projects.
                Whether you have a question or just want to say hi, feel free to
                reach out!
              </p>
              <p className="text-cyber-primary/70">
                <span className="text-cyber-secondary">$</span> echo "Let's build something
                amazing together!"
              </p>
            </div>

            {/* Contact Links */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ContactCard className="p-4 border border-cyber-primary/30 rounded hover:border-cyber-primary/60 transition-all duration-300 group">
                <motion.a
                  href={personalInfo.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4"
                  whileHover={{ x: 5 }}
                >
                  <FaGithub className="text-3xl text-cyber-primary group-hover:text-cyber-secondary transition-colors duration-300" />
                  <div>
                    <div className="text-cyber-secondary text-sm">GitHub</div>
                    <div className="text-cyber-primary text-sm">@parintorn1902</div>
                  </div>
                </motion.a>
              </ContactCard>

              <ContactCard className="p-4 border border-cyber-primary/30 rounded hover:border-cyber-primary/60 transition-all duration-300 group">
                <motion.a
                  href={personalInfo.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4"
                  whileHover={{ x: 5 }}
                >
                  <FaLinkedin className="text-3xl text-cyber-primary group-hover:text-cyber-secondary transition-colors duration-300" />
                  <div>
                    <div className="text-cyber-secondary text-sm">LinkedIn</div>
                    <div className="text-cyber-primary text-sm">parintorn-s</div>
                  </div>
                </motion.a>
              </ContactCard>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          className="text-center mt-20 text-cyber-primary/50 text-sm"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <p>
            <span className="text-cyber-secondary">{'<'}/</span>
            {' '}Designed & Built by {personalInfo.name}{' '}
            <span className="text-cyber-secondary">{'>'}</span>
          </p>
          <p className="mt-4 text-cyber-primary/30">© 2025 - Present</p>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
