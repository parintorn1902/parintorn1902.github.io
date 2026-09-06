// Throwaway portfolio motion study. Four worlds; four camera destinations per world.
// Rebuild the local classic-script bundle with: node design-mocks/build-prototypes.mjs
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { makeHacker } from './hacker-world.js';

const variant = document.body.dataset.world;
const $ = (id) => document.getElementById(id);
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
let animated = !reducedMotion.matches;
let current = 0, flight = null, orbit = 0, pitch = 0, auto = false;
let time = 0, lastFrame = 0, nextTour = Infinity, dirty = true;
const look = new THREE.Vector3(), pointer = new THREE.Vector2();
const targetCamera = new THREE.Vector3();
const temp = new THREE.Vector3();
const animateObjects = [], markers = [], pickables = [];
const orange = 0xff8a35, mint = 0xb3eacb, blue = 0x89cbdc;
const worlds = {
  hacker: {
    color: 0x00ff41, title: 'Root Access', letter: 'D',
    labels: ['whoami', 'projects', 'systems', 'connect'],
    stops: [
      { title: 'Parintorn\nSanguanpong_', sub: '$ whoami', copy: 'Senior Software Engineer. Frontend, backend, mobile, and infrastructure. Welcome to my corner of the network.', action: '[ explore projects ]', position: [14, 8, 21], target: [-2.8, 3.2, 0] },
      { title: 'Built for\nthe screen.', sub: '$ cd ~/projects/netflix', copy: 'Netflix Clone. Next.js, React, and Tailwind CSS. The display in this world shows the actual project.', action: '[ view source ↗ ]', url: 'https://github.com/pixelboatt/my-netflix', position: [32, 6, -6], target: [22.5, 3.5, -21] },
      { title: 'Beyond\nthe interface.', sub: '$ cd ~/projects/api', copy: 'CRUD & Authentication. A Next.js interface connected to a Node.js API with JWT authentication.', action: '[ view source ↗ ]', url: 'https://github.com/pixelboatt/basic-react-node-crud', position: [-17, 7, -22], target: [-28, 4, -37] },
      { title: 'Let’s build\nsomething.', sub: '$ cat about.txt', copy: 'I’m Parintorn. I like building complex things as simply as possible. From the first interface to the systems behind it.', action: '[ get in touch ↗ ]', url: 'https://www.linkedin.com/in/parintorn-s-24579a179/', position: [8, 6, -56], target: [-1, 3, -73] },
    ],
  },
  engine: {
    color: orange, title: 'The Engine Room', letter: 'A',
    labels: ['Overview', 'Interface', 'Systems', 'About'],
    stops: [
      { title: 'Complex systems.\nMade simple.', sub: 'Parintorn Sanguanpong / Senior Software Engineer', copy: 'Step inside the machine. Every layer tells a different part of the story.', action: 'Explore the interface', position: [12, 8, 18], target: [-2.8, 2.5, 0] },
      { title: 'The part\nyou feel.', sub: '01 / Interface', copy: 'Netflix Clone. An exploration of the streaming experience with Next.js, React, and Tailwind CSS.', action: 'View project ↗', url: 'https://github.com/pixelboatt/my-netflix', position: [24, 5, -7], target: [17, 2.4, -17] },
      { title: 'Under\nthe surface.', sub: '02 / Systems', copy: 'CRUD & Authentication. Connecting a Next.js interface to a Node.js API with JWT authentication.', action: 'View project ↗', url: 'https://github.com/pixelboatt/basic-react-node-crud', position: [-13, 6, -17], target: [-21, 2, -25] },
      { title: 'One engineer.\nEvery layer.', sub: '03 / About Parintorn', copy: 'Web. Mobile. Backend. Infrastructure. I enjoy connecting the pieces and making complex things simple.', action: 'Let’s talk ↗', url: 'https://www.linkedin.com/in/parintorn-s-24579a179/', position: [-2, 8, 35], target: [0, 3, 22] },
    ],
  },
  voyage: {
    color: blue, title: 'Midnight Voyage', letter: 'B',
    labels: ['Departure', 'First light', 'Deep water', 'The maker'],
    stops: [
      { title: 'A sense of\ndirection.', sub: 'Parintorn Sanguanpong / Midnight Voyage', copy: 'An engineer. A little curiosity. An ocean of things worth building.', action: 'Set sail', position: [13, 7, 22], target: [-3.5, 2, 0] },
      { title: 'Follow\nthe light.', sub: '01 / First light', copy: 'Netflix Clone. A familiar streaming experience, built as a personal exploration of frontend engineering.', action: 'Explore the project ↗', url: 'https://github.com/pixelboatt/my-netflix', position: [32, 8, -17], target: [22, 2, -27] },
      { title: 'Go a\nlittle deeper.', sub: '02 / Deep water', copy: 'CRUD & Authentication. A journey from the interface to the API, built with Next.js, Node.js, and JWT.', action: 'Explore the project ↗', url: 'https://github.com/pixelboatt/basic-react-node-crud', position: [-17, 7, -40], target: [-28, 2, -47] },
      { title: 'Still\nexploring.', sub: '03 / The maker', copy: 'I’m Parintorn. I build across web, mobile, backend, and cloud. The best part is figuring out how it all fits together.', action: 'Start a conversation ↗', url: 'https://www.linkedin.com/in/parintorn-s-24579a179/', position: [8, 6, -66], target: [0, 2, -77] },
    ],
  },
  gallery: {
    color: mint, title: 'The Impossible Gallery', letter: 'C',
    labels: ['Entrance', 'Exhibit 01', 'Exhibit 02', 'The maker'],
    stops: [
      { title: 'Built\nto think.', sub: 'Parintorn Sanguanpong / Engineering on display', copy: 'Ideas take shape. Then they work. Enter a collection of interfaces, systems, and experiments.', action: 'Enter the gallery', position: [17, 11, 23], target: [-3, 3, 0] },
      { title: 'An interface.\nAn experience.', sub: '01 / Netflix Clone', copy: 'A streaming interface built with Next.js, React, and Tailwind CSS. A study in the things people see and touch.', action: 'View the source ↗', url: 'https://github.com/pixelboatt/my-netflix', position: [30, 7, -8], target: [22, 3, -19] },
      { title: 'Separate parts.\nOne system.', sub: '02 / CRUD & Authentication', copy: 'A full-stack application connecting Next.js, Node.js, and JWT. The structure behind the surface.', action: 'View the source ↗', url: 'https://github.com/pixelboatt/basic-react-node-crud', position: [-14, 8, -28], target: [-24, 3, -39] },
      { title: 'Meet\nthe maker.', sub: '03 / Parintorn Sanguanpong', copy: 'Senior software engineer. I turn complex problems into simple, useful things across web, mobile, backend, and cloud.', action: 'Let’s talk ↗', url: 'https://www.linkedin.com/in/parintorn-s-24579a179/', position: [8, 9, -61], target: [0, 3, -74] },
    ],
  },
};
const config = worlds[variant];
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);
scene.fog = new THREE.FogExp2(variant === 'voyage' ? 0x020a10 : 0x000000, .012);
const camera = new THREE.PerspectiveCamera(46, innerWidth / innerHeight, .1, 240);
let renderer;
try {
  renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
} catch {
  $('loading').textContent = 'This 3D demo needs WebGL. Try opening it in Chrome or Safari with hardware acceleration enabled.';
  throw new Error('WebGL unavailable');
}
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.6));
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.25;
$('world').appendChild(renderer.domElement);
renderer.domElement.setAttribute('aria-label', 'Interactive 3D scene. Drag to orbit. Use the destination buttons to travel.');
const pmrem = new THREE.PMREMGenerator(renderer);
const room = new RoomEnvironment();
scene.environment = pmrem.fromScene(room, .02).texture;
room.dispose(); pmrem.dispose();
scene.environmentIntensity = .65;
scene.add(new THREE.HemisphereLight(0xbbdaff, 0x202019, 1.3));
const sun = new THREE.DirectionalLight(0xffeddb, 4);
sun.position.set(5, 20, 9); sun.castShadow = true;
sun.shadow.mapSize.set(1024, 1024);
sun.shadow.camera.left = -35; sun.shadow.camera.right = 35;
sun.shadow.camera.top = 35; sun.shadow.camera.bottom = -35;
sun.shadow.camera.far = 90; sun.shadow.normalBias = .04;
scene.add(sun, sun.target);
const rim = new THREE.DirectionalLight(0x7bbaff, 2.5);
rim.position.set(-12, 8, -15); scene.add(rim);

