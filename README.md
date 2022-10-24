# Tic-Tac-Toe
A project from the Javascript course, the Odin Project
# Library
[Project: Tic-Tac-Toe](https://www.theodinproject.com/lessons/node-path-javascript-tic-tac-toe) from the [Javascript Course](https://www.theodinproject.com/paths/full-stack-javascript/courses/javascript), [the Odin Project](https://www.theodinproject.com/)

## Introduction
  - A classic school yard game.  Two players take turns to mark a square on a 3x3 board.  Whichever player first gets 3 markers in a row wins.
  - The game starts with a game setup popup where a player can 
    - pick an oppoent.  The options are:
      - a human player
      - a computer player that makes random plays
      - a computer player that uses the minimax algorithm to be unbeatable
    - pick number of games to play.
      - Each player's wins and the ties are tracked
  - When all the games are played, a popup shows up and allows the player to restart.

## Key new concepts used
- Assets
  - The built-in Preview app on Mac can be used to make parts of a png file transparent
  
- Javascript
  - Callback functions
    - I made massive use of callback functions in this project, as many things are waiting for a previous event to complete before moving on.  e.g. waiting for a player move, waiting for a game to finish before starting a new one, waiting for all games to finish before showing a Game Over popup.
    - A very good video tutorial from ColorCode [Async JavaScript & Callback Functions -- Tutorial for Beginners](https://www.youtube.com/watch?v=QSqc6MMS6Fk&list=PL1PqvM2UQiMoGNTaxFMSK2cih633lpFKP&index=11)
  - Factory functions
    - if you need multiples of something, create them with factories
    - [What is Factory Function in JavaScript? - JS Tutorial](https://www.youtube.com/watch?v=lE_79wkP-1U&list=PL1PqvM2UQiMoGNTaxFMSK2cih633lpFKP&index=3)
    - [What is Constructor Function in JavaScript? - JS Tutorial](https://www.youtube.com/watch?v=I37qHG0DxmE&list=PL1PqvM2UQiMoGNTaxFMSK2cih633lpFKP&index=4)
    - [Factory Function vs. Constructor vs. Class - JavaScript Tutorial](https://www.youtube.com/watch?v=fbuyliXlDGI&list=PL1PqvM2UQiMoGNTaxFMSK2cih633lpFKP&index=5)
    ```js
    // Factory functions for anything of which you need multiple (e.g., players)*/
    const FactoryFunction = (argument1, argument2) => {
        const _privateVariable = 'I stay within function';
        const _privateFunction = () => {};
        const variable = 'I will be returned to the outside of function';
        const function = () => {};
        return {argument1, argument2, variable, function}
    }
    // (returns an object when called)
    ```
  - Module Patterns
    - if you only ever need ONE of something use a module
    - It is an IIFE function
    ```js
    // Modules for something of which you do not need copies
    const Module = (function() {
        const _privateVariable = "foo";
        const variable = "bar";
        function _privateMethod() {
            console.log(_privateProperty);
        }
        function publicMethod() {
            _privateMethod();
        }
        return {
        variable,
        publicMethod
        };
    })();
    ```
  - Key chalenges
    - There are 3 types of objects, player, gameBoard, gameController.  It is very important to decide which methods each of the objects own, so that the code be scalable
    - As players can be human or computer, we need to consider
      - human vs. human
      - human vs. computer, where human makes the first move, and computer responses to each human move
      - computer vs. human, so the computer makes the first move, then computer reponses to each human move
      - play a number of games, and alternate the player to make the first move
        - a loser of a game goes first in the next game
        - in a tied game, the player to make the first move is naturally the alternative player

  - minimax alghorithm
    - [Tic Tac Toe: Understanding the Minimax Algorithm](https://www.neverstopbuilding.com/blog/minimax)
    - [Coding Challenge 154: Tic Tac Toe AI with Minimax Algorithm](https://www.youtube.com/watch?v=trKjYdBASyQ&t=151s)

  - Misc
    - Use `let` to declare an array if I want to reassign it's value, instead of `const`
    - Use `console.log(JSON.parse( JSON.stringify( board ) ))` to show array content, otherwise the console re-evaluates it's content at the time of clicking on the triangle
    - `removeEventListener()`, but I did not use it.  It was more effective to use `squareEl.style.pointerEvents = 'none';`
    - There is also a way to tell the eventlistener to fire only once with {once}
  - An interesting way to reduce querySelectors
    - `const el = (selector) => document.querySelector(selector);` 
    - `const board = el(".board");`

# Resources


# Outstanding issues
- I used a lot of callbacks, I wonder if it is all necessary, given that callbacks has not been covered specifically at this point of the course
- The code in gameController() to run a number of games feels very clunky to me.  I wonder how it can be optimized.
- Restart works, but it results in a console error on the second restart.  I think it is because I am calling game() recursively.  I will need to find a solution for it.
  -- One option is to use `window.location.reload()` to force a reload of the page.  But this seem very brutal forced.

# Ideas for future improvements
  - I really like the way WDS implmented Tic Tac Toe [Build Tic Tac Toe With JavaScript - Tutorial](https://www.youtube.com/watch?v=Y-GkMjUZsmM&t=945s), where there is a preview of the X or O in a square before making a play.  I need to figure out how to do this for this project.
    - Kyle made the X and O markers using CSS ::before and ::after pseudo elements.
    - I use pngs for the marks
  - Minimax
    - Optimize the minimax() algorithm.  There seem to be a lot of repeated code.
    - I can implement using depth as a way to optimize computer move.  Although there are cases where this can be benefitial, I can not identify a specific case at the moment, so I won't know if the algorithm works.
    - There is also Alpha-pruning to improve efficiency, but I will leave it for later...