const fs = require('fs');
const generator = require('./generator');
const manipulator = require('./manipulator');

const levels = {
  one: {
    grids: 33,
    intelligence: 2,
    filename: 'simple.txt'
  },
  two: {
    grids: 41,
    intelligence: 3,
    filename: 'easy.txt'
  },
  three: {
    grids: 51,
    intelligence: 4,
    filename: 'medium.txt'
  }
};
const folder = 'output';

var totalPuzzles = 1;
var level = levels[process.argv[2]];
if (!fs.existsSync(folder)) {
  fs.mkdirSync(folder);
}
const filename = `${folder}/${level.filename}`;
if (!fs.existsSync(filename)) {
  fs.openSync(filename, 'w');
}
while (totalPuzzles <= 50) {
  const puzzle = generator.generate();

  const result = manipulator.remove(puzzle, level.grids, level.intelligence);

  if (result) {
    console.log(`Found puzzle #${totalPuzzles}.`);
    totalPuzzles++;
    printToFile(result.puzzle, filename);
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