const material = (color, metalness = 0, roughness = .45, extra = {}) => new THREE.MeshStandardMaterial({ color, metalness, roughness, ...extra });
const steel = material(0x8d999f, .94, .24);
const dark = material(0x11161b, .75, .33);
const concrete = material(0xb2b8ad, .05, .75);
const glow = material(config.color, .45, .25, { emissive: config.color, emissiveIntensity: 2 });
function mesh(geometry, mat, parent, pos = [0, 0, 0], rotation = [0, 0, 0]) {
  const m = new THREE.Mesh(geometry, mat);
  m.position.set(...pos); m.rotation.set(...rotation);
  m.castShadow = true; m.receiveShadow = true; parent.add(m); return m;
}
const box = (size, mat, parent, pos, rot) => mesh(new THREE.BoxGeometry(...size), mat, parent, pos, rot);
const ring = (radius, tube, mat, parent, pos, rot) => mesh(new THREE.TorusGeometry(radius, tube, 12, 80), mat, parent, pos, rot);
function group(x, y, z) { const g = new THREE.Group(); g.position.set(x, y, z); scene.add(g); return g; }
function point(parent, color, intensity, pos) { const l = new THREE.PointLight(color, intensity, 25, 2); l.position.set(...pos); parent.add(l); }
function marker(parent, index, pos, text) {
  const anchor = new THREE.Object3D(); anchor.position.set(...pos); parent.add(anchor);
  const button = document.createElement('button'); button.className = 'hotspot';
  button.innerHTML = `<span class="hotspot-symbol">+</span><span>${text}</span>`;
  button.setAttribute('aria-label', `Travel to ${text}`);
  button.addEventListener('click', () => go(index));
  $('hotspots').appendChild(button); markers.push({ anchor, button, index });
  parent.traverse(o => { if (o.isMesh) { o.userData.destination = index; pickables.push(o); } });
}
function pedestal(g, width = 8) {
  box([width, .4, width], dark, g, [0, -.2, 0]);
  ring(width * .44, .025, glow, g, [0, .02, 0], [-Math.PI / 2, 0, 0]);
}
function stars() {
  const positions = new Float32Array(700 * 3);
  for (let i = 0; i < positions.length; i += 3) {
    positions[i] = (Math.random() - .5) * 210;
    positions[i + 1] = Math.random() * 75 + 9;
    positions[i + 2] = (Math.random() - .6) * 210;
  }
  const geometry = new THREE.BufferGeometry(); geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  scene.add(new THREE.Points(geometry, new THREE.PointsMaterial({ color: 0x8296aa, size: .065, transparent: true, opacity: .65 })));
}
function makeEngine() {
  const floor = mesh(new THREE.PlaneGeometry(230, 230), material(0x030406, .15, .8), scene, [0, -.5, -30], [-Math.PI / 2, 0, 0]);
  floor.castShadow = false;
  const engine = group(1, 0, 0); pedestal(engine, 9);
  mesh(new THREE.CylinderGeometry(.64, .64, 7, 48), glow, engine, [0, 3.6, 0]);
  point(engine, orange, 80, [0, 3, 0]);
  for (let i = 0; i < 6; i++) {
    const layer = new THREE.Group(); layer.position.y = .85 + i * 1.17; engine.add(layer);
    const shape = new THREE.Shape(); const h = 2.05;
    shape.moveTo(-h, -h); shape.lineTo(h, -h); shape.lineTo(h, h); shape.lineTo(-h, h); shape.closePath();
    const hole = new THREE.Path(); hole.absarc(0, 0, 1.05, 0, Math.PI * 2, true); shape.holes.push(hole);
    mesh(new THREE.ExtrudeGeometry(shape, { depth: .21, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: .08, bevelThickness: .06 }), i % 2 ? steel : dark, layer, [0, 0, 0], [Math.PI / 2, 0, 0]);
    ring(1.09, .05, glow, layer, [0, .04, 0], [Math.PI / 2, 0, 0]);
    for (const x of [-1.65, 1.65]) for (const z of [-1.65, 1.65]) mesh(new THREE.CylinderGeometry(.12, .12, .32, 8), steel, layer, [x, .05, z]);
    for (let j = 0; j < 7; j++) box([.1, .18, 1.2], steel, layer, [-.75 + j * .25, .1, 1.65]);
    animateObjects.push(t => { layer.rotation.y = Math.sin(t * .25 + i * .22) * .13; layer.position.y = .85 + i * 1.17 + Math.sin(t * .65 + i * .6) * .07; });
  }
  for (const x of [-1.65, 1.65]) for (const z of [-1.65, 1.65]) mesh(new THREE.CylinderGeometry(.045, .045, 8, 8), steel, engine, [x, 3.8, z]);
  const gyro = ring(4.7, .045, steel, engine, [0, 3.3, 0], [0, .4, .5]);
  animateObjects.push(t => { gyro.rotation.y = t * .13; });
  marker(engine, 0, [3.5, 5, 0], 'The engine');

  const frontend = group(20, 0, -17); pedestal(frontend);
  for (let i = 0; i < 3; i++) {
    const frame = box([4.4, 3.1, .16], steel, frontend, [(i - 1) * 1.65, 2.6 + i * .25, -i * 1.15], [0, -.22, 0]);
    box([4.1, 2.8, .05], material(i === 0 ? 0x9d2615 : 0x241012, .35, .24, { emissive: 0x6e170c, emissiveIntensity: .4 }), frame, [0, 0, .12]);
    animateObjects.push(t => { frame.position.y = 2.6 + i * .25 + Math.sin(t * .6 + i) * .15; });
  }
  marker(frontend, 1, [0, 5.5, 0], 'Interface');
  const backend = group(-18, 0, -25); pedestal(backend);
  for (let i = 0; i < 5; i++) {
    box([4.4, .56, 3], dark, backend, [0, .8 + i * .95, 0]);
    box([4.4, .035, 3], steel, backend, [0, 1.08 + i * .95, 0]);
    for (let j = 0; j < 8; j++) box([.12, .08, .035], j < 3 ? glow : steel, backend, [-1.6 + j * .45, .8 + i * .95, 1.52]);
  }
  point(backend, orange, 50, [0, 3, 3]); marker(backend, 2, [0, 6.5, 0], 'Systems');
  const about = group(3, 0, 22); pedestal(about);
  const knot = mesh(new THREE.TorusKnotGeometry(1.6, .42, 150, 20), steel, about, [0, 3.5, 0]);
  const halo = ring(3.2, .035, glow, about, [0, 3.5, 0]);
  animateObjects.push(t => { knot.rotation.set(t * .12, t * .18, 0); halo.rotation.y = t * .1; });
  marker(about, 3, [0, 7.2, 0], 'The engineer');
}

