const allCells = document.querySelectorAll('.cell');
const circleTurn = 'r';
const crossesTurn = 'ch';
const wonMessage = document.querySelector('.won-message');
const wonTitle = document.querySelector('.won-title');
const restartButton = document.querySelector('.restart-btn');
const unDoButton = document.querySelector('.undo-btn');
const redoDoButton = document.querySelector('.redo-btn');
let lastTurn = circleTurn;
let history = [];
let undoHistory = [];
const orderedCells = getOrderedCells(allCells);
const numberOfRows = Math.sqrt(orderedCells.length);

startGame();

restartButton.addEventListener('click', startGame);
unDoButton.addEventListener('click', undoClick);
redoDoButton.addEventListener('click', redoClick);

function startGame() {
  wonTitle.classList.add('hidden');
  history = [];
  undoHistory = [];
  clearField();
  addClickHandler();
  }

function clickHandler(e) {
  const cell = e.target;
  lastTurn = currentTurn();
  renderMove(cell, lastTurn);
  history.push(cell);
  // localStorage.setItem('history', JSON.stringify(history));
  // console.log(history);
  // TODO: make a function which returns win object and second one which renders proper win state.
  caseWin();
}

function renderMove(cell, currentTurn) {
  unDoButton.disabled = false;
  cell.classList.add(currentTurn);
  undoHistory = [];
  redoDoButton.disabled = true;
}

function currentTurn() {
  return  lastTurn === circleTurn ? crossesTurn :  circleTurn;
}

function caseWin() {
  // if (isWin(currentTurn())) {
  //   wonMessage.textContent = `${lastTurn ? "Crosses won!" : "Toes won!"}`;
  //   wonTitle.classList.remove('hidden');
  //   disableClick();
  // }
  // if (isDraw()) {
  //   wonMessage.textContent = `It's a draw!`;
  //   wonTitle.classList.remove('hidden');
  // }
}

function disableClick() {
  allCells.forEach(cell => {
    cell.removeEventListener('click', clickHandler);
  })
}

function isDraw() {
  return [...allCells].every(cell => {
    return cell.classList.contains(crossesTurn) || cell.classList.contains(circleTurn);
  })
}

// function isWin(currentTurn) {
//   return winningCombinations.some(combination => {
//     return combination.every(index => {
//       return allCells[index].classList.contains(currentTurn);
//     })
//   })
// }

function addClickHandler() {
  allCells.forEach(cell => {
    cell.addEventListener('click', clickHandler);
  });
}

function clearField() {
  allCells.forEach(cell => {
    cell.classList.remove(crossesTurn);
    cell.classList.remove(circleTurn);
  })
}

function undoClick() {
  lastTurn = currentTurn();
  redoDoButton.disabled = false;
  wonTitle.classList.add('hidden');
  addClickHandler();
  let undoElement = history.pop();
  localStorage.setItem('history', JSON.stringify(history));
  console.log(history);
  undoHistory.push(undoElement);
  undoElement.classList.remove(currentTurn());
  if (!history.length) {
    unDoButton.disabled = true;
  }
}

function redoClick() {
  let undoElement = undoHistory.pop();
  undoElement.classList.add(currentTurn());
  history.push(undoElement);
  localStorage.setItem('history', JSON.stringify(history));
  console.log(history);
  caseWin();
  if (!undoHistory.length) {
    redoDoButton.disabled = true;
  }
  if (history.length){
    unDoButton.disabled = false;
  }
  lastTurn = currentTurn();
}

function getWinner() {
  // TODO: check horizontal scenario
  // horizontal(allCells);

  // TODO: check vertical scenario
  // vertical(input)
  // TODO: check diagonal scenario
  // diagonalRight(input)
  // diagonalLeft(input)
  return {
    winnerWasFound: true,
    scenario: '',//diagonal, vertical, horizontal
    winner: '',// r || ch
    cells: []
  };
}

function renderGameEnd() {

}

function horizontal(input) {
  input = getOrderedCells(input);
  let numberOfRows = Math.sqrt(input.length);
  for (let i = 0; i < numberOfRows; i++) {
    let j = i * numberOfRows;
    let theLatestIndexOfRow = i * numberOfRows + numberOfRows;
    let cellClass = getClass(input[j]);
    if (cellClass === '') {
      continue
    }
    let result = [];
    let badRow = false;
    for (; j < theLatestIndexOfRow; j++) {
      if (getClass(input[j]) !== cellClass){
        badRow = true;
        break
      }
      result.push(input[j]);
    }
    if (!badRow){
      return result;
    }
  }
  return [];
}

function vertical(input) {
  input = getOrderedCells(input);
  let numberOfRows = Math.sqrt(input.length);
  for (let i = 0; i < numberOfRows; i++){
    let j = i;
    let theLatestIndexOfCol = i + input.length - numberOfRows;
    let cellClass = getClass(input[j]);
    if (cellClass === '') {
      continue
    }
    let result = [];
    let badRow = false;
    while ( j <= theLatestIndexOfCol){
      if (getClass(input[j]) !== cellClass){
        badRow = true;
        break
      }
      result.push(input[j]);
      j += numberOfRows;
    }
    if (!badRow){
      return result;
    }
  }
  return [];
}

function diagonalRight(input) {
  input = getOrderedCells(input);
  let numberOfRows = Math.sqrt(input.length);
  let index = input[0];
  let cellClass = getClass(index);
  let result = [];
  let badRow = false;
  for (let i = 0; i <= input.length; i++) {
      if (getClass(input[i]) !== cellClass){
        badRow = true;
        break
      }
    result.push(input[i]);
      i += numberOfRows;
    }
    if (!badRow){
      return result;
    }
  return [];
}

function diagonalLeft(input) {
  input = getOrderedCells(input);
  let numberOfRows = Math.sqrt(input.length);
  let startPointFromLeftToRight = input.length - numberOfRows
  let index = input[startPointFromLeftToRight];
  let cellClass = getClass(index);
  console.log(index);
  let result = [];
  let badRow = false;
  for (let i = startPointFromLeftToRight; i > 0; i++) {
    if (getClass(input[i]) !== cellClass){
      badRow = true;
      break
    }
    result.push(input[i]);
    i -= numberOfRows;
  }
  if (!badRow){
    return result;
  }
  return [];
}

function getClass(cell){
  if (cell.classList.contains('r')){
    return 'r';
  }

  if (cell.classList.contains('ch')){
    return 'ch'
  }

  return '';
}

function getOrderedCells(allCells) {
  let result = [];
  for (let i = 0; i < allCells.length; i++){
    let cell = allCells[i];
    let cellID = cell.id;
    let ID = cellID.split('-')[1];
    let numID = Number.parseInt(ID, 10);
    result[numID] = cell;
  }
return result;
}

