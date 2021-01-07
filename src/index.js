const allCells = document.querySelectorAll('.cell');
const xTurn = 'ch';
const circleTurn = 'r';
let startOfTurn = xTurn;
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

// const winningCombinations ={
//   horizontalWonCombination:[
//   [0, 1, 2],
//   [3, 4, 5],
//   [6, 7, 8],
// ],
//   verticalWonCombination: [
//   [0, 3, 6],
//   [1, 4, 7],
//   [2, 5, 8],
// ],
//  diagonalRightWonCombination: [0, 4, 8],
//  diagonalLeftWonCombination: [2, 4, 6],
// };


allCells.forEach(cell => {
  cell.addEventListener('click', handleClick)
})

function handleClick(e) {
  const cell = e.target;
  let currentClass = startOfTurn ? xTurn : circleTurn;
  placeMark(cell, currentClass);
  if (checkWin(currentClass)) {
    console.log('winner');
  }
  swapTurns();
}

function placeMark(cell, currentClass) {
  cell.classList.add(currentClass);
}

function swapTurns() {
  startOfTurn = !startOfTurn;
}

function checkWin(currentClass) {
  return winningCombinations.some(combination => {
    return combination.every(index => {
      return allCells[index].classList.contains(currentClass);
    })
  })
}

