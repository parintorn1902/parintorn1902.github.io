import type { ReactNode } from 'react'
import { experiences, technologies, skills } from '../../data/portfolio'
import { profile, projectImage } from './journey'
import type { Destination } from './journey'

const External = ({ href, children }: { href: string; children: ReactNode }) => <a href={href} target="_blank" rel="noopener noreferrer">{children} <span aria-hidden="true">↗</span></a>

export function DestinationContent({ destination, fallback, onDetails }: { destination: Destination; fallback: boolean; onDetails: () => void }) {
  const project = destination.project
  return <>
    {destination.model === 'engine' && <>
      <p className="eyebrow">{profile.name} / {profile.title}</p>
      <h1>Complex systems.<br /><span>Made simple.</span></h1>
      <p className="intro">I build the interface, the engine, and everything in between. Web, mobile, backend, and infrastructure.</p>
      <button className="text-action" onClick={onDetails}>Meet the engineer <span aria-hidden="true">↗</span></button>
    </>}
    {project && <>
      <p className="eyebrow">Selected project / {String(project.projectId).padStart(2, '0')}</p>
      <h1>{project.projectName}</h1>
      <p className="intro">{project.projectDesc}</p>
      <p className="stack-label">{project.tags?.join(' / ')}</p>
      {fallback && <img className="fallback-project" src={projectImage(project)} alt={`${project.projectName} screenshot`} />}
      <div className="content-links">
        {project.projectSourceLink && <External href={project.projectSourceLink}>View source</External>}
        {project.projectDemoLink && <External href={project.projectDemoLink}>Live demo</External>}
      </div>
      <p className="scene-caption">{project.tags?.includes('JWT') ? 'Sign-in interface → Node.js API → JWT authentication' : 'Actual project screenshot on the display'}</p>
    </>}
    {destination.model === 'stack' && <>
      <p className="eyebrow">Tech Stack</p><h1>From screen<br />to system.</h1>
      <dl className="stack-overview"><div><dt>Frontend & mobile</dt><dd>{technologies.frontend.techs.map(t => t.name).join(' / ')}</dd></div><div><dt>Backend</dt><dd>{technologies.backend.techs.map(t => t.name).join(' / ')}</dd></div><div><dt>Cloud & delivery</dt><dd>{skills.cloud.slice(0, 2).join(' / ')} / Docker</dd></div></dl>
      <button className="text-action" onClick={onDetails}>Explore the full stack <span aria-hidden="true">↗</span></button>
    </>}
    {destination.model === 'timeline' && <>
      <p className="eyebrow">Experience</p><h1>Built through<br />experience.</h1>
      <ol className="career-list">{experiences.map(experience => <li key={experience.period}><span>{experience.period}</span><h2>{experience.position}</h2><p>{experience.workplace}</p></li>)}</ol>
      <button className="text-action" onClick={onDetails}>Roles & responsibilities <span aria-hidden="true">↗</span></button>
    </>}
    {destination.model === 'contact' && <>
      <p className="eyebrow">Contact / {profile.name}</p><h1>Let’s build<br />something.</h1>
      <p className="intro">Have a project, a hard problem, or an idea worth exploring? Let’s talk.</p>
      <a className="email-link" href={`mailto:${profile.email}`}>{profile.email}</a>
      <div className="content-links"><External href={profile.github}>GitHub</External><External href={profile.linkedin}>LinkedIn</External></div>
    </>}
  </>
}

export function FullDetails({ destination }: { destination: Destination }) {
  if (destination.model === 'stack') return <>
    <h2 id="details-title">The full stack</h2>
    {Object.values(technologies).map(category => <section key={category.category}><h3>{category.category}</h3>{category.techs.map(tech => <div className="detail-tech" key={tech.name}><h4>{tech.name}</h4><p>{tech.items.join(' · ')}</p></div>)}</section>)}
    {Object.entries(skills).map(([name, items]) => <section key={name}><h3>{name === 'ai' ? 'AI tools' : name}</h3><p>{items.join(' · ')}</p></section>)}
  </>
  if (destination.model === 'timeline') return <>
    <h2 id="details-title">Experience</h2>
    {experiences.map(experience => <section key={experience.period}><p className="eyebrow">{experience.period}</p><h3>{experience.position}</h3><p>{experience.workplace}</p><ul>{experience.detail.map(detail => <li key={detail}>{detail}</li>)}</ul><p>{experience.techStacks.join(' · ')}</p></section>)}
  </>
  return <><p className="eyebrow">{profile.title}</p><h2 id="details-title">{profile.name}</h2><p>{profile.description}</p><div className="content-links"><External href={profile.github}>GitHub</External><External href={profile.linkedin}>LinkedIn</External></div><a href={`mailto:${profile.email}`}>{profile.email}</a></>
}
