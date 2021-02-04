const allCells = document.querySelectorAll('.cell');
const circleTurn = 'r';
const crossesTurn = 'ch';
const wonMessage = document.querySelector('.won-message');
const wonTitle = document.querySelector('.won-title');
const restartButton = document.querySelector('.restart-btn');
const undoButton = document.querySelector('.undo-btn');
const redoDoButton = document.querySelector('.redo-btn');
let lastTurn = circleTurn;
let history = JSON.parse(localStorage.getItem('history')) || [];
const orderedCells = getOrderedCells(allCells);
const numberOfRows = Math.sqrt(orderedCells.length);

restartButton.addEventListener('click', restartGame);
undoButton.addEventListener('click', undoHandler);
redoDoButton.addEventListener('click', redoHandler);
addClickHandler();

function restartGame() {
  lastTurn = circleTurn;
  wonTitle.classList.add('hidden');
  history = [];
  undoButton.disabled = true;
  clearField();
  addClickHandler();
  localStorage.setItem('history', JSON.stringify(history));
}

function renderGame() {
  clearField();
  history.forEach(cell => {
    if (cell.undo === true){
      return;
    }
    let cellElement = document.getElementById(cell.id);
    cellElement.classList.add(cell.lastTurn);
  })
  let winner = getWinner();
  renderGameEnd(winner);
}

function theLastElementWithClass() {
  let count = 0;
  for (let i = 0; i < history.length; i++){
    if (history[i].undo === true){
      break
    }
    count++;
  }
  return count;
}

function clickHandler(e) {

  const id = e.target.id;
  lastTurn = currentTurn();
  let cell = {
    id,
    lastTurn,
    undo: false,
  };

  history.splice(theLastElementWithClass(), history.length);
  history.push(cell);
  localStorage.setItem('history', JSON.stringify(history));
  renderGame();
  checkAvailabilityButton();

}

function currentTurn() {
  return lastTurn === circleTurn ? crossesTurn : circleTurn;
}

function disableClick() {
  orderedCells.forEach(cell => {
    cell.removeEventListener('click', clickHandler);
  })
}

function addClickHandler() {
  orderedCells.forEach(cell => {
    cell.addEventListener('click', clickHandler);
  });
}

function clearField() {
  let winner = getWinner();
  orderedCells.forEach(cell => {
    cell.classList.remove(crossesTurn);
    cell.classList.remove(circleTurn);
    cell.classList.remove('win');
    if (winner.scenario !== '') {
      cell.classList.remove(winner.scenario);
    }
  })
}

function checkAvailabilityButton() {
  if (!history.length){
    return;
  }
  redoDoButton.disabled = history[history.length - 1].undo === false;
  undoButton.disabled = history[0].undo === true;
}

function undoHandler() {
  lastTurn = currentTurn();
  addClickHandler();
  undoDisableDecorCells();
  
  for (let i = history.length - 1; i => 0; i--) {
    if (history[i].undo === false) {
      history[i].undo = true;
      localStorage.setItem('history', JSON.stringify(history));
      break;
    }
  }
  renderGame();
  checkAvailabilityButton();

}

  
function undoDisableDecorCells() {
  checkAvailabilityButton();
  wonTitle.classList.add('hidden');
  let winner = getWinner();
  if (winner.scenario === 'draw'){
    return;
  }
  winner.cells.forEach(cell => {
    cell.classList.remove('win');
    if (winner.scenario !== '') {
      cell.classList.remove(winner.scenario);
    }
  })
}

function redoHandler() {
  for (let i = 0; i < history.length; i++) {
    if (history[i].undo === true) {
      history[i].undo = false;
      localStorage.setItem('history', JSON.stringify(history));
      break;
    }
  }
    renderGame();
  checkAvailabilityButton();
    lastTurn = currentTurn();
  }
  


