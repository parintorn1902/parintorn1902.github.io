import { Suspense, useCallback, useEffect, useRef, useState } from 'react'
import type { ComponentRef, RefObject } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
import * as THREE from 'three'
import { destinations } from './journey'
import type { Destination } from './journey'
import { Exhibit } from './Models'

type Controls = ComponentRef<typeof OrbitControls>
interface WorldProps {
  target: Destination
  activeId: string
  animated: boolean
  traveling: boolean
  onArrive: (id: string) => void
}

function RenderClock({ enabled }: { enabled: boolean }) {
  const invalidate = useThree(state => state.invalidate)
  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | undefined
    function update() {
      clearInterval(timer)
      if (enabled && !document.hidden) timer = setInterval(invalidate, 1000 / 45)
      invalidate()
    }
    update(); document.addEventListener('visibilitychange', update)
    return () => { clearInterval(timer); document.removeEventListener('visibilitychange', update) }
  }, [enabled, invalidate])
  return null
}

function Lighting() {
  const get = useThree(state => state.get)
  useEffect(() => {
    const { scene, gl, invalidate } = get()
    const room = new RoomEnvironment()
    const generator = new THREE.PMREMGenerator(gl)
    const environment = generator.fromScene(room, .02)
    scene.environment = environment.texture; scene.environmentIntensity = .85
    invalidate()
    return () => { scene.environment = null; environment.dispose(); generator.dispose(); room.dispose() }
  }, [get])
  return <><hemisphereLight args={['#c3dbec', '#17130f', .65]} /><directionalLight position={[10, 20, 12]} intensity={3} color="#fff2df" /><directionalLight position={[-18, 8, -20]} intensity={2.4} color="#accbff" /></>
}

function CameraTravel({ target, animated, traveling, onArrive, controls }: Pick<WorldProps, 'target' | 'animated' | 'traveling' | 'onArrive'> & { controls: RefObject<Controls | null> }) {
  const { size, invalidate, get } = useThree()
  const previous = useRef<{ id: string; width: number; height: number } | null>(null)
  const flight = useRef<{ id: string; elapsed: number; curve: THREE.QuadraticBezierCurve3; from: THREE.Vector3; to: THREE.Vector3 } | null>(null)
  useEffect(() => {
    const camera = get().camera
    const end = new THREE.Vector3(...target.camera)
    const look = new THREE.Vector3(...target.target)
    if (size.width < 720) {
      const auth = target.project?.tags?.includes('JWT')
      const width = auth ? 15 : target.model === 'stack' || target.model === 'timeline' ? 13.5 : 12
      const direction = end.clone().sub(look).normalize()
      look.set(...target.position).add(new THREE.Vector3(auth ? 1.2 : 0, 3, 0))
      const halfFov = Math.tan(THREE.MathUtils.degToRad(46 / 2))
      const distance = Math.max(8.5 / (2 * halfFov), width / (2 * halfFov * size.width / size.height)) * 1.1
      end.copy(look).addScaledVector(direction, distance)
    }
    const control = controls.current
    const sameDestination = previous.current?.id === target.id
    const resized = previous.current !== null && (previous.current.width !== size.width || previous.current.height !== size.height)
    previous.current = { id: target.id, width: size.width, height: size.height }
    // A motion toggle at rest preserves the visitor's orbit instead of resetting the camera.
    if (sameDestination && !resized && !flight.current) { onArrive(target.id); invalidate(); return }
    const immediate = !animated || resized
    if (immediate) {
      flight.current = null; camera.position.copy(end); camera.lookAt(look)
      if (control) { control.target.copy(look); control.update() }
      if (camera instanceof THREE.PerspectiveCamera) { camera.fov = 46; camera.updateProjectionMatrix() }
      onArrive(target.id); invalidate(); return
    }
    const start = camera.position.clone()
    const mid = start.clone().lerp(end, .5)
    mid.y += Math.min(start.distanceTo(end) * .15, 6)
    mid.x += Math.min(start.distanceTo(end) * .09, 4)
    flight.current = { id: target.id, elapsed: 0, curve: new THREE.QuadraticBezierCurve3(start, mid, end), from: control?.target.clone() ?? new THREE.Vector3(), to: look }
    invalidate()
  }, [target, animated, traveling, size.width, size.height, get, controls, onArrive, invalidate])

  useFrame(({ camera }, delta) => {
    const move = flight.current
    if (!move) return
    move.elapsed += Math.min(delta, .08)
    const p = Math.min(move.elapsed / 1.8, 1)
    const eased = p < .5 ? 4 * p ** 3 : 1 - (-2 * p + 2) ** 3 / 2
    camera.position.copy(move.curve.getPoint(eased))
    const look = move.from.clone().lerp(move.to, eased)
    const control = controls.current
    if (control) { control.target.copy(look); control.update() } else camera.lookAt(look)
    if (camera instanceof THREE.PerspectiveCamera) { camera.fov = 46 + Math.sin(p * Math.PI) * 10; camera.updateProjectionMatrix() }
    if (p === 1) { flight.current = null; onArrive(move.id) }
  })
  return null
}

function Exhibits({ activeId, animated, onReady }: Pick<WorldProps, 'activeId' | 'animated'> & { onReady: () => void }) {
  useEffect(onReady, [onReady])
  return destinations.map(destination => <Exhibit key={destination.id} destination={destination} animate={animated && destination.id === activeId} />)
}

function Scene(props: WorldProps) {
  const controls = useRef<Controls>(null)
  const [assetsReady, setAssetsReady] = useState(false)
  const ready = useCallback(() => setAssetsReady(true), [])
  return <>
    <color attach="background" args={['#000000']} /><fog attach="fog" args={['#000000', 22, 52]} />
    <Lighting />
    <RenderClock enabled={props.animated || props.traveling} />
    <OrbitControls ref={controls} makeDefault enabled={!props.traveling} enablePan={false} enableZoom={false} enableDamping={props.animated && !props.traveling} minPolarAngle={.2} maxPolarAngle={Math.PI / 2 - .08} />
    {assetsReady && <CameraTravel target={props.target} animated={props.animated} traveling={props.traveling} onArrive={props.onArrive} controls={controls} />}
    <Suspense fallback={null}><Exhibits activeId={props.activeId} animated={props.animated} onReady={ready} /></Suspense>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -.53, -40]}><planeGeometry args={[220, 220]} /><meshStandardMaterial color="#020203" metalness={.1} roughness={.8} /></mesh>
  </>
}

export default function World(props: WorldProps & { onUnavailable: () => void }) {
  const { onUnavailable } = props
  const [supported] = useState(() => {
    const probe = document.createElement("canvas")
    const context = probe.getContext("webgl2")
    if (!context) return false
    context.getExtension("WEBGL_lose_context")?.loseContext()
    return true
  })
  useEffect(() => { if (!supported) onUnavailable() }, [supported, onUnavailable])
  if (!supported) return null
  return <Canvas camera={{ position: [17, 11, 25], fov: 46, near: .1, far: 220 }} dpr={[1, 1.5]} frameloop="demand" gl={{ antialias: true, powerPreference: "high-performance" }}><Scene {...props} /></Canvas>
}