function makeVoyage() {
  scene.environmentIntensity = .35; sun.intensity = 1.8; sun.color.set(0xb7ddff); rim.intensity = 3;
  const water = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 } },
    vertexShader: `uniform float uTime; varying vec3 vWorld; varying float vWave;
      void main(){vec3 p=position;float t=uTime*.65;p.z+=sin(p.x*.24+t)*.18+sin(p.y*.37+t*1.4)*.13+sin((p.x+p.y)*.7-t)*.06;vWave=p.z;vec4 world=modelMatrix*vec4(p,1.);vWorld=world.xyz;gl_Position=projectionMatrix*viewMatrix*world;}`,
    fragmentShader: `uniform float uTime;varying vec3 vWorld;varying float vWave;
      void main(){float wave=sin(vWorld.x*1.6+vWorld.z*1.9+uTime)*sin(vWorld.z*2.4-uTime*.7);float reflection=pow(max(0.,1.-abs(vWorld.x-13.)/19.),7.);float shimmer=pow(max(0.,wave),12.);vec3 c=mix(vec3(.003,.016,.024),vec3(.025,.12,.16),smoothstep(-.2,.35,vWave));c+=vec3(.2,.36,.42)*shimmer*(.1+reflection*.8);float fade=exp(-length(vWorld.xz-cameraPosition.xz)*.009);gl_FragColor=vec4(c*fade,1.);}`,
  });
  mesh(new THREE.PlaneGeometry(320, 320, 170, 170), water, scene, [0, -.2, -55], [-Math.PI / 2, 0, 0]);
  animateObjects.push(t => { water.uniforms.uTime.value = t; });
  const moon = mesh(new THREE.SphereGeometry(4, 32, 24), new THREE.MeshBasicMaterial({ color: 0xc3d9dc }), scene, [-17, 24, -85]);
  moon.castShadow = false;
  const boat = group(0, .25, 0);
  const hullShape = new THREE.Shape(); hullShape.moveTo(0, -3.8); hullShape.lineTo(1.3, -1.5); hullShape.lineTo(1.4, 2); hullShape.lineTo(.8, 3); hullShape.lineTo(-.8, 3); hullShape.lineTo(-1.4, 2); hullShape.lineTo(-1.3, -1.5); hullShape.closePath();
  mesh(new THREE.ExtrudeGeometry(hullShape, { depth: .65, bevelEnabled: true, bevelThickness: .3, bevelSize: .28, bevelSegments: 1 }), material(0x164354, .6, .3), boat, [0, .8, 0], [Math.PI / 2, 0, 0]);
  box([1.65, .3, 2.2], material(0x9a7756, .1, .65), boat, [0, .9, .6]);
  mesh(new THREE.CylinderGeometry(.055, .08, 8, 12), steel, boat, [0, 4.4, 0]);
  box([.06, .06, 4.4], steel, boat, [0, 1.7, .4]);
  const sailMat = new THREE.MeshStandardMaterial({ color: 0xd5e3d9, side: THREE.DoubleSide, roughness: .7 });
  function sail(points) {
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(points, 3)); g.computeVertexNormals(); mesh(g, sailMat, boat);
  }
  sail([.05, 8.2, 0, .15, 1.8, 0, .8, 2, 3]);
  sail([-.05, 7.2, 0, -.12, 1.8, 0, -.45, 1.7, -3.4]);
  for (const x of [-1.1, 1.1]) for (const z of [-1, 0, 1, 2]) mesh(new THREE.SphereGeometry(.055, 8, 8), material(orange, 0, .4, { emissive: orange, emissiveIntensity: 4 }), boat, [x, .9, z]);
  point(boat, orange, 12, [0, 1.4, .7]);
  animateObjects.push(t => { boat.position.y = .25 + Math.sin(t * .65) * .16; boat.rotation.z = Math.sin(t * .5) * .04; boat.rotation.x = Math.cos(t * .6) * .03; });
  marker(boat, 0, [2.4, 5, 0], 'Departure');
  function island(x, z, index) {
    const g = group(x, -.1, z);
    mesh(new THREE.CylinderGeometry(4.5, 6, 1.7, 7), material(0x23313a, .12, .88), g, [0, 0, 0]);
    mesh(new THREE.ConeGeometry(3.5, 3.5, 5), material(0x364648, .1, .9), g, [-1.6, 1.8, -1]);
    marker(g, index, [0, 8, 0], config.labels[index]); return g;
  }
  const lighthouse = island(25, -27, 1);
  mesh(new THREE.CylinderGeometry(.6, 1.1, 6.5, 12), material(0x899d99, .3, .6), lighthouse, [0, 3.9, 0]);
  mesh(new THREE.CylinderGeometry(.95, .95, .65, 12), glow, lighthouse, [0, 7.2, 0]);
  mesh(new THREE.ConeGeometry(1.2, .8, 12), steel, lighthouse, [0, 8, 0]);
  const beam = mesh(new THREE.ConeGeometry(4.8, 28, 32, 1, true), new THREE.MeshBasicMaterial({ color: 0xd6e6da, transparent: true, opacity: .025, depthWrite: false, side: THREE.DoubleSide, blending: THREE.AdditiveBlending }), lighthouse, [0, 7.2, -14], [-Math.PI / 2, 0, 0]);
  animateObjects.push(t => { beam.rotation.z = Math.sin(t * .2) * .25; });
  point(lighthouse, blue, 30, [0, 7, 0]);
  const deep = island(-25, -47, 2);
  const portal = ring(2.8, .17, steel, deep, [0, 4, 0]);
  ring(2.55, .055, glow, deep, [0, 4, 0]);
  animateObjects.push(t => { portal.rotation.y = Math.sin(t * .3) * .4; });
  point(deep, blue, 35, [0, 3, 1]);
  const home = island(3, -77, 3);
  box([3.2, 2.2, 3], material(0x314147, .2, .7), home, [0, 2, 0]);
  mesh(new THREE.ConeGeometry(3, 1.7, 4), dark, home, [0, 3.9, 0], [0, Math.PI / 4, 0]);
  box([2.4, 1.35, .05], material(orange, .1, .4, { emissive: orange, emissiveIntensity: 2 }), home, [0, 2, 1.52]);
  box([1.8, .15, 5], material(0x574738, .1, .8), home, [0, .9, 4]);
  point(home, orange, 30, [0, 2, 3]);
}

