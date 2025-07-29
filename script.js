
const properties = [
  "Field", "Plot", "Apartment", "Warehouse", "Hotel",
  "Office Building", "Shop", "Power Plant", "Marina", "Investment Plot",
  "Mountain House", "Gas Station", "Industrial Parcel", "Logistics Center",
  "Shopping Mall", "Housing Project", "Dormitory", "Free Zone Land"
];

let score = 0;
let timeLeft = 60;
let currentAnswer = "";

function startGame() {
  updateTimer();
  setInterval(() => {
    timeLeft--;
    document.getElementById("timer").innerText = timeLeft;
    if (timeLeft <= 0) {
      endGame();
    }
  }, 1000);
  generateRound();
}

function generateRound() {
  const correct = properties[Math.floor(Math.random() * properties.length)];
  currentAnswer = correct;
  document.getElementById("target-property").innerText = correct.toUpperCase();

  const options = [correct];
  while (options.length < 3) {
    const option = properties[Math.floor(Math.random() * properties.length)];
    if (!options.includes(option)) options.push(option);
  }

  options.sort(() => 0.5 - Math.random());

  const container = document.getElementById("options-container");
  container.innerHTML = "";
  options.forEach(opt => {
    const btn = document.createElement("button");
    btn.innerText = opt;
    btn.onclick = () => checkAnswer(opt);
    container.appendChild(btn);
  });
}

function checkAnswer(answer) {
  if (answer === currentAnswer) {
    score += 10;
  } else {
    score -= 5;
  }
  document.getElementById("score").innerText = score + " XNL";
  generateRound();
}

function endGame() {
  document.getElementById("options-container").innerHTML = "";
  document.getElementById("game-over").classList.remove("hidden");
  document.getElementById("final-score").innerText = score + " XNL";
}

function shareOnTwitter() {
  const text = `Kurbağayla ${score} XNL'lik mülkü tokenize ettim! @Novastro_xyz @traderibo123 🐸🏠 #Novastro`;
  const url = "https://twitter.com/intent/tweet?text=" + encodeURIComponent(text);
  window.open(url, "_blank");
}

window.onload = startGame;
