const properties = [
  "Apartment", "Bank", "Castle", "Factory", "Field",
  "Land", "Office", "Plot", "Power Plant", "ShoppingMall",
  "Stadium", "Tower", "Villa", "Warehouse", "House"
];

let score = 0;
let timeLeft = 60;
let timerInterval;
let currentTarget = "";
let nickname = "";

function startGame() {
  nickname = document.getElementById("nickname-input").value.trim();
  if (!nickname) {
    alert("Please enter your nickname.");
    return;
  }

  document.getElementById("start-screen").classList.add("hidden");
  document.getElementById("game").classList.remove("hidden");
  document.getElementById("game-over").classList.add("hidden");

  score = 0;
  timeLeft = 60;
  document.getElementById("score").innerText = score;
  document.getElementById("timer").innerText = timeLeft;

  startTimer();
  generateRound();
}

function startTimer() {
  timerInterval = setInterval(() => {
    timeLeft--;
    document.getElementById("timer").innerText = timeLeft;
    if (timeLeft <= 0) {
      endGame();
    }
  }, 1000);
}

function generateRound() {
  currentTarget = getRandomProperty();
  document.getElementById("target-property").innerText = currentTarget.toUpperCase();

  const options = generateOptions(currentTarget);
  const optionsContainer = document.getElementById("options");
  optionsContainer.innerHTML = "";

  options.forEach(option => {
    const card = document.createElement("div");
    card.className = "option-card";
    card.innerHTML = `
      <p>${option.toUpperCase()}</p>
      <img src="assets/property_icons/${option}.png" alt="${option}" onclick="checkAnswer('${option}')" />
    `;
    optionsContainer.appendChild(card);
  });
}

function getRandomProperty() {
  return properties[Math.floor(Math.random() * properties.length)];
}

function generateOptions(correct) {
  const options = [correct];
  while (options.length < 3) {
    const random = getRandomProperty();
    if (!options.includes(random)) {
      options.push(random);
    }
  }
  return shuffleArray(options);
}

function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}

function checkAnswer(selected) {
  const isCorrect = selected === currentTarget;
  if (isCorrect) {
    score += 20;
    showScoreChange("+20");
  } else {
    score -= 2;
    showScoreChange("-2");
  }
  document.getElementById("score").innerText = score;
  generateRound();
}

function endGame() {
  clearInterval(timerInterval);
  document.getElementById("game").classList.add("hidden");
  document.getElementById("game-over").classList.remove("hidden");
  document.getElementById("final-score").innerText = score;
  document.getElementById("nickname-label").innerText = nickname;
}

function shareOnX() {
  const text = `🏁 I scored ${score} XNL in XNL Token Rush by @Novastro_xyz!\nCan you beat me? 💥\nCreated by @traderibo123`;
  const url = "https://gamesnovastro.vercel.app/";
  const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
  window.open(xUrl, "_blank");
}

function showScoreChange(amount) {
  const floatText = document.createElement("div");
  floatText.className = "score-float";
  floatText.innerText = amount;
  document.body.appendChild(floatText);

  setTimeout(() => {
    floatText.remove();
  }, 1000);
}
