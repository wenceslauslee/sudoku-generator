const _ = require('underscore');
const constants = require('../constants');
const utils = require('../utils');

function solve(puzzle, clues, operations, trail) {
  const possible = clues.possible;

  for (var i = 0; i < constants.size; i++) {
    if (possible.rows[i].size === 1) {
      const column = _.findIndex(puzzle[i], r => r === null);
      const answer = possible.rows[i].values().next().value;
      utils.update(puzzle, clues, i, column, answer);
      clues.pseudoCount++;
      operations.fullHouse = operations.fullHouse + 1;
      trail.push(`FH:R${i}${column}:${answer}`);
    }
  }

  for (var j = 0; j < constants.size; j++) {
    if (possible.columns[j].size === 1) {
      var row;
      for (var j1 = 0; j1 < constants.size; j1++) {
        if (puzzle[j1][j] === null) {
          row = j1;
          break;
        }
      }
      const answer = possible.columns[j].values().next().value;
      utils.update(puzzle, clues, row, j, answer);
      clues.pseudoCount++;
      operations.fullHouse = operations.fullHouse + 1;
      trail.push(`FH:C${row}${j}:${answer}`);
    }
  }

  for (var k = 0; k < constants.size; k++) {
    if (possible.grids[k].size === 1) {
      var row1;
      var column1;
      const rowStart = Math.floor(k / 3) * 3;
      const colStart = Math.floor(k % 3) * 3;
      for (var k1 = rowStart; k1 < rowStart + 3; k1++) {
        for (var k2 = colStart; k2 < colStart + 3; k2++) {
          if (puzzle[k1][k2] === null) {
            row1 = k1;
            column1 = k2;
            break;
          }
        }
      }
      const answer = possible.grids[k].values().next().value;
      utils.update(puzzle, clues, row1, column1, answer);
      clues.pseudoCount++;
      operations.fullHouse = operations.fullHouse + 1;
      trail.push(`FH:G${row1}${column1}:${answer}`);
    }
  }
}

module.exports = {
  solve: solve
};
