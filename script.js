import { db, ref, push, query, orderByChild, limitToLast, get, child } from './firebase.js';

let score = 0;
let timeLeft = 60;
let timerInterval;
let currentProperty = '';
let properties = [
  'Apartment', 'Bank', 'Castle', 'Factory', 'Field',
  'Land', 'Office', 'Plot', 'Powerplant', 'ShoppingMall',
  'Stadium', 'Tower', 'Villa', 'Warehouse', 'House'
];

function getRandomProperty() {
  return properties[Math.floor(Math.random() * properties.length)];
}

function generateOptions(correct) {
  const options = new Set([correct]);
  while (options.size < 3) {
    options.add(getRandomProperty());
  }
  return Array.from(options).sort(() => 0.5 - Math.random());
}

function updateGameUI() {
  document.getElementById('property-name').textContent = currentProperty.toUpperCase();
  const cardOptions = document.getElementById('card-options');
  cardOptions.innerHTML = '';
  generateOptions(currentProperty).forEach(option => {
    const img = document.createElement('img');
    img.src = `assets/property_icons/${option}.png`;
    img.alt = option;
    img.className = 'card';
    img.onclick = () => checkAnswer(option);
    cardOptions.appendChild(img);
  });
}

function checkAnswer(selected) {
  if (selected === currentProperty) {
    score += 10;
  } else {
    score -= 5;
    if (score < 0) score = 0;
  }
  document.getElementById('score').textContent = score;
  nextRound();
}

function nextRound() {
  currentProperty = getRandomProperty();
  updateGameUI();
}

function updateTimer() {
  timeLeft--;
  document.getElementById('time').textContent = timeLeft;
  if (timeLeft <= 0) {
    clearInterval(timerInterval);
    endGame();
  }
}

window.startGame = function () {
  const name = document.getElementById('player-name').value.trim();
  if (!name) {
    alert("Please enter your name!");
    return;
  }

  score = 0;
  timeLeft = 60;
  document.getElementById('score').textContent = score;
  document.getElementById('time').textContent = timeLeft;

  document.getElementById('start-screen').classList.add('hidden');
  document.getElementById('game-container').classList.remove('hidden');

  nextRound();
  timerInterval = setInterval(updateTimer, 1000);
};

function endGame() {
  document.getElementById('game-container').classList.add('hidden');
  document.getElementById('game-over').classList.remove('hidden');
  document.getElementById('final-score').textContent = score;

  const name = document.getElementById('player-name').value.trim();
  const scoresRef = ref(db, 'scores');
  push(scoresRef, { name, score });

  loadLeaderboard();
  loadVisitorCount();
}

function loadLeaderboard() {
  const topScoresQuery = query(ref(db, 'scores'), orderByChild('score'), limitToLast(10));
  get(topScoresQuery).then(snapshot => {
    const list = document.getElementById('leaderboard-list');
    list.innerHTML = '';
    const scores = [];
    snapshot.forEach(childSnapshot => {
      scores.push(childSnapshot.val());
    });
    scores.sort((a, b) => b.score - a.score);
    scores.forEach(entry => {
      const li = document.createElement('li');
      li.textContent = `${entry.name} — ${entry.score} $XNL`;
      list.appendChild(li);
    });
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
  }).catch(error => {
    console.error("Visitor count error:", error);
    document.getElementById("visitor-count").textContent = "0";
  });
}

window.shareOnTwitter = function () {
  const scoreVal = document.getElementById('final-score').textContent;
  const tweetText = `🚀 I scored ${scoreVal} $XNL in the #XNLTokenRush game! Try to beat me at https://xnl-token-rush.vercel.app 🚀 @Novastro_xyz @traderibo123`;
  const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
  window.open(tweetUrl, '_blank');
};
