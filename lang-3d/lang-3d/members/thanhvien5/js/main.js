const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
let progress = 0;
const mouse = { x: 0, y: 0 };
const mix = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t));
const SHALLOW = [0, 150, 225], DEEP = [20, 6, 70];

/* ===== DỮ LIỆU DỰ ÁN (chỉnh sửa tại đây) ===== */
const PROJECTS = [
  { id: 1, type: 'web', icon: '♟️', img: 'images/caro.jpg', title: 'Game Caro trực tuyến', status: 'Đang hoàn thiện',
    desc: 'Trò chơi Caro cho phép người chơi thi đấu trực tuyến. Mình tự thiết kế và xây dựng nhiều phần của dự án, từ giao diện, luật chơi đến luồng kết nối giữa hai người chơi.',
    tags: ['Game', 'Trực tuyến', 'Lập trình'], link: 'https://github.com/nguyenquochung25206-hub' },
  { id: 2, type: 'web', icon: '🛒', img: 'images/shop.jpg', title: 'Website mua bán đồ cũ', status: 'Đang hoàn thiện',
    desc: 'Website giúp người dùng đăng tin, tìm kiếm và mua bán đồ cũ. Dự án giúp mình thực hành quy trình Full-stack: giao diện, xử lý nghiệp vụ và cơ sở dữ liệu.',
    tags: ['Web', 'Full-stack', 'Cơ sở dữ liệu'], link: 'https://github.com/nguyenquochung25206-hub' },
  { id: 3, type: 'ai', icon: '🧬', img: 'images/isic.jpg', title: 'ISIC Skin Lesion Detection & Segmentation', status: 'Hoàn thành',
    desc: 'Dự án AI phát hiện và phân vùng tổn thương da trên bộ dữ liệu ISIC, sử dụng Faster R-CNN cho bài toán phát hiện và U-Net cho phân vùng. Mình tự thực hiện toàn bộ quy trình của dự án.',
    tags: ['Python', 'Faster R-CNN', 'U-Net', 'Deep Learning'], link: 'https://github.com/nguyenquochung25206-hub' }
];
const grid = $('#projGrid');
grid.innerHTML = PROJECTS.map(p => `
  <article class="card proj" data-type="${p.type}" data-id="${p.id}" tabindex="0">
    <div class="thumb"><img src="${p.img}" alt="${p.title}" onerror="this.replaceWith(document.createTextNode('${p.icon}'))"></div>
    <div class="body"><span class="status">● ${p.status}</span><h3>${p.title}</h3>
    <p class="chips">${p.tags.map(t => `<span>${t}</span>`).join('')}</p></div>
  </article>`).join('');

/* ===== Menu mobile, nav active, scroll-top ===== */
$('#burger').onclick = () => $('#menu').classList.toggle('open');
$$('nav a').forEach(a => a.addEventListener('click', () => $('#menu').classList.remove('open')));
$('#toTop').onclick = () => scrollTo({ top: 0, behavior: 'smooth' });

function onScroll() {
  const max = document.documentElement.scrollHeight - innerHeight;
  progress = max > 0 ? scrollY / max : 0;
  $('#depthVal').textContent = Math.round(progress * 11000); // minh họa độ sâu
  $('#toTop').classList.toggle('show', scrollY > 500);
  const c = mix(SHALLOW, DEEP, Math.min(1, progress * 1.4));
  document.body.style.backgroundColor = `rgb(${c})`;
  let cur = '';
  $$('section[id]').forEach(s => { if (scrollY >= s.offsetTop - 200) cur = s.id; });
  $$('nav a').forEach(a => a.classList.toggle('on', a.hash === '#' + cur));
}
addEventListener('scroll', onScroll, { passive: true }); onScroll();

/* ===== Hiệu ứng xuất hiện khi cuộn + thanh kỹ năng ===== */
$$('.bar i').forEach(i => i.style.setProperty('--w', i.dataset.level + '%'));
const io = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && e.target.classList.add('show')), { threshold: .15 });
$$('.reveal').forEach(el => io.observe(el));

/* ===== Gõ chữ ===== */
const words = ['AI / Machine Learning Engineer', 'Sinh viên UTH', 'Người ham học hỏi'];
let wi = 0, ci = 0, del = false;
(function type() {
  const w = words[wi];
  $('#typed').textContent = w.slice(0, ci += del ? -1 : 1);
  if (!del && ci === w.length) { del = true; return setTimeout(type, 1500); }
  if (del && ci === 0) { del = false; wi = (wi + 1) % words.length; }
  setTimeout(type, del ? 35 : 80);
})();

