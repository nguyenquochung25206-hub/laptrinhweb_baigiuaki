/* ADVANCED 3D SPACE WORLD & REAL 3D JET SHOOTER GAME (V5.0 WITH LIVES & DYNAMIC DIFFICULTY) */

document.addEventListener('DOMContentLoaded', () => {
  initSpaceBackground3D();
  initCustomCursor();
  initTypingEffect();
  initJetShooterGame3DV5();
  initProjectFilters();
  initScrollHandlers();
});

/* ----------------------------------------------------
   1. THREE.JS 3D SPACE BACKGROUND
---------------------------------------------------- */
function initSpaceBackground3D() {
  const canvas = document.getElementById('webgl-canvas');
  if (!canvas) return;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x030014, 0.001);

  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
  camera.position.z = 600;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Particles Matrix
  const count = 3500;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);

  const palette = [
    new THREE.Color('#00ffcc'),
    new THREE.Color('#ff007f'),
    new THREE.Color('#9d4edd'),
    new THREE.Color('#ffea00')
  ];

  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 1800;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 1800;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 1800;

    const c = palette[Math.floor(Math.random() * palette.length)];
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 4.5,
    vertexColors: true,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending
  });

  const particleSystem = new THREE.Points(geometry, material);
  scene.add(particleSystem);

  // 3D Tunnel Wireframe Grid
  const tunnelGeo = new THREE.CylinderGeometry(300, 300, 2000, 24, 40, true);
  const tunnelMat = new THREE.MeshBasicMaterial({
    color: 0x00ffcc,
    wireframe: true,
    transparent: true,
    opacity: 0.06
  });
  const tunnelMesh = new THREE.Mesh(tunnelGeo, tunnelMat);
  tunnelMesh.rotation.x = Math.PI / 2;
  scene.add(tunnelMesh);

  let mouseX = 0, mouseY = 0;
  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX - window.innerWidth / 2) * 0.08;
    mouseY = (e.clientY - window.innerHeight / 2) * 0.08;
  });

  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    particleSystem.rotation.y = elapsedTime * 0.02;
    tunnelMesh.rotation.z = elapsedTime * 0.05;
    tunnelMesh.position.z = (elapsedTime * 100) % 500 - 250;

    camera.position.x += (mouseX - camera.position.x) * 0.05;
    camera.position.y += (-mouseY - camera.position.y) * 0.05;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
  }

  animate();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

/* ----------------------------------------------------
   2. CUSTOM NEON CURSOR
---------------------------------------------------- */
function initCustomCursor() {
  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');

  if (!dot || !ring) return;

  document.addEventListener('mousemove', (e) => {
    dot.style.left = `${e.clientX}px`;
    dot.style.top = `${e.clientY}px`;

    ring.animate({
      left: `${e.clientX}px`,
      top: `${e.clientY}px`
    }, { duration: 200, fill: 'forwards' });
  });
}

/* ----------------------------------------------------
   3. TYPING EFFECT
---------------------------------------------------- */
function initTypingEffect() {
  const target = document.getElementById('typing-text');
  if (!target) return;

  const phrases = [
    "Full-stack Developer Target",
    "AI / Machine Learning Engineer Student",
    "Sinh Viên Ngành CNTT @ UTH (HCM)"
  ];

  let pIdx = 0, cIdx = 0, isDeleting = false;

  function type() {
    const current = phrases[pIdx];
    target.textContent = isDeleting ? current.substring(0, cIdx - 1) : current.substring(0, cIdx + 1);
    cIdx += isDeleting ? -1 : 1;

    let delay = isDeleting ? 40 : 80;

    if (!isDeleting && cIdx === current.length) {
      delay = 2000;
      isDeleting = true;
    } else if (isDeleting && cIdx === 0) {
      isDeleting = false;
      pIdx = (pIdx + 1) % phrases.length;
      delay = 500;
    }

    setTimeout(type, delay);
  }

  type();
}

/* ----------------------------------------------------
   4. 3D JET SHOOTER GAME V5.0 (3 LIVES, DYNAMIC DIFFICULTY & COLLISION)
---------------------------------------------------- */
let isGameRunning = false;
let gameScore = 0;
let gameLives = 3;
let gameLevel = 1;
let enemySpeed = 2.0;
let spawnIntervalTime = 550;
let isInvulnerable = false;
let spawnTimer = null;