function getWinner() {
  let winners = [horizontal, vertical, diagonalLeft, diagonalRight, draw].map(fn => {
    return fn(orderedCells);
  });
  let winner = winners.find(winner => {
    return winner !== null;
  })

  return winner || {
    scenario: '',//diagonalLeft, diagonalRight, vertical, horizontal, draw
    winner: '',// r || ch
    cells: []
  };
}

function renderGameEnd(winner) {
  if (winner.scenario === '') {
    return
  }
  renderWinningDecor(winner);
  disableClick();
}

function renderWinningDecor(winner) {
  let scenario = winner.scenario;
  switch (scenario) {
    case "diagonal-left":
    case "diagonal-right":
    case "horizontal":
    case "vertical":
      wonMessage.textContent = `${winner.winner === crossesTurn ? "Crosses won!" : "Toes won!"}`;
      wonTitle.classList.remove('hidden');
      winner.cells.forEach(cell => {
        cell.classList.add('win');
        cell.classList.add(scenario);
      })
      break;

    case "draw":
      wonMessage.textContent = `It's a draw!`;
      wonTitle.classList.remove('hidden');
      break;
  }
}

function draw(orderedCells) {
  let draw = orderedCells.every(cell => {
    return getClass(cell) !== '';
  });
  if (draw){
    return {
      scenario: 'draw',
      winner: '',
      cells: '',
    }
  }

  return null;
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
      if (getClass(orderedCells[j]) !== cellClass) {
        badRow = true;
        break
      }
      result.push(orderedCells[j]);
    }
    if (!badRow) {
      return {
        draw: false,
        scenario: 'horizontal',
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
  if (cellClass === '') {
    return null;
  }
  let result = [];
  let badRow = false;
  for (let i = 0; i <= orderedCells.length; i++) {
    if (getClass(orderedCells[i]) !== cellClass) {
      badRow = true;
      break
    }
    result.push(orderedCells[i]);
    i += numberOfRows;
  }
  if (!badRow) {
    return {
      draw: false,
      scenario: 'diagonal-right',
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
  if (cellClass === '') {
    return null;
  }
  let result = [];
  let badRow = false;
  for (let i = diagonalStartPointIndex; i > 0; i++) {
    if (getClass(orderedCells[i]) !== cellClass) {
      badRow = true;
      break
    }
    result.push(orderedCells[i]);
    i -= numberOfRows;
  }
  if (!badRow) {
    return {
      draw: false,
      scenario: 'diagonal-left',
      winner: getClass(result[0]),
      cells: result,
    }
  }
  return null;
}

function getClass(cell) {
  if (cell.classList.contains('r')) {
    return 'r';
  }

  if (cell.classList.contains('ch')) {
    return 'ch'
  }

  return '';
}

function getOrderedCells(allCells) {
  let result = [];
  for (let i = 0; i < allCells.length; i++) {
    let cell = allCells[i];
    let cellID = cell.id;
    let ID = cellID.split('-')[1];
    let numID = Number.parseInt(ID, 10);
    result[numID] = cell;
  }

  return result;
}

window.addEventListener('storageModified', () => {
  if (!history){
    return;
  }
  history.forEach(cell => {
    if (cell.undo === true){
      return;
    }
    let cellElement = document.getElementById(cell.id);
    cellElement.classList.add(cell.lastTurn);
    lastTurn = currentTurn();
  })

  checkAvailabilityButton();
  let winner = getWinner();
  renderGameEnd(winner);
});

window.addEventListener('storage', () => {
  const cells = JSON.parse(localStorage.getItem('history'));
  if (!history.length) {
    return restartGame();
  }
  clearField();

  cells.forEach(cell => {
    let cellElement = document.getElementById(cell.id);
    cellElement.classList.add(cell.lastTurn);
  })
  lastTurn = currentTurn();
  checkAvailabilityButton();
  let winner = getWinner();
  renderGameEnd(winner);
});

window.addEventListener('load', () => {
  const storageModifiedEvent = new CustomEvent('storageModified');
  window.dispatchEvent(storageModifiedEvent);
});
