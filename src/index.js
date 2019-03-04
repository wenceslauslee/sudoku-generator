const fs = require('fs');
const generator = require('./generator');
const manipulator = require('./manipulator');

// 35, 2 for simple easy
// 40, 3 for easy

var totalPuzzles = 1;
while (totalPuzzles <= 50) {
  const puzzle = generator.generate();

  const result = manipulator.remove(puzzle, 50, 3);

  if (result) {
    console.log(`Found puzzle #${totalPuzzles}.`);
    totalPuzzles++;
    printToFile(result);
  } else {
    console.log(`Failed puzzle attempt #${totalPuzzles}.`);
  }
}

function printToFile(puzzle) {
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
  fs.appendFileSync('/Users/wences/Desktop/sudoku/output/simple.txt', rows.join(''));
}
