const _ = require('underscore');
const constants = require('../constants');
const utils = require('../utils');

function solve(puzzle, clues, operations, trail) {
  const possible = clues.possible;
  const remaining = clues.remaining;

  var found = solveInGrid(possible, remaining, operations, trail);

  if (found) {
    clues.pseudoCount++;
    return;
  }

  found = solveInRowColumn(possible, remaining, operations, trail);

  if (found) {
    clues.pseudoCount++;
  }
}

function solveInGrid(possible, remaining, operations, trail) {
  for (var i = 0; i < constants.size; i++) {
    for (let s of possible.grids[i]) {
      const rowStart = utils.getStartingRow(i);
      const colStart = utils.getStartingColumn(i);
      const row = [];
      const col = [];

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
        const rowName = `LC${row[0]}xx:${s}`;
        if (operations.lockedCandidateSet.has(rowName)) {
          continue;
        }
        utils.updatePossibleRowColumn(remaining, row[0], null, i, s);
        operations.lockedCandidate = operations.lockedCandidate + 1;
        operations.lockedCandidateSet.add(rowName);
        trail.push(rowName);
        return true;
      }
      if (colEqual) {
        const colName = `LCx${col[0]}x:${s}`;
        if (operations.lockedCandidateSet.has(colName)) {
          continue;
        }
        utils.updatePossibleRowColumn(remaining, null, col[0], i, s);
        operations.lockedCandidate = operations.lockedCandidate + 1;
        operations.lockedCandidateSet.add(colName);
        trail.push(colName);
        return true;
      }
    }
  }

  return false;
}

function solveInRowColumn(possible, remaining, operations, trail) {
  for (var i1 = 0; i1 < constants.size; i1++) {
    for (let s1 of possible.rows[i1]) {
      const row = [];
      for (var j1 = 0; j1 < constants.size; j1++) {
        if (remaining[i1][j1] === null || !remaining[i1][j1].has(s1)) {
          continue;
        }
        row.push(j1);
      }

      const group1 = groupIntoGrids(row);
      if (group1 === null) {
        continue;
      }

      const grid1 = Math.floor(i1 / 3) * 3 + group1;
      const gridName1 = `LCxx${grid1}:${s1}`;
      if (operations.lockedCandidateSet.has(gridName1)) {
        continue;
      }
      utils.updatePossibleGrid(remaining, i1, null, grid1, s1);
      operations.lockedCandidate = operations.lockedCandidate + 1;
      operations.lockedCandidateSet.add(gridName1);
      trail.push(`LCxx${grid1}:${s1}`);
      return true;
    }
  }

  for (var i2 = 0; i2 < constants.size; i2++) {
    for (let s2 of possible.columns[i2]) {
      const column = [];
      for (var j2 = 0; j2 < constants.size; j2++) {
        if (remaining[j2][i2] === null || !remaining[j2][i2].has(s2)) {
          continue;
        }
        column.push(j2);
      }

      const group2 = groupIntoGrids(column);
      if (group2 === null) {
        continue;
      }

      const grid2 = Math.floor(i2 / 3) + group2 * 3;
      const gridName2 = `LCxx${grid2}:${s2}`;
      if (operations.lockedCandidateSet.has(gridName2)) {
        continue;
      }
      utils.updatePossibleGrid(remaining, null, i2, grid2, s2);
      operations.lockedCandidate = operations.lockedCandidate + 1;
      operations.lockedCandidateSet.add(gridName2);
      trail.push(`LCxx${grid2}:${s2}`);
      return true;
    }
  }

  return false;
}

function groupIntoGrids(list) {
  const grids = _.groupBy(list, l => Math.floor(l / 3));
  const size = _.size(grids);

  if (size === 1) {
    return parseInt(Object.keys(grids)[0]);
  }

  return null;
}

module.exports = {
  solve: solve
};
