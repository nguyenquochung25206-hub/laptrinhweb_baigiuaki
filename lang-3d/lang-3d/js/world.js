/* WORLD: ngôi làng – đất, cây, hoa, cỏ, nấm, nhà, hồ, thác, đèn, mây, bướm, chim, đom đóm */
// Mặt đất, đường làng
const ground=mesh(new THREE.CircleGeometry(32,64),mat(0x6cc24a));ground.rotation.x=-Math.PI/2;ground.receiveShadow=true;scene.add(ground);
const ring=mesh(new THREE.RingGeometry(5.6,7.6,64),mat(0xe8c98a),0,.03,0,scene);ring.rotation.x=-Math.PI/2;
const stage=mesh(new THREE.CircleGeometry(5.6,64),mat(0xf3dfae),0,.025,0,scene);stage.rotation.x=-Math.PI/2;stage.receiveShadow=true;
function pathTo(x,z){const d=Math.hypot(x,z),a=Math.atan2(x,z),len=d-7.5-3,m=B(1.5,.04,len,0xe8c98a,Math.sin(a)*(7.5+len/2),.03,Math.cos(a)*(7.5+len/2),scene);m.rotation.y=a}
[[-8,-17,8],[0,0,0]].forEach(()=>{});
const obs=[[-8,-5.5,3],[-8,7,5.5],[-8,-17,8],[12,-10,4.5],[16,2,4.5]];
const free=(x,z,pad)=>Math.hypot(x,z)>8.5&&Math.hypot(x,z)<29&&obs.every(o=>Math.hypot(x-o[0],z-o[1])>o[2]+pad);
function spot(pad,rmin){let x,z,n=0;do{const a=rnd(0,6.283),r=rnd(rmin,28);x=Math.sin(a)*r;z=Math.cos(a)*r}while(!free(x,z,pad)&&n++<80);return[x,z]}

// Đồi
[[-22,-10,7],[20,-22,9],[4,-26,10],[27,-4,6],[-24,14,6]].forEach(([x,z,r])=>{mesh(new THREE.SphereGeometry(r,32,16,0,6.283,0,1.5708),mat(0x58b03c),x,0,z,scene).receiveShadow=true});

// Cây (cành lá đung đưa)
const sway=[];
function tree(x,z,s,fruit){
  const g=new THREE.Group();g.position.set(x,0,z);
  mesh(new THREE.CylinderGeometry(.25*s,.38*s,2*s,10),mat(0x8b5a2b),0,s,0,g);
  const lc=pick([0x3fae3f,0x56c256,0x2e9a4f,0x7ad04a]),top=new THREE.Group();top.position.y=2*s;g.add(top);
  [[0,.9,0,1.4],[.7,.4,.2,1],[-.6,.5,-.3,1.05]].forEach(([a,b,c,r])=>S(r*s,lc,a*s,b*s,c*s,top));
  if(fruit)for(let i=0;i<7;i++)S(.17*s,pick([0xff3b3b,0xff9f1c]),rnd(-1,1)*s,rnd(.2,1.4)*s,rnd(1,1.3)*s*(i%2?1:-1),top);
  cast(g);scene.add(g);sway.push({o:top,a:.04,ph:rnd(0,6)});
}
for(let i=0;i<20;i++){const[x,z]=spot(2,11);tree(x,z,i%3===0?1.5:i%3===1?.8:1.1,i%4===0)}

// Hoa
const fl=[],fpal=[0xff4d6d,0xffd93b,0xff9f1c,0xc77dff,0xffffff,0xff85c8,0x7bdff2],stemG=new THREE.CylinderGeometry(.03,.03,.6,5),headG=new THREE.SphereGeometry(.15,10,8);
for(let i=0;i<130;i++){const[x,z]=spot(.5,7.8),g=new THREE.Group();g.position.set(x,0,z);
  mesh(stemG,mat(0x2e8b3a),0,.3,0,g);const h=mesh(headG,mat(pick(fpal)),0,.65,0,g);mesh(headG,mat(0xffe066),0,.72,.06,g).scale.setScalar(.45);
  scene.add(g);fl.push(g);sway.push({o:g,a:.12,ph:rnd(0,6)})}

// Cỏ chuyển động theo gió
const GN=550,grass=new THREE.InstancedMesh(new THREE.ConeGeometry(.07,.7,4).translate(0,.35,0),mat(0xffffff),GN),gd=[],dm=new THREE.Object3D();
for(let i=0;i<GN;i++){const[x,z]=spot(0,6.5);gd.push({x,z,s:rnd(.7,1.6),ph:rnd(0,6)});grass.setColorAt(i,new THREE.Color().setHSL(rnd(.25,.36),.6,rnd(.35,.5)))}
scene.add(grass);

