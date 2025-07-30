const dino = document.getElementById("dino");
const cactus = document.getElementById("cactus");
const scoreText = document.getElementById("score");
const gameOverText = document.getElementById("gameOver");

const jumpSound = document.getElementById("jumpSound");
const gameOverSound = document.getElementById("gameOverSound");
const startSound = document.getElementById("startSound"); // Tambahkan
const startBtn = document.getElementById("startBtn");     // Tambahkan

startBtn.addEventListener("click", () => {
  startSound.play(); // hanya akan berjalan jika diklik user
});

let score = 0;
let isGameOver = false;

function jump() {
  if (!dino.classList.contains("jump")) {
    dino.classList.add("jump");

    // Play jump sound
    jumpSound.currentTime = 0;
    jumpSound.play();

    setTimeout(() => {
      dino.classList.remove("jump");
    }, 500);
  }
}

document.addEventListener("keydown", function (e) {
  if (e.code === "Space") jump();
});

setInterval(() => {
  const dinoBottom = parseInt(window.getComputedStyle(dino).getPropertyValue("bottom"));
  const cactusLeft = parseInt(window.getComputedStyle(cactus).getPropertyValue("left"));

  if (
    cactusLeft > 50 &&
    cactusLeft < 90 &&
    dinoBottom <= 40 &&
    !isGameOver
  ) {
    cactus.style.animation = "none";
    cactus.style.left = cactusLeft + "px";
    gameOverText.style.display = "block";
    isGameOver = true;

    // Play game over sound
    gameOverSound.currentTime = 0;
    gameOverSound.play();
  }

  if (!isGameOver && cactusLeft < 45) {
    score++;
    scoreText.textContent = "Koin: " + score;
  }
}, 10);