function updateLivesUI() {
  const box = document.getElementById('gameLives');
  if (!box) return;

  let html = '';
  for (let i = 0; i < 3; i++) {
    if (i < gameLives) {
      html += '<i class="fa-solid fa-heart heart-active"></i>';
    } else {
      html += '<i class="fa-solid fa-heart heart-lost"></i>';
    }
  }
  box.innerHTML = html;
}

function updateDifficulty() {
  // Increase Level every 100 points
  const calculatedLevel = Math.floor(gameScore / 100) + 1;

  if (calculatedLevel !== gameLevel) {
    gameLevel = calculatedLevel;
    enemySpeed = 2.0 + (gameLevel - 1) * 0.6; // Speed up enemies
    document.getElementById('gameLevel').textContent = `LEVEL ${gameLevel}`;
  }
}

function toggleStartGame() {
  const overlay = document.getElementById('gameOverlay');
  const btn = document.getElementById('startGameBtn');
  const title = document.getElementById('overlayTitle');
  const desc = document.getElementById('overlayDesc');

  if (!isGameRunning) {
    // Reset Game State if lost all lives
    if (gameLives <= 0) {
      gameScore = 0;
      gameLives = 3;
      gameLevel = 1;
      enemySpeed = 2.0;
      document.getElementById('gameScore').textContent = '0';
      document.getElementById('gameScoreHud').textContent = '0 PTS';
      document.getElementById('gameLevel').textContent = 'LEVEL 1';
      updateLivesUI();
    }

    isGameRunning = true;
    if (overlay) overlay.classList.add('hidden');
    if (btn) btn.innerHTML = '<i class="fa-solid fa-pause"></i> TẠM DỪNG';
  } else {
    isGameRunning = false;
    if (title) title.innerHTML = '<i class="fa-solid fa-pause"></i> GAME ĐÃ TẠM DỪNG';
    if (desc) desc.innerHTML = 'Nhấn nút bên dưới để tiếp tục trận chiến giữ nguyên điểm số &amp; số mạng hiện tại!';
    if (overlay) overlay.classList.remove('hidden');
    if (btn) btn.innerHTML = '<i class="fa-solid fa-play"></i> TIẾP TỤC BẮN';
  }
}

function gameOver() {
  isGameRunning = false;
  const overlay = document.getElementById('gameOverlay');
  const btn = document.getElementById('startGameBtn');
  const title = document.getElementById('overlayTitle');
  const desc = document.getElementById('overlayDesc');

  if (title) title.innerHTML = '<i class="fa-solid fa-skull-crossbones neon-pink"></i> GAME OVER!';
  if (desc) desc.innerHTML = `Phi thuyền của bạn đã bị tiêu diệt!<br><strong>TỔNG ĐIỂM ĐẠT ĐƯỢC:</strong> <span class="neon-text-cyan" style="font-size: 1.3rem;">${gameScore} PTS</span> (Đạt LEVEL ${gameLevel})`;
  if (overlay) overlay.classList.remove('hidden');
  if (btn) btn.innerHTML = '<i class="fa-solid fa-rotate-right"></i> CHƠI LẠI TỪ ĐẦU';
}

