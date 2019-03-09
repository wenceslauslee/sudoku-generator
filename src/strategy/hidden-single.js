const constants = require('../constants');
const utils = require('../utils');

function solve(puzzle, clues, operations, trail) {
  const possible = clues.possible;
  const remaining = clues.remaining;
  var found = false;

  for (var i = 0; i < constants.size; i++) {
    for (let s1 of possible.rows[i]) {
      var count1 = 0;
      var index1 = -1;
      for (var i1 = 0; i1 < constants.size; i1++) {
        if (remaining[i][i1] !== null && remaining[i][i1].has(s1)) {
          count1++;
          if (count1 > 1) {
            break;
          } else {
            index1 = i1;
          }
        }
      }

      if (count1 === 1) {
        utils.update(puzzle, clues, i, index1, s1);
        operations.hiddenSingle = operations.hiddenSingle + 1;
        trail.push(`HS${i}${index1}:${s1}`);
        found = true;
        break;
      }
    }

    if (found) {
      break;
    }
  }
  if (found) {
    return;
  }

  for (var j = 0; j < constants.size; j++) {
    for (let s2 of possible.columns[j]) {
      var count2 = 0;
      var index2 = -1;
      for (var j1 = 0; j1 < constants.size; j1++) {
        if (remaining[j1][j] !== null && remaining[j1][j].has(s2)) {
          count2++;
          if (count2 > 1) {
            break;
          } else {
            index2 = j1;
          }
        }
      }

      if (count2 === 1) {
        utils.update(puzzle, clues, index2, j, s2);
        operations.hiddenSingle = operations.hiddenSingle + 1;
        trail.push(`HS${index2}${j}:${s2}`);
        found = true;
        break;
      }
    }

    if (found) {
      break;
    }
  }
  if (found) {
    return;
  }

  for (var k = 0; k < constants.size; k++) {
    for (let s3 of possible.grids[k]) {
      var count3 = 0;
      var indexi = -1;
      var indexj = -1;
      const rowStart = utils.getStartingRow(k);
      const colStart = utils.getStartingColumn(k);
      for (var k1 = rowStart; k1 < rowStart + 3; k1++) {
        for (var k2 = colStart; k2 < colStart + 3; k2++) {
          if (remaining[k1][k2] !== null && remaining[k1][k2].has(s3)) {
            count3++;
            if (count3 > 1) {
              break;
            } else {
              indexi = k1;
              indexj = k2;
            }
          }
        }
      }

      if (count3 === 1) {
        utils.update(puzzle, clues, indexi, indexj, s3);
        operations.hiddenSingle = operations.hiddenSingle + 1;
        trail.push(`HS${indexi}${indexj}:${s3}`);
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
