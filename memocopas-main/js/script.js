const levels = [
  { name: 'Fácil', pairs: 6 },
  { name: 'Médio', pairs: 8 },
  { name: 'Difícil', pairs: 10 }
];

const cardsArray = [
  { name: 'Pele', img: './img/pele.jpg' },
  { name: 'Zidane', img: './img/zidane.jpg' },
  { name: 'Neymar', img: './img/neymar.jpg' },
  { name: 'Cristiano Ronaldo', img: './img/c_ronaldo.jpg' },
  { name: 'Modric', img: './img/modric.jpg' },
  { name: 'Mbappe', img: './img/mbappe.jpg' },
  { name: 'Kaka', img: './img/kaka.jpg' },
  { name: 'Maradona', img: './img/maradona.jpg' },
  { name: 'Romario', img: './img/romario.jpg' },
  { name: 'Maldini', img: './img/maldini.jpg' },
];

const elements = {
  gameBoard: document.getElementById('game-board'),
  resetButton: document.getElementById('reset'),
  timerElement: document.getElementById('timer'),
  rankingList: document.getElementById('ranking-list'),
  loginScreen: document.getElementById('login-screen'),
  gameScreen: document.getElementById('game-screen'),
  loginForm: document.getElementById('login-form'),
  efficiencyElement: document.getElementById('efficiency'),
  errorsElement: document.getElementById('errors'),
  matchesElement: document.getElementById('matches'),
  levelElement: document.getElementById('level'),
  messageElement: document.getElementById('message')
};

let state = {
  cards: [],
  flippedCards: [],
  matchedCards: [],
  timer: null,
  timeElapsed: 0,
  playerName: '',
  playerEmail: '',
  errors: 0,
  matches: 0,
  currentLevel: 0
};

function startGame() {
  resetGame();
  createCards();
  shuffleCards();
  displayCards();
  startTimer();
}

function resetGame() {
  clearInterval(state.timer);
  Object.assign(state, {
      timeElapsed: 0,
      errors: 0,
      matches: 0,
      flippedCards: [],
      matchedCards: []
  });
  elements.timerElement.textContent = "00:00";
  updateUI();
  showMessage("Pronto para começar? Lembre-se de cada carta!");
}

function createCards() {
  state.cards = [];
  const numPairs = levels[state.currentLevel].pairs;
  for (let i = 0; i < numPairs; i++) {
      state.cards.push(...Array(2).fill(cardsArray[i % cardsArray.length]));
  }
}

function shuffleCards() {
  state.cards.sort(() => Math.random() - 0.5);
}

function displayCards() {
  elements.gameBoard.innerHTML = state.cards.map(card => `
      <div class="card" data-name="${card.name}">
          <div class="card-inner">
              <div class="card-front">?</div>
              <div class="card-back"><img src="${card.img}" alt="${card.name}" loading="lazy"></div>
          </div>
      </div>
  `).join('');
  
  document.querySelectorAll('.card').forEach(card => card.addEventListener('click', flipCard));
}

function flipCard() {
  if (this.classList.contains('flip') || state.flippedCards.length === 2) return;
  this.classList.add('flip');
  state.flippedCards.push(this);
  
  if (state.flippedCards.length === 2) {
      checkMatch();
  }
}

function checkMatch() {
  const [firstCard, secondCard] = state.flippedCards;
  if (firstCard.dataset.name === secondCard.dataset.name) {
      state.matchedCards.push(firstCard, secondCard);
      state.matches++;
      showMessage("Você encontrou um par!");
      state.flippedCards = [];
      updateUI();
      if (state.matchedCards.length === state.cards.length) {
          clearInterval(state.timer);
          advanceLevel();
      }
  } else {
      showMessage("Tente novamente!");
      setTimeout(() => {
          state.flippedCards.forEach(card => card.classList.remove('flip'));
          state.flippedCards = [];
      }, 1000);
      state.errors++;
      updateUI();
  }
}

function startTimer() {
  clearInterval(state.timer);
  state.timeElapsed = 0;
  state.timer = setInterval(() => {
      state.timeElapsed++;
      const minutes = String(Math.floor(state.timeElapsed / 60)).padStart(2, '0');
      const seconds = String(state.timeElapsed % 60).padStart(2, '0');
      elements.timerElement.textContent = `${minutes}:${seconds}`;
  }, 1000);
}

function updateUI() {
  elements.errorsElement.textContent = state.errors;
  elements.matchesElement.textContent = state.matches;
  elements.efficiencyElement.textContent = `${updateEfficiency()}%`;
  elements.levelElement.textContent = state.currentLevel + 1;
}

function updateEfficiency() {
  const totalMoves = state.errors + state.matches;
  return totalMoves ? ((state.matches / totalMoves) * 100).toFixed(2) : 100;
}

function advanceLevel() {
  if (state.currentLevel < levels.length - 1) {
      state.currentLevel++;
      showMessage(`Parabéns! Avançou para o nível ${state.currentLevel + 1}!`);
      startGame();
  } else {
      showMessage("Parabéns! Você completou todos os níveis.");
  }
}

function showMessage(message) {
  elements.messageElement.textContent = message;
  elements.messageElement.classList.add('fade-in');
  setTimeout(() => {
      elements.messageElement.classList.remove('fade-in');
  }, 3000);
}

elements.loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  state.playerName = document.getElementById('name').value;
  state.playerEmail = document.getElementById('email').value;
  elements.loginScreen.style.display = 'none';
  elements.gameScreen.style.display = 'block';
  startGame();
});

elements.resetButton.addEventListener('click', startGame);
