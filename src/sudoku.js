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
    prepareBoard(size, values);
    return {
        isHardCoded: function(row, column) {
            validateRowAndColumn(row, column);
            return values[row][column].hardCoded;
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
    };
}

function prepareBoard(size, values) {
    var row;
    var column;
    var value;
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
        }
    }
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