function makeGallery() {
  scene.environmentIntensity = .8;
  const archMat = material(0xcccbb9, .12, .52);
  function platform(x, z, width = 14) {
    const g = group(x, 0, z); box([width, .8, 12], concrete, g, [0, -.4, 0]); return g;
  }
  function arch(g, x, z) {
    const shape = new THREE.Shape(); shape.moveTo(-3, 0); shape.lineTo(-3, 6); shape.absarc(0, 6, 3, Math.PI, 0, true); shape.lineTo(3, 0); shape.lineTo(1.95, 0); shape.lineTo(1.95, 6); shape.absarc(0, 6, 1.95, 0, Math.PI, false); shape.lineTo(-1.95, 0); shape.closePath();
    mesh(new THREE.ExtrudeGeometry(shape, { depth: .8, bevelEnabled: false }), archMat, g, [x, 0, z]);
  }
  const entrance = platform(2, 0, 17); arch(entrance, -2, -3);
  box([.6, 9, .6], concrete, entrance, [6, 4.5, -3]);
  box([8, .6, .8], concrete, entrance, [2.5, 8.7, -3]);
  const sculpture = ring(2.1, .48, material(0xe98147, .7, .22), entrance, [2.5, 4.6, 1], [.2, -.5, .3]);
  animateObjects.push(t => { sculpture.rotation.y = -.5 + t * .17; sculpture.position.y = 4.6 + Math.sin(t * .7) * .25; });
  box([1.5, 3.6, 1.5], material(mint, .45, .26), entrance, [5, 1.8, 3]);
  for (let i = 0; i < 14; i++) box([2.5, .3, .8], concrete, entrance, [-5, i * .32, 5 - i * .7]);
  marker(entrance, 0, [2.5, 7.6, 1], 'Entrance');
  const exhibit1 = platform(25, -19); arch(exhibit1, 0, -4);
  box([4, .8, 4], dark, exhibit1, [0, .4, 1]);
  const ribbon = mesh(new THREE.TorusKnotGeometry(1.8, .52, 180, 24, 2, 3), material(0xd44427, .68, .25), exhibit1, [0, 3.8, 1]);
  animateObjects.push(t => { ribbon.rotation.set(t * .08, t * .16, .25); });
  marker(exhibit1, 1, [0, 7.5, 1], 'Exhibit 01');
  const exhibit2 = platform(-21, -39); arch(exhibit2, 2, -4);
  const parts = new THREE.Group(); exhibit2.add(parts); parts.position.y = 3.5;
  for (let i = 0; i < 3; i++) {
    const piece = new THREE.Group(); parts.add(piece); piece.rotation.set(i * Math.PI / 2, i * Math.PI / 3, 0);
    ring(2.3, .28, i === 1 ? steel : material(mint, .6, .26), piece);
  }
  animateObjects.push(t => { parts.rotation.set(t * .12, t * .18, 0); });
  marker(exhibit2, 2, [0, 7.4, 0], 'Exhibit 02');
  const maker = platform(3, -74); arch(maker, 0, -3);
  for (let i = 0; i < 7; i++) box([4 - i * .3, .35, 4 - i * .3], steel, maker, [0, .3 + i * .8, 0], [0, i * .22, 0]);
  mesh(new THREE.IcosahedronGeometry(1.25, 0), material(mint, .8, .2), maker, [0, 7, 0]);
  marker(maker, 3, [0, 9, 0], 'The maker');
  // Separated landings give the camera real space to cross between exhibits.
  for (let i = 0; i < 18; i++) box([2.1, .24, 1.5], concrete, scene, [5 + Math.sin(i * .27) * 8, -1 + i * .1, -8 - i * 3.2], [0, Math.sin(i) * .08, 0]);
}

