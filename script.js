const properties = [
  "Apartment", "Bank", "Castle", "Factory", "Field",
  "Land", "Office", "Plot", "Powerplant", "ShoppingMall",
  "Stadium", "Tower", "Villa", "Warehouse", "House"
];

let time = 60;
let score = 0;
let currentProperty = "";
let timer;
let playerName = "";

function startGame() {
  playerName = document.getElementById("player-name").value || "Player";
  document.getElementById("start-screen").classList.add("hidden");
  document.getElementById("game-container").classList.remove("hidden");
  score = 0;
  time = 60;
  document.getElementById("score").textContent = score;
  document.getElementById("time").textContent = time;
  document.getElementById("game-over").classList.add("hidden");
  nextRound();
  timer = setInterval(updateTimer, 1000);
}

function updateTimer() {
  time--;
  document.getElementById("time").textContent = time;
  if (time <= 0) {
    endGame();
  }
}

function nextRound() {
  currentProperty = properties[Math.floor(Math.random() * properties.length)];
  document.getElementById("property-name").textContent = currentProperty.toUpperCase();

  const cardOptions = document.getElementById("card-options");
  cardOptions.innerHTML = "";

  const options = [currentProperty];
  while (options.length < 3) {
    const random = properties[Math.floor(Math.random() * properties.length)];
    if (!options.includes(random)) {
      options.push(random);
    }
  }

  shuffleArray(options);

  options.forEach(option => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
      <img src="assets/property_icons/${option}.png" alt="${option}" />
      <div style="margin-top: 8px; font-weight: bold;">${option.toUpperCase()}</div>
    `;
    card.addEventListener("click", () => checkAnswer(option));
    cardOptions.appendChild(card);
  });
}

function checkAnswer(selected) {
  if (selected === currentProperty) {
    score += 20;
  } else {
    score -= 10;
  }
  document.getElementById("score").textContent = score;
  nextRound();
}

function endGame() {
  clearInterval(timer);
  document.getElementById("card-options").innerHTML = "";
  document.getElementById("final-score").textContent = score;
  document.getElementById("game-over").classList.remove("hidden");
}

function shareOnTwitter() {
  const tweet = `I scored ${score} $XNL in $XNL Token Rush 🚀\nPlay here: https://xnl-token-rush.vercel.app/\n@traderibo123 @Novastro_xyz`;
  const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweet)}`;
  window.open(url, "_blank");
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
