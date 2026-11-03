/* INTERACTION: bay camera, bấm nhân vật, chế độ điều khiển (WASD/Space), mở portfolio */
// ---------- Camera, tương tác ----------
let fly=null,started=false,hover=-1,play=-1,py=0,vy=0,mv=false;const v1=new THREE.Vector3(),v2=new THREE.Vector3(),tmp=new THREE.Vector3();
function flyTo(p,t,d){fly={p0:camera.position.clone(),t0:controls.target.clone(),p1:p,t1:t,s:performance.now(),d:(d||1.6)*1000}}
const HOME=[new THREE.Vector3(0,10,17),new THREE.Vector3(0,1.5,0)];
const ray=new THREE.Raycaster(),mouse=new THREE.Vector2();
function pickChar(e){mouse.set(e.clientX/innerWidth*2-1,-(e.clientY/innerHeight)*2+1);ray.setFromCamera(mouse,camera);const h=ray.intersectObjects(chars,true)[0];return h?h.object.userData.idx:-1}
let down=[0,0],cur=-1;
renderer.domElement.addEventListener('pointerdown',e=>{down=[e.clientX,e.clientY];fly=null});
renderer.domElement.addEventListener('pointermove',e=>{hover=pickChar(e);renderer.domElement.style.cursor=hover>=0?'pointer':'grab'});
renderer.domElement.addEventListener('click',e=>{if(!started||Math.hypot(e.clientX-down[0],e.clientY-down[1])>5)return;const i=pickChar(e);if(i>=0)focus(i)});
function focus(i){cur=i;const c=chars[i],a=c.rotation.y;
  flyTo(new THREE.Vector3(c.position.x+Math.sin(a)*5.2,3.4,c.position.z+Math.cos(a)*5.2),new THREE.Vector3(c.position.x,1.9,c.position.z));
  $('cimg').src=members[i].avatar;$('cname').textContent=members[i].name;$('ctrait').textContent=members[i].text;$('card').style.display='flex'}
$('cback').onclick=()=>{play=-1;mv=false;py=0;vy=0;$('playbar').style.display='none';cur=-1;$('card').style.display='none';flyTo(HOME[0].clone(),HOME[1].clone())};
function openP(i){const m=members[i];$('pname').textContent=m.name+' – Portfolio';$('pframe').src=m.url;$('plink').href=m.url;$('panel').style.display='flex'}
$('cbtn').onclick=()=>openP(cur);$('pbtn').onclick=()=>{mv=false;openP(play)};
const blocks=[[-8,7,4.3],[-10.5,-17,3.8],[-8,-17,3.8],[-5.5,-17,3.8],[12,-10,3],[16,2,3.2]];
function walk(c,dx,dz){let x=c.position.x+dx,z=c.position.z+dz;
  for(const b of blocks){const ex=x-b[0],ez=z-b[1],d=Math.hypot(ex,ez);if(d<b[2]&&d>0){x=b[0]+ex/d*b[2];z=b[1]+ez/d*b[2]}}
  chars.forEach(o=>{if(o===c)return;const ex=x-o.position.x,ez=z-o.position.z,d=Math.hypot(ex,ez);if(d<1.6&&d>0){x=o.position.x+ex/d*1.6;z=o.position.z+ez/d*1.6}});
  const r=Math.hypot(x,z);if(r>27){x*=27/r;z*=27/r}c.position.x=x;c.position.z=z}
function enterPlay(){if(cur<0)return;document.activeElement.blur();play=cur;py=0;vy=0;$('card').style.display='none';$('playbar').style.display='flex';$('pbname').textContent=members[play].name;
  const c=chars[play],ry=c.rotation.y;flyTo(new THREE.Vector3(c.position.x-Math.sin(ry)*7,4.5,c.position.z-Math.cos(ry)*7),new THREE.Vector3(c.position.x,1.8,c.position.z),1.2)}
function exitPlay(){const i=play;play=-1;mv=false;py=0;vy=0;$('playbar').style.display='none';if(i>=0)focus(i)}
$('cplay').onclick=enterPlay;$('pexit').onclick=exitPlay;
function playMove(dt){const c=chars[play],f=(keys.KeyW||keys.ArrowUp?1:0)-(keys.KeyS||keys.ArrowDown?1:0),r=(keys.KeyD||keys.ArrowRight?1:0)-(keys.KeyA||keys.ArrowLeft?1:0);mv=!!(f||r);
  if(mv){camera.getWorldDirection(v1);v1.y=0;v1.normalize();v2.crossVectors(v1,camera.up).normalize();const d=v1.multiplyScalar(f).add(v2.multiplyScalar(r)).normalize();
    walk(c,d.x*dt*6,d.z*dt*6);let da=Math.atan2(d.x,d.z)-c.rotation.y;da=Math.atan2(Math.sin(da),Math.cos(da));c.rotation.y+=da*Math.min(1,dt*10)}
  if(keys.Space&&py===0)vy=8;vy-=22*dt;py+=vy*dt;if(py<=0){py=0;vy=0}
  v1.set(c.position.x,1.8+py*.5,c.position.z).sub(controls.target).multiplyScalar(.2);controls.target.add(v1);camera.position.add(v1)}
function closeP(){$('panel').style.display='none';$('pframe').src='about:blank'}
const keys={};addEventListener('keydown',e=>{keys[e.code]=1;if(play>=0&&(e.code==='Space'||e.code.startsWith('Arrow')))e.preventDefault();if(e.key==='Escape'){if($('panel').style.display==='flex')closeP();else if(play>=0)exitPlay()}});addEventListener('keyup',e=>keys[e.code]=0);
function move(dt){if(play>=0)return playMove(dt);const f=(keys.KeyW||keys.ArrowUp?1:0)-(keys.KeyS||keys.ArrowDown?1:0),r=(keys.KeyD||keys.ArrowRight?1:0)-(keys.KeyA||keys.ArrowLeft?1:0);if(!started||(!f&&!r))return;
  camera.getWorldDirection(v1);v1.y=0;v1.normalize();v2.crossVectors(v1,camera.up).normalize();const d=v1.multiplyScalar(f*dt*9).add(v2.multiplyScalar(r*dt*9));
  controls.target.add(d);camera.position.add(d);fly=null;if(controls.target.length()>22){controls.target.sub(d);camera.position.sub(d)}}
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight)});

