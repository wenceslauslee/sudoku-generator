const fs = require('fs');
const generator = require('./generator');
const manipulator = require('./manipulator');

const levels = {
  one: {
    grids: 33,
    intelligence: 2,
    filename: '/Users/wences/Desktop/sudoku/output/simple.txt'
  },
  two: {
    grids: 41,
    intelligence: 3,
    filename: '/Users/wences/Desktop/sudoku/output/easy.txt'
  }
}

// 35, 2 for simple easy
// 40, 3 for easy

var totalPuzzles = 1;
var level = levels.two;
while (totalPuzzles <= 50) {
  const puzzle = generator.generate();

  const result = manipulator.remove(puzzle, level.grids, level.intelligence);

  if (result) {
    console.log(`Found puzzle #${totalPuzzles}.`);
    console.log(result.operations);
    totalPuzzles++;
    printToFile(result.puzzle, level.filename);
  } else {
    console.log(`Failed puzzle attempt #${totalPuzzles}.`);
  }
}

function printToFile(puzzle, filename) {
  const rows = [];
  for (var i = 0; i < 9; i++) {
    const row = [];
    for (var j = 0; j < 9; j++) {
      if (puzzle[i][j] != null) {
        row.push(`${puzzle[i][j]}`);
      } else {
        row.push('_');
      }
    }
    rows.push(row.join('') + '\n');
  }
  rows.push('---------\n');
  fs.appendFileSync(filename, rows.join(''));
}
