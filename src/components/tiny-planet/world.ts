import * as T from 'three'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
import { createScenery } from './scenery'
import { banter, stops as dataStops } from './stops'

const stops = dataStops.map((s) => ({
  ...s,
  position: new T.Vector3(...s.position),
}))

interface Events {
  active: (index: number) => void
  progress: (value: number) => void
  ready: (value: boolean) => void
  mode: (exploring: boolean) => void
  nearby: (value: boolean) => void
  say: (text: string) => void
  inspect: (index: number) => void
  unavailable: () => void
}

function supported(p: T.Vector3) {
  if (
    stops.some((s) => Math.hypot(p.x - s.position.x, p.z - s.position.z) < 7.6)
  )
    return true
  return stops.some((s, i) => {
    const b = stops[(i + 1) % stops.length].position,
      x = b.x - s.position.x,
      z = b.z - s.position.z
    const t = T.MathUtils.clamp(
      ((p.x - s.position.x) * x + (p.z - s.position.z) * z) / (x * x + z * z),
      0,
      1,
    )
    return (
      Math.hypot(p.x - s.position.x - x * t, p.z - s.position.z - z * t) < 0.95
    )
  })
}
function blocked(p: T.Vector3) {
  return stops.some(
    (s) =>
      Math.abs(p.x - s.position.x) < 2.5 &&
      Math.abs(p.z - s.position.z) < 1.9 &&
      p.y < 3,
  )
}

