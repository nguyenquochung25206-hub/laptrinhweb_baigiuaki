/* MAIN: màn hình mở đầu, ngày/đêm, vòng lặp hoạt ảnh */
$('hud').firstChild.textContent=SITE.title;$('hud').querySelector('small').textContent=SITE.subtitle;
$('intro').querySelector('h1').textContent=SITE.title;document.title=SITE.title;
// ---------- Ngày / đêm ----------
let night=0,nightT=0;$('nt').onclick=()=>{nightT=nightT?0:1;$('nt').textContent=nightT?'☀️':'🌙'};

// ---------- Màn hình mở đầu ----------
$('enter').onclick=()=>{$('intro').classList.add('open');$('enter').style.display='none';music(true);
  setTimeout(()=>{$('intro').style.opacity=0;flyTo(HOME[0].clone(),HOME[1].clone(),3.2);started=true},1000);setTimeout(()=>$('intro').style.display='none',2000)};

// ---------- Vòng lặp ----------
const clock=new THREE.Clock(),NC=new THREE.Color();
(function loop(){requestAnimationFrame(loop);const dt=Math.min(clock.getDelta(),.05),t=clock.elapsedTime;
  if(fly){let k=Math.min(1,(performance.now()-fly.s)/fly.d);k=k*k*(3-2*k);camera.position.lerpVectors(fly.p0,fly.p1,k);controls.target.lerpVectors(fly.t0,fly.t1,k);if(k>=1)fly=null}
  move(dt);controls.update();
  night+=(nightT-night)*.04;NC.copy(DAY).lerp(NIGHT,night);scene.background.copy(NC);scene.fog.color.copy(NC);
  hemi.intensity=.95-night*.7;sun.intensity=.9-night*.8;sunMesh.visible=night<.6;lamps.forEach(l=>l.intensity=night*1.4);bulbMat.emissiveIntensity=.3+night*1.5;fmat.opacity=.3+night*.7;
  sway.forEach(s=>{s.o.rotation.z=Math.sin(t*1.4+s.ph)*s.a;s.o.rotation.x=Math.cos(t*1.1+s.ph)*s.a*.6});
  for(let i=0;i<GN;i++){const d=gd[i],w=Math.sin(t*1.6+d.x*.4+d.z*.3)*.22;dm.position.set(d.x,0,d.z);dm.rotation.set(w*.6,0,w);dm.scale.setScalar(d.s);dm.updateMatrix();grass.setMatrixAt(i,dm.matrix)}grass.instanceMatrix.needsUpdate=true;
  fallT.offset.y+=dt*1.4;streamT.offset.y+=dt*.9;
  const pa=pondG.attributes.position;for(let i=0;i<pa.count;i++){const x=pondBase[i*3],y=pondBase[i*3+1];pa.setZ(i,Math.sin(Math.hypot(x,y)*2.6-t*2.2)*.05+Math.sin(x*1.7+t)*.02)}pa.needsUpdate=true;pondG.computeVertexNormals();
  fish.forEach(f=>{const a=t*f.sp+f.ph;f.g.position.set(-8+Math.cos(a)*f.r*1.5,.02,7+Math.sin(a)*f.r*1.5);f.g.rotation.y=-a-Math.PI/2});
  flyers.forEach(f=>{const a=t*f.sp+f.ph;f.g.position.set(f.cx+Math.cos(a)*f.r,1+Math.sin(t*2+f.ph)*.35+(f.k==='e'?.3:.4),f.cz+Math.sin(a*1.3)*f.r);f.g.rotation.y=-a;
    const fl=Math.sin(t*(f.k==='b'?16:50))*.9;if(f.g.userData.ws)f.g.userData.ws.forEach(w=>w.p.rotation.z=w.s*fl)});
  birds.forEach(b=>{const a=t*b.sp+b.ph;b.g.position.set(Math.cos(a)*b.r,b.h+Math.sin(t)*.5,Math.sin(a)*b.r-5);b.g.rotation.y=-a;const fl=Math.sin(t*6+b.ph)*.7;b.g.userData.ws.forEach(w=>w.p.rotation.z=w.s*fl)});
  for(let i=0;i<FN;i++){const b=fbase[i];fpos[i*3]=b[0]+Math.sin(t*.5+b[3])*1.2;fpos[i*3+1]=b[1]+Math.sin(t*.9+b[3]*2)*.5;fpos[i*3+2]=b[2]+Math.cos(t*.4+b[3])*1.2}fgeo.attributes.position.needsUpdate=true;
  clouds.forEach(c=>{c.position.x+=c.userData.sp*dt;if(c.position.x>50)c.position.x=-50});
  chars.forEach((c,i)=>{const u=c.userData,h=(hover===i||cur===i)&&play<0;c.position.y=i===play?py+(mv&&py===0?Math.abs(Math.sin(t*12))*.15:0):Math.abs(Math.sin(t*2+u.ph))*(h?.45:.1);c.scale.lerp(tmp.setScalar(h?1.1:1),.15);
    u.head.rotation.y=Math.sin(t+u.ph)*.2;u.arms.forEach(a=>{a.a.rotation.x=(i===play&&mv)?Math.sin(t*14)*a.s*.9:0;a.a.rotation.z=a.s*(.25+Math.sin(t*2+u.ph)*.1)+(h&&a.s<0?-Math.abs(Math.sin(t*8))*1.6:0)});
    u.wings.forEach(w=>w.p.rotation.z=w.s*Math.sin(t*9+u.ph)*.35);
    tmp.set(c.position.x,c.position.y+4.2,c.position.z).project(camera);const tg=tags[i];tg.style.display=(started&&tmp.z<1)?'flex':'none';tg.style.left=(tmp.x*.5+.5)*innerWidth+'px';tg.style.top=(-tmp.y*.5+.5)*innerHeight+'px'});
  renderer.render(scene,camera)})();
