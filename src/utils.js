const constants = require('./constants');

function convertToGrid(row, column) {
  return Math.floor(row / 3) * 3 + Math.floor(column / 3);
}

function convertToGridInner(row, column) {
  return (row % 3) * 3 + (column % 3);
}

function getStartingRow(grid) {
  return Math.floor(grid / 3) * 3;
}

function getStartingColumn(grid) {
  return Math.floor(grid % 3) * 3;
}

function update(puzzle, clues, row, column, answer) {
  puzzle[row][column] = answer;

  // Update possible and remaining for specific location
  clues.possible.rows[row].delete(answer);
  clues.possible.columns[column].delete(answer);
  clues.possible.grids[convertToGrid(row, column)].delete(answer);
  const remaining = clues.remaining;
  remaining[row][column] = null;

  // Remove answer from other rows/columns/grids
  for (var i = 0; i < constants.size; i++) {
    if (remaining[row][i] !== null && remaining[row][i].has(answer)) {
      remaining[row][i].delete(answer);
    }
  }
  for (var j = 0; j < constants.size; j++) {
    if (remaining[j][column] !== null && remaining[j][column].has(answer)) {
      remaining[j][column].delete(answer);
    }
  }
  const startingRow = getStartingRow(convertToGrid(row, column));
  const startingCol = getStartingColumn(convertToGrid(row, column));
  for (var i1 = startingRow; i1 < startingRow + 3; i1++) {
    for (var j1 = startingCol; j1 < startingCol + 3; j1++) {
      if (remaining[i1][j1] !== null && remaining[i1][j1].has(answer)) {
        remaining[i1][j1].delete(answer);
      }
    }
  }

  clues.count = clues.count - 1;
}

module.exports = {
  convertToGrid: convertToGrid,
  convertToGridInner: convertToGridInner,
  getStartingRow: getStartingRow,
  getStartingColumn: getStartingColumn,
  update: update
};