function initJetShooterGame3DV5() {
  const wrapper = document.getElementById('gameCanvasWrapper');
  const canvas = document.getElementById('game-canvas');
  if (!wrapper || !canvas) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, wrapper.clientWidth / wrapper.clientHeight, 0.1, 1000);
  camera.position.set(0, -120, 220);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(wrapper.clientWidth, wrapper.clientHeight);

  // --- 3D JET FIGHTER PLAYER MODEL ---
  const playerGroup = new THREE.Group();

  // Jet Nose/Body
  const bodyGeo = new THREE.ConeGeometry(8, 28, 5);
  const bodyMat = new THREE.MeshBasicMaterial({ color: 0x00ffcc, wireframe: true });
  const jetBody = new THREE.Mesh(bodyGeo, bodyMat);
  jetBody.rotation.x = Math.PI / 2;
  playerGroup.add(jetBody);

  // Jet Wings
  const wingGeo = new THREE.BoxGeometry(38, 2, 8);
  const wingMat = new THREE.MeshBasicMaterial({ color: 0xff007f });
  const jetWings = new THREE.Mesh(wingGeo, wingMat);
  jetWings.position.z = -2;
  playerGroup.add(jetWings);

  // Cockpit Glow Core
  const coreGeo = new THREE.SphereGeometry(4, 16, 16);
  const coreMat = new THREE.MeshBasicMaterial({ color: 0xffea00 });
  const jetCore = new THREE.Mesh(coreGeo, coreMat);
  jetCore.position.z = 4;
  playerGroup.add(jetCore);

  playerGroup.position.set(0, -100, 0);
  scene.add(playerGroup);

  // Game Arrays
  const bullets = [];
  const enemies = [];

  // Spawn Player Laser Bullets
  function spawnLaser() {
    if (!isGameRunning) return;
    const laserGeo = new THREE.CylinderGeometry(1, 1, 14, 8);
    const laserMat = new THREE.MeshBasicMaterial({ color: 0x00ffcc });
    const laser = new THREE.Mesh(laserGeo, laserMat);

    laser.position.set(playerGroup.position.x, playerGroup.position.y + 15, playerGroup.position.z);
    scene.add(laser);
    bullets.push(laser);
  }

  setInterval(spawnLaser, 180);

  // Spawn Enemy Vessels / Asteroids
  function spawnEnemy() {
    if (!isGameRunning) return;

    const isMeteor = Math.random() > 0.4;
    let enemyMesh;

    if (isMeteor) {
      const geo = new THREE.DodecahedronGeometry(13, 1);
      const mat = new THREE.MeshBasicMaterial({ color: 0xff007f, wireframe: true });
      enemyMesh = new THREE.Mesh(geo, mat);
    } else {
      const geo = new THREE.OctahedronGeometry(15, 0);
      const mat = new THREE.MeshBasicMaterial({ color: 0x9d4edd, wireframe: true });
      enemyMesh = new THREE.Mesh(geo, mat);
    }

    enemyMesh.position.set((Math.random() - 0.5) * 320, 170, 0);
    scene.add(enemyMesh);
    enemies.push(enemyMesh);
  }

  setInterval(spawnEnemy, 450);

  // Mouse Control Fighter Jet
  wrapper.addEventListener('mousemove', (e) => {
    const rect = wrapper.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / wrapper.clientWidth) * 2 - 1;
    const y = -((e.clientY - rect.top) / wrapper.clientHeight) * 2 + 1;

    playerGroup.position.x = x * 180;
    playerGroup.position.y = Math.max(-130, Math.min(100, y * 120));
    playerGroup.rotation.z = -x * 0.5; // Banking Roll
  });

  // Handle Player Damage
  function triggerPlayerHit() {
    if (isInvulnerable) return;

    gameLives -= 1;
    updateLivesUI();

    if (gameLives <= 0) {
      gameOver();
    } else {
      // Temporary Invulnerability & Flash Effect
      isInvulnerable = true;
      let flashes = 0;
      const flashInterval = setInterval(() => {
        playerGroup.visible = !playerGroup.visible;
        flashes++;
        if (flashes >= 10) {
          clearInterval(flashInterval);
          playerGroup.visible = true;
          isInvulnerable = false;
        }
      }, 150);
    }
  }

  function gameLoop() {
    requestAnimationFrame(gameLoop);

    if (isGameRunning) {
      // 1. Move Player Lasers
      for (let i = bullets.length - 1; i >= 0; i--) {
        const bullet = bullets[i];
        bullet.position.y += 13;

        if (bullet.position.y > 210) {
          scene.remove(bullet);
          bullets.splice(i, 1);
        }
      }

      // 2. Move Enemies, Check Collisions
      for (let j = enemies.length - 1; j >= 0; j--) {
        const enemy = enemies[j];
        enemy.position.y -= enemySpeed;
        enemy.rotation.x += 0.03;
        enemy.rotation.y += 0.03;

        // --- A. Bullet vs Enemy Collision ---
        for (let i = bullets.length - 1; i >= 0; i--) {
          const bullet = bullets[i];
          const dist = bullet.position.distanceTo(enemy.position);

          if (dist < 20) {
            scene.remove(bullet);
            bullets.splice(i, 1);
            scene.remove(enemy);
            enemies.splice(j, 1);

            gameScore += 20;
            document.getElementById('gameScore').textContent = gameScore;
            document.getElementById('gameScoreHud').textContent = `${gameScore} PTS`;
            updateDifficulty();
            break;
          }
        }

        // --- B. Enemy vs Player Jet Collision (Loses 1 Life) ---
        if (enemy) {
          const playerDist = enemy.position.distanceTo(playerGroup.position);
          if (playerDist < 25) {
            scene.remove(enemy);
            enemies.splice(j, 1);
            triggerPlayerHit();
            continue;
          }
        }

        // --- C. Enemy Escapes Screen Bottom ---
        if (enemy && enemy.position.y < -165) {
          scene.remove(enemy);
          enemies.splice(j, 1);
        }
      }
    }

    renderer.render(scene, camera);
  }

  gameLoop();
}

