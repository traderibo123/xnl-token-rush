import { db, ref, push, get, child } from "./firebase.js";

// DOM öğeleri
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

// 15 mülk ikon adı
const properties = [
  "Apartment", "Bank", "Castle", "Factory", "Field",
  "Land", "Office", "Plot", "Powerplant", "ShoppingMall",
  "Stadium", "Tower", "Villa", "Warehouse", "House"
];

// Giriş ekranından oyuna başla
startButton.addEventListener("click", () => {
  nickname = nicknameInput.value.trim();
  if (nickname !== "") {
    startScreen.style.display = "none";
    gameContainer.classList.remove("hidden");
    incrementVisitorCount(); // Firebase ile ziyaretçi sayısını artır
    startGame();
  } else {
    alert("Please enter your nickname!");
  }
});

function startGame() {
  score = 0;
  timeLeft = 60;
  updateScore(0);
  updateTimer(60);
  setNewRound();
  startTimer();
}

// Süreyi başlat
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

// Yeni bir mülk ve 3 seçenek belirle
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
    card.addEventListener("click", () => checkAnswer(prop));

    propertyOptionsElem.appendChild(card);
  });
}

function checkAnswer(selected) {
  if (selected === correctProperty) {
    updateScore(score + 1);
  } else {
    updateScore(score > 0 ? score - 1 : 0);
  }
  setNewRound();
}

function endGame() {
  gameContainer.innerHTML = `
    <h2>Well done, Novastars!</h2>
    <p>You scored <strong>${score} $XNL</strong></p>
    <p>👥 Visited by Novastars: <span id="visitor-count">${visitorCountElem.textContent}</span></p>
    <p><a href="https://x.com/intent/tweet?text=I scored ${score} $XNL in $XNL Token Rush! 🚀%0Ahttps://xnl-token-rush.vercel.app/%20@Novastro_xyz%20@traderibo123" target="_blank">📢 Share on X</a></p>
  `;
}

// FIREBASE: ziyaretçi sayaç işlemi
function incrementVisitorCount() {
  const counterRef = ref(db, "visitorCount");
  get(counterRef).then((snapshot) => {
    let current = 0;
    if (snapshot.exists()) current = snapshot.val();
    const newCount = current + 1;
    push(ref(db, "visits"), { nickname, timestamp: Date.now() });
    ref(db, "visitorCount").set(newCount);
    visitorCountElem.textContent = newCount;
  });
}
