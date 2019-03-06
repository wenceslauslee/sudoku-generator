const _ = require('underscore');
const constants = require('./constants');
const utils = require('./utils');

function solve(puzzle, clues, operations, trail) {
  const possible = clues.possible;
  const remaining = clues.remaining;
  var found = false;

  for (var i = 0; i < constants.size; i++) {
    for (let s of possible.grids[i]) {
      const rowStart = utils.getStartingRow(i);
      const colStart = utils.getStartingColumn(i);
      var row = [];
      var col = [];

      for (var j = rowStart; j < rowStart + 3; j++) {
        for (var k = colStart; k < colStart + 3; k++) {
          if (remaining[j][k] === null || !remaining[j][k].has(s)) {
            continue;
          }
          row.push(j);
          col.push(k);
        }
      }

      const rowEqual = _.every(row, r => r === row[0]);
      const colEqual = _.every(col, c => c === col[0]);
      if (rowEqual) {
        utils.updatePossible(clues, row[0], null, i, s);
        operations.lockedCandidate1 = operations.lockedCandidate1 + 1;
        trail.push(`LC1${row[0]}x:${s}`);
        found = true;
        break;
      }
      if (colEqual) {
        utils.updatePossible(clues, null, col[0], i, s);
        operations.lockedCandidate1 = operations.lockedCandidate1 + 1;
        trail.push(`LC1x${col[0]}:${s}`);
        found = true;
        break;
      }
    }

    if (found) {
      break;
    }
  }
}

module.exports = {
  solve: solve
};
