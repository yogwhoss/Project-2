const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const scope = document.getElementById('scope');
const shootBtn = document.getElementById('shootBtn');

const winBird = document.getElementById('winBird');
const winTrophy = document.getElementById('winTrophy');
const winPutri = document.getElementById('winPutri');

let scopeX = 0;
let scopeY = 150;
let scopeSpeed = 2;

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
  width: 4,
  height: 2,
};

let gameOver = false;

// Gerak scope horizontal otomatis
function updateScope() {
  scopeX += scopeSpeed;
  if (scopeX <= 0 || scopeX + 40 >= canvas.width) {
    scopeSpeed *= -1;
  }
  scope.style.left = scopeX + 'px';
  scope.style.top = scopeY + 'px';
}

// Gerak burung
function updateBird() {
  if (bird.alive) {
    bird.x -= bird.speed;
    if (bird.x + bird.width < 0) {
      gameOver = true;
    }
  }
}

// Tembakan
function shoot() {
  if (!bullet.active && bird.alive && !gameOver) {
    bullet.x = scopeX + 18;
    bullet.y = scopeY + 18;
    bullet.active = true;
  }
}

// Update peluru
function updateBullet() {
  if (bullet.active) {
    bullet.x += bullet.speed;
    // Deteksi kena burung
    if (
      bullet.x < bird.x + bird.width &&
      bullet.x + bullet.width > bird.x &&
      bullet.y < bird.y + bird.height &&
      bullet.y + bullet.height > bird.y
    ) {
      bullet.active = false;
      bird.alive = false;
      showWin();
    }
    // Jika peluru lewat layar
    if (bullet.x > canvas.width) {
      bullet.active = false;
    }
  }
}

// Gambar burung
function drawBird() {
  if (bird.alive) {
    const img = new Image();
    img.src = 'burung.png';
    ctx.drawImage(img, bird.x, bird.y, bird.width, bird.height);
  }
}

// Gambar peluru
function drawBullet() {
  if (bullet.active) {
    ctx.fillStyle = 'red';
    ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
  }
}

// Menampilkan animasi menang
function showWin() {
  winBird.style.display = 'block';
  winTrophy.style.display = 'block';
  winPutri.style.display = 'block';
}

// Loop utama
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  updateScope();
  updateBird();
  updateBullet();

  drawBird();
  drawBullet();

  if (!gameOver) {
    requestAnimationFrame(gameLoop);
  }
}

// Mulai game
gameLoop();

// Kontrol keyboard (tombol F)
document.addEventListener('keydown', (e) => {
  if (e.key === 'f' || e.key === 'F') {
    shoot();
  }
});

// Tombol tembak di layar
shootBtn.addEventListener('click', shoot);
