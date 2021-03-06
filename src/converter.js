const _ = require('underscore');
const constants = require('./constants');
const utils = require('./utils');

// Converts a puzzle (2D array) into an object to solve
function convert(puzzle) {
  const possible = {
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
    possible.rows.push(set);
  }

  for (var i2 = 0; i2 < constants.size; i2++) {
    const set = new Set(_.range(1, 10));
    for (var j2 = 0; j2 < constants.size; j2++) {
      if (puzzle[j2][i2] !== null) {
        set.delete(puzzle[j2][i2]);
      }
    }
    possible.columns.push(set);
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
    possible.grids.push(set);
  }

  const remaining = [];
  var count = 0;

  for (var r = 0; r < constants.size; r++) {
    const row = [];
    for (var c = 0; c < constants.size; c++) {
      if (puzzle[r][c] !== null) {
        row.push(null);
      } else {
        count = count + 1;
        row.push(intersect(possible.rows[r], possible.columns[c], possible.grids[utils.convertToGrid(r, c)]));
      }
    }
    remaining.push(row);
  }

  return {
    possible: possible,
    remaining: remaining,
    count: count,
    pseudoCount: 0
  };
}

function intersect(set1, set2, set3) {
  const array = [];
  for (let item of set1) {
    if (set2.has(item) && set3.has(item)) {
      array.push(item);
    }
  }

  return new Set(array);
}

module.exports = {
  convert: convert
};
