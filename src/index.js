const allCells = document.querySelectorAll('.cell');
const xTurn = 'ch';
const circleTurn = 'r';
let startOfTurn = xTurn;


  allCells.forEach(cell => {
  cell.addEventListener('click', handleClick)
})

function handleClick(e) {
  const cell = e.target;
  let currentClass = startOfTurn ? xTurn : circleTurn;
  placeMark(cell, currentClass);
/*  if (checkWin(currentClass)){
    console.log('winner');
  }*/
  swapTurns();
}

function placeMark(cell, currentClass) {
  cell.classList.add(currentClass);
}

function swapTurns() {
  startOfTurn = !startOfTurn;
}
