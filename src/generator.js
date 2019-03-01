const _ = require('underscore');
const constants = require('./constants');

var count = 0;

function generate(numberOfPuzzles) {
  const start = new Date();
  const state = initializeState();
  generateInner(0, 0, state);
  const end = new Date() - start;
  console.log(`Done. ${count} puzzles created. Time elapsed: ${end}ms`);

  return convertState(state);
}

function generateInner(row, column, state) {
  if (row === constants.size) {
    count++;
    console.log(`Puzzle #${count} created.`);
    return;
  }

  const numbers = _.shuffle(_.range(9));
  for (var i = 0; i < constants.size; i++) {
    if (isValid(numbers[i], state, row, column)) {
      setState(numbers[i], state, row, column);
      var nextRow = row;
      var nextColumn = column + 1;
      if (nextColumn === constants.size) {
        nextRow = row + 1;
        nextColumn = 0;
      }
      generateInner(nextRow, nextColumn, state);
      if (count === 1) {
        return;
      }
      unsetState(numbers[i], state, row, column);
    }
  }
};

function initializeState() {
  return {
    rows: initializeDimension(),
    columns: initializeDimension(),
    grids: initializeDimension()
  };
}

function initializeDimension() {
  const array = [];
  for (var i = 0; i < constants.size; i++) {
    array.push(generateEmptyArray());
  }

  return array;
}

function generateEmptyArray() {
  const array = [];
  for (var i = 0; i < constants.size; i++) {
    array.push(null);
  }

  return array;
}

function isValid(number, state, row, column) {
  return state.rows[row][number] == null &&
    state.columns[column][number] == null &&
    state.grids[convertToGrid(row, column)][number] == null;
}

function setState(number, state, row, column) {
  state.rows[row][number] = column;
  state.columns[column][number] = row;
  state.grids[convertToGrid(row, column)][number] = convertToMiniGrid(row, column);
}

function unsetState(number, state, row, column) {
  state.rows[row][number] = null;
  state.columns[column][number] = null;
  state.grids[convertToGrid(row, column)][number] = null;
}

function convertToGrid(row, column) {
  return Math.floor(row / 3) * 3 + Math.floor(column / 3);
}

function convertToMiniGrid(row, column) {
  return (row % 3) * 3 + (column % 3);
}

function convertState(state) {
  const puzzle = [];
  const scramble = _.shuffle(_.range(1, 10));
  for (var i = 0; i < constants.size; i++) {
    const array = [];
    for (var j = 0; j < constants.size; j++) {
      array.push(null);
    }
    const input = state.rows[i];
    for (var k = 0; k < constants.size; k++) {
      array[input[k]] = scramble[k];
    }

    puzzle.push(array);
  }

  return puzzle;
}

module.exports = {
  generate: generate
};
