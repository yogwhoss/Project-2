// === FLAPPY LEVEL 1 - flappy1.js ===
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const pipeTopImg = new Image();
pipeTopImg.src = "../img/pipa.png";

const pipeBottomImg = new Image();
pipeBottomImg.src = "../img/pipa.png";

const birdImg = new Image();
birdImg.src = "../img/kecil.png";


let bird = {
  x: 80,
  y: 150,
  width: 40,
  height: 50,
  velocity: 0,
  gravity: 0.5,
  jumpForce: -8,
};

let pipes = [];
let pipeWidth = 40;
let pipeGap = 100;
let pipeInterval = 100;
let frameCount = 0;

let gameStarted = false;
let gameOver = false;
let gameWon = false;

function startGame() {
  gameStarted = true;
  gameOver = false;
  gameWon = false;
  frameCount = 0;
  pipes = [];
  bird.y = 150;
  bird.velocity = 0;

  // Kosongkan pesan game
  document.getElementById("gameOverMessage").innerHTML = "";

  // 🔻 Sembunyikan semua elemen animasi menang
  document.getElementById("nextLevelBtn").classList.add("hidden");
  document.getElementById("typewriterMessage").classList.add("hidden");
  document.getElementById("winTrophy").classList.add("hidden");
  document.getElementById("levelUp").classList.add("hidden");

  // 🔁 Mulai ulang animasi
  animate();
}


function jump() {
  if (!gameStarted || gameOver) return;
  bird.velocity = bird.jumpForce;
}

function restartGame() {
  startGame();
}

function createPipe() {
  let topHeight = Math.floor(Math.random() * 120) + 20;
  let bottomY = topHeight + pipeGap;
  pipes.push({ x: canvas.width, topHeight: topHeight, bottomY: bottomY });
}

function checkCollision(pipe) {
  if (
    bird.x + bird.width > pipe.x &&
    bird.x < pipe.x + pipeWidth &&
    (bird.y < pipe.topHeight || bird.y + bird.height > pipe.bottomY)
  ) {
    return true;
  }
  return false;
}

function showWinAnimation() {
  const trophy = document.getElementById("winTrophy");
  trophy.classList.remove("hidden");
  trophy.classList.add("win-animation");

  document.getElementById("gameOverMessage").innerHTML =
    "<div class='game-message'>Selamat! Level 1 Selesai 🎉</div>";

  setTimeout(() => {
    const queen = document.getElementById("levelUp");
    queen.classList.remove("hidden");
    queen.classList.add("level-up");

    setTimeout(() => {
      const msg = document.getElementById("typewriterMessage");
      msg.classList.remove("hidden");
    }, 2000);
  }, 2000);
}


function animate() {
  if (!gameStarted) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Bird
  bird.velocity += bird.gravity;
  bird.y += bird.velocity;
  ctx.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);


  // Pipes
  if (frameCount % pipeInterval === 0) {
    createPipe();
  }

  for (let i = 0; i < pipes.length; i++) {
    let pipe = pipes[i];
    pipe.x -= 2;

    // Top pipe
    // Gambar pipa atas
ctx.drawImage(pipeTopImg, pipe.x, pipe.topHeight - pipeTopImg.height, pipeWidth, pipeTopImg.height);

// Gambar pipa bawah
ctx.drawImage(pipeBottomImg, pipe.x, pipe.bottomY, pipeWidth, pipeBottomImg.height);

    if (checkCollision(pipe)) {
      gameOver = true;
    }
  }

  // Game over check
  if (gameOver || bird.y < 0 || bird.y + bird.height > canvas.height) {
    gameOver = true;
    document.getElementById("gameOverMessage").innerHTML =
      "<div class='game-message' style='color:red;'>Game Over 💀</div>";
    return;
  }

  // Win condition
  if (frameCount > 1000 && !gameWon && !gameOver) {
  gameWon = true;
  showWinAnimation();
  return;
}


  frameCount++;
  requestAnimationFrame(animate);
}

document.addEventListener("keydown", function (e) {
  if (e.code === "Space") {
    jump();
  }
});

function goToLevel2() {
  window.location.href = "level2.html"; // atau path sesuai file Level 2 nanti
}


