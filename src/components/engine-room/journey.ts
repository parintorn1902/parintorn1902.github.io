import { personalInfo, projects } from '../../data/portfolio'
import type { Project } from '../../data/portfolio'

export type SectionId = 'about' | 'projects' | 'technologies' | 'experience' | 'contact'
export type Point3 = [number, number, number]
export interface Destination {
  id: string
  section: SectionId
  label: string
  model: 'engine' | 'project' | 'stack' | 'timeline' | 'contact'
  position: Point3
  camera: Point3
  target: Point3
  project?: Project
}

// UI, camera, model captions, screenshots and links all resolve from this same destination.
export const destinations: Destination[] = [
  { id: 'about', section: 'about', label: 'About', model: 'engine', position: [2, 0, 0], camera: [13, 8, 20], target: [-3, 3, 0] },
  ...projects.map((project, index): Destination => ({
    id: `project-${project.projectId}`, section: 'projects', label: project.projectName, model: 'project', project,
    position: [25 + index * 26, 0, -22 - index * 22],
    camera: [32 + index * 26 + (project.tags?.includes('JWT') ? 4 : 0), 8, -4 - index * 22 + (project.tags?.includes('JWT') ? 4 : 0)],
    target: [21.5 + index * 26 + (project.tags?.includes('JWT') ? 2 : 0), 3.2, -22 - index * 22],
  })),
  { id: 'technologies', section: 'technologies', label: 'Tech Stack', model: 'stack', position: [-24, 0, -23], camera: [-14, 8, -5], target: [-26, 3, -23] },
  { id: 'experience', section: 'experience', label: 'Experience', model: 'timeline', position: [-22, 0, -60], camera: [-14, 7, -44], target: [-26, 3, -60] },
  { id: 'contact', section: 'contact', label: 'Contact', model: 'contact', position: [15, 0, -82], camera: [22, 8, -64], target: [11.5, 3.2, -82] },
]

export const sections: { id: SectionId; label: string }[] = [
  { id: 'about', label: 'About' }, { id: 'projects', label: 'Projects' },
  { id: 'technologies', label: 'Tech Stack' }, { id: 'experience', label: 'Experience' },
  { id: 'contact', label: 'Contact' },
]
export const profile = personalInfo
export const destinationForHash = (hash: string) => destinations.find(d => d.section === hash.replace('#', '')) ?? destinations[0]
export const projectImage = (project: Project) => `${import.meta.env.BASE_URL}images/${project.projectPreviewImage}`