/* ----------------------------------------------------
   5. PROJECT FILTERS & MODAL
---------------------------------------------------- */
function initProjectFilters() {
  const btns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.project-card');

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      cards.forEach(card => {
        if (filter === 'all' || card.getAttribute('data-category') === filter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

const modalData = {
  caro: {
    title: "Game Caro Trực Tuyến 1v1",
    status: "Đã Hoàn Thành",
    tech: "HTML5, CSS3, JavaScript, WebSockets",
    desc: "Hệ thống game Caro đối kháng trực tuyến 2 người chơi sử dụng WebSocket. Tự động kiểm tra chuỗi 5 quân không bị chặn 2 đầu để xác định thắng cuộc và đếm ngược thời gian nước đi."
  },
  secondhand: {
    title: "Website Mua Bán Đồ Cũ UTH",
    status: "Đang Hoàn Thiện",
    tech: "C#, ASP.NET, MySQL, CSS Grid",
    desc: "Sàn thương mại điện tử mua bán vật dụng cũ dành riêng cho sinh viên trường Đại học Giao Thông Vận Tải TP.HCM. Tích hợp quản lý giỏ hàng, đăng tin và trao đổi trực tiếp."
  },
  isic: {
    title: "ISIC Skin Lesion Detection (AI/ML)",
    status: "Đã Hoàn Thành",
    tech: "Python, OpenCV, PyTorch, Deep Learning",
    desc: "Ứng dụng trí tuệ nhân tạo và xử lý ảnh y tế khoanh vùng tổn thương da trên tập dữ liệu quốc tế ISIC, giúp hỗ trợ chuẩn đoán y khoa chính xác."
  }
};

function openModal(key) {
  const modal = document.getElementById('projectModal');
  const body = document.getElementById('modalBody');
  const data = modalData[key];

  if (modal && body && data) {
    body.innerHTML = `
      <h2 style="font-family: var(--font-space); color: var(--neon-cyan); margin-bottom: 0.5rem;">${data.title}</h2>
      <span style="color: var(--neon-pink); font-weight: 700; display: block; margin-bottom: 1rem;">TRẠNG THÁI: ${data.status}</span>
      <p style="color: var(--text-sub); margin-bottom: 1rem;"><strong>CÔNG NGHỆ:</strong> ${data.tech}</p>
      <p style="color: var(--text-main); line-height: 1.6;">${data.desc}</p>
    `;
    modal.classList.add('active');
  }
}

function closeModal() {
  const modal = document.getElementById('projectModal');
  if (modal) modal.classList.remove('active');
}

/* ----------------------------------------------------
   6. SCROLL HANDLERS & FORM VALIDATION
---------------------------------------------------- */
function initScrollHandlers() {
  const navbar = document.getElementById('navbar');
  const scrollTopBtn = document.getElementById('scrollTopBtn');
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
      navbar.classList.add('scrolled');
      scrollTopBtn.classList.add('visible');
    } else {
      navbar.classList.remove('scrolled');
      scrollTopBtn.classList.remove('visible');
    }
  });

  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });
  }
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function handleFormSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('name').value;
  alert(`Cảm ơn ${name}! Lời nhắn của bạn đã được gửi thành công đến Nguyễn Quốc Hưng.`);
  document.getElementById('contactForm').reset();
}
