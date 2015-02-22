var $ = require('jquery-browserify');
var sudoku = require('./sudoku.js');

var HARD_CODED_VALUE = 'hardCodedValue';
var SELECTED_VALUE = 'selectedValue';

var board;
var selected;

function toSquareId(row, column) {
    return '#square_' + row + '_' + column;
}

function populateBoard() {
    var row;
    var column;
    var square;
    var value;
    for (row = 0; row < board.size(); row++) {
        for (column = 0; column < board.size(); ++column) {
            square = $(toSquareId(row, column));
            if (board.isHardCoded(row, column)) {
                square.addClass(HARD_CODED_VALUE);
            }
            value = board.get(row, column);
            square.text(value !== null ? value : '');
            square.click(selectSquare.bind(null, row, column));
        }
    }
}

function selectSquare(row, column) {
    if (selected !== undefined &&
            !(selected.row === row && selected.column === column)) {
        $(toSquareId(selected.row, selected.column))
                .removeClass(SELECTED_VALUE);
    }
    $(toSquareId(row, column)).addClass(SELECTED_VALUE);
    selected = {row: row, column: column};
}

board = sudoku(3).randomBoard();
populateBoard();