export function createWorld(
  canvas: HTMLCanvasElement,
  events: Events,
  initial: number,
  initialMotion: boolean,
) {
  const renderer = new T.WebGLRenderer({
    canvas,
    antialias: true,
    powerPreference: 'high-performance',
  })
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5))
  renderer.toneMapping = T.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.2
  const scene = new T.Scene()
  scene.background = new T.Color(0)
  scene.fog = new T.Fog(0, 55, 120)
  const camera = new T.PerspectiveCamera(43, 1, 0.1, 180)
  const room = new RoomEnvironment(),
    pmrem = new T.PMREMGenerator(renderer)
  const environment = pmrem.fromScene(room, 0.03)
  scene.environment = environment.texture
  scene.environmentIntensity = 0.45
  room.dispose()
  pmrem.dispose()
  scene.add(new T.HemisphereLight(0xdaf7ff, 0x3d3148, 2))
  const sun = new T.DirectionalLight(0xffefcb, 3.3),
    rim = new T.DirectionalLight(0x9bd7ff, 2)
  sun.position.set(-15, 35, 20)
  rim.position.set(20, 15, -30)
  scene.add(sun, rim)
  const scenery = createScenery(scene)
  const keys = new Set<string>(),
    pointer = new T.Vector2(),
    player = new T.Vector3(),
    velocity = new T.Vector3(),
    trial = new T.Vector3()
  const desiredEye = new T.Vector3(),
    desiredLook = new T.Vector3(),
    look = new T.Vector3()
  const eyePath = new T.CatmullRomCurve3(
    stops.map((s) => s.position.clone().add(new T.Vector3(15, 15, 24))),
    false,
    'catmullrom',
    0.25,
  )
  const lookPath = new T.CatmullRomCurve3(
    stops.map((s) => s.position.clone().add(new T.Vector3(-5, 2.3, 0))),
    false,
    'catmullrom',
    0.25,
  )
  let active = initial,
    progress = initial,
    target = initial,
    exploring = false,
    motion = initialMotion,
    paused = false,
    ready = false,
    disposed = false
  let dirty = true,
    elapsed = 0,
    last = performance.now(),
    raf = 0,
    yaw = 0.35,
    vertical = 0,
    grounded = true,
    nearby = true
  let settleTimer: ReturnType<typeof setTimeout> | undefined
  let failed = false
  let animate: Awaited<ReturnType<typeof scenery.load>> | undefined
  const resources = new Set<T.BufferGeometry | T.Material | T.Texture>()
  function collect() {
    scene.traverse((o) => {
      if (o instanceof T.Mesh || o instanceof T.Points) {
        resources.add(o.geometry)
        for (const m of Array.isArray(o.material) ? o.material : [o.material]) {
          resources.add(m)
          for (const value of Object.values(m))
            if (value instanceof T.Texture) resources.add(value)
        }
      }
    })
  }
  function disposeResources() {
    collect()
    resources.forEach((r) => r.dispose())
    resources.clear()
  }
  scenery
    .load()
    .then((fn) => {
      if (disposed || failed) {
        disposeResources()
        return
      }
      animate = fn
      ready = true
      dirty = true
      events.ready(true)
    })
    .catch(() => {
      if (!disposed) {
        failed = true
        events.unavailable()
        dirty = true
      }
    })
  function updateActive(index: number) {
    if (active === index) return
    active = index
    events.active(index)
    events.say(banter[index])
  }
  function spawn() {
    player.copy(stops[active].position).add(new T.Vector3(3, 0, 3.5))
    vertical = 0
    grounded = true
  }
  function setExplore(value: boolean) {
    if (value && !ready) return
    exploring = value
    clearTimeout(settleTimer)
    keys.clear()
    events.mode(value)
    if (value) {
      spawn()
      yaw = 0.35
      canvas.focus({ preventScroll: true })
      events.say('You’re driving! WASD to move. Space to test gravity.')
    } else {
      target = active
      progress = active
      events.progress(active)
      events.say(banter[active])
    }
    dirty = true
  }
  function go(index: number) {
    if (exploring) setExplore(false)
    target = T.MathUtils.clamp(index, 0, stops.length - 1)
    clearTimeout(settleTimer)
    // Finish a scroll/swipe at a readable station once input settles.
    if (!Number.isInteger(target)) {
      settleTimer = setTimeout(() => go(Math.round(target)), 180)
    }
    dirty = true
  }
  function jump() {
    if (exploring && grounded && !paused) {
      vertical = 6.8
      grounded = false
      dirty = true
    }
  }
  const abort = new AbortController()
  const signal = abort.signal
  window.addEventListener(
    'keydown',
    (e) => {
      if (
        paused ||
        (e.target instanceof Element &&
          e.target.closest('input,textarea,button,a'))
      )
        return
      const movement = [
        'KeyW',
        'KeyA',
        'KeyS',
        'KeyD',
        'ArrowUp',
        'ArrowDown',
        'ArrowLeft',
        'ArrowRight',
        'Space',
      ].includes(e.code)
      if (movement) e.preventDefault()
      if (exploring) {
        keys.add(e.code)
        if (e.code === 'Space') jump()
        if (e.code === 'KeyE' && nearby) events.inspect(active)
        if (e.code === 'Escape') setExplore(false)
      } else {
        if (['ArrowLeft', 'ArrowUp'].includes(e.code))
          go(Math.round(target) - 1)
        if (['ArrowRight', 'ArrowDown'].includes(e.code))
          go(Math.round(target) + 1)
      }
      dirty = true
    },
    { signal },
  )
  window.addEventListener('keyup', (e) => keys.delete(e.code), { signal })
  window.addEventListener('blur', () => keys.clear(), { signal })
  document.addEventListener(
    'visibilitychange',
    () => {
      keys.clear()
      last = performance.now()
      dirty = true
    },
    { signal },
  )
  canvas.parentElement!.addEventListener(
    'wheel',
    (e) => {
      if (exploring || paused || e.ctrlKey) return
      const targetElement = e.target instanceof Element ? e.target : null
      if (targetElement?.closest('dialog,input')) return
      const story = targetElement?.closest('#story')
      if (story && story.scrollHeight > story.clientHeight) return
      e.preventDefault()
      go(
        target +
          e.deltaY *
            (e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? innerHeight : 1) *
            0.0014,
      )
    },
    { signal, passive: false },
  )
  let down: { x: number; y: number; lastX: number; lastY: number } | null = null
  function point(e: PointerEvent) {
    const r = canvas.getBoundingClientRect()
    pointer.set(
      ((e.clientX - r.left) / r.width) * 2 - 1,
      (-(e.clientY - r.top) / r.height) * 2 + 1,
    )
  }
  canvas.addEventListener(
    'pointerdown',
    (e) => {
      point(e)
      down = { x: e.clientX, y: e.clientY, lastX: e.clientX, lastY: e.clientY }
      canvas.setPointerCapture(e.pointerId)
    },
    { signal },
  )
  canvas.addEventListener(
    'pointermove',
    (e) => {
      point(e)
      if (down) {
        if (exploring) yaw -= (e.clientX - down.lastX) * 0.006
        else if (e.pointerType === 'touch')
          go(target + (down.lastY - e.clientY) * 0.009)
        down.lastX = e.clientX
        down.lastY = e.clientY
      }
      dirty = true
    },
    { signal },
  )
  const raycaster = new T.Raycaster()
  canvas.addEventListener(
    'pointerup',
    (e) => {
      if (
        down &&
        !paused &&
        Math.hypot(e.clientX - down.x, e.clientY - down.y) < 8
      ) {
        point(e)
        raycaster.setFromCamera(pointer, camera)
        let object: T.Object3D | null =
          raycaster.intersectObjects(scenery.clickable, true)[0]?.object ?? null
        while (object && object.userData.station === undefined)
          object = object.parent
        if (object) {
          const index = object.userData.station as number
          if (exploring) {
            if (player.distanceTo(stops[index].position) < 10)
              events.inspect(index)
            else events.say('Follow the bridge to that station.')
          } else if (index === active) events.inspect(index)
          else go(index)
        }
      }
      down = null
    },
    { signal },
  )
  canvas.addEventListener(
    'pointercancel',
    () => {
      down = null
      keys.clear()
    },
    { signal },
  )
  canvas.addEventListener(
    'webglcontextlost',
    (e) => {
      e.preventDefault()
      failed = true
      events.unavailable()
      ready = false
      setExplore(false)
    },
    { signal },
  )
  function resize() {
    const r = canvas.getBoundingClientRect()
    renderer.setSize(r.width, r.height, false)
    camera.aspect = r.width / Math.max(r.height, 1)
    camera.updateProjectionMatrix()
    dirty = true
  }
  const observer = new ResizeObserver(resize)
  observer.observe(canvas)
  resize()
  spawn()
  function frame(now: number) {
    if (disposed || failed) return
    raf = requestAnimationFrame(frame)
    if (document.hidden || now - last < 1000 / 45) return
    const dt = Math.min((now - last) / 1000, 0.05)
    last = now
    const changing = Math.abs(progress - target) > 0.0001
    if (paused && !dirty) return
    if (!dirty && !motion && !changing && !exploring) return
    dirty = false
    if (motion && !paused) elapsed += dt
    let distance = 0
    if (exploring && ready) {
      if (!paused) {
        const dx =
          Number(keys.has('KeyD') || keys.has('ArrowRight')) -
          Number(keys.has('KeyA') || keys.has('ArrowLeft'))
        const dz =
          Number(keys.has('KeyW') || keys.has('ArrowUp')) -
          Number(keys.has('KeyS') || keys.has('ArrowDown'))
        velocity.set(
          Math.cos(yaw) * dx - Math.sin(yaw) * dz,
          0,
          -Math.sin(yaw) * dx - Math.cos(yaw) * dz,
        )
        const previousX = player.x,
          previousZ = player.z
        if (velocity.lengthSq()) {
          velocity.normalize().multiplyScalar(3.2 * dt)
          trial.copy(player)
          trial.x += velocity.x
          if (!blocked(trial)) player.x = trial.x
          trial.copy(player)
          trial.z += velocity.z
          if (!blocked(trial)) player.z = trial.z
          if (player.x !== previousX || player.z !== previousZ)
            scenery.botHolder.rotation.y = Math.atan2(
              player.x - previousX,
              player.z - previousZ,
            )
        }
        distance = Math.hypot(player.x - previousX, player.z - previousZ)
        vertical -= 17 * dt
        player.y += vertical * dt
        if (player.y <= 0 && supported(player) && vertical <= 0) {
          player.y = 0
          vertical = 0
          grounded = true
        } else grounded = false
        if (player.y < -7) {
          spawn()
          distance = 0
          events.say('Gravity won that round. Boop is fine.')
        }
        const closest = stops.reduce(
          (best, s, i) =>
            player.distanceTo(s.position) <
            player.distanceTo(stops[best].position)
              ? i
              : best,
          0,
        )
        if (player.distanceTo(stops[closest].position) < 9)
          updateActive(closest)
        const isNear = player.distanceTo(stops[active].position) < 10
        if (isNear !== nearby) {
          nearby = isNear
          events.nearby(nearby)
        }
      }
      desiredLook.copy(player).add(new T.Vector3(0, 1.6, 0))
      desiredEye
        .copy(player)
        .add(new T.Vector3(Math.sin(yaw) * 10, 7, Math.cos(yaw) * 10))
      camera.position.lerp(desiredEye, 1 - Math.exp(-dt * 5))
      look.lerp(desiredLook, 1 - Math.exp(-dt * 7))
    } else {
      progress = motion ? T.MathUtils.damp(progress, target, 5, dt) : target
      if (Math.abs(progress - target) < 0.001) progress = target
      updateActive(Math.round(progress))
      events.progress(progress)
      desiredEye.copy(eyePath.getPoint(progress / (stops.length - 1)))
      desiredLook.copy(lookPath.getPoint(progress / (stops.length - 1)))
      if (innerWidth <= 720) {
        const center = stops[Math.floor(progress)].position
          .clone()
          .lerp(
            stops[Math.min(stops.length - 1, Math.floor(progress) + 1)]
              .position,
            progress % 1,
          )
        desiredLook.copy(center).add(new T.Vector3(0, 1.3, 0))
        desiredEye
          .copy(center)
          .add(
            new T.Vector3(12, 15, 23).multiplyScalar(
              Math.max(1, 0.85 / camera.aspect),
            ),
          )
      }
      if (motion) {
        desiredEye.x += pointer.x * 0.6
        desiredEye.y += pointer.y * 0.24
      }
      camera.position.copy(desiredEye)
      look.copy(desiredLook)
      spawn()
      scenery.botHolder.rotation.y = 0.3
    }
    camera.lookAt(look)
    scenery.botHolder.position.copy(player)
    const gait = paused ? undefined : animate?.(distance, grounded, dt)
    scenery.botShadow.visible = supported(player)
    scenery.botShadow.position.set(player.x, 0.025, player.z)
    scenery.botShadow.scale.setScalar(Math.max(0.4, 1 - player.y * 0.07))
    if (motion && !paused) {
      scenery.rotors.forEach((o, i) => {
        o.rotation[i % 2 ? 'x' : 'y'] += dt * 0.18
      })
      scenery.floaters.forEach((o, i) => {
        o.position.y += Math.sin(elapsed * 0.35 + i) * dt * 0.06
      })
    }
    // Development-only movement telemetry for reproducible gait and collision checks.
    if (import.meta.env.DEV) {
      canvas.dataset.player = player
        .toArray()
        .map((n) => n.toFixed(3))
        .join(',')
      canvas.dataset.gait = JSON.stringify(gait)
      canvas.dataset.joints = JSON.stringify(
        ['hip_left', 'hip_right', 'knee_left', 'knee_right'].map(
          (n) => scenery.botHolder.getObjectByName(n)?.rotation.x,
        ),
      )
    }
    renderer.render(scene, camera)
  }
  raf = requestAnimationFrame(frame)
  return {
    go,
    explore: setExplore,
    jump,
    key: (code: string, value: boolean) => {
      if (value) keys.add(code)
      else keys.delete(code)
    },
    motion: (value: boolean) => {
      motion = value
      dirty = true
    },
    pause: (value: boolean) => {
      paused = value
      keys.clear()
      dirty = true
    },
    dispose: () => {
      disposed = true
      cancelAnimationFrame(raf)
      clearTimeout(settleTimer)
      abort.abort()
      observer.disconnect()
      disposeResources()
      scenery.dispose()
      environment.dispose()
      renderer.dispose()
      renderer.forceContextLoss()
    },
  }
}
export type WorldController = ReturnType<typeof createWorld>
