import { destinations } from '../engine-room/journey'
import { personalInfo } from '../../data/portfolio'

const positions: [number, number, number][] = [
  [0, 0, 0],
  [22, 0, -12],
  [25, 0, -36],
  [1, 0, -49],
  [-23, 0, -35],
  [-22, 0, -10],
]
const titles = [
  'Serious code.',
  '',
  '',
  'Tools for the quest.',
  'A few save points.',
  'Let’s build something.',
]
const descriptions = [
  'Web, mobile, backend. A small world of things I build.',
  '',
  '',
  'React, React Native, Node.js, Golang, and Java. Different tools. Same curiosity.',
  'From freelance builds to technical work at TechBerry.',
  'Found an interesting problem? I would love to hear about it.',
]
export const hello = 'Boop here. Mind the edge. I just mopped the void.'
export const banter = [
  hello,
  'A movie night, built from scratch.',
  'This bouncer checks JWTs.',
  'So many tools. Still looking for the snack drawer.',
  'Every engineer starts somewhere.',
  'End of the map. Start of a conversation.',
]
export const stops = destinations.map((destination, i) => ({
  ...destination,
  position: positions[i],
  title: destination.project?.projectName ?? titles[i],
  description: destination.project?.projectDesc ?? descriptions[i],
  label: [
    'Welcome',
    'Netflix',
    'CRUD & JWT',
    'Tech stack',
    'Experience',
    'Contact',
  ][i],
  model: ['core', 'terminal', 'terminal', 'stack', 'timeline', 'terminal'][i],
  kicker:
    i === 0
      ? `${personalInfo.name} · ${personalInfo.title}`
      : (destination.project?.tags?.join(' / ') ?? destination.label),
}))
export const stopForHash = () =>
  Math.max(
    0,
    stops.findIndex(
      (s) =>
        s.id === location.hash.slice(1) || s.section === location.hash.slice(1),
    ),
  )