// Nấm khổng lồ
[[-17,-8,0xe53935],[-19,-3.5,0xab47bc],[2,-17,0xff9800],[7,18,0xe53935]].forEach(([x,z,c])=>{
  const g=new THREE.Group();g.position.set(x,0,z);const s=rnd(1,1.4);g.scale.setScalar(s);
  mesh(new THREE.CylinderGeometry(.35,.5,1.8,14),mat(0xfff1d6),0,.9,0,g);
  mesh(new THREE.SphereGeometry(1.5,24,14,0,6.283,0,1.5708),mat(c),0,1.7,0,g);
  for(let i=0;i<7;i++){const a=i*0.9,r=.4+(i%3)*.4;S(.16,0xffffff,Math.cos(a)*r,1.7+Math.sqrt(Math.max(0,2.2-r*r))*.55+ .03,Math.sin(a)*r,g,1,.5,1)}
  cast(g);scene.add(g)});

// Nhà gỗ + cửa hàng
function hut(x,z){const g=new THREE.Group();g.position.set(x,0,z);
  B(4,2.6,3.6,0xb5835a,0,1.3,0,g);const roof=mesh(new THREE.ConeGeometry(3.7,2,4),mat(0xd9534f),0,3.6,0,g);roof.rotation.y=Math.PI/4;
  B(.9,1.6,.1,0x5a3a1a,-.7,.8,1.82,g);B(.9,.8,.1,0xfff2a8,.9,1.5,1.82,g).material.emissive=new THREE.Color(0x553300);
  B(.5,1.2,.5,0x8a8f99,1.2,3.8,-.6,g);g.lookAt(0,0,0);cast(g);scene.add(g)}
hut(12,-10);
(function(){const g=new THREE.Group();g.position.set(16,0,2);
  B(4.5,2.4,3,0xffd27a,0,1.2,0,g);B(4.8,.3,3.2,0x8b5a2b,0,2.5,0,g);
  for(let i=0;i<6;i++){const a=B(.8,.1,1.6,i%2?0xffffff:0xe53935,-2+i*.8+.4,2.2,1.9,g);a.rotation.x=.45}
  const c=document.createElement('canvas');c.width=128;c.height=48;const x=c.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,128,48);x.fillStyle='#e53935';x.font='bold 32px Arial';x.textAlign='center';x.fillText('SHOP',64,36);
  mesh(new THREE.PlaneGeometry(2,.75),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(c)}),0,3,1.62,g);
  B(.8,.7,.8,0xc98a4b,-1.6,.35,2.6,g);B(.7,.5,.7,0xd9a05b,-.8,.25,2.7,g);
  g.lookAt(0,0,0);cast(g);scene.add(g)})();
pathTo(12,-10);pathTo(16,2);

// Núi đá + thác nước + suối + hồ + cầu
const cliff=B(11,6.4,6,0x8a8f99,-8,3.2,-18,scene);B(11.4,.4,6.4,0x6cc24a,-8,6.5,-18,scene);cast(cliff);
function flowTex(rx,ry){const c=document.createElement('canvas');c.width=64;c.height=128;const g=c.getContext('2d');g.fillStyle='#3ab4ff';g.fillRect(0,0,64,128);g.fillStyle='rgba(255,255,255,.65)';for(let i=0;i<24;i++)g.fillRect(Math.random()*60,Math.random()*128,rnd(2,5),rnd(14,40));const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(rx,ry);return t}
const fallT=flowTex(1,2),streamT=flowTex(1,5);
mesh(new THREE.PlaneGeometry(2.2,6.2),new THREE.MeshBasicMaterial({map:fallT}),-8,3.1,-14.95,scene);
const st=mesh(new THREE.PlaneGeometry(1.8,18.4),new THREE.MeshBasicMaterial({map:streamT,transparent:true,opacity:.92}),-8,.04,-5.5,scene);st.rotation.x=-Math.PI/2;
const pondG=new THREE.PlaneGeometry(8,8,24,24),pond=mesh(pondG,new THREE.MeshPhongMaterial({color:0x2e9fe6,transparent:true,opacity:.82,shininess:120,specular:0xffffff}),-8,.06,7,scene);pond.rotation.x=-Math.PI/2;
const pondBase=pondG.attributes.position.array.slice();
for(let i=0;i<14;i++){const a=i/14*6.283;S(.4,0x9aa0a8,-8+Math.cos(a)*4.1,.2,7+Math.sin(a)*4.1,scene,1,.7,1)}
[[-6.5,5.5],[-9.4,8.5],[-7.2,9]].forEach(([x,z])=>{const l=mesh(new THREE.CylinderGeometry(.5,.5,.03,16),mat(0x2faa3a),x,.1,z,scene)});
const fish=[0,1,2,3].map(i=>{const g=new THREE.Group();S(.22,i%2?0xff7a00:0xffb703,0,0,0,g,1.8,.8,.8);mesh(new THREE.ConeGeometry(.15,.3,4),mat(0xff7a00),-.42,0,0,g).rotation.z=Math.PI/2;g.position.y=.02;scene.add(g);return{g,r:1+i*.7,sp:.5+i*.15,ph:i*1.7}});
(function(){const g=new THREE.Group();g.position.set(-8,0,-4);
  B(4.4,.2,1.5,0x8b5a2b,0,.45,0,g);for(let i=0;i<8;i++)B(.5,.04,1.52,0xa66a35,-1.9+i*.54,.57,0,g);
  [-.7,.7].forEach(z=>{B(4.4,.08,.08,0x6b4423,0,1.1,z,g);[-2,0,2].forEach(x=>B(.1,.7,.1,0x6b4423,x,.8,z,g))});
  B(.3,.5,1.5,0x6b4423,-2.1,.25,0,g);B(.3,.5,1.5,0x6b4423,2.1,.25,0,g);cast(g);scene.add(g)})();