stars();
if (variant === 'hacker') {
  makeHacker({ THREE, scene, material, mesh, box, ring, group, marker, point, animateObjects, sun, rim, onAssetLoad: () => { dirty = true; } });
} else {
  ({ engine: makeEngine, voyage: makeVoyage, gallery: makeGallery })[variant]();
}
let composer = null;
if (variant === 'hacker') {
  composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  composer.addPass(new UnrealBloomPass(new THREE.Vector2(innerWidth, innerHeight), .6, .55, .8));
  composer.addPass(new OutputPass());
}

function cameraStop(stop) {
  const p = new THREE.Vector3(...stop.position), t = new THREE.Vector3(...stop.target);
  if (innerWidth < 720) {
    // Put the world above the copy on phones and retain room around the sculptures.
    p.sub(t).multiplyScalar(1.3).add(t); t.y -= 1.8;
    t.x += 2;
  }
  return { p, t };
}
function setCopy() {
  const stop = config.stops[current];
  $('eyebrow').textContent = stop.sub;
  $('headline').textContent = stop.title;
  $('description').textContent = stop.copy;
  $('primary').textContent = stop.action;
  $('primary').href = stop.url || '#interface';
  $('primary').target = stop.url ? '_blank' : '_self';
  $('primary').rel = 'noopener noreferrer';
  $('counter').textContent = `0${current + 1} / 04`;
  $('destination').textContent = config.labels[current];
  $('previous').disabled = current === 0;
  $('next').disabled = current === 3;
  document.querySelectorAll('button[data-stop]').forEach(b => b.setAttribute('aria-current', Number(b.dataset.stop) === current ? 'step' : 'false'));
  document.body.dataset.stop = String(current);
  if ($('command-status')) $('command-status').textContent = `current: /${config.labels[current]}`;
}
function go(index, initial = false) {
  index = Math.max(0, Math.min(3, index));
  if (index === current && !initial) return;
  current = index; orbit = 0; pitch = 0;
  const { p, t } = cameraStop(config.stops[index]);
  const start = camera.position.clone();
  const distance = start.distanceTo(p);
  const mid = start.clone().lerp(p, .5);
  mid.y += Math.min(distance * .18, 7);
  mid.x += (index % 2 ? 1 : -1) * Math.min(distance * .14, 5);
  flight = { start: performance.now(), duration: initial ? 1700 : 2100, path: new THREE.QuadraticBezierCurve3(start, mid, p), fromLook: look.clone(), toLook: t, p };
  if (!animated) { camera.position.copy(p); look.copy(t); flight = null; camera.fov = 46; camera.updateProjectionMatrix(); }
  setCopy();
  if (animated) $('copy').animate([{ opacity: 0, transform: 'translateY(22px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 800, delay: initial ? 200 : 350, fill: 'backwards', easing: 'cubic-bezier(.2,.7,.2,1)' });
  $('travel-progress').style.transform = 'scaleX(0)';
  nextTour = performance.now() + 7800;
  dirty = true;
}
document.querySelectorAll('button[data-stop]').forEach(b => b.addEventListener('click', () => go(Number(b.dataset.stop))));
$('primary').addEventListener('click', event => { if (!config.stops[current].url) { event.preventDefault(); go(1); } });
$('previous').addEventListener('click', () => go(current - 1));
$('next').addEventListener('click', () => go(current + 1));
$('tour').addEventListener('click', () => {
  auto = !auto;
  $('tour').textContent = auto ? 'Stop tour' : 'Play tour';
  $('tour').setAttribute('aria-pressed', String(auto));
  if (auto) { go((current + 1) % 4); nextTour = performance.now() + 7800; }
});
function motionLabel() { $('motion').textContent = animated ? 'Pause motion' : 'Enable motion'; $('motion').setAttribute('aria-pressed', String(!animated)); }
$('motion').addEventListener('click', () => {
  animated = !animated; motionLabel();
  if (!animated && flight) { camera.position.copy(flight.p); look.copy(flight.toLook); flight = null; camera.fov = 46; camera.updateProjectionMatrix(); }
  dirty = true;
});
reducedMotion.addEventListener('change', e => {
  animated = !e.matches;
  if (!animated && flight) { camera.position.copy(flight.p); look.copy(flight.toLook); flight = null; camera.fov = 46; camera.updateProjectionMatrix(); }
  motionLabel(); dirty = true;
});
motionLabel();
let wheelAmount = 0, wheelAt = 0, wheelLock = 0;
window.addEventListener('wheel', event => {
  if (event.ctrlKey || event.target.closest('#help-dialog')) return;
  if (performance.now() < wheelLock) return;
  if (performance.now() - wheelAt > 250) wheelAmount = 0;
  wheelAt = performance.now(); wheelAmount += event.deltaY;
  if (Math.abs(wheelAmount) > 90) { go(current + Math.sign(wheelAmount)); wheelAmount = 0; wheelLock = performance.now() + 2200; }
}, { passive: true });
window.addEventListener('keydown', e => {
  if ($('help-dialog').open || e.target.closest('input,textarea,[contenteditable]')) return;
  if (['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp'].includes(e.key)) {
    e.preventDefault(); go(current + (['ArrowRight', 'ArrowDown'].includes(e.key) ? 1 : -1));
  } else if (/^[1-4]$/.test(e.key)) go(Number(e.key) - 1);
});
const canvas = renderer.domElement;
let drag = null;
canvas.addEventListener('pointerdown', e => { drag = { x: e.clientX, y: e.clientY, lastX: e.clientX, lastY: e.clientY, moved: false }; canvas.setPointerCapture(e.pointerId); });
canvas.addEventListener('pointermove', e => {
  if (!drag || flight) return;
  if (Math.hypot(e.clientX - drag.x, e.clientY - drag.y) > 5) drag.moved = true;
  orbit += (e.clientX - drag.lastX) * .004;
  pitch = THREE.MathUtils.clamp(pitch + (e.clientY - drag.lastY) * .002, -.3, .45);
  drag.lastX = e.clientX; drag.lastY = e.clientY; dirty = true;
});
const raycaster = new THREE.Raycaster();
canvas.addEventListener('pointerup', e => {
  if (drag && !drag.moved) {
    pointer.set(e.clientX / innerWidth * 2 - 1, -e.clientY / innerHeight * 2 + 1);
    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObjects(pickables, false);
    if (hits.length) go(hits[0].object.userData.destination);
  }
  drag = null;
});
canvas.addEventListener('pointercancel', () => { drag = null; });
$('help').addEventListener('click', () => $('help-dialog').showModal());
$('close-help').addEventListener('click', () => $('help-dialog').close());
if (variant === 'hacker') {
  const command = $('command');
  $('command-form').addEventListener('submit', e => {
    e.preventDefault();
    const value = command.value.trim().toLowerCase().replace(/^cd\s+/, '').replace(/^[~/]+/, '');
    const destinations = { home: 0, whoami: 0, projects: 1, systems: 2, about: 3, connect: 3 };
    if (Object.hasOwn(destinations, value)) {
      go(destinations[value]); $('command-status').textContent = `current: /${config.labels[current]}`;
    } else if (value === 'help') {
      $('help-dialog').showModal();
    } else if (value === 'tour') {
      $('tour').click(); $('command-status').textContent = auto ? 'tour: playing' : 'tour: stopped';
    } else if (value === 'pause' || value === 'motion') {
      if (value === 'motion' || animated) $('motion').click();
      $('command-status').textContent = animated ? 'motion: enabled' : 'motion: paused';
    } else {
      $('command-status').textContent = value ? `Unknown command. Type help.` : 'Try projects, systems, about, or help.';
      return;
    }
    command.value = ''; command.blur();
  });
  window.addEventListener('keydown', e => {
    if (e.key === '/' && !$('help-dialog').open && !e.target.closest('input,textarea,[contenteditable]')) { e.preventDefault(); command.focus(); }
    if (e.key === 'Escape') command.blur();
  });
  $('fullscreen').addEventListener('click', async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else if (document.documentElement.requestFullscreen) await document.documentElement.requestFullscreen();
      else $('command-status').textContent = 'Use your browser’s full-screen control.';
    } catch { $('command-status').textContent = 'Use your browser’s full-screen control.'; }
  });
  document.addEventListener('fullscreenchange', () => { $('fullscreen').textContent = document.fullscreenElement ? 'Exit fullscreen' : 'Fullscreen'; });
}
function resize() {
  camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); renderer.setSize(innerWidth, innerHeight);
  if (composer) composer.setSize(innerWidth, innerHeight);
  const { p, t } = cameraStop(config.stops[current]); camera.position.copy(p); look.copy(t); flight = null;
  camera.fov = 46; camera.updateProjectionMatrix(); dirty = true;
}
window.addEventListener('resize', resize);
document.addEventListener('visibilitychange', () => { lastFrame = performance.now(); dirty = true; });
canvas.addEventListener('webglcontextlost', e => { e.preventDefault(); $('loading').hidden = false; $('loading').textContent = 'The 3D renderer was interrupted. Reload this tab to resume.'; });
const opening = cameraStop(config.stops[0]);
camera.position.copy(opening.p).multiplyScalar(1.3); camera.position.y += 5;
look.copy(opening.t); go(0, true);
$('loading').hidden = true;
document.body.classList.add('ready');

