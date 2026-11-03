/* CORE: hàm tiện ích + scene, camera, ánh sáng, điều khiển camera */
const $=id=>document.getElementById(id), rnd=(a,b)=>a+Math.random()*(b-a), pick=a=>a[Math.floor(Math.random()*a.length)];
const mat=(c,o)=>new THREE.MeshLambertMaterial(Object.assign({color:c},o||{}));
function mesh(geo,m,x,y,z,p){const o=new THREE.Mesh(geo,m);o.position.set(x||0,y||0,z||0);if(p)p.add(o);return o}
function S(r,c,x,y,z,p,sx,sy,sz){const o=mesh(new THREE.SphereGeometry(r,20,14),mat(c),x,y,z,p);o.scale.set(sx||1,sy||1,sz||1);return o}
function B(w,h,d,c,x,y,z,p){return mesh(new THREE.BoxGeometry(w,h,d),mat(c),x,y,z,p)}
function cast(g){g.traverse(o=>{if(o.isMesh)o.castShadow=true})}

// ---------- Cảnh ----------
const scene=new THREE.Scene(),DAY=new THREE.Color(0x8fd3ff),NIGHT=new THREE.Color(0x0e1633);
scene.background=DAY.clone();scene.fog=new THREE.Fog(0x8fd3ff,35,95);
const camera=new THREE.PerspectiveCamera(50,innerWidth/innerHeight,.1,200);
const renderer=new THREE.WebGLRenderer({antialias:true});
renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio,2));
renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);
const hemi=new THREE.HemisphereLight(0xffffff,0x88cc66,.95);scene.add(hemi);
const sun=new THREE.DirectionalLight(0xfff2cc,.9);sun.position.set(14,24,12);sun.castShadow=true;
sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-32,right:32,top:32,bottom:-32,far:90});scene.add(sun);
const controls=new THREE.OrbitControls(camera,renderer.domElement);
Object.assign(controls,{enableDamping:true,dampingFactor:.08,enablePan:false,minDistance:4,maxDistance:42,maxPolarAngle:Math.PI/2.05});
camera.position.set(0,45,65);controls.target.set(0,1.5,0);

