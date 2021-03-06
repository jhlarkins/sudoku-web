var $ = require('jquery-browserify');
var position = require('./position.js');
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
var allowEdits = false;

function toSquareId(row, column) {
    return '#square_' + row + '_' + column;
}

function startNewGame() {
    var row;
    var column;
    var value;
    var tr;
    var td;
    var tbody;

    $('#title').text('Sudoku');
    setNumberButtonsEnabled(false);
    setDeleteButtonEnabled(false);
    setResetButtonEnabled(false);

    board = sudoku(3).randomBoard();
    tbody = $('#board').find('tbody');
    tbody.empty();
    for (row = 0; row < board.size(); row++) {
        tr = $('<tr>');
        for (column = 0; column < board.size(); ++column) {
            td = $('<td>');
            td.attr('id', toSquareId(row, column).substr(1));
            td.addClass('square');
            if (row % board.base() === 0) {
                td.addClass('topSquare');
            }
            if (row % board.base() === board.base() - 1) {
                td.addClass('bottomSquare');
            }
            if (column % board.base() === 0) {
                td.addClass('leftSquare');
            }
            if (column % board.base() === board.base() - 1) {
                td.addClass('rightSquare');
            }
            if (board.isHardCoded(row, column)) {
                td.addClass(HARD_CODED_VALUE);
            }
            value = board.get(row, column);
            td.text(value !== null ? value : '');
            td.click(selectSquare.bind(null, row, column));
            tr.append(td);
        }
        tbody.append(tr);
    }
    allowEdits = true;
}

function selectSquare(row, column) {
    var editable;
    if (selected !== undefined &&
            !(selected.row === row && selected.column === column)) {
        $(toSquareId(selected.row, selected.column))
                .removeClass(SELECTED_VALUE);
    }
    $(toSquareId(row, column)).addClass(SELECTED_VALUE);
    editable = !board.isHardCoded(row, column);
    setNumberButtonsEnabled(allowEdits && editable);
    setDeleteButtonEnabled(allowEdits && editable && board.get(row, column) !== null);
    selected = position(row, column);
}

function checkGameStatus() {
    var i;
    var p;
    var status = board.statusSnapshot();
    setResetButtonEnabled(status.numFilled > board.hardCodedCount());
    $('.incorrectValue').removeClass('incorrectValue');
    for (i = 0; i < status.conflicts.length; i++) {
        p = status.conflicts[i];
        $(toSquareId(p.row, p.column)).addClass('incorrectValue');
    }
    if (status.allFilled && status.conflicts.length === 0) {
        endGame();
    }
}

function endGame() {
    $('#title').text('You Win!');
    setNumberButtonsEnabled(false);
    setDeleteButtonEnabled(false);
    setResetButtonEnabled(false);
    allowEdits = false;
}

function setNumberButtonsEnabled(enabled) {
    return $('input[id$="NumberButton"]').prop('disabled', !enabled);
}

function setDeleteButtonEnabled(enabled) {
    return $('#deleteButton').prop('disabled', !enabled);
}

function setResetButtonEnabled(enabled) {
    return $('#resetButton').prop('disabled', !enabled);
}

function resetGame() {
    var row;
    var column;
    for (row = 0; row < board.size(); row++) {
        for (column = 0; column < board.size(); column++) {
            if (!board.isHardCoded(row, column)) {
                board.set(row, column, null);
                $(toSquareId(row, column)).text('');
            }
        }
    }
    $('.incorrectValue').removeClass('incorrectValue');
    setResetButtonEnabled(false);
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
    if (allowEdits && (key === BACKSPACE || key === DELETE)) {
        board.set(selected.row, selected.column, null);
        square.text('');
        setNumberButtonsEnabled(false);
        setDeleteButtonEnabled(false);
    } else if (allowEdits && (ch >= ONE_CHAR && ch <= NINE_CHAR)) {
        num = ch - ZERO_CHAR;
        board.set(selected.row, selected.column, num);
        square.text(num);
        setNumberButtonsEnabled(true);
        setDeleteButtonEnabled(true);
    }
    checkGameStatus();
});

$('input[id$="NumberButton"]').click(function(event) {
    var square;
    var num = parseInt(event.target.value);
    if (selected === undefined ||
            board.isHardCoded(selected.row, selected.column)) {
        return;
    }
    square = $(toSquareId(selected.row, selected.column));
    board.set(selected.row, selected.column, num);
    square.text(num);
    setDeleteButtonEnabled(true);
    checkGameStatus();
});

$('#deleteButton').click(function() {
    var square;
    if (selected === undefined ||
            board.isHardCoded(selected.row, selected.column)) {
        return;
    }
    square = $(toSquareId(selected.row, selected.column));
    board.set(selected.row, selected.column, null);
    square.text('');
    setNumberButtonsEnabled(true);
    setDeleteButtonEnabled(false);
    checkGameStatus();
});

$('#resetButton').click(function() {
    resetGame();
});

$('#newGameButton').click(function() {
    startNewGame();
});

startNewGame();
