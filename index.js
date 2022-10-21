/* eslint-disable no-use-before-define */
/* eslint-disable object-curly-newline */
/* eslint-disable operator-linebreak */
/* eslint-disable comma-dangle */
/* eslint-disable no-param-reassign */
/* eslint-disable no-plusplus */

// Global constant
const BoardSize = 3;

// Global function
function delay(time) {
  // eslint-disable-next-line no-promise-executor-return
  return new Promise((resolve) => setTimeout(resolve, time));
}

// Game board object using module
const gameBoard = (() => {
  let board = [];

  function initializeBoard() {
    const boardEl = document.querySelector('.board');
    // Reset the board array
    board = [
      ['', '', ''],
      ['', '', ''],
      ['', '', ''],
    ];

    // Empty the board display, add empty squares
    boardEl.innerHTML = '';
    for (let row = 0; row < BoardSize; row++) {
      for (let col = 0; col < BoardSize; col++) {
        const squareEl = document.createElement('div');
        squareEl.classList.add('square');
        boardEl.appendChild(squareEl);
      }
    }
  }

  // Add a play into the board array and display in browser
  function addToBoard(marker, index) {
    const squaresEls = Array.from(document.querySelectorAll('.square'));
    const row = Math.floor(index / 3);
    const col = index % 3;
    board[row][col] = marker;

    const markerEl = document.createElement('img');
    markerEl.src = marker === 'X' ? 'images/X.png' : 'images/O.png';
    markerEl.classList.add('piece');

    squaresEls[index].appendChild(markerEl);
  }

  // Make the board listen for human player plays
  function getInput(callback) {
    const squaresEls = Array.from(document.querySelectorAll('.square'));
    squaresEls.forEach((squareEl) => {
      squareEl.addEventListener('click', () => {
        // Disable a square from being clicked on again
        // TODO: there is also a way to allow a listen fire only once
        squareEl.style.pointerEvents = 'none';
        const index = squaresEls.indexOf(squareEl);
        callback(index);
      });
    });
  }

  // Check if a player's move is a winning play
  function isWinner(player, index) {
    const row = Math.floor(index / 3);
    const col = index % 3;

    let cols = 0;
    let rows = 0;
    let diag1 = 0;
    let diag2 = 0;

    for (let i = 0; i < BoardSize; i++) {
      if (board[i][col] === player.marker) cols++;
      if (board[row][i] === player.marker) rows++;
      if (board[i][i] === player.marker) diag1++;
      if (board[i][BoardSize - i - 1] === player.marker) diag2++;
    }

    if (
      cols === BoardSize ||
      rows === BoardSize ||
      diag1 === BoardSize ||
      diag2 === BoardSize
    ) {
      player.wins += 1;
      return true;
    }
    return false;
  }

  function updatePlayerPanels(currentPlayer) {
    const player1ContainerEl = document.querySelector('#player1-container');
    const player2ContainerEl = document.querySelector('#player2-container');
    const player1NameEl = document.querySelector('#player1-name');
    const player2NameEl = document.querySelector('#player2-name');
    const player1TypeEl = document.querySelector('#player1-type');
    const player2TypeEl = document.querySelector('#player2-type');
    const player1ScoreEl = document.querySelector('#player1-score');
    const player2ScoreEl = document.querySelector('#player2-score');

    player1NameEl.innerText = player1.name;
    player2NameEl.innerText = player2.name;
    player1TypeEl.innerText = player1.type;
    player2TypeEl.innerText = `${player2.type} ${player2.level}`;
    player1ScoreEl.innerText = `Wins: ${player1.wins}`;
    player2ScoreEl.innerText = `Wins: ${player2.wins}`;

    if (currentPlayer === player1) {
      player1ContainerEl.classList.add('turn');
      player2ContainerEl.classList.remove('turn');
    } else {
      player2ContainerEl.classList.add('turn');
      player1ContainerEl.classList.remove('turn');
    }
  }

  // Check if a square is empty
  function isSquareEmpty(index) {
    const row = Math.floor(index / 3);
    const col = index % 3;
    return board[row][col] === '';
  }

  // Disable a particular square on the board from human player clicking
  function disableSquare(index) {
    const squaresEls = Array.from(document.querySelectorAll('.square'));
    squaresEls[index].style.pointerEvents = 'none';
  }

  // Getter function for the board array
  function getGameBoard() {
    return board;
  }

  // eslint-disable-next-line object-curly-newline
  return {
    getGameBoard,
    initializeBoard,
    getInput,
    addToBoard,
    isWinner,
    updatePlayerPanels,
    isSquareEmpty,
    disableSquare,
  };
})();

