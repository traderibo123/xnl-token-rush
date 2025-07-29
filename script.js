const properties = [
  "Apartment", "Bank", "Castle", "Factory", "Field",
  "Land", "Office", "Plot", "Powerplant", "ShoppingMall",
  "Stadium", "Tower", "Villa", "Warehouse", "House"
];

let score = 0;
let timeLeft = 60;
let nickname = "";
let timerInterval;

const targetProperty = document.getElementById("target-property");
const optionsContainer = document.getElementById("options");
const scoreDisplay = document.getElementById("score");
const timerDisplay = document.getElementById("timer");
const finalScore = document.getElementById("final-score");
const gameOver = document.getElementById("game-over");

function getRandomProperties(correct) {
  const choices = [correct];
  while (choices.length < 3) {
    const random = properties[Math.floor(Math.random() * properties.length)];
    if (!choices.includes(random)) choices.push(random);
  }
  return choices.sort(() => Math.random() - 0.5);
}

function showScoreChange(value) {
  const float = document.createElement("div");
  float.className = "score-float";
  float.textContent = (value > 0 ? "+" : "") + value + " XNL";
  document.body.appendChild(float);
  setTimeout(() => float.remove(), 1000);
}

function nextQuestion() {
  optionsContainer.innerHTML = "";
  const correct = properties[Math.floor(Math.random() * properties.length)];
  document.getElementById("tokenize-request").innerText = "Tokenize this for me: " + correct.toUpperCase();
  const choices = getRandomProperties(correct);
  choices.forEach(choice => {
    const img = document.createElement("img");
    img.src = `assets/property_icons/${choice}.png`;
    img.alt = choice;
    img.onclick = () => {
      if (choice === correct) {
        score += 10;
        showScoreChange(10);
      } else {
        score -= 5;
        showScoreChange(-5);
      }
      scoreDisplay.textContent = score;
      nextQuestion();
    };
    optionsContainer.appendChild(img);
  });
}

function startGame() {
  nickname = document.getElementById("nickname-input").value.trim();
  if (!nickname) return alert("Please enter your nickname!");
  document.getElementById("start-screen").classList.add("hidden");
  document.getElementById("game").classList.remove("hidden");
  timerInterval = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      document.getElementById("game").classList.add("hidden");
      gameOver.classList.remove("hidden");
      finalScore.textContent = score;
      document.getElementById("nickname-label").textContent = nickname;
    }
  }, 1000);
  nextQuestion();
}

function shareOnX() {
  const url = "https://twitter.com/intent/tweet?text=" +
    encodeURIComponent(`${nickname} scored ${score} XNL in XNL Token Rush! 🚀\n@Novastro_xyz @traderibo123\nPlay now!`);
  window.open(url, "_blank");
}
