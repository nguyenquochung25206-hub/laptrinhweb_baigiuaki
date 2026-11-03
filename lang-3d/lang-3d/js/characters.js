/* CHARACTERS: dựng 6 nhân vật con vật + bảng tên (dữ liệu lấy từ data/members.js) */
// ---------- 6 nhân vật con vật ----------
function animal(m){
  const g=new THREE.Group(),c=m.color,lt=new THREE.Color(c).lerp(new THREE.Color(0xffffff),.55).getHex();
  S(.85,c,0,1,0,g,1,1.05,.9);S(.55,lt,0,.95,.5,g,1,1.1,.5);
  const head=new THREE.Group();head.position.y=2.1;g.add(head);S(.75,c,0,0,0,head,1.1,1,1);
  const arms=[],wings=[];
  [-1,1].forEach(s=>{
    const a=new THREE.Group();a.position.set(s*.85,1.5,0);S(.2,c,0,-.4,0,a,1,1.9,1);g.add(a);arms.push({a,s});
    S(.3,c,s*.4,.12,.3,g,1,.5,1.4);
    if(m.animal!=='frog'){S(.1,0x222222,s*.28,.1,.66,head);S(.035,0xffffff,s*.25,.14,.74,head)}
  });
  if(m.animal==='duck'){S(.25,0xff9f1c,0,-.12,.75,head,1.4,.55,1);S(.12,c,0,.78,.1,head,1,2,1)}
  if(m.animal==='bear'){[-1,1].forEach(s=>{S(.28,c,s*.58,.62,0,head);S(.15,lt,s*.58,.62,.1,head)});S(.3,lt,0,-.2,.6,head,1.1,.8,.8);S(.09,0x222222,0,-.1,.88,head)}
  if(m.animal==='cat'){[-1,1].forEach(s=>{const e=mesh(new THREE.ConeGeometry(.28,.55,4),mat(c),s*.5,.78,0,head);e.rotation.z=-s*.25});S(.07,0xff6f91,0,-.1,.75,head);
    [-1,1].forEach(s=>[-.05,.08].forEach(y=>{const w=B(.5,.015,.015,0x555555,s*.6,-.15+y,.7,head);w.rotation.z=s*(y*2)}));
    const t=mesh(new THREE.ConeGeometry(.15,1,8),mat(c),0,.9,-.95,g);t.rotation.x=-1}
  if(m.animal==='rabbit'){[-1,1].forEach(s=>{const e=new THREE.Group();e.position.set(s*.3,.85,0);e.rotation.z=-s*.15;
      mesh(new THREE.CylinderGeometry(.17,.17,1.1,12),mat(c),0,.55,0,e);S(.17,c,0,1.1,0,e);S(.08,lt,0,.6,.12,e,1,5,.5);head.add(e)});
    S(.07,0xff6f91,0,-.1,.75,head);S(.25,0xffffff,0,.7,-.85,g)}
  if(m.animal==='frog'){[-1,1].forEach(s=>{S(.3,c,s*.4,.62,.2,head);S(.2,0xffffff,s*.4,.72,.4,head);S(.1,0x111111,s*.4,.72,.56,head)});B(.7,.05,.05,0x2b6b2b,0,-.25,.72,head)}
  if(m.trait==='glasses'){[-1,1].forEach(s=>mesh(new THREE.TorusGeometry(.19,.035,8,20),mat(0x222222),s*.28,.12,.76,head));B(.2,.03,.03,0x222222,0,.14,.78,head)}
  if(m.trait==='hat'){mesh(new THREE.ConeGeometry(.5,.9,16),mat(0xe53935),0,1.1,0,head);mesh(new THREE.CylinderGeometry(.75,.75,.07,20),mat(0xb71c1c),0,.74,0,head);S(.1,0xffeb3b,0,1.58,0,head)}
  if(m.trait==='wings'){[-1,1].forEach(s=>{const p=new THREE.Group();p.position.set(s*.6,1.5,-.55);const w=S(.5,0xffffff,s*.45,.2,0,p,1,.25,1.6);w.rotation.z=s*.5;g.add(p);wings.push({p,s})})}
  if(m.trait==='backpack'){B(.95,1.1,.45,0xff8c1a,0,1.15,-.85,g);B(.6,.4,.15,0xe67300,0,.95,-1.1,g);[-1,1].forEach(s=>B(.1,1,.1,0xe67300,s*.4,1.5,.5,g))}
  if(m.trait==='bow'){[-1,1].forEach(s=>{const k=mesh(new THREE.ConeGeometry(.22,.45,12),mat(0xff3b6b),s*.25,1.5,.62,g);k.rotation.z=s*Math.PI/2*-1});S(.1,0xff3b6b,0,1.5,.64,g)}
  cast(g);return{g,head,arms,wings}}
const chars=[],tags=[];
members.forEach((m,i)=>{const o=animal(m),a=i/6*6.283;o.g.position.set(Math.sin(a)*4.2,0,Math.cos(a)*4.2);o.g.rotation.y=a;
  o.g.userData={idx:i,a,ph:rnd(0,6),head:o.head,arms:o.arms,wings:o.wings};o.g.traverse(x=>x.userData.idx=i);scene.add(o.g);chars.push(o.g);
  const t=document.createElement('div');t.className='tag';t.innerHTML=`<img src="${m.avatar}" onerror="this.style.visibility='hidden'">${m.name}`;document.body.appendChild(t);tags.push(t)});

