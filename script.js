let nickname = "";
let score = 0;
let timeLeft = 60;
let timerInterval;
let currentProperty = "";
let properties = [
  "APARTMENT", "BANK", "CASTLE", "FACTORY", "FIELD",
  "LAND", "OFFICE", "PLOT", "POWER PLANT", "SHOPPING MALL",
  "STADIUM", "TOWER", "VILLA", "WAREHOUSE", "HOUSE"
];

// Karıştırma fonksiyonu
function shuffle(array) {
  let currentIndex = array.length, temp, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    temp = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temp;
  }
  return array;
}

// Oyunu başlat
function startGame() {
  nickname = document.getElementById("nickname-input").value || "Player";
  document.getElementById("start-screen").classList.add("hidden");
  document.getElementById("game").classList.remove("hidden");
  score = 0;
  timeLeft = 60;
  document.getElementById("score").textContent = score;
  document.getElementById("timer").textContent = timeLeft;
  timerInterval = setInterval(updateTimer, 1000);
  setNewProperty();
}

// Zamanlayıcıyı güncelle
function updateTimer() {
  timeLeft--;
  document.getElementById("timer").textContent = timeLeft;
  if (timeLeft <= 0) {
    clearInterval(timerInterval);
    endGame();
  }
}

// Yeni mülk ve seçenekleri göster
function setNewProperty() {
  let shuffled = shuffle([...properties]);
  currentProperty = shuffled[0];
  const correctIndex = Math.floor(Math.random() * 3);
  const options = shuffled.slice(1, 3);
  options.splice(correctIndex, 0, currentProperty);

  const optionsContainer = document.getElementById("options");
  optionsContainer.innerHTML = "";

  options.forEach((prop) => {
    const fileName = prop.toLowerCase().replace(/\s+/g, '');
    const formattedName = fileName.charAt(0).toUpperCase() + fileName.slice(1);
    const img = document.createElement("img");
    img.src = `assets/property_icons/${formattedName}.png`;
    img.alt = prop;
    img.onclick = () => handleChoice(prop === currentProperty);
    optionsContainer.appendChild(img);
  });

  // Kurbağanın konuşma balonunu güncelle
  document.getElementById("speech-text").textContent = `Tokenize this for me: ${currentProperty}`;
}

// Seçimi değerlendir
function handleChoice(isCorrect) {
  const floatText = document.createElement("div");
  floatText.classList.add("score-float");
  floatText.textContent = isCorrect ? "+20 XNL" : "-10 XNL";
  document.body.appendChild(floatText);
  setTimeout(() => floatText.remove(), 1000);

  score += isCorrect ? 20 : -10;
  if (score < 0) score = 0;
  document.getElementById("score").textContent = score;
  setNewProperty();
}

// Oyunu bitir
function endGame() {
  document.getElementById("game").classList.add("hidden");
  document.getElementById("game-over").classList.remove("hidden");
  document.getElementById("final-score").textContent = score;
  document.getElementById("nickname-label").textContent = nickname;
}

// X'te paylaş
function shareOnX() {
  const text = `I scored ${score} XNL in XNL Token Rush! 🚀\nPowered by @Novastro_xyz ✨\nby @traderibo123`;
  const url = "https://gamesnovastro.vercel.app/";
  const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
  window.open(xUrl, "_blank");
}
