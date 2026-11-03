/* Game: Cá lớn nuốt cá bé – di chuột / chạm / phím mũi tên hoặc WASD */
(function () {
  const cv = document.getElementById('gameCanvas');
  if (!cv) return;
  const ctx = cv.getContext('2d'), W = cv.width, H = cv.height;
  const $g = id => document.getElementById(id);
  const WIN_R = 60, COLORS = ['#00ffd5', '#ff2bd6', '#ffe600', '#39ff14', '#00b3ff', '#ff6a00', '#b57bff'];
  let state = 'idle', fishes = [], P, score, lives, inv, spawnT, last = 0;
  const target = { x: W / 2, y: H / 2 }, keys = {};
  const bubbles = Array.from({ length: 30 }, () => ({ x: Math.random() * W, y: Math.random() * H, r: 1 + Math.random() * 4, s: 15 + Math.random() * 30 }));

  function reset() {
    P = { x: W / 2, y: H / 2, r: 14, dir: 1 };
    fishes = []; score = 0; lives = 3; inv = 0; spawnT = 0;
    target.x = P.x; target.y = P.y; hud();
  }
  function hud() {
    $g('gScore').textContent = score;
    $g('gSize').textContent = Math.min(100, Math.round(P.r / WIN_R * 100));
    $g('gLives').textContent = '❤'.repeat(lives) + '♡'.repeat(3 - lives);
  }
  function spawn() {
    const small = Math.random() < .62, dir = Math.random() < .5 ? 1 : -1;
    const r = Math.max(7, Math.min(110, small ? P.r * (.35 + Math.random() * .55) : P.r * (1.15 + Math.random() * .9)));
    fishes.push({ x: dir > 0 ? -r * 2 : W + r * 2, y: r + Math.random() * (H - 2 * r), r, dir,
      sp: (45 + Math.random() * 70) * (1 + P.r / 90), c: COLORS[Math.random() * COLORS.length | 0], ph: Math.random() * 6 });
  }
  function drawFish(x, y, r, dir, c, t, ph, danger) {
    ctx.save(); ctx.translate(x, y); ctx.scale(dir, 1);
    ctx.shadowColor = c; ctx.shadowBlur = 16; ctx.fillStyle = c;
    const w = Math.sin(t * 9 + ph) * r * .35;
    ctx.beginPath(); ctx.ellipse(0, 0, r * 1.4, r * .8, 0, 0, 7); ctx.fill();
    ctx.beginPath(); ctx.moveTo(-r * 1.2, 0); ctx.lineTo(-r * 2.2, -r * .8 + w); ctx.lineTo(-r * 2.2, r * .8 + w); ctx.closePath(); ctx.fill();
    ctx.shadowBlur = 0; ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(r * .7, -r * .2, r * .26, 0, 7); ctx.fill();
    ctx.fillStyle = '#012'; ctx.beginPath(); ctx.arc(r * .78, -r * .2, r * .12, 0, 7); ctx.fill();
    if (danger) { ctx.strokeStyle = 'rgba(255,60,90,.9)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(0, 0, r * 1.55, r * .95, 0, 0, 7); ctx.stroke(); }
    ctx.restore();
  }
  function end(win) {
    state = 'idle'; cv.parentElement.classList.remove('playing');
    $g('gTitle').textContent = win ? '🐋 Bạn đã trở thành cá voi!' : 'Bạn bị cá lớn nuốt mất!';
    $g('gText').textContent = `Điểm của bạn: ${score}. ${win ? 'Never stop growing!' : 'Đừng bỏ cuộc – thử lại nhé!'}`;
    $g('gStart').textContent = 'Chơi lại'; $g('gOverlay').classList.remove('hidden');
  }
  function update(dt, t) {
    if (!Object.keys(keys).some(k => keys[k])) { /* theo chuột */ }
    else {
      target.x = P.x + ((keys.ArrowRight || keys.d) ? 1 : 0) * 200 - ((keys.ArrowLeft || keys.a) ? 1 : 0) * 200;
      target.y = P.y + ((keys.ArrowDown || keys.s) ? 1 : 0) * 200 - ((keys.ArrowUp || keys.w) ? 1 : 0) * 200;
    }
    const dx = target.x - P.x; if (Math.abs(dx) > 4) P.dir = dx > 0 ? 1 : -1;
    P.x += dx * Math.min(1, dt * 5); P.y += (target.y - P.y) * Math.min(1, dt * 5);
    inv = Math.max(0, inv - dt); spawnT -= dt;
    if (spawnT <= 0 && fishes.length < 16) { spawn(); spawnT = .55; }
    bubbles.forEach(b => { b.y -= b.s * dt; if (b.y < -5) { b.y = H + 5; b.x = Math.random() * W; } });
    fishes = fishes.filter(f => {
      f.x += f.dir * f.sp * dt;
      if (f.x < -f.r * 4 || f.x > W + f.r * 4) return false;
      if (Math.hypot(f.x - P.x, f.y - P.y) < (f.r + P.r) * .9) {
        if (P.r > f.r) { score += Math.round(f.r); P.r = Math.sqrt(P.r * P.r + f.r * f.r * .6); hud(); if (P.r >= WIN_R) end(true); return false; }
        if (!inv) { lives--; inv = 1.6; P.r = Math.max(10, P.r * .93); hud(); if (lives <= 0) end(false); return false; }
      }
      return true;
    });
  }
  function draw(t) {
    const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#0a7bd8'); g.addColorStop(1, '#1b0a5c');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = 'rgba(255,255,255,.35)'; bubbles.forEach(b => { ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, 7); ctx.fill(); });
    fishes.forEach(f => drawFish(f.x, f.y, f.r, f.dir, f.c, t, f.ph, f.r >= P.r));
    if (state === 'play' && Math.floor(inv * 10) % 2 === 0 || state !== 'play') drawFish(P.x, P.y, P.r, P.dir, '#ffd45a', t, 0, false);
  }
  function loop(ts) {
    const t = ts / 1000, dt = Math.min(.05, t - last); last = t;
    if (state === 'play') update(dt, t);
    draw(t);
    if (state === 'play') requestAnimationFrame(loop);
  }
  $g('gStart').onclick = () => {
    reset(); state = 'play'; $g('gOverlay').classList.add('hidden'); cv.parentElement.classList.add('playing');
    last = performance.now() / 1000; requestAnimationFrame(loop);
  };
  function point(e) {
    const b = cv.getBoundingClientRect(), p = e.touches ? e.touches[0] : e;
    target.x = (p.clientX - b.left) / b.width * W; target.y = (p.clientY - b.top) / b.height * H;
    Object.keys(keys).forEach(k => keys[k] = false);
  }
  cv.addEventListener('pointermove', point);
  cv.addEventListener('touchmove', point, { passive: true });
  addEventListener('keydown', e => { if (state === 'play' && /^(Arrow|w|a|s|d)/.test(e.key)) { keys[e.key] = true; e.preventDefault(); } });
  addEventListener('keyup', e => { keys[e.key] = false; });
  reset(); draw(0);
})();