// Đèn đường phát sáng
const lamps=[],bulbMat=mat(0xfff2b0,{emissive:0xffcc55,emissiveIntensity:.3});
for(let i=0;i<6;i++){const a=i/6*6.283+.52,x=Math.sin(a)*8.4,z=Math.cos(a)*8.4,g=new THREE.Group();g.position.set(x,0,z);
  mesh(new THREE.CylinderGeometry(.07,.1,2.6,8),mat(0x3b3b3b),0,1.3,0,g);mesh(new THREE.SphereGeometry(.3,16,12),bulbMat,0,2.8,0,g);
  const l=new THREE.PointLight(0xffd27a,0,14);l.position.set(0,2.8,0);g.add(l);lamps.push(l);scene.add(g)}

// Mặt trời + mây
const sunMesh=mesh(new THREE.SphereGeometry(3,24,16),new THREE.MeshBasicMaterial({color:0xffe066,fog:false}),30,30,-40,scene);
const clouds=[];for(let i=0;i<9;i++){const c=new THREE.Group();for(let j=0;j<4;j++)S(1+Math.random()*.9,0xffffff,j*1.3-2,Math.random()*.5,Math.random(),c);
  c.position.set(rnd(-45,45),rnd(13,20),rnd(-40,10));c.userData.sp=rnd(.2,.5);scene.add(c);clouds.push(c)}

// Bướm, ong, chim, đom đóm
function wingPair(color,w,h){const g=new THREE.Group(),ws=[];[-1,1].forEach(s=>{const p=new THREE.Group(),m=mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({color,side:THREE.DoubleSide}),s*w/2,0,0,p);m.rotation.x=-Math.PI/2;g.add(p);ws.push({p,s})});g.userData.ws=ws;return g}
const flyers=[];
for(let i=0;i<8;i++){const g=wingPair(pick([0xff6fb5,0xffd93b,0xa78bfa,0xff9f1c]),.4,.3);S(.05,0x222222,0,0,0,g,1,1,3);const f=pick(fl).position;scene.add(g);flyers.push({g,cx:f.x,cz:f.z,r:rnd(1,2.2),sp:rnd(.6,1.1),ph:rnd(0,6),k:'b'})}
for(let i=0;i<4;i++){const g=new THREE.Group();S(.1,0xffd000,0,0,0,g,1,1,1.4);S(.1,0x222,0,0,-.08,g,1.02,1.02,.3);const f=pick(fl).position;scene.add(g);flyers.push({g,cx:f.x,cz:f.z,r:rnd(.6,1.4),sp:rnd(1.5,2.5),ph:rnd(0,6),k:'e'})}
const birds=[];for(let i=0;i<5;i++){const g=wingPair(0xffffff,.9,.35);S(.18,0xff8a3d,0,0,0,g,1,1,1.6);scene.add(g);birds.push({g,r:rnd(15,26),h:rnd(11,17),sp:rnd(.15,.3),ph:rnd(0,6)})}
const FN=80,fpos=new Float32Array(FN*3),fbase=[];
for(let i=0;i<FN;i++){const a=rnd(0,6.283),r=rnd(4,26);fbase.push([Math.sin(a)*r,rnd(.6,3.5),Math.cos(a)*r,rnd(0,6)])}
const fgeo=new THREE.BufferGeometry();fgeo.setAttribute('position',new THREE.BufferAttribute(fpos,3));
const fmat=new THREE.PointsMaterial({color:0xd8ff5a,size:.45,transparent:true,opacity:.3,blending:THREE.AdditiveBlending,depthWrite:false});scene.add(new THREE.Points(fgeo,fmat));

