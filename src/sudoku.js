var position = require('./position.js');

function createBoard(base, values) {
    var size = base * base;
    var validateRowAndColumn = function(row, column) {
        if (row < 0 || row >= size) {
            throw new Error('Row must be between 0 and ' + size + ', got ' +
                    row);
        } else if (column < 0 || column >= size) {
            throw new Error('Column must be between 0 and ' + size +
                    ', got ' + column);
        }
    };
    var hardCodedCount = prepareBoard(size, values);
    return {
        base: function() {
            return base;
        },
        isHardCoded: function(row, column) {
            validateRowAndColumn(row, column);
            return values[row][column].hardCoded;
        },
        hardCodedCount: function() {
            return hardCodedCount;
        },
        get: function(row, column) {
            validateRowAndColumn(row, column);
            return values[row][column].value;
        },
        set: function(row, column, value) {
            validateRowAndColumn(row, column);
            if (values[row][column].hardCoded) {
                throw new Error('Value at (' + row + ',' + column +
                        ' cannot be set');
            }
            values[row][column].value = value;
        },
        size: function() {
            return size;  
        },
        statusSnapshot: evaluateStatus.bind(null, base, size, values)
    };
}

function prepareBoard(size, values) {
    var row;
    var column;
    var value;
    var hardCodedCount = 0;
    if (values.length !== size) {
        throw new Error(values.length + ' does not match size ' + size);
    }
    for (row = 0; row < size; row++) {
        if (values[row].length !== size) {
            throw new Error('Row ' + row + ' length ' + values[row].length +
                    ' does not match size ' + size);
        }
        for (column = 0; column < size; column++) {
            value = values[row][column];
            values[row][column] = {
                value: value !== 0 ? value : null,
                hardCoded: value !== 0
            };
            hardCodedCount += value !== 0 ? 1 : 0;
        }
    }
    return hardCodedCount;
}

function evaluateStatus(base, size, values) {
    var numFilled = countFilledSquares(values);
    return {
        allFilled: countFilledSquares(values) === size * size,
        conflicts: findAllConflicts(base, size, values),
        numFilled: numFilled
    };
}

function countFilledSquares(values) {
    var row;
    var column;
    var total = 0;
    for (row = 0; row < values.length; row++) {
        for (column = 0; column < values[row].length; column++) {
            if (values[row][column].value !== null) {
                total++;
            }
        }
    }
    return total;
}

function findAllConflicts(base, size, values) {
    var conflicts = [];

    function findRowConflicts() {
        var row;
        var column;
        var value;
        var visited;
        for (row = 0; row < size; row++) {
            visited = {};
            for (column = 0; column < size; column++) {
                value = values[row][column].value;
                if (value === null) {
                    continue;
                } else if (!(value in visited)) {
                    visited[value] = [];
                }
                visited[value].push(position(row, column));
            }
            processConflictingPositions(visited);
        }
    }
    
    function findColumnConflicts() {
        var row;
        var column;
        var value;
        var visited;
        for (column = 0; column < size; column++) {
            visited = {};
            for (row = 0; row < size; row++) {
                value = values[row][column].value;
                if (value === null) {
                    continue;
                } else if (!(value in visited)) {
                    visited[value] = [];
                }
                visited[value].push(position(row, column));
            }
            processConflictingPositions(visited);
        }
    }

    function findAllSubBoardConflicts() {
        var row;
        var column;
        for (row = 0; row < size; row += base) {
            for (column = 0; column < size; column += base) {
                findSubBoardConflicts(row, column);
            }
        }
    }

    function findSubBoardConflicts(rowStart, columnStart) {
        var row;
        var column;
        var value;
        var visited = {};
        for (row = rowStart; row < rowStart + base; row++) {
            for (column = columnStart; column < columnStart + base; column++) {
                value = values[row][column].value;
                if (value === null) {
                    continue;
                } else if (!(value in visited)) {
                    visited[value] = [];
                }
                visited[value].push(position(row, column));
            }
        }
        processConflictingPositions(visited);
    }

    function processConflictingPositions(visited) {
        var n;
        for (n = 1; n <= size; n++) {
            if (n in visited && visited[n].length > 1) {
                conflicts = conflicts.concat(visited[n]);
            }
        }
    }

    findRowConflicts();
    findColumnConflicts();
    findAllSubBoardConflicts();

    return conflicts;
}

function createRandomBoard(base) {
    if (base !== 3) {
        throw new Error('Only base 3 boards supported right now');
    }
    return createBoard(base, [
        [5,3,0,0,7,0,0,0,0],
        [6,0,0,1,9,5,0,0,0],
        [0,9,8,0,0,0,0,6,0],
        [8,0,0,0,6,0,0,0,3],
        [4,0,0,8,0,3,0,0,1],
        [7,0,0,0,2,0,0,0,6],
        [0,6,0,0,0,0,2,8,0],
        [0,0,0,4,1,9,0,0,5],
        [0,0,0,0,8,0,0,7,9]]);
}

module.exports = function(base) {
    return {
        randomBoard: createRandomBoard.bind(null, base)
    };
}
