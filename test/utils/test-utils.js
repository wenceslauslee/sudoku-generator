const constants = require('../../src/constants');

// Converts a string representation into a puzzle
function convertStringToPuzzle(puzzleString) {
  if (puzzleString.length !== constants.size * constants.size) {
    throw new Error(`Puzzle does not have correct length. (${puzzleString.length})`);
  }

  const puzzle = [];
  for (var i = 0; i < constants.size; i++) {
    const row = [];
    for (var j = 0; j < constants.size; j++) {
      const position = i * 9 + j;
      const char = puzzleString.charAt(position);
      if (char === '_') {
        row.push(null);
      } else {
        const int = parseInt(char);
        if (isNaN(int)) {
          throw new Error(`Puzzle contains invalid character. (${char})`);
        }
        row.push(int);
      }
    }
    puzzle.push(row);
  }

  return puzzle;
}

// Check if any value in testSet exists in remaining
function checkSetDoesNotExist(remaining, testSet) {
  for (var s of testSet) {
    if (remaining.has(s)) {
      return false;
    }
  }

  return true;
}

// Generates a default puzzle for testing
// https://dingo.sbs.arizona.edu/~sandiway/sudoku/examples.html (Second example)
function getDefaultPuzzle() {
  return '152489376' +
    '739256841' +
    '468371295' +
    '387124659' +
    '591763428' +
    '246895713' +
    '914637582' +
    '625948137' +
    '873512964';
}

module.exports = {
  convertStringToPuzzle: convertStringToPuzzle,
  checkSetDoesNotExist: checkSetDoesNotExist,
  getDefaultPuzzle: getDefaultPuzzle
};
