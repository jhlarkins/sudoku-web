var $ = require('jquery-browserify');
var sudoku = require('./sudoku.js');

var board;

function toSquareId(row, column) {
    return 'square_' + row + '_' + column;
}

function populateBoard() {
    var row;
    var column;
    var element;
    var value;
    for (row = 0; row < board.size(); row++) {
        for (column = 0; column < board.size(); ++column) {
            element = $('#' + toSquareId(row, column));
            if (board.isHardCoded(row, column)) {
            }
            value = board.get(row, column);
            element.text(value !== null ? value : '');
        }
    }
}

board = sudoku(3).randomBoard();
populateBoard();
