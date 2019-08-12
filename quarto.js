// INITIALIZE GAME VARIABLES
let gamePhase = 'choose';
let activePlayer = 'A';

// what if I create a grid of coordinates
let gameCoords = [
  ['A1', null], ['A2', null], ['A3', null], ['A4', null],
  ['B1', null], ['B2', null], ['B3', null], ['B4', null],
  ['C1', null], ['C2', null], ['C3', null], ['C4', null],
  ['D1', null], ['D2', null], ['D3', null], ['D4', null],
];

// create a list of winning sets???
let winningRows = [
  ['A1', 'A2', 'A3', 'A4'],
  ['B1', 'B2', 'B3', 'B4'],
  ['C1', 'C2', 'C3', 'C4'],
  ['D1', 'D2', 'D3', 'D4'],
];
let winningColumns = [
  ['A1', 'B1', 'C1', 'D1'],
  ['A2', 'B2', 'C2', 'D2'],
  ['A3', 'B3', 'C3', 'D3'],
  ['A4', 'B4', 'C4', 'D4'],
];
let winningDiagonals = [
  ['A1', 'B2', 'C3', 'D4'],
  ['A4', 'B3', 'C2', 'D1'],
];
let winningSquares = [
  ['A1', 'B1', 'A2', 'B2'],
  ['A2', 'B2', 'A3', 'B3'],
  ['A3', 'B3', 'A4', 'B4'],
  ['B1', 'C1', 'B2', 'C2'],
  ['B2', 'C2', 'B3', 'C3'],
  ['B3', 'C3', 'B4', 'C4'],
  ['C1', 'D1', 'C2', 'D2'],
  ['C2', 'D2', 'C3', 'D3'],
  ['C3', 'D3', 'C4', 'D4'],
  ['A1', 'C1', 'A3', 'C3'],
  ['A2', 'C2', 'A4', 'C4'],
  ['B1', 'D1', 'B3', 'D3'],
  ['B2', 'D2', 'B4', 'D4'],
  ['A1', 'A4', 'D1', 'D4'],
];
let winningSets = winningRows.concat(winningColumns, winningDiagonals);

// DECLARE VARIABLES FROM DOM HERE //
let startingPieces = document.querySelectorAll('.inactive .piece');
let activeSpot = document.getElementById('activespot');
let inactiveSpot = document.getElementsByClassName('inactive')[0];
let banner = document.getElementsByClassName('banner')[0];
let boardSpots = document.getElementsByClassName('boardspot')

// helper functions convert ID to "tuple" arrays and vice-versa
function idToTuple(id) { // id is text e.g. p0101
  let tuple = [];
  let value = null;
  for (i = 1; i < id.length; i++) { // ignore the starting 'p'
    value = id.slice(i, i + 1);
    tuple.push(parseInt(value));
  }

  return tuple;
}

function tupleToId(tuple) {
  let id = 'p';
  for (i = 0; i < tuple.length; i++) {
    id = id.concat(tuple[i]);
  }

  return id;
}

function updateBannerText() {
  // update banner text based on turn phase
  let newText = '';
  if (gamePhase === 'place') {
    newText = 'Player ' + activePlayer + ', place the active piece!';
  } else if (gamePhase === 'choose') {
    newText = 'Player ' + activePlayer + ', choose a piece!';
  } else if (gamePhase === 'win') {
    newText = 'Player ' + activePlayer + ' wins! Click here to reset.';
  } else if (gamePhase === 'draw') {
    newText = 'The match ended in a draw! Click here to reset.';
  }

  banner.innerHTML = newText;
}

function updateBannerColor() {
  // update the banner color based on player turn
  if (activePlayer === 'A') {
    banner.style.backgroundColor = 'lightgreen';
  } else if (activePlayer === 'B') {
    banner.style.backgroundColor = 'pink';
  } else if (activePlayer === null) {
    banner.style.backgroundColor = 'lightgrey';
  }
}

function changePlayer() {
  // switch players and update the banner color accordingly
  if (activePlayer === 'A') {
    activePlayer = 'B';
  } else if (activePlayer === 'B') {
    activePlayer = 'A';
  }

  updateBannerColor();
  gamePhase = 'place'; // New player has to place the active piece
  updateBannerText();
}

function findBoardspot(id) { // id is text
  for (f = 0; f < gameCoords.length; f++) {
    if (gameCoords[f][0] === id) {
      return f;
    }
  }
}

function checkWinConditions(newSpot) { // newSpot format e.g. 'A2'
  // for every winning combination, filter for relevant/eligible ones
  let eligibleSets = [];
  for (i = 0; i < winningSets.length; i++) {
    if (winningSets[i].includes(newSpot)) {
      eligibleSets.push(winningSets[i]);
    }
  }

  for (i = 0; i < eligibleSets.length; i++) {
    // for every eligible combination, check for 4-in-a-row
    let set = eligibleSets[i];
    let compare = [];
    for (j = 0; j < set.length; j++) {
      let attributes = gameCoords[findBoardspot(set[j])][1];
      if (attributes !== null) {
        compare.push(attributes);
      }
    }

    if (compare.length === 4) {
      for (j = 0; j < 4; j++) {
        let val = compare[0][j];
        if (val === compare[1][j] && val === compare[2][j] && val === compare[3][j]) {
          for (k = 0; k < set.length; k++) {
            // highlight winning squares in yellow. This part works to loop.
            let square = document.getElementById(set[k]);
            square.style.backgroundColor = 'yellow';
          }

          return true;
        }
      }
    }
  }

  return false;
}

// testing lines

// BELOW THIS LINE - GAME OPERATIONS //

// Event listeners for choosing pieces
for (i = 0; i < startingPieces.length; i++) {
  let elem = startingPieces[i];
  elem.addEventListener('click', function () {
    if (gamePhase === 'choose') {
      // move the node to the active spot
      activeSpot.appendChild(elem);

      // change phase and player
      changePlayer();
    }
  });
}

// Event listeners for placing pieces
for (i = 0; i < boardSpots.length; i++) {
  let elem = boardSpots[i];
  elem.addEventListener('click', function () {
    // locate which board square this is
    let index = findBoardspot(elem.id);

    // Check to make sure the space is empty
    if (gameCoords[index][1] === null) {

      // locate the active piece
      let activePiece = document.querySelectorAll('#activespot .piece')[0];

      // convert id to tuple and save in the gameCoords grid
      gameCoords[index][1] = idToTuple(activePiece.id);

      // move the active piece to the board square
      elem.appendChild(activePiece);

      // check for winning conditions
      if (checkWinConditions(elem.id)) {
        gamePhase = 'win';
      } else if (inactiveSpot.children.length === 0) { // check to see if all pieces are used
        gamePhase = 'draw';
        activePlayer = null;
        updateBannerColor();
      } else { // if no win, change the turn phase to 'choose'
        gamePhase = 'choose';
      }

      updateBannerText();
    }
  });
}

// Event listener for game reset
banner.addEventListener('click', function () {
  // check for either a win or all pieces placed
  if (gamePhase === 'win' || gamePhase === 'draw') {
    // replace the pieces to the inactive area
    for (let piece of startingPieces) {
      inactiveSpot.appendChild(piece);
    }

    // reset game variables and banner display
    activePlayer = 'A';
    gamePhase = 'choose';
    updateBannerText();
    updateBannerColor();

    // clear out all the data in the coordinate grid
    for (let cell of gameCoords) {
      cell[1] = null;
    }

    // color all the spots white again
    for (let spot of boardSpots) {
      spot.style.backgroundColor = 'initial';
    }
  }
});
