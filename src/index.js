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
  let winner = getWinner();
  renderGameEnd(winner);
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

  let winnerH = horizontal(orderedCells);
  if (winnerH !== null){
    return winnerH;
  }
  let winnerV = vertical(orderedCells);
  if (winnerV !== null){
    return winnerV;
  }
  let winnerDiagonalR = diagonalRight(orderedCells);
  if (winnerDiagonalR !== null){
    return winnerDiagonalR
  }
  let winnerDiagonalL = diagonalLeft(orderedCells);
  if (winnerDiagonalL !== null){
    return winnerDiagonalL;
  }
  // TODO: check Draw scenario;
  return {
    draw: false,
    scenario: '',//diagonalLeft, diagonalRight, vertical, horizontal
    winner: '',// r || ch
    cells: []
  };
}

function renderGameEnd(gameEnd) {
    // if (gameEnd.scenario === 'horizontal') {
    //   return
    // }
}


function horizontal(orderedCells) {
  for (let i = 0; i < numberOfRows; i++) {
    let j = i * numberOfRows;
    let theLatestIndexOfRow = i * numberOfRows + numberOfRows;
    let cellClass = getClass(orderedCells[j]);
    if (cellClass === '') {
      continue
    }
    let result = [];
    let badRow = false;
    for (; j < theLatestIndexOfRow; j++) {
      if (getClass(orderedCells[j]) !== cellClass){
        badRow = true;
        break
      }
      result.push(orderedCells[j]);
    }
    if (!badRow){
        return {
        draw: false,
        scenario:'horizontal',
        winner: getClass(result[0]),
        cells: result,
      }
    }
  }
  return null;
}

function vertical(orderedCells) {
  for (let i = 0; i < numberOfRows; i++) {
    let j = i;
    let theLatestIndexOfCol = i + orderedCells.length - numberOfRows;
    let cellClass = getClass(orderedCells[j]);
    if (cellClass === '') {
      continue
    }
    let result = [];
    let badRow = false;
    while (j <= theLatestIndexOfCol) {
      if (getClass(orderedCells[j]) !== cellClass) {
        badRow = true;
        break
      }
      result.push(orderedCells[j]);
      j += numberOfRows;
    }
    if (!badRow) {
      return {
        draw: false,
        scenario: 'vertical',
        winner: getClass(result[0]),
        cells: result,
      }
    }
  }
    return null;

}

function diagonalRight(orderedCells) {
  let startingPoint = orderedCells[0];
  let cellClass = getClass(startingPoint);
  let result = [];
  let badRow = false;
  for (let i = 0; i <= orderedCells.length; i++) {
      if (getClass(orderedCells[i]) !== cellClass){
        badRow = true;
        break
      }
    result.push(orderedCells[i]);
      i += numberOfRows;
    }
    if (!badRow){
      return {
        draw: false,
        scenario: 'diagonalRight',
        winner: getClass(result[0]),
        cells: result,
      }
    }
return null;
}

function diagonalLeft(orderedCells) {
  let diagonalStartPointIndex = orderedCells.length - numberOfRows
  let startingPoint = orderedCells[diagonalStartPointIndex];
  let cellClass = getClass(startingPoint);
  let result = [];
  let badRow = false;
  for (let i = diagonalStartPointIndex; i > 0; i++) {
    if (getClass(orderedCells[i]) !== cellClass){
      badRow = true;
      break
    }
    result.push(orderedCells[i]);
    i -= numberOfRows;
  }
  if (!badRow){
    return {
      draw: false,
      scenario: 'diagonalLeft',
      winner: getClass(result[0]),
      cells: result,
    }
  }
  return null;
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

