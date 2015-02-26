# Sudoku (sudoku-web)

This project is a Sudoku game for web browsers.

## Dependencies

This project has the following dependencies:
   * Node.js (http://nodejs.org) - for many other dependencies and running the test server
   * Jade (http://jade-lang.com) - for generating the HTML from template files
   * Sass (http://sass-lang.com) - for generating CSS
   * Browserify (http://browserify.org) - for building client-side JS modules
   * Watchify (https://github.com/substack/watchify) - for continuously building Browserify modules
   * jquery-browserify (https://www.npmjs.com/package/jquery-browserify) - for using jQuery is Browerify modules
   * Express (http://expressjs.com) - for implementingt the test server
   * Express Compression (https://github.com/expressjs/compression) - for gzipping the test server responses

## Design

The game contains two major components:
   * sudoku.js
   * main.js

sudoku.js exports a factory method for creating Sudoku board objects. It tracks the state of the game board and evaluates whether the player has finishes and what squares are in conflict. It does this instead of comparing the board to a pre-defined solution because some advanced boards have multiple solutions.

main.js is the JavaScript portion of the game UI. It captures player input and updates the game board and DOM.

## Building

To build the game, run:

```bash
./build [OPTIONS]
```

The two key options are:
    * --debug: When set, the output of the build is optimized for human readability
    * --watch: When set, the script keeps running, updating the output of the build when a source file changes. Use CTRL+C to close

## Testing

The source file server.js implements a simple node.js server that serves the output of the build. To run:

```bash
node src/server.js
```

## How to Play

Players select squares with either their mouse or touch screen. They can enter numbers using the on-screen keypad, and delete numbers with the on-screen delete button. The game also accepts number keys, backspace/delete, and arrows keys for navigation in browsers/platforms that support it.

Numbers defined by the puzzle appear in bold. As the player enters more numbers, ones that conflict with other numbers appear in red and italics (for users with limited color vision). Once the player has filled in a non-conflicting number for every square, the game ends.

## Browser Support

The game has been tested on the following platforms/browsers:
   * Linux Mint 17.1 + Firefox 35
   * Windows 7 + Internet Explorer 11
   * Windows 7 + Google Chrome 40
   * Android 5 + Google Chrome 40

I did not test iOS because I don't own such a device.
