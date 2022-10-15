/* eslint-disable operator-linebreak */
/* eslint-disable comma-dangle */
/* eslint-disable no-param-reassign */
/* eslint-disable no-plusplus */
const boardEl = document.querySelector('.board');
const boardSize = 3;

// Player objects
const Player = (name, piece) => {
  let turn = false;

  return { turn, name, piece };
};

const player1 = Player('Player 1', 'X');
const player2 = Player('Player 2', 'O');

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

    console.log('Intiialize', JSON.parse(JSON.stringify(board)));

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

  function addToBoard(piece, num, squareEl) {
    const row = Math.floor(num / 3);
    const col = num % 3;
    console.log(row, col);
    board[row][col] = piece;
    console.log('After add', JSON.parse(JSON.stringify(board)));
    if (piece === 'X') {
      squareEl.style.backgroundImage = "url('images/X.png')";
    } else {
      squareEl.style.backgroundImage = "url('images/O.png')";
    }
  }

  function gotWinner(player, index) {
    let cols = 0;
    let rows = 0;
    let diag1 = 0;
    let diag2 = 0;
    const row = Math.floor(index / 3);
    const col = index % 3;
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

  return { initializeBoard, addToBoard, gotWinner };
})();

// gameController object using module
const gameController = (() => {
  let currentPlayer = player1;
  player1.turn = true;
  let plays = 0;

  function trackInput() {
    const squaresEls = Array.from(document.querySelectorAll('.square'));
    squaresEls.forEach((squareEl) => {
      squareEl.addEventListener('click', () => {
        gameBoard.addToBoard(
          currentPlayer.piece,
          squaresEls.indexOf(squareEl),
          squareEl
        );
        // Disable the square once it has been clicked
        squareEl.style.pointerEvents = 'none';
        plays += 1;
        if (gameBoard.gotWinner(currentPlayer, squaresEls.indexOf(squareEl))) {
          alert(`${currentPlayer.name} won!`);
        } else {
          // Swap player turn
          currentPlayer = currentPlayer === player1 ? player2 : player1;
        }
      });
    });
  }

  return { trackInput };
})();

gameBoard.initializeBoard();

gameController.trackInput();
