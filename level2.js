const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const scope = document.getElementById('scope');
const shootBtn = document.getElementById('shootBtn');

const winBird = document.getElementById('winBird');
const winTrophy = document.getElementById('winTrophy');
const winPutri = document.getElementById('winPutri');

// --- LOAD AUDIO FILE ---
const startSound = new Audio('../audio/game-start.mp3');
const winSound = new Audio('../audio/menang.mp3');
const bgm = new Audio('../audio/pixel.mp3');

bgm.loop = true;        // agar lagu latar mengulang terus
bgm.volume = 0.5;       // atur volume biar tidak terlalu keras


let scopeX = 100;
let scopeY = 150;

let birdsKilled = 0;

let bird = {
  x: 450,
  y: 100,
  width: 40,
  height: 40,
  speed: 1.5,
  alive: true,
};

let bullet = {
  x: null,
  y: null,
  active: false,
  speed: 4,
  width: 6,
  height: 3,
};

let gameOver = false;

function spawnNewBird() {
  bird = {
    x: 450,
    y: Math.random() * 200 + 40,
    width: 40,
    height: 40,
    speed: 1.5,
    alive: true,
  };
}

function updateBird() {
  if (bird.alive) {
    bird.x -= bird.speed;
    if (bird.x + bird.width < 0) {
      gameOver = true;
    }
  }
}

function shoot() {
  if (!bullet.active && bird.alive && !gameOver) {
    bullet.x = scopeX + 18;
    bullet.y = scopeY + 18;
    bullet.active = true;
  }
}

function updateBullet() {
  if (bullet.active) {
    bullet.x += bullet.speed;
    if (
      bullet.x < bird.x + bird.width &&
      bullet.x + bullet.width > bird.x &&
      bullet.y < bird.y + bird.height &&
      bullet.y + bullet.height > bird.y
    ) {
      bullet.active = false;
      bird.alive = false;
      birdsKilled++;

      if (birdsKilled >= 4) {
        showWin();
      } else {
        setTimeout(spawnNewBird, 500);
      }
    }

    if (bullet.x > canvas.width) {
      bullet.active = false;
    }
  }
}

function drawBird() {
  if (bird.alive) {
    const img = new Image();
    img.src = '../img/burung.png'; // pastikan file ini ada di folder img
    ctx.drawImage(img, bird.x, bird.y, bird.width, bird.height);
  }
}

function drawBullet() {
  if (bullet.active) {
    ctx.fillStyle = 'red';
    ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
  }
}

function showWin() {
  winSound.play(); // <--- Tambahkan ini
  winBird.style.display = 'block';
  winTrophy.style.display = 'block';
  winPutri.style.display = 'block';
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  updateBird();
  updateBullet();

  drawBird();
  drawBullet();

  scope.style.left = scopeX + 'px';
  scope.style.top = scopeY + 'px';

  if (gameOver) {
    ctx.fillStyle = 'red';
    ctx.font = '12px Press Start 2P';
    ctx.fillText('Game Over 💀', 120, 160);
  } else {
    requestAnimationFrame(gameLoop);
  }
}

function startGame() {
  startSound.play();
bgm.play();
bgm.currentTime = 0;
  birdsKilled = 0;
  spawnNewBird();
  bullet.active = false;
  bullet.x = null;
  bullet.y = null;
  winBird.style.display = 'none';
  winTrophy.style.display = 'none';
  winPutri.style.display = 'none';
  gameOver = false;

  scopeX = 100;
  scopeY = 150;
  scope.style.left = scopeX + 'px';
  scope.style.top = scopeY + 'px';

  gameLoop();
}

function restartGame() {
  startGame();
}

document.addEventListener('keydown', (e) => {
  const step = 10;
  switch (e.key.toLowerCase()) {
    case 'a': scopeX -= step; break;
    case 'd': scopeX += step; break;
    case 'w': scopeY -= step; break;
    case 's': scopeY += step; break;
    case 'f': shoot(); break;
  }

  scopeX = Math.max(0, Math.min(canvas.width - 40, scopeX));
  scopeY = Math.max(0, Math.min(canvas.height - 40, scopeY));
  scope.style.left = scopeX + 'px';
  scope.style.top = scopeY + 'px';
});

shootBtn.addEventListener('click', shoot);

// Joystick (touchscreen)
const joystickContainer = document.getElementById('joystick-container');
const joystick = document.getElementById('joystick');
let dragging = false;

joystick.addEventListener('touchstart', () => {
  dragging = true;
});
joystick.addEventListener('touchend', () => {
  dragging = false;
  joystick.style.transform = 'translate(-50%, -50%)';
});
joystick.addEventListener('touchmove', (e) => {
  if (!dragging) return;
  e.preventDefault();
  const touch = e.touches[0];
  const rect = joystickContainer.getBoundingClientRect();
  const x = touch.clientX - rect.left - 50;
  const y = touch.clientY - rect.top - 50;
  const distance = Math.min(Math.sqrt(x * x + y * y), 30);
  const angle = Math.atan2(y, x);
  const moveX = Math.cos(angle) * distance;
  const moveY = Math.sin(angle) * distance;
  joystick.style.transform = `translate(${moveX}px, ${moveY}px)`;
  scopeX += moveX * 0.1;
  scopeY += moveY * 0.1;
  scopeX = Math.max(0, Math.min(canvas.width - 40, scopeX));
  scopeY = Math.max(0, Math.min(canvas.height - 40, scopeY));
  scope.style.left = scopeX + 'px';
  scope.style.top = scopeY + 'px';
});

// Jalankan saat halaman dimuat
window.onload = () => {
  startGame();
};
