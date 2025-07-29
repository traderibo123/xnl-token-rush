import { db, ref, push, get, child, set } from "./firebase.js";

const startScreen = document.getElementById("startScreen");
const nicknameInput = document.getElementById("nicknameInput");
const startButton = document.getElementById("startButton");
const gameContainer = document.getElementById("gameContainer");
const frogAndText = document.getElementById("frog-and-text");
const propertyNameElem = document.getElementById("property-name");
const propertyOptionsElem = document.getElementById("property-options");
const scoreElem = document.getElementById("score");
const timerElem = document.getElementById("timer");
const visitorCountElem = document.getElementById("visitor-count");

let score = 0;
let timeLeft = 60;
let timerInterval;
let correctProperty = "";
let nickname = "";

// 15 mülk
const properties = [
  "Apartment", "Bank", "Castle", "Factory", "Field",
  "Land", "Office", "Plot", "Powerplant", "ShoppingMall",
  "Stadium", "Tower", "Villa", "Warehouse", "House"
];

startButton.addEventListener("click", () => {
  nickname = nicknameInput.value.trim();
  if (nickname !== "") {
    startScreen.style.display = "none";
    gameContainer.classList.remove("hidden");
    incrementVisitorCount();
    startGame();
  } else {
    alert("Please enter your nickname!");
  }
});

function startGame() {
  score = 0;
  timeLeft = 60;
  updateScore(0);
  updateTimer(timeLeft);
  setNewRound();
  startTimer();
}

function startTimer() {
  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimer(timeLeft);
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      endGame();
    }
  }, 1000);
}

function updateScore(val) {
  score = val;
  scoreElem.textContent = `${score} $XNL`;
}

function updateTimer(t) {
  timerElem.textContent = `${t}s`;
}

function setNewRound() {
  correctProperty = properties[Math.floor(Math.random() * properties.length)];
  propertyNameElem.textContent = correctProperty.toUpperCase();

  const options = new Set();
  options.add(correctProperty);
  while (options.size < 3) {
    const random = properties[Math.floor(Math.random() * properties.length)];
    options.add(random);
  }

  const shuffled = [...options].sort(() => 0.5 - Math.random());
  propertyOptionsElem.innerHTML = "";

  shuffled.forEach((prop) => {
    const card = document.createElement("div");
    card.className = "property-card";

    const label = document.createElement("p");
    label.textContent = prop.toUpperCase();

    const image = document.createElement("img");
    image.src = `assets/property_icons/${prop}.png`;
    image.alt = prop;

    card.appendChild(label);
    card.appendChild(image);
    card.addEventListener("click", () => checkAnswer(prop, card));

    propertyOptionsElem.appendChild(card);
  });
}

function checkAnswer(selected, card) {
  if (selected === correctProperty) {
    updateScore(score + 20);
    showPointEffect("+20", card);
  } else {
    updateScore(score >= 10 ? score - 10 : 0);
    showPointEffect("-10", card);
  }
  setTimeout(setNewRound, 300);
}

function showPointEffect(text, element) {
  const effect = document.createElement("div");
  effect.className = "point-effect";
  effect.textContent = text;
  element.appendChild(effect);
  setTimeout(() => effect.remove(), 1000);
}

function endGame() {
  const tweetText = `I scored ${score} $XNL in $XNL Token Rush! 🚀\nhttps://xnl-token-rush.vercel.app/ @Novastro_xyz @traderibo123`;
  const tweetURL = `https://x.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;

  // Firebase'e skor kaydet
  const userRef = ref(db, "scores");
  push(userRef, { nickname, score, timestamp: Date.now() });

  // Game Over ekranı
  gameContainer.innerHTML = `
    <div class="game-over">
      <h2>Game Over</h2>
      <p>🧠 Well done, Novastars!</p>
      <p>🏆 Your Score: <strong>${score} $XNL</strong></p>
      <p>👥 Visited by Novastars: <span>${visitorCountElem.textContent}</span></p>
      <p><a href="${tweetURL}" target="_blank">📢 Share on X</a></p>
      <h3>Leaderboard</h3>
      <ul id="leaderboard">Loading...</ul>
    </div>
  `;
  loadLeaderboard();
}

function loadLeaderboard() {
  const lbRef = ref(db, "scores");
  get(lbRef).then(snapshot => {
    const scores = [];
    snapshot.forEach(child => {
      scores.push(child.val());
    });

    scores.sort((a, b) => b.score - a.score);
    const top5 = scores.slice(0, 5);

    const ul = document.getElementById("leaderboard");
    ul.innerHTML = "";
    top5.forEach((entry, index) => {
      const li = document.createElement("li");
      li.textContent = `${index + 1}. ${entry.nickname}: ${entry.score} $XNL`;
      ul.appendChild(li);
    });
  });
}

// ZİYARETÇİ SAYACI
function incrementVisitorCount() {
  const countRef = ref(db, "visitorCount");
  get(countRef).then(snapshot => {
    let current = 0;
    if (snapshot.exists()) current = snapshot.val();
    const updated = current + 1;
    set(countRef, updated);
    visitorCountElem.textContent = updated;
  });
}
