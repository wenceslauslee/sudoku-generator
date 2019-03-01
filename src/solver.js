const _ = require('underscore');
const constants = require('./constants');

function solve(puzzle) {
  convert(puzzle);
  fullHouse(puzzle);
}

function fullHouse(puzzle) {
}

function convert(puzzle) {
  const board = {
    rows: [],
    columns: [],
    grids: []
  };

  for (var i1 = 0; i1 < constants.size; i1++) {
    const set = new Set(_.range(1, 10));
    const row = puzzle[i1];
    for (var j1 = 0; j1 < constants.size; j1++) {
      if (row[j1] !== null) {
        set.delete(row[j1]);
      }
    }
    board.rows.push(set);
  }

  for (var i2 = 0; i2 < constants.size; i2++) {
    const set = new Set(_.range(1, 10));
    for (var j2 = 0; j2 < constants.size; j2++) {
      if (puzzle[j2][i2] !== null) {
        set.delete(puzzle[j2][i2]);
      }
    }
    board.columns.push(set);
  }

  for (var i3 = 0; i3 < constants.size; i3++) {
    const set = new Set(_.range(1, 10));
    const startingRow = Math.floor(i3 / 3) * 3;
    const endingRow = Math.floor(i3 / 3) * 3 + 3;
    const startingCol = Math.floor(i3 % 3) * 3;
    const endingCol = Math.floor(i3 % 3) * 3 + 3;
    for (var j3 = startingRow; j3 < endingRow; j3++) {
      for (var k3 = startingCol; k3 < endingCol; k3++) {
        if (puzzle[j3][k3] !== null) {
          set.delete(puzzle[j3][k3]);
        }
      }
    }
    board.grids.push(set);
  }

  console.log(board);
  return board;
}

module.exports = {
  solve: solve
};
