/* eslint-disable operator-linebreak */
/* eslint-disable comma-dangle */
/* eslint-disable no-param-reassign */
/* eslint-disable no-plusplus */
const boardEl = document.querySelector('.board');
const boardSize = 3;

function delay(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

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

  function addToBoard(piece, row, col, squareEl) {
    board[row][col] = piece;
    console.log('After add', JSON.parse(JSON.stringify(board)));
    if (piece === 'X') {
      squareEl.style.backgroundImage = "url('images/X.png')";
    } else {
      squareEl.style.backgroundImage = "url('images/O.png')";
    }
  }

  function gotWinner(player, row, col) {
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
      const index = squaresEls.indexOf(squareEl);
      const row = Math.floor(index / 3);
      const col = index % 3;
      squareEl.addEventListener('click', async () => {
        gameBoard.addToBoard(currentPlayer.piece, row, col, squareEl);
        // Disable the square once it has been clicked
        squareEl.style.pointerEvents = 'none';
        plays += 1;
        await delay(100); // Wait a bit for display to finish update
        if (gameBoard.gotWinner(currentPlayer, row, col)) {
          alert(`${currentPlayer.name} won!`);
        } else if (plays >= boardSize * boardSize) {
          alert('Tie!');
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
