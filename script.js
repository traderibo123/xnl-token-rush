const startScreen = document.getElementById("startScreen");
const nicknameInput = document.getElementById("nicknameInput");
const startButton = document.getElementById("startButton");
const gameContainer = document.getElementById("gameContainer");
const propertyName = document.getElementById("property-name");

const allProperties = ["Plot", "Tower", "Warehouse"];
let score = 0;
let time = 60;
let timerInterval;

// GİRİŞİ YÖNET
startButton.addEventListener("click", () => {
  const nickname = nicknameInput.value.trim();
  if (nickname !== "") {
    startScreen.style.display = "none";
    gameContainer.classList.remove("hidden");
    startGame();
  } else {
    alert("Please enter your nickname!");
  }
});

// OYUNU BAŞLAT
function startGame() {
  score = 0;
  updateScore(0);
  updateTimer(time);
  setRandomProperty();
  startTimer();
}

// TIMER
function startTimer() {
  timerInterval = setInterval(() => {
    time--;
    updateTimer(time);
    if (time <= 0) {
      clearInterval(timerInterval);
      endGame();
    }
  }, 1000);
}

// PROPERTY
function setRandomProperty() {
  const random = allProperties[Math.floor(Math.random() * allProperties.length)];
  propertyName.textContent = random.toUpperCase();
}

// PUAN GÜNCELLE
function updateScore(val) {
  score = val;
  document.getElementById("score").textContent = `${score} $XNL`;
}

function updateTimer(t) {
  document.getElementById("timer").textContent = `${t}s`;
}

function endGame() {
  alert(`Well done, Novastars! You scored ${score} $XNL`);
}
