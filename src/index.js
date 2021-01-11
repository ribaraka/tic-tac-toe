const allCells = document.querySelectorAll('.cell');
const crossesTurn = 'ch';
const circleTurn = 'r';
const wonMessage = document.querySelector('.won-message');
const wonTitle = document.querySelector('.won-title');
const restartButton = document.querySelector('.restart-btn');
const unDoButton = document.querySelector('undo-btn btn');
const redoDoButton = document.querySelector('redo-btn btn');
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
let orderOfTurn = crossesTurn;

startGame();

function startGame() {
  orderOfTurn = crossesTurn;
  allCells.forEach(cell => {
    cell.classList.remove(crossesTurn);
    cell.classList.remove(circleTurn);
    wonTitle.classList.add('hidden');
    cell.addEventListener('click', handleClick);
  })
}

function placeMark(cell, currentClass) {
  cell.classList.add(currentClass);
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
  wonTitle.classList.toggle('hidden');
  allCells.forEach(cell => {
    cell.removeEventListener('click', handleClick);
  })
}

  function handleClick(e) {
    const cell = e.target;
    let currentTurn = orderOfTurn ? crossesTurn : circleTurn;
    placeMark(cell, currentTurn);
    if (checkWin(currentTurn)) {
      endGame(false);
    } else if (isDraw()) {
      endGame(true);
    } else {
      swapTurns();
    }
  }

  restartButton.addEventListener('click', startGame);

