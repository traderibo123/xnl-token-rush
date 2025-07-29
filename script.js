
const properties = [
  "Apartment", "Bank", "Castle", "Factory", "Field", "House", "Land",
  "Office", "Plot", "Powerplant", "ShoppingMall", "Stadium",
  "Tower", "Villa", "Warehouse"
];

let score = 0;
let timeLeft = 60;
let timerInterval;
let currentProperty = "";
let nickname = "";

function startGame() {
  nickname = document.getElementById("nickname-input").value;
  if (!nickname) return alert("Please enter a nickname");

  document.getElementById("start-screen").classList.add("hidden");
  document.getElementById("game").classList.remove("hidden");
  document.getElementById("nickname-label").textContent = nickname;

  score = 0;
  timeLeft = 60;
  document.getElementById("score").textContent = score;
  document.getElementById("timer").textContent = timeLeft;
  nextRound();

  timerInterval = setInterval(() => {
    timeLeft--;
    document.getElementById("timer").textContent = timeLeft;
    if (timeLeft <= 0) endGame();
  }, 1000);
}

function nextRound() {
  const randomIndex = Math.floor(Math.random() * properties.length);
  currentProperty = properties[randomIndex];
  document.getElementById("speech-text").textContent = `Tokenize this for me: ${currentProperty}`;

  const optionsContainer = document.getElementById("options");
  optionsContainer.innerHTML = "";

  const correctIndex = Math.floor(Math.random() * 3);
  const used = new Set([currentProperty]);

  for (let i = 0; i < 3; i++) {
    let prop = currentProperty;
    if (i !== correctIndex) {
      do {
        prop = properties[Math.floor(Math.random() * properties.length)];
      } while (used.has(prop));
      used.add(prop);
    }

    const img = document.createElement("img");
    const fileName = prop.replace(/\s+/g, '');
    img.src = `assets/property_icons/${fileName}.png`;
    img.alt = prop;
    img.onclick = () => handleAnswer(prop === currentProperty);
    optionsContainer.appendChild(img);
  }
}

function handleAnswer(correct) {
  const float = document.createElement("div");
  float.className = "score-float";
  float.textContent = correct ? "+1 XNL" : "-1 XNL";
  document.body.appendChild(float);

  setTimeout(() => float.remove(), 1000);

  score += correct ? 1 : -1;
  document.getElementById("score").textContent = score;
  nextRound();
}

function endGame() {
  clearInterval(timerInterval);
  document.getElementById("game").classList.add("hidden");
  document.getElementById("game-over").classList.remove("hidden");
  document.getElementById("final-score").textContent = score;
}

function shareOnX() {
  const url = "https://x.com/intent/tweet?text=" +
    encodeURIComponent(`I scored ${score} XNL in the XNL Token Rush by @Novastro_xyz! 🚀
Created by @traderibo123
Play now!`);
  window.open(url, "_blank");
}