function frame(now) {
  requestAnimationFrame(frame);
  if (document.hidden) return;
  const delta = Math.min((now - lastFrame) / 1000, .05);
  // Cap ambient rendering at 60fps on high-refresh displays.
  if (now - lastFrame < 16) return;
  lastFrame = now;
  if (auto && now > nextTour) go((current + 1) % 4);
  if (!animated && !flight && !dirty) return;
  if (animated) { time += delta; animateObjects.forEach(fn => fn(time)); }
  if (flight) {
    const progress = Math.min((now - flight.start) / flight.duration, 1);
    const ease = progress < .5 ? 4 * progress ** 3 : 1 - (-2 * progress + 2) ** 3 / 2;
    camera.position.copy(flight.path.getPoint(ease)); look.lerpVectors(flight.fromLook, flight.toLook, ease);
    camera.fov = 46 + Math.sin(progress * Math.PI) * 12;
    $('travel-progress').style.transform = `scaleX(${progress})`;
    if (progress === 1) { flight = null; camera.fov = 46; }
    camera.updateProjectionMatrix();
  } else {
    const stop = cameraStop(config.stops[current]);
    temp.copy(stop.p).sub(stop.t);
    const spherical = new THREE.Spherical().setFromVector3(temp);
    spherical.theta += orbit; spherical.phi = THREE.MathUtils.clamp(spherical.phi + pitch, .15, Math.PI / 2 - .05);
    targetCamera.setFromSpherical(spherical).add(stop.t);
    camera.position.copy(targetCamera); look.copy(stop.t);
  }
  camera.lookAt(look);
  // Keep the key light and its shadow coverage with the active exhibit.
  sun.target.position.copy(look); sun.position.copy(look).add(temp.set(5, 20, 9));
  if (composer) composer.render();
  else renderer.render(scene, camera);
  markers.forEach(({ anchor, button, index }) => {
    anchor.getWorldPosition(temp); const distance = camera.position.distanceTo(temp); temp.project(camera);
    const visible = temp.z < 1 && temp.z > -1 && Math.abs(temp.x) < .92 && Math.abs(temp.y) < .8 && distance < (index === current ? 62 : 35) && !flight;
    button.hidden = !visible;
    if (visible) {
      const x = Math.min((temp.x * .5 + .5) * innerWidth, innerWidth - button.offsetWidth - 16);
      button.style.transform = `translate(${x}px,${(-temp.y * .5 + .5) * innerHeight}px)`;
      button.dataset.active = String(index === current);
    }
  });
  dirty = false;
}
requestAnimationFrame(frame);
