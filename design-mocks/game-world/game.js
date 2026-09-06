// Throwaway theme preview: three worlds, one scroll journey, and a small playable robot.
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { personalInfo, projects, technologies, experiences, skills } from '../../src/data/portfolio.ts';

const $ = s => document.querySelector(s);
const params = new URLSearchParams(location.search);
const variant = ['A','B','C'].includes(params.get('variant')) ? params.get('variant') : 'A';
const config = {
 A:{name:'Tiny Planet',edition:'A LITTLE WORLD BY PARINTORN',title:'Serious code.<br><em>Silly little world.</em>',description:'Web, mobile, backend. A small world of things I build.',color:0xbfff70,other:0xff8b9b,ground:0x7cc773,shell:0x78c9ae,cream:0xf5eccd,hello:'Boop here. Mind the edge. I just mopped the void.'},
 B:{name:'After-hours Arcade',edition:'THE PARINTORN ARCADE',title:'INSERT<br><em>CURIOSITY.</em>',description:'Real projects. One tiny robot. Absolutely no quarters required.',color:0xf5ff76,other:0xff65be,ground:0x302742,shell:0x9376cb,cream:0xf2e8cf,hello:'Welcome to the arcade. The bugs are features. Kidding.'},
 C:{name:'Pocket Space',edition:'GREETINGS FROM THE BUILD SYSTEM',title:'Hello,<br><em>small human.</em>',description:'I build things for the web. Boop insists we need a space program.',color:0x7fe7ff,other:0xffa477,ground:0x587e8e,shell:0x99c3d5,cream:0xeee7d9,hello:'Oxygen: optional. Curiosity: strongly encouraged.'},
}[variant];
document.body.dataset.variant=variant;
$('#edition').textContent=config.edition;$('#theme-name').textContent=`${variant} · ${config.name}`;
$('#headline').innerHTML=config.title;$('#description').textContent=config.description;$('#banter').textContent=config.hello;
const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const locations = variant==='B' ? [[0,0,0],[-16,0,-19],[16,0,-19],[-16,0,-39],[16,0,-39],[0,0,-58]] : [[0,0,0],[22,0,-12],[25,0,-36],[1,0,-49],[-23,0,-35],[-22,0,-10]];
const stops=[
 {id:'about',label:'Welcome',title:personalInfo.name,description:personalInfo.description,model:'core'},
 ...projects.map((p,i)=>({id:'project-'+p.projectId,label:i===0?'Netflix':'CRUD & JWT',title:p.projectName,description:p.projectDesc,model:'terminal',project:p})),
 {id:'technologies',label:'Tech stack',title:'Tools for the quest.',description:'React, React Native, Node.js, Golang, and Java. Different tools. Same curiosity.',model:'stack'},
 {id:'experience',label:'Experience',title:'A few save points.',description:'From freelance builds to leading technical work at TechBerry.',model:'timeline'},
 {id:'contact',label:'Contact',title:'Let’s build something.',description:'Found an interesting problem? I would love to hear about it.',model:'terminal'},
].map((s,i)=>({...s,position:new THREE.Vector3(...locations[i])}));
let active=0,progress=0,targetProgress=0,exploring=false,motion=!matchMedia('(prefers-reduced-motion: reduce)').matches,ready=false,dirty=true,elapsed=0,last=0;
let yaw=.35,verticalVelocity=0,grounded=true,lastBanter='',resetCount=0;
const keys=new Set(),visited=new Set([0]),pointer=new THREE.Vector2(),player=new THREE.Vector3(3,.02,3.5),velocity=new THREE.Vector3();
const modeButton=$('#play'),dialog=$('#details'),journey=$('#journey');
const worldCanvas=$('#world');worldCanvas.tabIndex=0;
const scene=new THREE.Scene();scene.background=new THREE.Color(0);scene.fog=new THREE.Fog(0,55,120);
const camera=new THREE.PerspectiveCamera(43,1,.1,180);
let renderer;
try {renderer=new THREE.WebGLRenderer({canvas:worldCanvas,antialias:true,powerPreference:'high-performance'});} catch(error){$('#loading').textContent='3D is unavailable in this browser. Use the station buttons to read the portfolio.';throw error;}
renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.2;
const envRoom=new RoomEnvironment(),pmrem=new THREE.PMREMGenerator(renderer),environment=pmrem.fromScene(envRoom,.03);scene.environment=environment.texture;scene.environmentIntensity=.45;envRoom.dispose();pmrem.dispose();
scene.add(new THREE.HemisphereLight(0xdaf7ff,0x3d3148,2));
const sun=new THREE.DirectionalLight(0xffefcb,3.3);sun.position.set(-15,35,20);scene.add(sun);
const rim=new THREE.DirectionalLight(0x9bd7ff,2);rim.position.set(20,15,-30);scene.add(rim);
const world=new THREE.Group();scene.add(world);
const clickable=[],stationGroups=[],rotors=[],floaters=[];
const mat=(color,roughness=.68)=>new THREE.MeshStandardMaterial({color,roughness,metalness:.02});
const materials={cream:mat(config.cream),ground:mat(config.ground),accent:mat(config.color),other:mat(config.other),shell:mat(config.shell),dark:mat(0x15202b),wood:mat(0xd49d67)};
function box(parent,size,at,material=materials.cream,radius=.15){const o=new THREE.Mesh(new RoundedBoxGeometry(...size,3,Math.min(radius,...size.map(v=>v/2))),material);o.position.set(...at);parent.add(o);return o;}
function ball(parent,radius,at,material=materials.cream,detail=2){const o=new THREE.Mesh(new THREE.IcosahedronGeometry(radius,detail),material);o.position.set(...at);parent.add(o);return o;}
function cylinder(parent,radius,height,at,material=materials.ground,sides=48){const o=new THREE.Mesh(new THREE.CylinderGeometry(radius,radius*.92,height,sides),material);o.position.set(...at);parent.add(o);return o;}
function ring(parent,radius,tube,at,material=materials.accent){const o=new THREE.Mesh(new THREE.TorusGeometry(radius,tube,8,64),material);o.rotation.x=-Math.PI/2;o.position.set(...at);parent.add(o);return o;}
function textTexture(title,lines=[],width=1024,height=576){const c=document.createElement('canvas');c.width=width;c.height=height;const x=c.getContext('2d');x.fillStyle='#102329';x.fillRect(0,0,width,height);x.fillStyle='#bfff96';x.fillRect(55,55,34,5);x.font='bold 51px Arial';x.fillStyle='#fff5df';x.fillText(title,55,160,width-110);x.font='25px monospace';lines.forEach((line,i)=>{x.fillStyle=i===0?'#fff098':'#b1d4cf';x.fillText(line,55,245+i*58,width-110)});const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.flipY=false;return t;}
function label(parent,title,at,width=4,height=.6){const t=textTexture(title,[],1024,240);const m=new THREE.Mesh(new THREE.PlaneGeometry(width,height),new THREE.MeshBasicMaterial({map:t,toneMapped:false,side:THREE.DoubleSide}));m.material.map.flipY=true;m.position.set(...at);parent.add(m);return m;}
const shadowCanvas=document.createElement('canvas');shadowCanvas.width=128;shadowCanvas.height=128;const sx=shadowCanvas.getContext('2d'),gr=sx.createRadialGradient(64,64,1,64,64,63);gr.addColorStop(0,'#0008');gr.addColorStop(1,'#0000');sx.fillStyle=gr;sx.fillRect(0,0,128,128);const shadowMap=new THREE.CanvasTexture(shadowCanvas);
function shadow(parent,width,depth,at){const m=new THREE.Mesh(new THREE.PlaneGeometry(width,depth),new THREE.MeshBasicMaterial({map:shadowMap,transparent:true,depthWrite:false}));m.rotation.x=-Math.PI/2;m.position.set(...at);parent.add(m);return m;}
function bridge(a,b){const delta=b.clone().sub(a),length=delta.length(),g=new THREE.Group();g.position.copy(a).lerp(b,.5);g.rotation.y=Math.atan2(delta.x,delta.z);world.add(g);if(variant==='B'){box(g,[2.2,.07,length],[0,-.25,0],materials.accent,.01);box(g,[1.95,.07,length],[0,-.2,0],materials.dark,.01);}else{for(let i=0;i<Math.ceil(length/.65);i++)box(g,[2,.2,.53],[0,-.12,-length/2+i*.65],variant==='C'?materials.shell:materials.wood,.04);for(const x of [-1.1,1.1])box(g,[.07,.09,length],[x,.02,0],materials.accent,.02);}}
for(let i=0;i<stops.length;i++){if(i<stops.length-1)bridge(stops[i].position,stops[i+1].position);}
bridge(stops[stops.length-1].position,stops[0].position);
if(variant==='B'){box(world,[55,1,80],[0,-.8,-25],materials.dark,.8);for(let x=-24;x<=24;x+=4)for(let z=8;z>=-61;z-=4){const o=box(world,[.5,.025,.09],[x,-.28,z],(x+z)%8?materials.other:materials.accent,.01);o.rotation.y=.7;}}
for(const [i,stop] of stops.entries()){
 const group=new THREE.Group();group.position.copy(stop.position);world.add(group);stationGroups.push(group);
 if(variant==='A'){cylinder(group,8,1.2,[0,-.85,0],materials.ground);cylinder(group,7.7,.18,[0,-.18,0],mat(0xa2d977));for(let t=0;t<7;t++){const a=t*2.4+i,r=6.2;const x=Math.cos(a)*r,z=Math.sin(a)*r;if(z>2&&Math.abs(x)<4)continue;cylinder(group,.15,1.4,[x,.5,z],materials.wood,8);ball(group,.85,[x,1.6,z],mat(t%2?0x459973:0x88ba65),1);ball(group,.48,[x+.45,1.32,z+.2],materials.ground,1);}for(let t=0;t<5;t++){const a=t*1.9+1.2;const x=Math.cos(a)*6.5,z=Math.sin(a)*6.5;cylinder(group,.08,.35,[x,.12,z],materials.cream,8);const cap=ball(group,.35,[x,.36,z],materials.other);cap.scale.y=.55;}}
 if(variant==='B'){box(group,[13,.35,12],[0,-.1,0],materials.shell,.35);for(let x of [-6.25,6.25])box(group,[.09,.04,11],[x,.1,0],materials.other,.02);for(let x of [-5.6,5.6]){box(group,[.3,5,.3],[x,2.2,-4],materials.other);ball(group,.3,[x,4.85,-4],materials.accent);}}
 if(variant==='C'){const asteroid=ball(group,7.3,[0,-3.3,0],materials.ground,1);asteroid.scale.y=.52;cylinder(group,7.1,.3,[0,-.3,0],materials.shell);ring(group,7,.065,[0,-.1,0],materials.accent);for(let t=0;t<4;t++){const o=ball(group,.6,[Math.cos(t*2)*6,-.1,Math.sin(t*2)*6],materials.cream,0);o.scale.y=.6;}const pole=cylinder(group,.055,3.1,[-5,1.3,-2],materials.cream,12);box(group,[1.5,.75,.035],[-4.3,2.55,-2],materials.other,.04);}
 shadow(group,9,6,[0,.035,0]);
 const sign=new THREE.Group();sign.position.set(-4.5,0,4);group.add(sign);cylinder(sign,.065,1.2,[0,.55,0],materials.wood,10);box(sign,[2.7,.64,.16],[0,1.13,0],materials.cream,.12);label(sign,stop.label,[0,1.14,.091],2.5,.54);
 group.userData.station=i;clickable.push(group);
}
// Three-dimensional scenery at different distances makes the camera journey's parallax visible.
const starVertices=[];for(let i=0;i<260;i++){const a=i*2.39996,r=35+(i%13)*4;starVertices.push(Math.cos(a)*r,10+(i*7%43),-25+Math.sin(a)*r);}
const starGeometry=new THREE.BufferGeometry();starGeometry.setAttribute('position',new THREE.Float32BufferAttribute(starVertices,3));const stars=new THREE.Points(starGeometry,new THREE.PointsMaterial({color:variant==='C'?0xbed9ff:0x8b9b77,size:variant==='C'?.14:.075,transparent:true,opacity:.7}));world.add(stars);
if(variant==='C'){const planet=ball(world,8,[-36,16,-55],materials.other,3);ring(planet,11,.3,[0,0,0],materials.cream).rotation.x=.5;floaters.push(planet);}else if(variant==='A'){for(let i=0;i<8;i++){const cloud=new THREE.Group();cloud.position.set(-30+i*10,10+(i%3)*2,-25-i*5);for(let j=0;j<3;j++){const puff=ball(cloud,1.3,[j*1.4,Math.sin(j)*.3,0],materials.cream,2);puff.scale.y=.55;}world.add(cloud);floaters.push(cloud);}}
const botHolder=new THREE.Group();world.add(botHolder);botHolder.position.copy(player);const botShadow=shadow(world,2.5,2,[player.x,.04,player.z]);
const loader=new GLTFLoader(),draco=new DRACOLoader();draco.setDecoderPath('../../public/models/draco/');loader.setDRACOLoader(draco);
const texLoader=new THREE.TextureLoader();
const glbs={};
function recolor(root){root.traverse(o=>{if(!o.isMesh)return;o.material=o.material.clone();if(o.material.isMeshStandardMaterial){const name=o.material.name;if(name.includes('Graphite'))o.material.color.setHex(config.shell);else if(name.includes('Satin')||name.includes('porcelain'))o.material.color.setHex(config.cream);else if(name.includes('orange'))o.material.color.setHex(config.other);o.material.metalness=.06;o.material.roughness=.48;}});}
function setSurface(root,name,texture){const mesh=root.getObjectByName(name);if(mesh)mesh.material=new THREE.MeshBasicMaterial({map:texture,toneMapped:false});}
function fittedImage(texture){const c=document.createElement('canvas');c.width=1536;c.height=864;const x=c.getContext('2d');x.fillStyle='#101417';x.fillRect(0,0,c.width,c.height);const image=texture.image,s=Math.min(c.width/image.width,c.height/image.height);x.drawImage(image,(c.width-image.width*s)/2,(c.height-image.height*s)/2,image.width*s,image.height*s);const t=new THREE.CanvasTexture(c);t.flipY=false;t.colorSpace=THREE.SRGBColorSpace;return t;}
function cabinet(parent,screen,title){box(parent,[3.5,5.6,2.4],[0,2.8,0],materials.shell,.25);box(parent,[3.7,.95,2.65],[0,5.3,.1],materials.other,.2);label(parent,title,[0,5.34,1.44],3.25,.57);box(parent,[3.25,2.5,.25],[0,3.47,1.23],materials.dark,.14);const panel=new THREE.Mesh(new THREE.PlaneGeometry(2.95,1.94),new THREE.MeshBasicMaterial({map:screen,toneMapped:false}));panel.position.set(0,3.47,1.37);parent.add(panel);box(parent,[3.55,.34,1.1],[0,1.92,1.6],materials.cream,.12);cylinder(parent,.09,.33,[-.87,2.18,1.65],materials.dark);ball(parent,.2,[-.87,2.43,1.65],materials.other);for(let i=0;i<3;i++)cylinder(parent,.13,.09,[.22+i*.4,2.14,1.7],i%2?materials.other:materials.accent);box(parent,[.9,.25,.06],[0,.8,1.24],materials.dark,.03);}
async function loadWorld(){
 const [core,terminal,server,stack,timeline,bot,...images]=await Promise.all([
  ...['core','terminal','server','stack','timeline'].map(name=>loader.loadAsync('../../public/models/hacker-workshop/'+name+'.glb')),
  loader.loadAsync('boop.glb'),...projects.map(p=>texLoader.loadAsync('../../public/images/'+p.projectPreviewImage))]);
 Object.assign(glbs,{core:core.scene,terminal:terminal.scene,server:server.scene,stack:stack.scene,timeline:timeline.scene});
 const robot=bot.scene;robot.scale.setScalar(1.15);botHolder.add(robot);
 if(variant==='C'){const glass=new THREE.Mesh(new THREE.SphereGeometry(1.1,24,16),new THREE.MeshPhysicalMaterial({color:0xbeeaff,transparent:true,opacity:.12,roughness:.2,metalness:0,depthWrite:false}));glass.position.y=2.2;botHolder.add(glass);box(botHolder,[.7,1,.4],[0,1.2,-.7],materials.other);}
 for(const [i,stop] of stops.entries()){
  const group=stationGroups[i],asset=glbs[stop.model].clone(true);recolor(asset);
  if(stop.project){const texture=fittedImage(images[i-1]);setSurface(asset,'SCREEN_project',texture);setSurface(asset,'LABEL_project',textTexture(stop.title,[],1024,180));if(variant==='B'){cabinet(group,texture,stop.title);continue;}}
  if(i===0){setSurface(asset,'LABEL_core',textTexture('MADE WITH CURIOSITY',[],1024,180));asset.traverse(o=>{if(o.name.startsWith('ROTOR_'))rotors.push(o)});}
  if(i===3){setSurface(asset,'SCREEN_web',textTexture('React.js',technologies.frontend.techs[0].items.slice(0,3)));setSurface(asset,'SCREEN_mobile',textTexture('React Native',['Expo','Native Modules'],512,1024));technologies.backend.techs.forEach((tech,j)=>setSurface(asset,'LABEL_backend_'+j,textTexture(tech.name,[],1024,180)));}
  if(i===4)[...experiences].reverse().forEach((e,j)=>setSurface(asset,'SCREEN_experience_'+j,textTexture(e.period,[e.position,e.workplace])));
  if(i===5){setSurface(asset,'SCREEN_project',textTexture('Hello, human!',[personalInfo.name,personalInfo.email,'github.com/pixelboatt']));setSurface(asset,'LABEL_project',textTexture('LET’S BUILD SOMETHING',[],1024,180));}
  asset.scale.setScalar(i===0?.65:.63);asset.position.y=.33;group.add(asset);
  if(i===2){const service=server.scene.clone(true);recolor(service);service.scale.setScalar(.6);service.position.set(4.2,.05,-.5);setSurface(service,'LABEL_server',textTexture('Node.js / JWT',[],1024,180));group.add(service);}
 }
 ready=true;$('#loading').hidden=true;document.body.dataset.ready='true';dirty=true;
}
loadWorld().catch(error=>{$('#loading').textContent='Boop dropped a model. Use the station buttons to read the portfolio.';$('#loading').style.pointerEvents='none';console.error(error);});

