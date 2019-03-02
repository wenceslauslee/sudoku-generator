function convertToGrid(row, column) {
  return Math.floor(row / 3) * 3 + Math.floor(column / 3);
}

function convertToGridInner(row, column) {
  return (row % 3) * 3 + (column % 3);
}

function update(puzzle, clues, row, column, answer) {
  puzzle[row][column] = answer;
  clues.possible.rows[row].delete(answer);
  clues.possible.columns[column].delete(answer);
  clues.possible.grids[convertToGrid(row, column)].delete(answer);
  clues.remaining[row][column] = null;
  clues.count = clues.count - 1;
}

module.exports = {
  convertToGrid: convertToGrid,
  convertToGridInner: convertToGridInner,
  update: update
};
