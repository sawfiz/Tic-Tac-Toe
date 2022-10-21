# Tic-Tac-Toe
A project from the Javascript course, the Odin Project
# Library
[Project: Tic-Tac-Toe](https://www.theodinproject.com/lessons/node-path-javascript-tic-tac-toe) from the [Javascript Course](https://www.theodinproject.com/paths/full-stack-javascript/courses/javascript), [the Odin Project](https://www.theodinproject.com/)

## To-do
  - 

## Key new concepts used
- Assets
  - Preview on Mac can be used to make parts of a png file transparent

  
- HTML


- CSS
  - I really like the way WDS implmented Tic Tac Toe, where there is a preview of the X or O in a square before making a play.  I need to figure out how to do this for this project.
  - [Build Tic Tac Toe With JavaScript - Tutorial](https://www.youtube.com/watch?v=Y-GkMjUZsmM&t=945s)

  
- Javascript
  - Callback functions
    - There is a massive use of callback functions in this project, as many things are waiting for a previous happen before moving on.  
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

  - minmax alghorithm
    - [Tic Tac Toe: Understanding the Minimax Algorithm](https://www.neverstopbuilding.com/blog/minimax)
    - [Coding Challenge 154: Tic Tac Toe AI with Minimax Algorithm](https://www.youtube.com/watch?v=trKjYdBASyQ&t=151s)
  - Misc
    - Use `let` to declare an array if I want to reassign it's value, instead of `const`
    - Use `console.log(JSON.parse( JSON.stringify( board ) ))` to show array content, otherwise the console re-evaluates it's content at the time of clicking on the triangle
    - `removeEventListener()`, but I did not use it.  It was more effective to use `squareEl.style.pointerEvents = 'none';`
  - An interesting way to reduce querySelectors
    - `const el = (selector) => document.querySelector(selector);` 
    - `const board = el(".board");`

# Resources
- [Build a popup using Javascript](https://www.youtube.com/watch?v=MBaw_6cPmAw)  by WDS
- [Modal made easy - dialog = the easiest way to make a popup modal](https://www.youtube.com/watch?v=TAB_v6yBXIE) by Kevin Powell