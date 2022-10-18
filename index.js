/* eslint-disable no-use-before-define */
/* eslint-disable object-curly-newline */
/* eslint-disable operator-linebreak */
/* eslint-disable comma-dangle */
/* eslint-disable no-param-reassign */
/* eslint-disable no-plusplus */
const boardEl = document.querySelector('.board');
const boardSize = 3;
const NumOfRounds = 3;

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
    // console.log('gameBoard.addToBoard', index);
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
        // console.log('gameBoard.getInput(callback)', index);
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

  function updatePlayerPanels(currentPlayer) {
    const player1ContainerEl = document.querySelector('#player1-container');
    const player2ContainerEl = document.querySelector('#player2-container');
    const player1NameEl = document.querySelector('#player1-name');
    const player2NameEl = document.querySelector('#player2-name');

    player1NameEl.innerText = player1.name;
    player2NameEl.innerText = player2.name;

    if (currentPlayer === player1) {
      player1ContainerEl.classList.add('turn');
      player2ContainerEl.classList.remove('turn');
    } else {
      player2ContainerEl.classList.add('turn');
      player1ContainerEl.classList.remove('turn');
    }
  }

  function isSquareEmpty(index) {
    const row = Math.floor(index / 3);
    const col = index % 3;
    return board[row][col] === '';
  }

  // eslint-disable-next-line object-curly-newline
  return {
    initializeBoard,
    getInput,
    addToBoard,
    isWinner,
    updatePlayerPanels,
    isSquareEmpty,
  };
})();

// Player objects
const playerFactory = (name, type, piece) => {
  function makeMove(callback) {
    console.log('In player', this, name, 'Player type', this.type);
    if (this.type === 'human') {
      return gameBoard.getInput((index) => {
        // console.log('playerFactory.makeMove()', index);
        callback(index);
      });
    }
    // Computer player
    let index;
    while (true) {
      index = Math.floor(Math.random() * 9);
      if (gameBoard.isSquareEmpty(index)) {
        break;
      }
    }
    console.log('Computer move', index);
    callback(index);
  }

  return { name, type, piece, makeMove };
};
const player1 = playerFactory('Tom', 'human', 'X');
const player2 = playerFactory('Jerry', 'computer', 'O');

// gameController object using module
const gameController = (() => {
  let currentPlayer = player1;
  let rounds = 0;
  let plays = 0;

  function swapPlayerTurn() {
    // Swap player turn
    currentPlayer = currentPlayer === player1 ? player2 : player1;
    // Swap player highlight in the display
    gameBoard.updatePlayerPanels(currentPlayer);
  }

  function playOneRound() {
    console.log('Round', rounds);
    // Highlight the first player to play
    gameBoard.updatePlayerPanels(currentPlayer);
    plays = 0;
    console.log('current player in playOneRound', currentPlayer);
    // Wait for player to move then check for win
    makeOneMove(() => {
      if (plays < 9) {
        makeOneMove();
      } else {
        callback();
      }
    });
  }

  function makeOneMove(callback) {
    currentPlayer.makeMove(async (index) => {
      // console.log('current player in gamecontroller', currentPlayer);
      // console.log('index in gameController.game()', index);
      gameBoard.addToBoard(currentPlayer.piece, index);
      plays += 1;
      // console.log('plays', plays);
      // Wait a bit for display to finish update before decide if the game is won
      await delay(100);
      if (gameBoard.isWinner(currentPlayer, index)) {
        alert(`${currentPlayer.name} won!`);
        gameBoard.initializeBoard();
        callback();
        // return;
      }

      if (plays >= boardSize * boardSize) {
        alert('Tie!');
        gameBoard.initializeBoard();
        callback();
      }
      swapPlayerTurn();
      callback();
    });
  }

  // Play a number of games in sequence
  function newGame() {
    gameBoard.initializeBoard();
    gameBoard.updatePlayerPanels(player1);
    rounds += 1;
    playOneRound(() => {
      if (rounds < NumOfRounds) {
        newGame();
      } else {
        alert('Game over!');
      }
    });
  }

  return { newGame };
})();

gameController.newGame();
