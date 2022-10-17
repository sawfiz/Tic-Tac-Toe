/* eslint-disable operator-linebreak */
/* eslint-disable comma-dangle */
/* eslint-disable no-param-reassign */
/* eslint-disable no-plusplus */
const boardEl = document.querySelector('.board');
const boardSize = 3;

function delay(time) {
  // eslint-disable-next-line no-promise-executor-return
  return new Promise((resolve) => setTimeout(resolve, time));
}

// Game board object using module
const gameBoard = (() => {
  let board = [];

  function initializeBoard() {
    // Reset the board array
    board = [
      ['', '', ''],
      ['', '', ''],
      ['', '', ''],
    ];
    // console.log('Intiialize', JSON.parse(JSON.stringify(board)));

    // Empty the board display
    boardEl.innerHTML = '';
    for (let row = 0; row < boardSize; row++) {
      for (let col = 0; col < boardSize; col++) {
        const squareEl = document.createElement('div');
        squareEl.classList.add('square');
        boardEl.appendChild(squareEl);
      }
    }
  }

  // Add a play into the board array and display in browser
  function addToBoard(piece, index) {
    console.log('gameBoard.addToBoard', index);
    const row = Math.floor(index / 3);
    const col = index % 3;
    board[row][col] = piece;

    const pieceEl = document.createElement('img');
    pieceEl.src = piece === 'X' ? 'images/X.png' : 'images/O.png';
    pieceEl.classList.add('piece');

    const squaresEls = Array.from(document.querySelectorAll('.square'));
    squaresEls[index].appendChild(pieceEl);
  }

  // Make the board listen for human player plays
  function getInput(callback) {
    const squaresEls = Array.from(document.querySelectorAll('.square'));
    squaresEls.forEach((squareEl) => {
      squareEl.addEventListener('click', () => {
        // Disable a square from being clicked on again
        squareEl.style.pointerEvents = 'none';
        const index = squaresEls.indexOf(squareEl);
        console.log('gameBoard.getInput(callback)', index);
        callback(index);
      });
    });
  }

  // Check if there is a winner
  function isWinner(player, index) {
    const row = Math.floor(index / 3);
    const col = index % 3;

    let cols = 0;
    let rows = 0;
    let diag1 = 0;
    let diag2 = 0;

    for (let i = 0; i < boardSize; i++) {
      if (board[i][col] === player.piece) cols++;
      if (board[row][i] === player.piece) rows++;
      if (board[i][i] === player.piece) diag1++;
      if (board[i][boardSize - i - 1] === player.piece) diag2++;
    }

    if (
      cols === boardSize ||
      rows === boardSize ||
      diag1 === boardSize ||
      diag2 === boardSize
    ) {
      return true;
    }
    return false;
  }

  // eslint-disable-next-line object-curly-newline
  return { initializeBoard, getInput, addToBoard, isWinner };
})();

// Player objects
const playerFactory = (name, piece) => {
  function makeMove(callback) {
    return gameBoard.getInput((index) => {
      console.log('playerFactory.makeMove()', index);
      callback(index);
    });
  }
  return { name, piece, makeMove };
};

const player1 = playerFactory('Player 1', 'X');
const player2 = playerFactory('Player 2', 'O');

// gameController object using module
const gameController = (() => {
  const player1El = document.querySelector('#player1');
  const player2El = document.querySelector('#player2');
  let currentPlayer = player1;
  let plays = 0;

  function swapPlayerTurn() {
    // Swap player turn
    currentPlayer = currentPlayer === player1 ? player2 : player1;
    // Swap player highlight in the display
    if (currentPlayer === player1) {
      player1El.classList.add('turn');
      player2El.classList.remove('turn');
    } else {
      player2El.classList.add('turn');
      player1El.classList.remove('turn');
    }
  }

  function playOneRound() {
    // Highlight the first player to play
    if (currentPlayer === player1) {
      player1El.classList.add('turn');
    } else {
      player2El.classList.add('turn');
    }

    // Wait for player to move
    currentPlayer.makeMove(async (index) => {
      console.log('index in gameController.game()', index);
      gameBoard.addToBoard(currentPlayer.piece, index);
      plays += 1;
      // Wait a bit for display to finish update before decide if the game is won
      await delay(100);

      if (gameBoard.isWinner(currentPlayer, index)) {
        alert(`${currentPlayer.name} won!`);
        restartGame();
      } else if (plays >= boardSize * boardSize) {
        alert('Tie!');
        restartGame();
      }
      swapPlayerTurn();
    });
  }

  function restartGame() {
    gameBoard.initializeBoard();
    plays = 0;
    playOneRound();
  }

  return { playOneRound };
})();

gameBoard.initializeBoard();

gameController.playOneRound();
