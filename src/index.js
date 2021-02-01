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
  lastTurn = circleTurn;
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
  let cells = history.map(cell => {
    return {
      id: cell.id,
      cl: getClass(cell),
    }
  })
  localStorage.setItem('history', JSON.stringify(cells));
  console.log(history);
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

function undoClick() {
  lastTurn = currentTurn();
  redoDoButton.disabled = false;
  wonTitle.classList.add('hidden');
  addClickHandler();
  undoDisableDecorCells();
  let undoElement = history.pop();
  localStorage.setItem('history', JSON.stringify(history));
  console.log(history);
  undoHistory.push(undoElement);
  undoElement.classList.remove(currentTurn());

  if (!history.length) {
    unDoButton.disabled = true;
  }
}

function undoDisableDecorCells() {
  let winner = getWinner();
  winner.cells.forEach(cell => {
    cell.classList.remove('win');
    if (winner.scenario !== '') {
      cell.classList.remove(winner.scenario);
    }
  })
}

function redoClick() {
  let undoElement = undoHistory.pop();
  undoElement.classList.add(currentTurn());
  history.push(undoElement);
  localStorage.setItem('history', JSON.stringify(history));
  console.log(history);
  let winner = getWinner();
  renderGameEnd(winner);

  if (!undoHistory.length) {
    redoDoButton.disabled = true;
  }

  if (history.length) {
    unDoButton.disabled = false;
  }

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
    return cell.classList.contains(crossesTurn) || cell.classList.contains(circleTurn);
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

