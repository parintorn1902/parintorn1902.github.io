// Throwaway fourth art direction: the portfolio's green/cyan terminal theme as a navigable network.
export function makeHacker({ THREE, scene, material, mesh, box, ring, group, marker, point, animateObjects, sun, rim, onAssetLoad }) {
  const green = 0x00ff41, cyan = 0x00d9ff, magenta = 0xff2a6d;
  scene.environmentIntensity = .12;
  scene.fog.density = .018;
  sun.intensity = .8; sun.color.set(0xb1ffd6); rim.intensity = 1.5; rim.color.set(cyan);
  const carbon = material(0x030908, .65, .5);
  const edge = new THREE.MeshBasicMaterial({ color: green, toneMapped: false });
  const cyanEdge = new THREE.MeshBasicMaterial({ color: cyan, toneMapped: false });
  const pinkEdge = new THREE.MeshBasicMaterial({ color: magenta, toneMapped: false });
  const line = new THREE.LineBasicMaterial({ color: green, transparent: true, opacity: .7, toneMapped: false });
  const dimLine = new THREE.LineBasicMaterial({ color: 0x0d6130, transparent: true, opacity: .5 });

  function outline(object, color = line) {
    const wire = new THREE.LineSegments(new THREE.EdgesGeometry(object.geometry), color);
    object.add(wire); return wire;
  }
  function words(text, color = '#00ff41', width = 512, height = 128) {
    const canvas = document.createElement('canvas'); canvas.width = width; canvas.height = height;
    const ctx = canvas.getContext('2d'); ctx.fillStyle = '#010503'; ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = color; ctx.font = `bold ${Math.floor(height * .42)}px monospace`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(text, width / 2, height / 2, width - 32);
    const texture = new THREE.CanvasTexture(canvas); texture.colorSpace = THREE.SRGBColorSpace;
    return new THREE.MeshBasicMaterial({ map: texture, toneMapped: false });
  }
  function label(text, parent, pos, size = [4, 1], color) {
    return mesh(new THREE.PlaneGeometry(...size), words(text, color, Math.round(128 * size[0] / size[1]), 128), parent, pos);
  }
  function platform(parent, size = 10) {
    outline(box([size, .25, size], carbon, parent, [0, -.15, 0]), dimLine);
    for (const x of [-1, 1]) for (const z of [-1, 1]) {
      box([1.7, .035, .06], edge, parent, [x * (size / 2 - .85), .01, z * size / 2]);
      box([.06, .035, 1.7], edge, parent, [x * size / 2, .01, z * (size / 2 - .85)]);
    }
  }

  // The network floor contains actual routes between the four destinations.
  const floorMat = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false,
    vertexShader: 'varying vec3 vWorld; void main(){vec4 p=modelMatrix*vec4(position,1.);vWorld=p.xyz;gl_Position=projectionMatrix*viewMatrix*p;}',
    fragmentShader: 'varying vec3 vWorld;void main(){vec2 q=abs(fract(vWorld.xz/3.-.5)-.5)/fwidth(vWorld.xz/3.);float grid=1.-min(min(q.x,q.y),1.);float fade=exp(-length(vWorld.xz-cameraPosition.xz)*.032);gl_FragColor=vec4(.0,.24,.065,grid*fade*.4);}',
  });
  mesh(new THREE.PlaneGeometry(240, 240), floorMat, scene, [0, -.42, -36], [-Math.PI / 2, 0, 0]);
  const circuitRoutes = [
    [[3, .05, 0], [12, .05, 0], [12, .05, -21], [27, .05, -21]],
    [[3, .05, 0], [-9, .05, 0], [-9, .05, -37], [-24, .05, -37]],
    [[27, .05, -21], [27, .05, -53], [3, .05, -53], [3, .05, -73]],
    [[-24, .05, -37], [-24, .05, -62], [3, .05, -62], [3, .05, -73]],
  ];
  circuitRoutes.forEach((route, routeIndex) => {
    const points = route.map(p => new THREE.Vector3(...p));
    for (let i = 1; i < points.length; i++) {
      const a = points[i - 1], b = points[i];
      const length = a.distanceTo(b);
      box([.055, .025, length], routeIndex % 2 ? cyanEdge : edge, scene, a.clone().lerp(b, .5).toArray(), [0, Math.atan2(b.x - a.x, b.z - a.z), 0]);
    }
    const path = new THREE.CurvePath();
    for (let i = 1; i < points.length; i++) path.add(new THREE.LineCurve3(points[i - 1], points[i]));
    for (let i = 0; i < 4; i++) {
      const packet = box([.2, .2, .6], routeIndex % 2 ? cyanEdge : edge, scene);
      animateObjects.push(t => { packet.position.copy(path.getPoint((t * .065 + i / 4) % 1)); });
    }
  });

  // Main processor: a rotating chip, nested lattice and individually modeled contact pins.
  const core = group(3, 0, 0); platform(core, 12);
  const processor = new THREE.Group(); processor.position.y = 5.2; core.add(processor);
  const chip = box([3.7, 3.7, .72], carbon, processor); outline(chip);
  const face = box([3.1, 3.1, .08], material(0x052816, .65, .25), processor, [0, 0, .41]); outline(face);
  label('PS_', processor, [0, .15, .48], [2.7, .95]);
  label('FULL STACK', processor, [0, -.85, .48], [2.6, .4]);
  for (let i = 0; i < 13; i++) {
    const offset = (i - 6) * .25;
    for (const sign of [-1, 1]) {
      box([.13, .42, .15], edge, processor, [offset, sign * 2.05, 0]);
      box([.42, .13, .15], edge, processor, [sign * 2.05, offset, 0]);
    }
  }
  const cages = [];
  for (let i = 0; i < 3; i++) {
    const cage = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(5 + i * .9, 5 + i * .9, 5 + i * .9)), i === 1 ? new THREE.LineBasicMaterial({ color: cyan, transparent: true, opacity: .5, toneMapped: false }) : line);
    cage.position.y = 5.2; core.add(cage); cages.push(cage);
  }
  animateObjects.push(t => {
    processor.rotation.set(Math.sin(t * .22) * .08, -.18 + Math.sin(t * .19) * .3, Math.sin(t * .24) * .05);
    processor.position.y = 5.2 + Math.sin(t * .7) * .16;
    cages.forEach((c, i) => { c.rotation.set(t * .035 * (i + 1), t * .09 * (i % 2 ? -1 : 1), i * .28); });
  });
  for (let i = 0; i < 3; i++) {
    ring(3.3 + i * .7, .015, i === 1 ? cyanEdge : edge, core, [0, .1 + i * .12, 0], [-Math.PI / 2, 0, 0]);
  }
  for (let i = 0; i < 8; i++) {
    const a = i / 8 * Math.PI * 2;
    const pylon = box([.24, 1.2, .24], carbon, core, [Math.cos(a) * 4.5, .6, Math.sin(a) * 4.5]); outline(pylon);
  }
  point(core, green, 28, [0, 4, 2]); marker(core, 0, [3.5, 8, 0], 'whoami');

  // Project terminal displays the actual existing portfolio screenshot, embedded in the HTML.
  const projects = group(27, 0, -21); platform(projects, 12);
  box([7.8, .5, 3.4], carbon, projects, [0, 1.25, 1]);
  const monitor = new THREE.Group(); projects.add(monitor); monitor.position.set(0, 4.4, 0); monitor.rotation.y = .24;
  outline(box([7.2, 4.45, .35], carbon, monitor));
  box([.3, 1.25, .4], carbon, projects, [0, 2.1, 0]);
  label('~/projects/netflix', monitor, [0, 2.55, .2], [6.5, .5], '#00d9ff');
  const screen = new THREE.MeshBasicMaterial({ color: 0xffffff, toneMapped: false });
  mesh(new THREE.PlaneGeometry(6.85, 3.85), screen, monitor, [0, 0, .2]);
  const screenshot = document.getElementById('project-texture');
  if (screenshot) {
    new THREE.TextureLoader().load(screenshot.src, texture => {
      texture.colorSpace = THREE.SRGBColorSpace; screen.map = texture; screen.needsUpdate = true; onAssetLoad();
    });
  }
  for (let row = 0; row < 4; row++) for (let col = 0; col < 15; col++) {
    box([.23, .07, .2], col === 14 ? edge : material(0x103c2a, .4, .6), projects, [-2.2 + col * .3, 1.55, .3 + row * .3]);
  }
  for (let i = 0; i < 2; i++) {
    const wing = new THREE.Group(); projects.add(wing); wing.position.set(i ? 5 : -5, 4, -.7); wing.rotation.y = i ? -.7 : .7;
    outline(box([2.1, 3.2, .2], carbon, wing), dimLine);
    label(i ? 'REACT' : 'NEXT.JS', wing, [0, .6, .12], [1.8, .45], '#00d9ff');
    label('TS', wing, [0, -.25, .12], [1.5, .8]);
  }
  marker(projects, 1, [0, 8, 0], 'projects');

  const systems = group(-24, 0, -37); platform(systems, 13);
  for (let rack = 0; rack < 3; rack++) {
    const x = (rack - 1) * 3.2;
    outline(box([2.55, 6, 2.4], carbon, systems, [x, 3, 0]));
    for (let unit = 0; unit < 8; unit++) {
      const y = .6 + unit * .65;
      outline(box([2.3, .49, .2], carbon, systems, [x, y, 1.23]), dimLine);
      box([.85, .04, .025], unit % 3 ? edge : cyanEdge, systems, [x - .35, y, 1.35]);
      for (let led = 0; led < 3; led++) box([.07, .07, .03], edge, systems, [x + .62 + led * .15, y, 1.35]);
    }
    label(['API', 'JWT', 'DATA'][rack], systems, [x, 6.5, 1.25], [2.4, .55], '#00d9ff');
  }
  const network = new THREE.Group(); network.position.set(0, 9, 0); systems.add(network);
  for (let i = 0; i < 3; i++) ring(2.1, .025, i === 1 ? cyanEdge : edge, network, [0, 0, 0], [i * Math.PI / 3, i * Math.PI / 3, 0]);
  mesh(new THREE.IcosahedronGeometry(.6), edge, network);
  animateObjects.push(t => { network.rotation.y = t * .3; });
  point(systems, green, 25, [0, 3, 3]); marker(systems, 2, [4, 7, 0], 'systems');

  const contact = group(3, 0, -73); platform(contact, 12);
  const portal = new THREE.Group(); portal.position.y = 4.2; contact.add(portal);
  for (let i = 0; i < 5; i++) {
    const r = ring(3.4, .065, i % 2 ? cyanEdge : edge, portal, [0, 0, -i * 1.5]);
    animateObjects.push(t => { r.rotation.z = t * .13 * (i % 2 ? -1 : 1); });
  }
  label('LET’S BUILD.', portal, [0, 0, .1], [5.8, 1.1]);
  box([.18, 1.2, .18], pinkEdge, portal, [3.45, 0, 0]);
  marker(contact, 3, [3.9, 7, 0], 'connect');

  // Sparse code columns live inside the world, so camera movement reveals real parallax.
  const codeCanvas = document.createElement('canvas'); codeCanvas.width = 256; codeCanvas.height = 1024;
  const ctx = codeCanvas.getContext('2d'); ctx.font = '16px monospace';
  const glyphs = '01ABCDEF<>/{}[]';
  let seed = 73;
  const random = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
  for (let col = 0; col < 12; col++) for (let row = 0; row < 48; row++) {
    ctx.fillStyle = `rgba(0,255,65,${.12 + random() * .6})`;
    ctx.fillText(glyphs[Math.floor(random() * glyphs.length)], col * 21, row * 22);
  }
  const codeTexture = new THREE.CanvasTexture(codeCanvas); codeTexture.wrapT = THREE.RepeatWrapping; codeTexture.colorSpace = THREE.SRGBColorSpace;
  const codeMat = new THREE.MeshBasicMaterial({ map: codeTexture, transparent: true, opacity: .4, side: THREE.DoubleSide, depthWrite: false, toneMapped: false });
  for (let i = 0; i < 14; i++) {
    mesh(new THREE.PlaneGeometry(3, 18 + random() * 10), codeMat, scene, [(i % 2 ? -1 : 1) * (43 + random() * 12), 12, 6 - i * 6], [0, (random() - .5) * .9, 0]);
  }
  animateObjects.push(t => { codeTexture.offset.y = t * .025; });
}