/* ===== Lọc dự án + Modal ===== */
$$('.filters button').forEach(b => b.onclick = () => {
  $$('.filters button').forEach(x => x.classList.remove('active')); b.classList.add('active');
  $$('.proj').forEach(p => p.classList.toggle('hide', b.dataset.f !== 'all' && p.dataset.type !== b.dataset.f));
});
const modal = $('#modal');
function openProj(el) {
  const p = PROJECTS.find(x => x.id == el.dataset.id);
  $('#mTitle').textContent = p.title; $('#mDesc').textContent = p.desc;
  $('#mTags').innerHTML = p.tags.map(t => `<span>${t}</span>`).join(''); $('#mLink').href = p.link;
  modal.classList.add('open');
}
$$('.proj').forEach(el => { el.onclick = () => openProj(el); el.onkeydown = e => e.key === 'Enter' && openProj(el); });
$('#mClose').onclick = () => modal.classList.remove('open');
modal.onclick = e => e.target === modal && modal.classList.remove('open');
addEventListener('keydown', e => e.key === 'Escape' && (modal.classList.remove('open'), $('#lightbox').classList.remove('open')));
/* ===== Lightbox ảnh cá nhân ===== */
$$('.gallery figure').forEach(f => f.onclick = () => {
  const im = f.querySelector('img'); if (!im) return;
  $('#lbImg').src = im.src; $('#lbCap').textContent = f.querySelector('figcaption').textContent; $('#lightbox').classList.add('open');
});
$('#lbClose').onclick = () => $('#lightbox').classList.remove('open');
$('#lightbox').onclick = e => e.target.id === 'lightbox' && e.target.classList.remove('open');


/* ===== Form liên hệ + kiểm tra dữ liệu ===== */
const rules = {
  fName: v => v.trim().length >= 2 || 'Vui lòng nhập họ tên (≥ 2 ký tự).',
  fMail: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Email chưa hợp lệ.',
  fMsg: v => v.trim().length >= 10 || 'Lời nhắn cần ít nhất 10 ký tự.'
};
$('#form').addEventListener('submit', e => {
  e.preventDefault();
  let ok = true;
  for (const id in rules) {
    const r = rules[id]($('#' + id).value);
    $('#' + id).nextElementSibling.textContent = r === true ? '' : r;
    if (r !== true) ok = false;
  }
  $('#formOk').textContent = '';
  if (!ok) return;
  const body = `${$('#fMsg').value}\n\n— ${$('#fName').value} (${$('#fMail').value})`;
  location.href = `mailto:nguyenquochung2502@gmail.com?subject=${encodeURIComponent('Liên hệ từ Portfolio')}&body=${encodeURIComponent(body)}`;
  $('#formOk').textContent = '✓ Cảm ơn bạn! Ứng dụng email đang được mở để gửi tin nhắn.';
  e.target.reset();
});

/* ===== Âm thanh đại dương (Web Audio, không cần file) ===== */
let audio = null;
$('#soundBtn').onclick = function () {
  if (!audio) {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const buf = ctx.createBuffer(1, ctx.sampleRate * 3, ctx.sampleRate), d = buf.getChannelData(0);
    let last = 0;
    for (let i = 0; i < d.length; i++) { last = (last + .02 * (Math.random() * 2 - 1)) / 1.02; d[i] = last * 3.5; }
    const src = ctx.createBufferSource(); src.buffer = buf; src.loop = true;
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 500;
    const g = ctx.createGain(); g.gain.value = .5;
    const lfo = ctx.createOscillator(), lg = ctx.createGain(); lfo.frequency.value = .12; lg.gain.value = .3;
    lfo.connect(lg).connect(g.gain); src.connect(lp).connect(g).connect(ctx.destination);
    src.start(); lfo.start(); audio = ctx;
    this.classList.add('on'); this.textContent = '🔊'; this.setAttribute('aria-pressed', 'true'); return;
  }
  const on = audio.state === 'running';
  on ? audio.suspend() : audio.resume();
  this.classList.toggle('on', !on); this.textContent = on ? '🔇' : '🔊'; this.setAttribute('aria-pressed', String(!on));
};