// Player objects
const playerFactory = (name, type, level, marker, wins) => {
  // Utility function for comparing if 3 cells are non-empty and equal
  function equals3(a, b, c) {
    return a === b && a === c && a !== '';
  }

  function checkWinner(board) {
    // Check rows
    for (let i = 0; i < BoardSize; i++) {
      if (equals3(board[i][0], board[i][1], board[i][2])) {
        return board[i][0];
      }
    }
    // Check columns
    for (let i = 0; i < BoardSize; i++) {
      if (equals3(board[0][i], board[1][i], board[2][i])) {
        return board[0][i];
      }
    }
    // Check diagnal
    if (equals3(board[0][0], board[1][1], board[2][2])) {
      return board[1][1];
    }
    // Check the other diagnal
    if (equals3(board[0][2], board[1][1], board[2][0])) {
      return board[1][1];
    }
    // Check for tie
    let occupiedSqures = 0;
    for (let i = 0; i < BoardSize; i++) {
      for (let j = 0; j < BoardSize; j++) {
        if (board[i][j] !== '') occupiedSqures++;
      }
    }
    if (occupiedSqures === 9) return 'tie'; // All squares are taken up
    return null; // Not a game terminating play
  }

  function easyMove() {
    // Computer player, level easy
    let move;
    while (true) {
      // Loop until a valid move is found
      move = Math.floor(Math.random() * 9);
      // If a square is empty, play here, and disable event listener here
      // so that a human player can no longer click on it.
      if (gameBoard.isSquareEmpty(move)) {
        gameBoard.disableSquare(move);
        return move;
      }
    }
  }

  function minimax(board, isMaximizing) {
    const scores = {
      O: 10,
      tie: 0,
      X: -10,
    };

    const result = checkWinner(board);
    if (result !== null) {
      return scores[result];
    }

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < BoardSize; i++) {
        for (let j = 0; j < BoardSize; j++) {
          if (board[i][j] === '') {
            board[i][j] = 'O';
            const score = minimax(board, false);
            bestScore = Math.max(score, bestScore);
            board[i][j] = '';
          }
        }
      }
      return bestScore;
      // eslint-disable-next-line no-else-return
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < BoardSize; i++) {
        for (let j = 0; j < BoardSize; j++) {
          if (board[i][j] === '') {
            board[i][j] = 'X';
            const score = minimax(board, true);
            bestScore = Math.min(score, bestScore);
            board[i][j] = '';
          }
        }
      }
      return bestScore;
    }
  }

  function hardMove() {
    let bestScore = -Infinity;
    let bestMove;
    const board = gameBoard.getGameBoard();

    for (let row = 0; row < BoardSize; row++) {
      for (let col = 0; col < BoardSize; col++) {
        // console.log(board);
        if (board[row][col] === '') {
          board[row][col] = 'O';
          const score = minimax(board, false);
          if (score > bestScore) {
            bestScore = score;
            bestMove = row * BoardSize + col;
          }
          board[row][col] = '';
        }
      }
    }
    gameBoard.disableSquare(bestMove);
    return bestMove;
  }

  function makeMove(callback) {
    // If human player, wait for a square to be clicked on the gameBoard
    if (this.type === 'human') {
      gameBoard.getInput((index) => callback(index));
    } else if (this.level === 'easy') {
      callback(easyMove()); // Computer makes a random move
    } else {
      // Computer makes a minimax move
      callback(hardMove());
    }
  }

  return { name, type, level, marker, wins, makeMove };
};

