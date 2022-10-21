/* eslint-disable no-use-before-define */
/* eslint-disable object-curly-newline */
/* eslint-disable operator-linebreak */
/* eslint-disable comma-dangle */
/* eslint-disable no-param-reassign */
/* eslint-disable no-plusplus */
const boardEl = document.querySelector('.board');
const boardSize = 3;
let NumOfGames = 3;

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
  function addToBoard(marker, index) {
    // console.log('gameBoard.addToBoard', index);
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
      if (board[i][col] === player.marker) cols++;
      if (board[row][i] === player.marker) rows++;
      if (board[i][i] === player.marker) diag1++;
      if (board[i][boardSize - i - 1] === player.marker) diag2++;
    }

    if (
      cols === boardSize ||
      rows === boardSize ||
      diag1 === boardSize ||
      diag2 === boardSize
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

  function isSquareEmpty(index) {
    const row = Math.floor(index / 3);
    const col = index % 3;
    return board[row][col] === '';
  }

  function disableSquare(index) {
    const squaresEls = Array.from(document.querySelectorAll('.square'));
    squaresEls[index].style.pointerEvents = 'none';
  }

  function getGameBoard() {
    return board;
  }

  // eslint-disable-next-line object-curly-newline
  return {
    board,
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

  function minmax() {}

  function hardMove(mark) {
    let bestScore = -Infinity;
    let move;
    let board = gameBoard.getGameBoard();
    console.log(marker);

    for (let row = 0; row < boardSize; row++) {
      for (let col = 0; col < boardSize; col++) {
        console.log(board);
        
        if (board[row][col] === '') {
          console.log(row, col);
          
          board[row][col] = mark;
          const score = 0;
          if (score > bestScore) {
            bestScore = score;
            move = row * boardSize + col;
          }
          board[row][col] = '';
        }
      }
    }
    gameBoard.disableSquare(move);
    return move;
  }

  function makeMove(callback) {
    // If human player, wait for a square to be clicked on the gameBoard
    if (this.type === 'human') {
      gameBoard.getInput((index) => callback(index));
    } else if (this.level === 'easy') {
      callback(easyMove()); // Computer makes a random move
    } else {
      // Computer makes a minmax move
      console.log(this.type, this.level, this.marker);

      callback(hardMove(this.marker));
    }
  }

  return { name, type, level, marker, wins, makeMove };
};

// Set up 2 players with default set up.  Can I move this to the gameController?
const player1 = playerFactory('Tom', 'human', '', 'X', 0);
const player2 = playerFactory('Jerry', 'human', '', 'O', 0);

// gameController object using module
const gameController = (() => {
  let currentPlayer = player1;
  let games = 0;
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
    if (plays >= boardSize * boardSize) {
      alert('Tie!');
      // In case of a tie game, the player to play first in the next round is
      // the second to go in this round, as there are 9 moves in a round.
      return true;
    }
    return false;
  }

  function playOneGame(callback) {
    console.log('Game', games, 'starts!');
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
              console.log('Round', games, 'over!');
              callback();
            }
          });
        }
      } else {
        console.log('Round', games, 'over!');
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
      console.log('in newGame, Round', games, 'over!');
      if (games < NumOfGames) {
        newGame();
      } else {
        gameBoard.updatePlayerPanels(currentPlayer);
        await delay(100);
        alert('Game over!');
        // game();
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
      // console.log(player2TypeInputEl);
      // console.log(player2.type, player2.level);
      // console.log(player1);
      // console.log(player2);

      NumOfGames = numOfGamesEl.value;
      gameSetupModal.close();
      newGame();
    });
  }

  return { game };
})();

gameController.game();

// TODO:
