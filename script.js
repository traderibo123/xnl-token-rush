import {
  db,
  ref,
  push,
  query,
  orderByChild,
  limitToLast,
  get,
  child
} from './firebase.js';

let nickname = '';
let score = 0;
let timer;
let currentAnswer = '';

const timeEl = document.getElementById("time");
const scoreEl = document.getElementById("score");
const propertyNameEl = document.getElementById("property-name");
const cardOptionsEl = document.getElementById("card-options");
const gameContainer = document.getElementById("game-container");
const startScreen = document.getElementById("start-screen");
const gameOverScreen = document.getElementById("game-over");
const finalScoreEl = document.getElementById("final-score");
const nicknameLabel = document.getElementById("nickname-label");

const properties = [
  "House", "Apartment", "Villa", "Tower", "Castle",
  "Field", "Office", "ShoppingMall", "Warehouse", "Plot",
  "Factory", "Powerplant", "Bank", "Land", "Stadium"
];

function startGame() {
  nickname = document.getElementById("player-name").value || "Anon";
  score = 0;
  timeEl.textContent = "60";
  scoreEl.textContent = "0";
  startScreen.classList.add("hidden");
  gameContainer.classList.remove("hidden");
  gameOverScreen.classList.add("hidden");
  startTimer();
  loadNewQuestion();
}

function startTimer() {
  let time = 60;
  timer = setInterval(() => {
    time--;
    timeEl.textContent = time;
    if (time <= 0) {
      clearInterval(timer);
      endGame();
    }
  }, 1000);
}

function loadNewQuestion() {
  const correct = properties[Math.floor(Math.random() * properties.length)];
  currentAnswer = correct;
  propertyNameEl.textContent = correct.toUpperCase();
  const options = new Set([correct]);
  while (options.size < 3) {
    options.add(properties[Math.floor(Math.random() * properties.length)]);
  }
  renderOptions([...options]);
}

function renderOptions(options) {
  cardOptionsEl.innerHTML = "";
  shuffleArray(options).forEach(prop => {
    const card = document.createElement("img");
    card.src = `assets/property_icons/${prop}.png`;
    card.alt = prop;
    card.classList.add("card");
    card.onclick = () => {
      if (prop === currentAnswer) score += 10;
      else score -= 5;
      scoreEl.textContent = score;
      loadNewQuestion();
    };
    cardOptionsEl.appendChild(card);
  });
}

function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}

function saveScore(name, score) {
  const scoresRef = ref(db, 'scores');
  push(scoresRef, { name, score });
}

function loadTopScores(callback) {
  const scoresRef = query(ref(db, 'scores'), orderByChild('score'), limitToLast(10));
  get(scoresRef).then(snapshot => {
    const scores = [];
    snapshot.forEach(childSnapshot => {
      scores.push(childSnapshot.val());
    });
    scores.reverse();
    callback(scores);
  });
}

function loadVisitorCount() {
  const dbRef = ref(db);
  get(child(dbRef, 'scores')).then(snapshot => {
    if (snapshot.exists()) {
      const count = Object.keys(snapshot.val()).length;
      document.getElementById("visitor-count").textContent = count;
    } else {
      document.getElementById("visitor-count").textContent = "0";
    }
  });
}

function endGame() {
  clearInterval(timer);
  gameContainer.classList.add("hidden");
  gameOverScreen.classList.remove("hidden");
  finalScoreEl.textContent = score;
  nicknameLabel.textContent = nickname;

  saveScore(nickname, score);
  loadVisitorCount();

  loadTopScores(scores => {
    const list = document.getElementById('leaderboard-list');
    list.innerHTML = '';
    scores.forEach(entry => {
      const li = document.createElement('li');
      li.textContent = `${entry.name}: ${entry.score} $XNL`;
      list.appendChild(li);
    });
  });
}

function shareOnTwitter() {
  const tweet = `I scored ${score} $XNL in the #XNLTokenRush 🚀\nPlay: https://xnl-token-rush.vercel.app/\n@traderibo123 @Novastro_xyz`;
  window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(tweet)}`, "_blank");
}

window.startGame = startGame;
window.shareOnTwitter = shareOnTwitter;
