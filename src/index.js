const db = require('./db');
const generator = require('./generator');
const manipulator = require('./manipulator');

const levels = {
  simple: {
    grids: 33,
    intelligence: 2,
    filename: 'simple.txt'
  },
  easy: {
    grids: 41,
    intelligence: 3,
    filename: 'easy.txt'
  },
  medium: {
    grids: 51,
    intelligence: 4,
    filename: 'medium.txt'
  },
  hard: {
    grids: 54,
    intelligence: 10,
    filename: 'hard.txt'
  },
  expert: {
    grids: 55,
    intelligence: 10,
    filename: 'expert.txt'
  }
};

const difficulty = process.argv[2];
const level = levels[process.argv[2]];
/* if (!fs.existsSync(folder)) {
  fs.mkdirSync(folder);
}
const filename = `${folder}/${level.filename}`;
if (!fs.existsSync(filename)) {
  fs.openSync(filename, 'w');
} */

var totalPuzzles = 1;
var successfulPuzzles = 1;

db.getCount(difficulty)
  .then(currentCount => {
    const puzzlesToStore = [];

    while (successfulPuzzles <= 5) {
      const puzzle = generator.generate();
      const result = manipulator.remove(puzzle, level.grids, level.intelligence, difficulty);

      if (result) {
        console.log(`Found puzzle #${successfulPuzzles}. Attempt #${totalPuzzles}`);
        puzzlesToStore.push(convertToPuzzleString(result.puzzle));
        // printToFile(result.puzzle, filename);
        successfulPuzzles++;
      } else {
        console.log(`Failed puzzle #${successfulPuzzles}. Attempt #${totalPuzzles}.`);
      }
      totalPuzzles++;
    }

    return db.createPuzzles(difficulty, currentCount, puzzlesToStore)
      .then(() => {
        return db.updatePuzzleData(difficulty, successfulPuzzles - 1);
      });
  })
  .catch(err => {
    return db.updatePuzzleData(difficulty, successfulPuzzles - 1)
      .then(() => {
        console.log(err);
        throw err;
      });
  });

function convertToPuzzleString(puzzle) {
  const values = [];
  for (var i = 0; i < 9; i++) {
    for (var j = 0; j < 9; j++) {
      if (puzzle[i][j] != null) {
        values.push(`${puzzle[i][j]}`);
      } else {
        values.push('_');
      }
    }
  }

  return values.join('');
}

/* function printToFile(puzzle, filename) {
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
} */
