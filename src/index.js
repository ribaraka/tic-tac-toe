const allCells = document.querySelectorAll('.cell');
const crossesTurn = 'r';
const circleTurn = 'ch';
const wonMessage = document.querySelector('.won-message');
const wonTitle = document.querySelector('.won-title');
const restartButton = document.querySelector('.restart-btn');
const unDoButton = document.querySelector('.undo-btn');
const redoDoButton = document.querySelector('.redo-btn');
const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];
let orderOfTurn = null;

let history = [];
let undoHistory = [];

startGame();

function startGame() {
  orderOfTurn = crossesTurn;
  wonTitle.classList.add('hidden');
  history = [];
  undoHistory = [];
  allCells.forEach(cell => {
    cell.classList.remove(crossesTurn);
    cell.classList.remove(circleTurn);
    cell.addEventListener('click', handleClick);
  })
}

function isDraw() {
  return [...allCells].every(cell => {
    return cell.classList.contains(crossesTurn) || cell.classList.contains(circleTurn);
  })
}

function swapTurns() {
  orderOfTurn = !orderOfTurn;
}

function checkWin(currentTurn) {
  return winningCombinations.some(combination => {
    return combination.every(index => {
      return allCells[index].classList.contains(currentTurn);
    })
  })
}

function endGame(draw) {
  if (draw) {
    wonMessage.textContent = `It's a draw!`;
  } else {
    wonMessage.textContent = `${orderOfTurn ? "Crosses won!" : "Toes won!"}`;
  }
  wonTitle.classList.remove('hidden');
  allCells.forEach(cell => {
    cell.removeEventListener('click', handleClick);
  })
}

function handleClick(e) {
  const cell = e.target;
  let currentTurn = orderOfTurn ? circleTurn : crossesTurn;
  placeMark(cell, currentTurn);
  if (checkWin(currentTurn)) {
    endGame(false);
  } else if (isDraw()) {
    endGame(true);
  }
  swapTurns();
}

function placeMark(cell, currentTurn) {
  unDoButton.disabled = false;
  cell.classList.add(currentTurn);
  history.push(cell);
  localStorage.setItem('history', JSON.stringify(history));
  console.log(history);
  undoHistory = [];
}

function undoClick() {
  redoDoButton.disabled = false;
  wonTitle.classList.add('hidden');
  allCells.forEach(cell => {
    cell.addEventListener('click', handleClick);
  });
  let currentTurn = orderOfTurn ? crossesTurn : circleTurn;
  let undoElement = history.pop();
  localStorage.setItem('history', JSON.stringify(history));
  console.log(history);
  undoHistory.push(undoElement);
  undoElement.classList.remove(currentTurn);
  swapTurns();

  if (!history.length) {
    unDoButton.disabled = true;
  }
}

function redoClick() {
  swapTurns();
  let undoElement = undoHistory.pop();
  let currentTurn = orderOfTurn ? crossesTurn : circleTurn;
  undoElement.classList.add(currentTurn);
  history.push(undoElement);
  localStorage.setItem('history', JSON.stringify(history));
  console.log(history);
  if (checkWin(currentTurn)) {
    endGame(false);
  } else if (isDraw()) {
    endGame(true);
  }
  if (!undoHistory.length) {
    redoDoButton.disabled = true;
  }
}

restartButton.addEventListener('click', startGame);
unDoButton.addEventListener('click', undoClick);
redoDoButton.addEventListener('click', redoClick);