// Set up 2 players with default set up.  Can I move this to the gameController?
const player1 = playerFactory('Tom', 'human', '', 'X', 0);
const player2 = playerFactory('Jerry', 'human', '', 'O', 0);

// gameController object using module
const gameController = (() => {
  let numOfGames;
  let currentPlayer = player1;
  let games = 0;
  let ties = 0;
  let plays = 0;

  const boardHeadEl = document.querySelector('.board-head');
  const boardFootEl = document.querySelector('.board-foot');

  function swapPlayerTurn() {
    currentPlayer = currentPlayer === player1 ? player2 : player1;
  }

  function isRoundOver(index) {
    if (gameBoard.isWinner(currentPlayer, index)) {
      alert(`${currentPlayer.name} won!`);
      swapPlayerTurn(); // Make the loser go first next round.
      return true;
    }
    if (plays >= BoardSize * BoardSize) {
      ties++;
      boardFootEl.innerText = `Ties: ${ties}`;
      alert('Tie!');
      // In case of a tie game, the player to play first in the next round is
      // the second to go in this round, as there are 9 moves in a round.
      return true;
    }
    return false;
  }

  function playOneGame(callback) {
    boardHeadEl.innerText = `Game ${games}`;

    // This code gets executed in case computer is the frst to move
    // Then the rest of this function makes a computer move after each human move (click)
    if (currentPlayer.type === 'computer') {
      currentPlayer.makeMove((aiIndex) => {
        gameBoard.addToBoard(currentPlayer.marker, aiIndex);
        plays += 1;
        swapPlayerTurn();
        gameBoard.updatePlayerPanels(currentPlayer);
      });
    }

    // The code below waits for a human play (a click),
    // then followed by a computer play if there is a computer player
    currentPlayer.makeMove(async (index) => {
      gameBoard.addToBoard(currentPlayer.marker, index);
      plays += 1;
      // Wait a bit for display to finish update before decide if the game is won
      await delay(100);

      if (!isRoundOver(index)) {
        swapPlayerTurn();
        gameBoard.updatePlayerPanels(currentPlayer);
        // If a player is computer, the computer makes a move after each human play
        if (currentPlayer.type === 'computer') {
          currentPlayer.makeMove(async (aiIndex) => {
            await delay(100);
            gameBoard.addToBoard(currentPlayer.marker, aiIndex);
            plays += 1;
            await delay(100);
            if (!isRoundOver(aiIndex)) {
              swapPlayerTurn();
              gameBoard.updatePlayerPanels(currentPlayer);
            } else {
              callback();
            }
          });
        }
      } else {
        callback();
      }
    });
  }

  // Play a number of games in sequence
  async function newGame() {
    gameBoard.initializeBoard();
    gameBoard.updatePlayerPanels(player1);
    await delay(500);
    games += 1;
    playOneGame(async () => {
      plays = 0; // I do not like this, plays = 0 should be set in playOneRound()
      if (games < numOfGames) {
        newGame();
      } else {
        gameBoard.updatePlayerPanels(currentPlayer);
        await delay(100);
        alert('Game over!');
      }
    });
  }

  function game() {
    const gameSetupModal = document.querySelector('.game-setup-modal');
    const startBtn = document.querySelector('#start-game');
    const player1NameInputEl = document.querySelector('#player1-name-input');
    const player2NameInputEl = document.querySelector('#player2-name-input');
    const player2TypeInputEl = document.querySelector('#player2-type-input');
    const numOfGamesEl = document.querySelector('#number-of-games');
    gameSetupModal.showModal();
    startBtn.addEventListener('click', (e) => {
      e.preventDefault();
      player1.name = player1NameInputEl.value;
      player1.type = 'human';
      player2.name = player2NameInputEl.value;
      [player2.type, player2.level] = player2TypeInputEl.value.split(/\s+/);
      if (player2.type === 'human') player2.level = ''
      numOfGames = numOfGamesEl.value;
      gameSetupModal.close();
      newGame();
    });
  }

  return { game };
})();

gameController.game();

// TODO:
