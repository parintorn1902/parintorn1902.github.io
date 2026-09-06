import { useEffect, useMemo, useRef } from 'react'
import type { DependencyList } from 'react'
import { useFrame, useLoader } from '@react-three/fiber'
import { ContactShadows, useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { experiences, technologies } from '../../data/portfolio'
import { profile, projectImage } from './journey'
import type { Destination } from './journey'
import type { Project } from '../../data/portfolio'
import { informationScreen, nameplate, projectScreen } from './surface-textures'

type Surfaces = Record<string, THREE.Texture>
type Asset = 'core' | 'terminal' | 'server' | 'stack' | 'timeline'
const MODEL_BASE = `${import.meta.env.BASE_URL}models/`

/** Instances share cached geometry; only display materials belong to this instance. */
function WorkshopAsset({ asset, surfaces, animate = false }: { asset: Asset; surfaces: Surfaces; animate?: boolean }) {
  const object = useRef<THREE.Group>(null)
  const { scene } = useGLTF(`${MODEL_BASE}hacker-workshop/${asset}.glb`, `${MODEL_BASE}draco/`)
  const instance = useMemo(() => {
    const root = scene.clone(true)
    const materials: THREE.Material[] = []
    Object.entries(surfaces).forEach(([name, texture]) => {
      const screen = root.getObjectByName(name)
      if (!(screen instanceof THREE.Mesh)) throw new Error(`Missing Blender display: ${asset}/${name}`)
      const material = new THREE.MeshBasicMaterial({ map: texture, toneMapped: false })
      screen.material = material; materials.push(material)
      screen.userData.portfolioSurface = name
    })
    return { root, materials }
  }, [scene, surfaces, asset])
  useEffect(() => () => instance.materials.forEach(material => material.dispose()), [instance])
  useFrame((_, delta) => {
    if (!animate) return
    const dt = Math.min(delta, .05)
    const outer = object.current?.getObjectByName('ROTOR_outer')
    const inner = object.current?.getObjectByName('ROTOR_inner')
    if (outer) outer.rotation.x += dt*.17
    if (inner) inner.rotation.y -= dt*.26
  })
  return <primitive ref={object} object={instance.root} dispose={null} />
}

function useSurfaces(factory: () => Surfaces, dependencies: DependencyList) {
  // Call sites specify the source data used to paint each physical display.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const surfaces = useMemo(factory, dependencies)
  useEffect(() => () => Object.values(surfaces).forEach(texture => texture.dispose()), [surfaces])
  return surfaces
}

function Engine({ animate }: { animate: boolean }) {
  const surfaces = useSurfaces(() => ({ LABEL_core: nameplate('WEB / MOBILE / BACKEND') }), [])
  return <WorkshopAsset asset="core" surfaces={surfaces} animate={animate} />
}

function ProjectDisplay({ project }: { project: Project }) {
  const image = useLoader(THREE.TextureLoader, projectImage(project))
  const surfaces = useSurfaces(() => ({
    SCREEN_project: projectScreen(image.image as HTMLImageElement),
    LABEL_project: nameplate(project.projectName),
  }), [image, project])
  const serverSurfaces = useSurfaces(() => ({ LABEL_server: nameplate((project.tags ?? []).filter(tag => tag === 'Node.js' || tag === 'JWT').join(' / ')) }), [project])
  const isAuth = project.tags?.includes('JWT') ?? false
  return <>
    <WorkshopAsset asset="terminal" surfaces={surfaces} />
    {isAuth && <group position={[6.7, -.75, -.4]}><WorkshopAsset asset="server" surfaces={serverSurfaces} /></group>}
  </>
}

function StackDisplay() {
  const surfaces = useSurfaces(() => ({
    SCREEN_web: informationScreen('Frontend', technologies.frontend.techs[0].name, technologies.frontend.techs[0].items.slice(0, 3)),
    SCREEN_mobile: informationScreen('Mobile', technologies.frontend.techs[1].name, technologies.frontend.techs[1].items.filter(item => item === 'Expo' || item === 'Native Modules'), true),
    ...Object.fromEntries(technologies.backend.techs.map((tech, i) => [`LABEL_backend_${i}`, nameplate(tech.name)])),
  }), [])
  return <WorkshopAsset asset="stack" surfaces={surfaces} />
}

function TimelineDisplay() {
  const surfaces = useSurfaces(() => Object.fromEntries([...experiences].reverse().map((experience, i) => [
    `SCREEN_experience_${i}`, informationScreen(experience.period, experience.position, [experience.workplace, experience.techStacks.slice(0, 3).join(' / ')]),
  ])), [])
  return <WorkshopAsset asset="timeline" surfaces={surfaces} />
}

function ContactDisplay() {
  const surfaces = useSurfaces(() => ({
    SCREEN_project: informationScreen('Contact', profile.name, [profile.title, profile.email, `github.com${new URL(profile.github).pathname}`]),
    LABEL_project: nameplate('LET’S BUILD SOMETHING'),
  }), [])
  return <WorkshopAsset asset="terminal" surfaces={surfaces} />
}

export function Exhibit({ destination, animate }: { destination: Destination; animate: boolean }) {
  return <group position={destination.position} name={destination.id}>
    {destination.model === 'engine' && <Engine animate={animate} />}
    {destination.model === 'project' && destination.project && <ProjectDisplay project={destination.project} />}
    {destination.model === 'stack' && <StackDisplay />}
    {destination.model === 'timeline' && <TimelineDisplay />}
    {destination.model === 'contact' && <ContactDisplay />}
    <ContactShadows position={[0, -.49, 0]} scale={22} opacity={.35} blur={4} far={9} resolution={256} frames={1} />
    <pointLight position={[2, 7, 4]} color="#fff0dc" intensity={20} distance={18} decay={2} />
  </group>
}
