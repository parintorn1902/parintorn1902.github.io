import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import {
  personalInfo,
  projects,
  technologies,
  experiences,
} from '../../data/portfolio'
import { stops as dataStops } from './stops'
import { animateBoop, BOOP_SCALE } from './boop'

const stops = dataStops.map((s) => ({
  ...s,
  position: new THREE.Vector3(...s.position),
}))

export function createScenery(scene: THREE.Scene) {
  const config = {
    color: 0xbfff70,
    other: 0xff8b9b,
    ground: 0x7cc773,
    shell: 0x78c9ae,
    cream: 0xf5eccd,
  }
  const world = new THREE.Group()
  scene.add(world)
  const clickable: THREE.Object3D[] = [],
    stationGroups: THREE.Group[] = [],
    rotors: THREE.Object3D[] = [],
    floaters: THREE.Object3D[] = []
  const mat = (color: number, roughness = 0.68) =>
    new THREE.MeshStandardMaterial({ color, roughness, metalness: 0.02 })
  const materials = {
    cream: mat(config.cream),
    ground: mat(config.ground),
    accent: mat(config.color),
    other: mat(config.other),
    shell: mat(config.shell),
    dark: mat(0x15202b),
    wood: mat(0xd49d67),
  }
  function box(
    parent: THREE.Object3D,
    size: [number, number, number],
    at: [number, number, number],
    material: THREE.Material = materials.cream,
    radius = 0.15,
  ) {
    const o = new THREE.Mesh(
      new RoundedBoxGeometry(
        ...size,
        3,
        Math.min(radius, ...size.map((v) => v / 2)),
      ),
      material,
    )
    o.position.set(...at)
    parent.add(o)
    return o
  }
  function ball(
    parent: THREE.Object3D,
    radius: number,
    at: [number, number, number],
    material: THREE.Material = materials.cream,
    detail = 2,
  ) {
    const o = new THREE.Mesh(
      new THREE.IcosahedronGeometry(radius, detail),
      material,
    )
    o.position.set(...at)
    parent.add(o)
    return o
  }
  function cylinder(
    parent: THREE.Object3D,
    radius: number,
    height: number,
    at: [number, number, number],
    material: THREE.Material = materials.ground,
    sides = 48,
  ) {
    const o = new THREE.Mesh(
      new THREE.CylinderGeometry(radius, radius * 0.92, height, sides),
      material,
    )
    o.position.set(...at)
    parent.add(o)
    return o
  }

  function textTexture(
    title: string,
    lines: string[] = [],
    width = 1024,
    height = 576,
  ) {
    const c = document.createElement('canvas')
    c.width = width
    c.height = height
    const x = c.getContext('2d')!
    x.fillStyle = '#102329'
    x.fillRect(0, 0, width, height)
    x.fillStyle = '#bfff96'
    x.fillRect(55, 55, 34, 5)
    x.font = 'bold 51px Arial'
    x.fillStyle = '#fff5df'
    x.fillText(title, 55, 160, width - 110)
    x.font = '25px monospace'
    lines.forEach((line, i) => {
      x.fillStyle = i === 0 ? '#fff098' : '#b1d4cf'
      x.fillText(line, 55, 245 + i * 58, width - 110)
    })
    const t = new THREE.CanvasTexture(c)
    t.colorSpace = THREE.SRGBColorSpace
    t.flipY = false
    return t
  }
  function label(
    parent: THREE.Object3D,
    title: string,
    at: [number, number, number],
    width = 4,
    height = 0.6,
  ) {
    const t = textTexture(title, [], 1024, 240)
    const m = new THREE.Mesh(
      new THREE.PlaneGeometry(width, height),
      new THREE.MeshBasicMaterial({
        map: t,
        toneMapped: false,
        side: THREE.DoubleSide,
      }),
    )
    t.flipY = true
    m.position.set(...at)
    parent.add(m)
    return m
  }
  const shadowCanvas = document.createElement('canvas')
  shadowCanvas.width = 128
  shadowCanvas.height = 128
  const sx = shadowCanvas.getContext('2d')!,
    gr = sx.createRadialGradient(64, 64, 1, 64, 64, 63)
  gr.addColorStop(0, '#0008')
  gr.addColorStop(1, '#0000')
  sx.fillStyle = gr
  sx.fillRect(0, 0, 128, 128)
  const shadowMap = new THREE.CanvasTexture(shadowCanvas)
  function shadow(
    parent: THREE.Object3D,
    width: number,
    depth: number,
    at: [number, number, number],
  ) {
    const m = new THREE.Mesh(
      new THREE.PlaneGeometry(width, depth),
      new THREE.MeshBasicMaterial({
        map: shadowMap,
        transparent: true,
        depthWrite: false,
      }),
    )
    m.rotation.x = -Math.PI / 2
    m.position.set(...at)
    parent.add(m)
    return m
  }
  function bridge(a: THREE.Vector3, b: THREE.Vector3) {
    const delta = b.clone().sub(a),
      length = delta.length() - 15,
      g = new THREE.Group()
    g.position.copy(a).lerp(b, 0.5)
    g.rotation.y = Math.atan2(delta.x, delta.z)
    world.add(g)
    for (let i = 0; i < Math.ceil(length / 0.65); i++)
      box(
        g,
        [2, 0.2, 0.53],
        [0, -0.1, -length / 2 + i * 0.65],
        materials.wood,
        0.04,
      )
    for (const x of [-1.1, 1.1])
      box(g, [0.07, 0.09, length], [x, 0.02, 0], materials.accent, 0.02)
  }

  for (let i = 0; i < stops.length; i++) {
    if (i < stops.length - 1) bridge(stops[i].position, stops[i + 1].position)
  }
  bridge(stops[stops.length - 1].position, stops[0].position)
  for (const [i, stop] of stops.entries()) {
    const group = new THREE.Group()
    group.position.copy(stop.position)
    world.add(group)
    stationGroups.push(group)
    {
      cylinder(group, 8, 1.2, [0, -0.85, 0], materials.ground)
      cylinder(group, 7.7, 0.18, [0, -0.09, 0], mat(0xa2d977))
      for (let t = 0; t < 7; t++) {
        const a = t * 2.4 + i,
          r = 6.2
        const x = Math.cos(a) * r,
          z = Math.sin(a) * r
        if (z > 2 && Math.abs(x) < 4) continue
        // Keep the two bridge entrances clear of trees.
        if (
          [(i + 1) % stops.length, (i + stops.length - 1) % stops.length].some(
            (neighbor) => {
              const direction = stops[neighbor].position
                .clone()
                .sub(stop.position)
                .normalize()
              return (x * direction.x + z * direction.z) / r > 0.9
            },
          )
        )
          continue
        cylinder(group, 0.15, 1.4, [x, 0.5, z], materials.wood, 8)
        ball(group, 0.85, [x, 1.6, z], mat(t % 2 ? 0x459973 : 0x88ba65), 1)
        ball(group, 0.48, [x + 0.45, 1.32, z + 0.2], materials.ground, 1)
      }
      for (let t = 0; t < 5; t++) {
        const a = t * 1.9 + 1.2
        const x = Math.cos(a) * 6.5,
          z = Math.sin(a) * 6.5
        cylinder(group, 0.08, 0.35, [x, 0.12, z], materials.cream, 8)
        const cap = ball(group, 0.35, [x, 0.36, z], materials.other)
        cap.scale.y = 0.55
      }
    }
    shadow(group, 9, 6, [0, 0.035, 0])
    const sign = new THREE.Group()
    sign.position.set(-4.5, 0, 4)
    group.add(sign)
    cylinder(sign, 0.065, 1.2, [0, 0.55, 0], materials.wood, 10)
    box(sign, [2.7, 0.64, 0.16], [0, 1.13, 0], materials.cream, 0.12)
    label(sign, stop.label, [0, 1.14, 0.091], 2.5, 0.54)
    group.userData.station = i
    clickable.push(group)
  }
  // Three-dimensional scenery at different distances makes the camera journey's parallax visible.
  const starVertices = []
  for (let i = 0; i < 260; i++) {
    const a = i * 2.39996,
      r = 35 + (i % 13) * 4
    starVertices.push(
      Math.cos(a) * r,
      10 + ((i * 7) % 43),
      -25 + Math.sin(a) * r,
    )
  }
  const starGeometry = new THREE.BufferGeometry()
  starGeometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(starVertices, 3),
  )
  const stars = new THREE.Points(
    starGeometry,
    new THREE.PointsMaterial({
      color: 0x8b9b77,
      size: 0.075,
      transparent: true,
      opacity: 0.7,
    }),
  )
  world.add(stars)
  for (let i = 0; i < 8; i++) {
    const cloud = new THREE.Group()
    cloud.position.set(-30 + i * 10, 10 + (i % 3) * 2, -25 - i * 5)
    for (let j = 0; j < 3; j++) {
      const puff = ball(
        cloud,
        1.3,
        [j * 1.4, Math.sin(j) * 0.3, 0],
        materials.cream,
        2,
      )
      puff.scale.y = 0.55
    }
    world.add(cloud)
    floaters.push(cloud)
  }
  const botHolder = new THREE.Group()
  world.add(botHolder)
  const botShadow = shadow(world, 2.5, 2, [3, 0.025, 3.5])
  const loader = new GLTFLoader(),
    draco = new DRACOLoader()
  draco.setDecoderPath(`${import.meta.env.BASE_URL}models/draco/`)
  loader.setDRACOLoader(draco)
  const texLoader = new THREE.TextureLoader()
  const glbs: Record<string, THREE.Object3D> = {}
  const originals = new Set<
    THREE.BufferGeometry | THREE.Material | THREE.Texture
  >()
  let disposed = false
  function releaseOriginals() {
    originals.forEach((resource) => resource.dispose())
    originals.clear()
  }
  async function loadModel(url: string) {
    const model = await loader.loadAsync(url)
    model.scene.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        originals.add(object.geometry)
        for (const material of Array.isArray(object.material)
          ? object.material
          : [object.material])
          originals.add(material)
      }
    })
    if (disposed) releaseOriginals()
    return model
  }
  function recolor(root: THREE.Object3D) {
    root.traverse((o) => {
      if (!(o instanceof THREE.Mesh)) return
      o.material = o.material.clone()
      if (o.material.isMeshStandardMaterial) {
        const name = o.material.name
        if (name.includes('Graphite')) o.material.color.setHex(config.shell)
        else if (name.includes('Satin') || name.includes('porcelain'))
          o.material.color.setHex(config.cream)
        else if (name.includes('orange')) o.material.color.setHex(config.other)
        o.material.metalness = 0.06
        o.material.roughness = 0.48
      }
    })
  }
  function setSurface(
    root: THREE.Object3D,
    name: string,
    texture: THREE.Texture,
  ) {
    const mesh = root.getObjectByName(name)
    if (mesh instanceof THREE.Mesh) {
      mesh.material.dispose()
      mesh.material = new THREE.MeshBasicMaterial({
        map: texture,
        toneMapped: false,
      })
    }
  }
  function fittedImage(texture: THREE.Texture) {
    const c = document.createElement('canvas')
    c.width = 1536
    c.height = 864
    const x = c.getContext('2d')!
    x.fillStyle = '#101417'
    x.fillRect(0, 0, c.width, c.height)
    const image = texture.image as HTMLImageElement,
      s = Math.min(c.width / image.width, c.height / image.height)
    x.drawImage(
      image,
      (c.width - image.width * s) / 2,
      (c.height - image.height * s) / 2,
      image.width * s,
      image.height * s,
    )
    const t = new THREE.CanvasTexture(c)
    t.flipY = false
    t.colorSpace = THREE.SRGBColorSpace
    return t
  }

  async function loadWorld() {
    const [core, terminal, server, stack, timeline, bot] = await Promise.all([
      ...['core', 'terminal', 'server', 'stack', 'timeline'].map((name) =>
        loadModel(
          `${import.meta.env.BASE_URL}models/hacker-workshop/${name}.glb`,
        ),
      ),
      loadModel(`${import.meta.env.BASE_URL}models/boop.glb`),
    ])
    const images = await Promise.all(
      projects.map((p) =>
        texLoader.loadAsync(
          `${import.meta.env.BASE_URL}images/${p.projectPreviewImage}`,
        ),
      ),
    )
    Object.assign(glbs, {
      core: core.scene,
      terminal: terminal.scene,
      server: server.scene,
      stack: stack.scene,
      timeline: timeline.scene,
    })
    const robot = bot.scene
    robot.scale.setScalar(BOOP_SCALE)
    botHolder.add(robot)
    for (const [i, stop] of stops.entries()) {
      const group = stationGroups[i],
        asset = glbs[stop.model].clone(true)
      recolor(asset)
      if (stop.project) {
        const texture = fittedImage(images[i - 1])
        setSurface(asset, 'SCREEN_project', texture)
        setSurface(
          asset,
          'LABEL_project',
          textTexture(stop.title, [], 1024, 180),
        )
      }
      if (i === 0) {
        setSurface(
          asset,
          'LABEL_core',
          textTexture('MADE WITH CURIOSITY', [], 1024, 180),
        )
        asset.traverse((o) => {
          if (o.name.startsWith('ROTOR_')) rotors.push(o)
        })
      }
      if (i === 3) {
        setSurface(
          asset,
          'SCREEN_web',
          textTexture(
            'React.js',
            technologies.frontend.techs[0].items.slice(0, 3),
          ),
        )
        setSurface(
          asset,
          'SCREEN_mobile',
          textTexture('React Native', ['Expo', 'Native Modules'], 512, 1024),
        )
        technologies.backend.techs.forEach((tech, j) =>
          setSurface(
            asset,
            'LABEL_backend_' + j,
            textTexture(tech.name, [], 1024, 180),
          ),
        )
      }
      if (i === 4)
        [...experiences]
          .reverse()
          .forEach((e, j) =>
            setSurface(
              asset,
              'SCREEN_experience_' + j,
              textTexture(e.period, [e.position, e.workplace]),
            ),
          )
      if (i === 5) {
        setSurface(
          asset,
          'SCREEN_project',
          textTexture('Hello, human!', [
            personalInfo.name,
            personalInfo.email,
            'github.com/pixelboatt',
          ]),
        )
        setSurface(
          asset,
          'LABEL_project',
          textTexture('LET’S BUILD SOMETHING', [], 1024, 180),
        )
      }
      asset.scale.setScalar(i === 0 ? 0.65 : 0.63)
      asset.position.y = 0.33
      group.add(asset)
      if (i === 2) {
        const service = server.scene.clone(true)
        recolor(service)
        service.scale.setScalar(0.6)
        service.position.set(4.2, 0.05, -0.5)
        setSurface(
          service,
          'LABEL_server',
          textTexture('Node.js / JWT', [], 1024, 180),
        )
        group.add(service)
      }
    }
    images.forEach((image) => image.dispose())
    return animateBoop(robot)
  }

  return {
    world,
    botHolder,
    botShadow,
    rotors,
    floaters,
    clickable,
    load: loadWorld,
    dispose: () => {
      disposed = true
      releaseOriginals()
      draco.dispose()
    },
  }
}
