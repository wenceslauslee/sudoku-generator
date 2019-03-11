const _ = require('underscore');
const constants = require('../constants');
const utils = require('../utils');

function solve(puzzle, clues, operations, trail) {
  solveInGrid(clues, operations, trail);
  solveInRowColumn(clues, operations, trail);
}

// Find values in a grid that is confined to a row or column
function solveInGrid(clues, operations, trail) {
  const possible = clues.possible;
  const remaining = clues.remaining;

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
        const rowName = `LC:G${row[0]}xx:${s}`;
        if (operations.lockedCandidateSet.has(rowName)) {
          continue;
        }
        const performed = utils.removePossibleRowColumnInGrid(remaining, row[0], null, i, s);
        if (performed) {
          clues.pseudoCount++;
          operations.lockedCandidate = operations.lockedCandidate + 1;
          trail.push(rowName);
        }
        operations.lockedCandidateSet.add(rowName);
      }
      if (colEqual) {
        const colName = `LC:Gx${col[0]}x:${s}`;
        if (operations.lockedCandidateSet.has(colName)) {
          continue;
        }
        const performed = utils.removePossibleRowColumnInGrid(remaining, null, col[0], i, s);
        if (performed) {
          clues.pseudoCount++;
          operations.lockedCandidate = operations.lockedCandidate + 1;
          trail.push(colName);
        }
        operations.lockedCandidateSet.add(colName);
      }
    }
  }
}

// Find values in a row/column that is confined to a grid
function solveInRowColumn(clues, operations, trail) {
  const possible = clues.possible;
  const remaining = clues.remaining;

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
      const gridName1 = `LC:Rxx${grid1}:${s1}`;
      if (operations.lockedCandidateSet.has(gridName1)) {
        continue;
      }

      const performed = utils.removePossibleGridInRowColumn(remaining, i1, null, grid1, s1);
      if (performed) {
        clues.pseudoCount++;
        operations.lockedCandidate = operations.lockedCandidate + 1;
        trail.push(gridName1);
      }
      operations.lockedCandidateSet.add(gridName1);
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
      const gridName2 = `LC:Cxx${grid2}:${s2}`;
      if (operations.lockedCandidateSet.has(gridName2)) {
        continue;
      }

      const performed = utils.removePossibleGridInRowColumn(remaining, null, i2, grid2, s2);
      if (performed) {
        clues.pseudoCount++;
        operations.lockedCandidate = operations.lockedCandidate + 1;
        trail.push(gridName2);
      }
      operations.lockedCandidateSet.add(gridName2);
    }
  }
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
