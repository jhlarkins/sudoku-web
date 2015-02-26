# Sudoku (sudoku-web)

This project is a Sudoku game for web browsers.

## Design

The game contains two major components:
   * sudoku.js
   * main.js

sudoku.js exports a factory method for creating Sudoku board objects. It tracks the state of the game board and evaluates whether the player has finishes and what squares are in conflict.

main.js is the JavaScript portion of the game UI. It captures player input and updates the game board and DOM.
