const boardEl = document.querySelector('.board');
const boardSize = 3;

// Player objects
const Player = (piece) => {
  let turn = false;

  return { turn, piece };
};

const player1 = Player('X');
const player2 = Player('O');

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

  function addToBoard(piece, num, squareEl ) {
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

  return { initializeBoard, addToBoard };
})();

// gameController object using module
const gameController = (() => {
  let currentPlayer = player1;
  player1.turn = true;
  let plays = 0;

  function trackInput() {
    const squaresEls = Array.from(document.querySelectorAll('.square'));
    console.log(squaresEls);
    squaresEls.forEach((squareEl) => {
      squareEl.addEventListener('click', () => {
        console.log(currentPlayer.piece, squaresEls.indexOf(squareEl));

        gameBoard.addToBoard(currentPlayer.piece, squaresEls.indexOf(squareEl), squareEl);
        squareEl.style.pointerEvents = 'none';
        currentPlayer = currentPlayer === player1 ? player2 : player1;
      });
    });
  }

  return { trackInput };
})();

gameBoard.initializeBoard();

gameController.trackInput();
