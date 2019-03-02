const constants = require('./constants');
const utils = require('./utils');

function solve(puzzle, clues, operations, trail) {
  const remaining = clues.remaining;
  var found = false;
  for (var i = 0; i < constants.size; i++) {
    for (var j = 0; j < constants.size; j++) {
      if (remaining[i][j] !== null && remaining[i][j].size === 1) {
        const answer = remaining[i][j].values().next().value;
        utils.update(puzzle, clues, i, j, answer);
        operations.nakedSingle = operations.nakedSingle + 1;
        trail.push(`NS${i}${j}:${answer}`);
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