/* ===== CẢNH 3D ĐẠI DƯƠNG (Three.js) ===== */
(function ocean() {
  const cv = $('#scene');
  if (!window.THREE) { cv.remove(); return; }
  const DEPTH = 70;
  const R = new THREE.WebGLRenderer({ canvas: cv, antialias: true, alpha: true });
  R.setPixelRatio(Math.min(devicePixelRatio, 2));
  const S = new THREE.Scene();
  S.fog = new THREE.FogExp2(0x0096e1, 0.02);
  const cam = new THREE.PerspectiveCamera(60, 1, .1, 200);
  S.add(new THREE.AmbientLight(0x99bbff, 1.2));
  const lamp = new THREE.PointLight(0x77bbff, 1.6, 45); S.add(lamp);

  // Sinh vật phù du
  const N = 1400, pp = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) { pp[i * 3] = (Math.random() - .5) * 60; pp[i * 3 + 1] = 6 - Math.random() * (DEPTH + 14); pp[i * 3 + 2] = -30 + Math.random() * 38; }
  const pg = new THREE.BufferGeometry(); pg.setAttribute('position', new THREE.BufferAttribute(pp, 3));
  const plankton = new THREE.Points(pg, new THREE.PointsMaterial({ size: .12, color: 0x8fdcff, transparent: true, opacity: .8, blending: THREE.AdditiveBlending, depthWrite: false }));
  S.add(plankton);

  // Sứa phát sáng
  const jellies = [];
  function jelly(x, y, z, col, s) {
    const g = new THREE.Group();
    g.add(new THREE.Mesh(new THREE.SphereGeometry(1, 24, 14, 0, Math.PI * 2, 0, Math.PI / 2),
      new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: .55, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, depthWrite: false })));
    const tents = [];
    for (let i = 0; i < 9; i++) {
      const a = i / 9 * Math.PI * 2, pts = [];
      for (let j = 0; j < 14; j++) pts.push(new THREE.Vector3(Math.cos(a) * .7, -j * .22, Math.sin(a) * .7));
      const l = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color: col, transparent: true, opacity: .65, blending: THREE.AdditiveBlending }));
      g.add(l); tents.push({ l, a });
    }
    g.position.set(x, y, z); g.scale.setScalar(s);
    g.userData = { bx: x, by: y, ph: Math.random() * 6, tents };
    S.add(g); jellies.push(g);
  }
  const cols = [0x00f6ff, 0xc86bff, 0xff3fd0, 0x3dffa8];
  for (let i = 0; i < 12; i++) jelly((Math.random() - .5) * 26, 2 - Math.random() * 62, -4 - Math.random() * 14, cols[i % 4], .8 + Math.random() * 1.1);

  // Rong biển
  const weeds = [];
  for (let i = 0; i < 34; i++) {
    const h = 4 + Math.random() * 5;
    const m = new THREE.Mesh(new THREE.PlaneGeometry(.45, h, 1, 10), new THREE.MeshBasicMaterial({ color: i % 2 ? 0x1fb08a : 0x2ad4a0, transparent: true, opacity: .75, side: THREE.DoubleSide }));
    m.position.set((Math.random() - .5) * 38, -DEPTH + h / 2 - .5, -2 - Math.random() * 10);
    m.userData = { h, ph: Math.random() * 6, base: m.geometry.attributes.position.array.slice() };
    S.add(m); weeds.push(m);
  }

  // Đáy cát
  const sand = new THREE.Mesh(new THREE.PlaneGeometry(90, 50), new THREE.MeshStandardMaterial({ color: 0x1a2a3a, roughness: 1 }));
  sand.rotation.x = -Math.PI / 2; sand.position.set(0, -DEPTH - .6, -10); S.add(sand);

  // Tàu đắm
  const wood = new THREE.MeshStandardMaterial({ color: 0x4a3322, roughness: .9, emissive: 0x110800 });
  const wreck = new THREE.Group();
  const hull = new THREE.Mesh(new THREE.BoxGeometry(11, 2.6, 3.4), wood); wreck.add(hull);
  const bow = new THREE.Mesh(new THREE.ConeGeometry(1.8, 3, 4), wood); bow.rotation.z = -Math.PI / 2; bow.position.x = 6.5; bow.scale.set(1, 1, 1.0); wreck.add(bow);
  [-2.5, 2].forEach((x, i) => {
    const mast = new THREE.Mesh(new THREE.CylinderGeometry(.13, .18, 6.5 - i * 2, 6), wood); mast.position.set(x, 4, 0); mast.rotation.z = i ? -.35 : .12; wreck.add(mast);
    const sail = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 3 - i), new THREE.MeshStandardMaterial({ color: 0x6b6256, side: THREE.DoubleSide, transparent: true, opacity: .75 }));
    sail.position.set(x + (i ? -.7 : .2), 4.6 - i, 0); sail.rotation.y = .5; wreck.add(sail);
  });
  wreck.position.set(6, -DEPTH + 1, -8); wreck.rotation.set(.1, -.4, .28); S.add(wreck);

  // Kho báu
  const chest = new THREE.Group();
  const cm = new THREE.MeshStandardMaterial({ color: 0x6a3f1c, roughness: .8 });
  chest.add(new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.2, 1.3), cm));
  const lid = new THREE.Mesh(new THREE.CylinderGeometry(.65, .65, 2.2, 14, 1, false, 0, Math.PI), cm);
  lid.rotation.z = Math.PI / 2; lid.rotation.y = Math.PI / 2; lid.position.y = .6; chest.add(lid);
  const goldMat = new THREE.MeshBasicMaterial({ color: 0xffd45a });
  const gold = new THREE.Mesh(new THREE.BoxGeometry(1.9, .25, 1), goldMat); gold.position.y = .65; chest.add(gold);
  chest.position.set(-5, -DEPTH, -5); chest.rotation.y = .5; S.add(chest);
  const gl = new THREE.PointLight(0xffc94d, 3, 14); gl.position.set(-5, -DEPTH + 1.5, -4); S.add(gl);
  const coins = [];
  for (let i = 0; i < 16; i++) {
    const c = new THREE.Mesh(new THREE.SphereGeometry(.12, 8, 8), goldMat);
    c.userData = { a: Math.random() * 6, r: .4 + Math.random() * 1.4, s: .4 + Math.random() };
    S.add(c); coins.push(c);
  }


  // ===== Cá neon, cá voi, mực khổng lồ =====
  let pt = 0;
  const fishes = [];
  function fish(col, s, x, y, z, sp) {
    const g = new THREE.Group(), m = new THREE.MeshBasicMaterial({ color: col });
    const b = new THREE.Mesh(new THREE.SphereGeometry(1, 12, 8), m); b.scale.set(1.6, .7, .45);
    const tail = new THREE.Group(), tc = new THREE.Mesh(new THREE.ConeGeometry(.6, 1.1, 4), m);
    tc.rotation.z = -Math.PI / 2; tc.position.x = -.55; tail.add(tc); tail.position.x = -1.5;
    const glow = new THREE.Mesh(new THREE.SphereGeometry(1, 8, 6), new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: .28, blending: THREE.AdditiveBlending, depthWrite: false }));
    glow.scale.set(2.3, 1.2, .9);
    g.add(b, tail, glow); g.scale.setScalar(s); g.position.set(x, y, z);
    if (sp < 0) g.rotation.y = Math.PI;
    g.userData = { tail, sp, ph: Math.random() * 6, y };
    S.add(g); fishes.push(g);
  }
  const neon = [0x00ffd5, 0xff2bd6, 0xffe600, 0x39ff14, 0x00b3ff, 0xff6a00, 0xb300ff, 0xff3355];
  for (let k = 0; k < 9; k++) {
    const sp = (k % 2 ? -1 : 1) * (2 + Math.random() * 2.5), cy = 1 - k * 7.6 - Math.random() * 3, cx = (Math.random() - .5) * 50, cz = -3 - Math.random() * 14;
    for (let i = 0; i < 7; i++) fish(neon[k % neon.length], .35 + Math.random() * .25, cx + (Math.random() - .5) * 8, cy + (Math.random() - .5) * 3, cz + (Math.random() - .5) * 3, sp * (.9 + Math.random() * .3));
  }

  // Cá voi xanh phát sáng
  const wm = new THREE.MeshStandardMaterial({ color: 0x2a84ff, emissive: 0x0d35b0, roughness: .5 });
  const whale = new THREE.Group();
  const wb = new THREE.Mesh(new THREE.SphereGeometry(1, 24, 16), wm); wb.scale.set(7, 2.5, 2.4); whale.add(wb);
  const belly = new THREE.Mesh(new THREE.SphereGeometry(1, 20, 12), new THREE.MeshStandardMaterial({ color: 0xbfe9ff, emissive: 0x335577 }));
  belly.scale.set(6.6, 1.6, 2.3); belly.position.y = -.9; whale.add(belly);
  const wt = new THREE.Group(); wt.position.x = -5.5;
  const ped = new THREE.Mesh(new THREE.ConeGeometry(1.5, 5, 12), wm); ped.rotation.z = Math.PI / 2; ped.position.x = -2.5; wt.add(ped);
  const fluke = new THREE.Mesh(new THREE.BoxGeometry(1.6, .22, 5.8), wm); fluke.position.x = -5.1; wt.add(fluke); whale.add(wt);
  [-1, 1].forEach(sd => {
    const fin = new THREE.Mesh(new THREE.BoxGeometry(2.8, .18, 1.1), wm); fin.position.set(1.5, -1.5, sd * 2.4); fin.rotation.set(sd * .5, 0, -.5); whale.add(fin);
    const eye = new THREE.Mesh(new THREE.SphereGeometry(.2, 8, 8), new THREE.MeshBasicMaterial({ color: 0xffffff })); eye.position.set(5.2, .5, sd * 1.7); whale.add(eye);
    for (let i = 0; i < 9; i++) {
      const u = -.7 + i * .17, sp = new THREE.Mesh(new THREE.SphereGeometry(.14, 6, 6), new THREE.MeshBasicMaterial({ color: 0x7dfff2 }));
      sp.position.set(u * 7, .5 + Math.sin(i) * .2, sd * 2.4 * Math.sqrt(1 - u * u) * .97); whale.add(sp);
    }
  });
  whale.scale.setScalar(1.3); whale.position.set(-60, -21, -15); S.add(whale);

  // Mực khổng lồ
  const sqm = new THREE.MeshBasicMaterial({ color: 0xff2f6e }), squid = new THREE.Group(), arms = [];
  const mantle = new THREE.Mesh(new THREE.ConeGeometry(1.3, 5, 14), sqm); mantle.position.y = 2.5; squid.add(mantle);
  squid.add(new THREE.Mesh(new THREE.SphereGeometry(1.1, 14, 10), sqm));
  const sg = new THREE.Mesh(new THREE.SphereGeometry(1, 12, 10), new THREE.MeshBasicMaterial({ color: 0xff7aa8, transparent: true, opacity: .22, blending: THREE.AdditiveBlending, depthWrite: false }));
  sg.scale.set(2.4, 4.4, 2.4); sg.position.y = 2; squid.add(sg);
  [-1, 1].forEach(sd => {
    const fin = new THREE.Mesh(new THREE.SphereGeometry(1, 8, 6), new THREE.MeshBasicMaterial({ color: 0xffb347 })); fin.scale.set(1.1, .12, 1.3); fin.position.set(sd * 1.5, 4, 0); fin.rotation.z = sd * .4; squid.add(fin);
    const eye = new THREE.Mesh(new THREE.SphereGeometry(.32, 8, 8), new THREE.MeshBasicMaterial({ color: 0x7dffee })); eye.position.set(sd * .85, .2, .8); squid.add(eye);
  });
  for (let i = 0; i < 10; i++) {
    const a = i / 10 * Math.PI * 2, len = i < 8 ? .3 : .62, pts = [];
    for (let j = 0; j < 22; j++) pts.push(new THREE.Vector3(Math.cos(a) * .8, -j * len, Math.sin(a) * .8));
    const l = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color: i < 8 ? 0xff5c8a : 0xffd1e0 }));
    squid.add(l); arms.push({ l, a });
  }
  squid.scale.setScalar(1.5); squid.position.set(-10, -45, -14); S.add(squid);

  function resize() { R.setSize(innerWidth, innerHeight); cam.aspect = innerWidth / innerHeight; cam.updateProjectionMatrix(); }
  addEventListener('resize', resize); resize();
  addEventListener('pointermove', e => { mouse.x = e.clientX / innerWidth * 2 - 1; mouse.y = -(e.clientY / innerHeight * 2 - 1); });

  const clock = new THREE.Clock();
  let camY = 0;
  (function loop() {
    requestAnimationFrame(loop);
    const t = clock.getElapsedTime();
    camY += (-progress * DEPTH - camY) * .06;
    cam.position.set(mouse.x * 1.6, camY + mouse.y * .8, 8 + Math.sin(t * .3) * .5);
    cam.lookAt(mouse.x * 1.2, camY - 1, 0);
    lamp.position.set(cam.position.x, camY + 3, 5);
    const bg = mix(SHALLOW, DEEP, Math.min(1, progress * 1.4));
    S.fog.color.setRGB(bg[0] / 255, bg[1] / 255, bg[2] / 255);

    plankton.rotation.y = t * .01; plankton.position.y = Math.sin(t * .2) * .4;

    jellies.forEach(g => {
      const u = g.userData;
      g.scale.y = (g.scale.x) * (1 + .14 * Math.sin(t * 2.2 + u.ph));
      // Né con trỏ chuột
      const mx = cam.position.x + mouse.x * 12, my = camY + mouse.y * 7;
      const dx = g.position.x - mx, dy = g.position.y - my, d = Math.hypot(dx, dy) || 1;
      const push = d < 6 ? (6 - d) * .4 : 0;
      g.position.x += ((u.bx + dx / d * push) - g.position.x) * .05 + Math.sin(t * .4 + u.ph) * .01;
      g.position.y += ((u.by + Math.sin(t * .7 + u.ph) * 1.4 + dy / d * push) - g.position.y) * .05;
      g.rotation.y = t * .2 + u.ph;
      u.tents.forEach(({ l, a }) => {
        const p = l.geometry.attributes.position;
        for (let j = 0; j < p.count; j++) {
          const w = Math.sin(t * 2.2 - j * .55 + a) * .12 * j / 4;
          p.setX(j, Math.cos(a) * .7 + w); p.setZ(j, Math.sin(a) * .7 + w * .6);
        }
        p.needsUpdate = true;
      });
    });

    weeds.forEach(m => {
      const p = m.geometry.attributes.position, b = m.userData.base, h = m.userData.h;
      for (let i = 0; i < p.count; i++) {
        const k = (b[i * 3 + 1] + h / 2) / h;
        p.setX(i, b[i * 3] + Math.sin(t * 1.3 + m.userData.ph + k * 3) * k * k * 1.1);
      }
      p.needsUpdate = true;
    });

    wreck.position.y = -DEPTH + 1 + Math.sin(t * .5) * .05;
    gl.intensity = 2.6 + Math.sin(t * 3) * .7;
    coins.forEach(c => { const u = c.userData; u.a += .01 * u.s; c.position.set(-5 + Math.cos(u.a) * u.r, -DEPTH + 1.3 + Math.abs(Math.sin(u.a * 1.5)) * 1.4, -5 + Math.sin(u.a) * u.r * .6); });

    const dt = Math.min(.05, t - pt); pt = t;
    fishes.forEach(f => {
      const u = f.userData; f.position.x += u.sp * dt;
      if (f.position.x > 36) f.position.x = -36; if (f.position.x < -36) f.position.x = 36;
      f.position.y = u.y + Math.sin(t * 1.5 + u.ph) * .4; u.tail.rotation.y = Math.sin(t * 9 + u.ph) * .55;
    });
    whale.position.x += 2.2 * dt; if (whale.position.x > 70) whale.position.x = -70;
    whale.position.y = -21 + Math.sin(t * .4) * 1.2; whale.rotation.z = Math.sin(t * .4) * .05; wt.rotation.z = Math.sin(t * 1.3) * .3;
    squid.position.x = -10 + Math.sin(t * .12) * 16; squid.position.y = -45 + Math.sin(t * .5) * 2; squid.rotation.z = Math.cos(t * .12) * .15;
    mantle.scale.set(1 + Math.sin(t * 2) * .08, 1, 1 + Math.sin(t * 2) * .08);
    arms.forEach(({ l, a }) => {
      const p = l.geometry.attributes.position;
      for (let j = 0; j < p.count; j++) { const w = Math.sin(t * 2 - j * .4 + a) * .25 * j / 6; p.setX(j, Math.cos(a) * .8 + w); p.setZ(j, Math.sin(a) * .8 + w * .6); }
      p.needsUpdate = true;
    });
    R.render(S, cam);
  })();
})();
