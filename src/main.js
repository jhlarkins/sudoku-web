var $ = require('jquery-browserify');
var sudoku = require('./sudoku.js');

var HARD_CODED_VALUE = 'hardCodedValue';
var SELECTED_VALUE = 'selectedValue';

var UP_ARROW = 38;
var DOWN_ARROW = 40;
var LEFT_ARROW = 37;
var RIGHT_ARROW = 39;

var BACKSPACE = 8;
var DELETE = 46;

var ZERO_CHAR = 48;
var ONE_CHAR = ZERO_CHAR + 1;
var NINE_CHAR = ZERO_CHAR + 9;

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

$(document).keydown(function(event) {
    var key = event.keyCode;
    if (selected === undefined) {
        return;
    } else if (key === UP_ARROW && selected.row > 0) {
        selectSquare(selected.row - 1, selected.column);
    } else if (key === DOWN_ARROW && selected.row < board.size() - 1) {
        selectSquare(selected.row + 1, selected.column);
    } else if (key === LEFT_ARROW && selected.column > 0) {
        selectSquare(selected.row, selected.column - 1);
    } else if (key === RIGHT_ARROW && selected.column < board.size() - 1) {
        selectSquare(selected.row, selected.column + 1);
    }
});

$(document).keypress(function(event) {
    var square;
    var key;
    var ch;
    var num;
    if (selected === undefined ||
            board.isHardCoded(selected.row, selected.column)) {
        return;
    }
    square = $(toSquareId(selected.row, selected.column));
    key = event.keyCode;
    ch = event.charCode;
    if (key === BACKSPACE || key === DELETE) {
        square.text('');
    } else if (ch >= ONE_CHAR && ch <= NINE_CHAR) {
        num = ch - ZERO_CHAR;
        board.set(selected.row, selected.column, num);
        square.text(num); 
    }
});

board = sudoku(3).randomBoard();
populateBoard();