const escapeLink=(url,text)=>`<a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(text)} ↗</a>`;
function inspect(index=active){const stop=stops[index];$('#detail-title').textContent=stop.title;$('#detail-kicker').textContent=`${config.name} / ${stop.label}`;let content='';if(stop.project){const p=stop.project;content=`<p>${esc(p.projectDesc)}</p><p>${esc(p.tags.join(' / '))}</p><img src="../../public/images/${esc(p.projectPreviewImage)}" alt="${esc(p.projectName)} screenshot">${p.projectSourceLink?escapeLink(p.projectSourceLink,'View source'):''}${p.projectDemoLink?escapeLink(p.projectDemoLink,'Live demo'):''}`;}else if(index===3){content=Object.values(technologies).map(category=>`<h3>${esc(category.category)}</h3>${category.techs.map(t=>`<p><strong>${esc(t.name)}</strong><br>${esc(t.items.join(' · '))}</p>`).join('')}`).join('')+`<h3>Tools & cloud</h3><p>${esc([...skills.tools,...skills.cloud].join(' · '))}</p>`;}else if(index===4){content=experiences.map(e=>`<h3>${esc(e.position)}</h3><p>${esc(e.period)} / ${esc(e.workplace)}</p><ul>${e.detail.map(d=>`<li>${esc(d)}</li>`).join('')}</ul>`).join('');}else{content=`<p>${esc(personalInfo.description)}</p>${escapeLink(personalInfo.github,'GitHub')}${escapeLink(personalInfo.linkedin,'LinkedIn')}${escapeLink('mailto:'+personalInfo.email,'Send an email')}`;}$('#detail-content').innerHTML=content;keys.clear();dialog.showModal();dirty=true;}
function updateActive(index){active=index;visited.add(index);$('#app').classList.toggle('at-station',index!==0);const stop=stops[index];$('#headline').innerHTML=index===0?config.title:esc(stop.title);$('#description').textContent=index===0?config.description:stop.description;$('#kicker').textContent=index===0?`${personalInfo.name} · ${personalInfo.title}`:stop.project?stop.project.tags.join(' / '):stop.label;$('#inspect').textContent=index===0?'Meet the engineer →':index===5?'Get in touch →':'Inspect this station →';$('#location').textContent=`0${index+1} / ${stop.label}`;document.body.dataset.activeStop=stop.id;$('#stops').querySelectorAll('button').forEach((button,i)=>button.setAttribute('aria-current',String(i===index)));if(index!==0)say(['', 'A movie night, built from scratch.', 'This bouncer checks JWTs.', 'So many tools. Still looking for the snack drawer.', 'Every engineer starts somewhere.', 'End of the map. Start of a conversation.'][index]);else say(config.hello);}
function say(text){if(text!==lastBanter){lastBanter=text;$('#banter').textContent=text;}}
function goto(index){if(exploring)setExplore(false);targetProgress=THREE.MathUtils.clamp(index,0,5);journey.value=String(targetProgress);dirty=true;}
function setExplore(value){exploring=value;document.body.classList.toggle('exploring',value);document.body.dataset.mode=value?'explore':'story';$('#explore-hud').hidden=!value;$('.touch-pad').hidden=!value;keys.clear();if(value){worldCanvas.focus({preventScroll:true});player.copy(stops[active].position).add(new THREE.Vector3(3,.05,3.5));verticalVelocity=0;grounded=true;yaw=.35;say('You’re driving! WASD to move. Space to test gravity.');}else{targetProgress=active;progress=active;journey.value=String(active);}resize();dirty=true;}
function jump(){if(exploring&&grounded&&!dialog.open){verticalVelocity=6.8;grounded=false;dirty=true;}}
$('#inspect').addEventListener('click',()=>inspect());$('#nearby').addEventListener('click',()=>inspect());$('#close-details').addEventListener('click',()=>dialog.close());modeButton.addEventListener('click',()=>setExplore(true));$('#return').addEventListener('click',()=>setExplore(false));$('.brand').addEventListener('click',e=>{e.preventDefault();goto(0)});
$('#motion').textContent=motion?'Pause motion':'Enable motion';$('#motion').setAttribute('aria-pressed',String(!motion));$('#motion').addEventListener('click',()=>{motion=!motion;$('#motion').textContent=motion?'Pause motion':'Enable motion';$('#motion').setAttribute('aria-pressed',String(!motion));dirty=true;});
for(const [i,stop] of stops.entries()){const button=document.createElement('button');button.textContent=stop.label;button.setAttribute('aria-label','Visit '+stop.title);button.addEventListener('click',()=>goto(i));$('#stops').append(button);}
document.querySelectorAll('[data-stop]').forEach(b=>b.addEventListener('click',()=>goto(Number(b.dataset.stop))));journey.addEventListener('input',()=>{targetProgress=Number(journey.value);dirty=true;});
function switchTheme(direction){const next=['A','B','C'][('ABC'.indexOf(variant)+direction+3)%3];location.href='prototype.html?variant='+next;}
$('#previous-theme').addEventListener('click',()=>switchTheme(-1));$('#next-theme').addEventListener('click',()=>switchTheme(1));
window.addEventListener('keydown',e=>{if(dialog.open||e.target.closest('input,textarea')||(!exploring&&e.target.closest('button,a')))return;if(['KeyW','KeyA','KeyS','KeyD','ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space'].includes(e.code))e.preventDefault();if(exploring){keys.add(e.code);if(e.code==='Space')jump();if(e.code==='KeyE'){if(player.distanceTo(stops[active].position)<10)inspect();else say('Follow a bridge to the next station.');}if(e.code==='Escape')setExplore(false);}else{if(e.code==='ArrowLeft')switchTheme(-1);if(e.code==='ArrowRight')switchTheme(1);if(e.code==='ArrowUp')goto(active-1);if(e.code==='ArrowDown')goto(active+1);}dirty=true;});
window.addEventListener('keyup',e=>keys.delete(e.code));window.addEventListener('blur',()=>keys.clear());document.addEventListener('visibilitychange',()=>{keys.clear();last=performance.now();dirty=true;});
worldCanvas.addEventListener('wheel',e=>{if(exploring||dialog.open||e.ctrlKey)return;e.preventDefault();const amount=e.deltaY*(e.deltaMode===1?16:e.deltaMode===2?innerHeight:1);targetProgress=THREE.MathUtils.clamp(targetProgress+amount*.0014,0,5);journey.value=String(targetProgress);dirty=true;},{passive:false});
let down=null,lastTouch=0;
worldCanvas.addEventListener('pointerdown',e=>{const rect=worldCanvas.getBoundingClientRect();pointer.set((e.clientX-rect.left)/rect.width*2-1,-((e.clientY-rect.top)/rect.height)*2+1);down={x:e.clientX,y:e.clientY};lastTouch=e.clientY;worldCanvas.setPointerCapture(e.pointerId)});
worldCanvas.addEventListener('pointermove',e=>{const rect=worldCanvas.getBoundingClientRect();pointer.set((e.clientX-rect.left)/rect.width*2-1,-((e.clientY-rect.top)/rect.height)*2+1);if(down&&exploring){yaw-=(e.movementX||0)*.006;}if(down&&!exploring&&e.pointerType==='touch'){targetProgress=THREE.MathUtils.clamp(targetProgress+(lastTouch-e.clientY)*.009,0,5);journey.value=String(targetProgress);lastTouch=e.clientY;}dirty=true;});
const raycaster=new THREE.Raycaster();worldCanvas.addEventListener('pointerup',e=>{if(down&&Math.hypot(e.clientX-down.x,e.clientY-down.y)<8){raycaster.setFromCamera(pointer,camera);const hit=raycaster.intersectObjects(clickable,true)[0];if(hit){let object=hit.object;while(object&&object.userData.station===undefined)object=object.parent;if(object){const index=object.userData.station;if(exploring){if(player.distanceTo(stops[index].position)<10)inspect(index);else say('That station is a bit far away. Follow the bridge!');}else if(index===active)inspect(index);else goto(index);}}}down=null;});
worldCanvas.addEventListener('pointercancel',()=>{down=null;keys.clear()});
document.querySelectorAll('[data-key]').forEach(b=>{b.addEventListener('pointerdown',e=>{e.preventDefault();b.setPointerCapture(e.pointerId);keys.add(b.dataset.key)});for(const event of ['pointerup','pointercancel','lostpointercapture'])b.addEventListener(event,()=>keys.delete(b.dataset.key));});$('#jump').addEventListener('click',jump);
function supported(position){if(variant==='B')return Math.abs(position.x)<26&&position.z<13&&position.z> -65;for(const stop of stops){if(Math.hypot(position.x-stop.position.x,position.z-stop.position.z)<7.8)return true;}for(let i=0;i<stops.length;i++){const a=stops[i].position,b=stops[(i+1)%stops.length].position,v=b.clone().sub(a),p=position.clone().sub(a);const t=THREE.MathUtils.clamp((p.x*v.x+p.z*v.z)/(v.x*v.x+v.z*v.z),0,1);if(Math.hypot(position.x-a.x-v.x*t,position.z-a.z-v.z*t)<1.15)return true;}return false;}
function blocked(position){return stops.some(stop=>Math.abs(position.x-stop.position.x)<2.3&&Math.abs(position.z-stop.position.z)<1.7&&position.y<3);}
function resize(){const rect=worldCanvas.getBoundingClientRect();renderer.setSize(rect.width,rect.height,false);camera.aspect=rect.width/rect.height;camera.updateProjectionMatrix();dirty=true;}
new ResizeObserver(resize).observe(worldCanvas);resize();
const storyCameras=stops.map((s,i)=>s.position.clone().add(new THREE.Vector3(variant==='B'?i===0?0:9:variant==='C'?15:15,variant==='B'?10:15,variant==='B'?26:24)));
const storyLooks=stops.map(s=>s.position.clone().add(new THREE.Vector3(variant==='C'?5:variant==='B'?0:-5,2.3,0)));
const eyePath=new THREE.CatmullRomCurve3(storyCameras,false,'catmullrom',.25),lookPath=new THREE.CatmullRomCurve3(storyLooks,false,'catmullrom',.25);
const desiredEye=new THREE.Vector3(),desiredLook=new THREE.Vector3(),look=new THREE.Vector3();
function frame(now){requestAnimationFrame(frame);if(document.hidden||now-last<1000/45)return;const dt=Math.min((now-last)/1000,.05);last=now;const changing=Math.abs(progress-targetProgress)>.0001;if(motion)elapsed+=dt;if(!dirty&&!motion&&!changing&&!exploring)return;dirty=false;
 if(exploring&&ready&&!dialog.open){const dx=(keys.has('KeyD')||keys.has('ArrowRight')?1:0)-(keys.has('KeyA')||keys.has('ArrowLeft')?1:0),dz=(keys.has('KeyW')||keys.has('ArrowUp')?1:0)-(keys.has('KeyS')||keys.has('ArrowDown')?1:0);velocity.set(Math.cos(yaw)*dx-Math.sin(yaw)*dz,0,-Math.sin(yaw)*dx-Math.cos(yaw)*dz);if(velocity.lengthSq()){velocity.normalize().multiplyScalar(6.5*dt);const trial=player.clone();trial.x+=velocity.x;if(!blocked(trial))player.x=trial.x;trial.copy(player);trial.z+=velocity.z;if(!blocked(trial))player.z=trial.z;botHolder.rotation.y=Math.atan2(velocity.x,velocity.z);}
 verticalVelocity-=17*dt;player.y+=verticalVelocity*dt;if(player.y<=.02&&supported(player)&&verticalVelocity<=0){player.y=.02;verticalVelocity=0;grounded=true;}else grounded=false;
 if(player.y< -7){player.copy(stops[active].position).add(new THREE.Vector3(3,.02,3.5));verticalVelocity=0;grounded=true;resetCount++;say(resetCount%2?'Gravity won that round. Boop is fine.':'The void has declined your application.');}
 $('#nearby').disabled=player.distanceTo(stops[active].position)>=10;const closest=stops.reduce((best,s,i)=>player.distanceTo(s.position)<player.distanceTo(stops[best].position)?i:best,0);if(closest!==active&&player.distanceTo(stops[closest].position)<9)updateActive(closest);
 desiredLook.copy(player).add(new THREE.Vector3(0,1.4,0));desiredEye.copy(player).add(new THREE.Vector3(Math.sin(yaw)*12,8.8,Math.cos(yaw)*12));camera.position.lerp(desiredEye,1-Math.exp(-dt*5));look.lerp(desiredLook,1-Math.exp(-dt*7));
 }else if(!exploring){progress=motion?THREE.MathUtils.damp(progress,targetProgress,5,dt):targetProgress;const idx=Math.round(progress);if(idx!==active)updateActive(idx);$('#story').classList.toggle('traveling',Math.abs(progress-idx)>.18);const t=progress/5;desiredEye.copy(eyePath.getPoint(t));desiredLook.copy(lookPath.getPoint(t));if(innerWidth<=720){const center=stops[Math.floor(progress)].position.clone().lerp(stops[Math.min(5,Math.floor(progress)+1)].position,progress%1);desiredLook.copy(center).add(new THREE.Vector3(0,1.3,0));const factor=Math.max(1,.85/camera.aspect);desiredEye.copy(center).add(new THREE.Vector3(variant==='B'?1:12,15,23).multiplyScalar(factor));}else if(variant==='B'&&progress<.05){desiredLook.y=-1.5;}
 const sway=motion?.6:0;desiredEye.x+=pointer.x*sway;desiredEye.y+=pointer.y*sway*.4;camera.position.copy(desiredEye);look.copy(desiredLook);player.copy(stops[active].position).add(new THREE.Vector3(variant==='B'?4:3,.02,3.5));botHolder.rotation.y=.3;
 }
 camera.lookAt(look);botHolder.position.copy(player);if(motion&&grounded)botHolder.position.y+=Math.sin(elapsed*(exploring&&velocity.lengthSq()?12:2.5))*.065;botShadow.position.set(player.x,.04,player.z);botShadow.scale.setScalar(Math.max(.4,1-player.y*.07));
 if(motion){rotors.forEach((o,i)=>{o.rotation[i%2?'x':'y']+=dt*.18;});floaters.forEach((o,i)=>{o.position.y+=Math.sin(elapsed*.35+i)*dt*.06;});}
 document.body.dataset.player=`${player.x.toFixed(2)},${player.y.toFixed(2)},${player.z.toFixed(2)}`;document.body.dataset.storyProgress=progress.toFixed(3);renderer.render(scene,camera);
}
updateActive(0);document.body.dataset.mode='story';requestAnimationFrame(frame);
